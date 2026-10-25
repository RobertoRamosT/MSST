
var listVehiculosMaquinariasBuscadorAux = [];

function verAutoCompletarVehiculoMaquinariaConsulta(){
   var contratistaId = parseInt($("#selContratistaConsulta").val());
   var vehiculoMaquinaria = $("#inputVehiculoMaquinariaConsulta").val().trim();
   
   document.getElementById("inputVehiculoMaquinariaConsulta").disabled = (contratistaId != -1?false:true); 

   if(contratistaId != -1){
      if(vehiculoMaquinaria.length >= 3){
         var dataParam={
	    placa:"%"+vehiculoMaquinaria+"%",isBuscador:1,contratistaId:contratistaId
         };

         callAjaxPostNoLoad(URL+"/contratista/vehiculo_maquinaria/buscar/simple",dataParam,function(data){
	    listVehiculosMaquinariasBuscadorAux = (data.vehiculosMaquinarias.length == 0?[{id:-1,placa:"No encontrado"}]:data.vehiculosMaquinarias);
	   
    	    var selAutoVehiculoMaquinariaConsulta = crearSelectOneMenuOblig("selAutoVehiculoMaquinariaConsulta","",
    	       listVehiculosMaquinariasBuscadorAux,"","id","placa");
	
    	    $("#divAutoCompletarVehiculoMaquinariaConsulta").html(selAutoVehiculoMaquinariaConsulta);
    	    $("#inputVehiculoMaquinariaConsulta").attr("onkeyup","verAutoCompletarVehiculoMaquinariaConsulta()");
         });
      }else{
         listVehiculosMaquinariasBuscadorAux = [{id:-1,placa:"No encontrado"}];
	     
         var selAutoVehiculoMaquinariaConsulta = crearSelectOneMenuOblig("selAutoVehiculoMaquinariaConsulta","",
	    listVehiculosMaquinariasBuscadorAux,"","id","placa");
	    		       
         $("#divAutoCompletarVehiculoMaquinariaConsulta").html(selAutoVehiculoMaquinariaConsulta);
         $("#inputVehiculoMaquinariaConsulta").attr("onkeyup","verAutoCompletarVehiculoMaquinariaConsulta()");
      }
   }else{
      $("#inputVehiculoMaquinariaConsulta").val("");$("#divAutoCompletarVehiculoMaquinariaConsulta").html("");
   }
}

var listResultadoBusquedaVehMaqOpcional = [];
var vehiculoMaquinariaObj,estadoActualVehMaq;
var vehMaqOpcId,vehMaqOpcContId;

function ocultarConsultaVehiculoMaquinariaPorPlaca(){
    $("#modalConsultarVehMaqPlaca").modal("hide");$("#modalPerfilesInformacionVistaConsulta").modal("show");
}

function verConsultaVehiculoMaquinariaPorPlaca(){
    $("#modalPerfilesInformacionVistaConsulta").modal("hide");$("#modalConsultarVehMaqPlaca").remove();
    
    var contenido = "";
  				
    var listContenido=[
  	    {label:"Placa",inputForm:"<input id='placaConsVehMaqOpc' class='form-control' type='text'>"},
  		{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  		{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConsultaVehiculoMaquinariaPorPlaca()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
  	 	 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='verConsultaVehiculoMaquinariaOpcional()'>" +
  	                   "<i class='fa fa-search'></i> Buscar" +
  	           	   "</button>"}
    ]; 
  				
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
    });
   
    var modalOptions={
        id:"modalConsultarVehMaqPlaca",nombre:"<i class='fa fa-barcode'></i> Consulta - Vehículo/Maquinaria por placa",
  	    contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0
    };
  				
    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function ocultarConsultaVehiculoMaquinariaOpcional(){
    $("#modalConsultarOpcionalVehMaq").modal("hide");$("#modalConsultarVehMaqPlaca").modal("show");
}

function verConsultaVehiculoMaquinariaOpcional(){
    var placa = $("#placaConsVehMaqOpc").val().trim();
    
    if(placa.length > 0){
		$("#modalConsultarVehMaqPlaca").modal("hide");$("#modalConsultarOpcionalVehMaq").remove();
    
        var dataParam={
            empresaId:parseInt(getSession("gestopcompanyid")),placa:placa
        };
	  		
        callAjaxPostSimpleVersionDos(1,URL+'/contratista/vehiculo_maquinaria/busqueda_opcional',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    listResultadoBusquedaVehMaqOpcional = data.listContratistaVehMaqOpcional;
	
                    if(listResultadoBusquedaVehMaqOpcional.length > 0){
                        var contenido = "";
                        
                        var selContratistaConsultaVehMaqOpc = crearSelectOneMenuOblig("selContratistaConsultaVehMaqOpc","completarPlacaVehMaqConsultaOpcional()",
                            listResultadoBusquedaVehMaqOpcional,"","contratistaId","contratistaNombre");
  				
                        var listContenido=[
  	                    	{label:"Placa:",inputForm:"",idDivContainer:"divPlacaVehMaqConsultaOpc"},
  	                    	{label:"Contratista:",inputForm:selContratistaConsultaVehMaqOpc},
  	                    	{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	                    	{label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarConsultaVehiculoMaquinariaOpcional()'>" +
               	                       "<i class='fa fa-arrow-left'></i> Volver" +
               	               	   "</button>",
  	                     	 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='prepararParamConsultaVehiculoMaquinariaOpcional()'>" +
  	                                       "<i class='fa fa-search'></i> Buscar" +
  	                               	   "</button>"}
  	                	]; 
  				
                        listContenido.forEach(function(val){
                            contenido += obtenerSubPanelModuloVersionTres(val);
                        });
   
                        var modalOptions={
                            id:"modalConsultarOpcionalVehMaq",nombre:"<i class='fa fa-search'></i> Valores consulta - Vehiculo/Maquinaria",
                            contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
                        };
  				
                        crearModalPrincipalUsuario(modalOptions,function(){},true,true);
                        
                        completarPlacaVehMaqConsultaOpcional(data.hasSancionEnCurso);
                        
                        if(data.hasSancionEnCurso == 0 && listResultadoBusquedaVehMaqOpcional.length == 1){
                            prepararParamConsultaVehiculoMaquinariaOpcional();
                        }
                    }else{
                		$("#modalConsultarVehMaqPlaca").modal("hide");
                	
                		mensajeUx="<label>No se encontró alguna coincidencia con la placa ingresada.</label>";
                		mensajesUx(mensajeUx,2,"","ValidacionConsVehMaq");
                		
                		$("#modalMensajeUxValidacionConsVehMaq").on("hidden.bs.modal",function(){
                	    	$("#modalConsultarVehMaqPlaca").modal("show");
                		});
                    }
                    
                    break;
 	     
                default:
            	    alert("Error. Volver a cargar.");
             
      	    	    break;
            }
        });
    }else{
		$("#modalConsultarVehMaqPlaca").modal("hide");
	
		mensajeUx="<label>Debe completar el campo placa.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionConsVehMaq");
		
		$("#modalMensajeUxValidacionConsVehMaq").on("hidden.bs.modal",function(){
	    	$("#modalConsultarVehMaqPlaca").modal("show");
		});
    }
}

function completarPlacaVehMaqConsultaOpcional(pHasSancion){
    var vehMaquinariaPlaca;
    var contratistaIdAux = parseInt($("#selContratistaConsultaVehMaqOpc").val());
    
    listResultadoBusquedaVehMaqOpcional.forEach(function(val){
		if(val.contratistaId == contratistaIdAux){
	    	vehMaquinariaPlaca = val.placa;
		}
    });
    
    $("#divPlacaVehMaqConsultaOpc").html(vehMaquinariaPlaca);
	
	var hasSancion = parseInt(pHasSancion);
			
	if(hasSancion == 1){
		$("#modalConsultarOpcionalVehMaq").modal("hide");
				
		mensajeUx = "<label>"+vehMaquinariaPlaca+" está actualmente sancionado." +
			"<br><br>¿Desea continuar con la consulta?</label>";
		mensajesUx(mensajeUx,3,"","ConfRevInfoVehMaq");
				
		$("#btnRegresarPrevioConfRevInfoVehMaq").on("click",function(){
			$("#modalConsultarVehMaqPlaca").modal("show");
		});
												
		$("#btnDevolverValorConfRevInfoVehMaq").on("click",function(){
			if(listResultadoBusquedaVehMaqOpcional.length == 1){
				prepararParamConsultaVehiculoMaquinariaOpcional();
			}else{
				$("#modalConsultarOpcionalVehMaq").modal("show");
			}
		});
    }
}

function prepararParamConsultaVehiculoMaquinariaOpcional(){
    var parametrosEncontrados = false;
    var contratistaIdAux = parseInt($("#selContratistaConsultaVehMaqOpc").val());
    
    listResultadoBusquedaVehMaqOpcional.forEach(function(val){
		if(val.contratistaId == contratistaIdAux){
	    	vehMaqOpcId = val.id;vehMaqOpcContId = val.contratistaId;parametrosEncontrados = true;
		}
    });
    
    if(parametrosEncontrados){
		buscarDatosVehiculoMaquinaria();
    }
}

function ocultarDatosVehiculoMaquinaria(){
    $("#modalEstadoActualVehiculoMaquinaria").modal("hide");$("#modalConsultarVehMaqPlaca").modal("show");
}

function buscarDatosVehiculoMaquinaria(){
    $("#modalConsultarOpcionalVehMaq").modal("hide");$("#modalEstadoActualVehiculoMaquinaria").remove();
    
    var idContratista = vehMaqOpcContId;
    var idVehiculoMaquinaria = vehMaqOpcId;
     
    if(idContratista != -1 && idVehiculoMaquinaria != -1){
        var dataParam={
 	        id:idVehiculoMaquinaria,contratistaId:idContratista
        };
      
        callAjaxPostSimpleVersionDos(1,URL+"/contratista/consulta/contratista/vehiculo_maquinaria",dataParam,1,0,function(data){
            vehiculoMaquinariaObj = data.vehiculoMaquinaria;estadoActualVehMaq = data.estadoActualVehMaq;
         
			var booleanHabilitado = (estadoActualVehMaq.habilitado == "Sí"?true:false);
					
			var estadoActualVehMaqTotal =
				"<div class='"+(booleanHabilitado?"estado-futurista-ok":"estado-no-habilitado-full")+"'>" +
				    "<i class='"+(booleanHabilitado?"fa fa-thumbs-up":"fa fa-ban")+"'></i>"+
				    "<div>"+"<div class='estado-titulo'>"+(booleanHabilitado?"Habilitado":"No habilitado")+"</div>"+"</div>" +
				"</div>";
         
          	var proyectoAsignadoTexto = (vehiculoMaquinariaObj.proyectoAsignadoTexto.length == 0?"------":vehiculoMaquinariaObj.proyectoAsignadoTexto),
                detalle = (vehiculoMaquinariaObj.detalle.length == 0?"------":vehiculoMaquinariaObj.detalle);
	            
            var contenido = "";
         
           	var listContenido=[
                {label:"<i class='fa fa-list-alt'></i> Contratista:",inputForm:vehiculoMaquinariaObj.contratistaNombre},
                {label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                {label:"<i class='fa fa-barcode'></i> Placa:",inputForm:vehiculoMaquinariaObj.placa},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-list'></i> Tipo:",inputForm:vehiculoMaquinariaObj.tipoLicenciaConductor.nombre},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-tag'></i> Marca:",inputForm:vehiculoMaquinariaObj.marca},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-calendar'></i> Año de fabricación:",inputForm:vehiculoMaquinariaObj.anioFabricacion},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-pencil'></i> Detalle:",inputForm:detalle},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-book'></i> Proyecto asignado:",inputForm:proyectoAsignadoTexto}
            ];

			var tieneDetalleEstadoActualVehMaqTotal = vehiculoMaquinariaObj.numHabilitarExamNivelVehMaqTotal > 0;
					
			listContenido.push({label:"",inputForm:"",styleTotal:styleLineaSuaveMinimalista},
			    {clase:"estado-actual-compacto",anchoLabel:"col-sm-12",anchoDiv:"col-sm-12",label:"",
			     inputForm:estadoActualVehMaqTotal+(tieneDetalleEstadoActualVehMaqTotal?"<a class='estado-detalle-alternar' id='idDetalleEstadoActualVehMaqTotal'></a>":""),styleTotal:"margin-bottom:10px;"});
					
			if(vehiculoMaquinariaObj.numHabilitarExamNivelVehMaqTotal > 0){
				listContenido.push({clase:"divDescripcionDocumentoVehMaq",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				    {clase:"divDescripcionDocumentoVehMaq",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
					 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL VEHÍCULO/MAQUINARIA ***</span>",inputForm:""});
						
				var listContenidoDnvmAux = [];
										                   
				listContenidoDnvmAux = obtenerVehiculoMaquinariaListaDocumentosNivelVehMaq(vehiculoMaquinariaObj,estadoActualVehMaq,"divDescripcionDocumentoVehMaq");
										          
				for(var i = 0;i < listContenidoDnvmAux.length;i++){
				    listContenido.push(listContenidoDnvmAux[i]);
				}
			}
          
            listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
                {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarDatosVehiculoMaquinaria()'>" +
                           "<i class='fa fa-arrow-left'></i> Volver" +
                       "</button>",inputForm:""});
         
          	listContenido.forEach(function(val){
               	contenido += obtenerSubPanelModuloVersionTres(val);
           	});
       	  				
           	var modalOptions={
                id:"modalEstadoActualVehiculoMaquinaria",nombre:"<i class='fa fa-search'></i> Resultado de la búsqueda - vehículo/maquinaria",
                contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
          	};
         
       	  	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
          
            ocultarDetalleDocumentosVehiculoMaquinaria();$.unblockUI();
        });
    }else{
		$("#modalEstadoActualVehiculoMaquinaria").modal("hide");
		
        mensajeUx = (idContratista == -1?"<label>Debe ingresar el RUC y/o nombre de la contratista en el buscador y " +
            "seleccionarla.</label>":"<label>Debe ingresar la placa del vehículo/maquinaria en el buscador y seleccionarla.</label>");
        mensajesUx(mensajeUx,2,"","ValidacionConsultaVehMaq");
      
        $("#modalMensajeUxValidacionConsultaVehMaq").on("hidden.bs.modal",function(){
		    if(listResultadoBusquedaVehMaqOpcional.length == 1){
		    	$("#modalConsultarVehMaqPlaca").modal("show");
			}else{
		    	$("#modalConsultarOpcionalVehMaq").modal("show");
			}
		});
    }
}

function verDetalleDocumentosVehiculoMaquinaria(){
    $(".divDescripcionDocumentoVehMaq").show();
    
    $("#idDetalleEstadoActualVehMaqTotal").html("Ocultar detalle <i class='fa fa-chevron-up'></i>");
    $("#idDetalleEstadoActualVehMaqTotal").attr("onclick","ocultarDetalleDocumentosVehiculoMaquinaria()");
}

function ocultarDetalleDocumentosVehiculoMaquinaria(){
    $(".divDescripcionDocumentoVehMaq").hide();
    
    $("#idDetalleEstadoActualVehMaqTotal").html("Ver detalle <i class='fa fa-chevron-down'></i>");
    $("#idDetalleEstadoActualVehMaqTotal").attr("onclick","verDetalleDocumentosVehiculoMaquinaria()");
}
