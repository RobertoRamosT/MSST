using System.Security.Claims;
using System.Text.Json.Serialization;

namespace Msst.Backend.Security;

public sealed record SecuritySession(int UserId, string UserName, int EmpresaId, string? UsuarioNombre,
    string? EmpresaNombre, string? PerfilNombre, int? ContratistaId, string Version, string[] Permissions);
public sealed record SecurityPolicy(int MinimumLength, int MaximumLength, int Pbkdf2Iterations,
    int FailureLimit, int LockMinutes, int SessionMinutes);
public sealed record LoginCommand(string UserName, string Password);
public sealed record PasswordCommand(string CurrentPassword, string NewPassword, string Confirmation, string ExpectedVersion);
public sealed record CredentialLookup(string UserName);
public sealed record LoginCandidate(bool Succeeded, string Code, string? PasswordHash, string? SecurityStamp,
    SecuritySession? Session, SecurityPolicy? Policy);
public sealed record LoginAttempt(int UserId, string ExpectedVersion, bool Valid, Guid SessionId, string? SecurityStamp);
public sealed record PasswordUpdate(string ExpectedVersion, string PasswordHash, string SecurityStamp);
public sealed record SessionLookup(Guid SessionId, string SecurityStamp);
public sealed record SecurityEnvelope(bool Succeeded, string Code, string Message, string CorrelationId,
    string? RequestId = null, SecuritySession? Session = null, string? CsrfToken = null);
public sealed record StoreSecurityResult(bool Succeeded, string Code, string Message,
    SecuritySession? Session = null, SecurityPolicy? Policy = null);
public sealed record CredentialProvision(int UserId, string ExpectedVersion, string PasswordHash, string SecurityStamp);

public sealed record PublicSecurityAccount(int UserId,string UserName,string Version,string CredentialState);
public sealed record AccountQuery(int UserId);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record ProvisionCommand(int UserId,string ExpectedVersion,string Password,string Confirmation);
public sealed record PublicAccountResult(bool Succeeded,string Code,string Message,PublicSecurityAccount? Account,SecurityPolicy? Policy);
public sealed record PublicAccountEnvelope(bool Succeeded,string Code,string Message,string CorrelationId,PublicSecurityAccount? Account);

public static class SecurityClaims
{
    public const string Scheme = "MsstSession";
    public const string Empresa = "msst:empresa_id";
    public const string Session = "msst:session_id";
    public const string Stamp = "msst:security_stamp";
    public const string Permission = "msst:permission";
    public static ClaimsPrincipal Principal(SecuritySession session, Guid sessionId, string stamp)
    {
        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, session.UserId.ToString(System.Globalization.CultureInfo.InvariantCulture)),
            new(ClaimTypes.Name, session.UserName),
            new(Empresa, session.EmpresaId.ToString(System.Globalization.CultureInfo.InvariantCulture)),
            new(Session, sessionId.ToString()), new(Stamp, stamp)
        };
        if(session.ContratistaId is int contractor) claims.Add(new Claim("msst:contratista_id",contractor.ToString(System.Globalization.CultureInfo.InvariantCulture)));
        claims.AddRange(session.Permissions.Select(p => new Claim(Permission, p)));
        return new ClaimsPrincipal(new ClaimsIdentity(claims, Scheme));
    }
    public static bool TryActor(ClaimsPrincipal principal, out int actorId, out int empresaId)
    {
        actorId = 0; empresaId = 0;
        return int.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out actorId) &&
            int.TryParse(principal.FindFirstValue(Empresa), out empresaId) && actorId > 0 && empresaId > 0;
    }
}

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(PublicAccountResult))]
[JsonSerializable(typeof(PublicAccountEnvelope))]
[JsonSerializable(typeof(AccountQuery))]
[JsonSerializable(typeof(ProvisionCommand))]
[JsonSerializable(typeof(LoginCommand))]
[JsonSerializable(typeof(PasswordCommand))]
[JsonSerializable(typeof(CredentialLookup))]
[JsonSerializable(typeof(LoginCandidate))]
[JsonSerializable(typeof(LoginAttempt))]
[JsonSerializable(typeof(PasswordUpdate))]
[JsonSerializable(typeof(SessionLookup))]
[JsonSerializable(typeof(SecurityEnvelope))]
[JsonSerializable(typeof(StoreSecurityResult))]
[JsonSerializable(typeof(CredentialProvision))]
public partial class SecurityV2JsonContext : JsonSerializerContext;
