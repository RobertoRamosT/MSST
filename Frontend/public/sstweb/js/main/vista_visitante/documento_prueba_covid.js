
var documentosPruCovVisObj = {};
var listDocumentosPruCovVis = [];
var listTipoPruebaCovid = [];
var listResultadoPruebaCovid = [];
var valorIndicadorPruCovVis;
var indexDocumentosPruCovVis;
var mensajeUx;

function toggleMenuOpcionDocumentoPruebaCovidVisitante(obj,pindex){
   documentosPruCovVisObj = listDocumentosPruCovVis[pindex]; 
   indexDocumentosPruCovVis = pindex;
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesDocumentoPruebaCovidVisitante=[
       {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
        functionClick:function(data){editarDocumentoPruebaCovidVisitante()}}
//     {id:"opcElimnar",nombre:"<i class='fa fa-times'></i> Eliminar",
//      functionClick:function(data){eliminarDocumentoPruebaCovidVisitante()}}
                                                 ]

function marcarSubOpcionDocumentoPruebaCovidVisitante(pindex){
   funcionalidadesDocumentoPruebaCovidVisitante[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarDocumentoPruebaCovidVisitante(){
    
   var dataParam={
	  tipoDocumentoPersonalExternoId: 2
                 };
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/public/visitante/documento',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	     var textIn= "";
 			
 	     listDocumentosPruCovVis = data.documentos;
 	     listResultadoPruebaCovid = data.resultado;
 	     listTipoPruebaCovid = data.tipo;
 	     valorIndicadorPruCovVis = data. valorIndicador;
 	    
 	     $(".divListPrincipal").html("");
 	     
 	     var textTotal="";
 	     
 	     listDocumentosPruCovVis.forEach(function(val,index){
 		
  	        var btnOpcion="";
  	        var menuOpcion = "";
  	        
  	        if(valorIndicadorPruCovVis.indicadorDocPruebaCovid != 1 && index == 0){
  	            
  	           menuOpcion="<ul class='list-group listaFinalGestionGosst'>";
  	        
  	           funcionalidadesDocumentoPruebaCovidVisitante.forEach(function(val1,index1){
  		      menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionDocumentoPruebaCovidVisitante("+index1+")'>"+
  		                      val1.nombre+
  		                  "</li>";
  	           });
  		
  	           menuOpcion+="</ul>";
  			
  	           btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionDocumentoPruebaCovidVisitante(this,"+index+")'>" +
  			          "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
  			       "</a>" ;
  	        }
  	        
 	        var listTotal=[
 	               {sugerencia:"",
 	        	label:"<i class='fa fa-check-square-o'></i> Tipo - prueba COVID-19",
 	        	inputForm:val.tipoPrueba.nombre+btnOpcion+menuOpcion},
 		       {sugerencia:"",
 		        label:"<i class='fa fa-check-square-o'></i> Resultado - prueba COVID-19",
 		        inputForm:val.resultadoPrueba.nombre},
 		       {sugerencia:"",
 		        label:"<i class='fa fa-calendar'></i> Fecha del resultado - prueba COVID-19 ",
 		        inputForm:val.fechaPruebaRealizadaTexto},
 		       {sugerencia:"",
 	 	        label:"<i class='fa fa-calendar'></i> Fecha fin de vigencia - prueba COVID-19 ",
 	 	        inputForm:val.fechaFinVigenciaTexto},
 	               {sugerencia:"",
 	 	        label:"<i class='fa fa-check-square-o'></i> Evidencia",
 	 	        inputForm:"<a class='efectoLink' " +
 	 	           	     "href='"+URL+"/public/visitante/documento/evidencia?id="+val.id+"'>"+
 	 	                      val.evidenciaNombre+
 	 	                  "</a>"},
 	 	       {sugerencia:"",
 	 	  	label:"<i class='fa fa-pencil-square-o'></i> Registrado el ",
 	 	  	inputForm:val.fechaActualizacionTexto},
 	 	       {sugerencia:"",label:"",inputForm:""},
 	 	       {sugerencia:"",
 	 	 	label:"<label style='color:blue;'> Evaluación del registro </label> ",
 	 	 	inputForm:""},
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
 	        textTotal+="<div class='divMovilPruebaCovidVisitante' id='divPruebaCovidVisitante"+val.id+"'></div>";
 	     });
             
// 	     if(valorIndicadorPruCovVis.indicadorDocPruebaCovid == 0){
    	        var textNuevo ="";
    	     
    	        textNuevo = "<div id='estadoMovilModificarPruebaCovidVisitante'>" +
    	                       "<div class='tituloSubList'> Nuevo registro - Prueba COVID-19 " +
    	                          "<button style='font-size:19px' title='Registrar nuevo documento Prueba COVID-19.' " +
    	                                  "class='btn btn-success' onclick='registrarNuevoDocumentoPruebaCovidVisitante()'>"+
    	                             "<i class='fa fa-plus-square'></i> Registrar" +
    	                          "</button>" +
    	                       "</div>" +
    	                       "<div class='contenidoSubList' style='display:none'>" +
    	                       "</div>" +
    	                    "</div>";
    	     
    	        $(".divListPrincipal").append(textNuevo);
// 	     }
    	     
    	     listPanelesPrincipal.push(
 	        {id:"infoMovilPruebaCovidVisitante",clase:"",
 	 	 nombre:""+"Registros Prueba COVID-19 ("+listDocumentosPruCovVis.length+")",
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

function registrarNuevoDocumentoPruebaCovidVisitante(){
   documentosPruCovVisObj={
      id:0,tipoPrueba:{id:""},
      resultadoPrueba:{id:""}
		          }
   
   editarDocumentoPruebaCovidVisitante();
}

function editarDocumentoPruebaCovidVisitante(){
    
   listResultadoPruebaCovid = listResultadoPruebaCovid.filter(function(val,index){
       if(val.id == 1 || val.id == 2){return true; 
       }else{return false;}
    });
   
   listTipoPruebaCovid = listTipoPruebaCovid.filter(function(val,index){
      if(val.id == 5 || val.id == 6){return true; 
      }else{return false;}
   });
    
   var selTipoPruebaCovid = crearSelectOneMenuOblig("selTipoPruebaCovid","",listTipoPruebaCovid,
	  documentosPruCovVisObj.tipoPrueba.id,"id","nombre"); 
    
   var selResultadoPruebaCovid = crearSelectOneMenuOblig("selResultadoPruebaCovid","",listResultadoPruebaCovid,
	  documentosPruCovVisObj.resultadoPrueba.id,"id","nombre");
    
   var listItemsRegistro=[
          {sugerencia:"",label:"Tipo - prueba COVID-19",
           inputForm:selTipoPruebaCovid,divContainer:""},
          {sugerencia:"",label:"Resultado - prueba COVID-19",
           inputForm:selResultadoPruebaCovid,divContainer:""},
          {sugerencia:"",label:"Fecha del resultado - prueba COVID-19",
           inputForm:"<input type='date' id='inputFechaPruReaCovVis' class='form-control' " +
           		    "onchange='calcularFechaFinVigenciaPruebaCovidVisitante()' " +
           		    "max='"+sumaFechaDias(30,getSession("fechaHoyOrdenInversoTexto"))+"'>",
           divContainer:""},
          {sugerencia:"",label:"Fecha fin de vigencia - prueba COVID-19",
           inputForm:"<label id='labelFechaFinVigPruCovVis'></label>",
           divContainer:""},
          {sugerencia:"",label:"Evidencia",
           inputForm:"",divContainer:"divEvidenciaPruCovVis"},
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
      textFormRegistro += obtenerSubPanelModuloDocPruCovVis(val,index+1);
   });
 	
   var opciones={
 	  id:"modalEditarDocumentoPruCovVis",
 	  nombre:"Registro Prueba - COVID-19",
 	  contenido:"<form id='formEditarDocumentoPruCovVis' class='eventoGeneral'>"+textFormRegistro+"</form>"
    		}
    
   crearModalPrincipalUsuario(opciones,function(){},false,true);
   	
   var editarDiv = $("#formEditarDocumentoPruCovVis");
 	
   if(documentosPruCovVisObj.id > 0){
      editarDiv.find("#inputFechaPruReaCovVis").val(convertirFechaInput(documentosPruCovVisObj.fechaPruebaRealizada));
   }
   
   var options={
          container: "#divEvidenciaPruCovVis",
          functionCall: function(){},
          descargaUrl: "/public/visitante/documento/evidencia?id="+documentosPruCovVisObj.id,
          esNuevo: (documentosPruCovVisObj.id == 0),
          idAux: "DocPruCovVis",
          evidenciaNombre: documentosPruCovVisObj.evidenciaNombre
	       };

   crearFormEvidenciaCompleta(options);
   
   
   if(documentosPruCovVisObj.id > 0){
      calcularFechaFinVigenciaPruebaCovidVisitante();
   }
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDocumentoPruebaCovidVisitante();
   });
}

function calcularFechaFinVigenciaPruebaCovidVisitante(){
   var fechaFinVigenciaPruCovVis = 
          convertirFechaNormal(sumaFechaDias(30,$("#inputFechaPruReaCovVis").val()));
   
   if(fechaFinVigenciaPruCovVis != 'aN-aN-NaN'){
      document.querySelector('#labelFechaFinVigPruCovVis').innerText = fechaFinVigenciaPruCovVis;
   }else{
      document.querySelector('#labelFechaFinVigPruCovVis').innerText = "";
   }
}

function guardarDocumentoPruebaCovidVisitante(){
   var campoVacio = true; 
    
   var tipoPrueba = parseInt($("#selTipoPruebaCovid").val());
   var resultadoPrueba = parseInt($("#selResultadoPruebaCovid").val());
   
   var fechaPruebaRealizada = convertirFechaTexto($("#inputFechaPruReaCovVis").val());
   var inputFechaPruebaRealizada;
   
   if(!fechaPruebaRealizada){  
      inputFechaPruebaRealizada = null;
   }else{
      inputFechaPruebaRealizada = fechaPruebaRealizada;
   }
   
   if(inputFechaPruebaRealizada != null){
      var fechaFinVigencia = convertirFechaTexto(sumaFechaDias(30,$("#inputFechaPruReaCovVis").val()));
   }
   
   var evidenciaNombre = $("#inputEviDocPruCovVis").val();
    
   if(evidenciaNombre.length == 0 || inputFechaPruebaRealizada == null){
      campoVacio = false;
   }
    
   if(campoVacio){
      var dataParam={
	     id: documentosPruCovVisObj.id,
	     tipoDocumentoPersonalExternoId: 2,
	     tipoPrueba: {id: tipoPrueba},
	     resultadoPrueba: {id: resultadoPrueba},
	     fechaPruebaRealizada: inputFechaPruebaRealizada,
	     fechaFinVigencia: fechaFinVigencia
      		    }
      
      callAjaxPost(URL+"/public/visitante/documento/save",dataParam,function(data){
	 guardarEvidenciaAuto(data.nuevoId,"fileEviDocPruCovVis",bitsEvidenciaDocPersonalExterno,
         "/public/visitante/documento/evidencia/save",function(){
	    $("#modalEditarDocumentoPruCovVis").remove();
		    
	    mensajeUx="<label>Los datos del registro Prueba - COVID-19 fueron " +
	    	      "guardados con éxito.</label>";
	    
	    mensajesUx(mensajeUx,1,"","ActualizarSeccionDocPruCovVis");
		    
	    $("#modalMensajeUxActualizarSeccionDocPruCovVis").on("hidden.bs.modal",function(){
		habilitarDocumentoPruebaCovidVisitante();
	    });
	 });  	
      });
   }else{
      $("#modalEditarDocumentoPruCovVis").modal("hide");
	       
      mensajeUx = "<label>Debe completar todos los campos.</label>";
	       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarDocumentoPruCovVis").modal("show");    
      });
   } 
}

function eliminarDocumentoPruebaCovidVisitante(){
   mensajeUx="<label>¿Está seguro de eliminar el registro Prueba " +
             "COVID-19 seleccionado?</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarDocPruCovVis");

   $("#btnDevolverValorRespEliminarDocPruCovVis").on("click",function(){
      var dataParam={
	     id:documentosPruCovVisObj.id
      		    };

      callAjaxPost(URL+'/public/visitante/documento/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
		mensajeUx="<label>El registro Prueba - COVID-19 se ha eliminado " +
		          "correctamente.</label>";
		
		mensajesUx(mensajeUx,1,"");
		
		habilitarDocumentoPruebaCovidVisitante();
		break;
		
	    default:
		mensajeUx="Error al eliminar el registro.";
	    	mensajesUx(mensajeUx,2,"");	
         }
      });
   });
}

function obtenerSubPanelModuloDocPruCovVis(val,count){
   var estiloDefault="";
	
   if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
      estiloDefault="    border-top: 1px dashed #a5aaae;"
   }
	
   return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
	    " <label for='colFormLabel' class='"+(count == 7?"col-sm-11":"col-sm-4")+" col-form-label'>"+
	         val.label+
	     "</label>"+
	     "<div class='"+(count == 7?"col-sm-1":"col-sm-8")+"' id='"+val.divContainer+"'>"+
	     " "+val.inputForm+
	     "<small>"+val.sugerencia+" </small>"+
	  "</div>"+
       "</div>";
}
