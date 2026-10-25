
var documentosGruRieCovVisObj = {};
var listDocumentosGruRieCovVis = [];
var valorIndicadorGruRieCovVis;
var listRespuestaSimple = [];
var mensajeUx;

function habilitarDocumentoGrupoRiesgoCovidVisitante(){
    
   var dataParam={
	  tipoDocumentoPersonalExternoId: 1
                 };
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/public/visitante/documento',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	     var textIn= "";
 			
 	     listDocumentosGruRieCovVis = data.documentos;
 	     listRespuestaSimple = data.respuesta;
 	     valorIndicadorGruRieCovVis = data.valorIndicador;
 	    
 	     $(".divListPrincipal").html("");
 	     
 	     var textTotal="";
 	     
 	     if(listDocumentosGruRieCovVis.length == 0){
 		
 		documentosGruRieCovVisObj={
 	           id:0,respuestaGrupoRiesgo:{id:""},
 	           detalleGrupoRiesgo:""
 		                          }
 		
 		mensajeUx = "<br><label style='font-size:20px;'>Antes de continuar, debe completar los datos " +
 			    "del siguiente formulario.</label>";
 		mensajesUx(mensajeUx,7,"","CompletarRegistroInicialVisitante");
		    
		$("#modalMensajeUxCompletarRegistroInicialVisitante").on("hidden.bs.modal",function(){
		   editarDocumentoGrupoRiesgoCovidVisitante();
		});
 		
 	     }else{
 		    
 	        listDocumentosGruRieCovVis.forEach(function(val,index){
 	           var listTotal=[
 		          {sugerencia:"",
 		           label:"<i class='fa fa-check-square-o'></i> ¿Pertenece al grupo de riesgo - COVID-19?",
 		           inputForm:val.respuestaGrupoRiesgo.nombre},
 		          {sugerencia:"",
 		           label:"<i class='fa fa-check-square-o'></i> Detalle: ",
 		           inputForm:val.detalleGrupoRiesgo},
 		          {sugerencia:"",
 	 	 	           label:"<i class='fa fa-check-square-o'></i> Evidencia",
 	 	 	           inputForm:"<a class='efectoLink' " +
 	 	 	           		"href='"+URL+"/public/visitante/documento/evidencia?id="+val.id+"'>"+
 	 	 	                         val.evidenciaNombre+
 	 	 	                     "</a>"},
 	 	 	  {sugerencia:"",
 	 	 	   label:"<i class='fa fa-pencil-square-o'></i> Registrado el ",
 	 	 	   inputForm:val.fechaActualizacionTexto},
 		          {sugerencia:"",label:"",inputForm:"",divContainer:""},
 		          {sugerencia:"",label:"<label style='color:blue;'> Evaluación del formato </label>",inputForm:""},
 		          {sugerencia:"",
 	 	 	   label:"<i class='fa fa-pencil-square-o'></i> Estado ",
 	 	 	   inputForm:val.evaluacionDoc.icono+" "+val.evaluacionDoc.nombre},
 	 	 	  {sugerencia:"",
 	 	 	   label:"<i class='fa fa-pencil-square-o'></i> Observación ",
 	 	 	   inputForm:val.evaluacionDoc.observacion},
 	 	 	  {sugerencia:"",
 	 	 	   label:"<i class='fa fa-pencil-square-o'></i> Evaluado el ",
 	 	 	   inputForm:val.fechaDocEvaluacionTexto}	                  
 			         ];
 				
 	           textTotal+="<div class='eventoGeneral'>" +
 	       		         "<form class='eventoGeneral'>";	   					
 		
 	           listTotal.forEach(function(val,index){
 	              textTotal+=""+obtenerSubPanelModulo(val);
 	           });
 		   
 	           textTotal+=   "</form>" +
 	       		      "</div>";
 	           textTotal+="<div class='divMovilGrupoRiesgoVisitante' id='divGrupoRiesgoVisitante"+val.id+"'></div>";
 	           
 	           documentosGruRieCovVisObj = listDocumentosGruRieCovVis[index];
 	        });
             }
 	     
 	     if(valorIndicadorGruRieCovVis.indicadorDocGrupoRiesgo != 1){
    	        var textNuevo ="";
    	     
    	        textNuevo = "<div id='estadoMovilModificarGrupoRiesgoVisitante'>" +
    	                       "<div class='tituloSubList'> Modificar datos actuales - Grupo de riesgo " +
    	                          "<button style='font-size:19px' title='Editar datos actuales del documento.' " +
    	                                  "class='btn btn-success' onclick='editarDocumentoGrupoRiesgoCovidVisitante()'>"+
    	                             "<i class='fa fa-pencil'></i> Editar registro" +
    	                          "</button>" +
    	                       "</div>" +
    	                       "<div class='contenidoSubList' style='display:none'>" +
    	                       "</div>" +
    	                    "</div>";
    	     
    	        $(".divListPrincipal").append(textNuevo);
 	     }
    	 
 	     listPanelesPrincipal.push(
 		{id:"infoMovilGrupoRiesgoVisitante",clase:"",
 	 	 nombre:""+"Datos del registro actual",
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

function editarDocumentoGrupoRiesgoCovidVisitante(){
    
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
          return val2.id - val.id;
   });
	    
   var radiosPreguntaResGruRieVis = crearRadiosAuto("radioPreguntaRespuestaGruRieVis",listBooleanSiNo,
	  documentosGruRieCovVisObj.respuestaGrupoRiesgo.id,"id","nombre",
	  "cambiarTextoCamposEditarRegistroGruRieCovVis"); 
   
   var listItemsRegistro=[
          {sugerencia:"",label:"¿Pertenece al grupo de riesgo - COVID-19?",
           inputForm:radiosPreguntaResGruRieVis,divContainer:""},
          {sugerencia:"",label:"Detalle " +
           "<span id='auxLabelValGruRieCovVis01' style='font-weight:bold;'></span>",
           inputForm:"<textarea class='form-control' id='textAreaDetalleGruRieCovVis' rows='5'></textarea>",
           divContainer:""},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",label:"Formato a completar",
           inputForm:"<a target='_blank' href='"+URL+"/empresa/documento/evidencia?id="+
                         getSession("gestopcompanyid")+"&tipoId="+8+"' " +
                        "class='efectoLink'>" +
                        "<i class='fa fa-download'></i> Descargar" +
                     "</a>"},
          {sugerencia:"",label:"Evidencia",
           inputForm:"",divContainer:"divEvidenciaGruRieCovVis"},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",
           label:"<span style='color:red;font-size:10px;font-weight:bolder;'>NOTA:</span> " +
   		 "<span style='font-size:10px;font-weight:bolder;'> Todos los datos expresados en esta ficha constituye " +
   		 "una declaración jurada de mi parte. <br>" +
   		 "He sido informado que, de omitir o falsear información, puedo perjudicar la salud de mis compañeros, " +
   		 "y la mía propia, lo cual, de constituir una falta grave a la salud pública, asumo sus consecuencias." +
   		 "</span>",inputForm:""},
          {sugerencia:"",label:"",
           inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
           	        "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
           	     "</button>"} 
                         ];
    
   var textFormRegistro="";
 	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloDocumentoGruRieCovVis(val,index+1);
   });
 	
   var opciones={
 	  id:"modalEditarDocumentoGruRieCovVis",
 	  nombre:"Registro Grupo de riesgo - COVID-19",
 	  contenido:"<form id='formEditarDocumentoGruRieCovVis' class='eventoGeneral'>"+textFormRegistro+"</form>"
    		}
    
   crearModalPrincipalUsuario(opciones,function(){},false,true);
   	
   var editarDiv = $("#formEditarDocumentoGruRieCovVis");
   
   editarDiv.find("#textAreaDetalleGruRieCovVis").val(documentosGruRieCovVisObj.detalleGrupoRiesgo);
   
   var options={
          container: "#divEvidenciaGruRieCovVis",
          functionCall: function(){},
          descargaUrl: "/public/visitante/documento/evidencia?id="+documentosGruRieCovVisObj.id,
          esNuevo: (documentosGruRieCovVisObj.id == 0),
          idAux: "DocGruRieCovVis",
          evidenciaNombre: documentosGruRieCovVisObj.evidenciaNombre
	       };

   crearFormEvidenciaCompleta(options);
   
   if(documentosGruRieCovVisObj.id > 0){
      cambiarTextoCamposEditarRegistroGruRieCovVis(documentosGruRieCovVisObj.respuestaGrupoRiesgo.id);
   }else{
      cambiarTextoCamposEditarRegistroGruRieCovVis(0); 
   }
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDocumentoGrupoRiesgoCovidVisitante();
   });
}

function cambiarTextoCamposEditarRegistroGruRieCovVis(valOpc){
   if(valOpc == 1){
      document.querySelector('#auxLabelValGruRieCovVis01').innerText = "(obligatorio)";  
      document.getElementById('auxLabelValGruRieCovVis01').style.color = "red";
   }else{
      document.querySelector('#auxLabelValGruRieCovVis01').innerText = "(opcional)";  
      document.getElementById('auxLabelValGruRieCovVis01').style.color = "blue";
   }
}

function guardarDocumentoGrupoRiesgoCovidVisitante(){
   var campoVacio = true; 
    
   var respuestaGrupoRiesgo = parseInt($("input[name='radioPreguntaRespuestaGruRieVis']:checked").val());
   var detalleGrupoRiesgo = $("#textAreaDetalleGruRieCovVis").val();
   var evidenciaNombre = $("#inputEviDocGruRieCovVis").val();
    
   if(isNaN(respuestaGrupoRiesgo) != true){
      if(respuestaGrupoRiesgo == 1){
         if(detalleGrupoRiesgo == ""){
 	    campoVacio = false; 
         }
      }
   
      if(evidenciaNombre.length == 0){
         campoVacio = false;
      }
   }else{
      campoVacio = false; 
   }
    
   if(campoVacio){
      var dataParam={
	     id: documentosGruRieCovVisObj.id,
	     tipoDocumentoPersonalExternoId: 1,
	     respuestaGrupoRiesgo: {id: respuestaGrupoRiesgo},
	     detalleGrupoRiesgo: detalleGrupoRiesgo
      		    }
      
      callAjaxPost(URL+"/public/visitante/documento/save",dataParam,function(data){
	 guardarEvidenciaAuto(data.nuevoId,"fileEviDocGruRieCovVis",bitsEvidenciaDocPersonalExterno,
         "/public/visitante/documento/evidencia/save",function(){
	    $("#modalEditarDocumentoGruRieCovVis").remove();
		    
	    mensajeUx="<label>Los datos del registro Grupo de riesgo - COVID-19 fueron " +
	    	      "guardados con éxito.</label>"
	    mensajesUx(mensajeUx,1,"","ActualizarSeccionDocGruRieCovVis");
		    
	    $("#modalMensajeUxActualizarSeccionDocGruRieCovVis").on("hidden.bs.modal",function(){
	       habilitarDocumentoGrupoRiesgoCovidVisitante();
	    });
	 });  	
      });
   }else{
      $("#modalEditarDocumentoGruRieCovVis").modal("hide");
	       
      mensajeUx = "<label>Debe completar los campos activos.</label>";
	       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarDocumentoGruRieCovVis").modal("show");    
      });
   } 
}

function obtenerSubPanelModuloDocumentoGruRieCovVis(val,count){
	var estiloDefault="";
	if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
		estiloDefault="    border-top: 1px solid #a5aaae;"
	}
	return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
	   " <label for='colFormLabel' class='"+(count==7?"col-sm-11":"col-sm-4")+" col-form-label'>"+val.label+"</label>"+
	    "<div class='"+(count==7?"col-sm-1":"col-sm-8")+"' id='"+val.divContainer+"'>"+
	     " "+val.inputForm+
	     "<small>"+val.sugerencia+" </small>"+
	    "</div>"+
	  "</div>";
}
