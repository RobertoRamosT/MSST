
var blacklistVehMaqId,blacklistVehMaqObj={};
var blacklistVehMaqBanderaEdicion;
var busquedaActivaBlacklistVehMaq,numPaginaActualBlacklistVehMaq;

var listFullBlacklistVehMaq = [],listFullBlacklistVehMaqBuscador = [];
var mensajeUx;

$(document).ready(function(){
    $("#flechaIzquierdaBlacklistVehMaq").on('click',function(){
		numPaginaActualBlacklistVehMaq = numPaginaActualBlacklistVehMaq-1;
		cambiarPaginaBlacklistVehiculoMaquinaria();
	});

	$('#flechaDerechaBlacklistVehMaq').on('click',function(){
		numPaginaActualBlacklistVehMaq = numPaginaActualBlacklistVehMaq+1;
		cambiarPaginaBlacklistVehiculoMaquinaria();
	});
});	

function ocultarFiltroBlacklistVehiculoMaquinaria(){
    $("#modalFiltroBlacklistVehMaq").modal("hide");
}

function verFiltroBlacklistVehiculoMaquinaria(){
    $("#modalFiltroBlacklistVehMaq").modal("show");
}

function crearFiltroBlacklistVehiculoMaquinaria(functionCallBack){
	$("#modalFiltroBlacklistVehMaq").remove();

    var contenido = "";
  				
    var listContenido=[
  	    {label:"Fecha de registro - Inicio",inputForm:"<input type='date' id='fechaInicioFiltroBlacklistVehMaq' class='form-control'>"},
  	    {label:"Fecha de registro - Fin",inputForm:"<input type='date' id='fechaFinFiltroBlacklistVehMaq' class='form-control'>"},
  	    {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	    {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroBlacklistVehiculoMaquinaria()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
  	     inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='valoresFiltroBlacklistVehiculoMaquinaria()'>" +
  	                   "<i class='fa fa-filter'></i> Aplicar" +
  	               "</button>"}
    ]; 
  				
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
    });
   
    var modalOptions={
 	    id:"modalFiltroBlacklistVehMaq",nombre:"<i class='fa fa-filter'></i> Filtros",
  	    contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    };
  				
    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
    var hoy = getSession("fechaHoyOrdenInversoTexto");
   
    $("#fechaInicioFiltroBlacklistVehMaq").val(sumaFechaDias(-360,hoy));$("#fechaFinFiltroBlacklistVehMaq").val(hoy);
		
	functionCallBack();
}

function valoresFiltroBlacklistVehiculoMaquinaria(){
    ocultarFiltroBlacklistVehiculoMaquinaria(); 
    
    if($("#fechaInicioFiltroBlacklistVehMaq").val().length > 0 && $("#fechaFinFiltroBlacklistVehMaq").val().length > 0){
        cargarBlacklistVehiculoMaquinaria();
    }else{
	    mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
		$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
            $("#modalFiltroBlacklistVehMaq").modal("show");
		});
    }
}

function cargarBlacklistVehiculoMaquinaria(){
	$("#valBuscarBlacklistVehMaq").val("");
	
    $("#btnCancelarBlacklistVehMaq").hide();$("#btnNuevoBlacklistVehMaq").show();$("#btnEliminarBlacklistVehMaq").hide();
    $("#btnGuardarBlacklistVehMaq").hide();$("#btnFiltroBlacklistVehMaq").show();$("#btnResetFiltroBlacklistVehMaq").show();
	$("#valBuscarBlacklistVehMaq").show();$("#btnBuscarBlacklistVehMaq").show();$("#indicadorPaginaParcialAuxBlacklistVehMaq").show();
	$("#btnCambioBlacklistVehMaq").show();

    blacklistVehMaqBanderaEdicion = false;resizeDivWrapper("wrapBlacklistVehiculoMaquinaria",180);

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),fechaRegistroInicio:$("#fechaInicioFiltroBlacklistVehMaq").val(),
		fechaRegistroFin:$("#fechaFinFiltroBlacklistVehMaq").val()
    };
	
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/blacklist/vehiculo_maquinaria',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
		    listFullBlacklistVehMaq = data.listFullBlacklistVehMaq;
			
			busquedaActivaBlacklistVehMaq = 0,numPaginaActualBlacklistVehMaq = 1;

			cambiarPaginaBlacklistVehiculoMaquinaria();
			
			formatoCeldaSombreableTabla(true,"tblBlacklistVehiculoMaquinaria");
			
            goheadfixedY("#tblBlacklistVehiculoMaquinaria","#wrapBlacklistVehiculoMaquinaria");
        }else{
            console.error("BlacklistVehMaq: error al cargar el blacklist de vehículo/maquinaria. CODE_RESPONSE:",data.CODE_RESPONSE);

			$("#tblBlacklistVehiculoMaquinaria tbody tr").remove();
			$("#tblBlacklistVehiculoMaquinaria tbody").append(
			    "<tr><td colspan='8' style='text-align:center;color:#999;'>No se pudo cargar el historial. Vuelva a intentarlo con el botón de refresh.</td></tr>");

			$.unblockUI();
        }
    });
}

function cambiarPaginaBlacklistVehiculoMaquinaria(){
    $("#flechaIzquierdaBlacklistVehMaq").show();$("#flechaDerechaBlacklistVehMaq").show();

    var list = (busquedaActivaBlacklistVehMaq == 0?listFullBlacklistVehMaq:listFullBlacklistVehMaqBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualBlacklistVehMaq*partialSize)-partialSize;
    var finRegistro = (numPaginaActualBlacklistVehMaq*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasBlacklistVehMaq").html("<label>"+numPaginaActualBlacklistVehMaq+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualBlacklistVehMaq == 1){
        $("#flechaIzquierdaBlacklistVehMaq").hide();
    }

    if(numPaginaActualBlacklistVehMaq == numPaginaTotal){
        $("#flechaDerechaBlacklistVehMaq").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblBlacklistVehiculoMaquinaria tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
			var observacion = (val.observacion.length == 0?"------":val.observacion),
				registradoPor = (val.fechaCreacionTexto.length == 0?"------":val.fechaCreacionTexto+"<br>(Por "+val.usuarioCreacion.nombre+")"),
			    actualizadoPor = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto+"<br>(Por "+val.usuarioActualizacion.nombre+")");
				
			$("#tblBlacklistVehiculoMaquinaria tbody").append(
	            "<tr id='trBlacklistVehMaq"+val.id+"' onclick='editarBlacklistVehiculoMaquinaria("+index+")'>" +
				    "<td id='tdContratista"+val.id+"'>"+val.contratista.nombre+"</td>" + 
					"<td id='tdPlaca"+val.id+"'>"+val.placa+"</td>" + 
					"<td id='tdOtrosCont"+val.id+"'>"+val.otrosContratistas+"</td>" + 
					"<td id='tdFechaInicioVig"+val.id+"'>"+val.fechaInicioVigenciaTexto+"</td>" + 
					"<td id='tdFechaFinVig"+val.id+"'>"+val.fechaFinVigenciaTexto+"</td>" + 
					"<td id='tdObservacion"+val.id+"'>"+observacion+"</td>" +
					"<td id='tdEstadoActual"+val.id+"'>"+val.estadoActual+"</td>" +
					"<td id='tdRegistro"+val.id+"'>"+registradoPor+"</td>" + 
					"<td id='tdActualizacion"+val.id+"'>"+actualizadoPor+"</td>" + 
			    "</tr>");
        }
    });

    $.unblockUI();
}

function cancelarNuevoBlacklistVehiculoMaquinaria(){
    cargarBlacklistVehiculoMaquinaria();
}

function editarBlacklistVehiculoMaquinaria(pindex){
    if(!blacklistVehMaqBanderaEdicion){
        formatoCeldaSombreableTabla(false,"tblBlacklistVehiculoMaquinaria");
		
        blacklistVehMaqObj = (busquedaActivaBlacklistVehMaq == 0?listFullBlacklistVehMaq[pindex]:listFullBlacklistVehMaqBuscador[pindex]);
        blacklistVehMaqId = blacklistVehMaqObj.id;

        $("#trBlacklistVehMaq"+blacklistVehMaqId).addClass("fila-edicion");

        $("#tdFechaInicioVig"+blacklistVehMaqId).html("<input id='inputFechaInicioVigenciaBlacklistVehMaq' type='date' class='form-control'>");
        $("#inputFechaInicioVigenciaBlacklistVehMaq").val(convertirFechaInput(blacklistVehMaqObj.fechaInicioVigencia));

        $("#tdFechaFinVig"+blacklistVehMaqId).html("<input id='inputFechaFinVigenciaBlacklistVehMaq' type='date' class='form-control'>");
        $("#inputFechaFinVigenciaBlacklistVehMaq").val(convertirFechaInput(blacklistVehMaqObj.fechaFinVigencia));

		$("#tdObservacion"+blacklistVehMaqId).html("<textarea id='textoObservacionBlacklistVehMaq' class='form-control' rows='5'></textarea>");
		$("#textoObservacionBlacklistVehMaq").val(blacklistVehMaqObj.observacion);

		$("#tdEstadoActual"+blacklistVehMaqId).html("<label>*Automático.</label>");
        $("#tdActualizacion"+blacklistVehMaqId).html("<label>*Automático.</label>");
		
        blacklistVehMaqBanderaEdicion = true;

		$("#btnCancelarBlacklistVehMaq").show();$("#btnNuevoBlacklistVehMaq").hide();$("#btnEliminarBlacklistVehMaq").show();
		$("#btnGuardarBlacklistVehMaq").show();$("#btnFiltroBlacklistVehMaq").hide();$("#btnResetFiltroBlacklistVehMaq").hide();
		$("#valBuscarBlacklistVehMaq").hide();$("#btnBuscarBlacklistVehMaq").hide();$("#indicadorPaginaParcialAuxBlacklistVehMaq").hide();
		$("#btnCambioBlacklistVehMaq").hide();
    }
}

function nuevoBlacklistVehiculoMaquinaria(){
    if(!blacklistVehMaqBanderaEdicion){
        formatoCeldaSombreableTabla(false,"tblBlacklistVehiculoMaquinaria");
        blacklistVehMaqObj = {id: 0};blacklistVehMaqId = 0;

        $("#tblBlacklistVehiculoMaquinaria tbody").prepend(
            "<tr>" +
			    "<td><input id='inputContratistaBlacklistVehMaq' type='text' class='form-control'>" +
				    "<div id='divAutoCompletarContratistaBlacklistVehMaq'></div>" +
				    "<label>*Buscar contratista por RUC y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label></td>" +
				"<td><input id='inputPlacaBlacklistVehMaq' type='text' class='form-control'>" +
				    "<div id='divAutoCompletarPlacaBlacklistVehMaq'></div>" +
				    "<label>*Buscar vehículo/maquinaria por placa ingresando 3 caracteres como mínimo (antes debe seleccionar un contratista) [obligatorio].</label></td>" +
				"<td><label>*Automático.</label></td>" +
				"<td>"+"<input id='inputFechaInicioVigenciaBlacklistVehMaq' type='date' class='form-control'>"+"</td>" +
				"<td>"+"<input id='inputFechaFinVigenciaBlacklistVehMaq' type='date' class='form-control'>"+"</td>" +
				"<td><textarea id='textoObservacionBlacklistVehMaq' class='form-control' rows='5'></textarea>" +
				    "<label>*Opcional.</label></td>" +
				"<td><label>*Automático.</label></td>" +
                "<td><label>*Automático.</label></td>" +
                "<td><label>...</label></td>" +
            "</tr>");

        $("#inputContratistaBlacklistVehMaq").attr("onkeyup","verAutoCompletarContratistaBlacklistVehMaq()");
		document.getElementById("inputPlacaBlacklistVehMaq").disabled = true;
		
		verAutoCompletarContratistaBlacklistVehMaq();

		$("#btnCancelarBlacklistVehMaq").show();$("#btnNuevoBlacklistVehMaq").hide();$("#btnEliminarBlacklistVehMaq").hide();
		$("#btnGuardarBlacklistVehMaq").show();$("#btnFiltroBlacklistVehMaq").hide();$("#btnResetFiltroBlacklistVehMaq").hide();
		$("#valBuscarBlacklistVehMaq").hide();$("#btnBuscarBlacklistVehMaq").hide();$("#indicadorPaginaParcialAuxBlacklistVehMaq").hide();
		$("#btnCambioBlacklistVehMaq").hide();

        blacklistVehMaqBanderaEdicion = true;
    }else{
        alert("Guarde primero.");
    }
}

var listContratistaBuscadorBlacklistVehMaqAux = [];

function verAutoCompletarContratistaBlacklistVehMaq(){
    var contratista = $("#inputContratistaBlacklistVehMaq").val().trim();
	var busquedaHabilitada = (contratista.length >= 3?1:0);

    var dataParam={
	    nombre:"%"+contratista+"%",isBuscador:1,empresaId:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPostSimpleVersionDos(busquedaHabilitada,URL+"/contratista/buscar",dataParam,0,0,function(data){
    	listContratistaBuscadorBlacklistVehMaqAux = (busquedaHabilitada == 0 || data.contratistas.length == 0?[{id:-1,nombre:"Sin asignar"}]:data.contratistas);
    	 
	 	var selAutoContratistaBlacklistVehMaq = crearSelectOneMenuOblig("selAutoContratistaBlacklistVehMaq",
	    	"verValidacionCompletarVehiculoMaquinariaBlacklistVehMaq()",listContratistaBuscadorBlacklistVehMaqAux,"","id","nombre");
	
	 	$("#divAutoCompletarContratistaBlacklistVehMaq").html(selAutoContratistaBlacklistVehMaq);
	 	$("#inputContratistaBlacklistVehMaq").attr("onkeyup","verAutoCompletarContratistaBlacklistVehMaq()");
		
	 	verValidacionCompletarVehiculoMaquinariaBlacklistVehMaq();
    });
}

function verValidacionCompletarVehiculoMaquinariaBlacklistVehMaq(){
    var contratistaId = $("#selAutoContratistaBlacklistVehMaq").val();
   
    if(contratistaId != -1){
        document.getElementById("inputPlacaBlacklistVehMaq").disabled = false;
		 
        verAutoCompletarPlacaBlacklistVehMaq();
    }else{
        document.getElementById("inputPlacaBlacklistVehMaq").disabled = true; 
        $("#inputPlacaBlacklistVehMaq").val("");$("#divAutoCompletarPlacaBlacklistVehMaq").html("");
    }
}

var listPlacaBuscadorBlacklistVehMaqAux = [];

function verAutoCompletarPlacaBlacklistVehMaq(){
	var contratistaId = parseInt($("#selAutoContratistaBlacklistVehMaq").val());
    var placa = $("#inputPlacaBlacklistVehMaq").val().trim();
	var busquedaHabilitada = (placa.length >= 3?1:0);
   
    var dataParam={
        placa:"%"+placa+"%",isBuscador:1,contratistaId:contratistaId
    };

    callAjaxPostSimpleVersionDos(busquedaHabilitada,URL+"/contratista/vehiculo_maquinaria/buscar/simple",dataParam,0,0,function(data){
       	listPlacaBuscadorBlacklistVehMaqAux = (busquedaHabilitada == 0 || data.vehiculosMaquinarias.length == 0?[{id:-1,placa:"Sin asignar"}]:data.vehiculosMaquinarias);
       	 
   	 	var selAutoPlacaBlacklistVehMaq = crearSelectOneMenuOblig("selAutoPlacaBlacklistVehMaq",
   	    	"",listPlacaBuscadorBlacklistVehMaqAux,"","id","placa");
   	
   	 	$("#divAutoCompletarPlacaBlacklistVehMaq").html(selAutoPlacaBlacklistVehMaq);
   	 	$("#inputPlacaBlacklistVehMaq").attr("onkeyup","verAutoCompletarPlacaBlacklistVehMaq()");
    });
}

function guardarBlacklistVehiculoMaquinaria(){
    var campoVacio = true;
	
	var contratistaId = (blacklistVehMaqId == 0?parseInt($("#selAutoContratistaBlacklistVehMaq").val()):null),
	    vehiculoMaquinariaId = (blacklistVehMaqId == 0?parseInt($("#selAutoPlacaBlacklistVehMaq").val()):null);
	
    var fechaInicioVigencia = convertirFechaTexto($("#inputFechaInicioVigenciaBlacklistVehMaq").val());
    var inputFechaInicioVigencia = (!fechaInicioVigencia?null:fechaInicioVigencia);
    
    var fechaFinVigencia = convertirFechaTexto($("#inputFechaFinVigenciaBlacklistVehMaq").val());
    var inputFechaFinVigencia = (!fechaFinVigencia?null:fechaFinVigencia);
   
    var observacion = $("#textoObservacionBlacklistVehMaq").val();
   
    if((blacklistVehMaqId == 0 && (isNaN(contratistaId) || contratistaId == -1 || isNaN(vehiculoMaquinariaId) || vehiculoMaquinariaId == -1)) || 
	    inputFechaInicioVigencia == null || inputFechaFinVigencia == null){
        mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>";campoVacio = false;
    }else{
        var numDiasVigencia = restaFechas($("#inputFechaInicioVigenciaBlacklistVehMaq").val(),$("#inputFechaFinVigenciaBlacklistVehMaq").val());
	  
        if(numDiasVigencia < 0){
	        mensajeUx = "<label>La fecha fin de vigencia no puede ser menor que la fecha inicio de vigencia.</label>";campoVacio = false; 
        }
   	}
   
    if(campoVacio){
        var dataParam={
    	    id:blacklistVehMaqId,fechaInicioVigencia:inputFechaInicioVigencia,fechaFinVigencia:inputFechaFinVigencia,observacion:observacion,
    	    empresaId:parseInt(getSession("gestopcompanyid")),contratistaId:contratistaId
        };
      
        if(blacklistVehMaqId == 0){
			listPlacaBuscadorBlacklistVehMaqAux.forEach(function(val){
				if(val.id == vehiculoMaquinariaId){
					 dataParam.placa = val.placa;
				}
			});
        }
        
        callAjaxPostSimpleVersionDos(1,URL+'/contratista/blacklist/vehiculo_maquinaria/save',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":  
	                mensajeUx="<label>El registro 'sanción - vehículo/maquinaria' fue guardado correctamente.</label>";
	          		mensajesUx(mensajeUx,1,"","ActualizarBlacklistVehMaq"); 
									   
	          		$("#modalMensajeUxActualizarBlacklistVehMaq").on("hidden.bs.modal",function(){
	            	    cargarBlacklistVehiculoMaquinaria();  
	        	  	});
			
	       			break;
							
            	default:
	       			alert("Ocurrió un error al guardar el registro 'sanción - vehículo/maquinaria'");
         	}
      	});
   	}else{
        mensajesUx(mensajeUx,2,"");
   	}	
} 

function eliminarBlacklistVehiculoMaquinaria(){
    mensajeUx="<label>¿Está seguro de eliminar el registro 'Sanción - vehículo/maquinaria' seleccionado?</label>";
    mensajesUx(mensajeUx,3,"","EliminarBlacklistVehMaq");

    $("#btnDevolverValorEliminarBlacklistVehMaq").on("click",function(){
        var dataParam={
            id:blacklistVehMaqId
        };

        callAjaxPost(URL+'/contratista/blacklist/vehiculo_maquinaria/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    mensajeUx="<label>El registro 'Sanción - vehículo/maquinaria' seleccionado se ha eliminado correctamente.</label>";
               		mensajesUx(mensajeUx,1,"","ActualizarBlacklistVehMaq");

               		$("#modalMensajeUxActualizarBlacklistVehMaq").on("hidden.bs.modal",function(){
        	   			cargarBlacklistVehiculoMaquinaria();   
               		});
               
					break;
			
            	default:
               		alert("Ocurrió un error al eliminar el registro 'Sanción - vehículo/maquinaria'!");
         	}
      	});
   	});
}

function aplicarBuscadorBlacklistVehiculoMaquinaria(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valorBuscador = igualarStringBuscar($("#valBuscarBlacklistVehMaq").val());
    listFullBlacklistVehMaqBuscador = [];busquedaActivaBlacklistVehMaq = 1;numPaginaActualBlacklistVehMaq = 1;

    listFullBlacklistVehMaq.forEach(function(val){
        if(igualarStringBuscar(val.contratista.nombre).indexOf(valorBuscador) != -1 ||
            igualarStringBuscar(val.placa).indexOf(valorBuscador) != -1){
            listFullBlacklistVehMaqBuscador.push(val);
        }
    });

    cambiarPaginaBlacklistVehiculoMaquinaria();
}

function reiniciarBuscadorBlacklistVehiculoMaquinaria(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    $("#valBuscarBlacklistVehMaq").val("").focus();
    busquedaActivaBlacklistVehMaq = 0;numPaginaActualBlacklistVehMaq = 1;

    cambiarPaginaBlacklistVehiculoMaquinaria();
}
