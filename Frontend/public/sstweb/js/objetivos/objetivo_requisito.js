var requisitoAsociadoId,requisitoAsociadoObj;
var banderaEdicion6=false;
var listFullRequisitoAsociado;

$(function(){
	$("#btnNuevoRequisitoAsociado").attr("onclick", "javascript:nuevoRequisitoAsociado();");
	$("#btnCancelarRequisitoAsociado").attr("onclick", "javascript:cancelarRequisitoAsociado();");
	$("#btnGuardarRequisitoAsociado").attr("onclick", "javascript:guardarRequisitoAsociado();");
	$("#btnEliminarRequisitoAsociado").attr("onclick", "javascript:eliminarRequisitoAsociado();");
})

function cargarRequisitosAsociados() {
    
    	var count = 0;
        var valorResize= 160;
        resizeDivWrapper("wrapRequisitoAsociado",valorResize);
    
	$("#btnCancelarRequisitoAsociado").hide();
	$("#btnNuevoRequisitoAsociado").show();
	$("#btnEliminarRequisitoAsociado").hide();
	$("#btnGuardarRequisitoAsociado").hide();
	
	callAjaxPost(URL + '/objetivo/requisito_asociado', 
			{objetivo:{id:objetivoObj.id}}, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion6=false;
					listFullRequisitoAsociado = data.list;
					$("#tblRequisitoAsociado tbody tr").remove();
					listFullRequisitoAsociado.forEach(function(val,index){
					    
					    count++;
						 
					$("#tblRequisitoAsociado tbody").append(
						//Editar sufijo
						"<tr id='trRequisitoAsociado"+val.id+"' onclick='editarRequisitoAsociado("+index+")'>" +
							"<td id='tdid"+val.id+"'>"+count+"</td>" + 
							"<td id='tdrequisitoasociado"+val.id+"' style='word-break: break-all;'>"+val.requisitoAsociado+"</td>" + 
							//Agregar filas
						"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblRequisitoAsociado");
				}else{
					console.log("NOPNPO")
				}
				goheadfixedY("#tblRequisitoAsociado","#wrapRequisitoAsociado");
			});

}

function editarRequisitoAsociado(pindex) {
	if (!banderaEdicion6) {
	    
	    	formatoCeldaSombreableTabla(false,"tblRequisitoAsociado");
	    	requisitoAsociadoId = listFullRequisitoAsociado[pindex].id;
	    	requisitoAsociadoObj = listFullRequisitoAsociado[pindex];
	    	
	    	$("#trRequisitoAsociado"+requisitoAsociadoId).addClass("fila-edicion");
		
	    	$("#tdrequisitoasociado"+ requisitoAsociadoId).html("<input type='text' id='inputRequisitoAsociado' class='form-control'>");
		$("#inputRequisitoAsociado").val(requisitoAsociadoObj.requisitoAsociado);
	    	
		banderaEdicion6 = true;
		
		$("#btnCancelarRequisitoAsociado").show();
		$("#btnNuevoRequisitoAsociado").hide();
		$("#btnEliminarRequisitoAsociado").show();
		$("#btnGuardarRequisitoAsociado").show();
	}
	
} 
function nuevoRequisitoAsociado(){
	if(!banderaEdicion6){
	    
	    	formatoCeldaSombreableTabla(false,"tblRequisitoAsociado");
	    	requisitoAsociadoObj = {id : 0};
	    	requisitoAsociadoId = 0; 
	    	
		$("#tblRequisitoAsociado tbody").prepend(
			"<tr>" 
			        + "<td>...</td>"
				+"<td><input type='text' id='inputRequisitoAsociado' class='form-control'></td>"
				//Agregar necesarios
		      + "</tr>");
		
		$("#btnCancelarRequisitoAsociado").show();
		$("#btnNuevoRequisitoAsociado").hide();
		$("#btnEliminarRequisitoAsociado").hide();
		$("#btnGuardarRequisitoAsociado").show();
		banderaEdicion6 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarRequisitoAsociado() {
       cargarRequisitosAsociados();
}

function eliminarRequisitoAsociado() {
	var r = confirm("¿Está seguro de eliminar el requisito asociado?");
	if (r == true) {
		var dataParam = {
				id: requisitoAsociadoId,
		};
		callAjaxPost(URL + '/objetivo/requisito_asociado/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    cargarRequisitosAsociados();
						break;
					default:
						alert("Ocurrió un error al eliminar el requisito asociado.");
					}
				});
	}
}

function guardarRequisitoAsociado() {

    var campoVacio = true;
    //Programa lógica de acceso de guardado
    var requisitoAsociado=$("#inputRequisitoAsociado").val();
    
    if (campoVacio) {
	
        var dataParam = {
    		id : requisitoAsociadoId,
    		requisitoAsociado: requisitoAsociado,
    		objetivo: {id:objetivoObj.id}
    	};
        
        callAjaxPost(URL + '/objetivo/requisito_asociado/save', dataParam,
    		function(data) {
    			switch (data.CODE_RESPONSE) {
    			   case "05":			
    		               cargarRequisitosAsociados();
    			       break;
    			    
    			default:
    				console.log("Ocurrió un error al guardar el requisito asociado.");
    			}
    	       });	
    }
} 

