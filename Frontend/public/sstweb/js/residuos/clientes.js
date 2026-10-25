var clienteResiduoId,clienteResiduoObj,clienteResiduoNombre;
var banderaEdicion11=false;
var listFullClienteResiduos;
$(function(){
	$("#btnNuevoClienteResiduo").attr("onclick", "javascript:nuevoClienteResiduo();");
	$("#btnCancelarClienteResiduo").attr("onclick", "javascript:cancelarNuevoClienteResiduo();");
	$("#btnGuardarClienteResiduo").attr("onclick", "javascript:guardarClienteResiduo();");
	$("#btnEliminarClienteResiduo").attr("onclick", "javascript:eliminarClienteResiduo();");
	$("#btnImportarClienteResiduo").attr("onclick", "javascript:importarClienteResiduo();");
	
	insertMenu(cargarClienteResiduos);
})
/**
 * 
 */
function importarClienteResiduo(){
	$("#mdImpLocals").modal("show");
	$("#mdImpLocals").find("textarea").val("");
	$("#btnGuardarLocalesNuevos").attr("onclick","guardarImportClientesResiduo()");
}
function guardarImportClientesResiduo(){
	var texto = $("#txtListadoLocl").val();
	var listExcel = texto.split('\n');
	var listLocatarios = [];
	var listLocalRepe = [];
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

			if (validado.length < 1 && listCells.length != 7) {
				validado = "No coincide el numero de celdas. ("
						+ listCells.length+"!=7 )";
				break;
			} else {
				var locatario = {};
				var tipo = {};
				var clas={}; 
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						locatario.nombre = element.trim();
						if ($.inArray(locatario.nombre, listLocalRepe) === -1) {
							listLocalRepe.push(locatario.nombre);
						} else {
							listFullNombres = listFullNombres + locatario.nombre + ", ";
						}

					}
					if (j === 1) {
						locatario.responsable = element.trim();
					}
					if (j === 2) {
						locatario.responsableCorreo = element.trim();
					}
					if (j === 3) {
						locatario.responsableTelefono = element.trim();
					}
					if (j === 4) {
						locatario.metraje = element.trim();
					}
					if (j === 5) {
						locatario.aforo = element.trim();
						if(isNaN(parseFloat(locatario.aforo ))){
							validado="# de aforo no reconocido"
						}
						}
					if (j === 6) {
						locatario.numTrabajadores = element.trim();
						if(isNaN(parseFloat(locatario.numTrabajadores ))){
							validado="# de trabajadores no reconocido"
						}
					}
					
					 
					 
					 
					locatario.empresa={empresaId: sessionStorage.getItem("gestopcompanyid")}
				
				}

				listLocatarios.push(locatario);
				if (listLocalRepe.length < listLocatarios.length) {
					validado = "Existen locatarios repetidos." + listFullNombres;
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
					list : listLocatarios
			};
			
			callAjaxPost(URL + '/residuo/cliente/masivo/save', dataParam,
					function (data) {
				switch (data.CODE_RESPONSE) {
				case "05":
					
						alert("Se guardaron exitosamente.");
						cargarClienteResiduos();
						$('#mdImpLocals').modal('hide');
					
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
function volverClienteResiduos(){
	$("#tabClientes .container-fluid").hide();
	$("#divContainClienteResiduo").show();
	$("#tabClientes").find("h2").html("Vista General");
}
function cargarClienteResiduos() {
	$("#btnCancelarClienteResiduo").hide();
	$("#btnNuevoClienteResiduo").show();
	$("#btnEliminarClienteResiduo").hide();
	$("#btnGuardarClienteResiduo").hide();
	volverClienteResiduos();
	callAjaxPost(URL + '/residuo/clientes', 
			{empresaId : getSession("gestopcompanyid") }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion11=false;
				 listFullClienteResiduos=data.list;
					$("#tblClientes tbody tr").remove();
					listFullClienteResiduos.forEach(function(val,index){
						
						$("#tblClientes tbody").append(
								"<tr id='trcli"+val.id+"' onclick='editarClienteResiduo("+index+")'>" 
								+"<td id='clinom"+val.id+"'>"+val.nombre+"</td>" 
								+"<td id='cliresp"+val.id+"'>"+val.responsable+"</td>"
								+"<td id='clireco"+val.id+"'>"+val.responsableCorreo+"</td>"
								+"<td id='clireret"+val.id+"'>"+val.responsableTelefono+"</td>" 
								+"<td id='clirea"+val.id+"'>"+val.indicadorAlquiler+"</td>"
								+"<td id='clireact"+val.id+"'>"+val.indicadorActividad+"</td>"
								+"<td id='climet"+val.id+"'>"+val.metraje+"</td>"
								+"<td id='cliafo"+val.id+"'>"+val.aforo+"</td>"
								+"<td id='clitrabs"+val.id+"'>"+val.numTrabajadores+"</td>"
								+"</tr>");
					});
					completarBarraCarga();
					formatoCeldaSombreableTabla(true,"tblClientes");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarClienteResiduo(pindex) {


	if (!banderaEdicion11) {
		formatoCeldaSombreableTabla(false,"tblClientes");
		clienteResiduoId = listFullClienteResiduos[pindex].id;
		clienteResiduoObj=listFullClienteResiduos[pindex];
		
		var nombre=clienteResiduoObj.nombre;
		$("#clinom" + clienteResiduoId).html(
		 "<input   id='inputNombreClienteResiduo' class='form-control'>");
		$("#inputNombreClienteResiduo").val(nombre);
		//
		var responsable=clienteResiduoObj.responsable;
		$("#cliresp" + clienteResiduoId).html(
		 "<input   id='inputRespClienteResiduo' class='form-control'>");
		$("#inputRespClienteResiduo").val(responsable);
		//
		var responsableCorreo=clienteResiduoObj.responsableCorreo;
		$("#clireco" + clienteResiduoId).html(
		 "<input   id='inputRespCClienteResiduo' class='form-control'>");
		$("#inputRespCClienteResiduo").val(responsableCorreo);
		//
		var responsableTelefono=clienteResiduoObj.responsableTelefono;
		$("#clireret" + clienteResiduoId).html(
		 "<input   id='inputRespTClienteResiduo' class='form-control'>");
		$("#inputRespTClienteResiduo").val(responsableTelefono);
		//
		var textInfo=$("#clirea"+clienteResiduoId).text();
		$("#clirea"+clienteResiduoId).addClass("linkGosst")
		.on("click",function(){verAlquileresCliente();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo);
		//
		var textInfo2=$("#clireact"+clienteResiduoId).text();
		$("#clireact"+clienteResiduoId).addClass("linkGosst")
		.on("click",function(){verActividadesCliente();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo2);
		//
		var metraje=clienteResiduoObj.metraje;
		$("#climet" + clienteResiduoId).html(
		 "<input  type='number' id='inputMetroClienteResiduo' class='form-control'>");
		$("#inputMetroClienteResiduo").val(metraje);
		//
		var aforo=clienteResiduoObj.aforo;
		$("#cliafo" + clienteResiduoId).html(
		 "<input  type='number' id='inputAforoClienteResiduo' class='form-control'>");
		$("#inputAforoClienteResiduo").val(aforo);
		//
		var numTrabajadores=clienteResiduoObj.numTrabajadores;
		$("#clitrabs" + clienteResiduoId).html(
		 "<input  type='number' id='inputNumTrabajadoresClienteResiduo' class='form-control'>");
		$("#inputNumTrabajadoresClienteResiduo").val(numTrabajadores);
		//
		
		banderaEdicion11 = true;
		$("#btnCancelarClienteResiduo").show();
		$("#btnNuevoClienteResiduo").hide();
		$("#btnEliminarClienteResiduo").show();
		$("#btnGuardarClienteResiduo").show();
		$("#btnGenReporte").hide();
		
		
		
		
	}
	
}


function nuevoClienteResiduo() {
	if (!banderaEdicion11) {
		clienteResiduoId = 0;
		$("#tblClientes tbody")
				.prepend(
						"<tr  >"
						
						+"<td>"+ "<input   id='inputNombreClienteResiduo' class='form-control'>"+"</td>"
						+"<td>"+"<input   id='inputRespClienteResiduo' class='form-control'>"+"</td>"
						+"<td>"+"<input   id='inputRespCClienteResiduo' class='form-control'>"+"</td>"
						+"<td>"+ "<input  id='inputRespTClienteResiduo' class='form-control'>"+"</td>"
						+"<td>"+"..."+"</td>"
						+"<td>"+"..."+"</td>"
						+"<td>"+  "<input  type='number' id='inputMetroClienteResiduo' class='form-control'>"+"</td>" 
						+"<td>"+  "<input  type='number' id='inputAforoClienteResiduo' class='form-control'>"+"</td>" 
						+"<td>"+  "<input  type='number' id='inputNumTrabajadoresClienteResiduo' class='form-control'>"+"</td>" 
						 
							+ "</tr>");
		
		
		$("#btnCancelarClienteResiduo").show();
		$("#btnNuevoClienteResiduo").hide();
		$("#btnEliminarClienteResiduo").hide();
		$("#btnGuardarClienteResiduo").show();
		$("#btnGenReporte").hide();
		banderaEdicion11 = true;
		formatoCeldaSombreableTabla(false,"tblClientes");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarClienteResiduo() {
	cargarClienteResiduos();
}

function eliminarClienteResiduo() {
	var r = confirm("¿Está seguro de eliminar el inquilino ?");
	if (r == true) {
		var dataParam = {
				id : clienteResiduoId,
		};
		callAjaxPost(URL + '/residuo/cliente/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarClienteResiduos();
						break;
					default:
						alert("No se puede eliminar, hay alquileres asociados.");
					}
				});
	}
}

function guardarClienteResiduo() {

	var campoVacio = true; 
var nombre=$("#inputNombreClienteResiduo").val();
var responsable=$("#inputRespClienteResiduo").val();
var responsableCorreo=$("#inputRespCClienteResiduo").val();
var responsableTelefono=$("#inputRespTClienteResiduo").val();
var metraje=$("#inputMetroClienteResiduo").val();
var aforo=$("#inputAforoClienteResiduo").val(); 
var numTrabajadores=$("#inputNumTrabajadoresClienteResiduo").val();
		if (campoVacio) {

			var dataParam = {
				id : clienteResiduoId,  
				nombre:nombre,
				responsable:responsable,
				responsableCorreo:responsableCorreo,
				responsableTelefono:responsableTelefono,
				metraje:metraje,
				aforo:aforo,
				numTrabajadores:numTrabajadores,
				empresa :{empresaId :getSession("gestopcompanyid")}
			};

			callAjaxPost(URL + '/residuo/cliente/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							cargarClienteResiduos();
							 
							break;
						default:
							console.log("Ocurrió un error al guardar el Área!");
						}
					},null,null,null,null,false);
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoClienteResiduo(){
	cargarClienteResiduos();
}




