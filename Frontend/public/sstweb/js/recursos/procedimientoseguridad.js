var banderaEdicion;
var procedimientoSeguridadObj;
var procedimientoSeguridadId;
var procedimientoSeguridadFecha;
var procedimientoSeguridadFechaProx;
var contador2 = 0;
var procEstado;
var procEstadoNombre;
var listFullProcedimiento;
var listTiposVigencia = [];
var listCategoriasProcedimientos = [];
var listTrabajadores;
var listanombretab;
var userAgent = isMobile.any();
$(document).ready(function() {
	insertMenu();
	cargarPrimerEstado();
});
var columnasOcultar=[4];
var columnasUltimasOcultar=[1,2,3,4,5];
var columnasBodyOcultar=[4,5,6,7,8,9];
var fechaProximaActualizacion
var versionActiva={};
var estadoDocumentoNombre;
var estadoDocumentoId;
var mensajeUx;

function cargarPrimerEstado(){
   var valorResize = 170;
   resizeDivWrapper("wrapper",valorResize);
    
   banderaEdicion = false;
   procedimientoSeguridadId = 0;
   procedimientoSeguridadFecha=null;

   removerBotones();
   crearBotones();
   deshabilitarBotonesEdicion();
	
   $("#fsBotones").append(
      "<button id='btnClipTabla' type='button' class='btn btn-success' title='Tabla Clipboard'>" +
         "<i class='fa fa-clipboard fa-2x'></i>" + 
      "</button>");
	
   $("#fsBotones").append(
      "<button id='btnProcSugerido' type='button' class='btn btn-success' title='Documentos Sugeridos'>" +
         "<i class='fa fa-folder-open-o fa-2x'></i>" + 
      "</button>");
	
   $("#btnUpload").attr("onclick", "javascript:importarDatos();");
   $("#btnNuevo").attr("onclick", "javascript:nuevoProcedimientoSeguridad();");
   $("#btnCancelar").attr("onclick", "javascript:cancelarProcedimientoSeguridad();");
   $("#btnGuardar").attr("onclick", "javascript:guardarProcedimientoSeguridad();");
   $("#btnEliminar").attr("onclick", "javascript:eliminarProcedimientoSeguridad();");
   $("#btnImportar").attr("onclick", "javascript:importarDatos();");
   $("#btnProcSugerido").attr("onclick", "javascript:verProcedimientoSugerido();");
	
   $("#btnClipTabla").on("click",function(){
      new Clipboard('#btnClipTabla',{
	 text: function(trigger){
		  return obtenerDatosTablaEstandar("tblProSeg")
	       }
      });
		
      alert("Se han guardado al clipboard la tabla de este módulo" );
   });
	
   var dataParam={
      idCompany: sessionStorage.getItem("gestopcompanyid")
   };

   callAjaxPost(URL+'/procedimientoseguridad',dataParam,procesarDataDescargadaPrimerEstado);
	 
   callAjaxPost(URL+'/accidente/trab',dataParam,function(data){
      switch(data.CODE_RESPONSE){
	 case "05":
	    listTrabajadores = data.listDniNombre;
	    break;
				
	 default:
	    alert("Ocurrió un error al traer los trabajadores!");
      }

      listanombretab = listarStringsDesdeArray(listTrabajadores,"nombre");
   },function(){});
}

function procesarDataDescargadaPrimerEstado(data) {	
   switch(data.CODE_RESPONSE){
      case "05":
	 var list = data.list;
	 listFullProcedimiento=list;
	 listTiposVigencia=data.listTiposVigencia;
	 listCategoriasProcedimientos = data.categorias;
	  
	 $("#h2Titulo").html(
            "<a onclick='javascript:cargarPrimerEstado();' href='#'>Documentos de Seguridad</a>");
		
	 $("#tblProSeg tbody tr").remove();
		
	 list.forEach(function(val,index){   
	    versionActiva={
	       descripcion: "",responsable: "",fechaActualizacionTexto: "",
	       horaPlanificadaTexto: "",fechaPlanificadaTexto: "",evidenciaNombre: ""
	    };
	     
	    if(val.versiones[0]){
	       versionActiva = val.versiones[0];
	    }
	     
	    var visualizarEnIperc = (val.visualizarEnIperc == 1?"Sí":"No");
			
	    $("#tblProSeg tbody").append(
	       "<tr id='tr"+val.procedimientoSeguridadId+"' onclick='javascript:editarProcedimientoSeguridad("+index+")'>" +
	          "<td id='tdcod"+val.procedimientoSeguridadId+"'>"+val.procedimientoSeguridadCodigo+"</td>" +
	          "<td id='tdnom"+val.procedimientoSeguridadId+"'>"+val.procedimientoSeguridadNombre+"</td>" +
		  "<td id='tdcatn"+val.procedimientoSeguridadId+"'>"+val.categoriaDocumento.nombre+"</td>" +
		  "<td id='tdres"+val.procedimientoSeguridadId+"' style='word-break: break-all;'>"+val.procedimientoSeguridadResumen+"</td>" +
		  "<td id='tdfecproact"+val.procedimientoSeguridadId+"'>"+val.vigencia.nombre+"</td>" +
		  "<td id='tdeditarver"+val.procedimientoSeguridadId+"'><strong>(Seleccionar fila)</strong></td>" +
	          "<td id='tdvers"+val.procedimientoSeguridadId+"'>"+versionActiva.descripcion+"</td>" +
		  "<td id='tdrespon"+val.procedimientoSeguridadId+"' style='word-break: break-all;'>" +
		      versionActiva.responsable+"</td>" +
		  "<td id='tdfap"+val.procedimientoSeguridadId+"'>" +
		      versionActiva.fechaPlanificadaTexto+"</td>" +
//	          "<td id='tdhap"+val.procedimientoSeguridadId+"'>" +
//		      versionActiva.horaPlanificadaTexto+"</td>" +
		  "<td id='tdfaar"+val.procedimientoSeguridadId+"'>" +
	              versionActiva.fechaActualizacionTexto+"</td>" +
	          "<td id='tdfar"+val.procedimientoSeguridadId+"'>"+val.fechaActualizacionTexto+"</td>" +
		  "<td id='tdmodif"+val.procedimientoSeguridadId+"'>"+versionActiva.modificacion+"</td>" +
	          "<td id='tdevipro"+val.procedimientoSeguridadId+"' style='word-break: break-all;'>" +
		      versionActiva.evidenciaNombre+"</td>" +
	          "<td id='tdestdoc"+val.procedimientoSeguridadId+"'>"+val.estadoDocumento.nombre+"</td>" +
	          "<td id='tdasig"+val.procedimientoSeguridadId+"'>"+val.numPuestosAsociados+"</td>" +
	          "<td id='tdSitesAsig"+val.procedimientoSeguridadId+"'>"+val.numSitesAsociados+"</td>" +
	          "<td id='tdContratistasAsig"+val.procedimientoSeguridadId+"'>"+val.numContratistasAsociados+"</td>" +
	          "<td id='tdexcep"+val.procedimientoSeguridadId+"'>"+val.numExcepciones+"</td>" +
		  "<td id='tdvisenipercproseg"+val.procedimientoSeguridadId+"'>"+visualizarEnIperc+"</td>" +  
	       "</tr>");
	 });
		 
	 if(getSession("accesoUsuarios") == 1){
	    $("#btnProcSugerido").show();
	 }else{
	    $("#btnProcSugerido").hide();
	     
	    columnasOcultar.forEach(function(val){
	       $('#tblProSeg thead tr:first td:nth-child('+val+'),#tblProSeg thead tr:first th:nth-child('+val+')').hide();
	    });
				
	    columnasUltimasOcultar.forEach(function(val){
	       $('#tblProSeg thead tr:last td:nth-child('+val+'),#tblProSeg thead tr:last th:nth-child('+val+')').hide();
	    });
				
	    columnasBodyOcultar.forEach(function(val){
	       $('#tblProSeg tbody  td:nth-child('+val+'),#tblProSeg tbody th:nth-child('+val+')').hide();
	    });
				
	    $('#tblProSeg thead tr:first td:nth-child('+5+'),#tblProSeg thead tr:first th:nth-child('+5+')').attr("colspan","1");
	 }
		
	 formatoCeldaSombreableTabla(true,"tblProSeg");
	 completarBarraCarga();
		
	 if(getSession("linkCalendarioProcedimmientoId") != null){    
	    listFullProcedimiento.every(function(val,index3){		
	       if(val.procedimientoSeguridadId==parseInt(getSession("linkCalendarioProcedimmientoId"))){
		  editarProcedimientoSeguridad(index3);			
		  sessionStorage.removeItem("linkCalendarioProcedimmientoId");
		  return false;
	       }else{
		  return true;
	       }
	    });
	 }
	 break;
	  
      default:
	 alert("Ocurrió un error al traer los procedimientos de Seguridad!");
   }
   
   goheadfixedY("#tblProSeg","#wrapper");
}

function editarProcedimientoSeguridad(pindex){
   if(!banderaEdicion){
      versionActiva={
	 responsable:"",fechaActualizacionTexto:"",
	 horaPlanificadaTexto:"",fechaPlanificadaTexto:"",evidenciaNombre:""			
      };
      
      if(listFullProcedimiento[pindex].versiones[0]){
         versionActiva = listFullProcedimiento[pindex].versiones[0];
      }
		
      procedimientoSeguridadObj = listFullProcedimiento[pindex];
		
      procedimientoSeguridadId = listFullProcedimiento[pindex].procedimientoSeguridadId;
      procedimientoSeguridadFecha = listFullProcedimiento[pindex].procedimientoSeguridadFecha;
      procedimientoSeguridadFechaProx=listFullProcedimiento[pindex].fechaActualizacion;

      var selCategoriaProc = crearSelectOneMenuOblig("selCategoriaProc", "",listCategoriasProcedimientos,
	                                             procedimientoSeguridadObj.categoriaDocumento.id, "id", "nombre");
      $("#tdcatn"+procedimientoSeguridadId).html(selCategoriaProc);
		
      var vigenciaId=listFullProcedimiento[pindex].vigencia.id;
		
      $("#tr"+procedimientoSeguridadId).addClass("fila-edicion");
		
      var horaPlanificada=listFullProcedimiento[pindex].horaPlanificada;
      
      $("#tdasig"+procedimientoSeguridadId).html(
         "<a onclick='verPuestosRecurso("+4+","+pindex+")' class='efectoLink'>" +
	    "<i class='fa fa-list'></i> "+listFullProcedimiento[pindex].numPuestosAsociados +
	 "</a>");
      
      $("#tdexcep"+procedimientoSeguridadId).html(
         "<a onclick='cargarModalExcepcionesProcSeg()' class='efectoLink'>" +
	    "<i class='fa fa-list'></i> "+listFullProcedimiento[pindex].numExcepciones +
	 "</a>");
		
      formatoCeldaSombreable(false);$("#btnClipTabla").hide();
		
      var name = $("#tdnom" + procedimientoSeguridadId).text();
      $("#tdnom" + procedimientoSeguridadId)
         .html("<input type='text' id='inputNom' class='form-control' placeholder='Documentos Seguridad' " +
         	      "autofocus='true' ' value='"+name+"'>");
		
      var codigo = $("#tdcod" + procedimientoSeguridadId).text();
      $("#tdcod" + procedimientoSeguridadId)
         .html("<input type='text' id='inputCod' class='form-control' placeholder='Codigo' " +
         	      "autofocus='true' ' value='"+codigo+"'>");
      
      $("#tdres"+procedimientoSeguridadId).html("<textarea id='textResumenProcSeg' class='form-control' rows='5'></textarea>");
      $("#textResumenProcSeg").val(procedimientoSeguridadObj.procedimientoSeguridadResumen);
		
      var fechaRealAux= versionActiva.fechaActualizacionTexto;
      //console.log(versionActiva);
      //console.log(fechaRealAux);
		
      var selTipoVig = crearSelectOneMenu("selTipoVig", "hallarProxFechaActualizacion("+procedimientoSeguridadId+")",
			                             listTiposVigencia,vigenciaId,"id","nombre");
      $("#tdfecproact" + procedimientoSeguridadId).html(selTipoVig);
	
      /*$("#tdfar" + procedimientoSeguridadId)
        .html("<input type='date' id='inputFecProx' onchange='hallarEstadoImplementacion("+procedimientoSeguridadId+");'  class='form-control'>");
      */
      var today = convertirFechaInput(procedimientoSeguridadFechaProx);
//      $("#tdvers" + procedimientoSeguridadId)
//         .html("<a onclick='verVersionesProcedimiento()'>"+listFullProcedimiento[pindex].versiones.length+"</a>");
      $("#inputFecProx").val(today);
      
      //
      $("#tdeditarver"+procedimientoSeguridadId)
      .html("<button type='button' class='btn btn-success' style='margin-right:10px'" +
                   " onclick='verVersionesProcedimiento()' title='Añadir / Editar las versiones asociadas a este registro.'>" +
               "<i class='fa fa-pencil-square-o fa-2x'></i>" +
            "</button>");
      
      //
      var idUltimaVersion=null;
      if(listFullProcedimiento[pindex].versiones[0]){
         idUltimaVersion=listFullProcedimiento[pindex].versiones[0].id;
      }

      var nombreEvidencia = $("#tdevipro" + procedimientoSeguridadId).text();
		
      hallarProxFechaActualizacion(procedimientoSeguridadId);
		
      /* ****** */
      var verifVisualizacion = procedimientoSeguridadObj.visualizarEnIperc;
      var textoVisualizacionEnIperc = (verifVisualizacion == 1?"checked":"");
		 	  
      $("#tdvisenipercproseg"+procedimientoSeguridadId).html(
         "<input type='checkbox' id='checkVisEnIpercProSeg' class='form-control' "+textoVisualizacionEnIperc+">");
      /* ****** */
      $("#tdSitesAsig"+procedimientoSeguridadId).html(
         "<a onclick='verSitesRecursoAsignacion("+4+","+pindex+")' class='efectoLink'>" +
	    "<i class='fa fa-list'></i> "+procedimientoSeguridadObj.numSitesAsociados +
	 "</a>");
	
      $("#tdContratistasAsig"+procedimientoSeguridadId).html(
         "<a onclick='verContratistasRecursoAsignacion("+4+","+pindex+")' class='efectoLink'>" +
	    "<i class='fa fa-list'></i> "+procedimientoSeguridadObj.numContratistasAsociados +
	 "</a>");
      
      var options={
	    container:"#tdevipro" + procedimientoSeguridadId,
	    functionCall:function(){ },
	    descargaUrl:"/procedimientoseguridad/version/evidencia?versionId="+idUltimaVersion,
	    esNuevo:false,
	    idAux:"Documento",
	    evidenciaNombre:nombreEvidencia
		  };
	
      crearFormEvidenciaCompleta(options);
      $("#fileEviDocumento").parent("span").remove();
      banderaEdicion = true;
      habilitarBotonesEdicion();
      $("#btnProcSugerido").hide();
   }
}

function nuevoProcedimientoSeguridad(){	
   fechaProximaActualizacion = "";
    
   if(!banderaEdicion){
      var selTipoVig = crearSelectOneMenu("selTipoVig","",listTiposVigencia,
	 "-1","id","nombre");

      var selCategoriaProc = crearSelectOneMenuOblig("selCategoriaProc","",
	 listCategoriasProcedimientos,"","id","nombre");

      $("#tblProSeg tbody:first").append(
         "<tr id='0'>" +
            "<td><input type='text' id='inputCod' placeholder='Codigo' " +
                       "class='form-control' autofocus='true'></td>" +		
	    "<td><input type='text' id='inputNom' class='form-control' " +
	               "placeholder='procedimiento Seguridad' required='true'></td>" +
	    "<td>"+selCategoriaProc+"</td>" +
	    "<td>"+"<textarea id='textResumenProcSeg' class='form-control' rows='5'></textarea>"+"</td>" +
            "<td>"+selTipoVig+"</td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
            "<td>...</td>" +
	    "<td>...</td>" +
//          "<td>...</td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
	    "<td id='inputeviDocumento'>...</td>" + 
	    "<td>...</td>" +
            "<td>...</td>" +
            "<td>...</td>" +
            "<td>...</td>" +
            "<td>...</td>" +
            "<td><input type='checkbox' id='checkVisEnIpercProSeg' class='form-control'></td>" +
         "</tr>");
       
       if(getSession("accesoUsuarios") == 1){
          $("#btnProcSugerido").show();
       }else{
	  $("#btnProcSugerido").hide();
	  
	  columnasOcultar.forEach(function(val){
	     $('#tblProSeg thead tr:first td:nth-child('+val+'),#tblProSeg thead tr:first th:nth-child('+val+')').hide();
	  });
				
	  columnasUltimasOcultar.forEach(function(val){
	     $('#tblProSeg thead tr:last td:nth-child('+val+'),#tblProSeg thead tr:last th:nth-child('+val+')').hide();
	  });
				
	  columnasBodyOcultar.forEach(function(val){
	     $('#tblProSeg tbody  td:nth-child('+val+'),#tblProSeg tbody th:nth-child('+val+')').hide();
	  });
				
	  $('#tblProSeg thead tr:first td:nth-child('+5+'),#tblProSeg thead tr:first th:nth-child('+5+')').attr("colspan","1");
       }
		
       formatoCeldaSombreableTabla(false,"tblProSeg");
       llevarTablaFondo("wrapper");
       procedimientoSeguridadId = 0;
       habilitarBotonesNuevo();
       $("#btnClipTabla").hide();$("#btnProcSugerido").hide();
       banderaEdicion = true;
	
   }else{
      alert("Guarde primero.");
   }
}

function cancelarProcedimientoSeguridad(){
   cargarPrimerEstado();
}

function eliminarProcedimientoSeguridad(){
   var r = confirm("¿Está seguro de eliminar la procedimientoSeguridad?");
	
   if(r == true){
      var dataParam={
	 procedimientoSeguridadId: procedimientoSeguridadId,
      };

      callAjaxPost(URL+'/procedimientoseguridad/delete',dataParam,
         procesarResultadoEliminarprocedimientoSeguridad);
   }
}

function procesarResultadoEliminarprocedimientoSeguridad(data) {
   switch (data.CODE_RESPONSE) {
      case "05":
         cargarPrimerEstado();
         break;
	
      default:
         alert("Verificar que el Documento de Seguridad no tenga versiones " +
            "asociadas, y no este asignado a puestos de trabajo");
   }
}

function guardarProcedimientoSeguridad(){
   hallarProxFechaActualizacion(procedimientoSeguridadId);

   var campoVacio = true;
   var inputNom = $("#inputNom").val();
   var codigo = $("#inputCod").val();
   var resumen = $("#textResumenProcSeg").val();
   var selTipoVig = $("#selTipoVig").val();
   var inputFecProx = convertirFechaTexto(fechaProximaActualizacion);
   var categoriaId = $("#selCategoriaProc").val();
   
   if(selTipoVig == -1){
      selTipoVig = 6;
      inputFecProx = null
   }
	
   if(inputFecProx == ""){
      inputFecProx = null;
   }

   if(codigo.length == 0 || resumen.length == 0 || inputNom.length == 0){
      campoVacio = false;
   }
   //hallarEstadoImplementacion(procedimientoSeguridadId);
   var visEnIperc = ($("#checkVisEnIpercProSeg").prop("checked")?1:0);
   
   if(campoVacio){
      var dataParam={
	 procedimientoSeguridadId: procedimientoSeguridadId,
	 categoriaDocumento: {id: categoriaId},
	 procedimientoSeguridadNombre: inputNom,
	 procedimientoSeguridadResumen: resumen,
	 procedimientoSeguridadCodigo: codigo,
	 fechaActualizacion: inputFecProx,
	 vigencia: {id: selTipoVig},
	 estadoDocumento: {id: estadoDocumentoId},
	 idCompany: getSession("gestopcompanyid"),
	 visualizarEnIperc: visEnIperc
      };

      callAjaxPost(URL+'/procedimientoseguridad/save',dataParam,
         procesarResultadoGuardarProSeg);
   }else{
      alert("Debe ingresar todos los campos.");
   }
}

function procesarResultadoGuardarProSeg(data){
   switch(data.CODE_RESPONSE){
      case "05":
         mensajeUx="<label>El documento de seguridad fue registrado con éxito.</label>";
         mensajesUx(mensajeUx,1,"","ActualizarVistaAdmDocSeg");
		    
         $("#modalMensajeUxActualizarVistaAdmDocSeg").on("hidden.bs.modal",function(){
            cargarPrimerEstado();
         });
         break;
	
      default:
         alert("Ocurrió un error al guardar la procedimientoSeguridad!");
   }
}

function mostrarCargarImagen(procedimientoId) {
	$('#mdUpload').modal('show');
	$('#btnUploadArchivo').attr("onclick",
			"javascript:uploadArchivo(" + procedimientoId + ");");
}

function uploadArchivo(procedimientoId) {
	$.blockUI({
		message : 'cargando...'
	});
	guardarEvidenciaAuto(procedimientoId,"fileEvi",bitsEvidenciaProcedimiento,
			"/procedimientoseguridad/evidencia/save",function(){
		$.unblockUI();
		$('#mdUpload').modal('hide');
	},"procedimientoId");
 
}

function importarDatos() {
	$("#btnGuardarNuevos").attr("onclick",
			"javascript:guardarMasivoCopiaExcel();");

	$('#mdImpDatos').modal('show');
	
}
function guardarMasivoCopiaExcel() {
	var texto = $("#txtListado").val();
	var listExcel = texto.split('\n');
	var listRecurso = [];
	var listProcRepe = [];
	var listFullNombres = "";
	var validado = "";
	if (texto.length < 10000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];
			if (filaTexto.trim().length < 1) {
				validado = "Existen filas vacias.";
				break;
			}

			if (validado.length < 1 && listCells.length != 4) {
				validado = "No coincide el numero de celdas. ("
						+ listCells.length+"!=4 )";
				break;
			} else {
				var recurs = {};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						
						recurs.procedimientoSeguridadCodigo = element.trim();
					
						}
					if (j === 1) {
						recurs.procedimientoSeguridadNombre = element.trim();
						if ($.inArray(recurs.procedimientoSeguridadNombre, listProcRepe) === -1) {
							listProcRepe.push(recurs.procedimientoSeguridadNombre);
						} else {
							listFullNombres = listFullNombres + recurs.procedimientoSeguridadNombre + ", ";
						}

					}
					
					if (j === 2) {
						
						recurs.procedimientoSeguridadResumen = element.trim();
					
				}
					
					
					if (j === 3) {
						recurs.version = element.trim();
						
					}
					var hoy=new Date();
					recurs.horaPlanificada="10:00:00";
					recurs.procedimientoSeguridadFecha=hoy;
					
					 var fFecha = Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate())+(86400000*365); // 86400000 son los milisegundos que tiene un día

					recurs.procedimientoSeguridadFechaProx=fFecha;
					recurs.idCompany = sessionStorage.getItem("gestopcompanyid");
				
				}

				listRecurso.push(recurs);
				if (listProcRepe.length < listRecurso.length) {
					validado = "Existen procedimientos repetidos." + listFullNombres;
					break;
				}
			}
		}
	} else {
		validado = "Ha excedido los 10000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			var dataParam = {
				listRecurso : listRecurso
			};
			console.log(listRecurso);
			callAjaxPost(URL + '/procedimientoseguridad/masivo/save', dataParam,
					function (data) {
				switch (data.CODE_RESPONSE) {
				case "05":
					
						alert("Se guardaron exitosamente.");
						cargarPrimerEstado();
						$('#mdImpDatos').modal('hide');
					
					break;
				default:
					alert("Ocurri&oacute; un error al guardar los proce!");
				}
			});
		}
	} else {
		alert(validado);
	}
}

function verProcedimientoSugerido(){
	$("#modalSugerido").modal("show");
	
	$("#divProc1 table tbody tr").remove();
	$("#divProc2 table tbody tr").remove();
	$("#divProc3 table tbody tr").remove();

	var dataParam = {
		
			idCompany : sessionStorage.getItem("gestopcompanyid")
		};

		 callAjaxPost(URL + '/procedimientoseguridad/sugeridos', dataParam,
		 function(data){
			 if(data.CODE_RESPONSE=="05"){
				 var listSugerida=data.listSugerida;
				
				 listSugerida.forEach(function(val, index){
						$("#divProc"+val.tipoSugeridoId+" table tbody").append(
								"<tr>" +
								"<td>"+val.codigoSugerido+"</td>" +
								"<td>"+val.resumen+"</td>" +
								"<td>"+val.aplicacion+"</td>" +
								"<td>"+val.version+"</td>" +
								"<td>"+val.fechaActualizacion+"</td>" +
								"<td><a href='"
						+ URL
						+ "/procedimientoseguridad/sugerido/evidencia?sugeridoId="
						+ val.id
						+ "' target='_blank'><i class='fa fa-cloud-download fa-2x userLink' aria-hidden='true' " +
								"id='descSugg"+val.id+"' ></i>"+""+"</td>" +
								"</tr>");
					
					}); 
				 
			 }else{
				 console.log("No se pudieron traer los sugeridos")
			 }
		 });
}

function verVersionesProcedimiento(){
   $("#mdVersionProcedimiento").modal("show");
   llamarVersionesProcedimiento();
}

function hallarProxFechaActualizacion(progId){
    if(parseInt(progId) == 0){
	return;
    }
   var frecuenciaRevision=parseInt($("#selTipoVig").val());
   //console.log(frecuenciaRevision);
   //console.log(versionActiva.fechaActualizacionTexto);
   var fechaActTexto = versionActiva.fechaActualizacionTexto;
       
   var fechaReal= fechaActTexto.split('-').reverse().join('-');
   //console.log(fechaReal);
   //console.log(fechaReal.split('-').reverse().join('-'));
   console.log($("#selTipoVig").val());
   
   var fechaHoy=obtenerFechaActual();
   
   if(fechaReal!=''){
      if($("#selTipoVig").val() != -1){
      switch(frecuenciaRevision){
         case 1:
            fechaProximaActualizacion = sumaFechaDias(30,fechaReal);
	 break;
	 case 2:
	    fechaProximaActualizacion = sumaFechaDias(90,fechaReal);
	 break;
	 case 3:
	    fechaProximaActualizacion = sumaFechaDias(180,fechaReal);
	 break;
	 case 4:
	    fechaProximaActualizacion = sumaFechaDias(360,fechaReal);
	 break;
	 case 5:
	    fechaProximaActualizacion = sumaFechaDias(720,fechaReal);
	 break;
	 case 7:
            fechaProximaActualizacion = sumaFechaDias(7200,fechaReal);
         break;
       }
      
      var dif=restaFechas(fechaProximaActualizacion,fechaHoy)
      
      if(dif<0 || dif==0){
	 estadoDocumentoId=2; 
	 estadoDocumentoNombre = "Actualizado";
	 $("#tdfar"+progId).html(fechaProximaActualizacion.split('-').reverse().join('-'));
	 $("#tdestdoc"+progId).html(estadoDocumentoNombre);
      }else{
	 estadoDocumentoId=3; 
	 estadoDocumentoNombre = "Desfasado";
	 $("#tdfar"+progId).html(fechaProximaActualizacion.split('-').reverse().join('-'));
	 $("#tdestdoc"+progId).html(estadoDocumentoNombre);
      }
    }else{
       estadoDocumentoId=1; 
       estadoDocumentoNombre = "Pendiente";	
       $("#tdfar"+progId).html("");
       $("#tdestdoc"+progId).html(estadoDocumentoNombre);
    }
      
   //console.log(fechaProximaActualizacion.split('-').reverse().join('-'));
   //console.log(estadoDocumentoNombre);
      
   }	
} 

