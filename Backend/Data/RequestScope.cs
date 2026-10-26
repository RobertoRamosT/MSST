using System.Security.Claims;
using System.Text.Json;
using Msst.Backend.Security;

namespace Msst.Backend.Data;

public sealed class ApiDomainException(int status, string code, string message) : Exception(message)
{
    public int Status { get; } = status;
    public string Code { get; } = code;
}
public sealed record RequestActor(int UserId, int EmpresaId, int? ContratistaId);
public static class RequestScope
{
    public static RequestActor Require(HttpContext? context)
    {
        if (context?.User.Identity?.IsAuthenticated != true ||
            !SecurityClaims.TryActor(context.User, out var user, out var empresa))
            throw new ApiDomainException(401, "AUTH_REQUIRED", "Inicie sesión para continuar.");
        var contractorText = context.User.FindFirst("msst:contratista_id")?.Value;
        return new(user, empresa, int.TryParse(contractorText, out var contractor) && contractor > 0 ? contractor : null);
    }
    public static void Permission(HttpContext? context, string code)
    {
        Require(context);
        if (context!.User.HasClaim(SecurityClaims.Permission, code)) return;
        throw new ApiDomainException(403, "PERMISSION_REQUIRED", "Su usuario no tiene permiso vigente para esta operación.");
    }
    public static void CheckPayloadScope(JsonElement payload, RequestActor actor)
    {
        if (payload.ValueKind != JsonValueKind.Object)
            throw new ApiDomainException(400, "REQUEST_JSON_INVALID", "La solicitud debe ser un objeto JSON.");
        foreach (var field in new[] { "idEmpresa", "empresaId", "idCompany" })
            if (payload.TryGetProperty(field, out var value) && (!TryId(value, out var id) || id != actor.EmpresaId))
                throw new ApiDomainException(403, "CONTEXT_SCOPE_INVALID", "El contexto solicitado no está autorizado.");
        foreach (var field in new[] { "idContratista", "contratistaId" })
            if (actor.ContratistaId.HasValue && payload.TryGetProperty(field, out var value) &&
                (!TryId(value, out var id) || id != actor.ContratistaId))
                throw new ApiDomainException(403, "CONTEXT_SCOPE_INVALID", "La contratista solicitada no está autorizada.");
    }
    private static bool TryId(JsonElement value, out int result) =>
        value.ValueKind == JsonValueKind.Number ? value.TryGetInt32(out result) :
        int.TryParse(value.ValueKind == JsonValueKind.String ? value.GetString() : null, out result);
}
