var entPrevId,entPrevObj;
var banderaEdicionEntPrev=false;
var listFullEntrevistasPrev;
var listTipoNota=[];
var mensajeUx;

function cargarEntrevistaPrevencionista(){
   $("#btnCancelarEntPrev").hide();$("#btnNuevoEntPrev").show();$("#btnEliminarEntPrev").hide();
   $("#btnGuardarEntPrev").hide();$("#btnVerTablaDocEstActAltRieEntPrev").hide();
   
   resizeDivWrapper("wrapEntrevistaPrevencionista",170);
   
   var dataParam={
      empresaId: getSession("gestopcompanyid")	   
   };
	
   callAjaxPost(URL+'/contratista/entrevista_prevencionista',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         banderaEdicionEntPrev = false;
         listFullEntrevistasPrev = data.listFullEntrevistasPrev;
         listTipoNota = data.listTipoNota;
			
         $("#tblEntrevistaPrevencionista tbody tr").remove();
					
         listFullEntrevistasPrev.forEach(function(val,index){
            var registradoPor = (val.fechaRegistroTexto == ""?"------":
               val.fechaRegistroTexto+(val.registradoPor == ""?"":"<br>(Por "+val.registradoPor+")"));
            var actualizadoPor = (val.fechaActualizacionTexto == ""?"------":
               val.fechaActualizacionTexto+(val.actualizadoPor == ""?"":"<br>(Por "+val.actualizadoPor+")"));
            var observacion = (val.observacion.length == 0?"------":val.observacion);
            var evidencia = (val.evidenciaNombre.length == 0?"------":val.evidenciaNombre);
            var estadoPrevencionista = val.prevencionista.evaluacion.nota.icono+" "+val.prevencionista.evaluacion.nota.nombre;
            var resultado = (val.tipoNota.nombre.length == 0?"------":val.tipoNota.icono+" "+val.tipoNota.nombre);
        	 
            $("#tblEntrevistaPrevencionista tbody").append(
	       "<tr id='trEntPrev"+val.id+"' onclick='editarEntrevistaPrevencionista("+index+")'>" +
	          "<td id='tdContratista"+val.id+"'>"+val.contratista.nombre+"</td>" + 
		  "<td id='tdPrevencionista"+val.id+"'>"+val.prevencionista.trabajadorNombre+"</td>" +
		  "<td id='tdEstadoNotaNom"+val.id+"'>"+estadoPrevencionista+"</td>" + 
		  "<td id='tdFechaInicio"+val.id+"'>"+val.fechaInicioVigenciaTexto+"</td>" + 
		  "<td id='tdResultado"+val.id+"'>"+resultado+"</td>" + 
		  "<td id='tdObservacion"+val.id+"'>"+observacion+"</td>" + 
		  "<td id='tdEvidenciaEntPrev"+val.id+"'>"+evidencia+"</td>" + 
		  "<td id='tdFechaFin"+val.id+"'>"+val.fechaFinVigenciaTexto+"</td>" + 
		  "<td id='tdRegistro"+val.id+"'>"+registradoPor+"</td>" + 
		  "<td id='tdActualizacion"+val.id+"'>"+actualizadoPor+"</td>" + 
               "</tr>");
         });
					
         formatoCeldaSombreableTabla(true,"tblEntrevistaPrevencionista");
         goheadfixedY("#tblEntrevistaPrevencionista","#wrapEntrevistaPrevencionista");
      }else{
	 console.log("NOPNPO");
      }
   });
}

function editarEntrevistaPrevencionista(pindex){
   if(!banderaEdicionEntPrev){
      formatoCeldaSombreableTabla(false,"tblEntrevistaPrevencionista");
      entPrevId = listFullEntrevistasPrev[pindex].id;
      entPrevObj = listFullEntrevistasPrev[pindex];
      
      $("#trEntPrev"+entPrevId).addClass("fila-edicion");
      
      $("#tdContratista"+entPrevId).html(
         "<input type='text' id='inputContratistaEntPrev' class='form-control'>" +
	 "<div id='divAutoCompletarContratistaEntPrev'></div>" +
	 "<label>*Buscar contratista por RUC y/o nombre " +
	        "(debe ingresar 3 caracteres como mínimo) [obligatorio].</label>");
      $("#inputContratistaEntPrev").val(entPrevObj.contratista.nombre);
      
      $("#tdPrevencionista"+entPrevId).html(
         "<input type='text' id='inputPrevencionistaEntPrev' class='form-control'>" +
	 "<div id='divAutoCompletarPrevencionistaEntPrev'></div>" +
	 "<label>*Buscar trabajador por N° documento y/o nombre (antes debe seleccionar " +
	        "un contratista) [obligatorio].</label>");
      $("#inputPrevencionistaEntPrev").val(entPrevObj.prevencionista.trabajadorNombre);
      
      $("#tdEstadoNotaNom"+entPrevId).html("<div id='divInfEstadoNotaNomEntPrev'><label>------</label></div>");
      
      $("#inputContratistaEntPrev").attr("onkeyup","verAutoCompletarContratistaEntPrev()");
      verAutoCompletarContratistaEntPrev();
      
      $("#tdFechaInicio"+entPrevId).html(
         "<input class='form-control' type='date' id='inputFechaInicioEntPrev'>" +
         "<label>*Obligatorio</label>");
      $("#inputFechaInicioEntPrev").val(convertirFechaInput(entPrevObj.fechaInicioVigencia));	
      
      var selTipoNota = crearSelectOneMenu("selTipoNota","",listTipoNota,
         entPrevObj.tipoNota.id,"id","nombre");
      $("#tdResultado"+entPrevId).html(selTipoNota);
      
      $("#tdObservacion"+entPrevId).html("<input type='text' id='inputObservacionEntPrev' class='form-control'>");
      $("#inputObservacionEntPrev").val(entPrevObj.observacion);
      
      $("#tdFechaFin"+entPrevId).html(
         "<input class='form-control' type='date' id='inputFechaFinEntPrev'>" +
         "<label>*Obligatorio</label>");
      $("#inputFechaFinEntPrev").val(convertirFechaInput(entPrevObj.fechaFinVigencia));	
      
      $("#tdActualizacion"+entPrevId).html("<label>*Automático</label>");
      
      var optionEvidencia={
    	 isImage: false,container: "#tdEvidenciaEntPrev"+entPrevId,
    	 idAux: "EntPrev",esNuevo: (entPrevObj.evidenciaNombre.length == 0?true:false),
    	 evidenciaNombre: entPrevObj.evidenciaNombre,
    	 functionCall: function(){
    	    validacionSubirEvidencia("EntPrev",bitsMega*10,"");
    	 },descargaUrl: "/contratista/entrevista_prevencionista/evidencia?id="+entPrevId
      };
    		 			
      crearFormEvidenciaCompleta(optionEvidencia);
      
      banderaEdicionEntPrev = true;
      
      $("#btnCancelarEntPrev").show();$("#btnNuevoEntPrev").hide();$("#btnEliminarEntPrev").show();
      $("#btnGuardarEntPrev").show();
   }
} 

function nuevoEntrevistaPrevencionista(){
   if(!banderaEdicionEntPrev){
      formatoCeldaSombreableTabla(false,"tblEntrevistaPrevencionista");
      entPrevObj = {id: 0};entPrevId = 0; 
		    		
      var selTipoNota = crearSelectOneMenu("selTipoNota","",listTipoNota,"-1","id","nombre");
	       	
      $("#tblEntrevistaPrevencionista tbody").prepend(
         "<tr>" +
	    "<td><input type='text' id='inputContratistaEntPrev' class='form-control'>" +
	        "<div id='divAutoCompletarContratistaEntPrev'></div>" +
	        "<label>*Buscar contratista por RUC y/o nombre " +
	               "(debe ingresar 3 caracteres como mínimo) [obligatorio].</label></td>" +
	    "<td><input type='text' id='inputPrevencionistaEntPrev' class='form-control'>" +
	        "<div id='divAutoCompletarPrevencionistaEntPrev'></div>" +
	        "<label>*Buscar trabajador por N° documento y/o nombre (antes debe seleccionar " +
	               "un contratista) [obligatorio].</label></td>" +
	    "<td><div id='divInfEstadoNotaNomEntPrev'><label>------</label></div></td>" +
	    "<td><input class='form-control' type='date' id='inputFechaInicioEntPrev'>" +
	        "<label>*Obligatorio</label></td>" + 
	    "<td>"+selTipoNota+"</td>" +
	    "<td><input type='text' id='inputObservacionEntPrev' class='form-control'></td>" +
	    "<td id='tdEvidenciaEntPrev0'></td>" +
	    "<td><input class='form-control' type='date' id='inputFechaFinEntPrev'>" +
	        "<label>*Obligatorio</label></td>" + 
	    "<td><label>*Automático</label></td>" +
	    "<td><label>*Automático</label></td>" +
	 "</tr>");
	       
      var optionEvidencia={
         isImage: false,container: "#tdEvidenciaEntPrev"+entPrevId,
	 idAux: "EntPrev",esNuevo: true,evidenciaNombre: "",
	 functionCall: function(){
	    validacionSubirEvidencia("EntPrev",bitsMega*10,"");
	 },descargaUrl: ""
      };
	 			
      crearFormEvidenciaCompleta(optionEvidencia);
      
      $("#inputContratistaEntPrev").attr("onkeyup","verAutoCompletarContratistaEntPrev()");
      document.getElementById("inputPrevencionistaEntPrev").disabled = true;
      verAutoCompletarContratistaEntPrev();
	 		
      banderaEdicionEntPrev = true;
      
      $("#btnCancelarEntPrev").show();$("#btnNuevoEntPrev").hide();$("#btnEliminarEntPrev").hide();
      $("#btnGuardarEntPrev").show();
   }else{
      alert("Guarde primero.");
   }
}

function cancelarEntrevistaPrevencionista(){
   cargarEntrevistaPrevencionista();
}

var listContratistaBuscadorAux=[];

function verAutoCompletarContratistaEntPrev(){
   var contratista = $("#inputContratistaEntPrev").val().trim();

   if(contratista.length >= 3){
      var dataParam={
	 nombre: "%"+contratista+"%",isBuscador: 1,
	 empresaId: getSession("gestopcompanyid")
      };

      callAjaxPostNoLoad(URL+"/contratista/buscar",dataParam,function(data){
    	 listContratistaBuscadorAux = [];
    	 listContratistaBuscadorAux = data.contratistas; 
    	  
         if(listContratistaBuscadorAux.length == 0){
            listContratistaBuscadorAux.push({id:-1,nombre:"Sin asignar"});
         }

	 crearSelectOneMenuObligUnitarioCompleto("selAutoContratistaEntPrev","verAutoCompletarPrevencionistaEntPrev()", 
            listContratistaBuscadorAux,"id","nombre","#divAutoCompletarContratistaEntPrev","");
	
	 $("#inputContratistaEntPrev").attr("onkeyup","verAutoCompletarContratistaEntPrev()");
	 verValidacionCompletarPrevencionistaEntPrev();
      });
   }else{
      listContratistaBuscadorAux = [];
       
      listContratistaBuscadorAux.push({id:-1,nombre:"Sin asignar"});
	           
      crearSelectOneMenuObligUnitarioCompleto("selAutoContratistaEntPrev","verAutoCompletarPrevencionistaEntPrev()", 
         listContratistaBuscadorAux,"id","nombre","#divAutoCompletarContratistaEntPrev","");
	    		       
      $("#inputContratistaEntPrev").attr("onkeyup","verAutoCompletarContratistaEntPrev()");
      verValidacionCompletarPrevencionistaEntPrev();
   }
}

function verValidacionCompletarPrevencionistaEntPrev(){
   var contratistaId = $("#selAutoContratistaEntPrev").val();
   
   if(contratistaId != -1){
      document.getElementById("inputPrevencionistaEntPrev").disabled = false; 
      verAutoCompletarPrevencionistaEntPrev();
   }else{
      document.getElementById("inputPrevencionistaEntPrev").disabled = true; 
      $("#inputPrevencionistaEntPrev").val("");
      $("#divAutoCompletarPrevencionistaEntPrev").html("");
      $("#divInfEstadoNotaNomEntPrev").html("<label>------</label>");
      $("#btnVerTablaDocEstActAltRieEntPrev").hide();
   }
}

var listPrevencionistasAux=[];

function verAutoCompletarPrevencionistaEntPrev(){
   var prevencionista = $("#inputPrevencionistaEntPrev").val().trim();
   
   var dataParam={
      trabajadorNombre: (prevencionista != ""?"%"+prevencionista+"%":null),
      contratistaId: $("#selAutoContratistaEntPrev").val(),isBuscador: 1
   };

   callAjaxPostNoLoad(URL+"/contratista/prevencionista/buscar",dataParam,function(data){
      listPrevencionistasAux = [];
      listPrevencionistasAux = data.prevencionistas;
	   
      if(listPrevencionistasAux.length == 0){
    	 listPrevencionistasAux.push({id:-1,trabajadorId:-1,trabajadorNombre:"Sin resultado",
    	    trabajadorSubContratado: "------",evaluacion:{nota:{nombre:"------",icono:""}}});
      }
	  
      crearSelectOneMenuObligUnitarioCompleto("selAutoPrevencionistaEntPrev","verAutoCompletarSubContratadoEntPrev()", 
         listPrevencionistasAux,"id","trabajadorNombre","#divAutoCompletarPrevencionistaEntPrev","");
		
      $("#inputPrevencionistaEntPrev").attr("onkeyup","verAutoCompletarPrevencionistaEntPrev()");
      verAutoCompletarSubContratadoEntPrev();
   });
}

function verAutoCompletarSubContratadoEntPrev(){
   var evalNotaNombre;
    
   listPrevencionistasAux.forEach(function(val){
      if(val.id == parseInt($("#selAutoPrevencionistaEntPrev").val())){
         evalNotaNombre = val.evaluacion.nota.icono+" "+val.evaluacion.nota.nombre;
      }
   });
    
   $("#divInfEstadoNotaNomEntPrev").html("<label>"+evalNotaNombre+"</label>");
   $("#btnVerTablaDocEstActAltRieEntPrev").show();
}

function eliminarEntrevistaPrevencionista(){
   mensajeUx="<label>¿Está seguro de eliminar la entrevista seleccionada?</label>";
   mensajesUx(mensajeUx,3,"","EliminarEntPrev");

   $("#btnDevolverValorEliminarEntPrev").on("click",function(){
      var dataParam={
         id: entPrevObj.id
      };

      callAjaxPost(URL+'/contratista/entrevista_prevencionista/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx="<label>La entrevista seleccionada se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarVistaEntPrev");

               $("#modalMensajeUxActualizarVistaEntPrev").on("hidden.bs.modal",function(){
                  cargarEntrevistaPrevencionista();   
               });
               break;
			
            default:
               alert("Ocurrió un error al eliminar la entrevista!");
         }
      });
   });
}

function guardarEntrevistaPrevencionista(){
   var campoVacio = true;
  
   var contratistaId = parseInt($("#selAutoContratistaEntPrev").val());
   var prevencionistaId = (contratistaId == -1?-1:parseInt($("#selAutoPrevencionistaEntPrev").val()));
   
   var fechaInicioVigencia = convertirFechaTexto($("#inputFechaInicioEntPrev").val());
   var inputFechaInicioVigencia = (!fechaInicioVigencia?null:fechaInicioVigencia);
    
   var tipoNotaId = parseInt($("#selTipoNota").val());
   var observacion = $("#inputObservacionEntPrev").val();
   var evidenciaNombre = $("#inputEviEntPrev").val();
   
   var fechaFinVigencia = convertirFechaTexto($("#inputFechaFinEntPrev").val());
   var inputFechaFinVigencia = (!fechaFinVigencia?null:fechaFinVigencia);
   
   if(contratistaId == -1 || prevencionistaId == -1 || inputFechaInicioVigencia == null || inputFechaFinVigencia == null){
      mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>";
      campoVacio = false;
   }else if(evidenciaNombre == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
      campoVacio = false;
   }else{
      var numDiasVigencia;
      numDiasVigencia = restaFechas($("#inputFechaInicioEntPrev").val(),$("#inputFechaFinEntPrev").val());
	  
      if(numDiasVigencia < 0){
	 mensajeUx = "<label>La fecha fin de vigencia no puede ser menor que la fecha de la entrevista.</label>";
	 campoVacio = false; 
      }
   }
   
   if(campoVacio){
      var dataParam={
    	 id: entPrevId,contratista:{id: contratistaId},prevencionista:{id: prevencionistaId},
    	 fechaInicioVigencia: inputFechaInicioVigencia,tipoNota:{id: tipoNotaId},observacion: observacion,
    	 fechaFinVigencia: inputFechaFinVigencia,empresaId: parseInt(getSession("gestopcompanyid"))
      };
        
      callAjaxPost(URL+'/contratista/entrevista_prevencionista/save',dataParam,
         procesarResultadoGuardarEvidenciaEntrevistaPrevencionista);	
   }else{
      mensajesUx(mensajeUx,2,"");
   }	
} 

function procesarResultadoGuardarEvidenciaEntrevistaPrevencionista(data){
   switch(data.CODE_RESPONSE){
      case "05":
	 guardarEvidenciaAuto(data.nuevoId,"fileEviEntPrev",bitsMega*10,
         "/contratista/entrevista_prevencionista/evidencia/save",function(){
	    mensajeUx="<label>La entrevista fue "+(entPrevId == 0?"registrada":"actualizada") +
		      " con éxito.</label>";
	    mensajesUx(mensajeUx,1,"","ActualizarEntPrevMain");
		    	 
	    $("#modalMensajeUxActualizarEntPrevMain").on("hidden.bs.modal",function(){
	       cargarEntrevistaPrevencionista();     
	    });
	 });
		 
	 break;

      default:
         alert("Ocurrió un error al guardar la evidencia!");
   }
}
