var objSubContratista={};
var contratistaId;
var listSubContratista=[];
var listEvaluacion=[];
var indexSubContratistaPregunta;
var mensajeUx;

function toggleMenuOpcionSubContratista(obj,pindex){
   objSubContratista = listSubContratista[pindex]; 
   indexSubContratistaPregunta = pindex;
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesSubContratista=[ 
   {id:"opcVerDocumento", nombre:"<i class='fa fa-book'></i> Ver documentos",
    functionClick:function(data){verDocumentosSubcontratista()}},
   {id:"opcEditar", nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
    functionClick:function(data){editarSubContratista()}},
   {id:"opcElimnar", nombre:"<i class='fa fa-times'></i> Eliminar",
    functionClick:function(data){eliminarSubContratista()}}
];

function marcarSubOpcionSubContratista(pindex){
   funcionalidadesSubContratista[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarSubContratista(){ 
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      contratistaPadreId: getSession("contratistaGosstId")
   };
   
   objSubContratista = {id:0};	 
   var listPanelesPrincipal = [];
	
   callAjaxPost(URL+'/contratista/subcontratista/vista_contratista',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    var textIn = "";
	    var textSinAtender = "",textAtenderSinRespuesta = "",textAtenderConRespuesta = "";
	    var numSin = 0,numConSinRespuesta = 0,numConConRespuesta = 0;
	    var linkDocumento = "";
			
	    listSubContratista = data.listSubContratista;
	    $(".divListPrincipal").html("");
			
	    listEvaluacion = data.listEvaluacion;
	     
	    var selListEvaluacion = crearSelectOneMenu("selListEvaluacion","",
	       listEvaluacion,"","id","nombre");
			
	    var listItemsExam=[
	       {sugerencia:"",label:"Razón Social",
		inputForm:"<input class='form-control' id='inputRazonSocialSubCon'>"},
	       {sugerencia:"",label:"RUC",
		inputForm:"<input class='form-control' id='inputRucSubCon'>"},
	       {sugerencia:"",label:"Detalle del proyecto",
		inputForm:"<input class='form-control' id='inputDetalleSubCon'>"},
	       {sugerencia:"",label:"Lista de evaluación",inputForm:selListEvaluacion,divContainer:""},
	       {sugerencia:"",label:"Persona de contacto",
		inputForm:"<input class='form-control' id='inputContactoSubCon'>"},
	       {sugerencia:"",label:"Teléfono",
		inputForm:"<input class='form-control' id='inputContactoTelefonoSubCon'>"},
	       {sugerencia:"",label:"Correo",
		inputForm:"<input class='form-control' id='inputContactoCorreoSubCon'>"},
       	       {sugerencia:"",label:"",
		inputForm:"<button type='submit' class='btn btn-success'>" +
		             "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
		          "</button>"} 
            ]; 
			
	    var textFormExamen = "";
	        
	    listItemsExam.forEach(function(val,index){
	       textFormExamen += obtenerSubPanelModulo(val);
	    });
			
	    var textTotal = "";
			
	    listSubContratista.forEach(function(val,index){
	       var menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
	          funcionalidadesSubContratista.forEach(function(val1,index1){
		     menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionSubContratista("+index1+")'>"+val1.nombre+"</li>";
		  });
	       menuOpcion+="</ul>"; 
		
//	       linkDocumento = 
//		  "<a style='font-weight:900' onclick='cargarPreguntaSubContratista("+index+")'>" +
//	             "<i class='fa fa-book' aria-hidden='true'></i>" + 
//		     "Documentos ("+val.numListAsoDocAprobados+"/"+val.numListAsoDocumentos+") " +
//		     "<i aria-hidden='true' class='fa fa fa-angle-double-down'></i></a>";
		
	       var btnOpcion = 
		  "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionSubContratista(this,"+index+")'>" +
		     "<i class='fa  fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
		  "</a>" ;
	       
	       var estiloGosst = 
		  (val.numListaDocumentosAprobados == val.numListAsoDocumentos?"gosst-aprobado":"gosst-advertencia");
				
	       var listTotal=[
		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
	           label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
			    "*** DATOS DEL REGISTRO ***" +
			 "</span>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	          {sugerencia:"",label:"<i class='fa fa-building-o'></i> Razon Social",inputForm:val.nombre},
	          {sugerencia:"",label:"<i class='fa fa-barcode'></i> RUC",inputForm:val.ruc},
		  {sugerencia:"",label:"<i class='fa fa-file-text'></i> Detalle del proyecto",inputForm:val.detalle},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
		   label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
		            "*** DATOS DEL CONTACTO ***" +
			 "</span>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                  {sugerencia:"",label:"<i class='fa fa-user'></i> Nombre",inputForm:val.contacto},
	          {sugerencia:"",label:"<i class='fa fa-phone'></i> Teléfono",inputForm:val.telefono},
		  {sugerencia:"",label:"<i class='fa fa-envelope-o'></i> Correo",inputForm:val.contactoCorreo},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
		   label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
		            "*** ESTADO DE LOS DOCUMENTOS (ASOCIADOS A LA LISTA) ***" +
			 "</span>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	          {sugerencia:"",label:"<i class='fa fa-list-ol'></i> Lista Asociada",inputForm:val.listaEvaluacion.nombre},
//	          {sugerencia:"",label:linkDocumento,inputForm:""},
	          {sugerencia:"",label:"<i class='fa fa-info-circle'></i> N° de documentos aprobados",
	           inputForm:val.numListaDocumentosAprobados+" / "+val.numListAsoDocumentos}
	       ];
				
	       textTotal += "<div class='eventoGeneral "+estiloGosst+"'>" +
	                       "<form class='eventoGeneral'>";	   					
		  listTotal.forEach(function(val,index){
	   	     textTotal += obtenerSubPanelModuloVersionDos(val);
	   	  });	
	       textTotal +=    "</form>" +
		            "</div>";
		
	       textTotal+="<div class='divMovilPreguntaSubContratista' id='divPreguntaSubCon"+val.id+"'></div>";
	    });
				
	    listPanelesPrincipal.push(
	       {id:"nuevoMovilSubContratista",clase:"",
		nombre:""+"Nuevo registro Sub Contratista ",
		contenido:"<form id='formNuevoSubContratista' class='eventoGeneral'>"+textFormExamen+"</form>"},
	       {id:"totalSubContratista" ,clase:"",
		nombre:"Sub Contratistas registrados ("+listSubContratista.length+")",
		contenido:""+textTotal});
			
	    agregarPanelesDivPrincipal(listPanelesPrincipal);
			
	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
			 
	    $('#formNuevoSubContratista').on('submit', function(e) {  
	       e.preventDefault();
	       objSubContratista = {id:0};
	       guardarSubContratista();
	    });
	     
	    break;
	     
	 default:
	    alert("nop");
	    break;
      }
   });
} 

function ocultarEditarSubcontratista(){
   $("#modalEditarSubContratista").modal("hide");   
}

function editarSubContratista(){
   $("#modalEditarSubContratista").remove();
    
   var selListEvaluacion = crearSelectOneMenu("selListEvaluacion","",
      listEvaluacion,objSubContratista.listaEvaluacion.id,"id","nombre");
	
   var listItemsExam=[
      {sugerencia:"",label:"Razón Social",
       inputForm:"<input class='form-control' id='inputRazonSocialSubCon'>"},
      {sugerencia:"",label:"RUC",
       inputForm:"<input class='form-control' id='inputRucSubCon'>"},
      {sugerencia:"",label:"Detalle del proyecto",
       inputForm:"<input class='form-control' id='inputDetalleSubCon'>"},
      {sugerencia:"",label:"Lista de evaluación",inputForm:selListEvaluacion,divContainer:""},
      {sugerencia:"",label:"Persona de contacto",
       inputForm:"<input class='form-control' id='inputContactoSubCon'>"},
      {sugerencia:"",label:"Teléfono",
       inputForm:"<input class='form-control' id='inputContactoTelefonoSubCon'>"},
      {sugerencia:"",label:"Correo",
       inputForm:"<input class='form-control' id='inputContactoCorreoSubCon'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
 	             "onclick='ocultarEditarSubcontratista()'>" +
 	        "<i class='fa fa-times'></i> Cancelar" +
 	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
		    "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
	         "</button>"} 
   ];
   
   var textFormExamen = "";
	
   listItemsExam.forEach(function(val,index){
      textFormExamen += obtenerSubPanelModuloVersionDos(val);
   });
	
   var opciones={
      id:"modalEditarSubContratista",
      nombre:"Editar registro subContratista",
      contenido:"<form id='formEditarSubContratista' class='eventoGeneral'>"+textFormExamen+"</form>"
   };
   
   crearModalPrincipalUsuario(opciones,function(){},false,true);
	
   var editarDiv=$("#formEditarSubContratista");
	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      validacionPreviaGuardarSubcontratista();
   });
   
   editarDiv.find("#inputRazonSocialSubCon").val(objSubContratista.nombre);
   editarDiv.find("#inputRucSubCon").val(objSubContratista.ruc);
   editarDiv.find("#inputDetalleSubCon").val(objSubContratista.detalle);
   editarDiv.find("#inputContactoSubCon").val(objSubContratista.contacto);
   editarDiv.find("#inputContactoTelefonoSubCon").val(objSubContratista.telefono);
   editarDiv.find("#inputContactoCorreoSubCon").val(objSubContratista.contactoCorreo);
}

function validacionPreviaGuardarSubcontratista(){
   if(objSubContratista.id > 0){
      var formDiv = $("#formEditarSubContratista");
	 
      if(parseInt(formDiv.find("#selListEvaluacion").val()) != objSubContratista.listaEvaluacion.id){
	 $("#modalEditarSubContratista").modal("hide");
	  
         mensajeUx="<label>¿Está seguro de cambiar la lista de evaluación asociada al subcontratista?" +
            "<br><br>(de tener documentos registrados, se borrarán una vez hecho el cambio).</label>";
         mensajesUx(mensajeUx,3,"","ValidacionPrevSubcon");

         $("#btnDevolverValorValidacionPrevSubcon").on("click",function(){
            guardarSubContratista(); 
         });
         
         $("#btnRegresarPrevioValidacionPrevSubcon").on("click",function(){
            $("#modalEditarSubContratista").modal("show");
         });  
      }else{
	 guardarSubContratista(); 
      }
   }else{
      guardarSubContratista();
   }
}

function guardarSubContratista(){
   var textDiv ="#formEditarSubContratista"; //Al editar el formulario
   var cambiarListaAsoc = 0;
	
   if(objSubContratista.id == 0){  // Al crear un nuevo Sub contratista
      var textDiv = "#nuevoMovilSubContratista";
   }
	
   var formDiv = $(textDiv);
   
   var campoVacio = true;
	
   var nombre = formDiv.find("#inputRazonSocialSubCon").val();
   var ruc = formDiv.find("#inputRucSubCon").val();
   var detalle = formDiv.find("#inputDetalleSubCon").val();
   var valListEvaluacion = parseInt(formDiv.find("#selListEvaluacion").val());
   var contacto = formDiv.find("#inputContactoSubCon").val(); 
   var telefono = formDiv.find("#inputContactoTelefonoSubCon").val();
   var correo = formDiv.find("#inputContactoCorreoSubCon").val();
   //var contratistaObj={id:getSession("contratistaGosstId")};
   
   if(objSubContratista.id > 0){
      cambiarListaAsoc = (valListEvaluacion != objSubContratista.listaEvaluacion.id?1:0);
   }
   
   if(nombre.length == 0 || ruc.length == 0 || detalle.length == 0 || contacto.lenght == 0 || 
      telefono.length == 0 || correo.length == 0 || valListEvaluacion == -1){
      campoVacio = false;
   }
   
   if(campoVacio){
      var dataParam={
	 id: objSubContratista.id,nombre: nombre,ruc: ruc,detalle: detalle,
	 listaEvaluacion: {id: valListEvaluacion},contacto: contacto,
	 telefono: telefono,contactoCorreo: correo,isActivo: 1,
	 contratistaPadreId:getSession("contratistaGosstId"),
	 empresaId:getSession("gestopcompanyid"),cambiarListaEval: cambiarListaAsoc
      }

      callAjaxPost(URL+'/contratista/subcontratista/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":  
	       if(objSubContratista.id > 0){
		  $("#modalEditarSubContratista").modal("hide");
	       }
	     
	       mensajeUx="<label>Los datos del subcontratista se guardaron con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarSeccionSubconVistaCon");
		    
	       $("#modalMensajeUxActualizarSeccionSubconVistaCon").on("hidden.bs.modal",function(){
		  habilitarSubContratista();
	       });
		   
	       break;
		   
	    default:
	       console.log("Ocurrió un error al guardar!");
         }
      });	
   }else{
      if(objSubContratista.id > 0){
         $("#modalEditarSubContratista").modal("hide");
      }
      
      mensajeUx="<label>Debe ingresar la información respectiva en todos los campos.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
 	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
	 if(objSubContratista.id > 0){
            $("#modalEditarSubContratista").modal("show");   
	 }
      }); 
   }
}

function eliminarSubContratista(){   
   mensajeUx="<label>¿Está seguro de eliminar al subcontratista seleccionado?" +
      "<br><br>(también se borrarán todos los documentos asociados a la misma).</label>";
   mensajesUx(mensajeUx,3,"","EliminarSubcon");

   $("#btnDevolverValorEliminarSubcon").on("click",function(){
      var dataParam={
         id: objSubContratista.id
      };

      callAjaxPost(URL+'/contratista/subcontratista/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
  	    case "05":
  	       mensajeUx="<label>El subcontratista fue eliminado con éxito.</label>";
  	       mensajesUx(mensajeUx,1,"","EliminarSubconAviso");
  		
  	       $("#modalMensajeUxEliminarSubconAviso").on("hidden.bs.modal",function(){
  		  habilitarSubContratista();     
  	       });
  		
  	       break;
  		
  	    default:
  	       alert("Ocurrió un error al eliminar al subcontratista!");
         }
      });
   });
}

var listDocumentosSubcontratista=[],listDocumentosListaSubcon=[],listTipoDocumentoIdAux = [];
var objDocumentoSubcon={};
var indexDocSubcon;

function toggleMenuOpcionDocumentosSubcontratista(obj,pindex){
   objDocumentoSubcon = listDocumentosSubcontratista[pindex]; 
   indexDocSubcon = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesDocumentosSubcontratista=[
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
    functionClick:function(data){editarDocumentoSubcontratista()}},
   {id:"opcElimnar",nombre:"<i class='fa fa-times'></i> Eliminar",
    functionClick:function(data){eliminarDocumentoSubcontratista()}}
];

function marcarSubOpcionDocumentosSubcontratista(pindex){
   funcionalidadesDocumentosSubcontratista[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalSubcontratista(){
   $("#modalConsolidadoDocumentosSubcontratista").modal("hide");
   habilitarSubContratista();
}

function verDocumentosSubcontratista(){
   $("#modalConsolidadoDocumentosSubcontratista").remove();
    
   var listModal={
      id: "modalConsolidadoDocumentosSubcontratista",
      nombre: "Documentos asociados a la lista",
      contenido: "<div id='estadoMovilPrincipalDocumentoSubcon'></div>"
   };
	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);

   cargarDocumentosSubcontratista();
}

function cargarDocumentosSubcontratista(){
   $("#estadoMovilPrincipalDocumentoSubcon").html("");
   
   var dataParam={
      subcontratistaId: objSubContratista.id,
      listaId: objSubContratista.listaEvaluacion.id
   };
   
   var listPanelesPrincipal=[];

   callAjaxPost(URL+'/contratista/subcontratista/documento',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){ 
	 listDocumentosSubcontratista = data.listDocumentosSubcontratista;
	 listDocumentosListaSubcon = data.listDocumentosListaSubcon;
	 listTipoDocumentoIdAux = [];
	 
         var textTotalRegistrados = "";
	  
         listDocumentosSubcontratista.forEach(function(val,index){
            var btnOpcion="",menuOpcion="";
            
            listTipoDocumentoIdAux.push(val.tipo.id);
            
            if(val.evaluacion.nota.id != 1){
               menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
                  funcionalidadesDocumentosSubcontratista.forEach(function(val1,index1){
                     menuOpcion += 
                        "<li class='list-group-item' onclick='marcarSubOpcionDocumentosSubcontratista("+index1+")'>" +
		            val1.nombre+
		        "</li>";
	          });
	       menuOpcion += "</ul>";
			
	       btnOpcion = 
                  "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionDocumentosSubcontratista(this,"+index+")'>" +
	             "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
	          "</a>" ;
            }
            
            var evidencia = 
               (val.evidenciaNombre.length == 0?"------":
	 	"<a class='efectoLink' target='_blank' " +
	 	   "href='"+URL+"/contratista/subcontratista/documento/evidencia?id="+val.id+"'>"+
	 	    val.evidenciaNombre+
	 	"</a>");
            
            var estiloGosst = (val.evaluacion.nota.id == 1?"gosst-aprobado":
               (val.evaluacion.nota.id == 2?"gosst-desaprobado":"gosst-advertencia"));
            
            var listTotal=[
	       {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
                label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
                         "*** DOCUMENTO #"+(index+1)+" ***" +
                      "</span>"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
        	label:"<i class='fa fa-info'></i> Tipo:",inputForm:val.tipo.nombre},
	       {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
        	label:"<i class='fa fa-download'></i> Evidencia:",inputForm:evidencia},
	       {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
        	label:"<i class='fa fa-pencil'></i> Observación:",inputForm:(val.observacion.length == 0?"------":val.observacion)},
	       {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
        	label:"<i class='fa fa-calendar'></i> Fecha inicio de vigencia:",inputForm:val.fechaInicioVigenciaTexto},
	       {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
        	label:"<i class='fa fa-calendar'></i> Fecha fin de vigencia:",inputForm:val.fechaFinVigenciaTexto},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
               {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
                label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
                         "*** EVALUACIÓN ***" +
                      "</span>"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
               {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
                label:val.evaluacion.nota.icono+" Estado:",inputForm:val.evaluacion.nota.nombre}
	    ]; 
            
            if(val.evaluacion.nota.id != 3){
               if(val.evaluacion.nota.id == 2){
        	  listTotal.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
                     label:"<i class='fa fa-exclamation-circle'></i> Observacion:",
                     inputForm:(val.evaluacion.observacion.length == 0?"------":val.evaluacion.observacion)});   
               }
               
               if(val.evaluacion.nota.id != 4){
                  listTotal.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
                     label:"<i class='fa fa-calendar'></i> Evaluado el",inputForm:val.evaluacion.fechaTexto});  
               }
            }
            	
            textTotalRegistrados+= "<div class='eventoGeneral "+estiloGosst+"'>" +
 		                      "<form class='eventoGeneral'>";	   					
               listTotal.forEach(function(val,index){
                  textTotalRegistrados += obtenerSubPanelModuloVersionDos(val);
               });
            textTotalRegistrados+=    "</form>" +
 	                           "</div>";
         });
         
         var textRegresarSubcontratista =
            "<div id='estadoMovilRegresarVistaPrincipalSubcon'>" +
               "<div class='tituloSubList'> Volver a la vista principal" +
                  "<button style='font-size:19px' title='Regresar a la vista principal de la sección.' " +
                          "class='btn btn-info' onclick='regresarVistaPrincipalSubcontratista()'>"+
                     "<i class='fa fa-sign-out fa-rotate-180'></i> Regresar" +
                  "</button>" +
               "</div>" +
            "</div>";
         
         $("#estadoMovilPrincipalDocumentoSubcon").append(textRegresarSubcontratista);
         
         if(listDocumentosListaSubcon.length != listTipoDocumentoIdAux.length){
            var textNuevaAccionMej =
               "<div id='estadoMovilNuevoRegistroAccMejObsFast'>" +
                  "<div class='tituloSubList'> Nuevo documento " +
                     "<button style='font-size:19px' title='Registrar nuevo documento.' " +
                             "class='btn btn-success' onclick='registrarNuevoDocumentoSubcontratista()'>"+
                        "<i class='fa fa-plus-square'></i> Registrar" +
                     "</button>" +
                  "</div>" +
               "</div>";
         
            $("#estadoMovilPrincipalDocumentoSubcon").append(textNuevaAccionMej);
         }
         
         listPanelesPrincipal.push(
  	    {id: "infoMovilDocumentosSubconRegistrados",clase:"",styleAux:"",buttonAd:"",
  	     nombre: "Documentos registrados ("+listDocumentosSubcontratista.length+")",
  	     contenido: textTotalRegistrados});
         
         agregarPanelesDivPrincipalModalVersionDos(listPanelesPrincipal,"estadoMovilPrincipalDocumentoSubcon");
         
         $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
      }else{
         console.log("NOPNPO")
      }
   });   
}

var listDocumentosListaSubconAux=[];

function registrarNuevoDocumentoSubcontratista(){
   objDocumentoSubcon = {id: 0,tipo: {id: -1}}; 

   editarDocumentoSubcontratista();
}

function ocultarEditarDocumentoSubcontratista(){
   $("#modalEditarDocumentoSubcontratista").modal("hide");
   $("#modalConsolidadoDocumentosSubcontratista").modal("show");
}

function editarDocumentoSubcontratista(){
   $("#modalConsolidadoDocumentosSubcontratista").modal("hide");
   $("#modalEditarDocumentoSubcontratista").remove();
   
   listDocumentosListaSubconAux=[];
   
   listDocumentosListaSubcon.forEach(function(val1){
      var coincide = 0;
      
      listTipoDocumentoIdAux.forEach(function(val2){
	 if(val1.id == parseInt(val2)){
	    coincide = 1;
	 }  
      });
      
      if(coincide == 0 || val1.id == objDocumentoSubcon.tipo.id){
	 listDocumentosListaSubconAux.push(val1);
      }
   });
    
   var selTipoDocumento = crearSelectOneMenuOblig("selTipoDocumento","",
      listDocumentosListaSubconAux,objDocumentoSubcon.tipo.id,"id","nombre");
    
   var listItemsRegistro=[
      {sugerencia:"",label:"Tipo",anchoLabel:"",anchoDiv:"",inputForm:selTipoDocumento},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia",inputForm:"",divContainer:"divEvidenciaDocSubcon"},
      {sugerencia:"",label:"Observación" +
       "<br><span style='color:blue;font-weight:bold;'>(opcional)</span>",anchoLabel:"",anchoDiv:"",
       inputForm:"<textarea class='form-control' id='textObservacionDocSubcon' rows='3'></textarea>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
	             "onclick='ocultarEditarDocumentoSubcontratista()'>" +
	        "<i class='fa fa-times'></i> Cancelar" +
	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
            	    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
            	 "</button>"} 
   ];
     
   var textFormRegistro = "";
  	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val);
   });
   
   var opciones={
      id: "modalEditarDocumentoSubcontratista",
      nombre: (objDocumentoSubcon.id > 0?"Editar":"Nuevo")+" - Documento",
      contenido: "<form id='formEditarDocSubcon' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
     
   crearModalPrincipalUsuario(opciones,function(){},true,true);
    	
   var editarDiv = $("#formEditarDocSubcon");
   
   if(objDocumentoSubcon.id > 0){
      editarDiv.find("#textObservacionDocSubcon").val(objDocumentoSubcon.observacion);
   }
  	
   var options={
      container:"#divEvidenciaDocSubcon",functionCall:function(){
	 validacionSubirEvidencia("DocSubcon",bitsEvidenciaDocumento,"modalEditarDocumentoSubcontratista");
      },descargaUrl:(objDocumentoSubcon.id == 0?"":"/contratista/subcontratista/documento/evidencia?id="+objDocumentoSubcon.id),
      esNuevo:(objDocumentoSubcon.id == 0),idAux:"DocSubcon",evidenciaNombre:(objDocumentoSubcon.id == 0?"":objDocumentoSubcon.evidenciaNombre)
   };

   crearFormEvidenciaCompleta(options);
    
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDocumentoSubcontratista();
   });
}

function eliminarDocumentoSubcontratista(){
   $("#modalConsolidadoDocumentosSubcontratista").modal("hide");
    
   mensajeUx="<label>¿Está seguro de eliminar este documento?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocSubcon");

   $("#btnDevolverValorEliminarDocSubcon").on("click",function(){
      var dataParam={
         id: objDocumentoSubcon.id
      };

      callAjaxPost(URL+'/contratista/subcontratista/documento/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
  	    case "05":
  	       mensajeUx="<label>El documento fue eliminado con éxito.</label>";
  	       mensajesUx(mensajeUx,1,"","EliminarDocSubconAviso");
  		
  	       $("#modalMensajeUxEliminarDocSubconAviso").on("hidden.bs.modal",function(){
  		  $("#modalConsolidadoDocumentosSubcontratista").modal("show");
  		  cargarDocumentosSubcontratista();     
  	       });
  		
  	       break;
  		
  	    default:
  	       alert("Ocurrió un error al eliminar el documento!");
         }
      });
   });
    
   $("#btnRegresarPrevioEliminarDocSubcon").on("click",function(){
      $("#modalConsolidadoDocumentosSubcontratista").modal("show");
   });      
}

function guardarDocumentoSubcontratista(){
   var campoVacio = true;
   
   var selTipoDocId = parseInt($("#selTipoDocumento").val());
   var observacion = $("#textObservacionDocSubcon").val();
   
   var nombreEvidencia = $("#inputEviDocSubcon").val();
	
   if(nombreEvidencia.length == 0){
      mensajeUx="<label>Debe subir la evidencia.</label>";campoVacio = false;
   }else if(nombreEvidencia == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";campoVacio = false;
   }
   
   if(campoVacio){
      var dataParam={
	 id: objDocumentoSubcon.id,observacion: observacion,
	 subcontratistaId: objSubContratista.id,documentoListaId: selTipoDocId,
	 contratistaId: parseInt(getSession("contratistaGosstId")),
	 empresaId: parseInt(getSession("gestopcompanyid"))
      };
       
      callAjaxPost(URL+'/contratista/subcontratista/documento/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":  
	       guardarEvidenciaAuto(data.nuevoId,"fileEviDocSubcon",bitsEvidenciaDocumento,
	       "/contratista/subcontratista/documento/evidencia/save",function(){
		  $("#modalEditarDocumentoSubcontratista").modal("hide");
		   
	          mensajeUx="<label>Los datos del documento asociado a la lista " +
	             "fueron guardados con éxito.</label>";
	          mensajesUx(mensajeUx,1,"","ActualizarSeccionSubconVistaCon");
		    
	          $("#modalMensajeUxActualizarSeccionSubconVistaCon").on("hidden.bs.modal",function(){
	             $("#modalConsolidadoDocumentosSubcontratista").modal("show");
	             cargarDocumentosSubcontratista();
	          });
	       }); 
								
	       break;
							
            default:
	       console.log("Ocurrió un error al guardar!");
         }
      });
   }else{
      $("#modalEditarDocumentoSubcontratista").modal("hide");
        
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
 	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarDocumentoSubcontratista").modal("show");    
      }); 
   }
}
