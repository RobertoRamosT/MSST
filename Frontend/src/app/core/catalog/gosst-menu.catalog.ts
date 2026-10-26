/**
 * Catálogo del Menú Único "Gestión SST" (Sidebar Auto-Hidden) de OneSST.
 *
 * Estructura corporativa de producto terminado con los 12 módulos integrales
 * de Seguridad, Salud Ocupacional y Medio Ambiente y sus submenús operativos.
 */

export type ModuloActivoId =
  | 'MOD_01'
  | 'MOD_02'
  | 'MOD_03'
  | 'MOD_04'
  | 'MOD_05'
  | 'MOD_06'
  | 'MOD_07'
  | 'MOD_08'
  | 'MOD_09'
  | 'MOD_10'
  | 'MOD_11'
  | 'MOD_12';

export interface MsstMenuItem {
  /** Identificador único dentro del menú (ej. 'M03', 'M03:3A', 'M06:IPERC'). */
  key: string;
  nombre: string;
  icono: string;
  modulo?: ModuloActivoId;
  tab?: string;
  alerta?: number;
  destacado?: boolean;
  ayuda?: string | null;
  hijos?: MsstMenuItem[];
}

export interface MsstMenuGrupo {
  key: string;
  titulo: string;
  items: MsstMenuItem[];
}

/** Menú único "Gestión SST" con los 12 módulos corporativos y sus submenús operativos. */
export const MENU_MODULOS_MSST: MsstMenuItem[] = [
  {
    key: 'M01',
    nombre: 'Seguridad y Accesos',
    icono: 'fa-lock',
    modulo: 'MOD_01',
    hijos: [
      { key: 'M01:PERFILES', nombre: 'Perfiles y Roles', icono: 'fa-id-badge', modulo: 'MOD_01', tab: 'PERFILES' },
      { key: 'M01:USUARIOS', nombre: 'Usuarios y Credenciales', icono: 'fa-user', modulo: 'MOD_01', tab: 'USUARIOS' },
      { key: 'M01:CONFIGURACION', nombre: 'Parámetros y Licencia', icono: 'fa-cog', modulo: 'MOD_01', tab: 'CONFIGURACION' }
    ]
  },
  {
    key: 'M02',
    nombre: 'Organización y Puestos',
    icono: 'fa-sitemap',
    modulo: 'MOD_02',
    hijos: [
      { key: 'M02:EMPRESA', nombre: 'Empresas, Sedes y Áreas', icono: 'fa-building', modulo: 'MOD_02', tab: 'EMPRESA' },
      { key: 'M02:MDF', nombre: 'Mapa de Procesos (MDF)', icono: 'fa-share-alt', modulo: 'MOD_02', tab: 'MDF' },
      { key: 'M02:PUESTOS', nombre: 'Puestos y Solicitudes', icono: 'fa-briefcase', modulo: 'MOD_02', tab: 'PUESTOS' }
    ]
  },
  {
    key: 'M03',
    nombre: 'Gestión de Contratistas',
    icono: 'fa-handshake-o',
    modulo: 'MOD_03',
    destacado: true,
    hijos: [
      { key: 'M03:3A', nombre: 'Homologación y Empresas', icono: 'fa-certificate', modulo: 'MOD_03', tab: '3A' },
      { key: 'M03:3B', nombre: 'Proyectos y Matrices', icono: 'fa-folder-open', modulo: 'MOD_03', tab: '3B' },
      { key: 'M03:3C', nombre: 'Personal y Flota Vehicular', icono: 'fa-users', modulo: 'MOD_03', tab: '3C' },
      { key: 'M03:3D', nombre: 'Legajo Documental, PETAR y Garita', icono: 'fa-shield', modulo: 'MOD_03', tab: '3D' }
    ]
  },
  {
    key: 'M04',
    nombre: 'Portal del Colaborador',
    icono: 'fa-calendar-check-o',
    modulo: 'MOD_04',
    hijos: [
      { key: 'M04:BANDEJA', nombre: 'Bandeja y Firma Digital', icono: 'fa-inbox', modulo: 'MOD_04', tab: 'BANDEJA' },
      { key: 'M04:CALENDARIO', nombre: 'Calendario Anual PASST', icono: 'fa-calendar', modulo: 'MOD_04', tab: 'CALENDARIO' },
      { key: 'M04:AUTOSERVICIO', nombre: 'Autoservicio y Reportes', icono: 'fa-hand-pointer-o', modulo: 'MOD_04', tab: 'AUTOSERVICIO' }
    ]
  },
  {
    key: 'M05',
    nombre: 'Personal y Comité SST',
    icono: 'fa-users',
    modulo: 'MOD_05',
    hijos: [
      { key: 'M05:TRABAJADORES', nombre: 'Padrón de Colaboradores', icono: 'fa-address-book', modulo: 'MOD_05', tab: 'TRABAJADORES' },
      { key: 'M05:COMITE', nombre: 'Comité Paritario SST', icono: 'fa-users', modulo: 'MOD_05', tab: 'COMITE' },
      { key: 'M05:ELECCIONES', nombre: 'Elecciones Virtuales', icono: 'fa-check-square-o', modulo: 'MOD_05', tab: 'ELECCIONES' }
    ]
  },
  {
    key: 'M06',
    nombre: 'Prevención de Riesgos',
    icono: 'fa-crosshairs',
    modulo: 'MOD_06',
    hijos: [
      { key: 'M06:IPERC', nombre: 'Matriz IPERC', icono: 'fa-th', modulo: 'MOD_06', tab: 'IPERC' },
      { key: 'M06:INSPECCIONES', nombre: 'Inspecciones de Seguridad', icono: 'fa-search', modulo: 'MOD_06', tab: 'INSPECCIONES' },
      { key: 'M06:OPT_ACTOS', nombre: 'OPT y Actos Subestándar', icono: 'fa-eye', modulo: 'MOD_06', tab: 'OPT_ACTOS' }
    ]
  },
  {
    key: 'M07',
    nombre: 'Accidentes y Mejora',
    icono: 'fa-ambulance',
    modulo: 'MOD_07',
    hijos: [
      { key: 'M07:ACCIDENTES', nombre: 'Investigación de Accidentes', icono: 'fa-warning', modulo: 'MOD_07', tab: 'ACCIDENTES' },
      { key: 'M07:ACCIONES_MEJORA', nombre: 'Planes de Acción (SAC/SAP)', icono: 'fa-line-chart', modulo: 'MOD_07', tab: 'ACCIONES_MEJORA' }
    ]
  },
  {
    key: 'M08',
    nombre: 'Capacitación, EPP y PETS',
    icono: 'fa-graduation-cap',
    modulo: 'MOD_08',
    hijos: [
      { key: 'M08:CAPACITACION', nombre: 'Capacitaciones y Aula Virtual', icono: 'fa-laptop', modulo: 'MOD_08', tab: 'CAPACITACION' },
      { key: 'M08:EPP', nombre: 'Equipos de Protección (EPP)', icono: 'fa-fire-extinguisher', modulo: 'MOD_08', tab: 'EPP' },
      { key: 'M08:PROCEDIMIENTOS', nombre: 'Procedimientos (PETS)', icono: 'fa-file-text-o', modulo: 'MOD_08', tab: 'PROCEDIMIENTOS' }
    ]
  },
  {
    key: 'M09',
    nombre: 'Salud Ocupacional',
    icono: 'fa-heartbeat',
    modulo: 'MOD_09',
    hijos: [
      { key: 'M09:EMO', nombre: 'Exámenes Médicos (EMO)', icono: 'fa-stethoscope', modulo: 'MOD_09', tab: 'EMO' },
      { key: 'M09:COVID', nombre: 'Vigilancia Epidemiológica', icono: 'fa-medkit', modulo: 'MOD_09', tab: 'COVID' },
      { key: 'M09:PSICOLOGIA', nombre: 'Psicología Ocupacional', icono: 'fa-user-md', modulo: 'MOD_09', tab: 'PSICOLOGIA' },
      { key: 'M09:SCTR', nombre: 'Pólizas SCTR y Vida Ley', icono: 'fa-folder-open-o', modulo: 'MOD_09', tab: 'SCTR' }
    ]
  },
  {
    key: 'M10',
    nombre: 'Auditorías y Normativa',
    icono: 'fa-check-square-o',
    modulo: 'MOD_10',
    hijos: [
      { key: 'M10:AUDITORIAS', nombre: 'Auditorías y Línea Base', icono: 'fa-clipboard', modulo: 'MOD_10', tab: 'AUDITORIAS' },
      { key: 'M10:REQUISITOS', nombre: 'Requisitos Legales', icono: 'fa-balance-scale', modulo: 'MOD_10', tab: 'REQUISITOS' }
    ]
  },
  {
    key: 'M11',
    nombre: 'Medio Ambiente',
    icono: 'fa-leaf',
    modulo: 'MOD_11',
    hijos: [
      { key: 'M11:RESIDUOS', nombre: 'Residuos Sólidos y EO-RS', icono: 'fa-trash', modulo: 'MOD_11', tab: 'RESIDUOS' },
      { key: 'M11:FICHAS_QUIMICAS', nombre: 'Materiales Peligrosos (MSDS)', icono: 'fa-flask', modulo: 'MOD_11', tab: 'FICHAS_QUIMICAS' },
      { key: 'M11:HUELLA_CARBONO', nombre: 'Huella de Carbono (GEI)', icono: 'fa-cloud', modulo: 'MOD_11', tab: 'HUELLA_CARBONO' }
    ]
  },
  {
    key: 'M12',
    nombre: 'Indicadores, BI e IA',
    icono: 'fa-bar-chart',
    modulo: 'MOD_12',
    hijos: [
      { key: 'M12:ESTADISTICAS', nombre: 'Estadísticas Ejecutivas SST', icono: 'fa-area-chart', modulo: 'MOD_12', tab: 'ESTADISTICAS' },
      { key: 'M12:OBJETIVOS', nombre: 'Objetivos y Metas PASST', icono: 'fa-bullseye', modulo: 'MOD_12', tab: 'OBJETIVOS' },
      { key: 'M12:ANALITICA_IA', nombre: 'Analítica Predictiva IA', icono: 'fa-lightbulb-o', modulo: 'MOD_12', tab: 'ANALITICA_IA' },
      { key: 'M12:VISITANTES', nombre: 'Control de Visitantes y QR', icono: 'fa-qrcode', modulo: 'MOD_12', tab: 'VISITANTES' }
    ]
  }
];

/** Busca un ítem por su key y devuelve además la ruta (padres) para el breadcrumb. */
export function buscarItemMenu(grupos: MsstMenuGrupo[], key: string): { grupo: MsstMenuGrupo; ruta: MsstMenuItem[] } | null {
  for (const g of grupos) {
    const ruta: MsstMenuItem[] = [];
    const dfs = (items: MsstMenuItem[]): boolean => {
      for (const it of items) {
        ruta.push(it);
        if (it.key === key) return true;
        if (it.hijos && dfs(it.hijos)) return true;
        ruta.pop();
      }
      return false;
    };
    if (dfs(g.items)) return { grupo: g, ruta: [...ruta] };
  }
  return null;
}
