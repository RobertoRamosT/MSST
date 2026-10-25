
function verBuscarDatosTrabContratista(){
    $(".contenidoVisitante").remove();$(".contenidoTrabContratista").remove();
    $(".contenidoContratista").remove();$(".contenidoTrabInterno").remove();
    
    var containerWelcome = $("#containerWelcome");

    containerWelcome.append($("<div>",
	    {class:"seccionInduccion contenidoTrabContratista",
         id:"seccionBuscarTrabajadorContratistaOpcional",
         html:$("<div>",{class:"divTituloSeccion",html:"Búsqueda por N° de documento"})}));
   
    $("#seccionBuscarTrabajadorContratistaOpcional").append($("<div>",
		{class:"divDescripcionInduccion divButtonStartInduccion",
         html:$("<button>",{class:"btn btn-info",style:"float:right;font-size:18px;",
	                        html:"<i class='fa fa-id-card'></i> Consultar",
	                        click:verConsultaTrabajadorContratistaPorNroDocumento})}));
   
    habilitadoConsultaQR = 0;verConsultaTrabajadorContratistaPorNroDocumento();
}

var listTrabajadoresContratistaBuscadorAux = [],listProyectosAsignadosActivos = [];

function verAutoCompletarTrabajadorContratistaConsulta(){
   var contratistaId = parseInt($("#selContratistaConsulta").val());
   var trabajadorContratista = $("#inputTrabajadorContratistaConsulta").val().trim();
   
   document.getElementById("inputTrabajadorContratistaConsulta").disabled = (contratistaId != -1?false:true); 

   if(contratistaId != -1){
      if(trabajadorContratista.length >= 3){
         var dataParam={
	    nombre:"%"+trabajadorContratista+"%",isBuscador:1,contratistaId:contratistaId
         };

         callAjaxPostNoLoad(URL+"/public/contratista/trabajador_contratista/buscar/simple",dataParam,function(data){
	    listTrabajadoresContratistaBuscadorAux = (data.trabajadoresContratista.length == 0?[{id:-1,nombre:"No encontrado"}]:data.trabajadoresContratista);
	   
    	    var selAutoTrabajadorContratistaConsulta = crearSelectOneMenuOblig("selAutoTrabajadorContratistaConsulta",
    	       "buscarProyectoAsignadoTrabContConsulta()",listTrabajadoresContratistaBuscadorAux,"","id","nombre");
	
    	    $("#divAutoCompletarTrabajadorContratistaConsulta").html(selAutoTrabajadorContratistaConsulta);
    	    $("#inputTrabajadorContratistaConsulta").attr("onkeyup","verAutoCompletarTrabajadorContratistaConsulta()");
         });
      }else{
         listTrabajadoresContratistaBuscadorAux = [{id:-1,nombre:"No encontrado"}];
	     
         var selAutoTrabajadorContratistaConsulta = crearSelectOneMenuOblig("selAutoTrabajadorContratistaConsulta","",
	    listTrabajadoresContratistaBuscadorAux,"","id","nombre");
	    		       
         $("#divAutoCompletarTrabajadorContratistaConsulta").html(selAutoTrabajadorContratistaConsulta);
         $("#inputTrabajadorContratistaConsulta").attr("onkeyup","verAutoCompletarTrabajadorContratistaConsulta()");
      }
   }else{
      $("#inputTrabajadorContratistaConsulta").val("");$("#divAutoCompletarTrabajadorContratistaConsulta").html("");
      $("#divSelAutoProyectoAsignadoActivo").html("<label style='color:red;'>* Debe seleccionar un contratista.</label>");
   }
}

var contratistaAuxBusOpcDosObj,proyectoAuxObj,trabContratistaAuxObj,conductorAuxObj,listDocumentosConductorAux;
var generalHabilitadoTrabCont;
var listTipoLicencias = [];
var mapTipoLicenciaCondHabilitada;
var numTipoLicCondHabilitados;

function ocultarDatosTrabajadorContratista(acceso){
    var accesoOpcion = parseInt(acceso);
    
    $("#modalEstadoActualTrabajadorContratista").modal("hide");
    
    if(accesoOpcion == 1){
        if(listResultadoBusquedaTrabContOpcional.length == 1){
            $("#modalConsultarTrabContNroDoc").modal("show");
        }else{
            $("#modalConsultarOpcionalTrabCont").modal("show");
        }
    }
}

var trabContOpcNroDocId,contOpcNroDocId;

function previoBuscarDatosTrabajadorContratista(acceso){
    var accesoOpcion = parseInt(acceso);
    
    $("#modalEstadoActualTrabajadorContratista").remove();
   
    if(accesoOpcion == 1){
        $("#modalConsultarOpcionalTrabCont").modal("hide");
    }
   
    var idContratista = (habilitadoConsultaQR == 1?getUrlParameter("idContratista"):(accesoOpcion == 1?contOpcNroDocId:parseInt($("#selContratistaConsulta").val())));
    var idTrabajadorContratista = (habilitadoConsultaQR == 1?getUrlParameter("idTrabajadorContratista"):(accesoOpcion == 1?trabContOpcNroDocId:parseInt($("#selAutoTrabajadorContratistaConsulta").val())));
   
    if(idContratista != -1 && idTrabajadorContratista != -1){
        var dataParam={
            id:idTrabajadorContratista,contratistaId:idContratista
        };
	  		
        callAjaxPostSimpleVersionDos(1,URL+"/public/contratista/trabajador/resultado_simple",dataParam,1,1,function(data){
	        switch(data.CODE_RESPONSE){
	            case "05":
	                var trabContResultadoObj = data.trabContResultado;
	  
	            	listProyectosAsignadosActivos = (data.listProyectosAsignados.length > 0?data.listProyectosAsignados:[{id:-1,titulo:"Sin proyectos asignados en curso"}]);
         
	            	var selProyectoTrabContConsulta = crearSelectOneMenuOblig("selProyectoTrabContConsulta","buscarDatosTrabajadorContratista("+accesoOpcion+")",listProyectosAsignadosActivos,"","id","titulo");
        
	            	var nombreCompleto = "("+trabContResultadoObj.nroDocumento+") "+(trabContResultadoObj.apellido.length == 0 && trabContResultadoObj.nombre.length == 0?"------":
	        	        ((trabContResultadoObj.apellido.length == 0?"":trabContResultadoObj.apellido+", ")+(trabContResultadoObj.nombre.length == 0?"":trabContResultadoObj.nombre)));
            	
	            	var contenido = "";
         
	            	var listContenido=[
	                	{clase:"bloque-top-moderno",label:"<i class='fa fa-list-alt'></i> Contratista:",inputForm:trabContResultadoObj.contratista.nombre},
						{label:"",inputForm:"",styleTotal:styleLineaDegradada},
						{clase:"bloque-middle-moderno",label:"<i class='fa fa-list-alt'></i> Proyecto:",inputForm:selProyectoTrabContConsulta},
						{label:"",inputForm:"",styleTotal:styleLineaDegradada},
						{clase:"bloque-bottom-moderno",label:"<i class='fa fa-user'></i> Trabajador(a):",inputForm:nombreCompleto,idDivContainer:"divResTotalTrabCont",styleTotal:"margin-bottom:10px;"}
	            	];
         
	            	if(habilitadoConsultaQR == 0){
	        			listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
	        	    	    {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarDatosTrabajadorContratista("+accesoOpcion+")'>" +
	        	                       "<i class='fa fa-arrow-left'></i> Volver" +
	        	                   "</button>",
	        	             inputForm:(data.listProyectosAsignados.length > 1?
	        		                    "<button id='btnSelecConsTrabCont' class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
	        		                            "onclick='buscarDatosTrabajadorContratista("+accesoOpcion+")'>" +
	        		                        "<i class='fa fa-list-ul'></i> Seleccionar" +
	        		                    "</button>":"")});
	            	}else{
	        	    	listContenido.push({clase:"atributo-temp-consTrabCont",label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
                        	{clase:"atributo-temp-consTrabCont",label:"",
	        	         	 inputForm:(data.listProyectosAsignados.length > 1?
                                        "<button id='btnSelecConsTrabCont' class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
                                                "onclick='buscarDatosTrabajadorContratista("+accesoOpcion+")'>" +
                                            "<i class='fa fa-list-ul'></i> Seleccionar" +
                                 	    "</button>":"")});
	            	}
         
	            	listContenido.forEach(function(val){
	        			contenido += obtenerSubPanelModuloVersionTres(val);
	            	});
       	  				
	            	var modalOptions={
	        			id:"modalEstadoActualTrabajadorContratista",nombre:"<i class='fa fa-search'></i> Resultado de la búsqueda - trabajador contratista",
	        			contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
	            	};

	            	if(habilitadoConsultaQR == 1){
	        			modalOptions.btnCerrarHabilitado = 0; 
	            	}
       	  			
	            	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
         
	            if(data.listProyectosAsignados.length < 2){
	        	buscarDatosTrabajadorContratista(accesoOpcion);
	            }
	            
	            break;
	            
	        case "19":
	            mensajeUx = "<label>Debe logearse desde su cuenta de GOSST para poder consultar la información solicitada.</label>";
	            mensajesUx(mensajeUx,4,"","");
	        
	            break;
	            
	        case "20":
	            mensajeUx = "<label>Usted no tiene permitido el acceso a la información solicitada.</label>";
	            mensajesUx(mensajeUx,2,"","");
	        
	            break;
	            
	        default:
	            alert("Error al cargar la información.");

		    break;
	    }
        });
    }else{
      mensajeUx = (idContratista == -1?"<label>Debe ingresar el RUC y/o nombre de la contratista en el buscador y seleccionarla.</label>":
	  "<label>Debe ingresar el N° documento y/o nombre/apellido del trabajador contratista en el buscador y seleccionarlo.</label>");
      mensajesUx(mensajeUx,2,"","ValidacionConsultaTrabCont");
      
      $("#modalMensajeUxValidacionConsultaTrabCont").on("hidden.bs.modal",function(){
	  if(accesoOpcion == 1){
	      if(listResultadoBusquedaTrabContOpcional.length == 1){
	          $("#modalConsultarTrabContNroDoc").modal("show");
	      }else{
	          $("#modalConsultarOpcionalTrabCont").modal("show");
	      }
	  }
      });
   }
}

function buscarDatosTrabajadorContratista(acceso){
    var accesoOpcion = parseInt(acceso);
    
    $(".divResultadoBusquedaTrabCont").remove();$("#btnSelecConsTrabCont").hide();$(".atributo-temp-consTrabCont").hide();
    
    var idContratista = (habilitadoConsultaQR == 1?getUrlParameter("idContratista"):(accesoOpcion == 1?contOpcNroDocId:parseInt($("#selContratistaConsulta").val())));
    var idTrabajadorContratista = (habilitadoConsultaQR == 1?getUrlParameter("idTrabajadorContratista"):(accesoOpcion == 1?trabContOpcNroDocId:parseInt($("#selAutoTrabajadorContratistaConsulta").val())));
    var idProyecto = parseInt($("#selProyectoTrabContConsulta").val());

    if(idContratista != -1 && idTrabajadorContratista != -1 && idProyecto != -1){
        var dataParam={
	        id:idProyecto,contratistaId:idContratista,trabajadorContratistaId:idTrabajadorContratista
        };
    
        callAjaxPostSimpleVersionDos(1,URL+"/public/contratista/consulta/proyecto/trabajador",dataParam,1,0,function(data){
            contratistaAuxBusOpcDosObj = data.contratista;proyectoAuxObj = data.proyecto,trabContratistaAuxObj = data.trabajadorContratista;
            conductorAuxObj = data.conductor;listDocumentosConductorAux = data.listDocumentosConductor;listTipoLicencias = data.listTipoLicencias;
	 
            mapTipoLicenciaCondHabilitada = new Map();
         
            numTipoLicCondHabilitados = listTipoLicencias.length;
         
            listTipoLicencias.forEach(function(val){
                mapTipoLicenciaCondHabilitada.set(val.id,1);
            });
            
            var estadoDocumentosNivelEmpresaConObj = verificarIndicadorDocNivelEmpresaContratista(contratistaAuxBusOpcDosObj);
            
            var estadoDocumentosNivelProyectoConObj = verificarIndicadorDocNivelProyectoContratista(proyectoAuxObj);
            
	        var estadoDocumentosTrabConObj = verificarIndicadorDocNivelTrabajadorContratista(trabContratistaAuxObj,proyectoAuxObj);
	 
			generalHabilitadoTrabCont = estadoDocumentosNivelEmpresaConObj.isHabilitado && estadoDocumentosNivelProyectoConObj.isHabilitado && estadoDocumentosTrabConObj.isHabilitado;
			var conductorHabilitado = (conductorAuxObj.id > 0?(conductorAuxObj.isHabilitado == 1):true);
			var booleanHabilitado = generalHabilitadoTrabCont && conductorHabilitado;
			
			var estadoActualTrabContTotal =
			    "<div class='"+(booleanHabilitado?"estado-futurista-ok":"estado-no-habilitado-full")+"'>" +
			        "<i class='"+(booleanHabilitado?"fa fa-thumbs-up":"fa fa-ban")+"'></i>"+
				    "<div>"+"<div class='estado-titulo'>"+(booleanHabilitado?"Habilitado":"No habilitado")+"</div>"+"</div>" +
				"</div>";
				
            var textoTrabajosAltoRiesgo = (trabContratistaAuxObj.textoTrabajosAltoRiesgo.length == 0?"No tiene ninguno asignado.":
                (trabContratistaAuxObj.habilitadoTrabajosAltoRiesgo == 1?iconoGosst.aprobado:iconoGosst.alerta)+" "+trabContratistaAuxObj.textoTrabajosAltoRiesgo +
                "<br>"+"<a class='efectoLink' onclick='verConstanciaTrabAltoRiesgoTrabCon(0)' title='Ver el estado según los trabajos de alto riesgo asignados.'>" +
	                       "<i class='fa fa-eye'></i> Ver estado" +
	                   "</a>");
         
            var empresa = trabContratistaAuxObj.cliente.trim(),puestoTrabajo = (trabContratistaAuxObj.cargo.trim().length == 0?"------":trabContratistaAuxObj.cargo.trim());
				
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
				{clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                {clase:"divResultadoBusquedaTrabCont",fullRow:1,label:"",inputForm:contenidoEmpresaPuestoTrabajo},
   	            {clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante}
            ];

            if(proyectoAuxObj.numTrabajosAltoRiesgoTotal > 0 && (proyectoAuxObj.habilitadoConstanciaAltoRiesgo == 1 || proyectoAuxObj.habilitarCargoInduccionTrabAltRie == 1)){
				var contenidoTrabajosAltoRiesgo = obtenerFilaDobleInfoSimple("Trabajos de alto riesgo asignados:",textoTrabajosAltoRiesgo);
				
                listContenido.push({clase:"divResultadoBusquedaTrabCont",fullRow:1,label:"",inputForm:contenidoTrabajosAltoRiesgo});
            }

            if(proyectoAuxObj.habilitadoEsPrevencionista == 1){
				var contenidoPrevencionista =
				    "<div class='fila-doble-info'>" +
				        "<div class='fila-doble-info-item' style='flex:0 0 "+(proyectoAuxObj.habilitadoEntrevistaPrevencionista == 1?"calc(40% - 9px)":"100%")+";'>" +
				            "<div class='fila-doble-info-label'>¿Es prevencionista?</div>" +
				            "<div class='fila-doble-info-valor'>"+estadoDocumentosTrabConObj.textoPrevencionista+"</div>" +
				        "</div>" +
				        (proyectoAuxObj.habilitadoEntrevistaPrevencionista == 1?
				            "<div class='fila-doble-info-item' style='flex:0 0 calc(60% - 9px);'>" +
				                "<div class='fila-doble-info-label'>Entrevista prevencionista</div>" +
				                "<div class='fila-doble-info-valor'>"+estadoDocumentosTrabConObj.textoEntrevistaPrevencionista+"</div>" +
				            "</div>" : "") +
				    "</div>";
				
                listContenido.push({clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				    {clase:"divResultadoBusquedaTrabCont",fullRow:1,label:"",inputForm:contenidoPrevencionista});
            }

			var listContenidoDntcAux = [];
					                  
			listContenidoDntcAux = obtenerContratistaListaDocumentosNivelTrabajadorContratista(proyectoAuxObj,trabContratistaAuxObj,estadoDocumentosTrabConObj,"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal");
					       
			var tieneDetalleEstadoActualTrabContTotal = proyectoAuxObj.numDocumentosNivelEmpresaTotal > 0 || proyectoAuxObj.numDocumentosNivelProyectoTotal > 0 || listContenidoDntcAux.length > 0;
			
			var tieneEstadoActualTrabContTotal = tieneDetalleEstadoActualTrabContTotal || trabContratistaAuxObj.indicadorBlacklist != null;
			
			if(tieneEstadoActualTrabContTotal){
				listContenido.push({clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaSuaveMinimalista},
				    {clase:"divResultadoBusquedaTrabCont estado-actual-compacto",anchoLabel:"col-sm-12",anchoDiv:"col-sm-12",label:"",
				     inputForm:estadoActualTrabContTotal+(tieneDetalleEstadoActualTrabContTotal?"<a class='estado-detalle-alternar' id='idDetalleEstadoActualTrabContTotal'></a>":"")});
					 
			    if(proyectoAuxObj.numDocumentosNivelEmpresaTotal > 0){
			        listContenido.push({clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
					    {clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
					     label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL EMPRESA ***</span>",inputForm:""}); 
					             	
					var listContenidoDneAux = [];
					                     
					listContenidoDneAux = obtenerContratistaListaDocumentosNivelEmpresa(contratistaAuxBusOpcDosObj,estadoDocumentosNivelEmpresaConObj,"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal");
					            
					for(var i = 0;i < listContenidoDneAux.length;i++){
					    listContenido.push(listContenidoDneAux[i]);
					}
			    }
					                 
			    if(proyectoAuxObj.numDocumentosNivelProyectoTotal > 0){
			        listContenido.push({clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
					    {clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
					     label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL PROYECTO ***</span>",inputForm:""}); 
					                 	
					var listContenidoDnpAux = [];
					                   
					listContenidoDnpAux = obtenerContratistaListaDocumentosNivelProyecto(proyectoAuxObj,estadoDocumentosNivelProyectoConObj,"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal");
					          
					for(var i = 0;i < listContenidoDnpAux.length;i++){
					     listContenido.push(listContenidoDnpAux[i]);
					}
			    }
				
				if(listContenidoDntcAux.length > 0){
				    listContenido.push({clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				        {clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
				         label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL TRABAJADOR CONTRATISTA ***</span>",inputForm:""});
						       
			        for(var i = 0;i < listContenidoDntcAux.length;i++){
			            listContenido.push(listContenidoDntcAux[i]);
			        }
			    }
			}
            
            if(proyectoAuxObj.habilitadoConductor == 1){
                var tipoLicenciasAprobadas = (conductorAuxObj.tiposLicenciaConductorHabilitadosNombre.length == 0?"Ninguno":conductorAuxObj.tiposLicenciaConductorHabilitadosNombre);
                var iconoConductorNoHabilitado = "<i class='fa fa-exclamation-circle' style='color:#C0504D;margin-right:4px;' title='Es la razón de que salga NO HABILITADO'></i>";

            	var contenidoConductorLicencias =
            	    "<div class='fila-doble-info'>" +
            	        "<div class='fila-doble-info-item' style='flex:0 0 calc(30% - 9px);'>" +
            	            "<div class='fila-doble-info-label'>¿Es conductor?</div>" +
            	            "<div class='fila-doble-info-valor'>"+(conductorAuxObj.id > 0?"Sí":"No")+"</div>" +
            	        "</div>" +
            	        "<div class='fila-doble-info-item' style='flex:0 0 calc(70% - 9px);'>" +
            	            "<div class='fila-doble-info-label'>"+(!conductorHabilitado?iconoConductorNoHabilitado:"")+"Tipo(s) de licencia(s) habilitadas:</div>" +
            	            "<div class='fila-doble-info-valor'"+(!conductorHabilitado?" style='color:#C0504D;'":"")+">"+tipoLicenciasAprobadas+"</div>" +
            	        "</div>" +
            	    "</div>" +
            	     (conductorAuxObj.tiposLicenciaConductorId.length > 0?
            	      "<div style='display:flex;justify-content:flex-end;margin-top:6px;'>" +
            	          "<a class='estado-detalle-alternar' style='margin:0;"+(!conductorHabilitado?"color:#C0504D;":"")+"' onclick='verEstadoActualConductorConsulta()'>"+(!conductorHabilitado?iconoConductorNoHabilitado:"")+"Ver detalle <i class='fa fa-chevron-down'></i></a>" +
            	      "</div>":"");

            	listContenido.push({clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaSuaveMinimalista},
				    {clase:"divResultadoBusquedaTrabCont",fullRow:1,label:"",inputForm:contenidoConductorLicencias});
            }
         
            listContenido.forEach(function(val){
        	    contenido += obtenerSubPanelModuloVersionTres(val);
            });
       	  		
            $("#divResTotalTrabCont").parent().after(contenido);$.unblockUI();
         
            ocultarEstadoActualTrabContTotal();
        });
    }else{
	$("#modalEstadoActualTrabajadorContratista").modal("hide");
       
	mensajeUx = (idContratista == -1?"<label>Debe ingresar el RUC y/o nombre de la contratista en el buscador y seleccionarla.</label>":
            (idTrabajadorContratista == -1?"<label>Debe ingresar el N° documento y/o nombre/apellido del trabajador contratista en el " +
             "buscador y seleccionarlo.</label>":"<label>No tiene algún proyecto activo asignado.</label>"));
	mensajesUx(mensajeUx,2,"","ValidacionConsultaTrabCont");
      
	$("#modalMensajeUxValidacionConsultaTrabCont").on("hidden.bs.modal",function(){
	    if(accesoOpcion == 1){
		if(listResultadoBusquedaTrabContOpcional.length == 1){
		    $("#modalConsultarTrabContNroDoc").modal("show");
		}else{
		    $("#modalConsultarOpcionalTrabCont").modal("show");
		}
	    }
	});
    }
}

function verEstadoActualTrabContTotal(){
    $(".divEstadoActualTrabContTotal").show();

    var iconoReq = (!generalHabilitadoTrabCont?"<i class='fa fa-exclamation-circle' style='color:#C0504D;margin-right:4px;' title='Tiene algún requisito general pendiente'></i>":"");
    $("#idDetalleEstadoActualTrabContTotal").html(iconoReq+"Ocultar detalle <i class='fa fa-chevron-up'></i>");
    $("#idDetalleEstadoActualTrabContTotal").css("color",(!generalHabilitadoTrabCont?"#C0504D":""));
    $("#idDetalleEstadoActualTrabContTotal").attr("onclick","ocultarEstadoActualTrabContTotal()");
}

function ocultarEstadoActualTrabContTotal(){
    $(".divEstadoActualTrabContTotal").hide();

    var iconoReq = (!generalHabilitadoTrabCont?"<i class='fa fa-exclamation-circle' style='color:#C0504D;margin-right:4px;' title='Tiene algún requisito general pendiente'></i>":"");
    $("#idDetalleEstadoActualTrabContTotal").html(iconoReq+"Ver detalle <i class='fa fa-chevron-down'></i>");
    $("#idDetalleEstadoActualTrabContTotal").css("color",(!generalHabilitadoTrabCont?"#C0504D":""));
    $("#idDetalleEstadoActualTrabContTotal").attr("onclick","verEstadoActualTrabContTotal()");
}

function ocultarConstanciaTrabAltoRiesgoTrabCon(){
   $("#modalDetalleConstTrabAltoRiesgo").modal("hide");
}

function verConstanciaTrabAltoRiesgoTrabCon(opcionModal){
   $("#modalDetalleConstTrabAltoRiesgo").remove();
   
   if(parseInt(opcionModal) == 0){
      $("#modalEstadoActualTrabajadorContratista").modal("hide");
   }
      
   var contenido = "",listContenido = [];
   
   var nombreCompleto = (trabContratistaAuxObj.apellido.length == 0 && trabContratistaAuxObj.nombre.length == 0?"------":
      ((trabContratistaAuxObj.apellido.length == 0?"":trabContratistaAuxObj.apellido+", ")+(trabContratistaAuxObj.nombre.length == 0?"":trabContratistaAuxObj.nombre)));
     
   listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-building-o' aria-hidden='true'></i> Contratista:",inputForm:trabContratistaAuxObj.contratista.nombre},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-user' aria-hidden='true'></i> Trabajador(a):",inputForm:nombreCompleto});
      
    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo9 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo9 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJOS EN ALTURA ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo9});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo9});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo9});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo10 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo10 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJOS EN CALIENTE ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo10});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo10});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo10});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo11 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo11 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** ESPACIOS CONFINADOS ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo11});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo11});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo11});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo12 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo12 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJOS ELÉCTRICOS ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo12});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo12});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo12});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo13 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo13 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** IZAJE DE CARGAS ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo13});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo13});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo13});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo26 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo26 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MONTAJE, ARMADO Y DESMONTAJE DE ANDAMIOS ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo26});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo26});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo26});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo27 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo27 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** HERRAMIENTAS MANUALES ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo27});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo27});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo27});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo28 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo28 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** HERRAMIENTAS DE PODER ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo28});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo28});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo28});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo29 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo29 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MAQUINARIA PESADA ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo29});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo29});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo29});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo30 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo30 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXCAVACIONES Y ZANJAS ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo30});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo30});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo30});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo31 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo31 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** OPERADOR DE MANLIFT ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo31});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo31});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo31});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo32 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo32 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** OPERADOR DE GRÚA ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo32});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo32});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo32});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo62 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo62 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MATPEL ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo62});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo62});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo62});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo66 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo66 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** RIGGER ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo66});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo66});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo66});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo80 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo80 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CONDUCCIÓN DE VEHÍCULO Y EQUIPOS MÓVILES ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo80});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo80});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo80});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo81 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo81 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXPOSICIÓN A ÓRGANOS FOSFORADOS (FUMIGACIÓN) ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo81});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo81});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo81});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo82 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo82 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXPOSICIÓN A RUIDO ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo82});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo82});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo82});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo83 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo83 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXPOSICIÓN A MATERIAL BIOLÓGICO ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo83});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo83});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo83});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo85 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo85 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJOS EN INTEMPERIE ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo85});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo85});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo85});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo86 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo86 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EXPOSICIÓN A MATERIAL PARTICULADO Y/O QUÍMICOS VOLÁTILES ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo86});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo86});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo86});
        }
    }

    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo87 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo87 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CONTACTO DIRECTO CON PASAJEROS/CLIENTES ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo87});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo87});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo87});
        }
    }
    
    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo120 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo120 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** SISTEMA ANTICAÍDAS PARA ESCALERA FABA ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo120});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo120});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo120});
        }
    }
    
    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo121 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo121 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** SISTEMA ANTICAÍDAS PARA ESCALERA TIPO GATO ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo121});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo121});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo121});
        }
    }
    
    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo122 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo122 == 1){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** SISTEMA ANTICAÍDAS PARA TECHO INCLINADO ***</span>",inputForm:""});

        if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
                inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo122});
        }

        if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
                inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo122});
        }
        
        if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
            listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
                inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo122});
        }
    }
	
	if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo135 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo135 == 1){
	    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** ÍTEM DE RESCATISTA ***</span>",inputForm:""});

	    if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
	        listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
	            inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo135});
	    }

	    if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
	        listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
	            inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo135});
	    }
	        
	    if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
	        listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
	            inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo135});
	    }
	}
		
    if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo136 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo136 == 1){
		listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** BLOQUEO DE ENERGÍAS PELIGROSAS ***</span>",inputForm:""});

		if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
		        inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo136});
		}

		if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
		        inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo136});
		}
		        
		if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
		        inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo136});
		}
	}
	
	if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo160 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo160 == 1){
		listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJO EN FRÍO - CALIENTE ***</span>",inputForm:""});

		if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
		        inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo160});
		}

		if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
		        inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo160});
		}
		        
		if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
		        inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo160});
		}
	}

	if(trabContratistaAuxObj.habilitadoTrabajoAltoRiesgo161 == 1 && trabContratistaAuxObj.incluirTrabajoAltoRiesgo161 == 1){
		listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MEDICIÓN DE GASES ***</span>",inputForm:""});

		if(trabContratistaAuxObj.habilitadoConstanciaAltoRiesgo == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-certificate' aria-hidden='true'></i> Certificado de capacitación:",
		        inputForm:trabContratistaAuxObj.estadoActualCertificadoTrabajoAltoRiesgo161});
		}

		if(trabContratistaAuxObj.habilitarCargoInduccionTrabAltRie == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-o' aria-hidden='true'></i> Cargo de la inducción:",
		        inputForm:trabContratistaAuxObj.estadoActualCargoTrabajoAltoRiesgo161});
		}
		        
		if(trabContratistaAuxObj.habilitadoMedicoClinica == 1){
		    listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file-text-o' aria-hidden='true'></i> Habilitación médica por clínica:",
		        inputForm:trabContratistaAuxObj.estadoActualMedicoClinicaTrabajoAltoRiesgo161});
		}
	}	

    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarConstanciaTrabAltoRiesgoTrabCon()'>" +
 	        "<i class='fa fa-arrow-left'></i> Volver" +
 	     "</button>",inputForm:""});
       
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
     	  				
   var modalOptions={
      id:"modalDetalleConstTrabAltoRiesgo",nombre:"<i class='fa fa-list-ul'></i> Trabajos de alto riesgo asignados - Estado",btnCerrarHabilitado:0,
      contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
   };
     	  				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
      
   $("#modalDetalleConstTrabAltoRiesgo").on("hidden.bs.modal",function(){
      if(parseInt(opcionModal) == 1){
         $("#modalConsolidadoTrabContAsig").modal("show");
      }else{
	 $("#modalEstadoActualTrabajadorContratista").modal("show"); 
      }
   }); 
}

function volverEstadoActualConductorConsulta(){
   $("#modalEstadoActualConductor").modal("hide");
}

function verEstadoActualConductorConsulta(){
   $("#modalEstadoActualTrabajadorContratista").modal("hide"); $("#modalEstadoActualConductor").remove();

   var contenidoColumnaTipoLicCond = "";
   
   listTipoLicencias.forEach(function(val){
      contenidoColumnaTipoLicCond += "<th class='tb-acc' style='width:300px'>"+val.nombre+"</th>";
   });
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverEstadoActualConductorConsulta()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
       
   var modalOptions={
      maxWidth:"90%",id:"modalEstadoActualConductor",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-user'></i> Conductor "+conductorAuxObj.trabContratista.nombre+" <span id='spanConductorEstadoActual'></span>",
      contenido: 
	  "<div class='eventoGeneral-moderno'>" +
	   buttonVolver +
         "<div class='wrapper' id='wrapperEstadoActualConductor'>" +
            "<table id='tblEstadoActualConductor' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' rowspan='2' style='width:400px'>Documento a nivel conductor</th>" +
		     "<th class='tb-acc' colspan='"+numTipoLicCondHabilitados+"' style='width:"+(numTipoLicCondHabilitados*300)+"px'>Tipo de licencia conductor</th>" +
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
   resizeDivWrapper("wrapperEstadoActualConductor",240);
   
   var numTipoLicenciaCondHabilitadosTotal = 0,numTipoLicenciaCondAprobadosTotal = 0;
	 
   $("#tblEstadoActualConductor tbody tr").remove();
	 
   listDocumentosConductorAux.forEach(function(val){
      $("#tblEstadoActualConductor tbody").append(
         "<tr>" +
	    "<td>"+val.nombre+"</td>" +
	     (mapTipoLicenciaCondHabilitada.get(1) == 1?"<td>"+val.estadoActualVehiculoCiudad+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(2) == 1?"<td>"+val.estadoActualVehiculo4x4+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(3) == 1?"<td>"+val.estadoActualCamionCisterna+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(4) == 1?"<td>"+val.estadoActualMaquinariaGrua+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(5) == 1?"<td>"+val.estadoActualLineaAmarilla+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(6) == 1?"<td>"+val.estadoActualVehiculosLivianos+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(7) == 1?"<td>"+val.estadoActualVehiculosPesados+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(8) == 1?"<td>"+val.estadoActualCamionesGruas+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(9) == 1?"<td>"+val.estadoActualVehiculosIndustriales+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(10) == 1?"<td>"+val.estadoActualMaquinariaPesada+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(11) == 1?"<td>"+val.estadoActualTipoLicCond11+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(12) == 1?"<td>"+val.estadoActualTipoLicCond12+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(13) == 1?"<td>"+val.estadoActualTipoLicCond13+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(14) == 1?"<td>"+val.estadoActualTipoLicCond14+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(15) == 1?"<td>"+val.estadoActualTipoLicCond15+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(16) == 1?"<td>"+val.estadoActualTipoLicCond16+"</td>":"") +
	 "</tr>");
	    
      numTipoLicenciaCondHabilitadosTotal = numTipoLicenciaCondHabilitadosTotal + val.numTipoLicenciaCondHabilitados;
      numTipoLicenciaCondAprobadosTotal = numTipoLicenciaCondAprobadosTotal + val.numTipoLicenciaCondAprobados;
   });
	 
   var habilitado = (numTipoLicenciaCondHabilitadosTotal == numTipoLicenciaCondAprobadosTotal && (numTipoLicenciaCondHabilitadosTotal > 0 || (conductorAuxObj.tiposLicenciaConductorId != null && conductorAuxObj.tiposLicenciaConductorId.length > 0))?"Sí":"No");
	 
   $("#spanConductorEstadoActual").html("- ¿Habilitado? "+habilitado+" ("+numTipoLicenciaCondAprobadosTotal +"/"+numTipoLicenciaCondHabilitadosTotal+")");
	
   goheadfixedY("#tblEstadoActualConductor","#wrapperEstadoActualConductor");
   
   $("#modalEstadoActualConductor").on("hidden.bs.modal",function(){
      $("#modalEstadoActualTrabajadorContratista").modal("show"); 
   }); 
}

var listResultadoBusquedaTrabContOpcional = [];

function ocultarConsultaTrabajadorContratistaPorNroDocumento(){
    $("#modalConsultarTrabContNroDoc").modal("hide");
}

function verConsultaTrabajadorContratistaPorNroDocumento(){
    $("#modalConsultarTrabContNroDoc").remove();
    
    var contenido = "";
  				
    var listContenido=[
  	    {label:"N° de documento",inputForm:"<input id='nroDocumentoConsTrabContOpc' class='form-control' type='text'>"},
  	    {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	    {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConsultaTrabajadorContratistaPorNroDocumento()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
  	     inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='verConsultaTrabajadorContratistaOpcional()'>" +
  	                   "<i class='fa fa-search'></i> Buscar" +
  	               "</button>"}
    ]; 
  				
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
    });
   
    var modalOptions={
        id:"modalConsultarTrabContNroDoc",nombre:"<i class='fa fa-id-card'></i> Consulta - Trabajador contratista por N° de documento",
  	    contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0
    };
  				
    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function ocultarConsultaTrabajadorContratistaOpcional(){
    $("#modalConsultarOpcionalTrabCont").modal("hide");$("#modalConsultarTrabContNroDoc").modal("show");
}

function verConsultaTrabajadorContratistaOpcional(){
    var nroDocumentoVal = $("#nroDocumentoConsTrabContOpc").val().trim();
    
    if(nroDocumentoVal.length > 0){
	    $("#modalConsultarTrabContNroDoc").modal("hide");$("#modalConsultarOpcionalTrabCont").remove();
    
        var dataParam={
            empresaId:parseInt(getSession("empresaId")),nroDocumento:nroDocumentoVal
        }; 
	  		
        callAjaxPostSimpleVersionDos(1,URL+'/public/contratista/trabajador/busqueda_opcional',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    listResultadoBusquedaTrabContOpcional = data.listContratistaTrabContOpcional;
	
                    if(listResultadoBusquedaTrabContOpcional.length > 0){
                        var contenido = "";
                        
                        var selContratistaConsultaOpc = crearSelectOneMenuOblig("selContratistaConsultaOpc","completarNombreTrabContConsultaOpcional()",
                            listResultadoBusquedaTrabContOpcional,"","contratistaId","contratistaNombre");

                        var listContenido=[
  	                        {label:"Trabajador:",inputForm:"",idDivContainer:"divTrabContConsultaOpc"},
  	                        {label:"Contratista:",inputForm:selContratistaConsultaOpc},
  	                        {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	                        {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarConsultaTrabajadorContratistaOpcional()'>" +
               	                       "<i class='fa fa-arrow-left'></i> Volver" +
               	                   "</button>",
  	                         inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='prepararParamConsultaTrabajadorContratistaOpcional()'>" +
  	                                       "<i class='fa fa-search'></i> Buscar" +
  	                                   "</button>"}
  	                    ]; 
  				
                    	listContenido.forEach(function(val){
                       	 	contenido += obtenerSubPanelModuloVersionTres(val);
                    	});
   	
                    	var modalOptions={
                            id:"modalConsultarOpcionalTrabCont",nombre:"<i class='fa fa-search'></i> Valores consulta - Trabajador contratista",
							contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
                    	};

                    	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
						
						completarNombreTrabContConsultaOpcional(data.hasSancionEnCurso);
                        
                    	if(data.hasSancionEnCurso == 0 && listResultadoBusquedaTrabContOpcional.length == 1){
                        	prepararParamConsultaTrabajadorContratistaOpcional();
                    	}
                	}else{
                		$("#modalConsultarTrabContNroDoc").modal("hide");
                	
                		mensajeUx="<label>No se encontró alguna coincidencia con el N° de documento ingresado.</label>";
                		mensajesUx(mensajeUx,2,"","ValidacionConsTrabCont");
                		
                		$("#modalMensajeUxValidacionConsTrabCont").on("hidden.bs.modal",function(){
                	    	$("#modalConsultarTrabContNroDoc").modal("show");
                		});
                    }
            
					break;
 	     
                default:
            	    alert("Error. Volver a cargar.");
             
      	    		break;
            }
        });
    }else{
	    $("#modalConsultarTrabContNroDoc").modal("hide");
	
		mensajeUx="<label>Debe completar el campo Nro documento.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionConsTrabCont");
		
		$("#modalMensajeUxValidacionConsTrabCont").on("hidden.bs.modal",function(){
	    	$("#modalConsultarTrabContNroDoc").modal("show");
		});
    }
}

function completarNombreTrabContConsultaOpcional(pHasSancion){
    var trabContratistaNombre;
    var contratistaIdAux = parseInt($("#selContratistaConsultaOpc").val());
    
    listResultadoBusquedaTrabContOpcional.forEach(function(val){
	    if(val.contratistaId == contratistaIdAux){
	        trabContratistaNombre = val.nombreCompleto;
	    }
    });
    
    $("#divTrabContConsultaOpc").html(trabContratistaNombre);
	
	var hasSancion = parseInt(pHasSancion);
	
	if(hasSancion == 1){
		$("#modalConsultarOpcionalTrabCont").modal("hide");
		
		mensajeUx = "<label>"+trabContratistaNombre+" está actualmente sancionado." +
	        "<br><br>¿Desea continuar con la consulta?</label>";
	    mensajesUx(mensajeUx,3,"","ConfRevInfoTrabCont");
		
		$("#btnRegresarPrevioConfRevInfoTrabCont").on("click",function(){
		    $("#modalConsultarTrabContNroDoc").modal("show");
		});
										
		$("#btnDevolverValorConfRevInfoTrabCont").on("click",function(){
		    if(listResultadoBusquedaTrabContOpcional.length == 1){
				prepararParamConsultaTrabajadorContratistaOpcional();
			}else{
				$("#modalConsultarOpcionalTrabCont").modal("show");
			}
		});
	}
}

function prepararParamConsultaTrabajadorContratistaOpcional(){
    var parametrosEncontrados = false;
    var contratistaIdAux = parseInt($("#selContratistaConsultaOpc").val());
    
    listResultadoBusquedaTrabContOpcional.forEach(function(val,index){
	if(val.contratistaId == contratistaIdAux){
	    trabContOpcNroDocId = val.id;contOpcNroDocId = val.contratistaId;parametrosEncontrados = true;
	}
    });
    
    if(parametrosEncontrados){
        previoBuscarDatosTrabajadorContratista(1);
    }
}
