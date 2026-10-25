var actividadClienteId,actividadClienteObj;
var banderaEdicion13=false;
var listFullActividadesCliente;
var listTipoResiduoActividad,listClasifResiduoActividad,listCategResiduoActividad;
$(function(){
	$("#btnNuevoActividadCliente").attr("onclick", "javascript:nuevoActividadCliente();");
	$("#btnCancelarActividadCliente").attr("onclick", "javascript:cancelarNuevoActividadCliente();");
	$("#btnGuardarActividadCliente").attr("onclick", "javascript:guardarActividadCliente();");
	$("#btnEliminarActividadCliente").attr("onclick", "javascript:eliminarActividadCliente();"); 
	$("#btnImportarActividadesCliente").attr("onclick", "javascript:importarActividadCliente();"); 

	

})
/**
 * 
 */
function importarActividadCliente(){
	$("#mdImpActividades").modal("show");
	$("#mdImpActividades").find("textarea").val("");
	$("#btnGuardarActividadesNuevos").attr("onclick","guardarImportActividadesClientes()");
}
function guardarImportActividadesClientes(){
	var texto = $("#txtListadoActiv").val();
	var listExcel = texto.split('\n');
	var listActividades = [];
	var listActivRepe = [];
	var listFullNombres = "";
	var validado = "";
	if (texto.length < 10000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];
			if (filaTexto.trim().length < 1) {
				validado = "Existen filas vacias.";
				break;
			}   
			if (validado.length < 1 && listCells.length != 5) {
				validado = "No coincide el numero de celdas. ("
						+ listCells.length+"!=5 )";
				break;
			} else {
				var actividad = {};
				var clas={}; 
				var residuo={}; 
				var tipo = {};
				actividad.residuo={clasificacion:{},tipo:{},categoria:{}}
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						actividad.descripcion = element.trim();
						if ($.inArray(actividad.nombre, listActivRepe) === -1) {
							listActivRepe.push(actividad.descripcion);
						} else {
							listFullNombres = listFullNombres + actividad.descripcion + ", ";
						}

					}
					if (j === 1) {
						actividad.insumos = element.trim();
					}   
					 
					if (j === 2) {
						listClasifResiduoActividad.forEach(function(val,index){
							if (val.nombre == element.trim()) {
								actividad.residuo.clasificacion.id = val.id;
							}
						});
						if (!actividad.residuo.clasificacion.id) {
							validado = "Clasificación   no reconocida.";
							break;
						}
					}
					if (j ===3) {
						listTipoResiduoActividad.forEach(function(val,index){
							if (val.nombre == element.trim()) {
								actividad.residuo.tipo.id = val.id;
							}
						});
						if (!actividad.residuo.tipo.id) {
							validado = "tipo no reconocida.";
							break;
						}
					}
					if (j ===4) {
						listCategResiduoActividad.forEach(function(val,index){
							if (val.nombre == element.trim()) {
								actividad.residuo.categoria.id = val.id;
							}
						});
						if (!actividad.residuo.categoria.id) {
							validado = "categoria   no reconocida.";
							break;
						}
					}
					actividad.cliente={id: clienteResiduoObj.id}
				
				}

				listActividades.push(actividad);
				if (listActivRepe.length < listActividades.length) {
					validado = "Existen actividades repetidos." + listFullNombres;
					break;
				}
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
					list : listActividades
			};
			
			callAjaxPost(URL + '/residuo/cliente/actividad/masivo/save', dataParam,
					function (data) {
				switch (data.CODE_RESPONSE) {
				case "05":
					
						alert("Se guardaron exitosamente.");
						cargarActividadClientes();
						$('#mdImpActividades').modal('hide');
					
					break;
				default:
					alert("Ocurri&oacute; un error al guardar el trabajador!");
				}
			});
		}
	} else {
		alert(validado);
	}
}
function verActividadesCliente(){ 
	$("#tabClientes .container-fluid").hide();
	$("#tabClientes #divContainActividadCliente").show();
	$("#tabClientes").find("h2")
	.html("<a onclick=' volverClienteResiduos()'>Área "+clienteResiduoObj.nombre+"</a>"
			+"> Actividades");
	cargarActividadClientes();
}
function cargarActividadClientes() {
	$("#btnCancelarActividadCliente").hide();
	$("#btnNuevoActividadCliente").show();
	$("#btnEliminarActividadCliente").hide();
	$("#btnGuardarActividadCliente").hide();
	 
	callAjaxPost(URL + '/residuo/cliente/actividades', 
			{id:clienteResiduoObj.id }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion13=false;
				 listFullActividadesCliente=data.list;
				 listTipoResiduoActividad=data.tipo;
				 listClasifResiduoActividad=data.clasificacion;
				 listCategResiduoActividad=data.categoria;
					$("#tblActividadClientes tbody tr").remove();
					listFullActividadesCliente.forEach(function(val,index){
						
						$("#tblActividadClientes tbody").append(
								"<tr id='tract"+val.id+"' onclick='editarActividadCliente("+index+")'>" +
								"<td id='actdesc"+val.id+"'>"+val.descripcion+"</td>" 
								+"<td id='actins"+val.id+"'>"+val.insumos+"</td>"
								+"<td id='actcla"+val.id+"'>"+val.residuo.clasificacion.nombre+"</td>"
								+"<td id='acttip"+val.id+"'>"+val.residuo.tipo.nombre+"</td>"
								+"<td id='actres"+val.id+"'>"+val.residuo.categoria.nombre+"</td>"
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblActividadClientes");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarActividadCliente(pindex) {


	if (!banderaEdicion13) {
		formatoCeldaSombreableTabla(false,"tblActividadClientes");
		actividadClienteId = listFullActividadesCliente[pindex].id;
		actividadClienteObj=listFullActividadesCliente[pindex];
		
		//
		var descripcion=actividadClienteObj.descripcion;
		$("#actdesc"+actividadClienteId).html("<input type='text' class='form-control' id='inputDescActividad'>");
		 $("#inputDescActividad").val(descripcion);
		 //
		var insumos=actividadClienteObj.insumos;
		$("#actins"+actividadClienteId).html("<input type='text' class='form-control' id='inputInsuActividad'>");
		 $("#inputInsuActividad").val(insumos);
		 //
		 var clasif=actividadClienteObj.residuo.clasificacion.id;
		 var selClasifResidActividad=crearSelectOneMenuOblig("selClasifResidActividad", "", listClasifResiduoActividad, 
				 clasif, "id","nombre");
		 $("#actcla"+actividadClienteId).html(selClasifResidActividad);
		 //
		 var tipo=actividadClienteObj.residuo.tipo.id;
		 var selTipoResidActividad=crearSelectOneMenuOblig("selTipoResidActividad", "", listTipoResiduoActividad, 
				 tipo, "id","nombre");
		 $("#acttip"+actividadClienteId).html(selTipoResidActividad);
		 //
		 var categoria=actividadClienteObj.residuo.categoria.id;
		 var selCategoriaResidActividad=crearSelectOneMenuOblig("selCategoriaResidActividad", "", listCategResiduoActividad, 
				 categoria, "id","nombre");
		 $("#actres"+actividadClienteId).html(selCategoriaResidActividad);
		 // 
		 
		 
		 

		 banderaEdicion13 = true;
		$("#btnCancelarActividadCliente").show();
		$("#btnNuevoActividadCliente").hide();
		$("#btnEliminarActividadCliente").show();
		$("#btnGuardarActividadCliente").show();
	}
	
}


function nuevoActividadCliente() {
	if (!banderaEdicion13) {
		actividadClienteId = 0;
		var selClasifResidActividad=crearSelectOneMenuOblig("selClasifResidActividad", "", listClasifResiduoActividad, 
				 "", "id","nombre");
		 var selTipoResidActividad=crearSelectOneMenuOblig("selTipoResidActividad", "", listTipoResiduoActividad, 
				 "", "id","nombre");
		 var selCategoriaResidActividad=crearSelectOneMenuOblig("selCategoriaResidActividad", "", listCategResiduoActividad, 
				 "", "id","nombre");
		$("#tblActividadClientes tbody").prepend(
				"<tr  >"
				+"<td>"+"<input   class='form-control' id='inputDescActividad' >"+"</td>"
				+"<td>"+"<input   class='form-control' id='inputInsuActividad' >"+"</td>"
				+"<td>"+selClasifResidActividad+"</td>"
				+"<td>"+selTipoResidActividad+"</td>"
				+"<td>"+selCategoriaResidActividad+"</td>"
								+ "</tr>");
		
		$("#btnCancelarActividadCliente").show();
		$("#btnNuevoActividadCliente").hide();
		$("#btnEliminarActividadCliente").hide();
		$("#btnGuardarActividadCliente").show();
		$("#btnGenReporte").hide();
		banderaEdicion13 = true;
		formatoCeldaSombreableTabla(false,"tblActividadClientes");
	} else {
		alert("Guarde primero.");
	}
}


function cancelarActividadCliente() {
	cargarActividadClientes();
}

function eliminarActividadCliente() {
	var r = confirm("¿Está seguro de eliminar lel detalle?");
	if (r == true) {
		var dataParam = {
				id : actividadClienteId,
		};
		callAjaxPost(URL + '/residuo/cliente/actividad/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarActividadClientes();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}

function guardarActividadCliente() {

	var campoVacio = true; 
	var descripcion=$("#inputDescActividad").val();
	var insumos=$("#inputInsuActividad").val();
	var clasif=parseInt($("#selClasifResidActividad").val());
	var tipo=parseInt($("#selTipoResidActividad").val());
	var categoria=$("#selCategoriaResidActividad").val();
	var resNombre=$("#inputResiduoNActividad").val();
		if (campoVacio) {

			var dataParam = {
				id : actividadClienteId,
				descripcion:descripcion,
				insumos:insumos,
				residuo:{
					clasificacion:{id:clasif},tipo:{id:tipo},categoria:{id:categoria},nombre:resNombre
				},
				cliente :{id :clienteResiduoObj.id}
			};

			callAjaxPost(URL + '/residuo/cliente/actividad/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarActividadClientes();
							break;
						default:
							console.log("Ocurrió un error al guardar !");
						}
					});			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoActividadCliente(){
	cargarActividadClientes();
}


	

