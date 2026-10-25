var objetivoId,objetivoObj;
var banderaEdicion1=false;
var listFullObjetivo;
var listResponsableSolicitud; 
var listTrabajadoresResponsableObjGen=[];
var indice1;

var listTabs=[
              {id:1,nombre:"Plantilla" },
             // {id:2,nombre:"Extras"    }, 
              ];
$(function(){
	$("#btnNuevoObjetivo").attr("onclick", "javascript:nuevoObjetivo();");
	$("#btnCancelarObjetivo").attr("onclick", "javascript:cancelarObjetivo();");
	$("#btnGuardarObjetivo").attr("onclick", "javascript:guardarObjetivo();");
	$("#btnEliminarObjetivo").attr("onclick", "javascript:eliminarObjetivo();");
	$("#divRequisitoAsociado").hide();
	$("#divObjetivoEspecifico").hide();
	$("#divMeta").hide();
	$("#divMetaAvance").hide();
	$("#divActividad").hide();
	
	insertMenuPrimeraVez(function(){
	        cargarObjetivos();
		completarBarraCarga();
		$("#tabObjetivos").show();
	});
})
/*
function verAcordeTabPlantilla(){
    	var tabId=$("#selTabPlantilla").val();
	var tabNombre="";
	$(".tab-content .tab-pane").hide();
	switch(parseInt(tabId)){
	case 1:
		tabNombre="tabPlantilla";
		cargarPlantillas();
		break;
		/*
	case 2:
		tabNombre="tabExtra"
		cargarExtra();
		break;
		*//*
	}			
	completarBarraCarga();
	$("#"+tabNombre).show();
}
*/

function cargarObjetivos() {
    
        var count = 0;
        var valorResize= 160;
        resizeDivWrapper("wrapperObjetivos",valorResize);
    
	$("#btnCancelarObjetivo").hide();
	$("#btnNuevoObjetivo").show();
	$("#btnEliminarObjetivo").hide();
	$("#btnGuardarObjetivo").hide();
	
	callAjaxPost(URL + '/objetivo', 
		     {empresaId : getSession("gestopcompanyid") }, function(data){
			if(data.CODE_RESPONSE=="05"){
				    
			    banderaEdicion1=false;
			    /*
			    listTipoPlantilla=data.listTipo;*/
			    listFullObjetivo = data.list;
			    
			    $("#tblObjetivos tbody tr").remove();
	
			    listFullObjetivo.forEach(function(val,index){	
				
				 var verifObjetivoCumplido = "No";
				    
				    if(val.validarObjetivoCumplido == '1'){
					verifObjetivoCumplido = "Sí"
				    }
				    if(val.validarObjetivoCumplido == null){
					verifObjetivoCumplido = ""
				    }
				    
				 var verifObjetivoActivo = "No";
				    
				    if(val.validarObjetivoActivo == '1'){
					verifObjetivoActivo = "Sí"
				    }
				    if(val.validarObjetivoActivo == null){
					verifObjetivoActivo = ""
				    }
				    
				    count++;
				
			       $("#tblObjetivos tbody").append(
				  //Editar sufijo
				  "<tr id='trObjetivo"+val.id+"' onclick='editarObjetivo("+index+")'>" +
				          "<td id='tdidobjgen"+val.id+"'>"+count+"</td>" +
				          "<td id='tddescripcion"+val.id+"' style='word-break: break-all;'>"+val.descripcion+"</td>" +
				          "<td id='tdresponsableobjgen"+val.id+"'>"+val.trabajador.nombre+"</td>" +
				          "<td id='tdreqasociado"+val.id+"' style='word-break: break-all;'>"+val.listRequisitosAsociados+"</td>" +
				          "<td id='tdfechainicio"+val.id+"'>"+val.fechaPlanificadaInicioTexto+"</td>" +
				          "<td id='tdfechafin"+val.id+"'>"+val.fechaPlanificadaFinTexto+"</td>" +
				          "<td id='tdobjespecificos"+val.id+"' style='word-break: break-all;'>"+val.listObjetivosEspecificos+"</td>" +
				          "<td id='tdpresupuesto"+val.id+"'>S/."+val.presupuestoTotalObjGen+"</td>" +
				          "<td id='tdrecursos"+val.id+"' style='word-break: break-all;'>"+val.listRecursosObjGen+"</td>" +
				          "<td id='tdactividades"+val.id+"'>"+val.numActividadesCompletadasObjGen+"/"+val.numTotalActividadesObjGen+"</td>" +
				          "<td id='tdavanceobjetivo"+val.id+"'>"+val.numMetasCompletadasObjGen+"/"+val.numTotalMetasObjGen+"</td>" +
				          "<td id='tdvalidarobjcum"+val.id+"'>"+verifObjetivoCumplido+"</td>" +
				          "<td id='tdvalidarobjact"+val.id+"'>"+verifObjetivoActivo+"</td>" +
				  //Agregar filas
				  "</tr>");
			    });
			    formatoCeldaSombreableTabla(true,"tblObjetivos");
			  }else{
			    console.log("NOPNPO")
			  }
			  goheadfixedY("#tblObjetivos","#wrapperObjetivos");
		   });
}

function editarObjetivo(pindex) {
	if (!banderaEdicion1) {
	    	formatoCeldaSombreableTabla(false,"tblObjetivos");
		objetivoId = listFullObjetivo[pindex].id;
		objetivoObj = listFullObjetivo[pindex];
		
		//console.log(objetivoId);
		$("#trObjetivo"+objetivoId).addClass("fila-edicion");
		
		$("#tddescripcion"+ objetivoId).html("<input type='text' id='inputDescripcion' class='form-control'>");
		$("#inputDescripcion").val(objetivoObj.descripcion);
		
		/****** CheckButtons ******/
		
		 var verifOC = objetivoObj.validarObjetivoCumplido;
		 var textoCheckOC = "";
		 
		    if(verifOC == 1){
			textoCheckOC="checked";
		    }
		 	  
		 $("#tdvalidarobjcum"+objetivoId)
		 .html("<input type='checkbox' id='checkObjetivoCumplido' class='form-control' "+textoCheckOC+">");
		
		 var verifOA = objetivoObj.validarObjetivoActivo;
		 var textoCheckOA = "";
		 
		    if(verifOA == 1){
			textoCheckOA="checked";
		    }
		 	  
		 $("#tdvalidarobjact"+objetivoId)
		 .html("<input type='checkbox' id='checkObjetivoActivo' class='form-control' "+textoCheckOA+">");
		
		/***************************/
		 
		/****** Trabajador ******/
			
		 $("#tdresponsableobjgen"+objetivoId).html("<input type='text' id='inputResponsableObjGen' class='form-control' placeholder='Responsable'>"+
						                "<div id='divAutoCompletarTrabObjGen'></div>");
			
		 $("#inputResponsableObjGen").val(objetivoObj.trabajador.nombre);
		 verAutoCompletarTrabObjGen()
		 $("#selAutoTrabajador").val(objetivoObj.trabajador.trabajadorId);
		 
		/***************************/
		 
		/****** Enlaces ******/
		 
		 indice1= $("#inputDescripcion").val();
		 
		$("#tdreqasociado"+objetivoId)
		.html("<a class='efectoLink' onclick='verObjetivoEnlaceRequisitoAsociado()'>" +
		      ""+ $("#tdreqasociado"+objetivoId).text()+" </a>");
			
		$("#tdobjespecificos"+objetivoId)
		.html("<a class='efectoLink' onclick='verObjetivoEnlaceObjetivoEspecifico()'>" +
		      ""+ $("#tdobjespecificos"+objetivoId).text()+" </a>");
			
		/*********************/
			
		banderaEdicion1 = true;
		$("#btnCancelarObjetivo").show();
		$("#btnNuevoObjetivo").hide();
		$("#btnEliminarObjetivo").show();
		$("#btnGuardarObjetivo").show();
	}
}

function nuevoObjetivo(){
	if (!banderaEdicion1) {
	    	formatoCeldaSombreableTabla(false,"tblPlantilla");
	    	objetivoObj = {id : 0};
		objetivoId = 0; 
		
		$("#tblObjetivos tbody").prepend(
		     "<tr>"
		           +"<td>...</td>"
		           +"<td><input type='text' id='inputDescripcion' class='form-control'></td>"
		           +"<td><input type='text' id='inputResponsableObjGen' class='form-control' placeholder='Responsable'>" 
			        +"<div id='divAutoCompletarTrabObjGen'></div></td>"
		           +"<td>(datos de Requisitos asociados)</td>"
		           +"<td>(fecha inicio de Actividades)</td>"
		           +"<td>(fecha fin de Actividades)</td>"
		           +"<td>(datos de Objetivos específicos)</td>"
		           +"<td>(presupuesto de Objetivos específicos)</td>"
		           +"<td>(recursos de Actividades)</td>"
		           +"<td>(datos de Actividades)</td>"
		           +"<td>(datos de Metas)</td>"
		           +"<td>No</td>"
		           +"<td>Sí</td>"
			//Agregar necesarios
		 + "</tr>");
		
		$("#inputResponsableObjGen").attr("onkeyup","verAutoCompletarTrabObjGen()");
		
		$("#btnCancelarObjetivo").show();
		$("#btnNuevoObjetivo").hide();
		$("#btnEliminarObjetivo").hide();
		$("#btnGuardarObjetivo").show();
		banderaEdicion1 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarObjetivo() {
	cargarObjetivos();
}

function eliminarObjetivo() {
	
        var r = confirm("¿Está seguro de eliminar el objetivo?");
        
	if(r == true){
	   var dataParam = {
	       id : objetivoId,
	   };
		
	   callAjaxPost(URL + '/objetivo/delete', dataParam,
		        function(data){
			   switch(data.CODE_RESPONSE){
			      case "05":
				  cargarObjetivos();
			      break;
			      
			      default:
			      alert("Ocurrió un error al eliminar el objetivo.");
			   }
			});
	}
}

function guardarObjetivo(){

    var campoVacio = true;
    //Programa lógica de acceso de guardado
    var descripcion = $("#inputDescripcion").val();
    
    var validarObjetivoCumplido;
    var trabId = parseInt($("#selAutoTrabajador").val());
    
    if(objetivoId == 0){
       validarObjetivoCumplido = 0;
    }else{
       validarObjetivoCumplido = ($("#checkObjetivoCumplido").prop("checked")?1:0);
    }
    
    var validarObjetivoActivo;
    
    if(objetivoId == 0){
       validarObjetivoActivo = 1;
    }else{
       validarObjetivoActivo = ($("#checkObjetivoActivo").prop("checked")?1:0);
    }
    
    if (campoVacio) {
	
        var dataParam = {
    		id: objetivoId,
    		descripcion: descripcion,
    		validarObjetivoCumplido: validarObjetivoCumplido,
    		validarObjetivoActivo: validarObjetivoActivo,
    		trabajador:{trabajadorId:trabId},
    		empresaId: getSession("gestopcompanyid")
    	};
        
        callAjaxPost(URL + '/objetivo/save', dataParam,
    		     function(data) {
    			switch (data.CODE_RESPONSE) {
    			case "05":
    						
    				cargarObjetivos();
    				break;
    			default:
    				console.log("Ocurrió un error al guardar el objetivo.");
    			}
    		});	
    }
}

function verAutoCompletarTrabObjGen(){
    
    var nombre = $("#inputResponsableObjGen").val().trim();
	if(nombre == ""){
	   nombre = null
	}
	var dataParam = {
			trabajadorNombre : "%"+nombre+"%",
			empresaId : getSession("gestopcompanyid")}
	
	callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
		if(data.trabajadores.length == 0){
		      data.trabajadores.push({
			 trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
		      })
		}
		
		listTrabajadoresResponsableObjGen= data.trabajadores;
		
		crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajador","", 
			data.trabajadores,"trabajadorId","nombre","#divAutoCompletarTrabObjGen","");
		
		$("#inputResponsableObjGen").attr("onkeyup","verAutoCompletarTrabObjGen()");
	});
}

function verObjetivoEnlaceRequisitoAsociado(){
    $("#tabObjetivos").hide();
    $("#tabObjetivos .container-fluid").hide();  //.container-fluid -> Adaptación al ancho del navegador
	$("#divRequisitoAsociado").show();                                                            //******
	$("#divRequisitoAsociado h3")                                                                      //******
	.html("<a onclick='volverDivObjetivo()'> "+indice1+" </a> " +                             //******
			"    " +                                                                 //******
			"> Requisitos asociados"); 
	
    cargarRequisitosAsociados();	
}

function verObjetivoEnlaceObjetivoEspecifico(){
    $("#tabObjetivos").hide();
    $("#tabObjetivos .container-fluid").hide();  //.container-fluid -> Adaptación al ancho del navegador
	$("#divObjetivoEspecifico").show();                                                            //******
	$("#divObjetivoEspecifico h3")                                                                      //******
	.html("<a onclick='volverDivObjetivo()'> "+indice1+" </a> " +                             //******
			"    " +                                                                 //******
			"> Objetivos Específicos"); 
	
    cargarObjetivosEspecificos();	
}

function volverDivObjetivo(){

    $("#divRequisitoAsociado").hide();
    $("#divRequisitoAsociado .container-fluid").hide();
    $("#divObjetivoEspecifico").hide();
    $("#divObjetivoEspecifico .container-fluid").hide();
    $("#divMeta").hide();
    $("#divMeta .container-fluid").hide();
    $("#divMetaAvance").hide();
    $("#divMetaAvance .container-fluid").hide();
    $("#divActividad").hide();
    $("#divActividad .container-fluid").hide();
    $("#tabObjetivos").show();

}

