var banderaEdicion3=false;
var modificarId,modificarObj;
var tipoder;
var listFullArtModificador,listFullArticulosOtros,listFullNormas;
var listaArticulosSeleccionados,listaIdArticulosUsados;
$(function(){
	$("#btnNuevoModArticuloNorma").attr("onclick", "javascript:nuevoArticuloModificado();");
	$("#btnCancelarModArticuloNorma").attr("onclick", "javascript:cancelarNuevoModificadorArticulo();");
	$("#btnGuardarModArticuloNorma").attr("onclick", "javascript:guardarArticuloModificador();");
	$("#btnEliminarModArticuloNorma").attr("onclick", "javascript:eliminarArticuloModificador();"); 
}) 
function verModificarArticuloNorma (){ 
	$("#tabNormaLegal .container-fluid").hide();
	$("#tabNormaLegal #divContainArticulos").hide(); 
	$("#tabNormaLegal #divContainModArticuloNorma").show();
	$("#tabNormaLegal").find("h2")
	.html("<a onclick=' volverNorma()'>Norma Legal:  "+normaObj.titulo+"</a>"
			+"> <a onclick=' volverArticulo()'>Articulo: "+(articuloObj.descripcion).substring(0, 150)+"...</a> >Modifica a otro articulo "); 
	cargarModificar(); 
}
function cargarModificar() {
	$("#btnCancelarModArticuloNorma").hide();
	$("#btnNuevoModArticuloNorma").show();
	$("#btnEliminarModArticuloNorma").hide();
	$("#btnGuardarModArticuloNorma").hide();
	callAjaxPost(URL + '/requisitos/norma/articulo/derogador', {
		id:articuloObj.id,
		tipocambioId:1}, 
		function(data){
			if(data.CODE_RESPONSE=="05"){
				banderaEdicion3=false;
				listFullArtModificador=data.list;  
				listFullNormas=data.listnorma;
				listFullArticulosOtros=data.articulos_otros_derogar; 
				$("#tblModArticuloNorma tbody tr").remove();
				listFullArtModificador.forEach(function(val,index){
					var listFullMensaje=(val.mensaje).split("\n");
					var mensaje="";
					listFullMensaje.forEach(function(val)
					{
						mensaje+="<p>"+val+"</p>";
					});
				listaArticulosSeleccionados=val.articulosUsadosId;
				$("#tblModArticuloNorma tbody").append(
						"<tr id='trmod"+val.id+"' onclick='editarModificacion("+index+")'>"
							+"<td id='modnorma"+val.id+"'>"+val.articulodermod.normalegal.titulo+"</td>" 
							+"<td id='modart"+val.id+"'>"+val.articulodermod.titulo+"</td>"
							+"<td id='modfechvers"+val.id+"'>"+val.fechaVersionTexto+"</td>"
							+"<td id='modmens"+val.id+"'>"+mensaje+"</td>" 
						+"</tr>"); 
				}); 
				completarBarraCarga();
				formatoCeldaSombreableTabla(true,"tblModArticuloNorma");
			}else{
				console.log("NOPNPO")
			}
		}); 
}

function editarModificacion(pindex) {

	if (!banderaEdicion3) {
		formatoCeldaSombreableTabla(false,"tblModArticuloNorma");
		modificarId = listFullArtModificador[pindex].id;
		modificarObj=listFullArtModificador[pindex]; 
		
		var mensaje=modificarObj.mensaje;
		$("#modmens"+modificarId).html("<textarea id='InputMensajeMod'   type='text' class='form-control'>"+mensaje+"</textarea>");
		
		var modificarNorma=modificarObj.articulodermod.normalegal.id;   
		var selNormaModificadaArticulo=crearSelectOneMenuOblig("inputNormaporModificar","verArticulosPorModificar()",listFullNormas,modificarNorma,"id","codigo")
		$("#modnorma" + modificarId).html(selNormaModificadaArticulo); 
		
		$('#inputNormaporModificar option[value="'+normaId+'"]').remove(); 
		verArticulosPorModificar();
		$("#btnCancelarModArticuloNorma").show();
		$("#btnNuevoModArticuloNorma").hide();
		$("#btnEliminarModArticuloNorma").show();
		$("#btnGuardarModArticuloNorma").show();
		banderaEdicion3 = true;
	}
}
function nuevoArticuloModificado() {
	if (!banderaEdicion3) {
		modificarId = 0; 
		 var selNormaModificadaArticulo=crearSelectOneMenuOblig("inputNormaporModificar","verArticulosPorModificar()",listFullNormas,"","id","codigo");  
		$("#tblModArticuloNorma tbody")
				.prepend(
					"<tr>"
						+"<td>"+ selNormaModificadaArticulo+"</td>"
						+"<td id='modart0'>...</td>"
						+"<td>...</td>"
						+"<td>"+"<textarea type='text' id='InputMensajeMod' class='form-control'></textarea>" +"</td>" 
					      //+"<td id='modtextoF0' >...</td>" 
					+ "</tr>"); 
		$('#inputNormaporModificar option[value="'+normaId+'"]').remove();
		verArticulosPorModificar();
		$("#btnCancelarModArticuloNorma").show();
		$("#btnNuevoModArticuloNorma").hide();
		$("#btnEliminarModArticuloNorma").hide();
		$("#btnGuardarModArticuloNorma").show(); 
		banderaEdicion3 = true;
		formatoCeldaSombreableTabla(false,"tblModArticuloNorma");
	} else {
		alert("Guarde primero.");
	}
} 

function guardarArticuloModificador() {

	var campoVacio = true;
	var fechaVer=convertirFechaTexto(obtenerFechaActual());  
	var mensaje=$("#InputMensajeMod").val();  
	var articuloId=articuloObj.id; 
	var tipoCambio=1; 
	var tipoder=$("#inputTipoDerogar").val(); 
	var articuloder=$("#inputArticuloDerogar").val(); 
	if (campoVacio) {
	var dataParam = {
			id : modificarId,
			fechaVersion:fechaVer,
			mensaje:mensaje,
			articulo:{id:articuloId},
			tipocambio:{id:tipoCambio}, 
			tipoderogar:{id:tipoder},
			articulodermod:{id:articuloder}
		}; 
		callAjaxPost(URL + '/requisitos/norma/articulo/derogador/save', dataParam,
				cargarModificar);	 
		
	} else {
		alert("Debe ingresar todos los campos.");
	} 	
} 
function cancelarNuevoModificadorArticulo(){
	cargarModificar();
} 

function eliminarArticuloModificador() {
	var r = confirm("¿Está seguro de eliminar el registro ?");
	if (r == true) {
		var dataParam = {
				id : modificarId,
		};
		callAjaxPost(URL + '/requisitos/norma/articulo/derogador/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarModificar();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}

function verArticulosPorModificar()
{
	var NormDerroSelect=$("#inputNormaporModificar").val();  
	var listFullArtModificar=[]; 
	
	listFullArticulosOtros.forEach(function(val,index){ 
		if(val.normalegal.id==NormDerroSelect){
			listFullArtModificar.push({id:val.id,titulo:val.titulo,descripcion:val.descripcion,normalegal:{id:val.normalegal.id}});
		}
	});  
	var msg="";  
	if(listFullArtModificar.length!=0){
		var articuloSelect;
		if(modificarId!=0){
			articuloSelect=modificarObj.articulodermod.id;  
		}else{
			articuloSelect=0;  
		} 
		var selArticulos=crearSelectOneMenuOblig("inputArticuloDerogar","",listFullArtModificar,articuloSelect,"id","descripcion")
		$("#modart" + modificarId).html(selArticulos);  
	}
	else
	{
		msg="Sin Articulos para Modificar ..."; 
		$("#modart"+modificarId+ " select").remove();
		$("#modart"+modificarId+ " div").remove();
		$("#modart"+modificarId+ " input").remove();
		$("#modart"+modificarId).append(
				"<input class='form-control' type='text' value='"+msg+"' disabled > </input>");
	}  
}
function verTextoFinalMod()
{
	var textoFinal=""; 
	var tipoder=$("#inputTipoDerogar").val();  
	if(tipoder==1)
	{
		textoFinal=articuloObj.descripcion + "   "+$("#InputMensajeMod").val();  
	}
	else 
	{
		textoFinal="...";
	}
	

	$("#modtextoF"+modificarId).html(textoFinal);
}


