/**
 * 
 */
var opcionId,opcionObj;
var banderaEdicion5=false;
var listFullOpcions;
$(function(){
	$("#btnNuevoOpcion").attr("onclick", "javascript:nuevoOpcion();");
	$("#btnCancelarOpcion").attr("onclick", "javascript:cancelarNuevoOpcionPsico();");
	$("#btnGuardarOpcion").attr("onclick", "javascript:guardarOpcion();");
	$("#btnEliminarOpcion").attr("onclick", "javascript:eliminarOpcion();");
 
})
/**
 * 
 */
function volverOpcions(){
	$("#divGeneralPsicologia .container-fluid").hide();
	$("#divGeneralPsicologia #divContainOpciones").show();
	$( "h2").html("<a onclick='volverListas()'>"+listaObj.nombre+"</a> > Opciones de evaluación");
}
function cargarOpcionesListaPsicologia() {
	$("#btnCancelarOpcion").hide();
	$("#btnNuevoOpcion").show();
	$("#btnEliminarOpcion").hide();
	$("#btnGuardarOpcion").hide();
	
	volverOpcions();
	callAjaxPost(URL + '/psicologia/opciones', 
			{id : listaObj.id}, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion5=false;
				 listFullOpcions=data.list; 
					$("#tblOpciones tbody tr").remove();
					listFullOpcions.forEach(function(val,index){
						
						$("#tblOpciones tbody").append(
								"<tr id='tropc"+val.id+"' onclick='editarOpcion("+index+")'>" +
								"<td>"+(index+1)+"</td>"+
								"<td id='opcinom"+val.id+"'>"+val.nombre+"</td>"  +
								 +"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblOpciones");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarOpcion(pindex) {


	if (!banderaEdicion5) {
		formatoCeldaSombreableTabla(false,"tblOpciones");
		opcionId = listFullOpcions[pindex].id;
		opcionObj=listFullOpcions[pindex];
		
		var nombre=listFullOpcions[pindex].nombre;
		$("#opcinom" + opcionId).html(
				"<input type='text' id='inputNombreOpcion' class='form-control'>");
		$("#inputNombreOpcion").val(nombre);
		// 
		 
		banderaEdicion5 = true;
		$("#btnCancelarOpcion").show();
		$("#btnNuevoOpcion").hide();
		$("#btnEliminarOpcion").show();
		$("#btnGuardarOpcion").show();
		
		
		
		
	}
	
}


function nuevoOpcion() {
	if (!banderaEdicion5) {
		opcionId = 0; 
		$("#tblOpciones tbody")
				.prepend(
						"<tr  >"
						+"<td>...</td>"
						+"<td>"+"<input type='text' id='inputNombreOpcion' " +
						" class='form-control' autofocus></td>" 
						 
								+ "</tr>");
		$("#inputNombreOpcion").focus();
		$("#btnCancelarOpcion").show();
		$("#btnNuevoOpcion").hide();
		$("#btnEliminarOpcion").hide();
		$("#btnGuardarOpcion").show(); 
		banderaEdicion5 = true;
		formatoCeldaSombreableTabla(false,"tblOpciones");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarOpcion() {
	cargarOpcionesListaPsicologia();
}

function eliminarOpcion() {
	var r = confirm("¿Está seguro de eliminar la opcion?");
	if (r == true) {
		var dataParam = {
				id : opcionId,
		};
		callAjaxPost(URL + '/psicologia/opcion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarOpcionesListaPsicologia();
						break;
					default:
						alert("No se puede eliminar, hay items asociados a esta opcion.");
					}
				});
	}
}

function guardarOpcion() {

	var campoVacio = true;
	var nombre=$("#inputNombreOpcion").val();   
if (nombre.length<1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : opcionId,
				nombre:nombre, 
				examenPsicologia :{id :listaObj.id}
			};

			callAjaxPost(URL + '/psicologia/opcion/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarOpcionesListaPsicologia();
							break;
						default:
							console.log("Ocurrió un error al guardar la opcion!");
						}
					});
			
		
		
			
			
			
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoOpcionPsico(){
	cargarOpcionesListaPsicologia();
}

