
var programacionCapAuxId,pIndexEvento;
var objEvalEventoFormacionMovil = {};
var listEvaluacionesFormacionColaborador = [];
var indexFormacion;
var mensajeUx;

function toggleMenuOpcionEvalEventoFormacion(obj,pindex){
   objEvalEventoFormacionMovil = listEvaluacionesFormacionColaborador[pindex];
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesEvaluacionesFormacion=[
   {id:"opcEditarHa",nombre:"<i class='fa fa-pencil'></i> Editar nota",
    functionClick:function(){editarEvaluacionEventoFormacion()}},
   {id:"opcEliminarHa",nombre:"<i class='fa fa-times'></i> Eliminar",
    functionClick:function(data){eliminarEvalacionEventoFormacion()}},
// {id:"opcVerAccionesHa",nombre:"<i class='fa fa-eye'></i>Agregar acciones",
//  functionClick:function(data){objAccionHallazgoInspeccionCalidad = {id : 0};realizarAccionInspeccionCalidad()  }}
];

function marcarSubOpcionEvaluacionEventoFormacion(pindex){
   funcionalidadesEvaluacionesFormacion[pindex].functionClick(); 
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarRegistroNotasEventoFormacion(){
   $("#modalRegistroNotasEventoFormacion").modal("hide");
}

function verRegistroNotasEventoFormacion(pindex){
   $("#modalRegistroNotasEventoFormacion").remove();
   
   var listModal={
      id: "modalRegistroNotasEventoFormacion",
      nombre: "Evaluación - Registro de notas",
      contenido: "<div id='estadoMovilPrincipalRegNotasEventForm'></div>"
   };
	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   pIndexEvento = pindex;programacionCapAuxId = listFullEventos[pindex].idAux;
   
   cargarRegistroNotasEventoFormacion();
}   
   
function cargarRegistroNotasEventoFormacion(){
   $("#estadoMovilPrincipalRegNotasEventForm").html("");
    
   var dataParam={
      programacionCapId:programacionCapAuxId
   };
    
   var listPanelesPrincipal = [];

   callAjaxPost(URL+'/capacitacion/programacion/trabajadores/registro',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){ 
	 listEvaluacionesFormacionColaborador = data.listEvaluacion;listNotasColaborador = data.listNotas;
         
         var textTotalRegistrados = "";
	  
         listEvaluacionesFormacionColaborador.forEach(function(val,index){
            var btnOpcion = "",menuOpcion = "";
            
//            if(objObservacionContratista.nota.id != 1){
                menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
                   funcionalidadesEvaluacionesFormacion.forEach(function(val1,index1){
                      menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionEvaluacionEventoFormacion("+index1+")'>" +
		                        val1.nombre +
		                    "</li>";
	           });
	        menuOpcion += "</ul>";
			
	        btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionEvalEventoFormacion(this,"+index+")'>" +
	                       "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
	                    "</a>" ;
	        
	    var estiloGosst = (val.tipoNota.id == 1?"gosst-aprobado":(val.tipoNota.id == 2?"gosst-desaprobado":"gosst-advertencia")),
	        comentario = (val.comentario.length == 0?"------":val.comentario);
 
            var listTotal=[
	       {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
                label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>"+"*** TRABAJADOR #"+(index+1)+" ***"+"</span>"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",label:"<i class='fa fa-user'></i> Nombre:",inputForm:"("+val.trabDni+") "+val.trabNombre},
	       {sugerencia:"",label:"<i class='fa fa-building-o'></i> Área:",inputForm:val.trabajador.area.areaName},
	       {sugerencia:"",label:"<i class='fa fa-building-o'></i> Puesto de trabajo:",inputForm:val.trabajador.puesto.positionName},
	       {sugerencia:"",label:"<i class='fa fa-certificate'></i> Resultado:",inputForm:val.tipoNota.nombre},
	       {sugerencia:"",label:"<i class='fa fa-bookmark'></i> Detalle:",inputForm:comentario}
	    ];
			
            textTotalRegistrados += "<div class='eventoGeneral "+estiloGosst+"'>" +
 		                       "<form class='eventoGeneral'>";	   					
               listTotal.forEach(function(val,index){
                  textTotalRegistrados += obtenerSubPanelModuloVersionDos(val);
               });
            textTotalRegistrados +=    "</form>" +
 	                            "</div>";
         });
         
         var textOpciones =
            "<div id='estadoMovilRegresarRegNotasEventoFormacion'>" +
               "<div class='tituloSubList'>" +
                  "<button type='button' style='font-size:19px;float:left;margin-right:5px;' title='Regresar a la vista principal de la sección.' " +
                          "class='btn btn-info' onclick='regresarRegistroNotasEventoFormacion()'>"+
                     "<i class='fa fa-2x fa-sign-out fa-rotate-180'></i>" +
                  "</button>" +
                  "<button type='button' style='font-size:19px;float:left;margin-right:5px;' title='Import de trabajadores - notas.' " +
                          "class='btn btn-success' onclick='verImportExcelListaNotaFormacion()'>"+
                     "<i class='fa fa-2x fa-upload'></i>" +
                  "</button>" +
                  "<button type='button' style='font-size:19px;float:left;margin-right:5px;' title='Obtener el excel Formato - Registro formación.' " +
                          "class='btn btn-excel' onclick='generarExcelFormatoRegistroFormacion()'>"+
                     "<i class='fa fa-2x fa-file-excel-o'></i>" +
                  "</button>" +
                  "<button type='button' style='font-size:19px;float:left;' title='Registrar como terminado.' " +
                          "class='btn btn-success' onclick='verCompletarActividadVistaColaborador("+pIndexEvento+")'>"+
                     "<i class='fa fa-2x fa-check-square'></i>" +
                  "</button>" +
               "</div>" +
            "</div>";
         
         $("#estadoMovilPrincipalRegNotasEventForm").append(textOpciones);
         
         listPanelesPrincipal.push(
  	    {id:"infoMovilRegNotasEventoFormacion",clase:"",styleAux:"",buttonAd:"",
  	     nombre:"Trabajadores registrados ("+listEvaluacionesFormacionColaborador.length+")",
  	     contenido:textTotalRegistrados});
         
         agregarPanelesDivPrincipalModalVersionDos(listPanelesPrincipal,"estadoMovilPrincipalRegNotasEventForm");
         
         $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
      }else{
         console.log("NOPNPO")
      }
   });   
}

function ocultarEditarEvaluacionEventoFormacion(){
   $("#modalGuardarEvalForm").modal("hide");$("#modalRegistroNotasEventoFormacion").modal("show");
}

function editarEvaluacionEventoFormacion(){
   $("#modalRegistroNotasEventoFormacion").modal("hide");$("#modalGuardarEvalForm").remove();
   
   var listNotaEvaluacion = [{id:1,nombre:"Aprobado"},{id:2,nombre:"Desaprobado"},{id:3,nombre:"Pendiente"}];
   
   var selNotaEvalFormacion = crearSelectOneMenuOblig("selNotaEvalFormacion","",listNotaEvaluacion, 
      objEvalEventoFormacionMovil.tipoNota.id,"id","nombre");
   
   var contenido = "";
   
   var listContenido=[
      {sugerencia:"",label:"Trabajador",inputForm:objEvalEventoFormacionMovil.trabNombre}, 
      {sugerencia:"",label:"Resultado",inputForm:selNotaEvalFormacion}, 
      {sugerencia:"",label:"Detalle",inputForm:"<textarea rows='3' class='form-control' id='textComentarioEvalFormacion'></textarea>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
		     "onclick='ocultarEditarEvaluacionEventoFormacion()'>" +
 	        "<i class='fa fa-times'></i> Cancelar" +
 	     "</button>",
       inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
       		         "onclick='guardarEvaluacionEventoFormacion()'>" +
       		    "<i class='fa fa-floppy-o'></i> Guardar" +
       		 "</button>"},
   ];
   
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    
   var modalOptions={
      id:"modalGuardarEvalForm",nombre:"<i class='fa fa-pencil'></i> Editar",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   }; 
   
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    
   $("#textComentarioEvalFormacion").val(objEvalEventoFormacionMovil.comentario);
}

function guardarEvaluacionEventoFormacion(){
   var comentario = $("#textComentarioEvalFormacion").val();
   var tipoNotaId = parseInt($("#selNotaEvalFormacion").val());
    
   var dataParam = {
      id:objEvalEventoFormacionMovil.id,comentario:comentario,tipoNota: {id:tipoNotaId}
   };
   
   callAjaxPost(URL+"/capacitacion/programacion/evaluacion/update",dataParam,function(data){
      $("#modalGuardarEvalForm").modal("hide");
       
      mensajeUx="<label>El registro de evaluación fue guardado correctamente.</label>";
      mensajesUx(mensajeUx,1,"","ActualizarVistaColab"); 
							   	
      $("#modalMensajeUxActualizarVistaColab").on("hidden.bs.modal",function(){
	 $("#modalRegistroNotasEventoFormacion").modal("show");
	 cargarRegistroNotasEventoFormacion();  
      });
   });
}

function eliminarEvalacionEventoFormacion(){
   $("#modalRegistroNotasEventoFormacion").modal("hide");
   
   mensajeUx="<label>¿Está seguro de eliminar la evaluación?</label>";
   mensajesUx(mensajeUx,3,"","EliminarRegNotasEventForm");

   $("#btnDevolverValorEliminarRegNotasEventForm").on("click",function(){
      var dataParam={
	 id:objEvalEventoFormacionMovil.id
      };

      callAjaxPost(URL+'/capacitacion/programacion/evaluacion/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
  	    case "05":
  	       mensajeUx="<label>La evaluación fue eliminada con éxito.</label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarVistaColab");
  		
  	       $("#modalMensajeUxActualizarVistaColab").on("hidden.bs.modal",function(){
  		  $("#modalRegistroNotasEventoFormacion").modal("show");
  		  cargarRegistroNotasEventoFormacion();     
  	       });
  		
  	       break;
  		
  	    default:
  	       alert("Ocurrió un error al eliminar la evaluación!");
         }
      });
   });
    
   $("#btnRegresarPrevioEliminarRegNotasEventForm").on("click",function(){
      $("#modalRegistroNotasEventoFormacion").modal("show");
   }); 
}

function ocultarImportExcelListaNotaFormacion(){
   $("#modalImportExcelListaNotaFormacion").modal("hide");$("#modalRegistroNotasEventoFormacion").modal("show");
}

function verImportExcelListaNotaFormacion(){
   $("#modalRegistroNotasEventoFormacion").modal("hide");$("#modalImportExcelListaNotaFormacion").remove();
   
   var textPlantilla = "<a class='efectoLink' href='"+URL+"/capacitacion/programacion/evaluacion/formato?progCapId="+programacionCapAuxId+"' target='_blank'>" +
                          "<i class='fa fa-download'></i> Descargar" +
                       "</a>";
	
   var contenido = "";
   
   var listContenido=[
      {sugerencia:"",label:"<i class='fa fa-info'></i> Archivo Excel",inputForm:"",divContainer:"divListaNotaFormacion"},
      {sugerencia:"",label:"<i class='fa fa-download'></i> Plantilla:",inputForm:textPlantilla},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
		     "onclick='ocultarImportExcelListaNotaFormacion()'>" +
 	        "<i class='fa fa-times'></i> Cancelar" +
 	     "</button>",
       inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
       		         "onclick='verificarNotasEvaluacionEventoFormacion()'>" +
       		    "<i class='fa fa-floppy-o'></i> Guardar" +
       		 "</button>"},
   ];
   
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    
   var modalOptions={
      id:"modalImportExcelListaNotaFormacion",nombre:"<i class='fa fa-upload'></i> Import de trabajadores - notas",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   }; 
   
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    
   var options={
      container:"#divListaNotaFormacion",functionCall:function(){
         validacionSubirEvidencia("ListaNotaForm",bitsEvidenciaExamen,"modalImportExcelListaNotaFormacion");
      },descargaUrl:"",esNuevo:true,idAux:"ListaNotaForm",evidenciaNombre:""
   };
			
   crearFormEvidenciaCompleta(options);
}

function verificarNotasEvaluacionEventoFormacion(){ 
   var campoVacio = true;
    
   var inputExcel = $("#inputEviListaNotaForm").val();
   
   if(inputExcel == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir el excel.</label>";
      campoVacio = false;
   }  
    
   if(campoVacio){ 
      guardarEvidenciaAuto(0,"fileEviListaNotaForm",bitsEvidenciaExamen,"/capacitacion/programacion/evaluacion/formato/masivo",function(data){
         if(data.CODE_RESPONSE == "05"){
            if(data.mensaje.length > 0){
               alert(data.mensaje);
               return;
            }else{
               $("#modalImportExcelListaNotaFormacion").modal("hide");
        	
	       mensajeUx="<label>El import fue completado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarVistaColab"); 
	 							   	
	       $("#modalMensajeUxActualizarVistaColab").on("hidden.bs.modal",function(){
	 	  $("#modalRegistroNotasEventoFormacion").modal("show");
	 	  cargarRegistroNotasEventoFormacion();  
	       });
            }
         }else{
            alert("Archivo no compatible");
         }
      },"",[{id:"progCapId",value:programacionCapAuxId}]);
   }else{
      $("#modalImportExcelListaNotaFormacion").modal("hide");
      mensajesUx(mensajeUx,2,"","ActualizarVistaColab");
      
      $("#modalMensajeUxActualizarVistaColab").on("hidden.bs.modal",function(){
	 $("#modalImportExcelListaNotaFormacion").modal("show");
      });
   }
}

function generarExcelFormatoRegistroFormacion(){
   window.open(URL+"/capacitacion/excel/formato/registro_formacion?empresaId="+parseInt(getSession("gestopcompanyid")) +
      "&progcapacitacionId="+programacionCapAuxId,'_blank');	
}

