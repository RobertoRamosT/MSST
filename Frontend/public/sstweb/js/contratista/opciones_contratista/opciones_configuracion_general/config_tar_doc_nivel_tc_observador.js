
var listConfigTarDocNivelTcObservador = [];
var configTarHojaVidaObservadorId;

function ocultarConfigTarDocNivelTcObservador(){
    $("#modalConfigTarDocNivelTcObservador").modal("hide");$("#modalConfigGenEmpCont").modal("show");
}

function verConfigTarDocNivelTcObservador(){
    $("#modalConfigGenEmpCont").modal("hide");$("#modalConfigTarDocNivelTcObservador").remove();

    var buttonVolverPrincipal =
        "<button type='button' class='btn btn-info' onclick='ocultarConfigTarDocNivelTcObservador()' " +
                "title='Regresar a la vista anterior.' style='margin-right:5px'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-table fa-2x'></i>" +
        "</button>";

    var buttonGuardar =
        "<button type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='guardarConfigTarDocNivelTcObservador()' title='Guardar.'>" +
            "<i class='fa fa-floppy-o fa-2x'></i>" +
        "</button>";

    var buttonCheckTodo =
        "<button class='btn btn-success' onclick='marcarTodoListaRegistro(\"tblConfigTarDocNivelTcObservador\")' " +
                "title='Marcar todas las filas con un check.' style='margin-right:5px'>" +
            "<i class='fa fa-check fa-2x'></i>" +
        "</button>";

    var buttonCheckNada =
        "<button class='btn btn-success' onclick='desmarcarTodoListaRegistro(\"tblConfigTarDocNivelTcObservador\")' " +
                "title='Desmarcar todas las filas con un check.' style='margin-right:5px'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>";

    var modalOptions={
        maxWidth:"50%",id:"modalConfigTarDocNivelTcObservador",btnCerrarHabilitado:0,
        nombre:"<i class='fa fa-table'></i> Documentos a nivel trabajador contratista modificados por cambio en trabajos alto riesgo",
        contenido:
            "<div id='divConfigTarDocNivelTcObservador' class='form-inline' style='margin-top:10px;'>" +
                 buttonVolverPrincipal+buttonGuardar+buttonCheckTodo+buttonCheckNada +
            "</div>" +
            "<div class='wrapper' id='wrapperConfigTarDocNivelTcObservador'>" +
                "<table id='tblConfigTarDocNivelTcObservador' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<th class='tb-acc' style='width:50px'>¿Habilitado?</th>" +
                            "<th class='tb-acc' style='width:250px'>Documento a nivel trabajador contratista</th>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperConfigTarDocNivelTcObservador",220);

    cargarConfigTarDocNivelTcObservador();
}

function cargarConfigTarDocNivelTcObservador(){
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPost(URL+'/contratista/tipo_examen_contratista/config_tar_doc_nivel_tc_observador',dataParam,function(data){
        if(data.CODE_RESPONSE == "05"){
            listConfigTarDocNivelTcObservador = data.listConfigTarDocNivelTcObservador;
			configTarHojaVidaObservadorId = data.configTarHojaVidaObservadorId;
			
			listConfigTarDocNivelTcObservador.push({id:0,nombre:"Hoja de vida",snHabilitado:(configTarHojaVidaObservadorId > 0?1:0)});

            $("#tblConfigTarDocNivelTcObservador tbody tr").remove();

            listConfigTarDocNivelTcObservador.forEach(function(val){
                $("#tblConfigTarDocNivelTcObservador tbody").append(
                    "<tr id='trConfigTarDocNivelTcObservador"+val.id+"'>" +
                        "<td>" +
                            "<input id='checkHabilitadoConfigTarDocNivelTcObservador"+val.id+"' type='checkbox' class='form-control' " +
							     (val.snHabilitado > 0?"checked":"")+">" +
                        "</td>" +
                        "<td>"+val.nombre+"</td>" +
                    "</tr>");
            });

            goheadfixedY("#tblConfigTarDocNivelTcObservador","#wrapperConfigTarDocNivelTcObservador");
        }else{
            console.log("Error al cargar la configuración TAR documentos nivel trabajador contratista observador");
        }
    });
}

function guardarConfigTarDocNivelTcObservador(){
    var campoVacio = true;

    var listTarDocNivelTcObservadorHabilitados = [];
    var textoTarDocNivelTcObservadorHabilitados = "";

	var listTarHvObservadorHabilitados = [];
    var textoTarHvObservadorHabilitados = "";
	
    listConfigTarDocNivelTcObservador.forEach(function(val){
        var snHabilitado = ($("#checkHabilitadoConfigTarDocNivelTcObservador"+val.id).prop("checked")?1:0);

        if(snHabilitado == 1){
			if(val.id == 0){
				textoTarHvObservadorHabilitados = val.id;
								
				listTarHvObservadorHabilitados.push({id:val.id});
		    }else{
                textoTarDocNivelTcObservadorHabilitados += (textoTarDocNivelTcObservadorHabilitados.length == 0?val.id:","+val.id);
				
			    listTarDocNivelTcObservadorHabilitados.push({id:val.id});
			}
        }
    });

    if(campoVacio){
        var dataParam={
            empresaId:parseInt(getSession("gestopcompanyid")),listTarDocNivelTcObservadorHabilitados:listTarDocNivelTcObservadorHabilitados,
            textoTarDocNivelTcObservadorHabilitados:textoTarDocNivelTcObservadorHabilitados,listTarHvObservadorHabilitados:listTarHvObservadorHabilitados,
			textoTarHvObservadorHabilitados:textoTarHvObservadorHabilitados
        };

        callAjaxPostSimpleVersionDos(1,URL+'/contratista/tipo_examen_contratista/config_tar_doc_nivel_tc_observador/save',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    $("#modalConfigTarDocNivelTcObservador").modal("hide");

                    mensajeUx = "<label>La configuración de trabajos de alto riesgo para documentos nivel trabajador contratista observador fue guardada con éxito.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarConfigTarDocNivelTcObservador");

                    $("#modalMensajeUxActualizarConfigTarDocNivelTcObservador").on("hidden.bs.modal",function(){
                        verConfiguracionGeneralEmpresaContratista();
                    });

                    break;

                default:
                    alert("Ocurrió un error al guardar la configuración de trabajos de alto riesgo para documentos nivel trabajador contratista observador.");
            }
        });
    }else{

    }
}
