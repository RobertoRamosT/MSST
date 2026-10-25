var alternativaId,alternativaObj;
var banderaEdicion=false;
var listFullAlternativa;
var mensajeUx;

$(function(){
	$("#btnNuevoAlternativa").attr("onclick", "javascript:nuevoAlternativa();");
	$("#btnCancelarAlternativa").attr("onclick", "javascript:cancelarAlternativa();");
	$("#btnGuardarAlternativa").attr("onclick", "javascript:guardarAlternativa();");
	$("#btnEliminarAlternativa").attr("onclick", "javascript:eliminarAlternativa();");
})

function cargarAlternativas() {
    
    	var count = 0;
        var valorResize= 160;
        resizeDivWrapper("wrapAlternativa",valorResize);
    
	$("#btnCancelarAlternativa").hide();
	$("#btnNuevoAlternativa").show();
	$("#btnEliminarAlternativa").hide();
	$("#btnGuardarAlternativa").hide();
	
	callAjaxPost(URL + '/eleccion_virtual/alternativa', 
			{eleccionVirtual:{idEleccionVirtual:eleccionVirtualObj.idEleccionVirtual}, isResultados:0}, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion=false;
					listFullAlternativa= data.list;
					$("#tblAlternativa tbody tr").remove();
					listFullAlternativa.forEach(function(val,index){
					    
					    if(val.detalle==""){
						val.detalle="-";
					    }
					    
					    count++;
						 
					$("#tblAlternativa tbody").append(
						//Editar sufijo
						"<tr id='trAlternativa"+val.idAlternativa+"' onclick='editarAlternativa("+index+")'>" +
							"<td id='tdid_alternativa"+val.idAlternativa+"'>"+count+"</td>" + 
							"<td id='tdtexto"+val.idAlternativa+"' style='word-break: break-all;'>"+val.texto+"</td>" +
							"<td id='tdfoto"+val.idAlternativa+"' style='word-break: break-all;'>"+val.fotoNombre+"</td>" +
							"<td id='tddetalle"+val.idAlternativa+"' style='word-break: break-all;'>"+val.detalle+"</td>" +
							"<td id='tdevidencia"+val.idAlternativa+"' style='word-break: break-all;'>"+val.evidenciaNombre+"</td>" +
							//Agregar filas
						"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblAlternativa");
				}else{
					console.log("NOPNPO")
				}
				goheadfixedY("#tblAlternativa","#wrapAlternativa");
			});
}

function editarAlternativa(pindex) {
    if(!banderaEdicion) {
	formatoCeldaSombreableTabla(false,"tblAlternativa");
	alternativaId = listFullAlternativa[pindex].idAlternativa;
	alternativaObj = listFullAlternativa[pindex];
	
	$("#trAlternativa"+alternativaId).addClass("fila-edicion");
	
	$("#tdtexto"+alternativaId).html("<input type='text' id='inputTexto' class='form-control'>");
	$("#inputTexto").val(alternativaObj.texto);
	
	var optionFoto={
		isImage:false,
		container: "#tdfoto"+alternativaId,
		idAux: "AlternativaFoto",
		esNuevo: false,
		functionCall: function(){},
		evidenciaNombre: alternativaObj.fotoNombre,
		descargaUrl: "/eleccion_virtual/alternativa/foto_alternativa?idAlternativa="+alternativaId+""
	}
	crearFormEvidenciaCompleta(optionFoto);
	
	$("#tddetalle"+alternativaId).html("<input type='text' id='inputDetalle' class='form-control'>");
	$("#inputDetalle").val(alternativaObj.detalle);
	
	var optionEvidencia={
		isImage:false,
		container: "#tdevidencia"+alternativaId,
		idAux: "AlternativaEvidencia",
		esNuevo: false,
		functionCall: function(){},
		evidenciaNombre: alternativaObj.evidenciaNombre,
		descargaUrl: "/eleccion_virtual/alternativa/evidencia_alternativa?idAlternativa="+alternativaId+""
	}
	crearFormEvidenciaCompleta(optionEvidencia);
	
	banderaEdicion=true;
	$("#btnNuevoAlternativa").hide();
	$("#btnCancelarAlternativa").show();
	$("#btnGuardarAlternativa").show();
	$("#btnEliminarAlternativa").show();
    }
}

function nuevoAlternativa(){
    if(!banderaEdicion) {
	formatoCeldaSombreableTabla(false,"tblAlternativa");
	alternativaObj={idAlternativa:0};
	alternativaId=0;
	
	$("#tblAlternativa tbody:first").prepend(
		"<tr>"
			+"<td>...</td>"
			+"<td><input type='text' id='inputTexto' class='form-control'></td>"
			//+"<td id='tdfoto0'></td>"
			+"<td id='tdfoto0'>*Primero debe guardar el registro</td>"
			+"<td><input type='text' id='inputDetalle' class='form-control'></td>"
			+"<td id='tdevidencia0'>*Primero debe guardar el registro</td>"
		+"</tr>"
	);
	
//	var optionFoto={
//		isImage:false,
//		container: "#tdfoto"+alternativaId,
//		idAux: "AlternativaFoto",
//		esNuevo: true,
//		functionCall: function(){},
//		evidenciaNombre: "",
//		descargaUrl: ""
//	}
//	crearFormEvidenciaCompleta(optionFoto);
//	
//	var optionEvidencia={
//		isImage:false,
//		container: "#tdevidencia"+alternativaId,
//		idAux: "AlternativaEvidencia",
//		esNuevo: true,
//		functionCall: function(){},
//		evidenciaNombre: "",
//		descargaUrl: ""
//	}
//	crearFormEvidenciaCompleta(optionEvidencia);
	
	$("#btnNuevoAlternativa").hide();
	$("#btnEliminarAlternativa").hide();
	$("#btnCancelarAlternativa").show();
	$("#btnGuardarAlternativa").show();
	banderaEdicion=true;
	
    }else{
	mensajeUx="<label>Guarde primero.</label>";
	mensajesUx(mensajeUx,2,"","Alternativa");
    }
}

function cancelarAlternativa() {
       cargarAlternativas();
}

function eliminarAlternativa() {
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(eleccionVirtualObj.numVotantes>0 || estado==1){
	mensajeUx="<label>No se puede eliminar la alternativa seleccionada porque el evento ya está EN CURSO.</label>";
	mensajesUx(mensajeUx,2,"","Alternativa");
    }else{
    	mensajeUx="<label>¿Está seguro de eliminar la alternativa?</label>";
    	mensajesUx(mensajeUx,3,"","Alternativa"); 
    
    	$("#btnDevolverValorAlternativa").on("click",function(){
    	    var dataParam = {
		idAlternativa: alternativaId
    	    };
	
    	    callAjaxPost(URL + '/eleccion_virtual/alternativa/delete',dataParam,
		function(data) {
			switch(data.CODE_RESPONSE) {
			case "05":
			    cargarAlternativas();
			    mensajeUx="<label>Se ha eliminado correctamente la Alternativa.</label>";
			    mensajesUx(mensajeUx,1,"","Alternativa");
			    break;
			default:
			    mensajeUx="<label>¡Ocurrió un error al eliminar la Alternativa!</label>";
			    mensajesUx(mensajeUx,2,"","Alternativa"); 
			}
	    	}
    	    );
    	})
    }
}

function guardarAlternativa(){
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(estado==0){
	mensajeUx="<label>No es posible agregar ni editar alternativas porque el evento ya ha concluído.</label>";
	mensajesUx(mensajeUx,2,"","Alternativa");
    }else if(eleccionVirtualObj.numVotantes>0 && estado==1){
	mensajeUx="<label>No es posible agregar ni editar alternativas porque el evento ya está EN CURSO.</label>";
	mensajesUx(mensajeUx,2,"","Alternativa");
    }else{
    	var campoVacio=true;
    
    	var texto=$("#inputTexto").val();
    	var detalle=$("#inputDetalle").val();
    
    	//Logica de acceso de guardado
    	if(texto==""){
    	    campoVacio=false;
    	    mensajeUx="<label>Debe llenar el apartado Texto antes de guardar.</label>";
    	    mensajesUx(mensajeUx,2,"");
    	}
    
    	if(campoVacio){	
    	    var dataParam = {
		idAlternativa:alternativaId,
		eleccionVirtual: {idEleccionVirtual:eleccionVirtualObj.idEleccionVirtual},
		texto:texto,
		detalle:detalle
    	    };
	
    	    if(alternativaId==0){
    		callAjaxPost(URL+'/eleccion_virtual/alternativa/save',dataParam,
		    function(data){
		
			switch (data.CODE_RESPONSE) {
			case "05":
				cargarAlternativas();
				mensajeUx="<label>Se ha guardado correctamente la Alternativa.</label>";
				mensajesUx(mensajeUx,1,"","Alternativa"); 
				break;
			default:
			    	mensajeUx="<label>¡Ocurrió un error al guardar la Alternativa!</label>";
		    		mensajesUx(mensajeUx,2,"","Alternativa");
			}
	    	    }
	    	);
    	    }else{
    		callAjaxPost(URL + '/eleccion_virtual/alternativa/save', dataParam,
			procesarResultadoGuardarAlternativa);
    	    }
    	}
    }
}

function procesarResultadoGuardarAlternativa(data){
    switch(data.CODE_RESPONSE){
    case "05":
	guardarEvidenciaAuto(data.nuevaAlternativaId,"fileEviAlternativaFoto",bitsMega*10,
		"/eleccion_virtual/alternativa/foto_alternativa/save",
	function(){
	    guardarEvidenciaAuto(data.nuevaAlternativaId,"fileEviAlternativaEvidencia",bitsMega*10,
			"/eleccion_virtual/alternativa/evidencia_alternativa/save",
	    function(){
		cargarAlternativas();
	    });
	});
	mensajeUx="<label>Se ha guardado correctamente la Alternativa.</label>";
	mensajesUx(mensajeUx,1,"","Alternativa"); 
	
	break;
	
    default:
	mensajeUx="<label>¡Ocurrió un error al guardar la Alternativa!</label>";
	mensajesUx(mensajeUx,2,"","Alternativa");
    }
}