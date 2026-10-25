
var regAccesoVehMaqVdId,indexRegAccesoVehMaqVd,regAccesoVehMaqVdObj={};
var busquedaActivaRegAccVehMaqVd,numPaginaActualRegAccVehMaqVd;

var listFullRegistrosAccesoVehMaqVd = [],listTipoAccesoPersonalRegAccVehMaqVd = [],listFullRegistrosAccesoVehMaqBuscadorVd = [];
var mensajeUx;

function toggleMenuOpcionRegistroAccesoVehiculoMaquinariaVd(obj,pindex){
	regAccesoVehMaqVdObj = listFullRegistrosAccesoVehMaqVd[pindex];
	indexRegAccesoVehMaqVd = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesRegistroAccesoVehiculoMaquinariaVd=[];

function marcarSubOpcionRegistroAccesoVehiculoMaquinariaVd(pindex){
	funcionalidadesRegistroAccesoVehiculoMaquinariaVd[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalRegistroAccesoVehiculoMaquinariaVd(){
	$("#modalPrincipalRegAccesoVehMaqVd").modal("hide");$("#modalPrevioRegistroAccesoVd").modal("show");
}

function verRegistroAccesoVehiculoMaquinariaVd(){
	$("#modalPrevioRegistroAccesoVd").modal("hide");$("#modalPrincipalRegAccesoVehMaqVd").remove();

	var listModal={
		id:"modalPrincipalRegAccesoVehMaqVd",nombre:"Historial de registro del acceso - vehículo/maquinaria",btnCerrarHabilitado:0,
		contenido:"<div id='estadoMovilPrincipalRegAccesoVehMaqVd' class='eventoGeneral-moderno'></div>",contenidoClassAux:"modal-content-moderno"
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	crearFiltroRegistroAccesoVehiculoMaquinariaVd(valoresFiltroRegistroAccesoVehiculoMaquinariaVd);
}

function ocultarFiltroRegistroAccesoVehiculoMaquinariaVd(){
    $("#modalFiltroRegistroAccesoVehMaqVd").modal("hide");$("#modalPrincipalRegAccesoVehMaqVd").modal("show");
}

function verFiltroRegistroAccesoVehiculoMaquinariaVd(){
    $("#modalPrincipalRegAccesoVehMaqVd").modal("hide");$("#modalFiltroRegistroAccesoVehMaqVd").modal("show");
}

function crearFiltroRegistroAccesoVehiculoMaquinariaVd(functionCallBack){
	$("#modalPrincipalRegAccesoVehMaqVd").modal("hide");$("#modalFiltroRegistroAccesoVehMaqVd").remove();
	
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };
	  		
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_vehiculo_maquinaria/filtro',dataParam,1,1,function(data){
        listTipoAccesoPersonalRegAccVehMaqVd = data.listTipoAccesoPersonal;

        var contenido = "";
  				
        var listContenido=[
  	        {label:"Fecha de registro - Inicio",inputForm:"<input type='date' id='fechaInicioFiltroRegAccVehMaqVd' class='form-control'>"},
  	        {label:"Fecha de registro - Fin",inputForm:"<input type='date' id='fechaFinFiltroRegAccVehMaqVd' class='form-control'>"},
  	        {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	        {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroRegistroAccesoVehiculoMaquinariaVd()'>" +
               	       "<i class='fa fa-times'></i> Cancelar" +
               	   "</button>",
  	         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='valoresFiltroRegistroAccesoVehiculoMaquinariaVd()'>" +
  	                       "<i class='fa fa-filter'></i> Aplicar" +
  	                   "</button>"}
        ]; 
  				
        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionTres(val);
        });
   
        var modalOptions={
 	        id:"modalFiltroRegistroAccesoVehMaqVd",nombre:"<i class='fa fa-filter'></i> Filtros",
  	        contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
        };
  				
        crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
        var hoy = getSession("fechaHoyOrdenInversoTexto");
   
        $("#fechaInicioFiltroRegAccVehMaqVd").val(hoy);$("#fechaFinFiltroRegAccVehMaqVd").val(hoy);
		
	    functionCallBack();
    });
}

function valoresFiltroRegistroAccesoVehiculoMaquinariaVd(){
    $("#modalFiltroRegistroAccesoVehMaqVd").modal("hide"); 
    
    if($("#fechaInicioFiltroRegAccVehMaqVd").val().length > 0 && $("#fechaFinFiltroRegAccVehMaqVd").val().length > 0){
		$("#modalPrincipalRegAccesoVehMaqVd").modal("show");
		
        cargarRegistroAccesoVehiculoMaquinariaVd();
    }else{
	    mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
		$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	        $("#modalFiltroRegistroAccesoVehMaqVd").modal("show");
		});
    }
}

function cargarRegistroAccesoVehiculoMaquinariaVd(){
	$("#estadoMovilPrincipalRegAccesoVehMaqVd").html("");

	var dataParam={
		empresaId:parseInt(getSession("gestopcompanyid")),tipoAccesoId:parseInt(getSession("accesoUsuarios")),
		fechaRegistroInicio:$("#fechaInicioFiltroRegAccVehMaqVd").val(),fechaRegistroFin:$("#fechaFinFiltroRegAccVehMaqVd").val()
	};

	callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_vehiculo_maquinaria',dataParam,1,0,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];

			numPaginaActualRegAccVehMaqVd = 1;listFullRegistrosAccesoVehMaqVd = data.listFullRegistrosAccesoVehMaq;
			
			var btnFiltro = "<button type='button' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
						            "onclick='verFiltroRegistroAccesoVehiculoMaquinariaVd()' title='Ver filtro.'>" +
			        "<i class='fa fa-filter fa-4x'></i>" +
			    "</button>";

			var btnIzqCambioPag = "<button type='button' id='btnFlechaIzquierdaRegAccVehMaqVd' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
			                              "onclick='regresarListaIzquierdaRegAccVehMaqVd()' title='Regresar a la lista anterior.'>" +
			        "<i class='fa fa-chevron-left fa-4x'></i>" +
			    "</button>";

			var btnDerCambioPag = "<button type='button' id='btnFlechaDerechaRegAccVehMaqVd' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
			                              "onclick='siguienteListaDerechaRegAccVehMaqVd()' title='Cambiar a la siguiente lista.'>" +
			        "<i class='fa fa-chevron-right fa-4x'></i>" +
			    "</button>";

			listPanelesPrincipal.push({id:"volverRegAccesoVehMaqVd",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalRegistroAccesoVehiculoMaquinariaVd()",
				 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""},
				{id:"opcionesRegAccesoVehMaqVd",clase:"",styleAux:"",habilitarBtnSimple:0,buttonAd:btnFiltro,btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"Opciones",contenido:""},
			    {id:"registroRegAccesoVehMaqVd",clase:"",styleAux:"",habilitarBtnSimple:0,buttonAd:btnDerCambioPag+btnIzqCambioPag,btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",
				 nombre:"Historial de registro del acceso vehículo/maquinaria registradas ("+listFullRegistrosAccesoVehMaqVd.length+") [página <label id='labelEstadoPagActualRegAccVehMaqVd'></label>]",contenido:""});
					
			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalRegAccesoVehMaqVd");

			cambiarPaginaPrincipalRegistroAccesoVehiculoMaquinariaVd();
		}else{
			console.log("NOPNPO")
		}
	});
}

function regresarListaIzquierdaRegAccVehMaqVd(){
    numPaginaActualRegAccVehMaqVd = numPaginaActualRegAccVehMaqVd-1;

    cambiarPaginaPrincipalRegistroAccesoVehiculoMaquinariaVd();
}

function siguienteListaDerechaRegAccVehMaqVd(){
    numPaginaActualRegAccVehMaqVd = numPaginaActualRegAccVehMaqVd+1;

    cambiarPaginaPrincipalRegistroAccesoVehiculoMaquinariaVd();
}

function cambiarPaginaPrincipalRegistroAccesoVehiculoMaquinariaVd(){
    $("#btnFlechaIzquierdaRegAccVehMaqVd").show();$("#btnFlechaDerechaRegAccVehMaqVd").show();

    var list = listFullRegistrosAccesoVehMaqVd;
    var totalSize = list.length;
    var partialSize = 10;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualRegAccVehMaqVd*partialSize)-partialSize;
    var finRegistro = (numPaginaActualRegAccVehMaqVd*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelEstadoPagActualRegAccVehMaqVd").html(numPaginaActualRegAccVehMaqVd+" de "+numPaginaTotal);

    if(numPaginaActualRegAccVehMaqVd == 1){
        $("#btnFlechaIzquierdaRegAccVehMaqVd").hide();
    }

    if(numPaginaActualRegAccVehMaqVd == numPaginaTotal){
        $("#btnFlechaDerechaRegAccVehMaqVd").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#registroRegAccesoVehMaqVd .contenidoSubList").html("");

    var textTotalRegistros = "";

    listFullRegistrosAccesoVehMaqVd.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
			var btnOpcion="",menuOpcion="";

			//menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
			//funcionalidadesRegistroAccesoVehiculoMaquinariaVd.forEach(function(val1,index1){
			//    menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionRegistroAccesoVehiculoMaquinariaVd("+index1+")'>"+val1.nombre+"</li>";
			//});
			//menuOpcion += "</ul>";
			//
			//btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionRegistroAccesoVehiculoMaquinariaVd(this,"+index+")'>" +
			//    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			//"</a>";

			var detalle = (val.detalle.length == 0?"------":val.detalle),observacion = (val.observacion.length == 0?"------":val.observacion),
				registradoPor = (val.fechaRegistroTexto.length == 0?"------":val.fechaRegistroTexto+"<br>(Por "+val.registradoPor+")"),
				actualizadoPor = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto+"<br>(Por "+val.actualizadoPor+")");

			var listTotal=[
				{label:"Contratista:",inputForm:val.contratista.nombre+btnOpcion+menuOpcion},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"Placa:",inputForm:val.vehiculoMaquinaria.placa},
				{label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				{label:"Tipo:",inputForm:val.tipoAccesoPersonal.nombre},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"Estado:",inputForm:val.tipoEstadoAcceso.nombre},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"Observación:",inputForm:observacion},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"Detalle:",inputForm:detalle},
			];

			if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
			    listTotal.push({label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante});
			}

			if(val.fechaRegistroTexto.length > 0){
				listTotal.push({label:"Registrado el",inputForm:registradoPor});
			}

			if(val.fechaActualizacionTexto.length > 0){
				listTotal.push({label:"Actualizado el",inputForm:actualizadoPor});
			}

			textTotalRegistros += "<div class='eventoGeneral'>" +
								      "<form class='eventoGeneral'>";
				listTotal.forEach(function(val){
					textTotalRegistros += obtenerSubPanelModuloVersionTres(val);
				});
			textTotalRegistros +=     "</form>" +
								  "</div>";
        }
    });

    $("#registroRegAccesoVehMaqVd .contenidoSubList").html(textTotalRegistros);

    $.unblockUI();
}

var paramRegAccVehMaqVdAuxObj;
var tipoAccesoPersonalIdVdAux;

function nuevoRegistroAccesoVehiculoMaquinariaVd(){
	$("#modalEstadoActualVehiculoMaquinariaOpcGenCont").modal("hide");$("#modalFormRegistroAccesoVehMaqVd").remove();
	
	var dataParam={
	    empresaId:parseInt(getSession("gestopcompanyid"))
    };
	
	callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_vehiculo_maquinaria/filtro',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			regAccesoVehMaqVdId = 0;
	
			paramRegAccVehMaqVdAuxObj = {licenciasHabilitadas:""};
	
			var estadoAcceso = (booleanHabilitadoRegAccVehMaq?"Habilitado":"No habilitado");
		
    		var selTipoAccesoPersonalRegAccVehMaqVd = crearSelectOneMenuOblig("selTipoAccesoPersonalRegAccVehMaqVd","",data.listTipoAccesoPersonal,"1","id","nombre");	
	    
			var contenido = "";

			var listContenido=[
	    		{label:"Contratista:",inputForm:vehiculoMaquinariaOpcGenContObj.contratistaNombre},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"Placa:",inputForm:vehiculoMaquinariaOpcGenContObj.placa},
				{label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				{label:"Estado:",inputForm:estadoAcceso},
    		    {label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				{label:"Tipo:",inputForm:selTipoAccesoPersonalRegAccVehMaqVd},
				{label:"",inputForm:"",styleTotal:styleLineaDegradada},
	    		{anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observación:",inputForm:""},
	    		{anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textObservacionRegAccVehMaqVd' class='form-control' rows='4'></textarea>"},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Detalle:",inputForm:""},
				{anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textDetalleRegAccVehMaqVd' class='form-control' rows='4'></textarea>"},
				{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
				{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='cancelarRegistroAccesoVehiculoMaquinariaVd()'>" +
		           		   "<i class='fa fa-times'></i> Cancelar" +
		       		   "</button>",
		 		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='validacionPreviaGuardarRegistroAccesoVehiculoMaquinariaVd()'>" +
		               		   "<i class='fa fa-floppy-o'></i> Guardar" +
		           		   "</button>"}
			];
				   
    		listContenido.forEach(function(val){
        		contenido += obtenerSubPanelModuloVersionTres(val);
			});
	 		
			var modalOptions={
				id:"modalFormRegistroAccesoVehMaqVd",nombre:"<i class='fa fa-pencil'></i> Registro de acceso del vehículo/maquinaria",
				contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    		};
					
			crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    	}else{
		    console.log("NOPNPO");
    	}
	});
}

function cancelarRegistroAccesoVehiculoMaquinariaVd(){
	$("#modalFormRegistroAccesoVehMaqVd").modal("hide");$("#modalPrevioRegistroAccesoVd").modal("show");
}


function validacionPreviaGuardarRegistroAccesoVehiculoMaquinariaVd(){
	$("#modalFormRegistroAccesoVehMaqVd").modal("hide");
	
	mensajeUx="<label>*Una vez guardado el registro de acceso no podrá modificarlo/eliminarlo." +
	    "<br><br>Por favor, dar click en 'Aceptar' para proceder con la acción respectiva.</label>";
    mensajesUx(mensajeUx,3,"","ConfirmRegAccVehMaq");
	    
	$("#btnDevolverValorConfirmRegAccVehMaq").on("click",function(){
		guardarRegistroAccesoVehiculoMaquinariaVd();
    });
	        
	$("#btnRegresarPrevioConfirmRegAccVehMaq").on("click",function(){
	    $("#modalFormRegistroAccesoVehMaqVd").modal("show"); 
	});
}

function guardarRegistroAccesoVehiculoMaquinariaVd(){
	var campoVacio = true;
	
	var contratistaId = vehiculoMaquinariaOpcGenContObj.contratistaId;
	var vehiculoMaquinariaId = vehiculoMaquinariaOpcGenContObj.id;
	var tipoAccesoPersonalId = parseInt($("#selTipoAccesoPersonalRegAccVehMaqVd").val());
	var tipoEstadoAccesoId = (booleanHabilitadoRegAccVehMaq?1:2);
	var observacion = $("#textObservacionRegAccVehMaqVd").val().trim();
	var detalle = $("#textDetalleRegAccVehMaqVd").val().trim();
	
    if(campoVacio){
	    var dataParam={
		    id:regAccesoVehMaqVdId,contratistaId:contratistaId,vehiculoMaquinariaId:vehiculoMaquinariaId,tipoAccesoPersonalId:tipoAccesoPersonalId,
			tipoEstadoAccesoId:tipoEstadoAccesoId,observacion:observacion,detalle:detalle,empresaId:parseInt(getSession("gestopcompanyid"))
	    };
	      
		callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_vehiculo_maquinaria/save',dataParam,1,1,function(data){
	        switch(data.CODE_RESPONSE){
		        case "05":
					$("#modalFormRegistroAccesoVehMaqVd").modal("hide");	
				
			        mensajeUx = "<label>El registro del acceso de vehículo/maquinaria fue guardado con éxito.</label>"; 
	    	        mensajesUx(mensajeUx,1,"","ActualizarRegAccVehMaq");
			    
	    	        $("#modalMensajeUxActualizarRegAccVehMaq").on("hidden.bs.modal",function(){
	    	            $("#modalPrevioRegistroAccesoVd").modal("show");
	    	        });
								 
		            break;
							
		        default:
		            console.log("Ocurrió un error al guardar el registro del acceso de vehículo/maquinaria!");
	        }
	    });
    }else{
		$("#modalFormRegistroAccesoVehMaqVd").modal("hide");
		
	    mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>"; 
	    mensajesUx(mensajeUx,2,"","ActualizarRegAccVehMaq");
		
		$("#modalMensajeUxActualizarRegAccVehMaq").on("hidden.bs.modal",function(){
		    $("#modalFormRegistroAccesoVehMaqVd").modal("show");
		});
	}
}
