var listaId,listaNombre;
var banderaEdicion88=false;
var listFullListas;
$(function(){
	$("#btnNuevoLista").attr("onclick", "javascript:nuevoLista();");
	$("#btnCancelarLista").attr("onclick", "javascript:cancelarNuevoListaContratista();");
	$("#btnGuardarLista").attr("onclick", "javascript:guardarLista();");
	$("#btnEliminarLista").attr("onclick", "javascript:eliminarLista();");
	

})
/**
 * 
 */
function volverListas(){
	$("#tabListas .container-fluid").hide();
	$("#divContainLista").show(); 
	$("#tabListas").find("h2").html("Listas de evaluación");
}
function cargarListasContratista() {
	$("#btnCancelarLista").hide();
	$("#btnNuevoLista").show();
	$("#btnEliminarLista").hide();
	$("#btnGuardarLista").hide();
	
	volverListas();
	callAjaxPost(URL + '/contratista/listas', 
			{empresaId : getSession("gestopcompanyid") }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion88=false;
				 listFullListas=data.list;
					$("#tblListas tbody tr").remove();
					listFullListas.forEach(function(val,index){
						var numActiv=0;
						var proyects=val.proyectos;
						proyects.forEach(function(val2,index2){
							if(val2.isActivo==1){
								numActiv++;
							}
						});
						$("#tblListas tbody").append(
								"<tr id='trlis"+val.id+"' onclick='editarLista("+index+")'>" +
								"<td id='lisnom"+val.id+"'>"+val.nombre+"</td>" 
								+"<td id='listpre"+val.id+"'>"+val.numPreguntas+"</td>"
								+"<td id='listpro"+val.id+"'>"+numActiv+" / "+val.proyectos.length+"</td>"
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblListas");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarLista(pindex) {


	if (!banderaEdicion88) {
		formatoCeldaSombreableTabla(false,"tblListas");
		listaId = listFullListas[pindex].id;
		
		
		var descripcion=listFullListas[pindex].nombre;
		listaNombre=descripcion;
	
		
	$("#lisnom" + listaId).html(
				"<input type='text' id='inputNombreLista' class='form-control'>");
		$("#inputNombreLista").val(descripcion);
		//
		var textInfo=$("#listpre"+listaId).text();
		$("#listpre"+listaId).addClass("linkGosst")
		.on("click",function(){verPreguntasLista();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo);
		//
		var textInfoProye=$("#listpro"+listaId).text();
		$("#listpro"+listaId).addClass("linkGosst")
		.on("click",function(){verProyectosLista();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfoProye);
		//
		banderaEdicion88 = true;
		$("#btnCancelarLista").show();
		$("#btnNuevoLista").hide();
		$("#btnEliminarLista").show();
		$("#btnGuardarLista").show();
		$("#btnGenReporte").hide();
		
		
		
		
	}
	
}

function verProyectosLista(){
	
	$("#tabListas .container-fluid").hide();
	$("#divProyListas").show();
	$("#tabListas").find("h2").html("<a onclick='volverListas()'> Lista "+listaNombre+"</a> > Proyectos Asociados");
	$("#tblProyListas tbody").html("");
	listFullListas.forEach(function(val,index){ 
		 if(val.id==listaId){ 
			var proyects=val.proyectos;
			proyects.every(function(val2,index2){
				
				$("#tblProyListas tbody").append(
						"<tr id=' "+val2.id+"'  >" +
						"<td id=' "+val2.id+"'>"+val2.titulo+"</td>" +
						"<td id=' "+val2.id+"'>"+val2.postulante.contratista.nombre+"</td>" + 
						"<td id=' "+val2.id+"'>"+val2.fechaInicioTexto+"</td>" + 
						"<td id=' "+val2.id+"'>"+val2.fechaFinTexto+"</td>" + 
						
						"<td id=' "+val2.id+"'>"+(val2.isActivo==1?"Activo":val2.estado.nombre)+"</td>" + 
						 
						"</tr>");
			 
				 
			 
					return true;
				 
			});
			 
		 }
	 
});
	
	
	
}

function nuevoLista() {
	if (!banderaEdicion88) {
		listaId = 0;
		var slcLista = crearSelectOneMenuOblig("slcLista", "",
				listFullListas, "", "id", "nombre");
		$("#tblListas tbody")
				.append(
						"<tr  >"
						
						+"<td>"+"<input type='text' id='inputNombreLista' " +
						" class='form-control'>"
						+"<td>0</td>"
						+"<td>0</td>"
						+"</td>"
								+ "</tr>");
		
		$("#btnCancelarLista").show();
		$("#btnNuevoLista").hide();
		$("#btnEliminarLista").hide();
		$("#btnGuardarLista").show();
		$("#btnGenReporte").hide();
		banderaEdicion88 = true;
		formatoCeldaSombreableTabla(false,"tblListas");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarLista() {
	cargarListasContratista();
}

function eliminarLista() {
	var r = confirm("¿Está seguro de eliminar la lista?");
	if (r == true) {
		var dataParam = {
				id : listaId,
		};
		callAjaxPost(URL + '/contratista/lista/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarListasContratista();
						break;
					default:
						alert("No se puede eliminar, hay proyectos asociados a esta lista.");
					}
				});
	}
}

function guardarLista() {

	var campoVacio = true;
	var descripcion=$("#inputNombreLista").val();  
 
if (descripcion.length<1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : listaId,
				nombre:descripcion,
				empresa :{empresaId :getSession("gestopcompanyid")}
			};

			callAjaxPost(URL + '/contratista/lista/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarListasContratista();
							break;
						default:
							console.log("Ocurrió un error al guardar la lista!");
						}
					});
			
		
		
			
			
			
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoListaContratista(){
	cargarListasContratista();
}




