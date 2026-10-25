/**
 */
var objObservacionContratista={};
var indexObservacionContratista;
var listObservacionesContratistaGeneral=[];
var listTipoPerdidaObsGeneral=[];
var listTipoReporteObsGeneral=[];
var listTipoProyectoObsGeneral=[];
var listTipoDirigidoObsGeneral=[];
var listGestionesObsGeneral=[],listGrupoRiesgoObsGeneral=[],listTipoNotaObsGeneral=[];

var listProyectosId=[],listTipoReportesId=[],listPotencialesPerId=[],
    listSisGestionAsocId=[],listGrupoRiesgoId=[],listTipoNotaId=[];

var mensajeUx;

function toggleMenuOpcionObservacionesFast(obj,pindex){
   objObservacionContratista = listObservacionesContratistaGeneral[pindex];
   indexObservacionContratista = pindex;
   
   verAccionesMejoraObservacionesFast();
}

function ocultarFiltroObservacionesFast(){
   $("#modalFiltroObservacionFast").modal("hide");
}

function verFiltroObservacionesFast(){
   $("#modalFiltroObservacionFast").modal("show");
}

function crearFiltroObservacionesFast(functionCallBack){
   $("#modalFiltroObservacionFast").remove();
    
   var dataParam={
      id: getSession("contratistaGosstId"),
      empresaId: getSession("gestopcompanyid"),
      estadoProyecto: 2
   }; 
  	  		
   callAjaxPost(URL+'/contratista/observaciones/general/filtro',dataParam,function(data){
      listTipoDirigidoObsGeneral = data.listDirigido;
      listTipoPerdidaObsGeneral = data.listPerdida;	
      listTipoReporteObsGeneral = data.listReporte;	
      listTipoProyectoObsGeneral = data.proyectos;
      listGestionesObsGeneral = data.listGestiones;
      listGrupoRiesgoObsGeneral = data.listGrupoRiesgo;
      listTipoNotaObsGeneral = data.tipoNota;
       
      listTipoProyectoObsGeneral.forEach(function(val){
         val.selected = 1;
      });
  	      
      var contenido = "";
    				
      var listContenido=[
    	 {sugerencia:"",label:"Fecha reporte - Inicio",
    	  inputForm:"<input type='date' id='fechaInicioObsGeneral' class='form-control'>"},
    	 {sugerencia:"",label:"Fecha reporte - Fin",
    	  inputForm:"<input type='date' id='fechaFinObsGeneral' class='form-control'>"},
    	 {sugerencia:"",label:"",inputForm:"",divContainer:""},
    	 {sugerencia:"",label:"Proyecto(s) asignado(s)",inputForm:"",
    	  divContainer:"divFiltroProyectoObsGeneral"},
    	 {sugerencia:"",label:"Tipo de reporte",inputForm:"",
    	  divContainer:"divFiltroTipoReporteObsGeneral"},
    	 {sugerencia:"",label:"Potencial de pérdida",inputForm:"",
    	  divContainer:"divFiltroPotencialPerObsGeneral"},
    	 {sugerencia:"",label:"Sistema de gestión asociado",inputForm:"",
          divContainer:"divFiltroSisGestionAsocObsGeneral"},
         {sugerencia:"",label:"Grupo de riesgo",inputForm:"",
          divContainer:"divFiltroGrupoRiesgoObsGeneral"},
    	 {sugerencia:"",label:"Calificación por administrador",inputForm:"",
    	  divContainer:"divFiltroCalificacionAdmObsGeneral"},
    	 {sugerencia:"",label:"",inputForm:"",divContainer:""},
    	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
           		"onclick='ocultarFiltroObservacionesFast()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
    	  inputForm:"<button id='btnAplicarFiltroObservacionesFast' class='btn btn-success' type='submit' " +
    	      		    "onclick='valoresFiltroObservacionesFast()' style='font-size:18px;float:right;'>" +
    	               "<i class='fa fa-filter'></i> Aplicar filtro" +
    	            "</button>"}
      ]; 
    				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
     
      var modalOptionsObsTrab={
   	 id: "modalFiltroObservacionFast",
   	 nombre: "<i class='fa fa-filter'></i> Filtros - Observaciones",
    	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
    				
      crearModalPrincipalUsuario(modalOptionsObsTrab,function(){
  	 if($("#filtroProyectosObsGeneral").length > 0){
  	    return;
  	 }
  	                   
  	 crearSelectOneMenuObligMultipleCompleto("filtroProyectosObsGeneral","",listTipoProyectoObsGeneral,
            "id","titulo","#divFiltroProyectoObsGeneral","Todos");
  	 
  	 crearSelectOneMenuObligMultipleCompleto("filtroTiposReporteObsGeneral","",listTipoReporteObsGeneral,
  	    "id","nombre","#divFiltroTipoReporteObsGeneral","Todos");
  	         
  	 crearSelectOneMenuObligMultipleCompleto("filtroPotencialesPerObsGeneral","",listTipoPerdidaObsGeneral,
  	    "id","nombre","#divFiltroPotencialPerObsGeneral","Todos");
  	 
  	 crearSelectOneMenuObligMultipleCompleto("filtroSisGestionAsocObsGeneral","",listGestionesObsGeneral,
  	    "id","nombre","#divFiltroSisGestionAsocObsGeneral","Todos");
  	
  	 crearSelectOneMenuObligMultipleCompleto("filtroGrupoRiesgoObsGeneral","",listGrupoRiesgoObsGeneral,
  	    "id","nombre","#divFiltroGrupoRiesgoObsGeneral","Todos");
  	         
  	 crearSelectOneMenuObligMultipleCompleto("filtroCalificacionAdmObsGeneral","",listTipoNotaObsGeneral,
  	    "id","nombre","#divFiltroCalificacionAdmObsGeneral","Todos");
      },true,true);
        
      var hoy = getSession("fechaHoyOrdenInversoTexto");
     
      $("#fechaInicioObsGeneral").val(sumaFechaDias(-180,hoy));
      $("#fechaFinObsGeneral").val(hoy);
    				
      $("#btnAplicarFiltroObservacionesFast").on("click",function(){
	 ocultarFiltroObservacionesFast();
      });
    	
      $("#modalFiltroObservacionFast").modal("hide");
      functionCallBack();
   });
}

function valoresFiltroObservacionesFast(){
   listProyectosId = [];
   var proyectoId = $("#filtroProyectosObsGeneral").val(); 

   if(proyectoId != null){
      proyectoId.forEach(function(val){
 	 listProyectosId.push(parseInt(val));
      });
   }
    
   listTipoReportesId = [];
   var tipoReporteId = $("#filtroTiposReporteObsGeneral").val(); 

   if(tipoReporteId != null){
      tipoReporteId.forEach(function(val){
 	 listTipoReportesId.push(parseInt(val));
      });
   }
    
   listPotencialesPerId = [];
   var potencialPerdId = $("#filtroPotencialesPerObsGeneral").val(); 

   if(potencialPerdId != null){
      potencialPerdId.forEach(function(val){
 	 listPotencialesPerId.push(parseInt(val));
      });
   }
    
   listSisGestionAsocId = [];
   var sisGestionAsocId = $("#filtroSisGestionAsocObsGeneral").val(); 

   if(sisGestionAsocId != null){
      sisGestionAsocId.forEach(function(val){
 	 listSisGestionAsocId.push(parseInt(val));
      });
   }
    
   listGrupoRiesgoId = [];
   var grupoRiesgoId = $("#filtroGrupoRiesgoObsGeneral").val(); 

   if(grupoRiesgoId != null){
      grupoRiesgoId.forEach(function(val){
 	 listGrupoRiesgoId.push(parseInt(val));
      });
   }
    
   listTipoNotaId = [];
   var tipoNotaId = $("#filtroCalificacionAdmObsGeneral").val(); 

   if(tipoNotaId != null){
      tipoNotaId.forEach(function(val){
 	 listTipoNotaId.push(parseInt(val));
      });
   }
    
   habilitarObservacionesFast();
}

var numObsAccidente,numObsASubestandar,numObsCSubestandar,numObsEnfermedad,
    numObsIncidente,numObsInspeccion,numObsReconocimiento;

var numObsPorReevaluar,numObsPendiente,numObsObservado,numObsVistoBueno;

function habilitarObservacionesFast(){
//   var textoConfidencial = 
//      "Estimado colaborador:" + 
//      "<br><br>En conformidad con la Ley N° 29783 “Ley de Seguridad y Salud en el trabajo”, el siguiente " +
//      "reporte es de carácter anónimo y los análisis serán confidenciales y evaluados de manera global. " +
//      "Para garantizar ello, el equipo GOSST ha tomado las medidas necesarias para proteger la información " +
//      "que ingresen los colaboradores, no pudiendo relacionarse un reporte particular con un colaborador determinado. " +
//      "Una vez guardada, no quedará un rastro electrónico que permita asociar a los colaboradores con sus reportes. " +
//      "Cualquier duda sobre este aspecto no dude en consultarnos al correo adrian.cox@aswan.pe" + 
//      "<br><br>Muchas gracias por su participación." +
//      "<br><br>GOSST" +
//      "<br><br>Tu Seguridad, Nuestra Cultura." +
//      "<br><br><button class='btn btn-success' onclick='eliminarAvisoObsGosst()'>Esconder aviso</button>";

   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      contratistaIdAux: parseInt(getSession("contratistaGosstId")),
      fechaReporteInicio: $("#fechaInicioObsGeneral").val(),
      fechaReporteFin: $("#fechaFinObsGeneral").val(),
      listProyectosIdFiltro: (listProyectosId.length == 0?null:listProyectosId),
      listTipoReportesIdFiltro: (listTipoReportesId.length == 0?null:listTipoReportesId),
      listPotencialesPerIdFiltro: (listPotencialesPerId.length == 0?null:listPotencialesPerId),
      listSisGestionAsocIdFiltro: (listSisGestionAsocId.length == 0?null:listSisGestionAsocId),
      listGrupoRiesgoIdFiltro: (listGrupoRiesgoId.length == 0?null:listGrupoRiesgoId),
      listTipoNotaIdFiltro: (listTipoNotaId.length == 0?null:listTipoNotaId)
   };
	
   $(".divListPrincipal").html("");
   objObservacionContratista={id:0};
   var listPanelesPrincipal=[];
	
   if(listTipoProyectoObsGeneral.length != 0){
      callAjaxPost(URL+'/contratista/observaciones/general',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
//	       var dataEmpresa = data.empresa;
	       var textIn = "";
	       var textSinAtender="",textAtenderSinRespuesta="",textAtenderConRespuesta="";
	       var numSin=0,numConSinRespuesta=0,numConConRespuesta=0;
	       
	       numObsAccidente = 0,numObsASubestandar = 0,numObsCSubestandar = 0,numObsEnfermedad = 0,
	       numObsIncidente = 0,numObsInspeccion = 0,numObsReconocimiento = 0;
	       
	       numObsPorReevaluar = 0,numObsPendiente = 0,numObsObservado = 0,numObsVistoBueno = 0;
			
	       listObservacionesContratistaGeneral = data.list;
	    
	       var slcTipoDirigidoObs = crearSelectOneMenuOblig("slcTipoDirigidoObs","verAcordeDestinatarioObservacionFast()",
	          listTipoDirigidoObsGeneral,"","id","nombre");
			
	       var slcTipoProyectoObs = crearSelectOneMenuOblig("slcTipoProyectoObs","",
	          listTipoProyectoObsGeneral,"","id","titulo");
			
	       var slcTipoReporteObs = crearSelectOneMenuOblig("slcTipoReporteObs","verAcordeTipoReporteActo()",
	          listTipoReporteObsGeneral,"","id","nombre");
	    
	       var slcTipoPerdidaObs = crearSelectOneMenuOblig("slcTipoPerdidaObs","",
	          listTipoPerdidaObsGeneral,"","id","nombre");
	    
	       var slcTipoGestionObs = crearSelectOneMenu("slcTipoGestionObs","",
	          listGestionesObsGeneral,"","id","nombre");
	    
	       var slcGrupoRiesgoObs = crearSelectOneMenu("slcGrupoRiesgoObs","",
	          listGrupoRiesgoObsGeneral,"","id","nombre");
	    
	       var listItemsExam=[
	          {sugerencia:"",label:"Dirigido a",
		   inputForm:slcTipoDirigidoObs,divContainer:""},
		  {sugerencia:"",label:"Proyecto",
		   inputForm:slcTipoProyectoObs,divContainer:""},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		  {sugerencia:"",label:"Fecha",
		   inputForm:""+obtenerFechaActualNormal()+" "+obtenerHoraActual(),divContainer:""},
		  {sugerencia:"",label:"Reportado por",divContainer:"divReportadoPorObsGen",
		   inputForm:"<input class='form-control' id='inputReportadoPorObsGeneral'>"},
		  {sugerencia:"",label:"Descripción",
		   inputForm:"<input class='form-control' id='inputDescObsGeneral'>"},
		  {sugerencia:"",label:"Acciones inmediatas tomadas",divContainer:"divAccionInmTomObsGen",
		   inputForm:"<textarea class='form-control' id='textAccionInmObsTomadaGeneral' rows='4'></textarea>"},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		  {sugerencia:"",label:"Tipo de reporte",
		   inputForm:slcTipoReporteObs,divContainer:""},
		  {sugerencia:"",label:"Potencial de pérdida",
		   inputForm:slcTipoPerdidaObs,divContainer:"divNivelRiesgo"}, 
		  {sugerencia:"",label:"Sistema de gestión asociado",
		   inputForm:slcTipoGestionObs,divContainer:"divSisGestionAsoObsGen"},
	          {sugerencia:"",label:"Grupo de riesgo",
		   inputForm:slcGrupoRiesgoObs,divContainer:"divGrupoRiesgoObsGen"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
       	          {sugerencia:"",label:"Evidencia",
		   inputForm:"",divContainer:"eviObservacionGeneral"},
       	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
       	          {sugerencia:"",label:"",
       		   inputForm:"<button type='submit' class='btn btn-success'>" +
       			        "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
       			     "</button>"} 
       	       ];
			
	       var textFormExamen = "";
			
	       textFormExamen += "<div class='eventoGeneral'>";
	          listItemsExam.forEach(function(val,index){
	             textFormExamen += obtenerSubPanelModuloVersionDos(val);
	          });
	       textFormExamen += "</div>";
	    
	       var textObsRegistrados="";
	     
	       listObservacionesContratistaGeneral.forEach(function(val,index){
 	          var btnOpcion="",menuOpcion="";
 	        
 	          btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionObservacionesFast(this,"+index+")'>" +
 			         "<i class='fa fa-eye' aria-hidden='true'></i> " +
 			         "Ver Acciones de mejora (" +val.indicadorAcciones+")"+
 			      "</a>" ;
 	       
 	          var colorFondo = (val.nota.id == 1?"#9BBB59":(val.nota.id == 2?"#C0504D":"#DF9226"));
 	        
 	          var listTotal=[
                     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
                      label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
                               "*** OBSERVACIÓN #"+(index+1)+" ***" +
                            "</span>"},
                     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                     {sugerencia:"",
                      label:"<i class='fa fa-folder-o'></i> Proyecto:",
   	              inputForm:val.proyectoNombre},
   	             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
   	             {sugerencia:"",
	              label:"<i class='fa fa-eye'></i> Tipo de observación:",
	              inputForm:val.tipo.nombre},
	             {sugerencia:"",
		      label:"<i class='fa fa-info-circle'></i> Reportado por",
		      inputForm:(val.reportadoPor.length == 0?"------":val.reportadoPor)},
		     {sugerencia:"",
		      label:"<i class='fa fa-calendar'></i> Fecha y hora del reporte:",
		      inputForm:val.fechaTexto+" "+val.horaRealTexto},
		     {sugerencia:"",
	 	      label:"<i class='fa fa-file-text'></i> Descripción:",
	 	      inputForm:val.descripcion},
	 	     {sugerencia:"",
		      label:"<i class='fa fa-book'></i> Acciones inmediatas tomadas:",
		      inputForm:(val.accionInmediataTomada.length == 0?"------":val.accionInmediataTomada)},
		     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		     {sugerencia:"",
		      label:"<i class='fa fa-list-ul'></i> Tipo de reporte:",
		      inputForm:val.reporte.nombre},
		     {sugerencia:"",
	              label:"<i class='fa fa-list-ul'></i> Potencial de pérdida:",
	              inputForm:val.perdida.nombre},
	             {sugerencia:"",
		      label:"<i class='fa fa-list-ul'></i> Sistema de gestión asociado:",
		      inputForm:val.gestion.nombre},
		     {sugerencia:"",
		      label:"<i class='fa fa-list-ul'></i> Grupo de riesgo:",
		      inputForm:val.grupoRiesgo.nombre},
		     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	             {sugerencia:"",
	 	      label:"<i class='fa fa-download'></i> Evidencia",
	 	      inputForm:(val.evidenciaNombre == "----"?val.evidenciaNombre:
	 	                 "<a class='efectoLink' " +
	 	           	    "href='"+URL+"/contratista/observacion/evidencia?observacionId="+val.id+"'>"+
	 	                     val.evidenciaNombre+
	 	                 "</a>")}
	          ];
	       
	          if(val.usuarioCreacion.nombre.length != 0){
	             listTotal.push(
	                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	                {sugerencia:"",label:"<i class='fa fa-calendar'></i> Registrado el ",
	    	         inputForm:val.fechaCreacionTexto+"<br>(Por "+val.usuarioCreacion.nombre+")"});
	               
	                if(val.usuario.nombre.length != 0){
	        	   listTotal.push(
	        	      {sugerencia:"",label:"<i class='fa fa-calendar'></i> Actualizado el ",
	                       inputForm:val.fechaActualizacionTexto+"<br>(Por "+val.usuario.nombre+")"}); 
	                }
	          }
	       
	          listTotal.push(
	             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	              label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
	                       "*** EVALUACIÓN ***" +
	                    "</span>"},
	             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	     {sugerencia:"",
	 	      label:"<i class='fa fa-pencil-square-o'></i> Calificación por administrador:",
	 	      inputForm:val.nota.icono+" "+val.nota.nombre},
	 	     {sugerencia:"",
	 	      label:"<i class='fa fa-pencil-square-o'></i> Observación:",
	 	      inputForm:val.anotacion});
			
		  textObsRegistrados+= "<div class='eventoGeneral' style='border-left:10px solid "+colorFondo+";'>" +
    		                          "<form class='eventoGeneral'>";	   					
		  listTotal.forEach(function(val,index){
	             textObsRegistrados += obtenerSubPanelModuloVersionDos(val);
		  });
                  textObsRegistrados+=    "</form>" +
    		                       "</div>";
                  
                  conteoIndicadoresGraficoObservacionFast(val.reporte.id,val.nota.id);
	       });
	       
	       var btnFiltroAux = 
		  "<button type='button' id='btnFiltroObsFast' class='btn btn-success' " +
		          "style='padding:4px 6px;margin-right:10px' onclick='verFiltroObservacionesFast()' " +
		          "title='Ver valores del filtro para aplicarlo a esta sección.'>" +
		     "<i class='fa fa-filter fa-4x'></i>" +
		  "</button>";
		
	       var btnGraficoAux = 
		  "<button type='button' id='btnGraficoObsFast' class='btn btn-info' " +
		          "style='padding:4px 6px;margin-right:10px' onclick='seleccionarOpcionGraficoObservacionesFast()' " +
		          "title='Elaborar un gráfico con los valores seleccionados.'>" +
		     "<i class='fa fa-bar-chart fa-4x'></i>" +
		     "<i class='fa fa-info-circle fa-2x'></i>" +
		  "</button>";
		
	       listPanelesPrincipal.push(
		  {id: "nuevoMovilObsGeneral",clase:"",styleAux:"display:none",buttonAd:"",
		   btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"Nuevo reporte de observación",
		   contenido:"<form id='formNuevoObsGeneral' class='eventoGeneral'>"+textFormExamen+"</form>"},
		  {id: "infoMovilObservacionesRegistradas",clase:"",styleAux:"",buttonAd:btnFiltroAux+btnGraficoAux,
		   btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"Observaciones registradas ("+listObservacionesContratistaGeneral.length+")",
		   contenido:textObsRegistrados});
			
	       agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
	       verAcordeDestinatarioObservacionFast();
	       verAcordeTipoReporteActo();
	    
	       var options={
	          container: "#eviObservacionGeneral",
	          functionCall: function(){ },
	          descargaUrl: "",
	          esNuevo: true,
	          idAux: "ObsGeneral"+objObservacionContratista.id,
	          evidenciaNombre: ""
	       };
					
	       crearFormEvidenciaCompleta(options);
	    
	       $(".listaGestionGosst").hide();
	       $(".contenidoFormVisible").hide();
	    
	       $('#formNuevoObsGeneral').on('submit',function(e){  
	          e.preventDefault();
	          objObservacionContratista={id:0}
	          guardarObservacionGeneral();
	       });
			 
	       break;
			
            default:
	       alert("nop");
               break;
         }
      });
   }else{
      $(".divListPrincipal").append(
         "<div id='subListCapacitacion'>" +
            "<div class='tituloSubList' style='background:#e8e6e6'>" +
               "No tiene ningún proyecto asignado en curso." +
            "</div>" +
 	 "</div>");
   }
}

function conteoIndicadoresGraficoObservacionFast(reporteIdAux,notaIdAux){
   var reporteId = parseInt(reporteIdAux),notaId = parseInt(notaIdAux);
    
   if(reporteId == 1){
      numObsASubestandar++;
   }else if(reporteId == 2){
      numObsCSubestandar++;
   }else if(reporteId == 3){
      numObsReconocimiento++;
   }else if(reporteId == 4){
      numObsInspeccion++;
   }else if(reporteId == 5){
      numObsAccidente++;
   }else if(reporteId == 6){
      numObsIncidente++;
   }else if(reporteId == 7){
      numObsEnfermedad++;
   }
     
   if(notaId == 1){
      numObsVistoBueno++;
   }else if(notaId == 2){
      numObsObservado++;
   }else if(notaId == 3){
      numObsPendiente++;
   }else if(notaId == 4){
      numObsPorReevaluar++;
   }  
}

function verAcordeDestinatarioObservacionFast(){
   var destinatarioId = parseInt($("#slcTipoDirigidoObs").val());
 	
   if(destinatarioId == 0){
      $("#divReportadoPorObsGen").parent().show();
      $("#divAccionInmTomObsGen").parent().show();
      $("#divSisGestionAsoObsGen").parent().show();
      $("#divGrupoRiesgoObsGen").parent().show();
   }else{
      $("#divReportadoPorObsGen").parent().hide();
      $("#divAccionInmTomObsGen").parent().hide();	
      $("#divSisGestionAsoObsGen").parent().hide();
      $("#divGrupoRiesgoObsGen").parent().hide();
   }
} 

function verAcordeTipoReporteActo(){
   var tipoId = parseInt($("#slcTipoReporteObs").val());
 	
   $("#divNivelRiesgo").parent().show();
 	
   if(tipoId == 3){
      $("#divNivelRiesgo").parent().hide();
   }
} 

function addZero(i) {
   if(i < 10){
      i = "0" + i;
   }
   
   return i;
}

function obtenerHoraActual() {
   var d = new Date(); 
   var h = addZero(d.getHours());
   var m = addZero(d.getMinutes());
   var s = addZero(d.getSeconds());
   return  h + ":" + m + ":" + s;
}

function guardarObservacionGeneral(){
   var formDiv = $("#editarMovilObsGeneral");
	
   if(objObservacionContratista.id == 0){
      formDiv = $("#nuevoMovilObsGeneral");
   }
	
   var campoVacio = true;
   
   var destinatarioId = parseInt($("#slcTipoDirigidoObs").val());
   var descripcion = formDiv.find("#inputDescObsGeneral").val();  
   var fecha = new Date();
   var tipo = parseInt(formDiv.find("#slcTipoReporteObs").val());
   var perdida = (tipo == 3?null:parseInt(formDiv.find("#slcTipoPerdidaObs").val()));
   var proyectoId = parseInt(formDiv.find("#slcTipoProyectoObs").val()); 
   var lugar = formDiv.find("#inputLugarObsGeneral").val();
   var quienId = parseInt(formDiv.find("#slcTipoDirigidoObs").val());
   // null -> obs. asociada al contratista (al ser != null, obs. asociada al cliente).
   var contratistaObj = {id: (quienId == 0?null:getSession("contratistaGosstId"))};
   var nivel = (tipo == 3?2:1);
   var gestionId = (destinatarioId == 1?null:parseInt(formDiv.find("#slcTipoGestionObs").val()));
   var reportadoPor = (destinatarioId == 1?null:formDiv.find("#inputReportadoPorObsGeneral").val());
   var grupoRiesgoId = (destinatarioId == 1?null:parseInt(formDiv.find("#slcGrupoRiesgoObs").val()));
   var accionInmObs = (destinatarioId == 1?null:formDiv.find("#textAccionInmObsTomadaGeneral").val());
   
   var evidenciaNombre = $("#inputEviObsGeneral"+objObservacionContratista.id).val();
	
   if(evidenciaNombre.length == 0){
      campoVacio = false;
   }
	
   if(campoVacio){
      var dataParam={
         id: objObservacionContratista.id,
         proyectoId: proyectoId,
         tipo: {id: 1},
         descripcion: descripcion,
         nivel: nivel,
         fecha: fecha,
         hora: obtenerHoraActual(),
         perdida: {id: perdida},
         reporte: {id: tipo}, 
         grupoRiesgo: {id: grupoRiesgoId},
         lugarOcurrencia: lugar,
         reportadoPor: reportadoPor,
         gestion: {id: gestionId},
         accionInmediataTomada: accionInmObs,
         empresaId: parseInt(getSession("gestopcompanyid")),
         contratistaAsociado: contratistaObj
      };

      callAjaxPost(URL+'/contratista/observacion/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":  
	       guardarEvidenciaAuto(data.nuevoId,"fileEviObsGeneral"+objObservacionContratista.id,
	       bitsEvidenciaAccionMejora,"/contratista/observacion/evidencia/save",function(){
		  mensajeUx = 
	             "<label>La observación se registró con éxito.";
		  
		  if(destinatarioId == 0){
		     mensajeUx += "<br><br>*Se notificó al responsable SST del proyecto y los contactos de la contratista.</label>"; 
		  }else{
		     mensajeUx += "<br><br>*Se notificó al responsable interno y/o responsables secundarios del proyecto.</label>"; 
		  }
		  
  	          mensajesUx(mensajeUx,1,"","ActualizarVistaContratista");
	          
  	          $("#modalMensajeUxActualizarVistaContratista").on("hidden.bs.modal",function(){
	             habilitarObservacionesFast();
  	          });
	       },"observacionId"); 
							
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar!");
         }
      });
   }else{
      mensajeUx = "<label>Debe subir la evidencia respectiva.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

var listAccionesMejoraObsFastFull=[],listTipoAccionesMejoraObsFast=[];
var objObservacionAccMej={};
var indexAccMejObsFast;

var listTipoAccMejObsFast=[
   {id:1,nombre:"Acción correctiva"},
   {id:2,nombre:"Preventiva"},
   {id:3,nombre:"Correctiva"},
   {id:4,nombre:"Mejora"}
];

function toggleMenuOpcionAccionesMejoraObservacionesFast(obj,pindex){
   objObservacionAccMej = listAccionesMejoraObsFastFull[pindex]; 
   indexAccMejObsFast = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesAccionesMejoraObservacionesFast=[
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
    functionClick:function(data){editarAccionMejoraObservacionFast()}},
   {id:"opcElimnar",nombre:"<i class='fa fa-times'></i> Eliminar",
    functionClick:function(data){eliminarAccionesMejoraObservacionesFast()}}
];

function marcarSubOpcionAccionesMejoraObservacionesFast(pindex){
   funcionalidadesAccionesMejoraObservacionesFast[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalObservacionFast(){
   $("#modalConsolidadoAccionMejoraObsFast").modal("hide");
   habilitarObservacionesFast();
}

function verAccionesMejoraObservacionesFast(){
   $("#modalConsolidadoAccionMejoraObsFast").remove();
    
   var listModal={
      id: "modalConsolidadoAccionMejoraObsFast",
      nombre: "Acciones de mejora asociadas a la observación",
      contenido: "<div id='estadoMovilPrincipalAccMejObsFast'></div>"
   };
	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);

   cargarAccionesMejoraObservacionesFast();
}

function cargarAccionesMejoraObservacionesFast(){
   $("#estadoMovilPrincipalAccMejObsFast").html("");
   
   var dataParam={
      observacionId: objObservacionContratista.id,
      accionMejoraTipoId: 0,
   };
   
   var listPanelesPrincipal=[];

   callAjaxPost(URL+'/gestionaccionmejora/accionmejora',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){ 
         listAccionesMejoraObsFastFull = data.list;
         listTipoAccionesMejoraObsFast = data.listTipoAccionMejoraH;
         
         var textTotalRegistrados="";
	  
         listAccionesMejoraObsFastFull.forEach(function(val,index){
            var btnOpcion="",menuOpcion="";
            
            if(objObservacionContratista.nota.id != 1){
               menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
	          funcionalidadesAccionesMejoraObservacionesFast.forEach(function(val1,index1){
                     menuOpcion += 
                        "<li class='list-group-item' onclick='marcarSubOpcionAccionesMejoraObservacionesFast("+index1+")'>" +
		            val1.nombre+
		        "</li>";
	          });
	       menuOpcion += "</ul>";
			
	       btnOpcion = 
                  "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionAccionesMejoraObservacionesFast(this,"+index+")'>" +
	             "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
	          "</a>" ;
            }
            
            var tipoAccionMejoraNombre = 
               (val.accionMejoraTipoId == 1?"Acción correctiva":(val.accionMejoraTipoId == 2?"Preventiva":
        	(val.accionMejoraTipoId == 3?"Correctiva":(val.accionMejoraTipoId == 4?"Mejora":"------"))));
            
            var listTotal=[
	       {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
                label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
                         "*** ACCIÓN DE MEJORA #"+(index+1)+" ***" +
                      "</span>"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",
		label:"<i class='fa fa-info'></i> Descripción:",
		inputForm:val.descripcion},
	       {sugerencia:"",
		label:"<i class='fa fa-list-ul'></i> Tipo:",
		inputForm:tipoAccionMejoraNombre},
	       {sugerencia:"",
		label:"<i class='fa fa-calendar'></i> Fecha realizada:",
		inputForm:(val.fechaRealTexto.length == 0?"------":val.fechaRealTexto)},
	       {sugerencia:"",
		label:"<i class='fa fa-eye'></i> Observación del contratista:",
		inputForm:val.observacion},
	       {sugerencia:"",
                label:"<i class='fa fa-download'></i> Evidencia",
		inputForm:(val.evidenciaNombre == "----"?val.evidenciaNombre:
		 	   "<a class='efectoLink' target='_blank' " +
		 	      "href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.accionMejoraId+"'>"+
		 	       val.evidenciaNombre+
		 	   "</a>"+
		 	   (val.fechaRealTexto.length == 0?"":"<br>(Registrado el "+val.fechaRealTexto+")"))}
	    ]; 
            
            if(val.respuesta.length != 0){
               listTotal.push(
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                  {sugerencia:"",label:"<i class='fa fa-pencil-square-o'></i> Respuesta del cliente:",
                   inputForm:val.respuesta});
            }
            
            if(val.registradoPor.length != 0){
               listTotal.push(
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                  {sugerencia:"",label:"<i class='fa fa-calendar'></i> Registrado el ",
    		   inputForm:val.fechaRegistroTexto+"<br>(Por "+val.registradoPor+")"});
               
               if(val.actualizadoPor.length != 0){
        	  listTotal.push(
        	     {sugerencia:"",label:"<i class='fa fa-calendar'></i> Actualizado el ",
                      inputForm:val.fechaActualizacionTexto+"<br>(Por "+val.registradoPor+")"}); 
               }
            }
			
            textTotalRegistrados+= "<div class='eventoGeneral'>" +
 		                      "<form class='eventoGeneral'>";	   					
            listTotal.forEach(function(val,index){
               textTotalRegistrados += obtenerSubPanelModuloVersionDos(val);
            });
            textTotalRegistrados+=    "</form>" +
 	                           "</div>";
         });
         
         var textRegresarAccionMej =
            "<div id='estadoMovilRegresarVistaPrincipalObsFast'>" +
               "<div class='tituloSubList'> Volver a la vista principal" +
                  "<button style='font-size:19px' title='Regresar a la vista principal de la sección.' " +
                          "class='btn btn-info' onclick='regresarVistaPrincipalObservacionFast()'>"+
                     "<i class='fa fa-sign-out fa-rotate-180'></i> Regresar" +
                  "</button>" +
               "</div>" +
            "</div>";
         
         $("#estadoMovilPrincipalAccMejObsFast").append(textRegresarAccionMej);
         
         if(objObservacionContratista.nota.id != 1){
            var textNuevaAccionMej =
               "<div id='estadoMovilNuevoRegistroAccMejObsFast'>" +
                  "<div class='tituloSubList'> Nueva acción de mejora " +
                     "<button style='font-size:19px' title='Registrar nuevo acción de mejora.' " +
                             "class='btn btn-success' onclick='registrarNuevaAccionMejoraObservacionFast()'>"+
                        "<i class='fa fa-plus-square'></i> Registrar" +
                     "</button>" +
                  "</div>" +
               "</div>";
         
            $("#estadoMovilPrincipalAccMejObsFast").append(textNuevaAccionMej);
         }
         
         listPanelesPrincipal.push(
  	    {id: "infoMovilAccionesMejoraObsRegistradas",clase:"",styleAux:"",buttonAd:"",
  	     nombre: "Acciones de mejora registradas ("+listAccionesMejoraObsFastFull.length+")",
  	     contenido: textTotalRegistrados});
         
         agregarPanelesDivPrincipalModalVersionDos(listPanelesPrincipal,"estadoMovilPrincipalAccMejObsFast");
         
         $(".listaFinalGestionGosst").hide();
	 $(".contenidoFormVisible").hide();
      }else{
         console.log("NOPNPO")
      }
   });   
}

function registrarNuevaAccionMejoraObservacionFast(){
   objObservacionAccMej = {accionMejoraId: 0,accionMejoraTipoId: -1}; 
    
   editarAccionMejoraObservacionFast();
}

function ocultarEditarAccionMejoraObservacionFast(){
   $("#modalEditarAccionMejoraObsFast").modal("hide");
   $("#modalConsolidadoAccionMejoraObsFast").modal("show");
}

function editarAccionMejoraObservacionFast(){
   $("#modalConsolidadoAccionMejoraObsFast").modal("hide");
   $("#modalEditarDocumentoSctrVis").remove();
   
   var selTipoAccMej = crearSelectOneMenu("selTipoAccMej","",
      listTipoAccMejObsFast,objObservacionAccMej.accionMejoraTipoId,"id","nombre");
    
   var listItemsRegistro=[
      {sugerencia:"",label:"Descripción",anchoLabel:"",anchoDiv:"",
       inputForm:"<input class='form-control' id='inputAccionMejObsFast'>"},
      {sugerencia:"",label:"Tipo acción de mejora",anchoLabel:"",anchoDiv:"",
       inputForm:selTipoAccMej},
      {sugerencia:"",label:"Fecha realizada",anchoLabel:"",anchoDiv:"",
       inputForm:"<input type='date' id='inputFechaRealizadaObsFast' class='form-control'>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"<label>*Ej: El incidente fue causado por un peatón, fue un evento fortuito.</label>",
       label:"Observación del contratista*",anchoLabel:"",anchoDiv:"",
       inputForm:"<textarea rows='3' class='form-control' id='textObsContratistaObsFast'></textarea>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia",
       inputForm:"",divContainer:"divEvidenciaAccMejObsFast"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
	             "onclick='ocultarEditarAccionMejoraObservacionFast()'>" +
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
      id: "modalEditarAccionMejoraObsFast",
      nombre: (objObservacionAccMej.accionMejoraId > 0?"Editar":"Nuevo")+" - Acción de mejora",
      contenido: "<form id='formEditarAccionMejObsFast' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
     
   crearModalPrincipalUsuario(opciones,function(){},true,true);
    	
   var editarDiv = $("#formEditarAccionMejObsFast");
   
   if(objObservacionAccMej.accionMejoraId > 0){
      editarDiv.find("#inputAccionMejObsFast").val(objObservacionAccMej.descripcion);
      editarDiv.find("#inputFechaRealizadaObsFast").val(convertirFechaInput(objObservacionAccMej.fechaRevision));
      editarDiv.find("#textObsContratistaObsFast").val(objObservacionAccMej.observacion);
   }
  	
   var options={
      container: "#divEvidenciaAccMejObsFast",
      functionCall: function(){},
      descargaUrl: (objObservacionAccMej.accionMejoraId == 0?"":
                    "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+objObservacionAccMej.accionMejoraId),
      esNuevo: (objObservacionAccMej.accionMejoraId == 0),
      idAux: "AccMejObsFast",
      evidenciaNombre: (objObservacionAccMej.accionMejoraId == 0 || objObservacionAccMej.evidenciaNombre == "----"?
	                "":objObservacionAccMej.evidenciaNombre),
      mensajeAux: ""
   };

   crearFormEvidenciaCompleta(options);
    
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarAccionMejoraObservacionFast();
   });
}

function eliminarAccionesMejoraObservacionesFast(){
   $("#modalConsolidadoAccionMejoraObsFast").modal("hide");
    
   mensajeUx="<label>¿Está seguro de eliminar esta acción de mejora?</label>";
   mensajesUx(mensajeUx,3,"","EliminarAccMejObsFast");

   $("#btnDevolverValorEliminarAccMejObsFast").on("click",function(){
      var dataParam={
         accionMejoraId: objObservacionAccMej.accionMejoraId
      };

      callAjaxPost(URL+'/gestionaccionmejora/accionmejora/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
  	    case "05":
  	       mensajeUx="<label>La acción de mejora fue eliminada con éxito.</label>";
  	       mensajesUx(mensajeUx,1,"","EliminarAccMejObsFastAviso");
  		
  	       $("#modalMensajeUxEliminarAccMejObsFastAviso").on("hidden.bs.modal",function(){
  		  $("#modalConsolidadoAccionMejoraObsFast").modal("show");
   	          cargarAccionesMejoraObservacionesFast();     
  	       });
  		
  	       break;
  		
  	    default:
  	       alert("Ocurrió un error al eliminar la acción de mejora!");
         }
      });
   });
    
   $("#btnRegresarPrevioEliminarAccMejObsFast").on("click",function(){
      $("#modalConsolidadoAccionMejoraObsFast").modal("show");
   });      
}

function guardarAccionMejoraObservacionFast(){
   var campoVacio = true;
   
   var descripcion = $("#inputAccionMejObsFast").val();
   var selTipoAccMejId = parseInt($("#selTipoAccMej").val());
  
   var fechaRealizado = convertirFechaTexto($("#inputFechaRealizadaObsFast").val());
   var inputFechaRealizado;

   if(!fechaRealizado){
      inputFechaRealizado = null;
   }else{
      inputFechaRealizado = fechaRealizado;
   }
   
   var observacion = $("#textObsContratistaObsFast").val();
   var nombreEvidencia = $("#inputEviAccMejObsFast").val();
	
   if(descripcion.length == 0 || selTipoAccMejId == -1 || nombreEvidencia.length == 0 || inputFechaRealizado == null ||
      observacion.length == 0){
      campoVacio = false; 
   }
   
   if(campoVacio){
      if(objObservacionAccMej.accionMejoraId > 0){
	 hallarEstadoImplementacionAccMejObservacionFast();
      }else{
         objObservacionAccMej.accionEstado = null;
      }
      
      var dataParam={
	 accionMejoraId: objObservacionAccMej.accionMejoraId,
	 observacion: observacion,
	 descripcion: descripcion,
	 fechaRevision: inputFechaRealizado,
	 fechaReal: inputFechaRealizado,
	 responsableNombre: "Contratista: "+getSession("gestopusername"),
	 responsableMail: "@asd",
	 accionMejoraTipoId: selTipoAccMejId,
	 companyId: getSession("gestopcompanyid"),
	 observacionId: objObservacionContratista.id
      };
      
      if(objObservacionAccMej.accionMejoraId > 0){
	 dataParam.fechaReal = inputFechaRealizado;
	 dataParam.estadoId = objObservacionAccMej.accionEstado;
      }else{
	 dataParam.fechaReal = inputFechaRealizado;
	 dataParam.fechaRevision = inputFechaRealizado;
      }
		 
      callAjaxPost(URL+'/gestionaccionmejora/accionmejora/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":  
	       guardarEvidenciaAuto(data.nuevoId,"fileEviAccMejObsFast",bitsEvidenciaAccionMejora,
	       "/gestionaccionmejora/accionmejora_realizado/evidencia/save",function(){
		  $("#modalEditarAccionMejoraObsFast").modal("hide");
		   
	          mensajeUx="<label>Los datos de la acción de mejora asociada a la observación " +
	                    "fueron guardados con éxito.</label>";
	          mensajesUx(mensajeUx,1,"","ActualizarSeccionRepObsVistaCon");
		    
	          $("#modalMensajeUxActualizarSeccionRepObsVistaCon").on("hidden.bs.modal",function(){
	             $("#modalConsolidadoAccionMejoraObsFast").modal("show");
		     cargarAccionesMejoraObservacionesFast();
	          });
	       },"accionMejoraId"); 
								
	       break;
							
            default:
	       console.log("Ocurrió un error al guardar!");
         }
      });
   }else{
      $("#modalEditarAccionMejoraObsFast").modal("hide");
       
      mensajeUx="<label>Debe completar todos los campos activos.</label>";  
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
 	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarAccionMejoraObsFast").modal("show");    
      }); 
   }
}

function hallarEstadoImplementacionAccMejObservacionFast(){
   var fechaPlanificada = $("#inputFechaRealizadaObsFast").val();
   var fechaReal = convertirFechaInput(objObservacionAccMej.fechaReal);
   var fechaHoy = obtenerFechaActual();
 	
   if(fechaReal != ''){
      objObservacionAccMej.accionEstado = 2;
      objObservacionAccMej.accionEstadoNombre = "COMPLETADO";
   }else{
      if(fechaPlanificada != ""){
         var dif = restaFechas(fechaHoy,fechaPlanificada);
 		
         if(dif < 0){
            objObservacionAccMej.accionEstado = 3;
            objObservacionAccMej.accionEstadoNombre = "RETRASADO";
         }else{
 	    objObservacionAccMej.accionEstado = 1;
 	    objObservacionAccMej.accionEstadoNombre = "EN PROCESO";
         }
      }else{
         objObservacionAccMej.accionEstado = 1;
         objObservacionAccMej.accionEstadoNombre = "EN PROCESO";
      }
   }	
}

var listOpcionesGraficoObsFast=[
   {id:1,nombre:"Por tipo de reporte"},
   {id:2,nombre:"Por calificación del administrador"}
];

function ocultarSeleccionarOpcionGraficoObservacionesFast(){
   $("#modalSelOpcionGraficoObsFast").modal("hide");
}

function seleccionarOpcionGraficoObservacionesFast(){
   $("#modalSelOpcionGraficoObsFast").remove();
   
   var selOpcionGraficoObsFast = crearSelectOneMenuOblig("selOpcionGraficoObsFast","",
      listOpcionesGraficoObsFast,"","id","nombre");
     
   var contenido = "";
  
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Gráfico",inputForm:selOpcionGraficoObsFast},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	             "onclick='ocultarSeleccionarOpcionGraficoObservacionesFast()'>" +
    	        "<i class='fa fa-times'></i> Cancelar" +
    	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		 "onclick='redireccionarGraficoObservacionesFast()'>" +
    	            "<i class='fa fa-check'></i> Aceptar" +
    	         "</button>"}
   ];
    	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    	
   var modalOptions={
      id: "modalSelOpcionGraficoObsFast",
      nombre: "<i class='fa fa-list-ul'></i> Debe seleccionar una de las opciones",
      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   };
    	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
        
   $("#modalSelOpcionGraficoObsFast").modal("show");
}

function redireccionarGraficoObservacionesFast(){
   $("#modalSelOpcionGraficoObsFast").modal("hide");
   
   var opcionId = parseInt($("#selOpcionGraficoObsFast").val());
  
   if(opcionId == 1){
      verGraficoTipoReporteObservacionesFast();
   }else if(opcionId == 2){
      verGraficoCalificacionAdminObservacionesFast(); 
   }
}

function verGraficoTipoReporteObservacionesFast(){
   $("#modalGraficoTipoReporteObsFast").remove();
     
   var modalOptions={
      id: "modalGraficoTipoReporteObsFast",
      maxWidth: "90%",
      nombre: "Gráfico Observaciones - Por tipo de reporte ",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoTipoReporteObsFast'></div>"
   };
 	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoTipoReporteObsFast",190);
 	 	
   Highcharts.chart('divGraficoTipoReporteObsFast',{
      chart: {type: 'column'},
      title: {
	 text: "Gráfico Observaciones - Por tipo de reporte",
	 style: {fontWeight: 'bold',fontSize: '20px'}},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de observaciones",
 	    style: {fontWeight: 'bold',fontSize: '18px'}}},
      plotOptions: {
 	 column: {
            dataLabels: {
               enabled: true,color: 'black',style: {fontSize: '25px'}},
 	    enableMouseTracking: false}},
      series: [
         {name: "Accidente",data: [numObsAccidente]},
	 {name: "Acto Subestándar",data: [numObsASubestandar]},
 	 {name: "Condición Subestándar",data: [numObsCSubestandar]},
 	 {name: "Enfermedad",data: [numObsEnfermedad]},
 	 {name: "Incidente",data: [numObsIncidente]},
 	 {name: "Inspección",data: [numObsInspeccion]},
 	 {name: "Reconocimento",data: [numObsReconocimiento]}]
   }); 
}

function verGraficoCalificacionAdminObservacionesFast(){
   $("#modalGraficoCalifAdminObsFast").remove();
     
   var modalOptions={
      id: "modalGraficoCalifAdminObsFast",
      maxWidth: "90%",
      nombre: "Gráfico Observaciones - Por calificación del administrador ",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoCalifAdminObsFast'></div>"
   };
 	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoCalifAdminObsFast",190);
 	 	
   Highcharts.chart('divGraficoCalifAdminObsFast',{
      chart: {type: 'column'},
      title: {
	 text: "Gráfico Observaciones - Por calificación del administrador",
	 style: {fontWeight: 'bold',fontSize: '20px'}},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de observaciones",
 	    style: {fontWeight: 'bold',fontSize: '18px'}}},
      plotOptions: {
 	 column: {
            dataLabels: {
               enabled: true,color: 'black',style: {fontSize: '25px'}},
 	    enableMouseTracking: false}},
      series: [
         {name: "Por re-evaluar",data: [numObsPorReevaluar],color: '#DF9226'},
	 {name: "Pendiente",data: [numObsPendiente],color: '#DF9226'},
 	 {name: "Observado",data: [numObsObservado],color: '#C0504D'},
 	 {name: "Visto bueno",data: [numObsVistoBueno],color: '#9BBB59'}]
   }); 
}
