using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.Extensions.FileProviders;
using Msst.Backend.Access;
using Msst.Backend.Committee;
using Msst.Backend.Data;
using Msst.Backend.Database;
using Msst.Backend.Evidence;
using Msst.Backend.Legacy;
using Msst.Backend.Security;
using Msst.Backend.Serialization;
using Msst.Backend.Workflow;

namespace Msst.Backend;

public static class ApplicationV2
{
 public static WebApplication Build(string[] args)
 {
  var builder=WebApplication.CreateSlimBuilder(args);
  builder.WebHost.UseKestrelHttpsConfiguration();
  if(OperatingSystem.IsWindows())builder.Services.AddWindowsService(o=>o.ServiceName=builder.Configuration["Service:Name"]??"MsstIndustrialService");
  builder.Services.ConfigureHttpJsonOptions(o=>o.SerializerOptions.TypeInfoResolverChain.Insert(0,MsstJsonContext.Default));
  builder.Services.AddHttpContextAccessor();
  builder.Services.AddSingleton<SqlServerAotRepository>();
  builder.Services.AddMsstSecurityV2(builder.Configuration);
  builder.Services.AddMsstEvidenceV2();
  builder.Services.AddAuthorization(o=>o.AddPolicy("MSST.Workflow.Actuar",p=>p.RequireAuthenticatedUser().RequireClaim(System.Security.Claims.ClaimTypes.NameIdentifier).RequireClaim(SecurityClaims.Empresa)));
  builder.Services.AddWorkflowV2();builder.Services.AddLegacyV2();builder.Services.AddAccessV2();builder.Services.AddCommitteeV2();
  builder.Services.AddCors(o=>o.AddPolicy("MsstFrontend",p=>{
   var origins=builder.Configuration.GetSection("Web:AllowedOrigins").GetChildren().Select(c=>c.Value).Where(v=>!string.IsNullOrWhiteSpace(v)).Select(v=>v!).ToArray();
   if(origins.Length>0)p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
  }));
  var app=builder.Build();
  app.UseExceptionHandler(error=>error.Run(async ctx=>{
   var exception=ctx.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
   var status=500;var code="OPERATION_UNCONFIRMED";var message="No se pudo confirmar la operación. Conserve los datos y revise el expediente.";
   if(exception is ApiDomainException domain){status=domain.Status;code=domain.Code;message=domain.Message;}
   else if(exception is JsonException){status=400;code="REQUEST_JSON_INVALID";message="La solicitud contiene datos inválidos o campos no admitidos.";}
   else if(exception is SqlException sql){
    status=503;code="DATABASE_UNAVAILABLE";message="No se pudo confirmar la operación de datos. Intente nuevamente con la misma operación.";
    app.Logger.LogError("Operación SQL no confirmada. Número={Number}; Estado={State}; Referencia={CorrelationId}",sql.Number,sql.SqlState,ctx.TraceIdentifier);
   }
   else if(exception is OperationCanceledException){status=499;code="REQUEST_CANCELED";message="La operación fue interrumpida. Consulte el expediente antes de reintentar.";}
   else app.Logger.LogError("Operación no confirmada. Tipo={Type}; Referencia={CorrelationId}",exception?.GetType().Name,ctx.TraceIdentifier);
   ctx.Response.StatusCode=status;
   await Results.Json(new BoundaryError(false,code,message,ctx.TraceIdentifier),BoundaryJsonContext.Default.BoundaryError,statusCode:status).ExecuteAsync(ctx);
  }));
  app.UseCors("MsstFrontend");app.UseRateLimiter();app.UseAuthentication();app.UseAuthorization();
  app.Use(async(ctx,next)=>{
   if(ctx.Request.Path.StartsWithSegments("/sst")&&!HttpMethods.IsGet(ctx.Request.Method)&&!HttpMethods.IsHead(ctx.Request.Method)&&!HttpMethods.IsOptions(ctx.Request.Method))
   {
    var anti=ctx.RequestServices.GetRequiredService<IAntiforgery>();
    if(!await SecurityV2Endpoints.ValidateCsrfAsync(ctx,anti)){
     await Results.Json(new BoundaryError(false,"CSRF_INVALID","Actualice la sesión antes de continuar.",ctx.TraceIdentifier),BoundaryJsonContext.Default.BoundaryError,statusCode:400).ExecuteAsync(ctx);return;
    }
   }
   await next(ctx);
  });
  app.MapGet("/health",(RequestDelegate)(async ctx=>await Results.Json(new BoundaryHealth("Healthy",DateTimeOffset.UtcNow),
   BoundaryJsonContext.Default.BoundaryHealth).ExecuteAsync(ctx))).AllowAnonymous();
  app.MapMsstSecurityV2();app.MapPermissionV2();app.MapMsstEvidenceV2();app.MapWorkflowV2();app.MapAccessV2();app.MapCommitteeV2();app.MapLegacyV2();
  var configured=builder.Configuration["Web:FrontendRoot"];
  if(!string.IsNullOrWhiteSpace(configured))
  {
   if(!Path.IsPathFullyQualified(configured)||!Directory.Exists(configured))
    throw new InvalidOperationException("Web:FrontendRoot debe ser una carpeta absoluta existente.");
   var provider=new PhysicalFileProvider(configured);
   app.UseDefaultFiles(new DefaultFilesOptions{FileProvider=provider});
   app.UseStaticFiles(new StaticFileOptions{FileProvider=provider});
   app.MapFallback((RequestDelegate)(async ctx=>{
    if(ctx.Request.Path.StartsWithSegments("/sst")||Path.HasExtension(ctx.Request.Path.Value)){ctx.Response.StatusCode=404;return;}
    await ctx.Response.SendFileAsync(Path.Combine(configured,"index.html"));
   }));
  }
  return app;
 }
}
public sealed record BoundaryError(bool Succeeded,string Code,string Message,string CorrelationId);
public sealed record BoundaryHealth(string Status,DateTimeOffset Timestamp);
[JsonSourceGenerationOptions(PropertyNamingPolicy=JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(BoundaryError))]
[JsonSerializable(typeof(BoundaryHealth))]
internal partial class BoundaryJsonContext:JsonSerializerContext;
