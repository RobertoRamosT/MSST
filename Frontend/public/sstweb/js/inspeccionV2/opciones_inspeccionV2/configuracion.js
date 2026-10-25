
function ocultarConfiguracionEmpresaInspeccionV2(){
    $("#modalConfigEmpInspeccV2").modal("hide");
}

function verConfiguracionEmpresaInspeccionV2(){
    $("#modalConfigEmpInspeccV2").remove();
    
    var cbRespAutoTotalInspecc = "<input id='cbRespAutoTotalInspecc' type='checkbox' class='form-control' "+(empresaInspeccV2Obj.snRespAutoTotalInspecc == 1?"checked":"")+">";
    
    var contenido = "";
  				
    var listContenido=[
        {anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<label style='color:blue;font-size:16px;'>*** GENERAL - INSPECCIÓN ***</label>",inputForm:""},
        {label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
        {anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Responder todas las pregunta sin respuesta con un solo botón",inputForm:cbRespAutoTotalInspecc}
    ];

    listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
        {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarConfiguracionEmpresaInspeccionV2()'>" +
                   "<i class='fa fa-arrow-left'></i> Regresar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='guardarConfiguracionEmpresaInspeccionV2()'>" +
                       "<i class='fa fa-floppy-o'></i> Guardar" +
                   "</button>"});

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
    });

    var modalOptions={
        id:"modalConfigEmpInspeccV2",nombre:"<i class='fa fa-cog'></i> Configuración",btnCerrarHabilitado:0,
        contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    };
  				
    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function guardarConfiguracionEmpresaInspeccionV2(){
    var campoVacio = true;
   
    var snRespAutoTotalInspecc = ($("#cbRespAutoTotalInspecc").prop("checked")?1:0);

    if(campoVacio){
        var dataParam={
            empresaId:empresaInspeccV2Obj.idCompany,snRespAutoTotalInspecc:snRespAutoTotalInspecc
        };
	
        callAjaxPostSimpleVersionDos(1,URL+'/empresa/configuracion/inspeccion/save',dataParam,1,1,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":  
	            $("#modalConfigEmpInspeccV2").modal("hide");	
		
	            mensajeUx = "<label>La configuración fue guardada con éxito.</label>";
	            mensajesUx(mensajeUx,1,"","ActualizarConfigEmpInspeccV2");
	            
	            $("#modalMensajeUxActualizarConfigEmpInspeccV2").on("hidden.bs.modal",function(){
	        	reiniciarBuscadorPrincipalInspeccionV2();
	            });
				
	            break;

	        case "25":
	            $("#modalConfigEmpInspeccV2").modal("hide");

	            mensajeUx = "<label>"+data.mensaje+"</label>";
	            mensajesUx(mensajeUx,2,"","GuardarConfigEmpInspeccV2");

	            break;

	        default:
	            alert("Ocurrió un error al guardar la configuración.");
	    }
        });	
    }else{
       
    }
}
