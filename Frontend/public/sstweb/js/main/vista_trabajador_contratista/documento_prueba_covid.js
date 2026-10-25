
var documentosPruCovTraConObj = {};
var listDocumentosPruCovTraCon = [];
var listTipoPruebaCovid = [];
var listResultadoPruebaCovid = [];
var valorIndicadorPruTraCon;
var indexDocumentosPruCovTraCon;
var mensajeUx;

function toggleMenuOpcionDocumentoPruebaCovidTrabContratista(obj,pindex){
   documentosPruCovTraConObj = listDocumentosPruCovTraCon[pindex]; 
   indexDocumentosPruCovTraCon = pindex;
   
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesDocumentoPruebaCovidTrabContratista=[
       {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
        functionClick:function(data){editarDocumentoPruebaCovidTrabContratista()}},
//     {id:"opcElimnar",nombre:"<i class='fa fa-times'></i> Eliminar",
//      functionClick:function(data){eliminarDocumentoPruebaCovidTrabContratista()}}
                                                       ]

function marcarSubOpcionDocumentoPruebaCovidTrabContratista(pindex){
   funcionalidadesDocumentoPruebaCovidTrabContratista[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarDocumentoPruebaCovidTrabContratista(){
    
   var dataParam={
	  tipoDocumentoPersonalExternoId: 2
                 };
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/contratista/trabajador_contratista/documento',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	     var textIn= "";
 			
 	     listDocumentosPruCovTraCon = data.documentos;
 	     listResultadoPruebaCovid = data.resultado;
 	     listTipoPruebaCovid = data.tipo;
 	     valorIndicadorPruTraCon = data.valorIndicador;
 	    
 	     $(".divListPrincipal").html("");
 	     
 	     var textTotal="";
 	     
 	     listDocumentosPruCovTraCon.forEach(function(val,index){
 		
 		var btnOpcion="";
 		var menuOpcion="";
 		 
 		if(valorIndicadorPruTraCon.indicadorDocPruebaCovid != 1 && index == 0){
 		   menuOpcion="<ul class='list-group listaFinalGestionGosst'>";
  	        
  	           funcionalidadesDocumentoPruebaCovidTrabContratista.forEach(function(val1,index1){
  		      menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionDocumentoPruebaCovidTrabContratista("+index1+")'>"+
  		                      val1.nombre+
  		                  "</li>";
  	           });
  		
  	           menuOpcion+="</ul>";
  			
  	           btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionDocumentoPruebaCovidTrabContratista(this,"+index+")'>" +
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
 	 	           	     "href='"+URL+"/contratista/trabajador_contratista/documento/evidencia?id="+val.id+"'>"+
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
 	        textTotal+="<div class='divMovilPruebaCovidTrabContratista' id='divPruebaCovidTrabContratista"+val.id+"'></div>";
 	     });
             
// 	     if(valorIndicadorPruTraCon.indicadorDocPruebaCovid == 0){
 	     
    	        var textNuevo ="";
    	     
    	        textNuevo = "<div id='estadoMovilModificarPruebaCovidTrabContratista'>" +
    	                       "<div class='tituloSubList'> Nuevo registro - Prueba COVID-19 " +
    	                          "<button style='font-size:19px' title='Registrar nuevo documento Prueba COVID-19.' " +
    	                                  "class='btn btn-success' onclick='registrarNuevoDocumentoPruebaCovidTrabContratista()'>"+
    	                             "<i class='fa fa-plus-square'></i> Registrar" +
    	                          "</button>" +
    	                       "</div>" +
    	                       "<div class='contenidoSubList' style='display:none'>" +
    	                       "</div>" +
    	                    "</div>";
    	     
    	        $(".divListPrincipal").append(textNuevo);
// 	     }
    	     
    	     listPanelesPrincipal.push(
 	        {id:"infoMovilPruebaCovidTrabContratista",clase:"",
 	 	 nombre:""+"Registros Prueba COVID-19 ("+listDocumentosPruCovTraCon.length+")",
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

function registrarNuevoDocumentoPruebaCovidTrabContratista(){
   documentosPruCovTraConObj={
      id:0,tipoPrueba:{id:""},
      resultadoPrueba:{id:""}
		          }
   
   editarDocumentoPruebaCovidTrabContratista();
}

function editarDocumentoPruebaCovidTrabContratista(){
	   	
   listResultadoPruebaCovid = listResultadoPruebaCovid.filter(function(val,index){
      if(val.id == 1 || val.id == 2){return true; 
      }else{return false;}
   });
   
   listTipoPruebaCovid = listTipoPruebaCovid.filter(function(val,index){
      if(val.id == 5 || val.id == 6){return true; 
      }else{return false;}
   });
   
   var selTipoPruebaCovid = crearSelectOneMenuOblig("selTipoPruebaCovid","",listTipoPruebaCovid,
	  documentosPruCovTraConObj.tipoPrueba.id,"id","nombre"); 
    
   var selResultadoPruebaCovid = crearSelectOneMenuOblig("selResultadoPruebaCovid","",listResultadoPruebaCovid,
	  documentosPruCovTraConObj.resultadoPrueba.id,"id","nombre");
    
   var listItemsRegistro=[
          {sugerencia:"",label:"Tipo - prueba COVID-19",
           inputForm:selTipoPruebaCovid,divContainer:""},
          {sugerencia:"",label:"Resultado - prueba COVID-19",
           inputForm:selResultadoPruebaCovid,divContainer:""},
          {sugerencia:"",label:"Fecha del resultado - prueba COVID-19",
           inputForm:"<input type='date' id='inputFechaPruReaCovTraCon' class='form-control' " +
           		    "onchange='calcularFechaFinVigenciaPruebaCovidTrabContratista()' " +
           		    "max='"+sumaFechaDias(30,getSession("fechaHoyOrdenInversoTexto"))+"'>",
           divContainer:""},
          {sugerencia:"",label:"Fecha fin de vigencia - prueba COVID-19",
           inputForm:"<label id='labelFechaFinVigPruCovTraCon'></label>",
           divContainer:""},
          {sugerencia:"",label:"Evidencia",
           inputForm:"",divContainer:"divEvidenciaPruCovTraCon"},
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
      textFormRegistro += obtenerSubPanelModuloDocPruCovTraCon(val,index+1);
   });
 	
   var opciones={
 	  id:"modalEditarDocumentoPruCovTraCon",
 	  nombre:"Registro Prueba - COVID-19",
 	  contenido:"<form id='formEditarDocumentoPruCovTraCon' class='eventoGeneral'>"+textFormRegistro+"</form>"
    		}
    
   crearModalPrincipalUsuario(opciones,function(){},false,true);
   	
   var editarDiv = $("#formEditarDocumentoPruCovTraCon");
 	
   if(documentosPruCovTraConObj.id > 0){
      editarDiv.find("#inputFechaPruReaCovTraCon").val(convertirFechaInput(documentosPruCovTraConObj.fechaPruebaRealizada));
   }
   
   var options={
          container: "#divEvidenciaPruCovTraCon",
          functionCall: function(){},
          descargaUrl: "/contratista/trabajador_contratista/documento/evidencia?id="+documentosPruCovTraConObj.id,
          esNuevo: (documentosPruCovTraConObj.id == 0),
          idAux: "DocPruCovTraCon",
          evidenciaNombre: documentosPruCovTraConObj.evidenciaNombre
	       };

   crearFormEvidenciaCompleta(options);
   
   if(documentosPruCovTraConObj.id > 0){
      calcularFechaFinVigenciaPruebaCovidTrabContratista();
   }
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDocumentoPruebaCovidTrabContratista();
   });
}

function calcularFechaFinVigenciaPruebaCovidTrabContratista(){
   var fechaFinVigenciaPruCovTraCon = 
          convertirFechaNormal(sumaFechaDias(30,$("#inputFechaPruReaCovTraCon").val()));
    
   if(fechaFinVigenciaPruCovTraCon != 'aN-aN-NaN'){
      document.querySelector('#labelFechaFinVigPruCovTraCon').innerText = fechaFinVigenciaPruCovTraCon;
   }else{
      document.querySelector('#labelFechaFinVigPruCovTraCon').innerText = "";
   }
}

function guardarDocumentoPruebaCovidTrabContratista(){
   var campoVacio = true; 
    
   var tipoPrueba = parseInt($("#selTipoPruebaCovid").val());
   var resultadoPrueba = parseInt($("#selResultadoPruebaCovid").val());
   
   var fechaPruebaRealizada = convertirFechaTexto($("#inputFechaPruReaCovTraCon").val());
   var inputFechaPruebaRealizada;
   
   if(!fechaPruebaRealizada){  
      inputFechaPruebaRealizada = null;
   }else{
      inputFechaPruebaRealizada = fechaPruebaRealizada;
   }
   
   if(inputFechaPruebaRealizada != null){
      var fechaFinVigencia = convertirFechaTexto(sumaFechaDias(30,$("#inputFechaPruReaCovTraCon").val()));
   }
   
   var evidenciaNombre = $("#inputEviDocPruCovTraCon").val();
    
   if(evidenciaNombre.length == 0 || inputFechaPruebaRealizada == null){
      campoVacio = false;
   }
    
   if(campoVacio){
      var dataParam={
	     id: documentosPruCovTraConObj.id,
	     tipoDocumentoPersonalExternoId: 2,
	     tipoPrueba: {id: tipoPrueba},
	     resultadoPrueba: {id: resultadoPrueba},
	     fechaPruebaRealizada: inputFechaPruebaRealizada,
	     fechaFinVigencia: fechaFinVigencia
      		    }
      
      callAjaxPost(URL+"/contratista/trabajador_contratista/documento/save",dataParam,function(data){
	 guardarEvidenciaAuto(data.nuevoId,"fileEviDocPruCovTraCon",bitsEvidenciaDocPersonalExterno,
         "/contratista/trabajador_contratista/documento/evidencia/save",function(){
	    $("#modalEditarDocumentoPruCovTraCon").remove();
		    
	    mensajeUx="<label>Los datos del registro Prueba - COVID-19 fueron " +
	    	      "guardados con éxito.</label>";
	    
	    mensajesUx(mensajeUx,1,"","ActualizarSeccionDocPruCovTraCon");
		    
	    $("#modalMensajeUxActualizarSeccionDocPruCovTraCon").on("hidden.bs.modal",function(){
		habilitarDocumentoPruebaCovidTrabContratista();
	    });
	 });  	
      });
   }else{
      $("#modalEditarDocumentoPruCovTraCon").modal("hide");
	       
      mensajeUx = "<label>Debe completar todos los campos.</label>";
	       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarDocumentoPruCovTraCon").modal("show");    
      });
   } 
}

function eliminarDocumentoPruebaCovidTrabContratista(){
   mensajeUx="<label>¿Está seguro de eliminar el registro Prueba " +
             "COVID-19 seleccionado?</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarDocPruCovTraCon");

   $("#btnDevolverValorRespEliminarDocPruCovTraCon").on("click",function(){
      var dataParam={
	     id:documentosPruCovTraConObj.id
      		    };

      callAjaxPost(URL+'/contratista/trabajador_contratista/documento/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
		mensajeUx="<label>El registro Prueba - COVID-19 se ha eliminado " +
		          "correctamente.</label>";
		
		mensajesUx(mensajeUx,1,"");
		
		habilitarDocumentoPruebaCovidTrabContratista();
		break;
		
	    default:
		mensajeUx="Error al eliminar el registro.";
	    	mensajesUx(mensajeUx,2,"");	
         }
      });
   });
}

function obtenerSubPanelModuloDocPruCovTraCon(val,count){
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
