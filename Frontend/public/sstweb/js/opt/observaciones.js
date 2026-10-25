var listFullObsOpt,listaPregSelect;
var obsOptObj,obsOptId;
var banderaEdicion;
var listFullIndicadorList;
$(function ()
{
	$("#btnListaPregObs").attr("onclick", "javascript: verListaPreguntasOpt();");
	$("#btnPlanEventObs").attr("onclick", "javascript: verEventosOpt();");
	$("#btnVerEstadisticasObs").attr("onclick", "javascript: verResultadoOpt();");
	$("#btnCancelarObs").attr("onclick", "javascript: cancelarObsOpt();");
	insertMenu(cargarObsOpt);
});

function volverObsOpt() {
	$("#tabObservaciones .container-fluid").hide();
	$("#divContainObservaciones").show();
	$("#divContainListaPregunt").hide();
	$("#tabObservaciones").find("h2").html("Observaciones Planeadas de Trabajo");
}
function cargarObsOpt()
{
	$("#btnCancelarObs").hide();
	$("#btnPlanEventObs").hide();
	$("#btnListaPregObs").show();
	$("#btnVerEstadisticasObs").hide();
	volverObsOpt();
	var empresa=getSession("gestopcompanyid")
	callAjaxPost(URL + '/opt/observaciones', {
		empresaId :empresa},
		function(data) {
			if (data.CODE_RESPONSE = "05") 
			{
				banderaEdicion = false;
				listFullObsOpt = data.list;
				listaPregSelect=data.listPreguntas;
				$("#tblObservaciones tbody tr").remove(); 
				listFullObsOpt.forEach(function(val, index) {
					var puntajeTotal=val.puntajeTotalByList;
					var numEvaluados=val.numEval;
					var ponderado;
					if(numEvaluados==0)
					{
						ponderado="%0";
					}
					else 
					{
						ponderado=pasarDecimalPorcentaje((puntajeTotal/numEvaluados),1);
					}
					$("#tblObservaciones tbody").append(
							"<tr id='trobs"+val.id+"' onclick='editarObservacion("+index+")'>"
								+"<td id='obslist"+val.id+"'>"+val.nombre +"</td>"
								+"<td id='obsobj"+val.id+"'>"+val.objetivo +"</td>"
								+"<td id='obsarea"+val.id+"'>"+val.area.areaName+"</td>"
								+"<td id='obsproc"+val.id+"'>"+val.procedimiento+"</td>"
								+"<td id='obstrab"+val.id+"'>"+val.numTrabEval+" / "+val.numTrab+"</td>"
								+"<td id='obsresult"+val.id+"'>"+ponderado+"</td>"
								+"<td id='obsevents"+val.id+"'>"+val.numEventosTerminado+" / "+val.numEventos+"</td>"
								+"<td id='obsplan"+val.id+"'>"+0+"</td>"
							+"</tr>");
				});
				completarBarraCarga();
				formatoCeldaSombreableTabla(true, "tblObservaciones");
			} else {
				console.log("ERROR, no entro al IF :''v");
			}
		
		});

}
function editarObservacion(pindex){
	if(!banderaEdicion){
		formatoCeldaSombreableTabla(false,"tblObservaciones");
		obsOptId=listFullObsOpt[pindex].id;
		obsOptObj=listFullObsOpt[pindex];
		
		var plan=$("#obsplan"+obsOptId).text();
		$("#obsplan"+obsOptId).addClass("linkGosst")
		.on("click",function(){alert("aqui va plan !");})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i> "+plan);
		
		var resultado=$("#obstrab"+obsOptId).text();
		$("#obstrab"+obsOptId).addClass("linkGosst")
		.on("click",function(){verIndicadorTrabEval();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i> "+resultado);
		
		banderaEdicion=true;
		$("#btnCancelarObs").show();
		$("#btnPlanEventObs").show();
		$("#btnListaPregObs").hide();
		$("#btnVerEstadisticasObs").show();
	}
}

function cancelarObsOpt()
{
	cargarObsOpt();
}
function verIndicadorTrabEval()
{	
	$("#mdIndicadorTrabOpt").modal("show");
	var empresa=getSession("gestopcompanyid");
	callAjaxPost(URL + '/opt/observaciones/indicador', {
		empresaId :empresa,
		id:obsOptId,
		area:
		{
			areaId:obsOptObj.area.areaId
		}
	},
		function(data) {
			if (data.CODE_RESPONSE = "05") 
			{
				listFullIndicadorList = data.list;
			 	$("#tblIndicadorTrabOpt tbody tr").remove(); 
				listFullIndicadorList.forEach(function(val, index) {
					var puntajeTotal=val.resultadoTrabEval;
					var numEvaluados=val.numEvalsTrab;
					var ponderado;
					var estado="";
					if(numEvaluados==0)
					{
						ponderado="%0";
					}
					else 
					{
						ponderado=pasarDecimalPorcentaje((puntajeTotal/numEvaluados),1);
					}
					if(val.resultadoTrabEval==null)
					{
						estado="Por Evaluar";
						ponderado="----";
					}
					else 
					{
						estado="Evaluado";
					}
					if(val.id==null)
					{
						val.id="----";
					}
					$("#tblIndicadorTrabOpt tbody").append(
							"<tr id='trobs"+val.id+"' >"
								+"<td id='evnid"+val.trabajador.trabajadorId+"'>"+val.id +"</td>"
								+"<td id='evntrab"+val.trabajador.trabajadorId+"'>"+val.trabajador.nombre +"</td>" 
								+"<td id='evnestado"+val.trabajador.trabajadorId+"'>"+estado+"</td>" 
								+"<td id='evnpond"+val.trabajador.trabajadorId+"'>"+ponderado +"</td>" 
							+"</tr>");
				});
				completarBarraCarga();
				formatoCeldaSombreableTabla(true, "tblIndicadorTrabOpt");
			} else {
				console.log("ERROR, no entro al IF :''v");
			}
		
		});
	
}





