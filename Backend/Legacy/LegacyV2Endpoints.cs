using System.Text.Json;
using Msst.Backend.Data;
using Msst.Backend.Security;
using Msst.Backend.Serialization;
namespace Msst.Backend.Legacy;

public static class LegacyV2Endpoints
{
 public static IServiceCollection AddLegacyV2(this IServiceCollection services)
 {services.AddHttpContextAccessor();services.AddSingleton<LegacyPaging>();services.AddSingleton<LegacyV2Repository>();return services;}
 public static void MapLegacyV2(this WebApplication app)
 {
  var sst=app.MapGroup("/sst").RequireAuthorization();
  sst.MapGet("/health",(RequestDelegate)(async ctx=>{
   var status=await ctx.RequestServices.GetRequiredService<SqlServerAotRepository>().ObtenerEstadoSistemaAsync(ctx.RequestAborted);
   await Results.Json(status,MsstJsonContext.Default.EstadoSistemaAotDto).ExecuteAsync(ctx);
  }));
  sst.MapPost("/empresa/id",(RequestDelegate)(async ctx=>{
   var actor=RequestScope.Require(ctx);await CheckScope(ctx,actor);
   var response=await ctx.RequestServices.GetRequiredService<SqlServerAotRepository>().ObtenerEmpresaPorIdAsync(actor.EmpresaId,ctx.RequestAborted);
   await Results.Json(response,MsstJsonContext.Default.EmpresaByIdResponse).ExecuteAsync(ctx);
  }));
  sst.MapPost("/contratista/perfiles",(RequestDelegate)(async ctx=>{
   var actor=RequestScope.Require(ctx);await CheckScope(ctx,actor);
   var response=await ctx.RequestServices.GetRequiredService<SqlServerAotRepository>().ObtenerPerfilesContratistaAsync(actor.EmpresaId,ctx.RequestAborted);
   await Results.Json(response,MsstJsonContext.Default.ContratistaPerfilesResponse).ExecuteAsync(ctx);
  }));
  sst.MapPost("/empresa/mensaje",(RequestDelegate)(async ctx=>{
   var actor=RequestScope.Require(ctx);await CheckScope(ctx,actor);
   var response=await ctx.RequestServices.GetRequiredService<SqlServerAotRepository>().ObtenerMensajesAsync(actor.EmpresaId,ctx.RequestAborted);
   await Results.Json(response,MsstJsonContext.Default.EmpresaMensajeResponse).ExecuteAsync(ctx);
  }));
  sst.MapPost("/mdf/tipos",(RequestDelegate)(async ctx=>{
   await CheckScope(ctx,RequestScope.Require(ctx));
   var result=await ctx.RequestServices.GetRequiredService<LegacyV2Repository>().GetMdfTypesAsync(ctx.RequestAborted);
   await Results.Json(result,LegacyV2JsonContext.Default.LegacyV2Envelope).ExecuteAsync(ctx);
  }));
  sst.MapGet("/medical/catalogs/types",(RequestDelegate)(ctx=>Medical(ctx,"TYPES")));
  sst.MapGet("/medical/catalogs/admin",(RequestDelegate)(ctx=>Medical(ctx,"ADMIN")));
  sst.MapMethods("/medical/catalogs",["GET","POST"],(RequestDelegate)(ctx=>Medical(ctx,"READ")));
  sst.MapPut("/medical/catalogs",(RequestDelegate)(ctx=>Medical(ctx,"SAVE")));
  // El visor siempre pide un ID persistido. No aceptar una URL arbitraria ni crear una firma por GET.
  sst.MapGet("/evidencia/ver",(RequestDelegate)(async ctx=>{
   if(!Guid.TryParse(ctx.Request.Query["codigo"],out var id) && !Guid.TryParse(ctx.Request.Query["evidenceId"],out id))
    throw new ApiDomainException(404,"EVIDENCE_NOT_FOUND","Seleccione una evidencia persistida.");
   ctx.Response.Redirect("/sst/evidence/"+id+"/content");await Task.CompletedTask;
  }));
  sst.MapMethods("/{**route}",["GET","POST","PUT","DELETE"],(RequestDelegate)(async ctx=>{
   var route="/"+(ctx.Request.RouteValues["route"]?.ToString()??"").TrimStart('/');
   if(route.StartsWith("/security/",StringComparison.Ordinal)||route.StartsWith("/workflow/",StringComparison.Ordinal)||route.StartsWith("/evidence",StringComparison.Ordinal)||route.StartsWith("/access/",StringComparison.Ordinal))
    throw new ApiDomainException(404,"ENDPOINT_NOT_FOUND","La ruta no está disponible.");
   string json="{}";
   if(ctx.Request.ContentLength is >0 || ctx.Request.Headers.TransferEncoding.Count>0)
   {using var reader=new StreamReader(ctx.Request.Body);json=await reader.ReadToEndAsync(ctx.RequestAborted);}
   else if(ctx.Request.Query.Count>0)
   {
    using var stream=new MemoryStream();
    using(var writer=new Utf8JsonWriter(stream)){writer.WriteStartObject();foreach(var p in ctx.Request.Query)writer.WriteString(p.Key,p.Value.ToString());writer.WriteEndObject();}
    json=System.Text.Encoding.UTF8.GetString(stream.ToArray());
   }
   var response=await ctx.RequestServices.GetRequiredService<LegacyV2Repository>().ExecuteAsync(route,json,ctx.RequestAborted);
   await Results.Json(response,LegacyV2JsonContext.Default.LegacyV2Envelope,statusCode:response.CodeResponse=="05"?200:422).ExecuteAsync(ctx);
  }));
 }
 private static async Task Medical(HttpContext ctx,string op)
 {
  var repo=ctx.RequestServices.GetRequiredService<LegacyV2Repository>();
  LegacyV2Envelope response;
  if(op=="SAVE"){
   using var reader=new StreamReader(ctx.Request.Body);
   response=await repo.SaveMedicalCatalogAsync(await reader.ReadToEndAsync(ctx.RequestAborted),ctx.RequestAborted);
  }else response=op=="TYPES"?await repo.GetMedicalTypesAsync(ctx.RequestAborted):op=="ADMIN"?
    await repo.GetMedicalAdminCatalogAsync(ctx.RequestAborted):await repo.GetMedicalCatalogAsync(ctx.RequestAborted);
  await Results.Json(response,LegacyV2JsonContext.Default.LegacyV2Envelope,statusCode:response.CodeResponse=="05"?200:422).ExecuteAsync(ctx);
 }
 private static async Task CheckScope(HttpContext ctx,RequestActor actor)
 {
  if(ctx.Request.ContentLength is not >0)return;
  using var payload=await JsonDocument.ParseAsync(ctx.Request.Body,cancellationToken:ctx.RequestAborted);
  RequestScope.CheckPayloadScope(payload.RootElement,actor);
 }
}
