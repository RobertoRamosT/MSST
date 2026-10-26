namespace Msst.Backend.Legacy;
internal static class LegacyProjection
{
    internal static string? ResolverAccionCrud(string rutaRelativa)
    {
        var r = rutaRelativa.ToLowerInvariant();
        if (r.Contains("/insert") || r.Contains("/guardar") || r.Contains("/registrar") || r.Contains("/save"))
            return "INSERT";
        if (r.Contains("/aprobar"))
            return "APROBAR";
        if (r.Contains("/rechazar"))
            return "RECHAZAR";
        if (r.Contains("/votar"))
            return "VOTAR";
        if (r.Contains("/delete"))
            return "DELETE";
        if (r.Contains("/update"))
            return "UPDATE";
        return null;
    }

    internal static string ResolverModuloCrud(string rutaRelativa, string moduloCatalogo)
    {
        var r = rutaRelativa.ToLowerInvariant();

        // Módulo 01: Seguridad, Perfiles y Usuarios
        if (r.StartsWith("/perfil") || r.Contains("/perfil/"))
            return "perfil";
        if (r.StartsWith("/usuario") || r.Contains("/usuario/"))
            return "usuario";

        // Módulo 02: Organización, MDF y Puestos
        if (r.StartsWith("/mdf") || r.Contains("/mdf/"))
            return "mdf";
        if (r.StartsWith("/puesto") || r.Contains("/puesto/"))
            return "puesto";
        if (r.StartsWith("/unidad") || r.Contains("/unidad/"))
            return "unidad";
        if (r.StartsWith("/division") || r.Contains("/division/"))
            return "division";
        if (r.StartsWith("/area") || r.Contains("/area/"))
            return "area";

        // Módulo 03: Contratistas (Sub-bloques 3A, 3B, 3C, 3D)
        if (r.Contains("documento_nivel_conductor") || (r.Contains("conductor") && r.Contains("documento")))
            return "contratista_documento_conductor";
        if (r.Contains("analisis_trabajo_seguro") || r.Contains("/ats/") || r.EndsWith("/ats"))
            return "contratista_ats";
        if (r.Contains("proyecto"))
            return "contratista_proyecto";
        if (r.Contains("contratista") && r.Contains("trabajador"))
            return "contratista_trabajador";
        if (r.Contains("vehiculo") || r.Contains("maquinaria"))
            return "contratista_vehiculo";
        if (r.Contains("documento") || r.Contains("homologacion") || r.Contains("evaluacion"))
            return "contratista_documento";
        if (r.Contains("operacion") || r.Contains("petar") || r.Contains("ats") || r.Contains("izaje") || r.Contains("fast"))
            return "contratista_operacion";
        if (r.Contains("garita") || r.Contains("acceso"))
            return "contratista_garita";
        if (r.StartsWith("/contratista") || moduloCatalogo == "contratista")
            return "contratista";

        // Módulo 04 y 05: Trabajadores Propios y Elecciones Virtuales CSST
        if (r.StartsWith("/trabajador") || r.Contains("/trabajador/"))
            return "trabajador";
        if (r.StartsWith("/eleccion_virtual") || r.Contains("eleccion"))
            return "eleccion_virtual";

        // Módulo 06: IPERC, Inspecciones, OPT y Actos/Condiciones Inseguras
        if (r.StartsWith("/iperc") || r.Contains("/iperc/"))
            return "iperc";
        if (r.StartsWith("/opt") || r.Contains("/opt/"))
            return "opt";
        if (r.StartsWith("/acinseguro") || r.Contains("/acinseguro/"))
            return "acinseguro";
        if (r.StartsWith("/inspeccion") || r.Contains("/inspeccion"))
            return "inspeccionv2";

        // Módulo 07: Accidentes y Planes de Acción de Mejora
        if (r.StartsWith("/accidente") || r.Contains("/accidente/"))
            return "accidente";
        if (r.StartsWith("/gestionaccionmejora") || r.Contains("accionmejora"))
            return "gestionaccionmejora";

        // Módulo 08: Capacitaciones, EPP y Procedimientos PETS
        if (r.StartsWith("/capacitacion") || r.Contains("/capacitacion/") || r.StartsWith("/moodle"))
            return "capacitacion";
        if (r.StartsWith("/equiposeguridad") || r.Contains("/equiposeguridad/"))
            return "equiposeguridad";
        if (r.StartsWith("/procedimientoseguridad") || r.Contains("/procedimientoseguridad/"))
            return "procedimientoseguridad";

        // Módulo 09: Salud Ocupacional (EMO, COVID-19, Psicología y SCTR)
        if (r.StartsWith("/examenmedico") || r.Contains("/examenmedico/"))
            return "examenmedico";
        if (r.StartsWith("/covid") || r.Contains("/covid/"))
            return "covid";
        if (r.StartsWith("/psicologia") || r.Contains("/psicologia/"))
            return "psicologia";
        if (r.StartsWith("/sctr") || r.Contains("/sctr/"))
            return "sctr";

        // Módulo 10: Auditorías SST y Matriz de Requisitos Legales
        if (r.StartsWith("/auditoria") || r.Contains("/auditoria/"))
            return "auditoria";
        if (r.StartsWith("/requisitos") || r.Contains("/requisitos/"))
            return "requisitos";

        // Módulo 11: Medio Ambiente (Residuos Sólidos, Fichas Químicas MSDS y Huella de Carbono)
        if (r.StartsWith("/residuo") || r.Contains("/residuo/"))
            return "residuo";
        if (r.StartsWith("/fichaquimica") || r.Contains("/fichaquimica/"))
            return "fichaquimica";
        if (r.StartsWith("/huella-carbono") || r.Contains("huella"))
            return "huella-carbono";

        // Módulo 12: BI, Estadísticas, Indicadores, Objetivos, IA y Visitantes
        if (r.StartsWith("/estadistica") || r.Contains("/estadistica/") ||
            r.StartsWith("/indicadorgeneral") || r.Contains("/indicadorgeneral/") ||
            r.StartsWith("/quicksight") || r.Contains("/quicksight/"))
            return "estadistica";
        if (r.StartsWith("/objetivo") || r.Contains("/objetivo/"))
            return "objetivo";
        if (r.StartsWith("/ia") || r.Contains("/ia/"))
            return "ia";
        if (r.StartsWith("/visitante") || r.Contains("/visitante/") ||
            r.StartsWith("/public") || r.Contains("/public/"))
            return "visitante";

        return moduloCatalogo;
    }

    internal static string ObtenerConsultaPorRuta(string rutaRelativa, string moduloResuelto)
    {
        return moduloResuelto switch
        {
            // MÓDULO 01: PERFILES Y USUARIOS
            "perfil" => @"
                SELECT IdPerfil AS id, IdPerfil AS idPerfil, IdEmpresa AS idEmpresa,
                       Nombre AS nombre, Descripcion AS descripcion,
                       ModulosPermitidosJson AS modulosPermitidosJson,
                       CAST(Estado AS INT) AS estado
                FROM dbo.Seg_Perfil
                WHERE Estado = 1
                ORDER BY IdPerfil ASC;",

            "usuario" => @"
                SELECT u.IdUsuario AS id, u.IdUsuario AS idUsuario, u.UserName AS userName, u.UserName AS usuario,
                       u.NombreCompleto AS nombreCompleto, u.NombreCompleto AS nombre,
                       u.Correo AS correo, u.IdPerfil AS idPerfil,
                       p.Nombre AS perfil, p.Nombre AS nombrePerfil,
                       u.IdEmpresa AS idEmpresa, u.AccesoUsuarios AS accesoUsuarios,
                       u.PathRedireccion AS pathRedireccion, u.ContratistaRuc AS contratistaRuc,
                       u.Estado AS estado,
                       CONVERT(VARCHAR(16), u.UltimoAcceso, 120) AS ultimoAcceso
                FROM dbo.Seg_Usuario u
                LEFT JOIN dbo.Seg_Perfil p ON p.IdPerfil = u.IdPerfil
                WHERE u.Estado IN (1, 2)
                ORDER BY u.IdUsuario ASC;",

            // MÓDULO 02: ORGANIZACIÓN, MDF Y PUESTOS
            "mdf" => @"
                SELECT a.IdActividad AS id, a.IdActividad AS idActividad, a.IdEmpresa AS idEmpresa,
                       a.IdArea AS idArea, ar.Nombre AS area,
                       a.Nombre AS nombre, a.Tipo AS tipo, a.IdPadre AS idPadre,
                       CAST(a.Estado AS INT) AS estado
                FROM dbo.Org_MdfActividad a
                LEFT JOIN dbo.Org_Area ar ON ar.IdArea = a.IdArea
                WHERE a.Estado = 1
                ORDER BY a.IdActividad ASC;",

            "unidad" => @"
                SELECT IdUnidad AS id, IdUnidad AS idUnidad, Nombre AS nombre,
                       Direccion AS direccion, CAST(Estado AS INT) AS estado
                FROM dbo.Org_Unidad
                WHERE Estado = 1
                ORDER BY IdUnidad ASC;",

            "division" => @"
                SELECT d.IdDivision AS id, d.IdDivision AS idDivision, d.Nombre AS nombre,
                       d.IdUnidad AS idUnidad, u.Nombre AS unidad,
                       CAST(d.Estado AS INT) AS estado
                FROM dbo.Org_Division d
                LEFT JOIN dbo.Org_Unidad u ON u.IdUnidad = d.IdUnidad
                WHERE d.Estado = 1
                ORDER BY d.IdDivision ASC;",

            "area" => @"
                SELECT a.IdArea AS id, a.IdArea AS idArea, a.Nombre AS nombre,
                       a.IdUnidad AS idUnidad, u.Nombre AS unidad,
                       a.IdDivision AS idDivision, d.Nombre AS division,
                       CAST(a.Estado AS INT) AS estado
                FROM dbo.Org_Area a
                LEFT JOIN dbo.Org_Unidad u ON u.IdUnidad = a.IdUnidad
                LEFT JOIN dbo.Org_Division d ON d.IdDivision = a.IdDivision
                WHERE a.Estado = 1
                ORDER BY a.IdArea ASC;",

            "puesto" => @"
                SELECT p.IdPuesto AS id, p.IdPuesto AS idPuesto, p.Nombre AS nombre,
                       p.Descripcion AS descripcion, p.IdArea AS idArea,
                       a.Nombre AS area,
                       p.TipoPuesto AS tipoPuesto, CAST(p.Estado AS INT) AS estado
                FROM dbo.Org_PuestoTrabajo p
                LEFT JOIN dbo.Org_Area a ON a.IdArea = p.IdArea
                WHERE p.Estado = 1
                ORDER BY p.IdPuesto ASC;",

            // MÓDULO 03: CONTRATISTAS (BLOQUES 3A, 3B, 3C y 3D)
            "contratista" => @"
                SELECT IdContratista AS id, IdContratista AS idContratista, Ruc AS ruc,
                       RazonSocial AS nombre, RazonSocial AS razonSocial, NombreComercial AS nombreComercial,
                       RubroActividad AS rubroActividad, RepresentanteLegal AS representanteLegal,
                       CorreoContacto AS correo, CorreoContacto AS correoContacto,
                       TelefonoContacto AS telefono, TelefonoContacto AS telefonoContacto,
                       PorcentajeHomologacion AS porcentajeHomologacion, EstadoHomologacion AS estadoHomologacion,
                       Estado AS estado
                FROM dbo.Ctr_Contratista
                WHERE Estado = 1
                ORDER BY IdContratista ASC;",

            "contratista_proyecto" => @"
                SELECT IdProyecto AS id, IdProyecto AS idProyecto, IdContratista AS idContratista,
                       CodigoProyecto AS codigo, CodigoProyecto AS codigoProyecto,
                       NombreProyecto AS nombre, NombreProyecto AS nombreProyecto,
                       Descripcion AS descripcion,
                       ResponsableCliente AS responsableCliente,
                       ResponsableContratista AS responsableContratista,
                       NivelRiesgo AS nivelRiesgo, CONVERT(VARCHAR(10), FechaInicio, 103) AS fechaInicio,
                       CONVERT(VARCHAR(10), FechaFin, 103) AS fechaFin, PorcentajeCumplimiento AS porcentajeCumplimiento,
                       EstadoProyecto AS estado
                FROM dbo.Ctr_Proyecto
                WHERE EstadoProyecto > 0
                ORDER BY IdProyecto DESC;",

            "contratista_trabajador" => @"
                SELECT IdTrabajadorContratista AS id, IdTrabajadorContratista AS idTrabajador,
                       IdContratista AS idContratista, IdProyecto AS idProyecto,
                       TipoDocumento AS tipoDocumento, NumeroDocumento AS numeroDocumento, NumeroDocumento AS dni,
                       Nombres AS nombres, ApellidoPaterno AS apellidoPaterno, ApellidoMaterno AS apellidoMaterno,
                       (Nombres + ' ' + ApellidoPaterno + ' ' + ApellidoMaterno) AS nombreCompleto,
                       (Nombres + ' ' + ApellidoPaterno + ' ' + ApellidoMaterno) AS nombre,
                       PuestoTrabajo AS puestoTrabajo, EsConductor AS esConductor,
                       LicenciaConducir AS licenciaConducir, CategoriaLicencia AS categoriaLicencia,
                       AptitudMedica AS aptitudMedica, SctrSaludVigente AS sctrSaludVigente,SctrPensionVigente AS sctrPensionVigente,
                       InduccionAprobada AS induccionAprobada, NotaInduccion AS notaInduccion,
                       HabilitadoIngreso AS habilitadoIngreso, Estado AS estado
                FROM dbo.Ctr_TrabajadorContratista
                WHERE Estado = 1
                ORDER BY IdTrabajadorContratista DESC;",

            "contratista_vehiculo" => @"
                SELECT IdVehiculo AS id, IdVehiculo AS idVehiculo, IdContratista AS idContratista,
                       IdProyecto AS idProyecto, Categoria AS categoria,
                       PlacaCodigo AS placa, PlacaCodigo AS placaCodigo, PlacaCodigo AS codigo,
                       Marca AS marca, Modelo AS modelo,
                       AnioFabricacion AS anioFabricacion, SoatVigente AS soatVigente,
                       RevisionTecnicaVigente AS revisionTecnicaVigente, HabilitadoIngreso AS habilitadoIngreso,
                       Estado AS estado
                FROM dbo.Ctr_VehiculoMaquinaria
                WHERE Estado = 1
                ORDER BY IdVehiculo DESC;",

            "contratista_documento_conductor" => @"
                SELECT d.IdDocumentoNivel AS id, d.IdDocumentoNivel AS idDocumento, d.IdContratista AS idContratista,
                       d.Nivel AS nivel, d.NombreRequisito AS nombre, d.NombreRequisito AS nombreRequisito,
                       d.ArchivoUrl AS archivoUrl,
                       CONVERT(VARCHAR(10), d.FechaEmision, 103) AS fechaEmision,
                       CONVERT(VARCHAR(10), d.FechaVencimiento, 23) AS fechaVencimiento,
                       d.EstadoRevision AS estadoRevision, d.EstadoRevision AS estado,
                       t.LicenciaConducir AS licenciaConducir, t.CategoriaLicencia AS categoriaLicencia,
                       d.PuntajeValidacionIA AS puntajeValidacionIA,d.ObservacionRevision AS observacionRevision
                FROM dbo.Ctr_DocumentoNivel d
                INNER JOIN dbo.Ctr_TrabajadorContratista t ON t.IdTrabajadorContratista=d.IdEntidadReferencia
                 AND t.IdContratista=d.IdContratista AND t.EsConductor=1 AND t.MsstDeleted=0
                WHERE d.Nivel IN ('PERSONA','CONDUCTOR') AND d.Estado = 1
                ORDER BY d.IdDocumentoNivel DESC;",

            "contratista_ats" => @"
                SELECT IdOperacion AS id, IdOperacion AS idAts, IdContratista AS idContratista,
                       TipoFormato AS tipoFormato, DescripcionTarea AS actividadAts, DescripcionTarea AS nombre,
                       UbicacionExacta AS areaTrabajo, SupervisorResponsable AS supervisorSst,
                       PersonalAsignado AS personalAsignado, EppControles AS eppControles,
                       EstadoAprobacion AS estadoAutorizacion, EstadoAprobacion AS estado,
                       CONVERT(VARCHAR(16), FechaHoraInicio, 120) AS fechaHoraElaboracion
                FROM dbo.Ctr_OperacionRiesgo
                WHERE Estado = 1
                ORDER BY IdOperacion DESC;",

            "contratista_documento" => @"
                SELECT IdDocumentoNivel AS id, IdDocumentoNivel AS idDocumento, IdContratista AS idContratista,
                       IdProyecto AS idProyecto, Nivel AS nivel,
                       NombreRequisito AS nombre, NombreRequisito AS nombreRequisito,
                       ArchivoUrl AS archivoUrl,
                       CONVERT(VARCHAR(10), FechaEmision, 103) AS fechaEmision,
                       CONVERT(VARCHAR(10), FechaVencimiento, 23) AS fechaVencimiento,
                       EstadoRevision AS estadoRevision, EstadoRevision AS estado,
                       PuntajeValidacionIA AS puntajeValidacionIA,
                       ObservacionRevision AS observacionRevision,
                       RevisadoPor AS revisadoPor
                FROM dbo.Ctr_DocumentoNivel
                WHERE Estado = 1
                ORDER BY IdDocumentoNivel DESC;",

            "contratista_operacion" => @"
                SELECT IdOperacion AS id, IdOperacion AS idOperacion, IdContratista AS idContratista,
                       IdProyecto AS idProyecto, TipoFormato AS tipoFormato, TipoFormato AS tipo,
                       TipoTrabajoAltoRiesgo AS tipoTrabajoAltoRiesgo,
                       UbicacionExacta AS ubicacion, UbicacionExacta AS ubicacionExacta,
                       DescripcionTarea AS descripcion, DescripcionTarea AS descripcionTarea, DescripcionTarea AS nombre, DescripcionTarea AS actividad,
                       SupervisorResponsable AS supervisor,
                       SupervisorResponsable AS supervisorResponsable,
                       CONVERT(VARCHAR(16), FechaHoraInicio, 120) AS fechaHoraInicio,
                       CONVERT(VARCHAR(16), FechaHoraFin, 120) AS fechaHoraFin,
                       EstadoAprobacion AS estadoAprobacion, EstadoAprobacion AS estado
                FROM dbo.Ctr_OperacionRiesgo
                WHERE Estado = 1
                ORDER BY IdOperacion DESC;",

            "contratista_garita" => @"SELECT IdAcceso AS id,IdEmpresa AS idEmpresa,IdContratista AS idContratista,TipoAcceso AS tipoAcceso,
 DocumentoOPlaca AS documentoOPlaca,DocumentoOPlaca AS identificador,NombreDescripcion AS nombre,
 GaritaSede AS garita,Movimiento AS movimiento,Autorizado AS autorizado,ObservacionGarita AS observacion,
 VigilanteUsuario AS vigilante,FechaHoraRegistro AS fechaRegistro FROM dbo.AccessV2_LegacyRecord ORDER BY IdAcceso DESC;",

            // MÓDULO 04: TRABAJADORES PROPIOS Y COMITÉS SST
            "trabajador" => @"
                SELECT t.IdTrabajador AS id, t.IdTrabajador AS idTrabajador, t.IdEmpresa AS idEmpresa,
                       t.IdUnidad AS idUnidad, u.Nombre AS unidad,
                       t.IdArea AS idArea, a.Nombre AS area,
                       t.IdPuesto AS idPuesto, p.Nombre AS puesto,
                       t.NumeroDocumento AS numeroDocumento, t.NumeroDocumento AS dni,
                       t.Nombres AS nombres, t.Apellidos AS apellidos,
                       (t.Nombres + ' ' + t.Apellidos) AS nombreCompleto, (t.Nombres + ' ' + t.Apellidos) AS nombre,
                       t.Correo AS correo, t.Telefono AS telefono,
                       CONVERT(VARCHAR(10), t.FechaIngreso, 103) AS fechaIngreso,
                       t.TallaCasco AS tallaCasco, t.TallaCalzado AS tallaCalzado,
                       t.TallaUniforme AS tallaUniforme,
                       t.GrupoSeguridad AS grupoSeguridad,
                       t.Estado AS estado
                FROM dbo.Sst_Trabajador t
                LEFT JOIN dbo.Org_Unidad u ON u.IdUnidad = t.IdUnidad
                LEFT JOIN dbo.Org_Area a ON a.IdArea = t.IdArea
                LEFT JOIN dbo.Org_PuestoTrabajo p ON p.IdPuesto = t.IdPuesto
                WHERE t.Estado = 1
                ORDER BY t.IdTrabajador DESC;",

            // MÓDULO 05: ELECCIONES VIRTUALES DEL COMITÉ SST
            "eleccion_virtual" => @"
                SELECT IdEleccion AS id, IdEleccion AS idEleccion, IdEmpresa AS idEmpresa,
                       TituloProceso AS titulo, TituloProceso AS nombre, TituloProceso AS tituloProceso,
                       Periodo AS periodo,
                       CONVERT(VARCHAR(10), FechaApertura, 103) AS fechaApertura,
                       CONVERT(VARCHAR(10), FechaCierre, 103) AS fechaCierre,
                       TotalVotantesPadron AS totalPadron, TotalVotantesPadron AS totalVotantesPadron,
                       TotalVotosEmitidos AS totalVotos, TotalVotosEmitidos AS totalVotosEmitidos,
                       EstadoProceso AS estado, EstadoProceso AS estadoProceso,
                       CandidatosJson AS candidatosJson
                FROM dbo.Sst_EleccionVirtual
                ORDER BY IdEleccion DESC;",

            // MÓDULO 06: IPERC, INSPECCIONES (V1/V2), OPT Y ACTOS/CONDICIONES INSEGURAS
            "iperc" => @"
                SELECT IdIperc AS id, IdIperc AS idIperc, CodigoMatriz AS codigo, VersionMatriz AS versionMatriz,
                       ProcesoActividad AS proceso, TareaPaso AS tarea, PeligroIdentificado AS peligro,
                       RiesgoAsociado AS riesgo, ProbabilidadInicial AS probabilidadInicial,
                       SeveridadInicial AS severidadInicial, NivelRiesgoInicial AS riesgoInicial,
                       MedidasControlJerarquia AS medidasControl, ProbabilidadResidual AS probabilidadResidual,
                       SeveridadResidual AS severidadResidual, NivelRiesgoResidual AS riesgoResidual,
                       EstadoAprobacion AS estado, CONVERT(VARCHAR(10), FechaActualizacion, 103) AS fechaActualizacion
                FROM dbo.Sst_IpercMatriz
                ORDER BY IdIperc DESC;",

            "opt" => @"
                SELECT IdInspeccion AS id, IdInspeccion AS idInspeccion, VersionModulo AS modulo,
                       TipoInspeccion AS tipo, AreaUbicacion AS area, InspectorResponsable AS inspector,
                       PuntajeObtenido AS puntaje, NivelCriticidad AS criticidad,
                       DescripcionHallazgo AS hallazgo,
                       EvidenciaUrl AS evidenciaUrl,
                       EstadoInspeccion AS estado,
                       CONVERT(VARCHAR(10), FechaInspeccion, 103) AS fecha
                FROM dbo.Sst_Inspeccion
                WHERE VersionModulo = 'OPT'
                ORDER BY IdInspeccion DESC;",

            "acinseguro" => @"
                SELECT IdInspeccion AS id, IdInspeccion AS idInspeccion, VersionModulo AS modulo,
                       TipoInspeccion AS tipo, AreaUbicacion AS area, InspectorResponsable AS inspector,
                       PuntajeObtenido AS puntaje, NivelCriticidad AS criticidad,
                       DescripcionHallazgo AS hallazgo,
                       EvidenciaUrl AS evidenciaUrl,
                       EstadoInspeccion AS estado,
                       CONVERT(VARCHAR(10), FechaInspeccion, 103) AS fecha
                FROM dbo.Sst_Inspeccion
                WHERE VersionModulo = 'AC_INSEGURO'
                ORDER BY IdInspeccion DESC;",

            "inspeccionv2" => @"
                SELECT IdInspeccion AS id, IdInspeccion AS idInspeccion, VersionModulo AS modulo,
                       TipoInspeccion AS tipo, AreaUbicacion AS area, InspectorResponsable AS inspector,
                       PuntajeObtenido AS puntaje, NivelCriticidad AS criticidad,
                       DescripcionHallazgo AS hallazgo,
                       EvidenciaUrl AS evidenciaUrl,
                       EstadoInspeccion AS estado,
                       CONVERT(VARCHAR(10), FechaInspeccion, 103) AS fecha
                FROM dbo.Sst_Inspeccion
                WHERE VersionModulo IN ('V1', 'V2')
                ORDER BY IdInspeccion DESC;",

            // MÓDULO 07: ACCIDENTES Y PLANES DE ACCIÓN DE MEJORA
            "accidente" => @"
                SELECT IdAccidente AS id, IdAccidente AS idAccidente, CodigoRegistro AS codigo,
                       TipoEvento AS tipo, Gravedad AS gravedad,
                       CONVERT(VARCHAR(16), FechaHoraEvento, 120) AS fechaHora,
                       LugarExacto AS lugar, TrabajadorInvolucrado AS trabajador,
                       DiasDescansoMedico AS diasDescanso, DescripcionRelato AS descripcion,
                       CausasInmediatasJson AS causasInmediatasJson,
                       CausasBasicasJson AS causasBasicasJson,
                       EstadoInvestigacion AS estado
                FROM dbo.Sst_Accidente
                ORDER BY IdAccidente DESC;",

            "gestionaccionmejora" => @"
                SELECT IdAccionMejora AS id, IdAccionMejora AS idAccionMejora, ModuloOrigen AS moduloOrigen,
                       DescripcionHallazgo AS hallazgo, MedidaCorrectiva AS medidaCorrectiva,
                       ResponsableEjecucion AS responsable, CONVERT(VARCHAR(10), FechaCompromiso, 103) AS fechaCompromiso,
                       PorcentajeAvance AS avance, EficaciaVerificada AS eficaciaVerificada,
                       EstadoAccion AS estado
                FROM dbo.Sst_AccionMejora
                ORDER BY IdAccionMejora DESC;",

            // MÓDULO 08: RECURSOS SST (CAPACITACIONES, EPP Y PROCEDIMIENTOS PETS)
            "capacitacion" or "moodle" => @"
                SELECT IdCapacitacion AS id, IdCapacitacion AS idCapacitacion, Modalidad AS modalidad,
                       NombreCurso AS nombre, InstructorProfesor AS instructor,
                       DuracionHoras AS duracionHoras, NotaMinimaAprobatoria AS notaMinima,
                       CONVERT(VARCHAR(10), FechaProgramada, 103) AS fechaProgramada,
                       TotalInscritos AS totalInscritos, TotalAprobados AS totalAprobados,
                       MaterialMultimediaUrl AS materialUrl,
                       Estado AS estado
                FROM dbo.Rec_Capacitacion
                WHERE Estado = 1
                ORDER BY IdCapacitacion DESC;",

            "equiposeguridad" => @"
                SELECT IdEquipoEpp AS id, IdEquipoEpp AS idEquipoEpp, CodigoEpp AS codigo,
                       NombreEpp AS nombre, TipoProteccion AS tipoProteccion,
                       VidaUtilDias AS vidaUtilDias, StockActual AS stock,
                       NormaTecnica AS norma, Estado AS estado
                FROM dbo.Rec_EquipoSeguridadEpp
                WHERE Estado = 1
                ORDER BY IdEquipoEpp DESC;",

            "procedimientoseguridad" => @"
                SELECT IdProcedimiento AS id, IdProcedimiento AS idProcedimiento, CodigoDocumento AS codigo,
                       TituloProcedimiento AS nombre, VersionActual AS documentVersion,
                       AreaAplicacion AS area,
                       ArchivoPdfUrl AS archivoUrl,
                       CONVERT(VARCHAR(10), FechaVigencia, 103) AS fechaVigencia, Estado AS estado
                FROM dbo.Rec_ProcedimientoSeguridad
                WHERE Estado = 1
                ORDER BY IdProcedimiento DESC;",

            // MÓDULO 09: SALUD OCUPACIONAL (EMO, COVID-19, PSICOLOGÍA OCUPACIONAL Y SCTR)
            "examenmedico" => @"
                SELECT IdExamenMedico AS id, IdExamenMedico AS idExamenMedico,
                       NombreTrabajador AS trabajador, NombreTrabajador AS nombre,
                       TipoExamen AS tipoExamen, TipoExamen AS tipo,
                       ClinicaOcupacional AS clinica,
                       CONVERT(VARCHAR(10), FechaExamen, 23) AS fechaExamen,
                       CONVERT(VARCHAR(10), FechaVencimiento, 23) AS fechaVencimiento,
                       AptitudMedica AS aptitud, EstadoRevision AS estado, JSON_VALUE(HallazgosMedicosJson,'$.dni') AS dni, JSON_VALUE(HallazgosMedicosJson,'$.puesto') AS puesto,
                       RestriccionesRecomendaciones AS restricciones,
                       RestriccionesRecomendaciones AS descripcion,
                       MedicoEvaluador AS medico
                FROM dbo.Sal_ExamenMedicoOcupacional
                WHERE Estado = 1
                ORDER BY IdExamenMedico DESC;",

            "covid" => @"SELECT IdRegistroSalud AS id, TrabajadorNombre AS trabajador,JSON_VALUE(FichaDetalleJson,'$.dni') AS dni,JSON_VALUE(FichaDetalleJson,'$.tipoPrueba') AS tipoPrueba,JSON_VALUE(FichaDetalleJson,'$.esquemaDosis') AS esquemaDosis,ResultadoEstado AS resultado,JSON_VALUE(FichaDetalleJson,'$.fichaSintomatologica') AS fichaSintomatologica,CONVERT(varchar(10),FechaEvaluacion,23) AS fechaControl,JSON_VALUE(FichaDetalleJson,'$.medicoResponsable') AS medicoResponsable,EstadoRevision AS estado FROM dbo.Sal_VigilanciaCovidPsicologia WHERE SubModulo='COVID' AND Estado=1 ORDER BY IdRegistroSalud DESC;",

            "psicologia" => @"SELECT IdRegistroSalud AS id, TrabajadorNombre AS trabajador,JSON_VALUE(FichaDetalleJson,'$.dni') AS dni,JSON_VALUE(FichaDetalleJson,'$.bateriaEvaluacion') AS bateriaEvaluacion,JSON_VALUE(FichaDetalleJson,'$.trabajoCritico') AS trabajoCritico,JSON_VALUE(FichaDetalleJson,'$.nivelEstresFatiga') AS nivelEstresFatiga,ResultadoEstado AS aptitudPsicologica,JSON_VALUE(FichaDetalleJson,'$.psicologoEvaluador') AS psicologoEvaluador,CONVERT(varchar(10),FechaEvaluacion,23) AS fechaEvaluacion,EstadoRevision AS estado FROM dbo.Sal_VigilanciaCovidPsicologia WHERE SubModulo='PSICOLOGIA' AND Estado=1 ORDER BY IdRegistroSalud DESC;",

            "sctr" => @"SELECT IdRegistroSalud AS id, TrabajadorNombre AS contratistaEmpresa,JSON_VALUE(FichaDetalleJson,'$.numeroPoliza') AS numeroPoliza,JSON_VALUE(FichaDetalleJson,'$.aseguradoraSalud') AS aseguradoraSalud,JSON_VALUE(FichaDetalleJson,'$.aseguradoraPension') AS aseguradoraPension,JSON_VALUE(FichaDetalleJson,'$.periodoVigencia') AS periodoVigencia,CONVERT(varchar(10),FechaEvaluacion,23) AS fechaVencimiento,TRY_CONVERT(int,JSON_VALUE(FichaDetalleJson,'$.trabajadoresCubiertos')) AS trabajadoresCubiertos,EstadoRevision AS estado FROM dbo.Sal_VigilanciaCovidPsicologia WHERE SubModulo='SCTR' AND Estado=1 ORDER BY IdRegistroSalud DESC;",

            // MÓDULO 10: AUDITORÍAS SST Y MATRIZ DE REQUISITOS LEGALES
            "auditoria" => @"
                SELECT IdRegistroAuditoria AS id, IdRegistroAuditoria AS idRegistroAuditoria,
                       TipoRegistro AS tipo, CodigoNormaOAuditoria AS codigo,
                       TituloDescripcion AS nombre, TituloDescripcion AS descripcion,
                       EntidadFiscalizadora AS entidad,
                       PorcentajeCumplimiento AS cumplimiento,
                       NoConformidadesMayores AS ncMayores, NoConformidadesMenores AS ncMenores,
                       CONVERT(VARCHAR(10), FechaEvaluacion, 103) AS fecha,
                       Estado AS estado
                FROM dbo.Aud_AuditoriaRequisitos
                WHERE TipoRegistro IN ('AUDITORIA', 'DIAGNOSTICO') AND Estado = 1
                ORDER BY IdRegistroAuditoria DESC;",

            "requisitos" => @"
                SELECT IdRegistroAuditoria AS id, IdRegistroAuditoria AS idRegistroAuditoria,
                       TipoRegistro AS tipo, CodigoNormaOAuditoria AS codigo,
                       TituloDescripcion AS nombre, TituloDescripcion AS descripcion,
                       EntidadFiscalizadora AS entidad,
                       PorcentajeCumplimiento AS cumplimiento,
                       NoConformidadesMayores AS ncMayores, NoConformidadesMenores AS ncMenores,
                       CONVERT(VARCHAR(10), FechaEvaluacion, 103) AS fecha,
                       Estado AS estado
                FROM dbo.Aud_AuditoriaRequisitos
                WHERE TipoRegistro = 'REQUISITO_LEGAL' AND Estado = 1
                ORDER BY IdRegistroAuditoria DESC;",

            // MÓDULO 11: MEDIO AMBIENTE (RESIDUOS SÓLIDOS, FICHAS QUÍMICAS MSDS Y HUELLA DE CARBONO)
            "residuo" => @"
                SELECT IdRegistroAmbiental AS id, IdRegistroAmbiental AS idRegistroAmbiental,
                       SubModulo AS subModulo, CodigoReferencia AS codigo,
                       NombreElemento AS nombre, NombreElemento AS descripcion,
                       ClasificacionPeligrosidad AS clasificacion,
                       CantidadValor AS cantidad, UnidadMedida AS unidad,
                       EmpresaOperadoraEoRs AS operadorEoRs,
                       CONVERT(VARCHAR(10), FechaRegistro, 103) AS fecha
                FROM dbo.Amb_GestionAmbiental
                WHERE SubModulo IN ('RESIDUO', 'MANIFIESTO') AND Estado = 1
                ORDER BY IdRegistroAmbiental DESC;",

            "fichaquimica" => @"
                SELECT IdRegistroAmbiental AS id, IdRegistroAmbiental AS idRegistroAmbiental,
                       SubModulo AS subModulo, CodigoReferencia AS codigo,
                       NombreElemento AS nombre, NombreElemento AS descripcion,
                       ClasificacionPeligrosidad AS clasificacion,
                       CantidadValor AS cantidad, UnidadMedida AS unidad,
                       EmpresaOperadoraEoRs AS operadorEoRs,
                       CONVERT(VARCHAR(10), FechaRegistro, 103) AS fecha
                FROM dbo.Amb_GestionAmbiental
                WHERE SubModulo = 'FICHA_QUIMICA' AND Estado = 1
                ORDER BY IdRegistroAmbiental DESC;",

            "huella-carbono" => @"
                SELECT IdRegistroAmbiental AS id, IdRegistroAmbiental AS idRegistroAmbiental,
                       SubModulo AS subModulo, CodigoReferencia AS codigo,
                       NombreElemento AS nombre, NombreElemento AS descripcion,
                       ClasificacionPeligrosidad AS clasificacion,
                       CantidadValor AS cantidad, UnidadMedida AS unidad,
                       EmpresaOperadoraEoRs AS operadorEoRs,
                       CONVERT(VARCHAR(10), FechaRegistro, 103) AS fecha
                FROM dbo.Amb_GestionAmbiental
                WHERE SubModulo = 'HUELLA_CARBONO' AND Estado = 1
                ORDER BY IdRegistroAmbiental DESC;",

            // MÓDULO 12: BI, ESTADÍSTICAS, OBJETIVOS, IA Y REGISTRO DE VISITANTES
            "estadistica" => @"
                SELECT IdRegistroBi AS id, IdRegistroBi AS idRegistroBi,
                       TipoRegistro AS tipo, PeriodoAnioMes AS periodo,
                       TituloIndicador AS nombre, TituloIndicador AS descripcion,
                       HorasHombreTrabajadas AS hht,
                       IndiceFrecuencia AS indiceFrecuencia,
                       IndiceSeveridad AS indiceSeveridad,
                       IndiceAccidentabilidad AS indiceAccidentabilidad,
                       MetaPorcentaje AS meta, AvancePorcentaje AS avance
                FROM dbo.Bi_IndicadorObjetivoVisitante
                WHERE TipoRegistro = 'ESTADISTICA_MENSUAL' AND Estado = 1
                ORDER BY PeriodoAnioMes DESC, IdRegistroBi DESC;",

            "objetivo" => @"
                SELECT IdRegistroBi AS id, IdRegistroBi AS idRegistroBi,
                       TipoRegistro AS tipo, PeriodoAnioMes AS periodo,
                       TituloIndicador AS nombre, TituloIndicador AS descripcion,
                       HorasHombreTrabajadas AS hht,
                       IndiceFrecuencia AS indiceFrecuencia,
                       IndiceSeveridad AS indiceSeveridad,
                       IndiceAccidentabilidad AS indiceAccidentabilidad,
                       MetaPorcentaje AS meta, AvancePorcentaje AS avance
                FROM dbo.Bi_IndicadorObjetivoVisitante
                WHERE TipoRegistro = 'OBJETIVO_SST' AND Estado = 1
                ORDER BY IdRegistroBi DESC;",

            "ia" => @"
                SELECT IdRegistroBi AS id, IdRegistroBi AS idRegistroBi,
                       TipoRegistro AS tipo, PeriodoAnioMes AS periodo,
                       TituloIndicador AS nombre, TituloIndicador AS descripcion,
                       HorasHombreTrabajadas AS hht,
                       IndiceFrecuencia AS indiceFrecuencia,
                       IndiceSeveridad AS indiceSeveridad,
                       IndiceAccidentabilidad AS indiceAccidentabilidad,
                       MetaPorcentaje AS meta, AvancePorcentaje AS avance
                FROM dbo.Bi_IndicadorObjetivoVisitante
                WHERE TipoRegistro = 'ANALISIS_IA' AND Estado = 1
                ORDER BY IdRegistroBi DESC;",

            "visitante" => @"
                SELECT IdRegistroBi AS id, IdRegistroBi AS idRegistroBi,
                       TipoRegistro AS tipo, PeriodoAnioMes AS periodo,
                       TituloIndicador AS nombre, TituloIndicador AS descripcion,
                       HorasHombreTrabajadas AS hht,
                       IndiceFrecuencia AS indiceFrecuencia,
                       IndiceSeveridad AS indiceSeveridad,
                       IndiceAccidentabilidad AS indiceAccidentabilidad,
                       MetaPorcentaje AS meta, AvancePorcentaje AS avance
                FROM dbo.Bi_IndicadorObjetivoVisitante
                WHERE TipoRegistro = 'VISITANTE' AND Estado = 1
                ORDER BY IdRegistroBi DESC;",

            _ => @"
                SELECT TOP 20 IdEndpoint AS id, RutaCompleta AS endpoint, ModuloPrefijo AS modulo,
                       TipoOperacion AS operacion, TotalInvocaciones AS invocaciones
                FROM dbo.Sys_EndpointCatalogo
                ORDER BY TotalInvocaciones DESC, IdEndpoint ASC;"
        };
    }

    /// <summary>
    /// Menú lateral del Portal Contratista (equivalente 1:1 a POST /sst/contratista/perfiles del GOSST original).
    /// Devuelve las secciones y submenús desde dbo.Seg_SeccionContratista en el orden de llegada original.
    /// </summary>
}
