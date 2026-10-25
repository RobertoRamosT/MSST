var preguntaId;
var banderaEdicion99=false;
var listFullPreguntas;
$(function(){
	$("#btnNuevoPregunta").attr("onclick", "javascript:nuevoPregunta();");
	$("#btnCancelarPregunta").attr("onclick", "javascript:cancelarNuevoPreguntaContratista();");
	$("#btnGuardarPregunta").attr("onclick", "javascript:guardarPregunta();");
	$("#btnEliminarPregunta").attr("onclick", "javascript:eliminarPregunta();");
	

})
/**
 * 
 */
function verPreguntasLista(){
	$("#divContainLista").hide();
	$("#divContainPreg").show();
	$("#tabListas").find("h2").html("<a onclick='volverListas()'>Lista '"+listaNombre+"'</a> > Preguntas");
	cargarPreguntasContratista();
}
function cargarPreguntasContratista() {
	$("#btnCancelarPregunta").hide();
	$("#btnNuevoPregunta").show();
	$("#btnEliminarPregunta").hide();
	$("#btnGuardarPregunta").hide();
	callAjaxPost(URL + '/contratista/lista/preguntas', 
				{id: listaId}
			, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion99=false;
				 listFullPreguntas=data.list;
					$("#tblPreguntas tbody tr").remove();
					listFullPreguntas.forEach(function(val,index){
						
						$("#tblPreguntas tbody").append(
								"<tr id='trlis"+val.id+"' onclick='editarPregunta("+index+")'>" 
								+"<td>"+(index+1)+"</td>"
								+"<td id='listpnom"+val.id+"'>"+val.nombre+"</td>"  
								
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblPreguntas");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarPregunta(pindex) {


	if (!banderaEdicion99) {
		formatoCeldaSombreableTabla(false,"tblPreguntas");
		preguntaId = listFullPreguntas[pindex].id;
		
		
		var descripcion=listFullPreguntas[pindex].nombre;
		
	
		
	$("#listpnom" + preguntaId).html(
				"<input type='text' id='inputNombrePregunta' class='form-control'>");
		$("#inputNombrePregunta").val(descripcion);
		//
		 
		banderaEdicion99 = true;
		$("#btnCancelarPregunta").show();
		$("#btnNuevoPregunta").hide();
		$("#btnEliminarPregunta").show();
		$("#btnGuardarPregunta").show();
		$("#btnGenReporte").hide();
		
		
		
		
	}
	
}


function nuevoPregunta() {
	if (!banderaEdicion99) {
		preguntaId = 0;
		var slcPregunta = crearSelectOneMenuOblig("slcPregunta", "",
				listFullPreguntas, "", "id", "nombre");
		$("#tblPreguntas tbody")
				.append(
						"<tr  >"
						+"<td>...</td>" 
						+"<td>"+"<input type='text' id='inputNombrePregunta' " +
						" class='form-control'>"
						
						+"</td>"
								+ "</tr>");
		formatoCeldaSombreableTabla(false,"tblPreguntas");
		$("#btnCancelarPregunta").show();
		$("#btnNuevoPregunta").hide();
		$("#btnEliminarPregunta").hide();
		$("#btnGuardarPregunta").show();
		$("#btnGenReporte").hide();
		banderaEdicion99 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarPregunta() {
	cargarPreguntasContratista();
}

function eliminarPregunta() {
	var r = confirm("¿Está seguro de eliminar la pregunta?");
	if (r == true) {
		var dataParam = {
				id : preguntaId,
		};
		callAjaxPost(URL + '/contratista/lista/pregunta/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarPreguntasContratista();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}

function guardarPregunta() {

	var campoVacio = true;
	var descripcion=$("#inputNombrePregunta").val();  
 
if (descripcion.length<1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : preguntaId,
				nombre:descripcion,
				listaAsociada :{id:listaId}
			};

			callAjaxPost(URL + '/contratista/lista/pregunta/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarPreguntasContratista();
							break;
						default:
							console.log("Ocurrió un error al guardar la pregunta!");
						}
					});
			
		
		
			
			
			
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoPreguntaContratista(){
	cargarPreguntasContratista();
}




