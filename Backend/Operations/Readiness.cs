using System.Net;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.HttpOverrides;
using Msst.Backend.Database;
using Msst.Backend.Data;
using Msst.Backend.Evidence;
using Msst.Backend.Security;
namespace Msst.Backend.Operations;
public sealed record MigrationContract(string Name,string Sha256);
public sealed record ObjectContract(string Name,string Sha256);
public sealed record SchemaContract(MigrationContract[] Migrations,ObjectContract[] Objects,string TablesSha256);
public sealed record ReadinessReceipt([property:JsonPropertyName("status")] string Status);
[JsonSerializable(typeof(SchemaContract))]
[JsonSerializable(typeof(ReadinessReceipt))]
internal partial class OperationsJsonContext:JsonSerializerContext;
public sealed class Readiness(SqlServerAotRepository database,IConfiguration config)
{
 private readonly SchemaContract contract=ReadContract();
 private static SchemaContract ReadContract(){
  var path=Path.Combine(AppContext.BaseDirectory,"schema-contract.json");
  var value=JsonSerializer.Deserialize(File.ReadAllText(path),OperationsJsonContext.Default.SchemaContract);
  if(value is null||value.Migrations.Length==0||value.Objects.Length==0)throw new InvalidOperationException("El paquete no contiene un contrato de esquema verificable.");
  foreach(var digest in value.Migrations.Select(m=>m.Sha256).Concat(value.Objects.Select(o=>o.Sha256)))
   if(digest.Length!=64||!digest.All(Uri.IsHexDigit))throw new InvalidOperationException("El contrato contiene un hash inválido.");
  return value;
 }
 public const string ShapeSql="""
SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',STRING_AGG(CONVERT(nvarchar(max),CONCAT(t.name,N'|',c.name,N'|',ty.name,N'|',c.max_length,N'|',c.precision,N'|',c.scale,N'|',c.is_nullable,N'|',c.is_identity)),NCHAR(10)) WITHIN GROUP(ORDER BY t.name,c.name)),2)
FROM sys.tables t INNER JOIN sys.columns c ON c.object_id=t.object_id INNER JOIN sys.types ty ON ty.user_type_id=c.user_type_id
WHERE t.name IN(SELECT TableName FROM dbo.ApiV2_Module) OR t.name LIKE 'WfV2[_]%' OR t.name LIKE 'EvidenceV2[_]%' OR t.name LIKE 'SecV2[_]%' OR t.name LIKE 'MedV2[_]%' OR t.name LIKE 'ComV2[_]%' OR t.name LIKE 'AccessV2[_]%' OR t.name LIKE 'OpsV2[_]%'
""";
 public async Task<bool> Check(CancellationToken ct)
 {
  await using var connection=database.CreateConnection();await connection.OpenAsync(ct);
  await using(var shape=new SqlCommand(ShapeSql,connection))
   if(!string.Equals(Convert.ToString(await shape.ExecuteScalarAsync(ct)),contract.TablesSha256,StringComparison.OrdinalIgnoreCase))return false;
  foreach(var item in contract.Migrations){
   await using var query=new SqlCommand("SELECT Sha256 FROM dbo.OpsV2_Migration WHERE MigrationName=@Name;",connection);
   query.Parameters.AddWithValue("@Name",item.Name);
   if(!string.Equals(Convert.ToString(await query.ExecuteScalarAsync(ct)),item.Sha256,StringComparison.OrdinalIgnoreCase))return false;
  }
  foreach(var item in contract.Objects){
   await using var query=new SqlCommand("SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',TRIM(NCHAR(9)+NCHAR(10)+NCHAR(13)+NCHAR(32) FROM REPLACE(OBJECT_DEFINITION(OBJECT_ID(@Name)),CHAR(13),''))),2);",connection);
   query.Parameters.AddWithValue("@Name",item.Name);
   if(!string.Equals(Convert.ToString(await query.ExecuteScalarAsync(ct)),item.Sha256,StringComparison.OrdinalIgnoreCase))return false;
  }
  foreach(var name in new[]{"Evidence:RootPath","Security:DataProtectionKeysPath"}){
   var root=PrivateStoragePaths.Required(config,name);var path=Path.Combine(root,Guid.NewGuid().ToString("N")+".ready");
   try{await File.WriteAllBytesAsync(path,RandomNumberGenerator.GetBytes(32),ct);}
   finally{if(File.Exists(path))File.Delete(path);}
  }
  return true;
 }
}
public static class OperationalEndpoints
{
 public static void Configure(WebApplicationBuilder builder){
  _=SqlConnection.FromConfiguration(builder.Configuration);
  if(!int.TryParse(builder.Configuration["Operations:ReadinessTimeoutSeconds"],out var timeout)||timeout<1||timeout>60)
   throw new InvalidOperationException("Configure Operations:ReadinessTimeoutSeconds entre 1 y 60.");
  var forced=builder.Configuration["ForwardedHeaders_Enabled"];
  if(bool.TryParse(forced,out var enabled)&&enabled)throw new InvalidOperationException("Configure Web:TrustedProxies en lugar de habilitar confianza global en cabeceras.");
  var proxies=builder.Configuration.GetSection("Web:TrustedProxies").GetChildren().Select(v=>v.Value).ToArray();
  foreach(var proxy in proxies)if(!IPAddress.TryParse(proxy,out _))throw new InvalidOperationException("Web:TrustedProxies debe contener direcciones IP explícitas.");
  if(!int.TryParse(builder.Configuration["Web:ForwardLimit"],out var limit)||limit<1||limit>10)throw new InvalidOperationException("Configure Web:ForwardLimit entre 1 y 10.");
  builder.Services.Configure<ForwardedHeadersOptions>(o=>{
   o.ForwardedHeaders=ForwardedHeaders.XForwardedFor|ForwardedHeaders.XForwardedProto;o.ForwardLimit=limit;o.RequireHeaderSymmetry=true;
   o.KnownIPNetworks.Clear();o.KnownProxies.Clear();
   foreach(var proxy in proxies)o.KnownProxies.Add(IPAddress.Parse(proxy!));
  });
  builder.Services.AddSingleton<Readiness>();
 }
 public static void Use(WebApplication app){
  if(app.Configuration.GetSection("Web:TrustedProxies").GetChildren().Any())app.UseForwardedHeaders();
  _=app.Services.GetRequiredService<Legacy.LegacyPaging>();
  _=app.Services.GetRequiredService<EvidenceByteStore>();
  _=app.Services.GetRequiredService<Readiness>();
 }
 public static void Map(WebApplication app){
  app.MapGet("/health/ready",(RequestDelegate)(async ctx=>{
   ctx.Response.Headers.CacheControl="no-store";var ready=false;
   try{using var timeout=CancellationTokenSource.CreateLinkedTokenSource(ctx.RequestAborted);
    if(!int.TryParse(app.Configuration["Operations:ReadinessTimeoutSeconds"],out var seconds)||seconds<1||seconds>60)throw new InvalidOperationException("Configure el tiempo de readiness.");
    timeout.CancelAfter(TimeSpan.FromSeconds(seconds));ready=await ctx.RequestServices.GetRequiredService<Readiness>().Check(timeout.Token);
   }catch(Exception ex)when(ex is SqlException or IOException or UnauthorizedAccessException or OperationCanceledException or InvalidOperationException){
    app.Logger.LogWarning("Disponibilidad operativa no confirmada. Tipo={Type}; Referencia={Reference}",ex.GetType().Name,ctx.TraceIdentifier);
   }
   if(!ctx.RequestAborted.IsCancellationRequested)await Results.Json(new ReadinessReceipt(ready?"Ready":"NotReady"),
    OperationsJsonContext.Default.ReadinessReceipt,statusCode:ready?200:503).ExecuteAsync(ctx);
  })).AllowAnonymous();
 }
}
