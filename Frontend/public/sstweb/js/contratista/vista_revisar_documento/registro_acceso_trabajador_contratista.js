
var regAccesoTrabContVdId,indexRegAccesoTrabContVd,regAccesoTrabContVdObj={};
var busquedaActivaRegAccTrabContVd,numPaginaActualRegAccTrabContVd;

var listFullRegistrosAccesoTrabContVd = [],listTipoAccesoPersonalRegAccTrabContVd = [],listFullRegistrosAccesoTrabContBuscadorVd = [];
var mensajeUx;

function toggleMenuOpcionRegistroAccesoTrabajadorContratistaVd(obj,pindex){
	regAccesoTrabContVdObj = listFullRegistrosAccesoTrabContVd[pindex];
	indexRegAccesoTrabContVd = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesRegistroAccesoTrabajadorContratistaVd=[];

function marcarSubOpcionRegistroAccesoTrabajadorContratistaVd(pindex){
	funcionalidadesRegistroAccesoTrabajadorContratistaVd[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalRegistroAccesoTrabajadorContratistaVd(){
	$("#modalPrincipalRegAccesoTraContVd").modal("hide");$("#modalPrevioRegistroAccesoVd").modal("show");
}

function verRegistroAccesoTrabajadorContratistaVd(){
	$("#modalPrevioRegistroAccesoVd").modal("hide");$("#modalPrincipalRegAccesoTraContVd").remove();

	var listModal={
		id:"modalPrincipalRegAccesoTraContVd",nombre:"Historial de registro del acceso - trabajador contratista",btnCerrarHabilitado:0,
		contenido:"<div id='estadoMovilPrincipalRegAccesoTraContVd' class='eventoGeneral-moderno'></div>",contenidoClassAux:"modal-content-moderno"
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	crearFiltroRegistroAccesoTrabajadorContratistaVd(valoresFiltroRegistroAccesoTrabajadorContratistaVd);
}

function ocultarFiltroRegistroAccesoTrabajadorContratistaVd(){
    $("#modalFiltroRegistroAccesoTrabContVd").modal("hide");$("#modalPrincipalRegAccesoTraContVd").modal("show");
}

function verFiltroRegistroAccesoTrabajadorContratistaVd(){
    $("#modalPrincipalRegAccesoTraContVd").modal("hide");$("#modalFiltroRegistroAccesoTrabContVd").modal("show");
}

function crearFiltroRegistroAccesoTrabajadorContratistaVd(functionCallBack){
	$("#modalPrincipalRegAccesoTraContVd").modal("hide");$("#modalFiltroRegistroAccesoTrabContVd").remove();
	
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };
	  		
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_trabajador_contratista/filtro',dataParam,1,1,function(data){
        listTipoAccesoPersonalRegAccTrabContVd = data.listTipoAccesoPersonal;

        var contenido = "";
  				
        var listContenido=[
  	        {label:"Fecha de registro - Inicio",inputForm:"<input type='date' id='fechaInicioFiltroRegAccTrabContVd' class='form-control'>"},
  	        {label:"Fecha de registro - Fin",inputForm:"<input type='date' id='fechaFinFiltroRegAccTrabContVd' class='form-control'>"},
  	        {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	        {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroRegistroAccesoTrabajadorContratistaVd()'>" +
               	       "<i class='fa fa-times'></i> Cancelar" +
               	   "</button>",
  	         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='valoresFiltroRegistroAccesoTrabajadorContratistaVd()'>" +
  	                       "<i class='fa fa-filter'></i> Aplicar" +
  	                   "</button>"}
        ]; 
  				
        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionTres(val);
        });
   
        var modalOptions={
 	        id:"modalFiltroRegistroAccesoTrabContVd",nombre:"<i class='fa fa-filter'></i> Filtros",
  	        contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
        };
  				
        crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
        var hoy = getSession("fechaHoyOrdenInversoTexto");
   
        $("#fechaInicioFiltroRegAccTrabContVd").val(hoy);$("#fechaFinFiltroRegAccTrabContVd").val(hoy);
		
	    functionCallBack();
    });
}

function valoresFiltroRegistroAccesoTrabajadorContratistaVd(){
    $("#modalFiltroRegistroAccesoTrabContVd").modal("hide"); 
    
    if($("#fechaInicioFiltroRegAccTrabContVd").val().length > 0 && $("#fechaFinFiltroRegAccTrabContVd").val().length > 0){
		$("#modalPrincipalRegAccesoTraContVd").modal("show");
		
        cargarRegistroAccesoTrabajadorContratistaVd();
    }else{
	    mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
		$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	        $("#modalFiltroRegistroAccesoTrabContVd").modal("show");
		});
    }
}

function cargarRegistroAccesoTrabajadorContratistaVd(){
	$("#estadoMovilPrincipalRegAccesoTraContVd").html("");

	var dataParam={
		empresaId:parseInt(getSession("gestopcompanyid")),tipoAccesoId:parseInt(getSession("accesoUsuarios")),
		fechaRegistroInicio:$("#fechaInicioFiltroRegAccTrabContVd").val(),fechaRegistroFin:$("#fechaFinFiltroRegAccTrabContVd").val()
	};

	callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_trabajador_contratista',dataParam,1,0,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];

			numPaginaActualRegAccTrabContVd = 1;listFullRegistrosAccesoTrabContVd = data.listFullRegistrosAccesoTrabCont;
			
			var btnFiltro = "<button type='button' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
						            "onclick='verFiltroRegistroAccesoTrabajadorContratistaVd()' title='Ver filtro.'>" +
			        "<i class='fa fa-filter fa-4x'></i>" +
			    "</button>";

			var btnIzqCambioPag = "<button type='button' id='btnFlechaIzquierdaRegAccTrabContVd' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
			                              "onclick='regresarListaIzquierdaRegAccTrabContVd()' title='Regresar a la lista anterior.'>" +
			        "<i class='fa fa-chevron-left fa-4x'></i>" +
			    "</button>";

			var btnDerCambioPag = "<button type='button' id='btnFlechaDerechaRegAccTrabContVd' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
			                              "onclick='siguienteListaDerechaRegAccTrabContVd()' title='Cambiar a la siguiente lista.'>" +
			        "<i class='fa fa-chevron-right fa-4x'></i>" +
			    "</button>";

			listPanelesPrincipal.push({id:"volverRegAccesoTraContVd",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalRegistroAccesoTrabajadorContratistaVd()",
				 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""},
				{id:"opcionesRegAccesoTraContVd",clase:"",styleAux:"",habilitarBtnSimple:0,buttonAd:btnFiltro,btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"Opciones",contenido:""},
			    {id:"registroRegAccesoTraContVd",clase:"",styleAux:"",habilitarBtnSimple:0,buttonAd:btnDerCambioPag+btnIzqCambioPag,btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",
				 nombre:"Historial de registro del acceso trabajador contratista registradas ("+listFullRegistrosAccesoTrabContVd.length+") [página <label id='labelEstadoPagActualRegAccTrabContVd'></label>]",contenido:""});
					
			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalRegAccesoTraContVd");

			cambiarPaginaPrincipalRegistroAccesoTrabajadorContratistaVd();
		}else{
			console.log("NOPNPO")
		}
	});
}

function regresarListaIzquierdaRegAccTrabContVd(){
    numPaginaActualRegAccTrabContVd = numPaginaActualRegAccTrabContVd-1;

    cambiarPaginaPrincipalRegistroAccesoTrabajadorContratistaVd();
}

function siguienteListaDerechaRegAccTrabContVd(){
    numPaginaActualRegAccTrabContVd = numPaginaActualRegAccTrabContVd+1;

    cambiarPaginaPrincipalRegistroAccesoTrabajadorContratistaVd();
}

function cambiarPaginaPrincipalRegistroAccesoTrabajadorContratistaVd(){
    $("#btnFlechaIzquierdaRegAccTrabContVd").show();$("#btnFlechaDerechaRegAccTrabContVd").show();

    var list = listFullRegistrosAccesoTrabContVd;
    var totalSize = list.length;
    var partialSize = 10;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualRegAccTrabContVd*partialSize)-partialSize;
    var finRegistro = (numPaginaActualRegAccTrabContVd*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelEstadoPagActualRegAccTrabContVd").html(numPaginaActualRegAccTrabContVd+" de "+numPaginaTotal);

    if(numPaginaActualRegAccTrabContVd == 1){
        $("#btnFlechaIzquierdaRegAccTrabContVd").hide();
    }

    if(numPaginaActualRegAccTrabContVd == numPaginaTotal){
        $("#btnFlechaDerechaRegAccTrabContVd").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#registroRegAccesoTraContVd .contenidoSubList").html("");

    var textTotalRegistros = "";

    listFullRegistrosAccesoTrabContVd.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
			var btnOpcion="",menuOpcion="";

			//menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
			//funcionalidadesRegistroAccesoTrabajadorContratistaVd.forEach(function(val1,index1){
			//    menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionRegistroAccesoTrabajadorContratistaVd("+index1+")'>"+val1.nombre+"</li>";
			//});
			//menuOpcion += "</ul>";
			//
			//btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionRegistroAccesoTrabajadorContratistaVd(this,"+index+")'>" +
			//    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			//"</a>";

			var snConductorTexto = (val.snConductor > 0?"Sí":"No"),detalle = (val.detalle.length == 0?"------":val.detalle),
				observacion = (val.observacion.length == 0?"------":val.observacion),
				consultaLicenciasHabilitadas = (val.consultaLicenciasHabilitadas.length == 0?"------":val.consultaLicenciasHabilitadas),
				registradoPor = (val.fechaRegistroTexto.length == 0?"------":val.fechaRegistroTexto+"<br>(Por "+val.registradoPor+")"),
				actualizadoPor = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto+"<br>(Por "+val.actualizadoPor+")");

			var listTotal=[
				{label:"Contratista:",inputForm:val.contratista.nombre+btnOpcion+menuOpcion},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"Proyecto:",inputForm:val.proyecto.titulo},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"Trabajador(a):",inputForm:val.trabajadorContratista.nombre},
				{label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				{label:"Tipo:",inputForm:val.tipoAccesoPersonal.nombre},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"Estado:",inputForm:val.tipoEstadoAcceso.nombre},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"¿Es conductor?:",inputForm:snConductorTexto},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{label:"Tipo(s) de licencia(s) habilitadas:",inputForm:consultaLicenciasHabilitadas},
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

    $("#registroRegAccesoTraContVd .contenidoSubList").html(textTotalRegistros);

    $.unblockUI();
}

var paramRegAccTrabContVdAuxObj;
var tipoAccesoPersonalIdVdAux;

function nuevoRegistroAccesoTrabajadorContratistaVd(){
	$("#modalEstadoActualTrabajadorContratistaOpcGenCont").modal("hide");$("#modalFormRegistroAccesoTrabContVd").remove();
	
	var dataParam={
	    empresaId:parseInt(getSession("gestopcompanyid"))
    };
	
	callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_trabajador_contratista/filtro',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			regAccesoTrabContVdId = 0;
	
			paramRegAccTrabContVdAuxObj = {licenciasHabilitadas:""};
	
			var estadoAcceso = (booleanHabilitadoRegAccTrabCont?"Habilitado":"No habilitado"),snConductorTexto = (conductorAuxOpcGenContObj.id > 0?"Sí":"No");
		
    		var selTipoAccesoPersonalRegAccTrabContVd = crearSelectOneMenuOblig("selTipoAccesoPersonalRegAccTrabContVd","",data.listTipoAccesoPersonal,"1","id","nombre");	
	    
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
		
				paramRegAccTrabContVdAuxObj.licenciasHabilitadas = licenciasHabilitadas;
		
				listContenido.push({label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		    		{label:"Tipo(s) de licencia(s) habilitadas:",inputForm:licenciasHabilitadas});	     
			}
	
    		listContenido.push({label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				{label:"Tipo:",inputForm:selTipoAccesoPersonalRegAccTrabContVd},
				{label:"",inputForm:"",styleTotal:styleLineaDegradada},
	    		{anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observación:",inputForm:""},
	    		{anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textObservacionRegAccTrabContVd' class='form-control' rows='4'></textarea>"},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Detalle:",inputForm:""},
				{anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textDetalleRegAccTrabContVd' class='form-control' rows='4'></textarea>"},
				{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
				{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='cancelarRegistroAccesoTrabajadorContratistaVd()'>" +
		           		   "<i class='fa fa-times'></i> Cancelar" +
		       		   "</button>",
		 		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='validacionPreviaGuardarRegistroAccesoTrabajadorContratistaVd()'>" +
		               		   "<i class='fa fa-floppy-o'></i> Guardar" +
		           		   "</button>"});
				   
    		listContenido.forEach(function(val){
        		contenido += obtenerSubPanelModuloVersionTres(val);
			});
	 		
			var modalOptions={
				id:"modalFormRegistroAccesoTrabContVd",nombre:"<i class='fa fa-pencil'></i> Registro de acceso del trabajador contratista",
				contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    		};
					
			crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    	}else{
		    console.log("NOPNPO");
    	}
	});	
}

function cancelarRegistroAccesoTrabajadorContratistaVd(){
	$("#modalFormRegistroAccesoTrabContVd").modal("hide");$("#modalPrevioRegistroAccesoVd").modal("show");
}


function validacionPreviaGuardarRegistroAccesoTrabajadorContratistaVd(){
	$("#modalFormRegistroAccesoTrabContVd").modal("hide");
	
	mensajeUx="<label>*Una vez guardado el registro de acceso no podrá modificarlo/eliminarlo." +
	    "<br><br>Por favor, dar click en 'Aceptar' para proceder con la acción respectiva.</label>";
    mensajesUx(mensajeUx,3,"","ConfirmRegAccTrabCont");
	    
	$("#btnDevolverValorConfirmRegAccTrabCont").on("click",function(){
		guardarRegistroAccesoTrabajadorContratistaVd();
    });
	        
	$("#btnRegresarPrevioConfirmRegAccTrabCont").on("click",function(){
	    $("#modalFormRegistroAccesoTrabContVd").modal("show"); 
	});
}

function guardarRegistroAccesoTrabajadorContratistaVd(){
	var campoVacio = true;
	
	var contratistaId = contratistaAuxBusOpcDosOpcGenContObj.id;
	var proyectoId = proyectoAuxOpcGenContObj.id;
	var trabContratistaId = trabContratistaAuxOpcGenContObj.id;
	var snConductor = (conductorAuxOpcGenContObj.id > 0?1:0);
	var tipoAccesoPersonalId = parseInt($("#selTipoAccesoPersonalRegAccTrabContVd").val());
	var tipoEstadoAccesoId = (booleanHabilitadoRegAccTrabCont?1:2);
	var consultaLicenciasHabilitadas = paramRegAccTrabContVdAuxObj.licenciasHabilitadas;
	var observacion = $("#textObservacionRegAccTrabContVd").val().trim();
	var detalle = $("#textDetalleRegAccTrabContVd").val().trim();
	
    if(campoVacio){
	    var dataParam={
		    id:regAccesoTrabContVdId,contratistaId:contratistaId,proyectoId:proyectoId,trabajadorContratistaId:trabContratistaId,
		    tipoAccesoPersonalId:tipoAccesoPersonalId,tipoEstadoAccesoId:tipoEstadoAccesoId,consultaLicenciasHabilitadas:consultaLicenciasHabilitadas,
			observacion:observacion,detalle:detalle,snConductor:snConductor,empresaId:parseInt(getSession("gestopcompanyid"))
	    };
	      
		callAjaxPostSimpleVersionDos(1,URL+'/contratista/registro_acceso_trabajador_contratista/save',dataParam,1,1,function(data){
	        switch(data.CODE_RESPONSE){
		        case "05":
					$("#modalFormRegistroAccesoTrabContVd").modal("hide");	
				
			        mensajeUx = "<label>El registro del acceso del trabajador contratista fue guardado con éxito.</label>"; 
	    	        mensajesUx(mensajeUx,1,"","ActualizarRegAccTrabCont");
			    
	    	        $("#modalMensajeUxActualizarRegAccTrabCont").on("hidden.bs.modal",function(){
	    	            $("#modalPrevioRegistroAccesoVd").modal("show");
	    	        });
								 
		            break;
							
		        default:
		            console.log("Ocurrió un error al guardar el registro del acceso del trabajador contratista!");
	        }
	    });
    }else{
		$("#modalFormRegistroAccesoTrabContVd").modal("hide");
		
	    mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>"; 
	    mensajesUx(mensajeUx,2,"","ActualizarRegAccTrabCont");
		
		$("#modalMensajeUxActualizarRegAccTrabCont").on("hidden.bs.modal",function(){
		    $("#modalFormRegistroAccesoTrabContVd").modal("show");
		});
	}
}
