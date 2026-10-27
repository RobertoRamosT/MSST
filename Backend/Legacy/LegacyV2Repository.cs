using System.Data;
using System.Text.Json;
using System.Text.RegularExpressions;
using Msst.Backend.Data;
using Msst.Backend.Database;
using Msst.Backend.Evidence;
namespace Msst.Backend.Legacy;

public sealed class LegacyV2Repository(SqlServerAotRepository database, IHttpContextAccessor contexts, IEvidenceReader evidenceReader,LegacyPaging paging)
{
 public async Task<LegacyV2Envelope> ExecuteAsync(string route, string json, CancellationToken ct)
 {
  var actor=RequestScope.Require(contexts.HttpContext);
  using var document=JsonDocument.Parse(string.IsNullOrWhiteSpace(json) ? "{}" : json);
  RequestScope.CheckPayloadScope(document.RootElement,actor);
  await using var connection=database.CreateConnection(); await connection.OpenAsync(ct);
  string module,operation;
  // Solo un contrato publicado puede seleccionar módulo y operación. El catálogo
  // de rutas históricas describe superficie; no acredita una implementación.
  await using(var lookup=new SqlCommand("SELECT r.ModuleCode,r.ActionCode FROM dbo.ApiV2_Route r JOIN dbo.ApiV2_Module m ON m.ModuleCode=r.ModuleCode AND m.Enabled=1 WHERE r.Route=@Route;",connection))
  {
   lookup.Parameters.AddWithValue("@Route",route);
   await using var row=await lookup.ExecuteReaderAsync(ct);
   if(!await row.ReadAsync(ct))throw new ApiDomainException(404,"ENDPOINT_NOT_IMPLEMENTED","La operación solicitada no tiene un contrato funcional implementado.");
   module=row.GetString(0);operation=row.GetString(1);
  }
  var mutation=operation!="QUERY";
  string? action=mutation?operation:null;
  if(operation is not ("QUERY" or "INSERT" or "UPDATE" or "DELETE"))
   throw new ApiDomainException(422,"WORKFLOW_ACTION_REQUIRED","Realice esta decisión desde su expediente y acción autorizada.");
  var method=contexts.HttpContext!.Request.Method;
  var validMethod=HttpMethods.IsPost(method)||(operation=="QUERY"&&HttpMethods.IsGet(method))||
   (operation=="UPDATE"&&HttpMethods.IsPut(method))||(operation=="DELETE"&&HttpMethods.IsDelete(method));
  if(!validMethod)throw new ApiDomainException(405,"HTTP_METHOD_INVALID","El método no corresponde a la operación solicitada.");
  if(mutation&&module=="contratista"&&document.RootElement.TryGetProperty("tipoContratistaId",out var contractorType)
   &&(contractorType.ValueKind!=JsonValueKind.Number||!contractorType.TryGetInt32(out var typeId)||typeId<=0))
   throw new ApiDomainException(422,"CONTRACTOR_TYPE_INVALID","Ingrese un código de tipo de contratista válido.");
  RequestScope.Permission(contexts.HttpContext,module=="contratista_garita"&&!mutation?"access:read":"legacy:"+module+(mutation ? ":write" : ":read"));
  await using var verifiedEvidence=await VerifyEvidenceAsync(document.RootElement,actor,module,action,evidenceReader,ct);
  LegacyV2Envelope response;
  if(mutation)
  {
   await using var command=new SqlCommand("dbo.usp_Msst_LegacyV2",connection){CommandType=CommandType.StoredProcedure};
   command.Parameters.AddWithValue("@Modulo",module);command.Parameters.AddWithValue("@Accion",action!);
   command.Parameters.AddWithValue("@ActorId",actor.UserId);command.Parameters.AddWithValue("@EmpresaId",actor.EmpresaId);
   command.Parameters.AddWithValue("@PayloadJson",document.RootElement.GetRawText());
   var raw=Convert.ToString(await command.ExecuteScalarAsync(ct)) ?? throw new InvalidDataException("Sin recibo.");
   response=JsonSerializer.Deserialize(raw,LegacyV2JsonContext.Default.LegacyV2Envelope) ?? throw new InvalidDataException("Recibo inválido.");
   if(response.CodeResponse!="05" || response.StatusCode!="01") return response;
   if(response.Snapshot is null || response.Snapshot.Record.Count==0 || response.Snapshot.Version.Length==0 || response.RequestId is null)
    throw new InvalidDataException("Falta la instantánea persistida.");
   return response; // El recibo no necesita volver a consultar todo el módulo.
  }
  else response=new(){CodeResponse="05",StatusCode="01",Message="Consulta confirmada."};
  var query=LegacyProjection.ObtenerConsulta(module);
  if(string.IsNullOrEmpty(query)) throw new ApiDomainException(404,"ENDPOINT_NOT_IMPLEMENTED","El módulo no tiene una consulta implementada.");
  query=await ScopeAsync(connection,query,actor,ct);
  var selection=paging.Parse(document.RootElement,contexts.HttpContext!,actor,route);
  var order=Regex.Match(query,@"\bORDER\s+BY\b",RegexOptions.IgnoreCase);
  var inner=(order.Success?query[..order.Index]:query).Trim().TrimEnd(';');
  query="WITH scoped_rows AS ("+inner+") SELECT TOP(@PageTake) q.* FROM scoped_rows q WHERE q.id>@PageAfter AND "+
    "(@PageSearch=N'' OR EXISTS(SELECT 1 FROM OPENJSON((SELECT q.* FOR JSON PATH,WITHOUT_ARRAY_WRAPPER,INCLUDE_NULL_VALUES)) f WHERE f.type IN(1,2) AND CHARINDEX(@PageSearch,f.value)>0)) ORDER BY q.id;";
  var hasMore=false;
  await using(var command=new SqlCommand(query,connection))
  {
   command.Parameters.AddWithValue("@PageTake",selection.Size+1);command.Parameters.AddWithValue("@PageAfter",selection.AfterId);command.Parameters.AddWithValue("@PageSearch",selection.Search);
   command.Parameters.AddWithValue("@ActorEmpresa",actor.EmpresaId);
   if(query.Contains("@ActorContractor",StringComparison.Ordinal))command.Parameters.AddWithValue("@ActorContractor",actor.ContratistaId ?? 0);
   await using var reader=await command.ExecuteReaderAsync(ct);
   while(await reader.ReadAsync(ct))
   {
    if(response.List.Count==selection.Size){hasMore=true;break;}
    var row=new Dictionary<string,object?>(StringComparer.Ordinal);
    for(var i=0;i<reader.FieldCount;i++){
     var value=reader.IsDBNull(i)?null:reader.GetValue(i);
     row[reader.GetName(i)]=value switch{
      byte[] bytes=>Convert.ToBase64String(bytes),DateTime date=>date.ToString("O",System.Globalization.CultureInfo.InvariantCulture),Guid guid=>guid.ToString(),
      null or int or long or short or byte or decimal or bool or string or double or float=>value,
      _=>throw new InvalidDataException("Tipo SQL fuera del contrato.")};
    }response.List.Add(row);
   }
  }
  response.Total=response.List.Count;
  var next=hasMore&&response.List.Count>0?paging.Next(actor,route,selection,Convert.ToInt64(response.List[^1]["id"])):null;
  string label=module;
  await using(var title=new SqlCommand("SELECT Label FROM dbo.ApiV2_ListLabel WHERE ModuleCode=@Module;",connection))
  {title.Parameters.AddWithValue("@Module",module);label=Convert.ToString(await title.ExecuteScalarAsync(ct))??"Registros";}
  response.Page=new(selection.Size,response.List.Count,paging.MaximumSize,hasMore,next,"id:asc",label);
  if(!selection.Compact){
   response.Lista=response.List;
   if(response.List.Count>0)response.Data=response.List[0];
   if(route.Contains("conductor",StringComparison.OrdinalIgnoreCase))response.DriverDocuments=response.List;
  }
  // El recibo conserva exactamente el registro/version de su transacción, también en replay.
  // La lista actual se devuelve aparte: no mezclar un registro posterior con la versión del recibo.
  return response;
 }
 private static async Task<Stream?> VerifyEvidenceAsync(JsonElement document,RequestActor actor,string module,string? action,IEvidenceReader reader,CancellationToken ct)
 {
  if(action!="INSERT" || module is not ("contratista_documento" or "contratista_documento_conductor"))return null;
  if(!document.TryGetProperty("evidenceId",out var property)||!Guid.TryParse(property.GetString(),out var id))
   throw new ApiDomainException(422,"EVIDENCE_REQUIRED","Seleccione un archivo persistido en su expediente.");
  return await reader.OpenReadAsync(actor.UserId,actor.EmpresaId,id,ct);
 }
 public Task<LegacyV2Envelope> GetMedicalCatalogAsync(CancellationToken ct) => MedicalCatalogAsync("CATALOG","{}",ct);
 public Task<LegacyV2Envelope> GetMedicalAdminCatalogAsync(CancellationToken ct) => MedicalCatalogAsync("CATALOG_ADMIN","{}",ct);
 public Task<LegacyV2Envelope> GetMedicalTypesAsync(CancellationToken ct) => MedicalCatalogAsync("CATALOG_TYPES","{}",ct);
 public Task<LegacyV2Envelope> SaveMedicalCatalogAsync(string json,CancellationToken ct) => MedicalCatalogAsync("CATALOG_SAVE",json,ct);
 private async Task<LegacyV2Envelope> MedicalCatalogAsync(string operation,string json,CancellationToken ct)
 {
  var actor=RequestScope.Require(contexts.HttpContext);
  RequestScope.Permission(contexts.HttpContext,operation=="CATALOG"?"medical:read":"medical:catalog:write");
  using var payload=JsonDocument.Parse(json);
  RequestScope.CheckPayloadScope(payload.RootElement,actor);
  await using var connection=database.CreateConnection();await connection.OpenAsync(ct);
  await using var command=new SqlCommand("dbo.usp_Msst_LegacyV2",connection){CommandType=CommandType.StoredProcedure};
  command.Parameters.AddWithValue("@Modulo","medical");command.Parameters.AddWithValue("@Accion",operation);
  command.Parameters.AddWithValue("@ActorId",actor.UserId);command.Parameters.AddWithValue("@EmpresaId",actor.EmpresaId);
  command.Parameters.AddWithValue("@PayloadJson",payload.RootElement.GetRawText());
  var raw=Convert.ToString(await command.ExecuteScalarAsync(ct))??throw new InvalidDataException("Falta el recibo de catálogo.");
  return JsonSerializer.Deserialize(raw,LegacyV2JsonContext.Default.LegacyV2Envelope)??throw new InvalidDataException("Catálogo inválido.");
 }
 public async Task<LegacyV2Envelope> GetMdfTypesAsync(CancellationToken ct)
 {
  RequestScope.Permission(contexts.HttpContext,"legacy:mdf:read");
  await using var connection=database.CreateConnection();await connection.OpenAsync(ct);
  await using var command=new SqlCommand("SELECT IdType,Code,Label,ParentCode,Version FROM dbo.Org_MdfNodeType WHERE Enabled=1 ORDER BY IdType;",connection);
  await using var reader=await command.ExecuteReaderAsync(ct);
  var result=new LegacyV2Envelope{CodeResponse="05",StatusCode="01",Message="Tipos de nodo disponibles."};
  while(await reader.ReadAsync(ct))result.List.Add(new(){["id"]=reader.GetInt32(0),["code"]=reader.GetString(1),["label"]=reader.GetString(2),["parentCode"]=reader.IsDBNull(3)?null:reader.GetString(3),["version"]=Convert.ToBase64String((byte[])reader.GetValue(4))});
  result.Total=result.List.Count;return result;
 }
 private static async Task<string> ScopeAsync(SqlConnection connection,string query,RequestActor actor,CancellationToken ct)
 {
  var m=Regex.Match(query,@"\bFROM\s+dbo\.([A-Za-z_0-9]+)(?:\s+([A-Za-z_0-9]+))?",RegexOptions.IgnoreCase);
  if(!m.Success)throw new InvalidDataException("Consulta sin origen autorizado.");
  var table=m.Groups[1].Value;var alias=m.Groups[2].Value;
  if(string.IsNullOrEmpty(alias)||new[]{"WHERE","LEFT","INNER","RIGHT","ORDER","JOIN"}.Contains(alias,StringComparer.OrdinalIgnoreCase))alias=table;
  var columns=new HashSet<string>(StringComparer.OrdinalIgnoreCase);
  await using(var command=new SqlCommand("SELECT name FROM sys.columns WHERE object_id=OBJECT_ID(@Table);",connection))
  {command.Parameters.AddWithValue("@Table","dbo."+table);await using var reader=await command.ExecuteReaderAsync(ct);while(await reader.ReadAsync(ct))columns.Add(reader.GetString(0));}
  var prefix="["+alias+"].";var rules=new List<string>();
  if(columns.Contains("MsstDeleted"))rules.Add(prefix+"[MsstDeleted]=0");
  if(columns.Contains("IdEmpresa"))rules.Add(prefix+"[IdEmpresa]=@ActorEmpresa");
  else if(columns.Contains("IdEmpresaCliente"))rules.Add(prefix+"[IdEmpresaCliente]=@ActorEmpresa");
  else if(columns.Contains("IdContratista"))rules.Add("EXISTS(SELECT 1 FROM dbo.Ctr_Contratista scopeCtr WHERE scopeCtr.IdContratista="+prefix+"[IdContratista] AND scopeCtr.IdEmpresaCliente=@ActorEmpresa)");
  else throw new ApiDomainException(403,"CONTEXT_SCOPE_UNAVAILABLE","No se pudo confirmar el ámbito de la consulta.");
  if(actor.ContratistaId.HasValue&&columns.Contains("IdContratista"))rules.Add(prefix+"[IdContratista]=@ActorContractor");
  if(columns.Contains("MsstVersion"))query=query[..m.Index]+", "+prefix+"[MsstVersion] AS version "+query[m.Index..];
  var order=Regex.Match(query,@"\bORDER\s+BY\b",RegexOptions.IgnoreCase);var end=order.Success?order.Index:query.TrimEnd().TrimEnd(';').Length;
  var before=query[..end].TrimEnd();
  return before+(Regex.IsMatch(before,@"\bWHERE\b",RegexOptions.IgnoreCase)?" AND ":" WHERE ")+string.Join(" AND ",rules)+" "+query[end..];
 }
}
