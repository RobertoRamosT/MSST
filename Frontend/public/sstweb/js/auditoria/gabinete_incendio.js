
var mensajeUx;

function regresarInspeccionDesdeGabineteIncendio(){
   $("#modalConsolidadoGabineteIncendioHerr").modal("hide");
}

function consolidadoGabineteIncendioHerr(){
   var listModal={
      id: "modalConsolidadoGabineteIncendioHerr",
      maxWidth: "1500px",
      nombre: "Gabinetes contra incendio",
      contenido:
         "<button class='btn btn-info' id='btnVolverGabinIncenHerr' title='Regresar a la vista anterior.' " +
	         "onclick='regresarInspeccionDesdeGabineteIncendio()' style='margin-left: 5px'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"+" " +
	    "<i class='fa fa-briefcase fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnNuevaGabinIncenHerr' style='margin-left: 5px' " +
	         "title='Nuevo registro de gabinete contra incendios' onclick='nuevaGabineteIncendioHerr()'>" +
            "<i class='fa fa-file-o fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-success' id='btnCancelarGabinIncenHerr' style='margin-left: 5px' " +
                 "title='Cancelar acción' onclick='cancelarGabineteIncendioHerr()'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-success' id='btnGuardarGabinIncenHerr' style='margin-left: 5px' " +
                 "title='Guardar el registro del gabinete contra incendios.' onclick='validacionCodigoGabineteIncendioHerr()'>" +
            "<i class='fa fa-floppy-o fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-danger' id='btnEliminarGabinIncenHerr' style='margin-left: 5px' " +
                 "title='Eliminar el registro del gabinete contra incendio.' onclick='eliminarGabineteIncendioHerr()'>" +
            "<i class='fa fa-times fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-info' id='btnImportGabinIncenHerr' style='margin-left: 5px' " +
                 "title='Importar una lista de gabinetes contra incendio desde un excel.' onclick='verSmartImportGabineteIncendioHerr()'>" +
            "<i class='fa fa-upload fa-2x'></i>" +
            "<i class='fa fa-info'></i>" +
         "</button>" +
	 "<div class='wrapper' id='wrapConGabinIncenHerr'>" +
	    "<table id='tblConGabinIncenHerr' class='table table-striped table-bordered table-hover table-fixed'>" +
               "<thead>" +
	          "<tr>" +
	             "<td class='tb-acc' style='width:250px'>Código</td>" +
	             "<td class='tb-acc' style='width:250px'>Ubicación</td>" +
	             "<td class='tb-acc' style='width:250px'>Certificado de operatividad</td>" +
	             "<td class='tb-acc' style='width:200px'>Fecha vencimiento de mantenimiento</td>" +
	             "<td class='tb-acc' style='width:200px'>N° de inspecciones asociadas</td>" +
	          "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
            "</table>" +
	 "</div>"
   };
   
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapConGabinIncenHerr",200);
   
   cargarConsolidadoGabineteIncendioHerr();
}

var listGabinetesIncendioHerr = [];
var banderaEdicionGabIncendioHerr;
var gabineteIncendioId;
var gabineteIncendioObj={};

function cargarConsolidadoGabineteIncendioHerr(){
   $("#btnVolverGabinIncenHerr").show();
   $("#btnNuevaGabinIncenHerr").show();
   $("#btnCancelarGabinIncenHerr").hide();
   $("#btnGuardarGabinIncenHerr").hide();
   $("#btnEliminarGabinIncenHerr").hide();
   $("#btnImportGabinIncenHerr").show();
   
   banderaEdicionGabIncendioHerr = false;
   
   var dataParamAux={
      empresaId: getSession("gestopcompanyid")
   };
	   
   callAjaxPost(URL+'/auditoria/gabinete_incendio',dataParamAux,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listGabinetesIncendioHerr = data.listGabinetesIncendio;
		      
	    $("#tblConGabinIncenHerr tbody tr").remove();
		 
	    listGabinetesIncendioHerr.forEach(function(val,index){
	       $("#tblConGabinIncenHerr tbody").append(
	          "<tr id='trGabIncHerr"+val.id+"' onclick='editarGabineteIncendioHerr("+index+")'>" +
	             "<td id='tdCodigoGabIncHerr"+val.id+"'>"+val.codigo+"</td>" +
	             "<td id='tdUbicacionGabIncHerr"+val.id+"'>"+val.ubicacion+"</td>" +
	             "<td id='tdEviCertiOperatividadGabIncHerr"+val.id+"'>"+val.evidenciaCertificadoOperatividadNombre+"</td>" +
	             "<td id='tdFecVenMantGabIncHerr"+val.id+"'>"+val.fechaFinMantenimientoTexto+"</td>" +
	             "<td id='tdNumInspeccGabIncHerr"+val.id+"'>"+val.numInspecciones+"</td>" +
		  "</tr>");
	    });
		     
	    formatoCeldaSombreableTabla(true,"tblConGabinIncenHerr");
	    break;
		     
         default:
            alert("nop");
            break;
      }
	      
      goheadfixedY("#tblConGabinIncenHerr","#wrapConGabinIncenHerr");
   });   
}

function cancelarGabineteIncendioHerr(){
   cargarConsolidadoGabineteIncendioHerr();
}

function editarGabineteIncendioHerr(pindex){
   if(!banderaEdicionGabIncendioHerr){
      banderaEdicionGabIncendioHerr = true;
      formatoCeldaSombreableTabla(false,"tblConGabinIncenHerr");
       
      gabineteIncendioId = listGabinetesIncendioHerr[pindex].id;
      gabineteIncendioObj = listGabinetesIncendioHerr[pindex];
 	
      $("#trGabIncHerr"+gabineteIncendioId).addClass("fila-edicion");
        
      $("#tdCodigoGabIncHerr"+gabineteIncendioId)
      .html("<input type='text' id='inputCodigoGabIncHerr' class='form-control'>");
      $("#inputCodigoGabIncHerr").val(gabineteIncendioObj.codigo);
      
      $("#tdUbicacionGabIncHerr"+gabineteIncendioId)
      .html("<input type='text' id='inputUbicacionGabIncHerr' class='form-control'>");
      $("#inputUbicacionGabIncHerr").val(gabineteIncendioObj.ubicacion);
      
      var optionEvidencia={
         isImage: false,
         container: "#tdEviCertiOperatividadGabIncHerr"+gabineteIncendioId,
         idAux: "CertiOperativGabInc",
         esNuevo: (gabineteIncendioObj.evidenciaCertificadoOperatividadNombre.length == 0?true:false),
         functionCall: function(){},
         evidenciaNombre: gabineteIncendioObj.evidenciaCertificadoOperatividadNombre,
         descargaUrl: "/auditoria/gabinete_incendio/evidencia_certificado_operatividad?id="+gabineteIncendioId+"",
         mensajeAux: "(Opcional)"
      };
	
      crearFormEvidenciaCompleta(optionEvidencia);
      
      $("#tdFecVenMantGabIncHerr"+gabineteIncendioId)
      .html("<input type='date' id='inputFechaFinMantGabIncHerr' class='form-control'>");
	 
      var valFecha2 = convertirFechaInput(gabineteIncendioObj.fechaFinMantenimiento);
      $("#inputFechaFinMantGabIncHerr").val(valFecha2);
      
      $("#tdNumInspeccGabIncHerrr"+gabineteIncendioId).html("<label>*Automático</label>");
      
      $("#btnVolverGabinIncenHerr").hide();
      $("#btnNuevaGabinIncenHerr").hide();
      $("#btnCancelarGabinIncenHerr").show();
      $("#btnGuardarGabinIncenHerr").show();
      $("#btnEliminarGabinIncenHerr").show();
      $("#btnImportGabinIncenHerr").hide();
   }
}

function nuevaGabineteIncendioHerr(){
   if(!banderaEdicionGabIncendioHerr){
      banderaEdicionGabIncendioHerr = true;
      gabineteIncendioId = 0;
      
      formatoCeldaSombreableTabla(false,"tblConGabinIncenHerr");
     
      $("#tblConGabinIncenHerr tbody").prepend(
         "<tr id='trGabIncHerr0'>" +
	    "<td><input type='text' id='inputCodigoGabIncHerr' class='form-control'></td>" +
	    "<td><input type='text' id='inputUbicacionGabIncHerr' class='form-control'></td>" +
	    "<td id='tdEviCertiOperatividadGabIncHerr0'></td>" +
            "<td><input type='date' id='inputFechaFinMantGabIncHerr' class='form-control'></td>" +
            "<td><label>*Automático</label></td>" +
	 "</tr>");
      
      var optionEvidencia={
         isImage: false,
         container: "#tdEviCertiOperatividadGabIncHerr"+gabineteIncendioId,
         idAux: "CertiOperativGabInc",
         esNuevo: true,
         evidenciaNombre: "",
         functionCall: function(){},
         descargaUrl: "",
         mensajeAux: "(Opcional)"
      };
		
      crearFormEvidenciaCompleta(optionEvidencia);
      
      $("#btnVolverGabinIncenHerr").hide();
      $("#btnNuevaGabinIncenHerr").hide();
      $("#btnCancelarGabinIncenHerr").show();
      $("#btnGuardarGabinIncenHerr").show();
      $("#btnEliminarGabinIncenHerr").hide();
      $("#btnImportGabinIncenHerr").hide();
   }else{
      alert("Guarde primero.");
   }
}

function eliminarGabineteIncendioHerr(){
   $("#modalConsolidadoGabineteIncendioHerr").modal("hide");
   
   if(gabineteIncendioObj.numInspecciones == 0){
      mensajeUx="<label>¿Está seguro de eliminar el gabinete contra incendios " +
      		"seleccionado?</label>";
      mensajesUx(mensajeUx,3,"","EliminarGabIncHerr");

      $("#btnDevolverValorEliminarGabIncHerr").on("click",function(){
         var dataParam={
 	    id: gabineteIncendioId
         };

         callAjaxPost(URL+'/auditoria/gabinete_incendio/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
 	       case "05":
 	          mensajeUx="<label>El gabinete contra incendios seleccionado fue eliminado con éxito.</label>";
 	          mensajesUx(mensajeUx,1,"","EliminarGabIncHerrAviso");
 		
 	          $("#modalMensajeUxEliminarGabIncHerrAviso").on("hidden.bs.modal",function(){
  		     $("#modalMensajeUxEliminarGabIncHerrAviso").remove();
  		     $("#modalConsolidadoGabineteIncendioHerr").modal("show");
  		     cargarConsolidadoGabineteIncendioHerr();     
 	          });
 		
 	          break;
 		
 	       default:
 	          alert("Ocurrió un error al eliminar el gabinete contra incendios!");
            }
         });
      });
   
      $("#btnRegresarPrevioEliminarGabIncHerr").on("click",function(){
         $("#modalConsolidadoGabineteIncendioHerr").modal("show");
      });  
   }else{
      mensajeUx="<label>No se puede eliminar el gabinete contra incendios seleccionado " +
      		"porque tiene inspecciones asociadas.<label>"
      mensajesUx(mensajeUx,2,"","EliminarGabIncHerrAviso");
	 		       		
      $("#modalMensajeUxEliminarGabIncHerrAviso").on("hidden.bs.modal",function(){
	 $("#modalConsolidadoGabineteIncendioHerr").modal("show"); 
      });
   }
}

function validacionCodigoGabineteIncendioHerr(){
   var campoVacio = true;
   
   var existeHerramienta;
   var modificarCodigo = 0;
   var codigo = $("#inputCodigoGabIncHerr").val();
    
   if(codigo.length == 0){
      campoVacio = false;
   }
    
   if(campoVacio){
      if(gabineteIncendioId > 0){
	 if(gabineteIncendioObj.codigo != codigo){
	    modificarCodigo = 1;
	 }
      }
      
      if(gabineteIncendioId == 0 || modificarCodigo == 1){
         var dataParamAux={
            codigo: codigo,   
            empresaId: getSession("gestopcompanyid")
         };
         
         callAjaxPostNoLoad(URL+'/auditoria/gabinete_incendio/validacion_codigo',dataParamAux,function(data){
	    existeHerramienta = data.existeHerramienta;
		 
	    if(existeHerramienta == 0){
	       guardarGabineteIncendioHerr(); 
	    }else{
	       $.unblockUI();
	       $("#modalConsolidadoGabineteIncendioHerr").modal("hide");
	       mensajeUx="<label>Ya existe un registro de gabinete contra incendios utilizando " +
	       		 "ese código ("+codigo+").<label>";
	       mensajesUx(mensajeUx,2,"","AvisoCompletarGabIncHerr");
	        		       	
	       $("#modalMensajeUxAvisoCompletarGabIncHerr").on("hidden.bs.modal",function(){
	          $("#modalConsolidadoGabineteIncendioHerr").modal("show");    
	       });
	    }
         });
      }else{
	 guardarGabineteIncendioHerr();  
      }
   }else{
      $("#modalConsolidadoGabineteIncendioHerr").modal("hide");
      mensajeUx="<label>Debe ingresar el código del gabinete contra incendios.<label>"
      mensajesUx(mensajeUx,2,"","AvisoCompletarGabIncHerr");
  		       	
      $("#modalMensajeUxAvisoCompletarGabIncHerr").on("hidden.bs.modal",function(){
         $("#modalConsolidadoGabineteIncendioHerr").modal("show");    
      });
   }
}

function guardarGabineteIncendioHerr(){
   var campoVacio = true;
   
   var codigo = $("#inputCodigoGabIncHerr").val();
   var ubicacion = $("#inputUbicacionGabIncHerr").val();
  
   var fechaFinMant = convertirFechaTexto($("#inputFechaFinMantGabIncHerr").val());
   var inputFechaFinMant;

   if(!fechaFinMant){
      inputFechaFinMant = null;
   }else{
      inputFechaFinMant = fechaFinMant;
   }
   
   if(codigo.length == 0 || ubicacion.length == 0 || inputFechaFinMant == null){
      campoVacio = false;
   }
       
   if(campoVacio){
      var dataParam={
 	 id: gabineteIncendioId,
 	 codigo: codigo,
 	 ubicacion: ubicacion,
 	 fechaFinMantenimiento: inputFechaFinMant,
 	 empresaId: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/auditoria/gabinete_incendio/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":
               guardarEvidenciaAuto(data.nuevoId,"fileEviCertiOperativGabInc",bitsMega*15,
 	       "/auditoria/gabinete_incendio/evidencia_certificado_operatividad/save",function(){
                  $("#modalConsolidadoGabineteIncendioHerr").modal("hide");
    		
     	      	  mensajeUx="<label>El gabinete contra incendios fue registrado con éxito<label>";
     	      	  mensajesUx(mensajeUx,1,"","ActualizarGabIncHerr");
     		
     	      	  $("#modalMensajeUxActualizarGabIncHerr").on("hidden.bs.modal",function(){
     		     $("#modalMensajeUxActualizarGabIncHerr").remove();
     		     $("#modalConsolidadoGabineteIncendioHerr").modal("show");
     		     cargarConsolidadoGabineteIncendioHerr();
     	      	  });
               });
 		
 	       break;
 	 		   
 	    default:
 	       alert("Ocurrió un error al guardar!");
         }
      }); 
   }else{
      $("#modalConsolidadoGabineteIncendioHerr").modal("hide");
      mensajeUx="<label>Debe completar todos los campos.<label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarGabIncHerr");
 		       	
      $("#modalMensajeUxAvisoCompletarGabIncHerr").on("hidden.bs.modal",function(){
         $("#modalConsolidadoGabineteIncendioHerr").modal("show");    
      });
   } 
}

function descargarExcelGabinetesIncendioEvaluadosInspeccion(){
   if(numAreas == 0){
      alert("No hay áreas asignadas a la inspección");
   }else{
      window.open(URL+"/auditoria/inspeccion_gabinete_incendio/excel?id="+auditoriaId +
	          "&empresaId="+getSession("gestopcompanyid"));	
   }    
}

function ocultarSmartImportGabineteIncendioHerr(){
   $("#modalImportGabineteIncendio").modal("hide");
   $("#modalConsolidadoGabineteIncendioHerr").modal("show"); 
}

function verSmartImportGabineteIncendioHerr(){
   $("#modalImportGabineteIncendio").remove();
   $("#modalConsolidadoGabineteIncendioHerr").modal("hide"); 
   
   var text = "";
    
   var textBackUp = 
      "<a class='efectoLink' href='"+URL+"/auditoria/gabinete_incendio/backup?empresaId="+getSession("gestopcompanyid")+"' " +
	 "target='_blank'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>";
	   
   var listItemsForm=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-download'></i> Plantilla import ",
       inputForm:textBackUp,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-info'></i> Archivo Excel: ",
       inputForm:"",divContainer:"divExcelImportGabIncHerr"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
		     "onclick='ocultarSmartImportGabineteIncendioHerr()'>" +
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
      id: "modalImportGabineteIncendio",
      nombre: "Import Gabinetes contra incendios",
      contenido: "<form id='formImportGabIncHerr' class='eventoGeneral'>"+text+"</form>"
   };
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   var options={
      container: "#divExcelImportGabIncHerr",
      functionCall: function(){},
      descargaUrl: "",
      esNuevo: true,
      idAux: "ImportExcelGabIncHerr",
      evidenciaNombre: ""
   };
					
   crearFormEvidenciaCompleta(options);
			
   $("#modalImportGabineteIncendio").modal("show");
   
   $("#formImportGabIncHerr").on("submit",function(e){
      e.preventDefault();
      confirmacionSmartImportGabineteIncendioHerr();
   });    
}

function cancelarMensajeConfirmacionSmartImportGabineteIncendioHerr(){
   $("#modalConfirmacionImportGabineteIncendio").modal("hide");
   $("#modalImportGabineteIncendio").modal("show");
}

function confirmacionSmartImportGabineteIncendioHerr(){
   $("#modalImportGabineteIncendio").modal("hide");
   $("#modalConfirmacionImportGabineteIncendio").remove();
    
   var campoVacio = true;
    
   var nombreExcel = $("#inputEviImportExcelGabIncHerr").val();
     
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
  	                "onclick='cancelarMensajeConfirmacionSmartImportGabineteIncendioHerr()'>" +
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
      	 id: "modalConfirmacionImportGabineteIncendio",
      	 nombre: "<i class='fa fa-bell'></i> Estimado usuario, por favor, confirmar la siguiente información:",
      	 contenido: "<form id='formConfirmacionImportGabineteIncendio' class='eventoGeneral'>"+contenidoAux+"</form>"
      };
            		
      crearModalPrincipalUsuario(modalOptionsAux,function(){},true,true);
        
      $("#formConfirmacionImportGabineteIncendio").on("submit",function(e){
         e.preventDefault();
         enviarExcelImportGabineteIncendio();
      }); 
   }else{
      mensajeUx = "<label>Debe subir el excel para poder continuar.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarImportGabineteIncendio");

      $("#modalMensajeUxAvisoCompletarImportGabineteIncendio").on("hidden.bs.modal",function(){
 	 $("#modalImportGabineteIncendio").modal("show");   
      });   
   }
}

function enviarExcelImportGabineteIncendio(){
   guardarEvidenciaAuto(0,"fileEviImportExcelGabIncHerr",bitsMega*18,
   "/auditoria/gabinete_incendio/excel/masivo/save",function(data){
      $("#modalConfirmacionImportGabineteIncendio").modal("hide");
 	    
      mensajeUx= "<label style='text-align:left;'>"+data.mensaje+"</label>";
      mensajesUx(mensajeUx,4,"","ActualizarVistaModGabineteIncendio");
 	    
      $("#modalMensajeUxActualizarVistaModGabineteIncendio").on("hidden.bs.modal",function(){
         $("#modalConsolidadoGabineteIncendioHerr").modal("show");
         cargarConsolidadoGabineteIncendioHerr();     
      });
   },"id",[  
      {id: "empresaId",value: getSession("gestopcompanyid")}]);
}

var banderaEdicionGabIncAsocInspecc;
var listGabinetesIncendio=[],listEvalInspeccGabinetesIncendio=[];
var gabIncAsocInspeccId;
var gabIncAsocInspeccObj={};

function regresarInspeccDesdeGabinetesIncendioAsocInspecc(){
   $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("hide");
}

function consolidadoGabinetesIncendioAsociadosInspeccion(){
   $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").remove();
	    
   var listModal={
      id: "modalConsolidadoGabinetesIncendioAsociadosInspecc",
      maxWidth: "1500px",
      nombre: "<i class='fa fa-table'></i> Gabinetes contra incendio asociados a la inspección",
      contenido:
         "<button class='btn btn-info' id='btnVolverGabIncAsocInspecc' title='Regresar a la vista anterior.' " +
		 "onclick='regresarInspeccDesdeGabinetesIncendioAsocInspecc()' style='margin-left: 5px'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"+" " +
            "<i class='fa fa-table fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-success' id='btnNuevaGabIncAsocInspecc' style='margin-left: 5px' " +
		 "title='Nuevo registro de gabinete contra incendio asociado.' onclick='nuevaConsolidadoGabinetesIncendioAsociadosInspeccion()'>" +
	    "<i class='fa fa-file-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnCancelarGabIncAsocInspecc' style='margin-left: 5px' " +
	         "title='Cancelar acción.' onclick='cancelarConsolidadoGabinetesIncendioAsociadosInspeccion()'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnGuardarGabIncAsocInspecc' style='margin-left: 5px' " +
	         "title='Guardar el registro de gabinete contra incendio asociado.' onclick='guardarConsolidadoGabinetesIncendioAsociadosInspeccion()'>" +
	    "<i class='fa fa-floppy-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-danger' id='btnEliminarGabIncAsocInspecc' style='margin-left: 5px' " +
	         "title='Eliminar el registro de gabinete contra incendio asociado.' onclick='eliminarConsolidadoGabinetesIncendioAsociadosInspeccion()'>" +
	    "<i class='fa fa-times fa-2x'></i>" +
	 "</button>" +
	 "<div class='wrapper' id='wrapConGabIncAsocInspecc'>" +
	    "<table id='tblConGabIncAsocInspecc' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<td class='tb-acc' style='width:200px'>Gabinete contra incendio</td>" +
		     "<td class='tb-acc' style='width:300px'>Ubicación</td>" +
		     "<td class='tb-acc' style='width:200px'>Fecha vencimiento de mantenimiento</td>" +
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
   resizeDivWrapper("wrapConGabIncAsocInspecc",200);
	   
   cargarConsolidadoGabinetesIncendioAsociadosInspeccion();
}

function cargarConsolidadoGabinetesIncendioAsociadosInspeccion(){
   $("#btnVolverGabIncAsocInspecc").show();
   $("#btnNuevaGabIncAsocInspecc").show();
   $("#btnCancelarGabIncAsocInspecc").hide();
   $("#btnGuardarGabIncAsocInspecc").hide();
   $("#btnEliminarGabIncAsocInspecc").hide();
    
   banderaEdicionGabIncAsocInspecc = false;
    
   var dataParam={
      auditoriaId: auditoriaObj.auditoriaId,
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
 	   
   callAjaxPost(URL+'/auditoria/inspeccion_gabinete_incendio',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listEvalInspeccGabinetesIncendio = data.listEvalInspeccGabinetesIncendio;
            listGabinetesIncendio = data.listGabinetesIncendio;
 		  
 	    $("#tblConGabIncAsocInspecc tbody tr").remove();
 		    
 	    listEvalInspeccGabinetesIncendio.forEach(function(val,index){
 	       var numPreguntasMarcadas=0,isVigenteFecRec="",isVigenciaFecMan="",
 		   isVigenciaFecHid="",estadoMedCor="",actualizadoPor="";
 		
 	       numPreguntasMarcadas = val.numRespuestasMarcadasSi + val.numRespuestasMarcadasNo;
 	       isVigenciaFecMan = (val.gabineteIncendio.isVigenteFechaMantenimiento >= 0?"blue;":"red;");
 	       
 	       estadoMedCor = (val.numRespuestasMarcadasNo > 0?val.numAccCorCompletadas+" / "+val.numRespuestasMarcadasNo:"0 / 0");
 	       
 	       actualizadoPor = (val.actualizadoPor.length == 0?val.fechaActualizacionTexto:
 		                 val.fechaActualizacionTexto+" (por "+val.actualizadoPor+")");
 		
 	       $("#tblConGabIncAsocInspecc tbody").append(
 	          "<tr id='trGabIncAsocInspecc"+val.id+"' onclick='editarConsolidadoGabinetesIncendioAsociadosInspeccion("+index+")'>" +
 	             "<td id='tdCodigoGabIncAsoInsp"+val.id+"'>"+val.gabineteIncendio.codigo+"</td>" +
 	             "<td id='tdUbicacionGabIncAsoInsp"+val.id+"'>"+val.gabineteIncendio.ubicacion+"</td>" +
 	             "<td id='tdFecFinMantGabIncAsoInsp"+val.id+"'>"+
 	                "<label style='color:"+isVigenciaFecMan+"'>"+val.gabineteIncendio.fechaFinMantenimientoTexto+"</label>"+"</td>" +
 	             "<td id='tdEstEvalGabIncAsoInsp"+val.id+"'>"+numPreguntasMarcadas+" / "+val.numPreguntasTotal+"</td>" +
 	             "<td id='tdMedCorEvalGabIncAsoInsp"+val.id+"'>"+estadoMedCor+"</td>" +
 	             "<td id='tdFecCretGabIncAsoInsp"+val.id+"'>"+val.fechaCreacionTexto+" (por "+val.registradoPor+")"+"</td>" +
 	             "<td id='tdFecActGabIncAsoInsp"+val.id+"'>"+actualizadoPor+"</td>" +
 		  "</tr>");
 	    }); 
 		     
 	    formatoCeldaSombreableTabla(true,"tblConGabIncAsocInspecc");
 	    break;
 		     
         default:
            alert("nop");
            break;
      }
 	      
      goheadfixedY("#tblConGabIncAsocInspecc","#wrapConGabIncAsocInspecc");
   });   
}

function cancelarConsolidadoGabinetesIncendioAsociadosInspeccion(){
   cargarConsolidadoGabinetesIncendioAsociadosInspeccion();
}

var listGabinetesIncendioAux=[];

function editarConsolidadoGabinetesIncendioAsociadosInspeccion(pindex){
   if(!banderaEdicionGabIncAsocInspecc){
      banderaEdicionGabIncAsocInspecc = true;
      formatoCeldaSombreableTabla(false,"tblConGabIncAsocInspecc");
        
      gabIncAsocInspeccId = listEvalInspeccGabinetesIncendio[pindex].id;
      gabIncAsocInspeccObj = listEvalInspeccGabinetesIncendio[pindex];
  	
      $("#trGabIncAsocInspecc"+gabIncAsocInspeccId).addClass("fila-edicion");
         
      listGabinetesIncendioAux=[];
       
      listGabinetesIncendio.forEach(function(val1){
         var gabineteIncendioRegistrado = 0;
           
         listEvalInspeccGabinetesIncendio.forEach(function(val2){
            if(val1.id == val2.gabineteIncendio.id){
               gabineteIncendioRegistrado++;
            }
         });
           
         if(gabineteIncendioRegistrado == 0 || val1.id == gabIncAsocInspeccObj.gabineteIncendio.id){
     	    listGabinetesIncendioAux.push(val1); 
         }
      }); 
       
      var selGabineteIncendioInspeccionar = crearSelectOneMenu("selGabineteIncendioInspeccionar",
         "informacionGabineteIncendioSeleccionado()",listGabinetesIncendioAux,gabIncAsocInspeccObj.gabineteIncendio.id,"id","codigo");
       
      $("#tdCodigoGabIncAsoInsp"+gabIncAsocInspeccId)
         .html("<input class='form-control' id='inputBuscarGabineteIncendioInspecc'>"+
        	selGabineteIncendioInspeccionar);
      
      $("#inputBuscarGabineteIncendioInspecc").val(gabIncAsocInspeccObj.gabineteIncendio.codigo);
      $("#inputBuscarGabineteIncendioInspecc").attr("onkeyup","buscarDisponibleGabineteIncendioInspecc()");
       
      $("#tdUbicacionGabIncAsoInsp"+gabIncAsocInspeccId)
         .html("<span id='ubicacionInfoGabInc' style='font-weight:bolder;'></span>");
       
      $("#tdFecFinMantGabIncAsoInsp"+gabIncAsocInspeccId)
         .html("<span id='fechaVencMantInfoGabInc' style='font-weight:bolder;'></span>");
      
      informacionGabineteIncendioSeleccionado();
       
      var numPreguntasMarcadas = 
	 gabIncAsocInspeccObj.numRespuestasMarcadasSi + gabIncAsocInspeccObj.numRespuestasMarcadasNo;
       
      $("#tdEstEvalGabIncAsoInsp"+gabIncAsocInspeccId)
         .html("<a class='efectoLink' title='Enlace Evaluación gabinete contra incendio asociado a la inspección' " +
              	  "onclick='evaluarGabineteIncendioAsociadoInspeccion()'>" +
                  "<i class='fa fa-list-ul'></i> "+numPreguntasMarcadas+" / "+gabIncAsocInspeccObj.numPreguntasTotal + 
               "</a>" );
      
      $("#tdFecActGabIncAsoInsp"+gabIncAsocInspeccId).html("<label>*Automático</label>");
 	  
      $("#btnVolverGabIncAsocInspecc").hide();
      $("#btnNuevaGabIncAsocInspecc").hide();
      $("#btnCancelarGabIncAsocInspecc").show();
      $("#btnGuardarGabIncAsocInspecc").show();
      $("#btnEliminarGabIncAsocInspecc").show();
   }
}
 
function nuevaConsolidadoGabinetesIncendioAsociadosInspeccion(){
   listGabinetesIncendioAux=[];
   gabIncAsocInspeccId = 0;
    
   listGabinetesIncendio.forEach(function(val1){
      var gabineteIncendioRegistrado = 0;
       
      listEvalInspeccGabinetesIncendio.forEach(function(val2){
         if(val1.id == val2.gabineteIncendio.id){
            gabineteIncendioRegistrado++;
         }
      });
       
      if(gabineteIncendioRegistrado == 0){
 	 listGabinetesIncendioAux.push(val1); 
      }
   }); 
    
   if(!banderaEdicionGabIncAsocInspecc && listGabinetesIncendioAux != 0){
      banderaEdicionGabIncAsocInspecc = true;
      gabIncAsocInspeccId = 0;
       
      formatoCeldaSombreableTabla(false,"tblConGabIncAsocInspecc");
      
      var selGabineteIncendioInspeccionar = crearSelectOneMenu("selGabineteIncendioInspeccionar",
	 "informacionGabineteIncendioSeleccionado()",listGabinetesIncendioAux,"-1","id","codigo");
      
      $("#tblConGabIncAsocInspecc tbody").prepend(
         "<tr id='trGabIncAsocInspecc0'>" +
 	    "<td>"+"<input class='form-control' id='inputBuscarGabineteIncendioInspecc'>" +
 	            selGabineteIncendioInspeccionar+"</td>" +
 	    "<td><span id='ubicacionInfoGabInc' style='font-weight:bolder;'></span></td>" +
 	    "<td><span id='fechaVencMantInfoGabInc' style='font-weight:bolder;'></span></td>" +
 	    "<td><label>*Automático</label></td>" +
            "<td><label>*Automático</label></td>" +
            "<td><label>*Automático</label></td>" +
            "<td><label>------</label></td>" +
 	 "</tr>");
      
      $("#inputBuscarGabineteIncendioInspecc").attr("onkeyup","buscarDisponibleGabineteIncendioInspecc()");
      
      informacionGabineteIncendioSeleccionado();
       
      $("#btnVolverGabIncAsocInspecc").hide();
      $("#btnNuevaGabIncAsocInspecc").hide();
      $("#btnCancelarGabIncAsocInspecc").show();
      $("#btnGuardarGabIncAsocInspecc").show();
      $("#btnEliminarGabIncAsocInspecc").hide();
   }else{
      if(banderaEdicionGabIncAsocInspecc){
         alert("Guarde primero.");
      }else{
	 $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("hide");
	  
	 mensajeUx="<label>Todos los gabinetes contra incendio han sido seleccionados " +
	 	   "para esta inspección.</label>";
	 mensajesUx(mensajeUx,2,"","AvisoLimiteGabIncAsoInspecc");

	 $("#modalMensajeUxAvisoLimiteGabIncAsoInspecc").on("hidden.bs.modal",function(){
            $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("show");
	 });
      }
   }
}

function buscarDisponibleGabineteIncendioInspecc(){
   var gabineteIncendioCodigoAux = $("#inputBuscarGabineteIncendioInspecc").val().toUpperCase().trim();
   var encontrado = 0;
   
   if(gabineteIncendioCodigoAux.length != 0){
      listGabinetesIncendioAux.forEach(function(val){
         if(val.codigo.toUpperCase().trim().includes(gabineteIncendioCodigoAux) && encontrado == 0){
  	    $("#selGabineteIncendioInspeccionar").val(val.id);
  	    encontrado++;
         }     
      }); 
   }
     
   if(encontrado == 0){
      $("#selGabineteIncendioInspeccionar").val(-1); 
   }
     
   informacionGabineteIncendioSeleccionado();
}

function informacionGabineteIncendioSeleccionado(){
   var gabineteIncendioId = parseInt($("#selGabineteIncendioInspeccionar").val());
    
   if(gabineteIncendioId != -1){
      listGabinetesIncendioAux.forEach(function(val){
 	 if(val.id == gabineteIncendioId){
 	    document.querySelector('#ubicacionInfoGabInc').innerText = val.ubicacion;   
	    document.getElementById('ubicacionInfoGabInc').style.color = "black";
 	 
 	    document.querySelector('#fechaVencMantInfoGabInc').innerText = val.fechaFinMantenimientoTexto;
 	    document.getElementById('fechaVencMantInfoGabInc')
 	       .style.color = (val.isVigenteFechaMantenimiento >= 0?"blue":"red");
 	 }
      });
   }else{
      document.querySelector('#ubicacionInfoGabInc').innerText = "------";
      document.getElementById('ubicacionInfoGabInc').style.color = "black";
      document.querySelector('#fechaVencMantInfoGabInc').innerText = "------";
      document.getElementById('fechaVencMantInfoGabInc').style.color = "black";
   } 
}

function guardarConsolidadoGabinetesIncendioAsociadosInspeccion(){
   var campoVacio = true; 
     
   var gabineteIncendioId = parseInt($("#selGabineteIncendioInspeccionar").val());
     
   if(gabineteIncendioId == -1){
      campoVacio = false;
      mensajeUx = "<label>Debe seleccionar el gabinete contra incendio a inspeccionar.</label>";
   }
     
   if(campoVacio){
      var dataParam={
 	 id: gabIncAsocInspeccId,
  	 auditoria: {auditoriaId: auditoriaObj.auditoriaId},
  	 gabineteIncendio: {id: gabineteIncendioId}
      }; 
         
      callAjaxPost(URL+'/auditoria/auditoria_gabinete_incendio/save',dataParam,function(data){
	 $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("hide");
 	 
 	 if(gabIncAsocInspeccId == 0){ 
 	    mensajeUx="<label>El gabinete contra incendio se asoció a la inspección con éxito.<br><br>" +
 	 	      "Empezará el despliegue de las preguntas para la evaluación.</label>";
 	 }else{
 	    mensajeUx="<label>El registro del gabinete contra incendio se actualizó con éxito.</label>"; 
 	 }
 	 
 	 mensajesUx(mensajeUx,1,"","ActualizarGabIncAsoInspecc");
 	       
 	 $("#modalMensajeUxActualizarGabIncAsoInspecc").on("hidden.bs.modal",function(){ 
 	    if(gabIncAsocInspeccId == 0){ 
 	       gabIncAsocInspeccObj.id = data.nuevoId;
 	       
 	       evaluarGabineteIncendioAsociadoInspeccion();
 	    }else{
 	       $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("show");
 	       cargarConsolidadoGabinetesIncendioAsociadosInspeccion();
 	    }
 	 });
      });
   }else{
      $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("hide");
        
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposGabIncAsoInspecc");

      $("#modalMensajeUxAvisoCompletarCamposGabIncAsoInspecc").on("hidden.bs.modal",function(){
	 $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("show");
      });
   }   
}

function eliminarConsolidadoGabinetesIncendioAsociadosInspeccion(){
   $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("hide");
    
   mensajeUx="<label>¿Está seguro de eliminar este registro de gabinete contra incendio " +
     	     "(código: "+gabIncAsocInspeccObj.gabineteIncendio.codigo+") seleccionado?" +
     	     "<br>(también se eliminará la evaluación relacionada al mismo).</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarGabIncAsoInspecc");

   $("#btnDevolverValorRespEliminarGabIncAsoInspecc").on("click",function(){
      var dataParam={
  	 id: gabIncAsocInspeccId
      };

      callAjaxPost(URL+'/auditoria/auditoria_gabinete_incendio/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
  	    case "05":
  	       mensajeUx="<label>El registro del gabinete contra incendio se ha eliminado correctamente.</label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarGabIncAsoInspecc");
  		
  	       $("#modalMensajeUxActualizarGabIncAsoInspecc").on("hidden.bs.modal",function(){
  		  $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("show");
  	          cargarConsolidadoGabinetesIncendioAsociadosInspeccion();
  	       });
  	       break;
  		
  	    default:	
  	       alert("Ocurrió un error al eliminar el registro!");
         }
      });
   });
   
   $("#btnRegresarPrevioRespEliminarGabIncAsoInspecc").on("click",function(){
      $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("show");
   });  
}

function regresarGabinetesIncendioAsocInspeccDesdeEvaluacionExtintor(){
   $("#modalEvaluarGabineteIncendioAsociadoInspecc").modal("hide");
   $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("show");
   cargarConsolidadoGabinetesIncendioAsociadosInspeccion();
}

var listFullEvaluacionesGabineteIncendioInspecc=[];

function evaluarGabineteIncendioAsociadoInspeccion(){
   $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("hide");
   $("#modalEvaluarGabineteIncendioAsociadoInspecc").remove();
 	    
   var listModal={
      id: "modalEvaluarGabineteIncendioAsociadoInspecc",
      maxWidth: "1500px",
      nombre: "<i class='fa fa-list-ul'></i> Evaluación del gabinete contra incendio asociado a la inspección",
      contenido:
 	 "<button class='btn btn-success' id='btnCancelarEvalGabIncAsocInspecc' style='margin-left: 5px' " +
 	         "title='Cancelar acción' onclick='regresarGabinetesIncendioAsocInspeccDesdeEvaluacionExtintor()'>" +
 	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
 	 "</button>" +
 	 "<button class='btn btn-success' id='btnGuardarEvalGabIncAsocInspecc' style='margin-left: 5px' " +
 	         "title='Guardar el registro de gabinete contra incendio asociado.' onclick='validarEvaluacionGabineteIncendioAsociadoInspeccion()'>" +
 	    "<i class='fa fa-floppy-o fa-2x'></i>" +
 	 "</button>" +
 	 "<div class='wrapper' id='wrapEvaluarGabIncAsocInspecc'>" +
 	    "<table id='tblEvaluarGabIncAsocInspecc' class='table table-striped table-bordered table-hover table-fixed'>" +
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
   resizeDivWrapper("wrapEvaluarGabIncAsocInspecc",200);
 	  
   var dataParamAux={
      id: gabIncAsocInspeccObj.id,
      tipoAuditoriaId: auditoriaObj.auditoriaTipo
   };
    
   callAjaxPost(URL+'/auditoria/verificaciones/version_dos/auditoria_gabinete_incendio/evaluacion',dataParamAux,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    listFullEvaluacionesGabineteIncendioInspecc = data.listEvaluacionesGabinetesIncendio;
	
	    listFullEvaluacionesGabineteIncendioInspecc.forEach(function(val,index){
	       var listBooleanSiNo = listBoolean.sort(function(val1,val2){
	          return val2.id - val1.id;
	       });
	    
	       var radiosPregInsMovil = crearRadiosAutoVersionDos("radioPreguntaInsGabIncMovil"+val.verificacionId,
		  listBooleanSiNo,"","id","nombre","habilitarCamposEvalPreguntaInspeccGabineteIncendio",val.verificacionId);
	       
	       var actualizadoPor = (val.actualizadoPor.length == 0?val.fechaActualizacionTexto:
	                             val.fechaActualizacionTexto+" (por "+val.actualizadoPor+")");
	    
	       $("#tblEvaluarGabIncAsocInspecc tbody").append(
	          "<tr id='trHerrInspeccGabInc"+val.verificacionId+"'>" +
	             "<td>"+(index+1)+". "+val.verificacion+"</td>" +
	             "<td>"+radiosPregInsMovil+"</td>" +
	             "<td>"+"<textarea rows='4' class='form-control' " +
	             	              "id='textObsAudiGabIncMovil"+val.verificacionId+"'></textarea>"+
	                    "<span id='auxInfoTextObsAudiGabIncMovil"+val.verificacionId+"' " +
	                    	  "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" +
	             "<td id='tdEviPregGabInc"+val.verificacionId+"'></td>" +
	             "<td>"+"<textarea rows='4' class='form-control' " +
                                      "id='textDescAudiGabIncMedCorMovil"+val.verificacionId+"'></textarea>" +
                            "<span id='auxInfoTextDescAudiGabIncMedCorMovil"+val.verificacionId+"' " +
                                  "style='float:right;color:red;font-weight:bold;'></span>" +"</td>" +
                     "<td>"+"<input type='date' id='inputFechaPlanAudiGabIncMedCorMovil"+val.verificacionId+"' " +
	                           "class='form-control'>" +
	                    "<span id='auxInfoTextFecPlanAudiGabIncMedCorMovil"+val.verificacionId+"' " +
		  	          "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" + 
                     "<td>"+"<input class='form-control' id='inputBuscarResponsableGabIncMedCorrMovil"+val.verificacionId+"'>" +
	                    "<div id='divSelResponsableGabIncMedCorrMovil"+val.verificacionId+"'></div>" +
	                    "<label>*Buscar Responsable por DNI y/o nombres/apellidos " +
	                           "(debe ingresar 3 caracteres como mínimo).</label>" +
	                    "<span id='auxInfoTextRespAudiGabIncMedCorMovil"+val.verificacionId+"' " +
 		                  "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" +
 		     "<td id='tdEviMedCorGabInc"+val.verificacionId+"'></td>" +
                     "<td>"+"<span id='auxInfoEstadoAudiGabIncMedCorMovil"+val.verificacionId+"' " +
                                  "style='color:red;font-weight:bold;font-size:18px;'></span>"+"</td>" + 
	             "<td>"+actualizadoPor+"</td>" +
		  "</tr>");
	       
	       var options={
	 	  container: "#tdEviPregGabInc"+val.verificacionId,
	 	  functionCall: function(){},
	 	  descargaUrl: (val.respuestaSimple == 1?"":
	 	     "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/evidencia?" +
	 	     "detalleAuditoriaGabineteIncendioId="+val.detalleAuditoriaGabineteIncendioId),
	 	  esNuevo: (val.respuestaSimple == 1 || val.evidenciaNombre == ""?true:false),
	 	  idAux: "PregInspeccGabInc"+val.verificacionId,
	 	  evidenciaNombre: (val.respuestaSimple == 1 || val.evidenciaNombre == ""?
	 		            "":val.evidenciaNombre),
	          mensajeAux: "<span id='auxInfoTextEviPregGabInc"+val.verificacionId+"' " +
	 			    "style='float:right;color:blue;font-weight:bold;'></span>"
	       }; 
	       
	       crearFormEvidenciaCompleta(options);
	       
	       var optionsMedCor={
	          container: "#tdEviMedCorGabInc"+val.verificacionId,
	          functionCall: function(){
	             estadoAccionCorrectivaInspeccGabInc(val.verificacionId);
	          },
	          descargaUrl: (val.respuestaSimple == 1?"":
	             "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/accion_correctiva/evidencia?" +
	             "detalleAuditoriaGabineteIncendioId="+val.detalleAuditoriaGabineteIncendioId),
	          esNuevo: (val.respuestaSimple == 1 || val.evidenciaAccCorNombre == ""?true:false),
	          idAux: "MedCorInspeccGabInc"+val.verificacionId,
	          evidenciaNombre: (val.respuestaSimple == 1 || val.evidenciaAccCorNombre == ""?
	           		    "":val.evidenciaAccCorNombre),
	          mensajeAux: "*Al subir la evidencia, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
	       }; 
	                 
	       crearFormEvidenciaCompleta(optionsMedCor);
	 	        
	       document.getElementById(val.respuestaSimple+"radioPreguntaInsGabIncMovil"+val.verificacionId).checked = true;
	       $("#textObsAudiGabIncMovil"+val.verificacionId).val(val.comentario);
	 	 
	       habilitarCamposEvalPreguntaInspeccGabineteIncendio(val.respuestaSimple,val.verificacionId);
	       
	       if(val.respuestaSimple == 0){
	          $("#textDescAudiGabIncMedCorMovil"+val.verificacionId).val(val.accionCorrectiva); 
	      	  
	          var valFechaPlanificada = convertirFechaInput(val.fechaPlanificacion);
	      	  $("#inputFechaPlanAudiGabIncMedCorMovil"+val.verificacionId).val(valFechaPlanificada);
	      	        
	      	  $("#inputBuscarResponsableGabIncMedCorrMovil"+val.verificacionId).val(val.responsable);
	      	  buscarResponsableAccionCorrectivaInspeccGabInc(val.verificacionId);
	       }
	    });
	    
	    break;
	
         default:
            alert("nop");
            break;
      }
	      
      goheadfixedY("#tblEvaluarGabIncAsocInspecc","#wrapEvaluarGabIncAsocInspecc");
   });
}

function habilitarCamposEvalPreguntaInspeccGabineteIncendio(valResp,auxId){
   var valRespVisita = valResp;
     
   if(valRespVisita == 0){
      document.getElementById("textObsAudiGabIncMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextObsAudiGabIncMovil'+auxId).innerText = "(obligatorio)";
        
      document.getElementById("fileEviPregInspeccGabInc"+auxId).disabled = false;
      document.querySelector('#auxInfoTextEviPregGabInc'+auxId).innerText = "(opcional)";
      
      document.getElementById("textDescAudiGabIncMedCorMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextDescAudiGabIncMedCorMovil'+auxId).innerText = "(obligatorio)";
      
      document.getElementById("inputFechaPlanAudiGabIncMedCorMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextFecPlanAudiGabIncMedCorMovil'+auxId).innerText = "(obligatorio)";
       
      document.getElementById("fileEviMedCorInspeccGabInc"+auxId).disabled = false;
      
      $("#inputBuscarResponsableGabIncMedCorrMovil"+auxId).val("");
      document.getElementById("inputBuscarResponsableGabIncMedCorrMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextRespAudiGabIncMedCorMovil'+auxId).innerText = "(obligatorio)";
      
      buscarResponsableAccionCorrectivaInspeccGabInc(auxId);
      estadoAccionCorrectivaInspeccGabInc(auxId);
   }else{
      document.getElementById("textObsAudiGabIncMovil"+auxId).disabled = true;
      document.getElementById("textObsAudiGabIncMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextObsAudiGabIncMovil'+auxId).innerText = "";
        
      document.getElementById("fileEviPregInspeccGabInc"+auxId).disabled = true;
      document.getElementById("fileEviPregInspeccGabInc"+auxId).value = null;
      document.getElementById("inputEviPregInspeccGabInc"+auxId).value = null;
      document.querySelector('#auxInfoTextEviPregGabInc'+auxId).innerText = ""; 
      
      document.getElementById("textDescAudiGabIncMedCorMovil"+auxId).disabled = true;
      document.getElementById("textDescAudiGabIncMedCorMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextDescAudiGabIncMedCorMovil'+auxId).innerText = "";
      
      document.getElementById("inputFechaPlanAudiGabIncMedCorMovil"+auxId).disabled = true;
      document.getElementById("inputFechaPlanAudiGabIncMedCorMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextFecPlanAudiGabIncMedCorMovil'+auxId).innerText = "";
       
      document.getElementById("fileEviMedCorInspeccGabInc"+auxId).disabled = true;
      document.getElementById("fileEviMedCorInspeccGabInc"+auxId).value = null;
      document.getElementById("inputEviMedCorInspeccGabInc"+auxId).value = null;
      
      document.querySelector('#auxInfoEstadoAudiGabIncMedCorMovil'+auxId).innerText = "------";   
      document.getElementById('auxInfoEstadoAudiGabIncMedCorMovil'+auxId).style.color = "black";
      
      $("#inputBuscarResponsableGabIncMedCorrMovil"+auxId).val("");
      document.getElementById("inputBuscarResponsableGabIncMedCorrMovil"+auxId).disabled = true;
      document.querySelector('#divSelResponsableGabIncMedCorrMovil'+auxId).innerText = "";
      document.querySelector('#auxInfoTextRespAudiGabIncMedCorMovil'+auxId).innerText = "";
   }
}

function estadoAccionCorrectivaInspeccGabInc(auxId){
   var nombreAccCorEvidencia = $("#inputEviMedCorInspeccGabInc"+auxId).val();
     
   if(nombreAccCorEvidencia.length == 0){
      document.querySelector('#auxInfoEstadoAudiGabIncMedCorMovil'+auxId).innerText = "Pendiente";   
      document.getElementById('auxInfoEstadoAudiGabIncMedCorMovil'+auxId).style.color = "#D1D619";
   }else{
      document.querySelector('#auxInfoEstadoAudiGabIncMedCorMovil'+auxId).innerText = "Completado";   
      document.getElementById('auxInfoEstadoAudiGabIncMedCorMovil'+auxId).style.color = "blue";
   }
}

var listResponsablesAccCorInsGabInc=[];

function buscarResponsableAccionCorrectivaInspeccGabInc(auxId){
   var nombre = $("#inputBuscarResponsableGabIncMedCorrMovil"+auxId).val().trim();
  	
   if(nombre.length >= 3){
      var dataParam={
         trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid"))
      };
  		
      callAjaxPostNoLoad(URL+"/auditoria/responsable/accion_correctiva",dataParam,function(data){
 	 listResponsablesAccCorInsGabInc = data.listResponsablesAccCorIns;
         
         if(listResponsablesAccCorInsGabInc.length == 0){
            listResponsablesAccCorInsGabInc.push({
               trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
  	    });
         }
  			
         var selResponsableAccCorInsGabInc = crearSelectOneMenuOblig("selResponsableAccCorInsGabInc"+auxId,
            "",listResponsablesAccCorInsGabInc,"","trabajadorId","nombre");
  	       
         $("#divSelResponsableGabIncMedCorrMovil"+auxId).html(selResponsableAccCorInsGabInc);
         $("#inputBuscarResponsableGabIncMedCorrMovil"+auxId)
            .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccGabInc("+auxId+")");
      });
   }else{
      listResponsablesAccCorInsGabInc = [];
        
      listResponsablesAccCorInsGabInc.push({
         trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
      });
         
      var selResponsableAccCorInsGabInc = crearSelectOneMenuOblig("selResponsableAccCorInsGabInc"+auxId,
 	 "",listResponsablesAccCorInsGabInc,"","trabajadorId","nombre");
  		       
      $("#divSelResponsableGabIncMedCorrMovil"+auxId).html(selResponsableAccCorInsGabInc);
      $("#inputBuscarResponsableGabIncMedCorrMovil"+auxId)
         .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccGabInc("+auxId+")");
   }
}

var indiceActualEvaIndGabInc;

function validarEvaluacionGabineteIncendioAsociadoInspeccion(){
   var campoVacio = true; 
    
   var bitRespuesta,observacion,medidaCorrectiva,inputFechaPlanificada,nombrePregunta;
     
   listFullEvaluacionesGabineteIncendioInspecc.forEach(function(val,index){
      bitRespuesta = parseInt($("input[name='radioPreguntaInsGabIncMovil"+val.verificacionId+"']:checked").val());
      observacion = $("#textObsAudiGabIncMovil"+val.verificacionId).val();
       
      if(bitRespuesta == 0 && campoVacio){
 	 nombrePregunta = val.verificacion;
 	 observacion = $("#textObsAudiGabIncMovil"+val.verificacionId).val();
 	 medidaCorrectiva = $("#textDescAudiGabIncMedCorMovil"+val.verificacionId).val();
 	 
 	 var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiGabIncMedCorMovil"+val.verificacionId).val());
 	 inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
 	 
 	 var nombreEvidenciaMedCor = $("#inputEviMedCorInspeccGabInc"+val.verificacionId).val();
 	 
 	 var responsableId = parseInt($("#selResponsableAccCorInsGabInc"+val.verificacionId).val());
 	 
 	 if(observacion.length == 0){
 	    campoVacio = false;
 	    mensajeUx = "<label>Debe registrar la observación - "+nombrePregunta+".</label>";
 	    
 	    document.getElementById("textObsAudiGabIncMovil"+val.verificacionId).focus();
 	 }else if(medidaCorrectiva.length == 0){
 	    campoVacio = false;
 	    mensajeUx = "<label>Debe registrar la descripción de la medida correctiva - " +
 	    		 nombrePregunta+".</label>";  
 	    
 	    document.getElementById("textDescAudiGabIncMedCorMovil"+val.verificacionId).focus();
 	 }else if(inputFechaPlanificada == null && nombreEvidenciaMedCor.length == 0){
 	    campoVacio = false;
 	    mensajeUx = "<label>Debe registrar la fecha planificada o subir la evidencia de la " +
  	                "medida correctiva - "+nombrePregunta+".</label>"; 
 	    
 	    document.getElementById("inputFechaPlanAudiGabIncMedCorMovil"+val.verificacionId).focus();
 	 }else if(responsableId == -1){
 	    campoVacio = false;
            mensajeUx = "<label>Debe seleccionar al responsable de la medida correctiva - " +
 		         nombrePregunta+".</label>";  
             
            document.getElementById("inputBuscarResponsableGabIncMedCorrMovil"+val.verificacionId).focus();
 	 }
      }  
   });
   
   if(campoVacio){
      indiceActualEvaIndGabInc = 1;
      guardarEvaluacionGabineteIncendioAsociadoInspeccion(indiceActualEvaIndGabInc,guardarEvaluacionGabineteIncendioAsociadoInspeccion);
   }else{
      $("#modalEvaluarGabineteIncendioAsociadoInspecc").modal("hide");
   
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposEvalGabIncAsoInspecc");

      $("#modalMensajeUxAvisoCompletarCamposEvalGabIncAsoInspecc").on("hidden.bs.modal",function(){
	 $("#modalEvaluarGabineteIncendioAsociadoInspecc").modal("show");
      });
   }
}

function guardarEvaluacionGabineteIncendioAsociadoInspeccion(indiceActual,functionCallBack){
   var respuesta,respAux,observacion,validacionId,medidaCorrectiva,inputFechaPlanificada,
       responsableId;
   var dataParam;
    
   listFullEvaluacionesGabineteIncendioInspecc.forEach(function(val,index){
      if((index + 1) == indiceActualEvaIndGabInc){
	 respuesta = parseFloat($("input[name='radioPreguntaInsGabIncMovil"+val.verificacionId+"']:checked").val());
	 respAux = parseInt($("input[name='radioPreguntaInsGabIncMovil"+val.verificacionId+"']:checked").val());
	 observacion = $("#textObsAudiGabIncMovil"+val.verificacionId).val();
	 validacionId = val.verificacionId;
	 //var nombreEvi = $("#inputEviPregInspeccGabInc"+val.verificacionId).val();
	 if(respAux == 0){
	    medidaCorrectiva = $("#textDescAudiGabIncMedCorMovil"+val.verificacionId).val();
	    responsableId = parseInt($("#selResponsableAccCorInsGabInc"+val.verificacionId).val());
	              
	    var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiGabIncMedCorMovil"+val.verificacionId).val());
	    inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
	 }else{
	    medidaCorrectiva = null;inputFechaPlanificada = null;responsableId = null;
	 }
       
         dataParam={
            detalleAuditoriaGabineteIncendioId: val.detalleAuditoriaGabineteIncendioId,
            auditoriaGabineteIncendioId: gabIncAsocInspeccObj.id, 
            verificacionId: val.verificacionId,
            respuestaSimple: respuesta,
            comentario: observacion,
            accionCorrectiva: medidaCorrectiva,
            fechaPlanificacion: inputFechaPlanificada,
            responsableId: responsableId
         };
      }
   });  
   
   callAjaxPostNoUnlock(URL+'/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/save',dataParam,function(data){
      guardarEvidenciaAuto(data.nuevoId,"fileEviPregInspeccGabInc"+validacionId,bitsEvidenciaVerificacion,
      "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/evidencia/save",function(){
	 guardarEvidenciaAuto(data.nuevoId,"fileEviMedCorInspeccGabInc"+validacionId,bitsEvidenciaVerificacion,
         "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/accion_correctiva/evidencia/save",function(){
            if(indiceActualEvaIndGabInc == listFullEvaluacionesGabineteIncendioInspecc.length){
               $.unblockUI();
               $("#modalEvaluarGabineteIncendioAsociadoInspecc").modal("hide");
            
               mensajeUx = "<label>Inspección guardada con éxito.</label>";
               mensajesUx(mensajeUx,1,"","EvaluacionCompletadaGabIncIns");
					
               $("#modalMensajeUxEvaluacionCompletadaGabIncIns").on("hidden.bs.modal",function(){
	          $("#modalConsolidadoGabinetesIncendioAsociadosInspecc").modal("show");
	          cargarConsolidadoGabinetesIncendioAsociadosInspeccion(); 
               });
            }else{
	       indiceActualEvaIndGabInc++;
	       functionCallBack(indiceActualEvaIndGabInc,guardarEvaluacionGabineteIncendioAsociadoInspeccion);
            }
	 },"detalleAuditoriaGabineteIncendioId");
      },"detalleAuditoriaGabineteIncendioId");
   });
}
