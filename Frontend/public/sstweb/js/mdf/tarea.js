var tareaIdEdicion;
var nombreTareaEdicion;
var tareas = null;
var nuevoTareaAutomatico = false;
var actividadTareaAux;
function listarTareas(actividadId) {
	actividadTareaAux=actividadId;
	var dataParam = {
		positionActivityId : actividadId
	};

	callAjaxPost(URL + '/tarea', dataParam, procesarListarTareas);
}

function procesarListarTareas(data) {

	switch (data.CODE_RESPONSE) {
	case "05":
		banderaEdicion = false;
		deshabilitarBotonesEdicion();
		$("#btnAsociadoMdf").hide();
		var isIpercDirected=(parseInt(tipoMdfId)==2?1:0);
		$("#btnGuardarNuevos").attr("onclick",
				"javascript:guardarMasivoPlano(3, " + actividadTareaAux + ", " +
						"procesarResultadoListadoTarea,"+isIpercDirected+");");
		$("#btnNuevos").show();
		$("#btnDetalle").hide();
		$("#btnAsociarNuevaDivision").hide();
		$("#btnNuevo").attr("onclick", "nuevaTarea()");
		$("#btnCancelar").attr("onclick", "cancelarTarea()");
		$("#btnGuardar").attr("onclick", "guardarTarea()");
		$("#btnEliminar").attr("onclick","eliminarTarea()");
		$("#btnPreview").show();
		$("#btnDescargar").hide();
		$("#btnInformeAnual").hide();
		$("#btnAsignarResp").hide();
		$("#btnTransferPuesto").hide();
		tareaIdEdicion = 0;
		taskIdreal=0;
		var list = data.list;

		$("#tblMatrices tbody tr").remove();

		$("#h2Titulo")
				.html(
						"<a onclick='javascript:listarMatrices();' href='#'>"+getSession("gestopunidad")+"("+nombreMatrizEdicion+")</a> : "
								+ "<a onclick='javascript:listarDivisionesMdf();' href='#'>"+getSession("gestopdivision")+"("+nombreDivisionEdicion+")</a> : "
								+ "<a onclick='javascript:listarAreasMdf();' href='#'>"+getSession("gestoparea")+"("+nombreAreaEdicion+")</a> : "
								+ "<a onclick='javascript:listarPuestosMdf();' href='#'>Puestos("+nombrePuestoEdicion+")</a> : "
								+ "<a onclick='javascript:listarActividadesMdf();' href='#'>Actividades("+nombreActividadEdicion+")</a> : Tareas");

		$("#thMatriz").html("Tareas");

		for (index = 0; index < list.length; index++) {

			$("#tblMatrices tbody").append(

					"<tr id='trm" + list[index].activityTaskId
							+ "' onclick='javascript:editarTarea("
							+ list[index].activityTaskId + ","+list[index].taskId+")' >"
							+ "<td id='tdm" + list[index].activityTaskId
							+ "'>"

							+ "<div class='row'>"
							+ "<div class='col-md-3' id='div"
							+ list[index].activityTaskId + "'>"
							+ list[index].taskName + "</div>" + "</div>"

							+ "</td>" + "</tr>");
		}
		formatoCeldaSombreable(true);
		if (nuevoTareaAutomatico) {
			nuevaTarea();
		}

		break;
	default:
		alert("Ocurrió un error al traer las tareas!");
	}

}

function nuevaTarea() {
	if (!banderaEdicion) {
		formatoCeldaSombreable(false);
		nuevoTareaAutomatico = false;
		var dataParam = {
			};

		callAjaxPost(URL + '/tarea/maestra', dataParam,
				disenoNuevaTarea);

		tareaIdEdicion = 0;
		habilitarBotonesNuevo();
		banderaEdicion = true;
	} else {
		alert("Guarde primero la tarea.");
	}
}

function disenoNuevaTarea(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		tareas = data.list;
		$("#tblMatrices tbody")
				.append(
						"<tr id='0'><td><input type='text' id='inputTarea' class='form-control' placeholder='Tarea' autofocus='true' style='width:300px;'></td>"
								+ "</tr>");
		
		$("#inputTarea").keypress(function(e) {
			if (e.which == 13) {
				nuevoTareaAutomatico = true;
				guardarTarea();
			}
		});
		$("#inputTarea").focus();
		// inicializarAutocompletar();
		break;
	default:
		alert("Ocurrió un error al traer las tareas!");
	}
}
 var taskIdreal;
function editarTarea(taskId,ptaskIdreal) {
	if (!banderaEdicion) {
		tareaIdEdicion = taskId;
		taskIdreal=ptaskIdreal;
		var dataParam = {
			};

		callAjaxPost(URL + '/tarea/maestra', dataParam,
				disenoEditarTarea);
		habilitarBotonesEdicion();
		if(tipoMdfId!=2){
			$("#btnDetalle").show();
			$("#btnDetalle").attr("onclick", "listarPasosMdf()");

		}
	
		formatoCeldaSombreable(false);
		$("#btnAsociadoMdf").show();
		pasoIdreal=null;banderaEdicion = true;
	}
}

function disenoEditarTarea(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		tareas = data.list;
		var name = $("#div" + tareaIdEdicion).text();
		nombreTareaEdicion=name;
		$("#div" + tareaIdEdicion)
				.html(
						"<input type='text' id='inputTarea' class='form-control' placeholder='Tarea' autofocus='true' style='width:300px;' value='"
								+ name + "'>");
	
		// inicializarAutocompletar();
		break;
	default:
		alert("Ocurrió un error al traer las tareas!");
	}
}

function guardarTarea() {

	var campoVacio = true;
	var isIpercDirected=(parseInt(tipoMdfId)==2?1:0);
	if ($("#inputTarea").val().length == 0) {
		campoVacio = false;
	}

	if (campoVacio) {

		var dataParam = {
			taskName : $("#inputTarea").val().toUpperCase(),
			taskId:taskIdreal,
			activityTaskId : tareaIdEdicion,
			positionActivityId : actividadIdEdicion,
			isDirectedToIperc:isIpercDirected
		};

		callAjaxPost(URL + '/tarea/save', dataParam,
				procesarGuardarTarea);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarTarea(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#tblMatrices tbody tr").remove();
		listarTareas(actividadIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Reducir longitud de caracteres ingresados");
	}
}

function cancelarTarea() {
	nuevoTareaAutomatico = false;
	listarTareas(actividadIdEdicion);
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
}


function eliminarTarea(){
	var r = confirm("¿Está seguro de eliminar la tarea?");
	if (r == true) {
		var dataParam = {
			taskId:taskIdreal,
			activityTaskId : tareaIdEdicion,
			mdfTypeId:tipoMdfId
		};

		callAjaxPost(URL + '/tarea/delete', dataParam,
				procesarEliminarTarea);
	}

}

function procesarEliminarTarea(data) {
switch (data.CODE_RESPONSE) {
case "05":
	var numControles=data.numControles;
	if(numControles>0){
		alert("Elimine de IPERC "+numControles+" controles.");
	}else{
	listarTareas(actividadIdEdicion);
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
	}
	break;
default:
	alert("Hay elementos relacionados a la tarea");
}
}

function procesarResultadoListadoTarea(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if (data.repetidos > 0) {
			alert("No se pudo subir el listado debido a que algunos datos ya existen. Total: "
					+ data.repetidos);
		} else {
			$('#mdNuevos').modal('hide');
		}

		listarTareas(actividadIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Ocurrió un error al guardar listado!");
	}
}