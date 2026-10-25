var objInduccionVirtual={};
var listInduccionesVirtualesContratista=[];
var listTrabajadoresInduccionVirtual=[];
var listTipoInduccionVirtual=[];
var listInduccionVirtualMovil=[];
var listTipoNotaInduccionVirtual=[];
var listEstadosEvaluacionId=[];
var mensajeUx = "";

function toggleMenuOpcionInduccionVirtual(obj,pindex){
   objInduccionVirtual = listInduccionesVirtualesContratista[pindex]; 
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesInduccionVirtual=[ 
   {id:"opcEditar",nombre:"<i class='fa fa-upload'></i> Subir cargo firmar",
	functionClick:function(data){uploadCargoInduccionVirtual()}},
   // {id:"opcElimnar", nombre:"Eliminar",functionClick:function(data){eliminarInduccionVirtual()}  }
];

function marcarSubOpcionInduccionVirtual(pindex){
   funcionalidadesInduccionVirtual[pindex].functionClick();
	
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function ocultarFiltroInduccionesVirtuales(){
   $("#modalFiltroInduccionVirtual").modal("hide");
}

function verFiltroInduccionesVirtuales(){
   $("#modalFiltroInduccionVirtual").modal("show");
}

function crearFiltroInduccionesVirtuales(functionCallBack){
   $("#modalFiltroInduccionVirtual").remove();
	
   var dataParam={}; 
	  		
   callAjaxPost(URL+'/contratista/inducciones_virtuales/contratista/filtro',dataParam,function(data){
      listTipoNotaInduccionVirtual = data.listTipoNota;
	      
      var contenido = "";
  				
      var listContenido=[
         {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
          label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
		           "*** STATUS INDUCCIÓN VIRTUAL ***" +
		        "</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},   
         {sugerencia:"",label:"Fecha - Inicio",
          inputForm:"<input type='date' id='fechaInicioInduccVirtual' class='form-control'>"},
         {sugerencia:"",label:"Fecha - Fin",
	  inputForm:"<input type='date' id='fechaFinInduccVirtual' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}, 
         {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
	  label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
		   "*** CARGO ***" +
	        "</span>"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},  
         {sugerencia:"",label:"Estado de la evaluación",inputForm:"",
          divContainer:"divFiltroEstadosEvalInduccVirtual"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}, 
  	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		        "onclick='ocultarFiltroInduccionesVirtuales()'>" +
               	   "<i class='fa fa-times'></i> Cancelar" +
               	"</button>",
  	  inputForm:"<button id='btnAplicarFiltroExamContratista' class='btn btn-success' type='submit' " +
  	      		    "onclick='valoresFiltroInduccionesVirtuales()' style='float:right;font-size:18px;'>" +
  	               "<i class='fa fa-filter'></i> Aplicar" +
  	            "</button>"}
      ]; 
  				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
   
      var modalOptionsDocPerExt={
 	 id: "modalFiltroInduccionVirtual",
 	 nombre: "<i class='fa fa-filter'></i> Filtros",
  	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
  				
      crearModalPrincipalUsuario(modalOptionsDocPerExt,function(){
         if($("#filtroEstadosEvalInduccVirtual").length > 0){
	    return;
	 }
	                   
	 crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvalInduccVirtual","",listTipoNotaInduccionVirtual,
	    "id","nombre","#divFiltroEstadosEvalInduccVirtual","Todos");
      },true,true);
   
      var hoy = getSession("fechaHoyOrdenInversoTexto");
   
      $("#fechaInicioInduccVirtual").val(sumaFechaDias(-360,hoy));
      $("#fechaFinInduccVirtual").val(sumaFechaDias(90,hoy));
  				
      functionCallBack();
   });
}

function valoresFiltroInduccionesVirtuales(){
   ocultarFiltroInduccionesVirtuales();
	
   if($("#fechaInicioInduccVirtual").val().length > 0 && $("#fechaFinInduccVirtual").val().length > 0){
       listEstadosEvaluacionId = [];
       
       var estadoEvaluacionId = $("#filtroEstadosEvalInduccVirtual").val(); 
       
       if(estadoEvaluacionId != null){
          estadoEvaluacionId.forEach(function(val){
             listEstadosEvaluacionId.push(parseInt(val));
          });
       }
       
       habilitarInduccionesVirtuales();
   }else{
	mensajeUx="<label>Debe ingresar la 'Fecha - Inicio' y 'Fecha - Fin' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroInduccionVirtual").modal("show");
	});
   }
}

function ocultarCargoInduccionVirtual(){
   $("#modalUploadIndVirtual").modal("hide");
}

function uploadCargoInduccionVirtual(){
   $("#modalUploadIndVirtual").remove();	
	
   var contenido = "";
   
   var hrefContenido = "/empresa/documento/evidencia?id="+getSession("gestopcompanyid") +
      "&tipoId="+(objInduccionVirtual.examen.tipo.id == 3?7:16);
	
   var asd=[
      {sugerencia:"",label:"Plantilla cargo para firmar",
       inputForm:
          "<a class='efectoLink' href='"+URL+hrefContenido+"' target='blank'>" +
	     "<i class='fa fa-download'></i> Descargar" +
	  "</a>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Cargo firmado",inputForm:"",divContainer:"divEviCargoVirtual"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	             "onclick='ocultarCargoInduccionVirtual()'>" +
	        "<i class='fa fa-times'></i> Cancelar" +
	     "</button>",
       inputForm:"<button onclick='guardarEvidenciaCargoInduccionVirtual()' class='btn btn-success' " +
	   		 "style='float:right;font-size:18px;'>" +
	            "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"}
   ];
	   			
   var textFormExamen = "";
	   			
   asd.forEach(function(val,index){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
	
   var modalOptions={
      id:"modalUploadIndVirtual",
      nombre:"<i class='fa fa-upload fa-lg'></i> Subir Cargo",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	
   var options={
      container:"#divEviCargoVirtual",
      functionCall:function(){
         validacionSubirEvidencia("InduccionVirtual",bitsEvidenciaExamen,"modalUploadIndVirtual");
      },
      descargaUrl:"/contratista/amazon_s3/induccion_virtual/trabajador_contratista/evidencia/cargo?id="+objInduccionVirtual.id,
      esNuevo:(objInduccionVirtual.evidenciaCargoNombre.length == 0?true:false),
      idAux:"InduccionVirtual",evidenciaNombre:objInduccionVirtual.evidenciaCargoNombre
   };
	
   crearFormEvidenciaCompleta(options);
}

function guardarEvidenciaCargoInduccionVirtual(){
    var campoVacio = true;
	
    var nombreEvidencia = $("#inputEviInduccionVirtual").val();
	
    if(nombreEvidencia.length == 0){
        mensajeUx = "<label>Debe subir la evidencia.</label>";
        campoVacio = false;
    }else if(nombreEvidencia == "VOLVER A SUBIR"){
        mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
        campoVacio = false;
    }
   
    if(campoVacio){
        guardarEvidenciaAutoVersionS3(1,objInduccionVirtual.id,"fileEviInduccionVirtual",bitsEvidenciaExamen,
        1,1,"/contratista/amazon_s3/induccion_virtual/trabajador_contratista/evidencia/cargo/save","contratista-has-examen-trabajador/evidencia-cargo",function(){
    	    $("#modalUploadIndVirtual").modal("hide");
    	 
    	    mensajeUx = "<label>El cargo de guardó con éxito.</label>";
            mensajesUx(mensajeUx,1,"","ActualizarCargo");
					
            $("#modalMensajeUxActualizarCargo").on("hidden.bs.modal",function(){
                habilitarInduccionesVirtuales();
            });
        });
    }else{
        $("#modalUploadIndVirtual").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionCargo");
	  
        $("#modalMensajeUxValidacionCargo").on("hidden.bs.modal",function(){
            $("#modalUploadIndVirtual").modal("show");
        });
    }
}

function verAcordeInduccionVirtual(){
   var induccionId = parseInt($("#selInduccionVirtual").val());
	
   listInduccionVirtualMovil.forEach(function(val){
      if(induccionId == val.id){
         $("#divVigenciaInduccionVirtual").html(val.vigencia.nombre);
         $("#divEnlaceInduccionVirtual").html(
            "<a class='efectoLink' href='"+val.link+"' target='_blank'>Link #1</a>");
			
         cursoExamenActual={ 
	    id:val.curso.id,nombre:val.curso.nombre,tiempoSolucion:val.curso.tiempoSolucion,
	    numPreguntas:val.curso.numPreguntas,puntajeMinimo:val.curso.puntajeMinimo,
	    isForInduccion:1,evaluacion: {id:0,numIntentos:0},aplicarCategoria:curso.aplicarCategoria,
	    numPreguntasCategoria1:curso.numPreguntasCategoria1,numPreguntasCategoria2:curso.numPreguntasCategoria2,
	    numPreguntasCategoria3:curso.numPreguntasCategoria3
         };
      }
   });
}

function habilitarInduccionesVirtuales(){
   var dataParam={
      id: parseInt(getSession("contratistaGosstId")),
      fechaInicioRegistro: $("#fechaInicioInduccVirtual").val(),
      fechaFinRegistro: $("#fechaFinInduccVirtual").val(),
      listTipoNotaId: (listEstadosEvaluacionId.length == 0?null:listEstadosEvaluacionId)
   };
	
   $("#modalUploadIndVirtual").modal("hide");$("#modalUploadIndVirtual").remove();
	
   objInduccionVirtual = {id: 0};
	
   var listPanelesPrincipal = [];
	
   callAjaxPost(URL+'/contratista/inducciones_virtuales/contratista',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            var textIn = "";
            var textSinAtender = "",textAtenderSinRespuesta = "",textAtenderConRespuesta = "";
            var numSin = 0,numConSinRespuesta = 0,numConConRespuesta = 0;
			
	    listInduccionesVirtualesContratista = data.list;
	    listTrabajadoresInduccionVirtual = data.trabajadores;
	    listInduccionVirtualMovil = data.inducciones;
			
	    $(".divListPrincipal").html("");
			
	    var selInduccionVirtual = crearSelectOneMenuOblig("selInduccionVirtual","verAcordeInduccionVirtual()",
	       listInduccionVirtualMovil,"","id","tema");
			
	    var listItemsExam=[
	       {sugerencia:"",label:"Trabajador que llevará la inducción",inputForm:"",divContainer:"divSelTrabIndVirt"},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",label:"Elegir inducción",inputForm: selInduccionVirtual},
	       {sugerencia:"",label:"Vigencia",inputForm:"",divContainer:"divVigenciaInduccionVirtual"},
//             {sugerencia:"",label:"Enlace a video de inducción",inputForm:"",divContainer:"divEnlaceInduccionVirtual"}, 
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
       	       {sugerencia:"",label:"",
		inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
			     "<i aria-hidden='true' class='fa fa-pencil-square-o'></i> Empezar evaluación" +
			  "</button>"}, 
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
	        label:"* Una vez aprobada la inducción, no olvide subir el cargo de inducción virtual.",inputForm:"",divContainer:""}
	    ];
			
	    var textFormExamen = "";
			
	    textFormExamen += "<div class='eventoGeneral'>";
	       listItemsExam.forEach(function(val,index){
	          textFormExamen += obtenerSubPanelModuloVersionDos(val);
	       });
	    textFormExamen += "</div>";
			
	    var textTotal = "";
			
	    listInduccionesVirtualesContratista.forEach(function(val,index){
	       var btnOpcion = "",menuOpcion = "";	
				
	       if(val.evaluacionCargo.id != 1){
	          menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
		     funcionalidadesInduccionVirtual.forEach(function(val1,index1){
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionInduccionVirtual("+index1+")'>" +
				          val1.nombre +
				      "</li>";
		     });
		  menuOpcion += "</ul>";
				
		  btnOpcion = 
		     "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionInduccionVirtual(this,"+index+")'>" +
		        "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
		     "</a>";
	       }
			   
	       var nombreCompleto = (val.trabajador.apellido.length == 0 && val.trabajador.nombre.length == 0?"------":
                     ((val.trabajador.apellido.length == 0?"":val.trabajador.apellido+", ")+(val.trabajador.nombre.length == 0?"":val.trabajador.nombre))),
	           resultado = (val.puntajeAlcanzadoSobreVeinte == -1?val.evaluacion.nombre:val.evaluacion.nombre+" ("+val.puntajeAlcanzadoSobreVeinte+")"),
               nombreEvi = (val.evidenciaCargoNombre.length == 0?"------":"<a href='"+URL+"/contratista/amazon_s3/induccion_virtual/trabajador_contratista/evidencia/cargo?id="+val.id+"' " +
                   "target='_blank' class='efectoLink'>"+val.evidenciaCargoNombre+"</a>");

	       var listTotal=[
		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>"+"*** DATOS GENERALES ***"+"</span>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	          {sugerencia:"",label:"<i class='fa fa-user'></i> Trabajador:",inputForm:nombreCompleto},
	          {sugerencia:"",label:"<i class='fa fa-list'></i> Inducción:",inputForm:val.cursoNombre},
	          {sugerencia:"",label:"<i class='fa fa-info-circle'></i> Tipo:",inputForm:val.examen.tipo.nombre},
	          {sugerencia:"",label:"<i class='fa fa-book'></i> Tema:",inputForm:val.capacitacionAsociadaTema},
	          {sugerencia:"",label:"<i class='fa fa-calendar'></i> Fecha y hora:",inputForm:val.fechaRegistroTexto},
	          {sugerencia:"",label:val.evaluacion.icono+" Resultado:",inputForm:resultado},
	          {sugerencia:"",label:"<i class='fa fa-calendar'></i> Fecha fin de vigencia:",inputForm:val.evaluacion.fechaFinVigenciaTexto},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>"+"*** CARGO ***"+"</span>"},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		  {sugerencia:"",label:"<i class='fa fa-download'></i> Evidencia",inputForm:nombreEvi}
	       ];
	       
 	       if(val.evidenciaCargoNombre.length != 0 || val.fechaEvaluacionTexto.length != 0){
 		  listTotal.push({sugerencia:"",label:val.evaluacionCargo.icono+" Evaluación",inputForm:val.evaluacionCargo.nombre});  
 	       }     
	       
	       if([2,3].includes(val.evaluacionCargo.id) && val.evaluacionCargo.observacion.length != 0){
		  var textObservacion = (val.evaluacionCargo.observacion.length == 0?"------":val.evaluacionCargo.observacion); 
			    	  
		  listTotal.push({sugerencia:"",label:"<i class='fa fa-exclamation-circle'></i> Observación",inputForm:textObservacion});
	       }  
	       
	       if([1,2].includes(val.evaluacionCargo.id) && val.fechaEvaluacionTexto.length != 0){
		  var evaluacionDetalle = (val.fechaEvaluacionTexto.length == 0?"------":val.fechaEvaluacionTexto +
		     (val.evaluacionCargo.usuario.userName.length == 0?"":"<br>(Por "+val.evaluacionCargo.usuario.userName+")"));
		   
	          listTotal.push({sugerencia:"",label:"<i class='fa fa-calendar'></i> Evaluado el",inputForm:evaluacionDetalle}); 
	       }
	       
	       var estiloGosst = (val.evaluacionCargo.id == 1?"gosst-aprobado":(val.evaluacionCargo.id == 2?"gosst-desaprobado":"gosst-advertencia"));
	       
	       textTotal += "<div class='eventoGeneral "+estiloGosst+"'>" +
			       "<div class='eventoGeneral'>";
	          listTotal.forEach(function(val,index){
	   	     textTotal += obtenerSubPanelModuloVersionDos(val);
	          });
	       textTotal +=    "</div>" +
	   		    "</div>";
	    });
			
	    var btnFiltro = 
	       "<button type='button' id='btnFiltroInduccVirtual' class='btn btn-success' " +
		       "style='padding:4px 6px;margin-right:10px' onclick='verFiltroInduccionesVirtuales()' " +
		       "title='Ver valores del filtro para aplicarlo a esta sección.'>" +
                  "<i class='fa fa-filter fa-4x'></i>" +
	       "</button>";
			
	    var btnConsolidado = 
	       "<button type='button' id='btnConsolidadoInduccVirtual' class='btn btn-success' " +
		       "style='padding:4px 6px;margin-right:10px' onclick='verConsolidadoInduccionVirtual()' " +
		       "title='Ver los registros por medio de un consolidado.'>" +
	          "<i class='fa fa-table fa-4x'></i>" +
               "</button>";
			
     	    listPanelesPrincipal=[
//               {id:"nuevaMovilInduccionVirtual",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"fa-list",
//		btnTitleAux:"",nombre:"Nuevo registro de Inducción virtual",
//		contenido:"<form id='formNuevaInduccionVirtual' class='eventoGeneral'>"+textFormExamen+"</form>"},
               {id:"infoMovilEnlaceInduccionVirtual",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verEnlaceAccesoTrabajadorContratista()",
        	btnIconoAux:"fa-slideshare",btnTitleAux:"Obtener el enlace",nombre:"Acceso a la inducción virtual (trabajadores)",contenido:""},
	       {id:"infoMovilInduccionVirtual",clase:"",styleAux:"",buttonAd:btnFiltro+btnConsolidado,btnOnclickAux:"",btnIconoAux:"",
		btnTitleAux:"",nombre:"Status inducciones virtuales registradas ("+listInduccionesVirtualesContratista.length+")",
		contenido:textTotal}
	    ];
			
     	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
			
	    listPanelesPrincipal=[
 	       {id:"cursoPreguntasExamenMovil",clase:"",styleAux:"display:none",buttonAd:"",nombre:""},
 	       {id:"cursoResultadoExamenMovil",clase:"",styleAux:"display:none",buttonAd:"",nombre:""}
            ];

            agregarPanelesDivPrincipalVersionDosSinContenido(listPanelesPrincipal);
			
            $("#cursoPreguntasExamenMovil").hide();$("#cursoResultadoExamenMovil").hide();
			
            verAcordeInduccionVirtual();
			
            crearSelectOneMenuObligUnitarioCompleto("selTrabajadorInduccionVirtual","",
	       listTrabajadoresInduccionVirtual,"trabajadorId","nombre","#divSelTrabIndVirt");
			 
            $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
            $("#nuevaMovilInduccionVirtual .contenidoSubList").hide();
			 
            $('#formNuevaInduccionVirtual').on('submit',function(e){  
	       e.preventDefault();
	       verModalConfirmarEmpezarVirtual();
            });
			 
            break;
			
         default:
	    alert("nop");
				
            break;
      }
   });
}

function verModalConfirmarEmpezarVirtual(){
   $("#modalConfirmarCursoVirtual").remove();  
    
   var opciones={
      id:"modalConfirmarCursoVirtual",nombre:"Confrmar",
      contenido:
	 "<div class='eventoGeneral'>"+
            "<div style='width:100%;text-align:center;'>" +
               "El siguiente curso dura <strong>"+cursoExamenActual.tiempoSolucion*60+" minuto(s)</strong>, ¿Desea comenzar?" +
            "</div>" +
	    "<div style='width:100%;display:inline-block;margin-top:10px;'>" +
	       "<div style='width:50%;text-align:center;float:left;'>" +
	          "<button onclick='cancelarEmpezarCursoVirtual()' class='btn btn-danger' style='font-size:18px;'>" +
	             "<i aria-hidden='true' class='fa fa-times'></i> Cancelar" +
	          "</button>" +
	       "</div>" +
	       "<div style='width:50%;text-align:center;float:left;'>" +
	          "<button onclick='confirmarEmpezarCursoVirtual()' class='btn btn-success' style='font-size:18px;'>" +
	             "<i aria-hidden='true' class='fa fa-paper-plane'></i> Empezar" +
	          "</button>" +
	       "</div>" +
	    "</div>" +
	 "</div>"
   };
	           	
   crearModalPrincipalUsuario(opciones,function(){},true,true);
}

function cancelarEmpezarCursoVirtual(){
   $("#modalConfirmarCursoVirtual").modal("hide");
}

function confirmarEmpezarCursoVirtual(){
   $("#modalConfirmarCursoVirtual").modal("hide");
   objInduccionVirtual = {id: 0};
   empezarExamenCursoVirtual(1);
}

function guardarInduccionVirtual(){	
   var textDiv = "#formEditarDocVehicular";
	
   if(objInduccionVirtual.id == 0){
      textDiv = "#nuevaMovilInduccionVirtual";
   }
	
   var formDiv = $(textDiv);
   var campoVacio = true;
   var trabajadorContratistaId = formDiv.find("#selTrabajadorInduccionVirtual").val();
   var induccionVirtualId = formDiv.find("#selInduccionVirtual").val();
	
   if(campoVacio){
      var dataParam={
         id: 0,examen: {id: induccionVirtualId},
         trabajador: {id: trabajadorContratistaId}
      };

      callAjaxPost(URL+'/contratista/induccion_virtual/contratista/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":  
	       alert("Se registró correctamente su observación");
	       habilitarInduccionesVirtuales();
								
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar!");
         }
      });	 
   }else{
      alert("Debe ingresar todos los campos.");
   }
}

function eliminarInduccionVirtual(){
   var r = confirm("¿Está seguro de eliminar el "+tipoInduccionVirtualNombre+"?");
	
   if(r){
      callAjaxPost(URL+"/contratista/documento_vehicular/delete",{id: objInduccionVirtual.id},function(data){
         alert("Registro eliminado!");
         habilitarInduccionesVirtuales();
      });
   }
}

function volverConsolidadoInduccionVirtual(){
   $("#modalConsolidadoInduccionVirtual").modal("hide");
}

function verConsolidadoInduccionVirtual(){
   $("#modalConsolidadoInduccionVirtual").remove();
   
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' id='btnVolverInduccVirtual' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverConsolidadoInduccionVirtual()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoInduccionVirtual",
      nombre:"<i class='fa fa-table'></i> Status inducciones virtuales registradas ("+listInduccionesVirtualesContratista.length+")",
      contenido: 
	 buttonVolver +
         "<div class='wrapper' id='wrapperConsolidadoInduccionVirtual'>" +
            "<table id='tblConsolidadoInduccionVirtual' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' colspan='4' style='width:1200px'>Datos generales</th>" +
		     "<th class='tb-acc' colspan='4' style='width:1200px'>Cargo</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:300px'>Trabajador(a)</th>" +
		     "<th class='tb-acc' style='width:300px'>Inducción</th>" +
		     "<th class='tb-acc' style='width:300px'>Fecha y hora</th>" +
		     "<th class='tb-acc' style='width:300px'>Resultado</th>" +
		     "<th class='tb-acc' style='width:300px'>Evidencia</th>" +
		     "<th class='tb-acc' style='width:300px'>Evaluación</th>" +
		     "<th class='tb-acc' style='width:300px'>Evaluado el</th>" +
		     "<th class='tb-acc' style='width:300px'>Observación</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"
   };
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperResumenTrabCapacitacionOnline",190);
   cargarConsolidadoInduccionVirtual();
}

function cargarConsolidadoInduccionVirtual(){ 
   $("#tblConsolidadoInduccionVirtual tbody tr").remove();
	 
   listInduccionesVirtualesContratista.forEach(function(val,index){
      var nombreEviCargo = "------",evaluacionCargo = "------",evaluacionDetalle = "------",
	  textObservacion = "------";

      var resultado = (val.puntajeAlcanzadoSobreVeinte == -1?val.evaluacion.nombre:
         val.evaluacion.nombre+" ("+val.puntajeAlcanzadoSobreVeinte+")");
	   
      if(val.evaluacion.id == 1 && val.evidenciaCargoNombre.length != 0){
	 nombreEviCargo = (val.evidenciaCargoNombre.length == 0?"------":
            "<a href='"+URL+"/contratista/amazon_s3/induccion_virtual/trabajador_contratista/evidencia/cargo?id="+val.id+"' " +
	       "target='_blank' class='efectoLink'>"+val.evidenciaCargoNombre+"</a>");
			 
	 evaluacionCargo = val.evaluacionCargo.nombre;
			    
	 if(val.evaluacionCargo.id == 1 || val.evaluacionCargo.id == 2){
	    evaluacionDetalle = (val.fechaEvaluacionTexto == 0?"------":val.fechaEvaluacionTexto +
               "<br>(Por "+val.evaluacionCargo.usuario.userName+")");  
	 }
		      
	 if(val.evaluacionCargo.id == 2){
            textObservacion = (val.evaluacionCargo.observacion.length == 0?
	       "------":val.evaluacionCargo.observacion); 
	 }
      }
	    	
      $("#tblConsolidadoInduccionVirtual tbody").append(
	 "<tr id='filaInduccionVirtual"+val.id+"'>" +
	    "<td>"+val.trabajador.nombre+"</td>" +
	    "<td>"+val.examen.tema+"</td>" +
	    "<td>"+val.fechaRegistroTexto+"</td>" +
	    "<td>"+resultado+"</td>" +
	    "<td style='word-break:break-all;'>"+nombreEviCargo+"</td>" + 
	    "<td>"+evaluacionCargo+"</td>" +
	    "<td>"+evaluacionDetalle+"</td>" +
	    "<td>"+textObservacion+"</td>" +
         "</tr>");
	  
      var colorFondoFila = (val.evaluacionCargo.id == 1?"#5DCD5D":(val.evaluacionCargo.id == 2?"#FF7474":"#D8D808"));
	    
      $("#filaInduccionVirtual"+val.id+" td").css({"background-color":colorFondoFila});
   });
     
   goheadfixedY("#tblConsolidadoInduccionVirtual","#wrapperConsolidadoInduccionVirtual");
}
