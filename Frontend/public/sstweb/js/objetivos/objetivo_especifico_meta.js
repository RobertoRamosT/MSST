var metaId,metaObj;
var banderaEdicion4=false;
var listFullMeta;
var indice1;
var indice2;
var indice3;

$(function(){
	$("#btnNuevoMeta").attr("onclick", "javascript:nuevoMeta();");
	$("#btnCancelarMeta").attr("onclick", "javascript:cancelarMeta();");
	$("#btnGuardarMeta").attr("onclick", "javascript:guardarMeta();");
	$("#btnEliminarMeta").attr("onclick", "javascript:eliminarMeta();");
})

function cargarMetas() {
    
    	var count = 0;
    	var valorResize= 160;
    	resizeDivWrapper("wrapMeta",valorResize);
    
	$("#btnCancelarMeta").hide();
	$("#btnNuevoMeta").show();
	$("#btnEliminarMeta").hide();
	$("#btnGuardarMeta").hide();
	
	callAjaxPost(URL + '/objetivo/objetivo_especifico/meta', 
			{objetivoEspecifico:{id:objetivoEspecificoObj.id}}, function(data){
				if(data.CODE_RESPONSE=="05"){
				    
					banderaEdicion4=false;
					listFullMeta = data.list;
					$("#tblMeta tbody tr").remove();
					listFullMeta.forEach(function(val,index){
					    
					    var verifMetaCompletadaUltimoAvance = "No";
					    
					    if(val.metaCompletadaUltimoAvance == '1'){
						verifMetaCompletadaUltimoAvance = "Sí"
					    }
					    if(val.metaCompletadaUltimoAvance  == null){
						verifMetaCompletadaUltimoAvance = "(meta alcanzada de Avance de la meta)"
					    }
					    
					    count++;
					    
					$("#tblMeta tbody").append(
					   //Editar sufijo
					     "<tr id='trMeta"+val.id+"' onclick='editarMeta("+index+")'>" +
						 "<td id='tdidmeta"+val.id+"'>"+count+"</td>" + 
						 "<td id='tdmetades"+val.id+"' style='word-break: break-all;'>"+val.meta+"</td>" +
						 "<td id='tdindicador"+val.id+"' style='word-break: break-all;'>"+val.indicador+"</td>" +
						 "<td id='tdavancemeta"+val.id+"' style='word-break: break-all;'>"+val.ultimoAvance+"</td>" +
						 "<td id='tdfechamed"+val.id+"'>"+val.fechaMedicionFinTexto+"</td>" +
						 "<td id='tdmetacompleta"+val.id+"'>"+verifMetaCompletadaUltimoAvance+"</td>" +
							//Agregar filas
					     "</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblMeta");
				}else{
					console.log("NOPNPO")
				}
				goheadfixedY("#tblMeta","#wrapMeta");
			});

	
}

function editarMeta(pindex){
	if(!banderaEdicion4){
	    	formatoCeldaSombreableTabla(false,"tblMeta");
		metaId = listFullMeta[pindex].id;
		metaObj = listFullMeta[pindex];
		
		$("#trMeta"+metaId).addClass("fila-edicion");
		
		$("#tdmetades"+ metaId).html("<input type='text' id='inputMeta' class='form-control'>");
		$("#inputMeta").val(metaObj.meta);
		
		$("#tdindicador"+ metaId).html("<input type='text' id='inputIndicador' class='form-control'>");
		$("#inputIndicador").val(metaObj.indicador);
		
		/****** Enlaces ******/
		
		 indice3= $("#inputMeta").val();
		 
		$("#tdavancemeta"+metaId)
		.html("<a class='efectoLink' onclick='verObjetivoEspecificoMetaEnlaceAvance()'>" +
		      ""+ $("#tdavancemeta"+metaId).text()+" </a>");	
		
		/*********************/
		
		banderaEdicion4 = true;
		$("#btnCancelarMeta").show();
		$("#btnNuevoMeta").hide();
		$("#btnEliminarMeta").show();
		$("#btnGuardarMeta").show();
	}
} 

function nuevoMeta() {
	if(!banderaEdicion4){
	    	formatoCeldaSombreableTabla(false,"tblMeta");
	    	metaObj = {id : 0};
		metaId = 0; 
		$("#tblMeta tbody").prepend(
			"<tr>" 
			        +"<td>...</td>"
				+"<td><input type='text' id='inputMeta' class='form-control'></td>"
				+"<td><input type='text' id='inputIndicador' class='form-control'></td>"
				+"<td>(avance a la fecha de Avance de la meta)</td>"
				+"<td>(fecha de medición de Avance de la meta)</td>"
				+"<td>(meta alcanzada de Avance de la meta)</td>"
				//Agregar necesarios
		     + "</tr>");
		
		$("#btnCancelarMeta").show();
		$("#btnNuevoMeta").hide();
		$("#btnEliminarMeta").hide();
		$("#btnGuardarMeta").show();
		banderaEdicion4 = true;
	}else{
	      alert("Guarde primero.");
	}
}

function cancelarMeta(){
	cargarMetas();
}

function eliminarMeta(){
	var r = confirm("¿Está seguro de eliminar la meta?");
	if (r == true) {
		var dataParam = {
				id : metaId,
		};
		callAjaxPost(URL + '/objetivo/objetivo_especifico/meta/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    cargarMetas();
						break;
					default:
						alert("Ocurrió un error al eliminar la meta.");
					}
				});
	}
}

function guardarMeta() {

    var campoVacio = true;
    //Programa lógica de acceso de guardado
    var meta = $("#inputMeta").val();
    var indicador = $("#inputIndicador").val();
    
    if (campoVacio) {
        var dataParam = {
    		id : metaId,
    		meta: meta,
    		indicador: indicador,
    		objetivoEspecifico: {id:objetivoEspecificoObj.id}
    	};
        callAjaxPost(URL + '/objetivo/objetivo_especifico/meta/save', dataParam,
    		function(data) {
    			switch (data.CODE_RESPONSE) {
    			case "05":
    						
    				cargarMetas();
    				break;
    			default:
    				console.log("Ocurrió un error al guardar la programacion!");
    			}
    		});	
    }	
} 

function verObjetivoEspecificoMetaEnlaceAvance(){
    $("#divMeta").hide();
    $("#divMeta .container-fluid").hide();  //.container-fluid -> Adaptación al ancho del navegador
	$("#divMetaAvance").show();                                                            //******
	$("#divMetaAvance h3")                                                                      //******
	.html("<a onclick='volverDivObjetivo()'> "+indice1+" </a> > " +                             //******
			"    " +                                                                 //******
			"<a onclick='volverDivObjetivoEspecifico()'> "+indice2+"</a> > "+
			       "    " +  
			       "<a onclick='volverDivMeta()'> "+indice3+"</a> "+
			             "     "+
			            //******
			            "> Avance"); 
	
    cargarMetaAvances();	
}

function volverDivMeta(){
    
    $("#divMetaAvance").hide();
    $("#divMetaAvance .container-fluid").hide();
    $("#divMeta").show();
    $("#divMeta .container-fluid").show();

}
