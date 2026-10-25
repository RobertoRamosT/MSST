var banderaEdicion;
var contratistaId, contratistaObj;
var contratistaNombre;
var encabezadosTotal;
var encabezadoId;
var idTipoEncabezado;
var listFullContratista;
var listUnidades;
var listUnidadesObj;
var listTipoObj;
var listFactorObj;
var listPerdidaObj;
var listResponsableObj;
var listObjetivos, listTipoContratista;
var listResponsable;
var listResponsableSeguridad;
var listProyectoSeguridad;
var listFullTablaIndicadores;
var listFullContratistaObj;
var listPerfilContratistaAsociado;

var listFullContratistaBuscador=[];
var busquedaActivaPrincipalCont,numPaginaActualPrincipalCont;

var mensajeUx;

var listTabs = [
    {id:1,nombre:"Contratistas"},{id:2,nombre:"Perfiles"},//{id:3,nombre:"Tipo de actividades críticas"},
    {id:4,nombre:"Unidades"},{id:5,nombre:"Áreas"},{id:6,nombre:"Responsables"},//{id:7,nombre:"Listas de evaluación inicial"},
    {id:16,nombre: "Lista de evaluación inicial - Sub Contratista"},{id:8,nombre:"Proyectos"},{id:9,nombre:"Inducciones a Contratistas"},
//  {id:10,nombre:"Indicadores de Contratistas"},{id:13,nombre:"Evaluar Inf. Inspecciones Hallazgos Libres"},{id:12,nombre:"Evaluar Inf. Auditorías e Inspecciones Check list"},
//  {id:14,nombre:"Calendario de Auditorías e Inspecciones"},{id:15,nombre:"Registro de Auditorías e Inspecciones"},
    {id:11,nombre:"Comunicados a Contratistas"},{id:17,nombre:"Inducciones virtuales"},{id:19,nombre:"Observaciones al contratista por proyecto"},
    {id:20,nombre:"Documentos - Registrado por Contratista"},{id:18,nombre:"Documentos - Registrado por Visitante/Trabajador contratista"},
    {id:21,nombre:"Homologación"},{id:22,nombre:"Sanciones"},{id:23,nombre:"Entrevistas - Prevencionistas"},
    {id:24,nombre:"Análisis de Datos"},{id:25,nombre:"Academia Virtual"},{id:26,nombre:"Historial de registro del acceso"},
	{id:27,nombre:"Inducción a trabajadores nuevos"},{id:28,nombre:"Panel de contratistas"}
];

var listTabsRevDoc = [
    {id:1,nombre:"Resumen - Evaluacion Documentos Proyecto"},
    {id:2,nombre:"Inducciones a contratistas"},
    {id:3,nombre:"Inducciones virtuales"},
    {id:5,nombre:"Observaciones al contratista por proyecto"},
    {id:6,nombre:"Documentos - Registrado por Contratista"},
    {id:4,nombre:"Documentos - Registrado por Visitante/Trabajador contratista"},
	{id:7,nombre:"Historial de registro del acceso"}
];

var subModuloContratistaId = 0,personalizarUsuarioDocumento;

function verAcordeTabContratista() {
    var tabId = $("#selTabContratista").val();
    var tabNombre = "";

    $(".tab-content .tab-pane").hide();

    subModuloContratistaId = parseInt(tabId);

    switch (subModuloContratistaId) {
        case 17:
            tabNombre = "tabInduccionVirtual";personalizarUsuarioDocumento = 0;
            crearFiltroInduccionesVirtualesGeneral(valoresFiltroInduccionesVirtualesGeneral);
            completarBarraCarga();
            break;

        case 18:
            tabNombre = "tabDocPersonalExt";
            crearFiltroDocPersonalExterno(valoresFiltroDocPersonalExt);
            break;

        case 19:
            tabNombre = "tabObservacionesTotales";
            verObservaciones(0, 1);
            break;

        case 20:
            tabNombre = "tabExaTrabContratista";personalizarUsuarioDocumento = 0;
            crearFiltroExaTrabContratista(valoresFiltroExaTrabContratista);
            break;

        case 1:
            tabNombre = "tabContratistas";
            $("" + tabNombre).show();
            listarContratistas();
            break;

        case 2:
            tabNombre = "tabPerfil";
            cargarPerfilContratistas();
            break;

        case 3:
            tabNombre = "tabActividadesCriticas";
            cargarTipoActivCriticasContratista();
            break;

        case 4:
            tabNombre = "tabClasificiones";
            cargarClasificacionsContratista();
            break;

        case 5:
            tabNombre = "tabTipos";
            cargarTiposContratista();
            break;

        case 6:
            tabNombre = "tabResponsable";
            cargarResponsablesSeguridad();
            break;

        case 7:
            tabNombre = "tabListas";
            cargarListasContratista();
            break;

        case 16:
            tabNombre = "tabListasSubContratista";
            cargarListasSubContratista();
            break;

        case 8:
            tabNombre = "tabProyectos";
            crearFiltroProyecto(valoresFiltroProyectosSeguridad);
            break;

        case 9:
            tabNombre = "tabInduccion";
            cargarInduccionsSeguridad();
            break;

        case 10:
            tabNombre = "tabIndicadores";
            cargarIndicadoresContratista();
            break;

        case 11:
            tabNombre = "tabComunicado";
            cargarComunicado();
            break;

        case 12:
            $("#tblResFinalAudi #tdEviInf").html("Evidencia de que se realizó la Auditoria");
            tabNombre = "tabResumenAuditoria";
            cargarFiltrosResumenAuditoriaFinal(3);
            break;

        case 13:
            $("#tblResFinalAudi #tdEviInf").html("Evidencia de que se realizó la Inspección");
            tabNombre = "tabResumenAuditoria";
            cargarFiltrosResumenAuditoriaFinal(2);
            break;

        case 14:
            tabNombre = "tabResumenCalendarioActividades";
            cargarCalendarioActividadesAuditoria();
            completarBarraCarga();
            break;

        case 15:
            tabNombre = "tabResumenActividades"
            cargarActividadesAuditoria();
            completarBarraCarga();
            break;

        case 21:
            tabNombre = "tabHomologaciones";
            cargarEventosHomologacionContratista();
            completarBarraCarga();
            break;

        case 22:
            tabNombre = "tabSanciones";
            previoSeleccionarOpcionSanciones();
            completarBarraCarga();
            break;

        case 23:
            tabNombre = "tabEntrevistaPrevencionista";
            cargarEntrevistaPrevencionista();
            break;
        case 24:
            tabNombre = "tabAnalisisContratista";
            cargarQuicksightContratista();
            break;
			
        case 25:
            tabNombre = "tabMoodleContratista";
            cargarMoodleContratista();
			
            break;
			
        case 26:
            tabNombre = "tabRegistroAcceso";
			previoSeleccionarOpcionRegistroAcceso();
						
			break;
			
		case 27:
			tabNombre = "tabInduccionTrabajadorNuevo";
			cargarInduccionTrabajadorNuevo();

			break;

		case 28:
			tabNombre = "tabPanelContratistas";
			cargarPanelContratistas();
						
			break;
    }

    $("#" + tabNombre).show();
}

var listProyectoActividadAudi = [];
var listContratistasActividadAudi = [];
var listResponsablesActividadAudi = [];

var listTipoActividadAudi = [{id: 3, nombre: "Auditoría"},
    //{id : 2,nombre:"Inspección"},
    {id: 94, nombre: "Hallazgos Libres"}];

// function consolEmpresaExcelHallazgosLibres() {
//     window.open(URL + "/auditoria/contratista/inspeccion/consolidado/excel?idCompany=" + getSession("gestopcompanyid") + "&" +
//         "fechaInicio=" + $("#dateInicioConsolidadoInsEmpresa").val() + "&" +
//         "fechaFin=" + $("#dateFinConsolidadoInsEmpresa").val() + "" +
//         "");
// }

//function verModalConsolidadoExcelInspecciones(){
//   $("#modalConsolidadoExcel").modal("show");
//}

$(document).ready(function () {
//   var contenido ="";
//
//   var listContenido=[
//      {sugerencia:"",label:"Fecha inicio",
//       inputForm:"<input type='date' class='form-control' id='dateInicioConsolidadoInsEmpresa'>",divContainer:""},
//      {sugerencia:"",label:"Fecha fin",
//       inputForm:"<input type='date' class='form-control' id='dateFinConsolidadoInsEmpresa'>",divContainer:""},
//      {sugerencia:"",label:"",
//       inputForm:"<button class='btn btn-success' type='button' " +
//       		         "onclick='consolEmpresaExcelHallazgosLibres()'>" +
//	            "<i class='fa fa-filter'></i> Generar" +
//	         "</button>"}
//   ];
//
//   listContenido.forEach(function(val){
//      contenido += obtenerSubPanelModuloGeneral(val);
//   });
//
//   var modalOptions={
//      id: "modalConsolidadoExcel",
//      nombre: "Consolidado Inspección",
//      contenido: contenido
//   };
//
//   crearModalPrincipalUsuario(modalOptions,function(){},false,false);
//
//   var hoy = obtenerFechaActual();
//
//   $("#dateInicioConsolidadoInsEmpresa").val(sumaFechaDias(-30,hoy));
//   $("#dateFinConsolidadoInsEmpresa").val(sumaFechaDias(7,hoy));

    var selTabContratista = crearSelectOneMenuOblig("selTabContratista", "verAcordeTabContratista()",
        listTabs, "1", "id", "nombre");
    $("#divListaTabs").html("Pestaña: " + selTabContratista);

    resizeDivWrapper("wrapInduccionVirtual", 180);
    resizeDivWrapper("wrapResumTrab", 200);

    resizeDivWrapper("wrapActCrit", 300);
    resizeDivWrapper("wrapUnidades", 300);
    resizeDivWrapper("wrapAreas", 300);
    resizeDivWrapper("wrapResp", 300);
    resizeDivWrapper("wrapProyecto", 300);
    resizeDivWrapper("wrapEvalTotalProy", 200);
    resizeDivWrapper("divCapProyecto", 300);
    resizeDivWrapper("wrapCursoProy", 250);
    resizeDivWrapper("wrapActProyecto", 250);

    // Wrappers al editar un proyecto y dar click a una de las opciones. Modificar tamaño.

    resizeDivWrapper("wrapObservaciones", 155);
    resizeDivWrapper("wrapResumIncidentes", 120);

    resizeDivWrapper("wrapTrabProyecto", 250);
    resizeDivWrapper("wrapInduccEmpresa", 300);
    resizeDivWrapper("wrapTrabInducc", 300);
    resizeDivWrapper("wrapConsoInspecc", 300);
    resizeDivWrapper("wrapResumInspecc", 170);

    resizeDivWrapper("wrapResumDetaInspecc", 180);

    resizeDivWrapper("wrapResumAudiFinal", 180);
    resizeDivWrapper("wrapAccAudiRes", 220);
    resizeDivWrapper("wrapperAct", 220);

    resizeDivWrapper("wrapperCalendarioAct", 220);

    banderaEdicion = false;
    contratistaId = 0;

//   $("#btnTogleParam").on("click",function(){
//      $("#filtroUnidad").toggle();$("#filtroTipoReporte").toggle();
//      $(this).find("i").toggleClass("<i class='fa fa-arrow-up fa-2x'></i>");
//      $(this).find("i").toggleClass("<i class='fa fa-arrow-down fa-2x'></i>");
//   });
//
//   $("#btnClipTablaAnalisisObservacion").on("click",function(){
//      var list = obtenerDatosTablaEstandarNoFija("tblAnalisisObservacion");
//      copiarAlPortapapeles(list,"btnClipTablaAnalisisObservacion");
//
//      alert("Se han guardado los indicadores al Clipboard");
//   });
//
//   $("#btnClipTablaResInspecc").on("click",function(){
//      var list = obtenerDatosTablaEstandarNoFija("tblResumInspecc");
//      copiarAlPortapapeles(list,"btnClipTablaResInspecc");
//
//      alert("Se han guardado los datos al Clipboard");
//   });
//
//   $("#btnClipTablaResDetaInspecc").on("click",function(){
//      var list = obtenerDatosTablaEstandarNoFija("tblResumDetaInspecc");
//      copiarAlPortapapeles(list,"btnClipTablaResDetaInspecc");
//
//      alert("Se han guardado los datos al Clipboard");
//   });

    insertMenuPrimeraVez(function (data) {
        if (getSession("accesoUsuarios") == "2" || getSession("accesoUsuarios") == "6") {
            $(".nav-tabs").remove();
            $(".tab-content").remove();

            $("#btnCancelarEvalOnline").attr("onclick", "volverPostulanteEvaluacionOnline()");
            $("#btnGuardarEvalOnline").attr("onclick", "guardarPostulanteEvaluacionOnline()");

            switch (parseInt(getSession("accesoUsuarios"))) {
                case 2:
                    verLateralesFijosContratista();
                    completarBarraCarga();
                    break;

                case 6:
                    verLateralesFijosContratistaTrabajador();
                    marcarIconoModuloContratistaTrabajador(0);
                    completarBarraCarga();
                    break;
            }
        } else if (getSession("accesoUsuarios") == "14") {
            cargaInicialVistaDocumentos();
        } else {
            if (getSession("linkCalendarioInduccionId") != null) {
                insertMenu(function () {
                    $("#selTabContratista").val("9");
                    verAcordeTabContratista()
                    completarBarraCarga();
                });
            } else {
                $("#selTabContratista").val("8");
                verAcordeTabContratista();
//	    var dataParam={
//	       empresaId: getSession("gestopcompanyid")
//	    };
//
//	    var hoy = obtenerFechaActual();
//
//	    $('#modalAnalisisObservacion').on('shown.bs.modal',function(e){
//	       crearSelectOneMenuObligMultipleCompleto("selMultipleDivisionesFiltro","",
//	          listDivisiones,"id","nombre","#filtroUnidad","Todas");
//
//	       $("#filtroUnidad").prepend("<h4>Ver Unidades</h4>");
//
//	       crearSelectOneMenuObligMultipleCompleto("selMultipleTipoReporteFiltro","",
//	          listReporte,"id","nombre","#filtroTipoReporte","Todos");
//
//	       $("#filtroTipoReporte").prepend("<h4>Ver Reportes</h4>");
//	    });
//
//	    $("#fechaInicioProy").val(sumaFechaDias(-30,hoy));
//	    $("#fechaFinProy").val(sumaFechaDias(1,hoy));
//
//	    $("#fechaInicioResuDetaInsp").val(sumaFechaDias(-90,hoy));
//	    $("#fechaFinResuDetaInsp").val(sumaFechaDias(31,hoy));
//
//	    $("#fechaInicioResuInsp").val(sumaFechaDias(-90,hoy));
//	    $("#fechaFinResuInsp").val(sumaFechaDias(31,hoy));
//
//	    $("#fechaInicioEventoAudi").val(sumaFechaDias(-30,hoy));
//	    $("#fechaFinEventoAudi").val(sumaFechaDias(365,hoy));
//
//	    $("#fechaInicioEventoInsp").val(sumaFechaDias(-30,hoy));
//	    $("#fechaFinEventoInsp").val(sumaFechaDias(365,hoy));
//
//	    callAjaxPost(URL+'/contratista/filtro',dataParam,function(data){
//	       listProyectoActividadAudi = data.proyectos;
//	       listContratistasActividadAudi = data.contratistas;
//	       listResponsablesActividadAudi = data.respTotal;
//	       var listListasActividaDetalledAudi = data.tiposAuditoriaDetalle;
//	       var selTipoAudiDetalleResumen = crearSelectOneMenu("selTipoAudiDetalleResumen",
//		  "resumenUnidadDetalleAuditoriaContratista()",listListasActividaDetalledAudi,"","id","nombre","Todos");
//
//	       $("#divResumDetaInspecc form").append("Lista: "+selTipoAudiDetalleResumen);
//
//	       var selRespAudiProyecto = crearSelectOneMenu("selRespAudiProyecto","cargarAuditoriasProyecto(3)",
//	          data.respAudi,"","id","nombre","Todos");
//
//	       if(data.numTrabajadores > 0){
//		  selRespAudiProyecto = crearSelectOneMenuOblig("selRespAudiProyecto",
//		     "cargarAuditoriasProyecto(3)",data.respAudi,"","id","nombre");
//	       }
//
//	       $("#divAudi > .form-inline").append("Responsable: "+selRespAudiProyecto);
//	       //
//	       var selRespInspProyecto = crearSelectOneMenu("selRespInspProyecto","cargarAuditoriasProyecto(2)",
//		  data.respInsp,"","id","nombre","Todos");
//
//	       if(data.numTrabajadores > 0){
//		  selRespInspProyecto = crearSelectOneMenuOblig("selRespInspProyecto","cargarAuditoriasProyecto(2)",
//	             data.respInsp,"","id","nombre");
//	       }
//
//	       $("#divInspecc > .form-inline").append("Responsable: "+selRespInspProyecto);
//
//	       var listEstadoActividadAudi=[
//	          {id: 1,nombre: "Por implementar"},
//		  {id: 2,nombre: "Completado"},
//		  {id: 3,nombre: "Retrasado"}
//	       ];
//
//	       var contenido = "";
//
//	       var listContenido=[
//	          {sugerencia:"",label:"Desde",
//	           inputForm:"<input type='date' id='fechaInicioActividadAudi' class='form-control'>"},
//	          {sugerencia:"",label:"Hasta",
//	           inputForm:"<input type='date' id='fechaFinActividadAudi' class='form-control'>"},
//	          {sugerencia:"",label:"Tipo de actividad",inputForm:"",divContainer: "divTipoActividadAudi"},
//	          {sugerencia:"",label:"Contratista",inputForm:"",divContainer: "divContratistaActividadAudi" },
//	          {sugerencia:"",label:"Responsable",inputForm: "",divContainer: "divResponsableActividadAudi" },
//	          {sugerencia:"",label:"Estado",inputForm: "",divContainer: "divEstadoActividadAudi" },
//	          {sugerencia:"",
//	           label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroActividadAuditoria()'>" +
//	                    "<i class='fa fa-times'></i> Cancelar" +
//	                 "</button>",
//	           inputForm:"<button class='btn btn-success' type='button' onclick='cargarActividadesAuditoria()'>" +
//	           	        "<i class='fa fa-filter'></i> Aplicar filtro" +
//	           	     "</button>"}
//	       ];
//
//	       listContenido.forEach(function(val){
//	          contenido += obtenerSubPanelModuloGeneral(val);
//	       });
//
//	       var modalOptions={
//		  id: "modalFiltroActividadAudi",
//		  nombre: "<i class='fa fa-filter'></i> Filtros",
//		  contenido: contenido
//	       };
//
//	       crearModalPrincipalUsuario(modalOptions,function(){
//		  if($("#selTipoActividadAudi").length > 0){
//		     return;
//		  }
//
//		  crearSelectOneMenuObligMultipleCompleto("selTipoActividadAudi","",listTipoActividadAudi,
//		     "id","nombre","#divTipoActividadAudi","Todos");
//
//		  crearSelectOneMenuObligMultipleCompleto("selContratistaActividadAudi","",data.contratistas,
//		     "id","nombre","#divContratistaActividadAudi","Todos");
//
//		  crearSelectOneMenuObligMultipleCompleto("selResponsableActividadAudi","",data.respTotal,
//		     "id","nombre","#divResponsableActividadAudi","Todos");
//
//		  crearSelectOneMenuObligMultipleCompleto("selEstadoActividadAudi","",listEstadoActividadAudi,
//		     "id","nombre","#divEstadoActividadAudi","Todos");
//	       },false);
//
//	       $("#fechaInicioActividadAudi").val(sumaFechaDias(-600,hoy));
//	       $("#fechaFinActividadAudi").val(sumaFechaDias(365,hoy));
//
//
//	       //***************************  Calendario ********************************
//	       var listTipoActividadAudiCalendario=[
//	          {id: 3,nombre: "Auditoría"},
//		//{id : 2,nombre:"Inspección"},
//		  {id: 94,nombre: "Hallazgos Libres"}
//	       ];
//
//	       var listEstadoActividadAudiCalendario=[
//	          {id: 1,nombre: "Por implementar"},
//	          {id: 2,nombre: "Completado"},
//		  {id: 3,nombre: "Retrasado"}
//	       ];
//
//	       var contenidoCalendario = "";
//
//	       var listContenidoCalendario=[
//	          //{sugerencia:"",label:"Desde",inputForm:"<input type='date' id='fechaInicioActividadAudi' class='form-control'>"},
//                  // {sugerencia:"",label:"Hasta",inputForm:"<input type='date' id='fechaFinActividadAudi' class='form-control'>"},
//	            {sugerencia:"",label:"Tipo de actividad",inputForm:"",divContainer: "divTipoActividadAudiCalendario"},
//	            {sugerencia:"",label:"Contratista",inputForm:"",divContainer: "divContratistaActividadAudiCalendario" },
//	            {sugerencia:"",label:"Responsable",inputForm: "",divContainer: "divResponsableActividadAudiCalendario" },
//                 // {sugerencia:"",label:"Estado",inputForm: "",divContainer: "divEstadoActividadAudi" },
//		    {sugerencia:"",
//	             label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroActividadCalendarioAuditoria()'>" +
//	                      "<i class='fa fa-times'></i> Cancelar" +
//	                   "</button>",
//		     inputForm:"<button class='btn btn-success' type='button' onclick='cargarCalendarioActividadesAuditoria()'>" +
//		     	          "<i class='fa fa-filter'></i> Aplicar filtro" +
//		     	       "</button>"}
//	       ];
//
//	       listContenidoCalendario.forEach(function(val){
//	          contenidoCalendario += obtenerSubPanelModuloGeneral(val);
//	       });
//
//	       var modalOptions={
//		  id: "modalFiltroActividadAudiCalendario",
//		  nombre: "<i class='fa fa-filter'></i> Filtros",
//		  contenido: contenidoCalendario
//	       };
//
//	       crearModalPrincipalUsuario(modalOptions,function(){
//	          if($("#selTipoActividadAudiCalendario").length > 0){
//		     return;
//	          }
//
//	          crearSelectOneMenuObligMultipleCompleto("selTipoActividadAudiCalendario","",listTipoActividadAudi,
//		     "id","nombre","#divTipoActividadAudiCalendario","Todos");
//
//	          crearSelectOneMenuObligMultipleCompleto("selContratistaActividadAudiCalendario","",data.contratistas,
//		     "id","nombre","#divContratistaActividadAudiCalendario","Todos");
//
//	          crearSelectOneMenuObligMultipleCompleto("selResponsableActividadAudiCalendario","",data.respTotal,
//		     "id","nombre","#divResponsableActividadAudiCalendario","Todos");
//
//	          crearSelectOneMenuObligMultipleCompleto("selEstadoActividadAudiCalendario","",listEstadoActividadAudi,
//		     "id","nombre","#divEstadoActividadAudiCalendario","Todos");
//	       },false);
//	//
//	       insertMenu(function(){
//		  $("#selTabContratista").val("8");
//		  crearFiltroProyecto(verAcordeTabContratista);
//	       });
//	    });
            }
        }
    });

    $("#flechaIzquierdaPrincipalCont").on('click',function(){
        numPaginaActualPrincipalCont= numPaginaActualPrincipalCont-1;
        cambiarPaginaConsolidadoPrincipalOpcionContratista();
    });

    $('#flechaDerechaPrincipalCont').on('click',function(){
        numPaginaActualPrincipalCont = numPaginaActualPrincipalCont+1;
        cambiarPaginaConsolidadoPrincipalOpcionContratista();
    });
    
    $("#flechaIzquierdaPrincipalProySeg").on('click',function(){
	numPaginaActualPrincipalProySeg = numPaginaActualPrincipalProySeg-1;
	cambiarPaginaTablaFullProyecto();
    });

    $('#flechaDerechaPrincipalProySeg').on('click',function(){
	numPaginaActualPrincipalProySeg = numPaginaActualPrincipalProySeg+1;
	cambiarPaginaTablaFullProyecto();
    });
});

function verFiltroActividadesAuditoria() {
    $("#modalFiltroActividadAudi").modal("show");
}

function ocultarFiltroActividadAuditoria() {
    $("#modalFiltroActividadAudi").modal("hide");
}

function cargarActividadesAuditoria() {

    var valorResize = 160;
    resizeDivWrapper("wrapProyecto", valorResize);
    // console.log("Con "+valorResize);


    ocultarFiltroActividadAuditoria();

    var listTipos = $("#selTipoActividadAudi").val();
    var listTipoAuditoriaId = [];
    if (listTipos != null) {
        listTipos.forEach(function (val, index) {
            listTipoAuditoriaId.push(parseInt(val));
        });
    }
    var listContr = $("#selContratistaActividadAudi").val();
    var listContratistaId = [];
    if (listContr != null) {
        listContr.forEach(function (val, index) {
            listContratistaId.push(parseInt(val));
        });
    }
    var listRespp = $("#selResponsableActividadAudi").val();
    var listTrabajadorId = [];
    if (listRespp != null) {
        listRespp.forEach(function (val, index) {
            listTrabajadorId.push(parseInt(val));
        });
    }
    var listEst = $("#selEstadoActividadAudi").val();
    var listEstadoId = [];
    if (listEst != null) {
        listEst.forEach(function (val, index) {
            listEstadoId.push(parseInt(val));
        });
    }
    var dataParam = {
        isInforme: 2,
        listTipoAuditoriaId: (listTipoAuditoriaId.length == 0 ? null : listTipoAuditoriaId),
        listContratistaId: (listContratistaId.length == 0 ? null : listContratistaId),
        listTrabajadorId: (listTrabajadorId.length == 0 ? null : listTrabajadorId),
        listEstadoId: (listEstadoId.length == 0 ? null : listEstadoId),
        idCompany: getSession("gestopcompanyid"),
        fechaInicioPresentacion: $("#fechaInicioActividadAudi").val(),
        fechaFinPresentacion: $("#fechaFinActividadAudi").val(),

    }
    callAjaxPost(URL + "/auditoria", dataParam, function (data) {
        $("#tblActivAudi tbody tr").remove();
        data.list.forEach(function (val) {
            /*
			var rptaSi=val.rptaSi;
			var rptaParc=val.rptaParcial;
			var rptaNo=val.rptaNo;
			var rptaRP=val.rptaRP;
			var rptaFaltante=val.rptaRespondida;


			var puntaje=rptaSi*1+rptaParc*0.5+rptaRP*0.75+rptaNo*0;
			var puntajeMax=rptaSi+rptaParc+rptaRP+rptaNo;
			*/
            var auditoriaTipoAux = val.auditoriaTipo;
            $("#tblActivAudi tbody").append("<tr>" +

                "<td >" + val.auditoriaTipoNombre + "</td>" +
                //"<td >" + val.auditoriaNombre+ "</td>" +
                "<td >" + val.auditoriaNombre + "</td>" +
                "<td >" + val.contratistaNombre + "</td>" +
                "<td >" + val.proyecto.titulo + "</td>" +
                "<td >" + val.fechaPlanificadaNombre + "</td>" +
                "<td >" + val.horaPlanificadaTexto + "</td>" +
                "<td >" + val.trabajador.nombre + "</td>" +
                "<td >" + val.auditoriaFechaTexto + "</td>" +
                "<td   style='color:" +
                (auditoriaTipoAux == 94 ? "" : colorPuntaje(val.puntajePonderado)) + ";font-weight:bold'>"
                + (auditoriaTipoAux == 94 ? "N.A." :
                    pasarDecimalPorcentaje(val.puntajePonderado, 2)) + "</td>" +

                "<td   style='color:" +
                (auditoriaTipoAux == 94 ? "red" : "") + ";font-weight:bold'>"
                + (auditoriaTipoAux == 94 ? val.numHallazgos + " hallazgo(s) <br> <a onclick='verHallazgosInspeccion(" + val.auditoriaId + ")' class='efectoLink'><i class='fa fa-eye'></i>Ver</a>" :
                    "N.A.") + "</td>" +
                "<td >" + val.estadoImplementacionNombre + "</td>" +
                "" +
                "" +
                "</tr>");
        });
        goheadfixedY("#tblActivAudi", "#wrapperAct")
    });
}

function procesarGuardarEncabezado(data) {
    switch (data.CODE_RESPONSE) {
        case "05":

            llamarEncabezados();
            break;
        default:
            alert("Ocurrió un error al guardar la empresa!");
    }
}

function verHallazgosInspeccion(auditoriaId) {

    var dataParam = {

        auditoriaId: auditoriaId
    };
    callAjaxPost(URL + "/auditoria/hallazgos", dataParam, function (data) {
        if (data.CODE_RESPONSE == "05") {
            var contenido = "<div class='wrapper' id='wrapperHallInspSeguim'>" +
                "<table id='tblHallInspSeguim' class='table table-striped table-bordered table-hover table-fixed'>" +
                "<thead>" +
                "<tr>" +
                "<td class='tb-acc' style='width : 200px'>Descripción</td>" +
                "<td class='tb-acc' style='width : 200px'>Tipo de reporte</td>" +
                "<td class='tb-acc' style='width : 200px'>Nivel de Riesgo</td>" +
                "<td class='tb-acc' style='width : 200px'>Factor de seguridad</td>" +
                "<td class='tb-acc' style='width : 200px'>Lugar específico</td>" +
                "<td class='tb-acc' style='width : 200px'>Partes interesada (nivel empresa)</td>" +
                "<td class='tb-acc' style='width : 200px'>Acciones de Mejora</td>" +
                "<td class='tb-acc' style='width : 200px'>Evidencia del Evento</td>" +
                "" +
                "</tr></thead>" +
                "<tbody></tbody>" +
                "</table>" +
                "</div>";
            var modalOption = {
                maxWidth: "90%",
                id: "modalSeguiAudiHall",
                nombre: "Hallazgos de inspección",
                contenido: contenido
            }
            crearModalPrincipalUsuario(modalOption, function () {
            }, false, true);
            resizeDivWrapper("wrapperHallInspSeguim", 200);
            data.list.forEach(function (val, index) {
                var textoEvi = "Sin asignar";
                if (val.evidenciaNombre != "" && val.evidenciaNombre != "----") {
                    textoEvi = "" + val.evidenciaNombre + "<br>" +
                        "<a target='_blank' href='" + URL
                        + "/auditoria/hallazgo/evidencia?hallazgoId=" + val.id + "' class='efectoLink'><i class='fa fa-download'></i>Descargar</a><br>" +
                        "<a id='linkeviHall" + val.id + "' class='efectoLink'><i class='fa fa-eye'></i>Vista Previa</a>";
                }

                $("#tblHallInspSeguim").append("<tr>"
                    + "<td >" + val.descripcion + "</td>"
                    + "<td>" + val.tipoReporte.nombre + "</td>"
                    + "<td >" + val.nivel.nombre + "</td>"
                    + "<td>" + val.factor.nombre + "</td>"
                    + "<td >" + val.lugar + "</td>"
                    + "<td >" + val.seccionesNombre + "</td>"
                    + "<td >"
                    + val.numAcciones
                    //+("<a class='efectoLink' onclick='marcarHallazgoIndex("+index+");cargarAccionesHallazgosProyecto("+val.id+")'>"+
                    //		"<i class='fa fa-list'></i>"+val.numAcciones+"</a>")
                    + "</td>"
                    + "<td id='tdeviHall" + val.id + "'>" + (textoEvi) + "</td>" +
                    "</tr>");
                $("#linkeviHall" + val.id).on("click", function (e) {
                    var hallzgoId = parseInt($(this).prop("id").substr(11, 19));

                    callAjaxPost(URL + '/auditoria/hallazgos/id', {id: hallzgoId},
                        function (data) {
                            var alturaAux = 140;
                            var imagenPrevia = insertarImagenParaTablaMovil(data.hallazgo.evidencia, alturaAux + "px", "100%");
                            $("#linkeviHall" + hallzgoId).remove();
                            $("#tdeviHall" + hallzgoId).append(imagenPrevia);
                        }, function () {
                            $("#linkeviHall" + hallzgoId).html("Cargando <i class='fa fa-cog'></i>");
                        });


                });
            });
        } else {
            alert("OCURRiÓ un errorr")
        }
    });
}

function volverDivContratista() {
    $("#tabContratistas").find(".container-fluid").hide();
    $("#tabContratistas").find("#divGeneralContratista").show();
    $("#tabContratistas").find("h2").html("<label>Contratistas</label>");
}

function listarContratistas(){
    resizeDivWrapper("wrapContratista",180);
    idTipoEncabezado = 1;contratistaId = 0;

    $("#btnGuardarContratista").hide();$("#btnCancelarContratista").hide();$("#btnEliminarContratista").hide();
    $("#btnNuevoContratista").show();$("#btnImportContratista").show();$("#btnResetBuscadorContratista").show();
    $("#btnAplicarBuscadorContratista").show();$("#valBuscarRucNomContratistaPrincipal").show();$("#indicadorPaginaParcialAuxPrincipalCont").show();
    $("#btnConfigGenContratista").show();
    
    banderaEdicion = false;volverDivContratista();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPost(URL+'/contratista/vista_admin',dataParam,procesarListarContratista);
}

// function verResumenTrabajadoresContratistas() {
//     $("#modalResumenTrabajadores").modal("show");
//     $("#tblResumenTrabajadoresContratista tbody tr").remove();
//     listFullContratista.forEach(function (val, index) {
//         val.trabajadores.forEach(function (val1, index1) {
//             var hasExamen = false, hasSctr = false;
//             var textoExamen = "<i class='fa fa-times' aria-hidden='true'> </i>" +
//                     "Sin examen médico",
//                 textoSctr = "<i class='fa fa-times' aria-hidden='true'> </i> " +
//                     "Sin SCTR";
//             if (val1.indicadorExamenMedico != null) {
//                 hasExamen = true;
//                 textoExamen = "<i class='fa fa-check' aria-hidden='true'> </i>" +
//                     "Examen vigente: " + val1.indicadorExamenMedico
//             }
//             if (val1.indicadorSctr != null) {
//                 hasSctr = true;
//                 textoSctr = "<i class='fa fa-check' aria-hidden='true'> </i>" +
//                     "SCTR vigente: " + val1.indicadorSctr;
//             }
//             $("#tblResumenTrabajadoresContratista tbody").append(
//                 "<tr > " +
//                 " <td>" + val.nombre + "</td>" +
//                 " <td>" + val1.nombre + "</td>" +
//                 " <td>" + val1.tipoDocumento.nombre + "</td>" +
//                 " <td>" + val1.nroDocumento + "</td>" +
//                 " <td>" + val1.area + "</td>" +
//                 " <td>" + val1.cargo + "</td>" +
//                 " <td>" + textoExamen + "</td>" +
//                 " <td>" + textoSctr + "</td>" +
//                 "" +
//                 "</tr>"
//             );
//         });
//     });
// }

var listDivisiones,listReporte;

function procesarListarContratista(data){
    switch(data.CODE_RESPONSE){
        case "05":
            listFullContratista = data.list;listPerfilContratistaAsociado = data.listPerfiles;

            busquedaActivaPrincipalCont = 0,numPaginaActualPrincipalCont = 1;

            cambiarPaginaConsolidadoPrincipalOpcionContratista();

            goheadfixedY("#tblContratista","#wrapContratista");
            formatoCeldaSombreable(true);completarBarraCarga();

            break;

        default:
            alert("Ocurrió un error al traer las empresas!");
    }
}

function cambiarPaginaConsolidadoPrincipalOpcionContratista(){
    $("#flechaIzquierdaPrincipalCont").show();$("#flechaDerechaPrincipalCont").show();

    var list = (busquedaActivaPrincipalCont == 0?listFullContratista:listFullContratistaBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualPrincipalCont*partialSize)-partialSize;
    var finRegistro = (numPaginaActualPrincipalCont*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasPrincipalCont").html("<label>"+numPaginaActualPrincipalCont+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualPrincipalCont == 1){
        $("#flechaIzquierdaPrincipalCont").hide();
    }

    if(numPaginaActualPrincipalCont == numPaginaTotal){
        $("#flechaDerechaPrincipalCont").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblContratista tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
            var perfilNombre = (val.perfil.nombre.trim().length == 0?"------":val.perfil.nombre),
                nombreContacto = (val.contacto.trim().length == 0?"------":val.contacto),
                correoContacto = (val.contactoCorreo.trim().length == 0?"------":val.contactoCorreo),
                nombreContactoExtra = (val.contactoExtra.trim().length == 0?"------":val.contactoExtra),
                correoContactoExtra = (val.contactoExtraCorreo.trim().length == 0?"------":val.contactoExtraCorreo),
                estadoActual = (val.isActivo == 1?"Sí":"No"),nombreLogo = (val.logoNombre.trim().length == 0?"------":val.logoNombre),
                contrasenia = (val.fechaUltimaActClaveTexto.length == 0?"**********":"<label>*Encriptada.</label>"),
                detalleActContrasenia = (val.fechaUltimaActClaveTexto.length == 0?"------":val.fechaUltimaActClaveTexto+"<br>(por "+val.usuarioActClave.nombre+")");

            $("#tblContratista tbody").append(
                "<tr id='trContratista"+val.id+"' onclick='javascript:editarContratista("+index+")'>" +
                    "<td id='"+val.id+"ruc'>"+val.ruc+"</td>" +
                    "<td id='"+val.id+"nombre'>"+val.nombre+"</td>" +
                    // "<td id='"+val.id+"tipoContratista'>"+val.tipoContratista.nombre+"</td>" +
                    "<td id='"+val.id+"perfil'>"+perfilNombre+"</td>" +
                    // "<td id='"+val.id+"direccion'>"+val.direccion+"</td>" +
                    // "<td id='"+val.id+"activi'>"+val.actividad+"</td>" +
                    // "<td id='"+val.id+"segur'>"+val.seguro+"</td>" +
                    // "<td id='"+val.id+"anio'>"+val.anioInicio+"</td>" +
                    "<td id='"+val.id+"contact' style='word-break:break-all;'>"+nombreContacto+"</td>" +
                    "<td id='"+val.id+"contactc' style='word-break:break-all;'>"+correoContacto+"</td>" +
                    "<td id='"+val.id+"contactex' style='word-break:break-all;'>"+nombreContactoExtra+"</td>" +
                    "<td id='"+val.id+"contactcex' style='word-break:break-all;'>"+correoContactoExtra+"</td>" +
                    "<td id='contisact"+val.id+"'>"+estadoActual+"</td>" +
                    "<td id='"+val.id+"proy'>"+val.numProyectosAsignados+"</td>" +
                    "<td id='"+val.id+"obs'>"+val.numObservacionesCerradas+"/"+val.numObservacionesTotal+"</td>" +
                    // "<td id='"+val.id+"inc'>"+val.numIncidentesRelacionados+"</td>" +
                    "<td id='"+val.id+"numDocumentosAsoc'>"+val.numDocumentosAsociados+"</td>" +
                    "<td id='"+val.id+"numTrabCont'>"+val.numTrabajadoresContratista+"</td>" +
                    "<td id='"+val.id+"numVehMaq'>"+val.numVehiculosMaquinarias+"</td>" +
                    "<td id='"+val.id+"numEquHerr'>"+val.numEquiposHerramientas+"</td>" +
                    "<td id='"+val.id+"logo' style='word-break:break-all;'>"+nombreLogo+"</td>" +
                    "<td id='"+val.id+"fechaRegTexto'>"+val.fechaRegistroTexto+"</td>" +
                    "<td id='"+val.id+"fechaActTexto'>"+val.fechaActualizacionTexto+"</td>" +
                    "<td id='"+val.id+"tdpass'>"+contrasenia+"</td>" +
	            "<td id='"+val.id+"tdFechaActUltimoPass'>"+detalleActContrasenia+"</td>" +
	            "<td id='"+val.id+"tdFechaUltimoAcceso'>"+val.fechaUltimoAccesoTexto+"</td>" +
                "</tr>");
        }
    });

    $.unblockUI();
}

function aplicarBuscadorContratista(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valorBuscador = igualarStringBuscar($("#valBuscarRucNomContratistaPrincipal").val());
    listFullContratistaBuscador = [];busquedaActivaPrincipalCont = 1;numPaginaActualPrincipalCont = 1;

    listFullContratista.forEach(function(val,index){
        if(igualarStringBuscar(val.ruc).indexOf(valorBuscador) != -1 ||
            igualarStringBuscar(val.nombre).indexOf(valorBuscador) != -1){
            listFullContratistaBuscador.push(val);
        }
    });

    cambiarPaginaConsolidadoPrincipalOpcionContratista();
}

function reiniciarBuscadorContratista(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    $("#valBuscarRucNomContratistaPrincipal").val("").focus();
    busquedaActivaPrincipalCont = 0;numPaginaActualPrincipalCont = 1;

    cambiarPaginaConsolidadoPrincipalOpcionContratista();
}

function editarContratista(pindex) {
    if(!banderaEdicion) {
        contratistaObj = (busquedaActivaPrincipalCont == 0?listFullContratista[pindex]:listFullContratistaBuscador[pindex]);
        contratistaId = contratistaObj.id;

        $("#trContratista"+contratistaId).addClass("fila-edicion");

        $("#"+contratistaId+"ruc").html("<input id='inputRuc' type='text' class='form-control' onkeydown='return IsNumeric(event);' " +
            "onkeyup='return IsNumericRestriccion(event);'>");
        $("#inputRuc").val(contratistaObj.ruc);

        $("#"+contratistaId+"nombre").html("<input id='inputRS' type='text' class='form-control'>");
        $("#inputRS").val(contratistaObj.nombre);

        var selPerfilContratista = crearSelectOneMenuOblig("selPerfilContratista","",
            listPerfilContratistaAsociado,contratistaObj.perfil.id,"id","nombre")
        $("#"+contratistaId+"perfil").html(selPerfilContratista);

        $("#"+contratistaId+"contact").html("<input id='inputContacto' type='text' class='form-control'>");
        $("#inputContacto").val(contratistaObj.contacto);

        $("#"+contratistaId+"contactc").html("<input id='inputContactoCorreo' type='text' class='form-control'>");
        $("#inputContactoCorreo").val(contratistaObj.contactoCorreo);

        $("#"+contratistaId+"contactex").html("<input id='inputContactoExtra' type='text' class='form-control'>");
        $("#inputContactoExtra").val(contratistaObj.contactoExtra);

        $("#"+contratistaId+"contactcex").html("<input id='inputContactoCorreoExtra' type='text' class='form-control'>");
        $("#inputContactoCorreoExtra").val(contratistaObj.contactoExtraCorreo);

        var textIsActivo = (contratistaObj.isActivo == 1?"checked":"");
        $("#contisact"+contratistaId).html("<input id='checkIsActivoContratista' type='checkbox' class='form-control' "+textIsActivo+">");

        if(contratistaObj.numProyectosAsignados > 0){
            $("#"+contratistaId+"proy").addClass("linkGosst").on("click",function(){
                verConsolidadoProyectosAsignadosVistaAdmin();
            }).html(contratistaObj.numProyectosAsignados+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
        }

        if(contratistaObj.numObservacionesTotal > 0){
            $("#"+contratistaId+"obs").addClass("linkGosst").on("click",function(){
                verConsolidadoObservacionesRegistradasVistaAdmin();
            }).html(contratistaObj.numObservacionesCerradas+"/"+contratistaObj.numObservacionesTotal+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
        }

        if(contratistaObj.numTrabajadoresContratista > 0){
            $("#"+contratistaId+"numTrabCont").addClass("linkGosst").on("click",function(){
                verConsolidadoTrabajadoresContratistaVistaAdmin();
            }).html(contratistaObj.numTrabajadoresContratista+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
        }
      
        if(contratistaObj.numVehiculosMaquinarias > 0){
            $("#"+contratistaId+"numVehMaq").addClass("linkGosst").on("click",function(){
                verConsolidadoVehiculosMaquinariasVistaAdmin();
            }).html(contratistaObj.numVehiculosMaquinarias+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
        }
      
        if(contratistaObj.numEquiposHerramientas > 0){
            $("#"+contratistaId+"numEquHerr").addClass("linkGosst").on("click",function(){
	            verConsolidadoEquiposHerramientasVistaAdmin();
            }).html(contratistaObj.numEquiposHerramientas+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
        }

        var options={
            container:"#"+contratistaObj.id+"logo",functionCall:function(){
                validacionSubirEvidencia("Contratista"+contratistaObj.id,bitsLogoEmpresa,"");
            },descargaUrl:"/contratista/logo/evidencia?id="+contratistaObj.id,
            esNuevo:(contratistaObj.logoNombre.length == 0?true:false),
            idAux:"Contratista"+contratistaObj.id,evidenciaNombre:contratistaObj.logoNombre
        };

        crearFormEvidenciaCompleta(options);
        
        if(contratistaObj.fechaUltimaActClaveTexto.length == 0){
            $("#"+contratistaId+"tdpass").html("<input id='inputPassContr' type='text' class='form-control' placeholder='Pass'>");
            $("#inputPassContr").val(contratistaObj.contrasenia);
        }else{
	    $("#"+contratistaId+"tdpass").addClass("linkGosst").on("click",function(){
                verCambiarPasswordEncriptadaContratista();
            }).html("<i class='fa fa-pencil fa-2x' aria-hidden='true'></i> Cambiar");
        }

        formatoCeldaSombreableTabla(false,"tblContratista");

        $("#btnGuardarContratista").show();$("#btnCancelarContratista").show();$("#btnNuevoContratista").hide();
        $("#btnEliminarContratista").show();$("#btnImportContratista").hide();$("#btnResetBuscadorContratista").hide();
        $("#btnAplicarBuscadorContratista").hide();$("#valBuscarRucNomContratistaPrincipal").hide();$("#indicadorPaginaParcialAuxPrincipalCont").hide();
        $("#btnConfigGenContratista").hide();

        banderaEdicion = true;
    }
}

function verDocumentosContratista() {
    $("#tabContratistas").find(".container-fluid").hide();
    $("#tabContratistas").find("#divDocsContratista").show();

    $("#tabContratistas").find("h2").html(
        "<a onclick='volverDivContratista();'> Contratista '" + contratistaObj.nombre + "'</a> " +
        "> Documentos Adicionales");

    callAjaxPost(URL + '/contratista/examenes', {
        id: contratistaObj.id,
        examen: {tipo: {id: 5}},
        perfil: {id: null}
    }, function (data) {
        $("#divDocsContratista table tbody tr").remove();

        data.examenes.forEach(function (val, index) {
            var btnEvidencia = (val.evidenciaNombre.length == 0 ? "------" :
                "<a class='btn btn-success' target='_blank' href='" + urlArchivo(val.evidenciaUrl) + "'>" +
                "<i aria-hidden='true' class='fa fa-download'></i> Descargar" +
                "</a>");

            $("#divDocsContratista table tbody").append(
                "<tr>" +
                "<td>" + val.tema + "</td>" +
                "<td>" + btnEvidencia + "</td>" +
                "</tr>");
        });
    });
}

function verObservacionesAsociadas() {
    $("#mdAsociados").modal('show');
    $("#mdAsociados #mdProgFechaLabel").html("Resumen Observaciones - " + contratistaNombre);

    $("#proyAsociados").hide();
    $("#obsAsociados").show();
}

function verProyectosAsociados() {
    $("#mdAsociados").modal('show');
    $("#mdAsociados #mdProgFechaLabel").html("Resumen del estado de proyectos - " + contratistaNombre);

    $("#obsAsociados").hide();
    $("#proyAsociados").show();
}

function nuevoContratista(){
    if(!banderaEdicion){
        contratistaId = 0;

        var selPerfilContratista = crearSelectOneMenu("selPerfilContratista","",
            listPerfilContratistaAsociado,"","id","nombre");

        // var selTipoContratista = crearSelectOneMenuOblig("selTipoContratista","",
        //     listTipoContratista,"","id","nombre");

        $("#tblContratista tbody:first").prepend(
            "<tr id='0'>" +
                "<td><input id='inputRuc' type='text' onkeydown='return IsNumeric(event);' onkeyup='return IsNumericRestriccion(event);' " +
                           "class='form-control' autofocus='true'></td>" +
                "<td><input id='inputRS' type='text' class='form-control'></td>" +
                // "<td>"+selTipoContratista+"</td>" +
                "<td>"+selPerfilContratista+"</td>" +
                // "<td><input id='inputDom' type='text' class='form-control'></td>" +
                // "<td><input id='inputActividad' type='text' class='form-control'></td>" +
                // "<td><input id='inputSeguro' type='text' class='form-control'></td>" +
                // "<td><input id='inputAnioInicio' type='text' onkeypress='return IsNumeric(event);' class='form-control'></td>" +
                "<td><input id='inputContacto' type='text' class='form-control'></td>" +
                "<td><input id='inputContactoCorreo' type='text' class='form-control'></td>" +
                "<td><input id='inputContactoExtra' type='text' class='form-control'></td>" +
                "<td><input id='inputContactoCorreoExtra' type='text' class='form-control'></td>" +
                "<td><input id='checkIsActivoContratista' type='checkbox' class='form-control' checked></td>" +
                "<td>...</td>" +
                "<td>...</td>" +
                "<td>...</td>" +
                "<td>...</td>" +
                "<td>...</td>" +
                "<td>...</td>" +
                "<td id='0logo'>...</td>" +
                "<td><label>*Automático.</label></td>" +
                "<td>...</td>" +
                "<td><label>*Automático.</label></td>" +
                "<td>...</td>" +
                "<td>...</td>" +
            "</tr>");

        var options={
            container:"#"+contratistaId+"logo",functionCall:function(){
                validacionSubirEvidencia("Contratista"+contratistaId,bitsLogoEmpresa,"");
            },descargaUrl:"",esNuevo:true,idAux:"Contratista"+contratistaId,evidenciaNombre:""
        };

        crearFormEvidenciaCompleta(options);

        formatoCeldaSombreableTabla(false,"tblContratista");

        $("#btnGuardarContratista").show();$("#btnCancelarContratista").show();$("#btnNuevoContratista").hide();
        $("#btnEliminarContratista").hide();$("#btnImportContratista").hide();$("#btnResetBuscadorContratista").hide();
        $("#btnAplicarBuscadorContratista").hide();$("#valBuscarRucNomContratistaPrincipal").hide();$("#indicadorPaginaParcialAuxPrincipalCont").hide();
        $("#btnConfigGenContratista").hide();

        banderaEdicion = true;
    }else{
        alert("Guarde primero.");
    }
}

function eliminarContratista() {
    if (contratistaObj.numProyectosAsignados == 0 && contratistaObj.numDocumentosAsociados == 0) {
        mensajeUx = "<label>¿Está seguro de eliminar al contratista seleccionado?</label>";
        mensajesUx(mensajeUx, 3, "", "ConfContratista");

        $("#btnDevolverValorConfContratista").on("click", function () {
            var dataParam = {
                id: contratistaId
            };

            callAjaxPost(URL + '/contratista/delete', dataParam, function (data) {
                switch (data.CODE_RESPONSE) {
                    case "05":
                        mensajeUx = "<label>El contratista seleccionado se ha eliminado " +
                            "correctamente.</label>"
                        mensajesUx(mensajeUx, 1, "");

                        listarContratistas();
                        banderaEdicion = false;

                        break;

                    default:
                        alert("Ocurrió un error al eliminar al contratista!");
                }
            });
        });
    } else {
        mensajeUx = "<label>No se puede eliminar el registro seleccionado porque el contratista " +
            "tiene asociados uno o más proyectos y/o documentos.</label>";
        mensajesUx(mensajeUx, 2, "");
    }
}

function cancelarNuevoContratista() {
    listarContratistas();
}

function guardarContratista() {
    var campoVacio = true;

    var muchoRuc = false;

    var ruc = $("#inputRuc").val().trim();
    var razonSocial = $("#inputRS").val().trim();
    var contrasenia = (contratistaId == 0 || contratistaObj.fechaUltimaActClaveTexto.length > 0?null:$("#inputPassContr").val().trim());
    var perfilId = parseInt($("#selPerfilContratista").val());
    var contacto = $("#inputContacto").val().trim();
    var contactoCorreo = $("#inputContactoCorreo").val().trim();
    var contactoExtra = $("#inputContactoExtra").val().trim();
    var contactoExtraCorreo = $("#inputContactoCorreoExtra").val().trim();
    var isActivo = ($("#checkIsActivoContratista").prop("checked")?1:0);
    var evidenciaNombre = $("#inputEviContratista"+contratistaId).val();

    if(ruc.length == 0 || razonSocial.length == 0 || perfilId == -1){
        campoVacio = false;mensajeUx = "<label>Debe completar el RUC, razón social y perfil.</label>";
    }else if(ruc.length > 12){
        campoVacio = false;mensajeUx = "<label>RUC no válido (máximo 12 dígitos).</label>";
    }else if(contactoCorreo.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoCorreo)){
        campoVacio = false;mensajeUx = "<label>Debe registrar un correo válido de la persona de contacto.</label>";
    }else if(contactoExtraCorreo.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoExtraCorreo)){
        campoVacio = false;mensajeUx = "<label>Debe registrar un correo válido de la persona de contacto extra.</label>";
    }else if(evidenciaNombre == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
    }

    if(campoVacio){
        var dataParam={
            id:contratistaId,ruc:ruc,nombre:razonSocial,perfil:{id:perfilId},contacto:contacto,contactoCorreo:contactoCorreo,contactoExtra:contactoExtra,
            contactoExtraCorreo:contactoExtraCorreo,isActivo:isActivo,actividad:"",seguro:"",anioInicio:"",direccion:"",tipoContratista:{id:1},
            empresaId:parseInt(getSession("gestopcompanyid"))
        };
        
        if(contratistaId > 0){
            var snContraseniaEncriptada = (contratistaObj.fechaUltimaActClaveTexto.length == 0?0:1);
            dataParam.snContraseniaEncriptada = snContraseniaEncriptada;
            
            if(snContraseniaEncriptada == 0){
                dataParam.contrasenia = contrasenia;
            }
        }

        callAjaxPostSimpleVersionDos(1,URL+'/contratista/save/version_dos',dataParam,1,0,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    if(data.mensaje.length > 0){
                        $.unblockUI();mensajeUx = "<label>"+data.mensaje+"</label>";
                        mensajesUx(mensajeUx,2,"","");
                    }else{
                        guardarEvidenciaAutoVersionTres(1,data.nuevoId,"fileEviContratista"+contratistaId,bitsLogoEmpresa,0,1,
                        "/contratista/logo/evidencia/save",function(){
                            mensajeUx = "<label>El registro del contratista se guardó con éxito.</label>";
                            mensajesUx(mensajeUx,1,"","ActualizarOpcCont");

                            $("#modalMensajeUxActualizarOpcCont").on("hidden.bs.modal",function(){
                                listarContratistas();
                            });
                        });
                    }

                    break;

                default:
                    alert("Ocurrió un error al guardar el registro del contratista.");
            }
        });
    }else{
        mensajesUx(mensajeUx,2,"","");
    }
}

function mostrarCargarImagen(companyId) {
    $('#mdUpload').modal('show');
    $('#btnUploadLogo').attr("onclick",
        "javascript:uploadLogo(" + companyId + ");");
}

function llamarReporteObservaciones() {

    $("#modalAnalisisObservacion").modal("show");


    $("#divAnalisisObservacion").show();
    $("#divGraficoBarObservacion").hide();
    $("#divGraficoPieObservacion").hide();
}

function ocultarCuadrosIndicadores() {
    $("#divAnalisisObservacion").hide();
    $("#divGraficoBarObservacion").hide();
    $("#divGraficoPieObservacion").hide();
}

function generarTablaObservacion() {

    $("#divAnalisisObservacion").show();
    $("#divGraficoBarObservacion").hide();
    $("#divGraficoPieObservacion").hide();
    var head = "", subHead = "", body = "";
    var listFullActualObj = [];
    var fechaInicio = $("#fechaInicioProy").val();
    var fechaFin = $("#fechaFinProy").val();
    var tipoAgrupacion = parseInt($("#slcTipoProy").val());

    var listUnidades = $("#selMultipleDivisionesFiltro").val();
    var listUnidadesId = [];
    if (listUnidades != null) {
        listUnidades.forEach(function (val, index) {
            listUnidadesId.push(parseInt(val));
        });
    }

    var listTipoReporte = $("#selMultipleTipoReporteFiltro").val();
    var listTipoReportesId = [];
    if (listTipoReporte != null) {
        listTipoReporte.forEach(function (val, index) {
            listTipoReportesId.push(parseInt(val));
        });
    }
    var tipoOrigenObservacionId = $("#slcOrigenObsProy").val();
    callAjaxPost(URL + "/contratista/observaciones/indicadores",
        {
            empresaId: getSession("gestopcompanyid"),
            tipoOrigenObservacionId: tipoOrigenObservacionId,
            listUnidadesId: (listUnidadesId.length == 0 ? null : listUnidadesId),
            listTipoReportesId: (listTipoReportesId.length == 0 ? null : listTipoReportesId),
            fechaInicioPresentacion: convertirFechaTexto(fechaInicio),
            fechaFinPresentacion: convertirFechaTexto(fechaFin)
        }, function (data) {
            resizeDivWrapper("divAnalisisObservacion", 300)
            listFullContratistaObj = data.contratistasObj;
            listUnidadesObj = data.listUnidadesObj;
            listTipoObj = data.listTipoObjeto;
            listFactorObj = data.listFactorObjeto;
            listPerdidaObj = data.listPerdidaObjeto;
            listResponsableObj = data.listResponsableObjeto;
            switch (tipoAgrupacion) {
                case 1 :
                    subHead = "Contratista";
                    listFullActualObj = listFullContratistaObj;
                    break;
                case 3:
                    subHead = "Área";
                    listFullActualObj = listUnidadesObj
                    break;
                case 4:
                    subHead = "Tipo Reporte";
                    listFullActualObj = listTipoObj
                    break;
                case 5:
                    subHead = "Factor Seguridad";
                    listFullActualObj = listFactorObj
                    break;
                case 6:
                    subHead = "Potencial de Perdida"
                    listFullActualObj = listPerdidaObj
                    break;
                case 7:
                    subHead = "Responsable ";
                    listFullActualObj = listResponsableObj
                    break;
            }

            var headTipoPerdida = "";
            listPerdidaObj.forEach(function (val, index) {
                headTipoPerdida += "<td class='tb-acc' style='background-color: #1f2b75  !important;'>" + val.nombre + "</td>";
            });
            head = "<tr>" +
                "<td class='tb-acc'>" + subHead + "</td>" +
                "<td class='tb-acc' style='background-color: #136395 !important;'>Total Observaciones</td>" +

                headTipoPerdida +
                "<td class='tb-acc' style='background-color: #073755 !important;'>Proceso</td>" +
                "<td class='tb-acc' style='background-color: #073755 !important;'>Cerrado</td>" +

                "<td class='tb-acc' style='background-color: #6d6f67 !important'>Acciones Mejora Asignadas</td>" +
                "<td class='tb-acc' style='background-color: #6d6f67 !important'>Completadas</td>" +
                "<td class='tb-acc' style='background-color: #6d6f67 !important'>Por implementar</td>" +


                "</tr>";
            if (tipoAgrupacion == 6) {
                head = "<tr>" +
                    "<td class='tb-acc'>" + subHead + "</td>" +
                    "<td class='tb-acc' style='background-color: #136395 !important;'>Total Observaciones</td>" +
                    "<td class='tb-acc' style='background-color: #073755 !important;'>Proceso</td>" +
                    "<td class='tb-acc' style='background-color: #073755 !important;'>Cerrado</td>" +

                    "</tr>";
            }


            listFullActualObj.forEach(function (val, index) {
                var totalObs = 0, totalCrit = 0, totalMod = 0, totalSig = 0, totalTot = 0;
                var totalCerrado = 0, totalProceso = 0;
                var totalAccionesCompletadas = 0;
                var totalAcciones = 0;
                var observaciones = val.observaciones;
                observaciones.forEach(function (val1, index1) {

                    if (val1.acciones != null) {
                        val1.acciones.forEach(function (val2, index2) {
                            totalAcciones++;
                            if (val2.estadoId == 2) {
                                totalAccionesCompletadas++;
                            }
                        });
                    }
                    totalObs += 1;
                    switch (val1.perdida.id) {
                        case 1:
                            totalCrit += 1;
                            break;
                        case 2:
                            totalMod += 1;
                            break;
                        case 3:
                            totalSig += 1;
                            break;
                        case 4:
                            totalTot += 1;
                            break;

                    }
                    switch (val1.nivel) {

                        case 2:
                            totalCerrado += 1;
                            break;
                        default:
                            totalProceso += 1;
                            break;
                    }
                });
                var auditorias = val.auditorias;
                if (auditorias == null) {
                    auditorias = [];
                }
                auditorias.forEach(function (val2, index2) {
                    var hallazgos = val2.hallazgos;
                    hallazgos.forEach(function (val3, index3) {
                        totalObs += 1;
                        switch (val3.nivel.id) {
                            case 1:
                                totalCrit += 1;
                                break;
                            case 2:
                                totalMod += 1;
                                break;
                            case 3:
                                totalSig += 1;
                                break;
                            case 4:
                                totalTot += 1;
                                break;

                        }
                        var accionesMejora = val3.acciones;
                        if (accionesMejora.length > 1) {
                            totalCerrado += 1;
                        } else {
                            totalProceso += 1;
                        }
                        accionesMejora.forEach(function (val4, index4) {
                            totalAcciones++;
                            if (val4.estadoId == 2) {
                                totalAccionesCompletadas++;
                            }
                        });
                    });
                });


                var porc1 = totalAccionesCompletadas / totalAcciones;
                var porc2 = (totalAcciones - totalAccionesCompletadas) / totalAcciones;
                if (tipoAgrupacion == 6) {
                    body = body + "<tr>" +
                        "<td>" + val.nombre + "</td>" +
                        "<td>" + totalObs + "</td>" +
                        "<td>" + totalProceso + "</td>" +
                        "<td>" + totalCerrado + "</td>" +
                        "</tr>";
                } else {
                    body = body + "<tr>" +
                        "<td>" + val.nombre + "</td>" +
                        "<td>" + totalObs + "</td>" +
                        "<td>" + totalCrit + "</td>" +
                        "<td>" + totalMod + "</td>" +
                        "<td>" + totalSig + "</td>" +
                        "<td>" + totalTot + "</td>" +
                        "<td>" + totalProceso + "</td>" +
                        "<td>" + totalCerrado + "</td>" +

                        "<td>" + totalAcciones + "</td>" +
                        "<td>" + totalAccionesCompletadas + " (" + pasarDecimalPorcentaje(porc1, 2) + ")</td>" +
                        "<td>" + (totalAcciones - totalAccionesCompletadas) + " (" + pasarDecimalPorcentaje(porc2, 2) + ")</td>" +

                        "</tr>";
                }

                val.totalObs = totalObs;
                val.totalCrit = totalCrit;
                val.totalMod = totalMod;
                val.totalSig = totalSig;
                val.totalTot = totalTot;
                val.totalObs = totalObs;
                val.totalProceso = totalProceso;


            });


            $("#tblAnalisisObservacion thead").html(head);
            $("#tblAnalisisObservacion tbody").html(body);
            return listFullActualObj;
        });

}

function generarBarraObservacion() {
    var listaChamba = generarTablaObservacion();
    var listaCategorias = [];
    var listDrillSeries = [];
    listaChamba.forEach(function (val, index) {
        listaCategorias.push({
            name: val.nombre,
            y: val.totalObs,

            drilldown: val.nombre
        });
        var list = {
            name: val.nombre,
            id: val.nombre,
            data: [
                [
                    'CRÍTICO',
                    val.totalCrit
                ],
                [
                    'MODERADO',
                    val.totalMod
                ],
                [
                    'SIGNIFICATIVO',
                    val.totalSig
                ],
                [
                    'TOLERABLE',
                    val.totalTot
                ]
            ]
        };
        listDrillSeries.push(list);

    });
    $("#divAnalisisObservacion").hide();
    $("#divGraficoBarObservacion").show();
    $("#divGraficoPieObservacion").hide();
    Highcharts.setOptions({
        lang: {
            drillUpText: '<< Volver a General'
        }
    });
    Highcharts.chart('divGraficoBarObservacion', {
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Observaciones',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            },
            allowDecimals: false
        },
        tooltip: {
            valueSuffix: ''
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            enabled: false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Total',
            colorByPoint: true,
            data: listaCategorias
        }],
        drilldown: {
            series: listDrillSeries
        }

    });
}

function generarPieObservacion() {
    var listaChamba = generarTablaObservacion();
    var listaCategorias = [];
    var listDrillSeries = [];
    listaChamba.forEach(function (val, index) {
        listaCategorias.push({
            name: val.nombre,
            y: val.totalObs,

            drilldown: val.nombre
        });
        var list = {
            name: val.nombre,
            id: val.nombre,
            data: [
                [
                    'CRÍTICO',
                    val.totalCrit
                ],
                [
                    'MODERADO',
                    val.totalMod
                ],
                [
                    'SIGNIFICATIVO',
                    val.totalSig
                ],
                [
                    'TOLERABLE',
                    val.totalTot
                ]
            ]
        };
        listDrillSeries.push(list);

    });
    $("#divAnalisisObservacion").hide();
    $("#divGraficoBarObservacion").hide();
    $("#divGraficoPieObservacion").show();

    Highcharts.setOptions({
        lang: {
            drillUpText: '<< Volver a General'
        }
    });
    Highcharts.chart('divGraficoPieObservacion', {
        chart: {
            type: 'pie'
        },
        title: {
            text: '',
            style: {fontSize: "24px"}
        },
        tooltip: {
            headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.percentage:.1f}%</b><br/>'

        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}  (%{point.percentage:.2f})',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: "19px"
                    }
                }
            }
        },
        legend: {
            enabled: false,
            itemStyle: {
                color: '#000000',
                fontSize: '20px'
            }
        },
        series: [{
            name: 'Observaciones',
            colorByPoint: true,
            data: listaCategorias
        }],
        drilldown: {
            series: listDrillSeries
        }
    });
}

var importId;

function verModalImportar(tipoImport) {
    importId = parseInt(tipoImport);
    var modal = $("#modalImportarGeneral");
    modal.modal("show");
    modal.find("#labelSelAux").hide();
    modal.find("#divSelAux").hide();
    var titulo = "", msjAyuda = "", place = "", funcionTexto = "";
    switch (importId) {
        case 1:
            titulo = "Importar Contratistas";
            msjAyuda = "Copie desde un Excel. Si el RUC ya existe en su empresa, se actualiza; si es nuevo, " +
                "se crea. El Perfil debe coincidir con uno ya creado.";
            place = "RUC  /  Razón Social  /  Perfil  /  Nombre contacto  /  Correo  / " +
                "Nombre contacto 2  /  Correo 2  /  Contratista activo (Si/No)  ";
            funcionTexto = "guardarImportContratistas()";
            break;
        case 2:
            titulo = "Importar Unidades";
            msjAyuda = "Copie desde un Excel";
            place = "Nombre ";
            funcionTexto = "guardarImportUnidades()";
            break;
        case 3:
            titulo = "Importar Áreas";
            msjAyuda = "Copie desde un Excel, teniendo en cuenta: " +
                "<br/> (Debe existir la unidad ingresada)";
            place = "Unidad  /  Nombre ";
            funcionTexto = "guardarImportAreas()";
            break;
        case 4:
            titulo = "Importar Responsables";
            msjAyuda = "Copie desde un Excel";
            place = "Nombre  /  Correo ";
            funcionTexto = "guardarImportResponsables()";
            break;
        case 5:
            titulo = "Importar Listas y preguntas correspondientes";
            msjAyuda = "Copie desde un Excel";
            place = "Lista  /  Preguntas ";
            funcionTexto = "guardarImportListas()";
            break;
        case 6:
            titulo = "Importar Proyectos";
            msjAyuda = "Copie desde un Excel" +
                "<br/> (Debe existir el responsable, tipo de evaluación y área)" +
                "<br/> (La fecha debe de estar en el formato dd/mm/YYYY)";
            place = "Título  /  Descripción  /  Responsable  /  Área Asociada  /  Fecha Inicio  / Fecha Fin  / " +
                "Tipo de evaluación   ";
            funcionTexto = "guardarImportProyectos()";
            break;
    }


    modal.find(".modal-title").html(titulo);
    modal.find(".control-label").html(msjAyuda);
    modal.find("#txtListado").prop("placeholder", place);
    modal.find("#btnGuardarNuevos").attr("onclick", funcionTexto);
}

function guardarImportContratistas() {
    var texto = $("#txtListado").val();
    // Al copiar un rango de Excel es común que el portapapeles traiga un salto de línea extra
    // después de la última fila; se descarta solo al final, no en el medio del pegado.
    var listExcel = texto.replace(/[\r\n]+$/, '').split('\n');
    var listContratistas = [];
    var listRucsRepetidos = [];
    var listFullNombres = "";
    var validado = "";

    if (texto.length < 10000) {
        for (var int = 0; int < listExcel.length; int++) {

            var listCells = listExcel[int].split('\t');
            var filaTexto = listExcel[int];
            if (filaTexto.trim().length < 1) {
                validado = "Existen filas vacias.";
                break;
            }

            if (validado.length < 1 && listCells.length != 8) {
                validado = "No coincide el numero de celdas."
                    + listCells.length;
                break;
            } else {
                var contr = {};
                for (var j = 0; j < listCells.length; j++) {
                    var element = listCells[j];
                    if (j === 0) {
                        contr.ruc = element.trim();
                        if ($.inArray(contr.ruc, listRucsRepetidos) === -1) {
                            listRucsRepetidos.push(contr.ruc);
                        } else {
                            listFullNombres = listFullNombres + contr.ruc + ", ";
                        }

                    }

                    if (j === 1) {
                        contr.nombre = element.trim();
                    }
                    if (j === 2) {
                        contr.perfilTexto = element.trim();
                    }
                    if (j === 3) {
                        contr.contacto = element.trim();
                    }
                    if (j === 4) {
                        contr.contactoCorreo = element.trim();
                    }
                    if (j === 5) {
                        contr.contactoExtra = element.trim();
                    }
                    if (j === 6) {
                        contr.contactoExtraCorreo = element.trim();
                    }
                    if (j === 7) {
                        contr.activoTexto = element.trim();
                    }
                    contr.empresaId = getSession("gestopcompanyid");


                }

                listContratistas.push(contr);
                if (listRucsRepetidos.length < listContratistas.length) {
                    validado = "Existen RUCs repetidos." + listFullNombres;
                    break;
                }
            }
        }
    } else {
        validado = "Ha excedido los 10000 caracteres permitidos.";
    }

    if (validado.length < 1) {
        var r = confirm("¿Está seguro que desea subir estos "
            + listExcel.length + " elemento(s)?");
        if (r == true) {
            listUltimosContratistasImportados = listContratistas;
            var dataParam = {
                listObject: listContratistas
            };
            callAjaxPost(URL + '/contratista/masivo/save', dataParam,
                funcionResultadoImportContratistas);
        }
    } else {
        alert(validado);
    }
}

var listUltimosErroresImportContratistas = [];
var listUltimosContratistasImportados = [];

function funcionResultadoImportContratistas(data) {
    if (data.CODE_RESPONSE !== "05") {
        alert("Ocurrió un error al guardar.");
        return;
    }

    listUltimosErroresImportContratistas = data.errores || [];

    $('#modalImportarGeneral').modal('hide');
    $("#lblResImpContCreados").text(data.creados || 0);
    $("#lblResImpContActualizados").text(data.actualizados || 0);
    $("#lblResImpContErrores").text(listUltimosErroresImportContratistas.length);

    var cuerpoTabla = $("#tblResImpContErrores tbody");
    cuerpoTabla.empty();
    if (listUltimosErroresImportContratistas.length > 0) {
        for (var i = 0; i < listUltimosErroresImportContratistas.length; i++) {
            var error = listUltimosErroresImportContratistas[i];
            // .text() en vez de armar el HTML como texto: el motivo puede llevar lo que el usuario
            // haya pegado en el Excel (por ejemplo, un nombre de perfil), y no debe interpretarse como HTML.
            $("<tr>")
                .append($("<td>").text("RUC " + error.ruc))
                .append($("<td>").text(error.motivo))
                .appendTo(cuerpoTabla);
        }
        $("#divResImpContDetalleErrores").show();
    } else {
        $("#divResImpContDetalleErrores").hide();
    }

    listarContratistas();
    $('#modalResultadoImportContratistas').modal('show');
}

function copiarErroresImportContratistas() {
    // Copia la fila completa tal como se pegó (los mismos 8 campos), más el motivo al final, para que
    // se pueda ubicar y corregir directo en el Excel de origen, no solo el RUC.
    var texto = "";
    for (var i = 0; i < listUltimosErroresImportContratistas.length; i++) {
        var error = listUltimosErroresImportContratistas[i];
        var filaOriginal = null;
        for (var j = 0; j < listUltimosContratistasImportados.length; j++) {
            if (listUltimosContratistasImportados[j].ruc === error.ruc) {
                filaOriginal = listUltimosContratistasImportados[j];
                break;
            }
        }

        if (filaOriginal) {
            texto += [
                filaOriginal.ruc, filaOriginal.nombre, filaOriginal.perfilTexto,
                filaOriginal.contacto, filaOriginal.contactoCorreo,
                filaOriginal.contactoExtra, filaOriginal.contactoExtraCorreo,
                filaOriginal.activoTexto, error.motivo
            ].join("\t") + "\n";
        } else {
            texto += error.ruc + "\t" + error.motivo + "\n";
        }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto);
    } else {
        var textoAux = $("<textarea>").val(texto).appendTo("body").select();
        document.execCommand("copy");
        textoAux.remove();
    }
}

function guardarImportUnidades() {
    var texto = $("#txtListado").val();
    var listExcel = texto.split('\n');
    var listObject = [];
    var listRucsRepetidos = [];
    var listFullNombres = "";
    var validado = "";

    if (texto.length < 10000) {
        for (var int = 0; int < listExcel.length; int++) {

            var listCells = listExcel[int].split('\t');
            var filaTexto = listExcel[int];
            if (filaTexto.trim().length < 1) {
                validado = "Existen filas vacias.";
                break;
            }

            if (validado.length < 1 && listCells.length != 1) {
                validado = "No coincide el numero de celdas."
                    + listCells.length;
                break;
            } else {
                var contr = {};
                for (var j = 0; j < listCells.length; j++) {
                    var element = listCells[j];

                    if (j === 0) {
                        contr.nombre = element.trim();
                        if ($.inArray(contr.nombre, listRucsRepetidos) === -1) {
                            listRucsRepetidos.push(contr.nombre);
                        } else {
                            listFullNombres = listFullNombres + contr.nombre + ", ";
                        }

                    }

                    contr.empresaId = getSession("gestopcompanyid");


                }

                listObject.push(contr);
                if (listRucsRepetidos.length < listObject.length) {
                    validado = "Existen nombres repetidos." + listFullNombres;
                    break;
                }
            }
        }
    } else {
        validado = "Ha excedido los 10000 caracteres permitidos.";
    }

    if (validado.length < 1) {
        var r = confirm("¿Está seguro que desea subir estos "
            + listExcel.length + " elemento(s)?");
        if (r == true) {
            var dataParam = {
                listObject: listObject
            };
            callAjaxPost(URL + '/contratista/unidades/masivo/save', dataParam,
                funcionResultadoMasivoGeneral);
        }
    } else {
        alert(validado);
    }
}

function guardarImportAreas() {
    var texto = $("#txtListado").val();
    var listExcel = texto.split('\n');
    var listObject = [];
    var listRucsRepetidos = [];
    var listFullNombres = "";
    var validado = "";

    if (texto.length < 10000) {
        for (var int = 0; int < listExcel.length; int++) {

            var listCells = listExcel[int].split('\t');
            var filaTexto = listExcel[int];
            if (filaTexto.trim().length < 1) {
                validado = "Existen filas vacias.";
                break;
            }

            if (validado.length < 1 && listCells.length != 2) {
                validado = "No coincide el numero de celdas."
                    + listCells.length;
                break;
            } else {
                var areaAux = {};
                for (var j = 0; j < listCells.length; j++) {

                    var element = listCells[j];
                    console.log(element);
                    if (j === 0) {
                        for (var k = 0; k < listClasificacion.length; k++) {
                            if (listClasificacion[k].nombre == element.trim()) {
                                areaAux.clasificacion = {
                                    id: listClasificacion[k].id
                                };
                            }
                        }

                        if (!areaAux.clasificacion) {
                            validado = "Unidad no reconocida.";
                            break;
                        }
                    }
                    if (j === 1) {
                        areaAux.nombre = element.trim();
                        if ($.inArray(areaAux.nombre, listRucsRepetidos) === -1) {
                            listRucsRepetidos.push(areaAux.nombre);
                        } else {
                            listFullNombres = listFullNombres + areaAux.nombre + ", ";
                        }

                    }


                }

                listObject.push(areaAux);
                if (listRucsRepetidos.length < listObject.length) {
                    validado = "Existen nombres repetidos." + listFullNombres;
                    break;
                }
            }
        }
    } else {
        validado = "Ha excedido los 10000 caracteres permitidos.";
    }

    if (validado.length < 1) {
        var r = confirm("¿Está seguro que desea subir estos "
            + listExcel.length + " elemento(s)?");
        if (r == true) {
            var dataParam = {
                listObject: listObject
            };
            callAjaxPost(URL + '/contratista/areas/masivo/save', dataParam,
                funcionResultadoMasivoGeneral);
        }
    } else {
        alert(validado);
    }
}

function guardarImportResponsables() {
    var texto = $("#txtListado").val();
    var listExcel = texto.split('\n');
    var listObject = [];
    var listRucsRepetidos = [];
    var listFullNombres = "";
    var validado = "";

    if (texto.length < 10000) {
        for (var int = 0; int < listExcel.length; int++) {

            var listCells = listExcel[int].split('\t');
            var filaTexto = listExcel[int];
            if (filaTexto.trim().length < 1) {
                validado = "Existen filas vacias.";
                break;
            }

            if (validado.length < 1 && listCells.length != 2) {
                validado = "No coincide el numero de celdas."
                    + listCells.length;
                break;
            } else {
                var contr = {};
                for (var j = 0; j < listCells.length; j++) {
                    var element = listCells[j];

                    if (j === 0) {
                        contr.nombre = element.trim();
                        if ($.inArray(contr.nombre, listRucsRepetidos) === -1) {
                            listRucsRepetidos.push(contr.nombre);
                        } else {
                            listFullNombres = listFullNombres + contr.nombre + ", ";
                        }

                    }
                    if (j === 1) {
                        contr.correo = element.trim();


                    }
                    contr.empresaId = getSession("gestopcompanyid");


                }

                listObject.push(contr);
                if (listRucsRepetidos.length < listObject.length) {
                    validado = "Existen nombres repetidos." + listFullNombres;
                    break;
                }
            }
        }
    } else {
        validado = "Ha excedido los 10000 caracteres permitidos.";
    }

    if (validado.length < 1) {
        var r = confirm("¿Está seguro que desea subir estos "
            + listExcel.length + " elemento(s)?");
        if (r == true) {
            var dataParam = {
                listObject: listObject
            };
            callAjaxPost(URL + '/contratista/responsables/masivo/save', dataParam,
                funcionResultadoMasivoGeneral);
        }
    } else {
        alert(validado);
    }
}

function guardarImportListas() {
    var texto = $("#txtListado").val();
    var listExcel = texto.split('\n');
    var listListas = [];
    var list = {};
    var listOpciones = [];
    var validado = "";
    if (texto.length < 20000) {
        console.log(listExcel);
        for (var int = 0; int < listExcel.length; int++) {

            var listCells = listExcel[int].split('\t');
            var filaTexto = listExcel[int];
            if (filaTexto.trim().length < 1) {
                validado = "Existen filas vacias.";
                break;
            }

            if (validado.length < 1 && listCells.length != 2) {
                validado = "No coincide el numero de celdas."
                    + listCells.length;
                break;
            } else {
                var pregunta = {
                    nombre: "", listaAsociada: {}
                };
                for (var j = 0; j < listCells.length; j++) {
                    var element = listCells[j];

                    if (j == 1) {
                        pregunta.nombre = element.trim();
                    }
                    if (j == 0) {

                        if (element.trim() == 0) {

                        } else {
                            list = {
                                empresa: {empresaId: getSession("gestopcompanyid")},
                                nombre: element.trim(),
                                preguntas: []
                            };

                        }

                    }


                }

                list.preguntas.push(pregunta);
                if (listCells[0].length > 0) {
                    listListas.push(list);
                } else {

                }

            }
        }
    } else {
        validado = "Ha excedido los 10000 caracteres permitidos.";
    }

    if (validado.length < 1) {
        var r = confirm("¿Está seguro que desea subir estas "
            + listListas.length + " lista(s)?");
        if (r == true) {

            console.log(listListas);
            callAjaxPost(URL + '/contratista/listas/masivo/save', listListas,
                funcionResultadoMasivoGeneral);
        }
    } else {
        alert(validado);
    }
}

function guardarImportProyectos() {
    var texto = $("#txtListado").val();
    var listExcel = texto.split('\n');
    var listObject = [];
    var listTitulosRepetidos = [];
    var listFullNombres = "";
    var validado = "";

    if (texto.length < 10000) {
        for (var int = 0; int < listExcel.length; int++) {

            var listCells = listExcel[int].split('\t');
            var filaTexto = listExcel[int];
            if (filaTexto.trim().length < 1) {
                validado = "Existen filas vacias.";
                break;
            }

            if (validado.length < 1 && listCells.length != 7) {
                validado = "No coincide el numero de celdas."
                    + listCells.length;
                break;
            } else {
                var proyectoObj = {};
                for (var j = 0; j < listCells.length; j++) {

                    var element = listCells[j];
                    console.log(element);
                    if (j === 0) {
                        proyectoObj.titulo = element.trim();
                        if ($.inArray(proyectoObj.titulo, listTitulosRepetidos) === -1) {
                            listTitulosRepetidos.push(proyectoObj.titulo);
                        } else {
                            listFullNombres = listFullNombres + proyectoObj.titulo + ", ";
                        }

                    }
                    if (j === 1) {
                        proyectoObj.descripcion = element.trim();


                    }
                    if (j === 2) {
                        listResponsableProy.forEach(function (val, index) {
                            if (val.nombre.trim() == element.trim()) {
                                proyectoObj.responsable = {
                                    id: val.id
                                };
                            }
                        })

                        if (!proyectoObj.responsable) {
                            validado = "Responsable no reconocida.";
                            break;
                        }
                    }
                    if (j === 3) {
                        listAreaProyecto.forEach(function (val, index) {
                            if (val.nombre == element.trim()) {
                                proyectoObj.area = {
                                    id: val.id
                                };
                            }
                        })

                        if (!proyectoObj.area) {
                            validado = "Área no reconocida.";
                            break;
                        }
                    }
                    if (j === 4) {
                        try {
                            var fechaTexto = element.trim();
                            var parts = fechaTexto.split('/');
                            var dateNac = new Date(parts[2], parts[1] - 1,
                                parts[0]);
                            proyectoObj.fechaInicio = dateNac;
                        } catch (err) {
                            validado = "Error en el formato de fecha de inicio.";
                            break;
                        }
                    }

                    if (j === 5) {
                        try {
                            var fechaTexto = element.trim();
                            var parts = fechaTexto.split('/');
                            var dateNac = new Date(parts[2], parts[1] - 1,
                                parts[0]);
                            proyectoObj.fechaFin = dateNac;
                        } catch (err) {
                            validado = "Error en el formato de fecha de fin.";
                            break;
                        }
                    }
                    if (j === 6) {
                        listTipoEvaluacion.forEach(function (val, index) {
                            if (val.nombre == element.trim()) {
                                proyectoObj.lista = {
                                    id: val.id
                                };
                            }
                        })

                        if (!proyectoObj.lista) {
                            validado = "Tipo de  evaluación no reconocida.";
                            break;
                        }
                    }
                }
                var fechaInicio = convertirFechaNormal2(proyectoObj.fechaInicio);
                var fechaFin = convertirFechaNormal2(proyectoObj.fechaFin);
                var hoyDia = obtenerFechaActual();
                var difInicio = restaFechas(hoyDia, fechaInicio);
                var difFinal = restaFechas(hoyDia, fechaFin);
                var proyectoEstado = {};
                if (difInicio > 0) {
                    proyectoEstado = {id: "1", nombre: "Pendiente"};
                } else {
                    if (difFinal > 0) {
                        proyectoEstado = {id: "2", nombre: "En Curso"};
                    } else {
                        proyectoEstado = {id: "3", nombre: "Completado"};
                    }
                }

                proyectoObj.tipoIperc = {id: 1};
                proyectoObj.estado = proyectoEstado;
                proyectoObj.empresaId = getSession("gestopcompanyid");
                listObject.push(proyectoObj);
                if (listTitulosRepetidos.length < listObject.length) {
                    validado = "Existen nombres repetidos." + listFullNombres;
                    break;
                }
            }
        }
    } else {
        validado = "Ha excedido los 10000 caracteres permitidos.";
    }

    if (validado.length < 1) {
        var r = confirm("¿Está seguro que desea subir estos "
            + listExcel.length + " elemento(s)?");
        if (r == true) {
            var dataParam = {
                listObject: listObject
            };
            callAjaxPost(URL + '/contratista/proyectos/masivo/save', dataParam,
                funcionResultadoMasivoGeneral);
        }
    } else {
        alert(validado);
    }
}

function funcionResultadoMasivoGeneral(data) {
    switch (data.CODE_RESPONSE) {
        case "05":
            if (data.MENSAJE.length > 0) {
                alert(data.MENSAJE);
            } else {
                alert("Se guardaron exitosamente.");
                switch (importId) {
                    case 1:
                        listarContratistas();
                        break;
                    case 2:
                        cargarClasificacionsContratista();
                        break;
                    case 3:
                        cargarTiposContratista();
                        break;
                    case 4:
                        cargarResponsablesSeguridad();
                        break;
                    case 5:
                        cargarListasContratista();
                        break;
                    case 6:
                        cargarProyectosSeguridad();
                        break;
                }

                $('#modalImportarGeneral').modal('hide');
            }
            break;
        default:
            alert("Ocurri&oacute; un error al guardar el trabajador!");
    }
}

var listVehiculosMaquinarias=[],listVehiculosMaquinariasBuscador=[];
var busquedaActivaVehMaqVistaAdmin,numPaginaActualVehMaqVistaAdmin,vehMaqVistaAdminObj,banderaEdicionVehMaqVistaAdmin;

function ocultarConsolidadoVehiculosMaquinariasVistaAdmin(){
   $("#modalConsolidadoVehMaqVistaAdmin").modal("hide");
}

function verConsolidadoVehiculosMaquinariasVistaAdmin(){
   $("#modalConsolidadoVehMaqVistaAdmin").remove();
    
   var contenido = "";
   
   var buttonOcultar =
      "<button id='btnOcultarVehMaqVistaAdmin' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='ocultarConsolidadoVehiculosMaquinariasVistaAdmin()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonCancelar =
      "<button id='btnCancelarVehMaqVistaAdmin' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='cargarConsolidadoVehiculosMaquinariasVistaAdmin()' title='Cancelar'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardarVehMaqVistaAdmin' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarConsolidadoVehiculosMaquinariasVistaAdmin()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
      
   var buttonFlechas = 
      "<span id='indicadorPaginaParcialAuxVehMaqVistaAdmin' style='margin:5px;margin-top:10px;'>" +
         "<a id='flechaIzquierdaVehMaqVistaAdmin'><img src='../imagenes/flecha_01.png' /></a>" +
	    " <em id='labelFlechasVehMaqVistaAdmin'></em> " +
	 "<a id='flechaDerechaVehMaqVistaAdmin'><img src='../imagenes/flecha_02.png' /></a>" +
      "</span>";
   
   var buscadorOpciones = 
      "<button id='btnResetBuscadorVehMaqVistaAdmin' type='button' class='btn btn-success' " +
              "title='Refresh' onclick='reiniciarBuscadorVehiculosMaquinariasVistaAdmin()' style='float:right;'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button id='btnAplicarBuscadorVehMaqVistaAdmin' type='button' class='btn btn-success' " +
              "onclick='aplicarBuscadorVehiculosMaquinariasVistaAdmin()' style='float:right;margin-right:5px;' " +
              "title='Buscar los registros cuya placa del vehículo/maquinaria coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input id='valBuscarValorVehMaqVistaAdmin' placeholder='Placa' class='form-control' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";
   
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoVehMaqVistaAdmin",
      nombre:"<i class='fa fa-table'></i> Consolidado vehículos/maquinarias - ("+contratistaObj.ruc+") "+contratistaObj.nombre,
      contenido: 
	 "<form class='form-inline'>" +
	     buttonOcultar+buttonCancelar+buttonGuardar+buttonFlechas+buscadorOpciones +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoVehMaqVistaAdmin'>" +
            "<table id='tblConsolidadoVehMaqVistaAdmin' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' colspan='2' style='width:240px'>Fotocheck</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:200px'>Placa</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:200px'>Tipo de licencia</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:200px'>Marca</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:150px'>Año de fabricación</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:250px'>Detalle</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:300px'>Proyecto asignado</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:200px'>Modificado el</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:120px'>Archivo</th>" +
		     "<th class='tb-acc' style='width:120px'>Última vez descargado el</th>" +
	          "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoVehMaqVistaAdmin",190);
   cargarConsolidadoVehiculosMaquinariasVistaAdmin();
   
   $("#flechaIzquierdaVehMaqVistaAdmin").on('click',function(){
      numPaginaActualVehMaqVistaAdmin = numPaginaActualVehMaqVistaAdmin-1;
      cambiarPaginaVehiculosMaquinariasVistaAdmin();
   });
	 
   $('#flechaDerechaVehMaqVistaAdmin').on('click',function(){
      numPaginaActualVehMaqVistaAdmin = numPaginaActualVehMaqVistaAdmin+1;
      cambiarPaginaVehiculosMaquinariasVistaAdmin();
   });
}

function cargarConsolidadoVehiculosMaquinariasVistaAdmin(){
   $("#modalConsolidadoVehMaqVistaAdmin").modal("show");$("#valBuscarValorVehMaqVistaAdmin").val("");
   busquedaActivaVehMaqVistaAdmin = 0,numPaginaActualVehMaqVistaAdmin = 1; 
    
   var dataParam={
      contratistaId:contratistaObj.id
   };

   callAjaxPost(URL+'/contratista/vehiculo_maquinaria',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listVehiculosMaquinarias = data.listVehiculosMaquinarias;
	 
	 $("#tblConsolidadoVehMaqVistaAdmin tbody tr").remove();
	 
	 cambiarPaginaVehiculosMaquinariasVistaAdmin();
	      
	 goheadfixedY("#tblConsolidadoVehMaqVistaAdmin","#wrapperConsolidadoVehMaqVistaAdmin");
      }else{
         console.log("Error al cargar el consolidado vehículos/maquinarias");
      }
   }); 
   
   $("#btnOcultarVehMaqVistaAdmin").show();$("#btnCancelarVehMaqVistaAdmin").hide();$("#btnGuardarVehMaqVistaAdmin").hide();
   $("#indicadorPaginaParcialAuxVehMaqVistaAdmin").show();$("#btnResetBuscadorVehMaqVistaAdmin").show();$("#btnAplicarBuscadorVehMaqVistaAdmin").show();
   $("#valBuscarValorVehMaqVistaAdmin").show();
   
   banderaEdicionVehMaqVistaAdmin = false;
}

function cambiarPaginaVehiculosMaquinariasVistaAdmin(){
   $("#flechaIzquierdaVehMaqVistaAdmin").show();$("#flechaDerechaVehMaqVistaAdmin").show(); 
   
   var list = (busquedaActivaVehMaqVistaAdmin == 0?listVehiculosMaquinarias:listVehiculosMaquinariasBuscador);
   var totalSize = list.length;
   var partialSize = 100;
	
   var numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActualVehMaqVistaAdmin*partialSize)-partialSize;
   var finRegistro = (numPaginaActualVehMaqVistaAdmin*partialSize)-1;
	
   if(numPaginaTotal == 0){
      numPaginaTotal = 1;
   }
		
   $("#labelFlechasVehMaqVistaAdmin").html("<label>"+numPaginaActualVehMaqVistaAdmin+" de "+numPaginaTotal+"</label>");
	 
   if(numPaginaActualVehMaqVistaAdmin == 1){
      $("#flechaIzquierdaVehMaqVistaAdmin").hide();
   }
	
   if(numPaginaActualVehMaqVistaAdmin == numPaginaTotal){
      $("#flechaDerechaVehMaqVistaAdmin").hide();
   }
	 
   if(finRegistro >= totalSize){
      finRegistro = totalSize-1;
   }
   
   $("#tblConsolidadoVehMaqVistaAdmin tbody tr").remove();

   list.forEach(function(val,index){	
      if(inicioRegistro <= index && index <= finRegistro){
	 var proyectoAsignadoTexto = (val.proyectoAsignadoTexto.length == 0?"------":val.proyectoAsignadoTexto),
	     detalle = (val.detalle.length == 0?"------":val.detalle);
	  
         $("#tblConsolidadoVehMaqVistaAdmin tbody").append(
            "<tr id='trVehMaqVistaAdmin"+val.id+"' onclick='editarConsolidadoVehiculosMaquinariasVistaAdmin("+index+")'>" +
               "<td id='vehMaqFotocheck"+val.id+"'>"+"<i class='fa fa-file fa-3x'></i>"+"</td>" +
               "<td id='vehMaqFechaUltimaDescarga"+val.id+"'>"+val.fechaUltimaDescargaFotocheckTexto+"</td>" +
               "<td id='vehMaqPlaca"+val.id+"'>"+val.placa+"</td>" +
               "<td id='vehMaqTipoLic"+val.id+"'>"+val.tipoLicenciaConductor.nombre+"</td>" +
               "<td id='vehMaqMarca"+val.id+"'>"+val.marca+"</td>" +
               "<td id='vehMaqAnioFab"+val.id+"'>"+val.anioFabricacion+"</td>" +
               "<td id='vehMaqDetalle"+val.id+"' style='word-break:break-all;'>"+detalle+"</td>" +
               "<td id='vehMaqProyAsig"+val.id+"' style='word-break:break-all;'>"+proyectoAsignadoTexto+"</td>" +
               "<td id='vehMaqFecMod"+val.id+"'>"+val.fechaModificacionExcepcionalTexto+"</td>" +
	    "</tr>");
      }
   });

   $.unblockUI();
   formatoCeldaSombreableTabla(true,"tblConsolidadoVehMaqVistaAdmin");
}

function aplicarBuscadorVehiculosMaquinariasVistaAdmin(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    
   var valBuscarValorVehMaq = igualarStringBuscar($("#valBuscarValorVehMaqVistaAdmin").val());
   listVehiculosMaquinariasBuscador = [];
   busquedaActivaVehMaqVistaAdmin = 1;numPaginaActualVehMaqVistaAdmin = 1;
  	
   listVehiculosMaquinarias.forEach(function(val,index){
      if(igualarStringBuscar(val.placa).indexOf(valBuscarValorVehMaq) != -1){
	 listVehiculosMaquinariasBuscador.push(val);
      }
   }); 
   
   cambiarPaginaVehiculosMaquinariasVistaAdmin();
}

function reiniciarBuscadorVehiculosMaquinariasVistaAdmin(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   $("#valBuscarValorVehMaqVistaAdmin").val("").focus();
   busquedaActivaVehMaqVistaAdmin = 0;numPaginaActualVehMaqVistaAdmin = 1;
    
   cambiarPaginaVehiculosMaquinariasVistaAdmin();
}

function editarConsolidadoVehiculosMaquinariasVistaAdmin(pindex){
   if(!banderaEdicionVehMaqVistaAdmin){
      vehMaqVistaAdminObj = (busquedaActivaVehMaqVistaAdmin == 0?listVehiculosMaquinarias[pindex]:listVehiculosMaquinariasBuscador[pindex]);

      $("#trVehMaqVistaAdmin"+vehMaqVistaAdminObj.id).addClass("fila-edicion");
      
      var btnFotocheck = "<button class='btn btn-success' onclick='generarFotocheckCodigoQrVehiculoMaquinaria(1)' " +
            "title='Descargar el fotocheck del vehículo/maquinaria.'>" +
	    "<i class='fa fa-newspaper-o fa-2x'></i>" +
	 "</button>";
	      
      $("#vehMaqFotocheck"+vehMaqVistaAdminObj.id).html(btnFotocheck);

      $("#vehMaqProyAsig"+vehMaqVistaAdminObj.id).html("<input id='inputProyectoAsigVehMaqVistaAdmin' class='form-control'>");
      $("#inputProyectoAsigVehMaqVistaAdmin").val(vehMaqVistaAdminObj.proyectoAsignadoTexto);

      formatoCeldaSombreableTabla(false,"tblConsolidadoVehMaqVistaAdmin");
      
      $("#btnOcultarVehMaqVistaAdmin").hide();$("#btnCancelarVehMaqVistaAdmin").show();$("#btnGuardarVehMaqVistaAdmin").show();
      $("#indicadorPaginaParcialAuxVehMaqVistaAdmin").hide();$("#btnResetBuscadorVehMaqVistaAdmin").hide();$("#btnAplicarBuscadorVehMaqVistaAdmin").hide();
      $("#valBuscarValorVehMaqVistaAdmin").hide();

      banderaEdicionVehMaqVistaAdmin = true;
   }
}

function guardarConsolidadoVehiculosMaquinariasVistaAdmin(){
   var campoVacio = true;
   
   var proyectoAsignadoTexto = $("#inputProyectoAsigVehMaqVistaAdmin").val().trim();
   
   if(campoVacio){
      var dataParam={
	 id:vehMaqVistaAdminObj.id,proyectoAsignadoTexto:proyectoAsignadoTexto
      };
	        
      callAjaxPostSimple(URL+'/contratista/vehiculo_maquinaria/admin_excepcional/save',dataParam,1,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":  
	       $.unblockUI();$("#modalConsolidadoVehMaqVistaAdmin").modal("hide");	
		
	       mensajeUx = "<label>El registro vehículo/maquinaria fue guardado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarVehMaq"); 
								   
	       $("#modalMensajeUxActualizarVehMaq").on("hidden.bs.modal",function(){
	          cargarConsolidadoVehiculosMaquinariasVistaAdmin();  
	       });
		
	       break;
						
	    default:
	       alert("Ocurrió un error al guardar el registro vehículo/maquinaria.");
	 }
      });	
   }else{
       
   }	
}

var listEquiposHerramientas=[],listEquiposHerramientasBuscador=[];
var busquedaActivaEquHerrVistaAdmin,numPaginaActualEquHerrVistaAdmin,equHerrVistaAdminObj,banderaEdicionEquHerrVistaAdmin;

function ocultarConsolidadoEquiposHerramientasVistaAdmin(){
   $("#modalConsolidadoEquHerrVistaAdmin").modal("hide");
}

function verConsolidadoEquiposHerramientasVistaAdmin(){
   $("#modalConsolidadoEquHerrVistaAdmin").remove();
    
   var contenido = "";
   
   var buttonOcultar =
      "<button id='btnOcultarEquHerrVistaAdmin' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='ocultarConsolidadoEquiposHerramientasVistaAdmin()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonCancelar =
      "<button id='btnCancelarEquHerrVistaAdmin' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='cargarConsolidadoEquiposHerramientasVistaAdmin()' title='Cancelar'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardarEquHerrVistaAdmin' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarConsolidadoEquiposHerramientasVistaAdmin()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
      
   var buttonFlechas = 
      "<span id='indicadorPaginaParcialAuxEquHerrVistaAdmin' style='margin:5px;margin-top:10px;'>" +
         "<a id='flechaIzquierdaEquHerrVistaAdmin'><img src='../imagenes/flecha_01.png' /></a>" +
	    " <em id='labelFlechasEquHerrVistaAdmin'></em> " +
	 "<a id='flechaDerechaEquHerrVistaAdmin'><img src='../imagenes/flecha_02.png' /></a>" +
      "</span>";
   
   var buscadorOpciones = 
      "<button id='btnResetBuscadorEquHerrVistaAdmin' type='button' class='btn btn-success' " +
              "title='Refresh' onclick='reiniciarBuscadorEquiposHerramientasVistaAdmin()' style='float:right;'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button id='btnAplicarBuscadorEquHerrVistaAdmin' type='button' class='btn btn-success' " +
              "onclick='aplicarBuscadorEquiposHerramientasVistaAdmin()' style='float:right;margin-right:5px;' " +
              "title='Buscar los registros cuyo código del equipo/herramienta coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input id='valBuscarValorEquHerrVistaAdmin' placeholder='Código' class='form-control' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";
   
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoEquHerrVistaAdmin",
      nombre:"<i class='fa fa-table'></i> Consolidado equipos/herramientas - ("+contratistaObj.ruc+") "+contratistaObj.nombre,
      contenido: 
	 "<form class='form-inline'>" +
	     buttonOcultar+buttonCancelar+buttonGuardar+buttonFlechas+buscadorOpciones +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoEquHerrVistaAdmin'>" +
            "<table id='tblConsolidadoEquHerrVistaAdmin' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<td class='tb-acc' style='width:200px'>Código</td>" +
		     "<td class='tb-acc' style='width:200px'>Tipo</td>" +
		     "<td class='tb-acc' style='width:300px'>Descripción</td>" +
		     "<td class='tb-acc' style='width:150px'>Año de fabricación</td>" +
		     "<td class='tb-acc' style='width:300px'>Proyecto asignado</td>" +
		     "<td class='tb-acc' style='width:150px'>Modificado el</td>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoEquHerrVistaAdmin",190);
   cargarConsolidadoEquiposHerramientasVistaAdmin();
   
   $("#flechaIzquierdaEquHerrVistaAdmin").on('click',function(){
      numPaginaActualEquHerrVistaAdmin = numPaginaActualEquHerrVistaAdmin-1;
      cambiarPaginaEquiposHerramientasVistaAdmin();
   });
	 
   $('#flechaDerechaEquHerrVistaAdmin').on('click',function(){
      numPaginaActualEquHerrVistaAdmin = numPaginaActualEquHerrVistaAdmin+1;
      cambiarPaginaEquiposHerramientasVistaAdmin();
   });
}

function cargarConsolidadoEquiposHerramientasVistaAdmin(){
   $("#modalConsolidadoEquHerrVistaAdmin").modal("show");$("#valBuscarValorEquHerrVistaAdmin").val("");
   busquedaActivaEquHerrVistaAdmin = 0,numPaginaActualEquHerrVistaAdmin = 1; 
    
   var dataParam={
      contratistaId:contratistaObj.id
   };

   callAjaxPost(URL+'/contratista/equipo_herramienta',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listEquiposHerramientas = data.listEquiposHerramientas;
	 
	 $("#tblConsolidadoEquHerrVistaAdmin tbody tr").remove();
	 
	 cambiarPaginaEquiposHerramientasVistaAdmin();
	      
	 goheadfixedY("#tblConsolidadoEquHerrVistaAdmin","#wrapperConsolidadoEquHerrVistaAdmin");
      }else{
         console.log("Error al cargar el consolidado equipos/herramientas");
      }
   }); 
   
   $("#btnOcultarEquHerrVistaAdmin").show();$("#btnCancelarEquHerrVistaAdmin").hide();$("#btnGuardarEquHerrVistaAdmin").hide();
   $("#indicadorPaginaParcialAuxEquHerrVistaAdmin").show();$("#btnResetBuscadorEquHerrVistaAdmin").show();$("#btnAplicarBuscadorEquHerrVistaAdmin").show();
   $("#valBuscarValorEquHerrVistaAdmin").show();
   
   banderaEdicionEquHerrVistaAdmin = false;
}

function cambiarPaginaEquiposHerramientasVistaAdmin(){
   $("#flechaIzquierdaEquHerrVistaAdmin").show();$("#flechaDerechaEquHerrVistaAdmin").show(); 
   
   var list = (busquedaActivaEquHerrVistaAdmin == 0?listEquiposHerramientas:listEquiposHerramientasBuscador);
   var totalSize = list.length;
   var partialSize = 100;
	
   var numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActualEquHerrVistaAdmin*partialSize)-partialSize;
   var finRegistro = (numPaginaActualEquHerrVistaAdmin*partialSize)-1;
	
   if(numPaginaTotal == 0){
      numPaginaTotal = 1;
   }
		
   $("#labelFlechasEquHerrVistaAdmin").html("<label>"+numPaginaActualEquHerrVistaAdmin+" de "+numPaginaTotal+"</label>");
	 
   if(numPaginaActualEquHerrVistaAdmin == 1){
      $("#flechaIzquierdaEquHerrVistaAdmin").hide();
   }
	
   if(numPaginaActualEquHerrVistaAdmin == numPaginaTotal){
      $("#flechaDerechaEquHerrVistaAdmin").hide();
   }
	 
   if(finRegistro >= totalSize){
      finRegistro = totalSize-1;
   }
   
   $("#tblConsolidadoEquHerrVistaAdmin tbody tr").remove();

   list.forEach(function(val,index){	
      if(inicioRegistro <= index && index <= finRegistro){
	 var proyectoAsignadoTexto = (val.proyectoAsignadoTexto.length == 0?"------":val.proyectoAsignadoTexto); 
	  
         $("#tblConsolidadoEquHerrVistaAdmin tbody").append(
            "<tr id='trEquHerrVistaAdmin"+val.id+"' onclick='editarConsolidadoEquiposHerramientasVistaAdmin("+index+")'>" +
               "<td id='equHerrCodigo"+val.id+"'>"+val.codigo+"</td>" +
               "<td id='equHerrTipoEquHerr"+val.id+"'>"+val.tipoEquipoHerramienta.nombre+"</td>" +
               "<td id='equHerrDescripcion"+val.id+"' style='word-break:break-all;'>"+val.descripcion+"</td>" +
               "<td id='equHerrAnioFab"+val.id+"'>"+val.anioFabricacion+"</td>" +
               "<td id='equHerrProyAsig"+val.id+"' style='word-break:break-all;'>"+proyectoAsignadoTexto+"</td>" +
               "<td id='equHerrFecMod"+val.id+"'>"+val.fechaModificacionExcepcionalTexto+"</td>" +
	    "</tr>");
      }
   });

   $.unblockUI();
   formatoCeldaSombreableTabla(true,"tblConsolidadoEquHerrVistaAdmin");
}

function aplicarBuscadorEquiposHerramientasVistaAdmin(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    
   var valBuscarValorEquHerr = igualarStringBuscar($("#valBuscarValorEquHerrVistaAdmin").val());
   listEquiposHerramientasBuscador = [];
   busquedaActivaEquHerrVistaAdmin = 1;numPaginaActualEquHerrVistaAdmin = 1;
  	
   listEquiposHerramientas.forEach(function(val,index){
      if(igualarStringBuscar(val.codigo).indexOf(valBuscarValorEquHerr) != -1){
	 listEquiposHerramientasBuscador.push(val);
      }
   }); 
   
   cambiarPaginaEquiposHerramientasVistaAdmin();
}

function reiniciarBuscadorEquiposHerramientasVistaAdmin(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   $("#valBuscarValorEquHerrVistaAdmin").val("").focus();
   busquedaActivaEquHerrVistaAdmin = 0;numPaginaActualEquHerrVistaAdmin = 1;
    
   cambiarPaginaEquiposHerramientasVistaAdmin();
}

function editarConsolidadoEquiposHerramientasVistaAdmin(pindex){
   if(!banderaEdicionEquHerrVistaAdmin){
      equHerrVistaAdminObj = (busquedaActivaEquHerrVistaAdmin == 0?listEquiposHerramientas[pindex]:listEquiposHerramientasBuscador[pindex]);

      $("#trEquHerrVistaAdmin"+equHerrVistaAdminObj.id).addClass("fila-edicion");

      $("#equHerrProyAsig"+equHerrVistaAdminObj.id).html("<input id='inputProyectoAsigEquHerrVistaAdmin' class='form-control'>");
      $("#inputProyectoAsigEquHerrVistaAdmin").val(equHerrVistaAdminObj.proyectoAsignadoTexto);

      formatoCeldaSombreableTabla(false,"tblConsolidadoEquHerrVistaAdmin");
      
      $("#btnOcultarEquHerrVistaAdmin").hide();$("#btnCancelarEquHerrVistaAdmin").show();$("#btnGuardarEquHerrVistaAdmin").show();
      $("#indicadorPaginaParcialAuxEquHerrVistaAdmin").hide();$("#btnResetBuscadorEquHerrVistaAdmin").hide();$("#btnAplicarBuscadorEquHerrVistaAdmin").hide();
      $("#valBuscarValorEquHerrVistaAdmin").hide();

      banderaEdicionEquHerrVistaAdmin = true;
   }
}

function guardarConsolidadoEquiposHerramientasVistaAdmin(){
   var campoVacio = true;
   
   var proyectoAsignadoTexto = $("#inputProyectoAsigEquHerrVistaAdmin").val().trim();
   
   if(campoVacio){
      var dataParam={
	 id:equHerrVistaAdminObj.id,proyectoAsignadoTexto:proyectoAsignadoTexto
      };
	        
      callAjaxPostSimple(URL+'/contratista/equipo_herramienta/admin_excepcional/save',dataParam,1,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":  
	       $.unblockUI();$("#modalConsolidadoEquHerrVistaAdmin").modal("hide");	
		
	       mensajeUx = "<label>El registro equipo/herramienta fue guardado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarEquHerr"); 
								   
	       $("#modalMensajeUxActualizarEquHerr").on("hidden.bs.modal",function(){
	          cargarConsolidadoEquiposHerramientasVistaAdmin();  
	       });
		
	       break;
						
	    default:
	       alert("Ocurrió un error al guardar el registro equipo/herramienta.");
	 }
      });	
   }else{
       
   }	
}

var listTrabajadoresContratista=[],listTrabajadoresContratistaBuscador=[];
var busquedaActivaTrabContVistaAdmin,numPaginaActualTrabContVistaAdmin,trabContVistaAdminObj,banderaEdicionTrabContVistaAdmin;

function ocultarConsolidadoTrabajadoresContratistaVistaAdmin(){
   $("#modalConsolidadoTrabContVistaAdmin").modal("hide");
}

function verConsolidadoTrabajadoresContratistaVistaAdmin(){
   $("#modalConsolidadoTrabContVistaAdmin").remove();
    
   var contenido = "";
   
   var buttonOcultar =
      "<button id='btnOcultarTrabContVistaAdmin' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='ocultarConsolidadoTrabajadoresContratistaVistaAdmin()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonCancelar =
      "<button id='btnCancelarTrabContVistaAdmin' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='cargarConsolidadoTrabajadoresContratistaVistaAdmin()' title='Cancelar'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardarTrabContVistaAdmin' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarConsolidadoTrabajadoresContratistaVistaAdmin()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
      
   var buttonFlechas = 
      "<span id='indicadorPaginaParcialAuxTrabContVistaAdmin' style='margin:5px;margin-top:10px;'>" +
         "<a id='flechaIzquierdaTrabContVistaAdmin'><img src='../imagenes/flecha_01.png' /></a>" +
	    " <em id='labelFlechasTrabContVistaAdmin'></em> " +
	 "<a id='flechaDerechaTrabContVistaAdmin'><img src='../imagenes/flecha_02.png' /></a>" +
      "</span>";
   
   var buscadorOpciones = 
      "<button id='btnResetBuscadorTrabContVistaAdmin' type='button' class='btn btn-success' " +
              "title='Refresh' onclick='reiniciarBuscadorTrabajadoresContratistaVistaAdmin()' style='float:right;'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button id='btnAplicarBuscadorTrabContVistaAdmin' type='button' class='btn btn-success' " +
              "onclick='aplicarBuscadorTrabajadoresContratistaVistaAdmin()' style='float:right;margin-right:5px;' " +
              "title='Buscar los registros cuyo N° documento, nombre o apellido del trabajador contratista coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input id='valBuscarValorTrabContVistaAdmin' placeholder='N° documento, nombre o apellido' class='form-control' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";
   
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoTrabContVistaAdmin",
      nombre:"<i class='fa fa-table'></i> Consolidado trabajadores contratista - ("+contratistaObj.ruc+") "+contratistaObj.nombre,
      contenido: 
	 "<form class='form-inline'>" +
	     buttonOcultar+buttonCancelar+buttonGuardar+buttonFlechas+buscadorOpciones +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoTrabContVistaAdmin'>" +
            "<table id='tblConsolidadoTrabContVistaAdmin' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' colspan='2' style='width:240px'>Fotocheck</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:150px'>Tipo Documento</td>" +
		     "<th class='tb-acc' rowspan='2' style='width:200px'>N° Documento</td>" +
		     "<th class='tb-acc' rowspan='2' style='width:250px'>Nombres</td>" +
		     "<th class='tb-acc' rowspan='2' style='width:250px'>Apellidos</td>" +
		     "<th class='tb-acc' rowspan='2' style='width:250px'>Empresa</td>" +
             "<th class='tb-acc' rowspan='2' style='width:250px'>Área</td>" +
		     "<th class='tb-acc' rowspan='2' style='width:250px'>Puesto de trabajo</td>" +
		     "<th class='tb-acc' rowspan='2' style='width:200px'>Modificado el</td>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:120px'>Archivo</th>" +
		     "<th class='tb-acc' style='width:120px'>Última vez descargado el</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoTrabContVistaAdmin",190);
   cargarConsolidadoTrabajadoresContratistaVistaAdmin();
   
   $("#flechaIzquierdaTrabContVistaAdmin").on('click',function(){
      numPaginaActualTrabContVistaAdmin = numPaginaActualTrabContVistaAdmin-1;
      cambiarPaginaTrabajadoresContratistaVistaAdmin();
   });
	 
   $('#flechaDerechaTrabContVistaAdmin').on('click',function(){
      numPaginaActualTrabContVistaAdmin = numPaginaActualTrabContVistaAdmin+1;
      cambiarPaginaTrabajadoresContratistaVistaAdmin();
   });
}

function cargarConsolidadoTrabajadoresContratistaVistaAdmin(){
   $("#modalConsolidadoTrabContVistaAdmin").modal("show");$("#valBuscarValorTrabContVistaAdmin").val("");
   busquedaActivaTrabContVistaAdmin = 0,numPaginaActualTrabContVistaAdmin = 1; 
    
   var dataParam={
      id:contratistaObj.id
   };

   callAjaxPost(URL+'/contratista/trabajadores/simple',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listTrabajadoresContratista = data.trabajadoresContratista;
	 
	 $("#tblConsolidadoTrabContVistaAdmin tbody tr").remove();
	 
	 cambiarPaginaTrabajadoresContratistaVistaAdmin();
	      
	 goheadfixedY("#tblConsolidadoTrabContVistaAdmin","#wrapperConsolidadoTrabContVistaAdmin");
      }else{
         console.log("Error al cargar el consolidado trabajadores contratista");
      }
   }); 
   
   $("#btnOcultarTrabContVistaAdmin").show();$("#btnCancelarTrabContVistaAdmin").hide();$("#btnGuardarTrabContVistaAdmin").hide();
   $("#indicadorPaginaParcialAuxTrabContVistaAdmin").show();$("#btnResetBuscadorTrabContVistaAdmin").show();$("#btnAplicarBuscadorTrabContVistaAdmin").show();
   $("#valBuscarValorTrabContVistaAdmin").show();
   
   banderaEdicionTrabContVistaAdmin = false;
}

function cambiarPaginaTrabajadoresContratistaVistaAdmin(){
   $("#flechaIzquierdaTrabContVistaAdmin").show();$("#flechaDerechaTrabContVistaAdmin").show(); 
   
   var list = (busquedaActivaTrabContVistaAdmin == 0?listTrabajadoresContratista:listTrabajadoresContratistaBuscador);
   var totalSize = list.length;
   var partialSize = 100;
	
   var numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActualTrabContVistaAdmin*partialSize)-partialSize;
   var finRegistro = (numPaginaActualTrabContVistaAdmin*partialSize)-1;
	
   if(numPaginaTotal == 0){
      numPaginaTotal = 1;
   }
		
   $("#labelFlechasTrabContVistaAdmin").html("<label>"+numPaginaActualTrabContVistaAdmin+" de "+numPaginaTotal+"</label>");
	 
   if(numPaginaActualTrabContVistaAdmin == 1){
      $("#flechaIzquierdaTrabContVistaAdmin").hide();
   }
	
   if(numPaginaActualTrabContVistaAdmin == numPaginaTotal){
      $("#flechaDerechaTrabContVistaAdmin").hide();
   }
	 
   if(finRegistro >= totalSize){
      finRegistro = totalSize-1;
   }
   
   $("#tblConsolidadoTrabContVistaAdmin tbody tr").remove();

   list.forEach(function(val,index){	
      if(inicioRegistro <= index && index <= finRegistro){
	 var iconoFotocheck = (val.evidenciaFotoNombre.length == 0?"<label>*Sin foto del trabajador registrada.</label>":
	    "<i class='fa fa-file fa-3x'></i>"); 
	  
         $("#tblConsolidadoTrabContVistaAdmin tbody").append(
            "<tr id='trTrabContVistaAdmin"+val.id+"' onclick='editarConsolidadoTrabajadoresContratistaVistaAdmin("+index+")'>" +
               "<td id='trabContFotocheck"+val.id+"'>"+iconoFotocheck+"</td>" +
               "<td id='trabContFechaUltimaDescarga"+val.id+"'>"+val.fechaUltimaDescargaTexto+"</td>" +
               "<td id='trabContTipoDoc"+val.id+"'>"+val.tipoDocumento.nombre+"</td>" +
               "<td id='trabContNroDoc"+val.id+"'>"+val.nroDocumento+"</td>" +
               "<td id='trabContNombres"+val.id+"' style='word-break:break-all;'>"+val.nombre+"</td>" +
               "<td id='trabContApellidos"+val.id+"' style='word-break:break-all;'>"+val.apellido+"</td>" +
               "<td id='trabContCliente"+val.id+"' style='word-break:break-all;'>"+val.cliente+"</td>" +
               "<td id='trabContArea"+val.id+"' style='word-break:break-all;'>"+val.area+"</td>" +
               "<td id='trabContPuesto"+val.id+"' style='word-break:break-all;'>"+val.cargo+"</td>" +
               "<td id='trabContFecMod"+val.id+"'>"+val.fechaModificacionExcepcionalTexto+"</td>" +
	    "</tr>");
      }
   });

   $.unblockUI();
   formatoCeldaSombreableTabla(true,"tblConsolidadoTrabContVistaAdmin");
}

function aplicarBuscadorTrabajadoresContratistaVistaAdmin(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    
   var valBuscarValorTrabCont = igualarStringBuscar($("#valBuscarValorTrabContVistaAdmin").val());
   listTrabajadoresContratistaBuscador = [];
   busquedaActivaTrabContVistaAdmin = 1;numPaginaActualTrabContVistaAdmin = 1;
  	
   listTrabajadoresContratista.forEach(function(val,index){
      if(igualarStringBuscar(val.apellido).indexOf(valBuscarValorTrabCont) != -1 ||
         igualarStringBuscar(val.nombre).indexOf(valBuscarValorTrabCont) != -1 || 
         igualarStringBuscar(val.nroDocumento).indexOf(valBuscarValorTrabCont) != -1){
	 listTrabajadoresContratistaBuscador.push(val);
      }
   }); 
   
   cambiarPaginaTrabajadoresContratistaVistaAdmin();
}

function reiniciarBuscadorTrabajadoresContratistaVistaAdmin(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   $("#valBuscarValorTrabContVistaAdmin").val("").focus();
   busquedaActivaTrabContVistaAdmin = 0;numPaginaActualTrabContVistaAdmin = 1;
    
   cambiarPaginaTrabajadoresContratistaVistaAdmin();
}

function editarConsolidadoTrabajadoresContratistaVistaAdmin(pindex){
   if(!banderaEdicionTrabContVistaAdmin){
      trabContVistaAdminObj = (busquedaActivaTrabContVistaAdmin == 0?listTrabajadoresContratista[pindex]:listTrabajadoresContratistaBuscador[pindex]);

      $("#trTrabContVistaAdmin"+trabContVistaAdminObj.id).addClass("fila-edicion");
      
      var btnFotocheck = (trabContVistaAdminObj.evidenciaFotoNombre.length == 0?"<label>*Sin foto del trabajador registrada.</label>":
         "<button class='btn btn-success' onclick='generarFotocheckCodigoQrTrabajadorContratista(1)' " +
                 "title='Descargar el fotocheck del trabajador contratista.'>" +
            "<i class='fa fa-address-card fa-2x'></i>" +
         "</button>");
      
      $("#trabContFotocheck"+trabContVistaAdminObj.id).html(btnFotocheck);

      $("#trabContNombres"+trabContVistaAdminObj.id).html("<input id='inputTrabContNombresVistaAdmin' class='form-control'>");
      $("#inputTrabContNombresVistaAdmin").val(trabContVistaAdminObj.nombre);
      
      $("#trabContApellidos"+trabContVistaAdminObj.id).html("<input id='inputTrabContApellidosVistaAdmin' class='form-control'>");
      $("#inputTrabContApellidosVistaAdmin").val(trabContVistaAdminObj.apellido);

       $("#trabContArea"+trabContVistaAdminObj.id).html("<input id='inputTrabContAreaVistaAdmin' class='form-control'>");
       $("#inputTrabContAreaVistaAdmin").val(trabContVistaAdminObj.area);
      
      $("#trabContPuesto"+trabContVistaAdminObj.id).html("<input id='inputTrabContPuestoVistaAdmin' class='form-control'>");
      $("#inputTrabContPuestoVistaAdmin").val(trabContVistaAdminObj.cargo);

      formatoCeldaSombreableTabla(false,"tblConsolidadoTrabContVistaAdmin");
      
      $("#btnOcultarTrabContVistaAdmin").hide();$("#btnCancelarTrabContVistaAdmin").show();$("#btnGuardarTrabContVistaAdmin").show();
      $("#indicadorPaginaParcialAuxTrabContVistaAdmin").hide();$("#btnResetBuscadorTrabContVistaAdmin").hide();$("#btnAplicarBuscadorTrabContVistaAdmin").hide();
      $("#valBuscarValorTrabContVistaAdmin").hide();

      banderaEdicionTrabContVistaAdmin = true;
   }
}

function guardarConsolidadoTrabajadoresContratistaVistaAdmin(){
   var campoVacio = true;
   
   var nombre = $("#inputTrabContNombresVistaAdmin").val().trim();
   var apellido = $("#inputTrabContApellidosVistaAdmin").val().trim();
    var area = $("#inputTrabContAreaVistaAdmin").val().trim();
   var puestoTrabajo = $("#inputTrabContPuestoVistaAdmin").val().trim();
   
   if(campoVacio){
      var dataParam={
	 id:trabContVistaAdminObj.id,nombre:nombre,apellido:apellido,area:area,cargo:puestoTrabajo
      };
	        
      callAjaxPostSimple(URL+'/contratista/trabajadores/admin_excepcional/save',dataParam,1,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":  
	       $.unblockUI();$("#modalConsolidadoTrabContVistaAdmin").modal("hide");	
		
	       mensajeUx = "<label>El registro trabajador contratista fue guardado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarTrabCont"); 
								   
	       $("#modalMensajeUxActualizarTrabCont").on("hidden.bs.modal",function(){
	          cargarConsolidadoTrabajadoresContratistaVistaAdmin();  
	       });
		
	       break;
						
	    default:
	       alert("Ocurrió un error al guardar el registro trabajador contratista.");
	 }
      });	
   }else{
       
   }	
}

function generarFotocheckCodigoQrVehiculoMaquinaria(acceso){
   var vehMaqObj = (parseInt(acceso) == 1?vehMaqVistaAdminObj:vehiculoMaquinariaObj);

   var dataParam={
      id:vehMaqObj.id,contenidoCodigoQr:URL+"/pages/consultas.html?idContratista="+vehMaqObj.contratistaId +
         "&idVehiculoMaquinaria="+vehMaqObj.id,bucketNombre:BUCKETAMAZONS3
   };

   var registrarCodigoQr = (vehMaqObj.evidenciaCodigoQrNombre.length == 0?1:0);
   
   callAjaxPostSimpleVersionDos(registrarCodigoQr,URL+"/contratista/vehiculo_maquinaria/codigo_qr/save",dataParam,1,1,function(data){
      switch(data.CODE_RESPONSE){
	 case "05":  
	    window.open(URL+"/contratista/vehiculo_maquinaria/fotocheck?id="+vehMaqObj.id,"_blank");
	   
	    break;
						
	 default:
	    alert("Ocurrió un error al generar el código QR y/o descargar fotocheck.");
	}
   });
}

var listProyectosAsignados=[],listProyectosAsignadosBuscador=[];
var busquedaActivaProyAsigVistaAdmin,numPaginaActualProyAsigVistaAdmin,proyAsigVistaAdminObj,banderaEdicionProyAsigVistaAdmin;

function ocultarConsolidadoProyectosAsignadosVistaAdmin(){
    $("#modalConsolidadoProyAsigVistaAdmin").modal("hide");
}

function verConsolidadoProyectosAsignadosVistaAdmin(){
    $("#modalConsolidadoProyAsigVistaAdmin").remove();

    var contenido = "";

    var buttonOcultar =
        "<button id='btnOcultarProyAsigVistaAdmin' type='button' class='btn btn-info' style='margin-right:5px' " +
                "onclick='ocultarConsolidadoProyectosAsignadosVistaAdmin()' title='Regresar a la vista anterior.'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> "+"<i class='fa fa-table fa-2x'></i>" +
        "</button>";

    var buttonFlechas =
        "<span id='indicadorPaginaParcialAuxProyAsigVistaAdmin' style='margin:5px;margin-top:10px;'>" +
            "<a id='flechaIzquierdaProyAsigVistaAdmin'><img src='../imagenes/flecha_01.png' /></a>" +
                " <em id='labelFlechasProyAsigVistaAdmin'></em> " +
            "<a id='flechaDerechaProyAsigVistaAdmin'><img src='../imagenes/flecha_02.png' /></a>" +
        "</span>";

    var buscadorOpciones =
        "<button id='btnResetBuscadorProyAsigVistaAdmin' type='button' class='btn btn-success' " +
                "title='Refresh' onclick='reiniciarBuscadorProyectosAsignadosVistaAdmin()' style='float:right;'>" +
            "<i class='fa fa-refresh fa-2x'></i>" +
        "</button>" +
        "<button id='btnAplicarBuscadorProyAsigVistaAdmin' type='button' class='btn btn-success' " +
                "onclick='aplicarBuscadorProyectosAsignadosVistaAdmin()' style='float:right;margin-right:5px;' " +
                "title='Buscar los registros cuyo título del proyecto coincidan con las palabras ingresadas.'>" +
            "<i class='fa fa-search fa-2x'></i>" +
        "</button>" +
        "<input id='valBuscarValorProyAsigVistaAdmin' placeholder='Título' class='form-control' " +
               "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";

    var modalOptions={
        maxWidth:"90%",id:"modalConsolidadoProyAsigVistaAdmin",
        nombre:"<i class='fa fa-table'></i> Consolidado proyectos asignados - ("+contratistaObj.ruc+") "+contratistaObj.nombre,
        contenido:
            "<form class='form-inline'>" +
                 buttonOcultar+buttonFlechas+buscadorOpciones +
            "</form>" +
            "<div class='wrapper' id='wrapperConsolidadoProyAsigVistaAdmin'>" +
                "<table id='tblConsolidadoProyAsigVistaAdmin' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<td class='tb-acc' style='width:500px'>Título del proyecto</td>" +
                            "<td class='tb-acc' style='width:200px'>Fecha inicio</td>" +
                            "<td class='tb-acc' style='width:200px'>Fecha fin</td>" +
                            "<td class='tb-acc' style='width:250px'>Estado del proyecto</td>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperConsolidadoProyAsigVistaAdmin",190);
    cargarConsolidadoProyectosAsignadosVistaAdmin();

    $("#flechaIzquierdaProyAsigVistaAdmin").on('click',function(){
        numPaginaActualProyAsigVistaAdmin = numPaginaActualProyAsigVistaAdmin-1;
        cambiarPaginaProyectosAsignadosVistaAdmin();
    });

    $('#flechaDerechaProyAsigVistaAdmin').on('click',function(){
        numPaginaActualProyAsigVistaAdmin = numPaginaActualProyAsigVistaAdmin+1;
        cambiarPaginaProyectosAsignadosVistaAdmin();
    });
}

function cargarConsolidadoProyectosAsignadosVistaAdmin(){
    $("#modalConsolidadoProyAsigVistaAdmin").modal("show");$("#valBuscarValorProyAsigVistaAdmin").val("");
    busquedaActivaProyAsigVistaAdmin = 0,numPaginaActualProyAsigVistaAdmin = 1;

    var dataParam={
        id:contratistaObj.id
    };

    callAjaxPost(URL+'/contratista/proyecto_asignado',dataParam,function(data){
        if(data.CODE_RESPONSE == "05"){
            listProyectosAsignados = data.listProyectosAsignados;

            $("#tblConsolidadoProyAsigVistaAdmin tbody tr").remove();

            cambiarPaginaProyectosAsignadosVistaAdmin();

            goheadfixedY("#tblConsolidadoProyAsigVistaAdmin","#wrapperConsolidadoProyAsigVistaAdmin");
        }else{
            console.log("Error al cargar el consolidado proyectos asignados");
        }
    });

    $("#btnOcultarProyAsigVistaAdmin").show();$("#btnCancelarProyAsigVistaAdmin").hide();$("#btnGuardarProyAsigVistaAdmin").hide();
    $("#indicadorPaginaParcialAuxProyAsigVistaAdmin").show();$("#btnResetBuscadorProyAsigVistaAdmin").show();$("#btnAplicarBuscadorProyAsigVistaAdmin").show();
    $("#valBuscarValorProyAsigVistaAdmin").show();

    banderaEdicionProyAsigVistaAdmin = false;
}

function cambiarPaginaProyectosAsignadosVistaAdmin(){
    $("#flechaIzquierdaProyAsigVistaAdmin").show();$("#flechaDerechaProyAsigVistaAdmin").show();

    var list = (busquedaActivaProyAsigVistaAdmin == 0?listProyectosAsignados:listProyectosAsignadosBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualProyAsigVistaAdmin*partialSize)-partialSize;
    var finRegistro = (numPaginaActualProyAsigVistaAdmin*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasProyAsigVistaAdmin").html("<label>"+numPaginaActualProyAsigVistaAdmin+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualProyAsigVistaAdmin == 1){
        $("#flechaIzquierdaProyAsigVistaAdmin").hide();
    }

    if(numPaginaActualProyAsigVistaAdmin == numPaginaTotal){
        $("#flechaDerechaProyAsigVistaAdmin").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblConsolidadoProyAsigVistaAdmin tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
            var estadoActual = (val.estado.id == 3?"Completado":(val.estado.id == 2?"En Curso":"Pendiente"));

            $("#tblConsolidadoProyAsigVistaAdmin tbody").append(
                "<tr id='trProyAsigVistaAdmin"+val.id+"'>" +
                    "<td id='proyAsigTitulo"+val.id+"' style='word-break:break-all;'>"+val.titulo+"</td>" +
                    "<td id='proyAsigFechaInicio"+val.id+"'>"+val.fechaInicioTexto+"</td>" +
                    "<td id='ProyAsigFechaFin"+val.id+"'>"+val.fechaFinTexto+"</td>" +
                    "<td id='proyAsigEstado"+val.id+"'>"+estadoActual+"</td>" +
                "</tr>");
        }
    });

    $.unblockUI();
    formatoCeldaSombreableTabla(true,"tblConsolidadoProyAsigVistaAdmin");
}

function aplicarBuscadorProyectosAsignadosVistaAdmin(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valBuscarValorProyAsig = igualarStringBuscar($("#valBuscarValorProyAsigVistaAdmin").val());
    listProyectosAsignadosBuscador = [];
    busquedaActivaProyAsigVistaAdmin = 1;numPaginaActualProyAsigVistaAdmin = 1;

    listProyectosAsignados.forEach(function(val,index){
        if(igualarStringBuscar(val.titulo).indexOf(valBuscarValorProyAsig) != -1){
            listProyectosAsignadosBuscador.push(val);
        }
    });

    cambiarPaginaProyectosAsignadosVistaAdmin();
}

function reiniciarBuscadorProyectosAsignadosVistaAdmin(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    $("#valBuscarValorProyAsigVistaAdmin").val("").focus();
    busquedaActivaProyAsigVistaAdmin = 0;numPaginaActualProyAsigVistaAdmin = 1;

    cambiarPaginaProyectosAsignadosVistaAdmin();
}

var listObservacionesRegistradas=[],listObservacionesRegistradasBuscador=[];
var busquedaActivaObsRegVistaAdmin,numPaginaActualObsRegVistaAdmin,obsRegVistaAdminObj,banderaEdicionObsRegVistaAdmin;

function ocultarConsolidadoObservacionesRegistradasVistaAdmin(){
    $("#modalConsolidadoObsRegVistaAdmin").modal("hide");
}

function verConsolidadoObservacionesRegistradasVistaAdmin(){
    $("#modalConsolidadoObsRegVistaAdmin").remove();

    var contenido = "";

    var buttonOcultar =
        "<button id='btnOcultarObsRegVistaAdmin' type='button' class='btn btn-info' style='margin-right:5px' " +
                "onclick='ocultarConsolidadoObservacionesRegistradasVistaAdmin()' title='Regresar a la vista anterior.'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> "+"<i class='fa fa-table fa-2x'></i>" +
        "</button>";

    var buttonFlechas =
        "<span id='indicadorPaginaParcialAuxObsRegVistaAdmin' style='margin:5px;margin-top:10px;'>" +
            "<a id='flechaIzquierdaObsRegVistaAdmin'><img src='../imagenes/flecha_01.png' /></a>" +
                " <em id='labelFlechasObsRegVistaAdmin'></em> " +
            "<a id='flechaDerechaObsRegVistaAdmin'><img src='../imagenes/flecha_02.png' /></a>" +
        "</span>";

    var buscadorOpciones =
        "<button id='btnResetBuscadorObsRegVistaAdmin' type='button' class='btn btn-success' " +
                "title='Refresh' onclick='reiniciarBuscadorObservacionesRegistradasVistaAdmin()' style='float:right;'>" +
            "<i class='fa fa-refresh fa-2x'></i>" +
        "</button>" +
        "<button id='btnAplicarBuscadorObsRegVistaAdmin' type='button' class='btn btn-success' " +
                "onclick='aplicarBuscadorObservacionesRegistradasVistaAdmin()' style='float:right;margin-right:5px;' " +
                "title='Buscar los registros cuyo tipo coincidan con las palabras ingresadas.'>" +
            "<i class='fa fa-search fa-2x'></i>" +
        "</button>" +
        "<input id='valBuscarValorObsRegVistaAdmin' placeholder='Tipo' class='form-control' " +
               "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";

    var modalOptions={
        maxWidth:"90%",id:"modalConsolidadoObsRegVistaAdmin",
        nombre:"<i class='fa fa-table'></i> Consolidado proyectos asignados - ("+contratistaObj.ruc+") "+contratistaObj.nombre,
        contenido:
            "<form class='form-inline'>" +
                 buttonOcultar+buttonFlechas+buscadorOpciones +
            "</form>" +
            "<div class='wrapper' id='wrapperConsolidadoObsRegVistaAdmin'>" +
                "<table id='tblConsolidadoObsRegVistaAdmin' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<td class='tb-acc' style='width:500px'>Observación</td>" +
                            "<td class='tb-acc' style='width:200px'>Fecha de reporte</td>" +
                            "<td class='tb-acc' style='width:300px'>Tipo</td>" +
                            "<td class='tb-acc' style='width:150px'>Estado</td>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperConsolidadoObsRegVistaAdmin",190);
    cargarConsolidadoObservacionesRegistradasVistaAdmin();

    $("#flechaIzquierdaObsRegVistaAdmin").on('click',function(){
        numPaginaActualObsRegVistaAdmin = numPaginaActualObsRegVistaAdmin-1;
        cambiarPaginaObservacionesRegistradasVistaAdmin();
    });

    $('#flechaDerechaObsRegVistaAdmin').on('click',function(){
        numPaginaActualObsRegVistaAdmin = numPaginaActualObsRegVistaAdmin+1;
        cambiarPaginaObservacionesRegistradasVistaAdmin();
    });
}

function cargarConsolidadoObservacionesRegistradasVistaAdmin(){
    $("#modalConsolidadoObsRegVistaAdmin").modal("show");$("#valBuscarValorObsRegVistaAdmin").val("");
    busquedaActivaObsRegVistaAdmin = 0,numPaginaActualObsRegVistaAdmin = 1;

    var dataParam={
        id:contratistaObj.id
    };

    callAjaxPost(URL+'/contratista/proyectos_observaciones/asociados/simple',dataParam,function(data){
        if(data.CODE_RESPONSE == "05"){
            listObservacionesRegistradas = data.observacionesAsociadas;

            $("#tblConsolidadoObsRegVistaAdmin tbody tr").remove();

            cambiarPaginaObservacionesRegistradasVistaAdmin();

            goheadfixedY("#tblConsolidadoObsRegVistaAdmin","#wrapperConsolidadoObsRegVistaAdmin");
        }else{
            console.log("Error al cargar el consolidado proyectos asignados");
        }
    });

    $("#btnOcultarObsRegVistaAdmin").show();$("#btnCancelarObsRegVistaAdmin").hide();$("#btnGuardarObsRegVistaAdmin").hide();
    $("#indicadorPaginaParcialAuxObsRegVistaAdmin").show();$("#btnResetBuscadorObsRegVistaAdmin").show();$("#btnAplicarBuscadorObsRegVistaAdmin").show();
    $("#valBuscarValorObsRegVistaAdmin").show();

    banderaEdicionObsRegVistaAdmin = false;
}

function cambiarPaginaObservacionesRegistradasVistaAdmin(){
    $("#flechaIzquierdaObsRegVistaAdmin").show();$("#flechaDerechaObsRegVistaAdmin").show();

    var list = (busquedaActivaObsRegVistaAdmin == 0?listObservacionesRegistradas:listObservacionesRegistradasBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualObsRegVistaAdmin*partialSize)-partialSize;
    var finRegistro = (numPaginaActualObsRegVistaAdmin*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasObsRegVistaAdmin").html("<label>"+numPaginaActualObsRegVistaAdmin+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualObsRegVistaAdmin == 1){
        $("#flechaIzquierdaObsRegVistaAdmin").hide();
    }

    if(numPaginaActualObsRegVistaAdmin == numPaginaTotal){
        $("#flechaDerechaObsRegVistaAdmin").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblConsolidadoObsRegVistaAdmin tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
            var descripcion = (val.descripcion.trim().length == 0?"------":val.descripcion);

            $("#tblConsolidadoObsRegVistaAdmin tbody").append(
                "<tr id='trObsRegVistaAdmin"+val.id+"'>" +
                    "<td id='obsRegTitulo"+val.id+"' style='word-break:break-all;'>"+descripcion+"</td>" +
                    "<td id='obsRegFechaInicio"+val.id+"'>"+val.fechaTexto+"</td>" +
                    "<td id='obsRegFechaFin"+val.id+"'>"+val.reporte.nombre+"</td>" +
                    "<td id='obsRegEstado"+val.id+"'>"+val.nota.nombre+"</td>" +
                "</tr>");
        }
    });

    $.unblockUI();
    formatoCeldaSombreableTabla(true,"tblConsolidadoObsRegVistaAdmin");
}

function aplicarBuscadorObservacionesRegistradasVistaAdmin(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valBuscarValorObsReg = igualarStringBuscar($("#valBuscarValorObsRegVistaAdmin").val());
    listObservacionesRegistradasBuscador = [];
    busquedaActivaObsRegVistaAdmin = 1;numPaginaActualObsRegVistaAdmin = 1;

    listObservacionesRegistradas.forEach(function(val,index){
        if(igualarStringBuscar(val.reporte.nombre).indexOf(valBuscarValorObsReg) != -1){
            listObservacionesRegistradasBuscador.push(val);
        }
    });

    cambiarPaginaObservacionesRegistradasVistaAdmin();
}

function reiniciarBuscadorObservacionesRegistradasVistaAdmin(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    $("#valBuscarValorObsRegVistaAdmin").val("").focus();
    busquedaActivaObsRegVistaAdmin = 0;numPaginaActualObsRegVistaAdmin = 1;

    cambiarPaginaObservacionesRegistradasVistaAdmin();
}

function ocultarCambiarPasswordEncriptadaContratista(){
    $("#modalActualizarClaveCont").modal("hide");
}

function verCambiarPasswordEncriptadaContratista(){
    mensajeUx="<label>¿Está seguro de cambiar la contraseña encriptada?</label>"	
    mensajesUx(mensajeUx,3,"","ConfirmarCambioPasswordCont");
 	 
    $("#btnDevolverValorConfirmarCambioPasswordCont").on("click",function(){
       $("#modalActualizarClaveCont").remove();   

       var contenido = "";
     	
       var listContenido=[
          {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Nueva contraseña",inputForm:""},
          {sugerencia:"<label>*Debe incluir mínimo 8 caracteres.</label>",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
           inputForm:"<input id='inputNuevaClaveAccesoCont' type='text' class='form-control' autofocus>"},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",
           label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
 		        "onclick='ocultarCambiarPasswordEncriptadaContratista()'>" +
                    "<i class='fa fa-times'></i> Cancelar" +
                 "</button>",
           inputForm:"<button type='button' class='btn btn-success' onclick='guardarCambiarPasswordEncriptadaContratista()' " +
            		    "style='float:right;font-size:18px;'>" +
       	  	       "<i class='fa fa-floppy-o'></i> Guardar" +
       	  	    "</button>"}
       ];
       	  				
       listContenido.forEach(function(val){
          contenido += obtenerSubPanelModuloVersionDos(val);
       });
       	  				
       var modalOptions={
          id: "modalActualizarClaveCont",nombre: "<i class='fa fa-refresh'></i> Cambiar contraseña",
          contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
       };
        	  				
       crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    });    
 }

 function guardarCambiarPasswordEncriptadaContratista(){
    var campoVacio = true;
     
    var psw1 = $("#inputNuevaClaveAccesoCont").val().trim();
     	
    if(psw1.length < 8){
       campoVacio = false;
       mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, 8 caracteres.</label>";
    }
      	
    if(campoVacio){
       var dataParam={
 	 id:contratistaId,contraseniaNueva:psw1
       };
  	    
       callAjaxPost(URL+'/contratista/password/save',dataParam,function(data){
          switch(data.CODE_RESPONSE){
  	    case "05":
                $("#modalActualizarClaveCont").modal("hide"); 
  	       
  	        mensajeUx = data.mensaje;
  	        mensajesUx(mensajeUx,1,"","ActualizarClave");
  	       
  	        $("#modalMensajeUxActualizarClave").on("hidden.bs.modal",function(){
  	            $("#valBuscarRucNomContratistaPrincipal").val("");listarContratistas();
  	        });  
  	 		       
  	        break;
  	 							
  	    default:
  	       alert("Ocurrió un error al actualizar la contraseña!");
          }    	
       });
    }else{
        $("#modalActualizarClaveCont").modal("hide"); 
        mensajesUx(mensajeUx,2,"","ActualizarClave");
        
        $("#modalMensajeUxActualizarClave").on("hidden.bs.modal",function(){
  	    $("#modalActualizarClaveCont").modal("show");
        });  
    }    
}

var listOpcionDataRegAcc=[
	{id:1,nombre:"Trabajador contratista"},{id:2,nombre:"Vehículo/Maquinaria"}
];

function ocultarPrevioSeleccionarOpcionRegistroAcceso(){
	$("#modalPrevioRegistroAcceso").modal("hide");
}

function previoSeleccionarOpcionRegistroAcceso(){
	$("#modalPrevioRegistroAcceso").remove();
	
	var contenido = "";
	
	var selOpcDataRegAcc = crearSelectOneMenuOblig("selOpcDataRegAcc","",listOpcionDataRegAcc,"","id","nombre","");

    var listContenido=[
	  	{label:"Consolidado:",inputForm:selOpcDataRegAcc},
	  	{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
	  	{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarPrevioSeleccionarOpcionRegistroAcceso()'>" +
	               "<i class='fa fa-times'></i> Cancelar" +
	           "</button>",
	  	 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='enviarPrevioSeleccionarOpcionRegistroAcceso()'>" +
	  	               "<i class='fa fa-list-ul'></i> Seleccionar" +
	  	           "</button>"}
    ];
	  				
    listContenido.forEach(function(val){
	    contenido += obtenerSubPanelModuloVersionTres(val);
	});
	  
	var modalOptions={
	 	id:"modalPrevioRegistroAcceso",nombre:"<i class='fa fa-list-ul'></i> Seleccionar opción",
	  	contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
	};
	  				
    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function enviarPrevioSeleccionarOpcionRegistroAcceso(){
	$("#modalPrevioRegistroAcceso").modal("hide");
	
    var opcDataRegAccId = parseInt($("#selOpcDataRegAcc").val());
	
	$(".tab-content .tab-pane").hide();
	
	if(opcDataRegAccId == 1){
		$("#tabRegistroAccesoTrabContratista").show();
		
		crearFiltroRegistroAccesoTrabajadorContratista(valoresFiltroRegistroAccesoTrabajadorContratista);
	}else if(opcDataRegAccId == 2){
		$("#tabRegistroAccesoVehiculoMaquinaria").show();
				
		crearFiltroRegistroAccesoVehiculoMaquinaria(valoresFiltroRegistroAccesoVehiculoMaquinaria);
	}
}

var listOpcionDataSanciones=[
	{id:1,nombre:"Trabajador contratista"},{id:2,nombre:"Vehículo/Maquinaria"}
];

function ocultarPrevioSeleccionarOpcionSanciones(){
	$("#modalPrevioSanciones").modal("hide");
}

function previoSeleccionarOpcionSanciones(){
	$("#modalPrevioSanciones").remove();

	var contenido = "";
	
	var selOpcDataSanciones = crearSelectOneMenuOblig("selOpcDataSanciones","",listOpcionDataSanciones,"","id","nombre","");
	
	var listContenido=[
		{label:"Consolidado:",inputForm:selOpcDataSanciones},
		{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
		{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarPrevioSeleccionarOpcionSanciones()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='enviarPrevioSeleccionarOpcionSanciones()'>" +
				   "<i class='fa fa-list-ul'></i> Seleccionar" +
			   "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionTres(val);
	});

	var modalOptions={
		id:"modalPrevioSanciones",nombre:"<i class='fa fa-list-ul'></i> Seleccionar opción",
		contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function enviarPrevioSeleccionarOpcionSanciones(){
	$("#modalPrevioSanciones").modal("hide");

	var opcionId = parseInt($("#selOpcDataSanciones").val());
	$(".tab-content .tab-pane").hide();

	if(opcionId == 1){
		$("#tabBlacklist").show();
		
		crearFiltroBlacklist(valoresFiltroBlacklist);
	}else if(opcionId == 2){
		$("#tabSancionVehiculoMaquinaria").show();
		
		crearFiltroBlacklistVehiculoMaquinaria(valoresFiltroBlacklistVehiculoMaquinaria);
	}
}
