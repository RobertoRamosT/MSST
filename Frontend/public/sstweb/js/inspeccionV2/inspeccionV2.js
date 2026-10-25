
var inspeccionesV2AdmId,indexInspeccionesV2Adm,inspeccionesV2AdmObj = {},empresaInspeccV2Obj = {};
var listFullInspeccionesV2 = [],textoBuscarPrincipalInspeccV2 = "",listTipoAuditoriaIdPrincipalInspeccV2 = [];
var listTipoInspeccionV2 = [],listTipoFiltroInspeccionV2 = [],listTipoActivoInspeccionV2 = [];
var listUnidadesInspeccionV2 = [],listDivisionesInspeccionV2 = [],listAreasInspeccionV2 = [];
var numPaginaActualPrincipalInspeccV2 = 1,totalPaginasPrincipalInspeccV2 = 0;
var banderaEdicionInspeccV2Adm = false;
var mensajeUx;

$(function(){
    $("#tabInspeccionV2").show();

    insertMenuPrimeraVez(function(){
        crearFiltroPrincipalInspeccionV2(valoresFiltroPrincipalInspeccionV2);
    });

    $("#flechaIzquierdaPrincipalInspeccV2").on('click',function(){
        $("#valBuscarValorPrincipalInspeccV2").val(textoBuscarPrincipalInspeccV2);
        habilitarPrincipalInspeccionV2(numPaginaActualPrincipalInspeccV2-1);
    });

    $('#flechaDerechaPrincipalInspeccV2').on('click',function(){
        $("#valBuscarValorPrincipalInspeccV2").val(textoBuscarPrincipalInspeccV2);
        habilitarPrincipalInspeccionV2(numPaginaActualPrincipalInspeccV2+1);
    });
});

function ocultarFiltroPrincipalInspeccionV2(){
    $("#modalFiltroInspeccionV2").modal("hide");
}

function verFiltroPrincipalInspeccionV2(){
    $("#modalFiltroInspeccionV2").modal("show");
}

function crearFiltroPrincipalInspeccionV2(functionCallBack){
    $("#modalFiltroInspeccionV2").remove();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/vista_admin/filtro',dataParam,1,0,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                listTipoInspeccionV2 = data.listTipoInspeccionV2;listUnidadesInspeccionV2 = data.listUnidadesInspeccionV2;listDivisionesInspeccionV2 = data.listDivisionesInspeccionV2;
                listAreasInspeccionV2 = data.listAreasInspeccionV2;

                listTipoFiltroInspeccionV2 = listTipoInspeccionV2.map(function(val){
                    return {id:val.id,nombre:$("<div>").text(val.nombre).html()+(val.snActivo === 0?" (inactiva)":"")};
                });

                listTipoActivoInspeccionV2 = listTipoInspeccionV2.filter(function(val){
                    return val.snActivo !== 0;
                });

                var contenido = "";

                var listContenido=[
                    {anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='font-size:17px;font-weight:bold;'>Fecha planificada</span>",inputForm:""},
                    {label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                    {label:"Desde",inputForm:"<input type='date' id='fechaInicioFiltroInspeccV2' class='form-control'>"},
                    {label:"Hasta",inputForm:"<input type='date' id='fechaFinFiltroInspeccV2' class='form-control'>"},
                    {label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante}
                ];

                if(listTipoFiltroInspeccionV2.length > 0){
                    listContenido.push({anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Lista de inspección",
                        inputForm:"<a class='efectoLink' onclick='verCheckListTiposInspeccionV2Filtro()'>Seleccionar <i class='fa fa-table'></i></a>"},
                        {anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"Todos",idDivContainer:"divSelTiposInspeccionV2Filtro"});
                }else{
                    listContenido.push({label:"Lista de inspección",inputForm:"<label>*Sin valores</label>"});
                }

                listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
                    {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarFiltroPrincipalInspeccionV2()'>" +
                               "<i class='fa fa-arrow-left'></i> Regresar" +
                           "</button>",
                     inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='valoresFiltroPrincipalInspeccionV2()'>" +
                                   "<i class='fa fa-filter'></i> Aplicar" +
                               "</button>"});

                listContenido.forEach(function (val){
                    contenido += obtenerSubPanelModuloVersionTres(val);
                });

                var modalOptions={
                    id:"modalFiltroInspeccionV2",nombre:"<i class='fa fa-filter'></i> Filtros",btnCerrarHabilitado:0,
                    contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
                };

                crearModalPrincipalUsuario(modalOptions,function(){},true,true);

                if(listTipoFiltroInspeccionV2.length > 0){
                    crearCheckListGeneral("modalFiltroInspeccionV2","Listas de inspección","TipoInspeccV2FiltroSelec",
                        listTipoFiltroInspeccionV2,"TiposInspeccionV2Filtro",cargarCheckListTiposInspeccionV2Filtro);
                }

                var hoy = getSession("fechaHoyOrdenInversoTexto");

                $("#fechaInicioFiltroInspeccV2").val(sumaFechaDias(-180,hoy));$("#fechaFinFiltroInspeccV2").val(hoy);

                functionCallBack();completarBarraCarga();

                break;

            case "25":
                mensajeUx = "<label>"+data.mensaje+"</label>";
                mensajesUx(mensajeUx,2,"","FiltroInspeccV2Adm");

                completarBarraCarga();

                break;

            default:
                completarBarraCarga();

                alert("No se pudo cargar la información de los filtros de las inspecciones.");
        }
    });
}

function valoresFiltroPrincipalInspeccionV2(){
    ocultarFiltroPrincipalInspeccionV2();

    if($("#fechaInicioFiltroInspeccV2").val().length > 0 && $("#fechaFinFiltroInspeccV2").val().length > 0){
        listTipoAuditoriaIdPrincipalInspeccV2 = [];

        listTipoFiltroInspeccionV2.forEach(function(val){
            if($("#checkAsignadoTipoInspeccV2FiltroSelec"+val.id).prop("checked")){
                listTipoAuditoriaIdPrincipalInspeccV2.push(val.id);
            }
        });

        habilitarPrincipalInspeccionV2(1);
    }else{
        mensajeUx = "<label>Debe ingresar la 'Fecha planificada - Desde' y 'Fecha planificada - Hasta' en el filtro.</label>";
        mensajesUx(mensajeUx,2,"","ValidacionFiltroInspeccV2Adm");

        $("#modalMensajeUxValidacionFiltroInspeccV2Adm").on("hidden.bs.modal",function(){
            $("#modalFiltroInspeccionV2").modal("show");
        });
    }
}

function habilitarPrincipalInspeccionV2(pagina){
    resizeDivWrapper("wrapInspeccionV2",170);banderaEdicionInspeccV2Adm = false;

    $("#btnFiltroInspeccV2").show();$("#btnResetBuscadorInspeccV2").show();$("#btnAplicarBuscadorInspeccV2").show();
    $("#valBuscarValorPrincipalInspeccV2").show();$("#indicadorPaginaParcialAuxPrincipalInspeccV2").show();$("#btnCancelarInspeccV2").hide();
    $("#btnNuevoInspeccV2").show();$("#btnGuardarInspeccV2").hide();$("#btnEliminarInspeccV2").hide();$("#btnConfiguracionInspeccV2").show();
	$("#btnTipoInspeccV2").show();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),fechaPlanificadaInicio:$("#fechaInicioFiltroInspeccV2").val(),
        fechaPlanificadaFin:$("#fechaFinFiltroInspeccV2").val(),pagina:pagina,textoBuscar:textoBuscarPrincipalInspeccV2,
        listTipoAuditoriaId:listTipoAuditoriaIdPrincipalInspeccV2
    };

    callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/vista_admin',dataParam,1,0,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                listFullInspeccionesV2 = data.listInspeccionesV2;empresaInspeccV2Obj = data.empresaInspeccV2;
                numPaginaActualPrincipalInspeccV2 = data.pagina;totalPaginasPrincipalInspeccV2 = data.totalPaginas;

                cambiarPaginaPrincipalInspeccionV2();

                goheadfixedY("#tblInspeccionV2","#wrapInspeccionV2");
                formatoCeldaSombreable(true);

                break;

            case "25":
                mensajeUx = "<label>"+data.mensaje+"</label>";
                mensajesUx(mensajeUx,2,"","ConsultaInspeccV2Adm");

                break;

            default:
                alert("Ocurrió un error al traer las inspecciones!");
        }
    });
}

function cambiarPaginaPrincipalInspeccionV2(){
    $("#flechaIzquierdaPrincipalInspeccV2").show();$("#flechaDerechaPrincipalInspeccV2").show();

    var numPaginaTotal = (totalPaginasPrincipalInspeccV2 == 0?1:totalPaginasPrincipalInspeccV2);

    $("#labelFlechasPrincipalInspeccV2").html("<label>"+numPaginaActualPrincipalInspeccV2+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualPrincipalInspeccV2 == 1){
        $("#flechaIzquierdaPrincipalInspeccV2").hide();
    }

    if(numPaginaActualPrincipalInspeccV2 == numPaginaTotal){
        $("#flechaDerechaPrincipalInspeccV2").hide();
    }

    $("#tblInspeccionV2 tbody tr").remove();

    if(listFullInspeccionesV2.length == 0){
        $("#tblInspeccionV2 tbody").append("<tr>"+"<td colspan='16' style='text-align:center;'>Sin registros</td>"+"</tr>");
    }

    listFullInspeccionesV2.forEach(function(val,index){
        var fechaRealizadaTexto = (val.estado.id == 2?val.fechaRealizadaTexto:"------"),lugar = (val.lugar.length == 0?"------":$("<div>").text(val.lugar).html()),
            detalle = (val.observacion.length == 0?"------":$("<div>").text(val.observacion).html()),respuestaInspecc = (val.respInspeccPlanificada == 1?"Sí":"No"),
            datosRegistro = (val.fechaRegistroTexto.length == 0?"------":val.fechaRegistroTexto +
                (val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+$("<div>").text(val.usuarioRegistro.nombre).html()+")")),
            datosActualizacion = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto +
                (val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+$("<div>").text(val.usuarioActualizacion.nombre).html()+")")),
            estadoActual = (val.estado.id == 1?"Pendiente":(val.estado.id == 2?"Completado":"Retrasado"));

        $("#tblInspeccionV2 tbody").append(
            "<tr id='trInspeccionVDos"+val.auditoriaId+"' onclick='editarPrincipalInspeccionV2("+index+")'>" +
                "<td id='tdCodigo"+val.auditoriaId+"'>"+val.codigo+"</td>" +
                "<td id='tdTipoInspecc"+val.auditoriaId+"'>"+$("<div>").text(val.tipo.nombre).html()+"</td>" +
                "<td id='tdFechaEvento"+val.auditoriaId+"'>"+val.fechaPlanificadaTexto+"</td>" +
                "<td id='tdHoraEvento"+val.auditoriaId+"'>"+val.horaPlanificadaTexto+"</td>" +
                "<td id='tdFechaRealizada"+val.auditoriaId+"'>"+fechaRealizadaTexto+"</td>" +
                "<td id='tdInspeccPlanif"+val.auditoriaId+"'>"+respuestaInspecc+"</td>" +
                "<td id='tdUnidad"+val.auditoriaId+"'>"+$("<div>").text(val.nombreUnidades).html()+"</td>" +
                "<td id='tdDivision"+val.auditoriaId+"'>"+$("<div>").text(val.nombreDivisiones).html()+"</td>" +
                "<td id='tdArea"+val.auditoriaId+"'>"+$("<div>").text(val.nombreAreas).html()+"</td>" +
                "<td id='tdLugar"+val.auditoriaId+"'>"+lugar+"</td>" +
                "<td id='tdDetalle"+val.auditoriaId+"'>"+detalle+"</td>" +
                "<td id='tdAvance"+val.auditoriaId+"'>"+val.numRespuestas+" / "+val.numPreguntas+"</td>" +
                "<td id='tdMedCorrectivas"+val.auditoriaId+"'>"+val.numMedidasCorrectivasCompletadas+" / "+val.numMedidasCorrectivas+"</td>" +
                "<td id='tdEstadoActual"+val.auditoriaId+"'>"+estadoActual+"</td>" +
                "<td id='tdfechaRegTexto"+val.auditoriaId+"'>"+datosRegistro+"</td>" +
                "<td id='tdfechaActTexto"+val.auditoriaId+"'>"+datosActualizacion+"</td>" +
            "</tr>");
    });

    $.unblockUI();
}

function aplicarBuscadorPrincipalInspeccionV2(){
    textoBuscarPrincipalInspeccV2 = $("#valBuscarValorPrincipalInspeccV2").val();

    habilitarPrincipalInspeccionV2(1);
}

function reiniciarBuscadorPrincipalInspeccionV2(){
    textoBuscarPrincipalInspeccV2 = "";$("#valBuscarValorPrincipalInspeccV2").val("").focus();

    habilitarPrincipalInspeccionV2(1);
}

function cancelarPrincipalInspeccionV2(){
    reiniciarBuscadorPrincipalInspeccionV2();
}

function nuevoPrincipalInspeccionV2(){
    if(!banderaEdicionInspeccV2Adm){
        formatoCeldaSombreableTabla(false,"tblInspeccionV2");
        inspeccionesV2AdmId = 0;

        var selTipoInspeccionV2Adm = crearSelectOneMenu("selTipoInspeccionV2Adm","",listTipoActivoInspeccionV2,"-1","id","nombre");
        var selRespPlanifInspeccV2Adm = crearSelectOneMenuOblig("selRespPlanifInspeccV2Adm","",listBoolean,"1","id","nombre");
        
        $("#tblInspeccionV2 tbody").prepend(
            "<tr>" +
                "<td><label>*Automático.</label></td>" +
                "<td>"+selTipoInspeccionV2Adm+"</td>" +
                "<td>"+"<input id='inputFechaPlanInspeccV2Adm' type='date' class='form-control'>"+"</td>" +
                "<td>"+"<input id='inputHoraPlanInspeccV2Adm' type='time' value='12:00:00' class='form-control'>"+"</td>" +
                "<td><label>...</label></td>" +
                "<td>"+selRespPlanifInspeccV2Adm+"</td>" +
                "<td>"+(parseInt(getSession("gestopcompanyid")) == 500?"<div id='divSelUnidadInspeccV2Adm'></div>":"<label>...</label>")+"</td>" +
                "<td>"+(parseInt(getSession("gestopcompanyid")) == 500?"<div id='divSelDivisionInspeccV2Adm'></div>":"<label>...</label>")+"</td>" +
                "<td>"+(parseInt(getSession("gestopcompanyid")) == 500?"<div id='divSelAreaInspeccV2Adm'></div>":"<div id='divSelAreaAuxInspeccV2Adm'></div>")+"</td>" +
                "<td><textarea id='textLugarInspeccV2Adm' class='form-control' rows='4'></textarea>"+textCampoOpcional+"</td>" +
                "<td><textarea id='textDetalleInspeccV2Adm' class='form-control' rows='4'></textarea>"+textCampoOpcional+"</td>" +
                "<td><label>...</label></td>" +
                "<td><label>...</label></td>" +
                "<td><label>*Automático.</label></td>" +
                "<td><label>*Automático.</label></td>" +
                "<td><label>...</label></td>" +
            "</tr>");
        
        if(parseInt(getSession("gestopcompanyid")) == 500){
            var selUnidadInspeccV2 = crearSelectOneMenu("selUnidadInspeccV2","filtrarDivisionesSegunUnidadInspeccionV2Adm()",
                listUnidadesInspeccionV2,(parseInt(getSession("gestopcompanyid")) == 500?"927":"-1"),"id","nombre",(listUnidadesInspeccionV2.length == 0?"Sin unidades registradas":null));

            $("#divSelUnidadInspeccV2Adm").html(selUnidadInspeccV2);

            filtrarDivisionesSegunUnidadInspeccionV2Adm();
        }else{
	    var listAreasAuxInspeccionV2 = listAreasInspeccionV2;
	
	    listAreasAuxInspeccionV2.forEach(function(val){
	        val.selected = 0;
	    });
		
	    crearSelectOneMenuObligMultipleCompleto("selAreaAuxInspeccV2Adm","",listAreasAuxInspeccionV2,
		"areaId","nombreAuxiliar","#divSelAreaAuxInspeccV2Adm","sin asignar");
	
	    $("#divSelAreaAuxInspeccV2Adm").append("<br><label>Unidad > División > Área*</label>");
        }
        
        $("#inputFechaPlanInspeccV2Adm").val(convertirFechaInputNoUTC(new Date()));$("#inputHoraPlanInspeccV2Adm").val(obtenerHoraActual(1));
        
        $("#btnFiltroInspeccV2").hide();$("#btnResetBuscadorInspeccV2").hide();$("#btnAplicarBuscadorInspeccV2").hide();
        $("#valBuscarValorPrincipalInspeccV2").hide();$("#indicadorPaginaParcialAuxPrincipalInspeccV2").hide();$("#btnCancelarInspeccV2").show();
        $("#btnNuevoInspeccV2").hide();$("#btnGuardarInspeccV2").show();$("#btnEliminarInspeccV2").hide();
        $("#btnConfiguracionInspeccV2").hide();$("#btnTipoInspeccV2").hide();

        banderaEdicionInspeccV2Adm = true;
    }else{
        alert("Guarde primero.");
    }
}

function editarPrincipalInspeccionV2(pindex){
    if(!banderaEdicionInspeccV2Adm){
        formatoCeldaSombreableTabla(false,"tblInspeccionV2");

        inspeccionesV2AdmObj = listFullInspeccionesV2[pindex];
        inspeccionesV2AdmId = inspeccionesV2AdmObj.auditoriaId;
        
        $("#trInspeccionVDos"+inspeccionesV2AdmId).addClass("fila-edicion");
        
        $("#tdFechaEvento"+inspeccionesV2AdmId).html("<input id='inputFechaPlanInspeccV2Adm' type='date' class='form-control'>");
        $("#inputFechaPlanInspeccV2Adm").val(convertirFechaInput(inspeccionesV2AdmObj.fechaPlanificada));

        $("#tdHoraEvento"+inspeccionesV2AdmId).html("<input id='inputHoraPlanInspeccV2Adm' type='time' value='12:00:00' class='form-control'>");
        $("#inputHoraPlanInspeccV2Adm").val(inspeccionesV2AdmObj.horaPlanificada);

        var selRespPlanifInspeccV2Adm = crearSelectOneMenuOblig("selRespPlanifInspeccV2Adm","",listBoolean,"1","id","nombre");
        $("#tdInspeccPlanif"+inspeccionesV2AdmId).html(selRespPlanifInspeccV2Adm);
        
        $("#tdUnidad"+inspeccionesV2AdmId).html("<label>...</label>");
        $("#tdDivision"+inspeccionesV2AdmId).html("<label>...</label>");
        $("#tdArea"+inspeccionesV2AdmId).html("<div id='divSelAreaAuxInspeccV2Adm'></div>");
        
        var listAreasAux = inspeccionesV2AdmObj.listAreasId.split(",");
	var listAreasAuxInspeccionV2 = listAreasInspeccionV2;
	
	listAreasAuxInspeccionV2.forEach(function(val){
	    val.selected = 0;
		    
	    listAreasAux.forEach(function(val1){
	        if(parseInt(val1) == val.areaId){
		    val.selected = 1;
	        }
	    });	
	});
		
	crearSelectOneMenuObligMultipleCompleto("selAreaAuxInspeccV2Adm","",listAreasAuxInspeccionV2,
	    "areaId","nombreAuxiliar","#divSelAreaAuxInspeccV2Adm","sin asignar");
	
	$("#divSelAreaAuxInspeccV2").append("<br><label>Unidad > División > Área*</label>");
        
        $("#tdLugar"+inspeccionesV2AdmId).html("<textarea id='textLugarInspeccV2Adm' class='form-control' rows='4'></textarea>"+textCampoOpcional);
        $("#textLugarInspeccV2Adm").val(inspeccionesV2AdmObj.lugar);

        $("#tdDetalle"+inspeccionesV2AdmId).html("<textarea id='textDetalleInspeccV2Adm' class='form-control' rows='4'></textarea>"+textCampoOpcional);
        $("#textDetalleInspeccV2Adm").val(inspeccionesV2AdmObj.observacion);

        $("#tdEstadoActual"+inspeccionesV2AdmId).html("<label>*Automático.</label>");
        $("#tdfechaActTexto"+inspeccionesV2AdmId).html("<label>*Automático.</label>");

        banderaEdicionInspeccV2Adm = true;
        
        $("#inputFechaPlanInspeccV2Adm").prop("disabled",true);$("#inputHoraPlanInspeccV2Adm").prop("disabled",true);
        $("#selRespPlanifInspeccV2Adm").prop("disabled",true);

        $("#btnFiltroInspeccV2").hide();$("#btnResetBuscadorInspeccV2").hide();$("#btnAplicarBuscadorInspeccV2").hide();
        $("#valBuscarValorPrincipalInspeccV2").hide();$("#indicadorPaginaParcialAuxPrincipalInspeccV2").hide();$("#btnCancelarInspeccV2").show();
        $("#btnNuevoInspeccV2").hide();$("#btnGuardarInspeccV2").show();$("#btnEliminarInspeccV2").show();
        $("#btnConfiguracionInspeccV2").hide();$("#btnTipoInspeccV2").hide();
    }
}

var selDivisionInspeccV2Adm,selAreaInspeccV2Adm,textoAdicional,textoSelectVacioAux1,textoSelectVacioAux2;

function filtrarDivisionesSegunUnidadInspeccionV2Adm(){
    var listDivisionInspeccV2Aux = [];selDivisionInspeccV2Adm = "";

    textoSelectVacioAux1 = ([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sedes":"divisiones");
    textoSelectVacioAux2 = (parseInt(getSession("gestopcompanyid")) == 714?"el país - empresa seleccionado":"la unidad seleccionada");

    var unidadIdAux = parseInt($("#selUnidadInspeccV2").val());

    if(listDivisionesInspeccionV2.length != 0 && unidadIdAux != -1){
        listDivisionesInspeccionV2.forEach(function(val){
            if(val.matrixId == unidadIdAux){
                listDivisionInspeccV2Aux.push(val);
            }
        });

        selDivisionInspeccV2Adm = crearSelectOneMenu("selDivisionInspeccV2Adm","filtrarAreasSegunDivisionInspeccionV2Adm()",listDivisionInspeccV2Aux,
            (parseInt(getSession("gestopcompanyid")) == 500?"2430":""),"divisionId","divisionName",(listDivisionInspeccV2Aux.length == 0?"Sin "+textoSelectVacioAux1+" asociadas":null));

        textoAdicional = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2+".</small>";
    }else{
        textoAdicional = "<small style='font-weight:bold;'>"+(unidadIdAux == -1?"*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2:
            "<small style='font-weight:bold;'>*No hay "+textoSelectVacioAux1+" para seleccionar")+".</small>";
    }

    $("#divSelDivisionInspeccV2Adm").html(selDivisionInspeccV2Adm+textoAdicional);

    filtrarAreasSegunDivisionInspeccionV2Adm();
}

function filtrarAreasSegunDivisionInspeccionV2Adm(){
    var listAreaEventoInspeccionAux = [];selAreaInspeccV2Adm = "";

    textoSelectVacioAux1 = (parseInt(getSession("gestopcompanyid")) == 714?"áreas - procesos":"áreas");
    textoSelectVacioAux2 = "la "+([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sede":"división")+" seleccionada";

    var divisionIdAux = (selDivisionInspeccV2Adm.length == 0?-1:parseInt($("#selDivisionInspeccV2Adm").val()));

    if(listAreasInspeccionV2.length != 0 && divisionIdAux != -1){
	listAreasInspeccionV2.forEach(function(val){
            if(val.divisionId == divisionIdAux){
                listAreaEventoInspeccionAux.push(val);
            }
        });

        if(listAreaEventoInspeccionAux.length > 0){
            selAreaInspeccV2Adm = crearSelectOneMenuObligMultipleCompleto("selAreaInspeccV2Adm","",
                listAreaEventoInspeccionAux,"areaId","areaNameShort","#divSelAreaInspeccV2Adm","Todos");
        }else{
            $("#divSelAreaInspeccV2Adm").html("<label>Sin "+textoSelectVacioAux1+" con responsables</label><br>");
        }

        textoAdicional = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2+".</small>";

        $("#divSelAreaInspeccV2Adm").append(textoAdicional);
    }else{
        textoAdicional = "<small style='font-weight:bold;'>"+(divisionIdAux == -1?"*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2:
            "<small style='font-weight:bold;'>*No hay "+textoSelectVacioAux1+" con responsables para seleccionar")+".</small>";

        $("#divSelAreaInspeccV2Adm").html(selAreaInspeccV2Adm+textoAdicional);
    }
}

function guardarPrincipalInspeccionV2(){
    var campoVacio = true;
    
    var tipoInspeccionId = parseInt($("#selTipoInspeccionV2Adm").val());
    var fechaPlanificada = convertirFechaTexto($("#inputFechaPlanInspeccV2Adm").val());
    var inputFechaPlanificada = (!fechaPlanificada?null:fechaPlanificada);
    var horaPlanificada = $("#inputHoraPlanInspeccV2Adm").val();
    var snPlanificado = parseInt($("#selRespPlanifInspeccV2Adm").val());
    var lugar = $("#textLugarInspeccV2Adm").val();
    var detalle = $("#textDetalleInspeccV2Adm").val();
    
    var listAreasSeleccionadas = [];

    var listAreasAux = (inspeccionesV2AdmId == 0 && parseInt(getSession("gestopcompanyid")) == 500?$("#selAreaInspeccV2Adm").val():$("#selAreaAuxInspeccV2Adm").val());

    if(listAreasAux != null){
        listAreasAux.forEach(function(val,index){
            listAreasSeleccionadas.push({areaId:parseInt(val)});
        });
    }

    if(tipoInspeccionId == -1 || inputFechaPlanificada == null || horaPlanificada.length == 0){
	campoVacio = false;mensajeUx = "<label>Debe completar los campos obligatorios.</label>";
    }else if(listAreasSeleccionadas.length == 0){
	campoVacio = false;mensajeUx = "<label>Debe seleccionar al menos un área.</label>";
    }
    
    if(campoVacio){
	var dataParam={
	    auditoriaId:inspeccionesV2AdmId,auditoriaTipo:tipoInspeccionId,fechaPlanificada:inputFechaPlanificada,horaPlanificada:horaPlanificada,
	    respInspeccPlanificada:snPlanificado,lugar:lugar,observacion:detalle,empresaId:parseInt(getSession("gestopcompanyid")),
	    listAreas:listAreasSeleccionadas
        };
	
	callAjaxPostSimpleVersionDos(1,URL+"/inspeccionv2/save",dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
		case "05":
	            $("#modalRegistroInspeccionV2").modal("hide");

//	            if(inspeccionesV2Id > 0){
	        	mensajeUx = "<label>El registro de la inspección fue guardado con éxito.</label>";
		  	mensajesUx(mensajeUx,1,"","ActualizarInspeccV2Adm");

		  	$("#modalMensajeUxActualizarInspeccV2Adm").on("hidden.bs.modal",function(){
		  	    reiniciarBuscadorPrincipalInspeccionV2();
			});
//	            }else{
//	                mensajeUx="<label>El registro de la inspección fue guardado con éxito.<label>" +
//	                    "<br><label>¿Desea empezarla de inmediato?</label>";
//	                mensajesUx(mensajeUx,9,"","RespEmpezarInspeccV2Adm");
//
//	                $("#btnDevolverValorRespEmpezarInspeccV2Adm").on("click",function(){
//	                    snInicioRapidoInspeccV2 = 1;inicioRapidoInspeccV2Id = data.nuevoId;habilitarInspeccionV2();
//	                });
//
//	                $("#btnRegresarPrevioRespEmpezarInspeccV2").on("click",function(){
//	                    habilitarInspeccionV2();
//	                });
//	            }

		    break;

		case "25":
		    $("#modalRegistroInspeccionV2").modal("hide");

		    mensajeUx = "<label>"+data.mensaje+"</label>";
		    mensajesUx(mensajeUx,2,"","GuardarInspeccV2Adm");

		    break;

		default:
		    alert("Ocurrió un error al guardar la inspección.");
	    }
        });
    }else{
        mensajesUx(mensajeUx,2,"","");
    }
}

function cargarCheckListTiposInspeccionV2Filtro(){
    $("#modalCheckListTipoInspeccV2FiltroSelec").modal("hide");
}

function ocultarCheckListTiposInspeccionV2Filtro(){
    var textoSeleccion = "";

    listTipoFiltroInspeccionV2.forEach(function(val){
        if($("#checkAsignadoTipoInspeccV2FiltroSelec"+val.id).prop("checked")){
            textoSeleccion += (textoSeleccion.length == 0?val.nombre:", "+val.nombre);
        }
    });

    $("#divSelTiposInspeccionV2Filtro").html(textoSeleccion.length == 0?"Todos":textoSeleccion);

    $("#modalCheckListTipoInspeccV2FiltroSelec").modal("hide");$("#modalFiltroInspeccionV2").modal("show");
}

function verCheckListTiposInspeccionV2Filtro(){
    $("#modalCheckListTipoInspeccV2FiltroSelec").modal("show");$("#modalFiltroInspeccionV2").modal("hide");
}
