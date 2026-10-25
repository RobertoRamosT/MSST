/**
 * ============================================================================
 * OneSST Enterprise — Modelos de Datos y Definiciones de Interfaces Centralizadas
 * Pila Tecnológica: Angular v22+ (Zoneless + Signals) y .NET 10 Native AOT
 * ============================================================================
 */

// ============================================================================
// 1. WORKFLOW INTERACTIVO Y EXPEDIENTES SSOMA (Persistido en SQL Server)
// ============================================================================

export type TipoWorkflowCaso =
  | 'HOMOLOGACION_CONTRATISTA'
  | 'PETAR_ALTO_RIESGO'
  | 'ACREDITACION_PERSONAL'
  | 'INVESTIGACION_ACCIDENTES'
  | 'INSPECCIONES_SSOMA'
  | 'VIGILANCIA_MEDICA';

export type EstadoExpedienteWorkflow =
  | 'EN_SOLICITUD'
  | 'EN_EVALUACION'
  | 'APROBADO_CONFORME'
  | 'OBSERVADO_BLOQUEADO'
  | 'CERRADO_AUDITADO';

export type EstadoEtapaWorkflow =
  | 'COMPLETO'
  | 'EN_CURSO'
  | 'PENDIENTE'
  | 'OBSERVADO';

export interface EtapaWorkflowCaso {
  paso: number;
  titulo: string;
  subtitulo: string;
  responsableRol: string;
  normaLegal: string;
  criterioAprobacion?: string;
  plazoHoras?: number;
  requisitosObligatorios: string[];
  estado: EstadoEtapaWorkflow;
}

export interface ExpedienteWorkflowItem {
  id: number;
  codigoExpediente: string;
  tipoCaso?: string;
  titulo: string;
  sujetoEntidad: string;
  etapaActual: number;
  totalEtapas: number;
  estadoGeneral: EstadoExpedienteWorkflow;
  responsableActual: string;
  rolAprobadorActual?: string;
  fechaInicio: string;
  fechaUltimoMovimiento: string;
  cumplimientoPorc: number;
  qrHash: string;
  observaciones: string;
  requisitosValidados?: string;
}

export interface EventoTrazabilidad {
  fechaHora: string;
  etapa: string;
  accion: string;
  responsable: string;
  estadoResultante: string;
  hashCriptografico?: string;
}

export interface CasoWorkflowCatalogo {
  id: TipoWorkflowCaso;
  nombre: string;
  icono: string;
  norma: string;
  etapas?: EtapaWorkflowCaso[];
}

// ============================================================================
// 2. ANALÍTICA VISUAL, FICHA 360° Y CREDENCIAL QR
// ============================================================================

export interface AnaliticaVista {
  registros: number;
  tablas: number;
  conEstado: number;
  conformes: number;
  enProceso: number;
  observados: number;
  porcConformes: number;
}

export interface CampoFicha360 {
  etiqueta: string;
  valor: string;
}

export interface EtapaWorkflowProceso {
  paso: number;
  titulo: string;
  subtitulo: string;
  icono: string;
}

export interface EventoBitacoraWorkflow {
  fecha: string;
  etapa: string;
  accion: string;
  responsable: string;
  estadoResultante: string;
}

export interface Ficha360Extendida {
  titulo: string;
  modulo: string;
  codigoAuditoria: string;
  etapaActual: number;
  estadoActual: string;
  observado: boolean;
  qrPaths: string;
  campos: CampoFicha360[];
}

export interface DatosCredencialQr {
  codigo: string;
  titular: string;
  subtitulo: string;
  empresa: string;
  modulo: string;
  estado: string;
  vigencia: string;
  urlVerificacion: string;
  qrPaths: string;
}

// ============================================================================
// 3. SEGURIDAD, ACCESOS Y PERFILES (MÓDULO 01)
// ============================================================================

export interface PermisoModuloItem {
  codigo: string;
  modulo: string;
  lectura: boolean;
  escritura: boolean;
  aprobacion: boolean;
  exportacion: boolean;
}

export interface PerfilUsuarioItem {
  id: number;
  nombre: string;
  descripcion: string;
  usuariosAsignados: number;
  nivelAcceso: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

// ============================================================================
// 4. COLABORADORES, COMITÉ SST Y ELECCIONES (MÓDULO 04 Y 05)
// ============================================================================

export interface TrabajadorPropioItem {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  area: string;
  emoEstado: 'APTO' | 'OBSERVADO' | 'VENCIDO';
  sctrEstado: 'VIGENTE' | 'POR_VENCER' | 'NO_TIENE';
  induccionEstado: 'APROBADO' | 'PENDIENTE';
  estadoGarita: 'HABILITADO' | 'BLOQUEADO';
}

export interface ReunionComiteItem {
  id: number;
  numeroActa: string;
  fecha: string;
  tipoReunion: 'ORDINARIA' | 'EXTRAORDINARIA';
  temaPrincipal: string;
  estadoAcuerdos: 'EN_PROCESO' | 'CUMPLIDO' | 'OBSERVADO';
  asistenciaPorc: number;
}

// ============================================================================
// 5. PREVENCIÓN, MATRICES IPERC E INSPECCIONES (MÓDULO 06)
// ============================================================================

export interface FilaIpercItem {
  id: number;
  proceso: string;
  actividad: string;
  peligro: string;
  riesgo: string;
  indiceSeveridad: number;
  indiceProbabilidad: number;
  nivelRiesgoPuro: 'ALTO' | 'MEDIO' | 'BAJO';
  medidaControl: string;
  nivelRiesgoResidual: 'MEDIO' | 'BAJO';
}

export interface InspeccionItem {
  id: number;
  codigoInspeccion: string;
  tipo: 'PLANEADA' | 'NO_PLANEADA' | 'INOPINADA';
  areaSede: string;
  fechaEjecucion: string;
  inspector: string;
  hallazgosCriticos: number;
  estado: 'CONFORME' | 'OBSERVADA' | 'EN_SUBSANACION';
}

// ============================================================================
// 6. ACCIDENTES, CASI ACCIDENTES Y PLANES DE MEJORA (MÓDULO 07)
// ============================================================================

export interface AccidenteIncidenteItem {
  id: number;
  codigoEvento: string;
  tipoEvento: 'ACCIDENTE_LEVE' | 'ACCIDENTE_INCAPACITANTE' | 'CASI_ACCIDENTE' | 'INCIDENTE_PELIGROSO';
  fechaOcurrencia: string;
  trabajadorAfectado: string;
  diasPerdidos: number;
  causaRaiz: string;
  estadoInvestigacion: 'ABIERTA' | 'EN_INVESTIGACION' | 'CERRADA_MINTRA';
}

// ============================================================================
// 7. CAPACITACIONES, EPP Y PROCEDIMIENTOS (MÓDULO 08)
// ============================================================================

export interface CursoCapacitacionItem {
  id: number;
  codigoCurso: string;
  nombreCurso: string;
  modalidad: 'PRESENCIAL' | 'VIRTUAL_LMS';
  horasAcademicas: number;
  aprobados: number;
  asistentesTotales: number;
  estado: 'PROGRAMADO' | 'EJECUTADO' | 'CERRADO';
}

export interface EquipoEppItem {
  id: number;
  codigoEpp: string;
  descripcion: string;
  categoria: 'CABEZA' | 'OJOS_ROSTRO' | 'AUDITIVA' | 'RESPIRATORIA' | 'MANOS' | 'PIES' | 'TRABAJO_EN_ALTURA';
  stockActual: number;
  puntoReorden: number;
  estadoStock: 'NORMAL' | 'POR_AGOTAR' | 'CRITICO';
}

// ============================================================================
// 8. SALUD OCUPACIONAL, EMO Y VIGILANCIA MÉDICA (MÓDULO 09)
// ============================================================================

export interface ExamenMedicoItem {
  id: number;
  dni: string;
  trabajador: string;
  empresa: string;
  tipoExamen: 'INGRESO' | 'PERIODICO' | 'RETIRO' | 'REUBICACION';
  fechaRealizacion: string;
  aptitudMedica: 'APTO' | 'APTO_CON_RESTRICCIONES' | 'NO_APTO';
  restricciones: string;
  proximoVencimiento: string;
}

// ============================================================================
// 9. AUDITORÍAS, REQUISITOS LEGALES Y MEDIO AMBIENTE (MÓDULOS 10 Y 11)
// ============================================================================

export interface AuditoriaSstItem {
  id: number;
  codigoAuditoria: string;
  tipo: 'INTERNA_ISO' | 'EXTERNA_MINTRA' | 'HOMOLOGACION';
  alcance: string;
  fechaAuditoria: string;
  auditorLider: string;
  noConformidadesMayores: number;
  noConformidadesMenores: number;
  oportunidadesMejora: number;
  estado: 'PROGRAMADA' | 'EN_AUDITORIA' | 'CERRADA';
}

export interface ResiduoSolidoItem {
  id: number;
  codigoManifiesto: string;
  tipoResiduo: 'PELIGROSO' | 'NO_PELIGROSO' | 'BIOMEDICO' | 'RECICLABLE';
  descripcion: string;
  pesoKg: number;
  empresaOperadora: string;
  fechaDisposicion: string;
  estadoDisposicion: 'ALMACENADO' | 'RETIRADO_CONFORME';
}

// ============================================================================
// 10. BUSINESS INTELLIGENCE, ESTADÍSTICAS E IA (MÓDULO 12)
// ============================================================================

export interface EstadisticaMensualItem {
  mes: string;
  hhtTotal: number;
  accidentesLeves: number;
  accidentesIncapacitantes: number;
  indiceFrecuencia: number;
  indiceSeveridad: number;
  indiceAccidentabilidad: number;
  metaCumplida: boolean;
}
