/**
 * 
 */
var alquilerLocatarioObj={};
var listFullAlquiler;
function toggleMenuOpcionAlquiler(obj,pindex){
	alquilerLocatarioObj=listFullAlquiler[pindex]; 
		$(obj).parent(".detalleAccion").find("ul").toggle();
		$(obj).parent(".detalleAccion").siblings().find("ul").hide(); 	
	}
var funcionalidadesAlquiler=[ 

{id:"opcEditar",nombre:"Editar",functionClick:function(data){editarAlquilerLocatario()}  },
{id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarAlquilerLocatario()}  }
                               ]
function marcarSubOpcionAlquilerTrabajador(pindex){
	funcionalidadesAlquiler[pindex].functionClick();
	$(".listaGestionGosst").hide();
}
function verAlquileresLocatarioResiduo(locaIndex){
	locaIndex=defaultFor(locaIndex,objLocatarioResiduo.index);
	 
	objLocatarioResiduo=listFullLocatariosResiduo[locaIndex];
	$(".divAlquilerLocatario").html("");	
	$("#divAlqLoca"+objLocatarioResiduo.id)
	.siblings(".divAlquilerLocatario")
	  .hide();
	
	$("#divAlqLoca"+objLocatarioResiduo.id)
						.show();
	
	
	
	objLocatarioResiduo.index=locaIndex;
	callAjaxPost(URL + '/residuo/cliente/alquileres', 
			{id:objLocatarioResiduo.id}, function(data){
				if(data.CODE_RESPONSE=="05"){
					var menuOpcion="<ul class='list-group listaGestionGosst' >";
					funcionalidadesAlquiler.forEach(function(val1,index1){
						menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionAlquilerTrabajador("+index1+")'>"+val1.nombre+" </li>"
					});
					menuOpcion+="</ul>";
					listFullAlquiler=data.list;
					var indicadorPositivo=0,indicadorTotal=0; 
					$("#divAlqLoca"+objLocatarioResiduo.id)
					.html("");
					listFullAlquiler.forEach(function(val,index){
						
						$("#divAlqLoca"+objLocatarioResiduo.id)
						.append("<div class='detalleAccion gosst-neutral'  > " +
								"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionAlquiler(this,"+index+")'>" +
								"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
								"" +menuOpcion+
								"<i aria-hidden='true' class='fa fa-calendar'></i>Fecha Inicio: "+ ""+val.fechaInicioTexto+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-calendar'></i>Fecha Fin:"+ " "+val.fechaFinTexto+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>"+ ""+val.estado.nombre+"" +"<br>" +
								
								" </div>" +
							"")
							
						
					});
					$(".listaGestionGosst").hide();
				}else{
					console.log("NOPNPO")
				}
			});
}
function nuevoAlquilerLocatario(){
	alquilerLocatarioObj = {id:0,evidenciaNombre:""};
	
	$("#editarMovilAlquilerLoca").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Nuevo Alquiler "
		+" de  '"	+objLocatarioResiduo.nombre+"' ");
	 
	$(".divListPrincipal>div").hide();
	$("#editarMovilAlquilerLoca").show();
	$("#dateInicioAlquiler").val("");
	$("#dateFinAlquiler").val(""); 
	
	
	
}
function guardarAlquilerLocatario(){
	var campoVacio = true;
	var fechaInicio=convertirFechaTexto($("#dateInicioAlquiler").val());  
 var fechaFin=convertirFechaTexto($("#dateFinAlquiler").val()); 

		if (campoVacio) {

			var dataParam = {
				id : alquilerLocatarioObj.id,
				fechaInicio:fechaInicio,
				fechaFin:fechaFin,
				estado:alquilerLocatarioObj.estado,
				cliente :{id :objLocatarioResiduo.id}
			};

			callAjaxPost(URL + '/residuo/cliente/alquiler/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							volverDivSubContenido();
							verAlquileresLocatarioResiduo();
							break;
						default:
							console.log("Ocurrió un error al guardar el detalle!");
						}
					});			
		} else {
			alert("Debe ingresar todos los campos.");
		}
}
function editarAlquilerLocatario(){
	$("#editarMovilHojaVidaTrab").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar   Alquiler "); 
	 //
	$(".divListPrincipal>div").hide();
	$("#editarMovilHojaVidaTrab").show();
	
	$("#formEditarAlquiler #dateInicioAlquiler").val(convertirFechaInput(alquilerLocatarioObj.fechaInicio));
	$("#formEditarAlquiler #dateFinAlquiler").val(convertirFechaInput(alquilerLocatarioObj.fechaFin));
	estadoPeriodoAlquiler();
	
}
function eliminarAlquilerLocatario(){
	var r = confirm("¿Está seguro de eliminar el alquiler?");
	if (r == true) {
		var dataParam = {
				id : alquilerLocatarioObj.id,
		};

		callAjaxPost(URL + '/residuo/cliente/alquiler/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verAlquileresLocatarioResiduo();
						break;
					default:
						alert("Ocurrió un error al eliminar !");
					}
				});
	}
}
function estadoPeriodoAlquiler(){
	
	
	var fechaInicio=$("#formEditarAlquiler #dateInicioAlquiler").val();
	var fechaFin=$("#formEditarAlquiler #dateFinAlquiler").val();
var hoyDia=obtenerFechaActual();
	
	var difInicio= restaFechas(hoyDia,fechaInicio);
	var difFinal= restaFechas(hoyDia,fechaFin);
	if(difInicio>0){
		alquilerLocatarioObj.estado={id:"1",nombre:"Pendiente"};
	}else{
		if(difFinal>0){
			alquilerLocatarioObj.estado={id:"2",nombre:"En Curso"};
		}else{
			if(fechaFin==""){
				alquilerLocatarioObj.estado={id:"2",nombre:"En Curso"};
			}else{
				alquilerLocatarioObj.estado={id:"3",nombre:"Completado"};
			}
			
		}
	}
	
	$("#divEstAlquiler").html(alquilerLocatarioObj.estado.nombre);
	
	
}