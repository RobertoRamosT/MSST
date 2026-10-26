using System.Text.Json;
using System.Text.Json.Serialization;
using Msst.Backend.Data;
using Msst.Backend.Database;
using Msst.Backend.Security;
namespace Msst.Backend.Workflow;

public sealed record ClinicalOption(string Code,string Label);
public sealed record ClinicalRecord(long ClinicalRecordId,string Version,string OutcomeCode,string OutcomeLabel,
 DateOnly ExaminedOn,DateOnly ExpiresOn,string Clinic,DateTimeOffset ValidUntilUtc);
public sealed record ClinicalQuery(long? ExpedienteId,int Limit,long AfterId);
public sealed record ClinicalEnvelope(bool Succeeded,string Code,ClinicalOption[] Options,ClinicalRecord[] Records);
[JsonSourceGenerationOptions(PropertyNamingPolicy=JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(ClinicalQuery))]
[JsonSerializable(typeof(ClinicalEnvelope))]
internal partial class ClinicalJsonContext:JsonSerializerContext;

public static class ClinicalWorkflowEndpoints
{
 public static void MapClinicalWorkflow(this IEndpointRouteBuilder endpoints)
 {
  endpoints.MapGet("/sst/workflow/v2/effect-options",(RequestDelegate)(ctx=>Read(ctx,"OPTIONS"))).RequireAuthorization();
  endpoints.MapGet("/sst/workflow/v2/expedientes/{id:long}/clinical-records",(RequestDelegate)(ctx=>Read(ctx,"RECORDS"))).RequireAuthorization();
 }
 private static async Task Read(HttpContext ctx,string operation)
 {
  var actor=RequestScope.Require(ctx);
  RequestScope.Permission(ctx,operation=="OPTIONS"?"workflow:configure":"workflow:verify");
  if(operation=="RECORDS")RequestScope.Permission(ctx,"medical:read");
  var config=ctx.RequestServices.GetRequiredService<IConfiguration>();
  if(!int.TryParse(config["Data:DefaultPageSize"],out var limit)||limit<1||limit>200)
   throw new InvalidOperationException("Configure Data:DefaultPageSize entre 1 y 200 para la consulta clínica.");
  long? id=long.TryParse(Convert.ToString(ctx.Request.RouteValues["id"]),out var value)&&value>0?value:null;
  long after=0;
  if(ctx.Request.Query.TryGetValue("afterId",out var raw)&&(!long.TryParse(raw,out after)||after<0))
   throw new ApiDomainException(400,"CLINICAL_PAGE_INVALID","Vuelva al inicio de las evaluaciones clínicas.");
  try{
   var json=await ctx.RequestServices.GetRequiredService<ProcedureJsonClient>().ExecuteAsync(
    "dbo.usp_Msst_ClinicalWorkflowV2",operation,actor.UserId,actor.EmpresaId,
    JsonSerializer.Serialize(new ClinicalQuery(id,limit,after),ClinicalJsonContext.Default.ClinicalQuery),ctx.RequestAborted);
   var result=JsonSerializer.Deserialize(json,ClinicalJsonContext.Default.ClinicalEnvelope)
    ??throw new InvalidDataException("La consulta clínica no confirmó su resultado.");
   if(!result.Succeeded||result.Options is null||result.Records is null)
    throw new InvalidDataException("La consulta clínica no confirmó su contrato.");
   await Results.Json(result,ClinicalJsonContext.Default.ClinicalEnvelope).ExecuteAsync(ctx);
  }catch(SqlException ex)when(ex.Number==51000){
   throw new ApiDomainException(403,"CLINICAL_CONTEXT_REQUIRED","La consulta requiere un expediente visible y un profesional vigente con los permisos correspondientes.");
  }
 }
}
