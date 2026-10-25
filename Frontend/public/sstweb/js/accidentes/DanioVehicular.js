
var banderaedicion8;
var danioVehicularId;
var vehiculo;
var placa;
var empresa;
var inutilizable;
var estacionado;


function verDanioMaterial(){
	
	$("#mdDanioMaterial").modal('show');
}

$('#mdDanioMaterial').on('show.bs.modal', function(e) {
	cargarModalDanioMaterial();
});

function cargarModalDanioMaterial() {
	$("#btnAgregarDV").attr("onclick", "javascript:nuevoDV();");
	$("#btnCancelarDV").attr("onclick", "javascript:cancelarDV();");
	$("#btnGuardarDV").attr("onclick", "javascript:guardarDV();");
	$("#btnEliminarDV").attr("onclick", "javascript:eliminarDV();");
	
	$("#btnCancelarDV").hide();
	$("#btnAgregarDV").show();
	$("#btnEliminarDV").hide();
	$("#btnGuardarDV").hide();

	 banderaedicion8=0;
	 danioVehicularId=0;
	 vehiculo="";
	 placa="";
	 empresa="";
	 inutilizable=false;
	 estacionado=false;

	var dataParam = {
		accidenteId : accidenteId
	};

	callAjaxPost(URL + '/accidente/daniovehicular', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var list = data.list;

			$("#tblDV tbody tr").remove();

			for (index = 0; index < list.length; index++) {

				$("#tblDV tbody").append(
						"<tr id='tr" + list[index].id
								+ "' onclick='javascript:editarDV("
								+ list[index].danioVehicularId + ",&quot;"
								+ list[index].vehiculo + "&quot;,&quot;"
								+ list[index].placa + "&quot;,&quot;"
								+ list[index].empresa + "&quot;,"
								+ list[index].inutilizable + ","
								+ list[index].estacionado + ")' >"

								+ "<td id='tdvehi"
								+ list[index].danioVehicularId + "'>"
								+ list[index].vehiculo + "</td>"
								+ "<td id='tdtplaca"
								+ list[index].danioVehicularId + "'>"
								+ list[index].placa + "</td>"
								+ "<td id='tdempresa"
								+ list[index].danioVehicularId + "'>"
								+ list[index].empresa + "</td>"
								
								+ "<td id='tdinu"
								+ list[index].danioVehicularId + "'>"
								+ pasarBoolPalabra(list[index].inutilizable) + "</td>"
								+ "<td id='tdest"
								+ list[index].danioVehicularId + "'>"
								+ pasarBoolPalabra(list[index].estacionado) + "</td>"
								
								+ "</tr>");
			}

			break;
		default:
			alert("Ocurrió un error al traer las tblDV!");
		}
	});
}

function cancelarDV(){
	
	cargarModalDanioMaterial();
}
function nuevoDV(){
	
		if (!banderaedicion8) {

			$("#tblDV tbody")
					.append(
							"<tr id='0'>"
								+"<th><input type='text' id='dvVehiculo'></th>"
								+"<th><input type='text' id='dvPlaca'></th>"
								+"<th><input type='text' id='dvEmpresaProp'></th>"
								
								+"<th><input type='checkbox' id='dvInutilizable'></th>"
								+"<th><input type='checkbox' id='dvEstacionado'></th>"
								+ "</tr>");
			$("#tblDV tbody tr input").addClass("form-control");
			danioVehicularId = 0;
			$("#btnCancelarDV").show();
			$("#btnAgregarDV").hide();
			$("#btnEliminarDV").hide();
			$("#btnGuardarDV").show();
			
			banderaedicion8 = true;
		} else {
			alert("Guarde primero.");
		};
	
	
	
}

function eliminarDV(){
	var r = confirm("¿Está seguro de eliminar el danio vehicularl?");
	if (r == true) {
		var dataParam = {
				danioVehicularId : danioVehicularId,
		};

		callAjaxPost(URL + '/accidente/daniovehicular/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarModalDanioMaterial();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}

function editarDV(pdanioVehicularId, pvehiculo, pplaca,
		pempresa,pinutilizable,pestacionado) {

	if (!banderaedicion8) {
		
		
		 danioVehicularId=pdanioVehicularId ;
		 vehiculo=pvehiculo ;
		 placa=pplaca ;
		 empresa=pempresa ;
		 inutilizable=pinutilizable ;
		 estacionado=pestacionado ;

		$("#tdvehi" + danioVehicularId)
				.html(
						"<input type='text' id='dvVehiculo'>");

		$("#tdtplaca" + danioVehicularId)
		.html(
				"<input type='text' id='dvPlaca'>");
		$("#tdempresa" + danioVehicularId)
		.html(
				"<input type='text' id='dvEmpresaProp'>");
		$("#tdest" + danioVehicularId)
		.html(
				"<input type='checkbox' id='dvEstacionado'>");
		$("#tdinu" + danioVehicularId)
		.html(
				"<input type='checkbox' id='dvInutilizable'>");
		
		nombrarInput("dvVehiculo",vehiculo);
		nombrarInput("dvPlaca",placa);
		nombrarInput("dvEmpresaProp",empresa);
		
		marcarChechBox(inutilizable,"dvInutilizable");
		marcarChechBox(estacionado,"dvEstacionado");
		
		$("#tblDV tbody tr input").addClass("form-control");

		banderaedicion8 = true;
		$("#btnCancelarDV").show();
		$("#btnAgregarDV").hide();
		$("#btnEliminarDV").show();
		
		$("#btnGuardarDV").show();
		
		
	}
}


function guardarDV() {

	var campoVacio = true;

	var dvVehiculo=$("#dvVehiculo").val();
	var dvPlaca=$("#dvPlaca").val();
	var dvEmpresaProp=$("#dvEmpresaProp").val();
	var dvEstacionado=pasarBoolNumber($("#dvEstacionado").prop("checked"));
	var dvInutilizable=pasarBoolNumber($("#dvInutilizable").prop("checked"));

	
	
	if (campoVacio) {

		var dataParam = {
			accidenteId: accidenteId,
			danioVehicularId : danioVehicularId,
			vehiculo: dvVehiculo,
			placa:dvPlaca,
			empresa:dvEmpresaProp,
			inutilizable:dvInutilizable,
			estacionado:dvEstacionado
		};

		callAjaxPost(URL + '/accidente/daniovehicular/save', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarModalDanioMaterial();
						break;
					default:
						alert("Ocurrió un error al guardar la programacion!");
					}
				});
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
