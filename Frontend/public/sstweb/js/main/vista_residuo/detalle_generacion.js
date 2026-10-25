/**
 * 
 */
var detalleGeneracionObj={};
var listFullDetalleGeneracion;
function toggleMenuOpcionDetalleGeneracion(obj,pindex){
	detalleGeneracionObj=listFullDetalleGeneracion[pindex]; 
		$(obj).parent(".detalleAccion").find("ul").toggle();
		$(obj).parent(".detalleAccion").siblings().find("ul").hide(); 	
	}
var funcionalidadesDetalleGeneracion=[ 

{id:"opcEditar",nombre:"Editar",functionClick:function(data){editarDetalleGeneracion()}  },
{id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarDetalleGeneracion()}  }
                               ]
function marcarSubOpcionDetalleGeneracion(pindex){
	funcionalidadesDetalleGeneracion[pindex].functionClick();
	$(".listaGestionGosst").hide();
}
function verDetallesGeneracionResiduo(locaIndex){
	locaIndex=defaultFor(locaIndex,objGeneracionResiduo.index);
	 
	objGeneracionResiduo=listFullGeneracionsResiduo[locaIndex];
	$(".divDetalleGeneracion").html("");	
	$("#divResGen"+objGeneracionResiduo.id)
	.siblings(".divDetalleGeneracion")
	  .hide();
	
	$("#divResGen"+objGeneracionResiduo.id)
						.show();
	
	
	
	objGeneracionResiduo.index=locaIndex;
	callAjaxPost(URL + '/residuo/cambio/detalles', 
			{id:objGeneracionResiduo.id,
		empresa:{empresaId:getSession("gestopcompanyid")}}, function(data){
				if(data.CODE_RESPONSE=="05"){
					var menuOpcion="<ul class='list-group listaGestionGosst' >";
					funcionalidadesDetalleGeneracion.forEach(function(val1,index1){
						menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionDetalleGeneracion("+index1+")'>"+val1.nombre+" </li>"
					});
					menuOpcion+="</ul>";
					listFullDetalleGeneracion=data.list;
					
					var indicadorPositivo=0,indicadorTotal=0; 
					$("#divResGen"+objGeneracionResiduo.id)
					.html("");
					listFullDetalleGeneracion.forEach(function(val,index){
						
						$("#divResGen"+objGeneracionResiduo.id)
						.append("<div class='detalleAccion gosst-neutral'  > " +
								"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionDetalleGeneracion(this,"+index+")'>" +
								"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
								"" +menuOpcion+
								"<i aria-hidden='true' class='fa fa-info'></i>Área "+ ""+val.clasificacion.nombre+"" +"<br>" +
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
function verAcordeClasificacionDetalleGeneracion(){
	var clasifActual=objGeneracionResiduo.clasificacion.id;
	var selTipoResidDetalleGeneracion=crearSelectOneMenuOblig("selTipoResidDetalleGeneracion","",
			listTipoResiduoDetalle.filter(function(val){
				return val.clasificacion.id==clasifActual
			}), detalleGeneracionObj.tipo.id, "id", "nombre");
	$("#divTipoResDetalle").html(selTipoResidDetalleGeneracion)
}
function nuevaDetalleGeneracion(){
	detalleGeneracionObj = {id:0,evidenciaNombre:"",tipo:{} };
	
	$("#editarMovilDetalleGeneracion").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Nueva Detalle Generacion "
		+" de  '"	+objGeneracionResiduo.fechaTexto+"' ");
	verAcordeClasificacionDetalleGeneracion();
	$(".divListPrincipal>div").hide();
	$("#editarMovilDetalleGeneracion").show();
	$("#slcClasificacionDetalle").val(1);
	$("#selTipoResidDetalleGeneracion").val(1);
	$("#inputCantidadDetalleCambio").val(0);
	
	
}
function guardarDetalleGeneracion(functionAfter){
	var campoVacio = true;
	var clasif=parseInt($("#slcClasificacionDetalle").val());
	var tipo=parseInt($("#selTipoResidDetalleGeneracion").val());
	var cantidad=$("#inputCantidadDetalleCambio").val();  
	if (campoVacio) {

			var dataParam = {
				id : detalleGeneracionObj.id,
				clasificacion:{id:clasif},
				tipo:{id:tipo},
				cantidad:cantidad,
				cambio :{id :objGeneracionResiduo.id}
			};

			callAjaxPost(URL + '/residuo/cambio/detalle/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							if(functionAfter!=null){
								 alert("Guardado");
								 functionAfter();
							}else{
								volverDivSubContenido();
								verDetallesGeneracionResiduo();
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
function editarDetalleGeneracion(){
	$("#editarMovilDetalleGeneracion").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar  detalle "); 
	 //
	$(".divListPrincipal>div").hide();
	$("#editarMovilDetalleGeneracion").show();
	
	$("#slcClasificacionDetalle").val(detalleGeneracionObj.clasificacion.id);
	$("#selTipoResidDetalleGeneracion").val(detalleGeneracionObj.tipo.id);
	$("#inputCantidadDetalleCambio").val(detalleGeneracionObj.cantidad);
	
	
}
function eliminarDetalleGeneracion(){
	var r = confirm("¿Está seguro de eliminar el detalle?");
	if (r == true) {
		var dataParam = {
				id : detalleGeneracionObj.id,
		};

		callAjaxPost(URL + '/residuo/cambio/detalle/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verDetallesGeneracionResiduo();
						break;
					default:
						alert("Ocurrió un error al eliminar !");
					}
				});
	}
}
