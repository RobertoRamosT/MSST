var detalleInversionesIperc;
var detalleInversionesFormacion;
var detalleInversionesExamen;
var detalleInversionesCompra1;
var detalleInversionesCompra2;
var detalleInversionesCompra3;
var detalleInversionesCompra4;
var detalleInversionesEntrega;
var detalleInversionesInspe;
var detalleInversionesDiagn;
var detalleInversionesAccion;
var detalleInversionesAcuerdos;
var detalleInversionesCorreccion;
function llamarInverionesEmpresa(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();

	 var dataParam = {
				empresaId : sessionStorage.getItem("gestopcompanyid"),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin 
				
				
				};

			callAjaxPost(URL + '/estadistica/inversiones', dataParam,
					procesarLlamadaInversiones);
	
	
}

function procesarLlamadaInversiones(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var totalInvRetrasada=0;
		var totalInvImple=0;
		var totalInvCompl=0;
		var totalInvTotal=0;
		var inversionesTotales=data.inversionesTotales;
		 detalleInversionesIperc=data.detalleInversionesIperc;
		 detalleInversionesFormacion=data.detalleInversionesFormacion;
		 detalleInversionesExamen=data.detalleInversionesExamen;
		 detalleInversionesCompra1=data.detalleInversionesCompra1;
		 detalleInversionesCompra2=data.detalleInversionesCompra2;
		 detalleInversionesCompra3=data.detalleInversionesCompra3;
		 detalleInversionesCompra4=data.detalleInversionesCompra4;
		 detalleInversionesEntrega=data.detalleInversionesEntrega;
		 detalleInversionesInspe=data.detalleInversionesInspe;
		 detalleInversionesDiagn=data.detalleInversionesDiagn;
		 detalleInversionesAccion=data.detalleInversionesAccion;
		 detalleInversionesCorreccion=data.detalleInversionesCorreccion;
		 detalleInversionesAcuerdos=data.detalleInversionesAcuerdos;
		$("#tblInversionesSeguridad tbody tr td").remove();


		
	$("#tblInversionesSeguridad tbody #invRetrasada").append(
			'<td>Inversión Retrasada</td>'
			
				
		);
	$("#tblInversionesSeguridad tbody #invProceso").append(
			'<td>Inversión en Proceso</td>'
			
				
		);
	$("#tblInversionesSeguridad tbody #invCompletada").append(
			'<td>Inversión Efectuada</td>'
			
				
		);
	$("#tblInversionesSeguridad tbody #invTotal").append(
			'<td>Inversión Total</td>'
			
				
		);
	
		for (var index = 0; index < inversionesTotales.length; index++) {
			var invRetrasada=0;
			var invImple=0;
			var invCompl=0;
			var invTotal=0;
			if(inversionesTotales[index]!= null){
				
				if(inversionesTotales[index].invRetrasado!=null){
					
					invRetrasada=parseFloat(inversionesTotales[index].invRetrasado);
				}
	if(inversionesTotales[index].invTotal!=null){
					
		 invTotal=parseFloat(inversionesTotales[index].invTotal);
				}
	if(inversionesTotales[index].invCompleto!=null){
		
		 invCompl=parseFloat(inversionesTotales[index].invCompleto);
	}
	if(inversionesTotales[index].invImplementar!=null){
		
		 invImple=parseFloat(inversionesTotales[index].invImplementar);
	}
			 
			}
			
			$("#tblInversionesSeguridad tbody #invRetrasada").append(
					'<td><a onclick="verDetalleInversion('+index+',3)">S/ '+invRetrasada+'</a></td>'
					
						
				);
			$("#tblInversionesSeguridad tbody #invProceso").append(
					'<td><a onclick="verDetalleInversion('+index+',1)">S/ '+invImple+'</a></td>'
					
						
				);
			$("#tblInversionesSeguridad tbody #invCompletada").append(
					'<td><a onclick="verDetalleInversion('+index+',2)">S/ '+invCompl+'</a></td>'
						
				);
			$("#tblInversionesSeguridad tbody #invTotal").append(
					'<td><a onclick="verDetalleInversion('+index+',4)">S/ '+invTotal+'</a></td>'	
				);
			totalInvRetrasada+=invRetrasada;
			 totalInvImple+=invImple;
			 totalInvCompl+=invCompl;
			 totalInvTotal+=invTotal;
		
		}
		
	
	$("#tblInversionesSeguridad tbody #invRetrasada").append(
				'<td>S/ '+parseFloat(totalInvRetrasada.toFixed(2))+'</td>'
				
					
			);
		$("#tblInversionesSeguridad tbody #invProceso").append(
				'<td>S/ '+parseFloat(totalInvImple.toFixed(2))+'</td>'
				
					
			);
		$("#tblInversionesSeguridad tbody #invCompletada").append(
				'<td>S/ '+parseFloat(totalInvCompl.toFixed(2))+'</td>'
					
			);
		$("#tblInversionesSeguridad tbody #invTotal").append(
				'<td>S/ '+parseFloat(totalInvTotal.toFixed(2))+'</td>'	
			);
	
		
		
	$("#tblInversionesSeguridad thead tr th").addClass("tb-acc");
		
		
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}
	
}


function verDetalleInversion(tipoDetalle,estadoId){
	var titulo="";
	var sufijoTitulo="";
	var detalleInversionesAux;
	

	$("#mdDetalleInversiones").modal("show");
	$("#tblDetalleInversiones").show();
	$("#tblDetalleInversiones tbody tr td").remove();
	$("#tblDetalleInversiones thead tr th").addClass("tb-acc");
	
switch(estadoId){

case 1:
	sufijoTitulo="Inversiones en proceso";
	break;
case 2:
	sufijoTitulo="Inversiones efectuadas";
	break;
case 3:
	sufijoTitulo="Inversiones retrasadas";
	break;
case 4:
	sufijoTitulo="Inversiones";
	break;
	
}
switch(tipoDetalle){
case 0:
titulo="de Controles-IPERC";
detalleInversionesAux=detalleInversionesIperc;
break;
case 1:
	titulo="de Programación de Formaciones";
	detalleInversionesAux=detalleInversionesFormacion;
	break;
case 2:
	titulo="de Programación de Exámenes médicos";
	detalleInversionesAux=detalleInversionesExamen;
	break;
case 3:
	titulo="de Adquisición de EPP";
	detalleInversionesAux=detalleInversionesCompra1;
	break;
case 4:
	titulo="de Adquisición de Equipos de Emergencia";
	detalleInversionesAux=detalleInversionesCompra2;
	break;
case 5:
	titulo="de Adquisición de Señalética / carteles";
	detalleInversionesAux=detalleInversionesCompra3;
	break;
case 6:
	titulo="de Adquisición de EPC";
	detalleInversionesAux=detalleInversionesCompra4;
	break;
case 7:
	titulo="de Diagnósticos";
	detalleInversionesAux=detalleInversionesDiagn;
	break;
case 8:
	titulo="de Inspecciones";
	detalleInversionesAux=detalleInversionesInspe;
	break;
case 9:
	titulo="de Correcciones Inmediatas";
	detalleInversionesAux=detalleInversionesCorreccion;
	break;
case 10:
	titulo="de Acciones Inmediatas";
	detalleInversionesAux=detalleInversionesAccion;
	break;
case 11:
	titulo="de Disposiciones de Grupos de trabajo";
	detalleInversionesAux=detalleInversionesAcuerdos;
	break;

}
if(estadoId!=4){
	for (var index = 0; index < detalleInversionesAux.length; index++) {
			if(detalleInversionesAux[index].estadoCumplimientoId==estadoId){
			$("#tblDetalleInversiones tbody").append(
					"<tr>"
					+"<td>"+detalleInversionesAux[index].nombreDetalle+"</td>"
					+"<td>"+detalleInversionesAux[index].montoInversion+"</td>"
					+"<td>"+detalleInversionesAux[index].fechaPlanificadaTexto+"</td>"
					+"<td>"+detalleInversionesAux[index].fechaRealTexto+"</td>"
					+"</tr>"
						
				);
			}
		}
		}else{
			for (var index = 0; index < detalleInversionesAux.length; index++) {
				
				$("#tblDetalleInversiones tbody").append(
						"<tr>"
						+"<td>"+detalleInversionesAux[index].nombreDetalle+"</td>"
						+"<td>"+detalleInversionesAux[index].montoInversion+"</td>"
						+"<td>"+detalleInversionesAux[index].fechaPlanificadaTexto+"</td>"
						+"<td>"+detalleInversionesAux[index].fechaRealTexto+"</td>"
						+"</tr>"
							
					);
				
			}
			
		}
	$("#tituloDetalleInversiones").html(sufijoTitulo+" "+titulo);
}

