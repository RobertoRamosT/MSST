var alquilerClienteId,alquilerClienteObj;
var banderaEdicion12=false;
var listFullAlquilerClientes; 
var estadoAlquiler;
$(function(){
	$("#btnNuevoAlquilerCliente").attr("onclick", "javascript:nuevoAlquilerCliente();");
	$("#btnCancelarAlquilerCliente").attr("onclick", "javascript:cancelarNuevoAlquilerCliente();");
	$("#btnGuardarAlquilerCliente").attr("onclick", "javascript:guardarAlquilerCliente();");
	$("#btnEliminarAlquilerCliente").attr("onclick", "javascript:eliminarAlquilerCliente();"); 
})
/**
 * 
 */
function verAlquileresCliente(){ 
	$("#tabClientes .container-fluid").hide();
	$("#tabClientes #divContainAlquilerCliente").show();
	$("#tabClientes").find("h2")
	.html("<a onclick=' volverClienteResiduos()'>Locatario "+clienteResiduoObj.nombre+"</a>"
			+"> Alquileres");
	cargarAlquilerClientes();
}
function cargarAlquilerClientes() {
	$("#btnCancelarAlquilerCliente").hide();
	$("#btnNuevoAlquilerCliente").show();
	$("#btnEliminarAlquilerCliente").hide();
	$("#btnGuardarAlquilerCliente").hide();
	 
	callAjaxPost(URL + '/residuo/cliente/alquileres', 
			{id:clienteResiduoObj.id }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion12=false;
				 listFullAlquilerClientes=data.list;
					$("#tblAlquilerClientes tbody tr").remove();
					listFullAlquilerClientes.forEach(function(val,index){
						
						$("#tblAlquilerClientes tbody").append(
								"<tr id='tralq"+val.id+"' onclick='editarAlquilerCliente("+index+")'>" +
								"<td id='alqini"+val.id+"'>"+val.fechaInicioTexto+"</td>" 
								+"<td id='alqfin"+val.id+"'>"+val.fechaFinTexto+"</td>"
								+"<td id='alqest"+val.id+"'>"+val.estado.nombre+"</td>"
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblAlquilerClientes");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarAlquilerCliente(pindex) {


	if (!banderaEdicion12) {
		formatoCeldaSombreableTabla(false,"tblAlquilerClientes");
		alquilerClienteId = listFullAlquilerClientes[pindex].id;
		alquilerClienteObj=listFullAlquilerClientes[pindex];
		
		 var fechaInicio=convertirFechaInput(alquilerClienteObj.fechaInicio);
		 $("#alqini"+alquilerClienteId).html("<input type='date' class='form-control' " +
					"id='dateInicioAlquiler' onchange='estadoPeriodoAlquiler()'>");
		 $("#dateInicioAlquiler").val(fechaInicio);
		 
		 //
		 var fechaFin=convertirFechaInput(alquilerClienteObj.fechaFin);
		 $("#alqfin"+alquilerClienteId).html("<input type='date' class='form-control' " +
			"id='dateFinAlquiler' onchange='estadoPeriodoAlquiler()'>");
		 $("#dateFinAlquiler").val(fechaFin);
		 estadoPeriodoAlquiler();
		 banderaEdicion12 = true;
		$("#btnCancelarAlquilerCliente").show();
		$("#btnNuevoAlquilerCliente").hide();
		$("#btnEliminarAlquilerCliente").show();
		$("#btnGuardarAlquilerCliente").show();
		$("#btnGenReporte").hide();		
	}
	
}


function nuevoAlquilerCliente() {
	if (!banderaEdicion12) {
		alquilerClienteId = 0;
		$("#tblAlquilerClientes tbody")
				.prepend(
				"<tr  >"
						+"<td>"+"<input type='date' class='form-control' " +
								"id='dateInicioAlquiler' onchange='estadoPeriodoAlquiler()'>"+"</td>"
								+"<td>"+"<input type='date' class='form-control' " +
								"id='dateFinAlquiler' onchange='estadoPeriodoAlquiler()'>"+"</td>"
								+"<td id='alqest0'></td>"
						+ "</tr>");
		
		$("#btnCancelarAlquilerCliente").show();
		$("#btnNuevoAlquilerCliente").hide();
		$("#btnEliminarAlquilerCliente").hide();
		$("#btnGuardarAlquilerCliente").show();
		$("#btnGenReporte").hide();
		banderaEdicion12 = true;
		formatoCeldaSombreableTabla(false,"tblAlquilerClientes");
	} else {
		alert("Guarde primero.");
	}
}


function cancelarAlquilerCliente() {
	cargarAlquilerClientes();
}

function eliminarAlquilerCliente() {
	var r = confirm("¿Está seguro de eliminar lel detalle?");
	if (r == true) {
		var dataParam = {
				id : alquilerClienteId,
		};
		callAjaxPost(URL + '/residuo/cliente/alquiler/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarAlquilerClientes();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}

function guardarAlquilerCliente() {

	var campoVacio = true;
	var fechaInicio=convertirFechaTexto($("#dateInicioAlquiler").val());  
 var fechaFin=convertirFechaTexto($("#dateFinAlquiler").val()); 

		if (campoVacio) {

			var dataParam = {
				id : alquilerClienteId,
				fechaInicio:fechaInicio,
				fechaFin:fechaFin,
				estado:estadoAlquiler,
				cliente :{id :clienteResiduoObj.id}
			};

			callAjaxPost(URL + '/residuo/cliente/alquiler/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarAlquilerClientes();
							break;
						default:
							console.log("Ocurrió un error al guardar el detalle!");
						}
					});			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoAlquilerCliente(){
	cargarAlquilerClientes();
}


function estadoPeriodoAlquiler(){
	
	
	var fechaInicio=$("#dateInicioAlquiler").val();
	var fechaFin=$("#dateFinAlquiler").val();
var hoyDia=obtenerFechaActual();
	
	var difInicio= restaFechas(hoyDia,fechaInicio);
	var difFinal= restaFechas(hoyDia,fechaFin);
	if(difInicio>0){
		estadoAlquiler={id:"1",nombre:"Pendiente"};
	}else{
		if(difFinal>0){
			estadoAlquiler={id:"2",nombre:"En Curso"};
		}else{
			if(fechaFin==""){
				estadoAlquiler={id:"2",nombre:"En Curso"};
			}else{
				estadoAlquiler={id:"3",nombre:"Completado"};
			}
			
		}
	}
	
	$("#alqest"+alquilerClienteId).html(estadoAlquiler.nombre);
	
	
}	

