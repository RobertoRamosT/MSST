var indTrabNuevoId,indTrabNuevoObj;
var banderaEdicionIndTrabNuevo = false;
var listFullInduccionesTrabNuevo;
var listTipoNota = [];
var mensajeUx;

function cargarInduccionTrabajadorNuevo(){
   $("#btnCancelarIndTrabNuevo").hide();$("#btnNuevoIndTrabNuevo").show();$("#btnEliminarIndTrabNuevo").hide();
   $("#btnGuardarIndTrabNuevo").hide();
   
   resizeDivWrapper("wrapInduccionTrabajadorNuevo",170);
   
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))	   
   };
	
   callAjaxPost(URL+'/contratista/induccion_trabajador_nuevo',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 banderaEdicionIndTrabNuevo = false;
         listFullInduccionesTrabNuevo = data.listInduccionesTrabNuevo;
         listTipoNota = data.listTipoNota;
			
         $("#tblInduccionTrabajadorNuevo tbody tr").remove();
					
         listFullInduccionesTrabNuevo.forEach(function(val,index){
            var creadoPor = val.fechaCreacionTexto+(val.creadoPor == ""?"":"<br>(Por "+val.creadoPor+")");
            var modificadoPor = val.fechaModificacionTexto+(val.modificadoPor == ""?"":"<br>(Por "+val.modificadoPor+")");
            var comentario = (val.comentario.length == 0?"------":val.comentario);
            var evidencia = (val.evidenciaNombre.length == 0?"------":val.evidenciaNombre);
            var resultado = val.tipoNota.icono+" "+val.tipoNota.nombre;
        	 
            $("#tblInduccionTrabajadorNuevo tbody").append(
	       "<tr id='trIndTrabNuevo"+val.id+"' onclick='editarInduccionTrabajadorNuevo("+index+")'>" +
	          "<td id='tdCont"+val.id+"'>"+val.contratista.nombre+"</td>" + 
		  "<td id='tdTrabCont"+val.id+"'>"+val.trabajadorContratista.nombre+"</td>" +
		  "<td id='tdFecInicio"+val.id+"'>"+val.fechaInicioVigenciaTexto+"</td>" + 
		  "<td id='tdResul"+val.id+"'>"+resultado+"</td>" + 
		  "<td id='tdComent"+val.id+"'>"+comentario+"</td>" + 
		  "<td id='tdFecFin"+val.id+"'>"+val.fechaFinVigenciaTexto+"</td>" + 
		  "<td id='tdEviIndTrabNuevo"+val.id+"'>"+evidencia+"</td>" + 
		  "<td id='tdCre"+val.id+"'>"+creadoPor+"</td>" + 
		  "<td id='tdMod"+val.id+"'>"+modificadoPor+"</td>" + 
               "</tr>");
         });
					
         formatoCeldaSombreableTabla(true,"tblInduccionTrabajadorNuevo");
         goheadfixedY("#tblInduccionTrabajadorNuevo","#wrapInduccionTrabajadorNuevo");
      }else{
	 console.log("NOPNPO");
      }
   });
}

function editarInduccionTrabajadorNuevo(pindex){
   if(!banderaEdicionIndTrabNuevo){
      formatoCeldaSombreableTabla(false,"tblInduccionTrabajadorNuevo");
      indTrabNuevoId = listFullInduccionesTrabNuevo[pindex].id;
      indTrabNuevoObj = listFullInduccionesTrabNuevo[pindex];
      
      $("#trIndTrabNuevo"+indTrabNuevoId).addClass("fila-edicion");
      
      $("#tdFecInicio"+indTrabNuevoId).html(
         "<input class='form-control' type='date' id='inputFechaInicioIndTrabNuevo'>" +
         "<label>*Obligatorio</label>");
      $("#inputFechaInicioIndTrabNuevo").val(convertirFechaInput(indTrabNuevoObj.fechaInicioVigencia));	
      
      var selTipoNotaIndTrabNuevo = crearSelectOneMenuOblig("selTipoNotaIndTrabNuevo","",listTipoNota,indTrabNuevoObj.tipoNota.id,"id","nombre");
      $("#tdResul"+indTrabNuevoId).html(selTipoNotaIndTrabNuevo);
      
      $("#tdComent"+indTrabNuevoId).html("<textarea id='textComentarioIndTrabNuevo' class='form-control' rows='5'></textarea>");
      $("#textComentarioIndTrabNuevo").val(indTrabNuevoObj.comentario);
      
      $("#tdFecFin"+indTrabNuevoId).html(
         "<input class='form-control' type='date' id='inputFechaFinIndTrabNuevo'>" +
         "<label>*Obligatorio</label>");
      $("#inputFechaFinIndTrabNuevo").val(convertirFechaInput(indTrabNuevoObj.fechaFinVigencia));	
      
      $("#tdMod"+indTrabNuevoId).html("<label>*Automático</label>");
      
      var optionEvidencia={
    	 isImage: false,container: "#tdEviIndTrabNuevo"+indTrabNuevoId,
    	 idAux: "IndTrabNuevo"+indTrabNuevoId,evidenciaNombre: indTrabNuevoObj.evidenciaNombre,
    	 esNuevo: (indTrabNuevoObj.evidenciaNombre.length == 0?true:false),
    	 functionCall: function(){
    	    validacionSubirEvidencia("IndTrabNuevo"+indTrabNuevoId,bitsMega*10,"");
    	 },descargaUrl: "/contratista/amazon_s3/induccion_trabajador_nuevo/evidencia?id="+indTrabNuevoId
      };
    		 			
      crearFormEvidenciaCompleta(optionEvidencia);
      
      banderaEdicionIndTrabNuevo = true;
      
      $("#btnCancelarIndTrabNuevo").show();$("#btnNuevoIndTrabNuevo").hide();$("#btnEliminarIndTrabNuevo").show();
      $("#btnGuardarIndTrabNuevo").show();
   }
} 

function nuevoInduccionTrabajadorNuevo(){
   if(!banderaEdicionIndTrabNuevo){
      formatoCeldaSombreableTabla(false,"tblEntrevistaPrevencionista");
      indTrabNuevoObj = {id: 0};indTrabNuevoId = 0; 
		    		
      var selTipoNotaIndTrabNuevo = crearSelectOneMenuOblig("selTipoNotaIndTrabNuevo","",listTipoNota,"3","id","nombre");
	       	
      $("#tblInduccionTrabajadorNuevo tbody").prepend(
         "<tr>" +
	    "<td><input id='inputContratistaIndTrabNuevo' type='text' class='form-control'>" +
	        "<div id='divAutoCompletarContratistaIndTrabNuevo'></div>" +
	        "<label>*Buscar contratista por RUC y/o nombre " +
	               "(debe ingresar 3 caracteres como mínimo) [obligatorio].</label></td>" +
	    "<td><input id='inputTrabContratistaIndTrabNuevo' type='text' class='form-control'>" +
	        "<div id='divAutoCompletarTrabContratistaIndTrabNuevo'></div>" +
	        "<label>*Buscar trabajador por N° documento y/o nombre (antes debe seleccionar " +
	               "un contratista) [obligatorio].</label></td>" +
	    "<td><input id='inputFechaInicioIndTrabNuevo' class='form-control' type='date'>" +
	        "<label>*Obligatorio</label></td>" + 
	    "<td>"+selTipoNotaIndTrabNuevo+"</td>" +
	    "<td><textarea id='textComentarioIndTrabNuevo' class='form-control' rows='5'></textarea></td>" +
	    "<td><input id='inputFechaFinIndTrabNuevo' class='form-control' type='date'>" +
	        "<label>*Obligatorio</label></td>" + 
	    "<td id='tdEviIndTrabNuevo0'></td>" +
	    "<td><label>*Automático</label></td>" +
	    "<td><label>*Automático</label></td>" +
	 "</tr>");
	       
      var optionEvidencia={
         isImage: false,container: "#tdEviIndTrabNuevo"+indTrabNuevoId,
	 idAux: "IndTrabNuevo"+indTrabNuevoId,esNuevo: true,evidenciaNombre: "",
	 functionCall: function(){
	    validacionSubirEvidencia("IndTrabNuevo"+indTrabNuevoId,bitsMega*10,"");
	 },descargaUrl: ""
      };
	 			
      crearFormEvidenciaCompleta(optionEvidencia);
      
      $("#inputContratistaIndTrabNuevo").attr("onkeyup","verAutoCompletarContratistaIndTrabNuevo()");
      document.getElementById("inputTrabContratistaIndTrabNuevo").disabled = true;
      verAutoCompletarContratistaIndTrabNuevo();
	 		
      banderaEdicionIndTrabNuevo = true;
      
      $("#btnCancelarIndTrabNuevo").show();$("#btnNuevoIndTrabNuevo").hide();$("#btnEliminarIndTrabNuevo").hide();
      $("#btnGuardarIndTrabNuevo").show();
   }else{
      alert("Guarde primero.");
   }
}

function cancelarInduccionTrabajadorNuevo(){
   cargarInduccionTrabajadorNuevo();
}

var listContratistaBuscadorAux = [];

function verAutoCompletarContratistaIndTrabNuevo(){
   var contratista = $("#inputContratistaIndTrabNuevo").val().trim();

   if(contratista.length >= 3){
      var dataParam={
	 nombre: "%"+contratista+"%",isBuscador: 1,empresaId: parseInt(getSession("gestopcompanyid"))
      };

      callAjaxPostNoLoad(URL+"/contratista/buscar",dataParam,function(data){
    	 listContratistaBuscadorAux = (data.contratistas.length == 0?[{id: -1,nombre: "Sin asignar"}]:data.contratistas);
    	 
	 var selAutoContratistaIndTrabNuevo = crearSelectOneMenuOblig("selAutoContratistaIndTrabNuevo",
	    "verValidacionCompletarPrevencionistaIndTrabNuevo()",listContratistaBuscadorAux,"","id","nombre");
	
	 $("#divAutoCompletarContratistaIndTrabNuevo").html(selAutoContratistaIndTrabNuevo);
	 $("#inputContratistaIndTrabNuevo").attr("onkeyup","verAutoCompletarContratistaIndTrabNuevo()");
	 verValidacionCompletarPrevencionistaIndTrabNuevo();
      });
   }else{
      listContratistaBuscadorAux = [{id:-1,nombre:"Sin asignar"}];

      var selAutoContratistaIndTrabNuevo = crearSelectOneMenuOblig("selAutoContratistaIndTrabNuevo",
	 "",listContratistaBuscadorAux,"","id","nombre");
		
      $("#divAutoCompletarContratistaIndTrabNuevo").html(selAutoContratistaIndTrabNuevo);
      $("#inputContratistaIndTrabNuevo").attr("onkeyup","verAutoCompletarContratistaIndTrabNuevo()");
      verValidacionCompletarPrevencionistaIndTrabNuevo();
   }
}

function verValidacionCompletarPrevencionistaIndTrabNuevo(){
   var contratistaId = $("#selAutoContratistaIndTrabNuevo").val();
   
   if(contratistaId != -1){
      document.getElementById("inputTrabContratistaIndTrabNuevo").disabled = false; 
      verAutoCompletarTrabContratistaIndTrabNuevo();
   }else{
      document.getElementById("inputTrabContratistaIndTrabNuevo").disabled = true; 
      $("#inputTrabContratistaIndTrabNuevo").val("");$("#divAutoCompletarTrabContratistaIndTrabNuevo").html("");
   }
}

var listTrabContratistasAux = [];

function verAutoCompletarTrabContratistaIndTrabNuevo(){
   var trabajador = $("#inputTrabContratistaIndTrabNuevo").val().trim();
   var contratistaId = parseInt($("#selAutoContratistaIndTrabNuevo").val());
   
   var dataParam={
      nombre: "%"+trabajador+"%",isBuscador: 1,contratistaId: contratistaId,nuevoTrabajador: 1
   };

   callAjaxPostNoLoad(URL+"/contratista/trabajadores/buscar/simple",dataParam,function(data){
      listTrabContratistasAux = (data.trabajadores.length == 0?[{id: -1,nombre: "Sin asignar"}]:data.trabajadores);

      var selAutoTrabContratistaIndTrabNuevo = crearSelectOneMenuOblig("selAutoTrabContratistaIndTrabNuevo",
 	 "",listTrabContratistasAux,"","id","nombre");
 		 		       
      $("#divAutoCompletarTrabContratistaIndTrabNuevo").html(selAutoTrabContratistaIndTrabNuevo);
      $("#inputTrabContratistaIndTrabNuevo").attr("onkeyup","verAutoCompletarTrabContratistaIndTrabNuevo()");
   });
}

function eliminarInduccionTrabajadorNuevo(){
   mensajeUx="<label>¿Está seguro de eliminar el registro 'Inducción a trabajadores nuevos' seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","EliminarIndTrabNuevo");

   $("#btnDevolverValorEliminarIndTrabNuevo").on("click",function(){
      var dataParam={
         id: indTrabNuevoId,bucketNombre: BUCKETAMAZONS3
      };

      callAjaxPost(URL+'/contratista/induccion_trabajador_nuevo/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx="<label>El registro 'Inducción a trabajadores nuevos' seleccionado se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarIndTrabNuevo");

               $("#modalMensajeUxActualizarIndTrabNuevo").on("hidden.bs.modal",function(){
        	   cargarInduccionTrabajadorNuevo();   
               });
               break;
			
            default:
               alert("Ocurrió un error al eliminar el registro 'Inducción a trabajadores nuevos'!");
         }
      });
   });
}

var contratistaIdParam,trabContratistaIdParam;

function confirmacionGuardarInduccionTrabajadorNuevo(){
   if(indTrabNuevoId == 0){
      var campoVacio = true; 
       
      contratistaIdParam = parseInt($("#selAutoContratistaIndTrabNuevo").val());
      trabContratistaIdParam = (contratistaIdParam == -1?-1:parseInt($("#selAutoTrabContratistaIndTrabNuevo").val())); 
      
      if(contratistaIdParam == -1 || trabContratistaIdParam == -1){
	 mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>";
	 campoVacio = false;
      }
      
      if(campoVacio){   
         mensajeUx="<label>Una vez guardado este registro 'Inducción a trabajadores nuevos' no podrá cambiar los valores " +
            "seleccionados de las columnas 'contratista' y 'Trabajador con menos de 3 meses en la empresa'. ¿Desea continuar?</label>";
         mensajesUx(mensajeUx,3,"","ConfirGuardarIndTrabNuevo");

         $("#btnDevolverValorConfirGuardarIndTrabNuevo").on("click",function(){
            guardarInduccionTrabajadorNuevo();
         });
      }else{
         mensajesUx(mensajeUx,2,"");
      }
   }else{
      guardarInduccionTrabajadorNuevo();
   }
}

function guardarInduccionTrabajadorNuevo(){
   var campoVacio = true;
   
   var fechaInicioVigencia = convertirFechaTexto($("#inputFechaInicioIndTrabNuevo").val());
   var inputFechaInicioVigencia = (!fechaInicioVigencia?null:fechaInicioVigencia);
    
   var tipoNotaId = parseInt($("#selTipoNotaIndTrabNuevo").val()),comentario = $("#textComentarioIndTrabNuevo").val();
   
   var fechaFinVigencia = convertirFechaTexto($("#inputFechaFinIndTrabNuevo").val());
   var inputFechaFinVigencia = (!fechaFinVigencia?null:fechaFinVigencia);
   
   var evidenciaNombre = $("#inputEviIndTrabNuevo"+indTrabNuevoId).val();
   
   if(inputFechaInicioVigencia == null || inputFechaFinVigencia == null){
      mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>";
      campoVacio = false;
   }else if(evidenciaNombre == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
      campoVacio = false;
   }else{
      var numDiasVigencia = restaFechas($("#inputFechaInicioIndTrabNuevo").val(),$("#inputFechaFinIndTrabNuevo").val());
	  
      if(numDiasVigencia < 0){
	 mensajeUx = "<label>La fecha fin de vigencia no puede ser menor que la fecha de la entrevista.</label>";
	 campoVacio = false; 
      }
   }
   
   if(campoVacio){
      var dataParam={
    	 id: indTrabNuevoId,fechaInicioVigencia: inputFechaInicioVigencia,tipoNota:{id: tipoNotaId},comentario: comentario,
    	 fechaFinVigencia: inputFechaFinVigencia,empresaId: parseInt(getSession("gestopcompanyid"))
      };
      
      if(indTrabNuevoId == 0){
	 dataParam.contratista = {id: contratistaIdParam};dataParam.trabajadorContratista = {id: trabContratistaIdParam};
      }
        
      callAjaxPostSimple(URL+'/contratista/induccion_trabajador_nuevo/save',dataParam,1,function(data){
         switch(data.CODE_RESPONSE){
            case "05":  
	       guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviIndTrabNuevo"+indTrabNuevoId,bitsMega*10,
	       0,1,"/contratista/amazon_s3/induccion_trabajador_nuevo/evidencia/save","induccion-trabajador-nuevo/evidencia",function(){
	          mensajeUx="<label>El registro 'Inducción a trabajadores nuevos' fue guardado correctamente.</label>";
	          mensajesUx(mensajeUx,1,"","ActualizarIndTrabNuevo"); 
									   
	          $("#modalMensajeUxActualizarIndTrabNuevo").on("hidden.bs.modal",function(){
	             cargarInduccionTrabajadorNuevo();  
	          });
	       });
			
	       break;
							
            default:
	       alert("Ocurrió un error al guardar el registro 'Inducción a trabajadores nuevos'");
         }
      });
   }else{
      mensajesUx(mensajeUx,2,"");
   }	
} 
