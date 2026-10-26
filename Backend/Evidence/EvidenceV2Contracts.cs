using System.Text.Json.Serialization;
namespace Msst.Backend.Evidence;
public sealed record EvidenceMetadata(Guid EvidenceId, string Sha256, string FileName, long Size,
    string ContentType, string StateCode, string? StorageKey = null, string? ExpedienteId = null,
    string? FieldCode = null, string? WorkflowVersion = null);
public sealed record SignatureArtifact(Guid SignatureId,Guid EvidenceId,string SignatureStorageKey,string SignatureSha256,string CertificateSha256);
public sealed record EvidencePolicy(long MaximumBytes, string[] AllowedContentTypes);
public sealed record EvidenceOperation(string? ExpedienteId = null, string? FieldCode = null,
    string? ExpectedVersion = null, string? IdempotencyKey = null, Guid? EvidenceId = null,
    string? Sha256 = null, string? FileName = null, long? Size = null, string? ContentType = null,
    string? StorageKey = null, Guid? SignatureId = null, string? CertificateSha256 = null,
    string? SignatureSha256 = null, string? SignatureStorageKey = null);
public sealed record EvidenceStoreResult(bool Succeeded, string Code, string Message,
    EvidenceMetadata? Evidence = null, EvidencePolicy? Policy = null, Guid? SignatureId = null, string? SignatureStorageKey = null,SignatureArtifact? SignatureArtifact = null);
public sealed record EvidenceReceipt(bool Succeeded, string Code, string Message, string CorrelationId,
    string? RequestId = null, EvidenceMetadata? Evidence = null, Guid? SignatureId = null);
public sealed record StoredBytes(string StorageKey, string Sha256, long Size, string ContentType);
[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(EvidenceOperation))]
[JsonSerializable(typeof(EvidenceStoreResult))]
[JsonSerializable(typeof(EvidenceReceipt))]
public partial class EvidenceV2JsonContext : JsonSerializerContext;
