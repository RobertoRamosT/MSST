namespace Msst.Backend.Evidence;
public interface IEvidenceReader
{
    Task<EvidenceMetadata?> GetMetadataAsync(int actorId,int empresaId,Guid evidenceId,CancellationToken ct);
    Task<Stream> OpenReadAsync(int actorId,int empresaId,Guid evidenceId,CancellationToken ct);
}
public sealed class SqlEvidenceReader(EvidenceStore store,EvidenceByteStore bytes):IEvidenceReader
{
    public async Task<EvidenceMetadata?> GetMetadataAsync(int actorId,int empresaId,Guid evidenceId,CancellationToken ct)
    {
        var result=await store.CallAsync("GET",actorId,empresaId,new(EvidenceId:evidenceId),ct);
        return result.Succeeded?result.Evidence:null;
    }
    public async Task<Stream> OpenReadAsync(int actorId,int empresaId,Guid evidenceId,CancellationToken ct)
    {
        var metadata=await GetMetadataAsync(actorId,empresaId,evidenceId,ct)
            ?? throw new UnauthorizedAccessException("EVIDENCE_NOT_ACCESSIBLE");
        return await bytes.OpenVerifiedAsync(metadata,ct);
    }
}
