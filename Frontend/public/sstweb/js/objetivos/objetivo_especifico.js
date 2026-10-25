 
var objetivoEspecificoId,objetivoEspecificoObj;
var banderaEdicion2=false;
var listFullObjetivoEspecifico;
var listAreas;
var indice1;
var indice2;

$(function(){
	$("#btnNuevoObjetivoEspecifico").attr("onclick", "javascript:nuevoObjetivoEspecifico();");
	$("#btnCancelarObjetivoEspecifico").attr("onclick", "javascript:cancelarObjetivoEspecifico();");
	$("#btnGuardarObjetivoEspecifico").attr("onclick", "javascript:guardarObjetivoEspecifico();");
	$("#btnEliminarObjetivoEspecifico").attr("onclick", "javascript:eliminarObjetivoEspecifico();");
	
})

function cargarObjetivosEspecificos(){
    
        var count = 0;
    	var valorResize= 160;
    	resizeDivWrapper("wrapObjetivoEspecifico",valorResize);
    
	$("#btnCancelarObjetivoEspecifico").hide();
	$("#btnNuevoObjetivoEspecifico").show();
	$("#btnEliminarObjetivoEspecifico").hide();
	$("#btnGuardarObjetivoEspecifico").hide();
	
	callAjaxPost(URL + '/objetivo/objetivo_especifico', 
		        {objetivo:{id:objetivoObj.id},
	                 empresaId : getSession("gestopcompanyid")}, function(data){
			    if(data.CODE_RESPONSE=="05"){
				    
			       banderaEdicion2=false;
			       listFullObjetivoEspecifico = data.list;
			       $("#tblObjetivoEspecifico tbody tr").remove();
			       
			       
			       listAreas= data.listAreas;
					
			       listFullObjetivoEspecifico.forEach(function(val,index){
				  
				  var verifObjetivoEspecificoActivo = "No";
				    
				    if(val.validarObjetivoEspecifico == '1'){
					verifObjetivoEspecificoActivo = "Sí"
				    }
				    if(val.validarObjetivoEspecifico == null){
					verifObjetivoEspecificoActivo = ""
				    }
				    
				    count++;
				  
				$("#tblObjetivoEspecifico tbody").append(
				   //Editar sufijo
				   "<tr id='trObjetivoEspecifico"+val.id+"' onclick='editarObjetivoEspecifico("+index+")'>" +
				            "<td id='tdidobjesp"+val.id+"'>"+count+"</td>" +
				            "<td id='tddescripcionesp"+val.id+"' style='word-break: break-all;'>"+val.descripcion+"</td>" +
				            "<td id='tdareas"+val.id+"'>"+val.listAreasNombre+"</td>" +
				            "<td id='tdmeta"+val.id+"'>"+val.numMetasCompletadas+"/"+val.numTotalMetas+"</td>" +
				            "<td id='tdactpro"+val.id+"'>"+val.numActividadesCompletadas+"/"+val.numTotalActividades+"</td>" +
					    "<td id='tdpresupuesto"+val.id+"'>S/."+val.presupuestoTotal+"</td>" +
				            "<td id='tdrecursos"+val.id+"' style='word-break: break-all;'>"+val.listRecursos+"</td>" +
				            "<td id='tdvalidarobjespact"+val.id+"'>"+verifObjetivoEspecificoActivo+"</td>" +
					    //Agregar objetivo específico
				   "</tr>");
			       });
			       formatoCeldaSombreableTabla(true,"tblObjetivoEspecifico");
			      }else{
				console.log("NOPNPO")
			      }
			      goheadfixedY("#tblObjetivoEspecifico","#wrapObjetivoEspecifico");
			 });
}

function editarObjetivoEspecifico(pindex) {
	if (!banderaEdicion2) {
	    	formatoCeldaSombreableTabla(false,"tblObjetivoEspecifico");
		objetivoEspecificoId = listFullObjetivoEspecifico[pindex].id;
		objetivoEspecificoObj = listFullObjetivoEspecifico[pindex];
		
		$("#trObjetivoEspecifico"+objetivoEspecificoId).addClass("fila-edicion");
	
		$("#tddescripcionesp"+ objetivoEspecificoId).html("<input type='text' id='inputDescripcionEspecifica' class='form-control'>");
		$("#inputDescripcionEspecifica").val(objetivoEspecificoObj.descripcion);
		
		/****** CheckButtons ******/
		
		 var verifOEC = objetivoEspecificoObj.validarObjetivoEspecifico;
		 var textoCheckOEC = "";
		 
		    if(verifOEC == 1){
			textoCheckOEC="checked";
		    }
		 	  
		 $("#tdvalidarobjespact"+objetivoEspecificoId)
		 .html("<input type='checkbox' id='checkObjetivoEspecifico' class='form-control' "+textoCheckOEC+">");
		
		/***************************/
		 
		/****** Multiselect ******/
		 
		var listAreasAd= objetivoEspecificoObj.listAreasId.split(",");
		       listAreas.forEach(function(val){
			    val.selected= 0;
			    listAreasAd.forEach(function(val1){
				 if(parseInt(val1) == val.areaId){
				      val.selected= 1;
				 }
			    });
			});
			
		crearSelectOneMenuObligMultipleCompleto("selMulAreasForm"," ",listAreas,"areaId",
	                   "areaNameShort","#tdareas"+objetivoEspecificoId,"sin asignar");
		 
		/***************************/ 
		 
		/****** Enlaces ******/
		
		indice2= $("#inputDescripcionEspecifica").val();
		 
		$("#tdmeta"+objetivoEspecificoId)
	        .html("<a class='efectoLink' onclick='verObjetivoEspecificoEnlaceMeta()'>" +
		      ""+ $("#tdmeta"+objetivoEspecificoId).text()+" </a>");	
			
		$("#tdactpro"+objetivoEspecificoId)
		.html("<a class='efectoLink' onclick='verObjetivoEspecificoEnlaceActividad()'>" +
		      ""+ $("#tdactpro"+objetivoEspecificoId).text()+" </a>");	
		
		/*********************/
		
		banderaEdicion2 = true;
		$("#btnCancelarObjetivoEspecifico").show();
		$("#btnNuevoObjetivoEspecifico").hide();
		$("#btnEliminarObjetivoEspecifico").show();
		$("#btnGuardarObjetivoEspecifico").show();
	}
	
} 
function nuevoObjetivoEspecifico() {
	if (!banderaEdicion2) {
	    
	    	formatoCeldaSombreableTabla(false,"tblObjetivoEspecifico");
	    	objetivoEspecificoObj = {id : 0};
		objetivoEspecificoId = 0; 
		
		$("#tblObjetivoEspecifico tbody").prepend(
			"<tr>" 
			        +"<td>...</td>"
				+"<td><input type='text' id='inputDescripcionEspecifica' class='form-control'></td>" 
				+"<td id='tdareas0'></td>"
				+"<td>(datos de Metas)</td>"
				+"<td>(presupuesto de Actividades)</td>"
				+"<td>(recursos de Actividades)</td>"
				+"<td>(datos de Actividades)</td>"
				+"<td>Sí</td>"
				//Agregar necesarios
		     + "</tr>");
		
		crearSelectOneMenuObligMultipleCompleto("selMulAreasForm"," ",listAreas,"areaId",
                        "areaNameShort","#tdareas0","sin asignar");
		
		$("#btnCancelarObjetivoEspecifico").show();
		$("#btnNuevoObjetivoEspecifico").hide();
		$("#btnEliminarObjetivoEspecifico").hide();
		$("#btnGuardarObjetivoEspecifico").show();
		banderaEdicion2 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarObjetivoEspecifico() {
	cargarObjetivosEspecificos();
}

function eliminarObjetivoEspecifico() {
	var r = confirm("¿Está seguro de eliminar el objetivo específico?");
	if (r == true) {
		var dataParam = {
				id : objetivoEspecificoId,
		};
		callAjaxPost(URL + '/objetivo/objetivo_especifico/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    cargarObjetivosEspecificos();
						break;
					default:
						alert("Ocurrió un error al eliminar el objetivo específico.");
					}
				});
	}
}

function guardarObjetivoEspecifico(){

    var campoVacio = true;
    //Programa lógica de acceso de guardado
    var descripcionEsp = $("#inputDescripcionEspecifica").val();
    
    var validarObjetivoEspecificoActivo;
    
    if(objetivoEspecificoId == 0){
       validarObjetivoEspecificoActivo = 1;
    }else{
       validarObjetivoEspecificoActivo = ($("#checkObjetivoEspecifico").prop("checked")?1:0);
    }
    
    var listArea= $("#selMulAreasForm").val();
    var listAreasAd= [];
    if(listArea != null){
	listArea.forEach(function(val,index){
	   listAreasAd.push(
	       {areaId: parseInt(val)})
       });
    }
    
    if (campoVacio) {
        var dataParam = {
    		id : objetivoEspecificoId,
    		descripcion: descripcionEsp,
    		validarObjetivoEspecifico: validarObjetivoEspecificoActivo,
    		listAreas: listAreasAd,
    		objetivo: {id:objetivoObj.id}
    	};
        callAjaxPost(URL + '/objetivo/objetivo_especifico/save', dataParam,
    		function(data) {
    			switch (data.CODE_RESPONSE) {
    			case "05":
    						
    				cargarObjetivosEspecificos();
    				break;
    			default:
    				console.log("Ocurrió un error al guardar el objetivo específico.");
    			}
    		});	
    }	
}

function verObjetivoEspecificoEnlaceMeta(){
    $("#divObjetivoEspecifico").hide();
    $("#divObjetivoEspecifico .container-fluid").hide();  //.container-fluid -> Adaptación al ancho del navegador
	$("#divMeta").show();                                                            //******
	$("#divMeta h3")                                                                      //******
	.html("<a onclick='volverDivObjetivo()'> "+indice1+"</a> > " +                             //******
			"    " +                                                                 //******
			"<a onclick='volverDivObjetivoEspecifico()'> "+indice2+" </a> "+
			       "    " +                                                                 //******
			       "> Meta"); 
	
    cargarMetas();	
}

function verObjetivoEspecificoEnlaceActividad(){
    $("#divObjetivoEspecifico").hide();
    $("#divObjetivoEspecifico .container-fluid").hide();  //.container-fluid -> Adaptación al ancho del navegador
	$("#divActividad").show();                                                            //******
	$("#divActividad h3")                                                                      //******
	.html("<a onclick='volverDivObjetivo()'> "+indice1+"</a> > " +                             //******
			"    " +                                                                 //******
			"<a onclick='volverDivObjetivoEspecifico()'> "+indice2+" </a> "+
			       "    " +                                                                 //******
			       "> Actividad"); 
	
    cargarActividades();	
}

function volverDivObjetivoEspecifico(){

    $("#divMeta").hide();
    $("#divMeta .container-fluid").hide();
    $("#divActividad").hide();
    $("#divActividad .container-fluid").hide();
    $("#divObjetivoEspecifico").show();
    $("#divObjetivoEspecifico .container-fluid").show();
    $("#divMetaAvance").hide();
    $("#divMetaAvance .container-fluid").hide();
 
}