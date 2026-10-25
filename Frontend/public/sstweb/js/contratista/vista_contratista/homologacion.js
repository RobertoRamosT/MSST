
var eventoHomologacionId,indexeventoHomologacion,eventoHomologacionObj = {};
var listEventosHomologacionContratista = [];
var mensajeUx;

function toggleMenuOpcionHomologacionContratista(obj,pindex){
   eventoHomologacionObj = listEventosHomologacionContratista[pindex];
   indexeventoHomologacion = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesHomologacionContratista=[{
   id: "opcResponder",nombre: "<i class='fa fa-eye'></i> Ver preguntas de la lista",
   functionClick: function(data){verPreguntasListaHomologacionContratista()}}
];

function marcarSubOpcionHomologacionContratista(pindex){
   funcionalidadesHomologacionContratista[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarHomologacionContratista(){
   var dataParam={
      contratistaId: parseInt(getSession("contratistaGosstId"))
   };
    
   var listPanelesPrincipal=[];
  	
   callAjaxPost(URL+'/contratista/evento_homologacion/vista_contratista',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            var textHomologacionFutura="",textHomologacionEnCurso="",textHomologacionFinalizada="";
            var numHomologacionFutura=0,numHomologacionEnCurso=0,numHomologacionFinalizada = 0;
                
            listEventosHomologacionContratista = data.list;
  	    
  	    $(".divListPrincipal").html("");
  	     
  	    listEventosHomologacionContratista.forEach(function(val,index){
  	       var textHomologacionGeneral = "";
  	       var btnOpcion = "",menuOpcion = "";
  	       
  	       if(val.numPreguntas > 0){
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

var listPreguntasHomologacionContratistaEval= [];

function cargarPreguntasListaHomologacionContratista(){
   $("#estadoMovilPrincipalPregListHomCon").html("");
   
   var dataParam={
      id: eventoHomologacionObj.id
   };
   
   var listPanelesPrincipal=[];

   callAjaxPost(URL+'/contratista/evento_homologacion/pregunta',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){ 
	 listPreguntasHomologacionContratistaEval = data.list;
         
         var textTotalPreguntas="",numPreguntasCumplen=0,numPreguntasCumplenParcialmente=0;
	  
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
            
            var estiloGosst = (val.tipoCumplimiento.id == 1?"gosst-aprobado":
               (val.tipoCumplimiento.id == 2?"gosst-observacion":
        	(val.tipoCumplimiento.id == 3?"gosst-desaprobado":"gosst-advertencia")));
            
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
       	          {sugerencia:"",label:val.tipoCumplimiento.icono+" Evaluación:",
       		   inputForm:val.tipoCumplimiento.nombre});
               
               if(val.tipoCumplimiento.id == 2 || val.tipoCumplimiento.id == 3){
        	  listTotal.push(
        	     {sugerencia:"",label:"<i class='fa fa-exclamation-circle'></i> Observación:",
        	      inputForm:val.comentario});
               }
               
               if(val.tipoCumplimiento.id == 1 || val.tipoCumplimiento.id == 2 || val.tipoCumplimiento.id == 3){
         	  listTotal.push(
         	     {sugerencia:"",label:"<i class='fa fa-calendar'></i> Evaluado el",
         	      inputForm:val.fechaEvaluacionTexto+(val.usuarioEvaluacion.nombre.length != 0?
         		                                  "<br>(Por "+val.usuarioEvaluacion.nombre+")":"")});
               }
            }
            
            if(val.tipoCumplimiento.id == 1){
               numPreguntasCumplen++;
            }else if(val.tipoCumplimiento.id == 2){
               numPreguntasCumplenParcialmente++;
            }
            	
            textTotalPreguntas+= "<div class='eventoGeneral "+estiloGosst+"' style='word-break:break-all;'>" +
 		                      "<form class='eventoGeneral'>";	   					
            listTotal.forEach(function(val,index){
               textTotalPreguntas += obtenerSubPanelModuloVersionDos(val);
            });
            textTotalPreguntas+=    "</form>" +
 	                         "</div>";
         });
         
         var textRegresarHomCon =
            "<div id='estadoMovilRegresarVistaPrincipalHomCon'>" +
               "<div class='tituloSubList'> Volver a la vista principal" +
                  "<button style='font-size:19px' title='Regresar a la vista principal de la sección.' " +
                          "class='btn btn-info' onclick='regresarVistaPrincipalHomologacionContratista()'>"+
                     "<i class='fa fa-sign-out fa-rotate-180'></i> Regresar" +
                  "</button>" +
               "</div>" +
            "</div>";
         
         $("#estadoMovilPrincipalPregListHomCon").append(textRegresarHomCon);
         
         if(eventoHomologacionObj.estadoActual == 2){
            var textResponderPreguntas =
               "<div id='estadoMovilResponderPregListHomCon'>" +
                  "<div class='tituloSubList'> Responder preguntas " +
                     "<button style='font-size:19px' title='Responder las preguntas de la lista.' " +
                             "class='btn btn-success' onclick='verRespuestasPregListaHomologacionContratista()'>"+
                        "<i class='fa fa-pencil-square-o'></i> Realizar" +
                     "</button>" +
                  "</div>" +
               "</div>";
         
            $("#estadoMovilPrincipalPregListHomCon").append(textResponderPreguntas);
	 }  
            
         listPanelesPrincipal.push(
       	    {id:"infoMovilPregListHomConRegistradas",clase:"",styleAux:"",buttonAd:"",
       	     nombre:"Avance ("+(numPreguntasCumplen+numPreguntasCumplenParcialmente) +
       	            " / "+listPreguntasHomologacionContratistaEval.length+")",
       	     contenido:textTotalPreguntas});
              
         agregarPanelesDivPrincipalModalVersionDos(listPanelesPrincipal,"estadoMovilPrincipalPregListHomCon");

         $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
      }else{
         console.log("NOPNPO")
      }
   });   
}

function regresarPreguntasListaHomologacionContratista(){
   $("#modalRespuestasPregListaHomologacionContratista").modal("hide");  
   $("#modalPreguntasListaHomologacionContratista").modal("show");    
   cargarPreguntasListaHomologacionContratista();
}

function verRespuestasPregListaHomologacionContratista(){
   $("#modalPreguntasListaHomologacionContratista").modal("hide"); 
   $("#modalRespuestasPregListaHomologacionContratista").remove();
     
   var listModal={
      id: "modalRespuestasPregListaHomologacionContratista",
      nombre: eventoHomologacionObj.lista.nombre+" > Preguntas > Respuestas",
      contenido: "<div id='estadoMovilPrincipalRespPregListHomCon'></div>"
   };
 	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);

   cargarRespuestasPregListaHomologacionContratista();
}

var listPreguntasHomologacionContratistaEvalAux= [];

function cargarRespuestasPregListaHomologacionContratista(){
   $("#estadoMovilPrincipalRespPregListHomCon").html("");
    
   var dataParam={
      id: eventoHomologacionObj.id
   };
    
   callAjaxPost(URL+'/contratista/evento_homologacion/pregunta',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){ 
 	 listPreguntasHomologacionContratistaEvalAux = data.list;
       
 	 var listBooleanSiNo = listBoolean.sort(function(val,val2){
 	    return val2.id - val.id;
 	 });
 	   
 	 listPreguntasHomologacionContratistaEvalAux.forEach(function(val,index){
            var textoRespuesta = "";
            
            var btnOcultarEviSimple = 
               "<a class='btn-gestion efectoLink' onclick='cambiarEvidenciaPregListHomContratista("+index+",1)'>" +
	          "<i class='fa fa-exchange' aria-hidden='true'></i> Cambiar a evidencia múltiple" +
	       "</a>";
            
            var btnOcultarEviMultiple = 
               "<a class='btn-gestion efectoLink' onclick='cambiarEvidenciaPregListHomContratista("+index+",2)'>" +
	          "<i class='fa fa-exchange' aria-hidden='true'></i> Cambiar a evidencia simple" +
	       "</a>";
            
            var respuestaSimpleAux = (val.fechaRespuestaTexto == "------"?"":val.respuesta.id);
 
            var radiosRespPregHomConMovil = crearRadiosAutoVersionDos("radioRespPregListHomCon"+val.id,
               listBooleanSiNo,respuestaSimpleAux,"id","nombre","textoCamposObligatoriosRespPregListHomCon",val.id);
              
            var listTotal=[
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"col-sm-12",
 		label:"",inputForm:radiosRespPregHomConMovil},
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	       {sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",
 		label:"Comentario:<br><span id='auxComentarioRespPregHomCon"+val.id+"'></span>",
 	        inputForm:"<textarea id='textAreaComentarioRespPregHomCon"+val.id+"' " +
 	        		    "class='form-control' rows='5'></textarea>"},
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	       {sugerencia:"",clase:"evidencia-simpleRespPregHomCon"+val.id,anchoLabel:"col-sm-12",
 	 	anchoDiv:"col-sm-0",label:btnOcultarEviSimple,inputForm:""},
 	       {sugerencia:"",clase:"evidencia-simpleRespPregHomCon"+val.id,anchoLabel:"",anchoDiv:"",
 	        label:"Evidencia simple<br><span id='auxEvidenciaSimpleRespPregHomCon"+val.id+"'></span>",
 	        inputForm:"",divContainer:"divEvidenciaSimple"+val.id},
  	       {sugerencia:"",clase:"evidencia-multipleRespPregHomCon"+val.id,anchoLabel:"col-sm-12",
 	 	anchoDiv:"col-sm-0",label:btnOcultarEviMultiple,inputForm:""},
 	       {sugerencia:"",clase:"evidencia-multipleRespPregHomCon"+val.id,anchoLabel:"",anchoDiv:"",
 	 	label:"Evidencia múltiple*<br><span id='auxEvidenciaMultiRespPregHomCon"+val.id+"'></span>",
 	 	inputForm:"",divContainer:"divEvidenciaMultiA"+val.id},
 	       {sugerencia:"",clase:"evidencia-multipleRespPregHomCon"+val.id,anchoLabel:"",anchoDiv:"",
 	 	label:"*Adicional #01",inputForm:"",divContainer:"divEvidenciaMultiB"+val.id},
 	       {sugerencia:"",clase:"evidencia-multipleRespPregHomCon"+val.id,anchoLabel:"",anchoDiv:"",
 	 	label:"*Adicional #02",inputForm:"",divContainer:"divEvidenciaMultiC"+val.id},
 	       {sugerencia:"",clase:"evidencia-multipleRespPregHomCon"+val.id,anchoLabel:"",anchoDiv:"",
 	 	label:"*Adicional #03",inputForm:"",divContainer:"divEvidenciaMultiD"+val.id},
 	       {sugerencia:"",clase:"evidencia-multipleRespPregHomCon"+val.id,anchoLabel:"",anchoDiv:"",
 	 	label:"*Adicional #04",inputForm:"",divContainer:"divEvidenciaMultiE"+val.id}
 	    ]; 
             
            textoRespuesta+= "<div class='eventoGeneral'>" +
  		                "<form class='eventoGeneral'>";	   					
               listTotal.forEach(function(val,index){
                  textoRespuesta += obtenerSubPanelModuloVersionDos(val);
               });
            textoRespuesta+=    "</form>" +
  	                     "</div>";
             
            var listPanelesPrincipal=[
               {id:"infoMovilPregListHomConRespuesta"+val.id,clase:"",
        	styleAux:(val.tipoCumplimiento.id == 1?"display:none;":""),
        	buttonAd:"",nombre:val.tipoCumplimiento.icono+" "+(index+1)+".- "+val.pregunta.nombre,
         	desplegarContenido:(val.tipoCumplimiento.id == 1?0:1),contenido:textoRespuesta}
            ]; 
                
            agregarPanelesDivPrincipalModalVersionDos(listPanelesPrincipal,"estadoMovilPrincipalRespPregListHomCon");
            
            if(val.fechaRespuestaTexto == "------"){
               cambiarEvidenciaPregListHomContratista(index,2);
            }else{
               if(val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0 ||
        	  val.evidenciaCNombre.length != 0 || val.evidenciaDNombre.length != 0 ||
        	  val.evidenciaENombre.length != 0){
        	  cambiarEvidenciaPregListHomContratista(index,1);  
               }else{
        	  cambiarEvidenciaPregListHomContratista(index,2); 
               }
            }
            
            $("#textAreaComentarioRespPregHomCon"+val.id).val(val.comentarioContratista);
            textoCamposObligatoriosRespPregListHomCon(val.respuesta.id,val.id);
 	 }); 
 
 	 var textOpcionRespFinal =
 	    "<div class='divInformacionCurso' style='padding:20px;'>" +
               "<button type='button' class='btn btn-danger' style='font-size:18px;' " +
	               "onclick='regresarPreguntasListaHomologacionContratista()'>" +
	       "<i class='fa fa-times'></i> Cancelar" +
	    "</button>" +
	    "<button type='button' class='btn btn-success' style='float:right;font-size:18px;' " +
                    "onclick='validarRespuestasPregListaHomologacionContratista()'>" +
               "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
            "</button>" +
         "</div>";
 	      
 	 $("#estadoMovilPrincipalRespPregListHomCon").append(textOpcionRespFinal);      
      }else{
         console.log("NOPNPO")
      }
   }); 
}

function textoCamposObligatoriosRespPregListHomCon(valResp,auxId){
   if(parseInt(valResp) == 0){
      document.querySelector('#auxComentarioRespPregHomCon'+auxId).innerText = "(obligatorio)";   
      document.getElementById('auxComentarioRespPregHomCon'+auxId).style.color = "red";
      
      document.querySelector('#auxEvidenciaSimpleRespPregHomCon'+auxId).innerText = "(opcional)";   
      document.getElementById('auxEvidenciaSimpleRespPregHomCon'+auxId).style.color = "blue";
      
      document.querySelector('#auxEvidenciaMultiRespPregHomCon'+auxId).innerText = "(opcional)";   
      document.getElementById('auxEvidenciaMultiRespPregHomCon'+auxId).style.color = "blue";
   }else if(parseInt(valResp) == 1){
      document.querySelector('#auxComentarioRespPregHomCon'+auxId).innerText = "(opcional)";   
      document.getElementById('auxComentarioRespPregHomCon'+auxId).style.color = "blue";
      
      document.querySelector('#auxEvidenciaSimpleRespPregHomCon'+auxId).innerText = "(obligatorio)";   
      document.getElementById('auxEvidenciaSimpleRespPregHomCon'+auxId).style.color = "red";
      
      document.querySelector('#auxEvidenciaMultiRespPregHomCon'+auxId).innerText = "(mínimo una)";   
      document.getElementById('auxEvidenciaMultiRespPregHomCon'+auxId).style.color = "red";
   }
}

function cambiarEvidenciaPregListHomContratista(pindex,opcionEvi){
   var auxRespObj = listPreguntasHomologacionContratistaEvalAux[pindex];
    
   $("#divEvidenciaSimple"+auxRespObj.id).html("");$("#divEvidenciaMultiA"+auxRespObj.id).html("");
   $("#divEvidenciaMultiB"+auxRespObj.id).html("");$("#divEvidenciaMultiC"+auxRespObj.id).html("");
   $("#divEvidenciaMultiD"+auxRespObj.id).html("");$("#divEvidenciaMultiE"+auxRespObj.id).html("");
   
   var optionsEviSimple={
      container: "#divEvidenciaSimple"+auxRespObj.id,
      functionCall: function(){
         validacionSubirEvidencia("Simple"+auxRespObj.id,bitsEvidenciaHomologacion,
            "modalRespuestasPregListaHomologacionContratista");
      },
      descargaUrl: (auxRespObj.evidenciaNombre.length == 0?"":
         "/contratista/evento_homologacion/respuesta/evidencia_simple?id="+auxRespObj.id),
      esNuevo: (auxRespObj.evidenciaNombre.length == 0?true:false),
      idAux: "Simple"+auxRespObj.id,
      evidenciaNombre: auxRespObj.evidenciaNombre
   };
		 			
   crearFormEvidenciaCompleta(optionsEviSimple);
       
   var optionsEviA={
      container: "#divEvidenciaMultiA"+auxRespObj.id,
      functionCall: function(){
	 validacionSubirEvidencia("MultiA"+auxRespObj.id,bitsEvidenciaHomologacion,
            "modalRespuestasPregListaHomologacionContratista");
      },	
      descargaUrl: (auxRespObj.evidenciaANombre.length == 0?"":
         "/contratista/evento_homologacion/respuesta/evidencia_multi_a?id="+auxRespObj.id),
      esNuevo: (auxRespObj.evidenciaANombre.length == 0?true:false),
      idAux: "MultiA"+auxRespObj.id,
      evidenciaNombre: auxRespObj.evidenciaANombre
   };
	 			
   crearFormEvidenciaCompleta(optionsEviA); 
	    
   var optionsEviB={
      container: "#divEvidenciaMultiB"+auxRespObj.id,
      functionCall: function(){
	 validacionSubirEvidencia("MultiB"+auxRespObj.id,bitsEvidenciaHomologacion,
            "modalRespuestasPregListaHomologacionContratista");
      },
      descargaUrl: (auxRespObj.evidenciaBNombre.length == 0?"":
	 "/contratista/evento_homologacion/respuesta/evidencia_multi_b?id="+auxRespObj.id),
      esNuevo: (auxRespObj.evidenciaBNombre.length == 0?true:false),
      idAux: "MultiB"+auxRespObj.id,
      evidenciaNombre: auxRespObj.evidenciaBNombre
   };
		 			
   crearFormEvidenciaCompleta(optionsEviB); 
	      
   var optionsEviC={
      container: "#divEvidenciaMultiC"+auxRespObj.id,
      functionCall: function(){
	 validacionSubirEvidencia("MultiC"+auxRespObj.id,bitsEvidenciaHomologacion,
            "modalRespuestasPregListaHomologacionContratista");
      },	
      descargaUrl: (auxRespObj.evidenciaCNombre.length == 0?"":
         "/contratista/evento_homologacion/respuesta/evidencia_multi_c?id="+auxRespObj.id),
      esNuevo: (auxRespObj.evidenciaCNombre.length == 0?true:false),
      idAux: "MultiC"+auxRespObj.id,
      evidenciaNombre: auxRespObj.evidenciaCNombre
   };
			 			
   crearFormEvidenciaCompleta(optionsEviC); 
		      
   var optionsEviD={
      container: "#divEvidenciaMultiD"+auxRespObj.id,
      functionCall: function(){
	 validacionSubirEvidencia("MultiD"+auxRespObj.id,bitsEvidenciaHomologacion,
            "modalRespuestasPregListaHomologacionContratista");
      },
      descargaUrl: (auxRespObj.evidenciaDNombre.length == 0?"":
	 "/contratista/evento_homologacion/respuesta/evidencia_multi_d?id="+auxRespObj.id),
      esNuevo: (auxRespObj.evidenciaDNombre.length == 0?true:false),
      idAux: "MultiD"+auxRespObj.id,
      evidenciaNombre: auxRespObj.evidenciaDNombre
   };
				 			
   crearFormEvidenciaCompleta(optionsEviD); 
			      
   var optionsEviE={
      container: "#divEvidenciaMultiE"+auxRespObj.id,
      functionCall: function(){
	 validacionSubirEvidencia("MultiE"+auxRespObj.id,bitsEvidenciaHomologacion,
            "modalRespuestasPregListaHomologacionContratista");
      },	
      descargaUrl: (auxRespObj.evidenciaENombre.length == 0?"":
         "/contratista/evento_homologacion/respuesta/evidencia_multi_e?id="+auxRespObj.id),
      esNuevo: (auxRespObj.evidenciaENombre.length == 0?true:false),
      idAux: "MultiE"+auxRespObj.id,
      evidenciaNombre: auxRespObj.evidenciaENombre
   };
					 			
   crearFormEvidenciaCompleta(optionsEviE); 
      
   if(parseInt(opcionEvi) == 1){
      $(".evidencia-simpleRespPregHomCon"+auxRespObj.id).hide();
      $(".evidencia-multipleRespPregHomCon"+auxRespObj.id).show();
   }else{
      $(".evidencia-simpleRespPregHomCon"+auxRespObj.id).show();
      $(".evidencia-multipleRespPregHomCon"+auxRespObj.id).hide();
   }
}

var indiceActualEvaRespPregListHomCon;

function validarRespuestasPregListaHomologacionContratista(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   var campoVacio = true; 
    
   var bitRespuesta,comentario,evidenciaSimpleNombre,evidenciaMultiANombre,evidenciaMultiBNombre,
        evidenciaMultiCNombre,evidenciaMultiDNombre,evidenciaMultiENombre,enfoqueAuxId;
     
   listPreguntasHomologacionContratistaEvalAux.forEach(function(val,index){
      if(campoVacio && val.tipoCumplimiento.id != 1){
         bitRespuesta = parseInt($("input[name='radioRespPregListHomCon"+val.id+"']:checked").val());
         comentario = $("#textAreaComentarioRespPregHomCon"+val.id).val();
         evidenciaSimpleNombre = $("#inputEviSimple"+val.id).val();evidenciaMultiANombre = $("#inputEviMultiA"+val.id).val();
         evidenciaMultiBNombre = $("#inputEviMultiB"+val.id).val();evidenciaMultiCNombre = $("#inputEviMultiC"+val.id).val();
         evidenciaMultiDNombre = $("#inputEviMultiD"+val.id).val();evidenciaMultiENombre = $("#inputEviMultiE"+val.id).val();
       
         if(isNaN(bitRespuesta)){
 	    campoVacio = false;
 	    mensajeUx = "<label>Falta la respuesta en la pregunta #"+(index+1)+" ("+val.pregunta.nombre+").</label>";
 	 
 	    enfoqueAuxId = "1radioRespPregListHomCon"+val.id;
         }else if(bitRespuesta == 0 && comentario.length == 0){
            campoVacio = false;
  	    mensajeUx = "<label>Falta el comentario en la pregunta #"+(index+1)+" ("+val.pregunta.nombre+").</label>";
  	 
  	    enfoqueAuxId = "textAreaComentarioRespPregHomCon"+val.id;
         }else if(bitRespuesta == 1 && evidenciaSimpleNombre.length == 0 && evidenciaMultiANombre.length == 0 &&
            evidenciaMultiBNombre.length == 0 && evidenciaMultiCNombre.length == 0 && evidenciaMultiDNombre.length == 0 &&
            evidenciaMultiENombre.length == 0){
            campoVacio = false;
   	    mensajeUx = "<label>Falta la evidencia en la pregunta #"+(index+1)+" ("+val.pregunta.nombre+") " +
   	    		"[en caso de ser múltiple, debe subir al menos una].</label>";
   	 
   	    enfoqueAuxId = "inputEviSimple"+val.id;
         }else if(evidenciaSimpleNombre == "VOLVER A SUBIR" || evidenciaMultiANombre == "VOLVER A SUBIR" ||
            evidenciaMultiBNombre == "VOLVER A SUBIR" || evidenciaMultiCNombre == "VOLVER A SUBIR" || 
            evidenciaMultiDNombre == "VOLVER A SUBIR" || evidenciaMultiENombre == "VOLVER A SUBIR"){
            campoVacio = false;
            mensajeUx = "<label>Debe volver a subir la evidencia en la pregunta #"+(index+1)+" ("+val.pregunta.nombre+") " +
        	        "[en caso de ser múltiple, al menos una está con observación].</label>";
        	 
            enfoqueAuxId = "inputEviSimple"+val.id;
         }    
      }
   });
    
   if(campoVacio){
      indiceActualEvaRespPregListHomCon = 1;
      guardarRespuestasPregListaHomologacionContratista(guardarRespuestasPregListaHomologacionContratista);
   }else{
      $.unblockUI();$("#modalRespuestasPregListaHomologacionContratista").modal("hide");  
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposRespPregListHomCon");
       
      $("#modalMensajeUxAvisoCompletarCamposRespPregListHomCon").on("hidden.bs.modal",function(){
         $("#modalRespuestasPregListaHomologacionContratista").modal("show");
         document.getElementById(enfoqueAuxId).focus();
      });
   }    
}

function guardarRespuestasPregListaHomologacionContratista(functionCallBack){ 
   var bitRespuesta,comentario,evidenciaSimpleNombre,evidenciaMultiANombre,evidenciaMultiBNombre,
       evidenciaMultiCNombre,evidenciaMultiDNombre,evidenciaMultiENombre,actualizarRespuesta = 0,
       auxId,dataParam;
      
   listPreguntasHomologacionContratistaEvalAux.forEach(function(val,index){
      if((index + 1) == indiceActualEvaRespPregListHomCon && val.tipoCumplimiento.id != 1){
	 actualizarRespuesta = 1;auxId = val.id;
         bitRespuesta = parseInt($("input[name='radioRespPregListHomCon"+val.id+"']:checked").val());
         comentario = $("#textAreaComentarioRespPregHomCon"+val.id).val();
        
         dataParam={
            id: val.id,respuesta: {id: bitRespuesta},
            comentarioContratista: comentario
         };
         
         if(val.fechaEvaluacionTexto != "------"){
            dataParam.tipoCumplimiento = {id: 5};
         }
      }
   });
   
   if(actualizarRespuesta == 1){
      callAjaxPostNoUnlockAux(URL+'/contratista/evento_homologacion/respuesta/save',dataParam,function(data){
       guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviSimple"+auxId,bitsEvidenciaHomologacion,
       "/contratista/evento_homologacion/respuesta/evidencia_simple/save",function(){
        guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviMultiA"+auxId,bitsEvidenciaHomologacion,
        "/contratista/evento_homologacion/respuesta/evidencia_multi_a/save",function(){
	 guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviMultiB"+auxId,bitsEvidenciaHomologacion,
         "/contratista/evento_homologacion/respuesta/evidencia_multi_b/save",function(){
          guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviMultiC"+auxId,bitsEvidenciaHomologacion,
          "/contratista/evento_homologacion/respuesta/evidencia_multi_c/save",function(){
           guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviMultiD"+auxId,bitsEvidenciaHomologacion,
	   "/contratista/evento_homologacion/respuesta/evidencia_multi_d/save",function(){
	    guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviMultiE"+auxId,bitsEvidenciaHomologacion,
	    "/contratista/evento_homologacion/respuesta/evidencia_multi_e/save",function(){
               if(indiceActualEvaRespPregListHomCon == listPreguntasHomologacionContratistaEvalAux.length){
                  $("#modalRespuestasPregListaHomologacionContratista").modal("hide"); 
                  $.unblockUI();
                  mensajeUx = "<label>Las respuestas fueron registradas con éxito.</label>";
                  mensajesUx(mensajeUx,1,"","EvalCompletadaRespPregListHomCon");
        					
                  $("#modalMensajeUxEvalCompletadaRespPregListHomCon").on("hidden.bs.modal",function(){
                     $("#modalPreguntasListaHomologacionContratista").modal("show");    
                     cargarPreguntasListaHomologacionContratista();
                  });
               }else{
                  indiceActualEvaRespPregListHomCon++;
                  functionCallBack(guardarRespuestasPregListaHomologacionContratista);
               }	
            });
           });
          });
	 });
	});
       });
      });
   }else{
      if(indiceActualEvaRespPregListHomCon == listPreguntasHomologacionContratistaEvalAux.length){
	 $("#modalRespuestasPregListaHomologacionContratista").modal("hide"); 
         $.unblockUI();
         mensajeUx = "<label>Las respuestas fueron registradas con éxito.</label>";
         mensajesUx(mensajeUx,1,"","EvalCompletadaRespPregListHomCon");
					
         $("#modalMensajeUxEvalCompletadaRespPregListHomCon").on("hidden.bs.modal",function(){
            $("#modalPreguntasListaHomologacionContratista").modal("show");    
            cargarPreguntasListaHomologacionContratista();
         });
      }else{
         indiceActualEvaRespPregListHomCon++;
         functionCallBack(guardarRespuestasPregListaHomologacionContratista);
      } 
   }
}
