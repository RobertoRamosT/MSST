var enlaceMsdsId,enlaceMsdsObj;
var banderaEdicion2=false;
var listTipoEnlaceMsds;
var listFullEnlaceMsds;

$(function(){
	$("#btnNuevoEnlaceMsds").attr("onclick", "javascript:nuevoEnlaceMsds();");
	$("#btnCancelarEnlaceMsds").attr("onclick", "javascript:cancelarEnlaceMsds();");
	$("#btnGuardarEnlaceMsds").attr("onclick", "javascript:guardarEnlaceMsds();");
	$("#btnEliminarEnlaceMsds").attr("onclick", "javascript:eliminarEnlaceMsds();");
	
})

function cargarEnlaceMsds() {
        var valorResize= 160;
        resizeDivWrapper("wrapperEnlaceMsds",valorResize);
        console.log("Con "+valorResize);
    
	$("#btnCancelarEnlaceMsds").hide();
	$("#btnNuevoEnlaceMsds").show();
	$("#btnEliminarEnlaceMsds").hide();
	$("#btnGuardarEnlaceMsds").hide();
	
	callAjaxPost(URL + '/fichaquimica/enlacemsds', 
		    {fichaQuimica:{id:fichaQuimicaObj.id}}, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion2=false;
					
					listFullEnlaceMsds = data.list;
					$("#tblEnlaceMsds tbody tr").remove();
					
					
					listFullEnlaceMsds.forEach(function(val,index){
					$("#tblEnlaceMsds tbody").append(
						//Editar sufijo
						"<tr id='trenlacemsds"+val.id+"' onclick='editarEnlaceMsds("+index+")'>" +
							"<td id='tdevidenciaFichas"+val.id+"'>"+val.evidenciaFichaNombre+"</td>" +
							"<td id='tdobservacion"+val.id+"'>"+val.observacion+"</td>" +
							//Agregar filas
						"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblEnlaceMsds");
				}else{
					console.log("NOPNPO")
				}
				goheadfixedY("#tblFichaQuimica","#wrapperFichaQuimica")
			});
 }

function editarEnlaceMsds(pindex) {
	if (!banderaEdicion2) {
	    	formatoCeldaSombreableTabla(false,"tblEnlaceMsds");
	    	enlaceMsdsId = listFullEnlaceMsds[pindex].id;
	    	enlaceMsdsObj = listFullEnlaceMsds[pindex];
	    	
		$("#tdobservacion"+ enlaceMsdsId).html("<input type='text' id='inputObservacion' class='form-control'>");
		$("#inputObservacion").val(enlaceMsdsObj.observacion);

		var optionEvidencia={
			    isImage: false,
			    container:"#tdevidenciaFichas"+enlaceMsdsId,
			    idAux:"Fich",
			    esNuevo:false,
			    functionCall:function(){},
			    evidenciaNombre:enlaceMsdsObj.evidenciaFichaNombre,
			    descargaUrl:"/fichaquimica/enlacemsds/evidencia_ficha?id="+enlaceMsdsId+"",
			}
		
		crearFormEvidenciaCompleta(optionEvidencia);
		
		banderaEdicion2 = true;
		$("#btnCancelarEnlaceMsds").show();
		$("#btnNuevoEnlaceMsds").hide();
		$("#btnEliminarEnlaceMsds").show();
		$("#btnGuardarEnlaceMsds").show();
	}
	
} 
function nuevoEnlaceMsds(){
	if (!banderaEdicion2) {
	    	formatoCeldaSombreableTabla(false,"tblEnlaceMsds");
	    	enlaceMsdsObj = {id : 0};
	    	enlaceMsdsId = 0; 
		$("#tblEnlaceMsds tbody").prepend(
			"<tr>" 
			        +"<td id='tdevidenciaFichas0'></td>"
				+"<td><input type='text' id='inputObservacion' class='form-control'></td>"
				//Agregar necesarios
			+ "</tr>");
		
		var optionEvidencia={
			    isImage: false,
			    container:"#tdevidenciaFichas"+enlaceMsdsId,
			    idAux:"Fich",
			    esNuevo:true,
			    evidenciaNombre:"",
			    functionCall:function(){},
			    descargaUrl:"",
			}
			
			crearFormEvidenciaCompleta(optionEvidencia);
		
		$("#btnCancelarEnlaceMsds").show();
		$("#btnNuevoEnlaceMsds").hide();
		$("#btnEliminarEnlaceMsds").hide();
		$("#btnGuardarEnlaceMsds").show();
		banderaEdicion2 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarEnlaceMsds() {
	cargarEnlaceMsds();
}

function eliminarEnlaceMsds() {
	var r = confirm("¿Está seguro de eliminar el plantilla?");
	if (r == true) {
		var dataParam = {
				id : enlaceMsdsId,
		};
		callAjaxPost(URL + '/fichaquimica/enlacemsds/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    cargarEnlaceMsds();
						break;
					default:
						alert("Ocurrió un error al eliminar la plantilla!");
					}
				});
	}
}

function guardarEnlaceMsds() {

    var campoVacio = true;
    //Programa lógica de acceso de guardado
    
    var observacion=$("#inputObservacion").val();
    
    if (campoVacio) {
        var dataParam = {
    		id : enlaceMsdsId,
    		observacion:observacion,
    		fichaQuimica:{id:fichaQuimicaObj.id}
    	};
        callAjaxPost(URL + '/fichaquimica/enlacemsds/save', dataParam,
        	procesarResultadoGuardarAccionMejora);	
    }else{
	alert("Debe ingresar todos los campos.");
    }
} 

function procesarResultadoGuardarAccionMejora(data){
	switch (data.CODE_RESPONSE) {
	case "05":
	   guardarEvidenciaAuto(data.nuevoEnlaceId,"fileEviFich",bitsMega*10,
		   "/fichaquimica/enlacemsds/evidencia_ficha/save",
           function(){
	           cargarEnlaceMsds();
	       });
	    
	   break;

	default:
	   alert("Ocurrió un error al guardar la evidencia!");
	}
}




