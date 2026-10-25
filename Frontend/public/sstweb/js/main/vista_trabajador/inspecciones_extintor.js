
var listExtintores=[],listEvalInspeccExtintores=[];
var auditoriaExtintorId;
var evalInspeccExtintorObj = {};
var indexEvalInspeccExtintor;
var mensajeUx;

function toggleMenuOpcionEvalInspeccExtintores(obj,pindex){
   evalInspeccExtintorObj = listEvalInspeccExtintores[pindex]; 
   indexEvalInspeccExtintor = pindex;
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesEvalInspeccExtintores=[
   {id:"opcEvaluar",nombre:"<i class='fa fa-list-alt'></i> Evaluar ",
    functionClick:function(data){realizarEvaluacionInspeccionExtintor()}},
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
    functionClick:function(data){editarSeleccionarExtintorEvaluacion()}},
   {id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar ",
    functionClick:function(data){eliminarSeleccionarExtintorEvaluacion()}}
];

function marcarSubOpcionEvalInspeccExtintores(pindex){
   funcionalidadesEvalInspeccExtintores[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function procesarListaInspeccionMovilExtintor(data){
   if(data.CODE_RESPONSE == "05"){
      $.unblockUI();window.scrollTo({top: 0,behavior: 'smooth'});
      $("#subRealizarInspecciones").find(".contenidoSubList").html("");
      
      auditoriaObjMovil = data.auditoriaAux[0];
      listExtintores = data.listExtintores;
      listEvalInspeccExtintores = data.listEvalInspeccExtintores;
      valTipoId = 2;
      
      $("#subRealizarInspecciones").find(".tituloSubList").html(
 	 textoBotonVolverContenidoColaborador+" "+inspeccionEvento.text);
      
      $("#infoMovilExtintorInspeccEvalPendiente").remove();
      $("#infoMovilExtintorInspeccEvalCompletado").remove();
      $("#estadoMovilRegExtintorInspeccionFin").remove();
      
      var textPendiente="",textCompletado="";
      var numEvalInsExtApr=0,numEvalInsExtDes=0;
       
      listEvalInspeccExtintores.forEach(function(val,index){
	 var menuOpcion = "",btnOpcion = "",numPreguntasMarcadas=0,
	     isVigenteFecRec="",isVigenciaFecMan="",isVigenciaFecHid="";
	 
	 menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
	    funcionalidadesEvalInspeccExtintores.forEach(function(val1,index1){
               menuOpcion += 
	          "<li class='list-group-item' " +
		      "onclick='marcarSubOpcionEvalInspeccExtintores("+index1+")'>" +
		      val1.nombre +
		  "</li>";
	    });
	 menuOpcion+="</ul>";
			
	 btnOpcion = 
	    "<a class='btn-gestion efectoLink' " +
	       "onclick='toggleMenuOpcionEvalInspeccExtintores(this,"+index+")'>" +
	       "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
	    "</a>" ;
	 
	 var btnOpcionAux1 = 
            "<a id='btnVerInspeccExt"+val.id+"' class='btn-gestion efectoLink' " +
	       "onclick='verDetallesInspeccionExtintor("+index+")'>" +
	       "<i class='fa fa-eye' aria-hidden='true'></i> Ver Detalles" +
	    "</a>";

	 var btnOpcionAux2 = 
	    "<a id='btnOcultarInspeccExt"+val.id+"' style='display:none' class='btn-gestion efectoLink' " +
	       "onclick='ocultarDetallesInspeccionExtintor("+index+")'>" +
	       "<i class='fa fa-eye-slash' aria-hidden='true'></i> Ocultar Detalles" +
	    "</a>";
	 
	 numPreguntasMarcadas = val.numRespuestasMarcadasSi + val.numRespuestasMarcadasNo;
	 isVigenteFecRec = (val.extintor.isVigenteFechaRecarga >= 0?"blue;":"red;");
	 isVigenciaFecMan = (val.extintor.isVigenteFechaMantenimiento >= 0?"blue;":"red;");
	 isVigenciaFecHid = (val.extintor.isVigenteFechaHidrostatica >= 0?"blue;":"red;");

	 var listTotal=[
	    {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
	     label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
	 	      "*** Datos del extintor asociado***" +
	 	   "</span>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
	     label:"<i class='fa fa-barcode'></i> Código:",inputForm:val.extintor.codigo+btnOpcionAux1+btnOpcionAux2},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
	     label:"<i class='fa fa-building'></i> Ubicación:",inputForm:val.extintor.ubicacion},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
	     label:"<i class='fa fa-calendar'></i> Fecha vencimiento de la recarga:",
	     inputForm:"<label style='color:"+isVigenteFecRec+"'>"+val.extintor.fechaFinRecargaTexto+"</label>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
             label:"<i class='fa fa-calendar'></i> Fecha vencimiento de mantenimiento:",
             inputForm:"<label style='color:"+isVigenciaFecMan+"'>"+val.extintor.fechaFinMantenimientoTexto+"</label>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
	     label:"<i class='fa fa-calendar'></i> Fecha vencimiento de prueba hidrostática:",
	     inputForm:"<label style='color:"+isVigenciaFecHid+"'>"+val.extintor.fechaFinPruebaHidrostaticaTexto+"</label>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
             label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
	     label:"<i class='fa fa-calendar'></i> Registrado el",
	     inputForm:val.fechaCreacionTexto+" (por "+val.registradoPor+")"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
             label:"",inputForm:""},
	    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
             clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,inputForm:"",
             label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
		      "*** Estado de la evaluación ***" +
		   "</span>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
             label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
             label:"<i class='fa fa-info-circle'></i> N° de preguntas con observaciones:",inputForm:val.numRespuestasMarcadasSi},
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
	     label:"<i class='fa fa-info-circle'></i> N° de preguntas sin observación:",inputForm:val.numRespuestasMarcadasNo},
	    {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
	     label:"<i class='fa fa-info-circle'></i> N° total de preguntas:",inputForm:numPreguntasMarcadas+" / "+val.numPreguntasTotal},
	 ]; 
	 
	 if(val.numRespuestasMarcadasSi > 0){
	    listTotal.push(
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
	        label:"",inputForm:""},
	       {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
	 	clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,inputForm:"",
	 	label:"<span style='color:blue;font-size:"+(isMobile.any()?"14px":"18px")+";font-weight:bolder;'>" +
	 	         "*** Estado de la(s) medida(s) correctiva(s) ***" +
	 	      "</span>"},
	       {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccExt detalle-inspeccExt"+val.id,
	 	label:"<i class='fa fa-info-circle'></i> N° de medidas correctivas oompletadas:",
	 	inputForm:val.numAccCorCompletadas+" / "+val.numRespuestasMarcadasSi}); 
	 }
	 
	 if(numPreguntasMarcadas == val.numPreguntasTotal){
	    textCompletado += "<div class='eventoGeneral'>" +
	                         "<form class='eventoGeneral'>";

	    listTotal.forEach(function(val,index){
	       textCompletado += ""+obtenerSubPanelModuloVersionDos(val);
	    });

	    textCompletado +=    "</form>" +
	    		      "</div>";
	    
	    numEvalInsExtApr++;
	 }else{
	    textPendiente += "<div class='eventoGeneral'>" +
	                        "<form class='eventoGeneral'>";

	    listTotal.forEach(function(val,index){
	       textPendiente += ""+obtenerSubPanelModuloVersionDos(val);
	    });

	    textPendiente +=    "</form>" +
		             "</div>";
	    
	    numEvalInsExtDes++;
	 }
      });
      
      $("#subRealizarInspecciones").find(".contenidoSubList").append(
         "<div id='estadoMovilSeleccionarExtintorInspeccion'>" +
            "<div class='tituloSubList'> Lista de extintores " +
	       "<button style='font-size:19px' title='Seleccionar uno de los extintores disponibles " +
		       "para realizar la evaluación respectiva.' " +
		       "class='btn btn-success' onclick='nuevoSeleccionarExtintorEvaluacion()'>"+
	          "<i class='fa fa-list'></i> Seleccionar" +
	       "</button>" +
	    "</div>" +
         "</div>");
      
      var listPanelesPrincipal=[];
      
      listPanelesPrincipal.push(
         {id:"infoMovilExtintorInspeccEvalPendiente",clase:"divSubEvento",styleAux:"", 
	  nombre:"Evaluación de extintores pendientes ("+numEvalInsExtDes+")",
	  buttonAd:"",contenido:textPendiente},
	 {id:"infoMovilExtintorInspeccEvalCompletado",clase:"divSubEvento",styleAux:"display:none", 
	  nombre:"Evaluación de extintores completados ("+numEvalInsExtApr+")",
	  buttonAd:"",contenido:textCompletado});
			
      agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);
      
      if(numEvalInsExtDes == 0 && numEvalInsExtApr > 0){
	 $(".divListPrincipal").append(
            "<div id='estadoMovilRegExtintorInspeccionFin'>" +
	       "<div class='tituloSubList'> Registrar inspección extintor como finalizado " +
                  "<button style='font-size:19px' title='Registrar la inspección extintor como finalizada.' " +
		          "class='btn btn-success' onclick='verCompletarActividadVistaColaborador("+indexProgIns+")'>"+
	             "<i class='fa fa-check-square-o'></i> Marcar" +
	          "</button>" +
               "</div>" +
            "</div>");
      } 
      
      $(".detalle-seccionInspeccExt").hide();
      $(".listaFinalGestionGosst").hide(); 
      $(".contenidoFormVisible").hide();
   }else{ 
      alert("Ocurrió un error al cargar las preguntas de la inspección!");
   }
}

function verDetallesInspeccionExtintor(pindex){
   var extintorId = listEvalInspeccExtintores[pindex].id;
   $("#btnVerInspeccExt"+extintorId).hide();
   $("#btnOcultarInspeccExt"+extintorId).show();
  	
   $(".detalle-inspeccExt"+extintorId).show();
}

function ocultarDetallesInspeccionExtintor(pindex){
   var extintorId = listEvalInspeccExtintores[pindex].id;

   $("#btnVerInspeccExt"+extintorId).show();
   $("#btnOcultarInspeccExt"+extintorId).hide();
     
   $(".detalle-inspeccExt"+extintorId).hide();
}

function ocultarSeleccionarExtintorEvaluacion(){
   $("#modalSeleccionarExtintorEval").modal("hide");
}

var listExtintoresAux=[];

function nuevoSeleccionarExtintorEvaluacion(){
   evalInspeccExtintorObj = { 
      id: 0,
      extintor: {id: 0}}; 
   
   editarSeleccionarExtintorEvaluacion();
}

function editarSeleccionarExtintorEvaluacion(){
   listExtintoresAux=[];
   
   listExtintores.forEach(function(val1){
      var extintorRegistrado = 0;
      
      listEvalInspeccExtintores.forEach(function(val2){
         if(val1.id == val2.extintor.id){
            extintorRegistrado++;
         }
      });
      
      if(extintorRegistrado == 0 || val1.id == evalInspeccExtintorObj.extintor.id){
	 listExtintoresAux.push(val1); 
      }
   }); 
  
   if(listExtintoresAux != 0){
      $("#modalSeleccionarExtintorEval").remove();
      auditoriaExtintorId = evalInspeccExtintorObj.id;
    
      var selExtintorInspeccionar = crearSelectOneMenu("selExtintorInspeccionar",
         "informacionExtintorSeleccionado()",listExtintoresAux,evalInspeccExtintorObj.extintor.id,"id","codigo");
	    
      var listItemsRegistro=[
//         {sugerencia:"",label:"Extintor",
//          inputForm:selExtintorInspeccionar,divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-search'></i> Buscar extintor por código",
 	  inputForm:"<input class='form-control' id='inputBuscarExtintorInspecc'>",divContainer:""},
 	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Extintor seleccionado para la inspección",
          inputForm:selExtintorInspeccionar,divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",label:"<i class='fa fa-building-o'></i> Ubicación",anchoLabel:"",anchoDiv:"",
          inputForm:"<span id='ubicacionInfo' style='font-weight:bolder;'></span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<i class='fa fa-calendar'></i> Fecha vencimiento de la recarga:",
	  inputForm:"<span id='fechaVencRecargaInfo' style='font-weight:bolder;'></span>"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<i class='fa fa-calendar'></i> Fecha vencimiento de mantenimiento:",
          inputForm:"<span id='fechaVencMantInfo' style='font-weight:bolder;'></span>"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<i class='fa fa-calendar'></i> Fecha vencimiento de prueba hidrostática:",
	  inputForm:"<span id='fechaVencHidroInfo' style='font-weight:bolder;'></span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",
          label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
 		        "onclick='ocultarSeleccionarExtintorEvaluacion()'>" +
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
         id:"modalSeleccionarExtintorEval",
         nombre:"<i class='fa fa-list'></i> Lista de extintores",
         contenido:"<form id='formEditarSeleccionarExtintorEval' " +
      		         "class='eventoGeneral'>"+textFormRegistro+"</form>"
      };
	    
      crearModalPrincipalUsuario(opciones,function(){},true,true);
      
      informacionExtintorSeleccionado();
      
      if(evalInspeccExtintorObj.extintor.id > 0){
//	 $("#textUbicacionExtAudiMovil").val(evalInspeccExtintorObj.ubicacion);
	 $("#inputBuscarExtintorInspecc").val(evalInspeccExtintorObj.extintor.codigo);
      }
      
      $("#inputBuscarExtintorInspecc").attr("onkeyup","buscarDisponibleExtintorInspecc()");
	   	
      var editarDiv = $("#formEditarSeleccionarExtintorEval");
	 
      editarDiv.on('submit',function(e){  
         e.preventDefault();
         guardarSeleccionarExtintorEvaluacion();
      });
   }else{
      mensajeUx="<label>Todos los extintores han sido seleccionados para " +
      		"esta inspección.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

function buscarDisponibleExtintorInspecc(){
   var extintorCodigoAux = $("#inputBuscarExtintorInspecc").val().toUpperCase().trim();
   var encontrado = 0;
 
   if(extintorCodigoAux.length != 0){
      listExtintoresAux.forEach(function(val){
         if(val.codigo.toUpperCase().trim().includes(extintorCodigoAux) && encontrado == 0){
	    $("#selExtintorInspeccionar").val(val.id);
	    encontrado++;
         }     
      }); 
   }
   
   if(encontrado == 0){
      $("#selExtintorInspeccionar").val(-1); 
   }
   
   informacionExtintorSeleccionado();
}

function informacionExtintorSeleccionado(){
   var extintorId = parseInt($("#selExtintorInspeccionar").val());
    
   if(extintorId != -1){
      listExtintoresAux.forEach(function(val){
	 if(val.id == extintorId){
	    document.querySelector('#ubicacionInfo').innerText = val.ubicacion;   
	    document.getElementById('ubicacionInfo')
	       .style.color = "black";
	     
            document.querySelector('#fechaVencRecargaInfo').innerText = val.fechaFinRecargaTexto;   
	    document.getElementById('fechaVencRecargaInfo')
	       .style.color = (val.isVigenteFechaRecarga >= 0?"blue":"red");
	    
	    document.querySelector('#fechaVencMantInfo').innerText = val.fechaFinMantenimientoTexto;
	    document.getElementById('fechaVencMantInfo')
	       .style.color = (val.isVigenteFechaMantenimiento >= 0?"blue":"red");
		
	    document.querySelector('#fechaVencHidroInfo').innerText = val.fechaFinPruebaHidrostaticaTexto;  
	    document.getElementById('fechaVencHidroInfo')
               .style.color = (val.isVigenteFechaHidrostatica >= 0?"blue":"red");
         }
      });
   }else{
      document.querySelector('#ubicacionInfo').innerText = "------";
      document.getElementById('ubicacionInfo').style.color = "black";
      document.querySelector('#fechaVencRecargaInfo').innerText = "------";
      document.getElementById('fechaVencRecargaInfo').style.color = "black";
      document.querySelector('#fechaVencMantInfo').innerText = "------";
      document.getElementById('fechaVencMantInfo').style.color = "black";
      document.querySelector('#fechaVencHidroInfo').innerText = "------";
      document.getElementById('fechaVencHidroInfo').style.color = "black";
   } 
}

function guardarSeleccionarExtintorEvaluacion(){
   var campoVacio = true; 
    
   var extintorId = parseInt($("#selExtintorInspeccionar").val());
    
   if(extintorId == -1){
      campoVacio = false;
      mensajeUx = "<label>Debe seleccionar el extintor a inspeccionar.</label>";
   }
    
   if(campoVacio){
      var dataParam={
	 id: auditoriaExtintorId,
 	 auditoria: {auditoriaId: inspeccionEvento.idAux},
 	 extintor: {id: extintorId},
 	 trabajadorId: parseInt(getSession("trabajadorGosstId"))
      }; 
        
      callAjaxPost(URL+'/auditoria/auditoria_extintor/save',dataParam,function(data){
	 $("#modalSeleccionarExtintorEval").remove();
	 
	 if(auditoriaExtintorId == 0){ 
	    mensajeUx="<label>El extintor se asoció a la inspección con éxito.<br><br>" +
	 	      "Empezará el despliegue de las preguntas para la evaluación.</label>";
	 }else{
	    mensajeUx="<label>El registro del extintor se actualizó con éxito.</label>"; 
	 }
	 
	 mensajesUx(mensajeUx,1,"","ActualizarVistaSelExtEva");
	       
	 $("#modalMensajeUxActualizarVistaSelExtEva").on("hidden.bs.modal",function(){ 
	    if(auditoriaExtintorId == 0){ 
	       evalInspeccExtintorObj.id = data.nuevoId;
	       realizarEvaluacionInspeccionExtintor();
	    }else{
	       realizarInspeccionMovil(idEvento);
	    }
	 });
      });
   }else{
      $("#modalSeleccionarExtintorEval").modal("hide");
       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposSelExtEva");

      $("#modalMensajeUxAvisoCompletarCamposSelExtEva").on("hidden.bs.modal",function(){
	 $("#modalSeleccionarExtintorEval").modal("show");
      });
   }   
}

function eliminarSeleccionarExtintorEvaluacion(){
   mensajeUx="<label>¿Está seguro de eliminar este registro de extintor " +
    	     "(código: "+evalInspeccExtintorObj.extintor.codigo+") seleccionado?" +
    	     "<br>(también se eliminará la evaluación relacionada al mismo).</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarSeleccionarExtintorEval");

   $("#btnDevolverValorRespEliminarSeleccionarExtintorEval").on("click",function(){
      var dataParam={
 	 id: evalInspeccExtintorObj.id
      };

      callAjaxPost(URL+'/auditoria/auditoria_extintor/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":
 	       mensajeUx="<label>El registro del extintor se ha eliminado correctamente.</label>";
 		
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

var listFullEvaluacionesInspeccionExt=[];

function realizarEvaluacionInspeccionExtintor(){
   var dataParam={
      id: evalInspeccExtintorObj.id,
      tipoAuditoriaId: inspeccionEvento.linkAuxiliarId2
   };
   
   callAjaxPost(URL+'/auditoria/verificaciones/version_dos/evaluacion',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listFullEvaluacionesInspeccionExt = data.listEvaluacionesExtintores;
              
            $("#infoMovilExtintorInspeccEvalPendiente").remove();
            $("#infoMovilExtintorInspeccEvalCompletado").remove();
            $("#estadoMovilRegExtintorInspeccionFin").remove();
            $("#subRealizarInspecciones").find(".contenidoSubList").html("");
   
            $("#subRealizarInspecciones").find(".tituloSubList").html(
               textoBotonVolverContenidoColaborador+" "+inspeccionEvento.text);
	
            listFullEvaluacionesInspeccionExt.forEach(function(val,index){ 
               $("#subRealizarInspecciones").find(".contenidoSubList")
                  .append(crearDivEvaluacionInspeccionVersionDos(val,index));
       
               var options={
 	          container: "#tdEviPreg"+val.verificacionId,
 	          functionCall: function(){},
 	          descargaUrl: (val.respuestaSimple == 0?"":
 	             "/auditoria/verificaciones/respuesta/version_dos/evidencia?" +
 	             "detalleAuditoriaExtintorId="+val.detalleAuditoriaExtintorId),
 	          esNuevo: (val.respuestaSimple == 0 || val.evidenciaNombre == ""?true:false),
 	          idAux: "PregInspecc"+val.verificacionId,
 	          evidenciaNombre: (val.respuestaSimple == 0 || val.evidenciaNombre == ""?
 		                    "":val.evidenciaNombre)
               }; 
       
               crearFormEvidenciaCompleta(options);
               
               var optionsMedCor={
      	          container: "#tdEviMedCorExt"+val.verificacionId,
      	          functionCall: function(){
      	             estadoAccionCorrectivaInspeccExt(val.verificacionId);
      	          },
      	          descargaUrl: (val.respuestaSimple == 0?"":
      	             "/auditoria/verificaciones/respuesta/version_dos/auditoria_extintor/accion_correctiva/evidencia?" +
      	             "detalleAuditoriaExtintorId="+val.detalleAuditoriaExtintorId),
      	          esNuevo: (val.respuestaSimple == 0 || val.evidenciaAccCorNombre == ""?true:false),
      	          idAux: "MedCorInspeccExt"+val.verificacionId,
      	          evidenciaNombre: (val.respuestaSimple == 0 || val.evidenciaAccCorNombre == ""?
      		                    "":val.evidenciaAccCorNombre),
      		  mensajeAux: "*Al subir la evidencia, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
               }; 
            
               crearFormEvidenciaCompleta(optionsMedCor);
 	 
               $("#textObsAudiMovil"+val.verificacionId).val(val.comentario);
               
               habilitarCamposPreguntaInspeccionMovil(val.respuestaSimple,val.verificacionId);
               
               if(val.respuestaSimple == 1){
     	          $("#textDescAudiExtMedCorMovil"+val.verificacionId).val(val.accionCorrectiva); 
     	  
     	          var valFechaPlanificada = convertirFechaInput(val.fechaPlanificacion);
     	          $("#inputFechaPlanAudiExtMedCorMovil"+val.verificacionId).val(valFechaPlanificada);
     	          
     	          $("#inputBuscarResponsableExtMedCorrMovil"+val.verificacionId).val(val.responsable);
     	          buscarResponsableAccionCorrectivaInspeccExt(val.verificacionId);
     	       }
               
               if(val.respuestaSimple == 0 || (val.respuestaSimple == 1 && val.evidenciaAccCorNombre.length != 0)){
                  $("#pregInsMovil"+index+">div").hide();
               }
       
               $("#pregInsMovil"+index+" .divNombrePregunta").show();
            });
    
            $("#subRealizarInspecciones").find(".contenidoSubList").append(
               "<div class='divInformacionCurso' style='padding:20px;'>" +
                  "<button type='button' class='btn btn-danger' style='font-size:18px;' " +
	                  "onclick='realizarInspeccionMovil("+idEvento+")'>" +
	             "<i class='fa fa-times'></i> Cancelar" +
  	          "</button>" +
  	          "<button type='button' class='btn btn-success' style='float:right;font-size:18px;' " +
                          "onclick='guardarEvaluacionInspeccionVersionDos()'>" +
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

function crearDivEvaluacionInspeccionVersionDos(contenidoVal,contenidoIndex){
   var textoBotonToggleReportar =
      "<button class='btn btn-danger' onclick='cambiarDivSubPreguntaInspeccExt(this,"+contenidoVal.verificacionId+")'>" +
         "<i class='fa fa-bullhorn fa-3x' aria-hidden='true'></i>" +
      "</button>";
    
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
      return val2.id - val.id;
   });
      
   var radiosPregInsMovil = crearRadiosAutoVersionDos("radioPreguntaInsMovil"+contenidoVal.verificacionId,
      listBooleanSiNo,contenidoVal.respuestaSimple,"id","nombre","habilitarCamposPreguntaInspeccionMovil",
      contenidoVal.verificacionId);
     
   return "<div class='divInformacionCurso' id='pregInsMovil"+contenidoIndex+"'>" +
 	     "<div class='divNombrePregunta'>"+textoBotonToggleReportar +
 		 (contenidoIndex+1)+". &nbsp;"+contenidoVal.verificacion +" " +
                  "<span id='estadoRespPregEvalInspecc"+contenidoVal.verificacionId+"' " +
                        "style='font-weight:bolder;'></span>" +
 	     "</div>" +
 	     "<div class='divOpcionesGosst form-group' style='padding:20px;margin:0px 0px -10px 20px;'>" +
 	         radiosPregInsMovil +
 	        "<strong>Observación:</strong>" +
 	        "<span id='auxInfoTextObsAudiMovil"+contenidoVal.verificacionId+"' " +
 	              "style='float:right;color:red;font-weight:bold;'></span>" +
 	        "<textarea rows='4' class='form-control' id='textObsAudiMovil"+contenidoVal.verificacionId+"'></textarea>" +
 	        "<br><strong>Evidencia:</strong>" +
 	        "<span id='auxInfoTextEviPreg"+contenidoVal.verificacionId+"' " +
 	              "style='float:right;color:blue;font-weight:bold;'></span>" +
 	        "<span id='tdEviPreg"+contenidoVal.verificacionId+"'></span>" +
             "</div>" +
 	     "<div class='general-inspeccExtMedCor inspeccExtMedCor"+contenidoVal.verificacionId+"' " +
     	          "style='border-top:2px solid black;margin:10px 0px 20px 0px;'></div>" +
             "<div class='general-inspeccExtMedCor inspeccExtMedCor"+contenidoVal.verificacionId+" eventoGeneral' style='margin:10px;'>" +
                "<div class='general-inspeccExtMedCor inspeccExtMedCor"+contenidoVal.verificacionId+"'>" +
                   "<label style='font-size:"+(isMobile.any()?"14px":"18px")+";'>*** MEDIDA CORRECTIVA ***</label>" +
                   "<div style='border-top:2px solid black;margin:5px -10px 10px -10px;'></div>" +
                   "<strong>Descripción:</strong>" +
	           "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
	           "<textarea rows='4' class='form-control' id='textDescAudiExtMedCorMovil"+contenidoVal.verificacionId+"'></textarea>" +
	           "<br><strong>Fecha planificada:</strong>" +
	           "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
	           "<input type='date' id='inputFechaPlanAudiExtMedCorMovil"+contenidoVal.verificacionId+"' class='form-control'>" +
	           "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
	           "<strong>Responsable de la medida correctiva:</strong>" +
	           "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
	           "<input class='form-control' id='inputBuscarResponsableExtMedCorrMovil"+contenidoVal.verificacionId+"'>" +
	           "<div id='divSelResponsableExtMedCorrMovil"+contenidoVal.verificacionId+"'></div>" +
	           "<small>*Buscar responsable por DNI y/o nombres/apellidos (debe ingresar 3 caracteres como mínimo).</small>" +
	           "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
	           "<strong>Evidencia - Medida correctiva*:</strong>" +
	           "<span id='tdEviMedCorExt"+contenidoVal.verificacionId+"'>(obligatorio)</span>" +
	           "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
	           "<strong style='font-size:"+(isMobile.any()?"15px":"18px")+"'>Estado:</strong> " +
	           "<span id='auxInfoEstadoAudiExtMedCorMovil"+contenidoVal.verificacionId+"' " +
	                 "style='color:red;font-weight:bold;font-size:"+(isMobile.any()?"15px":"18px")+"'></span>" +
                "</div>" +
             "</div>" +
 	  "</div>";
}

function habilitarCamposPreguntaInspeccionMovil(valResp,auxId){
   var valRespVisita = valResp;
     
   if(valRespVisita == 1){
      document.getElementById("textObsAudiMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextObsAudiMovil'+auxId).innerText = "(obligatorio)";
        
      document.getElementById("fileEviPregInspecc"+auxId).disabled = false;
      document.querySelector('#auxInfoTextEviPreg'+auxId).innerText = "(opcional)";
       
      document.querySelector('#estadoRespPregEvalInspecc'+auxId).innerText = "(con observación)";   
      document.getElementById('estadoRespPregEvalInspecc'+auxId).style.color = "red";
      
      $(".inspeccExtMedCor"+auxId).show();
      
      $("#inputBuscarResponsableExtMedCorrMovil"+auxId).val("");
      
      buscarResponsableAccionCorrectivaInspeccExt(auxId);
   }else{
      document.getElementById("textObsAudiMovil"+auxId).disabled = true;
      document.getElementById("textObsAudiMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextObsAudiMovil'+auxId).innerText = "";
        
      document.getElementById("fileEviPregInspecc"+auxId).disabled = true;
      document.getElementById("fileEviPregInspecc"+auxId).value = null;
      document.getElementById("inputEviPregInspecc"+auxId).value = null;
      document.querySelector('#auxInfoTextEviPreg'+auxId).innerText = "";
       
      document.querySelector('#estadoRespPregEvalInspecc'+auxId).innerText = "(sin observación)";   
      document.getElementById('estadoRespPregEvalInspecc'+auxId).style.color = "blue";
      
      $(".inspeccExtMedCor"+auxId).hide();
      
      document.getElementById("textDescAudiExtMedCorMovil"+auxId).value = null;
      
      document.getElementById("inputFechaPlanAudiExtMedCorMovil"+auxId).value = null;
      
      document.getElementById("fileEviMedCorInspeccExt"+auxId).value = null;
      document.getElementById("inputEviMedCorInspeccExt"+auxId).value = null;
   }
   
   estadoAccionCorrectivaInspeccExt(auxId);
}

function estadoAccionCorrectivaInspeccExt(auxId){
   var nombreAccCorEvidencia = $("#inputEviMedCorInspeccExt"+auxId).val();
    
   if(nombreAccCorEvidencia.length == 0){
      document.querySelector('#auxInfoEstadoAudiExtMedCorMovil'+auxId).innerText = "Pendiente";   
      document.getElementById('auxInfoEstadoAudiExtMedCorMovil'+auxId).style.color = "#D1D619";
   }else{
      document.querySelector('#auxInfoEstadoAudiExtMedCorMovil'+auxId).innerText = "Completado";   
      document.getElementById('auxInfoEstadoAudiExtMedCorMovil'+auxId).style.color = "blue";
   }
}

var listResponsablesAccCorInsExt=[];

function buscarResponsableAccionCorrectivaInspeccExt(auxId){
   var nombre = $("#inputBuscarResponsableExtMedCorrMovil"+auxId).val().trim();
 	
   if(nombre.length >= 3){
      var dataParam={
         trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid"))
      };
 		
      callAjaxPostNoLoad(URL+"/auditoria/responsable/accion_correctiva",dataParam,function(data){
	 listResponsablesAccCorInsExt = data.listResponsablesAccCorIns;
        
         if(listResponsablesAccCorInsExt.length == 0){
            listResponsablesAccCorInsExt.push({
               trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
 	    });
         }
 			
         var selResponsableAccCorInsExt = crearSelectOneMenuOblig("selResponsableAccCorInsExt"+auxId,
            "",listResponsablesAccCorInsExt,"","trabajadorId","nombre");
 	       
         $("#divSelResponsableExtMedCorrMovil"+auxId).html(selResponsableAccCorInsExt);
         $("#inputBuscarResponsableExtMedCorrMovil"+auxId)
            .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccExt("+auxId+")");
      });
   }else{
      listResponsablesAccCorInsExt = [];
       
      listResponsablesAccCorInsExt.push({
         trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
      });
        
      var selResponsableAccCorInsExt = crearSelectOneMenuOblig("selResponsableAccCorInsExt"+auxId,
	 "",listResponsablesAccCorInsExt,"","trabajadorId","nombre");
 		       
      $("#divSelResponsableExtMedCorrMovil"+auxId).html(selResponsableAccCorInsExt);
      $("#inputBuscarResponsableExtMedCorrMovil"+auxId)
         .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccExt("+auxId+")");
   }
}

var indiceActualEvaInd;

function guardarEvaluacionInspeccionVersionDos(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'}); 

   var campoVacio = true; 
   
   var bitRespuesta,observacion,medidaCorrectiva,inputFechaPlanificada,nombrePregunta;
    
   listFullEvaluacionesInspeccionExt.forEach(function(val,index){
      bitRespuesta = parseInt($("input[name='radioPreguntaInsMovil"+val.verificacionId+"']:checked").val());
      
      if(bitRespuesta == 1 && campoVacio){
	 nombrePregunta = val.verificacion;
	 observacion = $("#textObsAudiMovil"+val.verificacionId).val();
	 medidaCorrectiva = $("#textDescAudiExtMedCorMovil"+val.verificacionId).val();
	 
	 var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiExtMedCorMovil"+val.verificacionId).val());
	 inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
	 
	 var nombreEvidenciaMedCor = $("#inputEviMedCorInspeccExt"+val.verificacionId).val();
	 
	 var responsableId = parseInt($("#selResponsableAccCorInsExt"+val.verificacionId).val());
	 
	 if(observacion.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la observación - "+nombrePregunta+".</label>";
	    
	    document.getElementById("textObsAudiMovil"+val.verificacionId).focus();
	 }else if(medidaCorrectiva.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la descripción de la medida correctiva - " +
	    		 nombrePregunta+".</label>";  
	    
	    document.getElementById("textDescAudiExtMedCorMovil"+val.verificacionId).focus();
	 }else if(inputFechaPlanificada == null && nombreEvidenciaMedCor.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la fecha planificada o subir la evidencia de la " +
 	                "medida correctiva - "+nombrePregunta+".</label>"; 
	    
	    document.getElementById("inputFechaPlanAudiExtMedCorMovil"+val.verificacionId).focus();
	 }else if(responsableId == -1){
	    campoVacio = false;
            mensajeUx = "<label>Debe seleccionar al responsable de la medida correctiva - " +
		         nombrePregunta+".</label>";  
            
            document.getElementById("inputBuscarResponsableExtMedCorrMovil"+val.verificacionId).focus();
	 }
      }  
   });
   
   if(campoVacio){
      indiceActualEvaInd = 1;
      guardarRespuestaInspeccionVersionDos(indiceActualEvaInd,guardarRespuestaInspeccionVersionDos);
   }else{
      $.unblockUI();
      mensajesUx(mensajeUx,2,"");
   }
}

function guardarRespuestaInspeccionVersionDos(indiceActual,functionCallBack){
   var respuesta,respAux,observacion,validacionId,medidaCorrectiva,inputFechaPlanificada,
       responsableId;
   var dataParam;
    
   listFullEvaluacionesInspeccionExt.forEach(function(val,index){
      if((index + 1) == indiceActualEvaInd){
         respuesta = parseFloat($("input[name='radioPreguntaInsMovil"+val.verificacionId+"']:checked").val());
         respAux = parseInt($("input[name='radioPreguntaInsMovil"+val.verificacionId+"']:checked").val());
         observacion = $("#textObsAudiMovil"+val.verificacionId).val();
         validacionId = val.verificacionId;
       //var nombreEvi = $("#inputEviPregInspecc"+val.verificacionId).val();
         if(respAux == 1){
            medidaCorrectiva =  $("#textDescAudiExtMedCorMovil"+val.verificacionId).val();
            responsableId = parseInt($("#selResponsableAccCorInsExt"+val.verificacionId).val());
              
            var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiExtMedCorMovil"+val.verificacionId).val());
     	    inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
         }else{
            medidaCorrectiva = null;inputFechaPlanificada = null;responsableId = null;
         }
         
         dataParam={
            detalleAuditoriaExtintorId: val.detalleAuditoriaExtintorId,
            auditoriaExtintorId: evalInspeccExtintorObj.id, 
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
     
   callAjaxPostSimple(URL+'/auditoria/verificaciones/respuesta/version_dos/save',dataParam,0,function(data){
      guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviPregInspecc"+validacionId,bitsEvidenciaVerificacion,
      "/auditoria/verificaciones/respuesta/version_dos/evidencia/save",function(){
	 guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviMedCorInspeccExt"+validacionId,bitsEvidenciaVerificacion,
	 "/auditoria/verificaciones/respuesta/version_dos/auditoria_extintor/accion_correctiva/evidencia/save",function(){
            if(indiceActualEvaInd == listFullEvaluacionesInspeccionExt.length){
               $.unblockUI();
	       mensajeUx = "<label>Inspección guardada con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","EvaluacionCompletadaIns");
					
	       $("#modalMensajeUxEvaluacionCompletadaIns").on("hidden.bs.modal",function(){
	          realizarInspeccionMovil(idEvento);   
	       });
            }else{
	       indiceActualEvaInd++;
	       functionCallBack(indiceActualEvaInd,guardarRespuestaInspeccionVersionDos);
            }
         },"detalleAuditoriaExtintorId");
      },"detalleAuditoriaExtintorId");
   });
}

function cambiarDivSubPreguntaInspeccExt(obj,verificacionId){
   $(obj).parent(".divNombrePregunta").siblings(".divOpcionesGosst").toggle();
    
   var respuesta = parseInt($("input[name='radioPreguntaInsMovil"+verificacionId+"']:checked").val());
    
   if(respuesta == 1){
      $(obj).parent(".divNombrePregunta").siblings(".general-inspeccExtMedCor").toggle();
   }
}
