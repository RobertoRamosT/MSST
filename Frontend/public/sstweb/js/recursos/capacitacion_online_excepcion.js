var excepcionCapOnlineId,excepcionCapOnlineObj;
var banderaEdicionExcepcion=false;
var listFullTrabajadores;
var mensajeUx;
var listFullExcepciones=[],listTrabPuestosAsigDentro=[],listTrabPuestosAsigFuera=[];

var actualizarPrincipalCap;

var listTipoExcepcion=[
   {id:0, nombre:"Exonerar trabajador"},
   {id:1, nombre:"Agregar trabajador"}
];

var listPuestosAsignadosExcepcionId=[],listTrabExcepcionCapOnlineAux=[];

//$(function(){
//    $("#btnNuevoExcepcion").attr("onclick","javascript:nuevoExcepcionCapOnline();");
//    $("#btnSmartUploadExcepcion").attr("onclick","javascript:cargarModalSmartUploadExcepcionCapOnline();");
//    $("#btnCancelarExcepcion").attr("onclick","javascript:cancelarExcepcionCapOnline();");
//    $("#btnGuardarExcepcion").attr("onclick","javascript:guardarExcepcionCapOnline();");
//    $("#btnEliminarExcepcion").attr("onclick","javascript:eliminarExcepcionCapOnline();");
//})

function ocultarModalExcepcionesCapOnline(){
   $("#modalExcepcionesCapOnline").modal("hide");
    
   if(actualizarPrincipalCap == 1){
      cargarPrimerEstado();
   } 
}

function mostrarModalExcepcionesCapOnline(){
    $("#modalExcepcionesCapOnline").modal("show");
}

function verExcepcionesCapacitacionOnline(){
   $("#modalExcepcionesCapOnline").remove();
   
   actualizarPrincipalCap = 0;
   
   listPuestosAsignadosExcepcionId = []; 
   
   if(capacitacionObj.listPuestosAsignadosId.length != 0){
      var puestosAsignadosId = capacitacionObj.listPuestosAsignadosId.split(","); 
  
      puestosAsignadosId.forEach(function(val){
	 listPuestosAsignadosExcepcionId.push(parseInt(val));
      });
   }
   
   var buttonVolver =
      "<button type='button' id='btnVolverExcepcionCapOnline' class='btn btn-info' style='margin-right:5px' " +
              "onclick='ocultarModalExcepcionesCapOnline()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
    
   var buttonNuevo = 
      "<button id='btnNuevoExcepcion' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='nuevoExcepcionCapOnline()' title='Nuevo'>" +
         "<i class='fa fa-file-o fa-2x'></i>" +
      "</button>";
   
   var buttonCancelar = 
      "<button id='btnCancelarExcepcion' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='cancelarExcepcionCapOnline()' title='Cancelar'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardarExcepcion' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarExcepcionCapOnline()' title='Guardar'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonEliminar =
      "<button id='btnEliminarExcepcion' type='button' class='btn btn-danger' style='margin-right:5px' " +
              "onclick='eliminarExcepcionCapOnline()' title='Eliminar'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var buttonImportSmart =
      "<button id='btnSmartUploadExcepcion' type='button' class='btn btn-info' " +
              "onclick='cargarModalSmartUploadExcepcionCapOnline()' " +
              "title='Importar Excepcion(es) mediante una plantilla - Intrucciones: (1) Descargamos la plantilla " +
               	     "[enlace Descargar] en excel para ingresar o editar los datos en las celdas respectivas. " +
               	     "(2) Subir el archivo excel antes mencionado con sus respectivas modificaciones.'>" +
         "<i class='fa fa-upload fa-2x'></i><i class='fa fa-info'></i>" +
      "</button>";
        
   var modalOptions={
      maxWidth:"90%",id:"modalExcepcionesCapOnline",
      nombre:"<i class='fa fa-table'></i> Excepciones - capacitación ["+capacitacionObj.capacitacionNombre+"]",
      contenido: 
         buttonVolver+buttonNuevo+buttonCancelar+buttonGuardar+buttonEliminar+buttonImportSmart +
        "<div class='wrapper' id='wrapperExcepcionesCapOnline'>" +
           "<table id='tblExcepcionesCapOnline' class='table table-striped table-bordered table-hover table-fixed'>" +
 	      "<thead>" +
 	         "<tr>" +
 	            "<th class='tb-acc' rowspan='2' style='width:150px'>Nro</th>" +
		    "<th class='tb-acc' rowspan='2' style='width:250px'>Tipo de excepción</th>" +
		    "<th class='tb-acc' colspan='5' style='width:1500px'>Datos del Trabajador</th>" +
		    "<th class='tb-acc' rowspan='2' style='width:400px'>Motivo de la excepción</th>" +
		    "<th class='tb-acc' rowspan='2' style='width:250px'>Actualizado el</th>" +
                 "</tr>" +
                 "<tr>" +
                    "<th class='tb-acc' style='width:300px'>Nombre</th>" +
                    "<th class='tb-acc' style='width:300px'>Unidad</th>" +
                    "<th class='tb-acc' style='width:300px'>División</th>" +
                    "<th class='tb-acc' style='width:300px'>Área</th>" +
                    "<th class='tb-acc' style='width:300px'>Puesto de trabajo</th>" +
                 "</tr>" +
 	      "</thead>" +
 	      "<tbody></tbody>" +
 	   "</table>" +
 	"</div>"};
 		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperExcepcionesCapOnline",190);
   cargarModalExcepcionesCapOnline();
}

function cargarModalExcepcionesCapOnline(){
   $("#btnNuevoExcepcion").show();$("#btnSmartUploadExcepcion").show();
   $("#btnCancelarExcepcion").hide();$("#btnGuardarExcepcion").hide();
   $("#btnEliminarExcepcion").hide();$("#btnVolverExcepcionCapOnline").show();
    
   listFullTrabajadores=[];
    
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),
      capacitacionId: capacitacionId,
      listPuestosAsignadosIdAux: 
         (listPuestosAsignadosExcepcionId.length == 0?null:listPuestosAsignadosExcepcionId)
   };
    
   callAjaxPost(URL+"/capacitacion/excepcion",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 banderaEdicionExcepcion = false;
	 listFullExcepciones = data.list;
	 listTrabPuestosAsigDentro = data.listTrabPuestosAsigDentro;
	 listTrabPuestosAsigFuera = data.listTrabPuestosAsigFuera;
	 
	 $("#tblExcepcionesCapOnline tbody tr").remove();
	 
	 listFullExcepciones.forEach(function(val,index){
	    var contenidoStyle = 
	       "style='background-color:"+(val.tipoExcepcion == 0?"#ff7474":"#5dcd5d")+";'";
	    var tipoExcepcion = (val.tipoExcepcion == 0?"Exonerar":"Agregar");
	    var motivoExcepcion = (val.motivoExcepcion.length == 0?"------":val.motivoExcepcion);
	    
	    $("#tblExcepcionesCapOnline tbody").append(
               "<tr id='trExcepcionCapOnline"+val.idExcepcion+"' onclick='editarExcepcionCapOnline("+index+")'>" +
	          "<td id='tdidexcepcion"+val.idExcepcion+"' "+contenidoStyle+">"+(index+1)+"</td>" +
		  "<td id='tdtipo_excepcion"+val.idExcepcion+"' "+contenidoStyle+">"+tipoExcepcion+"</td>" +
		  "<td id='tdtrab_excepcion"+val.idExcepcion+"' "+contenidoStyle+">"+val.trabajador.trabajadorNombre+"</td>" +
		  "<td id='tdUnidadTrabExcepCapOnline"+val.idExcepcion+"' "+contenidoStyle+">"+val.trabajador.area.matrixName+"</td>" +
		  "<td id='tdDivisionTrabExcepCapOnline"+val.idExcepcion+"' "+contenidoStyle+">"+val.trabajador.area.divisionName+"</td>" +
		  "<td id='tdAreaTrabExcepCapOnline"+val.idExcepcion+"' "+contenidoStyle+">"+val.trabajador.area.areaName+"</td>" +
		  "<td id='tdPuestoTrabExcepCapOnline"+val.idExcepcion+"' "+contenidoStyle+">"+val.trabajador.puesto.positionName+"</td>" +
		  "<td id='tdmotivo"+val.idExcepcion+"' "+contenidoStyle+">"+motivoExcepcion+"</td>" +
		  "<td id='tdFecActExcepCapOnline"+val.idExcepcion+"' "+contenidoStyle+">"+val.fechaActualizacionTexto+"</td>" +
	       "</tr>");
	 });
	 
	 formatoCeldaSombreableTabla(true,"tblExcepcionesCapOnline");
      }else{
         console.log("NOPNPO");
      }
	
      goheadfixedY("#tblExcepcionesCapOnline","#wrapperExcepcionesCapOnline");
   });
}

//Aqui nos quedamos
//SUGERENCIA: omitir (por ahora) el import para enfocarse en que cargue la interfaz y se pueda ver, editar, guardar y eliminar todas
//	las excepciones

//SIGUIENTE PASO: en el capacitacion.js buscar que, dandole click al boton de excepciones al editar cap, se cree y abra el modal.

//LUEGO: DARLE FUNCIONALIDADES A LOS BOTONES DE NUEVO, CANCELAR, GUARDAR y EDITAR.
function editarExcepcionCapOnline(pindex){
   if(!banderaEdicionExcepcion){
      formatoCeldaSombreableTabla(false,"tblExcepcionesCapOnline");
      excepcionCapOnlineId = listFullExcepciones[pindex].idExcepcion;
      excepcionCapOnlineObj = listFullExcepciones[pindex];
	
      $("#trExcepcionCapOnline"+excepcionCapOnlineId).addClass("fila-edicion");
//      $("#trExcepcionCapOnline"+excepcionCapOnlineId+" td").css("vertical-align","middle");
      
      var selTipoExcepcion = crearSelectOneMenu("selTipoExcepcion","cambiarSelectTrabExcepcionCapOnline()",
	 listTipoExcepcion,excepcionCapOnlineObj.tipoExcepcion,"id","nombre");
    	
      $("#tdtipo_excepcion"+excepcionCapOnlineId).html(selTipoExcepcion);
      
      $("#tdtrab_excepcion"+excepcionCapOnlineId).html("<div id='divSelectTrabExcepCapOnline'></div>");
      $("#tdUnidadTrabExcepCapOnline"+excepcionCapOnlineId).html("<div id='divInfoUnidadTrabExcepCapOnline'></div>");
      $("#tdDivisionTrabExcepCapOnline"+excepcionCapOnlineId).html("<div id='divInfoDivisionTrabExcepCapOnline'></div>");
      $("#tdAreaTrabExcepCapOnline"+excepcionCapOnlineId).html("<div id='divInfoAreaTrabExcepCapOnline'></div>");
      $("#tdPuestoTrabExcepCapOnline"+excepcionCapOnlineId).html("<div id='divInfoPuestoTrabExcepCapOnline'></div>");
		
      $("#tdmotivo"+excepcionCapOnlineId).html(
         "<input type='text' id='inputMotivoExcepcion' class='form-control'>" +
         "<span style='float:right;color:white;font-weight:bold;'>(opcional)</span>");
      $("#inputMotivoExcepcion").val(excepcionCapOnlineObj.motivoExcepcion);
      
      $("#tdFecActExcepCapOnline"+excepcionCapOnlineId).html("<label>*Automático</label>");
      
      cambiarSelectTrabExcepcionCapOnline();
	
      $("#btnCancelarExcepcion").show();$("#btnNuevoExcepcion").hide();
      $("#btnSmartUploadExcepcion").hide();$("#btnEliminarExcepcion").show();
      $("#btnGuardarExcepcion").show();$("#btnVolverExcepcionCapOnline").hide();
      
      banderaEdicionExcepcion = true;
   }
}

function nuevoExcepcionCapOnline(){
   if(!banderaEdicionExcepcion){
      formatoCeldaSombreableTabla(false,"tblExcepcionesCapOnline");
      excepcionCapOnlineObj = {idExcepcion: 0,trabajador:{trabajadorId: -1}};
      excepcionCapOnlineId = 0; 
	
      var selTipoExcepcion = crearSelectOneMenu("selTipoExcepcion","cambiarSelectTrabExcepcionCapOnline()",
	 listTipoExcepcion,-1,"id","nombre");
	
      $("#tblExcepcionesCapOnline tbody").prepend(
         "<tr>" + 
	    "<td><label>*Automático</label></td>" +
	    "<td>"+selTipoExcepcion+"</td>" +
	    "<td><div id='divSelectTrabExcepCapOnline'></div></td>" +
	    "<td><div id='divInfoUnidadTrabExcepCapOnline'></div></td>" +
	    "<td><div id='divInfoDivisionTrabExcepCapOnline'></div></td>" +
	    "<td><div id='divInfoAreaTrabExcepCapOnline'></div></td>" +
	    "<td><div id='divInfoPuestoTrabExcepCapOnline'></div></td>" +
	    "<td><input type='text' id='inputMotivoExcepcion' class='form-control'>" +
	        "<span style='float:right;color:blue;font-weight:bold;'>(opcional)</span></td>" +
	    "<td><label>*Automático</label></td>" +
         "</tr>");
	
      cambiarSelectTrabExcepcionCapOnline();
      
      $("#btnCancelarExcepcion").show();$("#btnNuevoExcepcion").hide();
      $("#btnSmartUploadExcepcion").hide();$("#btnEliminarExcepcion").hide();
      $("#btnGuardarExcepcion").show();$("#btnVolverExcepcionCapOnline").hide();
	
      banderaEdicionExcepcion = true;
   }
}

function cambiarSelectTrabExcepcionCapOnline(){
   var tipoExcepIdAux = parseInt($("#selTipoExcepcion").val());
   listTrabExcepcionCapOnlineAux = [];
    
   if(tipoExcepIdAux == 0){
      listTrabPuestosAsigDentro.forEach(function(val){
         if(val.isTomado == 0 || val.trabajadorId == excepcionCapOnlineObj.trabajador.trabajadorId){
            listTrabExcepcionCapOnlineAux.push(val); 
         }  
      });
   }else if(tipoExcepIdAux == 1){
      listTrabPuestosAsigFuera.forEach(function(val){
	 if(val.isTomado == 0 || val.trabajadorId == excepcionCapOnlineObj.trabajador.trabajadorId){
	    listTrabExcepcionCapOnlineAux.push(val); 
	 }  
      }); 
   }
   
   var contenidoDivAux = "";
   
   if(tipoExcepIdAux != -1 && listTrabExcepcionCapOnlineAux.length != 0){
      contenidoDivAux = "<input class='form-control' id='inputBuscarTrabExcepCapOnline'>" +
          crearSelectOneMenu("slcTrabExcepcion","informacionTrabajadorSeleccionadoExcepCapOnline()",
             listTrabExcepcionCapOnlineAux,excepcionCapOnlineObj.trabajador.trabajadorId,"trabajadorId","nombre") +
         "<label>*Para activar el buscador, debe ingresar 3 caracteres como mínimo (DNI o nombre).</label>";
   }else if(tipoExcepIdAux != -1 && listTrabExcepcionCapOnlineAux.length == 0){
      if(tipoExcepIdAux == 0){
	 contenidoDivAux = "<label>*No hay puestos de trabajo asignados a esta capacitación.</label>";
      }else if(tipoExcepIdAux == 1){
	 contenidoDivAux = "<label>*Se han asignados todos los puestos de trabajo a esta capacitación.</label>"; 
      }
   }else{
      contenidoDivAux = "<label>*Debe seleccionar el tipo de excepción.</label>"; 
   }
   
   $("#divSelectTrabExcepCapOnline").html(contenidoDivAux);
   $("#inputBuscarTrabExcepCapOnline").attr("onkeyup","buscarDisponibleTrabExcepcionCapOnline()");
   $("#divInfoUnidadTrabExcepCapOnline").html("------");
   $("#divInfoDivisionTrabExcepCapOnline").html("------");
   $("#divInfoAreaTrabExcepCapOnline").html("------");
   $("#divInfoPuestoTrabExcepCapOnline").html("------");
      
   if(excepcionCapOnlineId > 0){
      if(tipoExcepIdAux == excepcionCapOnlineObj.tipoExcepcion){
	 $("#inputBuscarTrabExcepCapOnline").val(excepcionCapOnlineObj.trabajador.trabajadorNombre);
	 informacionTrabajadorSeleccionadoExcepCapOnline();
      }
   }
}

var nombreUnidadAux,nombreDivisionAux,nombreAreaAux,nombrePuestoAux;

function buscarDisponibleTrabExcepcionCapOnline(){
   var trabExcepCapOnlineAux = $("#inputBuscarTrabExcepCapOnline").val().toUpperCase().trim();
   var encontrado = 0;
   
   nombreUnidadAux = "------",nombreDivisionAux = "------",nombreAreaAux = "------",nombrePuestoAux = "------";
   
   if(trabExcepCapOnlineAux.length >= 3){
      listTrabExcepcionCapOnlineAux.forEach(function(val){
         if(val.nombre.toUpperCase().trim().includes(trabExcepCapOnlineAux) && encontrado == 0){
  	    $("#slcTrabExcepcion").val(val.trabajadorId);
  	    nombreUnidadAux = val.area.matrixName;
  	    nombreDivisionAux = val.area.divisionName;
  	    nombreAreaAux = val.area.areaName;
  	    nombrePuestoAux = val.puesto.positionName;
  	    encontrado++;
         }     
      }); 
   }
     
   if(encontrado == 0){
      $("#slcTrabExcepcion").val(-1); 
   }
     
   $("#divInfoUnidadTrabExcepCapOnline").html(nombreUnidadAux);
   $("#divInfoDivisionTrabExcepCapOnline").html(nombreDivisionAux);
   $("#divInfoAreaTrabExcepCapOnline").html(nombreAreaAux);
   $("#divInfoPuestoTrabExcepCapOnline").html(nombrePuestoAux);
}

function informacionTrabajadorSeleccionadoExcepCapOnline(){
   var trabIdAux = parseInt($("#slcTrabExcepcion").val());
   
   nombreUnidadAux = "------",nombreDivisionAux = "------",nombreAreaAux = "------",nombrePuestoAux = "------";
    
   if(trabIdAux != -1){
      listTrabExcepcionCapOnlineAux.forEach(function(val){
         if(trabIdAux == val.trabajadorId){
  	    nombreUnidadAux = val.area.matrixName;
  	    nombreDivisionAux = val.area.divisionName;
  	    nombreAreaAux = val.area.areaName;
  	    nombrePuestoAux = val.puesto.positionName;
         }     
      }); 
   }

   $("#divInfoUnidadTrabExcepCapOnline").html(nombreUnidadAux);
   $("#divInfoDivisionTrabExcepCapOnline").html(nombreDivisionAux);
   $("#divInfoAreaTrabExcepCapOnline").html(nombreAreaAux);
   $("#divInfoPuestoTrabExcepCapOnline").html(nombrePuestoAux);
}

function cancelarExcepcionCapOnline(){
   cargarModalExcepcionesCapOnline();
}

function eliminarExcepcionCapOnline(){
   $("#modalExcepcionesCapOnline").modal("hide");
    
   mensajeUx="<label>¿Está seguro de eliminar la excepción seleccionada?</label>";
   mensajesUx(mensajeUx,3,"","ExcepcionCapOnline");
    
   $("#btnRegresarPrevioExcepcionCapOnline").on("click",function(){
      $("#modalExcepcionesCapOnline").modal("show");
   });
    
   $("#btnDevolverValorExcepcionCapOnline").on("click",function(){
      var dataParam={
         idExcepcion:excepcionCapOnlineId,capacitacion: {capacitacionId:capacitacionId}
      };
	
      callAjaxPost(URL+"/capacitacion/excepcion/delete",dataParam,function(data){
         switch(data.CODE_RESPONSE){
    	    case "05":
    	       $("#modalExcepcionesCapOnline").modal("hide");
    	       mensajeUx = "<label>Se ha eliminado correctamente la excepción.</label>";
    	       mensajesUx(mensajeUx,1,"","ExcepcionCapOnline"); 
    	       
    	       $("#modalMensajeUxExcepcionCapOnline").on("hidden.bs.modal",function(){
    		  actualizarPrincipalCap = 1;
    		  $("#modalExcepcionesCapOnline").modal("show");
    		  cargarModalExcepcionesCapOnline();
    	       });
    	       
    	       break;
    	    		
    	    default:
    	       alert("¡Ocurrió un error al eliminar la excepción!");
         }
      });
   });
}

function guardarExcepcionCapOnline(){
   var campoVacio = true;
    
   var tipoExcepcion = parseInt($("#selTipoExcepcion").val());
   var trabajadorId = $("#slcTrabExcepcion").val();
   var motivoExcepcionTexto = $("#inputMotivoExcepcion").val();

   if(tipoExcepcion == -1 || trabajadorId == -1){
      campoVacio = false;
   }

   if(campoVacio){
      var dataParam={
	 idExcepcion:excepcionCapOnlineId,capacitacion: {capacitacionId:capacitacionId},trabajador: {trabajadorId:trabajadorId},
	 tipoExcepcion:tipoExcepcion,motivoExcepcion:motivoExcepcionTexto
      };
	
      callAjaxPost(URL+'/capacitacion/excepcion/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalExcepcionesCapOnline").modal("hide");
	       mensajeUx="<label>La excepción se ha guardado correctamente.</label>";
	       mensajesUx(mensajeUx,1,"","ExcepcionCapOnline");
	       
	       $("#modalMensajeUxExcepcionCapOnline").on("hidden.bs.modal",function(){
		  actualizarPrincipalCap = 1;
	          $("#modalExcepcionesCapOnline").modal("show");
	          cargarModalExcepcionesCapOnline();
	       });
	       
	       break;
			
	    default:
	       alert("¡Ocurrió un error al guardar la excepción!.");
         }
      });	    
   }else{
      $("#modalExcepcionesCapOnline").modal("hide");
      mensajeUx="<label>Debe completar todos los campos obligatorios.</label>";
      mensajesUx(mensajeUx,2,"","ExcepcionCapOnline");
      
      $("#modalMensajeUxExcepcionCapOnline").on("hidden.bs.modal",function(){
         $("#modalExcepcionesCapOnline").modal("show");
      });
   }
}

function ocultarModalSmartUploadExcepcionCapOnline(){
   $("#modalSmartUploadExcepcionCapOnline").modal("hide");
   $("#modalExcepcionesCapOnline").modal("show");
}

function cargarModalSmartUploadExcepcionCapOnline(){
   $("#modalExcepcionesCapOnline").modal("hide");
   $("#modalSmartUploadExcepcionCapOnline").remove();
    
   var textBackup =
      "<a style='font-size:16px;padding-left:2px' class='efectoLink' " +
         "href='"+URL+"/capacitacion/excepcion/backup' target='_blank'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>";
    
   var listItems=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-download'></i> Plantilla Excel:",inputForm:textBackup},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-info'></i> Archivo Excel:",inputForm:"",divContainer:"divExcelImportExcepciones"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	             "onclick='ocultarModalSmartUploadExcepcionCapOnline()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;'>" +
       		    "<i class='fa fa-floppy-o'></i> Importar" +
       		 "</button>",divContainer:""}
   ];
                 
   var textImportExcepcion = "";
                 
   listItems.forEach(function(valx,index){
      textImportExcepcion += obtenerSubPanelModuloVersionDos(valx);
   });
                 
   var opciones={
      id:"modalSmartUploadExcepcionCapOnline",nombre:"Actualizar Excepciones (Import)",clase: "listaAuxiliar",
      contenido:"<form id='formImportCapOnline' class='eventoGeneral'>"+textImportExcepcion+"</form>"
   };	
                 
   crearModalPrincipalUsuario(opciones,function(){},true,true);
                 
   var opcionesImport={
      container: "#divExcelImportExcepciones",
      functionCall: function(){
         validacionSubirEvidencia("ImportExcelExcepcion",bitsEvidenciaActoInseguro,"modalSmartUploadExcepcionCapOnline"); 
      },descargaUrl: "",esNuevo: true,idAux: "ImportExcelExcepcion",evidenciaNombre: ""
   };
    
   crearFormEvidenciaCompleta(opcionesImport);
                 
   $("#formImportCapOnline").on("submit",function(e){
      e.preventDefault();
      enviarExcelImportExcepcionCapOnline();
   });
}

function enviarExcelImportExcepcionCapOnline(){
   var campoVacio = true;
   
   var nombreExcel = $("#inputEviImportExcelExcepcion").val();
   
   if(nombreExcel.length == 0){
      campoVacio = false;
      mensajeUx="<label>No se ha subido ningún archivo Excel.</label>";
   }else if(nombreExcel == "VOLVER A SUBIR"){
      campoVacio = false;
      mensajeUx="<label>Debe volver a subir el archivo excel.</label>";
   }

   if(campoVacio){
      guardarEvidenciaAuto(0,"fileEviImportExcelExcepcion",bitsEvidenciaActoInseguro,
      "/capacitacion/excepcion/excel/masivo/save",function(data){
         $("#modalSmartUploadExcepcionCapOnline").modal("hide");
             
	 mensajeUx="<label style='text-align:left;word-break:break-all;'>"+data.mensaje+"</label>";
	 mensajesUx(mensajeUx,4,"","ActualizarVistaModExcepciones");
	    
	 $("#modalMensajeUxActualizarVistaModExcepciones").on("hidden.bs.modal",function(){
	    $("#modalExcepcionesCapOnline").modal("show");
	    cargarModalExcepcionesCapOnline();
	 });
      },"id",[
         {id:"capacitacionId",value:capacitacionId},{id:"empresaId",value:getSession("gestopcompanyid")}
      ]);
   }else{
      $("#modalSmartUploadExcepcionCapOnline").modal("hide");
      
      mensajesUx(mensajeUx,2,"","AvisoExcepcionCapOnlineImport");
      
      $("#modalMensajeUxAvisoExcepcionCapOnlineImport").on("hidden.bs.modal",function(){
         $("#modalSmartUploadExcepcionCapOnline").modal("show");
      });
   }
}
