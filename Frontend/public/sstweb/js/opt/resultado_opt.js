var listFullResultOpt;
function verResultadoOpt()
{
	$("#tabObservaciones .container-fluid").hide();
	$("#tabObservaciones #divContainObservaciones").hide(); 
	$("#tabObservaciones #divContainEstadisticas").show();
	$("#tabObservaciones").find("h2")
	.html("<a onclick='volverObsOpt();'>Observaciones OPT </a>"
			+"> Resultados - Lista de evaluación: "+obsOptObj.nombre+" al Area: "+obsOptObj.area.areaId);
	cargarResultadoPregOpt();
}
function cargarResultadoPregOpt()
{
	listFullResultOpt=obsOptObj.preguntas;
	$("#tblEstadisticas tbody tr").remove(); 
	listFullResultOpt.forEach(function(val, index) {
		var puntaje=val.puntajeTotal;
		var totalEvalPreg=val.numPreguntasEval;
		var ponderado;
		if(totalEvalPreg==0)
		{
			ponderado="%0";
		}
		else 
		{
			ponderado=pasarDecimalPorcentaje((puntaje/totalEvalPreg),1);
		}
		$("#tblEstadisticas tbody").append(
				"<tr id='trres"+val.id+"'>"
					+"<td id='resreq"+val.id+"'>"+val.nombre +"</td>"
					+"<td id='resnumtrab"+val.id+"'>"+val.numTrabEval +"</td>"
					+"<td id='resnumpond"+val.id+"'>"+ponderado +"</td>"	 
				+"</tr>");
	});
	completarBarraCarga();
	formatoCeldaSombreableTabla(true, "tblEstadisticas");
}
