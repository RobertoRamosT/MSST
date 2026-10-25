var tipoActivCriticaId,tipoActivCriticaObj;
var banderaEdicionTAC=false;
var listFullTipoActividad;
$(function(){
	$("#btnNuevoTipoActivCritica").attr("onclick", "javascript:nuevoTipoActivCritica();");
	$("#btnCancelarTipoActivCritica").attr("onclick", "javascript:cancelarNuevoTipoActivCriticaContratista();");
	$("#btnGuardarTipoActivCritica").attr("onclick", "javascript:guardarTipoActivCritica();");
	$("#btnEliminarTipoActivCritica").attr("onclick", "javascript:eliminarTipoActivCritica();");
	

})
/**
 * 
 */

function volverDivTipoActividades(){
	$("#tabActividadesCriticas .container-fluid").hide();
	$("#tabActividadesCriticas #divTipoActivCrit").show();
	$("#tabActividadesCriticas h2").html("Tipo de actividades críticas");
	
	
}
function cargarTipoActivCriticasContratista() {
	
	volverDivTipoActividades();
	$("#btnCancelarTipoActivCritica").hide();
	$("#btnNuevoTipoActivCritica").hide();
	$("#btnEliminarTipoActivCritica").hide();
	$("#btnGuardarTipoActivCritica").hide();
	 
	$("#btnGuardarTipoActivCritica").hide();
	callAjaxPost(URL + '/contratista/tipo_actividad_critica', 
			{empresaId : getSession("gestopcompanyid") }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicionTAC=false;
				 listFullTipoActividad=data.list;
					$("#tblTipoActivCriticas tbody tr").remove();
					listFullTipoActividad.forEach(function(val,index){
						
						$("#tblTipoActivCriticas tbody").append(
								"<tr id='dh54h"+val.id+"' " +
										//"onclick='editarTipoActivCritica("+index+")'" +
												">" +
								"<td id='qwd"+val.id+"'>"+val.nombre+"</td>" 
								+"<td class='linkGosst' onclick='verActividadesCriticas("+index+")'><i class='fa fa-list'></i>"+val.numActividades+"</td>"
								+"</tr>");
					});
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarTipoActivCritica(pindex) {


	if (!banderaEdicionTAC) {
		formatoCeldaSombreableTabla(false,"tblObservacion");
		tipoActivCriticaId = listFullTipoActividad[pindex].id;
		
		
		var descripcion=listFullTipoActividad[pindex].nombre;
		
	
		
	$("#clanom" + tipoActivCriticaId).html(
				"<input type='text' id='inputNombreTipoActivCritica' class='form-control'>");
		$("#inputNombreTipoActivCritica").val(descripcion);
		
		banderaEdicionTAC = true;
		$("#btnCancelarTipoActivCritica").show();
		$("#btnNuevoTipoActivCritica").hide();
		$("#btnEliminarTipoActivCritica").hide();
		$("#btnGuardarTipoActivCritica").hide();
		$("#btnGenReporte").hide();
		
		
		
		
	}
	
}


function nuevoTipoActivCritica() {
	if (!banderaEdicionTAC) {
		tipoActivCriticaId = 0;
		var slcTipoActivCritica = crearSelectOneMenuOblig("slcTipoActivCritica", "",
				listFullTipoActividad, "", "id", "nombre");
		$("#divTipoActivCrit tbody")
				.append(
						"<tr  >"
						
						+"<td>"+"<input type='text' id='inputNombreTipoActivCritica' " +
						" class='form-control'>"
						+"<td>0</td>"
						+"</td>"
								+ "</tr>");
		
		$("#btnCancelarTipoActivCritica").show();
		$("#btnNuevoTipoActivCritica").hide();
		$("#btnEliminarTipoActivCritica").hide();
		$("#btnGuardarTipoActivCritica").show();
		$("#btnGenReporte").hide();
		banderaEdicionTAC = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarTipoActivCritica() {
	cargarTipoActivCriticasContratista();
}

function eliminarTipoActivCritica() {
	var r = confirm("¿Está seguro de eliminar la clasificacion?");
	if (r == true) {
		var dataParam = {
				id : tipoActivCriticaId,
		};
		callAjaxPost(URL + '/contratista/clasificacion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarTipoActivCriticasContratista();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}

function guardarTipoActivCritica() {

	var campoVacio = true;
	var descripcion=$("#inputNombreTipoActivCritica").val();  
 
if (descripcion.length<1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : tipoActivCriticaId,
				nombre:descripcion,
				empresaId : getSession("gestopcompanyid")
			};

			callAjaxPost(URL + '/contratista/clasificacion/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarTipoActivCriticasContratista();
							break;
						default:
							console.log("Ocurrió un error al guardar la clasificacion!");
						}
					});
			
		
		
			
			
			
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoTipoActivCriticaContratista(){
	cargarTipoActivCriticasContratista();
}

//Activiades

//HUehuheu
var actividadCriticaId,actividadCriticaObj;
var banderaEdicionActC=false;
var listFullActividadCritica;
$(function(){
	$("#btnNuevoActivCritica").attr("onclick", "javascript:nuevoActivCritica();");
	$("#btnCancelarActivCritica").attr("onclick", "javascript:cancelarNuevoActivCritica();");
	$("#btnGuardarActivCritica").attr("onclick", "javascript:guardarActivCritica();");
	$("#btnEliminarActivCritica").attr("onclick", "javascript:eliminarActivCritica();");
	$("#btnNuevosActivCritica").attr("onclick", "javascript:nuevasActivCriticaImport();");
	
	$("#btnNuevoActivCritica").remove();
})
/**
 * 
 */
function volverActivCriticas(){
	$("#tabActividadesCriticas .container-fluid").hide();
	$("#tabActividadesCriticas #divActivCrit").show();
	$("#tabActividadesCriticas h2")
	.html("<a onclick='cargarTipoActivCriticasContratista()'>"+tipoActivCriticaObj.nombre+"</a> > Actividades Criticas");
}
function verActividadesCriticas(indexTipo) {
	tipoActivCriticaObj=listFullTipoActividad[indexTipo];
	tipoActivCriticaObj.index=indexTipo;
	$("#btnCancelarActivCritica").hide(); 
	$("#btnEliminarActivCritica").hide();
	$("#btnGuardarActivCritica").hide();
	$("#btnNuevosActivCritica").show();
	$("#btnGuardarActivCritica").attr("onclick", "javascript:guardarActivCritica();");
	
	volverActivCriticas();
	callAjaxPost(URL + '/contratista/actividades_critica', 
			{empresaId : getSession("gestopcompanyid")}, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicionActC=false;
				 listFullActividadCritica=data.list; 
					$("#tblActivCriticas tbody tr").remove();
					var contadorAux=0;
					listFullActividadCritica.forEach(function(val,index){
						
						if(val.tipo.id==tipoActivCriticaObj.id){
							contadorAux=contadorAux+1;
						$("#tblActivCriticas tbody").append(
								"<tr id='tractivcrit"+val.id+"' onclick='editarActivCritica("+index+")'>" +
								"<td>"+(contadorAux)+"</td>"+ 
								"<td id='activcnom"+val.id+"'>"+val.nombre+"</td>"+  
								"<td id='activcnum"+val.id+"'>"+val.numTrabajadores+"</td>" + 
								"</tr>");
						}
					});
					formatoCeldaSombreableTabla(true,"tblActivCriticas");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarActivCritica(pindex) { 
	if (!banderaEdicionActC) {
		formatoCeldaSombreableTabla(false,"tblActivCriticas");
		actividadCriticaId = listFullActividadCritica[pindex].id;
		actividadCriticaObj=listFullActividadCritica[pindex];
		// 
		var nombre=listFullActividadCritica[pindex].nombre;
		$("#activcnom" + actividadCriticaId).html(
				"<input type='text' id='inputNombreActivCritica' class='form-control'>");
		$("#inputNombreActivCritica").val(nombre);
		//  
		banderaEdicionActC = true;
		$("#btnCancelarActivCritica").show();
		$("#btnNuevoActivCritica").hide();
		$("#btnEliminarActivCritica").show();
		$("#btnGuardarActivCritica").show();
		$("#btnNuevosActivCritica").hide(); 
	} 
} 
function nuevasActivCriticaImport() {
	if (!banderaEdicionActC) {
		actividadCriticaId = 0;  
		$("#tblActivCriticas tbody")
				.prepend(
						"<tr  >"
						+"<td>...</td>" 
						+"<td>"+"<textarea type='text' id='areaNombreActivCritica' " 
						+" class='form-control' autofocus rows='4'> </textarea></td>" 
						+"<td>...</td>"
								+ "</tr>");
		
		$("#btnCancelarActivCritica").show();
		$("#btnNuevoActivCritica").hide();
		$("#btnEliminarActivCritica").hide();
		$("#btnGuardarActivCritica").show();
		$("#btnNuevosActivCritica").hide();
		
		$("#btnGuardarActivCritica").attr("onclick", "javascript:guardarActivCriticaMasivo();");
		banderaEdicionActC = true;
		formatoCeldaSombreableTabla(false,"tblActivCriticas");
	} else {
		alert("Guarde primero.");
	}
}   
function eliminarActivCritica() {
	var r = confirm("¿Está seguro de eliminar la actividad critica?");
	if (r == true) {
		var dataParam = {
				id : actividadCriticaId,
		};
		callAjaxPost(URL + '/contratista/actividad_critica/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verActividadesCriticas(tipoActivCriticaObj.index);
						break;
					default:
						alert("No se puede eliminar, hay items asociados a esta actividad critica.");
					}
				});
	}
}
function guardarActivCriticaMasivo() {

	var campoVacio = true;
	var nombre=$("#areaNombreActivCritica").val();
	var listExcel = nombre.split('\n');   
if (nombre.length<1 ) {
	campoVacio = false;
	}
var listActivCriticas=[];
listExcel.forEach(function(val,index){
	if (val.trim().length > 0) { 
	
	var dataParam = {
			id : 0,
			nombre:val,
			tipo:{id:tipoActivCriticaObj.id},
			empresaId :getSession("gestopcompanyid")
		};
	listActivCriticas.push(dataParam
			);
	}
});
		if (campoVacio) {
			callAjaxPost(URL + '/contratista/actividad_critica/masivo/save', listActivCriticas,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							verActividadesCriticas(tipoActivCriticaObj.index);
							break;
						default:
							console.log("Ocurrió un error al guardar la actividadCritica!");
						}
					});			
		} else {
			alert("Debe ingresar todos los campos.");
		}	
}
function guardarActivCritica() {

	var campoVacio = true;
	var nombre=$("#inputNombreActivCritica").val();    
if (nombre.length<1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : actividadCriticaId,
				nombre:nombre, 
				empresaId :getSession("gestopcompanyid")
			};

			callAjaxPost(URL + '/contratista/actividad_critica/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							verActividadesCriticas(tipoActivCriticaObj.index);
							break;
						default:
							console.log("Ocurrió un error al guardar la actividadCritica!");
						}
					});
			
		
		
			
			
			
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoActivCritica(){
	verActividadesCriticas(tipoActivCriticaObj.index);
}
