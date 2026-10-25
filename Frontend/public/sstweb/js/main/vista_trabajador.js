/**
 *
 */
var contadorRetrasadoAlertEventos = 0;
var contadorRetrasadoAlertActividades = 0;
var trabajadorResultadoId;
var listFullTrabajadores;
var listFullEventos;
var listTrabajadoresAreaFormacion;
var mensajeUx;
var textoBotonToggleContenidoColaborador =
    "<button class='btn btn-success' style='padding:4px 8px 4px 8px' " +
    "onclick='cambiarDivSubContenidoColaborador(this)'>" +
    "<i class='fa fa-caret-down fa-3x' aria-hidden='true'></i>" +
    "</button>";

var textoBotonTogglePregunta =
    "<button class='btn btn-success' onclick='cambiarDivSubPregunta(this)'>" +
    "<i class='fa fa-caret-down fa-2x' aria-hidden='true'></i>" +
    "</button>";

var textoBotonVolverContenidoColaborador =
    "<button class='btn btn-success' style='float:left' onclick='volverDivSubContenidoColaborador(this)'>" +
    "<i class='fa fa-arrow-left fa-4x' aria-hidden='true'></i>" +
    "</button>";

var actualizarPrincipalActSst, inicioInmediatoInspecc;

// lista para cargar formulario de huella de carbono
var listaMesesHc,
    listaAniosHc,
    listaAlcancesHc,
    listaTipoMedicionHc,
    listaFuentesHc,
    listaUnidadesHc,
    listaPaisEmpresaHc,
    listaSedeHc;
var listaFullHuellaCarbonoUser;
var cantHuellasCarbonoUsuario;
var visibleRegistroHuellaCarbono = 0;

// fin de lisata de huella carbono

function volverDivSubContenidoColaborador(obj) {
    $(".divListPrincipal > div").show();
    $("#subListPsicologiaExamen").hide();
    $(".divCursoExamenMovil").hide();
    $(".divSubEvento").hide();

    $("#estadoMovilRegTrabajadorEppInspeccionFin").hide();$("#estadoMovilRegExtintorInspeccionFin").hide();
    $("#estadoMovilRegGabineteIncendioInspeccionFin").hide();

    if (lastHeight > 0) {
        $(window).scrollTop(lastHeight - $("#barraMenu").height() - 60);
        lastHeight = 0;
    }

    if (actualizarPrincipalActSst == 1) {
        $(window).scrollTop(0 - $("#barraMenu").height() - 60);
        traerEventosTrabajador();
    }
}

function cambiarDivSubPregunta(obj) {
    $(obj).parent(".divNombrePregunta").siblings(".divOpcionesGosst").toggle();
}

function cambiarDivSubContenidoColaborador(obj, proyectoId) {
    if (proyectoId != null) {
        proyectoId = parseInt(proyectoId);
        listFullProyectoSeguridad.forEach(function (val, index) {
            if (val.id == proyectoId) {
                proyectoObj = val;
            }
        });
    }
    $(obj).parent(".tituloSubList").siblings(".contenidoSubList").toggle();
}

function verDetalleAccionActo(obj) {
    $(obj).next(".divAccionesSubMovil").toggle();
}

var menuDerechaVistaTrabajador = [
    {
        id: 1,
        icono: "fa-calendar",
        ident: "icoPendientes",
        onclick: "marcarIconoModuloSeleccionado(2)",
        titulo: "Actividades",
        adicional: ""
    },
    {
        id: 2,
        icono: " fa-user-circle",
        ident: "icoPerfil",
        onclick: "marcarIconoModuloSeleccionado(1)",
        titulo: "Perfil",
        adicional: ""
    },
    {
        id: 3,
        icono: " fa-question-circle ",
        ident: "icoPreguntas",
        onclick: "marcarIconoModuloSeleccionado(1)",
        titulo: "Tutorial",
        adicional: ""
    }];
var menuFuncionesIzquierdaTrabajador = [];

function verSeccionRestringida() {
    $(".divListPrincipal")
        .append(
            "<div id='subListCapacitacion'  >" +
            "<div class='tituloSubList' style='background:#e8e6e6'>Sin acceso a esta funcionalidad del módulo.<br> Más información consulte al administrador del sistema</div>" +
            "<div class='contenidoSubList'></div>" +
            "</div>");
};

function marcarIconoModuloSeleccionado(menuId, proyectoId, tipoId, idAux, functionCallBack) {
    //$("#menuExplicativo").hide();
    $(".divContainerGeneral").show();
    $(".divListModulos").find("li").removeClass("activeMenu");
    //$(".divListPrincipal").html("");
    $(".gosst-aviso").remove();

    $(document).scrollTop(0);
    var menuObject = [];

    menuFuncionesIzquierdaTrabajador.forEach(function (val) {
        if (val.id == parseInt(menuId)) {
            menuObject = val;
        }
    });

    switch (menuObject.id) {
        case 16:
            break;

        default:
            $("#menuExplicativo").hide();
            $(".divListPrincipal").html("");
            $(".divTituloFull").find("h4").html(menuObject.nombre)
            break;
    }

    $(".divListModulos #liMenuTrabajador" + menuObject.id).addClass("activeMenu");

    var isPermitido = false;

    listaModulosPermitidos.forEach(function (val, index) {
        var moduloPermitido = parseInt(val.isPermitido);

        if (val.menuOpcionId == menuObject.moduloId && moduloPermitido == 1) {
            isPermitido = true;
        }

        var numerSubModulos = val.subMenus;

        numerSubModulos.forEach(function (val1, index1) {
            var subModuloPermitido = val1.isPermitido;

            if (val1.menuOpcionId == menuObject.moduloId && subModuloPermitido == 1) {
                isPermitido = true;
            }
        });
    });

    if (isPermitido) {
        switch (menuObject.id) {
            case 1:
                $(".divTituloFull").find("h4").html("Perfil");
                habilitarPerfilUsuario();

                break;

            case 2:
                $(".divTituloFull").find("h4").html("Mis Actividades SST");
                filtroTipoEvento(functionCallBack);
//	     traerEventosTrabajador(functionCallBack);
                break;

            case 3:
                $(".divTituloFull").find("h4").html("Mis Eventos SST");
                habilitarEventosTrabajador();
                break;

            case 4:
                $(".divTituloFull").find("h4").html("Mi IPERC");
                habilitarIpercUsuario();
                break;

            case 5:
                $(".divTituloFull").find("h4").html("Mis Objetivos SST");
                habilitarObjetivosUsuario();
                break;

            case 6:
                $(".divTituloFull").find("h4").html("Mi Historial SST");
                habilitarHistorialUsuario();
                break;

            case 7:
                $(".divTituloFull").find("h4").html("Documentos SST");
                $(".prueba").find("h2").html("0");
                habilitarDocumentosUsuario();
                break;

            case 8:
                $(".divTituloFull").find("h4").html("Capacitación Online");
//	     habilitarCapacitacionOnlineUsuario();
                crearFiltroEstadosCapOnlineTrab(valoresFiltroEstadoCapOnlineTrab);
                break;

            case 9:
                $(".divTituloFull").find("h4").html("Evaluaciones Psicolaborales");
                habilitarEvaluacionSicologicaUsuario();
                break;

            case 10:
                $(".divTituloFull").find("h4").html("Reportar A/C Subestándar");
                crearFiltroAcSubestandarTrab(valoresFiltroAcSubestandarTrab);

                break;

            case 11:
                $(".divTituloFull").find("h4").html("Contratistas");
//	     habilitarProyectosContratistaUsuario(proyectoId,tipoId,idAux) ;
                filtroStatusDocumentoProyColaborador(habilitarProyectosContratistaUsuario,
                    proyectoId, tipoId, idAux);
                break;

            case 12:
                $(".divTituloFull").find("h4").html("Comunicados de la empresa");
                habilitarComunicadoTrabajador();
                break;

            case 13:
                $(".divTituloFull").find("h4").html("Accidentes/Incidentes");
                habilitarAccidentesPorEvaluar();
                break;

            case 14:
                $(".divTituloFull").find("h4").html("Vigilancia Médica");
                habilitarVigilnaciaTrabajador();
                break;

            case 15:
                $(".divTituloFull").find("h4").html("Reportar Observaciones Proyectos");
                crearFiltroObservacionesColaborador(valoresFiltroObservacionesColaborador);
                break;

            case 17:

                if (hasSeccionActualCovid != 0 && numDiasAislamiento >= 2) {
                    marcarIconoModuloSeleccionado(21);
                    hasAntecedenteCovid++;
                    break;
                }

                if (hasAccesoCovid == 0) {
                    completarBarraCarga();

                    mensajeUx = "<label>Estimado colaborador(a), en estos momentos, <span style='color:red;'>no tiene acceso a la " +
                        "pestaña COVID-19.</span><br>" +
                        "Le pedimos seguir las indicaciones del médico a cargo del seguimiento de su caso.</label>";
                    mensajesUx(mensajeUx, 8, "");
                    return;
                }

                habilitarAntecedenteCovid();
                break;

            case 18:

                if (hasSeccionActualCovid != 0 && numDiasAislamiento >= 2) {
                    marcarIconoModuloSeleccionado(21);
                    hasAntecedenteCovid++;
                    break;
                }

                if (hasAntecedenteCovid == 0) {
                    marcarIconoModuloSeleccionado(17);
                    hasAntecedenteCovid++;
                    break;
                }

                if (hasAccesoCovid == 0) {
                    completarBarraCarga();

                    mensajeUx = "<label>Estimado colaborador(a), en estos momentos, <span style='color:red;'>no tiene acceso a la " +
                        "pestaña COVID-19.</span><br>" +
                        "Le pedimos seguir las indicaciones del médico a cargo del seguimiento de su caso.</label>";
                    mensajesUx(mensajeUx, 8, "");
                    return;
                }

                $("#modalFiltroFormCovidTrab").remove();
                crearFiltroFormCovidTrab(habilitarFormularioCovid);
                break;

            case 19:

                if (hasSeccionActualCovid != 0 && numDiasAislamiento >= 2) {
                    marcarIconoModuloSeleccionado(21);
                    hasAntecedenteCovid++;
                    break;
                }

                if (hasAntecedenteCovid == 0) {
                    marcarIconoModuloSeleccionado(17);
                    hasAntecedenteCovid++;
                    break;
                }

                if (hasAccesoCovid == 0) {
                    completarBarraCarga();

                    mensajeUx = "<label>Estimado colaborador(a), en estos momentos, <span style='color:red;'>no tiene acceso a la " +
                        "pestaña COVID-19.</span><br>" +
                        "Le pedimos seguir las indicaciones del médico a cargo del seguimiento de su caso.</label>";
                    mensajesUx(mensajeUx, 8, "");
                    return;
                }

                habilitarBitacoraContactoCovid();
                break;

            case 27:
                habilitarHistorialVacunaCovid();
                break;

            case 20:

                if (hasAntecedenteCovid == 0) {
                    marcarIconoModuloSeleccionado(17);
                    hasAntecedenteCovid++;
                    break;
                }

                habilitarResumenTrabajador();
                break;

            case 21:

                $(".divTituloFull").find("h4").html("Comentario - Estado Diario");

                if (hasSeccionActualCovid == 0) {
                    if (hasAntecedenteCovid == 0) {
                        marcarIconoModuloSeleccionado(17);
                        hasAntecedenteCovid++;
                        break;
                    }

                    if (hasAccesoCovid == 0) {
                        completarBarraCarga();

                        mensajeUx = "<label>Estimado colaborador(a), en estos momentos, <span style='color:red;'>no tiene acceso a la " +
                            "pestaña COVID-19.</span><br>" +
                            "Le pedimos seguir las indicaciones del médico a cargo del seguimiento de su caso.</label>";
                        mensajesUx(mensajeUx, 8, "");
                        return;
                    }
                }

                listMensajeSeccionTrabajadorCovid.forEach(function (val) {
                    if (val.seccionTrabajador.id == 21) {
                        mensajeUx = "<label><br>" + val.mensajeInicialBloqueo + "</label>";
                        mensajesUx(mensajeUx, 7, "");
                    }
                });

                habilitarEstadoDiario(hasSeccionActualCovid);
                break;

            case 28:
                if (hasAntecedenteCovid == 0) {
                    marcarIconoModuloSeleccionado(17);
                    hasAntecedenteCovid++;
                    break;
                }

                crearFiltroReunionesVirtualCovid(habilitarReunionVirtualCovid);
                break;

            case 16:

                if (hasSeccionActualCovid != 0 && numDiasAislamiento >= 2) {
                    menuFuncionesIzquierdaTrabajador.forEach(function (val) {
                        if (val.seccionPadreId == menuObject.id) {
                            $(".divListModulos #liMenuTrabajador" + val.id).toggle();
                            $("#menuFigureti #liMenuTrabajador" + val.id).toggle();
                        }
                    });

                    break;
                }

                if (hasAccesoCovid == 0) {
                    mensajeUx = "<label>Estimado colaborador(a), en estos momentos, <span style='color:red;'>no tiene acceso a la " +
                        "pestaña COVID-19.</span><br>" +
                        "Le pedimos seguir las indicaciones del médico a cargo del seguimiento de su caso.</label>";
                    mensajesUx(mensajeUx, 8, "");
                    return;
                }

                menuFuncionesIzquierdaTrabajador.forEach(function (val) {
                    if (val.seccionPadreId == menuObject.id) {
                        $(".divListModulos #liMenuTrabajador" + val.id).toggle();
                        $("#menuFigureti #liMenuTrabajador" + val.id).toggle();
                    }
                });
                break;
            ////////////autor: (AntoniTito5)  Tema:  Registro de horas
            /*
	 case 27:
	     habilitarTrabajoHombresColaborador();

	     break;*/
            ////////////Fin5 Registro de horas

            case 29:
                //$(".divTituloFull").find("h4").html("Participación y Consulta");
                habilitarEleccionesVirtuales();
                break;

            case 30:
                habilitarHomologacionContratista();
                break;

            case 31:
                $(".divTituloFull").find("h4").html("Huella de dddCarbono");
                seccionHuellaCarbono();

                break;

            case 32:
                crearFiltroTrabajadorInformacion(valoresFiltroTrabajadorInformacion);

                break;

            case 33:
                // seccionAccidenteNuevo();
                crearFiltroAccidentesSsoma(valoresFiltroAccidentesSsoma);

                break;

            case 34:
                crearFiltroInspeccionV2(valoresFiltroInspeccionV2);

                break;

            case 35:
                $(".divTituloFull").find("h4").html("Academia Virtual");
                seccionAcademiaVirtual();

                break;
        }

        completarBarraCarga();
    } else {
        verSeccionRestringida();
        completarBarraCarga();
    }

    if (hasAntecedenteCovid == 1) {
        $(".divTituloFull").find("h4").html("Antecedente Médico");
        hasAntecedenteCovid++;
    } else if (hasSeccionActualCovid >= 1) {
        $(".divTituloFull").find("h4").html("Comentario - Estado Diario");
    } else {
        $(".divTituloFull").find("h4").html(menuObject.nombre);
    }
}

var puestoTrabajoNombre = "";
var areaNombreAux = "";
var numComiteCsst = 0;
var numAreasResponsable = 0;
var numAreasSupervisor = 0;
var numAreasJefe = 0;
var numAreasGerente = 0;
var hasAccesoCovid = 0;
var hasAntecedenteCovid = 0;
var hasSeccionActualCovid = 0;
var numDiasAislamiento = 0;
var listMensajeSeccionTrabajadorCovid = [];
var numSeccionInteresadaAC = 0;
var seccionCapacitacionOnline;

function verLateralesFijos() {
    if (parseInt(getSession("gestopcompanyid")) != 647) {
        $("#menuPrincipal")
            .html("<h5> &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;" +
                "Tu Gestor Online de Seguridad y Salud en el Trabajo te da la Bienvenida</h5>")
            .css({color: "white"});
    }

    $(".navbar").css({"min-height": "48px", "margin-bottom": "0px", "top": "0px"});

    var logo = $("#logoMenu");

    logo.css({"background-color": "#2e9e8f", "margin-top": "-18px"})
        .attr("onclick", "volverMenuInicio()");

    $("#barraMenu").css({
        "position": "fixed",
        "width": "100%"
    });

    $("#barraMenu").find(".navbar-right").html("<ul></ul> ");

    menuDerechaVistaTrabajador.forEach(function (val, index) {
        var claseSub = "class='iconoLink dropdown-toggle' data-toggle='dropdown'";

        if (val.ident != "icoPerfil") {
            claseSub = "class='iconoLink'";
        } else {
            val.adicional = getSession("gestopusername").substr(0, 12) + ".";
            val.onclick = "";
        }

        $("#barraMenu").find(".navbar-right")
            .append("" + "<li id='" + val.ident + "' title='" + val.titulo + "'>" +
                "<a onclick='" + val.onclick + "'" + claseSub + ">" +
                "<i class='fa " + val.icono + " fa-2x' aria-hidden='true'>" +
                "</i> " + val.adicional +
                "</a>" +
                "</li>" + "")
    });

    $("#icoPerfil").append("<ul class='dropdown-menu' style='color:white'>" +
            "<li onclick='marcarIconoModuloSeleccionado(1)'><a><i class='fa fa-user-o'></i> Perfil</a></li>" +
             // (parseInt(getSession("isAzure")) == 1?"":"<li onclick='marcarIconoModuloSeleccionado(1)'><a><i class='fa fa-exchange'></i> Cambiar Contraseña</a></li>") +
             (parseInt(getSession("cambioUsuarioDirecto")) == 0?"":"<li onclick='verCambioUsuarioDirecto()'><a><i class='fa fa-exchange'></i> Cambiar de vista</a></li>") +
            "<li class='dropdown-divider' role='presentation'></li>" +
            "<li onclick='cerrarSesionVistaColaborador()'> <a> <i class='fa fa-power-off ' aria-hidden='true'></i>Salir</a></li>" +
        "</ul>" +
        "</div>");

    $(".buscadorGosst").css({
        "margin-top": "8px",
        "border-radius": "21px", "color": "black",
        "background-color": "#ffffff"
    });

    $("body").find("table").remove();
    $("body").find("#divCompletarActividad").remove();
    $("body").find("h4").remove();
    $("body").find(".divTituloFull").remove();
    $("body").find(".divContainerGeneral").remove();

    $("body")
        .append("" + "<div class='divTituloFull'><div class='divTituloGeneral'><h4>Mis Actividades SST</h4></div></div>" +

            ////////////autor: (AntoniTito4)  Tema: Contador de documentos de procedimiento de seguridad.
            //   "<div  class='divTituloFull'> <div class='prueba divTituloGeneral'><h2  id='counting'  ></h2> </div> <div class='divTituloGeneral'> <h2>-----</h2></div><div class='prueba1 divTituloGeneral'>  <h2  id='counting2'  ></h2> </div> </div>"+
            ////////////Fin4 Contador de documentos de procedimiento de seguridad.
            "<div class='divContainerGeneral'>" + "" +
            "<div class='divListModulos'><ul class='list-group'></ul></div>" +
            "<div class='divListPrincipal'></div>" +
            "<div class='divListSecundaria'>" +
            "<div id='divObjetivos' style='height:120px'>" +
            "<div class='subDivTitulo'>Objetivos</div>" +
            "<div class='subDivContenido'></div>" +
            "</div>" +
            "<div id='divNoticiaDiaria' style='height:250px'>" +
            "<div class='subDivTitulo'>Noticia del día </div><div class='subDivContenido'></div>" +
            "</div>" +
            "<div id='divPiramide'>" +
            "<div class='subDivTitulo'>Accidentabilidad </div><div class='subDivContenido'></div>" +
            "</div>" + "" +
            "</div>" +
            "</div>");

    //Noticia
    var noticia = "<div class='cropGosst'><img src='../imagenes/logo-tecsup.png'></div>"
    var encabezado = "Tecsup mejora la cultura de seguridad usando GOSST"
    var linkVerNoticia = "<a> Ver Más</a>"

    $("#divNoticiaDiaria").find(".subDivContenido").html(noticia + encabezado + linkVerNoticia);
    $("#divNoticiaDiaria").hide();

    $("#divObjetivos").hide();
    $("#divPiramide").hide();

    seccionCapacitacionOnline = 0;
    //
    var dataParamAux = {
        mdfId: getSession("unidadGosstId"),
        empresaId: getSession("gestopcompanyid"),
        trabajadorId: parseInt(getSession("trabajadorGosstId"))
    };

    callAjaxPost(URL + '/trabajador/indicador/solo', dataParamAux, function (data) {
        var wantsObjetivos = data.list[0].wantsObjetivos;
        var wantsAccidentabilidad = data.list[0].wantsAccidentabilidad;
        var firmaAceptaPrivacidad = data.list[0].firmaAceptaPrivacidad;
        firmaAceptaPrivacidad = false;

        if (firmaAceptaPrivacidad) {
            var contenido = "";
            var listContenido = [
                {
                    sugerencia: "", label: "Documento privacidad 1",
                    inputForm: "<a href='../documentos/terminos.pdf' target='_blank' class='efectoLink'>" +
                        "<i class='fa fa-eye'></i> Ver" +
                        "</a>", divContainer: ""
                },
                {
                    sugerencia: "", label: "Documento privacidad 2",
                    inputForm: "<a href='../documentos/terminos.pdf' target='_blank' class='efectoLink'>" +
                        "<i class='fa fa-eye'></i> Ver" +
                        "</a>", divContainer: ""
                },
                {
                    lineaFull: 1,
                    sugerencia: "",
                    label: "",
                    inputForm: "<input type='checkbox'> He leído y acepto los <br>términos y condiciones",
                    divContainer: ""
                },
                {
                    sugerencia: "", label: " ", lineaFull: 1,
                    inputForm: "<button class='btn btn-success' type='button' onclick='asdasd()'>" +
                        "<i class='fa fa-check'></i>Acepto" +
                        "</button>"
                }
            ];

            listContenido.forEach(function (val) {
                contenido += obtenerSubPanelModuloGeneral(val);
            });

            var modalOptions = {
                id: "modalFirmaAcepta",
                nombre: "Términos de privacidad",
                contenido: contenido
            };

            crearModalPrincipalUsuario(modalOptions, function () {
            }, true, true);
            completarBarraCarga();
            return;
        }

        numComiteCsst = data.list[0].numComiteCsst;
        puestoTrabajoNombre = data.list[0].puesto.positionName
        areaNombreAux = data.list[0].puesto.areaName;
        numAreasResponsable = data.list[0].numAreasResponsable;
        numAreasSupervisor = data.list[0].numAreasSupervisor;
        numAreasJefe = data.list[0].numAreasJefe;
        numAreasGerente = data.list[0].numAreasGerente;
        menuFuncionesIzquierdaTrabajador = data.secciones;

        hasAccesoCovid = data.trabajadorCovid.hasAccesoCovid;
        numDiasAislamiento = data.trabajadorCovid.numDiasAislamiento;
        numSeccionInteresadaAC = data.list[0].numSeccionInteresadaAC;

        listMensajeSeccionTrabajadorCovid = data.listMensaje;
        $("#menuFigureti").html("<ul class='list-group'></ul>");

        if (parseInt(getSession("gestopcompanyid")) == 616) {
            menuFuncionesIzquierdaTrabajador.forEach(function (val) {
                if (val.id == 7) {
                    val.nombre = "Documentos";
                } else if (val.id == 12) {
                    val.nombre = "Comunicados";
                }
            });
        }

        menuFuncionesIzquierdaTrabajador.forEach(function (val) {
            var textOpcionMenu =
                "<li class='list-group-item' id='liMenuTrabajador" + val.id + "' onclick='marcarIconoModuloSeleccionado(" + val.id + ")'>" +
                "<i class='fa " + val.icono + "' style='width:16px;' aria-hidden='true'></i> " + val.nombre +
                (val.numAlerta > 0 || val.id == 2 ?
                    "<div class='alertaMenu'><i class='fa fa-exclamation-circle' style='color:#D1D619;'></i></div>" : "") +
                "</li>";


            if (val.id != 32 || (val.id == 32 && (numAreasSupervisor > 0 || numAreasJefe > 0 || numAreasGerente > 0))) {
                $(".divListModulos").find("ul").append(textOpcionMenu);
                $("#menuFigureti").find("ul").append(textOpcionMenu);
            }

            if (val.id == 16) {
                $(".divListModulos #liMenuTrabajador" + val.id).append("<i class='fa fa-plus-circle'></i>");
                $("#menuFigureti #liMenuTrabajador" + val.id).append("<i class='fa fa-plus-circle'></i>");

                $(".divListModulos #liMenuTrabajador" + val.id).addClass("subMenuImportant").show();
                $("#menuFigureti #liMenuTrabajador" + val.id).addClass("subMenuImportant").show();
            }

            if (val.seccionPadreId > 0) {
                $(".divListModulos #liMenuTrabajador" + val.id).remove();
                $("#menuFigureti #liMenuTrabajador" + val.id).remove();

                $(".divListModulos #liMenuTrabajador" + val.seccionPadreId).after(textOpcionMenu);
                $("#menuFigureti #liMenuTrabajador" + val.seccionPadreId).after(textOpcionMenu);

                $(".divListModulos #liMenuTrabajador" + val.id).addClass("subMenu").hide();
                $("#menuFigureti #liMenuTrabajador" + val.id).addClass("subMenu").hide();
            }

            if (val.id == 8) {
                seccionCapacitacionOnline = 1;
            } else if (val.id == 16) {
                hasAntecedenteCovid = data.trabajadorCovid.ultimoAntecedente.id;
                hasSeccionActualCovid = data.trabajadorCovid.hasSeccionActualCovid;
            }
        });

        $('#menuFigureti #liMenuTrabajador16').click();

        $(".divListModulos #liMenuTrabajador2").find(".alertaMenu").html("<i class='fa fa-exclamation-circle' style='color:#D1D619;'></i>");
        $("#menuFigureti #liMenuTrabajador2").find(".alertaMenu").html("<i class='fa fa-exclamation-circle' style='color:#D1D619;'></i>");

        $("#menuMovilGosst").on("click", function () {
            $(".divContainerGeneral").toggle();
        });

        var trabajadorObj = data.list[0];

        if (trabajadorObj.imagen) {
            $("#icoPerfil > a").html(
                insertarImagenParaTablaMovil(trabajadorObj.imagen, "32px", "32px") +
                getSession("gestopusername").substr(0, 12) + ".");
        }

        marcarIconoModuloSeleccionado(data.list[0].seccionTrabajadorDefaultId, null, null, null, function () {
            if (wantsAccidentabilidad == 1) {
                $("#divPiramide").show();

                var dataParam = {
                    empresaId: sessionStorage.getItem("gestopcompanyid"), grupoId: 1
                };

                callAjaxPost(URL + '/empresa/indicadores/basicos', dataParam, procesarIndicadoresBasicosEmpresa);
            }

            if (wantsObjetivos == 1) {
                $("#divObjetivos").show();

                var dataParam2 = {
                    trabajadorId: getSession("trabajadorGosstId")
                };

                callAjaxPost(URL + '/trabajador/puntajes', dataParam2, procesarPuntajeTrabajadorColaborador);
            }
        });
    });
}

function procesarIndicadoresBasicosEmpresa(data) {
    var horasHombre = data.indicadoresBasico.numTrabajadoresActivos * 7.5 * 22 * 12;
    var indiceSeveridad = data.indicadoresBasico.numDiasDescanso * 200000 / horasHombre;
    var indicadorFrecuenciaTotal = (data.indicadoresBasico.numAccidentes * 200000 / horasHombre);
    var indiceAccidentabilidad = indiceSeveridad * indicadorFrecuenciaTotal / 200;
    eventosInseguros = data.eventosInseguros[0].numCond + data.eventosInseguros[0].numActos;

    $("#divPiramide .subDivContenido").html(
        "Fecha Inicio Indicadores Colaborador :<label>" + sumaFechaDias2(-365, obtenerFechaActual()) + "</label><br>" +
        "# de Accidentes fatales :	<label>" + data.indicadoresBasico.numAccidentesFatales + "</label><br>"
        + "# de Accidentes incapacitantes :	<label>" + data.indicadoresBasico.numAccidentesInc + "</label><br>"
        + "#  enfermedades ocupacionales :	<label>" + data.indicadoresBasico.numEnfermedades2 + "</label><br>"
        + "# incidentes :	<label>" + data.indicadoresBasico.numIncidentes + "</label><br>"
        + "#  días de descanso médico  :	<label>" + data.indicadoresBasico.numDiasDescanso + "</label><br>"
        + "#  A/C subestándar:	<label>" + eventosInseguros + "</label><br>"
        + "#  días sin accidentes :	<label>" + data.indicadoresBasico.numDiasSinAccidente + "</label><br>"
        + "Indice de Accidentabilidad :	<label>" + indiceAccidentabilidad.toFixed(2) + "</label><br>");
}

function procesarPuntajeTrabajadorColaborador(data) {

    var indicadoresSeguridad = data.indicadoresSeguridad;
    var indEvento = data.indEvento;
    var indAcc = data.indAcc;
    var indEpp = data.indEpp;
    var indExam = data.indExam;
    var indFormacion = data.indFormacion;

    var indicadorForTrab = 0;
    var indicadorEntrega = 0;
    var indicadorAcc = 1;
    var sumaDiasDescanso = 0;
    var diasTrabajados = 0;
    var indicadorPart = 0;
    var indicadorExamTrab = 0;

    indEvento.forEach(function (val, index) {
        indicadorPart = val.numEventosReportados;
    });

    indFormacion.forEach(function (val, index) {
        var primerDia = new Date();
        primerDia = convertirFechaNormal2(primerDia);
        var capacitacionesTrab = val.caps;
        var indicadorRangoActual = 1;
        for (var index22 = 0; index22 < capacitacionesTrab.length; index22++) {
            if (index22 == 0) {
                indicadorRangoActual = 0
            }
            var programs = capacitacionesTrab[index22].programsCap;

            for (var index31 = 0; index31 < programs.length; index31++) {
                if (programs[index31].fechaPlaTexto == null) {
                    programs[index31].fechaPlaTexto = primerDia;
                }
                if (programs[index31].fechaRealTexto == null) {
                    programs[index31].fechaRealTexto = programs[index31].fechaPlaTexto;
                }
                var enRangoInicial = fechaEnRango(primerDia, programs[index31].fechaPlaTexto, programs[index31].fechaRealTexto)
                var boolEntreFechas = false;
                if (enRangoInicial) {
                    boolEntreFechas = true;
                }
                if (programs[index31].tipoNotaTrabId == 1 && boolEntreFechas) {
                    indicadorRangoActual =
                        indicadorRangoActual + (1 / capacitacionesTrab.length);
                    index31 = programs.length;
                }
            }
        }
        indicadorForTrab = indicadorRangoActual;
    });
    indExam.forEach(function (val, index) {
        var primerDia = new Date();

        primerDia = convertirFechaNormal2(primerDia);
        var examsTrab = val.exams;
        var indicadorRangoActual = 0;
        for (var index22 = 0; index22 < examsTrab.length; index22++) {

            var programs = examsTrab[index22].programsExams;

            for (var index33 = 0; index33 < programs.length; index33++) {
                if (programs[index33].fechaInicialTexto == null) {
                    programs[index33].fechaInicialTexto = primerDia;
                }
                if (programs[index33].fechaFinTexto == null) {
                    programs[index33].fechaFinTexto = programs[index33].fechaInicialTexto;
                }
                var enRangoInicial = fechaEnRango(primerDia, programs[index33].fechaInicialTexto, programs[index33].fechaFinTexto)
                var boolEntreFechas = false;
                if (enRangoInicial) {
                    boolEntreFechas = true;
                }
                if (programs[index33].tipoNotaTrabId == 1 && boolEntreFechas) {

                    indicadorRangoActual = 1
                    index33 = programs.length;

                    index22 = examsTrab.length;
                }
            }


        }

        indicadorExamTrab = indicadorRangoActual;
    });
    indEpp.forEach(function (val, index) {
        var primerDia = new Date();

        primerDia = convertirFechaNormal2(primerDia);
        var eppsTrabajador = val.epps;
        var indicadorRangoActual = 1;
        for (var index22 = 0; index22 < eppsTrabajador.length; index22++) {
            if (index22 == 0) {
                indicadorRangoActual = 0
            }
            var programs = eppsTrabajador[index22].programsEpp;

            for (var index31 = 0; index31 < programs.length; index31++) {
                if (programs[index31].fechaPlanificadaTexto == null) {
                    programs[index31].fechaPlanificadaTexto = primerDia;
                }
                if (programs[index31].fechaEntregaTexto == null) {
                    programs[index31].fechaEntregaTexto = programs[index31].fechaPlanificadaTexto;
                }
                var enRangoInicial = fechaEnRango(primerDia, programs[index31].fechaPlanificadaTexto, programs[index31].fechaEntregaTexto)
                var boolEntreFechas = false;
                if (enRangoInicial) {
                    boolEntreFechas = true;
                }
                if (programs[index31].tipoNotaTrabId != null && boolEntreFechas) {
                    indicadorRangoActual =
                        indicadorRangoActual + (1 / eppsTrabajador.length);
                    index31 = programs.length;
                }
            }


        }
        indicadorEntrega = indicadorRangoActual;
    });
    indAcc.forEach(function (val, index) {
        indicadorAcc = val.indicadorDiasDescanso;
        sumaDiasDescanso = val.sumaDiasDescanso;
        diasTrabajados = val.diasTrabajados
    });
    var promedio = (indicadorForTrab + indicadorExamTrab
        + indicadorEntrega + indicadorAcc +
        ((indicadorPart / indicadoresSeguridad.indicadorMinimoParticipacion) > 1 ? 1 : (indicadorPart / indicadoresSeguridad.indicadorMinimoParticipacion))

    ) / 5;
    //Objetivos
    var porcentajeCumplimiento = pasarDecimalPorcentaje(promedio);
    var iconoEstrella = "<span>★</span>";
    var iconoEstrellaVacia = "<span>★</span>";
    var linkVerObjetivo = "<a class='efectoLink' onclick='marcarIconoModuloSeleccionado(5)'> Ver Más</a>"
    var estrellas = "<div class='star-ratings-css'>"
        + "<div class='star-ratings-css-top' style='width: " + porcentajeCumplimiento + ";color: " +
        (promedio <= 0.25 ? "#FF3D3D;" :
                (promedio > 0.25 && promedio < 0.8 ? "#FFCD00;" :
                    (promedio >= 0.8 ? "#029F4C;" : ""))

        ) + "'>" +
        iconoEstrella + iconoEstrella + iconoEstrella + iconoEstrella + iconoEstrella +
        "</div>"
        + " <div class='star-ratings-css-bottom'>" +
        iconoEstrellaVacia + iconoEstrellaVacia + iconoEstrellaVacia + iconoEstrellaVacia + iconoEstrellaVacia +
        "</div>"
        + "</div>"
    $("#divObjetivos").find(".subDivContenido").html(estrellas + linkVerObjetivo);
    //


}

function habilitarNoticiasUsuario() {
    habilitarVistaUsuario();
}

var listEventosId = [];

function ocultarFiltroTipoEvento() {
    $("#modalFiltroTipoEvento").modal("hide");
}

function verFiltroTipoEvento() {
    $("#modalFiltroTipoEvento").modal("show");
}

function filtroTipoEvento(functionCallBack) {
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
                inputForm: "<input type='date' id='fechaInicioFiltroActividad' class='form-control'>"
            },
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "", label: "Fin",
                inputForm: "<input type='date' id='fechaFinFiltroActividad' class='form-control'>"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
            {sugerencia: "", label: "Actividad", inputForm: "", divContainer: "divFiltroTipoEvento"},
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
            {
                sugerencia: "",
                label: "<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                    "onclick='ocultarFiltroTipoEvento()'>" +
                    "<i class='fa fa-times'></i> Cancelar" +
                    "</button>",
                inputForm: "<button id='btnAplicarFiltroTipoEvento' class='btn btn-success' type='submit' " +
                    "style='float:right;font-size:18px;'>" +
                    "<i class='fa fa-filter'></i> Aplicar filtro" +
                    "</button>"
            }
        ];

        listContenido.forEach(function (val) {
            contenido += obtenerSubPanelModuloVersionDos(val);
        });

        var modalOptionsVistaTra = {
            id: "modalFiltroTipoEvento",
            nombre: "<i class='fa fa-filter'></i> Filtro",
            contenido: "<div class='eventoGeneral'>" + contenido + "</div>"
        };

        crearModalPrincipalUsuario(modalOptionsVistaTra, function () {
            if ($("#filtroTipoEvento").length > 0) {
                return;
            }

            crearSelectOneMenuObligMultipleCompleto("filtroTipoEvento", "", listTipoEvento,
                "id", "nombre", "#divFiltroTipoEvento", "Todos");
        }, true, true);

        var hoy = getSession("fechaHoyOrdenInversoTexto");

        $("#fechaInicioFiltroActividad").val(sumaFechaDias(-180, hoy));
        $("#fechaFinFiltroActividad").val(sumaFechaDias(90, hoy));

        $("#btnAplicarFiltroTipoEvento").on("click", function (e) {
            valoresFiltroTipoEvento(functionCallBack);
        });

        valoresFiltroTipoEvento(functionCallBack);
    });
}

function valoresFiltroTipoEvento(functionCallBack) {
    $("#modalFiltroTipoEvento").modal("hide");

    listEventosId = [];
    var eventoId = $("#filtroTipoEvento").val();

    if (eventoId != null) {
        eventoId.forEach(function (val) {
            listEventosId.push(parseInt(val));
        });
    }

    traerEventosTrabajador(functionCallBack);
}

function traerEventosTrabajador(functionCallBack) {
    var fechaReporteInicio = $("#fechaInicioFiltroActividad").val();
    var fechaReporteFin = $("#fechaFinFiltroActividad").val();

    if (fechaReporteInicio.length != 0 && fechaReporteFin.length != 0) {
        var dataParam = {
            empresaId: parseInt(sessionStorage.getItem("gestopcompanyid")),
            responsableId: (parseInt(sessionStorage.getItem("trabajadorGosstId")) > 0 ?
                parseInt(sessionStorage.getItem("trabajadorGosstId")) : null),
            listEventosIdFiltro: (listEventosId.length == 0 ? null : listEventosId),
            fechaReporteInicio: fechaReporteInicio, fechaReporteFin: fechaReporteFin
        };

        callAjaxPost(URL + '/scheduler', dataParam, function (data) {
            listFullEventos = data.list;

            habilitarVistaTrabajador();

            if (functionCallBack != null) {
                functionCallBack();
            }
        });
    } else {
        mensajeUx = "<label>Debe ingresar el rango de fecha.</label>";
        mensajesUx(mensajeUx, 2, "", "AvisoCompletarFechaRango");

        $("#modalMensajeUxAvisoCompletarFechaRango").on("hidden.bs.modal", function () {
            $("#modalFiltroTipoEvento").modal("show");
        });
    }
}

function habilitarVistaTrabajador() {
    var contadorImplementar = 0, contadorCompletado = 0, contadorRetrasado = 0;

    $(".divListPrincipal").html("");

    var metodoNuevo = "verNuevaActividadColaboradorSimple()", btnConsolidadoExcel = "";

    if (numAreasResponsable > 0) {
        metodoNuevo = "verNuevaActividadColaborador()";

        btnConsolidadoExcel =
            "<button style='font-size:13px;margin-left:5px;' class='btn btn-info' " +
            "onclick='verFiltroListaConsolidadosActividadExcel()'>" +
            "<i class='fa fa-3x fa-list'></i>" +
            "<i class='fa fa-2x fa-file-excel-o'></i>" +
            "</button>";
    }

    var btnFiltro =
        "<button style='font-size:13px;' class='btn btn-success' " +
        "onclick='verFiltroTipoEvento()'>" +
        "<i class='fa fa-filter fa-3x'></i>" +
        "</button>";

    var textNuevo =
        "<div id='subNuevaActividad'>" +
        "<div class='tituloSubList'>Registrar una nueva actividad " +
        "<button style='font-size:16px' class='btn btn-success' " +
        "onclick='" + metodoNuevo + "'>" +
        "<i class='fa fa-plus fa-2x'></i> Nuevo" +
        "</button>" +
        "</div>" +
        "<div class='contenidoSubList' style='display:none'></div>" +
        "</div>";

    $(".divListPrincipal").append(
        textNuevo +
        "<div id='subFiltroTipoEvento'>" +
        "<div class='tituloSubList'> Opciones - Actividades" +
        btnConsolidadoExcel + btnFiltro +
        "</div>" +
        "</div>" +
        "<div id='subListCompletado'>" +
        "<div class='tituloSubList'>" +
        "</div>" +
        "<div class='contenidoSubList' style='display:none'>" +
        "</div>" +
        "</div>" +
        "<div id='subListImplementar'>" +
        "<div class='tituloSubList' style='color:red'>" +
        "</div>" +
        "<div class='contenidoSubList'>" +
        "</div>" +
        "</div>" +
        "<div id='subListRetrasado'>" +
        "<div class='tituloSubList'>" +
        "</div>" +
        "<div class='contenidoSubList'>" +
        "</div>" +
        "</div>" +
        "<div id='subFormEvento' class='divSubEvento'>" +
        "</div>" +
        "<div id='subRealizarInspecciones' class='divSubEvento' style='display:none'>" +
        "<div class='tituloSubList'></div>" +
        "<div class='contenidoSubList'></div>" +
        "</div>");

    listFullEventos.forEach(function (val, index) {
        var divContainer;

        switch (val.estadoEvento) {
            case 1:
                contadorImplementar++;
                divContainer = "subListImplementar";

                break;

            case 2:
                contadorCompletado++;
                divContainer = "subListCompletado";

                break;

            case 3:
                contadorRetrasado++;
                divContainer = "subListRetrasado";

                break;
        }

        agregarActividadColaborador(val, index);
    });

    $(".listaGestionGosst").hide();

    var textoBotonHide1 =
        "<button class='btn btn-success' onclick='cambiarDivEstadoEvento(" + 1 + ")'>" +
        "<i class='fa fa-caret-down fa-4x' aria-hidden='true'></i>" +
        "</button>";

    var textoBotonHide2 =
        "<button class='btn btn-success' onclick='cambiarDivEstadoEvento(" + 2 + ")'>" +
        "<i class='fa fa-caret-down fa-4x' aria-hidden='true'></i>" +
        "</button>";

    var textoBotonHide3 =
        "<button class='btn btn-success' onclick='cambiarDivEstadoEvento(" + 3 + ")'>" +
        "<i class='fa fa-caret-down fa-4x' aria-hidden='true'></i>" +
        "</button>";

    $(".divListPrincipal").find("#subListImplementar .tituloSubList")
        .css({"color": "8px solid #F79646"}).html("Actividades por implementar (" + contadorImplementar + ")" + textoBotonHide1);

    $(".divListPrincipal").find("#subListCompletado .tituloSubList")
        .css({"color": "8px solid #9BBB59"}).html("Actividades completadas (" + contadorCompletado + ")" + textoBotonHide2);

    $(".divListPrincipal").find("#subListRetrasado .tituloSubList")
        .css({"color": "8px solid #C0504D"}).html("Actividades retrasadas (" + contadorRetrasado + ")" + textoBotonHide3);

    $("#liMenuTrabajador" + 2 + " .alertaMenu").html(contadorImplementar + contadorRetrasado);

    completarBarraCarga();

    $(window).scrollTop(0 - $("#barraMenu").height() - 60);
}

function agregarActividadColaborador(val, index) {
    var respAux = val.responsable;
    var linkId = "id='evidenciaEvento" + val.id + "'", linkUrlAux = "", linkEvi = "";

    if (val.tipoEvento == 16) {
        linkEvi = "href='" + URL + "/opt/eventos/evidencia?id=" + val.idAux + "'";
    } else if (val.tipoEvento == 19) {
        linkId = "";

        if (val.linkAuxiliarId1 == "1A") {
            linkUrlAux = "/auditoria/verificaciones/respuesta/version_dos/auditoria_extintor/accion_correctiva/evidencia?" +
                "detalleAuditoriaExtintorId=";
        } else if (val.linkAuxiliarId1 == "1B") {
            linkUrlAux = "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/accion_correctiva/evidencia?" +
                "detalleAuditoriaGabineteIncendioId=";
        } else if (val.linkAuxiliarId1 == "1C") {
            linkUrlAux = "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/accion_correctiva/evidencia?" +
                "detalleAuditoriaTrabajadorEppId=";
        }

        linkEvi = "href='" + URL + linkUrlAux + val.idAux + "'";
    }

    var iconoEvi = (val.evidenciaNombre == "----" ?"<strong style='color:red'>No hay evidencia</strong>":
        "<a "+linkId+" class='efectoLink' target='_blank' "+linkEvi+">"+val.evidenciaNombre+"</a>");

    if (val.tipoEvento == 19 && val.linkAuxiliarId1 == "1D") {
        iconoEvi = (val.evidenciaNombre == "----" ? "<strong style='color:red'>No hay evidencia</strong>" :
            "<a class='efectoLink' target='_blank' href='" + urlArchivo(val.evidenciaUrl) + "'>" +
            val.evidenciaNombre +
            "</a>");
    }
    
    if(val.tipoEvento == 10){
	iconoEvi = (val.estadoEvento == 2?"<a class='efectoLink' onclick='descargarReporteFinalExcelInspeccionVistaColaborador(" +
	    val.idAux+")'>"+"Descargar reporte"+"</a>":"<strong>*Automático (al completar el evento)</strong>");
    }

    var textoBoton =
        "<button class='btn btn-success' onclick='verCompletarActividadVistaColaborador(" + index + ")'>" +
        "<i class='fa fa-external-link-square' aria-hidden='true'></i> Editar" +
        "</button>";

    var divContainer;

    switch (val.estadoEvento) {
        case 1:
            divContainer = "subListImplementar";
            break;

        case 2:
            divContainer = "subListCompletado";
            textoBoton = "";
            break;

        case 3:
            divContainer = "subListRetrasado";
            break;
    }

    var textAccionDebido = "", texRealizarInspeccion = "";
    //-----------------------------------------------------------------------------------------------
    var menuOpcion = "<ul class='list-group listaGestionGosst'>";

    funcionalidadesActiv.forEach(function (val1, index1) {
        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionActiv(" + index1 + "," + index + ")'>" + val1.nombre + "</li>";

        if (val.tipoEvento == 10) {
            if (val.estadoEvento != 2) {
                menuOpcion +=
                    "<li class='list-group-item' onclick='editarInspeccionDetalleAdicional(" + index + ")'>" +
                    "<i class='fa fa-pencil'></i> Editar registro" +
                    "</li>";
            }

            if(val.linkAuxiliarId3 == null){
                if([94,194,300,303,304].includes(parseInt(val.linkAuxiliarId2)) || parseInt(getSession("gestopcompanyid")) == 739){
                    texRealizarInspeccion = "<li class='list-group-item' onclick='realizarInspeccionMovil("+index+")'>" +
                            "<i class='fa fa-check-square-o'></i> Realizar evaluación" +
                        "</li>";
                }else{
                    texRealizarInspeccion = "<li class='list-group-item' onclick='realizarInspeccionMovilGenV3("+index+")'>" +
                            "<i class='fa fa-check-square-o'></i> Realizar evaluación" +
                        "</li>";
                }
            } else {
                texRealizarInspeccion =
                    "<li class='list-group-item' onclick='marcarIconoModuloSeleccionado(" + 11 + "," + val.linkAuxiliarId3 + "," +
                    val.linkAuxiliarId1 + "," + val.idAux + ")'>" +
                    "<i class='fa fa-check-square-o'></i> Realizar evaluación Proyecto" +
                    "</li>";
            }

            menuOpcion += texRealizarInspeccion;
        }

        if (val.tipoEvento == 8) {
            menuOpcion +=
                "<li class='list-group-item' onclick='verOrigenAccionMejora(" + index + ")'>" +
                "<i class='fa fa-info-circle'></i> Ver origen de acción" +
                "</li>";
        }

        if (val.tipoEvento == 3) {
            menuOpcion +=
                "<li class='list-group-item' onclick='verRegistroNotasEventoFormacion(" + index + ")'>" +
                "<i class='fa fa-check-square-o'></i> Ver registro de notas" +
                "</li>";
        }
        
        if (val.tipoEvento == 5) {
            menuOpcion +=
                "<li class='list-group-item' onclick='descargarWordReporteEntregaEpp(" + index + ")'>" +
                "<i class='fa fa-download'></i> Descargar reporte" +
                "</li>";
        }
    });

    menuOpcion += "</ul>";

    var menuOpcioOpt = "<ul class='list-group listaGestionGosst'>";
    funcionalidadesEventosOpt.forEach(function (val1, index1) {
        menuOpcioOpt +=
            "<li class='list-group-item' onclick='marcarSubOpcionEventoOpt(" + index1 + "," + index + ")'>" +
            val1.nombre +
            "</li>";
    });
    menuOpcioOpt += "</ul>";
    //-----------------------------------------------------------------------------------------------
    textoBoton = "";texRealizarInspeccion = "";

    var buttonDetalle = "";

    if(val.tipoEvento == 5){
        buttonDetalle = "<br>" +
            "<a onclick='verDivDetalleEvento(1,"+index+")' id='linkVerEvento"+index+"' class='efectoLink'>" +
                "Ver detalle <i class='fa fa-angle-double-down'></i>" +
            "</a>" +
            "<a onclick='verDivDetalleEvento(0,"+index+")' style='display:none' id='linkOcultarEvento"+index+"' class='efectoLink'>" +
                "Ocultar detalle <i class='fa fa-angle-double-up'></i>" +
            "</a>" +
            "<div style='display:none' id='divDetalleEvento"+index+"'></div>";
    }

    if ($("#divActColaborador" + val.id).length > 0) {
        $("#divActColaborador" + val.id).html("" +
            "<a class='efectoLink btn-gestion' style='margin-left:130px;' onclick='toggleMenuOpcionActiv(this," + index + ")'>" +
            "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
            "</a>" +
            (val.tipoEvento == 16 ? menuOpcioOpt : menuOpcion) + //opciones del enlace Ver Opciones
            "<div id='tituloEvento'>" +
            val.iconoNombre +
            val.text +
            "<br>" +
            "<i class='fa fa-calendar'></i> <strong>(" + val.estadoEventoNombre + ")</strong> " + val.fechaTexto +
            "<br>" +
            "<i class='fa fa-download'></i>" +
            iconoEvi+textAccionDebido+buttonDetalle +
            "</div>").css({"border-color": "" + val.color});
    } else {
        var observacionAux = val.observacion;
        var infoAdiEvaluaciones = "", infoAdiObservaciones = "";

        if (val.iconoNombre == "<i aria-hidden='true' class='fa fa-search'></i>") {
            observacionAux = observacionAux.replace(/brsalto/gi, "<br><i class='fa fa-book'></i>");
        }

        if (val.tipoEvento == 10) {
            infoAdiEvaluaciones = (val.infoAdicionalEvaluaciones.length == 0 ? "" :
                "<br><i class='fa fa-pencil-square-o'></i> N° de " + val.infoAdicionalEvaluaciones);

            infoAdiObservaciones = (val.infoAdicionalObservaciones.length == 0 ? "" :
                "<br><i class='fa fa-eye'></i> N° de " + val.infoAdicionalObservaciones);
        }

        if (val.tipoEvento == 19) {
            val.text = val.text.replace(/->/gi, "<br>");
            val.text = val.text.replace(/>1>/gi, "<span style='font-weight:bold;'>");
            val.text = val.text.replace(/>2>/gi, "</span>");
            val.text = val.text.replace(/>3>/gi, "<label>***");
            val.text = val.text.replace(/>4>/gi, "***</label>");
        }

        $(".divListPrincipal").find("#" + divContainer + " .contenidoSubList").append(
            "<div id='divActColaborador" + val.id + "' class='eventoGeneral' style='border-left:8px solid " + val.color + ";'>" +
            "<a class='efectoLink btn-gestion' style='margin-left:80px;' onclick='toggleMenuOpcionActiv(this," + index + ")'>" +
            "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
            "</a>" +
            (val.tipoEvento == 16 ? menuOpcioOpt : menuOpcion) +
            "<div id='tituloEvento' style='word-break:break-all;'>" +
            val.iconoNombre + val.text +
            "<br>" +
            "<i class='fa fa-calendar'></i>" + "<strong>(" + val.estadoEventoNombre + ")</strong>" +
            " " + val.fechaTexto +
            (val.iconoNombre == "<i aria-hidden='true' class='fa fa-search'></i>" ?
                "<br><i class='fa fa-info-circle'></i> " + observacionAux : "") +
            infoAdiEvaluaciones +
            infoAdiObservaciones +
            "<br>" +
            "<i class='fa fa-download'></i>" +
            iconoEvi+textAccionDebido+buttonDetalle +
            "</div>" +
            "</div>");
    }

    asignarFuncionesEvento(val);
}

function verDivDetalleEvento(isVer,pindex){
    if(parseInt(isVer) == 1){
        $("#divDetalleEvento"+pindex).show().html("<strong>Equipos: </strong>"+listFullEventos[pindex].linkAuxiliarId3);
        $("#linkOcultarEvento"+pindex).show();$("#linkVerEvento"+pindex).hide();
    }else{
        $("#divDetalleEvento"+pindex).hide();$("#linkOcultarEvento"+pindex).hide();$("#linkVerEvento"+pindex).show();
    }
}

function verNuevaActividadColaborador(){
    $("#modalNuevaActividad").remove();
   
    var listTipoActividadMovil = [];

    if(parseInt(getSession("gestopcompanyid")) == 647){
        listTipoActividadMovil.push({id:10,nombre:"Programación Inspección"});
    }else{
        listTipoActividadMovil.push(/*{id:1,nombre:"tes"},*/{id:5,nombre:"Entrega EPP"},{id:3,nombre:"Programación Formación"},
            {id:10,nombre:"Programación Inspección"});
    }

    // if(parseInt(getSession("gestopcompanyid")) == 500){
    //     listTipoActividadMovil.push({id:13,nombre:"Entrega de Equipo Seguridad"});
    // }

    var tipoActividadInicial = (parseInt(getSession("gestopcompanyid")) == 500?5:10);

    var selTipoActividadMovil = crearSelectOneMenuOblig("selTipoActividadMovil",
        "verAcordeTipoActividadColaborador()",listTipoActividadMovil,tipoActividadInicial,"id","nombre");

    var contenido = "";

    var listContenido = [
        {
            sugerencia: "", anchoLabel: "", anchoDiv: "",
            label: "Tipo de evento", inputForm: selTipoActividadMovil, divContainer: "divSelTipoActividad"
        },
        {
            sugerencia: "", clase: "botones-actividadTrabGeneral", anchoLabel: "", anchoDiv: "",
            label: "<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                "onclick='cancelarNuevaActividadColaborador()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
                "</button>", anchoLabel: "col-sm-8", anchoDiv: "col-sm-4",
            inputForm: "<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
                "onclick='guardarNuevaActividadColaborador()'>" +
                "<i class='fa fa-floppy-o'></i> Guardar" +
                "</button>"
        }
    ];

//   if(parseInt(getSession("habilitarValidacion")) == 1){
//      listContenido.push(
//         {sugerencia:"",clase:"botones-actividadEntregaEppValidar",anchoLabel:"",anchoDiv:"",
//	  label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
//	       		"onclick='cancelarNuevaActividadColaborador()'>" +
//	           "<i class='fa fa-times'></i> Cancelar" +
//	        "</button>",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
//	  inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
//		            "onclick='autentificarTrabajadorEntregaEpp()'>" +
//		       "<i class='fa fa-user'></i> Autentificar" +
//		    "</button>"});
//   }

    listContenido.forEach(function (val) {
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions = {
        id: "modalNuevaActividad",
        nombre: "Nueva actividad",
        contenido: "<div class='eventoGeneral'>" + contenido + "</div>"
    };

    crearModalPrincipalUsuario(modalOptions, function () {
    }, true, true);

//   if(parseInt(getSession("habilitarValidacion")) == 1){
//      $(".botones-actividadEntregaEppValidar").hide();
//   }

    verAcordeTipoActividadColaborador();
}

function verNuevaActividadColaboradorSimple() {
    $("#modalNuevaActividad").remove();

    var listTipoActividadMovil = [
        {id: 10, nombre: "Programación Inspección"}
    ];

    var selTipoActividadMovil = crearSelectOneMenuOblig("selTipoActividadMovil",
        "verAcordeTipoActividadColaborador()", listTipoActividadMovil, "10", "id", "nombre");

    var contenido = "";

    var listContenido = [
        {
            sugerencia: "", clase: "campos-programacionInspeccion", anchoLabel: "", anchoDiv: "",
            label: "Tipo de evento", inputForm: selTipoActividadMovil, divContainer: "divSelTipoActividad"
        },
        {
            sugerencia: "", anchoLabel: "", anchoDiv: "",
            label: "<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                "onclick='cancelarNuevaActividadColaborador()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
                "</button>", anchoLabel: "col-sm-8", anchoDiv: "col-sm-4",
            inputForm: "<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
                "onclick='guardarNuevaActividadColaborador()'>" +
                "<i class='fa fa-floppy-o'></i> Guardar" +
                "</button>"
        }
    ];

    listContenido.forEach(function (val) {
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions = {
        id: "modalNuevaActividad",
        nombre: "<i class='fa fa-pencil-square-o'></i> Nueva actividad",
        contenido: "<div class='eventoGeneral'>" + contenido + "</div>"
    };

    crearModalPrincipalUsuario(modalOptions, function () {
    }, true, true);

    verAcordeTipoActividadColaborador();
}

function cancelarNuevaActividadColaborador() {
    $("#modalNuevaActividad").modal("hide");
}

function volverMenuActividadesSST() {
    $(".divTituloFull").find("h4").html("Mis Actividades SST");
    $(".divListPrincipal #subFiltroTipoEvento").show();
    $(".divListPrincipal #subListCompletado").show();
    $(".divListPrincipal #subListImplementar").show();
    $(".divListPrincipal #subListRetrasado").show();
    $(".divListPrincipal #subNuevaActividad").show();
    $("#subFormEvento").html("");
    $(window).scrollTop(lastHeight - $("#barraMenu").height() - 60);
}

function cambiarDivEstadoEvento(estadoId) {
    var divContainer;
    switch (estadoId) {
        case 1:
            divContainer = "subListImplementar";
            break;
        case 2:
            divContainer = "subListCompletado";
            break;
        case 3:
            ;
            divContainer = "subListRetrasado";
            break;
    }
    $("#" + divContainer).find(".contenidoSubList").toggle();
}

var objActividad = {};

function verAcordeAdjuntaEvidencia() {
    var tipoAdjuntaId = parseInt($("#selAdjuntarEvidenciaNueva").val());
    if (tipoAdjuntaId == 1) {
        $("#divActividadEvidencia").html("Automático");
    } else {
        var options = {
            idAux: "Actividad",
            esNuevo: true,
            container: "#divActividadEvidencia",
            evidenciaNombre: objActividad.evidenciaNombre,
            functionCall: function () {
            }

        }
        crearFormEvidenciaCompleta(options);
    }
}

function verAcordeNotificarResponsable() {
    var tipoAdjuntaId = parseInt($("#selNotificarResponsableAuditoria").val());
    if (tipoAdjuntaId == 1) {
        $("#divNotificarResponsable").parent().show();
        callAjaxPost(URL + '/auditoria/evaluacion/gerencia', {
                auditoriaId: objActividad.idAux,
                idCompany: getSession("gestopcompanyid")
            },
            function (data) {

                var listFullUsuGerenAPorNotificar = data.usuarios_geren_notificar;
                var selUsuariosNotificar = crearSelectOneMenuOblig("selUsuariosNotificar", "", listFullUsuGerenAPorNotificar,
                    "", "userId", "userName");
                $("#divNotificarResponsable").html(selUsuariosNotificar);
            });
    } else {
        $("#divNotificarResponsable").parent().hide();
    }
}

function verCompletarActividadVistaColaborador(pindex){
    $("#modalRegistroNotasEventoFormacion").modal("hide");
    
    objActividad = listFullEventos[pindex];

    if(objActividad.tipoEvento == 10) {
//      var selAdjuntarEvidenciaNueva = crearSelectOneMenuOblig("selAdjuntarEvidenciaNueva",
//	     "verAcordeAdjuntaEvidencia()",listBoolean,1,"id","nombre");
        var listRespuestaSimpleAux = [];

        if (parseInt(getSession("gestopcompanyid")) == 647) {
            listRespuestaSimpleAux.push({id: 0, nombre: "No"});
        } else {
            listRespuestaSimpleAux = listBoolean;
        }

        var selNotificarResponsableAuditoria = crearSelectOneMenuOblig("selNotificarResponsableAuditoria",
            "verAcordeNotificarResponsable()", listRespuestaSimpleAux, 0, "id", "nombre");

        var listContenido=[
            {sugerencia:"",label:"Fecha realizada",inputForm:"<input id='dateActividad' class='form-control' type ='date'>"},
//	        {sugerencia:"",label:"Adjuntar evidencia GOSST",inputForm:selAdjuntarEvidenciaNueva},
//	        {sugerencia:"",label:"Evidencia",divContainer:"divActividadEvidencia"},
            {sugerencia:"",clase:"campos-notifRespAuditoria",label:"¿El informe requiere de revisión?",inputForm:selNotificarResponsableAuditoria},
            {sugerencia:"",label:"Debe ser revisado por",inputForm:"",divContainer:"divNotificarResponsable"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",label:"",
             inputForm:"<button onclick='guardarActividadTrabajador("+pindex+")' class='btn btn-success' style='float:right;font-size:18px;'>" +
                           "<i class='fa fa-floppy-o'></i> Guardar" +
                       "</button>"}
        ];

        var contenido = "";

        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
        });

        var modalOptions={
            id:"modalFinish",nombre:"Completar Actividad",contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
        };

        crearModalPrincipalUsuario(modalOptions,function(){},false,true);

        $("#dateActividad").val(convertirFechaInput(objActividad.start_date));
        $(".campos-notifRespAuditoria").hide();
//      verAcordeAdjuntaEvidencia();
        verAcordeNotificarResponsable();
        return;
    }else{
        window.scrollTo({top:0,behavior:'smooth'});
    }

    var listCondicional = [
        {id: 1, nombre: "Si"},
        {id: 0, nombre: "No"}
    ];
    $(".divListPrincipal > div").hide();
    $("#subFormEvento").show();
    var textoBotonVolver = "<button class='btn btn-success' onclick='volverMenuActividadesSST()' style='color:#008b8b ;background-color:white '>" +
        "<i class='fa fa-arrow-left' aria-hidden='true'></i></button>";
    var textoBotonGuardar = "<button class='btn btn-success' onclick='guardarActividadTrabajador(" + pindex + ")'>" +
        "<i class='fa fa-save' aria-hidden='true'></i>Guardar</button>";
    var formEvi = crearFormEvidencia("Actividad", true);
    var selFelicitacion = crearSelectOneMenuOblig("selFelicitacionOpt", "", listCondicional, "", "id", "nombre");
    var selSeguimiento = crearSelectOneMenuOblig("selSeguimientoOpt", "", listCondicional, "", "id", "nombre");
    $("#subFormEvento").html(
        "<table  class='table table-striped table-bordered table-hover'>" +
        "<thead >" +
        "<tr>" +
        "<th class='tb-acc' style='border-color:#008b8b;' colspan='2'>" +
        "<div class='row'>" +
        "<section class='col col-xs-4'>" +
        textoBotonVolver +
        "</section>" +
        "<section class='col col-xs-8'>" +
        objActividad.text +
        "</section>" +
        "</div>" +
        "</th>" +
        //"<th class='tb-acc' style='border-color:#008b8b;'>"++"</td>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        (objActividad.tipoEvento == 16 ?
            "<tr>" +
            "<td>¿Ha felicitado adecuadamente al trabajador y/o ha vuelto a instruirlo en base a las observaciones?</td>" +
            "<td>" + selFelicitacion + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>Vigencia de la Opt</td>" +
            "<td>" +
            "<div class='row'>" +
            "<section class='col col-xs-7'>" +
            "<input type='number' class='form-control' id='inputVigenciaOpt' min='0' value='0'>" +
            "</section>" +
            "<section class='col col-xs-2'>" +
            "<label style='vertical-align: sub;'>Dias</label>" +
            "</section>" +
            "</div>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>¿Se debería realizar una observación de seguimiento a este trabajador en un futuro cercano?</td>" +
            "<td>" + selSeguimiento + "</td>" +
            "</tr>"
            : "") +
        "<tr>" +
        "<td>Fecha Realizada *</td>" +
        "<td><input type='date' class='form-control' id='dateActividad'></td>" +
        "</tr>" +

        ((objActividad.tipoEvento == 8 || objActividad.tipoEvento == 11 || objActividad.tipoEvento == 12) ?
            "<tr>" +
            "<td>Observaciones del responsable de la actividad</td>" +
            "<td><input   class='form-control' id='observacionActividad'></td>" +
            "</tr>"
            : "") +

        (objActividad.tipoEvento == 16 ?
            "<tr>" +
            "<td colspan='2'><a class='efectoLink' onclick='verSelecionarTrabajadorOpt(" + pindex + ")'>Enviar Informe OPT</a></td>" +
            "</tr>"
            : "") +
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
    $("#dateActividad").val(convertirFechaInput(objActividad.start_date));
    $("#observacionActividad").val(objActividad.observacion);
    $("#inputEviActividad").val(objActividad.evidenciaNombre);

}

function verOrigenAccionMejora(pindex) {

    $(".divListPrincipal > div").hide();
    $("#subFormEvento").show();

    objActividad = listFullEventos[pindex];

    var textoBotonVolver = "<button class='btn btn-success' onclick='volverMenuActividadesSST()'>" +
        "<i class='fa fa-angle-left' aria-hidden='true'></i>Volver" +
        "</button>";
    var dataParam = {
        gestionAccionMejoraId: objActividad.linkAuxiliarId1,
        accionMejoraId: objActividad.idAux
    };

    callAjaxPost(URL + '/gestionaccionmejora/detalle', dataParam,
        function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    var list = data.list;
                    var textIn = "";
                    var nro = 0;

                    nro++;

                    list.forEach(
                        function (val, index) {
                            var btnDescargaCausa = "";

                            if (val.evidenciaNombre != null) {
                                if (val.detalleGestAccionMejoraId > 0) {
                                    btnDescargaCausa = "<a class='efectoLink' " +
                                        "href='" + URL + "/gestionaccionmejora/detalle/evidencia?id=" + val.detalleGestAccionMejoraId + "' " +
                                        "target='_blank' ><i class='fa fa-download'></i>" + val.evidenciaNombre + "</a>";
                                } else {
                                    btnDescargaCausa = "<a class='efectoLink' " +
                                        "href='" + URL + "" + val.link + "' " +
                                        "target='_blank' ><i class='fa fa-download'></i>" + val.evidenciaNombre + "</a>";
                                }
                            } else {
                                btnDescargaCausa = "Sin evidencia"
                            }

                            textIn += "<tr id='tr" + val.detalleGestAccionMejoraId + "'>"
                                + "<td id='tdmod" + val.detalleGestAccionMejoraId + "'>"
                                + val.moduloNombre + " , " + val.categoriaNombre
                                + "<br>" + val.detalleNombre
                                + "<br>*Detalle: " + val.observacion
                                + "<br><i aria-hidden='true' class='fa fa-calendar'></i> *Fecha: " + val.fechaInicioTexto
                                + "</td>"
                                + "<td><a style='color:red;'>" + btnDescargaCausa + "</a></td>"
                                + "</tr>"

                            textIn = textIn.replace("InicioParrafo", "<p align='left'>");
                            textIn = textIn.replace(/,/g, "<br>");
                            textIn = textIn.replace("FinParrafo", "</p>");
                        });

                    $("#subFormEvento")
                        .html(textoBotonVolver + "<br>" +
                            "<table class='table table-striped table-bordered table-hover'>" +
                            "<thead>" +
                            "<tr><td colspan='2' class='tb-acc'>Origen: '" + objActividad.text + "'</td></tr>" +
                            "</thead>" +
                            "<tbody>" +
                            textIn +
                            "</tbody>" +
                            "</table>");
                    break;

                default:
                    alert("Ocurrió un error al traer los items asociados!");
            }
        });
}

function guardarActividadTrabajador(pindex) {
    var fieldEvidencia = "eventoId";
    var url = '/scheduler/evidencia/save';

//   $.blockUI({
//      message : 'Cargando...'
//   });

    var fecha = convertirFechaTexto($("#dateActividad").val());
    listFullEventos[pindex].start_date = fecha;

    var inputFileImage = document.getElementById("fileEviActividad");
    $("#modalFinish").modal("hide");

    var file = null;

    if (inputFileImage != null) {
        file = inputFileImage.files[0];
    }

    var observacion = $("#observacionActividad").val();
    objActividad = listFullEventos[pindex];

    var dataSend = {
        fecha: fecha, observacion: observacion, tipoEvento: objActividad.tipoEvento,
        id: objActividad.idAux, eventInseguroId: objActividad.eventInseguroId
    };

    if (fecha != null) {
        listFullEventos[pindex].estadoEventoNombre = "Completado";
        listFullEventos[pindex].estadoEvento = 2;

        if (file) {
            listFullEventos[pindex].evidenciaNombre = file.name;
        }

        listFullEventos[pindex].observacion = observacion;
        listFullEventos[pindex].estadoEvento = 2;
        listFullEventos[pindex].color = "#9bbb59";
    } else {
        listFullEventos[pindex].estadoEventoNombre = "Por implementar";
        listFullEventos[pindex].estadoEvento = 1;
        listFullEventos[pindex].color = "#F79646";
        //alert("Fecha obligatoria");$.unblockUI(); return;
    }

    if (objActividad.tipoEvento == 16) {
        var felici = $("#selFelicitacionOpt").val();
        var vig = $("#inputVigenciaOpt").val();
        var seg = $("#selSeguimientoOpt").val();

        var dataParam = {
            id: objActividad.idAux,
            felicitacion: felici,
            vigenciaOpt: vig,
            seguimientoOpt: seg,
            fechaReal: fecha
        };

        callAjaxPostNoUnlock(URL + '/opt/eventos/cierre', dataParam, function () {
            guardarEvidenciaAutoCalendar(objActividad.idAux, "fileEviActividad", bitsEvidenciaEventoCalendario, url, function () {
                console.log("se actualizo el evento Opt");
            }, fieldEvidencia, objActividad.tipoEvento);
        });
    } else {
        callAjaxPostNoUnlock(URL + '/scheduler/evento_normal/save', dataSend, function () {
            guardarEvidenciaAutoCalendar(objActividad.idAux, "fileEviActividad", bitsEvidenciaEventoCalendario, url, function () {
                console.log("se actualizo el scheduler");
            }, fieldEvidencia, objActividad.tipoEvento);
        });
    }
// guardarEvidenciaAutoCalendar(objActividad.idAux,"fileEviActividad",bitsEvidenciaEventoCalendario,
// url,function(){
    var dataParamAudi = {
        idAux: objActividad.idAux,
        tipoEvento: objActividad.tipoEvento,
        evidenciaNombre: objActividad.evidenciaNombre,
        wantsNotificarResponsable: $("#selNotificarResponsableAuditoria").val(),
        wantsAdjuntoEvidencia: 1,
        usuarioNotificar: {userId: $("#selUsuariosNotificar").val()},bucketNombre:BUCKETAMAZONS3
    };

    if ($("#selNotificarResponsableAuditoria").val() == 0) {
        callAjaxPostNoUnlock(URL + "/scheduler/auditoria/update/auto", dataParamAudi, function (data) {
            objActividad.evidenciaNombre = data.respuesta.evidenciaNombre;
            $("#modalFinish").remove();
            agregarActividadColaborador(objActividad, pindex);

            callAjaxPost(URL + '/auditoria/informe/enviar', {
                auditoriaId: objActividad.idAux,
                fechaInforme: new Date()
            }, function (data) {
                mensajeUx = "<label>Se guardaron los cambios correctamente y el informe fue enviado a los " +
                    "interesados.</label>";
                mensajesUx(mensajeUx, 1, "", "GuardarActividadVistaCol");

                $("#modalMensajeUxGuardarActividadVistaCol").on("hidden.bs.modal", function () {
                    volverDivSubContenidoColaborador();
                });
            });
        });
    } else {
        callAjaxPost(URL + "/scheduler/auditoria/update/auto", dataParamAudi, function (data) {
            objActividad.evidenciaNombre = data.respuesta.evidenciaNombre;
            $("#modalFinish").remove();
            agregarActividadColaborador(objActividad, pindex);
// 	 verAlertaSistemaGosst(1,"Se guardaron los cambios correctamente.");
// 	 $.unblockUI();
// 	 setTimeout(function(){volverDivSubContenidoColaborador()},300);
            mensajeUx = "<label>Se guardaron los cambios correctamente y el informe fue enviado al responsable " +
                "para su revisión.</label>";
            mensajesUx(mensajeUx, 1, "", "GuardarActividadVistaCol");

            $("#modalMensajeUxGuardarActividadVistaCol").on("hidden.bs.modal", function () {
                volverDivSubContenidoColaborador();
            });
        });
// 	              },fieldEvidencia,objActividad.tipoEvento);
    }
}

var listFullPsicologia = [], cursoActual;
var listPreguntasEvaluacion = [];

function iniciarCursoPsicologia(indexPsico, indexCurso) {
    $(".divListPrincipal>div").hide();
    $("#subListPsicologiaExamen").show();
    $("#subListPsicologiaExamen").find(".contenidoSubList").html("");
    var psico = listFullPsicologia[indexPsico];
    cursoActual = psico.cursos[indexCurso];
    var dataParam2 = {id: psico.id};

    listPreguntasEvaluacion = [];
    var listOpciones = [];
    callAjaxPost(URL + '/psicologia/valorizacion/preguntas', dataParam2, function (data) {
        listPreguntasEvaluacion = data.list;
        listPreguntasEvaluacion.forEach(function (val, index) {
            $("#subListPsicologiaExamen").find(".contenidoSubList")
                .append("<div class='eventoGeneral'><div class='divPreguntaCurso' id='pregCurso" + val.id + "'>" +
                    "<div class='divNombrePregunta'>" +
                    textoBotonTogglePregunta +
                    (index + 1) + ". " + val.nombre + "" +

                    "<br><label class='respuestaPregunta'></label>" +
                    "</div>" +
                    "<div class='divOpcionesGosst' style='width:100%'></div>" +
                    "</div></div>");
            var listOpciones = val.opciones;
            $("#subListPsicologiaExamen").find(".tituloSubList").html("" + textoBotonVolverContenidoColaborador + "" + psico.nombre + "")

            listOpciones.forEach(function (val1, index1) {
                var textoObservacion = "";
                if (val1.observacion.length == 0) {
                    textoObservacion = ""
                } else {
                    textoObservacion = " (" + val1.observacion + ")"
                }
                $("#subListPsicologiaExamen").find("#pregCurso" + val.id + " .divOpcionesGosst").append(
                    "<div class='opcionGosstCss' onclick='llenarRespuestaPreguntaPsico(this)'>" +
                    "<input  type='radio' name='opcionCurso" + val.id + "' id='opcionCurso" + val.id + "-" + val1.opcion.id + "'>" +
                    "<label for='opcionCurso" + val.id + "-" + val1.opcion.id + "'>" + val1.opcion.nombre + textoObservacion + "</label>" +
                    "</div>"
                );
            });
        });
        $(".respuestaPregunta").hide();
        $("#subListPsicologiaExamen").find(".contenidoSubList")
            .append("<div class='eventoGeneral' style='height: 60px;'>" +
                "<button class='btn btn-success' style='float:right' " +
                "onclick='completarEvaluacionPsicologica()' ><i class='fa fa-check' > </i>Completar Evaluación </button>" +
                "</div>");


    });
}

function llenarRespuestaPreguntaPsico(obj) {

    $(obj).find("input").prop("checked", true);
    var opcionTexto = $(obj).find("label").text();
    $(obj).parent(".divOpcionesGosst").hide();
    $(obj).parent(".divOpcionesGosst").parent(".divPreguntaCurso").find(".respuestaPregunta").show().html(opcionTexto);
}

function completarEvaluacionPsicologica() {
    listPreguntasEvaluacion.forEach(function (val, index) {
        val.opcionAsociada = null;
        val.opciones.forEach(function (val1, index1) {
            var opcionCheck = $("#opcionCurso" + val.id + "-" + val1.opcion.id).prop("checked");
            if (opcionCheck) {
                val.opcionAsociada = {id: val1.opcion.id};
            }
        });
    });
    var examenCompletado = true;
    listPreguntasEvaluacion.forEach(function (val, index) {
        if (val.opcionAsociada == null) {

            examenCompletado = false;
        } else {

        }
    });
    if (examenCompletado) {
        var cursoObj = {
            id: cursoActual.id,
            trabajadorId: getSession("trabajadorGosstId"),
            preguntas: listPreguntasEvaluacion
        }
        callAjaxPostNoLoad(URL + '/scheduler/trabajador/psicologia/evaluacion', cursoObj, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":

                    alert("Resultados guardados!");
                    marcarIconoModuloSeleccionado(9);
                    break;
                default:
                    console.log("nop")
                    break;
            }
        }, function () {
            $("#subListPsicologiaExamen").find(".tituloSubList").html("Evaluando resultados...")
            $("#subListPsicologiaExamen").find(".contenidoSubList").html("")

        })
    } else {
        alert("Falta Completar algunas preguntas");
    }

}

var escondioAviso = false;

function eliminarAvisoGosst() {
    $(".gosst-aviso").remove();
    escondioAviso = true;
}

function habilitarEvaluacionSicologicaUsuario() {

    var dataParam2 = {
        trabajadorId: getSession("trabajadorGosstId")
    };
    var numActuales = 0;
    $(".divListPrincipal")
        .append(
            "<div id='subListPsicologiaPendiente'  >" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList'></div>" +
            "</div>" +
            "<div id='subListPsicologiaCompletada'  >" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList'></div>" +
            "</div>" +
            "<div id='subListPsicologiaFutura'  >" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList'></div>" +
            "</div>" +
            "<div id='subListPsicologiaCerrada'  >" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList'></div>" +
            "</div>" +
            "<div id='subListPsicologiaExamen'  >" +
            "<div class='tituloSubList'>Cargando</div>" +
            "<div class='contenidoSubList'></div>" +
            "</div>"
        );
    $("#subListPsicologiaPendiente .tituloSubList").css({"color": colorPuntajeGosst(0.5) + " !important"});
    $("#subListPsicologiaCompletada .tituloSubList").css({"color": colorPuntajeGosst(1.0) + " !important"});
    //$("#subListPsicologiaFutura .tituloSubList").css({"color":colorPuntajeGosst(0.5)+" !important"});
    $("#subListPsicologiaCerrada .tituloSubList").css({"color": colorPuntajeGosst(0.0) + " !important"});

    $("#subListPsicologiaExamen").hide();
    var textoConfidencial = "Estimado colaborador: "
        + "<br><br>En conformidad con la Ley N° 29783 “Ley de Seguridad y Salud en el trabajo”, la siguiente encuesta es de carácter anónima y los resultados serán confidenciales y evaluados de manera global. Para garantizar ello, el equipo GOSST ha tomado las medidas necesarias para proteger la información que ingresen los colaboradores, no pudiendo relacionarse una respuesta particular con un colaborador determinado. Una vez guardada la evaluación, no quedará un rastro electrónico que permita asociar a los colaboradores con sus respuestas. Cualquier duda sobre este aspecto no dude en consultarnos al correo adrian.cox@aswan.pe"
        + "<br><br>Muchas gracias por su participación. "
        + "<br><br>GOSST"
        + "<br><br>Tu Seguridad, Nuestra Cultura." +
        "<br><br><button class='btn btn-success' onclick='eliminarAvisoGosst()'>Esconder aviso</button>";
    $(".gosst-aviso").remove();
    if (!escondioAviso) {
        $(".divTituloFull").append("<div class='gosst-aviso'>" + textoConfidencial + "</div>");
    }


    callAjaxPost(URL + '/scheduler/trabajador/psicologia', dataParam2, function (data) {
        listFullPsicologia = data.list;
        var numCursoPendiente = 0, numCursoCompleto = 0, numCursoFuturo = 0, numCursoCerrado = 0;
        var textCursoPendiente = "", textCursoCompleto = "", textCursoFuturo = "", textCursoCerrado = "";

        listFullPsicologia.forEach(function (val, index) {
            var cursos = val.cursos;

            var noticia = "<div class='cropGosst'><img src='../imagenes/psicologia.jpg'></div>";

            cursos.forEach(function (val1, index1) {
                var puntajeNoAprobado = true;
                if (val1.numPreguntasContestadas > 0) {
                    puntajeNoAprobado = false;
                }
                var textoAvance = "(" + val1.numPreguntas + " preguntas)";
                var textoAuxiliar = "";
                var btnIniciarCurso = "<button class='btn-success btn' onclick='iniciarCursoPsicologia(" + index + "," + index1 + ")'" +
                    " ><i class='fa fa-image' aria-hidden='true'></i>Iniciar evaluación</button>";
                if (val1.estado.id == 2 && puntajeNoAprobado) {
                    textoAuxiliar = btnIniciarCurso;
                } else {
                    var divCursoAsoc;
                    if (val1.estado.id == 1) {
                        textoAuxiliar = "Disponible: " + convertirFechaNormal(val1.fechaInicio)

                    }
                    if (val1.estado.id == 2) {
                        textoAuxiliar = "<label>¡Felicidades! Completó la evaluación correctamente. <label>";

                    }

                    if (val1.estado.id == 3) {
                        textoAuxiliar = "<label>Cerrado<label>";
                    }
                }

                var textCurso = "<div class='eventoGeneral' id='cursoMovil" + val1.id + "'    >" +
                    "<div id='tituloEvento'>" +
                    "<table class='table'>" +
                    "<tbody>" +
                    "<tr>" +
                    "<td style='font-size: 24px; width:30px'>" + "<i aria-hidden='true' class='fa fa-cogs'></i>" + "</td>" +
                    "<td style='text-align: left;'>" + "<strong >" + val.nombre + "  </strong> </td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='font-size: 24px; width:30px'>" + "<i aria-hidden='true' class='fa fa-info'></i>" + "</td>" +
                    "<td style='text-align: left;'>" + "<strong >" + val1.titulo + "   " + textoAvance + "</strong> </td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td colspan=3>" + noticia + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td  >  </td>" +
                    "<td>" + textoAuxiliar + "</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>" +
                    "</div>" +
                    "</div>";
                if (val1.estado.id == 2 && puntajeNoAprobado) {
                    numCursoPendiente += 1;
                    textCursoPendiente += textCurso;
                } else {
                    var divCursoAsoc;
                    if (val1.estado.id == 1) {
                        numCursoFuturo += 1;
                        textCursoFuturo += textCurso;

                    }
                    if (val1.estado.id == 2) {
                        numCursoCompleto += 1;
                        textCursoCompleto += textCurso;

                    }

                    if (val1.estado.id == 3) {
                        numCursoCerrado += 1;
                        textCursoCerrado += textCurso;
                    }
                }
            });


        });
        $("#subListPsicologiaPendiente").find(".tituloSubList")
            .html("<i aria-hidden='true' class='fa fa-book'></i>Pendientes (" + numCursoPendiente + ")" + textoBotonToggleContenidoColaborador);
        $("#subListPsicologiaPendiente").find(".contenidoSubList")
            .html(textCursoPendiente);
        $("#subListPsicologiaCompletada").find(".tituloSubList")
            .html("<i aria-hidden='true' class='fa fa-book'></i>Completadas (" + numCursoCompleto + ")" + textoBotonToggleContenidoColaborador);
        $("#subListPsicologiaCompletada").find(".contenidoSubList")
            .html(textCursoCompleto);
        $("#subListPsicologiaFutura").find(".tituloSubList")
            .html("<i aria-hidden='true' class='fa fa-book'></i>Futuras (" + numCursoFuturo + ")" + textoBotonToggleContenidoColaborador);
        $("#subListPsicologiaFutura").find(".contenidoSubList")
            .html(textCursoFuturo);
        $("#subListPsicologiaCerrada").find(".tituloSubList")
            .html("<i aria-hidden='true' class='fa fa-book'></i>Cerradas (" + numCursoCerrado + ")" + textoBotonToggleContenidoColaborador);
        $("#subListPsicologiaCerrada").find(".contenidoSubList")
            .html(textCursoCerrado);
    });

}

var listDocumentosTrabajador = [];

function habilitarDocumentosUsuario() {
    var dataParam = {
        trabajadorId: parseInt(getSession("trabajadorGosstId")),
        puestoId: parseInt(getSession("puestoGosstId")),
        empresaId: parseInt(getSession("gestopcompanyid")),
        siteId: parseInt(getSession("trabajadorSiteId"))
    };

    var listPanelesPrincipal = [];

    callAjaxPost(URL + '/procedimientoseguridad/vista_trabajador/documentos/version_dos', dataParam, function (data) {
        switch (data.CODE_RESPONSE) {
            case "05":
                listDocumentosTrabajador = data.listDocumentosTrabajador;
                var textTotal = "";

                $(".divListPrincipal").html("");

                listDocumentosTrabajador.forEach(function (val, index) {
                    var colorFondo = (val.descargaVersionId != 0 ? "gosst-aprobado" : "gosst-advertencia");

                    var evidencia =
                        (val.evidenciaNombre == "" ? "<strong style='color:red'>No hay evidencia</strong>" :
                            "<a id='evidenciaEvento" + val.id + "' class='efectoLink' target='_blank' " +
                            "href='" + URL + "/procedimientoseguridad/version/evidencia?versionId=" + val.procedimientoVersionId + " '  " +
                            "onclick='marcarVersionDescargadaTrabajador(" + index + ")'>" +
                            val.evidenciaNombre +
                            "</a>");

                    var enlaceAnexo =
                        (val.numAnexosVistaColaborador == 0 ? "Anexos (0)" :
                            "<a id='evidenciaEvento" + val.id + "' class='efectoLink' target='_blank' " +
                            "onclick='verVersionAnexos(" + val.procedimientoVersionId + ")'>" +
                            "Anexos (" + val.numAnexosVistaColaborador + ")" +
                            "</a>");

                    var valorCheck = (val.descargaVersionId != 0 ? "checked" : "");
                    var textoEstado = (val.descargaVersionId != 0 ? "Revisado" : "Pendiente");

                    var iconoVersionEstado =
                        "<div class='centerCheck contenedor1' style='text-align:left;display:flex;flex-wrap:wrap;" +
                        "margin:0px 0px 0px 0px !important;padding:0px 0px 0px 0px !important;'> " +
                        "<label class='label' style='margin:0px 0px 0px 0px !important;padding:2px 2px 0px 0px !important;'>" +
                        "<input class='label__checkbox' id='descargaVersion" + val.procedimientoVersionId + "' type='checkbox' " +
                        "style='margin:0px 0px 0px 0px !important;' disabled " + valorCheck + ">" +
                        "<span class='label__text' style='margin:0px 0px 0px 0px !important;'>" +
                        "<span class='label__check' style=' margin:0px 0px 0px 0px !important;'>" +
                        "<i class='fa fa-check icon' style=' margin:0px 0px 0px 0px !important;'></i>" +
                        "</span>" +
                        "</span>" +
                        "</label>" +
                        textoEstado +
                        "</div>";

                    var listTotal = [
                        {
                            sugerencia: "",
                            anchoLabel: "",
                            anchoDiv: "",
                            label: "<i class='fa fa-file-text'></i> Título:",
                            inputForm: val.procedimientoSeguridadNombre
                        },
                        {
                            sugerencia: "",
                            anchoLabel: "",
                            anchoDiv: "",
                            label: "<i class='fa fa-file'></i> Documento:",
                            inputForm: evidencia
                        },
                        {
                            sugerencia: "", anchoLabel: "", anchoDiv: "", label: "<i class='fa fa-book'></i> Anexos:",
                            inputForm: enlaceAnexo
                        },
                        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
                        {
                            sugerencia: "", anchoLabel: "", anchoDiv: "", label: "<i class='fa fa-eye'></i> Estado:",
                            inputForm: iconoVersionEstado
                        }
                    ];

                    textTotal += "<div class='eventoGeneral " + colorFondo + "'>";
                    listTotal.forEach(function (val, index) {
                        textTotal += "" + obtenerSubPanelModuloVersionDos(val);
                    });
                    textTotal += "</div>";
                });

                listPanelesPrincipal.push({
                    id: "subListDocumentos", clase: "", styleContenido: "",
                    nombre: "<i class='fa fa-hand-o-right'></i> " +
                        "Documentos asignados (" + listDocumentosTrabajador.length + ")",
                    contenido: "" + textTotal
                });

                agregarPanelesDivPrincipalStyle(listPanelesPrincipal, "");

                $(".listaFinalGestionGosst").hide();
                $(".contenidoFormVisible").hide();
                break;

            default:
                alert("nop");
                break;
        }
    });
}

function marcarVersionDescargadaTrabajador(pindex) {
    var docTrabObj = listDocumentosTrabajador[pindex];

    var dataParamAux = {
        descargaVersionId: parseInt(docTrabObj.descargaVersionId),
        trabajadorId: parseInt(getSession("trabajadorGosstId")),
        procedimientoVersionId: parseInt(docTrabObj.procedimientoVersionId)
    };

    callAjaxPost(URL + '/procedimientoseguridad/vista_trabajador/documentos/marcar_descarga', dataParamAux, function (data) {
        if (parseInt(docTrabObj.descargaVersionId) == 0) {
            mensajeUx = "<label>Se marcó el documento de título '" + docTrabObj.procedimientoSeguridadNombre + "' " +
                "como revisado.</label>";
            mensajesUx(mensajeUx, 1, "");

            habilitarDocumentosUsuario();
        }
    });
}

function habilitarEventosTrabajador() {

    var dataParam2 = {
        trabajadorId: getSession("trabajadorGosstId")
    };

    callAjaxPost(URL + '/trabajador/eventos', dataParam2, function (data) {
        var list = data.list;
        var listNegativa = data.listEventosNegativos;
        var contenidoImplementar = "", contenidoCompletado = "", contenidoRetrasado = "", contenidoEventInseguro = "",
            contenidoAcc = "";

        var implementarNum = 0, completarNum = 0, retrasadoNum = 0, eventoNum = 0, accidenteNum = 0;
        list.sort(function (a, b) {
            return new Date(b.fecha) - new Date(a.fecha);
        });
        listNegativa.sort(function (a, b) {
            return new Date(b.fecha) - new Date(a.fecha);
        });
        list.forEach(function (val, index) {
            var colorFondo = "gray";
            //var textEvi="<a class='btn btn-success' href='"+URL+val.urlEvidencia+"' target='_blank'  >" +
            //"<i class='fa fa-download'> </i>Descargar</a>";
            if (val.nombreEvidencia.length > 0) {
                val.nombreEvidencia = "<a class='efectoLink' target='_blank' "
                    + "href='" + URL + val.urlEvidencia + "'>" + val.nombreEvidencia + "</a>  <br>";//+textEvi;
            } else {
                val.nombreEvidencia = "<strong style='color:red'>No hay evidencia</strong>";
            }
            var textIn = "<div class='detalleFormacionTrabajador' style='border-left: 10px solid " + colorFondo + ";   '>" +
                "<div style='font-weight:600;font-size:15px'>" + val.eventoNombre + "</div>" +
                "<div ><i class='fa fa-calendar'></i>   " + val.fechaTexto + "</div>" +
                "<div ><i class='fa fa-exclamation-circle'></i> " + val.estadoNombre + "    </div>" +
                "<div ><i class='fa fa-download'></i> " + val.nombreEvidencia + "</div>" +
                "</div>";
            if (val.estado) {
                switch (val.estado.id) {
                    case 1:
                        contenidoImplementar += textIn;
                        implementarNum++;
                        break;
                    case 2:
                        contenidoCompletado += textIn;
                        completarNum++;
                        break;
                    case 3:
                        contenidoRetrasado += textIn;
                        retrasadoNum++;
                        break;
                    default:
                        contenidoImplementar += textIn;
                        implementarNum++;
                        break;
                }
            }
        });
        listNegativa.forEach(function (val, index) {
            var colorFondo = "gray";
            var textEvi = "<a class='btn btn-success' href='" + URL + val.urlEvidencia + "' target='_blank'  >" +
                "<i class='fa fa-download'> </i>Descargar</a>";
            if (val.nombreEvidencia.length > 0) {
                val.nombreEvidencia = "<a class='efectoLink' target='_blank' "
                    + "href='" + URL + val.urlEvidencia + "'>" + val.nombreEvidencia + "</a>  <br>";//+textEvi;
            } else {
                val.nombreEvidencia = "<strong style='color:red'>No hay evidencia</strong>";
            }
            var textIn = "<div class='detalleFormacionTrabajador' style='border-left: 10px solid " + colorFondo + ";   '>" +
                "<div style='font-weight:600;font-size:15px'>" + val.tipoNombre + " - " + val.eventoNombre + "</div>" +
                "<div >  " + val.fechaTexto + "</div>" +
                "<div > <i class='fa fa-download'></i>" + val.nombreEvidencia + "    </div>" +
                "</div>" +
                "";
            switch (val.eventoTipoId) {
                case 4:
                    contenidoEventInseguro += textIn;
                    eventoNum++;
                    break;
                case 5:
                    contenidoEventInseguro += textIn;
                    eventoNum++;
                    break;
                case 6:
                    contenidoAcc += textIn;
                    accidenteNum++;
                    break;
            }

        });
        var listPaneles = [
            {id: "divImplementar", nombre: "Por asistir (" + implementarNum + ")", contenido: contenidoImplementar},
            {id: "divCompletado", nombre: "Completados (" + completarNum + ")", contenido: contenidoCompletado},
            {id: "divRetrasado", nombre: "Retrasados (" + retrasadoNum + ")", contenido: contenidoRetrasado}
            // , {id:"divActos",nombre:"Actos y condiciones subestándar reportados ("+eventoNum+")",contenido:contenidoEventInseguro},
            //  {id:"divAccidntes",nombre:"Accidente ("+accidenteNum+")",contenido:contenidoAcc}
        ]
        agregarPanelesDivPrincipal(listPaneles);
        $("#divImplementar .tituloSubList").css({"color": colorPuntajeGosst(0.5) + " !important"});
        $("#divCompletado .tituloSubList").css({"color": colorPuntajeGosst(1.5) + " !important"});
        $("#divRetrasado .tituloSubList").css({"color": colorPuntajeGosst(0.0) + " !important"});
        contadorRetrasadoAlertEventos = retrasadoNum;//variable global almacenando la cantidad de Eventos retrasados.
        if (contadorRetrasadoAlertEventos > 0) {
            $("#icoEventActividades label i").remove();
            $("#icoEventActividades label").append("<i style='color:red; font-size: 1.8em;' class='fa fa-exclamation-circle'></i>");
        } else {
            $("#icoEventActividades label i").remove();
            $("#icoEventActividades label").append("");
        }
    });
}

function habilitarHistorialUsuario() {

    var dataParam2 = {
        trabajadorId: sessionStorage.getItem("trabajadorGosstId"),
        palabraEspacio: "<br>"
    };

    callAjaxPostNoLoad(URL + '/trabajador/puntajes', dataParam2, function (data) {
        $(".divListPrincipal")
            .append(
                "<div id='subHistorialCapacitacion'  >" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
                "</div>" +
                "<div id='subHistorialEpp'  >" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
                "</div>" +
                "<div id='subHistorialExam'  >" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
                "</div>"
            );

        var indicadoresSeguridad = data.indicadoresSeguridad;

        var indEvento = data.indEvento;
        var indAcc = data.indAcc;
        var indEpp = data.indEpp;
        var indExam = data.indExam;
        var indFormacion = data.indFormacion;
        var listActosReportados = data.listActosReportados;
        var primerDia = new Date();
        primerDia = convertirFechaNormal2(primerDia);
        var capacitacionesTrab = [];
        if (indFormacion.length > 0) {
            capacitacionesTrab = indFormacion[0].caps;
        }

        var indicadorRangoActual = 1;
        var capacitacionesTabla = "", programsCapList = [], entregasEppList = [], examenesList = [];
        var participacionTabla = "";
        var eppsTabla = " ", examTabla = "";


        for (var index22 = 0; index22 < capacitacionesTrab.length; index22++) {
            var programs = capacitacionesTrab[index22].programsCap;
            programs.forEach(function (val31, index31) {
                var eventoIngresa = true;
                if (val31.fechaPlaTexto == null) {
                    eventoIngresa = false;
                }
                val31.capacitacionNombre = capacitacionesTrab[index22].capacitacionNombre;
                if (val31.fechaRealTexto == null) {
                    eventoIngresa = false;
                }
                if (eventoIngresa) {
                    programsCapList.push(val31);
                }

            });

        }
        ;
        var eppsTrabajador = [];
        if (indEpp.length > 0) {
            eppsTrabajador = indEpp[0].epps;
        }
        for (var index22 = 0; index22 < eppsTrabajador.length; index22++) {
            var programs = eppsTrabajador[index22].programsEpp;
            programs.forEach(function (val31, index31) {
                var eventoIngresa = true;
                if (val31.fechaPlanificadaTexto == null) {
                    eventoIngresa = false;
                }
                val31.equipoSeguridadNombre = eppsTrabajador[index22].equipoSeguridadNombre;
                if (val31.fechaEntregaTexto == null) {
                    eventoIngresa = false;
                }
                if (eventoIngresa) {
                    entregasEppList.push(val31);
                }

            });

        }
        ;
        var examsTrab = [];
        if (indExam.length > 0) {
            examsTrab = indExam[0].exams;
        }
        examsTrab.forEach(function (val, index) {
            var programs = val.programsExams;
            programs.forEach(function (val31, index1) {
                var eventoIngresa = true;
                if (val31.fechaInicialTexto == null) {
                    eventoIngresa = false;
                }
                val31.examenMedicoNombre = val.examenMedicoNombre;
                if (val31.fechaFinTexto == null) {
                    eventoIngresa = false;
                }
                if (eventoIngresa) {
                    examenesList.push(val31);
                }
            });

        });
        programsCapList.sort(function (a, b) {
            return new Date(a.fechaPlanificada) - new Date(b.fechaPlanificada);
        });
        entregasEppList.sort(function (a, b) {
            return new Date(a.fechaPlanificada) - new Date(b.fechaPlanificada);
        });
        programsCapList.forEach(function (val31, index31) {
            var colorFondo = "#bbb3b4";
            var horaProgramada = "";
            var textoFechaPlaneada = "";
            var textoFechaVigencia = "----";
            var primerDia = new Date();
            primerDia = convertirFechaNormal2(primerDia);
            var enRangoInicial = fechaEnRango(primerDia, val31.fechaPlaTexto, val31.fechaRealTexto)
            textoFechaPlaneada = "" + convertirFechaNormal(val31.fechaPlaTexto);
            textoFechaVigencia = "" + convertirFechaNormal(val31.fechaRealTexto);
            var textoAsistencia = "Sin asistir", textoAprobacion = "";
            if (val31.progCapTrabId > 0) {
                textoAsistencia = "Asistió";

                if (val31.tipoNotaTrabId == 1) {
                    textoAprobacion = "<strong>Aprobado</strong>";
                    colorFondo = "#9BBB59";
                } else {
                    textoAprobacion = "<strong>No aprobado</strong>";
                    colorFondo = "#bb596b";
                }
            }
            if (restaFechas(val31.fechaPlaTexto, primerDia) < 0) {
                textoFechaVigencia = "Próxima: " + convertirFechaNormal(val31.fechaRealTexto);
                horaProgramada = val31.horaPlanificada;
            }

            if (val31.tipoNotaTrabId == 1 && enRangoInicial) {

                textoFechaVigencia = "Vigente hasta: " + convertirFechaNormal(val31.fechaRealTexto);
                indicadorRangoActual =
                    indicadorRangoActual + (1 / capacitacionesTrab.length);
                horaProgramada = "";
            }

            capacitacionesTabla += "<div class='detalleFormacionTrabajador' style='border-left: 10px solid " + colorFondo + ";   '>" +
                "<div style='font-weight:600;font-size:15px'>" + val31.capacitacionNombre + "</div>" +
                "<div >Realizado : " + textoFechaPlaneada + "    " + horaProgramada + "</div>" +
                "<div >" + textoFechaVigencia + "    </div>" +
                "<div >" + textoAsistencia + "     " + textoAprobacion + " </div>" +
                "</div>";
        })

        var textoFechaVigenciaEpp = "---", textoFechaEntregaEpp = "";
        entregasEppList.forEach(function (val, index) {
            var colorFondo = "#bbb3b4";
            var primerDia = new Date();
            var horaProgramada = "";
            primerDia = convertirFechaNormal2(primerDia);
            var enRangoInicial = fechaEnRango(primerDia, val.fechaPlanificadaTexto, val.fechaEntregaTexto)
            textoFechaEntregaEpp = "Última entrega: " + convertirFechaNormal(val.fechaPlanificada);
            var boolEntreFechas = false;
            if (enRangoInicial) {
                boolEntreFechas = true;
            }
            if (restaFechas(val.fechaPlanificadaTexto, primerDia) < 0) {
                textoFechaVigenciaEpp = "Próxima Entrega: " + convertirFechaNormal(val.fechaEntregaTexto);
                horaProgramada = val.horaPlanificada;
            }
            if (val.tipoNotaTrabId != null && boolEntreFechas) {
                colorFondo = "#9BBB59";
                textoFechaVigenciaEpp = "Próxima Entrega: " + convertirFechaNormal(val.fechaEntregaTexto);
            }
            eppsTabla += "<div class='detalleEppsTrabajador' style='border-left: 10px solid " + colorFondo + "; '>" +
                "<div style='font-weight:600;font-size:15px'>" + val.equipoSeguridadNombre + "</div>" +
                "<div >" + textoFechaEntregaEpp + "    </div>" +
                "<div >" + textoFechaVigenciaEpp + "    </div>" +
                "</div>";
        })


        examenesList.forEach(function (val, index) {
            var colorFondo = "#bb596b";
            var fechaExamen = "No Vigente";
            var primerDia = new Date();
            primerDia = convertirFechaNormal2(primerDia);
            var enRangoInicial = fechaEnRango(primerDia, val.fechaInicialTexto, val.fechaFinTexto);
            var fechaLlevada = "Realizada: " + convertirFechaNormal(val.fechaInicialTexto);
            var boolEntreFechas = false;
            if (enRangoInicial) {
                boolEntreFechas = true;
            }
            if (val.tipoNotaTrabId == 1 && boolEntreFechas) {
                fechaExamen = "Vigente hasta: " + convertirFechaNormal(val.fechaFinTexto);
                colorFondo = "#9BBB59";
                index22 = examsTrab.length;
            }
            examTabla += "<div class='detalleEppsTrabajador' style='border-left: 10px solid " + colorFondo + "; '>" +
                "<div style='font-weight:600;font-size:15px'>" + val.examenMedicoNombre + "</div>" +
                "<div >" + fechaLlevada + "    </div>" +
                "<div >" + fechaExamen + "    </div>" +
                "</div>";

        })
        $("#subHistorialCapacitacion").find(".tituloSubList").html("<i aria-hidden='true' class='fa fa-graduation-cap'></i>Formaciones " + textoBotonToggleContenidoColaborador);
        $("#subHistorialCapacitacion").find(".contenidoSubList").html(
            capacitacionesTabla
        );
        $("#subHistorialEpp").find(".tituloSubList").html("<i aria-hidden='true' class='fa fa-fire-extinguisher'></i>Equipos Seguridad " + textoBotonToggleContenidoColaborador);
        $("#subHistorialEpp").find(".contenidoSubList").html(
            eppsTabla
        );
        $("#subHistorialExam").find(".tituloSubList").html("<i aria-hidden='true' class='fa fa-medkit'></i>Exámenes Médicos " + textoBotonToggleContenidoColaborador);
        $("#subHistorialExam").find(".contenidoSubList").html(
            examTabla
        );
    })
}

function ocultarResultadoFormacionesTrabajador() {
    $("#modalResultadoFormacionesTrabajador").modal("hide");
}

function verResultadoFormacionesTrabajador() {
    trabajadorResultadoId = $("#selAutoTrabajador").val();
    verResultadoBuscarFormaciones();
}


function verResultadoBuscarFormaciones() {
    //console.log(trabajadorResultadoId);
    var dataParam = {
        trabajadorId: trabajadorResultadoId,
        palabraEspacio: "<br>"
    };

    callAjaxPost(
        URL + '/trabajador/buscar/formaciones',
        dataParam,
        function (data) {

            var contenido = "";

            var listContenido = [];

            var indFormacion = data.indFormacion;
            var primerDia = new Date();
            primerDia = convertirFechaNormal2(primerDia);
            var capacitacionesTrab = [];
            if (indFormacion.length > 0) {
                capacitacionesTrab = indFormacion[0].caps;
            }

            var indicadorRangoActual = 1;
            var capacitacionesTablaResultado = "";
            var estadoFormacion;

            var colorFondo = "#bbb3b4";
            var horaProgramada = "";
            for (var index22 = 0; index22 < capacitacionesTrab.length; index22++) {
                if (index22 == 0) {
                    indicadorRangoActual = 0
                }
                var programs = capacitacionesTrab[index22].programsCap;
                colorFondo = "#bbb3b4"
                var textoFechaVigencia = "----";
                horaProgramada = "";
                estadoFormacion = 0;

                for (var index31 = 0; index31 < programs.length; index31++) {
                    var primerDia = new Date();
                    primerDia = convertirFechaNormal2(primerDia);
                    if (programs[index31].fechaPlaTexto == null) {
                        programs[index31].fechaPlaTexto = primerDia;
                    }

                    if (programs[index31].fechaRealTexto == null) {
                        programs[index31].fechaRealTexto = programs[index31].fechaPlaTexto;
                    }
                    var enRangoInicial = fechaEnRango(primerDia, programs[index31].fechaPlaTexto, programs[index31].fechaRealTexto)
                    if (!enRangoInicial && programs[index31].progCapEstado == 2) {
                        textoFechaVigencia = "Venció el: " + convertirFechaNormal(programs[index31].fechaRealTexto);
                    }
                    if (restaFechas(programs[index31].fechaPlaTexto, primerDia) < 0) {
                        textoFechaVigencia = "Próxima: " + convertirFechaNormal(programs[index31].fechaRealTexto);
                        horaProgramada = programs[index31].horaPlanificada;
                    }

                    if (programs[index31].tipoNotaTrabId == 1 && enRangoInicial) {
                        colorFondo = "#9BBB59";
                        textoFechaVigencia = "Vigente hasta: " + convertirFechaNormal(programs[index31].fechaRealTexto);
                        indicadorRangoActual =
                            indicadorRangoActual + (1 / capacitacionesTrab.length);
                        index31 = programs.length;
                        horaProgramada = "";
                        estadoFormacion = 1;
                    }


                }


                listContenido.push({
                    sugerencia: "",
                    label: "Capacitacion Nombre: ",
                    inputForm: capacitacionesTrab[index22].capacitacionNombre
                });
                listContenido.push({sugerencia: "", label: "Fecha Vigencia: ", inputForm: textoFechaVigencia});
                listContenido.push({
                    sugerencia: "",
                    label: "Hora Programada: ",
                    inputForm: horaProgramada + " (horas)"
                });

                if (estadoFormacion == 1) {
                    listContenido.push({
                        sugerencia: "",
                        label: "Estado: ",
                        inputForm: iconoGosst.aprobado + " (aprobado)"
                    });
                } else {
                    listContenido.push({
                        sugerencia: "",
                        label: "Estado: ",
                        inputForm: iconoGosst.desaprobado + " (desaprobado)"
                    });
                }

                listContenido.push({
                    sugerencia: "",
                    label: "----------------------------------------- ",
                    inputForm: "----------------------------------------------------------------------------"
                });

            }

            listContenido.forEach(function (val) {
                contenido += obtenerSubPanelModuloGeneral(val);
            });

            var modalOptions = {
                id: "modalResultadoFormacionesTrabajador",
                nombre: "<i class='fa fa-graduation-cap'></i>Formaciones Trabajador <br>",
                contenido: contenido
            };

            crearModalPrincipalUsuario(modalOptions, function () {
                /*  if($("#filtroAreasFichaQuimica").length > 0){
				          return;
				       }
				       */
            }, false);

            insertMenu();
            $("#modalResultadoFormacionesTrabajador").modal("show");

        });
}

function habilitarAyudaUsuario() {
    habilitarVistaUsuario();
}

var listFullPeligros;
var listFullActividades;
var listActividadesMarcadas = [];


var listEstadosValidarColaborador = [];
var listActividadesResponsableColaborador = [];
var listPuestosResponsableColaborador = [];
var listAreasResponsableColaborador = [];
var listDivisionesResponsableColaborador = [];
var listTrabajadoresResponsableColaborador = [];
var listIpercColaborador = [];

function habilitarIpercUsuario() {

    $(".divListPrincipal")
        .append("<div id='subListDocumentosIperc'>" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList'></div>" +
            "</div>");

    if (parseInt(getSession("gestopcompanyid")) == 336) {
        cargarDocumentosIperc(cargarContenedoresRestantesIpercAjinomoto);
    } else {
        cargarDocumentosIperc(cargarContenedoresRestantesIperc);
    }

}

function cargarDocumentosIperc(functionCallBack) {
    var dataParamAux = {
        trabajadorId: getSession("trabajadorGosstId"),
        verDocumentosEnIperc: 1
    };

    callAjaxPost(URL + '/scheduler/trabajador/documentos', dataParamAux, function (data) {

        var documentos = data.listpeligros;
        var docsTabla = "";
        var numVerDocumentosEnIperc = 0;

        documentos.forEach(
            function (val, index) {
                var colorFondo = "gray";
                var iconoEvi = "<a id='evidenciaEvento" + val.id + "' class='efectoLink' target='_blank' " +
                    "href='" + URL + "/procedimientoseguridad/version/evidencia?versionId=" + val.positionId + "'>" +
                    "" + val.evidenciaNombre +
                    "</a>";

                var iconoAnexo = "<a id='evidenciaEvento" + val.id + "' class='efectoLink' target='_blank' " +
                    "onclick='verVersionAnexos(" + val.positionId + ")'> Anexos (" + val.numAnexosVistaColaborador + ")" +
                    "</a>";

                if (val.evidenciaNombre == "----" || val.evidenciaNombre == "" || val.evidenciaNombre == null) {
                    iconoEvi = "<strong style='color:red'>No hay evidencia</strong>"
                }

                var textoFechaVigencia = "<i class='fa fa-calendar-check-o'></i>" +
                    "&nbspPróxima revisión: " + convertirFechaNormal(val.fechaActualizacion);

                if (val.estadoDocumento.id == 2) {
                    numVerDocumentosEnIperc++;
                } else {
                    numVerDocumentosEnIperc++;
                    textoFechaVigencia = "<i class='fa fa-calendar-plus-o'></i>" +
                        "&nbspSe actualizará: " + convertirFechaNormal(val.fechaActualizacion);
                }

                var textoDocs = "";

                textoDocs = "<div class='detalleFormacionTrabajador' style='border-left: 10px solid " + colorFondo + ";'>" +
                    "<div style='font-weight:600;font-size:15px;'>" +
                    val.procedimientoSeguridadNombre +
                    "</div>" +
                    "<div>" + textoFechaVigencia + "</div>" +
                    "<div>" +
                    "<i class='fa fa-download' aria-hidden='true'></i>" +
                    iconoEvi + "" +
                    "</div>" +
                    "<div>" +
                    "<i class='fa fa-book' aria-hidden='true'></i>" +
                    iconoAnexo + "" +
                    "</div>" +
                    "</div>";

                docsTabla += textoDocs;
            });

        $("#subListDocumentosIperc").find(".tituloSubList")
            .html("<i aria-hidden='true' class='fa fa-book'></i> " +
                "Documentos IPERC (" + numVerDocumentosEnIperc + ")" + textoBotonToggleContenidoColaborador);

        $("#subListDocumentosIperc").find(".contenidoSubList")
            .html(docsTabla);

        functionCallBack();
    });
}

function cargarContenedoresRestantesIperc() {
    var textoForm = "";

    var listPaneles = [
        {id: "subVerMatrizIperc", nombre: "", contenido: ""},
        {id: "subConsultarMatrizIperc", nombre: "", contenido: ""},
        {id: "subDescargarMatrizIperc", nombre: "", contenido: ""},
        {id: "subDescargarRecomendaciones", nombre: "", contenido: ""},
        {id: "subListActividades", nombre: "", contenido: ""},
        {id: "subListPeligros", nombre: "", contenido: ""}
    ];

    agregarPanelesDivPrincipalColaborador(listPaneles);

    var buttonAtajo1 = "<button style='float:left' onclick='volverVistaIperc()' class='btn btn-success'>" +
        "<i class='fa fa-2x fa-arrow-left'></i>" +
        "</button>";

    var buttonAtajo2 = "<button onclick='verTablaResumenIpercResponsable(1)' class='btn btn-success'>" +
        "<i class='fa fa-2x fa-arrow-right'></i>" +
        "</button>";

    $(".divListPrincipal").find("#subVerMatrizIperc .tituloSubList")
        .html(buttonAtajo2 + "<i class='fa fa-check-square-o'></i> Validar Matriz IPERC asignada al trabajador ");

    var buttonAtajo3 = "<button onclick='verTablaResumenIpercResponsable(0)' " +
        "class='btn btn-success'><i class='fa fa-2x fa-arrow-right'></i></button>";

    $(".divListPrincipal").find("#subConsultarMatrizIperc .tituloSubList")
        .html(buttonAtajo3 + "<i class='fa fa-search'></i> Consultar matriz IPERC en la empresa ");

    var buttonDescargaRecomendacion = "<a style='float: right;font-size: 12px;' target='_blank' class='btn btn-success' " +
        "href='" + URL + "/puesto/detalle/hojaruta?puestoTrabajoId=" + getSession("puestoGosstId") + "'>" +
        "<i class='fa fa-download' aria-hidden='true'></i>" +
        "</a>";

    $(".divListPrincipal").find("#subDescargarRecomendaciones .tituloSubList")
        .html(buttonDescargaRecomendacion + "<i class='fa fa-download'></i> Descargar recomendaciones " +
            "(Actualizadas el: " + getSession("fechaActualizacionPuesto") + " )")

    var buttonDescargaIperc = "<a style='float: right;font-size: 12px;' target='_blank' class='btn btn-success' " +
        "href='" + URL + "/iperc/trabajador/excel?trabajadorId=" + getSession("trabajadorGosstId") + "'>" +
        "<i class='fa fa-download' aria-hidden='true'></i>" +
        "</a>";

    $(".divListPrincipal").find("#subDescargarMatrizIperc .tituloSubList")
        .html(buttonDescargaRecomendacion + "<i class='fa fa-download'></i> Descargar último IPERC");

    var dataParam = {
        trabajadorId: getSession("trabajadorGosstId"),
        empresaId: getSession("gestopcompanyid")
    }

    callAjaxPost(URL + '/scheduler/trabajador/perfil', dataParam, function (data) {
        listFullPeligros = data.listpeligros;
        listIpercColaborador = data.listIperc;
        listFullActividades = [];

        if (parseInt(getSession("gestopcompanyid")) != 336) {

            listFullPeligros.forEach(function (val, index) {
                var listFullActividadesAux = listarStringsDesdeArray(listFullActividades, "nombre");

                if (listFullActividadesAux.indexOf(val.actividad) == "-1") {
                    listFullActividades.push({nombre: val.actividad});
                }
            });

            $(".divListPrincipal").find("#subListActividades .contenidoSubList")
                .append("<div class='eventoGeneral'>" +
                    "<div id='tituloEvento'>" +
                    "<table class='table'>" +
                    "<tbody>" +
                    "</tbody>" +
                    "</table>" +
                    "</div>");

            $(".divListPrincipal").find("#subListActividades .contenidoSubList table tbody")
                .append("<tr style='background-color:#dadcdb'>" +
                    "<td style='width:40px'>" +
                    "<input checked id='inputCheckActividadIperTotal' onchange='verPeligrosAcordeActividades(1)' " +
                    "type='checkbox' class='form-control'>" +
                    "</td>" +
                    "<td style='text-align:left;vertical-align:middle;'>" +
                    "TODOS" +
                    "</td>" +
                    "</tr>");

            listFullActividades.forEach(function (val, index) {
                var textChecked = "checked";

                if (listActividadesMarcadas.length > 0) {
                    textChecked = (listActividadesMarcadas[index] ? "checked" : "");
                }

                $(".divListPrincipal").find("#subListActividades .contenidoSubList table tbody")
                    .append("<tr>" +
                        "<td style='width: 40px'>" +
                        "<input " + textChecked + " id='inputCheckActividadIper" + index + "' onchange='verPeligrosAcordeActividades(0)' " +
                        "type='checkbox' class='form-control'>" +
                        "</td>" +
                        "<td style='text-align:left;vertical-align:middle;'>" +
                        val.nombre +
                        "</td>" +
                        "</tr>");
            });

            verPeligrosAcordeActividades();

        }

        listEstadosValidarColaborador = data.estadosValidar;
        listAreasResponsableColaborador = data.areas;

        if (numAreasSupervisor > 0) {
            listAreasResponsableColaborador = data.areasSupervisor;
        }

        if (numAreasJefe > 0) {
            listAreasResponsableColaborador = data.areasJefe;
        }

        if (numAreasGerente > 0) {
            listAreasResponsableColaborador = data.areasGerente;
        }

        listPuestosResponsableColaborador = data.puestos;
        listActividadesResponsableColaborador = data.actividades;
        listDivisionesResponsableColaborador = data.divisones;
        listTrabajadoresResponsableColaborador = data.trabajadores;

        if (listAreasResponsableColaborador.length == 0) {
            $("#subVerMatrizIperc").remove();
            $("#subConsultarMatrizIperc").remove();
        } else {
            $("#subDescargarMatrizIperc").remove();
        }

        if (parseInt(getSession("gestopcompanyid")) == 336) {
            $("#subListActividades").hide();
            $("#subListPeligros").hide();
            $("#subDescargarRecomendaciones").hide();
        }
    });
}

function cargarContenedoresRestantesIpercAjinomoto() {
    var textoForm = "";

    var listPaneles = [
        {id: "subVerMatrizIperc", nombre: "", contenido: ""},
        {id: "subConsultarMatrizIperc", nombre: "", contenido: ""},
        {id: "subDescargarMatrizIperc", nombre: "", contenido: ""}
    ];

    agregarPanelesDivPrincipalColaborador(listPaneles);

    var buttonAtajo1 = "<button style='float:left' onclick='volverVistaIperc()' class='btn btn-success'>" +
        "<i class='fa fa-2x fa-arrow-left'></i>" +
        "</button>";

    var buttonAtajo2 = "<button onclick='verTablaResumenIpercResponsable(1)' class='btn btn-success'>" +
        "<i class='fa fa-2x fa-arrow-right'></i>" +
        "</button>";

    $(".divListPrincipal").find("#subVerMatrizIperc .tituloSubList")
        .html(buttonAtajo2 + "<i class='fa fa-check-square-o'></i> Validar Matriz IPERC asignada al trabajador ");

    var buttonAtajo3 = "<button onclick='verTablaResumenIpercResponsable(0)' " +
        "class='btn btn-success'><i class='fa fa-2x fa-arrow-right'></i></button>";

    $(".divListPrincipal").find("#subConsultarMatrizIperc .tituloSubList")
        .html(buttonAtajo3 + "<i class='fa fa-search'></i> Consultar matriz IPERC en la empresa ");

    var buttonDescargaRecomendacion = "<a style='float: right;font-size: 12px;' target='_blank' class='btn btn-success' " +
        "href='" + URL + "/puesto/detalle/hojaruta?puestoTrabajoId=" + getSession("puestoGosstId") + "'>" +
        "<i class='fa fa-download' aria-hidden='true'></i>" +
        "</a>";

    $(".divListPrincipal").find("#subDescargarMatrizIperc .tituloSubList")
        .html(buttonDescargaRecomendacion + "<i class='fa fa-download'></i> Descargar último IPERC");

    var dataParam = {
        trabajadorId: getSession("trabajadorGosstId"),
        empresaId: getSession("gestopcompanyid")
    }

    callAjaxPost(URL + '/scheduler/trabajador/perfil', dataParam, function (data) {
        listIpercColaborador = data.listIperc;
        listFullActividades = [];

        listEstadosValidarColaborador = data.estadosValidar;
        listAreasResponsableColaborador = data.areas;

        if (numAreasSupervisor > 0) {
            listAreasResponsableColaborador = data.areasSupervisor;
        }

        if (numAreasJefe > 0) {
            listAreasResponsableColaborador = data.areasJefe;
        }

        if (numAreasGerente > 0) {
            listAreasResponsableColaborador = data.areasGerente;
        }

        listPuestosResponsableColaborador = data.puestos;
        listActividadesResponsableColaborador = data.actividades;
        listDivisionesResponsableColaborador = data.divisones;
        listTrabajadoresResponsableColaborador = data.trabajadores;

        if (listAreasResponsableColaborador.length == 0) {
            $("#subVerMatrizIperc").remove();
            $("#subConsultarMatrizIperc").remove();
        } else {
            $("#subDescargarMatrizIperc").remove();
        }


        $("#subListActividades").hide();
        $("#subListPeligros").hide();
        $("#subDescargarRecomendaciones").hide();
    });
}

var tituloAnteriorColaborador = "";

function iniciarFiltroIpercResponsable() {
    $(".camposFiltroTabla").show();
    $("#wrapperIpercResponsable").hide();

    $("#btnIniciarFiltro").hide();
    $("#btnAplicarFiltro").show();

    $("#btnVolverFiltro").show();
    $("#btnVolverDetalle").hide();

    $("#btnValidarFiltro").hide();
    $("#btnReiniciarFiltro").hide();
    $("#btnAgregarActividad").hide();
    $("#btnReporteIperc").hide();
    $("#selFiltroIperc").hide();
    $("#labelFiltroIperc").hide();


}

function volverVistaFiltro() {
    $(".camposFiltroTabla").hide();
    $("#wrapperIpercResponsable").show();

    $("#btnIniciarFiltro").show();
    $("#btnAplicarFiltro").hide();

    $("#btnVolverFiltro").hide();
    $("#btnVolverDetalle").show();

    $("#btnValidarFiltro").show();
    $("#btnReiniciarFiltro").show();
    $("#btnAgregarActividad").show();
    $("#btnReporteIperc").show();
    $("#selFiltroIperc").show();
    $("#labelFiltroIperc").show();
}

function reiniciarFiltroIpercResponsable() {
    $(".camposFiltroTabla").show();
    crearSelectOneMenuObligMultipleCompleto
    ("selEstadoFiltro", "", listEstadosValidarColaborador, "id", "nombreCompleto",
        "#divSelectEstadoFiltroIpercResponsable", "Todos");
    //crearSelectOneMenuObligMultipleCompleto
    // ("selAreaFiltro", "",listAreasResponsableColaborador, "areaId","areaName",
    //		 "#divSelectAreaFiltroIpercResponsable","Todas");
    crearSelectOneMenuObligMultipleCompleto
    ("selPuestoFiltro", "", listPuestosResponsableColaborador, "positionId", "positionName",
        "#divSelectPuestoFiltroIpercResponsable", "Todos");
    crearSelectOneMenuObligMultipleCompleto
    ("selActividadFiltro", "", listActividadesResponsableColaborador, "activityId", "activityName",
        "#divSelectActividadFiltroIpercResponsable", "Todas")
    aplicarFiltroIpercResponsable();
}

function aplicarFiltroIpercResponsable() {


    verDetalleIpercColaborador();
    volverVistaFiltro();
}

function validarFiltroIpercResponsable() {
    var listEnviar = [];
    var listEvaluado = [];
    detallesFullIpercColaborador.forEach(function (val) {
        var puedeElaborar = false;
        var puedeRevisar = false;
        var puedeAprobar = false;
        var isEvaluado = false;
        if (numAreasSupervisor > 0) {
            puedeElaborar = true;
            puedeRevisar = false;
            puedeAprobar = false;
            isEvaluado = (val.trabajadorElaborado.trabajadorId != null);
        }
        if (numAreasJefe > 0) {
            puedeElaborar = false;
            puedeRevisar = true;
            puedeAprobar = false;
            isEvaluado = (val.trabajadorRevisado.trabajadorId != null);
        }
        if (numAreasGerente > 0) {
            puedeElaborar = false;
            puedeRevisar = false;
            puedeAprobar = true;
            isEvaluado = (val.trabajadorAprobado.trabajadorId != null);
        }
        if (!isEvaluado) {
            var trabajadorGeneral = {trabajadorId: getSession("trabajadorGosstId")};
            var trabajadorElaborado = null,
                trabajadorRevisado = null,
                trabajadorAprobado = null;
            if (puedeElaborar) {
                trabajadorElaborado = trabajadorGeneral
            }
            ;
            if (puedeRevisar) {
                trabajadorRevisado = trabajadorGeneral
            }
            ;
            if (puedeAprobar) {
                trabajadorAprobado = trabajadorGeneral
            }
            ;
            listEnviar.push(
                {
                    ipercDetailEvalID: val.ipercDetailEvalID,
                    trabajadorElaborado: trabajadorElaborado,
                    trabajadorRevisado: trabajadorRevisado,
                    trabajadorAprobado: trabajadorAprobado,
                }
            )
        } else {
            listEvaluado.push({ipercDetailEvalID: val.ipercDetailEvalID,})
        }

    });
    var textoEvaluado = "" + listEvaluado.length + " evaluacion(es) ya evaluadas."
    if (listEvaluado.length == 0) {
        textoEvaluado = ""
    }
    ;
    var textoEnviar = "¿Está seguro de validar estas " + listEnviar.length + " evaluaciones? " + textoEvaluado;
    if (listEnviar.length == 0) {
        textoEnviar = "No hay evaluaciones por evaluar. " + textoEvaluado;
        alert(textoEnviar);
        return;
    }
    ;

    var r = confirm(textoEnviar);
    if (r) {
        callAjaxPost(URL + '/trabajador/iperc/validar',
            listEnviar, function (data) {
                alert("Datos guardados. " + data.mensaje);
                aplicarFiltroIpercResponsable();
            });
    }

}

var listPositionAjinomoto = [];
var positionAjinomoto;

function verAcordeAreaActividad() {
    var areaId = parseInt($("#selAreaActividad").val());

    crearSelectOneMenuObligUnitarioCompleto("selPuestoActividad", "", listPuestosResponsableColaborador.filter(function (val) {
        return val.areaId == areaId;
    }), "positionId", "positionName", "#divPuestoActividad", "---");

    if (parseInt(getSession("gestopcompanyid")) == 336) {
        listPositionAjinomoto = [];

        listPositionAjinomoto = listPuestosResponsableColaborador.filter(function (val) {
            return val.areaId == areaId;
        });

        positionAjinomoto = listPositionAjinomoto[0].positionId;
    }

}

function agregarActividadIpercColaborador() {
    $("#agregarActividadIperc").show();
    $("#wrapperIpercResponsable").hide();
    crearSelectOneMenuObligUnitarioCompleto("selAreaActividad", "verAcordeAreaActividad()",
        listAreasResponsableColaborador, "areaId",
        "areaName", "#divAreaActividad", "---");
    verAcordeAreaActividad();

    $("#btnAgregarActividad").hide();
    $("#btnVolverDetalle").hide();
    $("#buttonVolverFiltro").hide();
    $("#btnValidarFiltro").hide();
    $("#btnReiniciarFiltro").hide();
    $("#btnIniciarFiltro").hide();
    $("#btnVerEvalValidar").hide();
    $("#btnReporteIperc").hide();

    $("#btnCancelarAgregarActiv").show();
    $("#btnGuardarActividad").show();
}

function volverDetalleIpercColaborador() {
    $("#agregarActividadIperc").hide();
    $("#wrapperIpercResponsable").show();

    $("#btnAgregarActividad").show();
    $("#btnVolverDetalle").show();
    $("#btnVolverFiltro").hide();
    $("#btnValidarFiltro").show();
    $("#btnReiniciarFiltro").show();
    $("#btnIniciarFiltro").show();
    $("#btnVerEvalValidar").show();
    $("#btnReporteIperc").show();

    $("#btnCancelarAgregarActiv").hide();
    $("#btnGuardarActividad").hide();
}

function guardarActividadIpercColaborador() {

    var areaId = parseInt($("#selAreaActividad").val());
    var positionId = parseInt($("#selPuestoActividad").val());

    if (parseInt(getSession("gestopcompanyid")) != 336) {
        positionId = parseInt($("#selPuestoActividad").val());
    } else {
        positionId = positionAjinomoto;
    }

    console.log(positionId);

    var actividad = $("#inputActividadColaborador").val();

    var dataParam = {
        activityId: 0,
        activityName: actividad.toUpperCase(),
        positionActivityId: 0,
        positionId: positionId,
        isDirectedToIperc: (parseInt(ipercEdicionObj.mdfTypeId) == 1 ? 1 : 0)
    };

    callAjaxPost(URL + '/actividad/save', dataParam, function (data) {
        if (data.mensaje.length > 0) {
            alert(data.mensaje);
        } else {
            alert("Actividad Guardada correctamente!");
            volverDetalleIpercColaborador();

            listAreasResponsableColaborador.forEach(function (val) {
                if (val.areaId == areaId) {
                    val.selected = 1;
                }
            });

            filtrarMayorArea = true;
            verTablaResumenIpercResponsable(isEditarGeneral);
        }
    });
}

function verPorValidarIpercResponsable() {
    $(".camposFiltroTabla").show();
    listEstadosValidarColaborador.forEach(function (val) {
        val.selected = 0;
        if (val.id == 1 || val.id == 2 || val.id == 3) {
            val.selected = 1;
        }
    });
    crearSelectOneMenuObligMultipleCompleto
    ("selEstadoFiltro", "", listEstadosValidarColaborador, "id", "nombre",
        "#divSelectEstadoFiltroIpercResponsable", "Todos");
    //crearSelectOneMenuObligMultipleCompleto
    // ("selAreaFiltro", "",listAreasResponsableColaborador.forEach(function(val,index){val.selected = 0;if(index == 0){val.selected = 1;}  }), "areaId","areaName",
    //		 "#divSelectAreaFiltroIpercResponsable","Todas");
    crearSelectOneMenuObligMultipleCompleto
    ("selPuestoFiltro", "", listPuestosResponsableColaborador.forEach(function (val) {
            val.selected = 0
        }), "positionId", "positionName",
        "#divSelectPuestoFiltroIpercResponsable", "Todos");
    crearSelectOneMenuObligMultipleCompleto
    ("selActividadFiltro", "", listActividadesResponsableColaborador.forEach(function (val) {
            val.selected = 0
        }), "activityId", "activityName",
        "#divSelectActividadFiltroIpercResponsable", "Todas")
    $(".camposFiltroTabla").hide();
    aplicarFiltroIpercResponsable();
}

var filtrarMayorArea = true;
var isEditarGeneral = 0;

function verTablaResumenIpercResponsable(isEditar) {
    isEditarGeneral = isEditar;

    if (listIpercColaborador.length == 0) {
        alert("No tiene IPERCs asignados/pendientes");
        return;
    }

    isEditar = (parseInt(isEditar) == 1);

    $("#ctrlImplModal").remove();
    $("#divIpercResponsableTabla").remove();
    $("#wrapperIpercResponsable").remove();
    $(".divContainerGeneral").hide();

    var buttonVolver = "<button type='button' id='btnVolverDetalle' class='btn btn-success' style='margin-right:10px;' " +
        "onclick='volverVistaIperc()' title='Volver'>" +
        "<i class='fa fa-sign-out fa-rotate-180'></i>" +
        "</button>";

    var buttonVolverFiltro = "<button style='display:none' type='button' id='btnVolverFiltro' class='btn btn-info' " +
        "style='margin-right:10px;' onclick='volverVistaFiltro()' title='Volver'>" +
        "<i class='fa fa-sign-out fa-rotate-180'></i>" +
        "</button>";

    var buttonFiltro = "<button type='button' class='btn btn-info' id='btnIniciarFiltro' style='margin-right:10px;' " +
        "onclick='iniciarFiltroIpercResponsable()' title='Ver filtros'>" +
        "<i class='fa fa-filter'></i>" +
        "</button>";

    var buttonFiltroAplicar = "<button type='button' class='btn btn-info gosst-aprobado-total' id='btnAplicarFiltro' " +
        "style='margin-right:10px;' onclick='aplicarFiltroIpercResponsable()' title='Aplicar filtros'>" +
        "<i class='fa fa-filter'></i>" +
        "</button>";

    var buttonFiltroRefresh = "<button type='button' class='btn btn-success' id='btnReiniciarFiltro' style='margin-right:10px;' " +
        "onclick='reiniciarFiltroIpercResponsable()' title='Refresh'>" +
        "<i class='fa fa-refresh'></i>" +
        "</button>";

    var buttonReporteIperc = "<button type='button' class='btn btn-success' id='btnReporteIperc' style='margin-right:10px;' " +
        "onclick='descargarMatrizColaborador()' title='Descargar reporte'>" +
        "<i class='fa fa-download'></i>" +
        "</button>";

    var buttonFiltroValidar = "<button type='button' class='btn btn-success' id='btnValidarFiltro' style='margin-right:10px;' " +
        "onclick='validarFiltroIpercResponsable()' title='Validar Evaluaciones'>" +
        "<i class='fa fa-check'></i>" +
        "</button>";

    var buttonFiltroValidarEstado = "<button type='button' class='btn btn-success' id='btnVerEvalValidar' style='margin-right:10px;' " +
        "onclick='verPorValidarIpercResponsable()' title='Ver Evaluaciones Por Validar'>" +
        "<i class='fa fa-eye'></i>" +
        "</button>";

    var buttonAgregarActividad = "<button type='button' class='btn btn-success' id='btnAgregarActividad' style='margin-right:10px;' " +
        "onclick='agregarActividadIpercColaborador()' title='Agregar Actividad'>" +
        "<i class='fa fa-plus'></i>" +
        "</button>";

    var btnCancelarActividad = "<button class='btn btn-success' onclick='volverDetalleIpercColaborador()' " +
        "id='btnCancelarAgregarActiv' style='margin-right:10px;display:none;' title='Cancelar'>" +
        "<i class='fa fa-sign-out fa-rotate-180'></i>" +
        "</button>";

    var btnGuardarActividad = "<button class='btn btn-success' onclick='guardarActividadIpercColaborador()' " +
        "id='btnGuardarActividad' style='margin-right:10px;display:none;' title='Guardar'>" +
        "<i class='fa fa-floppy-o'></i>" +
        "</button>";

    var btnImportarActividad = "<button class='btn btn-success' id='btnImportar' style='margin-right:10px;display:none;' " +
        "title='Importar'>" +
        "<i class='fa fa-upload'></i>" +
        "</button>";

    var listItemsForm = [
        {sugerencia: " ", label: "Área: ", inputForm: "", divContainer: "divAreaActividad"},
        (parseInt(getSession("gestopcompanyid")) != 336 ?
            {sugerencia: " ", label: "Puesto : ", inputForm: "", divContainer: "divPuestoActividad"} : {
                sugerencia: "",
                label: "",
                inputForm: ""
            }),
        {
            sugerencia: " ",
            label: "Descripción Actividad : ",
            inputForm: "<input class='form-control' id='inputActividadColaborador'>",
            divContainer: ""
        }
    ];

    var text = "";

    listItemsForm.forEach(function (val, index) {
        text += obtenerSubPanelModulo(val);
    });

    var contenido = "<div class='eventoGeneral'>" +
        "<div id='tituloEvento'>" +
        text +
        "</div>" +
        "</div>" +
        "</div>";

    var selFiltroIperc = crearSelectOneMenuOblig("selFiltroIperc", "verAcordeIpercColaborador();", listIpercColaborador,
        "", "ipercId", "ipercName");

    var btnIperc = "<label id='labelFiltroIperc'>IPERC:</label>" + selFiltroIperc;

    var btnNuevo = "<button class='btn btn-success' id='btnNuevo' style='margin-right:10px;' title='Nuevo'>" +
        "<i class='fa fa-plus'></i>" +
        "</button>";

    var btnCopiar = "<button onclick='duplicarIperc()' class='btn btn-success' " +
        "id='btnCopiar' style='margin-right:10px;' title='Duplicar'>" +
        "<i class='fa fa-plus'></i>" +
        "</button>";

    var btnCancelar = "<button class='btn btn-success' id='btnCancelar' style='margin-right:10px;' title='Cancelar'>" +
        "<i class='fa fa-sign-out fa-rotate-180'></i>" +
        "</button>";

    var btnGuardar = "<button class='btn btn-success' id='btnGuardar' style='margin-right:10px;' title='Guardar'>" +
        "<i class='fa fa-floppy-o'></i>" +
        "</button>";

    var btnEliminar = "<button class='btn btn-danger' id='btnEliminar' style='margin-right:10px;' title='Eliminar'>" +
        "<i class='fa fa-times'></i>" +
        "</button>";

    if (!isEditar) {
        buttonFiltroValidarEstado = "";
        buttonFiltroValidar = "";
        buttonAgregarActividad = "";
        btnGuardarActividad = "";
        btnEliminar = "";
        btnGuardar = "";
        btnCancelar = "";
        btnCopiar = "";
        btnImportarActividad = "";
    }

    btnImportarActividad = "";
    buttonFiltroValidarEstado = "";

    var textModalControl =
        "<div class='modal fade bs-example-modal-lg' id='ctrlImplModal' tabindex='-1' role='dialog' " +
        "aria-labelledby='ctrlImplModalLabel' aria-hidden='true'>" +
        "<div class='modal-dialog modal-lg' style='width:80%'>" +
        "<div class='modal-content'>" +
        "<div class='modal-header'>" +
        "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
        "<span aria-hidden='true'>&times;</span>" +
        "</button>" +
        "<h4 class='modal-title' id='ctrlImplModalLabel'>Control</h4>" +
        "</div>" +
        "<div class='modal-body' id='modalControl'>" +
        "<div id='controlOpciones'>" +
        "<button id='btnCancelarControl' type='button' class='btn btn-success' title='Cancelar'>" +
        "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>" +
        "<button id='btnAgregarControl' type='button' class='btn btn-success' title='Agregar Nueva'>" +
        "<i class='fa fa-file-o fa-2x'></i>" +
        "</button>" +
        "<button id='btnGuardarControl' type='button' class='btn btn-success' title='Guardar'>" +
        "<i class='fa fa-floppy-o fa-2x'></i>" +
        "</button>" +
        "<button id='btnEliminarControl' type='button' class='btn btn-danger' title='Eliminar Control'>" +
        "<i class='fa fa-times fa-2x'></i>" +
        "</button>" +
        "</div>" +
        "<div class='table-responsive'>" +
        "<div class='table-responsive'>" +
        "<table class='table table-striped table-bordered table-hover' id='tblControl' " +
        "style='min-width:1900px;'>" +
        "<thead>" +
        "<tr>" +
        "<th class='tb-acc' rowspan='2' style='width:220px'>Descripción</th>" +
        "<th class='tb-acc' rowspan='2' style='width:130px'># Asociados</th>" +
        "<th class='tb-acc' colspan='3' style='min-width:500px'>Responsable de la ejecución del control</th>" +
        "<th class='tb-acc' rowspan='2' style='width:180px'>Fecha Planificada</th>" +
        "<th class='tb-acc' rowspan='2' style='width:180px'>Hora Planificada</th>" +
        "<th class='tb-acc' rowspan='2' style='width:180px'>Fecha Realizada</th>" +
        "<th class='tb-acc' rowspan='2' style='width:100px'>Costo (S/)</th>" +
        "<th class='tb-acc' rowspan='2' style='width:180px'>Evidencia</th>" +
        "<th class='tb-acc' rowspan='2' style='width:140px'>Estado de realizaci&oacute;n</th>" +
        "</tr>" +
        "<tr>" +
        "<th class='tb-acc' style='width:130px;'>Tipo</th>" +
        "<th class='tb-acc' style='width:150px;'>Nombre</th>" +
        "<th class='tb-acc'>Correo</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

    $("body")
        .append(textModalControl +
            "<div id='divIpercResponsableTabla' style='padding-left:40px;'>" +
            "<form class='form-inline' id='formBtnGeneral'>" +
            buttonVolver + buttonVolverFiltro + btnIperc + buttonFiltroValidarEstado + buttonFiltroValidar +
            buttonFiltroRefresh + buttonFiltroAplicar + buttonFiltro +
            buttonAgregarActividad + btnCancelarActividad +
            btnGuardarActividad + buttonReporteIperc + btnImportarActividad +
            "</form>" +
            "<div class='camposFiltroTabla'>" +
            "<div class='contain-filtro' id='filtroEstadoIpercResponsable'>" +
            "<label for='filtroEstadoIpercResponsable'>Estados de los registros</label>" +
            "<div id='divSelectEstadoFiltroIpercResponsable'> " +
            "</div>" +
            "</div>" +
            "<div class='contain-filtro' id='filtroAreaIpercResponsable'>" +
            "<label for='filtroAreaIpercResponsable'>Áreas</label>" +
            "<div id='divSelectAreaFiltroIpercResponsable'> " +
            "</div>" +
            "</div>" +
            "<div class='contain-filtro' id='filtroPuestoIpercResponsable'>" +
            "<label for='filtroPuestoIpercResponsable'>Puestos</label>" +
            "<div id='divSelectPuestoFiltroIpercResponsable'> " +
            "</div>" +
            "</div>" +
            "<div class='contain-filtro' id='filtroActividadIpercResponsable'>" +
            "<label for='filtroActividadIpercResponsable'>Actividades</label>" +
            "<div id='divSelectActividadFiltroIpercResponsable'>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<small>Para visualizar evaluaciones de otras áreas, modificar el filtro</small>" +
            "<br>" + btnNuevo + btnCancelar + btnCopiar + btnGuardar + btnEliminar +
            "<div id='agregarActividadIperc' style='width:600px;display:none;'>" +
            contenido + "" +
            "</div>" +
            "<div class='wrapper' id='wrapperIpercResponsable'>" +
            "<table  style='min-width:100%;' id='tblMatrices' class='table table-striped table-bordered " +
            "table-hover table-fixed'>" +
            "<thead>" +
            "</thead>" +
            "<tbody></tbody>" +
            "</table>" +
            "</div>" +
            "</div>");

    $("#formBtnGeneral").on("submit", function (e) {
        e.preventDefault();
    });

    if (!isEditar) {
        if (filtrarMayorArea) {
            filtrarMayorArea = false;
            listAreasResponsableColaborador[0].selected = 1;
        }

        crearSelectOneMenuObligMultipleCompleto("selAreaFiltro", "verPuestosAcordeAreaFiltro()", listAreasResponsableColaborador,
            "areaId", "areaName", "#divSelectAreaFiltroIpercResponsable", "Todas");
    } else {
        var listaAux = listAreasResponsableColaborador.filter(function (val, index) {
            var isIgual = false;

            if (index == 0) {
                val.selected = 1;
            } else {
                val.selected = 0;
            }

            if (numAreasSupervisor > 0) {
                if (val.listTrabajadoresValidar == null) {
                    val.listTrabajadoresValidar = [];
                }

                val.listTrabajadoresValidar.forEach(function (val1) {
                    if (val1.trabajadorId == parseInt(getSession("trabajadorGosstId"))) {
                        isIgual = true;
                    }
                });

                return (true);
            }

            isIgual = true;
            return isIgual;
        });

        //listaAux = [{areaId : 0,areaName: "Ninguna asignada",selected : 1}];

        crearSelectOneMenuObligMultipleCompleto("selAreaFiltro", "comprobarNumeroArea();verPuestosAcordeAreaFiltro()", listaAux,
            "areaId", "areaName", "#divSelectAreaFiltroIpercResponsable", "Todas");
    }

    verPuestosAcordeAreaFiltro();
    verAcordeIpercColaborador();

    $(".camposFiltroTabla").hide();
    $("#btnAplicarFiltro").hide();

    $("#divTrabIpercResponsable form").on("submit", function (e) {
        e.preventDefault();
    });

    tituloAnteriorColaborador = $(".divTituloGeneral h4").text();
    $(".divTituloGeneral h4").html("Resumen de IPERC");
    resizeDivWrapper("wrapperIpercResponsable", 200);
    verDetalleIpercColaborador(isEditar);
}

function verPuestosAcordeAreaFiltro() {

    crearSelectOneMenuObligMultipleCompleto
    ("selPuestoFiltro", "verActividadesAcordePuestoFiltro()", listPuestosResponsableColaborador.filter(function (val) {
            var isArea = false;
            val.selected = 0;
            var areasId = $("#selAreaFiltro").val();
            if (areasId != null) {

                areasId.forEach(function (val1) {
                    if (parseInt(val1) == val.areaId) {
                        isArea = true;
                    }
                });
                return isArea;
            } else {
                return true;
            }
        }), "positionId", "positionName",
        "#divSelectPuestoFiltroIpercResponsable", "Todos");
    verActividadesAcordePuestoFiltro();
}

function verActividadesAcordePuestoFiltro() {
    crearSelectOneMenuObligMultipleCompleto
    ("selActividadFiltro", "", listActividadesResponsableColaborador.filter(function (val) {
            var isArea = false;
            var isPuesto = false;

            val.selected = 0;
            var areasId = $("#selAreaFiltro").val();
            var puestosId = $("#selPuestoFiltro").val();
            if (puestosId != null) {

                puestosId.forEach(function (val1) {
                    if (parseInt(val1) == val.positionId) {
                        isPuesto = true;
                    }
                });
                return isPuesto;
            } else if (areasId != null) {

                areasId.forEach(function (val1) {
                    if (parseInt(val1) == val.areaId) {
                        isArea = true;
                    }
                });
                return isArea;
            } else {
                return true;
            }

            return isPuesto

        }), "activityId", "activityName",
        "#divSelectActividadFiltroIpercResponsable", "Todas")
}

function comprobarNumeroArea() {
    var selAreaFiltro = $("#selAreaFiltro").val();
    if (selAreaFiltro == null) {
        alert("Filtro de área obligatorio");
        crearSelectOneMenuObligMultipleCompleto
        ("selAreaFiltro", "comprobarNumeroArea();verPuestosAcordeAreaFiltro()", listAreasResponsableColaborador.filter(function (val, index) {
                val.selected = 1;
                if (index == 0) {
                    val.selected = 1;
                }
                var isIgual = true;
                return isIgual;
            }), "areaId", "areaName",
            "#divSelectAreaFiltroIpercResponsable", "Todas");
    }
}

var detallesFullIpercColaborador = [];
var ipercEdicionObj;
var listaPersonaExpuesta = [];
var listaIndCapa = [];
var listaIndRisk = [];
var listaIndProc = [];

function verAcordeIpercColaborador() {
    ipercEdicionObj = {};
    listIpercColaborador.forEach(function (val) {
        if (val.ipercId == parseInt($("#selFiltroIperc").val())) {
            ipercEdicionObj = val;
        }
    });
    listEstadosValidarColaborador.forEach(function (val) {
        switch (val.id) {
            case 1:
                val.nombreCompleto = val.nombre + " (" + ipercEdicionObj.numEvaluacionesPendientes + ") " + ipercEdicionObj.nombreSupervisores;
                break;
            case 2:
                val.nombreCompleto = val.nombre + " (" + ipercEdicionObj.numEvaluacionesElaboradas + ") " + ipercEdicionObj.nombreSupervisores;
                break;
            case 3:
                val.nombreCompleto = val.nombre + " (" + ipercEdicionObj.numEvaluacionesRevisadas + ") " + ipercEdicionObj.nombreJefes;
                break;
            case 4:
                val.nombreCompleto = val.nombre + " (" + ipercEdicionObj.numEvaluacionesAprobadas + ") " + ipercEdicionObj.nombreGerentes;
                break;
            case 5:
                val.nombreCompleto = val.nombre + " (" + ipercEdicionObj.numEvaluacionesVencidas + ") " + ipercEdicionObj.nombreSupervisores;
                break;
        }
    })
    $(".camposFiltroTabla").show();
    crearSelectOneMenuObligMultipleCompleto
    ("selEstadoFiltro", "", listEstadosValidarColaborador, "id", "nombreCompleto",
        "#divSelectEstadoFiltroIpercResponsable", "Todos");

    $(".camposFiltroTabla").hide();
    verDetalleIpercColaborador();
}

function verDetalleIpercColaborador() {
    var isEditar = isEditarGeneral;

    var areasId = $("#selAreaFiltro").val();
    var puestosId = $("#selPuestoFiltro").val();
    var actividadesId = $("#selActividadFiltro").val();
    var estadosId = $("#selEstadoFiltro").val();
    var listAreasId = [], listPuestosId = [],
        listActividadesId = [], listEstadosId = [];

    if (areasId == null || areasId.length == 0) {
        listAreasId = null;
    } else {
        areasId.forEach(function (val) {
            listAreasId.push(parseInt(val));
        })
    }
    if (puestosId == null || puestosId.length == 0) {
        listPuestosId = null;
    } else {
        puestosId.forEach(function (val) {
            listPuestosId.push(parseInt(val));
        })
    }
    if (actividadesId == null || actividadesId.length == 0) {
        listActividadesId = null;
    } else {
        actividadesId.forEach(function (val) {
            listActividadesId.push(parseInt(val));
        })
    }
    if (estadosId == null || estadosId.length == 0) {
        listEstadosId = null;
    } else {
        estadosId.forEach(function (val) {
            listEstadosId.push(parseInt(val));
        })
    }
    var dataParam = {
        ipercId: ipercEdicionObj.ipercId,
        companyId: getSession("gestopcompanyid"),
        matrizRiesgoId: ipercEdicionObj.matrizRiesgoId,
        listAreasId: listAreasId,
        listPuestosId: listPuestosId,
        listActividadesId: listActividadesId,
        listEstadosId: listEstadosId


    };
    callAjaxPost(URL + '/iperc/detalle', dataParam,
        function (data) {
            detallesFullIpercColaborador = data.list;
            procesarListarTablaDetalleIperc(data);
            if (!isEditar) {
                $("#tblMatrices tbody tr").attr("onclick", "");
                formatoCeldaSombreableTabla(false, "tblMatrices");
                detallesFullIpercColaborador.forEach(function (val, index) {
                    var text1 = $("#ctrlImpl1" + val.ipercDetailEvalID).html();
                    $("#ctrlImpl1" + val.ipercDetailEvalID)
                        .html("<a onclick='asignarObjIndexDetalleIperc(" + index + ") ;" +
                            "verControlSegunTipo(1)' class='efectoLink'>" +
                            text1 + "</a>");
                    var text2 = $("#ctrlImpl2" + val.ipercDetailEvalID).html();
                    $("#ctrlImpl2" + val.ipercDetailEvalID)
                        .html("<a onclick='asignarObjIndexDetalleIperc(" + index + ") ;" +
                            "verControlSegunTipo(2)' class='efectoLink'>" +
                            text2 + "</a>");
                    var text3 = $("#ctrlImpl3" + val.ipercDetailEvalID).html();
                    $("#ctrlImpl3" + val.ipercDetailEvalID)
                        .html("<a onclick='asignarObjIndexDetalleIperc(" + index + ") ;" +
                            "verControlSegunTipo(3)' class='efectoLink'>" +
                            text3 + "</a>");
                    var text4 = $("#ctrlImpl4" + val.ipercDetailEvalID).html();
                    $("#ctrlImpl4" + val.ipercDetailEvalID)
                        .html("<a onclick='asignarObjIndexDetalleIperc(" + index + ") ;" +
                            "verControlSegunTipo(4)' class='efectoLink'>" +
                            text4 + "</a>");
                    var text5 = $("#ctrlImpl5" + val.ipercDetailEvalID).html();
                    $("#ctrlImpl5" + val.ipercDetailEvalID)
                        .html("<a onclick='asignarObjIndexDetalleIperc(" + index + ") ;" +
                            "verControlSegunTipo(5)' class='efectoLink'>" +
                            text5 + "</a>");
                });
            }
            //goheadfixedY('#tblMatrices',"#wrapper");
        });
}

function asignarObjIndexDetalleIperc(pindex) {
    detalleIpercDetailObj = detallesFullIpercColaborador[pindex];
}

function descargarMatrizColaborador() {
    window.open(URL
        + "/iperc/detail/excel?ipercId="
        + ipercEdicionObj.ipercId + "&ipercName="
        + ipercEdicionObj.ipercName, '_blank');
}

var listFullDetalleIpercColaborador = [];

function procesarResumenIpercColaborador(data) {
    listFullDetalleIpercColaborador = data.list;
}

function verPeligrosAcordeActividades(selectAll) {
    if (parseInt(selectAll) == 1) {
        var checkTotal = $(".divListPrincipal #subListActividades table #inputCheckActividadIperTotal").prop("checked");

        listFullActividades.forEach(function (val, index) {
            var checkIper = $(".divListPrincipal #subListActividades table #inputCheckActividadIper" + index);

            checkIper.prop("checked", checkTotal);
        });
    }

    var actividadesSeleccionadas = [];
    listActividadesMarcadas = [];

    listFullActividades.forEach(function (val, index) {
        var isCheck = $(".divListPrincipal #subListActividades table #inputCheckActividadIper" + index).prop("checked");

        if (isCheck) {
            actividadesSeleccionadas.push(val.nombre);
        }

        listActividadesMarcadas.push(isCheck);
    });

    $(".divListPrincipal").find("#subListPeligros .contenidoSubList").html("");

    var contadorPeligrosAsociados = 0;

    listFullPeligros.forEach(function (val, index) {
        if (actividadesSeleccionadas.indexOf(val.actividad) != -1) {
            contadorPeligrosAsociados++;

            var listIper = [
                {
                    sugerencia: "",
                    label: "<i aria-hidden='true' class='fa fa-location-arrow'></i> Actividad / Lugar:",
                    inputForm: val.actividad + "/" + val.lugar, divContainer: ""
                },
                {
                    sugerencia: "",
                    label: "<i aria-hidden='true' class='fa fa-exclamation-triangle'></i> Peligro / Riesgo:",
                    inputForm: val.peligro + "/" + val.riesgo + "(" + (val.nivel == null ? "Sin evaluar" : val.nivel) + ")",
                    divContainer: ""
                },
                {
                    sugerencia: "",
                    label: "<i aria-hidden='true' class='fa fa-info'></i> Control(es):",
                    inputForm: val.controles, divContainer: ""
                }
            ];

            var textIperc = "";

            listIper.forEach(function (val, index) {
                textIperc += obtenerSubPanelModulo(val)
            });

            $(".divListPrincipal").find("#subListPeligros .contenidoSubList")
                .append("<div class='eventoGeneral' style='border-left:8px solid " + val.nivelColor + ";'>" +
                    textIperc +
                    "</div>");
        }
    });

    var textoBotonHide1 = "<button class='btn btn-success' onclick='cambiarDivSubIperc(" + 1 + ")'>" +
        "<i class='fa fa-caret-down fa-2x' aria-hidden='true'></i>" +
        "</button>";

    var textoBotonHide2 = "<button class='btn btn-success' onclick='cambiarDivSubIperc(" + 2 + ")'>" +
        "<i class='fa fa-caret-down fa-2x' aria-hidden='true'></i>" +
        "</button>";

    $(".divListPrincipal").find("#subListActividades .tituloSubList")
        .html(textoBotonHide1 + "<i class='fa fa-street-view'></i> " +
            "Actividades de puesto '" + puestoTrabajoNombre + "' " +
            "(" + actividadesSeleccionadas.length + " - " + listFullActividades.length + ")");

    $(".divListPrincipal").find("#subListPeligros .tituloSubList")
        .html(textoBotonHide2 + "<i class='fa fa-exclamation-triangle'></i> " +
            "Peligros Asociados (" + contadorPeligrosAsociados + " - " + listFullPeligros.length + ")")
}

function volverVistaIperc() {
    $("#divIpercResponsableTabla").remove();
    $("#wrapperIpercResponsable").remove();
    $("#ctrlImplModal").remove();

    $(".divContainerGeneral").show();
    $(".divListPrincipal > div").show();

    if (parseInt(getSession("gestopcompanyid")) == 336) {
        $("#subListActividades").hide();
        $("#subListPeligros").hide();
        $("#subDescargarRecomendaciones").hide();
    }
}

var trabajadorPerfilObj = {};

function habilitarPerfilUsuario() {
    $(".divListPrincipal").html(
        (getSession("cambioUsuarioDirecto") == 1?"<div id='subCambioUsuarioDirecto'>" +
             "<div class='tituloSubList'></div>" +
             "<div class='contenidoSubList'></div>" +
         "</div>":"") +
        (getSession("isAzure") == null?"<div id='subListPassword'>" +
             "<div class='tituloSubList'></div>" +
             "<div class='contenidoSubList'></div>" +
         "</div>":"") +
        "<div id='subListInfoExtra'>" +
        "<div class='tituloSubList'></div>" +
        "<div class='contenidoSubList'></div>" +
        "</div>" +
        "<div id='subListCerrarSession'>" +
        "<div class='tituloSubList'></div>" +
        "<div class='contenidoSubList'></div>" +
        "</div>");

    var textoForm = "";

    var listItemsForm = [
        {
            sugerencia: "", label: "Anterior contraseña",
            inputForm: "<input type='password' class='form-control' id='inputOldPass' placeholder='' autofocus>"
        },
        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
        {
            sugerencia: "<label>*Debe incluir una letra minúscula, una letra mayúscula, un número " +
                "y un caracter especial (mínimo 8 caracteres).</label>",
            label: "Nueva contraseña",
            inputForm: "<input type='password' class='form-control' id='inpuNewPass' placeholder=''>"
        },
        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
        {
            sugerencia: "", label: "Confirmación nueva contraseña",
            inputForm: "<input type='password' class='form-control' id='inpuNewNewPass' placeholder=''>"
        },
        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
        {
            sugerencia: "", label: "",
            inputForm: "<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
                "<i aria-hidden='true' class='fa fa-paper-plane'></i> Cambiar" +
                "</button>"
        }
    ];

    listItemsForm.forEach(function (val, index) {
        textoForm += obtenerSubPanelModuloVersionDos(val);
    });

    var dataParam = {
        trabajadorId: parseInt(getSession("trabajadorGosstId"))
    };
    ///
    callAjaxPost(URL + '/trabajador/perfil', dataParam, function (data) {
        var licencia = data.licencia;
        trabajadorPerfilObj = data.trabajador;
        
        var butonRecibir =
            "<button class='btn btn-success' onclick='actualizarWantsCorreo(1)'>" +
            "<i class='fa fa-envelope-o'></i> Recibir Notificaciones" +
            "</button>;";

        var butonNoRecibir =
            "<button class='btn btn-success' onclick='actualizarWantsCorreo(0)'>" +
            "<i class='fa fa-envelope-o'></i> No Recibir Notificaciones" +
            "</button>;";

        var textoRecibir = (licencia.wantsCorreo == 1 ?
            iconoGosst.aprobado + "Activo" : iconoGosst.desaprobado + "Inactivo");
        var textoBtnRecibir = (licencia.wantsCorreo == 1 ? butonNoRecibir : butonRecibir);

        var infoPrueba = [];

        if (licencia.id === 3) {
            var butonCambiar =
                "<button class='btn btn-success' onclick='cambiarLicenciaUsuario()'>" +
                "<i class='fa fa-refresh'></i> Cambiar" +
                "</button>;";

            infoPrueba = [
                {campo: "Licencia", descripcion: licencia.planType + "<br>" + butonCambiar},
                {campo: "Fecha de vencimiento", descripcion: licencia.fechaVencimiento},
            ];
        }

//      var textoValidacionDni = (licencia.validacionDniTrabajador == 1?"Sí":"No")+
//         (licencia.fechaValidacionTextoTrabajador.length == 0?licencia.fechaValidacionTextoTrabajador:
//          " ("+licencia.fechaValidacionTextoTrabajador+")");
//      var textoBtnValidacionDni = (parseInt(getSession("habilitarValidacion")) == 0 ||
//	 licencia.validacionDniTrabajador == 1?"":
//	 "<button class='btn btn-info' onclick='verValidacionTrabajadorPorEvidenciaDNI()'>" +
//            "<i class='fa fa-id-card fa-2x'></i><i class='fa fa-info'></i> Validar" +
//         "</button>");

      var enlaceTerminosCondiciones = "<br>" +
	 "<a class='efectoLink' target='_blank' href='../documentos/T^0C Aswan-Colaboradores vAL 010223.pdf'>" +
            "<i class='fa fa-download'></i> Descargar" +
         "</a>"
      
      var infoArray=[
            {campo: "Usuario", descripcion: getSession("gestopusername")},
            //...infoPrueba,
            {
                campo: "Correo de notificaciones<br>" + textoRecibir,
                descripcion: "" + licencia.correo + "<br>" + textoBtnRecibir
            },
            {campo: "Puesto de Trabajo", descripcion: puestoTrabajoNombre},
            {campo: "Área", descripcion: areaNombreAux},
            {campo: "Fecha de vigencia", descripcion: licencia.fechaVencimiento},
         {campo:"Fecha aceptó términos y condiciones",descripcion:trabajadorPerfilObj.fechaAceptaTerminosCondiciones+enlaceTerminosCondiciones},
            {campo: "Empresa", descripcion: licencia.empresaNombre},
//	 {campo:"Logo",descripcion:insertarImagenParaTablaMovil(licencia.logo,"","100%")},
//	 {campo:"¿Validado por DNI?",
//	  descripcion:textoValidacionDni+" "+textoBtnValidacionDni},
            {
                campo: "Imagen perfil",
                descripcion: (licencia.imagenTrabajador == null ?
                        "<i class='fa fa-user-circle fa-4x' aria-hidden='true'></i>" +
                        " Nota: tamaño recomendado 150x150 ." :
                        insertarImagenParaTablaMovil(licencia.imagenTrabajador, "", "100%")) +
                    "<div id='imagenTrabajador'></div>"
            },
            {
                campo: "Firma digital",
                descripcion: (licencia.firmaDigital == null ?
                        "<i class='fa fa-pencil fa-4x' aria-hidden='true'></i>" +
                        " Nota: tamaño recomendado 150x150 ." :
                        insertarImagenParaTablaMovil(licencia.firmaDigital, "", "80%")) +
                    "<div id='imagenFirmaDigital'></div>"
            }
        ];

        var informacionTexto = "";

        infoArray.forEach(function (val, index) {
            var campoAux = (parseInt(getSession("gestopcompanyid")) == 616 && index == 2 ? "Perfil" : val.campo);

            if (parseInt(getSession("gestopcompanyid")) == 616 && index == 3) {
                informacionTexto += "";
            } else {
                informacionTexto +=
                    "<tr>" +
                    "<td><label>" + campoAux + "</label></td>" +
                    "<td>" + val.descripcion + "</td>" +
                    "</tr>";
            }
        });

        $("#subListInfoExtra").find(".tituloSubList")
            .html("Información General" + textoBotonToggleContenidoColaborador);

        $("#subListInfoExtra").find(".contenidoSubList")
            .html("<div class='eventoGeneral'>" +
                "<table class='table table-user-information'>" +
                "<tbody>" + informacionTexto + "</tbody>" +
                "</table>" +
                "</div>");

        if (licencia.imagenTrabajador != null) {
            $("#icoPerfil > a")
                .html(insertarImagenParaTablaMovil(licencia.imagenTrabajador, "32px", "32px") +
                    getSession("gestopusername").substr(0, 12) + ".");
        }

        var options = {
            container: "#imagenTrabajador",
            functionCall: function () {
                guardarEvidenciaAuto(getSession("trabajadorGosstId"), "fileEviTrabajador", bitsLogoEmpresa,
                    "/scheduler/trabajador/imagen/save", habilitarPerfilUsuario)
            },
            descargaUrl: "/scheduler/trabajador/imagen?id=" + getSession("trabajadorGosstId"),
            esNuevo: (licencia.imagenTrabajador == null ? true : false),
            idAux: "Trabajador",
            evidenciaNombre: "Modificar Imagen"
        };

        crearFormEvidenciaCompleta(options);

        var options = {
            container: "#imagenFirmaDigital",
            functionCall: function () {
                guardarEvidenciaAuto(getSession("trabajadorGosstId"), "fileEviFirmaDigital", bitsLogoEmpresa,
                    "/scheduler/firma_digital/imagen/save", habilitarPerfilUsuario)
            },
            descargaUrl: "/scheduler/firma_digital/imagen?id=" + getSession("trabajadorGosstId"),
            esNuevo: (licencia.firmaDigital == null ? true : false),
            idAux: "FirmaDigital",
            evidenciaNombre: "Modificar/Descargar Firma Digital"
        };

        crearFormEvidenciaCompleta(options);
    });

    $("#subListCerrarSession").find(".tituloSubList").html("Cerrar Sesión" + textoBotonToggleContenidoColaborador);

    $("#subListCerrarSession").find("button").html("<i class='fa fa-times fa-2x' aria-hidden='true'></i>").on("click", function () {
        cerrarSesionVistaColaborador();
    });
    ///
    if(getSession("cambioUsuarioDirecto") == 1) {
        $("#subCambioUsuarioDirecto").find(".tituloSubList").html("Cambiar de vista "+textoBotonToggleContenidoColaborador);

        $("#subCambioUsuarioDirecto").find("button").html("<i class='fa fa-external-link fa-2x' aria-hidden='true'></i>").on("click",function(){
            verCambioUsuarioDirecto();
        });
    }

    if(getSession("isAzure") == null){
        $(".divListPrincipal").find("#subListPassword .tituloSubList").html("Cambiar Contraseña" + textoBotonToggleContenidoColaborador);

        $("#subListPassword").find(".contenidoSubList").html("<div class='eventoGeneral'>" +
                "<form class='eventoGeneral' id='nuevoPassTrabajador'>"+textoForm+"</form>" +
            "</div>");
    }

    $('#nuevoPassTrabajador').on('submit', function (e) {
        e.preventDefault();
        cambiarClaveAccesoVistaTrabajador();
    });
}

function cambiarClaveAccesoVistaTrabajador() {
    var campoVacio = true;

    var psw1 = $("#inputOldPass").val().trim();
    var psw2 = $("#inpuNewPass").val().trim();
    var psw3 = $("#inpuNewNewPass").val().trim();

    var valMinVerifNewPass = /[a-z]/.test(psw2);
    var valMayVerifNewPass = /[A-Z]/.test(psw2);
    var valNumVerifNewPass = /[0-9]/.test(psw2);
    var valCaracterEspecialVerifNewPass = /[^A-Za-z0-9\s]/.test(psw2);

    if (psw1.length == 0 || psw2.length == 0 || psw3.length == 0) {
        campoVacio = false;
        mensajeUx = "<label>Debe completar todos los campos activos.</label>";
    } else if (psw2.length < 8) {
        campoVacio = false;
        mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, 8 caracteres.</label>";
    } else if (!valMinVerifNewPass || !valMayVerifNewPass || !valNumVerifNewPass || !valCaracterEspecialVerifNewPass) {
        campoVacio = false;
        mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, una letra minúscula, una letra mayúscula, " +
            "un número y un caracter especial entre sus caracteres.</label>";
    } else if (psw2 !== psw3) {
        campoVacio = false;
        mensajeUx = "<label>La nueva contraseña y la confirmación, de la nueva contraseña, no coinciden.</label>";
    } else if (psw1 === psw2) {
        campoVacio = false;
        mensajeUx = "<label>No puede utilizar la anterior contraseña como nueva contraseña.</label>";
    }

    if (campoVacio) {
        var dataParam = {
            trabajadorId: parseInt(getSession("trabajadorGosstId")),
            fechaUltimaActClaveTexto: trabajadorPerfilObj.fechaUltimaActClaveTexto,
            contraseniaAuxiliar: trabajadorPerfilObj.contraseniaAuxiliar,
            contraseniaAnterior: psw1,
            contraseniaNueva: psw2
        };

        callAjaxPost(URL + '/trabajador/password/save', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    var iconoMensajeFinal = (data.mensaje.includes("éxito") ? 1 : 2);

                    mensajeUx = data.mensaje;
                    mensajesUx(mensajeUx, iconoMensajeFinal, "", "ActualizarPerfil");

                    $("#modalMensajeUxActualizarPerfil").on("hidden.bs.modal", function () {
                        if (iconoMensajeFinal == 1) {
                            $("#inputOldPass").val("");
                            $("#inpuNewPass").val("");
                            $("#inpuNewNewPass").val("");
                            $("#subListPassword").find(".contenidoSubList").hide();
                        }
                    });

                    break;

                default:
                    alert("Ocurrió un error al guardar la empresa!");
            }
        });

    } else {
        mensajesUx(mensajeUx, 2, "", "");
    }
}

var hasFalloValidacion;

function ocultarValidacionTrabajadorPorEvidenciaDNI() {
    $("#modalValidacionPorDniTrabajador").modal("hide");

    if (hasFalloValidacion == 1) {
        habilitarPerfilUsuario();
    }
}

function verValidacionTrabajadorPorEvidenciaDNI() {
    $("#modalValidacionPorDniTrabajador").remove();
    hasFalloValidacion = 0;

    var listItemsRegistro = [
        {
            sugerencia: "", anchoLabel: "", anchoDiv: "", label: "DNI - Frontal",
            inputForm: "", divContainer: "divEvidenciaDniFrontal"
        },
        {
            sugerencia: "", anchoLabel: "", anchoDiv: "", label: "DNI - Reverso",
            inputForm: "", divContainer: "divEvidenciaDniReverso"
        },
        {
            sugerencia: "", anchoLabel: "", anchoDiv: "", label: "Foto - Trabajador",
            inputForm: "", divContainer: "divEvidenciaFotoTrab"
        },
        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
        {
            sugerencia: "", anchoLabel: "", anchoDiv: "",
            label: "<button class='btn btn-danger' style='font-size:18px;' type='button' " +
                "onclick='ocultarValidacionTrabajadorPorEvidenciaDNI()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
            inputForm: "<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
                "<i aria-hidden='true' class='fa fa-pencil-square-o'></i> Validar" +
                "</button>"
        }
    ];

    var textFormRegistro = "";

    listItemsRegistro.forEach(function (val, index) {
        textFormRegistro += obtenerSubPanelModuloVersionDos(val);
    });

    var opciones = {
        id: "modalValidacionPorDniTrabajador",
        nombre: "Validación por DNI - Trabajador",
        contenido: "<form id='formValidacionPorDniTrab' class='eventoGeneral'>" + textFormRegistro + "</form>"
    };

    crearModalPrincipalUsuario(opciones, function () {
    }, true, true);

    var editarDiv = $("#formValidacionPorDniTrab");

    var optionsDniFrontal = {
        container: "#divEvidenciaDniFrontal",
        functionCall: function () {
            validacionSubirEvidencia("DniFrontal", bitsImagenExterno,
                "modalValidacionPorDniTrabajador");
        },
        descargaUrl: "", esNuevo: true,
        idAux: "DniFrontal", isImagen: true,
        evidenciaNombre: "", mensajeAux: ""
    };

    crearFormEvidenciaCompleta(optionsDniFrontal);

    var optionsDniReverso = {
        container: "#divEvidenciaDniReverso",
        functionCall: function () {
            validacionSubirEvidencia("DniReverso", bitsImagenExterno,
                "modalValidacionPorDniTrabajador");
        },
        descargaUrl: "", esNuevo: true,
        idAux: "DniReverso", isImagen: true,
        evidenciaNombre: "", mensajeAux: ""
    };

    crearFormEvidenciaCompleta(optionsDniReverso);

    var optionsFotoTrab = {
        container: "#divEvidenciaFotoTrab",
        functionCall: function () {
            validacionSubirEvidencia("FotoTrab", bitsImagenExterno,
                "modalValidacionPorDniTrabajador");
        },
        descargaUrl: "", esNuevo: true,
        idAux: "FotoTrab", isImagen: true,
        evidenciaNombre: "", mensajeAux: ""
    };

    crearFormEvidenciaCompleta(optionsFotoTrab);

    editarDiv.on('submit', function (e) {
        e.preventDefault();
        guardarValidacionTrabajadorPorEvidenciaDNI();
    });
}

function guardarValidacionTrabajadorPorEvidenciaDNI() {
    var campoVacio = true;

    var nombreEviDniFrontal = $("#inputEviDniFrontal").val();
    var nombreEviDniReverso = $("#inputEviDniReverso").val();
    var nombreEviFotoTrab = $("#inputEviFotoTrab").val();

    if (nombreEviDniFrontal.length == 0 || nombreEviDniReverso.length == 0 ||
        nombreEviFotoTrab.length == 0) {
        campoVacio = false;
        mensajeUx = "<label>Debe subir todas las evidencias.</label>";
    } else if (nombreEviDniFrontal == "VOLVER A SUBIR" || nombreEviDniReverso == "VOLVER A SUBIR" ||
        nombreEviFotoTrab == "VOLVER A SUBIR") {
        campoVacio = false;
        mensajeUx = "<label>Hay una o más evidencias que debe 'VOLVER A SUBIR'.</label>";
    }

    if (campoVacio) {
        var dataParam = {};
        var dataParamError = {
            esModal: 1, contenedorModal: "modalValidacionPorDniTrabajador"
        };

        convertirImagenABase64("fileEviDniFrontal", 1, function (data1) {
            dataParam.image1 = data1.EviBase64Aux;

            convertirImagenABase64("fileEviDniReverso", 0, function (data2) {
                dataParam.image2 = data2.EviBase64Aux;

                convertirImagenABase64("fileEviFotoTrab", 0, function (data3) {
                    dataParam.face = data3.EviBase64Aux;

                    enviarParametrosExterno("https://umgqc5c4wf.execute-api.us-west-2.amazonaws.com" +
                        "/dev/certifications/verify-document", dataParam, dataParamError, 0, 1, function (data4) {
                        var codigoValidacion = data4.statusCode;

                        switch (codigoValidacion) {
                            case 101:
                            case 400:
                                var dataParam1 = {
                                    trabajadorId: parseInt(getSession("trabajadorGosstId")),
                                    hasValidacion: (codigoValidacion == 101 ? 1 : 0)
                                };

                                callAjaxPostNoUnlockAux(URL + '/trabajador/validacion_dni/save', dataParam1, function (data) {
                                    switch (data.CODE_RESPONSE) {
                                        case "05":
                                            $.unblockUI();
                                            $("#modalValidacionPorDniTrabajador").modal("hide");

                                            mensajeUx = (codigoValidacion == 101 ? "<label>La validación se realizó con éxito.</label>" :
                                                "<label>No se alcanzó el porcentaje de validación mínimo. Por favor, revise las " +
                                                "imágenes que adjuntó y vuelva a intentarlo.</label>");
                                            mensajesUx(mensajeUx, 1, "", "ActualizarModTrabajador");

                                            $("#modalMensajeUxActualizarModTrabajador").on("hidden.bs.modal", function () {
                                                if (codigoValidacion == 101) {
                                                    habilitarPerfilUsuario();
                                                } else {
                                                    hasFalloValidacion = 1;
                                                    $("#modalValidacionPorDniTrabajador").modal("show");
                                                }
                                            });

                                            break;

                                        default:
                                            console.log("Ocurrió un error al guardar!");
                                    }
                                });

                                break;

                            default:
                                $.unblockUI();
                                console.log("Ocurrió un error al validar la informacion!");
                        }
                    });
                });
            });
        });
    } else {
        $("#modalValidacionPorDniTrabajador").modal("hide");

        mensajesUx(mensajeUx, 2, "", "AvisoCompletarCampos");

        $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal", function () {
            $("#modalValidacionPorDniTrabajador").modal("show");
        });
    }
}

function cambiarLicenciaUsuario() {
    var contenido = "Estimado usuario:" +
        "<br><br>Para solicitar un cambio de licencia, favor de " +
        "comunicarse con nuestro equipo técnico al teléfono 987-654-31 " +
        "o escríbenos a ventas@aswan.pe.<br><br> Gracias";
    var modalOptions = {
        id: "modalCambiarLicencia", nombre: "<i class='fa fa-refresh'></i>Cambiar Licencia",
        contenido: contenido
    };

    crearModalPrincipalUsuario(modalOptions, function () {
    }, false, true);
}

function actualizarWantsCorreo(wants) {
    var dataParam = {
        trabajadorId: getSession("trabajadorGosstId"),
        wantsCorreo: wants
    }
    callAjaxPost(URL + "/trabajador/correo/save", dataParam, function (daat) {
        habilitarPerfilUsuario();
    });
}

function cambiarDivSubIperc(estadoId) {
    var divContainer = "subListPeligros";
    switch (estadoId) {
        case 1:
            divContainer = "subListActividades";
            break;
        case 2:
            divContainer = "subListPeligros";
            break;
    }
    $("#" + divContainer).find(".contenidoSubList").toggle();
}

function habilitarVistaUsuario() {
    $(".divListPrincipal")
        .append("Working on it !")
}

//-----------------------------------------
var lastHeight = 0;
var indexProgIns;

function toggleMenuOpcionActiv(obj, pindex) {
    indexEventoOpt = pindex;
    indexProgIns = pindex;
    lastHeight = $(obj).offset().top;
    $(obj).parent(".eventoGeneral").find("ul").toggle();
    $(obj).parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesActiv=[
    {id:"opcEditar",nombre:"<i class='fa fa-check-square'></i>&nbspRegistrar como terminado",functionClick:function(data){
         var objActividadAux = listFullEventos[data];

         if(objActividadAux.tipoEvento == 19){
             cerrarMedidaCorrectivaEvento(data);
         }else{
             if(objActividadAux.tipoEvento == 10 && ![94,194,300,303,304].includes(parseInt(objActividadAux.linkAuxiliarId2)) &&
                 parseInt(getSession("gestopcompanyid")) != 739){
                 inspeccionEvento = listFullEventos[data];

                 verFinalizarInspeccGeneralVersionTres(0);
             }else if(parseInt(objActividadAux.linkAuxiliarId2) == 304){
                 completarCamposAdicionalesFinalizarInspeccion(0,data);
             }else{
                 verCompletarActividadVistaColaborador(data);
             }
         }
    }}
];

var indexEventoOpt;

var funcionalidadesEventosOpt = [
    {
        id: "opcEval", nombre: "<i class='fa fa-check-square-o'></i>&nbspRegistrar evaluación",
        functionClick: function () {
            realizarPreguntasAperturaOptMovil(indexEventoOpt)
        }
    },
    {
        id: "opcEditar", nombre: "<i class='fa fa-check-square'></i>&nbspRegistrar como terminado",
        functionClick: function (data) {
            verCompletarActividadVistaColaborador(data)
        }
    }
];

function marcarSubOpcionActiv(pindex, indexEvento) {
    funcionalidadesActiv[pindex].functionClick(indexEvento);
    //$(".listaGestionGosst").hide();
}

function marcarSubOpcionEventoOpt(pindex, indexEvento) {
    funcionalidadesEventosOpt[pindex].functionClick(indexEvento);
    //$(".listaGestionGosst").hide();
}

//---------------------------------------------------------
function obtenerSubPanelModulo(val) {
    var estiloDefault = "";
    if (val.inputForm == "" && val.sugerencia == "" && val.label == "") {
        estiloDefault = "    border-top: 1px dashed #a5aaae;"
    }
    return "<div class='form-group row " + val.clase + "' style='" + estiloDefault + "'>" +
        " <label for='colFormLabel' class='col-sm-4 col-form-label'>" + val.label + "</label>" +
        "<div class='col-sm-8' id='" + val.divContainer + "'>" +
        " " + val.inputForm +
        "<small>" + val.sugerencia + " </small>" +
        "</div>" +
        "</div>";
}

function agregarModalPrincipalColaborador(modalOptions, functionCallBack, isStatic) {
    $(".modal-backdrop").remove();
    $("#" + modalOptions.id).remove();
    $("body").append("<div class='modal' id='" + modalOptions.id + "' role='dialog'>" +
        "<div class='modal-dialog modal-dialog-centered' style='width:100%;    max-width: 650px;'>" +

        "<div class='modal-content' >" +
        "<div class='modal-header'>" +
        "   <button type='button' class='close' data-dismiss='modal'>&times;</button>" +
        "  <h4 class='modal-title'>" + modalOptions.nombre + "</h4>" +
        "</div>" +

        "<div class='modal-body'>" +
        modalOptions.contenido +
        "</div>" +
        "</div>" +

        "</div>" +
        "</div>");
    $("#" + modalOptions.id).on('shown.bs.modal', functionCallBack);
    if (isStatic) {
        $('#' + modalOptions.id).modal({
            keyboard: true,
            show: true,
            backdrop: false
        })
    } else {
        $("#" + modalOptions.id).modal("show");
    }


}

function agregarPanelesDivPrincipalColaborador(listPanelesPrincipal) {
    if (listPanelesPrincipal.length == 0) {
        $(".divListPrincipal")
            .append("<div id='divNoResultados'>" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
                "</div>");

        $("#divNoResultados").find(".tituloSubList").html(
            //"<i aria-hidden='true' class='fa fa-list'></i>"+
            "Sin resultados");
    }

    listPanelesPrincipal.forEach(function (val, index) {
        $(".divListPrincipal")
            .append("<div id='" + val.id + "' class='" + val.clase + "'>" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
                "</div>");

        if (!(parseInt(val.proyectoId) > 0)) {
            val.proyectoId = null
        }

        var textoBtn = "<button class='btn btn-success' style='padding:0px 4px 0px 4px' " +
            "onclick='cambiarDivSubContenidoColaborador(this," + val.proyectoId + ")' " +
            "title='Mostrar/Ocultar los registros de esta sección.'>" +
            "<i class='fa fa-caret-down fa-4x' aria-hidden='true'></i>" +
            "</button>";

        $("#" + val.id).find(".tituloSubList").html(textoBtn
            //+"<i aria-hidden='true' class='fa fa-list'></i>"
            + val.nombre);

        $("#" + val.id).find(".contenidoSubList").html(val.contenido);
    });
}

function verSelecionarTrabajadorOpt(pindex) {
    var felici = $("#selFelicitacionOpt").val();
    var vig = $("#inputVigenciaOpt").val();
    var seg = $("#selSeguimientoOpt").val();
    var fechaReal = convertirFechaTexto($("#dateActividad").val());
    objActividad = listFullEventos[pindex];
    var dataParam =
        {
            id: objActividad.idAux,
            felicitacion: felici,
            vigenciaOpt: vig,
            seguimientoOpt: seg,
            fechaReal: fechaReal,
            empresa: {empresaId: getSession("gestopcompanyid")}
        }
    callAjaxPostNoUnlock(URL + '/opt/eventos/cierre', dataParam,
        function (data) {
            if (data.CODE_RESPONSE == "05") {
                listFullTrabajadores = data.trabajadores;
                mostrarTrabEnviarInforme(pindex);
            }
        });

}

function mostrarTrabEnviarInforme(pindex) {
    $.unblockUI();
    $("#mdInformeOpt").modal("show");
    $("#btnEnviarInformeOpt").attr("onclick", "javascript: enviarInformeOpt(" + pindex + ");");
    var selTrabajadores = crearSelectOneMenuOblig("selTrabajadores", "", listFullTrabajadores, "", "trabajadorId", "trabajadorNombre");
    $("#mdInformeOpt .modal-header h4").remove()
    $("#mdInformeOpt .modal-header").append("<h4 class='modal-title' id='mdImpDatosLabel'>Seleccione Trabajador</h4>")
    $("#mdInformeOpt .modal-body").html(selTrabajadores)
}

function enviarInformeOpt(pindex) {
    var objAux = listFullEventos[pindex];
    var trabajador = $("#selTrabajadores").val();
    var dataParam =
        {
            linkAuxiliarId1: trabajador,
            linkAuxiliarId2: parseInt(getSession("trabajadorGosstId")),
            tipoEvento: objAux.tipoEvento,
            idAux: objAux.idAux
        }
    callAjaxPost(URL + '/scheduler/eventos/informe', dataParam,
        function () {
            alert("enviado");
            $("#mdInformeOpt").modal("hide");
        });
}


////////////autor: (AntoniTito4)  Tema: Contador de documentos de procedimiento de seguridad.

let counter = 0;
let message = "Hey! STOP! You have clicked so many times!"


function changeState(check, element) {
    if (!check.checked) {
        element.setAttribute('disabled', 'disabled'); //atributo y valor
        element.setAttribute('checked', 'true'); //atributo y valor
    } else {
        element.removeAttribute('disabled'); //el atributo
        element.setAttribute('checked', 'false');
    }
}

var doc = [];

function contarClick(id, des, idProcedimiento) {
    var descarga = document.getElementById(id);
    changeState(id, descarga);
    var des1 = parseInt(des);

    if (!(doc.find(element => element == des1) == des1)) {
        doc.push(des1);
        // var num = document.getElementById("counting").innerHTML = ++counter;
        // $(".prueba").find("h2").html(num);
        if (counter > 1) {
            document.getElementById("warning").innerHTML = message;
        }
    }
    console.log(' ESTE DOCUMENTO ES  ' + idProcedimiento)


    var dataParam = {
        trabajadorId: getSession("trabajadorGosstId")

    };
    var datos = {
        procedimientoSeguridadId: idProcedimiento
    };

    var trabajdorId = getSession("trabajadorGosstId");
    var procedimientoSeguridadId1 = idProcedimiento;

    var datox = [];

    datox.push(trabajdorId);
    datox.push(procedimientoSeguridadId1);

    console.log(dataParam);

    console.log(datox);

    callAjaxPost(URL + '/scheduler/trabajador/documentos/descargado', datox,
        function (data) {


        });

}

////////////Fin4 Contador de documentos de procedimiento de seguridad.

function verVersionAnexos(positionId) {
    var dataParam = {
        versionProcedimiento: {id: positionId}
    };

    callAjaxPost(URL + '/procedimientoseguridad/version/anexo', dataParam, function (data) {
        var listFullAnexo = data.list;
        var contenido = "";
        var listContenido = [];

        listFullAnexo.forEach(function (val, index) {
            var textoEvidencia = (val.evidenciaNombre == "" ? "------" :
                "<a class='efectoLink' target='_blank' " +
                "href='" + URL + "/procedimientoseguridad/version/anexo/evidencia_archivo?id=" + val.id + "' >" +
                val.evidenciaNombre +
                "</a>");

            var listContenido = [
                {
                    sugerencia: "",
                    label: "<i class='fa fa-tag' aria-hidden='true'></i> Código:",
                    inputForm: val.codigo
                },
                {
                    sugerencia: "",
                    label: "<i class='fa fa-bookmark' aria-hidden='true'></i> Título:",
                    inputForm: val.titulo
                },
                {
                    sugerencia: "",
                    label: "<i class='fa fa-file-o' aria-hidden='true'></i> Archivo:",
                    inputForm: textoEvidencia
                }
            ];

            if (listFullAnexo.length > (index + 1)) {
                listContenido.push({sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""});
            }

            listContenido.forEach(function (val) {
                contenido += obtenerSubPanelModuloVersionDos(val);
            });
        });

        var modalOptions = {
            id: "modalVersionAnexos",
            nombre: "<i class='fa fa-book'></i> Anexos (" + listFullAnexo.length + ")",
            contenido: "<div class='eventoGeneral'>" + contenido + "</div>"
        };

        crearModalPrincipalUsuario(modalOptions, function () {
        }, false);

//      insertMenu();
        $("#modalVersionAnexos").modal("show");
    });
}

function descargarWordReporteEntregaEpp(pindex) {
    var objEvento = listFullEventos[pindex];

    window.open(URL + "/equiposeguridad/informe?entregaEppId=" + objEvento.idAux);
}

var medidaCorrectivaEvento, tituloEventoAux, urlDescargaEventoAux, urlGuardarEventoAux, parteKeyGuardarEventoAux,
    parametroEventoAux;

function ocultarCerrarMedidaCorrectivaEvento() {
    $("#modalCerraMedidaCorrectivaEvento").modal("hide");
}

function cerrarMedidaCorrectivaEvento(indexEvento) {
    $("#modalCerraMedidaCorrectivaEvento").remove();

    medidaCorrectivaEvento = listFullEventos[indexEvento];

    if (medidaCorrectivaEvento.linkAuxiliarId1 == "1A") {
        tituloEventoAux = "Medida correctiva - Inspección extintor";
        urlDescargaEventoAux = "/auditoria/verificaciones/respuesta/version_dos/auditoria_extintor/accion_correctiva/evidencia?" +
            "detalleAuditoriaExtintorId=";
        urlGuardarEventoAux = "/auditoria/verificaciones/respuesta/version_dos/auditoria_extintor/accion_correctiva/evidencia/save";
        parametroEventoAux = "detalleAuditoriaExtintorId";
    } else if (medidaCorrectivaEvento.linkAuxiliarId1 == "1B") {
        tituloEventoAux = "Medida correctiva - Inspección de gabinetes contra incendios";
        urlDescargaEventoAux = "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/accion_correctiva/evidencia?" +
            "detalleAuditoriaGabineteIncendioId=";
        urlGuardarEventoAux = "/auditoria/verificaciones/respuesta/version_dos/auditoria_gabinete_incendio/accion_correctiva/evidencia/save";
        parametroEventoAux = "detalleAuditoriaGabineteIncendioId";
    } else if (medidaCorrectivaEvento.linkAuxiliarId1 == "1C") {
        tituloEventoAux = "Medida correctiva - Inspección uso adecuado de EPP";
        urlDescargaEventoAux = "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/accion_correctiva/evidencia?" +
            "detalleAuditoriaTrabajadorEppId=";
        urlGuardarEventoAux = "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/accion_correctiva/evidencia/save";
        parametroEventoAux = "detalleAuditoriaTrabajadorEppId";
    } else if (medidaCorrectivaEvento.linkAuxiliarId1 == "1D") {
        tituloEventoAux = medidaCorrectivaEvento.tipoEventoTitulo;
        urlGuardarEventoAux = "/auditoria/amazon_s3/verificaciones/accion_correctiva/evidencia/save";
        parteKeyGuardarEventoAux = "detalle-auditoria/evidencia-acc-correctiva";
    }

    var listItemsMedCorrectiva=[
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia*",inputForm:"",divContainer:"divEvidenciaMedCorEvento"}
    ];
    
    if(medidaCorrectivaEvento.linkAuxiliarId1 == "1D"){
	var verDetalleEvento = "<a class='efectoLink' onclick='validacionEvidenciaAuxiliarInspeccV2Gen(3,2,0,"+medidaCorrectivaEvento.idAux+",0,0)'>"+"<i class='fa fa-eye'></i> Ver registros"+"</a>",
	    margenAux = (isMobile.any()?"margin:0px 0px -10px 0px;":"");
	
	listItemsMedCorrectiva.push({sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
    	    {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Evidencia auxiliar:",inputForm:verDetalleEvento});
    }
    
    listItemsMedCorrectiva.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {
            sugerencia: "",
            label: "<button class='btn btn-danger' style='font-size:18px;' type='button' " +
                "onclick='ocultarCerrarMedidaCorrectivaEvento()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
            inputForm: "<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
                "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
                "</button>"
        });

    var textFormMedCorrectiva = "";

    listItemsMedCorrectiva.forEach(function (val, index) {
        textFormMedCorrectiva += obtenerSubPanelModuloVersionDos(val);
    });

    var opciones = {
        id: "modalCerraMedidaCorrectivaEvento", nombre: tituloEventoAux,
        contenido: "<form id='formEditarCamposMedCorEvento' class='eventoGeneral'>" + textFormMedCorrectiva + "</form>"
    };

    crearModalPrincipalUsuario(opciones, function () {
    }, true, true);

    if (medidaCorrectivaEvento.linkAuxiliarId1 != "1D") {
        var options = {
            container: "#divEvidenciaMedCorEvento", functionCall: function () {
                validacionSubirEvidencia("MedCorEvento", bitsEvidenciaVerificacion, "modalCerraMedidaCorrectivaEvento");
            }, descargaUrl: urlDescargaEventoAux + medidaCorrectivaEvento.idAux,
            esNuevo: (medidaCorrectivaEvento.evidenciaNombre == "----" ? true : false), idAux: "MedCorEvento",
            evidenciaNombre: (medidaCorrectivaEvento.evidenciaNombre == "----" ? "" : medidaCorrectivaEvento.evidenciaNombre),
            mensajeAux: "*Al subir la evidencia y guardar, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
        };

        crearFormEvidenciaCompleta(options);
    } else {
        var options = {
            container: "#divEvidenciaMedCorEvento", functionCall: function () {
                validacionSubirEvidencia("MedCorEvento", bitsEvidenciaVerificacion, "modalCerraMedidaCorrectivaEvento");
            }, descargaUrl: medidaCorrectivaEvento.evidenciaUrl,
            esNuevo: (medidaCorrectivaEvento.evidenciaNombre == "----" ? true : false), idAux: "MedCorEvento",
            evidenciaNombre: (medidaCorrectivaEvento.evidenciaNombre == "----" ? "" : medidaCorrectivaEvento.evidenciaNombre),
            mensajeAux: "*Al subir la evidencia y guardar, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
        };

        crearFormEvidenciaAmazonS3Completa(options);
    }

    var editarDiv = $("#formEditarCamposMedCorEvento");

    editarDiv.on('submit', function (e) {
        e.preventDefault();
        guardarCerrarMedidaCorrectivaEvento();
    });
}

function guardarCerrarMedidaCorrectivaEvento() {
    var campoVacio = true;

    var evidenciaNombre = $("#inputEviMedCorEvento").val();

    if (evidenciaNombre.length == 0) {
        mensajeUx = "<label>Debe subir la evidencia respectiva.</label>";
        campoVacio = false;
    } else if (evidenciaNombre == "VOLVER A SUBIR") {
        mensajeUx = "<label>Debe volver a subir la evidencia respectiva.</label>";
        campoVacio = false;
    }

    if (campoVacio) {
        if (medidaCorrectivaEvento.linkAuxiliarId1 != "1D") {
            guardarEvidenciaAuto(medidaCorrectivaEvento.idAux, "fileEviMedCorEvento", bitsEvidenciaVerificacion,
                urlGuardarEventoAux, function () {
                    $("#modalCerraMedidaCorrectivaEvento").modal("hide");
                    $.unblockUI();

                    mensajeUx = "<label>La evidencia de la medida correctiva* se guardó con éxito." +
                        "<br><br>*El registro se encuentra en 'Actividades completadas'.</label>";
                    mensajesUx(mensajeUx, 1, "", "ActCerrarMedCorEvento");

                    $("#modalMensajeUxActCerrarMedCorEvento").on("hidden.bs.modal", function () {
                        traerEventosTrabajador();
                    });
                }, parametroEventoAux);
        } else {
            guardarEvidenciaAutoVersionS3(1, medidaCorrectivaEvento.idAux, "fileEviMedCorEvento", bitsEvidenciaVerificacion,
                1, 1, urlGuardarEventoAux, parteKeyGuardarEventoAux, function () {
                    $("#modalCerraMedidaCorrectivaEvento").modal("hide");

                    mensajeUx = "<label>La evidencia de la medida correctiva* se guardó con éxito." +
                        "<br><br>*El registro se encuentra en 'Actividades completadas'.</label>";
                    mensajesUx(mensajeUx, 1, "", "ActCerrarMedCorEvento");

                    $("#modalMensajeUxActCerrarMedCorEvento").on("hidden.bs.modal", function () {
                        traerEventosTrabajador();
                    });
                });
        }
    } else {
        $("#modalCerraMedidaCorrectivaEvento").modal("hide");

        mensajesUx(mensajeUx, 2, "", "AvisoCerrarMedCorEvento");

        $("#modalMensajeUxAvisoCerrarMedCorEvento").on("hidden.bs.modal", function () {
            $("#modalCerraMedidaCorrectivaEvento").modal("show");
        });
    }
}

var listOpcConsolidadoActExcel = [
    {id: 1, nombre: "Reporte entrega de EPPs"}
];

function ocultarListaConsolidadosActividadExcel() {
    $("#modalListaConsolidadoActivExcel").modal("hide");
}

function verFiltroListaConsolidadosActividadExcel() {
    $("#modalListaConsolidadoActivExcel").remove();

    var selOpcConsActExcel = crearSelectOneMenuOblig("selOpcConsActExcel", "",
        listOpcConsolidadoActExcel, "1", "id", "nombre");

    var contenido = "";

    var listContenido = [
        {
            sugerencia: "",
            anchoLabel: "col-sm-2",
            anchoDiv: "col-sm-10",
            label: "Consolidado",
            inputForm: selOpcConsActExcel
        },
        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
        {
            sugerencia: "", anchoLabel: "", anchoDiv: "", label: "Desde",
            inputForm: "<input type='date' id='fechaInicioConsolidadoActExcel' class='form-control'>"
        },
        {
            sugerencia: "", anchoLabel: "", anchoDiv: "", label: "Hasta",
            inputForm: "<input type='date' id='fechaFinConsolidadoActExcel' class='form-control'>"
        },
        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
        {
            sugerencia: "", anchoLabel: "", anchoDiv: "",
            label: "<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                "onclick='ocultarListaConsolidadosActividadExcel()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
            inputForm: "<button class='btn btn-success' style='float:right;font-size:18px;' type='submit'>" +
                "<i class='fa fa-download'></i> Descargar" +
                "</button>"
        }
    ];

    listContenido.forEach(function (val) {
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions = {
        id: "modalListaConsolidadoActivExcel",
        nombre: "<i class='fa fa-filter'></i> Seleccionar valores - descargar consolidado",
        contenido: "<form id='formSelConsolActividadExcel' class='eventoGeneral'>" + contenido + "</form>"
    };

    crearModalPrincipalUsuario(modalOptions, function () {
    }, true, true);

    var hoy = getSession("fechaHoyOrdenInversoTexto");

    $("#fechaInicioConsolidadoActExcel").val(sumaFechaDias(-180, hoy));
    $("#fechaFinConsolidadoActExcel").val(hoy);

    var editarDiv = $("#formSelConsolActividadExcel");

    editarDiv.on('submit', function (e) {
        e.preventDefault();
        descargarConsolidadosActividadExcelSeleccionadoLista();
    });
}

function descargarConsolidadosActividadExcelSeleccionadoLista() {
    var fechaInicioConsolidado = $("#fechaInicioConsolidadoActExcel").val();
    var fechaFinConsolidado = $("#fechaFinConsolidadoActExcel").val();
    var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
    var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);

    window.open(URL + "/equiposeguridad/reporte/excel/trabajador?" +
        "empresaId=" + getSession("gestopcompanyid") + "&fechaInicioConsolidado=" + fechaInicioConsolidado +
        "&fechaFinConsolidado=" + fechaFinConsolidado + "&fechaInicioConsolidadoNormal=" + fechaInicioConText +
        "&fechaFinConsolidadoNormal=" + fechaFinConText);

    $("#modalListaConsolidadoActivExcel").modal("hide");
}

// funcion para cargarlo como promesa
// function callAjaxPostAsPromise(url, dataParam) {
//     return new Promise((resolve, reject) => {
//         callAjaxPost(url, dataParam,
//             function (data) { // Función de éxito
//                 if (data.CODE_RESPONSE === "05") {
//                     resolve(data); // Resuelve la promesa con los datos
//                 } else {
//                     reject("Error al cargar listas auxiliares de huella de carbono."); // Rechaza la promesa
//                 }
//             },
//             null, // funcionBefore (puedes pasar la función o null si no la necesitas)
//             null, // dataBefore (datos para funcionBefore, si es necesario)
//             function (error) { // Función de error
//                 reject(error); // Rechaza la promesa con el error
//             }
//         );
//     });
// }

async function cargarListasHc() {

    try {

        var dataParam = {
            idEmpresa: getSession("gestopcompanyid"),
            idUsuario: getSession("gestopusuarioid"),
        };

        const data = await callAjaxPostAsPromise(URL + '/huella-carbono/listar-auxiliares', dataParam);
        // Si la promesa se resuelve, procesa los datos aquí
        // Actualiza tus variables o estado de la UI según necesites
        if (data.CODE_RESPONSE == "05") {
            listaMesesHc = data.meses;
            listaAniosHc = data.anios;
            listaAlcancesHc = data.alcancesHuellaCarbono;
            listaTipoMedicionHc = data.tiposMedicionHuellaCarbono;
            listaFuentesHc = data.fuentesHuellaCarbono;
            listaUnidadesHc = data.unidadesHuellaCarbono;
            listaPaisEmpresaHc = data.mdfList;
            listaSedeHc = data.sedes;
            cantHuellasCarbonoUsuario = data.cantHuellasCarbonoUsuario;
        } else {
            listaMesesHc = [];
            listaAniosHc = [];
            listaAlcancesHc = [];
            listaTipoMedicionHc = [];
            listaFuentesHc = [];
            listaUnidadesHc = [];
            listaPaisEmpresaHc = [];
            listaSedeHc = [];
            cantHuellasCarbonoUsuario = 0
            console.log("Error al cargar listas auxiliares de huella de carbono.");
        }
    } catch (error) {
        // Maneja el error si la promesa es rechazada
        console.error(error);
    }
}

async function seccionAcademiaVirtual() {

    $(".divListPrincipal").html(
        "<div id='subAcademiaVirtual'>" +

        "<div class='tituloSubList'>" +
        "<i class='fa fa-graduation-cap'></i> Academia Virtual GoSST" +
        "</div>" +

        "<div class='contenidoSubList' style='width:100%'>" +

        "<div id='divContainMoodleContratista' style='width:100%'>" +
        "<div class='text-center' style='padding:40px'>" +
        "<i class='fa fa-spinner fa-spin fa-2x'></i><br>" +
        "Cargando academia virtual..." +
        "</div>" +
        "</div>" +

        "</div>" +
        "</div>"
    );

    cargarMoodleContratista(0);
}

async function seccionHuellaCarbono() {
    await cargarListasHc();
    $(".divListPrincipal").html(
        "<div id='subNuevaHuellaCarbono'>" +
        "<div class='tituloSubList'>Nuevo registro de huella de carbono " +
        // Inicialmente visible
        "<button style='font-size:16px;' class='btn btn-success' id='btnMostrarForm' " +
        "onclick='nuevaHuellaCarbono()'>" +
        "<i class='fa fa-plus fa-2x'></i>" +
        "</button>" +
        // Inicialmente oculto
        "<button style='font-size:16px; display:none;' class='btn btn-success' id='btnOcultarForm' " +
        "onclick='ocultarFormularioHuellaCarbono()'>" +
        "<i class='fa fa-minus fa-2x'></i>" +
        "</button>" +
        "</div>" +
        "<div class='contenidoSubList' id='contenidoNuevaHuella'></div>" +
        "</div>" +
        "<div id='subListaHuellasCarbono'>" +
        "<div class='tituloSubList'>Registro de huella de carbono guardados (" + cantHuellasCarbonoUsuario + ")" +
        // Inicialmente visible
        "<button style='font-size:16px;' class='btn btn-success' id='btnVerListaHuellaCarbono' " +
        "onclick='verListaHuellasCarbono()'>" +
        "<i class='fa fa-caret-down fa-2x'></i>" +
        "</button>" +
        // Inicialmente oculto
        "<button style='font-size:16px; display:none;' class='btn btn-success' id='btnOcultarListaHuellaCarbono' " +
        "onclick='ocultarListaHuellasCarbono()'>" +
        "<i class='fa fa-minus fa-2x'></i>" +
        "</button>" +
        "</div>" +
        "<div class='contenidoSubList' id='listaHuellasGuardadas'></div>" +
        "</div>" +
        "<div id='subListaHuellasCarbono'>" +
        "<div class='tituloSubList'><i aria-hidden='true' class='fa fa-pie-chart'></i> Ver análisis de datos " +
        // Inicialmente visible
        "<button style='font-size:16px;' class='btn btn-success' id='btnVerListaHuellaCarbono' " +
        "onclick='verQuicksightHuellasCarbono()'>" +
        "<i class='fa fa-arrow-right fa-2x'></i>" +
        "</button>" +
        "</div>" +
        "</div>"
    );
    // Generar y mostrar la lista de huellas de carbono registradas
    mostrarListaHuellasCarbono();
    $("#listaHuellasGuardadas").hide();
}

function mostrarListaHuellasCarbono() {
    let contenido = "";

    var dataParam = {
        idUsuario: getSession("gestopusuarioid"),
    };
    callAjaxPost(URL + '/huella-carbono/listar/user', dataParam,
        function (data) {
            if (data.CODE_RESPONSE === "05") {
                listaFullHuellaCarbonoUser = data.huellasCarbono;

                if (listaFullHuellaCarbonoUser.length === 0) {
                    contenido = "<div class='eventoGeneral' style='border-left:8px solid;'>No hay registros de huella de carbono.</div>";
                }
                listaFullHuellaCarbonoUser.forEach((val) => {
                    let textoEvidencia = ""
                    if (val.idEvidenciaHuellaCarbono !== 0) {
                        textoEvidencia = `<a href="#" onclick="openInGoogleDocsViewer(event, '${val.urlArchivoEvidencia}', '${val.nombreArchivoEvidencia}')" style="text-decoration: underline; color: blue;">${val.nombreArchivoEvidencia}</a>`;
                    }
                    contenido += `
                            <div class='eventoGeneral' style='border-left:8px solid;'>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>Código de registro:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${val.codigoHuellaCarbono}</div>
                                </div>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>Año:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${val.anio}</div>
                                </div>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>Mes:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${val.mes}</div>
                                </div>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>País - Empresa:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${val.matrizDespliegueDeFunciones}</div>
                                </div>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>Tipo de medición:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${val.tipoMedicionHuellaCarbono}</div>
                                </div>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>Alcance:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${val.alcanceHuellaCarbono}</div>
                                </div>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>Fuente:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${val.fuenteHuellaCarbono}</div>
                                </div>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>Unidades:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${val.unidadHuellaCarbono}</div>
                                </div>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>Consumo:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${val.consumoHuellaCarbono}</div>
                                </div>
                                <div class='row'>
                                    <div class='col-sm-6 text-right'><strong>Evidencia consumo propio:</strong></div>                         
                                    <div class='col-sm-6 text-left'>${textoEvidencia}</div>
                                </div>
                            </div>
                            `;
                });
            } else {
                console.log("No se pudieron cargar los datos de la huella de carbono.");
            }
            $('#listaHuellasGuardadas').html(contenido);
        });
}

function actualizarSelectFuentes(idAlcanceSeleccionado) {
    var selectFuente = $('#inputFuenteHC').empty(); // Limpiar el select antes de agregar nuevas opciones

    // Filtrar fuentes por el id de alcance seleccionado
    var fuentesFiltradas = listaFuentesHc.filter(function (fuente) {
        return fuente.idAlcanceHuellaCarbono == idAlcanceSeleccionado;
    });

    // Añadir las fuentes filtradas al select
    $.each(fuentesFiltradas, function (index, fuente) {
        selectFuente.append($('<option>', {
            value: fuente.idFuenteHuellaCarbono,
            text: fuente.fuenteHuellaCarbono
        }));
    });
}

function verListaHuellasCarbono() {
    visibleRegistroHuellaCarbono = 1
    $("#btnVerListaHuellaCarbono").hide();
    $("#btnOcultarListaHuellaCarbono").show();
    $("#listaHuellasGuardadas").show();
    // mostrarListaHuellasCarbono();
}

function ocultarListaHuellasCarbono() {
    visibleRegistroHuellaCarbono = 0
    $("#btnVerListaHuellaCarbono").show();
    $("#btnOcultarListaHuellaCarbono").hide();
    $("#listaHuellasGuardadas").hide();
}

function nuevaHuellaCarbono() {
    $("#btnMostrarForm").hide();
    $("#btnOcultarForm").show();
    $("#contenidoNuevaHuella").html(
        "<form id='formNuevaHuellaCarbono' class='eventoGeneral form-horizontal'>" +
        "<div class='form-group row'>" +
        "<label for='inputAnoHC' class='col-sm-4 col-form-label'>Año</label>" +
        "<div class='col-sm-8'>" +
        "<select id='inputAnoHC' class='form-control'></select>" +
        "</div>" +
        "</div>" +
        "<div class='form-group row'>" +
        "<label for='inputMesHC' class='col-sm-4 col-form-label'>Mes</label>" +
        "<div class='col-sm-8'>" +
        "<select id='inputMesHC' class='form-control'></select>" +
        "</div>" +
        "</div>" +
        "<div class='form-group row'>" +
        "<label for='inputPaisEmpresaHC' class='col-sm-4 col-form-label'>PAÍS - EMPRESA</label>" +
        "<div class='col-sm-8'>" +
        "<select id='inputPaisEmpresaHC' class='form-control'></select>" +
        "</div>" +
        "</div>" +
        "<div class='form-group row'>" +
        "<label for='inputTipoMedicionHC' class='col-sm-4 col-form-label'>Tipo de medición</label>" +
        "<div class='col-sm-8'>" +
        "<select id='inputTipoMedicionHC' class='form-control'></select>" +
        "</div>" +
        "</div>" +
        "<div class='form-group row'>" +
        "<label for='inputAlcanceHC' class='col-sm-4 col-form-label'>Alcance</label>" +
        "<div class='col-sm-8'>" +
        "<select id='inputAlcanceHC' class='form-control'></select>" +
        "</div>" +
        "</div>" +
        "<div class='form-group row'>" +
        "<label for='inputFuenteHC' class='col-sm-4 col-form-label'>Fuente</label>" +
        "<div class='col-sm-8'>" +
        "<select id='inputFuenteHC' class='form-control'></select>" +
        "</div>" +
        "</div>" +
        "<div class='form-group row'>" +
        "<label for='inputUnidadesHC' class='col-sm-4 col-form-label'>Unidades</label>" +
        "<div class='col-sm-8'>" +
        "<select id='inputUnidadesHC' class='form-control' disabled></select>" +
        "</div>" +
        "</div>" +
        "<div class='form-group row'>" +
        "<label for='inputConsumoHC' class='col-sm-4 col-form-label'>Consumo</label>" +
        "<div class='col-sm-8'>" +
        "<input type='text' id='inputConsumoHC' class='form-control'>" +
        "</div>" +
        "</div>" +
        "<div class='form-group row'>" +
        "<label for='inputEvidenciaHC' class='col-sm-4 col-form-label'>Evidencia consumo</label>" +
        "<div class='col-sm-8'>" +
        "<div class='input-group'><label class='label-upload input-group-btn'>" +
        "<span class='btn btn-primary'><i class='fa fa-upload fa-lg'></i> Subir " +
        "<input style='display:none;' type='file' id='inputEvidenciaHC'></span></label>" +
        "<input type='text' id='inputEvidenciaHCTexto' class='form-control' readonly></div>" +
        "</div>" +
        "</div>" +
        "<div class='form-group row' style='border-top: 1px solid #a5aaae;'><label for='colFormLabel' class='col-sm-4 col-form-label'></label><div class='col-sm-8' id='undefined'> <small></small></div></div>" +
        "<div class='form-group row'>" +
        "<div class='col-sm-12 offset-sm-12 text-center'>" +
        "<button id='btnGuardarHuellaCarbono' type='submit' class='btn btn-primary'>Registrar</button>" +
        "</div>" +
        "</div>" +
        "</form>"
    );

    // Llamar a la función con el ID del input
    limitInputDecimal('inputConsumoHC');

    // Llenando el select de años
    var selectAno = $('#inputAnoHC');
    selectAno.empty(); // Limpiar el select antes de agregar nuevas opciones
    listaAniosHc.forEach(function (anioObj) {
        selectAno.append($('<option>', {
            value: anioObj.idAnio,
            text: anioObj.anio
        }));
    });

    // Llenando el select de meses
    var selectMes = $('#inputMesHC');
    selectMes.empty(); // Limpiar el select antes de agregar nuevas opciones
    listaMesesHc.forEach(function (mesObj) {
        selectMes.append($('<option>', {
            value: mesObj.idMes,
            text: mesObj.mes
        }));
    });

    listaPaisEmpresaHc.forEach(function (paisEmpresaObj) {
        $('#inputPaisEmpresaHC').append($('<option>', {
            value: paisEmpresaObj.id,
            text: paisEmpresaObj.nombre
        }));
    });

    // Llenando el select de alcances y añadiendo el manejador de evento change
    var selectAlcance = $('#inputAlcanceHC').empty().change(function () {
        var idAlcanceSeleccionado = $(this).val();
        actualizarSelectFuentes(idAlcanceSeleccionado);
        // Forzar la actualización del select de fuentes para disparar el cambio y actualizar las unidades
        $('#inputFuenteHC').change();
    });

    // Añadir opciones al select de alcances
    listaAlcancesHc.forEach(function (alcanceObj) {
        selectAlcance.append($('<option>', {
            value: alcanceObj.idAlcanceHuellaCarbono,
            text: alcanceObj.alcanceHuellaCarbono
        }));
    });

    // Llenando el select de tipos de medición
    var selectTipoMedicion = $('#inputTipoMedicionHC');
    selectTipoMedicion.empty(); // Limpiar el select antes de agregar nuevas opciones
    listaTipoMedicionHc.forEach(function (tipoMedicionObj) {
        selectTipoMedicion.append($('<option>', {
            value: tipoMedicionObj.idTipoMedicionHuellaCarbono,
            text: tipoMedicionObj.tipoMedicionHuellaCarbono
        }));
    });

    // Llenando el select de unidades
    var selectUnidades = $('#inputUnidadesHC');
    selectUnidades.empty(); // Limpiar el select antes de agregar nuevas opciones
    listaUnidadesHc.forEach(function (unidadObj) {
        selectUnidades.append($('<option>', {
            value: unidadObj.idUnidadHuellaCarbono,
            text: unidadObj.unidadHuellaCarbono
        }));
    });

    // Añade el manejador de evento change al select de fuentes
    $('#inputFuenteHC').change(function () {
        var idFuenteSeleccionada = $(this).val();
        var fuenteSeleccionada = listaFuentesHc.find(fuente => fuente.idFuenteHuellaCarbono == idFuenteSeleccionada);

        if (fuenteSeleccionada) {
            var idUnidadCorrespondiente = fuenteSeleccionada.idUnidadHuellaCarbono;
            // Establecer el valor y actualizar el select de unidades
            $('#inputUnidadesHC').val(idUnidadCorrespondiente).change();
        }
    });

    // Llenando el select de fuentes y añadiendo el manejador de evento change para actualizar las unidades automáticamente
    var selectFuente = $('#inputFuenteHC').empty().change(function () {
        var idFuenteSeleccionada = $(this).val();
        // Encontrar la unidad correspondiente a la fuente seleccionada
        var fuenteSeleccionada = listaFuentesHc.find(fuente => fuente.idFuenteHuellaCarbono == idFuenteSeleccionada);
        if (fuenteSeleccionada) {
            var idUnidadCorrespondiente = fuenteSeleccionada.idUnidadHuellaCarbono;
            // Actualizar el select de unidades con el valor correspondiente
            $('#inputUnidadesHC').val(idUnidadCorrespondiente);
        }
    });


    selectAlcance.change();

    // Después de establecer el HTML del formulario, adjuntas el controlador de evento submit
    $('#formNuevaHuellaCarbono').on('submit', function (event) {
        event.preventDefault(); // Esto evita que el formulario se envíe y recargue la página.
        guardarHuellaCarbono(); // Llama a la función que maneja el guardado
    });

}

function guardarHuellaCarbono() {
    const archivoInput = document.getElementById('inputEvidenciaHC');

    if (archivoInput.files.length > 0) {
        var archivo = archivoInput.files[0];

        // Obtiene el nombre del archivo
        var nombreArchivo = archivo.name;

        // Obtiene el tipo MIME del archivo
        var tipoArchivo = archivo.type;

        // Obtiene el tamaño del archivo en bytes
        // var tamanoBytes = archivo.size;
        // console.log("Tamaño del archivo en bytes:", tamanoBytes);
        // Convierte el tamaño a megabytes (MB)
        // var tamanoMB = tamanoBytes / (1024 * 1024);
        // console.log("Tamaño del archivo en MB:", tamanoMB.toFixed(2));

        var lector = new FileReader();

        lector.onload = function (e) {
            var contenidoEnBase64 = btoa(e.target.result); // Convierte el contenido a Base64
            procederGrabarHuellaCarbono(nombreArchivo, tipoArchivo, contenidoEnBase64); // Llama aquí después de la conversión
        };

        lector.readAsBinaryString(archivo); // Lee el archivo como una cadena binaria
    } else {
        procederGrabarHuellaCarbono('', '', ''); // Llama aquí si no hay archivo
    }

}

function procederGrabarHuellaCarbono(nombreArchivo, tipoArchivo, contenidoEnBase64) {

    const idPais = listaPaisEmpresaHc.find(peHc => peHc.id === Number($('#inputPaisEmpresaHC').val())).idPais;
    const consumoHC = $('#inputConsumoHC').val();
    const consumoHCNum = Number(consumoHC);

    if (consumoHCNum === 0 || consumoHC.trim() === "") {
        const mensaje = "<label>Valor de consumo no valido.</label>";
        mensajesUx(mensaje, 2, "", "gHC");
        return; // Detiene la ejecución de la función
    }


    var nuevaHuellaCarbono = {
        idAnio: $('#inputAnoHC').val(),
        idMes: $('#inputMesHC').val(),
        idPais: idPais,
        idMatrizDespliegueDeFunciones: $('#inputPaisEmpresaHC').val(),
        idTipoMedicionHuellaCarbono: $('#inputTipoMedicionHC').val(),
        idAlcanceHuellaCarbono: $('#inputAlcanceHC').val(),
        idFuenteHuellaCarbono: $('#inputFuenteHC').val(),
        idUnidadHuellaCarbono: $('#inputUnidadesHC').val(),
        consumoHuellaCarbono: consumoHC,
        nombreArchivoEvidencia: nombreArchivo,
        tipoArchivoEvidencia: tipoArchivo,
        dataArchivoEvidencia: contenidoEnBase64,
        idUsuarioRegistrador: getSession("gestopusuarioid"),
    };

    callAjaxPost(URL + '/huella-carbono/save', nuevaHuellaCarbono, procesarGuardarHuellaCarbono);
}

async function procesarGuardarHuellaCarbono(data) {
    switch (data.CODE_RESPONSE) {
        case "05":
            const mensaje = "<label>Se registro de forma correcta.</label>";
            ocultarFormularioHuellaCarbono();
            await seccionHuellaCarbono();
            if (visibleRegistroHuellaCarbono === 1) {
                verListaHuellasCarbono();
            }
            mostrarListaHuellasCarbono();
            mensajesUx(mensaje, 1, "", "gHC");
            break;
        default:
            alert("Ocurrió un error al guardar la huella de carbono.");
    }
}

function ocultarFormularioHuellaCarbono() {
    // Ocultar el formulario y mostrar el botón de mostrar formulario, ocultar el de ocultar
    $("#contenidoNuevaHuella").html("");
    $("#btnOcultarForm").hide();
    $("#btnMostrarForm").show();
}

function verQuicksightHuellasCarbono() {

    $(".divContainerGeneral").hide();

    var buttonVolver = "<button type='button' id='btnVolverDetalle' class='btn btn-success ' style='margin-right:10px'" +
        " onclick='volverVistaHC()'>" +
        "<i class='fa fa-sign-out fa-rotate-180'></i>Volver" +
        "</button>";

    $("body")
        .append(
            "<div id='divHuellaCarbonoTabla' style='padding-left: 40px;'>" +
            "<form class='form-inline' id='formBtnGeneral'>" +
            buttonVolver +
            "</form>" +

            "<div class='container-fluid' id='divContainQuicksightAnalisisDatosHC' " +
            "style='padding-right: 40px; padding-left: 0px'></div>" +
            "</div>");

    tituloAnteriorColaborador = $(".divTituloGeneral h4").text();
    $(".divTituloGeneral h4").html("Análizar datos de Huellas de Carbono");

    cargarQuicksightHuellasCarbono();

}

function cargarQuicksightHuellasCarbono() {
    // Mostrar mensaje de carga
    $('#divContainQuicksightAnalisisDatosHC').html('<div class="loading">Cargando...</div>');

    var dataParam = {
        idEmpresa: getSession("gestopcompanyid"),
    };

    callAjaxPost(URL + '/quicksight/huella-carbono', dataParam, function (data) {
        if (data.CODE_RESPONSE === "05") {
            // Definir la URL del contenido que deseas mostrar en el iframe
            var urlDelIframe = data.embedUrl;

            // Crear el elemento iframe y configurar sus propiedades
            var $iframe = $('<iframe>', {
                src: urlDelIframe,
                width: '100%',
                height: '750px', // Ajusta esto según tus necesidades
                frameborder: '0',
                css: {
                    border: 'none' // Opcional: Añadir estilos adicionales si es necesario
                }
            }).on('load', function () {
                // Eliminar el mensaje de carga una vez que el iframe se haya cargado
                $('.loading').remove();
                console.log('El contenido de QuickSight ha terminado de cargar.');
            });

            // Limpiar el contenedor y añadir el iframe
            $('#divContainQuicksightAnalisisDatosHC').empty().append($iframe);
        } else {
            console.log("No se pudieron cargar los datos de la huella de carbono.");
            // Actualizar el contenedor para mostrar un mensaje de error o quitar el mensaje de carga
            $('#divContainQuicksightAnalisisDatosHC').html('<div class="error">Error al cargar los datos.</div>');
        }
    });
}

function volverVistaHC() {
    $("#divHuellaCarbonoTabla").remove();
    $(".divContainerGeneral").show();
    $(".divListPrincipal > div").show();

    $(".divTituloGeneral h4").html(tituloAnteriorColaborador);
}

function cerrarSesionVistaColaborador(){
    if(parseInt(getSession("isAzure")) == 1){
        cerrarSesion();
    }else{
        (getSession("paramUrlLogin").length != 0?cerrarSesionPersonalizado():cerrarSesion());
    }
}

function descargarReporteFinalExcelInspeccionVistaColaborador(auditoriaIdAux){
    window.open(URL+"/auditoria/inspeccion/excel/reporte_final?"+"auditoriaId="+auditoriaIdAux);
}
