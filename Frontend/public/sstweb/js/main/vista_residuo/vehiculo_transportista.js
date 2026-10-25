/**
 * 
 */
var vehiculoTranportistaObj={};
var listFullVehiculoTransportista;
function toggleMenuOpcionVehiculoTransportista(obj,pindex){
	vehiculoTranportistaObj=listFullVehiculoTransportista[pindex]; 
		$(obj).parent(".detalleAccion").find("ul").toggle();
		$(obj).parent(".detalleAccion").siblings().find("ul").hide(); 	
	}
var funcionalidadesVehiculoTransportista=[ 

{id:"opcEditar",nombre:"Editar",functionClick:function(data){editarVehiculoTransportista()}  },
{id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarVehiculoTransportista()}  }
                               ]
function marcarSubOpcionVehiculoTransportista(pindex){
	funcionalidadesVehiculoTransportista[pindex].functionClick();
	$(".listaGestionGosst").hide();
}
function verVehiculosTransportista(locaIndex){
	locaIndex=defaultFor(locaIndex,objTransportistaResiduo.index);
	 
	objTransportistaResiduo=listFullTransportistasResiduo[locaIndex];
	$(".divVehiculoTransportista").html("");	
	$("#divVehi"+objTransportistaResiduo.id)
	.siblings(".divVehiculoTransportista")
	  .hide();
	
	$("#divVehi"+objTransportistaResiduo.id)
						.show();
	
	
	
	objTransportistaResiduo.index=locaIndex;
	callAjaxPost(URL + '/residuo/transportista/vehiculos', 
			{id:objTransportistaResiduo.id,
		empresa:{empresaId:getSession("gestopcompanyid")}}, function(data){
				if(data.CODE_RESPONSE=="05"){
					var menuOpcion="<ul class='list-group listaGestionGosst' >";
					funcionalidadesVehiculoTransportista.forEach(function(val1,index1){
						menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionVehiculoTransportista("+index1+")'>"+val1.nombre+" </li>"
					});
					menuOpcion+="</ul>";
					listFullVehiculoTransportista=data.list;
					
					var indicadorPositivo=0,indicadorTotal=0; 
					$("#divVehi"+objTransportistaResiduo.id)
					.html("");
					listFullVehiculoTransportista.forEach(function(val,index){
						
						$("#divVehi"+objTransportistaResiduo.id)
						.append("<div class='detalleAccion gosst-neutral'  > " +
								"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionVehiculoTransportista(this,"+index+")'>" +
								"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
								"" +menuOpcion+
								"<i aria-hidden='true' class='fa fa-info'></i>Tipo Almacenamiento "+ ""+val.tipoAlmacenamiento+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Residuo:"+ " "+val.capacidad+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Volumen promedio transportado por mes:"+ " "+val.volumenTransporte+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Frecuencia viajes por día:"+ " "+val.frecuencia+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Volumen carga por viaje (TM):"+ " "+val.volumenCarga+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Propiedad:"+ " "+val.propiedad+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Tipo de vehículo:"+ " "+val.tipo+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>N° placa:"+ " "+val.placa+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Capacidad promedio (TM):"+ " "+val.capacidadPromedio+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Año de fabricación:"+ " "+val.anioFabricacion+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>Color:"+ " "+val.color+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>N° de ejes:"+ " "+val.nroEjes+"" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>"+ " "+(val.isHabitual==1?"Sí":"No")+" es Habitual" +"<br>" +
								"<i aria-hidden='true' class='fa fa-info'></i>"+ " "+(val.isEventual==1?"Sí":"No")+" es Eventual" +"<br>" +
								
								
								" </div>" +
							"")
							
						
					});
					$(".listaGestionGosst").hide();
				}else{
					console.log("NOPNPO")
				}
			});
}
function nuevoVehiculoTransportista(){
	vehiculoTranportistaObj = {id:0,evidenciaNombre:"",tipo:{} };
	
	$("#editarMovilVehiculoTransportista").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Nueva Vehículo "
		+" de  '"	+objTransportistaResiduo.fechaTexto+"' ");
	$(".divListPrincipal>div").hide();
	$("#editarMovilVehiculoTransportista").show();
	$("#editarMovilVehiculoTransportista").find("input").val("");
	
	
	
}
function guardarVehiculoTransportista(){
	var campoVacio = true;
	var tipoAlmacenamiento=$("#inputTipAlmVehiculo").val();
	var capacidad=$("#inputCapacidadVehiculo").val();
	var volumenTransporte=$("#inputVolTransVehiculo").val();
	var frecuencia=$("#inputFrecuenciaVehiculo").val();
	var volumenCarga=$("#inputVolCargaVehiculo").val();
	var propiedad=$("#inputPropVehiculo").val();
	var tipo=$("#inputTipoVehiculo").val();
	var placa=$("#inputPlacaVehiculo").val();
	var capacidadPromedio=$("#inputCapPromVehiculo").val();
	var anioFabricacion=$("#inputAnioVehiculo").val();
	var color=$("#inputColorVehiculo").val();
	var nroEjes=$("#inputNumEjesVehiculo").val(); 
	var isHabitual=$("#checkHabitualVehiculo").prop("checked");
	var isEventual=$("#checkEventualVehiculo").prop("checked");
	
	if (campoVacio) {

			var dataParam = {
				id : vehiculoTranportistaObj.id,
				tipoAlmacenamiento:tipoAlmacenamiento,
				capacidad:capacidad,
				volumenTransporte:volumenTransporte,
				frecuencia:frecuencia,
				volumenCarga:volumenCarga,
				propiedad:propiedad,
				tipo:tipo,
				placa:placa,
				capacidadPromedio:capacidadPromedio,
				anioFabricacion:anioFabricacion,
				color:color,
				nroEjes:nroEjes, 
				isHabitual:(isHabitual?1:0),
				isEventual:(isEventual?1:0),
				transportista :{id :objTransportistaResiduo.id}
			};

			callAjaxPost(URL + '/residuo/transportista/vehiculo/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							volverDivSubContenido();
							verVehiculosTransportista();
							break;
						default:
							console.log("Ocurrió un error al guardar !");
						}
					});			
		} else {
			alert("Debe ingresar todos los campos.");
		}
}
function editarVehiculoTransportista(){
	$("#editarMovilVehiculoTransportista").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar  vehículo "); 
	 //
	$(".divListPrincipal>div").hide();
	$("#editarMovilVehiculoTransportista").show();
	
	$("#inputTipAlmVehiculo").val(vehiculoTranportistaObj.tipoAlmacenamiento);
	$("#inputCapacidadVehiculo").val(vehiculoTranportistaObj.capacidad);
	$("#inputVolTransVehiculo").val(vehiculoTranportistaObj.volumenTransporte);
	$("#inputFrecuenciaVehiculo").val(vehiculoTranportistaObj.frecuencia);
	$("#inputVolCargaVehiculo").val(vehiculoTranportistaObj.volumenCarga);
	$("#inputPropVehiculo").val(vehiculoTranportistaObj.propiedad);
	$("#inputTipoVehiculo").val(vehiculoTranportistaObj.tipo);
	$("#inputPlacaVehiculo").val(vehiculoTranportistaObj.placa);
	$("#inputCapPromVehiculo").val(vehiculoTranportistaObj.capacidadPromedio);
	$("#inputAnioVehiculo").val(vehiculoTranportistaObj.anioFabricacion);
	$("#inputColorVehiculo").val(vehiculoTranportistaObj.color);
	$("#inputNumEjesVehiculo").val(vehiculoTranportistaObj.nroEjes);
	$("#checkHabitualVehiculo").prop("checked",vehiculoTranportistaObj.isHabitual==1);
	$("#checkEventualVehiculo").prop("checked",vehiculoTranportistaObj.isEventual==1);
	
}
function eliminarVehiculoTransportista(){
	var r = confirm("¿Está seguro de eliminar el vehículo?");
	if (r == true) {
		var dataParam = {
				id : vehiculoTranportistaObj.id,
		};

		callAjaxPost(URL + '/residuo/transportista/vehiculo/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verVehiculosTransportista();
						break;
					default:
						alert("Ocurrió un error al eliminar !");
					}
				});
	}
}
