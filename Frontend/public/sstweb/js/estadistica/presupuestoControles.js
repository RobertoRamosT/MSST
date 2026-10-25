function llamarPresupuestoControles(){
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

			callAjaxPost(URL + '/estadistica/controles/presupuesto', dataParam,
					procesarLlamadaPresupControles);
	
	
}

function procesarLlamadaPresupControles(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var areasInvolucradas = data.areasInvolucradas;
		var areaControlada=data.areaControlada;

		$("#tblControlesArea thead tr").remove();
		$("#tblControlesArea tbody tr").remove();

	$("#tblControlesArea thead").append(
				
				"<tr>"
				+"<td>"
		
		+"		</td>"
		+"</tr>"
	
		)
		
	$("#tblControlesArea tbody ").append(
			'<tr id="numControles">'
			+'<td>Controles a Implementar</td>'
			+'</tr>'
			+'<tr id="invControles">'
			+'<td>Inversi&oacute;n</td>'
			+'</tr>'	
		)
	
		for (index = 0; index < areasInvolucradas.length; index++) {
			if(areasInvolucradas[index]!=null){
			var nombre=areasInvolucradas[index].areaNombre;
				
			$("#tblControlesArea thead tr").append(
				
					"<th>"+nombre+"</th>"
		
			)
			
			$("#tblControlesArea tbody tr").append(
				
				"<td id='areaId"+areasInvolucradas[index].areaId+"'>" +
					"-----</td>"
	
		)
			}
		}
		
	

		
		for (index = 0; index < areaControlada.length; index++) {
			comprobarNumControles(
					areaControlada[index].areaId,
					areaControlada[index].numControles,
					areaControlada[index].presupuesto);
			
		}
	
		
		
	$("#tblControlesArea thead tr th").addClass("tb-acc");
		
		
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}
	
}


function comprobarNumControles(areaId,numCtrl,presup){
	$("#numControles #areaId"+areaId).html(numCtrl);
	$("#invControles #areaId"+areaId).html(presup);
	
	
}
