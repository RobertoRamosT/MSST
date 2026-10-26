using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using Msst.Backend.Data;
using Msst.Backend.Security;

namespace Msst.Backend.Access;

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record AccessEvaluationRequest([property:JsonRequired]string SubjectType, [property:JsonRequired]string Direction, long? SubjectId = null,
    string? Identifier = null, int? ProjectId = null, int? ZoneId = null);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record AccessRegistrationRequest([property:JsonRequired]Guid DecisionId, [property:JsonRequired]string ExpectedVersion, [property:JsonRequired]Guid IdempotencyKey);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record AccessFactRule([property:JsonRequired]string SubjectType,[property:JsonRequired]string FactCode,[property:JsonRequired]string Operator,[property:JsonRequired]string[] ExpectedValues,[property:JsonRequired]string Message);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record AccessWorkflowRule([property:JsonRequired]string SubjectType,[property:JsonRequired]string CodigoCaso,[property:JsonRequired]string Subtipo,[property:JsonRequired]string RequiredState,[property:JsonRequired]string Message);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record AccessZoneDraft(int? ZoneId,[property:JsonRequired]string Label,[property:JsonRequired]bool Enabled);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record AccessPolicyRequest([property:JsonRequired]Guid IdempotencyKey,[property:JsonRequired]string? ExpectedVersion,[property:JsonRequired]bool Enabled,
    [property:JsonRequired]int TtlSeconds,[property:JsonRequired]bool RequireProject,[property:JsonRequired]bool RequireZone,[property:JsonRequired]AccessFactRule[] Rules,
    [property:JsonRequired]AccessWorkflowRule[] WorkflowRules,[property:JsonRequired]AccessZoneDraft[] Zones);
public sealed record AccessItem(int Id, string Label);
public sealed record AccessCode(string Code, string Label);
public sealed record AccessSubjectType(string Code,string Label,string WorkflowSubjectType);
public sealed record AccessFactDefinition(string SubjectType,string Code,string Label,AccessCode[] Operators,AccessCode[] Values);
public sealed record AccessDecision(Guid DecisionId, bool Habilitado, string[] Motivos, DateTimeOffset ExpiresAt,
    string Version, string SubjectLabel, string EmpresaNombre, string SubjectType, long SubjectId,
    int? ProjectId, int? ZoneId, string Direction);
public sealed record AccessRecord(long Id, string DocumentoOPlaca, string Nombre, string Garita, string Movimiento,
    bool Autorizado, string Observacion, string Vigilante, DateTimeOffset FechaRegistro, string Version);
public sealed record AccessSnapshot(AccessRecord Record, string Version);
public sealed record AccessPolicyView(bool Enabled, int TtlSeconds, bool RequireProject, bool RequireZone,
    string Version, AccessFactRule[] Rules, AccessWorkflowRule[] WorkflowRules, AccessZoneDraft[] Zones);
public sealed record AccessEnvelope
{
    public bool Succeeded { get; init; }
    public string Code { get; init; } = "";
    public string Message { get; init; } = "";
    public string CorrelationId { get; init; } = "";
    public Guid? RequestId { get; init; }
    public int HttpStatus { get; init; }
    public AccessDecision? Decision { get; init; }
    public AccessSnapshot? Snapshot { get; init; }
    public AccessPolicyView? Policy { get; init; }
    public AccessItem[] Projects { get; init; } = [];
    public AccessItem[] Zones { get; init; } = [];
    public AccessCode[] Directions { get; init; } = [];
    public AccessSubjectType[] SubjectTypes { get; init; } = [];
    public AccessFactDefinition[] Facts {get;init;} = [];
}
[JsonSourceGenerationOptions(PropertyNamingPolicy=JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(AccessEvaluationRequest))]
[JsonSerializable(typeof(AccessRegistrationRequest))]
[JsonSerializable(typeof(AccessPolicyRequest))]
[JsonSerializable(typeof(AccessEnvelope))]
internal partial class AccessJsonContext:JsonSerializerContext;

public static class AccessEndpoints
{
    public static IServiceCollection AddAccessV2(this IServiceCollection services) => services;
    public static void MapAccessV2(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/sst/access/evaluate",(RequestDelegate)(c=>Execute(c,"EVALUATE"))).RequireAuthorization();
        endpoints.MapPost("/sst/access/register",(RequestDelegate)(c=>Execute(c,"REGISTER"))).RequireAuthorization();
        endpoints.MapGet("/sst/access/catalogs",(RequestDelegate)(c=>Execute(c,"CATALOG"))).RequireAuthorization();
        endpoints.MapGet("/sst/access/policy",(RequestDelegate)(c=>Execute(c,"POLICY"))).RequireAuthorization();
        endpoints.MapPut("/sst/access/policy",(RequestDelegate)(c=>Execute(c,"SAVE_POLICY"))).RequireAuthorization();
    }
    private static void ValidateVersion(string? version)
    {
        Span<byte> bytes=stackalloc byte[8];
        if(string.IsNullOrWhiteSpace(version)||!Convert.TryFromBase64String(version,bytes,out var written)||written!=8)
            throw new ApiDomainException(400,"ACCESS_VERSION_INVALID","La versión de acceso no es válida. Vuelva a consultar los datos.");
    }
    private static async Task Execute(HttpContext context,string operation)
    {
        var actor=RequestScope.Require(context);
        var permission=operation is "POLICY" or "SAVE_POLICY"?"access:configure":operation=="REGISTER"?"access:register":"access:evaluate";
        if(operation=="CATALOG"){
            RequestScope.Require(context);
            if(!context.User.HasClaim(SecurityClaims.Permission,"access:evaluate") && !context.User.HasClaim(SecurityClaims.Permission,"access:configure"))
                throw new ApiDomainException(403,"PERMISSION_REQUIRED","Su usuario no tiene permiso vigente para consultar estos catálogos.");
        } else RequestScope.Permission(context,permission);
        var json="{}";
        try
        {
            if(operation=="EVALUATE")
            {
                var request=await JsonSerializer.DeserializeAsync(context.Request.Body,AccessJsonContext.Default.AccessEvaluationRequest,context.RequestAborted);
                if(request is null || string.IsNullOrWhiteSpace(request.SubjectType) || string.IsNullOrWhiteSpace(request.Direction) ||
                    (request.SubjectId is null && string.IsNullOrWhiteSpace(request.Identifier)) ||
                    request.SubjectId is <=0 || request.ProjectId is <=0 || request.ZoneId is <=0 ||
                    request.SubjectId is not null && !string.IsNullOrWhiteSpace(request.Identifier))
                    throw new ApiDomainException(400,"ACCESS_FIELDS_REQUIRED","Indique un sujeto real y el movimiento.");
                json=JsonSerializer.Serialize(request,AccessJsonContext.Default.AccessEvaluationRequest);
            }
            else if(operation=="REGISTER")
            {
                var request=await JsonSerializer.DeserializeAsync(context.Request.Body,AccessJsonContext.Default.AccessRegistrationRequest,context.RequestAborted);
                if(request is null || request.DecisionId==Guid.Empty || request.IdempotencyKey==Guid.Empty || string.IsNullOrWhiteSpace(request.ExpectedVersion))
                    throw new ApiDomainException(400,"ACCESS_FIELDS_REQUIRED","Indique decisión, versión y operación.");
                ValidateVersion(request.ExpectedVersion);
                json=JsonSerializer.Serialize(request,AccessJsonContext.Default.AccessRegistrationRequest);
            }
            else if(operation=="SAVE_POLICY")
            {
                var request=await JsonSerializer.DeserializeAsync(context.Request.Body,AccessJsonContext.Default.AccessPolicyRequest,context.RequestAborted);
                if(request is null || request.IdempotencyKey==Guid.Empty || request.Rules is null || request.WorkflowRules is null || request.Zones is null)
                    throw new ApiDomainException(400,"ACCESS_POLICY_INVALID","Complete la política y sus requisitos.");
                if(request.ExpectedVersion is not null)ValidateVersion(request.ExpectedVersion);
                json=JsonSerializer.Serialize(request,AccessJsonContext.Default.AccessPolicyRequest);
            }
        }
        catch(JsonException) { throw new ApiDomainException(400,"REQUEST_JSON_INVALID","La solicitud contiene datos inválidos."); }
        var client=context.RequestServices.GetRequiredService<ProcedureJsonClient>();
        var raw=await client.ExecuteAsync("dbo.usp_Msst_AccessV2",operation,actor.UserId,actor.EmpresaId,json,context.RequestAborted);
        var response=JsonSerializer.Deserialize(raw,AccessJsonContext.Default.AccessEnvelope) ??
            throw new InvalidDataException("ACCESS_RECEIPT_INVALID");
        response=response with { CorrelationId=context.TraceIdentifier };
        context.Response.StatusCode=response.HttpStatus is >=400 and <=599?response.HttpStatus:response.Succeeded?200:422;
        await Results.Json(response,AccessJsonContext.Default.AccessEnvelope,statusCode:context.Response.StatusCode).ExecuteAsync(context);
    }
}
