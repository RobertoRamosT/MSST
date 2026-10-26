using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Antiforgery;
using Msst.Backend.Data;

namespace Msst.Backend.Security;
public sealed record PermissionSelection(string Code,bool Enabled);
public sealed record PermissionDisplay(string Code,string Label,bool Enabled);
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record ProfilePermissionUpdate(
 [property:JsonRequired] Guid IdempotencyKey,
 [property:JsonRequired] string ExpectedVersion,
 [property:JsonRequired] PermissionSelection[] Permissions);
public sealed record PermissionPayload(int ProfileId,Guid? IdempotencyKey=null,string? ExpectedVersion=null,PermissionSelection[]? Permissions=null);
public sealed record PermissionEnvelope(bool Succeeded,string Code,string Message,string? CorrelationId=null,
 Guid? RequestId=null,int? ProfileId=null,string? Version=null,PermissionDisplay[]? Permissions=null);
[JsonSourceGenerationOptions(PropertyNamingPolicy=JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(ProfilePermissionUpdate))]
[JsonSerializable(typeof(PermissionPayload))]
[JsonSerializable(typeof(PermissionEnvelope))]
public partial class PermissionJsonContext:JsonSerializerContext;

public static class PermissionEndpoints
{
 public static IEndpointRouteBuilder MapPermissionV2(this IEndpointRouteBuilder endpoints)
 {
  endpoints.MapGet("/sst/security/profiles/{id:int}/permissions",GetAsync).RequireAuthorization();
  endpoints.MapPut("/sst/security/profiles/{id:int}/permissions",PutAsync).RequireAuthorization();
  return endpoints;
 }
 private static async Task<IResult> GetAsync(int id,HttpContext ctx,ProcedureJsonClient client)
 {
  RequestScope.Permission(ctx,"security:permissions");
  var actor=RequestScope.Require(ctx);
  if(id<=0)return Reply(ctx,new(false,"REQUEST_INVALID","Seleccione un perfil válido."),400);
  var result=await ExecuteAsync("GET",actor.UserId,actor.EmpresaId,new(id),client,ctx.RequestAborted);
  ctx.Response.Headers.CacheControl="no-store";
  return Reply(ctx,result,result.Succeeded?200:404);
 }
 private static async Task<IResult> PutAsync(int id,HttpContext ctx,IAntiforgery anti,ProcedureJsonClient client)
 {
  RequestScope.Permission(ctx,"security:permissions");
  var actor=RequestScope.Require(ctx);
  if(!await SecurityV2Endpoints.ValidateCsrfAsync(ctx,anti))
   return Reply(ctx,new(false,"CSRF_INVALID","Actualice la sesión antes de continuar."),400);
  ProfilePermissionUpdate? command;
  try{command=await JsonSerializer.DeserializeAsync(ctx.Request.Body,PermissionJsonContext.Default.ProfilePermissionUpdate,ctx.RequestAborted);}
  catch(JsonException){return Reply(ctx,new(false,"REQUEST_INVALID","La solicitud de permisos no es válida."),400);}
  if(id<=0||command is null||command.IdempotencyKey==Guid.Empty||string.IsNullOrWhiteSpace(command.ExpectedVersion)||command.Permissions is null||
   command.Permissions.Any(x=>x is null||string.IsNullOrWhiteSpace(x.Code)))
   return Reply(ctx,new(false,"REQUEST_INVALID","Complete perfil, intención, versión y permisos."),422);
  var result=await ExecuteAsync("PUT",actor.UserId,actor.EmpresaId,
   new(id,command.IdempotencyKey,command.ExpectedVersion,command.Permissions),client,ctx.RequestAborted);
  return Reply(ctx,result,result.Succeeded?200:409);
 }
 private static async Task<PermissionEnvelope> ExecuteAsync(string operation,int actor,int empresa,
 PermissionPayload payload,ProcedureJsonClient client,CancellationToken ct)
 {
  var raw=await client.ExecuteAsync("dbo.usp_Msst_ProfilePermissions",operation,actor,empresa,
   JsonSerializer.Serialize(payload,PermissionJsonContext.Default.PermissionPayload),ct);
  return JsonSerializer.Deserialize(raw,PermissionJsonContext.Default.PermissionEnvelope)
   ??throw new InvalidDataException("PROFILE_PERMISSION_RECEIPT_INVALID");
 }
 private static IResult Reply(HttpContext ctx,PermissionEnvelope result,int status)=>
  Results.Json(result with{CorrelationId=ctx.TraceIdentifier},PermissionJsonContext.Default.PermissionEnvelope,statusCode:status);
}
