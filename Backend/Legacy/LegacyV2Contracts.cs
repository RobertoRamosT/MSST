using System.Text.Json;
using System.Text.Json.Serialization;
namespace Msst.Backend.Legacy;
public sealed class LegacyV2Envelope
{
 [JsonPropertyName("CODE_RESPONSE")] public string CodeResponse {get;set;} = "";
 [JsonPropertyName("STATUS_CODE")] public string StatusCode {get;set;} = "";
 [JsonPropertyName("mensajeRespuesta")] public string Message {get;set;} = "";
 [JsonPropertyName("requestId")] public Guid? RequestId {get;set;}
 [JsonPropertyName("idGenerado")] public long Id {get;set;}
 [JsonPropertyName("nuevoId")] public long NewId {get;set;}
 [JsonPropertyName("snapshot")] public LegacyV2Snapshot? Snapshot {get;set;}
 [JsonPropertyName("list")] public List<Dictionary<string,object?>> List {get;set;} = [];
 [JsonPropertyName("lista")] public List<Dictionary<string,object?>> Lista {get;set;} = [];
 [JsonPropertyName("data")] public Dictionary<string,object?> Data {get;set;} = [];
 [JsonPropertyName("listDocumentosNivelConductor")] public List<Dictionary<string,object?>> DriverDocuments {get;set;} = [];
 [JsonPropertyName("totalRegistros")] public int Total {get;set;}
}
public sealed class LegacyV2Snapshot
{
 [JsonPropertyName("record")] public Dictionary<string,object?> Record {get;set;} = [];
 [JsonPropertyName("version")] public string Version {get;set;} = "";
}
[JsonSourceGenerationOptions]
[JsonSerializable(typeof(LegacyV2Envelope))]
[JsonSerializable(typeof(JsonElement))]
[JsonSerializable(typeof(string))]
[JsonSerializable(typeof(int))]
[JsonSerializable(typeof(long))]
[JsonSerializable(typeof(short))]
[JsonSerializable(typeof(byte))]
[JsonSerializable(typeof(decimal))]
[JsonSerializable(typeof(bool))]
[JsonSerializable(typeof(double))]
[JsonSerializable(typeof(float))]
internal partial class LegacyV2JsonContext : JsonSerializerContext;
