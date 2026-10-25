
var mensajeUx;

function regresarInspeccionDesdeHerramienta(){
   $("#modalConsolidadoHerramientaInspecc").modal("hide");
}

function consolidadoHerramientaExtintor(){
   var listModal={
      id: "modalConsolidadoHerramientaInspecc",
      maxWidth: "1500px",
      nombre: "Extintores ",
      contenido:
         "<button class='btn btn-info' id='btnVolverHerramientaInspecc' title='Regresar a la vista anterior.' " +
	         "onclick='regresarInspeccionDesdeHerramienta()' style='margin-left: 5px'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"+" " +
	    "<i class='fa fa-briefcase fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnNuevaHerramienta' style='margin-left: 5px' " +
	         "title='Nuevo registro de herramienta' onclick='nuevaHerramientaInspecc()'>" +
            "<i class='fa fa-file-o fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-success' id='btnCancelarHerramienta' style='margin-left: 5px' " +
                 "title='Cancelar acción' onclick='cancelarHerramientaInspecc()'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-success' id='btnGuardarHerramienta' style='margin-left: 5px' " +
                 "title='Guardar el registro de la herramienta.' onclick='validacionCodigoHerramienta()'>" +
            "<i class='fa fa-floppy-o fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-danger' id='btnEliminarHerramienta' style='margin-left: 5px' " +
                 "title='Eliminar el registro de la herramienta.' onclick='eliminarHerramientaInspecc()'>" +
            "<i class='fa fa-times fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-info' id='btnImportHerramienta' style='margin-left: 5px' " +
                 "title='Importar una lista de herramientas desde un excel.' onclick='verSmartImportHerramientaInspecc()'>" +
            "<i class='fa fa-upload fa-2x'></i>" +
            "<i class='fa fa-info'></i>" +
         "</button>" +
	 "<div class='wrapper' id='wrapConHerrInspecc'>" +
	    "<table id='tblConHerrInspecc' class='table table-striped table-bordered table-hover table-fixed'>" +
               "<thead>" +
	          "<tr>" +
	             "<td class='tb-acc' style='width:250px'>Código</td>" +
	             "<td class='tb-acc' style='width:250px'>Ubicación</td>" +
	             "<td class='tb-acc' style='width:200px'>N° de serie</td>" +
	             "<td class='tb-acc' style='width:200px'>Tipo de agente</td>" +
	             "<td class='tb-acc' style='width:200px'>Capacidad</td>" +
	             "<td class='tb-acc' style='width:200px'>Marca</td>" +
	             "<td class='tb-acc' style='width:200px'>Rating</td>" +
	             "<td class='tb-acc' style='width:200px'>Sede</td>" +
	             "<td class='tb-acc' style='width:250px'>Certificado de operatividad</td>" +
	             "<td class='tb-acc' style='width:200px'>Fecha vencimiento de la recarga</td>" +
	             "<td class='tb-acc' style='width:200px'>Fecha vencimiento de mantenimiento</td>" +
	             "<td class='tb-acc' style='width:200px'>Fecha vencimiento de prueba hidrostática</td>" +
	             "<td class='tb-acc' style='width:200px'>N° de inspecciones asociadas</td>" +
	          "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
            "</table>" +
	 "</div>"
   };
   
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapConHerrInspecc",200);
   
   cargarConsolidadoHerramientaExtintor();
}

var listHerramientas = [];
var banderaEdicionHerramienta;
var herramientaId;
var herramientaObj={};

function cargarConsolidadoHerramientaExtintor(){
   $("#btnVolverHerramientaInspecc").show();
   $("#btnNuevaHerramienta").show();
   $("#btnCancelarHerramienta").hide();
   $("#btnGuardarHerramienta").hide();
   $("#btnEliminarHerramienta").hide();
   $("#btnImportHerramienta").show();
   
   banderaEdicionHerramienta = false;
   
   var dataParamAux={
      empresaId: getSession("gestopcompanyid")
   };
	   
   callAjaxPost(URL+'/auditoria/extintor',dataParamAux,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listHerramientas = data.listExtintores;
		      
	    $("#tblConHerrInspecc tbody tr").remove();
		 
	    listHerramientas.forEach(function(val,index){
	       $("#tblConHerrInspecc tbody").append(
	          "<tr id='trHerrInspecc"+val.id+"' onclick='editarHerramientaInspecc("+index+")'>" +
	             "<td id='tdCodigoHerr"+val.id+"'>"+val.codigo+"</td>" +
	             "<td id='tdUbicacionHerr"+val.id+"'>"+val.ubicacion+"</td>" +
	             "<td id='tdNumSerieHerr"+val.id+"'>"+val.numeroSerie+"</td>" +
	             "<td id='tdTipoAgenteHerr"+val.id+"'>"+val.tipoAgente+"</td>" +
	             "<td id='tdCapacidadHerr"+val.id+"'>"+val.capacidad+"</td>" +
	             "<td id='tdMarcaHerr"+val.id+"'>"+val.marca+"</td>" +
	             "<td id='tdRatingHerr"+val.id+"'>"+val.rating+"</td>" +
	             "<td id='tdSedeHerr"+val.id+"'>"+val.sede+"</td>" +
	             "<td id='tdEviCertiOperatividadHerr"+val.id+"'>"+val.evidenciaCertificadoOperatividadNombre+"</td>" +
	             "<td id='tdFecVenRecargaHerr"+val.id+"'>"+val.fechaFinRecargaTexto+"</td>" +
	             "<td id='tdFecVenMantHerr"+val.id+"'>"+val.fechaFinMantenimientoTexto+"</td>" +
	             "<td id='tdFecVenPruHidHerr"+val.id+"'>"+val.fechaFinPruebaHidrostaticaTexto+"</td>" +
	             "<td id='tdNumInspeccHerr"+val.id+"'>"+val.numInspecciones+"</td>" +
		  "</tr>");
	    });
		     
	    formatoCeldaSombreableTabla(true,"tblConHerrInspecc");
	    break;
		     
         default:
            alert("nop");
            break;
      }
	      
      goheadfixedY("#tblConHerrInspecc","#wrapConHerrInspecc");
   });   
}

function cancelarHerramientaInspecc(){
   cargarConsolidadoHerramientaExtintor();
}

function editarHerramientaInspecc(pindex){
   if(!banderaEdicionHerramienta){
      banderaEdicionHerramienta = true;
      formatoCeldaSombreableTabla(false,"tblConHerrInspecc");
       
      herramientaId = listHerramientas[pindex].id;
      herramientaObj = listHerramientas[pindex];
 	
      $("#trHerrInspecc"+herramientaId).addClass("fila-edicion");
        
      $("#tdCodigoHerr"+herramientaId)
      .html("<input type='text' id='inputCodigoHerr' class='form-control'>");
      $("#inputCodigoHerr").val(herramientaObj.codigo);
      
      $("#tdUbicacionHerr"+herramientaId)
      .html("<input type='text' id='inputUbicacionHerr' class='form-control'>");
      $("#inputUbicacionHerr").val(herramientaObj.ubicacion);
      
      $("#tdNumSerieHerr"+herramientaId)
      .html("<input type='text' id='inputNumSerieHerr' class='form-control'>");
      $("#inputNumSerieHerr").val(herramientaObj.numeroSerie);
      
      $("#tdTipoAgenteHerr"+herramientaId)
      .html("<input type='text' id='inputTipoAgenteHerr' class='form-control'>");
      $("#inputTipoAgenteHerr").val(herramientaObj.tipoAgente);
      
      $("#tdCapacidadHerr"+herramientaId)
      .html("<input type='text' id='inputCapacidadHerr' class='form-control'>");
      $("#inputCapacidadHerr").val(herramientaObj.capacidad);
      
      $("#tdMarcaHerr"+herramientaId)
      .html("<input type='text' id='inputMarcaHerr' class='form-control'>");
      $("#inputMarcaHerr").val(herramientaObj.marca);
      
      $("#tdRatingHerr"+herramientaId)
      .html("<input type='text' id='inputRatingHerr' class='form-control'>");
      $("#inputRatingHerr").val(herramientaObj.rating);
      
      $("#tdSedeHerr"+herramientaId)
      .html("<input type='text' id='inputSedeHerr' class='form-control'>");
      $("#inputSedeHerr").val(herramientaObj.sede);
      
      var optionEvidencia={
         isImage: false,
         container: "#tdEviCertiOperatividadHerr"+herramientaId,
         idAux: "CertiOperativ",
         esNuevo: (herramientaObj.evidenciaCertificadoOperatividadNombre.length == 0?true:false),
         functionCall: function(){},
         evidenciaNombre: herramientaObj.evidenciaCertificadoOperatividadNombre,
         descargaUrl: "/auditoria/extintor/evidencia_certificado_operatividad?id="+herramientaId+"",
         mensajeAux: "(Opcional)"
      };
	
      crearFormEvidenciaCompleta(optionEvidencia);
      
      $("#tdFecVenRecargaHerr"+herramientaId)
      .html("<input type='date' id='inputFechaFinRecargaHerr' class='form-control'>");
	 
      var valFecha1 = convertirFechaInput(herramientaObj.fechaFinRecarga);
      $("#inputFechaFinRecargaHerr").val(valFecha1);
      
      $("#tdFecVenMantHerr"+herramientaId)
      .html("<input type='date' id='inputFechaFinMantHerr' class='form-control'>");
	 
      var valFecha2 = convertirFechaInput(herramientaObj.fechaFinMantenimiento);
      $("#inputFechaFinMantHerr").val(valFecha2);
      
      $("#tdFecVenPruHidHerr"+herramientaId)
      .html("<input type='date' id='inputFechaFinPrueHidroHerr' class='form-control'>");
	 
      var valFecha3 = convertirFechaInput(herramientaObj.fechaFinPruebaHidrostatica);
      $("#inputFechaFinPrueHidroHerr").val(valFecha3);
      
      $("#tdNumInspeccHerr"+herramientaId).html("<label>*Automático</label>");
      
      $("#btnVolverHerramientaInspecc").hide();
      $("#btnNuevaHerramienta").hide();
      $("#btnCancelarHerramienta").show();
      $("#btnGuardarHerramienta").show();
      $("#btnEliminarHerramienta").show();
      $("#btnImportHerramienta").hide();
   }
}

function nuevaHerramientaInspecc(){
   if(!banderaEdicionHerramienta){
      banderaEdicionHerramienta = true;
      herramientaId = 0;
      
      formatoCeldaSombreableTabla(false,"tblConHerrInspecc");
     
      $("#tblConHerrInspecc tbody").prepend(
         "<tr id='trHerrInspecc0'>" +
	    "<td><input type='text' id='inputCodigoHerr' class='form-control'></td>" +
	    "<td><input type='text' id='inputUbicacionHerr' class='form-control'></td>" +
	    "<td><input type='text' id='inputNumSerieHerr' class='form-control'></td>" +
	    "<td><input type='text' id='inputTipoAgenteHerr' class='form-control'></td>" +
	    "<td><input type='text' id='inputCapacidadHerr' class='form-control'></td>" +
	    "<td><input type='text' id='inputMarcaHerr' class='form-control'></td>" +
	    "<td><input type='text' id='inputRatingHerr' class='form-control'></td>" +
	    "<td><input type='text' id='inputSedeHerr' class='form-control'></td>" +
	    "<td id='tdEviCertiOperatividadHerr0'></td>" +
            "<td><input type='date' id='inputFechaFinRecargaHerr' class='form-control'></td>" +
            "<td><input type='date' id='inputFechaFinMantHerr' class='form-control'></td>" +
            "<td><input type='date' id='inputFechaFinPrueHidroHerr' class='form-control'></td>" +
            "<td><label>*Automático</label></td>" +
	 "</tr>");
      
      var optionEvidencia={
         isImage: false,
         container: "#tdEviCertiOperatividadHerr"+herramientaId,
         idAux: "CertiOperativ",
         esNuevo: true,
         evidenciaNombre: "",
         functionCall: function(){},
         descargaUrl: "",
         mensajeAux: "(Opcional)"
      };
		
      crearFormEvidenciaCompleta(optionEvidencia);
      
      $("#btnVolverHerramientaInspecc").hide();
      $("#btnNuevaHerramienta").hide();
      $("#btnCancelarHerramienta").show();
      $("#btnGuardarHerramienta").show();
      $("#btnEliminarHerramienta").hide();
      $("#btnImportHerramienta").hide();
   }else{
      alert("Guarde primero.");
   }
}

function eliminarHerramientaInspecc(){
   $("#modalConsolidadoHerramientaInspecc").modal("hide");
   
   if(herramientaObj.numInspecciones == 0){ 
      mensajeUx="<label>¿Está seguro de eliminar la herramienta seleccionada?</label>";
      mensajesUx(mensajeUx,3,"","EliminarHerrInspecc");

      $("#btnDevolverValorEliminarHerrInspecc").on("click",function(){
         var dataParam={
 	    id: herramientaId
         };

         callAjaxPost(URL+'/auditoria/extintor/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
 	       case "05":
 	          mensajeUx="<label>La herramienta seleccionada fue eliminada con éxito.</label>";
 	          mensajesUx(mensajeUx,1,"","EliminarHerrInspeccAviso");
 		
 	          $("#modalMensajeUxEliminarHerrInspeccAviso").on("hidden.bs.modal",function(){
  		     $("#modalMensajeUxEliminarHerrInspeccAviso").remove();
  		     $("#modalConsolidadoHerramientaInspecc").modal("show");
  		     cargarConsolidadoHerramientaExtintor();     
 	          });
 		
 	          break;
 		
 	       default:
 	          alert("Ocurrió un error al eliminar la herramienta!");
            }
         });
      });
   
      $("#btnRegresarPrevioEliminarHerrInspecc").on("click",function(){
         $("#modalConsolidadoHerramientaInspecc").modal("show");
      });  
   }else{
      mensajeUx="<label>No se puede eliminar la herramienta seleccionada " +
      		"porque tiene inspecciones asociadas.<label>"
      mensajesUx(mensajeUx,2,"","EliminarHerrInspeccAviso");
	 		       		
      $("#modalMensajeUxEliminarHerrInspeccAviso").on("hidden.bs.modal",function(){
	 $("#modalConsolidadoHerramientaInspecc").modal("show"); 
      });
   }
}

function validacionCodigoHerramienta(){
   var campoVacio = true;
   
   var existeHerramienta;
   var modificarCodigo = 0;
   var codigo = $("#inputCodigoHerr").val();
    
   if(codigo.length == 0){
      campoVacio = false;
   }
    
   if(campoVacio){
      if(herramientaId > 0){
	 if(herramientaObj.codigo != codigo){
	    modificarCodigo = 1;
	 }
      }
      
      if(herramientaId == 0 || modificarCodigo == 1){
         var dataParamAux={
            codigo: codigo,   
            empresaId: getSession("gestopcompanyid")
         };
	       
         callAjaxPostNoLoad(URL+'/auditoria/extintor/validacion_codigo',dataParamAux,function(data){
	    existeHerramienta = data.existeHerramienta;
		 
	    if(existeHerramienta == 0){
	       guardarHerramientaInspecc(); 
	    }else{
	       $.unblockUI();
	       $("#modalConsolidadoHerramientaInspecc").modal("hide");
	       mensajeUx="<label>Ya existe un registro de extintor utilizando " +
	       		 "ese código ("+codigo+").<label>";
	       mensajesUx(mensajeUx,2,"","AvisoCompletarHerrInspecc");
	        		       	
	       $("#modalMensajeUxAvisoCompletarHerrInspecc").on("hidden.bs.modal",function(){
	          $("#modalConsolidadoHerramientaInspecc").modal("show");    
	       });
	    }
         });
      }else{
	 guardarHerramientaInspecc();  
      }
   }else{
      $("#modalConsolidadoHerramientaInspecc").modal("hide");
      mensajeUx="<label>Debe ingresar el código del extintor.<label>"
      mensajesUx(mensajeUx,2,"","AvisoCompletarHerrInspecc");
  		       	
      $("#modalMensajeUxAvisoCompletarHerrInspecc").on("hidden.bs.modal",function(){
          $("#modalConsolidadoHerramientaInspecc").modal("show");    
      });
   }
}

function guardarHerramientaInspecc(){
   var campoVacio = true;
   
   var codigo = $("#inputCodigoHerr").val();
   var ubicacion = $("#inputUbicacionHerr").val();
   var numeroSerie = $("#inputNumSerieHerr").val();
   var tipoAgente = $("#inputTipoAgenteHerr").val();
   var capacidad = $("#inputCapacidadHerr").val();
   var marca = $("#inputMarcaHerr").val();
   var rating = $("#inputRatingHerr").val();
   var sede = $("#inputSedeHerr").val();
   
   var fechaFinRecarga = convertirFechaTexto($("#inputFechaFinRecargaHerr").val());
   var inputFechaFinRecarga;

   if(!fechaFinRecarga){
      inputFechaFinRecarga = null;
   }else{
      inputFechaFinRecarga = fechaFinRecarga;
   }
   
   var fechaFinMant = convertirFechaTexto($("#inputFechaFinMantHerr").val());
   var inputFechaFinMant;

   if(!fechaFinMant){
      inputFechaFinMant = null;
   }else{
      inputFechaFinMant = fechaFinMant;
   }
   
   var fechaFinPrueHidro = convertirFechaTexto($("#inputFechaFinPrueHidroHerr").val());
   var inputFechaFinPrueHidro;

   if(!fechaFinPrueHidro){
      inputFechaFinPrueHidro = null;
   }else{
      inputFechaFinPrueHidro = fechaFinPrueHidro;
   }
       
   if(codigo.length == 0 || numeroSerie.length == 0 || tipoAgente.length == 0 || capacidad.length == 0 || 
      marca.length == 0 || inputFechaFinRecarga == null || inputFechaFinMant == null || 
      inputFechaFinPrueHidro == null || ubicacion.length == 0 || sede.length == 0){
      campoVacio = false;
   }
       
   if(campoVacio){
      var dataParam={
 	 id: herramientaId,
 	 codigo: codigo,
 	 ubicacion: ubicacion,
 	 numeroSerie: numeroSerie,
 	 tipoAgente: tipoAgente,
 	 capacidad: capacidad,
 	 marca: marca,
 	 rating: rating,
 	 sede: sede,
 	 fechaFinRecarga: inputFechaFinRecarga,
 	 fechaFinMantenimiento: inputFechaFinMant,
 	 fechaFinPruebaHidrostatica: inputFechaFinPrueHidro,
 	 empresaId: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/auditoria/extintor/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":
               guardarEvidenciaAuto(data.nuevoId,"fileEviCertiOperativ",bitsMega*15,
 	       "/auditoria/extintor/evidencia_certificado_operatividad/save",function(){
                  $("#modalConsolidadoHerramientaInspecc").modal("hide");
    		
     	      	  mensajeUx="<label>La herramienta fue registrada con éxito<label>";
     	      	  mensajesUx(mensajeUx,1,"","ActualizarHerrInspecc");
     		
     	      	  $("#modalMensajeUxActualizarHerrInspecc").on("hidden.bs.modal",function(){
     		     $("#modalMensajeUxActualizarHerrInspecc").remove();
     		     $("#modalConsolidadoHerramientaInspecc").modal("show");
     		     cargarConsolidadoHerramientaExtintor();
     	      	  });
               });
 		
 	       break;
 	 		   
 	    default:
 	       alert("Ocurrió un error al guardar!");
         }
      }); 
   }else{
      $("#modalConsolidadoHerramientaInspecc").modal("hide");
      mensajeUx="<label>Debe completar todos los campos.<label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarHerrInspecc");
 		       	
      $("#modalMensajeUxAvisoCompletarHerrInspecc").on("hidden.bs.modal",function(){
         $("#modalConsolidadoHerramientaInspecc").modal("show");    
      });
   } 
}

function descargarExcelExtintoresEvaluadosInspeccion(){
   if(numAreas == 0){
      alert("No hay áreas asignadas a la inspección");
   }else{
      window.open(URL+"/auditoria/inspeccion_extintor/excel?id="+auditoriaId +
	          "&empresaId="+getSession("gestopcompanyid"));	
   }    
}

function ocultarSmartImportHerramientaInspecc(){
   $("#modalImportHerramienta").modal("hide");
   $("#modalConsolidadoHerramientaInspecc").modal("show"); 
}

function verSmartImportHerramientaInspecc(){
   $("#modalImportHerramienta").remove();
   $("#modalConsolidadoHerramientaInspecc").modal("hide"); 
   
   var text = "";
    
   var textBackUp = 
      "<a class='efectoLink' href='"+URL+"/auditoria/extintor/backup?empresaId="+getSession("gestopcompanyid")+"' " +
	 "target='_blank'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>";
	   
   var listItemsForm=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-download'></i> Plantilla import ",
       inputForm:textBackUp,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-info'></i> Archivo Excel: ",
       inputForm:"",divContainer:"divExcelImportHerramienta"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
		     "onclick='ocultarSmartImportHerramientaInspecc()'>" +
    	        "<i class='fa fa-times'></i> Cancelar" +
    	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;'>" +
	            "<i class='fa fa-floppy-o'></i> Guardar" +
	       	 "</button>"}
   ];
			       	
   listItemsForm.forEach(function(val,index){
      text += obtenerSubPanelModuloVersionDos(val);
   });
			       		       	
   var modalOptions={
      id: "modalImportHerramienta",
      nombre: "Import Extintores",
      contenido: "<form id='formImportHerramienta' class='eventoGeneral'>"+text+"</form>"
   };
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   var options={
      container: "#divExcelImportHerramienta",
      functionCall: function(){},
      descargaUrl: "",
      esNuevo: true,
      idAux: "ImportExcelExtintor",
      evidenciaNombre: ""
   };
					
   crearFormEvidenciaCompleta(options);
			
   $("#modalImportHerramienta").modal("show");
   
   $("#formImportHerramienta").on("submit",function(e){
      e.preventDefault();
      confirmacionSmartImportHerramientaInspecc();
   });    
}

function cancelarMensajeConfirmacionSmartImportExtintor(){
   $("#modalConfirmacionImportExtintor").modal("hide");
   $("#modalImportHerramienta").modal("show");
}

function confirmacionSmartImportHerramientaInspecc(){
   $("#modalImportHerramienta").modal("hide");
   $("#modalConfirmacionImportExtintor").remove();
    
   var campoVacio = true;
    
   var nombreExcel = $("#inputEviImportExcelExtintor").val();
     
   if(nombreExcel.length == 0){
      campoVacio = false;
   }
    
   if(campoVacio){
      var contenidoAux = "";
  	   
      var listContenidoAux=[
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
          label:"<i class='fa fa-check-square-o'></i> Opción import",
          inputForm:"<span style='color:blue;font-weight:bolder;'>Registrar</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
  	                "onclick='cancelarMensajeConfirmacionSmartImportExtintor()'>" +
  	           "<i class='fa fa-times'></i> Cancelar" +
  	        "</button>",
  	  inputForm:"<button type='submit' class='btn btn-success' " +
  	                    "style='font-size:18px;float:right;'>" +
  	               "<i class='fa fa-check'></i> Aceptar" +
  	            "</button>"}
      ];
  	  
      listContenidoAux.forEach(function(val){
         contenidoAux += obtenerSubPanelModuloVersionDos(val);
      });
      
      var modalOptionsAux={
      	 id: "modalConfirmacionImportExtintor",
      	 nombre: "<i class='fa fa-bell'></i> Estimado usuario, por favor, confirmar la siguiente información:",
      	 contenido: "<form id='formConfirmacionImportExtintor' class='eventoGeneral'>"+contenidoAux+"</form>"
      };
            		
      crearModalPrincipalUsuario(modalOptionsAux,function(){},true,true);
        
      $("#formConfirmacionImportExtintor").on("submit",function(e){
         e.preventDefault();
         enviarExcelImportExtintor();
      }); 
   }else{
      mensajeUx = "<label>Debe subir el excel para poder continuar.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarImportExtintor");

      $("#modalMensajeUxAvisoCompletarImportExtintor").on("hidden.bs.modal",function(){
 	 $("#modalImportHerramienta").modal("show");   
      });   
   }
}

function enviarExcelImportExtintor(){
   guardarEvidenciaAuto(0,"fileEviImportExcelExtintor",bitsMega*18,
   "/auditoria/extintor/excel/masivo/save",function(data){
      $("#modalConfirmacionImportExtintor").modal("hide");
 	    
      mensajeUx= "<label style='text-align:left;'>"+data.mensaje+"</label>";
      mensajesUx(mensajeUx,4,"","ActualizarVistaModExtintor");
 	    
      $("#modalMensajeUxActualizarVistaModExtintor").on("hidden.bs.modal",function(){
         $("#modalConsolidadoHerramientaInspecc").modal("show");
         cargarConsolidadoHerramientaExtintor();     
      });
   },"id",[  
      {id: "empresaId",value: getSession("gestopcompanyid")}]);
}

var banderaEdicionExtintAsocInspecc;
var listExtintores=[],listEvalInspeccExtintores=[];
var extintAsocInspeccId;
var extintAsocInspeccObj={};

function regresarInspeccDesdeExtintoresAsocInspecc(){
   $("#modalConsolidadoExtintoresAsociadosInspecc").modal("hide");
}

function consolidadoExtintoresAsociadosInspeccion(){
   $("#modalConsolidadoExtintoresAsociadosInspecc").remove();
	    
   var listModal={
      id: "modalConsolidadoExtintoresAsociadosInspecc",
      maxWidth: "1500px",
      nombre: "<i class='fa fa-table'></i> Extintores asociados a la inspección",
      contenido:
         "<button class='btn btn-info' id='btnVolverExtinAsocInspecc' title='Regresar a la vista anterior.' " +
		 "onclick='regresarInspeccDesdeExtintoresAsocInspecc()' style='margin-left: 5px'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"+" " +
            "<i class='fa fa-table fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-success' id='btnNuevaExtinAsocInspecc' style='margin-left: 5px' " +
		 "title='Nuevo registro de extintor asociado' onclick='nuevaConsolidadoExtintoresAsociadosInspeccion()'>" +
	    "<i class='fa fa-file-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnCancelarExtinAsocInspecc' style='margin-left: 5px' " +
	         "title='Cancelar acción' onclick='cancelarConsolidadoExtintoresAsociadosInspeccion()'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnGuardarExtinAsocInspecc' style='margin-left: 5px' " +
	         "title='Guardar el registro de extintor asociado.' onclick='guardarConsolidadoExtintoresAsociadosInspeccion()'>" +
	    "<i class='fa fa-floppy-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-danger' id='btnEliminarExtinAsocInspecc' style='margin-left: 5px' " +
	         "title='Eliminar el registro de extintor asociado.' onclick='eliminarConsolidadoExtintoresAsociadosInspeccion()'>" +
	    "<i class='fa fa-times fa-2x'></i>" +
	 "</button>" +
	 "<div class='wrapper' id='wrapConExtinAsocInspecc'>" +
	    "<table id='tblConExtinAsocInspecc' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<td class='tb-acc' style='width:250px'>Extintor</td>" +
		     "<td class='tb-acc' style='width:300px'>Ubicación</td>" +
		     "<td class='tb-acc' style='width:200px'>Fecha vencimiento de la recarga</td>" +
		     "<td class='tb-acc' style='width:200px'>Fecha vencimiento de mantenimiento</td>" +
		     "<td class='tb-acc' style='width:200px'>Fecha vencimiento de prueba hidrostática</td>" +
		     "<td class='tb-acc' style='width:200px'>Estado de la evaluación</td>" +
		     "<td class='tb-acc' style='width:200px'>Estado de la(s) medida(s) correctiva(s)</td>" +
		     "<td class='tb-acc' style='width:200px'>Registrado el</td>" +
		     "<td class='tb-acc' style='width:200px'>Modificado el</td>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
         "</div>"
   };
	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapConExtinAsocInspecc",200);
	   
   cargarConsolidadoExtintoresAsociadosInspeccion();
}

function cargarConsolidadoExtintoresAsociadosInspeccion(){
   $("#btnVolverExtinAsocInspecc").show();
   $("#btnNuevaExtinAsocInspecc").show();
   $("#btnCancelarExtinAsocInspecc").hide();
   $("#btnGuardarExtinAsocInspecc").hide();
   $("#btnEliminarExtinAsocInspecc").hide();
    
   banderaEdicionExtintAsocInspecc = false;
    
   var dataParam={
      auditoriaId: auditoriaObj.auditoriaId,
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
 	   
   callAjaxPost(URL+'/auditoria/inspeccion_extintor',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listEvalInspeccExtintores = data.listEvalInspeccExtintores;
            listExtintores = data.listExtintores;
 		  
 	    $("#tblConExtinAsocInspecc tbody tr").remove();
 		    
 	    listEvalInspeccExtintores.forEach(function(val,index){
 	       var numPreguntasMarcadas=0,isVigenteFecRec="",isVigenciaFecMan="",
 		   isVigenciaFecHid="",estadoMedCor="",actualizadoPor="";
 		
 	       numPreguntasMarcadas = val.numRespuestasMarcadasSi + val.numRespuestasMarcadasNo;
 	       isVigenteFecRec = (val.extintor.isVigenteFechaRecarga >= 0?"blue;":"red;");
 	       isVigenciaFecMan = (val.extintor.isVigenteFechaMantenimiento >= 0?"blue;":"red;");
 	       isVigenciaFecHid = (val.extintor.isVigenteFechaHidrostatica >= 0?"blue;":"red;");
 	       
 	       estadoMedCor = (val.numRespuestasMarcadasSi > 0?val.numAccCorCompletadas+" / "+val.numRespuestasMarcadasSi:"0 / 0");
 	       
 	       actualizadoPor = (val.actualizadoPor.length == 0?val.fechaActualizacionTexto:
 		                 val.fechaActualizacionTexto+" (por "+val.actualizadoPor+")");
 		
 	       $("#tblConExtinAsocInspecc tbody").append(
 	          "<tr id='trExtinAsocInspecc"+val.id+"' onclick='editarConsolidadoExtintoresAsociadosInspeccion("+index+")'>" +
 	             "<td id='tdCodigoExtAsoInsp"+val.id+"'>"+val.extintor.codigo+"</td>" +
 	             "<td id='tdUbicacionExtAsoInsp"+val.id+"'>"+val.extintor.ubicacion+"</td>" +
 	             "<td id='tdFecFinRecargaExtAsoInsp"+val.id+"'>"+
 	                "<label style='color:"+isVigenteFecRec+"'>"+val.extintor.fechaFinRecargaTexto+"</label>"+"</td>" +
 	             "<td id='tdFecFinMantExtAsoInsp"+val.id+"'>"+
 	                "<label style='color:"+isVigenciaFecMan+"'>"+val.extintor.fechaFinMantenimientoTexto+"</label>"+"</td>" +
 	             "<td id='tdFecFinPruHidExtAsoInsp"+val.id+"'>"+
 	                "<label style='color:"+isVigenciaFecHid+"'>"+val.extintor.fechaFinPruebaHidrostaticaTexto+"</label>"+"</td>" +
 	             "<td id='tdEstEvalExtAsoInsp"+val.id+"'>"+numPreguntasMarcadas+" / "+val.numPreguntasTotal+"</td>" +
 	             "<td id='tdMedCorEvalExtAsoInsp"+val.id+"'>"+estadoMedCor+"</td>" +
 	             "<td id='tdFecCretExtAsoInsp"+val.id+"'>"+val.fechaCreacionTexto+" (por "+val.registradoPor+")"+"</td>" +
 	             "<td id='tdFecActExtAsoInsp"+val.id+"'>"+actualizadoPor+"</td>" +
 		  "</tr>");
 	    }); 
 		     
 	    formatoCeldaSombreableTabla(true,"tblConExtinAsocInspecc");
 	    break;
 		     
         default:
            alert("nop");
            break;
      }
 	      
      goheadfixedY("#tblConExtinAsocInspecc","#wrapConExtinAsocInspecc");
   });   
}

function cancelarConsolidadoExtintoresAsociadosInspeccion(){
   cargarConsolidadoExtintoresAsociadosInspeccion();
}

var listExtintoresAux=[];

function editarConsolidadoExtintoresAsociadosInspeccion(pindex){
   if(!banderaEdicionExtintAsocInspecc){
      banderaEdicionExtintAsocInspecc = true;
      formatoCeldaSombreableTabla(false,"tblConExtinAsocInspecc");
        
      extintAsocInspeccId = listEvalInspeccExtintores[pindex].id;
      extintAsocInspeccObj = listEvalInspeccExtintores[pindex];
  	
      $("#trExtinAsocInspecc"+extintAsocInspeccId).addClass("fila-edicion");
         
      listExtintoresAux=[];
       
      listExtintores.forEach(function(val1){
         var extintorRegistrado = 0;
           
         listEvalInspeccExtintores.forEach(function(val2){
            if(val1.id == val2.extintor.id){
               extintorRegistrado++;
            }
         });
           
         if(extintorRegistrado == 0 || val1.id == extintAsocInspeccObj.extintor.id){
     	    listExtintoresAux.push(val1); 
         }
      }); 
       
      var selExtintorInspeccionar = crearSelectOneMenu("selExtintorInspeccionar",
         "informacionExtintorSeleccionado()",listExtintoresAux,extintAsocInspeccObj.extintor.id,"id","codigo");
       
      $("#tdCodigoExtAsoInsp"+extintAsocInspeccId)
         .html("<input class='form-control' id='inputBuscarExtintorInspecc'>"+
	        selExtintorInspeccionar);
      
      $("#inputBuscarExtintorInspecc").val(extintAsocInspeccObj.extintor.codigo);
      $("#inputBuscarExtintorInspecc").attr("onkeyup","buscarDisponibleExtintorInspecc()");
       
      $("#tdUbicacionExtAsoInsp"+extintAsocInspeccId)
         .html("<span id='ubicacionInfo' style='font-weight:bolder;'></span>");
       
      $("#tdFecFinRecargaExtAsoInsp"+extintAsocInspeccId)
         .html("<span id='fechaVencRecargaInfo' style='font-weight:bolder;'></span>");
       
      $("#tdFecFinMantExtAsoInsp"+extintAsocInspeccId)
         .html("<span id='fechaVencMantInfo' style='font-weight:bolder;'></span>");
       
      $("#tdFecFinPruHidExtAsoInsp"+extintAsocInspeccId)
         .html("<span id='fechaVencHidroInfo' style='font-weight:bolder;'></span>");
      
      informacionExtintorSeleccionado();
       
      var numPreguntasMarcadas = 
	 extintAsocInspeccObj.numRespuestasMarcadasSi + extintAsocInspeccObj.numRespuestasMarcadasNo;
       
      $("#tdEstEvalExtAsoInsp"+extintAsocInspeccId)
         .html("<a class='efectoLink' title='Enlace Evaluación extintor asociado a la inspección' " +
              	  "onclick='evaluarExtintorAsociadoInspeccion()'>" +
                  "<i class='fa fa-list-ul'></i> "+numPreguntasMarcadas+" / "+extintAsocInspeccObj.numPreguntasTotal + 
               "</a>" );
      
      $("#tdFecActExtAsoInsp"+extintAsocInspeccId).html("<label>*Automático</label>");
 	  
      $("#btnVolverExtinAsocInspecc").hide();
      $("#btnNuevaExtinAsocInspecc").hide();
      $("#btnCancelarExtinAsocInspecc").show();
      $("#btnGuardarExtinAsocInspecc").show();
      $("#btnEliminarExtinAsocInspecc").show();
   }
}
 
function nuevaConsolidadoExtintoresAsociadosInspeccion(){
   listExtintoresAux=[];
   extintAsocInspeccId = 0;
    
   listExtintores.forEach(function(val1){
      var extintorRegistrado = 0;
       
      listEvalInspeccExtintores.forEach(function(val2){
         if(val1.id == val2.extintor.id){
            extintorRegistrado++;
         }
      });
       
      if(extintorRegistrado == 0){
 	 listExtintoresAux.push(val1); 
      }
   }); 
    
   if(!banderaEdicionExtintAsocInspecc && listExtintoresAux != 0){
      banderaEdicionExtintAsocInspecc = true;
      extintAsocInspeccId = 0;
       
      formatoCeldaSombreableTabla(false,"tblConExtinAsocInspecc");
      
      var selExtintorInspeccionar = crearSelectOneMenu("selExtintorInspeccionar",
	 "informacionExtintorSeleccionado()",listExtintoresAux,"-1","id","codigo");
      
      $("#tblConExtinAsocInspecc tbody").prepend(
         "<tr id='trExtinAsocInspecc0'>" +
 	    "<td>"+"<input class='form-control' id='inputBuscarExtintorInspecc'>" +
 	            selExtintorInspeccionar+"</td>" +
 	    "<td><span id='ubicacionInfo' style='font-weight:bolder;'></span></td>" +
 	    "<td><span id='fechaVencRecargaInfo' style='font-weight:bolder;'></span></td>" +
 	    "<td><span id='fechaVencMantInfo' style='font-weight:bolder;'></span></td>" +
 	    "<td><span id='fechaVencHidroInfo' style='font-weight:bolder;'></span></td>" +
 	    "<td><label>*Automático</label></td>" +
            "<td><label>*Automático</label></td>" +
            "<td><label>*Automático</label></td>" +
            "<td><label>------</label></td>" +
 	 "</tr>");
      
      $("#inputBuscarExtintorInspecc").attr("onkeyup","buscarDisponibleExtintorInspecc()");
      
      informacionExtintorSeleccionado();
       
      $("#btnVolverExtinAsocInspecc").hide();
      $("#btnNuevaExtinAsocInspecc").hide();
      $("#btnCancelarExtinAsocInspecc").show();
      $("#btnGuardarExtinAsocInspecc").show();
      $("#btnEliminarExtinAsocInspecc").hide();
   }else{
      if(banderaEdicionExtintAsocInspecc){
         alert("Guarde primero.");
      }else{
	 $("#modalConsolidadoExtintoresAsociadosInspecc").modal("hide");
	  
	 mensajeUx="<label>Todos los extintores han sido seleccionados para " +
		   "esta inspección.</label>";
	 mensajesUx(mensajeUx,2,"","AvisoLimiteExtAsoInspecc");

	 $("#modalMensajeUxAvisoLimiteExtAsoInspecc").on("hidden.bs.modal",function(){
            $("#modalConsolidadoExtintoresAsociadosInspecc").modal("show");
	 });
      }
   }
}

function buscarDisponibleExtintorInspecc(){
   var extintorCodigoAux = $("#inputBuscarExtintorInspecc").val().toUpperCase().trim();
   var encontrado = 0;
  
   if(extintorCodigoAux.length != 0){
      listExtintoresAux.forEach(function(val){
         if(val.codigo.toUpperCase().trim().includes(extintorCodigoAux) && encontrado == 0){
 	    $("#selExtintorInspeccionar").val(val.id);
 	    encontrado++;
         }     
      }); 
   }
    
   if(encontrado == 0){
      $("#selExtintorInspeccionar").val(-1); 
   }
    
   informacionExtintorSeleccionado();
}

function informacionExtintorSeleccionado(){
   var extintorId = parseInt($("#selExtintorInspeccionar").val());
    
   if(extintorId != -1){
      listExtintoresAux.forEach(function(val){
 	 if(val.id == extintorId){
 	    document.querySelector('#ubicacionInfo').innerText = val.ubicacion;   
	    document.getElementById('ubicacionInfo')
	       .style.color = "black";
 	     
            document.querySelector('#fechaVencRecargaInfo').innerText = val.fechaFinRecargaTexto;   
 	    document.getElementById('fechaVencRecargaInfo')
 	       .style.color = (val.isVigenteFechaRecarga >= 0?"blue":"red");
 	 
 	    document.querySelector('#fechaVencMantInfo').innerText = val.fechaFinMantenimientoTexto;
 	    document.getElementById('fechaVencMantInfo')
 	       .style.color = (val.isVigenteFechaMantenimiento >= 0?"blue":"red");
 		
 	    document.querySelector('#fechaVencHidroInfo').innerText = val.fechaFinPruebaHidrostaticaTexto;  
 	    document.getElementById('fechaVencHidroInfo')
               .style.color = (val.isVigenteFechaHidrostatica >= 0?"blue":"red");
 	 }
      });
   }else{
      document.querySelector('#ubicacionInfo').innerText = "------";
      document.getElementById('ubicacionInfo').style.color = "black";
      document.querySelector('#fechaVencRecargaInfo').innerText = "------";
      document.getElementById('fechaVencRecargaInfo').style.color = "black";
      document.querySelector('#fechaVencMantInfo').innerText = "------";
      document.getElementById('fechaVencMantInfo').style.color = "black";
      document.querySelector('#fechaVencHidroInfo').innerText = "------";
      document.getElementById('fechaVencHidroInfo').style.color = "black";
   } 
}

function guardarConsolidadoExtintoresAsociadosInspeccion(){
   var campoVacio = true; 
     
   var extintorId = parseInt($("#selExtintorInspeccionar").val());
     
   if(extintorId == -1){
      campoVacio = false;
      mensajeUx = "<label>Debe seleccionar el extintor a inspeccionar.</label>";
   }
     
   if(campoVacio){
      var dataParam={
 	 id: extintAsocInspeccId,
  	 auditoria: {auditoriaId: auditoriaObj.auditoriaId},
  	 extintor: {id: extintorId}
      }; 
         
      callAjaxPost(URL+'/auditoria/auditoria_extintor/save',dataParam,function(data){
	 $("#modalConsolidadoExtintoresAsociadosInspecc").modal("hide");
 	 
 	 if(extintAsocInspeccId == 0){ 
 	    mensajeUx="<label>El extintor se asoció a la inspección con éxito.<br><br>" +
 	 	      "Empezará el despliegue de las preguntas para la evaluación.</label>";
 	 }else{
 	    mensajeUx="<label>El registro del extintor se actualizó con éxito.</label>"; 
 	 }
 	 
 	 mensajesUx(mensajeUx,1,"","ActualizarExtAsoInspecc");
 	       
 	 $("#modalMensajeUxActualizarExtAsoInspecc").on("hidden.bs.modal",function(){ 
 	    if(extintAsocInspeccId == 0){ 
 	       extintAsocInspeccObj.id = data.nuevoId;
 	       evaluarExtintorAsociadoInspeccion();
 	    }else{
 	       $("#modalConsolidadoExtintoresAsociadosInspecc").modal("show");
 	       cargarConsolidadoExtintoresAsociadosInspeccion();
 	    }
 	 });
      });
   }else{
      $("#modalConsolidadoExtintoresAsociadosInspecc").modal("hide");
        
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposExtAsoInspecc");

      $("#modalMensajeUxAvisoCompletarCamposExtAsoInspecc").on("hidden.bs.modal",function(){
	 $("#modalConsolidadoExtintoresAsociadosInspecc").modal("show");
      });
   }   
}

function eliminarConsolidadoExtintoresAsociadosInspeccion(){
   $("#modalConsolidadoExtintoresAsociadosInspecc").modal("hide");
    
   mensajeUx="<label>¿Está seguro de eliminar este registro de extintor " +
     	     "(código: "+extintAsocInspeccObj.extintor.codigo+") seleccionado?" +
     	     "<br>(también se eliminará la evaluación relacionada al mismo).</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarExtintorAsoInspecc");

   $("#btnDevolverValorRespEliminarExtintorAsoInspecc").on("click",function(){
      var dataParam={
  	 id: extintAsocInspeccId
      };

      callAjaxPost(URL+'/auditoria/auditoria_extintor/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
  	    case "05":
  	       mensajeUx="<label>El registro del extintor se ha eliminado correctamente.</label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarExtAsoInspecc");
  		
  	       $("#modalMensajeUxActualizarExtAsoInspecc").on("hidden.bs.modal",function(){
  		  $("#modalConsolidadoExtintoresAsociadosInspecc").modal("show");
  	          cargarConsolidadoExtintoresAsociadosInspeccion();
  	       });
  	       break;
  		
  	    default:	
  	       alert("Ocurrió un error al eliminar el registro!");
         }
      });
   });
   
   $("#btnRegresarPrevioRespEliminarExtintorAsoInspecc").on("click",function(){
      $("#modalConsolidadoExtintoresAsociadosInspecc").modal("show");
   });  
}

function regresarExtintoresAsocInspeccDesdeEvaluacionExtintor(){
   $("#modalEvaluarExtintorAsociadoInspecc").modal("hide");
   $("#modalConsolidadoExtintoresAsociadosInspecc").modal("show");
   cargarConsolidadoExtintoresAsociadosInspeccion();
}

var listFullEvaluacionesExtintorInspecc=[];

function evaluarExtintorAsociadoInspeccion(){
   $("#modalConsolidadoExtintoresAsociadosInspecc").modal("hide");
   $("#modalEvaluarExtintorAsociadoInspecc").remove();
 	    
   var listModal={
      id: "modalEvaluarExtintorAsociadoInspecc",
      maxWidth: "1500px",
      nombre: "<i class='fa fa-list-ul'></i> Evaluación del extintor asociado a la inspección",
      contenido:
 	 "<button class='btn btn-success' id='btnCancelarEvalExtinAsocInspecc' style='margin-left: 5px' " +
 	         "title='Cancelar acción' onclick='regresarExtintoresAsocInspeccDesdeEvaluacionExtintor()'>" +
 	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
 	 "</button>" +
 	 "<button class='btn btn-success' id='btnGuardarEvalExtinAsocInspecc' style='margin-left: 5px' " +
 	         "title='Guardar el registro de extintor asociado.' onclick='validarEvaluacionExtintorAsociadoInspeccion()'>" +
 	    "<i class='fa fa-floppy-o fa-2x'></i>" +
 	 "</button>" +
 	 "<div class='wrapper' id='wrapEvaluarExtinAsocInspecc'>" +
 	    "<table id='tblEvaluarExtinAsocInspecc' class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 	          "<tr>" +
	             "<th class='tb-acc' colspan='4' style='width:1200px'>Evaluación</th>" +
	             "<th class='tb-acc' colspan='5' style='width:1750px'>Medida correctiva</th>" +
	             "<td class='tb-acc' rowspan='3' style='width:200px'>Actualizado por</td>" +
	          "</tr>" +
	          "<tr>" +
		     "<td class='tb-acc' rowspan='2'>Pregunta</td>" +
		     "<td class='tb-acc' rowspan='2'>Respuesta</td>" +
		     "<td class='tb-acc' rowspan='2'>Observación</td>" +
		     "<td class='tb-acc' rowspan='2'>Evidencia - Observación</td>" +
		     "<td class='tb-acc' rowspan='2'>Descripción</td>" +
		     "<td class='tb-acc' rowspan='2'>Fecha planificada</td>" +
		     "<td class='tb-acc' rowspan='2'>Responsable</td>" +
		     "<td class='tb-acc' rowspan='2'>Evidencia</td>" +
		     "<td class='tb-acc' rowspan='2'>Estado</td>" +
		  "</tr>" +
 	       "</thead>" +
 	       "<tbody></tbody>" +
 	    "</table>" +
         "</div>"
   };
 	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapEvaluarExtinAsocInspecc",200);
 	  
   var dataParamAux={
      id: extintAsocInspeccObj.id,
      tipoAuditoriaId: auditoriaObj.auditoriaTipo
   };
    
   callAjaxPost(URL+'/auditoria/verificaciones/version_dos/evaluacion',dataParamAux,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    listFullEvaluacionesExtintorInspecc = data.listEvaluacionesExtintores;
	
	    listFullEvaluacionesExtintorInspecc.forEach(function(val,index){
	       var listBooleanSiNo = listBoolean.sort(function(val1,val2){
	          return val2.id - val1.id;
	       });
	    
	       var radiosPregInsMovil = crearRadiosAutoVersionDos("radioPreguntaInsMovil"+val.verificacionId,
		  listBooleanSiNo,"","id","nombre","habilitarCamposEvalPreguntaInspeccExtintor",val.verificacionId);
	       
	       var actualizadoPor = (val.actualizadoPor.length == 0?val.fechaActualizacionTexto:
	                             val.fechaActualizacionTexto+" (por "+val.actualizadoPor+")");
	    
	       $("#tblEvaluarExtinAsocInspecc tbody").append(
	          "<tr id='trHerrInspecc"+val.verificacionId+"'>" +
	             "<td>"+(index+1)+". "+val.verificacion+"</td>" +
	             "<td>"+radiosPregInsMovil+"</td>" +
	             "<td>"+"<textarea rows='4' class='form-control' " +
	             	              "id='textObsAudiMovil"+val.verificacionId+"'></textarea>"+
	                    "<span id='auxInfoTextObsAudiMovil"+val.verificacionId+"' " +
	                    	  "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" +
	             "<td id='tdEviPreg"+val.verificacionId+"'></td>" +
	             "<td>"+"<textarea rows='4' class='form-control' " +
                                      "id='textDescAudiExtMedCorMovil"+val.verificacionId+"'></textarea>" +
                            "<span id='auxInfoTextDescAudiExtMedCorMovil"+val.verificacionId+"' " +
                                  "style='float:right;color:red;font-weight:bold;'></span>" +"</td>" +
                     "<td>"+"<input type='date' id='inputFechaPlanAudiExtMedCorMovil"+val.verificacionId+"' " +
                                   "class='form-control'>" +
                            "<span id='auxInfoTextFecPlanAudiExtMedCorMovil"+val.verificacionId+"' " +
 	                          "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" + 
                     "<td>"+"<input class='form-control' id='inputBuscarResponsableExtMedCorrMovil"+val.verificacionId+"'>" +
                            "<div id='divSelResponsableExtMedCorrMovil"+val.verificacionId+"'></div>" +
                            "<label>*Buscar Responsable por DNI y/o nombres/apellidos " +
                                   "(debe ingresar 3 caracteres como mínimo).</label>" +
                            "<span id='auxInfoTextRespAudiExtMedCorMovil"+val.verificacionId+"' " +
                                  "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" +
                     "<td id='tdEviMedCorExt"+val.verificacionId+"'></td>" +
                     "<td>"+"<span id='auxInfoEstadoAudiExtMedCorMovil"+val.verificacionId+"' " +
                                  "style='color:red;font-weight:bold;font-size:18px;'></span>"+"</td>" + 
	             "<td>"+actualizadoPor+"</td>" +
		  "</tr>");
	       
	       var options={
	 	  container: "#tdEviPreg"+val.verificacionId,
	 	  functionCall: function(){},
	 	  descargaUrl: (val.respuestaSimple == 0?"":
	 	     "/auditoria/verificaciones/respuesta/version_dos/evidencia?" +
	 	     "detalleAuditoriaExtintorId="+val.detalleAuditoriaExtintorId),
	 	  esNuevo: (val.respuestaSimple == 0 || val.evidenciaNombre == ""?true:false),
	 	  idAux: "PregInspecc"+val.verificacionId,
	 	  evidenciaNombre: (val.respuestaSimple == 0 || val.evidenciaNombre == ""?
	 		            "":val.evidenciaNombre),
	          mensajeAux: "<span id='auxInfoTextEviPreg"+val.verificacionId+"' " +
	 			    "style='float:right;color:blue;font-weight:bold;'></span>"
	       }; 
	       
	       crearFormEvidenciaCompleta(options);
	       
	       var optionsMedCor={
	      	  container: "#tdEviMedCorExt"+val.verificacionId,
	      	  functionCall: function(){
	      	     estadoAccionCorrectivaInspeccExt(val.verificacionId);
	      	  },
	      	  descargaUrl: (val.respuestaSimple == 0?"":
	      	     "/auditoria/verificaciones/respuesta/version_dos/auditoria_extintor/accion_correctiva/evidencia?" +
	      	     "detalleAuditoriaExtintorId="+val.detalleAuditoriaExtintorId),
	      	  esNuevo: (val.respuestaSimple == 0 || val.evidenciaAccCorNombre == ""?true:false),
	      	  idAux: "MedCorInspeccExt"+val.verificacionId,
	      	  evidenciaNombre: (val.respuestaSimple == 0 || val.evidenciaAccCorNombre == ""?
	      		            "":val.evidenciaAccCorNombre),
	          mensajeAux: "*Al subir la evidencia, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
	       }; 
	            
	       crearFormEvidenciaCompleta(optionsMedCor);
	 	        
	       document.getElementById(val.respuestaSimple+"radioPreguntaInsMovil"+val.verificacionId).checked = true;
	       $("#textObsAudiMovil"+val.verificacionId).val(val.comentario);
	 	 
	       habilitarCamposEvalPreguntaInspeccExtintor(val.respuestaSimple,val.verificacionId);
	       
	       if(val.respuestaSimple == 1){
	     	  $("#textDescAudiExtMedCorMovil"+val.verificacionId).val(val.accionCorrectiva); 
	     	  
	     	  var valFechaPlanificada = convertirFechaInput(val.fechaPlanificacion);
	     	  $("#inputFechaPlanAudiExtMedCorMovil"+val.verificacionId).val(valFechaPlanificada);
	     	          
	     	  $("#inputBuscarResponsableExtMedCorrMovil"+val.verificacionId).val(val.responsable);
	     	  buscarResponsableAccionCorrectivaInspeccExt(val.verificacionId);
	       }
	    });
	    
	    break;
	
         default:
            alert("nop");
            break;
      }
	      
      goheadfixedY("#tblEvaluarExtinAsocInspecc","#wrapEvaluarExtinAsocInspecc");
   });
}

function habilitarCamposEvalPreguntaInspeccExtintor(valResp,auxId){
   var valRespVisita = valResp;
   var auxIdVal = auxId;
     
   if(valRespVisita == 1){
      document.getElementById("textObsAudiMovil"+auxIdVal).disabled = false; 
      document.querySelector('#auxInfoTextObsAudiMovil'+auxIdVal).innerText = "(obligatorio)";
        
      document.getElementById("fileEviPregInspecc"+auxIdVal).disabled = false;
      document.querySelector('#auxInfoTextEviPreg'+auxIdVal).innerText = "(opcional)";
      
      document.getElementById("textDescAudiExtMedCorMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextDescAudiExtMedCorMovil'+auxId).innerText = "(obligatorio)";
      
      document.getElementById("inputFechaPlanAudiExtMedCorMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextFecPlanAudiExtMedCorMovil'+auxId).innerText = "(obligatorio)";
       
      document.getElementById("fileEviMedCorInspeccExt"+auxId).disabled = false;
      
      $("#inputBuscarResponsableExtMedCorrMovil"+auxId).val("");
      document.getElementById("inputBuscarResponsableExtMedCorrMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextRespAudiExtMedCorMovil'+auxId).innerText = "(obligatorio)";
      
      buscarResponsableAccionCorrectivaInspeccExt(auxId);
      estadoAccionCorrectivaInspeccExt(auxId);
   }else{
      document.getElementById("textObsAudiMovil"+auxIdVal).disabled = true;
      document.getElementById("textObsAudiMovil"+auxIdVal).value = null;
      document.querySelector('#auxInfoTextObsAudiMovil'+auxIdVal).innerText = "";
        
      document.getElementById("fileEviPregInspecc"+auxIdVal).disabled = true;
      document.getElementById("fileEviPregInspecc"+auxIdVal).value = null;
      document.getElementById("inputEviPregInspecc"+auxIdVal).value = null;
      document.querySelector('#auxInfoTextEviPreg'+auxIdVal).innerText = ""; 
      
      document.getElementById("textDescAudiExtMedCorMovil"+auxId).disabled = true;
      document.getElementById("textDescAudiExtMedCorMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextDescAudiExtMedCorMovil'+auxId).innerText = "";
      
      document.getElementById("inputFechaPlanAudiExtMedCorMovil"+auxId).disabled = true;
      document.getElementById("inputFechaPlanAudiExtMedCorMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextFecPlanAudiExtMedCorMovil'+auxId).innerText = "";
       
      document.getElementById("fileEviMedCorInspeccExt"+auxId).disabled = true;
      document.getElementById("fileEviMedCorInspeccExt"+auxId).value = null;
      document.getElementById("inputEviMedCorInspeccExt"+auxId).value = null;
      
      document.querySelector('#auxInfoEstadoAudiExtMedCorMovil'+auxId).innerText = "------";   
      document.getElementById('auxInfoEstadoAudiExtMedCorMovil'+auxId).style.color = "black";
      
      $("#inputBuscarResponsableExtMedCorrMovil"+auxId).val("");
      document.getElementById("inputBuscarResponsableExtMedCorrMovil"+auxId).disabled = true;
      document.querySelector('#divSelResponsableExtMedCorrMovil'+auxId).innerText = "";
      document.querySelector('#auxInfoTextRespAudiExtMedCorMovil'+auxId).innerText = "";
   }
}

function estadoAccionCorrectivaInspeccExt(auxId){
   var nombreAccCorEvidencia = $("#inputEviMedCorInspeccExt"+auxId).val();
      
   if(nombreAccCorEvidencia.length == 0){
      document.querySelector('#auxInfoEstadoAudiExtMedCorMovil'+auxId).innerText = "Pendiente";   
      document.getElementById('auxInfoEstadoAudiExtMedCorMovil'+auxId).style.color = "#D1D619";
   }else{
      document.querySelector('#auxInfoEstadoAudiExtMedCorMovil'+auxId).innerText = "Completado";   
      document.getElementById('auxInfoEstadoAudiExtMedCorMovil'+auxId).style.color = "blue";
   }
}

var listResponsablesAccCorInsExt=[];

function buscarResponsableAccionCorrectivaInspeccExt(auxId){
   var nombre = $("#inputBuscarResponsableExtMedCorrMovil"+auxId).val().trim();
 	
   if(nombre.length >= 3){
      var dataParam={
         trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid"))
      };
 		
      callAjaxPostNoLoad(URL+"/auditoria/responsable/accion_correctiva",dataParam,function(data){
	 listResponsablesAccCorInsExt = data.listResponsablesAccCorIns;
        
         if(listResponsablesAccCorInsExt.length == 0){
            listResponsablesAccCorInsExt.push({
               trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
 	    });
         }
 			
         var selResponsableAccCorInsExt = crearSelectOneMenuOblig("selResponsableAccCorInsExt"+auxId,
            "",listResponsablesAccCorInsExt,"","trabajadorId","nombre");
 	       
         $("#divSelResponsableExtMedCorrMovil"+auxId).html(selResponsableAccCorInsExt);
         $("#inputBuscarResponsableExtMedCorrMovil"+auxId)
            .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccExt("+auxId+")");
      });
   }else{
      listResponsablesAccCorInsExt = [];
       
      listResponsablesAccCorInsExt.push({
         trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
      });
        
      var selResponsableAccCorInsExt = crearSelectOneMenuOblig("selResponsableAccCorInsExt"+auxId,
	 "",listResponsablesAccCorInsExt,"","trabajadorId","nombre");
 		       
      $("#divSelResponsableExtMedCorrMovil"+auxId).html(selResponsableAccCorInsExt);
      $("#inputBuscarResponsableExtMedCorrMovil"+auxId)
         .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccExt("+auxId+")");
   }
}

var indiceActualEvaInd;

function validarEvaluacionExtintorAsociadoInspeccion(){
   var campoVacio = true; 
    
   var bitRespuesta,observacion,medidaCorrectiva,inputFechaPlanificada,nombrePregunta;
     
   listFullEvaluacionesExtintorInspecc.forEach(function(val,index){
      bitRespuesta = parseInt($("input[name='radioPreguntaInsMovil"+val.verificacionId+"']:checked").val());
       
      if(bitRespuesta == 1 && campoVacio){
 	 nombrePregunta = val.verificacion;
 	 observacion = $("#textObsAudiMovil"+val.verificacionId).val();
 	 medidaCorrectiva = $("#textDescAudiExtMedCorMovil"+val.verificacionId).val();
 	 
 	 var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiExtMedCorMovil"+val.verificacionId).val());
 	 inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
 	 
 	 var nombreEvidenciaMedCor = $("#inputEviMedCorInspeccExt"+val.verificacionId).val();
 	 
 	 var responsableId = parseInt($("#selResponsableAccCorInsExt"+val.verificacionId).val());
 	 
 	 if(observacion.length == 0){
 	    campoVacio = false;
 	    mensajeUx = "<label>Debe registrar la observación - "+nombrePregunta+".</label>";
 	    
 	    document.getElementById("textObsAudiMovil"+val.verificacionId).focus();
 	 }else if(medidaCorrectiva.length == 0){
 	    campoVacio = false;
 	    mensajeUx = "<label>Debe registrar la descripción de la medida correctiva - " +
 	    		 nombrePregunta+".</label>";  
 	    
 	    document.getElementById("textDescAudiExtMedCorMovil"+val.verificacionId).focus();
 	 }else if(inputFechaPlanificada == null && nombreEvidenciaMedCor.length == 0){
 	    campoVacio = false;
 	    mensajeUx = "<label>Debe registrar la fecha planificada o subir la evidencia de la " +
  	                "medida correctiva - "+nombrePregunta+".</label>"; 
 	    
 	    document.getElementById("inputFechaPlanAudiExtMedCorMovil"+val.verificacionId).focus();
 	 }else if(responsableId == -1){
 	    campoVacio = false;
            mensajeUx = "<label>Debe seleccionar al responsable de la medida correctiva - " +
 		         nombrePregunta+".</label>";  
             
            document.getElementById("inputBuscarResponsableExtMedCorrMovil"+val.verificacionId).focus();
 	 }
      }  
   });
   
   if(campoVacio){
      indiceActualEvaInd = 1;
      guardarEvaluacionExtintorAsociadoInspeccion(indiceActualEvaInd,guardarEvaluacionExtintorAsociadoInspeccion);
   }else{
      $("#modalEvaluarExtintorAsociadoInspecc").modal("hide");
   
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposEvalExtAsoInspecc");

      $("#modalMensajeUxAvisoCompletarCamposEvalExtAsoInspecc").on("hidden.bs.modal",function(){
	 $("#modalEvaluarExtintorAsociadoInspecc").modal("show");
      });
   }
}

function guardarEvaluacionExtintorAsociadoInspeccion(indiceActual,functionCallBack){
   var respuesta,respAux,observacion,validacionId,medidaCorrectiva,inputFechaPlanificada,
       responsableId;
   var dataParam;
    
   listFullEvaluacionesExtintorInspecc.forEach(function(val,index){
      if((index + 1) == indiceActualEvaInd){
	 respuesta = parseFloat($("input[name='radioPreguntaInsMovil"+val.verificacionId+"']:checked").val());
	 respAux = parseInt($("input[name='radioPreguntaInsMovil"+val.verificacionId+"']:checked").val());
	 observacion = $("#textObsAudiMovil"+val.verificacionId).val();
	 validacionId = val.verificacionId;
	 //var nombreEvi = $("#inputEviPregInspecc"+val.verificacionId).val();
	 if(respAux == 1){
	    medidaCorrectiva =  $("#textDescAudiExtMedCorMovil"+val.verificacionId).val();
	    responsableId = parseInt($("#selResponsableAccCorInsExt"+val.verificacionId).val());
	              
	    var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiExtMedCorMovil"+val.verificacionId).val());
	    inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
	 }else{
	    medidaCorrectiva = null;inputFechaPlanificada = null;responsableId = null;
	 }
	         
         dataParam={
            detalleAuditoriaExtintorId: val.detalleAuditoriaExtintorId,
            auditoriaExtintorId: extintAsocInspeccObj.id, 
            verificacionId: val.verificacionId,
            respuestaSimple: respuesta,
            comentario: observacion,
            accionCorrectiva: medidaCorrectiva,
            fechaPlanificacion: inputFechaPlanificada,
            responsableId: responsableId
         };
      }
   });  
   
   callAjaxPostNoUnlock(URL+'/auditoria/verificaciones/respuesta/version_dos/save',dataParam,function(data){
      guardarEvidenciaAuto(data.nuevoId,"fileEviPregInspecc"+validacionId,bitsEvidenciaVerificacion,
      "/auditoria/verificaciones/respuesta/version_dos/evidencia/save",function(){
	 guardarEvidenciaAuto(data.nuevoId,"fileEviMedCorInspeccExt"+validacionId,bitsEvidenciaVerificacion,
	 "/auditoria/verificaciones/respuesta/version_dos/auditoria_extintor/accion_correctiva/evidencia/save",function(){
            if(indiceActualEvaInd == listFullEvaluacionesExtintorInspecc.length){
               $.unblockUI();
               $("#modalEvaluarExtintorAsociadoInspecc").modal("hide");
            
               mensajeUx = "<label>Inspección guardada con éxito.</label>";
               mensajesUx(mensajeUx,1,"","EvaluacionCompletadaExtintorIns");
					
               $("#modalMensajeUxEvaluacionCompletadaExtintorIns").on("hidden.bs.modal",function(){
	          $("#modalConsolidadoExtintoresAsociadosInspecc").modal("show");
	          cargarConsolidadoExtintoresAsociadosInspeccion(); 
               });
            }else{
	       indiceActualEvaInd++;
	       functionCallBack(indiceActualEvaInd,guardarEvaluacionExtintorAsociadoInspeccion);
            }
	 },"detalleAuditoriaExtintorId");
      },"detalleAuditoriaExtintorId");
   });
}
