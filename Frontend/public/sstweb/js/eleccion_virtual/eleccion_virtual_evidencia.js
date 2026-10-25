var evidenciaId,evidenciaObj;
var listFullEvidencia;
var banderaEdicion=false;
var mensajeUx;

$(function(){
    $("#btnCancelarEvidencia").attr("onclick","javascript:cancelarEvidencia();");
    $("#btnNuevoEvidencia").attr("onclick","javascript:nuevoEvidencia();");
    $("#btnGuardarEvidencia").attr("onclick","javascript:guardarEvidencia();");
    $("#btnEliminarEvidencia").attr("onclick","javascript:eliminarEvidencia();");
})

function cargarEvidencias(){
    var valorResize=160;
    resizeDivWrapper("wrapEvidencia",valorResize);
    
    $("#btnCancelarEvidencia").hide();
    $("#btnNuevoEvidencia").show();
    $("#btnGuardarEvidencia").hide();
    $("#btnEliminarEvidencia").hide();
    
    callAjaxPost(URL + '/eleccion_virtual/evidencia',
	    {eleccionVirtual:{idEleccionVirtual:eleccionVirtualObj.idEleccionVirtual}},function(data){
		if(data.CODE_RESPONSE=="05"){
		    banderaEdicion=false;
		    listFullEvidencia=data.list;
		    $("#tblEvidencia tbody tr").remove();
		    listFullEvidencia.forEach(function(val,index){
			
			if(val.detalle==""){
			    val.detalle="-";
			}
			
			$("#tblEvidencia tbody").append(
				"<tr id='trEvidencia"+val.idEvidencia+"' onclick='editarEvidencia("+index+")'>" +
					"<td id='tdevidencia"+val.idEvidencia+"' style='word-break: break-all;'>"+val.evidenciaFotoNombre+"</td>" +
					"<td id='tddetalle"+val.idEvidencia+"' style='word-break: break-all;'>"+val.detalle+"</td>"+
					
				"</tr>"
			);
		    });
		    formatoCeldaSombreableTabla(true,"tblEvidencia");
		}else{
		    console.log("NOPNPO")
		}
		goheadfixedY("#tblEvidencia","#wrapEvidencia");
	    });
}

function editarEvidencia(pindex){
    if(!banderaEdicion){
	formatoCeldaSombreableTabla(false,"tblEvidencia");
	evidenciaId=listFullEvidencia[pindex].idEvidencia;
	evidenciaObj=listFullEvidencia[pindex];
	
	$("#trEvidencia"+evidenciaId).addClass("fila-edicion");
	
	//var evidenciaFotoNombre=$("#tdevidencia"+evidenciaId).text();
	var optionEvidencia={
		isImage:false,
		container: "#tdevidencia"+evidenciaId,
		idAux: "denciaFotoEvidencia",
		esNuevo: false,
		functionCall: function(){},
		evidenciaNombre: evidenciaObj.evidenciaFotoNombre,
		descargaUrl: "/eleccion_virtual/evidencia/evidencia_foto_evidencia?idEvidencia="+evidenciaId
	}
	crearFormEvidenciaCompleta(optionEvidencia);
	
	$("#tddetalle"+evidenciaId).html("<input id='inputDetalle' type='text' class='form-control'>");
	$("#inputDetalle").val(evidenciaObj.detalle);
	
	banderaEdicion=true;
	$("#btnNuevoEvidencia").hide();
	$("#btnCancelarEvidencia").show();
	$("#btnGuardarEvidencia").show();
	$("#btnEliminarEvidencia").show();
    }
}

function cancelarEvidencia(){
    cargarEvidencias();
}

function nuevoEvidencia(){
    if(!banderaEdicion){
	formatoCeldaSombreableTabla(false,"tblEvidencia");
	evidenciaId=0;
	evidenciaObj={idEvidencia:0};
	$("#tblEvidencia tbody:first").prepend(
		"<tr>"
			+"<td id='tdevidencia0'></td>"
			+"<td><input type='text' id='inputDetalle' class='form-control'></td>"
		+"</tr>"
	);
	var optionEvidencia={
		isImage:false,
		container: "#tdevidencia"+evidenciaId,
		idAux: "denciaFotoEvidencia",
		esNuevo: true,
		functionCall: function(){},
		evidenciaNombre: "",
		descargaUrl: ""
	}
	crearFormEvidenciaCompleta(optionEvidencia);
	
	banderaEdicion=true;
	$("#btnNuevoEvidencia").hide();
	$("#btnEliminarEvidencia").hide();
	$("#btnCancelarEvidencia").show();
	$("#btnGuardarEvidencia").show();
    }else{
	mensajeUx="<label>Guarde primero.</label>";
	mensajesUx(mensajeUx,2,"","Evidencia");
    }
}

function eliminarEvidencia(){
    mensajeUx="<label>¿Está seguro de eliminar la alternativa?</label>";
    mensajesUx(mensajeUx,3,"","Evidencia"); 
    
    $("#btnDevolverValorEvidencia").on("click",function(){
	var dataParam={
		idEvidencia: evidenciaId
	}
	
	callAjaxPost(URL+'/eleccion_virtual/evidencia/delete',dataParam,
		function(data){
			switch(data.CODE_RESPONSE){
			case "05":
			    cargarEvidencias();
			    mensajeUx="<label>Se ha eliminado correctamente la Evidencia.</label>";
			    mensajesUx(mensajeUx,1,"","Evidencia");
			    break;
			default:
			    mensajeUx="<label>¡Ocurrió un error al eliminar la Evidencia!</label>";
			    mensajesUx(mensajeUx,2,"","Evidencia");
			}
	    	}
	);
    })
}

function guardarEvidencia(){
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(estado==0){
	mensajeUx="<label>No es posible agregar ni editar las evidencias porque el evento ya ha concluído.</label>";
	mensajesUx(mensajeUx,2,"","Evidencia");
    }else{
        var campoVacio=true;
        
        var detalle=$("#inputDetalle").val();
        
        //Logica de guardado
        var inEvi = $("#inputEvidenciaFotoEvidencia").val();
        if(inEvi==""){
    	campoVacio=false;
    	mensajeUx="<label>Debe cargar una Evidencia antes de guardar.</label>";
    	mensajesUx(mensajeUx,2,"");
        }
        
        if(campoVacio){
    	var dataParam={
    		idEvidencia: evidenciaId,
    		eleccionVirtual: {idEleccionVirtual:eleccionVirtualObj.idEleccionVirtual},
    		detalle:detalle
    	};
    	callAjaxPost(URL+'/eleccion_virtual/evidencia/save',dataParam,
    		procesarResultadoGuardarEvidencia);
        }
    }
}

function procesarResultadoGuardarEvidencia(data){
    switch(data.CODE_RESPONSE){
    case "05":
	console.log(data.nuevaEvidenciaId);
	guardarEvidenciaAuto(data.nuevaEvidenciaId,"fileEvidenciaFotoEvidencia",bitsMega*10,
		"/eleccion_virtual/evidencia/evidencia_foto_evidencia/save",
		function(){cargarEvidencias()});
	break;
	
    default:
	mensajeUx="<label>¡Ocurrió un error al guardar la Evidencia!</label>";
	mensajesUx(mensajeUx,2,"","Evidencia");
    }
}