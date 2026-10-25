
var listGabinetesIncendio=[],listEvalInspeccGabinetesIncendio=[];
var auditoriaGabineteIncendioId;
var evalInspeccGabineteIncendioObj = {};
var indexEvalInspeccGabineteIncendio;
var mensajeUx;

function toggleMenuOpcionEvalInspeccGabinetesIncendio(obj,pindex){
   evalInspeccGabineteIncendioObj = listEvalInspeccGabinetesIncendio[pindex]; 
   indexEvalInspeccGabineteIncendio= pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesEvalInspeccGabinetesIncendio=[
   {id:"opcEvaluar",nombre:"<i class='fa fa-list-alt'></i> Evaluar ",
    functionClick:function(data){realizarEvaluacionInspeccionGabineteIncendio()}},
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
    functionClick:function(data){editarSeleccionarGabineteIncendioEvaluacion()}},
   {id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar ",
    functionClick:function(data){eliminarSeleccionarGabineteIncendioEvaluacion()}}
];

function marcarSubOpcionEvalInspeccGabinetesIncendio(pindex){
   funcionalidadesEvalInspeccGabinetesIncendio[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function procesarListaInspeccionMovilGabineteIncendio(data){
   if(data.CODE_RESPONSE == "05"){
      $.unblockUI();window.scrollTo({top: 0,behavior: 'smooth'});
      $("#subRealizarInspecciones").find(".contenidoSubList").html("");
      
      auditoriaObjMovil = data.auditoriaAux[0];
      listGabinetesIncendio = data.listGabinetesIncendio;
      listEvalInspeccGabinetesIncendio = data.listEvalInspeccGabinetesIncendio;
      valTipoId = 2;
      
      $("#subRealizarInspecciones").find(".tituloSubList").html(
 	 textoBotonVolverContenidoColaborador+" "+inspeccionEvento.text);
      
      $("#infoMovilGabineteIncendioInspeccEvalPendiente").remove();
      $("#infoMovilGabineteIncendioInspeccEvalCompletado").remove();
      $("#estadoMovilRegGabineteIncendioInspeccionFin").remove();
      
      var textPendiente="",textCompletado="";
      var numEvalInsGabIncApr=0,numEvalInsGabIncDes=0;
       
      listEvalInspeccGabinetesIncendio.forEach(function(val,index){
	 var menuOpcion = "",btnOpcion = "",numPreguntasMarcadas=0,
	     isVigenteFecRec="",isVigenciaFecMan="",isVigenciaFecHid="";
	 
	 menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
	    funcionalidadesEvalInspeccGabinetesIncendio.forEach(function(val1,index1){
               menuOpcion += 
	          "<li class='list-group-item' " +
		      "onclick='marcarSubOpcionEvalInspeccGabinetesIncendio("+index1+")'>" +
		      val1.nombre +
		  "</li>";
	    });
	 menuOpcion+="</ul>";
			
	 btnOpcion = 
	    "<a class='btn-gestion efectoLink' " +
	       "onclick='toggleMenuOpcionEvalInspeccGabinetesIncendio(this,"+index+")'>" +
	       "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
	    "</a>";
	 
	 numPreguntasMarcadas = val.numRespuestasMarcadasSi + val.numRespuestasMarcadasNo;
	 isVigenciaFecMan = (val.gabineteIncendio.isVigenteFechaMantenimiento >= 0?"blue;":"red;");
	 
	 var btnOpcionAux1 = 
	    "<a id='btnVerInspeccGabInc"+val.id+"' class='btn-gestion efectoLink' " +
               "onclick='verDetallesInspeccionGabineteIncendio("+index+")'>" +
               "<i class='fa fa-eye' aria-hidden='true'></i> Ver Detalles" +
            "</a>";

         var btnOpcionAux2 = 
            "<a id='btnOcultarInspeccGabInc"+val.id+"' style='display:none' class='btn-gestion efectoLink' " +
               "onclick='ocultarDetallesInspeccionGabineteIncendio("+index+")'>" +
               "<i class='fa fa-eye-slash' aria-hidden='true'></i> Ocultar Detalles" +
            "</a>";

	 var listTotal=[
	    {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
	     label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
	 	      "*** Datos del gabinete contra incendios asociado***" +
	 	   "</span>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
	     label:"<i class='fa fa-barcode'></i> Código:",inputForm:val.gabineteIncendio.codigo+btnOpcionAux1+btnOpcionAux2},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
	     label:"<i class='fa fa-building'></i> Ubicación:",inputForm:val.gabineteIncendio.ubicacion},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
             label:"<i class='fa fa-calendar'></i> Fecha vencimiento de mantenimiento:",
             inputForm:"<label style='color:"+isVigenciaFecMan+"'>"+val.gabineteIncendio.fechaFinMantenimientoTexto+"</label>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
             label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
	     label:"<i class='fa fa-calendar'></i> Registrado el",
	     inputForm:val.fechaCreacionTexto+" (por "+val.registradoPor+")"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
             label:"",inputForm:""},
	    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
             clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,inputForm:"",
             label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
		      "*** Estado de la evaluación ***" +
		   "</span>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
	     label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
             label:"<i class='fa fa-info-circle'></i> N° de preguntas con observaciones:",inputForm:val.numRespuestasMarcadasNo},
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
	     label:"<i class='fa fa-info-circle'></i> N° de preguntas sin observación:",inputForm:val.numRespuestasMarcadasSi},
	    {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
	     label:"<i class='fa fa-info-circle'></i> N° total de preguntas:",inputForm:numPreguntasMarcadas+" / "+val.numPreguntasTotal},
	 ]; 
	 
	 if(val.numRespuestasMarcadasNo > 0){
            listTotal.push(
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
		label:"",inputForm:""},
	       {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
		clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,inputForm:"",
		label:"<span style='color:blue;font-size:"+(isMobile.any()?"14px":"18px")+";font-weight:bolder;'>" +
		         "*** Estado de la(s) medida(s) correctiva(s) ***" +
		      "</span>"},
	       {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccGabInc detalle-inspeccGabInc"+val.id,
		label:"<i class='fa fa-info-circle'></i> N° de medidas correctivas oompletadas:",
		inputForm:val.numAccCorCompletadas+" / "+val.numRespuestasMarcadasNo}); 
	 }
	 
	 if(numPreguntasMarcadas == val.numPreguntasTotal){
	    textCompletado += "<div class='eventoGeneral'>" +
	                         "<form class='eventoGeneral'>";

	    listTotal.forEach(function(val,index){
	       textCompletado += ""+obtenerSubPanelModuloVersionDos(val);
	    });

	    textCompletado +=    "</form>" +
	    		      "</div>";
	    
	    numEvalInsGabIncApr++;
	 }else{
	    textPendiente += "<div class='eventoGeneral'>" +
	                        "<form class='eventoGeneral'>";

	    listTotal.forEach(function(val,index){
	       textPendiente += ""+obtenerSubPanelModuloVersionDos(val);
	    });

	    textPendiente +=    "</form>" +
		             "</div>";
	    
	    numEvalInsGabIncDes++;
	 }
      });
      
      $("#subRealizarInspecciones").find(".contenidoSubList").append(
         "<div id='estadoMovilSeleccionarGabineteIncendioInspeccion'>" +
            "<div class='tituloSubList'> Lista de gabinetes contra incendio " +
	       "<button style='font-size:19px' title='Seleccionar uno de los gabinetes contra " +
	               "incendio disponibles para realizar la evaluación respectiva.' " +
		       "class='btn btn-success' onclick='nuevoSeleccionarGabineteIncendioEvaluacion()'>"+
	          "<i class='fa fa-list'></i> Seleccionar" +
	       "</button>" +
	    "</div>" +
         "</div>");
      
      var listPanelesPrincipal=[];
      
      listPanelesPrincipal.push(
         {id:"infoMovilGabineteIncendioInspeccEvalPendiente",clase:"divSubEvento",styleAux:"", 
	  nombre:"Evaluación de gabinetes contra incendio pendientes ("+numEvalInsGabIncDes+")",
	  buttonAd:"",contenido:textPendiente},
	 {id:"infoMovilGabineteIncendioInspeccEvalCompletado",clase:"divSubEvento",styleAux:"display:none", 
	  nombre:"Evaluación de gabinetes contra incendio completados ("+numEvalInsGabIncApr+")",
	  buttonAd:"",contenido:textCompletado});
			
      agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);
      
      if(numEvalInsGabIncDes == 0 && numEvalInsGabIncApr > 0){
	 $(".divListPrincipal").append(
            "<div id='estadoMovilRegGabineteIncendioInspeccionFin'>" +
	       "<div class='tituloSubList'> Registrar gabinete contra incendio como finalizado " +
                  "<button style='font-size:19px' title='Registrar la inspección gabinete contra incendio como finalizada.' " +
		          "class='btn btn-success' onclick='verCompletarActividadVistaColaborador("+indexProgIns+")'>"+
	             "<i class='fa fa-check-square-o'></i> Marcar" +
	          "</button>" +
               "</div>" +
            "</div>");
      } 
      
      $(".detalle-seccionInspeccGabInc").hide();
      $(".listaFinalGestionGosst").hide(); 
      $(".contenidoFormVisible").hide();
   }else{ 
      alert("Ocurrió un error al cargar las preguntas de la inspección!");
   }
}

function verDetallesInspeccionGabineteIncendio(pindex){
   var gabineteIncendioId = listEvalInspeccGabinetesIncendio[pindex].id;
   $("#btnVerInspeccGabInc"+gabineteIncendioId).hide();
   $("#btnOcultarInspeccGabInc"+gabineteIncendioId).show();
 	
   $(".detalle-inspeccGabInc"+gabineteIncendioId).show();
}

function ocultarDetallesInspeccionGabineteIncendio(pindex){
   var gabineteIncendioId = listEvalInspeccGabinetesIncendio[pindex].id;

   $("#btnVerInspeccGabInc"+gabineteIncendioId).show();
   $("#btnOcultarInspeccGabInc"+gabineteIncendioId).hide();
    
   $(".detalle-inspeccGabInc"+gabineteIncendioId).hide();
}

function ocultarSeleccionarGabineteIncendioEvaluacion(){
   $("#modalSeleccionarGabineteIncendioEval").modal("hide");
}

var listGabinetesIncendioAux=[];

function nuevoSeleccionarGabineteIncendioEvaluacion(){
   evalInspeccGabineteIncendioObj = { 
      id: 0,
      gabineteIncendio: {id: 0}}; 
   
   editarSeleccionarGabineteIncendioEvaluacion();
}

function editarSeleccionarGabineteIncendioEvaluacion(){
   listGabinetesIncendioAux=[];
   
   listGabinetesIncendio.forEach(function(val1){
      var extintorRegistrado = 0;
      
      listEvalInspeccGabinetesIncendio.forEach(function(val2){
         if(val1.id == val2.gabineteIncendio.id){
            extintorRegistrado++;
         }
      });
      
      if(extintorRegistrado == 0 || val1.id == evalInspeccGabineteIncendioObj.gabineteIncendio.id){
	 listGabinetesIncendioAux.push(val1); 
      }
   }); 
  
   if(listGabinetesIncendioAux != 0){
      $("#modalSeleccionarGabineteIncendioEval").remove();
      auditoriaGabineteIncendioId = evalInspeccGabineteIncendioObj.id;
    
      var selGabineteIncendioInspeccionar = crearSelectOneMenu("selGabineteIncendioInspeccionar","informacionGabineteIncendioSeleccionado()",
	 listGabinetesIncendioAux,evalInspeccGabineteIncendioObj.gabineteIncendio.id,"id","codigo");
	    
      var listItemsRegistro=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-search'></i> Buscar gabinete contra incendio por código",
 	  inputForm:"<input class='form-control' id='inputBuscarGabineteIncendioInspecc'>",divContainer:""},
 	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Gabinete contra incendio seleccionado para la inspección",
          inputForm:selGabineteIncendioInspeccionar,divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",label:"<i class='fa fa-building-o'></i> Ubicación",anchoLabel:"",anchoDiv:"",
          inputForm:"<span id='ubicacionInfoGabInc' style='font-weight:bolder;'></span>"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<i class='fa fa-calendar'></i> Fecha vencimiento de mantenimiento:",
          inputForm:"<span id='fechaVencMantInfoGabInc' style='font-weight:bolder;'></span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",
          label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
 		        "onclick='ocultarSeleccionarGabineteIncendioEvaluacion()'>" +
     	           "<i class='fa fa-times'></i> Cancelar" +
     	        "</button>",
          inputForm:"<button type='submit' class='btn btn-success' " +
       		            "style='float:right;font-size:18px;'>" +
	               "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
	            "</button>"} 
      ]; 
	    
      var textFormRegistro = "";
	 	
      listItemsRegistro.forEach(function(val,index){
         textFormRegistro += obtenerSubPanelModuloVersionDos(val);
      });
	 
      var opciones={
         id: "modalSeleccionarGabineteIncendioEval",
         nombre: "<i class='fa fa-list'></i> Lista de gabinetes contra incendio",
         contenido: "<form id='formEditarSeleccionarGabineteIncendioEval' " +
      		          "class='eventoGeneral'>"+textFormRegistro+"</form>"
      };
	    
      crearModalPrincipalUsuario(opciones,function(){},true,true);
      
      informacionGabineteIncendioSeleccionado();
      
      if(evalInspeccGabineteIncendioObj.gabineteIncendio.id > 0){
	 $("#inputBuscarGabineteIncendioInspecc").val(evalInspeccGabineteIncendioObj.gabineteIncendio.codigo);
      }
      
      $("#inputBuscarGabineteIncendioInspecc").attr("onkeyup","buscarDisponibleGabineteIncendioInspecc()");
	   	
      var editarDiv = $("#formEditarSeleccionarGabineteIncendioEval");
	 
      editarDiv.on('submit',function(e){  
         e.preventDefault();
         guardarSeleccionarGabineteIncendioEvaluacion();
      });
   }else{
      mensajeUx="<label>Todos los gabinetes contra incendio han sido seleccionados " +
      		"para esta inspección.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

function buscarDisponibleGabineteIncendioInspecc(){
   var gabineteIncendioCodigoAux = $("#inputBuscarGabineteIncendioInspecc").val().toUpperCase().trim();
   var encontrado = 0;
 
   if(gabineteIncendioCodigoAux.length != 0){
      listGabinetesIncendioAux.forEach(function(val){
         if(val.codigo.toUpperCase().trim().includes(gabineteIncendioCodigoAux) && encontrado == 0){
	    $("#selGabineteIncendioInspeccionar").val(val.id);
	    encontrado++;
         }     
      }); 
   }
   
   if(encontrado == 0){
      $("#selGabineteIncendioInspeccionar").val(-1); 
   }
   
   informacionGabineteIncendioSeleccionado();
}

function informacionGabineteIncendioSeleccionado(){
   var gabineteIncendioId = parseInt($("#selGabineteIncendioInspeccionar").val());
    
   if(gabineteIncendioId != -1){
      listGabinetesIncendioAux.forEach(function(val){
	 if(val.id == gabineteIncendioId){
	    document.querySelector('#ubicacionInfoGabInc').innerText = val.ubicacion;   
	    document.getElementById('ubicacionInfoGabInc')
	       .style.color = "black";
	    
	    document.querySelector('#fechaVencMantInfoGabInc').innerText = val.fechaFinMantenimientoTexto;
	    document.getElementById('fechaVencMantInfoGabInc')
	       .style.color = (val.isVigenteFechaMantenimiento >= 0?"blue":"red");
         }
      });
   }else{
      document.querySelector('#ubicacionInfoGabInc').innerText = "------";
      document.getElementById('ubicacionInfoGabInc').style.color = "black";
      document.querySelector('#fechaVencMantInfoGabInc').innerText = "------";
      document.getElementById('fechaVencMantInfoGabInc').style.color = "black";
   } 
}

function guardarSeleccionarGabineteIncendioEvaluacion(){
   var campoVacio = true; 
    
   var gabineteIncendioId = parseInt($("#selGabineteIncendioInspeccionar").val());
    
   if(gabineteIncendioId == -1){
      campoVacio = false;
      mensajeUx = "<label>Debe seleccionar el gabinete contra incendio a inspeccionar.</label>";
   }
    
   if(campoVacio){
      var dataParam={
	 id: auditoriaGabineteIncendioId,
 	 auditoria: {auditoriaId: inspeccionEvento.idAux},
 	 gabineteIncendio: {id: gabineteIncendioId},
 	 trabajadorId: parseInt(getSession("trabajadorGosstId"))
      }; 
        
      callAjaxPost(URL+'/auditoria/auditoria_gabinete_incendio/save',dataParam,function(data){
	 $("#modalSeleccionarGabineteIncendioEval").remove();
	 
	 if(auditoriaGabineteIncendioId == 0){ 
	    mensajeUx="<label>El gabinete contra incendio se asoció a la inspección con éxito.<br><br>" +
	 	      "Empezará el despliegue de las preguntas para la evaluación.</label>";
	 }else{
	    mensajeUx="<label>El registro del gabinete contra incendio se actualizó con éxito.</label>"; 
	 }
	 
	 mensajesUx(mensajeUx,1,"","ActualizarVistaSelGabIncEva");
	       
	 $("#modalMensajeUxActualizarVistaSelGabIncEva").on("hidden.bs.modal",function(){ 
	    if(auditoriaGabineteIncendioId == 0){ 
	       evalInspeccGabineteIncendioObj.id = data.nuevoId;
	       
	       realizarEvaluacionInspeccionGabineteIncendio();
	    }else{
	       realizarInspeccionMovil(idEvento);
	    }
	 });
      });
   }else{
      $("#modalSeleccionarGabineteIncendioEval").modal("hide");
       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposSelGabIncEva");

      $("#modalMensajeUxAvisoCompletarCamposSelGabIncEva").on("hidden.bs.modal",function(){
	 $("#modalSeleccionarGabineteIncendioEval").modal("show");
      });
   }   
}

function eliminarSeleccionarGabineteIncendioEvaluacion(){
   mensajeUx="<label>¿Está seguro de eliminar este registro de gabinete contra incendio " +
    	     "(código: "+evalInspeccGabineteIncendioObj.gabineteIncendio.codigo+") seleccionado?" +
    	     "<br>(también se eliminará la evaluación relacionada al mismo).</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarSeleccionarGabIncEval");

   $("#btnDevolverValorRespEliminarSeleccionarGabIncEval").on("click",function(){
      var dataParam={
 	 id: evalInspeccGabineteIncendioObj.id
      };

      callAjaxPost(URL+'/auditoria/auditoria_gabinete_incendio/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":
 	       mensajeUx="<label>El registro del gabinete contra incendio se ha eliminado " +
 	       		 "correctamente.</label>";
 	       mensajesUx(mensajeUx,1,"");
 		
 	       realizarInspeccionMovil(idEvento);
 	       break;
 		
 	    default:
 	       mensajeUx="<label>Error al eliminar el registro.</label>";
 	       mensajesUx(mensajeUx,2,"");	
         }
      });
   });
}

var listFullEvaluacionesInspeccionGabInc=[];

function realizarEvaluacionInspeccionGabineteIncendio(){
   var dataParam={
      id: evalInspeccGabineteIncendioObj.id,
      tipoAuditoriaId: inspeccionEvento.linkAuxiliarId2
   };
   
   callAjaxPost(URL+'/auditoria/verificaciones/version_dos/auditoria_gabinete_incendio/evaluacion',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listFullEvaluacionesInspeccionGabInc = data.listEvaluacionesGabinetesIncendio;
              
            $("#infoMovilGabineteIncendioInspeccEvalPendiente").remove();
            $("#infoMovilGabineteIncendioInspeccEvalCompletado").remove();
            $("#estadoMovilRegGabineteIncendioInspeccionFin").remove();
            $("#subRealizarInspecciones").find(".contenidoSubList").html("");
   
            $("#subRealizarInspecciones").find(".tituloSubList").html(
               textoBotonVolverContenidoColaborador+" "+inspeccionEvento.text);
	
            listFullEvaluacionesInspeccionGabInc.forEach(function(val,index){ 
               $("#subRealizarInspecciones").find(".contenidoSubList")
                  .append(crearDivEvalInspeccionGabineteIncendioVersionDos(val,index));
       
               var options={
 	          container: "#tdEviPregGabInc"+val.verificacionId,
 	          functionCall: function(){},
 	          descargaUrl: (val.respuestaSimple == 1?"":
 	             "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/evidencia?" +
 	             "detalleAuditoriaGabineteIncendioId="+val.detalleAuditoriaGabineteIncendioId),
 	          esNuevo: (val.respuestaSimple == 1 || val.evidenciaNombre == ""?true:false),
 	          idAux: "PregInspeccGabInc"+val.verificacionId,
 	          evidenciaNombre: (val.respuestaSimple == 1 || val.evidenciaNombre == ""?
 		                    "":val.evidenciaNombre)
               }; 
       
               crearFormEvidenciaCompleta(options);
               
               var optionsMedCor={
           	  container: "#tdEviMedCorGabInc"+val.verificacionId,
           	  functionCall: function(){
           	     estadoAccionCorrectivaInspeccGabInc(val.verificacionId);
           	  },
           	  descargaUrl: (val.respuestaSimple == 1?"":
           	     "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/accion_correctiva/evidencia?" +
           	     "detalleAuditoriaGabineteIncendioId="+val.detalleAuditoriaGabineteIncendioId),
           	  esNuevo: (val.respuestaSimple == 1 || val.evidenciaAccCorNombre == ""?true:false),
           	  idAux: "MedCorInspeccGabInc"+val.verificacionId,
           	  evidenciaNombre: (val.respuestaSimple == 1 || val.evidenciaAccCorNombre == ""?
           		            "":val.evidenciaAccCorNombre),
                  mensajeAux: "*Al subir la evidencia, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
               }; 
                 
               crearFormEvidenciaCompleta(optionsMedCor);
 	 
               $("#textObsAudiGabIncMovil"+val.verificacionId).val(val.comentario);
 	 
               habilitarCamposPreguntaInspeccionGabineteIncendioMovil(val.respuestaSimple,val.verificacionId);
               
               if(val.respuestaSimple == 0){
      	          $("#textDescAudiGabIncMedCorMovil"+val.verificacionId).val(val.accionCorrectiva); 
      	  
      	          var valFechaPlanificada = convertirFechaInput(val.fechaPlanificacion);
      	          $("#inputFechaPlanAudiGabIncMedCorMovil"+val.verificacionId).val(valFechaPlanificada);
      	        
      	          $("#inputBuscarResponsableGabIncMedCorrMovil"+val.verificacionId).val(val.responsable);
      	          buscarResponsableAccionCorrectivaInspeccGabInc(val.verificacionId);
      	       }
       
               if(val.respuestaSimple == 1 || (val.respuestaSimple == 0 && val.evidenciaAccCorNombre.length != 0)){
                  $("#pregInsGabIncMovil"+index+">div").hide();
               }
               
               $("#pregInsGabIncMovil"+index+" .divNombrePregunta").show();
            });
    
            $("#subRealizarInspecciones").find(".contenidoSubList").append(
               "<div class='divInformacionCurso' style='padding:20px;'>" +
                  "<button type='button' class='btn btn-danger' style='font-size:18px;' " +
	                  "onclick='realizarInspeccionMovil("+idEvento+")'>" +
	             "<i class='fa fa-times'></i> Cancelar" +
  	          "</button>" +
  	          "<button type='button' class='btn btn-success' style='float:right;font-size:18px;' " +
                          "onclick='guardarEvaluacionInspeccionGabineteIncendio()'>" +
                     "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
                  "</button>" +
               "</div>");
            
//            if(lastHeightInspeccion != 0){
//               $(window).scrollTop(lastHeightInspeccion-$("#barraMenu").height()-60);
//               lastHeightInspeccion = 0;
//            }
            
            break;
    
         default:
  	    alert("nop");
  	    break;
      }
   });
}

function crearDivEvalInspeccionGabineteIncendioVersionDos(contenidoVal,contenidoIndex){
   var textoBotonToggleReportar =
      "<button class='btn btn-danger' onclick='cambiarDivSubPreguntaInspeccGabInc(this,"+contenidoVal.verificacionId+")'>" +
         "<i class='fa fa-bullhorn fa-3x' aria-hidden='true'></i>" +
      "</button>";
    
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
      return val2.id - val.id;
   });
      
   var radiosPregInsMovil = crearRadiosAutoVersionDos("radioPreguntaInsGabIncMovil"+contenidoVal.verificacionId,
      listBooleanSiNo,contenidoVal.respuestaSimple,"id","nombre","habilitarCamposPreguntaInspeccionGabineteIncendioMovil",
      contenidoVal.verificacionId);
     
   return "<div class='divInformacionCurso' id='pregInsGabIncMovil"+contenidoIndex+"'>" +
 	     "<div class='divNombrePregunta'>"+textoBotonToggleReportar +
 		 (contenidoIndex+1)+". &nbsp;"+contenidoVal.verificacion +" " +
                  "<span id='estadoRespPregEvalInspeccGabInc"+contenidoVal.verificacionId+"' " +
                        "style='font-weight:bolder;'></span>" +
 	     "</div>" +
 	     "<div class='divOpcionesGosst form-group' style='padding:20px;margin:0px 0px -10px 20px;'>" +
 	         radiosPregInsMovil +
 	        "<strong>Observación:</strong>" +
 	        "<span id='auxInfoTextObsAudiGabIncMovil"+contenidoVal.verificacionId+"' " +
 	              "style='float:right;color:red;font-weight:bold;'></span>" +
 	        "<textarea rows='4' class='form-control' id='textObsAudiGabIncMovil"+contenidoVal.verificacionId+"'></textarea>" +
 	        "<br><strong>Evidencia:</strong>" +
 	        "<span id='auxInfoTextEviPregGabInc"+contenidoVal.verificacionId+"' " +
 	              "style='float:right;color:blue;font-weight:bold;'></span>" +
 	        "<span id='tdEviPregGabInc"+contenidoVal.verificacionId+"'></span>" +
             "</div>" +
             "<div class='general-inspeccGabIncMedCor inspeccGabIncMedCor"+contenidoVal.verificacionId+"' " +
   	          "style='border-top:2px solid black;margin:10px 0px 20px 0px;'></div>" +
   	     "<div class='general-inspeccGabIncMedCor inspeccGabIncMedCor"+contenidoVal.verificacionId+" eventoGeneral' style='margin:10px;'>" +     
                "<div class='general-inspeccGabIncMedCor inspeccGabIncMedCor"+contenidoVal.verificacionId+"'>" +
                   "<label style='font-size:"+(isMobile.any()?"14px":"18px")+";'>*** MEDIDA CORRECTIVA ***</label>" +
                   "<div style='border-top:2px solid black;margin:5px -10px 10px -10px;'></div>" +
                   "<strong>Descripción:</strong>" +
                   "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
                   "<textarea rows='4' class='form-control' id='textDescAudiGabIncMedCorMovil"+contenidoVal.verificacionId+"'></textarea>" +
                   "<br><strong>Fecha planificada:</strong>" +
                   "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
                   "<input type='date' id='inputFechaPlanAudiGabIncMedCorMovil"+contenidoVal.verificacionId+"' class='form-control'>" +
                   "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
                   "<strong>Responsable de la medida correctiva:</strong>" +
                   "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
                   "<input class='form-control' id='inputBuscarResponsableGabIncMedCorrMovil"+contenidoVal.verificacionId+"'>" +
                   "<div id='divSelResponsableGabIncMedCorrMovil"+contenidoVal.verificacionId+"'></div>" +
                   "<small>*Buscar responsable por DNI y/o nombres/apellidos (debe ingresar 3 caracteres como mínimo).</small>" +
                   "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
                   "<strong>Evidencia - Medida correctiva*:</strong>" +
                   "<span id='tdEviMedCorGabInc"+contenidoVal.verificacionId+"'>(obligatorio)</span>" +
                   "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
                   "<strong style='font-size:"+(isMobile.any()?"15px":"18px")+"'>Estado:</strong> " +
                   "<span id='auxInfoEstadoAudiGabIncMedCorMovil"+contenidoVal.verificacionId+"' " +
	                 "style='color:red;font-weight:bold;font-size:"+(isMobile.any()?"15px":"18px")+"'></span>" +
                "</div>" +
             "</div>" +
 	  "</div>";
}

function habilitarCamposPreguntaInspeccionGabineteIncendioMovil(valResp,auxId){
   var valRespVisita = valResp;
   var auxIdVal = auxId;
     
   if(valRespVisita == 0){
      document.getElementById("textObsAudiGabIncMovil"+auxIdVal).disabled = false; 
      document.querySelector('#auxInfoTextObsAudiGabIncMovil'+auxIdVal).innerText = "(obligatorio)";
        
      document.getElementById("fileEviPregInspeccGabInc"+auxIdVal).disabled = false;
      document.querySelector('#auxInfoTextEviPregGabInc'+auxIdVal).innerText = "(opcional)";
       
      document.querySelector('#estadoRespPregEvalInspeccGabInc'+auxIdVal).innerText = "(con observación)";   
      document.getElementById('estadoRespPregEvalInspeccGabInc'+auxIdVal).style.color = "red";
      
      $(".inspeccGabIncMedCor"+auxId).show();
      
      $("#inputBuscarResponsableGabIncMedCorrMovil"+auxId).val("");
      
      buscarResponsableAccionCorrectivaInspeccGabInc(auxId);
   }else{
      document.getElementById("textObsAudiGabIncMovil"+auxIdVal).disabled = true;
      document.getElementById("textObsAudiGabIncMovil"+auxIdVal).value = null;
      document.querySelector('#auxInfoTextObsAudiGabIncMovil'+auxIdVal).innerText = "";
        
      document.getElementById("fileEviPregInspeccGabInc"+auxIdVal).disabled = true;
      document.getElementById("fileEviPregInspeccGabInc"+auxIdVal).value = null;
      document.getElementById("inputEviPregInspeccGabInc"+auxIdVal).value = null;
      document.querySelector('#auxInfoTextEviPregGabInc'+auxIdVal).innerText = "";
       
      document.querySelector('#estadoRespPregEvalInspeccGabInc'+auxIdVal).innerText = "(sin observación)";   
      document.getElementById('estadoRespPregEvalInspeccGabInc'+auxIdVal).style.color = "blue";
      
      $(".inspeccGabIncMedCor"+auxId).hide();
      
      document.getElementById("textDescAudiGabIncMedCorMovil"+auxId).value = null;
      
      document.getElementById("inputFechaPlanAudiGabIncMedCorMovil"+auxId).value = null;
      
      document.getElementById("fileEviMedCorInspeccGabInc"+auxId).value = null;
      document.getElementById("inputEviMedCorInspeccGabInc"+auxId).value = null;
   }
   
   estadoAccionCorrectivaInspeccGabInc(auxId);
}

function estadoAccionCorrectivaInspeccGabInc(auxId){
   var nombreAccCorEvidencia = $("#inputEviMedCorInspeccGabInc"+auxId).val();
     
   if(nombreAccCorEvidencia.length == 0){
      document.querySelector('#auxInfoEstadoAudiGabIncMedCorMovil'+auxId).innerText = "Pendiente";   
      document.getElementById('auxInfoEstadoAudiGabIncMedCorMovil'+auxId).style.color = "#D1D619";
   }else{
      document.querySelector('#auxInfoEstadoAudiGabIncMedCorMovil'+auxId).innerText = "Completado";   
      document.getElementById('auxInfoEstadoAudiGabIncMedCorMovil'+auxId).style.color = "blue";
   }
}

var listResponsablesAccCorInsGabInc=[];

function buscarResponsableAccionCorrectivaInspeccGabInc(auxId){
   var nombre = $("#inputBuscarResponsableGabIncMedCorrMovil"+auxId).val().trim();
  	
   if(nombre.length >= 3){
      var dataParam={
         trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid"))
      };
  		
      callAjaxPostNoLoad(URL+"/auditoria/responsable/accion_correctiva",dataParam,function(data){
 	 listResponsablesAccCorInsGabInc = data.listResponsablesAccCorIns;
         
         if(listResponsablesAccCorInsGabInc.length == 0){
            listResponsablesAccCorInsGabInc.push({
               trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
  	    });
         }
  			
         var selResponsableAccCorInsGabInc = crearSelectOneMenuOblig("selResponsableAccCorInsGabInc"+auxId,
            "",listResponsablesAccCorInsGabInc,"","trabajadorId","nombre");
  	       
         $("#divSelResponsableGabIncMedCorrMovil"+auxId).html(selResponsableAccCorInsGabInc);
         $("#inputBuscarResponsableGabIncMedCorrMovil"+auxId)
            .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccGabInc("+auxId+")");
      });
   }else{
      listResponsablesAccCorInsGabInc = [];
        
      listResponsablesAccCorInsGabInc.push({
         trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
      });
         
      var selResponsableAccCorInsGabInc = crearSelectOneMenuOblig("selResponsableAccCorInsGabInc"+auxId,
 	 "",listResponsablesAccCorInsGabInc,"","trabajadorId","nombre");
  		       
      $("#divSelResponsableGabIncMedCorrMovil"+auxId).html(selResponsableAccCorInsGabInc);
      $("#inputBuscarResponsableGabIncMedCorrMovil"+auxId)
         .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccGabInc("+auxId+")");
   }
}

var indiceActualEvaIndGabInc;

function guardarEvaluacionInspeccionGabineteIncendio(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'}); 
   
   var campoVacio = true; 
   
   var bitRespuesta,observacion,medidaCorrectiva,inputFechaPlanificada,nombrePregunta;
    
   listFullEvaluacionesInspeccionGabInc.forEach(function(val,index){
      bitRespuesta = parseInt($("input[name='radioPreguntaInsGabIncMovil"+val.verificacionId+"']:checked").val());
      observacion = $("#textObsAudiGabIncMovil"+val.verificacionId).val();
      
      if(bitRespuesta == 0 && campoVacio){
	 nombrePregunta = val.verificacion;
	 observacion = $("#textObsAudiGabIncMovil"+val.verificacionId).val();
	 medidaCorrectiva = $("#textDescAudiGabIncMedCorMovil"+val.verificacionId).val();
	 
	 var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiGabIncMedCorMovil"+val.verificacionId).val());
	 inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
	 
	 var nombreEvidenciaMedCor = $("#inputEviMedCorInspeccGabInc"+val.verificacionId).val();
	 
	 var responsableId = parseInt($("#selResponsableAccCorInsGabInc"+val.verificacionId).val());
	 
	 if(observacion.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la observación - "+nombrePregunta+".</label>";
	    
	    document.getElementById("textObsAudiGabIncMovil"+val.verificacionId).focus();
	 }else if(medidaCorrectiva.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la descripción de la medida correctiva - " +
	    		 nombrePregunta+".</label>";  
	    
	    document.getElementById("textDescAudiGabIncMedCorMovil"+val.verificacionId).focus();
	 }else if(inputFechaPlanificada == null && nombreEvidenciaMedCor.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la fecha planificada o subir la evidencia de la " +
 	                "medida correctiva - "+nombrePregunta+".</label>"; 
	    
	    document.getElementById("inputFechaPlanAudiGabIncMedCorMovil"+val.verificacionId).focus();
	 }else if(responsableId == -1){
	    campoVacio = false;
            mensajeUx = "<label>Debe seleccionar al responsable de la medida correctiva - " +
		         nombrePregunta+".</label>";  
            
            document.getElementById("inputBuscarResponsableGabIncMedCorrMovil"+val.verificacionId).focus();
	 }
      }  
   });
   
   if(campoVacio){
      indiceActualEvaIndGabInc = 1;
      guardarRespuestaInspeccionGabineteIncendio(indiceActualEvaIndGabInc,guardarRespuestaInspeccionGabineteIncendio);
   }else{
      $.unblockUI();
      mensajesUx(mensajeUx,2,"");
   }
}

function guardarRespuestaInspeccionGabineteIncendio(indiceActual,functionCallBack){
   var respuesta,respAux,observacion,validacionId,medidaCorrectiva,inputFechaPlanificada,
       responsableId;
   var dataParam;
    
   listFullEvaluacionesInspeccionGabInc.forEach(function(val,index){
      if((index + 1) == indiceActualEvaIndGabInc){
         respuesta = parseFloat($("input[name='radioPreguntaInsGabIncMovil"+val.verificacionId+"']:checked").val());
         respAux = parseInt($("input[name='radioPreguntaInsGabIncMovil"+val.verificacionId+"']:checked").val());
         observacion = $("#textObsAudiGabIncMovil"+val.verificacionId).val();
         validacionId = val.verificacionId;
       //var nombreEvi = $("#inputEviPregInspeccGabInc"+val.verificacionId).val();
         if(respAux == 0){
            medidaCorrectiva = $("#textDescAudiGabIncMedCorMovil"+val.verificacionId).val();
            responsableId = parseInt($("#selResponsableAccCorInsGabInc"+val.verificacionId).val());
              
            var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiGabIncMedCorMovil"+val.verificacionId).val());
     	    inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
         }else{
            medidaCorrectiva = null;inputFechaPlanificada = null;responsableId = null;
         }
         
         dataParam={
            detalleAuditoriaGabineteIncendioId: val.detalleAuditoriaGabineteIncendioId,
            auditoriaGabineteIncendioId: evalInspeccGabineteIncendioObj.id, 
            verificacionId: val.verificacionId,
            respuestaSimple: respuesta,
            comentario: observacion,
            trabajadorId: parseInt(getSession("trabajadorGosstId")),
            accionCorrectiva: medidaCorrectiva,
            fechaPlanificacion: inputFechaPlanificada,
            responsableId: responsableId
         };
      }
   });  
   
   callAjaxPostSimple(URL+'/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/save',dataParam,0,function(data){
      guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviPregInspeccGabInc"+validacionId,bitsEvidenciaVerificacion,
      "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/evidencia/save",function(){
	 guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviMedCorInspeccGabInc"+validacionId,bitsEvidenciaVerificacion,
	 "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/accion_correctiva/evidencia/save",function(){
            if(indiceActualEvaIndGabInc == listFullEvaluacionesInspeccionGabInc.length){
               $.unblockUI();
	       mensajeUx = "<label>Inspección guardada con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","EvaluacionCompletadaInsGabInc");
					
	       $("#modalMensajeUxEvaluacionCompletadaInsGabInc").on("hidden.bs.modal",function(){
	          realizarInspeccionMovil(idEvento);   
	       });
            }else{
	       indiceActualEvaIndGabInc++;
	       functionCallBack(indiceActualEvaIndGabInc,guardarRespuestaInspeccionGabineteIncendio);
            }
	 },"detalleAuditoriaGabineteIncendioId");
      },"detalleAuditoriaGabineteIncendioId");
   });
}

function cambiarDivSubPreguntaInspeccGabInc(obj,verificacionId){
   $(obj).parent(".divNombrePregunta").siblings(".divOpcionesGosst").toggle();
     
   var respuesta = parseInt($("input[name='radioPreguntaInsGabIncMovil"+verificacionId+"']:checked").val());
     
   if(respuesta == 0){
      $(obj).parent(".divNombrePregunta").siblings(".general-inspeccGabIncMedCor").toggle();
   }
}
