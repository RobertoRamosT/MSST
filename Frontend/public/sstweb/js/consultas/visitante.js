
function verBuscarDatosVisitante(){
   $(".contenidoVisitante").remove();$(".contenidoTrabContratista").remove();
   $(".contenidoContratista").remove();$(".contenidoTrabInterno").remove();
   
   var containerWelcome = $("#containerWelcome");
   
   containerWelcome
   .append($("<div>",{class:"seccionInduccion contenidoVisitante",
                      id:"seccionBuscarVisitante",
                      html:$("<div>",{class:"divTituloSeccion",
               	                      html:"Buscar visitante"})}))
   .append($("<div>",{class:"seccionInduccion contenidoVisitante",
                      id:"seccionDatosVisitante",
                      html:$("<div>",{class:"divTituloSeccion",
               	                      html:"Datos del visitante"})}))
   .append($("<div>",{class:"seccionInduccion contenidoVisitante",
                      id:"seccionDocumentosVisitante",
                      html:$("<div>",{class:"divTituloSeccion",
               	                      html:"Documentos del visitante"})}));
   
   $("#seccionBuscarVisitante")
   .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                      html:"<div class='col-sm-4'>DNI: </div>" +
                     	   "<div class='col-sm-8'>" +
                     	      "<input type='text' class='form-control' id='inputIngresarDni'>" +
                     	   "</div>"}))
   .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",
                      html:$("<button>",{class:"btn btn-success",
               	                         html:"<i class='fa fa-search'></i>Buscar",
               	                         click:buscarDatosVisitante})}));

   $("#seccionDatosVisitante").hide();
   $("#seccionDocumentosVisitante").hide();
}

function buscarDatosVisitante(){
   var dni = $("#inputIngresarDni").val().trim();
    
   if(dni != ""){
    
   $("#seccionDatosVisitante")
   .html($("<div>",{class:"divTituloSeccion",
                    html:"Datos del visitante"}));
   
   $("#seccionDocumentosVisitante")
   .html($("<div>",{class:"divTituloSeccion",
                    html:"Documentos del visitante" +
                         "<button id='btnBuscarFechaEstDocVis' class='btn btn-success' " +
                                 "onclick='consultaEstadoDocPorFechaVis()' style='float:right;'>" +
                            "<i class='fa fa-calendar'></i> Consulta por fecha" +
                         "</button>"}));
       
   $("#msgIngresarDni").html("");
    
   if(dni.length < 8){
      $("#msgIngresarDni").html("Documento debe ser mayor a 8 números/letras");
   }
    
   var dataParam={
      empresaId: parseInt(getSession("empresaId")),
      dni: dni
   };
   
   callAjaxPost(URL+"/public/consulta/visitante/empresa/completa",dataParam,function(data){
      $("#seccionDatosVisitante").show();
	
      if(data.visitante){
	 $("#seccionDocumentosVisitante").show();
	  
         var visitanteObj = data.visitante;
	   
         $("#seccionDatosVisitante")
         .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                                    "DNI: " +
                                 "</div>" +
                            	 "<div class='col-sm-8'>"+
                            	     visitanteObj.dni+
                            	 "</div>"}))
         .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                                    "Trabaja empresa: " +
                                 "</div>" +
                            	 "<div class='col-sm-8'>"+
                            	     visitanteObj.empresaTrabajaNombre+
                            	 "</div>"}))
         .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                                    "Nombre: " +
                                 "</div>" +
                            	 "<div class='col-sm-8'>"+
                            	     visitanteObj.nombre+
                            	 "</div>"}))
         .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                            	    "Apellidos: " +
                            	 "</div>" +
                            	 "<div class='col-sm-8'>"+
                            	     visitanteObj.apellidoPaterno+" "+visitanteObj.apellidoMaterno+
                            	 "</div>"}))
         .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                            	    "Relación con la empresa a la que brinda servicios: " +
                            	 "</div>" +
                                 "<div class='col-sm-8'>"+
                                     visitanteObj.tipo.nombre+
                                 "</div>"}))
         .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
             	                    "Perfil: " +
             	                 "</div>" +
                                 "<div class='col-sm-8'>"+
                                  visitanteObj.perfil.nombre+
                                 "</div>"}));
         
         var hasAllDocuments;
         
         if(visitanteObj.perfil.id == 1){
            if(parseInt(getSession("empresaId")) == 148){
               hasAllDocuments = 
                  ((visitanteObj.respuestaVisLugRiesgo == 0 || visitanteObj.indicadorDocRegVisita == 1 ||
                    visitanteObj.indicadorDocRegVisita == 3 || visitanteObj.indicadorDocRegVisita == 4) &&
                   (visitanteObj.indicadorDocFichaSint == 1 || visitanteObj.indicadorDocFichaSint == 3 || 
   	            visitanteObj.indicadorDocFichaSint == 4)?"SÍ":"NO");
            }else{
        	hasAllDocuments = 
                    ((visitanteObj.respuestaVisLugRiesgo == 0 || visitanteObj.indicadorDocRegVisita == 1 ||
                      visitanteObj.indicadorDocRegVisita == 3 || visitanteObj.indicadorDocRegVisita == 4)
//                   (visitanteObj.indicadorDocGrupoRiesgo == 1 || visitanteObj.indicadorDocGrupoRiesgo == 3 || 
//                    visitanteObj.indicadorDocGrupoRiesgo == 4) &&
//                   (visitanteObj.indicadorDocPruebaCovid == 1 || 
//                    visitanteObj.indicadorDocPruebaCovid == 3 || visitanteObj.indicadorDocPruebaCovid == 4) &&
//                   (visitanteObj.indicadorDocFichaSint == 1 || visitanteObj.indicadorDocFichaSint == 3 || 
//  	            visitanteObj.indicadorDocFichaSint == 4) 
  	                    /*&& (visitanteObj.indicadorDocVacunaCovid != 2
  	                        && visitanteObj.indicadorDocVacunaCovid != 0)*/?"SÍ":"NO");
            }
             
            $("#seccionDocumentosVisitante")
            .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                               html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                            	       "¿Subió todos los documentos? " +
                            	    "</div>" +
                                    "<div class='col-sm-8' style='font-weight:bold;color:"+
                                         (hasAllDocuments == "SÍ"?"blue;":"red;")+"'>"+
                                        hasAllDocuments +
                                        "<a class='efectoLink' style='float:right;' id='idDetalleDocumento'>"+
				        "</a>"+
                                    "</div>"}))
            .append($("<div>",{class:"divDescripcionDetalleDocumento divDatoVisitante",
                               html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                            	       "¿Subió documento SCTR / Seguro de Accidente Personal? " +
                            	    "</div>" +
                                    "<div class='col-sm-8'>"+
                                     (visitanteObj.respuestaVisLugRiesgo == 0?"No es necesario ("+visitanteObj.fechaFinVigRegVisTexto+")":
				      (visitanteObj.respuestaVisLugRiesgo == -1?"No cumple":
				       (visitanteObj.indicadorDocRegVisita == 1?"Cumple ("+visitanteObj.fechaFinVigRegVisTexto+")":
				        (visitanteObj.indicadorDocRegVisita == 0 || visitanteObj.indicadorDocRegVisita == 2?
				         "No cumple":"En evaluación ("+visitanteObj.fechaFinVigRegVisTexto+")")))) +
                                    "</div>"}));
         
            if(parseInt(getSession("empresaId")) == 148){
               $("#seccionDocumentosVisitante")
               .append($("<div>",{class:"divDescripcionDetalleDocumento divDatoVisitante",
                                  html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                            	          "¿Subió el documento Ficha sintomatología - COVID-19? " +
                            	       "</div>" +
                                       "<div class='col-sm-8'>"+
                                        (visitanteObj.indicadorDocFichaSint == 1?"Cumple ("+visitanteObj.fechaFinVigDocFicSinTexto+")":
		                         (visitanteObj.indicadorDocFichaSint == 0 || visitanteObj.indicadorDocFichaSint == 2?
				          "No cumple":"En evaluación ("+visitanteObj.fechaFinVigDocFicSinTexto+")")) +
                                       "</div>"}));
            }
         
//         .append($("<div>",{class:"divDescripcionDetalleDocumento divDatoVisitante",
//                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
//                            	    "¿Subió documento Grupo de riesgo - COVID-19? " +
//                            	 "</div>" +
//                                 "<div class='col-sm-8'>"+
//                                  (visitanteObj.indicadorDocGrupoRiesgo == 1?"Cumple":
//				     (visitanteObj.indicadorDocGrupoRiesgo == 0 || visitanteObj.indicadorDocGrupoRiesgo == 2?"No cumple":"En evaluación")) +
//				 "</div>"}))
//         .append($("<div>",{class:"divDescripcionDetalleDocumento divDatoVisitante",
//                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
//                            	    "¿Subió documento Prueba COVID-19? " +
//                            	 "</div>" +
//                                 "<div class='col-sm-8'>"+
//                                  (visitanteObj.indicadorDocPruebaCovid == 1?"Cumple ("+visitanteObj.fechaFinVigDocPruCovTexto+")":
//					   (visitanteObj.indicadorDocPruebaCovid == 0 || visitanteObj.indicadorDocPruebaCovid == 2?
//					       "No cumple":"En evaluación ("+visitanteObj.fechaFinVigDocPruCovTexto+")")) +
//                                 "</div>"}))
//         .append($("<div>",{class:"divDescripcionDetalleDocumento divDatoVisitante",
//                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
//                            	    "¿Subió el documento Ficha sintomatología - COVID-19? " +
//                            	 "</div>" +
//                                 "<div class='col-sm-8'>"+
//                                  (visitanteObj.indicadorDocFichaSint == 1?"Cumple ("+visitanteObj.fechaFinVigDocFicSinTexto+")":
//		                     (visitanteObj.indicadorDocFichaSint == 0 || visitanteObj.indicadorDocFichaSint == 2?
//				        "No cumple":"En evaluación ("+visitanteObj.fechaFinVigDocFicSinTexto+")")) +
//                                 "</div>"}));
//         .append($("<div>",{class:"divDescripcionDetalleDocumento divDatoVisitante",
//                            html:"<div class='col-sm-4' style='font-weight:bold;'>" +
//                            	    "¿Subió documento Vacuna COVID-19?" +
//                            	 "</div>" +
//                                 "<div class='col-sm-8'>"+
//                                  (visitanteObj.indicadorDocVacunaCovid == 1?"Cumple":
//                                   (visitanteObj.indicadorDocVacunaCovid == 0 || visitanteObj.indicadorDocVacunaCovid == 2?
//                                    "No cumple":"En evaluación")) +
//                                 "</div>"}));
         }else{
            if(parseInt(getSession("empresaId")) == 148){
               hasAllDocuments = 
                  ((visitanteObj.respuestaVisLugRiesgo == 0 || visitanteObj.indicadorDocRegVisita == 1 ||
                    visitanteObj.indicadorDocRegVisita == 3 || visitanteObj.indicadorDocRegVisita == 4) &&
                   (visitanteObj.indicadorDocFichaSint == 1 || visitanteObj.indicadorDocFichaSint == 3 || 
	            visitanteObj.indicadorDocFichaSint == 4)?"SÍ":"NO");
            }else{
               hasAllDocuments = 
                  ((visitanteObj.respuestaVisLugRiesgo == 0 || visitanteObj.indicadorDocRegVisita == 1 ||
                    visitanteObj.indicadorDocRegVisita == 3 || visitanteObj.indicadorDocRegVisita == 4)?"SÍ":"NO");
            } 
            
             $("#seccionDocumentosVisitante")
             .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                                html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                                	    "¿Subió todos los documentos? " +
                                	 "</div>" +
                                     "<div class='col-sm-8' style='font-weight:bold;color:"+
                                                            (hasAllDocuments == "SÍ"?"blue;":"red;")+"'>"+
                                         hasAllDocuments +
                                         "<a class='efectoLink' style='float:right;' id='idDetalleDocumento'>"+
    				     "</a>"+
                                     "</div>"}))
             .append($("<div>",{class:"divDescripcionDetalleDocumento divDatoVisitante",
                                html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                                	    "¿Subió documento SCTR / Seguro de Accidente Personal? " +
                                	 "</div>" +
                                     "<div class='col-sm-8'>"+
                                      (visitanteObj.respuestaVisLugRiesgo == 0?"No es necesario ("+visitanteObj.fechaFinVigRegVisTexto+")":
    				     (visitanteObj.respuestaVisLugRiesgo == -1?"No cumple":
    				        (visitanteObj.indicadorDocRegVisita == 1?"Cumple ("+visitanteObj.fechaFinVigRegVisTexto+")":
    				           (visitanteObj.indicadorDocRegVisita == 0 || visitanteObj.indicadorDocRegVisita == 2?
    				               "No cumple":"En evaluación ("+visitanteObj.fechaFinVigRegVisTexto+")")))) +
                                     "</div>"}));
             
             if(parseInt(getSession("empresaId")) == 148){
                $("#seccionDocumentosVisitante")
                .append($("<div>",{class:"divDescripcionDetalleDocumento divDatoVisitante",
                                   html:"<div class='col-sm-4' style='font-weight:bold;'>" +
                                	   "¿Subió el documento Ficha sintomatología - COVID-19? " +
                                	"</div>" +
                                        "<div class='col-sm-8'>"+
                                         (visitanteObj.indicadorDocFichaSint == 1?"Cumple ("+visitanteObj.fechaFinVigDocFicSinTexto+")":
    		                          (visitanteObj.indicadorDocFichaSint == 0 || visitanteObj.indicadorDocFichaSint == 2?
    				           "No cumple":"En evaluación ("+visitanteObj.fechaFinVigDocFicSinTexto+")")) +
                                        "</div>"}));
             }
//             .append($("<div>",{class:"divDescripcionDetalleDocumento divDatoVisitante",
//                                html:"<div class='col-sm-4' style='font-weight:bold;'>" +
//                                	    "¿Subió documento Vacuna COVID-19?" +
//                                	 "</div>" +
//                                     "<div class='col-sm-8'>"+
//                                      (visitanteObj.indicadorDocVacunaCovid == 1?"Cumple":
//                                       (visitanteObj.indicadorDocVacunaCovid == 0 || visitanteObj.indicadorDocVacunaCovid == 2?
//                                        "No cumple":"En evaluación")) +
//                                     "</div>"}));  
         }
         
         ocultarDetalleDocumentos();
                                 
         if(data.cursos.length > 0){
            $("#seccionDocumentosVisitante")
            .append($("<div>",{class:"divTituloSeccion",
        	               html:"<div class='col-sm-8'>Inducciones vigentes </div>" +
        	               	    "<div class='col-sm-4'>Fecha fin vigencia</div>"}));
         }else{
            $("#seccionDocumentosVisitante")
            .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
        	               html:"<div class='col-sm-12' style='color:red'> Sin inducciones vigentes </div>"}))
         }
            
         data.cursos.forEach(function(val1){
            $("#seccionDocumentosVisitante")
            .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
        	               html:"<div class='col-sm-8'>"+
        	                        val1.nombre+
        	                    "</div>" +
        	                    "<div class='col-sm-4'>" +
							     val1.evaluacionCargo.icono+" "+val1.evaluacion.fechaFinVigenciaTexto+
        	                    "</div>"}))});
      }else{
         $("#seccionDatosVisitante")
         .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"Visitante no encontrado"}))
      }
   });
   
   }else{
	mensajeUx = "<label>Debe ingresar el DNI del visitante.</label>";
	mensajesUx(mensajeUx,2,"");
   }
}

function ocultarConsultaDiaVis(){
   $("#modalConsultaDiaVis").modal("hide");
}

function verConsultaDiaVis(){
   $("#modalConsultaDiaVis").modal("show");
}

function consultaEstadoDocPorFechaVis(){
   $("#modalConsultaDiaVis").remove();
   
   var contenido = "";
	
   var listContenido=[
      {sugerencia:"",label:"Fecha",
       inputForm:"<input type='date' id='fechaConsultaDiaVis' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' onclick='ocultarConsultaDiaVis()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button id='btnAplicarConsultaDiaVis' class='btn btn-success' " +
       		         "type='submit' style='float:right;'>" +
	            "<i class='fa fa-book'></i> Consultar" +
	      	 "</button>"},
   ];
				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
				
   var modalOptionsConsultaDiaVis={
      id: "modalConsultaDiaVis",
      nombre: "<i class='fa fa-search'></i> Consulta por fecha - Visitante",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
				
   crearModalPrincipalUsuario(modalOptionsConsultaDiaVis,function(){},true,true);
				
   $("#btnAplicarConsultaDiaVis").on("click",function(){
      ocultarConsultaDiaVis();
      validacionConsultaDiaVis();
   });
    
   $("#fechaConsultaDiaVis").val(obtenerFechaActual());
   $("#modalConsultaDiaVis").modal("show");
}

function ocultarConsultaDiaExactoVis(){
   $("#modalConsultaDiaExactoVis").modal("hide");
}

function validacionConsultaDiaVis(){
   var campoVacio = true;   
   
   var dni = $("#inputIngresarDni").val().trim();
   var fechaConsulta = $("#fechaConsultaDiaVis").val();
   
   if(fechaConsulta.length == 0){
      campoVacio = false;
   }
   
   if(campoVacio){
      var dataParam={
	 empresaId: getSession("empresaId"),
	 dni: dni,
	 fechaConsultaTexto: fechaConsulta
      };
       
      callAjaxPost(URL+"/public/consulta/visitante/fecha_especifica",dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalConsultaDiaExactoVis").remove();
	       var visitanteObj = data.visitante;
	      
	       var estadoSctr = 
		  (visitanteObj.respuestaVisLugRiesgo == 0?"No es necesario ("+visitanteObj.fechaFinVigRegVisTexto+")":
	           (visitanteObj.respuestaVisLugRiesgo == -1?"No cumple":
	            (visitanteObj.indicadorDocRegVisita == 1?"Cumple ("+visitanteObj.fechaFinVigDocRegVisTexto+")":
	             (visitanteObj.indicadorDocRegVisita == 0 || visitanteObj.indicadorDocRegVisita == 2?
		      "No cumple":"En evaluación ("+visitanteObj.fechaFinVigRegVisTexto+")"))));
//	       
	       if(parseInt(getSession("empresaId")) == 148){
	          var estadoFechaSint = 
		     (visitanteObj.indicadorDocFichaSint == 1?"Cumple ("+visitanteObj.fechaFinVigDocFicSinTexto+")":
	              (visitanteObj.indicadorDocFichaSint == 0 || visitanteObj.indicadorDocFichaSint == 2?
	               "No cumple":"En evaluación ("+visitanteObj.fechaFinVigDocFicSinTexto+")"));
	       }
//	       
//	       var estadoVacunaCovid = 
//		  (visitanteObj.indicadorDocVacunaCovid == 1?"Cumple":
//                   (visitanteObj.indicadorDocVacunaCovid == 0 || visitanteObj.indicadorDocVacunaCovid == 2?
//                    "No cumple":"En evaluación"));
	       
	       var hasAllDocuments = "";
	       
	       if(parseInt(getSession("empresaId")) == 148){
		  hasAllDocuments = 
	             ((visitanteObj.respuestaVisLugRiesgo == 0 || visitanteObj.indicadorDocRegVisita == 1 ||
	               visitanteObj.indicadorDocRegVisita == 3 || visitanteObj.indicadorDocRegVisita == 4) &&
		      (visitanteObj.indicadorDocFichaSint == 1 || visitanteObj.indicadorDocFichaSint == 3 || 
		       visitanteObj.indicadorDocFichaSint == 4) ?"SÍ":"NO");  
	       }else{
	          hasAllDocuments = 
		     ((visitanteObj.respuestaVisLugRiesgo == 0 || visitanteObj.indicadorDocRegVisita == 1 ||
                      visitanteObj.indicadorDocRegVisita == 3 || visitanteObj.indicadorDocRegVisita == 4)  /*&&
	              (visitanteObj.indicadorDocFichaSint == 1 || visitanteObj.indicadorDocFichaSint == 3 || 
	               visitanteObj.indicadorDocFichaSint == 4) && (visitanteObj.indicadorDocVacunaCovid != 2
	               && visitanteObj.indicadorDocVacunaCovid != 0)*/?"SÍ":"NO");
	       }
						
	       var contenido = "";
		
	       var listContenido=[
		  {sugerencia:"",label:"¿Se subió todos los documentos?",
		   inputForm:"<label style='color:"+(hasAllDocuments == "SÍ"?"blue;":"red;")+"'>"+hasAllDocuments+"</label>"},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		  {sugerencia:"",label:"¿Subió documento SCTR?",inputForm:estadoSctr}
	       ];
	       
	       if(parseInt(getSession("empresaId")) == 148){
		  listContenido.push(
		     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		     {sugerencia:"",label:"¿Subió el documento Ficha sintomatología - COVID-19?",inputForm:estadoFechaSint});
	       }
	       
//		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
//		  {sugerencia:"",label:"¿Subió documento Vacuna COVID-19?",inputForm:estadoVacunaCovid},
	       listContenido.push(
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		  {sugerencia:"",
		   label:"<button class='btn btn-danger' type='button' onclick='ocultarConsultaDiaExactoVis()'>" +
		            "<i class='fa fa-arrow-left'></i> Regresar" +
		         "</button>",
		   inputForm:"<button id='btnAplicarConsultaDiaExactoVis' class='btn btn-success' " +
		       		     "type='submit' style='float:right;'>" +
			        "<i class='fa fa-search'></i> Otra consulta" +
			     "</button>"});
						
	       listContenido.forEach(function(val){
	          contenido += obtenerSubPanelModuloVersionDos(val);
	       });
						
	       var modalOptionsConsultaDiaExactoVis={
		  id: "modalConsultaDiaExactoVis",
		  nombre: "<i class='fa fa-search'></i> Consulta - Fecha "+convertirFechaNormal(fechaConsulta)+
		          " - Visitante",
		  contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
	       };
						
	       crearModalPrincipalUsuario(modalOptionsConsultaDiaExactoVis,function(){},true,true);
						
	       $("#btnAplicarConsultaDiaExactoVis").on("click",function(){
	          ocultarConsultaDiaExactoVis();
	          verConsultaDiaVis();
	       });
		    
	       $("#modalConsultaDiaExactoVis").modal("show");
	       break;
			
	    default:
	       console.log("Ocurrió un error al realizar la consulta.");
         }
      });	
   }else{
      mensajeUx = "<label>Debe ingresar la fecha.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarFechaVis");
      
      $("#modalMensajeUxAvisoCompletarFechaVis").on("hidden.bs.modal",function(){  
	 verConsultaDiaVis();
      });
   }
}
