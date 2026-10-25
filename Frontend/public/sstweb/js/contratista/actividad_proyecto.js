var actividadProyectoId;
var actividadProyObj=[];
var listCategoriaActividad=[],listPrevencionistasAct=[];
var banderaEdicion69=false;
var listFullActProyectoSeguridad;
var estadoActividadProy; 
var tipoActividadId;
var mensajeUx;

var funcionalidadActividad=[
   {id:"opcEditar", nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
    functionClick:function(data){
       if(tipoActividadId == 12){
	  registroActividadProyectoVersionDos(indexPostulante,tipoActividadId,0,indexActividad);
       }else{
	  editarActProyecto(indexActividad);
       }
    }},
   {id:"opcEliminar", nombre:"<i class='fa fa-trash'></i> Eliminar",
    functionClick:function(data){eliminarActProyecto(indexActividad);}}
];

function marcarSubOpcionActividad(pindex){
   funcionalidadActividad[pindex].functionClick();
   $(".detalleAccion ul").hide(); 
}

var indexActividad;

function toggleMenuOpcionActividad(obj,pindex){ 
   indexActividad = pindex;
   $(obj).parent(".detalleAccion").find("ul").toggle();
   $(obj).parent(".detalleAccion").siblings().find("ul").hide(); 
}

function cargarActProyectosSeguridad(pindex,ptipoId,verDiv) { 
   pindex = defaultFor(pindex,indexPostulante);
   ptipoId = defaultFor(ptipoId,tipoActividadId);
//
   $(".detalleActividadesProyecto"+ptipoId).html("");
	
   $("#proyectoTable"+listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
   .parent(".eventoGeneral").parent(".contenidoSubList")
   .parent(".divProyectoGeneral").siblings()
   .find(".detalleActividadesProyecto"+ptipoId).hide();
   
   $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
   .find(".detalleActividadesProyecto"+ptipoId)
   .html("<td colspan='3' style='background-color:#eeeeee;height:10px;'>&nbsp;</td>");
	
   if(verDiv){
      $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
      .find(".detalleActividadesProyecto"+ptipoId).show();
   }else{
      $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
      .find(".detalleActividadesProyecto"+ptipoId).toggle();
   }
   
   proyectoObj.id = listFullProyectoSeguridad[pindex].id;
   indexPostulante = pindex;
   tipoActividadId = ptipoId;
   
   var proyectoObjSend={
      id: listFullProyectoSeguridad[pindex].id,
      tipoActividadId: tipoActividadId
   };
	
   callAjaxPost(URL+'/contratista/proyecto/actividades',proyectoObjSend,function(data){
      if(data.CODE_RESPONSE == "05"){
         listFullActProyectoSeguridad = data.list;
         listCategoriaActividad = data.categorias;
         banderaEdicion69 = false;
         var indicadorPositivo = 0,indicadorTotal = 0;
					
         $("#tblActProyecto tbody tr").remove();
		 
		 $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
		 .find(".detalleActividadesProyecto"+tipoActividadId)
		 .html("<td colspan='3' style='background-color:#eeeeee;height:10px;'>&nbsp;</td>");
	 	
         listFullActProyectoSeguridad.forEach(function(val,index){
            if(val.tipo.id == tipoActividadId){
	       var eviNombre = (val.evidenciaNombre == ""?"------":
		  "<a class='efectoLink' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia?id="+val.id+"'>" +
		      val.evidenciaNombre +
	          "</a>");
	       
	       if(val.tipo.id == 7){
		  var eviAuxiliar1Nombre = (val.evidenciaAuxiliar1Nombre == ""?"------":
		     "<a class='efectoLink' href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_auxiliar_1?id="+val.id+"'>" +
		         val.evidenciaAuxiliar1Nombre +
		     "</a>");
	       }else if(val.tipo.id == 12){
		  if(val.incluyeTrabAltoRiesgo == 1){
		     var evidenciaTotal =
		        (val.evidenciaSimpleNombre.length != 0?
			 "<a class='efectoLink' target='_blank' " +
			    "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_simple?id="+val.id+"'>"+
			     val.evidenciaSimpleNombre +
			 "</a>":
			 (val.evidenciaANombre.length == 0 && val.evidenciaBNombre.length == 0 && val.evidenciaCNombre.length == 0 && 
			  val.evidenciaDNombre.length == 0 && val.evidenciaENombre.length == 0?"------":
			  (val.evidenciaANombre.length != 0?
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_a?id="+val.id+"'>" +
			       val.evidenciaANombre +
			   "</a>":"") +
			  (val.evidenciaBNombre.length != 0?(val.evidenciaANombre.length != 0?"<br>":"") +
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_b?id="+val.id+"'>" +
			       val.evidenciaBNombre +
			   "</a>":"") +
			  (val.evidenciaCNombre.length != 0?
			   (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0?"<br>":"") +
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_c?id="+val.id+"'>" +
			       val.evidenciaCNombre +
			   "</a>":"") +
			  (val.evidenciaDNombre.length != 0?
			   (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0 ||
			    val.evidenciaCNombre.length != 0?"<br>":"") +
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_d?id="+val.id+"'>" +
			       val.evidenciaDNombre +
			   "</a>":"") +
			  (val.evidenciaENombre.length != 0?
			   (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0 ||
			    val.evidenciaCNombre.length != 0 || val.evidenciaDNombre.length != 0?"<br>":"") +
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_e?id="+val.id+"'>" +
			       val.evidenciaENombre +
			   "</a>":""))); 
		      
		     var evidenciaTotal1 =
		        (val.evidenciaSimple1Nombre.length != 0?
			 "<a class='efectoLink' target='_blank' " +
			    "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_simple1?id="+val.id+"'>"+
			     val.evidenciaSimple1Nombre +
			 "</a>":
			 (val.evidenciaA1Nombre.length == 0 && val.evidenciaB1Nombre.length == 0 && val.evidenciaC1Nombre.length == 0 && 
			  val.evidenciaD1Nombre.length == 0 && val.evidenciaE1Nombre.length == 0?"------":
			  (val.evidenciaA1Nombre.length != 0?
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_a1?id="+val.id+"'>" +
			       val.evidenciaA1Nombre +
			   "</a>":"") +
			  (val.evidenciaB1Nombre.length != 0?(val.evidenciaA1Nombre.length != 0?"<br>":"") +
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_b1?id="+val.id+"'>" +
			       val.evidenciaB1Nombre +
			   "</a>":"") +
			  (val.evidenciaC1Nombre.length != 0?
			   (val.evidenciaA1Nombre.length != 0 || val.evidenciaB1Nombre.length != 0?"<br>":"") +
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_c1?id="+val.id+"'>" +
			       val.evidenciaC1Nombre +
			   "</a>":"") +
			  (val.evidenciaD1Nombre.length != 0?
			   (val.evidenciaA1Nombre.length != 0 || val.evidenciaB1Nombre.length != 0 ||
			    val.evidenciaC1Nombre.length != 0?"<br>":"") +
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_d1?id="+val.id+"'>" +
			       val.evidenciaD1Nombre +
			   "</a>":"") +
			  (val.evidenciaE1Nombre.length != 0?
			   (val.evidenciaA1Nombre.length != 0 || val.evidenciaB1Nombre.length != 0 ||
			    val.evidenciaC1Nombre.length != 0 || val.evidenciaD1Nombre.length != 0?"<br>":"") +
			   "*<a class='efectoLink' target='_blank' " +
			      "href='"+URL+"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_e1?id="+val.id+"'>" +
			       val.evidenciaE1Nombre +
			   "</a>":""))); 
		  } 
	       }
						  
	       var estilo = (val.evaluacion.nota.id == 1?"gosst-aprobado":
		  (val.evaluacion.nota.id == 2?"gosst-desaprobado":"gosst-advertencia"));
						  
	       if(val.evaluacion.nota.id == 1){
	          indicadorPositivo++;
	       }
			
	       var btnOpcion="",menuOpcion="";
	       
	       if(val.evaluacion.nota.id != 1){
		  btnOpcion =  
		     "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionActividad(this,"+index+")'>" +
	                "Ver Opciones <i class='fa fa-fa-angle-double-down'></i>" +
	             "</a>";
		  
	          menuOpcion = "<ul class='list-group listaGestionGosst'>";
	             funcionalidadActividad.forEach(function(val1,index1){
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionActividad("+index1+")'>"+val1.nombre+"</li>"
	             });
	          menuOpcion += "</ul>"
	       }
						 
	       var textIn = "";

	       textIn =
		   btnOpcion+menuOpcion +
		  "<strong>*** EVALUACIÓN ***</strong><br>"+
		   val.evaluacion.nota.icono+" Estado: " +val.evaluacion.nota.nombre+"<br>"+
	           (val.evaluacion.nota.id != 3?
	            "<i class='fa fa-calendar' aria-hidden='true'></i> " +
	            "Evaluado el "+val.evaluacion.fechaTexto+"<br>" +
	            (val.evaluacion.nota.id == 2?"<i class='fa fa-exclamation-circle' aria-hidden='true'></i>" +
	             "<strong> Observación: "+val.evaluacion.observacion+"</strong><br>":""):"") +
	          "<div style='border-top:2px solid black;'></div>" +
	          "<strong>*** CÓDIGO "+val.codigo+" ***</strong><br>";
						 
	       if(val.tipo.id == 1){ 
		  textIn+=
		     "<strong><i aria-hidden='true' class='fa fa-info'></i> Descripción: </strong> "+val.descripcion+"<br>" +
		     "<strong><i aria-hidden='true' class='fa fa-calendar'></i> Fecha Planificada: </strong> "+val.fechaPlanificadaTexto+"<br>" +
		     "<strong><i aria-hidden='true' class='fa fa-list-ul'></i> Categoria: </strong> "+val.categoria.nombre+"<br>" +
		     "<strong><i aria-hidden='true' class='fa fa-download'></i> Evidencia: </strong> "+eviNombre;
	       }else if(val.tipo.id == 7){ 
	          textIn+=
		     "<strong><i aria-hidden='true' class='fa fa-search'></i> Detalle: </strong> "+val.observacion+"<br>" +
		     "<strong><i aria-hidden='true' class='fa fa-calendar'></i> Fecha de registro: </strong> "+val.fechaRealTexto+"<br>" +
		     "<strong><i aria-hidden='true' class='fa fa-download'></i> Evidencia: </strong> "+eviNombre+"<br>" +
		     "<strong><i aria-hidden='true' class='fa fa-download'></i> Procedimiento de IPERC:</strong> "+eviAuxiliar1Nombre; 
	       }else if(val.tipo.id == 12){
		  var incluyeTrabajoAltoRiesgo = (val.incluyeTrabAltoRiesgo == 1?"Sí":"No"); 
		   
		  textIn+=
		     "<strong><i aria-hidden='true' class='fa fa-calendar'></i> Fecha Inicio: </strong> "+val.fechaPlanificadaTexto+"<br>" +
	             "<strong><i aria-hidden='true' class='fa fa-calendar'></i> Fecha Fin: </strong> "+val.fechaFinVigenciaTexto+"<br>" +
	             "<strong><i aria-hidden='true' class='fa fa-info'></i> ¿Incluye trabajos de alto riesgo? </strong> "+incluyeTrabajoAltoRiesgo+"<br>";
		  
		  if(val.incluyeTrabAltoRiesgo == 1){
		     var numPrevencionistas = 0;
		     
		     var prevensId = val.listPrevencionistasId.split(",");       	                               			
			
		     prevensId.forEach(function(val1){
		        numPrevencionistas++; 
		     });
		     
		     textIn+= 
			"<strong><i class='fa fa-users' aria-hidden='true'></i> N° de prevencionistas registrados:</strong> "+numPrevencionistas+"<br>"+
		        "<a class='efectoLink' id='idLinkListPrevActProy"+index+"' " +
			   "onclick='cambiarContLinkListPrevActProy("+index+",0);'>" +
		           "Ver lista prevencionistas <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
		        "</a><br>" +
		        "<div id='idDivListPrevActProy"+index+"' style='display:none;font-weight:bold;background:#E4DCDC;'>"+
			    val.listPrevencionistasNombre.replace(/-/gi,"<br>")+
		        "</div>" +
	                "<strong><i aria-hidden='true' class='fa fa-download'></i> Análisis de trabajo seguro:</strong> "+evidenciaTotal+"<br>"+
	                "<strong><i aria-hidden='true' class='fa fa-download'></i> Procedimiento de trabajo:</strong> "+evidenciaTotal1+"<br>";
		  }
		  
		  textIn+= "<strong><i aria-hidden='true' class='fa fa-download'></i> Evidencia: </strong> "+eviNombre
	       }else{
		  var tituloObs = (tipoActividadId == 5?"Título":"Detalle");
							 
		  textIn+=
		     "<strong><i aria-hidden='true' class='fa fa-search'></i> "+tituloObs+": </strong> "+val.observacion+"<br>" +
		     "<strong><i aria-hidden='true' class='fa fa-calendar'></i> Fecha de registro: </strong> "+val.fechaRealTexto+"<br>"+
		     "<strong><i aria-hidden='true' class='fa fa-download'></i> Evidencia: </strong> "+eviNombre;
	       }
						
	       $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
	          .find(".detalleActividadesProyecto"+tipoActividadId+" td").append(
	             "<div class='detalleAccion "+estilo+"'>"+textIn+"</div>" +
		     "<div class='opcionesAccion'>" +
	              /*"<a onclick='eliminarActProyecto("+index+")'> Eliminar</a>" +
			"<i class='fa fa-minus' aria-hidden='true'></i> <a onclick='editarActProyecto("+index+")'> Editar</a>"+*/
	             "</div>"); 
            }
         });
					
         $(".detalleAccion ul").hide(); 
         $("#trPlanProyecto"+proyectoObj.id+" .celdaIndicadorProyecto")
         .html(indicadorPositivo+" / "+listFullActProyectoSeguridad.length);
      }else{
         console.log("NOPNPO");
      }
   });	
}

function cambiarContLinkListPrevActProy(pindex,val){
   if(val == 0){
      document.getElementById("idDivListPrevActProy"+pindex).style.display = "";
        
      document.getElementById("idLinkListPrevActProy"+pindex)
      .innerHTML = "Ocultar lista prevencionistas <i class='fa fa-angle-double-up' aria-hidden='true'></i>";
    
      document.getElementById("idLinkListPrevActProy"+pindex).onclick = function(){cambiarContLinkListPrevActProy(pindex,1);}
   }else{
      document.getElementById("idDivListPrevActProy"+pindex).style.display = "none";
        
      document.getElementById("idLinkListPrevActProy"+pindex)
      .innerHTML = "Ver lista prevencionistas <i class='fa fa-angle-double-down' aria-hidden='true'></i>";
    
      document.getElementById("idLinkListPrevActProy"+pindex).onclick = function(){cambiarContLinkListPrevActProy(pindex,0);}
   }
}

function editarActProyecto(pindex){
   if(!banderaEdicion69){
      $("#editarMovilActivProy").find(".tituloSubList")
      .html(textoBotonVolverContenido+"Editar");
		
      actividadProyectoId = listFullActProyectoSeguridad[pindex].id; 
      actividadProyObj = listFullActProyectoSeguridad[pindex];
      tipoActividadId = actividadProyObj.tipo.id;
		
      var descripcion = actividadProyObj.descripcion;
      var fechaPlan = convertirFechaInput(actividadProyObj.fechaPlanificada);
      var observacion = actividadProyObj.observacion;
      var expositor = actividadProyObj.expositor;
      var duracion = actividadProyObj.duracion;
      var numTrabajadores = actividadProyObj.numTrabajadores;
		//
      $(".divListPrincipal>div").hide();
      $("#editarMovilActivProy").show();

	    (parseInt(getSession("gestopcompanyid")) == 744 && parseInt(ptipoId) == 15?$(".formatoHojaMsds-AGP").show():$(".formatoHojaMsds-AGP").hide());
	    (parseInt(getSession("gestopcompanyid")) == 747 && parseInt(ptipoId) == 19?$(".enlaceMemoriaDesc-SJ").show():$(".enlaceMemoriaDesc-SJ").hide());
		
      $("#inputDescActProy").val(descripcion);
      $("#inputFecPlanActProy").val(fechaPlan);
      $("#inputObsActProy").val(observacion);	
      $("#inputExpoActProy").val(expositor);
      $("#inputNumTrabActProy").val(numTrabajadores);
      $("#inputDuraActProy").val(duracion);
		
      $("#expoActividad").parent().hide();$("#numTrabActividad").parent().hide();
      $("#duracionActividad").parent().hide();$("#divSeparatorActividad").parent().hide();
      $("#divMensajeActividad").parent().hide();$("#divPuntajeActividad").parent().hide();
      $("#divDescActiv").parent().hide();$("#divFechaPlanActiv").parent().hide();
      $("#divCategActiv").parent().hide();$("#eviActProcActAltRiesgo").parent().hide();
		
      if(actividadProyObj.tipo.id == 1){
	 $("#divDescActiv").parent().show();$("#divFechaPlanActiv").parent().show();
	 $("#divCategActiv").parent().show();
			
	 var selCategoriaActividad = crearSelectOneMenuOblig("selCategoriaActividad","verAcordeCategoriaActividad()", 
	    listCategoriaActividad,actividadProyObj.categoria.id,"id","nombre")
	 $("#divCategActiv").html(selCategoriaActividad);
			
	 verAcordeCategoriaActividad();
      }else if(actividadProyObj.tipo.id == 7){
	 $("#eviActProcActAltRiesgo").parent().show();
      }

      $("#divObsActProy").parent().find("label").html("Observación del contratista");
		
      if(actividadProyObj.tipo.id == 5){
	 $("#divObsActProy").parent().find("label").html("Título del documento");
      }
		
      var options={
         container:"#eviActividad",functionCall:function(){
            validacionSubirEvidencia("ActividadProy",bitsEvidenciaArchivoCurso,""); 
         },descargaUrl:"/contratista/amazon_s3/proyecto/actividad/evidencia?id="+actividadProyObj.id, 
         esNuevo:(actividadProyObj.evidenciaNombre.length == 0?true:false),
         idAux:"ActividadProy",evidenciaNombre:actividadProyObj.evidenciaNombre
      };
		
      crearFormEvidenciaCompleta(options);
      
      var optionsActProcActAltRiesgo={
         container:"#eviActProcActAltRiesgo",functionCall:function(){
            validacionSubirEvidencia("ActProcActAltRiesgoProy",bitsEvidenciaArchivoCurso,"");    
         },descargaUrl:"/contratista/amazon_s3/proyecto/actividad/evidencia_auxiliar_1?id="+actividadProyObj.id,
	 esNuevo:(actividadProyObj.evidenciaAuxiliar1Nombre.length == 0?true:false),
         idAux:"ActProcActAltRiesgoProy",evidenciaNombre: actividadProyObj.evidenciaAuxiliar1Nombre
      };
					
      crearFormEvidenciaCompleta(optionsActProcActAltRiesgo);
      
      hallarEstadoImplementacionActividad();
//				
      banderaEdicion69 = false;   
   }	
}

function nuevoActProyecto(pindex,ptipoId){
	tipoActividadId = ptipoId;proyectoObj.id = listFullProyectoSeguridad[pindex].id;indexPostulante = pindex;
	
   callAjaxPost(URL+'/contratista/proyecto/actividades',{id: proyectoObj.id},function(data){  
      listCategoriaActividad = data.categorias; 
      actividadProyectoId = 0;
      var nombreTipoActividad = "";
				
      $("#expoActividad").parent().hide();$("#numTrabActividad").parent().hide();
      $("#duracionActividad").parent().hide();$("#divSeparatorActividad").parent().hide();
      $("#divMensajeActividad").parent().hide();$("#divPuntajeActividad").parent().hide();
      $("#eviActProcActAltRiesgo").parent().hide();
				
      $("#divDescActiv").parent().hide();$("#divFechaPlanActiv").parent().hide();
      $("#divCategActiv").parent().hide();$("#divObsActProy").parent().find("label").html("Observación del contratista");

	    (parseInt(getSession("gestopcompanyid")) == 744 && parseInt(ptipoId) == 15?$(".formatoHojaMsds-AGP").show():$(".formatoHojaMsds-AGP").hide());
	    (parseInt(getSession("gestopcompanyid")) == 747 && parseInt(ptipoId) == 19?$(".enlaceMemoriaDesc-SJ").show():$(".enlaceMemoriaDesc-SJ").hide());

      switch(ptipoId){
         case 1:
	    $("#divSeparatorActividad").parent().show();
	    $("#divMensajeActividad").parent().show();
	    $("#divPuntajeActividad").parent().show();			
	    $("#divDescActiv").parent().show();
	    $("#divFechaPlanActiv").parent().show();
	    $("#divCategActiv").parent().show();
	    nombreTipoActividad = listTipoActividades[0].nombre;
	    break;
				
         case 2:
	    nombreTipoActividad = "Plan de emergencia";
	    break;
				
         case 3:
	    nombreTipoActividad = "Plan SSOMA";
            break;
				
         case 4:
	    nombreTipoActividad = "Plan de manejo de residuos";
	    break;
				
         case 5:
	    nombreTipoActividad = listTipoActividades[3].nombre;
	    $("#divObsActProy").parent().find("label").html("Título del documento");
	    break;	
				
         case 6:
	    nombreTipoActividad = "Plan COVID";
	    break;
	     
         case 7:
            $("#eviActProcActAltRiesgo").parent().show();
	    nombreTipoActividad = "Matriz de riesgo (IPERC)";
	    break;
	    
         case 10:
 	    nombreTipoActividad = "Registro de capacitaciones efectuadas relacionados a los trabajos a realizar";
 	    break;
 	    
         case 11:
  	    nombreTipoActividad = "Orden de compra o contrato firmado";
  	    break;
  	    
         case 12:
  	    nombreTipoActividad = "Cronograma de trabajo";
  	    break;
  	    
         case 13:
  	    nombreTipoActividad = "Programa de charlas diarias de seguridad";
  	    break;
  	    
         case 14:
  	    nombreTipoActividad = "Procedimiento escrito de trabajo seguro (PETS)";
  	    break;
  	    
         case 15:
   	    nombreTipoActividad = "Hoja MSDS";
   	    break;
   	    
         case 16:
   	    nombreTipoActividad = "Instructivo de trabajo seguro para el trabajo en alto riesgo";
   	    
   	    break;
   	    
         case 18:
   	    nombreTipoActividad = "Matriz de aspectos ambientales";
   	    
   	    break;

		  case 19:
			  nombreTipoActividad = "Memoria descriptiva";

			  break;

		  case 20:
			  nombreTipoActividad = "Póliza de responsabilidad civil";

			  break;

		  case 21:
			  nombreTipoActividad = "Póliza CAR";

			  break;

		  case 22:
			  nombreTipoActividad = "Carta fianza";

			  break;
			  
	      case 23:
			  nombreTipoActividad = "Plan de rescate";

			  break;
						  
		  case 24:
			  nombreTipoActividad = "Plan de izaje";

			  break;
			  
		  case 25:
			  nombreTipoActividad = "Matriz de procesos y actividades";

			  break;
						  
		  case 26:
			  nombreTipoActividad = "Estructura de SST para el servicio";

			  break;
									  
		  case 27:
			  nombreTipoActividad = "Plan de contingencia";

			  break;
												  
		  case 28:
			  nombreTipoActividad = "Señalización de obras e instalaciones";

			  break;
      }
				
      verAcordeCategoriaActividad();
      
//      tipoActividadId = ptipoId;proyectoObj.id = listFullProyectoSeguridad[pindex].id;indexPostulante = pindex;
				
      $("#editarMovilActivProy").find(".tituloSubList").html(textoBotonVolverContenido+" Nuevo "+nombreTipoActividad+" del proyecto " +
         "'"+listFullProyectoSeguridad[pindex].titulo+"'");
				
      var selCategoriaActividad = crearSelectOneMenuOblig("selCategoriaActividad",
	 "verAcordeCategoriaActividad()",listCategoriaActividad,"","id","nombre");
      
      $("#divCategActiv").html(selCategoriaActividad);$("#editarMovilActivProy").find("form input").val("");
				
      var options={
	 container:"#eviActividad",functionCall:function(){
	    validacionSubirEvidencia("ActividadProy",bitsEvidenciaArchivoCurso,""); 
	 },descargaUrl:"",esNuevo:true,idAux:"ActividadProy",evidenciaNombre:""
      };
				
      crearFormEvidenciaCompleta(options);
      
      var optionsActProcActAltRiesgo={
         container:"#eviActProcActAltRiesgo",functionCall:function(){
            validacionSubirEvidencia("ActProcActAltRiesgoProy",bitsEvidenciaArchivoCurso,""); 
         },descargaUrl:"",esNuevo:true,idAux:"ActProcActAltRiesgoProy",evidenciaNombre:""
      };
					
      crearFormEvidenciaCompleta(optionsActProcActAltRiesgo);
      
      $(".divListPrincipal>div").hide();$("#editarMovilActivProy").show(); 
   });	
}

function verAcordeCategoriaActividad(){
   var catId = parseInt($("#selCategoriaActividad").val());
	
   $("#expoActividad").parent().hide();$("#numTrabActividad").parent().hide();$("#duracionActividad").parent().hide();
   $("#divPuntajeActividad").parent().hide();
	
   switch(catId){
      case 3:
      case 6:
      case 8:
	 $("#expoActividad").parent().show();$("#numTrabActividad").parent().show();$("#duracionActividad").parent().show();
	 
	 break;
		
      case 2:
      case 9:
	 $("#divPuntajeActividad").parent().show();
	 
	 break;
   }
}

function cancelarActProyecto(){
   cargarTiposContratista();
}

function eliminarActProyecto(pindex){
   actividadProyectoId = listFullActProyectoSeguridad[pindex].id; 
   
   mensajeUx="<label>¿Está seguro de eliminar la actividad seleccionada?</label>";
   mensajesUx(mensajeUx,3,"","EliminarActProy");
	
   $("#btnDevolverValorEliminarActProy").on("click",function(){
      var dataParam={
	 id: actividadProyectoId,tipo: {id: tipoActividadId},bucketNombre:BUCKETAMAZONS3
      };

      callAjaxPost(URL+'/contratista/proyecto/actividad/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx="<label>La actividad seleccionada se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarActProy");
	       
               $("#modalMensajeUxActualizarActProy").on("hidden.bs.modal",function(){
                  cargarActProyectosSeguridad(indexPostulante,tipoActividadId,true);
               });
               
	       break;
					
	    default:
	       alert("Ocurrió un error al eliminar la actividad!");
         }
      });
   });
}

function guardarActProyecto(functionCallBack){
   var campoVacio = true;
   
   var descripcion = $("#inputDescActProy").val();  
   var fecha = $("#inputFecPlanActProy").val();
   var observacion = $("#inputObsActProy").val();
   var categoria = {id: $("#selCategoriaActividad").val()};
   var expositor = $("#inputExpoActProy").val();
   var duracion = $("#inputDuraActProy").val();
   var numTrabajadores = $("#inputNumTrabActProy").val();
   var puntaje = $("#inputPuntajeActProy").val();
   var nombreEvidencia = $("#inputEviActividadProy").val();
   var nombreEvidenciaAuxiliar1 = $("#inputEviActProcActAltRiesgoProy").val();
   
   var habilitarEviAux1 = (tipoActividadId == 7?1:0);
   
   hallarEstadoImplementacionActividad();
   
   if(nombreEvidencia == "VOLVER A SUBIR" || nombreEvidenciaAuxiliar1 == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
      campoVacio = false;
   }
		
    if(campoVacio){
        var dataParam={
	    puntaje:puntaje,id:actividadProyectoId,expositor:expositor,duracion:duracion,numTrabajadores:numTrabajadores,
	    categoria:categoria,descripcion:descripcion,tipo:{id:tipoActividadId},fechaPlanificada:convertirFechaTexto(fecha),
	    observacion:observacion,estado:estadoActividadProy,proyecto:{id:proyectoObj.id}
        };

        callAjaxPostSimpleVersionDos(1,URL+'/contratista/proyecto/actividad/save',dataParam,1,0,function(data){
          if(data.CODE_RESPONSE == "05"){
            guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviActividadProy",bitsEvidenciaArchivoCurso,
	    0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia/save","proyecto-has-actividad/evidencia",function(){
	      guardarEvidenciaAutoVersionS3(habilitarEviAux1,data.nuevoId,"fileEviActProcActAltRiesgoProy",bitsEvidenciaArchivoCurso,
	      0,1,"/contratista/amazon_s3/proyecto/actividad/evidencia_auxiliar_1/save","proyecto-has-actividad/evidencia-auxiliar-1",function(){
	        mensajeUx="<label>El registro de la actividad fue guardado con éxito.<label>";
		mensajesUx(mensajeUx,1,"","ActualizarActProyAsig");
		      
		$("#modalMensajeUxActualizarActProyAsig").on("hidden.bs.modal",function(){
	            volverDivSubContenido();cargarActProyectosSeguridad(indexPostulante,tipoActividadId,true);
								
	            if(functionCallBack != null){
		        functionCallBack();
	            }
		});	    
	      });
	    });
          }else{	
	       alert("Ocurrió un error al guardar el documento a nivel proyecto!");
          }
        });
    }else{
      mensajesUx(mensajeUx,2,"","");
   } 
}

function cancelarNuevoActProyecto(){
   cargarActProyectosSeguridad();
}

function hallarEstadoImplementacionActividad(){
   var fechaPlanificada = $("#inputFecPlanActProy").val();
   var fechaReal = convertirFechaInput(actividadProyObj.fechaReal);
   var fechaHoy = obtenerFechaActual();
	
   if(fechaReal!=''){
      estadoActividadProy={
         id: 2,
         nombre: "Completado"
      };
   }else{
      if(fechaPlanificada != ""){
         var dif = restaFechas(fechaHoy,fechaPlanificada);
//	 console.log(dif);
         if(dif < 0){
	    estadoActividadProy={
	       id: 3,
	       nombre: "Retrasado"
	    };
         }else{
	    estadoActividadProy={
	       id: 1,
	       nombre: "Por Implementar"
	    };
         }
      }else{
         estadoActividadProy={
            id: 1,
            nombre: "Por Implementar"
         };
      }
   }
	
   $("#actpes"+actividadProyectoId).html(estadoActividadProy.nombre);	
}

var proyectoId;

function ocultarRegistroActividadProyectoVersionDos(){
   $("#modalRegistroActividadProy").modal("hide");
}

function registroActividadProyectoVersionDos(pIndex,pTipoId,esNuevo,pIndexActProy){
    $("#modalRegistroActividadProy").remove();
    
    proyectoId = listFullProyectoSeguridad[pIndex].id;indexPostulante = pIndex;tipoActividadId = parseInt(pTipoId);
   
    if(parseInt(esNuevo) == 0){
        actividadProyectoId = listFullActProyectoSeguridad[pIndexActProy].id;actividadProyObj = listFullActProyectoSeguridad[pIndexActProy];
    }else{
        actividadProyectoId = 0;
    }
    
   	var dataParam={
        id:proyectoObj.id,contratistaId:parseInt(getSession("contratistaGosstId")),tipoActividadId:tipoActividadId
   	};
    
    callAjaxPost(URL+'/contratista/proyecto/actividades/valores',dataParam,function(data){  
        listPrevencionistasAct = data.listPrevencionista;
      
      	if(parseInt(esNuevo) == 0){
	 		var prevensId = actividadProyObj.listPrevencionistasId.split(",");       	                               			
	 
	 		listPrevencionistasAct.forEach(function(val1){
	    		val1.selected = 0;
		                		
	    		prevensId.forEach(function(val){
	       			if(val == val1.id){
	          			val1.selected = 1;
	       			}
	    		});
	 		});
      	}
      
      	var listBooleanSiNo = listBoolean.sort(function(val,val2){
	 		return val2.id - val.id;
      	});
      
      	var btnOcultarEviAtsSimple = 
            "<a class='btn-gestion efectoLink' onclick='cambiarEvidenciaAtsCronogramaTrabajo(1)'>" +
	    	    "<i class='fa fa-exchange' aria-hidden='true'></i> Cambiar a evidencia múltiple" +
	 		"</a>";
      
      	var btnOcultarEviAtsMultiple = 
            "<a class='btn-gestion efectoLink' onclick='cambiarEvidenciaAtsCronogramaTrabajo(0)'>" +
	    	    "<i class='fa fa-exchange' aria-hidden='true'></i> Cambiar a evidencia simple" +
	 		"</a>";
      
      	var btnOcultarEviProcTrabSimple = 
         	"<a class='btn-gestion efectoLink' onclick='cambiarEvidenciaProcTrabCronogramaTrabajo(1)'>" +
	    		"<i class='fa fa-exchange' aria-hidden='true'></i> Cambiar a evidencia múltiple" +
	 		"</a>";
      
      	var btnOcultarEviProcTrabMultiple = 
         	"<a class='btn-gestion efectoLink' onclick='cambiarEvidenciaProcTrabCronogramaTrabajo(0)'>" +
	    		"<i class='fa fa-exchange' aria-hidden='true'></i> Cambiar a evidencia simple" +
	 		"</a>";
      
      	var listItems=[
         	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha Inicio",inputForm:"<input type='date' id='fechaInicioActProy' class='form-control'>"},
	 		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha Fin",inputForm:"<input type='date' id='fechaFinActProy' class='form-control'>"},
	 		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
	    ];
		
		if(tipoActividadId == 12){
			var respActAltRiesgo = (actividadProyectoId == 0?proyectoObj.habilitadoPrevencionista:actividadProyObj.incluyeTrabAltoRiesgo);
			      
			var radiosRespActividadAltRiesgo = crearRadiosAutoVersionDos("radiosRespActividadAltRiesgo",
			    listBooleanSiNo,respActAltRiesgo,"id","nombre","habilitarCamposAsociadosTrabajoAltoRiesgo","");
			
		    listItems.push({sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",styleAux:"display:none;",
	  		     label:"¿Incluye trabajos de alto riesgo?",inputForm:radiosRespActividadAltRiesgo},
	 		    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",styleAux:"display:none;",divContainer:"",clase:""},
	 			{sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",clase:"campos-trabajoAltoRiesgoCronTrab prevencionista-trabajoAltoRiesgoCronTrab",
	  		 	 label:"Prevencionistas",inputForm:"",divContainer:"divPrevencionistasAproCronTrab"},
	 			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:"",clase:"campos-trabajoAltoRiesgoCronTrab prevencionista-trabajoAltoRiesgoCronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-simpleRespCronTrab",anchoLabel:"col-sm-6",
	  		 	 anchoDiv:"col-sm-6",label:"Análisis de trabajo seguro",inputForm:btnOcultarEviAtsSimple},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-simpleRespCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"Evidencia simple",inputForm:"",divContainer:"divEvidenciaSimpleCronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespCronTrab",anchoLabel:"col-sm-6",
	  		 	 anchoDiv:"col-sm-6",label:"Análisis de trabajo seguro",inputForm:btnOcultarEviAtsMultiple},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"Evidencia múltiple*",inputForm:"",divContainer:"divEvidenciaMultiACronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"*Adicional #01",inputForm:"",divContainer:"divEvidenciaMultiBCronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"*Adicional #02",inputForm:"",divContainer:"divEvidenciaMultiCCronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespCronTrab",anchoLabel:"",
	         	 anchoDiv:"",label:"*Adicional #03",inputForm:"",divContainer:"divEvidenciaMultiDCronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"*Adicional #04",inputForm:"",divContainer:"divEvidenciaMultiECronTrab"},
	 			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:"",
	  		 	 clase:"campos-trabajoAltoRiesgoCronTrab prevencionista-trabajoAltoRiesgoCronTrab"},
         		{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-simpleRespProcTrabCronTrab",anchoLabel:"col-sm-6",
          	 	 anchoDiv:"col-sm-6",label:"Procedimiento de trabajo",inputForm:btnOcultarEviProcTrabSimple},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-simpleRespProcTrabCronTrab",anchoLabel:"",
          	 	 anchoDiv:"",label:"Evidencia simple",inputForm:"",divContainer:"divEvidenciaSimpleProcTrabCronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespProcTrabCronTrab",anchoLabel:"col-sm-6",
	  		 	 anchoDiv:"col-sm-6",label:"Procedimiento de trabajo",inputForm:btnOcultarEviProcTrabMultiple},
         		{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespProcTrabCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"Evidencia múltiple*",inputForm:"",divContainer:"divEvidenciaMultiAProcTrabCronTrab"},
         		{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespProcTrabCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"*Adicional #01",inputForm:"",divContainer:"divEvidenciaMultiBProcTrabCronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespProcTrabCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"*Adicional #02",inputForm:"",divContainer:"divEvidenciaMultiCProcTrabCronTrab"},
         		{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespProcTrabCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"*Adicional #03",inputForm:"",divContainer:"divEvidenciaMultiDProcTrabCronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab evidencia-multipleRespProcTrabCronTrab",anchoLabel:"",
	  		 	 anchoDiv:"",label:"*Adicional #04",inputForm:"",divContainer:"divEvidenciaMultiEProcTrabCronTrab"},
	 			{sugerencia:"",clase:"campos-trabajoAltoRiesgoCronTrab",anchoLabel:"",anchoDiv:"",label:"",inputForm:""});
		}	
			
	    listItems.push({sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"divEvidenciaActProy"},
         	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroActividadProyectoVersionDos()'>" +
	                   "<i class='fa fa-times'></i> Cancelar" +
	         	   "</button>",
          	 inputForm:"<button type='submit' class='btn btn-success'style='float:right;font-size:18px;'>" +
    		    		   "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
    		 		   "</button>"});
        
    	var textForm = "";
       
      	listItems.forEach(function(val){
         	textForm += obtenerSubPanelModuloVersionDos(val);
      	});
     	
      	var opciones={
         	id:"modalRegistroActividadProy",nombre:"<i class='fa fa-pencil'></i> Registro Cronograma de trabajo",
         	contenido:"<form id='formRegistroActProy' class='eventoGeneral'>"+textForm+"</form>"
      	};
       
      	crearModalPrincipalUsuario(opciones,function(){
	 		if(tipoActividadId == 12){
	    		if($("#selMulPrevencionistasAproCronTrab").length > 0){
	       			return;	
	    		} 
	     
	    		crearSelectOneMenuObligMultipleCompleto("selMulPrevencionistasAproCronTrab","",listPrevencionistasAct,
	       			"id","trabajadoresNombre","#divPrevencionistasAproCronTrab","Todos");
	 		}
      	},true,true);
      
      	var options={
         	container:"#divEvidenciaActProy",functionCall:function(){
	            validacionSubirEvidencia("ActTipoProy",bitsEvidenciaActividad,"modalRegistroActividadProy");
	 		},descargaUrl:(actividadProyectoId == 0?"":(actividadProyObj.evidenciaNombre.length == 0?"":
			    "/contratista/amazon_s3/proyecto/actividad/evidencia?id="+actividadProyectoId)),
	 		esNuevo:(actividadProyectoId == 0?true:(actividadProyObj.evidenciaNombre.length == 0?true:false)),
	 		idAux:"ActTipoProy",evidenciaNombre:(actividadProyectoId == 0?"":actividadProyObj.evidenciaNombre)
      	};
					
      	crearFormEvidenciaCompleta(options);
      
      	if(parseInt(esNuevo) == 0){
	 		$("#fechaInicioActProy").val(convertirFechaInput(actividadProyObj.fechaPlanificada)); 
	 		$("#fechaFinActProy").val(convertirFechaInput(actividadProyObj.fechaFinVigencia)); 
      	}

      	if(tipoActividadId == 12){
        	habilitarCamposAsociadosTrabajoAltoRiesgo((actividadProyectoId == 0?proyectoObj.habilitadoPrevencionista:actividadProyObj.incluyeTrabAltoRiesgo));
      	}
        
      	var editarDiv = $("#formRegistroActProy");
     	
      	editarDiv.on('submit',function(e){  
            e.preventDefault();guardarRegistroActividadProyectoVersionDos();
      	});
    });	
}

function habilitarCamposAsociadosTrabajoAltoRiesgo(value){
   var respAts = (actividadProyectoId == 0?0:(actividadProyObj.evidenciaSimpleNombre.length == 0?1:0)),
       respProcTrab = (actividadProyectoId == 0?0:(actividadProyObj.evidenciaSimple1Nombre.length == 0?1:0));
    
   cambiarEvidenciaAtsCronogramaTrabajo(respAts);cambiarEvidenciaProcTrabCronogramaTrabajo(respProcTrab);
    
   if(value == 0){
      $(".campos-trabajoAltoRiesgoCronTrab").hide();
   }
}

function cambiarEvidenciaAtsCronogramaTrabajo(opcionEvi){
   $("#divEvidenciaSimpleCronTrab").html("");$("#divEvidenciaMultiACronTrab").html("");
   $("#divEvidenciaMultiBCronTrab").html("");$("#divEvidenciaMultiCCronTrab").html("");
   $("#divEvidenciaMultiDCronTrab").html("");$("#divEvidenciaMultiECronTrab").html("");
   
   var optionsEviSimple={
      container: "#divEvidenciaSimpleCronTrab",
      functionCall: function(){
         validacionSubirEvidencia("SimpleCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 1?"":
         (actividadProyObj.evidenciaSimpleNombre.length == 0?"":
          "/contratista/amazon_s3/proyecto/actividad/evidencia_simple?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 1?true:
	 (actividadProyObj.evidenciaSimpleNombre.length == 0?true:false)),
      idAux: "SimpleCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 1?
	 "":actividadProyObj.evidenciaSimpleNombre)
   };
		 			
   crearFormEvidenciaCompleta(optionsEviSimple);
       
   var optionsEviA={
      container: "#divEvidenciaMultiACronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiACronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },	
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaANombre.length == 0?"":
          "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_a?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaANombre.length == 0?true:false)),
      idAux: "MultiACronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
         "":actividadProyObj.evidenciaANombre)
   };
	 			
   crearFormEvidenciaCompleta(optionsEviA); 
	    
   var optionsEviB={
      container: "#divEvidenciaMultiBCronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiBCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaBNombre.length == 0?"":
	  "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_b?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaBNombre.length == 0 ?true:false)),
      idAux: "MultiBCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
	 "":actividadProyObj.evidenciaBNombre)
   };
		 			
   crearFormEvidenciaCompleta(optionsEviB); 
	      
   var optionsEviC={
      container: "#divEvidenciaMultiCCronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiCCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },	
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaCNombre.length == 0?"":
          "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_c?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaCNombre.length == 0?true:false)),
      idAux: "MultiCCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
	 "":actividadProyObj.evidenciaCNombre)
   };
			 			
   crearFormEvidenciaCompleta(optionsEviC); 
		      
   var optionsEviD={
      container: "#divEvidenciaMultiDCronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiDCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaDNombre.length == 0?"":
	  "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_d?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaDNombre.length == 0?true:false)),
      idAux: "MultiDCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
	 "":actividadProyObj.evidenciaDNombre)
   };
				 			
   crearFormEvidenciaCompleta(optionsEviD); 
			      
   var optionsEviE={
      container: "#divEvidenciaMultiECronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiECronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },	
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaENombre.length == 0?"":
          "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_e?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaENombre.length == 0?true:false)),
      idAux: "MultiECronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
	 "":actividadProyObj.evidenciaENombre)
   };
					 			
   crearFormEvidenciaCompleta(optionsEviE); 
      
   if(parseInt(opcionEvi) == 1){
      $(".evidencia-simpleRespCronTrab").hide();
      $(".evidencia-multipleRespCronTrab").show();
   }else{
      $(".evidencia-simpleRespCronTrab").show();
      $(".evidencia-multipleRespCronTrab").hide();
   }
   
   $(".prevencionista-trabajoAltoRiesgoCronTrab").show();
}

function cambiarEvidenciaProcTrabCronogramaTrabajo(opcionEvi){
   $("#divEvidenciaSimpleProcTrabCronTrab").html("");$("#divEvidenciaMultiAProcTrabCronTrab").html("");
   $("#divEvidenciaMultiBProcTrabCronTrab").html("");$("#divEvidenciaMultiCProcTrabCronTrab").html("");
   $("#divEvidenciaMultiDProcTrabCronTrab").html("");$("#divEvidenciaMultiEProcTrabCronTrab").html("");
   
   var optionsEviSimple={
      container: "#divEvidenciaSimpleProcTrabCronTrab",
      functionCall: function(){
         validacionSubirEvidencia("SimpleProcTrabCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 1?"":
         (actividadProyObj.evidenciaSimple1Nombre.length == 0?"":
          "/contratista/amazon_s3/proyecto/actividad/evidencia_simple1?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 1?true:
	 (actividadProyObj.evidenciaSimple1Nombre.length == 0?true:false)),
      idAux: "SimpleProcTrabCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 1?
	 "":actividadProyObj.evidenciaSimple1Nombre)
   };
		 			
   crearFormEvidenciaCompleta(optionsEviSimple);
       
   var optionsEviA={
      container: "#divEvidenciaMultiAProcTrabCronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiAProcTrabCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },	
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaA1Nombre.length == 0?"":
          "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_a1?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaA1Nombre.length == 0?true:false)),
      idAux: "MultiAProcTrabCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
	 "":actividadProyObj.evidenciaA1Nombre)
   };
	 			
   crearFormEvidenciaCompleta(optionsEviA); 
	    
   var optionsEviB={
      container: "#divEvidenciaMultiBProcTrabCronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiBProcTrabCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaB1Nombre.length == 0?"":
	  "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_b1?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaB1Nombre.length == 0?true:false)),
      idAux: "MultiBProcTrabCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
	 "":actividadProyObj.evidenciaB1Nombre)
   };
		 			
   crearFormEvidenciaCompleta(optionsEviB); 
	      
   var optionsEviC={
      container: "#divEvidenciaMultiCProcTrabCronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiCProcTrabCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },	
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaC1Nombre.length == 0?"":
          "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_c1?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaC1Nombre.length == 0?true:false)),
      idAux: "MultiCProcTrabCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
	 "":actividadProyObj.evidenciaC1Nombre)
   };
			 			
   crearFormEvidenciaCompleta(optionsEviC); 
		      
   var optionsEviD={
      container: "#divEvidenciaMultiDProcTrabCronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiDProcTrabCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaD1Nombre.length == 0?"":
	  "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_d1?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaD1Nombre.length == 0?true:false)),
      idAux: "MultiDProcTrabCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
	 "":actividadProyObj.evidenciaD1Nombre)
   };
				 			
   crearFormEvidenciaCompleta(optionsEviD); 
			      
   var optionsEviE={
      container: "#divEvidenciaMultiEProcTrabCronTrab",
      functionCall: function(){
	 validacionSubirEvidencia("MultiEProcTrabCronTrab",bitsEvidenciaActividad,
            "modalRegistroActividadProy");
      },	
      descargaUrl: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?"":
	 (actividadProyObj.evidenciaE1Nombre.length == 0?"":
          "/contratista/amazon_s3/proyecto/actividad/evidencia_multi_e1?id="+actividadProyectoId)),
      esNuevo: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?true:
	 (actividadProyObj.evidenciaE1Nombre.length == 0?true:false)),
      idAux: "MultiEProcTrabCronTrab",
      evidenciaNombre: (actividadProyectoId == 0 || parseInt(opcionEvi) == 0?
	 "":actividadProyObj.evidenciaE1Nombre)
   };
					 			
   crearFormEvidenciaCompleta(optionsEviE); 
      
   if(parseInt(opcionEvi) == 1){
      $(".evidencia-simpleRespProcTrabCronTrab").hide();
      $(".evidencia-multipleRespProcTrabCronTrab").show();
   }else{
      $(".evidencia-simpleRespProcTrabCronTrab").show();
      $(".evidencia-multipleRespProcTrabCronTrab").hide();
   }
   
   $(".prevencionista-trabajoAltoRiesgoCronTrab").show();
}

function guardarRegistroActividadProyectoVersionDos(){
   var campoVacio = true;
   
   var fechaInicio = convertirFechaTexto($("#fechaInicioActProy").val());
   var inputFechaInicio = (!fechaInicio?null:fechaInicio);
   
   var fechaFin = convertirFechaTexto($("#fechaFinActProy").val());
   var inputFechaFin = (!fechaFin?null:fechaFin);
   
   var numDiasVigencia = restaFechas($("#fechaInicioActProy").val(),$("#fechaFinActProy").val());
 
   var nombreEvidencia = $("#inputEviActTipoProy").val();
    
   if(tipoActividadId == 12){
      var incluyeTrabAltoRiesgo = parseInt($("input[name='radiosRespActividadAltRiesgo']:checked").val());
      
      if(incluyeTrabAltoRiesgo == 1){
	 var listPrevencionistasId = [];
	 var prevencionistasId = $("#selMulPrevencionistasAproCronTrab").val();
	             
	 if(prevencionistasId != null){
	    prevencionistasId.forEach(function(val){
	       listPrevencionistasId.push({
	          id: parseInt(val)
	       });
	    });
	 } 
	 
	 var nombreEviSimpleAts = $("#inputEviSimpleCronTrab").val(),nombreEviMultiAAts = $("#inputEviMultiACronTrab").val(),
	     nombreEviMultiBAts = $("#inputEviMultiBCronTrab").val(),nombreEviMultiCAts = $("#inputEviMultiCCronTrab").val(),
	     nombreEviMultiDAts = $("#inputEviMultiDCronTrab").val(),nombreEviMultiEAts = $("#inputEviMultiECronTrab").val();
	 
	 var nombreEviSimpleProcTrab = $("#inputEviSimpleProcTrabCronTrab").val(),nombreEviMultiAProcTrab = $("#inputEviMultiAProcTrabCronTrab").val(),
	     nombreEviMultiBProcTrab = $("#inputEviMultiBProcTrabCronTrab").val(),nombreEviMultiCProcTrab = $("#inputEviMultiCProcTrabCronTrab").val(),
	     nombreEviMultiDProcTrab = $("#inputEviMultiDProcTrabCronTrab").val(),nombreEviMultiEProcTrab = $("#inputEviMultiEProcTrabCronTrab").val();
	  
	 if(inputFechaInicio == null || inputFechaFin == null || nombreEvidencia.length == 0 || listPrevencionistasId.length == 0 ||
	    (nombreEviSimpleAts.length == 0 && nombreEviMultiAAts.length == 0 && nombreEviMultiBAts.length == 0 && nombreEviMultiCAts.length == 0 &&
             nombreEviMultiDAts.length == 0 && nombreEviMultiEAts.length == 0) || (nombreEviSimpleProcTrab.length == 0 && 
            nombreEviMultiAProcTrab.length == 0 && nombreEviMultiBProcTrab.length == 0 && nombreEviMultiCProcTrab.length == 0 && 
            nombreEviMultiDProcTrab.length == 0 && nombreEviMultiEProcTrab.length == 0)){
	    campoVacio = false;
	    mensajeUx = "<label>Debe completar todos los campos activos [en caso de ser evidencia múltiple, " +
	    		"debe subir al menos una].</label>";
	 }else if(numDiasVigencia < 0){
	    campoVacio = false;
	    mensajeUx = "<label>La 'fecha fin' no puede ser menor que la 'fecha inicio'.</label>";
	 }else if(nombreEviSimpleAts == "VOLVER A SUBIR" || nombreEviMultiAAts == "VOLVER A SUBIR" || nombreEviMultiBAts == "VOLVER A SUBIR" || 
	    nombreEviMultiCAts == "VOLVER A SUBIR" || nombreEviMultiDAts == "VOLVER A SUBIR" || nombreEviMultiEAts == "VOLVER A SUBIR" || 
	    nombreEviSimpleProcTrab == "VOLVER A SUBIR" || nombreEviMultiAProcTrab == "VOLVER A SUBIR" || nombreEviMultiBProcTrab == "VOLVER A SUBIR" || 
	    nombreEviMultiCProcTrab == "VOLVER A SUBIR" || nombreEviMultiDProcTrab == "VOLVER A SUBIR" || nombreEviMultiEProcTrab == "VOLVER A SUBIR" ||
	    nombreEvidencia == "VOLVER A SUBIR"){
	    campoVacio = false;
	    mensajeUx = "<label>Una de las evidencias está con la observación 'VOLVER A SUBIR'.</label>"; 
	 }
      }else{
	 if(inputFechaInicio == null || inputFechaFin == null || nombreEvidencia.length == 0 || isNaN(incluyeTrabAltoRiesgo)){
	    campoVacio = false;
	    mensajeUx = "<label>Debe completar todos los campos activos.</label>";  
	 }else if(numDiasVigencia < 0){
	    campoVacio = false;
	    mensajeUx = "<label>La 'fecha fin' no puede ser menor que la 'fecha inicio'.</label>";
         }else if(nombreEvidencia == "VOLVER A SUBIR"){
	    campoVacio = false;
            mensajeUx = "<label>La evidencia está con la observación 'VOLVER A SUBIR'.</label>";  
	 }
      }
   }
      
    if(campoVacio){
        var dataParam={	 
 	    id:actividadProyectoId,tipo:{id:tipoActividadId},fechaPlanificada:inputFechaInicio,
 	    fechaFinVigencia:inputFechaFin,proyecto:{id:proyectoId},estado:{id:2}
        };
      
        if(tipoActividadId == 12){
            dataParam.incluyeTrabAltoRiesgo = incluyeTrabAltoRiesgo;
	  
            if(incluyeTrabAltoRiesgo == 1){
        	dataParam.listPrevencionistas = listPrevencionistasId;
            }
            
            callAjaxPostSimpleVersionDos(1,URL+'/contratista/proyecto/actividad/version_dos/save',dataParam,1,0,function(data){
              if(data.CODE_RESPONSE == "05"){
                guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviSimpleCronTrab",bitsEvidenciaActividad,
      	        0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_simple/save","proyecto-has-actividad/evidencia-simple",function(){
      	          guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiACronTrab",bitsEvidenciaActividad,
      	          0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_a/save","proyecto-has-actividad/evidencia-a",function(){
      	            guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiBCronTrab",bitsEvidenciaActividad,
            	    0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_b/save","proyecto-has-actividad/evidencia-b",function(){
      	              guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiCCronTrab",bitsEvidenciaActividad,
      	              0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_c/save","proyecto-has-actividad/evidencia-c",function(){
      	        	guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiDCronTrab",bitsEvidenciaActividad,
      	      	        0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_d/save","proyecto-has-actividad/evidencia-d",function(){
      	        	  guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiECronTrab",bitsEvidenciaActividad,
      	      	      	  0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_e/save","proyecto-has-actividad/evidencia-e",function(){
      	        	    guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviSimpleProcTrabCronTrab",bitsEvidenciaActividad,
            	      	    0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_simple1/save","proyecto-has-actividad/evidencia-simple1",function(){
      	        	      guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiAProcTrabCronTrab",bitsEvidenciaActividad,
      	            	      0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_a1/save","proyecto-has-actividad/evidencia-a1",function(){
      	        		guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiBProcTrabCronTrab",bitsEvidenciaActividad,
      	      	            	0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_b1/save","proyecto-has-actividad/evidencia-b1",function(){
      	        		  guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiCProcTrabCronTrab",bitsEvidenciaActividad,
      	      	      	          0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_c1/save","proyecto-has-actividad/evidencia-c1",function(){
      	        		    guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiDProcTrabCronTrab",bitsEvidenciaActividad,
            	      	      	    0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_d1/save","proyecto-has-actividad/evidencia-d1",function(){
      	        		      guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviMultiEProcTrabCronTrab",bitsEvidenciaActividad,
      	            	      	      0,0,"/contratista/amazon_s3/proyecto/actividad/evidencia_multi_e1/save","proyecto-has-actividad/evidencia-e1",function(){
      	        			guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviActTipoProy",bitsEvidenciaActividad,
      	      	            	      	0,1,"/contratista/amazon_s3/proyecto/actividad/evidencia/save","proyecto-has-actividad/evidencia",function(){ 
      	        			    $("#modalRegistroActividadProy").modal("hide");
      	        			    
      	        			    mensajeUx="<label>El registro de la actividad fue guardado con éxito.<label>";
      	                                    mensajesUx(mensajeUx,1,"","ActualizarActProyAsig");
      		      
      	                                    $("#modalMensajeUxActualizarActProyAsig").on("hidden.bs.modal",function(){
      	                                	volverDivSubContenido();cargarActProyectosSeguridad(indexPostulante,tipoActividadId,true);
      								
      	                                	if(functionCallBack != null){
      	                                	    functionCallBack();
      	                                	}
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
      	              });	
      	            });
      	          });
      	        });
            }else{	
      	        alert("Ocurrió un error al guardar el documento a nivel proyecto!");
            }
          });
      }
   }else{
      $("#modalRegistroActividadProy").modal("hide");$.unblockUI();
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposActProy");
       
      $("#modalMensajeUxAvisoCompletarCamposActProy").on("hidden.bs.modal",function(){
         $("#modalRegistroActividadProy").modal("show");
      });
   }
}
