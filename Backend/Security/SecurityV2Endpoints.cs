using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

namespace Msst.Backend.Security;

public sealed class CredentialHasher
{
    public string Hash(string password, SecurityPolicy policy)
    {
        var salt = RandomNumberGenerator.GetBytes(32);
        var key = Rfc2898DeriveBytes.Pbkdf2(password, salt, policy.Pbkdf2Iterations, HashAlgorithmName.SHA512, 64);
        return $"PBKDF2-SHA512$v1${policy.Pbkdf2Iterations}${Convert.ToBase64String(salt)}${Convert.ToBase64String(key)}";
    }
    public bool Verify(string password, string? encoded)
    {
        if (string.IsNullOrEmpty(encoded)) return false;
        var p = encoded.Split('$');
        if (p.Length != 5 || p[0] != "PBKDF2-SHA512" || p[1] != "v1" ||
            !int.TryParse(p[2], out var iterations) || iterations < 100000 || iterations > 5000000) return false;
        try {
            var salt = Convert.FromBase64String(p[3]); var expected = Convert.FromBase64String(p[4]);
            if (salt.Length != 32 || expected.Length != 64) return false;
            var actual = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA512, expected.Length);
            return CryptographicOperations.FixedTimeEquals(actual, expected);
        } catch (FormatException) { return false; }
    }
    public bool VerifyWithDummyWork(string password, string? encoded, SecurityPolicy? policy)
    {
        if (!string.IsNullOrEmpty(encoded)) return Verify(password, encoded);
        var iterations = policy?.Pbkdf2Iterations ?? throw new InvalidOperationException("SECURITY_POLICY_UNAVAILABLE");
        _ = Rfc2898DeriveBytes.Pbkdf2(password, RandomNumberGenerator.GetBytes(32), iterations, HashAlgorithmName.SHA512, 64);
        return false;
    }
    public static string? Validate(string password, string confirmation, SecurityPolicy policy)
    {
        if (password != confirmation) return "PASSWORD_CONFIRMATION_MISMATCH";
        if (password.Length < policy.MinimumLength || password.Length > policy.MaximumLength ||
            !password.Any(char.IsUpper) || !password.Any(char.IsLower) || !password.Any(char.IsDigit) ||
            !password.Any(c => !char.IsLetterOrDigit(c))) return "PASSWORD_POLICY_FAILED";
        return null;
    }
}

public sealed class SecurityStore(ProcedureJsonClient client)
{
    public async Task<T> CallAsync<T>(string operation, int actor, int empresa, string json,
        JsonTypeInfo<T> type, CancellationToken ct) =>
        JsonSerializer.Deserialize(await client.ExecuteAsync("dbo.usp_Msst_SecurityV2", operation, actor, empresa, json, ct), type)
        ?? throw new InvalidOperationException("SECURITY_RECEIPT_INVALID");
}

public sealed class MssteCookieEvents(SecurityStore store) : CookieAuthenticationEvents
{
    public override async Task ValidatePrincipal(CookieValidatePrincipalContext context)
    {
        var p = context.Principal;
        if (p is null || !SecurityClaims.TryActor(p, out var actor, out var empresa) ||
            !Guid.TryParse(p.FindFirst(SecurityClaims.Session)?.Value, out var sessionId)) {
            context.RejectPrincipal(); return;
        }
        var stamp = p.FindFirst(SecurityClaims.Stamp)?.Value ?? "";
        var payload = JsonSerializer.Serialize(new SessionLookup(sessionId, stamp), SecurityV2JsonContext.Default.SessionLookup);
        var result = await store.CallAsync("SESSION", actor, empresa, payload,
            SecurityV2JsonContext.Default.StoreSecurityResult, context.HttpContext.RequestAborted);
        if (!result.Succeeded || result.Session is null) {
            context.RejectPrincipal();
            await context.HttpContext.SignOutAsync(SecurityClaims.Scheme);
            return;
        }
        context.ReplacePrincipal(SecurityClaims.Principal(result.Session, sessionId, stamp));
    }
    public override Task RedirectToLogin(RedirectContext<CookieAuthenticationOptions> context)
    { context.Response.StatusCode = StatusCodes.Status401Unauthorized; return Task.CompletedTask; }
    public override Task RedirectToAccessDenied(RedirectContext<CookieAuthenticationOptions> context)
    { context.Response.StatusCode = StatusCodes.Status403Forbidden; return Task.CompletedTask; }
}

public static class SecurityV2Endpoints
{
    public static IServiceCollection AddMsstSecurityV2(this IServiceCollection services, IConfiguration config)
    {
        var keysPath = PrivateStoragePaths.Required(config,"Security:DataProtectionKeysPath");
        var keys = Directory.CreateDirectory(keysPath);
        var protection=services.AddDataProtection().SetApplicationName("MSST.SecurityV2").PersistKeysToFileSystem(keys);
        if(OperatingSystem.IsWindows()) protection.ProtectKeysWithDpapi(protectToLocalMachine:false);
        services.AddSingleton<ProcedureJsonClient>(); services.AddSingleton<SecurityStore>();
        services.AddSingleton<CredentialHasher>(); services.AddScoped<MssteCookieEvents>();
        services.AddAntiforgery(o => {
            o.HeaderName = "X-CSRF-TOKEN"; o.Cookie.Name = "__Host-MsstCsrf";
            o.Cookie.HttpOnly = true; o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            o.Cookie.SameSite = SameSiteMode.Strict;
        });
        services.AddAuthentication(SecurityClaims.Scheme).AddCookie(SecurityClaims.Scheme, o => {
            o.Cookie.Name = "__Host-MsstSession"; o.Cookie.HttpOnly = true;
            o.Cookie.SecurePolicy = CookieSecurePolicy.Always; o.Cookie.SameSite = SameSiteMode.Strict;
            o.SlidingExpiration = false; o.EventsType = typeof(MssteCookieEvents);
        });
        services.AddAuthorization();
        var permitText = config["Security:LoginPermitLimit"];
        var windowText = config["Security:LoginWindowSeconds"];
        if (!int.TryParse(permitText, out var permits) || permits < 1 ||
            !int.TryParse(windowText, out var seconds) || seconds < 1)
            throw new InvalidOperationException("Configure los límites de solicitudes de login.");
        services.AddRateLimiter(o => {
            o.RejectionStatusCode = 429;
            o.AddPolicy("msst-login", ctx => RateLimitPartition.GetFixedWindowLimiter(
                ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions { PermitLimit = permits,
                    Window = TimeSpan.FromSeconds(seconds), QueueLimit = 0, AutoReplenishment = true }));
        });
        return services;
    }

    public static IEndpointRouteBuilder MapMsstSecurityV2(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/sst/security/session", SessionAsync).AllowAnonymous();
        endpoints.MapPost("/sst/security/login", LoginAsync).AllowAnonymous().RequireRateLimiting("msst-login");
        endpoints.MapPost("/sst/security/password", PasswordAsync).RequireAuthorization();
        endpoints.MapPost("/sst/security/logout", LogoutAsync).RequireAuthorization();
        endpoints.MapGet("/sst/security/accounts/{id:int}", AccountAsync).RequireAuthorization();
        endpoints.MapPost("/sst/security/provision", ProvisionAsync).RequireAuthorization();
        return endpoints;
    }

    public static async Task<bool> ValidateCsrfAsync(HttpContext context, IAntiforgery anti)
    {
        try { await anti.ValidateRequestAsync(context); return true; }
        catch (AntiforgeryValidationException) { return false; }
    }
    private static IResult Reply(HttpContext ctx, bool ok, string code, string message, int status,
        SecuritySession? session = null, string? csrf = null) =>
        Results.Json(new SecurityEnvelope(ok, code, message, ctx.TraceIdentifier, Session: session, CsrfToken: csrf),
            SecurityV2JsonContext.Default.SecurityEnvelope, statusCode: status);

    private static async Task<IResult> SessionAsync(HttpContext ctx, IAntiforgery anti, SecurityStore store)
    {
        ctx.Response.Headers.CacheControl = "no-store";
        SecuritySession? session = null;
        if (SecurityClaims.TryActor(ctx.User, out var actor, out var empresa) &&
            Guid.TryParse(ctx.User.FindFirst(SecurityClaims.Session)?.Value, out var sid)) {
            var json = JsonSerializer.Serialize(new SessionLookup(sid, ctx.User.FindFirst(SecurityClaims.Stamp)?.Value ?? ""),
                SecurityV2JsonContext.Default.SessionLookup);
            var result = await store.CallAsync("SESSION", actor, empresa, json,
                SecurityV2JsonContext.Default.StoreSecurityResult, ctx.RequestAborted);
            session = result.Succeeded ? result.Session : null;
        }
        var tokens = anti.GetAndStoreTokens(ctx);
        return Reply(ctx, true, session is null ? "SESSION_ANONYMOUS" : "SESSION_CONFIRMED",
            session is null ? "No hay una sesión activa." : "Sesión confirmada.", 200, session, tokens.RequestToken);
    }

    private static async Task<IResult> LoginAsync(HttpContext ctx, IAntiforgery anti, SecurityStore store, CredentialHasher hasher)
    {
        ctx.Response.Headers.CacheControl = "no-store";
        if (!await ValidateCsrfAsync(ctx, anti)) return Reply(ctx, false, "CSRF_INVALID", "Actualice la sesión antes de continuar.", 400);
        LoginCommand? command;
        try { command = await JsonSerializer.DeserializeAsync(ctx.Request.Body, SecurityV2JsonContext.Default.LoginCommand, ctx.RequestAborted); }
        catch (JsonException) { return Reply(ctx, false, "REQUEST_INVALID", "Solicitud inválida.", 400); }
        if (command is null || string.IsNullOrWhiteSpace(command.UserName) || command.UserName.Length > 100 ||
            string.IsNullOrEmpty(command.Password) || command.Password.Length > 1024)
            return Reply(ctx, false, "LOGIN_REJECTED", "No fue posible iniciar sesión con esas credenciales.", 401);
        var lookup = JsonSerializer.Serialize(new CredentialLookup(command.UserName), SecurityV2JsonContext.Default.CredentialLookup);
        var candidate = await store.CallAsync("LOOKUP", 0, 0, lookup, SecurityV2JsonContext.Default.LoginCandidate, ctx.RequestAborted);
        // Mantener el trabajo criptográfico aun cuando la cuenta no exista o esté bloqueada.
        var validPassword = hasher.VerifyWithDummyWork(command.Password, candidate.PasswordHash, candidate.Policy);
        var valid = candidate.Succeeded && candidate.Session is not null && candidate.Policy is not null && validPassword;
        if (candidate.Session is null || candidate.Policy is null)
            return Reply(ctx, false, "LOGIN_REJECTED", "No fue posible iniciar sesión con esas credenciales.", 401);
        var sid = Guid.NewGuid();
        var attempt = JsonSerializer.Serialize(new LoginAttempt(candidate.Session.UserId, candidate.Session.Version, valid, sid, candidate.SecurityStamp),
            SecurityV2JsonContext.Default.LoginAttempt);
        var result = await store.CallAsync("LOGIN", candidate.Session.UserId, candidate.Session.EmpresaId, attempt,
            SecurityV2JsonContext.Default.StoreSecurityResult, ctx.RequestAborted);
        if (!valid || !result.Succeeded || result.Session is null)
            return Reply(ctx, false, "LOGIN_REJECTED", "No fue posible iniciar sesión con esas credenciales.", 401);
        await ctx.SignInAsync(SecurityClaims.Scheme,
            SecurityClaims.Principal(result.Session, sid, candidate.SecurityStamp!),
            new AuthenticationProperties { IsPersistent = false, AllowRefresh = false,
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(candidate.Policy.SessionMinutes) });
        // El token CSRF anónimo anterior deja de representar la identidad autenticada.
        return Reply(ctx, true, "LOGIN_SUCCEEDED", "Sesión iniciada. Actualice el contexto de sesión.", 200, result.Session);
    }

    private static async Task<IResult> PasswordAsync(HttpContext ctx, IAntiforgery anti, SecurityStore store, CredentialHasher hasher)
    {
        if (!await ValidateCsrfAsync(ctx, anti)) return Reply(ctx, false, "CSRF_INVALID", "Actualice la sesión antes de continuar.", 400);
        if (!SecurityClaims.TryActor(ctx.User, out var actor, out var empresa)) return Results.Unauthorized();
        PasswordCommand? command;
        try { command = await JsonSerializer.DeserializeAsync(ctx.Request.Body, SecurityV2JsonContext.Default.PasswordCommand, ctx.RequestAborted); }
        catch (JsonException) { return Reply(ctx, false, "REQUEST_INVALID", "Solicitud inválida.", 400); }
        if (command is null || command.CurrentPassword is null || command.NewPassword is null || command.Confirmation is null)
            return Reply(ctx, false, "PASSWORD_FIELDS_REQUIRED", "Complete los campos de contraseña.", 422);
        var lookup = JsonSerializer.Serialize(new CredentialLookup(ctx.User.Identity?.Name ?? ""), SecurityV2JsonContext.Default.CredentialLookup);
        var candidate = await store.CallAsync("LOOKUP", actor, empresa, lookup, SecurityV2JsonContext.Default.LoginCandidate, ctx.RequestAborted);
        if (!candidate.Succeeded || candidate.Session?.UserId != actor || candidate.Policy is null ||
            !hasher.Verify(command.CurrentPassword, candidate.PasswordHash))
            return Reply(ctx, false, "CURRENT_PASSWORD_INVALID", "La contraseña actual no es válida.", 422);
        var validation = CredentialHasher.Validate(command.NewPassword, command.Confirmation, candidate.Policy);
        if (validation is not null) return Reply(ctx, false, validation,
            validation == "PASSWORD_CONFIRMATION_MISMATCH" ? "La confirmación no coincide." : "La contraseña no cumple la política vigente.", 422);
        if (hasher.Verify(command.NewPassword, candidate.PasswordHash))
            return Reply(ctx, false, "PASSWORD_REUSE_REJECTED", "La nueva contraseña debe ser diferente.", 422);
        var update = new PasswordUpdate(command.ExpectedVersion, hasher.Hash(command.NewPassword, candidate.Policy),
            Convert.ToHexString(RandomNumberGenerator.GetBytes(32)));
        var result = await store.CallAsync("PASSWORD", actor, empresa,
            JsonSerializer.Serialize(update, SecurityV2JsonContext.Default.PasswordUpdate),
            SecurityV2JsonContext.Default.StoreSecurityResult, ctx.RequestAborted);
        if (!result.Succeeded) return Reply(ctx, false, result.Code, result.Message, 409);
        await ctx.SignOutAsync(SecurityClaims.Scheme);
        return Reply(ctx, true, "PASSWORD_CHANGED", "Contraseña actualizada. Inicie sesión nuevamente.", 200);
    }

    private static async Task<IResult> AccountAsync(HttpContext ctx,SecurityStore store)
    {
        Msst.Backend.Data.RequestScope.Permission(ctx,"security:provision");
        var actor=Msst.Backend.Data.RequestScope.Require(ctx);
        if(!int.TryParse(ctx.Request.RouteValues["id"]?.ToString(),out var target)||target<=0)
            return Reply(ctx,false,"REQUEST_INVALID","Seleccione una cuenta válida.",400);
        var result=await store.CallAsync("ACCOUNT",actor.UserId,actor.EmpresaId,
            JsonSerializer.Serialize(new AccountQuery(target),SecurityV2JsonContext.Default.AccountQuery),
            SecurityV2JsonContext.Default.PublicAccountResult,ctx.RequestAborted);
        return Results.Json(new PublicAccountEnvelope(result.Succeeded,result.Code,result.Message,ctx.TraceIdentifier,result.Account),
            SecurityV2JsonContext.Default.PublicAccountEnvelope,statusCode:result.Succeeded?200:404);
    }
    private static async Task<IResult> ProvisionAsync(HttpContext ctx,IAntiforgery anti,SecurityStore store,CredentialHasher hasher)
    {
        Msst.Backend.Data.RequestScope.Permission(ctx,"security:provision");
        if(!await ValidateCsrfAsync(ctx,anti))return Reply(ctx,false,"CSRF_INVALID","Actualice la sesión antes de continuar.",400);
        var actor=Msst.Backend.Data.RequestScope.Require(ctx);
        ProvisionCommand? command;
        try{command=await JsonSerializer.DeserializeAsync(ctx.Request.Body,SecurityV2JsonContext.Default.ProvisionCommand,ctx.RequestAborted);}
        catch(JsonException){return Reply(ctx,false,"REQUEST_INVALID","Solicitud inválida.",400);}
        if(command is null||command.UserId<=0||string.IsNullOrWhiteSpace(command.ExpectedVersion)||command.Password is null||command.Confirmation is null)
            return Reply(ctx,false,"PASSWORD_FIELDS_REQUIRED","Complete la cuenta, versión y confirmación.",400);
        var lookup=JsonSerializer.Serialize(new AccountQuery(command.UserId),SecurityV2JsonContext.Default.AccountQuery);
        var account=await store.CallAsync("ACCOUNT",actor.UserId,actor.EmpresaId,lookup,SecurityV2JsonContext.Default.PublicAccountResult,ctx.RequestAborted);
        if(!account.Succeeded||account.Account is null||account.Policy is null)
            return Reply(ctx,false,"ACCOUNT_UNAVAILABLE","La cuenta no está disponible en su ámbito.",404);
        var invalid=CredentialHasher.Validate(command.Password,command.Confirmation,account.Policy);
        if(invalid is not null)return Reply(ctx,false,invalid,"La contraseña no cumple la confirmación o la política vigente.",422);
        var update=new CredentialProvision(command.UserId,command.ExpectedVersion,hasher.Hash(command.Password,account.Policy),
            Convert.ToHexString(RandomNumberGenerator.GetBytes(32)));
        var result=await store.CallAsync("PROVISION",actor.UserId,actor.EmpresaId,
            JsonSerializer.Serialize(update,SecurityV2JsonContext.Default.CredentialProvision),SecurityV2JsonContext.Default.StoreSecurityResult,ctx.RequestAborted);
        if(!result.Succeeded)return Reply(ctx,false,result.Code,result.Message,409);
        var persisted=await store.CallAsync("ACCOUNT",actor.UserId,actor.EmpresaId,lookup,SecurityV2JsonContext.Default.PublicAccountResult,ctx.RequestAborted);
        if(!persisted.Succeeded||persisted.Account is null)throw new InvalidDataException("CREDENTIAL_RECEIPT_INVALID");
        return Results.Json(new PublicAccountEnvelope(true,"CREDENTIAL_PROVISIONED","Credencial activada y sesiones anteriores revocadas.",
            ctx.TraceIdentifier,persisted.Account),SecurityV2JsonContext.Default.PublicAccountEnvelope);
    }

    private static async Task<IResult> LogoutAsync(HttpContext ctx, IAntiforgery anti, SecurityStore store)
    {
        if (!await ValidateCsrfAsync(ctx, anti)) return Reply(ctx, false, "CSRF_INVALID", "Actualice la sesión antes de continuar.", 400);
        if (SecurityClaims.TryActor(ctx.User, out var actor, out var empresa) &&
            Guid.TryParse(ctx.User.FindFirst(SecurityClaims.Session)?.Value, out var sid))
            await store.CallAsync("LOGOUT", actor, empresa, JsonSerializer.Serialize(
                new SessionLookup(sid, ctx.User.FindFirst(SecurityClaims.Stamp)?.Value ?? ""), SecurityV2JsonContext.Default.SessionLookup),
                SecurityV2JsonContext.Default.StoreSecurityResult, ctx.RequestAborted);
        await ctx.SignOutAsync(SecurityClaims.Scheme);
        return Reply(ctx, true, "LOGGED_OUT", "Sesión cerrada.", 200);
    }
}
