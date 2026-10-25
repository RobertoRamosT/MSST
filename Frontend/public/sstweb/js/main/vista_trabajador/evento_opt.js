var listEvaluacionEventoOpt=[];
var eventoOpt;
var preguntaEvalOptObj={id:0};
var preguntaEvalOptId;
var indexEventoAux;
var indexPregAux;
var eventoObjById;
var listRazonesObs=[];
var listCondicional=[
	{id:1,nombre:"Si"},
	{id:0,nombre:"No"}
	]
function realizarPreguntasAperturaOptMovil(indexEvento)
{
	indexEventoAux=indexEvento;
	if(indexEvento!=null)
	{
		eventoOpt=listFullEventos[indexEvento];
	}
	$(".divListPrincipal > div").hide();
	$("#subRealizarInspecciones").show();
	var listaId=(eventoOpt.linkAuxiliarId1).substr(9);
	var objEventoOpt=
	{
			id:eventoOpt.idAux
	}
	callAjaxPostNoUnlock(URL + '/opt/eventos/id', objEventoOpt, 
		function(data) {
			if(data.CODE_RESPONSE=="05"){
				$.unblockUI()
				$("#subRealizarInspecciones").find(".contenidoSubList").html("");
				eventoObjById=data.evento;
				listRazonesObs=data.razon;
				$("#subRealizarInspecciones").find(".tituloSubList").html(
						"<div class='row'>" +
							"<section class='col col-xs-8'>" +
								"Lista Opt: "+eventoObjById.lista.nombre+"-- Trabajador:"+eventoObjById.trabajador.nombre+
							"</section>"+
						"</div>");
				var colorEntrenado="#78D689",colorInformado="#78D689";
				var sugEntrenado="",sugInformado="";
				if(eventoObjById.entrenado==null)
				{
					eventoObjById.entrenado=0;
					colorEntrenado="#FCB4B4";
					sugEntrenado="Sin Contestar";
				}
				if(eventoObjById.informado==null)
				{
					eventoObjById.informado=0;
					colorInformado="#FCB4B4";
					sugInformado="Sin Contestar";
				}
				var selEntrenado = crearSelectOneMenuOblig("selEntrenado","",listCondicional ,eventoObjById.entrenado, "id","nombre");
				var selInformado = crearSelectOneMenuOblig("selInformado","",listCondicional ,eventoObjById.informado, "id","nombre");
				var selRazonObs = crearSelectOneMenuOblig("selRazonObs","",listRazonesObs ,"", "id","nombre");
				var listItemsApertura=[
				    {sugerencia:sugEntrenado,label:"¿El trabajador ha sido entrenado en seguridad?", 	inputForm:selEntrenado,divContainer:"divEntren",color:colorEntrenado}, 
				    {sugerencia:sugInformado,label:"¿Se le ha notificado que será informado?",inputForm:selInformado,divContainer:"divInform",color:colorInformado}, 
				    {sugerencia:"",label:"Razon de la Observacion:",inputForm:selRazonObs,divContainer:"divRazonObs"},
				    {sugerencia:"",
				    	label:"<label class='col-xs-12 col-form-label' style='margin-bottom: 20px;'>" +
						   "<button class='btn btn-danger' type='button'  onclick='regresarListaActi()'>Regresar</button>"
				    	,inputForm:"<button type='button' class='btn btn-success' onclick='guardarEventoApert()'><i class='fa fa-save'></i> Guardar</button>",divContainer:"divRazonObs"}
				];
				$("#subRealizarInspecciones").find(".contenidoSubList")
				.append("<div class='divInformacionCurso' style='padding: 20px;'>" +
							"<h4 style='padding-bottom: 20px;'><strong>Preguntas de Apertura :</strong></h4> " +
							"<div id='divEventOptMovil' >"+
							obtenerSubFormEventoApertura(listItemsApertura)+
							"</div><br>"+
						"</div>");
				
				
			}
		});
}
function realizarEvaluacionOptMovil(indexEvento)
{
	indexEventoAux=indexEvento;
	if(indexEvento!=null)
	{
		eventoOpt=listFullEventos[indexEvento];
	}
	$(".divListPrincipal > div").hide();
	$("#subRealizarInspecciones").show();
	var listaId=(eventoOpt.linkAuxiliarId1).substr(9);
	var objEventoOpt=
	{
			id:eventoOpt.idAux,
			lista:{id:listaId},
			vistaTrabajador:1
	}
	callAjaxPostNoUnlock(URL + '/opt/eventos/evaluacion', objEventoOpt, 
		function(data) {
			if(data.CODE_RESPONSE=="05"){
				$.unblockUI()
				$("#subRealizarInspecciones").find(".contenidoSubList").html("");
				listEvaluacionEventoOpt=data.evaluaciones;
				var avanceAux=listEvaluacionEventoOpt[0].evento.lista.numPreguntasEval;
				var totalAux=listEvaluacionEventoOpt[0].evento.lista.numPreguntas;
				$("#subRealizarInspecciones").find(".tituloSubList").html(
						"<div class='row'>" +
							"<section class='col col-xs-1'>" +
								textoBotonVolverContenidoColaborador+
							"</section>"+
							"<section class='col col-xs-11'>" +
								"Observación Planeada de Trabajo"+"<br> Avance: "+
								avanceAux+" / "+totalAux+
							"</section>"+
						"</div>");
				var textContenido=(eventoOpt.text).split("<br>");
				var textCont="";
				textContenido.forEach(function(val,index)
				{
					if(index!=0)
					{
						textCont+=val+"<br>";
					}
				});
				$("#subRealizarInspecciones").find(".contenidoSubList")
				.append("<div class='divInformacionCurso' style='    padding: 20px;'>" +
							"<strong>Detalle del Evento:</strong> " +
							"<div id='divEventOptMovil' style='white-space: pre'>"+
								textCont+
							"</div><br>"+
						"</div>");
				listEvaluacionEventoOpt.forEach(function(val,index){ 
					$("#subRealizarInspecciones").find(".contenidoSubList")
					.append(crearDivEvaluacionEventoOpt(val,index));
					
					
					$("#pregOptMovil"+index+">div").hide();
					$("#pregOptMovil"+index+" .divNombrePregunta").show();
					var mostrarOpciones=true;
					
					if(val.aplica==0){
						mostrarOpciones=false;
					}
					mostrarOpciones=false;
					if(mostrarOpciones){
						$("#pregOptMovil"+index+" .divOpcionesGosst").show();
					}else{
						$("#pregOptMovil"+index+" .divOpcionesGosst").hide();
					}
					
					});
				
			}
		});
}

function crearDivEvaluacionEventoOpt(contenidoVal,contenidoIndex){
	var textoIn="";
	   
	var textoRespuesta="Sin evaluar",textoPotencial="",textoAplica="No Aplica";
	var textComentario="Observaciones: "+contenidoVal.observaciones;
	var textAccionMejora="Solicitud Acción Mejora: ";//+contenidoVal.nombreAccionMejora;
	switch(contenidoVal.puntaje.id){
	case 1:
		textoRespuesta=iconoGosst.aprobado+" Cumple"
		break;
	case 2:
		textoRespuesta=iconoGosst.advertir+"Cumple Parcialmente"
		break;
	case 3:
		textoRespuesta=iconoGosst.desaprobado+" No Cumple"
		break;
	}
	if(contenidoVal.riesgo==1){
		textoPotencial="(Con riesgo potencial)"
	}
	if(contenidoVal.aplica==1){
		textoAplica="Aplica"
	}else{
		textoRespuesta="";
		textComentario="";textAccionMejora="";
	}
	var sinEvaluar=false;
	if(contenidoVal.puntaje.id==0){
		sinEvaluar=true;
		textoRespuesta="";
		textComentario="";textAccionMejora="";
	}
	var btnEvidencia="<a target='_blank' class='btn btn-success' " +
			"href='"+URL+"/opt/eventos/evaluacion/evidencia?id="+contenidoVal.id+"'>" +
			"<i class='fa fa-download'></i>Descargar Evidencia</a>";
	//var btnAccion="<button class='btn btn-success'  onclick='agregarSolicitudAccionMejora("+contenidoIndex+",2)'>" +
	//"<i class='fa fa-file' aria-hidden='true'></i>Crear Solicitud  Acción Mejora</button>";
	//var btnAsignarAccion="<br><br><button class='btn btn-success'  onclick='asignarSolicitudAccionMejora("+contenidoIndex+",2)'>" +
	//"<i class='fa fa-star' aria-hidden='true'></i>  Asignar Solicitud Existente</button>";
	textoIn="<div class='opcionGosstCss'  >"+
	"<button class='btn btn-success'  onclick='iniciarEvaluacionEventoOpt("+contenidoIndex+")'>" +
	"<i class='fa fa-pencil' aria-hidden='true'></i>Editar Evaluación</button>"+
	"<br>"+"<br>" +
	"<button class='btn btn-danger'  onclick='guardarRptaEvalEvent("+contenidoIndex+",2,0)'>" +
	"<i class='fa fa-times' aria-hidden='true'></i>No Aplica a empresa</button>"+
	"</div>";
	textoIn+=  
			"<div class='opcionGosstCss'  >"+
			" "+btnEvidencia+
			//"</div>"+
			//"<div class='opcionGosstCss'  >"+
			//btnAccion+btnAsignarAccion+
			"</div>";
	
	if(contenidoVal.id==null || sinEvaluar){
		textoIn=
			"<div class='opcionGosstCss'  >"+
				"<button class='btn btn-success'  onclick='iniciarEvaluacionEventoOpt("+contenidoIndex+")'>" +
				"<i class='fa fa-pencil' aria-hidden='true'></i>Evaluar item</button>"+
				"<br>"+"<br>" +
				"<button class='btn btn-danger'  onclick='guardarRptaEvalEvent("+contenidoIndex+",2,0)'>" +
				"<i class='fa fa-times' aria-hidden='true'></i>No Aplica a empresa</button>"+
			"</div>";
		 
	}
	if(contenidoVal.aplica==0){
		textoIn= "<div class='opcionGosstCss'  >"+
		"<button class='btn btn-success'   onclick='guardarRptaEvalEvent("+contenidoIndex+",2,1)'>" +
		"<i class='fa fa-check' aria-hidden='true'></i> Aplica a empresa</button>"+
		"</div>";
	}
	var listItemsEvalOpt=[
	    {sugerencia:"",label:"Si",
	    	inputForm:"<input onclick='verAcordeRespuestaEvalOpt()' class='form-control' type='radio'" +"name='rpta"+contenidoVal.pregunta.id+"' " +
	                   "id='boxRptaSi"+contenidoVal.pregunta.id+"' value='1'> ",divContainer:"divPregSi"}, 
	    {sugerencia:"",inputForm:"<input onclick='verAcordeRespuestaEvalOpt()' class='form-control' type='radio' " +"name='rpta"+contenidoVal.pregunta.id+"' " +
	                   "id='boxRptaParc"+contenidoVal.pregunta.id+"' value='2'> ",label:"Parcial" ,divContainer:"divPregParcial"},
	    {sugerencia:"",inputForm:"<input onclick='verAcordeRespuestaEvalOpt()' class='form-control' " +"type='radio' name='rpta"+contenidoVal.pregunta.id+"' " +
	                   "id='boxRptaNo"+contenidoVal.pregunta.id+"' value='3'> ",label:"No",divContainer:"divPregNo"},
	    {sugerencia:"",inputForm:"<input class='form-control' type='checkbox' id='checkPotencial"+contenidoVal.pregunta.id+"'  > ",label:"¿Riesgo Potencial?",divContainer:"divPregPotecial"},
	    {sugerencia:"",label:"Observaciones",inputForm:"<input class='form-control' id='inputObsEvalOpt"+contenidoVal.pregunta.id+"'> ",divContainer:""},
	    {sugerencia:"",inputForm:" ",label:"Evidencia" ,divContainer:"divEvidenciaEvalOpt"+contenidoVal.pregunta.id},
	];
	
	return 		"<div class='divInformacionCurso' id='pregOptMovil"+contenidoIndex+"' >" +
					"<div class='divNombrePregunta'>"+textoBotonTogglePregunta+
					(contenidoIndex+1)+".&nbsp;"+contenidoVal.pregunta.nombre+"" +
						"<br><label class='respuestaPregunta'>"+textoAplica+" / "+textoRespuesta+" "+textoPotencial+" / " +
								textComentario+" / "+textAccionMejora+"</label>" +
					"</div>" +
				    "<div class='divOpcionesGosst'  >"+
				   		textoIn+
				    "</div>" +
					"<div class='divEvalPreguntaEvalOpt'>" +
					obtenerSubFormInspeccionNoAplica(listItemsEvalOpt,"guardarRptaEvalEvent("+contenidoIndex+",1,1)","guardarRptaEvalEvent("+contenidoIndex+",1,0)")+
					"</div>" +
					"<div class='divAsignarGestionAccion'>" +
					"</div>" +
				"</div>" ;
}
function iniciarEvaluacionEventoOpt(indexPreg){
	preguntaEvalOptObj=listEvaluacionEventoOpt[indexPreg];
	indexPregAux=indexPreg;
	lastHeightInspeccion=$("#pregOptMovil"+indexPreg).offset().top;
	$(".divInformacionCurso").hide();
	$("#pregOptMovil"+indexPreg ).show();
	$("#pregOptMovil"+indexPreg+" > div").hide();
	$("#pregOptMovil"+indexPreg+" > .divNombrePregunta").show();
	$("#pregOptMovil"+indexPreg+" > .divEvalPreguntaEvalOpt").show();
	
	$("#boxRptaSi"+preguntaEvalOptObj.pregunta.id).prop("checked",(preguntaEvalOptObj.puntaje.id==1))
	$("#boxRptaParc"+preguntaEvalOptObj.pregunta.id).prop("checked",(preguntaEvalOptObj.puntaje.id==2))
	$("#boxRptaNo"+preguntaEvalOptObj.pregunta.id).prop("checked",(preguntaEvalOptObj.puntaje.id==3))
	$("#checkPotencial"+preguntaEvalOptObj.pregunta.id).prop("checked",(preguntaEvalOptObj.riesgo==1))
	$("#inputObsEvalOpt"+preguntaEvalOptObj.pregunta.id).val(preguntaEvalOptObj.observaciones);
	verAcordeRespuestaEvalOpt();
	var eviNombre=preguntaEvalOptObj.evidenciaNombre;
	var options=
	{container:"#divEvidenciaEvalOpt"+preguntaEvalOptObj.pregunta.id,
			functionCall:function(){ },
			descargaUrl: "/opt/eventos/evaluacion/evidencia?id="+preguntaEvalOptObj.pregunta.id,
			esNuevo:true,
			idAux:"EvalOpt"+preguntaEvalOptObj.pregunta.id,
			evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options);	
}
function verAcordeRespuestaEvalOpt(){
	var bitRespuesta= parseFloat($("input[name='rpta"+preguntaEvalOptObj.pregunta.id+"']:checked").val());
	if(bitRespuesta==1){
		$("#checkPotencial"+preguntaEvalOptObj.pregunta.id).attr("disabled",false);
	}else{
		$("#checkPotencial"+preguntaEvalOptObj.pregunta.id).prop("checked",false);
		$("#checkPotencial"+preguntaEvalOptObj.pregunta.id).attr("disabled",true);
	}
}
function guardarRptaEvalEvent(evalIndex,opcFrom,valorAplic)//si opcFrom =1 viene de los botones de a eval de cada preg, si opcFrom=2 viene de la lista de evento
{
	var evalObj=listEvaluacionEventoOpt[evalIndex];
	var evento=evalObj.evento.id;
	var pregunta=evalObj.pregunta.id;
	preguntaEvalOptId=pregunta;
	var id=evalObj.id;
	var aplica;
	var vistaAux;
	if(opcFrom==1)
	{
		aplica=valorAplic;
		vistaAux=null;
	}
	if(opcFrom==2)
	{
		aplica=valorAplic;
		vistaAux=1;
	}
	var riesgo =$("#checkPotencial" + pregunta).is(':checked');
	var puntaje=$("input[name='rpta" + pregunta + "']:checked").val(); 
	var obs=$("#inputObsEvalOpt"+pregunta).val();
	if(id==null)
	{
		id=0;
	}
	if(riesgo==true)
	{
		riesgo=1;
	}
	else if(riesgo==false)
	{
		riesgo=0;
	}
	if(puntaje==undefined)
	{
		puntaje=null;
	}
	
	var dataParam=
	{
			id:id,
			aplica:aplica,
			puntaje:{id:puntaje},
			riesgo:riesgo,
			observaciones:obs,
			evento:
			{
				id:evento,
				vistaTrabajador:vistaAux
			},
			pregunta:{id:pregunta}
	};
	//alert ("id:"+id+"\npregunta: "+pregunta+"\nevento:"+evento+"\naplica: "+aplica+"\nriesgo: "+riesgo+"\npuntaje:"+puntaje+"\nobservacion:"+obs);
	if(opcFrom==1)
	{
		callAjaxPost(URL+'/opt/eventos/evaluacion/save',dataParam,
				procesarResultadoGuardarEvalEvi);
	}
	else if(opcFrom==2)
	{
		callAjaxPost(URL+'/opt/eventos/evaluacion/save',dataParam,
				function(data){
			realizarEvaluacionOptMovil(indexEventoAux);});
	}
}
function procesarResultadoGuardarEvalEvi(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviEvalOpt"+preguntaEvalOptId,
				bitsEvidenciaEvalEvento,"/opt/eventos/evaluacion/evidencia/save",
				function(data){
					realizarEvaluacionOptMovil(indexEventoAux);
					/*if((indexPregAux+1)<listEvaluacionEventoOpt.length)
					{
						var estadoNoAplica=true;
						while(estadoNoAplica==true && (indexPregAux+1)<listEvaluacionEventoOpt.length) 
						{
							if(listEvaluacionEventoOpt[indexPregAux+1].aplica==1)
							{
								alert("La información a sido registrada!, se pasara a la siguiente pregunta");
								iniciarEvaluacionEventoOpt(indexPregAux+1);
								estadoNoAplica=false;
							}
							else 
							{
								indexPregAux++;
								estadoNoAplica=true;
								if((indexPregAux+1)==listEvaluacionEventoOpt.length)
								{
									realizarEvaluacionOptMovil(indexEventoAux);
									estadoNoAplica=false;
								}
							}
						}
					}
					else 
					{
						realizarEvaluacionOptMovil(indexEventoAux);
					}*/
				},"id"); 
		break; 
	default:
		alert("Ocurrio un error al guardar el archivo!");
	}
}
function guardarEventoApert()
{
	var inform=$("#selInformado").val();
	var entren=$("#selEntrenado").val();
	var raz=$("#selRazonObs").val();
	var dataParam=
	{
		id:eventoObjById.id,
		fechaPlanificada:eventoObjById.fechaPlanificada,
		horaPlanificada: eventoObjById.horaPlanificada,
		responsable:{trabajadorId:eventoObjById.responsable.trabajadorId},
		trabajador:{trabajadorId:eventoObjById.trabajador.trabajadorId},
		fechaReal:eventoObjById.fechaReal,
		empresa:{empresaId:eventoObjById.empresa.empresaId},
		lista:{id:eventoObjById.lista.id},
		informado:inform,
		entrenado:entren,
		razon:{id:raz},
		observacion:eventoObjById.observacion,
		felicitacion:eventoObjById.felicitacion,
		vigenciaOpt:eventoObjById.vigenciaOpt
	};
	callAjaxPost(URL+'/opt/eventos/save',dataParam,
			function(data)
			{
				alert("Pregunta de Apertura registrada, se pasara a la evaluación");
				realizarEvaluacionOptMovil(indexEventoAux);
			});
}
function obtenerSubFormEventoApertura(listForm){
	var textFormIn=""
	listForm.forEach(function(val,index){
		textFormIn+=
			"<div class='row' style='padding-top: 20px;padding-bottom: 20px;background-color:"+val.color+";'>"+
				"<section class='col col-xs-8'>"+
					"<label>"+val.label+"</label>"+
				"</section>"+
			    "<section class='col col-xs-4' id='"+val.divContainer+"'>"+
			     " "+val.inputForm+
			     "<small>"+val.sugerencia+" </small>"+
			    "</section>"+
			 "</div>";
	});
	return "<form id='form' class='eventoGeneral'>"
			+textFormIn
			+"</form>"
}
function regresarListaActi()
{
	$("#subRealizarInspecciones").hide()
	volverMenuActividadesSST();
}




