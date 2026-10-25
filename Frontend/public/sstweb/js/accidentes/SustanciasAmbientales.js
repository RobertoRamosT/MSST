var banderaedicion7;
var incidenteAmbientalId;
var productoDerramado;
var cantidad;
var impacto;
var estado;
var limite;
var fechaMaxima;


function verImpactoAmbiental(){
	
	$("#mdDanioAmbiental").modal('show');
	
	
	
}

$('#mdDanioAmbiental').on('show.bs.modal', function(e) {
	
	cargarImpactos();
});

function cargarImpactos() {
	
	$("#btnAgregarIA").attr("onclick", "javascript:nuevoIA();");
	$("#btnCancelarIA").attr("onclick", "javascript:cancelarIA();");
	$("#btnGuardarIA").attr("onclick", "javascript:guardarIA();");
	$("#btnEliminarIA").attr("onclick", "javascript:eliminarIA();");
	
	$("#btnCancelarIA").hide();
	$("#btnAgregarIA").show();
	$("#btnEliminarIA").hide();
	$("#btnGuardarIA").hide();

	

	 banderaedicion7= 0 ;
	 incidenteAmbientalId= 0 ;
	 productoDerramado= "" ;
	 cantidad= 0 ;
	 impacto= "" ;
	 estado= "" ;
	 limite= "" ;
	 fechaMaxima= 0 ;
	

	var dataParam = {
		accidenteId : accidenteId
	};

	callAjaxPost(URL + '/accidente/ambiente', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var list = data.list;

			$("#tblIA tbody tr").remove();

			for (index = 0; index < list.length; index++) {

				$("#tblIA tbody").append(
						"<tr id='tr" + list[index].incidenteAmbientalId
								+ "' onclick='javascript:editarIA("
								+ list[index].incidenteAmbientalId + ",&quot;"
								+ list[index].productoDerramado + "&quot;,"
								+ list[index].cantidad + ",&quot;"
								+ list[index].impacto + "&quot;,&quot;"
								+ list[index].estadoContaminante + "&quot;,&quot;"
								+ list[index].limitePermitido + "&quot;,&quot;"
								+ list[index].fechaMaximaRemediacion + "&quot;)' >"
								+ "<td id='tdprodder"
								+ list[index].incidenteAmbientalId + "'>"
								+ list[index].productoDerramado + "</td>"
								+ "<td id='tdcant"
								+ list[index].incidenteAmbientalId + "'>"
								+ list[index].cantidad + "</td>"
								+ "<td id='tdimpac"
								+ list[index].incidenteAmbientalId + "'>"
								+ list[index].impacto + "</td>"
								+ "<td id='tdestado"
								+ list[index].incidenteAmbientalId + "'>"
								+ list[index].estadoContaminante + "</td>"
								+ "<td id='tdlimite"
								+ list[index].incidenteAmbientalId + "'>"
								+ list[index].limitePermitido + "</td>"
								+ "<td id='tdfechamax"
								+ list[index].incidenteAmbientalId + "'>"
								+ list[index].fechaMaximaRemediacion + "</td>"
								+ "</tr>");
			}
			verCategAcordeInforme();
			break;
		default:
			alert("Ocurrió un error al traer las programaciones!");
		}
	});
	
	
}

function nuevoIA() {
	
	if( $('#selTipoInf').val()==1){
	if (!banderaedicion7) {

		$("#tblIA tbody")
				.append(
						"<tr id='0'>"
							+"<th><input type='text' id='inputProd'></th>" 
							+"<th><input type='text' id='inputCant' style='width:80px'></th>"
							+"<th><input type='text' id='inputImp'></th>"
							
							+ "</tr>");
		incidenteAmbientalId = 0;
		$("#btnCancelarIA").show();
		$("#btnAgregarIA").hide();
		$("#btnEliminarIA").hide();
		$("#btnGuardarIA").show();
	
		banderaedicion7 = true;
	} else {
		alert("Guarde primero.");
	}
	}
	
	if($('#selTipoInf ').val()==2){
		if (!banderaedicion7) {

			$("#tblIA tbody")
					.append(
							"<tr id='0'>"
								+"<th><input type='text' id='inputProd'></th>" 
								+"<th><input type='text' id='inputCant' style='width:80px'></th>"
								+"<th><input type='text' id='inputImp'></th>"
								+"<th><input type='text' id='inputEst'></th>" 
								+"<th><input type='text'  id='inputLim' style='width:80px'></th>" 
								+"<th><input type='DATE' id='inputFechMax'></th>"
								+ "</tr>");
			incidenteAmbientalId = 0;
			$("#btnCancelarIA").show();
			$("#btnAgregarIA").hide();
			$("#btnEliminarIA").hide();
			$("#btnGuardarIA").show();
			
			banderaedicion7 = true;
		} else {
			alert("Guarde primero.");
		}
	
	}
	$("#tblIA tbody tr input").addClass("form-control");
	
	}

function cancelarIA(){
	cargarImpactos();
}
function eliminarIA(){
	var r = confirm("¿Está seguro de eliminar el impacto ambiental?");
	if (r == true) {
		var dataParam = {
			incidenteAmbientalId : incidenteAmbientalId,
		};

		callAjaxPost(URL + '/accidente/ambiente/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarImpactos();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}

function editarIA(pincidenteAmbientalId, pproductoDerramado, pcantidad,
		pimpacto,pestado,plimite,pfechaMaxima) {

	if (!banderaedicion7) {
		
		
		 incidenteAmbientalId= pincidenteAmbientalId;
		 productoDerramado= pproductoDerramado ;
		 cantidad= pcantidad ;
		 impacto= pimpacto ;
		 estado= pestado ;
		 limite= plimite ;
		 fechaMaxima= pfechaMaxima ;

		$("#tdprodder" + incidenteAmbientalId)
				.html(
						"<input type='text' id='inputProd'>");

		$("#tdcant" + incidenteAmbientalId)
		.html(
				"<input type='text' id='inputCant'>");
		$("#tdimpac" + incidenteAmbientalId)
		.html(
				"<input type='text' id='inputImp'>");
		$("#tdestado" + incidenteAmbientalId)
		.html(
				"<input type='text' id='inputEst'>");
		$("#tdlimite" + incidenteAmbientalId)
		.html(
				"<input type='text' id='inputLim'>");
		$("#tdfechamax" + incidenteAmbientalId)
		.html(
				"<input type='date' id='inputFechMax'>");
		$("#tblIA tbody tr input").addClass("form-control");
		$("#inputProd").val(productoDerramado);
		$("#inputCant").val(cantidad);
		$("#inputImp").val(impacto);
		$("#inputEst").val(estado);
		$("#inputLim").val(limite);
		$("#inputFechMax").val(fechaMaxima);

		
		
		banderaedicion7 = true;
		$("#btnCancelarIA").show();
		$("#btnAgregarIA").hide();
		$("#btnEliminarIA").show();
		
		$("#btnGuardarIA").show();
		
		
	}
}

function guardarIA() {

	var campoVacio = true;

	var inputProd=$("#inputProd").val();
	var inputCant=$("#inputCant").val();
	var inputImp=$("#inputImp").val();
	var inputEst=$("#inputEst").val();
	var inputLim=$("#inputLim").val();
	var inputFechMax=$("#inputFechMax").val();
	
	if(inputFechMax.length == 0){
		var d = new Date();

		var month = d.getUTCMonth()+1;
		var day = d.getUTCDate();

		var fechaHoy = d.getUTCFullYear() + '-' +
		    (month<10 ? '0' : '') + month + '-' +
		    (day<10 ? '0' : '') + day;
		inputFechMax = fechaHoy;
	}
	
	if(inputCant.length == 0){
		inputCant = 0.00;
	}
	if (campoVacio) {

		var dataParam = {
			accidenteId: accidenteId,
			incidenteAmbientalId : incidenteAmbientalId,
			productoDerramado : inputProd,
			cantidad : inputCant,
			impacto : inputImp,
			estadoContaminante: inputEst,
			limitePermitido: inputLim,
			fechaMaximaRemediacion: inputFechMax
		};

		callAjaxPost(URL + '/accidente/ambiente/save', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarImpactos();
						break;
					default:
						alert("Ocurrió un error al guardar la programacion!");
					}
				});
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
