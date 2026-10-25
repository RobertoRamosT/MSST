var banderaEdicion3=false;
var derogarId,derogarObj;
var tipoder;
var listFullArtDerogador,listFullArticulosOtros,listFullNormas,listTipoDerogacion;
var listaArticulosSeleccionados,listaIdArticulosUsados;
$(function(){
	$("#btnNuevoDerogaArticuloNorma").attr("onclick", "javascript:nuevoArticuloDerogado();");
	$("#btnCancelarDerogaArticuloNorma").attr("onclick", "javascript:cancelarNuevoDerogadorArticulo();");
	$("#btnGuardarDerogaArticuloNorma").attr("onclick", "javascript:guardarArticuloDerogador();");
	$("#btnEliminarDerogaArticuloNorma").attr("onclick", "javascript:eliminarArticuloDerogado();"); 
}) 
function verDerogarArticuloNorma(){ 
	$("#tabNormaLegal .container-fluid").hide();
	$("#tabNormaLegal #divContainArticulos").hide(); 
	$("#tabNormaLegal #divContainDerogaArticuloNorma").show();
	$("#tabNormaLegal").find("h2")
	.html("<a onclick=' volverNorma()'>Norma Legal:  "+normaObj.titulo+"</a>"
			+"> <a onclick=' volverArticulo()'>Articulo: "+(articuloObj.descripcion).substring(0, 150)+"...</a> >Derogar a otro articulo "); 
	cargarDerogar();
}
function cargarDerogar() {
	$("#btnCancelarDerogaArticuloNorma").hide();
	$("#btnNuevoDerogaArticuloNorma").show();
	$("#btnEliminarDerogaArticuloNorma").hide();
	$("#btnGuardarDerogaArticuloNorma").hide();
	callAjaxPost(URL + '/requisitos/norma/articulo/derogador', {
		id:articuloObj.id,
		tipocambioId:2}, 
		function(data){
			if(data.CODE_RESPONSE=="05"){
				banderaEdicion3=false;
				listFullArtDerogador=data.list;  
				listFullNormas=data.listnorma;
				listFullArticulosOtros=data.articulos_otros_derogar;
				listTipoDerogacion=data.tipo_derogacion
				$("#tblDerogaArticuloNorma tbody tr").remove();
				listFullArtDerogador.forEach(function(val,index){
					var listFullMensaje=(val.mensaje).split("\n");
					var mensaje="";
					listFullMensaje.forEach(function(val)
					{
						mensaje+="<p>"+val+"</p>";
					});
				listaArticulosSeleccionados=val.articulosUsadosId;
				$("#tblDerogaArticuloNorma tbody").append(
						"<tr id='trder"+val.id+"' onclick='editarDerogacion("+index+")'>"
							+"<td id='dernorma"+val.id+"'>"+val.articulodermod.normalegal.titulo+"</td>" 
							+"<td id='derart"+val.id+"'>"+val.articulodermod.titulo+"</td>"
							+"<td id='dertipo"+val.id+"'>"+val.tipoderogar.nombre+"</td>"
							+"<td id='derfechvers"+val.id+"'>"+val.fechaVersionTexto+"</td>"
							+"<td id='dermens"+val.id+"'>"+mensaje+"</td>"
						+"</tr>");
				
				if(val.tipoderogar.id==2){
					$("#dertextoF"+val.id).html("...");
				}
				});
				//listaIdArticulosUsados=listaArticulosSeleccionados.split(",");
				completarBarraCarga();
				formatoCeldaSombreableTabla(true,"tblDerogaArticuloNorma");
			}else{
				console.log("NOPNPO")
			}
		}); 
}

function editarDerogacion(pindex) {

	if (!banderaEdicion3) {
		formatoCeldaSombreableTabla(false,"tblDerogaArticuloNorma");
		derogarId = listFullArtDerogador[pindex].id;
		derogarObj=listFullArtDerogador[pindex]; 
		
		var tipoDerogacion=derogarObj.tipoderogar.id;  
		
		var selTipoDerogar=crearSelectOneMenuOblig("inputTipoDerogar","verTextoFinal()",listTipoDerogacion,tipoDerogacion,"id","nombre")
		$("#dertipo" + derogarId).html(selTipoDerogar); 
		
		var mensaje=derogarObj.mensaje;
		$("#dermens"+derogarId).html("<textarea id='InputMensajeDer' type='text' class='form-control'>"+mensaje+"</textarea>");
		
		var derrogarNorma=derogarObj.articulodermod.normalegal.id;   
		
		var selNormaDerogadaArticulo=crearSelectOneMenuOblig("inputNormaporDerogar","verArticulosPorDerogar()",listFullNormas,derrogarNorma,"id","codigo")
		$("#dernorma" + derogarId).html(selNormaDerogadaArticulo); 
		
		$('#inputNormaporDerogar option[value="'+normaId+'"]').remove(); 
		verArticulosPorDerogar();
		verTextoFinal();
		$("#btnCancelarDerogaArticuloNorma").show();
		$("#btnNuevoDerogaArticuloNorma").hide();
		$("#btnEliminarDerogaArticuloNorma").show();
		$("#btnGuardarDerogaArticuloNorma").show();
		banderaEdicion3 = true;
	}
}
function nuevoArticuloDerogado() {
	if (!banderaEdicion3) {
		derogarId = 0; 
		var selTipoDerogar=crearSelectOneMenuOblig("inputTipoDerogar","verTextoFinal()",listTipoDerogacion,"","id","nombre")
		var selNormaDerogadaArticulo=crearSelectOneMenuOblig("inputNormaporDerogar","verArticulosPorDerogar()",listFullNormas,"","id","codigo");  
		$("#tblDerogaArticuloNorma tbody")
				.prepend(
					"<tr>"
						+"<td>"+ selNormaDerogadaArticulo+"</td>"
						+"<td id='derart0'>...</td>"
						+"<td>"+ selTipoDerogar+"</td>"
						+"<td>...</td>" 
						+"<td id='dermens0'>"+"<textarea type='text' id='InputMensajeDer' class='form-control'></textarea>" +"</td>" 

					+ "</tr>"); 
		$('#inputNormaporDerogar option[value="'+normaId+'"]').remove();
		verArticulosPorDerogar();		
		verTextoFinal();
		$("#btnCancelarDerogaArticuloNorma").show();
		$("#btnNuevoDerogaArticuloNorma").hide();
		$("#btnEliminarDerogaArticuloNorma").hide();
		$("#btnGuardarDerogaArticuloNorma").show(); 
		banderaEdicion3 = true;
		formatoCeldaSombreableTabla(false,"tblDerogaArticuloNorma");
	} else {
		alert("Guarde primero.");
	}
} 

function guardarArticuloDerogador() {

	var campoVacio = true;
	var fechaVer=convertirFechaTexto(obtenerFechaActual());  
	var mensaje;  
	var articuloId=articuloObj.id; 
	var tipoCambio=2; 
	var tipoder=$("#inputTipoDerogar").val(); 
	var articuloder=$("#inputArticuloDerogar").val(); 
	
	if(tipoder==1){
		mensaje=$("#InputMensajeDer").val()
	}else{
		mensaje="...";
	}
	
	if(campoVacio){
		/*var estado=false;  
		listaIdArticulosUsados.forEach(function(val)
		{
			if(val==articuloder)
			{
				estado=true;
			}
		}); 
		if(!estado)
		{*/
	var dataParam = {
			id : derogarId,
			fechaVersion:fechaVer,
			mensaje:mensaje,
			articulo:{id:articuloId},
			tipocambio:{id:tipoCambio}, 
			tipoderogar:{id:tipoder},
			articulodermod:{id:articuloder}
		};

		callAjaxPost(URL + '/requisitos/norma/articulo/derogador/save', dataParam,
				cargarDerogar);	  
		/*}
		else 
		{
			alert("El articulo seleccionado ya ha sido derogado o modificado por otro.")
		}*/
		
	}else{
		alert("Debe ingresar todos los campos.");
	} 	
}
 
function cancelarNuevoDerogadorArticulo(){
	cargarDerogar();
} 

function eliminarArticuloDerogado(){
	var r = confirm("¿Está seguro de eliminar el registro ?");
	if (r == true) {
		var dataParam = {
				id : derogarId,
		};
		callAjaxPost(URL + '/requisitos/norma/articulo/derogador/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarDerogar();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}
function verArticulosPorDerogar(){
	var NormDerroSelect=$("#inputNormaporDerogar").val();  
	var listFullArtDerroga=[]; 
	
	listFullArticulosOtros.forEach(function(val,index){ 
		if(val.normalegal.id==NormDerroSelect){
			listFullArtDerroga.push({id:val.id,titulo:val.titulo,descripcion:val.descripcion,normalegal:{id:val.normalegal.id}});
		}
	});  
	var msg="";  
	if(listFullArtDerroga.length!=0){
		var articuloSelect;
		if(derogarId!=0){
			articuloSelect=derogarObj.articulodermod.id;  
		}else{
			articuloSelect=0;
			/*listaIdArticulosUsados.forEach(function(val)
			{
				listFullArtDerroga.forEach(function(val1,index)
				{
					if(val==val1.id)
					{
						listFullArtDerroga.splice(index, 1);
					}
				});
			});*/ 
		} 
		
		var selArticulos=crearSelectOneMenuOblig("inputArticuloDerogar","",listFullArtDerroga,articuloSelect,"id","descripcion")
		$("#derart" + derogarId).html(selArticulos); 
	}
	else
	{
		msg="Sin Articulos para Derrogar ..."; 
		$("#derart"+derogarId+ " select").remove();
		$("#derart"+derogarId+ " div").remove();
		$("#derart"+derogarId+ " input").remove();
		$("#derart"+derogarId).append(
				"<input class='form-control' type='text' value='"+msg+"' disabled > </input>");
	}  
}
function verTextoFinal(){
	var textoFinal=""; 
	var tipoder=$("#inputTipoDerogar").val();  
	
	if(tipoder==2){
		 $("#dermens"+derogarId+" textarea").remove();
		 $("#dermens"+derogarId).html("<textarea type='text' id='InputMensajeDer' class='form-control' disabled></textarea>");
	}else if(tipoder==1){
		 $("#InputMensajeDer").prop("disabled",false);
	}  
}

