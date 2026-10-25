
var listResultadoBusquedaVehMaqOpcionalOpcGenCont = [];
var vehiculoMaquinariaOpcGenContObj,estadoActualVehMaqOpcGenCont;
var vehMaqOpcGenContId,vehMaqOpcContOpcGenContId;

function ocultarConsultaVehiculoMaquinariaPorPlacaOpcGenCont(){
    $("#modalConsultarVehMaqPlacaOpcGenCont").modal("hide");
	
	if(parseInt(getSession("accesoUsuarios")) == 14){
        $("#modalPrevioRegistroAccesoVd").modal("show");
    }
}

function verConsultaVehiculoMaquinariaPorPlacaOpcGenCont(){
	if(parseInt(getSession("accesoUsuarios")) == 14){
	    $("#modalPrevioRegistroAccesoVd").modal("hide");
    }
	
	$("#modalConsultarVehMaqPlacaOpcGenCont").remove();
    
    var contenido = "";
  				
    var listContenido=[
  	    {label:"Placa",inputForm:"<input id='placaConsVehMaqOpcGenCont' class='form-control' type='text'>"},
  		{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  		{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConsultaVehiculoMaquinariaPorPlacaOpcGenCont()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
  	 	 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='verConsultaVehiculoMaquinariaOpcionalOpcGenCont()'>" +
  	                   "<i class='fa fa-search'></i> Buscar" +
  	           	   "</button>"}
    ]; 
  				
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
    });
   
    var modalOptions={
        id:"modalConsultarVehMaqPlacaOpcGenCont",nombre:"<i class='fa fa-barcode'></i> Consulta - Vehículo/Maquinaria por placa",
  	    contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0
    };
  				
    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function ocultarConsultaVehiculoMaquinariaOpcionalOpcGenCont(){
    $("#modalConsultarOpcionalVehMaqOpcGenCont").modal("hide");$("#modalConsultarVehMaqPlacaOpcGenCont").modal("show");
}

function verConsultaVehiculoMaquinariaOpcionalOpcGenCont(){
    var placa = $("#placaConsVehMaqOpcGenCont").val().trim();
    
    if(placa.length > 0){
		$("#modalConsultarVehMaqPlacaOpcGenCont").modal("hide");$("#modalConsultarOpcionalVehMaqOpcGenCont").remove();
    
        var dataParam={
            empresaId:parseInt(getSession("gestopcompanyid")),placa:placa
        };
	  		
        callAjaxPostSimpleVersionDos(1,URL+'/contratista/vehiculo_maquinaria/busqueda_opcional',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    listResultadoBusquedaVehMaqOpcionalOpcGenCont = data.listContratistaVehMaqOpcional;
	
                    if(listResultadoBusquedaVehMaqOpcionalOpcGenCont.length > 0){
                        var contenido = "";
                        
                        var selContratistaConsultaVehMaqOpcGenCont = crearSelectOneMenuOblig("selContratistaConsultaVehMaqOpcGenCont","completarPlacaVehMaqConsultaOpcionalOpcGenCont()",
                            listResultadoBusquedaVehMaqOpcionalOpcGenCont,"","contratistaId","contratistaNombre");
  				
                        var listContenido=[
  	                    	{label:"Placa:",inputForm:"",idDivContainer:"divPlacaVehMaqConsultaOpcGenCont"},
  	                    	{label:"Contratista:",inputForm:selContratistaConsultaVehMaqOpcGenCont},
  	                    	{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	                    	{label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarConsultaVehiculoMaquinariaOpcionalOpcGenCont()'>" +
               	                       "<i class='fa fa-arrow-left'></i> Volver" +
               	               	   "</button>",
  	                     	 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='prepararParamConsultaVehiculoMaquinariaOpcionalOpcGenCont()'>" +
  	                                       "<i class='fa fa-search'></i> Buscar" +
  	                               	   "</button>"}
  	                	]; 
  				
                        listContenido.forEach(function(val){
                            contenido += obtenerSubPanelModuloVersionTres(val);
                        });
   
                        var modalOptions={
                            id:"modalConsultarOpcionalVehMaqOpcGenCont",nombre:"<i class='fa fa-search'></i> Valores consulta - Vehiculo/Maquinaria",
                            contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
                        };
  				
                        crearModalPrincipalUsuario(modalOptions,function(){},true,true);
                        
                        completarPlacaVehMaqConsultaOpcionalOpcGenCont(data.hasSancionEnCurso);
                        
                        if(data.hasSancionEnCurso == 0 && listResultadoBusquedaVehMaqOpcionalOpcGenCont.length == 1){
                            prepararParamConsultaVehiculoMaquinariaOpcionalOpcGenCont();
                        }
                    }else{
                		$("#modalConsultarVehMaqPlacaOpcGenCont").modal("hide");
                	
                		mensajeUx="<label>No se encontró alguna coincidencia con la placa ingresada.</label>";
                		mensajesUx(mensajeUx,2,"","ValidacionConsVehMaqOpcGenCont");
                		
                		$("#modalMensajeUxValidacionConsVehMaqOpcGenCont").on("hidden.bs.modal",function(){
                	    	$("#modalConsultarVehMaqPlacaOpcGenCont").modal("show");
                		});
                    }
                    
                    break;
 	     
                default:
            	    alert("Error. Volver a cargar.");
             
      	    	    break;
            }
        });
    }else{
		$("#modalConsultarVehMaqPlacaOpcGenCont").modal("hide");
	
		mensajeUx="<label>Debe completar el campo placa.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionConsVehMaqOpcGenCont");
		
		$("#modalMensajeUxValidacionConsVehMaqOpcGenCont").on("hidden.bs.modal",function(){
	    	$("#modalConsultarVehMaqPlacaOpcGenCont").modal("show");
		});
    }
}

function completarPlacaVehMaqConsultaOpcionalOpcGenCont(pHasSancion){
    var vehMaquinariaPlaca;
    var contratistaIdAux = parseInt($("#selContratistaConsultaVehMaqOpcGenCont").val());
    
    listResultadoBusquedaVehMaqOpcionalOpcGenCont.forEach(function(val){
		if(val.contratistaId == contratistaIdAux){
	    	vehMaquinariaPlaca = val.placa;
		}
    });
    
    $("#divPlacaVehMaqConsultaOpcGenCont").html(vehMaquinariaPlaca);
	
	var hasSancion = parseInt(pHasSancion);
				
	if(hasSancion == 1){
		$("#modalConsultarOpcionalVehMaqOpcGenCont").modal("hide");
					
		mensajeUx = "<label>"+vehMaquinariaPlaca+" está actualmente sancionado." +
			"<br><br>¿Desea continuar con la consulta?</label>";
		mensajesUx(mensajeUx,3,"","ConfRevInfoVehMaqOpcGenCont");
					
		$("#btnRegresarPrevioConfRevInfoVehMaqOpcGenCont").on("click",function(){
			$("#modalConsultarVehMaqPlacaOpcGenCont").modal("show");
		});
													
		$("#btnDevolverValorConfRevInfoVehMaqOpcGenCont").on("click",function(){
			if(listResultadoBusquedaVehMaqOpcionalOpcGenCont.length == 1){
				prepararParamConsultaVehiculoMaquinariaOpcionalOpcGenCont();
			}else{
				$("#modalConsultarOpcionalVehMaqOpcGenCont").modal("show");
			}
		});
	}
}

function prepararParamConsultaVehiculoMaquinariaOpcionalOpcGenCont(){
    var parametrosEncontrados = false;
    var contratistaIdAux = parseInt($("#selContratistaConsultaVehMaqOpcGenCont").val());
    
    listResultadoBusquedaVehMaqOpcionalOpcGenCont.forEach(function(val){
		if(val.contratistaId == contratistaIdAux){
	    	vehMaqOpcGenContId = val.id;vehMaqOpcContOpcGenContId = val.contratistaId;parametrosEncontrados = true;
		}
    });
    
    if(parametrosEncontrados){
		buscarDatosVehiculoMaquinariaOpcGenCont();
    }
}

function ocultarDatosVehiculoMaquinariaOpcGenCont(){
    $("#modalEstadoActualVehiculoMaquinariaOpcGenCont").modal("hide");$("#modalConsultarVehMaqPlacaOpcGenCont").modal("show");
}

var booleanHabilitadoRegAccVehMaq;

function buscarDatosVehiculoMaquinariaOpcGenCont(){
    $("#modalConsultarOpcionalVehMaqOpcGenCont").modal("hide");$("#modalEstadoActualVehiculoMaquinariaOpcGenCont").remove();

    var idContratista = vehMaqOpcContOpcGenContId;
    var idVehiculoMaquinaria = vehMaqOpcGenContId;
     
    if(idContratista != -1 && idVehiculoMaquinaria != -1){
        var dataParam={
 	        id:idVehiculoMaquinaria,contratistaId:idContratista
        };
      
        callAjaxPostSimpleVersionDos(1,URL+"/contratista/consulta/contratista/vehiculo_maquinaria",dataParam,1,0,function(data){
            vehiculoMaquinariaOpcGenContObj = data.vehiculoMaquinaria;estadoActualVehMaqOpcGenCont = data.estadoActualVehMaq;
         
			booleanHabilitadoRegAccVehMaq = (estadoActualVehMaqOpcGenCont.habilitado == "Sí"?true:false);
					
			var estadoActualVehMaqTotal =
				"<div class='"+(booleanHabilitadoRegAccVehMaq?"estado-futurista-ok":"estado-no-habilitado-full")+"'>" +
				    "<i class='"+(booleanHabilitadoRegAccVehMaq?"fa fa-thumbs-up":"fa fa-ban")+"'></i>"+
				    "<div>"+"<div class='estado-titulo'>"+(booleanHabilitadoRegAccVehMaq?"Habilitado":"No habilitado")+"</div>"+"</div>" +
				"</div>";
         
          	var proyectoAsignadoTexto = (vehiculoMaquinariaOpcGenContObj.proyectoAsignadoTexto.length == 0?"------":vehiculoMaquinariaOpcGenContObj.proyectoAsignadoTexto),
                detalle = (vehiculoMaquinariaOpcGenContObj.detalle.length == 0?"------":vehiculoMaquinariaOpcGenContObj.detalle);
	            
            var contenido = "";
         
           	var listContenido=[
                {label:"<i class='fa fa-list-alt'></i> Contratista:",inputForm:vehiculoMaquinariaOpcGenContObj.contratistaNombre},
                {label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                {label:"<i class='fa fa-barcode'></i> Placa:",inputForm:vehiculoMaquinariaOpcGenContObj.placa},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-list'></i> Tipo:",inputForm:vehiculoMaquinariaOpcGenContObj.tipoLicenciaConductor.nombre},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-tag'></i> Marca:",inputForm:vehiculoMaquinariaOpcGenContObj.marca},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-calendar'></i> Año de fabricación:",inputForm:vehiculoMaquinariaOpcGenContObj.anioFabricacion},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-pencil'></i> Detalle:",inputForm:detalle},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                {label:"<i class='fa fa-book'></i> Proyecto asignado:",inputForm:proyectoAsignadoTexto}
            ];

			var tieneDetalleEstadoActualVehMaqTotal = vehiculoMaquinariaOpcGenContObj.numHabilitarExamNivelVehMaqTotal > 0;
					
			listContenido.push({label:"",inputForm:"",styleTotal:styleLineaSuaveMinimalista},
			    {clase:"estado-actual-compacto",anchoLabel:"col-sm-12",anchoDiv:"col-sm-12",label:"",
			     inputForm:estadoActualVehMaqTotal+(tieneDetalleEstadoActualVehMaqTotal?"<a class='estado-detalle-alternar' id='idDetalleEstadoActualVehMaqTotalOpcGenCont'></a>":""),styleTotal:"margin-bottom:10px;"});
					
			if(vehiculoMaquinariaOpcGenContObj.numHabilitarExamNivelVehMaqTotal > 0){
				listContenido.push({clase:"divDescripcionDocumentoVehMaqOpcGenCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				    {clase:"divDescripcionDocumentoVehMaqOpcGenCont",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
					 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL VEHÍCULO/MAQUINARIA ***</span>",inputForm:""});
						
				var listContenidoDnvmAux = [];
										                   
				listContenidoDnvmAux = obtenerVehiculoMaquinariaListaDocumentosNivelVehMaq(vehiculoMaquinariaOpcGenContObj,estadoActualVehMaqOpcGenCont,"divDescripcionDocumentoVehMaqOpcGenCont");
										          
				for(var i = 0;i < listContenidoDnvmAux.length;i++){
				    listContenido.push(listContenidoDnvmAux[i]);
				}
			}
			
			var registroSegunUsuario = (parseInt(getSession("accesoUsuarios")) == 14?"nuevoRegistroAccesoVehiculoMaquinariaVd()":"nuevoRegistroAccesoVehiculoMaquinaria()");

            listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
                {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarDatosVehiculoMaquinariaOpcGenCont()'>" +
                           "<i class='fa fa-arrow-left'></i> Volver" +
                       "</button>",
			     inputForm:"<button id='btnRegAccesoVehMaqOpcGenCont' class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='"+registroSegunUsuario+"'>" +
					   	       "<i class='fa fa-book'></i> Registrar acceso" +
					   	   "</button>"});
         
          	listContenido.forEach(function(val){
               	contenido += obtenerSubPanelModuloVersionTres(val);
           	});
       	  				
           	var modalOptions={
                id:"modalEstadoActualVehiculoMaquinariaOpcGenCont",nombre:"<i class='fa fa-search'></i> Resultado de la búsqueda - vehículo/maquinaria",
                contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
          	};
         
       	  	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
          
            ocultarDetalleDocumentosVehiculoMaquinariaOpcGenCont();$.unblockUI();
        });
    }else{
		$("#modalEstadoActualVehiculoMaquinariaOpcGenCont").modal("hide");
		
        mensajeUx = (idContratista == -1?"<label>Debe ingresar el RUC y/o nombre de la contratista en el buscador y " +
            "seleccionarla.</label>":"<label>Debe ingresar la placa del vehículo/maquinaria en el buscador y seleccionarla.</label>");
        mensajesUx(mensajeUx,2,"","ValidacionConsultaVehMaqOpcGenCont");
      
        $("#modalMensajeUxValidacionConsultaVehMaqOpcGenCont").on("hidden.bs.modal",function(){
		    if(listResultadoBusquedaVehMaqOpcionalOpcGenCont.length == 1){
		    	$("#modalConsultarVehMaqPlacaOpcGenCont").modal("show");
			}else{
		    	$("#modalConsultarOpcionalVehMaqOpcGenCont").modal("show");
			}
		});
    }
}

function verDetalleDocumentosVehiculoMaquinariaOpcGenCont(){
    $(".divDescripcionDocumentoVehMaqOpcGenCont").show();
    
    $("#idDetalleEstadoActualVehMaqTotalOpcGenCont").html("Ocultar detalle <i class='fa fa-chevron-up'></i>");
    $("#idDetalleEstadoActualVehMaqTotalOpcGenCont").attr("onclick","ocultarDetalleDocumentosVehiculoMaquinariaOpcGenCont()");
}

function ocultarDetalleDocumentosVehiculoMaquinariaOpcGenCont(){
    $(".divDescripcionDocumentoVehMaqOpcGenCont").hide();
    
    $("#idDetalleEstadoActualVehMaqTotalOpcGenCont").html("Ver detalle <i class='fa fa-chevron-down'></i>");
    $("#idDetalleEstadoActualVehMaqTotalOpcGenCont").attr("onclick","verDetalleDocumentosVehiculoMaquinariaOpcGenCont()");
}
