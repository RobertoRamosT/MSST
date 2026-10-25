var metaAvanceId,metaAvanceObj;
var banderaEdicion5=false;
var listFullMetaAvance;

$(function(){
	$("#btnNuevoMetaAvance").attr("onclick", "javascript:nuevoMetaAvance();");
	$("#btnCancelarMetaAvance").attr("onclick", "javascript:cancelarMetaAvance();");
	$("#btnGuardarMetaAvance").attr("onclick", "javascript:guardarMetaAvance();");
	$("#btnEliminarMetaAvance").attr("onclick", "javascript:eliminarMetaAvance();");	
})

function cargarMetaAvances(){
    
        var count = 0;
    	var valorResize= 160;
	resizeDivWrapper("wrapMetaAvance",valorResize);
    
	$("#btnCancelarMetaAvance").hide();
	$("#btnNuevoMetaAvance").show();
	$("#btnEliminarMetaAvance").hide();
	$("#btnGuardarMetaAvance").hide();
	callAjaxPost(URL + '/objetivo/objetivo_especifico/meta/avance', 
			{objetivoEspecificoMeta:{id:metaObj.id}}, function(data){
			    if(data.CODE_RESPONSE=="05"){
				  banderaEdicion5=false;
				  listFullMetaAvance = data.list;
				  $("#tblMetaAvance tbody tr").remove();
					
				  listFullMetaAvance.forEach(function(val,index){
				      
				      var verifMetaAlcanzada = "No";
					    
					    if(val.validarMetaAlcanzada == '1'){
						verifMetaAlcanzada = "Sí"
					    }
					    if(val.validarMetaAlcanzada == null){
						verifMetaAlcanzada = ""
					    }
					    
					    count++;
				      
			   	     $("#tblMetaAvance tbody").append(
				     //Editar sufijo
				     "<tr id='trMetaAvance"+val.id+"' onclick='editarMetaAvance("+index+")'>" +
				         "<td id='tdid"+val.id+"'>"+count+"</td>" +
				         "<td id='tdavance"+val.id+"' style='word-break: break-all;'>"+val.avance+"</td>" +
				         "<td id='tdfechamedicion"+val.id+"'>"+val.fechaMedicionTexto+"</td>" +
				         "<td id='tdobservacion"+val.id+"' style='word-break: break-all;'>"+val.observacion+"</td>" +
				         "<td id='tdevidenciaavance"+val.id+"'>"+val.evidenciaAvanceNombre+"</td>" +
				         "<td id='tdmetaalcanzada"+val.id+"'>"+verifMetaAlcanzada+"</td>" +
					 //Agregar filas
				     "</tr>");
				   });
				   formatoCeldaSombreableTabla(true,"tblMetaAvances");
				}else{
				   console.log("NOPNPO")
				}
			        goheadfixedY("#tblMetaAvance","#wrapMetaAvance");
			});

}

function editarMetaAvance(pindex) {
	if (!banderaEdicion5) {
	    	formatoCeldaSombreableTabla(false,"tblMetaAvance");
	    	metaAvanceId = listFullMetaAvance[pindex].id;
	    	metaAvanceObj = listFullMetaAvance[pindex];
	    	
	    	$("#trMetaAvance"+metaAvanceId).addClass("fila-edicion");
		
	    	$("#tdavance"+ metaAvanceId).html("<input type='text' id='inputAvance' class='form-control'>");
		$("#inputAvance").val(metaAvanceObj.avance);
		
		$("#tdobservacion"+ metaAvanceId).html("<input type='text' id='inputObservacion' class='form-control'>");
		$("#inputObservacion").val(metaAvanceObj.observacion);
		
		$("#tdfechamedicion"+metaAvanceId).html("<input type='date' id='inputFechaMedicion' class='form-control'>");
		$("#inputFechaMedicion").val(convertirFechaInput(metaAvanceObj.fechaMedicion));	
		
		
		 var verifMA = metaAvanceObj.validarMetaAlcanzada;
		 var textoCheckMA = "";
		 
		    if(verifMA == 1){
			textoCheckMA="checked";
		    }
		 	  
		 $("#tdmetaalcanzada"+metaAvanceId)
		 .html("<input type='checkbox' id='checkMetaAlcanzada' class='form-control' "+textoCheckMA+">");
		
		
		
		var optionEvidencia={
			    isImage: false,
			    container:"#tdevidenciaavance"+metaAvanceId,
			    idAux:"Avan",
			    esNuevo:false,
			    functionCall:function(){},
			    evidenciaNombre:metaAvanceObj.evidenciaAvanceNombre,
			    descargaUrl:"/objetivo/objetivo_especifico/meta/avance/evidencia_meta_avance?id="+metaAvanceId+"",
			}
		
		crearFormEvidenciaCompleta(optionEvidencia);
		
		banderaEdicion5 = true;
		$("#btnCancelarMetaAvance").show();
		$("#btnNuevoMetaAvance").hide();
		$("#btnEliminarMetaAvance").show();
		$("#btnGuardarMetaAvance").show();
	}
	
} 

function nuevoMetaAvance() {
	 if(!banderaEdicion5) {
	     formatoCeldaSombreableTabla(false,"tblMetaAvance");
	     metaAvanceObj = {id : 0};
	     metaAvanceId = 0; 
	     $("#tblMetaAvance tbody").prepend(
		 "<tr>" 
		      +"<td>...</td>"
		      +"<td><input type='text' id='inputAvance' class='form-control'></td>"
		      +"<td><input type='date' id='inputFechaMedicion' class='form-control'></td>" 
		      +"<td><input type='text' id='inputObservacion' class='form-control'></td>"
		      +"<td id='tdevidenciaavance0'></td>"
		      +"<td>No</td>"
		      //Agregar necesarios
	      + "</tr>");
	     
	     var optionEvidencia={
			    isImage: false,
			    container:"#tdevidenciaavance"+metaAvanceId,
			    idAux:"Avan",
			    esNuevo:true,
			    evidenciaNombre:"",
			    functionCall:function(){},
			    descargaUrl:"",
			}
			
	    crearFormEvidenciaCompleta(optionEvidencia);
		
	     $("#btnCancelarMetaAvance").show();
	     $("#btnNuevoMetaAvance").hide();
	     $("#btnEliminarMetaAvance").hide();
	     $("#btnGuardarMetaAvance").show();
	     banderaEdicion5 = true;
	 }else{
		alert("Guarde primero.");
	 }
}

function cancelarMetaAvance() {
	cargarMetaAvances();
}

function eliminarMetaAvance() {
	var r = confirm("¿Está seguro de eliminar el plantilla?");
	if (r == true) {
		var dataParam = {
				id : metaAvanceId,
		};
		callAjaxPost(URL + '/objetivo/objetivo_especifico/meta/avance/delete', dataParam,
				function(data){
				   switch(data.CODE_RESPONSE){
				      case "05":
				         cargarMetaAvances();
				         break;
				      
				      default:
				         alert("Ocurrió un error al eliminar el avance");
				   }
				});
	}
}

function guardarMetaAvance() {

    var campoVacio = true;
    //Programa lógica de acceso de guardado
    var avance = $("#inputAvance").val();
    var observacion = $("#inputObservacion").val();
    
    var fechaMedicion = convertirFechaTexto($("#inputFechaMedicion").val());
    
    var validarMetaAlcanzada;
    
    if(metaAvanceId == 0){
	validarMetaAlcanzada = 0;
    }else{
	validarMetaAlcanzada = ($("#checkMetaAlcanzada").prop("checked")?1:0);
    }
    
    if (campoVacio) {
        var dataParam = {
    		id : metaAvanceId,
    		avance: avance,
    		observacion: observacion,
    		fechaMedicion: fechaMedicion,
    		validarMetaAlcanzada: validarMetaAlcanzada,
    		objetivoEspecificoMeta: {id:metaObj.id}
    	};
        callAjaxPost(URL + '/objetivo/objetivo_especifico/meta/avance/save', dataParam,
        	     procesarResultadoGuardarMetaAvance);	
    }	
} 

function procesarResultadoGuardarMetaAvance(data){
         switch(data.CODE_RESPONSE){
	    case "05":	
	       guardarEvidenciaAuto(data.nuevoAvanceId,"fileEviAvan",bitsMega*10,
			   "/objetivo/objetivo_especifico/meta/avance/evidencia_meta_avance/save",
	       function(){
		       cargarMetaAvances();
	       });
	       break;
	    
	    default:
	    console.log("Ocurrió un error al guardar el avance.");
	 }
}