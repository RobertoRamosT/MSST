
var regAccesoVehMaqId,regAccesoVehMaqObj={};
var regAccesoVehMaqBanderaEdicion;
var busquedaActivaRegAccVehMaq,numPaginaActualRegAccVehMaq;

var listFullRegistrosAccesoVehMaq = [],listTipoAccesoPersonalRegAccVehMaq = [],listFullRegistrosAccesoVehMaqBuscador = [];
var mensajeUx;

$(document).ready(function(){
    $("#flechaIzquierdaRegAccVehMaq").on('click',function(){
		numPaginaActualRegAccVehMaq = numPaginaActualRegAccVehMaq-1;
		cambiarPaginaRegistroAccesoVehiculoMaquinaria();
	});

	$('#flechaDerechaRegAccVehMaq').on('click',function(){
		numPaginaActualRegAccVehMaq = numPaginaActualRegAccVehMaq+1;
		cambiarPaginaRegistroAccesoVehiculoMaquinaria();
	});
});	

function ocultarFiltroRegistroAccesoVehiculoMaquinaria(){
    $("#modalFiltroRegistroAccesoVehMaq").modal("hide");
}

function verFiltroRegistroAccesoVehiculoMaquinaria(){
    $("#modalFiltroRegistroAccesoVehMaq").modal("show");
}

function crearFiltroRegistroAccesoVehiculoMaquinaria(functionCallBack){
	$("#modalFiltroRegistroAccesoVehMaq").remove();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };
	  		
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_vehiculo_maquinaria/filtro',dataParam,1,1,function(data){
        listTipoAccesoPersonalRegAccVehMaq = data.listTipoAccesoPersonal;

        var contenido = "";
  				
        var listContenido=[
  	        {label:"Fecha de registro - Inicio",inputForm:"<input type='date' id='fechaInicioFiltroRegAccVehMaq' class='form-control'>"},
  	        {label:"Fecha de registro - Fin",inputForm:"<input type='date' id='fechaFinFiltroRegAccVehMaq' class='form-control'>"},
  	        {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	        {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroRegistroAccesoVehiculoMaquinaria()'>" +
               	       "<i class='fa fa-times'></i> Cancelar" +
               	   "</button>",
  	         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='valoresFiltroRegistroAccesoVehiculoMaquinaria()'>" +
  	                       "<i class='fa fa-filter'></i> Aplicar" +
  	                   "</button>"}
        ]; 
  				
        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionTres(val);
        });
   
        var modalOptions={
 	        id:"modalFiltroRegistroAccesoVehMaq",nombre:"<i class='fa fa-filter'></i> Filtros",
  	        contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
        };
  				
        crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
        var hoy = getSession("fechaHoyOrdenInversoTexto");
   
        $("#fechaInicioFiltroRegAccVehMaq").val(hoy);$("#fechaFinFiltroRegAccVehMaq").val(hoy);
		
	    functionCallBack();
    });
}

function valoresFiltroRegistroAccesoVehiculoMaquinaria(){
    ocultarFiltroRegistroAccesoVehiculoMaquinaria(); 
    
    if($("#fechaInicioFiltroRegAccVehMaq").val().length > 0 && $("#fechaFinFiltroRegAccVehMaq").val().length > 0){
        cargarRegistroAccesoVehiculoMaquinaria();
    }else{
	    mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
		$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	        $("#modalFiltroRegistroAccesoVehMaq").modal("show");
		});
    }
}

function cargarRegistroAccesoVehiculoMaquinaria(){
	$("#valBuscarRegAccVehMaq").val("");
	
    $("#btnCancelarRegAccVehMaq").hide();$("#btnNuevoRegAccVehMaq").show();$("#btnEliminarRegAccVehMaq").hide();
    $("#btnGuardarRegAccVehMaq").hide();$("#btnFiltroRegAccVehMaq").show();$("#btnResetFiltroRegAccVehMaq").show();
	$("#valBuscarRegAccVehMaq").show();$("#btnBuscarRegAccVehMaq").show();

    regAccesoVehMaqBanderaEdicion = false;resizeDivWrapper("wrapRegAccesoVehiculoMaq",180);

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),tipoAccesoId:parseInt(getSession("accesoUsuarios")),
		fechaRegistroInicio:$("#fechaInicioFiltroRegAccVehMaq").val(),fechaRegistroFin:$("#fechaFinFiltroRegAccVehMaq").val()
    };
	
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_vehiculo_maquinaria',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
		    listFullRegistrosAccesoVehMaq = data.listFullRegistrosAccesoVehMaq;
			
			busquedaActivaRegAccVehMaq = 0,numPaginaActualRegAccVehMaq = 1;

			cambiarPaginaRegistroAccesoVehiculoMaquinaria();
			
			if(parseInt(getSession("accesoUsuarios")) == 1){
                formatoCeldaSombreableTabla(true,"tblRegAccesoVehiculoMaq");
			}
			
            goheadfixedY("#tblRegAccesoVehiculoMaq","#wrapRegAccesoVehiculoMaq");
        }else{
			// traza para soporte (sin alarmar al usuario) + tabla con aviso para distinguir
			// "sin registros" de "fallo la carga"
	        console.error("RegAccVehMaq: error al cargar el historial de acceso. CODE_RESPONSE:",data.CODE_RESPONSE);

			$("#tblRegAccesoVehiculoMaq tbody tr").remove();
			$("#tblRegAccesoVehiculoMaq tbody").append(
			    "<tr><td colspan='8' style='text-align:center;color:#999;'>No se pudo cargar el historial. Vuelva a intentarlo con el botón de refresh.</td></tr>");

			$.unblockUI();
        }
    });
}

function cambiarPaginaRegistroAccesoVehiculoMaquinaria(){
    $("#flechaIzquierdaRegAccVehMaq").show();$("#flechaDerechaRegAccVehMaq").show();

    var list = (busquedaActivaRegAccVehMaq == 0?listFullRegistrosAccesoVehMaq:listFullRegistrosAccesoVehMaqBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualRegAccVehMaq*partialSize)-partialSize;
    var finRegistro = (numPaginaActualRegAccVehMaq*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasRegAccVehMaq").html("<label>"+numPaginaActualRegAccVehMaq+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualRegAccVehMaq == 1){
        $("#flechaIzquierdaRegAccVehMaq").hide();
    }

    if(numPaginaActualRegAccVehMaq == numPaginaTotal){
        $("#flechaDerechaRegAccVehMaq").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblRegAccesoVehiculoMaq tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
			var detalle = (val.detalle.length == 0?"------":val.detalle),
			    observacion = (val.observacion.length == 0?"------":val.observacion),
				registradoPor = (val.fechaRegistroTexto.length == 0?"------":val.fechaRegistroTexto+"<br>(Por "+val.registradoPor+")"),
			    actualizadoPor = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto+"<br>(Por "+val.actualizadoPor+")");
				
			var opcionEditar = (parseInt(getSession("accesoUsuarios")) == 1?"onclick='editarRegistroAccesoVehiculoMaquinaria("+index+")'":"");	
			        	 
			$("#tblRegAccesoVehiculoMaq tbody").append(
	            "<tr id='trRegAccVehMaq"+val.id+"' "+opcionEditar+">" +
				    "<td id='tdContratista"+val.id+"'>"+val.contratista.nombre+"</td>" + 
					"<td id='tdPlaca"+val.id+"'>"+val.vehiculoMaquinaria.placa+"</td>" + 
					"<td id='tdTipoAccPer"+val.id+"'>"+val.tipoAccesoPersonal.nombre+"</td>" + 
					"<td id='tdTipoEstAcc"+val.id+"'>"+val.tipoEstadoAcceso.nombre+"</td>" +
					"<td id='tdObservacion"+val.id+"'>"+observacion+"</td>" + 
					"<td id='tdDetalle"+val.id+"'>"+detalle+"</td>" + 
					"<td id='tdRegistro"+val.id+"'>"+registradoPor+"</td>" + 
					"<td id='tdActualizacion"+val.id+"'>"+actualizadoPor+"</td>" + 
			    "</tr>");
        }
    });

    $.unblockUI();
}

function aplicarBuscadorRegistroAccesoVehiculoMaquinaria(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valorBuscador = igualarStringBuscar($("#valBuscarRegAccVehMaq").val());
    listFullRegistrosAccesoVehMaqBuscador = [];busquedaActivaRegAccVehMaq = 1;numPaginaActualRegAccVehMaq = 1;

    listFullRegistrosAccesoVehMaq.forEach(function(val){
        if(igualarStringBuscar(val.contratista.nombre).indexOf(valorBuscador) != -1 ||
            igualarStringBuscar(val.vehiculoMaquinaria.placa).indexOf(valorBuscador) != -1){
            listFullRegistrosAccesoVehMaqBuscador.push(val);
        }
    });

    cambiarPaginaRegistroAccesoVehiculoMaquinaria();
}

function reiniciarBuscadorRegistroAccesoVehiculoMaquinaria(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    $("#valBuscarRegAccVehMaq").val("").focus();
    busquedaActivaRegAccVehMaq = 0;numPaginaActualRegAccVehMaq = 1;

    cambiarPaginaRegistroAccesoVehiculoMaquinaria();
}

function nuevoRegistroAccesoVehiculoMaquinaria(){
	$("#modalEstadoActualVehiculoMaquinariaOpcGenCont").modal("hide");$("#modalFormRegistroAccesoVehMaq").remove();
	
	regAccesoVehMaqId = 0;
	
	var estadoAcceso = (booleanHabilitadoRegAccVehMaq?"Habilitado":"No habilitado");
		
    var selTipoAccesoPersonalRegAccVehMaq = crearSelectOneMenuOblig("selTipoAccesoPersonalRegAccVehMaq","",listTipoAccesoPersonalRegAccVehMaq,"1","id","nombre");	
	    
	var contenido = "";

	var listContenido=[
	    {label:"Contratista:",inputForm:vehiculoMaquinariaOpcGenContObj.contratistaNombre},
		{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		{label:"Placa:",inputForm:vehiculoMaquinariaOpcGenContObj.placa},
		{label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
		{label:"Estado:",inputForm:estadoAcceso},
		{label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
		{label:"Tipo:",inputForm:selTipoAccesoPersonalRegAccVehMaq},
		{label:"",inputForm:"",styleTotal:styleLineaDegradada},
	    {anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observación:",inputForm:""},
	    {anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textObservacionRegAccVehMaq' class='form-control' rows='4'></textarea>"},
		{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		{anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Detalle:",inputForm:""},
		{anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textDetalleRegAccVehMaq' class='form-control' rows='4'></textarea>"},
		{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
		{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='cancelarRegistroAccesoVehiculoMaquinaria()'>" +
		           "<i class='fa fa-times'></i> Cancelar" +
		       "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='validacionPreviaGuardarRegistroAccesoVehiculoMaquinaria()'>" +
		               "<i class='fa fa-floppy-o'></i> Guardar" +
		           "</button>"}
    ];
				   
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
	});
	 		
	var modalOptions={
		id:"modalFormRegistroAccesoVehMaq",nombre:"<i class='fa fa-pencil'></i> Registro de acceso del vehículo/maquinaria",
		contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    };
					
	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function editarRegistroAccesoVehiculoMaquinaria(pindex){
	if(!regAccesoVehMaqBanderaEdicion){
		if(parseInt(getSession("accesoUsuarios")) == 1){
		    $("#modalFormRegistroAccesoVehMaq").remove();
		
        	regAccesoVehMaqObj = (busquedaActivaRegAccVehMaq == 0?listFullRegistrosAccesoVehMaq[pindex]:listFullRegistrosAccesoVehMaqBuscador[pindex]);
	    	regAccesoVehMaqId = regAccesoVehMaqObj.id; 
	      
	    	$("#trRegAccVehMaq"+regAccesoVehMaqId).addClass("fila-edicion");
		  
			var selTipoAccesoPersonalRegAccVehMaq = crearSelectOneMenuOblig("selTipoAccesoPersonalRegAccVehMaq","",listTipoAccesoPersonalRegAccVehMaq,
		    	regAccesoVehMaqObj.tipoAccesoPersonal.id,"id","nombre");	
			 
			$("#tdTipoAccPer"+regAccesoVehMaqId).html(selTipoAccesoPersonalRegAccVehMaq);
		
	    	$("#tdObservacion"+regAccesoVehMaqId).html("<textarea id='textObservacionRegAccVehMaq' class='form-control' rows='4'></textarea>");
	    	$("#textObservacionRegAccVehMaq").val(regAccesoVehMaqObj.observacion);
		  
			$("#tdDetalle"+regAccesoVehMaqId).html("<textarea id='textDetalleRegAccVehMaq' class='form-control' rows='4'></textarea>");
			$("#textDetalleRegAccVehMaq").val(regAccesoVehMaqObj.detalle);
		  
			formatoCeldaSombreableTabla(false,"tblRegAccesoVehiculoMaq");regAccesoVehMaqBanderaEdicion = true;
			
			$("#btnCancelarRegAccVehMaq").show();$("#btnNuevoRegAccVehMaq").hide();$("#btnEliminarRegAccVehMaq").show();
			$("#btnGuardarRegAccVehMaq").show();$("#btnFiltroRegAccVehMaq").hide();$("#btnResetFiltroRegAccVehMaq").hide();
			$("#valBuscarRegAccVehMaq").hide();$("#btnBuscarRegAccVehMaq").hide();
		}else{
			mensajeUx = "<label>No tiene acceso a esta función.</label>"; 
			mensajesUx(mensajeUx,2,"","ActualizarRegAccVehMaq");
		}
    }
}

function cancelarRegistroAccesoVehiculoMaquinaria(){
	$("#modalFormRegistroAccesoVehMaq").modal("hide");
	
    cargarRegistroAccesoVehiculoMaquinaria();
}

function validacionPreviaGuardarRegistroAccesoVehiculoMaquinaria(){
	$("#modalFormRegistroAccesoVehMaq").modal("hide");
	
	mensajeUx="<label>*Una vez guardado el registro de acceso no podrá modificarlo/eliminarlo." +
	    "<br><br>Por favor, dar click en 'Aceptar' para proceder con la acción respectiva.</label>";
    mensajesUx(mensajeUx,3,"","ConfirmRegAccVehMaq");
	    
	// .off() previo: sin el, cada confirmacion acumula un handler mas y el guardado se ejecutaria varias veces
	$("#btnDevolverValorConfirmRegAccVehMaq").off("click").on("click",function(){
		guardarRegistroAccesoVehiculoMaquinaria();
    });

	$("#btnRegresarPrevioConfirmRegAccVehMaq").off("click").on("click",function(){
	    $("#modalFormRegistroAccesoVehMaq").modal("show");
	});
}

function guardarRegistroAccesoVehiculoMaquinaria(){
	var contratistaId = (regAccesoVehMaqId == 0?vehiculoMaquinariaOpcGenContObj.contratistaId:null);
	var vehiculoMaquinariaId = (regAccesoVehMaqId == 0?vehiculoMaquinariaOpcGenContObj.id:null);
	var tipoAccesoPersonalId = parseInt($("#selTipoAccesoPersonalRegAccVehMaq").val());
	var tipoEstadoAccesoId = (regAccesoVehMaqId == 0?(booleanHabilitadoRegAccVehMaq?1:2):null);
	var observacion = $("#textObservacionRegAccVehMaq").val().trim();
	var detalle = $("#textDetalleRegAccVehMaq").val().trim();

	// validacion real (antes la bandera estaba fija en true y la rama de error era codigo muerto)
	var camposCompletos = !isNaN(tipoAccesoPersonalId);

    if(camposCompletos){
	    var dataParam={
		    id:regAccesoVehMaqId,contratistaId:contratistaId,vehiculoMaquinariaId:vehiculoMaquinariaId,
		    tipoAccesoPersonalId:tipoAccesoPersonalId,tipoEstadoAccesoId:tipoEstadoAccesoId,
			observacion:observacion,detalle:detalle,empresaId:parseInt(getSession("gestopcompanyid"))
	    };
	      
		callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_vehiculo_maquinaria/save',dataParam,1,1,function(data){
	        switch(data.CODE_RESPONSE){
		        case "05":
					$("#modalFormRegistroAccesoVehMaq").modal("hide");	
				
			        mensajeUx = "<label>El registro del acceso del vehículo/maquinaria fue guardado con éxito.</label>"; 
	    	        mensajesUx(mensajeUx,1,"","ActualizarRegAccVehMaq");
			    
	    	        $("#modalMensajeUxActualizarRegAccVehMaq").on("hidden.bs.modal",function(){
	    	            cargarRegistroAccesoVehiculoMaquinaria();
	    	        });
								 
		            break;
							
		        default:
		            console.error("RegAccVehMaq: error al guardar el registro de acceso. CODE_RESPONSE:",data.CODE_RESPONSE);

			        mensajeUx = "<label>No se pudo guardar el registro del acceso. Vuelva a intentarlo.</label>";
			        mensajesUx(mensajeUx,2,"","ActualizarRegAccVehMaq");
	        }
	    });
    }else{
		$("#modalFormRegistroAccesoVehMaq").modal("hide");
		
	    mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>"; 
	    mensajesUx(mensajeUx,2,"","ActualizarRegAccVehMaq");
		
		$("#modalMensajeUxActualizarRegAccVehMaq").on("hidden.bs.modal",function(){
		    $("#modalFormRegistroAccesoVehMaq").modal("show");
		});
	}
}

function eliminarRegistroAccesoVehiculoMaquinaria(){
	if(parseInt(getSession("accesoUsuarios")) == 1){
        mensajeUx="<label>¿Está seguro de eliminar el registro del historial de acceso seleccionado?</label>";
    	mensajesUx(mensajeUx,3,"","ConfirmRegAccVehMaq");

    	$("#btnDevolverValorConfirmRegAccVehMaq").off("click").on("click",function(){
        	var dataParam={
    	    	id:regAccesoVehMaqId
        	};
			
        	callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_vehiculo_maquinaria/delete',dataParam,1,1,function(data){
            	switch(data.CODE_RESPONSE){
	            	case "05":
	                	mensajeUx = "<label>El registro del historial de acceso fue eliminado con éxito.</label>"; 
	       				mensajesUx(mensajeUx,1,"","ActualizarRegAccVehMaq");
	               
	       				$("#modalMensajeUxActualizarRegAccVehMaq").on("hidden.bs.modal",function(){
	                    	cargarRegistroAccesoVehiculoMaquinaria();   
	       				});
	  	       
	       			break;
						
	    		default:
	       			console.error("RegAccVehMaq: error al eliminar el registro. CODE_RESPONSE:",data.CODE_RESPONSE);

			        mensajeUx = "<label>No se pudo eliminar el registro del acceso. Vuelva a intentarlo.</label>";
			        mensajesUx(mensajeUx,2,"","ActualizarRegAccVehMaq");
         		}
      		});
    	});
    }else{
		mensajeUx = "<label>No tiene acceso a esta función.</label>"; 
		mensajesUx(mensajeUx,2,"","ActualizarRegAccVehMaq");
    }
}
