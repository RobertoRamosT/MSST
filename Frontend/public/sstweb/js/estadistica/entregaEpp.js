

function llamarIndicadorEntregaEpp(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 var auxUnidad=null;
	 auxUnidad=$("#selUnidad").val().split('-')
	 unidadId=parseInt(auxUnidad[0]);
	
	 puestoId=$("#selPuesto").val();
	 var divisionId=$("#selDivision").val();
	 var areaId=$("#selArea").val();
	 var dataParam = {
				
			empresaId : sessionStorage.getItem("gestopcompanyid"),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin ,
				mdfId:(unidadId=="-1"?null:unidadId),
				divisionId:(divisionId=="-1"?null:divisionId),
				areaId:(areaId=="-1"?null:areaId),
				puestoId: (puestoId=="-1"?null:puestoId)
				
				};

			callAjaxPost(URL + '/estadistica/entregaEpp', dataParam,
					procesarLlamadaEntregas);
	
	
}

function procesarLlamadaEntregas(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var entregaNecesaria = data.entregaNecesaria;
		var entregaRealizada=data.entregaRealizada;
		var trabs=data.trabs;
		
	
		$("#tblEntregaEpp thead tr").remove();
		$("#tblEntregaEpp tbody tr").remove();

		for (index = 0; index < trabs.length; index++) {
		
	
		$("#tblEntregaEpp tbody").append("<tr id='trab"+trabs[index].trabajadorId+"'>" +
				"<td>"+trabs[index].trabajadorNombre+"</td></tr>" )	;
		
		
		}

		
		$("#tblEntregaEpp thead").append(
				"<tr><th>Trabajador</th></tr>" );
	
		for (index = 0; index < entregaNecesaria.length; index++) {
			
			var nombre=entregaNecesaria[index].eppNombre;
				
			$("#tblEntregaEpp thead tr").append(
				
					"<th>"+nombre+"</th>"
		
			)
			
			$("#tblEntregaEpp tbody tr").append(
				
				"<td id='eppId"+entregaNecesaria[index].eppId+"'>" +
						"<i class='fa fa-times fa-2x' style='color:red'></i></td>"
	
		)
			
		}
		
		$("#tblEntregaEpp tbody ").append("<tr id='totales'><td>Total Epps</td></tr>")
		
		for (index = 0; index < entregaNecesaria.length; index++) {
			
			
			$("#tblEntregaEpp tbody #totales").append("<td id='totalEpp"+entregaNecesaria[index].eppId+"'>" +
					"</td>")	;
			
			
			}
		
		
		for (index = 0; index < entregaRealizada.length; index++) {
			comprobarEntrega(entregaRealizada[index].trabajadorId,
					entregaRealizada[index].eppId,
					entregaRealizada[index].numEpp);
			
		}
		for (index = 0; index < entregaNecesaria.length; index++) {
			
			sumarEntregas(entregaNecesaria[index].eppId,index);
			}
		
		
		
	$("#tblEntregaEpp thead tr th").addClass("tb-acc");
		
		
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}
	
}


function comprobarEntrega(trabId,eppId,numEpp){
	
	$("#tblEntregaEpp tbody tr").each(function(){
		
		if($(this).prop("id")=="trab"+trabId){
			
			$("td").each(function(){
				if($(this).prop("id")=="eppId"+eppId){
					$("#trab"+trabId+" #eppId"+eppId).html(numEpp);
					
				}
				
			})
			

			
		}
		
		
	});
}

function sumarEntregas(eppId,posicion){
	
	var suma = 0;
		
	$('#tblEntregaEpp tr').each(function(){ //filas con clase 'dato', especifica una clase, asi no tomas el nombre de las columnas
	 suma += parseInt($(this).find('td').eq(posicion+1).text()||0,10) //numero de la celda 3
	})
	
	$("#totalEpp"+eppId).html(suma);
	
}





function descargarConsolidadoInspeccion(){
    var fechaInicioConsolidado = $("#fechaIniciaGraf").val();
    var fechaFinConsolidado = $("#fechaFinGraf").val();
	 var auxUnidad=null;
	 auxUnidad=$("#selUnidad").val().split('-');
	
	 unidadId=parseInt(auxUnidad[0]);
	 
	 var mdfId = (unidadId=="-1"?null:unidadId);
	 puestoId=($("#selPuesto").val()=="-1"?null:$("#selPuesto").val());
	 
	 var divisionId=($("#selDivision").val()=="-1"?null:$("#selDivision").val());
	 var areaId=($("#selArea").val()=="-1"?null:$("#selArea").val());

	 
	 var dataParam = {
			
			empresaId : sessionStorage.getItem("gestopcompanyid"),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin ,
				mdfId:(unidadId=="-1"?null:unidadId),
				divisionId:(divisionId=="-1"?null:divisionId),
				areaId:(areaId=="-1"?null:areaId),
				puestoId: (puestoId=="-1"?null:puestoId)
				
				};
	 
    
    //var  unidadId=(parseInt(auxUnidad[0]) == null)?0:1;

    
    
    consolExcelHallazgosLibresCheckList(getSession("gestopcompanyid"),fechaInicioConsolidado,
 	                               fechaFinConsolidado,mdfId, puestoId,divisionId, areaId);
     
 }

function consolExcelHallazgosLibresCheckList(empresaId,fechaInicioConsolidado,fechaFinConsolidado,
   mdfId,puestoId,divisionId,areaId){   
   var uno = 1,cero = 0;
     
   window.open(URL+"/estadistica/reporte/excel?idCompany="+empresaId +"&fechaInicioConsolidado="+fechaInicioConsolidado +
      "&fechaFinConsolidado="+fechaFinConsolidado+"&mdfId="+mdfId+"&puestoId="+puestoId+"&divisionId="+divisionId +
      "&areaId="+areaId);
}
