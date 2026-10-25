
var listResultadoBusquedaTrabContOpcionalOpcGenCont = [],listProyectosAsignadosActivosOpcGenCont = [];
var trabContOpcNroDocOpcGenContId,contOpcNroDocOpcGenContId;
var contratistaAuxBusOpcDosOpcGenContObj,proyectoAuxOpcGenContObj,trabContratistaAuxOpcGenContObj,conductorAuxOpcGenContObj,listDocumentosConductorOpcGenContAux;
var generalHabilitadoTrabContOpcGenCont;
var listTipoLicenciasOpcGenCont = [];
var mapTipoLicenciaCondHabilitadaOpcGenCont;
var numTipoLicCondHabilitadosOpcGenCont;

function ocultarConsultaTrabajadorContratistaPorNroDocumentoOpcGenCont(){
    $("#modalConsultarTrabContNroDocOpcGenCont").modal("hide");
	
	if(parseInt(getSession("accesoUsuarios")) == 14){
	    $("#modalPrevioRegistroAccesoVd").modal("show");
	}
}

function verConsultaTrabajadorContratistaPorNroDocumentoOpcGenCont(){
	if(parseInt(getSession("accesoUsuarios")) == 14){
		$("#modalPrevioRegistroAccesoVd").modal("hide");
	}
	
	$("#modalConsultarTrabContNroDocOpcGenCont").remove();

    var contenido = "";

    var listContenido=[
       {label:"N° de documento",inputForm:"<input id='nroDocumentoConsTrabContOpcGenCont' class='form-control' type='text'>"},
       {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
       {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConsultaTrabajadorContratistaPorNroDocumentoOpcGenCont()'>" +
                  "<i class='fa fa-times'></i> Cancelar" +
              "</button>",
        inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='verConsultaTrabajadorContratistaOpcionalOpcGenCont()'>" +
                      "<i class='fa fa-search'></i> Buscar" +
                  "</button>"}
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
    });

    var modalOptions={
      id:"modalConsultarTrabContNroDocOpcGenCont",nombre:"<i class='fa fa-id-card'></i> Consulta - Trabajador contratista por N° de documento",
      contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function ocultarConsultaTrabajadorContratistaOpcionalOpcGenCont(){
    $("#modalConsultarOpcionalTrabContOpcGenCont").modal("hide");$("#modalConsultarTrabContNroDocOpcGenCont").modal("show");
}

function verConsultaTrabajadorContratistaOpcionalOpcGenCont(){
    var nroDocumentoVal = $("#nroDocumentoConsTrabContOpcGenCont").val().trim();

    if(nroDocumentoVal.length > 0){
        $("#modalConsultarTrabContNroDocOpcGenCont").modal("hide");$("#modalConsultarOpcionalTrabContOpcGenCont").remove();

        var dataParam={
            empresaId:parseInt(getSession("gestopcompanyid")),nroDocumento:nroDocumentoVal
        };

        callAjaxPostSimpleVersionDos(1,URL+"/contratista/trabajador/busqueda_opcional",dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    listResultadoBusquedaTrabContOpcionalOpcGenCont = data.listContratistaTrabContOpcional;

               		if(listResultadoBusquedaTrabContOpcionalOpcGenCont.length > 0){
                  		var contenido = "";

                        var selContratistaConsultaOpcGenCont = crearSelectOneMenuOblig("selContratistaConsultaOpcGenCont","completarNombreTrabContConsultaOpcionalOpcGenCont()",
                            listResultadoBusquedaTrabContOpcionalOpcGenCont,"","contratistaId","contratistaNombre");

                  	    var listContenido=[
                     	    {label:"Trabajador:",inputForm:"",idDivContainer:"divTrabContConsultaOpcGenCont"},
                     	    {label:"Contratista:",inputForm:selContratistaConsultaOpcGenCont},
                     	    {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
                     	    {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarConsultaTrabajadorContratistaOpcionalOpcGenCont()'>" +
                                       "<i class='fa fa-arrow-left'></i> Volver" +
                                   "</button>",
                      	     inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='prepararParamConsultaTrabajadorContratistaOpcionalOpcGenCont()'>" +
                                           "<i class='fa fa-search'></i> Buscar" +
                                       "</button>"}
                  	    ];

                    	listContenido.forEach(function(val){
                        	contenido += obtenerSubPanelModuloVersionTres(val);
                    	});

                    	var modalOptions={
                        	id:"modalConsultarOpcionalTrabContOpcGenCont",nombre:"<i class='fa fa-search'></i> Valores consulta - Trabajador contratista",
                        	contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
                    	};

                    	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

                    	completarNombreTrabContConsultaOpcionalOpcGenCont(data.hasSancionEnCurso);

                    	if(data.hasSancionEnCurso == 0 && listResultadoBusquedaTrabContOpcionalOpcGenCont.length == 1){
                        	prepararParamConsultaTrabajadorContratistaOpcionalOpcGenCont();
                    	}
               		}else{
	                  	$("#modalConsultarTrabContNroDocOpcGenCont").modal("hide");

                  		mensajeUx="<label>No se encontró alguna coincidencia con el N° de documento ingresado.</label>";
                  		mensajesUx(mensajeUx,2,"","ValidacionConsTrabContOpcGenCont");

                  		$("#modalMensajeUxValidacionConsTrabContOpcGenCont").on("hidden.bs.modal",function(){
                     		$("#modalConsultarTrabContNroDocOpcGenCont").modal("show");
                  		});
               		}

               		break;

            	default:
               		alert("Error. Volver a cargar.");

               		break;
         	}
        });
    }else{
        $("#modalConsultarTrabContNroDocOpcGenCont").modal("hide");

        mensajeUx="<label>Debe completar el campo Nro documento.</label>";
        mensajesUx(mensajeUx,2,"","ValidacionConsTrabContOpcGenCont");

      	$("#modalMensajeUxValidacionConsTrabContOpcGenCont").on("hidden.bs.modal",function(){
         	$("#modalConsultarTrabContNroDocOpcGenCont").modal("show");
      	});
   	}
}

function completarNombreTrabContConsultaOpcionalOpcGenCont(pHasSancion){
    var trabContratistaNombre;
    var contratistaIdAux = parseInt($("#selContratistaConsultaOpcGenCont").val());

    listResultadoBusquedaTrabContOpcionalOpcGenCont.forEach(function(val){
        if(val.contratistaId == contratistaIdAux){
            trabContratistaNombre = val.nombreCompleto;
      	}
   	});

    $("#divTrabContConsultaOpcGenCont").html(trabContratistaNombre);

   	var hasSancion = parseInt(pHasSancion);

   	if(hasSancion == 1){
      	$("#modalConsultarOpcionalTrabContOpcGenCont").modal("hide");

      	mensajeUx = "<label>"+trabContratistaNombre+" está actualmente sancionado." +
         	"<br><br>¿Desea continuar con la consulta?</label>";
      	mensajesUx(mensajeUx,3,"","ConfRevInfoTrabContOpcGenCont");

      	$("#btnRegresarPrevioConfRevInfoTrabContOpcGenCont").on("click",function(){
         	$("#modalConsultarTrabContNroDocOpcGenCont").modal("show");
      	});

      	$("#btnDevolverValorConfRevInfoTrabContOpcGenCont").on("click",function(){
         	if(listResultadoBusquedaTrabContOpcionalOpcGenCont.length == 1){
            	prepararParamConsultaTrabajadorContratistaOpcionalOpcGenCont();
         	}else{
            	$("#modalConsultarOpcionalTrabContOpcGenCont").modal("show");
         	}
      	});
   	}
}

function prepararParamConsultaTrabajadorContratistaOpcionalOpcGenCont(){
    var parametrosEncontrados = false;
    var contratistaIdAux = parseInt($("#selContratistaConsultaOpcGenCont").val());

    listResultadoBusquedaTrabContOpcionalOpcGenCont.forEach(function(val){
        if(val.contratistaId == contratistaIdAux){
            trabContOpcNroDocOpcGenContId = val.id;contOpcNroDocOpcGenContId = val.contratistaId;parametrosEncontrados = true;
        }
    });

   	if(parametrosEncontrados){
        previoBuscarDatosTrabajadorContratistaOpcGenCont();
   	}
}

function previoBuscarDatosTrabajadorContratistaOpcGenCont(){
    $("#modalConsultarOpcionalTrabContOpcGenCont").modal("hide");$("#modalEstadoActualTrabajadorContratistaOpcGenCont").remove();

    if(contOpcNroDocOpcGenContId != -1 && trabContOpcNroDocOpcGenContId != -1){
        var dataParam={
            id:trabContOpcNroDocOpcGenContId,contratistaId:contOpcNroDocOpcGenContId
        };

        callAjaxPostSimpleVersionDos(1,URL+"/contratista/trabajadores/proyecto_asignado",dataParam,1,1,function(data){
            listProyectosAsignadosActivosOpcGenCont = (data.listProyectosAsignados.length > 0?data.listProyectosAsignados:[{id:-1,titulo:"Sin proyectos asignados en curso"}]);

            var selProyectoTrabContConsultaOpcGenCont = crearSelectOneMenuOblig("selProyectoTrabContConsultaOpcGenCont","buscarDatosTrabajadorContratistaOpcGenCont()",
			    listProyectosAsignadosActivosOpcGenCont,"","id","titulo");
            var contratistaNombre = "------",nombreCompleto = "------";

         	listResultadoBusquedaTrabContOpcionalOpcGenCont.forEach(function(val){
            	if(val.id == trabContOpcNroDocOpcGenContId && val.contratistaId == contOpcNroDocOpcGenContId){
               		contratistaNombre = val.contratistaNombre;nombreCompleto = val.nombreCompleto;
            	}
         	});
			
			var registroSegunUsuario = (parseInt(getSession("accesoUsuarios")) == 14?"nuevoRegistroAccesoTrabajadorContratistaVd()":"nuevoRegistroAccesoTrabajadorContratista()");

         	var contenido = "";

         	var listContenido=[
                {clase:"bloque-top-moderno",label:"<i class='fa fa-list-alt'></i> Contratista:",inputForm:contratistaNombre},
            	{label:"",inputForm:"",styleTotal:styleLineaDegradada},
            	{clase:"bloque-middle-moderno",label:"<i class='fa fa-list-alt'></i> Proyecto:",inputForm:selProyectoTrabContConsultaOpcGenCont},
            	{label:"",inputForm:"",styleTotal:styleLineaDegradada},
            	{clase:"bloque-bottom-moderno",label:"<i class='fa fa-user'></i> Trabajador(a):",inputForm:nombreCompleto,idDivContainer:"divResTotalTrabContOpcGenCont",styleTotal:"margin-bottom:10px;"},
            	{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
            	{label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarDatosTrabajadorContratistaOpcGenCont()'>" +
                           "<i class='fa fa-arrow-left'></i> Volver" +
                       "</button>",
             	 inputForm:(data.listProyectosAsignados.length > 1?
                            "<button id='btnSelecConsTrabContOpcGenCont' class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='buscarDatosTrabajadorContratistaOpcGenCont()'>" +
                                "<i class='fa fa-list-ul'></i> Seleccionar" +
                            "</button>":"") +
						   "<button id='btnRegAccesoTrabContOpcGenCont' class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='"+registroSegunUsuario+"'>" +
						       "<i class='fa fa-address-book-o'></i> Registrar acceso" +
						   "</button>"}
         	];

         	listContenido.forEach(function(val){
            	contenido += obtenerSubPanelModuloVersionTres(val);
         	});

         	var modalOptions={
            	id:"modalEstadoActualTrabajadorContratistaOpcGenCont",nombre:"<i class='fa fa-search'></i> Resultado de la búsqueda - trabajador contratista",
            	contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
         	};

         	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
			
			$("#btnRegAccesoTrabContOpcGenCont").hide();

         	if(data.listProyectosAsignados.length < 2){
            	buscarDatosTrabajadorContratistaOpcGenCont();
         	}
      	});
   	}else{
      	mensajeUx = "<label>Debe seleccionar un trabajador contratista válido.</label>";
      	mensajesUx(mensajeUx,2,"","ValidacionConsultaTrabContOpcGenCont");
   	}
}

function ocultarDatosTrabajadorContratistaOpcGenCont(){
    $("#modalEstadoActualTrabajadorContratistaOpcGenCont").modal("hide");
   
    if(listResultadoBusquedaTrabContOpcionalOpcGenCont.length == 1){
        $("#modalConsultarTrabContNroDocOpcGenCont").modal("show");
    }else{
        $("#modalConsultarOpcionalTrabContOpcGenCont").modal("show");
    }
}

var booleanHabilitadoRegAccTrabCont;

function buscarDatosTrabajadorContratistaOpcGenCont(){
    $(".divResultadoBusquedaTrabContOpcGenCont").remove();$("#btnSelecConsTrabContOpcGenCont").hide();$("#btnRegAccesoTrabContOpcGenCont").show();
    
    var idContratista = contOpcNroDocOpcGenContId;
    var idTrabajadorContratista = trabContOpcNroDocOpcGenContId;
    var idProyecto = parseInt($("#selProyectoTrabContConsultaOpcGenCont").val());

    if(idContratista != -1 && idTrabajadorContratista != -1 && idProyecto != -1){
        var dataParam={
	        id:idProyecto,contratistaId:idContratista,trabajadorContratistaId:idTrabajadorContratista
        };
    
        callAjaxPostSimpleVersionDos(1,URL+"/contratista/consulta/proyecto/trabajador",dataParam,1,0,function(data){
	        contratistaAuxBusOpcDosOpcGenContObj = data.contratista;proyectoAuxOpcGenContObj = data.proyecto,trabContratistaAuxOpcGenContObj = data.trabajadorContratista;
	        conductorAuxOpcGenContObj = data.conductor;listDocumentosConductorOpcGenContAux = data.listDocumentosConductor;listTipoLicenciasOpcGenCont = data.listTipoLicencias;
	 
         	mapTipoLicenciaCondHabilitadaOpcGenCont = new Map();
         
         	numTipoLicCondHabilitadosOpcGenCont = listTipoLicenciasOpcGenCont.length;
         
         	listTipoLicenciasOpcGenCont.forEach(function(val){
            	mapTipoLicenciaCondHabilitadaOpcGenCont.set(val.id,1);
         	});

         	var estadoDocumentosNivelEmpresaConObj = verificarIndicadorDocNivelEmpresaContratista(contratistaAuxBusOpcDosOpcGenContObj);
         	var estadoDocumentosNivelProyectoConObj = verificarIndicadorDocNivelProyectoContratista(proyectoAuxOpcGenContObj);
	     	var estadoDocumentosTrabConObj = verificarIndicadorDocNivelTrabajadorContratista(trabContratistaAuxOpcGenContObj,proyectoAuxOpcGenContObj);
	 
            generalHabilitadoTrabContOpcGenCont = estadoDocumentosNivelEmpresaConObj.isHabilitado && estadoDocumentosNivelProyectoConObj.isHabilitado && estadoDocumentosTrabConObj.isHabilitado;
            var conductorHabilitadoOpcGenCont = (conductorAuxOpcGenContObj.id > 0?(conductorAuxOpcGenContObj.isHabilitado == 1):true);
            booleanHabilitadoRegAccTrabCont = generalHabilitadoTrabContOpcGenCont && conductorHabilitadoOpcGenCont;

         	var estadoActualTrabContTotal =
                "<div class='"+(booleanHabilitadoRegAccTrabCont?"estado-futurista-ok":"estado-no-habilitado-full")+"'>" +
                    "<i class='"+(booleanHabilitadoRegAccTrabCont?"fa fa-thumbs-up":"fa fa-ban")+"'></i>" +
                    "<div><div class='estado-titulo'>"+(booleanHabilitadoRegAccTrabCont?"Habilitado":"No habilitado")+"</div></div>" +
                "</div>";
				
         	var textoTrabajosAltoRiesgo = (trabContratistaAuxOpcGenContObj.textoTrabajosAltoRiesgo.length == 0?"No tiene ninguno asignado.":
                (trabContratistaAuxOpcGenContObj.habilitadoTrabajosAltoRiesgo == 1?iconoGosst.aprobado:iconoGosst.alerta)+" "+trabContratistaAuxOpcGenContObj.textoTrabajosAltoRiesgo +
                "<br>" +
	            "<a class='efectoLink' onclick='verConstanciaTrabAltoRiesgoTrabCon(6)' title='Ver el estado según los trabajos de alto riesgo asignados.'>" +
	       		    "<i class='fa fa-eye'></i> Ver estado" +
	    		"</a>");
         
         	var empresa = trabContratistaAuxOpcGenContObj.cliente.trim(),puestoTrabajo = (trabContratistaAuxOpcGenContObj.cargo.trim().length == 0?"------":trabContratistaAuxOpcGenContObj.cargo.trim());
         
         	var contenido = "";

         	var contenidoEmpresaPuestoTrabajo =
                "<div class='fila-doble-info'>" +
                 (empresa.length > 0?
                  "<div class='fila-doble-info-item' style='flex:0 0 calc(45% - 9px);'>" +
                      "<div class='fila-doble-info-label'>Empresa:</div>" +
                      "<div class='fila-doble-info-valor'>"+empresa+"</div>" +
                  "</div>":"") +
                  "<div class='fila-doble-info-item' style='flex:0 0 "+(empresa.length > 0?"calc(55% - 9px)":"100%")+";'>" +
                      "<div class='fila-doble-info-label'>Puesto de trabajo:</div>" +
                      "<div class='fila-doble-info-valor'>"+puestoTrabajo+"</div>" +
                  "</div>" +
                "</div>";
         
         	var listContenido=[
                {clase:"divResultadoBusquedaTrabContOpcGenCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                {clase:"divResultadoBusquedaTrabContOpcGenCont",fullRow:1,label:"",inputForm:contenidoEmpresaPuestoTrabajo},
                {clase:"divResultadoBusquedaTrabContOpcGenCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante}
         	];

          	if(proyectoAuxOpcGenContObj.numTrabajosAltoRiesgoTotal > 0 && (proyectoAuxOpcGenContObj.habilitadoConstanciaAltoRiesgo == 1 || proyectoAuxOpcGenContObj.habilitarCargoInduccionTrabAltRie == 1)){
                listContenido.push({clase:"divResultadoBusquedaTrabContOpcGenCont",fullRow:1,label:"",inputForm:obtenerFilaDobleInfoSimple("Trabajos de alto riesgo asignados:",textoTrabajosAltoRiesgo)});
          	}

            if(proyectoAuxOpcGenContObj.habilitadoEsPrevencionista == 1){
                var contenidoPrevencionista =
                    "<div class='fila-doble-info'>" +
                        "<div class='fila-doble-info-item' style='flex:0 0 "+(proyectoAuxOpcGenContObj.habilitadoEntrevistaPrevencionista == 1?"calc(40% - 9px)":"100%")+";'>" +
                            "<div class='fila-doble-info-label'>¿Es prevencionista?</div>" +
                            "<div class='fila-doble-info-valor'>"+estadoDocumentosTrabConObj.textoPrevencionista+"</div>" +
                        "</div>" +
                        (proyectoAuxOpcGenContObj.habilitadoEntrevistaPrevencionista == 1?
                         "<div class='fila-doble-info-item' style='flex:0 0 calc(60% - 9px);'>" +
                             "<div class='fila-doble-info-label'>Entrevista prevencionista</div>" +
                             "<div class='fila-doble-info-valor'>"+estadoDocumentosTrabConObj.textoEntrevistaPrevencionista+"</div>" +
                         "</div>":"") +
                  "</div>";

                listContenido.push({clase:"divResultadoBusquedaTrabContOpcGenCont",label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                    {clase:"divResultadoBusquedaTrabContOpcGenCont",fullRow:1,label:"",inputForm:contenidoPrevencionista});
          	}

          	var listContenidoDntcAux = obtenerContratistaListaDocumentosNivelTrabajadorContratista(proyectoAuxOpcGenContObj,trabContratistaAuxOpcGenContObj,estadoDocumentosTrabConObj,"divResultadoBusquedaTrabContOpcGenCont divEstadoActualTrabContTotalOpcGenCont");

          	var tieneDetalleEstadoActualTrabContTotal = proyectoAuxOpcGenContObj.numDocumentosNivelEmpresaTotal > 0 || proyectoAuxOpcGenContObj.numDocumentosNivelProyectoTotal > 0 || listContenidoDntcAux.length > 0;
          	var tieneEstadoActualTrabContTotal = tieneDetalleEstadoActualTrabContTotal || trabContratistaAuxOpcGenContObj.indicadorBlacklist != null;

          	if(tieneEstadoActualTrabContTotal){
                listContenido.push({clase:"divResultadoBusquedaTrabContOpcGenCont",label:"",inputForm:"",styleTotal:styleLineaSuaveMinimalista},
                    {clase:"divResultadoBusquedaTrabContOpcGenCont estado-actual-compacto",anchoLabel:"col-sm-12",anchoDiv:"col-sm-12",label:"",
                     inputForm:estadoActualTrabContTotal+(tieneDetalleEstadoActualTrabContTotal?"<a class='estado-detalle-alternar' id='idDetalleEstadoActualTrabContTotalOpcGenCont'></a>":"")});

                if(proyectoAuxOpcGenContObj.numDocumentosNivelEmpresaTotal > 0){
                    listContenido.push({clase:"divResultadoBusquedaTrabContOpcGenCont divEstadoActualTrabContTotalOpcGenCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                        {clase:"divResultadoBusquedaTrabContOpcGenCont divEstadoActualTrabContTotalOpcGenCont",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                         label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL EMPRESA ***</span>",inputForm:""});

                    var listContenidoDneAux = obtenerContratistaListaDocumentosNivelEmpresa(contratistaAuxBusOpcDosOpcGenContObj,estadoDocumentosNivelEmpresaConObj,"divResultadoBusquedaTrabContOpcGenCont divEstadoActualTrabContTotalOpcGenCont");

                    for(var i = 0;i < listContenidoDneAux.length;i++){
                        listContenido.push(listContenidoDneAux[i]);
                  	}
              	}

                if(proyectoAuxOpcGenContObj.numDocumentosNivelProyectoTotal > 0){
                    listContenido.push({clase:"divResultadoBusquedaTrabContOpcGenCont divEstadoActualTrabContTotalOpcGenCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                        {clase:"divResultadoBusquedaTrabContOpcGenCont divEstadoActualTrabContTotalOpcGenCont",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                         label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL PROYECTO ***</span>",inputForm:""});

                    var listContenidoDnpAux = obtenerContratistaListaDocumentosNivelProyecto(proyectoAuxOpcGenContObj,estadoDocumentosNivelProyectoConObj,"divResultadoBusquedaTrabContOpcGenCont divEstadoActualTrabContTotalOpcGenCont");

                    for(var j = 0;j < listContenidoDnpAux.length;j++){
                        listContenido.push(listContenidoDnpAux[j]);
                    }
              	}

              	if(listContenidoDntcAux.length > 0){
                    listContenido.push({clase:"divResultadoBusquedaTrabContOpcGenCont divEstadoActualTrabContTotalOpcGenCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                        {clase:"divResultadoBusquedaTrabContOpcGenCont divEstadoActualTrabContTotalOpcGenCont",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                         label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL TRABAJADOR CONTRATISTA ***</span>",inputForm:""});

                  	for(var k = 0;k < listContenidoDntcAux.length;k++){
                        listContenido.push(listContenidoDntcAux[k]);
                  	}
              	}
          	}
         
         	if(proyectoAuxOpcGenContObj.habilitadoConductor == 1){
                var tipoLicenciasAprobadas = (conductorAuxOpcGenContObj.tiposLicenciaConductorHabilitadosNombre.length == 0?"Ninguno":conductorAuxOpcGenContObj.tiposLicenciaConductorHabilitadosNombre);
                var iconoConductorNoHabilitadoOpcGenCont = "<i class='fa fa-exclamation-circle' style='color:#C0504D;margin-right:4px;' title='Es la razón de que salga NO HABILITADO'></i>";

                var contenidoConductorLicencias =
                    "<div class='fila-doble-info'>" +
                        "<div class='fila-doble-info-item' style='flex:0 0 calc(30% - 9px);'>" +
                            "<div class='fila-doble-info-label'>¿Es conductor?</div>" +
                            "<div class='fila-doble-info-valor'>"+(conductorAuxOpcGenContObj.id > 0?"Sí":"No")+"</div>" +
                        "</div>" +
                        "<div class='fila-doble-info-item' style='flex:0 0 calc(70% - 9px);'>" +
                            "<div class='fila-doble-info-label'>"+(!conductorHabilitadoOpcGenCont?iconoConductorNoHabilitadoOpcGenCont:"")+"Tipo(s) de licencia(s) habilitadas:</div>" +
                            "<div class='fila-doble-info-valor'"+(!conductorHabilitadoOpcGenCont?" style='color:#C0504D;'":"")+">"+tipoLicenciasAprobadas+"</div>" +
                        "</div>" +
                    "</div>" +
                     (conductorAuxOpcGenContObj.tiposLicenciaConductorId.length > 0?
                      "<div style='display:flex;justify-content:flex-end;margin-top:6px;'>" +
                          "<a class='estado-detalle-alternar' style='margin:0;"+(!conductorHabilitadoOpcGenCont?"color:#C0504D;":"")+"' onclick='verEstadoActualConductorConsultaOpcGenCont()'>"+(!conductorHabilitadoOpcGenCont?iconoConductorNoHabilitadoOpcGenCont:"")+"Ver detalle <i class='fa fa-chevron-down'></i></a>" +
                      "</div>":"");

                listContenido.push({clase:"divResultadoBusquedaTrabContOpcGenCont",label:"",inputForm:"",styleTotal:styleLineaSuaveMinimalista},
                    {clase:"divResultadoBusquedaTrabContOpcGenCont",fullRow:1,label:"",inputForm:contenidoConductorLicencias});
         	}
		 
         	listContenido.forEach(function(val){
            	contenido += obtenerSubPanelModuloVersionTres(val);
         	});
       	  				
         	$("#divResTotalTrabContOpcGenCont").parent().after(contenido);$.unblockUI();
          
         	ocultarEstadoActualTrabContTotalOpcGenCont();
			
			if(trabContratistaAuxOpcGenContObj.indicadorBlacklist != null){
				$("#btnRegAccesoTrabContOpcGenCont").hide();
			}
        });
    }else{
	    $("#modalEstadoActualTrabajadorContratistaOpcGenCont").modal("hide");
	
        mensajeUx = (idContratista == -1?"<label>Debe ingresar el RUC y/o nombre de la contratista en el buscador y seleccionarla.</label>":
            (idTrabajadorContratista == -1?"<label>Debe ingresar el N° documento y/o nombre/apellido del trabajador contratista en el " +
             "buscador y seleccionarlo.</label>":"<label>No tiene algún proyecto activo asignado.</label>"));
        mensajesUx(mensajeUx,2,"","ValidacionConsultaOpcGenCont");
      
	    $("#modalMensajeUxValidacionConsultaOpcGenCont").on("hidden.bs.modal",function(){
	        if(listResultadoBusquedaTrabContOpcionalOpcGenCont.length == 1){
	  		    $("#modalConsultarTrabContNroDocOpcGenCont").modal("show");
	  	    }else{
	  		    $("#modalConsultarOpcionalTrabContOpcGenCont").modal("show");
	  	    }
	    });
   }
}

function verEstadoActualTrabContTotalOpcGenCont(){
   $(".divEstadoActualTrabContTotalOpcGenCont").show();

   var iconoReq = (!generalHabilitadoTrabContOpcGenCont?"<i class='fa fa-exclamation-circle' style='color:#C0504D;margin-right:4px;' title='Tiene algún requisito general pendiente'></i>":"");
   $("#idDetalleEstadoActualTrabContTotalOpcGenCont").html(iconoReq+"Ocultar detalle <i class='fa fa-chevron-up'></i>");
   $("#idDetalleEstadoActualTrabContTotalOpcGenCont").css("color",(!generalHabilitadoTrabContOpcGenCont?"#C0504D":""));
   $("#idDetalleEstadoActualTrabContTotalOpcGenCont").attr("onclick","ocultarEstadoActualTrabContTotalOpcGenCont()");
}

function ocultarEstadoActualTrabContTotalOpcGenCont(){
   $(".divEstadoActualTrabContTotalOpcGenCont").hide();

   var iconoReq = (!generalHabilitadoTrabContOpcGenCont?"<i class='fa fa-exclamation-circle' style='color:#C0504D;margin-right:4px;' title='Tiene algún requisito general pendiente'></i>":"");
   $("#idDetalleEstadoActualTrabContTotalOpcGenCont").html(iconoReq+"Ver detalle <i class='fa fa-chevron-down'></i>");
   $("#idDetalleEstadoActualTrabContTotalOpcGenCont").css("color",(!generalHabilitadoTrabContOpcGenCont?"#C0504D":""));
   $("#idDetalleEstadoActualTrabContTotalOpcGenCont").attr("onclick","verEstadoActualTrabContTotalOpcGenCont()");
}

function volverEstadoActualConductorConsultaOpcGenCont(){
   $("#modalEstadoActualConductorOpcGenCont").modal("hide");
}

function verEstadoActualConductorConsultaOpcGenCont(){
   $("#modalEstadoActualTrabajadorContratistaOpcGenCont").modal("hide"); $("#modalEstadoActualConductorOpcGenCont").remove();

   var contenidoColumnaTipoLicCond = "";
   
   listTipoLicenciasOpcGenCont.forEach(function(val){
      contenidoColumnaTipoLicCond += "<th class='tb-acc' style='width:300px'>"+val.nombre+"</th>";
   });
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverEstadoActualConductorConsultaOpcGenCont()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
       
   var modalOptions={
      maxWidth:"90%",id:"modalEstadoActualConductorOpcGenCont",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-user'></i> Conductor "+conductorAuxOpcGenContObj.trabContratista.nombre+" <span id='spanConductorEstadoActualOpcGenCont'></span>",
      contenido: 
	  "<div class='eventoGeneral-moderno'>" +
	  buttonVolver +
         "<div class='wrapper' id='wrapperEstadoActualConductorOpcGenCont'>" +
            "<table id='tblEstadoActualConductorOpcGenCont' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' rowspan='2' style='width:400px'>Documento a nivel conductor</th>" +
		     "<th class='tb-acc' colspan='"+numTipoLicCondHabilitadosOpcGenCont+"' style='width:"+(numTipoLicCondHabilitadosOpcGenCont*300)+"px'>Tipo de licencia conductor</th>" +
	          "</tr>" +
		  "<tr>" +
		      contenidoColumnaTipoLicCond +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>" +
     "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperEstadoActualConductorOpcGenCont",240);
   
   var numTipoLicenciaCondHabilitadosTotal = 0,numTipoLicenciaCondAprobadosTotal = 0;
	 
   $("#tblEstadoActualConductorOpcGenCont tbody tr").remove();
	 
   listDocumentosConductorOpcGenContAux.forEach(function(val){
      $("#tblEstadoActualConductorOpcGenCont tbody").append(
         "<tr>" +
	    "<td>"+val.nombre+"</td>" +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(1) == 1?"<td>"+val.estadoActualVehiculoCiudad+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(2) == 1?"<td>"+val.estadoActualVehiculo4x4+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(3) == 1?"<td>"+val.estadoActualCamionCisterna+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(4) == 1?"<td>"+val.estadoActualMaquinariaGrua+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(5) == 1?"<td>"+val.estadoActualLineaAmarilla+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(6) == 1?"<td>"+val.estadoActualVehiculosLivianos+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(7) == 1?"<td>"+val.estadoActualVehiculosPesados+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(8) == 1?"<td>"+val.estadoActualCamionesGruas+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(9) == 1?"<td>"+val.estadoActualVehiculosIndustriales+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(10) == 1?"<td>"+val.estadoActualMaquinariaPesada+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(11) == 1?"<td>"+val.estadoActualTipoLicCond11+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(12) == 1?"<td>"+val.estadoActualTipoLicCond12+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(13) == 1?"<td>"+val.estadoActualTipoLicCond13+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(14) == 1?"<td>"+val.estadoActualTipoLicCond14+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(15) == 1?"<td>"+val.estadoActualTipoLicCond15+"</td>":"") +
	     (mapTipoLicenciaCondHabilitadaOpcGenCont.get(16) == 1?"<td>"+val.estadoActualTipoLicCond16+"</td>":"") +
	 "</tr>");
	    
      numTipoLicenciaCondHabilitadosTotal = numTipoLicenciaCondHabilitadosTotal + val.numTipoLicenciaCondHabilitados;
      numTipoLicenciaCondAprobadosTotal = numTipoLicenciaCondAprobadosTotal + val.numTipoLicenciaCondAprobados;
   });
	 
   var habilitado = (numTipoLicenciaCondHabilitadosTotal == numTipoLicenciaCondAprobadosTotal && (numTipoLicenciaCondHabilitadosTotal > 0 || (conductorAuxOpcGenContObj.tiposLicenciaConductorId != null && conductorAuxOpcGenContObj.tiposLicenciaConductorId.length > 0))?"Sí":"No");
	 
   $("#spanConductorEstadoActualOpcGenCont").html("- ¿Habilitado? "+habilitado+" ("+numTipoLicenciaCondAprobadosTotal +"/"+numTipoLicenciaCondHabilitadosTotal+")");
	
   goheadfixedY("#tblEstadoActualConductorOpcGenCont","#wrapperEstadoActualConductorOpcGenCont");
   
   $("#modalEstadoActualConductorOpcGenCont").on("hidden.bs.modal",function(){
      $("#modalEstadoActualTrabajadorContratistaOpcGenCont").modal("show"); 
   }); 
}
