
var listSolicitudesRegistroProyTotal=[],listSolicitudesRegistroProyTotalBuscador=[];
var listEvaluacionSolRegProyTotal = [];
var listEstadosEvalIdSolRegProyTotal = [];
var busquedaActivaSolRegProyTotal,numPaginaActualSolRegProyTotal,solRegProyTotalObj,banderaEdicionSolRegProyTotal,actPrincipalProy;
var empAuxSolRegProyTotalObj = {};

function ocultarConsolidadoSolicitudRegistroProyecto(){
   $("#modalConsolidadoSolRegProyTotal").modal("hide");
   
    if(actPrincipalProy == 1){
	cargarProyectosSeguridad();
    }
}

function verConsolidadoSolicitudRegistroProyecto(){
   $("#modalConsolidadoSolRegProyTotal").remove();actPrincipalProy = 0;
    
   var contenido = "";
   
   var buttonOcultar =
      "<button id='btnOcultarSolRegProy' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='ocultarConsolidadoSolicitudRegistroProyecto()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonCancelar =
      "<button id='btnCancelarSolRegProy' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='cargarConsolidadoSolicitudRegistroProyecto()' title='Cancelar'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardarSolRegProy' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarConsolidadoSolicitudRegistroProyecto()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonEliminar = 
       "<button id='btnEliminarSolRegProy' type='button' class='btn btn-danger' style='margin-right:5px' " +
               "title='Eliminar.' onclick='eliminarConsolidadoSolicitudRegistroProyecto()'>" +
           "<i class='fa fa-times fa-2x'></i>" +
       "</button>";
   
   var buttonFiltro =
       "<button id='btnFiltroSolRegProy' type='button' class='btn btn-success' style='margin-right:5px' " +
               "onclick='verFiltroConsolidadoSolicitudRegistroProyecto()' title='Ver filtro.'>" +
          "<i class='fa fa-filter fa-2x'></i>" +
       "</button>";
      
   var buttonFlechas = 
      "<span id='indicadorPaginaParcialAuxSolRegProy' style='margin:5px;margin-top:10px;'>" +
         "<a id='flechaIzquierdaSolRegProy'><img src='../imagenes/flecha_01.png' /></a>" +
	    " <em id='labelFlechasSolRegProy'></em> " +
	 "<a id='flechaDerechaSolRegProy'><img src='../imagenes/flecha_02.png' /></a>" +
      "</span>";
   
   var buscadorOpciones = 
      "<button id='btnResetBuscadorSolRegProy' type='button' class='btn btn-success' " +
              "title='Refresh' onclick='reiniciarBuscadorSolicitudRegistroProyectoTotal()' style='float:right;'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button id='btnAplicarBuscadorSolRegProy' type='button' class='btn btn-success' " +
              "onclick='aplicarBuscadorSolicitudRegistroProyectoTotal()' style='float:right;margin-right:5px;' " +
              "title='Buscar los registros cuyo código, contratista o título de la solicitud registro proyecto coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input id='valBuscarValorSolRegProy' placeholder='Código, contratista o título' class='form-control' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";
   
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoSolRegProyTotal",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-table'></i> Consolidado Solicitud registro de proyecto",
      contenido: 
	 "<form class='form-inline'>" +
	     buttonOcultar+buttonCancelar+buttonGuardar+buttonEliminar+buttonFiltro+buttonFlechas+buscadorOpciones +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoSolRegProy'>" +
            "<table id='tblConsolidadoSolRegProy' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	           "<tr>" +
	               "<td class='tb-acc' style='width:150px'>Código</td>" +
	               "<td class='tb-acc' style='width:300px'>Contratista</td>" +
                       "<td class='tb-acc' style='width:500px'>Detalle</td>" +
                       "<td class='tb-acc' style='width:100px'>¿Aprobación automática?</td>" +
                       "<td class='tb-acc' style='width:200px'>Evaluación</td>" +
                       "<td class='tb-acc' style='width:400px'>Última observación de la evaluación registrada</td>" +
                       "<td class='tb-acc' style='width:200px'>Evaluado el</td>" +
                   "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoSolRegProy",190);
   crearFiltroConsolidadoSolicitudRegistroProyecto();
   
   $("#flechaIzquierdaSolRegProy").on('click',function(){
      numPaginaActualSolRegProyTotal = numPaginaActualSolRegProyTotal-1;
      cambiarPaginaSolicitudRegistroProyectoTotal();
   });
	 
   $('#flechaDerechaSolRegProy').on('click',function(){
      numPaginaActualSolRegProyTotal = numPaginaActualSolRegProyTotal+1;
      cambiarPaginaSolicitudRegistroProyectoTotal();
   });
}

function ocultarFiltroConsolidadoSolicitudRegistroProyecto(){
    $("#modalFiltroConsolidadoSolRegProyTotal").modal("hide");$("#modalConsolidadoSolRegProyTotal").modal("show");
}

function verFiltroConsolidadoSolicitudRegistroProyecto(){
    $("#modalConsolidadoSolRegProyTotal").modal("hide");$("#modalFiltroConsolidadoSolRegProyTotal").modal("show");
}

function crearFiltroConsolidadoSolicitudRegistroProyecto(){
    $("#modalConsolidadoSolRegProyTotal").modal("hide");$("#modalFiltroConsolidadoSolRegProyTotal").remove();
    
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    }; 
	  		
    callAjaxPost(URL+'/contratista/solicitud_registro_proyecto/vista_admin/filtro',dataParam,function(data){
	listEvaluacionSolRegProyTotal = data.listEvaluacion;empAuxSolRegProyTotalObj = data.registroConfigGenEmp;
	
        var contenido = "";
  				
        var listContenido=[
  	    {sugerencia:"",label:"Fecha de registro - Inicio",inputForm:"<input type='date' id='fechaInicioFiltroSolRegProyTotal' class='form-control'>"},
  	    {sugerencia:"",label:"Fecha de registro - Fin",inputForm:"<input type='date' id='fechaFinFiltroSolRegProyTotal' class='form-control'>"},
  	    {sugerencia:"",label:"",inputForm:"",divContainer:""},
  	    {sugerencia:"",label:"Estado de la evaluación",inputForm:"",divContainer:"divFiltroEstadosEvalSolRegProyTotal"},
  	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  	    {sugerencia:"",
             label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		   "onclick='ocultarFiltroConsolidadoSolicitudRegistroProyecto()'>" +
               	       "<i class='fa fa-times'></i> Cancelar" +
               	   "</button>",
  	     inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' " +
  	      		       "onclick='valoresFiltroConsolidadoSolicitudRegistroProyecto()'>" +
  	                   "<i class='fa fa-filter'></i> Aplicar filtro" +
  	               "</button>"},
        ]; 
  				
        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
        });
   
  		
        var modalOptions={
            id:"modalFiltroConsolidadoSolRegProyTotal",nombre:"<i class='fa fa-filter'></i> Filtro - Solicitud registro de proyecto",
  	    contenido:"<div class='eventoGeneral'>"+contenido+"</div>",btnCerrarHabilitado:0
        };
  				
        crearModalPrincipalUsuario(modalOptions,function(){
	    if($("#filtroEstadosEvalSolRegProyTotal").length > 0){
	        return;
	    }
	                   
	    crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvalSolRegProyTotal","",listEvaluacionSolRegProyTotal,
		"id","nombre","#divFiltroEstadosEvalSolRegProyTotal","Todos");
        },true,true);
   
        var hoy = getSession("fechaHoyOrdenInversoTexto");
   
        $("#fechaInicioFiltroSolRegProyTotal").val(sumaFechaDias(-180,hoy));$("#fechaFinFiltroSolRegProyTotal").val(sumaFechaDias(30,hoy));
  				
        valoresFiltroConsolidadoSolicitudRegistroProyecto();
    });
}

function valoresFiltroConsolidadoSolicitudRegistroProyecto(){
    ocultarFiltroConsolidadoSolicitudRegistroProyecto(); 
    
    if($("#fechaInicioFiltroSolRegProyTotal").val().length > 0 && $("#fechaFinFiltroSolRegProyTotal").val().length > 0){
	listEstadosEvalIdSolRegProyTotal = [];
	    
	var estadoEvaluacionId = $("#filtroEstadosEvalSolRegProyTotal").val(); 
	   
	if(estadoEvaluacionId != null){
	    estadoEvaluacionId.forEach(function(val){
		listEstadosEvalIdSolRegProyTotal.push(parseInt(val));
	    });
	}
	   
	cargarConsolidadoSolicitudRegistroProyecto();
    }else{
	$("#modalConsolidadoSolRegProyTotal").modal("hide");
	
	mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
		
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroConsolidadoSolRegProyTotal").modal("show");
	});
    }
}

function cargarConsolidadoSolicitudRegistroProyecto(){
   $("#modalConsolidadoSolRegProyTotal").modal("show");$("#valBuscarValorSolRegProy").val("");
   busquedaActivaSolRegProyTotal = 0,numPaginaActualSolRegProyTotal = 1; 
    
   var dataParam={
      empresaId:parseInt(getSession("gestopcompanyid")),fechaRegInicioFiltro:$("#fechaInicioFiltroSolRegProyTotal").val(),
      fechaRegFinFiltro:$("#fechaFinFiltroSolRegProyTotal").val(),listEstadoEvaluacionId:(listEstadosEvalIdSolRegProyTotal.length == 0?null:listEstadosEvalIdSolRegProyTotal)
   };

   callAjaxPost(URL+'/contratista/solicitud_registro_proyecto/vista_admin',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listSolicitudesRegistroProyTotal = data.listSolicitudesRegistroProy;
	 
	 $("#tblConsolidadoSolRegProy tbody tr").remove();
	 
	 cambiarPaginaSolicitudRegistroProyectoTotal();
	      
	 goheadfixedY("#tblConsolidadoSolRegProy","#wrapperConsolidadoSolRegProy");
      }else{
         console.log("Error al cargar el consolidado trabajadores contratista");
      }
   }); 
   
   $("#btnOcultarSolRegProy").show();$("#btnCancelarSolRegProy").hide();$("#btnGuardarSolRegProy").hide();
   $("#indicadorPaginaParcialAuxSolRegProy").show();$("#btnResetBuscadorSolRegProy").show();$("#btnAplicarBuscadorSolRegProy").show();
   $("#valBuscarValorSolRegProy").show();$("#btnFiltroSolRegProy").show();$("#btnEliminarSolRegProy").hide();
   
   banderaEdicionSolRegProyTotal = false;
}

function cambiarPaginaSolicitudRegistroProyectoTotal(){
   $("#flechaIzquierdaSolRegProy").show();$("#flechaDerechaSolRegProy").show(); 
   
   var list = (busquedaActivaSolRegProyTotal == 0?listSolicitudesRegistroProyTotal:listSolicitudesRegistroProyTotalBuscador);
   var totalSize = list.length;
   var partialSize = 100;
	
   var numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActualSolRegProyTotal*partialSize)-partialSize;
   var finRegistro = (numPaginaActualSolRegProyTotal*partialSize)-1;
	
   if(numPaginaTotal == 0){
      numPaginaTotal = 1;
   }
		
   $("#labelFlechasSolRegProy").html("<label>"+numPaginaActualSolRegProyTotal+" de "+numPaginaTotal+"</label>");
	 
   if(numPaginaActualSolRegProyTotal == 1){
      $("#flechaIzquierdaSolRegProy").hide();
   }
	
   if(numPaginaActualSolRegProyTotal == numPaginaTotal){
      $("#flechaDerechaSolRegProy").hide();
   }
	 
   if(finRegistro >= totalSize){
      finRegistro = totalSize-1;
   }
   
   $("#tblConsolidadoSolRegProy tbody tr").remove();

   list.forEach(function(val,index){
      if(inicioRegistro <= index && index <= finRegistro){
	 var detalle = "<strong>*Título:</strong> "+val.titulo +
	     "<br><strong>*Fecha inicio:</strong> "+val.fechaInicioTexto +
	     "<br><strong>*Fecha fin:</strong> "+val.fechaFinTexto +
	     "<br><strong>*Descripción:</strong> "+val.descripcion +
	      (empAuxSolRegProyTotalObj.habilitadoCampPerProy3 == 1?"<br><strong>*Orden de compra:</strong> "+(val.ordenCompra.trim().length > 0?val.ordenCompra:"------"):"") +
	     "<br><strong>*Actividad:</strong> "+(val.perfilEspecialProyecto.actividad.length > 0?val.perfilEspecialProyecto.actividad:val.perfilEspecialProyecto.nombre) +
	      (empAuxSolRegProyTotalObj.habilitadoCampPerProy4 == 1 && empAuxSolRegProyTotalObj.obligatorioCampPerProy4 == 1?"<br><strong>*Responsable:</strong> "+val.responsable.nombre:"") +
	      (empAuxSolRegProyTotalObj.habilitadoCampPerProy5 == 1 && empAuxSolRegProyTotalObj.obligatorioCampPerProy5 == 1?"<br><strong>*Área:</strong> "+val.area.nombre:"") +
	      (empAuxSolRegProyTotalObj.habilitadoCampPerProy1 == 1?"<br><strong>*Lugar(es) de trabajo:</strong> "+val.tipoLugaresTrabajoAsignadosNombre:"") +
	      (empAuxSolRegProyTotalObj.habilitadoCampPerProy2 == 1?"<br><strong>*Turno(s):</strong> "+val.turnosAnAsignadosNombre:"") +
	     "<br><strong>*Registrado el "+val.fechaRegistroTexto+"</strong>" +
	      (val.fechaActualizacionTexto.length > 0?"<br><strong>*Actualizado el "+val.fechaActualizacionTexto+"</strong>":""),
	     aprobacionAutomatica = (val.snEvaluacionAuto == 1?"Sí":"No"),
	     evaluacionObservacion = (val.evaluacion.observacion.length > 0?val.evaluacion.observacion:"------");
	 
	 var opcionEditar = (val.evaluacion.nota.id == 1?"":"editarConsolidadoSolicitudRegistroProyecto("+index+")");
	  
         $("#tblConsolidadoSolRegProy tbody").append(
            "<tr id='trSolRegProy"+val.id+"' onclick='"+opcionEditar+"'>" +
               "<td id='solRegProyTotalCodigo"+val.id+"'>"+val.codigo+"</td>" +
               "<td id='solRegProyTotalContratista"+val.id+"'>"+val.contratista.nombre+"</td>" +
               "<td id='solRegProyTotalDetalle"+val.id+"' style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
               "<td id='solRegProyTotalAprobAuto"+val.id+"'>"+aprobacionAutomatica+"</td>" +
               "<td id='solRegProyTotalEvalEstado"+val.id+"'>"+val.evaluacion.nota.icono+" "+val.evaluacion.nota.nombre+"</td>" +
               "<td id='solRegProyTotalEvalObs"+val.id+"'>"+evaluacionObservacion+"</td>" +
               "<td id='solRegProyTotalEvalFecha"+val.id+"'>"+val.evaluacion.fechaTexto+"</td>" +
	    "</tr>");
      }
   });

   $.unblockUI();
   formatoCeldaSombreableTabla(true,"tblConsolidadoSolRegProy");
}

function aplicarBuscadorSolicitudRegistroProyectoTotal(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    
   var valBuscarValorSolRegProy = igualarStringBuscar($("#valBuscarValorSolRegProy").val());
   listSolicitudesRegistroProyTotalBuscador = [];
   busquedaActivaSolRegProyTotal = 1;numPaginaActualSolRegProyTotal = 1;
  	
   listSolicitudesRegistroProyTotal.forEach(function(val,index){
      if(igualarStringBuscar(val.codigo).indexOf(valBuscarValorSolRegProy) != -1 ||
	 igualarStringBuscar(val.contratista.nombre).indexOf(valBuscarValorSolRegProy) != -1 ||
         igualarStringBuscar(val.titulo).indexOf(valBuscarValorSolRegProy) != -1){
	 listSolicitudesRegistroProyTotalBuscador.push(val);
      }
   }); 
   
   cambiarPaginaSolicitudRegistroProyectoTotal();
}

function reiniciarBuscadorSolicitudRegistroProyectoTotal(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   $("#valBuscarValorSolRegProy").val("").focus();
   busquedaActivaSolRegProyTotal = 0;numPaginaActualSolRegProyTotal = 1;
    
   cambiarPaginaSolicitudRegistroProyectoTotal();
}

function editarConsolidadoSolicitudRegistroProyecto(pindex){
   if(!banderaEdicionSolRegProyTotal){
      solRegProyTotalObj = (busquedaActivaSolRegProyTotal == 0?listSolicitudesRegistroProyTotal[pindex]:listSolicitudesRegistroProyTotalBuscador[pindex]);

      $("#trSolRegProy"+solRegProyTotalObj.id).addClass("fila-edicion");
      
      var selEvalEstadoSolRegProyTotal = crearSelectOneMenuOblig("selEvalEstadoSolRegProyTotal","",
	  listEvaluacionSolRegProyTotal,solRegProyTotalObj.evaluacion.nota.id,"id","nombre");
      
      $("#solRegProyTotalEvalEstado"+solRegProyTotalObj.id).html(selEvalEstadoSolRegProyTotal);
      
      $("#solRegProyTotalEvalObs"+solRegProyTotalObj.id).html("<textarea id='textEvalObsSolRegProyTotal' class='form-control' rows='5'></textarea>");
      $("#textEvalObsSolRegProyTotal").val(solRegProyTotalObj.evaluacion.observacion);
      
      $("#solRegProyTotalEvalFecha"+solRegProyTotalObj.id).html("<label>*Automático.</label>");

      formatoCeldaSombreableTabla(false,"tblConsolidadoSolRegProy");
      
      $("#btnOcultarSolRegProy").hide();$("#btnCancelarSolRegProy").show();$("#btnGuardarSolRegProy").show();
      $("#indicadorPaginaParcialAuxSolRegProy").hide();$("#btnResetBuscadorSolRegProy").hide();$("#btnAplicarBuscadorSolRegProy").hide();
      $("#valBuscarValorSolRegProy").hide();$("#btnFiltroSolRegProy").hide();$("#btnEliminarSolRegProy").show();

      banderaEdicionSolRegProyTotal = true;
   }
}

function guardarConsolidadoSolicitudRegistroProyecto(){
    var campoVacio = true;
   
    var evalEstadoId = parseInt($("#selEvalEstadoSolRegProyTotal").val());
    var evalObservacion = $("#textEvalObsSolRegProyTotal").val().trim();
    var snEnviarCorreo = (solRegProyTotalObj.evaluacion.nota.id == evalEstadoId?0:1);
   
    if(campoVacio){
        var dataParam={
	    id:solRegProyTotalObj.id,evaluacion:{nota:{id:evalEstadoId},observacion:evalObservacion},snEnviarCorreo:snEnviarCorreo,
	    empresa:{habilitadoCampPerProy1:empAuxSolRegProyTotalObj.habilitadoCampPerProy1,habilitadoCampPerProy2:empAuxSolRegProyTotalObj.habilitadoCampPerProy2,
	    habilitadoCampPerProy3:empAuxSolRegProyTotalObj.habilitadoCampPerProy3,habilitadoCampPerProy4:empAuxSolRegProyTotalObj.habilitadoCampPerProy4,
	    obligatorioCampPerProy4:empAuxSolRegProyTotalObj.obligatorioCampPerProy4,habilitadoCampPerProy5:empAuxSolRegProyTotalObj.habilitadoCampPerProy5,
	    obligatorioCampPerProy5:empAuxSolRegProyTotalObj.obligatorioCampPerProy5}
        };
	        
        callAjaxPostSimpleVersionDos(1,URL+'/contratista/solicitud_registro_proyecto/vista_admin/evaluacion/save',dataParam,1,1,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":  
	            $("#modalConsolidadoSolRegProyTotal").modal("hide");
		
	            mensajeUx = "<label>La evaluación de la solicitud registro de proyecto fue guardada con éxito." +(snEnviarCorreo == 1 && 
	                [1,2].includes(evalEstadoId)?"<br><br>*Se envió un correo de notificación a la persona de contacto.":"")+"</label>";
	            mensajesUx(mensajeUx,1,"","ActualizarSolRegProyTotal"); 
								   
	            $("#modalMensajeUxActualizarSolRegProyTotal").on("hidden.bs.modal",function(){
		        cargarConsolidadoSolicitudRegistroProyecto();actPrincipalProy = 1;  
	            });
		
	            break;
						
	        default:
	            alert("Ocurrió un error al guardar la evaluación de la solicitud registro de proyecto.");
	    }
        });	
    }else{
       
    }	
}

function eliminarConsolidadoSolicitudRegistroProyecto(){
    $("#modalConsolidadoSolRegProyTotal").modal("hide");
    
    if(solRegProyTotalObj.evaluacion.nota.id != 1){
        mensajeUx="<label>¿Está seguro de eliminar el registro solicitud proyecto seleccionado?</label>";
        mensajesUx(mensajeUx,3,"","EliminarSolRegProyTotal");
    
        $("#btnDevolverValorEliminarSolRegProyTotal").on("click",function(){
            var dataParam={
                id:solRegProyTotalObj.id
            };
    
            callAjaxPost(URL+'/contratista/solicitud_registro_proyecto/delete',dataParam,function(data){
                switch(data.CODE_RESPONSE){
                    case "05":
     	                mensajeUx = "<label>El registro solicitud proyecto fue eliminado con éxito.</label>";
     	                mensajesUx(mensajeUx,1,"","ActualizarSolRegProyTotal"); 
     								   
     	                $("#modalMensajeUxActualizarSolRegProyTotal").on("hidden.bs.modal",function(){
     	                    cargarConsolidadoSolicitudRegistroProyecto();  
     	                });
     	       
     	                break;
    			
                    default:
                        alert("Ocurrió un error al eliminar el registro solicitud proyecto.");
                }
            });
        });
        
        $("#btnRegresarPrevioEliminarSolRegProyTotal").on("click",function(){
            $("#modalConsolidadoSolRegProyTotal").modal("show"); 
        });
    }else{
	mensajeUx = "<label>No se puede borrar una solicitud registro de proyecto aprobado.</label>";
        mensajesUx(mensajeUx,2,"","ValidacionSolRegProyTotal"); 
							   
        $("#modalMensajeUxValidacionSolRegProyTotal").on("hidden.bs.modal",function(){
            $("#modalConsolidadoSolRegProyTotal").modal("show");  
        });
    }
}