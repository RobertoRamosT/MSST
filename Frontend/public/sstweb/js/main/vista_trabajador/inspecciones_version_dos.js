
var listEvalInspeccGeneral =[];
var evalInspeccGeneralObj = {};
var indexEvalInspeccGeneral;
var mensajeUx;

function toggleMenuOpcionEvalInspeccGeneral(obj,pindex){
   evalInspeccGeneralObj = listEvalInspeccGeneral[pindex]; 
   indexEvalInspeccGeneral = pindex;
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesEvalInspeccGeneral=[
   {id:"opcNoAplica",nombre:"<i class='fa fa-times'></i> No aplica ",
    functionClick:function(data){cambiarEstadoPreguntaInspeccionGeneral(0)}},
   {id:"opcAplica",nombre:"<i class='fa fa-check'></i> Aplica ",
    functionClick:function(data){cambiarEstadoPreguntaInspeccionGeneral(1)}},
//   {id:"opcEditarResp",nombre:"<i class='fa fa-pencil'></i> Editar respuesta",
//    functionClick:function(data){editarRespuestaEvaluacionInspeccGeneralVersionDos()}}
];

function marcarSubOpcionEvalInspeccGeneral(pindex){
   funcionalidadesEvalInspeccGeneral[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function procesarListaInspeccionGeneralMovilVersionDos(data){
   if(data.CODE_RESPONSE == "05"){
      $.unblockUI();window.scrollTo({top: 0,behavior: 'smooth'});
      $("#subRealizarInspecciones").find(".contenidoSubList").html("");	
      $("#infoMovilInspeccGeneralEvalPendiente").remove();$(".modelo-inspeccionv2").remove();
  
      listEvalInspeccGeneral = data.listEvalInspeccGeneral;
      listAreasInteresadasDetalleAuditoriaMovil = data.areas;
      listSeccionesInteresadasDetalleAuditoriaMovil = data.secciones;
      auditoriaObjMovil = data.auditoriaAux[0];
      
      var avanceAplica = 0,totalAplica = 0;
      var textPreguntas = "";
					
      listEvalInspeccGeneral.forEach(function(val,index){ 
         var menuOpcion = "",btnOpcion = "";
 	 
    	 if(val.detalleAuditoriaId != 0 && inspeccionEvento.estadoEvento != 2){
 	    menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
 	       funcionalidadesEvalInspeccGeneral.forEach(function(val1,index1){
 	          if((val.bitAplica == 1 && val1.id == "opcNoAplica") || (val.bitAplica == 0 && val1.id == "opcAplica") ||
 	             val1.id == "opcEditarResp"){
                     menuOpcion += 
 	                "<li class='list-group-item' onclick='marcarSubOpcionEvalInspeccGeneral("+index1+")'>" +
 		            val1.nombre +
 		        "</li>";
 	          }
 	       });
 	    menuOpcion += "</ul>";
 			
 	    btnOpcion = 
 	       "<a class='btn-gestion efectoLink' " +
 	          "onclick='toggleMenuOpcionEvalInspeccGeneral(this,"+index+")'>" +
 	          "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
 	       "</a>";
         }
 	     
         var estadoPregunta = (val.bitAplica == 1?"Aplica":"No aplica");
 	        
 	 var listTotal=[
 	    {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
 	     label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
 	              "*** PREGUNTA #"+(index+1)+" ***" +
 	           "</span>"},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
 	     label:val.verificacion,inputForm:""},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	    {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
 	     label:"<i class='fa fa-question-circle'></i> Estado de la pregunta:",inputForm:estadoPregunta}
 	 ];
 	        
 	 if(val.bitAplica == 1){
 	    if(val.detalleAuditoriaId != 0){
 	       var iconoRespuesta = (val.respuesta == 1.00?iconoGosst.aprobado:
 	   	  (val.respuesta == 0.50?iconoGosst.advertir:iconoGosst.desaprobado));
 	       var valorRespuesta = (val.respuesta == 1.00?"Cumple":
 	  	  (val.respuesta == 0.50?"Cumple parcialmente":"No cumple"));
 	       var valorRiesgoPotencial = (val.bitRiesgo == 1?"Sí":"No");
 	       var valorObservacion = (val.comentario.length == 0?"------":val.comentario);
 	  	       
 	       var evidenciaNombre = (val.evidenciaNombre.length == 0?"------":
 	  	  "<a class='efectoLink' target='_blank' " +
 	             "href='"+URL+"/auditoria/amazon_s3/verificaciones/evidencia?auditoriaId="+
 	                    auditoriaObjMovil.auditoriaId+"&verificacionId="+val.verificacionId+"'>"+
 	              val.evidenciaNombre +
 	          "</a>");
 	  	        
 	       listTotal.push(
 	          {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
 	  	   label:"<i class='fa fa-pencil-square-o'></i> Respuesta:",inputForm:iconoRespuesta+" "+valorRespuesta},
// 	  	  {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
// 	  	   label:"<i class='fa fa-asterisk'></i> ¿Riesgo potencial?",inputForm:valorRiesgoPotencial},
 	  	  {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
 	           label:"<i class='fa fa-eye'></i> Comentario:",inputForm:valorObservacion},
 	  	  {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
 	  	   label:"<i class='fa fa-file'></i> Evidencia:",inputForm:evidenciaNombre});
 	       
 	       if(medidaCorrectivaActiva == 1 && val.respuesta == 0.00){
 		  var descripcionAccMej = (val.accionCorrectiva.length == 0?"------":val.accionCorrectiva),
              areaObservada = (val.areaObservada.length == 0?"------":val.areaObservada);
 		  var fechaPlanificadoAccMej = (val.fechaPlanificacionTexto.length == 0?"------":val.fechaPlanificacionTexto); 
 		  var responsableAccMej = (val.responsable.length == 0?"------":val.responsable); 
 		  	
 		  var evidenciaNombreAccMej = (val.evidenciaAccCorNombre.length == 0?"------":
 	 	     "<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaAccCorUrl)+"'>"+
 	 	         val.evidenciaAccCorNombre +
 	 	     "</a>");
 		   
 		  listTotal.push(
 	             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 		     {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	              label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
 			       "*** MEDIDA CORRECTIVA ***" +
 			    "</span>"},
 	             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	             {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-eye'></i> Descripción:",inputForm:descripcionAccMej},
                 {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-pencil'></i> Área responsable:",inputForm:areaObservada},
 	 	     {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
 	 	      label:"<i class='fa fa-calendar'></i> Fecha planificada:",inputForm:fechaPlanificadoAccMej},
 	 	     {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
 	 	      label:"<i class='fa fa-user'></i> Responsable:",inputForm:responsableAccMej},
 	 	     {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
 	 	      label:"<i class='fa fa-file'></i> Evidencia:",inputForm:evidenciaNombreAccMej});
 	       }
 	  	       
 	       avanceAplica++;
 	    }
 	  	       
 	    totalAplica++;
 	 }
    	  
 	 textPreguntas += "<div class='eventoGeneral'>" +
                             "<form class='eventoGeneral'>";
            listTotal.forEach(function(val,index){
               textPreguntas += obtenerSubPanelModuloVersionDos(val);
            });
         textPreguntas +=    "</form>" +
                          "</div>";
      });
         
      $("#subRealizarInspecciones").find(".tituloSubList").html(
         "<div class='row'>" +
            "<section class='col col-xs-2'>" +
	        textoBotonVolverContenidoColaborador +
            "</section>"+
            "<section class='col col-xs-10'>" +
                auditoriaObjMovil.auditoriaTipoNombre +
                "<br> Avance: "+avanceAplica+" / "+totalAplica +
	    "</section>"+
         "</div>");
				
      // if(inspeccionEvento.estadoEvento != 2){
      //    $("#subRealizarInspecciones").find(".contenidoSubList").append(
      //       "<div id='estadoMovilEmpezarInspeccionOpt'>" +
      //          "<div class='tituloSubList'> Registrar respuestas - inspección" +
   	//           "<button style='font-size:19px' title='Empezar inspección.' " +
   	// 	          "class='btn btn-success' onclick='iniciarEvaluacionInspeccGeneralVersionDos()'>"+
   	//              "<i class='fa fa-pencil'></i> Empezar" +
   	//           "</button>" +
   	//        "</div>" +
      //       "</div>");
      // }
      
        var listPanelesPrincipal=[];
      
        // listPanelesPrincipal.push({id:"infoMovilInspeccGeneralEvalPendiente",clase:"divSubEvento",styleAux:"",
	    // nombre:"Preguntas de la inspección ("+listEvalInspeccGeneral.length+")",buttonAd:"",contenido:textPreguntas});
		//
        // agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);

        if(inspeccionEvento.estadoEvento != 2){
            listPanelesPrincipal.push({id:"empezarInspeccionVersionTres",clase:"modelo-inspeccionv2 divSubEvento",styleAux:"",buttonAd:"",btnOnclickAux:"iniciarEvaluacionInspeccGeneralVersionDos()",
                btnIconoAux:"fa-pencil",btnTitleAux:"Iniciar con la inspección",nombre:"Empezar inspección",contenido:""});
        }

        listPanelesPrincipal.push({id:"registroInspeccionVersionTres",clase:"modelo-inspeccionv2 divSubEvento",styleAux:"",buttonAd:"",btnOnclickAux:"",
            btnIconoAux:"",btnTitleAux:"",nombre:"Preguntas de la inspección ("+listEvalInspeccGeneral.length+")",contenido:textPreguntas});

        agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
 	  
        $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
      
        $(window).scrollTop(0-$("#barraMenu").height()-60);
      
        if(inicioInmediatoInspecc == 1){
	        inicioInmediatoInspecc = 0;
	 
	        iniciarEvaluacionInspeccGeneralVersionDos();
        }
    }else{
        alert("Ocurrió un error al cargar las preguntas de la inspección!");
    }
}

function iniciarEvaluacionInspeccGeneralVersionDos(){
    $("#subRealizarInspecciones").find(".contenidoSubList").html("");
    $(".modelo-inspeccionv2").hide();$("#infoMovilInspeccGeneralEvalPendiente").remove();
      
   $("#subRealizarInspecciones").find(".tituloSubList").html(
      "<div class='row'>" +
         "<section class='col col-xs-2'>" +
	     textoBotonVolverContenidoColaborador +
         "</section>"+
         "<section class='col col-xs-10'>" +
             auditoriaObjMovil.auditoriaTipoNombre +
	 "</section>"+
      "</div>");
   
   listEvalInspeccGeneral.forEach(function(val,index){ 
      $("#subRealizarInspecciones").find(".contenidoSubList")
      .append(crearDivEvaluacionInspeccGeneralVersionDos(val,index));
      
      var options={
         container: "#tdEviPreg"+val.verificacionId,
         functionCall: function(){
            validacionSubirEvidencia("PregInspecc"+val.verificacionId,bitsEvidenciaEvalEvento,"");
         },
         descargaUrl: (val.evidenciaNombre.length == 0?"":
            "/auditoria/amazon_s3/verificaciones/evidencia?auditoriaId="+auditoriaObjMovil.auditoriaId +
            "&verificacionId="+val.verificacionId),
         esNuevo: (val.evidenciaNombre.length == 0?true:false),
         idAux: "PregInspecc"+val.verificacionId,evidenciaNombre: val.evidenciaNombre
      }; 

      crearFormEvidenciaCompleta(options);
      
      if(medidaCorrectivaActiva == 1){  
         var optionsMedCor={
	    container: "#tdEviMedCorGeneral"+val.verificacionId,
	    functionCall: function(){
	       estadoAccionCorrectivaInspeccGeneral(val.verificacionId);
	       validacionSubirEvidencia("MedCorInspeccGeneral"+val.verificacionId,bitsEvidenciaEvalEvento,"");
	    },
	    descargaUrl: val.evidenciaAccCorUrl,
	    esNuevo: (val.respuesta == 1.00 || val.evidenciaAccCorNombre == ""?true:false),
	    idAux: "MedCorInspeccGeneral"+val.verificacionId,
	    evidenciaNombre: (val.respuesta == 1.00 || val.evidenciaAccCorNombre == ""?"":val.evidenciaAccCorNombre),
            mensajeAux: "*Al subir la evidencia, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
         }; 
   
         crearFormEvidenciaAmazonS3Completa(optionsMedCor);
      }
      
      $("#textObsInspeccGeneralMovil"+val.verificacionId).val(val.comentario);

      habilitarCamposPreguntaInspeccGeneralMovil(val.bitAplica,val.verificacionId);
      
      if(medidaCorrectivaActiva == 1 && val.respuesta == 0.00){
         $("#textDescAudiGeneralMedCorMovil"+val.verificacionId).val(val.accionCorrectiva);
          $("#inputAreaObsAudiGeneralMedCorMovil"+val.verificacionId).val(val.areaObservada);

          var valFechaPlanificada = convertirFechaInput(val.fechaPlanificacion);
         $("#inputFechaPlanAudiGeneralMedCorMovil"+val.verificacionId).val(valFechaPlanificada);
	          
         $("#inputBuscarResponsableGeneralMedCorrMovil"+val.verificacionId).val(val.responsable);
         
         buscarTrabajadorGeneralInformacion(val.verificacionId,"inputBuscarResponsableGeneralMedCorrMovil",
            "divSelResponsableGeneralMedCorrMovil","selResponsableAccCorInsGeneral");
      }
      
      if(medidaCorrectivaActiva == 1){
         if(val.respuesta == 1.00 || (val.respuesta == 0.00 && val.evidenciaAccCorNombre.length != 0)){
            $("#pregInsMovil"+index+">div").hide();
         }else{
            $(".ocultar-campoInspeccGeneral").hide();
         }

         $("#pregInsMovil"+index+" .divNombrePregunta").show();
      }else{
	 $("#pregInsMovil"+index+" .divOpcionesGosst").hide();
	 $("#pregInsMovil"+index+" .general-inspeccGeneralInfo").hide();
      }
   });
   
   var metodoCancelar = (actualizarPrincipalActSst == 0?"realizarInspeccionMovil("+idEvento+")":
      "accesoDirectoRealizarInspeccionMovil("+auditoriaObjMovil.auditoriaId+","+auditoriaObjMovil.auditoriaTipo+",0)");
   
   $("#subRealizarInspecciones").find(".contenidoSubList").append(
      "<div class='divInformacionCurso' style='padding:20px;'>" +
         "<button type='button' class='btn btn-danger' style='font-size:18px;' " +
                 "onclick='"+metodoCancelar+"'>" +
            "<i class='fa fa-times'></i> Cancelar" +
         "</button>" +
         "<button type='button' class='btn btn-success' style='float:right;font-size:18px;' " +
                 "onclick='guardarEvaluacionInspeccionGeneralVersionDos()'>" +
            "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
         "</button>" +
      "</div>");
}

var listEstadoPregInspeccGeneral=[
   {id: 1,nombre: "Aplica"},{id: 0,nombre: "No aplica"}
];

var listRespuestasInspeccGeneral=[
   {id: 1,nombre: "Cumple",anchoAux: "50%"},
//   {id: 2,nombre: "Cumple parcialmente",anchoAux: "40%"},
   {id: 3,nombre: "No cumple",anchoAux: "50%"}
];

function cambiarDivSubPreguntaInspeccGeneral(obj,pregInspeccGeneralId){
   $(obj).parent(".divNombrePregunta").siblings(".divOpcionesGosst").toggle();
    
   var estadoPreg = parseInt($("input[name='radiosEstadoPregInsMovil"+pregInspeccGeneralId+"']:checked").val());
   var respuestaPreg = parseInt($("input[name='radiosRespPregInsMovil"+pregInspeccGeneralId+"']:checked").val());
   
   if(estadoPreg == 1){
      $(obj).parent(".divNombrePregunta").siblings(".general-inspeccGeneralInfo").toggle();
      
      if(respuestaPreg == 3){
	 $(obj).parent(".divNombrePregunta").siblings(".general-inspeccGeneralMedCor").toggle();  
      }
   }
   
   $(".ocultar-campoInspeccGeneral").hide();
}

function crearDivEvaluacionInspeccGeneralVersionDos(contenidoVal,contenidoIndex){
   var textoBotonToggleReportar =
      "<button class='btn btn-danger' onclick='cambiarDivSubPreguntaInspeccGeneral(this,"+contenidoVal.verificacionId+")'>" +
         "<i class='fa fa-bullhorn fa-3x' aria-hidden='true'></i>" +
      "</button>";
   
   var radiosEstadoPregInsMovil = crearRadiosAutoVersionDos("radiosEstadoPregInsMovil"+contenidoVal.verificacionId,
      listEstadoPregInspeccGeneral,contenidoVal.bitAplica,"id","nombre","habilitarCamposPreguntaInspeccGeneralMovil",
      contenidoVal.verificacionId);
   
   var respuestaInicialPreg = (contenidoVal.respuesta == 0.00?3:1);
      
   var radiosRespPregInsMovil = crearRadiosAutoVersionDos("radiosRespPregInsMovil"+contenidoVal.verificacionId,
      listRespuestasInspeccGeneral,respuestaInicialPreg,"id","nombre","habilitarCamposRespuestaInspeccGeneralMovil",
      contenidoVal.verificacionId);
   
   var checkRiesgo = (contenidoVal.bitRiesgo == 1?"checked":"");
     
   return "<div class='divInformacionCurso' id='pregInsMovil"+contenidoIndex+"'>" +
 	     "<div class='divNombrePregunta'>"+textoBotonToggleReportar +
                 (contenidoIndex+1)+". "+contenidoVal.categoriaNombre+"<br>"+contenidoVal.verificacion+" " +
 	        "<span id='estadoRespPregEvalInspeccGeneral"+contenidoVal.verificacionId+"' " +
                      "style='font-weight:bolder;'></span>" +
 	     "</div>" +
 	     "<div class='divOpcionesGosst' style='padding:20px;margin:0px 0px -10px 20px;'>" +
 	        "<div class='row'>" +
 	           "<section class='col col-xs-3'><strong>Estado:</strong></section>" +
 	           "<section class='col col-xs-9'>"+radiosEstadoPregInsMovil+"</section>" +
                "</div>" +
 	     "</div>" +
 	     "<div class='general-inspeccGeneralInfo inspeccGeneralInformacion"+contenidoVal.verificacionId+"' " +
       	          "style='border-top:2px solid black;margin:-10px 0px 20px 0px;'></div>" +
 	     "<div class='general-inspeccGeneralInfo inspeccGeneralInformacion"+contenidoVal.verificacionId+" eventoGeneral' style='margin:10px;'>" +
 	        "<strong>Respuesta:</strong>"+radiosRespPregInsMovil +
 	        "<div class='row ocultar-campoInspeccGeneral'>" +
 	           "<section class='col col-xs-6'><strong>¿Riesgo potencial?</strong></section>" +
 	           "<section class='col col-xs-6'>" +
 	              "<input type='checkbox' class='form-control' id='checkRiesgoPotencialInspeccGeneralMovil"+contenidoVal.verificacionId+"' "+checkRiesgo+">" +
 	           "</section>" +
 	        "</div>" +
 	        "<br><strong>Observación:</strong>" +
 	        "<textarea rows='4' class='form-control' id='textObsInspeccGeneralMovil"+contenidoVal.verificacionId+"'></textarea>" +
 	        "<br><strong>Evidencia:</strong>" +
 	        "<span id='tdEviPreg"+contenidoVal.verificacionId+"'></span>" +
             "</div>" +
              (medidaCorrectivaActiva == 0?"":
               "<div class='general-inspeccGeneralMedCor inspeccGeneralMedCor"+contenidoVal.verificacionId+"' " +
    	            "style='border-top:5px solid black;margin:20px 0px 20px 0px;'></div>" +
               "<div class='general-inspeccGeneralMedCor inspeccGeneralMedCor"+contenidoVal.verificacionId+" eventoGeneral' style='margin:10px;'>" +
                  "<div class='general-inspeccGeneralMedCor inspeccGeneralMedCor"+contenidoVal.verificacionId+"'>" +
                     "<label style='font-size:"+(isMobile.any()?"14px":"18px")+";'>*** MEDIDA CORRECTIVA ***</label>" +
                     "<div style='border-top:2px solid black;margin:5px -10px 10px -10px;'></div>" +
                     "<strong>Descripción:</strong>" +
	             "<textarea rows='4' class='form-control' id='textDescAudiGeneralMedCorMovil"+contenidoVal.verificacionId+"'></textarea>" +
                  "<br><strong>Área responsable:</strong>" +
                  "<input id='inputAreaObsAudiGeneralMedCorMovil"+contenidoVal.verificacionId+"' class='form-control'>" +
	             "<br><strong>Fecha planificada:</strong>" +
	             "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
	             "<input type='date' id='inputFechaPlanAudiGeneralMedCorMovil"+contenidoVal.verificacionId+"' class='form-control'>" +
	             "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
	             "<strong>Responsable de la medida correctiva:</strong>" +
	             "<input class='form-control' id='inputBuscarResponsableGeneralMedCorrMovil"+contenidoVal.verificacionId+"'>" +
	             "<div id='divSelResponsableGeneralMedCorrMovil"+contenidoVal.verificacionId+"'></div>" +
	             "<small>*Buscar responsable por DNI y/o nombres/apellidos (debe ingresar 3 caracteres como mínimo).</small>" +
	             "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
	             "<strong>Evidencia - Medida correctiva*:</strong>" +
	             "<span id='tdEviMedCorGeneral"+contenidoVal.verificacionId+"'></span>" +
	             "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
	             "<strong style='font-size:"+(isMobile.any()?"15px":"18px")+"'>Estado:</strong> " +
	             "<span id='auxInfoEstadoAudiGeneralMedCorMovil"+contenidoVal.verificacionId+"' " +
	                   "style='color:red;font-weight:bold;font-size:"+(isMobile.any()?"15px":"18px")+"'></span>" +
                  "</div>" +
               "</div>")+
          "</div>";
}

function habilitarCamposPreguntaInspeccGeneralMovil(valResp,auxId){
   var valRespAplica = valResp;
     
   if(valRespAplica == 1){
      $(".inspeccGeneralInformacion"+auxId).show();
      
      var respPreg = parseInt($("input[name='radiosRespPregInsMovil"+auxId+"']:checked").val());
      
      habilitarCamposRespuestaInspeccGeneralMovil(respPreg,auxId);
   }else{
      $(".inspeccGeneralInformacion"+auxId).hide();$(".inspeccGeneralMedCor"+auxId).hide();
	  
      document.querySelector('#estadoRespPregEvalInspeccGeneral'+auxId).innerText = "(No aplica)";   
      document.getElementById('estadoRespPregEvalInspeccGeneral'+auxId).style.color = "red";
   }
}

function habilitarCamposRespuestaInspeccGeneralMovil(valResp,auxId){
   var valRespPreg = valResp;
	     
   if(valRespPreg == 1){
      document.getElementById("checkRiesgoPotencialInspeccGeneralMovil"+auxId).disabled = false;
      
      document.querySelector('#estadoRespPregEvalInspeccGeneral'+auxId).innerText = "(Aplica / Cumple)";   
      document.getElementById('estadoRespPregEvalInspeccGeneral'+auxId).style.color = "blue";
      
      if(medidaCorrectivaActiva == 1){
         $(".inspeccGeneralMedCor"+auxId).hide();
      
         document.getElementById("textDescAudiGeneralMedCorMovil"+auxId).value = null;
          document.getElementById("inputAreaObsAudiGeneralMedCorMovil"+auxId).value = null;
         document.getElementById("inputFechaPlanAudiGeneralMedCorMovil"+auxId).value = null;
      
         $("#inputBuscarResponsableGeneralMedCorrMovil"+auxId).val("");
      
         document.getElementById("fileEviMedCorInspeccGeneral"+auxId).value = null;
         document.getElementById("inputEviMedCorInspeccGeneral"+auxId).value = null;
      }
   }else if(valRespPreg == 3){
      $("#checkRiesgoPotencialInspeccGeneralMovil"+auxId).prop("checked",false);
      document.getElementById("checkRiesgoPotencialInspeccGeneralMovil"+auxId).disabled = true;
	  
      var textoEstadoPreg = (valRespPreg == 2?"Cumple parcialmente":"No cumple");
	  
      document.querySelector('#estadoRespPregEvalInspeccGeneral'+auxId).innerText = "(Aplica / "+textoEstadoPreg+")";   
      document.getElementById('estadoRespPregEvalInspeccGeneral'+auxId).style.color = "blue";
      
      if(medidaCorrectivaActiva == 1){
         $(".inspeccGeneralMedCor"+auxId).show();
     
         buscarTrabajadorGeneralInformacion(auxId,"inputBuscarResponsableGeneralMedCorrMovil",
            "divSelResponsableGeneralMedCorrMovil","selResponsableAccCorInsGeneral");
      }
   }
   
   if(medidaCorrectivaActiva == 1){
      estadoAccionCorrectivaInspeccGeneral(auxId);
   }
}

function estadoAccionCorrectivaInspeccGeneral(auxId){
   var nombreAccCorEvidencia = $("#inputEviMedCorInspeccGeneral"+auxId).val();
    
   if(nombreAccCorEvidencia.length == 0){
      document.querySelector('#auxInfoEstadoAudiGeneralMedCorMovil'+auxId).innerText = "Pendiente";   
      document.getElementById('auxInfoEstadoAudiGeneralMedCorMovil'+auxId).style.color = "#D1D619";
   }else{
      document.querySelector('#auxInfoEstadoAudiGeneralMedCorMovil'+auxId).innerText = "Completado";   
      document.getElementById('auxInfoEstadoAudiGeneralMedCorMovil'+auxId).style.color = "blue";
   }
}

var indiceActualEvalInspeccGeneral;

function guardarEvaluacionInspeccionGeneralVersionDos(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
	
   var campoVacio = true; 
	   
   var nombrePregunta,estadoPreg,respuestaPreg,inputFechaPlanificada,nombreEvidencia,nombreEvidenciaMedCor,indexPreguntaAux;
	    
   listEvalInspeccGeneral.forEach(function(val,index){
      nombrePregunta = val.verificacion;
      estadoPreg = parseInt($("input[name='radiosEstadoPregInsMovil"+val.verificacionId+"']:checked").val());
      respuestaPreg = parseInt($("input[name='radiosRespPregInsMovil"+val.verificacionId+"']:checked").val());
      nombreEvidencia = $("#inputEviPregInspecc"+val.verificacionId).val();
      nombreEvidenciaMedCor = (medidaCorrectivaActiva == 1?$("#inputEviMedCorInspeccGeneral"+val.verificacionId).val():"");
      
      var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiGeneralMedCorMovil"+val.verificacionId).val());
      inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
          
      if(campoVacio && isNaN(estadoPreg)){
         campoVacio = false;indexPreguntaAux = index;
	 mensajeUx = "<label>Falta marcar el estado de la pregunta '"+(index+1)+". "+nombrePregunta+"'.</label>";
      }else if(campoVacio && isNaN(respuestaPreg)){
	 campoVacio = false;indexPreguntaAux = index;
	 mensajeUx = "<label>Falta marcar la respuesta de la pregunta '"+(index+1)+". "+nombrePregunta+"'.</label>";
      }else if(campoVacio && nombreEvidencia == "VOLVER A SUBIR"){
	 campoVacio = false;indexPreguntaAux = index;
	 mensajeUx = "<label>Debe volver a subir la evidencia de la pregunta '"+(index+1)+". "+nombrePregunta+"'.</label>";
      }else if(campoVacio && medidaCorrectivaActiva == 1 && respuestaPreg == 3 && 
	       inputFechaPlanificada == null && nombreEvidenciaMedCor.length == 0){
	 campoVacio = false;indexPreguntaAux = index;
	 mensajeUx = "<label>Debe registrar la fecha planificada o subir la evidencia de la " +
            "medida correctiva - pregunta '"+(index+1)+". "+nombrePregunta+"'.</label>";
      }else if(campoVacio && medidaCorrectivaActiva == 1 && respuestaPreg == 3 && 
	       nombreEvidenciaMedCor == "VOLVER A SUBIR"){
         campoVacio = false;indexPreguntaAux = index;
         mensajeUx = "<label>Debe volver a subir la evidencia de la medida correctiva - pregunta '"+(index+1)+". "+nombrePregunta+"'.</label>";
      }
   });
	   
   if(campoVacio){
      indiceActualEvalInspeccGeneral = 1;
      guardarRespuestaInspeccionGeneral(guardarRespuestaInspeccionGeneral);
    }else{
        $.unblockUI();mensajesUx(mensajeUx,2,"");
        document.getElementById("pregInsMovil"+indexPreguntaAux).scrollIntoView({behavior:"smooth",block:"center"});
    }
}

function guardarRespuestaInspeccionGeneral(functionCallBack){
   var estadoPreg,respAux,respuestaPreg,riesgoPotencial,observacionPreg,preguntaId,evalId,medidaCorrectiva,
       responsableId,inputFechaPlanificada,inputAreaObservada;
   var dataParam;
	    
   listEvalInspeccGeneral.forEach(function(val,index){
      if((index + 1) == indiceActualEvalInspeccGeneral){
    	 evalId = val.detalleAuditoriaId;preguntaId = val.verificacionId;
	 estadoPreg = parseInt($("input[name='radiosEstadoPregInsMovil"+val.verificacionId+"']:checked").val());
	         
	 if(estadoPreg == 1){
	    respAux = parseInt($("input[name='radiosRespPregInsMovil"+val.verificacionId+"']:checked").val());
	    respuestaPreg = (respAux == 1?1.00:(respAux == 2?0.50:0.00));
	    riesgoPotencial = ($("#checkRiesgoPotencialInspeccGeneralMovil"+val.verificacionId).prop("checked")?1:0);
	    observacionPreg = $("#textObsInspeccGeneralMovil"+val.verificacionId).val(); 
	    
	    if(medidaCorrectivaActiva == 1 && respAux != 1){
	       medidaCorrectiva =  $("#textDescAudiGeneralMedCorMovil"+val.verificacionId).val();
            inputAreaObservada = $("#inputAreaObsAudiGeneralMedCorMovil"+val.verificacionId).val();
               responsableId = parseInt($("#selResponsableAccCorInsGeneral"+val.verificacionId).val());
               var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiGeneralMedCorMovil"+val.verificacionId).val());
     	       inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
	    }
	 }
	     
	 dataParam={
	    detalleAuditoriaId: evalId,auditoriaId: auditoriaObjMovil.auditoriaId,verificacionId: preguntaId,
	    bitAplica: estadoPreg,trabajadorId: parseInt(getSession("trabajadorGosstId")),medidaCorrectivaActiva: medidaCorrectivaActiva,
	    bucketNombre: BUCKETAMAZONS3
         };	
	 
	 if(estadoPreg == 1){
	    dataParam.bitRespuesta = respuestaPreg;dataParam.bitRiesgo = riesgoPotencial;dataParam.comentario = observacionPreg;
	     
	    if(medidaCorrectivaActiva == 1 && respAux != 1){
	        dataParam.accionCorrectiva = medidaCorrectiva;dataParam.fechaPlanificacion = inputFechaPlanificada;dataParam.responsableId = responsableId;
            dataParam.areaObservada = inputAreaObservada;
	    }
	 }
      }
   });  
   
   var habilitadoEvi = (estadoPreg == 1?1:0);
   var habilitadoEviMedCor = (medidaCorrectivaActiva == 1 && estadoPreg == 1 && respAux == 3?1:0);

    // MODIFICACIÓN: Manejo de errores para la llamada AJAX principal
    try {
        callAjaxPostSimple(URL + '/auditoria/verificaciones/respuesta/inspeccion_general/save', dataParam, 0, function(data) {

            // Guardar evidencia, con manejo de errores
//            guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId, "fileEviPregInspecc" + preguntaId, bitsEvidenciaEvalEvento,
//                "/auditoria/verificaciones/evidencia/save", function() {
            guardarEvidenciaAutoVersionS3(habilitadoEvi,data.nuevoId,"fileEviPregInspecc"+preguntaId,bitsEvidenciaEvalEvento,
            0,0,"/auditoria/amazon_s3/verificaciones/evidencia/save","detalle-auditoria/evidencia",function(){

                    // Guardar evidencia de la acción correctiva si corresponde
                    guardarEvidenciaAutoVersionS3(habilitadoEviMedCor, data.nuevoId, "fileEviMedCorInspeccGeneral" + preguntaId, bitsEvidenciaEvalEvento,
                        0, 0, "/auditoria/amazon_s3/verificaciones/accion_correctiva/evidencia/save", "detalle-auditoria/evidencia-acc-correctiva", function() {

                            // Si se ha procesado toda la lista
                            if (indiceActualEvalInspeccGeneral == listEvalInspeccGeneral.length) {
                                $.unblockUI();
                                mensajeUx = "<label>La evaluación de '" + auditoriaObjMovil.auditoriaTipoNombre + "' fue guardada con éxito.</label>";
                                mensajesUx(mensajeUx, 1, "", "EvaluacionCompletadaInspeccGeneral");

                                // MODIFICACIÓN: Manejo adecuado del cierre del modal
                                $("#modalMensajeUxEvaluacionCompletadaInspeccGeneral").on("hidden.bs.modal", function() {
                                    if (actualizarPrincipalActSst == 0) {
                                        realizarInspeccionMovil(idEvento);
                                    } else {
                                        accesoDirectoRealizarInspeccionMovil(auditoriaObjMovil.auditoriaId, auditoriaObjMovil.auditoriaTipo, 0);
                                    }
                                });
                            } else {
                                // Continuar con la siguiente evaluación
                                indiceActualEvalInspeccGeneral++;
                                functionCallBack(guardarRespuestaInspeccionGeneral);
                            }
                        });
            }); 
//                }, "verificacionId");
        }, function(error) {
            // MODIFICACIÓN: Manejo del error de la llamada AJAX principal
            console.error("Error en la llamada AJAX:", error);
            mensajeUx = "<label>Ocurrió un error al guardar la respuesta. Por favor, revisa tu conexión e inténtalo de nuevo.</label>";
            mensajesUx(mensajeUx, 0, "", "ErrorEvaluacionInspeccGeneral");
            $.unblockUI(); // Asegurar desbloqueo de la UI
        });

    } catch (error) {
        // MODIFICACIÓN: Bloque try/catch para manejar errores inesperados
        console.error("Error en el procesamiento:", error);
        mensajeUx = "<label>Ocurrió un error al guardar la evaluación. Inténtalo de nuevo.</label>";
        mensajesUx(mensajeUx, 0, "", "ErrorEvaluacionInspeccGeneral");
        $.unblockUI();  // Desbloquear la UI en caso de error
    }
}

function cambiarEstadoPreguntaInspeccionGeneral(aplica){
   var estadoPreg = aplica;
   var textoAux = (estadoPreg == 0?"No aplica":"Aplica");
	
   mensajeUx="<label>¿Está seguro de cambiar el estado de la pregunta " +
      "a '"+textoAux+"'?</label>";
   mensajesUx(mensajeUx,3,"","EstadoInspeccGeneral");

   $("#btnDevolverValorEstadoInspeccGeneral").on("click",function(){
      var dataParam={
	 detalleAuditoriaId: evalInspeccGeneralObj.detalleAuditoriaId,bitAplica: estadoPreg,
	 medidaCorrectivaActiva: medidaCorrectivaActiva,bucketNombre: BUCKETAMAZONS3,
	 trabajadorId: parseInt(getSession("trabajadorGosstId"))	 
      };
			
      callAjaxPost(URL+'/auditoria/inspeccion_general/evaluacion/estado',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx = "<label>El estado de la pregunta fue actualizado con éxito.</label>"; 
	       mensajesUx(mensajeUx,1,"","EvaluacionCompletadaInspeccGeneral");
	               
	       $("#modalMensajeUxEvaluacionCompletadaInspeccGeneral").on("hidden.bs.modal",function(){
		  if(actualizarPrincipalActSst == 0){
		     realizarInspeccionMovil(idEvento);  
		  }else{
		     accesoDirectoRealizarInspeccionMovil(auditoriaObjMovil.auditoriaId,auditoriaObjMovil.auditoriaTipo,0); 
		  }   
	       });
	  	       
	       break;
						
	    default:
	       alert("Ocurrió un error al cambiar el estado de la pregunta!");
         }
      });
   });	
}

//function editarRespuestaEvaluacionInspeccGeneralVersionDos(){
//   $("#modalRespEvalInspeccGeneralVersionDos").remove();  
//    
//    var contenido = "";
// 				
//    var listContenido=[
//       {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"divEvidenciaSctrIa"},
//       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
//       {sugerencia:"",
//        label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
//                      "onclick='ocultarSctrPorMedioDeIa()'>" +
//                 "<i class='fa fa-times'></i> Cancelar" +
//              "</button>",
//        inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
// 	      		 "onclick='evaluacionSctrPorMedioDeIa()'>" +
// 	            "<i class='fa fa-paper-plane'></i> Enviar" +
// 	         "</button>"},
//    ]; 
// 				
//    listContenido.forEach(function(val){
//       contenido += obtenerSubPanelModuloVersionDos(val);
//    });
//  		
//    var modalOptions={
//       id: "modalRespEvalInspeccGeneralVersionDos",
//       nombre: "<i class='fa fa-pencil'></i> "+evalInspeccGeneralObj.verificacion,
//       contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
//    };
// 				
//    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
//     
//    var options={
//       container: "#divEvidenciaSctrIa",
//       functionCall: function(){
//          validacionSubirEvidencia("EvalSctrIa",bitsEvidenciaExamen,"modalEvaluarSctrIa");
//       },
//       descargaUrl: "",esNuevo: true,idAux: "EvalSctrIa",evidenciaNombre: "",
//       mensajeAux: "*Debe subir el modelo brindado por la aseguradora MAPFRE."
//    };
// 					
//    crearFormEvidenciaAmazonS3Completa(options);	    
//}
