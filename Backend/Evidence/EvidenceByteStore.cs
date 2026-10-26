using System.Security.Cryptography;
namespace Msst.Backend.Evidence;

/// <summary>Solo claves aleatorias generadas por servidor. Nunca utiliza rutas/nombres remitidos por el cliente.</summary>
public sealed class EvidenceByteStore
{
    private readonly string root;
    public EvidenceByteStore(IConfiguration config)
    {
        root = Msst.Backend.Security.PrivateStoragePaths.Required(config,"Evidence:RootPath");
        Directory.CreateDirectory(root);
    }
    private string Resolve(string key)
    {
        if (!Guid.TryParseExact(key, "N", out _)) throw new InvalidOperationException("STORAGE_KEY_INVALID");
        return Path.Combine(root, key);
    }
    public async Task<StoredBytes> SaveAsync(Stream source, long maximumBytes, string[] allowedTypes,
        bool signature, CancellationToken ct)
    {
        var key = Guid.NewGuid().ToString("N"); var path = Resolve(key);
        using var sha = IncrementalHash.CreateHash(HashAlgorithmName.SHA256);
        byte[] buffer = new byte[64 * 1024]; byte[] header = new byte[16];
        long count = 0; var headerLength = 0;
        try {
            await using var destination = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None,
                buffer.Length, FileOptions.Asynchronous | FileOptions.WriteThrough);
            while (true) {
                var read = await source.ReadAsync(buffer, ct); if (read == 0) break;
                count += read;
                if (count > maximumBytes) throw new InvalidDataException("FILE_TOO_LARGE");
                if (headerLength < header.Length) {
                    var n = Math.Min(read, header.Length - headerLength);
                    buffer.AsSpan(0, n).CopyTo(header.AsSpan(headerLength)); headerLength += n;
                }
                sha.AppendData(buffer, 0, read);
                await destination.WriteAsync(buffer.AsMemory(0, read), ct);
            }
            if (count == 0) throw new InvalidDataException("FILE_EMPTY");
            await destination.FlushAsync(ct);
            destination.Flush(flushToDisk: true);
            await destination.DisposeAsync();
            var type = signature ? "application/pkcs7-signature" : DetectContentType(header.AsSpan(0, headerLength));
            if (!signature && type == "application/octet-stream" && allowedTypes.Contains("application/json", StringComparer.Ordinal))
            {
                await using var jsonStream = File.OpenRead(path);
                try {
                    using var json = await System.Text.Json.JsonDocument.ParseAsync(jsonStream,
                        new System.Text.Json.JsonDocumentOptions { AllowTrailingCommas = false, CommentHandling = System.Text.Json.JsonCommentHandling.Disallow, MaxDepth = 64 }, ct);
                    if (json.RootElement.ValueKind is not (System.Text.Json.JsonValueKind.Object or System.Text.Json.JsonValueKind.Array))
                        throw new InvalidDataException("JSON_DOCUMENT_REQUIRED");
                    type = "application/json";
                } catch (System.Text.Json.JsonException) { throw new InvalidDataException("JSON_CONTENT_INVALID"); }
            }
            if (!signature && !allowedTypes.Contains(type, StringComparer.Ordinal))
                throw new InvalidDataException("FILE_CONTENT_TYPE_REJECTED");
            return new StoredBytes(key, Convert.ToHexString(sha.GetHashAndReset()).ToLowerInvariant(), count, type);
        } catch {
            File.Delete(path); // Solo archivo recién creado cuya clave se generó en este método.
            throw;
        }
    }
    private static string DetectContentType(ReadOnlySpan<byte> bytes)
    {
        if (bytes.StartsWith("%PDF-"u8)) return "application/pdf";
        if (bytes.StartsWith(new byte[] {137,80,78,71,13,10,26,10})) return "image/png";
        if (bytes.StartsWith(new byte[] {255,216,255})) return "image/jpeg";
        return "application/octet-stream";
    }
    public async Task<FileStream> OpenVerifiedAsync(EvidenceMetadata evidence, CancellationToken ct)
    {
        var stream = new FileStream(Resolve(evidence.StorageKey ?? ""), FileMode.Open, FileAccess.Read, FileShare.Read,
            64 * 1024, FileOptions.Asynchronous | FileOptions.SequentialScan);
        try {
            if (stream.Length != evidence.Size) throw new InvalidDataException("EVIDENCE_SIZE_MISMATCH");
            var actual = await SHA256.HashDataAsync(stream, ct);
            byte[] expected;
            try { expected = Convert.FromHexString(evidence.Sha256); }
            catch (FormatException) { throw new InvalidDataException("EVIDENCE_DIGEST_INVALID"); }
            if (expected.Length != 32 || !CryptographicOperations.FixedTimeEquals(actual, expected))
                throw new InvalidDataException("EVIDENCE_DIGEST_MISMATCH");
            stream.Position = 0; return stream;
        } catch { await stream.DisposeAsync(); throw; }
    }
    public async Task<FileStream> OpenVerifiedSignatureAsync(string storageKey,string sha256,CancellationToken ct)
    {
        var stream=new FileStream(Resolve(storageKey),FileMode.Open,FileAccess.Read,FileShare.Read,
            64*1024,FileOptions.Asynchronous|FileOptions.SequentialScan);
        try {
            var actual=await SHA256.HashDataAsync(stream,ct);
            byte[] expected;
            try{expected=Convert.FromHexString(sha256);}catch(FormatException){throw new InvalidDataException("SIGNATURE_DIGEST_INVALID");}
            if(expected.Length!=32||!CryptographicOperations.FixedTimeEquals(actual,expected))
                throw new InvalidDataException("SIGNATURE_DIGEST_MISMATCH");
            stream.Position=0;return stream;
        }catch{await stream.DisposeAsync();throw;}
    }
    public void DeleteRedundant(string generatedKey) => File.Delete(Resolve(generatedKey));
}
