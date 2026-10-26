using System.Security.Cryptography;
namespace Msst.Backend.Evidence;
public interface ISignatureReader
{
 Task<IAsyncDisposable> VerifyAsync(int actorId,int empresaId,Guid signatureId,CancellationToken ct);
}
/// <summary>Revalida la firma CMS y la confianza vigente antes de aceptar una prueba o decisión.</summary>
public sealed class SqlSignatureReader(EvidenceStore store,IEvidenceReader reader,EvidenceByteStore bytes,CmsSignatureVerifier verifier):ISignatureReader
{
 public async Task<IAsyncDisposable> VerifyAsync(int actorId,int empresaId,Guid signatureId,CancellationToken ct)
 {
  var result=await store.CallAsync("SIGNATURE_METADATA",actorId,empresaId,new(SignatureId:signatureId),ct);
  var artifact=result.SignatureArtifact;
  if(!result.Succeeded||artifact is null||artifact.SignatureId!=signatureId||result.Policy is null)
   throw new InvalidDataException("SIGNATURE_NOT_ACCESSIBLE");
  var original=await reader.OpenReadAsync(actorId,empresaId,artifact.EvidenceId,ct);
  FileStream? signature=null;
  try {
   if(original.Length>result.Policy.MaximumBytes)throw new InvalidDataException("SIGNATURE_CONTENT_SIZE_REJECTED");
   signature=await bytes.OpenVerifiedSignatureAsync(artifact.SignatureStorageKey,artifact.SignatureSha256,ct);
   if(signature.Length>result.Policy.MaximumBytes)throw new InvalidDataException("SIGNATURE_SIZE_REJECTED");
   using var content=new MemoryStream();using var cms=new MemoryStream();
   await original.CopyToAsync(content,ct);await signature.CopyToAsync(cms,ct);
   var certificate=verifier.Verify(content.ToArray(),cms.ToArray());
   if(!string.Equals(certificate,artifact.CertificateSha256,StringComparison.Ordinal))throw new CryptographicException("SIGNATURE_CERTIFICATE_MISMATCH");
   return new SignatureLease(original,signature);
  }catch{await original.DisposeAsync();if(signature is not null)await signature.DisposeAsync();throw;}
 }
 private sealed class SignatureLease(Stream original,Stream signature):IAsyncDisposable
 {
  public async ValueTask DisposeAsync(){try{await signature.DisposeAsync();}finally{await original.DisposeAsync();}}
 }
}
