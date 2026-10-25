
var docNivelConductorId,indexDocNivelConductor,docNivelConductorObj = {};
var listDocumentosNivelConductor = [],listTipoLicencias = [];
var listEvaluacionDocNivCond = [];
var listEstadosEvaluacionId = [];
var tipoDocConductorId,tipoDocConductorNombre;

// P-A00039: vigencia en «Opciones», buscador y aviso de fechas, con el mismo diseno de los documentos por trabajador (documento_nivel_vigencia_busqueda.js)
var controlConductor = crearControlDocNivel({
   clave:"Conductor",idSelVigencia:"selVigenciaDocNivCond",idNotaFechas:"notaFechasDocNivCond",idFechaInicio:"#fechaInicioDocNivCond",idFechaFin:"#fechaFinDocNivCond",
   idInputBusqueda:"inputBusquedaDocNivCond",idAvisoBusqueda:"avisoBusquedaDocNivCond",idAvisoFechas:"avisoFechasDocNivCond",
   placeholder:"Buscar por nombre, apellido o documento",ariaBuscador:"Buscar documentos por el nombre, apellido o documento del conductor",
   recargar:function(){verRegistrosDocumentoNivelConductor();}
});
var mensajeUx;

var listTipoDocumentoConductorAux=[
   {id:1,nombre:"Licencia de conducir"},{id:2,nombre:"Certificado de capacitación en normas de tránsito y manejo defensivo"},
   {id:3,nombre:"Examen psicosensométrico"},{id:4,nombre:"Historial de manejo o récord del conductor"},
   {id:5,nombre:"Certificado de capacitación en manejo de camioneta 4x4"},{id:6,nombre:"Certificado de operador de maquinaria"},
   {id:7,nombre:"Certificado del curso MAPTEL Nivel I"},{id:8,nombre:"Curriculum Vitae"},{id:9,nombre:"Capacitación como operador de descarga de cemento"}
];

function ocultarFiltroRegistrosDocumentoNivelConductor(){
   $("#modalFiltroDocNivelConductor").modal("hide");
}

function verFiltroRegistrosDocumentoNivelConductor(){
   controlConductor.actualizarOpciones();
   $("#modalFiltroDocNivelConductor").modal("show");
}

function crearFiltroRegistrosDocumentoNivelConductor(functionCallBack,pTipoDocContratistaId){
   // cada vez que se abre la seccion la vigencia vuelve a «Todos» y se borra la busqueda
   controlConductor.reiniciar();

   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))
   }; 
	  		
   callAjaxPost(URL+'/contratista/documento_nivel_conductor/filtro',dataParam,function(data){
      listEvaluacionDocNivCond = data.listEvaluacion;
	      
      var contenido = "";
  				
      var listContenido=[
         {sugerencia:"",label:"Estado de la evaluación",inputForm:"",
          divContainer:"divFiltroEstadosEvaluacionDocNivCond"},
         {sugerencia:"",label:"Vigencia",inputForm:controlConductor.htmlCampoVigencia()},
         {sugerencia:"",label:"",inputForm:"",divContainer:""},
  	 {sugerencia:"",label:"Fecha de registro - Inicio",
  	  inputForm:"<input type='date' id='fechaInicioDocNivCond' class='form-control'>"},
  	 {sugerencia:"",label:"Fecha de registro - Fin",
  	  inputForm:"<input type='date' id='fechaFinDocNivCond' class='form-control'>"},
  	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:controlConductor.htmlNotaFechas()},
  	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		"onclick='ocultarFiltroRegistrosDocumentoNivelConductor()'>" +
               	   "<i class='fa fa-times'></i> Cancelar" +
               	"</button>",
  	  inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' " +
  	      		    "onclick='valoresFiltroRegistrosDocumentoNivelConductor()'>" +
  	               "<i class='fa fa-filter'></i> Aplicar filtro" +
  	            "</button>"},
      ]; 
  				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
   
      tipoDocConductorId = parseInt(pTipoDocContratistaId);
      
      listTipoDocumentoConductorAux.forEach(function(val){
         if(tipoDocConductorId == val.id){
            tipoDocConductorNombre = val.nombre;  
	 }
      });
  		
      var modalOptions={
 	 id:"modalFiltroDocNivelConductor",
 	 nombre:"<i class='fa fa-filter'></i> Filtros - "+tipoDocConductorNombre+" Registrados",
  	 contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
      };
  				
      crearModalPrincipalUsuario(modalOptions,function(){
	 if($("#filtroEstadosEvaluacionDocNivCond").length > 0){
	    return;
	 }
	                   
	 crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvaluacionDocNivCond","",listEvaluacionDocNivCond,
	    "id","nombre","#divFiltroEstadosEvaluacionDocNivCond","Todos");
      },true,true);
   
      var hoy = getSession("fechaHoyOrdenInversoTexto");
   
      $("#fechaInicioDocNivCond").val(sumaFechaDias(-360,hoy));$("#fechaFinDocNivCond").val(sumaFechaDias(90,hoy));
      controlConductor.actualizarOpciones();
  				
      functionCallBack();
   });
}

function toggleMenuOpcionRegistrosDocumentoNivelConductor(obj,pindex){
   docNivelConductorObj = listDocumentosNivelConductor[pindex];
   indexDocNivelConductor = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesRegistrosDocumentoNivelConductor=[  
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
    functionClick:function(data){registroDocumentoNivelConductor(1);}},
   {id:"opcEliminar",nombre:"<i class='fa fa-trash-o'></i> Eliminar",
    functionClick:function(data){eliminarRegistroDocumentoNivelConductor();}}
];

function marcarSubOpcionRegistrosDocumentoNivelConductor(pindex){
   funcionalidadesRegistrosDocumentoNivelConductor[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function valoresFiltroRegistrosDocumentoNivelConductor(){
   ocultarFiltroRegistrosDocumentoNivelConductor(); 
    
   if($("#fechaInicioDocNivCond").val().length > 0 && $("#fechaFinDocNivCond").val().length > 0){
       listEstadosEvaluacionId = [];
       controlConductor.leerFiltroDelModal();

       var estadoEvaluacionId = $("#filtroEstadosEvaluacionDocNivCond").val(); 
       
       if(estadoEvaluacionId != null){
          estadoEvaluacionId.forEach(function(val){
             listEstadosEvaluacionId.push(parseInt(val));
          });
       }
       
       verRegistrosDocumentoNivelConductor();
   }else{
	mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroDocNivelConductor").modal("show");
	});
   }
}

function verRegistrosDocumentoNivelConductor(){
   var dataParam={
      contratistaId:parseInt(getSession("contratistaGosstId")),tipoDocumentoConductorId:tipoDocConductorId,
      fechaRegistroInicio:$("#fechaInicioDocNivCond").val(),fechaRegistroFin:$("#fechaFinDocNivCond").val(),
      listEstadoEvaluacionId:(listEstadosEvaluacionId.length == 0?null:listEstadosEvaluacionId),
      filtroVigencia:controlConductor.parametros().filtroVigencia,busqueda:controlConductor.parametros().busqueda
   };
    
   callAjaxPost(URL+'/contratista/documento_nivel_conductor',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listDocumentosNivelConductor = data.listDocumentosNivelConductor;listTipoLicencias = data.listTipoLicencias;
            controlConductor.guardarRespuesta(data);
            
  	    var listPanelesPrincipal = [],textDocNivelConductor = "";
  	    
  	    $(".divListPrincipal").html("");
  	     
  	    listDocumentosNivelConductor.forEach(function(val,index){
 	       var btnOpcion = "",menuOpcion = "";
 	       
 	       if(val.evaluacion.nota.id != 1){
	          menuOpcion = "<ul class='list-group listaFinalGestionGosst'>"; 
	             funcionalidadesRegistrosDocumentoNivelConductor.forEach(function(val1,index1){
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionRegistrosDocumentoNivelConductor("+index1+")'>" +
				          val1.nombre +
				      "</li>";
	             });		    
	          menuOpcion += "</ul>";
				    
	          btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionRegistrosDocumentoNivelConductor(this,"+index+")'>" +
			         "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			      "</a>";
 	       }
	       
	       var enlaceEvidencia =  (val.evidenciaNombre == ""?"------":
                  "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/documento_nivel_conductor/evidencia?id="+val.id+"'>"+
		      val.evidenciaNombre +
		  "</a>")
 	       
 	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
 		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CÓDIGO "+val.codigo+" ***</span>"+controlConductor.etiquetaFutura(val)},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-user'></i> Conductor:",inputForm:val.conductor.nombre},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-id-card'></i> Tipo de licencia:",inputForm:val.tipoLicenciaConductor.nombre},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Inicio vigencia del registro:",inputForm:val.fechaInicioVigenciaTexto},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fin vigencia del registro:",inputForm:val.fechaFinVigenciaTexto},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Evidencia:",inputForm:enlaceEvidencia},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 		  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	           label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EVALUACIÓN ***</span>"},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:val.evaluacion.nota.icono+" Estado:",inputForm:val.evaluacion.nota.nombre}
 	       ];  
 	       
 	       if(![3,4].includes(val.evaluacion.nota.id)){
 		  if(val.evaluacion.nota.id != 1){ 
 		     listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Observación:",inputForm:val.evaluacion.observacion});  
 		  }
 		  
 		  listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Evaluado el",inputForm:val.evaluacion.fechaTexto});
 	       }
 	       		
 	       textDocNivelConductor += "<div class='eventoGeneral'>" +
 	                                   "<form class='eventoGeneral'>";	
 	          listTotal.forEach(function(val,index){
 	             textDocNivelConductor += obtenerSubPanelModuloVersionDos(val);
 	          });
 	       textDocNivelConductor +=    "</form>" +
 		                        "</div>";
 	    });
  	    	  				
     	    listPanelesPrincipal.push(
     	       {id: "registroMovilDocNivelConductor",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroDocumentoNivelConductor(0)",
            	btnIconoAux:"fa-pencil",btnTitleAux:"Registrar nuevo documento",nombre:"Nuevo registro de "+tipoDocConductorNombre,contenido:""},
               {id: "opcionesDocNivelConductor",clase:"",styleAux:"",buttonAd:controlConductor.htmlBotonFiltro("verFiltroRegistrosDocumentoNivelConductor"),btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Opciones<span style='display:inline-block;margin-left:15px;font-size:14px;font-weight:bold;'>("+
    		controlConductor.textoEncabezado("Desde "+convertirFechaNormal($("#fechaInicioDocNivCond").val())+" al "+convertirFechaNormal($("#fechaFinDocNivCond").val()))+")</span>",
    		contenido:""},
               {id: "buscadorDocNivelConductor",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Buscar conductor",contenido:controlConductor.htmlBuscador()},
               {id: "infoMovilDocNivelConductor",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:tipoDocConductorNombre+" registrados ("+listDocumentosNivelConductor.length+")",
    		contenido:controlConductor.htmlAvisoPanel()+textDocNivelConductor});

			
	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);

            // «Opciones» y «Buscar conductor» no se pliegan: sin boton de plegar; «Opciones» muestra solo su titulo con el boton del filtro
            controlConductor.restaurarBusqueda();
            controlConductor.actualizarOpciones();
            $("#opcionesDocNivelConductor,#buscadorDocNivelConductor").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
            $("#opcionesDocNivelConductor").children(".contenidoSubList").hide();
            $("#buscadorDocNivelConductor").children(".contenidoSubList").show();
  			
     	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
     	    
     	    break;
  	     
         default:
  	    alert("nop");
         
  	    break;
      }
   });
}

var listTipoVigencia = [];

function ocultarRegistroDocumentoNivelConductor(){
   $("#modalRegistroDocNivelConductor").modal("hide");
}

function registroDocumentoNivelConductor(opcionId){
   $("#modalRegistroDocNivelConductor").remove();  
   
   docNivelConductorId = (parseInt(opcionId) == 0?0:docNivelConductorObj.id);
   
   var selTipoLicenciaDocNivelCond = crearSelectOneMenu("selTipoLicenciaDocNivelCond","",listTipoLicencias,
      (docNivelConductorId == 0?"":docNivelConductorObj.tipoLicenciaConductor.id),"id","nombre");
	  
    if(parseInt(getSession("gestopcompanyid")) == 775 && tipoDocConductorId == 4){
	    listTipoVigencia = [{id:6,nombre:"Indeterminado",duracionMeses:1200}];  
	}else{
		listTipoVigencia = [{id:4,nombre:"1 año",duracionMeses:12}];
	}
	  
   var selTipoVigenciaDocNivelCond = crearSelectOneMenuOblig("selTipoVigenciaDocNivelCond","hallarFechaFinVigenciaDocNivelContratista()",
      listTipoVigencia,(docNivelConductorId == 0?"":docNivelConductorObj.tipoVigenciaId),"id","nombre");
 	     
   var contenido = "";
				
   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",label:"Conductor",
       inputForm:"<input type='text' id='inputConductorDocNivelCond' class='form-control'>" +
		 "<div id='divAutoCompletarConductorDocNivelCond'></div>" + 
		 "<label>*Buscar conductor por número de documento y/o nombre " +
		        "(debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de licencia",inputForm:selTipoLicenciaDocNivelCond},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha inicio vigencia del registro",
       inputForm:"<input id='inputFechaInicioVigDocNivelCond' class='form-control' type='date' " +
       		        "onchange='hallarFechaFinVigenciaDocNivelContratista()'>"}, 
      {sugerencia:"<label>(aproximado)</label>",anchoLabel:"",anchoDiv:"",label:"Vigencia",inputForm:selTipoVigenciaDocNivelCond},
      {sugerencia:"<label>*Nota: Si su documento vence antes de la fecha fin asignada por defecto, modifique la fecha fin para que coincida. " +
       "Si vence después, mantenga la fecha fin predeterminada.</label>",anchoLabel:"",anchoDiv:"",label:"Fecha fin vigencia del registro*",
       inputForm:"<input id='inputFechaFinVigDocNivelCond' class='form-control' type='date'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia",inputForm:"",divContainer:"eviDocNivelConductor"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarRegistroDocumentoNivelConductor()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
	      		 "onclick='guardarRegistroDocumentoNivelConductor()'>" +
	            "<i class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"}
   ];
				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 		
   var modalOptions={
      id: "modalRegistroDocNivelConductor",
      nombre: "<i class='fa fa-pencil'></i> Registro "+tipoDocConductorNombre,
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   var optionEvidencia={
      container: "#eviDocNivelConductor",isImage: false,
      idAux: "DocNivelCond",evidenciaNombre: (docNivelConductorId == 0?"":docNivelConductorObj.evidenciaNombre),
      esNuevo: (docNivelConductorId == 0 || docNivelConductorObj.evidenciaNombre.length == 0?true:false),
      functionCall: function(){
	  validacionSubirEvidencia("DocNivelCond",bitsEvidenciaDocumento,"modalRegistroDocNivelConductor"); 
	  
	  $("#inputEviDocNivelCond").val("VOLVER A SUBIR");
      },descargaUrl: "/contratista/amazon_s3/documento_nivel_conductor/evidencia?id="+docNivelConductorId
   };
	 			
   crearFormEvidenciaCompleta(optionEvidencia);
   
   if(docNivelConductorId > 0){
      $("#inputConductorDocNivelCond").val(docNivelConductorObj.conductor.nombre);
      $("#inputFechaInicioVigDocNivelCond").val(convertirFechaInput(docNivelConductorObj.fechaInicioVigencia));
      $("#inputFechaFinVigDocNivelCond").val(convertirFechaInput(docNivelConductorObj.fechaFinVigencia));
   }else{
      var hoy = getSession("fechaHoyOrdenInversoTexto");
       
      $("#inputFechaInicioVigDocNivelCond").val(hoy); 
      
      hallarFechaFinVigenciaDocNivelContratista();
   }
   
   verAutoCompletarConductorDocNivelCond();
}

var listConductoresBuscadorAux = [];

function verAutoCompletarConductorDocNivelCond(){
   var conductor = $("#inputConductorDocNivelCond").val().trim();

   if(conductor.length >= 3){
      var dataParam={
	 nombre: "%"+conductor+"%",isBuscador: 1,contratistaId: parseInt(getSession("contratistaGosstId"))
      };

      callAjaxPostNoLoad(URL+"/contratista/conductores/buscar/simple",dataParam,function(data){
	 listConductoresBuscadorAux = (data.conductores.length == 0?[{id: -1,nombre: "Sin asignar"}]:data.conductores);
    	  
    	 var selAutoConductorDocNivelCond = crearSelectOneMenuOblig("selAutoConductorDocNivelCond","",
            listConductoresBuscadorAux,"","id","nombre");
	
    	 $("#divAutoCompletarConductorDocNivelCond").html(selAutoConductorDocNivelCond);
	 $("#inputConductorDocNivelCond").attr("onkeyup","verAutoCompletarConductorDocNivelCond()");
      });
   }else{
      listConductoresBuscadorAux = [{id:-1,nombre:"Sin asignar"}];
	     
      var selAutoConductorDocNivelCond = crearSelectOneMenuOblig("selAutoConductorDocNivelCond","",
	 listConductoresBuscadorAux,"","id","nombre");
	    		       
      $("#divAutoCompletarConductorDocNivelCond").html(selAutoConductorDocNivelCond);
      $("#inputConductorDocNivelCond").attr("onkeyup","verAutoCompletarConductorDocNivelCond()");
   }
}

function hallarFechaFinVigenciaDocNivelContratista(){
   var fechaInicioVigencia = $("#inputFechaInicioVigDocNivelCond").val(),vigenciaId = parseInt($("#selTipoVigenciaDocNivelCond").val()),
       numMeses = 0,formatoFechaRegex = /^\d{4}-\d{2}-\d{2}$/,fechaFinVigencia = "";  
  
   listTipoVigencia.forEach(function(val){
      if(val.id == vigenciaId){
         numMeses = val.duracionMeses;
      }
   });
   
   if(numMeses > 0 && formatoFechaRegex.test(fechaInicioVigencia)){
      var date = convertirFechaTexto(fechaInicioVigencia),newDate = new Date(date.setMonth(date.getMonth()+numMeses));
      fechaFinVigencia = convertirFechaInput(newDate);
   }
     
   $("#inputFechaFinVigDocNivelCond").val(fechaFinVigencia);
}

function eliminarRegistroDocumentoNivelConductor(){
   mensajeUx="<label>¿Está seguro de eliminar el registro conductor seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocNivelCond");

   $("#btnDevolverValorEliminarDocNivelCond").on("click",function(){
      var dataParam={
         id: docNivelConductorObj.id,bucketNombre: BUCKETAMAZONS3 
      };

      callAjaxPost(URL+'/contratista/documento_nivel_conductor/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
 	       mensajeUx = "<label>El registro de "+tipoDocConductorNombre+" fue eliminado con éxito.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarDocNivelCond"); 
 								   
 	       $("#modalMensajeUxActualizarDocNivelCond").on("hidden.bs.modal",function(){
 		  verRegistrosDocumentoNivelConductor();  
 	       });
 	       
               break;
			
            default:
               alert("Ocurrió un error al eliminar el registro de "+tipoDocConductorNombre);
         }
      });
   });
}

function guardarRegistroDocumentoNivelConductor(){
   var campoVacio = true;
   
   var conductorId = parseInt($("#selAutoConductorDocNivelCond").val());
   var tipoLicenciaConductorId = parseInt($("#selTipoLicenciaDocNivelCond").val());
   var fechaInicioVigencia = convertirFechaTexto($("#inputFechaInicioVigDocNivelCond").val());
   var inputFechaInicioVigencia = (!fechaInicioVigencia?null:fechaInicioVigencia);
   var tipoVigenciaId = parseInt($("#selTipoVigenciaDocNivelCond").val());
   var fechaFinVigencia = convertirFechaTexto($("#inputFechaFinVigDocNivelCond").val());
   var inputFechaFinVigencia = (!fechaFinVigencia?null:fechaFinVigencia);
   var evidenciaNombre = $("#inputEviDocNivelCond").val();
   
   if(conductorId == -1 || tipoLicenciaConductorId == -1 || inputFechaInicioVigencia == null || inputFechaFinVigencia == null || 
      evidenciaNombre.length == 0){
      mensajeUx = "<label>Debe completar todos los campos.</label>";campoVacio = false;  
   }else if(evidenciaNombre == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";campoVacio = false;   
   }else{
      var numDiasVigencia = restaFechas($("#inputFechaInicioVigDocNivelCond").val(),$("#inputFechaFinVigDocNivelCond").val()),
          numDiasVigenciaActual = restaFechas(getSession("fechaHoyOrdenInversoTexto"),$("#inputFechaFinVigDocNivelCond").val());
	  
      if(numDiasVigencia < 0){
 	 mensajeUx = "<label>La fecha fin vigencia del registro no puede ser menor que la fecha inicio vigencia del registro.</label>";campoVacio = false; 
      }else if(numDiasVigenciaActual < 0){ 
         mensajeUx = "<label>La fecha fin vigencia del registro no puede ser menor a la fecha de hoy.</label>";campoVacio = false;  
      }
   }
    
   if(campoVacio){
      var dataParam={
	 id: docNivelConductorId,conductorId: conductorId,tipoDocumentoConductorId: tipoDocConductorId,tipoLicenciaConductorId: tipoLicenciaConductorId,
	 fechaInicioVigencia: inputFechaInicioVigencia,tipoVigenciaId: tipoVigenciaId,fechaFinVigencia: inputFechaFinVigencia,
	 contratistaId: parseInt(getSession("contratistaGosstId"))
      };
      
      callAjaxPostSimple(URL+'/contratista/documento_nivel_conductor/save',dataParam,1,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":  
	       guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviDocNivelCond",bitsEvidenciaDocumento,0,1,
	       "/contratista/amazon_s3/documento_nivel_conductor/evidencia/save","conductor-has-tipo-documento-conductor/evidencia",function(){
	          $("#modalRegistroDocNivelConductor").modal("hide");	
		
	          mensajeUx = "<label>El registro de "+tipoDocConductorNombre+" fue guardado con éxito.</label>";
	          mensajesUx(mensajeUx,1,"","ActualizarDocNivelCond"); 
								   
	          $("#modalMensajeUxActualizarDocNivelCond").on("hidden.bs.modal",function(){
		     verRegistrosDocumentoNivelConductor();  
	          });
	       });
		
	       break;
						
	    default:
	       alert("Ocurrió un error al guardar el registro de "+tipoDocConductorNombre);
	 }
      });	
   }else{
      $("#modalRegistroDocNivelConductor").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionDocNivelCond");
      
      $("#modalMensajeUxValidacionDocNivelCond").on("hidden.bs.modal",function(){
	 $("#modalRegistroDocNivelConductor").modal("show");
      });
   }	
}
