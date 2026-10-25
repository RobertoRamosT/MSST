var listFullEventos = [];
var agendaPrevia = true;
var arrayFechasEvento = [];
var arrayEventoProceso = [];
var arrayEventoCompleto = [];
var arrayEventoRetrasado = [];
var arrayEventoTotal = [];
var totalesEventoProceso = 0;
var totalesEventoCompleto = 0;
var totalesEventoRetrasado = 0;

var evalRealizadas = 0;
var evalRiesgosas = 0;
var controlesPorImplementar = 0;
var controlesCompletados = 0;
var controlesRetrasados = 0;

var numAccidentes = 0;
var eventosInseguros = 0;
var numIncidentes = 0;
var numEnfermedades = 0;
var numAccidentesLeves = 0;
var numAccidentesFatales = 0;
var numAccidentesInc = 0;
var numAccidentesInc1 = 0;
var numAccidentesInc2 = 0;
var numAccidentesInc3 = 0;
var numAccidentesInc4 = 0;
var numEnfermedades1 = 0;
var numEnfermedades2 = 0;
var numDiasSinAccidente = 0;
var numDiasDescanso = 0;
var numTrabajadoresActivos = 0;
var numTrabajadoresAptos = 0;
var numTrabajadoresRestricciones = 0;
var numTrabajadoresObservados = 0;
var numTrabajadoresNoAptos = 0;
var numTrabajadoresNoEvaluados = 0;
var form4plus = 0;
var form3 = 0;
var form2 = 0;
var form1 = 0;
var form0 = 0;

var horasForm4plus = 0;
var horasForm3 = 0;
var horasForm2 = 0;
var horasForm1 = 0;
var horasForm0 = 0;
var graficoRealizadoId;

var globalFormacion;
var globalEpp;
var globalDisp;
var globalPart;
var globalExam;
var globalIper;

var globalFormacionMeta;
var globalEppMeta;
var globalDispMeta;
var globalPartMeta;
var globalExamMeta;
var globalIperMeta;
var htmlVideo;

var tablaRealizada = false;
var trabsResponsableNombre = [];


function verAux(pId) {
    var ventana = $("#windowOptions");
    var calendario = $("#scheduler_gosst");
    var field = $("fieldset");
    $(".list-group li").removeClass("selectedGosst");
    $("#opcion" + pId).addClass("selectedGosst");
    ventana.html("");
    $(".cuadroGeneral").hide();
    $(".iconoIndicador").hide();
    switch (parseInt(pId)) {
        case 1:

            calendario.css({"height": "calc(100% - 105px)", "width": " calc(100%)", "left": ""}).show();
            field.css({"width": "calc(100% )", "margin-left": ""});
            verOpcionesGosst();
            break;
        case 2:
            $("#indRadial1").click();
            verOpcionesGosst();
            break;
        case 3:
            $("#indRadial2").click();
            verOpcionesGosst();
            break;
        case 4:
            $("#indRadial3").click();
            verOpcionesGosst();
            break;
        case 5:
            cargarActualizaciones();
            break;
        case 6:
            cargarSugerencias();
            break;
        case 7:

            calendario.css({"height": "calc(100% - 105px)", "width": " calc(100%)", "left": ""}).show();
            field.css({"width": "calc(100% )", "margin-left": ""});
        case 8:
            cargarComunicadoTrabajador();
            break;
        case 9:
            //volverAuditoriasAtajo();
            cargarAuditoriasAtajo();
            break;
        default:
            break;
    }
    $(".cuadroGeneral").css({
        "height": "calc(100% - 55px)", "width": " calc(100%)",
        "left": " ", "top": "", "bottom": "0px", "position": "absolute", "background": "white", "z-index": "112"
    });


}

function verResponsablesAcuerdoFecha() {
    trabsResponsableNombre = [];
    var fechaInicio = $("#fechaInicioEvento").val();
    var fechaFin = $("#fechaFinEvento").val();
    listFullEventos.filter(function (val) {
        var fechaAux = val.start_date;
        var inicio = restaFechas(fechaInicio, convertirFechaNormal2(fechaAux)) >= 0
        var fin = restaFechas(convertirFechaNormal2(fechaAux), fechaFin) >= 0;
        return (inicio && fin)
    }).forEach(function (val) {

        var yaSeAgrego = false;
        trabsResponsableNombre.every(function (val1) {
            if (val1.nombre == val.responsable) {
                yaSeAgrego = true;
                return false;
            } else {
                return true;
            }
        });
        if (!yaSeAgrego) {
            var selected = 0;
            if ($("#respEvento").val() == val.responsable) {
                selected = 1;
            }
            trabsResponsableNombre.push({
                id: val.responsable,
                nombre: val.responsable,
                numImplementar: 0,
                numCompletado: 0,
                numRetrasado: 0,
                selected: selected
            });
        }


    });
    listFullEventos.filter(function (val) {
        var fechaAux = val.start_date;
        var inicio = restaFechas(fechaInicio, convertirFechaNormal2(fechaAux)) >= 0
        var fin = restaFechas(convertirFechaNormal2(fechaAux), fechaFin) >= 0;
        return (inicio && fin)
    }).forEach(function (val) {
        trabsResponsableNombre.every(function (val1) {
            if (val.responsable == val1.id) {
                switch (val.estadoEvento) {
                    case 1:
                        val1.numImplementar++;
                        break;
                    case 2:
                        val1.numCompletado++;
                        break;
                    case 3:
                        val1.numRetrasado++;
                        break;
                }
                return false;
            } else {
                return true;
            }
        });
    });
    trabsResponsableNombre.forEach(function (val) {
        val.nombreCompleto = val.nombre + " (" + val.numRetrasado + " - " + val.numImplementar + " - " + val.numCompletado + ")"
    });
    trabsResponsableNombre.sort(function (a, b) {
        return b.numImplementar - a.numImplementar

    }).sort(function (a, b) {
        return b.numRetrasado - a.numRetrasado

    });
    var selected = 0;
    if ($("#respEvento").val() == "0") {
        selected = 1;
    }
    trabsResponsableNombre = trabsResponsableNombre.concat([{
        id: 0,
        nombreCompleto: "Todos",
        nombre: "Todos",
        selected: selected
    }]);
    console.log(trabsResponsableNombre);
    crearSelectOneMenuObligUnitarioCompleto("respEvento", "actualizarTablasEventos()", trabsResponsableNombre, "id",
        "nombreCompleto", "#divRespEvento", "")
}

var listFiltroModulo = [];
var listFiltroEstado = [];

function verInformeGosst() {
    $("#modalInformeGosst").modal("show");
    $("#btnGenerarReporte").attr("onclick", "generarInformeGosst()");
    $("#fechaInicioReporte").val("2017-01-01")
    $("#fechaFinReporte").val("2017-12-31")
}

function generarInformeGosst() {
    var fechaInicio = $("#fechaInicioReporte").val();
    var fechaFin = $("#fechaFinReporte").val();
    window.open(URL
        + "/empresa/informe?fechaInicio="
        + fechaInicio + "&fechaFin=" + fechaFin, '_blank');
}

$(function () {
    $("#options").show();
    var ventana = $("#windowOptions");
    ventana.remove();

    $(document).on('change', ':file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
        $(".modal-body img").hide();
    });
    $(document).on('fileselect', "input:file", function (event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) {

            }
        }

    });

    insertMenuPrimeraVez(function () {
        switch (parseInt(getSession("accesoUsuarios"))) {
            case 1:

                break;

            default :
                $("#scheduler_gosst").remove();
                $("#botonesIndicadores").remove();
                $("fieldset").remove();
                $("table").remove();
                $("h3").remove();
                $("h4").remove();
                $(".cuadroGeneral").remove();
                $("#options").remove();
                break;
        }

        switch (parseInt(getSession("accesoUsuarios"))) {
            case 14:

                break;

            case 6:
                verLateralesFijosTrabajadorContratista();
                break;
            case 13:
                verLateralesFijosVisitante();
                break;
            case 0:
                verLateralesFijos();
                $("#wrapperList").remove();
                break;
            case 1:
//	    cargarScheduler();
                crearFiltroCalendario(valoresFiltroCalendario);

                $("#fechaFinEvento").val(obtenerFechaActual());
                $("#fechaInicioEvento").val(sumaFechaDias(-32, obtenerFechaActual()));
                verAux(1);
                $(".navbar-right").prepend(
                    "<span id='icoPresentacion' title='Presentación Cómite'><a onclick='verPresentacionGosst()' " +
                    "class='iconoLink' >" +
                    "<i class='fa fa-desktop fa-2x'  aria-hidden='true'>" +
                    "<span style='font-size:18px'></span></i></a>" +
                    "</span>");
                $(".navbar-right").prepend(
                    "<span id='icoInforme' title='Informe Gestión'><a onclick='verInformeGosst()' " +
                    "class='iconoLink' >" +
                    "<i class='fa fa-file fa-2x'  aria-hidden='true'>" +
                    "<span style='font-size:18px'></span></i></a>" +
                    "</span>");
                $(".navbar-right").prepend(
                    "<span id='icoActualizaciones' title='Actualizaciones'><a onclick='verAux(5)' " +
                    "class='iconoLink' >" +
                    "<i class='fa fa-wrench fa-2x'  aria-hidden='true'>" +
                    "<span style='font-size:18px'></span></i></a>" +
                    "</span>");
                $(".navbar-right").prepend(
                    (getSession("accesoGerencia") == 1 ?
                            "<span id='icoAudsConsolidado' title='Lista de informes(Auditorias,Inspecciones, etc....)'>" +
                            "<a id='refAudsConsolidado'onclick='verAux(9)'class='iconoLink' >" +
                            "<i class='fa fa-exclamation-circle fa-2x'  aria-hidden='true'>" +
                            "<span style='font-size:18px'></span></i>" +
                            "</a>" +
                            "</span>" : ""

                    ) +
                    "<span id='icoComunicados' title='Comunicados Internos al Colaborador'><a onclick='verAux(8)' " +
                    "class='iconoLink' >" +
                    "<i class='fa fa-envelope fa-2x'  aria-hidden='true'>" +
                    "<span style='font-size:18px'></span></i></a>" +
                    "</span>");
                $(".navbar-right").prepend(
                    "<span id='icoInicio' title='Inicio'><a onclick='verAux(7)' " +
                    "class='iconoLink' >" +
                    "<span style='font-size:19px'>Inicio</span> </a>" +
                    "</span>");
                if (getSession("accesoGerencia") == 1) {
                    callAjaxPost(URL + '/auditoria/todo', {
                            idCompany: getSession("gestopcompanyid")
                        },
                        function (data) {
                            if (data.CODE_RESPONSE = "05") {
                                $("#alertaAuditoriaEval").remove();
                                var sinAprobEval = 0;
                                data.list.forEach(function (val, index) {
                                    sinAprobEval = val.numSinAproEval;
                                });
                                if (sinAprobEval > 0) {
                                    $("#refAudsConsolidado").prepend("<div class='numAlertas' id='alertaAuditoriaEval'>" + (sinAprobEval) + "</div>");
                                }
                                completarBarraCarga();
                                formatoCeldaSombreableTabla(true, "tblAuditoriasConsolidado");
                            } else {
                                console.log("ERROR, no entro al IF :''v");
                            }
                        });
                }
                ;
                callAjaxPost(URL + '/scheduler/sugerencias', {},
                    function (data) {
                        if (data.CODE_RESPONSE == "05") {
                            var solicitudesCompletadas = 0;
                            data.list.forEach(function (val, index) {
                                if (val.isNuevo == 1) {
                                    solicitudesCompletadas++;
                                }

                            });
                            if (solicitudesCompletadas > 0) {
                                $("#alertaSolicitud").remove();
                                $("#icoSolicitud a").append("<div class='numAlertas' id='alertaSolicitud'>" + solicitudesCompletadas + "</div>")
                            }
                        } else {
                            console.log("NOPNPO")
                        }
                    });
                callAjaxPost(URL + '/scheduler/actualizaciones',
                    {}, function (data) {
                        if (data.CODE_RESPONSE == "05") {
                            var contarNuevos = 0;
                            data.list.forEach(function (val, index) {

                                if (val.isNuevo == 1) {
                                    contarNuevos++;
                                }
                            });
                            if (contarNuevos > 0) {
                                $("#alertaActualizaciones").remove();
                                $("#icoActualizaciones a").append("<div  class='numAlertas' id='alertaActualizaciones'>" + contarNuevos + "</div>")

                            }
                            if (data.sabeActualizaciones == 1) {
                                $("#alertaActualizaciones").remove();
                            } else {
                                if (false) {
                                    $("#modalTutorial").modal("show");
                                    var myVideo = document.getElementById("videoActualizacion");
                                    $("#modalTutorial").on("hidden.modal.bs", function () {
                                        htmlVideo = $(this).find(".modal-body").html();
                                        $(this).find(".modal-body").html("");
                                        verAux(5);
                                    });
                                }

                            }
                        } else {
                            console.log("NOPNPO")
                        }
                    });


                $("#legendEstado .col-md-2").on("click", function () {
                    listFiltroEstado = [];
                    $(this).toggleClass("leyendaActivada");
                    $(this).toggleClass("leyendaDesactivada");

                    $("#legendEstado .col-md-2").each(function (index) {
                        var id = $(this).prop("id").substring(18, 19);

                        if ($(this).hasClass("leyendaActivada")) {
                            $(".stateCalendar" + id).show();

                            console.log("mostrar .stateCalendar" + id);
                        }
                        if ($(this).hasClass("leyendaDesactivada")) {
                            listFiltroEstado.push(id);
                            $(".stateCalendar" + id).hide();
                            console.log("hide .stateCalendar" + id);
                        }
                    });
                    listFiltroModulo.forEach(function (val, index) {

                        $(".moduloIdCalendar" + val).hide();

                    });


                });
                $(document).on("click", ".filtroCalendarModulo", function () {
                    $(this).toggleClass("filtroCalendarModuloDesactivado");
                    listFiltroModulo = [];
                    $("#fieldFiltro div").each(function (index) {
                        var id = $(this).prop("id").substring(10, 12);


                        if ($(this).hasClass("filtroCalendarModuloDesactivado")) {
                            listFiltroModulo.push(id);
                            $(".moduloIdCalendar" + id).hide();
                            console.log("hide .moduloIdCalendar" + id);
                        } else {
                            $(".moduloIdCalendar" + id).show();
                            console.log("mostrar .moduloIdCalendar" + id);
                        }

                    });
                    listFiltroEstado.forEach(function (val, index) {

                        $(".stateCalendar" + val).hide();

                    });

                });

                graficoRealizadoId = 0;
                scheduler.config.multi_day = true;
                scheduler.config.xml_date = "%Y-%m-%d %H:%i";
                scheduler.config.first_hour = 8;
                scheduler.config.limit_time_select = true;
                scheduler.config.cascade_event_display = true; // enable rendering, default
                // value = false
                scheduler.config.cascade_event_count = 4; // how many events events will
                // be displayed in cascade style
                // (max), default value = 4
                scheduler.config.cascade_event_margin = 30; // margin between events,
                // default value = 30
                scheduler.locale.labels.agenda_tab = "Agenda";
                scheduler.locale.labels.year_tab = "Año";

                if ($(window).width() > 768) {
                    scheduler.init('scheduler_gosst', new Date(), "month");

                } else {

                    scheduler.init('scheduler_gosst', new Date(), "agenda");
                    $(".dhx_agenda_line div").remove();
                    $(".dhx_cal_header").html("Eventos");
                    $(".dhx_cal_navline").remove();

                    $(".dhx_cal_data").on("click", function (e, src) {
                        src = src || (e.target || e.srcElement);
                        var id = scheduler._locate_event(src);
                        var ev = scheduler.getEvent(id);
                        $("#scheduler_gosst").hide();
                        var textBtnCompletar = "<button class='btn btn-success' id='completarEventoGosst'><i class='fa fa-check'></i>Completar</button>";
                        var textBtnDownload = "<button class='btn btn-success' id='descargarEventoGosst'><i class='fa fa-download'></i>Descargar</button>";
                        var textEstado = "<div class='checkbox checkbox-success checkbox-inline'>"
                            + " <input id='tipoEventoGosst' type='checkbox'  >"
                            + " <label for='tipoEventoGosst'>"
                            + ev.estadoEventoNombre
                            + " </label>"
                            + "</div>"
                        if (ev.tipoEvento != 1) {
                            textBtnCompletar = "";
                            textBtnDownload = "";
                        }

                        if (ev.estadoEvento > 3) {
                            textEstado = ev.estadoEventoNombre;
                        }
                        var inputEvi = "<div class='input-group'>" +
                            " <label class='input-group-btn'>" +
                            "<span class='btn btn-primary'>" +
                            "<i class='fa fa-camera' aria-hidden='true'></i>" +
                            "  Subir Evidencia&hellip; <input style='display: none;' " +
                            " type='file' name='fileEviMovil' id='fileEviMovil' " +
                            " >" +
                            " </span>" +
                            "</label>" +
                            "<input type='text' id='textInputEvi' class='form-control' readonly>" +
                            " </div>";
                        $("body").append("<div id='infoEvento'>" +
                            "<div class='tituloDetailEvento'>Datos Evento</div>" +
                            "<div class='infoEvento'><span>Descripción: </span>" + ev.text + "</div>" +
                            "<div class='infoEvento'><span>Responsable : </span>" + ev.responsable + "</div>" +
                            "<div class='infoEvento'><span>Módulo : </span>" + ev.tipoEventoTitulo + "</div>" +
                            "<div class='infoEvento'><span>Fecha: </span>" + convertirFechaNormal(ev.start_date) + "</div>" +
                            "<div class='infoEvento'><span>Estado: </span>" + textEstado + "</div>" +
                            "<div class='infoEvento'>" + inputEvi + "</div>" +
                            "<div class='btnInfoEvento'>" +
                            "<button class='btn btn-danger' id='verEventosGosst'><i class='fa fa-chevron-left'></i>Volver</button> " +
                            textBtnCompletar + "" + textBtnDownload +
                            " </div>" +
                            "</div>");
                        $("#textInputEvi").val(ev.evidenciaNombre);

                        $("#verEventosGosst").on("click", function () {

                            $("#infoEvento").remove();
                            $("#scheduler_gosst").show();

                        });
                        $("#completarEventoGosst").on("click", function () {

                            $("#infoEvento").hide();
                            $("#formCompletarEvento").show();

                        });
                    });

                }


                $("#agenda_tab").on("click", function () {
                    if (agendaPrevia) {
                        agendaPrevia = false;
                        $("#agenda_tab").html("Agenda ");
                        scheduler.config.agenda_start = new Date(2010, 0, 1);

                        scheduler.config.agenda_end = new Date();
                    } else {
                        agendaPrevia = true;
                        $("#agenda_tab").html("Agenda Previa");
                        scheduler.config.agenda_start = new Date();

                        scheduler.config.agenda_end = new Date(2080, 1, 1);

                    }


                })

                scheduler.attachEvent("onEventAdded", function (id) {
                    var obj_to_save = this.getEvent(id);
                    console.log(obj_to_save);
                    var diffDias = restaFechas(convertirFechaNormal2(obj_to_save.start_date), obtenerFechaActual());
                    var estadoEvento = 1;
                    if ($("#roundedOne").prop("checked")) {
                        estadoEvento = 2;
                    } else {
                        if (diffDias > 0) {
                            estadoEvento = 3;

                        } else {
                            estadoEvento = 1;
                        }
                    }
                    guardarEvento(
                        obtenerUTCDate(obj_to_save.start_date),
                        obtenerUTCDate(obj_to_save.end_date),
                        obj_to_save.text, 0, estadoEvento);
                });
                scheduler.attachEvent("onEventChanged", function (id) {
                    var obj_to_update = this.getEvent(id);
                    var diffDias = restaFechas(convertirFechaNormal2(obj_to_update.start_date), obtenerFechaActual());
                    var estadoEvento = 1;
                    if ($("#roundedOne").prop("checked")) {
                        estadoEvento = 2;
                    } else {
                        if (diffDias > 0) {
                            estadoEvento = 3;

                        } else {
                            estadoEvento = 1;
                        }
                    }

                    guardarEvento(
                        obtenerUTCDate(obj_to_update.start_date),
                        obtenerUTCDate(obj_to_update.end_date),
                        obj_to_update.text, obj_to_update.id, estadoEvento);


                });
                scheduler.attachEvent("onEventDeleted", function (id) {
                    console.log("delete");
                    deleteEvento(id);
                });

                $("#divResumen input").on("change", function () {
                    llamarResumenActividades();
                })
                $("#divDetalle input").on("change", function () {
                    llamarDetalleActividades();
                });
                inicializarBotonesIndicadores();
                inicializarCuadroEventos();


                $("#btnClipTabla").on("click", function () {
                    copiarAlPortapapeles(obtenerDatosTablaEstandarNoFija("tblDetalleEventos"), "btnClipTabla");

                    alert("Se han guardado al clipboard la tabla de este módulo");

                });
                $("#btnClipTablaEspecifica").on("click", function () {

                    copiarAlPortapapeles(obtenerDatosTablaEstandarNoFija("tblEspecificaInd"), "btnClipTablaEspecifica");

                    alert("Se han guardado al clipboard la tabla de este módulo");

                });

                $("#btnClipTablaProyeccion").on("click", function () {

                    copiarAlPortapapeles(obtenerDatosTablaEstandarNoFija("tblProyeccion"), "btnClipTablaProyeccion");
                    alert("Se han guardado al clipboard la tabla de este módulo");

                });

                $(document).on("click", "#btnClipTablaIndGeneral", function () {

                    copiarAlPortapapeles(obtenerDatosTablaEstandarNoFija("tblIndGeneral"));
                    alert("Se han guardado al clipboard la tabla de este módulo");

                });
                shortcut.add("Alt+1", function () {
                    $("#indRadial1").click();
                });
                shortcut.add("Alt+2", function () {
                    $("#indRadial3").click();
                });
                shortcut.add("Alt+3", function () {
                    $("#indRadial2").click();
                });
                shortcut.add("Alt+q", function () {
                    verPresentacionGosst();
                });
                shortcut.add("Alt+4", function () {
                });
                break;
            case 3:
                $("#scheduler_gosst").remove();
                $("#botonesIndicadores").remove();
                $("fieldset").remove();
                $("table").remove();
                $("h3").remove();
                $("h4").remove();
                verLateralesFijosMedico();
                marcarIconoModuloSeleccionadoMedico(1);
                $("#wrapperList").remove();
                break;
            case 4:
                $("#scheduler_gosst").remove();
                $("#botonesIndicadores").remove();
                $("fieldset").remove();
                $("table").remove();
                $("h3").remove();
                $("h4").remove();
                verLateralesFijosVigilante();
                marcarIconoModuloSeleccionadoVigilante(0);
                $("#wrapperList").remove();
                break;
            case 5:
                $("#scheduler_gosst").remove();
                $("#botonesIndicadores").remove();
                $("fieldset").remove();
                $("table").remove();
                $("h3").remove();
                $("h4").remove();
                verLateralesFijosResiduo();
                marcarIconoModuloSeleccionadoResiduo(4);
                $("#wrapperList").remove();
                break;

            case 7:
                $("#scheduler_gosst").remove();
                $("#botonesIndicadores").remove();
                $("fieldset").remove();
                $("table").remove();
                $("h3").remove();
                $("h4").remove();
                verLateralesFijosSctr();
                marcarIconoModuloSeleccionadoSctr(0);
                $("#wrapperList").remove();
                break;
            case 9:
                // eval tranps
                break;
            case 10:
                verLateralesFijosMedicoCovid();
                $("#wrapperList").remove();
                break;
        }
    });
});
var zoomId = 0;
$('#modalZoomGrafico').on('shown.bs.modal', function (e) {
    switch (zoomId) {
        case 1:
            llamarSubGrafico(5);
            break;
        case 2:
            llamarGraficoEventos();
            break;
        case 3:
            llamarSubGrafico(1);
            break;
        case 4:
            llamarSubGrafico(2);
            break;
        case 5:
            llamarSubGrafico(3);
            break;
        case 6:
            llamarSubGrafico(4);
            break;
    }

});

$('#modalZoomGrafico').on('hidden.bs.modal', function (e) {
    var cuadroId = "";
    $("#modalZoomGrafico .modal-body").html("");

});

function mostrarZoom(indId) {
    zoomId = indId;
    boolSub1 = true;
    boolSub2 = true;
    boolSub3 = true;
    boolSub4 = true;
    boolSub5 = true;
    var graficoCuerpo = "";
    var cuadroId = "";
    var alturaGrafico = $(window).height() - 150;
    switch (indId) {
        case 1:
            cuadroId = "cuadroSubRadial1"
            break;
        case 2:
            cuadroId = "graficoEventos"
            break;
        case 3:
            cuadroId = "subInfo1"
            break;
        case 4:
            cuadroId = "subInfo2"
            break;
        case 5:
            cuadroId = "subInfo3"
            break;
        case 6:
            cuadroId = "subInfo4"
            break;
    }
    var graficoHtml = $("#" + cuadroId).html();

    graficoCuerpo = "<div id='" + cuadroId + "' style='height:" + alturaGrafico + "px; display:block;width: 100%;position: relative;left:0px;'></div>";
    $("#modalZoomGrafico .modal-body").html(graficoCuerpo);

    $('#modalZoomGrafico').modal("show");


}

$('#modalZoomGrafico').on('shown.bs.modal', function (e) {
    llamarSubGrafico(5);
})

function asignarFuncionesEvento(ev) {
    var vinculoLink = "";
    var nombreEvidencia = "";
    switch (ev.tipoEvento) {
        case 1:
            vinculoLink = URL
                + "/scheduler/evidencia?eventoId=" + ev.id;

            break;
        case 2:
            vinculoLink = URL
                + "/iperc/control/evidencia?controlId=" + ev.idAux;


            $("#irModulo" + ev.id).on("click", function () {

                if (parseInt(ev.linkAuxiliarId1) > 10) {
                    createSession("linkCalendarioAccMejoraId", ev.linkAuxiliarId3);
                    createSession("linkCalendarioSubAccMejoraId", ev.linkAuxiliarId2);
                    createSession("linkCalendarioTipoAccMejoraId", parseInt(ev.linkAuxiliarId1) - 10);

                    createSession("linkCalendarioControlId", ev.idAux);
                    var url = "accionmejora.html";
                    window.location.href = url;
                } else {
                    createSession("linkCalendarioIpercId", ev.linkAuxiliarId3);
                    createSession("linkCalendarioDetalleIpercId", ev.linkAuxiliarId2);
                    createSession("linkCalendarioControlTipoId", ev.linkAuxiliarId1);
                    createSession("linkCalendarioControlId", ev.idAux);
                    var url = "iperc.html";
                    window.location.href = url;
                }

                return false;
            });

            break;
        case 3:
            vinculoLink = URL
                + "/capacitacion/programacion/evidencia?programacionCapId=" + ev.idAux;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioProgCapId", ev.idAux);
                createSession("linkCalendarioCapId", ev.linkAuxiliarId1);
                var url = "capacitacion.html";
                window.location.href = url;
                return false;
            });
            break;
        case 4:

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioEppId", ev.linkAuxiliarId1);
                var url = "equiposeguridad.html";
                window.location.href = url;
                return false;
            });
            break;
        case 5:
            vinculoLink = URL
                + "/equiposeguridad/evidencia?progEquipoId=" + ev.idAux;


            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioEntregaEppId", ev.idAux);

                var url = "equiposeguridad.html";
                window.location.href = url;
                return false;
            });
            break;
        case 6:
            vinculoLink = URL
                + "/procedimientoseguridad/evidencia?procedimientoId=" + ev.idAux;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioProcedimmientoId", ev.idAux);

                var url = "procedimientoseguridad.html";
                window.location.href = url;
                return false;
            });
            break;
        case 7:
            vinculoLink = URL
                + "/examenmedico/programacion/evidencia?programaTipExId=" + ev.idAux;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioProgExamId", ev.idAux);

                var url = "examenmedico.html";
                window.location.href = url;
                return false;
            });
            break;
        case 8:
            vinculoLink = URL
                + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + ev.idAux;


            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioSubAccMejoraId", ev.idAux);
                createSession("linkCalendarioAccMejoraId", ev.linkAuxiliarId1);
                createSession("linkCalendarioTipoAccMejoraId", ev.linkAuxiliarId2);

                var url = "accionmejora.html";
                window.location.href = url;
                return false;
            });
            break;
        case 9:
            vinculoLink = URL
                + "/accidente/evidencia?accidenteId=" + ev.idAux;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioAccidenteId", ev.idAux);

                var url = "accidentes.html";
                window.location.href = url;
                return false;
            });
            break;
        case 10:
            vinculoLink = URL+"/auditoria/evidencia?auditoriaId="+ev.idAux;
            // vinculoLink = URL+"/auditoria/amazon_s3/evidencia?id="+ev.idAux;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioAuditoriaId", ev.idAux);
                if (parseInt(ev.linkAuxiliarId1) == 2) {
                    var url = "inspeccion.html";

                } else {
                    var url = "auditoria.html";

                }

                window.location.href = url;
                return false;
            });
            break;


        case 11:

            vinculoLink = URL
                + "/trabajador/acuerdo/evidencia?acuerdoId=" + ev.idAux;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioAcuerdoId", ev.idAux);
                //createSession("linkCalendarioMdfId", ev.linkAuxiliarId1);
                createSession("linkCalendarioGrupoId", ev.linkAuxiliarId3);
                createSession("linkCalendarioReunionId", ev.linkAuxiliarId2);
                var url = "trabajador.html" + "?mdfId=" + ev.linkAuxiliarId1;


                window.location.href = url;
                return false;
            });
            break;

        case 12:

            vinculoLink = URL
                + "/trabajador/reunion/evidencia?reunionId=" + ev.idAux;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioReunionId", ev.idAux);
                //createSession("linkCalendarioMdfId", ev.linkAuxiliarId1);
                createSession("linkCalendarioGrupoId", ev.linkAuxiliarId2);
                var url = "trabajador.html" + "?mdfId=" + ev.linkAuxiliarId1;


                window.location.href = url;
                return false;
            });
            break;
        case 13:

            vinculoLink = URL
                + "/equiposeguridad/compra/evidencia?compraId=" + ev.idAux;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioCompraId", ev.idAux);
                createSession("linkCalendarioEppId", ev.linkAuxiliarId1);

                var url = "equiposeguridad.html";
                window.location.href = url;
                return false;
            });
            break;
        case 14:

            vinculoLink = URL
                + "/iperc/version/evidencia?versionId=" + ev.idAux;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioVersionId", ev.idAux);
                createSession("linkCalendarioIpercId", ev.linkAuxiliarId1);
                var url = "iperc.html";
                window.location.href = url;
                return false;
            });
            break;
        case 15:

            vinculoLink = ev.evidenciaUrl;

            $("#irModulo" + ev.id).on("click", function () {
                createSession("linkCalendarioInduccionId", ev.idAux);
                var url = "contratista.html";
                window.location.href = url;
                return false;
            });
            break;
    }

    if (ev.evidenciaNombre != "----") {
        $("#evidenciaEvento" + ev.id).attr("href", vinculoLink);
    }

    $("#subirEvi" + ev.id).on("click", function () {
        $('#mdUpload').modal('show');
        $('#btnUploadArchivo').attr("onclick",
            "javascript:uploadArchivo(" + ev.idAux + "," + ev.tipoEvento + "," + ev.id + ");");

    });
}

function verParametrosCalendario() {
    $("#paramCalendario").toggle();
}

function verTodosIndicadores() {
    $("#cuadroRadial1").hide();
    $("#subInfo1").hide();
    $("#subInfo2").hide();
    $("#subInfo3").hide();
    $("#subInfo4").hide();
    $("#graficoEventos").hide();
    $("#divResumen").hide();
    $(".indicador").show();
    $(".zoomGosst").hide();
}

var ocultoCalen = true;

function verIndicador(indId) {

    $(".zoomGosst").attr("onclick", "mostrarZoom(" + indId + ")");
    $(".indicador").hide();
    $(".zoomGosst").show();
    $("#resumenGosst .indicador:nth-child(" + (indId + 2) + ")").show();
    if (graficoRealizadoId == 0) {
        $("#resumenGosst").after("<div class='loadingGosst'><i class='fa fa-spinner fa-spin fa-fw' aria-hidden='true'></i>Cargando</div>")
        llamarIndicadoresEmpresa(1);
        graficoRealizadoId = 1;
        $(".zoomGosst").hide();
    } else {
        switch (indId) {
            case 1:
                $("#cuadroRadial1").show();

                llamarSubGrafico(5);

                break;
            case 2:
                ocultoCalen = !ocultoCalen;
                if (ocultoCalen) {
                    $("#graficoEventos").show();
                    $("#divResumen").hide();
                    llamarGraficoEventos();
                } else {

                    $("#graficoEventos").hide(1000);
                    $("#divResumen").show(1000, function () {

                        if (!tablaRealizada) {
                            tablaRealizada = true;
                            goheadfixedY("#tblResumen", "#wrapper2");
                            llamarResumenActividades();
                        }
                    });
                }


                break;
            case 3:
                llamarSubGrafico(1);
                $("#subInfo1").show();
                break;
            case 4:
                llamarSubGrafico(2);
                $("#subInfo2").show();
                break;
            case 5:
                llamarSubGrafico(3);
                $("#subInfo3").show();
                break;
            case 6:
                llamarSubGrafico(4);
                $("#subInfo4").show();
                break;
            case 0:
                verTodosIndicadores();
                $(".zoomGosst").hide();
                break;
        }

    }
}

var tablaFijaDetalle = false;

function inicializarCuadroEventos() {

    var oculto4 = true;
    $("#detalleEventos").click(function () {

        if (oculto4) {
            $("#detalleEventos").html(
                "<i class='fa fa-th-large fa-2x'></i>&nbsp;Resumen"
            )
            $("#divResumen").hide(1000);
            $("#graficoEventos").hide(1000);
            $("#divDetalle").show(1000, function () {

                if (!tablaFijaDetalle) {
                    tablaFijaDetalle = true;
                    $("#cuadroRadial2 #wrapper3").css("height", $("#cuadroRadial2").height() - 250 + "px");
                    goheadfixedY("#tblDetalleEventos", "#wrapper3");
                    llamarDetalleActividades();
                }
            });

            $("#btnClipTabla").show();
        } else {
            $("#divResumen").show(1000);
            $("#graficoEventos").hide(1000);
            $("#divDetalle").hide(1000);
            $("#detalleEventos").html(
                "<i class='fa fa-tasks fa-2x'></i>&nbsp;Detalle"
            );
            $("#btnGrafEvent").show();
            $("#btnClipTabla").hide();
        }
        oculto4 = !oculto4;
    });
    $("#btnGrafEvent").on("click", function () {

        $("#graficoEventos").show(1000, llamarGraficoEventos);
        $("#divResumen").hide(1000);
        $("#divDetalle").hide(1000);
    });
}

var boolSub1 = true;
var boolSub2 = true;
var boolSub3 = true;
var boolSub4 = true;
var boolSub5 = true;
var tableCalendarioFija = false;

function inicializarBotonesIndicadores() {
    var alturaCuadro = $(window).height() * 0.95;
    var anchoCuadro = $(window).width() * 0.95;
    var alturaCuadro2 = $(window).height() * 0.95;
    var anchoCuadro2 = $(window).width() * 0.95;
    var alturaIndicador = 118;
    var anchoIndicador = 50;
    $(".cuadroGeneral").hide();
    $("#cuadrosIndicadores #cuadroRadial1").css({});
    $("#cuadrosIndicadores #cuadroRadial2").css({});
    $("#cuadrosIndicadores #cuadroRadial3").css({});
    $("#botonesIndicadores #indRadial1").css({
        "top": "50%",
        "bottom": "50%",
        "height": alturaIndicador,
        "margin-top": alturaIndicador / -2
    });
    $("#botonesIndicadores #indRadial2").css({
        "top": "75%",
        "bottom": "25%", "right": "0px",
        "height": alturaIndicador,
        "margin-top": alturaIndicador / -2
    });
    $("#botonesIndicadores #indRadial3").css({
        "top": "25%",
        "bottom": "75%", "right": "0px",
        "height": alturaIndicador,
        "margin-top": alturaIndicador / -2
    });
    var oculto1 = true;
    var oculto2 = true;
    var oculto3 = true;

    $("#indRadial1").click(function () {
        boolSub5 = false;
        $("#cuadroRadial1").toggle(0, function () {
            oculto1 = !oculto1;
            if (graficoRealizadoId == 0) {
                llamarIndicadoresEmpresa(1);
                boolSub5 = true;
                graficoRealizadoId = 1;
            } else {
                llamarSubGrafico(5);
            }

        });
        if (oculto1) {

            $("#indRadial1").animate({left: anchoCuadro}, 1000);

        } else {

            $("#indRadial1").animate({left: "0px"}, 1000);
        }

    });
    $("#indRadial2").click(function () {

        $("#divDetalle").hide();
        $("#cuadroRadial2").show(0, function () {
            $("#graficoEventos").hide(1000);
            $("#divResumen").show(1000, function () {

                if (!tablaRealizada) {
                    tablaRealizada = true;
                    $("#cuadroRadial2 #wrapper2").css("height", $("#cuadroRadial2").height() - 250 + "px");
                    goheadfixedY("#tblResumen", "#wrapper2");
                    verResponsablesAcuerdoFecha();
                    llamarResumenActividades();
                }
            });
        });
        var modulosSelect = [{
            id: 0,
            nombre: "Todos"
        },
            {
                id: 1,
                nombre: "Actividades ingresadas en el calendario"
            },
            {
                id: 2,
                nombre: "Control IPERC"
            },
            {
                id: 3,
                nombre: "Formación"
            },
            {
                id: 4,
                nombre: "Equipo Seguridad"
            },
            {
                id: 5,
                nombre: "Entrega EPP"
            },
            {
                id: 6,
                nombre: "Procedimiento Seguridad"
            },
            {
                id: 7,
                nombre: "Examen Médico"
            },
            {
                id: 8,
                nombre: "Acción de Mejora"
            },
            {
                id: 806,
                nombre: "Acción de Mejora Accidente/Incidente"
            },
            {
                id: 801,
                nombre: "Acción de Mejora Inspecciones"
            },
            {
                id: 809,
                nombre: "Acción de Mejora A/C Subestándar"
            },
            {
                id: 101,
                nombre: "Auditoría"
            },
            {
                id: 102,
                nombre: "Inspecciones"
            },
            {
                id: 103,
                nombre: "Hallazgos"
            },
            {
                id: 104,
                nombre: "Monitoreos"
            },
            {
                id: 105,
                nombre: "Evaluación Contratista"
            },
            {
                id: 11,
                nombre: "Acuerdo Seguridad"
            },
            {
                id: 12,
                nombre: "Reunión de Seguridad"
            },
            {
                id: 13,
                nombre: "Adquisición / Mantenimiento"
            },
            {
                id: 14,
                nombre: "Versión IPERC"
            }];
        $("#slcModulo").html("");
        modulosSelect.forEach(function (val, index) {
            $("#slcModulo").append("<option value='" + val.id + "'>" + val.nombre + "</option>");
        });
        var dataParam = {
            companyId: getSession("gestopcompanyid")
        };
        callAjaxPostNoLoad(
            URL + '/mdf/listbox',
            dataParam,
            function (data) {
                var selUnidadEvento = crearSelectOneMenu("selUnidadEvento", "actualizarTablasEventos()", data.list,
                    "", "matrixId",
                    "matrixName", "Todas");

                $("#divUnidadEvento").html(selUnidadEvento)
                llamarResumenActividades();
            });


    });
    $("#indRadial3").click(function () {
        boolSub1 = true;
        boolSub2 = true;
        boolSub3 = true;
        boolSub4 = true;
        $("#subInfo1").html("");
        $("#subInfo2").html("");
        $("#subInfo3").html("");
        $("#subInfo4").html("");
        if (oculto3) {

            $("#indRadial3").animate({right: anchoCuadro2}, 1000);

        } else {
            $("#indRadial3").animate({right: "0px"}, 1000);
        }
        $("#cuadroRadial3").toggle(0, function () {
            oculto3 = !oculto3;
            if (graficoRealizadoId == 0) {
                llamarIndicadoresEmpresa(1);
                graficoRealizadoId = 1;
            } else {
                llamarSubGrafico(1);
                llamarSubGrafico(2);
                llamarSubGrafico(3);
                llamarSubGrafico(4);
            }


        });


    });

}

function cargarScheduler() {
    scheduler.clearAll();

    var fechaReporteInicio = $("#fechaInicioFiltroCalendario").val();
    var fechaReporteFin = $("#fechaFinFiltroCalendario").val();

    if (fechaReporteInicio.length != 0 && fechaReporteFin.length != 0) {
        var dataParam = {
            empresaId: parseInt(sessionStorage.getItem("gestopcompanyid")),
            fechaReporteInicio: fechaReporteInicio,
            fechaReporteFin: fechaReporteFin,
            responsableId: (parseInt(sessionStorage.getItem("trabajadorGosstId")) > 0 ? parseInt(sessionStorage.getItem("trabajadorGosstId")) : null)
        };

        callAjaxPost(URL + '/scheduler', dataParam, procesarCalendario);
    } else {
        mensajeUx = "<label>Debe ingresar el rango de fecha.</label>";
        mensajesUx(mensajeUx, 2, "", "AvisoCompletarFechaRango");

        $("#modalMensajeUxAvisoCompletarFechaRango").on("hidden.bs.modal", function () {
            $("#modalFiltroCalendario").modal("show");
        });
    }
}

var toggleEmpresa = true;

function procesarCalendario(data) {

    var valorResize = 140;
    resizeDivWrapper("scheduler_gosst", valorResize);

    var divBot = document.getElementById("contenedorBotonesCalendario");
    divBot.style.top = "10px";

    var divCab = document.getElementById("contenedorCabezalCalendario");
    divCab.style.top = "32px";

    var divCue = document.getElementById("contenedorCuerpoCalendario");
    divCue.style.height = "600px";

    switch (data.CODE_RESPONSE) {
        case "05":
            listFullEventos = data.list;
            $("#day_tab").css({"right": "204px", "left": "auto", "top": "0px"});
            $("#week_tab").css({"right": "140px", "left": "auto", "top": "0px"});
            $("#agenda_tab").css({"right": "280px", "left": "auto", "top": "0px"});
            $("#month_tab").css({"right": "76px", "left": "auto", "top": "0px"});
            $("#year_tab").css({"right": "350px", "left": "auto", "top": "0px"});
            $("#nombreFiltroCalendario").css({"right": "350px", "left": "auto", "top": "0px"});
            scheduler.parse(data.list, "json");

            completarBarraCarga();
            break;
        default:
            console.log("Hubo un error al cargar calendario.");
    }

}

function volverTablaTrabajadores() {
    $("#tblActTrab").show();
    $("#divCompletarActividad").hide();
}

function verCompletarActividad(pindex) {
    var r = confirm("¿Quiere completar esta actividad?");
    if (r) {
        $("#tblActTrab").hide();
        $("#divCompletarActividad").show();
        var objActividad = listFullEventos[pindex];
        console.log(objActividad)
        var textoBotonVolver = "<button class='btn btn-success' onclick='volverTablaTrabajadores()'>" +
            "<i class='fa fa-angle-left' aria-hidden='true'></i>Volver</button>";
        var textoBotonGuardar = "<button class='btn btn-success' onclick='guardarActividadTrabajador(" + pindex + ")'>" +
            "<i class='fa fa-save' aria-hidden='true'></i>Guardar</button>";
        var formEvi = crearFormEvidencia("Actividad", true)
        $("#divCompletarActividad").html(textoBotonVolver + "<br>" +
            "<table  class='table table-striped table-bordered table-hover'>" +
            "<thead>" +
            "<tr><td colspan='2' class='tb-acc'>" + objActividad.text + "</td></tr>" +
            "</thead>" +
            "<tbody>" +
            "<tr>" +
            "<td>Fecha Realizada</td>" +
            "<td><input type='date' class='form-control' id='dateActividad'></td>" +
            "</tr>" +
            "<tr>" +
            "<td>Evidencia</td>" +
            "<td>" + formEvi + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td></td>" +
            "<td>" + textoBotonGuardar + "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>");
    }


}

function guardarEvento(fechaInicio, fechaFin, descripcion, id, estadoId) {
    var dataParam = {
        firstDate: fechaInicio,
        endDate: fechaFin,
        text: descripcion,
        estadoEvento: estadoId,
        id: id,
        empresaId: sessionStorage.getItem("gestopcompanyid")
    };

    callAjaxPost(URL + '/scheduler/evento/save', dataParam,
        resultadoGuardarCalendario);
}

function resultadoGuardarCalendario(data) {
    switch (data.CODE_RESPONSE) {
        case "05":

            cargarScheduler();
            break;
        default:
            alert("OcurriÃ³ un error al guardar evento!");
    }
}

function deleteEvento(id) {
    console.log("borrado nuevo evento");
    var dataParam = {
        id: id,
        empresaId: sessionStorage.getItem("gestopcompanyid")
    };

    callAjaxPost(URL + '/scheduler/evento/delete', dataParam,
        resultadoDeleteScheduler);
}

function resultadoDeleteScheduler(data) {
    switch (data.CODE_RESPONSE) {
        case "05":
            console.log("se elimino exitosamente");
            cargarScheduler();
            break;
        default:
            alert("OcurriÃ³ un error al guardar evento!");
    }
}

function mostrarCargarImagen(eventoId) {
    $('#mdUpload').modal('show');
    $('#btnUploadArchivo').attr("onclick",
        "javascript:uploadArchivo(" + eventoId + ");");
}

function uploadArchivo(eventoId, tipoEventoId, schedulerId) {
    var fieldEvidencia = "id";
    var url = '/scheduler/evidencia/save';
    switch (tipoEventoId) {
        case 1:
            url = '/scheduler/evidencia/save';
            fieldEvidencia = "eventoId";

            break;
        case 2:
            url = '/iperc/control/evidencia/save';
            fieldEvidencia = "controlId";

            break;
        case 3:
            url = '/capacitacion/programacion/evidencia/save';
            fieldEvidencia = "programacionCapId";

            break;
        case 4:

            break;
        case 5:

            url = '/equiposeguridad/evidencia/save';
            fieldEvidencia = "progEquipoId";

            break;
        case 6:
            url = '/procedimientoseguridad/evidencia/save';
            fieldEvidencia = "procedimientoId";

            break;
        case 7:
            url = '/examenmedico/programacion/evidencia/save';
            fieldEvidencia = "programaTipExId";


            break;
        case 8:
            url = '/gestionaccionmejora/accionmejora/evidencia/save';
            fieldEvidencia = "accionMejoraId";
            fieldEvidencia = "fileAccEvi";
            break;
        case 9:
            url = '/accidente/evidencia/save';
            fieldEvidencia = "accidenteId";

            break;
        case 10:
            url = '/auditoria/evidencia/save';
            fieldEvidencia = "auditoriaId";

            break;
        case 11:
            url = '/trabajador/acuerdo/evidencia/save';
            fieldEvidencia = "acuerdoId";

            break;
        case 12:
            url = '/trabajador/reunion/evidencia/save';
            fieldEvidencia = "reunionId";

            break;
        case 13:
            url = '/equiposeguridad/compra/evidencia/save';
            fieldEvidencia = "compraId";

            break;
        case 14:
            url = '/iperc/version/evidencia/save';
            fieldEvidencia = "versionId";

            break;
        case 15:
            url = '/contratista/examen/evidencia/save';
            fieldEvidencia = "id";

            break;
    }


    $.blockUI({
        message: 'Cargando...'
    });
    guardarEvidenciaAuto(eventoId, "fileEvi", bitsEvidenciaEventoCalendario, url, function () {
        $.unblockUI();
        $('#mdUpload').modal('hide');
        scheduler.showLightbox(schedulerId);
        var vinculoLink = "";
        var hrefEvidencia = "";
        var nombreEvidencia = "";
        var inputFileImage = document.getElementById("fileEvi");
        var file = inputFileImage.files[0];
        nombreEvidencia = file.name;
        var textoLink = "Link ";
        $(".dhx_cal_ltitle #linkEvento").remove();

        switch (tipoEventoId) {
            case 1:
                vinculoLink = "href='" + URL
                    + "/scheduler/evidencia?eventoId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/scheduler/evidencia?eventoId=" + eventoId;
                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";

                $(".dhx_cal_ltitle").append(tagDescarga);

                break;
            case 2:
                vinculoLink = "href='" + URL
                    + "/iperc/control/evidencia?controlId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/iperc/control/evidencia?controlId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 3:
                vinculoLink = "href='" + URL
                    + "/capacitacion/programacion/evidencia?programacionCapId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/capacitacion/programacion/evidencia?programacionCapId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";

                $(".dhx_cal_ltitle").append(tagDescarga);

                break;
            case 4:

                break;
            case 5:
                vinculoLink = "href='" + URL
                    + "/equiposeguridad/evidencia?progEquipoId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/equiposeguridad/evidencia?progEquipoId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 6:
                vinculoLink = "href='" + URL
                    + "/procedimientoseguridad/evidencia?procedimientoId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/procedimientoseguridad/evidencia?procedimientoId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 7:
                vinculoLink = "href='" + URL
                    + "/examenmedico/programacion/evidencia?programaTipExId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/examenmedico/programacion/evidencia?programaTipExId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 8:
                vinculoLink = "href='" + URL
                    + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 9:
                vinculoLink = "href='" + URL
                    + "/accidente/evidencia?accidenteId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/accidente/evidencia?accidenteId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 10:
                vinculoLink = "href='" + URL
                    + "/auditoria/evidencia?auditoriaId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/auditoria/evidencia?auditoriaId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 11:
                vinculoLink = "href='" + URL
                    + "/trabajador/acuerdo/evidencia?acuerdoId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/trabajador/acuerdo/evidencia?acuerdoId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 12:
                vinculoLink = "href='" + URL
                    + "/trabajador/reunion/evidencia?reunionId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/trabajador/reunion/evidencia?reunionId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 13:
                vinculoLink = "href='" + URL
                    + "/equiposeguridad/compra/evidencia?compraId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/equiposeguridad/compra/evidencia?compraId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 14:
                vinculoLink = "href='" + URL
                    + "/iperc/version/evidencia?versionId=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/iperc/version/evidencia?versionId=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
            case 15:
                vinculoLink = "href='" + URL
                    + "/contratista/examen/evidencia?id=" + eventoId + "' target='_blank'";
                hrefEvidencia = URL
                    + "/contratista/examen/evidencia?id=" + eventoId;

                var tagDescarga = "<div id='linkEvento'>" + textoLink + "  <a " + vinculoLink + ">" + nombreEvidencia + "</a></div>";
                $(".dhx_cal_ltitle").append(tagDescarga);
                break;
        }

        if (nombreEvidencia != "----") {
            $("#evidenciaEvento" + eventoId).attr("href", hrefEvidencia)
                .html("<i aria-hidden='true' class='fa fa-file' style='font-size: 30px;margin-right:10px'></i>" + nombreEvidencia);
        }
        scheduler._events[schedulerId].evidenciaNombre = nombreEvidencia
        listFullEventos.forEach(function (val, index) {
            if (val.idAux == eventoId) {
                val.evidenciaNombre = nombreEvidencia;

            }
        });
    }, fieldEvidencia)

}

function actualizarTablasEventos() {
    var fechaDesde = $("#fechaInicioEvento").val();
    var fechaHasta = $("#fechaFinEvento").val();

    if (restaFechas(fechaDesde, fechaHasta) < 365 * 3) {
        if (fechaDesde != null && fechaHasta != null) {
            if (restaFechas(fechaDesde, fechaHasta) > 0) {
                llamarResumenActividades();
                llamarDetalleActividades();
                $("#advertenciaFecha").html("");

            } else {
                $("#advertenciaFecha").html("<strong>Rango de fechas no valido!</strong>");
                $("#fechaInicioEvento").val(fechaHasta);
            }


        }
    } else {
        $("#advertenciaFecha").html("<strong>Rango máximo de 3 años</strong>");
    }


}

function llamarResumenActividades() {
    $("#divResumen #wrapper2 #tblResumen tbody tr").remove();
    var rangoFechas = hallarFechasPeriodo();
    var moduloId = $("#slcModulo").val();
    var unidadId = parseInt($("#selUnidadEvento").val());
    var moduloIdAux = $("#slcModulo").val();
    if (parseInt(moduloIdAux) > 100) {
        moduloId = 10;
    }
    switch (parseInt(moduloIdAux)) {
        case 806:
        case 801:
        case 809:
            moduloId = 8;
            break;
    }
    arrayFechasEvento = [];
    arrayEventoProceso = [];
    arrayEventoCompleto = [];
    arrayEventoRetrasado = [];
    arrayEventoTotal = [];
    totalesEventoProceso = 0;
    totalesEventoCompleto = 0;
    totalesEventoRetrasado = 0;


    for (var index = 0; index < rangoFechas.length; index++) {
        var numEnProceso = 0;
        var numCompletados = 0;
        var numRetrasados = 0;
        for (var index2 = 0; index2 < listFullEventos.length; index2++) {

            var tipoEvento = listFullEventos[index2].tipoEvento;
            var respuestaAudi = condicionAudi(listFullEventos[index2], moduloIdAux);
            var respuestaAccion = true;
            switch (parseInt(moduloIdAux)) {
                case 806:
                    respuestaAccion = (listFullEventos[index2].linkAuxiliarId3 == "6" ||
                        listFullEventos[index2].linkAuxiliarId3 == "7");
                    respuestaAudi = true;
                    break;
                case 801:
                    respuestaAccion = (listFullEventos[index2].linkAuxiliarId3 == "1" ||
                        listFullEventos[index2].linkAuxiliarId3 == "2" ||
                        listFullEventos[index2].linkAuxiliarId3 == "3" ||
                        listFullEventos[index2].linkAuxiliarId3 == "4");
                    respuestaAudi = true;
                    break;
                case 809:
                    respuestaAccion = (listFullEventos[index2].linkAuxiliarId3 == "9");
                    respuestaAudi = true;
                    break;
            }
            var respuestaUnidad = true;
            if (unidadId == -1) {
                respuestaUnidad = true;
            } else {
                respuestaUnidad = (listFullEventos[index2].unidadId == unidadId)
            }
            if ((tipoEvento == moduloId || moduloId == 0) && respuestaAudi && respuestaAccion && respuestaUnidad) {


                var fechaAux = listFullEventos[index2].start_date;
                var estadoEvento = listFullEventos[index2].estadoEvento;
                var fecha = rangoFechas[index].split("-");
                var fecha2 = convertirFechaNormal2(fechaAux).split("-");
                var responsable = $("#respEvento").val();


                var hayResp = (responsable == "0" ||
                    listFullEventos[index2].responsable == (responsable));
                switch ($("input[name=tipoPeriodo]:checked").val()) {
                    case "3":
                        if (tipoEvento != 9
                            && fecha[0] == fecha2[0]
                            && fecha2[1] == fecha[1] && hayResp
                            && (estadoEvento == 1)) {
                            numEnProceso = numEnProceso + 1;
                        }
                        if (tipoEvento != 9
                            && fecha2[0] == fecha[0]
                            && fecha2[1] == fecha[1] && hayResp
                            && (estadoEvento == 2)) {
                            numCompletados = numCompletados + 1;
                        }
                        if (tipoEvento != 9
                            && fecha2[0] == fecha[0]
                            && fecha2[1] == fecha[1] && hayResp
                            && (estadoEvento == 3)) {
                            numRetrasados = numRetrasados + 1;
                        }
                        break;
                    case "1":
                        var fechaInicio = fecha[2] + "-" + fecha[1] + "-" + fecha[0];
                        if (tipoEvento != 9 && hayResp
                            && restaFechas(fechaInicio, convertirFechaNormal2(fechaAux)) == 0
                            && (estadoEvento == 1)) {
                            numEnProceso = numEnProceso + 1;
                        }
                        if (tipoEvento != 9 && hayResp
                            && restaFechas(fechaInicio, convertirFechaNormal2(fechaAux)) == 0
                            && (estadoEvento == 2)) {
                            numCompletados = numCompletados + 1;
                        }
                        if (tipoEvento != 9 && hayResp
                            && restaFechas(fechaInicio, convertirFechaNormal2(fechaAux)) == 0
                            && (estadoEvento == 3)) {
                            numRetrasados = numRetrasados + 1;
                        }
                        break;
                    case "2":

                        var fechaInicio = fecha[2] + "-" + fecha[1] + "-" + fecha[0];
                        var fechaFin = convertirFechaNormal2(fechaAux);

                        if (tipoEvento != 9 && hayResp
                            && restaFechas(fechaInicio, fechaFin) < 7
                            && restaFechas(fechaInicio, fechaFin) >= 0
                            && (estadoEvento == 1)) {
                            numEnProceso = numEnProceso + 1;
                        }
                        if (tipoEvento != 9 && hayResp
                            && restaFechas(fechaInicio, fechaFin) < 7
                            && restaFechas(fechaInicio, fechaFin) >= 0
                            && (estadoEvento == 2)) {
                            numCompletados = numCompletados + 1;
                        }
                        if (tipoEvento != 9 && hayResp
                            && restaFechas(fechaInicio, fechaFin) < 7
                            && restaFechas(fechaInicio, fechaFin) >= 0
                            && (estadoEvento == 3)) {
                            numRetrasados = numRetrasados + 1;
                        }
                        break;
                }
            }
        }


        var porcentajeAvance = 0;
        var subTotalEventos = numCompletados + numEnProceso + numRetrasados;
        if (numCompletados + numEnProceso + numRetrasados > 0) {
            porcentajeAvance = numCompletados / (numCompletados + numEnProceso + numRetrasados);
        }
        $("#divResumen #wrapper2 #tblResumen tbody").append(
            "<tr>" +
            "<td class=''>" + rangoFechas[index] + "</td>" +
            "<td style='background-color:" + (numRetrasados == 0 ? "white" : "#C0504D;color:white; ") + "'> " + numRetrasados + "</td>" +
            "<td style='background-color:" + (numEnProceso == 0 ? "white" : "#F79646") + "'>" + numEnProceso + "</td>" +
            "<td style='background-color:" + (numCompletados == 0 ? "white" : "#9BBB59") + "'>" + numCompletados + "</td>" +
            "<td>" + pasarDecimalPorcentaje(porcentajeAvance, 2) + "</td>" +
            "</tr>"
        );
        arrayFechasEvento.push(rangoFechas[index]);
        arrayEventoProceso.push(numEnProceso);
        arrayEventoRetrasado.push(numRetrasados);
        arrayEventoCompleto.push(numCompletados);
        arrayEventoTotal.push(subTotalEventos);

        totalesEventoProceso = totalesEventoProceso + numEnProceso;
        totalesEventoCompleto = totalesEventoCompleto + numCompletados;
        totalesEventoRetrasado = totalesEventoRetrasado + numRetrasados;
        if (index == rangoFechas.length - 1) {
            var porcentajeAvance = 0;
            var subTotalEventos = totalesEventoCompleto + totalesEventoProceso + totalesEventoRetrasado;
            if (subTotalEventos > 0) {
                porcentajeAvance = totalesEventoCompleto / (subTotalEventos);
            }
            $("#divResumen #wrapper2 #tblResumen tbody").append(
                "<tr>" +
                "<td class=''>" + "TOTAL" + "</td>" +
                "<td class='retrasado'> " + totalesEventoRetrasado + "</td>" +
                "<td class='proceso'>" + totalesEventoProceso + "</td>" +
                "<td class='completado'>" + totalesEventoCompleto + "</td>" +
                "<td>" + pasarDecimalPorcentaje(porcentajeAvance, 2) + "</td>" +
                "</tr>"
            );
        }

    }
}

function condicionAudi(auditoria, moduloIdAux) {
    var respuesta = false;
    if (parseInt(moduloIdAux) > 100) {
        auditoria.linkAuxiliarId1 = parseInt(auditoria.linkAuxiliarId1);
        auditoria.linkAuxiliarId2 = parseInt(auditoria.linkAuxiliarId2);
        switch (parseInt(moduloIdAux)) {
            case 101:
                respuesta = (auditoria.linkAuxiliarId1 == 1)
                break;
            case 102:
                respuesta = (auditoria.linkAuxiliarId1 == 2 && auditoria.linkAuxiliarId2 != 94 && auditoria.linkAuxiliarId2 != 100)
                break;
            //Hallasgos
            case 103:
                respuesta = (auditoria.linkAuxiliarId1 == 2 && auditoria.linkAuxiliarId2 == 94 && auditoria.linkAuxiliarId2 != 100)
                break;
            //Monitoreos
            case 104:
                respuesta = (auditoria.linkAuxiliarId1 == 2 && auditoria.linkAuxiliarId2 != 94 && auditoria.linkAuxiliarId2 == 100)
                break;
            //Contratistas
            case 105:
                respuesta = (auditoria.linkAuxiliarId1 == 3)
                break;
        }
        if (respuesta) {
            console.log(auditoria);
        }
        return respuesta;
    } else {
        return true;
    }

}

function llamarDetalleActividades() {
    var fechaInicio = $("#fechaInicioEvento").val();
    var fechaFin = $("#fechaFinEvento").val();
    var eventosPermitidos1 = ($("#tipoEvento1").prop("checked") ? 1 : 0);
    var eventosPermitidos2 = ($("#tipoEvento2").prop("checked") ? 2 : 0);
    var eventosPermitidos3 = ($("#tipoEvento3").prop("checked") ? 3 : 0);
    var moduloId = $("#slcModulo").val();
    var unidadId = parseInt($("#selUnidadEvento").val());
    var moduloIdAux = $("#slcModulo").val();
    if (parseInt(moduloIdAux) > 100) {
        moduloId = 10;
    }
    switch (parseInt(moduloIdAux)) {
        case 806:
        case 801:
        case 809:
            moduloId = 8;
            break;
    }

    $("#tblDetalleEventos tbody tr").remove();
    $(".eventoGeneral").remove();
    listFullEventos.forEach(function (val, index) {

        var tipoEvento = val.tipoEvento;
        var respuestaAudi = condicionAudi(val, moduloIdAux);
        var respuestaAccion = true;
        switch (parseInt(moduloIdAux)) {
            case 806:
                respuestaAccion = (val.linkAuxiliarId3 == "6" ||
                    val.linkAuxiliarId3 == "7");
                respuestaAudi = true;
                break;
            case 801:
                respuestaAccion = (val.linkAuxiliarId3 == "1" ||
                    val.linkAuxiliarId3 == "2" ||
                    val.linkAuxiliarId3 == "3" ||
                    val.linkAuxiliarId3 == "4");
                respuestaAudi = true;
                break;
            case 809:
                respuestaAccion = (val.linkAuxiliarId3 == "9");
                respuestaAudi = true;
                break;
        }
        if ((tipoEvento == moduloId || moduloId == 0) && respuestaAudi && respuestaAccion) {
            var fechaAux = val.start_date;
            var estadoEvento = val.estadoEvento;
            var responsable = $("#respEvento").val();

            var respuestaUnidad = true;
            if (unidadId == -1) {
                respuestaUnidad = true;
            } else {
                respuestaUnidad = (val.unidadId == unidadId)
            }
            if (tipoEvento != 9
                && restaFechas(fechaInicio, convertirFechaNormal2(fechaAux)) >= 0
                && restaFechas(convertirFechaNormal2(fechaAux), fechaFin) >= 0
                && (estadoEvento == eventosPermitidos1
                    || estadoEvento == eventosPermitidos2
                    || estadoEvento == eventosPermitidos3)
                && (responsable == "0" ||
                    val.responsable == responsable) && respuestaUnidad) {
                var respAux = val.responsable;

                var hora = fechaAux.getHours() + ":"
                    + (('' + fechaAux.getMinutes()).length < 2 ? '0' : '') + fechaAux.getMinutes();
                var textOrigenAccion = "";
                if (val.tipoEvento == 8 && val.linkAuxiliarId1 != null) {
                    textOrigenAccion = "<br><a class='efectoLink' " +
                        "onclick='verOrigenAccionMain(" + index + ")'><i class='fa fa-eye'></i>Ver origen</a>"
                }
                $("#tblDetalleEventos tbody").append(
                    "<tr id='eventTd" + index + "'> " +
                    "<td>" + val.text + textOrigenAccion + "</td>" +
                    "<td>" + val.responsable + "</td>" +

                    "<td>" + convertirFechaNormal(fechaAux) + "</td>" +
                    "<td>" + hora + " h</td>" +
                    "<td id='tdest" + index + "'>" + val.estadoEventoNombre + "</td>" +
                    "</tr>"
                )
                $("#tdest" + index).css({
                    "color": val.color, "font-weight": " bold"
                });
                var dateGosst = new Date(val.start_date);
                var iconoEvi = "<i class='fa fa-file' style='font-size: 30px;margin-right:10px' aria-hidden='true'></i>" + val.evidenciaNombre;
                if (val.evidenciaNombre == "----") {
                    iconoEvi = "Sin evidencia"
                }
                $("#noticiasGosst")
                    .append("<div class='eventoGeneral' style='border-right:8px solid " + val.color + ";   '>" +
                        "<div id='tituloEvento'>" +

                        val.iconoNombre +
                        convertirFechaNormal3(dateGosst) +


                        "<br>" +
                        "<strong >(" +
                        val.estadoEventoNombre +
                        ")  </strong>" +


                        val.text + "<br>" +
                        "<strong>Responsable:  </strong>" + respAux +
                        "<a  id='evidenciaEvento" + val.id + "' class='evidenciaEvento' target='_blank'>" +
                        iconoEvi +

                        "</a>" +
                        "<div id='btnAcceso'>" +
                        "<button class='btn btn-success'>" +
                        "<i class='fa fa-upload' aria-hidden='true'> </i>" +
                        "Subir Evidencia</button>" +
                        "<button class='btn btn-success'>" +
                        "<i class='fa fa-chevron-circle-right' aria-hidden='true'></i> " +
                        "Ir al módulo</button>" +
                        "</div>" +
                        "</div>" +
                        "</div>");
                asignarFuncionesEvento(val);

            }
        }
    })


}

function verOrigenAccionMain(pindex) {
    var accionObj = listFullEventos[pindex];

    $("#modalAccionesAuditoria").modal("show");
    $("#modalAccionesAuditoria").find(".modal-title")
        .html("Orígen de '" + accionObj.text + "'")
    callAjaxPost(URL + '/auditoria/accion/origenes', {gestionAccionMejoraId: accionObj.linkAuxiliarId1},
        function (data) {
            var list = data.list;
            $("#tblItemAsoc tbody tr").remove();
            list.forEach(function (val, index) {
                var btnDescargaCausa = "";
                if (val.evidenciaNombre != null) {
                    btnDescargaCausa = "<a class='btn-success btn' " +
                        "href='" + URL + "/auditoria/accion/origen/evidencia?id=" + val.detalleGestAccionMejoraId + "' " +
                        "target='_blank' >Descargar Evidencia</a>";
                } else {
                    btnDescargaCausa = "Sin evidencia"
                }
                $("#tblItemAsoc tbody")
                    .append(
                        "<tr  >"
                        + "<td id='asd"
                        + val.detalleGestAccionMejoraId + "'>"
                        + val.moduloNombre + "</td>"

                        + "<td id='asd"
                        + val.detalleGestAccionMejoraId + "'>"
                        + val.categoriaNombre + "</td>"

                        + "<td id='asd"
                        + val.detalleGestAccionMejoraId
                        + "'>" + val.detalleNombre + "</td>"
                        + "<td id='asd"
                        + val.detalleGestAccionMejoraId
                        + "'>" + val.observacion + "</td>"
                        + "<td id='asd"
                        + val.detalleGestAccionMejoraId + "'>"
                        + val.fechaInicioTexto
                        + "</td>"
                        + "<td >"
                        + btnDescargaCausa
                        + "</td>"
                        + "</tr>");
            });

        });
}

function hallarFechasPeriodo() {
    var fechaInicio = $("#fechaInicioEvento").val();
    var fechaFin = $("#fechaFinEvento").val();
    var fecha1 = fechaInicio.split('-');
    var fecha2 = fechaFin.split('-');
    var difanio = fecha2[0] - fecha1[0] + 1;
    var difDias = restaFechas(fechaInicio, fechaFin);
    var listfecha = [];

    switch ($("input[name=tipoPeriodo]:checked").val()) {
        case "3":

            for (index = 0; index < difanio; index++) {
                var anioaux = parseInt(index) + parseInt(fecha1[0]);

                if (difanio > 1) {
                    if (index == 0) {
                        for (index1 = 0; index1 < 12 - fecha1[1] + 1; index1++) {

                            var mesaux = parseInt(index1) + parseInt(fecha1[1]);
                            listfecha.push(anioaux + "-" + (('' + mesaux).length < 2 ? '0' : '') + mesaux);
                        }
                    }
                    if (index == difanio - 1) {
                        for (index4 = 0; index4 < parseInt(fecha2[1]); index4++) {
                            var mesaux3 = parseInt(index4) + parseInt("1");
                            listfecha.push(anioaux + "-" + (('' + mesaux3).length < 2 ? '0' : '') + mesaux3);
                        }
                    }

                    if (index > 0 && index < difanio - 1) {

                        for (index3 = 0; index3 < 12; index3++) {
                            var mesaux2 = parseInt(index3) + 1;
                            listfecha.push(anioaux + "-" + (('' + mesaux2).length < 2 ? '0' : '') + mesaux2);
                        }


                    }

                } else {
                    for (index5 = 0; index5 < fecha2[1] - fecha1[1] + 1; index5++) {

                        var mesaux4 = parseInt(index5) + parseInt(fecha1[1]);
                        listfecha.push(anioaux + "-" + (('' + mesaux4).length < 2 ? '0' : '') + mesaux4);
                    }

                }


            }
            ;
            break;

        case "1":
            for (index = 0; index <= difDias; index++) {
                var fecha = sumaFechaDias(index, fechaInicio).split("-");
                listfecha.push(fecha[2] + "-" + fecha[1] + "-" + fecha[0])
            }
            break;
        case "2":

            var fechaInicioUTC = obtenerUTCDateFromInput(fechaInicio);
            var fechaFinUTC = obtenerUTCDateFromInput(fechaFin);
            var diasInicio = fechaInicioUTC.getUTCDay();
            if (diasInicio == 0) {
                diasInicio = 7;
            }
            var diasFin = fechaFinUTC.getUTCDay();
            if (diasFin == 0) {
                diasFin = 7;
            }
            var fechaInicioSemana = sumaFechaDias(1 + (diasInicio * -1), fechaInicio);
            var fechaFinSemana = sumaFechaDias(6 - diasFin, fechaFin);

            var difDiasSemana = restaFechas(fechaInicioSemana, fechaFinSemana) + 1;
            var numSemanas = Math.ceil(difDiasSemana / 7);
            for (index = 0; index < numSemanas; index++) {

                listfecha.push(
                    sumaFechaDias2((index * 7), fechaInicioSemana) +
                    "-<br>" + sumaFechaDias2(((index + 1) * 7) - 1, fechaInicioSemana))
            }
            break;

    }


    return listfecha;

}

function llamarGraficoEventos() {

    $('#graficoEventos').highcharts({
        title: {
            text: 'RESUMEN DE CUMPLIMIENTO DE EVENTOS'
        },
        xAxis: {
            categories: arrayFechasEvento
        },
        yAxis: {
            min: 0,
            title: {
                text: '# de eventos'
            }
        },
        labels: {
            items: [{
                html: 'Total eventos',
                style: {
                    left: '50px',
                    top: '18px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        series: [{
            type: 'column',
            name: 'Por implementar',
            color: "#F79646",
            data: arrayEventoProceso
        }, {
            type: 'column',
            name: 'Completo', color: "#9BBB59",
            data: arrayEventoCompleto
        }, {
            type: 'column',
            name: 'Retrasado', color: "#C0504D",
            data: arrayEventoRetrasado
        }, {
            type: 'spline',
            name: 'Meta',
            data: arrayEventoTotal,
            color: 'blue',
            marker: {
                lineWidth: 2,
                lineColor: "blue",
                fillColor: 'white'
            }
        }, {
            type: 'pie',
            name: 'Total Eventos ',
            data: [{
                name: 'Por implementar',
                y: totalesEventoProceso,
                color: "#F79646" // Jane's color
            }, {
                name: 'Completo',
                y: totalesEventoCompleto,
                color: "#9BBB59" // John's color
            }, {
                name: 'Retrasado',
                y: totalesEventoRetrasado,
                color: "#C0504D"// Joe's color
            }],
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    });


}

var llamadaRealizada = false;

function llamarIndicadoresEmpresa(idFull) {
    var dataParam = {
        empresaId: sessionStorage.getItem("gestopcompanyid"),
        grupoId: idFull
    };

    callAjaxPost(URL + '/empresa/indicadores', dataParam, procesarIndicadorEmpresa, function () {
        if (llamadaRealizada) {
            return false;
        } else {

            $('#cuadroRadial1').html("Cumplimiento de objetivos propuestos por GOSST"
                + "<a href='#' onclick='javascript:llamarSubGrafico(5);'>"
                + "<i class='fa fa-crosshairs' style='color:#0E9290'></i></a>"
                + "<a href='#' onclick='javascript:llamarSubGrafico(6);'>"
                + "<i class='fa fa-arrows  ' style='color:#0E9290'></i></a>"
                + "<div id='cuadroSubRadial1' style='width:100%;height:92%'>Cargando..</div>" +
                "");
            $("#cuadroRadial1").block({message: '<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
            $("#cuadroRadial3").block({message: '<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});

            llamadaRealizada = true;

            return true;
        }

    });


}

var proyeccionCapacitacion;
var proyeccionMedica;
var proyeccionEpp;

var tablaEspFormacion;
var tablaEspExam;
var tablaEspEpp;
var tablaEspEvaluacion;
var tablaEspPart;
var tablaEspDisp;

var trabajadoresBuscar;

function procesarIndicadorEmpresa(data) {

    if (data.CODE_RESPONSE == "05") {
        $(".indicador").show();
        $(".loadingGosst").remove();
        var indicadorFormacion = 0;
        var indicadorAcumulado = 0;
        var indicadorEntregaEpp = 0;
        var indicadorDisponibilidad = 0;
        var indicadorParticipacion = 0;
        var indicadorExamenMedico = 0;
        tablaEspFormacion = {
            cuerpo: "",
            cabeza: "<td>Trabajador</td>" +
                "<td>Capacitaciones Asignadas</td>" +
                "<td>Capacitaciones Aprobadas y Vigentes</td>" +
                "<td>Indicador Actual</td>"
        },
            tablaEspExam = {
                cuerpo: "",
                cabeza: "<td>Trabajador</td>" +
                    "<td>Resultado de último examen</td>" +
                    "<td>Indicador Actual</td>"
            },
            tablaEspEpp = {
                cuerpo: "",
                cabeza: "<td>Trabajador</td>" +
                    "<td>EPP´s Asignados</td>" +
                    "<td>EPP´s Entregados y Vigentes</td>" +
                    "<td>Indicador Actual</td>"
            }
        tablaEspEvaluacion = {
            cuerpo: "",
            cabeza: "<td>Evaluaciones realizadas</td>" +
                "<td>Evaluaciones con riesgo potencial</td>" +
                "<td>Indicador Actual</td>"
        }
        tablaEspPart = {
            cuerpo: "",
            cabeza: "<td>Trabajador</td>" +
                "<td>Reportes A/C en el último año</td>" +
                "<td>Meta</td>" +
                "<td>Indicador Actual</td>"
        }
        tablaEspDisp = {
            cuerpo: "",
            cabeza: "<td>Trabajador</td>" +
                "<td>Dáas Descanso Médico Total</td>" +
                "<td>Días trabajadors</td>" +
                "<td>Indicador Actual</td>"
        }
        proyeccionCapacitacion = data.indFormacion;
        proyeccionEpp = data.indEpp;
        proyeccionMedica = data.indExam;
        trabajadoresBuscar = data.trabajadoresBuscar;


        var cuerpoAuxiliar = "";
        for (index = 0; index < proyeccionCapacitacion.length; index++) {

            var primerDia = new Date();

            var numCapsAprobadas = 0;
            primerDia = convertirFechaNormal2(primerDia);
            var capacitacionesTrab = proyeccionCapacitacion[index].caps;
            var indicadorRangoActual = 1;
            for (var index22 = 0; index22 < capacitacionesTrab.length; index22++) {
                if (index22 == 0) {
                    indicadorRangoActual = 0
                }
                var programs = capacitacionesTrab[index22].programsCap;

                for (var index3 = 0; index3 < programs.length; index3++) {
                    if (programs[index3].fechaPlaTexto == null) {
                        programs[index3].fechaPlaTexto = primerDia;
                    }
                    if (programs[index3].fechaRealTexto == null) {
                        programs[index3].fechaRealTexto = programs[index3].fechaPlaTexto;
                    }
                    var enRangoInicial = fechaEnRango(primerDia, programs[index3].fechaPlaTexto, programs[index3].fechaRealTexto)
                    var boolEntreFechas = false;
                    if (enRangoInicial) {
                        boolEntreFechas = true;
                    }

                    if (programs[index3].progCapEstado == 2 && programs[index3].tipoNotaTrabId == 1 && boolEntreFechas) {

                        indicadorRangoActual =
                            indicadorRangoActual + (1 / capacitacionesTrab.length);
                        index3 = programs.length;
                        numCapsAprobadas = numCapsAprobadas + 1;
                    }
                }


            }
            indicadorAcumulado = indicadorRangoActual + indicadorAcumulado;
            var size = proyeccionCapacitacion.length;
            (index + 1 == size ? indicadorFormacion = indicadorAcumulado / size : 0);
            cuerpoAuxiliar = cuerpoAuxiliar + "" +
                "<tr>" +
                "<td>" + proyeccionCapacitacion[index].trabajadorNombre + "</td>" +
                "<td>" + capacitacionesTrab.length + "</td>" +
                "<td>" + numCapsAprobadas + "</td>" +
                "<td>" + (capacitacionesTrab.length == 0 ? 1 : (numCapsAprobadas / capacitacionesTrab.length).toFixed(3)) + "</td>" +

                "</tr>"
        }
        tablaEspFormacion.cuerpo = cuerpoAuxiliar;
        indicadorAcumulado = 0;
        var cuerpoAuxiliar = "";
        for (index = 0; index < proyeccionEpp.length; index++) {
            var primerDia = new Date();
            primerDia = convertirFechaNormal2(primerDia);
            var eppsTrab = proyeccionEpp[index].epps;

            var indicadorRangoActual = 1;
            var numEppsAprobadas = 0;
            for (var index2 = 0; index2 < eppsTrab.length; index2++) {
                if (index2 == 0) {
                    indicadorRangoActual = 0
                }
                var programs = eppsTrab[index2].programsEpp;

                for (var index3 = 0; index3 < programs.length; index3++) {

                    if (programs[index3].fechaPlanificadaTexto == null) {
                        programs[index3].fechaPlanificadaTexto = primerDia;
                    }
                    ;
                    if (programs[index3].fechaPlanificadaTexto == null) {
                        programs[index3].fechaEntregaTexto = programs[index3].fechaPlanificadaTexto;
                    }
                    var enRangoInicial = fechaEnRango(primerDia, programs[index3].fechaPlanificadaTexto, programs[index3].fechaEntregaTexto)
                    var enRangoFinal = fechaEnRango(primerDia, programs[index3].fechaPlanificadaTexto, programs[index3].fechaEntregaTexto)
                    var boolEntreFechas = false;

                    if (enRangoInicial || enRangoFinal) {
                        boolEntreFechas = true;
                    }
                    if (programs[index3].estadoImplementacion == 2 && programs[index3].tipoNotaTrabId != null && boolEntreFechas) {
                        indicadorRangoActual =
                            indicadorRangoActual + (1 / eppsTrab.length);
                        index3 = programs.length;
                        numEppsAprobadas = numEppsAprobadas + 1;
                    }
                }


            }

            indicadorAcumulado = indicadorRangoActual + indicadorAcumulado;
            var size = proyeccionEpp.length;
            (index + 1 == size ? indicadorEntregaEpp = indicadorAcumulado / size : 0);
            cuerpoAuxiliar = cuerpoAuxiliar + "" +
                "<tr>" +
                "<td>" + proyeccionEpp[index].trabajadorNombre + "</td>" +
                "<td>" + eppsTrab.length + "</td>" +
                "<td>" + numEppsAprobadas + "</td>" +
                "<td>" + (eppsTrab.length == 0 ? 1 : (numEppsAprobadas / eppsTrab.length).toFixed(3)) + "</td>" +

                "</tr>"
        }
        tablaEspEpp.cuerpo = cuerpoAuxiliar;
        indicadorAcumulado = 0;
        var cuerpoAuxiliar = "";
        for (index = 0; index < data.indAcc.length; index++) {
            indicadorAcumulado = data.indAcc[index].indicadorDiasDescanso + indicadorAcumulado;
            var size = data.indAcc.length;
            (index + 1 == size ? indicadorDisponibilidad = indicadorAcumulado / size : 0);
            cuerpoAuxiliar = cuerpoAuxiliar + "" +
                "<tr>" +
                "<td>" + data.indAcc[index].trabajadorNombre + "</td>" +

                "<td>" + data.indAcc[index].sumaDiasDescanso + "</td>" +
                "<td>" + data.indAcc[index].diasTrabajados + "</td>" +
                "<td>" + (data.indAcc[index].indicadorDiasDescanso).toFixed(3) + "</td>" +

                "</tr>"
        }
        tablaEspDisp.cuerpo = cuerpoAuxiliar;
        indicadorAcumulado = 0;
        var cuerpoAuxiliar = "";
        for (index = 0; index < data.indEvento.length; index++) {
            var minimoReport = (data.indicadoresSeguridad == null ? 12 : data.indicadoresSeguridad.indicadorMinimoParticipacion);
            var preEventosReportados = (data.indEvento[index].numEventosReportados);
            preEventosReportados = (preEventosReportados > minimoReport ? minimoReport : preEventosReportados);

            indicadorAcumulado = preEventosReportados + indicadorAcumulado;
            var size = data.indEvento.length;
            (index + 1 == size ? indicadorParticipacion = indicadorAcumulado / size : 0);

            var preParticipacion = (data.indEvento[index].numEventosReportados / minimoReport);
            preParticipacion = (preParticipacion > 1 ? 1 : preParticipacion);
            cuerpoAuxiliar = cuerpoAuxiliar + "" +
                "<tr>" +
                "<td>" + data.indEvento[index].trabajadorNombre + "</td>" +
                "<td>" + data.indEvento[index].numEventosReportados + "</td>" +
                "<td>" + minimoReport + "</td>" +
                "<td>" + preParticipacion.toFixed(3) + "</td>" +

                "</tr>"
        }
        tablaEspPart.cuerpo = cuerpoAuxiliar;
        indicadorAcumulado = 0;
        var cuerpoAuxiliar = "";
        numTrabajadoresActivos = proyeccionMedica.length;
        numTrabajadoresAptos = 0;
        numTrabajadoresRestricciones = 0;
        numTrabajadoresObservados = 0;
        numTrabajadoresNoAptos = 0;
        numTrabajadoresNoEvaluados = numTrabajadoresActivos;
        for (index = 0; index < proyeccionMedica.length; index++) {


            var primerDia = new Date();

            primerDia = convertirFechaNormal2(primerDia);
            var examsTrab = proyeccionMedica[index].exams;
            var indicadorRangoActual = 0;
            var resultadoMedico = "Sin exámenes";
            var puntaje = 0;

            for (var index2 = 0; index2 < examsTrab.length; index2++) {
                var programs = examsTrab[index2].programsExams;

                for (var index3 = 0; index3 < programs.length; index3++) {
                    if (programs[index3].fechaInicialTexto == null) {
                        programs[index3].fechaInicialTexto = primerDia;
                    }
                    ;
                    if (programs[index3].fechaFinTexto == null) {
                        programs[index3].fechaFinTexto = programs[index3].fechaInicialTexto;
                    }
                    var enRangoInicial = fechaEnRango(primerDia, programs[index3].fechaInicialTexto, programs[index3].fechaFinTexto)
                    var boolEntreFechas = false;

                    if (enRangoInicial) {
                        boolEntreFechas = true;
                    }
                    if (programs[index3].progExamEstadoId == 2 && programs[index3].progTrabId != null && boolEntreFechas) {
                        indicadorRangoActual = programs[index3].tipoNotaTrabId;
                        resultadoMedico = programs[index3].vigenciaNombre;
                        switch (programs[index3].progTrabId) {
                            case 1:
                                numTrabajadoresAptos = numTrabajadoresAptos + 1;
                                numTrabajadoresNoEvaluados = numTrabajadoresNoEvaluados - 1;
                                break;
                            case 2:
                                numTrabajadoresRestricciones = numTrabajadoresRestricciones + 1;
                                numTrabajadoresNoEvaluados = numTrabajadoresNoEvaluados - 1;
                                break;
                            case 3:
                                numTrabajadoresNoAptos = numTrabajadoresNoAptos + 1;
                                numTrabajadoresNoEvaluados = numTrabajadoresNoEvaluados - 1;
                                break;
                            case 5:
                                numTrabajadoresObservados = numTrabajadoresObservados + 1;
                                numTrabajadoresNoEvaluados = numTrabajadoresNoEvaluados - 1;
                                break;

                        }
                        puntaje = (programs[index3].tipoNotaTrabId != 0 ? 1 : 0);
                        index3 = programs.length;
                        index2 = examsTrab.length;

                    }
                }


            }

            indicadorAcumulado = indicadorRangoActual + indicadorAcumulado;
            var size = proyeccionMedica.length;
            (index + 1 == size ? indicadorExamenMedico = indicadorAcumulado / size : 0);
            cuerpoAuxiliar = cuerpoAuxiliar + "" +
                "<tr>" +
                "<td>" + proyeccionMedica[index].trabajadorNombre + "</td>" +
                "<td>" + resultadoMedico + "</td>" +
                "<td>" + puntaje + "</td>" +

                "</tr>"
        }
        tablaEspExam.cuerpo = cuerpoAuxiliar;

        evalRealizadas = data.indIperc[0].evalRealizadas;
        evalRiesgosas = data.indIperc[0].evalRiesgosas;
        controlesPorImplementar = data.indIpercGeneral.controlesPorImplementar;
        controlesCompletados = data.indIpercGeneral.controlesCompletados;
        controlesRetrasados = data.indIpercGeneral.controlesRetrasados;
        //////
        numAccidentes = data.indAccidenteGeneral.numAccidentes;
        numIncidentes = data.indAccidenteGeneral.numIncidentes;
        numEnfermedades = data.indAccidenteGeneral.numEnfermedades;
        numAccidentesLeves = data.indAccidenteGeneral.numAccidentesLeves;
        numAccidentesFatales = data.indAccidenteGeneral.numAccidentesFatales;
        numAccidentesInc = data.indAccidenteGeneral.numAccidentesInc;
        numAccidentesInc1 = data.indAccidenteGeneral.numAccidentesInc1;
        numAccidentesInc2 = data.indAccidenteGeneral.numAccidentesInc2;
        numAccidentesInc3 = data.indAccidenteGeneral.numAccidentesInc3;
        numAccidentesInc4 = data.indAccidenteGeneral.numAccidentesInc4;
        numEnfermedades1 = data.indAccidenteGeneral.numEnfermedades1;
        numEnfermedades2 = data.indAccidenteGeneral.numEnfermedades2;
        numDiasDescanso = data.indAccidenteGeneral.numDiasDescanso;
        numDiasSinAccidente = data.indAccidenteGeneral.numDiasSinAccidente;
        /////

        eventosInseguros = data.eventosInseguros[0].numCond + data.eventosInseguros[0].numActos;
        //////
        form4plus = data.indFormacionGeneral.form4plus;
        form3 = data.indFormacionGeneral.form3;
        form2 = data.indFormacionGeneral.form2;
        form1 = data.indFormacionGeneral.form1;
        form0 = data.indFormacionGeneral.form0;
        horasForm4plus = data.indFormacionGeneral.horasForm4plus;
        horasForm3 = data.indFormacionGeneral.horasForm3;
        horasForm2 = data.indFormacionGeneral.horasForm2;
        horasForm1 = data.indFormacionGeneral.horasForm1;
        //////
        var indicadorIperc = (evalRealizadas == 0 ? 0 : (evalRealizadas - evalRiesgosas) / evalRealizadas);
        var cuerpoAuxiliar = "";
        cuerpoAuxiliar = "<tr>" +
            "<td>" + evalRealizadas + "</td>" +
            "<td>" + evalRiesgosas + "</td>" +
            "<td>" + indicadorIperc.toFixed(3) + "</td>" +

            "</tr>";
        tablaEspEvaluacion.cuerpo = cuerpoAuxiliar;
        var indicadorMinimoFormacion = data.indicadoresSeguridad == null ? 1 : data.indicadoresSeguridad.indicadorMinimoFormacion;
        var indicadorMinimoEntregaEpp = data.indicadoresSeguridad == null ? 1 : data.indicadoresSeguridad.indicadorMinimoEntregaEpp;
        var indicadorMinimoDisponibilidad = data.indicadoresSeguridad == null ? 1 : data.indicadoresSeguridad.indicadorMinimoDisponibilidad;
        var indicadorMinimoParticipacion = data.indicadoresSeguridad == null ? 12 : data.indicadoresSeguridad.indicadorMinimoParticipacion;
        var indicadorMinimoExamenMedico = data.indicadoresSeguridad == null ? 1 : data.indicadoresSeguridad.indicadorMinimoExamenMedico;
        var indicadorMinimoIperc = data.indicadoresSeguridad == null ? 1 : data.indicadoresSeguridad.indicadorMinimoIperc;

        $('#cuadroSubRadial1').highcharts({

            chart: {
                polar: true,
                type: 'area'
            },

            title: {
                text: ''
            },

            pane: {
                size: '80%'
            },

            xAxis: {
                categories: ['Vigencia Promedio de Formacion',
                    'Vigencia Promedio de EPP',
                    'Disponibilidad Laboral',
                    'Participacion en el SGSST',
                    'Vigencia Examen Médico',
                    'Porcentaje de riesgo no significativo'],
                labels: {
//		                    enabled: false,
                    color: '#fff',

                    x: 5,
                    useHTML: true,
                    formatter: function () {

                        return {
                            'Vigencia Promedio de Formacion': "<i class='fa fa-3x fa-graduation-cap' aria-hidden='true'></i>",
                            'Vigencia Promedio de EPP': "<i class='fa fa-3x fa-fire-extinguisher' aria-hidden='true'></i>",
                            'Disponibilidad Laboral': "<i class='fa fa-3x fa-users' aria-hidden='true'></i>",
                            'Participacion en el SGSST': "<i class='fa fa-3x fa-flag' aria-hidden='true'></i>",
                            'Vigencia Examen Médico': "<i class='fa fa-3x fa-medkit' aria-hidden='true'></i>",
                            'Porcentaje de riesgo no significativo': "<i class='fa fa-3x fa-exclamation-triangle' aria-hidden='true'></i>"
                        }[this.value]; //'<img class="" src="http://dummyimage.com/60x60/ff6600/ffffff"/>';
                    }

                },
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0, tickInterval: 0.25,
                max: 1
            },

            tooltip: {
                shared: true,
                valueDecimals: 2,
                headerFormat: '<span style="font-size: 16px">{point.key}</span><br/>',
                pointFormat: '<b style="color:{point.color};font-size:18px">{series.name}</b>: <b style="font-size:17px">{point.y}</b><br/>'
            },

            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                y: 70,
                layout: 'vertical'
            },
            colors: ["#9BBB59", "#4F81BD"],
            series: [{
                zIndex: 3,
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, "#9BBB59"],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                name: 'Promedio Actual',
                data: [indicadorFormacion,
                    indicadorEntregaEpp,
                    indicadorDisponibilidad,
                    ((indicadorParticipacion / indicadorMinimoParticipacion) > 1 ? 1 : (indicadorParticipacion / indicadorMinimoParticipacion)),
                    indicadorExamenMedico,
                    indicadorIperc],
                pointPlacement: 'on'
            }, {
                name: 'Meta',
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 0.1
                    },
                    stops: [
                        [0, "#4F81BD"],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(-0.9).get('rgba')]
                    ]
                },
                data: [indicadorMinimoFormacion,
                    indicadorMinimoEntregaEpp,
                    indicadorMinimoDisponibilidad,
                    1,
                    indicadorMinimoExamenMedico,
                    indicadorMinimoIperc],
                pointPlacement: 'on'
            }]


        });
        globalFormacion = indicadorFormacion;
        globalEpp = indicadorEntregaEpp;
        globalDisp = indicadorDisponibilidad;
        globalPart = indicadorParticipacion / indicadorMinimoParticipacion;
        globalExam = indicadorExamenMedico;
        globalIper = indicadorIperc;

        globalFormacionMeta = indicadorMinimoFormacion;
        globalEppMeta = indicadorMinimoEntregaEpp;
        globalDispMeta = indicadorMinimoDisponibilidad;
        globalPartMeta = 1;
        globalExamMeta = indicadorMinimoExamenMedico;
        globalIperMeta = indicadorMinimoIperc;
        $("#cuadroRadial1").unblock();
        $("#cuadroRadial3").unblock();
        //MODIFICACIONES DE QUERY???
        llamarSubGrafico(1);
        llamarSubGrafico(2);
        llamarSubGrafico(3);
        llamarSubGrafico(4);
    } else {
        console.log("T")
    }


    completarBarraCarga();

}

function llamarSubGrafico(idSeccion) {
    switch (idSeccion) {
        case 1:
            if (boolSub1) {
                crearGraficoPie("subInfo1");

            } else {
                $("#subInfo1").html(
                    "	<br>"
                    + "	# de actividades evaluadas en el SGSST:"
                    + "	<label>" + evalRealizadas + "</label><br>"
                    + "# de actividades con riesgo significativo:"
                    + "<label>" + evalRiesgosas + "</label><br>"
                    + "# de controles implementados en el último año:"
                    + "<label>" + controlesCompletados + "</label><br>"
                    + "# de controles por implementar en la matriz IPERC:"
                    + "<label>" + controlesPorImplementar + "</label><br>"
                    + "# de controles retrasados en la matriz IPERC:<label>" + controlesRetrasados + "</label><br>"
                );
            }
            boolSub1 = !boolSub1;
            break;
        case 2:
            if (boolSub2) {
                crearPiramideSubGrafico("subInfo2");

            } else {
                var horasHombre = numTrabajadoresActivos * 7.5 * 22 * 12;
                var indiceSeveridad = numDiasDescanso * 200000 / horasHombre;
                var indicadorFrecuenciaTotal = (numAccidentes * 200000 / horasHombre);
                var indiceAccidentabilidad = indiceSeveridad * indicadorFrecuenciaTotal / 200;


                $("#subInfo2").html(
                    "# de Accidentes fatales :	<label>" + numAccidentesFatales + "</label><br>"
                    + "# de Accidentes incapacitantes :	<label>" + numAccidentesInc + "</label><br>"
                    + "#  enfermedades ocupacionales :	<label>" + numEnfermedades2 + "</label><br>"
                    + "# incidentes :	<label>" + numIncidentes + "</label><br>"
                    + "#  días de descanso médico  :	<label>" + numDiasDescanso + "</label><br>"
                    + "#  A/C subestándar:	<label>" + eventosInseguros + "</label><br>"
                    + "#  días sin accidentes :	<label>" + numDiasSinAccidente + "</label><br>"
                    + "Indice de Accidentabilidad :	<label>" + indiceAccidentabilidad.toFixed(2) + "</label><br>");
            }
            boolSub2 = !boolSub2;
            break;
        case 3:
            if (boolSub3) {
                crearGraficoBarraLineaDual("subInfo3");

            } else {
                var horasTotales = horasForm4plus + horasForm3 + horasForm2 + horasForm1;
                $("#subInfo3").html(
                    "	# total de trabajadores activos: 	<label>" + numTrabajadoresActivos + "</label><br>"
                    + "# de trabajadores con 0 capacitaciones:	<label>" + form0 + "</label><br>"
                    + "# de trabajadores con 1 capacitación:	<label>" + form1 + "</label><br>"
                    + "# de trabajadores con 2 capacitaciones:	<label>" + form2 + "</label><br>"
                    + "# de trabajadores con 3 capacitaciones:	<label>" + form3 + "</label><br>"
                    + "# de trabajadores con más de 4 capacitaciones:	<label>" + form4plus + "</label><br>"
                    + "# de horas de formación total :	<label>" + horasTotales + "</label><br>");
            }
            boolSub3 = !boolSub3;
            break;
        case 4:
            if (boolSub4) {
                crearGraficoRadio("subInfo4");

            } else {
                $("#subInfo4").html(
                    "# de trabajadores aptos:	<label>" + numTrabajadoresAptos + "</label><br>"
                    + "# de trabajadores aptos con restricciones:	<label>" + numTrabajadoresRestricciones + "</label><br>"
                    + "# de trabajadores observados:	<label>" + numTrabajadoresObservados + "</label><br>"
                    + "# de trabajadores no aptos:	<label>" + numTrabajadoresNoAptos + "</label><br>"

                    + "# de trabajadores no evaluados:	<label>" + numTrabajadoresNoEvaluados + "</label><br>");
            }
            boolSub4 = !boolSub4;
            break;
        case 5:
            if (!boolSub5) {
                $('#cuadroSubRadial1').highcharts({

                    chart: {
                        polar: true,
                        type: 'area'
                    },

                    title: {
                        text: ''
                    },

                    pane: {
                        size: '80%'
                    },

                    xAxis: {
                        categories: ['Vigencia Promedio de Formacion',
                            'Vigencia Promedio de EPP',
                            'Disponibilidad Laboral',
                            'Participacion en el SGSST',
                            'Vigencia Examen Médico',
                            'Porcentaje de riesgo no significativo'],
                        labels: {
//			                    enabled: false,
                            color: '#fff',

                            x: 5,
                            useHTML: true,
                            formatter: function () {

                                return {
                                    'Vigencia Promedio de Formacion': "<i class='fa fa-3x fa-graduation-cap' aria-hidden='true'></i>",
                                    'Vigencia Promedio de EPP': "<i class='fa fa-3x fa-fire-extinguisher' aria-hidden='true'></i>",
                                    'Disponibilidad Laboral': "<i class='fa fa-3x fa-users' aria-hidden='true'></i>",
                                    'Participacion en el SGSST': "<i class='fa fa-3x fa-flag' aria-hidden='true'></i>",
                                    'Vigencia Examen Médico': "<i class='fa fa-3x fa-medkit' aria-hidden='true'></i>",
                                    'Porcentaje de riesgo no significativo': "<i class='fa fa-3x fa-exclamation-triangle' aria-hidden='true'></i>"
                                }[this.value]; //'<img class="" src="http://dummyimage.com/60x60/ff6600/ffffff"/>';
                            }

                        },
                        tickmarkPlacement: 'on',
                        lineWidth: 0
                    },

                    yAxis: {
                        gridLineInterpolation: 'polygon',
                        lineWidth: 0,
                        min: 0, tickInterval: 0.25,
                        max: 1
                    },

                    tooltip: {
                        shared: true,
                        valueDecimals: 2,
                        headerFormat: '<span style="font-size: 16px">{point.key}</span><br/>',
                        pointFormat: '<b style="color:{point.color};font-size:18px">{series.name}</b>: <b style="font-size:17px">{point.y}</b><br/>'
                    },

                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        y: 70,
                        layout: 'vertical'
                    },
                    colors: ["#9BBB59", "#4F81BD"],
                    series: [{
                        zIndex: 3,
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, "#9BBB59"],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        name: 'Promedio Actual',
                        data: [globalFormacion,
                            globalEpp,
                            globalDisp,
                            globalPart / globalPartMeta,
                            globalExam,
                            globalIper],
                        pointPlacement: 'on'
                    }, {
                        name: 'Meta',
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 0.1
                            },
                            stops: [
                                [0, "#4F81BD"],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(-0.9).get('rgba')]
                            ]
                        },
                        data: [globalFormacionMeta,
                            globalEppMeta,
                            globalDispMeta,
                            1,
                            globalExamMeta,
                            globalIperMeta],
                        pointPlacement: 'on'
                    }]


                });

            } else {
                $("#cuadroSubRadial1").html("<table id='tblIndGeneral' class='table table-striped table-bordered table-hover'>" +
                    "<thead>" +
                    "<tr>" +
                    "<td class='tb-acc' >Objetivo Propuesto <a id='btnClipTablaIndGeneral' href='#' >" +
                    " <i class='fa fa-external-link-square' style='color:white'></i></a></td>" +
                    "<td class='tb-acc'>Objetivo Alcanzado</td>" +
                    "<td class='tb-acc'>Meta</td>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<tr>" +
                    "<td>Vigencia promedio de formación</td>" +
                    "<td>" + globalFormacion.toFixed(3) + "<a id='btnEspInd1' onclick='verEspecificoIndicador(1)' href='#' >" +
                    " <i class='fa fa-question-circle' style='color:black'></i></a></td>" +
                    "<td>" + globalFormacionMeta.toFixed(3) + "</td>" +
                    "</tr>" +

                    "<td>Vigencia promedio de EPP´s:</td>" +
                    "<td>" + globalEpp.toFixed(3) + "<a id='btnEspInd2' onclick='verEspecificoIndicador(2)' href='#' >" +
                    " <i class='fa fa-question-circle' style='color:black'></i></a></td>" +
                    "<td>" + globalEppMeta.toFixed(3) + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>Disponibilidad Laboral</td>" +
                    "<td>" + globalDisp.toFixed(3) + "<a id='btnEspInd3' onclick='verEspecificoIndicador(3)' href='#' >" +
                    " <i class='fa fa-question-circle' style='color:black'></i></a></td>" +
                    "<td>" + globalDispMeta.toFixed(3) + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>Participación en SGSST</td>" +
                    "<td>" + globalPart.toFixed(3) + "<a id='btnEspInd4' onclick='verEspecificoIndicador(4)' href='#' >" +
                    " <i class='fa fa-question-circle' style='color:black'></i></a></td>" +
                    "<td>" + globalPartMeta.toFixed(3) + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>Vigencia de exámenes médicos</td>" +
                    "<td>" + globalExam.toFixed(3) + "<a id='btnEspInd5' onclick='verEspecificoIndicador(5)' href='#' >" +
                    " <i class='fa fa-question-circle' style='color:black'></i></a></td>" +
                    "<td>" + globalExamMeta.toFixed(3) + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>Porcentaje de riesgo significativo</td>" +
                    "<td>" + globalIper.toFixed(3) + "<a id='btnEspInd6' onclick='verEspecificoIndicador(6)' href='#' >" +
                    " <i class='fa fa-question-circle' style='color:black'></i></a></td>" +
                    "<td>" + globalIperMeta.toFixed(3) + "</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>");
            }
            boolSub5 = !boolSub5;
            break;

        case 6:
            llamarProyeccionIndicadores();
            break;

    }


}

function verEspecificoIndicador(tipoIndicador) {
    $("#modalEspecifoInd").modal("show");
    $("#tblEspecificaInd thead tr td").remove();
    $("#tblEspecificaInd tbody tr").remove();
    var hModalAux = $(window).height() * 0.55;
    $("#divEspIndicador").css(
        {
            "height": hModalAux + "px",
            "overflow-x": "auto",
            "overflow-y": "auto"
        }
    );
    switch (tipoIndicador) {
        case 1:
            $("#tblEspecificaInd thead tr").append(tablaEspFormacion.cabeza);
            $("#tblEspecificaInd tbody").append(tablaEspFormacion.cuerpo);
            break;
        case 2:
            $("#tblEspecificaInd thead tr").append(tablaEspEpp.cabeza);
            $("#tblEspecificaInd tbody").append(tablaEspEpp.cuerpo);
            break;
        case 3:
            $("#tblEspecificaInd thead tr").append(tablaEspDisp.cabeza);
            $("#tblEspecificaInd tbody").append(tablaEspDisp.cuerpo);
            break;
        case 4:
            $("#tblEspecificaInd thead tr").append(tablaEspPart.cabeza);
            $("#tblEspecificaInd tbody").append(tablaEspPart.cuerpo);
            break;
        case 5:
            $("#tblEspecificaInd thead tr").append(tablaEspExam.cabeza);
            $("#tblEspecificaInd tbody").append(tablaEspExam.cuerpo);
            break;
        case 6:
            $("#tblEspecificaInd thead tr").append(tablaEspEvaluacion.cabeza);
            $("#tblEspecificaInd tbody").append(tablaEspEvaluacion.cuerpo);
            break;
    }
    ;
    $("#tblEspecificaInd thead tr td").addClass("tb-acc")
}

function crearGraficoPie(divId) {

    $("#" + divId).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        tooltip: {
            headerFormat: '',
            style: {
                fontSize: '24px'
            },
            pointFormat: '<span style="font-size:16px;">{point.name}</span>:<br> <b style="color:{point.color};font-weight:bold">{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '18px'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            name: 'Controles',
            data: [
                {name: 'Controles Completados', y: controlesCompletados, color: "#9BBB59"},
                {
                    name: 'Controles Retrasados', color: "#C0504D",
                    y: controlesRetrasados,
                    sliced: true,
                    selected: true
                },
                {name: 'Controles Por Implementar', y: controlesPorImplementar, color: "#F79646"}
            ]
        }]
    });


}

function crearGraficoRadio(divId) {


    Highcharts.chart(divId, {

            chart: {
                type: 'solidgauge',
                marginTop: 20
            },

            title: {
                text: '',
                style: {
                    fontSize: '24px'
                }
            },

            tooltip: {
                borderWidth: 0, valueDecimals: 2,
                backgroundColor: 'none',
                shadow: false,
                style: {
                    fontSize: '10px'
                },
                pointFormat: '<span style="font-size:2em;" >{series.name}</span><br>'
                    + '<span style="font-size:6em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                positioner: function (labelWidth, labelHeight) {
                    return {
                        x: 220 - labelWidth / 2,
                        y: 100
                    };
                }
            },

            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Move
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: Highcharts.Color("#9BBB59").setOpacity(0.3).get(),
                    borderWidth: 0
                }, { // Track for Exercise
                    outerRadius: '87%',
                    innerRadius: '63%',
                    backgroundColor: Highcharts.Color("#F79646").setOpacity(0.3).get(),
                    borderWidth: 0
                }, { // Track for Stand
                    outerRadius: '62%',
                    innerRadius: '38%',
                    backgroundColor: Highcharts.Color("#77309A").setOpacity(0.3).get(),
                    borderWidth: 0
                }, { // Track for Stand
                    outerRadius: '37%',
                    innerRadius: '16%',
                    backgroundColor: Highcharts.Color("#C0504D").setOpacity(0.3).get(),
                    borderWidth: 0
                }
                    , { // Track for Stand
                        outerRadius: '15%',
                        innerRadius: '0%',
                        backgroundColor: Highcharts.Color("#848484").setOpacity(0.3).get(),
                        borderWidth: 0
                    }]
            },

            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: []
            },

            plotOptions: {
                solidgauge: {
                    borderWidth: '14px',
                    dataLabels: {
                        enabled: false
                    },
                    linecap: 'round',
                    stickyTracking: false
                }
            },

            series: [{
                name: 'Aptos',
                borderColor: "#9BBB59",
                data: [{
                    color: "#9BBB59",
                    radius: '100%',
                    innerRadius: '100%',
                    y: 100 * numTrabajadoresAptos / numTrabajadoresActivos
                }]
            }, {
                name: 'Con restricciones',
                borderColor: "#F79646",
                data: [{
                    color: "#F79646",
                    radius: '75%',
                    innerRadius: '75%',
                    y: 100 * numTrabajadoresRestricciones / numTrabajadoresActivos
                }]
            }, {
                name: 'Observados',
                borderColor: "#77309A",
                data: [{
                    color: "#77309A",
                    radius: '50%',
                    innerRadius: '50%',
                    y: 100 * numTrabajadoresObservados / numTrabajadoresActivos
                }]
            }, {
                name: 'No aptos ',
                borderColor: "#C0504D",
                data: [{
                    color: "#C0504D",
                    radius: '25%',
                    innerRadius: '25%',
                    y: 100 * numTrabajadoresNoAptos / numTrabajadoresActivos
                }]
            }, {
                name: 'No evaluados ',
                borderColor: "#848484",
                data: [{
                    color: "#848484",
                    radius: '12%',
                    innerRadius: '12%',
                    y: 100 * numTrabajadoresNoEvaluados / numTrabajadoresActivos
                }]
            }]
        }

        /**
         * In the chart load callback, add icons on top of the circular shapes
         */
    );


}

function crearPiramideSubGrafico(divId) {
    var a = 3;
    $('#' + divId).highcharts({
        chart: {
            type: 'pyramid'
        },
        title: {
            text: '',
            x: -50
        },
        tooltip: {
            style: {
                fontSize: '24px'
            },
            headerFormat: '<span style="font-size: 20px">{point.key}</span><br/>'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false,
                    format: '<b style="font-size:14px">{point.name}</b> ({point.y:,.0f})',
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    softConnector: true
                }
            },
            center: ['50%', '50%'],
            width: '100%'
        },
        legend: {
            enabled: false
        },

        series: [{
            name: '#', colors: [
//Highcharts.Color("#C0504D").brighten((a- 1) / 7).get(),
                Highcharts.Color("#C0504D").brighten((a - 2) / 7).get(),
                Highcharts.Color("#C0504D").brighten((a - 4) / 7).get(),
                Highcharts.Color("#C0504D").brighten((a - 5) / 7).get(),
                Highcharts.Color("#C0504D").brighten((a - 7) / 7).get()],
            data: [
                // ['A/C subestándar',eventosInseguros       ],
                ['Incidentes', numIncidentes],
                ['Accidentes Leves', numAccidentesLeves],
                ['Accidentes Incapacitantes', numAccidentesInc],
                ['Accidentes Fatales', numAccidentesFatales]

            ]
        }]
    });


}

function crearGraficoBarraLineaDual(divId) {
    $('#' + divId).highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: [{
            categories: ['0 form.', '1 form.', '2 form.', '3 form.', '4+ form.'],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} h',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Horas Capacitadas',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: '# Trabajadores',
                style: {
                    color: "#4F81BD"
                }
            },
            labels: {
                format: '{value} ',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            headerFormat: "",
            style: {
                fontSize: '23px'
            },
            shared: true
        },
        legend: {
            enabled: false,
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [

            {
                name: 'Horas	', zIndex: 7,
                color: "#4F81BD",
                type: 'spline',
                data: [0, horasForm1, horasForm2, horasForm3, horasForm4plus],
                tooltip: {
                    valueSuffix: ' h '
                }
            },
            {
                name: 'Trabajadores', zIndex: 6,
                type: 'column',
                color: "#9BBB59",
                yAxis: 1,
                data: [form0, form1, form2, form3, form4plus],
                tooltip: {
                    valueSuffix: ' '
                }

            }]
    });


}

function llamarProyeccionIndicadores() {

    var dataParam = {
        companyId: sessionStorage.getItem("gestopcompanyid")
    };

    callAjaxPost(URL + '/empresa/proyeccion/trabajadores', dataParam, procesarProyeccionIndicadores, function () {

        $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img>Trayendo indicadores...'});

    });


}


var puestoBuscar;
var areasBuscar;
var divisionesBuscar;
var unidadesBuscar;

function procesarProyeccionIndicadores(data) {

    $.unblockUI();
    cambiarAcordeNivel();
    $("#slcNivel").on("click", function (e) {
        cambiarAcordeNivel();
    });
    if (data.CODE_RESPONSE == "05") {
        $("#modalProyeccion").modal("show");


        puestoBuscar = data.puestoBuscar;
        areasBuscar = data.areasBuscar;
        divisionesBuscar = data.divisionesBuscar;
        unidadesBuscar = data.unidadesBuscar;

        hallarProyeccion();

    } else {
        console.log("Se produjo un error al proyectar")
    }

}

var totalIndicadoresRango = [];
var arrayInversionesTotal = [];

function hallarProyeccion() {
    $("#divProyeccion").show();
    $("#graficoProyeccion").hide();
    $("#btnClipTablaProyeccion").show();

    $("#tblProyeccion thead tr").remove();
    $("#tblProyeccion tbody tr").remove();

    var hModalAux = $(window).height() * 0.55;
    $("#divProyeccion").css(
        {
            "height": hModalAux + "px",
            "overflow-x": "auto",
            "overflow-y": "auto"
        }
    );
    totalIndicadoresRango = [];
    arrayInversionesTotal = [];
    var tipoProyeccion = $("#slcTipoProy").val();
    switch (parseInt(tipoProyeccion)) {
        case 1:
            hallarProyeccionFormacion();
            break;
        case 2:
            hallarProyeccionExamen();
            break;
        case 3:
            hallarProyeccionEpp();
            break;
    }

}

function hallarProyeccionFormacion() {
    var rangoFechas = hallarFechasProyeccion();
    for (var index = 0; index < proyeccionCapacitacion.length; index++) {
        if (proyeccionCapacitacion[index].puesto.matrixId == unidadSeleccionadaId ||
            proyeccionCapacitacion[index].puesto.divisionId == divisionSeleccionadaId ||
            proyeccionCapacitacion[index].puesto.areaId == areaSeleccionadaId ||
            proyeccionCapacitacion[index].puesto.positionId == puestoSeleccionadaId ||
            proyeccionCapacitacion[index].trabajadorId == trabajadorSeleccionadaId ||
            empresaSeleccionada
        ) {
            var indicadoresTrab = [];
            var arrayInversionPrograms = [];
            var textoIndTrab = "";

            rangoFechas.forEach(function (val, ind) {
                var fechaAux = val.split("-");
                var primerDia = new Date(fechaAux[0], fechaAux[1] - 1, 1);
                var ultimoDia = new Date(fechaAux[0], fechaAux[1], 0);
                var arrayInversionRango = [];

                primerDia = convertirFechaNormal2(primerDia);
                ultimoDia = convertirFechaNormal2(ultimoDia);
                var capacitacionesTrab = proyeccionCapacitacion[index].caps;
                var indicadorRangoActual = 1;
                for (var index2 = 0; index2 < capacitacionesTrab.length; index2++) {
                    if (index2 == 0) {
                        indicadorRangoActual = 0
                    }
                    var programs = capacitacionesTrab[index2].programsCap;

                    for (var index3 = 0; index3 < programs.length; index3++) {
                        if (programs[index3].fechaPlaTexto == null) {
                            programs[index3].fechaPlaTexto = primerDia;
                        }
                        ;
                        if (programs[index3].fechaRealTexto == null) {
                            programs[index3].fechaRealTexto = programs[index3].fechaPlaTexto;
                        }
                        var enRangoInicial = fechaEnRango(primerDia, programs[index3].fechaPlaTexto, programs[index3].fechaRealTexto);
                        var enRangoFinal = fechaEnRango(ultimoDia, programs[index3].fechaPlaTexto, programs[index3].fechaRealTexto);
                        var boolEntreFechas = false;
                        var realizadaEnRango = fechaEnRango(programs[index3].fechaPlaTexto, primerDia, ultimoDia);

                        if (realizadaEnRango) {
                            arrayInversionRango.push({
                                inversion: programs[index3].inversionProgramacionCap,
                                eventoId: programs[index3].programacionCapId
                            });
                        }
                        if (enRangoInicial || enRangoFinal) {
                            boolEntreFechas = true;

                        }
                        if (programs[index3].tipoNotaTrabId == 1 && boolEntreFechas) {
                            indicadorRangoActual =
                                indicadorRangoActual + (1 / capacitacionesTrab.length);
                            index3 = programs.length;
                        }
                    }


                }
                arrayInversionPrograms.push(arrayInversionRango);
                indicadoresTrab.push(indicadorRangoActual.toFixed(3));
                textoIndTrab = textoIndTrab + "<td>" + indicadorRangoActual.toFixed(3) + "</td>"
            });

            totalIndicadoresRango.push(indicadoresTrab);
            arrayInversionesTotal.push(arrayInversionPrograms);
            $("#tblProyeccion tbody").append("<tr>" +
                "<td>" + proyeccionCapacitacion[index].trabajadorNombre +
                "</td>" + textoIndTrab +
                "</tr>");
        }
    }
    $("#tblProyeccion thead").append("<tr >" +
        "<td class='tb-acc'>Trabajador</td>" +
        "</tr>");
    var arrayProyeccionIndicadores = [];
    for (var index1 = 0; index1 < rangoFechas.length; index1++) {
        var fecha = rangoFechas[index1];
        $("#tblProyeccion thead tr").append(
            "<td class='tb-acc'>" + fecha +
            "</td>");
        var indicadorUnRango = 0;
        for (var inddd = 0; inddd < totalIndicadoresRango.length; inddd++) {
            indicadorUnRango = indicadorUnRango + parseFloat(totalIndicadoresRango[inddd][index1])
        }

        arrayProyeccionIndicadores.push(indicadorUnRango / totalIndicadoresRango.length);
    }
    ;
    var textoResumen = "<tr><td>Promedio</td>";
    arrayProyeccionIndicadores.forEach(function (val, ind) {
        textoResumen = textoResumen + "<td>" + val.toFixed(3) + "</td>"
    });
    textoResumen = textoResumen + "</tr>"
    $("#tblProyeccion tbody").prepend(
        textoResumen);

}


function hallarProyeccionExamen() {
    var rangoFechas = hallarFechasProyeccion();
    for (var index = 0; index < proyeccionMedica.length; index++) {
        if (proyeccionMedica[index].puesto.matrixId == unidadSeleccionadaId ||
            proyeccionMedica[index].puesto.divisionId == divisionSeleccionadaId ||
            proyeccionMedica[index].puesto.areaId == areaSeleccionadaId ||
            proyeccionMedica[index].puesto.positionId == puestoSeleccionadaId ||
            proyeccionMedica[index].trabajadorId == trabajadorSeleccionadaId ||
            empresaSeleccionada
        ) {
            var indicadoresTrab = [];
            var arrayInversionPrograms = [];
            var textoIndTrab = "";
            rangoFechas.forEach(function (val, ind) {
                var fechaAux = val.split("-");
                var primerDia = new Date(fechaAux[0], fechaAux[1] - 1, 1);
                var ultimoDia = new Date(fechaAux[0], fechaAux[1], 0);

                var arrayInversionRango = [];

                primerDia = convertirFechaNormal2(primerDia);
                ultimoDia = convertirFechaNormal2(ultimoDia);
                var examsTrab = proyeccionMedica[index].exams;
                var indicadorRangoActual = 0;
                for (var index2 = 0; index2 < examsTrab.length; index2++) {
                    if (index2 == 0) {
                        indicadorRangoActual = 0
                    }
                    var programs = examsTrab[index2].programsExams;

                    for (var index3 = 0; index3 < programs.length; index3++) {
                        if (programs[index3].fechaInicialTexto == null) {
                            programs[index3].fechaInicialTexto = primerDia;
                        }
                        ;
                        if (programs[index3].fechaFinTexto == null) {
                            programs[index3].fechaFinTexto = programs[index3].fechaInicialTexto;
                        }
                        var enRangoInicial = fechaEnRango(primerDia, programs[index3].fechaInicialTexto, programs[index3].fechaFinTexto)
                        var enRangoFinal = fechaEnRango(ultimoDia, programs[index3].fechaInicialTexto, programs[index3].fechaFinTexto)
                        var boolEntreFechas = false;
                        var realizadaEnRango = fechaEnRango(programs[index3].fechaInicialTexto, primerDia, ultimoDia);

                        if (realizadaEnRango) {
                            arrayInversionRango.push({
                                inversion: programs[index3].inversionProgExam,
                                eventoId: programs[index3].programaTipExId
                            });
                        }
                        if (enRangoInicial || enRangoFinal) {
                            boolEntreFechas = true;
                        }
                        if (programs[index3].tipoNotaTrabId == 1 && boolEntreFechas) {
                            indicadorRangoActual = 1;
                            index3 = programs.length;
                            index2 = examsTrab.length;
                        }
                    }


                }

                arrayInversionPrograms.push(arrayInversionRango);
                indicadoresTrab.push(indicadorRangoActual);
                textoIndTrab = textoIndTrab + "<td>" +
                    (indicadorRangoActual == 1 ? "<i class='fa fa-check' aria-hidden='true'></i>" : "<i class='fa fa-times' aria-hidden='true'></i>") +
                    "</td>"
            });
            arrayInversionesTotal.push(arrayInversionPrograms);
            totalIndicadoresRango.push(indicadoresTrab);
            $("#tblProyeccion tbody").append("<tr>" +
                "<td>" + proyeccionMedica[index].trabajadorNombre +
                "</td>" + textoIndTrab +
                "</tr>");


        }
    }
    $("#tblProyeccion thead").append("<tr >" +
        "<td class='tb-acc'>Trabajador</td>" +
        "</tr>");
    var arrayProyeccionIndicadores = [];
    for (var index1 = 0; index1 < rangoFechas.length; index1++) {
        var fecha = rangoFechas[index1];
        $("#tblProyeccion thead tr").append(
            "<td class='tb-acc'>" + fecha +
            "</td>");
        var indicadorUnRango = 0;
        for (var inddd = 0; inddd < totalIndicadoresRango.length; inddd++) {
            indicadorUnRango = indicadorUnRango + parseFloat(totalIndicadoresRango[inddd][index1])
        }

        arrayProyeccionIndicadores.push(indicadorUnRango / totalIndicadoresRango.length);
    }
    ;
    var textoResumen = "<tr><td>Promedio</td>";
    arrayProyeccionIndicadores.forEach(function (val, ind) {
        textoResumen = textoResumen + "<td>" + val.toFixed(3) + "</td>"
    });
    textoResumen = textoResumen + "</tr>"
    $("#tblProyeccion tbody").prepend(
        textoResumen);
}


function hallarProyeccionEpp() {
    var rangoFechas = hallarFechasProyeccion();
    for (var index = 0; index < proyeccionEpp.length; index++) {
        if (proyeccionEpp[index].puesto.matrixId == unidadSeleccionadaId ||
            proyeccionEpp[index].puesto.divisionId == divisionSeleccionadaId ||
            proyeccionEpp[index].puesto.areaId == areaSeleccionadaId ||
            proyeccionEpp[index].puesto.positionId == puestoSeleccionadaId ||
            proyeccionEpp[index].trabajadorId == trabajadorSeleccionadaId ||
            empresaSeleccionada
        ) {
            var indicadoresTrab = [];
            var arrayInversionPrograms = [];
            var textoIndTrab = "";
            rangoFechas.forEach(function (val, ind) {
                var fechaAux = val.split("-");
                var primerDia = new Date(fechaAux[0], fechaAux[1] - 1, 1);
                var ultimoDia = new Date(fechaAux[0], fechaAux[1], 0);
                var arrayInversionRango = [];

                primerDia = convertirFechaNormal2(primerDia);
                ultimoDia = convertirFechaNormal2(ultimoDia);
                var eppsTrab = proyeccionEpp[index].epps;
                var indicadorRangoActual = 1;
                for (var index2 = 0; index2 < eppsTrab.length; index2++) {
                    if (index2 == 0) {
                        indicadorRangoActual = 0
                    }
                    var programs = eppsTrab[index2].programsEpp;

                    for (var index3 = 0; index3 < programs.length; index3++) {
                        if (programs[index3].fechaPlanificadaTexto == null) {
                            programs[index3].fechaPlanificadaTexto = primerDia;
                        }
                        ;
                        if (programs[index3].fechaEntregaTexto == null) {
                            programs[index3].fechaEntregaTexto = programs[index3].fechaPlanificadaTexto;
                        }
                        var enRangoInicial = fechaEnRango(primerDia, programs[index3].fechaPlanificadaTexto, programs[index3].fechaEntregaTexto)
                        var enRangoFinal = fechaEnRango(ultimoDia, programs[index3].fechaPlanificadaTexto, programs[index3].fechaEntregaTexto)
                        var boolEntreFechas = false;
                        var realizadaEnRango = fechaEnRango(programs[index3].fechaPlanificadaTexto, primerDia, ultimoDia);

                        if (realizadaEnRango) {
                            arrayInversionRango.push({
                                inversion: programs[index3].inversionEntregaEpp,
                                eventoId: programs[index3].entregaEppId
                            });
                        }
                        if (enRangoInicial || enRangoFinal) {
                            boolEntreFechas = true;
                        }
                        if (programs[index3].tipoNotaTrabId != null && boolEntreFechas) {
                            indicadorRangoActual =
                                indicadorRangoActual + (1 / eppsTrab.length);
                            index3 = programs.length;
                        }
                    }


                }
                arrayInversionPrograms.push(arrayInversionRango);
                indicadoresTrab.push(indicadorRangoActual.toFixed(3));
                textoIndTrab = textoIndTrab + "<td>" + indicadorRangoActual.toFixed(3) + "</td>"
            });

            totalIndicadoresRango.push(indicadoresTrab);
            arrayInversionesTotal.push(arrayInversionPrograms);
            $("#tblProyeccion tbody").append("<tr>" +
                "<td>" + proyeccionEpp[index].trabajadorNombre +
                "</td>" + textoIndTrab +
                "</tr>");
        }
    }
    $("#tblProyeccion thead").append("<tr >" +
        "<td class='tb-acc'>Trabajador</td>" +
        "</tr>");
    var arrayProyeccionIndicadores = [];
    for (var index1 = 0; index1 < rangoFechas.length; index1++) {
        var fecha = rangoFechas[index1];
        $("#tblProyeccion thead tr").append(
            "<td class='tb-acc'>" + fecha +
            "</td>");
        var indicadorUnRango = 0;
        for (var inddd = 0; inddd < totalIndicadoresRango.length; inddd++) {
            indicadorUnRango = indicadorUnRango + parseFloat(totalIndicadoresRango[inddd][index1])
        }

        arrayProyeccionIndicadores.push(indicadorUnRango / totalIndicadoresRango.length);
    }
    ;
    var textoResumen = "<tr><td>Promedio</td>";
    arrayProyeccionIndicadores.forEach(function (val, ind) {
        textoResumen = textoResumen + "<td>" + val.toFixed(3) + "</td>"
    });
    textoResumen = textoResumen + "</tr>"
    $("#tblProyeccion tbody").prepend(
        textoResumen);
}


function hallarFechasProyeccion() {
    var fechaInicio = $("#fechaInicioProy").val();
    var fechaFin = $("#fechaFinProy").val();
    var fecha1 = fechaInicio.split('-');
    var fecha2 = fechaFin.split('-');
    var difanio = fecha2[0] - fecha1[0] + 1;
    var difDias = restaFechas(fechaInicio, fechaFin);
    var listfecha = [];


    for (index = 0; index < difanio; index++) {
        var anioaux = parseInt(index) + parseInt(fecha1[0]);

        if (difanio > 1) {
            if (index == 0) {
                for (index1 = 0; index1 < 12 - fecha1[1] + 1; index1++) {

                    var mesaux = parseInt(index1) + parseInt(fecha1[1]);
                    listfecha.push(anioaux + "-" + (('' + mesaux).length < 2 ? '0' : '') + mesaux);
                }
            }
            if (index == difanio - 1) {
                for (index4 = 0; index4 < parseInt(fecha2[1]); index4++) {
                    var mesaux3 = parseInt(index4) + parseInt("1");
                    listfecha.push(anioaux + "-" + (('' + mesaux3).length < 2 ? '0' : '') + mesaux3);
                }
            }

            if (index > 0 && index < difanio - 1) {

                for (index3 = 0; index3 < 12; index3++) {
                    var mesaux2 = parseInt(index3) + 1;
                    listfecha.push(anioaux + "-" + (('' + mesaux2).length < 2 ? '0' : '') + mesaux2);
                }


            }

        } else {
            for (index5 = 0; index5 < fecha2[1] - fecha1[1] + 1; index5++) {

                var mesaux4 = parseInt(index5) + parseInt(fecha1[1]);
                listfecha.push(anioaux + "-" + (('' + mesaux4).length < 2 ? '0' : '') + mesaux4);
            }

        }


    }
    ;


    return listfecha;

}


function generarGraficoProyeccion() {
    $("#btnClipTablaProyeccion").hide();

    var tipoProyeccion = $("#slcTipoProy").val();
    totalIndicadoresRango = [];
    arrayInversionesTotal = [];
    var tituloGrafico = "";
    var nombreIndicador = "";
    switch (parseInt(tipoProyeccion)) {
        case 1:
            tituloGrafico = "Proyeccion vigencia de formación";
            nombreIndicador = "Indicador de formación"
            hallarProyeccionFormacion();
            break;
        case 2:
            tituloGrafico = "Proyeccion vigencia de examen médico";
            nombreIndicador = "Indicador de examen"

            hallarProyeccionExamen();
            break;
        case 3:
            tituloGrafico = "Proyeccion vigencia de EPP´s";
            nombreIndicador = "Indicador de vigencia EPP"

            hallarProyeccionEpp();
            break;
    }
    var rangoFechas = hallarFechasProyeccion();

    $("#divProyeccion").hide();
    $("#graficoProyeccion").show();
    var arrayMetaIndicador = [];
    var arrayProyeccionIndicadores = [];
    var arrayInversionesUnicas = [];
    var arrayAuxEventosId = [];
    rangoFechas.forEach(function (val, pos) {
        arrayMetaIndicador.push(globalFormacionMeta);
        var indicadorUnRango = 0;
        var inversionUnRango = 0;
        for (var inddd = 0; inddd < totalIndicadoresRango.length; inddd++) {
            indicadorUnRango = indicadorUnRango + parseFloat(totalIndicadoresRango[inddd][pos])
        }

        for (var i = 0; i < arrayInversionesTotal.length; i++) {
            var programsRango = arrayInversionesTotal[i][pos];

            programsRango.forEach(function (val, index) {
                if (arrayAuxEventosId.indexOf(val.eventoId) == -1) {
                    arrayAuxEventosId.push(val.eventoId);
                    inversionUnRango = inversionUnRango + val.inversion;
                }
            });
        }
        arrayInversionesUnicas.push(inversionUnRango);
        arrayProyeccionIndicadores.push(indicadorUnRango / totalIndicadoresRango.length);
    });

    var colorFuente = "black";
    var fechaInicialAux = $("#fechaInicioProy").val().split("-");
    Math.easeOutBounce = function (pos) {
        if ((pos) < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        }
        if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        }
        if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        }
        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
    };
    $('#graficoProyeccion').highcharts({
        chart: {
            backgroundColor: '#ededed',
            type: "area",
            zoomType: 'x'
        },
        title: {
            style: {
                color: colorFuente,
                fontSize: '18px'
            },
            text: tituloGrafico
        },

        xAxis: {
            type: "datetime",
            crosshair: true,
            labels: {
                style: {
                    color: colorFuente,
                    fontSize: '12px'
                }
            }
        },
        yAxis: [{

            max: 1,
            title: {
                text: 'Indicador',
                style: {
                    color: "#207ce5",
                    fontSize: '13px', fontWeight: 'bold'
                }
            },
            labels: {
                formatter: function () {
                    return this.value;
                },
                style: {
                    color: "#207ce5",
                    fontSize: '13px', fontWeight: 'bold'
                }
            }
        }, {

            title: {
                text: 'Inversión',
                style: {
                    color: "#04B486",
                    fontSize: '13px', fontWeight: 'bold'
                }
            },
            labels: {
                format: 'S/ {value}',
                style: {
                    color: "#04B486",
                    fontSize: '13px', fontSize: '12px', fontWeight: 'bold'
                }
            },
            opposite: true
        }],
        tooltip: {
            valueDecimals: 3,
            shared: true
        },
        plotOptions: {
            area: {


                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: nombreIndicador,
            pointStart: Date.UTC(fechaInicialAux[0], fechaInicialAux[1] - 1, fechaInicialAux[2]),
            pointInterval: 30 * 24 * 3600 * 1000,
            data: arrayProyeccionIndicadores, zIndex: 4,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, "#207ce5"],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        }, {
            name: "Meta Indicada",
            pointStart: Date.UTC(fechaInicialAux[0], fechaInicialAux[1] - 1, fechaInicialAux[2]),
            pointInterval: 30 * 24 * 3600 * 1000,
            data: arrayMetaIndicador, zIndex: 5,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0.01
                },
                stops: [
                    [0, Highcharts.getOptions().colors[1]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(-0.9).get('rgba')]
                ]
            }
        }, {
            name: 'Inversión',
            pointStart: Date.UTC(fechaInicialAux[0], fechaInicialAux[1] - 1, fechaInicialAux[2]),
            pointInterval: 30 * 24 * 3600 * 1000,
            animation: {
                duration: 2000,
                easing: 'easeOutBounce'
            },
            type: 'column',
            color: '#04B486',

            yAxis: 1,
            data: arrayInversionesUnicas,
            tooltip: {
                valuePrefix: 'S/ '
            }

        },]
    });

}


function toggleParametros() {
    $("#modalProyeccion form").fadeToggle();
    $("#btnTogleParam i").toggleClass("fa fa-arrow-up fa-2x");
    $("#btnTogleParam i").toggleClass("fa fa-arrow-down fa-2x");
}

var listEventosId = [];

function ocultarFiltroCalendario() {
    $("#modalFiltroCalendario").modal("hide");
}

function verFiltroCalendario() {
    $("#modalFiltroCalendario").modal("show");
}

function crearFiltroCalendario(functionCallBack) {
    var dataParamAux = {};

    callAjaxPost(URL + '/scheduler/eventos/filtro', dataParamAux, function (data) {
        var listTipoEvento = data.listTipoEvento;

        var contenido = "";

        var listContenido = [
            {
                sugerencia: "", anchoLabel: "col-sm-8", anchoDiv: "col-sm-4", inputForm: "",
                label: "<span style='color:blue;font-size:20px;font-weight:bolder;'>*** FECHA REPORTE ***</span>"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "", label: "Inicio",
                inputForm: "<input type='date' id='fechaInicioFiltroCalendario' class='form-control'>"
            },
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "", label: "Fin",
                inputForm: "<input type='date' id='fechaFinFiltroCalendario' class='form-control'>"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
            {sugerencia: "", label: "Actividad", inputForm: "", divContainer: "divFiltroTipoEventoCalendario"},
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
            {
                sugerencia: "", label: "<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                    "onclick='ocultarFiltroCalendario()'>" +
                    "<i class='fa fa-times'></i> Cancelar" +
                    "</button>",
                inputForm: "<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
                    "onclick='valoresFiltroCalendario()'>" +
                    "<i class='fa fa-filter'></i> Aplicar filtro" +
                    "</button>"
            }
        ];

        listContenido.forEach(function (val) {
            contenido += obtenerSubPanelModuloVersionDos(val);
        });

        var modalOptions = {
            id: "modalFiltroCalendario", nombre: "<i class='fa fa-filter'></i> Filtro",
            contenido: "<div class='eventoGeneral'>" + contenido + "</div>"
        };

        crearModalPrincipalUsuario(modalOptions, function () {
            if ($("#filtroTipoEventoCalendario").length > 0) {
                return;
            }

            crearSelectOneMenuObligMultipleCompleto("filtroTipoEventoCalendario", "", listTipoEvento,
                "id", "nombre", "#divFiltroTipoEventoCalendario", "Todos");
        }, true, true);

        var hoy = getSession("fechaHoyOrdenInversoTexto");

        $("#fechaInicioFiltroCalendario").val(sumaFechaDias(-60, hoy));
        $("#fechaFinFiltroCalendario").val(sumaFechaDias(60, hoy));

        functionCallBack();
    });
}

function valoresFiltroCalendario() {
    ocultarFiltroCalendario();

    listEventosId = [];
    var eventoId = $("#filtroTipoEventoCalendario").val();

    if (eventoId != null) {
        eventoId.forEach(function (val) {
            listEventosId.push(parseInt(val));
        });
    }

    cargarScheduler();
}
