var anexoId,anexoObj;
var banderaEdicion3=false;
var listTipoAnexo;
var listFullAnexo;

$(function(){
    $("#btnNuevoAnexo").attr("onclick", "javascript:nuevoAnexo();");
    $("#btnCancelarAnexo").attr("onclick", "javascript:cancelarAnexo();");
    $("#btnGuardarAnexo").attr("onclick", "javascript:guardarAnexo();");
    $("#btnEliminarAnexo").attr("onclick", "javascript:eliminarAnexo();");

})
/**
 * 
 */
function cargarAnexos() {
	$("#btnCancelarAnexo").hide();
	$("#btnNuevoAnexo").show();
	$("#btnEliminarAnexo").hide();
	$("#btnGuardarAnexo").hide();
	callAjaxPost(URL + '/procedimientoseguridad/version/anexo', 
			{versionProcedimiento:{id:versionProcedimientoObj.id}}, 
			   function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion3=false;
					listTipoAnexo=data.listTipo;
					listFullAnexo = data.list;
					$("#tblAnexo tbody tr").remove();
					
					listFullAnexo.forEach(function(val,index){
						 
					$("#tblAnexo tbody").append(
						//Editar sufijo
						"<tr id='tranexo"+val.id+"' onclick='editarAnexo("+index+")'>" +
							"<td id='tdcodigo"+val.id+"'>"+val.codigo+"</td>" + 
							"<td id='tdtitulo"+val.id+"'>"+val.titulo+"</td>" + 
							"<td id='tdarchivoanexo"+val.id+"'>"+val.evidenciaNombre+"</td>" + 
							//Agregar filas
						"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblAnexo");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarAnexo(pindex) {
	if (!banderaEdicion3) {
	    	formatoCeldaSombreableTabla(false,"tblAnexo");
		anexoId = listFullAnexo[pindex].id;
		anexoObj = listFullAnexo[pindex];
		
		$("#tranexo"+anexoId).addClass("fila-edicion");
		
		$("#tdcodigo"+ anexoId).html("<input type='text' id='inputCodigo' class='form-control'>");
		$("#inputCodigo").val(anexoObj.codigo);
		
		$("#tdtitulo"+ anexoId).html("<input type='text' id='inputTitulo' class='form-control'>");
		$("#inputTitulo").val(anexoObj.titulo);
		
		var optionEvidenciaAnexo={
			    isImage: false,
			    container:"#tdarchivoanexo"+anexoId,
			    idAux:"Arch",
			    esNuevo:false,
			    functionCall:function(){},
			    evidenciaNombre:anexoObj.evidenciaNombre,
			    descargaUrl:"/procedimientoseguridad/version/anexo/evidencia_archivo?id="+anexoId+"",
			}
		
		crearFormEvidenciaCompleta(optionEvidenciaAnexo);
		
		
		banderaEdicion3 = true;
		$("#btnCancelarAnexo").show();
		$("#btnNuevoAnexo").hide();
		$("#btnEliminarAnexo").show();
		$("#btnGuardarAnexo").show();
	}
	
} 
function nuevoAnexo() {
	if (!banderaEdicion3) {
	    	formatoCeldaSombreableTabla(false,"tblAnexo");
	    	anexoObj = {id : 0};
		anexoId = 0; 
		$("#tblAnexo tbody").prepend(
			"<tr>"+ 
			   "<td><input type='text' id='inputCodigo' class='form-control'></td>"+
			   "<td><input type='text' id='inputTitulo' class='form-control'></td>"+
		           "<td id='tdarchivoanexo0'></td>"+
			   //Agregar necesarios
			"</tr>");
		
		var optionEvidenciaAnexo={
			    isImage: false,
			    container:"#tdarchivoanexo"+anexoId,
			    idAux:"Arch",
			    esNuevo:true,
			    evidenciaNombre:"",
			    functionCall:function(){},
			    descargaUrl:"",
			}
			
		crearFormEvidenciaCompleta(optionEvidenciaAnexo);
		
		$("#btnCancelarAnexo").show();
		$("#btnNuevoAnexo").hide();
		$("#btnEliminarAnexo").hide();
		$("#btnGuardarAnexo").show();
		banderaEdicion3 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarAnexo() {
	cargarAnexos();
}

function eliminarAnexo() {
	var r = confirm("¿Está seguro de eliminar el anexo?");
	if (r == true) {
		var dataParam={
			id:anexoId,
		    };
		callAjaxPost(URL + '/procedimientoseguridad/version/anexo/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    cargarAnexos();
					    break;
					default:
					    alert("Ocurrió un error al eliminar el anexo!");
					}
				});
	}
}

function guardarAnexo() {

   var campoVacio = true;
   //Programa lógica de acceso de guardado
   var codigo=$("#inputCodigo").val();
   var titulo=$("#inputTitulo").val();
   
   if(campoVacio){
   var dataParam={
    	   id:anexoId,
    	   codigo:codigo,
    	   titulo:titulo,
    	   versionProcedimiento:{id:versionProcedimientoObj.id}
       };
     
   callAjaxPost(URL + '/procedimientoseguridad/version/anexo/save', dataParam,
	   procesarResultadoGuardarArchivoAnexo);	
   }
} 

function procesarResultadoGuardarArchivoAnexo(data){
   switch(data.CODE_RESPONSE){
      case "05":
         guardarEvidenciaAuto(data.nuevoEnlaceId,"fileEviArch",bitsMega*10,
		     "/procedimientoseguridad/version/anexo/evidencia_archivo/save",
            function(){
	       cargarAnexos();
	    });
	    
	   break;
      default:
         console.log("Ocurrió un error al guardar la evidencia.");
   }
}

