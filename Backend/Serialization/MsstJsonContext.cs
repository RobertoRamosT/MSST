using System.Text.Json;
using System.Text.Json.Serialization;
using Msst.Backend.Models;

namespace Msst.Backend.Serialization;

/// <summary>
/// Contexto de serialización JSON generado en tiempo de compilación (Source Generator)
/// 100% compatible con .NET 10 Native AOT (Cero reflexión en tiempo de ejecución).
/// </summary>
[JsonSourceGenerationOptions(
    PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    WriteIndented = false)]
[JsonSerializable(typeof(LoginRequest))]
[JsonSerializable(typeof(LoginResponse))]
[JsonSerializable(typeof(ClasificacionDto))]
[JsonSerializable(typeof(List<ClasificacionDto>))]
[JsonSerializable(typeof(PeligroItemDto))]
[JsonSerializable(typeof(List<PeligroItemDto>))]
[JsonSerializable(typeof(Dictionary<string, List<PeligroItemDto>>))]
[JsonSerializable(typeof(RiesgoItemDto))]
[JsonSerializable(typeof(List<RiesgoItemDto>))]
[JsonSerializable(typeof(Dictionary<string, List<RiesgoItemDto>>))]
[JsonSerializable(typeof(EmpresaDetalleDto))]
[JsonSerializable(typeof(EmpresaByIdResponse))]
[JsonSerializable(typeof(FraseMotivacionalDto))]
[JsonSerializable(typeof(List<FraseMotivacionalDto>))]
[JsonSerializable(typeof(EmpresaMensajeResponse))]
[JsonSerializable(typeof(ContratistaResumenDto))]
[JsonSerializable(typeof(List<ContratistaResumenDto>))]
[JsonSerializable(typeof(ProyectoContratistaDto))]
[JsonSerializable(typeof(List<ProyectoContratistaDto>))]
[JsonSerializable(typeof(TrabajadorContratistaDto))]
[JsonSerializable(typeof(List<TrabajadorContratistaDto>))]
[JsonSerializable(typeof(VehiculoMaquinariaDto))]
[JsonSerializable(typeof(List<VehiculoMaquinariaDto>))]
[JsonSerializable(typeof(DocumentoNivelDto))]
[JsonSerializable(typeof(List<DocumentoNivelDto>))]
[JsonSerializable(typeof(UniversalGosstResponse))]
[JsonSerializable(typeof(FirmaEvidenciaResponse))]
[JsonSerializable(typeof(EstadoSistemaAotDto))]
[JsonSerializable(typeof(SeccionContratistaDto))]
[JsonSerializable(typeof(List<SeccionContratistaDto>))]
[JsonSerializable(typeof(EmpresaPerfilContratistaDto))]
[JsonSerializable(typeof(ContratistaPerfilesResponse))]
[JsonSerializable(typeof(WorkflowEtapaDto))]
[JsonSerializable(typeof(List<WorkflowEtapaDto>))]
[JsonSerializable(typeof(WorkflowCasoDto))]
[JsonSerializable(typeof(List<WorkflowCasoDto>))]
[JsonSerializable(typeof(WorkflowExpedienteDto))]
[JsonSerializable(typeof(List<WorkflowExpedienteDto>))]
[JsonSerializable(typeof(WorkflowGuardarExpedienteRequest))]
[JsonSerializable(typeof(WorkflowTransicionRequest))]
[JsonSerializable(typeof(WorkflowTrazabilidadDto))]
[JsonSerializable(typeof(List<WorkflowTrazabilidadDto>))]
[JsonSerializable(typeof(WorkflowCasosResponse))]
[JsonSerializable(typeof(WorkflowExpedientesResponse))]
[JsonSerializable(typeof(WorkflowTrazabilidadResponse))]
[JsonSerializable(typeof(Dictionary<string, object?>))]
[JsonSerializable(typeof(List<Dictionary<string, object?>>))]
[JsonSerializable(typeof(JsonElement))]
[JsonSerializable(typeof(string))]
[JsonSerializable(typeof(int))]
[JsonSerializable(typeof(long))]
[JsonSerializable(typeof(decimal))]
[JsonSerializable(typeof(bool))]
public partial class MsstJsonContext : JsonSerializerContext
{
}
