var areaIdEdicion;
var nombreAreaEdicion;
var listFullAreaTrabajadores;
var listaFullAreas;
function procesarResultadoListadoAreas(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if (data.repetidos > 0) {
			alert("No se pudo subir el listado debido a que algunos datos ya existen. Total: "
					+ data.repetidos);
		} else {
			$('#mdNuevos').modal('hide');
		}

		listarAreas(divisionIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Ocurrió un error al guardar listado!");
	}
}
function listarAreas(divisionId) {
	$("#btnGuardarNuevos").attr("onclick",
			"javascript:guardarMasivoPlano(5, " + divisionId + ", " +
					"procesarResultadoListadoAreas,0);");
	
	
	
	
	
	banderaEdicion = false;
	deshabilitarBotonesEdicion();
	$("#btnDetalle").hide();
	$("#btnNuevos").show();
	$("#btnAsociadoMdf").hide();
	
	$("#btnAsociarNuevaDivision").hide();
	$("#btnNuevo").attr("onclick", "nuevaArea()");
	$("#btnCancelar").attr("onclick", "cancelarArea()");
	$("#btnGuardar").attr("onclick", "guardarArea()");
	$("#btnEliminar").attr("onclick","eliminarArea()");
	$("#btnPreview").show();
	$("#btnDescargar").hide();
	$("#btnInformeAnual").hide();
	$("#btnAsignarResp").hide();
	$("#btnTransferPuesto").hide();
	areaIdEdicion = 0;

	var dataParam = {
		divisionId : divisionId
	};

	callAjaxPost(URL + '/area', dataParam, procesarListarAreas);
}

function procesarListarAreas(data) {

	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;
		listaFullAreas=list;
		$("#tblMatrices tbody tr").remove();
		$("#h2Titulo")
				.html("<a onclick='javascript:listarMatrices();' href='#'>"+getSession("gestopunidad")+"("+nombreMatrizEdicion+")</a> : "
								+ "<a onclick='javascript:listarDivisionesMdf();' href='#'>"+getSession("gestopdivision")+"("+nombreDivisionEdicion+")</a> > "+getSession("gestoparea"));

		$("#thMatriz").html(getSession("gestoparea"));

		for (index = 0; index < list.length; index++) { 
			$("#tblMatrices tbody").append( 
					"<tr id='trm" + list[index].areaId
							+ "' onclick='javascript:editarArea("
							+ list[index].areaId + ")' >" + 
						"<td id='tdm"
							+ list[index].areaId + "'>"

							+ "<div class='row'>"
								+"<div class='col-md-3' id='div"
									+ list[index].areaId + "'>" + list[index].areaName
								+"</div>" 
							+ "</div>"
							+"<div class='row' id='trabInterArea"+list[index].areaId +"'>" + 
								"<div class='col-md-3'>"
									+"Trabajadores Interesados<br> ("+ list[index].areaSupervisoresNombre +
								")</div>" 
							+"</div>"
						+ "</td>" + 
					"</tr>");
		};
		formatoCeldaSombreable(true);
		break;
	default:
		alert("Ocurrió un error al traer las areas!");
	}

}
// //////////////////////////////////////////////////////////////////////////////////////////////////////
function nuevaArea() {
	if (!banderaEdicion) {
		formatoCeldaSombreable(false);
		$("#tblMatrices tbody")
				.append(
						"<tr id='0'><td><input type='text' id='inputArea' class='form-control'  " +
						" autofocus='true' value='"+nombreDivisionEdicion+"'></td>"
								+ "</tr>");
		areaIdEdicion = 0;
		habilitarBotonesNuevo();
		banderaEdicion = true;
	} else {
		alert("Guarde primero el area.");
	}
}

function guardarArea() {

	var campoVacio = true;
	var nuevaEmpresa = 0;

	if ($("#inputArea").val().length == 0) {
		campoVacio = false;
	}
	var listAreaTrabs=$("#selAreaTrab").val(); 
	var listAreaTrabsFinal=[];
	if(listAreaTrabs!=null)
	{
		listAreaTrabs.forEach(function(val)
		{
			listAreaTrabsFinal.push({trabajadorId:parseInt(val) ,nivelArea:{id : 1}});
		});
	}
	if (campoVacio) {

		var dataParam = {
				areaName : $("#inputArea").val().toUpperCase(),
			areaId : areaIdEdicion,
			divisionId : divisionIdEdicion,
			listTrabajadorArea:listAreaTrabsFinal
		};

		callAjaxPost(URL + '/area/normal/save', dataParam, procesarGuardarArea);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarArea(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#tblMatrices tbody tr").remove();
		listarAreas(divisionIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	
	default:
		alert("Reducir longitud de caracteres ingresados");
	}
}

function cancelarArea() {
	// listarTareasEdicion(idMatrizEdicion);
	listarAreas(divisionIdEdicion);
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
}

function editarArea(areaId) {
	if (!banderaEdicion) {
		var indexAreaEdicion=0; 
		listaFullAreas.forEach(function(val,index)
		{
			if(val.areaId==areaId)
			{
				indexAreaEdicion=index; 
			}
		}); 
		areaIdEdicion = areaId;
		formatoCeldaSombreable(false);
		var name = $("#div" + areaId).text();
		nombreAreaEdicion=name;
		$("#div" + areaId)
				.html(
						"<input type='text' id='inputArea' class='form-control'   value='"
								+ name + "'>"+"<br><div id='areatrab'><div>");
		$("#trabInterArea"+areaIdEdicion).remove();
		callAjaxPost(URL + '/area/trabajadores', {areaId:areaIdEdicion},
				function(data){
					if(data.CODE_RESPONSE=="05"){
						listFullAreaTrabajadores=data.listTrabArea; 
						var msg;
						if(listFullAreaTrabajadores.length!=0)
						{
							msg="Trabajadores de la "+getSession("gestoparea"); 
							var listaAreaTrab=listaFullAreas[indexAreaEdicion].areaSupervisoresId; //Trabajadores de la Area
							var listaIdsAreaTrab=listaAreaTrab.split(",");
							listaIdsAreaTrab.forEach(function (val)
							{
								listFullAreaTrabajadores.forEach(function (val1){
									if(val==val1.trabajadorId)
									{
										val1.selected=1;
									}
								});
							});
							crearSelectOneMenuObligMultipleCompleto("selAreaTrab","",
									listFullAreaTrabajadores,"trabajadorId","trabajadorNombre","#areatrab",msg);	
						}
						else 
						{
							msg="Sin Trabajadores para Seleccionar ..."; 
							$("#areatrab select").remove();
							$("#areatrab div").remove();
							$("#areatrab input").remove();
							$("#areatrab").append(
									"<input class='form-control' type='text' value='"+msg+"' disabled >");
						}
					}
					else{
						console.log("NOPNPO")
					}
			}); 
		habilitarBotonesEdicion();
		$("#btnDetalle").show();
		$("#btnDetalle").attr("onclick", "listarPuestosMdf()");
		$("#btnAsociadoMdf").show();
		$("#btnAsociarNuevaDivision").show().attr("onclick", "verModalNuevaAsociar()");
		banderaEdicion = true;
		
		
		puestoIdEdicion=null;
		actividadIdEdicion=null;
		tareaIdEdicion=null;
		pasoIdreal=null;
	}

}
function verModalNuevaAsociar(){
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
		var selNuevaDivision= crearSelectOneMenuOblig("selNuevaDivision", "", divisionesActuales, "", "divisionId",
		"divisionName");
$("#modalAsociarNuevo").find(".modal-body")
.html(btnGuaradr+"<br><br>Cambiar a:<br>"+selNuevaDivision);
$("#btnGuardarNuevoAsociado").attr("onclick","guardarNuevoAsociado()")
	});
	
}
function guardarNuevoAsociado(){
	var r = confirm("¿Está seguro de cambiar la divisón del area?");
	if (r == true) {
		var dataParam = {
				areaId : areaIdEdicion,
				divisionId:$("#selNuevaDivision").val()
		};

		callAjaxPost(URL + '/area/division/save', dataParam,
				procesarEliminarArea);
	}
}
function eliminarArea(){
	var r = confirm("¿Está seguro de eliminar "+getSession("gestopdivision")+"?");
	if (r == true) {
		var dataParam = {
				areaId : areaIdEdicion,
				mdfTypeId:tipoMdfId
		};

		callAjaxPost(URL + '/area/delete', dataParam,
				procesarEliminarArea);
	}

}

function procesarEliminarArea(data) {
switch (data.CODE_RESPONSE) {
case "05":
	listarAreas(divisionIdEdicion);
	$("#modalAsociarNuevo").modal("hide");
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
	break;
case "08": 
	alert("No se puede eliminar, tiene "+data.puestoSons.length+ " puesto(s) asociado(s)."); 
	break;
default:
	alert("Ocurrió un error al eliminar el area!");
}
}