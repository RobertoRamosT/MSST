export interface GosstScreenItem {
  id: string;
  title: string;
  htmlFile: string;
  domainCode: string;
  domainName: string;
  modals: number;
  tables: number;
  endpointsPrefix: string;
}

export const GOSST_42_SCREENS: GosstScreenItem[] = [
  // Dominio 01: Seguridad, Login y Perfiles
  { id: 'login', title: 'Acceso Principal OneSST', htmlFile: 'login.html', domainCode: '01', domainName: 'Seguridad y Perfiles', modals: 1, tables: 0, endpointsPrefix: '/login' },
  { id: 'login_personalizado', title: 'Login Colaborador Personalizado', htmlFile: 'login_personalizado.html', domainCode: '01', domainName: 'Seguridad y Perfiles', modals: 1, tables: 0, endpointsPrefix: '/login' },
  { id: 'login_personalizado_contratista', title: 'Login Contratista por RUC', htmlFile: 'login_personalizado_contratista.html', domainCode: '01', domainName: 'Seguridad y Perfiles', modals: 1, tables: 0, endpointsPrefix: '/login' },
  { id: 'login_visitante', title: 'Acceso Personal Externo / Visitante', htmlFile: 'login_visitante.html', domainCode: '01', domainName: 'Seguridad y Perfiles', modals: 0, tables: 0, endpointsPrefix: '/public' },
  { id: 'recuperar', title: 'Recuperar Contraseña', htmlFile: 'recuperar.html', domainCode: '01', domainName: 'Seguridad y Perfiles', modals: 1, tables: 0, endpointsPrefix: '/login' },
  { id: 'perfiles', title: 'Gestión de Perfiles y Permisos', htmlFile: 'perfiles.html', domainCode: '01', domainName: 'Seguridad y Perfiles', modals: 5, tables: 11, endpointsPrefix: '/perfil' },
  { id: 'configuracion', title: 'Configuración del Sistema', htmlFile: 'configuracion.html', domainCode: '01', domainName: 'Seguridad y Perfiles', modals: 0, tables: 0, endpointsPrefix: '/administrador' },
  { id: 'licencia', title: 'Estado de Licencia Corporativa', htmlFile: 'licencia.html', domainCode: '01', domainName: 'Seguridad y Perfiles', modals: 0, tables: 0, endpointsPrefix: '/empresa' },

  // Dominio 02: Estructura Organizacional y Puestos
  { id: 'empresa', title: 'Gestión de Empresas, Unidades y Áreas', htmlFile: 'empresa.html', domainCode: '02', domainName: 'Organización y MDF', modals: 4, tables: 2, endpointsPrefix: '/empresa' },
  { id: 'mdf', title: 'Despliegue Organizacional (MDF)', htmlFile: 'mdf.html', domainCode: '02', domainName: 'Organización y MDF', modals: 6, tables: 5, endpointsPrefix: '/mdf' },
  { id: 'puestotrabajo', title: 'Asignación de Recursos por Puesto', htmlFile: 'puestotrabajo.html', domainCode: '02', domainName: 'Organización y MDF', modals: 2, tables: 2, endpointsPrefix: '/puesto' },
  { id: 'solicitudes', title: 'Bandeja de Solicitudes', htmlFile: 'solicitudes.html', domainCode: '02', domainName: 'Organización y MDF', modals: 0, tables: 2, endpointsPrefix: '/empresa' },

  // Dominio 03: Gestión de Contratistas, Homologación, Proyectos y Garita
  { id: 'contratista', title: 'Portal Integral de Contratistas (93 Tablas)', htmlFile: 'contratista.html', domainCode: '03', domainName: 'Contratistas y Garita', modals: 21, tables: 93, endpointsPrefix: '/contratista/lista' },

  // Dominio 04: Portal Principal y Autoservicio del Trabajador
  { id: 'main', title: 'Portal Principal del Trabajador y Calendario SST', htmlFile: 'main.html', domainCode: '04', domainName: 'Portal Trabajador', modals: 14, tables: 17, endpointsPrefix: '/scheduler/lista' },
  { id: 'manual', title: 'Manual Interactivo de Usuario', htmlFile: 'manual/manual.html', domainCode: '04', domainName: 'Portal Trabajador', modals: 0, tables: 0, endpointsPrefix: '/public' },

  // Dominio 05: Trabajadores, Comités y Elecciones Virtuales
  { id: 'trabajador', title: 'Maestro de Trabajadores y Comités SST', htmlFile: 'trabajador.html', domainCode: '05', domainName: 'Trabajadores y Comités', modals: 15, tables: 25, endpointsPrefix: '/trabajador/lista' },
  { id: 'eleccion_virtual', title: 'Participación, Consulta y Elecciones Virtuales', htmlFile: 'eleccion_virtual.html', domainCode: '05', domainName: 'Trabajadores y Comités', modals: 2, tables: 5, endpointsPrefix: '/eleccion_virtual/lista' },

  // Dominio 06: Prevención de Riesgos (IPERC, Inspecciones, OPT, Actos Subestándar)
  { id: 'iperc', title: 'Matriz IPERC y Control de Riesgos', htmlFile: 'iperc.html', domainCode: '06', domainName: 'Prevención e IPERC', modals: 9, tables: 6, endpointsPrefix: '/iperc/lista' },
  { id: 'inspeccion', title: 'Inspecciones de Seguridad (V1)', htmlFile: 'inspeccion.html', domainCode: '06', domainName: 'Prevención e IPERC', modals: 12, tables: 14, endpointsPrefix: '/inspeccionv2/lista' },
  { id: 'inspeccionV2', title: 'Inspecciones Dinámicas (V2)', htmlFile: 'inspeccionV2.html', domainCode: '06', domainName: 'Prevención e IPERC', modals: 0, tables: 1, endpointsPrefix: '/inspeccionv2/lista' },
  { id: 'opt', title: 'Observaciones Planeadas de Trabajo (OPT)', htmlFile: 'opt.html', domainCode: '06', domainName: 'Prevención e IPERC', modals: 6, tables: 10, endpointsPrefix: '/opt/lista' },
  { id: 'acinseguros', title: 'Actos y Condiciones Subestándar', htmlFile: 'acinseguros.html', domainCode: '06', domainName: 'Prevención e IPERC', modals: 8, tables: 8, endpointsPrefix: '/acinseguro/lista' },

  // Dominio 07: Accidentes, Incidentes y Acciones de Mejora
  { id: 'accidentes', title: 'Investigación de Accidentes e Incidentes', htmlFile: 'accidentes.html', domainCode: '07', domainName: 'Accidentes y Mejora', modals: 9, tables: 31, endpointsPrefix: '/accidente/lista' },
  { id: 'accionmejora', title: 'Planes de Acción de Mejora', htmlFile: 'accionmejora.html', domainCode: '07', domainName: 'Accidentes y Mejora', modals: 8, tables: 10, endpointsPrefix: '/gestionaccionmejora/lista' },
  { id: 'agregaraccionmejora', title: 'Registro Rápido de Acción de Mejora', htmlFile: 'agregaraccionmejora.html', domainCode: '07', domainName: 'Accidentes y Mejora', modals: 0, tables: 2, endpointsPrefix: '/gestionaccionmejora/lista' },

  // Dominio 08: Recursos SST (Capacitaciones, Aula Virtual, EPP, Procedimientos)
  { id: 'capacitacion', title: 'Programa Anual de Formaciones y Capacitaciones', htmlFile: 'capacitacion.html', domainCode: '08', domainName: 'Capacitación y EPP', modals: 5, tables: 4, endpointsPrefix: '/capacitacion/lista' },
  { id: 'capacitacion_online', title: 'Aula Virtual (LMS) y Evaluaciones Online', htmlFile: 'capacitacion_online.html', domainCode: '08', domainName: 'Capacitación y EPP', modals: 9, tables: 16, endpointsPrefix: '/capacitacion/lista' },
  { id: 'equiposeguridad', title: 'Equipos de Protección Personal (EPP)', htmlFile: 'equiposeguridad.html', domainCode: '08', domainName: 'Capacitación y EPP', modals: 10, tables: 9, endpointsPrefix: '/equiposeguridad/lista' },
  { id: 'procedimientoseguridad', title: 'Documentos y Procedimientos de Seguridad', htmlFile: 'procedimientoseguridad.html', domainCode: '08', domainName: 'Capacitación y EPP', modals: 6, tables: 8, endpointsPrefix: '/procedimientoseguridad/lista' },

  // Dominio 09: Salud Ocupacional (EMO, COVID-19, Psicología, SCTR)
  { id: 'examenmedico', title: 'Vigilancia Médica y Exámenes Ocupacionales (EMO)', htmlFile: 'examenmedico.html', domainCode: '09', domainName: 'Salud Ocupacional', modals: 5, tables: 11, endpointsPrefix: '/examenmedico/lista' },
  { id: 'covid', title: 'Vigilancia Epidemiológica / COVID-19', htmlFile: 'covid.html', domainCode: '09', domainName: 'Salud Ocupacional', modals: 0, tables: 4, endpointsPrefix: '/covid/lista' },
  { id: 'psicologia', title: 'Psicología Ocupacional y Riesgos Psicosociales', htmlFile: 'psicologia.html', domainCode: '09', domainName: 'Salud Ocupacional', modals: 1, tables: 10, endpointsPrefix: '/psicologia/lista' },

  // Dominio 10: Auditorías y Requisitos Legales
  { id: 'auditoria', title: 'Diagnóstico de Línea Base y Auditorías SST', htmlFile: 'auditoria.html', domainCode: '10', domainName: 'Auditoría y Legal', modals: 10, tables: 10, endpointsPrefix: '/auditoria/lista' },
  { id: 'requisitos', title: 'Matriz de Requisitos Legales', htmlFile: 'requisitos.html', domainCode: '10', domainName: 'Auditoría y Legal', modals: 8, tables: 11, endpointsPrefix: '/requisitos/lista' },

  // Dominio 11: Medio Ambiente (Residuos, Fichas Químicas, Huella de Carbono)
  { id: 'residuos', title: 'Gestión Integral de Residuos Sólidos y Manifiestos', htmlFile: 'residuos.html', domainCode: '11', domainName: 'Medio Ambiente', modals: 3, tables: 32, endpointsPrefix: '/residuo/lista' },
  { id: 'fichaquimica', title: 'Fichas de Datos de Seguridad (MSDS / HDS)', htmlFile: 'fichaquimica.html', domainCode: '11', domainName: 'Medio Ambiente', modals: 0, tables: 2, endpointsPrefix: '/fichaquimica/lista' },
  { id: 'huella_carbono', title: 'Calculadora de Huella de Carbono (GEI)', htmlFile: 'huella_carbono.html', domainCode: '11', domainName: 'Medio Ambiente', modals: 4, tables: 4, endpointsPrefix: '/huella-carbono/lista' },

  // Dominio 12: BI, Estadísticas, Objetivos, IA y Consultas
  { id: 'estadistica', title: 'Estadísticas de Seguridad e Índices MINTRA', htmlFile: 'estadistica.html', domainCode: '12', domainName: 'BI, IA y Consultas', modals: 6, tables: 18, endpointsPrefix: '/estadistica/lista' },
  { id: 'indicador_general', title: 'Dashboard de Indicadores Generales', htmlFile: 'indicador_general.html', domainCode: '12', domainName: 'BI, IA y Consultas', modals: 0, tables: 1, endpointsPrefix: '/indicadorgeneral/lista' },
  { id: 'objetivos', title: 'Objetivos y Metas Anuales SST', htmlFile: 'objetivos.html', domainCode: '12', domainName: 'BI, IA y Consultas', modals: 1, tables: 6, endpointsPrefix: '/objetivo/lista' },
  { id: 'ia', title: 'Módulo de Inteligencia Artificial SST', htmlFile: 'ia.html', domainCode: '12', domainName: 'BI, IA y Consultas', modals: 4, tables: 2, endpointsPrefix: '/ia/lista' },
  { id: 'consultas', title: 'Portal Público de Consultas de Habilitación (Garita)', htmlFile: 'consultas.html', domainCode: '12', domainName: 'BI, IA y Consultas', modals: 0, tables: 0, endpointsPrefix: '/public/consulta' }
];
