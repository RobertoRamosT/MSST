
var documentosGruRieCovTraConObj = {};
var listDocumentosGruRieCovTraCon = [];
var valorIndicadorGruRieCovTraCon;
var listRespuestaSimple = [];
var mensajeUx;

function habilitarDocumentoGrupoRiesgoCovidTrabContratista(){
    
   var dataParam={
	  tipoDocumentoPersonalExternoId: 1
                 };
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/contratista/trabajador_contratista/documento',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	     var textIn= "";
 			
 	     listDocumentosGruRieCovTraCon = data.documentos;
 	     listRespuestaSimple = data.respuesta;
 	     valorIndicadorGruRieCovTraCon = data.valorIndicador;
 	    
 	     $(".divListPrincipal").html("");
 	     
 	     var textTotal="";
 	     
 	     if(listDocumentosGruRieCovTraCon.length == 0){
 		
 		documentosGruRieCovTraConObj={
 	           id:0,respuestaGrupoRiesgo:{id:""},
 	           detalleGrupoRiesgo:""
 		                          }
 		
 		mensajeUx = "<br><label style='font-size:20px;'>Antes de continuar, debe completar los datos " +
 			    "del siguiente formulario.</label>";
 		
 		mensajesUx(mensajeUx,7,"","CompletarRegistroInicialTrabContratista");
		    
		$("#modalMensajeUxCompletarRegistroInicialTrabContratista").on("hidden.bs.modal",function(){
		   editarDocumentoGrupoRiesgoCovidTrabContratista();
		});
 		
 	     }else{
 		    
 	        listDocumentosGruRieCovTraCon.forEach(function(val,index){
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
 	 	           		"href='"+URL+"/contratista/trabajador_contratista/documento/evidencia?id="+val.id+"'>"+
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
 	           textTotal+="<div class='divMovilGrupoRiesgoTrabContratista' " +
 	           		   "id='divGrupoRiesgoTrabContratista"+val.id+"'></div>";
 	           
 	           documentosGruRieCovTraConObj = listDocumentosGruRieCovTraCon[index];
 	        });
             }
 	     
 	     if(valorIndicadorGruRieCovTraCon.indicadorDocGrupoRiesgo != 1){
 	     
    	        var textNuevo ="";
    	     
    	        textNuevo = "<div id='estadoMovilModificarGrupoRiesgoTrabContratista'>" +
    	                       "<div class='tituloSubList'> Modificar datos actuales - Grupo de riesgo " +
    	                          "<button style='font-size:19px' title='Editar datos actuales del documento.' " +
    	                                  "class='btn btn-success' onclick='editarDocumentoGrupoRiesgoCovidTrabContratista()'>"+
    	                             "<i class='fa fa-pencil'></i> Editar registro" +
    	                          "</button>" +
    	                       "</div>" +
    	                       "<div class='contenidoSubList' style='display:none'>" +
    	                       "</div>" +
    	                    "</div>";
    	     
    	        $(".divListPrincipal").append(textNuevo);
 	     }
 	    
 	     listPanelesPrincipal.push(
 		{id:"infoMovilGrupoRiesgoTrabContratista",clase:"",
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

function editarDocumentoGrupoRiesgoCovidTrabContratista(){
   
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
          return val2.id - val.id;
       });
	    
   var radiosPreguntaResGruRieTraCon = crearRadiosAuto("radioPreguntaRespuestaGruRieTraCon",listBooleanSiNo,
	  documentosGruRieCovTraConObj.respuestaGrupoRiesgo.id,"id","nombre",
	  "cambiarTextoCamposEditarRegistroGruRieCovTraCon");
   
   var listItemsRegistro=[
          {sugerencia:"",label:"¿Pertenece al grupo de riesgo - COVID-19?",
           inputForm:radiosPreguntaResGruRieTraCon,divContainer:""},
          {sugerencia:"",label:"Detalle " +
           "<span id='auxLabelValGruRieCovTraCon01' style='font-weight:bold;'></span>",
           inputForm:"<textarea class='form-control' id='textAreaDetalleGruRieCovTraCon' rows='5'></textarea>",
           divContainer:""},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",label:"Formato a completar",
           inputForm:"<a target='_blank' href='"+URL+"/empresa/documento/evidencia?id="+
                         getSession("gestopcompanyid")+"&tipoId="+8+"' " +
                        "class='efectoLink'>" +
                        "<i class='fa fa-download'></i> Descargar" +
                     "</a>"},
          {sugerencia:"",label:"Evidencia",
           inputForm:"",divContainer:"divEvidenciaGruRieCovTraCon"},
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
      textFormRegistro += obtenerSubPanelModuloDocumentoGruRieCovTraCon(val,index+1);
   });
 	
   var opciones={
 	  id:"modalEditarDocumentoGruRieCovTraCon",
 	  nombre:"Registro Grupo de riesgo - COVID-19",
 	  contenido:"<form id='formEditarDocumentoGruRieCovTraCon' class='eventoGeneral'>"+textFormRegistro+"</form>"
    		}
    
   crearModalPrincipalUsuario(opciones,function(){},false,true);
   	
   var editarDiv = $("#formEditarDocumentoGruRieCovTraCon");
 	
   editarDiv.find("#textAreaDetalleGruRieCovTraCon").val(documentosGruRieCovTraConObj.detalleGrupoRiesgo);
   
   var options={
          container: "#divEvidenciaGruRieCovTraCon",
          functionCall: function(){},
          descargaUrl: "/contratista/trabajador_contratista/documento/evidencia?id="+documentosGruRieCovTraConObj.id,
          esNuevo: (documentosGruRieCovTraConObj.id == 0),
          idAux: "DocGruRieCovTraCon",
          evidenciaNombre: documentosGruRieCovTraConObj.evidenciaNombre
	       };

   crearFormEvidenciaCompleta(options);
   
   if(documentosGruRieCovTraConObj.id > 0){
      cambiarTextoCamposEditarRegistroGruRieCovTraCon(documentosGruRieCovTraConObj.respuestaGrupoRiesgo.id);
   }else{
      cambiarTextoCamposEditarRegistroGruRieCovTraCon(0); 
   }
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDocumentoGrupoRiesgoCovidTrabContratista();
   });
}

function cambiarTextoCamposEditarRegistroGruRieCovTraCon(valOpc){
   if(valOpc == 1){
      document.querySelector('#auxLabelValGruRieCovTraCon01').innerText = "(obligatorio)";  
      document.getElementById('auxLabelValGruRieCovTraCon01').style.color = "red";
   }else{
      document.querySelector('#auxLabelValGruRieCovTraCon01').innerText = "(opcional)";  
      document.getElementById('auxLabelValGruRieCovTraCon01').style.color = "blue";
   }
 }

function guardarDocumentoGrupoRiesgoCovidTrabContratista(){
   var campoVacio = true; 
    
   var respuestaGrupoRiesgo = parseInt($("input[name='radioPreguntaRespuestaGruRieTraCon']:checked").val());
   var detalleGrupoRiesgo = $("#textAreaDetalleGruRieCovTraCon").val();
   var evidenciaNombre = $("#inputEviDocGruRieCovTraCon").val();

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
	     id: documentosGruRieCovTraConObj.id,
	     tipoDocumentoPersonalExternoId: 1,
	     respuestaGrupoRiesgo: {id: respuestaGrupoRiesgo},
	     detalleGrupoRiesgo: detalleGrupoRiesgo
      		    }
      
      callAjaxPost(URL+"/contratista/trabajador_contratista/documento/save",dataParam,function(data){
	 guardarEvidenciaAuto(data.nuevoId,"fileEviDocGruRieCovTraCon",bitsEvidenciaDocPersonalExterno,
         "/contratista/trabajador_contratista/documento/evidencia/save",function(){
	    $("#modalEditarDocumentoGruRieCovTraCon").remove();
		    
	    mensajeUx="<label>Los datos del registro Grupo de riesgo - COVID-19 fueron " +
	    	      "guardados con éxito.</label>"
	    mensajesUx(mensajeUx,1,"","ActualizarSeccionDocGruRieCovTraCon");
		    
	    $("#modalMensajeUxActualizarSeccionDocGruRieCovTraCon").on("hidden.bs.modal",function(){
	       habilitarDocumentoGrupoRiesgoCovidTrabContratista();
	    });
	 });  	
      });
   }else{
      $("#modalEditarDocumentoGruRieCovTraCon").modal("hide");
	       
      mensajeUx = "<label>Debe completar los campos activos.</label>";
	       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarDocumentoGruRieCovTraCon").modal("show");    
      });
   } 
}

function obtenerSubPanelModuloDocumentoGruRieCovTraCon(val,count){
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