var listFullEventosOpt,listFullTrab,listFullRazonObs,listFullTrabajadoresByArea;
var eventsOptObj,eventsOptId;
var banderaEdicionEvents;
var estadoApertura=false;
var estadoCierre=false;
function verEventosOpt(){ 
	$("#btnNuevoEventos").attr("onclick", "javascript: nuevoEventosOpt();");
	$("#btnCancelarEventos").attr("onclick", "javascript: cancelarEventosOpt();");
	$("#btnGuardarEventos").attr("onclick", "javascript: guardarEventosOpt();");
	$("#btnEliminarEventos").attr("onclick", "javascript: eliminarEventosOpt();");
	$("#btnEvaluacion").attr("onclick", "javascript: verEvaluacionEventosOpt();");
	
	$("#tabObservaciones .container-fluid").hide();
	$("#tabObservaciones #divContainObservaciones").hide(); 
	$("#tabObservaciones #divContainEventos").show();
	$("#tabObservaciones").find("h2")
	.html("<a onclick=' volverObsOpt()'>Observaciones OPT - Lista: "+obsOptObj.nombre+" </a>"
			+"> Registrar Eventos de OPT");
	cargarEventosOpt();
}
function volverEventosOpt()
{
	$("#tabObservaciones .container-fluid").hide();
	$("#divContainEventos").show();
	$("#divContainEvaluarEventos").hide();
	$("#divContainPlanTrabajoEventos").hide();
	$("#tabObservaciones").find("h2")
	.html("<a onclick=' volverObsOpt()'>Observaciones OPT - Lista: "+obsOptObj.nombre+" </a>"
			+"> Registrar Eventos de OPT");
}
function cargarEventosOpt()
{
	$("#btnCancelarEventos").hide();
	$("#btnNuevoEventos").show();
	$("#btnGuardarEventos").hide();
	$("#btnEliminarEventos").hide();
	$("#btnEvaluacion").hide();
	$("#mdPreguntaApertOpt").modal("hide");
	$("#mdPreguntaCierreOpt").modal("hide");
	$("#mdEnviarInformeOpt").modal("hide");
	$("#btnDescargarInforme").hide();
	estadoApertura=false;
	estadoCierre=false;
	var empresa=getSession("gestopcompanyid");
	callAjaxPost(URL + '/opt/eventos', 
			{
				id:obsOptObj.id,
				empresa:{empresaId:empresa},
				area:
				{
					areaId:obsOptObj.area.areaId
				}
			},
		function(data) {
			if (data.CODE_RESPONSE = "05") 
			{
				banderaEdicionEvents = false;
				listFullEventosOpt=data.eventos;
				listFullTrab=data.trabajadores;
				listFullRazonObs=data.razones;
				listFullTrabajadoresByArea=data.trabArea;
				$("#tblEventos tbody tr").remove(); 
				listFullEventosOpt.forEach(function(val, index) {
					var contadorApert=0,contadorCierre=0;
					if(val.entrenado!=null)
					{
						contadorApert++;
					}
					if(val.informado!=null)
					{
						contadorApert++;
					}
					if(val.razon.id!=null)
					{
						contadorApert++;
					}
					if(val.observacion!=null)
					{
						contadorCierre++;
					}
					if(val.felicitacion!=null)
					{
						contadorCierre++;
					}
					if(val.vigenciaOpt!=null)
					{
						contadorCierre++;
					}
					if(val.seguimientoOpt!=null)
					{
						contadorCierre++;
					}
					$("#tblEventos tbody").append(
							"<tr id='trevent"+val.id+"' onclick='editarEventosOpt("+index+")'>" +
							"<td id='eventfechaplan"+val.id+"'>"+val.fechaPlanificadaTexto+"</td>"+
							"<td id='eventhoraplan"+val.id+"'>"+val.horaPlanificadaTexto+"</td>"+
							"<td id='eventrespon"+val.id+"'>"+val.responsable.nombre+"</td>"+
							"<td id='eventtrab"+val.id+"'>"+val.trabajador.nombre+"</td>"+
							"<td id='eventfechareal"+val.id+"'>"+val.fechaRealTexto+"</td>"+
							"<td id='eventapert"+val.id+"'>"+contadorApert+" / 3</td>"+
							"<td id='eventresult"+val.id+"'>"+val.lista.numPreguntasEval+" / "+val.lista.numPreguntas+"</td>"+
							"<td id='eventcierre"+val.id+"'>"+contadorCierre+" / 4</td>"+
							"<td id='eventevi"+val.id+"' style='word-break: break-all;'>"+val.evidenciaNombre+"</td>"+
							"<td id='eventplan"+val.id+"'>"+0+"</td>"+
							"<td id='eventest"+val.id+"'>"+val.estado.nombre+"</td>"+
							+"</tr>");
				});
				completarBarraCarga();
				formatoCeldaSombreableTabla(true, "tblEventos");
			}
		});
}
function nuevoEventosOpt()
{
	if(!banderaEdicionEvents){
		eventsOptId=0;
		eventsOptObj ={id : 0};
		var selResponsable=crearSelectOneMenuOblig("inputResponsable","",listFullTrab,"","trabajadorId","nombre");
		var selTrabajador=crearSelectOneMenuOblig("inputTrabajador","",listFullTrabajadoresByArea,"","trabajadorId","nombre");
		$("#tblEventos tbody").prepend(
			"<tr>" 
				+"<td><input type='date' onchange='cambiarAcuerdoFechaEventoOpt()' id='inputFechaPlanificada' class='form-control'></td>"
				+"<td><input type='time' id='inputHoraPlanificada' class='form-control'></td>"
				+"<td>"+selResponsable+"</td>"
				+"<td>"+selTrabajador+"</td>"
				+"<td><input type='date' onchange='cambiarAcuerdoFechaEventoOpt()' id='inputFechaReal' class='form-control'></td>"
				+"<td>...</td>"
				+"<td>...</td>"
				+"<td>...</td>"
				+"<td id='eventevi0'>...</td>"
				+"<td>...</td>" 
				+"<td id='eventest0'>"+""+"</td>"
			+"</tr>");
		var options={
				container:"#eventevi"+eventsOptId,
				functionCall: function(){},
				descargaUrl:"",
				esNuevo:true,
				idAux:"Evento",
				evidenciaNombre:""
		};
		crearFormEvidenciaCompleta(options); 
		
		banderaEdicionEvents=true;
		$("#btnCancelarEventos").show();
		$("#btnNuevoEventos").hide();
		$("#btnGuardarEventos").show();
		$("#btnEliminarEventos").show();
		$("#btnEvaluacion").hide();
		$("#btnDescargarInforme").hide();
		formatoCeldaSombreableTabla(false,"tblEventos");
	}
	else{
		alert("Guarde Primero.");
	}

}
function editarEventosOpt(pindex)
{
	if(!banderaEdicionEvents)
	{
		formatoCeldaSombreableTabla(false,"tblEventos");
		eventsOptId=listFullEventosOpt[pindex].id;
		eventsOptObj=listFullEventosOpt[pindex];
		
		var fechaplan=eventsOptObj.fechaPlanificada;
		$("#eventfechaplan"+eventsOptId).html("<input onchange='cambiarAcuerdoFechaEventoOpt()' type='date' id='inputFechaPlanificada' class='form-control'>");
		$("#inputFechaPlanificada").val(convertirFechaInput(fechaplan));
		
		var horaplan=eventsOptObj.horaPlanificada;
		$("#eventhoraplan"+eventsOptId).html("<input type='time' id='inputHoraPlanificada' class='form-control'>");
		$("#inputHoraPlanificada").val(horaplan);
		
		var responsable=eventsOptObj.responsable.trabajadorId
		var selResponsable=crearSelectOneMenuOblig("inputResponsable","",listFullTrab,responsable,"trabajadorId","nombre");
		$("#eventrespon"+eventsOptId).html(selResponsable);
		
		var trabajador=eventsOptObj.trabajador.trabajadorId
		var selTrabajador=crearSelectOneMenuOblig("inputTrabajador","",listFullTrabajadoresByArea,trabajador,"trabajadorId","nombre");
		$("#eventtrab"+eventsOptId).html(selTrabajador);
		
		var fechareal=eventsOptObj.fechaReal;
		$("#eventfechareal"+eventsOptId).html("<input onchange='cambiarAcuerdoFechaEventoOpt()' type='date' id='inputFechaReal' class='form-control'>");
		$("#inputFechaReal").val(convertirFechaInput(fechareal));
		cambiarAcuerdoFechaEventoOpt();
		
		var plan=$("#eventplan"+eventsOptId).text();
		$("#eventplan"+eventsOptId).addClass("linkGosst")
		.on("click",function(){verPlanTrabajoEvento();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i> "+plan);
		
		var apert=$("#eventapert"+eventsOptId).text();
		$("#eventapert"+eventsOptId).addClass("linkGosst")
		.on("click",function(){verPreguntasApertura(pindex);})
		.html("<i class='fa fa-question fa-2x' aria-hidden='true' ></i> "+apert);
		var cierre=$("#eventcierre"+eventsOptId).text();
		$("#eventcierre"+eventsOptId).addClass("linkGosst")
		.on("click",function(){verPreguntasCierre(pindex);})
		.html("<i class='fa fa-question fa-2x' aria-hidden='true' ></i> "+cierre);
		
		var options={
				container:"#eventevi"+eventsOptId,
				functionCall: function(){},
				descargaUrl:"/opt/eventos/evidencia?id="+eventsOptId,
				esNuevo:false,
				idAux:"Evento",
				evidenciaNombre:eventsOptObj.evidenciaNombre
		};
		crearFormEvidenciaCompleta(options);
		$("#btnDescargarInforme").attr("onclick", "javascript: exportarInformeEventoOpt();");

		$("#btnDescargarInforme").show();
		banderaEdicionEvents=true;
		$("#btnCancelarEventos").show();
		$("#btnNuevoEventos").hide();
		$("#btnGuardarEventos").show();
		$("#btnEliminarEventos").show();
		$("#btnEvaluacion").show();
	}
}

function guardarEventosOpt()
{
	var fechaplan=convertirFechaTexto($("#inputFechaPlanificada").val());
	var horaplan=$("#inputHoraPlanificada").val();
	var inform;
	var entren;
	var raz;
	var obs;
	var felic;
	var vigencia;
	var seguimiento;
	if(eventsOptId==0)
	{
		inform=null;
		entren=null;
		raz=null;
		obs=null;
		felic=null;
		vigencia=null;
		seguimiento=null;
	}
	else 
	{
		if(estadoApertura)
		{

			inform =$("#rptainform"+eventsOptId).is(':checked');
			entren =$("#rptaseg"+eventsOptId).is(':checked');
			raz=$("#inputRazonObs").val();
			if(inform)
			{
				inform=1;
			}
			else 
			{
				inform=0;
			}
			if(entren)
			{
				entren=1;
			}
			else 
			{
				entren=0;			
			}
		}
		else 
		{
			inform=eventsOptObj.informado;
			entren=eventsOptObj.entrenado;
			raz=eventsOptObj.razon.id;
		}
		if(estadoCierre)
		{

			obs =$("#inputObs").val();
			felic =$("#rptafelic"+eventsOptId).is(':checked');
			vigencia=$("#inputVigencia").val();
			seguimiento =$("#rptasegui"+eventsOptId).is(':checked');
			if(felic)
			{
				felic=1;
			}
			else 
			{
				felic=0;
			}
			if(seguimiento)
			{
				seguimiento=1;
			}
			else 
			{
				seguimiento=0;
			}
		}
		else 
		{
			obs=eventsOptObj.observacion;
			felic=eventsOptObj.felicitacion;
			vigencia=eventsOptObj.vigenciaOpt;
			seguimiento=eventsOptObj.seguimientoOpt;
		}
	}
	if(horaplan=="")
	{
		horaplan=null;
	}
	if(fechaplan==null)
	{
		alert("Fecha Planificada es obligatoria!");
		return;
	}
	if(horaplan==null)
	{
		alert("Hora Planificada es obligatoria!");
		return;
	}
	var responsable=$("#inputResponsable").val();
	var trab=$("#inputTrabajador").val();
	
	var fechareal=convertirFechaTexto($("#inputFechaReal").val());
	
	var empresa=getSession("gestopcompanyid");
	var listaopt=obsOptObj.id;
	if(trab==null)
	{
		alert("seleccione el trabajador a evaluar !");
		return;
	}
	var dataParam=
	{
		id:eventsOptId,
		estado : eventsOptObj.estado,
		fechaPlanificada:fechaplan,
		horaPlanificada: horaplan,
		responsable:{trabajadorId:responsable},
		trabajador:{trabajadorId:trab},
		fechaReal:fechareal,
		empresa:{empresaId:empresa},
		lista:{id:listaopt},
		informado:inform,
		entrenado:entren,
		razon:{id:raz},
		observacion:obs,
		felicitacion:felic,
		vigenciaOpt:vigencia,
		seguimientoOpt:seguimiento
	};
	callAjaxPost(URL+'/opt/eventos/save',dataParam,
			procesarResultadoGuardarEvento);
}
function procesarResultadoGuardarEvento(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviEvento",
				bitsEvidenciaEventoOpt,"/opt/eventos/evidencia/save",
				cargarEventosOpt,"id")
		break; 
	default:
		alert("Ocurrio un error al guardar el archivo!");
	}
}

function eliminarEventosOpt()
{
	var r= confirm("¿Está  de eliminar este Evento?");
	if(r==true)
	{
		var dataParam={id:eventsOptId};
		callAjaxPost(URL+'/opt/eventos/delete',dataParam,
		function(data){
			switch (data.CODE_RESPONSE) {
			case "05":
				cargarEventosOpt();
				break; 
			default:
				alert("No se puede eliminar.");
			}
		});
	}
}
function verPreguntasApertura(pindex)
{
	$("#mdPreguntaApertOpt").modal("show");
	$("#btnGuardarEventoApert").attr("onclick", "javascript: guardarEventosOpt();");
	estadoApertura=true;
	eventsOptObj=listFullEventosOpt[pindex];
	var selectRazonObs;
	if(eventsOptObj.id!=0)
	{
		selectRazonObs=crearSelectOneMenuOblig("inputRazonObs","",listFullRazonObs,eventsOptObj.razon.id,"id","nombre");
	}
	else 
	{

		selectRazonObs=crearSelectOneMenuOblig("inputRazonObs","",listFullRazonObs,"","id","nombre");
	}
	$("#tblPreguntaApertOpt tbody tr").remove();
	$("#tblPreguntaApertOpt tbody").append(
			"<tr id='trapert"+eventsOptObj.id+"'>" +
				"<td id='apertseg"+eventsOptObj.id+"'>¿El trabajador ha sido entrenado en seguridad?</td>"+
				"<td id='apertseg"+eventsOptObj.id+"'><input type='checkbox' id='rptaseg"+eventsOptObj.id+"' class='check' "+(eventsOptObj.entrenado==1?"checked":"")+"></td>"+
			+"</tr>"+
			"<tr id='trapert"+eventsOptObj.id+"'>" +
				"<td id='apertinform"+eventsOptObj.id+"'>¿Se le ha notificado que sera Informado?</td>"+
				"<td id='apertinform"+eventsOptObj.id+"'><input type='checkbox' id='rptainform"+eventsOptObj.id+"' class='check' "+(eventsOptObj.informado==1?"checked":"")+"></td>"+
			+"</tr>"+
				"<tr id='trapert"+eventsOptObj.id+"'>" +
			"<td id='apertseg"+eventsOptObj.id+"'>Razón de la Observación:</td>"+
				"<td id='apertseg"+eventsOptObj.id+"'>"+selectRazonObs+"</td>"+
			+"</tr>"
	);
	completarBarraCarga();
	formatoCeldaSombreableTabla(true, "tblPreguntaApertOpt");
}
function verPreguntasCierre(pindex)
{
	$("#mdPreguntaCierreOpt").modal("show");
	$("#btnGuardarEventoCierre").attr("onclick", "javascript: guardarEventosOpt();");
	estadoCierre=true;
	eventsOptObj=listFullEventosOpt[pindex];

	$("#tblPreguntaCierreOpt tbody tr").remove();
	$("#tblPreguntaCierreOpt tbody").append(
			"<tr id='trcierrobs"+eventsOptObj.id+"'>" +
				"<td id='cierrobs"+eventsOptObj.id+"'>Observaciones Generales Encontradas: </td>"+
				"<td id='cierrobs"+eventsOptObj.id+"'><textarea id='inputObs' class='form-control'>"+eventsOptObj.observacion+"</textarea></td>"+
			+"</tr>"+
			"<tr id='trcierrfelic"+eventsOptObj.id+"'>" +
				"<td id='cierrfelic"+eventsOptObj.id+"'>¿Ha felicitado adecuadamente al trabajador y/o ha vuelto a instruirlo en base a las observaciones?</td>"+
				"<td id='cierrfelic"+eventsOptObj.id+"'><input type='checkbox' id='rptafelic"+eventsOptObj.id+"' class='check' "+(eventsOptObj.felicitacion==1?"checked":"")+"></td>"+
			+"</tr>"+
			"<tr id='trcierrvig"+eventsOptObj.id+"'>" +
				"<td id='cierrvig"+eventsOptObj.id+"'>Vigencia de la OPT:</td>"+
				"<td id='cierrvig"+eventsOptObj.id+"'>" +
						"<div class='row'>" +
							"<section class='col col-xs-7'>" +
								"<input type='number'id='inputVigencia' class='form-control' min='0' value='"+eventsOptObj.vigenciaOpt+"'>" +
							"</section>"+
							"<section class='col col-xs-1' style='top: 7px;right: 20px;'>Dias</section>"+
						"</div>"+
				"</td>"+
			+"</tr>"+
			"<tr id='trcierrsegui"+eventsOptObj.id+"'>" +
				"<td id='cierrsegui"+eventsOptObj.id+"'>¿Se debería una observación de seguimiento a este trabajador en un futuro cercano?</td>"+
				"<td id='cierrsegui"+eventsOptObj.id+"'>" +
					"<input type='checkbox'id='rptasegui"+eventsOptObj.id+"' class='check' "+(eventsOptObj.seguimientoOpt==1?"checked":"")+">" +
				"</td>"+
			+"</tr>"
	);
	completarBarraCarga();
	formatoCeldaSombreableTabla(true, "tblPreguntaCierreOpt");
}
function exportarInformeEventoOpt()
{
	window.open(URL	+ "/opt/eventos/informe/excel?id="+ eventsOptId);
}
function cancelarEventosOpt()
{
	cargarEventosOpt();
} 





function cambiarAcuerdoFechaEventoOpt(){
	var fechaPlanificada=$("#inputFechaPlanificada").val();
	var fechaReal=$("#inputFechaReal").val();
	 
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		eventsOptObj.estado={
				id:2,nombre:"Completado"
		}
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				eventsOptObj.estado={
						id:3,nombre:"Retrasado"
				}
			}else{
				eventsOptObj.estado={
						id:1,nombre:"Por Implementar"
				}
			}
			
		}else{
			eventsOptObj.estado={
					id:1,nombre:"Por Implementar"
			}
		}
	}
	
	$("#eventest"+eventsOptObj.id).html(eventsOptObj.estado.nombre);
}