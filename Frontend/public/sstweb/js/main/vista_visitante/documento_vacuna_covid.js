
var documentosVacCovVisObj = {};
var listDocumentosVacCovVis=[],listTipoVacunaCovid=[];
var indexDocumentosVacCovVis;
var mensajeUx;

function toggleMenuOpcionDocumentoVacunaCovidVisitante(obj,pindex){
   documentosVacCovVisObj = listDocumentosVacCovVis[pindex]; 
   indexDocumentosVacCovVis = pindex;
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesDocumentoVacunaCovidVisitante=[
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
    functionClick:function(data){editarDocumentoVacunaCovidVisitante()}}
];

function marcarSubOpcionDocumentoVacunaCovidVisitante(pindex){
   funcionalidadesDocumentoVacunaCovidVisitante[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarDocumentoVacunaCovidVisitante(){ 
   var dataParam={
      tipoDocumentoPersonalExternoId: 5
   };
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/public/visitante/documento',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	    var textIn= "";
 			
 	    listDocumentosVacCovVis = data.documentos;
 	    listTipoVacunaCovid = data.listTipoVacunaCovid;
 	    
 	    $(".divListPrincipal").html("");
 	     
 	    var textTotal = "";
 	     
 	    listDocumentosVacCovVis.forEach(function(val,index){
               var btnOpcion="",menuOpcion="",colorFondo="";
               var textDescargaCarVac="------",textDescargaDni="------";
  	        
  	       if(val.evaluacionDoc.id != 1){
  	          menuOpcion="<ul class='list-group listaFinalGestionGosst'>";
  	        
  	             funcionalidadesDocumentoVacunaCovidVisitante.forEach(function(val1,index1){
  		        menuOpcion +=
  		           "<li class='list-group-item' onclick='marcarSubOpcionDocumentoVacunaCovidVisitante("+index1+")'>"+
  		               val1.nombre+
  		           "</li>";
  	             });
  		
  	          menuOpcion+="</ul>";
  			
  	          btnOpcion = 
  	             "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionDocumentoVacunaCovidVisitante(this,"+index+")'>" +
  	                "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
  	             "</a>";
  	       }
  	       
  	       if(val.evidenciaVacunacionNombre != ""){
  		  textDescargaCarVac =
	             "<a class='efectoLink' target='_blank' " +
	                "href='"+URL+"/public/visitante/documento/vacunacion/evidencia?id="+val.id+"'>" +
	                 val.evidenciaVacunacionNombre +
	             "</a>";
 	       }
  	       
  	       if(val.evidenciaDniNombre != ""){
 		  textDescargaDni =
	             "<a class='efectoLink' target='_blank' " +
	                "href='"+URL+"/public/visitante/documento/trabajador_dni/evidencia?id="+val.id+"'>" +
	                 val.evidenciaDniNombre +
	             "</a>";
	       }
  	       
  	       var listTotal=[
  	          {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
  	           label:"<span style='font-size:18px;font-weight:bolder;'>*** DATOS GENERALES ***</span>"},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	           label:"<i class='fa fa-calendar'></i> Fecha última dosis:",
  	           inputForm:val.fechaUltimaDosisTexto},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	           label:"<i class='fa fa-list'></i> Tipo vacuna <br>COVID-19:",
  	  	   inputForm:val.tipoVacunaCovid.nombre},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	   label:"<i class='fa fa-file'></i> Evidencia - Carné de vacunación:",
  	  	   inputForm:textDescargaCarVac},
  	  	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	   label:"<i class='fa fa-file'></i> Evidencia - DNI <br>(Parte frontal):",
  	  	   inputForm:textDescargaDni},
  	  	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	   label:"<i class='fa fa-calendar'></i> Registrado el ",
  	  	   inputForm:val.fechaActualizacionTexto},
  	  	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	  	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
  	  	   label:"<span style='font-size:18px;font-weight:bolder;color:blue;'>*** EVALUACIÓN ***</span>"},
  	  	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	  	  {sugerencia:"",
	 	   label:"<i class='fa fa-pencil-square-o'></i> Estado ",
	 	   inputForm:val.evaluacionDoc.icono+" "+val.evaluacionDoc.nombre}
  	       ]; 
  	        
  	       colorFondo = 
  	          (val.evaluacionDoc.id == -1?"gray":
	             (val.evaluacionDoc.id == 1?"#9BBB59":
	                (val.evaluacionDoc.id == 2?"#C0504D":"#df9226")));
  	       
  	       if(val.evaluacionDoc.id != 3){
 		  if(val.evaluacionDoc.id == 1){
 		     listTotal.push(
 	  	        {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	  	         label:"<i class='fa fa-calendar'></i> Evaluado el ",
 	  	         inputForm:val.fechaDocEvaluacionTexto});  
 		  }else{
 		     listTotal.push(
 	                {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	  	         label:"<i class='fa fa-exclamation-circle'></i> Observación:",
 	  	         inputForm:val.evaluacionDoc.observacion},
 	  	        {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	    	         label:"<i class='fa fa-calendar'></i> Evaluado el ",
 	    	         inputForm:val.fechaDocEvaluacionTexto});
 		  }
  	       }
 				
  	       textTotal += "<div class='eventoGeneral' style='border-left:10px solid "+colorFondo+";'>" ;
// 	       		     "<form class='eventoGeneral'>";	   					
 		
 	          listTotal.forEach(function(val,index){
 	             textTotal+=""+obtenerSubPanelModuloVersionDos(val);
 	          });
 		   
 	       textTotal += "</div>";
 	    });
             
 	    var textNuevo = "";
    	     
    	    textNuevo = 
               "<div id='estadoMovilModificarVacunaCovidVisitante'>" +
    	          "<div class='tituloSubList'> Nuevo registro - Vacuna COVID-19 " +
    	             "<button style='font-size:19px' title='Registrar nuevo documento Vacuna COVID-19.' " +
    	                     "class='btn btn-success' onclick='registrarNuevoDocumentoVacunaCovidVisitante()'>"+
    	                "<i class='fa fa-plus-square'></i> Registrar" +
    	             "</button>" +
    	          "</div>" +
    	          "<div class='contenidoSubList' style='display:none'>" +
    	          "</div>" +
    	       "</div>";
    	     
    	    $(".divListPrincipal").append(textNuevo);

    	    listPanelesPrincipal.push(
 	       {id:"infoMovilVacunaCovidVisitante",clase:"",styleContenido:"",
 	 	nombre:"Registros Vacuna COVID-19 ("+listDocumentosVacCovVis.length+")",
 	        contenido:""+textTotal});
 			
    	    agregarPanelesDivPrincipalStyle(listPanelesPrincipal,"");
 			
 	    $(".listaFinalGestionGosst").hide();
 	    $(".contenidoFormVisible").hide();
 	    break;
 	     
         default:
 	    alert("nop");
 	    break;
      }
   });
}

function registrarNuevoDocumentoVacunaCovidVisitante(){
   documentosVacCovVisObj={
      id: 0,tipoVacunaCovid:{id:""}};
   
   editarDocumentoVacunaCovidVisitante();
}

function editarDocumentoVacunaCovidVisitante(){
   var selTipoVacunaCovid = crearSelectOneMenuOblig("selTipoVacunaCovid","",
      listTipoVacunaCovid,documentosVacCovVisObj.tipoVacunaCovid.id,"id","nombre");
    
   var listItemsRegistro=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Fecha última dosis",
       inputForm:"<input class='form-control' type='date' id='inputFechaUltimaDosisVis'>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Tipo vacuna COVID-19",
       inputForm:selTipoVacunaCovid,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia - Carné de vacunación",
       inputForm:"",divContainer:"divEviCarneVacunacionVis"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia - DNI (Parte frontal)",
       inputForm:"",divContainer:"divEviDniVis"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0", 
       label:"<span style='color:red;font-size:10px;font-weight:bolder;'>NOTA:</span> " +
             "<span style='font-size:10px;font-weight:bolder;'> " +
                "Todos los datos expresados en esta ficha constituye " +
   		"una declaración jurada de mi parte. <br>" +
   		"He sido informado que, de omitir o falsear información, puedo perjudicar la salud de mis compañeros, " +
   		"y la mía propia, lo cual, de constituir una falta grave a la salud pública, asumo sus consecuencias." +
             "</span>",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",label:"",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
           	    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
           	 "</button>"} 
   ];
    
   var textFormRegistro="";
 	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var opciones={
      id:"modalEditarDocumentoVacCovVis",
      nombre:"Registro Vacuna - COVID-19",
      contenido:"<form id='formEditarDocumentoVacCovVis' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
    
   crearModalPrincipalUsuario(opciones,function(){},false,true);
   	
   var editarDiv = $("#formEditarDocumentoVacCovVis");
 	
   if(documentosVacCovVisObj.id > 0){
      editarDiv.find("#inputFechaUltimaDosisVis").val(convertirFechaInput(documentosVacCovVisObj.fechaUltimaDosis));
   }
   
   var optionsCarVac={
      container: "#divEviCarneVacunacionVis",
      functionCall: function(){},
      descargaUrl: (documentosVacCovVisObj.id == 0?"":
	            "/public/visitante/documento/vacunacion/evidencia?id="+documentosVacCovVisObj.id),
      esNuevo: (documentosVacCovVisObj.id == 0),
      idAux: "DocCarVacVis"+documentosVacCovVisObj.id,
      evidenciaNombre: (documentosVacCovVisObj.id == 0?
	                "":documentosVacCovVisObj.evidenciaVacunacionNombre),
      mensajeAux:"*Subir cartilla de vacunación física/electrónica con 2 dosis de vacuna " +
	         "o más (excepto Johnson & Johnson, que puede ser una)."
   };

   crearFormEvidenciaCompleta(optionsCarVac);
   
   var optionsDni={
      container: "#divEviDniVis",
      functionCall: function(){},
      descargaUrl: (documentosVacCovVisObj.id == 0?"":
		    "/public/visitante/documento/trabajador_dni/evidencia?id="+documentosVacCovVisObj.id),
      esNuevo: (documentosVacCovVisObj.id == 0),
      idAux: "DocDniVis"+documentosVacCovVisObj.id,
      evidenciaNombre: (documentosVacCovVisObj.id == 0?
		        "":documentosVacCovVisObj.evidenciaDniNombre),
      mensajeAux:"*El DNI se solicita para poder verificar en el MINSA la validez del " +
      		 "certificado de vacunación."
   };

   crearFormEvidenciaCompleta(optionsDni);
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDocumentoVacunaCovidVisitante();
   });
}

function guardarDocumentoVacunaCovidVisitante(){
   var campoVacio = true; 
    
   var tipoVacunaCovidId = parseInt($("#selTipoVacunaCovid").val());
   
   var fechaUltimaDosis = convertirFechaTexto($("#inputFechaUltimaDosisVis").val());
   var inputFechaUltimaDosis;
  
   if(!fechaUltimaDosis){  
      inputFechaUltimaDosis = null;
   }else{
      inputFechaUltimaDosis = fechaUltimaDosis;
   }
   
   var inputEviCarVacVis = $("#inputEviDocCarVacVis"+documentosVacCovVisObj.id).val();
   var inputEviDniVis = $("#inputEviDocDniVis"+documentosVacCovVisObj.id).val();
    
   if(inputEviCarVacVis.length == 0 || inputEviDniVis.length == 0 || 
      inputFechaUltimaDosis == null){
      campoVacio = false;
   }
    
   if(campoVacio){
      var dataParam={
	 id: documentosVacCovVisObj.id,
	 tipoDocumentoPersonalExternoId: 5,
	 fechaUltimaDosis: fechaUltimaDosis,
	 tipoVacunaCovid: {id: tipoVacunaCovidId}
      		    }
      
      callAjaxPost(URL+"/public/visitante/documento/save",dataParam,function(data){
	 guardarEvidenciaAuto(data.nuevoId,"fileEviDocCarVacVis"+documentosVacCovVisObj.id,
	    bitsEvidenciaDocPersonalExterno,"/public/visitante/documento/vacunacion/evidencia/save",function(){
	       guardarEvidenciaAuto(data.nuevoId,"fileEviDocDniVis"+documentosVacCovVisObj.id,
		  bitsEvidenciaDocPersonalExterno,"/public/visitante/documento/trabajador_dni/evidencia/save",function(){
		     $("#modalEditarDocumentoVacCovVis").remove();
		    
		     mensajeUx="<label>Los datos del registro Vacuna - COVID-19 fueron " +
		    	       "guardados con éxito.</label>";
		    
		     mensajesUx(mensajeUx,1,"","ActualizarSeccionDocVacCovVis");
			    
		     $("#modalMensajeUxActualizarSeccionDocVacCovVis").on("hidden.bs.modal",function(){
		        habilitarDocumentoVacunaCovidVisitante();
		     });
	          });
	    }); 
      });
   }else{
      $("#modalEditarDocumentoVacCovVis").modal("hide");
	       
      mensajeUx = "<label>Debe completar todos los campos.</label>";
	       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarDocumentoVacCovVis").modal("show");    
      });
   } 
}
