var banderaEdicion; 
var mensajeUx;
var auditoriaId;var auditoriaObj={};
var auditoriaTipo;
var auditoriaFecha;
var numAreas;
var listAudiTipo;
var listAreasSelecccionados;var listTipoEvaluacionGeneral=[];
var listAreas;
var auditoriaClasif;
var nombreAudi;
var nombreTipoAudi;
var listAudiFull;
var numRpta;
var indicador2;
var nivelAvance2;
var auditoriaEstado;
var auditoriaEstadoNombre; 
var listTrabajadoresResponsableAuditoria=[];
var trabajadorResponsableAuditoriaId=null;

var listEstadoAuditoriaAux=[
   {id:0,nombre:"Todos"},
   {id:1,nombre:"Aprobado"},
   {id:2,nombre:"Desaprobado",selected:1},
   {id:3,nombre:"Pendiente",selected:1},
   {id:4,nombre:"Por re-evaluar",selected:1}
];

var listValSino=[
   {id:0,nombre:"No"},
   {id:1,nombre:"Si"}
];

var listTipoResum=[
   {id:1,nombre:"Por Unidades"},
   {id:2,nombre:"Por "+getSession("gestopdivision")}
];

var listTipoResumHallazgo=[
   {id:1,nombre:"Por Unidades"},
   {id:2,nombre:"Por Área"}
];

var listFullEvalGerenciaAudiA=[];

var audiGerenEvalAId;
var audiGerenEvalAObj;
var listFullUsuGerenAPorNotificar=[];
var activarModalAccionesAuditoria;

function verFiltroAuditoria(){
	$("#modalFiltroAudi").modal("show");
}

function ocultarFiltroAuditoria(){
	$("#modalFiltroAudi").modal("hide");
}

function ocultarConsolidadoInspeccionesUnidades(){
   $("#modalEleccionInspeccionDescargar").modal("hide");
}

$(document).ready(function(){
   $(".divisionAlternativa").html(getSession("gestopdivision"))
   auditoriaClasif = location.pathname.substring(location.pathname.lastIndexOf("/") + 1) == 'auditoria.html'?1:2;
			
   var selTipoResum = crearSelectOneMenuOblig("selTipoResum","verResumenAuditoriaLista()",
      listTipoResum,"2","id","nombre");
					
   $("#divResumAudiLista form").prepend("Tipo:"+selTipoResum);
			
   var selTipoResumHallazgo = crearSelectOneMenuOblig("selTipoResumHallazgo","verResumenHallazgosGeneral()",
      listTipoResumHallazgo,"1","id","nombre")
					
   $("#divResumInspecc form").prepend("Tipo:"+selTipoResumHallazgo);
   //getUrlParameter("mdfId")
   var hoy = obtenerFechaActual();
			
   $("#fechaInicioResuInsp").val(sumaFechaDias(-60,hoy));
   $("#fechaFinResuInsp").val(sumaFechaDias(31,hoy));
			
   $("#fechaInicioResuAudiLista").val(sumaFechaDias(-60,hoy));
   $("#fechaFinResuAudiLista").val(sumaFechaDias(31,hoy));
			
   var dataParam={
      idCompany: getSession("gestopcompanyid"),
      auditoriaClasifId: auditoriaClasif
   }; 
				
   callAjaxPost(URL+'/auditoria/filtro',dataParam,function(data){
       console.log(data.list);
      var selUnidadAccidente = crearSelectOneMenu("selFiltroResponsableAuditoria","",
	 data.list,"","id","nombre","Todos");
		                                      
      if(data.numTrabajadores > 0){
	 selUnidadAccidente = crearSelectOneMenuOblig("selFiltroResponsableAuditoria","",
            data.list,"","id","nombre");
      }
							
      var selTipoEvaluacionTotal = crearSelectOneMenuOblig("selEvalAudiRes","",
	 listEstadoAuditoriaAux,0,"id","nombre");
							
      var selTipoListaTotal = crearSelectOneMenuOblig("selTipoListaTotal","",
	 data.listTipoLista,0,"audiTipoId","audiTipoNombre");
							
      var listAreasFiltrar = $("#filtroAreasAuditoria").val();
										
      var contenido = "";
							
      var listContenido=[
	 {sugerencia:"",label:"Desde",inputForm:"<input type='date' id='fechaInicioEvento' class='form-control'>"},
	 {sugerencia:"",label:"Hasta",inputForm:"<input type='date' id='fechaFinEvento' class='form-control'>"},
	 {sugerencia:"",label:"Responsable",inputForm:selUnidadAccidente},
	 {sugerencia:"",label:"Validación de gerencia",inputForm:selTipoEvaluacionTotal},
	 {sugerencia:"",label:"Tipo de inspección",inputForm:selTipoListaTotal},
	 {sugerencia:"",label:"Áreas",inputForm:"",divContainer:"divFiltroAreasAuditoria"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	 {sugerencia:"",
	  label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	  		"onclick='ocultarFiltroAuditoria()'>" +
	           "<i class='fa fa-times'></i> Cancelar" +
	        "</button>",
	  inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
	  		    "onclick='cargarPrimerEstado()'>" +
	               "<i class='fa fa-filter'></i> Aplicar filtro" +
	            "</button>"}
      ];
	    
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
							
      var modalOptions={
         id: "modalFiltroAudi",nombre: "<i class='fa fa-filter'></i> Filtros",
         contenido: "<form class='eventoGeneral'>"+ contenido+"</form>"
      };
							
      crearModalPrincipalUsuario(modalOptions,function(){
         if($("#filtroAreasAuditoria").length > 0){
            return;
         }
		 
         crearSelectOneMenuObligMultipleCompleto("filtroAreasAuditoria","",
            data.listAreasFiltrar,"areaId","areaName","#divFiltroAreasAuditoria","Todos");
      },true,true);
					
      
      if(parseInt(getSession("gestopcompanyid")) == 500){
	  $("#fechaInicioEvento").val(sumaFechaDias(-30,hoy));$("#fechaFinEvento").val(sumaFechaDias(15,hoy));
      }else{
          $("#fechaInicioEvento").val(sumaFechaDias(-60,hoy));$("#fechaFinEvento").val(sumaFechaDias(30,hoy));
      }	
      
      insertMenu();
      cargarPrimerEstado();
   });
			
   $("#mdVerif").load("agregaraccionmejora.html");
	
   resizeDivWrapper("wrapper2",300);	
});

function verSmartImportAuditoria(){
   
   var textBackUp ="<a class='efectoLink' href='"+URL+"/auditoria/masivo/plantilla'  " +
		      "target='_blank'><i class='fa fa-download'></i>"+"Descargar"+"</a>"
   var listItemsForm=[
		{sugerencia:"",label:"<i class='fa fa-download'></i> Plantilla ",inputForm:textBackUp,divContainer:""},
		{sugerencia:"",label:"<i class='fa fa-info'></i> Archivo Excel: ",inputForm:"",divContainer:"divExcelImportAudi"},
		{sugerencia:" ",label:"",inputForm:"<button class='btn btn-success' style='float:right;'><i class='fa fa-floppy-o'></i> Guardar</button>",divContainer:""}
		     ];
   var text="";
		       	
   listItemsForm.forEach(
      function(val,index){
	 text+=obtenerSubPanelModuloGeneral(val);
   });
		       	
   var contenido="<form id='formImportEventoAudi' class='eventoGeneral'>" +
		    "<div id='tituloEvento'>" + 
		        text+
		    "</div>"+
		    "</div>" +
		 "</form>";  
   
   var listPaneles= 
	   {id:"divImportAuditoria",nombre:"Importar auditoria (import)",clase:"listaAuxiliar",contenido:contenido}
		       	                  ;
   crearModalPrincipalUsuario(listPaneles,
      function(){
         var options=
	            {container:"#divExcelImportAudi",
	             functionCall:function(){  },
	             descargaUrl: "",
	             esNuevo:true,
	             idAux:"ImportExcelAudi",
	             evidenciaNombre:""};
	             crearFormEvidenciaCompleta(options);
      },false,true);
		
   $("#formImportEventoAudi").on("submit",function(e){
         e.preventDefault();
	 enviarExcelImportAuditoria();
   });	
}

function enviarExcelImportAuditoria(){

   guardarEvidenciaAuto(0,"fileEviImportExcelAudi",bitsEvidenciaActoInseguro,
		        "/auditoria/excel/masivo/save",
      function(data){
       //alert(data.mensaje);
         if(data.mensaje.length > 0){alert(data.mensaje);}
	 verSmartFinalizarImportAuditoria();
      },"id",[{id : "empresaId",value:getSession("gestopcompanyid")}]);
}

function verSmartFinalizarImportAuditoria(){
    
   $("#divImportAuditoria").remove();
   var btnDescarga = "<a class='efectoLink'" +
			"target='_blank' href='"+URL+"/trabajador/estado/excel?empresaId="+getSession("gestopcompanyid")+"' >" +
			"<i class='fa fa-download'></i>Descargar</a>"
   var listItemsForm=[
		{sugerencia:"",label:"<i class='fa fa-check'></i> Mensaje ",inputForm: "Carga de registros completa",divContainer:""},
		{sugerencia:" ",label:"",inputForm: "<button class='btn btn-success'  ><i class='fa fa-check'></i> Finalizar</button>",divContainer:""}
		     ];
   var text="";
   
   listItemsForm.forEach(
      function(val,index){
         text+=obtenerSubPanelModuloGeneral(val);
      });
		       
   var contenido="<form id='formImportFinalEvento' class='eventoGeneral' >" +
		    "<div id='tituloEvento'>" + 
		        text+
		    "</div>"+
		    "</div>" +
		  "</form>";  
		       	
   var listPaneles={id:"divImportFinalAuditoria",nombre:"Finalizar Import Registros",clase:"listaAuxiliar",contenido:contenido};
		       	
   agregarModalPrincipalColaboradorGeneral(listPaneles,function(){
			 
   });
		
   $("#formImportFinalEvento").on("submit",
      function(e){
	 e.preventDefault();
         $(".modal").modal("hide");
         $("#divImportAuditoria").remove();
         $("#divImportFinalAuditoria").remove();
         cargarPrimerEstado();
      });
}

var textoaud="",textoaud2="";

function volverDivAuditoria(){   
         
   if(auditoriaClasif == 2){
      textoaud="Inspecciones"
      textoaud2="# de inspecciones tipo lista"
   }else{
      textoaud="Diagnósticos Linea Base"
      textoaud2="# de diagnósticos realizados"
   }
	
   $("#tblResumInspecc #tdResAudiLista").html(""+textoaud2+"");
   $("#tdResAudiListaDivision").html(""+textoaud2+"");
   $("#divGeneral h2").html(""+textoaud);
   $("#divGeneral .container-fluid").hide();
   $("#divAudi").show();
   $("#modalFiltroAudi").modal("hide");
   $("#fsBotones").show();
}

function cargarPrimerEstado(){
   $("#valBuscarValorAuditoria").val("");
    
   resizeDivWrapper("wrapper2",180); 
  
   volverDivAuditoria();
 //resizeDivGosst("wrapper2",0);  *** Intefiere con el resizeDivWrapper ***
   banderaEdicion = false;
   auditoriaId = 0;auditoriaObj = {};auditoriaTipo = 0;
   listAudiTipo = [];listAreas = [];listAreasSelecccionados = [];
	
   removerBotones();
   crearBotones();
   
   if(auditoriaClasif == 1){
       $("#fsBotones")
       .append("<button id='btnNuevoAudi' type='button' class='btn btn-success' title='Nueva auditoría - " +
       		       "Añade una nueva fila para ingresar los datos de una auditoría.'>"
    	    + "<i class='fa fa-file-o fa-2x'></i>"
             + "</button>");    
   }else{
       $("#fsBotones")
       .append("<button id='btnNuevoInsp' type='button' class='btn btn-success' title='Nueva inspección - " +
       		        "Añade una nueva fila para ingresar los datos de una inspección.'>"
    	    + "<i class='fa fa-file-o fa-2x'></i>"
             + "</button>");   
   }
   
   $("#fsBotones")
   .append("<button id='btnListarVerificaciones' type='button' class='btn btn-success' title='Ingresar a la lista de verificación'>"
	    + "<i class='fa fa-list-ol fa-2x'></i>"
        + "</button>");
   $("#fsBotones")
   .append("<button id='btnClipTabla' type='button' class='btn btn-success' title='Copiar los elementos de la tabla - Permite copiar las filas" +
		       " de la tabla Inspecciones para pegarlos en otro archivo (por ejemplo, en un excel).'>"
	    + "<i class='fa fa-clipboard fa-2x'></i>" 
	 + "</button>");
	
   /*$("#fsBotones")
   .append("<button id='btnClipTablaResAudiLista' type='button' class='btn btn-success clipGosst' title='Tabla Clipboard' >"
	    + "<i class='fa fa-clipboard fa-2x'></i>" 
	 + "</button>");*/
	
   $("#fsBotones")
   .append("<button id='btnExcelInspecc' type='button' class='btn btn-success' title='Excel' >"
	    + "<i class='fa fa-file-excel-o fa-2x'></i>" 
	 + "</button>");
   
   deshabilitarBotonesEdicion();
   $("#btnListarVerificaciones").hide();
   
   $("#fsBotones")
   .append("<button id='btnGenReporte' type='button' class='btn btn-success btn-word' title='Generar Informe'>"
	    + "<i class='fa fa-file-word-o fa-2x'></i>"
         + "</button>");
   
   $("#fsBotones").append(
      "<button id='btnHallazgo' type='button' class='btn btn-success' title='Listar Hallazgos'>" +
         "<i class='fa fa-list fa-2x'></i>" +
      "</button>");

   $("#fsBotones")
   .append("<button id='btnMonitoreo' type='button' class='btn btn-success' title='Listar Monitoreos'>"
	    + "<i class='fa fa-list fa-2x'></i>"
	 + "</button>");
   
   $("#fsBotones")
   .append("<button id='btnGenMonitoreoWord' type='button' class='btn btn-success btn-word' title='Reporte de Monitoreo'>"
	    + "<i class='fa fa-file-word-o fa-2x'></i>"
	 + "</button>");
	
   $("#fsBotones")
   .append("<button id='btnConfigurarImpact' type='button' class='btn btn-success' title=' Configurar impacto de listas de verificación - "
   		+"Nos permite acceder a la tabla Configuración del impacto (esta tabla no puede ser editada; pero tiene un enlace en cada fila de "
   		+"la columna Número de preguntas).'>"
	    + "<i class='fa fa-cog fa-2x'></i> "
         + "</button>");
   
   if(auditoriaClasif == 1){
      $("#fsBotones")
      .append("<button id='btnConsolidadoInspecc' type='button' class='btn btn-success' title='Descargar consolidado de inspecciones de Hallazgos Libres – Unidades'>"
	       + "<i class='fa fa-file-excel-o fa-2x'></i>  "
	    + "</button>");
   }else{
      $("#fsBotones").append(
         "<button id='btnConsolidadoInspeccHLCL' type='button' class='btn btn-success' title='Descargar consolidado de inspecciones (Unidades) - " +
      	         "Por medio de un formulario (el cual aparece al dar click a este botón), permite obtener un archivo excel del tipo de inspección " +
      	         "seleccionado (hallazgos libres o checklist) y el intervalo de tiempo requerido.' onclick='valoresEleccionInspeccionDescargar()'>" +
            "<i class='fa fa-file-excel-o fa-2x'></i>" +
	 "</button>");
   }	
	
//   $("#fsBotones")
//   .append("<button id='btnGenReporteExcel' type='button' class='btn btn-success btn-excel' title='Generar Informe'>"
//	    + "<i class='fa fa-file-excel-o fa-2x'></i>"
//	 + "</button>");
	 
   $("#fsBotones")
   .append("<button id='btnResListaAudit' type='button' class='btn btn-success' title='Ver resumen de inspecciones de tipo listas de verificación - "
      	             + "Nos permite acceder a la tabla Resumen de detalle por divisiones/por unidades (según la elección del usuario) de las inspecciones.'>" 
	    + "<i class='fa fa-pencil-square-o fa-2x'></i>"
	 + "</button>");
	 
// if(auditoriaClasif == 2){
		
      $("#fsBotones")
      .append("<button id='btnResHallAudit' type='button' class='btn btn-success' title='Ver resumen de inspecciones de tipo hallazgos libres - "
      	       + "Nos permite acceder a la tabla Resumen de detalle por unidades/por área (según la elección del usuario) de las inspecciones.'>" 
	       + "<i class='fa fa-eye fa-2x'></i> "
	    + "</button>");
		
      $("#fsBotones")
      .append("<button id='filtroAplicarBuscador' type='button' onclick='verFiltroAuditoria()' title='Aplicar Filtro - Permite filtrar la información en función a los datos que se ingresen"
                        + " en el formulario (el cual aparece al dar click a este botón).' class='btn btn-success'>"
	       + "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>"
	    + "</button>");
		
      $("#fsBotones")
      .append("<button id='btnImportInspecc' onclick='verSmartImportAuditoria()' type='button' class='btn btn-info' title='Importar registro(s) de inspección(es) por medio de una plantilla - "
      	                 +"Involucra dos pasos a seguir. En el primero, descargamos una plantilla (del enlace Descargar) en excel para ingresar/copiar los datos en las celdas respectivas. " 
      	                 +"Acto seguido, se debe subir el archivo excel antes mencionado (con sus respectivas modificaciones).'>"
	       + "<i class='fa fa-upload fa-2x'></i>"
	    + "</button>");

      $("#fsBotones")
      .append("<button id='btnHistorialRegistroAudi' type='button' title='Historial' class='btn btn-historial'>"
	       + "<i class='fa fa-2x fa-header' aria-hidden='true'></i>"
	    + "</button>");
// }
   if(auditoriaClasif != 1){
      $("#fsBotones").append(
         "<button id='btnHerramientasInspecc' type='button' class='btn btn-success' title='Seleccionar una " +
                 "herramienta para cargar una lista del mismo, siendo posible registrar, editar y eliminar.' " +
                 "onclick='seleccionarHerramientaInspeccion()'>" +
	    "<i class='fa fa-briefcase fa-2x'></i>" +
	 "</button>");    
   }
   
   $("#fsBotones").append(
      "<button id='btnTipoAuditoriaAsocInspecc' type='button' title='Ver la lista de elementos asociados a " +
              "la inspección seleccionada.' class='btn btn-success' onclick='irHaciaConsolidadoRespectivoTipoAuditoria()'>" +
         "<i class='fa fa-2x fa-table' aria-hidden='true'></i>" +
      "</button>");
   
   $("#fsBotones").append(
      "<button id='btnExcelTipoAuditoriaEvaluados' type='button' class='btn btn-success btn-excel' title='Generar Excel con la " +
              "lista de elementos asociados a la inspección' onclick='descargarExcelRespectivoTipoAuditoria()'>" +
         "<i class='fa fa-file-excel-o fa-2x'></i> " +
         "<i class='fa fa-table'></i>" +
      "</button>");
   
   if(auditoriaClasif != 1){
      $("#fsBotones").append(
         "<button id='btnGraficoAuditoria' type='button' class='btn btn-info' title='Seleccionar una " +
                 "de las opciones para generar el gráfico respectivo.' onclick='seleccionarOpcionGraficoAuditoria()'>" +
            "<i class='fa fa-bar-chart fa-2x'></i> " +
            "<i class='fa fa-info-circle'></i>" +
 	 "</button>");    
      
      $("#fsBotones").append(
         "<button id='btnConsolidadoAuditoria' type='button' class='btn btn-info' title='Seleccionar una " +
	         "de las opciones para generar el consolidado respectivo.' onclick='seleccionarOpcionConsolidadoAuditoria()'>" +
	    "<i class='fa fa-table fa-2x'></i> " +
	    "<i class='fa fa-info-circle'></i>" +
	 "</button>");    
    }
   
//   $("#fsBotones").append(
//      "<button id='btnAlmImaExcAaudi' onclick='almacenImagenExcelAuditoria()' type='button' " +
//              "class='btn btn-info' title='Imágenes del almacén excel.'>" +
//         "<i class='fa fa-file-image-o fa-2x'></i>" + 
//      "</button>");
   
   $("#btnGenReporteExcel").attr("onclick", "javascript:generarExcelInspeccion();");
   $("#btnGenReporteExcel").hide();
   
   $("#btnHistorialRegistroAudi").on("click",function(){
         verHistorialRegistro(1,auditoriaId);
   });
	
   $("#btnHallazgo").on("click",function(){
      cargarHallazgos();
   });
	
   $("#btnConfigurarImpact").on("click",function(){
      verConfigImpacto();
   });
	
   $("#btnMonitoreo").on("click",function(){
         cargarMonitoreos();
   });
   
   $("#btnGenMonitoreoWord").on("click",function(){
         generarReporteWordMonitoreo(); 
   });
	
   $("#btnNuevo").hide();$("#btnHallazgo").hide();$("#btnMonitoreo").hide(); 
   $("#btnGenMonitoreoWord").hide();$("#fsBotones").show();$("#btnGenReporte").hide();
   $("#divConfigImpacto").hide();$("#divListClasif").hide();$("#btnExcelInspecc").hide();
   $("#btnConfigurarImpact").show();$("#btnTipoAuditoriaAsocInspecc").hide();$("#btnExcelTipoAuditoriaEvaluados").hide();
	
   if(auditoriaClasif == 1){
      $("#btnConsolidadoInspecc").show();
   }else{
      $("#btnConsolidadoInspeccHLCL").show();
   }
   
   $("#btnImportInspecc").hide();$("#btnHerramientasInspecc").show();$("#btnGraficoAuditoria").show();
   $("#btnHistorialRegistroAudi").hide();$("#btnResetBuscadorAuditoria").show();$("#btnAplicarBuscadorAuditoria").show();
   $("#valBuscarValorAuditoria").show();$("#btnConsolidadoAuditoria").show();$("#btnNuevoInsp").hide();

   $("#btnClipTabla").attr("onclick","javascript:copiarTablaDetalleInspeccion();");
   $("#btnGenReporte").attr("onclick","javascript:generarReporteAuditoria();");
   $("#btnExcelInspecc").attr("onclick","javascript:generarReporteExcelAuditoria();");
   //$("#btnNuevo").attr("onclick", "javascript:nuevoAuditoria();");
   $("#btnNuevoAudi").attr("onclick","javascript:nuevoAuditoria();");
   $("#btnNuevoInsp").attr("onclick","javascript:nuevoAuditoria();");
   $("#btnCancelar").attr("onclick","javascript:cancelarAuditoria();");
   $("#btnGuardar").attr("onclick","javascript:guardarAuditoria();");
   $("#btnEliminar").attr("onclick","javascript:eliminarAuditoria();");
   $("#btnListarVerificaciones").attr("onclick","javascript:listarVerificaciones();");
   $("#btnResHallAudit").attr("onclick","javascript:verResumenHallazgosGeneral();");
   $("#btnResListaAudit").attr("onclick","javascript:verResumenAuditoriaLista();");
   
   $("#btnClipTablaResInspecc").on("click",function(){
         var list=obtenerDatosTablaEstandarNoFija("tblResumInspecc");
	 copiarAlPortapapeles(list,"btnClipTablaResInspecc");
	 //alert("Se han guardado los datos al Clipboard");
	 mensajeUx="Se han copiado todas las filas de la tabla Resumen de inspecciones libres por unidades.";
	 mensajesUx(mensajeUx,1,"");
   });
	
   var listAreasFiltrar = $("#filtroAreasAuditoria").val();
   var listAreasFiltrarId = [];
	
   if(listAreasFiltrar != null){
      listAreasFiltrar.forEach(function(val){
         listAreasFiltrarId.push(parseInt(val));
      });
   }
	
   (listAreasFiltrarId.length == 0? listAreasFiltrarId = null:"");
	
   var dataParam={
      idCompany: getSession("gestopcompanyid"),
      listAreasFiltrarId: listAreasFiltrarId,
      auditoriaClasifId: auditoriaClasif,
      estadoImplementacion: ($("#selEvalAudiRes").val() == 0?null:$("#selEvalAudiRes").val()),
      auditoriaTipo: ($("#selTipoListaTotal").val() == 0?null:$("#selTipoListaTotal").val()),
      fechaInicioPresentacion: $("#fechaInicioEvento").val(),
      fechaFinPresentacion: $("#fechaFinEvento").val(),
      trabajador: ($("#selFiltroResponsableAuditoria").val() == -1 || 
	 $("#selFiltroResponsableAuditoria option:selected").text() == ""?null:
         {trabajadorId: $("#selFiltroResponsableAuditoria").val(),
	  nombre: $("#selFiltroResponsableAuditoria option:selected").text()})
   };

   callAjaxPost(URL+'/auditoria/solo',dataParam,procesarDataDescargadaPrimerEstado);
      
   $("#btnUpload").hide();
}

function copiarTablaDetalle(){
    
   var list=obtenerDatosTablaEstandarNoFija("tblResumAudiLista");
   copiarAlPortapapeles(list,"btnClipTablaResAudiLista");
	 
   //alert("Se han guardado los datos al Clipboard");
   mensajeUx = "Se han guardado los datos al Clipboard";
   mensajesUx(mensajeUx,1,"");
}

function copiarTablaDetalleDivision(){
   var list=obtenerDatosTablaEstandarNoFija("tblResumAudiListaDivision");
   copiarAlPortapapeles(list,"btnClipTablaResAudiLista");
	 
   alert("Se han guardado los datos al Clipboard");
}

function copiarTablaDetalleInspeccion(){
    var list=obtenerDatosTablaEstandar("tblAudi");
    copiarAlPortapapeles(list,"btnClipTabla");
    //alert("Se han guardado los datos al Clipboard");
    mensajeUx="Se han copiado todas las filas de la tabla Inspecciones.";
    mensajesUx(mensajeUx,1,"");
}

function verResumenAuditoriaLista(){
        
   $("#fsBotones").hide();     
   $("#tdResDetaAudi").html("Unidad");
   $("#divGeneral .container-fluid").hide();
   $("#divGeneral #divResumAudiLista .wrapper").hide();
   $("#divGeneral #divResumAudiLista").show();
   $("#mensajeResumenDetalle").html("");
	
   resizeDivWrapper("wrapResumAudiListaDivision",190); /*antes -> 300*/
   resizeDivWrapper("wrapResumAudiLista",300);
	
   var dataParamAudi = {
	        idCompany : getSession("gestopcompanyid"),
		auditoriaClasifId : auditoriaClasif,
		fechaInicioPresentacion:$("#fechaInicioResuAudiLista").val(),
		fechaFinPresentacion:$("#fechaFinResuAudiLista").val()
       };
   
   var tipoId = parseInt($("#selTipoResum").val());
	
   if(tipoId == 2){
      $("#mensajeResumenDetalle").html("En caso una evaluación considere a más de una " +
		  ""+getSession("gestopdivision")+" el resultado de la "+textoaud+" se" +
		  " replicará para los items seleccionados  ")
		
      $("#btnClipTablaResAudiLista").attr("onclick","copiarTablaDetalleDivision()");
      
      callAjaxPost(URL + '/auditoria/resumen/lista/general/divisiones', dataParamAudi,
         function(data){ 
	    $("#wrapResumAudiListaDivision").show();
	    goheadfixedY("#tblResumAudiListaDivision","#wrapResumAudiListaDivision");
	    $("#divGeneral h2").html("<a onclick='volverDivAuditoria()'> "+textoaud+" </a> " +
				     "    " +
				     "> Resumen de detalle  por Divisiones");
	    $("#tblResumAudiListaDivision tbody tr").remove();
				
	    var divisiones=data.divisiones;
	    var totalInspecciones=0;
	    var totalRequisitoCumple=0;
	    var totalRequisitoParcial=0;
	    var totalRequisitoNoCumple=0;
	    var totalCompletadas=0;
	    var totalEnProceso=0;
				
				
	    divisiones.forEach(
	       function(val){
	          totalInspecciones+=val.numAuditorias;
	          totalRequisitoCumple+=val.numRequisitoCumple;
	          totalRequisitoParcial+=val.numRequisitoParcial;
	          totalRequisitoNoCumple+=val.numRequisitoNoCumple;
	          totalCompletadas+=val.numAccionesCompletada;
	          totalEnProceso+=val.numAccionesEnProceso;
	          var promedio=(val.numRequisitoCumple*1+val.numRequisitoParcial*0.5+val.numRequisitoNoCumple*0)
							/ (val.numRequisitoCumple+val.numRequisitoParcial+val.numRequisitoNoCumple);
					
	          var promedioAcc = val.numAccionesCompletada / (val.numAccionesCompletada + val.numAccionesEnProceso);
					
		  $("#tblResumAudiListaDivision tbody")
		                  .append("<tr>" +
					     "<td>"+val.matrixName+"</td>" +
					     "<td>"+val.divisionName+"</td>" +
					     "<td>"+val.numAuditorias+"</td>" +
					     "<td>"+val.numRequisitoCumple+"</td>" + 
					     "<td>"+val.numRequisitoParcial+"</td>" + 
					     "<td>"+val.numRequisitoNoCumple+"</td>" +
					     "<td>"+pasarDecimalPorcentaje(promedio)+"</td>" + 
					     "<td>"+val.numAccionesCompletada+"</td>" + 
					     "<td>"+val.numAccionesEnProceso+"</td>" + 
					     "<td>"+pasarDecimalPorcentaje(promedioAcc)+"</td>" + 
					  "</tr>");
	       });
				
	  var promedio=(totalRequisitoCumple*1+totalRequisitoParcial*0.5+totalRequisitoNoCumple*0)
			   / (totalRequisitoCumple+totalRequisitoParcial+totalRequisitoNoCumple);
	  var promedioAcc=totalCompletadas / (totalCompletadas + totalEnProceso);
	  var estiloCelda="style='background-color: #f4d8a3;' ";
	  
	  $("#tblResumAudiListaDivision tbody")
	                  .append("<tr>" +
				     "<td "+estiloCelda+" >"+"..."+"</td>" +
				     "<td "+estiloCelda+" >"+"TOTAL"+"</td>" +
				     "<td "+estiloCelda+">"+totalInspecciones+"</td>" +
				     "<td "+estiloCelda+">"+totalRequisitoCumple+"</td>" + 
				     "<td "+estiloCelda+">"+totalRequisitoParcial+"</td>" + 
				     "<td "+estiloCelda+">"+totalRequisitoNoCumple+"</td>" + 
				     "<td "+estiloCelda+">"+pasarDecimalPorcentaje(promedio)+"</td>" + 
				     "<td "+estiloCelda+">"+totalCompletadas+"</td>" + 
				     "<td "+estiloCelda+">"+totalEnProceso+"</td>" + 
				     "<td "+estiloCelda+">"+pasarDecimalPorcentaje(promedioAcc)+"</td>" + 
				   "</tr>");
         });
		
   }else{
      $("#btnClipTablaResAudiLista").attr("onclick","copiarTablaDetalle()");
      callAjaxPost(URL + '/auditoria/resumen/lista/general', dataParamAudi,
         function(data){
	    if(data.CODE_RESPONSE == "05"){
	       $("#wrapResumAudiLista").show();
	       $("#divGeneral h2").html("<a onclick='volverDivAuditoria()'> "+textoaud+" </a> " +
					"    " +
					"> Resumen de detalle  por Unidades");
	       $("#tblResumAudiLista tbody tr").remove();
	       
	       var unidadesAux=data.unidades;
	       var totalInspecciones=0;
	       var totalRequisitoCumple=0;
	       var totalRequisitoParcial=0;
	       var totalRequisitoNoCumple=0;
	       var totalCompletadas=0;
	       var totalEnProceso=0;
				
	       unidadesAux.forEach(
	          function(val){
		     val.numRequisitoCumple=0;
		     val.numRequisitoParcial=0;
		     val.numRequisitoNoCumple=0;
		     val.numEnProceso=0;
		     val.numCompletada=0;
		     
		     val.auditorias.forEach(
		        function(val1){
			   val1.respuestas.forEach(
			      function(val2){
			         val.numCompletada+= val2.numAccionesCompletada;
			         val.numEnProceso+= val2.numAccionesEnProceso;
						
				 switch(val2.respuesta){
				    case 1:
				       val.numRequisitoCumple++;
				       break;
				    case 0.5:
				       val.numRequisitoParcial++;
				       break;
				    case 0:
				       val.numRequisitoNoCumple++;
				       break;
				  }
			       });
			});
					
		     totalInspecciones+=val.auditorias.length;
		     totalRequisitoCumple+=val.numRequisitoCumple;
		     totalRequisitoParcial+=val.numRequisitoParcial;
		     totalRequisitoNoCumple+=val.numRequisitoNoCumple;
		     totalCompletadas+=val.numCompletada;
		     totalEnProceso+=val.numEnProceso;
		     
		     var promedio=(val.numRequisitoCumple*1+val.numRequisitoParcial*0.5+val.numRequisitoNoCumple*0)
							/ (val.numRequisitoCumple+val.numRequisitoParcial+val.numRequisitoNoCumple);
		     var promedioAcc = val.numCompletada / (val.numCompletada + val.numEnProceso);
					
		     $("#tblResumAudiLista tbody")
		                  .append("<tr>" +
					     "<td>"+val.matrixName+"</td>" +
					     "<td>"+val.auditorias.length+"</td>" +
					     "<td>"+val.numRequisitoCumple+"</td>" + 
					     "<td>"+val.numRequisitoParcial+"</td>" + 
					     "<td>"+val.numRequisitoNoCumple+"</td>" +
					     "<td>"+pasarDecimalPorcentaje(promedio)+"</td>" + 
					     "<td>"+val.numCompletada+"</td>" + 
					     "<td>"+val.numEnProceso+"</td>" + 
					     "<td>"+pasarDecimalPorcentaje(promedioAcc)+"</td>" + 
					   "</tr>");
	          });
				
	       	  var promedio=(totalRequisitoCumple*1+totalRequisitoParcial*0.5+totalRequisitoNoCumple*0)
				    / (totalRequisitoCumple+totalRequisitoParcial+totalRequisitoNoCumple);
	       	  var promedioAcc=totalCompletadas / (totalCompletadas + totalEnProceso);
	       	  var estiloCelda="style='    background-color: #f4d8a3;' ";
				
	       	   $("#tblResumAudiLista tbody")
	       	         .append("<tr>" +
	       	        	     "<td "+estiloCelda+">"+"TOTAL"+"</td>" +
	       	        	     "<td "+estiloCelda+">"+totalInspecciones+"</td>" +
	       	        	     "<td "+estiloCelda+">"+totalRequisitoCumple+"</td>" + 
	       	        	     "<td "+estiloCelda+">"+totalRequisitoParcial+"</td>" + 
	       	        	     "<td "+estiloCelda+">"+totalRequisitoNoCumple+"</td>" + 
	       	        	     "<td "+estiloCelda+">"+pasarDecimalPorcentaje(promedio)+"</td>" + 
	       	        	     "<td "+estiloCelda+">"+totalCompletadas+"</td>" + 
	       	        	     "<td "+estiloCelda+">"+totalEnProceso+"</td>" + 
	       	        	     "<td "+estiloCelda+">"+pasarDecimalPorcentaje(promedioAcc)+"</td>" + 
				  "</tr>");
	    }else{
	       alert("Error al realizar resumen")
	    }
      });
   }
}
function verResumenHallazgosGeneral(){
   
    $("#fsBotones").hide();     
   $("#divGeneral .container-fluid").hide();
   $("#divGeneral #divResumInspecc .wrapper").hide();
   $("#divGeneral #divResumInspecc").show();
   
   resizeDivWrapper("wrapResumInspeccArea",170); 
   resizeDivWrapper("wrapResumInspecc",300);
   
   $("#divGeneral h2").html("<a onclick='volverDivAuditoria()'>Auditorías </a> " +
			    "    " +
			    "> Resumen de inspecciones libres");
   var dataParamAudi = {
	   idCompany : getSession("gestopcompanyid"),
	   auditoriaClasifId : 2,
	   fechaInicioPresentacion:$("#fechaInicioResuInsp").val(),
	   fechaFinPresentacion:$("#fechaFinResuInsp").val()
   };
	
   var tipoIdHallazgo = parseInt($("#selTipoResumHallazgo").val());
	
   if(tipoIdHallazgo == 1){
         callAjaxPost(URL + '/auditoria/resumen/hallazgos/general', dataParamAudi,
	    function(data){
	       if(data.CODE_RESPONSE == "05"){
		     $("#wrapResumInspecc").show();
		     $("#divGeneral h2").html("<a onclick='volverDivAuditoria()'> Auditorías </a> " +
					      "    " +
					      "> Resumen de inspecciones libre por unidades");
		     
		     $("#btnClipTablaResInspecc").show();
		     $("#tblResumInspecc tbody tr").remove();
		     
		     var unidadesAux=data.unidades;
		     var nivelesAux = data.niveles;
		     $("#thObservacionesResumen").attr("colspan",nivelesAux.length+1)
		     $("#trNivelesResumen").html("<th class='tb-acc' style='width:190px'>Total</th>");
		     nivelesAux.forEach(function(val){
			 $("#trNivelesResumen").append("<th class='tb-acc' style='width:190px'>"+val.nombre+"</th>") 
		     });
		     $("#trNivelesResumen").append("<th class='tb-acc' style='width:190px'>Cerrado</th>");
		     $("#trNivelesResumen").append("<th class='tb-acc' style='width:190px'>Abierto</th>");
		     var totalInspecciones=0;
		     var totalObservaciones=0;
		     var totalObservaciones1=0;
		     var totalObservaciones2=0;
		     var totalObservaciones3=0;
		     var totalObservaciones4=0;
		     var totalCerrado=0;
		     var totalAbierto=0;
			
		     unidadesAux.forEach(function(val){
			val.numObservaciones=0;
			val.numObservaciones1=0;
			val.numObservaciones2=0;
			val.numObservaciones3=0;
			val.numObservaciones4=0;
			val.numCompletada=0;
			val.numEnProceso=0;
				
			val.auditorias.forEach(function(val1){
			    val1.hallazgos.forEach(function(val2){
				
				 val.numCompletada+= val2.numAccionesCompletada;
				 val.numEnProceso+= val2.numAccionesEnProceso;
					
						
				 if(val2.nivel == null){val2.nivel = {id:0}};
				 
				 switch(val2.nivel.id){
				    case 1:
					   val.numObservaciones1++;
					   break;
				    case 2:
					   val.numObservaciones2++;
					   break;
				    case 3:
					   val.numObservaciones3++;
					   break;
				    case 4:
					   val.numObservaciones4++;
					   break;
				 }
			    });
			});
				
			totalInspecciones+=val.auditorias.length;
			totalObservaciones+=val.numObservaciones;
			totalObservaciones1+=val.numObservaciones1;
			totalObservaciones2+=val.numObservaciones2;
			totalObservaciones3+=val.numObservaciones3;
			totalObservaciones4+=val.numObservaciones4;
			totalAbierto+=val.numEnProceso;
			totalCerrado+=val.numCompletada;
			var textoEval=""+"<td>"+val.numObservaciones1+"</td>" + 
			       "<td>"+val.numObservaciones2+"</td>" + 
			       "<td>"+val.numObservaciones3+"</td>" + 
			       "<td>"+val.numObservaciones4+"</td>" ;
			if(nivelesAux.length == 3){
			    textoEval=""+"<td>"+val.numObservaciones1+"</td>" + 
			       "<td>"+val.numObservaciones2+"</td>" + 
			       "<td>"+val.numObservaciones3+"</td>" 
			}
			$("#tblResumInspecc tbody").append(
			  "<tr>" +
			       "<td>"+val.matrixName+"</td>" +
			       "<td>"+val.auditorias.length+"</td>" +
			       "<td>"+(val.numObservaciones1+val.numObservaciones2+val.numObservaciones3+val.numObservaciones4)+"</td>" + 
			       textoEval+
			       "<td>"+val.numCompletada+"</td>" +
			       "<td>"+val.numEnProceso+"</td>" +  
			 "</tr>");
			});
		     
			var estiloCelda="style='background-color: #f4d8a3;' ";
			var textoEval=""+"<td "+estiloCelda+">"+totalObservaciones+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones1+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones2+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones3+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones4+"</td>"  ;
			
			if(nivelesAux.length == 3){
			    textoEval=""+"<td "+estiloCelda+">"+totalObservaciones+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones1+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones2+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones3+"</td>"  
			}
			$("#tblResumInspecc tbody").append(
			  "<tr>" +
			       "<td "+estiloCelda+">"+"TOTAL"+"</td>" +
			       "<td "+estiloCelda+">"+totalInspecciones+"</td>" +
			       textoEval+
			       "<td "+estiloCelda+">"+totalCerrado+"</td>" + 
			       "<td "+estiloCelda+">"+totalAbierto+"</td>" + 
			  "</tr>");
		}else{
			alert("Error al realizar resumen")
		}
	    });
   }else{
         callAjaxPost(URL + '/auditoria/resumen/hallazgos/general/area', dataParamAudi,
            function(data){
	       if(data.CODE_RESPONSE == "05"){
		  $("#wrapResumInspeccArea").show();
		 $("#divGeneral h2").html("<a onclick='volverDivAuditoria()'> Auditorías </a> " +
					   "    " +
					   "> Resumen de inspecciones libres por áreas");
		 
		  $("#btnClipTablaResInspecc").hide();
		  $("#tblResumInspeccArea tbody tr").remove();
		  
	          var listHallazgosArea = data.areas;
		     var nivelesAux = data.niveles;
		     $("#thObservacionesResumenArea").attr("colspan",nivelesAux.length+1)
		     $("#trNivelesResumenArea").html("<th class='tb-acc' style='width:190px'>Total</th>");
		     nivelesAux.forEach(function(val){
			 $("#trNivelesResumenArea").append("<th class='tb-acc' style='width:190px'>"+val.nombre+"</th>") 
		     });
		     $("#trNivelesResumenArea").append("<th class='tb-acc' style='width:190px'>Cerrado</th>");
		     $("#trNivelesResumenArea").append("<th class='tb-acc' style='width:190px'>Abierto</th>");
	          var totalInspecciones=0;
	          var totalObservaciones=0;
	          var totalObservaciones1=0;
	          var totalObservaciones2=0;
	          var totalObservaciones3=0;
	          var totalObservaciones4=0;
	          var totalCerrado=0;
	          var totalAbierto=0;
				
	          listHallazgosArea.forEach(function(val){
		     		
		     totalInspecciones+=val.numInspecciones;
		     totalObservaciones+=val.numObservacionesExcesivamenteAltas + val.numObservacionesAltas +
		                         val.numObservacionesMedias + val.numObservacionesBajas;
		     totalObservaciones1+=val.numObservacionesExcesivamenteAltas;
		     totalObservaciones2+=val.numObservacionesAltas;
		     totalObservaciones3+=val.numObservacionesMedias;
		     totalObservaciones4+=val.numObservacionesBajas;
		     totalAbierto+=val.hallazgo.numAccionesEnProceso;
		     totalCerrado+=val.hallazgo.numAccionesCompletada;
		     var textoEval=""+"<td>"+val.numObservacionesExcesivamenteAltas+"</td>" + 
		       "<td>"+val.numObservacionesAltas+"</td>" + 
		       "<td>"+val.numObservacionesMedias+"</td>" + 
		       "<td>"+val.numObservacionesBajas+"</td>" ;
		if(nivelesAux.length == 3){
		    textoEval=""+"<td>"+val.numObservacionesAltas+"</td>" + 
		       "<td>"+val.numObservacionesMedias+"</td>" + 
		       "<td>"+val.numObservacionesBajas+"</td>"  
		}
		     $("#tblResumInspeccArea tbody").append(
		       "<tr>" +
			    "<td>"+val.unidad.matrixName+"</td>" +
			    "<td>"+val.areaName+"</td>" +
			    "<td>"+val.numInspecciones+"</td>" +
			    "<td>"+(val.numObservacionesExcesivamenteAltas + val.numObservacionesAltas +
		                    val.numObservacionesMedias + val.numObservacionesBajas)+"</td>" + 
		                    textoEval+
			    "<td>"+val.hallazgo.numAccionesEnProceso+"</td>" +
			    "<td>"+val.hallazgo.numAccionesCompletada+"</td>" +  
		      "</tr>");
		     });
			     
	             var estiloCelda="style='background-color: #f4d8a3;' ";

			var textoEval=""+"<td "+estiloCelda+">"+totalObservaciones+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones1+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones2+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones3+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones4+"</td>"  ;
			
			if(nivelesAux.length == 3){
			    textoEval=""+"<td "+estiloCelda+">"+totalObservaciones+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones1+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones2+"</td>" + 
			       "<td "+estiloCelda+">"+totalObservaciones3+"</td>"  
			}
	             $("#tblResumInspeccArea tbody").append(
	               "<tr>" +
			    "<td "+estiloCelda+">"+"TOTAL"+"</td>" +
			    "<td "+estiloCelda+">"+"..."+"</td>" +
			    "<td "+estiloCelda+">"+totalInspecciones+"</td>" +
		            textoEval+
			    "<td "+estiloCelda+">"+totalCerrado+"</td>" + 
			    "<td "+estiloCelda+">"+totalAbierto+"</td>" + 
		       "</tr>");
			  goheadfixedY("#tblResumInspeccArea","#wrapResumInspeccArea");
		}else{
		   alert("Error al realizar resumen")
		}
	    }); 
   }
}

var colorSi="green";
var colorNo="red";
var colorParc="yellow";
var colorRP="orange";

function colorPuntaje(puntaje){
	
   var color="black";
   if(puntaje<=0.66){
      color="orange"
   }
   if(puntaje<=0.34){
      color="red"
   }
   if(puntaje>0.66){
      color="green"
   }
   
   return color;
}

function procesarDataDescargadaPrimerEstado(data){
    switch(data.CODE_RESPONSE){
        case "05":
            var list = data.list;
            numRpta = data.listRpta;
            listAudiTipo = data.listAudiTipo;
            listTipoEvaluacionGeneral = data.tipo_evaluacion;
            listAudiFull = list;

	        $("#btnConfigurarImpact").show();
		
	        if(auditoriaClasif == 1){
	            $("#btnConsolidadoInspecc").show();
	        }else{
	            $("#btnConsolidadoInspeccHLCL").show();
	        }
		
	        $("#btnImportInspecc").show();$("#btnHerramientasInspecc").show();$("#btnGraficoAuditoria").show();
	        $("#btnConsolidadoAuditoria").show();
	
            $("#btnConsolidadoInspecc").on("click",function(){
                var tipo = 0;
			
                if(auditoriaClasif == 1){
	                tipo = 194;
                }else if(auditoriaClasif == 2){
                    tipo = 94;
                }
			
                consolExcelHallazgosLibres(getSession("gestopcompanyid"),0,tipo);
            });

	        $("#h2Titulo").html("<a onclick='javascript:cargarPrimerEstado();' href='#'>Auditoria</a>");
	 
	        $("#tblAudi tbody tr").remove();

	        list.forEach(function(val,index){
	            var rptaSi = val.rptaSi,rptaParc = val.rptaParcial,rptaNo = val.rptaNo,rptaRP = val.rptaRP,rptaFaltante = val.rptaRespondida;

                var conformidadAux =
                    "<span style='font-weight:bold;color:"+colorSi+"'>"+rptaSi+"</span>-" +
                    "<span style='font-weight:bold;color:"+colorRP+"'>"+rptaRP+"</span>-" +
                    "<span style='font-weight:bold;color:"+colorParc+"'>"+rptaParc+"</span>-" +
                    "<span style='font-weight:bold;color:"+colorNo+"'>"+rptaNo+"</span>-" +
                    "<span style='font-weight:bold;color:"+"black"+"'>"+rptaFaltante+"</span>";

                var pregLlenada = numRpta[index].pregAvance;var pregTotal = val.numPreguntas;

                nivelAvance2 = rptaFaltante+"/"+pregTotal;

                var puntaje = rptaSi*1 + rptaParc*0.5 + rptaRP*0.75 + rptaNo*0;
                var puntajeMax = rptaSi + rptaParc + rptaRP + rptaNo;
            
                indicador2 = pasarDecimalPorcentaje(puntaje/puntajeMax,2);
            
                var auditoriaTipoAux = listAudiFull[index].auditoriaTipo;
                var nombreEval = "----";
            
                if(val.evidenciaNombre == "---" || val.auditoriaFecha == null){ //Informe se ha planificado pero no se ha realizado
                    nombreEval = "Pendiente completar el evento";
                }else if(val.usuariosGerenciaId == null && val.usuarioGerencia.userSesionId == null &&
        	        val.userHistorial.userSesionId == null){ //Informe se ha realizado pero no se ha notificado a nadie
                    nombreEval = "Pendiente notificar a responsable";
                }else if(val.usuarioGerencia.userSesionId != null &&
        	        (val.evaluacionGerencia.id == null || val.evaluacionGerencia.id == 3)){
                    //else if(val.usuariosGerenciaCalificacion==0 || val.usuariosGerenciaCalificacion==0.5 || val.usuariosGerenciaCalificacion==0.6667) //Informe se ha realizado y se ha notificado a responsable
                    nombreEval = "<i style='font-size:19px;color: #df9226'class='fa fa-eye' aria-hidden='true'></i> " +
               		    "Abierto - pendiente de revisión del usuario: <br><strong>"+val.usuarioGerencia.userName+"</strong>";
                }else if(val.userHistorial.userSesionId != null){
                    nombreEval = "<i style='font-size:19px;color: #C0504D' class='fa fa-times' aria-hidden='true'></i> " +
			            "Observado por:<br> <strong>"+val.userHistorial.userName+"</strong> - " +
			            ((val.obsHistorial).length > 12?(val.obsHistorial).substring(0,11)+"...":val.obsHistorial);
                }else if(val.usuariosGerenciaCalificacion == 1){
                    nombreEval = val.evaluacionGerencia.icono+"Aprobado";
                }
            
                var indicadorHallazgo = "",colorTextHallazgo = "",contenidoTextHallazgos = "",indicadorAuditoria = "",
                    colorTextAuditoria = "",contenidoTextAuditorias = "",contenidoTextParticularAuditorias = "";
            
                if(auditoriaTipoAux == 94 || auditoriaTipoAux == 194 || auditoriaTipoAux == 100){
                    indicadorHallazgo = val.numAccionesCompletasHallazgoProyecto+"/"+val.numAccionesHallazgoProyecto;
        	
                    colorTextHallazgo = (val.numAccionesHallazgoProyecto == 0?"black":
        	            (val.numAccionesCompletasHallazgoProyecto == val.numAccionesHallazgoProyecto?"blue":"red"));
        	 
                    contenidoTextHallazgos = val.numHallazgos+" hallazgo(s) <br>["+(val.numAccionesHallazgoProyecto == 0?"Sin acciones de mejora":
            	        (val.numAccionesCompletasHallazgoProyecto == val.numAccionesHallazgoProyecto?"Acciones de mejora completadas ("+indicadorHallazgo+")":
                         "Acciones de mejora pendientes ("+indicadorHallazgo+")"))+"]";
                }else{
                    if(auditoriaTipoAux != 300 && auditoriaTipoAux != 303 && auditoriaTipoAux != 304){
        	            indicadorAuditoria = val.numAccionesCompletasAuditoriaProyecto+"/"+val.numAccionesAuditoriaProyecto;
           	
        	            colorTextAuditoria = (val.numAccionesAuditoriaProyecto == 0?"black":
            	            (val.numAccionesCompletasAuditoriaProyecto == val.numAccionesAuditoriaProyecto?"blue":"red"));
            	 
        	            contenidoTextAuditorias = pasarDecimalPorcentaje(val.puntajeClasico,2)+" ("+pasarDecimalPorcentaje(val.puntajePonderado,2)+") " +
        	                "<br>["+(val.numAccionesAuditoriaProyecto == 0?"Sin acciones de mejora":
                            (val.numAccionesCompletasAuditoriaProyecto == val.numAccionesAuditoriaProyecto?"Acciones de mejora completadas ("+indicadorAuditoria+")":
                             "Acciones de mejora pendientes ("+indicadorAuditoria+")"))+"]";
                    }else{
        	            contenidoTextParticularAuditorias = "* "+val.infoAdicionalEvaluaciones+(val.infoAdicionalObservaciones.length == 0?"":"<br>* "+val.infoAdicionalObservaciones);
                    }
                }
                
                var eviRepNombre = (val.estado.id == 2?"Reporte "+val.auditoriaTipoNombre:"<label>"+"*Automático (al completar el evento)."+"</label>");
		
                $("#tblAudi tbody").append(
                    "<tr id='tr"+val.auditoriaId+"' onclick='javascript:editarAudi(" +index+")'>" +
                        "<td id='tdnom"+val.auditoriaId+"'>"+val.auditoriaNombre+"</td>" +
                        "<td id='tdtipo"+val.auditoriaId+"'>"+val.auditoriaTipoNombre+ "</td>" +
                        "<td id='tdunidad"+val.auditoriaId+"' style='word-break:break-all;'>"+val.nombreUnidades+"</td>" +
                        "<td id='tdarea"+val.auditoriaId+"' style='word-break:break-all;'>"+val.nombreAreas+"</td>" +
                  "<td id='tdlugar"+val.auditoriaId+"'>"+val.lugar+"</td>" + 
                  "<td id='tdPreguntaInspec"+val.auditoriaId+"'>"+(val.respInspeccPlanificada == 1?"Sí":"No")+"</td>" + 
                  "<td id='tdfechaPlan"+val.auditoriaId+"'>"+val.fechaPlanificadaNombre+"</td>" + 
                  "<td id='tdhorapla"+val.auditoriaId+"'>"+val.horaPlanificadaTexto+"</td>" + 
                  "<td id='tdinversion"+val.auditoriaId+"'>S/ "+val.inversionAuditoria+"</td>" + 
                  "<td id='tdres"+ val.auditoriaId+"'>"+val.auditoriaResponsable+"</td>" + 
                  "<td id='tdcar"+ val.auditoriaId+"'>"+val.auditoriaCargo+"</td>" +
                  "<td id='tdfecha"+ val.auditoriaId+"'>"+val.auditoriaFechaTexto+"</td>" +
                  "<td id='tdaudiobs"+val.auditoriaId+"'>"+val.observacion+"</td>" +
                  "<td id='tdconf"+val.auditoriaId+"' style='color:" +
		      (auditoriaTipoAux == 94 || auditoriaTipoAux == 194 || auditoriaTipoAux == 100?colorTextHallazgo:
		       (auditoriaTipoAux == 300 || auditoriaTipoAux == 303 || auditoriaTipoAux == 304?"black":
			colorTextAuditoria))+";font-weight:bold'>" +
		      (auditoriaTipoAux == 94 || auditoriaTipoAux == 194 || auditoriaTipoAux == 100?contenidoTextHallazgos:
		       (auditoriaTipoAux == 300 || auditoriaTipoAux == 303 || auditoriaTipoAux == 304?
		        contenidoTextParticularAuditorias:contenidoTextAuditorias))+"</td>" +
		            "<td id='tdcomp"+val.auditoriaId+"'>"+([94,194,100,300,303,304].includes(auditoriaTipoAux)?"---":nivelAvance2)+"</td>" +
//                  "<td id='tdeviAudi"+val.auditoriaId+"'>" +
//                      (val.evidenciaNombre.length > 24?val.evidenciaNombre.substring(0,24)+"...":val.evidenciaNombre)+"</td>" +
		  "<td id='tdeviAudi"+val.auditoriaId+"'>"+eviRepNombre+"</td>" +
	          "<td id='estadoAudi"+val.auditoriaId+"'>"+ val.estadoImplementacionNombre+"</td>" +
		  "<td id='evalGeAudi"+val.auditoriaId+"' style='word-break:break-all;'>"+ nombreEval+"</td>" +
		  "<td id='numCasoAudi"+val.auditoriaId+"'>"+val.nroCaso+"</td>" +
		  "<td id='informEnviado"+val.auditoriaId+"'>" +
		      (val.fechaInforme == null?"Enviar informe":"Enviado<br>")+" "+val.fechaInformeTexto+"</td>" +
	          "<td id='tdacc"+val.auditoriaId+"'>" +
	              (auditoriaTipoAux == 94 || auditoriaTipoAux == 194?val.numAccionesCompletaHallazgo+" / "+val.numAccionesTotalHallazgo:
	               (auditoriaTipoAux == 100?val.numAccionesCompletaMonitoreo+" / "+val.numAccionesTotalMonitoreo:
	        	(auditoriaTipoAux == 300 || auditoriaTipoAux == 303 || auditoriaTipoAux == 304?"---":
	        	 val.accionesCompletas+" / "+val.accionesTotales)))+"</td>" +
	       "</tr>");
         });
		
	 formatoCeldaSombreableTabla(true,"tblAudi");
	 goheadfixed("#tblAudi","#wrapper2");

	 completarBarraCarga();
	
	 if(getSession("linkCalendarioAuditoriaId") != null){
	    list.every(function(val,index3){
	       if(val.auditoriaId == parseInt(getSession("linkCalendarioAuditoriaId"))){
		  editarAudi(index3);
		  sessionStorage.removeItem("linkCalendarioAuditoriaId");
		  return false;
	       }else{
		  return true;
	       }
	    });
	 }
	 break;
	
      default:
	 alert("Ocurrió un error al traer las auditorias!");
   }
}

function bloquearAOtraValidacion(index){
	
   var opc;
   var estado=false;

   if(index==1){
      opc=$("#selSiNoOtraValidacion").val(); 
      if(opc==0){
	 estado=true;
      }else if(opc==1){
	 estado=false;
      }
		
      $("#selUsuariosPorNotificar").prop("disabled",estado);
      
      if(listFullEvalGerenciaAudiA.length==3){
         alert("No se puede validar a mas usuarios por superar el limite(3)");
	 $("#selSiNoOtraValidacion").val(0);
         $("#selUsuariosPorNotificar").prop("disabled",true); 
      }
   }else if(index==2){
      opc=$("#selEvalGerenciaAuditoria").val(); 
      $("#selSiNoOtraValidacion").val(0);    
		
      if(opc==1){
         estado=false;  
         if($("#selSiNoOtraValidacion").val()==0){
	    $("#selUsuariosPorNotificar").prop("disabled",true); 
	 }else if($("#selSiNoOtraValidacion").val()==1){
	    $("#selUsuariosPorNotificar").prop("disabled",false); 
	 }
      }else{
	 estado=true;
	 if($("#selSiNoOtraValidacion").val()==0){
	    $("#selUsuariosPorNotificar").prop("disabled",true); 
	 }else if($("#selSiNoOtraValidacion").val()==1){
	    $("#selUsuariosPorNotificar").prop("disabled",false); 
	 }
      }
      $("#selSiNoOtraValidacion").prop("disabled",estado); 
   }  
}

function toggleVerEvaluacionesAGerencia(){
	$("#listaEvaluacionesGeren").toggle();
}

function validarAuditoriaGerencia(){
	
   callAjaxPost(URL + '/auditoria/evaluacion/gerencia', {auditoriaId :auditoriaId,
		                                         idCompany:getSession("gestopcompanyid")},
      function(data){ 
         listFullEvalGerenciaAudiA=data.evalgerencia;
	 listFullUsuGerenAPorNotificar=data.usuarios_geren_notificar;  
	
	 if(auditoriaObj.evidenciaNombre == "---" || auditoriaObj.auditoriaFecha == null){
	    //alert("Valido sólo para informes con evidencia y fecha completa") ;
	    mensajeUx="Válido sólo para informes con evidencia y fecha completa";
	    mensajesUx(mensajeUx,2,"");
	    return;
	 } 
			
	 var permisoEval=false;
	 
	 listFullEvalGerenciaAudiA.forEach(
            function(val,index){
	       if(val.user.userName==getSession("gestopusername")){
		  permisoEval=true;
		}
	    });
			
	 if(permisoEval){
	    mostrarEvaluacionAud();
	 }else{
	    notificarEvaluacionAud();
	 }
     });
}

function mostrarEvaluacionAud(){
	
   var listItemsFormGeren=[];
   var indexEvalEditar=null;
   var textInformEval=""; 

   listFullEvalGerenciaAudiA.forEach(
      function(val,index){
         if(val.user.userName!=getSession("gestopusername") && val.calificacion.id!=null){
	    listItemsFormGeren.push(
			 {sugerencia:" ",label:"Revisado por:",inputForm:val.user.userName,divContainer:"divContainAux"+val.id},
			 {sugerencia:" ",label:"Calificación:",inputForm: val.calificacion.icono+" <strong>"+val.calificacion.nombre+"</strong>", divContainer:"divContainAux"+val.id},
			 {sugerencia:" ",label:"Observación",inputForm:val.observacion,divContainer:"divContainAux"+val.id},
			 {sugerencia:" ",label:"Fecha de evaluación:",inputForm: val.fechaRegistroTexto,divContainer:"divContainAux"+val.id},
		         {sugerencia:"5",label:"",inputForm: "",divContainer:""}
			           );
	 }else if(val.user.userName==getSession("gestopusername")){
            indexEvalEditar=index;
	 }
   }); 
   
   listItemsFormGeren.forEach(
      function(val,index){
	 if(val.sugerencia!=5){
	    textInformEval+=obtenerSubPanelModuloAuditoria(val); 
	 }else if(val.sugerencia==5){
	    textInformEval+="<div class='row' style='border-top: 1px solid #2e9e8f;margin-top:20px;margin-left: 0px; margin-right: 0px;'></div><br>";
	 }
   });
	
   $("#modalAprobGerencia").modal("show");
	
   var textoForm="";
   var selEvalGerenciaAuditoria;
   var listItemsForm=[];
   var obs="";

   if(indexEvalEditar==null){
      selEvalGerenciaAuditoria=crearSelectOneMenuOblig("selEvalGerenciaAuditoria", "bloquearAOtraValidacion(2)", listTipoEvaluacionGeneral, 
				                       "3", "id","nombre"); 
      audiGerenEvalAId=0;
   }else{
      audiGerenEvalAId=listFullEvalGerenciaAudiA[indexEvalEditar].id;
      audiGerenEvalAObj=listFullEvalGerenciaAudiA[indexEvalEditar];
		
      selEvalGerenciaAuditoria=crearSelectOneMenuOblig("selEvalGerenciaAuditoria", "bloquearAOtraValidacion(2)", listTipoEvaluacionGeneral, 
				                       (audiGerenEvalAObj.calificacion.id==null?3:audiGerenEvalAObj.calificacion.id), "id","nombre");  
      obs=audiGerenEvalAObj.observacion 
   } 
	
   var selUsuariosNotificar=crearSelectOneMenuOblig("selUsuariosPorNotificar", "", listFullUsuGerenAPorNotificar, 
			                            "", "userId","userName");
   var selOtraValidacion=crearSelectOneMenuOblig("selSiNoOtraValidacion", "bloquearAOtraValidacion(1)", listValSino, 
			                         "", "id","nombre");
   var listItemsForm=[
		{sugerencia:" ",label:"Revisado por:",inputForm:getSession("gestopusername"),divContainer:"divContainAux"}, 
		{sugerencia:" ",label:"Calificación:",inputForm: selEvalGerenciaAuditoria,divContainer:"divContainAux"},
		{sugerencia:" ",label:"Observación",inputForm:"<input class='form-control' id='inputObservacionEvalAux' value='"+obs+"'>"},
		{sugerencia:" ",label:"Fecha de evaluación:",inputForm:obtenerFechaActual()+" "+obtenerHoraActual()+ "",divContainer:"divContainAux"},
		{sugerencia:" ",label:"¿Requeriere otra validación?:",inputForm:selOtraValidacion,divContainer:"divContainAux"},
		{sugerencia:" ",label:"Responsable de la Revisión",inputForm:(listFullUsuGerenAPorNotificar==0?"Sin Usuarios por Notificar":selUsuariosNotificar),divContainer:"divContainAux"},
		{sugerencia:" ",label:" ",inputForm:"<button id='btnGuardarEvalAudi' type='submit' class='btn btn-success' >" +
						       "<i aria-hidden='true' class='fa fa-envelope-o'></i> Guardar y Enviar" +
						    "</button>"+
						    "<button style='margin-left:50px' type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>"} 
	];
   
	listItemsForm.forEach(function(val,index){
		textoForm+=obtenerSubPanelModuloAuditoria(val);
	});
	
	$("#modalAprobGerencia .modal-body").html(
	  "<form class='eventoGeneral' id='formAudiEval"+auditoriaObj.auditoriaId+"' >"
	     +textoForm+
	     "<div id='limiteLista' style='border-bottom:1px solid #2e9e8f;height: 30px;' >" +
	        "<a class='efectoLink' onclick='toggleVerEvaluacionesAGerencia()'> Ver Validaciones anteriores<i class='fa fa-angle-double-down'></i></a>" +
	     "</div>"+
	     "<div id='listaEvaluacionesGeren' style='display:none'><br>" +
	         (textInformEval==""?"Sin Registros":textInformEval)+ 
	     "</div>"+
	  "</form>");
        
	if(audiGerenEvalAObj.calificacion.id==1){
	   $("#btnGuardarEvalAudi").hide();
	   $("#selEvalGerenciaAuditoria").prop("disabled",true); 
	   $("#inputObservacionEvalAux").prop("disabled",true);  
	}else{
	   $("#btnGuardarEvalAudi").show();
	   $("#selEvalGerenciaAuditoria").prop("disabled",false); 
	   $("#inputObservacionEvalAux").prop("disabled",false);  
	}
	
	$("#selUsuariosPorNotificar").prop("disabled",true); 
	$("#selSiNoOtraValidacion").prop("disabled",true); 
	$("#formAudiEval"+auditoriaObj.auditoriaId).on("submit",function(e){
        e.preventDefault();
        var opc=$("#selSiNoOtraValidacion").val(); 
        
        if(audiGerenEvalAObj.calificacion.id==1){
           alert("Lo sentimos, esta evaluacion ya esta cerrada y aprobada");
	   return;
	}
        
        if(audiGerenEvalAId!=0){
    	   var dataParam={
        	   id : audiGerenEvalAId, 
        	   auditoria:{auditoriaId : auditoriaId},
        	   user:{userSesionId:null},
        	   calificacion:{id:$("#selEvalGerenciaAuditoria").val()},
        	   observacion:$("#inputObservacionEvalAux").val()
	                  }//almacenando la evaluacion
	       	
    	callAjaxPost(URL + '/auditoria/save/gerencia/evaluacion', dataParam,
	   function(data){
	      if(data.CODE_RESPONSE=="05"){
	         $("#modalAprobGerencia").modal("hide");
		 
	         alert("Se guardó la evaluación de gerencia del registro, se informó al responsable de registro y al contratista!");
						
		 var datapar={
			 auditoriaId:auditoriaId,
			 nroCasoInt:auditoriaObj.nroCasoInt,
			 usuarioGerencia:{userSesionId:null},
			 evaluacionGerencia:{
					 id:$("#selEvalGerenciaAuditoria").val(),
					 observacion:$("#inputObservacionEvalAux").val()
					     }
			      }// se actualiza la auditoria en los campos de evaluacionGerencia 
		
		 callAjaxPost(URL + '/auditoria/gerencia/update/evaluacion', datapar,
		    function(data){
		       if(data.CODE_RESPONSE=="05"){
			  console.log("Se actualizo la evaluacion en la auditoria 1");
		       }else{
			  alert("error");
		       }
		    });
						
		 if($("#selEvalGerenciaAuditoria").val()==2 )//&& listFullEvalGerenciaAudiA.length>=2)si es observado se notifica a todos los anteriores usuarios
	         {if(auditoriaObj.trabajador.trabajadorId==null){
		     alert("Se necesita asignar responsable !");
		     return;
		  }
							
	          var listFullUserNotificar=[];
	          
	          listFullEvalGerenciaAudiA.forEach(
	             function(val,index){ 
		        if(val.user.userName!=getSession("gestopusername")){ 
			   listFullUserNotificar.push({userSesionId:parseInt(val.user.userSesionId)});
		        }
	             }); 
				        	
	          var data={
		        auditoriaId:auditoriaId, 
			usuariosObsNot:listFullUserNotificar,
			trabajador:{trabajadorId:auditoriaObj.trabajador.trabajadorId}
			   }
		  
	          callAjaxPost(URL + '/auditoria/notificar/gerencia/validacion/obs', data,
		     function(data){
		        if(data.CODE_RESPONSE=="05"){
		           $("#modalAprobGerencia").modal("hide");
			   console.log("Se notificó a los usuarios de gerencia y responsable");
		        }
		     });
		  }
						
		 if(opc==1 && $("#selUsuariosPorNotificar").val()!=null && listFullEvalGerenciaAudiA.length<3){
		    if($("#selEvalGerenciaAuditoria").val()!=1){//enviar correo para el otro usuario
		       alert("Lo sentimos, el evento no esta aprobado por lo que no puede solicitar otra validdacion de usuario");
		       return;
		    }
							
		    var data={
		          auditoriaId:auditoriaId, 
			  usuarioGerencia:{userId:$("#selUsuariosPorNotificar").val()} 
			     }// solicitando otra validacion
			    		
		    callAjaxPost(URL + '/auditoria/notificar/gerencia/validacion',data,
		       function(data){
		          $("#modalAprobGerencia").modal("hide");
			  alert("Se notificó al usuario de gerencia");
			//alert("Nota: Le recordamos que tiene un número limitado de validaciones(3)\nValidaciones restantes: "+(3-(listFullEvalGerenciaAudiA.length+1)));
		       });
							
		       //------------------------------------------------------------------
		     var estadoNotificar=false;
				    	        
		     listFullEvalGerenciaAudiA.forEach(
	                function(val,index){
			   if(val.user.userSesionId==$("#selUsuariosPorNotificar").val()){
		              estadoNotificar=true;
			   }
		        });
				    	        
		        if(estadoNotificar!=true){ 
		           var dataParam1={
				   id:0,
				   auditoria:{auditoriaId:auditoriaId},
				   user:{userSesionId:$("#selUsuariosPorNotificar").val()},
				   calificacion:{id:null},
				   observacion:null
					   };
								       	
		           callAjaxPost(URL + '/auditoria/save/gerencia/evaluacion', dataParam1,
			      function(data){ 
			         console.log("El usuario se a notificado por primera vez para su revisión");
				 if(data.CODE_RESPONSE=="05"){
				    var datapar={
					   auditoriaId:auditoriaId,
					   nroCasoInt:auditoriaObj.nroCasoInt,
					   usuarioGerencia:{userSesionId:$("#selUsuariosPorNotificar").val()},
					   evaluacionGerencia:{
							   id:null,
							   observacion:null
							      }
						}
													
				    callAjaxPost(URL + '/auditoria/gerencia/update/evaluacion', datapar,
				       function(data){
				          if(data.CODE_RESPONSE=="05"){
					     console.log("Se actualizo la evaluacion en la auditoria 2");
					  }else{
					     alert("error");
					  }
				       }); 
				}
			      });
		          } 
		    }else if(listFullEvalGerenciaAudiA.length==3 && opc!=0){
		       alert("Lo sentimos,no puede notificar mas validaciones por haber superado el limite (3) ");
		       return;
		    }
	      }else{
	         alert("error al gaurdar");
	      }
    	   });
        }else{
	   alert("Lo sentimos, usted no puede enviar su validacion");
	   return;
	}
 });
}

function notificarEvaluacionAud(){
	
   if(listFullUsuGerenAPorNotificar.length == 0){
      alert("No hay usuarios de gerencia por Notificar");return;
   }
   
   $("#modalAprobGerencia").modal("show");
	
   var textoForm="";
   var selUsuariosNotificar=crearSelectOneMenuOblig("selUsuariosNotificar", "", listFullUsuGerenAPorNotificar, 
			                            "", "userId","userName");
   var listItemsForm=[
   		{sugerencia:" ",label:"Notificar a:",inputForm: selUsuariosNotificar,divContainer:""}, 
   		{sugerencia:" ",label:"Fecha:",inputForm:obtenerFechaActual()+" "+obtenerHoraActual()+ "",divContainer:"divContainAux"},
   		{sugerencia:" ",label:" ",
   			inputForm:"<button type='submit' class='btn btn-success' >" +
   					"<i aria-hidden='true' class='fa fa-envelope-o'></i>Notificar</button>"} 
   		     ];
   
   listItemsForm.forEach(
      function(val,index){
         textoForm+=obtenerSubPanelModuloAuditoria(val);
      });
   		
   $("#modalAprobGerencia .modal-body").html("<form class='eventoGeneral' id='formAudiEval"+auditoriaObj.auditoriaId+"' >"
   				                 +textoForm+"</form>");
   $("#formAudiEval"+auditoriaObj.auditoriaId).on("submit",function(e){ 
   e.preventDefault();
	        
   if(listFullEvalGerenciaAudiA.length==3){
      alert("Lo sentimos,no puede notificar mas validaciones por haber superado el limite (3) ");
      return;
   } 
	        
   var data={auditoriaId : auditoriaId , 
	     usuarioGerencia: {userId:$("#selUsuariosNotificar").val()} } // se enviar por correo al usuario seleccionado 
	       
   callAjaxPost(URL + '/auditoria/notificar/gerencia/validacion', data,
      function(data){
	 $("#modalAprobGerencia").modal("hide");
	 alert("Se notificó al usuario de gerencia");
      });
	        
      //--------------------------------------------------------------------
	        
      var estadoNotificar=false;
	        
      listFullEvalGerenciaAudiA.forEach(
         function(val,index){
            if(val.user.userSesionId==$("#selUsuariosNotificar").val()){
	       estadoNotificar=true;
	    }
         });
   
      if(estadoNotificar!=true){ 
         var dataParam1={
	         id : 0,
	         auditoria:{auditoriaId : auditoriaId},
	         user:{userSesionId:$("#selUsuariosNotificar").val()},
	         calificacion:{id:null},
	         observacion:null
		         };// se almacena un registro en pendiente de eval para el usuario gerencia 
		       	
         callAjaxPost(URL + '/auditoria/save/gerencia/evaluacion', dataParam1,
            function(data){ 
	     //alert("El usuario se a notificado por primera vez para su revisión");
	       var datapar={
		      auditoriaId:auditoriaId,
		      nroCasoInt:null,
		      evaluacionGerencia:{
		   		      id:null,
			     observacion:null
				          }
			   }// se actualiza la auditoria en los campos de evaluacionGerencia 
						
	       callAjaxPost(URL + '/auditoria/gerencia/update/evaluacion', datapar,
	          function(data){	    				
		     if(data.CODE_RESPONSE=="05"){
		        console.log("Se actualizo la evaluacion en la auditoria");
		        cancelarAuditoria();
		     }else{
		        alert("error");
		     }
	          });
	     });
      } 
   }); 
}

function verDatosInformeAuditoria(){
   /*if(auditoriaObj.evaluacionGerencia.id != 1 ){
        alert("Función no disponible para informes no aprobados")
	return;	
     }*/    

   if(auditoriaObj.usuariosGerenciaCalificacion!=1){
       //alert("Función no disponible para informes no aprobados")
       mensajeUx="Función no disponible para informes no aprobados";
       mensajesUx(mensajeUx,2,"");
       return;	
   }
	
   if(auditoriaObj.evidenciaNombre == "---" || auditoriaObj.auditoriaFecha == null){
       //alert("Valido sólo para informes con evidencia y fecha completa") ;
       mensajeUx="Válido sólo para informes con evidencia y fecha completa";
       mensajesUx(mensajeUx,2,"");
       return;
   }
	
   $("#mdInformeAuditoria").modal("show");
   $("#mdInformeAuditoria .modal-title").html("Detalle del informe enviado - "+auditoriaObj.auditoriaNombre);
	
   var textoForm="";
	
   if(auditoriaObj.fechaInforme==null){
      callAjaxPost(URL + '/auditoria/informe/datos', {auditoriaId:auditoriaObj.auditoriaId},
         function(data){
            var textoEnviar="Secciones: ";
			
            data.secciones.forEach(
               function(val){
		  val.trabajadores.forEach(
		     function(val1){
		        if(auditoriaObj.auditoriaTipo == 94 || auditoriaObj.auditoriaTipo == 194
				|| auditoriaObj.auditoriaTipo == 100){
		           val1.listaFinal=val1.hallazgos
			}else{
			   val1.listaFinal=val1.detallesAuditoria
			}
					
		        textoEnviar+=val1.nombre+"< "+val1.correo+" > ("+val1.listaFinal.length+" hallazgos) ; "
		     });
		});
			
            textoEnviar+=" // Areas: ";
			
            data.areas.forEach(
               function(val){
	          val.listTrabajadorArea.forEach(
	             function(val1){
		        if(auditoriaObj.auditoriaTipo == 94 || auditoriaObj.auditoriaTipo == 194
				|| auditoriaObj.auditoriaTipo == 100){
			   val1.listaFinal=val1.hallazgos
			}else{
			   val1.listaFinal=val1.detallesAuditoria
			}
					
		        textoEnviar+=val1.nombre+"< "+val1.correo+" > ("+val1.listaFinal.length+" hallazgos) ; "
		    });
	       });
			
             var listItemsForm=[
			  {sugerencia:" ",label:"Enviar a",inputForm: "",divContainer:"divContainAuxEnviar"}, 
			  {sugerencia:" ",label:" ",inputForm:"<button id='formAudi1Informe"+auditoriaObj.auditoriaId+"' class='btn btn-success' >" +
					                         "<i aria-hidden='true' class='fa fa-download'></i>Descargar informe" +
					                     " </button>" +
					                     "<br></br>" +
					                     "<a id='formAudi2Informe"+auditoriaObj.auditoriaId+"' class='efectoLink'>" +
					                        "<i class='fa fa-envelope-o'></i> Enviar informe" +
					                     "</a>"} 
			       ];
			
             listItemsForm.forEach(
                function(val,index){
	           textoForm+=obtenerSubPanelModuloAuditoria(val);
		});
			
             $("#mdInformeAuditoria .modal-body").html("<form class='eventoGeneral' id='formAudiInforme"+auditoriaObj.auditoriaId+"' >"
							   +textoForm+"</form>");
			
             var asd=document.createTextNode(textoEnviar);
			
             document.getElementById ("divContainAuxEnviar").appendChild (asd)
			
             $("#formAudi1Informe"+auditoriaObj.auditoriaId).on("click",
        	   function(e){
		      e.preventDefault(); 	
		      descargarInformeCompleto()
		   });

             $("#formAudi2Informe"+auditoriaObj.auditoriaId).on("click",
        	   function(e){
        	      e.preventDefault(); 	
        	      enviarInformePartido()
                   });
      })
   }else{
		 
      var listItemsForm=[
	      {sugerencia:"",label:"Enviado el",inputForm:auditoriaObj.fechaInformeTexto},
	      {sugerencia:" ",label:"Enviado por",inputForm:auditoriaObj.usuarioInformeNombre}, 
	      {sugerencia:" ",label:"Enviado a",inputForm: "", divContainer:"divContainAuxEnviar"}, 
	      {sugerencia:" ",label:" ",inputForm:"<button id='formAudi1Informe"+auditoriaObj.auditoriaId+"' class='btn btn-success' >" +
						     "<i aria-hidden='true' class='fa fa-download'></i>Descargar informe enviado" +
						  "</button>" +
						  "<br></br>" +
						  "<a id='formAudi2Informe"+auditoriaObj.auditoriaId+"' class='efectoLink'>" +
						     "<i class='fa fa-envelope-o'></i> Enviar nuevamente informe" +
						  "</a>"} 
			];

      listItemsForm.forEach(
         function(val,index){
	    textoForm+=obtenerSubPanelModuloAuditoria(val);
	 });
		
      $("#mdInformeAuditoria .modal-body").html("<form class='eventoGeneral' >"
						    +textoForm+"</form>");
		
      $("#formAudi1Informe"+auditoriaObj.auditoriaId).on("click",
	    function(e){
	       e.preventDefault(); 	
	       descargarInformeCompleto()
	    });

      $("#formAudi2Informe"+auditoriaObj.auditoriaId).on("click",
            function(e){
	       e.preventDefault(); 	
	       enviarInformePartido()
	    });
		
      var asd=document.createTextNode(auditoriaObj.descripcionInforme);
      document.getElementById ("divContainAuxEnviar").appendChild (asd)
   }
}

function descargarInformeCompleto(){
	
   if(auditoriaTipo == 94 || auditoriaTipo == 194){
      window.open(URL+ "/auditoria/reporte/inspeccion/simple/excel?id="
		     + auditoriaId +"&tipoAuditoriaId="+auditoriaTipo);
   }else if(auditoriaTipo == 100){
      window.open(URL+ "/auditoria/reporte/monitoreo/simple/excel?id="
		     + auditoriaId +"&tipoAuditoriaId="+auditoriaTipo);
   }else{
      window.open(URL+ "/auditoria/detalle/excel?id="
	      	     + auditoriaId +"&tipoId="+auditoriaTipo+"&audiNombre="+nombreAudi);
   }
}

function enviarInformePartido(){
	 
   callAjaxPost(URL + '/auditoria/informe/enviar', 
 	       {auditoriaId:auditoriaObj.auditoriaId, 
 		fechaInforme: new Date()}, 
 		function(data) {
 		   $("#mdInformeAuditoria").modal("hide")
 		   alert("Se enviaron con éxito!");
 		   cargarPrimerEstado();
 	        })
}

function obtenerSubPanelModuloAuditoria(val){

   var estiloDefault="";
	
   if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
      estiloDefault="    border-top: 1px solid #a5aaae;"
   }
	
   return "<div class='form-group row' style='"+estiloDefault+"'>"+
	    " <label for='colFormLabel' class='col-sm-4 col-form-label'>"+val.label+"</label>"+
	     "<div class='col-sm-8' id='"+val.divContainer+"'>"+
	     " "+val.inputForm+
	     "<small>"+val.sugerencia+" </small>"+
	     "</div>"+
	  "</div>";
}

var listFullAccionesAuditoria=[];

function editarAudi(pindex){ 	
   if(!banderaEdicion){
      auditoriaObj = listAudiFull[pindex];
      auditoriaId = listAudiFull[pindex].auditoriaId;
      auditoriaTipo = listAudiFull[pindex].auditoriaTipo;
      auditoriaFecha = listAudiFull[pindex].auditoriaFecha;
      numAreas = listAudiFull[pindex].numAreas;
      listAreasSelecccionados = [], listAreas=[];
      
      $("#tr"+auditoriaId).addClass("fila-edicion");
			
      var rptaSi = numRpta[pindex].rptaSi;
      var rptaParc = numRpta[pindex].rptaParcial;
      var rptaNo = numRpta[pindex].rptaNo;
      var rptaRP = numRpta[pindex].rptaRP;
      var rptaFaltante = numRpta[pindex].rptaRespondida;
      var pregLlenada = numRpta[pindex].pregAvance;
      var pregTotal = listAudiFull[pindex].numPreguntas;

      nivelAvance2 = pregLlenada+"/"+pregTotal;

      var puntaje = rptaSi*1+rptaParc*0.5+rptaRP*0.75+rptaNo*0;
      var puntajeMax = rptaSi+rptaParc+rptaRP+rptaNo;
      
      indicador2 = pasarDecimalPorcentaje(puntaje/puntajeMax,2);
      formatoCeldaSombreableTabla(false,"tblAudi");
		
      var name = $("#tdnom" + auditoriaId).text();
      var nameTipoAudi = listAudiFull[pindex].auditoriaTipoNombre;
      var nombreEvidencia = listAudiFull[pindex].evidenciaNombre;
		
      nombreAudi = name;
      nombreTipoAudi = nameTipoAudi;

//        var options={
//	        container:"#tdeviAudi"+auditoriaId,functionCall:function(){
//                validacionSubirEvidencia("Auditoria",bitsEvidenciaDiagnostico,"");
//            },descargaUrl:"/auditoria/evidencia?auditoriaId="+auditoriaId,
//        //  },descargaUrl:"/auditoria/amazon_s3/evidencia?id="+auditoriaId,
//            esNuevo:(nombreEvidencia == 0?true:false),idAux:"Auditoria",evidenciaNombre:nombreEvidencia
//        };
//		
//        crearFormEvidenciaCompleta(options);
        
      	var enlaceExcel = (auditoriaObj.estado.id == 2?
      	    "<a class='efectoLink' onclick='descargarReporteFinalExcelInspeccion()'>" +
		"<i class='fa fa-download' aria-hidden='true'></i> "+"Reporte "+auditoriaObj.auditoriaTipoNombre +
      	    "</a>":"<label>*Automático (al completar el evento).</label>");
      
      
        $("#tdeviAudi"+auditoriaId).html(enlaceExcel);

      $("#evalGeAudi"+auditoriaId).html(
         "<a class='efectoLink' onclick='validarAuditoriaGerencia()' title='Enlace Aprobado - Al dar click, " +
            "brinda el acceso a una ventana emergente para enviar la respectiva notificación a la gerencia " +
            "(para su validación).'>" +
             $("#evalGeAudi"+auditoriaId).text()+
         "</a>");
		
      $("#informEnviado"+auditoriaId).html(
         "<a class='efectoLink' onclick='verDatosInformeAuditoria()'>" +
            "<i class='fa fa-envelope-o'></i> " +
             (auditoriaObj.fechaInforme == null?"Enviar informe":"Enviado<br>")+" " + 
             auditoriaObj.fechaInformeTexto +
	 "</a>");
      
      $("#tdhorapla"+auditoriaId).html(
         "<input type='time' id='inputHora' class='form-control'  value='"+auditoriaObj.horaPlanificada+"'>");
		
      if(parseInt(auditoriaTipo) != 100){
	 $("#btnGenReporte").show();
      }
		
      if(parseInt(auditoriaTipo) != 100 && parseInt(auditoriaTipo) != 194 && parseInt(auditoriaTipo) != 94){
	 $("#btnGenReporteExcel").show();
      }
		
      $("#tdinversion"+auditoriaId).html(
         "<input type='number' id='inputInversion' class='form-control' value='"+auditoriaObj.inversionAuditoria+"'>");
		
      $("#tdnom"+auditoriaId).html(
         "<input type='text' id='inputNom' class='form-control' placeholder='Nombre'>");
      
      $("#inputNom").val(auditoriaObj.auditoriaNombre);		
      //
      $("#tdaudiobs"+auditoriaId).html("<textarea rows='3' id='inputObsAudi' class='form-control'></textarea>");
      $("#inputObsAudi").val(auditoriaObj.observacion);

      setTextareaHeight($('#inputObsAudi'));
      //
      var name1 = $("#tdres"+auditoriaId).html();
      $("#tdres"+auditoriaId).html("<input type='text' id='inputResp' class='form-control' placeholder='Responsable'>"+
				   "<div id='divAutoCompletarTrabAudi'></div>");
      //
      $("#inputResp").val(name1);
      verAutoCompletarTrabAuditoria()
      $("#selAutoTrabajador").val(auditoriaObj.trabajador.trabajadorId);
      // 
      var name2 = $("#tdcar" + auditoriaId).text();
      $("#tdcar" + auditoriaId).html(
         "<input type='text' id='inputCar' class='form-control' placeholder='Cargo' value='"+name2+"'>");
		
      $("#tdarea"+auditoriaId).html("<a href='#' onclick='javascript:seleccionarArea();'>N° de áreas: "+auditoriaObj.numAreas+"</a>");
     
      $("#tdlugar"+auditoriaId).html(
         "<input type='text' id='inputLugar' class='form-control' placeholder='Lugar' value='"+auditoriaObj.lugar+"'>");
      
      /*************************************************************************** */
		
      $("#tdfecha"+auditoriaId).html(
         "<input type='date' id='inputFecha' onchange='hallarEstadoImplementacion("+auditoriaId+")' class='form-control'>");
		
      $("#tdfechaPlan"+auditoriaId).html(
         "<input type='date' id='inputFechaPlan' onchange='hallarEstadoImplementacion("+auditoriaId+")' class='form-control'>");
	
      $("#inputFecha").val(convertirFechaInput(auditoriaFecha));
      $("#inputFechaPlan").val(convertirFechaInput(auditoriaObj.fechaPlanificada));
      
      var selectRespPlanificado = crearSelectOneMenuOblig("selRespPlanificado","",
         listBoolean,auditoriaObj.respInspeccPlanificada,"id","nombre");
      
      $("#tdPreguntaInspec"+auditoriaId).html(selectRespPlanificado);
      
      hallarEstadoImplementacion(auditoriaId);
		
      cargarModalArea();
      
      banderaEdicion = true;
      
      habilitarBotonesEdicion();
      
      $("#btnResHallAudit").hide();$("#btnHistorialRegistroAudi").hide();$("#btnResListaAudit").hide();
      $("#btnConfigurarImpact").hide();$("#btnListarVerificaciones").show();
			
      if(auditoriaClasif == 1){
         $("#btnConsolidadoInspecc").hide();
      }else{
         $("#btnConsolidadoInspeccHLCL").hide();
      }
		
      $("#btnNuevoInsp").hide();$("#btnNuevoAudi").hide();$("#btnImportInspecc").hide();
      $("#btnHerramientasInspecc").hide();$("#btnGraficoAuditoria").hide();$("#btnHistorialRegistroAudi").show();
      $("#filtroAplicarBuscador").hide();$("#btnClipTabla").hide();$("#btnResetBuscadorAuditoria").hide();
      $("#btnAplicarBuscadorAuditoria").hide();$("#valBuscarValorAuditoria").hide();$("#btnConsolidadoAuditoria").hide();
      
      cambiarAcordeTipoAuditoria(auditoriaTipo);
      
      if(auditoriaObj.evaluacionGerencia.id == 1){
         $("#btnGuardar").hide();
         $("#btnEliminar").hide();
      }
		
      if(parseInt(auditoriaTipo) != 300 && parseInt(auditoriaTipo) != 303 && parseInt(auditoriaTipo) != 304){
         var accionesComple = $("#tdacc"+auditoriaId).html();
      
         $("#tdacc"+auditoriaId).html(
            "<a class='efectoLink' title='Enlace Acciones de mejora completadas/total - " +
      	       "Al dar click, brinda el acceso a la tabla Solicitud de acción de mejora " +
      	       "asociadas (en una ventana emergente).' " +
      	       "onclick='verAccionesAsociadasAuditoria()'>" +
      	       "<i class='fa fa-star'></i>"+accionesComple + 
            "</a>");
      }
   }	
}

function verAccionesAsociadasAuditoria(){
    
   /*var valorResize= 160;
     resizeDivWrapper("wrapperAccionesAudiAux",valorResize);
   */
   var dataParam2={
	   auditoriaId:auditoriaId
                  }
   
   callAjaxPost(URL + '/auditoria/acciones', dataParam2,
		function(data){
	           if(data.CODE_RESPONSE="05"){
	                 $("#modalAccionesAuditoria").modal("show");
		         volverAccionesAuditoria();
		         $("#btnClipTablaAcciones").remove();
		         $("#modalAccionesAuditoria #divTotalAcciones").prepend(
			   "<button id='btnClipTablaAcciones' type='button' class='btn btn-success clipGosst' title='Copiar los elementos de la tabla - Permite copiar las filas" +
			   " de la tabla Solicitud de acción de mejora asociadas para pegarlos en otro archivo (por ejemplo, en un excel).' >" +
			   "<i class='fa fa-clipboard fa-2x'></i>" + "</button>");
		         
		         $("#btnClipTablaAcciones").on("click",function(){
			       copiarAlPortapapeles(obtenerDatosTablaEstandarNoFija("tblAccionesAudi") ,"btnClipTablaAcciones");
			       //alert("Se han guardado al clipboard las acciones asociadas");
			       $("#modalAccionesAuditoria").modal("hide");
			       activarModalAccionesAuditoria = 1;
			       mensajeUx="Se han copiado todas las filas de la tabla Solicitud de acción de mejora asociadas.";
			       mensajesUx(mensajeUx,1,"ocultarMensajesUxInspecciones()");
			       
		         });
		         
		         var list=data.list;
		         list.forEach(function(val){
		            val.btnEvidenciaHallazgo = "Sin asignar";
		            if(val.hallazgo.evidenciaNombre != null){
			          val.btnEvidenciaHallazgo = "<a class='efectoLink' target='_blank' " +
				  "href='"+URL+"/auditoria/amazon_s3/detalle/evidencia?detalleAuditoriaId="+val.hallazgo.id+"'>" +
				  "<i class='fa fa-download'></i>Descargar</a>";
		            }
		         });
		         
		         var list2=data.list2;
		         list2.forEach(function(val){
		            val.btnEvidenciaHallazgo = "Sin asignar";
		            if(val.hallazgo.evidenciaNombre != null){
			          val.btnEvidenciaHallazgo = "<a class='efectoLink' target='_blank' " +
				  "href='"+URL+"/auditoria/hallazgo/evidencia?hallazgoId="+val.hallazgo.id+"'>" +
				  "<i class='fa fa-download'></i>Descargar</a>";
		            }
		         });
		         
		         var list3=data.list3;
		         list3.forEach(function(val){
		            val.btnEvidenciaHallazgo = "Sin asignar";
		            if(val.hallazgo.evidenciaNombre != null){
			          val.btnEvidenciaHallazgo = "<a class='efectoLink' target='_blank' " +
			          "href='"+URL+"/auditoria/hallazgo/evidencia?hallazgoId="+val.hallazgo.id+"'>" +
			          "<i class='fa fa-download'></i>Descargar</a>";
		            }
		         });
		         
		         list=list.concat(list2);
		         list=list.concat(list3);
		         listFullAccionesAuditoria=list;
		         
		         $("#tblAccionesAudi tbody tr").remove();
		         
		         list.forEach(function(value,index){
		            var textObservacion = "";
		            if(value.hallazgo.observacion != ""){
			          textObservacion = "<label style='color : red'>("+value.hallazgo.observacion+")</label>"
		            }
		            
		            var btnEvidencia = "Sin asignar";
		            if(value.evidenciaNombre != null){
			          btnEvidencia = "<a class='efectoLink' target='_blank' " +
			          "href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+value.accionMejoraId+"'>" +
			          "<i class='fa fa-download'></i>Descargar</a>";
		            }
		            
		            var btnAsociado="<br><button class='btn btn-success' onclick='verOrigenSolicitudAccion("+index+")'><i class='fa fa-eye'></i>Ver</button>"
		            $("#tblAccionesAudi tbody").append(
				  "<tr>" +
				       "<td>"+value.hallazgo.descripcion+textObservacion+"</td>" +
				       "<td>"+value.btnEvidenciaHallazgo+"</td>" +
				       "<td>"+value.solicitud.resumen+"</td>" +
				       //"<td>"+value.solicitud.numActAsociadas+btnAsociado+"</td>" +
				       "<td>"+value.descripcion+"</td>" +
				       "<td>"+value.tipoAccionNombre+"</td>" +
				       "<td>"+value.clasificacion.nombre+"</td>" +
				       "<td>"+value.responsableNombre+"</td>" +
				       "<td>"+value.fechaRevisionTexto+"</td>" +
				       "<td>"+value.fechaRealTexto+"</td>" +
				       //"<td>"+value.inversionAccion+"</td>" +
				       "<td style='font-weight:800;color:"+value.estadoColor+"'>"+value.estadoCumplimientoNombre+"</td>" + 
				       "<td>"+btnEvidencia+"</td>" +
				       "</tr>"
		            )
		         });
	           }else{
		       console.log("NOP")
	           }
	        // goheadfixedY("#tblAccionesAudi","#wrapperAccionesAudiAux");
   	      });
}

function verAutoCompletarTrabAuditoria(){
   var nombre = $("#inputResp").val().trim();
	
   if(nombre == ""){
      nombre = null
   };
    
   var dataParam={
	   trabajadorNombre : "%"+nombre+"%",
	   empresaId : getSession("gestopcompanyid")}
	
   callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,
      function(data){
         if(data.trabajadores.length == 0){
	    data.trabajadores.push({
	       trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
	    })
         }
		
         listTrabajadoresResponsableAuditoria= data.trabajadores;
		
         crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajador","verPuestoAcordeTrabajadorInve()", data.trabajadores,
        	                                 "trabajadorId","nombre","#divAutoCompletarTrabAudi","");
		
         verPuestoAcordeTrabajadorAudi();
		
         $("#inputResp").attr("onkeyup","verAutoCompletarTrabAuditoria()");
      });
}

function verPuestoAcordeTrabajadorAudi(){
	
   var trabId = parseInt($("#selAutoTrabajador").val());
	
   listTrabajadoresResponsableAuditoria.forEach(
      function(val){
         if(val.trabajadorId == trabId){
            $("#inputCar").val(val.puesto.positionName)
         }
      })
}

function volverAccionesAuditoria(){
   $("#modalAccionesAuditoria").find(".modal-body").hide();
   $("#modalAccionesAuditoria").find("#divTotalAcciones").show();
   $("#modalAccionesAuditoria").find(".modal-title").html("Solicitud de Accion de mejora Asociadas");	
}

function verOrigenSolicitudAccion(pindex){
	
   var accionObj=listFullAccionesAuditoria[pindex];
	
   $("#modalAccionesAuditoria").find(".modal-body").hide();
   $("#modalAccionesAuditoria").find("#divOrigenAccion").show();
   $("#modalAccionesAuditoria").find(".modal-title")
	 .html("<a onclick='volverAccionesAuditoria()'>Solicitud '"+accionObj.solicitud.resumen+"'</a>" +
		"> Origen de Solicitud");
	
   callAjaxPost(URL + '/auditoria/accion/origenes', {gestionAccionMejoraId:accionObj.solicitud.gestionAccionMejoraId},
      function(data){
         var list = data.list; 
         $("#tblItemAsoc tbody tr").remove();  
		
         list.forEach(
            function(val,index){ 
               var btnDescargaCausa="";
			
               if(val.evidenciaNombre!=null){
		  btnDescargaCausa="<a class='btn-success btn' " +
				   "href='"+URL+"/auditoria/accion/origen/evidencia?id="+val.detalleGestAccionMejoraId+"' " +
				   "target='_blank' >Descargar Evidencia</a>";
               }else{
		  btnDescargaCausa="Sin evidencia"
               }
			
               $("#tblItemAsoc tbody")
		     .append("<tr>" 
			      + "<td id='asd"+val.detalleGestAccionMejoraId + "'>"
			      + val.moduloNombre + "</td>"
			      + "<td id='asd"+ val.detalleGestAccionMejoraId + "'>"
			      + val.categoriaNombre + "</td>"
			      + "<td id='asd"+ val.detalleGestAccionMejoraId+ "'>"
			      + val.detalleNombre +"</td>"
			      + "<td id='asd"+ val.detalleGestAccionMejoraId+ "'>"
			      + val.observacion +"</td>"
			      + "<td id='asd"+ val.detalleGestAccionMejoraId + "'>"
			      + val.fechaInicioTexto+ "</td>"
			      + "<td>"+ btnDescargaCausa+ "</td>" 
			   + "</tr>");	
               $("#tddetalle"+ val.detalleGestAccionMejoraId).css({"text-align":"left"});
            });
      });
}

function editarEvidenciaAuditoria(){
   $("#modalUploadAuditoria").modal("show");
}

function nuevoAuditoria(){
    auditoriaObj.usuariosGerenciaCalificacion = null;

    if(!banderaEdicion){
        banderaEdicion = true;auditoriaId = 0;
       
        var selectAudiTipo = crearSelectOneMenuOblig("selAudiTipo","",
	        listAudiTipo,"-1","audiTipoId","audiTipoNombre");
      
        var selectRespPlanificado = crearSelectOneMenuOblig("selRespPlanificado","",
	        listBoolean,"1","id","nombre");
		
        $("#tblAudi tbody:first").prepend(
            "<tr id='0'>" +
                "<td><input type='text' id='inputNom' autofocus='true' class='form-control' placeholder='Nombre' autofocus='true'></td>" +
	            "<td>"+selectAudiTipo+"</td>" +
                "<td>...</td>" +
	            "<td>...</td>" +
	    "<td>"+"<input type='text' id='inputLugar' class='form-control'>"+"</td>" +  
	    "<td>"+selectRespPlanificado+"</td>" +
	    "<td>"+"<input type='date' id='inputFechaPlan' onchange='hallarEstadoImplementacion("+auditoriaId+")' " +
	    		  "class='form-control'>"+"</td>" +
	    "<td>"+"<input type='time' id='inputHora' onchange='hallarEstadoImplementacion("+auditoriaId+")' " +
	    		  "class='form-control'>"+"</td>" +
	    "<td><input type='number' id='inputInversion' class='form-control'></td>" +
	    "<td><input type='text' id='inputResp' class='form-control' placeholder='Responsable'>" +
	        "<div id='divAutoCompletarTrabAudi'></div></td>" +
	    "<td><input type='text' id='inputCar' class='form-control' placeholder='Cargo'></td>" +
	    "<td>"+"<input type='date' id='inputFecha' onchange='hallarEstadoImplementacion("+auditoriaId+")' " +
	    		  "class='form-control'>"+"</td>" +
	    "<td>"+"<textarea rows='3' id='inputObsAudi' class='form-control'></textarea>"+"</td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
//	    "<td id='EviAudi'>...</td>" +
	    "<td>...</td>" +
	    "<td id='estadoAudi0'>...</td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
	 "</tr>");
      
      setTextareaHeight($('#inputObsAudi'));
      $("#inputResp").attr("onkeyup","verAutoCompletarTrabAuditoria()");
		
//      var options={
//	 container: "#EviAudi",
//	 functionCall: function(){},
//	 descargaUrl: "",
//	 esNuevo: true,
//	 idAux: "Auditoria",
//	 evidenciaNombre: ""
//      };
//		
//      crearFormEvidenciaCompleta(options);
			
      habilitarBotonesNuevo();
      
      $("#btnResHallAudit").hide();$("#btnHistorialRegistroAudi").hide();$("#btnResListaAudit").hide();
      $("#btnConfigurarImpact").hide();
		
      if(auditoriaClasif == 1){
         $("#btnConsolidadoInspecc").hide();
         $("#btnNuevoAudi").hide();
      }else{
         $("#btnConsolidadoInspeccHLCL").hide();
         $("#btnNuevoInsp").hide();
      }
      	
      $("#filtroAplicarBuscador").hide();$("#btnClipTabla").hide();$("#btnImportInspecc").hide();
      $("#btnHerramientasInspecc").hide();$("#btnGraficoAuditoria").hide();$("#btnListarVerificaciones").hide();
      $("#btnResetBuscadorAuditoria").hide();$("#btnAplicarBuscadorAuditoria").hide();$("#valBuscarValorAuditoria").hide();
      $("#btnConsolidadoAuditoria").hide();
      
      formatoCeldaSombreableTabla(false,"tblAudi");		
   }else{
      alert("Guarde primero.");
   }
}

function cancelarAuditoria() {
   cargarPrimerEstado();
}

function eliminarAuditoria() {
   mensajeUx = "<label>¿Está seguro de eliminar el registro de inspección " +
               "seleccionado?</label>";

   mensajesUx(mensajeUx,3,"","Aud");
   
   $("#btnDevolverValorAud").on("click",function(){
      var dataParam={
	 auditoriaId: auditoriaId,
	 auditoriaTipo: auditoriaObj.auditoriaTipo
      };
         
      callAjaxPost(URL+'/auditoria/delete',dataParam,procesarResultadoEliminarAudi);
   });
}

var msjEliminarAudi="";

function procesarResultadoEliminarAudi(data) {
   switch(data.CODE_RESPONSE){
      case "05":
         var msj = data.mensaje;  
	 
         if(msj.length > 0){
	  //alert( "No se puede eliminar registros que tengan asociados acciones de mejora");
            mensajeUx = "<label>"+msj+"</label>";
 	    mensajesUx(mensajeUx,2,"");
	 }else{
	    mensajeUx = "<label>El registro de inspección seleccionado se ha " +
	    		"eliminado correctamente.</label>";
	    mensajesUx(mensajeUx,1,"");  
	 }
         
	 cargarPrimerEstado();
	 break;
	 
      default:
       //alert(msjEliminarAudi);
	 mensajeUx = msjEliminarAudi;
	 mensajesUx(mensajeUx,2,"");
   }
}

function guardarAuditoria() {

   if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null){
      alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
      cancelarAuditoria();
      return;
   }
	
   var campoVacio = true;
   var inversionAud=$("#inputInversion").val();
   var inputNom = $("#inputNom").val();
   var horaPlanificada=$("#inputHora").val();
	
   if(!$("#inputHora").val()){
      horaPlanificada = null;
   }
	
   var inputResp = $("#inputResp").val();
   var inputCar = $("#inputCar").val();
   var inputFecha = convertirFechaTexto($("#inputFecha").val());  
   var inputFechaPlanAudi = convertirFechaTexto($("#inputFechaPlan").val());
   var lugar=$("#inputLugar").val();
   var audiTipo;
	
   if(auditoriaId == 0){
      audiTipo = $("#selAudiTipo option:selected").val();
   }else{
      audiTipo = auditoriaTipo;
   }

 
   if(auditoriaId > 0){
      var seleccionados = $('#jstree').jstree(true).get_checked();
      listAreasSelecccionados = [];
	   
      for(index = 0; index < seleccionados.length; index++){
	 var trab = seleccionados[index];
	 if(seleccionados[index].substr(0, 4) == "nodo"){
	    listAreasSelecccionados.push(seleccionados[index].substr(4, seleccionados[index].length));
	 }
      }	
   } 

   if(audiTipo == '-1' || inputNom.length == 0 || inputResp.length == 0){
      campoVacio = false;
   }
	
   var trabId = parseInt( $("#selAutoTrabajador").val());
   var observacion = $("#inputObsAudi").val();
   var respuestaInspecPlanId = parseInt($("#selRespPlanificado").val());
	
   if(campoVacio){
      var dataParam={
	 auditoriaId: auditoriaId,
	 observacion: observacion,
	 trabajador: {trabajadorId: trabId},
	 auditoriaNombre: inputNom,
	 auditoriaResponsable: inputResp,
	 auditoriaCargo: inputCar,
	 auditoriaTipo: audiTipo,
	 horaPlanificada: horaPlanificada,
	 auditoriaFecha: inputFecha,
	 areas: listAreasSelecccionados,
	 lugar: lugar,
	 estadoImplementacion: auditoriaEstado,
	 inversionAuditoria: inversionAud,
	 fechaPlanificada: inputFechaPlanAudi,
	 respInspeccPlanificada: respuestaInspecPlanId,
	 idCompany: getSession("gestopcompanyid")
      };
      
      getLocation(function(){
         dataParam.posicion = {
	    x: posicionX,
	    y: posicionY
         }

          callAjaxPostSimpleVersionDos(1,URL+'/auditoria/save',dataParam,1,1,procesarResultadoGuardarAudi);
      });
   }else{
    //alert("Debe ingresar todos los campos.");
      mensajeUx="<label>Debe ingresar todos los campos.</label>";  
      mensajesUx(mensajeUx,2,"","");
   }
}

function procesarResultadoGuardarAudi(data){
    switch(data.CODE_RESPONSE){
        case "05":
//            guardarEvidenciaAutoVersionTres(1,data.nuevoId,"fileEviAuditoria",bitsEvidenciaDiagnostico,0,1,
//            "/auditoria/evidencia/save",function(){
                // guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviAuditoria",bitsEvidenciaDiagnostico,
                // 0,1,"/auditoria/amazon_s3/evidencia/save","auditoria/evidencia",function(){
                    mensajeUx="<label>El registro fue guardado correctamente.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarModInspecc");

                    $("#modalMensajeUxActualizarModInspecc").on("hidden.bs.modal",function(){
                        cargarPrimerEstado();
                    });
                // });
//            },"auditoriaId");
	 
            break;
      
        default:
	        mensajeUx="<label>Ocurrió un error al guardar el registro de la auditoría.</label>";
            mensajesUx(mensajeUx,2,"","");
   }
}

function seleccionarArea(){
   $('#mdArea').modal('show');
}
 
$('#mdArea').on('show.bs.modal', function(e){
   cargarModalArea();
});

function cargarModalArea(){
   if(listAreasSelecccionados.length === 0){
      var dataParam={
	      auditoriaId : auditoriaId,
	      idCompany : sessionStorage.getItem("gestopcompanyid")
		    };
      
   callAjaxPost(URL + '/auditoria/area/jstree',dataParam,
      function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $('#jstree').jstree("destroy");
	       listAreas = data.list;
	       $('#jstree').jstree({
			 "plugins" : [ "checkbox", "json_data" ],
			'checkbox' : {"keep_selected_style" : false,
					    "tie_selection" : false},
			    'core' : {'data' : listAreas}
			   });


	       for(index = 0; index < listAreas.length; index++){
	          if(listAreas[index].state.checked && listAreas[index].id.substr(0, 4) == "nodo"){
		     listAreasSelecccionados.push(listAreas[index].id.substr(4,listAreas[index].id.length));
		  }
	       }
						
//	       console.log(listAreasSelecccionados);
	       break;
					
	    default:
	       alert("Ocurrió un error al cargar el arbol de areas!");
	}
     });
   }
}

function hallarEstadoImplementacion(progId){
	
   var fechaPlanificada=$("#inputFechaPlan").val();
   var fechaReal=$("#inputFecha").val();
   var fechaHoy=obtenerFechaActual();
	
   if(fechaReal!=''){
      auditoriaEstado=2;
      auditoriaEstadoNombre="Completado";
   }else{
      if(fechaPlanificada!=""){
	 var dif=restaFechas(fechaHoy,fechaPlanificada)
	 if(dif<0){
	    auditoriaEstado=3;
	    auditoriaEstadoNombre="Retrasado";
	 }else{
	    auditoriaEstado=1;
	    auditoriaEstadoNombre="Por implementar";
	 }
      }else{
	 auditoriaEstado=1;
	 auditoriaEstadoNombre="Por implementar";
      }
   }
	
   $("#estadoAudi"+progId).html(auditoriaEstadoNombre);	
}


function generarReporteAuditoria(){
	
   switch(parseInt(auditoriaClasif)){
      case 1:
         if(numAreas==0){
            alert("No hay áreas asignadas a la auditoría")
         }else{
            window.open(URL+ "/auditoria/informe/auditoria?auditoriaId="
			   + auditoriaId);	
         }
	 break;
	 
      case 2:
	 if(numAreas==0){
	    alert("No hay áreas asignadas a la inspección")
	 }else{
	    window.open(URL+ "/auditoria/informe/inpeccion?auditoriaId="
		    	   + auditoriaId +"&tipoAuditoriaId="+auditoriaTipo);	
	 }
	 break;
	 
      default:
	break;
	
   } 
}

function generarReporteExcelAuditoria(){
   if(numAreas == 0){
      alert("No hay áreas asignadas a la inspección");
   }else{
      window.open(URL+"/auditoria/reporte/inspeccion/excel?" +
         "id="+auditoriaId+"&tipoAuditoriaId="+auditoriaTipo);	
   }
}

function generarReporteWordMonitoreo(){
   window.open(URL+ "/auditoria/reporte/inspeccion/monitoreo/word?id="
	       	  + auditoriaId +"&tipoAuditoriaId="+auditoriaTipo
	          +"&audiNombre="+nombreAudi);	
}

function uploadEvidenciaAuditoria(){
	
   var inputFileImage = document.getElementById("fileEviAuditoria");
   var file = inputFileImage.files[0];
	
   $("#tdeviAudi"+auditoriaId+" ").html(file.name);
   $.blockUI({message:'cargando...'}); 

   guardarEvidenciaAuto(auditoriaId,"fileEviAuditoria",bitsEvidenciaAuditoria,
			"/auditoria/evidencia/save",
			function(){
                           $.unblockUI();
                           $("#modalUploadAuditoria").modal("hide");
		        },"auditoriaId") 
}

function cambiarAcordeTipoAuditoria(tipoAudi){
   var tipoAudiId = parseInt(tipoAudi);
	
   if(tipoAudiId == 94 || tipoAudiId == 194){
      $("#btnListarVerificaciones").hide();
      $("#btnHallazgo").show();
      $("#btnExcelInspecc").show();
      $("#btnMonitoreo").hide();
      $("#btnGenMonitoreoWord").hide();
      $('#mdVerif').off('hidden.bs.modal');
      
      msjEliminarAudi = "Para eliminar una auditoría / inspección libre, se debe eliminar " +
      		        "previamente los hallazgos registrados.";
   }else if(tipoAudiId == 100){
      $("#btnListarVerificaciones").hide();
      $("#btnHallazgo").hide();
      $("#btnExcelInspecc").hide();
      $("#btnGenMonitoreoWord").show();
      $("#btnMonitoreo").show();
      $('#mdVerif').off('hidden.bs.modal');
      
      msjEliminarAudi = "Verificar que el registro de monitoreo no tenga registros de " +
      		        "agentes monitoreados.";
   }else if(tipoAudiId == 300 || tipoAudiId == 303 || tipoAudiId == 304){
      $("#btnTipoAuditoriaAsocInspecc").show();
      $("#btnExcelTipoAuditoriaEvaluados").show();
      $("#btnListarVerificaciones").hide();
      $("#btnHallazgo").hide();
      $("#btnExcelInspecc").hide();
      $("#btnGenMonitoreoWord").hide();
      $("#btnMonitoreo").hide();
      $("#btnGenReporteExcel").hide();
      $("#btnGenReporte").hide();
      
      msjEliminarAudi = "<label>Para eliminar la inspección extintor, debe borrar antes " +
      		        "todos los registros de extintores asociados a la misma.</label>";
   }else{
      $("#btnListarVerificaciones").show();
      $("#btnHallazgo").hide();
      $("#btnExcelInspecc").hide();
      $("#btnGenMonitoreoWord").hide();
      $("#btnMonitoreo").hide();
      
      $('#mdVerif').on('hidden.bs.modal',
	 function(e){
	    if(!guardoAccion){
	       return false;
	    }
			
	    var dataParam={
	       auditoriaId:auditoriaId,
	       auditoriaTipo:auditoriaTipo,
	       detalleAuditoriaId:preguntas[indexPregunta].detalleAuditoriaId
	    };

	    callAjaxPost(URL+'/auditoria/verificaciones',dataParam,function(data){
	       var dataAux={"CODE_RESPONSE":"05"};
	       var listActualPregunta = [];
		
	       preguntas.forEach(function(val){
		  if(val.verificacionId == data.list[0].verificacionId){
		     listActualPregunta.push(data.list[0]);
		  }else{
		     listActualPregunta.push(val);
		  }
	       });
					
	       dataAux.list = listActualPregunta;
	       dataAux.secciones = listSeccionesInteresadasDetalleAuditoria;
	       dataAux.areas = listAreasInteresadasDetalleAuditoria;
	       procesarDataDescargadaVerificaciones(dataAux);
	    });
         });
         
      msjEliminarAudi = "Ocurrió un error al eliminar la auditoría!";
   }
}

function descargarConsolidadoInspeccion(){
   var opcionDescarga = ($("#radioInspecciones1").prop("checked")?1:2);
   var fechaInicioConsolidado = $("#fechaInicioConsolidado").val();
   var fechaFinConsolidado = $("#fechaFinConsolidado").val();
   
   consolExcelHallazgosLibresCheckList(getSession("gestopcompanyid"),0,opcionDescarga,
      fechaInicioConsolidado,fechaFinConsolidado);
}

function consolExcelHallazgosLibres(empresaId,proyectoId,tipoAuditoria){
   window.open(URL+"/auditoria/contratista/inspeccion/excel?idCompany="+empresaId
		  +"&proyectoId="+proyectoId+"&auditoriaTipo="+tipoAuditoria);
}

function consolExcelHallazgosLibresCheckList(empresaId,proyectoId,opcionDescarga,fechaInicioConsolidado,fechaFinConsolidado){
   var uno = 1,cero = 0;
    
   window.open(URL+"/auditoria/contratista/tipo/excel?idCompany="+empresaId +
      "&proyectoId="+proyectoId+"&tipoReporteConsolidadoId="+opcionDescarga+"&todosLosProyectos="+uno +
      "&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado +
      "&estadoProyectos="+cero);
}

function ocultarMensajesUxInspecciones(){
   $("#modalMensajeUx").modal("hide");
   //console.log(activarModalAccionesAuditoria);
   if(activarModalAccionesAuditoria == 1){
      $("#modalAccionesAuditoria").modal("show");
      activarModalAccionesAuditoria = 0;
   }
}

var listHerramientasInspeccion = [
   {id:1,nombre:"Extintores"},
   {id:2,nombre:"Gabinetes contra incendios"}];

function ocultarSeleccionarHerramientaInspeccion(){
   $("#modalSeleccionarHerramientaInspecc").modal("hide");
}

function seleccionarHerramientaInspeccion(){
   $("#modalSeleccionarHerramientaInspecc").remove();
    
   var contenido = "";
    
   var selHerramientaInspecc = crearSelectOneMenuOblig("selHerramientaInspecc","",
      listHerramientasInspeccion,"1","id","nombre");
    
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"¿Herramienta?",inputForm:selHerramientaInspecc},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
 	   	     "onclick='ocultarSeleccionarHerramientaInspeccion()'>" +
 	        "<i class='fa fa-times'></i> Cancelar" +
 	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
 	   		 "onclick='opcionHerramientaInspeccion()'>" +
 	            "<i class='fa fa-check'></i> Aceptar" +
 	         "</button>"}
   ];
 	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var modalOptions={
      id: "modalSeleccionarHerramientaInspecc",
      nombre: "<i class='fa fa-briefcase'></i> Seleccione una herramienta para buscar " +
      	      "sus registros asociados <br>",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
 	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
     
   $("#modalSeleccionarHerramientaInspecc").modal("show"); 
}

function opcionHerramientaInspeccion(){
   $("#modalConsolidadoHerramientaInspecc").remove();
   $("#modalConsolidadoGabineteIncendioHerr").remove();
    
   var opcionHerramientaId = parseInt($("#selHerramientaInspecc").val());
   
   if(opcionHerramientaId == 1){
      consolidadoHerramientaExtintor();
   }else if(opcionHerramientaId == 2){
      consolidadoGabineteIncendioHerr();
   }
   
   $("#modalSeleccionarHerramientaInspecc").modal("hide");
}

function irHaciaConsolidadoRespectivoTipoAuditoria(){
   if(auditoriaObj.auditoriaTipo == 300){
      consolidadoExtintoresAsociadosInspeccion();
   }else if(auditoriaObj.auditoriaTipo == 303){
      consolidadoGabinetesIncendioAsociadosInspeccion();
   }else if(auditoriaObj.auditoriaTipo == 304){
      consolidadoTrabajadoresEppAsociadosInspeccion();
   }  
}

function descargarExcelRespectivoTipoAuditoria(){
   if(auditoriaObj.auditoriaTipo == 300){
      descargarExcelExtintoresEvaluadosInspeccion();
   }else if(auditoriaObj.auditoriaTipo == 303){
      descargarExcelGabinetesIncendioEvaluadosInspeccion();
   }else if(auditoriaObj.auditoriaTipo == 304){
      completarCamposAdicionalesFinalizarInspeccion();
   } 
}

function ocultarCompletarCamposAdiFinInspeccion(){
   $("#modalCompletarCamposAdiFinInspecc").modal("hide");
}

function completarCamposAdicionalesFinalizarInspeccion(){
   $("#modalCompletarCamposAdiFinInspecc").remove();
    
   var listItemsRegistro=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Descripción de las causas ante resultados desfavorables de la inspección",
       inputForm:"<textarea class='form-control' id='textDescCausaDesfInspeccFinal' rows='3'></textarea>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Conclusiones y recomendaciones",
       inputForm:"<textarea class='form-control' id='textConcluRecomenInspeccFinal' rows='3'></textarea>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Observaciones",
       inputForm:"<textarea class='form-control' id='textObservacionesInspeccFinal' rows='3'></textarea>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
  	             "onclick='ocultarCompletarCamposAdiFinInspeccion()'>" +
  	        "<i class='fa fa-times'></i> Cancelar" +
  	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
  	 	    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
  	 	 "</button>"} 
   ];
                       
   var textFormRegistro = "";
                    	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val);
   });
                    	
   var opciones={
      id: "modalCompletarCamposAdiFinInspecc",
      nombre: "Datos adicionales - Finalizar inspección",
      contenido: "<form id='formEditarCamposAdiFinInspecc' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
                       
   crearModalPrincipalUsuario(opciones,function(){},true,true);
                	
   var editarDiv = $("#formEditarCamposAdiFinInspecc");
     
   editarDiv.find("#textDescCausaDesfInspeccFinal").val(auditoriaObj.descripcionCausaDesfavorable);
   editarDiv.find("#textConcluRecomenInspeccFinal").val(auditoriaObj.conclusionRecomendacion);
   editarDiv.find("#textObservacionesInspeccFinal").val(auditoriaObj.observacionFinalizacion);
    
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarCamposAdicionalesFinalizarInspeccion();
   });   
}

function guardarCamposAdicionalesFinalizarInspeccion(){
   var campoVacio = true; 
      
   var descripcion = $("#textDescCausaDesfInspeccFinal").val(); 
   var conclusionRecomendacion = $("#textConcluRecomenInspeccFinal").val(); 
   var observacion = $("#textObservacionesInspeccFinal").val(); 
   
   auditoriaObj.descripcionCausaDesfavorable = descripcion;
   auditoriaObj.conclusionRecomendacion = conclusionRecomendacion;
   auditoriaObj.observacionFinalizacion = observacion;
    
   if(campoVacio){
      var dataParam={
 	 auditoriaId: auditoriaObj.auditoriaId,
 	 descripcionCausaDesfavorable: descripcion,
         conclusionRecomendacion: conclusionRecomendacion,
         observacionFinalizacion: observacion
      };
        
      callAjaxPost(URL+"/auditoria/datos_adicionales/save",dataParam,function(data){
         $("#modalCompletarCamposAdiFinInspecc").hide();
  		    
         mensajeUx="<label>Los datos adicionales de la inspección fueron " +
  	    	   "actualizados con éxito.</label>";
  	    
         mensajesUx(mensajeUx,1,"","ActualizarInspeccFinalSeccAudi");
  		    
         $("#modalMensajeUxActualizarInspeccFinalSeccAudi").on("hidden.bs.modal",function(){
            descargarExcelTrabajadoresEppEvaluadosInspeccion();
         });
      });
   }else{
      //EN CASO SEA NECESARIO VALIDAR
   } 
}

var listAlmacenImagenExcelAudi=[];

function ocultarAlmacenImagenExcelAuditoria(){
   $("#modalAlmacenImagenExcelAuditoria").modal("hide");
}

function almacenImagenExcelAuditoria(){
   $("#modalAlmacenImagenExcelAuditoria").remove();
   
   var dataParam={};
	   	
   callAjaxPost(URL+'/auditoria/almacen_imagen_excel',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listAlmacenImagenExcelAudi =  data.listAlmacenImagenExcelAudi;
             
            var selAlmacenImagenExcelAudi = crearSelectOneMenuOblig("selAlmacenImagenExcelAudi",
               "cambiarImagenSegunSelectAlmaceImagenExcelAudi()",listAlmacenImagenExcelAudi,"","almacenImagenExcelId","nombreAuxiliar");
             
            var listItemsRegistro=[
               {sugerencia:"",anchoLabel:"",anchoDiv:"",
                label:"Imagen almacén excel",
                inputForm:selAlmacenImagenExcelAudi,divContainer:""},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
               {sugerencia:"",label:"Imagen",
                inputForm:"",divContainer:"divEvidenciaAlmImaExcAudi"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
               {sugerencia:"",
                label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
   	                      "onclick='ocultarAlmacenImagenExcelAuditoria()'>" +
   	                 "<i class='fa fa-times'></i> Cancelar" +
   	              "</button>",
                inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
   	 	             "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
   	 	          "</button>"} 
            ]; 
                        
            var textFormRegistro = "";
                     	
            listItemsRegistro.forEach(function(val,index){
               textFormRegistro += obtenerSubPanelModuloVersionDos(val);
            });
                     	
            var opciones={
               id: "modalAlmacenImagenExcelAuditoria",
               nombre: "Almacen imagen excel - Auditoria",
               contenido: "<form id='formEditarAlmacenImagenExcelAudi' class='eventoGeneral'>"+textFormRegistro+"</form>"
            };
                        
            crearModalPrincipalUsuario(opciones,function(){},true,true);
                 	
            var editarDiv = $("#formEditarAlmacenImagenExcelAudi");
            
            cambiarImagenSegunSelectAlmaceImagenExcelAudi();
   
            editarDiv.on('submit',function(e){  
               e.preventDefault();
               guardarAlmacenImagenExcelAuditoria();
            });   
            break;
    
	 default:
	    alert("nop");
	    break;
      }
   });
}

function cambiarImagenSegunSelectAlmaceImagenExcelAudi(){
   var almacenImagenExcelId = parseInt($("#selAlmacenImagenExcelAudi").val());
   var imagenNombre;
   
   listAlmacenImagenExcelAudi.forEach(function(val){
      if(almacenImagenExcelId  == val.almacenImagenExcelId){
	 imagenNombre = val.imagenNombre; 
      }
   });
    
   var options={
      container: "#divEvidenciaAlmImaExcAudi",
      functionCall: function(){},
      descargaUrl: "/auditoria/almacen_imagen_excel/imagen?almacenImagenExcelId="+almacenImagenExcelId,
      esNuevo: (imagenNombre.length == 0),
      idAux: "AlmImaExcAudi",
      evidenciaNombre: imagenNombre
   };   
    
   crearFormEvidenciaCompleta(options);
}

function guardarAlmacenImagenExcelAuditoria(){
   var almacenImagenExcelId = parseInt($("#selAlmacenImagenExcelAudi").val());
    
   guardarEvidenciaAuto(almacenImagenExcelId,"fileEviAlmImaExcAudi",bitsEvidenciaActoInseguro,
   "/auditoria/almacen_imagen_excel/imagen/save",function(){
      $("#modalAlmacenImagenExcelAuditoria").hide();
			    
      mensajeUx="<label>El actualizó con éxito la imagen.</label>";	    
      mensajesUx(mensajeUx,1,"");
   }); 
}

function ocultarValoresEleccionInspeccionDescargar(){
   $("#modalEleccionInspeccionDescargar").modal("hide");
}

function valoresEleccionInspeccionDescargar(){
   $("#modalEleccionInspeccionDescargar").remove();
                   
   var contenido ="";
		    
   var listContenido=[ 
      {sugerencia:"",label:"Hallazgos Libres",
       inputForm:"<input type='radio' id='radioInspecciones1' class='form-control' name='radioInspecciones' checked>",
       divContainer:""},
      {sugerencia:"",label:"CheckList",
       inputForm:"<input type='radio' id='radioInspecciones2' class='form-control' name='radioInspecciones'>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Desde",
       inputForm:"<input type='date' id='fechaInicioConsolidado' class='form-control'>"},
      {sugerencia:"",label:"Hasta",
       inputForm:"<input type='date' id='fechaFinConsolidado' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
       		     "onclick='ocultarValoresEleccionInspeccionDescargar()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
       		         "onclick='descargarConsolidadoInspeccion()'>" +
		    "<i class='fa fa-download'></i> Descargar" +
		 "</button>"}
   ];
		    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
		
   var modalOptions={
      id: "modalEleccionInspeccionDescargar",
      nombre: "<i class='fa fa-graduation-cap'></i> Consolidado de inspecciones - unidades <br>",
      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   };
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   var hoy = getSession("fechaHoyOrdenInversoTexto");
		 
   $("#fechaInicioConsolidado").val(sumaFechaDias(-30,hoy));
   $("#fechaFinConsolidado").val(sumaFechaDias(365,hoy));
	
   $("#modalEleccionInspeccionDescargar").modal("show"); 
}

var listOpcionesGraficoInspeccion=[
   {id:1,nombre:"Por tipo de inspección"},
   {id:2,nombre:"Por Resultado"}
];

function ocultarSeleccionarOpcionGraficoAuditoria(){
   $("#modalSelOpcionGraficoAudi").modal("hide");
}

function seleccionarOpcionGraficoAuditoria(){
   $("#modalSelOpcionGraficoAudi").remove();
   
   var selOpcionGraficoAudi = crearSelectOneMenuOblig("selOpcionGraficoAudi","",
      listOpcionesGraficoInspeccion,"","id","nombre");
     
   var contenido = "";
  
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Gráfico",inputForm:selOpcionGraficoAudi},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	             "onclick='ocultarSeleccionarOpcionGraficoAuditoria()'>" +
    	        "<i class='fa fa-times'></i> Cancelar" +
    	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		 "onclick='redireccionarGraficoAuditoria()'>" +
    	            "<i class='fa fa-check'></i> Aceptar" +
    	         "</button>"}
   ];
    	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    	
   var modalOptions={
      id: "modalSelOpcionGraficoAudi",
      nombre: "<i class='fa fa-list-ul'></i> Debe seleccionar una de las opciones",
      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   };
    	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function redireccionarGraficoAuditoria(){
   $("#modalSelOpcionGraficoAudi").modal("hide");
   
   var opcionId = parseInt($("#selOpcionGraficoAudi").val());
  
   if(opcionId == 1){
      verGraficoTipoInspeccionAuditoria();
   }else if(opcionId == 2){
      verGraficoGeneralResultadoAuditoria();
   }
}

function verGraficoTipoInspeccionAuditoria(){
   $("#modalGraficoTipoInspeccAudi").remove();
     
   var modalOptions={
      id: "modalGraficoTipoInspeccAudi",maxWidth: "90%",
      nombre: "Gráfico inspecciones - Por tipo de inspección",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoTipoInspeccAudi'></div>"
   };
   
   var listAudiTipoInspeccionAux = [];
   
   listAudiTipo.forEach(function(val){
      var cantidadInspecciones = 0; 
       
      listAudiFull.forEach(function(val1){
	 if(val.audiTipoId == val1.auditoriaTipo){
	    cantidadInspecciones++;
	 }   
      });
      
      if(cantidadInspecciones > 0){
	 listAudiTipoInspeccionAux.push(
            {name: val.audiTipoNombre,data: [cantidadInspecciones]});
      }
   });
   	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoTipoInspeccAudi",190);
 	 	
   Highcharts.chart('divGraficoTipoInspeccAudi',{
      chart: {type: 'column'},
      title: {
	 text: "Gráfico inspecciones - Por tipo de inspección",
	 style: {fontWeight: 'bold',fontSize: '20px'}},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de inspecciones",
 	    style: {fontWeight: 'bold',fontSize: '18px'}}},
      plotOptions: {
 	 column: {
            dataLabels: {
               enabled: true,color: 'black',style: {fontSize: '25px'}},
 	    enableMouseTracking: false}},
      series: listAudiTipoInspeccionAux
   }); 
}

function verGraficoGeneralResultadoAuditoria(){
   $("#modalGraficoGeneralResultadoAudi").remove();
     
   var modalOptions={
      id: "modalGraficoGeneralResultadoAudi",maxWidth: "90%",
      nombre: "Gráfico inspecciones - Por resultado",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoGeneralResultadoAudi'></div>"
   };
   
   var numAuditoriaAccMejCompletados = 0,numAuditoriaAccMejPendientes = 0,numAuditoriaAccMejSinNinguna = 0;
      
   listAudiFull.forEach(function(val){
      if(val.auditoriaTipo == 94){
	 if(val.numAccionesHallazgoProyecto == 0){
	    numAuditoriaAccMejSinNinguna++;
	 }else if(val.numAccionesCompletasHallazgoProyecto == val.numAccionesHallazgoProyecto){
	    numAuditoriaAccMejCompletados++;
	 }else{
	    numAuditoriaAccMejPendientes++;
	 }
      }else if(val.auditoriaTipo != 300 && val.auditoriaTipo != 303 && val.auditoriaTipo != 304){
	 if(val.numAccionesAuditoriaProyecto == 0){
	    numAuditoriaAccMejSinNinguna++;
	 }else if(val.numAccionesCompletasAuditoriaProyecto == val.numAccionesAuditoriaProyecto){
	    numAuditoriaAccMejCompletados++;
	 }else{
	    numAuditoriaAccMejPendientes++;
	 }  
      }   
   });
     	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoGeneralResultadoAudi",190);
 	 	
   Highcharts.chart('divGraficoGeneralResultadoAudi',{
      chart: {type: 'column'},
      title: {
	 text: "Gráfico inspecciones - Por resultado",
	 style: {fontWeight: 'bold',fontSize: '20px'}},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de inspecciones",
 	    style: {fontWeight: 'bold',fontSize: '18px'}}},
      plotOptions: {
 	 column: {
            dataLabels: {
               enabled: true,color: 'black',style: {fontSize: '25px'}},
 	    enableMouseTracking: false}},
      series: [
	 {name: 'Acciones de mejora completadas',data: [numAuditoriaAccMejCompletados],color: 'blue'},
	 {name: 'Acciones de mejora pendientes',data: [numAuditoriaAccMejPendientes],color: 'red'},
	 {name: 'Sin acciones de mejora',data: [numAuditoriaAccMejSinNinguna],color: 'black'}]
   }); 
}

function aplicarBuscadorAuditoria(){
   var valBuscarValorAuditoria = igualarStringBuscar($("#valBuscarValorAuditoria").val());
  	
   listAudiFull.forEach(function(val,index){
      if(igualarStringBuscar(val.auditoriaNombre).indexOf(valBuscarValorAuditoria) != -1 ||
	 igualarStringBuscar(val.auditoriaTipoNombre).indexOf(valBuscarValorAuditoria) != -1 || 
	 igualarStringBuscar(val.lugar).indexOf(valBuscarValorAuditoria) != -1 || 
	 igualarStringBuscar(val.auditoriaResponsable).indexOf(valBuscarValorAuditoria) != -1){
	 $("#tr"+val.auditoriaId).show();
      }else{
   	 $("#tr"+val.auditoriaId).hide();
      }
   }); 
}

function reiniciarBuscadorAuditoria(){
   $("#valBuscarValorAuditoria").val("").focus();
    
   listAudiFull.forEach(function(val,index){
      $("#tr"+val.auditoriaId).show();
   });
}

var listOpcionesConsolidadoInspeccion=[
   {id:1,nombre:"Por tipo de inspección"}
];

function ocultarSeleccionarOpcionConsolidadoAuditoria(){
   $("#modalSelOpcionConsolidadoAudi").modal("hide");
}

function seleccionarOpcionConsolidadoAuditoria(){
   $("#modalSelOpcionConsolidadoAudi").remove();
    
   var selOpcionConsolidadoAudi = crearSelectOneMenuOblig("selOpcionConsolidadoAudi","",
      listOpcionesConsolidadoInspeccion,"","id","nombre");
      
   var contenido = "";
   
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Gráfico",inputForm:selOpcionConsolidadoAudi},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
     	             "onclick='ocultarSeleccionarOpcionConsolidadoAuditoria()'>" +
     	        "<i class='fa fa-times'></i> Cancelar" +
     	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
     	   		 "onclick='redireccionarConsolidadoAuditoria()'>" +
     	            "<i class='fa fa-check'></i> Aceptar" +
     	         "</button>"}
   ];
     	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
     	
   var modalOptions={
      id: "modalSelOpcionConsolidadoAudi",
      nombre: "<i class='fa fa-list-ul'></i> Debe seleccionar una de las opciones",
      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   };
     	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);    
}

function redireccionarConsolidadoAuditoria(){
   $("#modalSelOpcionConsolidadoAudi").modal("hide");
    
   var opcionId = parseInt($("#selOpcionConsolidadoAudi").val());
   
   if(opcionId == 1){
      verConsolidadoTipoInspeccionAuditoria();
   }
}

var listAudiTipoInspeccionAux = [];

function volverSeleccionarOpcionConsolidadoAuditoria(){
   $("#modalConsolidadoTipoInspeccionAudi").modal("hide");$("#modalSelOpcionConsolidadoAudi").modal("show");
}

function verConsolidadoTipoInspeccionAuditoria(){
   $("#modalConsolidadoTipoInspeccionAudi").remove();
    
   var contenido = "";
    
   var buttonVolver =
      "<button type='button' id='btnVolverConsolTipoInspeccAudi' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverSeleccionarOpcionConsolidadoAuditoria()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
    
   var modalOptions={
      maxWidth:"50%",id:"modalConsolidadoTipoInspeccionAudi",
      nombre:"<i class='fa fa-table'></i> Consolidado inspecciones - Por tipo de inspección",
      contenido: 
 	 buttonVolver +
         "<div class='wrapper' id='wrapperConsolidadoTipoInspeccionAudi'>" +
            "<table id='tblConsolidadoTipoInspeccionAudi' class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 	          "<tr>" +
 	             "<td class='tb-acc' style='width:250px'>Tipo de inspección</td>" +
 		     "<td class='tb-acc' style='width:150px'>Total</td>" +
 		  "</tr>" +
 	       "</thead>" +
 	       "<tbody></tbody>" +
 	    "</table>" +
 	 "</div>"};
 		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoTipoInspeccionAudi",190);    
    
   listAudiTipoInspeccionAux = [];
   var listAdiTipoNoValidoAux = [94,194,300,303,304];
   
   listAudiTipo.forEach(function(val){
      if(!listAdiTipoNoValidoAux.includes(val.audiTipoId)){
         var cantidadInspecciones = 0; 
       
         listAudiFull.forEach(function(val1){
	    if(val.audiTipoId == val1.auditoriaTipo){
	       cantidadInspecciones++;
	    }   
         });
      
         if(cantidadInspecciones > 0){
	    listAudiTipoInspeccionAux.push(
               {audiTipoId: val.audiTipoId,audiTipoNombre: val.audiTipoNombre,cantidad: cantidadInspecciones});
         }
      }
   });
   
   $("#tblConsolidadoTipoInspeccionAudi tbody tr").remove();
	 
   listAudiTipoInspeccionAux.forEach(function(val,index){
      $("#tblConsolidadoTipoInspeccionAudi tbody").append(
         "<tr id='fConsolidadoTipInsAud"+val.audiTipoId+"' onclick='verConsolidadoTipoInspeccionRespuestasAuditoria("+index+")'>" +
	    "<td>"+val.audiTipoNombre+"</td>" + 
	    "<td>"+val.cantidad+"</td>" +
         "</tr>");
   });
   	 	
   goheadfixedY("#tblConsolidadoTipoInspeccionAudi","#wrapperConsolidadoTipoInspeccionAudi");
   formatoCeldaSombreableTabla(true,"tblConsolidadoTipoInspeccionAudi");
}

function volverConsolidadoTipoInspeccionRespuestasAuditoria(){
   $("#modalConsolidadoTipoInspeccionRespAudi").modal("hide");$("#modalConsolidadoTipoInspeccionAudi").modal("show");
}

function verConsolidadoTipoInspeccionRespuestasAuditoria(pindex){
   $("#modalConsolidadoTipoInspeccionAudi").modal("hide");$("#modalConsolidadoTipoInspeccionRespAudi").remove();
   
   var audiTipoInspeccObj = listAudiTipoInspeccionAux[pindex];
    
   var contenido = "";
    
   var buttonVolver =
      "<button type='button' id='btnVolverConsolTipoInspeccRespAudi' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverConsolidadoTipoInspeccionRespuestasAuditoria()' title='Regresar al consolidado anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
    
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoTipoInspeccionRespAudi",
      nombre:"<i class='fa fa-table'></i> Consolidado inspecciones - Por tipo de inspección - Respuestas",
      contenido: 
 	 buttonVolver +
         "<div class='wrapper' id='wrapperConsolTipoInspeccRespAudi'>" +
            "<table id='tblConsolTipoInspeccRespAudi' class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 		 "<tr>" +
		     "<th class='tb-acc' rowspan='2' style='width:500px'>Pregunta</th>" +
		     "<th class='tb-acc' colspan='3' style='width:300px'>¿Aplica?</th>" +
		     "<th class='tb-acc' colspan='5' style='width:500px'>Cumplimiento</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:100px'>Sí</th>" +
		     "<th class='tb-acc' style='width:100px'>No</th>" +
		     "<th class='tb-acc' style='width:100px'>Total</th>" +
		     "<th class='tb-acc' style='width:100px'>Sí</th>" +
		     "<th class='tb-acc' style='width:100px'>Parcial</th>" +
		     "<th class='tb-acc' style='width:100px'>No</th>" +
		     "<th class='tb-acc' style='width:100px'>Avance</th>" +
		     "<th class='tb-acc' style='width:100px'>Nota</th>" +
              "</tr>" +
 	       "</thead>" +
 	       "<tbody></tbody>" +
 	    "</table>" +
 	 "</div>"};
 		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolTipoInspeccRespAudi",190);    
   
   var dataParam={
      auditoriaTipo: audiTipoInspeccObj.audiTipoId,
      empresaId: parseInt(getSession("gestopcompanyid")),
      fechaInicioPresentacion: $("#fechaInicioEvento").val(),
      fechaFinPresentacion: $("#fechaFinEvento").val()
   }; 
    
   callAjaxPost(URL+"/auditoria/vista_admin/consolidado/tipo_auditoria_respuesta",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
 	 var listAudiTipoInspeccionResp = data.listAudiTipoInspeccionResp;
 	 
 	 $("#tblConsolTipoInspeccRespAudi tbody tr").remove();
 	 
 	 listAudiTipoInspeccionResp.forEach(function(val,index){
 	    var numRespuestasAplican = audiTipoInspeccObj.cantidad - val.numRespuestasNoAplica; 
 	    var numRespuestasCumplimiento = val.numRespuestasBuenas + val.numRespuestasParcialmente +
 	       val.numRespuestasMalas;
 	   
 	    var nota = (val.numRespuestasBuenas*1 + val.numRespuestasParcialmente*0.5)/(numRespuestasAplican*1);
 	     
 	    $("#tblConsolTipoInspeccRespAudi tbody").append(
 	       "<tr id='fPregunta"+val.verificacionId+"'>" +
 	          "<td>"+val.verificacion+"</td>" +
 		  "<td style='border-left:3px solid #afb5bb'>"+numRespuestasAplican+"</td>" +
 		  "<td>"+val.numRespuestasNoAplica+"</td>" +
 		  "<td>"+audiTipoInspeccObj.cantidad+"</td>" +
 		  "<td style='border-left:3px solid #afb5bb'>"+val.numRespuestasBuenas+"</td>" +
 		  "<td>"+val.numRespuestasParcialmente+"</td>" +
 		  "<td>"+val.numRespuestasMalas+"</td>" +
 		  "<td>"+numRespuestasCumplimiento+"/"+numRespuestasAplican+"</td>" +
 		  "<td>"+(numRespuestasAplican == 0?"0%":pasarDecimalPorcentaje(nota,0))+"</td>" +
               "</tr>");
 	 });
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblConsolTipoInspeccRespAudi","#wrapperConsolTipoInspeccRespAudi");
   });
}

function descargarReporteFinalExcelInspeccion(){
    window.open(URL+"/auditoria/inspeccion/excel/reporte_final?"+"auditoriaId="+auditoriaId);
}

