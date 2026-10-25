
var listCamposPersonalizadosProyecto = [];

function ocultarConsCampPerProy(){
    $("#modalConsolidadoCampPerProy").modal("hide");$("#modalConfigGenEmpCont").modal("show");
}

function verConsolidadoCampoPersonalizadoProyecto(){
    $("#modalConfigGenEmpCont").modal("hide");$("#modalConsolidadoCampPerProy").remove();

    var contenido = "";

    var buttonVolverPrincipal =
        "<button type='button' class='btn btn-info' onclick='ocultarConsCampPerProy()' " +
                "title='Regresar a la vista anterior.' style='margin-right:5px'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-table fa-2x'></i>" +
        "</button>";
    
    var buttonGuardar =
	"<button type='button' class='btn btn-success' style='margin-right:5px' " +
	        "onclick='guardarConsolidadoCampoPersonalizadoProyecto()' title='Guardar.'>" +
	    "<i class='fa fa-floppy-o fa-2x'></i>" +
	"</button>";

    var buttonCheckTodo =
        "<button class='btn btn-success' onclick='marcarTodoListaRegistro(\"tblConsCampPerProy\")' " +
                "title='Marcar todas las filas con un check.' style='margin-right:5px'>" +
            "<i class='fa fa-check fa-2x'></i>" +
        "</button>";

    var buttonCheckNada =
        "<button class='btn btn-success' onclick='desmarcarTodoListaRegistro(\"tblConsCampPerProy\")' " +
                "title='Desmarcar todas las filas con un check.' style='margin-right:5px'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>";

    var modalOptions={
        maxWidth:"50%",id:"modalConsolidadoCampPerProy",btnCerrarHabilitado:0,
        nombre:"<i class='fa fa-table'></i> Campos personalizados - proyecto",
        contenido:
            "<div id='divConsCampPerProy' class='form-inline' style='margin-top:10px;'>"+
                buttonVolverPrincipal+buttonGuardar+buttonCheckTodo+buttonCheckNada +
            "</div>"+
            "<div class='wrapper' id='wrapperConsCampPerProy'>" +
                "<table id='tblConsCampPerProy' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<th class='tb-acc' style='width:50px'>¿Habilitado?</th>" +
                            "<th class='tb-acc' style='width:50px'>¿Obligatorio?</th>" +
                            "<th class='tb-acc' style='width:200px'>Campo</th>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperConsCampPerProy",220);
    
    cargarConsolidadoCampoPersonalizadoProyecto();
}

function cargarConsolidadoCampoPersonalizadoProyecto(){
    var dataParam={
	empresaId:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPost(URL+'/contratista/proyecto/campo_personalizado_total',dataParam,function(data){
        if(data.CODE_RESPONSE == "05"){
            listCamposPersonalizadosProyecto = data.listCamposPersonalizadosProyecto;
		 
            $("#tblConsCampPerProy tbody tr").remove();
		 
            listCamposPersonalizadosProyecto.forEach(function(val,index){
        	$("#tblConsCampPerProy tbody").append(
		    "<tr id='trConsCampPerProy"+val.id+"'>" +
		        "<td>"+"<input id='checkHabilitadoCampPerProy"+val.id+"' type='checkbox' class='form-control' "+(val.snHabilitado == 1?"checked":"")+">"+"</td>" +
		        "<td>"+"<input id='checkObligatorioCampPerProy"+val.id+"' type='checkbox' class='form-control' "+(val.snObligatorio == 1?"checked":"")+">"+"</td>" +
		         "<td>"+val.nombre+"</td>" +
		    "</tr>");
            });
            
            goheadfixedY("#tblConsCampPerProy","#wrapperConsCampPerProy");
	}else{
	    console.log("Error al cargar los campos personalizados del proyecto");
	}
    });
}

function guardarConsolidadoCampoPersonalizadoProyecto(){
    var campoVacio = true;
    
    var listCampPerProyHabilitados = [];
    var textoCampPerProyHabilitados = "",textoCampPerProyObligatorios = "";

    listCamposPersonalizadosProyecto.forEach(function(val){
        var snHabilitado = ($("#checkHabilitadoCampPerProy"+val.id).prop("checked")?1:0);
        var snObligatorio = ($("#checkObligatorioCampPerProy"+val.id).prop("checked")?1:0);

        if(snHabilitado == 1){
            textoCampPerProyHabilitados += (textoCampPerProyHabilitados.length == 0?val.id:","+val.id);
        }
        
        if(snObligatorio == 1){
            textoCampPerProyObligatorios += (textoCampPerProyObligatorios.length == 0?val.id:","+val.id);
        }
        
        listCampPerProyHabilitados.push({id:val.id,snHabilitado:snHabilitado,snObligatorio:snObligatorio});
    });
    
    if(campoVacio){
        var dataParam={
	    empresaId:parseInt(getSession("gestopcompanyid")),listCampPerProyHabilitados:listCampPerProyHabilitados,textoCampPerProyHabilitados:textoCampPerProyHabilitados,
	    textoCampPerProyObligatorios:textoCampPerProyObligatorios
        };
	        
        callAjaxPostSimpleVersionDos(1,URL+'/contratista/proyecto/campo_personalizado_total/save',dataParam,1,1,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":  
	            $("#modalConsolidadoCampPerProy").modal("hide");	
		
	            mensajeUx = "<label>La configuración de los campos personalizados del proyecto fue guardada con éxito.</label>";
	            mensajesUx(mensajeUx,1,"","ActualizarConsCampPerProy"); 
								   
	            $("#modalMensajeUxActualizarConsCampPerProy").on("hidden.bs.modal",function(){
					verConfiguracionGeneralEmpresaContratista();
	            });
		
	            break;
						
	        default:
	            alert("Ocurrió un error al guardar la configuración de los campos personalizados del proyecto.");
	    }
        });	
    }else{
       
    }	
}

