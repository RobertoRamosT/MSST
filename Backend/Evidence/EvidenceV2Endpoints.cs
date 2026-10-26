using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.AspNetCore.Antiforgery;
using Msst.Backend.Security;

namespace Msst.Backend.Evidence;

public sealed class EvidenceStore(ProcedureJsonClient client)
{
    public async Task<EvidenceStoreResult> CallAsync(string operation, int actor, int empresa, EvidenceOperation command,
        CancellationToken ct) =>
        JsonSerializer.Deserialize(await client.ExecuteAsync("dbo.usp_Msst_EvidenceV2", operation, actor, empresa,
            JsonSerializer.Serialize(command, EvidenceV2JsonContext.Default.EvidenceOperation), ct),
            EvidenceV2JsonContext.Default.EvidenceStoreResult)
        ?? throw new InvalidOperationException("EVIDENCE_RECEIPT_INVALID");
}
public static class EvidenceV2Endpoints
{
    public static IServiceCollection AddMsstEvidenceV2(this IServiceCollection services)
    {
        services.AddSingleton<EvidenceReservations>();services.AddSingleton<ISignatureReader,SqlSignatureReader>(); services.AddSingleton<CmsSignatureVerifier>(); services.AddSingleton<EvidenceStore>(); services.AddSingleton<EvidenceByteStore>(); services.AddSingleton<IEvidenceReader,SqlEvidenceReader>();
        return services;
    }
    public static IEndpointRouteBuilder MapMsstEvidenceV2(this IEndpointRouteBuilder endpoints)
    {
        EvidenceReservations.MapEndpoints(endpoints);
        endpoints.MapPost("/sst/evidence", UploadAsync).RequireAuthorization();
        endpoints.MapGet("/sst/evidence/{evidenceId:guid}", MetadataAsync).RequireAuthorization();
        endpoints.MapGet("/sst/evidence/{evidenceId:guid}/content", ContentAsync).RequireAuthorization();
        endpoints.MapPost("/sst/evidence/{evidenceId:guid}/signatures", SignAsync).RequireAuthorization();
        return endpoints;
    }
    private static IResult Reply(HttpContext ctx, EvidenceStoreResult result, string? requestId, int status) =>
        Results.Json(new EvidenceReceipt(result.Succeeded, result.Code, result.Message, ctx.TraceIdentifier,
            requestId, result.Evidence is null ? null : result.Evidence with { StorageKey = null }, result.SignatureId),
            EvidenceV2JsonContext.Default.EvidenceReceipt, statusCode: status);

    private static async Task<IResult> UploadAsync(HttpContext ctx, IAntiforgery anti, EvidenceStore store, EvidenceByteStore bytes, EvidenceReservations reservations)
    {
        if (!await SecurityV2Endpoints.ValidateCsrfAsync(ctx, anti))
            return Reply(ctx, new(false,"CSRF_INVALID","Actualice la sesión antes de continuar."),null,400);
        if (!SecurityClaims.TryActor(ctx.User,out var actor,out var empresa)) return Results.Unauthorized();
        if (!ctx.Request.HasFormContentType)
            return Reply(ctx,new(false,"MULTIPART_REQUIRED","Seleccione un archivo."),null,415);
        IFormCollection form;
        try { form = await ctx.Request.ReadFormAsync(ctx.RequestAborted); }
        catch (InvalidDataException) { return Reply(ctx,new(false,"UPLOAD_REQUEST_INVALID","La carga no es válida."),null,413); }
        var requestId = form["idempotencyKey"].ToString();
        if (!Guid.TryParse(requestId,out _) || form.Files.Count != 1 || form.Files[0].Name != "file")
            return Reply(ctx,new(false,"UPLOAD_FIELDS_REQUIRED","Complete el archivo y la intención de carga."),requestId,422);
        var command = new EvidenceOperation(form["expedienteId"].ToString(),form["fieldCode"].ToString(),
            form["expectedVersion"].ToString(),requestId);
        var scope = await store.CallAsync("SCOPE",actor,empresa,command,ctx.RequestAborted);
        if (!scope.Succeeded || scope.Policy is null) return Reply(ctx,scope,requestId,409);
        var file = form.Files[0];
        if (file.Length < 1 || file.Length > scope.Policy.MaximumBytes || string.IsNullOrWhiteSpace(file.FileName))
            return Reply(ctx,new(false,"FILE_SIZE_INVALID","El tamaño del archivo no es válido."),requestId,422);
        var reservation=await reservations.Reserve(actor,empresa,requestId,false,ctx.RequestAborted);
        StoredBytes saved;
        try {
            await using var source = file.OpenReadStream();
            saved = await bytes.SaveAsync(source,scope.Policy.MaximumBytes,scope.Policy.AllowedContentTypes,false,ctx.RequestAborted,reservation.StorageKey);
        } catch (InvalidDataException ex) {
            return Reply(ctx,new(false,ex.Message,"El archivo no cumple el formato o tamaño permitido."),requestId,422);
        }
        // Tras persistir bytes, el SP vuelve a validar ámbito/versión y aplica idempotencia dentro de su transacción.
        // Ante timeout/desconexión no se borra: el COMMIT podría haberse efectuado. El reintento usa la misma clave.
        var result = await store.CallAsync("STORE",actor,empresa,command with {
            EvidenceId=Guid.NewGuid(),Sha256=saved.Sha256,FileName=Path.GetFileName(file.FileName),
            Size=saved.Size,ContentType=saved.ContentType,StorageKey=saved.StorageKey,ReservationToken=reservation.LeaseToken
        },ctx.RequestAborted);
        // La reserva conserva también los reintentos redundantes para una reconciliación durable.
        return Reply(ctx,result,requestId,result.Succeeded?200:409);
    }

    private static async Task<IResult> MetadataAsync(Guid evidenceId,HttpContext ctx,EvidenceStore store)
    {
        ctx.Response.Headers.CacheControl="no-store";
        if(!SecurityClaims.TryActor(ctx.User,out var actor,out var empresa)) return Results.Unauthorized();
        var result=await store.CallAsync("GET",actor,empresa,new(EvidenceId:evidenceId),ctx.RequestAborted);
        return Reply(ctx,result,null,result.Succeeded?200:404);
    }
    private static async Task<IResult> ContentAsync(Guid evidenceId,HttpContext ctx,EvidenceStore store,EvidenceByteStore bytes)
    {
        ctx.Response.Headers.CacheControl="no-store";ctx.Response.Headers.XContentTypeOptions="nosniff";
        ctx.Response.Headers.ContentSecurityPolicy="default-src 'none'; sandbox";
        if(!SecurityClaims.TryActor(ctx.User,out var actor,out var empresa)) return Results.Unauthorized();
        var result=await store.CallAsync("GET",actor,empresa,new(EvidenceId:evidenceId),ctx.RequestAborted);
        if(!result.Succeeded || result.Evidence is null) return Reply(ctx,result,null,404);
        try {
            var stream=await bytes.OpenVerifiedAsync(result.Evidence,ctx.RequestAborted);
            return Results.File(stream,result.Evidence.ContentType,result.Evidence.FileName,enableRangeProcessing:false);
        } catch (Exception ex) when(ex is IOException or InvalidDataException) {
            return Reply(ctx,new(false,"EVIDENCE_INTEGRITY_UNAVAILABLE","No se pudo verificar la integridad del archivo."),null,409);
        }
    }

    private static async Task<IResult> SignAsync(Guid evidenceId,HttpContext ctx,IAntiforgery anti,
        EvidenceStore store,EvidenceByteStore bytes,CmsSignatureVerifier verifier,EvidenceReservations reservations)
    {
        if(!await SecurityV2Endpoints.ValidateCsrfAsync(ctx,anti))
            return Reply(ctx,new(false,"CSRF_INVALID","Actualice la sesión antes de continuar."),null,400);
        if(!SecurityClaims.TryActor(ctx.User,out var actor,out var empresa)) return Results.Unauthorized();
        if(!ctx.Request.HasFormContentType) return Reply(ctx,new(false,"MULTIPART_REQUIRED","Adjunte la firma CMS separada."),null,415);
        var form=await ctx.Request.ReadFormAsync(ctx.RequestAborted);
        var requestId=form["idempotencyKey"].ToString();
        if(!Guid.TryParse(requestId,out _) || form.Files.Count!=1 || form.Files[0].Name!="signature")
            return Reply(ctx,new(false,"SIGNATURE_FIELDS_REQUIRED","Complete firma e intención."),requestId,422);
        var get=await store.CallAsync("GET",actor,empresa,new(EvidenceId:evidenceId),ctx.RequestAborted);
        if(!get.Succeeded || get.Evidence is null) return Reply(ctx,get,requestId,404);
        var scopeCommand=new EvidenceOperation(get.Evidence.ExpedienteId,get.Evidence.FieldCode,
            form["expectedVersion"].ToString(),requestId,evidenceId);
        var scope=await store.CallAsync("SIGN_SCOPE",actor,empresa,scopeCommand,ctx.RequestAborted);
        if(!scope.Succeeded || scope.Policy is null) return Reply(ctx,scope,requestId,409);
        if(form.Files[0].Length<1 || form.Files[0].Length>scope.Policy.MaximumBytes)
            return Reply(ctx,new(false,"SIGNATURE_SIZE_INVALID","La firma supera el tamaño permitido."),requestId,422);
        try {
            await using var original=await bytes.OpenVerifiedAsync(get.Evidence,ctx.RequestAborted);
            using var content=new MemoryStream(); await original.CopyToAsync(content,ctx.RequestAborted);
            using var signature=new MemoryStream();
            await using(var input=form.Files[0].OpenReadStream()) {
                var buffer=new byte[8192];int read;
                while((read=await input.ReadAsync(buffer,ctx.RequestAborted))>0) {
                    if(signature.Length+read>scope.Policy.MaximumBytes) throw new InvalidDataException("SIGNATURE_SIZE_INVALID");
                    await signature.WriteAsync(buffer.AsMemory(0,read),ctx.RequestAborted);
                }
            }
            var certSha=verifier.Verify(content.ToArray(),signature.ToArray());
            var check=await store.CallAsync("CERTIFICATE",actor,empresa,scopeCommand with{CertificateSha256=certSha},ctx.RequestAborted);
            if(!check.Succeeded) return Reply(ctx,check,requestId,403);
            signature.Position=0;
            var reservation=await reservations.Reserve(actor,empresa,requestId,true,ctx.RequestAborted);
            var saved=await bytes.SaveAsync(signature,scope.Policy.MaximumBytes,[],true,ctx.RequestAborted,reservation.StorageKey);
            var result=await store.CallAsync("SIGN",actor,empresa,scopeCommand with {
                SignatureId=Guid.NewGuid(),CertificateSha256=certSha,Sha256=get.Evidence.Sha256,
                SignatureSha256=saved.Sha256,SignatureStorageKey=saved.StorageKey,ReservationToken=reservation.LeaseToken
            },ctx.RequestAborted);
            // Ante respuesta incierta, la reserva permite resolver el resultado sin borrar bytes referenciados.
            return Reply(ctx,result,requestId,result.Succeeded?200:409);
        } catch(Exception ex) when(ex is CryptographicException or InvalidDataException or IOException) {
            return Reply(ctx,new(false,"SIGNATURE_VERIFICATION_FAILED","La firma, la cadena de confianza o el archivo no pudieron verificarse."),requestId,422);
        }
    }
}
