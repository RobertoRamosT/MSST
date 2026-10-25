/**
 * 
 */
var actividadLocatarioObj={};
var listFullActividad;
function toggleMenuOpcionActividad(obj,pindex){
	actividadLocatarioObj=listFullActividad[pindex]; 
		$(obj).parent(".detalleAccion").find("ul").toggle();
		$(obj).parent(".detalleAccion").siblings().find("ul").hide(); 	
	}
var funcionalidadesActividad=[ 

{id:"opcEditar",nombre:"Editar",functionClick:function(data){editarActividadLocatario()}  },
{id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarActividadLocatario()}  }
                               ]
function marcarSubOpcionActividad(pindex){
	funcionalidadesActividad[pindex].functionClick();
	$(".listaGestionGosst").hide();
}
function verActividadesLocatarioResiduo(locaIndex){
	locaIndex=defaultFor(locaIndex,objLocatarioResiduo.index);
	 
	objLocatarioResiduo=listFullLocatariosResiduo[locaIndex];
	$(".divActividadLocatario").html("");	
	$("#divActLoca"+objLocatarioResiduo.id)
	.siblings(".divActividadLocatario")
	  .hide();
	
	$("#divActLoca"+objLocatarioResiduo.id)
						.show();
	
	
	
	objLocatarioResiduo.index=locaIndex;
	callAjaxPost(URL + '/residuo/cliente/actividades', 
			{id:objLocatarioResiduo.id}, function(data){
				if(data.CODE_RESPONSE=="05"){
					var menuOpcion="<ul class='list-group listaGestionGosst' >";
					funcionalidadesActividad.forEach(function(val1,index1){
						menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionActividad("+index1+")'>"+val1.nombre+" </li>"
					});
					menuOpcion+="</ul>";
					listFullActividad=data.list;
					var indicadorPositivo=0,indicadorTotal=0; 
					$("#divActLoca"+objLocatarioResiduo.id)
					.html("");
					listFullActividad.forEach(function(val,index){
						
						$("#divActLoca"+objLocatarioResiduo.id)
						.append("<div class='detalleAccion gosst-neutral'  > " +
								"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionActividad(this,"+index+")'>" +
								"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
								"" +menuOpcion+
								"<i aria-hidden='true' class='fa fa-info'></i>Actividad "+ ""+val.descripcion+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Insumos:"+ " "+val.insumos+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Clasificación de Residuos:"+ " "+val.residuo.clasificacion.nombre+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Residuo:"+ " "+val.residuo.tipo.nombre+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Tipo de Residuo:"+ " "+val.residuo.categoria.nombre+"" +"<br>" +
								
								" </div>" +
							"")
							
						
					});
					$(".listaGestionGosst").hide();
				}else{
					console.log("NOPNPO")
				}
			});
}
function verAcordeClasificacionActividad(){
	var clasifActual=$("#selClasifResidActividad").val();
	var selTipoResidActividad=crearSelectOneMenuOblig("selTipoResidActividad","",
			listTipoResiduo.filter(function(val){
				return val.clasificacion.id==clasifActual
			}), actividadLocatarioObj.residuo.tipo.id, "id", "nombre");
	$("#divSelResActividad").html(selTipoResidActividad)
}
function nuevaActividadLocatario(){
	actividadLocatarioObj = {id:0,evidenciaNombre:"",residuo:{tipo:{}}};
	
	$("#editarMovilActividadLoca").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Nueva Actividad "
		+" de  '"	+objLocatarioResiduo.nombre+"' ");
	 
	$(".divListPrincipal>div").hide();
	$("#editarMovilActividadLoca").show();
	$("#selClasifResidActividad").val(1);
	$("#selTipoResidActividad").val(1); 
	$("#selCategoriaResidActividad").val(1); 
	$("#inputDescActividad").val(""); 
	$("#inputInsuActividad").val(""); 
	
	
	
}
function guardarActividadLocatario(){
	var campoVacio = true;
	var descripcion=$("#inputDescActividad").val();
	var insumos=$("#inputInsuActividad").val();
	var clasif=parseInt($("#selClasifResidActividad").val());
	var tipo=parseInt($("#selTipoResidActividad").val());
	var categoria=$("#selCategoriaResidActividad").val();
		if (campoVacio) {

			var dataParam = {
				id : actividadLocatarioObj.id,
				descripcion:descripcion,
				insumos:insumos,
				residuo:{
					clasificacion:{id:clasif},tipo:{id:tipo},categoria:{id:categoria}
				},
				cliente :{id :objLocatarioResiduo.id}
			};

			callAjaxPost(URL + '/residuo/cliente/actividad/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							volverDivSubContenido();
							verActividadesLocatarioResiduo();
							break;
						default:
							console.log("Ocurrió un error al guardar !");
						}
					});			
		} else {
			alert("Debe ingresar todos los campos.");
		}
}
function editarActividadLocatario(){
	$("#editarMovilActividadLoca").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar  Actividad "); 
	 //
	$(".divListPrincipal>div").hide();
	$("#editarMovilActividadLoca").show();
	
	$("#selClasifResidActividad").val(actividadLocatarioObj.residuo.clasificacion.id);
	$("#selTipoResidActividad").val(actividadLocatarioObj.residuo.tipo.id); 
	$("#selCategoriaResidActividad").val(actividadLocatarioObj.residuo.categoria.id); 
	$("#inputDescActividad").val(actividadLocatarioObj.descripcion ); 
	$("#inputInsuActividad").val(actividadLocatarioObj.insumos ); 
	
}
function eliminarActividadLocatario(){
	var r = confirm("¿Está seguro de eliminar el actividad?");
	if (r == true) {
		var dataParam = {
				id : actividadLocatarioObj.id,
		};

		callAjaxPost(URL + '/residuo/cliente/actividad/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verActividadesLocatarioResiduo();
						break;
					default:
						alert("Ocurrió un error al eliminar !");
					}
				});
	}
}
