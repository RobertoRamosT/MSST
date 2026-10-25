
var docNivelEquHerrId,indexDocNivelEquHerr,docNivelEquHerrObj = {};
var listDocumentosNivelEquHerr = [];
var listEvaluacionDocNivEquHerr= [];
var listEstadosEvaluacionId = [];
var tipoDocEquHerrId,tipoDocEquHerrNombre;

// P-A00039: vigencia en «Opciones», buscador y aviso de fechas, con el mismo diseno de los documentos por trabajador (documento_nivel_vigencia_busqueda.js)
var controlEquHerr = crearControlDocNivel({
   clave:"EquHerr",idSelVigencia:"selVigenciaDocNivEquHerr",idNotaFechas:"notaFechasDocNivEquHerr",idFechaInicio:"#fechaInicioDocNivEquHerr",idFechaFin:"#fechaFinDocNivEquHerr",
   idInputBusqueda:"inputBusquedaDocNivEquHerr",idAvisoBusqueda:"avisoBusquedaDocNivEquHerr",idAvisoFechas:"avisoFechasDocNivEquHerr",
   placeholder:"Buscar por código o descripción",ariaBuscador:"Buscar documentos por el código o la descripción del equipo o herramienta",
   // P-A00040: la lista se pagina de 100 en 100 (hay contratistas con casi mil documentos de equipos)
   paginar:true,idBtnAnterior:"btnAnteriorDocNivEquHerr",idBtnSiguiente:"btnSiguienteDocNivEquHerr",
   recargar:function(){verRegistrosDocumentoNivelEquipoHerramienta();}
});
var mensajeUx;

var listTipoDocumentoEquHerrAux=[
   {id:1,nombre:"Certificado de operatividad"},{id:2,nombre:"Inspección"}
];

function ocultarFiltroRegistrosDocumentoNivelEquipoHerramienta(){
   $("#modalFiltroDocNivelEquHerr").modal("hide");
}

function verFiltroRegistrosDocumentoNivelEquipoHerramienta(){
   controlEquHerr.actualizarOpciones();
   $("#modalFiltroDocNivelEquHerr").modal("show");
}

function crearFiltroRegistrosDocumentoNivelEquipoHerramienta(functionCallBack,pTipoDocEquHerrId){
   // cada vez que se abre la seccion la vigencia vuelve a «Todos» y se borra la busqueda
   controlEquHerr.reiniciar();

   $("#modalFiltroDocNivelEquHerr").remove();
    
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))
   }; 
	  		
   callAjaxPost(URL+'/contratista/documento_nivel_equipo_herramienta/filtro',dataParam,function(data){
      listEvaluacionDocNivEquHerr = data.listEvaluacion;
	      
      var contenido = "";
  				
      var listContenido=[
         {sugerencia:"",label:"Estado de la evaluación",inputForm:"",
          divContainer:"divFiltroEstadosEvaluacionDocNivEquHerr"},
         {sugerencia:"",label:"Vigencia",inputForm:controlEquHerr.htmlCampoVigencia()},
         {sugerencia:"",label:"",inputForm:"",divContainer:""},
  	 {sugerencia:"",label:"Fecha de registro - Inicio",
  	  inputForm:"<input type='date' id='fechaInicioDocNivEquHerr' class='form-control'>"},
  	 {sugerencia:"",label:"Fecha de registro - Fin",
  	  inputForm:"<input type='date' id='fechaFinDocNivEquHerr' class='form-control'>"+controlEquHerr.htmlNotaFechas()},
  	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		"onclick='ocultarFiltroRegistrosDocumentoNivelEquipoHerramienta()'>" +
               	   "<i class='fa fa-times'></i> Cancelar" +
               	"</button>",
  	  inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' " +
  	      		    "onclick='valoresFiltroRegistrosDocumentoNivelEquipoHerramienta()'>" +
  	               "<i class='fa fa-filter'></i> Aplicar filtro" +
  	            "</button>"},
      ]; 
  				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
   
      tipoDocEquHerrId = parseInt(pTipoDocEquHerrId);
      
      listTipoDocumentoEquHerrAux.forEach(function(val){
         if(tipoDocEquHerrId == val.id){
            tipoDocEquHerrNombre = val.nombre;  
	 }
      });
  		
      var modalOptions={
 	 id:"modalFiltroDocNivelEquHerr",
 	 nombre:"<i class='fa fa-filter'></i> Filtros - "+tipoDocEquHerrNombre+" Registrados",
  	 contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
      };
  				
      crearModalPrincipalUsuario(modalOptions,function(){
	 if($("#filtroEstadosEvaluacionDocNivEquHerr").length > 0){
	    return;
	 }
	                   
	 crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvaluacionDocNivEquHerr","",listEvaluacionDocNivEquHerr,
	    "id","nombre","#divFiltroEstadosEvaluacionDocNivEquHerr","Todos");
      },true,true);
   
      var hoy = getSession("fechaHoyOrdenInversoTexto");
   
      $("#fechaInicioDocNivEquHerr").val(sumaFechaDias(-360,hoy));$("#fechaFinDocNivEquHerr").val(sumaFechaDias(90,hoy));
      controlEquHerr.actualizarOpciones();
  				
      functionCallBack();
   });
}

function toggleMenuOpcionRegistrosDocumentoNivelEquipoHerramienta(obj,pindex){
   docNivelEquHerrObj = listDocumentosNivelEquHerr[pindex];
   indexDocNivelEquHerr = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesRegistrosDocumentoNivelEquipoHerramienta=[  
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
    functionClick:function(data){registroDocumentoNivelEquipoHerramienta(1);}},
   {id:"opcEliminar",nombre:"<i class='fa fa-trash-o'></i> Eliminar",
    functionClick:function(data){eliminarRegistroDocumentoNivelEquipoHerramienta();}}
];

function marcarSubOpcionRegistrosDocumentoNivelEquipoHerramienta(pindex){
   funcionalidadesRegistrosDocumentoNivelEquipoHerramienta[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function valoresFiltroRegistrosDocumentoNivelEquipoHerramienta(){
   ocultarFiltroRegistrosDocumentoNivelEquipoHerramienta(); 
    
   if($("#fechaInicioDocNivEquHerr").val().length > 0 && $("#fechaFinDocNivEquHerr").val().length > 0){
       listEstadosEvaluacionId = [];
       controlEquHerr.leerFiltroDelModal();
       
       var estadoEvaluacionId = $("#filtroEstadosEvaluacionDocNivEquHerr").val(); 
       
       if(estadoEvaluacionId != null){
          estadoEvaluacionId.forEach(function(val){
             listEstadosEvaluacionId.push(parseInt(val));
          });
       }
       
       verRegistrosDocumentoNivelEquipoHerramienta();
   }else{
	mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroDocNivelEquHerr").modal("show");
	});
   }
}

function verRegistrosDocumentoNivelEquipoHerramienta(){
   var dataParam={
      contratistaId:parseInt(getSession("contratistaGosstId")),tipoDocumentoEquipoHerramientaId:tipoDocEquHerrId,
      fechaRegistroInicio:$("#fechaInicioDocNivEquHerr").val(),fechaRegistroFin:$("#fechaFinDocNivEquHerr").val(),
      listEstadoEvaluacionId:(listEstadosEvaluacionId.length == 0?null:listEstadosEvaluacionId),
      filtroVigencia:controlEquHerr.parametros().filtroVigencia,busqueda:controlEquHerr.parametros().busqueda,pagina:controlEquHerr.parametros().pagina
   };

   controlEquHerr.cargando = true;

   callAjaxPost(URL+'/contratista/documento_nivel_equipo_herramienta',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listDocumentosNivelEquHerr = data.listDocumentosNivelEquHerr;
            controlEquHerr.guardarRespuesta(data);
            
  	    var listPanelesPrincipal = [],textDocNivelEquHerr = "";
  	    
  	    $(".divListPrincipal").html("");
  	     
  	    listDocumentosNivelEquHerr.forEach(function(val,index){
 	       var btnOpcion = "",menuOpcion = "";
 	       
 	       if(val.evaluacion.nota.id != 1){
	          menuOpcion = "<ul class='list-group listaFinalGestionGosst'>"; 
	             funcionalidadesRegistrosDocumentoNivelEquipoHerramienta.forEach(function(val1,index1){
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionRegistrosDocumentoNivelEquipoHerramienta("+index1+")'>" +
				          val1.nombre +
				      "</li>";
	             });		    
	          menuOpcion += "</ul>";
				    
	          btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionRegistrosDocumentoNivelEquipoHerramienta(this,"+index+")'>" +
			         "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			      "</a>";
 	       }
	       
	       var enlaceEvidencia = (val.evidenciaNombre == ""?"------":
                  "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/documento_nivel_equipo_herramienta/evidencia?id="+val.id+"'>"+
		      val.evidenciaNombre +
		  "</a>");
 	       
 	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
 		   label:"<span style='color:blue;font-size:15px;font-weight:bolder;'>*** DATOS DEL EQUIPO/HERRAMIENTA ***</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-barcode'></i> Código:",inputForm:val.equipoHerramienta.codigo},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Tipo:",inputForm:val.tipoEquipoHerramienta.nombre},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
 	           label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DATOS DEL REGISTRO ***</span>"+controlEquHerr.etiquetaFutura(val)},
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
 	       		
 	       textDocNivelEquHerr += "<div class='eventoGeneral'>" +
 	                                 "<form class='eventoGeneral'>";	
 	          listTotal.forEach(function(val,index){
 	             textDocNivelEquHerr += obtenerSubPanelModuloVersionDos(val);
 	          });
 	       textDocNivelEquHerr +=    "</form>" +
 		                      "</div>";
 	    });
  	    	  				
     	    listPanelesPrincipal.push(
     	       {id: "registroMovilDocNivelEquHerr",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroDocumentoNivelEquipoHerramienta(0)",
            	btnIconoAux:"fa-pencil",btnTitleAux:"Registrar nuevo documento",nombre:"Nuevo registro de "+tipoDocEquHerrNombre,contenido:""},
               {id: "opcionesDocNivelEquHerr",clase:"",styleAux:"",buttonAd:controlEquHerr.htmlBotonFiltro("verFiltroRegistrosDocumentoNivelEquipoHerramienta"),btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Opciones<span style='display:inline-block;margin-left:15px;font-size:14px;font-weight:bold;'>("+
    		controlEquHerr.textoEncabezado("Desde "+convertirFechaNormal($("#fechaInicioDocNivEquHerr").val())+" al "+convertirFechaNormal($("#fechaFinDocNivEquHerr").val()))+")</span>",
    		contenido:""},
               {id: "buscadorDocNivelEquHerr",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Buscar equipo o herramienta",contenido:controlEquHerr.htmlBuscador()},
               {id: "infoMovilDocNivelEquHerr",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:tipoDocEquHerrNombre+" registrados ("+controlEquHerr.totalRegistros(listDocumentosNivelEquHerr)+")",
    		contenido:controlEquHerr.htmlPaginacion()+controlEquHerr.htmlAvisoPanel()+textDocNivelEquHerr});

			
	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);

            // «Opciones» y el buscador no se pliegan: sin boton de plegar; «Opciones» muestra solo su titulo con el boton del filtro
            controlEquHerr.restaurarBusqueda();
            controlEquHerr.actualizarOpciones();
            $("#opcionesDocNivelEquHerr,#buscadorDocNivelEquHerr").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
            $("#opcionesDocNivelEquHerr").children(".contenidoSubList").hide();
            $("#buscadorDocNivelEquHerr").children(".contenidoSubList").show();
  			
     	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
     	    
     	    break;
  	     
         default:
  	    alert("nop");
         
  	    break;
      }
   },null,null,null,function(){
      controlEquHerr.terminarCarga();
   });
}

var listTipoVigencia = [];

function ocultarRegistroDocumentoNivelEquipoHerramienta(){
   $("#modalRegistroDocNivelEquHerr").modal("hide");
}

function registroDocumentoNivelEquipoHerramienta(opcionId){
   $("#modalRegistroDocNivelEquHerr").remove();  
   
   docNivelEquHerrId = (parseInt(opcionId) == 0?0:docNivelEquHerrObj.id);

    if(tipoDocEquHerrId == 1){
        listTipoVigencia = [{id:3,nombre:"6 meses",duracionMeses:6},{id:4,nombre:"1 año",duracionMeses:12}];
    }else{
        listTipoVigencia = [{id:4,nombre:"1 año",duracionMeses:12}];
    }

   var selTipoVigenciaDocNivelEquHerr = crearSelectOneMenuOblig("selTipoVigenciaDocNivelEquHerr","hallarFechaFinVigenciaDocNivelEquipoHerramienta()",
      listTipoVigencia,(docNivelEquHerrId == 0?"":docNivelEquHerrObj.tipoVigenciaId),"id","nombre");
 	     
   var contenido = "";
				
   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",label:"Equipo/Herramienta",
       inputForm:"<input type='text' id='inputEquipoHerramientaDocNivelEquHerr' class='form-control'>" +
		 "<div id='divAutoCompletarEquipoHerramientaDocNivelEquHerr'></div>" + 
		 "<label>*Buscar equipo/herramienta por código (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha inicio vigencia del registro",
       inputForm:"<input id='inputFechaInicioVigDocNivelEquHerr' class='form-control' type='date' " +
       		        "onchange='hallarFechaFinVigenciaDocNivelEquipoHerramienta()'>"}, 
      {sugerencia:"<label>(aproximado)</label>",anchoLabel:"",anchoDiv:"",label:"Vigencia",inputForm:selTipoVigenciaDocNivelEquHerr},  
      {sugerencia:"<label>*Nota: Si su documento vence antes de la fecha fin asignada por defecto, modifique la fecha fin para que coincida. " +
       "Si vence después, mantenga la fecha fin predeterminada.</label>",anchoLabel:"",anchoDiv:"",label:"Fecha fin vigencia del registro*",
       inputForm:"<input id='inputFechaFinVigDocNivelEquHerr' class='form-control' type='date'>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia",inputForm:"",divContainer:"eviDocNivelEquHerr"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarRegistroDocumentoNivelEquipoHerramienta()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
	      		 "onclick='guardarRegistroDocumentoNivelEquipoHerramienta()'>" +
	            "<i class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"}
   ];
				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 		
   var modalOptions={
      id:"modalRegistroDocNivelEquHerr",
      nombre:"<i class='fa fa-pencil'></i> Registro "+tipoDocEquHerrNombre,
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };
				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   var optionEvidencia={
      container:"#eviDocNivelEquHerr",isImage:false,
      idAux:"DocNivelEquHerr",evidenciaNombre:(docNivelEquHerrId == 0?"":docNivelEquHerrObj.evidenciaNombre),
      esNuevo:(docNivelEquHerrId == 0 || docNivelEquHerrObj.evidenciaNombre.length == 0?true:false),
      functionCall:function(){
         validacionSubirEvidencia("DocNivelEquHerr",bitsEvidenciaDocumento,"modalRegistroDocNivelEquHerr");
      },descargaUrl:"/contratista/amazon_s3/documento_nivel_equipo_herramienta/evidencia?id="+docNivelEquHerrId
   };
	 			
   crearFormEvidenciaCompleta(optionEvidencia);
   
   if(docNivelEquHerrId > 0){
      $("#inputEquipoHerramientaDocNivelEquHerr").val(docNivelEquHerrObj.equipoHerramienta.codigo);
      $("#inputFechaInicioVigDocNivelEquHerr").val(convertirFechaInput(docNivelEquHerrObj.fechaInicioVigencia));
      $("#inputFechaFinVigDocNivelEquHerr").val(convertirFechaInput(docNivelEquHerrObj.fechaFinVigencia));
   }else{
      var hoy = getSession("fechaHoyOrdenInversoTexto");
       
      $("#inputFechaInicioVigDocNivelEquHerr").val(hoy); 
      
      hallarFechaFinVigenciaDocNivelEquipoHerramienta();
   }
   
   verAutoCompletarEquipoHerramientaDocNivelEquHerr();
}

var listEquiposHerramientasBuscadorAux = [];

function verAutoCompletarEquipoHerramientaDocNivelEquHerr(){
   var equipoHerramienta = $("#inputEquipoHerramientaDocNivelEquHerr").val().trim();

   if(equipoHerramienta.length >= 3){
      var dataParam={
	 codigo:"%"+equipoHerramienta+"%",isBuscador:1,contratistaId:parseInt(getSession("contratistaGosstId"))
      };

      callAjaxPostNoLoad(URL+"/contratista/equipo_herramienta/buscar/simple",dataParam,function(data){
	 listEquiposHerramientasBuscadorAux = (data.equiposHerramientas.length == 0?[{id:-1,codigo:"Sin asignar"}]:data.equiposHerramientas);
    	  
    	 var selAutoEquipoHerramientaDocNivelEquHerr = crearSelectOneMenuOblig("selAutoEquipoHerramientaDocNivelEquHerr","",
    	    listEquiposHerramientasBuscadorAux,"","id","codigo");
	
    	 $("#divAutoCompletarEquipoHerramientaDocNivelEquHerr").html(selAutoEquipoHerramientaDocNivelEquHerr);
	 $("#inputEquipoHerramientaDocNivelEquHerr").attr("onkeyup","verAutoCompletarEquipoHerramientaDocNivelEquHerr()");
      });
   }else{
      listEquiposHerramientasBuscadorAux = [{id:-1,codigo:"Sin asignar"}];
	     
      var selAutoEquipoHerramientaDocNivelEquHerr = crearSelectOneMenuOblig("selAutoEquipoHerramientaDocNivelEquHerr","",
	 listEquiposHerramientasBuscadorAux,"","id","codigo");
	    		       
      $("#divAutoCompletarEquipoHerramientaDocNivelEquHerr").html(selAutoEquipoHerramientaDocNivelEquHerr);
      $("#inputEquipoHerramientaDocNivelEquHerr").attr("onkeyup","verAutoCompletarEquipoHerramientaDocNivelEquHerr()");
   }
}

function hallarFechaFinVigenciaDocNivelEquipoHerramienta(){
   var fechaInicioVigencia = $("#inputFechaInicioVigDocNivelEquHerr").val(),vigenciaId = parseInt($("#selTipoVigenciaDocNivelEquHerr").val()),
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
     
   $("#inputFechaFinVigDocNivelEquHerr").val(fechaFinVigencia);
}

function eliminarRegistroDocumentoNivelEquipoHerramienta(){
   mensajeUx="<label>¿Está seguro de eliminar el registro equipo/herramienta seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocNivelEquHerr");

   $("#btnDevolverValorEliminarDocNivelEquHerr").on("click",function(){
      var dataParam={
         id:docNivelEquHerrObj.id,bucketNombre:BUCKETAMAZONS3 
      };

      callAjaxPost(URL+'/contratista/documento_nivel_equipo_herramienta/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
 	       mensajeUx = "<label>El registro "+tipoDocEquHerrNombre+" fue eliminado con éxito.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarDocNivelEquHerr"); 
 								   
 	       $("#modalMensajeUxActualizarDocNivelEquHerr").on("hidden.bs.modal",function(){
 		  verRegistrosDocumentoNivelEquipoHerramienta();  
 	       });
 	       
               break;
			
            default:
               alert("Ocurrió un error al eliminar el registro "+tipoDocEquHerrNombre);
         }
      });
   });
}

function guardarRegistroDocumentoNivelEquipoHerramienta(){
   var campoVacio = true;
   
   var equipoHerramientaId = parseInt($("#selAutoEquipoHerramientaDocNivelEquHerr").val());
   var fechaInicioVigencia = convertirFechaTexto($("#inputFechaInicioVigDocNivelEquHerr").val());
   var inputFechaInicioVigencia = (!fechaInicioVigencia?null:fechaInicioVigencia);
   var tipoVigenciaId = parseInt($("#selTipoVigenciaDocNivelEquHerr").val());
   var fechaFinVigencia = convertirFechaTexto($("#inputFechaFinVigDocNivelEquHerr").val());
   var inputFechaFinVigencia = (!fechaFinVigencia?null:fechaFinVigencia);
   var evidenciaNombre = $("#inputEviDocNivelEquHerr").val();
   
   if(equipoHerramientaId == -1 || inputFechaInicioVigencia == null || inputFechaFinVigencia == null || 
      evidenciaNombre.length == 0){
      mensajeUx = "<label>Debe completar todos los campos.</label>";campoVacio = false;  
   }else if(evidenciaNombre == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";campoVacio = false;   
   }else{
      var numDiasVigencia = restaFechas($("#inputFechaInicioVigDocNivelEquHerr").val(),$("#inputFechaFinVigDocNivelEquHerr").val()),
          numDiasVigenciaActual = restaFechas(getSession("fechaHoyOrdenInversoTexto"),$("#inputFechaFinVigDocNivelEquHerr").val());
	  
      if(numDiasVigencia < 0){
 	 mensajeUx = "<label>La fecha fin vigencia del registro no puede ser menor que la fecha inicio vigencia del registro.</label>";campoVacio = false; 
      }else if(numDiasVigenciaActual < 0){ 
         mensajeUx = "<label>La fecha fin vigencia del registro no puede ser menor a la fecha de hoy.</label>";campoVacio = false;  
      }
   }
    
   if(campoVacio){
      var dataParam={
	 id:docNivelEquHerrId,equipoHerramientaId:equipoHerramientaId,tipoDocumentoEquipoHerramientaId:tipoDocEquHerrId,
	 fechaInicioVigencia:inputFechaInicioVigencia,tipoVigenciaId:tipoVigenciaId,fechaFinVigencia:inputFechaFinVigencia,
	 contratistaId:parseInt(getSession("contratistaGosstId"))
      };
      
      callAjaxPostSimple(URL+'/contratista/documento_nivel_equipo_herramienta/save',dataParam,1,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":  
	       guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviDocNivelEquHerr",bitsEvidenciaDocumento,0,1,
	       "/contratista/amazon_s3/documento_nivel_equipo_herramienta/evidencia/save","equipo-herramienta-has-tipo-documento-equipo-herramienta/evidencia",function(){
	          $("#modalRegistroDocNivelEquHerr").modal("hide");	
		
	          mensajeUx = "<label>El registro "+tipoDocEquHerrNombre+" fue guardado con éxito.</label>";
	          mensajesUx(mensajeUx,1,"","ActualizarDocNivelEquHerr"); 
								   
	          $("#modalMensajeUxActualizarDocNivelEquHerr").on("hidden.bs.modal",function(){
	             verRegistrosDocumentoNivelEquipoHerramienta();  
	          });
	       });
		
	       break;
						
	    default:
	       alert("Ocurrió un error al guardar el registro "+tipoDocEquHerrNombre);
	 }
      });	
   }else{
      $("#modalRegistroDocNivelEquHerr").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionDocNivelEquHerr");
      
      $("#modalMensajeUxValidacionDocNivelEquHerr").on("hidden.bs.modal",function(){
	 $("#modalRegistroDocNivelEquHerr").modal("show");
      });
   }	
}
