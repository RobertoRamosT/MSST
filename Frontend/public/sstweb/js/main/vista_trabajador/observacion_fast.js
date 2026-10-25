var objObservacionTrabajador={};
var indexObservacionTrabajador;
var listFullObservacionTrabajador; 
var listTipoPerdidaObsTrab;
var listTipoReporteObsTrab;
var listTipoProyectoObsTrab;
var listGestionesObsTrab=[],listGrupoRiesgoObsTrab=[],listTipoNotaObsTrab=[],
    listResponsablesObsTrab=[];;
var listProyectosId=[],listTipoReportesId=[],listPotencialesPerId=[],
    listSisGestionAsocId=[],listGrupoRiesgoId=[],listTipoNotaId=[],
    listResponsablesId=[],listRespCorreosAux=[];
var mensajeUx;

function toggleMenuOpcionObsFastTrabajador(obj,pindex){
   objObservacionTrabajador = listFullObservacionTrabajador[pindex];
   indexObservacionTrabajador = pindex;
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul")
	    .hide();	
}

var funcionalidadesObsFastTrab=[ 
   {id:"opcVerAcciones",nombre:"<i class='fa fa-eye'></i> Ver Acciones de mejora",
    functionClick:function(data){verAccionesMejoraObservacionesFast();}},
   {id:"opcCalificarObs",nombre:"<i class='fa fa-pencil-square-o'></i> Calificar observación",
    functionClick:function(data){calificarObservacionesFast()}}
];

function marcarSubOpcionObsFastTrab(pindex){
   funcionalidadesObsFastTrab[pindex].functionClick();
   
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

//var escondioAvisoObs = true;
//
//function eliminarAvisoObsGosst(){
//   $(".gosst-aviso").remove();
//   escondioAvisoObs = true;
//}

function ocultarFiltroObservacionesColaborador(){
   $("#modalFiltroObsColaborador").modal("hide");
}

function verFiltroObservacionesColaborador(){
   $("#modalFiltroObsColaborador").modal("show");
}

function crearFiltroObservacionesColaborador(functionCallBack){
   $("#modalFiltroObsColaborador").remove();
    
   var dataParam={
      trabajadorId: parseInt(getSession("trabajadorGosstId")),
      empresaId: parseInt(getSession("gestopcompanyid"))
   }; 
 	  		
   callAjaxPost(URL+'/contratista/colaborador/observaciones/filtro',dataParam,function(data){
      listTipoPerdidaObsTrab = data.listPerdida;listTipoReporteObsTrab = data.listReporte;	
      listTipoProyectoObsTrab = data.proyectos;listGestionesObsTrab = data.listGestiones;
      listGrupoRiesgoObsTrab = data.listGrupoRiesgo;listTipoNotaObsTrab = data.tipoNota;
//      listResponsablesObsTrab = data.listResponsables;
      
      listTipoProyectoObsTrab.forEach(function(val){
         val.selected = 1;
      });
      
      var contenido = "";
   				
      var listContenido=[
   	 {sugerencia:"",label:"Fecha reporte - Inicio",
   	  inputForm:"<input type='date' id='fechaInicioObsTrab' class='form-control'>"},
   	 {sugerencia:"",label:"Fecha reporte - Fin",
   	  inputForm:"<input type='date' id='fechaFinObsTrab' class='form-control'>"},
   	 {sugerencia:"",label:"",inputForm:"",divContainer:""},
   	 {sugerencia:"",label:"Proyecto(s) a cargo",inputForm:"",
   	  divContainer:"divFiltroProyectoObsTrab"},
   	 {sugerencia:"",label:"Tipo de reporte",inputForm:"",
   	  divContainer:"divFiltroTipoReporteObsTrab"},
   	 {sugerencia:"",label:"Potencial de pérdida",inputForm:"",
   	  divContainer:"divFiltroPotencialPerObsTrab"},
   	 {sugerencia:"",label:"Sistema de gestión asociado",inputForm:"",
          divContainer:"divFiltroSisGestionAsocObsTrab"},
         {sugerencia:"",label:"Grupo de riesgo",inputForm:"",
          divContainer:"divFiltroGrupoRiesgoObsTrab"},
   	 {sugerencia:"",label:"Calificación por administrador",inputForm:"",
   	  divContainer:"divFiltroCalificacionAdmObsTrab"},
   	 {sugerencia:"",label:"",inputForm:"",divContainer:""},
   	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		"onclick='ocultarFiltroObservacionesColaborador()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
                	"</button>",
   	  inputForm:"<button id='btnAplicarFiltroObsColaborador' class='btn btn-success' type='submit' " +
   	      		    "onclick='valoresFiltroObservacionesColaborador()' style='font-size:18px;float:right;'>" +
   	               "<i class='fa fa-filter'></i> Aplicar filtro" +
   	            "</button>"}
      ]; 
   				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
    
      var modalOptionsObsTrab={
  	 id: "modalFiltroObsColaborador",
  	 nombre: "<i class='fa fa-filter'></i> Filtros - Observaciones",
   	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
   				
      crearModalPrincipalUsuario(modalOptionsObsTrab,function(){
 	 if($("#filtroProyectosObsTrab").length > 0){
 	    return;
 	 }
 	                   
 	 crearSelectOneMenuObligMultipleCompleto("filtroProyectosObsTrab","",listTipoProyectoObsTrab,
            "id","titulo","#divFiltroProyectoObsTrab","Todos");
 	 
 	 crearSelectOneMenuObligMultipleCompleto("filtroTiposReporteObsTrab","",listTipoReporteObsTrab,
 	    "id","nombre","#divFiltroTipoReporteObsTrab","Todos");
 	         
 	 crearSelectOneMenuObligMultipleCompleto("filtroPotencialesPerObsTrab","",listTipoPerdidaObsTrab,
 	    "id","nombre","#divFiltroPotencialPerObsTrab","Todos");
 	 
 	 crearSelectOneMenuObligMultipleCompleto("filtroSisGestionAsocObsTrab","",listGestionesObsTrab,
 	    "id","nombre","#divFiltroSisGestionAsocObsTrab","Todos");
 	
 	 crearSelectOneMenuObligMultipleCompleto("filtroGrupoRiesgoObsTrab","",listGrupoRiesgoObsTrab,
 	    "id","nombre","#divFiltroGrupoRiesgoObsTrab","Todos");
 	         
 	 crearSelectOneMenuObligMultipleCompleto("filtroCalificacionAdmObsTrab","",listTipoNotaObsTrab,
 	    "id","nombre","#divFiltroCalificacionAdmObsTrab","Todos");
      },true,true);
       
      var hoy = getSession("fechaHoyOrdenInversoTexto");
    
      $("#fechaInicioObsTrab").val(sumaFechaDias(-365,hoy));
      $("#fechaFinObsTrab").val(sumaFechaDias(365,hoy));
   				
      functionCallBack();
   });
}

function valoresFiltroObservacionesColaborador(){
   ocultarFiltroObservacionesColaborador();
    
   listProyectosId = [];
   var proyectoId = $("#filtroProyectosObsTrab").val(); 

   if(proyectoId != null){
      proyectoId.forEach(function(val){
	 listProyectosId.push(parseInt(val));
      });
   }
   
   listTipoReportesId = [];
   var tipoReporteId = $("#filtroTiposReporteObsTrab").val(); 

   if(tipoReporteId != null){
      tipoReporteId.forEach(function(val){
	 listTipoReportesId.push(parseInt(val));
      });
   }
   
   listPotencialesPerId = [];
   var potencialPerdId = $("#filtroPotencialesPerObsTrab").val(); 

   if(potencialPerdId != null){
      potencialPerdId.forEach(function(val){
	 listPotencialesPerId.push(parseInt(val));
      });
   }
   
   listSisGestionAsocId = [];
   var sisGestionAsocId = $("#filtroSisGestionAsocObsTrab").val(); 

   if(sisGestionAsocId != null){
      sisGestionAsocId.forEach(function(val){
	 listSisGestionAsocId.push(parseInt(val));
      });
   }
   
   listGrupoRiesgoId = [];
   var grupoRiesgoId = $("#filtroGrupoRiesgoObsTrab").val(); 

   if(grupoRiesgoId != null){
      grupoRiesgoId.forEach(function(val){
	 listGrupoRiesgoId.push(parseInt(val));
      });
   }
   
   listTipoNotaId = [];
   var tipoNotaId = $("#filtroCalificacionAdmObsTrab").val(); 

   if(tipoNotaId != null){
      tipoNotaId.forEach(function(val){
	 listTipoNotaId.push(parseInt(val));
      });
   }
   
   habilitarObservacionesColaborador();
}

var numObsAccidente,numObsASubestandar,numObsCSubestandar,numObsEnfermedad,
    numObsIncidente,numObsInspeccion,numObsReconocimiento;

var numObsPorReevaluar,numObsPendiente,numObsObservado,numObsVistoBueno;

function habilitarObservacionesColaborador(){
//   var textoConfidencial =
//      "Estimado colaborador: " + 
//      "<br><br>En conformidad con la Ley N° 29783 “Ley de Seguridad y Salud en el trabajo”, el siguiente " +
//              "reporte es de carácter anónimo y los análisis serán confidenciales y evaluados de manera global. " +
//              "Para garantizar ello, el equipo GOSST ha tomado las medidas necesarias para proteger la información " +
//              "que ingresen los colaboradores, no pudiendo relacionarse un reporte particular con un colaborador " +
//              "determinado. Una vez guardada, no quedará un rastro electrónico que permita asociar a los " +
//              "colaboradores con sus reportes. Cualquier duda sobre este aspecto no dude en consultarnos al " +
//              "correo adrian.cox@aswan.pe" +
//      "<br><br>Muchas gracias por su participación." +
//      "<br><br>GOSST" +
//      "<br><br>Tu Seguridad, Nuestra Cultura." +
//      "<br><br><button class='btn btn-success' onclick='eliminarAvisoObsGosst()'>Esconder aviso</button>";
//	
//   $(".gosst-aviso").remove();
//
//   if(!escondioAvisoObs){
//      $(".divTituloFull").append("<div class='gosst-aviso'>"+textoConfidencial+"</div>"); 
//   }

   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      trabajadorId: parseInt(getSession("trabajadorGosstId")),
      fechaReporteInicio: $("#fechaInicioObsTrab").val(),
      fechaReporteFin: $("#fechaFinObsTrab").val(),
      listProyectosIdFiltro: (listProyectosId.length == 0?null:listProyectosId),
      listTipoReportesIdFiltro: (listTipoReportesId.length == 0?null:listTipoReportesId),
      listPotencialesPerIdFiltro: (listPotencialesPerId.length == 0?null:listPotencialesPerId),
      listSisGestionAsocIdFiltro: (listSisGestionAsocId.length == 0?null:listSisGestionAsocId),
      listGrupoRiesgoIdFiltro: (listGrupoRiesgoId.length == 0?null:listGrupoRiesgoId),
      listTipoNotaIdFiltro: (listTipoNotaId.length == 0?null:listTipoNotaId)
   };
	
   $(".divListPrincipal").html("");
   objObservacionTrabajador={id:0};
   var listPanelesPrincipal=[];
   
   if(listTipoProyectoObsTrab.length != 0){
      callAjaxPost(URL+'/contratista/colaborador/observaciones',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":	
 	       numObsAccidente = 0,numObsASubestandar = 0,numObsCSubestandar = 0,numObsEnfermedad = 0,
 	       numObsIncidente = 0,numObsInspeccion = 0,numObsReconocimiento = 0;
 	       
 	       numObsPorReevaluar = 0,numObsPendiente = 0,numObsObservado = 0,numObsVistoBueno = 0;
 			
	       listFullObservacionTrabajador = data.list;
	    
	       var listContratistaProyectoObs=[];var listIdContratista=[];
			
	       listTipoProyectoObsTrab.forEach(function(val){
	          if(listIdContratista.indexOf(val.contratistaId) == -1){
		     listIdContratista.push(val.contratistaId);
		     listContratistaProyectoObs.push({
		        id: val.contratistaId,
		        nombre: val.contratistaNombre});
	          }
	       });
			
	       var slcContratistaProyectoObs = crearSelectOneMenuOblig("slcContratistaProyectoObs",
	          "verAcordeContratistaObsColab()",listContratistaProyectoObs,"","id","nombre");
			
	       var slcTipoProyectoObs = crearSelectOneMenuOblig("slcTipoProyectoObs","",
	          listTipoProyectoObsTrab,"","id","titulo");
			
	       var slcTipoReporteObs = crearSelectOneMenuOblig("slcTipoReporteObs",
	          "verAcordeTipoReporteActo()",listTipoReporteObsTrab,"","id","nombre");
	    
	       var slcTipoGestionObs = crearSelectOneMenu("slcTipoGestionObs","",
	          listGestionesObsTrab,"","id","nombre");
			
	       var slcTipoPerdidaObs = crearSelectOneMenuOblig("slcTipoPerdidaObs","",
	          listTipoPerdidaObsTrab,"","id","nombre");
	    
	       var slcGrupoRiesgoObs = crearSelectOneMenu("slcGrupoRiesgoObs","",
	          listGrupoRiesgoObsTrab,"","id","nombre");
	    
	       var listItemsExam=[  
	          {sugerencia:"",label:"Contratista",
		   inputForm:slcContratistaProyectoObs,divContainer:""},
	          {sugerencia:"",label:"Proyecto",
		   inputForm:slcTipoProyectoObs,divContainer:"divProyectoObsColab"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	          {sugerencia:"",label:"Fecha reporte",
	           inputForm:""+obtenerFechaActualNormal()+" "+obtenerHoraActual(),divContainer:""},
	          {sugerencia:"",label:"Reportado por",
		   inputForm:"<input class='form-control' id='inputReportadoPorObsTrab'>"},
	          {sugerencia:"",label:"Descripción",
		   inputForm:"<input class='form-control' id='inputDescObsTrab'>"},
	          {sugerencia:"",label:"Acciones inmediatas tomadas",
		   inputForm:"<textarea class='form-control' id='textAccionInmObsTomadaTrab' rows='4'></textarea>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	          {sugerencia:"",label:"Tipo de reporte",
		   inputForm:slcTipoReporteObs,divContainer:""},
	          {sugerencia:"",label:"Potencial de pérdida",
	           inputForm:slcTipoPerdidaObs,divContainer:"divNivelRiesgo"},
	          {sugerencia:"",label:"Sistema de gestión asociado",
		   inputForm:slcTipoGestionObs,divContainer:""},
	          {sugerencia:"",label:"Grupo de riesgo",
		   inputForm:slcGrupoRiesgoObs,divContainer:""},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
       	          {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"eviObservacionTrabajador"},
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
	     
	       listFullObservacionTrabajador.forEach(function(val,index){
 	          var btnOpcion="",menuOpcion="";
 	        
 	          menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
 	             funcionalidadesObsFastTrab.forEach(function(val1,index1){
 	                if(index1 == 0){ 
		           menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionObsFastTrab("+index1+")'>" +
				             val1.nombre+" (" +val.indicadorAcciones+")" +
				         "</li>";
 	                }else if(val.nota.id != 1){
 	                   menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionObsFastTrab("+index1+")'>" +
			                     val1.nombre +
			                 "</li>";    
 	                }
 	             });	    
 	          menuOpcion += "</ul>";
				    
 	          btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionObsFastTrabajador(this,"+index+")'>" +
			         "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			      "</a>";
	          
 	          var colorFondo = (val.nota.id == 1?"#9BBB59":(val.nota.id == 2?"#C0504D":"#df9226"));
 	        
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
		  "<button type='button' id='btnFiltroObsTrab' class='btn btn-success' " +
		          "style='padding:4px 6px;margin-right:10px' onclick='verFiltroObservacionesColaborador()' " +
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
	          {id:"nuevoMovilObsTrab",clase:"",styleAux:"display:none",buttonAd:"",
		   btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"Nueva reporte de observación",
		   contenido:"<form id='formNuevoObsTrab' class='eventoGeneral'>"+textFormExamen+"</form>"},
		  {id: "infoMovilObservacionesRegistradasTrab",clase:"",styleAux:"",buttonAd:btnFiltroAux+btnGraficoAux,
	           btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"Observaciones registradas ("+listFullObservacionTrabajador.length+")",
	           contenido:textObsRegistrados});
			
	       agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
	       verAcordeContratistaObsColab();
	       verAcordeTipoReporteActo();
			
	       var options={
	          container: "#eviObservacionTrabajador",
	          functionCall: function(){},
	          descargaUrl: "",
	          esNuevo: true,
	          idAux: "ObsTrabajador"+objObservacionTrabajador.id,
	          evidenciaNombre: ""
	       };
			
	       crearFormEvidenciaCompleta(options);
			
	       $(".listaFinalGestionGosst").hide();
	       $(".contenidoFormVisible").hide();
			 
	       $('#formNuevoObsTrab').on('submit',function(e){  
	          e.preventDefault();
	          objObservacionTrabajador={id:0}
	          guardarObservacionTrabajador();
	       });
			 
	       $('#formEditarObsTrab').on('submit',function(e){  
	          e.preventDefault(); 
	          guardarObservacionTrabajador();
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
               "No es responsable interno y/o responsable secundario " +
               "de ningún proyecto activo de la empresa." +
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

function verAcordeContratistaObsColab(){
   var contratistaId = $("#slcContratistaProyectoObs").val();
   var slcTipoProyectoObs = crearSelectOneMenuOblig("slcTipoProyectoObs","",
      listTipoProyectoObsTrab.filter(function(val){return val.contratistaId == contratistaId}), 
      "","id","titulo");
	
   $("#divProyectoObsColab").html(slcTipoProyectoObs);	
}

function verAcordeTipoReporteActo(){
   var tipoId = parseInt($("#slcTipoReporteObs").val());
	
   $("#divNivelRiesgo").parent().show();
	
   if(tipoId == 3){
      $("#slcTipoPerdidaObs").val(6);
      $("#divNivelRiesgo").parent().hide();
   }
} 

var dataParamObsTrabAux = {};

function guardarObservacionTrabajador(){
   var formDiv = $("#editarMovilObsTrab");
	
   if(objObservacionTrabajador.id == 0){
      formDiv = $("#nuevoMovilObsTrab");
   }
	
   var campoVacio = true;
	
   var descripcion = formDiv.find("#inputDescObsTrab").val();  
   var fecha = new Date();
   var tipo = parseInt(formDiv.find("#slcTipoReporteObs").val());
   var perdida = formDiv.find("#slcTipoPerdidaObs").val();
   var proyectoId = formDiv.find("#slcTipoProyectoObs").val(); 
   var lugar = formDiv.find("#inputLugarObsTrab").val();
   var contratistaObj = {id: null}; // null -> obs. asociada al contratista
   var nivel = (tipo == 3?2:1);
   var gestionId = parseInt($("#slcTipoGestionObs").val());
   var reportadoPor = $("#inputReportadoPorObsTrab").val();
   var grupoRiesgoId = parseInt(formDiv.find("#slcGrupoRiesgoObs").val());
   var accionInmObs = formDiv.find("#textAccionInmObsTomadaTrab").val();
	
   var evidenciaNombre = $("#inputEviObsTrabajador"+objObservacionTrabajador.id).val();
	
   if(evidenciaNombre.length == 0){
      campoVacio = false;
   }
		
   if(campoVacio){
      dataParamObsTrabAux={
	 id: objObservacionTrabajador.id, 
	 proyectoId: proyectoId,
	 tipo: {id: 1},
	 descripcion: descripcion,
	 nivel: nivel,
	 fecha: fecha,
	 hora: obtenerHoraActual(),
	 perdida: {id: perdida},
	 reporte: {id: tipo}, 
         //trabajador:{id:getSession("trabajadorGosstId")},
	 grupoRiesgo: {id: grupoRiesgoId},
	 lugarOcurrencia: lugar,
	 reportadoPor: reportadoPor,
	 gestion: {id: gestionId},
	 accionInmediataTomada: accionInmObs,
	 contratistaAsociado: contratistaObj,
	 trabajadorId: parseInt(getSession("trabajadorGosstId")),
	 empresaId: getSession("gestopcompanyid")
      };
      
      if(objObservacionTrabajador.id == 0 /*&& listResponsablesObsTrab.length != 0*/){
         mensajeUx="<label>¿Desea notificar el registro de esta observación a otro(s) responsable(s)?</label>";
         mensajesUx(mensajeUx,9,"","EnviarCorreoAdiRespTrab");

         $("#btnDevolverValorEnviarCorreoAdiRespTrab").on("click",function(){
            crearEnviarCorreoAdicionalResponsablesObservacionTrabajador();
         });
      
         $("#btnRegresarPrevioEnviarCorreoAdiRespTrab").on("click",function(){
	    enviarDataGuardarObservacionTrabajador();
         });  
      }else{
	 enviarDataGuardarObservacionTrabajador(); 
      }
   }else{
      mensajeUx = "<label>Debe subir la evidencia respectiva.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

function crearEnviarCorreoAdicionalResponsablesObservacionTrabajador(){
   $("#modalEnviarCorreoRespObsTrab").remove();
   
   var contenido = "";

   var listContenido=[
//      {sugerencia:"",label:"Responsables",inputForm:"",
//       divContainer:"divResponsablesEnviarCorreoObsTrab"},
      {sugerencia:"",label:"1er responsable " +
       "<br><label style='color:blue;'>(opcional)</label>",
       inputForm:"<input type='text' class='form-control' id='inputCorreoPrimerRespTrab'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"2do responsable " +
       "<br><label style='color:blue;'>(opcional)</label>",
       inputForm:"<input type='text' class='form-control' id='inputCorreoSegundoRespTrab'>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"3er responsable " +
       "<br><label style='color:blue;'>(opcional)</label>", 
       inputForm:"<input type='text' class='form-control' id='inputCorreoTercerRespTrab'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",label:"",
       inputForm:"<button id='btnEnviarCorreoObsTrab' class='btn btn-success' type='submit' " +
	      		 "onclick='valoresEnviarCorreoAdiRespObsTrab()' style='float:right;font-size:18px;'>" +
	            "<i class='fa fa-paper-plane'></i> Enviar" +
	      	 "</button>"}
   ];  
   
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
				
   var modalOptions={
      id: "modalEnviarCorreoRespObsTrab",
      nombre: "<i class='fa fa-users'></i> Lista de responsables",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
	
   crearModalPrincipalUsuario(modalOptions,function(){
//      crearSelectOneMenuObligMultipleCompleto("respEnviarCorreoObsTrab","",listResponsablesObsTrab,
//         "id","nombre","#divResponsablesEnviarCorreoObsTrab","Seleccionar...");   
   },true,true);
}

function valoresEnviarCorreoAdiRespObsTrab(){
//   listResponsablesId = [];
//   var responsableId = $("#respEnviarCorreoObsTrab").val();
//    
//   if(responsableId != null){
//      responsableId.forEach(function(val){
//	 listResponsablesId.push(parseInt(val));
//      });
//   }
    
   listRespCorreosAux = [];
   listRespCorreosAux.push($("#inputCorreoPrimerRespTrab").val()); 
   listRespCorreosAux.push($("#inputCorreoSegundoRespTrab").val()); 
   listRespCorreosAux.push($("#inputCorreoTercerRespTrab").val()); 
   
   dataParamObsTrabAux.listRespCorreosAux =
      (listRespCorreosAux.length == 0?null:listRespCorreosAux);
    
   enviarDataGuardarObservacionTrabajador();
}

function enviarDataGuardarObservacionTrabajador(){
   callAjaxPost(URL+'/contratista/observacion/save',dataParamObsTrabAux,function(data){
      switch(data.CODE_RESPONSE){
	 case "05":  			
	    guardarEvidenciaAuto(data.nuevoId,"fileEviObsTrabajador"+objObservacionTrabajador.id,
	    bitsEvidenciaAccionMejora,"/contratista/observacion/evidencia/save",function(){
	       $("#modalEnviarCorreoRespObsTrab").modal("hide");
		
               mensajeUx = 
	          "<label>La observación se registró con éxito." +
		  "<br><br>*Se notificó al responsable SST del proyecto, los contactos de la contratista y " +
		  "los responsables adicionales seleccionados.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarVistaColaborador");   
		     
	       $("#modalMensajeUxActualizarVistaColaborador").on("hidden.bs.modal",function(){
	          habilitarObservacionesColaborador();
	       });
	    },"observacionId"); 
							
	    break;
						
	 default:
	    alert("Se guardó la observación, pero no se encontró el correo del responsable " +
	       	     "o hubo otro problema técnico");
	    console.log("Ocurrió un error al guardar!");
      }
   }); 
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
   habilitarObservacionesColaborador();
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
      observacionId: objObservacionTrabajador.id,
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
            
            if(objObservacionTrabajador.nota.id != 1){
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
	          "</a>";
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
		label:"<i class='fa fa-list-ul'></i> Tipo acción de mejora:",
		inputForm:tipoAccionMejoraNombre},
	       {sugerencia:"",
		label:"<i class='fa fa-calendar'></i> Fecha de Planificada:",
		inputForm:(val.fechaRevisionTexto.length == 0?"------":val.fechaRevisionTexto)},
	       {sugerencia:"",
		label:"<i class='fa fa-eye'></i> Observación del contratista:",
		inputForm:val.observacion},
	       {sugerencia:"",
                label:"<i class='fa fa-download'></i> Evidencia",
		inputForm:(val.evidenciaNombre == "----"?val.evidenciaNombre:
		 	   "<a class='efectoLink' " +
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
         
         if(objObservacionTrabajador.nota.id != 1){
            var textNuevaAccionMej =
               "<div id='estadoMovilNuevoRegistroAccMejObsFast'>" +
                  "<div class='tituloSubList'> Nueva acción de mejora " +
                     "<button style='font-size:19px' title='Registrar nuevo acción de mejora.' " +
                             "class='btn btn-success' onclick='registrarNuevaAccionMejoraObservacionFast()'>"+
                        "<i class='fa fa-plus-square'></i> Registrar" +
                     "</button>" +
                  "</div>" +
               "</div>"  ;
         
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
      {sugerencia:"",label:"Fecha planificada",anchoLabel:"",anchoDiv:"",
       inputForm:"<input type='date' id='inputFechaPlanificadaObsFast' class='form-control'>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"<label>*Ej: El incidente fue causado por un peatón, fue un evento fortuito.</label>",
       label:"Observación del contratista*",anchoLabel:"",anchoDiv:"",
       inputForm:"<textarea rows='3' class='form-control' id='textObsContratistaObsFast'></textarea>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia**",
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
      editarDiv.find("#inputFechaPlanificadaObsFast").val(convertirFechaInput(objObservacionAccMej.fechaRevision));
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
      mensajeAux: "**Si ya ha realizado la acción, solo introduzca la evidencia."
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
  
   var fechaPlanificada = convertirFechaTexto($("#inputFechaPlanificadaObsFast").val());
   var inputFechaPlanificada;

   if(!fechaPlanificada){
      inputFechaPlanificada = null;
   }else{
      inputFechaPlanificada = fechaPlanificada;
   }
   
   var observacion = $("#textObsContratistaObsFast").val();
   var nombreEvidencia = $("#inputEviAccMejObsFast").val();
	
   if(descripcion.length == 0){
      mensajeUx="<label>Debe completar la descripción.</label>";
      campoVacio = false;
   }else if(selTipoAccMejId == -1){
      mensajeUx="<label>Debe seleccionar el tipo de acción de mejora.</label>";
      campoVacio = false;
   }else if(inputFechaPlanificada == null && nombreEvidencia.length == 0){
      mensajeUx="<label>Debe ingresar la fecha planificada (Si ya ha realizado " +
      		"la acción, solo introduzca la evidencia).</label>";  
      campoVacio = false;
   }else if(observacion.length == 0){
      mensajeUx="<label>Debe completar la observación del contratista.</label>"; 
      campoVacio = false;
   }
   
   if(campoVacio){
      if(objObservacionAccMej.id > 0){
	 hallarEstadoImplementacionAccMejObservacionFast();
      }else{
         objObservacionAccMej.accionEstado = null;
      }
      
      var dataParam={
	 accionMejoraId: objObservacionAccMej.accionMejoraId,
	 observacion: observacion,
	 descripcion: descripcion,
	 fechaRevision: inputFechaPlanificada,
	 fechaReal: null,
	 responsableNombre: "Responsable: "+getSession("gestopusername"),
	 responsableMail: "@asd",
	 accionMejoraTipoId: selTipoAccMejId,
	 companyId: getSession("gestopcompanyid"),
	 observacionId: objObservacionTrabajador.id,
	 trabajadorId: parseInt(getSession("trabajadorGosstId"))
      };
		 
      callAjaxPost(URL+'/gestionaccionmejora/accionmejora/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":  
	       guardarEvidenciaAuto(data.nuevoId,"fileEviAccMejObsFast",bitsEvidenciaAccionMejora,
	       "/gestionaccionmejora/accionmejora/evidencia/save",function(){
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
       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
 	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarAccionMejoraObsFast").modal("show");    
      }); 
   }
}

function hallarEstadoImplementacionAccMejObservacionFast(){
   var fechaPlanificada = $("#inputFechaPlanificadaObsFast").val();
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

function ocultarCalificarObservacionesFast(){
   $("#modalCalificarObsFast").modal("hide");
}

function calificarObservacionesFast(){
   $("#modalCalificarObsFast").remove();
    
   var selNotaCalificacion = crearSelectOneMenu("selNotaCalificacion","",
      listTipoNotaObsTrab,objObservacionTrabajador.nota.id,"id","nombre");
     
   var listItemsRegistro=[
      {sugerencia:"",label:"Calificación",anchoLabel:"",anchoDiv:"",
       inputForm:selNotaCalificacion},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",
       label:"Observación de la calificación",anchoLabel:"",anchoDiv:"",
       inputForm:"<textarea rows='3' class='form-control' id='textObsCalificacionObsFast'></textarea>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
 	             "onclick='ocultarCalificarObservacionesFast()'>" +
 	        "<i class='fa fa-times'></i> Cancelar" +
 	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
             	    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
             	 "</button>"} 
   ];
      
   var textFormCalificar = "";
   	
   listItemsRegistro.forEach(function(val,index){
      textFormCalificar += obtenerSubPanelModuloVersionDos(val);
   });
    
   var opciones={
      id: "modalCalificarObsFast",
      nombre: "<i class='fa fa-pencil-square-o'></i> Calificación de la observación",
      contenido: "<form id='formCalificarObsFast' class='eventoGeneral'>"+textFormCalificar+"</form>"
   };
      
   crearModalPrincipalUsuario(opciones,function(){},true,true);
     	
   var editarDiv = $("#formCalificarObsFast");
    
   editarDiv.find("#textObsCalificacionObsFast").val(objObservacionTrabajador.anotacion);
   	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarCalificarObservacionesFast();
   });   
}

function guardarCalificarObservacionesFast(){
   var formDiv = $("#formCalificarObsFast");
 	
   var campoVacio = true;
 	
   var notaId = parseInt(formDiv.find("#selNotaCalificacion").val());
   var anotacion = formDiv.find("#textObsCalificacionObsFast").val(); 
   
   if(notaId == -1){
      campoVacio = false;
   }
  		
   if(campoVacio){
      var dataParam={
 	 id: objObservacionTrabajador.id,
 	 descripcion: objObservacionTrabajador.descripcion,
 	 accionInmediataTomada: objObservacionTrabajador.accionInmediataTomada,
 	 nota: {id: notaId},
 	 anotacion: anotacion,
 	 trabajadorId: parseInt(getSession("trabajadorGosstId")),
 	 proyectoId: objObservacionTrabajador.proyectoId,
 	 notificarObsNota: (objObservacionTrabajador.nota.id != 2 && notaId == 2?1:0)
      };

      callAjaxPost(URL+'/contratista/observacion/calificacion/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":  	
 	       $("#modalCalificarObsFast").modal("hide");
 		
 	       mensajeUx = 
 	          "<label>La calificación se guardó con éxito.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarVistaColaborador");   
 		     
 	       $("#modalMensajeUxActualizarVistaColaborador").on("hidden.bs.modal",function(){
 	          habilitarObservacionesColaborador();
 	       });
 							
 	       break;
 						
 	    default:
 	       alert("Ocurrió un error al guardar la calificación.");
         }
      });
   }else{
      $("#modalCalificarObsFast").modal("hide");
       
      mensajeUx = "<label>Debe seleccionar una opción de la calificación.</label>";
      mensajesUx(mensajeUx,2,"","ActualizarVistaColaborador");
      
      $("#modalMensajeUxActualizarVistaColaborador").on("hidden.bs.modal",function(){
	 $("#modalCalificarObsFast").modal("show");
      });
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
 