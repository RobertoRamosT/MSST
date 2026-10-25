 var proteccionId,proteccionObj;
var banderaEdicion23=false;
var listFullProteccionTipo;
$(function(){
	$("#btnNuevoProteccion").attr("onclick", "javascript:nuevoProteccion();");
	$("#btnCancelarProteccion").attr("onclick", "javascript:cancelarNuevoProteccion();");
	$("#btnGuardarProteccion").attr("onclick", "javascript:guardarProteccion();");
	$("#btnEliminarProteccion").attr("onclick", "javascript:eliminarProteccion();");
	 
})
/**
 * 
 */

function volverProteccions(){
	$("#tabAlmacen .container-fluid").hide();
	$("#divContainProteccion").show();
	$("#tabAlmacen").find("h2")
	.html("<a onclick='volverTipoResiduos()'> Residuo ("
			+tipoResiduoObj.tipo.nombre+") </a> > Proteccion al personal ");
}
function cargarProteccions(){
	$("#btnCancelarProteccion").hide();
	$("#btnNuevoProteccion").show();
	$("#btnEliminarProteccion").hide();
	$("#btnGuardarProteccion").hide();
	volverProteccions();
	callAjaxPost(URL + '/residuo/tipo/protecciones', 
			{id : tipoResiduoObj.id }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion23=false;
				 listFullProteccionTipo=data.list;
						$("#tblProteccionResiduo tbody tr").remove();
					listFullProteccionTipo.forEach(function(val,index){
						
						$("#tblProteccionResiduo tbody").append(
								"<tr id='trprot"+val.id+"' onclick='editarProteccion("+index+")'>" 
								+"<td id='prodesc"+val.id+"'>"+val.descripcion+"</td>" 
								+"<td id='pronump"+val.id+"'>"+val.numPersonal+"</td>" 
								+"<td id='prorisk"+val.id+"'>"+val.riesgos+"</td>" 
								+"<td id='promed"+val.id+"'>"+val.medidasSeguridad+"</td>" 
								 +"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblProteccionResiduo");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarProteccion(pindex) {


	if (!banderaEdicion23) {
		formatoCeldaSombreableTabla(false,"tblProteccionResiduo");
		proteccionId = listFullProteccionTipo[pindex].id;
		proteccionObj=listFullProteccionTipo[pindex]; 
		 
		var descripcion= proteccionObj.descripcion ;
		$("#prodesc" + proteccionId).html(
				"<input  id='inputDescProteccion' class='form-control'>  ");
		$("#inputDescProteccion").val(descripcion);
			//
		var numPersonal= proteccionObj.numPersonal ;
		$("#pronump" + proteccionId).html(
				"<input type='number'  id='inputNumPersProteccion' class='form-control'>  ");
		$("#inputNumPersProteccion").val(numPersonal);
	 	 
		//
		var riesgos= proteccionObj.riesgos ;
		$("#prorisk" + proteccionId).html(
				"<input  id='inputRiesgosProteccion' class='form-control'>  ");
		$("#inputRiesgosProteccion").val(riesgos);
		//
		var medidasSeguridad= proteccionObj.medidasSeguridad ;
		$("#promed" + proteccionId).html(
				"<input  id='inputMedidasProteccion' class='form-control'>  ");
		$("#inputMedidasProteccion").val(medidasSeguridad);
		banderaEdicion23 = true;
		$("#btnCancelarProteccion").show();
		$("#btnNuevoProteccion").hide();
		$("#btnEliminarProteccion").show();
		$("#btnGuardarProteccion").show();
		$("#btnGenReporte").hide();
		
	}
	
}


function nuevoProteccion() {
	if (!banderaEdicion23) {
		proteccionId = 0; 
		$("#tblProteccionResiduo tbody")
				.prepend(
						"<tr >" 
						 +"<td>"+"<input  id='inputDescProteccion' class='form-control'  >"+"</td>"
						 +"<td>"+"<input type='number'  id='inputNumPersProteccion' class='form-control'  >"+"</td>"
						 +"<td>"+"<input  id='inputRiesgosProteccion' class='form-control'  >"+"</td>"
						 +"<td>"+"<input  id='inputMedidasProteccion' class='form-control'  >"+"</td>"
						  			 
						 	+ "</tr>");
		 
		$("#btnCancelarProteccion").show();
		$("#btnNuevoProteccion").hide();
		$("#btnEliminarProteccion").hide();
		$("#btnGuardarProteccion").show(); 
		banderaEdicion23 = true;
		formatoCeldaSombreableTabla(false,"tblProteccionResiduo");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarProteccion() {
	cargarProteccions();
}

function eliminarProteccion() {
	var r = confirm("¿Está seguro de eliminar el proteccion");
	if (r == true) {
		var dataParam = {
				id : proteccionId,
		};
		callAjaxPost(URL + '/residuo/tipo/proteccion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarProteccions();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}

function guardarProteccion() {

	var campoVacio = true;
	var descripcion=$("#inputDescProteccion").val(); 
	var numPersonal=$("#inputNumPersProteccion").val(); 
	var riesgos=$("#inputRiesgosProteccion").val(); 
	var medidasSeguridad=$("#inputMedidasProteccion").val(); 
		if (campoVacio) {

			var dataParam = {
				id : proteccionId,
				descripcion:descripcion, 
				numPersonal:numPersonal, 
				riesgos:riesgos, 
				medidasSeguridad:medidasSeguridad, 
				tipo :{id :tipoResiduoObj.id}
			};

			callAjaxPost(URL + '/residuo/tipo/proteccion/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							cargarProteccions()
							break;
						default:
							console.log("Ocurrió un error al guardar el proteccion!");
						}
					},null,null,null,null,false);
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}

 
 

function cancelarNuevoProteccion(){
	cargarProteccions();
} 










