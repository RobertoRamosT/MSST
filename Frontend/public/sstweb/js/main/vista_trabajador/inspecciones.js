/**
 * 
 */
var listFullEvaluacionesInspeccion=[];
var evaluacionInspeccionObj={id:0};
var inspeccionEvento;
var gestionAccionAsociadaId=0;
var listAreasHallazgo=[];
var listNivelRiesgoHallazgo=[],listTipoReporteHallazgo=[],listFactorHallazgo=[];
var listAreasInteresadasHallazgo=[],listSeccionesInteresadasHallazgo=[];
var lastHeightInspeccion=0;
var medidaCorrectivaActiva = 0;

var listVisualizarPreguntas=[
   {id:0,nombre:"Elegir preguntas que aplican"},
   {id:1,nombre:"Ver todas las preguntas"},
   {id:2,nombre:"Ver preguntas que aplican"},
   {id:3,nombre:"Ver preguntas sin responder"}
];

var listTipoAccionMejoraGlobal;
var opcionVisualizar;

var mensajeUx,textAuxMulSelectHallazgo;
var countMensajeMovil;
var opcionBoton;
var idEvento;
var auxAuditoria={};
var valTipoId;
var hallLibIdAux,indexhallLibAux,solAccMejIdAux,accMejAutoHallLib = 0;

function accesoDirectoRealizarInspeccionMovil(pAuditoriaId,pAuditoriaTipo,pActivar){
    var auditoriaId = parseInt(pAuditoriaId),auditoriaTipo = parseInt(pAuditoriaTipo),
        activar = parseInt(pActivar);
   
    evaluacionInspeccionObj = {id: 0};auxAuditoria = null;auditoriaObjMovil = null;
   
    if(auditoriaTipo == 100){
        alert("Por ahora, no disponible para Monitoreo de Agentes");
        return;
    }
    
    if(activar == 1){
        actualizarPrincipalActSst = 1;inicioInmediatoInspecc = 1;
    }
    
    inspeccionEvento={
        estadoEvento:1
    };
   
    $(".divListPrincipal > div").hide();$("#subRealizarInspecciones").show();
   
    var objInspeccion={
        auditoriaId:auditoriaId,auditoriaTipo:auditoriaTipo
    };
   
    if(auditoriaTipo == 94 || auditoriaTipo == 194){
        callAjaxPost(URL+'/auditoria/hallazgos',objInspeccion,procesarListaInspeccionHallazgosLibresMovil);
    }else{
        medidaCorrectivaActiva = (auditoriaTipo == 54?0:1);
       
        callAjaxPost(URL+'/auditoria/verificaciones/version_dos',objInspeccion,procesarListaInspeccionGeneralMovilVersionDos);
    }
}

function realizarInspeccionMovil(indexEvento){
   idEvento = indexEvento; //Id que permitirá cargar la ventana con el formulario
   
   evaluacionInspeccionObj = {id:0};
   actualizarPrincipalActSst = 0;inicioInmediatoInspecc = 0; 
	 
   if(indexEvento != null){
      if(indexEvento >= 0){
         inspeccionEvento = listFullEventos[indexEvento];
      }
   }
	
   if(inspeccionEvento.linkAuxiliarId2 == 100){
      alert("Por ahora, no disponible para Monitoreo de Agentes");
      return;
   }
	
   if(inspeccionEvento.linkAuxiliarId1 == 2){
   
   }
	
   $(".divListPrincipal > div").hide();
   
   $("#subRealizarInspecciones").show();
   
   $("#subRealizarInspecciones").find(".contenidoSubList").html("");
	
   $("#subRealizarInspecciones").find(".tituloSubList")
      .html(textoBotonVolverContenidoColaborador+""+inspeccionEvento.text);
	    
   var objInspeccion={
      auditoriaId: inspeccionEvento.idAux,
      auditoriaTipo: inspeccionEvento.linkAuxiliarId2
   };
   
   if(inspeccionEvento.linkAuxiliarId2 == 94 || inspeccionEvento.linkAuxiliarId2 == 194){
      callAjaxPostNoUnlock(URL+'/auditoria/hallazgos',objInspeccion,
         procesarListaInspeccionHallazgosLibresMovil,null,null,verSeccionRestringida);
   }else if(inspeccionEvento.linkAuxiliarId2 == 300){
      callAjaxPostNoUnlock(URL+'/auditoria/verificaciones/version_dos',objInspeccion,
         procesarListaInspeccionMovilExtintor,null,null,verSeccionRestringida); 
   }else if(inspeccionEvento.linkAuxiliarId2 == 303){
      callAjaxPostNoUnlock(URL+'/auditoria/verificaciones/version_dos',objInspeccion,
         procesarListaInspeccionMovilGabineteIncendio,null,null,verSeccionRestringida); 
   }else if(inspeccionEvento.linkAuxiliarId2 == 304){
      callAjaxPostNoUnlock(URL+'/auditoria/verificaciones/version_dos',objInspeccion,
         procesarListaInspeccionMovilTrabajadorEpp,null,null,verSeccionRestringida); 
   }else{
      medidaCorrectivaActiva = (inspeccionEvento.linkAuxiliarId2 == 54?0:1);

      callAjaxPostNoUnlock(URL+'/auditoria/verificaciones/version_dos',objInspeccion,
         procesarListaInspeccionGeneralMovilVersionDos,null,null,verSeccionRestringida);
   }
}

var actPorInicioDirectoInspeccGenV3;

function realizarInspeccionMovilGenV3(indexEvento){
    inspeccionEvento = listFullEventos[indexEvento];actPorInicioDirectoInspeccGenV3 = 0;

    verPrincipalInspeccionGeneralVersionTres();
}

function directoRealizarInspeccionMovilGenV3(valAuditoriaId){
    var auditoriaIdAux = parseInt(valAuditoriaId);
    var inicioDirectoAuditoria = 0;
    var fechaReporteInicio = $("#fechaInicioFiltroActividad").val();
    var fechaReporteFin = $("#fechaFinFiltroActividad").val();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),listEventosIdFiltro:[10],fechaReporteInicio:fechaReporteInicio,fechaReporteFin:fechaReporteFin,
        responsableId:(parseInt(getSession("trabajadorGosstId")) > 0?parseInt(getSession("trabajadorGosstId")):null),
    };

    callAjaxPostSimpleVersionDos(1,URL+'/scheduler',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
            var listFullEventosAux = data.list;

            listFullEventosAux.forEach(function(val){
                if(val.idAux == auditoriaIdAux){
                    inspeccionEvento = val;inicioDirectoAuditoria = 1;actPorInicioDirectoInspeccGenV3 = 1;
                }
            });

            if(inicioDirectoAuditoria == 1){
                verPrincipalInspeccionGeneralVersionTres();
            }
        }else{
            console.log("NOPNPO")
        }
    });
}

function verTodoPreguntaInspeccion(){
   listFullEvaluacionesInspeccion.forEach(function(val,index){
      $("#pregInsMovil"+index).show()
   });
}

function verSoloAplicaPreguntaInspeccion(){
	listFullEvaluacionesInspeccion.forEach(function(val,index){
		$("#pregInsMovil"+index).show();
		if(val.bitAplica==1){
			 
		}else{
			$("#pregInsMovil"+index).hide()
		}
	});
}
function verSoloIncompletaPreguntaInspeccion(){
	listFullEvaluacionesInspeccion.forEach(function(val,index){
		$("#pregInsMovil"+index).show();
		if(val.respuesta==null ){
			if(val.bitAplica==0){
				$("#pregInsMovil"+index).hide() 
			}
		}else{
			$("#pregInsMovil"+index).hide() 
		}
	});
}
function cancelarObservacionAuditoriaMovil(){
	$("#btnCambObsAudi").show();
	$("#btnCancelbObsAudi").hide();
	$("#btnGuardarObsAudi").hide();
	$("#divObsAudiMovil").html(auditoriaObjMovil.observacion);
	
}
function guardarObservacionAuditoriaMovil(){
	$("#btnCambObsAudi").show();
	$("#btnCancelbObsAudi").hide();
	$("#btnGuardarObsAudi").hide();
	auditoriaObjMovil.observacion=$("#textObsAudiMovil").val();
	callAjaxPost(URL+"/auditoria/editar/basico",
			{auditoriaId:auditoriaObjMovil.auditoriaId,observacion:auditoriaObjMovil.observacion},
			function(data){
		
		$("#divObsAudiMovil").html(auditoriaObjMovil.observacion);
	});
}
function cambiarObservacionAuditoriaMovil(){
	$("#btnCambObsAudi").hide();
	$("#btnCancelbObsAudi").show();
	$("#btnGuardarObsAudi").show();
	
	$("#divObsAudiMovil").html("<textarea rows='4' class='form-control' id='textObsAudiMovil'></textarea>");
	$("#textObsAudiMovil").val(auditoriaObjMovil.observacion);
	
}

function cancelarObservacionAuditoriaHallazgoMovil(){
	$("#btnCambObsHallAudi").show();
	$("#btnCancelbObsHallAudi").hide();
	$("#btnGuardarObsHallAudi").hide();
	$("#divObsAudiHallMovil").html(auxAuditoria.observacion);
	
}
function guardarObservacionAuditoriaHallazgoMovil(){
	$("#btnCambObsHallAudi").show();
	$("#btnCancelbObsHallAudi").hide();
	$("#btnGuardarObsHallAudi").hide();
	auxAuditoria.observacion=$("#textObsAudiHallMovil").val();
	callAjaxPost(URL+"/auditoria/editar/basico",
			{auditoriaId:auxAuditoria.auditoriaId,observacion:auxAuditoria.observacion},
			function(data){
		
		$("#divObsAudiHallMovil").html(auxAuditoria.observacion);
	});
}
function cambiarObservacionAuditoriaHallazgoMovil(){
	$("#btnCambObsHallAudi").hide();
	$("#btnCancelbObsHallAudi").show();
	$("#btnGuardarObsHallAudi").show();
	
	$("#divObsAudiHallMovil").html("<textarea rows='4' class='form-control' id='textObsAudiHallMovil'></textarea>");
	$("#textObsAudiHallMovil").val(auxAuditoria.observacion);
}

function ocultarAplicaAuditoria(){
	$("#modalAplicaAudi").modal("hide");
}
function verAplicaPreguntaInspeccion(){
	var dataParam = {
			auditoriaId:inspeccionEvento.idAux,
			auditoriaTipo:inspeccionEvento.linkAuxiliarId2
		};

		callAjaxPost(URL + '/auditoria/verificaciones', dataParam,
				function(data){
			var contenido ="<table id='tblAplicaAudi' class='table table-striped table-bordered table-hover'>" +
                 		"<thead><tr><td class='tb-acc'>...</td><td class='tb-acc'>Sección / Pregunta</td></tr></thead> " +
                 		"<tbody> </tbody></table>";
			var contenidoFinal="";
			var listContenido = [
                  
                 {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarAplicaAuditoria()'><i class='fa fa-times'></i>Cancelar</button>",
                	 inputForm:"<button class='btn btn-success' type='button' onclick='guardarAplicaAuditoria()'><i class='fa fa-floppy-o'></i>Guardar</button>"},
			                     ];
			listContenido.forEach(function(val){
				contenidoFinal +=obtenerSubPanelModuloGeneral(val);
			});
			var modalOptions= {id:"modalAplicaAudi",nombre:"<i class='fa fa-check-square-o'></i>Preguntas aplica",
					contenido: contenido};
			crearModalPrincipalUsuario(modalOptions,function(){
				var tipoVerificacion = "";
				data.list.forEach(function(val){
					if (tipoVerificacion != val.tipoVerificacion) {
						tipoVerificacion = val.tipoVerificacion;
						$("#tblAplicaAudi tbody").append(
								"<tr style='border-bottom: 3px solid black;' class='info' id='filaCategoria"+val.tipoVerificacionId+"'>" +
								"<td >" +"<input checked type='checkbox' onclick='marcarTodoCategoriaInspeccionColaborador("+val.tipoVerificacionId+",0)'>" +
											"</td>"+
								"<td class='info'  onclick='verListaVerifColaborador("+val.tipoVerificacionId+")'>"
										+"SECCIÓN : "+ val.tipoVerificacion + "</td>"
										+ "</tr>");
					}
					$("#tblAplicaAudi tbody")
					.append("<tr id='traplic"+val.verificacionId+"'>" +
							"<td><input "+ val.chckAplica+" class='form-control' type='checkbox'></td> " +
							"<td>"+val.verificacion+"</td></tr>")
				});
				$("#tblAplicaAudi").after(contenidoFinal);
			},false,true);
		});
}
function verListaVerifColaborador(tipoId){
	listFullEvaluacionesInspeccion.forEach(function(val){
		if(val.tipoVerificacionId == parseInt(tipoId)){
		 $("#traplic"+val.verificacionId).toggle();
		}
	})
}
function guardarAplicaAuditoria(){
	var listAplica = [];
	listFullEvaluacionesInspeccion.forEach(function(val){
		val.bitAplica = ($("#traplic"+val.verificacionId).find("input").prop("checked")?1:0)
		 val.auditoriaId = inspeccionEvento.idAux
	});
	
	callAjaxPost(URL + '/auditoria/verificaciones/respuesta/aplica/save', listFullEvaluacionesInspeccion,
			function(data){
		switch (data.CODE_RESPONSE) {
		case "05":
			ocultarAplicaAuditoria();
			realizarInspeccionMovil();
			break;
		default:
			alert("Ocurrió un error al guardar la auditoria!");
		}
	});
}
function marcarTodoCategoriaInspeccionColaborador(catId,tipo){

   //$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
   if(parseInt(tipo)==0){
    //var r=confirm("¿Está seguro de desaplicar esta categoría?")
    //if(!r){$("#filaCategoria"+catId).find("input").prop("checked",parseInt(tipo)==0);$.unblockUI();return;}
      $("#filaCategoria"+catId).find("input").attr("onclick","marcarTodoCategoriaInspeccionColaborador("+catId+",1)")
   }else{
    //var r=confirm("¿Está seguro de aplicar esta categoría?")
    //if(!r){$("#filaCategoria"+catId).find("input").prop("checked",parseInt(tipo)==0);$.unblockUI();return;}
      $("#filaCategoria"+catId).find("input").attr("onclick","marcarTodoCategoriaInspeccionColaborador("+catId+",0)")
   }
	
   //setTimeout(function(){
   listFullEvaluacionesInspeccion.forEach(function(val){
      if(val.tipoVerificacionId == parseInt(catId)){
         $("#traplic"+val.verificacionId).find("input").prop("checked",(parseInt(tipo)==1));
       //guardarCeldaDeshabilitarPreguntaCategoria(val.verificacionId,catId)
      }
   });
      //},1000);
}

var auditoriaObjMovil={};var listAreasInteresadasDetalleAuditoriaMovil=[],listSeccionesInteresadasDetalleAuditoriaMovil=[];

function procesarListaInspeccionMovil(data){
   if(data.CODE_RESPONSE == "05"){
      $.unblockUI()
      $("#subRealizarInspecciones").find(".contenidoSubList").html("");
      
      listFullEvaluacionesInspeccion = data.list;
      listAreasInteresadasDetalleAuditoriaMovil = data.areas;
      listSeccionesInteresadasDetalleAuditoriaMovil = data.secciones;
      auditoriaObjMovil = data.auditoriaAux[0];
      valTipoId = 2;
	
      var completas = auditoriaObjMovil.numSi;
      
      var selVisualizarPreguntas = crearSelectOneMenuOblig("selVisualizarPreguntas","verAcordeVisualizarPreguntas()",
         listVisualizarPreguntas,"1","id","nombre");
	
      $("#subRealizarInspecciones").find(".tituloSubList").html(
	 textoBotonVolverContenidoColaborador+""+
	 auditoriaObjMovil.auditoriaTipoNombre+"<br>" +
	 " Avance: "+auditoriaObjMovil.rptaRespondida+" / "+auditoriaObjMovil.numPreguntas);
	
      $("#subRealizarInspecciones").find(".contenidoSubList").append(
         "<div class='divInformacionCurso' style=' padding: 20px;'>" +
//		    "<strong>Detalle del Evento:</strong>" +
//		    "<div id='divObsAudiMovil' style='white-space: pre'>"+auditoriaObjMovil.observacion+"</div><br>"+
//	            "<button id='btnCambObsAudi' class='btn btn-success' style='margin-bottom:0px' onclick='cambiarObservacionAuditoriaMovil()'>" +
//		       "<i class='fa fa-cog'></i> Modificar detalle del evento" +
//		    "</button><br>" +
//		    "<button id='btnCancelbObsAudi' class='btn btn-danger' style='display:none;margin-bottom:20px' onclick='cancelarObservacionAuditoriaMovil()'>" +
//		       "<i class='fa fa-times'></i> Cancelar" +
//		    "</button> " +
//		    "<button id='btnGuardarObsAudi' class='btn btn-success' style='display:none;margin-bottom:20px' onclick='guardarObservacionAuditoriaMovil()'>" +
//		       "<i class='fa fa-floppy-o'></i> Guardar" +
//		    "</button><br>" +
            "<strong><i class='fa fa-filter'></i> Filtro:</strong>"+selVisualizarPreguntas+"<br>"+
            "<button id='btnIniciarEvalObsAudi' class='btn btn-success' style='margin-bottom:20px' onclick='iniciarEvaluacionInspeccion(0)'>" +
               "<i class='fa fa-list-ol'></i> Iniciar evaluación" +
	    "</button><br>" +
		 /* "<button class='btn btn-success' onclick='verAplicaPreguntaInspeccion()'><i class='fa fa-check-square-o '></i> Elegir preguntas que aplican </button> 					  <br><br>" +
		    "<button class='btn btn-success' onclick='verTodoPreguntaInspeccion()'><i class='fa fa-list '></i> Ver Todo </button> 					  <br><br>" +
		    "<button class='btn btn-success' onclick='verSoloAplicaPreguntaInspeccion()'><i class='fa fa-indent '></i>  Ver Solo Aplica </button> <br><br>" +
		    "<button class='btn btn-success' onclick='verSoloIncompletaPreguntaInspeccion()'><i class='fa fa-indent '></i>  Ver Solo Sin Responder </button>" + */
         "</div>");
	
      listFullEvaluacionesInspeccion.forEach(function(val,index){ 
         $("#subRealizarInspecciones").find(".contenidoSubList").append(crearDivEvaluacionInspeccion(val,index));
         $("#pregInsMovil"+index+">div").hide();
         $("#pregInsMovil"+index+" .divNombrePregunta").show();
		
         var mostrarOpciones = true;
		
         if(val.bitAplica == 0){
            mostrarOpciones = false;
         }
         
         mostrarOpciones=false;
         
         if(mostrarOpciones){
	    $("#pregInsMovil"+index+" .divOpcionesGosst").show();
         }else{
            $("#pregInsMovil"+index+" .divOpcionesGosst").hide();
         }
      });
      
      if(parseInt(getSession("gestopcompanyid")) == 647){
	 $(".inspeccion-campoRiesgoPotencial").hide();$(".inspeccion-campoInteresadosEmpresas").hide();
      }else if(parseInt(getSession("gestopcompanyid")) == 641){
	 $(".inspeccion-campoRiesgoPotencial").hide();$(".inspeccion-campoInteresadosAreas").hide(); 
      }else{
	 $(".inspeccion-campoCumpleParcialmente").hide();$(".inspeccion-campoRiesgoPotencial").hide();
	 $(".inspeccion-campoInteresadosAreas").hide(); 
      }
      
      if(lastHeightInspeccion != 0){
	 $(window).scrollTop(lastHeightInspeccion-$("#barraMenu").height()-60);
	 lastHeightInspeccion = 0;
      }
   }else{ 
		
   }
}

function verAcordeVisualizarPreguntas(){
    var visualizarOpcionId = $("#selVisualizarPreguntas").val(); 
    
    opcionVisualizar = parseInt(visualizarOpcionId);
    
    switch(opcionVisualizar){
       case 0:
	   verAplicaPreguntaInspeccion();
	   break;
       case 1:
	   verTodoPreguntaInspeccion();
	   break;
       case 2:
	   verSoloAplicaPreguntaInspeccion();
	   break;
       case 3:
	   verSoloIncompletaPreguntaInspeccion();
	   break;
    }
}

function guardarHallazgoInspeccion(opcion){
   opcionBoton = opcion; 
    
   var inputDesc = $("#inputDescHall").val();
   var inputCausa = $("#inputCausaHall").val();
   var inputLugar = $("#inputLugarHall").val();
   var area = $("#selAreaHallazgo").val();
   var nivel = $("#selNivelHallazgo").val(); 
   var tipoReporte = $("#selTipoReporteHallazgo").val();	
   var factor = $("#selFactorHallazgo").val();
   
   var listSecciones = [];
   
   var secciones = $("#slcSeccionesPermitidaHallazgo").val();
       
   if(secciones != null){
      if($("#slcSeccionesPermitidaHallazgo").length > 0){
    	 secciones.forEach(function(val,index){
    	    listSecciones.push({id:val});
    	 });
      }
   }
	
   var areas = $("#slcAreasPermitidaHallazgo").val();
   var listAreas=[];
	
   if(areas != null){
      if($("#slcAreasPermitidaHallazgo").length > 0){
         areas.forEach(function(val,index){
            listAreas.push({areaId:val});
	 });
      }
   }
	
   if(inputDesc.length == 0){
      alert("Descripción es obligatorio"); return;
   }
		
   var dataParam={
      id: evaluacionInspeccionObj.id,factor: {id: factor},secciones: listSecciones,
      areas: listAreas,descripcion: inputDesc,tipoReporte: {id: tipoReporte},
      area: {areaId: area},nivel: {id: nivel},causa: inputCausa,lugar: inputLugar,
      auditoriaId: auxAuditoria.auditoriaId,empresaId: getSession("gestopcompanyid")
   };
		
   getLocation(function(){
      dataParam.posicion={
         x: posicionX,y: posicionY,
      }
			
      callAjaxPost(URL+'/auditoria/hallazgo/save',dataParam,
         procesarResultadoGuardarHallazgoVistaColaborador);
   });
}

function procesarResultadoGuardarHallazgoVistaColaborador(data){
   switch(data.CODE_RESPONSE){
      case "05":
//	 guardarEvidenciaAuto(data.nuevoId,"fileEviHallazgo",bitsEvidenciaHallazgo,
//	    "/auditoria/hallazgo/evidencia/save",realizarInspeccionMovil,"hallazgoId");
//	   
//         if(opcionBoton == 0){
//            mensajeUx = 
//               "<label>El nuevo hallazgo ha sido registrado (lo encuentra debajo " +
//               "del presente formulario, en caso de haber otros hallazgos, se " +
//               "encontrará al final de todos ellos).</label>";  
//            mensajesUx(mensajeUx,1,"");
//         }else{
//            mensajeUx = "<label>El nuevo hallazgo ha sido registrado.</label>";  
//            mensajesUx(mensajeUx,1,"");
//              
//            volverDivSubContenidoColaborador(this);   
//         }
         
         guardarEvidenciaAuto(data.nuevoId,"fileEviHallazgo",bitsEvidenciaHallazgo,
     	 "/auditoria/hallazgo/evidencia/save",function(){ 
            mensajeUx = "<label>El nuevo hallazgo ha sido registrado.</label>" +
               (opcionBoton == 0?"<br><label>(lo encuentra debajo del presente formulario, en caso " +
                "de haber otros hallazgos, se encontrará al final de todos ellos).</label>":"");
            
            mensajesUx(mensajeUx,1,"");
            
            if(actualizarPrincipalActSst == 1){
               accesoDirectoRealizarInspeccionMovil(auxAuditoria.auditoriaId,auxAuditoria.auditoriaTipo,0);
            }else{
               realizarInspeccionMovil(idEvento);
            }
            
            if(opcionBoton == 1){
               volverDivSubContenidoColaborador(this);
            }
         },"hallazgoId");
 	 
         break;
       
      default:
 	 mensajeUx = "<label>Ocurrió un error al guardar el registro del nuevo " +
 	 	     "hallazgo libre.</label>";  
         mensajesUx(mensajeUx,2,"");
   }
}

var textoBotonTogglePregunta =
   "<button class='btn btn-success' onclick='cambiarDivSubPregunta(this)'>" +
      "<i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i>" +
   "</button>";

var textoBotonToggleInformacion =
   "<button class='btn btn-success' onclick='cambiarDivSubInformacion(this)'>" +
      "<i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i>" +
   "</button>";

function cambiarDivSubPregunta(obj){
   $(obj).parent(".divNombrePregunta").siblings(".divOpcionesGosst").toggle();
}

function cambiarDivSubInformacion(obj){
   $(obj).parent(".divNombreInformacion").siblings("div").toggle();
}

function agregarSolicitudAccionMejora(indexEval,tipoId){
   $(".listaHallazgosLibresGosst").hide(); 
   
   evaluacionInspeccionObj = listFullEvaluacionesInspeccion[indexEval];
   evaluacionInspeccionObj.index = indexEval;
   gestionAccionAsociadaId = 0;
	
   var asociadoAuxId = (parseInt(tipoId) == 2?evaluacionInspeccionObj.detalleAuditoriaId:
      (parseInt(tipoId) == 6?evaluacionInspeccionObj.id:0));
	
   var dataParam={
      idCompany: getSession("gestopcompanyid"),
      asociadoTipo: parseInt(tipoId),
      asociadoId : asociadoAuxId
   };
	
   callAjaxPostNoUnlock(URL+'/gestionaccionmejora/items',dataParam,
      function(data){
         if(data.CODE_RESPONSE == "05"){
	    $.unblockUI();
	    var listHallazgo = data.listHallazgo; 
	    var listAux = data.list;
	    var selTipoHallazgo = crearSelectOneMenuOblig("selTipoHallazgo","",listHallazgo,
	       5,"id","nombre","Seleccionar nueva acción de mejora");
	    var valorAutomatico,sugerencia;
	    
	    listTipoAccionMejoraGlobal = data.listTipoAccionMejora;
	    
	    listTipoAccionMejoraGlobal.forEach(function(val){
	       valorAutomatico = val.codigo;
	    });
	     
	    listAux.forEach(function(val){
	       sugerencia = val.sugerencia;
	    });
	    
	    var listItemsEvalInsp=[ 
	       {sugerencia:"",label:"Nueva Solicitud de Mejora",inputForm:""},
	       {sugerencia:"",clase:"campoTipoHallazgo-solicitudMej",
		label:"*Tipo de Hallazgo",inputForm:selTipoHallazgo}, 
	       {sugerencia:"Dentro de la solicitud se asignará el plan de trabajo asociado",
		label:"*Título de la solicitud",
                inputForm:"<input id='inputNombreGestion' value='"+valorAutomatico+"' class='form-control'>"},
	     //{sugerencia:"",label:"*Última solicitud registrada",inputForm:"<label>"+sugerencia+"</label>"}
	    ];
	    
	    var textFormAcc = obtenerSubFormInspeccion(listItemsEvalInsp,"guardarGestionAsociada("+tipoId+"," + 
	       asociadoAuxId+",1)",null,"Guardar solicitud y agregar plan de trabajo");
		
	    $(".divInformacionCurso").hide();
		
	    $("#pregInsMovil"+indexEval).show();
	    $("#pregInsMovil"+indexEval+" > div").hide();
	    $("#pregInsMovil"+indexEval+" > .divNombrePregunta").show();
	    $("#pregInsMovil"+indexEval+" > .divAsignarGestionAccion").show();
	    $("#pregInsMovil"+indexEval+" > .divAsignarGestionAccion").html(textFormAcc);
 
	    $("#hallInsMovil"+indexEval).show();
	    $("#hallInsMovil"+indexEval+" > div").hide();
	    $("#hallInsMovil"+indexEval+" > .divNombreInformacion").show();
	    $("#hallInsMovil"+indexEval+" > .divAsignarGestionAccion").show();
	    $("#hallInsMovil"+indexEval+" > .divAsignarGestionAccion").html(textFormAcc);
	    
	    if(parseInt(tipoId) == 6 && parseInt(getSession("gestopcompanyid")) == 647){
	       $(".campoTipoHallazgo-solicitudMej").hide();
	    }		
	    
	    if(parseInt(getSession("gestopcompanyid")) != 647){
	       $(".btn-HallConSolAccMej").hide();
	    }
         }
      },null,null,verSeccionRestringida);
}

function guardarGestionAsociada(tipoId,asociadoAuxId,isNuevo){ 
   var gestionIdSave = 0;
   var tipoHallazgoId = parseInt($("#selTipoHallazgo").val());
	
   if(parseInt($("input[name='gestion']:checked").val()) > 0){
      gestionIdSave = parseInt($("input[name='gestion']:checked").val());
   }
   	
   var dataParam={
      idCompany: getSession("gestopcompanyid"),asociadoTipo: tipoId,
      asociadoId: asociadoAuxId,tipoHallazgo: {id: tipoHallazgoId},
      causaId: 16,resumen: $("#inputNombreGestion").val(),estadoId: 1,
      responsableId: getSession("trabajadorGosstId"),gestionAccionMejoraId: gestionIdSave
   }; 
   
   callAjaxPostNoUnlock(URL+'/gestionaccionmejora/items/save',dataParam,
      function(data){
         if(data.CODE_RESPONSE == "05"){
            $.unblockUI();
	    evaluacionInspeccionObj.gestionAccionMejoraId = data.nuevoId;
			
	    if(parseInt(isNuevo) == 1){
	       mensajeUx = "<label>Solicitud de mejora guardada. Ahora registre " +
	       		   "las acciones correctivas.</label>";
	       mensajesUx(mensajeUx,1,"");
	       
	       verAccionesMejoraInspeccion(evaluacionInspeccionObj.index,data.nuevoId);
	    }else{
	       mensajeUx = "<label>Solicitud de mejora asignada.</label>";
	       mensajesUx(mensajeUx,1,"");
	       
	       if(actualizarPrincipalActSst == 1){
		  if(auxAuditoria != null){ 
		     accesoDirectoRealizarInspeccionMovil(auxAuditoria.auditoriaId,auxAuditoria.auditoriaTipo,0); 
		  }else{
		     accesoDirectoRealizarInspeccionMovil(auditoriaObjMovil.auditoriaId,auditoriaObjMovil.auditoriaTipo,0);  
		  }
	       }else{
	          realizarInspeccionMovil(idEvento);   
	       }
	    }
	 }
      },null,null, verSeccionRestringida);
}

function verAccionesMejoraInspeccion(indexEval,solicitudId,wantsOtro){
   $(".listaHallazgosLibresGosst").hide();
   
   var asociadoAuxId = 0;
   evaluacionInspeccionObj = listFullEvaluacionesInspeccion[indexEval];
   evaluacionInspeccionObj.index = indexEval;
	
   var dataParam={
      accionMejoraTipoId: 0,
      gestionAccionMejoraId: solicitudId
   };
		 
   callAjaxPost(URL+'/gestionaccionmejora/accionmejora',dataParam,function(data){ 
      var listTipoAccionHallazgo = data.listTipoAccionMejoraH;
      var listTipoControl = data.clasificacion;	 
      
      var selTipoHallazgo = crearSelectOneMenuOblig("selTipoHallazgo","",
	 listTipoAccionHallazgo,5,"tipoAccionId","tipoAccionNombre","");
      var selTipoControl = crearSelectOneMenuOblig("selTipoControl","",
	 listTipoControl,8,"id","nombre","");
		    
      var btnVolver = 
	 "<button type='button' class='btn btn-danger' onclick='volverAccionesInpseccion()'>" +
	    "<i class='fa fa-backward'></i> Volver" +
	 "</button>";
      
      var btnGuardarVolver = 
	 "<button type='button' class='btn btn-success' onclick='guardarAccionInsp(0)'>" +
	    "<i class='fa fa-floppy-o'></i> " +
	     (parseInt(getSession("gestopcompanyid")) == 647?"Guardar y volver a la lista de acciones":
	      "Guardar y volver") +
	 "</button>";
      
      var btnGuardarOtro = 
	 "<button type='button' class='btn btn-success' onclick='guardarAccionInsp(1)'>" +
	    "<i class='fa fa-floppy-o'></i> Guardar y agregar otra corrección" +
	 "</button>"
      
      var listItemsEvalInsp=[
         {sugerencia:"",label:"Solicitud Acción ",
          inputForm:"Acciones de mejora ("+data.list.length+")"},
	 {clase:"classNuevo clasifAccTipHallazgo-solAccMej",sugerencia:"",
          label:"Clasificación de la acción según el Tipo de Hallazgo",inputForm:selTipoHallazgo}, 
	 {clase:"classNuevo clasifAccTipControl-solAccMej",sugerencia:"",
          label:"Clasificación de la acción según el Tipo de Control",inputForm:selTipoControl}, 
	 {clase:"classNuevo",sugerencia:"",label:"Descripción de la acción",
          inputForm:"<input class='form-control' id='inputDescAccInsp'>"},
         {clase:"classNuevo",sugerencia:"",label:"Fecha planificada",
          inputForm:"<input class='form-control' id='datePlanifAccInsp' type='date'>"},
	 {clase:"classNuevo",sugerencia:"* Debe ingresar un nombre o un apellido y seleccionarlo en el siguiente campo.",
          label:"Encargado de la acción*",
	  inputForm:"<input onchange='verAutoCompletarTrabAccMejoraInspeccionLibre()' class='form-control' " +
	  		   "id='inputNombreAccInsLibre' placeholder='Nombre o apellido'>",
	  divContainer:"divTrabAccIns"},
	 {clase:"classNuevo",sugerencia:"",label:"Resultado búsqueda - Encargado de la acción*",
	  inputForm:"<div id='divAutoCompletarTrabAccMejoraInspLibre'></div>"},
	 {clase:"classNuevo",sugerencia:"",label:"<i style='color:#FFEF00;' class='fa fa-question-circle' " +
	  "title='*Para registrar la acción correctiva como completada, deberá subir una evidencia. Esto también " +
	  "lo puede realizar la persona responsable desde la sección Mis Actividades.'></i> " +
	  "Evidencia de la acción de mejora <strong style='color:blue;'>(opcional)**</strong>",
	  inputForm:"",divContainer:"divEviAccIns"},
	 {clase:"classNuevo",sugerencia:"",label:""+btnVolver,
	  inputForm:""+btnGuardarVolver+"<br><br>"+btnGuardarOtro,divContainer:""}
      ];
			
      data.list.forEach(function(val,index){
         var btnBorrar = 
            "<button type='button' class='btn btn-danger' onclick='borrarAccionesInpseccion("+val.accionMejoraId+")'>" +
               "<i class='fa fa-trash'></i>" +
            "</button>";
         
         var btnDescarga = 
            "<a target='_blank' href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.accionMejoraId+"' " +
               "class='efectoLink'>" +
               "<i class='fa fa-download'></i> Descargar" +
            "</a>";
				
         if(val.evidenciaNombre == "" || val.evidenciaNombre == "----"){
	    btnDescarga = "<strong style='color:red'>Sin evidencia</strong>";
         }
				
         listItemsEvalInsp.push({
	    sugerencia:"*Fecha Planificada: "+(val.fechaRevisionTexto==null?val.fechaRealTexto:val.fechaRevisionTexto)+"<br>" +
		       "*Responsable: "+val.responsableNombre+"<br>" +
		       "*Estado de implementación: "+val.estadoCumplimientoNombre,
	    label:""+btnBorrar+" #"+(index+1),
            inputForm:(parseInt(getSession("gestopcompanyid")) == 647?"":
        	       "*Tipo de acción: "+val.tipoAccionNombre+"<br>") +
	              "*Descripción: "+val.descripcion+"<br>" +
		      "*Evidencia: "+btnDescarga+"<br>"});
      });
			
      var textFormAcc = obtenerSubFormInspeccion(listItemsEvalInsp,"nuevaAccionMejoraInspeccion()",
	 null,"Nueva acción de mejora","volverEvaluacionGeneralInspeccion(1)");
			 
      $(".divInformacionCurso").hide();
      $("#pregInsMovil"+indexEval).show();
      $("#pregInsMovil"+indexEval+" > div").hide();
      $("#pregInsMovil"+indexEval+" > .divNombrePregunta").show();
      $("#pregInsMovil"+indexEval+" > .divAsignarGestionAccion").show();
      $("#pregInsMovil"+indexEval+" > .divAsignarGestionAccion").html(textFormAcc);
      
      $("#hallInsMovil"+indexEval).show();
      $("#hallInsMovil"+indexEval+" > div").hide();
      $("#hallInsMovil"+indexEval+" > .divNombreInformacion").show();
	
      if(valTipoId == 6){ //evitar cruce al crear una nueva solicitud de acción de mejora
         var idDivAux = "infHallInsMovil"+indexEval;
				     
         var divOriginalAdi = document.getElementById(idDivAux).innerHTML;
				    
         var contenidoHallazgoSolicitud = document.getElementById("contenidoHallazgoSolicitud"+indexEval).innerHTML;
				     
         var solicitudAsignada = "<strong style='color:blue;margin:0;'>"+ $("#inputNombreGestion").val()+"</strong>";
				     
         if($("#inputNombreGestion").val() != undefined){ //Nueva solicitud - Debe haber sido ingresada
            if(contenidoHallazgoSolicitud == "Sin Asociar"){ //Rojo - Sin Asociar - Sobreescribir Sin Asociar
               var cambio = divOriginalAdi.replace("Sin Asociar",solicitudAsignada);
               document.getElementById(idDivAux).innerHTML = cambio;
            }else{ //Azul - Existente - Sobreescribir Solicitud existente
               var cambio = divOriginalAdi.replace(contenidoHallazgoSolicitud,$("#inputNombreGestion").val());
               document.getElementById(idDivAux).innerHTML = cambio;
            }
         }
      }			     
				     
      $("#hallInsMovil"+indexEval+" > .divAsignarGestionAccion").show();
      $("#hallInsMovil"+indexEval+" > .divAsignarGestionAccion").html(textFormAcc);

      var options={
	 container:"#divEviAccIns",functionCall:function(){},
	 descargaUrl: "",esNuevo:true,
	 idAux:"AccionInsp",evidenciaNombre:"",
	 mensajeAux:"** Si ya ha realizado la acción, introduzca la evidencia."
      };
				
      crearFormEvidenciaCompleta(options);
      volverAccionesInpseccion();
				
      if(wantsOtro == 1){
         nuevaAccionMejoraInspeccion();
      }	
      
      if(accMejAutoHallLib == 1){
	 nuevaAccionMejoraInspeccion();
         accMejAutoHallLib = 0;
      }
      
      if(parseInt(getSession("gestopcompanyid")) != 647){
         $(".btn-HallConSolAccMej").hide();
      }
   }); 
}

function verAutoCompletarTrabAccMejoraInspeccionLibre(){
   var nombre = $("#inputNombreAccInsLibre").val().trim();

   if(nombre == ""){nombre = null;}
	
   var dataParam={
      trabajadorNombre: "%"+nombre+"%",
      empresaId: getSession("gestopcompanyid")
   };
	
   callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
      if(data.trabajadores.length == 0){
         data.trabajadores.push({
            trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
         });
      };
		
      crearSelectOneMenuObligUnitarioCompleto("selTrabAccionInsp","",data.trabajadores,
	 "trabajadorId","nombre","#divAutoCompletarTrabAccMejoraInspLibre",""); 
		
      $("#inputNombreAccInsLibre").attr("onkeyup","verAutoCompletarTrabAccMejoraInspeccionLibre()");
   });
}

function volverAccionesInpseccion(){
   $(".divAsignarGestionAccion .form-group").show();
   $(".classNuevo").hide();
}

function nuevaAccionMejoraInspeccion(){
   $(".divAsignarGestionAccion .form-group").hide();
   $(".classNuevo").show();
   
   if(parseInt(getSession("gestopcompanyid")) == 647 || parseInt(getSession("gestopcompanyid")) == 670){
      $(".clasifAccTipHallazgo-solAccMej").hide();$(".clasifAccTipControl-solAccMej").hide(); 
   }
	
   mensajeUx = "*Para registrar la acción correctiva como completada, deberá subir una evidencia." +
	      " Esto también lo puede realizar la persona responsable desde la sección Mis Actividades. ";
	
   var userAgent = isMobile.any();
	
   if(userAgent == true){
      if(countMensajeMovil == 0){
	 mensajesUx(mensajeUx,1,"");
      }
   }
	
   countMensajeMovil++;
	
   verAutoCompletarTrabAccMejoraInspeccionLibre();
}

function borrarAccionesInpseccion(accionId){
	var r = confirm("¿Está seguro de eliminar la acción?");
	if (r == true) {
		var dataParam = {
				accionMejoraId : accionId
		};

		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/delete',
				dataParam, function(data){
			verAccionesMejoraInspeccion(evaluacionInspeccionObj.index,evaluacionInspeccionObj.gestionAccionMejoraId);
		});
	}
}

function guardarAccionInsp(wantsOtro){
//   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   wantsOtro = parseInt(wantsOtro);
   
   var descripcion = $("#inputDescAccInsp").val();
   var trabajadorResponsableId = $("#selTrabAccionInsp").val();
   var fechaPlanificada = $("#datePlanifAccInsp").val(); 
   var horaPlanificada = "12:00";
   var clasificacionControlId = $("#selTipoControl").val();
   var selTipoAccHallazgo = parseInt($("#selTipoHallazgo option:selected").val()); 

   if(descripcion.length == 0){
      alert("Descripción obligatoria");
      $.unblockUI();
      return;
   }
   
   if(trabajadorResponsableId == "-1"){
      alert("Trabajador obligatorio");
      $.unblockUI();
      return;
   }
	
   var dataParam={
      accionMejoraId: 0,clasificacion: {id: clasificacionControlId},
      trabajadorResponsableId: trabajadorResponsableId,descripcion: descripcion,
      fechaRevision: fechaPlanificada,horaPlanificada: horaPlanificada,
      accionMejoraTipoId: selTipoAccHallazgo,estadoId: 1,inversionAccion: 0,
      companyId: getSession("gestopcompanyid"),
      gestionAccionMejoraId: evaluacionInspeccionObj.gestionAccionMejoraId	
   };
   
   if(valTipoId == 6){//HALLAZGO
      dataParam.hallazgoIdAux = evaluacionInspeccionObj.id;
   }
   
   callAjaxPost(URL+'/gestionaccionmejora/accionmejora/save',dataParam,function(data){
      switch(data.CODE_RESPONSE){
	 case "05": 
//	    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
	    guardarEvidenciaAuto(data.nuevoId,"fileEviAccionInsp",bitsEvidenciaAccidente,
	    '/gestionaccionmejora/accionmejora/evidencia/save',function(){
//	       $.unblockUI();
	       mensajeUx="<label>Se ha guardado la acción de mejora correctamente.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarSolAccMejVisCol");
		
	       $("#modalMensajeUxActualizarSolAccMejVisCol").on("hidden.bs.modal",function(){ 
	          verAccionesMejoraInspeccion(evaluacionInspeccionObj.index,evaluacionInspeccionObj.gestionAccionMejoraId,wantsOtro);
	       });
	    },"accionMejoraId");
				
	    break;
	    
	 default:
	    alert("Ocurrió un error al guardar la acción");
      }
   });
}

function seleccionarGAM(gestionID){
	gestionAccionAsociadaId=gestionID;
}
function asignarSolicitudAccionMejora(indexEval,tipoId){
    
    $(".listaHallazgosLibresGosst").hide();     
    
	evaluacionInspeccionObj=listFullEvaluacionesInspeccion[indexEval];
	evaluacionInspeccionObj.index = indexEval
	var asociadoAuxId=0;
	if(parseInt(tipoId)==2){
		asociadoAuxId=evaluacionInspeccionObj.detalleAuditoriaId
	}
	if(parseInt(tipoId)==6){
		asociadoAuxId=evaluacionInspeccionObj.id
	}
	var dataParam = {
			idCompany : getSession("gestopcompanyid"),
			asociadoTipo : tipoId,
			asociadoId : asociadoAuxId
		};
		 
   callAjaxPost(URL + '/gestionaccionmejora/items', dataParam,
				function(data){
			var listItemsEvalInsp=[ {sugerencia:"",label:"Asignar Solicitud Acción",inputForm:""}]
			data.list.forEach(function(val,index){
				listItemsEvalInsp.push({sugerencia:"Debido a: "+val.causaNombre,
							label:"<input  class='form-control' type='radio' " +
	                   			 				"name='gestion' " +
	                   			 				"id='boxGestion"+val.gestionAccionMejoraId+"' " +
	                   			 				"value='"+val.gestionAccionMejoraId+"'  >"
			                   			 ,inputForm:"<label style='color:black'>"+val.resumen+"</label><br>"});
			});
			var textFormAcc=obtenerSubFormInspeccion(listItemsEvalInsp,"guardarGestionAsociada("+tipoId+","+asociadoAuxId+",0)");
			 $(".divInformacionCurso").hide();
				$("#pregInsMovil"+indexEval ).show();
				$("#pregInsMovil"+indexEval+" > div").hide();
				$("#pregInsMovil"+indexEval+" > .divNombrePregunta").show();
				$("#pregInsMovil"+indexEval+" > .divAsignarGestionAccion").show();
				$("#pregInsMovil"+indexEval+" > .divAsignarGestionAccion").html(textFormAcc);
				 
				$("#hallInsMovil"+indexEval).show();
				$("#hallInsMovil"+indexEval+" > div").hide();
				$("#hallInsMovil"+indexEval+" > .divNombreInformacion").show();
				$("#hallInsMovil"+indexEval+" > .divAsignarGestionAccion").show();
				$("#hallInsMovil"+indexEval+" > .divAsignarGestionAccion").html(textFormAcc);
				
      if(parseInt(getSession("gestopcompanyid")) != 647){
         $(".btn-HallConSolAccMej").hide();
      }
   });
}

function procesarListaInspeccionHallazgosLibresMovil(data){
   if(data.CODE_RESPONSE == "05"){
      $.unblockUI();
      $("#subRealizarInspecciones").find(".contenidoSubList").html("");
	    
      listFullEvaluacionesInspeccion = data.list;auxAuditoria = data.listAux[0];
      listAreasHallazgo = data.areas;listNivelRiesgoHallazgo = data.niveles;
      listTipoReporteHallazgo = data.tiposReporte;listFactorHallazgo = data.factor;
      listSeccionesInteresadasHallazgo = data.secciones;listAreasInteresadasHallazgo = data.areasInteresadas;
	    
      valTipoId = 6;
	    
      var selAreaHallazgo = crearSelectOneMenuOblig("selAreaHallazgo","",
	 listAreasHallazgo,"","areaId","areaName"); 
			
      var selTipoReporteHallazgo = crearSelectOneMenuOblig("selTipoReporteHallazgo","",
	 listTipoReporteHallazgo,"","id","nombre");
      //
      var selNivelHallazgo = crearSelectOneMenuOblig("selNivelHallazgo","",
	 listNivelRiesgoHallazgo,6,"id","nombre");
			
      var selFactorHallazgo = crearSelectOneMenuOblig("selFactorHallazgo","",
	 listFactorHallazgo,6,"id","nombre");
	    
      var textoSeccInteresadas = "Partes Interesadas " +
	 (parseInt(getSession("gestopcompanyid")) == 647?"(encargados)":"(empresa)");
	    
      textAuxMulSelectHallazgo = (parseInt(getSession("gestopcompanyid")) == 647?
         "Encargados interesados...":"Secciones interesadas...");
	    
      var listItemsHallInsp=[
	 {sugerencia:"",label:"Descripción",
	  inputForm:"<input class='form-control' id='inputDescHall'>",divContainer:""},
	 {sugerencia:"",label:"Tipo de reporte",inputForm:selTipoReporteHallazgo,divContainer:""},
	 {sugerencia:"",label:"Nivel de Riesgo",clase:"campoNivelRiesgo-Hallazgo",
	  inputForm:selNivelHallazgo,divContainer:""},
	 {sugerencia:"",label:"Factor de seguridad",clase:"campoFactorSeguridad-Hallazgo",
	  inputForm:selFactorHallazgo,divContainer:""},
	 {sugerencia:"",label:"Partes Interesadas (áreas)",clase:"campoParIntAreas-Hallazgo",
	  divContainer:"tdhaarea",inputForm:""},
	 {sugerencia:"",label:textoSeccInteresadas,clase:"campoSeccInteresadas-Hallazgo",
	  divContainer:"tdhasecc",inputForm:""},
	 {sugerencia:"",label:"Causa que origina el hallazgo",clase:"campoCausaOrigen-Hallazgo",
	  inputForm:"<input class='form-control' id='inputCausaHall'>",divContainer:""},
	 {sugerencia:"",label:"Lugar específico",clase:"campoLugarEspecifico-Hallazgo",
	  inputForm:"<input class='form-control' id='inputLugarHall'> ",divContainer:""},
	 {sugerencia:"",label:"Evidencia",inputForm:" ",divContainer:"eviHallazgoMovil"}
      ]; 
		
      $("#subRealizarInspecciones").find(".contenidoSubList").append(
         "<div class='divInformacionCurso' style=' padding: 20px;'>" +
	    "<strong>Detalle del Evento:</strong> " +
	    "<div id='divObsAudiHallMovil' style='word-break:break-all;'>"+auxAuditoria.observacion+"</div><br>"+
               "<button id='btnCambObsHallAudi' class='btn btn-success' " +
		       "style='margin-bottom:0px' onclick='cambiarObservacionAuditoriaHallazgoMovil()'>" +
	          "<i class='fa fa-cog'></i> Modificar detalle del evento" +
	       "</button>" +
	       "<br>" +
	       "<button id='btnCancelbObsHallAudi' class='btn btn-danger' style='display:none;margin-bottom:20px' " +
		       "onclick='cancelarObservacionAuditoriaHallazgoMovil()'>" +
	          "<i class='fa fa-times'></i> Cancelar" +
	       "</button> " +
	       "<button id='btnGuardarObsHallAudi' class='btn btn-success' style='display:none;margin-bottom:20px' " +
		       "onclick='guardarObservacionAuditoriaHallazgoMovil()'>" +
	          "<i class='fa fa-floppy-o'></i> Guardar" +
	       "</button>" +
	       "<br>" +
	    "</div>");
			
      $("#subRealizarInspecciones").find(".contenidoSubList").append(
         "<div class='divInformacionCurso' id='divFormHallazgo'>" +
	    "<div class='divNombreInformacion'>" +
	        textoBotonToggleInformacion+" Nuevo Hallazgo" +
	    "</div>" +
	    "<div class='divEvalHallazgoInspeccion'>" +
	        (parseInt(getSession("gestopcompanyid")) == 647?
	         obtenerSubFormInspeccion(listItemsHallInsp,"guardarHallazgoInspeccionConSolicitudAccion()",
	            null,"Guardar y generar solicitud de accion"):
	         obtenerSubFormInspeccion(listItemsHallInsp,"guardarHallazgoInspeccion(0)",
	            "guardarHallazgoInspeccion(1)")) +
	    "</div>" +
         "</div>");
      
      if(actualizarPrincipalActSst == 1){
	 $("#subRealizarInspecciones").find(".tituloSubList")
	    .html(textoBotonVolverContenidoColaborador+""+auxAuditoria.auditoriaTipoNombre);
      }
			
      listSeccionesInteresadasHallazgo.forEach(function(val){
         val.selected = 0;
      });
			
      crearSelectOneMenuObligMultipleCompleto("slcSeccionesPermitidaHallazgo","",
	 listSeccionesInteresadasHallazgo,"id","nombre","#tdhasecc",textAuxMulSelectHallazgo);
			
      listAreasInteresadasHallazgo.forEach(function(val){
	 val.selected = 0;
      });
			
      crearSelectOneMenuObligMultipleCompleto("slcAreasPermitidaHallazgo","",
	 listAreasInteresadasHallazgo,"areaId","areaName","#tdhaarea","Áreas interesadas...");
									
      var options={
	 container: "#eviHallazgoMovil",functionCall: function(){},
	 descargaUrl: "",esNuevo: true,
	 idAux: "Hallazgo",evidenciaNombre: ""
      };
			
      crearFormEvidenciaCompleta(options);
	    
      if(parseInt(getSession("gestopcompanyid")) == 647){
	 $(".campoNivelRiesgo-Hallazgo").hide();$(".campoFactorSeguridad-Hallazgo").hide();
	 $(".campoParIntAreas-Hallazgo").hide();$(".campoLugarEspecifico-Hallazgo").hide();
      }
			
      $(".divEvalHallazgoInspeccion .btn-danger").hide();
			
      listFullEvaluacionesInspeccion.forEach(function(val,index){
         $("#subRealizarInspecciones").find(".contenidoSubList")
	    .append(crearDivEvaluacionHallazgos(val,index));
			      
	 $("#hallInsMovil"+index+">div").hide();
	 $("#hallInsMovil"+index+" .divNombreInformacion").show();
	      
	 if(accMejAutoHallLib == 1){
            if(val.id == hallLibIdAux){
	       indexhallLibAux = index;
	       solAccMejIdAux = val.accion.gestionAccionMejoraId;
            }
	 }
				
	 var mostrarOpciones = true;
				
	 if(mostrarOpciones){
            $("#hallInsMovil"+index+" .divOpcionesGosst").show();
	 }else{
	    $("#hallInsMovil"+index+" .divOpcionesGosst").hide();
	 }
      });
	    
      if(accMejAutoHallLib == 1){
	 verAccionesMejoraInspeccion(indexhallLibAux,solAccMejIdAux);
      }
			
      if(lastHeightInspeccion != 0){
	 $(window).scrollTop(lastHeightInspeccion-$("#barraMenu").height()-60);
	 lastHeightInspeccion = 0;
      }
   }else{ 	
       
   }
}

function crearDivEvaluacionHallazgos(contenidoVal,contenidoIndex){
   var colorTexto; 
	
   var listItemsEvalInsp=[
      {sugerencia:"",label:"Descripción",
       inputForm:"<input class='form-control' id='inputDescHall'>",divContainer:""},
      {sugerencia:"" ,inputForm:" ",label:"Evidencia",divContainer:"divEvidenciaEvalIns"}
   ];
   
   $(".listaHallazgosLibresGosst").hide();
   
   var menuOpcion = "<ul class='list-group listaHallazgosLibresGosst'>";
       
   menuOpcion += 
      "<li class='list-group-item' onclick='editarHallazgoInspeccionMovil("+contenidoIndex+")'>" +
         "<i class='fa fa-pencil' aria-hidden='true'></i> Editar Hallazgo " +
      "</li>";
   
   menuOpcion +=
      "<li class='list-group-item' onclick='eliminarHallazgoInspeccionMovil("+contenidoIndex+")'>" +
         "<i class='fa fa-times' aria-hidden='true'></i> Eliminar Hallazgo " +
      "</li>";
   
   if(parseInt(getSession("gestopcompanyid")) != 647){
      menuOpcion += 
         "<li class='list-group-item' onclick='agregarSolicitudAccionMejora("+contenidoIndex+",6)'>" +
            "<i class='fa fa-file' aria-hidden='true'></i> Crear solicitud de Acción de mejora " +
         "</li>";
   
      menuOpcion +=
         "<li class='list-group-item' onclick='asignarSolicitudAccionMejora("+contenidoIndex+",6)'>" +
            "<i class='fa fa-star' aria-hidden='true'></i> Asignar solicitud de Acción de mejora existente " +
         "</li>"; 
   }
   
   if(contenidoVal.evidenciaNombre == '----'){
      menuOpcion += 
         "<a style='color:red;' class='list-group-item'>" +
            "<i class='fa fa-download'></i> No hay evidencia" +
         "</a>";   
   }else{
      menuOpcion += 
         "<a target='_blank' class='list-group-item' " +
            "href='"+URL+"/auditoria/hallazgo/evidencia?hallazgoId="+contenidoVal.id+"'>" +
            "<i class='fa fa-download'></i> Descargar Evidencia" +
         "</a>";    
   }
   
   if(contenidoVal.accion.gestionAccionMejoraId == null){
      menuOpcion+=""; 
   }else{
      menuOpcion +=
         "<li class='list-group-item' " +
             "onclick='verAccionesMejoraInspeccion("+contenidoIndex+","+contenidoVal.accion.gestionAccionMejoraId+")'>" +
            "<i class='fa fa-pencil' aria-hidden='true'></i> Ver Acciones de solicitud de mejora" +
         "</li>"; 
   }
   
   menuOpcion+="</ul>";
   
   /*var btnEvidencia="<a target='_blank' class='btn btn-success' " +
                       "href='"+URL+"/auditoria/hallazgo/evidencia?hallazgoId="+contenidoVal.id+"'>" +
	               "<i class='fa fa-download'></i>Descargar Evidencia" +
	            "</a>";

   var btnEditar="<button class='btn btn-success' onclick='editarHallazgoInspeccionMovil("+contenidoIndex+")'>" +
	            "<i class='fa fa-pencil' aria-hidden='true'></i>Editar" +
	         "</button>";
   
   var btnEliminar="<button class='btn btn-danger' onclick='eliminarHallazgoInspeccionMovil("+contenidoIndex+")'>" +
	              "<i class='fa fa-times' aria-hidden='true'></i>Eliminar" +
	           "</button>";
	
   var btnAccion="<button class='btn btn-success' onclick='agregarSolicitudAccionMejora("+contenidoIndex+",6)'>" +
	            "<i class='fa fa-file' aria-hidden='true'></i>Crear Solicitud  Acción Mejora" +
	         "</button>";
	
   var btnAsignarAccion="<br><br><button class='btn btn-success' onclick='asignarSolicitudAccionMejora("+contenidoIndex+",6)'>" +
                           "<i class='fa fa-star' aria-hidden='true'></i>Asignar Solicitud Existente" +
                        "</button>";
      */
   contenidoVal.gestionAccionMejoraId = contenidoVal.accion.gestionAccionMejoraId;
	
  /* var btnAccionesAgregar ="<button class='btn btn-success'  onclick='verAccionesMejoraInspeccion("+contenidoIndex+","+contenidoVal.accion.gestionAccionMejoraId+")'>" +
	                      "<i class='fa fa-plus' aria-hidden='true'></i>  Ver acciones de solicitud" +
	                   "</button>";
   */	 
   
   var userAgent = navigator.userAgent || navigator.vendor || window.opera;
   
   if(contenidoVal.accion.resumen == 'Sin Asociar'){
      colorTexto =
         "<strong id='contenidoHallazgoSolicitud"+contenidoIndex+"' style='color:red;margin:0;'>" +
             contenidoVal.accion.resumen + 
         "</strong>";
   }else{
      colorTexto = 
         "<strong id='contenidoHallazgoSolicitud"+contenidoIndex+"' style='color:blue;margin:0;'>" + 
             contenidoVal.accion.resumen +
         "</strong>";
   }
   
   return "<div class='divInformacionCurso' id='hallInsMovil"+contenidoIndex+"'>" +
   
      "<div class='divNombreInformacion' id='infHallInsMovil"+contenidoIndex+"'>"+
        /*  +textoBotonToggleInformacion+ */
   	  (contenidoIndex+1)+". *Hallazgo: <strong style='color:black;'>"+contenidoVal.descripcion+"</strong>" +
           "<br> *Tipo de hallazgo: <strong style='color:black;'>"+contenidoVal.tipoReporte.nombre+"</strong>" +
        // "<br> *Nivel de riesgo: "+contenidoVal.nivel.nombre+
        // "<br> *Factor de seguridad: "+contenidoVal.factor.nombre+
	   "<br> *Causa: <strong style='color:black;'>"+contenidoVal.causa+"</strong>" +
	    (parseInt(getSession("gestopcompanyid")) == 647?"":
	     "<br> *Lugar específico: <strong style='color:black;'>"+contenidoVal.lugar+"</strong>") +
           "<br> *Solicitud Acción: <strong style='color:black;'>"+colorTexto+"</strong>" +
      "</div>" +
      "<div class='divOpcionesGosst'>" +
         "<div class='opcionGosstCss' style='color:black;font-weight:bold;'>"+ 
            "<a class='efectoLink btn-gestion' style='margin-left:0px;' " +
               "onclick='toggleMenuOpcionHallazgoLibre(this,"+contenidoIndex+")'>" +
	       "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
	    "</a>" +
	     menuOpcion +
	 "</div>" +        
      /*   "<div class='opcionGosstCss'>"+
             btnEvidencia+
         "</div>" +
         "<div class='opcionGosstCss'>"+
             btnEditar+
         "</div>" +
         "<div class='opcionGosstCss'>"+
	     btnEliminar+
         "</div>" +
         "<div class='opcionGosstCss'>"+
            btnAccion+" "+btnAsignarAccion+
         "</div>" +
         (contenidoVal.accion.gestionAccionMejoraId == null? "":
            "<div class='opcionGosstCss'>"+
                btnAccionesAgregar+
            "</div>" )+*/
      "</div>" +
      "<div class='divEvalHallazgoInspeccion'>" +
          //obtenerSubFormInspeccion(listItemsEvalInsp,contenidoIndex,"guardarEvaluacionInspeccion()")+
      "</div>" +
      "<div class='divAsignarGestionAccion'>" +
      "</div>" +
   "</div>" ;
   
   var idDivAux= "infHallInsMovil"+indexEval;
   
   var divOriginalAdi = document.getElementById(idDivAux).innerHTML;
   
   var solicitudAsignada = "<strong style='color:blue;margin:0;'>"+ $("#inputNombreGestion").val()+"</strong>";
   
   var cambio = divOriginalAdi.replace("Sin Asociar",solicitudAsignada);
   
   document.getElementById(idDivAux).innerHTML = cambio;
   
}

var lastHeight=0;
var indexEventoOpt;

function toggleMenuOpcionHallazgoLibre(obj,pindex){
	indexEventoOpt=pindex;
	lastHeight=$(obj).offset().top;
	$(obj).parent(".opcionGosstCss").find("ul").toggle();
	$(obj).parent(".opcionGosstCss").siblings().find("ul").hide(); 	
}

function editarHallazgoInspeccionMovil(pindex){
   $(".divInformacionCurso > div").show();  //mostrar el formulario desplegado
    
   evaluacionInspeccionObj = listFullEvaluacionesInspeccion[pindex];
	
   $(".divInformacionCurso").hide();$("#divFormHallazgo").show();
   $("#divFormHallazgo").find(".divNombreInformacion").html(
      "Editar Hallazgo "+evaluacionInspeccionObj.descripcion+textoBotonToggleInformacion);

   $("#inputDescHall").val(evaluacionInspeccionObj.descripcion);
   $("#inputCausaHall").val(evaluacionInspeccionObj.causa);
   $("#inputLugarHall").val(evaluacionInspeccionObj.lugar);
   $("#selAreaHallazgo").val(evaluacionInspeccionObj.area.areaId);
   $("#selNivelHallazgo").val(evaluacionInspeccionObj.nivel.id);	
   $("#selFactorHallazgo").val(evaluacionInspeccionObj.factor.id);
	 
   var seccionesId = evaluacionInspeccionObj.seccionesId.split(",");
	
   listSeccionesInteresadasHallazgo.forEach(function(val){
      val.selected = 0;
			
      seccionesId.forEach(function(val1){
         if(parseInt(val1) == val.id){
	    val.selected = 1;
         }
      });
   });	
		
   crearSelectOneMenuObligMultipleCompleto("slcSeccionesPermitidaHallazgo","",
      listSeccionesInteresadasHallazgo,"id","nombre","#tdhasecc",textAuxMulSelectHallazgo);

   var areasId = evaluacionInspeccionObj.areasId.split(",");
		
   listAreasInteresadasHallazgo.forEach(function(val){
      val.selected = 0;
			
      areasId.forEach(function(val1){
         if(parseInt(val1) == val.areaId){
	    val.selected = 1;
         }
      });
   });	
		
   crearSelectOneMenuObligMultipleCompleto("slcAreasPermitidaHallazgo","",
      listAreasInteresadasHallazgo,"areaId","areaName","#tdhaarea","Áreas interesadas...");
		//
   var options={
      container:"#eviHallazgoMovil" ,
      functionCall:function(){},descargaUrl:"",
      esNuevo:true,idAux:"Hallazgo",
      evidenciaNombre:(evaluacionInspeccionObj.evidenciaNombre == "----"?"":
         evaluacionInspeccionObj.evidenciaNombre)
   };
		
   crearFormEvidenciaCompleta(options);
   
   $(".divEvalHallazgoInspeccion .btn-danger").show();
   
   if(parseInt(getSession("gestopcompanyid")) != 647){
      $(".divEvalHallazgoInspeccion .btn-HallConSolAccMej").hide();
   }
}

function eliminarHallazgoInspeccionMovil(pindex){ 
   mensajeUx="<label>¿Está seguro de eliminar el hallazgo?*" +
      "<br><br>*Se eliminará también la solicitud de acción asociada " +
      "(junto a sus respectivas acciones de mejora).</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarHallLibVisCol");

   $("#btnDevolverValorRespEliminarHallLibVisCol").on("click",function(){
      var dataParam={
	 id: listFullEvaluacionesInspeccion[pindex].id,
	 solicitudAccMejIdAux: listFullEvaluacionesInspeccion[pindex].accion.gestionAccionMejoraId
      };
      
      callAjaxPost(URL+'/auditoria/hallazgo/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx="<label>El hallazgo se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"");
	
               if(actualizarPrincipalActSst == 1){
                  accesoDirectoRealizarInspeccionMovil(auxAuditoria.auditoriaId,auxAuditoria.auditoriaTipo,0);
               }else{
                  realizarInspeccionMovil(idEvento);
               }
               
               break;
	
            default:
               mensajeUx="<label>Error al eliminar el registro.</label>";
               mensajesUx(mensajeUx,2,"");	
         }
      });
   });
}

function crearDivEvaluacionInspeccion(contenidoVal,contenidoIndex){
   var textoIn = "";
   var textoRespuesta = "Sin evaluar",textoPotencial = "",textoAplica = "No Aplica";
   var textComentario = "Comentario: "+contenidoVal.comentario;
   var textAccionMejora = "Solicitud Acción Mejora: "+contenidoVal.nombreAccionMejora;
	
   switch(contenidoVal.respuesta){
      case 1:
         textoRespuesta = iconoGosst.aprobado+" Cumple";
         
         break;

      case 0:
         textoRespuesta = iconoGosst.desaprobado+" No Cumple";
         
         break;
	
      case 0.5:
	 textoRespuesta = iconoGosst.advertir+" Cumple Parcialmente";
	 
	 break;	
   }
	
   if(contenidoVal.bitRiesgo == 1){
      textoPotencial = "(Con riesgo potencial)";
   }
	
   if(contenidoVal.bitAplica == 1){
      textoAplica = "Aplica";
   }else{
      textoRespuesta = "";textComentario = "";textAccionMejora = "";
   }
	
   var sinEvaluar = false;
	
   if(contenidoVal.respuesta == null){
      sinEvaluar = true;
      textoRespuesta = "";textComentario = "";textAccionMejora = "";
   }
	
   var btnEvidencia = 
      "<a target='_blank' class='btn btn-success' href='"+URL+"/auditoria/verificaciones/evidencia?" +
	 "auditoriaId="+auditoriaObjMovil.auditoriaId+"&verificacionId="+contenidoVal.verificacionId+"'>" +
         "<i class='fa fa-download'></i> Descargar Evidencia" +
      "</a>";
	
   var btnAccion = 
      "<button class='btn btn-success' onclick='agregarSolicitudAccionMejora("+contenidoIndex+",2)'>" +
         "<i class='fa fa-file' aria-hidden='true'></i> Crear Solicitud Acción Mejora" +
      "</button>";
	
   var btnAsignarAccion = "<br><br>" +
      "<button class='btn btn-success' onclick='asignarSolicitudAccionMejora("+contenidoIndex+",2)'>" +
         "<i class='fa fa-star' aria-hidden='true'></i> Asignar Solicitud Existente" +
      "</button>";
	
   var btnAccionesAgregar = 
      "<button class='btn btn-success' onclick='verAccionesMejoraInspeccion("+contenidoIndex+"," +
                                                contenidoVal.gestionAccionMejoraId+")'>" +
         "<i class='fa fa-plus' aria-hidden='true'></i> Ver acciones de solicitud" +
      "</button>";
	
   textoIn = 
      "<div class='opcionGosstCss'>" +
         "<button class='btn btn-success' onclick='iniciarEvaluacionInspeccion("+contenidoIndex+")'>" +
	    "<i class='fa fa-pencil' aria-hidden='true'></i> Editar Evaluación" +
	 "</button>" +
	 "<br><br>" +
	 "<button class='btn btn-danger' onclick='cambiarAplicaEmpresaEvaluacionInspeccion("+contenidoIndex+",0)'>" +
	    "<i class='fa fa-times' aria-hidden='true'></i> No Aplica a empresa" +
	 "</button>" +
      "</div>";
	
   textoIn +=  
      "<div class='opcionGosstCss'>" +
         " "+btnEvidencia +
      "</div>" +
      "<div class='opcionGosstCss'>" +
          btnAccion+btnAsignarAccion +
      "</div>";
   
   if(contenidoVal.gestionAccionMejoraId != null){
      textoIn +=  
         "<div class='opcionGosstCss'>" +
	     btnAccionesAgregar +
	 "</div>";
   }
	
   if(contenidoVal.detalleAuditoriaId == null || sinEvaluar){
      textoIn =
	 "<div class='opcionGosstCss'>" +
            "<button class='btn btn-success' onclick='iniciarEvaluacionInspeccion("+contenidoIndex+")'>" +
	       "<i class='fa fa-pencil' aria-hidden='true'></i> Evaluar item" +
	    "</button>" +
	    "<br><br>" +
	    "<button class='btn btn-danger' onclick='cambiarAplicaEmpresaEvaluacionInspeccion("+contenidoIndex+",0)'>" +
	       "<i class='fa fa-times' aria-hidden='true'></i> No Aplica a empresa" +
	    "</button>"+
	 "</div>";
   }
	
   if(contenidoVal.bitAplica == 0){
      textoIn = 
	 "<div class='opcionGosstCss'>" +
	    "<button class='btn btn-success' onclick='cambiarAplicaEmpresaEvaluacionInspeccion("+contenidoIndex+",1)'>" +
	       "<i class='fa fa-check' aria-hidden='true'></i> Aplica a empresa" +
	    "</button>" +
	 "</div>";
   }
	 
   var listItemsEvalInsp=[
      {sugerencia:"",label:"Sí cumple",
       inputForm:"<input onclick='verAcordeRespuesta()' class='form-control' type='radio' " +
	              	"name='rpta"+contenidoVal.verificacionId+"' id='boxRptaSi"+contenidoVal.verificacionId+"' value='1'>",
       divContainer:"divPregSi"}, 
      {sugerencia:"",clase:"inspeccion-campoCumpleParcialmente",label:"Cumple parcialmente",
       inputForm:"<input onclick='verAcordeRespuesta()' class='form-control' type='radio' " +
	              	"name='rpta"+contenidoVal.verificacionId+"' id='boxRptaParc"+contenidoVal.verificacionId+"' value='0.5'>",
       divContainer:"divPregParcial"},
      {sugerencia:"",label:"No cumple",
       inputForm:"<input onclick='verAcordeRespuesta()' class='form-control' type='radio' " +
	                "name='rpta"+contenidoVal.verificacionId+"' id='boxRptaNo"+contenidoVal.verificacionId+"' value='0'>",
       divContainer:"divPregNo"},
      {sugerencia:"",clase:"inspeccion-campoRiesgoPotencial",label:"¿Riesgo Potencial?",
       inputForm:"<input class='form-control' type='checkbox' id='checkPotencial"+contenidoVal.verificacionId+"'>",
       divContainer:"divPregPotecial"},
      {sugerencia:"",clase:"inspeccion-campoInteresadosAreas",label:"Partes Interesadas área",
       inputForm:"",divContainer:"divParteInteresada"+contenidoVal.verificacionId},
      {sugerencia:"",clase:"inspeccion-campoInteresadosEmpresas",label:"Partes Interesadas empresa",
       inputForm:"",divContainer:"divParteInteresadaSeccion"+contenidoVal.verificacionId},
      {sugerencia:"",label:"Comentario",
       inputForm:"<input class='form-control' id='inputComentarioInsp"+contenidoVal.verificacionId+"'>",divContainer:""},
      {sugerencia:"",inputForm:"",label:"Evidencia",
       divContainer:"divEvidenciaEvalIns"+contenidoVal.verificacionId}
   ];
	
   return "<div class='divInformacionCurso' id='pregInsMovil"+contenidoIndex+"'>" +
	     "<div class='divNombrePregunta'>"+textoBotonTogglePregunta +
	      //////
	      //////
	         contenidoVal.tipoVerificacion+"<br>" +
		 (contenidoIndex+1)+". &nbsp;"+contenidoVal.verificacion+"" +
		 "<br>" +
		 "<label class='respuestaPregunta'>" +
		     textoAplica+" / "+textoRespuesta+" "+textoPotencial+" / "+textComentario+" / "+textAccionMejora +
		 "</label>" +
	     "</div>" +
	     "<div class='divOpcionesGosst'>"+
	         textoIn +
             "</div>" +
             "<div class='divEvalPreguntaInspeccion'>" +
	         obtenerSubFormInspeccionNoAplica(listItemsEvalInsp,"guardarEvaluacionInspeccion()","guardarNoAplicaEvaluacion()") +
             "</div>" +
             "<div class='divAsignarGestionAccion'></div>" +
	  "</div>";
}

function iniciarEvaluacionInspeccion(indexPreg){
   evaluacionInspeccionObj = listFullEvaluacionesInspeccion[indexPreg];
   
   lastHeightInspeccion = $("#pregInsMovil"+indexPreg).offset().top;
   $(".divInformacionCurso").hide();
   $("#pregInsMovil"+indexPreg).show();
   $("#pregInsMovil"+indexPreg+" > div").hide();
   $("#pregInsMovil"+indexPreg+" > .divNombrePregunta").show();
   $("#pregInsMovil"+indexPreg+" > .divEvalPreguntaInspeccion").show();
	
   $("#boxRptaSi"+evaluacionInspeccionObj.verificacionId).prop("checked",(evaluacionInspeccionObj.bitSi == 1));
   $("#boxRptaParc"+evaluacionInspeccionObj.verificacionId).prop("checked",(evaluacionInspeccionObj.bitParc == 1));
   $("#boxRptaNo"+evaluacionInspeccionObj.verificacionId).prop("checked",(evaluacionInspeccionObj.bitNo == 1));
   
   $("#checkPotencial"+evaluacionInspeccionObj.verificacionId).prop("checked",(evaluacionInspeccionObj.bitRiesgo == 1));

   $("#inputParteInteresada"+evaluacionInspeccionObj.verificacionId).val(evaluacionInspeccionObj.personaInteresada);
   $("#inputComentarioInsp"+evaluacionInspeccionObj.verificacionId).val(evaluacionInspeccionObj.comentario);
	
   verAcordeRespuesta();
	
   var eviNombre = evaluacionInspeccionObj.evidenciaNombre;
	
   var options={
      container: "#divEvidenciaEvalIns"+evaluacionInspeccionObj.verificacionId,
      functionCall: function(){},
      descargaUrl: "/auditoria/verificaciones/evidencia?auditoriaId="+inspeccionEvento.auditoriaId +
                   "&verificacionId"+evaluacionInspeccionObj.verificacionId,
      esNuevo: true,
      idAux: "EvalInspeccion"+evaluacionInspeccionObj.verificacionId,
      evidenciaNombre: eviNombre
   };
	
   crearFormEvidenciaCompleta(options);
   //
   var areasId = evaluacionInspeccionObj.areasId.split(",");
	
   listAreasInteresadasDetalleAuditoriaMovil.forEach(function(val){
      val.selected = 0;
		
      areasId.forEach(function(val1){
         if(parseInt(val1) == val.areaId){
	    val.selected = 1;
         }
      });
   });	
	
   crearSelectOneMenuObligMultipleCompleto("slcAreaPermitidaDetalleAuditoriaMovil"+evaluacionInspeccionObj.verificacionId,"",
      listAreasInteresadasDetalleAuditoriaMovil,"areaId","areaName","#divParteInteresada"+evaluacionInspeccionObj.verificacionId,
      "Partes interesadas ...");
   //
   var seccionesId = evaluacionInspeccionObj.seccionesId.split(",");
	
   listSeccionesInteresadasDetalleAuditoriaMovil.forEach(function(val){
      val.selected = 0;
		
      seccionesId.forEach(function(val1){
         if(parseInt(val1) == val.id){
	    val.selected = 1;
         }
      });
   });	
	
   crearSelectOneMenuObligMultipleCompleto("slcSeccionPermitidaDetalleAuditoriaMovil"+evaluacionInspeccionObj.verificacionId,"",
      listSeccionesInteresadasDetalleAuditoriaMovil,"id","nombre","#divParteInteresadaSeccion"+evaluacionInspeccionObj.verificacionId,
      "Partes interesadas empresa...");
}

function cambiarAplicaEmpresaEvaluacionInspeccion(indexEvalIns,isAplica){
	evaluacionInspeccionObj=listFullEvaluacionesInspeccion[indexEvalIns];
	var dataParam = {
			verificacionId : evaluacionInspeccionObj.verificacionId,
			bitAplica : isAplica,
			bitRiesgo : evaluacionInspeccionObj.bitRiesgo,
			bitRespuesta : evaluacionInspeccionObj.bitRespuesta,
			
			referenciaLegal :evaluacionInspeccionObj.referenciaLegal,
			comentario : evaluacionInspeccionObj.comentario,
			auditoriaId : auditoriaObjMovil.auditoriaId
		}; 
		callAjaxPost(URL + '/auditoria/verificaciones/respuesta/save', dataParam,
				function(data){
			$(".divListPrincipal > div").hide();
			$("#subRealizarInspecciones").show();
			var dataAux={};
			var listFinal=[];
			listFullEvaluacionesInspeccion.forEach(function(val){
				if(val.verificacionId==evaluacionInspeccionObj.verificacionId){
					var dataParamAux = {
							verificacionId : evaluacionInspeccionObj.verificacionId,
							bitAplica : isAplica,
							bitRiesgo : evaluacionInspeccionObj.bitRiesgo,
							bitRespuesta : evaluacionInspeccionObj.bitRespuesta,
							
							referenciaLegal :evaluacionInspeccionObj.referenciaLegal,
							comentario : evaluacionInspeccionObj.comentario,
							auditoriaId : auditoriaObjMovil.auditoriaId
						}; 
					//val.bitRiesgo=dataParamAux.bitRiesgo;
					//val.respuesta=dataParamAux.bitRespuesta;
					//val.bitRespuesta=dataParamAux.bitRespuesta;
					val.detalleAuditoriaId=dataParamAux.detalleAuditoriaId;
					//val.personaInteresada=dataParamAux.personaInteresada;
					//val.comentario=dataParamAux.comentario;
					val.auditoriaId=dataParamAux.auditoriaId;
					val.detalleAuditoriaId=data.nuevoId;
					val.bitAplica=isAplica;
					
					listFinal.push(val);
				}else{
					listFinal.push(val);
				}
			});
			dataAux.CODE_RESPONSE="05";
			dataAux.list=listFinal;

			dataAux.areas=listAreasInteresadasDetalleAuditoriaMovil;
			dataAux.secciones = listSeccionesInteresadasDetalleAuditoriaMovil;
			dataAux.auditoriaAux=data.auditoriaAux;
			procesarListaInspeccionMovil(dataAux)
			
		});
}

function obtenerSubFormInspeccion(listForm,functionSumit,functionSumitNext,textoGuardar,textoVolverClick){
   var textFormIn = "";

   if(textoGuardar == null){
      textoGuardar = "Guardar y registrar nuevo hallazgo";
   }
	
   if(textoVolverClick == null){
      textoVolverClick = "volverEvaluacionGeneralInspeccion()";
   }
	
   listForm.forEach(function(val,index){
      textFormIn +=
         "<div class='form-group row "+val.clase+"'>" +
	    "<label for='colFormLabel' class='col-sm-4 col-form-label'>"+val.label+"</label>" +
	    "<div class='col-sm-8' style='color:black' id='"+val.divContainer+"'>" +
	         val.inputForm +
	        "<small>"+val.sugerencia+"</small>" +
            "</div>"+
         "</div>";});

   textFormIn += 
      "<div class='form-group row'>" +
         "<div style='border-top: 1px solid #a5aaae;'></div>" +
         "<br>" +
         "<label class='col-sm-4 col-form-label'>" +
	    "<button class='btn btn-danger' type='button' onclick='"+textoVolverClick+"'>" +
	       "<i class='fa fa-backward' aria-hidden='true'></i> Volver" +
	    "</button>"+
	 "</label>"+
	 "<div class='col-sm-8'>" +
	    "<button class='btn btn-success' type='button' onclick='"+functionSumit+"'>" +
	       "<i class='fa fa-pencil-square-o' aria-hidden='true'></i> "+textoGuardar +
	    "</button>" +
	 "</div>"+
	  (valTipoId == 6 && parseInt(getSession("gestopcompanyid")) == 647?"":
           "<label class='col-sm-4 col-form-label'></label>" +
	   "<div class='col-sm-8' style='margin-top:15px'>" +
	      "<button class='btn btn-success btn-HallConSolAccMej' type='button' " +
	              "onclick='guardarHallazgoInspeccionConSolicitudAccion()'>" +
	         "<i class='fa fa-pencil-square-o' aria-hidden='true'></i> Guardar y generar solicitud de accion" +
	      "</button>" +
           "</div>") +
	  (functionSumitNext == null ?"":
    	   "<label class='col-sm-4 col-form-label'></label>"+
	   "<div class='col-sm-8' style='margin-top:15px'>" +
	      "<button class='btn btn-success' type='button' onclick='"+functionSumitNext+"'>" +
	         "<i class='fa fa-pencil-square-o' aria-hidden='true'></i> Guardar y volver a la vista anterior" +
	      "</button>"+
	   "</div>") +
      "</div>";
	
   return "<div class='eventoGeneral'>" +
             "<form class='eventoGeneral'>"+textFormIn+"</form>" +
          "</div>";
}

function obtenerSubFormInspeccionNoAplica(listForm,functionSumit,functionNoAplica){
   var textFormIn = "";
	
   listForm.forEach(function(val,index){
      val.clase = (val.clase != undefined?val.clase:"");
       
      textFormIn +=
         "<div class='form-group row "+val.clase+"'>" +
            "<label for='colFormLabel' class='col-sm-4 col-form-label'>"+val.label+"</label>" +
	    "<div class='col-sm-8' id='"+val.divContainer+"'>" +
	       " "+val.inputForm +
	       "<small>"+val.sugerencia+"</small>" +
            "</div>" +
         "</div>";
   });
	
   textFormIn +=
      "<div class='form-group row'>"+
         "<label class='col-xs-12 col-form-label' style='margin-bottom:20px;'>" +
	    "<button class='btn btn-danger' type='button' onclick='volverEvaluacionGeneralInspeccion()'>" +
	       "<i class='fa fa-backward' aria-hidden='true'></i> Volver" +
	    "</button>" +
	 "</label>" +
	 "<div class='col-xs-4'>" +
	    "<button class='btn btn-warning' type='button' onclick='"+functionNoAplica+"'>" +
	       "<i class='fa fa-pencil-square-o' aria-hidden='true'></i> No aplica" +
	    "</button>"+
	 "</div>"+
	 "<div class='col-xs-8' style='text-align:right;'>" +
	    "<button class='btn btn-success' type='button' onclick='"+functionSumit+"'>" +
	       "<i class='fa fa-pencil-square-o' aria-hidden='true'></i> Guardar" +
	    "</button>" +
	 "</div>" +
      "</div>";
   
   return "<form class='eventoGeneral'>"+textFormIn+"</form>";
}

function volverEvaluacionGeneralInspeccion(isDirecto){
   $(".listaHallazgosLibresGosst").hide();     
	    
   $(".divInformacionCurso").show(); 
   $(".divInformacionCurso > div").hide();
   $(".divInformacionCurso .divNombrePregunta").show();

   $(".divAsignarGestionAccion").html("");
 //$(".divInformacionCurso .divOpcionesGosst").show();
   $(".divInformacionCurso .divNombreInformacion").show();
   $(".divInformacionCurso .divEvalHallazgoInspeccion").show();
   $("#divFormHallazgo .divNombreInformacion").html(
      textoBotonToggleInformacion+" Nuevo Hallazgo");
	    
   evaluacionInspeccionObj = {id:0};
        
   $(".divEvalHallazgoInspeccion .btn-danger").hide();
      
   if(parseInt(getSession("gestopcompanyid")) != 647){
      $(".divEvalHallazgoInspeccion .btn-HallConSolAccMej").show();
   }

 //$(".divInformacionCurso form select")[0].selectedIndex = 0; 
 //$(".divInformacionCurso form select")[1].selectedIndex = 0; 	
 //$(".divInformacionCurso form input").val("");
		
   $(window).scrollTop(lastHeightInspeccion-$("#barraMenu").height()-60);
   lastHeightInspeccion = 0;countMensajeMovil = 0;
      
   if(actualizarPrincipalActSst == 1){
      if(auxAuditoria != null){ 
         accesoDirectoRealizarInspeccionMovil(auxAuditoria.auditoriaId,auxAuditoria.auditoriaTipo,0); 
      }else{
	 accesoDirectoRealizarInspeccionMovil(auditoriaObjMovil.auditoriaId,auditoriaObjMovil.auditoriaTipo,0);  
      }
   }else{
      realizarInspeccionMovil(idEvento);
   }
}

function guardarNoAplicaEvaluacion(){
	var dataParam = {
			verificacionId : evaluacionInspeccionObj.verificacionId,
			bitAplica : 0,
			auditoriaId : auditoriaObjMovil.auditoriaId
		};
	callAjaxPost(URL + '/auditoria/verificaciones/respuesta/save', dataParam,
			function(data){
		$(".divListPrincipal > div").hide();
		$("#subRealizarInspecciones").show();
		var dataAux={};
		var listFinal=[];
		listFullEvaluacionesInspeccion.forEach(function(val){
			if(val.verificacionId==evaluacionInspeccionObj.verificacionId){
				 val.bitAplica=0;
				
				listFinal.push(val);
			}else{
				listFinal.push(val);
			}
		});
		dataAux.CODE_RESPONSE="05";
		dataAux.list=listFinal;
		dataAux.areas=listAreasInteresadasDetalleAuditoriaMovil;
		dataAux.secciones = listSeccionesInteresadasDetalleAuditoriaMovil;
		dataAux.auditoriaAux=data.auditoriaAux;
		var indexUsado=0;
		listFullEvaluacionesInspeccion.forEach(function(val,index){
			if(val.verificacionId==evaluacionInspeccionObj.verificacionId){
				indexUsado=index
			}
		});
		if(indexUsado+1==listFullEvaluacionesInspeccion.length){
			procesarListaInspeccionMovil(dataAux);
			alert("Evaluación completa !")
		}else{
			procesarListaInspeccionMovil(dataAux);
			iniciarEvaluacionInspeccion(indexUsado+1)
		}
	})
}

function guardarEvaluacionInspeccion(){
   var bitRespuesta = parseFloat($("input[name='rpta"+evaluacionInspeccionObj.verificacionId+"']:checked").val());
   var areas = $("#slcAreaPermitidaDetalleAuditoriaMovil"+evaluacionInspeccionObj.verificacionId).val();
	
   var listArea = [];
   if(areas != null){
      areas.forEach(function(val,index){
         listArea.push({areaId:val});
      });	
   }
   
   if(listArea.length == 0){ 
      listArea = null;
   };
   
   var listSecciones = [];
   var secciones = $("#slcSeccionPermitidaDetalleAuditoriaMovil"+evaluacionInspeccionObj.verificacionId).val();
	
   if(secciones != null){
      secciones.forEach(function(val,index){
         listSecciones.push({id:val});
      });
   }
      
   if(listSecciones.length == 0){
      listSecciones = null;
   }
   
   if(bitRespuesta == null){
      alert("Respuesta de evaluación obligatoria");
      return;
   }
	
   var dataParam={
      verificacionId: evaluacionInspeccionObj.verificacionId,
      areasDetalle: listArea,
      secciones: listSecciones,
      bitAplica: 1,
      bitRiesgo: ($("#checkPotencial"+evaluacionInspeccionObj.verificacionId).prop("checked")?1:0),
      bitRespuesta: bitRespuesta,
      detalleAuditoriaId: evaluacionInspeccionObj.detalleAuditoriaId,
      personaInteresada: $("#inputParteInteresada"+evaluacionInspeccionObj.verificacionId).val(),
      comentario: $("#inputComentarioInsp"+evaluacionInspeccionObj.verificacionId).val(),
      auditoriaId: auditoriaObjMovil.auditoriaId,
      tipoPerdida: {id: evaluacionInspeccionObj.tipoPerdida.id}
   };
	
   getLocation(function(){
      dataParam.posicion = {
         x: posicionX,
         y: posicionY,
      };
		
      callAjaxPost(URL+'/auditoria/verificaciones/respuesta/save',dataParam,function(data){
         guardarEvidenciaAuto(data.nuevoId,"fileEviEvalInspeccion"+evaluacionInspeccionObj.verificacionId,
         bitsEvidenciaVerificacion,"/auditoria/verificaciones/evidencia/save",function(){
	    $(".divListPrincipal > div").hide();
	    $("#subRealizarInspecciones").show();
			
	    var dataAux = {};
	    var listFinal = [];
			
	    listFullEvaluacionesInspeccion.forEach(function(val){
	       if(val.verificacionId == evaluacionInspeccionObj.verificacionId){
		  var dataParamAux={
		     verificacionId : evaluacionInspeccionObj.verificacionId,
		     bitAplica : 1,
		     areasDetalle:listArea,
		     secciones: listSecciones,
		     bitRiesgo : ($("#checkPotencial"+evaluacionInspeccionObj.verificacionId).prop("checked")?1:0),
		     bitRespuesta : bitRespuesta,
		     detalleAuditoriaId:evaluacionInspeccionObj.detalleAuditoriaId,
		     personaInteresada :$("#inputParteInteresada"+evaluacionInspeccionObj.verificacionId).val(),
		     comentario :$("#inputComentarioInsp"+evaluacionInspeccionObj.verificacionId).val(),
		     auditoriaId : auditoriaObjMovil.auditoriaId
		  }; 
					
		  val.bitRiesgo = dataParamAux.bitRiesgo;
					
		  val.areasId = "";
		  
		  if(dataParamAux.areasDetalle != null){
		     dataParamAux.areasDetalle.forEach(function(val1){
		        val.areasId+=""+val1.areaId+",";
		     });
		  }
					
		  if(dataParamAux.secciones != null){
		     val.seccionesId = "";
					
		     dataParamAux.secciones.forEach(function(val1){
			val.seccionesId += ""+val1.id+",";
		     });
		  }
					 
		  val.respuesta = dataParamAux.bitRespuesta;
		  val.bitRespuesta = dataParamAux.bitRespuesta;
		  val.detalleAuditoriaId = dataParamAux.detalleAuditoriaId;
		  val.personaInteresada = dataParamAux.personaInteresada;
		  val.comentario = dataParamAux.comentario;
		  val.auditoriaId = dataParamAux.auditoriaId;
		  val.detalleAuditoriaId = data.nuevoId
					
		  listFinal.push(val);
	       }else{
		  listFinal.push(val);
	       }
	    });
			
	    dataAux.CODE_RESPONSE = "05";
	    dataAux.list = listFinal;
	    dataAux.areas = listAreasInteresadasDetalleAuditoriaMovil;
	    dataAux.secciones = listSeccionesInteresadasDetalleAuditoriaMovil;
	    dataAux.auditoriaAux = data.auditoriaAux;
			
	    var indexUsado = 0;
			
	    listFullEvaluacionesInspeccion.forEach(function(val,index){
	       if(val.verificacionId == evaluacionInspeccionObj.verificacionId){
		  indexUsado = index;
	       }
	    });
			
	    var indexSiguiente = 0;
	    var stopContar = false;
			
	    listFullEvaluacionesInspeccion.forEach(function(val,index){
	       if(indexUsado < index && val.bitAplica == 1 && !stopContar){
		  indexSiguiente = index;
		  stopContar = true;
	       }
				
	       if(!stopContar){
		  indexSiguiente++;	
	       }
	    });
			
	    if(indexSiguiente == listFullEvaluacionesInspeccion.length){
	       procesarListaInspeccionMovil(dataAux);
	       //alert("Evaluación completa !");
	       mensajeUx = "<label>Evaluación completada.</label>";
	       mensajesUx(mensajeUx,1,"","EvaluacionCompletadaIns");
					
	       $("#modalMensajeUxEvaluacionCompletadaIns").on("hidden.bs.modal",function(){
		  if(actualizarPrincipalActSst == 1){
		     accesoDirectoRealizarInspeccionMovil(auditoriaObjMovil.auditoriaId,auditoriaObjMovil.auditoriaTipo,0); 
		  }else{
	             verCompletarActividadVistaColaborador(indexProgIns);   
		  }
	       });
	    }else{
	       procesarListaInspeccionMovil(dataAux);
	       iniciarEvaluacionInspeccion(indexSiguiente);
	       alert("Pregunta evaluada, pasando a la siguiente !")
	    }
         },"verificacionId");
      });
   });		
}

function verAcordeRespuesta(){
   var bitRespuesta = parseFloat($("input[name='rpta"+evaluacionInspeccionObj.verificacionId+"']:checked").val());
	
   if(bitRespuesta == 1){
      $("#checkPotencial"+evaluacionInspeccionObj.verificacionId).attr("disabled",false);
   }else{
      $("#checkPotencial"+evaluacionInspeccionObj.verificacionId).prop("checked",false);
      $("#checkPotencial"+evaluacionInspeccionObj.verificacionId).attr("disabled",true);
   }
}

function ocultarCompletarCamposAdiFinInspeccion(){
   $("#modalCompletarCamposAdiFinInspecc").modal("hide");
}

function completarCamposAdicionalesFinalizarInspeccion(accesoGenerar,indexEvento){
   $("#modalCompletarCamposAdiFinInspecc").remove();
   // 0 -> vista principal || 1 -> inspección Trabajador EPP
   if(parseInt(accesoGenerar) == 0){
      inspeccionEvento = listFullEventos[indexEvento];
   } 
   
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
    
   editarDiv.find("#textDescCausaDesfInspeccFinal").val(inspeccionEvento.descripcionCausaDesfavorable);
   editarDiv.find("#textConcluRecomenInspeccFinal").val(inspeccionEvento.conclusionRecomendacion);
   editarDiv.find("#textObservacionesInspeccFinal").val(inspeccionEvento.observacionFinalizacion);
   
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
   
   inspeccionEvento.descripcionCausaDesfavorable = descripcion;
   inspeccionEvento.conclusionRecomendacion = conclusionRecomendacion;
   inspeccionEvento.observacionFinalizacion = observacion;
     
   if(campoVacio){
      var dataParam={
	 auditoriaId: inspeccionEvento.idAux,
	 descripcionCausaDesfavorable: descripcion,
         conclusionRecomendacion: conclusionRecomendacion,
         observacionFinalizacion: observacion
      };
       
      callAjaxPost(URL+"/auditoria/datos_adicionales/save",dataParam,function(data){
         $("#modalCompletarCamposAdiFinInspecc").hide();
 		    
         mensajeUx="<label>Los datos adicionales de la inspección fueron " +
 	    	   "actualizados con éxito.</label>";
 	    
         mensajesUx(mensajeUx,1,"","ActualizarInspeccFinalVistaCol");
 		    
         $("#modalMensajeUxActualizarInspeccFinalVistaCol").on("hidden.bs.modal",function(){
            verCompletarActividadVistaColaborador(indexProgIns);
         });
      });
   }else{
      //EN CASO SEA NECESARIO VALIDAR
   } 
}

function ocultarInspeccionDetalleAdicional(){
   $("#modalEditarAudiInspecc").modal("hide");
}

var auditoriaAuxId;

function editarInspeccionDetalleAdicional(indexEvento){ 
   $("#modalEditarAudiInspecc").remove();
    
   var inspeccionObj = listFullEventos[indexEvento];
   var listAreasTotal = [];
    
   var dataParam = {
      auditoriaId: inspeccionObj.idAux,
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
   
   callAjaxPost(URL+"/auditoria/vista_colaborador/simple",dataParam,function(data){
      var auditoriaAux = data.auditoriaAux;
      listAreasTotal = data.listAreasAux;
      
      var contenido = "";
		
      var listContenido=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nombre",
          inputForm:auditoriaAux.auditoriaNombre},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Área",
          inputForm:"",divContainer:"divAreaInspeccAux"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Detalle del evento",
          inputForm:"<textarea class='form-control' rows='4' id='textInspeccionDetalleAux'></textarea>"},
    	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
    	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
    	  label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
    	   		"onclick='ocultarInspeccionDetalleAdicional()'>" +
    	           "<i class='fa fa-times'></i> Cancelar" +
    	        "</button>",
    	  inputForm:"<button class='btn btn-success' type='button' onclick='guardarInspeccionDetalleAdicional()' " +
    	  		    "style='float:right;font-size:18px;'>" +
    	  	       "<i class='fa fa-floppy-o'></i> Guardar" +
    	  	    "</button>"}
      ];
    	  			
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
    	  				
      var modalOptionsEvaDocPro={
    	 id: "modalEditarAudiInspecc",
    	 nombre: "<i class='fa fa-pencil'></i> Editar auditoria/inspección",
    	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
    	  				
      crearModalPrincipalUsuario(modalOptionsEvaDocPro,function(){},true,true);	
      
      auditoriaAuxId = auditoriaAux.auditoriaId;
      $("#textInspeccionDetalleAux").val(auditoriaAux.observacion); 
      
      var listAreasAd = auditoriaAux.listAreasId.split(",");
	
      listAreasTotal.forEach(function(val){
         val.selected = 0;
	    
         listAreasAd.forEach(function(val1){
            if(parseInt(val1) == val.areaId){
	       val.selected = 1;
            }
         });	
      });
	
      crearSelectOneMenuObligMultipleCompleto("selMulAreasInspecc","",listAreasTotal,
         "areaId","areaNameShort","#divAreaInspeccAux","sin asignar");
   });
}

function guardarInspeccionDetalleAdicional(){
   var campoVacio = true; 
   
   var detalle = $("#textInspeccionDetalleAux").val();
    
   var listAreasAux = $("#selMulAreasInspecc").val();
   var listAreasAd = [];

   if(listAreasAux != null){
      listAreasAux.forEach(function(val,index){
         listAreasAd.push({areaId: parseInt(val)})
      });
   }
    
   if(campoVacio){
      var dataParam={
	 auditoriaId: auditoriaAuxId,
	 observacion: detalle,
   	 listAreas: listAreasAd
      }; 
          
      callAjaxPost(URL+'/auditoria/vista_colaborador/simple/save',dataParam,function(data){
 	 $("#modalEditarAudiInspecc").modal("hide");
  	 
  	 mensajeUx="<label>El registro de auditoria/inspección se actualizó correctamente.</label>"; 
  	 mensajesUx(mensajeUx,1,"","ActEventoVistaCol");
  	       
  	 $("#modalMensajeUxActEventoVistaCol").on("hidden.bs.modal",function(){ 
	    traerEventosTrabajador();
  	 });
      });
   }else{
      $("#modalEditarAudiInspecc").modal("hide");
         
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposInspeccAux");

      $("#modalMensajeUxAvisoCompletarCamposInspeccAux").on("hidden.bs.modal",function(){
 	 $("#modalEditarAudiInspecc").modal("show");
      });
   }      
}

function guardarHallazgoInspeccionConSolicitudAccion(){
   var inputDesc = $("#inputDescHall").val();
   var inputCausa = $("#inputCausaHall").val();
   var inputLugar = $("#inputLugarHall").val();
   var area = $("#selAreaHallazgo").val();
   var nivel = $("#selNivelHallazgo").val(); 
   var tipoReporte = $("#selTipoReporteHallazgo").val();	
   var factor = $("#selFactorHallazgo").val();
    
   var listSecciones = [];
   var secciones = $("#slcSeccionesPermitidaHallazgo").val();
        
   if(secciones != null){
      if($("#slcSeccionesPermitidaHallazgo").length > 0){
     	 secciones.forEach(function(val,index){
     	    listSecciones.push({id: val});
     	 });
      }
   }
 	
   var listAreas = [];
   var areas = $("#slcAreasPermitidaHallazgo").val();
 	
   if(areas != null){
      if($("#slcAreasPermitidaHallazgo").length > 0){
         areas.forEach(function(val,index){
            listAreas.push({areaId:val});
 	 });
      }
   }
 	
   if(inputDesc.length == 0){
      alert("Descripción es obligatorio");return;
   }
 		
   var dataParam={
      id: evaluacionInspeccionObj.id,factor: {id: factor},secciones: listSecciones,
      areas: listAreas,descripcion: inputDesc,tipoReporte: {id: tipoReporte},
      area: {areaId: area},nivel: {id: nivel},causa: inputCausa,lugar: inputLugar,
      auditoriaId: auxAuditoria.auditoriaId,empresaId: getSession("gestopcompanyid"),
      trabajadorIdAux: parseInt(getSession("trabajadorGosstId"))
   };
 		
   getLocation(function(){
      dataParam.posicion={
         x: posicionX,y: posicionY,
      }
 			
      callAjaxPost(URL+'/auditoria/hallazgo/con_solicitud_accion/save',dataParam,
         procesarResultadoGuardarHallazgoConGestionAccMejVistaColaborador);
   });
}

function procesarResultadoGuardarHallazgoConGestionAccMejVistaColaborador(data){
   switch(data.CODE_RESPONSE){
      case "05":
	 guardarEvidenciaAuto(data.nuevoId,"fileEviHallazgo",bitsEvidenciaHallazgo,
	 "/auditoria/hallazgo/evidencia/save",function(){
//	    $.unblockUI();
	    mensajeUx = (evaluacionInspeccionObj.id > 0?
	       "<label>El hallazgo ha sido actualizado con éxito.</label>":
	       "<label>El hallazgo ha sido registrado con éxito. " +
	       "Ahora registre la acción de mejora asociada.</label>");
	    mensajesUx(mensajeUx,1,"","ActualizarHallazgoVistaCol");
	 					
	    $("#modalMensajeUxActualizarHallazgoVistaCol").on("hidden.bs.modal",function(){
	       if(evaluacionInspeccionObj.id == 0){
	          hallLibIdAux = data.nuevoId;accMejAutoHallLib = 1;
	       }
	       
	       if(actualizarPrincipalActSst == 1){
	          accesoDirectoRealizarInspeccionMovil(auxAuditoria.auditoriaId,auxAuditoria.auditoriaTipo,0);
	       }else{
	          realizarInspeccionMovil(idEvento);
	       }
	    });
	 },"hallazgoId");
	   
         break;
       
      default:
 	 mensajeUx = "<label>Ocurrió un error al guardar el registro del nuevo " +
 	 	     "hallazgo libre.</label>";  
         mensajesUx(mensajeUx,2,"");
   }
}
