using System.Text.Json;
using System.Text.Json.Serialization;
using Msst.Backend.Data;
using Msst.Backend.Security;
namespace Msst.Backend.Evidence;
public sealed record EvidenceReservation(string StorageKey,Guid LeaseToken);
internal sealed record ReservationCommand(string? StorageKey=null,Guid? LeaseToken=null,string? Kind=null,Guid? RequestId=null);
internal sealed record ReservationReply(bool Succeeded,EvidenceReservation[] Items);
public sealed record ReconciliationReceipt(bool Succeeded,int Removed,string Message);
[JsonSourceGenerationOptions(PropertyNamingPolicy=JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(ReservationCommand))]
[JsonSerializable(typeof(ReservationReply))]
[JsonSerializable(typeof(ReconciliationReceipt))]
internal partial class ReservationJsonContext:JsonSerializerContext;
public sealed class EvidenceReservations(ProcedureJsonClient client)
{
 private async Task<ReservationReply> Call(string operation,int actor,int empresa,ReservationCommand data,CancellationToken ct)
 {
  var raw=await client.ExecuteAsync("dbo.usp_Msst_EvidenceReservationV2",operation,actor,empresa,
   JsonSerializer.Serialize(data,ReservationJsonContext.Default.ReservationCommand),ct);
  var result=JsonSerializer.Deserialize(raw,ReservationJsonContext.Default.ReservationReply);
  return result is {Succeeded:true,Items:not null}?result:throw new InvalidDataException("La reserva no fue confirmada.");
 }
 public async Task<EvidenceReservation> Reserve(int actor,int empresa,string requestId,bool signature,CancellationToken ct)
 {
  var reservation=new EvidenceReservation(Guid.NewGuid().ToString("N"),Guid.NewGuid());
  if(!Guid.TryParse(requestId,out var request)||request==Guid.Empty)throw new ApiDomainException(422,"REQUEST_ID_INVALID","Indique una intención válida.");
  await Call("RESERVE",actor,empresa,new(reservation.StorageKey,reservation.LeaseToken,signature?"SIGNATURE":"FILE",request),ct);
  return reservation;
 }
 public async Task<int> Reconcile(int actor,int empresa,EvidenceByteStore bytes,CancellationToken ct)
 {
  var result=await Call("CLAIM",actor,empresa,new(LeaseToken:Guid.NewGuid()),ct);
  var count=0;
  foreach(var item in result.Items)
  {
   ct.ThrowIfCancellationRequested();
   bytes.DeleteRedundant(item.StorageKey);
   await Call("REMOVED",actor,empresa,new(item.StorageKey,item.LeaseToken),ct);count++;
  }
  return count;
 }
 public static void MapEndpoints(IEndpointRouteBuilder endpoints)
 {
  endpoints.MapPost("/sst/evidence/reconciliation",(RequestDelegate)(async ctx=>{
   var actor=RequestScope.Require(ctx);RequestScope.Permission(ctx,"evidence:reconcile");
   var removed=await ctx.RequestServices.GetRequiredService<EvidenceReservations>().Reconcile(actor.UserId,actor.EmpresaId,
    ctx.RequestServices.GetRequiredService<EvidenceByteStore>(),ctx.RequestAborted);
   await Results.Json(new ReconciliationReceipt(true,removed,"La reconciliación conservó archivos referenciados y reservas vigentes; retiró solo las reservas abandonadas confirmadas."),
    ReservationJsonContext.Default.ReconciliationReceipt).ExecuteAsync(ctx);
  })).RequireAuthorization();
 }
}
