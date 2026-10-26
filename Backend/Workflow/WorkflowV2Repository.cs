using System.Data;
using System.Security.Cryptography;
using System.Text.Json;
using Msst.Backend.Data;
using Msst.Backend.Database;
using Msst.Backend.Evidence;

namespace Msst.Backend.Workflow;

public sealed class WorkflowV2Repository(SqlServerAotRepository connections, IEvidenceReader evidenceReader, ISignatureReader signatureReader)
{
    public async Task<WorkflowV2Envelope> ExecuteAsync(string operation, WorkflowV2Actor actor,
        string payloadJson, string correlationId, Guid? expectedRequestId, CancellationToken ct)
    {
        var fileLeases = new List<Stream>();
        var signatureLeases = new List<IAsyncDisposable>();
        try
        {
        if(operation is "PROOF" or "ACTION")
        {
            var receipt=await ExecuteAsync("RECEIPT_"+operation,actor,payloadJson,correlationId,expectedRequestId,ct);
            if(receipt.Code!="WF_RECEIPT_ABSENT")return receipt;
        }
        // El estado de verificación se crea en el servidor después de comprobar bytes reales.
        // El contrato público rechaza verifiedEvidenceIds; solo estos comandos internos lo contienen.
        if (operation == "PROOF")
        {
            var request = JsonSerializer.Deserialize(payloadJson, WorkflowV2JsonContext.Default.WorkflowV2ProofCommand)
                ?? throw new InvalidDataException("Solicitud de evaluación inválida.");
            await VerifyFilesAsync(actor, request.EvidenceIds, fileLeases, ct);
            var signatureIds=request.Decision=="APPROVED" && request.SignatureId.HasValue ? new[]{request.SignatureId.Value} : [];
            await VerifySignaturesAsync(actor,signatureIds,signatureLeases,ct);
            payloadJson = JsonSerializer.Serialize(request with { VerifiedEvidenceIds = request.EvidenceIds, VerifiedSignatureIds=signatureIds },
                WorkflowV2JsonContext.Default.WorkflowV2ProofCommand);
        }
        if (operation == "ACTION")
        {
            var request = JsonSerializer.Deserialize(payloadJson, WorkflowV2JsonContext.Default.WorkflowV2ActionCommand)
                ?? throw new InvalidDataException("Solicitud de acción inválida.");
            var detailPayload = JsonSerializer.Serialize(new WorkflowV2Query(request.ExpedienteId,null,null,null,null,null,null,null),
                WorkflowV2JsonContext.Default.WorkflowV2Query);
            var detail = await ExecuteAsync("DETAIL",actor,detailPayload,correlationId,null,ct);
            if (!detail.Succeeded) return detail;
            var selectedAction = detail.Snapshot?.Actions.SingleOrDefault(action => action.ActionCode == request.ActionCode);
            var ids = (detail.Snapshot?.Requirements.Where(requirement => selectedAction?.RequiresVerifiedRequirements == true &&
                    requirement.Mandatory && requirement.Status == "VERIFIED" &&
                    (selectedAction.IsFinal || requirement.StageCode == detail.Snapshot.StageCode))
                .SelectMany(requirement => requirement.EvidenceIds) ?? [])
                .Concat(request.EvidenceIds).Distinct().ToArray();
            await VerifyFilesAsync(actor,ids,fileLeases,ct);
            var signatureIds=(detail.Snapshot?.Requirements.Where(requirement => selectedAction?.RequiresVerifiedRequirements==true &&
                requirement.Mandatory && requirement.VerificationKind=="SIGNATURE" && requirement.Status=="VERIFIED" &&
                (selectedAction.IsFinal || requirement.StageCode==detail.Snapshot.StageCode) && requirement.SignatureId.HasValue)
                .Select(requirement=>requirement.SignatureId!.Value)??[]).Distinct().ToArray();
            await VerifySignaturesAsync(actor,signatureIds,signatureLeases,ct);
            payloadJson = JsonSerializer.Serialize(request with { VerifiedEvidenceIds = ids, VerifiedSignatureIds=signatureIds },
                WorkflowV2JsonContext.Default.WorkflowV2ActionCommand);
        }
        await using var connection = connections.CreateConnection();
        await connection.OpenAsync(ct);
        await using var command = new SqlCommand("dbo.usp_Msst_WorkflowV2", connection)
        {
            CommandType = CommandType.StoredProcedure
        };
        command.Parameters.Add("@Operation", SqlDbType.VarChar, 32).Value = operation;
        command.Parameters.Add("@ActorId", SqlDbType.Int).Value = actor.ActorId;
        command.Parameters.Add("@EmpresaId", SqlDbType.Int).Value = actor.EmpresaId;
        command.Parameters.Add("@PayloadJson", SqlDbType.NVarChar, -1).Value = payloadJson;
        var json = await command.ExecuteScalarAsync(ct) as string;
        if (string.IsNullOrWhiteSpace(json))
            throw new InvalidDataException("El procedimiento no devolvió confirmación estructurada.");
        var envelope = JsonSerializer.Deserialize(json, WorkflowV2JsonContext.Default.WorkflowV2Envelope)
            ?? throw new InvalidDataException("La respuesta SQL no cumple el contrato workflow.");
        if (envelope.HttpStatus < 200 || envelope.HttpStatus > 599 || string.IsNullOrWhiteSpace(envelope.Code))
            throw new InvalidDataException("Resultado workflow incompleto.");
        if (envelope.Succeeded && expectedRequestId.HasValue && envelope.RequestId != expectedRequestId)
            throw new InvalidDataException("La confirmación pertenece a otro comando.");
        if (envelope.Succeeded && (operation is "ACTION" or "CREATE" or "PROOF") && envelope.Snapshot is null)
            throw new InvalidDataException("No se confirmó el estado persistido del expediente.");
        return envelope with { CorrelationId = correlationId };
        }
        finally
        {
            foreach (var lease in signatureLeases) await lease.DisposeAsync();
            foreach (var lease in fileLeases) await lease.DisposeAsync();
        }
    }
    private async Task VerifySignaturesAsync(WorkflowV2Actor actor,Guid[] ids,List<IAsyncDisposable> leases,CancellationToken ct)
    {
        try
        {
            foreach(var id in ids) leases.Add(await signatureReader.VerifyAsync(actor.ActorId,actor.EmpresaId,id,ct));
        }
        catch(Exception ex)when(ex is IOException or InvalidDataException or UnauthorizedAccessException or CryptographicException)
        {
            throw new WorkflowV2SignatureException();
        }
    }
    private async Task VerifyFilesAsync(WorkflowV2Actor actor, Guid[] ids, List<Stream> fileLeases, CancellationToken ct)
    {
        try
        {
            foreach (var id in ids)
            {
                var stream = await evidenceReader.OpenReadAsync(actor.ActorId,actor.EmpresaId,id,ct);
                fileLeases.Add(stream); // Mantener FileShare.Read hasta confirmar o revertir SQL.
                // OpenReadAsync comprueba tamaño y SHA-256 antes de devolver el stream autorizado.
                // Consumirlo también permite detectar fallos de lectura antes de confirmar la acción.
                await stream.CopyToAsync(Stream.Null,ct);
            }
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException)
        {
            throw new WorkflowV2EvidenceException();
        }
    }
}
internal sealed class WorkflowV2EvidenceException : Exception;
internal sealed class WorkflowV2SignatureException : Exception;
