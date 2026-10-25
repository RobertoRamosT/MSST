/**
 * 
 */
var preguntaId,preguntaObj;
var banderaEdicion3=false;
var listFullPreguntas,listCategoriasPregunta;
$(function(){
	$("#btnNuevoPregunta").attr("onclick", "javascript:nuevoPregunta();");
	$("#btnCancelarPregunta").attr("onclick", "javascript:cancelarNuevoPreguntaPsico();");
	$("#btnGuardarPregunta").attr("onclick", "javascript:guardarPregunta();");
	$("#btnEliminarPregunta").attr("onclick", "javascript:eliminarPregunta();");
	$("#btnNuevosPregunta").attr("onclick", "javascript:nuevasPreguntaImport();");
	
	$("#btnNuevoPregunta").remove();
})
/**
 * 
 */
function volverPreguntas(){
	$("#divGeneralPsicologia .container-fluid").hide();
	$("#divGeneralPsicologia #divContainPreguntas").show();
	$( "h2").html("<a onclick='volverListas()'>"+listaObj.nombre+"</a> > Preguntas de evaluación");
}
function cargarPreguntasListaPsicologia() {
    
   var valorResize= 180;
   resizeDivWrapper("wrapperPreguntas",valorResize);
    
	$("#btnCancelarPregunta").hide();
	$("#btnNuevoPregunta").show();
	$("#btnEliminarPregunta").hide();
	$("#btnGuardarPregunta").hide();
	$("#btnNuevosPregunta").show();
	
	$("#btnGuardarPregunta").attr("onclick", "javascript:guardarPregunta();");
	volverPreguntas();
	callAjaxPost(URL + '/psicologia/preguntas', 
			{id : listaObj.id}, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion3=false;
				 listFullPreguntas=data.list;
				 listCategoriasPregunta=data.categoria;
					$("#tblPreguntas tbody tr").remove();
					listFullPreguntas.forEach(function(val,index){
						
						$("#tblPreguntas tbody").append(
								"<tr id='trpre"+val.id+"' onclick='editarPregunta("+index+")'>" +
								"<td>"+(index+1)+"</td>"+
								"<td id='precat"+val.id+"'>"+val.categoria.nombre+"</td>"  +
								"<td id='prenom"+val.id+"'>"+val.nombre+"</td>"  
								 
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblPreguntas");
				}else{
					console.log("NOPNPO")
				}
				goheadfixedY("#tblPreguntas","#wrapperPreguntas");
			});
}

function editarPregunta(pindex) {


	if (!banderaEdicion3) {
		formatoCeldaSombreableTabla(false,"tblPreguntas");
		preguntaId = listFullPreguntas[pindex].id;
		preguntaObj=listFullPreguntas[pindex];
		//
		var categoria=listFullPreguntas[pindex].categoria.id;
		var selCategoriaPregunta=crearSelectOneMenuOblig("selCategoriaPregunta", "", listCategoriasPregunta, categoria,
				"id","nombre");
		$("#precat"+preguntaId).html(selCategoriaPregunta)
		
		var nombre=listFullPreguntas[pindex].nombre;
		$("#prenom" + preguntaId).html(
				"<input type='text' id='inputNombrePregunta' class='form-control'>");
		$("#inputNombrePregunta").val(nombre);
		//  
		banderaEdicion3 = true;
		$("#btnCancelarPregunta").show();
		$("#btnNuevoPregunta").hide();
		$("#btnEliminarPregunta").show();
		$("#btnGuardarPregunta").show();
		$("#btnNuevosPregunta").hide();
		
		
		
	}
	
}

function nuevasPreguntaImport() {
	if (!banderaEdicion3) {
		preguntaId = 0; 
		var selCategoriaPregunta=crearSelectOneMenuOblig("selCategoriaPregunta", "", listCategoriasPregunta, "",
				"id","nombre");
		$("#tblPreguntas:first tbody")
				.prepend(
						"<tr  >"
						+"<td>...</td>"
						+"<td>"+selCategoriaPregunta+"</td>"
						+"<td>"+"<textarea type='text' id='areaNombrePregunta' " 
						+" class='form-control' autofocus rows='4'> </textarea></td>" 
								+ "</tr>");
		
		$("#btnCancelarPregunta").show();
		$("#btnNuevoPregunta").hide();
		$("#btnEliminarPregunta").hide();
		$("#btnGuardarPregunta").show();
		$("#btnNuevosPregunta").hide();
		
		$("#btnGuardarPregunta").attr("onclick", "javascript:guardarPreguntaMasivo();");
		banderaEdicion3 = true;
		formatoCeldaSombreableTabla(false,"tblPreguntas");
	} else {
		alert("Guarde primero.");
	}
}
function nuevoPregunta() {
	if (!banderaEdicion3) {
		preguntaId = 0; 
		var selCategoriaPregunta=crearSelectOneMenuOblig("selCategoriaPregunta", "", listCategoriasPregunta, "",
				"id","nombre");
		$("#tblPreguntas tbody")
				.prepend(
						"<tr  >"
						+"<td>...</td>"
						+"<td>"+selCategoriaPregunta+"</td>"
						+"<td>"+"<input type='text' id='inputNombrePregunta' " +
						" class='form-control' autofocus></td>" 
								+ "</tr>");
		
		$("#btnCancelarPregunta").show();
		$("#btnNuevoPregunta").hide();
		$("#btnEliminarPregunta").hide();
		$("#btnGuardarPregunta").show();
		$("#btnNuevosPregunta").hide();
		banderaEdicion3 = true;
		formatoCeldaSombreableTabla(false,"tblPreguntas");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarPregunta() {
	cargarPreguntasListaPsicologia();
}

function eliminarPregunta() {
	var r = confirm("¿Está seguro de eliminar la pregunta?");
	if (r == true) {
		var dataParam = {
				id : preguntaId,
		};
		callAjaxPost(URL + '/psicologia/pregunta/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarPreguntasListaPsicologia();
						break;
					default:
						alert("No se puede eliminar, hay items asociados a esta pregunta.");
					}
				});
	}
}
function guardarPreguntaMasivo() {

	var campoVacio = true;
	var nombre=$("#areaNombrePregunta").val();
	var listExcel = nombre.split('\n');
	
	var categoria=$("#selCategoriaPregunta").val();   
if (nombre.length<1 ) {
	campoVacio = false;
	}
var listPreguntas=[];
listExcel.forEach(function(val,index){
	if (val.trim().length < 1) {
		alert("Hay filas vacias") ;
		campoVacio=false;
	}
	var dataParam = {
			id : preguntaId,
			nombre:val,
			categoria:{id:categoria},
			examenPsicologia :{id :listaObj.id}
		};
	listPreguntas.push(dataParam
			);
});
		if (campoVacio) {

			

			callAjaxPost(URL + '/psicologia/pregunta/masivo/save', listPreguntas,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarPreguntasListaPsicologia();
							break;
						default:
							console.log("Ocurrió un error al guardar la pregunta!");
						}
					});
			
		
		
			
			
			
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}
function guardarPregunta() {

	var campoVacio = true;
	var nombre=$("#inputNombrePregunta").val();   
	var categoria=$("#selCategoriaPregunta").val();   
if (nombre.length<1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : preguntaId,
				nombre:nombre,
				categoria:{id:categoria},
				examenPsicologia :{id :listaObj.id}
			};

			callAjaxPost(URL + '/psicologia/pregunta/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarPreguntasListaPsicologia();
							break;
						default:
							console.log("Ocurrió un error al guardar la pregunta!");
						}
					});
			
		
		
			
			
			
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoPreguntaPsico(){
	cargarPreguntasListaPsicologia();
}

