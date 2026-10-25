/**
 * 
 */
var detalleSalidaObj={};
var listFullDetalleSalida;
function toggleMenuOpcionDetalleSalida(obj,pindex){
	detalleSalidaObj=listFullDetalleSalida[pindex]; 
		$(obj).parent(".detalleAccion").find("ul").toggle();
		$(obj).parent(".detalleAccion").siblings().find("ul").hide(); 	
	}
var funcionalidadesDetalleSalida=[ 

{id:"opcEditar",nombre:"Editar",functionClick:function(data){editarDetalleSalida()}  },
{id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarDetalleSalida()}  }
                               ]
function marcarSubOpcionDetalleSalida(pindex){
	funcionalidadesDetalleSalida[pindex].functionClick();
	$(".listaGestionGosst").hide();
}
function verDetallesSalidaResiduo(locaIndex){
	locaIndex=defaultFor(locaIndex,objSalidaResiduo.index);
	 
	objSalidaResiduo=listFullSalidasResiduo[locaIndex];
	$(".divDetalleSalida").html("");	
	$("#divResSal"+objSalidaResiduo.id)
	.siblings(".divDetalleSalida")
	  .hide();
	
	$("#divResSal"+objSalidaResiduo.id)
						.show();
	
	objSalidaResiduo.index=locaIndex;
	callAjaxPost(URL + '/residuo/transportista/manifiesto/detalles', 
			{id:objSalidaResiduo.id}, function(data){
				if(data.CODE_RESPONSE=="05"){
					var menuOpcion="<ul class='list-group listaGestionGosst' >";
					funcionalidadesDetalleSalida.forEach(function(val1,index1){
						menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionDetalleSalida("+index1+")'>"+val1.nombre+" </li>"
					});
					menuOpcion+="</ul>";
					listFullDetalleSalida=data.list;
					
					var indicadorPositivo=0,indicadorTotal=0; 
					$("#divResSal"+objSalidaResiduo.id)
					.html("");
					listFullDetalleSalida.forEach(function(val,index){
						
						$("#divResSal"+objSalidaResiduo.id)
						.append("<div class='detalleAccion gosst-neutral'  > " +
								"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionDetalleSalida(this,"+index+")'>" +
								"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
								"" +menuOpcion+
								"<i aria-hidden='true' class='fa fa-info'></i>Residuo:"+ " "+val.tipo.nombre+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Cantidad:"+ " "+val.cantidadTexto+"" +"<br>" +
							
								
								" </div>" +
							"")
							
						
					});
					$(".listaGestionGosst").hide();
				}else{
					console.log("NOPNPO")
				}
			});
}
function verAcordeClasificacionDetalleSalida(){
	var clasifActual=objSalidaResiduo.clasificacion.id;
	var selTipoResidDetalleSalida=crearSelectOneMenuOblig("selTipoResidDetalleSalida","",
			listTipoResiduoDetalleSalida.filter(function(val){
				return val.clasificacion.id==clasifActual
			}), detalleSalidaObj.tipo.id, "id", "nombre");
	$("#divTipoDetalleSalida").html(selTipoResidDetalleSalida)
}
function nuevoDetalleSalida(){
	detalleSalidaObj = {id:0,evidenciaNombre:"",tipo:{} };
	
	$("#editarMovilDetalleSalida").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Nueva Detalle Salida "
		+" de  '"	+objSalidaResiduo.fechaSalidaTexto+"' ");
	verAcordeClasificacionDetalleSalida();
	$(".divListPrincipal>div").hide();
	$("#editarMovilDetalleSalida").show();
	$("#selTipoResidDetalleSalida").val(1);
	$("#inputCantidadDetalleSalida").val(0);
	
	
}
function guardarDetalleSalida(functionAfter){
	var campoVacio = true;
	var tipo=parseInt($("#selTipoResidDetalleSalida").val());
	var cantidad=$("#inputCantidadDetalleSalida").val();  
	if (campoVacio) {

			var dataParam = {
				id : detalleSalidaObj.id,
				tipo:{id:tipo},
				cantidad:cantidad,
				manifiesto :{id :objSalidaResiduo.id}
			};

			callAjaxPost(URL + '/residuo/transportista/manifiesto/detalle/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							if(functionAfter!=null){
								 alert("Guardado");
								 functionAfter();
							}else{
								volverDivSubContenido();
								verDetallesSalidaResiduo();
							}
							
							break;
						default:
							console.log("Ocurrió un error al guardar !");
						}
					});			
		} else {
			alert("Debe ingresar todos los campos.");
		}
}
function editarDetalleSalida(){
	$("#editarMovilDetalleSalida").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar  detalle "); 
	 //
	$(".divListPrincipal>div").hide();
	$("#editarMovilDetalleSalida").show();
	
	$("#slcTipoDetalleCambio").val(detalleSalidaObj.tipo.id);
	$("#inputCantidadDetalleSalida").val(detalleSalidaObj.cantidad);
	
}
function eliminarDetalleSalida(){
	var r = confirm("¿Está seguro de eliminar el detalle?");
	if (r == true) {
		var dataParam = {
				id : detalleSalidaObj.id,
		};

		callAjaxPost(URL + '/residuo/transportista/manifiesto/detalle/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verDetallesSalidaResiduo();
						break;
					default:
						alert("Ocurrió un error al eliminar !");
					}
				});
	}
}
