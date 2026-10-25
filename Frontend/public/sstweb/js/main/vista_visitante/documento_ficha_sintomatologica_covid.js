
var documentosFicSinCovVisObj = {};
var listDocumentosFicSinCovVis = [];
var listRespuestaSimple = [];
var valorIndicadorFicSinCovVis;
var infoIndicadorVacCovVis;
var indexDocumentosFicSinCovVis;
var mensajeUx;

function toggleMenuOpcionDocumentoFichaSintomalogicaCovidVisitante(obj,pindex){
   documentosFicSinCovVisObj = listDocumentosFicSinCovVis[pindex]; 
   indexDocumentosFicSinCovVis = pindex;
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesDocumentoFichaSintomalogicaCovidVisitante=[
       {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
        functionClick:function(data){editarDocumentoFichaSintomalogicaCovidVisitante()}}
//       {id:"opcElimnar",nombre:"<i class='fa fa-times'></i> Eliminar",
//        functionClick:function(data){eliminarDocumentoFichaSintomalogicaCovidVisitante()}}
                                                 ]

function marcarSubOpcionDocumentoFichaSintomalogicaCovidVisitante(pindex){
   funcionalidadesDocumentoFichaSintomalogicaCovidVisitante[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarDocumentoFichaSintomalogicaCovidVisitante(){
   var dataParam={
      tipoDocumentoPersonalExternoId: 3
   };
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/public/visitante/documento',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	     var textIn= "";
 			
 	     listDocumentosFicSinCovVis = data.documentos;
 	     listRespuestaSimple = data.respuesta;
 	     valorIndicadorFicSinCovVis = data.valorIndicador;
 	     infoIndicadorVacCovVis = data.valorIndicadorVacCov;
 	     
 	     $(".divListPrincipal").html("");
 	     
 	     var textTotal="";
 	     
 	     listDocumentosFicSinCovVis.forEach(function(val,index){	
 		var btnOpcion = "",menuOpcion = "";
 		 
 		if(valorIndicadorFicSinCovVis.indicadorDocFichaSint != 1 && index == 0){
 		   menuOpcion="<ul class='list-group listaFinalGestionGosst'>";
  	              funcionalidadesDocumentoFichaSintomalogicaCovidVisitante.forEach(function(val1,index1){
  		         menuOpcion +=
  		            "<li class='list-group-item' " +
  		   	        "onclick='marcarSubOpcionDocumentoFichaSintomalogicaCovidVisitante("+index1+")'>"+
  		                val1.nombre+
  		            "</li>";
  	              });
  	           menuOpcion+="</ul>";
  			
  	           btnOpcion = "<a class='btn-gestion efectoLink' " +
  	        		  "onclick='toggleMenuOpcionDocumentoFichaSintomalogicaCovidVisitante(this,"+index+")'>" +
  			          "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
  			       "</a>";
 		} 	
  	        
 	        var listTotal=[
// 		   {sugerencia:"",
// 		    label:"<i class='fa fa-check-square-o'></i> ¿Tiene síntomas asociados al COVID-19?",
// 		    inputForm:val.respuestaSintomas.nombre+btnOpcion+menuOpcion},
// 		   {sugerencia:"",
// 		    label:"<i class='fa fa-check-square-o'></i> ¿Ha tenido contacto con algún caso confirmado " +
// 		          "o sospechoso de COVID-19 en los últimos días?",
// 		    inputForm:"<br><br>"+val.respuestaContacto.nombre},
 		   {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	    label:"<i class='fa fa-calendar'></i> Fecha de registro - Ficha sintomatológica COVID-19 ",
 	 	    inputForm:val.fechaRegistroTexto+btnOpcion+menuOpcion},
 	 	   {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	    label:"<i class='fa fa-calendar'></i> Fecha fin de vigencia - Ficha sintomatología COVID-19 ",
 	 	    inputForm:val.fechaFinVigenciaTexto},
 	 	   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
// 	           {sugerencia:"",
// 	 	    label:"<i class='fa fa-check-square-o'></i> Evidencia",
// 	 	    inputForm:"<a class='efectoLink' " +
// 	 	           	 "href='"+URL+"/public/visitante/documento/evidencia?id="+val.id+"'>"+
// 	 	                  val.evidenciaNombre+
// 	 	              "</a>"},
 	 	   {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	    label:"<i class='fa fa-check-square-o'></i> ¿Sensación de alza térmica, fiebre o malestar?",
 	 	    inputForm:"No"},
 	 	   {sugerencia:"",label:"",inputForm:"",divContainer:""},
 	 	   {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	    label:"<i class='fa fa-check-square-o'></i> ¿Dolor de garganta, tos, estornudos o dificultad para respirar? ",
 	 	    inputForm:"No"},
 	 	   {sugerencia:"",label:"",inputForm:"",divContainer:""},
 	 	   {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	    label:"<i class='fa fa-check-square-o'></i> ¿Dolor de cabeza, diarrea o congestión nasal? ",
 	 	    inputForm:"No"},
 	 	   {sugerencia:"",label:"",inputForm:"",divContainer:""},
 	 	   {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	    label:"<i class='fa fa-check-square-o'></i> ¿Pérdida del gusto y/o del olfato? ",
 	 	    inputForm:"No"},
 	 	   {sugerencia:"",label:"",inputForm:"",divContainer:""},
 	 	   {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	    label:"<i class='fa fa-check-square-o'></i> ¿Contacto con un caso confirmado de COVID-19? ",
 	 	    inputForm:"No"},
 	 	   {sugerencia:"",label:"",inputForm:"",divContainer:""},
 	 	   {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	    label:"<i class='fa fa-check-square-o'></i> ¿Pertenece al grupo de riesgo frente al COVID-19?* ",
 	 	    inputForm:val.respuestaGrupoRiesgo.nombre},
 	 	   {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
 	 	    label:"<span style='font-size:10px;font-weight:bolder;'>" +
 	 	             "*[Cáncer, Hipertensión arterial, Enfermedades cardiovasculares, Insuficiencia renal crónica, " +
 	 	             "EPOC (Enfermedad pulmonar Obstructiva crónica), Asma moderada o grave, Diabetes Mellitus, " +
 	 	             "Obesidad, Enfermedad o tratamiento Inmunosupresor (Inmunodeficiencias congénitas o adquirida) " +
 	 	             "incluido VIH, edad de 65 años a más, enfermedad cerebrovascular, Síndrome de Down, receptores " +
 	 	             "de trasplante de órganos, gestantes y puérperas y en periodo de lactancia]  " +
 	 	          "</span>",inputForm:"",divContainer:""},
 	 	   {sugerencia:"",label:"",inputForm:"",divContainer:""},
 	 	   {sugerencia:"",
 	 	    label:"<i class='fa fa-pencil-square-o'></i> Registrado el ",
 	 	    inputForm:val.fechaActualizacionTexto},
 	 	   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	 	   {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	 	    label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
 	 	 	     "EVALUACIÓN DEL REGISTRO " +
 	 	 	  "</span>"},
 	 	   {sugerencia:"",label:"",inputForm:"",divContainer:""},
 	 	   {sugerencia:"",
 	 	    label:"<i class='fa fa-pencil-square-o'></i> Estado ",
 	 	    inputForm:val.evaluacionDoc.icono+" "+val.evaluacionDoc.nombre}
// 	 	       {sugerencia:"",
// 	 	 	label:"<i class='fa fa-pencil-square-o'></i> Evaluado el ",
// 	 	 	inputForm:val.fechaDocEvaluacionTexto}
 			      ];
 	        
 	        if(val.evaluacionDoc.id != 1){
 	           listTotal.push({sugerencia:"",
 	 	      label:"<i class='fa fa-pencil-square-o'></i> Observación ",
 	 	      inputForm:val.evaluacionDoc.observacion});
 	        }
 				
 	        textTotal+="<div class='eventoGeneral'>" +
 	       		      "<form class='eventoGeneral'>";	   					
 		
 	        listTotal.forEach(function(val,index){
 	           textTotal+=""+obtenerSubPanelModuloVersionDos(val);
 	        });
 		   
 	        textTotal+=   "</form>" +
 	       		   "</div>";
 	     });
             
// 	     if(valorIndicadorFicSinCovVis.indicadorDocFichaSint == 0){
 	     
    	        var textNuevo ="";
    	     
    	        textNuevo = "<div id='estadoMovilModificarFichaSintomatologicaCovidVisitante'>" +
    	                       "<div class='tituloSubList'> Nuevo registro - Ficha sintomatológica COVID-19 " +
    	                          "<button style='font-size:19px' title='Registrar nuevo documento Ficha sintomatología COVID-19.' " +
    	                                  "class='btn btn-success' onclick='registrarNuevoDocumentoFichaSintomalogicaCovidVisitante()'>"+
    	                             "<i class='fa fa-plus-square'></i> Registrar" +
    	                          "</button>" +
    	                       "</div>" +
    	                       "<div class='contenidoSubList' style='display:none'>" +
    	                       "</div>" +
    	                    "</div>";
    	     
    	        $(".divListPrincipal").append(textNuevo);
// 	     }
    	     
    	     listPanelesPrincipal.push(
 	        {id:"infoMovilFichaSintomatologicaCovidVisitante",clase:"",
 	 	 nombre:""+"Registros Ficha sintomatológica COVID-19 ("+listDocumentosFicSinCovVis.length+")",
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

function registrarNuevoDocumentoFichaSintomalogicaCovidVisitante(){
   documentosFicSinCovVisObj={
      id:0,respuestaSintomas:{id:""},
      respuestaContacto:{id:""}
		             }
   
   editarDocumentoFichaSintomalogicaCovidVisitante();
}

function editarDocumentoFichaSintomalogicaCovidVisitante(){ 
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
	  return val2.id - val.id;
       });
	    
//   var radiosPreguntaResSinVis = crearRadiosAuto("radioPreguntaRespuestaSintomaVis",listBooleanSiNo,
//      documentosFicSinCovVisObj.respuestaSintomas.id,"id","nombre",""); 
//    
//   var radiosPreguntaResConVis = crearRadiosAuto("radioPreguntaRespuestaContactoVis",listBooleanSiNo,
//      documentosFicSinCovVisObj.respuestaContacto.id,"id","nombre","");
   
   var radiosPreguntaAux01 = crearRadiosAuto("radiosRespuestaAux01",listBooleanSiNo,
     (documentosFicSinCovVisObj.id != 0?"0":""),"id","nombre","");
   
   var radiosPreguntaAux02 = crearRadiosAuto("radiosRespuestaAux02",listBooleanSiNo,
      (documentosFicSinCovVisObj.id != 0?"0":""),"id","nombre","");
   
   var radiosPreguntaAux03 = crearRadiosAuto("radiosRespuestaAux03",listBooleanSiNo,
      (documentosFicSinCovVisObj.id != 0?"0":""),"id","nombre","");
   
   var radiosPreguntaAux04 = crearRadiosAuto("radiosRespuestaAux04",listBooleanSiNo,
      (documentosFicSinCovVisObj.id != 0?"0":""),"id","nombre","");
   
   var radiosPreguntaAux05 = crearRadiosAuto("radiosRespuestaAux05",listBooleanSiNo,
      (documentosFicSinCovVisObj.id != 0?"0":""),"id","nombre","");
   
   var radiosPreguntaAux06 = crearRadiosAuto("radiosRespuestaAux06",listBooleanSiNo,
      (documentosFicSinCovVisObj.id != 0?"0":""),"id","nombre","");
    
   var listItemsRegistro=[
//      {sugerencia:"",label:"¿Tiene síntomas asociados al COVID-19?",
//       inputForm:radiosPreguntaResSinVis,divContainer:""},
//      {sugerencia:"",
//       label:"¿Ha tenido contacto con algún caso confirmado " +
//             "o sospechoso de COVID-19 en los últimos días?",
//       inputForm:radiosPreguntaResConVis,divContainer:""},
      {sugerencia:"",label:"Fecha de registro - Ficha sintomatología COVID-19",
       inputForm:"<input type='date' id='inputFechaRegFicSinCovVis' class='form-control' " +
           	        "onchange='calcularFechaFinVigenciaFichaSintomalogicaCovidVisitante()' " +
           		"max='"+sumaFechaDias(30,getSession("fechaHoyOrdenInversoTexto"))+"'>",
       divContainer:""},
      {sugerencia:"",label:"Fecha fin de vigencia - Ficha sintomatología COVID-19",
       inputForm:"<label id='labelFechaFinVigFicSinCovVis'></label>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
//      {sugerencia:"",label:"Formato a completar",
//       inputForm:"<a target='_blank' href='"+URL+"/empresa/documento/evidencia?id="+
//                         getSession("gestopcompanyid")+"&tipoId="+9+"' class='efectoLink'>" +
//                    "<i class='fa fa-download'></i> Descargar" +
//                 "</a>"}, 
//      {sugerencia:"",label:"Evidencia",
//       inputForm:"",divContainer:"divEvidenciaFicSinCovVis"},
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
       label:"¿Sensación de alza térmica, fiebre o malestar?",
       inputForm:radiosPreguntaAux01,divContainer:""},
      {sugerencia:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
       label:"¿Dolor de garganta, tos, estornudos o dificultad para respirar?",
       inputForm:radiosPreguntaAux02,divContainer:""},
      {sugerencia:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
       label:"¿Dolor de cabeza, diarrea o congestión nasal?",
       inputForm:radiosPreguntaAux03,divContainer:""},
      {sugerencia:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
       label:"¿Pérdida del gusto y/o del olfato?",
       inputForm:radiosPreguntaAux04,divContainer:""},
      {sugerencia:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
       label:"¿Contacto con un caso confirmado de COVID-19?",
       inputForm:radiosPreguntaAux05,divContainer:""},
      {sugerencia:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
       label:"¿Pertenece al grupo de riesgo frente al COVID-19?*",
       inputForm:radiosPreguntaAux06,divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
       label:"<span style='font-size:10px;font-weight:bolder;'>" +
                "*[Cáncer, Hipertensión arterial, Enfermedades cardiovasculares, Insuficiencia renal crónica, " +
                "EPOC (Enfermedad pulmonar Obstructiva crónica), Asma moderada o grave, Diabetes Mellitus, " +
                "Obesidad, Enfermedad o tratamiento Inmunosupresor (Inmunodeficiencias congénitas o adquirida) " +
                "incluido VIH, edad de 65 años a más, enfermedad cerebrovascular, Síndrome de Down, receptores " +
                "de trasplante de órganos, gestantes y puérperas y en periodo de lactancia]  " +
             "</span>",inputForm:"",divContainer:""},
//      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
//      {sugerencia:"",anchoLabel:"",anchoDiv:"",
//       label:"Fecha de la última dosis recibida:",
//       inputForm:infoIndicadorVacCovVis.infoDocVacunaCovid,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
       label:"<span style='color:red;font-size:10px;font-weight:bolder;'>NOTA:</span> " +
    	     "<span style='font-size:10px;font-weight:bolder;'> Todos los datos expresados en esta ficha constituye " +
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
 	
   listItemsRegistro.forEach(function(val){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var opciones={
      id: "modalEditarDocumentoFicSinCovVis",
      nombre: "Registro Ficha sintomatología COVID-19",
      contenido: "<form id='formEditarDocumentoFicSinCovVis' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
    
   crearModalPrincipalUsuario(opciones,function(){},false,true);
   	
   var editarDiv = $("#formEditarDocumentoFicSinCovVis");
 	
   if(documentosFicSinCovVisObj.id > 0){
      editarDiv.find("#inputFechaRegFicSinCovVis").val(convertirFechaInput(documentosFicSinCovVisObj.fechaRegistro));
   }
   
//   var options={
//          container: "#divEvidenciaFicSinCovVis",
//          functionCall: function(){},
//          descargaUrl: "/public/visitante/documento/evidencia?id="+documentosFicSinCovVisObj.id,
//          esNuevo: (documentosFicSinCovVisObj.id == 0),
//          idAux: "DocFicSinCovVis",
//          evidenciaNombre: documentosFicSinCovVisObj.evidenciaNombre
//	       };
//
//   crearFormEvidenciaCompleta(options);
   
   if(documentosFicSinCovVisObj.id > 0){
      calcularFechaFinVigenciaFichaSintomalogicaCovidVisitante();
   }
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDocumentoFichaSintomalogicaCovidVisitante();
   });
}

function calcularFechaFinVigenciaFichaSintomalogicaCovidVisitante(){
   var fechaFinVigenciaFicSinCovVis = 
          convertirFechaNormal(sumaFechaDias(29,$("#inputFechaRegFicSinCovVis").val()));
    
   if(fechaFinVigenciaFicSinCovVis != 'aN-aN-NaN'){
      document.querySelector('#labelFechaFinVigFicSinCovVis').innerText = fechaFinVigenciaFicSinCovVis;
   }else{
      document.querySelector('#labelFechaFinVigFicSinCovVis').innerText = "";
   }
}

function guardarDocumentoFichaSintomalogicaCovidVisitante(){
   var campoVacio = true; 
   
//   var respuestaSintomas = parseInt($("input[name='radioPreguntaRespuestaSintomaVis']:checked").val());
//   var respuestaContacto = parseInt($("input[name='radioPreguntaRespuestaContactoVis']:checked").val());
   var respuestaUno = parseInt($("input[name='radiosRespuestaAux01']:checked").val());
   var respuestaDos = parseInt($("input[name='radiosRespuestaAux02']:checked").val());
   var respuestaTres = parseInt($("input[name='radiosRespuestaAux03']:checked").val());
   var respuestaCuatro = parseInt($("input[name='radiosRespuestaAux04']:checked").val());
   var respuestaCinco = parseInt($("input[name='radiosRespuestaAux05']:checked").val());
   var respuestaSeis = parseInt($("input[name='radiosRespuestaAux06']:checked").val());
   
   var fechaRegistro = convertirFechaTexto($("#inputFechaRegFicSinCovVis").val());
   var inputFechaRegistro;
   
   if(!fechaRegistro){  
      inputFechaRegistro = null;
   }else{
      inputFechaRegistro = fechaRegistro;
   }
   
   var fechaFinVigencia = convertirFechaTexto(sumaFechaDias(29,$("#inputFechaRegFicSinCovVis").val()));
   
//   var evidenciaNombre = $("#inputEviDocFicSinCovVis").val();
    
   if(isNaN(respuestaUno) != true && isNaN(respuestaDos) != true && isNaN(respuestaTres) != true &&
      isNaN(respuestaCuatro) != true && isNaN(respuestaCinco) != true && isNaN(respuestaSeis) != true){
      if(inputFechaRegistro == null){
         campoVacio = false;
      }
   }else{
      campoVacio = false;
   } 
   
   if(campoVacio){
      var registroPermitido = 0;
      var vacunaCovidAcceso = 0;
      
      if(infoIndicadorVacCovVis.infoDocVacunaCovid.includes("Aprobado")){
	 vacunaCovidAcceso = 1;
      }
      
      if(respuestaUno == 0 && respuestaDos == 0 && respuestaTres == 0 && 
         respuestaCuatro == 0 && respuestaCinco == 0 && 
         (respuestaSeis == 0 || (respuestaSeis == 1 && vacunaCovidAcceso == 1))){
	 registroPermitido = 1; 
      }
       
      if(registroPermitido == 1){
         var dataParam={
	    id: documentosFicSinCovVisObj.id,
	    tipoDocumentoPersonalExternoId: 3,
	    respuestaSintomas: {id: 0},
	    respuestaContacto: {id: 0},
	    fechaRegistro: inputFechaRegistro,
	    fechaFinVigencia: fechaFinVigencia,
	    evaluacionDoc: {id: 1} ,
	    respuestaGrupoRiesgo: {id: respuestaSeis}
         };
      
         callAjaxPost(URL+"/public/visitante/documento/save",dataParam,function(data){
//	    guardarEvidenciaAuto(data.nuevoId,"fileEviDocFicSinCovVis",bitsEvidenciaDocPersonalExterno,
//             "/public/visitante/documento/evidencia/save",function(){
	       $("#modalEditarDocumentoFicSinCovVis").remove();
		    
	       mensajeUx="<label>Los datos del registro Ficha sintomatología " +
	    	         "COVID-19 fueron guardados con éxito.</label>";
	    
	       mensajesUx(mensajeUx,1,"","ActualizarSeccionDocFicSinCovVis");
		    
	       $("#modalMensajeUxActualizarSeccionDocFicSinCovVis").on("hidden.bs.modal",function(){
		  habilitarDocumentoFichaSintomalogicaCovidVisitante();
	       });
//	    });  	
         });
      }else{
	 $("#modalEditarDocumentoFicSinCovVis").remove();
	  
	 mensajeUx = 
	    "<label>" +
	       "Estimado(a) "+getSession("gestopusername")+"," +
	       "<br><br>"+
	       "Comunicarse con su contacto "+getSession("empresaNombre")+
	       " solicitante para las gestiones internas correspondientes debido" +
	       " a que no cumple con las condiciones para acceder." +
	       "<br><br>"+
	       "Saludos." +
	    "</label>";
	       
	 mensajesUx(mensajeUx,8,"","AvisoCompletarCampos");
      }
   }else{
      $("#modalEditarDocumentoFicSinCovVis").modal("hide");
	       
      mensajeUx = "<label>Debe completar todos los campos.</label>";
	       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarDocumentoFicSinCovVis").modal("show");    
      });
   } 
}

function eliminarDocumentoFichaSintomalogicaCovidVisitante(){
   mensajeUx="<label>¿Está seguro de eliminar el registro Ficha " +
   	     "sintomatológica COVID-19 seleccionado?</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarDocFicSinCovVis");

   $("#btnDevolverValorRespEliminarDocFicSinCovVis").on("click",function(){
      var dataParam={
	     id:documentosFicSinCovVisObj.id
      		    };

      callAjaxPost(URL+'/public/visitante/documento/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
		mensajeUx="<label>El registro Ficha sintomatológica COVID-19 se ha " +
	                  "eliminado correctamente.</label>";
		
		mensajesUx(mensajeUx,1,"");
		
		habilitarDocumentoFichaSintomalogicaCovidVisitante();
		break;
		
	    default:
		mensajeUx="Error al eliminar el registro.";
	    	mensajesUx(mensajeUx,2,"");	
         }
      });
   });
}
