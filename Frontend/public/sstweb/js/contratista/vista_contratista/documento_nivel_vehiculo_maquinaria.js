
var docNivelVehMaqId,indexDocNivelVehMaq,docNivelVehMaqObj = {};
var listDocumentosNivelVehMaq = [];
var listEvaluacionDocNivVehMaq= [];
var listEstadosEvaluacionId = [];
var tipoDocVehMaqId,tipoDocVehMaqNombre;

// P-A00039: vigencia en «Opciones», buscador y aviso de fechas, con el mismo diseno de los documentos por trabajador (documento_nivel_vigencia_busqueda.js)
var controlVehMaq = crearControlDocNivel({
   clave:"VehMaq",idSelVigencia:"selVigenciaDocNivVehMaq",idNotaFechas:"notaFechasDocNivVehMaq",idFechaInicio:"#fechaInicioDocNivVehMaq",idFechaFin:"#fechaFinDocNivVehMaq",
   idInputBusqueda:"inputBusquedaDocNivVehMaq",idAvisoBusqueda:"avisoBusquedaDocNivVehMaq",idAvisoFechas:"avisoFechasDocNivVehMaq",
   placeholder:"Buscar por placa",ariaBuscador:"Buscar documentos por la placa del vehículo o maquinaria",
   // P-A00040: la lista se pagina de 100 en 100 (hay contratistas con mas de 400 documentos de vehiculos)
   paginar:true,idBtnAnterior:"btnAnteriorDocNivVehMaq",idBtnSiguiente:"btnSiguienteDocNivVehMaq",
   recargar:function(){verRegistrosDocumentoNivelVehiculoMaquinaria();}
});

var mensajeUx;

var listTipoDocumentoVehMaqAux=[
   {id:1,nombre:"Check list de ingreso"},{id:2,nombre:"Inspección técnica"},{id:3,nombre:"Póliza contra todo riesgo"},
   {id:4,nombre:"SOAT"},{id:5,nombre:"Tarjeta/Constancia de propiedad del equipo"},{id:6,nombre:"Certificado de operatividad"},
   {id:7,nombre:"Programa de mantenimiento preventivo"},{id:8,nombre:"Certificado de mantenimiento preventivo"},
   {id:9,nombre:"Permiso especial para el transporte de mercancía"},{id:10,nombre:"Póliza TREC"},{id:11,nombre:"Certificado de opacidad"},
   {id:12,nombre:"Manual del equipo/Ficha técnica"},{id:13,nombre:"Certificado DGH - Osinergmin"},
   {id:14,nombre:"Certificado de cubicación y hermeticidad"},{id:15,nombre:"Tarjeta de circulación emitida por el MTC"},
   {id:16,nombre:"Certificado de gravamen vehicular"},{id:17,nombre:"Verificación - GPS vehicular"},{id:18,nombre:"Certificado de hermeticidad de la bombona"}
];

function ocultarFiltroRegistrosDocumentoNivelVehiculoMaquinaria(){
   $("#modalFiltroDocNivelVehMaq").modal("hide");
}

function verFiltroRegistrosDocumentoNivelVehiculoMaquinaria(){
   controlVehMaq.actualizarOpciones();
   $("#modalFiltroDocNivelVehMaq").modal("show");
}

function crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(functionCallBack,pTipoDocVehMaqId){
   // cada vez que se abre la seccion la vigencia vuelve a «Todos» y se borra la busqueda
   controlVehMaq.reiniciar();

   $("#modalFiltroDocNivelVehMaq").remove();
    
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))
   }; 
	  		
   callAjaxPost(URL+'/contratista/documento_nivel_vehiculo_maquinaria/filtro',dataParam,function(data){
      listEvaluacionDocNivVehMaq = data.listEvaluacion;
	      
      var contenido = "";
  				
      var listContenido=[
         {sugerencia:"",label:"Estado de la evaluación",inputForm:"",
          divContainer:"divFiltroEstadosEvaluacionDocNivVehMaq"},
         {sugerencia:"",label:"Vigencia",inputForm:controlVehMaq.htmlCampoVigencia()},
         {sugerencia:"",label:"",inputForm:"",divContainer:""},
  	 {sugerencia:"",label:"Fecha de registro - Inicio",
  	  inputForm:"<input type='date' id='fechaInicioDocNivVehMaq' class='form-control'>"},
  	 {sugerencia:"",label:"Fecha de registro - Fin",
  	  inputForm:"<input type='date' id='fechaFinDocNivVehMaq' class='form-control'>"+controlVehMaq.htmlNotaFechas()},
  	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		"onclick='ocultarFiltroRegistrosDocumentoNivelVehiculoMaquinaria()'>" +
               	   "<i class='fa fa-times'></i> Cancelar" +
               	"</button>",
  	  inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' " +
  	      		    "onclick='valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria()'>" +
  	               "<i class='fa fa-filter'></i> Aplicar filtro" +
  	            "</button>"},
      ]; 
  				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
   
      tipoDocVehMaqId = parseInt(pTipoDocVehMaqId);
      
      listTipoDocumentoVehMaqAux.forEach(function(val){
         if(tipoDocVehMaqId == val.id){
            tipoDocVehMaqNombre = val.nombre;  
	 }
      });
  		
      var modalOptions={
 	 id:"modalFiltroDocNivelVehMaq",
 	 nombre:"<i class='fa fa-filter'></i> Filtros - "+tipoDocVehMaqNombre+" Registrados",
  	 contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
      };
  				
      crearModalPrincipalUsuario(modalOptions,function(){
	 if($("#filtroEstadosEvaluacionDocNivVehMaq").length > 0){
	    return;
	 }
	                   
	 crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvaluacionDocNivVehMaq","",listEvaluacionDocNivVehMaq,
	    "id","nombre","#divFiltroEstadosEvaluacionDocNivVehMaq","Todos");
      },true,true);
   
      var hoy = getSession("fechaHoyOrdenInversoTexto");
   
      $("#fechaInicioDocNivVehMaq").val(sumaFechaDias(-360,hoy));$("#fechaFinDocNivVehMaq").val(sumaFechaDias(90,hoy));
      controlVehMaq.actualizarOpciones();
  				
      functionCallBack();
   });
}

function toggleMenuOpcionRegistrosDocumentoNivelVehiculoMaquinaria(obj,pindex){
   docNivelVehMaqObj = listDocumentosNivelVehMaq[pindex];
   indexDocNivelVehMaq = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesRegistrosDocumentoNivelVehiculoMaquinaria=[  
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
    functionClick:function(data){registroDocumentoNivelVehiculoMaquinaria(1);}},
   {id:"opcEliminar",nombre:"<i class='fa fa-trash-o'></i> Eliminar",
    functionClick:function(data){eliminarRegistroDocumentoNivelVehiculoMaquinaria();}}
];

function marcarSubOpcionRegistrosDocumentoNivelVehiculoMaquinaria(pindex){
   funcionalidadesRegistrosDocumentoNivelVehiculoMaquinaria[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria(){
   ocultarFiltroRegistrosDocumentoNivelVehiculoMaquinaria(); 
    
   if($("#fechaInicioDocNivVehMaq").val().length > 0 && $("#fechaFinDocNivVehMaq").val().length > 0){
       listEstadosEvaluacionId = [];
       controlVehMaq.leerFiltroDelModal();

       var estadoEvaluacionId = $("#filtroEstadosEvaluacionDocNivVehMaq").val();
       
       if(estadoEvaluacionId != null){
          estadoEvaluacionId.forEach(function(val){
             listEstadosEvaluacionId.push(parseInt(val));
          });
       }
       
       verRegistrosDocumentoNivelVehiculoMaquinaria();
   }else{
	mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroDocNivelVehMaq").modal("show");
	});
   }
}

function verRegistrosDocumentoNivelVehiculoMaquinaria(){
   var dataParam={
      contratistaId: parseInt(getSession("contratistaGosstId")),tipoDocumentoVehiculoMaquinariaId: tipoDocVehMaqId,
      fechaRegistroInicio: $("#fechaInicioDocNivVehMaq").val(),fechaRegistroFin: $("#fechaFinDocNivVehMaq").val(),
      listEstadoEvaluacionId: (listEstadosEvaluacionId.length == 0?null:listEstadosEvaluacionId),
      filtroVigencia: controlVehMaq.parametros().filtroVigencia,busqueda: controlVehMaq.parametros().busqueda,pagina: controlVehMaq.parametros().pagina
   };

   controlVehMaq.cargando = true;

    
   callAjaxPost(URL+'/contratista/documento_nivel_vehiculo_maquinaria',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listDocumentosNivelVehMaq = data.listDocumentosNivelVehMaq;
            controlVehMaq.guardarRespuesta(data);
            
  	    var listPanelesPrincipal = [],textDocNivelVehMaq = "";
  	    
  	    $(".divListPrincipal").html("");
  	     
  	    listDocumentosNivelVehMaq.forEach(function(val,index){
 	       var btnOpcion = "",menuOpcion = "";
 	       
 	       if(val.evaluacion.nota.id != 1){
	          menuOpcion = "<ul class='list-group listaFinalGestionGosst'>"; 
	             funcionalidadesRegistrosDocumentoNivelVehiculoMaquinaria.forEach(function(val1,index1){
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionRegistrosDocumentoNivelVehiculoMaquinaria("+index1+")'>" +
				          val1.nombre +
				      "</li>";
	             });		    
	          menuOpcion += "</ul>";
				    
	          btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionRegistrosDocumentoNivelVehiculoMaquinaria(this,"+index+")'>" +
			         "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			      "</a>";
 	       }
	       
	       var enlaceEvidencia =  (val.evidenciaNombre == ""?"------":
                  "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/documento_nivel_vehiculo_maquinaria/evidencia?id="+val.id+"'>"+
		      val.evidenciaNombre +
		  "</a>");
	       
	       var enlaceAuxiliar = (val.evidenciaAuxiliarNombre.trim().length == 0?"------":
		   "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/documento_nivel_vehiculo_maquinaria/evidencia_auxiliar?id="+val.id+"'>" +
		        val.evidenciaAuxiliarNombre +
		   "</a>");
 	       
 	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
 		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CÓDIGO "+val.codigo+" ***</span>"+controlVehMaq.etiquetaFutura(val)},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-user'></i> Placa:",inputForm:val.vehiculoMaquinaria.placa},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-id-card'></i> Tipo de licencia:",inputForm:val.tipoLicenciaConductor.nombre},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
 	           label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DATOS DEL REGISTRO ***</span>"},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Inicio vigencia del registro:",inputForm:val.fechaInicioVigenciaTexto},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fin vigencia del registro:",inputForm:val.fechaFinVigenciaTexto},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Evidencia:",inputForm:enlaceEvidencia}
 	       ];
	       
	       if([3,10].includes(tipoDocVehMaqId)){
		   listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Comprobante de pago:",inputForm:enlaceAuxiliar});
	       }
	       
	       listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 		  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	           label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EVALUACIÓN ***</span>"},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:val.evaluacion.nota.icono+" Estado:",inputForm:val.evaluacion.nota.nombre});
 	       
 	       if(![3,4].includes(val.evaluacion.nota.id)){
 		  if(val.evaluacion.nota.id != 1){ 
 		     listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Observación:",inputForm:val.evaluacion.observacion});  
 		  }
 		  
 		  listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Evaluado el",inputForm:val.evaluacion.fechaTexto});
 	       }
 	       		
 	       textDocNivelVehMaq += "<div class='eventoGeneral'>" +
 	                                "<form class='eventoGeneral'>";	
 	          listTotal.forEach(function(val,index){
 	             textDocNivelVehMaq += obtenerSubPanelModuloVersionDos(val);
 	          });
 	       textDocNivelVehMaq +=    "</form>" +
 		                     "</div>";
 	    });
  	    	  				
     	    listPanelesPrincipal.push(
     	       {id: "registroMovilDocNivelVehMaq",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroDocumentoNivelVehiculoMaquinaria(0)",
            	btnIconoAux:"fa-pencil",btnTitleAux:"Registrar nuevo documento",nombre:"Nuevo registro de "+tipoDocVehMaqNombre,contenido:""},
               {id: "opcionesDocNivelVehMaq",clase:"",styleAux:"",buttonAd:controlVehMaq.htmlBotonFiltro("verFiltroRegistrosDocumentoNivelVehiculoMaquinaria"),btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Opciones<span style='display:inline-block;margin-left:15px;font-size:14px;font-weight:bold;'>("+
    		controlVehMaq.textoEncabezado("Desde "+convertirFechaNormal($("#fechaInicioDocNivVehMaq").val())+" al "+convertirFechaNormal($("#fechaFinDocNivVehMaq").val()))+")</span>",
    		contenido:""},
               {id: "buscadorDocNivelVehMaq",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Buscar vehículo o maquinaria",contenido:controlVehMaq.htmlBuscador()},
               {id: "infoMovilDocNivelVehMaq",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:tipoDocVehMaqNombre+" registrados ("+controlVehMaq.totalRegistros(listDocumentosNivelVehMaq)+")",
    		contenido:controlVehMaq.htmlPaginacion()+controlVehMaq.htmlAvisoPanel()+textDocNivelVehMaq});

			
	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);

            // «Opciones» y el buscador no se pliegan: sin boton de plegar; «Opciones» muestra solo su titulo con el boton del filtro
            controlVehMaq.restaurarBusqueda();
            controlVehMaq.actualizarOpciones();
            $("#opcionesDocNivelVehMaq,#buscadorDocNivelVehMaq").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
            $("#opcionesDocNivelVehMaq").children(".contenidoSubList").hide();
            $("#buscadorDocNivelVehMaq").children(".contenidoSubList").show();
  			
     	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
     	    
     	    break;
  	     
         default:
  	    alert("nop");
         
  	    break;
      }
   },null,null,null,function(){
      controlVehMaq.terminarCarga();
   });
}

var listTipoVigencia = [];

function ocultarRegistroDocumentoNivelVehiculoMaquinaria(){
   $("#modalRegistroDocNivelVehMaq").modal("hide");
}

function registroDocumentoNivelVehiculoMaquinaria(opcionId){
   $("#modalRegistroDocNivelVehMaq").remove();  
   
   docNivelVehMaqId = (parseInt(opcionId) == 0?0:docNivelVehMaqObj.id);
   
   if(parseInt(getSession("gestopcompanyid")) == 775 && tipoDocVehMaqId == 5){
	   listTipoVigencia = [{id:6,nombre:"Indeterminado",duracionMeses:1200}];
   }else if(tipoDocVehMaqId == 6){
       listTipoVigencia = [{id:3,nombre:"6 meses",duracionMeses:6},{id:4,nombre:"1 año",duracionMeses:12}];  
   }else{
       listTipoVigencia = [(tipoDocVehMaqId == 1?{id:2,nombre:"3 meses",duracionMeses:3}:{id:4,nombre:"1 año",duracionMeses:12})];  
   }
   
   var selTipoVigenciaDocNivelVehMaq = crearSelectOneMenuOblig("selTipoVigenciaDocNivelVehMaq","hallarFechaFinVigenciaDocNivelVehiculoMaquinaria()",
      listTipoVigencia,(docNivelVehMaqId == 0?"":docNivelVehMaqObj.tipoVigenciaId),"id","nombre");
 	     
   var contenido = "";
				
   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",label:"Vehículo/Maquinaria",
       inputForm:"<input type='text' id='inputVehiculoMaquinariaDocNivelVehMaq' class='form-control'>" +
		 "<div id='divAutoCompletarVehiculoMaquinariaDocNivelVehMaq'></div>" + 
		 "<label>*Buscar vehículo/maquinaria por placa (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha inicio vigencia del registro",
       inputForm:"<input id='inputFechaInicioVigDocNivelVehMaq' class='form-control' type='date' " +
       		        "onchange='hallarFechaFinVigenciaDocNivelVehiculoMaquinaria()'>"}, 
      {sugerencia:"<label>(aproximado)</label>",anchoLabel:"",anchoDiv:"",label:"Vigencia",inputForm:selTipoVigenciaDocNivelVehMaq},  
      {sugerencia:"<label>*Nota: Si su documento vence antes de la fecha fin asignada por defecto, modifique la fecha fin para que coincida. " +
       "Si vence después, mantenga la fecha fin predeterminada.</label>",anchoLabel:"",anchoDiv:"",label:"Fecha fin vigencia del registro*",
       inputForm:"<input id='inputFechaFinVigDocNivelVehMaq' class='form-control' type='date'>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia",inputForm:"",divContainer:"eviDocNivelVehMaq"}
   ];
   
   if([3,10].includes(tipoDocVehMaqId)){
       listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Comprobante de pago",inputForm:"",divContainer:"eviDocAuxiliarNivelVehMaq"});
   }

   listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarRegistroDocumentoNivelVehiculoMaquinaria()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
	      		 "onclick='guardarRegistroDocumentoNivelVehiculoMaquinaria()'>" +
	            "<i class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"});
				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 		
   var modalOptions={
      id: "modalRegistroDocNivelVehMaq",
      nombre: "<i class='fa fa-pencil'></i> Registro "+tipoDocVehMaqNombre,
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   var optionEvidencia={
      container: "#eviDocNivelVehMaq",isImage: false,
      idAux: "DocNivelVehMaq",evidenciaNombre: (docNivelVehMaqId == 0?"":docNivelVehMaqObj.evidenciaNombre),
      esNuevo: (docNivelVehMaqId == 0 || docNivelVehMaqObj.evidenciaNombre.length == 0?true:false),
      functionCall: function(){
         validacionSubirEvidencia("DocNivelVehMaq",bitsEvidenciaDocumento,"modalRegistroDocNivelVehMaq");
      },descargaUrl: "/contratista/amazon_s3/documento_nivel_vehiculo_maquinaria/evidencia?id="+docNivelVehMaqId
   };
	 			
   crearFormEvidenciaCompleta(optionEvidencia);
   
   if([3,10].includes(tipoDocVehMaqId)){
       var textoEviAux = (parseInt(getSession("gestopcompanyid")) != 773?"[Opcional].":"");
       
       var optionEvidenciaAux={
	   container:"#eviDocAuxiliarNivelVehMaq",idAux:"DocAuxNivelVehMaq",mensajeAux:textoEviAux,
	   evidenciaNombre:(docNivelVehMaqId == 0?"":docNivelVehMaqObj.evidenciaAuxiliarNombre),
	   esNuevo: (docNivelVehMaqId == 0 || docNivelVehMaqObj.evidenciaAuxiliarNombre.length == 0?true:false),
	   functionCall:function(){
	       validacionSubirEvidencia("DocAuxNivelVehMaq",bitsEvidenciaDocumento,"modalRegistroDocNivelVehMaq");
	   },descargaUrl:"/contratista/amazon_s3/documento_nivel_vehiculo_maquinaria/evidencia_auxiliar?id="+docNivelVehMaqId
       };
	 	 			
       crearFormEvidenciaCompleta(optionEvidenciaAux);
   }
   
   if(docNivelVehMaqId > 0){
      $("#inputVehiculoMaquinariaDocNivelVehMaq").val(docNivelVehMaqObj.vehiculoMaquinaria.placa);
      $("#inputFechaInicioVigDocNivelVehMaq").val(convertirFechaInput(docNivelVehMaqObj.fechaInicioVigencia));
      $("#inputFechaFinVigDocNivelVehMaq").val(convertirFechaInput(docNivelVehMaqObj.fechaFinVigencia));
   }else{
      var hoy = getSession("fechaHoyOrdenInversoTexto");
       
      $("#inputFechaInicioVigDocNivelVehMaq").val(hoy); 
      
      hallarFechaFinVigenciaDocNivelVehiculoMaquinaria();
   }
   
   verAutoCompletarVehiculoMaquinariaDocNivelVehMaq();
}

var listVehiculosMaquinariasBuscadorAux = [];

function verAutoCompletarVehiculoMaquinariaDocNivelVehMaq(){
   var vehiculoMaquinaria = $("#inputVehiculoMaquinariaDocNivelVehMaq").val().trim();

   if(vehiculoMaquinaria.length >= 3){
      var dataParam={
	 placa: "%"+vehiculoMaquinaria+"%",isBuscador: 1,contratistaId: parseInt(getSession("contratistaGosstId"))
      };

      callAjaxPostNoLoad(URL+"/contratista/vehiculo_maquinaria/buscar/simple",dataParam,function(data){
	 listVehiculosMaquinariasBuscadorAux = (data.vehiculosMaquinarias.length == 0?[{id: -1,placa: "Sin asignar"}]:data.vehiculosMaquinarias);
    	  
    	 var selAutoVehiculoMaquinariaDocNivelVehMaq = crearSelectOneMenuOblig("selAutoVehiculoMaquinariaDocNivelVehMaq","",
    	    listVehiculosMaquinariasBuscadorAux,"","id","placa");
	
    	 $("#divAutoCompletarVehiculoMaquinariaDocNivelVehMaq").html(selAutoVehiculoMaquinariaDocNivelVehMaq);
	 $("#inputVehiculoMaquinariaDocNivelVehMaq").attr("onkeyup","verAutoCompletarVehiculoMaquinariaDocNivelVehMaq()");
      });
   }else{
      listVehiculosMaquinariasBuscadorAux = [{id: -1,placa: "Sin asignar"}];
	     
      var selAutoVehiculoMaquinariaDocNivelVehMaq = crearSelectOneMenuOblig("selAutoVehiculoMaquinariaDocNivelVehMaq","",
	 listVehiculosMaquinariasBuscadorAux,"","id","placa");
	    		       
      $("#divAutoCompletarVehiculoMaquinariaDocNivelVehMaq").html(selAutoVehiculoMaquinariaDocNivelVehMaq);
      $("#inputVehiculoMaquinariaDocNivelVehMaq").attr("onkeyup","verAutoCompletarVehiculoMaquinariaDocNivelVehMaq()");
   }
}

function hallarFechaFinVigenciaDocNivelVehiculoMaquinaria(){
   var fechaInicioVigencia = $("#inputFechaInicioVigDocNivelVehMaq").val(),vigenciaId = parseInt($("#selTipoVigenciaDocNivelVehMaq").val()),
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
     
   $("#inputFechaFinVigDocNivelVehMaq").val(fechaFinVigencia);
}

function eliminarRegistroDocumentoNivelVehiculoMaquinaria(){
   mensajeUx="<label>¿Está seguro de eliminar el registro vehículo/maquinaria seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocNivelVehMaq");

   $("#btnDevolverValorEliminarDocNivelVehMaq").on("click",function(){
      var dataParam={
         id: docNivelVehMaqObj.id,bucketNombre: BUCKETAMAZONS3 
      };

      callAjaxPost(URL+'/contratista/documento_nivel_vehiculo_maquinaria/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
 	       mensajeUx = "<label>El registro "+tipoDocVehMaqNombre+" fue eliminado con éxito.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarDocNivelVehMaq"); 
 								   
 	       $("#modalMensajeUxActualizarDocNivelVehMaq").on("hidden.bs.modal",function(){
 		  verRegistrosDocumentoNivelVehiculoMaquinaria();  
 	       });
 	       
               break;
			
            default:
               alert("Ocurrió un error al eliminar el registro "+tipoDocVehMaqNombre);
         }
      });
   });
}

function guardarRegistroDocumentoNivelVehiculoMaquinaria(){
   var campoVacio = true;
   
   var vehiculoMaquinariaId = parseInt($("#selAutoVehiculoMaquinariaDocNivelVehMaq").val());
   var fechaInicioVigencia = convertirFechaTexto($("#inputFechaInicioVigDocNivelVehMaq").val());
   var inputFechaInicioVigencia = (!fechaInicioVigencia?null:fechaInicioVigencia);
   var tipoVigenciaId = parseInt($("#selTipoVigenciaDocNivelVehMaq").val());
   var fechaFinVigencia = convertirFechaTexto($("#inputFechaFinVigDocNivelVehMaq").val());
   var inputFechaFinVigencia = (!fechaFinVigencia?null:fechaFinVigencia);
   var evidenciaNombre = $("#inputEviDocNivelVehMaq").val();
   
   var habilitarEviAux = ([3,10].includes(tipoDocVehMaqId)?1:0);
   
   var evidenciaAuxNombre = $("#inputEviDocAuxNivelVehMaq").val();
       
   if(vehiculoMaquinariaId == -1 || inputFechaInicioVigencia == null || inputFechaFinVigencia == null || 
      evidenciaNombre.length == 0){
      mensajeUx = "<label>Debe completar todos los campos.</label>";campoVacio = false;  
   }else if(evidenciaNombre == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";campoVacio = false;   
   }else if(habilitarEviAux == 1 && evidenciaAuxNombre == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir el comprobante de pago.</label>";campoVacio = false;   
   }else{
      var numDiasVigencia = restaFechas($("#inputFechaInicioVigDocNivelVehMaq").val(),$("#inputFechaFinVigDocNivelVehMaq").val()),
          numDiasVigenciaActual = restaFechas(getSession("fechaHoyOrdenInversoTexto"),$("#inputFechaFinVigDocNivelVehMaq").val());
	  
      if(numDiasVigencia < 0){
 	 mensajeUx = "<label>La fecha fin vigencia del registro no puede ser menor que la fecha inicio vigencia del registro.</label>";campoVacio = false; 
      }else if(numDiasVigenciaActual < 0){ 
         mensajeUx = "<label>La fecha fin vigencia del registro no puede ser menor a la fecha de hoy.</label>";campoVacio = false;  
      }
   }
    
   if(campoVacio){
      var dataParam={
	 id: docNivelVehMaqId,vehiculoMaquinariaId: vehiculoMaquinariaId,tipoDocumentoVehiculoMaquinariaId: tipoDocVehMaqId,
	 fechaInicioVigencia: inputFechaInicioVigencia,tipoVigenciaId: tipoVigenciaId,fechaFinVigencia: inputFechaFinVigencia,
	 contratistaId: parseInt(getSession("contratistaGosstId"))
      };
      
      callAjaxPostSimpleVersionDos(1,URL+'/contratista/documento_nivel_vehiculo_maquinaria/save',dataParam,1,0,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":  
	       guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviDocNivelVehMaq",bitsEvidenciaDocumento,0,0,
	       "/contratista/amazon_s3/documento_nivel_vehiculo_maquinaria/evidencia/save","vehiculo-maquinaria-has-tipo-documento-vehiculo-maquinaria/evidencia",function(){
	         guardarEvidenciaAutoVersionS3(habilitarEviAux,data.nuevoId,"fileEviDocAuxNivelVehMaq",bitsEvidenciaDocumento,0,1,
                 "/contratista/amazon_s3/documento_nivel_vehiculo_maquinaria/evidencia_auxiliar/save","vehiculo-maquinaria-has-tipo-documento-vehiculo-maquinaria/evidencia-auxiliar",function(){
	             $("#modalRegistroDocNivelVehMaq").modal("hide");	
		
	             mensajeUx = "<label>El registro "+tipoDocVehMaqNombre+" fue guardado con éxito.</label>";
	             mensajesUx(mensajeUx,1,"","ActualizarDocNivelVehMaq"); 
								   
	             $("#modalMensajeUxActualizarDocNivelVehMaq").on("hidden.bs.modal",function(){
	                 verRegistrosDocumentoNivelVehiculoMaquinaria();  
	             });
		 });
	       });
		
	       break;
						
	    default:
	       alert("Ocurrió un error al guardar el registro "+tipoDocVehMaqNombre);
	 }
      });	
   }else{
      $("#modalRegistroDocNivelVehMaq").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionDocNivelVehMaq");
      
      $("#modalMensajeUxValidacionDocNivelVehMaq").on("hidden.bs.modal",function(){
	 $("#modalRegistroDocNivelVehMaq").modal("show");
      });
   }	
}
