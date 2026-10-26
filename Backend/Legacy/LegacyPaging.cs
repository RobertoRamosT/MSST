using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.DataProtection;
using Msst.Backend.Data;
namespace Msst.Backend.Legacy;

public sealed record LegacyPage(int PageSize,int Returned,int MaximumPageSize,bool HasMore,string? NextCursor,string Sort,string Label);
internal sealed record PageCursor(int UserId,int EmpresaId,int? ContractorId,string Route,string Search,int PageSize,long AfterId,DateTimeOffset ExpiresAt);
public sealed record PageSelection(int Size,long AfterId,string Search,bool Compact);
[JsonSerializable(typeof(PageCursor))]
internal partial class PagingJsonContext:JsonSerializerContext;
public sealed class LegacyPaging
{
 private readonly IDataProtector protector;
 private readonly int defaultSize,maximumSize,cursorMinutes;
 public LegacyPaging(IDataProtectionProvider keys,IConfiguration config)
 {
  protector=keys.CreateProtector("MSST.Legacy.Paging.v1");
  defaultSize=Read(config,"Data:DefaultPageSize",1,200);
  maximumSize=Read(config,"Data:MaximumPageSize",defaultSize,200);
  cursorMinutes=Read(config,"Data:CursorMinutes",1,1440);
 }
 private static int Read(IConfiguration c,string name,int min,int max)=>
  int.TryParse(c[name],out var n)&&n>=min&&n<=max?n:throw new InvalidOperationException("Configure "+name+" con un límite válido.");
 public int MaximumSize=>maximumSize;
 public PageSelection Parse(JsonElement payload,HttpContext context,RequestActor actor,string route)
 {
  var size=defaultSize;
  if(payload.TryGetProperty("pageSize",out var p))
  {
   var text=p.ValueKind==JsonValueKind.String?p.GetString():p.GetRawText();
   if(!int.TryParse(text,out size)||size<1||size>maximumSize)throw new ApiDomainException(400,"PAGE_SIZE_INVALID","Seleccione un tamaño de página dentro del límite permitido.");
  }
  if(payload.TryGetProperty("search",out var searchValue)&&searchValue.ValueKind is not (JsonValueKind.String or JsonValueKind.Null))
   throw new ApiDomainException(400,"SEARCH_INVALID","Ingrese un texto de búsqueda válido.");
  if(payload.TryGetProperty("cursor",out var cursorValue)&&cursorValue.ValueKind is not (JsonValueKind.String or JsonValueKind.Null))
   throw new ApiDomainException(400,"PAGE_CURSOR_INVALID","Vuelva al inicio del listado.");
  var search=payload.TryGetProperty("search",out var s)&&s.ValueKind!=JsonValueKind.Null?s.GetString()?.Trim()??"":"";
  if(search.Length>200)throw new ApiDomainException(400,"SEARCH_TOO_LONG","La búsqueda supera el límite permitido.");
  long after=0;
  if(payload.TryGetProperty("cursor",out var c)&&c.ValueKind!=JsonValueKind.Null&&!string.IsNullOrWhiteSpace(c.GetString()))
  {
   PageCursor value;
   try{value=JsonSerializer.Deserialize(protector.Unprotect(c.GetString()!),PagingJsonContext.Default.PageCursor)??throw new JsonException();}
   catch(Exception error)when(error is CryptographicException or JsonException)
   {throw new ApiDomainException(400,"PAGE_CURSOR_INVALID","La página no es válida. Vuelva al inicio del listado.");}
   if(value.UserId!=actor.UserId||value.EmpresaId!=actor.EmpresaId||value.ContractorId!=actor.ContratistaId||value.Route!=route)
    throw new ApiDomainException(403,"PAGE_SCOPE_INVALID","La página no corresponde a su contexto autorizado.");
   if(value.ExpiresAt<=DateTimeOffset.UtcNow||value.Search!=search||value.PageSize!=size||value.AfterId<0)
    throw new ApiDomainException(409,"PAGE_CURSOR_EXPIRED","La consulta cambió o venció. Vuelva al inicio del listado.");
   after=value.AfterId;
  }
  return new(size,after,search,context.Request.Headers["X-Msst-List-Contract"]=="3");
 }
 public string Next(RequestActor actor,string route,PageSelection page,long after)=>
  protector.Protect(JsonSerializer.Serialize(new PageCursor(actor.UserId,actor.EmpresaId,actor.ContratistaId,route,page.Search,page.Size,after,DateTimeOffset.UtcNow.AddMinutes(cursorMinutes)),PagingJsonContext.Default.PageCursor));
}
