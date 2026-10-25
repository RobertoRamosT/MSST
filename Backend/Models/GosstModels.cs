using System.Text.Json;
using System.Text.Json.Serialization;

namespace Msst.Backend.Models;

// ============================================================================
// 1. AUTENTICACIÓN Y SESIÓN (/sst/login/*)
// ============================================================================
public sealed class LoginRequest
{
    [JsonPropertyName("userName")]
    public string? UserName { get; set; }

    [JsonPropertyName("password")]
    public string? Password { get; set; }

    [JsonPropertyName("ruc")]
    public string? Ruc { get; set; }

    [JsonPropertyName("passCorreo")]
    public string? PassCorreo { get; set; }

    [JsonPropertyName("terminosCondiciones")]
    public int? TerminosCondiciones { get; set; }
}

public sealed class ClasificacionDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = string.Empty;
}

public sealed class PeligroItemDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("idClasificacion")]
    public int IdClasificacion { get; set; }

    [JsonPropertyName("descripcion")]
    public string Descripcion { get; set; } = string.Empty;
}

public sealed class RiesgoItemDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("idClasificacion")]
    public int IdClasificacion { get; set; }

    [JsonPropertyName("descripcion")]
    public string Descripcion { get; set; } = string.Empty;

    [JsonPropertyName("consecuencia")]
    public string? Consecuencia { get; set; }
}

public sealed class LoginResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "01";

    [JsonPropertyName("mensajeRespuesta")]
    public string MensajeRespuesta { get; set; } = string.Empty;

    [JsonPropertyName("PATH")]
    public string Path { get; set; } = "contratista.html";

    [JsonPropertyName("PATH_GOSST")]
    public string PathGosst { get; set; } = "contratista.html";

    [JsonPropertyName("CGESTOP_HEADER_DS")]
    public string TokenJwt { get; set; } = string.Empty;

    [JsonPropertyName("ui")]
    public int Ui { get; set; }

    [JsonPropertyName("idPerfil")]
    public int IdPerfil { get; set; }

    [JsonPropertyName("moduloId")]
    public int ModuloId { get; set; }

    [JsonPropertyName("empresaId")]
    public int EmpresaId { get; set; }

    [JsonPropertyName("empresaNombre")]
    public string EmpresaNombre { get; set; } = string.Empty;

    [JsonPropertyName("habilitarValidacion")]
    public int HabilitarValidacion { get; set; }

    [JsonPropertyName("actPlanillaTrabAuto")]
    public int ActPlanillaTrabAuto { get; set; }

    [JsonPropertyName("cambioUsuarioDirecto")]
    public int CambioUsuarioDirecto { get; set; }

    [JsonPropertyName("fechaVencimientoLicencia")]
    public string FechaVencimientoLicencia { get; set; } = "31/12/2030";

    [JsonPropertyName("usuarioNombre")]
    public string UsuarioNombre { get; set; } = string.Empty;

    [JsonPropertyName("contratistaId")]
    public int? ContratistaId { get; set; }

    [JsonPropertyName("tipoContratistaId")]
    public int? TipoContratistaId { get; set; }

    [JsonPropertyName("perfilContratistaId")]
    public int? PerfilContratistaId { get; set; }

    [JsonPropertyName("contratistaRuc")]
    public string? ContratistaRuc { get; set; }

    [JsonPropertyName("trabajadorId")]
    public int? TrabajadorId { get; set; }

    [JsonPropertyName("trabajadorUnidadId")]
    public int? TrabajadorUnidadId { get; set; }

    [JsonPropertyName("trabajadorAreaId")]
    public int? TrabajadorAreaId { get; set; }

    [JsonPropertyName("trabajadorPuestoId")]
    public int? TrabajadorPuestoId { get; set; }

    [JsonPropertyName("trabajadorFechaPuesto")]
    public string TrabajadorFechaPuesto { get; set; } = "01/01/2026";

    [JsonPropertyName("trabajadorSiteId")]
    public int? TrabajadorSiteId { get; set; }

    [JsonPropertyName("accesoUsuarios")]
    public int AccesoUsuarios { get; set; }

    [JsonPropertyName("VALIDAR_TERMINOS_CONDICION")]
    public int ValidarTerminosCondicion { get; set; } = 1;

    [JsonPropertyName("hasAceptarTerminosCondiciones")]
    public int HasAceptarTerminosCondiciones { get; set; } = 1;

    [JsonPropertyName("hasActualizarClave")]
    public int HasActualizarClave { get; set; }

    [JsonPropertyName("diasRenovacionClave")]
    public int DiasRenovacionClave { get; set; } = 90;

    [JsonPropertyName("mfaPendiente")]
    public int MfaPendiente { get; set; }

    [JsonPropertyName("mfaCorreo")]
    public string MfaCorreo { get; set; } = string.Empty;

    [JsonPropertyName("numEmpresas")]
    public int NumEmpresas { get; set; } = 1;

    [JsonPropertyName("numUnidades")]
    public int NumUnidades { get; set; } = 3;

    [JsonPropertyName("accesoGerencia")]
    public int AccesoGerencia { get; set; } = 1;

    [JsonPropertyName("hasTutorialCap")]
    public int HasTutorialCap { get; set; }

    [JsonPropertyName("fechaHoyTexto")]
    public string FechaHoyTexto { get; set; } = string.Empty;

    [JsonPropertyName("fechaHoyOrdenInversoTexto")]
    public string FechaHoyOrdenInversoTexto { get; set; } = string.Empty;

    [JsonPropertyName("listaClasificaciones")]
    public List<ClasificacionDto> ListaClasificaciones { get; set; } = new();

    [JsonPropertyName("mapPeligros")]
    public Dictionary<string, List<PeligroItemDto>> MapPeligros { get; set; } = new();

    [JsonPropertyName("mapRiesgos")]
    public Dictionary<string, List<RiesgoItemDto>> MapRiesgos { get; set; } = new();
}

// ============================================================================
// 2. EMPRESA Y ORGANIZACIÓN (/sst/empresa/*)
// ============================================================================
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
    public string Color { get; set; } = "#004B87";

    [JsonPropertyName("nombreArea")]
    public string NombreArea { get; set; } = "Seguridad y Salud Ocupacional (SST)";

    [JsonPropertyName("nombreDivision")]
    public string NombreDivision { get; set; } = "División Operaciones Industriales";

    [JsonPropertyName("nombreUnidad")]
    public string NombreUnidad { get; set; } = "Planta Condorcocha - Tarma";

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
    public string Frase { get; set; } = "La seguridad no es un lema, es una forma de vida en cada jornada.";

    [JsonPropertyName("autor")]
    public string Autor { get; set; } = "Cultura de Seguridad HOLCIM - MSST";
}

public sealed class EmpresaMensajeResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "05";

    [JsonPropertyName("list")]
    public List<FraseMotivacionalDto> List { get; set; } = new();
}

// ============================================================================
// 3. MÓDULO CONTRATISTAS, PROYECTOS, TRABAJADORES Y GARITA (/sst/contratista/*)
// ============================================================================
public sealed class ContratistaResumenDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("idContratista")]
    public int IdContratista { get; set; }

    [JsonPropertyName("ruc")]
    public string Ruc { get; set; } = string.Empty;

    [JsonPropertyName("razonSocial")]
    public string RazonSocial { get; set; } = string.Empty;

    [JsonPropertyName("nombreComercial")]
    public string NombreComercial { get; set; } = string.Empty;

    [JsonPropertyName("rubroActividad")]
    public string RubroActividad { get; set; } = string.Empty;

    [JsonPropertyName("representanteLegal")]
    public string RepresentanteLegal { get; set; } = string.Empty;

    [JsonPropertyName("correoContacto")]
    public string CorreoContacto { get; set; } = string.Empty;

    [JsonPropertyName("telefonoContacto")]
    public string TelefonoContacto { get; set; } = string.Empty;

    [JsonPropertyName("porcentajeHomologacion")]
    public decimal PorcentajeHomologacion { get; set; }

    [JsonPropertyName("estadoHomologacion")]
    public string EstadoHomologacion { get; set; } = "APROBADO";

    [JsonPropertyName("estado")]
    public int Estado { get; set; } = 1;
}

public sealed class ProyectoContratistaDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("idProyecto")]
    public int IdProyecto { get; set; }

    [JsonPropertyName("idContratista")]
    public int IdContratista { get; set; }

    [JsonPropertyName("codigo")]
    public string Codigo { get; set; } = string.Empty;

    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [JsonPropertyName("descripcion")]
    public string Descripcion { get; set; } = string.Empty;

    [JsonPropertyName("responsableCliente")]
    public string ResponsableCliente { get; set; } = string.Empty;

    [JsonPropertyName("responsableContratista")]
    public string ResponsableContratista { get; set; } = string.Empty;

    [JsonPropertyName("nivelRiesgo")]
    public string NivelRiesgo { get; set; } = "ALTO";

    [JsonPropertyName("fechaInicio")]
    public string FechaInicio { get; set; } = string.Empty;

    [JsonPropertyName("fechaFin")]
    public string FechaFin { get; set; } = string.Empty;

    [JsonPropertyName("porcentajeCumplimiento")]
    public decimal PorcentajeCumplimiento { get; set; }

    [JsonPropertyName("estado")]
    public int Estado { get; set; } = 1;
}

public sealed class TrabajadorContratistaDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("idTrabajador")]
    public int IdTrabajador { get; set; }

    [JsonPropertyName("idContratista")]
    public int IdContratista { get; set; }

    [JsonPropertyName("idProyecto")]
    public int IdProyecto { get; set; }

    [JsonPropertyName("tipoDocumento")]
    public string TipoDocumento { get; set; } = "DNI";

    [JsonPropertyName("numeroDocumento")]
    public string NumeroDocumento { get; set; } = string.Empty;

    [JsonPropertyName("dni")]
    public string Dni { get; set; } = string.Empty;

    [JsonPropertyName("nombres")]
    public string Nombres { get; set; } = string.Empty;

    [JsonPropertyName("apellidoPaterno")]
    public string ApellidoPaterno { get; set; } = string.Empty;

    [JsonPropertyName("apellidoMaterno")]
    public string ApellidoMaterno { get; set; } = string.Empty;

    [JsonPropertyName("nombreCompleto")]
    public string NombreCompleto { get; set; } = string.Empty;

    [JsonPropertyName("puestoTrabajo")]
    public string PuestoTrabajo { get; set; } = string.Empty;

    [JsonPropertyName("aptitudMedica")]
    public string AptitudMedica { get; set; } = "APTO";

    [JsonPropertyName("sctrSaludVigente")]
    public bool SctrSaludVigente { get; set; } = true;

    [JsonPropertyName("induccionAprobada")]
    public bool InduccionAprobada { get; set; } = true;

    [JsonPropertyName("notaInduccion")]
    public decimal NotaInduccion { get; set; }

    [JsonPropertyName("habilitadoIngreso")]
    public bool HabilitadoIngreso { get; set; } = true;
}

public sealed class VehiculoMaquinariaDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("idContratista")]
    public int IdContratista { get; set; }

    [JsonPropertyName("categoria")]
    public string Categoria { get; set; } = string.Empty;

    [JsonPropertyName("placaCodigo")]
    public string PlacaCodigo { get; set; } = string.Empty;

    [JsonPropertyName("marca")]
    public string Marca { get; set; } = string.Empty;

    [JsonPropertyName("modelo")]
    public string Modelo { get; set; } = string.Empty;

    [JsonPropertyName("anioFabricacion")]
    public int AnioFabricacion { get; set; }

    [JsonPropertyName("soatVigente")]
    public bool SoatVigente { get; set; }

    [JsonPropertyName("revisionTecnicaVigente")]
    public bool RevisionTecnicaVigente { get; set; }

    [JsonPropertyName("habilitadoIngreso")]
    public bool HabilitadoIngreso { get; set; }
}

public sealed class DocumentoNivelDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("idContratista")]
    public int IdContratista { get; set; }

    [JsonPropertyName("nivel")]
    public string Nivel { get; set; } = string.Empty;

    [JsonPropertyName("nombreRequisito")]
    public string NombreRequisito { get; set; } = string.Empty;

    [JsonPropertyName("archivoUrl")]
    public string ArchivoUrl { get; set; } = string.Empty;

    [JsonPropertyName("fechaEmision")]
    public string FechaEmision { get; set; } = string.Empty;

    [JsonPropertyName("fechaVencimiento")]
    public string FechaVencimiento { get; set; } = string.Empty;

    [JsonPropertyName("estadoRevision")]
    public string EstadoRevision { get; set; } = "APROBADO";

    [JsonPropertyName("puntajeValidacionIA")]
    public decimal PuntajeValidacionIA { get; set; }

    [JsonPropertyName("observacionRevision")]
    public string ObservacionRevision { get; set; } = string.Empty;
}

// ============================================================================
// 4. RESPUESTA ESTÁNDAR UNIVERSAL PARA LOS 1,344 ENDPOINTS (/sst/*)
// ============================================================================
public sealed class UniversalGosstResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "05";

    [JsonPropertyName("STATUS_CODE")]
    public string StatusCode { get; set; } = "01";

    [JsonPropertyName("mensajeRespuesta")]
    public string MensajeRespuesta { get; set; } = string.Empty;

    [JsonPropertyName("endpoint")]
    public string Endpoint { get; set; } = string.Empty;

    [JsonPropertyName("modulo")]
    public string Modulo { get; set; } = string.Empty;

    [JsonPropertyName("operacion")]
    public string Operacion { get; set; } = "QUERY";

    [JsonPropertyName("idGenerado")]
    public long IdGenerado { get; set; }

    [JsonPropertyName("nuevoId")]
    public long NuevoId { get; set; }

    [JsonPropertyName("habilitado")]
    public bool Habilitado { get; set; } = false;

    [JsonPropertyName("autorizado")]
    public bool Autorizado { get; set; } = false;

    [JsonPropertyName("estado")]
    public string Estado { get; set; } = string.Empty;

    [JsonPropertyName("motivo")]
    public string Motivo { get; set; } = string.Empty;

    [JsonPropertyName("prerrequisitos")]
    public List<string> Prerrequisitos { get; set; } = new();

    [JsonPropertyName("totalRegistros")]
    public int TotalRegistros { get; set; }

    [JsonPropertyName("list")]
    public List<Dictionary<string, object?>> List { get; set; } = new();

    [JsonPropertyName("lista")]
    public List<Dictionary<string, object?>> Lista { get; set; } = new();

    [JsonPropertyName("listDocumentosNivelConductor")]
    public List<Dictionary<string, object?>> ListDocumentosNivelConductor { get; set; } = new();

    [JsonPropertyName("data")]
    public Dictionary<string, object?> Data { get; set; } = new();
}

public sealed class FirmaEvidenciaResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "05";

    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;
}

public sealed class EstadoSistemaAotDto
{
    [JsonPropertyName("sistema")]
    public string Sistema { get; set; } = "MSST Enterprise (.NET 10 Native AOT + SQL Server On-Premise)";

    [JsonPropertyName("servidorSql")]
    public string ServidorSql { get; set; } = "DESKTOP-LOCAL";

    [JsonPropertyName("baseDatos")]
    public string BaseDatos { get; set; } = "MSST_DB";

    [JsonPropertyName("autenticacionSql")]
    public string AutenticacionSql { get; set; } = "Windows Authentication (Integrated Security)";

    [JsonPropertyName("nativeAotActivo")]
    public bool NativeAotActivo { get; set; } = true;

    [JsonPropertyName("totalEndpointsRegistrados")]
    public int TotalEndpointsRegistrados { get; set; }

    [JsonPropertyName("totalModulos")]
    public int TotalModulos { get; set; } = 43;

    [JsonPropertyName("fechaHoraServidor")]
    public string FechaHoraServidor { get; set; } = string.Empty;
}

// ============================================================================
// MENÚ LATERAL (SIDEBAR) DEL PORTAL CONTRATISTA (/sst/contratista/perfiles)
// Contrato 1:1 con la respuesta original de GOSST: { CODE_RESPONSE, empresa, seccion[] }
// ============================================================================
public sealed class SeccionContratistaDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [JsonPropertyName("icono")]
    public string Icono { get; set; } = "fa-list";

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
    public int IdCompany { get; set; } = 773;

    [JsonPropertyName("name")]
    public string Name { get; set; } = "HOLCIM PERU";

    [JsonPropertyName("color")]
    public string Color { get; set; } = "#004B87";
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

// ============================================================================
// 5. MODELOS PARA FLUJOS DE TRABAJO INTERACTIVOS REGULATORIOS (ISO 45001 / LEY 29783)
// ============================================================================
public sealed class WorkflowEtapaDto
{
    [JsonPropertyName("paso")]
    public int Paso { get; set; }

    [JsonPropertyName("titulo")]
    public string Titulo { get; set; } = string.Empty;

    [JsonPropertyName("subtitulo")]
    public string Subtitulo { get; set; } = string.Empty;

    [JsonPropertyName("responsableRol")]
    public string ResponsableRol { get; set; } = string.Empty;

    [JsonPropertyName("normaLegal")]
    public string NormaLegal { get; set; } = string.Empty;

    [JsonPropertyName("criterioAprobacion")]
    public string CriterioAprobacion { get; set; } = string.Empty;

    [JsonPropertyName("plazoHoras")]
    public int PlazoHoras { get; set; } = 24;

    [JsonPropertyName("requisitosObligatorios")]
    public List<string> RequisitosObligatorios { get; set; } = new();
}

public sealed class WorkflowCasoDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("codigoCaso")]
    public string CodigoCaso { get; set; } = string.Empty;

    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [JsonPropertyName("normaLegal")]
    public string NormaLegal { get; set; } = string.Empty;

    [JsonPropertyName("icono")]
    public string Icono { get; set; } = "fa-sitemap";

    [JsonPropertyName("descripcion")]
    public string Descripcion { get; set; } = string.Empty;

    [JsonPropertyName("ordenVisual")]
    public int OrdenVisual { get; set; }

    [JsonPropertyName("etapas")]
    public List<WorkflowEtapaDto> Etapas { get; set; } = new();
}

public sealed class WorkflowExpedienteDto
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("codigoExpediente")]
    public string CodigoExpediente { get; set; } = string.Empty;

    [JsonPropertyName("tipoCaso")]
    public string TipoCaso { get; set; } = string.Empty;

    [JsonPropertyName("titulo")]
    public string Titulo { get; set; } = string.Empty;

    [JsonPropertyName("sujetoEntidad")]
    public string SujetoEntidad { get; set; } = string.Empty;

    [JsonPropertyName("etapaActual")]
    public int EtapaActual { get; set; }

    [JsonPropertyName("totalEtapas")]
    public int TotalEtapas { get; set; }

    [JsonPropertyName("estadoGeneral")]
    public string EstadoGeneral { get; set; } = "EN_SOLICITUD";

    [JsonPropertyName("responsableActual")]
    public string ResponsableActual { get; set; } = string.Empty;

    [JsonPropertyName("rolAprobadorActual")]
    public string RolAprobadorActual { get; set; } = string.Empty;

    [JsonPropertyName("fechaInicio")]
    public string FechaInicio { get; set; } = string.Empty;

    [JsonPropertyName("fechaUltimoMovimiento")]
    public string FechaUltimoMovimiento { get; set; } = string.Empty;

    [JsonPropertyName("cumplimientoPorc")]
    public int CumplimientoPorc { get; set; }

    [JsonPropertyName("qrHash")]
    public string QrHash { get; set; } = string.Empty;

    [JsonPropertyName("observaciones")]
    public string Observaciones { get; set; } = string.Empty;

    [JsonPropertyName("requisitosValidados")]
    public string RequisitosValidados { get; set; } = "[]";
}

public sealed class WorkflowGuardarExpedienteRequest
{
    [JsonPropertyName("codigoCaso")]
    public string CodigoCaso { get; set; } = "HOMOLOGACION_CONTRATISTA";

    [JsonPropertyName("idEmpresa")]
    public int IdEmpresa { get; set; } = 773;

    [JsonPropertyName("titulo")]
    public string Titulo { get; set; } = string.Empty;

    [JsonPropertyName("sujetoEntidad")]
    public string SujetoEntidad { get; set; } = string.Empty;

    [JsonPropertyName("responsable")]
    public string Responsable { get; set; } = "AUDITOR LIDER SSOMA";

    [JsonPropertyName("observaciones")]
    public string? Observaciones { get; set; }
}

public sealed class WorkflowTransicionRequest
{
    [JsonPropertyName("codigo")]
    public string Codigo { get; set; } = string.Empty;

    [JsonPropertyName("tipo")]
    public string Tipo { get; set; } = "HOMOLOGACION_CONTRATISTA";

    [JsonPropertyName("etapa")]
    public int Etapa { get; set; } = 1;

    [JsonPropertyName("estado")]
    public string Estado { get; set; } = "EN_PROCESO";

    [JsonPropertyName("accion")]
    public string Accion { get; set; } = "Transición de etapa";

    [JsonPropertyName("usuario")]
    public string Usuario { get; set; } = "Auditor SSOMA";

    [JsonPropertyName("hashFirma")]
    public string? HashFirma { get; set; }

    [JsonPropertyName("comentarios")]
    public string? Comentarios { get; set; }

    [JsonPropertyName("requisitosValidados")]
    public string? RequisitosValidados { get; set; }

    [JsonPropertyName("rolAprobador")]
    public string? RolAprobador { get; set; }
}

public sealed class WorkflowTrazabilidadDto
{
    [JsonPropertyName("fechaHora")]
    public string FechaHora { get; set; } = string.Empty;

    [JsonPropertyName("etapa")]
    public string Etapa { get; set; } = string.Empty;

    [JsonPropertyName("accion")]
    public string Accion { get; set; } = string.Empty;

    [JsonPropertyName("responsable")]
    public string Responsable { get; set; } = string.Empty;

    [JsonPropertyName("estadoResultante")]
    public string EstadoResultante { get; set; } = string.Empty;

    [JsonPropertyName("hashCriptografico")]
    public string HashCriptografico { get; set; } = string.Empty;
}

public sealed class WorkflowCasosResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "05";

    [JsonPropertyName("casos")]
    public List<WorkflowCasoDto> Casos { get; set; } = new();
}

public sealed class WorkflowExpedientesResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "05";

    [JsonPropertyName("total")]
    public int Total { get; set; }

    [JsonPropertyName("list")]
    public List<WorkflowExpedienteDto> List { get; set; } = new();

    [JsonPropertyName("expedientes")]
    public List<WorkflowExpedienteDto> Expedientes { get; set; } = new();
}

public sealed class WorkflowTrazabilidadResponse
{
    [JsonPropertyName("CODE_RESPONSE")]
    public string CodeResponse { get; set; } = "05";

    [JsonPropertyName("codigoExpediente")]
    public string CodigoExpediente { get; set; } = string.Empty;

    [JsonPropertyName("trazabilidad")]
    public List<WorkflowTrazabilidadDto> Trazabilidad { get; set; } = new();
}
