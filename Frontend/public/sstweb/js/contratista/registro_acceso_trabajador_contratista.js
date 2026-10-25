
var regAccesoTrabContId,regAccesoTrabContObj={};
var regAccesoTrabContBanderaEdicion;
var busquedaActivaRegAccTrabCont,numPaginaActualRegAccTrabCont;

var listFullRegistrosAccesoTrabCont = [],listTipoAccesoPersonalRegAccTrabCont = [],listFullRegistrosAccesoTrabContBuscador = [];
var mensajeUx;

$(document).ready(function(){
    $("#flechaIzquierdaRegAccTrabCont").on('click',function(){
		numPaginaActualRegAccTrabCont = numPaginaActualRegAccTrabCont-1;
		cambiarPaginaRegistroAccesoTrabajadorContratista();
	});

	$('#flechaDerechaRegAccTrabCont').on('click',function(){
		numPaginaActualRegAccTrabCont = numPaginaActualRegAccTrabCont+1;
		cambiarPaginaRegistroAccesoTrabajadorContratista();
	});
});	

function ocultarFiltroRegistroAccesoTrabajadorContratista(){
    $("#modalFiltroRegistroAccesoTrabCont").modal("hide");
}

function verFiltroRegistroAccesoTrabajadorContratista(){
    $("#modalFiltroRegistroAccesoTrabCont").modal("show");
}

function crearFiltroRegistroAccesoTrabajadorContratista(functionCallBack){
	$("#modalFiltroRegistroAccesoTrabCont").remove();
	
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };
	  		
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_trabajador_contratista/filtro',dataParam,1,1,function(data){
        listTipoAccesoPersonalRegAccTrabCont = data.listTipoAccesoPersonal;

        var contenido = "";
  				
        var listContenido=[
  	        {label:"Fecha de registro - Inicio",inputForm:"<input type='date' id='fechaInicioFiltroRegAccTrabCont' class='form-control'>"},
  	        {label:"Fecha de registro - Fin",inputForm:"<input type='date' id='fechaFinFiltroRegAccTrabCont' class='form-control'>"},
  	        {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	        {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroRegistroAccesoTrabajadorContratista()'>" +
               	       "<i class='fa fa-times'></i> Cancelar" +
               	   "</button>",
  	         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='valoresFiltroRegistroAccesoTrabajadorContratista()'>" +
  	                       "<i class='fa fa-filter'></i> Aplicar" +
  	                   "</button>"}
        ]; 
  				
        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionTres(val);
        });
   
        var modalOptions={
 	        id:"modalFiltroRegistroAccesoTrabCont",nombre:"<i class='fa fa-filter'></i> Filtros",
  	        contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
        };
  				
        crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
        var hoy = getSession("fechaHoyOrdenInversoTexto");
   
        $("#fechaInicioFiltroRegAccTrabCont").val(hoy);$("#fechaFinFiltroRegAccTrabCont").val(hoy);
		
	    functionCallBack();
    });
}

function valoresFiltroRegistroAccesoTrabajadorContratista(){
    ocultarFiltroRegistroAccesoTrabajadorContratista(); 
    
    if($("#fechaInicioFiltroRegAccTrabCont").val().length > 0 && $("#fechaFinFiltroRegAccTrabCont").val().length > 0){
        cargarRegistroAccesoTrabajadorContratista();
    }else{
	    mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
		$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	        $("#modalFiltroRegistroAccesoTrabCont").modal("show");
		});
    }
}

function cargarRegistroAccesoTrabajadorContratista(){
	$("#valBuscarRegAccTrabCont").val("");
	
    $("#btnCancelarRegAccTrabCont").hide();$("#btnNuevoRegAccTrabCont").show();$("#btnEliminarRegAccTrabCont").hide();
    $("#btnGuardarRegAccTrabCont").hide();$("#btnFiltroRegAccTrabCont").show();$("#btnResetFiltroRegAccTrabCont").show();
	$("#valBuscarRegAccTrabCont").show();$("#btnBuscarRegAccTrabCont").show();
   
    regAccesoTrabContBanderaEdicion = false;resizeDivWrapper("wrapRegAccesoTrabajadorCont",180);

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),tipoAccesoId:parseInt(getSession("accesoUsuarios")),
		fechaRegistroInicio:$("#fechaInicioFiltroRegAccTrabCont").val(),fechaRegistroFin:$("#fechaFinFiltroRegAccTrabCont").val()
    };
	
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_trabajador_contratista',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
		    listFullRegistrosAccesoTrabCont = data.listFullRegistrosAccesoTrabCont;
			
			busquedaActivaRegAccTrabCont = 0,numPaginaActualRegAccTrabCont = 1;

			cambiarPaginaRegistroAccesoTrabajadorContratista();
			
			if(parseInt(getSession("accesoUsuarios")) == 1){
                formatoCeldaSombreableTabla(true,"tblRegAccesoTrabajadorCont");
			}
			
            goheadfixedY("#tblRegAccesoTrabajadorCont","#wrapRegAccesoTrabajadorCont");
        }else{
	        console.log("NOPNPO");
        }
    });
}

function cambiarPaginaRegistroAccesoTrabajadorContratista(){
    $("#flechaIzquierdaRegAccTrabCont").show();$("#flechaDerechaRegAccTrabCont").show();

    var list = (busquedaActivaRegAccTrabCont == 0?listFullRegistrosAccesoTrabCont:listFullRegistrosAccesoTrabContBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualRegAccTrabCont*partialSize)-partialSize;
    var finRegistro = (numPaginaActualRegAccTrabCont*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasRegAccTrabCont").html("<label>"+numPaginaActualRegAccTrabCont+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualRegAccTrabCont == 1){
        $("#flechaIzquierdaRegAccTrabCont").hide();
    }

    if(numPaginaActualRegAccTrabCont == numPaginaTotal){
        $("#flechaDerechaRegAccTrabCont").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblRegAccesoTrabajadorCont tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
			var snConductorTexto = (val.snConductor > 0?"Sí":"No"),detalle = (val.detalle.length == 0?"------":val.detalle),
			    observacion = (val.observacion.length == 0?"------":val.observacion),
				consultaLicenciasHabilitadas = (val.consultaLicenciasHabilitadas.length == 0?"------":val.consultaLicenciasHabilitadas),
				registradoPor = (val.fechaRegistroTexto.length == 0?"------":val.fechaRegistroTexto+"<br>(Por "+val.registradoPor+")"),
			    actualizadoPor = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto+"<br>(Por "+val.actualizadoPor+")");
				
			var opcionEditar = (parseInt(getSession("accesoUsuarios")) == 1?"onclick='editarRegistroAccesoTrabajadorContratista("+index+")'":"");	
			        	 
			$("#tblRegAccesoTrabajadorCont tbody").append(
	            "<tr id='trRegAccTrabCont"+val.id+"' "+opcionEditar+">" +
				    "<td id='tdContratista"+val.id+"'>"+val.contratista.nombre+"</td>" + 
					"<td id='tdProyecto"+val.id+"'>"+val.proyecto.titulo+"</td>" +
					"<td id='tdNombreTrabCont"+val.id+"'>"+val.trabajadorContratista.nombre+"</td>" + 
					"<td id='tdTipoAccPer"+val.id+"'>"+val.tipoAccesoPersonal.nombre+"</td>" + 
					"<td id='tdTipoEstAcc"+val.id+"'>"+val.tipoEstadoAcceso.nombre+"</td>" +
					"<td id='tdSnConductor"+val.id+"'>"+snConductorTexto+"</td>" + 
					"<td id='tdConLicHab"+val.id+"'>"+consultaLicenciasHabilitadas+"</td>" + 
					"<td id='tdObservacion"+val.id+"'>"+observacion+"</td>" + 
					"<td id='tdDetalle"+val.id+"'>"+detalle+"</td>" + 
					"<td id='tdRegistro"+val.id+"'>"+registradoPor+"</td>" + 
					"<td id='tdActualizacion"+val.id+"'>"+actualizadoPor+"</td>" + 
			    "</tr>");
        }
    });

    $.unblockUI();
}

function aplicarBuscadorRegistroAccesoTrabajadorContratista(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valorBuscador = igualarStringBuscar($("#valBuscarRegAccTrabCont").val());
    listFullRegistrosAccesoTrabContBuscador = [];busquedaActivaRegAccTrabCont = 1;numPaginaActualRegAccTrabCont = 1;

    listFullRegistrosAccesoTrabCont.forEach(function(val){
        if(igualarStringBuscar(val.contratista.nombre).indexOf(valorBuscador) != -1 ||
            igualarStringBuscar(val.proyecto.titulo).indexOf(valorBuscador) != -1 ||
            igualarStringBuscar(val.trabajadorContratista.nombre).indexOf(valorBuscador) != -1){
            listFullRegistrosAccesoTrabContBuscador.push(val);
        }
    });

    cambiarPaginaRegistroAccesoTrabajadorContratista();
}

function reiniciarBuscadorRegistroAccesoTrabajadorContratista(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    $("#valBuscarRegAccTrabCont").val("").focus();
    busquedaActivaRegAccTrabCont = 0;numPaginaActualRegAccTrabCont = 1;

    cambiarPaginaRegistroAccesoTrabajadorContratista();
}

var paramRegAccTrabContAuxObj;
var tipoAccesoPersonalIdAux;

function nuevoRegistroAccesoTrabajadorContratista(){
	$("#modalEstadoActualTrabajadorContratistaOpcGenCont").modal("hide");$("#modalFormRegistroAccesoTrabCont").remove();
	
	regAccesoTrabContId = 0;
	
	paramRegAccTrabContAuxObj = {licenciasHabilitadas:""};
	
	var estadoAcceso = (booleanHabilitadoRegAccTrabCont?"Habilitado":"No habilitado"),snConductorTexto = (conductorAuxOpcGenContObj.id > 0?"Sí":"No");
		
    var selTipoAccesoPersonalRegAccTrabCont = crearSelectOneMenuOblig("selTipoAccesoPersonalRegAccTrabCont","",listTipoAccesoPersonalRegAccTrabCont,"1","id","nombre");	
	    
	var contenido = "";

	var listContenido=[
	    {label:"Contratista:",inputForm:contratistaAuxBusOpcDosOpcGenContObj.nombre},
		{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		{label:"Proyecto:",inputForm:proyectoAuxOpcGenContObj.titulo},
		{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		{label:"Trabajador(a):",inputForm:"("+trabContratistaAuxOpcGenContObj.nroDocumento+") "+trabContratistaAuxOpcGenContObj.nombreCompleto},
		{label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
		{label:"Estado:",inputForm:estadoAcceso},
		{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		{label:"¿Es conductor?:",inputForm:snConductorTexto}
    ];
	
	if(proyectoAuxOpcGenContObj.habilitadoConductor == 1 && conductorAuxOpcGenContObj.id > 0){
		var licenciasHabilitadas = (conductorAuxOpcGenContObj.tiposLicenciaConductorHabilitadosNombre.length == 0?"Ninguno":conductorAuxOpcGenContObj.tiposLicenciaConductorHabilitadosNombre);
		
		paramRegAccTrabContAuxObj.licenciasHabilitadas = licenciasHabilitadas;
		
		listContenido.push({label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		    {label:"Tipo(s) de licencia(s) habilitadas:",inputForm:licenciasHabilitadas});	     
	}
	
    listContenido.push({label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
		{label:"Tipo:",inputForm:selTipoAccesoPersonalRegAccTrabCont},
		{label:"",inputForm:"",styleTotal:styleLineaDegradada},
	    {anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observación:",inputForm:""},
	    {anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textObservacionRegAccTrabCont' class='form-control' rows='4'></textarea>"},
		{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		{anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Detalle:",inputForm:""},
		{anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textDetalleRegAccTrabCont' class='form-control' rows='4'></textarea>"},
		{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
		{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='cancelarRegistroAccesoTrabajadorContratista()'>" +
		           "<i class='fa fa-times'></i> Cancelar" +
		       "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='validacionPreviaGuardarRegistroAccesoTrabajadorContratista()'>" +
		               "<i class='fa fa-floppy-o'></i> Guardar" +
		           "</button>"});
				   
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
	});
	 		
	var modalOptions={
		id:"modalFormRegistroAccesoTrabCont",nombre:"<i class='fa fa-pencil'></i> Registro de acceso del trabajador contratista",
		contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    };
					
	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function editarRegistroAccesoTrabajadorContratista(pindex){
	if(!regAccesoTrabContBanderaEdicion){
		if(parseInt(getSession("accesoUsuarios")) == 1){
		    $("#modalFormRegistroAccesoTrabCont").remove();
		
        	regAccesoTrabContObj = (busquedaActivaRegAccTrabCont == 0?listFullRegistrosAccesoTrabCont[pindex]:listFullRegistrosAccesoTrabContBuscador[pindex]);
	    	regAccesoTrabContId = regAccesoTrabContObj.id; 
	      
	    	$("#trRegAccTrabCont"+regAccesoTrabContId).addClass("fila-edicion");
		  
			var selTipoAccesoPersonalRegAccTrabCont = crearSelectOneMenuOblig("selTipoAccesoPersonalRegAccTrabCont","",listTipoAccesoPersonalRegAccTrabCont,
		    	regAccesoTrabContObj.tipoAccesoPersonal.id,"id","nombre");	
			 
			$("#tdTipoAccPer"+regAccesoTrabContId).html(selTipoAccesoPersonalRegAccTrabCont);
		
	    	$("#tdObservacion"+regAccesoTrabContId).html("<textarea id='textObservacionRegAccTrabCont' class='form-control' rows='4'></textarea>");
	    	$("#textObservacionRegAccTrabCont").val(regAccesoTrabContObj.observacion);
		  
			$("#tdDetalle"+regAccesoTrabContId).html("<textarea id='textDetalleRegAccTrabCont' class='form-control' rows='4'></textarea>");
			$("#textDetalleRegAccTrabCont").val(regAccesoTrabContObj.detalle);
		  
			formatoCeldaSombreableTabla(false,"tblRegAccesoTrabajadorCont");regAccesoTrabContBanderaEdicion = true;
			
			$("#btnCancelarRegAccTrabCont").show();$("#btnNuevoRegAccTrabCont").hide();$("#btnEliminarRegAccTrabCont").show();
			$("#btnGuardarRegAccTrabCont").show();$("#btnFiltroRegAccTrabCont").hide();$("#btnResetFiltroRegAccTrabCont").hide();
			$("#valBuscarRegAccTrabCont").hide();$("#btnBuscarRegAccTrabCont").hide();
		}else{
			mensajeUx = "<label>No tiene acceso a esta función.</label>"; 
			mensajesUx(mensajeUx,2,"","ActualizarRegAccTrabCont");
		}
    }
}

function cancelarRegistroAccesoTrabajadorContratista(){
	$("#modalFormRegistroAccesoTrabCont").modal("hide");
	
    cargarRegistroAccesoTrabajadorContratista();
}

function validacionPreviaGuardarRegistroAccesoTrabajadorContratista(){
	$("#modalFormRegistroAccesoTrabCont").modal("hide");
	
	mensajeUx="<label>*Una vez guardado el registro de acceso no podrá modificarlo/eliminarlo." +
	    "<br><br>Por favor, dar click en 'Aceptar' para proceder con la acción respectiva.</label>";
    mensajesUx(mensajeUx,3,"","ConfirmRegAccTrabCont");
	    
	$("#btnDevolverValorConfirmRegAccTrabCont").on("click",function(){
		guardarRegistroAccesoTrabajadorContratista();
    });
	        
	$("#btnRegresarPrevioConfirmRegAccTrabCont").on("click",function(){
	    $("#modalFormRegistroAccesoTrabCont").modal("show"); 
	});
}

function guardarRegistroAccesoTrabajadorContratista(){
	var campoVacio = true;
	
	var contratistaId = (regAccesoTrabContId == 0?contratistaAuxBusOpcDosOpcGenContObj.id:null);
	var proyectoId = (regAccesoTrabContId == 0?proyectoAuxOpcGenContObj.id:null);
	var trabContratistaId = (regAccesoTrabContId == 0?trabContratistaAuxOpcGenContObj.id:null);
	var snConductor = (regAccesoTrabContId == 0?(conductorAuxOpcGenContObj.id > 0?1:0):null);
	var tipoAccesoPersonalId = parseInt($("#selTipoAccesoPersonalRegAccTrabCont").val());
	var tipoEstadoAccesoId = (regAccesoTrabContId == 0?(booleanHabilitadoRegAccTrabCont?1:2):null);
	var consultaLicenciasHabilitadas = (regAccesoTrabContId == 0?paramRegAccTrabContAuxObj.licenciasHabilitadas:null);
	var observacion = $("#textObservacionRegAccTrabCont").val().trim();
	var detalle = $("#textDetalleRegAccTrabCont").val().trim();
		
    if(campoVacio){
	    var dataParam={
		    id:regAccesoTrabContId,contratistaId:contratistaId,proyectoId:proyectoId,trabajadorContratistaId:trabContratistaId,
		    tipoAccesoPersonalId:tipoAccesoPersonalId,tipoEstadoAccesoId:tipoEstadoAccesoId,consultaLicenciasHabilitadas:consultaLicenciasHabilitadas,
			observacion:observacion,detalle:detalle,snConductor:snConductor,empresaId:parseInt(getSession("gestopcompanyid"))
	    };
	      
		callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_trabajador_contratista/save',dataParam,1,1,function(data){
	        switch(data.CODE_RESPONSE){
		        case "05":
					$("#modalFormRegistroAccesoTrabCont").modal("hide");	
				
			        mensajeUx = "<label>El registro del acceso del trabajador contratista fue guardado con éxito.</label>"; 
	    	        mensajesUx(mensajeUx,1,"","ActualizarRegAccTrabCont");
			    
	    	        $("#modalMensajeUxActualizarRegAccTrabCont").on("hidden.bs.modal",function(){
	    	            cargarRegistroAccesoTrabajadorContratista();
	    	        });
								 
		            break;
							
		        default:
		            console.log("Ocurrió un error al guardar el registro del acceso del trabajador contratista!");
	        }
	    });
    }else{
		$("#modalFormRegistroAccesoTrabCont").modal("hide");
		
	    mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>"; 
	    mensajesUx(mensajeUx,2,"","ActualizarRegAccTrabCont");
		
		$("#modalMensajeUxActualizarRegAccTrabCont").on("hidden.bs.modal",function(){
		    $("#modalFormRegistroAccesoTrabCont").modal("show");
		});
	}
}

function eliminarRegistroAccesoTrabajadorContratista(){
	if(parseInt(getSession("accesoUsuarios")) == 1){
        mensajeUx="<label>¿Está seguro de eliminar el registro del historial de acceso seleccionado?</label>";
    	mensajesUx(mensajeUx,3,"","ConfirmRegAccTrabCont");

    	$("#btnDevolverValorConfirmRegAccTrabCont").on("click",function(){
        	var dataParam={
    	    	id:regAccesoTrabContId
        	};
			
        	callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_trabajador_contratista/delete',dataParam,1,1,function(data){
            	switch(data.CODE_RESPONSE){
	            	case "05":
	                	mensajeUx = "<label>El registro del historial de acceso fue eliminado con éxito.</label>"; 
	       				mensajesUx(mensajeUx,1,"","ActualizarRegAccTrabCont");
	               
	       				$("#modalMensajeUxActualizarRegAccTrabCont").on("hidden.bs.modal",function(){
	                    	cargarRegistroAccesoTrabajadorContratista();   
	       				});
	  	       
	       			break;
						
	    		default:
	       			alert("Ocurrió un error al eliminar el registro del historial del acceso!");
         		}	
      		});
    	});
    }else{
		mensajeUx = "<label>No tiene acceso a esta función.</label>"; 
		mensajesUx(mensajeUx,2,"","ActualizarRegAccTrabCont");
    }
}
