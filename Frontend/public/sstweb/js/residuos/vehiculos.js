 var vehiculoId,vehiculoObj;
var banderaEdicion14=false;
var listFullVehiculos;
$(function(){
	$("#btnNuevoVehiculo").attr("onclick", "javascript:nuevoVehiculo();");
	$("#btnCancelarVehiculo").attr("onclick", "javascript:cancelarNuevoVehiculo();");
	$("#btnGuardarVehiculo").attr("onclick", "javascript:guardarVehiculo();");
	$("#btnEliminarVehiculo").attr("onclick", "javascript:eliminarVehiculo();");
	 
})
/**
 * 
 */

function volverVehiculos(){
	$("#tabSalidas .container-fluid").hide();
	$("#divContainVehiculoTransportista").show();
	$("#tabSalidas").find("h2")
	.html("<a onclick=' volverTransportistas()'>Transportista "+transportistaObj.nombre
			+"</a>"
			+"> Características de vehículos");
}
function cargarVehiculos(){
	$("#btnCancelarVehiculo").hide();
	$("#btnNuevoVehiculo").show();
	$("#btnEliminarVehiculo").hide();
	$("#btnGuardarVehiculo").hide();
	volverVehiculos();
	callAjaxPost(URL + '/residuo/transportista/vehiculos', 
			{id : transportistaObj.id }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion14=false;
				 listFullVehiculos=data.list;
						$("#tblVehiculos tbody tr").remove();
					listFullVehiculos.forEach(function(val,index){
						
						$("#tblVehiculos tbody").append(
								"<tr id='trvehi"+val.id+"' onclick='editarVehiculo("+index+")'>" 
								+"<td id='vehtipa"+val.id+"'>"+val.tipoAlmacenamiento+"</td>" 
								+"<td id='vehcap"+val.id+"'>"+val.capacidad+"</td>" 
								+"<td id='vehvolt"+val.id+"'>"+val.volumenTransporte+"</td>" 
								+"<td id='vehfrec"+val.id+"'>"+val.frecuencia+"</td>" 
								+"<td id='vehvolc"+val.id+"'>"+val.volumenCarga+"</td>" 
								+"<td id='vehprop"+val.id+"'>"+val.propiedad+"</td>" 
								+"<td id='vehtip"+val.id+"'>"+val.tipo+"</td>" 
								+"<td id='vehpla"+val.id+"'>"+val.placa+"</td>" 
								+"<td id='vehcapp"+val.id+"'>"+val.capacidadPromedio+"</td>" 
								+"<td id='vehano"+val.id+"'>"+val.anioFabricacion+"</td>" 
								+"<td id='vehcol"+val.id+"'>"+val.color+"</td>" 
								+"<td id='veheje"+val.id+"'>"+val.nroEjes+"</td>" 
								+"<td id='vehhab"+val.id+"'>"+(val.isHabitual==1?"Sí":"No")+"</td>" 
								+"<td id='veheve"+val.id+"'>"+(val.isEventual==1?"Sí":"No")+"</td>" 
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblVehiculos");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarVehiculo(pindex) {


	if (!banderaEdicion14) {
		formatoCeldaSombreableTabla(false,"tblVehiculos");
		vehiculoId = listFullVehiculos[pindex].id;
		vehiculoObj=listFullVehiculos[pindex]; 
		 
		var tipoAlmacenamiento= vehiculoObj.tipoAlmacenamiento ;
		$("#vehtipa" + vehiculoId).html(
				"<input  id='inputTipAlmVehiculo' class='form-control'>  ");
		$("#inputTipAlmVehiculo").val(tipoAlmacenamiento);
	 
		 //
		var capacidad=vehiculoObj.capacidad;
		$("#vehcap" + vehiculoId).html(
				"<input type='number'  id='inputCapacidadVehiculo' class='form-control'   >");
		$("#inputCapacidadVehiculo").val(capacidad);
		// 
		var volumenTransporte=vehiculoObj.volumenTransporte;
		$("#vehvolt" + vehiculoId).html(
				"<input type='number'  id='inputVolTransVehiculo' class='form-control'   >");
		$("#inputVolTransVehiculo").val(volumenTransporte);
		// 
		var frecuencia=vehiculoObj.frecuencia;
		$("#vehfrec" + vehiculoId).html(
				"<input type='number'  id='inputFrecuenciaVehiculo' class='form-control'   >");
		$("#inputFrecuenciaVehiculo").val(frecuencia);
		// 
		var volumenCarga=vehiculoObj.volumenCarga;
		$("#vehvolc" + vehiculoId).html(
				"<input type='number'  id='inputVolCargaVehiculo' class='form-control'   >");
		$("#inputVolCargaVehiculo").val(volumenCarga);
		// 
		var propiedad= vehiculoObj.propiedad ;
		$("#vehprop" + vehiculoId).html(
				"<input  id='inputPropVehiculo' class='form-control'>  ");
		$("#inputPropVehiculo").val(propiedad);
	 
		 //
		var tipo= vehiculoObj.tipo ;
		$("#vehtip" + vehiculoId).html(
				"<input  id='inputTipoVehiculo' class='form-control'>  ");
		$("#inputTipoVehiculo").val(tipo);
	 
		 //
		var placa= vehiculoObj.placa ;
		$("#vehpla" + vehiculoId).html(
				"<input  id='inputPlacaVehiculo' class='form-control'>  ");
		$("#inputPlacaVehiculo").val(placa);
	 
		 //
		var capacidadPromedio=vehiculoObj.capacidadPromedio;
		$("#vehcapp" + vehiculoId).html(
				"<input type='number'  id='inputCapPromVehiculo' class='form-control'   >");
		$("#inputCapPromVehiculo").val(capacidadPromedio);
		// 
		var anioFabricacion= vehiculoObj.anioFabricacion ;
		$("#vehano" + vehiculoId).html(
				"<input  id='inputAnioVehiculo' class='form-control'>  ");
		$("#inputAnioVehiculo").val(anioFabricacion);
	 
		 //
		var color= vehiculoObj.color ;
		$("#vehcol" + vehiculoId).html(
				"<input  id='inputColorVehiculo' class='form-control'>  ");
		$("#inputColorVehiculo").val(color); 
		 //
		var nroEjes=vehiculoObj.nroEjes;
		$("#veheje" + vehiculoId).html(
				"<input type='number'  id='inputNumEjesVehiculo' class='form-control'   >");
		$("#inputNumEjesVehiculo").val(nroEjes);
		// 
		var isHabitual=vehiculoObj.isHabitual;
		$("#vehhab"+vehiculoId).html("<input type='checkbox' id='checkHabitualVehiculo' onchange='verAcordeHabitual()' class='form-control' "+
				 (isHabitual==1?"checked":"" )+ ">");
	
	//
		var isEventual=vehiculoObj.isEventual;
		$("#veheve"+vehiculoId).html("<input type='checkbox' id='checkEventualVehiculo' onchange='verAcordeEventual()' class='form-control' "+
				 (isEventual==1?"checked":"" )+ ">");
	
	//
		
		banderaEdicion14 = true;
		$("#btnCancelarVehiculo").show();
		$("#btnNuevoVehiculo").hide();
		$("#btnEliminarVehiculo").show();
		$("#btnGuardarVehiculo").show();
		$("#btnGenReporte").hide();
		
	}
	
}


function nuevoVehiculo() {
	if (!banderaEdicion14) {
		vehiculoId = 0; 
		$("#tblVehiculos tbody")
				.prepend(
						"<tr >" 
						 +"<td>"+"<input  id='inputTipAlmVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input type='number' id='inputCapacidadVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input type='number' id='inputVolTransVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input type='number' id='inputFrecuenciaVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input type='number' id='inputVolCargaVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input  id='inputPropVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input  id='inputTipoVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input  id='inputPlacaVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input type='number' id='inputCapPromVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input  id='inputAnioVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input  id='inputColorVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input type='number' id='inputNumEjesVehiculo' class='form-control'  >"+"</td>"
						 +"<td>"+"<input type='checkbox' id='checkHabitualVehiculo' onchange='verAcordeHabitual()' class='form-control'  >"+"</td>"
						 +"<td>"+"<input type='checkbox' id='checkEventualVehiculo' onchange='verAcordeEventual()' class='form-control'  >"+"</td>"
									 
						 	+ "</tr>");
		 
		$("#btnCancelarVehiculo").show();
		$("#btnNuevoVehiculo").hide();
		$("#btnEliminarVehiculo").hide();
		$("#btnGuardarVehiculo").show(); 
		banderaEdicion14 = true;
		formatoCeldaSombreableTabla(false,"tblVehiculos");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarVehiculo() {
	cargarVehiculos();
}

function eliminarVehiculo() {
	var r = confirm("¿Está seguro de eliminar el vehiculo");
	if (r == true) {
		var dataParam = {
				id : vehiculoId,
		};
		callAjaxPost(URL + '/residuo/transportista/vehiculo/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarVehiculos();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}

function guardarVehiculo() {

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
				id : vehiculoId,
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
				transportista :{id :transportistaObj.id}
			};

			callAjaxPost(URL + '/residuo/transportista/vehiculo/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							cargarVehiculos()
							break;
						default:
							console.log("Ocurrió un error al guardar el vehiculo!");
						}
					},null,null,null,null,false);
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}

 
 

function cancelarNuevoVehiculo(){
	cargarVehiculos();
}
function verAcordeHabitual(){
	var isHab=$("#checkHabitualVehiculo").prop("checked");
	var isEventual=$("#checkEventualVehiculo").prop("checked");

if(isHab){
	$("#checkEventualVehiculo").prop("checked",false);
} 
var permitido=true;
listFullVehiculos.forEach(function(val,index){
	if(val.id!=vehiculoId && val.isHabitual==1){
		permitido=false
	}
});

if(!permitido){
	$("#checkHabitualVehiculo").prop("checked",false);
	alert("Ya hay vehículo habitual registrado")
}

}

function verAcordeEventual(){
	var isHab=$("#checkHabitualVehiculo").prop("checked");
	var isEventual=$("#checkEventualVehiculo").prop("checked");

if(isEventual){
	$("#checkHabitualVehiculo").prop("checked",false);
	 
} 
var permitido=true;
listFullVehiculos.forEach(function(val,index){
	if(val.id!=vehiculoId && val.isEventual==1){
		permitido=false
	}
});

if(!permitido){
	$("#checkEventualVehiculo").prop("checked",false);
	alert("Ya hay vehículo eventual registrado")
}

}










