using System.Data;
using System.Text.Json;
using Msst.Backend.Data;
using Msst.Backend.Database;
using Msst.Backend.Evidence;
namespace Msst.Backend.Committee;
public sealed class CommitteeRepository(SqlServerAotRepository connections,ISignatureReader signatureReader)
{
    public async Task<CommitteeEnvelope> ExecuteAsync(string operation,int actorId,int empresaId,string payload,string correlationId,Guid? requestId,CancellationToken ct)
    {
        var leases=new List<IAsyncDisposable>();
        try
        {
        if(operation=="APPROVE")
        {
            var receipt=await ExecuteAsync("RECEIPT_APPROVE",actorId,empresaId,payload,correlationId,requestId,ct);
            if(receipt.Code!="COMMITTEE_RECEIPT_ABSENT")return receipt;
            var command=JsonSerializer.Deserialize(payload,CommitteeJsonContext.Default.CommitteeApproveCommand)
                ??throw new InvalidDataException("Solicitud de aprobación inválida.");
            var check=await ExecuteAsync("APPROVAL_EVIDENCE",actorId,empresaId,payload,correlationId,null,ct);
            if(!check.Succeeded)return check;
            foreach(var signatureId in command.SignatureIds)
                leases.Add(await signatureReader.VerifyAsync(actorId,empresaId,signatureId,ct));
            payload=JsonSerializer.Serialize(command with{VerifiedEvidenceIds=check.EvidenceIds,VerifiedSignatureIds=command.SignatureIds},CommitteeJsonContext.Default.CommitteeApproveCommand);
        }
        await using var connection=connections.CreateConnection();await connection.OpenAsync(ct);
        await using var sql=new SqlCommand("dbo.usp_Msst_CommitteeV2",connection){CommandType=CommandType.StoredProcedure};
        sql.Parameters.Add("@Operation",SqlDbType.VarChar,32).Value=operation;
        sql.Parameters.Add("@ActorId",SqlDbType.Int).Value=actorId;
        sql.Parameters.Add("@EmpresaId",SqlDbType.Int).Value=empresaId;
        sql.Parameters.Add("@PayloadJson",SqlDbType.NVarChar,-1).Value=payload;
        var json=await sql.ExecuteScalarAsync(ct) as string;
        var response=string.IsNullOrWhiteSpace(json)?null:JsonSerializer.Deserialize(json,CommitteeJsonContext.Default.CommitteeEnvelope);
        if(response is null || response.HttpStatus<200 || response.HttpStatus>599 || string.IsNullOrWhiteSpace(response.Code) ||
            (response.Succeeded && requestId.HasValue && response.RequestId!=requestId))
            throw new InvalidDataException("No se confirmó el resultado persistido del comité.");
        return response with{CorrelationId=correlationId};
        }
        finally { foreach(var lease in leases) await lease.DisposeAsync(); }
    }
}