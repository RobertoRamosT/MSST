var detalleCambioResiduoId,detalleCambioResiduoObj;
var banderaEdicion2=false;
var listFullDetalleCambioResiduos;
var listClienteResiduo ;
var listTipoResiduo;
$(function(){
	$("#btnNuevoDetalleCambioResiduo").attr("onclick", "javascript:nuevoDetalleCambioResiduo();");
	$("#btnCancelarDetalleCambioResiduo").attr("onclick", "javascript:cancelarNuevoDetalleCambioResiduo();");
	$("#btnGuardarDetalleCambioResiduo").attr("onclick", "javascript:guardarDetalleCambioResiduo();");
	$("#btnEliminarDetalleCambioResiduo").attr("onclick", "javascript:eliminarDetalleCambioResiduo();"); 
})
/**
 * 
 */
function verDetallesCambioResiduo(){ 
	$("#tabCambios .container-fluid").hide();
	$("#tabCambios #divContainResiduosAsociados").show();
	$("#tabCambios").find("h2")
	.html("<a onclick=' volverCambioResiduos()'>Reporte "+cambioResiduoObj.clasificacion.nombre
			+" ("+cambioResiduoObj.fechaTexto+")</a>"
			+"> Tipo de residuos y cantidades");
	cargarDetalleCambioResiduos();
}
function cargarDetalleCambioResiduos() {
	$("#btnCancelarDetalleCambioResiduo").hide();
	$("#btnNuevoDetalleCambioResiduo").show();
	$("#btnEliminarDetalleCambioResiduo").hide();
	$("#btnGuardarDetalleCambioResiduo").hide();
	 
	callAjaxPost(URL + '/residuo/cambio/detalles', 
			{id:cambioResiduoObj.id ,
				empresa:cambioResiduoObj.empresa}, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion2=false;
				 listFullDetalleCambioResiduos=data.list;
				 listClienteResiduo=data.cliente;
				 listTipoResiduo=data.tipo;
				 listTipoResiduo= listTipoResiduo.filter(function(val){
						return val.clasificacion.id==cambioResiduoObj.clasificacion.id
					})
					$("#tblDetalleCambioResiduos tbody tr").remove();
					listFullDetalleCambioResiduos.forEach(function(val,index){
						
						$("#tblDetalleCambioResiduos tbody").append(
								"<tr id='trdet"+val.id+"' onclick='editarDetalleCambioResiduo("+index+")'>" +
								"<td id='detclas"+val.id+"'>"+val.clasificacion.nombre+"</td>" 
								+"<td id='dettip"+val.id+"'>"+val.tipo.nombre+"</td>"
								+"<td id='detcant"+val.id+"'>"+val.cantidadTexto+"</td>"
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblDetalleCambioResiduos");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarDetalleCambioResiduo(pindex) {


	if (!banderaEdicion2) {
		formatoCeldaSombreableTabla(false,"tblDetalleCambioResiduos");
		detalleCambioResiduoId = listFullDetalleCambioResiduos[pindex].id;
		detalleCambioResiduoObj=listFullDetalleCambioResiduos[pindex];
		
		var cantidad=listFullDetalleCambioResiduos[pindex].cantidad;   
	$("#detcant" + detalleCambioResiduoId).html(
				"<input type='number' id='inputCantidadDetalleCambio' class='form-control'>");
		$("#inputCantidadDetalleCambio").val(cantidad);
		//
		var clas=detalleCambioResiduoObj.clasificacion.id;
		var slcClasificacionDetalle=crearSelectOneMenuOblig("slcClasificacionDetalle", "",
				listClienteResiduo, clas, "id", "nombre");
		$("#detclas" + detalleCambioResiduoId).html(slcClasificacionDetalle );
		//
		var tipo=detalleCambioResiduoObj.tipo.id;
		var slcTipoDetalleCambio=crearSelectOneMenuOblig("slcTipoDetalleCambio", "",
				listTipoResiduo, tipo, "id", "nombre");
		$("#dettip" + detalleCambioResiduoId).html(slcTipoDetalleCambio );
		//
		banderaEdicion2 = true;
		$("#btnCancelarDetalleCambioResiduo").show();
		$("#btnNuevoDetalleCambioResiduo").hide();
		$("#btnEliminarDetalleCambioResiduo").show();
		$("#btnGuardarDetalleCambioResiduo").show();
		$("#btnGenReporte").hide();		
	}
	
}


function nuevoDetalleCambioResiduo() {
	if (!banderaEdicion2) {
		detalleCambioResiduoId = 0;
		var slcClasificacionDetalle = crearSelectOneMenuOblig("slcClasificacionDetalle", "",
				listClienteResiduo, "", "id", "nombre");
		var slcTipoDetalleCambio = crearSelectOneMenuOblig("slcTipoDetalleCambio", "",
				listTipoResiduo, "", "id", "nombre");
		$("#tblDetalleCambioResiduos tbody")
				.prepend(
						"<tr  >"
						+"<td>"+slcClasificacionDetalle+"</td>"
						+"<td>"+slcTipoDetalleCambio+"</td>"
						+"<td>"+"<input type='number' id='inputCantidadDetalleCambio'  class='form-control'>" 
						+"</td>"
								+ "</tr>");
		
		$("#btnCancelarDetalleCambioResiduo").show();
		$("#btnNuevoDetalleCambioResiduo").hide();
		$("#btnEliminarDetalleCambioResiduo").hide();
		$("#btnGuardarDetalleCambioResiduo").show();
		$("#btnGenReporte").hide();
		banderaEdicion2 = true;
		formatoCeldaSombreableTabla(false,"tblDetalleCambioResiduos");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarDetalleCambioResiduo() {
	cargarDetalleCambioResiduos();
}

function eliminarDetalleCambioResiduo() {
	var r = confirm("¿Está seguro de eliminar lel detalle?");
	if (r == true) {
		var dataParam = {
				id : detalleCambioResiduoId,
		};
		callAjaxPost(URL + '/residuo/cambio/detalle/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarDetalleCambioResiduos();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}

function guardarDetalleCambioResiduo() {

	var campoVacio = true;
	var cantidad=$("#inputCantidadDetalleCambio").val();  
 var clas=$("#slcClasificacionDetalle").val();
 var tipo=$("#slcTipoDetalleCambio").val();
if (cantidad.length<1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : detalleCambioResiduoId,
				clasificacion:{id:clas},
				tipo:{id:tipo},
				cantidad:cantidad,
				cambio :{id :cambioResiduoObj.id}
			};

			callAjaxPost(URL + '/residuo/cambio/detalle/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarDetalleCambioResiduos();
							break;
						default:
							console.log("Ocurrió un error al guardar el detalle!");
						}
					});			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoDetalleCambioResiduo(){
	cargarDetalleCambioResiduos();
}




