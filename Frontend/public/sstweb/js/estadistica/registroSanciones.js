var detalleAccidentesTrabajadores;
var detalleSancionesTrabajadores;

function llamarReporteSanciones(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 var auxUnidadId=$("#selUnidad").val().split("-");
	 unidadId=parseInt(auxUnidadId[0]);
	 var dataParam = {

				empresaId : sessionStorage.getItem("gestopcompanyid"),
				mdfId : (unidadId>0?unidadId:null),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin 
				
				
				};

			callAjaxPost(URL + '/estadistica/sanciones', dataParam,
					procesarLlamadaSanciones);
	
	
}

function procesarLlamadaSanciones(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var totalSanciones=0;
		var totalIncidentes=0;
		var totalInvCompl=0;
		var trabs=data.trabs;
		var sancionesTrabajadores=data.sancionesTrabajadores;
		var accidentesTrabajadores=data.accidentesTrabajadores;
		 detalleSancionesTrabajadores=data.detalleSancionesTrabajadores;
		 detalleAccidentesTrabajadores=data.detalleAccidentesTrabajadores;
		
		 
		
		$("#tblReporteSanciones tbody tr td").remove();

		for (index = 0; index < trabs.length; index++) {
			
			
			$("#tblReporteSanciones tbody").append("<tr id='trab"+trabs[index].trabajadorId+"'>" +
					"<td>"+trabs[index].trabajadorNombre+"</td>" 
					+"<td id='sanc'>0</td>"
					+"<td id='inc'>0</td>"
					+"<td id='acc'>0</td>"
					
					+		"</tr>" )	;
			
			
			}
		
		for (index = 0; index < sancionesTrabajadores.length; index++) {
			comprobarSancionesTrabajadores(sancionesTrabajadores[index].trabajadorId,
					sancionesTrabajadores[index].numSanciones);
		}
		
		for (index = 0; index < accidentesTrabajadores.length; index++) {
			comprobarAccidentesTrabajadores(accidentesTrabajadores[index].trabajadorId,
					accidentesTrabajadores[index].numAccidentes,accidentesTrabajadores[index].tipoAccidenteId);
		}
	$("#tblReporteSanciones thead tr th").addClass("tb-acc");
		
		
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}
	
}


function comprobarSancionesTrabajadores(trabajadorId,numSanciones){
	$("#trab"+trabajadorId+" #sanc").html("<a onclick='verDetalleSanciones("+trabajadorId+")'>"+numSanciones+"</a>");
	
}
function comprobarAccidentesTrabajadores(trabajadorId,numAccidentes,tipoAccId){
	var tdAccidente;
	if(parseInt(tipoAccId==2)){
		tdAccidente="inc";
		
	}else{
		tdAccidente="acc"
	}
	
	$("#trab"+trabajadorId+" #"+tdAccidente+"").html("<a onclick='verDetalleAccidentes("+trabajadorId+","+tipoAccId+")'>"+numAccidentes+"</a>");
	
}
function verDetalleSanciones(trabId){
	$("#mdDetalleSanciones").modal("show");
	var titulo="Detalle de Sanciones de ";
	var subtitulo="";
	var nombreTrabajador;

	
	
	$("#tblDetalleSanciones").show();
	$("#tblDetalleSanciones tbody tr td").remove();
	$("#tblDetalleSanciones thead tr th").addClass("tb-acc");
		for (var index = 0; index < detalleSancionesTrabajadores.length; index++) {
				if(detalleSancionesTrabajadores[index].trabajadorId==trabId ){
				$("#tblDetalleSanciones tbody").append(
						"<tr>"
						+"<td>"+detalleSancionesTrabajadores[index].fechaSancionTexto+"</td>"
						+"<td>"+detalleSancionesTrabajadores[index].descripcionSancion+"</td>"
						+"<td>"+detalleSancionesTrabajadores[index].informacionExtra+"</td>"
						
						+"</tr>"
							
					);
				}
				nombreTrabajador=detalleSancionesTrabajadores[index].trabajadorNombre;
		}
	
		$("#tituloDetalleSanciones").html(titulo+""+nombreTrabajador+"'");
}

function verDetalleAccidentes(trabId,tipoAccId){
	$("#mdDetalleSanciones").modal("show");
	var titulo="Detalle de ";
	var subtitulo="";
	var nombreTrabajador;

	switch(tipoAccId){

	case 1:
		subtitulo="Accidentes";
		break;
	case 2:
		subtitulo="Incidentes";
		break;
	
		
	}
	
	$("#tblDetalleSanciones").show();
	$("#tblDetalleSanciones tbody tr td").remove();
	$("#tblDetalleSanciones thead tr th").addClass("tb-acc");
		for (var index = 0; index < detalleAccidentesTrabajadores.length; index++) {
				if(detalleAccidentesTrabajadores[index].trabajadorId==trabId &&
						detalleAccidentesTrabajadores[index].tipoAccId==tipoAccId ){
				$("#tblDetalleSanciones tbody").append(
						"<tr>"
						+"<td>"+detalleAccidentesTrabajadores[index].fechaSancionTexto+"</td>"
						+"<td>"+detalleAccidentesTrabajadores[index].descripcionSancion+"</td>"
						+"<td>"+detalleAccidentesTrabajadores[index].informacionExtra+"</td>"
						
						+"</tr>"
							
					);
				}
				nombreTrabajador=detalleAccidentesTrabajadores[index].trabajadorNombre;
		}
	
		$("#tituloDetalleSanciones").html(titulo+" "+subtitulo+" del trabajador '"+nombreTrabajador+"'");
}