var puestoIdEdicion;
var nombrePuestoEdicion;
var nuevoPuestoAutomatico = false;
var listFullPuestos=[];

var listFullCaracteristicas=[];
var listTipoCaracteristica=[];
var banderaEdicionCaracteristica;
var caracteristicaId;
var areaPuestoAux;
var mensajeUx;

function listarPuestos(areaId) {
	areaPuestoAux=areaId;

	var dataParam = {
			areaId : areaId
	};

	callAjaxPost(URL + '/puesto', dataParam, procesarListarPuestos);
}

function procesarListarPuestos(data) {

	switch (data.CODE_RESPONSE) {
	case "05":
		banderaEdicion = false;
		deshabilitarBotonesEdicion();
		$("#btnAsociadoMdf").hide();
		$("#btnGuardarNuevos").attr("onclick",
				"javascript:guardarMasivoPlano(1, " + areaPuestoAux + ", " +
						"procesarResultadoListadoPuesto,0);");
		$("#btnNuevos").show();
		$("#btnDetalle").hide();
		$("#btnAsociarNuevaDivision").hide();
		$("#btnNuevo").attr("onclick", "nuevoPuesto()");
		$("#btnCancelar").attr("onclick", "cancelarPuesto()");
		$("#btnGuardar").attr("onclick", "guardarPuesto()");
		$("#btnEliminar").attr("onclick", "eliminarPuesto()");
		$("#btnPreview").show();
		$("#btnDescargar").hide();
		$("#btnInformeAnual").hide(); 
		$("#btnAsignarResp").hide();
		$("#btnResponsabilidadPuesto").hide();
		$("#btnTransferPuesto").hide().attr("onclick","verTransferirPuesto()");
		puestoIdEdicion = 0;
		var list = data.list;
		listFullPuestos=list;
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
								+ nombreAreaEdicion + ")</a> : Puestos");

		$("#thMatriz").html("Puestos de Trabajo");

		for (index = 0; index < list.length; index++) {

			$("#tblMatrices tbody").append(

					"<tr id='trm" + list[index].positionId
							+ "' onclick='javascript:editarPuesto("
							+ index + ")' >" + "<td id='tdm"
							+ list[index].positionId + "'>"

							+ "<div class='row'>"
							+ "<div class='col-md-3' id='div"
							+ list[index].positionId + "'>"
							+ (list[index].isPerfil!=null?
								(list[index].isPerfil==1?"<img src='../imagenes/corona.jpg' width='20px' height='20px'></img>":
								"<img src='../imagenes/vinculo.png' width='20px' height='20px'></img>")
								:"")
							
							
							+ "&nbsp;&nbsp;"+list[index].positionName + "</div>" + "</div>"

							+ "</td>" + "</tr>");
		}
		formatoCeldaSombreable(true);
		if (nuevoPuestoAutomatico) {
			nuevoPuesto();
		}

		break;
	default:
		alert("Ocurrió un error al traer los puestos!");
	}

}

// //////////////////////////////////////////////////////////////////////////////////////////////////////
function nuevoPuesto() {
	if (!banderaEdicion) {
		nuevoPuestoAutomatico = false;
		formatoCeldaSombreable(false);
		$("#tblMatrices tbody")
				.append(
						"<tr id='0'><td><input type='text' id='inputPuesto' class='form-control' placeholder='Puesto'></td>"
								+ "</tr>");
		$("#inputPuesto").keypress(function(e) {
			if (e.which == 13) {
				nuevoPuestoAutomatico = true;
				guardarPuesto();
			}
		});
		$("#inputPuesto").focus();
		puestoIdEdicion = 0;
		habilitarBotonesNuevo();
		banderaEdicion = true;
	} else {
		alert("Guarde primero el puesto.");
	}
}

function guardarPuesto() {

	var campoVacio = true;

	if ($("#inputPuesto").val().length == 0) {
		campoVacio = false;
	}

	if (campoVacio) {

		var dataParam = {
			positionName : $("#inputPuesto").val().toUpperCase(),
			positionId : puestoIdEdicion,
			areaId : areaIdEdicion
		};

		callAjaxPost(URL + '/puesto/save', dataParam, procesarGuardarPuesto);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarPuesto(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#tblMatrices tbody tr").remove();
		listarPuestos(areaIdEdicion);
		break;
	default:
		alert("Reducir longitud de caracteres ingresados");
	}
}

function cancelarPuesto() {
	// listarTareasEdicion(idMatrizEdicion);
	nuevoPuestoAutomatico = false;
	listarPuestos(areaIdEdicion);
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
}

var validacionNumTrabPuesto;

function editarPuesto(pindex) {
	if (!banderaEdicion) {
		puestoIdEdicion=listFullPuestos[pindex].positionId;
		validacionNumTrabPuesto = listFullPuestos[pindex].numTrabajadores;
		formatoCeldaSombreable(false);
		var name = $("#div" + puestoIdEdicion).text();
		nombrePuestoEdicion = name;
		$("#div" + puestoIdEdicion)
				.html(
						"<input type='text' id='inputPuesto' class='form-control' placeholder='Puesto' value='"
								+ name + "'>");
		habilitarBotonesEdicion();
		
		$("#btnDetalle").attr("onclick", "listarActividadesMdf()");
		$("#inputPuesto").keypress(function(e) {
			if (e.which == 13) {
				nuevoPuestoAutomatico = true;
				guardarPuesto();
			}
		});
		$("#inputPuesto").focus();
		$("#btnAsociadoMdf").show(); 
		$("#btnResponsabilidadPuesto").show();
		$("#btnTransferPuesto").show()
		$("#btnAsociarNuevaDivision").show().attr("onclick", "verModalNuevaAsociarPuesto()");
		banderaEdicion = true;
	
		actividadIdEdicion=null;
		tareaIdEdicion=null;
		pasoIdreal=null;
		
			if(listFullPuestos[pindex].isPerfil==null || listFullPuestos[pindex].isPerfil==1){
				$("#btnDetalle").show();
			}
		cargarCaracteristicasPuesto();
		
	}

}

function verTransferirPuesto(){
	$("#modalTransferirPuesto").modal("show");
	
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
		
		$("#modalTransferirPuesto").find(".modal-title").html("Asociar nuevo puesto")
$("#modalTransferirPuesto").find(".modal-body")
.html(btnGuaradr
				+"<br>Nueva "+getSession("gestopdivision")+" a:<div  id='divNuevaDivision'></div> "
		+"<br>Nueva "+getSession("gestoparea")+":<div  id='divNuevaArea'></div>"
		+"<br>Nuevo Puesto:<div  id='divNuevoPuesto'></div>" +
				
				
				"");
crearSelectOneMenuObligUnitarioCompleto("selNuevaDivision", "verAreasDivisionNuevaTrabajador()", divisionesActuales, "divisionId",
		"divisionName","#divNuevaDivision","");
		verAreasDivisionNuevaTrabajador();
$("#btnGuardarNuevoAsociado").attr("onclick","guardarNuevoAsociadoPuesto()")
	});
	
}
function verAreasDivisionNuevaTrabajador(){
	var areasActuales=[];
	var dataParam = {
			divisionId : $("#selNuevaDivision").val()
		};
	$("#divNuevaArea").html("Loading...");
		callAjaxPost(URL + '/area', dataParam, function(data){
			areasActuales=data.list;
			crearSelectOneMenuObligUnitarioCompleto("selNuevaArea", "verPuestosAreaNuevaTrabajador()", areasActuales, "areaId",
			"areaName","#divNuevaArea","");
			verPuestosAreaNuevaTrabajador();
		});
}
function verPuestosAreaNuevaTrabajador(){
	var puestosActuales=[];
	 
	var dataParam = {
			areaId : $("#selNuevaArea").val()
	};
	$("#divNuevoPuesto").html("Loading...");
		callAjaxPost(URL + '/puesto', dataParam, function(data){
			puestosActuales=data.list;
			puestosActuales=puestosActuales.filter(function(val){
				if(val.positionId==puestoIdEdicion){
					return false;
				}else{
					return true;
				}
			});
			crearSelectOneMenuObligUnitarioCompleto("selNuevoPuesto", "", puestosActuales, "positionId",
			"positionName","#divNuevoPuesto","");
		});
}
function verModalNuevaAsociarPuesto(){
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
		var selNuevaDivision= crearSelectOneMenuOblig("selNuevaDivisionEspecifica", "verAreasDivisionNueva()", divisionesActuales, "", "divisionId",
		"divisionName");
		$("#modalAsociarNuevo").find(".modal-title").html("Asociar nueva "+getSession("gestoparea"))
$("#modalAsociarNuevo").find(".modal-body")
.html(btnGuaradr+"<br><br>Seleccionar "+getSession("gestopdivision")+" a:<br>"+selNuevaDivision
		+"<br>"+getSession("gestoparea")+":<div  id='divNuevaAreaEspecifica'></div>");
		verAreasDivisionNueva();
$("#btnGuardarNuevoAsociado").attr("onclick","guardarNuevoAsociadoPuestoEspecifico()")
	});
	
}
function verAreasDivisionNueva(){
	var areasActuales=[];
	var dataParam = {
			divisionId : $("#selNuevaDivisionEspecifica").val()
		};
	$("#divNuevaAreaEspecifica").html("Loading...");
		callAjaxPost(URL + '/area', dataParam, function(data){
			areasActuales=data.list;
			var selNuevaArea= crearSelectOneMenuOblig("selNuevaAreaEspecifica", "", areasActuales, "", "areaId",
			"areaName");
			$("#divNuevaAreaEspecifica").html(selNuevaArea);
		});
}
function guardarNuevoAsociadoPuestoEspecifico(){
	var r = confirm("¿Está seguro de cambiar el área del puesto?");
	if (r == true) {
		var dataParam = {
				positionId : puestoIdEdicion,
				areaId:$("#selNuevaAreaEspecifica").val()
		};

		callAjaxPost(URL + '/puesto/area/save', dataParam,
				procesarEliminarPuesto);
	}
}

function eliminarPuesto(){
    if(validacionNumTrabPuesto == 0){
	mensajeUx="<label>¿Está seguro de eliminar el registro puesto de trabajo seleccionado?</label>";
	mensajesUx(mensajeUx,3,"","EliminarPuesto");

	$("#btnDevolverValorEliminarPuesto").on("click",function(){
	    var dataParam={
		positionId:puestoIdEdicion,mdfTypeId:tipoMdfId
	    };

	    callAjaxPost(URL+'/puesto/delete',dataParam,procesarEliminarPuesto);
	});   
    }else{
	mensajeUx="<label>No se puede eliminar este registro puesto de trabajo porque tiene trabajadores asociados al mismo</label>";
	mensajesUx(mensajeUx,2,"","");  
    }
}

function procesarEliminarPuesto(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		listarPuestos(areaIdEdicion);
		deshabilitarBotonesEdicion();
		$("#modalAsociarNuevo").modal("hide");
		banderaEdicion = false;
		break;
	default:
		alert("Hay elementos asociados, elimínelos primero");
	}
}

function procesarResultadoListadoPuesto(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if (data.repetidos > 0) {
			alert("No se pudo subir el listado debido a que algunos datos ya existen. Total: "
					+ data.repetidos);
		} else {
			$('#mdNuevos').modal('hide');
		}

		listarPuestos(areaIdEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Ocurrió un error al guardar listado!");
	}
}

function verResponsabilidadesPuesto(){
	$("#modalCaracteristicas").modal("show");
	$("#divCaracNormal").show();
	$("#divImportarCarac").hide();
	
	$("#btnNuevaCarac").show().attr("onclick","nuevaCaracteristicaPuesto()");
	$("#btnCancelarCarac").hide().attr("onclick","cargarCaracteristicasPuesto()");
	$("#btnGuardarCarac").hide().attr("onclick","guardarCaracteristicaPuesto()");
	$("#btnEliminarCarac").hide().attr("onclick","eliminarCaracteristicaPuesto()");
	$("#btnUploadCaracteristica").show().attr("onclick","cargaMasivaCaracteristicasPuesto()");

}
function guardarNuevoAsociadoPuesto(){
	var r = confirm("¿Está seguro de transferir trabajadores y recursos del puesto al puesto nuevo? Se eliminará el puesto actual");
	if (r == true) {
		var dataParam = {
				positionId : puestoIdEdicion,
				puestoPadreId:$("#selNuevoPuesto").val()
		};

		callAjaxPost(URL + '/puesto/transferir', dataParam,
				function(){
			alert("Cambio de puestos completado");
			listarPuestos(areaPuestoAux);
			$("#modalTransferirPuesto").modal("hide")
		});
	}
}

function cargarCaracteristicasPuesto(){
	$("#btnNuevaCarac").show() ;
	$("#btnCancelarCarac").hide() ;
	$("#btnGuardarCarac").hide() ;
	$("#btnEliminarCarac").hide() ;
	$("#btnUploadCaracteristica").show();
	var puestoObj={
			positionId : puestoIdEdicion
	}
	callAjaxPost(URL + '/puesto/caracteristicas', puestoObj, procesarCaracteristicasPuesto);
}


function procesarCaracteristicasPuesto(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		banderaEdicionCaracteristica=false;
		caracteristicaId=false;
		listFullCaracteristicas=data.list;
		listTipoCaracteristica=data.listTipo;
		$("#tblCarac tbody tr").remove();
		listFullCaracteristicas.forEach(function(val,index){
			$("#tblCarac tbody").append("<tr onclick='editarCaracteristicaPuesto("+index+")'>" +
					"<td id='tdtipocar"+val.id+"'>"+val.tipo.nombre+"</td>" +
					"<td id='tdnombrecar"+val.id+"'>"+val.nombre+"</td>" +
					"</tr>");
		});
		break;
	default:
		alert("Ocurrió un error al traer las características el puesto!");
	}
	
}
function editarCaracteristicaPuesto(pindex){
	if(!banderaEdicionCaracteristica){
		banderaEdicionCaracteristica=true;
		$("#btnNuevaCarac").hide();
		$("#btnCancelarCarac").show();
		$("#btnGuardarCarac").show();
		$("#btnEliminarCarac").show();
		$("#btnUploadCaracteristica").hide();
		caracteristicaId=listFullCaracteristicas[pindex].id;
		var tipoId=listFullCaracteristicas[pindex].tipo.id;
		$("#tdnombrecar"+caracteristicaId).html("<input class='form-control' id='inputCaracteristicaNombre'>");
		$("#inputCaracteristicaNombre").val(listFullCaracteristicas[pindex].nombre);
		var selTipoCarac=crearSelectOneMenu("selTipoCarac", "", listTipoCaracteristica, tipoId, "id",
				"nombre",null);
		$("#tdtipocar"+caracteristicaId).html(selTipoCarac);
		
		
	}
}

function nuevaCaracteristicaPuesto(){
	banderaEdicionCaracteristica=true;
	$("#btnNuevaCarac").hide();
	$("#btnCancelarCarac").show();
	$("#btnGuardarCarac").show();
	$("#btnEliminarCarac").hide();
	$("#btnUploadCaracteristica").hide();
	caracteristicaId=0;
	var selTipoCarac=crearSelectOneMenu("selTipoCarac", "", listTipoCaracteristica, -1, "id",
			"nombre",null);
	$("#tblCarac tbody").append("<tr>" +
			"<td>"+selTipoCarac+"</td>"+
			"<td>"+"<input class='form-control' id='inputCaracteristicaNombre' placeholder='Descripción'>"+"</td>" +
			"</tr>");
	
}

function guardarCaracteristicaPuesto(){
	var tipoId=$("#selTipoCarac").val();
	var nombre=$("#inputCaracteristicaNombre").val();
	
	if(tipoId!=-1 && nombre.length>0){
		var dataParam = {
				id : caracteristicaId ,nombre:nombre,tipo:{id:tipoId},puestoId:puestoIdEdicion
		};

		callAjaxPost(URL + '/puesto/caracteristica/save', dataParam, procesarEliminarCaracteristicaPuesto);
	
	}else{
		alert("Llene los campos")
	}
}
function eliminarCaracteristicaPuesto() {
	var r = confirm("¿Está seguro de eliminar la característica?");
	if (r == true) {
		var dataParam = {
				id : caracteristicaId 
		};

		callAjaxPost(URL + '/puesto/caracteristica/delete', dataParam, procesarEliminarCaracteristicaPuesto);
	}

}
function procesarEliminarCaracteristicaPuesto(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarCaracteristicasPuesto();
		banderaEdicionCaracteristica = false;
		break;
	default:
		alert("Ocurrió un error al eliminar el puesto!");
	}
}
function cargaMasivaCaracteristicasPuesto(){
	$("#divCaracNormal").hide();
	$("#divImportarCarac").show();
	
	$("#btnGuardarImportCarac").show().attr("onclick","guardarImportCaracteristicas()");
}
function guardarImportCaracteristicas(){
	var texto = $("#txtListadoCarac").val();
	var listExcel = texto.split('\n');
	var listCaracteristicas = []; 
	var validado = "";

	if (texto.length < 10000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int]; 
			if (filaTexto.trim().length < 1) {
				validado = "Existen filas vacias.";
				break;
			}

			if (validado.length < 1 && listCells.length != 2) {
				validado = "No coincide el numero de celdas."
						+ listCells.length;
				break;
			} else {
				var carac = {};
				var tipo = {};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					 
					
					if (j === 1)
						carac.nombre = element.trim();
					if (j === 0) {
						for (var k = 0; k < listTipoCaracteristica.length; k++) {
							 
							if (listTipoCaracteristica[k].nombre == element.trim()) {
								tipo.id = listTipoCaracteristica[k].id;
								carac.tipo = tipo;
							}
						}

						if (!tipo.id) {
							validado = "Tipo no reconocido.";
							break;
						}
					}
					 
					 
				}
				carac.puestoId=puestoIdEdicion;
				carac.id=0;
				listCaracteristicas.push(carac);
				 
			}
		}
	} else {
		validado = "Ha excedido los 10000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			var dataParam = {
				listCaracteristicas : listCaracteristicas
			};
			console.log(listCaracteristicas);
			callAjaxPost(URL + '/puesto/caracteristicas/masivo/save', dataParam,
					funcionResultadoMasivo);
		}
	} else {
		alert(validado);
	}
	
}
function funcionResultadoMasivo(data){
	alert("Listo");
	$("#divCaracNormal").show();
	$("#divImportarCarac").hide();
	cargarCaracteristicasPuesto();
}


