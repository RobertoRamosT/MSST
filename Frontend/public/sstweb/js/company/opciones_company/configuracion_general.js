
function ocultarConfiguracionGeneralEmpresa(){
    $("#modalConfigGenEmpresa").modal("hide");
}

function verConfiguracionGeneralEmpresa(){
    $("#modalConfigGenEmpresa").remove();
    
    var cbNotificacion = "<input id='cbNotificacion' type='checkbox' class='form-control' "+(companyObj.wantsCorreo == 1?"checked":"")+">",
        cbProySimple = "<input id='cbProySimple' type='checkbox' class='form-control' "+(companyObj.isProyectoSimple == 1?"checked":"")+">",
        cbListaTriple = "<input id='cbListaTriple' type='checkbox' class='form-control' "+(companyObj.wantsEvalTriple == 1?"checked":"")+">",
        cbCorreoForRenCov = "<input id='cbCorreoForRenCov' type='checkbox' class='form-control' "+(companyObj.wantsCorreoForRenCov == 1?"checked":"")+">",
        cbCorreoDiaForRenCov = "<input id='cbCorreoDiaForRenCov' type='checkbox' class='form-control' "+(companyObj.wantsCorreoDiaForRenCov == 1?"checked":"")+">",
        cbCorreoEventosResp = "<input id='cbCorreoEventosResp' type='checkbox' class='form-control' "+(companyObj.wantsCorreoEventosResp == 1?"checked":"")+">",
        cbCorreoDocEvalResp = "<input id='cbCorreoDocEvalResp' type='checkbox' class='form-control' "+(companyObj.wantsCorreoDocEvalResp == 1?"checked":"")+">",
        cbCorreoCargoInduccVirtualResp  = "<input id='cbCorreoCargoInduccVirtualResp' type='checkbox' class='form-control' "+(companyObj.wantsCorreoCargoInduccVirtualResp == 1?"checked":"")+">",
        cbVerDataConsultaAutorizado = "<input id='cbVerDataConsultaAutorizado' type='checkbox' class='form-control' "+(companyObj.snVerDataConsultaAutorizado == 1?"checked":"")+">",
        cbCorreoProyEnCursoFin = "<input id='cbCorreoProyEnCursoFin' type='checkbox' class='form-control' "+(companyObj.wantsCorreoProyEnCursoFin == 1?"checked":"")+">",
        cbCorreoDocProxVencerContr = "<input id='cbCorreoDocProxVencerContr' type='checkbox' class='form-control' "+(companyObj.wantsCorreoDocProxVencerContr == 1?"checked":"")+">",
		cbCorreoRecRevOrdenCompra = "<input id='cbCorreoRecRevOrdenCompra' type='checkbox' class='form-control' "+(companyObj.wantsCorreoOrdenCompra == 1?"checked":"")+">",
        cbCorreoHabilitacionMedica = "<input id='cbCorreoHabilitacionMedica' type='checkbox' class='form-control' "+(companyObj.wantsCorreoHabilitacionMedica == 1?"checked":"")+">";

    var contenido = "";
  				
    var listContenido=[
  	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Notificaciones",inputForm:cbNotificacion},
  	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Proyectos simples",inputForm:cbProySimple},
  	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Lista triple",inputForm:cbListaTriple},
  	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"¿Logeo obligatorio para vista consulta?",inputForm:cbVerDataConsultaAutorizado},
  	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  	{sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",label:"¿Habilitada la función de envío de correos?",inputForm:(companyObj.hasPermissionForEmail == 1?"Sí":"No")},
  	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  	{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",label:"<label style='color:blue;font-size:16px;'>*** ENVÍO DE CORREO - TRABAJADORES ***</label>"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Formulario renovable COVID-19 (Todos los días - 07:00 am)",inputForm:cbCorreoForRenCov},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Completar formulario COVID-19 (Lunes 07:00 am)",inputForm:cbCorreoDiaForRenCov},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Responsable eventos (todos los días - 09:00 am)",inputForm:cbCorreoEventosResp},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  	{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",label:"<label style='color:blue;font-size:16px;'>*** ENVÍO DE CORREO - USUARIO DOCUMENTOS ***</label>"},
  	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Responsable evaluación documentos (lunes a viernes - 10:00 am)",inputForm:cbCorreoDocEvalResp},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Cargo - Inducciones virtuales (lunes a viernes - 08:00 am)",inputForm:cbCorreoCargoInduccVirtualResp},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Indicador 'orden de compra' (documento a nivel proyecto) (lunes a sábado - 01:40 am)",inputForm:cbCorreoRecRevOrdenCompra},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  	{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",label:"<label style='color:blue;font-size:16px;'>*** ENVÍO DE CORREO - CONTRATISTAS ***</label>"},
  	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Proyectos en curso por finalizar [<= 14 días] <br>(lunes a sábado - 1:20 am)",inputForm:cbCorreoProyEnCursoFin},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Documentos próximos a vencerse [<= 14 días] <br>(lunes 4:00 am)",inputForm:cbCorreoDocProxVencerContr},
    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
    {sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",label:"Indicador 'habilitación médica por clínica' (documento a nivel trabajador contratista) (lunes 04:30 am)",inputForm:cbCorreoHabilitacionMedica}
    ];
        
    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConfiguracionGeneralEmpresa()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
  	 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='guardarConfiguracionGeneralEmpresa()'>" +
  	               "<i class='fa fa-floppy-o'></i> Guardar" +
  	           "</button>"});
  				
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });
   
    var modalOptions={
        id:"modalConfigGenEmpresa",nombre:"<i class='fa fa-cog'></i> Configuración",
  	contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };
  				
    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function guardarConfiguracionGeneralEmpresa(){
    var campoVacio = true;
   
    var snNotificacion = ($("#cbNotificacion").prop("checked")?1:0);
    var snProySimple = ($("#cbProySimple").prop("checked")?1:0);
    var snListaTriple = ($("#cbListaTriple").prop("checked")?1:0);
    var snCorreoForRenCov = ($("#cbCorreoForRenCov").prop("checked")?1:0);
    var snCorreoDiaForRenCov = ($("#cbCorreoDiaForRenCov").prop("checked")?1:0);
    var snCorreoEventosResp = ($("#cbCorreoEventosResp").prop("checked")?1:0);
    var snCorreoDocEvalResp = ($("#cbCorreoDocEvalResp").prop("checked")?1:0);
    var snCorreoCargoInduccVirtualResp = ($("#cbCorreoCargoInduccVirtualResp").prop("checked")?1:0);
    var snVerDataConsultaAutorizado = ($("#cbVerDataConsultaAutorizado").prop("checked")?1:0);
    var snCorreoProyEnCursoFin = ($("#cbCorreoProyEnCursoFin").prop("checked")?1:0);
    var snCorreoDocProxVencerContr = ($("#cbCorreoDocProxVencerContr").prop("checked")?1:0);
	var snCorreoRecRevOrdenCompra = ($("#cbCorreoRecRevOrdenCompra").prop("checked")?1:0);
    var snCorreoHabilitacionMedica = ($("#cbCorreoHabilitacionMedica").prop("checked")?1:0);

    if(campoVacio){
        var dataParam={
            empresaId:companyObj.idCompany,wantsCorreo:snNotificacion,isProyectoSimple:snProySimple,wantsEvalTriple:snListaTriple,
            wantsCorreoForRenCov:snCorreoForRenCov,wantsCorreoDiaForRenCov:snCorreoDiaForRenCov,wantsCorreoEventosResp:snCorreoEventosResp,
            wantsCorreoDocEvalResp:snCorreoDocEvalResp,wantsCorreoCargoInduccVirtualResp:snCorreoCargoInduccVirtualResp,
            snVerDataConsultaAutorizado:snVerDataConsultaAutorizado,wantsCorreoProyEnCursoFin:snCorreoProyEnCursoFin,
            wantsCorreoDocProxVencerContr:snCorreoDocProxVencerContr,wantsCorreoOrdenCompra:snCorreoRecRevOrdenCompra,
            wantsCorreoHabilitacionMedica:snCorreoHabilitacionMedica
        };
	
        callAjaxPostSimpleVersionDos(1,URL+'/empresa/configuracion_general/save',dataParam,1,1,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":  
	            $("#modalConfigGenEmpresa").modal("hide");	
		
	            mensajeUx = "<label>La configuración fue guardada con éxito.</label>";
	            mensajesUx(mensajeUx,1,"","ActualizarConfigGenEmp");
	            
	            $("#modalMensajeUxActualizarConfigGenEmp").on("hidden.bs.modal",function(){
	        	listarEmpresa();
	            });
				
	            break;
						
	        default:
	            alert("Ocurrió un error al guardar la configuración.");
	    }
        });	
    }else{
       
    }
}
