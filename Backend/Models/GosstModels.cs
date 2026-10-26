using System.Text.Json.Serialization;
namespace Msst.Backend.Models;

public sealed class EmpresaDetalleDto
{
    [JsonPropertyName("idCompany")]
    public int IdCompany { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("ruc")]
    public string Ruc { get; set; } = string.Empty;

    [JsonPropertyName("codigo")]
    public string Codigo { get; set; } = string.Empty;

    [JsonPropertyName("color")]
    public string Color { get; set; } = string.Empty;

    [JsonPropertyName("nombreArea")]
    public string NombreArea { get; set; } = string.Empty;

    [JsonPropertyName("nombreDivision")]
    public string NombreDivision { get; set; } = string.Empty;

    [JsonPropertyName("nombreUnidad")]
    public string NombreUnidad { get; set; } = string.Empty;

    [JsonPropertyName("isProyectoSimple")]
    public int IsProyectoSimple { get; set; }
}

public sealed class EmpresaByIdResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "05";

    [JsonPropertyName("empresa")]
    public EmpresaDetalleDto Empresa { get; set; } = new();
}

public sealed class FraseMotivacionalDto
{
    [JsonPropertyName("frase")]
    public string Frase { get; set; } = string.Empty;

    [JsonPropertyName("autor")]
    public string Autor { get; set; } = string.Empty;
}

public sealed class EmpresaMensajeResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "05";

    [JsonPropertyName("list")]
    public List<FraseMotivacionalDto> List { get; set; } = new();
}

public sealed class EstadoSistemaAotDto {
 public string Sistema {get;set;}="MSST";
 public string BaseDatos {get;set;}=string.Empty;
 public int TotalEndpointsRegistrados {get;set;}
 public string FechaHoraServidor {get;set;}=string.Empty;
}

public sealed class SeccionContratistaDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [JsonPropertyName("icono")]
    public string Icono { get; set; } = string.Empty;

    [JsonPropertyName("seccionPadreId")]
    public int? SeccionPadreId { get; set; }

    [JsonPropertyName("moduloId")]
    public int? ModuloId { get; set; }

    [JsonPropertyName("tipoExamenId")]
    public int? TipoExamenId { get; set; }

    [JsonPropertyName("numAlerta")]
    public int NumAlerta { get; set; }

    [JsonPropertyName("textoAyuda")]
    public string? TextoAyuda { get; set; }

    [JsonPropertyName("orden")]
    public int Orden { get; set; }

    [JsonPropertyName("esDestacado")]
    public bool EsDestacado { get; set; }
}

public sealed class EmpresaPerfilContratistaDto
{
    [JsonPropertyName("idCompany")]
    public int IdCompany { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("color")]
    public string Color { get; set; } = string.Empty;
}

public sealed class ContratistaPerfilesResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "05";

    [JsonPropertyName("empresa")]
    public EmpresaPerfilContratistaDto Empresa { get; set; } = new();

    [JsonPropertyName("seccion")]
    public List<SeccionContratistaDto> Seccion { get; set; } = new();
}
