
var configGenEmpContObj = {};

var listOpcConfigGenEmpCont=[
    {id:1,nombre:"Configuración general (S/N)"},{id:2,nombre:"Campos personalizado - Proyecto"},
    {id:3,nombre:"Documentos observados - Trabajos alto riesgo"}
];

function ocultarPrevioConfiguracionGeneralEmpresaContratista(){
    $("#modalPrevioConfigGenEmpCont").modal("hide");
}

function verPrevioConfiguracionGeneralEmpresaContratista(){
    $("#modalPrevioConsolidadosExcelEvalDocProy").remove();

    var selOpcConfigGenEmpCont = crearSelectOneMenuOblig("selOpcConfigGenEmpCont","",listOpcConfigGenEmpCont,"1","id","nombre");

    var contenido = "";

    var listContenido=[
        {anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Opción",inputForm:selOpcConfigGenEmpCont},
        {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
        {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarPrevioConfiguracionGeneralEmpresaContratista()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='verConfiguracionGeneralEmpresaContratista()'>" +
                       "<i class='fa fa-list-ul'></i> Seleccionar" +
                   "</button>"}
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
    });

    var modalOptions={
        id:"modalPrevioConfigGenEmpCont",nombre:"<i class='fa fa-list-ul'></i> Seleccionar opción",
        contenido:"<form class='eventoGeneral-moderno'>"+contenido+"</form>",contenidoClassAux:"modal-content-moderno"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function ocultarConfiguracionGeneralEmpresaContratista(){
    $("#modalConfigGenEmpCont").modal("hide");$("#modalPrevioConfigGenEmpCont").modal("show");
}

function verConfiguracionGeneralEmpresaContratista(){
    $("#modalPrevioConfigGenEmpCont").modal("hide");$("#modalConfigGenEmpCont").remove();
	
	var opcConfigGenEmpContId = parseInt($("#selOpcConfigGenEmpCont").val());
    
    var dataParam={
	    idCompany:parseInt(getSession("gestopcompanyid")),opcSeleccionada:opcConfigGenEmpContId
    }; 
	  		
    callAjaxPost(URL+'/contratista/empresa/configuracion_general',dataParam,function(data){
	    configGenEmpContObj = data.registroConfigGenEmp;
	
        var contenido = "";
		
		var listContenido=[];
		
		if(opcConfigGenEmpContId == 1){
			var cbEvalSrpAuto = "<input id='cbEvalSrpAuto' type='checkbox' class='form-control' "+(configGenEmpContObj.snEvalSrpAuto == 1?"checked":"")+">",
			    cbEditarPerfProyAuto = "<input id='cbEditarPerfProyAuto' type='checkbox' class='form-control' "+(configGenEmpContObj.snEditarPerfProyAuto == 1?"checked":"")+">";
			
			listContenido.push({anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Aprobación automática de las solicitudes registro de proyecto.",inputForm:cbEvalSrpAuto},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
			    {anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Editar el campo 'perfil proyecto' de un registro proyecto.",inputForm:cbEditarPerfProyAuto});
				
			if(configGenEmpContObj.fechaActualizacionCppTexto.length > 0){
				listContenido.push({label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
					{label:"*Actualizado el ",inputForm:configGenEmpContObj.fechaActConfigContTexto});
			}
		}else if(opcConfigGenEmpContId == 2){
			var verConsolidadoCampPerProy = "<a class='efectoLink' onclick='verConsolidadoCampoPersonalizadoProyecto()'>"+"<i class='fa fa-table'></i> Ver consolidado"+"</a>";
			
			var textoNombreCampPerProyHabilitadosAux = (configGenEmpContObj.textoNombreCampPerProyHabilitados.length == 0?"Ninguno":configGenEmpContObj.textoNombreCampPerProyHabilitados);
			
			listContenido.push({anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Campos personalizado - Proyecto",inputForm:verConsolidadoCampPerProy},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:textoNombreCampPerProyHabilitadosAux});
				
			if(configGenEmpContObj.fechaActualizacionCppTexto.length > 0){
			    listContenido.push({label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				    {label:"*Actualizado el ",inputForm:configGenEmpContObj.fechaActualizacionCppTexto});
			}
		}else if(opcConfigGenEmpContId == 3){
			var verConfigTarDocNivTcObs = "<a class='efectoLink' onclick='verConfigTarDocNivelTcObservador()'>"+"<i class='fa fa-table'></i> Ver consolidado"+"</a>";
			
			var textoNombreDocNivelesModObsEmpAux = configGenEmpContObj.textoNombreTarDocNivelTcObservadorHabilitados;
			textoNombreDocNivelesModObsEmpAux += (configGenEmpContObj.textoTarHvObservadorHabilitados.length == 0?"":(textoNombreDocNivelesModObsEmpAux.length == 0?"":", ")+"Hoja de vida");
			textoNombreDocNivelesModObsEmpAux = (textoNombreDocNivelesModObsEmpAux.length == 0?"Ninguno":textoNombreDocNivelesModObsEmpAux);
			
			listContenido.push({anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Documentos observados - Trabajos alto riesgo",inputForm:verConfigTarDocNivTcObs},
				{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
				{anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:textoNombreDocNivelesModObsEmpAux});
				
			if(configGenEmpContObj.fechaActConfigContTexto.length > 0){
			    listContenido.push({label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
				    {label:"*Actualizado el ",inputForm:configGenEmpContObj.fechaActConfigContTexto});
		    }
		}
  				
        listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	        {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarConfiguracionGeneralEmpresaContratista()'>" +
               	       "<i class='fa fa-arrow-left'></i> Regresar" +
               	   "</button>",
  	        inputForm:(opcConfigGenEmpContId == 1?"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='guardarConfiguracionGeneralEmpresaContratista()'>" +
  	                       "<i class='fa fa-floppy-o'></i> Guardar" +
  	                   "</button>":"")});
  				
        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionTres(val);
        });
   
  		
        var modalOptions={
            id:"modalConfigGenEmpCont",nombre:"<i class='fa fa-cog'></i> Configuración",btnCerrarHabilitado:0,
  	        contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
        };
  				
        crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    });
}

function guardarConfiguracionGeneralEmpresaContratista(){
    var campoVacio = true;
   
    var snEvalSrpAuto = ($("#cbEvalSrpAuto").prop("checked")?1:0);
	var snEditarPerfProyAuto = ($("#cbEditarPerfProyAuto").prop("checked")?1:0);
   
    if(campoVacio){
        var dataParam={
            idCompany:configGenEmpContObj.idCompany,snEvalSrpAuto:snEvalSrpAuto,snEditarPerfProyAuto:snEditarPerfProyAuto
        };
	        
        callAjaxPostSimpleVersionDos(1,URL+'/contratista/empresa/configuracion_general/save',dataParam,1,1,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":  
	            $("#modalConfigGenEmpCont").modal("hide");	
		
	            mensajeUx = "<label>La configuración fue guardada con éxito.</label>";
	            mensajesUx(mensajeUx,1,"","ActualizarConfigGeneralSn"); 
				
				$("#modalMensajeUxActualizarConfigGeneralSn").on("hidden.bs.modal",function(){
					verConfiguracionGeneralEmpresaContratista();
				});
				
	            break;
						
	        default:
	            alert("Ocurrió un error al guardar la configuración.");
	    }
        });	
    }else{
       
    }	
}
