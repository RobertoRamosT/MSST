using System.Text.Json.Serialization;
using Msst.Backend.Models;
namespace Msst.Backend.Serialization;
[JsonSourceGenerationOptions(PropertyNamingPolicy=JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(EmpresaDetalleDto))]
[JsonSerializable(typeof(EmpresaByIdResponse))]
[JsonSerializable(typeof(FraseMotivacionalDto))]
[JsonSerializable(typeof(EmpresaMensajeResponse))]
[JsonSerializable(typeof(EstadoSistemaAotDto))]
[JsonSerializable(typeof(SeccionContratistaDto))]
[JsonSerializable(typeof(EmpresaPerfilContratistaDto))]
[JsonSerializable(typeof(ContratistaPerfilesResponse))]
public partial class MsstJsonContext:JsonSerializerContext;
