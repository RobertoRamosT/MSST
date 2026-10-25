var actividadIdEdicion;
var nombreActividadEdicion;
var states = null;
var nuevoActividadAutomatico = false;
var actividadPuestoAux;
function listarActividades(puestoId) {
	actividadPuestoAux=puestoId;
	
	var dataParam = {
			positionId : puestoId
	};

	callAjaxPost(URL + '/actividad', dataParam, procesarListarActividades);
}

var listActFull;
function procesarListarActividades(data) {

	switch (data.CODE_RESPONSE) {
	case "05":
		banderaEdicion = false;
		$("#btnAsociadoMdf").hide();
		deshabilitarBotonesEdicion();
		var isIpercDirected=(parseInt(tipoMdfId)==1?1:0);
		$("#btnGuardarNuevos").attr("onclick",
				"javascript:guardarMasivoPlano(2, " + actividadPuestoAux + ", " +
						"procesarResultadoListadoActividad,"+isIpercDirected+");");
		$("#btnDetalle").hide();
		$("#btnNuevos").show();
		$("#btnNuevo").attr("onclick", "nuevaActividad()");
		$("#btnCancelar").attr("onclick", "cancelarActividad()");
		$("#btnGuardar").attr("onclick", "guardarActividad()");
		$("#btnEliminar").attr("onclick","eliminarActividad()");
		$("#btnPreview").show();
		$("#btnAsociarNuevaDivision").hide();
		$("#btnDescargar").hide();
		$("#btnInformeAnual").hide();
		$("#btnAsignarResp").hide();
		$("#btnTransferPuesto").hide();
		actividadIdEdicion = 0;
		actividadIdReal=0;
		var list = data.list;
listActFull=list;
		$("#tblMatrices tbody tr").remove();
		$("#h2Titulo")
				.html(
						"<a onclick='javascript:listarMatrices();' href='#'>"+getSession("gestopunidad")+"("+nombreMatrizEdicion+")</a> : "
								+ "<a onclick='javascript:listarDivisionesMdf();' href='#'>"+getSession("gestopdivision")+"("+nombreDivisionEdicion+")</a> : "
								+ "<a onclick='javascript:listarAreasMdf();' href='#'>"+getSession("gestoparea")+"("+nombreAreaEdicion+")</a> : "
								+ "<a onclick='javascript:listarPuestosMdf();' href='#'>Puestos("+nombrePuestoEdicion+")</a> : Actividades");

		$("#thMatriz").html("Actividades");

		for (index = 0; index < list.length; index++) {

			$("#tblMatrices tbody").append(

					"<tr id='trm" + list[index].positionActivityId
							+ "' onclick='javascript:editarActividad("
							+ list[index].positionActivityId + ","+list[index].activityId+")' >"
							+ "<td id='tdm" + list[index].positionActivityId
							+ "'>"

							+ "<div class='row'>"
							+ "<div class='col-md-3' id='div"
							+ list[index].positionActivityId + "'>"
							+ list[index].activityName + "</div>" + "</div>"

							+ "</td>" + "</tr>");
		}
		formatoCeldaSombreable(true);
		if (nuevoActividadAutomatico) {
			nuevaActividad();
		}

		break;
	default:
		alert("Ocurrió un error al traer las actividades!");
	}

}

function nuevaActividad() {
	 var ultimoOpcion;
	 formatoCeldaSombreable(false);
	if (!banderaEdicion) {
		nuevoPuestoAutomatico = false;
		var dataParam = {
			};

		callAjaxPost(URL + '/actividad/maestra', dataParam,
				disenoNuevaActividad);

		actividadIdEdicion = 0;
		habilitarBotonesNuevo();
		banderaEdicion = true;
	} else {
		alert("Guarde primero la actividad.");
	}
}
var actividadIdReal;
function editarActividad(actividadId,actId) {
	if (!banderaEdicion) {
		actividadIdEdicion = actividadId;
		actividadIdReal=actId;
		formatoCeldaSombreable(false);
		var dataParam = {
			
		};

		callAjaxPost(URL + '/actividad/maestra', dataParam,
				disenoEditarActividad);
		habilitarBotonesEdicion();
		if(tipoMdfId!=1){
			$("#btnDetalle").show();
			$("#btnDetalle").attr("onclick", "listarTareasMdf()");

		}
		$("#btnAsociadoMdf").show();
		$("#btnAsociarNuevaDivision").show().attr("onclick", "verModalNuevaAsociarActividad()");
		
		tareaIdEdicion=null;
		pasoIdreal=null;
		banderaEdicion = true;
	}

}
function verModalNuevaAsociarActividad(){
	$("#modalAsociarNuevo").modal("show");
	
	var btnGuaradr="<button id='btnGuardarNuevoAsociado' type='button' class='btn btn-success'"
	+"	title='Guardar'>"
+"	<i class='fa fa-floppy-o fa-2x'></i>"
+"</button>"
var divisionesActuales=[];
	var dataParam = {
			matrixId : idMatrizEdicion
	};

	callAjaxPost(URL + '/division', dataParam, function(data){
		divisionesActuales=data.list;
		var selNuevaDivision= crearSelectOneMenuOblig("selNuevaDivision", "verAreasDivisionNuevaActividad()", divisionesActuales, "", "divisionId",
		"divisionName");
		$("#modalAsociarNuevo").find(".modal-title").html("Asociar nuevo puesto")
$("#modalAsociarNuevo").find(".modal-body")
.html(btnGuaradr+"<br>" +
		"<br>Seleccionar "+getSession("gestopdivision")+" a:<br>"+selNuevaDivision
		+"<br>"+getSession("gestoparea")+":<div  id='divNuevaArea'></div>"
		+"<br>Puesto:<div  id='divNuevoPuesto'></div>");
		verAreasDivisionNuevaActividad();
$("#btnGuardarNuevoAsociado").attr("onclick","guardarNuevoAsociadoActividad()")
	});
	
}
function verAreasDivisionNuevaActividad(){
	var areasActuales=[];
	var dataParam = {
			divisionId : $("#selNuevaDivision").val()
		};
	$("#divNuevaArea").html("Loading...");
		callAjaxPost(URL + '/area', dataParam, function(data){
			areasActuales=data.list;
			var selNuevaArea= crearSelectOneMenuOblig("selNuevaArea", "verPuestosAreaNuevaActividad()", areasActuales, "", "areaId",
			"areaName");
			$("#divNuevaArea").html(selNuevaArea);
			verPuestosAreaNuevaActividad();
		});
}
function verPuestosAreaNuevaActividad(){
	var puestosActuales=[];
	 
	var dataParam = {
			areaId : $("#selNuevaArea").val()
	};
	$("#divNuevoPuesto").html("Loading...");
		callAjaxPost(URL + '/puesto', dataParam, function(data){
			puestosActuales=data.list;
			var selNuevoPuesto= crearSelectOneMenuOblig("selNuevoPuesto", "", puestosActuales, "", "positionId",
			"positionName");
			$("#divNuevoPuesto").html(selNuevoPuesto);
		});
}
function guardarNuevoAsociadoActividad(){
	var r = confirm("¿Está seguro de cambiar el puesto de la actividad?");
	if (r == true) {
		var dataParam = {
				positionActivityId : actividadIdEdicion,
				positionId:$("#selNuevoPuesto").val()
		};

		callAjaxPost(URL + '/actividad/puesto/save', dataParam,
				procesarEliminarActividad);
	}
}
function disenoEditarActividad(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		states = data.list;
		var name = $("#div" + actividadIdEdicion).text();
		nombreActividadEdicion=name;
		$("#div" + actividadIdEdicion)
				.html(
						"<input type='text' id='inputActividad' class='form-control' placeholder='Actividad' autofocus='true' style='width:300px;' value='"
								+ name + "'>");
		
		// inicializarAutocompletar();
		break;
	default:
		alert("Reducir longitud de caracteres ingresados");
	}
}

function disenoNuevaActividad(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		states = data.list;
		$("#tblMatrices tbody")
				.append(
						"<tr id='0'><td><input type='text' id='inputActividad' class='form-control' placeholder='Actividad' style='width:300px;'></td>"
								+ "</tr>");
		$("#inputActividad").keypress(function(e) {
			if (e.which == 13) {
				nuevoActividadAutomatico = true;
				guardarActividad();
			}
		});
		$("#inputActividad").focus();
		
		// inicializarAutocompletar();
		break;
	default:
		alert("Ocurrió un error al traer las actividades!");
	}
}

function guardarActividad() {

	var campoVacio = true;

	if ($("#inputActividad").val().length == 0) {
		campoVacio = false;
	}

	if (campoVacio) {

		var dataParam = {
			activityId:actividadIdReal,
			activityName : $("#inputActividad").val().toUpperCase(),
			positionActivityId : actividadIdEdicion,
			positionId : puestoIdEdicion,
			isDirectedToIperc:(parseInt(tipoMdfId)==1?1:0)
		};

		callAjaxPost(URL + '/actividad/save', dataParam,
				procesarGuardarActividad);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarActividad(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#tblMatrices tbody tr").remove();
		listarActividades(puestoIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Reducir longitud de caracteres ingresados");
	}
}

function cancelarActividad() {
	// listarTareasEdicion(idMatrizEdicion);
	nuevoActividadAutomatico = false;
	listarActividades(puestoIdEdicion);
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
}

function eliminarActividad(){
	var r = confirm("¿Está seguro de eliminar la actividad?");
	if (r == true) {
		var dataParam = {
			activityId:actividadIdReal,
			positionActivityId : actividadIdEdicion
		};
		console.log(dataParam);
		callAjaxPost(URL + '/actividad/delete', dataParam,
				procesarEliminarActividad);
	}

}

function procesarEliminarActividad(data) {
switch (data.CODE_RESPONSE) {
case "05":
var numControles=data.numControles;
$("#modalAsociarNuevo").modal("show");
if(numControles>0){
	alert("Elimine de IPERC "+numControles+" control(es) ");
}else{
	
	listarActividades(puestoIdEdicion);
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
}
	
	break;
default:
	alert("Ocurrió un error al eliminar la actividad!");
}
}

function procesarResultadoListadoActividad(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if (data.repetidos > 0) {
			alert("No se pudo subir el listado debido a que algunos datos ya existen. Total: "
					+ data.repetidos);
		} else {
			$('#mdNuevos').modal('hide');
		}

		listarActividades(puestoIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Ocurrió un error al guardar listado!");
	}
}