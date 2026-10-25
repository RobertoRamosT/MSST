var tipoId;
var banderaEdicion3=false;
var listClasificacion;
var listFullUnidades;
var listTrabajadores;
var contadorListTrab;
$(function(){
	$("#btnNuevoTipo").attr("onclick", "javascript:nuevoTipo();");
	$("#btnCancelarTipo").attr("onclick", "javascript:cancelarNuevoTipoContratista();");
	$("#btnGuardarTipo").attr("onclick", "javascript:guardarTipo();");
	$("#btnEliminarTipo").attr("onclick", "javascript:eliminarTipo();");
	

})
/**
 * 
 */
function cargarTiposContratista(){
    $("#btnCancelarTipo").hide();$("#btnNuevoTipo").show();$("#btnEliminarTipo").hide();
    $("#btnGuardarTipo").hide();
	
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))  
    };
    
    callAjaxPost(URL+'/contratista/tipos',dataParam,function(data){
        if(data.CODE_RESPONSE == "05"){
	    banderaEdicion3 = false;
	    listFullUnidades = data.listUnidades;listClasificacion = data.listClasificacion;
					
	    $("#tblTipos tbody tr").remove();
					
	    listFullUnidades.forEach(function(val,index){
	        var contratistasActivos = 0,proyectosActivos = 0,proyectosTotal = 0;

	        val.contratistas.forEach(function(val1,index1){
		    var proyects = val1.proyectosAsociados;
							
		    proyects.every(function(val2,index2){
		        proyectosTotal += 1;
								
		        if(val2.isActivo == 1){
			    proyectosActivos += 1;
			    return true;
			} 
		    });
							
		    proyects.every(function(val2,index2){
		        if(val2.isActivo == 1){
			    contratistasActivos += 1;
			
			    return false;
			}else{
			    return true;
			}
		    });
	        });
						
	        $("#tblTipos tbody").append(
		    "<tr id='trtip"+val.id+"' onclick='editarTipo("+index+")'>" +
           	        "<td id='divi"+val.id+"'>"+val.clasificacion.nombre+"</td>" +
			"<td id='tipnom"+val.id+"'>"+val.nombre+"</td>" + 
			"<td id='tipcont"+val.id+"'>"+contratistasActivos+"/"+val.contratistas.length+"</td>" + 
			"<td id='tipproy"+val.id+"'>"+proyectosActivos+"/"+proyectosTotal+"</td>" + 
		    "</tr>");
	    });
        }else{
	    console.log("NOPNPO");
	}
    });
}

function editarTipo(pindex) {


	if (!banderaEdicion3) {
		formatoCeldaSombreableTabla(false,"tblObservacion");
		tipoId = listFullUnidades[pindex].id;
		var slcClasificacion = crearSelectOneMenuOblig("slcClasificacion", "",
				listClasificacion, listFullUnidades[pindex].clasificacion.id, "id", "nombre");
		
		
		var descripcion=listFullUnidades[pindex].nombre;
		
	
		
	$("#tipnom" + tipoId).html(
				"<input type='text' id='inputNombreTipo' class='form-control'>");
		$("#inputNombreTipo").val(descripcion);

		$("#tipcont"+tipoId).html("<a onclick='verContratistasUnidad()'>" +
				$("#tipcont"+tipoId).text()+"</a>");
		$("#tipproy"+tipoId).html("<a onclick='verProyectosUnidad()'>" +
				$("#tipproy"+tipoId).text()+"</a>")
	$("#divi"+tipoId).html(slcClasificacion);
		banderaEdicion3 = true;
		$("#btnCancelarTipo").show();
		$("#btnNuevoTipo").hide();
		$("#btnEliminarTipo").show();
		$("#btnGuardarTipo").show();
		$("#btnGenReporte").hide();
		
		
		
		
	}
	
}
function verContratistasUnidad(){
	$("#modalContratistaUnidad").modal("show");
	$("#unidadContratistaAsoc").show();
	$("#unidadProyectoAsoc").hide();
	$("#tblUnidadCont tbody").html("");
	listFullUnidades.forEach(function(val,index){
		if(val.id==tipoId){
				val.contratistas.forEach(function(val1,index1){
				var proyectosActivos=0;
				var proyectosTotal=0;
				var proyects=val1.proyectosAsociados;
				proyects.every(function(val2,index2){
					
					proyectosTotal+=1;
					if(val2.isActivo==1){
						proyectosActivos+=1;
						return true;
					} 
				});
				 
				
				$("#tblUnidadCont tbody").append(
						"<tr id=' "+val1.id+"'  >" +
						"<td id=' "+val1.id+"'>"+val1.nombre+"</td>" +
						"<td id=' "+val1.id+"'>"+val1.contacto+"</td>" + 
						"<td id=' "+val1.id+"'>"+val1.contactoCorreo+"</td>" + 
						"<td id=' "+val1.id+"'>"+(proyectosActivos>0?"Si":"No")+"</td>" + 
						
						"</tr>");
				
				});
		}
	});
}
function verProyectosUnidad(){
	$("#modalContratistaUnidad").modal("show");
	$("#unidadProyectoAsoc").show();
	$("#unidadContratistaAsoc").hide();
	$("#tblUnidadProy tbody").html("");
	listFullUnidades.forEach(function(val,index){
		 if(val.id==tipoId){
			 val.contratistas.forEach(function(val1,index1){
				 
					var proyects=val1.proyectosAsociados;
					proyects.every(function(val2,index2){
						$("#tblUnidadProy tbody").append(
								"<tr id=' "+val2.id+"'  >" +
								"<td id=' "+val2.id+"'>"+val2.titulo+"</td>" +
								"<td id=' "+val2.id+"'>"+val1.nombre+"</td>" + 
								"<td id=' "+val2.id+"'>"+val2.fechaInicioTexto+"</td>" + 
								"<td id=' "+val2.id+"'>"+val2.fechaFinTexto+"</td>" + 
								
								"<td id=' "+val2.id+"'>"+(val2.isActivo==1?"Activo":val2.estado.nombre)+"</td>" + 
								 
								"</tr>");
					 
						 
					 
							return true;
						 
					});
					 
					
					
					
				});
			 
		 }
		
		
	});
	
}
function nuevoTipo() {
	if (!banderaEdicion3) {
		tipoId = 0;
		var slcClasificacion = crearSelectOneMenuOblig("slcClasificacion", "",
				listClasificacion, "", "id", "nombre");
		$("#tblTipos tbody")
				.append(
						"<tr  >"
						
						+ "<td>"+slcClasificacion+"</td>"
						+"<td>"+"<input type='text' id='inputNombreTipo' " +
						" class='form-control'>"
						+"</td>"
								+ "<td>...</td>"
								+ "<td>...</td>"
								+ "</tr>");
		
		$("#btnCancelarTipo").show();
		$("#btnNuevoTipo").hide();
		$("#btnEliminarTipo").hide();
		$("#btnGuardarTipo").show();
		$("#btnGenReporte").hide();
		banderaEdicion3 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarTipo() {
	cargarTiposContratista();
}

function eliminarTipo() {
	var r = confirm("¿Está seguro de eliminar el tipo?");
	if (r == true) {
		var dataParam = {
				id : tipoId,
		};
		callAjaxPost(URL + '/contratista/tipo/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarTiposContratista();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}

function guardarTipo() {

	var campoVacio = true;
	var clasificacion=$("#slcClasificacion").val();
	var descripcion=$("#inputNombreTipo").val();  
 
if (clasificacion == -1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : tipoId,
				nombre:descripcion,
				clasificacion :{ id:clasificacion}
			};

			callAjaxPost(URL + '/contratista/tipo/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarTiposContratista();
							break;
						default:
							console.log("Ocurrió un error al guardar la programacion!");
						}
					});
			
		
		
			
			
			
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoTipoContratista(){
	cargarTiposContratista();
}




