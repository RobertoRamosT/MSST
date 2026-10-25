
var documentosFicSinCovTraConObj = {};
var listDocumentosFicSinCovTraCon = [];
var listRespuestaSimple = [];
var valorIndicadorFicSinCovTraCon;
var infoIndicadorVacCovTraCon;
var indexDocumentosFicSinCovTraCon;
var mensajeUx;

function toggleMenuOpcionDocumentoFichaSintomalogicaCovidTrabContratista(obj,pindex){
   documentosFicSinCovTraConObj = listDocumentosFicSinCovTraCon[pindex]; 
   indexDocumentosFicSinCovTraCon = pindex;
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesDocumentoFichaSintomalogicaCovidTrabContratista=[
       {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
        functionClick:function(data){editarDocumentoFichaSintomalogicaCovidTrabContratista()}},
//     {id:"opcElimnar",nombre:"<i class='fa fa-times'></i> Eliminar",
//      functionClick:function(data){eliminarDocumentoFichaSintomalogicaCovidTrabContratista()}}
                                                 ]

function marcarSubOpcionDocumentoFichaSintomalogicaCovidTrabContratista(pindex){
   funcionalidadesDocumentoFichaSintomalogicaCovidTrabContratista[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarDocumentoFichaSintomalogicaCovidTrabContratista(){
   var dataParam={
      tipoDocumentoPersonalExternoId: 3
   };
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/contratista/trabajador_contratista/documento',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	    var textIn= "";
 			
 	    listDocumentosFicSinCovTraCon = data.documentos;
 	    listRespuestaSimple = data.respuesta;
 	    valorIndicadorFicSinCovTraCon = data.valorIndicador;
 	    infoIndicadorVacCovTraCon = data.valorIndicadorVacCov;
 	   
 	    console.log(infoIndicadorVacCovTraCon);
 	    
 	    $(".divListPrincipal").html("");
 	     
 	    var textTotal="";
 	     
 	    listDocumentosFicSinCovTraCon.forEach(function(val,index){
 	       var btnOpcion="";
 	       var menuOpcion="";
 		
 	       if(valorIndicadorFicSinCovTraCon.indicadorDocFichaSint != 1 && index == 0){
 		
 		  menuOpcion="<ul class='list-group listaFinalGestionGosst'>";
  	        
  	          funcionalidadesDocumentoFichaSintomalogicaCovidTrabContratista.forEach(function(val1,index1){
  		     menuOpcion+="<li class='list-group-item' " +
  		   		     "onclick='marcarSubOpcionDocumentoFichaSintomalogicaCovidTrabContratista("+index1+")'>"+
  		                     val1.nombre+
  		                 "</li>";
  	          });
  		
  	          menuOpcion+="</ul>";
  			
  	          btnOpcion = "<a class='btn-gestion efectoLink' " +
  	        		 "onclick='toggleMenuOpcionDocumentoFichaSintomalogicaCovidTrabContratista(this,"+index+")'>" +
  			         "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
  			      "</a>";
 	       } 	 
  	        
 	       var listTotal=[
// 		  {sugerencia:"",
// 		   label:"<i class='fa fa-check-square-o'></i> ¿Tiene síntomas asociados al COVID-19?",
// 		   inputForm:val.respuestaSintomas.nombre+btnOpcion+menuOpcion},
// 		  {sugerencia:"",
// 		   label:"<i class='fa fa-check-square-o'></i> ¿Ha tenido contacto con algún caso confirmado " +
// 		            "o sospechoso de COVID-19 en los últimos días?",
// 		   inputForm:"<br><br>"+val.respuestaContacto.nombre},
 		  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	   label:"<i class='fa fa-calendar'></i> Fecha de registro - Ficha sintomatológica COVID-19 ",
 	 	   inputForm:val.fechaRegistroTexto},
 	 	  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	   label:"<i class='fa fa-calendar'></i> Fecha fin de vigencia - Ficha sintomatología COVID-19 ",
 	 	   inputForm:val.fechaFinVigenciaTexto},
 	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
// 	          {sugerencia:"",
// 	 	   label:"<i class='fa fa-check-square-o'></i> Evidencia",
// 	 	   inputForm:"<a class='efectoLink' " +
// 	 	           	"href='"+URL+"/contratista/trabajador_contratista/documento/evidencia?id="+val.id+"'>"+
// 	 	                 val.evidenciaNombre+
// 	 	             "</a>"},
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
 	 	   label:"<i class='fa fa-check-square-o'></i> ¿Contacto con un caso confirmado de COVID-19 " +
 	 	   	 "en los últimos 7 días? ",
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
// 	 	  {sugerencia:"",
// 	 	   label:"<i class='fa fa-pencil-square-o'></i> Evaluado el ",
// 	 	   inputForm:val.fechaDocEvaluacionTexto}
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
             
// 	     if(valorIndicadorFicSinCovTraCon.indicadorDocFichaSint == 0){
 	     
    	    var textNuevo ="";
    	     
    	    textNuevo = 
               "<div id='estadoMovilModificarFichaSintomatologicaCovidTrabContratista'>" +
    	          "<div class='tituloSubList'> Nuevo registro - Ficha sintomatológica COVID-19 " +
    	             "<button style='font-size:19px' title='Registrar nuevo documento Ficha sintomatológica COVID-19.' " +
    	                     "class='btn btn-success' onclick='registrarNuevoDocumentoFichaSintomalogicaCovidTrabContratista()'>"+
    	                "<i class='fa fa-plus-square'></i> Registrar" +
    	             "</button>" +
    	          "</div>" +
    	          "<div class='contenidoSubList' style='display:none'>" +
    	          "</div>" +
    	       "</div>";
    	     
    	       $(".divListPrincipal").append(textNuevo);
// 	     }
    	     
    	    listPanelesPrincipal.push(
 	       {id:"infoMovilFichaSintomatologicaCovidTrabContratista",clase:"",
 	 	nombre:""+"Registros Ficha sintomatológica COVID-19 ("+listDocumentosFicSinCovTraCon.length+")",
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

function registrarNuevoDocumentoFichaSintomalogicaCovidTrabContratista(){
   documentosFicSinCovTraConObj={
      id:0,respuestaSintomas:{id:""},
      respuestaContacto:{id:""}
		             }
   
   editarDocumentoFichaSintomalogicaCovidTrabContratista();
}

function editarDocumentoFichaSintomalogicaCovidTrabContratista(){
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
	  return val2.id - val.id;
   });
	    
//   var radiosPreguntaResSinTraCon = crearRadiosAuto("radioPreguntaRespuestaSintomaTraCon",listBooleanSiNo,
//	  documentosFicSinCovTraConObj.respuestaSintomas.id,"id","nombre",""); 
//  
//   var radiosPreguntaResConTraCon = crearRadiosAuto("radioPreguntaRespuestaContactoTraCon",listBooleanSiNo,
//	  documentosFicSinCovTraConObj.respuestaContacto.id,"id","nombre","");
    
   var radiosPreguntaAux01TraCon = crearRadiosAuto("radiosRespuestaAux01TraCon",listBooleanSiNo,
      (documentosFicSinCovTraConObj.id != 0?"0":""),"id","nombre","");
	   
   var radiosPreguntaAux02TraCon = crearRadiosAuto("radiosRespuestaAux02TraCon",listBooleanSiNo,
      (documentosFicSinCovTraConObj.id != 0?"0":""),"id","nombre","");
	   
   var radiosPreguntaAux03TraCon = crearRadiosAuto("radiosRespuestaAux03TraCon",listBooleanSiNo,
      (documentosFicSinCovTraConObj.id != 0?"0":""),"id","nombre","");
	   
   var radiosPreguntaAux04TraCon = crearRadiosAuto("radiosRespuestaAux04TraCon",listBooleanSiNo,
      (documentosFicSinCovTraConObj.id != 0?"0":""),"id","nombre","");
	   
   var radiosPreguntaAux05TraCon = crearRadiosAuto("radiosRespuestaAux05TraCon",listBooleanSiNo,
      (documentosFicSinCovTraConObj.id != 0?"0":""),"id","nombre","");
	   
   var radiosPreguntaAux06TraCon = crearRadiosAuto("radiosRespuestaAux06TraCon",listBooleanSiNo,
      (documentosFicSinCovTraConObj.id != 0?"0":""),"id","nombre","");
   
   var listItemsRegistro=[
//          {sugerencia:"",label:"¿Tiene síntomas asociados al COVID-19?",
//           inputForm:radiosPreguntaResSinTraCon,divContainer:""},
//          {sugerencia:"",
//           label:"¿Ha tenido contacto con algún caso confirmado " +
// 		 "o sospechoso de COVID-19 en los últimos días?",
//           inputForm:radiosPreguntaResConTraCon,divContainer:""},
          {sugerencia:"",label:"Fecha de registro - Ficha sintomatología COVID-19",
           inputForm:"<input type='date' id='inputFechaRegFicSinCovTraCon' class='form-control' " +
           		    "onchange='calcularFechaFinVigenciaFichaSintomalogicaCovidTrabContratista()' " +
           		    "max='"+sumaFechaDias(30,getSession("fechaHoyOrdenInversoTexto"))+"'>",
           divContainer:""},
          {sugerencia:"",label:"Fecha fin de vigencia - Ficha sintomatología COVID-19",
           inputForm:"<label id='labelFechaFinVigFicSinCovTraCon'></label>",
           divContainer:""},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
//          {sugerencia:"",label:"Formato a completar",
//           inputForm:"<a target='_blank' href='"+URL+"/empresa/documento/evidencia?id="+
//                         getSession("gestopcompanyid")+"&tipoId="+9+"' " +
//                        "class='efectoLink'>" +
//                        "<i class='fa fa-download'></i> Descargar" +
//                     "</a>"}, 
//          {sugerencia:"",label:"Evidencia",
//           inputForm:"",divContainer:"divEvidenciaFicSinCovTraCon"},
          {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
           label:"¿Sensación de alza térmica, fiebre o malestar?",
           inputForm:radiosPreguntaAux01TraCon,divContainer:""},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
           label:"¿Dolor de garganta, tos, estornudos o dificultad para respirar?",
           inputForm:radiosPreguntaAux02TraCon,divContainer:""},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
           label:"¿Dolor de cabeza, diarrea o congestión nasal?",
           inputForm:radiosPreguntaAux03TraCon,divContainer:""},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
           label:"¿Pérdida del gusto y/o del olfato?",
           inputForm:radiosPreguntaAux04TraCon,divContainer:""},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
           label:"¿Contacto con un caso confirmado de COVID-19 en los últimos 7 días?",
           inputForm:radiosPreguntaAux05TraCon,divContainer:""},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
           label:"¿Pertenece al grupo de riesgo frente al COVID-19?*",
           inputForm:radiosPreguntaAux06TraCon,divContainer:""},
          {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
           label:"<span style='font-size:10px;font-weight:bolder;'>" +
                    "*[Cáncer, Hipertensión arterial, Enfermedades cardiovasculares, Insuficiencia renal crónica, " +
                    "EPOC (Enfermedad pulmonar Obstructiva crónica), Asma moderada o grave, Diabetes Mellitus, " +
                    "Obesidad, Enfermedad o tratamiento Inmunosupresor (Inmunodeficiencias congénitas o adquirida) " +
                    "incluido VIH, edad de 65 años a más, enfermedad cerebrovascular, Síndrome de Down, receptores " +
                    "de trasplante de órganos, gestantes y puérperas y en periodo de lactancia]  " +
                 "</span>",inputForm:"",divContainer:""},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",
           label:"Fecha de la última dosis recibida:",
           inputForm:(infoIndicadorVacCovTraCon.infoDocVacunaCovid.length == 0?"------":
                      infoIndicadorVacCovTraCon.infoDocVacunaCovid),divContainer:""},
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
 	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val,index+1);
   });
 	
   var opciones={
      id: "modalEditarDocumentoFicSinCovTraCon",
      nombre: "Registro Ficha sintomatológica COVID-19",
      contenido: "<form id='formEditarDocumentoFicSinCovTraCon' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
    
   crearModalPrincipalUsuario(opciones,function(){},false,true);
   	
   var editarDiv = $("#formEditarDocumentoFicSinCovTraCon");
 	
   if(documentosFicSinCovTraConObj.id > 0){
      editarDiv.find("#inputFechaRegFicSinCovTraCon").val(convertirFechaInput(documentosFicSinCovTraConObj.fechaRegistro));
   }
   
//   var options={
//          container: "#divEvidenciaFicSinCovTraCon",
//          functionCall: function(){},
//          descargaUrl: "/contratista/trabajador_contratista/documento/evidencia?id="+documentosFicSinCovTraConObj.id,
//          esNuevo: (documentosFicSinCovTraConObj.id == 0),
//          idAux: "DocFicSinCovTraCon",
//          evidenciaNombre: documentosFicSinCovTraConObj.evidenciaNombre
//	       };
//
//   crearFormEvidenciaCompleta(options);
   
   if(documentosFicSinCovTraConObj.id > 0){
      calcularFechaFinVigenciaFichaSintomalogicaCovidTrabContratista();
   }
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDocumentoFichaSintomalogicaCovidTrabContratista();
   });
}

function calcularFechaFinVigenciaFichaSintomalogicaCovidTrabContratista(){
   var fechaFinVigenciaFicSinCovTraCon = 
          convertirFechaNormal(sumaFechaDias(29,$("#inputFechaRegFicSinCovTraCon").val()));
     
   if(fechaFinVigenciaFicSinCovTraCon != 'aN-aN-NaN'){
      document.querySelector('#labelFechaFinVigFicSinCovTraCon').innerText = fechaFinVigenciaFicSinCovTraCon;
   }else{
      document.querySelector('#labelFechaFinVigFicSinCovTraCon').innerText = "";
   }
 }

function guardarDocumentoFichaSintomalogicaCovidTrabContratista(){
   var campoVacio = true; 
    
//   var respuestaSintomas = parseInt($("input[name='radioPreguntaRespuestaSintomaTraCon']:checked").val());
//   var respuestaContacto = parseInt($("input[name='radioPreguntaRespuestaContactoTraCon']:checked").val());
   var respuestaUno = parseInt($("input[name='radiosRespuestaAux01TraCon']:checked").val());
   var respuestaDos = parseInt($("input[name='radiosRespuestaAux02TraCon']:checked").val());
   var respuestaTres = parseInt($("input[name='radiosRespuestaAux03TraCon']:checked").val());
   var respuestaCuatro = parseInt($("input[name='radiosRespuestaAux04TraCon']:checked").val());
   var respuestaCinco = parseInt($("input[name='radiosRespuestaAux05TraCon']:checked").val());
   var respuestaSeis = parseInt($("input[name='radiosRespuestaAux06TraCon']:checked").val());
   
   var fechaRegistro = convertirFechaTexto($("#inputFechaRegFicSinCovTraCon").val());
   var inputFechaRegistro;
   
   if(!fechaRegistro){  
      inputFechaRegistro = null;
   }else{
      inputFechaRegistro = fechaRegistro;
   }
   
   var fechaFinVigencia = convertirFechaTexto(sumaFechaDias(29,$("#inputFechaRegFicSinCovTraCon").val()));
   
//   var evidenciaNombre = $("#inputEviDocFicSinCovTraCon").val();
   
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
       
      if(infoIndicadorVacCovTraCon.infoDocVacunaCovid.includes("Aprobado")){
 	 vacunaCovidAcceso = 1;
      }
       console.log("ACCESO VACUNA -> "+vacunaCovidAcceso);
      if(respuestaUno == 0 && respuestaDos == 0 && respuestaTres == 0 && 
         respuestaCuatro == 0 && respuestaCinco == 0 && 
         (respuestaSeis == 0 || (respuestaSeis == 1 && vacunaCovidAcceso == 1))){
 	 registroPermitido = 1; 
      }
       
      if(registroPermitido == 1){
         var dataParam={
	    id: documentosFicSinCovTraConObj.id,
	    tipoDocumentoPersonalExternoId: 3,
	    respuestaSintomas: {id: 0},
	    respuestaContacto: {id: 0},
	    fechaRegistro: inputFechaRegistro,
	    fechaFinVigencia: fechaFinVigencia,
	    evaluacionDoc: {id: 1},
	    respuestaGrupoRiesgo: {id: respuestaSeis}
         };
      
         callAjaxPost(URL+"/contratista/trabajador_contratista/documento/save",dataParam,function(data){
//	    guardarEvidenciaAuto(data.nuevoId,"fileEviDocFicSinCovTraCon",bitsEvidenciaDocPersonalExterno,
//            "/contratista/trabajador_contratista/documento/evidencia/save",function(){
	       $("#modalEditarDocumentoFicSinCovTraCon").remove();
		    
	       mensajeUx="<label>Los datos del registro Ficha sintomatología " +
	    	         "COVID-19 fueron guardados con éxito.</label>";
	    
	       mensajesUx(mensajeUx,1,"","ActualizarSeccionDocFicSinCovTraCon");
		    
	       $("#modalMensajeUxActualizarSeccionDocFicSinCovTraCon").on("hidden.bs.modal",function(){
		  habilitarDocumentoFichaSintomalogicaCovidTrabContratista();
	       });
//	    });  	
         });
      }else{
	 $("#modalEditarDocumentoFicSinCovTraCon").remove();
	  
	 mensajeUx =  
	    "<label>" +
	       "Estimado(a) "+getSession("gestopusername")+"," +
	       "<br><br>" +
	       "Comunicarse con su contacto "+getSession("empresaNombre")+
	       " solicitante para las gestiones internas correspondientes debido" +
	       " a que no cumple con las condiciones para acceder." +
	       "<br><br>" +
	       "Saludos." +
	    "</label>";
	       
	 mensajesUx(mensajeUx,8,"","AvisoCompletarCampos");
      }
   }else{
      $("#modalEditarDocumentoFicSinCovTraCon").modal("hide");
	       
      mensajeUx = "<label>Debe completar todos los campos.</label>";
	       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarDocumentoFicSinCovTraCon").modal("show");    
      });
   } 
}

function eliminarDocumentoFichaSintomalogicaCovidTrabContratista(){
   mensajeUx="<label>¿Está seguro de eliminar el registro Ficha " +
   	     "sintomatológica COVID-19 seleccionado?</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarDocFicSinCovTraCon");

   $("#btnDevolverValorRespEliminarDocFicSinCovTraCon").on("click",function(){
      var dataParam={
	     id:documentosFicSinCovTraConObj.id
      		    };

      callAjaxPost(URL+'/contratista/trabajador_contratista/documento/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
		mensajeUx="<label>El registro Ficha sintomatológica COVID-19 se ha " +
	                  "eliminado correctamente.</label>";
		
		mensajesUx(mensajeUx,1,"");
		
		habilitarDocumentoFichaSintomalogicaCovidTrabContratista();
		break;
		
	    default:
		mensajeUx="Error al eliminar el registro.";
	    	mensajesUx(mensajeUx,2,"");	
         }
      });
   });
}
