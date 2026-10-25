var pasoIdEdicion;
var pasos = null;
var nuevoPasoAutomatico = false;
var pasoIdreal;
var tareaPasoAux;
function listarPasos(actTareaId) {
	tareaPasoAux=actTareaId;
	var dataParam = {
		activityTaskId : actTareaId
	};

	callAjaxPost(URL + '/paso', dataParam, procesarListarPaso);
}

function procesarListarPaso(data) {

	switch (data.CODE_RESPONSE) {
	case "05":
		banderaEdicion = false;
		deshabilitarBotonesEdicion();$("#btnAsociadoMdf").hide();
		$("#btnGuardarNuevos").attr("onclick",
				"javascript:guardarMasivoPlano(4, " + tareaPasoAux + "," +
						" procesarResultadoListadoPaso,1);");
		$("#btnNuevos").show();
		$("#btnDetalle").hide();
		$("#btnAsociarNuevaDivision").hide();
		$("#btnNuevo").attr("onclick", "nuevoPaso()");
		$("#btnCancelar").attr("onclick", "cancelarPaso()");
		$("#btnGuardar").attr("onclick", "guardarPaso()");
		$("#btnEliminar").attr("onclick", "eliminarPaso()");
		$("#btnPreview").show();
		$("#btnDescargar").hide();
		$("#btnInformeAnual").hide();
		$("#btnAsignarResp").hide();
		$("#btnTransferPuesto").hide();
		pasoIdEdicion = 0;
		pasoIdreal=0;
		var list = data.list;

		$("#tblMatrices tbody tr").remove();

		$("#h2Titulo")
				.html(
						"<a onclick='javascript:listarMatrices();' href='#'>"+getSession("gestopunidad")+"("
								+ nombreMatrizEdicion
								+ ")</a> : "
								+ "<a onclick='javascript:listarDivisionesMdf();' href='#'>"+getSession("gestopdivision")+"("
								+ nombreDivisionEdicion
								+ ")</a> : "
								+ "<a onclick='javascript:listarAreasMdf();' href='#'>"+getSession("gestoparea")+"("
								+ nombreAreaEdicion
								+ ")</a> : "
								+ "<a onclick='javascript:listarPuestosMdf();' href='#'>Puestos("
								+ nombrePuestoEdicion
								+ ")</a> : "
								+ "<a onclick='javascript:listarActividadesMdf();' href='#'>Actividades("
								+ nombreActividadEdicion
								+ ")</a> : "
								+ "<a onclick='javascript:listarActividadesMdf();' href='#'>Tareas("
								+ nombreTareaEdicion + ")</a> : Pasos");

		$("#thMatriz").html("Pasos");

		for (index = 0; index < list.length; index++) {

			$("#tblMatrices tbody").append(

					"<tr id='trm" + list[index].taskStepId
							+ "' onclick='javascript:editarPaso("
							+ list[index].taskStepId + ","+list[index].stepId +")' >" + "<td id='tdm"
							+ list[index].taskStepId + "'>"

							+ "<div class='row'>"
							+ "<div class='col-md-3' id='div"
							+ list[index].taskStepId + "'>" + list[index].stepName
							+ "</div>" + "</div>"

							+ "</td>" + "</tr>");
		}
		if (nuevoPasoAutomatico) {
			nuevoPaso();
		}
		formatoCeldaSombreable(true);

		break;
	default:
		alert("Ocurrió un error al traer los pasos!");
	}

}

function nuevoPaso() {
	if (!banderaEdicion) {
		nuevoPasoAutomatico = false;
		var dataParam = {
				};

		callAjaxPost(URL + '/paso/maestra', dataParam,
				disenoNuevoPaso);

		pasoIdEdicion = 0;
		habilitarBotonesNuevo();
		banderaEdicion = true;
	} else {
		alert("Guarde primero la paso.");
	}
}

function disenoNuevoPaso(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		pasos = data.list;
		formatoCeldaSombreable(false);
		$("#tblMatrices tbody")
				.append(
						"<tr id='0'><td><input type='text' id='inputPaso' class='form-control' placeholder='Paso' autofocus='true' style='width:300px;'></td>"
								+ "</tr>");
		
		$("#inputPaso").keypress(function(e) {
			if (e.which == 13) {
				nuevoPasoAutomatico = true;
				guardarPaso();
			}
		});
		$("#inputPaso").focus();
		// inicializarAutocompletar();
		break;
	default:
		alert("Ocurrió un error al traer las pasos!");
	}
}

function editarPaso(taskStepId,ppasoIdreal) {
	if (!banderaEdicion) {
		pasoIdEdicion = taskStepId;
		pasoIdreal=ppasoIdreal;
		var dataParam = {
			};

		callAjaxPost(URL + '/paso/maestra', dataParam,
				disenoEditarPaso);
		habilitarBotonesEdicion();
		$("#btnAsociadoMdf").show();
		banderaEdicion = true;
	}
}

function disenoEditarPaso(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		pasos = data.list;
		var name = $("#div" + pasoIdEdicion).text();
		$("#div" + pasoIdEdicion)
				.html(
						"<input type='text' id='inputPaso' class='form-control' placeholder='Paso' autofocus='true' style='width:300px;' value='"
								+ name + "'>");
		
		formatoCeldaSombreable(false);
		// inicializarAutocompletar();
		break;
	default:
		alert("Ocurrió un error al traer los pasos!");
	}
}

function guardarPaso() {

	var campoVacio = true;

	if ($("#inputPaso").val().length == 0) {
		campoVacio = false;
	}

	if (campoVacio) {

		var dataParam = {
			stepName : $("#inputPaso").val().toUpperCase(),
			stepId:pasoIdreal,
			taskStepId : pasoIdEdicion,
			activityTaskId : tareaIdEdicion
		};

		callAjaxPost(URL + '/paso/save', dataParam, procesarGuardarPaso);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarPaso(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#tblMatrices tbody tr").remove();
		listarPasos(tareaIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Reducir longitud de caracteres ingresados");
	}
}

function cancelarPaso() {
	listarPasos(tareaIdEdicion);
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
}

function eliminarPaso(){
	var r = confirm("¿Está seguro de eliminar el paso?");
	if (r == true) {
		var dataParam = {
			taskStepId : pasoIdEdicion,
			stepId:pasoIdreal
		};

		callAjaxPost(URL + '/paso/delete', dataParam,
				procesarEliminarPaso);
	}

}

function procesarEliminarPaso(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var numControles=data.numControles;
		if(numControles>0){
			alert("Elimine de IPERC "+numControles+" controles.");

		
	}else{
		listarPasos(tareaIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
	}
		break;
	default:
		alert("Elimine primero los elementos relacionados al paso");
	}
}

function procesarResultadoListadoPaso(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if (data.repetidos > 0) {
			alert("No se pudo subir el listado debido a que algunos datos ya existen. Total: "
					+ data.repetidos);
		} else {
			$('#mdNuevos').modal('hide');
		}

		listarPasos(tareaIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Ocurrió un error al guardar listado!");
	}
}