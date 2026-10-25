
var documentosSctrVisObj = {};
var listDocumentosSctrVis = [];
var listRespuestaSimple = [];
var valorIndicadorSctrVis;
var indexDocumentosSctrVis;
var mensajeUx;

function toggleMenuOpcionDocumentoSctrVisitante(obj,pindex){
   documentosSctrVisObj = listDocumentosSctrVis[pindex]; 
   indexDocumentosSctrVis = pindex;
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesDocumentoSctrVisitante=[
       {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
        functionClick:function(data){editarDocumentoSctrVisitante()}}
//       {id:"opcElimnar",nombre:"<i class='fa fa-times'></i> Eliminar",
//        functionClick:function(data){eliminarDocumentoSctrVisitante()}}
                                                 ]

function marcarSubOpcionDocumentoSctrVisitante(pindex){
   funcionalidadesDocumentoSctrVisitante[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarDocumentoSctrVisitante(){ 
   var dataParam={
      tipoDocumentoPersonalExternoId: 4
   };
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/public/visitante/documento',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	    var textIn= "";
 			
 	    listDocumentosSctrVis = data.documentos;
 	    listRespuestaSimple = data.respuesta;
 	    valorIndicadorSctrVis = data.valorIndicador;
 	    
 	    $(".divListPrincipal").html("");
 	     
 	    var textTotal="";
 	     
 	    listDocumentosSctrVis.forEach(function(val,index){
 	       var btnOpcion = "",menuOpcion = "";
 		 
 	       if(valorIndicadorSctrVis.indicadorDocRegVisita != 1 && index == 0){
 		  menuOpcion="<ul class='list-group listaFinalGestionGosst'>";
  	        
  	          funcionalidadesDocumentoSctrVisitante.forEach(function(val1,index1){
  		     menuOpcion += 
  	                "<li class='list-group-item' " +
  		            "onclick='marcarSubOpcionDocumentoSctrVisitante("+index1+")'>" +
  		            val1.nombre +
  		        "</li>";
  	          });
  		
  	          menuOpcion+="</ul>";
  			
  	          btnOpcion = 
  	             "<a class='btn-gestion efectoLink' " +
  	                "onclick='toggleMenuOpcionDocumentoSctrVisitante(this,"+index+")'>" +
  	                "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
  	             "</a>" ;
 	       }
  	        
 	       var listTotal=[
 	  	  {sugerencia:"",
 	  	   label:"<i class='fa fa-calendar'></i> Fecha de la visita",
 	  	   inputForm:val.fechaVisitaTexto+btnOpcion+menuOpcion},
 	  	  {sugerencia:"",
 	  	   label:"<i class='fa fa-check-square-o'></i> N° días de visita ",
 	  	   inputForm:val.numeroDiasVisita},
 	  	  {sugerencia:"",
 	  	   label:"<i class='fa fa-calendar'></i> Fecha fin de la visita",
 	  	   inputForm:val.fechaFinVisitaTexto}, 
 	  	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	  	  {sugerencia:"",
 	  	   label:"<i class='fa fa-check-square-o'></i> ¿Requiere de un SCTR?* ",
 	  	   inputForm:val.respuestaVisitaLugarRiesgo.nombre},
 	  	  {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
 	  	   label:"<span style='font-size:10px;font-weight:bolder;'>*Trabajos que no requieren SCTR</span>",
 	  	   inputForm:"<span style='font-size:10px;font-weight:bolder;'>" +
 	  	 	        "Personas que no efectúan labores, tales como carteros, mensajería, delivery, personas " +
 	  	 	       	"que recogen muestras específicas de laboratorio, personas que visualizan un ensayo en " +
 	  	 	        "algún laboratorio, reunión, toma de fotografías, periodistas u otras similares." +
 	  	 	     "</span>"}
 	       ]; 
 	        
 	       if(val.respuestaVisitaLugarRiesgo.id == 1){
 		  listTotal.push(
                     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                     {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
                      label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
                               "SCTR " +
                            "</span>"},
 		     {sugerencia:"",
 	 	      label:"<i class='fa fa-calendar'></i> Fecha inicio de vigencia",
 	 	      inputForm:val.fechaInicioVigenciaSctrTexto}, 
 	 	     {sugerencia:"",
 	 	      label:"<i class='fa fa-calendar'></i> Fecha fin de vigencia",
 	 	      inputForm:val.fechaFinVigenciaTexto}, 
 	 	     {sugerencia:"",
 	 	      label:"<i class='fa fa-check-square-o'></i> Evidencia",
 	 	      inputForm:"<a class='efectoLink' " +
 	 	  	 	   "href='"+URL+"/public/visitante/documento/evidencia?id="+val.id+"'>"+
 	 	  	 	    val.evidenciaNombre+
 	 	  	 	"</a>"},
 	 	     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
 		  );   
 	       }else{
 		  listTotal.push(
 	             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}); 
 	       }
 	       
 	       listTotal.push(
 	          {sugerencia:"",
 		   label:"¿Requiere de un Seguro de Accidente Personal? ",
 	           inputForm:val.respuestaVisitaSap.nombre,divContainer:""});
 	       
 	      if(val.respuestaVisitaSap.id == 1){
 		 listTotal.push(
 	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	             label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
 	                      "Seguro de Accidente Personal " +
 	                   "</span>"},
 	            {sugerencia:"",
 	 	     label:"<i class='fa fa-calendar'></i> Fecha inicio de vigencia",
 	 	     inputForm:val.fechaInicioVigenciaSapTexto}, 
 	 	    {sugerencia:"",
 	 	     label:"<i class='fa fa-calendar'></i> Fecha fin de vigencia",
 	 	     inputForm:val.fechaFinVigenciaSapTexto}, 
 	 	    {sugerencia:"",
 	 	     label:"<i class='fa fa-check-square-o'></i> Evidencia",
 	 	     inputForm:"<a class='efectoLink' " +
 	 	 	          "href='"+URL+"/public/visitante/documento_sap/evidencia?id="+val.id+"'>"+
 	 	 	  	   val.evidenciaSapNombre+
 	 	 	       "</a>"},
 	 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""});    
 	      }else{
 		 listTotal.push(
 	 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""});  
 	      }
 	       
 	      listTotal.push( 	 
 	         {sugerencia:"",
 	          label:"<i class='fa fa-check-square-o'></i> Número de contacto personal ",
 	          inputForm:val.numeroContactoPersonal},
 	         {sugerencia:"",
 	          label:"<i class='fa fa-check-square-o'></i> Contacto - "+getSession("empresaNombre"),
 	          inputForm:val.contactoEmpresa},
 	         {sugerencia:"",
 	          label:"<i class='fa fa-check-square-o'></i> Detalle de la actividad ",
 	          inputForm:val.detalleVisitaActividad},
 	         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	         {sugerencia:"",
  	          label:"<i class='fa fa-pencil-square-o'></i> Registrado el ",
  	          inputForm:val.fechaActualizacionTexto});
 	      
 	      if(val.respuestaVisitaLugarRiesgo.id == 1 || val.respuestaVisitaSap.id == 1){
 		 listTotal.push(  
 	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	 	     label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
 	 	 	      "EVALUACIÓN DEL REGISTRO " +
 	 	 	   "</span>"},
 	 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	    {sugerencia:"",
	 	     label:"<i class='fa fa-pencil-square-o'></i> Estado ",
	 	     inputForm:val.evaluacionDoc.icono+" "+val.evaluacionDoc.nombre});
 		 
 		 if(val.evaluacionDoc.id != 1 && val.evaluacionDoc.id != 3){
  	            listTotal.push(
  	               {sugerencia:"",
	 	        label:"<i class='fa fa-pencil-square-o'></i> Observación ",
	 	        inputForm:val.evaluacionDoc.observacion},
	 	       {sugerencia:"",
	 	        label:"<i class='fa fa-pencil-square-o'></i> Evaluado el ",
	 	        inputForm:val.fechaDocEvaluacionTexto});
  	         }
 	      }  
 	      
 	  	 	  
 	        textTotal+="<div class='eventoGeneral'>" +
 	       		      "<form class='eventoGeneral'>";	   					
 		
 	        listTotal.forEach(function(val,index){
 	           textTotal+=""+obtenerSubPanelModuloVersionDos(val);
 	        });
 		   
 	        textTotal+=   "</form>" +
 	       		   "</div>";
 	        textTotal+="<div class='divMovilSctrVisitante' " +
 	        		 "id='divSctrVisitante"+val.id+"'></div>";
 	     });
             
// 	     if(valorIndicadorSctrVis.indicadorDocRegVisita == 0){
    	        var textNuevo ="";
    	     
    	        textNuevo = "<div id='estadoMovilModificarSctrVisitante'>" +
    	                       "<div class='tituloSubList'> Nuevo registro - Visita " +
    	                          "<button style='font-size:19px' title='Registrar nueva visita a realizarse/realizada.' " +
    	                                  "class='btn btn-success' onclick='registrarNuevoDocumentoSctrVisitante()'>"+
    	                             "<i class='fa fa-plus-square'></i> Registrar" +
    	                          "</button>" +
    	                       "</div>" +
    	                       "<div class='contenidoSubList' style='display:none'>" +
    	                       "</div>" +
    	                    "</div>";
    	     
    	        $(".divListPrincipal").append(textNuevo);
// 	     }
 	    
    	     listPanelesPrincipal.push(
 	        {id:"infoMovilSctrVisitante",clase:"",
 	 	 nombre:""+"Registros Visita ("+listDocumentosSctrVis.length+")",
 	         contenido:""+textTotal}
 	     );
 			
 	     agregarPanelesDivPrincipal(listPanelesPrincipal);
 			
 	     $(".listaFinalGestionGosst").hide();
 	     $(".contenidoFormVisible").hide();
 	     break;
 	     
         default:
 	     alert("nop");
 	     break;
      }
   });
}

function registrarNuevoDocumentoSctrVisitante(){
   documentosSctrVisObj={id:0};
   
   editarDocumentoSctrVisitante();
}

function editarDocumentoSctrVisitante(){
   $("#modalEditarDocumentoSctrVis").remove();
    
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
       return val2.id - val.id;
    });
    
   var radiosPreguntaVisLugRie = crearRadiosAuto("radioPreguntaVisitaLugarRiesgo",listBooleanSiNo,
      (documentosSctrVisObj.id == 0?"":documentosSctrVisObj.respuestaVisitaLugarRiesgo.id),
      "id","nombre","habilitarCamposSctrFormularioVisitante");
   
   var radiosPreguntaSegAccPerLugRie = crearRadiosAuto("radiosPreguntaSeguroAccPersonalLugRie", 
      listBooleanSiNo,(documentosSctrVisObj.id == 0?"":documentosSctrVisObj.respuestaVisitaSap.id),
      "id","nombre","habilitarCamposSeguroAccPersonalFormularioVisitante");
    
   var listItemsRegistro=[
      {sugerencia:"",label:"Fecha de la visita",
       inputForm:"<input type='date' id='inputFechaVisSctrVis' class='form-control' " +
           		"onchange='calcularFechaFinVigenciaVisita()' " +
           		"max='"+sumaFechaDias(30,getSession("fechaHoyOrdenInversoTexto"))+"'>",
       divContainer:""},
      {sugerencia:"",
       label:"N° días de visita",
       inputForm:"<input type='number' id='inputNumDiasVisSctrVis' class='form-control' " +
           		"min='0' max='365' onchange='calcularFechaFinVigenciaVisita()'>",
       divContainer:""},
      {sugerencia:"",label:"Fecha fin de la visita",
       inputForm:"<label id='labelFechaFinVigSctrVis'></label>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"¿Requiere de un SCTR?* ",
       inputForm:radiosPreguntaVisLugRie,divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
       label:"<span style='font-size:10px;font-weight:bolder;'>*Trabajos que no requieren SCTR</span>",
       inputForm:"<span style='font-size:10px;font-weight:bolder;'>" +
       		    "Personas que no efectúan labores, tales como carteros, mensajería, delivery, personas " +
	            "que recogen muestras específicas de laboratorio, personas que visualizan un ensayo en " +
	            "algún laboratorio, reunión, toma de fotografías, periodistas u otras similares." +
	         "</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
       label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
	        "SCTR " +
	     "</span>"},
      {sugerencia:"",label:"Fecha inicio de vigencia",
       inputForm:"<input type='date' id='inputFechaIniVigSctrVis' class='form-control'>",
       divContainer:""},
      {sugerencia:"",label:"Fecha fin de vigencia",
       inputForm:"<input type='date' id='inputFechaFinVigSctrVis' class='form-control'>",
       divContainer:""},
      {sugerencia:"",label:"Evidencia",
       inputForm:"",divContainer:"divEvidenciaSctrVis"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"¿Requiere de un Seguro de Accidente Personal? ",
       inputForm:radiosPreguntaSegAccPerLugRie,divContainer:""},
//      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
//       label:"<span style='font-size:10px;font-weight:bolder;'>**Trabajos que no requieren Seguro de Accidente Personal</span>",
//       inputForm:"<span style='font-size:10px;font-weight:bolder;'>" +
//	       	    "Texto de apoyo" +
//		 "</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
       label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
                "Seguro de Accidente Personal " +
             "</span>"},
      {sugerencia:"",label:"Fecha inicio de vigencia",
       inputForm:"<input type='date' id='inputFechaIniVigSegAccPerVis' class='form-control'>",
       divContainer:""}, 
      {sugerencia:"",label:"Fecha fin de vigencia",
       inputForm:"<input type='date' id='inputFechaFinVigSegAccPerVis' class='form-control'>",
       divContainer:""},
      {sugerencia:"",label:"Evidencia",
       inputForm:"",divContainer:"divEvidenciaSegAccPerVis"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"Número de contacto personal",
       inputForm:"<input class='form-control' id='inputNumConPersonalSctrVis'>"},
      {sugerencia:"",
       label:"Contacto - "+getSession("empresaNombre"),
       inputForm:"<input class='form-control' id='inputNomConEmpSctrVis'>"},
      {sugerencia:"",label:"Detalle de la actividad ",
       inputForm:"<textarea class='form-control' id='textAreaDetalleActSctrVis' rows='5'></textarea>",
       divContainer:""},
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
      id: "modalEditarDocumentoSctrVis",
      nombre: "Registro de la visita",
      contenido: "<form id='formEditarDocumentoSctrVis' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
    
   crearModalPrincipalUsuario(opciones,function(){},false,true);
   	
   var editarDiv = $("#formEditarDocumentoSctrVis");
   	
   if(documentosSctrVisObj.id > 0){
      editarDiv.find("#inputFechaVisSctrVis").val(convertirFechaInput(documentosSctrVisObj.fechaVisita));
      editarDiv.find("#inputNumDiasVisSctrVis").val(documentosSctrVisObj.numeroDiasVisita);
       
      if(documentosSctrVisObj.respuestaVisitaLugarRiesgo.id == 1){
	 editarDiv.find("#inputFechaIniVigSctrVis")
	 .val(convertirFechaInput(documentosSctrVisObj.fechaInicioVigenciaSctr));
	 editarDiv.find("#inputFechaFinVigSctrVis")
	 .val(convertirFechaInput(documentosSctrVisObj.fechaFinVigencia));
      } 
      
      if(documentosSctrVisObj.respuestaVisitaSap.id == 1){
	 editarDiv.find("#inputFechaIniVigSegAccPerVis")
	 .val(convertirFechaInput(documentosSctrVisObj.fechaInicioVigenciaSap));
	 editarDiv.find("#inputFechaFinVigSegAccPerVis")
	 .val(convertirFechaInput(documentosSctrVisObj.fechaFinVigenciaSap));
      } 
      
      editarDiv.find("#inputNumConPersonalSctrVis").val(documentosSctrVisObj.numeroContactoPersonal);
      editarDiv.find("#inputNomConEmpSctrVis").val(documentosSctrVisObj.contactoEmpresa);
      editarDiv.find("#textAreaDetalleActSctrVis").val(documentosSctrVisObj.detalleVisitaActividad);
   }else{
      editarDiv.find("#inputNumDiasVisSctrVis").val(0); 
   }
   
   var options={
      container: "#divEvidenciaSctrVis",
      functionCall: function(){},
      descargaUrl: (documentosSctrVisObj.id == 0?"":
                    "/public/visitante/documento/evidencia?id="+documentosSctrVisObj.id),
      esNuevo: (documentosSctrVisObj.id == 0),
      idAux: "DocSctrVis",
      evidenciaNombre: (documentosSctrVisObj.id == 0?"":documentosSctrVisObj.evidenciaNombre)
   };

   crearFormEvidenciaCompleta(options);
   
   var optionsSegAccPer={
      container: "#divEvidenciaSegAccPerVis",
      functionCall: function(){},
      descargaUrl: (documentosSctrVisObj.id == 0?"":
	           "/public/visitante/documento_sap/evidencia?id="+documentosSctrVisObj.id),	
      esNuevo: (documentosSctrVisObj.id == 0),
      idAux: "DocSegAccPerVis",
      evidenciaNombre: (documentosSctrVisObj.id == 0?"":documentosSctrVisObj.evidenciaSapNombre)
   };

   crearFormEvidenciaCompleta(optionsSegAccPer);
   
   if(documentosSctrVisObj.id > 0){
      habilitarCamposSctrFormularioVisitante(documentosSctrVisObj.respuestaVisitaLugarRiesgo.id); 
      habilitarCamposSeguroAccPersonalFormularioVisitante(documentosSctrVisObj.respuestaVisitaSap.id);
      calcularFechaFinVigenciaVisita();
   }else{
      habilitarCamposSctrFormularioVisitante(0); 
      habilitarCamposSeguroAccPersonalFormularioVisitante(0);
   }
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDocumentoSctrVisitante();
   });
}

function habilitarCamposSctrFormularioVisitante(valResp){ 
   var valRespVisita = valResp;
    
   if(valRespVisita == 1){
      document.getElementById("inputFechaIniVigSctrVis").disabled = false; 
      document.getElementById("inputFechaFinVigSctrVis").disabled = false; 
      document.getElementById("fileEviDocSctrVis").disabled = false;
   }else{
      document.getElementById("inputFechaIniVigSctrVis").disabled = true;
      document.getElementById("inputFechaIniVigSctrVis").value = null;
      
      document.getElementById("inputFechaFinVigSctrVis").disabled = true;
      document.getElementById("inputFechaFinVigSctrVis").value = null;
      
      document.getElementById("fileEviDocSctrVis").disabled = true;
      document.getElementById("fileEviDocSctrVis").value = null;
      document.getElementById("inputEviDocSctrVis").value = null;
   }
}

function habilitarCamposSeguroAccPersonalFormularioVisitante(valResp){
   var valRespSegAccPer = valResp;
    
   if(valRespSegAccPer == 1){
      document.getElementById("inputFechaIniVigSegAccPerVis").disabled = false; 
      document.getElementById("inputFechaFinVigSegAccPerVis").disabled = false; 
      document.getElementById("fileEviDocSegAccPerVis").disabled = false;
   }else{
      document.getElementById("inputFechaIniVigSegAccPerVis").disabled = true;
      document.getElementById("inputFechaIniVigSegAccPerVis").value = null;
       
      document.getElementById("inputFechaFinVigSegAccPerVis").disabled = true;
      document.getElementById("inputFechaFinVigSegAccPerVis").value = null;
       
      document.getElementById("fileEviDocSegAccPerVis").disabled = true;
      document.getElementById("fileEviDocSegAccPerVis").value = null;
      document.getElementById("inputEviDocSegAccPerVis").value = null;
   }  
}

function calcularFechaFinVigenciaVisita(){
   var fechaFinVigenciaSctr = 
          convertirFechaNormal(sumaFechaDias(parseInt($("#inputNumDiasVisSctrVis").val()),
                               $("#inputFechaVisSctrVis").val()));
    
   if(fechaFinVigenciaSctr != 'aN-aN-NaN'){
      document.querySelector('#labelFechaFinVigSctrVis').innerText = fechaFinVigenciaSctr;
   }else{
      document.querySelector('#labelFechaFinVigSctrVis').innerText = "";
   }
}

function guardarDocumentoSctrVisitante(){
   var campoVacio = true; 
   
   var fechaVisita = convertirFechaTexto($("#inputFechaVisSctrVis").val());
   var inputFechaVisita;
   
   if(!fechaVisita){  
      inputFechaVisita = null;
      mensajeUx = "<label>Debe ingresar la fecha de visita.</label>";
      campoVacio = false;
   }else{
      inputFechaVisita = fechaVisita;
   }
   
   var numeroDiasVisita = parseInt($("#inputNumDiasVisSctrVis").val());
   
   if(numeroDiasVisita == 0 && campoVacio){
      mensajeUx = "<label>El N° días de visita debe ser mayor a 0.</label>";
      campoVacio = false;
   }
   
   if(inputFechaVisita != null && numeroDiasVisita != 0 && campoVacio){
      var fechaFinVisita = 
	 convertirFechaTexto(sumaFechaDias(parseInt($("#inputNumDiasVisSctrVis").val()),
                                           $("#inputFechaVisSctrVis").val()));
   }
   
   var respuestaVisitaLugarRiesgo = parseInt($("input[name='radioPreguntaVisitaLugarRiesgo']:checked").val());
   
   if(isNaN(respuestaVisitaLugarRiesgo) == true && campoVacio){
      mensajeUx = "<label>Debe responder a la pregunta relacionada al SCTR.</label>"; 
      campoVacio = false;
   }
   
   if(respuestaVisitaLugarRiesgo == 1 && campoVacio){
      var fechaInicioVigSctr = convertirFechaTexto($("#inputFechaIniVigSctrVis").val());
      var inputFechaInicioVigSctr;
       
      if(!fechaInicioVigSctr){  
	 inputFechaInicioVigSctr = null;
	 mensajeUx = "<label>Debe ingresar la fecha inicio de vigencia del SCTR.</label>"; 
	 campoVacio = false;
      }else{
	 inputFechaInicioVigSctr = fechaInicioVigSctr;
      }
       
      var fechaFinVigSctr = convertirFechaTexto($("#inputFechaFinVigSctrVis").val());
      var inputFechaFinVigSctr;
       
      if(!fechaFinVigSctr){  
	 inputFechaFinVigSctr = null;
	 mensajeUx = "<label>Debe ingresar la fecha fin de vigencia del SCTR.</label>"; 
	 campoVacio = false;
      }else{
	 inputFechaFinVigSctr = fechaFinVigSctr;
      }
       
      var evidenciaNombre = $("#inputEviDocSctrVis").val();
      
      if(evidenciaNombre.length == 0 && campoVacio){
	 mensajeUx = "<label>Debe ingresar la evidencia del SCTR.</label>"; 
	 campoVacio = false; 
      }
      
      if(campoVacio){
	 var restarFechaInicioSctr =  
	    restaFechas($("#inputFechaIniVigSctrVis").val(),$("#inputFechaVisSctrVis").val());
	 
	 var restarFechaFinSctr = 
	    restaFechas(sumaFechaDias(parseInt($("#inputNumDiasVisSctrVis").val()),
                                      $("#inputFechaVisSctrVis").val()),
                        $("#inputFechaFinVigSctrVis").val());
	  
         if(restarFechaInicioSctr < 0 || restarFechaFinSctr < 0){
            campoVacio = false;
            mensajeUx = "<label>El SCTR no está vigente durante el intervalo " +
	                 "de tiempo de la visita registrada.</label>";
         }
      }
   }
   
   var respuestaSeguroAccPersonal = parseInt($("input[name='radiosPreguntaSeguroAccPersonalLugRie']:checked").val());
   
   if(isNaN(respuestaSeguroAccPersonal) == true && campoVacio){
      mensajeUx = "<label>Debe responder a la pregunta relacionada al Seguro de Accidente Personal.</label>"; 
      campoVacio = false;
   }
   
   if(respuestaSeguroAccPersonal == 1 && campoVacio){
      var fechaInicioVigSegAccPer = convertirFechaTexto($("#inputFechaIniVigSegAccPerVis").val());
      var inputFechaInicioVigSegAccPer;
       
      if(!fechaInicioVigSegAccPer){  
	 inputFechaInicioVigSegAccPer = null;
	 mensajeUx = "<label>Debe ingresar la fecha inicio de vigencia del Seguro de Accidente Personal.</label>"; 
	 campoVacio = false;
      }else{
	 inputFechaInicioVigSegAccPer = fechaInicioVigSegAccPer;
      }
       
      var fechaFinVigSegAccPer = convertirFechaTexto($("#inputFechaFinVigSegAccPerVis").val());
      var inputFechaFinVigSegAccPer;
       
      if(!fechaFinVigSegAccPer){  
	 inputFechaFinVigSegAccPer = null;
	 mensajeUx = "<label>Debe ingresar la fecha fin de vigencia del Seguro de Accidente Personal.</label>"; 
	 campoVacio = false;
      }else{
	 inputFechaFinVigSegAccPer = fechaFinVigSegAccPer;
      }
       
      var evidenciaNombreSegAccPer = $("#inputEviDocSegAccPerVis").val();
      
      if(evidenciaNombreSegAccPer.length == 0 && campoVacio){
	 mensajeUx = "<label>Debe ingresar la evidencia del Seguro de Accidente Personal.</label>"; 
	 campoVacio = false; 
      }
      
      if(campoVacio){
         var restarFechaInicioSegAccPer =  
	    restaFechas($("#inputFechaIniVigSegAccPerVis").val(),$("#inputFechaVisSctrVis").val());
		 
         var restarFechaFinSegAccPer = 
	    restaFechas(sumaFechaDias(parseInt($("#inputNumDiasVisSctrVis").val()),
	                              $("#inputFechaVisSctrVis").val()),
	                $("#inputFechaFinVigSegAccPerVis").val());
		  
         if(restarFechaInicioSegAccPer < 0 || restarFechaFinSegAccPer < 0){
	    campoVacio = false;
	    mensajeUx = "<label>El Seguro de Accidente Personal no está vigente durante " +
	    		"el intervalo de tiempo de la visita registrada.</label>";
         }
      }
   }
   
   var numContactoPersonal = $("#inputNumConPersonalSctrVis").val();
   
   if(numContactoPersonal.length == 0 && campoVacio){
      mensajeUx = "<label>Debe ingresar el número de contacto personal.</label>"; 
      campoVacio = false;  
   }
   
   var contactoEmpresa = $("#inputNomConEmpSctrVis").val();
   
   if(contactoEmpresa.length == 0 && campoVacio){
       mensajeUx = "<label>Debe ingresar el contacto - "+getSession("empresaNombre")+".</label>"; 
       campoVacio = false;  
    }
   
   var detalleVisitaActividad = $("#textAreaDetalleActSctrVis").val();
   
   if(detalleVisitaActividad.length == 0 && campoVacio){
      mensajeUx = "<label>Debe ingresar el detalle de la actividad.</label>"; 
      campoVacio = false;  
   }
   
   if(campoVacio){
      var dataParam={
	 id: documentosSctrVisObj.id,
	 tipoDocumentoPersonalExternoId: 4,
	 fechaVisita: inputFechaVisita,
	 numeroDiasVisita: numeroDiasVisita,
	 fechaFinVisita: fechaFinVisita,
	 respuestaVisitaLugarRiesgo: {id: respuestaVisitaLugarRiesgo},
	 respuestaVisitaSap: {id: respuestaSeguroAccPersonal},
	 detalleVisitaActividad: detalleVisitaActividad,
	 numeroContactoPersonal: numContactoPersonal,
         contactoEmpresa: contactoEmpresa
      };
      
      if(respuestaVisitaLugarRiesgo == 1){ 
	 dataParam.fechaInicioVigenciaSctr = inputFechaInicioVigSctr;
	 dataParam.fechaFinVigencia = inputFechaFinVigSctr;
      }
      
      if(respuestaSeguroAccPersonal == 1){ 
	 dataParam.fechaInicioVigenciaSap = inputFechaInicioVigSegAccPer;
	 dataParam.fechaFinVigenciaSap = inputFechaFinVigSegAccPer;
      }
      
      callAjaxPost(URL+"/public/visitante/documento/save",dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05": 
	       guardarEvidenciaAuto(data.nuevoId,"fileEviDocSctrVis",bitsEvidenciaDocPersonalExterno,
               "/public/visitante/documento/evidencia/save",function(){
	        guardarEvidenciaAuto(data.nuevoId,"fileEviDocSegAccPerVis",bitsEvidenciaDocPersonalExterno,
                "/public/visitante/documento_sap/evidencia/save",function(){
	           $("#modalEditarDocumentoSctrVis").remove();
		    
	           mensajeUx="<label>Los datos del registro de la visita fueron guardados con éxito.</label>";
	    
	           mensajesUx(mensajeUx,1,"","ActualizarSeccionDocSctrVis");
		    
	           $("#modalMensajeUxActualizarSeccionDocSctrVis").on("hidden.bs.modal",function(){
		      habilitarDocumentoSctrVisitante();
	           });
	        }); 
	       });  	
	 
	       break;
		
	    default:
	       alert("Ocurrió un error al guardar el registro");
         }
      });
   }else{
      $("#modalEditarDocumentoSctrVis").modal("hide");
	       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarDocumentoSctrVis").modal("show");    
      });
   } 
}

function eliminarDocumentoSctrVisitante(){
   mensajeUx="<label>¿Está seguro de eliminar el registro Ficha " +
   	     "sintomatológica COVID-19 seleccionado?</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarDocSctrVis");

   $("#btnDevolverValorRespEliminarDocSctrVis").on("click",function(){
      var dataParam={
	     id:documentosSctrVisObj.id
      		    };

      callAjaxPost(URL+'/public/visitante/documento/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
		mensajeUx="<label>El registro SCTR se ha " +
	                  "eliminado correctamente.</label>";
		
		mensajesUx(mensajeUx,1,"");
		
		habilitarDocumentoSctrVisitante();
		break;
		
	    default:
		mensajeUx="Error al eliminar el registro.";
	    	mensajesUx(mensajeUx,2,"");	
         }
      });
   });
}
