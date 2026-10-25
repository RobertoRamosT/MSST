var ProyectoId = 0;
var proyectoObj = [];
var banderaEdicion4 = false;
var banderaEdicionEvalOnline = false;
var listClasificacion = [{id: 1, nombre: "DAF"}, {id: 2, nombre: "DINF"}];
var listFullProyectoSeguridad = [];
var listResponsableProy;
var listTipoIpercProy;
var listTipoEvaluacion;
var listAreaProyecto;
var listTrabajadores;
var contadorListTrab;
var proyectoEstado;
var indexPostulante;
var indexEval;
var listEvaluacionPostulanteOnline;
var listEvaluacionTotal = [];
var listTipoActividades = [];
var listTipoExamenes = [];

var listFullActividades = [];
var listFullExamenes = [];
var listFullSubContratistas = [];

var listFullHojasVida = [], listFullAnalisisTrabajoSeguro = [];
var listFullPermisoTraAltRie = [];
var listFullOperadorEquipo = [];
var listFullEquiposMovilCertificado = [];
var listFullEquiposMovilMantenimiento = [];
var listFullDocumentosEquipIzaje = [],listFullDocNivelCond = [],listFullDocNivelVehMaq = [],listFullDocNivelEquHerr = [];

var listPerfilesProyecto = [],listProyectosSimple=[],listTipoLugaresTrabajoProy = [],listTurnosAnProy = [];
var mensajeUx;
var listFullProyectoSeguridadBuscador = [];
var busquedaActivaPrincipalProySeg,numPaginaActualPrincipalProySeg;
var empresaConfigProyAux = {};

var listTipoAccMej = [{id: 1, nombre: "Accion Correctiva"},
    {id: 2, nombre: "Preventiva"},
    {id: 3, nombre: "Correctiva"},
    {id: 4, nombre: "Mejora"}];

$(function(){
    $("#btnNuevoProyecto").attr("onclick", "javascript:nuevoProyecto();");
    $("#btnCancelarProyecto").attr("onclick", "javascript:cancelarProyecto();");
    $("#btnGuardarProyecto").attr("onclick", "javascript:guardarProyecto();");
    $("#btnEliminarProyecto").attr("onclick", "javascript:eliminarProyecto();");
    $("#btnConsolidadoAudiProyecto").attr("onclick", "javascript:consolidadoAuditoriaContratista();");
    $("#btnResumenAudiProyecto").attr("onclick", "javascript:resumenAuditoriaContratista();");
    $("#btnResumenUnidadAudiProyecto").attr("onclick", "javascript:resumenUnidadAuditoriaContratista();");
    $("#btnResumenUnidadDetalAudiProyecto").attr("onclick", "javascript:resumenUnidadDetalleAuditoriaContratista();");

    $("#btnClipboardProy").on("click", function () {
        var texto = obtenerDatosTablaEstandar("tblProyectos");
        copiarAlPortapapeles(texto, "btnClipboardProy");
        alert("Se han guardado al clipboard la tabla ");
    });

    $("#tabInduccionVirtual").show();
    $("#containerInduccionesVirtuales").show();
//    crearSelectOneMenuObligMultipleCompleto("selEstadoInduccionVirtualEval", "cargarInduccionesVirtualesContratista()", listEstado, "id",
//        "nombre", "#divEstadoInducVirtualEvaluar", "", null);
    $("#containerInduccionesVirtuales").hide();
    $("#tabInduccionVirtual").hide();
});

function getButonDescarga(url,evNombre){
   var btn = (evNombre == ""?"":
      "<a class='btn btn-success' target='_blank' href='"+URL+url+"'>" +
         "<i class=' fa fa-download'></i> Descargar" +
      "</a>");
    
   return btn;
}

function agregarFilaActividadesVersionDos(val){
    var divAfter="#trActTipo"+val.tipo.id;

    var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAct","verIconoAcuerdoEval(this)",
        listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia?id="+val.id+"'>"+
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
        "</a> - ("+getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,0,0)+")");

    var enlaceAuxiliar = (val.evidenciaAuxiliar1Nombre.trim().length == 0?"------":
        "<a class='efectoLink' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_auxiliar_1?id="+val.id+"'>" +
             val.evidenciaAuxiliar1Nombre +
        "</a>");

    var evidenciaTotal = "",evidenciaTotal1 = "";

    if(val.tipo.id == 12 && val.incluyeTrabAltoRiesgo == 1){
        if(val.evidenciaSimpleNombre.length != 0){
            evidenciaTotal = "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_simple?id="+val.id+"'>"+
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaSimpleNombre +
                "</a>";
        }else{
            evidenciaTotal += (val.evidenciaANombre.length == 0?"":(evidenciaTotal.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_a?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaANombre +
                "</a>");

            evidenciaTotal += (val.evidenciaBNombre.length == 0?"":(evidenciaTotal.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_b?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaBNombre +
                "</a>");

            evidenciaTotal += (val.evidenciaCNombre.length == 0?"":(evidenciaTotal.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_c?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaCNombre +
                "</a>");

            evidenciaTotal += (val.evidenciaDNombre.length == 0?"":(evidenciaTotal.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_d?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaDNombre +
                "</a>");

            evidenciaTotal += (val.evidenciaENombre.length == 0?"":(evidenciaTotal.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_e?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaENombre +
                "</a>");
        }

        evidenciaTotal = (evidenciaTotal.length == 0?"------":evidenciaTotal);

        if(val.evidenciaSimple1Nombre.length != 0){
            evidenciaTotal1 = "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_simple1?id="+val.id+"'>"+
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaSimple1Nombre +
                "</a>";
        }else{
            evidenciaTotal1 += (val.evidenciaA1Nombre.length == 0?"":(evidenciaTotal1.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_a1?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaA1Nombre +
                "</a>");

            evidenciaTotal1 += (val.evidenciaB1Nombre.length == 0?"":(evidenciaTotal1.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_b1?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaB1Nombre +
                "</a>");

            evidenciaTotal1 += (val.evidenciaC1Nombre.length == 0?"":(evidenciaTotal1.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_c1?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaC1Nombre +
                "</a>");

            evidenciaTotal1 += (val.evidenciaD1Nombre.length == 0?"":(evidenciaTotal1.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_d1?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaD1Nombre +
                "</a>");

            evidenciaTotal1 += (val.evidenciaE1Nombre.length == 0?"":(evidenciaTotal1.length == 0?"":" - ") +
                "*<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_e1?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaE1Nombre +
                "</a>");
        }

        evidenciaTotal1 = (evidenciaTotal1.length == 0?"------":evidenciaTotal1);
    }

    var detalle = (val.tipo.id == 12?"<strong>*Fecha inicio:</strong> "+val.fechaPlanificadaTexto:"") +
        (val.tipo.id == 12?"<br><strong>*Fecha fin:</strong> "+val.fechaFinVigenciaTexto+"<br>":"") +
        "<strong>*Evidencia:</strong> "+enlaceEvidencia +
        (val.tipo.id == 7?"<br><strong>*Procedimiento de IPERC:</strong> "+enlaceAuxiliar:"") +
        (val.tipo.id == 12?"<br><strong>*¿Incluye trabajos de alto riesgo?</strong> "+(val.incluyeTrabAltoRiesgo == 1?"Sí":"No"):"") +
        (val.tipo.id == 12 && val.incluyeTrabAltoRiesgo == 1?"<br><strong>*Prevencionistas registrados:</strong> "+val.listPrevencionistasNombre:"") +
        (val.tipo.id == 12 && val.incluyeTrabAltoRiesgo == 1?"<br><strong>*Análisis de trabajo seguro:</strong> "+evidenciaTotal:"") +
        (val.tipo.id == 12 && val.incluyeTrabAltoRiesgo == 1?"<br><strong>*Prevencionistas registrados:</strong> "+evidenciaTotal1:"") +
        (val.tipo.id == 1?"<br><strong>*Categoría:</strong> "+(val.categoria.nombre.trim().length == 0?"------":val.categoria.nombre):"") +
        (val.tipo.id == 1?"<br><strong>*Fecha planificada:</strong> "+val.fechaPlanificadaTexto:"") +
        (val.tipo.id == 1?"<br><strong>*Actividad:</strong> "+val.descripcion:"") +
        (val.tipo.id == 1 && [2,9].includes(val.categoria.id)?"<br><strong>*% de cumplimiento:</strong> "+val.puntaje:"") +
        (val.tipo.id == 1 && [3,6,8].includes(val.categoria.id)?"<br><strong>*Expositor:</strong> "+(val.expositor.trim().length == 0?"------":val.expositor):"") +
        (val.tipo.id == 1 && [3,6,8].includes(val.categoria.id)?"<br><strong>*N° de trabajadores:</strong> "+val.numTrabajadores:"") +
        (val.tipo.id == 1 && [3,6,8].includes(val.categoria.id)?"<br><strong>*Duración (minutos):</strong> "+val.duracion:"") +
        (val.tipo.id != 12?"<br><strong>*"+(val.tipo.id == 5?"Título del documento":"Observación del contratista")+":</strong> "+(val.observacion.trim().length == 0?"------":val.observacion):"") +
        (val.evidenciaFechaTexto == "------"?"":"<br><strong>*Registrado el "+val.evidenciaFechaTexto+"</strong>");

    var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
        "<button type='button' class='btn btn-danger' title='Eliminar actividad' onclick='eliminarFilaDocumentoActividadProyecto("+val.id+","+val.tipo.id+")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

    $(divAfter).after("<tr id='docact"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
            "<td style='border-left:3px solid #2e9e8f;'>"+"<label>"+val.evaluacion.nota.icono+"</label> "+selEstadoObsTotal+"</td>" +
            "<td><textarea id='inputObsEvalTotal' class='form-control' rows='5'></textarea></td>" +
            "<td id='tdFechaEval'>"+val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre.length == 0?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre)+"</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
        "</tr>");

    $("#docact"+val.id).find("#inputObsEvalTotal").val(val.evaluacion.observacion);
}

// P-A00033: documentos de nivel trabajador que permiten asociar varios trabajadores y que, en la pantalla del usuario revisor, ofrecen el mismo
// enlace "Verificacion DNI" que ya tienen el SCTR (tipo 2) y el seguro vida ley (tipo 90): 4 cargo reglamento, 6 T-Registro, 8 EPP, 23 inducciones
// SST de la contratista, 111 induccion SSOMA del cliente, 112 a 118 registros de capacitacion o difusion (112 procedimiento de trabajo, 113 politica
// de seguridad, 114 RISST, 115 reporte de accidentes, 116 IPERC/PETS/PETAR, 117 por puesto de trabajo, 118 IPERC de la contratista).
var TIPOS_VERIFICACION_DNI_REVISOR = [4,6,8,23,111,112,113,114,115,116,117,118];

// El segundo parametro "vista" solo vale "revisor" cuando lo envia la pantalla del revisor. El panel de evaluacion del administrador y la vista del
// trabajador la usan directamente en forEach, donde el segundo parametro es el INDICE (un numero), que nunca es igual a ese texto.
function agregarFilaExamenesVersionDos(val,vista){
    var divAfter = "#trExamTipo"+val.tipo.id;

    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia?id="+val.id+"'>"+
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
        "</a> - ("+getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,0,0)+")");

    var enlaceAuxiliar = (val.evidenciaAuxiliarNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar?id="+val.id+"'>"+
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarNombre +
        "</a>");

    var enlaceAuxiliarDos = (val.evidenciaAuxiliarDosNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar_dos?id="+val.id+"'>"+
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarDosNombre +
        "</a>");

    var enlaceAuxiliarTres = (val.evidenciaAuxiliarTresNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar_tres?id="+val.id+"'>"+
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarTresNombre +
        "</a>");

    var enlaceVacunacion = (val.evidenciaVacunacionNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaVacunacionUrl)+"'>"+
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaVacunacionNombre +
        "</a>");

    var enlaceDni = (val.evidenciaDniNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaDniUrl)+"'>"+
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaDniNombre +
        "</a>");

    var textEvidencia = (val.tipo.id == 78?"Certificado DIGESA":(val.tipo.id == 79?"Certificado de aptitud médica ocupacional":(val.tipo.id == 98?"Formulario de autorización":"Evidencia"))),
        textEvidenciaAux = (val.tipo.id == 79?"Certificados médicos adicionales":(val.tipo.id == 90?"Comprobante de pago":(val.tipo.id == 98?"Control de acceso":"Evidencia auxiliar"))),
        textCampoRegAux1 = (val.tipo.id == 95?"Área operativa":"Razón social de la clínica"),
        textCampoRegAux2 = (val.tipo.id == 95?"Equipos autorizados":"Comentario");

    var enlaceVerificarIa = "";

    var verificacionDniTipoNuevo = (vista === "revisor" && TIPOS_VERIFICACION_DNI_REVISOR.includes(val.tipo.id));

    if(([2,90].includes(val.tipo.id) || verificacionDniTipoNuevo) && val.trabajadoresId.length != 0 && (val.evidenciaNombre.length != 0 || val.evidenciaAuxiliarNombre.length != 0)){
        var extensionEvidencia = getFileExtension(val.evidenciaNombre),extensionEvidenciaAux = getFileExtension(val.evidenciaAuxiliarNombre);
        var hasEvidenciaPdf = (extensionEvidencia == "pdf"?1:0),hasEvidenciaAuxPdf = (extensionEvidenciaAux == "pdf"?1:0); 

        if(hasEvidenciaPdf == 1 || (hasEvidenciaAuxPdf == 1 && val.tipo.id == 2)){
            enlaceVerificarIa = "<a class='efectoLink' target='_blank' onclick='verVerificacionIaDocTrabCont(\""+val.trabajadoresId+"\","+hasEvidenciaPdf +
                ",\""+val.evidenciaUrl+"\","+hasEvidenciaAuxPdf+",\""+val.evidenciaAuxiliarUrl+"\","+val.tipo.id+")'>" +
                    "<i class='fa fa-user'></i> Verificación DNI" +
                "</a>";
        }
    }

    var detalle = (val.trabajadoresNombre.trim().length > 0?"<strong>*Trabajador(es):</strong> "+val.trabajadoresNombre+"<br>":"") +
        (val.tipo.id == 79 && val.trabajosAltoRiesgoAsignadosNombre.length > 0?"<strong>*Trabajos de alto riesgo asociados:</strong> "+val.trabajosAltoRiesgoAsignadosNombre+"<br>":"") +
        (val.tipo.id != 34?"<strong>*"+textEvidencia+":</strong> "+enlaceEvidencia+(enlaceVerificarIa.length == 0?"":" - ["+enlaceVerificarIa+"]"):"") +
        ([2,38,79,90,98].includes(val.tipo.id)?"<br><strong>*"+textEvidenciaAux+":</strong> "+enlaceAuxiliar:"") +
        (val.tipo.id == 2?"<br><strong>*Comprobante de pago:</strong> "+enlaceAuxiliarDos:"") +
        (parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1?"<br><strong>*Certificado de clínica:</strong> "+enlaceAuxiliar:"") +
        (parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1?"<br><strong>*Riesgo de exposición al puesto de trabajo:</strong> "+enlaceAuxiliarDos:"") +
        (parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1?"<br><strong>*Vacunación o declaración jurada de no patologías COVID-19:</strong> "+enlaceAuxiliarTres:"") +
		(parseInt(getSession("gestopcompanyid")) == 272 && val.tipo.id == 1?"<br><strong>*Test de altura:</strong> "+enlaceAuxiliar:"") +
        (val.tipo.id == 34?"<strong>*Carné de vacunación:</strong> "+enlaceVacunacion:"") +
        (val.tipo.id == 34?"<br><strong>*DNI (Parte frontal):</strong> "+enlaceDni:"") +
        (val.tipo.id == 8?"<br><strong>*Descripción:</strong> "+(val.tema.trim().length == 0?"------":val.tema):"") +
        (val.tipo.id == 15?"<br><strong>*Tipo de certificado:</strong> "+val.tipoCertificado.nombre:"") +
        (val.tipo.id == 16?"<br><strong>*Año:</strong> "+val.anio+" <strong>|| Mes:</strong> "+val.mes.nombre:"") +
        (val.tipo.id == 16?"<br><strong>*N° de trabajadores:</strong> "+val.numTrabajadoresIndicador:"") +
        (val.tipo.id == 16?"<br><strong>*Total de HH (Horas Hombres) trabajadas:</strong> "+val.numHorasHombres:"") +
        (val.tipo.id == 16?"<br><strong>*N° de accidentes leves:</strong> "+val.numAccidentesLeves:"") +
        (val.tipo.id == 16?"<br><strong>*N° de accidentes incapacitantes:</strong> "+val.numAccidentesIncapacitantes:"") +
        (val.tipo.id == 16?"<br><strong>*N° de accidentes mortales:</strong> "+val.numAccidentesMortales:"") +
        (val.tipo.id == 16?"<br><strong>*N° de días perdidos:</strong> "+val.numDiasPerdidos:"") +
        (val.tipo.id == 16?"<br><strong>*Presupuesto mensual SST:</strong> "+(val.presupuestoMensual.trim().length == 0?"------":val.presupuestoMensual):"") +
        (val.tipo.id == 34?"<br><strong>*Fecha última dosis:</strong> "+val.fechaUltimaDosisTexto:"") +
        (val.tipo.id == 34?"<br><strong>*Tipo de vacuna:</strong> "+val.tipoVacunaCovid.nombre:"") +
        (val.tipo.id == 34 && val.numCantidadDosis > 0?"<br><strong>*N° de dosis recibidas:</strong> "+val.numCantidadDosis:"") +
        (val.tipo.id == 34 && val.numCantidadDosis > 0?"<br><strong>*Observación adicional:</strong> "+(val.observacion.trim().length == 0?"------":val.observacion):"") +
        ([78,95].includes(val.tipo.id)?"<br><strong>*"+textCampoRegAux1+":</strong> "+(val.razonSocial.trim().length == 0?"------":val.razonSocial):"") +
        (val.tipo.id == 79?"<br><strong>*Clínica (certificación DIGESA):</strong> "+val.clinicaCertifDigesaNombre:"") +
        (val.tipo.id == 79?"<br><strong>*¿Va a realizar alguna de las actividades listadas?</strong> "+(val.hasTrabAltoRiesgo == 1?"Sí":"No"):"") +
        (val.tipo.id == 79 && val.hasTrabAltoRiesgo == 1?"<br><strong>*Actividad(es) seleccionada(s):</strong> "+(val.trabajosAltoRiesgoHabilitadosNombre.length == 0?"------":val.trabajosAltoRiesgoHabilitadosNombre):"") +
        ([44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,95].includes(val.tipo.id)?"<br><strong>*"+textCampoRegAux2+":</strong> "+(val.observacion.trim().length == 0?"------":val.observacion):"") +
        (![14,16,34,101,128,129,130,132,133,134].includes(val.tipo.id)?"<br><strong>*Fecha inicio de vigencia:</strong> "+val.fechaTexto:"") +
        (![14,16,34,101,128,129,130,132,133,134].includes(val.tipo.id)?"<br><strong>*Fecha fin de vigencia:</strong> "+val.fechaFinVigenciaTexto:"") +
        (val.evidenciaFechaTexto == "------" && val.fechaRegistroVacunacionTexto == "------"?"":"<br><strong>*Registrado el "+(val.tipo.id == 34?val.fechaRegistroVacunacionTexto:val.evidenciaFechaTexto)+"</strong>") +
        // P73: bloque de evaluación con IA por fila (solo tipos habilitados; definido en evaluacion_ia.js)
        (typeof TIPOS_EVAL_IA_EXAMEN !== "undefined" && TIPOS_EVAL_IA_EXAMEN.includes(val.tipo.id)?"<br>"+getBloqueEvaluacionIaExamen(val.id):"");

    var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAct","verIconoAcuerdoEval(this)",
        listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
        "<button type='button' class='btn btn-danger' title='Eliminar examen' onclick='eliminarFilaDocumentoExamenProyecto("+val.id+")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

    $(divAfter).after("<tr id='docexam"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
            "<td style='border-left:3px solid #2e9e8f;'>"+"<label>"+val.evaluacion.nota.icono+"</label> "+selEstadoObsTotal+"</td>" +
            "<td><textarea id='inputObsEvalTotal' class='form-control' rows='5'></textarea></td>" +
            "<td>"+val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre.trim().length == 0?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre)+"</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
        "</tr>");

    $("#docexam"+val.id).find("#inputObsEvalTotal").val(val.evaluacion.observacion);
}

function agregarFilaSubContratista(val) {
    var divAfter = "#trSubContratistaDoc";

    var detalle =
        "<strong>*** DOCUMENTO ***</strong>" +
        "<br><strong>*Tipo:</strong> " + val.tipo.nombre +
        "<br><strong>*Observación:</strong> " + (val.observacion.length == 0 ? "------" : val.observacion) +
        "<br><strong>*Fecha inicio de vigencia:</strong> " + val.fechaInicioVigenciaTexto +
        "<br><strong>*Fecha fin de vigencia:</strong> " + val.fechaFinVigenciaTexto +
        "<br><strong>*Subcontratista asociado:</strong> " + val.subcontratista.nombre +
        "<br><strong>*Lista asociada:</strong> " + val.subcontratista.listaEvaluacion.nombre;

    var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAct", "verIconoAcuerdoEval(this)",
        listEvaluacionTotal, val.evaluacion.nota.id, "id", "nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1 ? "<label>*No aplica</label>" :
        "<button type='button' class='btn btn-danger' title='Eliminar documento - subcontratista' " +
        "onclick='eliminarFilaDocumentoSubcontratistaProyecto(" + val.id + ")'>" +
        "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

   cargarListConexionesVisorEvidencia(0,"/contratista/subcontratista/documento/evidencia/url",val.evidenciaNombre); 
    
   $(divAfter).after(
      "<tr id='docsubcontratista"+val.id+"'>" +
         "<td style='word-break:break-all;'>"+val.evidenciaNombre+"</td>" +
         "<td>"+(val.fechaCreacionTexto)+"</td>" +
         "<td>" +
             getButonDescarga("/contratista/subcontratista/documento/evidencia?id="+val.id,val.evidenciaNombre) +
             getButtonVisorEvidencia(val.evidenciaNombre,val.id,1,0) +
         "</td>" +
        "<td style='text-align:left;'>" + detalle + "</td>" +
        "<td style='border-left:3px solid #2e9e8f;'>" +
        "<label>" + val.evaluacion.nota.icono + "</label> " +
        selEstadoObsTotal +
        "</td>" +
        "<td><input class='form-control' id='inputObsEvalTotal'></td>" +
        "<td>" +
        val.evaluacion.fechaTexto +
        (val.evaluacion.usuario.nombre.length == 0 ? "" : "<br>*Evaluado por " + val.evaluacion.usuario.nombre) +
        "</td>" +
        "<td style='border-left:3px solid #2E9E8F;'>" + btnEliminar + "</td>" +
        "</tr>");

    $("#docsubcontratista" + val.id).find("#inputObsEvalTotal").val(val.evaluacion.observacion);
}

function agregarFilaSubContratistaVersionDos(val) {
    var divAfter = "#trSubContratistaDoc";

    cargarListConexionesVisorEvidencia(0,"/contratista/subcontratista/documento/evidencia/url",val.evidenciaNombre);

    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/subcontratista/documento/evidencia?id="+val.id+"'>"+
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
        "</a> - ("+getButtonVisorEvidencia(val.evidenciaNombre,val.id,0,0)+")");

    var detalle = "<strong>*** DOCUMENTO ***</strong>" +
        "<br><strong>*Evidencia:</strong> "+enlaceEvidencia +
        "<br><strong>*Tipo:</strong> "+val.tipo.nombre +
        "<br><strong>*Observación:</strong> "+(val.observacion.length == 0?"------":val.observacion) +
        "<br><strong>*Fecha inicio de vigencia:</strong> "+val.fechaInicioVigenciaTexto +
        "<br><strong>*Fecha fin de vigencia:</strong> "+val.fechaFinVigenciaTexto +
        "<br><strong>*Subcontratista asociado:</strong> "+val.subcontratista.nombre +
        "<br><strong>*Lista asociada:</strong> "+val.subcontratista.listaEvaluacion.nombre +
         (val.fechaCreacionTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaCreacionTexto+"</strong>");

    var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAct","verIconoAcuerdoEval(this)",
        listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
        "<button type='button' class='btn btn-danger' title='Eliminar documento - subcontratista' onclick='eliminarFilaDocumentoSubcontratistaProyecto("+val.id+")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

    $(divAfter).after("<tr id='docsubcontratista"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
            "<td style='border-left:3px solid #2e9e8f;'>"+"<label>"+val.evaluacion.nota.icono+"</label> "+selEstadoObsTotal+"</td>" +
            "<td><textarea id='inputObsEvalTotal' class='form-control' rows='5'></textarea></td>" +
            "<td>"+val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre.length == 0?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre)+"</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
        "</tr>");

    $("#docsubcontratista" + val.id).find("#inputObsEvalTotal").val(val.evaluacion.observacion);
}

function agregarFilaHojaVidaVersionDos(val) {
    var divAfter = "#trHojaVida";

    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/hojavida/evidencia?id="+val.id+"'>" +
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
        "</a> - ("+getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,0,0)+")");

    var detalle = "<strong>*Evidencia:</strong> "+enlaceEvidencia +
        "<br><strong>Trabajador:</strong> "+val.trabajador.nombreCompleto +
		"<br><strong>Puesto de trabajo:</strong> "+(val.trabajador.cargo.trim().length == 0?"------":val.trabajador.cargo) +
        "<br><strong>Detalle:</strong> "+(val.observacion.length == 0?"------":val.observacion) +
         (val.fechaRegistroTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaRegistroTexto+"</strong>") +
         // Partida 36: bloque de evaluacion con IA (badge + boton). Definido en evaluacion_ia.js.
         (typeof getBloqueEvaluacionIa === "function"?getBloqueEvaluacionIa(val.id):"");

    var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAct","verIconoAcuerdoEval(this)",
        listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
        "<button type='button' class='btn btn-danger' title='Eliminar hoja de vida' onclick='eliminarFilaDocumentoHojaVidaProyecto("+val.id+")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

    $(divAfter).after("<tr id='docHojaVida"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
            "<td style='border-left: 3px solid #2e9e8f;'>"+"<label>"+val.evaluacion.nota.icono+"</label> "+selEstadoObsTotal+"</td>" +
            "<td><textarea id='inputObsEvalTotal' class='form-control' rows='5'></textarea></td>" +
            "<td>"+val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre.length == 0?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre)+"</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
        "</tr>");

    $("#docHojaVida"+val.id).find("#inputObsEvalTotal").val(val.evaluacion.observacion);
}

function agregarFilaEquipoMovil(tipo, val, doc) {
   var divAfter,btnEliminar;

   if(tipo == 1){ // *** Equipo - trabajador ***
        divAfter = "#trEquipMovilOper";

        if (val.evaluacionEvidenciaCapacitacion.id == null) {
            val.evaluacionEvidenciaCapacitacion.id = 3;
            val.evaluacionEvidenciaCapacitacion.icono = "<i style='font-size:19px;color:#df9226' class='fa fa-eye' aria-hidden='true'></i>";
        }

        var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoMovilOper", "verIconoAcuerdoEval(this)",
            listEvaluacionTotal, val.evaluacionEvidenciaCapacitacion.id, "id", "nombre");
        var evidenciaNombre = val.evidenciaCapacitacionNombre;
        var descripcion = "Certificado de Capacitacion:<br>" + evidenciaNombre;
        var fechaSubida = val.fechaRegistroTexto;
        var detalle = val.trabajador.nombre;

        btnEliminar = (val.evaluacionEvidenciaCapacitacion.id == 1 ? "<label>*No aplica</label>" :
            "<button type='button' class='btn btn-danger' title='Eliminar equipo móvil - operador' " +
            "onclick='eliminarFilaDocumentoEquipoMovilTipoUnoProyecto(" + val.id + ")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
            "</button>");
        
      cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/operador/evidencia1/url",val.evidenciaCapacitacionNombre);

      $(divAfter).after(
         "<tr id='docEquipoMovilOper"+val.id+"'>" +
            "<td style='word-break:break-all;'>"+descripcion+"</td>" +
            "<td>"+fechaSubida+"</td>" +
            "<td>" +
                getButonDescarga("/contratista/equipomovil/operador/evidencia1?id="+val.id,val.evidenciaCapacitacionNombre) +
                getButtonVisorEvidencia(val.evidenciaCapacitacionNombre,val.id,1,0) +
            "</td>" +
            "<td>" + detalle + "</td>" +
            "<td style='border-left:3px solid #01529b;'>" +
            "<label>" + val.evaluacionEvidenciaCapacitacion.icono + "</label> " + selEstadoObsTotal +
            "</td>" +
            "<td><input class='form-control' id='inputObsEvalTotal'></td>" +
            "<td id='tdFechaEval'>" +
            val.evaluacionEvidenciaCapacitacion.fechaTexto + "<br>" +
            (val.evaluacionEvidenciaCapacitacion.usuario.nombre == "" ? "" :
                "*Evaluado por " + val.evaluacionEvidenciaCapacitacion.usuario.nombre) +
            "</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>" + btnEliminar + "</td>" +
            "</tr>");

        $("#docEquipoMovilOper" + val.id).find("#inputObsEvalTotal").val(val.evaluacionEvidenciaCapacitacion.observacion);
   }else if(tipo == 2){  // *** Equipos ***
      divAfter = "#trEquipMovil";

      if(doc == 1){
            // *** Certificados ***
            if (val.evaluacionEvidenciaOperatividad.id == null) {
                val.evaluacionEvidenciaOperatividad.id = 3;
                val.evaluacionEvidenciaOperatividad.icono = "<i style='font-size:19px;color: #df9226' class='fa fa-eye' aria-hidden='true'></i>";
            }

            var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoMovilEvi1", "verIconoAcuerdoEval(this)",
                listEvaluacionTotal, val.evaluacionEvidenciaOperatividad.id, "id", "nombre");
            var evidenciaNombre1 = val.evidenciaOperatividadNombre;
            var descripcion = "Certficado de Operatividad:<br>" + evidenciaNombre1;
            var fechaSubida = val.fechaRegistroTexto;
            var detalle = val.descripcion + " / " + val.identificador;

            btnEliminar = (val.evaluacionEvidenciaOperatividad.id == 1 ? "<label>*No aplica</label>" :
                "<button type='button' class='btn btn-danger' title='Eliminar equipo móvil' " +
                "onclick='eliminarFilaDocumentoEquipoMovilTipoDosProyecto(" + val.id + ")'>" +
                "<i class='fa fa-times fa-2x'></i>" +
                "</button>");

         cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/evidencia1/url",val.evidenciaOperatividadNombre);
            
         $(divAfter).after(
            "<tr id='docEquipoMovil"+val.id+"Evi1'>" +
               "<td style='word-break:break-all;'>"+descripcion+"</td>" +
               "<td>"+fechaSubida+"</td>" +
               "<td>" +
                   getButonDescarga("/contratista/equipomovil/evidencia1?id="+val.id,val.evidenciaOperatividadNombre) + 
                   getButtonVisorEvidencia(val.evidenciaOperatividadNombre,val.id,1,0) +
               "</td>" +
                "<td>" + detalle + "</td>" +
                "<td style='border-left:3px solid #01529b;'>" +
                "<label>" + val.evaluacionEvidenciaOperatividad.icono + "</label> " +
                selEstadoObsTotal +
                "</td>" +
                "<td><input class='form-control' id='inputObsEvalTotalEvi1'></td>" +
                "<td id='tdFechaEvalEvi1'>" +
                val.evaluacionEvidenciaOperatividad.fechaTexto + "<br>" +
                (val.evaluacionEvidenciaOperatividad.usuario.nombre == "" ? "" :
                    "*Evaluado por " + val.evaluacionEvidenciaOperatividad.usuario.nombre) +
                "</td>" +
                "<td style='border-left:3px solid #2E9E8F;'>" + btnEliminar + "</td>" +
                "</tr>");

            $("#docEquipoMovil" + val.id + "Evi1").find("#inputObsEvalTotalEvi1").val(val.evaluacionEvidenciaOperatividad.observacion);
      }else{
            // *** Mantenimiento ***
            if (val.evaluacionEvidenciaMantenimiento.id == null) {
                val.evaluacionEvidenciaMantenimiento.id = 3;
                val.evaluacionEvidenciaMantenimiento.icono = "<i style='font-size:19px;color: #df9226' class='fa fa-eye' aria-hidden='true'></i>";
            }

            selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoMovilEvi2", "verIconoAcuerdoEval(this)",
                listEvaluacionTotal, val.evaluacionEvidenciaMantenimiento.id, "id", "nombre");
            evidenciaNombre1 = val.evidenciaMantenimientoNombre;
            descripcion = "Certficado del Último Mantenimiento:<br>" + evidenciaNombre1;
            fechaSubida = val.fechaRegistroTexto;
            detalle = val.descripcion + " / " + val.identificador;

            btnEliminar = (val.evaluacionEvidenciaMantenimiento.id == 1 ? "<label>*No aplica</label>" :
                "<button type='button' class='btn btn-danger' title='Eliminar equipo móvil' " +
                "onclick='eliminarFilaDocumentoEquipoMovilTipoDosProyecto(" + val.id + ")'>" +
                "<i class='fa fa-times fa-2x'></i>" +
                "</button>");
            
         cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/evidencia2/url",val.evidenciaMantenimientoNombre);

         $(divAfter).after(
            "<tr id='docEquipoMovil"+val.id+"Evi2'>" +
               "<td style='word-break:break-all;'>"+descripcion+"</td>" +
               "<td>"+fechaSubida+"</td>" +
               "<td>" +
                   getButonDescarga("/contratista/equipomovil/evidencia2?id="+val.id,val.evidenciaMantenimientoNombre) +
                   getButtonVisorEvidencia(val.evidenciaMantenimientoNombre,val.id,1,0) +
               "</td>" +
                "<td>" + detalle + "</td>" +
                "<td style='border-left: 3px solid #01529b;'>" +
                "<label>" + val.evaluacionEvidenciaMantenimiento.icono + "</label> " +
                selEstadoObsTotal +
                "</td>" +
                "<td><input class='form-control' id='inputObsEvalTotalEvi2'></td>" +
                "<td id='tdFechaEvalEvi2'>" +
                val.evaluacionEvidenciaMantenimiento.fechaTexto + "<br>" +
                (val.evaluacionEvidenciaMantenimiento.usuario.nombre == "" ? "" :
                    "*Evaluado por " + val.evaluacionEvidenciaMantenimiento.usuario.nombre) +
                "</td>" +
                "<td style='border-left:3px solid #2E9E8F;'>" + btnEliminar + "</td>" +
                "</tr>");

            $("#docEquipoMovil" + val.id + "Evi2").find("#inputObsEvalTotalEvi2").val(val.evaluacionEvidenciaMantenimiento.observacion);
      }
   }else if(tipo == 3){ // *** Documentos tanto equipos moviles como de izaje (falta izaje)
        if (val.seccion.id == 1) {
            divAfter = "#trEquipMovilDoc";
        } else if (val.seccion.id == 2) {
            divAfter = "#trIzajeDoc";
        }

        if (val.evaluacionEvidencia.id == null) {
            val.evaluacionEvidencia.id = 3;
            val.evaluacionEvidencia.icono = "<i style='font-size:19px;color: #df9226' class='fa fa-eye' aria-hidden='true'></i>";
        }

        var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoDocEvi1", "verIconoAcuerdoEval(this)",
            listEvaluacionTotal, val.evaluacionEvidencia.id, "id", "nombre");
        var evidenciaNombre1 = val.evidenciaNombre;
        var descripcion = "Procedimiento de Trabajo";
        var fechaSubida = val.fechaRegistroTexto;
        var detalle = evidenciaNombre1;

        var btnEliminar1 = "<label>*No aplica</label>";

      cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/documentacion/evidencia1/url",val.evidenciaNombre);
        
      $(divAfter).after(
         "<tr id='docEquipoDoc"+val.id+"Evi1'>" +
            "<td style='word-break:break-all;'>"+descripcion+"</td>" +
            "<td>"+fechaSubida+"</td>" +
            "<td>" +
                getButonDescarga("/contratista/equipomovil/documentacion/evidencia1?id="+val.id,val.evidenciaNombre) +
                getButtonVisorEvidencia(val.evidenciaNombre,val.id,1,0) +
            "</td>" +
            "<td>" + detalle + "</td>" +
            "<td style='border-left:3px solid #01529b;'>" +
            "<label>" + val.evaluacionEvidencia.icono + "</label> " +
            selEstadoObsTotal +
            "</td>" +
            "<td><input class='form-control' id='inputObsEvalTotalEvi1'></td>" +
            "<td id='tdFechaEvalEvi1'>" +
            val.evaluacionEvidencia.fechaTexto + "<br>" +
            "*Evaluado por " + val.evaluacionEvidencia.usuario.nombre +
            "</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>" + btnEliminar1 + "</td>" +
            "</tr>");

        $("#docEquipoDoc" + val.id + "Evi1").find("#inputObsEvalTotalEvi1").val(val.evaluacionEvidencia.observacion);

        if (val.evaluacionEvidenciaIperc.id == null) {
            val.evaluacionEvidenciaIperc.id = 3;
            val.evaluacionEvidenciaIperc.icono = "<i style='font-size:19px;color: #df9226' class='fa fa-eye' aria-hidden='true'></i>";
        }

        selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoDocEvi2", "verIconoAcuerdoEval(this)",
            listEvaluacionTotal, val.evaluacionEvidenciaIperc.id, "id", "nombre");
        evidenciaNombre1 = val.evidenciaIpercNombre;
        descripcion = "IPERC de la Actividad";
        fechaSubida = val.fechaRegistroTexto;
        detalle = evidenciaNombre1;

        var btnEliminar2 = "<label>*No aplica</label>";
        
      cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/documentacion/evidencia2/url",val.evidenciaIpercNombre);

      $(divAfter).after(
         "<tr id='docEquipoDoc"+val.id+"Evi2'>" +
            "<td style='word-break:break-all;'>"+descripcion+"</td>" +
            "<td>"+fechaSubida+"</td>" +
            "<td>" +
                getButonDescarga("/contratista/equipomovil/documentacion/evidencia2?id="+val.id,val.evidenciaIpercNombre) +
                getButtonVisorEvidencia(val.evidenciaIpercNombre,val.id,1,0) +
            "</td>" +
            "<td>" + detalle + "</td>" +
            "<td style='border-left: 3px solid #01529b;'>" +
            "<label>" + val.evaluacionEvidenciaIperc.icono + "</label> " +
            selEstadoObsTotal +
            "</td>" +
            "<td><input class='form-control' id='inputObsEvalTotalEvi2'></td>" +
            "<td id='tdFechaEvalEvi2'>" +
            val.evaluacionEvidenciaIperc.fechaTexto + "<br>" +
            "*Evaluado por " + val.evaluacionEvidenciaIperc.usuario.nombre +
            "</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>" + btnEliminar2 + "</td>" +
            "</tr>");

        $("#docEquipoDoc" + val.id + "Evi2").find("#inputObsEvalTotalEvi2").val(val.evaluacionEvidenciaIperc.observacion);
    }

    $(divAfter).show();
}

function agregarFilaEquipoMovilVersionDos(tipo,val,doc) {
    var divAfter;

    if(tipo == 1){ // *** Equipo - trabajador ***
        divAfter = "#trEquipMovilOper";

        cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/operador/evidencia1/url",val.evidenciaCapacitacionNombre);

        var enlaceEvidencia = (val.evidenciaCapacitacionNombre.trim().length == 0?"------":
            "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/equipomovil/operador/evidencia1?id="+val.id+"'>" +
                "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaCapacitacionNombre +
            "</a> - ("+getButtonVisorEvidencia(val.evidenciaCapacitacionNombre,val.id,0,0)+")");

        var detalle = "<strong>*Trabajador:</strong> "+val.trabajador.nombre +
            "<br><strong>*Certificado de capacitacion:</strong> "+enlaceEvidencia +
             (val.fechaRegistroTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaRegistroTexto+"</strong>");

        var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoMovilOper","verIconoAcuerdoEval(this)",
            listEvaluacionTotal,val.evaluacionEvidenciaCapacitacion.id,"id","nombre");

        var btnEliminar = (val.evaluacionEvidenciaCapacitacion.id == 1?"<label>*No aplica</label>":
            "<button type='button' class='btn btn-danger' title='Eliminar equipo móvil - operador' onclick='eliminarFilaDocumentoEquipoMovilTipoUnoProyecto("+val.id+")'>" +
                "<i class='fa fa-times fa-2x'></i>" +
            "</button>");

        $(divAfter).after("<tr id='docEquipoMovilOper"+val.id+"'>" +
                "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
                "<td style='border-left:3px solid #01529b;'>"+"<label>"+val.evaluacionEvidenciaCapacitacion.icono+"</label> "+selEstadoObsTotal+"</td>" +
                "<td><textarea id='inputObsEvalTotal' class='form-control' rows='4'></textarea></td>" +
                "<td id='tdFechaEval'>"+val.evaluacionEvidenciaCapacitacion.fechaTexto +
                     (val.evaluacionEvidenciaCapacitacion.usuario.nombre.length == 0?"":"<br>*Evaluado por "+val.evaluacionEvidenciaCapacitacion.usuario.nombre)+"</td>" +
                "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
            "</tr>");

        $("#docEquipoMovilOper"+val.id).find("#inputObsEvalTotal").val(val.evaluacionEvidenciaCapacitacion.observacion);
    }else if(tipo == 2){  // *** Equipos ***
        divAfter = "#trEquipMovil";

        if(doc == 1){// *** Certificados ***
            cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/evidencia1/url",val.evidenciaOperatividadNombre);

            var enlaceEvidencia = (val.evidenciaOperatividadNombre.trim().length == 0?"------":
                "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/equipomovil/evidencia1?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaOperatividadNombre +
                "</a> - ("+getButtonVisorEvidencia(val.evidenciaOperatividadNombre,val.id,0,0)+")");

            var detalle = "<strong>*Certificado de operatividad:</strong> "+enlaceEvidencia +
                "<br><strong>*Descripción del equipo:</strong> "+(val.descripcion.trim().length == 0?"------":val.descripcion) +
                "<br><strong>*Nº de identificación del equipo:</strong> "+(val.identificador.trim().length == 0?"------":val.identificador) +
                 (val.fechaRegistroTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaRegistroTexto+"</strong>");

            var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoMovilEvi1","verIconoAcuerdoEval(this)",
                listEvaluacionTotal,val.evaluacionEvidenciaOperatividad.id,"id","nombre");

            var btnEliminar = (val.evaluacionEvidenciaOperatividad.id == 1?"<label>*No aplica</label>":
                "<button type='button' class='btn btn-danger' title='Eliminar equipo móvil' onclick='eliminarFilaDocumentoEquipoMovilTipoDosProyecto("+val.id+")'>" +
                    "<i class='fa fa-times fa-2x'></i>" +
                "</button>");

            $(divAfter).after("<tr id='docEquipoMovil"+val.id+"Evi1'>" +
                    "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
                    "<td style='border-left:3px solid #01529b;'>"+"<label>"+val.evaluacionEvidenciaOperatividad.icono+"</label> "+selEstadoObsTotal+"</td>" +
                    "<td><textarea id='inputObsEvalTotalEvi1' class='form-control' rows='4'></textarea></td>" +
                    "<td id='tdFechaEvalEvi1'>"+val.evaluacionEvidenciaOperatividad.fechaTexto +
                         (val.evaluacionEvidenciaOperatividad.usuario.nombre.trim().length == 0?"":"<br>*Evaluado por "+val.evaluacionEvidenciaOperatividad.usuario.nombre)+"</td>" +
                    "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
                "</tr>");

            $("#docEquipoMovil"+val.id+"Evi1").find("#inputObsEvalTotalEvi1").val(val.evaluacionEvidenciaOperatividad.observacion);
        }else{ // *** Mantenimiento ***
            cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/evidencia2/url",val.evidenciaMantenimientoNombre);

            var enlaceEvidencia = (val.evidenciaMantenimientoNombre.trim().length == 0?"------":
                "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/equipomovil/evidencia2?id="+val.id+"'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaMantenimientoNombre +
                "</a> - ("+getButtonVisorEvidencia(val.evidenciaMantenimientoNombre,val.id,0,0)+")");

            var detalle = "<strong>*Certificado del último mantenimiento:</strong> "+enlaceEvidencia +
                "<br><strong>*Descripción del equipo:</strong> "+(val.descripcion.trim().length == 0?"------":val.descripcion) +
                "<br><strong>*Nº de identificación del equipo:</strong> "+(val.identificador.trim().length == 0?"------":val.identificador) +
                 (val.fechaRegistroTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaRegistroTexto+"</strong>");

            var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoMovilEvi2","verIconoAcuerdoEval(this)",
                listEvaluacionTotal,val.evaluacionEvidenciaMantenimiento.id,"id","nombre");

            var btnEliminar = (val.evaluacionEvidenciaMantenimiento.id == 1?"<label>*No aplica</label>":
                "<button type='button' class='btn btn-danger' title='Eliminar equipo móvil' onclick='eliminarFilaDocumentoEquipoMovilTipoDosProyecto("+val.id+")'>" +
                    "<i class='fa fa-times fa-2x'></i>" +
                "</button>");

            $(divAfter).after("<tr id='docEquipoMovil"+val.id+"Evi2'>" +
                    "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
                    "<td style='border-left:3px solid #01529b;'>"+"<label>"+val.evaluacionEvidenciaMantenimiento.icono+"</label> "+selEstadoObsTotal+"</td>" +
                    "<td><textarea id='inputObsEvalTotalEvi2' class='form-control' rows='4'></textarea></td>" +
                    "<td id='tdFechaEvalEvi2'>"+val.evaluacionEvidenciaMantenimiento.fechaTexto +
                         (val.evaluacionEvidenciaMantenimiento.usuario.nombre.trim().length == 0?"":"<br>*Evaluado por "+val.evaluacionEvidenciaMantenimiento.usuario.nombre)+"</td>" +
                    "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
                "</tr>");

            $("#docEquipoMovil"+val.id+"Evi2").find("#inputObsEvalTotalEvi2").val(val.evaluacionEvidenciaMantenimiento.observacion);
        }
    }else if(tipo == 3){ // *** Documentos tanto equipos moviles como de izaje (falta izaje)
        if(val.seccion.id == 1){
            divAfter = "#trEquipMovilDoc";
        }else if(val.seccion.id == 2){
            divAfter = "#trIzajeDoc";
        }

        cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/documentacion/evidencia1/url",val.evidenciaNombre);

        var enlaceEvidencia1 = (val.evidenciaNombre.trim().length == 0?"------":
            "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/equipomovil/documentacion/evidencia1?id="+val.id+"'>" +
                "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
            "</a> - ("+getButtonVisorEvidencia(val.evidenciaNombre,val.id,0,0)+")");

        var detalle = "<strong>*Procedimiento de trabajo:</strong> "+enlaceEvidencia1 +
            (val.fechaRegistroTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaRegistroTexto+"</strong>");

        var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoDocEvi1","verIconoAcuerdoEval(this)",
            listEvaluacionTotal,val.evaluacionEvidencia.id,"id","nombre");

        var btnEliminar1 = "<label>*No aplica</label>";

        $(divAfter).after("<tr id='docEquipoDoc"+val.id+"Evi1'>" +
                "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
                "<td style='border-left:3px solid #01529b;'>"+"<label>"+val.evaluacionEvidencia.icono+"</label> "+selEstadoObsTotal+"</td>" +
                "<td><textarea id='inputObsEvalTotalEvi1' class='form-control' rows='4'></textarea></td>" +
                "<td id='tdFechaEvalEvi1'>"+val.evaluacionEvidencia.fechaTexto+"<br>"+"*Evaluado por "+val.evaluacionEvidencia.usuario.nombre+"</td>" +
                "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar1+"</td>" +
            "</tr>");

        $("#docEquipoDoc"+val.id+"Evi1").find("#inputObsEvalTotalEvi1").val(val.evaluacionEvidencia.observacion);

        cargarListConexionesVisorEvidencia(0,"/contratista/equipomovil/documentacion/evidencia2/url",val.evidenciaIpercNombre);

        var enlaceEvidencia2 = (val.evidenciaIpercNombre.trim().length == 0?"------":
            "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/equipomovil/documentacion/evidencia2?id="+val.id+"'>" +
                "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaIpercNombre +
            "</a> - ("+getButtonVisorEvidencia(val.evidenciaIpercNombre,val.id,0,0)+")");

        var detalle = "<strong>*IPERC de la actividad:</strong> "+enlaceEvidencia2 +
            (val.fechaRegistroTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaRegistroTexto+"</strong>");

        var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalEquipoDocEvi2","verIconoAcuerdoEval(this)",
            listEvaluacionTotal,val.evaluacionEvidenciaIperc.id,"id","nombre");

        var btnEliminar2 = "<label>*No aplica</label>";

        $(divAfter).after("<tr id='docEquipoDoc"+val.id+"Evi2'>" +
                "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
                "<td style='border-left:3px solid #01529b;'>"+"<label>"+val.evaluacionEvidenciaIperc.icono+"</label> "+selEstadoObsTotal+"</td>" +
                "<td><textarea id='inputObsEvalTotalEvi2' class='form-control' rows='4'></textarea></td>" +
                "<td id='tdFechaEvalEvi2'>"+val.evaluacionEvidenciaIperc.fechaTexto+"<br>"+"*Evaluado por "+val.evaluacionEvidenciaIperc.usuario.nombre+"</td>" +
                "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar2+"</td>" +
            "</tr>");

        $("#docEquipoDoc"+val.id+"Evi2").find("#inputObsEvalTotalEvi2").val(val.evaluacionEvidenciaIperc.observacion);
    }

    $(divAfter).show();
}

function agregarFilaAnalisisTrabajoSeguro(val) {
    var divAfter = "#trAnaTraSeg";

    var detalle =
        "*Participantes: " + val.listTrabajadoresNombre + "<br>" +
        "*Actividades de alto riesgo: " + val.listTipoExamenesConNombre + "<br>" +
        "*Descripción de la actividad: " + val.descripcion + "<br>" +
        "*Ubicación exacta de la actividad: " + val.ubicacion + "<br>" +
        "*Solicitado por " + val.solicitante;

    var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAnaTraSeg", "verIconoAcuerdoEval(this)",
        listEvaluacionTotal, val.evaluacion.nota.id, "id", "nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1 ? "<label>*No aplica</label>" :
        "<button type='button' class='btn btn-danger' title='Eliminar ATS' " +
        "onclick='eliminarFilaDocumentoAtsProyecto(" + val.id + ")'>" +
        "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

   cargarListConexionesVisorEvidencia(0,"/contratista/analisis_trabajo_seguro/evidencia/url",val.evidenciaNombre);
    
   $(divAfter).after(
      "<tr id='docAnaTraSeg"+val.id+"'>" +
         "<td style='word-break:break-all;'>"+val.evidenciaNombre+"</td>" +
         "<td>"+(val.fechaRegistroTexto)+"</td>" +
         "<td>" +
             getButonDescarga("/contratista/analisis_trabajo_seguro/evidencia?id="+val.id,val.evidenciaNombre) +
             getButtonVisorEvidencia(val.evidenciaNombre,val.id,1,0) +
         "</td>" +
        "<td style='text-align:left;'>" + detalle + "</td>" +
        "<td style='border-left:3px solid #2e9e8f;'>" +
        "<label>" + val.evaluacion.nota.icono + "</label> " +
        selEstadoObsTotal +
        "</td>" +
        "<td><input class='form-control' id='inputObsEvalTotalAnaTraSeg'></td>" +
        "<td>" +
        val.evaluacion.fechaTexto +
        (val.evaluacion.usuario.id == -1 ? "" : "<br>*Evaluado por " + val.evaluacion.usuario.nombre) +
        "</td>" +
        "<td style='border-left:3px solid #2E9E8F;'>" + btnEliminar + "</td>" +
        "</tr>");

    $("#docAnaTraSeg" + val.id).find("#inputObsEvalTotalAnaTraSeg").val(val.evaluacion.observacion);
}

function agregarFilaAnalisisTrabajoSeguroVersionDos(val) {
    var divAfter = "#trAnaTraSeg";

    cargarListConexionesVisorEvidencia(0,"/contratista/analisis_trabajo_seguro/evidencia/url",val.evidenciaNombre);

    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/analisis_trabajo_seguro/evidencia?id="+val.id+"'>" +
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
        "</a> - ("+getButtonVisorEvidencia(val.evidenciaNombre,val.id,0,0)+")");

    var detalle = "<strong>*Evidencia:</strong> "+enlaceEvidencia +
        "<br><strong>*Participantes:</strong> "+val.listTrabajadoresNombre +
        "<br><strong>*Actividades de alto riesgo:</strong> "+val.listTipoExamenesConNombre +
        "<br><strong>*Descripción de la actividad:</strong> "+(val.descripcion.trim().length == 0?"------":val.descripcion)+
        "<br><strong>*Ubicación exacta de la actividad:</strong> "+(val.ubicacion.trim().length == 0?"------":val.ubicacion)+
        "<br><strong>*Solicitado por "+val.solicitante+"</strong>" +
         (val.fechaRegistroTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaRegistroTexto+"</strong>");

    var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAnaTraSeg","verIconoAcuerdoEval(this)",
        listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
        "<button type='button' class='btn btn-danger' title='Eliminar ATS' onclick='eliminarFilaDocumentoAtsProyecto("+val.id+")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

    $(divAfter).after("<tr id='docAnaTraSeg"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
            "<td style='border-left:3px solid #2e9e8f;'>"+"<label>"+val.evaluacion.nota.icono+"</label> "+selEstadoObsTotal+"</td>" +
            "<td><textarea id='inputObsEvalTotalAnaTraSeg' class='form-control' rows='5'></textarea></td>" +
            "<td>" + val.evaluacion.fechaTexto+(val.evaluacion.usuario.id == -1?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre)+"</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
        "</tr>");

    $("#docAnaTraSeg"+val.id).find("#inputObsEvalTotalAnaTraSeg").val(val.evaluacion.observacion);
}

function agregarFilaPermisoTrabajoAltoRiesgo(val) {
    var divAfter = "#trPerTraAltRie";

    var detalle =
        "*Actividad realizada: " + val.analisisTrabajoSeguro.descripcion + "<br>" +
        "*Tipo de Permiso de Trabajo: " + val.tipoExamenContratista.nombre + "<br>" +
        "*Prevencionista(s): " + val.listPrevencionistasNombre;

    var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalPerTraAltRie", "verIconoAcuerdoEval(this)",
        listEvaluacionTotal, val.evaluacion.nota.id, "id", "nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1 ? "<label>*No aplica</label>" :
        "<button type='button' class='btn btn-danger' title='Eliminar PETAR' " +
        "onclick='eliminarFilaDocumentoPetarProyecto(" + val.id + ")'>" +
        "<i class='fa fa-times fa-2x'></i>" +
        "</button>");
    
   cargarListConexionesVisorEvidencia(0,"/contratista/permiso_trabajo_alto_riesgo/evidencia/url",val.evidenciaNombre);

   $(divAfter).after(
      "<tr id='docPerTraAltRie"+val.id+"'>" +
         "<td style='word-break:break-all;'>"+val.evidenciaNombre+"</td>" +
         "<td>"+(val.fechaRegistroTexto)+"</td>" +
         "<td>" +
             getButonDescarga("/contratista/permiso_trabajo_alto_riesgo/evidencia?id="+val.id,val.evidenciaNombre) +
             getButtonVisorEvidencia(val.evidenciaNombre,val.id,1,0) +
         "</td>" +
        "<td style='text-align:left;'>" + detalle + "</td>" +
        "<td style='border-left:3px solid #2e9e8f;'>" +
        "<label>" + val.evaluacion.nota.icono + "</label> " +
        selEstadoObsTotal +
        "</td>" +
        "<td><input class='form-control' id='inputObsEvalTotalPerTraAltRie'></td>" +
        "<td>" +
        val.evaluacion.fechaTexto +
        (val.evaluacion.usuario.id == -1 ? "" : "<br>*Evaluado por " + val.evaluacion.usuario.nombre) +
        "</td>" +
        "<td style='border-left:3px solid #2E9E8F;'>" + btnEliminar + "</td>" +
        "</tr>");

    $("#docPerTraAltRie" + val.id).find("#inputObsEvalTotalPerTraAltRie").val(val.evaluacion.observacion);
}

function agregarFilaPermisoTrabajoAltoRiesgoVersionDos(val) {
    var divAfter = "#trPerTraAltRie";

    cargarListConexionesVisorEvidencia(0,"/contratista/permiso_trabajo_alto_riesgo/evidencia/url",val.evidenciaNombre);

    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/permiso_trabajo_alto_riesgo/evidencia?id="+val.id+"'>" +
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
        "</a> - ("+getButtonVisorEvidencia(val.evidenciaNombre,val.id,0,0)+")");

    var detalle =
        "<strong>*Evidencia:</strong> "+enlaceEvidencia +
        "<br><strong>*Actividad realizada:</strong> "+val.analisisTrabajoSeguro.descripcion +
        "<br><strong>*Tipo de Permiso de Trabajo:</strong> "+val.tipoExamenContratista.nombre +
        "<br><strong>*Prevencionista(s):</strong> "+val.listPrevencionistasNombre +
         (val.fechaRegistroTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaRegistroTexto+"</strong>");

    var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalPerTraAltRie","verIconoAcuerdoEval(this)",
        listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
        "<button type='button' class='btn btn-danger' title='Eliminar PETAR' onclick='eliminarFilaDocumentoPetarProyecto("+val.id+")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

    $(divAfter).after("<tr id='docPerTraAltRie"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
            "<td style='border-left:3px solid #2e9e8f;'>"+"<label>"+val.evaluacion.nota.icono+"</label> "+selEstadoObsTotal+"</td>" +
            "<td><textarea id='inputObsEvalTotalPerTraAltRie' class='form-control' rows='5'></textarea></td>" +
            "<td>"+val.evaluacion.fechaTexto+(val.evaluacion.usuario.id == -1?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre)+"</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
        "</tr>");

    $("#docPerTraAltRie"+val.id).find("#inputObsEvalTotalPerTraAltRie").val(val.evaluacion.observacion);
}

function agregarFilaDocumentoNivelConductor(val){
   var divAfter = "#trTipoDocCond"+val.tipoDocumentoConductor.id;

   var detalle = "";
   
   detalle =  "*Conductor: "+val.conductor.nombre+"<br>" +
      "*Fecha inicio vigencia del registro: "+val.fechaInicioVigenciaTexto+"<br>" +
      "*Fecha fin vigencia del registro: "+val.fechaFinVigenciaTexto;

   var selEvalTipoDocCondTotalAct = crearSelectOneMenuOblig("selEvalTipoDocCondTotalAct","verIconoAcuerdoEval(this)",
      listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

   var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
      "<button type='button' class='btn btn-danger' title='Eliminar documento' " +
              "onclick='eliminarFilaDocumentoNivelConductor("+val.id+")'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>");
   
   $(divAfter).after(
      "<tr id='evalTipoDocCond"+val.id+"'>" +
         "<td style='word-break:break-all;'><label>Tipo de licencia:</label><br>"+val.tipoLicenciaConductor.nombre+"</td>" +
         "<td>"+val.fechaCreacionTexto+"</td>" +
         "<td>" +
             getButtonDescargaAmazonS3("/contratista/amazon_s3/documento_nivel_conductor/evidencia?id="+val.id,val.evidenciaNombre,1) +
             getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,1,0) +
         "</td>" +
         "<td id='detalleDocExam' style='text-align:left;'>"+detalle+"</td>" +
         "<td style='border-left:3px solid #2e9e8f;'>" +
            "<label>"+val.evaluacion.nota.icono+"</label> " +
             selEvalTipoDocCondTotalAct +
         "</td>" +
         "<td><input class='form-control' id='inputObsTipoDocCondEvalTotal'></td>" +
         "<td>" +
             val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre == ""?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre) +
         "</td>" +
         "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
      "</tr>");

   $("#evalTipoDocCond"+val.id).find("#inputObsTipoDocCondEvalTotal").val(val.evaluacion.observacion);
}

function agregarFilaDocumentoNivelConductorVersionDos(val){
    var divAfter = "#trTipoDocCond"+val.tipoDocumentoConductor.id;

    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/documento_nivel_conductor/evidencia?id="+val.id+"'>" +
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
        "</a> - ("+getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,0,0)+")");

    var detalle = "<strong>*Conductor:</strong> "+val.conductor.nombre +
        "<br><strong>*Evidencia:</strong> "+enlaceEvidencia +
        "<br><strong>*Tipo de licencia:</strong> "+val.tipoLicenciaConductor.nombre +
        "<br><strong>*Fecha inicio vigencia del registro:</strong> "+val.fechaInicioVigenciaTexto +
        "<br><strong>*Fecha fin vigencia del registro:</strong> "+val.fechaFinVigenciaTexto +
         (val.fechaCreacionTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaCreacionTexto+"</strong>");

    var selEvalTipoDocCondTotalAct = crearSelectOneMenuOblig("selEvalTipoDocCondTotalAct","verIconoAcuerdoEval(this)",
        listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
        "<button type='button' class='btn btn-danger' title='Eliminar documento' onclick='eliminarFilaDocumentoNivelConductor("+val.id+")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

    $(divAfter).after("<tr id='evalTipoDocCond"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
            "<td style='border-left:3px solid #2e9e8f;'>"+"<label>"+val.evaluacion.nota.icono+"</label> "+selEvalTipoDocCondTotalAct+"</td>" +
            "<td><textarea id='inputObsTipoDocCondEvalTotal' class='form-control' rows='5'></textarea></td>" +
            "<td>"+val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre.length == 0?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre)+"</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
        "</tr>");

    $("#evalTipoDocCond"+val.id).find("#inputObsTipoDocCondEvalTotal").val(val.evaluacion.observacion);
}

function agregarFilaDocumentoNivelVehiculoMaquinaria(val){
   var divAfter = "#trTipoDocVehMaq"+val.tipoDocumentoVehiculoMaquinaria.id;

   var detalle = "";
   
   detalle = "*Placa: "+val.vehiculoMaquinaria.placa+"<br>" +
      "*Fecha inicio vigencia del registro: "+val.fechaInicioVigenciaTexto+"<br>" +
      "*Fecha fin vigencia del registro: "+val.fechaFinVigenciaTexto;

   var selEvalTipoDocVehMaqTotalAct = crearSelectOneMenuOblig("selEvalTipoDocVehMaqTotalAct","verIconoAcuerdoEval(this)",
      listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

   var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
      "<button type='button' class='btn btn-danger' title='Eliminar documento' " +
              "onclick='eliminarFilaDocumentoNivelVehiculoMaquinaria("+val.id+")'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>");
   
   $(divAfter).after(
      "<tr id='evalTipoDocVehMaq"+val.id+"'>" +
         "<td style='word-break:break-all;'><label>Tipo de licencia:</label><br>"+val.tipoLicenciaConductor.nombre+"</td>" +
         "<td>"+val.fechaCreacionTexto+"</td>" +
         "<td>" +
             getButtonDescargaAmazonS3("/contratista/amazon_s3/documento_nivel_vehiculo_maquinaria/evidencia?id="+val.id,val.evidenciaNombre,1) +
             getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,1,0) +
         "</td>" +
         "<td id='detalleDocExam' style='text-align:left;'>"+detalle+"</td>" +
         "<td style='border-left:3px solid #2e9e8f;'>" +
            "<label>"+val.evaluacion.nota.icono+"</label> " +
             selEvalTipoDocVehMaqTotalAct +
         "</td>" +
         "<td><input class='form-control' id='inputObsTipoDocVehMaqEvalTotal'></td>" +
         "<td>" +
             val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre == ""?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre) +
         "</td>" +
         "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
      "</tr>");

   $("#evalTipoDocVehMaq"+val.id).find("#inputObsTipoDocVehMaqEvalTotal").val(val.evaluacion.observacion);
}

function agregarFilaDocumentoNivelVehiculoMaquinariaVersionDos(val){
    var divAfter = "#trTipoDocVehMaq"+val.tipoDocumentoVehiculoMaquinaria.id;

    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/documento_nivel_vehiculo_maquinaria/evidencia?id="+val.id+"'>" +
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
        "</a> - ("+getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,0,0)+")");
    
    var enlaceAuxiliar = (val.evidenciaAuxiliarNombre.trim().length == 0?"------":
	"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/documento_nivel_vehiculo_maquinaria/evidencia_auxiliar?id="+val.id+"'>" +
	    "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarNombre +
	"</a>");

    var detalle = "<strong>*Placa:</strong> "+val.vehiculoMaquinaria.placa +
        "<br><strong>*Evidencia:</strong> "+enlaceEvidencia +
        ([3,10].includes(val.tipoDocumentoVehiculoMaquinaria.id)?"<br><strong>*Comprobante de pago:</strong> "+enlaceAuxiliar:"") +
        "<br><strong>*Tipo de licencia:</strong> "+val.tipoLicenciaConductor.nombre +
        "<br><strong>*Fecha inicio vigencia del registro:</strong> "+val.fechaInicioVigenciaTexto +
        "<br><strong>*Fecha fin vigencia del registro:</strong> "+val.fechaFinVigenciaTexto +
         (val.fechaCreacionTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaCreacionTexto+"</strong>");

    var selEvalTipoDocVehMaqTotalAct = crearSelectOneMenuOblig("selEvalTipoDocVehMaqTotalAct","verIconoAcuerdoEval(this)",
        listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
        "<button type='button' class='btn btn-danger' title='Eliminar documento' onclick='eliminarFilaDocumentoNivelVehiculoMaquinaria("+val.id+")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

    $(divAfter).after("<tr id='evalTipoDocVehMaq"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
            "<td style='border-left:3px solid #2e9e8f;'>"+"<label>"+val.evaluacion.nota.icono+"</label> "+selEvalTipoDocVehMaqTotalAct+"</td>" +
            "<td><textarea id='inputObsTipoDocVehMaqEvalTotal' class='form-control' rows='5'></textarea></td>" +
            "<td>"+val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre.length == 0?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre)+"</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
        "</tr>");

    $("#evalTipoDocVehMaq"+val.id).find("#inputObsTipoDocVehMaqEvalTotal").val(val.evaluacion.observacion);
}

function agregarFilaDocumentoNivelEquipoHerramienta(val){
   var divAfter = "#trTipoDocEquHerr"+val.tipoDocumentoEquipoHerramienta.id;

   var detalle = "";
   
   detalle = "*Código: "+val.equipoHerramienta.codigo+"<br>" +
      "*Fecha inicio vigencia del registro: "+val.fechaInicioVigenciaTexto+"<br>" +
      "*Fecha fin vigencia del registro: "+val.fechaFinVigenciaTexto;

   var selEvalTipoDocEquHerrTotalAct = crearSelectOneMenuOblig("selEvalTipoDocEquHerrTotalAct","verIconoAcuerdoEval(this)",
      listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

   var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
      "<button type='button' class='btn btn-danger' title='Eliminar documento' " +
              "onclick='eliminarFilaDocumentoNivelEquipoHerramienta("+val.id+")'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>");
   
   $(divAfter).after(
      "<tr id='evalTipoDocEquHerr"+val.id+"'>" +
         "<td style='word-break:break-all;'><label>Tipo:</label><br>"+val.tipoEquipoHerramienta.nombre+"</td>" +
         "<td>"+val.fechaCreacionTexto+"</td>" +
         "<td>" +
             getButtonDescargaAmazonS3("/contratista/amazon_s3/documento_nivel_equipo_herramienta/evidencia?id="+val.id,val.evidenciaNombre,1) +
             getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,1,0) +
         "</td>" +
         "<td id='detalleDocExam' style='text-align:left;'>"+detalle+"</td>" +
         "<td style='border-left:3px solid #2e9e8f;'>" +
            "<label>"+val.evaluacion.nota.icono+"</label> " +
             selEvalTipoDocEquHerrTotalAct +
         "</td>" +
         "<td><input class='form-control' id='inputObsTipoDocEquHerrEvalTotal'></td>" +
         "<td>" +
             val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre == ""?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre) +
         "</td>" +
         "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
      "</tr>");

   $("#evalTipoDocEquHerr"+val.id).find("#inputObsTipoDocEquHerrEvalTotal").val(val.evaluacion.observacion);
}

function agregarFilaDocumentoNivelEquipoHerramientaVersionDos(val){
    var divAfter = "#trTipoDocEquHerr"+val.tipoDocumentoEquipoHerramienta.id;

    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/documento_nivel_equipo_herramienta/evidencia?id="+val.id+"'>" +
            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
        "</a> - ("+getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,0,0)+")");

    var detalle = "<strong>*Código:</strong> "+val.equipoHerramienta.codigo +
        "<br><strong>*Evidencia:</strong> "+enlaceEvidencia +
        "<br><strong>*Tipo:</strong> "+val.tipoEquipoHerramienta.nombre +
        "<br><strong>*Fecha inicio vigencia del registro:</strong> "+val.fechaInicioVigenciaTexto +
        "<br><strong>*Fecha fin vigencia del registro:</strong> "+val.fechaFinVigenciaTexto +
         (val.fechaCreacionTexto == "------"?"":"<br><strong>*Registrado el "+val.fechaCreacionTexto+"</strong>");

    var selEvalTipoDocEquHerrTotalAct = crearSelectOneMenuOblig("selEvalTipoDocEquHerrTotalAct","verIconoAcuerdoEval(this)",
        listEvaluacionTotal,val.evaluacion.nota.id,"id","nombre");

    var btnEliminar = (val.evaluacion.nota.id == 1?"<label>*No aplica</label>":
        "<button type='button' class='btn btn-danger' title='Eliminar documento' onclick='eliminarFilaDocumentoNivelEquipoHerramienta("+val.id+")'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>");

    $(divAfter).after("<tr id='evalTipoDocEquHerr"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
            "<td style='border-left:3px solid #2e9e8f;'>"+"<label>"+val.evaluacion.nota.icono+"</label> "+selEvalTipoDocEquHerrTotalAct+"</td>" +
            "<td><textarea id='inputObsTipoDocEquHerrEvalTotal' class='form-control' rows='5'></textarea></td>" +
            "<td>"+val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre.length == 0?"":"<br>*Evaluado por "+val.evaluacion.usuario.nombre)+"</td>" +
            "<td style='border-left:3px solid #2E9E8F;'>"+btnEliminar+"</td>" +
        "</tr>");

    $("#evalTipoDocEquHerr"+val.id).find("#inputObsTipoDocEquHerrEvalTotal").val(val.evaluacion.observacion);
}

var listEstado=[
   {id:1,nombre:"Visto bueno"},{id:2,nombre:"Desaprobado"},
   {id:3,nombre:"Pendiente",selected:1},{id:4,nombre:"Por re-evaluar",selected:1}
];

var countPushListEst = 0;
var regresarPrincipalProyVista;

var hasEvalActualizadaProy, hasDocEliminadoProy;

function evaluacionTotalProyecto(){
   resizeDivWrapper("wrapEvalTotalProy",170);
   hasEvalActualizadaProy = 0,hasDocEliminadoProy = 0;

   if(proyectoObj.postulante.contratista == null) {
      alert("Debe asignar un contratista al proyecto antes de evaluar los documentos");
      return;
   }

   regresarPrincipalProyVista = 1;

   $("#tabProyectos .container-fluid").hide();
   $("#divEvaluacionTotalProyecto").show();

   if(parseInt(getSession("gestopcompanyid")) == 154 && countPushListEst == 0){
      listEstado.push({id: 5,nombre: "Por validar",selected: 1});
      countPushListEst++;
   }

   if(parseInt(getSession("gestopcompanyid")) == 285 && countPushListEst == 0){
      listEstado.push({id: 6,nombre: "Por validar",selected: 1});
      countPushListEst++;
   }

   if(parseInt(getSession("gestopcompanyid")) == 272 && countPushListEst == 0){
      listEstado.push({id: 7, nombre: "Recibido"});
      countPushListEst++;
   }
   
   if(parseInt(getSession("gestopcompanyid")) == 747 && countPushListEst == 0) {
       listEstado.push({id:8,nombre:"Por validar",selected:1});countPushListEst++;
   }

   crearSelectOneMenuObligMultipleCompleto("selEstadoDocEval","registrosEvaluacionTotalProyecto()",
      listEstado,"id","nombre","#divEstadoDocsEvaluar","",null);

   $("#tabProyectos h2").html(
      "<a onclick='volverDivProyectos()'>Proyecto ("+proyectoObj.titulo.substring(0,25)+"...) </a> " +
      "> <label>Evaluación general</label>");

    registrosEvaluacionTotalProyecto();
}

var mapTrabContratistaVerfIa;

function registrosEvaluacionTotalProyecto(){
   var listEvaluar=[
      {nombre:listTipoActividades[0].nombre,divTr:"trActTipo1",isHabilitado:proyectoObj.habilitadoActividad1},
      {nombre:"Plan de emergencia",divTr:"trActTipo2",isHabilitado:proyectoObj.habilitadoActividad2},
      {nombre:"Plan COVID 19",divTr:"trActTipo6",isHabilitado:proyectoObj.habilitadoActividad6},
      {nombre:"Matriz de Riesgo (IPERC)",divTr:"trActTipo7",isHabilitado:proyectoObj.habilitadoActividad7},
      {nombre:"Plan de manejo de residuos",divTr:"trActTipo4",isHabilitado:proyectoObj.habilitadoActividad4},
      {nombre:listTipoActividades[3].nombre+" Asociados al proyecto",divTr:"trActTipo5",isHabilitado:proyectoObj.habilitadoActividad5},
      {nombre:"Registro de capacitaciones efectuadas relacionados a los trabajos a realizar",divTr:"trActTipo10",isHabilitado:proyectoObj.habilitadoActividad10},
      {nombre:"Orden de compra o contrato firmado",divTr:"trActTipo11",isHabilitado:proyectoObj.habilitadoActividad11},
      {nombre:"Cronograma de trabajo",divTr:"trActTipo12",isHabilitado:proyectoObj.habilitadoActividad12},
      {nombre:"Programa de charlas diarias de seguridad",divTr:"trActTipo13",isHabilitado:proyectoObj.habilitadoActividad13},
      {nombre:"Procedimiento escrito de trabajo seguro (PETS)",divTr:"trActTipo14",isHabilitado:proyectoObj.habilitadoActividad14},
      {nombre:"Hoja MSDS",divTr:"trActTipo15",isHabilitado:proyectoObj.habilitadoActividad15},
      {nombre:"Instructivo de trabajo seguro para el trabajo en alto riesgo",divTr:"trActTipo16",isHabilitado:proyectoObj.habilitadoActividad16},
      {nombre:"Matriz de aspectos ambientales",divTr:"trActTipo18",isHabilitado:proyectoObj.habilitadoActividad18},
       {nombre:"Memoria descriptiva",divTr:"trActTipo19",isHabilitado:proyectoObj.habilitadoActividad19},
       {nombre:"Póliza de responsabilidad civil",divTr:"trActTipo20",isHabilitado:proyectoObj.habilitadoActividad20},
       {nombre:"Póliza CAR",divTr:"trActTipo21",isHabilitado:proyectoObj.habilitadoActividad21},
       {nombre:"Carta fianza",divTr:"trActTipo22",isHabilitado:proyectoObj.habilitadoActividad22},
	   {nombre:"Plan de rescate",divTr:"trActTipo23",isHabilitado:proyectoObj.habilitadoActividad23},
	   {nombre:"Plan de izaje",divTr:"trActTipo24",isHabilitado:proyectoObj.habilitadoActividad24},
	   {nombre:"Matriz de procesos y actividades",divTr:"trActTipo25",isHabilitado:proyectoObj.habilitadoActividad25},
	   {nombre:"Estructura de SST para el servicio",divTr:"trActTipo26",isHabilitado:proyectoObj.habilitadoActividad26},
	   {nombre:"Plan de contingencia",divTr:"trActTipo27",isHabilitado:proyectoObj.habilitadoActividad27},
	   {nombre:"Señalización de obras e instalaciones",divTr:"trActTipo28",isHabilitado:proyectoObj.habilitadoActividad28},
      {nombre:"Hoja de vida",divTr:"trHojaVida",isHabilitado:proyectoObj.habilitadoHojaVida},
       
      {nombre:(parseInt(getSession("gestopcompanyid")) == 741?"Habilitación médica ocupacional":"Certificados de aptitud médica"),divTr:"trExamTipo1",isHabilitado:proyectoObj.habilitadoCertAptMedica},
      {nombre:"SCTR",divTr:"trExamTipo2",isHabilitado:proyectoObj.habilitadoSctr},
      {nombre:"Cargo RISST",divTr:"trExamTipo4",isHabilitado:proyectoObj.habilitadoCargReglamento},
      {nombre:"T-Registro",divTr:"trExamTipo6",isHabilitado:proyectoObj.habilitadoTRegistro},
      {nombre:"EPP",divTr:"trExamTipo8",isHabilitado:proyectoObj.habilitadoEpp},
      {nombre:"Inducciones SST de la contratista",divTr:"trExamTipo23",isHabilitado:proyectoObj.habilitadoInduccSstCont},
      {nombre:"Certificado de capacitación para trabajo de alto riesgo",divTr:"trExamTipo15",isHabilitado:proyectoObj.habilitadoConstanciaAltoRiesgo},
      {nombre:"Prevencionista", divTr:"trExamTipo14",isHabilitado:proyectoObj.habilitadoPrevencionista},
      {nombre:"Certificados policiales",divTr:"trExamTipo43",isHabilitado:proyectoObj.habilitadoCertifPolicial},
      {nombre:"Prueba COVID-19",divTr:"trExamTipo25",isHabilitado:proyectoObj.habilitadoPruebaCovid},
      {nombre:"Vacuna COVID-19",divTr:"trExamTipo34",isHabilitado:proyectoObj.habilitadoVacunaCovid},
      {nombre:"Antecedentes penales",divTr:"trExamTipo60",isHabilitado:proyectoObj.habilitadoAntecedentesPenales},
      {nombre:"Seguro contra accidentes",divTr:"trExamTipo61",isHabilitado:proyectoObj.habilitadoSeguroAccidentes},
      {nombre:"Riesgo de exposición al puesto de trabajo",divTr:"trExamTipo63",isHabilitado:proyectoObj.habilitadoRiesgoExposicionPuestoTrabajo},
      {nombre:"Vacunación COVID-19",divTr:"trExamTipo64",isHabilitado:proyectoObj.habilitadoVacunacionCovid},
      {nombre:"Carnet de sanidad",divTr:"trExamTipo65",isHabilitado:proyectoObj.habilitadoCarnetSanidad},
      {nombre:"Acuerdo de seguridad y confidencialidad - equipos electrónicos",divTr:"trExamTipo72",isHabilitado:proyectoObj.habilitadoAcuerdoSeguridadEquElec},
      {nombre:"Evaluación toxicológica",divTr:"trExamTipo73",isHabilitado:proyectoObj.habilitadoEvaluacionToxicologica},
      {nombre:"Certificado único laboral",divTr:"trExamTipo74",isHabilitado:proyectoObj.habilitadoCertifUnicoLaboral},
      {nombre:"Antecedentes policiales",divTr:"trExamTipo75",isHabilitado:proyectoObj.habilitadoAntecedentesPoliciales},
      {nombre:"Declaración jurada o verificación del domicilio",divTr:"trExamTipo76",isHabilitado:proyectoObj.habilitadoDeclaracionVerifDomicilio},
      {nombre:"Dotación indumentaria",divTr:"trExamTipo77",isHabilitado:proyectoObj.habilitadoDotacionIndumentaria},
      {nombre:"Habilitación médica por clínica",divTr:"trExamTipo79",isHabilitado:proyectoObj.habilitadoMedicoClinica},
       {nombre:"Cargo RISST de la contratista",divTr:"trExamTipo84",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont84},
       {nombre:"Cargo de recepción de IPERC",divTr:"trExamTipo89",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont89},
       {nombre:"Seguro vida ley",divTr:"trExamTipo90",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont90},
       {nombre:"Documento de identidad",divTr:"trExamTipo99",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont99},
       {nombre:"Procedimiento o manual para trab. contratistas",divTr:"trExamTipo100",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont100},
       {nombre:"Cargo de procedimiento de HS",divTr:"trExamTipo101",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont101},
       {nombre:"Inducción SSOMA del cliente",divTr:"trExamTipo111",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont111},
       {nombre:"Registro de capacitación en procedimiento de trabajo",divTr:"trExamTipo112",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont112},
       {nombre:"Registro de difusión de política de seguridad del cliente",divTr:"trExamTipo113",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont113},
       {nombre:"Registro de difusión de RISST del cliente",divTr:"trExamTipo114",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont114},
       {nombre:"Capacitación en reporte de accidentes e incidentes (flujograma)",divTr:"trExamTipo115",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont115},
       {nombre:"Difusión de IPERC, PETS y PETAR",divTr:"trExamTipo116",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont116},
       {nombre:"Registro de capacitación por puesto de trabajo",divTr:"trExamTipo117",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont117},
       {nombre:"Registro de capacitación de IPERC de la contratista",divTr:"trExamTipo118",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont118},
       {nombre:"Capacitación de buenas prácticas de manipulación de alimentos",divTr:"trExamTipo119",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont119},
       {nombre:"Título del profesional",divTr:"trExamTipo128",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont128},
       {nombre:"Evidencia colegiatura habilitada",divTr:"trExamTipo129",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont129},
       {nombre:"Registro nacional de especialidad",divTr:"trExamTipo130",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont130},
       {nombre:"Constancia/Carnet SUCAMEC",divTr:"trExamTipo131",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont131},
       {nombre:"Certificado capacitacion - BLS (Basic Life Support)",divTr:"trExamTipo132",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont132},
       {nombre:"Certificado capacitacion - PHLS (Prehospital Trauma Life Support)",divTr:"trExamTipo133",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont133},
       {nombre:"Certificado capacitacion - ACLS (Advance Cardiovascular Life Support)",divTr:"trExamTipo134",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont134},
       {nombre:"Difusión de plan de respuesta a emergencia del cliente",divTr:"trExamTipo140",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont140},
       {nombre:"Charla de inducción SST y MA",divTr:"trExamTipo141",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont141},
       {nombre:"Difusión y entrega de política de sostenibilidad del cliente",divTr:"trExamTipo142",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont142},
       {nombre:"Difusión y entrega plan COVID-19",divTr:"trExamTipo143",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont143},
       {nombre:"Capacitación en matriz IPERC",divTr:"trExamTipo144",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont144},
       {nombre:"Capacitación en matriz IAAS",divTr:"trExamTipo145",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont145},
       {nombre:"Capacitación en primeros auxilios",divTr:"trExamTipo146",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont146},
       {nombre:"Capacitación en uso extintor",divTr:"trExamTipo147",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont147},
       {nombre:"Capacitación en plan contingencia",divTr:"trExamTipo148",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont148},
       {nombre:"Capacitación en procedimiento de trabajo",divTr:"trExamTipo149",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont149},
       {nombre:"Capacitación en ATS",divTr:"trExamTipo150",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont150},
       {nombre:"Capacitación en capacitación uso de EPP",divTr:"trExamTipo151",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont151},
       {nombre:"Capacitación en manejo de insumos químicos - hojas MSDS",divTr:"trExamTipo152",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont152},
       {nombre:"Capacitación en uso de herramientas manuales",divTr:"trExamTipo153",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont153},
       {nombre:"Capacitación en procedimiento de señalización",divTr:"trExamTipo154",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont154},
       {nombre:"IBT 1",divTr:"trExamTipo155",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont155},
       {nombre:"IBT 2",divTr:"trExamTipo156",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont156},
       {nombre:"IBT 3",divTr:"trExamTipo157",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont157},
       {nombre:"IBT 4",divTr:"trExamTipo158",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont158},
       {nombre:"IBT 5",divTr:"trExamTipo159",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont159},
       
      {nombre:"Acta de compromiso",divTr:"trExamTipo24",isHabilitado:proyectoObj.habilitadoActaCompromiso},
      {nombre:"Reglamento SST",divTr:"trExamTipo35",isHabilitado:proyectoObj.habilitadoReglamentoSst},
      {nombre:"Política SST",divTr:"trExamTipo36",isHabilitado:proyectoObj.habilitadoPoliticaSst},
      {nombre:"Plan anual SST",divTr:"trExamTipo37",isHabilitado:proyectoObj.habilitadoPlanAnualSst},
      {nombre:"Programa SST asociado a la empresa",divTr:"trExamTipo38",isHabilitado:proyectoObj.habilitadoProgramaSst},
      {nombre:"Plan anual de salud ocupacional",divTr:"trExamTipo39",isHabilitado:proyectoObj.habilitadoPlanAnualSaludOcupacional},
      {nombre:"Programa de vigilancia de salud ocupacional",divTr:"trExamTipo40",isHabilitado:proyectoObj.habilitadoProgVigilanciaSaludOcupacional},
      {nombre:"Certificado de homologación con el cliente",divTr:"trExamTipo41",isHabilitado:proyectoObj.habilitadoCertificadoHomologacion},
      {nombre:"Procedimiento de trabajo seguro para trabajos de alto riesgo",divTr:"trExamTipo42",isHabilitado:proyectoObj.habilitadoProcTrabajoSeguroTraAltoRiesgo},
      {nombre:"Indicador mensual SST",divTr:"trExamTipo16",isHabilitado:proyectoObj.habilitadoIndicadorMensualSst},  
      {nombre:"Constancia de registro laboral",divTr:"trExamTipo44",isHabilitado:proyectoObj.habilitadoConstanciaLaboral},
      {nombre:"Declaración de no núcleo del negocio",divTr:"trExamTipo45",isHabilitado:proyectoObj.habilitadoNoNucleoNegocio},
      {nombre:"Carta fianza",divTr:"trExamTipo46",isHabilitado:proyectoObj.habilitadoCartaFianza},
      {nombre:"Comunicado a organizaciones sindicales",divTr:"trExamTipo47",isHabilitado:proyectoObj.habilitadoComunicadoSindicales},
      {nombre:"Comunicado a representantes de trabajadores",divTr:"trExamTipo48",isHabilitado:proyectoObj.habilitadoComunicadoRepresentantes},
      {nombre:"Comunicado a trabajadores (principal)",divTr:"trExamTipo49",isHabilitado:proyectoObj.habilitadoComunicadoTrabPrincipal},
      {nombre:"Comunicado a trabajadores (contratista)",divTr:"trExamTipo50",isHabilitado:proyectoObj.habilitadoComunicadoTrabContratista},
      {nombre:"Ficha RUC",divTr:"trExamTipo51",isHabilitado:proyectoObj.habilitadoFichaRuc},
      {nombre:"Constancia registro de tercerizadoras",divTr:"trExamTipo52",isHabilitado:proyectoObj.habilitadoConstanciaTercerizadoras},
      {nombre:"Contratos con empresas usuarias",divTr:"trExamTipo53",isHabilitado:proyectoObj.habilitadoContratoEmpUsuarias},
      {nombre:"Partida registral",divTr:"trExamTipo54",isHabilitado:proyectoObj.habilitadoPartidaRegistral},
      {nombre:"Asiento de la partida registral",divTr:"trExamTipo55",isHabilitado:proyectoObj.habilitadoAsientoPartidaRegistral},
      {nombre:"Contratos de trabajos tercerizados",divTr:"trExamTipo56",isHabilitado:proyectoObj.habilitadoTrabajosTercerizados},
      {nombre:"Declaración de servicios tercerizados",divTr:"trExamTipo57",isHabilitado:proyectoObj.habilitadoServiciosTercerizados},
      {nombre:"Informe de servicio de trabajadores",divTr:"trExamTipo58",isHabilitado:proyectoObj.habilitadoServicioTrabajadores},
      {nombre:"Comité/Supervisor SST",divTr:"trExamTipo59",isHabilitado:proyectoObj.habilitadoComiteSupervisorSst},
      {nombre:"Hoja de atención del SCTR",divTr:"trExamTipo67",isHabilitado:proyectoObj.habilitadoHojaAtencionSctr},
      {nombre:"Acuerdo de confidencialidad",divTr:"trExamTipo68",isHabilitado:proyectoObj.habilitadoAcuerdoConfidencialidad},
      {nombre:"Flujo de respuesta ante accidentes",divTr:"trExamTipo69",isHabilitado:proyectoObj.habilitadoFlujoRespuestaAccidente},
      {nombre:"Acuerdo de seguridad para terceros y contratistas",divTr:"trExamTipo70",isHabilitado:proyectoObj.habilitadoAcuerdoSeguridadTerceros},
      {nombre:"Acuerdo de seguridad para proveedores",divTr:"trExamTipo71",isHabilitado:proyectoObj.habilitadoAcuerdoSeguridadProveedores},
      {nombre:"Clínica (Certificación DIGESA)",divTr:"trExamTipo78",isHabilitado:proyectoObj.habilitadoClinicaCertDigesa},
       {nombre:"Seguro vida ley",divTr:"trExamTipo88",isHabilitado:proyectoObj.habilitadoExamNivelCont88},
       {nombre:"Formatos de campo",divTr:"trExamTipo91",isHabilitado:proyectoObj.habilitadoExamNivelCont91},
       {nombre:"Declaración jurada de SST",divTr:"trExamTipo92",isHabilitado:proyectoObj.habilitadoExamNivelCont92},
       {nombre:"Registro de seguridad del contratista",divTr:"trExamTipo93",isHabilitado:proyectoObj.habilitadoExamNivelCont93},
       {nombre:"Declaración jurada para contratistas",divTr:"trExamTipo94",isHabilitado:proyectoObj.habilitadoExamNivelCont94},
       {nombre:"Licencia o permiso emitido por la AMP",divTr:"trExamTipo95",isHabilitado:proyectoObj.habilitadoExamNivelCont95},
       {nombre:"Carta de aceptación de la norma",divTr:"trExamTipo96",isHabilitado:proyectoObj.habilitadoExamNivelCont96},
       {nombre:"Póliza de responsabilidad civil de la empresa",divTr:"trExamTipo97",isHabilitado:proyectoObj.habilitadoExamNivelCont97},
       {nombre:"Formulario y control a terceras partes",divTr:"trExamTipo98",isHabilitado:proyectoObj.habilitadoExamNivelCont98},
       {nombre:"Autorización Osinergmin para combustible",divTr:"trExamTipo102",isHabilitado:proyectoObj.habilitadoExamNivelCont102},
       {nombre:"Autorización de circulación del MTC",divTr:"trExamTipo103",isHabilitado:proyectoObj.habilitadoExamNivelCont103},
       {nombre:"Ficha técnica guantes aislantes clase 0/00",divTr:"trExamTipo104",isHabilitado:proyectoObj.habilitadoExamNivelCont104},
       {nombre:"Certificado dieléctrico pértiga y manta aislante",divTr:"trExamTipo105",isHabilitado:proyectoObj.habilitadoExamNivelCont105},
       {nombre:"Ficha técnica de componentes del traje contra arco eléctrico",divTr:"trExamTipo106",isHabilitado:proyectoObj.habilitadoExamNivelCont106},
       {nombre:"Ficha técnica de botas dieléctricas",divTr:"trExamTipo107",isHabilitado:proyectoObj.habilitadoExamNivelCont107},
       {nombre:"Certificado de ensayo dieléctrico guantes clase 1–4",divTr:"trExamTipo108",isHabilitado:proyectoObj.habilitadoExamNivelCont108},
       {nombre:"Certificado de ensayo dieléctrico de banqueta aislante",divTr:"trExamTipo109",isHabilitado:proyectoObj.habilitadoExamNivelCont109},
       {nombre:"Certificado de ensayo de puesta a tierra temporal",divTr:"trExamTipo110",isHabilitado:proyectoObj.habilitadoExamNivelCont110},
       {nombre:"Constancia declaración y pago - PLAME",divTr:"trExamTipo123",isHabilitado:proyectoObj.habilitadoExamNivelCont123},
       {nombre:"Planilla electrónica R01",divTr:"trExamTipo124",isHabilitado:proyectoObj.habilitadoExamNivelCont124},
       {nombre:"Constancia de pago AFP",divTr:"trExamTipo125",isHabilitado:proyectoObj.habilitadoExamNivelCont125},
       {nombre:"Constancia depósito CTS - Mayo y Noviembre",divTr:"trExamTipo126",isHabilitado:proyectoObj.habilitadoExamNivelCont126},
       {nombre:"Constancia depósito gratificación - Julio y Diciembre",divTr:"trExamTipo127",isHabilitado:proyectoObj.habilitadoExamNivelCont127},
       {nombre:"Procedimiento de acreditación en SST para subcontratistas",divTr:"trExamTipo137",isHabilitado:proyectoObj.habilitadoExamNivelCont137},
       {nombre:"Declaración jurada - capacitación",divTr:"trExamTipo138",isHabilitado:proyectoObj.habilitadoExamNivelCont138},
       {nombre:"Constancia del centro educativo de formación",divTr:"trExamTipo139",isHabilitado:proyectoObj.habilitadoExamNivelCont139},
       
      {nombre:"Sub Contratista - Documentos",divTr:"trSubContratistaDoc",isHabilitado:proyectoObj.habilitadoSubContratista},
      {nombre:"Equipos Moviles - Operadores",divTr:"trEquipMovilOper",isHabilitado:proyectoObj.habilitadoEquipoMovilOperadores},
      {nombre:"Equipos Moviles",divTr:"trEquipMovil",isHabilitado:proyectoObj.habilitadoEquipoMovil},
      {nombre:"Equipos Moviles - Documentacion",divTr:"trEquipMovilDoc",isHabilitado:proyectoObj.habilitadoEquipoMovilDocumentos},
      {nombre:"Análisis de Trabajo Seguro (ATS)",divTr:"trAnaTraSeg",isHabilitado:proyectoObj.habilitadoAnalisisTrabajoSeguro},
      {nombre:"Permiso de Trabajo de Alto Riesgo (PETAR)",divTr:"trPerTraAltRie",isHabilitado:proyectoObj.habilitadoPermisoTrabAltoRiesgo},
      
      {nombre:"Documento a nivel conductor - Licencia de conducir",divTr:"trTipoDocCond1",isHabilitado:proyectoObj.habilitadoLicenciaConductor},
      {nombre:"Documento a nivel conductor - Certificado de capacitación en normas de tránsito y manejo defensivo",divTr:"trTipoDocCond2",isHabilitado:proyectoObj.habilitadoCertifCapTransito},
      {nombre:"Documento a nivel conductor - Examen psicosensométrico",divTr:"trTipoDocCond3",isHabilitado:proyectoObj.habilitadoExamenPsicosensometrico},
      {nombre:"Documento a nivel conductor - Historial de manejo o récord del conductor",divTr:"trTipoDocCond4",isHabilitado:proyectoObj.habilitadoHistorialManejoCond},
      {nombre:"Documento a nivel conductor - Certificado de capacitación en manejo de camioneta 4x4",divTr:"trTipoDocCond5",isHabilitado:proyectoObj.habilitadoCertifCapManejo4x4},
      {nombre:"Documento a nivel conductor - Certificado de operador de maquinaria",divTr:"trTipoDocCond6",isHabilitado:proyectoObj.habilitadoCertifOperadorMaq},
      {nombre:"Documento a nivel conductor - Certificado del curso MAPTEL Nivel I",divTr:"trTipoDocCond7",isHabilitado:proyectoObj.habilitadoCertifCursoMaptelN1},
      {nombre:"Documento a nivel conductor - Curriculum Vitae",divTr:"trTipoDocCond8",isHabilitado:proyectoObj.habilitadoCurriculumVitae},
      {nombre:"Documento a nivel conductor - Capacitación como operador de descarga de cemento",divTr:"trTipoDocCond9",isHabilitado:proyectoObj.habilitadoExamNivelCond9},
	       
      {nombre:"Documento a nivel vehículo/maquinaria - Check list de ingreso",divTr:"trTipoDocVehMaq1",isHabilitado:proyectoObj.habilitadoCheckListIngreso},
      {nombre:"Documento a nivel vehículo/maquinaria - Inspección técnica",divTr:"trTipoDocVehMaq2",isHabilitado:proyectoObj.habilitadoInspeccionTecnica},
      {nombre:"Documento a nivel vehículo/maquinaria - Póliza contra todo riesgo",divTr:"trTipoDocVehMaq3",isHabilitado:proyectoObj.habilitadoPolizaContraTodo},
      {nombre:"Documento a nivel vehículo/maquinaria - SOAT",divTr:"trTipoDocVehMaq4",isHabilitado:proyectoObj.habilitadoSoat},
      {nombre:"Documento a nivel vehículo/maquinaria - Tarjeta/Constancia de propiedad del equipo",divTr:"trTipoDocVehMaq5",isHabilitado:proyectoObj.habilitadoTarjetaConstanciaPropiedadEquipo},	
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de operatividad",divTr:"trTipoDocVehMaq6",isHabilitado:proyectoObj.habilitadoCertificadoOperatividad},
      {nombre:"Documento a nivel vehículo/maquinaria - Programa de mantenimiento preventivo",divTr:"trTipoDocVehMaq7",isHabilitado:proyectoObj.habilitadoProgMantenimientoPreventivo},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de mantenimiento preventivo",divTr:"trTipoDocVehMaq8",isHabilitado:proyectoObj.habilitadoCertifMantenimientoPreventivo},
      {nombre:"Documento a nivel vehículo/maquinaria - Permiso especial para el transporte de mercancía",divTr:"trTipoDocVehMaq9",isHabilitado:proyectoObj.habilitadoPermisoEspecialTransporteMercancia},
      {nombre:"Documento a nivel vehículo/maquinaria - Póliza TREC",divTr:"trTipoDocVehMaq10",isHabilitado:proyectoObj.habilitadoPolizaTrec},	
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de opacidad",divTr:"trTipoDocVehMaq11",isHabilitado:proyectoObj.habilitadoCertificadoOpacidad},
      {nombre:"Documento a nivel vehículo/maquinaria - Manual del equipo/Ficha técnica",divTr:"trTipoDocVehMaq12",isHabilitado:proyectoObj.habilitadoManualEquipoFichaTecnica},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado DGH - Osinergmin",divTr:"trTipoDocVehMaq13",isHabilitado:proyectoObj.habilitadoCertificadoDghOsinergmin},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de cubicación y hermeticidad",divTr:"trTipoDocVehMaq14",isHabilitado:proyectoObj.habilitadoCertifCubicacionHermeticidad},
      {nombre:"Documento a nivel vehículo/maquinaria - Tarjeta de circulación emitida por el MTC",divTr:"trTipoDocVehMaq15",isHabilitado:proyectoObj.habilitadoTarjetaCirculacionMtc},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de gravamen vehicular",divTr:"trTipoDocVehMaq16",isHabilitado:proyectoObj.habilitadoCertifGravamenVehicular},
      {nombre:"Documento a nivel vehículo/maquinaria - Verificación - GPS vehicular",divTr:"trTipoDocVehMaq17",isHabilitado:proyectoObj.habilitadoVerifGpsVehicular},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de hermeticidad de la bombona",divTr:"trTipoDocVehMaq18",isHabilitado:proyectoObj.habilitadoExamNivelVehMaq18},
      
      {nombre:"Documento a nivel equipo/herramienta - Certificado de operatividad",divTr:"trTipoDocEquHerr1",isHabilitado:proyectoObj.habilitadoCertificadoOperatividadEquHerr},
      {nombre:"Documento a nivel equipo/herramienta - Inspección",divTr:"trTipoDocEquHerr2",isHabilitado:proyectoObj.habilitadoInspeccionEquHerr}
   ];

   $("#tblEvalTotalProy tbody").html("");

   var selTipoEvaluacionTotal = crearSelectOneMenuOblig("selTipoEvaluacionTotal",
      "verIconoAcuerdoEval(this)",listEvaluacionTotal,"","id","nombre");

   listEvaluar.forEach(function(val,index){
      if(val.isHabilitado == 1){
         $("#tblEvalTotalProy tbody").append(
            "<tr id='"+val.divTr+"'>" +
               "<td class='info' colspan='5' style='background:#D6E6E5F7;'>"+val.nombre+"</td>" +
            "</tr>");
      }
   });

   $("#btnGuardarEvalsProyecto").hide();

   var listEstadoFinal = [];

   var estadosId = $("#selEstadoDocEval").val();
   estadosId.forEach(function(val){
      listEstadoFinal.push(parseInt(val));
   });

   var dataParamActividades={
      id: proyectoObj.id,listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };

   var dataParamExamenes={
      id: (proyectoObj.postulante.contratista.id),proyectoActual: {id: proyectoObj.id},examen: {tipo: {id: null}},
      perfil: {id: null},listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };

   var dataParamSubContratista={
      contratistaId: (proyectoObj.postulante.contratista.id),listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };

   var dataParamHojasVida={
      tipo: {id: 4},listTrabAsignadosActivosId: proyectoObj.listTrabAsignadosActivosIdAux,
      listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };

   var dataParamEquiposMoviles={
      id: null,proyectoId: proyectoObj.id,listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };

   var dataParamAts={
      contratistaId: (proyectoObj.postulante.contratista.id),proyectoId: proyectoObj.id,
      listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };

   var dataParamPetar={
      contratistaId: (proyectoObj.postulante.contratista.id),proyectoId: proyectoObj.id,
      listEstadoId: (listEstadoFinal.length == 0 ?null:listEstadoFinal)
   };
   
   var dataParamTipoDocCond={
      contratistaId: (proyectoObj.postulante.contratista.id),listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };
   
   var dataParamTipoDocVehMaq={
      contratistaId: (proyectoObj.postulante.contratista.id),listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };
   
   var dataParamTipoDocEquHerr={
      contratistaId:(proyectoObj.postulante.contratista.id),listEstadoId:(listEstadoFinal.length == 0?null:listEstadoFinal)
   };
    
   cargarListConexionesVisorEvidencia(1);

   callAjaxPostSimple(URL+'/contratista/proyecto/actividades/revision',dataParamActividades,1,function(data){
    listFullActividades = data.list;
    listFullActividades.forEach(agregarFilaActividadesVersionDos);

    callAjaxPostSimple(URL+'/contratista/examenes/revision',dataParamExamenes,0,function(data){
     if(data.trabajadores.length != 0){
        mapTrabContratistaVerfIa = new Map();
		
        data.trabajadores.forEach(function(val){
           mapTrabContratistaVerfIa.set(val.id,val);
        });
     } 
	
     listFullExamenes = data.examenes;
     listFullExamenes.forEach(agregarFilaExamenesVersionDos);

     callAjaxPostSimple(URL+"/contratista/subcontratista/documento/revision",dataParamSubContratista,0,function(data){
      listFullSubContratistas = data.listDocumentosSubcontratista;
      listFullSubContratistas.forEach(agregarFilaSubContratistaVersionDos);

      callAjaxPostSimple(URL+"/contratista/trabajador/hojavidas/proyecto",dataParamHojasVida,0,function(data){
       listFullHojasVida = data.list;
       listFullHojasVida.forEach(agregarFilaHojaVidaVersionDos);

       callAjaxPostSimple(URL+"/contratista/analisis_trabajo_seguro/evaluacion",dataParamAts,0,function(data){
        listFullAnalisisTrabajoSeguro = data.listAnalisisTraSeg;
        listFullAnalisisTrabajoSeguro.forEach(agregarFilaAnalisisTrabajoSeguroVersionDos);

        callAjaxPostSimple(URL+"/contratista/permiso_trabajo_alto_riesgo/evaluacion",dataParamPetar,0,function(data){
         listFullPermisoTraAltRie = data.listPermisoTraAltRie;
         listFullPermisoTraAltRie.forEach(agregarFilaPermisoTrabajoAltoRiesgoVersionDos);
         
         callAjaxPostSimple(URL+"/contratista/documento_nivel_conductor/evaluacion",dataParamTipoDocCond,0,function(data){
          listFullDocNivelCond = data.listDocumentosNivelConductor;
          listFullDocNivelCond.forEach(agregarFilaDocumentoNivelConductorVersionDos);
          
          callAjaxPostSimple(URL+"/contratista/documento_nivel_vehiculo_maquinaria/evaluacion",dataParamTipoDocVehMaq,0,function(data){
           listFullDocNivelVehMaq = data.listDocumentosNivelVehiculoMaquinaria;
           listFullDocNivelVehMaq.forEach(agregarFilaDocumentoNivelVehiculoMaquinariaVersionDos);
           
           callAjaxPostSimple(URL+"/contratista/documento_nivel_equipo_herramienta/evaluacion",dataParamTipoDocEquHerr,0,function(data){
            listFullDocNivelEquHerr = data.listDocumentosNivelEquipoHerramienta;
            listFullDocNivelEquHerr.forEach(agregarFilaDocumentoNivelEquipoHerramientaVersionDos);

            callAjaxPostSimple(URL+"/contratista/equipomovil/revision",dataParamEquiposMoviles,0,function(data){
             listFullOperadorEquipo = data.operadoresEquipo;
             listFullOperadorEquipo.forEach(function(val,index){
                agregarFilaEquipoMovilVersionDos(1,val);
             });

             listFullEquiposMovilMantenimiento = data.listEquiposMantenimiento;
             listFullEquiposMovilMantenimiento.forEach(function(val,index){
                agregarFilaEquipoMovilVersionDos(2,val,2);
             });

             listFullEquiposMovilCertificado = data.listEquiposCertificado;
             listFullEquiposMovilCertificado.forEach(function(val,index){
                agregarFilaEquipoMovilVersionDos(2,val,1);
             });

             listFullDocumentosEquipIzaje = data.documentos;
             listFullDocumentosEquipIzaje.forEach(function(val,index){
                agregarFilaEquipoMovilVersionDos(3,val);
             });

             goheadfixedY("#tblEvalTotalProy","#wrapEvalTotalProy");
             $("#btnGuardarEvalsProyecto").show();$.unblockUI();
            });
           });
          });
         }); 
        });
       });
      });
     });
    });
   });
}

function verIconoAcuerdoEval(obj){
   var notaId = parseInt($(obj).val());

   listEvaluacionTotal.every(function(val){
      if(val.id == notaId){
         $(obj).parent().find("label").html(val.icono);
            
         return false;
      }

      return true;
   });
}

function guardarEvaluacionesDocumentosProyecto(){
   var listActividades = [],listExamenes = [],listDocumentoSubcontratista = [],listAnalisisTrabajoSeguro = [],
      listPermisoTrabajoAltoRiesgo = [],OperadorEquipo = [],EquiposMovilCertificado = [],EquiposMovilMantenimiento = [], 
      DocumentosEquipIzaje = [],HojasVida = [],listDocumentosNivelConductor = [],listDocumentosNivelVehMaq = [],
      listDocumentosNivelEquHerr = [];

   var trabajadorId = (parseInt(getSession("accesoUsuarios")) == 0?getSession("trabajadorGosstId"):null);

   listFullActividades.forEach(function(val){
      var eval = $("#docact"+val.id).find("#selEvalTotalAct").val();
      var obs = $("#docact"+val.id).find("#inputObsEvalTotal").val();

      if(eval != undefined && (val.evaluacion.nota.id != eval || val.evaluacion.observacion != obs)){
         listActividades.push({
            id: val.id,tipo: {id: val.tipo.id,nombre: val.tipo.nombre},evaluacion: {nota: {id: eval},observacion: obs},
            trabajadorId: trabajadorId
         });
      }
   });

   listFullExamenes.forEach(function(val){
      var eval = $("#docexam"+val.id).find("#selEvalTotalAct").val();
      var obs = $("#docexam"+val.id).find("#inputObsEvalTotal").val();
      var trabajadores = val.trabajadoresNombre;

      if(eval != undefined && (val.evaluacion.nota.id != eval || val.evaluacion.observacion != obs)){
         listExamenes.push({
            id: val.id,tipo: {id: val.tipo.id,nombre: val.tipo.nombre},evaluacion: {nota: {id: eval},observacion: obs},
            trabajadorId: trabajadorId
         });
      }
   });

   if($("#trSubContratistaDoc").val() != undefined){
      listFullSubContratistas.forEach(function(val){
         var eval = $("#docsubcontratista"+val.id).find("#selEvalTotalAct").val();
         var obs = $("#docsubcontratista"+val.id).find("#inputObsEvalTotal").val();

         if(val.evaluacion.nota.id != eval || val.evaluacion.observacion != obs){
            listDocumentoSubcontratista.push({
               id: val.id,evaluacion: {nota: {id: eval},observacion: obs},trabajadorId: trabajadorId
            });
         }
      });
   }

   if($("#trHojaVida").val() != undefined){
      listFullHojasVida.forEach(function (val){
         var eval = $("#docHojaVida"+val.id).find("#selEvalTotalAct").val();
         var obs = $("#docHojaVida"+val.id).find("#inputObsEvalTotal").val();
         var trabajadores = val.trabajador.nombreCompleto;

         if(val.evaluacion.nota.id != eval || val.evaluacion.observacion != obs){
            HojasVida.push({
               id: val.id,observacion: obs,tipo: {id: eval},trabajadorId: trabajadorId
            });
         }
      });
   }

   if($("#trEquipMovilOper").val() != undefined){
      listFullOperadorEquipo.forEach(function(val){
         var eval = $("#docEquipoMovilOper"+val.id).find("#selEvalTotalEquipoMovilOper").val();
         var obs = $("#docEquipoMovilOper"+val.id).find("#inputObsEvalTotal").val();

         if(val.evaluacionEvidenciaCapacitacion.id != eval || val.evaluacionEvidenciaCapacitacion.observacion != obs){
            OperadorEquipo.push({
               id: val.id,evaluacionEvidenciaCapacitacion: {id: eval,observacion: obs}
            });
         }
      });

      listFullEquiposMovilCertificado.forEach(function(val){
         var eval1 = $("#docEquipoMovil"+val.id+"Evi1").find("#selEvalTotalEquipoMovilEvi1").val();
         var obs1 = $("#docEquipoMovil"+val.id+"Evi1").find("#inputObsEvalTotalEvi1").val();

         if(val.evaluacionEvidenciaOperatividad.id != eval1 || val.evaluacionEvidenciaOperatividad.observacion != obs1){
            EquiposMovilCertificado.push({
               id: val.id,evaluacionEvidenciaOperatividad: {id: eval1,observacion: obs1}
            });
         }
      });

      listFullEquiposMovilMantenimiento.forEach(function(val){
         var eval2 = $("#docEquipoMovil"+val.id+"Evi2").find("#selEvalTotalEquipoMovilEvi2").val();
         var obs2 = $("#docEquipoMovil"+val.id+"Evi2").find("#inputObsEvalTotalEvi2").val();

         if(val.evaluacionEvidenciaMantenimiento.id != eval2 || val.evaluacionEvidenciaMantenimiento.observacion != obs2){
            EquiposMovilMantenimiento.push({
               id: val.id,evaluacionEvidenciaMantenimiento: {id: eval2,observacion: obs2}
            });
         }
      });

      listFullDocumentosEquipIzaje.forEach(function(val){
         var eval1 = $("#docEquipoDoc"+val.id+"Evi1").find("#selEvalTotalEquipoDocEvi1").val();
         var obs1 = $("#docEquipoDoc"+val.id+"Evi1").find("#inputObsEvalTotalEvi1").val();
         var eval2 = $("#docEquipoDoc"+val.id+"Evi2").find("#selEvalTotalEquipoDocEvi2").val();
         var obs2 = $("#docEquipoDoc"+val.id+"Evi2").find("#inputObsEvalTotalEvi2").val();

         if(val.seccion.id == 1){
            if(val.evaluacionEvidencia.id != eval1 || val.evaluacionEvidencia.observacion != obs1 ||
               val.evaluacionEvidenciaIperc.id != eval2 || val.evaluacionEvidenciaIperc.observacion != obs2){
               DocumentosEquipIzaje.push({
                  id: val.id,evaluacionEvidencia: {id: eval1,observacion: obs1},evaluacionEvidenciaIperc: {id: eval2,observacion: obs2}
               });
            }
         }
      });
   }

   if($("#trAnaTraSeg").val() != undefined){
      listFullAnalisisTrabajoSeguro.forEach(function(val){
         var evalAnaTraSeg = $("#docAnaTraSeg"+val.id).find("#selEvalTotalAnaTraSeg").val();
         var obsAnaTraSeg = $("#docAnaTraSeg"+val.id).find("#inputObsEvalTotalAnaTraSeg").val();
         var participantes = val.listTrabajadoresNombre;

         if(val.evaluacion.nota.id != evalAnaTraSeg || val.evaluacion.observacion != obsAnaTraSeg){
            listAnalisisTrabajoSeguro.push({
               id: val.id,evaluacion: {nota: {id: evalAnaTraSeg},observacion: obsAnaTraSeg}
            });
         }
      });
   }

   if($("#trPerTraAltRie").val() != undefined){
      listFullPermisoTraAltRie.forEach(function(val){
         var evalPerTraAltRie = $("#docPerTraAltRie"+val.id).find("#selEvalTotalPerTraAltRie").val();
         var obsPerTraAltRie = $("#docPerTraAltRie"+val.id).find("#inputObsEvalTotalPerTraAltRie").val();
         var prevencionistas = val.listPrevencionistasNombre;

         if(val.evaluacion.nota.id != evalPerTraAltRie || val.evaluacion.observacion != obsPerTraAltRie){
            listPermisoTrabajoAltoRiesgo.push({
               id: val.id,evaluacion: {nota: {id: evalPerTraAltRie},observacion: obsPerTraAltRie}
            });
         }
      });
   }
   
   listFullDocNivelCond.forEach(function(val){
      var eval = $("#evalTipoDocCond"+val.id).find("#selEvalTipoDocCondTotalAct").val();
      var obs = $("#evalTipoDocCond"+val.id).find("#inputObsTipoDocCondEvalTotal").val();

      if(eval != undefined && (val.evaluacion.nota.id != eval || val.evaluacion.observacion != obs)){
	 listDocumentosNivelConductor.push({
            id: val.id,tipoDocumentoConductor: {id: val.tipoDocumentoConductor.id,nombre: val.tipoDocumentoConductor.nombre},
            evaluacion: {nota: {id: eval},observacion: obs},trabajadorId: trabajadorId
         });
      }
   });

   listFullDocNivelVehMaq.forEach(function(val){
      var eval = $("#evalTipoDocVehMaq"+val.id).find("#selEvalTipoDocVehMaqTotalAct").val();
      var obs = $("#evalTipoDocVehMaq"+val.id).find("#inputObsTipoDocVehMaqEvalTotal").val();

      if(eval != undefined && (val.evaluacion.nota.id != eval || val.evaluacion.observacion != obs)){
	 listDocumentosNivelVehMaq.push({
            id: val.id,tipoDocumentoVehiculoMaquinaria: {id: val.tipoDocumentoVehiculoMaquinaria.id,nombre: val.tipoDocumentoVehiculoMaquinaria.nombre},
            evaluacion: {nota: {id: eval},observacion: obs},trabajadorId: trabajadorId
         });
      }
   });
   
   listFullDocNivelEquHerr.forEach(function(val){
      var eval = $("#evalTipoDocEquHerr"+val.id).find("#selEvalTipoDocEquHerrTotalAct").val();
      var obs = $("#evalTipoDocEquHerr"+val.id).find("#inputObsTipoDocEquHerrEvalTotal").val();

      if(eval != undefined && (val.evaluacion.nota.id != eval || val.evaluacion.observacion != obs)){
	 listDocumentosNivelEquHerr.push({
            id:val.id,tipoDocumentoEquipoHerramienta: {id:val.tipoDocumentoEquipoHerramienta.id,nombre:val.tipoDocumentoEquipoHerramienta.nombre},
            evaluacion: {nota: {id:eval},observacion:obs},trabajadorId:trabajadorId
         });
      }
   });

   var dataParamAuxSave={
      id: proyectoObj.id,titulo: proyectoObj.titulo,actividades: listActividades,examenes: listExamenes,documentosSubcontratista: listDocumentoSubcontratista,
      hojasVida: HojasVida,analisisTrabajosSeguro: listAnalisisTrabajoSeguro,permisosTrabajosAltoRiesgo: listPermisoTrabajoAltoRiesgo,
      operadoresEquipo: OperadorEquipo,equiposCertificado: EquiposMovilCertificado,equiposMantenimiento: EquiposMovilMantenimiento,
      documentosEquipIzaje: DocumentosEquipIzaje,documentosNivelConductor:listDocumentosNivelConductor,documentosNivelVehiculoMaquinaria:listDocumentosNivelVehMaq,
      documentosNivelEquipoHerramienta:listDocumentosNivelEquHerr,empresaId: parseInt(getSession("gestopcompanyid")),contratistaNombre: proyectoObj.contratistaNombre
   };

   callAjaxPost(URL+'/contratista/proyecto/evaluacion_doc/version_dos/save',dataParamAuxSave,function(data){
      if(data.CODE_RESPONSE == "05"){
         hasEvalActualizadaProy = 1;

         mensajeUx = "<label>Se guardaron las evaluaciones de los documentos asociados al proyecto.</label>";
         mensajesUx(mensajeUx,1,"","ActualizarRevDoc");

         $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal",function(){
            if(data.accesoUsuario == 14){
               volverDivProyectosResumen();
            }else if(data.accesoUsuario == 0){
               volverVistaMovil();
            }else{
               volverDivProyectos();
            }
         });
      }
   });
}

function eliminarFilaDocumentoActividadProyecto(idAux, tipoIdAux) {
    mensajeUx = "<label>¿Está seguro de eliminar esta actividad?</label>";
    mensajesUx(mensajeUx, 3, "", "EliminarDocActProy");

    $("#btnDevolverValorEliminarDocActProy").on("click", function () {
        var dataParam = {
            id: parseInt(idAux),tipo:{id:parseInt(tipoIdAux)},bucketNombre:BUCKETAMAZONS3
        };

        callAjaxPost(URL + '/contratista/proyecto/actividad/delete', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    hasDocEliminadoProy = 1;

                    mensajeUx = "<label>La actividad seleccionada se ha eliminado correctamente.</label>";
                    mensajesUx(mensajeUx, 1, "", "ActualizarRevDoc");

                    $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal", function () {
                        if (parseInt(getSession("accesoUsuarios")) == 14) {
                            registrosEvaluacionTotalProyectoRevDoc();
                        } else if (parseInt(getSession("accesoUsuarios")) == 0) {
                            registrosEvaluacionTotalProyectoRevDocVisCol();
                        } else {
                            registrosEvaluacionTotalProyecto();
                        }
                    });

                    break;

                default:
                    alert("Ocurrió un error al eliminar la actividad!");
            }
        });
    });
}

function eliminarFilaDocumentoExamenProyecto(idAux){
   mensajeUx = "<label>¿Está seguro de eliminar este examen?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocExamProy");

   $("#btnDevolverValorEliminarDocExamProy").on("click",function(){
      var dataParam={
         id: parseInt(idAux),bucketNombre: BUCKETAMAZONS3
      };

      callAjaxPost(URL+'/contratista/examen/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               hasDocEliminadoProy = 1;

               mensajeUx = "<label>El examen seleccionado se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarRevDoc");

               $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal",function(){
                  if(parseInt(getSession("accesoUsuarios")) == 14){
                     registrosEvaluacionTotalProyectoRevDoc();
                  }else if(parseInt(getSession("accesoUsuarios")) == 0){
                     registrosEvaluacionTotalProyectoRevDocVisCol();
                  }else{
                     registrosEvaluacionTotalProyecto();
                  }
               });

               break;

            default:
               alert("Ocurrió un error al eliminar la actividad!");
         }
      });
   });
}

function eliminarFilaDocumentoSubcontratistaProyecto(idAux) {
    mensajeUx = "<label>¿Está seguro de eliminar este documento - subcontratista?</label>";
    mensajesUx(mensajeUx, 3, "", "EliminarDocSubconProy");

    $("#btnDevolverValorEliminarDocSubconProy").on("click", function () {
        var dataParam = {
            id: parseInt(idAux)
        };

        callAjaxPost(URL + '/contratista/subcontratista/documento/delete', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    hasDocEliminadoProy = 1;

                    mensajeUx = "<label>El documento - subcontratista seleccionado se ha " +
                        "eliminado correctamente.</label>";
                    mensajesUx(mensajeUx, 1, "", "ActualizarRevDoc");

                    $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal", function () {
                        if (parseInt(getSession("accesoUsuarios")) == 14) {
                            registrosEvaluacionTotalProyectoRevDoc();
                        } else if (parseInt(getSession("accesoUsuarios")) == 0) {
                            registrosEvaluacionTotalProyectoRevDocVisCol();
                        } else {
                            registrosEvaluacionTotalProyecto();
                        }
                    });

                    break;

                default:
                    alert("Ocurrió un error al eliminar el documento - subcontratista!");
            }
        });
    });
}


function eliminarFilaDocumentoHojaVidaProyecto(idAux) {
    mensajeUx = "<label>¿Está seguro de eliminar esta hoja de vida?</label>";
    mensajesUx(mensajeUx, 3, "", "EliminarDocHojaVidaProy");

    $("#btnDevolverValorEliminarDocHojaVidaProy").on("click", function () {
        var dataParam = {
            id: parseInt(idAux)
        };

        callAjaxPost(URL + '/contratista/trabajador/hojavida/delete', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    hasDocEliminadoProy = 1;

                    mensajeUx = "<label>La hoja de vida seleccionada se ha eliminado correctamente.</label>";
                    mensajesUx(mensajeUx, 1, "", "ActualizarRevDoc");

                    $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal", function () {
                        if (parseInt(getSession("accesoUsuarios")) == 14) {
                            registrosEvaluacionTotalProyectoRevDoc();
                        } else if (parseInt(getSession("accesoUsuarios")) == 0) {
                            registrosEvaluacionTotalProyectoRevDocVisCol();
                        } else {
                            registrosEvaluacionTotalProyecto();
                        }
                    });

                    break;

                default:
                    alert("Ocurrió un error al eliminar la actividad!");
            }
        });
    });
}

function eliminarFilaDocumentoAtsProyecto(idAux) {
    mensajeUx = "<label>¿Está seguro de eliminar esta ATS?</label>";
    mensajesUx(mensajeUx, 3, "", "EliminarDocAtsProy");

    $("#btnDevolverValorEliminarDocAtsProy").on("click", function () {
        var dataParam = {
            id: parseInt(idAux)
        };

        callAjaxPost(URL + '/contratista/analisis_trabajo_seguro/delete', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    hasDocEliminadoProy = 1;

                    mensajeUx = "<label>La ATS seleccionada se ha eliminado correctamente.</label>";
                    mensajesUx(mensajeUx, 1, "", "ActualizarRevDoc");

                    $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal", function () {
                        if (parseInt(getSession("accesoUsuarios")) == 14) {
                            registrosEvaluacionTotalProyectoRevDoc();
                        } else if (parseInt(getSession("accesoUsuarios")) == 0) {
                            registrosEvaluacionTotalProyectoRevDocVisCol();
                        } else {
                            registrosEvaluacionTotalProyecto();
                        }
                    });

                    break;

                default:
                    alert("Ocurrió un error al eliminar la actividad!");
            }
        });
    });
}

function eliminarFilaDocumentoPetarProyecto(idAux) {
    mensajeUx = "<label>¿Está seguro de eliminar este PETAR?</label>";
    mensajesUx(mensajeUx, 3, "", "EliminarDocPetarProy");

    $("#btnDevolverValorEliminarDocPetarProy").on("click", function () {
        var dataParam = {
            id: parseInt(idAux)
        };

        callAjaxPost(URL + '/contratista/permiso_trabajo_alto_riesgo/delete', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    hasDocEliminadoProy = 1;

                    mensajeUx = "<label>El PETAR seleccionado se ha eliminado correctamente.</label>";
                    mensajesUx(mensajeUx, 1, "", "ActualizarRevDoc");

                    $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal", function () {
                        if (parseInt(getSession("accesoUsuarios")) == 14) {
                            registrosEvaluacionTotalProyectoRevDoc();
                        } else if (parseInt(getSession("accesoUsuarios")) == 0) {
                            registrosEvaluacionTotalProyectoRevDocVisCol();
                        } else {
                            registrosEvaluacionTotalProyecto();
                        }
                    });

                    break;

                default:
                    alert("Ocurrió un error al eliminar la actividad!");
            }
        });
    });
}

function eliminarFilaDocumentoEquipoMovilTipoUnoProyecto(idAux) {
    mensajeUx = "<label>¿Está seguro de eliminar este equipo móvil - operador?</label>";
    mensajesUx(mensajeUx, 3, "", "EliminarDocEquMovTipUnoProy");

    $("#btnDevolverValorEliminarDocEquMovTipUnoProy").on("click", function () {
        var dataParam = {
            id: parseInt(idAux)
        };

        callAjaxPost(URL + '/contratista/equipomovil/operador/delete', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    hasDocEliminadoProy = 1;

                    mensajeUx = "<label>El equipo móvil - operador seleccionado se ha eliminado " +
                        "correctamente.</label>";
                    mensajesUx(mensajeUx, 1, "", "ActualizarRevDoc");

                    $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal", function () {
                        if (parseInt(getSession("accesoUsuarios")) == 14) {
                            registrosEvaluacionTotalProyectoRevDoc();
                        } else if (parseInt(getSession("accesoUsuarios")) == 0) {
                            registrosEvaluacionTotalProyectoRevDocVisCol();
                        } else {
                            registrosEvaluacionTotalProyecto();
                        }
                    });

                    break;

                default:
                    alert("Ocurrió un error al eliminar la actividad!");
            }
        });
    });
}

function eliminarFilaDocumentoEquipoMovilTipoDosProyecto(idAux) {
    mensajeUx = "<label>¿Está seguro de eliminar este equipo móvil?" +
        "<br>(se eliminará tanto el Certficado de Operatividad como el " +
        "Certificado del último Mantenimiento)</label>";
    mensajesUx(mensajeUx, 3, "", "EliminarDocEquMovTipDosProy");

    $("#btnDevolverValorEliminarDocEquMovTipDosProy").on("click", function () {
        var dataParam = {
            id: parseInt(idAux)
        };

        callAjaxPost(URL + '/contratista/equipomovil/delete', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    hasDocEliminadoProy = 1;

                    mensajeUx = "<label>El equipo móvil seleccionado se ha eliminado " +
                        "correctamente.</label>";
                    mensajesUx(mensajeUx, 1, "", "ActualizarRevDoc");

                    $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal", function () {
                        if (parseInt(getSession("accesoUsuarios")) == 14) {
                            registrosEvaluacionTotalProyectoRevDoc();
                        } else if (parseInt(getSession("accesoUsuarios")) == 0) {
                            registrosEvaluacionTotalProyectoRevDocVisCol();
                        } else {
                            registrosEvaluacionTotalProyecto();
                        }
                    });

                    break;

                default:
                    alert("Ocurrió un error al eliminar la actividad!");
            }
        });
    });
}

function eliminarFilaDocumentoNivelConductor(idAux){
   mensajeUx = "<label>¿Está seguro de eliminar este documento?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocNivelCondProy");

   $("#btnDevolverValorEliminarDocNivelCondProy").on("click",function(){
      var dataParam={
         id: parseInt(idAux),bucketNombre: BUCKETAMAZONS3
      };

      callAjaxPost(URL+'/contratista/documento_nivel_conductor/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               hasDocEliminadoProy = 1;

               mensajeUx = "<label>El documento seleccionado se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarRevDoc");

               $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal",function(){
                  if(parseInt(getSession("accesoUsuarios")) == 14){
                     registrosEvaluacionTotalProyectoRevDoc();
                  }else if(parseInt(getSession("accesoUsuarios")) == 0){
                     registrosEvaluacionTotalProyectoRevDocVisCol();
                  }else{
                     registrosEvaluacionTotalProyecto();
                  }
               });

               break;

            default:
               alert("Ocurrió un error al eliminar el documento!");
         }
      });
   });
}

function eliminarFilaDocumentoNivelVehiculoMaquinaria(idAux){
   mensajeUx = "<label>¿Está seguro de eliminar este documento?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocNivelVehMaqProy");

   $("#btnDevolverValorEliminarDocNivelVehMaqProy").on("click",function(){
      var dataParam={
         id: parseInt(idAux),bucketNombre: BUCKETAMAZONS3
      };

      callAjaxPost(URL+'/contratista/documento_nivel_vehiculo_maquinaria/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               hasDocEliminadoProy = 1;

               mensajeUx = "<label>El documento seleccionado se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarRevDoc");

               $("#modalMensajeUxActualizarRevDoc").on("hidden.bs.modal",function(){
                  if(parseInt(getSession("accesoUsuarios")) == 14){
                     registrosEvaluacionTotalProyectoRevDoc();
                  }else if(parseInt(getSession("accesoUsuarios")) == 0){
                     registrosEvaluacionTotalProyectoRevDocVisCol();
                  }else{
                     registrosEvaluacionTotalProyecto();
                  }
               });

               break;

            default:
               alert("Ocurrió un error al eliminar el documento!");
         }
      });
   });
}

function reiniciarFiltroProyectoGeneral() {
    $(".camposFiltroTablaProy").hide();
    $("#wrapProyecto").show();
    $("#btnVerFiltroProy").show();
    $("#btnAplicFiltroProy").hide();

    $("#valBuscarProyectoRegistroCampos").val("").focus();

    listFullProyectoSeguridad.forEach(function (val, index) {
        $("#trprogen" + val.id).show();
    });
}

function verFiltroProyectoGeneral(){
   $("#modalFiltroProyectoGeneral").modal("show");
}

function verCorreoProyectoGeneral(){
   $("#modalCorreoProyectoGeneral").modal("show");
}

function ocultarFiltroProyectoGeneral(){
   $("#modalFiltroProyectoGeneral").modal("hide");
}

function crearFiltroProyecto(functionCallback){
   var dataParamAux={
      trabajadorId: parseInt(getSession("trabajadorGosstId")),
      empresaId: getSession("gestopcompanyid")
   };

   callAjaxPost(URL+"/contratista/proyectos/filtro",dataParamAux,function(data){
      listTipoEvaluacion = data.listEvaluacionContratista;listAreaProyecto = data.listAreas;listEvaluacionTotal = data.tipo_evaluacion;
      listTipoActividades = data.tipo_actividades;listPerfilesProyecto = data.listPerfilesProyecto;listResponsableProy = data.listResponsable;
      var listContraObj = data.listContratistas;listProyectosSimple = data.listProyectos;listTipoLugaresTrabajoProy = data.listTipoLugaresTrabajo;
      listTurnosAnProy = data.listTurnosAn;empresaConfigProyAux = data.empresaConfig;
       
      var listEstadoAux=[
         {id:1,nombre:"Futuro"},{id:2,nombre:"En curso"},{id:3,nombre:"Finalizado"}
      ];

      var asd = crearSelectOneMenuOblig("selEstadoAuxProyecto","filtrarValoresProyectoEstado()",
         listEstadoAux,"2","id","nombre");

      var contenido = "";

      var listOrdenAux=[
         {id:1,nombre:"Fecha de creación (menor a mayor)"},{id:2,nombre:"Título (A-Z)"},
         {id:3,nombre:"Título (Z-A)"}
      ];

      var asd12 = crearSelectOneMenuOblig("selOrdenAuxProyecto","",
         listOrdenAux,2,"id","nombre");

      var listContAux=[
         {id:-1,nombre:"Todos"},{id:0,nombre:"Inactivos"},{id:1,nombre:"Activos"}
      ];

      var cont = crearSelectOneMenuOblig("selContratistaActAuxProyecto","",
         listContAux,"1","id","nombre");

      var listContenido=[
         {sugerencia:"",label:"Ordenar por",inputForm:asd12,divContainer:"divSelectOrdenar"},
         {sugerencia:"",label:"Estado proyecto",inputForm:asd,divContainer:""},
         {sugerencia:"",label:"Estado contratista",inputForm:cont,divContainer:""},
         {sugerencia:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",label:"Áreas",inputForm:"",divContainer:"divSelectFiltroArea"},
         {sugerencia:"",label:"Responsables internos",inputForm:"",divContainer:"divSelectFiltroResp"},
         {sugerencia:"",label:"Contratistas",inputForm:"",divContainer:"divSelectFiltroContra"},
         {sugerencia:"",label:"Proyectos",inputForm:"",divContainer:"divSelectFiltroProyNombre"},
         {sugerencia:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                	"onclick='ocultarFiltroProyectoGeneral()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
          inputForm: "<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
                             "onclick='valoresFiltroProyectosSeguridad()'>" +
                        "<i class='fa fa-filter'></i> Aplicar filtro" +
                     "</button>"}
      ];

      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloGeneral(val);
      });

      var modalOptions={
         id: "modalFiltroProyectoGeneral",
         nombre: "<i class='fa fa-filter'></i> Filtros",
         contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
      };

      crearModalPrincipalUsuario(modalOptions,function(){
         if($("#selMultipleAreaProy").length > 0){
            return;
         }

         crearSelectOneMenuObligMultipleCompleto("selMultipleAreaProy","",
            listAreaProyecto,"id","nombre","#divSelectFiltroArea","TODOS");

         crearSelectOneMenuObligMultipleCompleto("selMultipleRespProy","",
            listResponsableProy,"id","nombre","#divSelectFiltroResp","TODOS");

         crearSelectOneMenuObligMultipleCompleto("selMultipleContraProy","",
            listContraObj,"id","nombre","#divSelectFiltroContra","TODOS");
         
         filtrarValoresProyectoEstado();
      },true,true);

      functionCallback();
   });
}

function filtrarValoresProyectoEstado(){
   var listProyectosSimpleAux = []; 
    
   listProyectosSimple.forEach(function(val){
      if(val.estado.id == parseInt($("#selEstadoAuxProyecto").val())){
	 listProyectosSimpleAux.push(val);
      }
   }); 
   
   crearSelectOneMenuObligMultipleCompleto("selMultipleNombreProy","",
      listProyectosSimpleAux,"id","titulo","#divSelectFiltroProyNombre","TODOS");
}

var listFinalResp=[],listFinalContra=[],listFinalNombre=[],listFinalArea=[];

function valoresFiltroProyectosSeguridad(){
   ocultarFiltroProyectoGeneral();

   var listArratResp = $("#selMultipleRespProy").val();
   listFinalResp = [];
   
   if(listArratResp != null){
      listArratResp.forEach(function(val,index){
         listFinalResp.push(parseInt(val));
      });
   }

   var listArratContra = $("#selMultipleContraProy").val();
   listFinalContra = [];
   
   if(listArratContra != null){
      listArratContra.forEach(function(val,index){
           listFinalContra.push(parseInt(val));
      });
   }

   var listArratNombre = $("#selMultipleNombreProy").val();
   listFinalNombre = [];
   
   if(listArratNombre != null){
      listArratNombre.forEach(function(val,index){
         listFinalNombre.push(parseInt(val));
      });
   }

   var listArratArea = $("#selMultipleAreaProy").val();
   listFinalArea = [];

   if(listArratArea != null){
      listArratArea.forEach(function(val,index){
         listFinalArea.push(parseInt(val));
      });
   }

   cargarProyectosSeguridad();
}

function cargarProyectosSeguridad(){
    resizeDivWrapper("wrapProyecto",165);
   
    $("#tabProyectos .container-fluid").hide();$("#divProyectosFull").show();$("#tabProyectos h2").html("<label>Proyectos</label>");
    $("#valBuscarProyectoRegistroCampos").val("");

    $("#btnCancelarProyecto").hide();$("#btnNuevoProyecto").show();$("#btnEliminarProyecto").hide();
    $("#btnGuardarProyecto").hide();$("#btnVerFiltroProy").show();$("#btnVerIndicadoresProyecto").show();
    $("#btnResetFiltroProy").show();$("#valBuscarProyectoRegistroCampos").show();$("#btnBuscarProy").show();
    $("#btnListaConsolidadoExcelProy").show();$("#btnEvaluacionTotalProyecto").hide();$("#btnConsolidadoInspecc").hide();
    $("#btnActualizarNumDocProyecto").show();$("#btnValorCampoPersonalizadoProy").show();$("#btnClipboardProy").show();
    $("#indicadorPaginaParcialAuxPrincipalProySeg").show();$("#btnSolicitudRegProy").show();$("#btnVerQuicksightInforContTotal").show();
 
    banderaEdicion4 = false;ProyectoId = 0;proyectoObj = [];
    
    var contratistaId = parseInt(getSession("contratistaGosstId"));

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),listResponsablesId:(listFinalResp.length == 0?null:listFinalResp),listContratistasId:(listFinalContra.length == 0?null:listFinalContra),
        listProyectosId:(listFinalNombre.length == 0?null:listFinalNombre),listAreasId:(listFinalArea.length == 0?null:listFinalArea),estado:($("#selEstadoAuxProyecto").val() != null?{id:$("#selEstadoAuxProyecto").val()}:null),
        ordenFiltroId:($("#selOrdenAuxProyecto").val() != null?$("#selOrdenAuxProyecto").val():null),isActivo:($("#selContratistaActAuxProyecto").val() != -1?$("#selContratistaActAuxProyecto").val():null),
        contratistaId:(contratistaId > 0?contratistaId:null)
    };

    callAjaxPostSimpleVersionDos(1,URL+'/contratista/proyectos/vista_admin/version_dos',dataParam,1,0,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
        	    listFullProyectoSeguridad = data.proyectos;
                
        		busquedaActivaPrincipalProySeg = 0;numPaginaActualPrincipalProySeg = 1;

                cambiarPaginaTablaFullProyecto();
                
                goheadfixedY("#tblProyectos","#wrapProyecto");
                formatoCeldaSombreableTabla(true,"tblProyectos");completarBarraCarga();
                
                break;

            default:
                alert("Ocurrió un error al traer los proyectos!");$.unblockUI();
        }
    });
}

function cambiarPaginaTablaFullProyecto(){
    $("#flechaIzquierdaPrincipalProySeg").show();$("#flechaDerechaPrincipalProySeg").show();

    var list = (busquedaActivaPrincipalProySeg == 0?listFullProyectoSeguridad:listFullProyectoSeguridadBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualPrincipalProySeg*partialSize)-partialSize;
    var finRegistro = (numPaginaActualPrincipalProySeg*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasPrincipalProySeg").html("<label>"+numPaginaActualPrincipalProySeg+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualPrincipalProySeg == 1){
        $("#flechaIzquierdaPrincipalProySeg").hide();
    }

    if(numPaginaActualPrincipalProySeg == numPaginaTotal){
        $("#flechaDerechaPrincipalProySeg").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblProyectos tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
            var valorDocPorEvaluar = "",valorTrabTotal = "";

            if(val.contratistaNombre == "------"){
        	    var indicadorPostulacion = "<label>*En proceso de postulación.</label>";

        		valorDocPorEvaluar = indicadorPostulacion;valorTrabTotal = indicadorPostulacion;
//				valorObsTotal = indicadorPostulacion;valorObsContTotal = indicadorPostulacion;valorIncidTotal = indicadorPostulacion;
            }else{
//        		var indicadorGeneral = "<i style='font-size:18px;' class='fa fa-exclamation-circle'></i>",indicadorNoAplica = "<label>*No aplica.</label>";

        		valorDocPorEvaluar = "<label>*Click en el botón <i class='fa fa-file-text fa-2x'></i> <i class='fa fa-refresh'></i>.</label>";
//        		valorObsTotal = (val.observaciones == -1?indicadorNoAplica:(val.observaciones+(val.hasNotificacionObservacion == 1?" "+indicadorGeneral:"")));
//        	    valorObsContTotal = (val.observacionesContratista == -1?indicadorNoAplica:(val.observacionesContratista+(val.hasNotificacionObservacionContratista == 1?" "+indicadorGeneral:"")));
//        		valorIncidTotal = (val.incidentesTotal == -1?indicadorNoAplica:(val.incidentesTotal+(val.hasNotificacionIncidente == 1?" "+indicadorGeneral:"")));
        		valorTrabTotal = val.trabajadoresTotal;
            }
        
            var ordenCompra = (val.ordenCompra.trim().length > 0?val.ordenCompra:"------"),
              	actividad = (val.perfilEspecial.actividad.trim().length > 0?val.perfilEspecial.actividad:"------"),
				creadoPor = (val.fechaCreacionTexto.length == 0?"------":val.fechaCreacionTexto+"<br>(Por "+val.usuarioCreacion.nombre+")"),
				actualizadoPor = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto+"<br>(Por "+val.usuarioActualizacion.nombre+")");

            $("#tblProyectos tbody").append(
                "<tr id='trprogen"+val.id+"' onclick='editarProyecto("+index+")'>" +
                    "<td id='proyCod"+val.id+"'>"+val.codigo+"</td>" +
                    "<td id='proytit"+val.id+"'>"+val.titulo+"</td>" +
                    "<td id='proydesc"+val.id+"'>"+val.descripcion+"</td>" +
                    "<td id='proycontra"+val.id+"'>"+val.contratistaNombre+"</td>" +
                    "<td id='proyPerfEsp"+val.id+"'>"+val.perfilEspecial.nombre+"</td>" +
                    "<td id='proyPerfEspAct"+val.id+"'>"+actividad+"</td>" +
                    "<td id='proyrp"+val.id+"'>"+val.responsable.nombre+"</td>" +
                    "<td id='proyresp"+val.id+"'>"+val.responsablesSecundariosNombre+"</td>" +
                    "<td id='proytrinf"+val.id+"'>"+val.trabajadoresInformadosNombre+"</td>" +
                    "<td id='proyarea"+val.id+"'>"+val.area.nombre+"</td>" +
                    "<td id='proyfecinicio"+val.id+"'>"+val.fechaInicioTexto+"</td>" +
                    "<td id='proyfecfin"+val.id+"'>"+val.fechaFinTexto+"</td>" +
                    "<td id='proyTipoLugTrab"+val.id+"'>"+val.tipoLugaresTrabajoAsignadosNombre+"</td>" +
                    "<td id='proyTurnoAn"+val.id+"'>"+val.turnosAnAsignadosNombre+"</td>" +
                    "<td id='proyOrdenCompra"+val.id+"'>"+ordenCompra+"</td>" +
                    // "<td id='proytipeval"+val.id+"'>"+val.lista.nombre+"</td>" +
                    "<td id='proyinddoc"+val.id+"'>"+valorDocPorEvaluar+"</td>" +      
//                    "<td id='proyobs"+val.id+"'>"+valorObsTotal+"</td>" +
//                    "<td id='proyobsctr"+val.id+"'>"+valorObsContTotal+"</td>" +
//                    "<td id='proyinc"+val.id+"'>"+valorIncidTotal+"</td>" +
                    "<td id='proytrab"+val.id+"'>"+valorTrabTotal+"</td>" +
                    "<td id='proyestado"+val.id+"'>"+val.estado.nombre+"</td>" +
					"<td id='proyFechaCre"+val.id+"'>"+creadoPor+"</td>" +
					"<td id='proyFechaAct"+val.id+"'>"+actualizadoPor+"</td>" +
            	"</tr>");
        }
    });

    $.unblockUI();
}

function aplicarBuscadorProyecto(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valorBuscador = igualarStringBuscar($("#valBuscarProyectoRegistroCampos").val());
    listFullProyectoSeguridadBuscador = [];busquedaActivaPrincipalProySeg = 1;numPaginaActualPrincipalProySeg = 1;

    listFullProyectoSeguridad.forEach(function(val,index){
        if(igualarStringBuscar(val.codigo).indexOf(valorBuscador) != -1 ||
            igualarStringBuscar(val.titulo).indexOf(valorBuscador) != -1 ||
            igualarStringBuscar(val.descripcion).indexOf(valorBuscador) != -1){
            listFullProyectoSeguridadBuscador.push(val);
        }
    });

    cambiarPaginaTablaFullProyecto();
}

function reiniciarBuscadorProyecto(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    $("#valBuscarProyectoRegistroCampos").val("").focus();
    busquedaActivaPrincipalProySeg = 0;numPaginaActualPrincipalProySeg = 1;

    cambiarPaginaTablaFullProyecto();
}

//INicio de hallazgo
var detalleHallazgoFull = [];
//Inicio de incidentes
var detalleIncidenteFull = [];
//Inicio de accion de auditoria
var detalleObservacionFull = [];
//Inicio de accion de auditoria
var detalleAuditoriaFull = [];
var objAuditoria = {};
var detalleAccAuditoriaFull = [];
var banderaEdicionAccAuditoria = false;
var objAccAuditoria = {};
var objDetalleAuditoria = {};
var funcionalidadesDetalleAudi = [
    {
        id: "opcAgregar",
        nombre: "<i class='fa fa-plus-square'></i> Agregar Corrección Inmediata",
        functionClick: function (data) {
            nuevaAccionDetalleAuditoria(indexDetalleAudi);
        }
    }];

var funcionalidadesAccionMejora = [
    {
        id: "opcEditar", nombre: "<i class='fa fa-pencil-square-o'></i>Editar", functionClick: function (data) {
            editarAccAuditoria()
        }
    },
    {
        id: "opcElimnar", nombre: "<i class='fa fa-trash'></i>Eliminar", functionClick: function (data) {
            eliminarAccionMejoraAudi();
        }
    }];
var lastHeight = 0;

function marcarSubOpcionAccMejora(pindex) {

    funcionalidadesAccionMejora[pindex].functionClick();
    $(".subDetalleAccion ul").hide();
    $(".subSubDetalleAccion ul").hide();
}

function marcarSubOpcionDetalleAuditoria(pindex) {
    funcionalidadesDetalleAudi[pindex].functionClick();
    $(".subDetalleAccion ul").hide();
}

var indexAccMejora;

function toggleMenuOpcionAccMejora(obj, pindex) {
    lastHeight = $(obj).offset().top;
    objAccAuditoria = detalleAccAuditoriaFull[pindex];
    indexAccMejora = pindex;
    $(obj).parent(".subDetalleAccion").find("ul").toggle();
    $(obj).parent(".subDetalleAccion").siblings().find("ul").hide();
    $(obj).parent(".subSubDetalleAccion").find("ul").toggle();
    $(obj).parent(".subSubDetalleAccion").siblings().find("ul").hide();
}

var indexDetalleAudi;

function toggleMenuOpcionDetalleAudi(obj, pindex) {
    objDetalleAuditoria = detalleAuditoriaFull[pindex];
    indexDetalleAudi = pindex;
    $(obj).parent(".subDetalleAccion").find("ul").toggle();
    $(obj).parent(".subDetalleAccion").siblings().find("ul").hide();
}

//AVANZAR
function verCompletarAccioneObservacion(pindex) {

    pindex = defaultFor(pindex, objAuditoria.index);
    //
    $(".subOpcionAccion").html("");
    $(".subOpcionAccion").hide();

    //
    var audiObj = {
        accionMejoraTipoId: 0,
        observacionId: detalleObservacionFull[pindex].id
    };

    banderaEdicionAccAuditoria = false;
    objAuditoria = {index: pindex};
    objAccAuditoria = {observacionId: detalleObservacionFull[pindex].id};
    callAjaxPost(URL + '/gestionaccionmejora/accionmejora',
        audiObj, function (data) {
            if (data.CODE_RESPONSE == "05") {
                $("#tblAccAudi tbody tr").remove();
                detalleAccAuditoriaFull = data.list;
                detalleAccAuditoriaFull.forEach(function (val, index) {
                    val.id = val.accionMejoraId;
                    val.observacionId = objAccAuditoria.observacionId;
                    //
                    var menuOpcion = "<ul class='list-group' >";
                    funcionalidadesAccionMejora.forEach(function (val, index) {
                        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionAccMejora(" + index + ")'>" + val.nombre + " </li>"
                    });
                    menuOpcion += "</ul>"
                    var textResp = "";
                    if (val.respuesta.length > 0) {
                        textResp = iconoGosst.advertir + "Respuesta: " + val.respuesta + "<br>"
                    }
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find("#divMovilObservacion" + detalleObservacionFull[pindex].id + " .subOpcionAccion").show()
                        .append("<div class='subDetalleAccion  gosst-neutral' style='border-color:" + val.estadoColor + "'>" +
                            "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionAccMejora(this," + index + ")'>" +
                            "Ver Opciones<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
                            "</a>" +
                            menuOpcion +
                            "<strong>ACCIÓN DE MEJORA " + (index + 1) + "</strong><br>" +
                            "<i class='fa fa-info' aria-hidden='true'></i> Descripcion: " + val.descripcion + "<br>" +
                            "<i class='fa fa-calendar' aria-hidden='true'></i> Fecha de Planificada: " + val.fechaRevisionTexto + "<br>" +
                            "<i class='fa fa-download'></i> Evidencia: " +
                            (val.evidenciaNombre == "----" ?
                                "Sin Reigstro"
                                :
                                "<a class='efectoLink' href='" + URL + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + val.id + "'>" +
                                val.evidenciaNombre +
                                "</a>") + "<br><br>" +
                            textResp +
                            "</div> ");

                });
                $(".subDetalleAccion ul").hide();
                formatoCeldaSombreableTabla(true, "tblAccAudi");
            } else {
                console.log("NOPNPO")
            }
        });
}

//AVANZAR
function verCompletarAccioneHallazgoContratista(pindex) {

    pindex = defaultFor(pindex, objAuditoria.index);
    //
    $(".subOpcionDetalleAccion").html("");
    $(".subOpcionDetalleAccion").hide();

    //
    var audiObj = {
        accionMejoraTipoId: 0,

        hallazgoId: detalleHallazgoFull[pindex].id
    };

    banderaEdicionAccAuditoria = false;
    objAuditoria = {index: pindex};
    objAccAuditoria = {hallazgoId: detalleHallazgoFull[pindex].id};
    callAjaxPost(URL + '/gestionaccionmejora/accionmejora',
        audiObj, function (data) {
            if (data.CODE_RESPONSE == "05") {
                detalleAccAuditoriaFull = data.list;
                detalleAccAuditoriaFull.forEach(function (val, index) {
                    val.id = val.accionMejoraId;
                    val.hallazgoId = objAccAuditoria.hallazgoId;
                    //
                    var menuOpcion = "<ul class='list-group' >";
                    funcionalidadesAccionMejora.forEach(function (val, index) {
                        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionAccMejora(" + index + ")'>" + val.nombre + " </li>"
                    });
                    menuOpcion += "</ul>"
                    var textResp = "";
                    if (val.respuesta.length > 0) {
                        textResp = iconoGosst.advertir + "<strong>Respuesta del Cliente: </strong>" + val.respuesta + "<br>"
                    }
                    var claseAux = "gosst-neutral";
                    if (val.respuesta == "") {
                        claseAux = "gosst-aprobado"
                    }
                    if (objAuditoriaGeneral.fechaNotificacionEmpresa == null) {
                        claseAux = "gosst-desaprobado";
                    } else if (objAuditoriaGeneral.evaluacion.fecha == null) {
                        claseAux = "gosst-observacion";
                    } else if (objAuditoriaGeneral.evaluacion.id == 1) {
                        claseAux = "gosst-aprobado"
                    } else if (objAuditoriaGeneral.evaluacion.id == 2) {
                        claseAux = "gosst-desaprobado";
                        if (val.respuesta == "") {
                            claseAux = "gosst-aprobado"
                        }
                    }
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find("#subDivMovilDetalleAudi" + detalleHallazgoFull[pindex].id + " .subOpcionDetalleAccion").show()
                        .append("<div class='subSubDetalleAccion  " + claseAux + "' style='border-color:" + val.estadoColor + "'>" +
                            "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionAccMejora(this," + index + ")'>" +
                            "Ver Opciones<i class='fa fa-angle-double-down' aria-hidden='true'></i></a>" +
                            menuOpcion +
                            "<strong>ACCIÓN DE MEJORA " + (index + 1) + "</strong><br>" +
                            "<strong><i class='fa fa-calendar' aria-hidden='true'></i> Fecha Planificada: </strong>" + val.fechaRevisionTexto + "<br>" +
                            "<strong><i class='fa fa-info' aria-hidden='true'></i> Descripción: </strong>" + val.descripcion + "<br>" +
                            textResp +
                            "<i class='fa fa-download'></i>Evidencia: " +
                            (val.evidenciaNombre == "----" ?
                                "Sin Registro" :
                                "<a class='efectoLink'  href='" + URL + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + val.id + "'>" +
                                val.evidenciaNombre +
                                "</a>") +
                            "</div> ");
                });
                $(".subSubDetalleAccion ul").hide();
                formatoCeldaSombreableTabla(true, "tblAccAudi");
            } else {
                console.log("NOPNPO")
            }
        });
}

//FIn
function verCompletarAccioneAuditoria(pindex) {

    pindex = defaultFor(pindex, objAuditoria.index);
    $(".subOpcionDetalleAccion").html("");
    $(".subOpcionDetalleAccion").hide();
    //$(".detalleDocumentosProyecto").html("");

    var audiObj = {
        accionMejoraTipoId: 0,
        detalleAuditoriaId: detalleAuditoriaFull[pindex].detalleAuditoriaId
    };
    banderaEdicionAccAuditoria = false;
    objAuditoria = {index: pindex};
    objAccAuditoria = {detalleAuditoriaId: detalleAuditoriaFull[pindex].detalleAuditoriaId};
    callAjaxPost(URL + '/gestionaccionmejora/accionmejora',
        audiObj, function (data) {
            if (data.CODE_RESPONSE == "05") {
                detalleAccAuditoriaFull = data.list;
                detalleAccAuditoriaFull.forEach(function (val, index) {
                    val.id = val.accionMejoraId;
                    val.detalleAuditoriaId = objAccAuditoria.detalleAuditoriaId;
                    //
                    var menuOpcion = "<ul class='list-group' >";
                    funcionalidadesAccionMejora.forEach(function (val, index) {
                        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionAccMejora(" + index + ")'>" + val.nombre + " </li>"
                    });
                    var textResp = "";
                    if (val.respuesta.length > 0) {
                        textResp = iconoGosst.advertir + " " + val.respuesta + "<br>"
                    }
                    var claseAux = "gosst-neutral";
                    if (val.respuesta == "") {
                        claseAux = "gosst-aprobado"
                    }
                    if (objAuditoriaGeneral.fechaNotificacionEmpresa == null) {
                        claseAux = "gosst-desaprobado";
                    } else if (objAuditoriaGeneral.evaluacion.fecha == null) {
                        claseAux = "gosst-observacion";
                    } else if (objAuditoriaGeneral.evaluacion.id == 1) {
                        claseAux = "gosst-aprobado"
                    } else if (objAuditoriaGeneral.evaluacion.id == 2) {
                        claseAux = "gosst-desaprobado";
                        if (val.respuesta == "") {
                            claseAux = "gosst-aprobado"
                        }
                    }
                    menuOpcion += "</ul>"
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find("#subDivMovilDetalleAudi" + detalleAuditoriaFull[pindex].detalleAuditoriaId + " .subOpcionDetalleAccion").show()
                        .append(
                            //"<div class='subSubDetalleAccion "+claseAux+"'  style='border-color:"+val.estadoColor+"'>" +
                            "<div class='subSubDetalleAccion " + claseAux + "'   >" +
                            "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionAccMejora(this," + index + ")'>" +
                            "Ver Opciones<i class='fa  fa-angle-double-down' aria-hidden='true'></i>" +
                            "</a>" +
                            menuOpcion +
                            "<strong>ACCIÓN DE MEJORA " + (index + 1) + "</strong><br>" +
                            textResp +
                            "<i class='fa fa-info' aria-hidden='true'></i> Descripción: " + val.descripcion + "<br>" +
                            "<i class='fa fa-calendar' aria-hidden='true'></i> Fecha de Registro: " + val.fechaRevisionTexto + "<br>" +
                            "<i class='fa fa-download' aria-hidden='true'></i> Evidencia: " +
                            (val.evidenciaNombre == "----" ?
                                "Sin Registro"
                                :
                                "<a class='efectoLink' href='" + URL + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + val.id + "'>" +
                                val.evidenciaNombre +
                                "</a>") + "<br>" +
                            "</div> ");
                });
                $(".subSubDetalleAccion ul").hide();
                formatoCeldaSombreableTabla(true, "tblAccAudi");
            } else {
                console.log("NOPNPO")
            }
        });


}

function verCompletarAccioneIncidente(pindex) {
    pindex = defaultFor(pindex, objAuditoria.index);
    //
    $(".subOpcionAccion").html("");
    $(".subOpcionAccion").hide();

    //
    $("#tabProyectos .container-fluid").hide();
    $("#divCompletarAccionAuditoriaProyecto").show();
    $("#tabProyectos h4")
        .html("<a onclick='volverDivProyectos()'>Proyecto ("
            + listFullProyectoSeguridad[indexPostulante].titulo + ") </a> " +
            "> <a onclick='volverDivIncidentes()'> Incidente (" + detalleIncidenteFull[pindex].accidenteTipoNombre + ") </a> " +
            "> Acciones de Mejora");
    var audiObj = {
        accionMejoraTipoId: 0,
        accidenteId: detalleIncidenteFull[pindex].accidenteId
    };

    banderaEdicionAccAuditoria = false;
    objAuditoria = {index: pindex};
    objAccAuditoria = {accidenteId: detalleIncidenteFull[pindex].accidenteId};
    callAjaxPost(URL + '/gestionaccionmejora/accionmejora',
        audiObj, function (data) {
            if (data.CODE_RESPONSE == "05") {
                $("#tblAccAudi tbody tr").remove();
                detalleAccAuditoriaFull = data.list;
                detalleAccAuditoriaFull.forEach(function (val, index) {


                    val.id = val.accionMejoraId;
                    val.accidenteId = objAccAuditoria.accidenteId;
                    //
                    var menuOpcion = "<ul class='list-group' >";
                    funcionalidadesAccionMejora.forEach(function (val, index) {
                        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionAccMejora(" + index + ")'>" + val.nombre + " </li>"
                    });
                    menuOpcion += "</ul>"
                    var textResp = "";
                    if (val.respuesta.length > 0) {
                        textResp = iconoGosst.advertir + " " + val.respuesta + "<br>"
                    }
                    var claseAux = "gosst-neutral";
                    if (val.respuesta == "" && val.estadoId == 2) {
                        claseAux = "gosst-aprobado"
                    }
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find("#divMovilIncidente" + detalleIncidenteFull[pindex].accidenteId + " .subOpcionAccion").show()
                        .append("<div class='subDetalleAccion  " + claseAux + "' style='border-color:" + val.estadoColor + "'>" +
                            "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionAccMejora(this," + index + ")'>" +
                            "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
                            "</a>" +
                            menuOpcion +
                            "<strong>ACCIÓN DE MEJORA " + (index + 1) + "</strong><br>" +
                            "<i class='fa fa-calendar' aria-hidden='true'></i> Fecha de Registro: " + val.fechaRevisionTexto + "<br>" +
                            "<i class='fa fa-info' aria-hidden='true'></i> Descripción: " + val.descripcion + "<br>" +
                            textResp +
                            "<i class='fa fa-download' aria-hidden='true'></i> Evidencia: " +
                            (val.evidenciaNombre == "----" ? "Sin Registro"
                                :
                                "<a class='efectoLink' href='" + URL + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + val.id + "'>" +
                                val.evidenciaNombre +
                                "</a>") + "<br>" +
                            "</div> ");

                });
                $(".subDetalleAccion ul").hide();
            } else {
                console.log("NOPNPO")
            }
        });
}

function nuevaAccionAuditoria(observacionIndex) {
    $("#inputFecAcc").attr("disabled", false);
    $("#editarMovilObsProy").find("form input").val("");
    objAccAuditoria = {observacionId: detalleObservacionFull[observacionIndex].id};
    objAccAuditoria.id = 0;
    objAuditoria = {index: observacionIndex};

    $(".divListPrincipal>div").hide();
    $("#editarMovilObsProy").show();
    $("#editarMovilObsProy").find(".tituloSubList")
        .html(textoBotonVolverContenido + "Nueva acción de mejora de observación de '"
            + detalleObservacionFull[observacionIndex].descripcion + "' ");
    var options =
        {
            container: "#eviAccionMejora",
            functionCall: function () {
            },
            descargaUrl: "",
            esNuevo: true,
            idAux: "AccionMejoraProy",
            evidenciaNombre: ""
        };
    crearFormEvidenciaCompleta(options);
}

function nuevaAccionIncidente(incidenteIndex) {
    $("#inputFecAcc").attr("disabled", false);
    $("#editarMovilObsProy").find("form input").val("");
    objAccAuditoria = {accidenteId: detalleIncidenteFull[incidenteIndex].accidenteId};
    objAccAuditoria.id = 0;
    objAuditoria = {index: incidenteIndex};
    $(".divListPrincipal>div").hide();
    $("#editarMovilObsProy").show();
    $("#editarMovilObsProy").find(".tituloSubList")
        .html(textoBotonVolverContenido + "Nueva acción de mejora de incidente    '"
            + detalleIncidenteFull[incidenteIndex].accidenteTipoNombre + "' ");
    var options =
        {
            container: "#eviAccionMejora",
            functionCall: function () {
            },
            descargaUrl: "",
            esNuevo: true,
            idAux: "AccionMejoraProy",
            evidenciaNombre: ""
        };
    crearFormEvidenciaCompleta(options);
}

function nuevaAccionDetalleAuditoria(detalleIndex) {
    $("#inputFecAcc").attr("disabled", false);
    $("#editarMovilObsProy").find("form input").val("");
    objAccAuditoria = {detalleAuditoriaId: detalleAuditoriaFull[detalleIndex].detalleAuditoriaId};
    objAccAuditoria.id = 0;
    objAuditoria = {index: detalleIndex};
    $(".divListPrincipal>div").hide();
    $("#editarMovilObsProy").show();
    $("#editarMovilObsProy").find(".tituloSubList")
        .html(textoBotonVolverContenido + "Nueva acción de mejora de evaluacion de auditoría  '"
            + detalleAuditoriaFull[detalleIndex].verificacion + "' ");
    var options =
        {
            container: "#eviAccionMejora",
            functionCall: function () {
            },
            descargaUrl: "",
            esNuevo: true,
            idAux: "AccionMejoraProy",
            evidenciaNombre: ""
        };
    crearFormEvidenciaCompleta(options);
}

function nuevaAccionHallazgoAuditoria(detalleIndex) {
    lastHeight = $("#subDivMovilDetalleAudi" + detalleHallazgoFull[detalleIndex].id).offset().top;
    $("#inputFecAcc").attr("disabled", false);
    $("#editarMovilObsProy").find("form input").val("");
    objAccAuditoria = {hallazgoId: detalleHallazgoFull[detalleIndex].id};
    objAccAuditoria.id = 0;
    objAuditoria = {index: detalleIndex};
    $(".divListPrincipal>div").hide();
    $("#editarMovilObsProy").show();
    $("#editarMovilObsProy").find(".tituloSubList")
        .html(textoBotonVolverContenido + "Nueva acción de mejora de hallazgo  '"
            + detalleHallazgoFull[detalleIndex].descripcion + "' ");
    var options =
        {
            container: "#eviAccionMejora",
            functionCall: function () {
            },
            descargaUrl: "",
            esNuevo: true,
            idAux: "AccionMejoraProy",
            evidenciaNombre: ""
        };
    crearFormEvidenciaCompleta(options);
}

function editarAccAuditoria() {
    if (!banderaEdicionAccAuditoria) {
        $(".divListPrincipal>div").hide();
        $("#editarMovilObsProy").show();

        if (objAccAuditoria.observacionId > 0) {
            $("#editarMovilObsProy").find(".tituloSubList")
                .html(textoBotonVolverContenido + "Editar acción de la observación '"
                    + detalleObservacionFull[objAuditoria.index].descripcion + "' ");
        }
        if (objAccAuditoria.accidenteId > 0) {
            $("#editarMovilObsProy").find(".tituloSubList")
                .html(textoBotonVolverContenido + "Editar acción del incidente '"
                    + detalleIncidenteFull[objAuditoria.index].accidenteTipoNombre + "' ");
        }

        if (objAccAuditoria.detalleAuditoriaId > 0) {
            $("#editarMovilObsProy").find(".tituloSubList")
                .html(textoBotonVolverContenido + "Editar accion de '"
                    + detalleAuditoriaFull[objAuditoria.index].verificacion + "' ");
        }
        if (objAccAuditoria.hallazgoId > 0) {
            $("#editarMovilObsProy").find(".tituloSubList")
                .html(textoBotonVolverContenido + "Editar accion de Hallazgo'"
                    + detalleHallazgoFull[objAuditoria.index].descripcion + "' ");
        }

        objAccAuditoria.id = objAccAuditoria.accionMejoraId;

        $("#inputDescAcc").val(objAccAuditoria.descripcion);
        //
        $("#inputFecAcc").val(convertirFechaInput(objAccAuditoria.fechaRevision));
        $("#inputFecAcc").attr("disabled", true);
        //
        $("#inputObsAcc").val(objAccAuditoria.observacion);
        //

        var selTipoAccMej = crearSelectOneMenuOblig("selTipoAccMej", "",
            listTipoAccMej, objAccAuditoria.accionMejoraTipoId, "id", "nombre");

        $("#selTipoAccMej").html(selTipoAccMej);

        var eviNombre = objAccAuditoria.evidenciaNombre;
        var options =
            {
                container: "#eviAccionMejora",
                functionCall: function () {
                },
                descargaUrl: "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + objAccAuditoria.id,
                esNuevo: false,
                idAux: "AccionMejoraProy",
                evidenciaNombre: eviNombre
            };
        crearFormEvidenciaCompleta(options);

        hallarEstadoImplementacionAccAuditoria();
        banderaEdicionAccAuditoria = false;
    }
}

function guardarAccionAuditoria(functionCallBack) {

    var campoVacio = false;
    var inputDesc = $("#inputDescAcc").val();

    var inputFecha = convertirFechaTexto($("#inputFecAcc").val());
    var obsevacion = $("#inputObsAcc").val()

    var selTipoAccMejId = parseInt($("#selTipoAccMej").val());

    if (inputFecha == null) {
        campoVacio = true;
    }
    if (inputDesc.length == 0) {
        alert("Descripción de acción obligatoria");
        return;
    }
    hallarEstadoImplementacionAccAuditoria();
    if (!campoVacio) {

        var dataParam = {
            accionMejoraId: objAccAuditoria.id,
            observacion: $("#inputObsAcc").val(),
            descripcion: inputDesc,
            fechaRevision: inputFecha,
            fechaReal: null,
            responsableNombre: "Contratista : " + getSession("gestopusername"),
            responsableMail: "@asd",
            accionMejoraTipoId: selTipoAccMejId,
            estadoId: objAccAuditoria.accionEstado,
            companyId: getSession("gestopcompanyid"),
            gestionAccionMejoraId: null,
            detalleAuditoriaId: objAccAuditoria.detalleAuditoriaId,
            observacionId: objAccAuditoria.observacionId,
            accidenteId: objAccAuditoria.accidenteId,
            hallazgoId: objAccAuditoria.hallazgoId
        };

        callAjaxPost(URL + '/gestionaccionmejora/accionmejora/save', dataParam,
            function (data) {
                if (objAccAuditoria.observacionId > 0) {
                    guardarEvidenciaAuto(data.nuevoId, "fileEviAccionMejoraProy"
                        , bitsEvidenciaAccionMejora, "/gestionaccionmejora/accionmejora/evidencia/save", function () {
                            volverDivSubContenido();
                            verCompletarObsProyecto(indexPostulante);
                            $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                                .find(".detalleObservacionesProyecto").show();
                            if (functionCallBack != null) {
                                functionCallBack();
                            }
                        }, "accionMejoraId");

                }
                if (objAccAuditoria.detalleAuditoriaId > 0) {
                    guardarEvidenciaAuto(data.nuevoId, "fileEviAccionMejoraProy"
                        , bitsEvidenciaAccionMejora, "/gestionaccionmejora/accionmejora/evidencia/save", function () {

                            if (functionCallBack != null) {
                                functionCallBack();
                            } else {
                                volverDivSubContenido();
                                verCompletarEvaluacionesAuditoria();
                                verCompletarAccioneAuditoria();
                            }
                        }, "accionMejoraId");
                }
                if (objAccAuditoria.accidenteId > 0) {
                    guardarEvidenciaAuto(data.nuevoId, "fileEviAccionMejoraProy"
                        , bitsEvidenciaAccionMejora, "/gestionaccionmejora/accionmejora/evidencia/save", function () {
                            volverDivSubContenido();
                            verCompletarIncidenteProyecto(indexPostulante);
                            $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                                .find(".detalleIncidentesProyecto").show();
                            if (functionCallBack != null) {
                                functionCallBack();
                            }
                        }, "accionMejoraId");

                }
                if (objAccAuditoria.hallazgoId > 0) {
                    guardarEvidenciaAuto(data.nuevoId, "fileEviAccionMejoraProy"
                        , bitsEvidenciaAccionMejora, "/gestionaccionmejora/accionmejora/evidencia/save", function () {
                            volverDivSubContenido();
                            verCompletarInspeccionesGenral(indexPostulante);
                            $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                                .find(".detalleInspeccionProyecto").show();
                            verCompletarHallazgosContratista();
                            if (functionCallBack != null) {
                                functionCallBack();
                            }
                        }, "accionMejoraId");

                }
            }, null, null, null, null, false);
    } else {
        alert("Debe ingresar todos los campos.");
    }
}

function eliminarAccionMejoraAudi() {
    var r = confirm("¿Está seguro de eliminar la Accion de mejora?");
    if (r == true) {
        var dataParam = {
            accionMejoraId: objAccAuditoria.id
        };

        callAjaxPost(URL + '/gestionaccionmejora/accionmejora/delete',
            dataParam, function () {
                if (objAccAuditoria.observacionId > 0) {
                    volverDivSubContenido();
                    verCompletarObsProyecto(indexPostulante);
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find(".detalleObservacionesProyecto").show()


                }
                if (objAccAuditoria.detalleAuditoriaId > 0) {

                    verCompletarAuditoriaGenral(indexPostulante);
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find(".detalleAuditoriasProyecto").show();
                    verCompletarEvaluacionesAuditoria();
                }
                if (objAccAuditoria.accidenteId > 0) {

                    volverDivSubContenido();
                    verCompletarIncidenteProyecto(indexPostulante);
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find(".detalleIncidentesProyecto").show();
                }

                if (objAccAuditoria.hallazgoId > 0) {
                    verCompletarInspeccionesGenral(indexPostulante);
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find(".detalleInspeccionProyecto").show();
                    verCompletarHallazgosContratista();
                }


            });
    }
}

function cancelarAccionMejoraAudi() {
    verCompletarAccioneAuditoria();
}

//Fin accion de mejora de auditoria
function verCompletarInduccionesProyecto(pindex) {
    pindex = defaultFor(pindex, indexPostulante);
    indexPostulante = pindex;
    //
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleInduccionProyecto").hide();

    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
        .find(".detalleInduccionProyecto").toggle();
    var contratistaId = parseInt(getSession("contratistaGosstId"));
    var dataParam = {
        id: (contratistaId),
        proyectoActual: {id: listFullProyectoSeguridad[pindex].id}
    };
    callAjaxPost(URL + '/contratista/inducciones/contratista', dataParam, function (data) {
        var listInduccionesProyectos = data.examenes;
        $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
            .find(".detalleInduccionProyecto").html("<td colspan='3'></td>");

        listInduccionesProyectos.forEach(function (val, index) {
            var textoBotonConfirm = " ", textoBotonAgregar = "<a onclick='marcarIconoModuloContratista(7) '> " +
                "Programar inducción </a>";

            //
            var claseNotaDocumento = "gosst-neutral";
            if (val.numTrabajadores == listFullProyectoSeguridad[pindex].trabajadoresTotal) {
                claseNotaDocumento = "gosst-aprobado"
            }
            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                .find(".detalleInduccionProyecto td")
                .append("<div id='divMovilFormacion" + val.id + "'>" +
                    "<div class='detalleAccion " + claseNotaDocumento + "'> " +
                    "<i aria-hidden='true' class='fa fa-info'></i>Tema: " +
                    val.tema + "<br>" +
                    "<i aria-hidden='true' class='fa fa-info'></i>Evaluados: " +
                    (val.numTrabajadores) + " Trabajador(es)<br>" +
                    "<i aria-hidden='true' class='fa fa-calendar'></i> " + val.fechaTexto + "<br>" +
                    "<i aria-hidden='true' class='fa fa-file-o'></i>" + val.evidenciaNombre +
                    "</div>" +
                    "<div class='opcionesAccion'>" + textoBotonAgregar + textoBotonConfirm + "</div>" +

                    "</div>")
            //

        });


    });
    //
}

var listCursosProyectos;
var funcionalidadExtCap = [
    {
        id: "opcAgregar",
        nombre: "<i class='fa fa-plus-square'></i> Agregar extensión",
        functionClick: function (data) {
            nuevaAccionEvaluacion(indexExtCap);
        }
    }
];

function marcarSubOpcionExtCap(pindex) {
    funcionalidadExtCap[pindex].functionClick();
    $(".detalleAccion ul").hide();
}

var indexExtCap;

function toggleMenuOpcionExtCap(obj, pindex) {
    indexExtCap = pindex;
    $(obj).parent(".detalleAccion").find("ul").toggle();
    $(obj).parent(".detalleAccion").siblings().find("ul").hide();
}

function verCompletarCursoProyecto(pindex) {
    pindex = defaultFor(pindex, indexPostulante);

    var proyectoObj1 = {
        id: listFullProyectoSeguridad[pindex].id
    };

    indexPostulante = pindex;
    //
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleFormacionProyecto").hide();

    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
        .find(".detalleFormacionProyecto").toggle()
    //
    callAjaxPost(URL + '/contratista/proyecto/cursos/evaluaciones', proyectoObj1, function (data) {
        listCursosProyectos = data.list;
        $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
            .find(".detalleFormacionProyecto").html("<td colspan='3'></td>");

        listCursosProyectos.forEach(function (val, index) {
            var textoBotonConfirm = " ", textoBotonAgregar = "<a onclick='marcarIconoModuloContratista(8) '> " +
                "Dar examen </a>";

            if (val.evaluacionId == 1) {
                textoBotonConfirm = "<button class='btn btn-success' style='padding:5px' " +
                    "onclick='verConfirmacionesEvaluacion(" + index + ")'>" +
                    "<i class='fa fa-external-link-square' aria-hidden='true'></i></button>";
                textoBotonAgregar = "<a onclick='nuevaAccionEvaluacion(" + index + ")'> " +
                    "Agregar";
                textoBotonConfirm = "<a class='linkVerFormacion' onclick='verConfirmacionesEvaluacion(" + index + ")'> " +
                    "Ver extensión (" + val.confirmacionEvaluacionTotal + ")</a> ";
            }
            //
            var claseNotaDocumento = "gosst-neutral";
            if (val.evaluacionId == 1) {
                claseNotaDocumento = "gosst-aprobado"
            }
            var menuOpcion = "<ul class='list-group listaGestionGosst' >";
            funcionalidadExtCap.forEach(function (val1, index1) {
                menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionExtCap(" + index1 + ")'>" + val1.nombre + " </li>"
            });
            menuOpcion += "</ul>"
            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                .find(".detalleFormacionProyecto td")
                .append("<div id='divMovilFormacion" + val.id + "'>" +
                    "<div class='detalleAccion " + claseNotaDocumento + "'> " +
                    "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionExtCap(this," + index + ")'>" +
                    "Ver Opciones <i class='fa fa-fa-angle-double-down'></i>" +
                    "</a>" +
                    menuOpcion +
                    "<i aria-hidden='true' class='fa fa-graduation-cap'></i> Capacitación: " +
                    val.cursoNombre + " <br>" +
                    "<i class='fa fa-calendar'></i>Fecha Realizada: " + val.fechaRealizadaTexto + "<br>" +
                    "<i  class='fa fa-star'></i>Estado: <strong> " + val.evaluacionNombre + "</strong> (" +
                    pasarDecimalPorcentaje(val.puntajeAlcanzado) + ")<br>" +
                    "<a class='efectoLink'  onclick='verConfirmacionesEvaluacion(" + index + ")'>" +
                    "Ver Extensión  (" + val.confirmacionEvaluacionTotal + ") <i class='fa fa fa-angle-double-down'></i>" +
                    "</a>" +
                    "</div>" +
                    "<div class='opcionesAccion'>" +//textoBotonAgregar+textoBotonConfirm+
                    "</div>" +
                    "<div class='subOpcionAccion'></div>" +
                    "</div>");
            //
            $("#tblCursoProy tbody").append("<tr >" +
                "<td>" + val.cursoNombre + "</td>" +
                "<td>" + val.fechaRealizadaTexto + "</td>" +
                "<td><strong>" + val.evaluacionNombre + "</strong> (" +
                pasarDecimalPorcentaje(val.puntajeAlcanzado) + ")</td>" +
                "<td>" + val.confirmacionEvaluacionTotal + textoBotonConfirm + "</td>" +
                "</tr>");
        });
        $(".detalleAccion ul").hide();
    });
}

//Inicio de incidentes del proyecto (vista contratista)
var funcionalidadIncidente = [
    {
        id: "opcAgregar", nombre: "<i class='fa fa-plus-square'></i> Agregar acción de mejora",
        functionClick: function (data) {
            nuevaAccionIncidente(indexIncidente);
        }
    }
];

function marcarSubOpcionIncidente(pindex) {
    funcionalidadIncidente[pindex].functionClick();
    $(".detalleAccion ul").hide();
}

var indexIncidente;

function toggleMenuOpcionIncidente(obj, pindex) {
    indexIncidente = pindex;
    $(obj).parent(".detalleAccion").find("ul").toggle();
    $(obj).parent(".detalleAccion").siblings().find("ul").hide();
}

function verCompletarIncidenteProyecto(pindex) {
    pindex = defaultFor(pindex, indexPostulante);
    indexPostulante = pindex;
//
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleIncidentesProyecto").hide();

    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
        .find(".detalleIncidentesProyecto").toggle()
//
    var proyectoObj1 = {
        id: listFullProyectoSeguridad[pindex].id
    };

    callAjaxPost(URL + '/contratista/proyecto/incidentes', proyectoObj1, function (data) {
        detalleIncidenteFull = data.list;

        $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
            .find(".detalleIncidentesProyecto").html("<td colspan='3'></td>");

        var numAprob = 0;
        var numTotal = 0;

        detalleIncidenteFull.forEach(function (val1, index1) {
            var textoBotonAct =
                "<button class='btn btn-success' style='padding:5px' onclick='verCompletarAccioneIncidente(" + index1 + ")'>" +
                "<i class='fa fa-external-link-square' aria-hidden='true'></i>" +
                "</button>";

            var iconoDescarga =
                "<a href='" + URL + "/contratista/proyecto/incidente/evidencia?id=" + val1.accidenteId + "' target='_blank'>" +
                "<i class='fa fa-download fa-2x' aria-hidden='true'></i>" +
                "</a>";

            if (val1.evidenciaNombre == "----") {
                iconoDescarga = "";
            }

            var menuOpcion = "<ul class='list-group listaGestionGosst'>";
            funcionalidadIncidente.forEach(function (val2, index2) {
                menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionIncidente(" + index2 + ")'>" +
                    val2.nombre +
                    "</li>";
            });
            menuOpcion += "</ul>";

            var claseNotaDocumento = "gosst-neutral";
            numTotal++;

            if (val1.evaluacion.id == 1) {
                claseNotaDocumento = "gosst-aprobado";
                numAprob++;
            } else {
                claseNotaDocumento = "gosst-advertencia";
            }

            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).find(".detalleIncidentesProyecto td").append(
                "<div id='divMovilIncidente" + val1.accidenteId + "'>" +
                "<div class='detalleAccion " + claseNotaDocumento + "'> " +
                "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionIncidente(this," + index1 + ")'>" +
                "Ver Opciones <i class='fa fa-fa-angle-double-down'></i>" +
                "</a>" +
                menuOpcion +
                "<strong>*** ACCIDENTE / INCIDENTE " + (index1 + 1) + " ***</strong><br>" +
                "<i class='fa fa-user'></i><strong>Trabajador Afectado: </strong>" +
                (val1.trabajadorContratista.nombre == "" ? "No hubo afectados" : val1.trabajadorContratista.nombre) + "<br>" +
                "<i class='fa fa-calendar'></i><strong>Fecha de Registro: </strong>" + val1.fecha + "<br>" +
                "<i class='fa fa-list'></i><strong>Tipo de Incidente: </strong>" + val1.accidenteTipoNombre + "<br>" +
                "<div style='border-top:2px solid black;'></div>" +
                "<i class='fa fa-info'></i><strong>Descripción: </strong>" + val1.accidenteDescripcion + " " +
                (val1.accidenteTipoId == 1 ?
                    "<br><i class='fa fa-list'></i><strong>Clasificación: </strong>" + val1.accidenteClasificacionNombre +
                    (val1.accidenteClasificacionId == 2 ?
                        "<br><i class='fa fa-list'></i><strong>Nivel incapacitante: </strong>" +
                        (val1.accidenteSubClasificacionNombre.length == 0 ? "------" : val1.accidenteSubClasificacionNombre) : "") : "") + "<br>" +
                "<i class='fa fa-medkit'></i><strong>Días perdidos: </strong>" + val1.diasPerdidos + "<br>" +
                "<div style='border-top:2px solid black;'></div>" +
                //		  "<i class='fa fa-search'></i><strong>Estado de Investigación: </strong>"+val1.accidenteInformeNombre+"<br>" +
                "<i aria-hidden='true' class='fa fa-download'></i><strong>Evidencia: </strong>" +
                (val1.evidenciaNombre == "" ? "Sin Registro" :
                    "<a class='efectoLink' href='" + URL + "/contratista/proyecto/incidente/evidencia?id=" + val1.accidenteId + "'>" +
                    val1.evidenciaNombre +
                    "</a>") + "<br>" +
                "<a class='efectoLink' onclick='verCompletarAccioneIncidente(" + index1 + ")'>" +
                "Ver Acción de Mejora (" + val1.indicadorAcciones + ") <i class='fa fa-angle-double-down'></i>" +
                "</a>" +
                "</div>" +
                "<div class='opcionesAccion'></div>" +
                "<div class='subOpcionAccion'></div>" +
                "</div>");
        });

//      $("#proyectoTable"+listFullProyectoSeguridad[pindex].id).find(".celdaIndicadorProyecto").html(numAprob+" / "+numTotal);
        $(".detalleAccion ul").hide();
    });
}

//FIn.

var funcionalidadObs = [
    {
        id: "opcAgregar",
        nombre: "<i class='fa fa-plus-square'></i> Agregar acción de mejora",
        functionClick: function (data) {
            nuevaAccionAuditoria(indexObs);
        }
    }
];

function marcarSubOpcionObs(pindex) {
    funcionalidadObs[pindex].functionClick();
    $(".detalleAccion ul").hide();
}

var indexObs;

function toggleMenuOpcionObs(obj, pindex) {
    indexObs = pindex;
    $(obj).parent(".detalleAccion").find("ul").toggle();
    $(obj).parent(".detalleAccion").siblings().find("ul").hide();
}

function verCompletarObsProyecto(pindex) {
    pindex = defaultFor(pindex, indexPostulante);
    //
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleObservacionesProyecto").hide();

    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
        .find(".detalleObservacionesProyecto").toggle()
    //
    var proyectoObj1 = {
        id: listFullProyectoSeguridad[pindex].id
    };

    indexPostulante = pindex;

    callAjaxPost(URL + '/contratista/proyecto/observaciones', proyectoObj1, function (data) {
        var list = data.list;
        detalleObservacionFull = list;

        $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
            .find(".detalleObservacionesProyecto").html("<td colspan='3'></td>");

        list.forEach(function (val1, index1) {
            var claseNotaDocumento = "gosst-neutral";

            if (val1.nota.id == 1) {
                claseNotaDocumento = "gosst-aprobado";
            } else if (val1.nota.id == 2) {
                claseNotaDocumento = "gosst-desaprobado";
            } else {
                claseNotaDocumento = "gosst-advertencia";
            }

            var textAcciones = /*"<i aria-hidden='true' class='fa fa-minus'></i>"+
			     "<a onclick='nuevaAccionAuditoria("+index1+")'>Agregar acción mejora </a>" +
			     "<i aria-hidden='true' class='fa fa-minus'></i>" +
		             "<a onclick='verCompletarAccioneObservacion("+index1+")'> Ver ("+val1.indicadorAcciones+")</a>"+
			   */"</div>" +
                "<div class='subOpcionAccion'></div>";

            if (val1.reporte.id == 3) {
                textAcciones = "";
            }

            var menuOpcion = "<ul class='list-group listaGestionGosst'>";

            funcionalidadObs.forEach(function (val2, index2) {
                menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionObs(" + index2 + ")'>" + val2.nombre + "</li>";
            });

            menuOpcion += "</ul>";

            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                .find(".detalleObservacionesProyecto td").append(
                "<div id='divMovilObservacion" + val1.id + "'>" +
                "<div class='detalleAccion " + claseNotaDocumento + "'>" +
                "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionObs(this," + index1 + ")'>" +
                "Ver Opciones <i class='fa fa-fa-angle-double-down'></i>" +
                "</a>" +
                menuOpcion +
                "<strong>*** OBSERVACIÓN " + (index1 + 1) + " ***</strong><br>" +
                "<strong><i aria-hidden='true' class='fa fa-eye'></i> Tipo de Observación: </strong>" +
                val1.tipo.nombre + "<br>" +
                "<strong><i aria-hidden='true' class='fa fa-info-circle'></i> Reportado por </strong>" +
                (val1.reportadoPor.length == 0 ? "------" : val1.reportadoPor) + "<br>" +
                "<strong><i aria-hidden='true' class='fa fa-calendar'></i> Fecha y Hora del Reporte: </strong>" +
                val1.fechaTexto + " " + val1.horaRealTexto + "<br>" +
                "<strong><i aria-hidden='true' class='fa fa-file-text-o'></i> Descripcion: </strong>" +
                val1.descripcion + "<br>" +
                "<strong><i aria-hidden='true' class='fa fa-book'></i> Acciones inmediatas tomadas: </strong>" +
                (val1.accionInmediataTomada.length == 0 ? "------" : val1.accionInmediataTomada) + "<br>" +
                "<div style='border-top:2px solid black;'></div>" +
                "<strong><i aria-hidden='true' class='fa fa-list-ul'></i> Tipo de Reporte: </strong>" +
                val1.reporte.nombre + "<br>" +
                "<strong><i aria-hidden='true' class='fa fa-list-ul'></i> Potencial de pérdida: </strong>" +
                val1.perdida.nombre + "<br>" +
                "<strong><i aria-hidden='true' class='fa fa-list-ul'></i> Sistema de gestión asociado:  </strong>" +
                val1.gestion.nombre + "<br>" +
                "<strong><i aria-hidden='true' class='fa fa-list-ul'></i> Grupo de riesgo:  </strong>" +
                val1.grupoRiesgo.nombre + "<br>" +
                //		  "<i aria-hidden='true' class='fa fa-lock'></i> Factor de Seguridad: "+
                //		   val1.factor.nombre+"<br>"+
                //		  (val1.nivel == 1?"<i class='fa fa-star-half-o'></i> Estado: Proceso<br>":
                //				   "<i class='fa fa-star'></i> Estado: Cerrado<br>")+
                "<div style='border-top:2px solid black;'></div>" +
                "<strong><i aria-hidden='true' class='fa fa-pencil'></i> Calificación por administrador: </strong>" +
                val1.nota.icono + val1.nota.nombre + "<br>" +
                "<strong><i class='fa fa-download'></i> Evidencia: </strong>" +
                (val1.evidenciaNombre == "----" ? "Sin Registro" :
                    "<a class='efectoLink' href='" + URL + "/contratista/observacion/evidencia?observacionId=" + val1.id + "'>" +
                    val1.evidenciaNombre + "</a>") + "<br>" +
                "<a class='efectoLink' onclick='verCompletarAccioneObservacion(" + index1 + ")'>" +
                "Ver Acción de Mejora (" + val1.indicadorAcciones + ") <i class='fa fa-angle-double-down'></i>" +
                "</a>" +
                "</div>" +
                "<div class='opcionesAccion'>" +
                //"<a target='_blank' href='"+URL+"/contratista/observacion/evidencia?observacionId="+val1.id+" ' >Descargar</a>" +
                textAcciones);
            //

            var textoBotonAct =
                "<button class='btn btn-success' style='padding:5px' onclick='verCompletarAccioneObservacion(" + index1 + ")'>" +
                "<i class='fa fa-external-link-square' aria-hidden='true'></i>" +
                "</button>";

            $("#tblObservacion tbody").append(
                "<tr id='trobs" + val1.id + "'>" +
                "<td id='desc" + val1.id + "'>" + val1.descripcion + "</td>" +
                "<td id='fec" + val1.id + "'>" + val1.fechaTexto + "</td>" +
                "<td id='tipre" + val1.id + "'>" + val1.reporte.nombre + "</td>" +
                "<td id='factor" + val1.id + "'>" + val1.factor.nombre + "</td>" +
                "<td id='pot" + val1.id + "'>" + val1.perdida.nombre + "</td>" +
                "<td id='tdevi" + val1.id + "'>" + val1.evidenciaNombre + "</td>" +
                "<td id='tdacciones" + val1.id + "'>" + val1.indicadorAcciones + textoBotonAct + "</td>" +
                "<td id='estObs" + val1.id + "'>" + "</td>" +
                "</tr>");
        });

        $(".detalleAccion ul").hide();
    });
}

function hallarEstadoImplementacionAccAuditoria() {
    var fechaPlanificada = $("#inputFecAcc").val();
    var fechaReal = convertirFechaInput(objAccAuditoria.fechaReal);
    var fechaHoy = obtenerFechaActual();
    if (fechaReal != '') {
        objAccAuditoria.accionEstado = 2;
        objAccAuditoria.accionEstadoNombre = "COMPLETADO";
    } else {

        if (fechaPlanificada != "") {
            var dif = restaFechas(fechaHoy, fechaPlanificada)
            if (dif < 0) {
                objAccAuditoria.accionEstado = 3;
                objAccAuditoria.accionEstadoNombre = "RETRASADO";
            } else {
                objAccAuditoria.accionEstado = 1;
                objAccAuditoria.accionEstadoNombre = "EN PROCESO";
            }

        } else {

            objAccAuditoria.accionEstado = 1;
            objAccAuditoria.accionEstadoNombre = "EN PROCESO";

        }
    }

    $("#actpes" + objAccAuditoria.id).html(objAccAuditoria.accionEstadoNombre);
}

function volverDivIncidentes() {

    $("#tabProyectos .container-fluid").hide();
    $("#divCompletarIncidenteProyecto").show();
    $("#tabProyectos h4")
        .html("<a onclick='volverDivProyectos()'>Proyecto ("
            + listFullProyectoSeguridad[indexPostulante].titulo + ") </a> > Incidentes Relacionados");
    verCompletarIncidenteProyecto();
}

function volverDivObservaciones() {
    $("#tabProyectos .container-fluid").hide();
    $("#divCompletarObservacionProyecto").show();
    $("#tabProyectos h4")
        .html("<a onclick='volverDivProyectos()'>Proyecto ("
            + listFullProyectoSeguridad[indexPostulante].titulo + ") </a> > Observaciones Encontradas");
    verCompletarObsProyecto();
}

function volverDivAuditoriaGeneral() {
    $("#tabProyectos .container-fluid").hide();
    $("#divCompletarAuditoriaProyecto").show();
    $("#tabProyectos h4")
        .html("<a onclick='volverDivProyectos()'>Proyecto ("
            + listFullProyectoSeguridad[indexPostulante].titulo + ") </a> > Resultados Auditoría");
    verCompletarAuditoriaGenral();
}

var listFullAuditoriaGeneral = [];
var objAuditoriaGeneral = {};

function volverDivAuditoria() {
    $("#tabProyectos .container-fluid").hide();
    $("#divCompletarAuditoriaProyecto").show();
    $("#tabProyectos h4")
        .html("<a onclick='volverDivProyectos()'>Proyecto ("
            + listFullProyectoSeguridad[indexPostulante].titulo + ") </a> "
            + "> <a onclick='volverDivAuditoriaGeneral()'>Resultados Auditoría</a>"
            + " > Evaluaciones");
    verCompletarEvaluacionesAuditoria(objAuditoriaGeneral.index);
}

function notificarResponsableAuditoria(pauditoriaId, cambiarColor) {
    callAjaxPost(URL + "/auditoria/notificar/empresa", {auditoriaId: pauditoriaId}, function (data) {
        if (data.mensaje.length > 0) {
            alert(data.mensaje);
        }
        if (parseInt(cambiarColor) == 1 && parseInt(data.mensajeId) == 0) {
            $("#divMovilAuditoria" + pauditoriaId).find(".detalleAccion")
                .removeClass("gosst-desaprobado")
                .removeClass("gosst-aprobado")
                .removeClass("gosst-observacion")
                .addClass("gosst-observacion");
            $("#subDivMovilDetalleAudi" + pauditoriaId).find(".subDetalleAccion")
                .removeClass("gosst-desaprobado")
                .removeClass("gosst-aprobado")
                .removeClass("gosst-observacion")
                .addClass("gosst-observacion");

        }
        $("#labelFecha" + pauditoriaId).html(data.auditoria.fechaNotificacionEmpresaTexto);

    });
}

function verCompletarInspeccionesGenral(pindex) {
    pindex = defaultFor(pindex, indexPostulante);
    //
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleInspeccionProyecto").hide();

    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
        .find(".detalleInspeccionProyecto").toggle()
    //
    var proyectoObj1 = {
        idCompany: getSession("gestopcompanyid"),
        auditoriaClasifId: 2,
        isInformeActividad: 1,
        proyectoId: listFullProyectoSeguridad[pindex].id
    };
    indexPostulante = pindex;
    callAjaxPost(URL + '/auditoria/contratistas', proyectoObj1,
        function (data) {
            listFullAuditoriaGeneral = data.list;
            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                .find(".detalleInspeccionProyecto").html("<td colspan='3'></td>");
            listFullAuditoriaGeneral.forEach(function (val1, index1) {

                var claseNotaDocumento = "gosst-neutral";

                var opciones = "<a onclick='verCompletarHallazgosContratista(" + index1 + ")'> Ver Hallazgos (" + val1.numHallazgos + ") </a>";
                var textoIndicador = val1.auditoriaNombre;
                var estadoAux = "", claseAux = "", cambiarColor = 0;
                if (val1.fechaNotificacionEmpresa == null) {
                    cambiarColor = 1;
                    estadoAux = "Pendiente notificar acciones correctivas al Cliente ";
                    claseNotaDocumento = "gosst-desaprobado";
                } else if (val1.evaluacion.fecha == null || val1.evaluacion.id == 4) {
                    estadoAux = "Informe en revisión por el Cliente ";
                    claseNotaDocumento = "gosst-observacion";
                } else if (val1.evaluacion.id == 1) {
                    estadoAux = "Hallazgos subsanados por la Contratista  ";
                    claseNotaDocumento = "gosst-aprobado"
                } else if (val1.evaluacion.id == 2) {
                    estadoAux = "Acciones correctivas observadas por el Cliente ";
                    claseNotaDocumento = "gosst-desaprobado";
                }

                if (val1.numHallazgos == 0) {
                    estadoAux = "Informe sin Hallazgos  ";
                    claseNotaDocumento = "gosst-aprobado"
                }
                $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                    .find(".detalleInspeccionProyecto td")
                    .append("<div id='divMovilAuditoria" + val1.auditoriaId + "'>" +
                        "<div class='detalleAccion " + claseNotaDocumento + "' > " +
                        "<i aria-hidden='true' class='fa fa-info'></i><strong>Título:</strong> " +
                        textoIndicador + "<br>" +
                        "<i class='fa fa-cubes'></i>Estado: " + estadoAux + "<br>" +
                        //"<strong>INSPECCIÓN "+(index1+1)+"</strong><br>"+
                        ("<a class='efectoLink'  onclick='notificarResponsableAuditoria(" + val1.auditoriaId + "," + cambiarColor + ")'  target='_blank'> " +
                            "<i class='fa fa-envelope-o'></i> Notificar a responsable del Cliente " +
                            "</a><br>") +
                        "Ult. notificación a " + getSession("gestopcompanyname") + ": " +
                        "<label id='labelFecha" + val1.auditoriaId + "'>" + val1.fechaNotificacionEmpresaTexto + "</label><br>" +

                        "<i class='fa fa-info'></i><strong>Código Informe:</strong> " + val1.nroCaso + "<br>" +
                        (false == "---" ? "" :
                            "<a class='efectoLink' href='" + URL + "/contratista/auditoria/informe?auditoriaId=" + val1.auditoriaId + "'  target='_blank'> " +
                            "<i class='fa fa-download'></i> Descargar informe " +
                            "</a><br>") +
                        "<i class='fa fa-calendar'></i><strong>Fecha Planificada:</strong> " + val1.fechaPlanificadaNombre + "<br>" +
                        "<i class='fa fa-search'></i><strong>Tipo de Inspeccion:</strong> " + val1.auditoriaTipoNombre + "<br>" +
                        "<a class='efectoLink' onclick='verCompletarHallazgosContratista(" + index1 + ")'> " +
                        "Ver Hallazgos (" + val1.numHallazgos + ")" +
                        "<i class='fa fa-angle-double-down'></i>" +
                        "</a><br>" +
                        "</div>" +
                        "<div class='opcionesAccion'>" +
                        //opciones+
                        "</div>" +
                        "<div class='subOpcionAccion'></div>")
            });
        });
}

function verCompletarHallazgosContratista(pindex) {
    pindex = defaultFor(pindex, objAuditoriaGeneral.index);
    var val1 = listFullAuditoriaGeneral[pindex];
    objAuditoriaGeneral = val1;
    objAuditoriaGeneral.index = pindex;
    $(".subOpcionAccion").hide();
    $(".subOpcionAccion").html("");
    var dataParam = {
        auditoriaId: val1.auditoriaId,
        auditoriaTipo: val1.auditoriaTipo,
        vistoContratista: 1
    };
    detalleAuditoriaFull = []
    callAjaxPost(URL + '/auditoria/hallazgos', dataParam,
        function (data1) {
            if (data1.CODE_RESPONSE == "05") {
                detalleHallazgoFull = data1.list;
                var bodyText = "";

                detalleHallazgoFull.forEach(function (val2, index2) {
                    var claseNotaDocumento = "";
                    if (objAuditoriaGeneral.fechaNotificacionEmpresa == null) {
                        claseNotaDocumento = "gosst-desaprobado";
                    } else if (objAuditoriaGeneral.evaluacion.fecha == null || objAuditoriaGeneral.evaluacion.id == 4) {
                        claseNotaDocumento = "gosst-observacion";
                    } else if (objAuditoriaGeneral.evaluacion.id == 1) {
                        claseNotaDocumento = "gosst-aprobado"
                    } else if (objAuditoriaGeneral.evaluacion.id == 2) {
                        claseNotaDocumento = "gosst-desaprobado";

                    }
                    if (objAuditoriaGeneral.evaluacion.id == 2
                        && val2.numAcciones > 0
                        && (val2.numAcciones == val2.numAccionesSinRespuesta)) {
                        claseNotaDocumento = "gosst-aprobado";

                    }
                    var btnOpcion = "<button class='btn btn-success' onclick='toggleMenuOpcionHallazgo(this," + index2 + ")'>" +
                        "<i class='fa  fa-caret-down' aria-hidden='true'></i></button>";

                    var textEvi = " ";
                    var btnDescarga = "<a target='_blank' href='" + URL + "/auditoria/hallazgo/evidencia?hallazgoId=" + val2.id + "'>" +
                        "<i class='fa fa-download'></i>Descargar</a><i class='fa fa-minus'></i>";
                    if (val2.evidenciaNombre == "----"
                        || val2.evidenciaNombre == "") {
                        textEvi = "";
                        btnDescarga = "";
                    }
                    var aprobado = "gosst-neutral";
                    aprobado = claseNotaDocumento;
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find("#divMovilAuditoria" + listFullAuditoriaGeneral[pindex].auditoriaId + " .subOpcionAccion").show()
                        .append("<div id='subDivMovilDetalleAudi" + val2.id + "'>" +
                            "<div class='subDetalleAccion  " + aprobado + "'   >" +
                            "<strong>HALLAZGO " + (index2 + 1) + "</strong><br>" +
                            "<strong><i class='fa fa-info' aria-hidden='true'></i> Descripción: </strong>" + val2.descripcion + "<br>" +
                            "<strong><i class='fa fa-home' aria-hidden='true'></i> Lugar específico:</strong> " + val2.lugar + "<br>" +
                            "<i class='fa fa-download'></i> Evidencia: " +
                            (val2.evidenciaNombre == "----" ?
                                "Sin Registro" :
                                "<a class='efectoLink'  href='" + URL + "/auditoria/hallazgo/evidencia?hallazgoId=" + val2.id + "'>" +
                                val2.evidenciaNombre +
                                "</a>") + "<br>" +
                            "<a class='efectoLink' onclick='verCompletarAccioneHallazgoContratista(" + index2 + ")'>" +
                            "Ver Acción de Mejora  (" + val2.numAcciones + ") <i class='fa fa-angle-double-down'></i>" +
                            "</a>" +
                            "</div> " +
                            "<div class='opcionesDetalleAccion'>" +
                            //btnDescarga+
                            //"<a onclick='verCompletarAccioneHallazgoContratista("+index2+")'> Ver ("+val2.numAcciones+")</a>" +
                            //"<i class='fa fa-minus'></i>" +
                            "<a style='color:#2e9e8f;font-weight: 800;'onclick='nuevaAccionHallazgoAuditoria(" + index2 + ")'>  Agregar Acción de Mejora </a>" +
                            "<div class='subOpcionDetalleAccion'>" +
                            "</div>" +
                            "</div>" +
                            "</div>");
                });
                $(".subDetalleAccion ul").hide();
            } else {
                alert("No tiene acceso a esta funcionalidad")
            }
        });
}

function verCompletarAuditoriaGenral(pindex) {
    pindex = defaultFor(pindex, indexPostulante);

    //
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleAuditoriasProyecto").hide();

    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
        .find(".detalleAuditoriasProyecto").toggle()
    //
    var proyectoObj1 = {
        idCompany: getSession("gestopcompanyid"),
        auditoriaClasifId: 3,
        isInformeActividad: 1,
        proyectoId: listFullProyectoSeguridad[pindex].id
    };
    indexPostulante = pindex;
    callAjaxPost(URL + '/auditoria/contratistas', proyectoObj1,
        function (data) {
            var list = data.list;
            listFullAuditoriaGeneral = list;
            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                .find(".detalleAuditoriasProyecto").html("<td colspan='3'></td>");

            $("#tblAuditoriasGeneral tbody tr").remove();
            list.forEach(function (val1, index1) {
                var rptaSi = val1.rptaSi;
                var rptaParc = val1.rptaParcial;
                var rptaNo = val1.rptaNo;
                var rptaRP = val1.rptaRP;
                var rptaFaltante = val1.rptaRespondida;
                var puntaje = rptaSi * 1 + rptaParc * 0.5 + rptaRP * 0.75 + rptaNo * 0;
                var puntajeMax = rptaSi + rptaParc + rptaRP + rptaNo;
                var pregTotal = val1.numPreguntas;
                var nivelAvance2 = rptaSi + " / " + puntajeMax;
                nivelAvance2 = val1.numDetallesConObservacion;
                var claseNotaDocumento = "gosst-neutral";
                if (val1.evaluacion.id == 1) {
                    claseNotaDocumento = "gosst-aprobado";
                }
                var textColor = "style='border-color:" + colorPuntajeGosst(puntaje / puntajeMax) + " !important'";
                var opciones = "<a onclick='verCompletarEvaluacionesAuditoria(" + index1 + ")'> Ver Detalle (" + nivelAvance2 + ")</a>";
                var textoIndicador = pasarDecimalPorcentaje(puntaje / puntajeMax, 2);
                var estadoAux = "", claseAux = "", cambiarColor = 0;
                cambiarColor = 1;
                if (val1.fechaNotificacionEmpresa == null) {
                    estadoAux = "Pendiente notificar acciones correctivas al Cliente ";
                    claseNotaDocumento = "gosst-desaprobado";
                } else if (val1.evaluacion.fecha == null
                    || val1.evaluacion.id == 3
                    || val1.evaluacion.id == 4) {
                    estadoAux = "Informe en revisión por el Cliente ";
                    claseNotaDocumento = "gosst-observacion";
                } else if (val1.evaluacion.id == 1) {
                    estadoAux = "Resultados subsanados por la Contratista  ";
                    claseNotaDocumento = "gosst-aprobado"
                } else if (val1.evaluacion.id == 2) {
                    estadoAux = "Acciones correctivas observadas por el Cliente ";
                    claseNotaDocumento = "gosst-desaprobado";
                }
                if (val1.numDetallesConObservacion == 0) {
                    estadoAux = "Informe sin observaciones  ";
                    claseNotaDocumento = "gosst-aprobado"
                }
                $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                    .find(".detalleAuditoriasProyecto td")
                    .append("<div id='divMovilAuditoria" + val1.auditoriaId + "'>" +
                        "<div class='detalleAccion " + claseNotaDocumento + "' > " +
                        "<strong>AUDITORIA " + (index1 + 1) + "</strong><br>" +
                        "<i class='fa fa-cubes'></i>Estado: " + estadoAux + "<br>" +

                        ("<a class='efectoLink'  onclick='notificarResponsableAuditoria(" + val1.auditoriaId + "," + cambiarColor + ")'  target='_blank'> " +
                            "<i class='fa fa-envelope-o'></i> Notificar a responsable del Cliente " +
                            "</a><br>") +
                        "Ult. notificación a " + getSession("gestopcompanyname") + ": " +
                        "<label id='labelFecha" + val1.auditoriaId + "'>" + val1.fechaNotificacionEmpresaTexto + "</label><br>" +

                        (val1.evidenciaNombre == "---" ? "" :
                            "<a class='efectoLink' href='" + URL + "/auditoria/evidencia?auditoriaId=" + val1.auditoriaId + "'  target='_blank'> " +
                            "<i class='fa fa-download'></i> Descargar informe " +
                            "" +
                            "</a><br>") +

                        "<i class='fa fa-info'></i><strong>Código Informe:</strong> " + val1.nroCaso + "<br>" +
                        "<i aria-hidden='true' class='fa fa-thumbs-o-up'></i>Conformidad: " +
                        textoIndicador + "<br>" +
                        "<i aria-hidden='true' class='fa fa-info'></i>Descripcion:" +
                        val1.auditoriaTipoNombre + "<br>" +
                        "<i aria-hidden='true' class='fa fa-calendar'></i>Fecha: " + val1.fechaPlanificadaNombre + "<br>" +
                        "<a class='efectoLink'  onclick='verCompletarEvaluacionesAuditoria(" + index1 + ");'>" +
                        "Ver Resultados (" + nivelAvance2 + ") <i class='fa fa-angle-double-down'></i>" +
                        "</a>" +
                        "</div>" +
                        "<div class='subOpcionAccion'></div>");
            });
        });

}

function verCompletarAuditoriaColabGenral(pindex, pidAudi) {
    pindex = defaultFor(pindex, indexPostulante);

    //
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleAuditoriasProyecto").hide();

    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
        .find(".detalleAuditoriasProyecto").toggle()
    //
    var auditoriaClasifProy = 3;
    var trabajadorAsociado = getSession("trabajadorGosstId");

    var proyectoObj1 = {
        idCompany: getSession("gestopcompanyid"),
        auditoriaClasifId: auditoriaClasifProy,
        proyectoId: listFullProyectoSeguridad[pindex].id,
        trabajador: {trabajadorId: trabajadorAsociado}
    };
    indexPostulante = pindex;
    callAjaxPost(URL + '/auditoria/contratistas', proyectoObj1,
        function (data) {
            var list = data.list;
            listFullAuditoriaGeneral = list;
            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                .find(".detalleAuditoriasProyecto").html("<td colspan='3'></td>");
            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                .find(".detalleAuditoriasProyecto td")
                .append("<div  >" +
                    "<div class='detalleAccion    > " +
                    "<i aria-hidden='true' class='fa fa-caret-right'></i>" +
                    "Se le ha asignado realizar " + listFullAuditoriaGeneral.length + " auditoria(s)" +
                    "</div>"
                )
            $("#tblAuditoriasGeneral tbody tr").remove();
            list.forEach(function (val1, index1) {
                var rptaSi = val1.rptaSi;
                var rptaParc = val1.rptaParcial;
                var rptaNo = val1.rptaNo;
                var rptaRP = val1.rptaRP;
                var rptaFaltante = val1.rptaRespondida;
                var puntaje = rptaSi * 1 + rptaParc * 0.5 + rptaRP * 0.75 + rptaNo * 0;
                var puntajeMax = rptaSi + rptaParc + rptaRP + rptaNo;
                var pregTotal = val1.numPreguntas;
                var nivelAvance2 = rptaSi + "/" + pregTotal;

                var claseNotaDocumento = "gosst-neutral";

                var opciones = "<a onclick='verCompletarEvaluacionesAuditoriaColab(" + index1 + ")'> Ver Detalle (" + nivelAvance2 + ")</a>";
                var textoIndicador = pasarDecimalPorcentaje(puntaje / puntajeMax, 2);
                $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                    .find(".detalleAuditoriasProyecto td")
                    .append("<div id='divMovilAuditoria" + val1.auditoriaId + "'>" +
                        "<div class='detalleAccion " + claseNotaDocumento + "' style='border-color:" + colorPuntajeGosst(puntaje / puntajeMax) + " !important'> " +
                        "<i aria-hidden='true' class='fa fa-caret-right'></i>" +
                        val1.auditoriaTipoNombre + "<br>" +
                        "<i aria-hidden='true' class='fa fa-calendar'></i>" +
                        val1.fechaPlanificadaNombre + " " + val1.horaPlanificadaTexto + "<br>" +
                        "<i aria-hidden='true' class='fa fa-caret-right'></i>" +
                        textoIndicador + "<br>" +

                        "<i aria-hidden='true' class='fa fa-info'></i> Acc. correctiva completadas / programadas : " +
                        val1.accionesDirectasTotal + "<br>" +

                        "</div>" +
                        "<div class='opcionesAccion'>" +
                        opciones +
                        "</div>" +
                        "<div class='subOpcionAccion'></div>")
            });
            if (parseInt(pidAudi) > 0) {
                list.forEach(function (val, index) {
                    if (val.auditoriaId == parseInt(pidAudi)) {
                        verCompletarEvaluacionesAuditoriaColab(index, 1);
                    }
                });
            }
        });

}

function verCompletarInspeccionColabGenral(pindex, pidAux) {
    pindex = defaultFor(pindex, indexPostulante);

    //
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleInspeccionProyecto").hide();

    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
        .find(".detalleInspeccionProyecto").toggle()
    //
    var auditoriaClasifProy = 2;
    var trabajadorAsociado = getSession("trabajadorGosstId");
    var proyectoObj1 = {
        idCompany: getSession("gestopcompanyid"),
        auditoriaClasifId: auditoriaClasifProy,
        proyectoId: listFullProyectoSeguridad[pindex].id,
        trabajador: {trabajadorId: trabajadorAsociado}
    };
    indexPostulante = pindex;
    callAjaxPost(URL + '/auditoria/contratistas', proyectoObj1,
        function (data) {
            listFullAuditoriaGeneral = data.list;
            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                .find(".detalleInspeccionProyecto").html("<td colspan='3'></td>");
            $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                .find(".detalleInspeccionProyecto td")
                .append("<div  >" +
                    "<div class='detalleAccion    > " +
                    "<i aria-hidden='true' class='fa fa-caret-right'></i>" +
                    "Se le ha asignado realizar " + listFullAuditoriaGeneral.length + " inspeccion(es)" +
                    "</div>"
                )
            listFullAuditoriaGeneral.forEach(function (val1, index1) {
                var claseNotaDocumento = "gosst-neutral";

                var opciones = " ";
                var textoIndicador = "";
                opciones = "<a onclick='verCompletarHallazgos(" + index1 + ")'> Ver Hallazgos (" + val1.numHallazgos + ") </a>" +
                    "<i class='fa fa-minus' ></i>" +
                    "<a onclick='agregarHallazgoInspeccion(" + index1 + ")'> Agregar </a>";
                textoIndicador = val1.auditoriaNombre;

                $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                    .find(".detalleInspeccionProyecto td")
                    .append("<div id='divMovilAuditoria" + val1.auditoriaId + "'>" +
                        "<div class='detalleAccion " + claseNotaDocumento + "'    > " +
                        "<i aria-hidden='true' class='fa fa-caret-right'></i>" +
                        textoIndicador + "<br>" +
                        "<i aria-hidden='true' class='fa fa-caret-right'></i>" +
                        val1.auditoriaTipoNombre + "<br>" +
                        val1.fechaPlanificadaNombre + "</div>" +
                        "<div class='opcionesAccion'>" +
                        opciones +
                        "</div>" +
                        "<div class='subOpcionAccion'></div>")
            });
            if (parseInt(pidAux) > 0) {
                listFullAuditoriaGeneral.forEach(function (val1, index1) {
                    if (val1.auditoriaId == parseInt(pidAux)) {
                        agregarHallazgoInspeccion(index1);
                    }
                })
            }

        });

}

function verResumenAccionesAuditoria(pindex) {
    var val1 = listFullAuditoriaGeneral[pindex];
    pindex = defaultFor(pindex, objAuditoriaGeneral.index);
    $("#tabProyectos .container-fluid").hide();
    $("#divResumenAccionesAuditoria").show();
    objAuditoriaGeneral.index = pindex;
    $("#tabProyectos h4")
        .html("<a onclick='volverDivProyectos()'>Proyecto (" +
            listFullProyectoSeguridad[indexPostulante].titulo + ") </a> " +
            "> <a onclick='verCompletarAuditoriaGenral(" + indexPostulante + ")'> Auditoría (" + val1.auditoriaTipoNombre + ")</a> " +
            "> Resumen Acciones");

    var dataParam = {
        auditoriaId: val1.auditoriaId
    };
    detalleAuditoriaFull = []
    callAjaxPost(URL + '/auditoria/verificaciones/acciones', dataParam,
        function (data1) {
            var detail = data1.list;
            var bodyText = "";
            $("#tblResumenAccion tbody tr").remove();
            detail.forEach(function (val2, index2) {
                var iconoDescarga =
                    "<a href='" + URL + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + val2.accionMejoraId + "'>" +
                    "<i class='fa fa-download fa-2x' aria-hidden='true'></i></a>";
                if (val2.evidenciaNombre == "----") {
                    iconoDescarga = "";
                }
                $("#tblResumenAccion tbody").append(
                    "<tr>" +
                    "<td >" + val2.descripcion + "</td>" +
                    "<td >" + val2.fechaRevisionTexto + "</td>" +
                    "<td >" + val2.fechaRealTexto + "</td>" +
                    "<td >" + val2.observacion + "</td>" +
                    "<td >" + val2.evidenciaNombre + iconoDescarga + "</td>" +
                    "<td >" + val2.estadoCumplimientoNombre + "</td>" +
                    "" +
                    "</tr>");

            });


        });
}

//Resumen Incidentes
function volverVistaIncidentes() {
    verResumenIncidentesAuditoria();
}

var incidentesList = [];
var banderaEdicionEvaluacionAcc = false;
var listTipoEvaluacionGeneral = [];

function verResumenIncidentesAuditoria() {
    $("#tabProyectos .container-fluid").hide();
    $("#divResumenIncidentesProy").show();
    banderaEdicionEvaluacionAcc = false;
    $("#tabProyectos h2").html(
        "<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo + ")</a> > Resumen Incidentes");

    var dataParam = {
        id: proyectoObj.id
    };

    callAjaxPost(URL + '/contratista/proyecto/incidentes', dataParam, function (data1) {
        incidentesList = data1.list;
        listTipoEvaluacionGeneral = data1.tipo_evaluacion
        var bodyText = "";

        $("#tblResumenIncidentes tbody tr").remove();

        incidentesList.forEach(function (val2, index2) {
            var iconoDescarga =
                "<a class='btn btn-success' href='" + URL + "/contratista/proyecto/incidente/evidencia?id=" + val2.accidenteId + "' " +
                "target='_blank'>" +
                "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
                "</a>";

            if (val2.evidenciaNombre == "") {
                iconoDescarga = "";
            }

            var textoBotonAct =
                "<button class='btn btn-success' style='padding:5px' onclick='verVistaAccioneIncidente(" + index2 + ")'>" +
                "<i class='fa fa-external-link-square' aria-hidden='true'></i>" +
                "</button>";

            var textEval =
                "<button onclick='modificarEvaluacionAccidente(" + index2 + ")' class='btn btn-success'>" +
                "Modificar evaluación <i class='fa fa-envelope-o'></i>" +
                "</button>";

            var eviEval =
                "<a class='btn btn-success' href='" + URL + "/contratista/proyecto/incidente/evaluacion/evidencia?id=" + val2.accidenteId + "' " +
                "target='_blank'>" +
                "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
                "</a>";

            if (val2.evaluacion.evidenciaNombre == "") {
                eviEval = "";
            }

            $("#tblResumenIncidentes tbody").append(
                "<tr>" +
                "<td>" + val2.accidenteTipoNombre + "</td>" +
                "<td>" + val2.accidenteSubTipoNombre + "</td>" +
                "<td>" + val2.accidenteDescripcion + "</td>" +
                "<td>" + val2.accidenteClasificacionNombre + "</td>" +
                "<td>" + val2.trabajadorContratista.nombre + "<br>" + val2.nombreAccidentadosInterno + "</td>" +
                "<td>" + val2.fecha + "</td>" +
                "<td>" + val2.evidenciaNombre + iconoDescarga + "</td>" +
                "<td>" + val2.indicadorAcciones + textoBotonAct + "</td>" +
                "<td id='acceval" + val2.accidenteId + "'>" + val2.evaluacion.icono + val2.evaluacion.nombre + textEval + "</td>" +
                "<td id='accevalObs" + val2.accidenteId + "'>" + val2.evaluacion.observacion + "</td>" +
                "<td id='accevalEvi" + val2.accidenteId + "'>" + val2.evaluacion.evidenciaNombre + eviEval + "</td>" +
                "</tr>");
        });

        goheadfixedY("#tblResumenIncidentes", "#wrapResumIncidentes");
    });
}

function modificarEvaluacionAccidente(pindex) {
    if (!banderaEdicionEvaluacionAcc) {
        banderaEdicionEvaluacionAcc = true;
        var accObj = incidentesList[pindex];
        var btnVolver = "<button onclick='volverModificarEvaluacionAccidente(" + pindex + ")' class='btn btn-danger'>" +
            " <i class='fa fa-arrow-left'></i>" +
            "</button>";
        var btnGuardar = "<button onclick='guardarModificarEvaluacionAccidente(" + pindex + ")' class='btn btn-success'>" +
            " <i class='fa fa-floppy-o'></i>" +
            "</button>";
        var selEvalAccidente = crearSelectOneMenuOblig("selEvalAccidente", "", listTipoEvaluacionGeneral, accObj.evaluacion.id, "id",
            "nombre");
        $("#acceval" + accObj.accidenteId).html(selEvalAccidente + btnVolver + btnGuardar)
        $("#accevalObs" + accObj.accidenteId)
            .html("<input type='text' id='inputRespAccEval' class='form-control'> ");
        var options =
            {
                container: "#accevalEvi" + accObj.accidenteId,
                functionCall: function () {
                },
                descargaUrl: "/contratista/proyecto/incidente/evaluacion/evidencia?id=" + accObj.accidenteId,
                esNuevo: false,
                idAux: "EvalAccidente",
                evidenciaNombre: accObj.evaluacion.evidenciaNombre
            };
        crearFormEvidenciaCompleta(options);
        $("#inputRespAccEval").focus();
        $("#inputRespAccEval").val(accObj.evaluacion.observacion);
    } else {
        alert("Hay una respuesta en edición")
    }
}

function volverModificarEvaluacionAccidente(pindex) {
    //var accObj=listFullAccionesAsociadas[pindex];
    verResumenIncidentesAuditoria();
}

function guardarModificarEvaluacionAccidente(pindex) {
    var accObj = incidentesList[pindex];
    var accSend = {
        accidenteId: accObj.accidenteId,
        evaluacion:
            {
                id: $("#selEvalAccidente").val(),
                observacion: $("#inputRespAccEval").val()
            }
    }
    callAjaxPost(URL + '/contratista/proyecto/incidente/evaluacion/save',
        accSend, function (data) {
            guardarEvidenciaAuto(accObj.accidenteId, "fileEviEvalAccidente", bitsEvidenciaVerificacion, "/contratista/proyecto/incidente/evaluacion/evidencia/save",
                verResumenIncidentesAuditoria)

        });
}

var listFullAccionesAsociadas = [];
var banderaEdicionRespuestaAcc = false;

function verVistaAccioneIncidente(pindex) {
    $("#tabProyectos .container-fluid").hide();
    $("#divAccionesIncidente").show();
    $("#tabProyectos h2")
        .html("<a onclick='volverDivProyectos()'> Proyecto (" + proyectoObj.titulo + ") </a>" +
            " > <a onclick='volverVistaIncidentes()'> Incidente (" + incidentesList[pindex].accidenteTipoNombre + ") </a>" +
            " > Acciones de Mejora");
    var audiObj = {
        accionMejoraTipoId: 1,
        accidenteId: incidentesList[pindex].accidenteId
    };
    callAjaxPost(URL + '/gestionaccionmejora/accionmejora',
        audiObj, function (data) {
            if (data.CODE_RESPONSE == "05") {
                $("#tblAccIncidente tbody tr").remove();
                banderaEdicionRespuestaAcc = false;
                listFullAccionesAsociadas = data.list;
                listFullAccionesAsociadas.forEach(function (val, index) {
                    val.id = val.accionMejoraId;
                    val.indexAccidente = pindex;
                    var iconoDescarga =
                        "<a href='" + URL + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + val.accionMejoraId + "'>" +
                        "<i class='fa fa-download fa-2x' aria-hidden='true'></i></a>";
                    if (val.evidenciaNombre == "----") {
                        iconoDescarga = "";
                    }
                    $("#tblAccIncidente tbody").append(
                        "<tr id='trtip" + val.id + "'  >" +
                        //
                        "<td id='actpdesc" + val.id + "'>" + val.descripcion + "</td>" +
                        "<td id='actpfp" + val.id + "'>" + val.fechaRevisionTexto + "</td>" +
                        "<td id='actpfr" + val.id + "'>" + val.fechaRealTexto + "</td>" +
                        "<td id='actpobs" + val.id + "'>" + val.observacion + "</td>" +
                        "<td id='actpresp" + val.id + "'>" + val.respuesta +
                        "<button onclick='modificarRespuestaAccionMejoraAccidente(" + index + ")' class='btn btn-success'>" +
                        "Modificar respuesta <i class='fa fa-envelope-o'></i>" +
                        "</button>" + "</td>" +
                        "<td id='actpevi" + val.id + "'>" + val.evidenciaNombre + iconoDescarga + "</td>" +
                        "<td id='actpes" + val.id + "'>" + val.estadoCumplimientoNombre + "</td>" +


                        "</tr>");
                });
            } else {
                console.log("NOPNPO")
            }
        });
}

function modificarRespuestaAccionMejoraAccidente(pindex) {
    if (!banderaEdicionRespuestaAcc) {
        banderaEdicionRespuestaAcc = true;
        var accObj = listFullAccionesAsociadas[pindex];
        var btnVolver = "<button onclick='volverModificarRespuestaAccidente(" + pindex + ")' class='btn btn-danger'>" +
            " <i class='fa fa-arrow-left'></i>" +
            "</button>";
        var btnGuardar = "<button onclick='guardarModificarRespuestaAccidente(" + pindex + ")' class='btn btn-success'>" +
            " <i class='fa fa-floppy-o'></i>" +
            "</button>";
        $("#actpresp" + accObj.id)
            .html("<input type='text' id='inputRespAccASoc' class='form-control'> " +
                "" + btnVolver + btnGuardar);
        $("#inputRespAccASoc").focus();
        $("#inputRespAccASoc").val(accObj.respuesta);
    } else {
        alert("Hay una respuesta en edición")
    }
}

function volverModificarRespuestaAccidente(pindex) {
    var accObj = listFullAccionesAsociadas[pindex];
    verVistaAccioneIncidente(accObj.indexAccidente);
}

function guardarModificarRespuestaAccidente(pindex) {
    var accObj = listFullAccionesAsociadas[pindex];
    var accSend = {
        accionMejoraId: accObj.id,
        respuesta: $("#inputRespAccASoc").val()
    }
    callAjaxPost(URL + '/gestionaccionmejora/accionmejora/respuesta/save',
        accSend, function (data) {

            verVistaAccioneIncidente(accObj.indexAccidente);
        });
}

function verCompletarEvaluacionesAuditoria(pindex) {
    pindex = defaultFor(pindex, objAuditoriaGeneral.index);
    var val1 = listFullAuditoriaGeneral[pindex];
    objAuditoriaGeneral = val1;
    $("#tabProyectos .container-fluid").hide();
    $("#divCompletarAuditoriaProyecto").show();
    objAuditoriaGeneral.index = pindex;
    $("#tabProyectos h4")
        .html("<a onclick='volverDivProyectos()'>Proyecto (" +
            listFullProyectoSeguridad[indexPostulante].titulo + ") </a> " +
            "> <a onclick='verCompletarAuditoriaGenral(" + indexPostulante + ")'> Auditoría (" + val1.auditoriaTipoNombre + ")</a> " +
            "> Evaluaciones");
    $(".subOpcionAccion").html("");
    $(".subOpcionAccion").hide();
    var dataParam = {
        auditoriaId: val1.auditoriaId,
        auditoriaTipo: val1.auditoriaTipo,
        isInformeActividad: 1
    };
    detalleAuditoriaFull = []
    callAjaxPost(URL + '/auditoria/verificaciones', dataParam,
        function (data1) {
            detalleAuditoriaFull = data1.list;
            var bodyText = "";
            $("#tblAudi tbody tr").remove();

            detalleAuditoriaFull.forEach(function (val2, index2) {
                var menuOpcion = "<ul class='list-group' >";
                funcionalidadesDetalleAudi.forEach(function (val, index) {
                    menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionDetalleAuditoria(" + index + ")'>" + val.nombre + " </li>"
                });
                menuOpcion += "</ul>";
                var btnOpcion = "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionDetalleAudi(this," + index2 + ")'>" +
                    "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
                    "</a>";
                var iconoestado;
                var resultadoText = (val2.bitSi == 1 ? "Cumple" :
                    (val2.bitParc == 1 ? "Cumple Parcialmente" :
                        val2.bitNo ? "No Cumple" : ""));


                if (val2.bitSi == 1) {
                    iconoestado = "fa-star";
                    resultadoText = "Cumple";
                } else if (val2.bitParc == 1) {
                    iconoestado = "fa-star-half-o";
                    resultadoText = "Cumple Parcialmente";
                } else if (val2.bitNo) {
                    iconoestado = "fa-star-o";
                    resultadoText = "No Cumple";
                }
                var textEvi = "";
                if (val2.evidenciaNombre == "----") {
                    textEvi = "Sin Registro<br>";
                } else {
                    textEvi = "<a class='efectoLink' href='" + URL + "/auditoria/verificaciones/evidencia?verificacionId=" +
                        val2.verificacionId + "&auditoriaId=" + val1.auditoriaId + " '>" +
                        val2.evidenciaNombre +
                        "</a><br>";
                }
                var claseAux = "gosst-desaprobado";


                if (objAuditoriaGeneral.fechaNotificacionEmpresa == null) {
                    claseAux = "gosst-desaprobado";
                } else if (objAuditoriaGeneral.evaluacion.fecha == null
                    || objAuditoriaGeneral.evaluacion.id == 3
                    || objAuditoriaGeneral.evaluacion.id == 4) {
                    claseAux = "gosst-observacion";
                } else if (objAuditoriaGeneral.evaluacion.id == 1) {
                    claseAux = "gosst-aprobado"
                } else if (objAuditoriaGeneral.evaluacion.id == 2) {
                    claseAux = "gosst-desaprobado";

                }
                if (objAuditoriaGeneral.evaluacion.id == 2
                    && val2.numAcciones > 0
                    && (val2.numAcciones == val2.numAccionesSinRespuesta)) {
                    claseAux = "gosst-aprobado";

                }

                var puntajeDetalle = (val2.bitParc * 0.5 + val2.bitSi * 1 + val2.bitNo * 0)
                var colorAux = colorPuntajeGosst(puntajeDetalle);

                $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                    .find("#divMovilAuditoria" + listFullAuditoriaGeneral[pindex].auditoriaId + " .subOpcionAccion").show()
                    .append("<div id='subDivMovilDetalleAudi" + val2.detalleAuditoriaId + "'>" +
                        //"<div class='subDetalleAccion  gosst-neutral'  style='border-color:"+colorAux+" !important'>" +
                        "<div class='subDetalleAccion  " + claseAux + "'  >" +
                        btnOpcion +
                        menuOpcion +
                        "<strong>RESULTADO " + (index2 + 1) + "</strong><br>" +
                        "<i class='fa fa-info' aria-hidden='true'></i>Descripcion: " + val2.verificacion + " (" + val2.comentario + " )<br>" +
                        "<i class='fa " + iconoestado + "'></i>Estado: <strong>" + resultadoText + "</strong><br>" +
                        "<i class='fa fa-download'></i> Evidencia: " +
                        textEvi +
                        "<a class='efectoLink' onclick='verCompletarAccioneAuditoria(" + index2 + ");'>" +
                        "Ver Acción de Mejora (" + val2.indicadorAcciones + ")<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
                        "</a>" +
                        "</div> " +
                        "<div class='opcionesDetalleAccion'>" +
                        /*"<a target='_blank' href='"+URL+"/auditoria/verificaciones/evidencia?" +
												"verificacionId="+val2.verificacionId+"&auditoriaId="+val1.auditoriaId+" ' >Descargar" +
										"</a>" +
										"<i aria-hidden='true' class='fa fa-minus'></i>"+
										"<a onclick='nuevaAccionDetalleAuditoria("+index2+")'> Agregar acción  mejora</a>" +
										"<i aria-hidden='true' class='fa fa-minus'></i>" +
											"<a onclick='verCompletarAccioneAuditoria("+index2+")'> Ver  ("+val2.indicadorAcciones+")</a>" +*/
                        "<div class='subOpcionDetalleAccion'>" +
                        "</div>" +
                        "</div>" +
                        "</div>");

            });
            $(".subDetalleAccion ul").hide();
        });
}

function verCompletarEvaluacionesAuditoriaColab(pindex, detalleIndex) {
    pindex = defaultFor(pindex, objAuditoriaGeneral.index);
    var val1 = listFullAuditoriaGeneral[pindex];
    objAuditoriaGeneral = val1;
    objAuditoriaGeneral.index = pindex;
    $(".subOpcionAccion").hide();
    $(".subOpcionAccion").html("");
    var dataParam = {
        auditoriaId: val1.auditoriaId,
        auditoriaTipo: val1.auditoriaTipo
    };
    detalleAuditoriaFull = []
    callAjaxPost(URL + '/auditoria/verificaciones', dataParam,
        function (data1) {
            detalleAuditoriaFull = data1.list;
            var bodyText = "";
            detalleAuditoriaFull.forEach(function (val2, index2) {
                var menuOpcion = "<ul class='list-group' >";
                funcionalidadesDetalleAudi.forEach(function (val, index) {
                    menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionDetalleAuditoria(" + index + ")'>" + val.nombre + " </li>"
                });
                menuOpcion += "</ul>";
                var btnOpcion =
                    "<a class='efectoLink' onclick='toggleMenuOpcionDetalleAudi(this," + index2 + ")'>" +
                    "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
                    "</a>";
                var resultadoText = (val2.bitSi == 1 ? "Cumple" :
                    (val2.bitParc == 1 ? "Cumple Parcialmente" :
                        val2.bitNo ? "No Cumple" : ""));
                var textEvi = " ";
                if (val2.evidenciaNombre == "----") {
                    textEvi = "";
                }
                if (val2.detalleAuditoriaId > 0) {

                }
                var btnAplica = "<a onclick='cambiarAplicaEmpresaEvaluacionInspeccionColab(" + index2 + ",1)'>" +
                    "Aplica evaluación" +
                    "</a>";
                var puntajeDetalle = (val2.bitParc * 0.5 + val2.bitSi * 1 + val2.bitNo * 0)
                var colorAux = "";
                if (val2.bitAplica == 1 && val2.detalleAuditoriaId > 0) {
                    btnAplica = "<a onclick='cambiarAplicaEmpresaEvaluacionInspeccionColab(" + index2 + ",0)'>" +
                        "No aplica evaluación" +
                        "</a>" +
                        "<i class='fa fa-minus'></i>" +
                        "<a onclick='iniciarEvaluacionAuditoriaColaborador(" + index2 + ")'>Evaluar </a>";
                    colorAux = colorPuntajeGosst(puntajeDetalle);
                }

                $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                    .find("#divMovilAuditoria" + listFullAuditoriaGeneral[pindex].auditoriaId + " .subOpcionAccion").show()
                    .append("<div id='subDivMovilDetalleAudi" + val2.detalleAuditoriaId + "'>" +
                        "<div class='subDetalleAccion  gosst-neutral'  style='border-color:" + colorAux + " !important'>" +
                        //btnOpcion+
                        //menuOpcion+
                        "<i class='fa fa-info' aria-hidden='true'></i>" + val2.verificacion + " (" + val2.comentario + " )<br>" +
                        " <strong>" + resultadoText + "</strong><br>" +
                        "<i class='fa fa-file' aria-hidden='true'></i>" + val2.evidenciaNombre +
                        "</div> " +
                        "<div class='opcionesDetalleAccion'>" +
                        "<a target='_blank' href='" + URL + "/auditoria/verificaciones/evidencia?" +
                        "verificacionId=" + val2.verificacionId + "&auditoriaId=" + val1.auditoriaId + " ' >Descargar</a>" +
                        "<i aria-hidden='true' class='fa fa-minus'></i>" +
                        " " + btnAplica + "" +
                        "<i aria-hidden='true' class='fa fa-minus'></i>" +
                        "<a onclick='verCompletarAccioneAuditoriaColaborador(" + index2 + ")'> Ver Acciones(" + val2.indicadorAcciones + ")</a>" +
                        "<div class='subOpcionDetalleAccion'>" +
                        "</div>" +
                        "</div>" +
                        "</div>");
            });
            if (parseInt(detalleIndex) > 0) {
                iniciarEvaluacionAuditoriaColaborador(0);
            }
            $(".subDetalleAccion ul").hide();
        });
}

function iniciarEvaluacionAuditoriaColaborador(evalIndex) {
    var contenidoVal = detalleAuditoriaFull[evalIndex];
    evaluacionInspeccionObj = contenidoVal;
    $(".divListPrincipal>div").hide();
    var listItemsEvalInsp = [
        {
            sugerencia: "", label: "Si"
            , inputForm: "<input onclick='verAcordeRespuesta()' class='form-control' type='radio' " +
                "name='rpta" + contenidoVal.verificacionId + "' " +
                "id='boxRptaSi" + contenidoVal.verificacionId + "' value='1'> ", divContainer: "divPregSi"
        },
        {
            sugerencia: ""
            ,
            inputForm: "<input onclick='verAcordeRespuesta()' class='form-control' type='radio' " +
                "name='rpta" + contenidoVal.verificacionId + "' " +
                "id='boxRptaParc" + contenidoVal.verificacionId + "' value='0.5'> ",
            label: "Parcial",
            divContainer: "divPregParcial"
        },
        {
            sugerencia: "",
            inputForm: "<input onclick='verAcordeRespuesta()' class='form-control' " +
                "type='radio' name='rpta" + contenidoVal.verificacionId + "' " +
                "id='boxRptaNo" + contenidoVal.verificacionId + "' value='0'> ", label: "No", divContainer: "divPregNo"
        },

        {
            sugerencia: "",
            inputForm: "<input class='form-control' type='checkbox' id='checkPotencial" + contenidoVal.verificacionId + "'  > ",
            label: "¿Riesgo Potencial?",
            divContainer: "divPregPotecial"
        },
        //{sugerencia:"" ,label:"Referencia Legal",inputForm:"<input class='form-control' id='inputRefLegalIns"+contenidoVal.verificacionId+"'> ",divContainer:""},
        {
            sugerencia: "",
            label: "Comentario",
            inputForm: "<input class='form-control' id='inputComentarioInsp" + contenidoVal.verificacionId + "'> ",
            divContainer: ""
        },
        {
            sugerencia: ""
            , inputForm: " ", label: "Evidencia", divContainer: "divEvidenciaEvalIns" + contenidoVal.verificacionId
        },
        {
            sugerencia: ""
            , inputForm: "<button type='submit' class='btn btn-success' >" +
                "<i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>", label: "", divContainer: ""
        }

    ];
    var textEval = "";
    listItemsEvalInsp.forEach(function (val, index) {
        textEval += obtenerSubPanelModulo(val);
    });

    var listEditarPrincipal = [
        {
            id: "editarMovilEvalAudiColab", clase: "contenidoFormVisible",
            nombre: "",
            contenido: "<form id='formEditarEvalAudiColab' class='eventoGeneral'>" + textEval + "</form>"
        }
    ];
    $("#editarMovilEvalAudiColab").remove();
    agregarPanelesDivPrincipalColaborador(listEditarPrincipal);
    $("#editarMovilEvalAudiColab").find(".tituloSubList")
        .html(textoBotonVolverContenidoColaborador + "Evaluar " + contenidoVal.verificacion);

    $("#editarMovilEvalAudiColab").show();
    $('#formEditarEvalAudiColab').on('submit', function (e) {
        e.preventDefault();
        guardarEvaluacionAuditoriaProyectoColaborador();
    });

    $("#boxRptaSi" + contenidoVal.verificacionId).prop("checked", (contenidoVal.bitSi == 1))
    $("#boxRptaParc" + contenidoVal.verificacionId).prop("checked", (contenidoVal.bitParc == 1))
    $("#boxRptaNo" + contenidoVal.verificacionId).prop("checked", (contenidoVal.bitNo == 1))
    $("#checkPotencial" + contenidoVal.verificacionId).prop("checked", (contenidoVal.bitRiesgo == 1))
    $("#inputRefLegalIns" + contenidoVal.verificacionId).val(contenidoVal.referenciaLegal);
    $("#inputComentarioInsp" + contenidoVal.verificacionId).val(contenidoVal.comentario);
    var eviNombre = contenidoVal.evidenciaNombre;
    var options =
        {
            container: "#divEvidenciaEvalIns" + contenidoVal.verificacionId,
            functionCall: function () {
            },
            descargaUrl: "/auditoria/verificaciones/evidencia?" +
                "auditoriaId=" + objAuditoriaGeneral.auditoriaId + "&verificacionId" + contenidoVal.verificacionId,
            esNuevo: true,
            idAux: "EvalInspeccion" + contenidoVal.verificacionId,
            evidenciaNombre: eviNombre
        };
    crearFormEvidenciaCompleta(options);
}

function guardarEvaluacionAuditoriaProyectoColaborador() {
    var bitRespuesta = parseFloat($("input[name='rpta" + evaluacionInspeccionObj.verificacionId + "']:checked").val());
    var dataParam = {
        verificacionId: evaluacionInspeccionObj.verificacionId,
        bitAplica: 1,
        bitRiesgo: ($("#checkPotencial" + evaluacionInspeccionObj.verificacionId).prop("checked") ? 1 : 0),
        bitRespuesta: bitRespuesta,
        detalleAuditoriaId: evaluacionInspeccionObj.detalleAuditoriaId,
        referenciaLegal: $("#inputRefLegalIns" + evaluacionInspeccionObj.verificacionId).val(),
        comentario: $("#inputComentarioInsp" + evaluacionInspeccionObj.verificacionId).val(),
        auditoriaId: objAuditoriaGeneral.auditoriaId
    };
    callAjaxPost(URL + '/auditoria/verificaciones/respuesta/save', dataParam,
        function (data) {
            guardarEvidenciaAuto(data.nuevoId, "fileEviEvalInspeccion" + evaluacionInspeccionObj.verificacionId
                , bitsEvidenciaVerificacion, "/auditoria/verificaciones/evidencia/save",
                function (data) {
                    volverDivSubContenido();
                    //verCompletarAuditoriaColabGenral();
                    verCompletarEvaluacionesAuditoriaColab();
                }, "verificacionId");

        });
}

function cambiarAplicaEmpresaEvaluacionInspeccionColab(indexEvalIns, isAplica) {
    var r = true;
    if (isAplica == 0) {
        r = confirm("¿está seguro que esta evaluación no aplica?")
    }
    if (r) {
        var evaluacionInspeccionColabObj = detalleAuditoriaFull[indexEvalIns];
        var dataParam = {
            verificacionId: evaluacionInspeccionColabObj.verificacionId,
            bitAplica: isAplica,
            bitRiesgo: evaluacionInspeccionColabObj.bitRiesgo,
            bitRespuesta: evaluacionInspeccionColabObj.bitRespuesta,

            referenciaLegal: evaluacionInspeccionColabObj.referenciaLegal,
            comentario: evaluacionInspeccionColabObj.comentario,
            auditoriaId: objAuditoriaGeneral.auditoriaId
        };
        callAjaxPost(URL + '/auditoria/verificaciones/respuesta/save', dataParam,
            function (data) {
                verCompletarEvaluacionesAuditoriaColab();
            });
    }
}

function verCompletarAccioneAuditoriaColaborador(pindex) {
    pindex = defaultFor(pindex, objAuditoria.index);
    //
    $(".subOpcionDetalleAccion").html("");
    $(".subOpcionDetalleAccion").hide();

    objDetalleAuditoria = detalleAuditoriaFull[pindex];
    objDetalleAuditoria.id = objDetalleAuditoria.detalleAuditoriaId;
    var audiObj = {
        accionMejoraTipoId: 1,
        detalleAuditoriaId: objDetalleAuditoria.id
    };

    banderaEdicionAccAuditoria = false;
    objAuditoria = {index: pindex};
    objAccAuditoria = {detalleAuditoriaId: objDetalleAuditoria.id};

    callAjaxPost(URL + '/gestionaccionmejora/accionmejora',
        audiObj, function (data) {
            if (data.CODE_RESPONSE == "05") {
                detalleAccAuditoriaFull = data.list;
                detalleAccAuditoriaFull.forEach(function (val, index) {
                    val.id = val.accionMejoraId;
                    val.detalleAuditoriaId = objDetalleAuditoria.id;
                    //
                    var menuOpcion = "<ul class='list-group' >";
                    funcionalidadesAccionMejoraColaborador.forEach(function (val1, index1) {
                        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionAccMejoraColaborador(" + index1 + ")'>" + val1.nombre + " </li>"
                    });
                    menuOpcion += "</ul>"
                    var textResp = "";
                    if (val.respuesta.length > 0) {
                        textResp = iconoGosst.advertir + " " + val.respuesta + "<br>"
                    }
                    var claseAux = "gosst-neutral";
                    if (val.respuesta == "" && val.estadoId == 2) {
                        claseAux = "gosst-aprobado"
                    }
                    $("#proyectoTable" + listFullProyectoSeguridad[indexPostulante].id)
                        .find("#subDivMovilDetalleAudi" + objDetalleAuditoria.id + " .subOpcionDetalleAccion").show()
                        .append("<div class='subDetalleAccion " + claseAux + "' >" +
                            "<button class='btn btn-success' onclick='toggleMenuOpcionAccMejoraColaborador(this," + index + ")'>" +
                            "<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
                            menuOpcion +
                            "<i class='fa fa-info' aria-hidden='true'></i>" + val.descripcion + "<br>" +
                            "<i class='fa fa-clock-o' aria-hidden='true'></i>" + val.fechaRevisionTexto +
                            "<i class='fa fa-file' aria-hidden='true'></i>" + val.evidenciaNombre + "<br>" +
                            textResp +
                            "" +
                            "</div> ");

                });
                $(".subDetalleAccion ul").hide();
            } else {
                console.log("NOPNPO")
            }
        });
}

var listFullTrabajadoresProyectos = [];

function verificarTrabajadorContratistaHabilitado(val){
   var hasExamen=false,hasSctr=false,hasInduccion=false,hasCargo=false,
       hasTreg=false,hasEpp=false,hasInduccionSst=false,hasPruebaCovid=false,
       hasVacunaCovid=false,hasCertificadoPolicial=false,hasHojaVida=false,
       hasSancion=false;

   var textoExamen = iconoGosst.desaprobado+" Sin Certificado de aptitud médica vigente",
       textoSctr = iconoGosst.desaprobado+" Sin SCTR vigente",
       textoInduccion = iconoGosst.desaprobado+" Sin Inducción del cliente vigente",
       textoCargo = iconoGosst.desaprobado+" Sin Cargo de reglamento del cliente vigente",
       textoTreg = iconoGosst.desaprobado+" Sin T-registro vigente",
       textoEpp = iconoGosst.desaprobado+" Sin Equipo de Protección Personal vigente",
       textoInduccionSst = iconoGosst.desaprobado+" Sin Inducciones SST de la contratista vigente",
       textoPruebaCovid = iconoGosst.desaprobado+" Sin Prueba COVID-19 vigente",
       textoVacunaCovid = iconoGosst.desaprobado+" Sin Vacuna COVID-19 vigente",
       textoCertificadoPolicial = iconoGosst.desaprobado+" Sin Certificado policial vigente",
       textoPrevencionista = "No",textoSancion = iconoGosst.aprobado+" Sin sanciones en curso";

   var textoSctrVigilante = ""+textoSctr;
   var textoExamenVigilante = ""+textoExamen;
   var textoInduccionVigilante = ""+textoInduccion;

   if(val.indicadorExamenMedico != null){
      var iconoHelp,obsExam;

      hasExamen = (val.notaExamenMedico == 1?true:false);
      iconoHelp = (val.notaExamenMedico == 1?iconoGosst.aprobado:
         (val.notaExamenMedico == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsExam = (val.notaExamenMedico == 1?"":resaltarObservacionTexto(val.observacionExamenMedico));

      textoExamen = iconoHelp+" Certificado de aptitud médica vigente: <br>"+val.indicadorExamenMedico+obsExam;
      textoExamenVigilante = iconoHelp+" Certificado de aptitud médica vigente: <br>"+val.indicadorExamenMedico+obsExam;
   }

   if(val.indicadorSctr != null){
      var iconoHelp,obsSctr;

      hasSctr = (val.notaSctr == 1?true:false);
      iconoHelp = (val.notaSctr == 1?iconoGosst.aprobado:
         (val.notaSctr == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsSctr = (val.notaSctr == 1?"":resaltarObservacionTexto(val.observacionSctr));

      textoSctr = iconoHelp+" SCTR vigente: <br>"+val.indicadorSctr+obsSctr;
      textoSctrVigilante = iconoHelp+" SCTR vigente: <br>"+val.indicadorSctr+obsSctr;
   }

   if(val.indicadorInduccion != null){
      // tipo_virtual_id = 1 -> Normal, tipo_virtual_id = 2 -> Virtual
      var iconoHelp,obsInduc;

      hasInduccion = (val.notaInduccion == 1?true:false);
      iconoHelp = (val.notaInduccion == 1?iconoGosst.aprobado:
         (val.notaInduccion == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsInduc = (val.notaInduccion == 1?"":resaltarObservacionTexto(val.observacionInduccion));

      textoInduccion = iconoHelp+" Inducción del cliente vigente: <br>"+val.indicadorInduccion+obsInduc;
      textoInduccionVigilante = iconoHelp+" Inducción del cliente vigente: <br>"+val.indicadorInduccion+obsInduc;
   }
//
   if(val.indicadorCargo != null){
      var iconoHelp,obsCargo;

      hasCargo = (val.notaCargo == 1?true:false);
      iconoHelp = (val.notaCargo == 1?iconoGosst.aprobado:
         (val.notaCargo == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsCargo = (val.notaCargo == 1?"":resaltarObservacionTexto(val.observacionCargo));

      textoCargo = iconoHelp+" Cargo de reglamento del cliente vigente: <br>"+val.indicadorCargo+obsCargo;
   }

   if(val.indicadorRegistro != null){
      var iconoHelp,obsReg;

      hasTreg = (val.notaRegistro == 1?true:false);
      iconoHelp = (val.notaRegistro == 1?iconoGosst.aprobado:
         (val.notaRegistro == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsReg = (val.notaRegistro == 1?"":resaltarObservacionTexto(val.observacionRegistro));

      textoTreg = iconoHelp+" T-registro vigente: <br>"+val.indicadorRegistro+obsReg;
   }
   //
   if(val.indicadorEpp != null){
      var iconoHelp,obsEpp;

      hasEpp = (val.notaEpp == 1?true:false);
      iconoHelp = (val.notaEpp == 1?iconoGosst.aprobado:
         (val.notaEpp == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsEpp = (val.notaEpp == 1?"":resaltarObservacionTexto(val.observacionEpp));

      textoEpp = iconoHelp+" EPP vigente: <br>"+val.indicadorEpp+obsEpp;
   }
   //
   var eval4={
      textoEvalShort: iconoGosst.desaprobado+" Sin Hoja de Vida vigente",
      textoEval: iconoGosst.desaprobado+" Sin Hoja de Vida vigente",
      textoFecha: "",textoFechaShort: ""
   };

   if(val.notaHojaVida != null){
      //SOLO tipo_hoja_vida_id = 4
      var iconoHelp,obsHojaVida;
      
      eval4.textoFecha = "";eval4.textoFechaShort = "";

      hasHojaVida = (val.notaHojaVida == 1?true:false);
      iconoHelp = (val.notaHojaVida == 1?iconoGosst.aprobado:
         (val.notaHojaVida == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsHojaVida = (val.notaHojaVida == 1?"":resaltarObservacionTexto(val.observacionHojaVida));

      eval4.textoEval = iconoHelp+" Hoja de vida vigente <br>"+obsHojaVida;
      eval4.textoEvalShort = eval4.textoEval;
   }

   if(val.indicadorInduccionSst != null){
      var iconoHelp,obsInduccionSst;

      hasInduccionSst = (val.notaInduccionSst == 1?true:false);
      iconoHelp = (val.notaInduccionSst == 1?iconoGosst.aprobado:
         (val.notaInduccionSst == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsInduccionSst = (val.notaInduccionSst == 1?"":resaltarObservacionTexto(val.observacionInduccionSst));

      textoInduccionSst = iconoHelp+" Inducción SST de la contratista vigente: " +
         "<br>"+val.indicadorInduccionSst+obsInduccionSst;
   }

   if(val.indicadorPruebaCovid != null){
      var iconoHelp,obsPruebaCovid;

      hasPruebaCovid = (val.notaPruebaCovid == 1?true:false);
      iconoHelp = (val.notaPruebaCovid == 1?iconoGosst.aprobado:
         (val.notaPruebaCovid == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsPruebaCovid = (val.notaPruebaCovid == 1?"":resaltarObservacionTexto(val.observacionPruebaCovid));

      textoPruebaCovid = iconoHelp+" Prueba COVID-19 vigente: <br>"+val.indicadorPruebaCovid+obsPruebaCovid;
   }

   if(val.indicadorVacunaCovid != null){
      var iconoHelp,obsVacunaCovid;

      hasVacunaCovid = (val.notaVacunaCovid == 1?true:false);
      iconoHelp = (val.notaVacunaCovid == 1?iconoGosst.aprobado:
         (val.notaVacunaCovid == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsVacunaCovid = (val.notaVacunaCovid == 1?"":resaltarObservacionTexto(val.observacionVacunaCovid));

      textoVacunaCovid = iconoHelp+" Vacuna COVID-19 vigente: <br>"+val.indicadorVacunaCovid+obsVacunaCovid;
   }

   if(val.indicadorCertificadoPolicial != null){
      var iconoHelp,obsCertificadoPolicial;

      hasCertificadoPolicial = (val.notaCertificadoPolicial == 1?true:false);
      iconoHelp = (val.notaCertificadoPolicial == 1?iconoGosst.aprobado:
         (val.notaCertificadoPolicial == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsCertificadoPolicial = (val.notaCertificadoPolicial == 1?"":resaltarObservacionTexto(val.observacionCertificadoPolicial));

      textoCertificadoPolicial = iconoHelp+" Certificado policial vigente: <br>"+val.indicadorCertificadoPolicial+obsCertificadoPolicial;
   }

   if(val.notaPrevencionista != null){
      var iconoHelp,obsPrevencionista;

      iconoHelp = (val.notaPrevencionista == 1?"Sí":"No");
      obsPrevencionista = (val.notaPrevencionista == 1?"":resaltarObservacionTexto(val.observacionPrevencionista));

      textoPrevencionista = iconoHelp+" <br>"+obsPrevencionista;
   }
   
   if(val.indicadorBlacklist != null){
      var iconoHelp = iconoGosst.desaprobado;

      hasSancion = true;

      textoSancion = iconoHelp+" Sancionado <br><strong>(Hasta "+val.indicadorBlacklist+")</strong>";
   }
   //
   if(parseInt(getSession("isProyectoSimple")) == 1){
      hasTreg = true;
   }

   if(proyectoObj.examenesPermitidosId == null){
      proyectoObj.examenesPermitidosId = "";
   }

   var docsId = proyectoObj.examenesPermitidosId.split(",");

   docsId.forEach(function(val1){
      switch(parseInt(val1)){
         case 6:
            hasExamen = true;
            break;

         case 7:
            hasSctr = true;
            break;

         case 8:
            hasEpp = true;
            break;

         case 9:
            hasInduccion = true;
            break;

         case 11:
            hasCargo = true;
            break;

         case 12:
            hasTreg = true;
            break;

         case 44:
            hasHojaVida = true;
            break;

         case 45:
            hasInduccionSst = true;
            break;

         case 47:
            hasPruebaCovid = true;
            break;

         case 50:
            hasVacunaCovid = true;
            break;

         case 60:
            hasCertificadoPolicial = true;
            break;
      }
   });

   var isHabilitado = false,isHabilitadoContratista = false;

   if(hasExamen && hasSctr && hasEpp && hasInduccion && hasCargo && hasTreg && hasHojaVida &&
      hasInduccionSst && hasPruebaCovid && hasVacunaCovid && hasCertificadoPolicial && !hasSancion){
      isHabilitado = true;isHabilitadoContratista = true;
   }else{
      isHabilitado = false;isHabilitadoContratista = false;
   }

// if(proyectoObj.evaluacionManual == 0){
// }else{
//    isHabilitado = (val.notaManual == 1?true:false);
// }

   return {
      isHabilitado: isHabilitado,isHabilitadoContratista: isHabilitadoContratista,
      textoExamen: textoExamen,textoExamenVigilante: textoExamenVigilante,textoSctr: textoSctr,
      textoSctrVigilante: textoSctrVigilante,textoEpp: textoEpp,textoInduccion: textoInduccion,
      textoInduccionVigilante: textoInduccionVigilante,textoCargo: textoCargo,textoTreg: textoTreg,
      eval4: eval4,textoInduccionSst: textoInduccionSst,textoPruebaCovid: textoPruebaCovid,
      textoVacunaCovid: textoVacunaCovid,textoCertificadoPolicial: textoCertificadoPolicial,
      textoPrevencionista: textoPrevencionista,textoSancion: textoSancion
   }
}

function verCompletarTrabajadoresProyecto() {
    var proyectoObjSend = {
        id: proyectoObj.id,
        contratistaId: proyectoObj.postulante.contratista.id
    };

    callAjaxPost(URL + '/contratista/proyecto/trabajadores',
        proyectoObjSend, procesarResumenTrabajadoresProyecto);
}

function procesarResumenTrabajadoresProyecto(data) {
    resizeDivWrapper("wrapTrabProyecto", 190);

    for (var i = 8; i < 20; i++) {
        mostrarColumna(i, "tblTrabProyecto");
    }

    if (data.CODE_RESPONSE == "05") {
        $("#tblTrabProyecto tbody tr").remove();
        listFullTrabajadoresProyectos = data.list;

        var numTotal = 0, numPositivo = 0;

        listFullTrabajadoresProyectos.forEach(function (val, index) {
            if (val.proyectoActual != null && val.isActivo == 1) {
                var textBton = "";
                var verificacionObj = verificarTrabajadorContratistaHabilitado(val);
                var claseGosst = (verificacionObj.isHabilitado ? "gosst-aprobado" : "gosst-neutral");
                var textHabili = (verificacionObj.isHabilitado ? iconoGosst.aprobado : iconoGosst.desaprobado);
                val.isHabilitado = (verificacionObj.isHabilitado ? 0 : 1);

                var textBton = (proyectoObj.evaluacionManual == 0 ? "" : "<br>" +
                    "<button class='btn btn-success' title='Cambio manual' " +
                    "onclick='cambioManualTrabajadorProyecto(" + index + "," + (val.notaManual == 1 ? 0 : 1) + ")'>" +
                    "<i class='fa fa-refresh fa-2x'></i>" +
                    "</button>");

                var btnConstTrabAltoRiesgo =
                    "<button class='btn btn-success' onclick='verConstanciaTrabAltoRiesgoTrabCon(1," + index + ")' " +
                    "title='Ver el estado asociados según los tipos de certificados.'>" +
                    "<i class='fa fa-eye fa-2x'></i>" +
                    "</button>";

                if (verificacionObj.isHabilitado) {
                    numPositivo++;
                }

                $("#tblTrabProyecto tbody").append(
                    "<tr id='trproy" + val.id + "'>" +
                    "<td class='tdIconoEval' id='asd" + val.id + "'>" + textHabili + textBton + "</td>" +
                    "<td id='asd" + val.id + "'>" + val.nombre + "</td>" +
                    "<td id='asd" + val.id + "'>" + val.apellido + "</td>" +
                    "<td id='asd" + val.id + "'>" + val.area + "</td>" +
                    "<td id='asd" + val.id + "'>" + val.cargo + "</td>" +
                    "<td id='asd" + val.id + "'>" + val.tipoDocumento.nombre + "</td>" +
                    "<td id='asd" + val.id + "'>" + val.nroDocumento + "</td>" +
                    "<td class='linkGosst' onclick='verHistorialExamenesTrabajador(1," + index + ")' id='asd" + val.id + "'>" + verificacionObj.textoExamen + "</td>" +
                    "<td class='linkGosst' onclick='verHistorialExamenesTrabajador(2," + index + ")' id='asd" + val.id + "'>" + verificacionObj.textoSctr + "</td>" +
                    "<td class='linkGosst' onclick='verHistorialExamenesTrabajador(8," + index + ")' id='asd" + val.id + "'>" + verificacionObj.textoEpp + "</td>" +
                    "<td id='asd" + val.id + "'>" + verificacionObj.textoInduccion + "</td>" +
                    "<td class='linkGosst' onclick='verHistorialExamenesTrabajador(4," + index + ")' id='asd" + val.id + "'>" + verificacionObj.textoCargo + "</td>" +
                    "<td class='linkGosst' onclick='verHistorialExamenesTrabajador(6," + index + ")' id='asd" + val.id + "'>" + verificacionObj.textoTreg + "</td>" +
                    "<td class='linkGosst' onclick='verHistorialExamenesTrabajador(23," + index + ")' id='asd" + val.id + "'>" + verificacionObj.textoInduccionSst + "</td>" +
                    "<td class='linkGosst' onclick='verHistorialExamenesTrabajador(25," + index + ")' id='asd" + val.id + "'>" + verificacionObj.textoPruebaCovid + "</td>" +
                    "<td class='linkGosst' onclick='verHistorialExamenesTrabajador(34," + index + ")' id='asd" + val.id + "'>" + verificacionObj.textoVacunaCovid + "</td>" +
                    "<td class='linkGosst' onclick='verHistorialExamenesTrabajador(43," + index + ")' id='asd" + val.id + "'>" + verificacionObj.textoCertificadoPolicial + "</td>" +
                    "<td>" + verificacionObj.eval4.textoEval + "</td>" +
                    "<td id='asd" + val.id + "'>" + btnConstTrabAltoRiesgo + "</td>" +
                    "</tr>");

                numTotal++;
            }
        });

        var docsId = proyectoObj.examenesPermitidosId.split(",");

        docsId.forEach(function (val1) {
            switch (parseInt(val1)) {
                case 6:
                    ocultarColumna(8, "tblTrabProyecto");
                    break;

                case 7:
                    ocultarColumna(9, "tblTrabProyecto");
                    break;

                case 8:
                    ocultarColumna(10, "tblTrabProyecto");
                    break;

                case 9:
                    ocultarColumna(11, "tblTrabProyecto");
                    break;

                case 11:
                    ocultarColumna(12, "tblTrabProyecto");
                    break;

                case 12:
                    ocultarColumna(13, "tblTrabProyecto");
                    break;

                case 19:
                    ocultarColumna(19, "tblTrabProyecto");
                    break;

                case 45:
                    ocultarColumna(14, "tblTrabProyecto");
                    break;

                case 47:
                    ocultarColumna(15, "tblTrabProyecto");
                    break;

                case 50:
                    ocultarColumna(16, "tblTrabProyecto");
                    break;

                case 60:
                    ocultarColumna(17, "tblTrabProyecto");
                    break;

                case 44:
                    ocultarColumna(18, "tblTrabProyecto");
                    break;
            }
        });

        goheadfixedY("#tblTrabProyecto", "#wrapTrabProyecto");
        //
        var buttonDescarga = "<a target='_blank' class='btn btn-success' href='" + URL + "/'>" +
            "<i class='fa fa-download'></i>Descargar" +
            "</a>";

        var buttonClip = "<button type='button' id='btnClipboardTrabProy' style='margin-right:10px' title='Clipboard'" +
            " class='btn btn-success clipGosst' onclick='obtenerTablaTrabajadoresProyecto()'>" +
            "<i class='fa fa-clipboard fa-2x'></i>" +
            "</button>";

        var buttonFiltro = "<button type='button' class='btn btn-success' id='btnIniciarFiltro' style='margin-right:10px'" +
            " onclick='iniciarFiltroTrabProyecto()' title='Ver filtros'>" +
            "<i class='fa fa-filter fa-2x'></i>" +
            "</button>";

        var buttonFiltroAplicar = "<button type='button' class='btn btn-success' id='btnAplicarFiltro' style='margin-right:10px'" +
            " onclick='aplicarFiltroTrabProyecto()' title='Aplicar filtros'>" +
            "<i class='fa fa-filter fa-2x'></i>" +
            "</button>";

        var buttonFiltroRefresh = "<button type='button' class='btn btn-success ' id='btnReiniciarFiltro' title='Refresh' " +
            "style='margin-right:10px' onclick='reiniciarFiltroTrabProyecto()'>" +
            "<i class='fa fa-refresh fa-2x'></i>" +
            "</button>";

        var buttonBuscar = "<input class='form-control' id='buscarTrabProy' placeholder='DNI,nombre o apellido'>" +
            "<button type='button' class='btn btn-success ' style='margin-right:10px' title='Buscar'" +
            " onclick='buscarTrabajadorProyecto()'>" +
            "<i class='fa fa-search fa-2x'></i>" +
            "</button>";

        var btnManual = "<button type='button' class='btn btn-success ' style='margin-right:10px'" +
            " onclick='cambiarEvaluacionManualProyecto(1)' title='Evaluar Manualmente'>" +
            "<i class='fa fa-pencil-square-o fa-2x'></i>" +
            "</button>";

        var btnAuto = "<button type='button' class='btn btn-success ' style='margin-right:10px'" +
            " onclick='cambiarEvaluacionManualProyecto(0)' title='Evaluar automáticamente'>" +
            "<i class='fa fa-check-square-o fa-2x'></i>" +
            "</button>";

        var btnEval = (proyectoObj.evaluacionManual == 1 ? btnAuto : btnManual);

        $("#divTrabProyecto").find("form").remove();
        $("#divTrabProyecto").find(".camposFiltroTabla").remove();

        $("#divTrabProyecto").prepend(
            "<form class='form-inline'>" +
            buttonBuscar + buttonFiltroRefresh + buttonFiltroAplicar + buttonFiltro + btnEval + buttonClip +
            "</form>" +
            "<div class='camposFiltroTabla'>" +
            "<div class='contain-filtro' id='filtroProyTrab'>" +
            "<input type='checkbox' id='checkFiltroProyTrab' checked>" +
            "<label for='checkFiltroProyTrab'>Trabajadores</label>" +
            "<div id='divSelectFiltroProyTrab'></div>" +
            "</div>" +
            "</div>");

        var listOpciones = [
            {id: 1000, nombre: "Habilitado"},
            {id: 0, nombre: "Sin Habilitar"},
            {id: 2, nombre: "Sin SCTR"},
            {id: 1, nombre: "Sin Examen Médico"},
            {id: 3, nombre: "Sin Inducción"},
            {id: 4, nombre: "Sin Cargo"},
            {id: 6, nombre: "Sin T-registro"},
            {id: 8, nombre: "Sin EPP"},
            {id: 100, nombre: "Sin Hoja de Vida"}
        ];

        if (parseInt(getSession("isProyectoSimple")) == 1) {
            listOpciones = [
                {id: 1000, nombre: "Habilitado"},
                {id: 0, nombre: "Sin Habilitar"},
                {id: 2, nombre: "Sin SCTR"},
                {id: 1, nombre: "Sin Examen Médico"},
                {id: 3, nombre: "Sin Inducción"},
                {id: 4, nombre: "Sin Cargo"},
                {id: 8, nombre: "Sin EPP"},
                {id: 100, nombre: "Sin Hoja de Vida"}
            ];
        }

        crearSelectOneMenuObligMultipleCompleto("selMultipleTrabProy", "", listOpciones,
            "id", "nombre", "#divSelectFiltroProyTrab", "Seleccione criterios");

        $(".camposFiltroTabla").hide();
        $("#btnAplicarFiltro").hide();
        $("#buscarTrabProy").focus();

        $("#divTrabProyecto form").on("submit", function (e) {
            e.preventDefault();
            buscarTrabajadorProyecto();
        });
        //
        $("#tabProyectos h2").html(
            "<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo.substring(0, 40) + "...)</a> > " +
            "<br> <label>Trabajadores del Contratista [" + pasarDecimalPorcentaje(numPositivo / numTotal) +
            " (" + numPositivo + " / " + numTotal + ")]</label>");

        $(".tdIconoEval>i").css({"font-size": "30px"});

        if (parseInt(getSession("isProyectoSimple")) == 1) {
            ocultarColumna(11, "tblTrabProyecto");
        }
    } else {
        console.log("NOPNPO")
    }
}

function cambiarEvaluacionManualProyecto(isManual) {
    var proyectoObjSend = {id: proyectoObj.id, evaluacionManual: isManual};
    proyectoObj.evaluacionManual = isManual;
    callAjaxPost(URL + '/contratista/proyecto/evaluacion_manual',
        proyectoObjSend, verCompletarTrabajadoresProyecto);
}

function cambioManualTrabajadorProyecto(indexTrab, isAprobado) {
    var trabObjSend = {
        id: listFullTrabajadoresProyectos[indexTrab].id,
        notaManual: isAprobado, proyectoActual: {id: proyectoObj.id}
    };
    listFullTrabajadoresProyectos[indexTrab].notaManual = isAprobado;
    callAjaxPost(URL + '/contratista/proyecto/trabajador/evaluacion_manual',
        trabObjSend, verCompletarTrabajadoresProyecto);
}

function procesarResumenTrabajadoresProyectoVistaContratista(data){
   if(data.CODE_RESPONSE == "05"){
      $("#tblTrabProyecto tbody tr").remove();
      var numTotal = 0,numPositivo = 0;

      listFullTrabajadoresProyectos = data.list;

      listFullTrabajadoresProyectos.forEach(function (val, index) {
         if(val.proyectoActual != null && val.isActivo == 1) {
//            var verificacionObj = verificarTrabajadorContratistaHabilitado(val);
            var verificacionObj = verificarIndicadorDocNivelTrabajadorContratista(val,proyectoObj);
            var claseGosst = (verificacionObj.isHabilitado?"gosst-aprobado":"gosst-neutral");
            var textHabili = (verificacionObj.isHabilitado?iconoGosst.aprobado:iconoGosst.desaprobado);
            val.isHabilitado = (verificacionObj.isHabilitado?0:1);

            if(verificacionObj.isHabilitado){
               numPositivo++;
            }
            
            var btnFotocheck = (val.evidenciaFotoNombre.length == 0?"<label>*Sin foto del trabajador registrada.</label>":
               "<button class='btn btn-success' onclick='previoGenerarFotocheckCodigoQrTrabajadorContratista("+index+")' " +
                       "title='Descargar el fotocheck del trabajador contratista.'>" +
                  "<i class='fa fa-address-card fa-2x'></i>" +
               "</button>");

            var textoTrabajosAltoRiesgo = (val.textoTrabajosAltoRiesgo.length == 0?"No tiene ninguno asignado.":
        	(val.habilitadoTrabajosAltoRiesgo == 1?iconoGosst.aprobado:iconoGosst.alerta)+" "+val.textoTrabajosAltoRiesgo +
               "<br>" +
   	       "<a class='efectoLink' onclick='verConstanciaTrabAltoRiesgoTrabCon(1,"+index+")' " +
   	          "title='Ver el estado según los trabajos de alto riesgo asignados.'>" +
   	          "<i class='fa fa-eye'></i> Ver estado" +
   	       "</a>");
   		   
            var nombreCompleto = (val.apellido.length == 0 && val.nombre.length == 0?"------":
               ((val.apellido.length == 0?"":val.apellido+", ")+(val.nombre.length == 0?"":val.nombre)));
            
            var textoTrabajosAltoRiesgoHabMedCli = (proyectoObj.habilitadoMedicoClinica == 1 && val.textoTrabajosAltoRiesgoHabMedCli.length > 0?"<br>["+val.textoTrabajosAltoRiesgoHabMedCli+"]":"");

            $("#tblTrabProyecto tbody").append(
               "<tr id='trproy"+val.id+"'>" +
                  "<td class='tdIconoEval' id='asd"+val.id+"'>"+textHabili+"</td>" +
                  "<td id='asd"+val.id+"'>"+btnFotocheck+"</td>" +
                   (proyectoObj.numTrabajosAltoRiesgoTotal == 0 || (proyectoObj.habilitadoConstanciaAltoRiesgo == 0 && proyectoObj.habilitarCargoInduccionTrabAltRie == 0)?"":
                    "<td id='asd"+val.id+"'>"+textoTrabajosAltoRiesgo+"</td>") +
                  "<td id='asd"+val.id+"'>"+nombreCompleto+"</td>" +
                  "<td style='word-break:break-all;'>"+(val.cliente.length == 0?"------":val.cliente)+"</td>" +
//                  "<td id='asd"+val.id+"'>"+val.area+"</td>" +
                  "<td id='asd"+val.id+"'>"+(val.cargo.length == 0?"------":val.cargo)+"</td>" +
                  "<td id='asd"+val.id+"'>"+val.tipoDocumento.nombre+"</td>" +
                  "<td id='asd"+val.id+"'>"+val.nroDocumento+"</td>" +
                   (proyectoObj.habilitarEsConductor == 0?"":"<td>"+(val.esConductor == 1?"Sí":"No")+"</td>") +
                   (proyectoObj.habilitadoEsPrevencionista == 0?"":"<td>"+verificacionObj.textoPrevencionista+"</td>") +
                   (proyectoObj.habilitadoEsPrevencionista == 0 || proyectoObj.habilitadoEntrevistaPrevencionista == 0?"":
                    "<td>"+verificacionObj.textoEntrevistaPrevencionista+"</td>") +
                   (proyectoObj.habilitadoCertAptMedica == 0?"":
     		    "<td>"+verificacionObj.textoExamen+"</td>") +
     	           (proyectoObj.habilitadoSctr == 0?"":
     		    "<td>"+verificacionObj.textoSctr+"</td>") +
     	           (proyectoObj.habilitadoEpp == 0?"":
     	 	    "<td>"+verificacionObj.textoEpp+"</td>") +
     	           (proyectoObj.habilitacionInduccion3 == 0?"":
     		    "<td>"+verificacionObj.textoInduccion+"</td>") +
     	           (proyectoObj.habilitadoCargReglamento == 0?"":
     	 	    "<td>"+verificacionObj.textoCargo+"</td>") +
     	           (proyectoObj.habilitadoTRegistro == 0?"":
     		    "<td>"+verificacionObj.textoTreg+"</td>") +
     	           (proyectoObj.habilitadoInduccSstCont == 0?"":
     		    "<td>"+verificacionObj.textoInduccionSst+"</td>") +
     	           (proyectoObj.habilitadoPruebaCovid == 0?"":
     		    "<td>"+verificacionObj.textoPruebaCovid+"</td>") +
     	           (proyectoObj.habilitadoVacunaCovid == 0?"":
     		    "<td>"+verificacionObj.textoVacunaCovid+"</td>") +
     	           (proyectoObj.habilitadoCertifPolicial == 0?"":
     		    "<td>"+verificacionObj.textoCertificadoPolicial+"</td>") +
     		   (proyectoObj.habilitadoAntecedentesPenales == 0?"":
      		    "<td>"+verificacionObj.textoAntecedentesPenales+"</td>") +
      		   (proyectoObj.habilitadoSeguroAccidentes == 0?"":
      		    "<td>"+verificacionObj.textoSeguroAccidentes+"</td>") +
      		   (proyectoObj.habilitadoRiesgoExposicionPuestoTrabajo == 0?"":
       		    "<td>"+verificacionObj.textoRiesgoExposicionPuestoTrabajo+"</td>") +
       		   (proyectoObj.habilitadoVacunacionCovid == 0?"":
       		    "<td>"+verificacionObj.textoVacunacionCovid+"</td>") +
       		    (proyectoObj.habilitadoCarnetSanidad == 0?"":"<td>"+verificacionObj.textoCarnetSanidad+"</td>") +
                (proyectoObj.habilitadoAcuerdoSeguridadEquElec == 0?"":"<td>"+verificacionObj.textoAcuerdoSeguridadEquElec+"</td>") +
                (proyectoObj.habilitadoEvaluacionToxicologica == 0?"":"<td>"+verificacionObj.textoEvaluacionToxicologica+"</td>") +
                (proyectoObj.habilitadoCertifUnicoLaboral == 0?"":"<td>"+verificacionObj.textoCertifUnicoLaboral+"</td>") +
                (proyectoObj.habilitadoAntecedentesPoliciales == 0?"":"<td>"+verificacionObj.textoAntecedentesPoliciales+"</td>") +
                (proyectoObj.habilitadoDeclaracionVerifDomicilio == 0?"":"<td>"+verificacionObj.textoDeclaracionVerifDomicilio+"</td>") +
                (proyectoObj.habilitadoDotacionIndumentaria == 0?"":"<td>"+verificacionObj.textoDotacionIndumentaria+"</td>") +
                (proyectoObj.habilitadoMedicoClinica == 0?"":"<td>"+verificacionObj.textoHabilitadoMedicoClinica+textoTrabajosAltoRiesgoHabMedCli+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont84 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont84+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont89 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont89+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont90 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont90+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont99 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont99+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont100 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont100+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont101 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont101+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont111 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont111+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont112 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont112+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont113 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont113+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont114 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont114+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont115 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont115+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont116 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont116+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont117 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont117+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont118 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont118+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont119 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont119+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont128 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont128+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont129 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont129+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont130 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont130+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont131 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont131+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont132 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont132+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont133 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont133+"</td>") +
                (proyectoObj.habilitadoExamNivelTrabCont134 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont134+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont140 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont140+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont141 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont141+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont142 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont142+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont143 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont143+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont144 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont144+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont145 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont145+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont146 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont146+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont147 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont147+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont148 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont148+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont149 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont149+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont150 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont150+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont151 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont151+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont152 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont152+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont153 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont153+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont154 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont154+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont155 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont155+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont156 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont156+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont157 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont157+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont158 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont158+"</td>") +
				(proyectoObj.habilitadoExamNivelTrabCont159 == 0?"":"<td>"+verificacionObj.textoExamNivelTrabCont159+"</td>") +
     	        (proyectoObj.habilitadoHojaVida == 0?"":"<td>"+verificacionObj.textoHojaVida+"</td>") +
     		    "<td id='asd"+val.id+"'>"+verificacionObj.textoSancion+"</td>" +
               "</tr>");

            numTotal++;
         }
      });

      $(".divTituloGeneral h4").html("Proyecto '"+proyectoObj.titulo+"' > Contratista "+proyectoObj.contratistaNombre +
         " > Resumen de trabajadores ("+numPositivo+"/"+numTotal+")");
      $(".tdIconoEval i").css({"font-size": "30px"});
   }else{
      console.log("NOPNPO")
   }
}

function volverDivTrabajadoresProyectos() {
    $("#tabProyectos .container-fluid").hide();
    $("#divTrabProyecto").show();
    $("#tabProyectos h2").html("<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo.substring(0, 40) + "...)</a> " +
        "> <br> Trabajadores del Contratista");
}

function verHistorialExamenesTrabajador(tipoId, pindex) {
    var nombreExam = "";

    switch (parseInt(tipoId)) {
        case 1:
            nombreExam = "Certificado aptitud médica";
            break;

        case 2:
            nombreExam = "SCTR";
            break;

        case 8:
            nombreExam = "Equipo de Protección Personal (EPP)";
            break;

        case 4:
            nombreExam = "Cargo reglamento cliente";
            break;

        case 6:
            nombreExam = "T-Registro";
            break;

        case 23:
            nombreExam = "Inducciones SST de la contratista";
            break;

        case 25:
            nombreExam = "Prueba COVID-19";
            break;

        case 34:
            nombreExam = "Vacuna COVID-19";
            break;

        case 43:
            nombreExam = "Certificados policiales";
            break;
    }

    $("#tabProyectos .container-fluid").hide();
    $("#divExamsTrabajador").show();
    $("#tabProyectos h2").html(
        "<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo.substring(0, 20) + "...)</a> " +
        "> <a onclick='volverDivTrabajadoresProyectos()'>Trabajador " + listFullTrabajadoresProyectos[pindex].nombre.substring(0, 20) + "... </a>" +
        "> <br> Historial " + nombreExam);

    var dataParam = {
        id: (proyectoObj.postulante.contratista.id),
        examen: {tipo: {id: tipoId}},
        perfil: {id: null}
    };

    callAjaxPost(URL + '/contratista/examenes', dataParam, function (data) {
        $("#tblExamenTrab tbody tr").remove();

        var trabajadorAuxId = listFullTrabajadoresProyectos[pindex].id;
        var num = 0;

        data.examenes.forEach(function (val, index) {
            if (val.trabajadoresId.indexOf(trabajadorAuxId) != -1) {
                var btnDescarga = (val.evidenciaNombre == ""?"":"<br>" +
                   "<a class='btn btn-success' target='_blank' href='"+urlArchivo(val.evidenciaUrl)+"'>" +
                      "<i class='fa fa-download'></i> Descargar" +
                   "</a>");

                var textoEstilo = "";

                if (num == 0) {
                    textoEstilo = "style='border-left:9px solid #2e9e8f;'";
                    num++;
                }

                var textIn =
                    "<tr>" +
                    "<td " + textoEstilo + ">" + val.fechaTexto + "</td>" +
                    "<td>" + val.fechaFinVigenciaTexto + "</td>" +
                    "<td>" + (val.evidenciaNombre.length == 0 ? "------" :
                        val.evidenciaNombre) + btnDescarga + "</td>" +
                    "<td>" + val.evaluacion.nota.icono + " " + val.evaluacion.nota.nombre + "</td>" +
                    "<td><strong>" + (val.evaluacion.observacion.length == 0 ? "------" :
                        val.evaluacion.observacion) + "</strong></td>" +
                    "<td>" + val.evaluacion.fechaTexto + "<br>" +
                    (val.evaluacion.usuario.nombre == "" ? "" :
                        "*Evaluado por " + val.evaluacion.usuario.nombre) + "</td>" +
                    "</tr>";

                $("#tblExamenTrab tbody").append(textIn);
            }
        });
    });
}

var evaluacionHojaVidaObj;

function verEvaluacionHojaVidaTrabajador(idTipo, pindex) {
    $("#tabProyectos .container-fluid").hide();
    $("#divEvalTrabProyecto").show();
    $("#tabProyectos h2").html(
        "<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo.substring(0, 20) + "...)</a> " +
        "> <a onclick='volverDivTrabajadoresProyectos()' >Trabajador " + listFullTrabajadoresProyectos[pindex].nombre.substring(0, 20) + "... </a>" +
        "> <br> Hoja de Vida ");

    var objTrabajadorContratistaSend = {
        id: listFullTrabajadoresProyectos[pindex].id,
        isSeccionHojaVida: 0
    };

    callAjaxPost(URL + '/contratista/trabajador/hojavidas', objTrabajadorContratistaSend, function (data) {
        if (data.CODE_RESPONSE == "05") {
            $("#tblEvalTrabProy tbody tr").remove();

//         switch(idTipo){
//	    case 1:
//	       evaluacionHojaVidaObj = listFullTrabajadoresProyectos[pindex].evaluacionExperiencia;
//	    break;
//
//	    case 2:
//	       evaluacionHojaVidaObj = listFullTrabajadoresProyectos[pindex].evaluacionFormacion;
//	       break;
//
//	    case 3:
//	       evaluacionHojaVidaObj = listFullTrabajadoresProyectos[pindex].evaluacionAptitud;
//	       break;
//
//	    case 4:
//	       evaluacionHojaVidaObj = listFullTrabajadoresProyectos[pindex].evaluacionHojaVida;
//	       break;
//         }
//
//         $("#btnGuardarEvalHojaVida").attr("onclick","guardarEvaluacionHojaVidaTrabajador("+idTipo+")");
//
//         var selTipoNotaHojaVida = crearSelectOneMenuOblig("selTipoNotaHojaVida","",
//            data.nota,evaluacionHojaVidaObj.tipo.id,"id","nombre");
//
//         $("#divSelTipoNotaHojaVida").html("<label>Evaluación</label>"+selTipoNotaHojaVida)
//         $("#divObsHojaVida").html("<label>Observación</label><input class='form-control' id='obsHojaVidaTrabajador'>")
//         $("#divFechaHojaVida").html("Última vez evaluado: <strong>"+evaluacionHojaVidaObj.fechaTexto+"</strong>")
//         $("#divFechaActualizacionHojaVida").html("Modificado por contratista: <strong>"+evaluacionHojaVidaObj.fechaActualizacionTexto+"</strong>")
//         $("#obsHojaVidaTrabajador").val(evaluacionHojaVidaObj.observacion);

            data.list.forEach(function (val, index) {
                if (val.tipo.id == idTipo) {
                    $("#tblEvalTrabProy tbody").append(
                        "<tr>" +
                        "<td>" + val.tipo.nombre + "</td>" +
                        "<td>" + val.observacion + "</td>" +
                        "<td>" + val.evidenciaNombre + "</td>" +
                        "<td>" + "<a class='btn btn-success' href='" + URL + "/contratista/amazon_s3/examen/hojavida/evidencia?id=" + val.id + "' " +
                        "target='_blank'><i aria-hidden='true' class='fa fa-download'></i>Descargar</a>" + "</td>" +
                        "</tr>");
                }
            });
        }
    });
}

function guardarEvaluacionHojaVidaTrabajador(tipoId) {
    evaluacionHojaVidaObj.observacion = $("#obsHojaVidaTrabajador").val();
    evaluacionHojaVidaObj.tipo.id = $("#selTipoNotaHojaVida").val();
    evaluacionHojaVidaObj.tipoHoja = {id: tipoId};
    callAjaxPost(URL + '/contratista/trabajador/hojavida/evaluacion/save',
        evaluacionHojaVidaObj, function (data) {
            if (data.CODE_RESPONSE == "05") {
                volverDivTrabajadoresProyectos();
                verCompletarTrabajadoresProyecto();
            }
        })

}

function verCompletarActividadesProyecto(tipoId) {
    $("#btnCancelarActProyecto").hide();
    $("#btnNuevoActProyecto").hide();
    $("#btnEliminarActProyecto").hide();
    $("#btnGuardarActProyecto").hide();

    estadoActividadProy = [];

    proyectoObj.tipoActividad = tipoId;

    var dataParam = {
        id: proyectoObj.id,
        tipoActividad: tipoId
    };

    callAjaxPost(URL + '/contratista/proyecto/actividades', dataParam, function (data) {
        if (data.CODE_RESPONSE == "05") {
            $("#tblActProyecto tbody tr").remove();

            data.list.forEach(function (val, index) {
                var textIn = "";

                if (val.tipo.id == tipoId) {
                    textIn =
                        "<td id='actpdesc" + val.id + "'>" + val.categoria.nombre + " " + val.descripcion + "</td>" +
                        "<td id='actpfp" + val.id + "'>" + val.fechaPlanificadaTexto + "</td>" +
                        "<td id='actpfr" + val.id + "'>" + val.fechaRealTexto + "</td>" +
                        "<td id='actpevi" + val.id + "'>" + "" + "</td>" +
                        "<td id='actpes" + val.id + "'>" + val.estado.nombre + "</td>" +
                        "<td id='actpobs" + val.id + "'>" + val.observacion + "</td>";

                    $("#tblActProyecto tbody").append("<tr id='trtip" + val.id + "'>" + textIn + "</tr>");

                    var textEvi = val.evidenciaNombre;

                    if (textEvi.length > 0) {
                        $("#actpevi" + val.id).addClass("linkGosst").on("click", function () {
                            location.href = URL + "/contratista/proyecto/actividad/evidencia?id=" + val.id;
                        }).html("<i class='fa fa-download fa-2x' aria-hidden='true' ></i>" + textEvi);
                    }
                }
            });

            if (tipoId == 1) {
                $('#tblActProyecto td:nth-child(1),#tblActProyecto th:nth-child(1)').show();
                $('#tblActProyecto td:nth-child(2),#tblActProyecto th:nth-child(2)').show();
                $('#tblActProyecto td:nth-child(5),#tblActProyecto th:nth-child(5)').show();
            } else {
                $('#tblActProyecto td:nth-child(1),#tblActProyecto th:nth-child(1)').hide();
                $('#tblActProyecto td:nth-child(2),#tblActProyecto th:nth-child(2)').hide();
                $('#tblActProyecto td:nth-child(5),#tblActProyecto th:nth-child(5)').hide();
            }
        } else {
            console.log("NOPNPO")
        }
    });
}

function verSinEditarCompletarProyecto(pindex) {
    var dataParam = {
        id: listFullProyectoSeguridad[pindex].contratistaId
    };
    //
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleDocumentosProyecto").hide();
//
    indexPostulante = pindex;
    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
        .find(".detalleDocumentosProyecto").toggle()

    callAjaxPost(
        URL + '/contratista/proyecto/postulante/evaluacion',
        dataParam,
        function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    listEvaluacionPostulanteOnline = data.list;
                    $("#tblEvaluacion tbody tr").remove();
                    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                        .find(".detalleDocumentosProyecto").html("<td colspan='3'></td>");
                    listEvaluacionPostulanteOnline.forEach(function (val, index) {

                        var evalId = val.id;
                        var pregunta = val.preguntaNombre;
                        var preguntaId = val.preguntaId;
                        var observacionPostulante = val.observacionPostulante;
                        var eviNombre = (val.evidenciaNombre == "Sin Registrar" ? "Sin Archivo<br>"
                            :
                            "<a class='efectoLink' href='" + URL + "/contratista/proyecto/postulante/evaluacion/evidencia?id=" + val.id + " ' >" +
                            val.evidenciaNombre + "<br>" +
                            "</a>");
                        var observacion = val.observacion;
                        var nota = "";
                        var iconoestado;
                        listCumple.forEach(function (val1, index1) {
                            if (val1.id == val.isAprobado) {
                                nota = val1.nombre;
                                iconoestado = "fa-star";
                            } else {
                                iconoestado = "fa-star-half-o";
                            }
                        });

                        //
                        var claseNotaDocumento = "gosst-neutral";
                        if (val.isAprobado == 1) {
                            claseNotaDocumento = "gosst-aprobado"
                        }
                        $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                            .find(".detalleDocumentosProyecto td")
                            .append("<div class='detalleAccion " + claseNotaDocumento + "'> " +
                                "<div class='row'>" +
                                "<section class='col col-xs-3'>" +
                                "<strong><i class='fa fa-question-circle-o'></i> Pregunta:</strong><br>" +
                                "<strong><i class='fa " + iconoestado + "'></i> Estado:</strong><br>" +
                                "<strong><i class='fa fa-eye'></i> Observación:</strong> <br>" +
                                "<strong><i class='fa fa-download'></i> Evidencia:</strong> " +
                                "</section>" +
                                "<section class='col col-xs-5'>" +
                                pregunta + "<br>" +
                                nota + "<br>" +
                                observacion + "<br>" +
                                eviNombre +
                                "</section>" +
                                "</div>" +
                                "</div>" /*+
						"<div class='opcionesAccion'>" +
						"<a target='_blank' href='"+URL+"/contratista/proyecto/postulante/evaluacion/evidencia?id="+val.id+"'>Descargar </a>" +
						 "</div>"*/);
                        //

                    });
                    break;
                default:
                    alert("Ocurrió un error al cargar el arbol de trabajadores!");
            }
        });
}

function verCompletarProyecto(pindex, hideBoolean) {
    hideBoolean = defaultFor(hideBoolean, true);
    var dataParam = {
        id: listFullProyectoSeguridad[pindex].contratistaId
    };
    //

    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
        .parent(".eventoGeneral").parent(".contenidoSubList")
        .parent(".divProyectoGeneral").siblings()
        .find(".detalleDocumentosProyecto").hide();
//
    indexPostulante = pindex;
    if (hideBoolean) {
        $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
            .find(".detalleDocumentosProyecto").toggle()
    }


    callAjaxPost(
        URL + '/contratista/proyecto/postulante/evaluacion',
        dataParam,
        function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    listEvaluacionPostulanteOnline = data.list;
                    $("#tblEvaluacion tbody tr").remove();
                    $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                        .find(".detalleDocumentosProyecto").html("<td colspan='3'></td>");
                    listEvaluacionPostulanteOnline.forEach(function (val, index) {

                        var evalId = val.id;
                        var pregunta = val.preguntaNombre;
                        var preguntaId = val.preguntaId;
                        var observacionPostulante = val.observacionPostulante;
                        var eviNombre = "(" + val.fechaTexto + ") " + val.evidenciaNombre;
                        var observacion = val.observacion;
                        var nota = " Sin evaluar";
                        var icono = iconoGosst.advertir
                        if (val.isAprobado == 1) {
                            icono = iconoGosst.aprobado;
                        }
                        if (val.isAprobado == 0) {
                            icono = iconoGosst.desaprobado;
                        }
                        if (val.isAprobado != null) {
                            listCumple.forEach(function (val1, index1) {
                                if (val1.id == val.isAprobado) {
                                    nota = val1.nombre;
                                }
                            });
                        }
                        //
                        var claseNotaDocumento = "gosst-neutral";
                        if (val.isAprobado == 1) {
                            claseNotaDocumento = "gosst-aprobado"
                        }
                        $("#proyectoTable" + listFullProyectoSeguridad[pindex].id)
                            .find(".detalleDocumentosProyecto td")
                            .append("<div class='detalleAccion " + claseNotaDocumento + "'> " +
                                "<i aria-hidden='true' class='fa fa-caret-right'></i>" +
                                pregunta + "<br>" +
                                "<i aria-hidden='true' class='fa fa-file'></i>" +
                                eviNombre + "<br>" +
                                "<strong> (" + icono + nota + ")</strong>" + "<br>Observación: " + observacion + "</div>" +
                                "<div class='opcionesAccion'>" +
                                "<a target='_blank' href='" + URL + "/contratista/proyecto/postulante/evaluacion/evidencia?id=" + val.id + "'>Descargar </a>" +
                                "<i class='fa fa-minus' aria-hidden='true'></i>" +
                                "<a onclick='editarEvaluacionPostulanteOnline(" + index + ")'> Editar</a> </div>")
                        //

                    });
                    break;
                default:
                    alert("Ocurrió un error al cargar el arbol de trabajadores!");
            }
        });
}

function editarEvaluacionPostulanteOnline(pindex) {
    $("#editarMovilDocProy").find(".tituloSubList")
        .html(textoBotonVolverContenido + "Editar documento de '"
            + listFullProyectoSeguridad[indexPostulante].titulo + "' ");
    var val = listEvaluacionPostulanteOnline[pindex];
    indexEval = pindex;
    var evalId = val.id;
    //
    $(".divListPrincipal>div").hide();
    $("#editarMovilDocProy").show();
    $("#trMovilItem").html(val.preguntaNombre);

    var eviNombre = val.evidenciaNombre;
    var options =
        {
            container: "#eviDocumento",
            functionCall: function () {
            },
            descargaUrl: "/contratista/proyecto/postulante/evaluacion/evidencia?id=" + evalId,
            esNuevo: false,
            idAux: "DocumentoProy",
            evidenciaNombre: eviNombre
        };
    crearFormEvidenciaCompleta(options);
    //
    var preguntaId = val.preguntaId;
    var observacionPostulante = val.observacionPostulante;

    var observacionInput = "<input id='observacionEval' class='form-control'>";

    $("#trMovilObservacion").html(val.observacion);
    $("#observacionEval").val(observacionPostulante)

}

function volverPostulanteEvaluacionOnline() {
    verCompletarProyecto(indexPostulante)
}

function guardarPostulanteEvaluacionOnline(functionCallBack) {
    var observacion = $("#observacionEval").val();
    var actual = listEvaluacionPostulanteOnline[indexEval];
    var dataParam = {
        observacion: actual.observacion,
        observacionPostulante: observacion,
        isAprobado: actual.isAprobado,
        preguntaId: actual.preguntaId,
        postulanteId: listFullProyectoSeguridad[indexPostulante].contratistaId,
        id: actual.id
    };

    callAjaxPost(URL + '/contratista/proyecto/postulante/evaluacion/save', dataParam,
        function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    guardarEvidenciaAuto(data.idNuevo, "fileEviDocumentoProy",
                        bitsEvidenciaHallazgo, "/contratista/proyecto/postulante/evaluacion/evidencia/save", function () {
                            volverDivSubContenido();
                            verCompletarProyecto(indexPostulante, false);

                            if (functionCallBack != null) {
                                functionCallBack();
                            }
                        });
                    break;
                default:
                    console.log("Ocurrió un error al guardar el postulante!");
            }
        }, null, null, null, null, false);
}

function volverDivProyectos() {
    $("#tabProyectos .container-fluid").hide();
    $("#divProyectosFull").show();
    $("#tabProyectos h2").html("Proyectos");
    $("#divConfigImpacto").hide();
    $("#divListClasif").hide();

    $("#tblObservacion tbody tr").remove();
    $("#tblAccObservacion tbody tr").remove();

    if (hasEvalActualizadaProy == 1 || hasDocEliminadoProy == 1) {
        cargarProyectosSeguridad();
    }
}

function editarProyecto(pindex){
   if(!banderaEdicion4){
      formatoCeldaSombreableTabla(false,"tblProyectos");
      
      proyectoObj = (busquedaActivaPrincipalProySeg == 0?listFullProyectoSeguridad[pindex]:listFullProyectoSeguridadBuscador[pindex]);
      ProyectoId = proyectoObj.id;
      
      $("#trprogen"+ProyectoId).addClass("fila-edicion");

      verTrabajadoresInformadosProyecto();

      var slcResponsableProy = crearSelectOneMenu("slcResponsableProy","",listResponsableProy,
	  proyectoObj.responsable.id,"id","nombre");

      $("#divProyectosFull #btnConsolidadoInspecc").attr("onclick",
         "javascript:consolExcelHallazgosLibres("+getSession("gestopcompanyid")+","+ProyectoId+","+94+");");
      $("#divProyectosFull #btnConsolidadoInspecc").show();

      var titulo = proyectoObj.titulo;
      var descripcion = proyectoObj.descripcion;
      var fechaInicio = proyectoObj.fechaInicio;
      var fechaFin = proyectoObj.fechaFin;
      var respSst = proyectoObj.responsableSST;
      var respSstCorreo = proyectoObj.responsableCorreo;

      var selAreaProyecto = crearSelectOneMenuOblig("selAreaProyecto","",listAreaProyecto,
	  proyectoObj.area.id,"id","nombre");

      $("#proyarea"+ProyectoId).html(selAreaProyecto);
///
      $("#proytit"+ProyectoId).html("<input type='text' id='inputProyectoTitulo' class='form-control'>");
      $("#inputProyectoTitulo").val(titulo);

      $("#proydesc"+ProyectoId).html("<input type='text' id='inputProyectoDesc' class='form-control'>");
      $("#inputProyectoDesc").val(descripcion);

      $("#proyrp"+ProyectoId).html(slcResponsableProy);
//
      var respSec = proyectoObj.responsablesSecundariosId.split(",");

      listResponsableProy.forEach(function(val){
         val.selected = 0;
            
         respSec.forEach(function(val1){
            if(parseInt(val1) == val.id){
               val.selected = 1;
            }
         });
      });

      var slcTrabajadoresProyecto = crearSelectOneMenuObligMultipleCompleto("slcRespSecundarios","",
         listResponsableProy,"id","nombre","#proyresp"+ProyectoId,"Secundarios...");
//
      $("#proyfecinicio"+ProyectoId)
      .html("<input type='date' id='inputProyectoInicio' style='width:170px' onchange='hallarEstadoProyecto()' class='form-control'>");
        
      var today2 = convertirFechaInput(fechaInicio);
      $("#inputProyectoInicio").val(today2);

      $("#proyfecfin"+ProyectoId)
      .html("<input type='date' id='inputProyectoFin' style='width:170px' onchange='hallarEstadoProyecto()' class='form-control'>");
        
      var today1 = convertirFechaInput(fechaFin);
      $("#inputProyectoFin").val(today1);

        // $("#proycontra"+ProyectoId).addClass("linkGosst").on("click",function(){
        //     verPostulantesProyecto();
        // }).html("<i class='fa fa-list fa-2x' aria-hidden='true'></i> "+proyectoObj.contratistaNombre);
      
      $("#proyrs"+ProyectoId).html("<input type='text' id='inputProyectoRespSst' class='form-control'>");
      $("#inputProyectoRespSst").val(respSst);

      $("#proyrsc"+ProyectoId).html("<input type='text' id='inputProyectoRespCorreo' class='form-control'>");
      $("#inputProyectoRespCorreo").val(respSstCorreo);

	  if(empresaConfigProyAux.snEditarPerfProyAuto == 1){
		  var slcPerfilEspecialProy = crearSelectOneMenu("slcPerfilEspecialProy","",listPerfilesProyecto,
		      proyectoObj.perfilEspecial.id,"id","nombre","Sin asignar");
				 
		  $("#proyPerfEsp"+ProyectoId).html(slcPerfilEspecialProy);
	  }
        
//      if(proyectoObj.contratistaNombre != "------"){
//         if(proyectoObj.incidentesTotal != -1){
//            var textIncidente = $("#proyinc"+ProyectoId).html();
//
//            $("#proyinc"+ProyectoId).addClass("linkGosst")
//            .on("click",function(){
//               verResumenIncidentesAuditoria();
//            }).html("<i class='fa fa-warning fa-2x' aria-hidden='true'></i> "+textIncidente);
//         }
//
//         if(proyectoObj.observaciones != -1){
//            var textObs = $("#proyobs"+ProyectoId).html();
//
//            $("#proyobs"+ProyectoId).addClass("linkGosst")
//            .on("click",function(){
//               verObservaciones(0,0);
//            }).html("<i class='fa fa-eye fa-2x' aria-hidden='true'></i> "+textObs);
//         }
//
//         if(proyectoObj.observacionesContratista != -1){
//            var textObs = $("#proyobsctr"+ProyectoId).html();
//
//            $("#proyobsctr"+ProyectoId).addClass("linkGosst")
//            .on("click",function(){
//               verObservaciones(1,0);
//            }).html("<i class='fa fa-eye fa-2x' aria-hidden='true'></i> "+textObs);
//         }
//      }
      
      hallarEstadoProyecto();
      
        crearCheckListGeneral("","Lugares de trabajo","LugaresTrabProy",
            listTipoLugaresTrabajoProy,"LugaresTrabajoProyecto",cargarCheckListLugaresTrabajoProyecto);
        
        crearCheckListGeneral("","Turnos","TurnosTrabProy",
            listTurnosAnProy,"TurnosTrabajoProyecto",cargarCheckListTurnosTrabajoProyecto);
        
        $("#proyOrdenCompra"+ProyectoId).html("<input id='inputOrdenCompraProy' type='text' class='form-control'>");
        $("#inputOrdenCompraProy").val(proyectoObj.ordenCompra);
		
		$("#proyFechaAct"+ProyectoId).html("<label>*Automático.</label>");
      
      banderaEdicion4 = true;
      
      $("#btnResetFiltroProy").hide();$("#btnVerFiltroProy").hide();$("#btnResumenUnidadAudiProyecto").hide();
      $("#btnResumenUnidadDetalAudiProyecto").hide();$("#btnResumenAudiProyecto").hide();$("#btnCancelarProyecto").show();
      $("#btnNuevoProyecto").hide();$("#btnEliminarProyecto").show();$("#btnGuardarProyecto").show();
      $("#btnResObsProy").show();$("#btnGenReporte").hide();$("#btnVerIndicadoresProyecto").hide();
      $("#valBuscarProyectoRegistroCampos").hide();$("#btnBuscarProy").hide();$("#btnAudiSinAsignar").hide();
      $("#btnClipboardProy").hide();$("#btnVerCorreosProyecto").hide();$("#btnListaConsolidadoExcelProy").hide();
      $("#btnEvaluacionTotalProyecto").show();$("#btnActualizarNumDocProyecto").hide();$("#btnSolicitudRegProy").hide();
      $("#btnValorCampoPersonalizadoProy").hide();$("#indicadorPaginaParcialAuxPrincipalProySeg").hide();
      $("#btnVerQuicksightInforContTotal").hide();
    }
}

function ocultarCheckListLugaresTrabajoProyecto(){
    var textLugarTrabProyAsig = "";

    listTipoLugaresTrabajoProy.forEach(function(val,index){
        var isHabilitado = ($("#checkAsignadoLugaresTrabProy"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textLugarTrabProyAsig += (textLugarTrabProyAsig.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textLugarTrabProyAsig = (textLugarTrabProyAsig.length == 0?"------":textLugarTrabProyAsig);
    textLugarTrabProyAsig = (textLugarTrabProyAsig.length >= 1000?textLugarTrabProyAsig.substring(0,1000)+"...":textLugarTrabProyAsig);

    $("#proyTipoLugTrab"+ProyectoId).addClass("linkGosst").on("click",function(){
        verCheckListLugaresTrabajoProyecto();
    }).html(textLugarTrabProyAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListLugaresTrabProy").modal("hide");
}

function verCheckListLugaresTrabajoProyecto(){
    if(listTipoLugaresTrabajoProy.length > 0){
        $("#modalCheckListLugaresTrabProy").modal("show");
    }else{
	mensajeUx="<label>No hay valores registrados para seleccionar en 'Lugar(es) de trabajo'.<label>";
        mensajesUx(mensajeUx,2,"","");
    }
}

function cargarCheckListLugaresTrabajoProyecto(){
    if(proyectoObj.tipoLugaresTrabajoAsignadosId.length != 0){
        var tipoLugaresTrabajoAsignadosIdAux = proyectoObj.tipoLugaresTrabajoAsignadosId.split(",");

        tipoLugaresTrabajoAsignadosIdAux.forEach(function(val1){
            var checkboxtipLugTrabAsig = document.getElementById('checkAsignadoLugaresTrabProy'+val1);
            
            if(checkboxtipLugTrabAsig != null){
        	checkboxtipLugTrabAsig.checked = true;
            }
        });
    }

    ocultarCheckListLugaresTrabajoProyecto();
}

function ocultarCheckListTurnosTrabajoProyecto(){
    var textTurnoTrabProyAsig = "";

    listTurnosAnProy.forEach(function(val,index){
        var isHabilitado = ($("#checkAsignadoTurnosTrabProy"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textTurnoTrabProyAsig += (textTurnoTrabProyAsig.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textTurnoTrabProyAsig = (textTurnoTrabProyAsig.length == 0?"------":textTurnoTrabProyAsig);
    textTurnoTrabProyAsig = (textTurnoTrabProyAsig.length >= 1000?textTurnoTrabProyAsig.substring(0,1000)+"...":textTurnoTrabProyAsig);

    $("#proyTurnoAn"+ProyectoId).addClass("linkGosst").on("click",function(){
        verCheckListTurnosTrabajoProyecto();
    }).html(textTurnoTrabProyAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListTurnosTrabProy").modal("hide");
}

function verCheckListTurnosTrabajoProyecto(){
    $("#modalCheckListTurnosTrabProy").modal("show");
}

function cargarCheckListTurnosTrabajoProyecto(){
    if(proyectoObj.turnosAnAsignadosId.length != 0){
        var turnosAnAsignadosIdAux = proyectoObj.turnosAnAsignadosId.split(",");

        turnosAnAsignadosIdAux.forEach(function(val1){
            var checkboxTurAnAsig = document.getElementById('checkAsignadoTurnosTrabProy'+val1);
            
            if(checkboxTurAnAsig != null){
        	checkboxTurAnAsig.checked = true;
            }
        });
    }

    ocultarCheckListTurnosTrabajoProyecto();
}

function verTablaResumenObservacionProyecto() {
    $("#tabProyectos .container-fluid").hide();
    $("#divResObsProy").show();
    $("#tabProyectos h2").html(
        "<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo + ")</a> > Resumen de observaciones");
//
    $(".camposFiltroTabla").show();

    crearSelectOneMenuObligMultipleCompleto("selMultipleObsProy", "", selEstadoObs, "id", "nombre",
        "#divSelectFiltroObs", "Seleccione estados");

    $(".camposFiltroTabla").hide();
    $("#btnAplicarFiltro").hide();

    $("#divObsProyTabla form").on("submit", function (e) {
        e.preventDefault();
    });

    resizeDivWrapper("wrapperObsProy", 300);

    var proyectoObjSend = {
        id: proyectoObj.id
    };

    callAjaxPost(URL + '/contratista/proyecto/observaciones', proyectoObjSend,
        procesarResumenobservacionesProyectoVistaContratista);
}

function verActividadesProyecto(tipoId) {
    $("#tabProyectos .container-fluid").hide();
    $("#divActProyecto").show();

    var nombreTipoActividad = "";

    switch (tipoId) {
        case 1:
            nombreTipoActividad = listTipoActividades[0].nombre;
            break;

        case 2:
            nombreTipoActividad = "Plan de emergencia";
            break;

        case 3:
            nombreTipoActividad = "Programa";
            break;

        case 4:
            nombreTipoActividad = "Plan de manejo de residuos";
            break;

        case 5:
            nombreTipoActividad = listTipoActividades[3].nombre;
            break;

        case 6:
            nombreTipoActividad = listTipoActividades[4].nombre;
            break;

        case 7:
            nombreTipoActividad = "Matriz de riesgos (Documentos)";
            break;
    }

    $("#tabProyectos h2").html("<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo + ")</a> > " + nombreTipoActividad + "");

    verCompletarActividadesProyecto(tipoId);
    //cargarActProyectosSeguridad();
}

function verTrabajadoresProyecto() {
    $("#tabProyectos .container-fluid").hide();
    $("#divTrabProyecto").show();
    $("#tabProyectos h2").html(
        "<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo.substring(0, 40) + "...)</a> " +
        "<br> > Trabajadores del Contratista");

    verCompletarTrabajadoresProyecto();
}

var listFormacionProyecto;

function verFormacionesProyecto() {
    $("#btnGuardarCapProy").attr("onclick", "guardarFormacionesProyecto()");
    $("#tabProyectos .container-fluid").hide();
    $("#divCapProyecto").show();
    $("#tabProyectos h2").html("<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo + ")</a> > Capacitaciones");

    listFormacionProyecto = [];
    llamarFormacionesProyecto();
}

function llamarFormacionesProyecto() {
    var dataParam = {
        id: ProyectoId,
        empresaId: getSession("gestopcompanyid")
    };

    callAjaxPost(URL + '/contratista/proyecto/formaciones', dataParam, function (data) {
        listFormacionProyecto = data.list;
        $("#tblFormProy tbody").html("");

        listFormacionProyecto.forEach(function (val, index) {
            var isAsignado = (val.isAsociado == 1 ? "checked" : "");

            if (val.contratistaAsociado == null) {
                val.contratistaAsociado = {
                    nombre: "",
                    isAprobado: 0
                };
            }

            var numVigentes = (val.contratistaAsociado.isAprobado == 1 ? "Aprobado" : "");

            $("#tblFormProy tbody").append(
                "<tr>" +
                "<td>" + val.capacitacionNombre + "</td>" +
                "<td>" + "<input id='formProy" + val.capacitacionId + "' class='form-control' type='checkbox' " + isAsignado + ">" + "</td>" +
                "</tr>");
        });
    });
}

function volverFormacionesProyecto() {
    $("#tabProyectos .container-fluid").hide();
    $("#divCapProyecto").show();
    $("#tabProyectos h2").html("<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo + ")</a>" +
        "> Formaciones");
}

function verCursosProyecto() {
    $("#btnGuardarCursoProy").attr("onclick", "guardarCursosProyecto()");
    $("#tabProyectos .container-fluid").hide();
    $("#divCursoProyecto").show();
    $("#tabProyectos h2").html("<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo + ")</a> " +
        "> Extensión de Capacitaciones Online a Trabajadores");

    listCursosProyectos = [];
    llamarCursosProyecto();
}

function llamarCursosProyecto() {
    var dataParam = {
        id: ProyectoId
    };

    callAjaxPost(URL + '/contratista/proyecto/cursos/evaluaciones', dataParam, function (data) {
        listCursosProyectos = data.list;
        $("#tblCursoProy tbody").html("");

        listCursosProyectos.forEach(function (val, index) {
            var textoBoton =
                "<button class='btn btn-danger' style='padding:5px' onclick='eliminarCursoProyecto(" + val.id + ")'>" +
                "<i class='fa fa-times' aria-hidden='true'></i>" +
                "</button>";

            var textoBotonConfirm =
                "<button class='btn btn-success' style='padding:5px' onclick='verConfirmacionesEvaluacionAdministrador(" + index + ")'>" +
                "<i class='fa fa-external-link-square' aria-hidden='true'></i>" +
                "</button>";

            $("#tblCursoProy tbody").append(
                "<tr>" +
                "<td>" + val.cursoNombre + "</td>" +
                "<td>" + val.fechaRealizadaTexto + "</td>" +
                "<td>" + val.evaluacionNombre + "</td>" +
                "<td>" + val.confirmacionEvaluacionTotal + textoBotonConfirm + "</td>" +
                "<td>" + textoBoton + "</td>" +
                "</tr>");
        });
    });
}

function eliminarCursoProyecto(evaltrabajadorId) {
    var r = confirm("¿Seguro de eliminar esta evaluación?");

    if (r) {
        var trabObj = {id: evaltrabajadorId};

        callAjaxPostNoLoad(URL + '/capacitacion/curso/trabajadores/evaluacion/delete', trabObj, function (data) {
            llamarCursosProyecto();
        });
    }
}

var listConfirmacionCursosProyectos = [];
var evalObj = {}

function verConfirmacionesEvaluacionAdministrador(pindex) {
    evalObj = listCursosProyectos[pindex];
    $("#tabProyectos .container-fluid").hide();
    $("#divConfirmacionCursoProyecto").show();
    $("#tabProyectos h2").html("<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo + ")</a> " +
        "><a onclick='verCursosProyecto()'>Formación (" + listCursosProyectos[pindex].cursoNombre + ") </a>" +
        "> Extensión");

    listConfirmacionCursosProyectos = [];
    llamarConfirmacionCursosProyecto();
}

function llamarConfirmacionCursosProyecto() {
    var audiObj = {
        id: evalObj.id
    };
    callAjaxPost(URL + '/capacitacion/curso/evaluacion/confirmaciones',
        audiObj, function (data) {
            if (data.CODE_RESPONSE == "05") {
                $("#tblConfirmacion tbody tr").remove();

                data.list.forEach(function (val, index) {
                    var textoBoton = "<button class='btn btn-danger' style='padding:5px' " +
                        "onclick='eliminarConfirmacionDirectaCursoProyecto(" + val.id + ")'>" +
                        "<i class='fa fa-times' aria-hidden='true'></i></button>";
                    var iconoDescarga =
                        "<a href='" + URL + "/capacitacion/curso/evaluacion/confirmacion/evidencia?id=" + val.id + "'>" +
                        "<i class='fa fa-download fa-2x' aria-hidden='true'></i></a>";
                    if (val.evidenciaNombre == "") {
                        iconoDescarga = "";
                    }
                    $("#tblConfirmacion tbody").append(
                        "<tr id='trtip" + val.id + "' >" +
                        "<td >" + val.fechaPlanificadaTexto + "</td>" +
                        "<td >" + val.fechaRealTexto + "</td>" +
                        "<td >" + val.evidenciaNombre + iconoDescarga + "</td>" +
                        "<td >" + val.estado.nombre + "</td>" +
                        "<td >" + textoBoton + "</td>" +


                        "</tr>");
                });
            } else {
                console.log("NOPNPO")
            }
        });
}

function eliminarConfirmacionDirectaCursoProyecto(pid) {
    var r = confirm("¿Está seguro de eliminar la extensión?");
    if (r == true) {
        var dataParam = {
            id: pid
        };

        callAjaxPost(URL + '/capacitacion/curso/evaluacion/confirmacion/delete',
            dataParam, llamarConfirmacionCursosProyecto);
    }
}

function verEvaluacionProyectoFormaciones(pindex) {
    var dataParam = {
        capacitacionId: listFormacionProyecto[pindex].capacitacionId,
        proyecto: {id: ProyectoId}
    };
    var vigAux = [], asigAux = [];
    callAjaxPost(
        URL + '/capacitacion/contratistas/formacion',
        dataParam, function (data) {
            if (data.CODE_RESPONSE == "05") {
                var contratistasPermitidos = listFormacionProyecto[pindex].contratistas;
                var idPermitido = listarStringsDesdeArray(contratistasPermitidos, "id");
                var contratistasEvaluados = data.contratistasEvaluados;
                contratistasEvaluados = contratistasEvaluados.filter(function (val, index) {
                    if (idPermitido.indexOf(val.contratista.id) != -1) {
                        return true;
                    } else {
                        return false;
                    }
                });

                $("#tabProyectos h2").html("<a onclick='volverDivProyectos()'>Proyecto (" + proyectoObj.titulo + ")</a>" +
                    "> <a onclick='volverFormacionesProyecto()'>Formación (" + listFormacionProyecto[pindex].capacitacionNombre + ") </a>" +
                    "> Evaluaciones");

                $("#tabProyectos .container-fluid").hide();
                $("#divEvalFormacionProy").show();

                $("#tblEvalFormacion tbody tr").remove();
                vigAux = [];
                asigAux = [];
                contratistasPermitidos.forEach(function (val, index) {
                    $("#tblEvalFormacion tbody").append("" +

                        "<tr id='ft" + val.id + "'>" +

                        "<td>" + val.nombre + "</td>" +
                        "<td>" + "---" + "</td>" +
                        "<td>" + "---" + "</td>" +
                        "</tr>");
                    $("#ft" + val.id + " td").css({
                        "background-color": "white"
                    })
                });
                contratistasEvaluados.forEach(function (val, index) {
                    $("#ft" + val.contratista.id).remove();
                    $("#tblEvalFormacion tbody").prepend("" +

                        "<tr id='ft" + val.contratista.id + "'>" +

                        "<td>" + val.contratista.nombre + "</td>" +
                        "<td>" + val.resultadoUltimo + " -" + val.estadoEvaluacion.nombre + "</td>" +
                        "<td>" + val.diasRestantes + "</td>" +
                        "</tr>");
                    var colorNota = "";
                    if (val.estadoEvaluacion.id == 1) {
                        colorNota = "#9BBB59";
                    } else {
                        colorNota = "#C0504D";
                    }
                    $("#ft" + val.contratista.id + " td").css({
                        "background-color": colorNota
                    })

                });
            } else {
                console.log("NOP")
            }
        })
}

function guardarFormacionesProyecto() {
    listFormacionProyecto.forEach(function (val, index) {
        val.proyecto = {};

        if ($("#formProy" + val.capacitacionId).prop("checked")) {
            val.proyecto.id = ProyectoId;
            val.isAsociado = 1;
        } else {
            val.proyecto.id = ProyectoId;
            val.isAsociado = 0;
        }
    });

    callAjaxPost(URL + '/contratista/proyecto/formaciones/save', listFormacionProyecto, function (data) {
        mensajeUx = "<label>Asignaciones guardadas con éxito.</label>";
        mensajesUx(mensajeUx, 1, "", "ActualizarModContratista");

        $("#modalMensajeUxActualizarModContratista").on("hidden.bs.modal", function () {
            volverDivProyectos();
        });
    }, null);
}

function nuevoProyecto(){
   if(!banderaEdicion4){
      ProyectoId = 0;

      var slcResponsableProy = crearSelectOneMenuOblig("slcResponsableProy","",
         listResponsableProy,"-1","id","nombre");
      
      // var slcTiposEval = crearSelectOneMenuOblig("slcTiposEval","",
      //    listTipoEvaluacion,"","id","nombre");
      //
      var selAreaProyecto = crearSelectOneMenuOblig("selAreaProyecto","",
         listAreaProyecto,"","id","nombre");
      //
      var slcPerfilEspecialProy = crearSelectOneMenu("slcPerfilEspecialProy","",listPerfilesProyecto,
         -1,"id","nombre","Sin asignar");
      
        $("#tblProyectos:first tbody").prepend(
            "<tr id='0'>" +
                "<td><label>*Automático.</label></td>" +
                "<td><input type='text' id='inputProyectoTitulo' class='form-control'>" +
                    "<label>*Obligatorio</label></td>" +
                "<td><input type='text' id='inputProyectoDesc' class='form-control'>" +
                    "<label>*Obligatorio</label></td>" +
                "<td>"+"<input class='form-control' type='text' id='inputProyectoContratista'>" +
                       "<div id='divAutoCompletarProyectoContratista'></div>" +
                       "<label>*Buscar contratista por RUC y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>" +"</td>" +
            "<td>"+slcPerfilEspecialProy+"</td>" +
            "<td><label>*Automático.</label></td>" +
            "<td>"+slcResponsableProy+"</td>" +
            "<td id='proyresp0'></td>" +
            "<td id='proytrinf0'></td>" +
            "<td>"+selAreaProyecto+"</td>" +
            "<td><input type='date' id='inputProyectoInicio' onchange='hallarEstadoProyecto()' class='form-control'>" +
            "<label>*Obligatorio</label></td>" +
            "<td><input type='date' id='inputProyectoFin' onchange='hallarEstadoProyecto()' class='form-control'>" +
            "<label>*Obligatorio</label></td>" +
            "<td id='proyTipoLugTrab"+ProyectoId+"'>...</td>" +
            "<td id='proyTurnoAn"+ProyectoId+"'>...</td>" +
            "<td>"+"<input id='inputOrdenCompraProy' type='text' class='form-control'>"+"</td>" +
            // "<td>"+slcTiposEval+"</td>" +
            "<td>...</td>" +
            "<td>...</td>" +
            "<td>...</td>" +
            "<td>...</td>" +
            "<td>...</td>" +
            "<td id='proyestado0'>...</td>" +
			"<td><label>*Automático.</label></td>" +
			"<td>...</td>" +
         "</tr>");

      listResponsableProy.forEach(function(val){
         val.selected = 0;
      });

      var slcTrabajadoresProyecto = crearSelectOneMenuObligMultipleCompleto("slcRespSecundarios","",
         listResponsableProy,"id","nombre","#proyresp"+ProyectoId,"Secundarios...");
      
        crearCheckListGeneral("","Lugares de trabajo","LugaresTrabProy",
	    listTipoLugaresTrabajoProy,"LugaresTrabajoProyecto",ocultarCheckListLugaresTrabajoProyecto);
	        
	crearCheckListGeneral("","Turnos","TurnosTrabProy",
	    listTurnosAnProy,"TurnosTrabajoProyecto",ocultarCheckListTurnosTrabajoProyecto);

      $("#btnCancelarProyecto").show();$("#btnNuevoProyecto").hide();$("#btnEliminarProyecto").hide();
      $("#btnGuardarProyecto").show();$("#btnGenReporte").hide();$("#btnResumenUnidadAudiProyecto").hide();
      $("#btnResumenUnidadDetalAudiProyecto").hide();$("#btnResumenAudiProyecto").hide();$("#btnResObsProy").hide();
      $("#btnResetFiltroProy").hide();$("#btnVerFiltroProy").hide();$("#btnVerIndicadoresProyecto").hide();
      $("#btnClipboardProy").hide();$("#btnVerCorreosProyecto").hide();$("#btnAudiSinAsignar").hide();
      $("#valBuscarProyectoRegistroCampos").hide();$("#btnBuscarProy").hide();$("#btnListaConsolidadoExcelProy").hide();
      $("#btnEvaluacionTotalProyecto").hide();$("#btnActualizarNumDocProyecto").hide();$("#btnSolicitudRegProy").hide();
      $("#btnValorCampoPersonalizadoProy").hide();$("#indicadorPaginaParcialAuxPrincipalProySeg").hide();
      $("#btnVerQuicksightInforContTotal").hide();
      
      verTrabajadoresInformadosProyecto();verAutoCompletarProyectoContratista();
      banderaEdicion4 = true;
      formatoCeldaSombreableTabla(false,"tblProyectos");
   }else{
      alert("Guarde primero.");
   }
}

var listProyectoContratistasAux = [];

function verAutoCompletarProyectoContratista(){
    var contratista = $("#inputProyectoContratista").val().trim();

    if(contratista.length >= 3){
        var dataParam={
            nombre:"%"+contratista+"%",isBuscador:1,empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostNoLoad(URL+"/contratista/buscar",dataParam,function(data){
            listProyectoContratistasAux = (data.contratistas.length == 0?[{id:-1,nombre:"Sin asignar"}]:data.contratistas);

            var selAutoProyectoContratista = crearSelectOneMenuOblig("selAutoProyectoContratista",
                "",listProyectoContratistasAux,"","id","nombre");

            $("#divAutoCompletarProyectoContratista").html(selAutoProyectoContratista);
            $("#inputProyectoContratista").attr("onkeyup","verAutoCompletarProyectoContratista()");
        });
    }else{
        listProyectoContratistasAux = [{id:-1,nombre:"Sin asignar"}];

        var selAutoProyectoContratista = crearSelectOneMenuOblig("selAutoProyectoContratista",
            "",listProyectoContratistasAux,"","id","nombre");

        $("#divAutoCompletarProyectoContratista").html(selAutoProyectoContratista);
        $("#inputProyectoContratista").attr("onkeyup","verAutoCompletarProyectoContratista()");
    }
}

var listTrabajadoresInformadosProyecto = [];

function verTrabajadoresInformadosProyecto() {
    if (ProyectoId == 0) {
        crearSelectOneMenuObligMultipleCompleto("selProyTrabAsignar", "",
            listTrabajadoresInformadosProyecto, "trabajadorId", "nombre", "#proytrinf" + ProyectoId, "Agregue trabajadores");
        volverAgregarTrabajadorProyecto();
        return;
    }
    callAjaxPost(URL + "/contratista/proyecto/informados/trabajadores", {id: ProyectoId}, function (data) {
        listTrabajadoresInformadosProyecto = data.list;
        listTrabajadoresInformadosProyecto.forEach(function (val) {
            val.selected = 1;
        });
        crearSelectOneMenuObligMultipleCompleto("selProyTrabAsignar", "",
            listTrabajadoresInformadosProyecto, "trabajadorId", "nombre", "#proytrinf" + ProyectoId, "Agregue trabajadores");
        volverAgregarTrabajadorProyecto();
    });
}

function volverAgregarTrabajadorProyecto() {
    $(".btn-ver-agregar").remove();
    $("#textTrabProyecto").remove();
    $("#divTrabProyectoMulti").remove();
    $("#selProyTrabAsignar_chosen").show();
    $("#proytrinf" + ProyectoId)
        .prepend("<button class='btn btn-success btn-agregar' onclick='verAgregarTrabajadorProyecto()'>" +
            "<i class=' fa fa-plus'></i>Agregar </button>");
}

function verAgregarTrabajadorProyecto() {
    $(".btn-agregar").remove();
    $("#selProyTrabAsignar_chosen").hide();
    $("#proytrinf" + ProyectoId).prepend("" +
        "<input class='form-control' id='textTrabProyecto'><div id='divTrabProyectoMulti'> </div>" +
        "<button class='btn btn-danger btn-ver-agregar' onclick='volverAgregarTrabajadorProyecto()'>" +
        "<i class=' fa fa-times'></i>Cancelar </button>" +
        "<button class='btn btn-success btn-ver-agregar' onclick='guardarAgregarTrabajadorProyecto()' >" +
        "<i class=' fa fa-floppy-o'></i>Guardar</button>");
    verAutoCompletarTrabProyecto();
}

function guardarAgregarTrabajadorProyecto() {
    var trabId = parseInt($("#selAutoTrabProyecto").val());
    if (trabId == -1) {
        alert("Seleccionar Trabajador");
        return;
    }
    ;
    var dataParam = {
        trabajadorId: trabId,
        nombre: $("#selAutoTrabProyecto option:selected").text(),
        proyectoId: ProyectoId,
        selected: 1
    };
    if (true) {
        listTrabajadoresInformadosProyecto.push(dataParam);
        crearSelectOneMenuObligMultipleCompleto("selProyTrabAsignar", "",
            listTrabajadoresInformadosProyecto, "trabajadorId", "nombre", "#proytrinf" + ProyectoId, "Agregue trabajadores");
        volverAgregarTrabajadorProyecto();
        return;
    }
    callAjaxPost(URL + "/contratista/proyecto/informado/trabajador/save", dataParam, function (data) {
        verTrabajadoresInformadosProyecto();
    });
}

function verAutoCompletarTrabProyecto() {
    var nombre = $("#textTrabProyecto").val().trim();
    if (nombre == "") {
        nombre = null
    }
    ;
    var dataParam = {
        trabajadorNombre: "%" + nombre + "%",
        empresaId: getSession("gestopcompanyid")
    }
    callAjaxPostNoLoad(URL + "/trabajador/buscar", dataParam, function (data) {
        if (data.trabajadores.length == 0) {
            data.trabajadores.push({
                trabajadorId: -1, nombre: "Sin asignar", puesto: {positionName: ""}
            })
        }
        crearSelectOneMenuObligUnitarioCompleto("selAutoTrabProyecto",
            " ", data.trabajadores, "trabajadorId", "nombre",
            "#divTrabProyectoMulti", "");

        $("#textTrabProyecto")
            .attr("onkeyup", "verAutoCompletarTrabProyecto()");
    });
}

function cancelarProyecto(){
   cargarProyectosSeguridad();
}

function eliminarProyecto(){
    if(proyectoObj.trabajadoresTotal == 0 || proyectoObj.contratistaNombre == "------"){
        mensajeUx = "<label>¿Está seguro de eliminar el proyecto seleccionado?</label>";
        mensajesUx(mensajeUx,3,"","EliminarModContratista");

        $("#btnDevolverValorEliminarModContratista").on("click",function(){
            var dataParam={
                id:ProyectoId
            };

            callAjaxPost(URL+'/contratista/proyecto/delete',dataParam,function(data){
                switch(data.CODE_RESPONSE){
                    case "05":
                        mensajeUx = "<label>El proyecto fue eliminado con éxito.</label>";
                        mensajesUx(mensajeUx,1,"","ActualizarModContratista");

                        $("#modalMensajeUxActualizarModContratista").on("hidden.bs.modal",function(){
                            cargarProyectosSeguridad();
                        });

                        break;

                    default:
                        alert("Ocurrió un error al eliminar el proyecto!");
                }
            });
        });
    }else{
        mensajeUx = "<label>No puede eliminarse el proyecto porque tiene trabajadores asociados.</label>";
        mensajesUx(mensajeUx,2,"","");
    }
}

function guardarProyecto(){
   var campoVacio = true;

   var titulo = $("#inputProyectoTitulo").val();
   var descripcion = $("#inputProyectoDesc").val();
   var responsableSST = $("#inputProyectoRespSst").val();
   var responsableCorreo = $("#inputProyectoRespCorreo").val();
   var listaId = $("#slcTiposEval").val();
   var responsableId = $("#slcResponsableProy").val();
   var areaId = $("#selAreaProyecto").val();
   var contratistaId = (ProyectoId == 0?parseInt($("#selAutoProyectoContratista").val()):null);

   var perfilEspecialId = (ProyectoId == 0 || empresaConfigProyAux.snEditarPerfProyAuto == 1?parseInt($("#slcPerfilEspecialProy").val()):proyectoObj.perfilEspecial.id);
   
   var respId = $("#slcRespSecundarios").val();
   var responsablesFinal = [];

   respId.forEach(function(val,index){
      responsablesFinal.push({id:val});
   });

   var trabsId = $("#selProyTrabAsignar").val();
   var trabajadoresInformados = [];

   trabsId.forEach(function (val){
      trabajadoresInformados.push({
         trabajadorId:parseInt(val)
      });
   });

    var fechaInicio = convertirFechaTexto($("#inputProyectoInicio").val());
    var inputFechaInicio = (!fechaInicio?null:fechaInicio);
    var fechaInicioTexto = (ProyectoId == 0 && inputFechaInicio != null?convertirFechaNormal($("#inputProyectoInicio").val()):null);

    var fechaFin = convertirFechaTexto($("#inputProyectoFin").val());
    var inputFechaFin = (!fechaFin?null:fechaFin);
    var fechaFinTexto = (ProyectoId == 0 && inputFechaFin != null?convertirFechaNormal($("#inputProyectoFin").val()):null);
    
    var listLugaresTrabProyAsignados = [];
    var textoLugaresTrabProyAsignados = "";

    listTipoLugaresTrabajoProy.forEach(function(val){
        var isAsignado = ($("#checkAsignadoLugaresTrabProy"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textoLugaresTrabProyAsignados += (textoLugaresTrabProyAsignados.length == 0?val.id:","+val.id);
            listLugaresTrabProyAsignados.push({id:val.id});
        }
    });
    
    var listTurnosTrabProyAsignados = [];
    var textoTurnosTrabProyAsignados = "";

    listTurnosAnProy.forEach(function(val){
        var isAsignado = ($("#checkAsignadoTurnosTrabProy"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textoTurnosTrabProyAsignados += (textoTurnosTrabProyAsignados.length == 0?val.id:","+val.id);
            listTurnosTrabProyAsignados.push({id:val.id});
        }
    });
    
    var ordenCompra = $("#inputOrdenCompraProy").val().trim();

    if(titulo.length == 0 || descripcion.length == 0 || inputFechaInicio == null || inputFechaFin == null){
        campoVacio = false;
    }

    if(campoVacio){
        var dataParam={
            id:ProyectoId,trabajadoresInformados: trabajadoresInformados,responsablesSecundarios: responsablesFinal,
            responsableCorreo: responsableCorreo,descripcion: descripcion,titulo: titulo,estado: proyectoEstado,
            responsableSST: responsableSST,responsable: {id: responsableId},fechaInicio: inputFechaInicio,
            fechaFin: inputFechaFin,lista: {id: listaId},area: {id: areaId},perfilEspecial: {id: perfilEspecialId},
            empresaId: parseInt(getSession("gestopcompanyid")),contratistaId:contratistaId,fechaInicioTexto:fechaInicioTexto,
            fechaFinTexto:fechaFinTexto,listLugaresTrabProyAsignados:listLugaresTrabProyAsignados,textoLugaresTrabProyAsignados:textoLugaresTrabProyAsignados,
            listTurnosTrabProyAsignados:listTurnosTrabProyAsignados,textoTurnosTrabProyAsignados:textoTurnosTrabProyAsignados,ordenCompra:ordenCompra
        };
		
      callAjaxPost(URL+'/contratista/proyecto/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx = "<label>El proyecto fue registrado con éxito.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarModContratista");

               $("#modalMensajeUxActualizarModContratista").on("hidden.bs.modal",function(){
                  cargarProyectosSeguridad();
               });

               break;

            default:
               console.log("Ocurrió un error al guardar el proyecto!");
         }
      });
   }else{
      mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

function hallarEstadoProyecto() {
    var fechaInicio = $("#inputProyectoInicio").val();
    var fechaFin = $("#inputProyectoFin").val();
    var hoyDia = obtenerFechaActual();
    var difInicio = restaFechas(hoyDia, fechaInicio);
    var difFinal = restaFechas(hoyDia, fechaFin);

    var idAux = (difInicio > 0 ? "1" : (difFinal > 0 ? "2" : "3"));
    var nombreAux = (difInicio > 0 ? "Pendiente" : (difFinal > 0 ? "En Curso" : "Completado"));

    proyectoEstado = {
        id: idAux,
        nombre: nombreAux
    };

    $("#proyestado" + ProyectoId).html(proyectoEstado.nombre + "");
}

function ocultarValoresPreviosConsolidadoCanDocEvaluacionProyecto() {
    $("#modalValPrevConCanDocEvalDescargar").modal("hide");
}

function valoresPreviosConsolidadoCanDocEvaluacionProyecto() {
    $("#modalValPrevConCanDocEvalDescargar").remove();

    var hoy = getSession("fechaHoyOrdenInversoTexto");

    var contenido = "";

    var listContenido = [];

    var listContenido = [
        {
            sugerencia: "", label: "Desde",
            inputForm: "<input type='date' id='fechaInicioConsolidadoCanDocEvaProy' class='form-control'>"
        },
        {
            sugerencia: "", label: "Hasta",
            inputForm: "<input type='date' id='fechaFinConsolidadoCanDocEvaProy' class='form-control'>"
        },
        {sugerencia: "", label: "", inputForm: ""},
        {
            sugerencia: "",
            label: "<button class='btn btn-danger' type='button' " +
                "onclick='ocultarValoresPreviosConsolidadoCanDocEvaluacionProyecto()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
            inputForm: "<button class='btn btn-success' style='float:right;' type='button' " +
                "onclick='descargarConsolidadoCanDocEvaluacionProyecto()'>" +
                "<i class='fa fa-download'></i> Descargar" +
                "</button>"
        },
    ];

    listContenido.forEach(function (val) {
        contenido += obtenerSubPanelModuloGeneral(val);
    });

    var modalOptions = {
        id: "modalValPrevConCanDocEvalDescargar",
        nombre: "<i class='fa fa-filter'></i> Filtro - Consolidado Cantidad Documentos Evaluados - Proyecto <br>",
        contenido: "<form class='eventoGeneral'>" + contenido + "</form>"
    };

    crearModalPrincipalUsuario(modalOptions, function () {
    }, false);

    $("#fechaInicioConsolidadoCanDocEvaProy").val(sumaFechaDias(-30, hoy));
    $("#fechaFinConsolidadoCanDocEvaProy").val(hoy);

    $("#modalValPrevConCanDocEvalDescargar").modal("show");
}

function descargarConsolidadoCanDocEvaluacionProyecto() {
    var fechaInicioConsolidado = $("#fechaInicioConsolidadoCanDocEvaProy").val();
    var fechaFinConsolidado = $("#fechaFinConsolidadoCanDocEvaProy").val();
    var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
    var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);

    window.open(URL + "/contratista/proyecto/excel/consolidado_cantidad_documentos_evaluacion?" +
        "proyectoId=" + proyectoObj.id + "&contratistaId=" + proyectoObj.postulante.contratista.id +
        "&fechaInicioConsolidado=" + fechaInicioConsolidado + "&fechaFinConsolidado=" + fechaFinConsolidado +
        "&fechaInicioConsolidadoNormal=" + fechaInicioConText +
        "&fechaFinConsolidadoNormal=" + fechaFinConText + "&tipoConsolidadoId=" + 1);

    $("#modalValPrevConCanDocEvalDescargar").modal("hide");
}

function ocultarConstanciaTrabAltoRiesgoTrabCon(){
   $("#modalDetalleConstTrabAltoRiesgo").modal("hide");
}

function verConstanciaTrabAltoRiesgoTrabCon(acceso,pindex){
    var trabContratistaObj,accesoId = parseInt(acceso);

    if(accesoId == 1){
        trabContratistaObj = listFullTrabajadoresProyectos[pindex];
    }else if(accesoId == 2){
        trabContratistaObj = listFullTrabajadoresContratista[pindex];
    }else if(accesoId == 3){
        trabContratistaObj = (busquedaActivaTrabContAsig == 0?listTrabContratistaAsignados[pindex]:listTrabContratistaAsignadosBuscador[pindex]);

        $("#modalConsolidadoTrabContAsig").modal("hide");$("#modalIndicadoresProyecto").modal("hide");
    }else if(accesoId == 4){
        if(parseInt($("#selAutoPrevencionistaEntPrev").val()) != -1){
 	        var trabajadorId = 0;
 	 
 	        listPrevencionistasAux.forEach(function(val){
 	            if(parseInt($("#selAutoPrevencionistaEntPrev").val()) == val.id){
 	                trabajadorId = val.trabajadorId;
 	            }
 	        });
 	 
 	        trabContratistaObj = {id:trabajadorId};
        }else{
 	        mensajeUx = "<label>Debe seleccionar a un trabajador.</label>";
 	        mensajesUx(mensajeUx,2,"","");
 	  
 	        return;
        }
    }else if(accesoId == 5){
        trabContratistaObj = trabContratistaAuxObj;
       
        $("#modalEstadoActualTrabajadorContratista").modal("hide");
    }else if(accesoId == 6){
		trabContratistaObj = trabContratistaAuxOpcGenContObj;
		       
		$("#modalEstadoActualTrabajadorContratistaOpcGenCont").modal("hide");
    }

    $("#modalDetalleConstTrabAltoRiesgo").remove();
      
    var contenido = "",listContenido = [];
   
    var nombreCompleto = (trabContratistaObj.apellido.length == 0 && trabContratistaObj.nombre.length == 0?"------":
        ((trabContratistaObj.apellido.length == 0?"":trabContratistaObj.apellido+", ")+(trabContratistaObj.nombre.length == 0?"":trabContratistaObj.nombre)));
     
    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building-o' aria-hidden='true'></i> Contratista:",inputForm:trabContratistaObj.contratista.nombre},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-user' aria-hidden='true'></i> Trabajador(a):",inputForm:nombreCompleto});

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo9 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo9 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJOS EN ALTURA ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo9});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo9});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo9});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo10 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo10 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJOS EN CALIENTE ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo10});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo10});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo10});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo11 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo11 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** ESPACIOS CONFINADOS ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo11});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo11});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo11});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo12 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo12 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJOS ELÉCTRICOS ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo12});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo12});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo12});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo13 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo13 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** IZAJE DE CARGAS ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo13});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo13});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo13});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo26 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo26 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MONTAJE, ARMADO Y DESMONTAJE DE ANDAMIOS ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo26});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo26});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo26});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo27 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo27 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** HERRAMIENTAS MANUALES ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo27});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo27});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo27});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo28 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo28 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** HERRAMIENTAS DE PODER ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo28});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo28});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo28});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo29 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo29 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MAQUINARIA PESADA ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo29});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo29});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo29});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo30 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo30 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXCAVACIONES Y ZANJAS ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo30});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo30});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo30});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo31 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo31 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** OPERADOR DE MANLIFT ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo31});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo31});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo31});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo32 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo32 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** OPERADOR DE GRÚA ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo32});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo32});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo32});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo62 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo62 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MATPEL ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo62});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo62});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo62});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo66 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo66 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** RIGGER ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo66});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo66});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo66});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo80 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo80 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CONDUCCIÓN DE VEHÍCULO Y EQUIPOS MÓVILES ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo80});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo80});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo80});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo81 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo81 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXPOSICIÓN A ÓRGANOS FOSFORADOS (FUMIGACIÓN) ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo81});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo81});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo81});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo82 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo82 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXPOSICIÓN A RUIDO ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo82});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo82});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo82});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo83 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo83 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXPOSICIÓN A MATERIAL BIOLÓGICO ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo83});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo83});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo83});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo85 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo85 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJOS EN INTEMPERIE ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo85});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo85});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo85});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo86 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo86 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXPOSICIÓN A MATERIAL PARTICULADO Y/O QUÍMICOS VOLÁTILES ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo86});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo86});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo86});
        }
    }

    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo87 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo87 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CONTACTO DIRECTO CON PASAJEROS/CLIENTES ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo87});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo87});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo87});
        }
    }
    
    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo120 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo120 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** SISTEMA ANTICAÍDAS PARA ESCALERA FABA ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo120});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo120});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo120});
        }
    }
    
    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo121 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo121 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** SISTEMA ANTICAÍDAS PARA ESCALERA TIPO GATO ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo121});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo121});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo121});
        }
    }
    
    if(trabContratistaObj.habilitadoTrabajoAltoRiesgo122 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo122 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** SISTEMA ANTICAÍDAS PARA TECHO INCLINADO ***</span>",inputForm:""});

        if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo122});
        }

        if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo122});
        }
        
        if(trabContratistaObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo122});
        }
    }
	
	if(trabContratistaObj.habilitadoTrabajoAltoRiesgo135 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo135 == 1){
	    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** ÍTEM DE RESCATISTA ***</span>",inputForm:""});

	    if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
	        listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
	            inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo135});
	    }

	    if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
	        listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
	            inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo135});
	    }
	        
	    if(trabContratistaObj.habilitadoMedicoClinica == 1){
	        listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
	            inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo135});
	    }
	}
		
	if(trabContratistaObj.habilitadoTrabajoAltoRiesgo136 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo136 == 1){
		listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** BLOQUEO DE ENERGÍAS PELIGROSAS ***</span>",inputForm:""});

		if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
		        inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo136});
		}

		if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
		        inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo136});
		}
		        
		if(trabContratistaObj.habilitadoMedicoClinica == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
		        inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo136});
		}
	}

	if(trabContratistaObj.habilitadoTrabajoAltoRiesgo160 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo160 == 1){
		listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJO EN FRÍO - CALIENTE ***</span>",inputForm:""});

		if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
		        inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo160});
		}

		if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
		        inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo160});
		}
		        
		if(trabContratistaObj.habilitadoMedicoClinica == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
		        inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo160});
		}
	}

	if(trabContratistaObj.habilitadoTrabajoAltoRiesgo161 == 1 && trabContratistaObj.incluirTrabajoAltoRiesgo161 == 1){
		listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MEDICIÓN DE GASES ***</span>",inputForm:""});

		if(trabContratistaObj.habilitadoConstanciaAltoRiesgo == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
		        inputForm:trabContratistaObj.estadoActualCertificadoTrabajoAltoRiesgo161});
		}

		if(trabContratistaObj.habilitarCargoInduccionTrabAltRie == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
		        inputForm:trabContratistaObj.estadoActualCargoTrabajoAltoRiesgo161});
		}
		        
		if(trabContratistaObj.habilitadoMedicoClinica == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
		        inputForm:trabContratistaObj.estadoActualMedicoClinicaTrabajoAltoRiesgo161});
		}
	}

    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",
         label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarConstanciaTrabAltoRiesgoTrabCon()'>" +
 	               "<i class='fa fa-arrow-left'></i> Volver" +
 	           "</button>",inputForm:""});
       
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });
     	  				
    var modalOptions={
        id:"modalDetalleConstTrabAltoRiesgo",nombre:"<i class='fa fa-list-ul'></i> Trabajos de alto riesgo asignados - Estado",btnCerrarHabilitado:0,
        contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    };
     	  				
    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	
	if([3,5,6].includes(accesoId)){
		$("#modalDetalleConstTrabAltoRiesgo").on("hidden.bs.modal",function(){
		    if(accesoId == 3){
				$("#modalConsolidadoTrabContAsig").modal("show");
		    }else if(accesoId == 5){
				$("#modalEstadoActualTrabajadorContratista").modal("show");
			}else if(accesoId == 6){
				$("#modalEstadoActualTrabajadorContratistaOpcGenCont").modal("show");
			}
	    });
	}
}

var listOpcConsolidadoProyecto=[
   {id:1,nombre:"Inspecciones - contratista"},{id:2,nombre:"Resumen Proyecto(s) - Información"},
   {id:3,nombre:"Ficha de habilitación de ingreso del personal contratista"}
];

function ocultarConsolidadosExcelProyecto(){
   $("#modalConsolidadosExcelProyecto").modal("hide");
}

function verConsolidadosExcelProyecto(){
   $("#modalConsolidadosExcelProyecto").remove();

   var selOpcConExcelProyecto = crearSelectOneMenuOblig("selOpcConExcelProyecto",
      "verAcordeConsolidadosExcelProyecto()",listOpcConsolidadoProyecto,"2","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",
       inputForm:selOpcConExcelProyecto,divContainer:"divSelConExcelProyecto"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarConsolidadosExcelProyecto()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='descargarConsolidadosExcelProyecto()'>" +
                    "<i class='fa fa-download'></i> Descargar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions={
      id:"modalConsolidadosExcelProyecto",
      nombre:"<i class='fa fa-filter'></i> Seleccionar - Consolidado excel",
      contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordeConsolidadosExcelProyecto();
}

function verAcordeConsolidadosExcelProyecto(){
    $(".atributo-consolidadoExcelProyecto").remove(); 
    var listContenidoDivSelConExcelProyecto = [];
    var opcConsolidadoExcel = parseInt($("#selOpcConExcelProyecto").val());
   
    if(opcConsolidadoExcel == 1){
        listContenidoDivSelConExcelProyecto.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia: "",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label: "Hallazgos Libres",
             inputForm: "<input type='radio' value='1' class='form-control' name='radioInspecciones' checked>"},
            {sugerencia: "",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label: "CheckList",
             inputForm: "<input type='radio' value='2' class='form-control' name='radioInspecciones'>"},
            {sugerencia: "",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label: "Observaciones",
             inputForm: "<input type='radio' value='3' class='form-control' name='radioInspecciones'>"});
    }
   
    if([1,2].includes(opcConsolidadoExcel)){
        listContenidoDivSelConExcelProyecto.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",
             inputForm:"<input type='date' id='fechaInicioConsolidadoExcProy' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",
             inputForm:"<input type='date' id='fechaFinConsolidadoExcProy' class='form-control'>"}); 
    }
   
    if(opcConsolidadoExcel == 3){
        listContenidoDivSelConExcelProyecto.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Proyecto:",
	     inputForm:"<input class='form-control' type='text' id='inputIngresarCodTitProyectoExcProy'>" +
		       "<div id='divSelAutoProyectoPorCodTitExcProy'></div>" +
		       "<label>*Buscar proyecto por código y/o título (debe ingresar 3 caracteres como mínimo).</label>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de trabajo",
	     inputForm:"<input type='date' id='fechaReferenciaProyAsigExcProy' class='form-control'>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Detalle de la actividad",
             inputForm:"<textarea class='form-control' id='textAreaDetalleProyAsigExcProy' rows='5'></textarea>"});
   }
   
   var contenido = "";
   
   listContenidoDivSelConExcelProyecto.forEach(function(val){
      val.clase = "atributo-consolidadoExcelProyecto";
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
    $("#divSelConExcelProyecto").parent().after(contenido);
   
    var hoy = getSession("fechaHoyOrdenInversoTexto");
   
    if([1,2].includes(opcConsolidadoExcel)){
        $("#fechaInicioConsolidadoExcProy").val(sumaFechaDias(-365,hoy));
        $("#fechaFinConsolidadoExcProy").val(hoy);
    }else if(opcConsolidadoExcel == 3){
        $("#fechaReferenciaProyAsigExcProy").val(hoy);
	
        activarBuscarProyectoEmpresaBuscadorExcelProyecto();
    }
}

var listProyectosSimpleAuxPrevio = [];

function activarBuscarProyectoEmpresaBuscadorExcelProyecto(){
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    }
    
    callAjaxPostSimpleVersionDos(1,URL+"/contratista/proyecto/lista_simple",dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
            listProyectosSimpleAuxPrevio = data.proyectos;
	    console.log(listProyectosSimpleAuxPrevio);
	    buscarProyectoEmpresaBuscadorExcelProyecto();   
	}else{
	    alert("Ocurrió un error al cargar la lista de proyectos.");
	}
    });
}

var listBuscadorProyectosExcProy = [];

function buscarProyectoEmpresaBuscadorExcelProyecto(){
    var titulo = $("#inputIngresarCodTitProyectoExcProy").val().trim();

    listBuscadorProyectosExcProy = [];
    
    if(titulo.length >= 3){
        listProyectosSimpleAuxPrevio.forEach(function(val,index){
            if(igualarStringBuscar(val.titulo).indexOf(titulo) != -1){
                listBuscadorProyectosExcProy.push(val);
            }
        });
    }
        
    if(listBuscadorProyectosExcProy.length == 0){
	listBuscadorProyectosExcProy = [{id:-1,titulo:"No encontrado"}];
    }
    
    var selProyectoBuscadorExcProy = crearSelectOneMenuOblig("selProyectoBuscadorExcProy","",listBuscadorProyectosExcProy,"","id","titulo");

    $("#divSelAutoProyectoPorCodTitExcProy").html(selProyectoBuscadorExcProy);

    $("#inputIngresarCodTitProyectoExcProy").attr("onkeyup","buscarProyectoEmpresaBuscadorExcelProyecto()");
}

function descargarConsolidadosExcelProyecto(){
   var campoVacio = true;
   
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelProyecto").val());
   var fechaInicioConsolidado = $("#fechaInicioConsolidadoExcProy").val();
   var fechaFinConsolidado = $("#fechaFinConsolidadoExcProy").val();
   var proyectoBuscadorOpc3 = (opcConsolidadoExcel == 3?$("#selProyectoBuscadorExcProy").val():-1);
   var fechaReferenciaOpc3 = (opcConsolidadoExcel == 3?$("#fechaReferenciaProyAsigExcProy").val():"");
   var detalleActividadOpc3 = (opcConsolidadoExcel == 3?$("#textAreaDetalleProyAsigExcProy").val():"");
    
   if([1,2].includes(opcConsolidadoExcel)){
      if(fechaInicioConsolidado.length == 0 || fechaFinConsolidado.length == 0){
	 campoVacio = false;mensajeUx = "<label>Debe ingresar la fecha inicio y la fecha fin.</label>";
      }
   }
   
    if(opcConsolidadoExcel == 3){
        if(proyectoBuscadorOpc3 == -1){
            campoVacio = false;mensajeUx = "<label>Debe seleccionar el proyecto.</label>";
        }else if(fechaReferenciaOpc3.length == 0){
            campoVacio = false;mensajeUx = "<label>Debe ingresar la fecha de trabajo.</label>";
        }
    }
    
    if(campoVacio){
        var fechaInicioConText = ([2].includes(opcConsolidadoExcel)?convertirFechaNormal(fechaInicioConsolidado):"");
        var fechaFinConText = ([2].includes(opcConsolidadoExcel)?convertirFechaNormal(fechaFinConsolidado):"");
   
        if(opcConsolidadoExcel == 1){
	    var opcionDescarga = $("input[name='radioInspecciones']:checked").val();

	    consolExcelHallazgosLibresCheckListContratista(parseInt(getSession("gestopcompanyid")),opcionDescarga,
	        fechaInicioConsolidado,fechaFinConsolidado);
        }else if(opcConsolidadoExcel == 2){
            window.open(URL+"/contratista/proyecto/excel/consolidado_resumen_informacion?" +
                "empresaId="+parseInt(getSession("gestopcompanyid"))+"&fechaInicioConsolidado="+fechaInicioConsolidado + 
	        "&fechaFinConsolidado="+fechaFinConsolidado+"&fechaInicioConsolidadoNormal="+fechaInicioConText + 
	        "&fechaFinConsolidadoNormal="+fechaFinConText);
        }else if(opcConsolidadoExcel == 3){
	    var fechaReferenciaOpc3Texto = convertirFechaNormal(fechaReferenciaOpc3);
	    
	    var contratistaAuxOpc3 = 0;
	    
	    listBuscadorProyectosExcProy.forEach(function(val,index){
	        if(proyectoBuscadorOpc3 == val.id){
	            contratistaAuxOpc3 = val.contratistaId;
	        }
	    });
	    
	    window.open(URL+"/contratista/consolidado/proyecto_asignado_trabajadores?"+"proyectoAsignadoId="+proyectoBuscadorOpc3 +
	        "&contratistaId="+contratistaAuxOpc3+"&detalleActividad="+detalleActividadOpc3+"&empresaId="+getSession("gestopcompanyid") +
	        "&listTrabajadoresProAsiId=0"+"&fechaReferencia="+fechaReferenciaOpc3+"&fechaReferenciaTexto="+fechaReferenciaOpc3Texto,'_blank');  
        }
    }else{
        $("#modalConsolidadosExcelProyecto").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionFiltroExcel");
      
        $("#modalMensajeUxValidacionFiltroExcel").on("hidden.bs.modal",function(){
            $("#modalConsolidadosExcelProyecto").modal("show");
        });
    }
}

function actualizarNumDocumentosProyecto(){
   var dataParam={
      proyectosInfoAux: listFullProyectoSeguridad
   };
	     
   callAjaxPost(URL+"/contratista/proyectos/numero_documentos",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         var listProyectosNumeroDocumentos = data.listProyectosNumeroDocumentos;
	 	 
         listProyectosNumeroDocumentos.forEach(function(val,index){
            $("#trprogen"+val.id).find("#proyinddoc"+val.id).html(val.numTotalDocumentosProyecto);
         });
      }else{
	 console.log("NOPNPO");
      }
   });   
}

var trabContVerifIaObj = {},trabajadoresAux = [],mapTrabajadoresAux = new Map();

function ocultarVerificacionIaDocTrabCont(){
   $("#modalVerificacionIaDocTrabCont").modal("hide");
}

// P-A00033: el apellido de un trabajador de la lista, que viene como "(numero de documento) NOMBRES, APELLIDOS": lo que sigue a la primera coma.
// Sin coma, el nombre completo sin el "(numero de documento)" del inicio, para que no quede siempre al comienzo de la lista.
function apellidoTrabajadorParaOrdenar(nombre){
   var textoNombre = String(nombre == undefined?"":nombre),posicionComa = textoNombre.indexOf(",");

   return (posicionComa == -1?textoNombre.replace(/^\([^)]*\)\s*/,""):textoNombre.substring(posicionComa+1)).trim();
}

// P-A00033: ordena los identificadores de los trabajadores de un documento alfabeticamente por apellido, sin distinguir mayusculas ni tildes.
// Con el mismo apellido, desempata por el nombre (el texto sin el "(numero de documento)"), y luego por el texto completo. Los identificadores que
// no estan en la lista de trabajadores quedan al final.
function ordenarIdsTrabajadoresPorApellido(listaIds){
   var comparar = function(a,b){
      return a.localeCompare(b,"es",{sensitivity:"base"});
   };

   var sinNumeroDocumento = function(nombre){
      return String(nombre == undefined?"":nombre).replace(/^\([^)]*\)\s*/,"");
   };

   return listaIds.slice().sort(function(idA,idB){
      var trabA = mapTrabContratistaVerfIa.get(parseInt(idA)),trabB = mapTrabContratistaVerfIa.get(parseInt(idB));

      if(trabA == undefined || trabB == undefined){
         return (trabA == undefined?1:0)-(trabB == undefined?1:0);
      }

      var resultado = comparar(apellidoTrabajadorParaOrdenar(trabA.nombre),apellidoTrabajadorParaOrdenar(trabB.nombre));

      if(resultado == 0){
         resultado = comparar(sinNumeroDocumento(trabA.nombre),sinNumeroDocumento(trabB.nombre));
      }

      return (resultado != 0?resultado:comparar(String(trabA.nombre),String(trabB.nombre)));
   });
}

function verVerificacionIaDocTrabCont(pTrabajadoresId,pHasEviPdf,pEviUrl,pHasEviAuxPdf,pEviAuxUrl,pTipoId){
   $("#modalVerificacionIaDocTrabCont").remove();

   trabContVerifIaObj={},trabajadoresAux = [],mapTrabajadoresAux = new Map();

   var trabContratistaVerfIaId = pTrabajadoresId.split(","),trabContratistaAsocPdf = "";

   // Solo los tipos nuevos de P-A00033 van ordenados por apellido; el SCTR (2), el seguro vida ley (90) y la copia de selector/ (que no manda el tipo,
   // parseInt(undefined) es NaN) siguen en el orden en que vienen los identificadores del documento.
   if(TIPOS_VERIFICACION_DNI_REVISOR.includes(parseInt(pTipoId))){
      trabContratistaVerfIaId = ordenarIdsTrabajadoresPorApellido(trabContratistaVerfIaId);
   }

   trabContratistaVerfIaId.forEach(function(val){
      var datoTrabContAux = mapTrabContratistaVerfIa.get(parseInt(val)); 
       
      if(datoTrabContAux != undefined){
         var datosTrabajadoresAux={
             tipoDocumento:datoTrabContAux.tipoDocumento.nombre,
             numeroDocumento:datoTrabContAux.nroDocumento
         };	
        	
         trabajadoresAux.push(datosTrabajadoresAux);
         trabContratistaAsocPdf += (trabContratistaAsocPdf.length == 0?"":"<br>")+datoTrabContAux.nombre;
         mapTrabajadoresAux.set(datoTrabContAux.nroDocumento,datoTrabContAux.nombre);
      }
   });
   
   var listOpcVerificarIaDocTrabCont = [];
   
   if(parseInt(pHasEviPdf) == 1){
      listOpcVerificarIaDocTrabCont.push({id:1,nombre:"Evidencia"});
      trabContVerifIaObj.eviUrl = pEviUrl;
   }
   
   if(parseInt(pHasEviAuxPdf) == 1 && parseInt(pTipoId) == 2){
      listOpcVerificarIaDocTrabCont.push({id:2,nombre:"Evidencia auxiliar"}); 
      trabContVerifIaObj.eviAuxUrl = pEviAuxUrl;
   }

   var selOpcVerificarIaDocTrabCont = crearSelectOneMenuOblig("selOpcVerificarIaDocTrabCont",
      "",listOpcVerificarIaDocTrabCont,"1","id","nombre");
   
   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",label:"Seleccionar",
       inputForm:selOpcVerificarIaDocTrabCont,divContainer:"divSelVerificarIaDocTrabCont"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-11",anchoDiv:"col-sm-1",label:"Trabajadores asociados al PDF",inputForm:""}, 
      {sugerencia:"",anchoLabel:"col-sm-11",anchoDiv:"col-sm-1",label:trabContratistaAsocPdf,inputForm:""}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarVerificacionIaDocTrabCont()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='enviarVerificacionIaDocTrabCont()'>" +
                    "<i class='fa fa-eye'></i> Verificar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions={
      id:"modalVerificacionIaDocTrabCont",
      nombre:"<i class='fa fa-list-alt'></i> Verificación DNI - Trabajador contratista",
      contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function enviarVerificacionIaDocTrabCont(){
   var opcionId = parseInt($("#selOpcVerificarIaDocTrabCont").val()); 
   
   var dataParamError={
      esModal: 1,contenedorModal: "modalVerificacionIaDocTrabCont"	   
   };
   
   var dataParam={
      url:(opcionId == 1?trabContVerifIaObj.eviUrl:trabContVerifIaObj.eviAuxUrl),
      licenciaId:parseInt(getSession("gestopcompanyid")),documentos:trabajadoresAux
   };
   
//   enviarParametrosExternoPost("https://dnwtd70hr7.execute-api.us-west-2.amazonaws.com/dev/api/validate-data-from-file",dataParam,
//   dataParamError,1,1,1,function(data){
    callAjaxPostSimpleVersionDos(1,URL+'/archivo-validacion/validar-datos',dataParam,1,1,function(data){
	switch(data.CODE_RESPONSE){
            case "05":
        	$("#modalVerificacionIaDocTrabCont").modal("hide");
       
        	if(data.resultado.noValidos.length != 0){
        	    var trabajadoresNoEncontrados = ""; 
	  
        	    data.resultado.noValidos.forEach(function(val){
        		trabajadoresNoEncontrados += "<br>"+mapTrabajadoresAux.get(val);   
        	    });
	 
        	    mensajeUx = "<label style='text-align:left;'>Los siguientes trabajadores, asociados al PDF, no figuran en la verificación:"+
	    		"<br>"+trabajadoresNoEncontrados+"</label>";
        	}else{
        	    mensajeUx = "<label style='text-align:left;'>Todos los trabajadores, asociados al PDF, fueron encontrados en la verificación." +
	    		"<br><br>*No olvide revisar las fechas de inicio / fin de vigencia y que la cobertura esté asignada de acuerdo a lo solicitado.</label>";
        	} 
      
        	mensajesUx(mensajeUx,(data.resultado.noValidos.length != 0?2:1),"","");
        
        	break;
		
            default:
        	$("#modalVerificacionIaDocTrabCont").modal("hide");
        	
        	var mensajeUx = "<label>Error al procesar la validación. " +
                    "Por favor, revise que la información enviada sea la correcta." +
                    "<br><br>(De persistir el error, comuníquese con GOSST).</label>";
            
                mensajesUx(mensajeUx,2,"","");
                
                break;
	}
    });
//   });
}

var objTrabajadorContratista;

function previoGenerarFotocheckCodigoQrTrabajadorContratista(pindex){
   objTrabajadorContratista = listFullTrabajadoresProyectos[pindex];
    
   generarFotocheckCodigoQrTrabajadorContratista(2);
}

function ocultarSeleccionarCampoValorPersonalizadoProyecto(){
    $("#modalSelecCampoPersonalizadoProy").modal("hide");
}

function verSeleccionarCampoValorPersonalizadoProyecto(){
    $("#modalSelecCampoPersonalizadoProy").remove();

    var listCamposPersonalizadoProy=[
        {id:1,nombre:"Lugar de trabajo"}
    ];

    var selCampoPersonalizadoProy = crearSelectOneMenuOblig("selCampoPersonalizadoProy","",listCamposPersonalizadoProy,"","id","nombre");

    var contenido = "";

    var listContenido=[
        {sugerencia:"",label:"Campo",inputForm:selCampoPersonalizadoProy},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarSeleccionarCampoValorPersonalizadoProyecto()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='submit' onclick='aplicarSeleccionarCampoValorPersonalizadoProyecto()' style='float:right;font-size:18px;'>" +
                       "<i class='fa fa-check-circle'></i> Seleccionar" +
                   "</button>"}
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalSelecCampoPersonalizadoProy",nombre:"<i class='fa fa-list-alt'></i> Seleccionar personalización",
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function aplicarSeleccionarCampoValorPersonalizadoProyecto(){
    var opcionId = parseInt($("#selCampoPersonalizadoProy").val());

    if(opcionId == 1){
	verConsolidadoLugarTrabajoProyecto();
    }
}

// ===== P-A00002: import de proyectos por Excel =====

function verModalImportarProyectosExcel(){
    $("#fileImportProyExcel").val("");
    $("input[name='opcionImpProyExcel'][value='1']").prop("checked", true);
    $("#lnkDescargarPlantillaProyExcel").attr("href",
        URL + "/contratista/proyecto/excel/plantilla?empresaId=" + getSession("gestopcompanyid"));
    $("#lnkDescargarBackupProyExcel").attr("href",
        URL + "/contratista/proyecto/excel/backup?empresaId=" + getSession("gestopcompanyid"));
    $("#modalImportarProyectosExcel").modal("show");
}

function guardarImportProyectosExcel(){
    var archivo = $("#fileImportProyExcel")[0].files[0];

    if(!archivo){
        alert("Seleccione un archivo Excel.");
        return;
    }

    var opcionImpId = parseInt($("input[name='opcionImpProyExcel']:checked").val());

    guardarEvidenciaAuto(0, "fileImportProyExcel", 92428800,
        "/contratista/proyecto/excel/masivo/save", funcionResultadoImportProyectosExcel, "id", [
            {id: "empresaId", value: getSession("gestopcompanyid")},
            {id: "opcionImpId", value: opcionImpId}]);
}

var listUltimosErroresImportProyExcel = [];

function funcionResultadoImportProyectosExcel(data){
    if(data.CODE_RESPONSE !== "05"){
        alert("Ocurrió un error al importar.");
        return;
    }

    listUltimosErroresImportProyExcel = data.errores || [];
    var advertencias = data.advertencias || [];

    $("#modalImportarProyectosExcel").modal("hide");
    $("#lblResImpProyCreados").text(data.creados || 0);
    $("#lblResImpProyActualizados").text(data.actualizados || 0);
    $("#lblResImpProyAdvertencias").text(advertencias.length);
    $("#lblResImpProyErrores").text(listUltimosErroresImportProyExcel.length);

    var cuerpoErrores = $("#tblResImpProyErrores tbody");
    cuerpoErrores.empty();
    if(listUltimosErroresImportProyExcel.length > 0){
        for(var i = 0; i < listUltimosErroresImportProyExcel.length; i++){
            var error = listUltimosErroresImportProyExcel[i];
            $("<tr>")
                .append($("<td>").text(error.codigo))
                .append($("<td>").text(error.motivo))
                .appendTo(cuerpoErrores);
        }
        $("#divResImpProyDetalleErrores").show();
    }else{
        $("#divResImpProyDetalleErrores").hide();
    }

    var cuerpoAdvertencias = $("#tblResImpProyAdvertencias tbody");
    cuerpoAdvertencias.empty();
    if(advertencias.length > 0){
        for(var j = 0; j < advertencias.length; j++){
            var advertencia = advertencias[j];
            $("<tr>")
                .append($("<td>").text(advertencia.codigo))
                .append($("<td>").text(advertencia.motivo))
                .appendTo(cuerpoAdvertencias);
        }
        $("#divResImpProyDetalleAdvertencias").show();
    }else{
        $("#divResImpProyDetalleAdvertencias").hide();
    }

    cargarProyectosSeguridad();
    $("#modalResultadoImportProyectosExcel").modal("show");
}

function copiarErroresImportProyectosExcel(){
    var texto = "";
    for(var i = 0; i < listUltimosErroresImportProyExcel.length; i++){
        var error = listUltimosErroresImportProyExcel[i];
        var filaTexto = (error.fila && error.fila.length > 0) ? error.fila.join("\t") : error.codigo;
        texto += filaTexto + "\t" + error.motivo + "\n";
    }

    if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(texto);
    }else{
        var textoAux = $("<textarea>").val(texto).appendTo("body").select();
        document.execCommand("copy");
        textoAux.remove();
    }
}
