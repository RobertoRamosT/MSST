function llamarIndicadoresPlanificacion(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 var auxUnidad=$("#selUnidad").val().split('-')
	 unidadId=parseInt(auxUnidad[0]);
	 unidadTipoId=parseInt(auxUnidad[1]);
	 if(filtrarIperc){
		 ipercId=$("#selIperc").val();
	 }
	 var dataParam = {
				empresaId : sessionStorage.getItem("gestopcompanyid"),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin ,
				mdfId: unidadId,
				mdfTipoId:unidadTipoId,
				ipercId:ipercId
			
				
				};

			callAjaxPost(URL + '/estadistica/planificacion', dataParam,
					procesarllamarIndicadoresPlanificacion);
	
	
}
var areaPlanificadasDetalle;
function procesarllamarIndicadoresPlanificacion(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var areasInvolucradas = data.areasInvolucradas;
		var areaPlanificadas=data.planificacionIndicadores;
		 areaPlanificadasDetalle=data.detallePlanificaciones;
	
		$("#tblPlanificacionArea thead tr").remove();
		$("#tblPlanificacionArea tbody tr").remove();

	$("#tblPlanificacionArea thead").append(
				
				"<tr>"
				+"<td>"
		
		+"		</td>"
		+"</tr>"
	
		)
		
	$("#tblPlanificacionArea tbody ").append(
		
			'<tr id="numActRealizada">'
			+'<td>Actividades Realizadas</td>'
			+'</tr>'
			+'<tr id="numActImplementar">'
			+'<td>Actividades en Proceso</td>'
			+'</tr>'
			+'<tr id="numActRetraso">'
			+'<td>Actividades con retraso</td>'
			+'</tr>'
			+'<tr id="numActTotal">'
			+'<td>Total Actividades </td>'
			+'</tr>'
			+'<tr id="actividadesIndicador">'
			+'<td>Eficiencia</td>'
			
			+'</tr>'
			
		)
	
		for (var index = 0; index < areasInvolucradas.length; index++) {
			
			var nombre=areasInvolucradas[index].areaNombre;
				
			$("#tblPlanificacionArea thead tr").append(
				
					"<th>"+nombre+"</th>"
		
			)
			
			$("#tblPlanificacionArea tbody tr").append(
				
				"<td id='areaId"+areasInvolucradas[index].areaId+"'>" +
					"0</td>"
	
		)
			
		}
		
	

		
		for (index = 0; index < areaPlanificadas.length; index++) {
			comprobarNumPlanificacion(
					areaPlanificadas[index].areaId,
					areaPlanificadas[index].controlesImplementar,
					areaPlanificadas[index].controlesImplementarId,
					areaPlanificadas[index].controlesCompletados,
					areaPlanificadas[index].controlesCompletadosId,
					areaPlanificadas[index].controlesRetrasados,
					areaPlanificadas[index].controlesRetrasadosId
					);
			
		}
	
		
		
	$("#tblPlanificacionArea thead tr th").addClass("tb-acc");
		
		
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}
	
}


function comprobarNumPlanificacion(areaId,
		numCtrlImpl,idCtrlImpl,
		numCtrlComple,idCtrlCompl,
		numCtrlAtras,idCtrlAtras){
	$("#numActRealizada #areaId"+areaId).html("<a onclick='llenarTablaActividades("+areaId+",&quot;"+idCtrlCompl+"&quot;,1)'>"+numCtrlComple+"</a>");
	$("#numActImplementar #areaId"+areaId).html("<a onclick='llenarTablaActividades("+areaId+",&quot;"+idCtrlImpl+"&quot;,2)'>"+numCtrlImpl+"</a>");
	$("#numActRetraso #areaId"+areaId).html("<a onclick='llenarTablaActividades("+areaId+",&quot;"+idCtrlAtras+"&quot;,3)'>"+numCtrlAtras+"</a>");
	var totalActividades=numCtrlComple+numCtrlAtras+numCtrlImpl;
	var idCompletos=idCtrlCompl+","+idCtrlImpl+","+idCtrlAtras;
	$("#numActTotal #areaId"+areaId).html("<a onclick='llenarTablaActividades("+areaId+",&quot;"+idCompletos+"&quot;,4)'>"+totalActividades+"</a>");

	var indicador="--";
	var auxindicador="--";
	if(totalActividades>=0){
	indicador=parseInt(numCtrlComple)/totalActividades;
	 auxindicador=pasarDecimalPorcentaje(indicador,2);
}
	$("#actividadesIndicador #areaId"+areaId).html("<h4 style='color:"+ colorPuntaje(indicador)+"'>"+auxindicador+"</h4>");
}

function colorPuntaje(puntaje){
	var color="black";
		if(puntaje<=0.66){
			color="orange"
		}
		if(puntaje<=0.34){
		color="red"
	}
		if(puntaje>0.66){
			color="green"
		}
	return color;
}
function llenarTablaActividades(areaId,planificadosId,tipoId){
	
	$("#tblDetallePlan tbody tr").remove();
	var listaPlanificados=planificadosId.split(",");
	$("#tblDetallePlan").show();	
	for(var index=0;index<listaPlanificados.length;index++){

		for(var index2=0;index2<areaPlanificadasDetalle.length;index2++){
			
			if(areaPlanificadasDetalle[index2].planificacionId==parseInt(listaPlanificados[index])){
				
	
				$("#tblDetallePlan tbody").append(
						
				"<tr>" +
				"<td>"+areaPlanificadasDetalle[index2].nombreProcedencia+"</td>" +
				"<td>"+areaPlanificadasDetalle[index2].tipoEstadoPlanificacion+"</td>" +
				"<td>"+areaPlanificadasDetalle[index2].descripcionPlanificacion+"</td>" +
				"<td>"+areaPlanificadasDetalle[index2].nombrePeligro+"</td>" +
				"<td>"+areaPlanificadasDetalle[index2].planificacionResponsable+"</td>" +
		
				"<td>"+areaPlanificadasDetalle[index2].fechaPlaneada+"</td>" +
				"<td>"+areaPlanificadasDetalle[index2].fechaReal+"</td>" +
				
				"</tr>"
				
				
				)
				
			}
		}
	}
	$("#tblDetallePlan thead tr th").addClass("tb-acc");
		
	switch(parseInt(tipoId)){
	
	case 1:
		$("#mdDetallePlanificaciones").modal('show');
	$("#tituloDetalle").html("Detalle de Controles Completado ");
		break;
		
	case 2:
		$("#mdDetallePlanificaciones").modal('show');
		$("#tituloDetalle").html("Detalle de Controles por Implementar ");
		break;
		
	case 3:
		$("#mdDetallePlanificaciones").modal('show');
		$("#tituloDetalle").html("Detalle de Controles Retrasados ");
		break;
	case 4:
		$("#mdDetallePlanificaciones").modal('show');
		$("#tituloDetalle").html("Detalle de Controles Total ");
		break;	
		
	default:
		
		break;
		
		
		
	}
	
}



