var detalleManifiestoId,detalleManifiestoObj;
var banderaEdicion5=false;
var listFullDetalleManifiesto;
var listClasificacionResiduo ;
var listTipoResiduo;
$(function(){
	$("#btnNuevoDetalleManifiesto").attr("onclick", "javascript:nuevoDetalleManifiesto();");
	$("#btnCancelarDetalleManifiesto").attr("onclick", "javascript:cancelarNuevoDetalleManifiesto();");
	$("#btnGuardarDetalleManifiesto").attr("onclick", "javascript:guardarDetalleManifiesto();");
	$("#btnEliminarDetalleManifiesto").attr("onclick", "javascript:eliminarDetalleManifiesto();"); 
})
/**
 * 
 */
function verDetallesManifiesto(){ 
	$("#tabSalidas .container-fluid").hide();
	$("#tabSalidas #divContainResiduosAsociados").show();
	$("#tabSalidas").find("h2")
	.html("<a onclick=' volverTransportistas()'>Transportista "+transportistaObj.nombre +"</a>" +
			"> <a onclick=' volverManifiestos()'>Salida  "+manifiestoObj.clasificacion.nombre +"</a>"
			+"> Tipo de residuos y cantidades");
	cargarDetalleManifiestos();
}
function cargarDetalleManifiestos() {
	$("#btnCancelarDetalleManifiesto").hide();
	$("#btnNuevoDetalleManifiesto").show();
	$("#btnEliminarDetalleManifiesto").hide();
	$("#btnGuardarDetalleManifiesto").hide();
	 
	callAjaxPost(URL + '/residuo/transportista/manifiesto/detalles', 
			{id:manifiestoObj.id,transportista:{empresa:{empresaId:getSession("gestopcompanyid")}} }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion5=false;
				 listFullDetalleManifiesto=data.list;
				 listClasificacionResiduo=data.clasificacion;
				 listTipoResiduo=data.tipo;
				 listTipoResiduo= listTipoResiduo.filter(function(val){
						return val.clasificacion.id==manifiestoObj.clasificacion.id
					})
					$("#tblDetalleManifiestos tbody tr").remove();
					listFullDetalleManifiesto.forEach(function(val,index){
						
						$("#tblDetalleManifiestos tbody").append(
								"<tr id='trdet"+val.id+"' onclick='editarDetalleManifiesto("+index+")'>" 
								+"<td id='dettip"+val.id+"'>"+val.tipo.nombre+"</td>"
								+"<td id='detcant"+val.id+"'>"+val.cantidadTexto+"</td>"
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblDetalleManifiestos");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarDetalleManifiesto(pindex) {


	if (!banderaEdicion5) {
		formatoCeldaSombreableTabla(false,"tblDetalleManifiestos");
		detalleManifiestoId = listFullDetalleManifiesto[pindex].id;
		detalleManifiestoObj=listFullDetalleManifiesto[pindex];
		
		var cantidad=listFullDetalleManifiesto[pindex].cantidad;   
	$("#detcant" + detalleManifiestoId).html(
				"<input type='number' id='inputCantidadDetalle' class='form-control'>");
		$("#inputCantidadDetalle").val(cantidad);
		 
		//
		var tipo=detalleManifiestoObj.tipo.id;
		var slcTipoDetalle=crearSelectOneMenuOblig("slcTipoDetalle", "",
				listTipoResiduo, tipo, "id", "nombre");
		$("#dettip" + detalleManifiestoId).html(slcTipoDetalle );
		//
		banderaEdicion5 = true;
		$("#btnCancelarDetalleManifiesto").show();
		$("#btnNuevoDetalleManifiesto").hide();
		$("#btnEliminarDetalleManifiesto").show();
		$("#btnGuardarDetalleManifiesto").show();
		$("#btnGenReporte").hide();		
	}
	
}


function nuevoDetalleManifiesto() {
	if (!banderaEdicion5) {
		detalleManifiestoId = 0;
		var slcClasificacionDetalle = crearSelectOneMenuOblig("slcClasificacionDetalle", "",
				listClasificacionResiduo, "", "id", "nombre");
		var slcTipoDetalle = crearSelectOneMenuOblig("slcTipoDetalle", "",
				listTipoResiduo, "", "id", "nombre");
		$("#tblDetalleManifiestos tbody")
				.prepend(
						"<tr  >"
						+"<td>"+slcTipoDetalle+"</td>"
						+"<td>"+"<input type='number' id='inputCantidadDetalle'  class='form-control'>" 
						+"</td>"
								+ "</tr>");
		
		$("#btnCancelarDetalleManifiesto").show();
		$("#btnNuevoDetalleManifiesto").hide();
		$("#btnEliminarDetalleManifiesto").hide();
		$("#btnGuardarDetalleManifiesto").show();
		$("#btnGenReporte").hide();
		banderaEdicion5 = true;
		formatoCeldaSombreableTabla(false,"tblDetalleManifiestos");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarDetalleManifiesto() {
	cargarDetalleManifiestos();
}

function eliminarDetalleManifiesto() {
	var r = confirm("¿Está seguro de eliminar el detalle?");
	if (r == true) {
		var dataParam = {
				id : detalleManifiestoId,
		};
		callAjaxPost(URL + '/residuo/transportista/manifiesto/detalle/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarDetalleManifiestos();
						break;
					default:
						alert("No se puede eliminar ");
					}
				});
	}
}

function guardarDetalleManifiesto() {

	var campoVacio = true;
	var cantidad=$("#inputCantidadDetalle").val();  
 var clas=$("#slcClasificacionDetalle").val();
 var tipo=$("#slcTipoDetalle").val();
if (cantidad.length<1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : detalleManifiestoId,
				clasificacion:{id:clas},
				tipo:{id:tipo},
				cantidad:cantidad,
				manifiesto :{id :manifiestoObj.id}
			};

			callAjaxPost(URL + '/residuo/transportista/manifiesto/detalle/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarDetalleManifiestos();
							break;
						default:
							console.log("Ocurrió un error al guardar el detalle!");
						}
					});			
		} else {
			alert("Debe ingresar todos los campos.");
		} 
}


function cancelarNuevoDetalleManifiesto(){
	cargarDetalleManifiestos();
}




