
var eventoHomologacionId,indexeventoHomologacion,eventoHomologacionObj = {};
var listEventosHomologacionContratista = [];
var mensajeUx;

function toggleMenuOpcionHomologacionContratista(obj,pindex){
   eventoHomologacionObj = listEventosHomologacionContratista[pindex];
   indexeventoHomologacion = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesHomologacionContratista=[
   {id: "opcEvaluar",nombre: "<i class='fa fa-pencil-square-o'></i> Evaluar respuestas",
    functionClick: function(data){verPreguntasListaHomologacionContratista()}},
   {id: "opcConsolidado",nombre: "<i class='fa fa-table'></i> Consolidado evaluación respuestas",
    functionClick: function(data){verConsolidadoEvaluacionRespPregListaHomologacionContratista()}}
];

function marcarSubOpcionHomologacionContratista(pindex){
   funcionalidadesHomologacionContratista[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarHomologacionContratista(){
   var dataParam={
      trabajadorId: parseInt(getSession("trabajadorGosstId"))
   };
    
   var listPanelesPrincipal=[];
  	
   callAjaxPost(URL+'/contratista/evento_homologacion/vista_colaborador',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            var textHomologacionFutura="",textHomologacionEnCurso="",textHomologacionFinalizada="";
            var numHomologacionFutura=0,numHomologacionEnCurso=0,numHomologacionFinalizada = 0;
                
            listEventosHomologacionContratista = data.list;
  	    
  	    $(".divListPrincipal").html("");
  	     
  	    listEventosHomologacionContratista.forEach(function(val,index){
  	       var textHomologacionGeneral = "";
  	       var btnOpcion = "",menuOpcion = "";
  	       
  	       if(val.numPreguntas > 0 && val.estadoActual == 2){
	          menuOpcion = "<ul class='list-group listaFinalGestionGosst'>"; 
	             funcionalidadesHomologacionContratista.forEach(function(val1,index1){
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionHomologacionContratista("+index1+")'>" +
				          val1.nombre +
				      "</li>";
	             });		    
	          menuOpcion += "</ul>";
				    
	          btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionHomologacionContratista(this,"+index+")'>" +
			         "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			      "</a>";
  	       }
  	       
	       var estiloGosst = (val.evaluacion.id == 1?"gosst-aprobado":
	                          (val.evaluacion.id == 2?"gosst-desaprobado":"gosst-advertencia"));
  	       
  	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
  		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
  			    "*** DATOS GENERALES ***"+
  			 "</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",
  		   label:"<i class='fa fa-calendar'></i> Fecha y hora de inicio:",
  		   inputForm:val.fechaInicioTexto+" "+val.horaInicioTexto},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  		   label:"<i class='fa fa-calendar'></i> Fecha y hora de fin:",
  		   inputForm:val.fechaFinTexto+" "+val.horaFinTexto},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  		   label:"<i class='fa fa-list'></i> Lista:",
  		   inputForm:val.lista.nombre},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  		   label:"<i class='fa fa-clock-o'></i> Vigencia:",
  		   inputForm:val.lista.tipoVigencia.nombre},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
  	  	   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
  	  	            "*** EVALUACIÓN ***" +
  	  		 "</span>"},
  	  	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	           label:"<i class='fa fa-list-ol'></i> Avance:",
  	           inputForm:val.numPreguntasAprobadas+" / "+val.numPreguntas},
  	  	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	   label:val.evaluacion.icono+" Estado:",
  	  	   inputForm:val.evaluacion.nombre}
  	       ];  
  	       		
  	       textHomologacionGeneral+="<div class='eventoGeneral "+estiloGosst+"'>" +
  	                                   "<form class='eventoGeneral'>";	
  	          listTotal.forEach(function(val,index){
  	             textHomologacionGeneral+=obtenerSubPanelModuloVersionDos(val);
  	          });
  	       textHomologacionGeneral+=   "</form>" +
  		                        "</div>";
  	       
  	       if(val.estadoActual == 1){
  		  textHomologacionFutura += textHomologacionGeneral;
  		  numHomologacionFutura++;
  	       }else if(val.estadoActual == 2){
  		  textHomologacionEnCurso += textHomologacionGeneral;
  		  numHomologacionEnCurso++;
  	       }else{
  		  textHomologacionFinalizada += textHomologacionGeneral;
  		  numHomologacionFinalizada++;
  	       }
  	    });
  	    
     	    listPanelesPrincipal.push(
               {id: "infoMovilHomologacionesFuturas",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
		btnTitleAux:"",nombre:"Homologaciones futuras ("+numHomologacionFutura+")",
		contenido:textHomologacionFutura},
	       {id: "infoMovilHomologacionesEnCurso",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
		btnTitleAux:"",nombre:"Homologaciones en curso ("+numHomologacionEnCurso+")",
		contenido:textHomologacionEnCurso},
	       {id: "infoMovilHomologacionesFinalizadas",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
		btnTitleAux:"",nombre:"Homologaciones finalizadas ("+numHomologacionFinalizada+")",
		contenido:textHomologacionFinalizada});
			
	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
  			
     	    $(".listaFinalGestionGosst").hide();
     	    $(".contenidoFormVisible").hide();
     	    break;
  	     
         default:
  	    alert("nop");
  	    break;
      }
   });
}

function regresarVistaPrincipalHomologacionContratista(){
   $("#modalPreguntasListaHomologacionContratista").modal("hide");
   habilitarHomologacionContratista();    
}

function verPreguntasListaHomologacionContratista(){
   $("#modalPreguntasListaHomologacionContratista").remove();
   $("#modalRespuestasPregListaHomologacionContratista").remove();
    
   var listModal={
      id: "modalPreguntasListaHomologacionContratista",
      nombre: eventoHomologacionObj.lista.nombre+" > Preguntas",
      contenido: "<div id='estadoMovilPrincipalPregListHomCon'></div>"
   };
	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);

   cargarPreguntasListaHomologacionContratista();
}

var listPreguntasHomologacionContratistaEval= [],listTipoCumplimientoHomConEva= [];

function cargarPreguntasListaHomologacionContratista(){
   $("#estadoMovilPrincipalPregListHomCon").html("");
   
   var dataParam={
      id: eventoHomologacionObj.id
   };
   
   var listPanelesPrincipal=[];

   callAjaxPost(URL+'/contratista/evento_homologacion/pregunta',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){ 
	 listPreguntasHomologacionContratistaEval = data.list;
	 listTipoCumplimientoHomConEva = data.tipoEvaluaciones;
         
         var textTotalPreguntas="",numPreguntasCumplen=0,numPreguntasCumplenParcialmente=0,
             numPreguntasSinRespuesta=0;
	  
         listPreguntasHomologacionContratistaEval.forEach(function(val,index){
            var respuestaSimple = (val.respuesta.id == -1?"<label>*Pendiente</label>":val.respuesta.nombre);
            var comentarioContratista = (val.respuesta.id == -1 || val.comentarioContratista.length == 0?
        	                         "------":val.comentarioContratista);
            var evidenciaNombre = (val.respuesta.id == -1?"------":
               (val.evidenciaNombre.length != 0?
	        "<a class='efectoLink' target='_blank' " +
	           "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_simple?id="+val.id+"'>"+
	            val.evidenciaNombre +
	        "</a>":
	        (val.evidenciaANombre.length == 0 && val.evidenciaBNombre.length == 0 && val.evidenciaCNombre.length == 0 && 
	         val.evidenciaDNombre.length == 0 && val.evidenciaENombre.length == 0?"------":
	         (val.evidenciaANombre.length != 0?
	     	  "<a class='efectoLink' target='_blank' " +
	     	     "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_a?id="+val.id+"'>" +
	     	      val.evidenciaANombre +
	     	  "</a>":"") +
	     	 (val.evidenciaBNombre.length != 0?(val.evidenciaANombre.length != 0?"<br><br>":"") +
		  "<a class='efectoLink' target='_blank' " +
	     	     "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_b?id="+val.id+"'>" +
	     	      val.evidenciaBNombre +
	     	  "</a>":"") +
	     	 (val.evidenciaCNombre.length != 0?
	          (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0?"<br><br>":"") +
	          "<a class='efectoLink' target='_blank' " +
		     "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_c?id="+val.id+"'>" +
		      val.evidenciaCNombre +
		  "</a>":"") +
		 (val.evidenciaDNombre.length != 0?
	          (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0 ||
		   val.evidenciaCNombre.length != 0?"<br><br>":"") +
	          "<a class='efectoLink' target='_blank' " +
		     "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_d?id="+val.id+"'>" +
		      val.evidenciaDNombre +
	          "</a>":"") +
	         (val.evidenciaENombre.length != 0?
	          (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0 ||
	           val.evidenciaCNombre.length != 0 || val.evidenciaDNombre.length != 0?"<br><br>":"") +	 
		  "<a class='efectoLink' target='_blank' " +
		     "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_e?id="+val.id+"'>" +
		      val.evidenciaENombre +
		  "</a>":""))));
            var fechaRespuestaTexto = (val.respuesta.id == -1?"------":val.fechaRespuestaTexto);
            
            var selCumplPreguntaEventoHomologacion = crearSelectOneMenuOblig("selCumplPreguntaEventoHomologacion"+val.id,
               "verIconoAcuerdoEvalPregEventoHomologacion(this)",listTipoCumplimientoHomConEva,val.tipoCumplimiento.id,"id","nombre");
            
            var comentarioEvaluacion = (val.respuesta.id == -1?"------":
               "<textarea id='textAreaComentarioPreguntaEventoHomologacion"+val.id+"' class='form-control' rows='3'>" +
                   val.comentario +
               "</textarea>");
            
            var listTotal=[
	       {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
                label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
                         "*** PREGUNTA #"+(index+1)+" ***" +
                      "</span>"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
		label:val.pregunta.nombre,inputForm:""},
	       {sugerencia:"",label:"<i class='fa fa-list-ul'></i> Sección:",
	        inputForm:val.pregunta.seccion.nombre},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",label:"<i class='fa fa-pencil'></i> Respuesta:",
		inputForm:respuestaSimple},
	       {sugerencia:"",label:"<i class='fa fa-comment'></i> Comentario:",
		inputForm:comentarioContratista},
	       {sugerencia:"",label:"<i class='fa fa-download'></i> Evidencia(s):",
		inputForm:evidenciaNombre}
	    ]; 
            
            if(val.respuesta.id != -1){
               listTotal.push(
         	  {sugerencia:"",label:"<i class='fa fa-calendar'></i> Respondido el",
         	   inputForm:fechaRespuestaTexto},
         	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         	  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
                   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
                            "*** EVALUACIÓN DE LA RESPUESTA ***" +
                         "</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
       	          {sugerencia:"",label:"Evaluación:",
       		   inputForm:"<label>"+val.tipoCumplimiento.icono+"</label>"+selCumplPreguntaEventoHomologacion},
                  {sugerencia:"",label:"<i class='fa fa-exclamation-circle'></i> Observación:",
        	   inputForm:comentarioEvaluacion},
        	  {sugerencia:"",label:"<i class='fa fa-calendar'></i> Evaluado el",
             	   inputForm:val.fechaEvaluacionTexto+(val.usuarioEvaluacion.nombre.length != 0?
             		                               "<br>(Por "+val.usuarioEvaluacion.nombre+")":"")});
            }
            
            if(val.tipoCumplimiento.id == 1){
               numPreguntasCumplen++;
            }else if(val.tipoCumplimiento.id == 2){
               numPreguntasCumplenParcialmente++;
            }
            
            if(val.respuesta.id == -1){
               numPreguntasSinRespuesta++;
            }
            	
            textTotalPreguntas+= "<div class='eventoGeneral'>" +
 		                      "<form class='eventoGeneral'>";	   					
               listTotal.forEach(function(val,index){
                  textTotalPreguntas += obtenerSubPanelModuloVersionDos(val);
               });
            textTotalPreguntas+=    "</form>" +
 	                         "</div>";
         });
         
         listPanelesPrincipal.push(
       	    {id:"infoMovilPregListHomConRegistradas",clase:"",styleAux:"",buttonAd:"",
       	     nombre:"Avance ("+(numPreguntasCumplen+numPreguntasCumplenParcialmente) +
       	            " / "+listPreguntasHomologacionContratistaEval.length+")",
       	     contenido:textTotalPreguntas});
              
         agregarPanelesDivPrincipalModalVersionDos(listPanelesPrincipal,"estadoMovilPrincipalPregListHomCon");
         
         if(eventoHomologacionObj.estadoActual == 2){
            var textOpcionRespFinal =
      	       "<div class='divInformacionCurso' style='padding:20px;'>" +
                  "<button type='button' class='btn btn-danger' style='font-size:18px;' " +
     	                  "onclick='regresarVistaPrincipalHomologacionContratista()'>" +
     	             "<i class='fa fa-times'></i> Cancelar" +
     	          "</button>" +
     	           (numPreguntasSinRespuesta > 0?"":
     	            "<button type='button' class='btn btn-success' style='float:right;font-size:18px;' " +
                            "onclick='prepararGuardarEvaluacionesPreguntaEventoHomologacion(0)'>" +
                       "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
                    "</button>") +
               "</div>";
      	      
      	    $("#estadoMovilPrincipalPregListHomCon").append(textOpcionRespFinal);    
    	 }  

         $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
      }else{
         console.log("NOPNPO")
      }
   });   
}

function verConsolidadoEvaluacionRespPregListaHomologacionContratista(){
   $("#modalPreguntasListaHomologacionContratista").remove();
   $(".divContainerGeneral").hide();
   
   tituloAnteriorContratista = $(".divTituloGeneral h4").text();
   
   var buttonVolver = 
      "<button type='button' class='btn btn-success' style='margin-right:10px' " +
 	      "onclick='volverVistaMovil()'>" +
         "<i class='fa fa-2x fa-sign-out fa-rotate-180'></i>" +
      "</button>";
   
   var buttonGuardar = 
      "<button id='btnGuardarEvaRespPregListHomVisCol' class='btn btn-success' " +
              "onclick='prepararGuardarEvaluacionesPreguntaEventoHomologacion(1)' " +
	      "title='Guardar las evaluaciones realizadas a los registros.'>" +
         "<i class='fa fa-save fa-2x'></i>" +
      "</button>";
   
   $("body").append(
      "<div class='container-fluid' id='divEvaluacionRespPregListHomVisCol'>" +
          buttonVolver+buttonGuardar +
         "<div class='wrapper' id='wrapEvalRespPregListHomVisCol'>" +
	    "<table class='table table-striped table-bordered table-hover fixed' " +
		   "id='tblEvalRespPregListHomVisCol' style='min-width:1600px;width:100%;table-layout:fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:400px'>Pregunta</th>" +
	             "<th class='tb-acc' colspan='3' style='width:1050px'>Respuesta del contratista</th>" +
		     "<th class='tb-acc' colspan='3' style='width:1200px'>Evaluación de la respuesta</th>" +
	          "</tr>" +
	          "<tr>" +
	             "<th class='tb-acc'>Respuesta</th>" +
		     "<th class='tb-acc'>Evidencia(s)</th>" +
		     "<th class='tb-acc'>Fecha</th>" +
		     "<th class='tb-acc'>Evaluación</th>" +
		     "<th class='tb-acc'>Última observación realizada</th>" +
		     "<th class='tb-acc'>Fecha</th>" +
	          "</tr>" +
	       "</thead>" +
	       "<tbody>" +
	       "</tbody>" +
	    "</table>" +
         "</div>" +
      "</div>");   
   
   resizeDivWrapper("wrapEvalRespPregListHomVisCol",190);
	    
   $(".divTituloGeneral h4").text("Consolidado Evaluación respuestas (Lista '"+eventoHomologacionObj.lista.nombre+"') " +
      "- Contratista "+eventoHomologacionObj.contratista.nombre);
   
   cargarConsolidadoEvaluacionRespPregListaHomologacionContratista();
}

function cargarConsolidadoEvaluacionRespPregListaHomologacionContratista(){
   if(eventoHomologacionObj.numPreguntasRespondidas == 0){
      $("#btnGuardarEvaRespPregListHomVisCol").hide();   
   }
    
   resizeDivWrapper("wrapEvalRespPregListHomVisCol",180);
	
   var dataParam={
      id: eventoHomologacionObj.id
   };
   
   callAjaxPost(URL+"/contratista/evento_homologacion/pregunta",dataParam,function(data){
      listPreguntasHomologacionContratistaEval = data.list;
      listTipoCumplimientoHomConEva = data.tipoEvaluaciones;
      
      $("#tblEvalRespPregListHomVisCol tbody tr").remove();
		
      listPreguntasHomologacionContratistaEval.forEach(function(val,index){
         var selCumplPreguntaEventoHomologacion = crearSelectOneMenuOblig("selCumplPreguntaEventoHomologacion"+val.id,
            "verIconoAcuerdoEvalPregEventoHomologacion(this)",listTipoCumplimientoHomConEva,val.tipoCumplimiento.id,"id","nombre");
         
         var respuestaSimple = (val.respuesta.id == -1?"<label>*Pendiente</label>":val.respuesta.nombre);
         
         var comentarioContratista = (val.respuesta.id == -1?"":
            (val.comentarioContratista.length == 0?"":"<br><br><label style='text-align:left;'>*Comentario:</label> "+val.comentarioContratista));
         
         var evidenciaNombre = (val.respuesta.id == -1?"------":
            (val.evidenciaNombre.length != 0?
	     "<a class='efectoLink' target='_blank' " +
	        "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_simple?id="+val.id+"'>"+
	         val.evidenciaNombre +
	     "</a>":
	     (val.evidenciaANombre.length == 0 && val.evidenciaBNombre.length == 0 && val.evidenciaCNombre.length == 0 && 
	      val.evidenciaDNombre.length == 0 && val.evidenciaENombre.length == 0?"------":
	      (val.evidenciaANombre.length != 0?
	       "<a class='efectoLink' target='_blank' " +
	     	  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_a?id="+val.id+"'>" +
	     	   val.evidenciaANombre +
	       "</a>":"") +
	      (val.evidenciaBNombre.length != 0?(val.evidenciaANombre.length != 0?"<br><br>":"") +
	       "<a class='efectoLink' target='_blank' " +
	     	  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_b?id="+val.id+"'>" +
	     	   val.evidenciaBNombre +
	       "</a>":"") +
	      (val.evidenciaCNombre.length != 0?
	       (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0?"<br><br>":"") +
	       "<a class='efectoLink' target='_blank' " +
		  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_c?id="+val.id+"'>" +
		   val.evidenciaCNombre +
	       "</a>":"") +
	      (val.evidenciaDNombre.length != 0?
	       (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0 ||
		val.evidenciaCNombre.length != 0?"<br><br>":"") +
	       "<a class='efectoLink' target='_blank' " +
		  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_d?id="+val.id+"'>" +
		   val.evidenciaDNombre +
	       "</a>":"") +
	      (val.evidenciaENombre.length != 0?
	       (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0 ||
		val.evidenciaCNombre.length != 0 || val.evidenciaDNombre.length != 0?"<br><br>":"") +
	       "<a class='efectoLink' target='_blank' " +
		  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_e?id="+val.id+"'>" +
		   val.evidenciaENombre +
	       "</a>":""))));
         var fechaRespuestaTexto = (val.respuesta.id == -1?"------":val.fechaRespuestaTexto);
         
         var comentarioEvaluacion = (val.respuesta.id == -1?"------":
            "<textarea id='textAreaComentarioPreguntaEventoHomologacion"+val.id+"' class='form-control' rows='3'></textarea>");
         var fechaEvaluacionTexto = (val.respuesta.id == -1?"------":val.fechaEvaluacionTexto+
            (val.usuarioEvaluacion.nombre.length != 0?"<br>(Por "+val.usuarioEvaluacion.nombre+")":""));

         $("#tblEvalRespPregListHomVisCol tbody").append(
	    "<tr>" +
	       "<td>"+val.pregunta.nombre+"</td>" +
	       "<td style='word-break: break-all;'>" +
	           respuestaSimple +
	           comentarioContratista+"</td>" +
	       "<td>"+evidenciaNombre+"</td>" +
	       "<td>"+fechaRespuestaTexto+"</td>" +
	       "<td>"+(val.respuesta.id == -1?"<label>*Falta la respuesta del contratista.</label>":
		       "<label>"+val.tipoCumplimiento.icono+"</label>" +
		        selCumplPreguntaEventoHomologacion)+"</td>" +
	       "<td>"+comentarioEvaluacion+"</td>" +
	       "<td>"+fechaEvaluacionTexto+"</td>" +
	    "</tr>"); 
 
         $("#textAreaComentarioPreguntaEventoHomologacion"+val.id).val(val.comentario);
      });
		
      goheadfixedY("#tblEvalRespPregListHomVisCol","#wrapEvalRespPregListHomVisCol");
   });
}

function verIconoAcuerdoEvalPregEventoHomologacion(obj){
   var notaId = parseInt($(obj).val());
 	
   listTipoCumplimientoHomConEva.every(function(val){
      if(val.id == notaId){
         $(obj).parent().find("label").html(val.icono);
         return false;
      }
       
      return true;
   });
}

var indiceActualEvalPregListHomCon,redireccionFinalEvalPregListHomCon;

function prepararGuardarEvaluacionesPreguntaEventoHomologacion(opcionFinalizar){
   // opcionFInalizar -> 0 = Modal || 1 -> Consolidado
   redireccionFinalEvalPregListHomCon = opcionFinalizar;
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   indiceActualEvalPregListHomCon = 0;
   guardarEvaluacionesPreguntaEventoHomologacion(guardarEvaluacionesPreguntaEventoHomologacion); 
}

function guardarEvaluacionesPreguntaEventoHomologacion(functionCallBack){
   var cumplimientoId,comentario,actualizarEvaluacion = 0,dataParam;
   
   listPreguntasHomologacionContratistaEval.forEach(function(val,index){
      var comentarioAux = $("#textAreaComentarioPreguntaEventoHomologacion"+val.id).val();
      var cumplimientoIdAux = parseInt($("#selCumplPreguntaEventoHomologacion"+val.id).val());
	  
      if((index + 1) == indiceActualEvalPregListHomCon && (val.comentario != comentarioAux || 
	 val.tipoCumplimiento.id != cumplimientoIdAux)){
	 actualizarEvaluacion = 1;
	  
	 dataParam={
	    id: val.id,
	    comentario: comentarioAux,
	    tipoCumplimiento: {id: cumplimientoIdAux},
	    trabajadorId: parseInt(getSession("trabajadorGosstId"))
	 };
      }
   }); 
   
   if(actualizarEvaluacion == 1){
      callAjaxPostNoUnlockAux(URL+'/contratista/evento_homologacion/respuesta/evaluacion/save',dataParam,function(data){
	 if(indiceActualEvalPregListHomCon == listPreguntasHomologacionContratistaEval.length){
	    $.unblockUI();
	    
	    if(redireccionFinalEvalPregListHomCon == 0){
	       $("#modalPreguntasListaHomologacionContratista").modal("hide"); 
	    }
	    
	    mensajeUx = "<label>La evaluación fue registrada con éxito.</label>";
	    mensajesUx(mensajeUx,1,"","ActPrincipalListaHomVistaCol");
							
	    $("#modalMensajeUxActPrincipalListaHomVistaCol").on("hidden.bs.modal",function(){
	       if(redireccionFinalEvalPregListHomCon == 0){
		  habilitarHomologacionContratista(); 
	       }else{
	          volverVistaMovil();
	          habilitarHomologacionContratista();
	       }
	    });
	 }else{
	    indiceActualEvalPregListHomCon++;
	    functionCallBack(guardarEvaluacionesPreguntaEventoHomologacion);
	 }        	   
      });
   }else{
      if(indiceActualEvalPregListHomCon == listPreguntasHomologacionContratistaEval.length){
         $.unblockUI();
         
	 if(redireccionFinalEvalPregListHomCon == 0){
	    $("#modalPreguntasListaHomologacionContratista").modal("hide"); 
	 }
         
	 mensajeUx = "<label>La evaluación fue registrada con éxito.</label>";
	 mensajesUx(mensajeUx,1,"","ActPrincipalListaHomVistaCol");
						
	 $("#modalMensajeUxActPrincipalListaHomVistaCol").on("hidden.bs.modal",function(){
	    if(redireccionFinalEvalPregListHomCon == 0){
	       habilitarHomologacionContratista(); 
	    }else{
	       volverVistaMovil();
	       habilitarHomologacionContratista();
	    }
	 });
      }else{
         indiceActualEvalPregListHomCon++;
         functionCallBack(guardarEvaluacionesPreguntaEventoHomologacion);
      }      
   }
}
