var listAyuda;
var listEmpresasSelect;
var ayudaId;
var bitsMega = 512000 * 2;
var listaModulosPermitidos = [];
var bitsLogoEmpresa = bitsMega * 4;
var bitsEvidenciaCurso = bitsMega * 18;
var bitsEvidenciaArchivoCurso = bitsMega * 45;
var bitsEvidenciaImagenPregunta = bitsMega * 18;
var bitsEvidenciaProcedimiento = bitsMega * 18;
var bitsEvidenciaVerificacion = bitsMega * 30;
var bitsEvidenciaAccidente = bitsMega * 18;
var bitsEvidenciaExamen = bitsMega * 18;
var bitsEvidenciaFormacion = bitsMega * 18;
var bitsEvidenciaVersion = bitsMega * 18;
var bitsEvidenciaEPP = bitsMega * 8;
var bitsEvidenciaActoInseguro = bitsMega * 18;
var bitsEvidenciaRespuestaSeguridad = bitsMega * 18;
var bitsEvidenciaAccionMejora = bitsMega * 18;
var bitsEvidenciaAnalisisCausa = bitsMega * 18;
var bitsEvidenciaEventoCalendario = bitsMega * 18;
var bitsEvidenciaAuditoria = bitsMega * 28;
var bitsEvidenciaHallazgo = bitsMega * 28;
var bitsEvidenciaControl = bitsMega * 18;
var bitsEvidenciaGrupo = bitsMega * 18;
var bitsEvidenciaReunion = bitsMega * 18;
var bitsEvidenciaAcuerdo = bitsMega * 18;
var bitsProfesor = bitsMega * 18;
var bitsEvidenciaObservacion = bitsMega * 18;
var bitsEvidenciaPostulante = bitsMega * 18;
var bitsEvidenciaEquipOperadorCap = bitsMega * 15;
var bitsEvidenciaEquipOperador = bitsMega * 15;
var bitsTransportsita = bitsMega * 18;
var bitsEvienciaLogo = bitsMega * 15;
var bitsEvidenciaIperc = bitsMega * 15;
var bitsEvidenciaProcedimiento = bitsMega * 15;
var bitsEvidenciaGrupo = bitsMega * 15
var bitsEvidenciaReunion = bitsMega * 15
var bitsEvidenciaDiagnostico = bitsMega * 25
var bitsEvidenciaComunicado = bitsMega * 15;
var bitsEvidenciaNormaLegal = bitsMega * 15;
var bitsEvidenciaHojaQuimica = bitsMega * 15;
var bitsEvidenciaDocPersonalExterno = bitsMega * 15;
var bitsEvidenciaSolicitudEval = bitsMega * 15;
var bitsEvidenciaEscenarioAccidente = bitsMega * 18;
var bitsEvidenciaEventoOpt = bitsMega * 15;
var bitsEvidenciaEvalEvento = bitsMega * 15;
var bitsEvidenciaHomologacion = bitsMega * 18;
var bitsEvidenciaActividad = bitsMega * 18;
var bitsEvidenciaDocumento = bitsMega * 18;
var bitsImagenExterno = bitsMega * 4;
var bitsImportExcel = 5000000; // 5 MB
var moduloSeleccionadoMenu;
var indexUnidadSeleccionada;
var irDirectamenteModulo = true;
var factorMovil;
var listBoolean = [{id: 0, nombre: "No"}, {id: 1, nombre: "Sí"}];
var listInterno = [{id: 1, nombre: "Interno"}, {id: 2, nombre: "Externo"}];

var textCampoObligatorio = "<label style='float:right;color:red;'>(obligatorio)</label>",
    textCampoOpcional = "<label style='float:right;color:blue;'>(opcional)</label>";
	
var styleLineaRobustaClasica = "border-top:1px solid #a5aaae;",
    styleLineaPunteadaClasica = "border-top: 1px dashed #a5aaae;",
	styleLineaSuaveMinimalista = "border-top:1px solid rgba(0,150,136,.22);margin:5px 0;padding-top:0px;",
	styleLineaPunteadaElegante = "border-top:1px dashed rgba(0,150,136,.26);margin:5px 0;padding-top:0px;",
	styleLineaDegradada = "height:1px;background:linear-gradient(to right,transparent,rgba(0,150,136,.35),transparent);margin:6px 0;",
	styleLineaCortaCentrada = "width:60%;margin:7px auto;border-top:1px solid rgba(0,150,136,.24);";
	
var iconoGosst = {
    aprobado: "<i style='font-size:19px; color: #9BBB59' class='fa fa-check' aria-hidden='true'></i>",
    advertir: "<i style='font-size:19px;color: #c5c54b' class='fa fa-warning' aria-hidden='true'></i>",
    desaprobado: "<i style='font-size:19px;color: #C0504D' class='fa fa-times' aria-hidden='true'></i>",
    alerta: "<i style='font-size:19px;color: #c5c54b' class='fa fa-warning' aria-hidden='true'></i>",
    por_evaluar: "<i style='font-size:19px; color: #b6b6b6' class='fa fa-check' aria-hidden='true'></i>",
    por_realizar: "<i style='font-size:19px;color: #df9226' class='fa fa-eye' aria-hidden='true'></i>",
    enviar: "<i style='font-size:19px;color: #213de8' class='fa fa-arrow-circle-o-up' aria-hidden='true'></i>",
    cara_feliz: "<i style='font-size:19px;color: black' class='fa fa-smile-o' aria-hidden='true'></i>",
    envio_registro: "<i style='font-size:19px;color: #2FA0FF' class='fa fa-paper-plane-o' aria-hidden='true'></i>"
};

var listBloqueLetras = [
    {id: 1, nombre: "A-I"}, {id: 2, nombre: "I-R"}, {id: 3, nombre: "R-Z"}, {id: 4, nombre: "Otros"}
];

function verAlertaSistemaGosst(tipoId, mensaje) {
    var icono = "nop"
    switch (parseInt(tipoId)) {
        case 1:
            icono = iconoGosst.aprobado
            break;
        case 2:
            icono = iconoGosst.enviar;
            break;
        case 3:
            icono = iconoGosst.cara_feliz;
            break;
        case 4:
            icono = iconoGosst.envio_registro;
            break;
    }
    ;
    $("body").append("<div class='mensajeGosst'>" + icono + mensaje + "</div>");
    $(".mensajeGosst").css({"margin-left": "-" + $(".mensajeGosst").width() / 2 + "px"});

    setTimeout(function () {
        $(".mensajeGosst").slideUp(1000, function () {
            $(".mensajeGosst").remove()
        });
    }, 1500);
}

function verAlertaSistemaGosstCompleto(tipoId, mensaje, functionCallBack) {
    var icono = "nop"
    switch (parseInt(tipoId)) {
        case 1:
            icono = iconoGosst.aprobado
            break;
        case 2:
            icono = iconoGosst.enviar;
            break;
        case 3:
            icono = iconoGosst.cara_feliz;
            break;
        case 4:
            icono = iconoGosst.envio_registro;
            break;
    }
    ;
    //$.unblockUI();
    $.blockUI({
        message: icono + mensaje
    });
    setTimeout(function () {
        $.unblockUI();
        ;functionCallBack()
    }, 800);
}

var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    Tablet: function () {
        return $(window).width() < 768;
    },
    any: function () {
        return ((isMobile.Android() || isMobile.BlackBerry()
            || isMobile.iOS() || isMobile.Opera()
            || isMobile.Windows()) && (isMobile.Tablet()));
    }
};

function actualizarPaginaGosst() {
    localStorage.clear();
    location.reload(true);
}

function completarBarraCarga() {
    var progressbar = $("#barraCarga");
    var val = progressbar.progressbar("value") || 0;

    progressbar.progressbar("value", val + 4);

    if (val < 99) {
        setTimeout(completarBarraCarga, 90);
        //era 80 :v
    }
}

var diapositivasCargadas = 0;
var tiempoPrueba = 1000 * 60 * 15;

function getStyleRule(name) {
    for (var i = 0; i < document.styleSheets.length; i++) {
        var ix, sheet = document.styleSheets[i];
        for (ix = 0; ix < sheet.cssRules.length; ix++) {
            if (sheet.cssRules[ix].selectorText === name)
                return sheet.cssRules[ix].style;
        }
    }
    return null;
}

function cambiarConfiguracionEmpresa() {
    var dataParam = {
        idCompany: getSession("gestopcompanyid")
    };
    $(".cargaPagina img").remove();
    callAjaxPost(URL + '/empresa/id', dataParam,
        function (data) {
            createSession("gestoparea", data.empresa.nombreArea);
            createSession("gestopdivision", data.empresa.nombreDivision);
            createSession("gestopunidad", data.empresa.nombreUnidad);
            createSession("gestopcompanyid", data.empresa.idCompany);
            createSession("gestopcompanyname", data.empresa.name);
            createSession("gestopcompanyruc", data.empresa.ruc);
            createSession("isProyectoSimple", data.empresa.isProyectoSimple);
            createSession("companyidcod", data.empresa.codigo);
            $("#companySelected").html("<i class='fa fa-building' style='margin-right: 10px'></i> <strong>Empresa :</strong>  " +
                getSession("gestopcompanyname").substring(0, 12)
                + " <span class='caret'></span>");
            $("<style>" +
                ".divInformacionCurso ,.divOpcionesGosst, .divDetalleInformacion,.divPreguntaCurso {background-color: white; color : " + data.empresa.color + " !important }" +
                ".cg-dia:hover, .cg-dia-hoy:hover,.subMenu {color: white; background-color : " + data.empresa.color + " !important }" +
                "#menuFigureti > ul > li:not(.subMenu):not(.subMenuImportant),.subDivTitulo,.subDivContenido,#tituloEvento>i ," +
                "a.efectoLink,.divListModulos,.divInformacionCurso,.divEvalPreguntaInspeccion { color : " + data.empresa.color + " !important} " +
                ".tituloSubList{ color : " + data.empresa.color + "; border : 2px solid " + data.empresa.color + " !important}" +
                "#divObjetivos,#divPiramide," +
                ".divListModulos>ul>li:hover,.activeMenu, .divTituloFull { color : " + data.empresa.color + " !important;border : 1px solid " + data.empresa.color + " !important}" +
                ".cg-seccion-dia-semana,.listaFinalGestionGosst li:hover,.subDetalleAccion >ul > li:hover, .subSubDetalleAccion >ul >li:hover, .listaGestionGosst li:hover," +
                ".itemFig:hover,.subItemFig:hover { background-color : " + data.empresa.color + " !important}" +
                ".alertaMenu,.itemFig,.subItemFig {border: 2px solid " + data.empresa.color + ";  color : " + data.empresa.color + " !important}" +
                ".btn-primary, .btn-success {border-color : " + data.empresa.color + " !important}" +
                ".btn-primary, .modal-header,.btn-success,.tb-acc, #barraMenu, .color-configuracion {background-color : " + data.empresa.color + " !important}</style>").appendTo("head")

            cambiarNombreAreaDivisionUnidad();
            var imagenLog = "";
            if (data.empresa.logo != null) {
                imagenLog = insertarImagenParaTablaMovil(data.empresa.logo, "200px", "200px");
            } else {
                imagenLog = "<img src='../imagenes/logo3.png' style='width:200px;height:210px'>"
            }
            $(".cargaPagina").prepend(imagenLog);
            //var rule = getStyleRule('.color-configuracion');
            //rule.backgroundColor = "red";


        });
}

$(function () {

    if ($(window).width() < 768) {
        factorMovil = 80
    } else {
        factorMovil = 0
    }

    $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
    var progressbar = $("#barraCarga"),
        progressLabel = $(".progress-label");
    progressbar.progressbar({
        value: 5,
        change: function () {
            progressLabel.text(progressbar.progressbar("value") + "%");
        },
        complete: function () {
            progressLabel.text("100%");
            $(".cargaPagina").remove();
        }
    });
    $("head").append("<link href='../imagenes/logoIcono.ico' rel='shortcut icon' type='image/x-icon'>");
    var val = progressbar.progressbar("value") || 0;
    $.unblockUI();
    $(document).on("keydown", function (e) {

        if (e.keyCode == 37) {
            $(this).trigger("avanzarPresentacion");
            diapositivasCargadas -= 1;
            cambiarDiapositiva(false);
        }
        if (e.keyCode == 39) {
            diapositivasCargadas += 1;
            cambiarDiapositiva(true);
        }
    });
});

function verMensajeModuloActual() {
    var dataParam = {
        empresaId: getSession("gestopcompanyid"),
        modulo: {id: getSession("moduloGosstId")}
    };
    callAjaxPost(URL + "/empresa/mensaje", dataParam, function (data) {
        var moduloActual = data.list[0];
        $("#mensajeGosst").html(moduloActual.frase + " <br><br> <strong>" + moduloActual.autor + "</strong>");
    });
}

function funcionTiempoPrueba() {

    tiempoPrueba += 2 * 60 * 1000
    callAjaxPost(URL + '/empresa/delete', {idCompany: 0}, function (data) {

    }, function () {
    }, {}, function () {
        console.log("Log pls")
    });
    setTimeout(funcionTiempoPrueba, tiempoPrueba);
}

function cambiarAcceso() {
    irDirectamenteModulo = !irDirectamenteModulo;
}

function cerrarSesion() {
    var dataParam = {
        userId: sessionStorage.getItem("gestopUi"), sessionId: sessionStorage.getItem("gestopsessionId")
    };

    removeAllSession();

    if(window.location.href.includes("/realplaza")){
        createSession("isAzureClosed",1);
    }

    callAjaxPost(URL + '/login/session/delete', dataParam, null);
}

function irConfiguracion() {
    document.location.href = 'configuracion.html';
}

function irLicencia() {
    document.location.href = 'licencia.html';
}

function cambiarNombreAreaDivisionUnidad() {
    $(".unidadAlternativa").html(getSession("gestopunidad"));
    $(".areaAlternativa").html("División -" + getSession("gestoparea"));
    $(".divisionAlternativa").html(getSession("gestopdivision"));
}

function llamarModulosPermitidosUsuario(functionCallback) {

    callAjaxPost(URL + "/login/menu", {}, function (data) {
        procesarLlamadaModulos(data);

        if (parseInt(getSession("gestopcompanyid")) > 0) {
            cambiarNombreAreaDivisionUnidad();

            var dataParam = {idCompany: parseInt(getSession("gestopcompanyid"))};
            callAjaxPost(URL + '/empresa/id', dataParam, function (data) {
                var companyObj = data.empresa;
                var listModuloInviId = companyObj.modulosInvisibleId; // modulos invisibles
                var listaIdsModulosInvi = listModuloInviId.split(",");

                listaIdsModulosInvi.forEach(function (val) {
                    $("#listaModulo" + val).remove();
                    $("#itemId" + val).remove();
                });
            });
        }

        if (functionCallback != null) {
            functionCallback();
        }
    });

}

function procesarLlamadaModulos(data) {
    listaModulosPermitidos = data.licencia;

    listaModulosPermitidos = listaModulosPermitidos.filter(function (val) {
        return val.menuOpcionId != 25;
    });

    createSession("accesoUsuarios", data.accesoUsuarios);
    createSession("contratistaGosstId", data.contratistaGosstId);
    //createSession("gestopusername",data.gestopusername);
    createSession("trabajadorGosstId", data.trabajadorGosstId);
    createSession("unidadGosstId", data.unidadGosstId);
    createSession("perfilGosstId", data.perfilId);

    var listaModulos = "";

    $("#menuPrincipal li").remove();

    $("#menuPrincipal").append(
        "<li class='dropdown submenu'>" +
        "<a href='#' class='navbar-toggle collapse in' id='moduloSelected'>Mdulos<span class='caret'></span></a>" +
        "<ul class='dropdown-menu submenu' role='menu' id='listaTotalModulos'>");

//     $("#menuPrincipal").append("<label style='color:white;'>versión 8.0.6</label>");

    $("#barraMenu").after(
        "<div id='wrapperList' class='toggled toggled-2'>" +
        "<!-- Sidebar -->" +
        "<div id='sidebar-wrapper'>" +
        "<ul class='sidebar-nav nav-pills nav-stacked' id='menu'></ul>" +
        "</div> " +
        "</div>");

    $("#barraMenu").after(
        "<div id='menuExplicativo' >" +
        "<div id='menuFigureti'  ></div>" +
        "<div id='graficoResumenModulo' class='graficoModulo'>" +
        "<div id='subDivResumen1'></div>" +
        "<div id='subDivResumen2'></div>" +
        "</div>" +
        "</div>"
    );
    $("#subDivResumen1").css({"width": "100%"});
    $("#sidebar-wrapper").css("height", $(window).height() - $("nav").height() - 2 + "px");
    $(".sidebar-nav").css("width", "290px");

    $("#moduloSelected").html(
        "<i class='fa fa-th' style='margin-right:10px'></i>" + getSession("modulo") + "<span class='caret'></span>");

    $("#moduloSelected").on(function (e) {
        e.preventDefault();
        $('#menu ul').hide();
    });

    var opcionResponsive;
    if ($(window).width() < 768) {
        opcionResponsive = 0;
        $("#menuMovilGosst").click(function (e) {
            e.preventDefault();
            irDirectamenteModulo = !irDirectamenteModulo;
            $("#menuExplicativo").toggle().css({"padding-top": $("#barraMenu").css("height")});
            $('#menu ul').hide();
        });

    } else {
        opcionResponsive = 0;
    }

    $("#moduloSelected").click(function (e) {
        e.preventDefault();
        irDirectamenteModulo = !irDirectamenteModulo;
        $("#menuExplicativo").toggle();
        $("#graficoResumenModulo").fadeToggle();
        $('#menu ul').hide();
    });

    $("#graficoResumenModulo").hide();
    $("#wrapperList #menu li").remove();
    $("#menuFigureti div").remove();

    for (var i = 0; i < listaModulosPermitidos.length; i++) {
        var isMovil = (isMobile.any() ? 1 : 0);
        var menuMovil = listaModulosPermitidos[i].menuMovil;
        var menuMovilValido = (isMovil == 0 ? true : (menuMovil == 1));
        if (menuMovilValido) {

            var nombreModulo = listaModulosPermitidos[i].menuOpcionNombre;

            var idModulo = listaModulosPermitidos[i].menuOpcionId;
            var isPermitido = listaModulosPermitidos[i].isPermitido
            var nombreModulo = listaModulosPermitidos[i].menuOpcionNombre;
            var numerSubModulos = listaModulosPermitidos[i].subMenus;
            var icono = listaModulosPermitidos[i].icono;
            var imagenMovil = listaModulosPermitidos[i].imagenUrl;
            imagenMovil = (imagenMovil == null ? 'no_imagen.png' : imagenMovil)
            var iconoSubFlecha = "";
            switch (idModulo) {
                case 4:
                    iconoSubFlecha = '<i class="fa fa-arrow-down" aria-hidden="true"></i>'
                    break;

                case 9:
                    iconoSubFlecha = '<i class="fa fa-arrow-down" aria-hidden="true"></i>'
                    break;
                case 11:
                    iconoSubFlecha = '<i class="fa fa-arrow-down" aria-hidden="true"></i>'
                    break;
                case 15:
                    iconoSubFlecha = '<i class="fa fa-arrow-down" aria-hidden="true"></i>'
                    break;
                default:
                    iconoSubFlecha = ''
                    break;
            }
            var classPermitidoLeft = (isPermitido == 1 ? "fastAccesible" : "fastNoAccesible");
            var classPermitido = (isPermitido == 1 ? "moduloAccesible" : "moduloNoAccesible");
            var iconoFlecha = "<span><i aria-hidden='true' class='fa fa-arrow-right '></i></span>";
            $("#wrapperList #menu").append(
                "<li id='listaModulo" + idModulo + "' class='" + classPermitidoLeft + " '>" +
                "<a href='#' " +
                ">" +
                "<span class='fa-stack fa-lg pull-left '>" +
                "<i aria-hidden='true' class='" + icono + " fa-stack-1x'></i></span>" + nombreModulo + iconoSubFlecha + "" + "" + "</a>" + "" + "</li>");

            var textoDescripcion = "";

            $("#menuFigureti").append("<div class='" + classPermitido + " containerFig col-xs-12 col-ss-12 col-sm-3 col-md-3 col-lg-3' id='itemId" + idModulo + "' title='" + nombreModulo + "'>" +
                "<div class='itemFig' >" +
                "<img src='../imagenes/movil/" + imagenMovil + "'>" +
                "<span class='fa-stack fa-lg' >"
                + ""
                + "  <i class='" + icono + " fa'></i> " + nombreModulo
                + "</span>" +
                "</div>");

            /***Inicio de funcion de items****/
            $("#itemId" + idModulo).on("click", {id: idModulo, isPermitido: isPermitido}, function (ev) {
                var idAux = ev.data.id;
                var hasAccess = ev.data.isPermitido;
                if (hasAccess == 0) {
                    $("#subDivResumen1").html("No tiene acceso a este módulo");
                    console.log("No tiene acceso");
                    $("#btnIrModulo").remove();
                    return false;
                }
                moduloSeleccionadoMenu = idAux;
                $("#textoDescrip").remove();
                $("#btnVolverModulos").remove();
                $("#btnIrModulo").remove();
                $(".containerFig").children().removeClass("itemNoFig").addClass("itemFig");

                if ($(".subItem" + idAux).length > 0) {
                    $(".containerFig").hide();
                    $(".tooltip").hide();
                    if ($(".subItem" + idAux).length == 1 && (idAux == 9
                        || idAux == 11
                        || idAux == 15)) {
                        var idLinkAux = moduloSeleccionadoMenu;
                        irHacia(idLinkAux, sessionStorage.getItem("unidadGosstId"), sessionStorage.getItem("unidadGosstNombre"));
                    } else {
                        $(this).after("<div id='btnVolverModulos' title='Volver' class='subContainerFig col-xs-12 col-ss-12 col-sm-3 col-md-3 col-lg-3'>" +

                            "<div class='subItemFig'>"
                            + "  <i class='" + "fa fa-arrow-circle-left" + "  '></i>"
                            + "</div>" +
                            "</div>");
                        $(".subItem" + idAux).show();
                        $(".subContainerFig").children().removeClass("itemNoFig").addClass("subItemFig");

                    }
                    verGraficoResumen(moduloSeleccionadoMenu);
                } else {


                    $(this).children().removeClass("itemFig").addClass("itemNoFig");
                    //verGraficoResumen(moduloSeleccionadoMenu);
                    var btnIrModulo = "<div id='btnIrModulo' class='containerFig col-xs-12 col-ss-12  col-sm-3 col-md-3 col-lg-3'>" +
                        " <div class='itemFig'> "
                        + "  <i class='" + "fa fa-arrow-circle-right" + " '></i>"

                        + " </div>" +

                        "</div>";
                    irHacia(parseInt(moduloSeleccionadoMenu), null);
                }

                $("#subDivResumen1").append("<div id='textoDescrip'>" +
                    textoDescripcion + "" +
                    "" +
                    "</div>"
                );


            });
            $(document).on("click", "#btnVolverModulos", function () {
                var idAux = $(this).prop("id").split("btnVolverModulos");
                $("#btnIrModulo").remove();
                $(".containerFig").show();
                $(".subContainerFig").hide();
                $(this).remove();
                $("#textoDescrip").remove();
                $("#btnVolverModulos").remove();
            });
            /****Fin de funcion item*****/
            if (numerSubModulos.length > 0) {
                $("#listaModulo" + idModulo).append(
                    "<ul class='nav-pills nav-stacked' style='list-style-type:none;margin-left:20px'>");
                for (var i2 = 0; i2 < numerSubModulos.length; i2++) {
                    var idSubModulo = numerSubModulos[i2].menuOpcionId;
                    var nombreSubModulo = numerSubModulos[i2].menuOpcionNombre;
                    var subIcono = numerSubModulos[i2].icono;
                    var isPermitidoSub = numerSubModulos[i2].isPermitido;
                    var classPermitidoLeft = (isPermitidoSub == 1 ? "fastAccesible" : "fastNoAccesible");
                    var classPermitido = (isPermitidoSub == 1 ? "moduloAccesible" : "moduloNoAccesible");
                    var imagenMovil2 = numerSubModulos[i2].imagenUrl;
                    imagenMovil2 = (imagenMovil2 == null ? 'no_imagen.png' : imagenMovil2)
                    $("#listaModulo" + idModulo + " ul").append(
                        "<li id='listaModulo" + idSubModulo + "' class='" + classPermitidoLeft + "'>" +
                        "<a href='#' " +
                        "'>" +
                        "<span class='fa-stack fa-lg pull-left'><i aria-hidden='true' class='" + subIcono + " fa-stack-1x '></i>" +
                        "</span>" + nombreSubModulo + "</a></li>"
                    );
                    $("#listaModulo" + idModulo).append("</ul>");
                    $("#menuFigureti").append("<div class='" + classPermitido + " subContainerFig col-xs-12 col-ss-12 col-sm-3 col-md-3 col-lg-3 subItem" + idModulo + "' title='" + nombreSubModulo + "' id='itemId" + idSubModulo + "' style='display:none'>" +
                        "<div class='subItemFig' >" +
                        "<img src='../imagenes/movil/" + imagenMovil2 + "'>" +
                        "	<span class='fa-stack fa-lg'>"
                        + "  <i class='" + subIcono + "  '></i>" + nombreSubModulo
                        + "</span><br> " +
                        "</div>");


                    /***Inicio de funcion de items****/
                    $("#itemId" + idSubModulo).on("click", {
                        id: idSubModulo,
                        isPermitido: isPermitidoSub
                    }, function (ev) {
                        var idAux = ev.data.id;
                        var hasAccess = ev.data.isPermitido;
                        if (hasAccess == 0) {
                            $("#subDivResumen1").html("No tiene acceso a este módulo");
                            console.log("No tiene acceso");
                            $("#btnIrModulo").remove();
                            return false;
                        }
                        moduloSeleccionadoMenu = idAux;
                        $("#textoDescrip").remove();
                        $("#btnIrModulo").remove();
                        $(".subContainerFig").children().removeClass("itemNoFig").addClass("subItemFig");


                        $(this).children().removeClass("subItemFig").addClass("itemNoFig");
                        verGraficoResumen(moduloSeleccionadoMenu);
                        var btnIrModulo = "<div id='btnIrModulo' class='containerFig col-xs-12 col-ss-12  col-sm-3 col-md-3 col-lg-3'>" +
                            "<div id='subItemFig'><span class='fa-stack fa-lg'  >"
                            + "  <i class='" + "fa fa-arrow-circle-right" + "  '></i>"

                            + "</div>" +
                            "</div>";
                        irHacia(parseInt(moduloSeleccionadoMenu), null);
                        //$("#menuFigureti").append(btnIrModulo);
                        //$("#btnIrModulo").on("click",function(){
                        //	 irHacia(parseInt(moduloSeleccionadoMenu),null);
                        //});


                        $("#subDivResumen1").append("<div id='textoDescrip'>" +
                            textoDescripcion + "" +
                            "" +
                            "</div>"
                        );


                    });
                }
                ;

            }
        }
    }
    ;

    crearSubMenu(9);
    crearSubMenu(11);
    crearSubMenu(15);

    if (getSession("submodulo")) {
        $("#moduloSelected span").remove();

        var nombreModuloAux = " - " + getSession("submodulo");

        $("#moduloSelected").append((nombreModuloAux.length >= 27 ? nombreModuloAux.substring(0, 27) + "..." :
            nombreModuloAux) + " <span class='caret'></span>");
    }

    initMenu();

    $(document).on({
        mouseenter: function () {
            $("#sidebar-wrapper").hide();
        },
        mouseleave: function () {
            $("#sidebar-wrapper").show();
        }
    }, "#btnNuevo");

    if (getSession("gestopInicio") == 0) {
        createSession("gestopInicio", 1);
        $("#menuMovilGosst").click();
    }
}

function initMenu() {
    cambiarNombreAreaDivisionUnidad();
    $('#menu ul').hide();
    $('#menu ul').children('.current').parent().show();
    //$('#menu ul:first').show();

    $('#menu li a').on("click", function () {
            var checkElement = $(this).next();
            if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                checkElement.slideUp('normal');
                return false;
            }
            if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
                $('#menu ul:visible').slideUp('normal');
                checkElement.slideDown('normal');
                return false;
            }
        }
    );
    $('#menu li a').on("click", function () {
        var aux = $(this).parent().prop("id").split("listaModulo");
        switch (parseInt(aux[1])) {
            case 15:
            case 9:
            case 11:
                break;
            default:
                verGraficoResumen(aux[1], null)
        }
        //
    });
}

function insertMenuPrimeraVez(functionCallback) {
    $("#barraMenu").html(CABECERA);

    var dataParam = {};

    callAjaxPost(URL + '/empresa/usuario', dataParam, function (data) {
        switch (data.CODE_RESPONSE) {
            case "05":
                createSession("gestopusername", data.usuarioActual.userName);
                createSession("gestopusuarioid", data.usuarioActual.usuarioId);

                if (getSession("moduloGosstId") == null) {
                    createSession("moduloGosstId", data.usuarioActual.moduloId);
                }

                $("#loginUser").html(
                    "<i style='margin-right:10px;font-size:17px' class='fa fa-user-circle'></i> " +
                    getSession("gestopusername") + "<span class='caret'></span>");

                listEmpresasSelect = data.list;
                listAyuda = data.listAyuda;

                listEmpresasSelect.forEach(function (val) {
                    $("#menuEmpresa").append(
                        "<li>" +
                        "<a href='#' onclick='javascript:seleccionaEmpresa(" + val.idCompany + ");'>" +
                        "<i class='fa fa-building-o' aria-hidden='true'></i> " + val.name.substring(0, 12) +
                        "</a>" +
                        "</li>");
                });
                //
                if (getSession("gestopcompanyid") == null || getSession("gestopcompanyid") == -1) {
                    if (listEmpresasSelect.length > 0) {
                        createSession("gestoparea", listEmpresasSelect[0].nombreArea);
                        createSession("gestopdivision", listEmpresasSelect[0].nombreDivision);
                        createSession("gestopunidad", listEmpresasSelect[0].nombreUnidad);
                        createSession("gestopcompanyid", listEmpresasSelect[0].idCompany);
                        createSession("gestopcompanyname", listEmpresasSelect[0].name);
                        createSession("gestopcompanyruc", listEmpresasSelect[0].ruc);
                        createSession("isProyectoSimple", listEmpresasSelect[0].isProyectoSimple);
                    } else {
                        createSession("gestopcompanyid", -1);
                        $("#companySelected").html("¡No existen empresas!");
                    }
                }

                cambiarConfiguracionEmpresa();
                verMensajeModuloActual();
                llamarModulosPermitidosUsuario(functionCallback);

                break;

            default:
                alert("Ocurrió un error al traer las empresas!");

                break;

        }
    }, null, {}, null, function () {
    });

    resizeDivi();
}

function insertMenu(functionCallback) {
    $("#barraMenu").html(CABECERA);
    cargarEmpresasxUsuario(functionCallback);
    resizeDivi();
    cambiarConfiguracionEmpresa();
    verMensajeModuloActual();
}

function cargarEmpresasxUsuario(functionCallback) {
    var dataParam = {};
    callAjaxPost(URL + '/empresa/usuario', dataParam, function (data) {
        switch (data.CODE_RESPONSE) {
            case "05":
                $("#loginUser").html("<i style='margin-right: 10px ;font-size: 17px;' " +
                    "class='fa fa-user-circle'></i>" +
                    getSession("gestopusername")
                    + "<span class='caret'></span>");
                var list = data.list;
                listEmpresasSelect = list;

                for (index = 0; index < list.length; index++) {
                    $("#menuEmpresa").append(
                        "<li><a href='#' onclick='javascript:seleccionaEmpresa("
                        + list[index].idCompany + " );'>" +
                        "<i class='fa fa-building-o' aria-hidden='true'></i>" + list[index].name.substring(0, 12)
                        + "</a></li>");
                }
                if (sessionStorage.getItem("gestopcompanyid") == null
                    || sessionStorage.getItem("gestopcompanyid") == -1) {
                    if (list.length > 0) {
                        createSession("gestopcompanyid", list[0].idCompany);
                        createSession("gestopcompanyname", list[0].name);
                        createSession("gestopcompanyruc", list[0].ruc);
                        $("#companySelected").html("<i class='fa fa-building-o' style='margin-right: 10px'></i> <strong>Empresa: </strong>  " + list[0].name.substring(0, 12));
                    } else {
                        createSession("gestopcompanyid", -1);
                        $("#companySelected").html("¡No existen empresas!");
                    }

                } else {
                    $("#companySelected").html("<i class='fa fa-building' style='margin-right: 10px'></i> <strong>Empresa :</strong>  " +
                        sessionStorage.getItem("gestopcompanyname").substring(0, 12)
                        + " <span class='caret'></span>");
                }
                llamarModulosPermitidosUsuario(functionCallback)

                break;
            default:
                alert("Ocurrió un error al traer las empresas!");
        }
    });
}

function procesarMenu(data) {


}

function callAjaxPostNoUnlock(pUrl, dataParam, funcionRespuesta, funcionBefore, dataBefore, functionError) {

    $.ajax({
        url: pUrl,
        type: 'post',
        async: true,
//		crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify(dataParam),
        contentType: "application/json",
        beforeSend:
            function () {
                if (funcionBefore == null) {
                    $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img>Cargando...'});

                } else {
                    funcionBefore(dataBefore);
                }
                ;


            },
        success: function (data, textStatus, jqXHR) {


            switch (data.CODE_RESPONSE) {
                case "06":
                    sessionStorage.clear();
                    document.location.replace(data.PATH);
                    break;
                case "07":
                    //sessionStorage.clear();
                    alert("Sesion expirada");
                    document.location.replace(data.PATH);
                    break;
                default:
                    funcionRespuesta(data);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();

            console.log("Ruta de error:" + pUrl);
            if (functionError != null) {
                functionError();
            }
            var responseText = jQuery.parseJSON(jqXHR.responseText);
            if (responseText.CODE_RESPONSE == "07") {
                alert("Sesión Expiradaa");
                document.location.href = (responseText.PATH);
            }
            if (responseText.CODE_RESPONSE == "09") {
                alert("No tiene acceso al módulo");
            }

            //document.location.replace(responseText.PATH);
        }
    });

}

var gosstError = false;

function callAjaxPost(pUrl, dataParam, funcionRespuesta, funcionBefore, dataBefore,
                      functionError, functionComplete, autoUnblock) {
    var dataResponseServer = [];

    autoUnblock = defaultFor(autoUnblock, true);

    $.ajax({
        url: pUrl, type: 'post', async: true,//crossDomain: true,
        xhrFields: {withCredentials: true}, data: JSON.stringify(dataParam), contentType: "application/json",
        beforeSend: function () {
            if (funcionBefore == null) {
                $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
            } else {
                funcionBefore(dataBefore);
            }
            ;
        },
        success: function (data, textStatus, jqXHR) {
            switch (data.CODE_RESPONSE) {
                case "06":
                    sessionStorage.clear();
                    document.location.replace(data.PATH);

                    break;

                case "07":
                    //sessionStorage.clear();
                    alert("Sesion expirada");
                    document.location.replace(data.PATH);

                    break;

                case "09":
                    alert("Sin acceso al módulo");

                    break;

                default:
                    if (autoUnblock) {
                        $.unblockUI();
                        funcionRespuesta(data);
                    } else {
                        funcionRespuesta(data);
                    }

                    break;
            }
        },
        complete: function (data) {
            if (functionComplete == null) {

            } else {
                functionComplete();
            }
        },
        error: function(jqXHR,textStatus,errorThrown){
            $.unblockUI();
            console.log("Ruta de error: "+pUrl);
            
            if(gosstError){
                return;
            }

            gosstError = true;
            
            try{
                var responseText = jQuery.parseJSON(jqXHR.responseText);

                if(responseText.CODE_RESPONSE == "12"){
                    alert("Sesión Expirada. Debe loguearse de nuevo.");
                    document.location.href = responseText.PATH;
                }else if (responseText.CODE_RESPONSE == "09"){
                    console.info('Debe autenticarse.');
                    document.location.href = responseText.PATH;
                }else if (responseText.CODE_RESPONSE == "21"){
                    // P115: la sesion espera el codigo de verificacion; se vuelve al login.
                    alert("Para continuar, ingrese el código de verificación que se envió a su correo.");
                    document.location.href = responseText.PATH;
                }else{
         	   alert("Ocurrió un problema al procesar la respuesta del servidor." +
         	       "\n\nSi ello persiste, por favor, repórtelo al soporte de la plataforma GOSST.");
         	   
         	   gosstError = false;
                }
            }catch(e){
                // Si ocurre un error inesperado al analizar la respuesta
                alert("Error al procesar la respuesta del servidor.");
                console.error("Error al parsear el JSON de respuesta",e);
                
                gosstError = false;
            }
        }
//        error: function (jqXHR, textStatus, errorThrown) {
//            $.unblockUI();
//            console.log("Ruta de error: " + pUrl);
//            if (!gosstError) {
//                gosstError = true;
//                var responseText = jQuery.parseJSON(jqXHR.responseText);
//
//                if (responseText.CODE_RESPONSE == "12") {
//                    alert("Sesión Expirada, loguearse de nuevo");
//                    document.location.href = (responseText.PATH);
//                }
//
//                if (responseText.CODE_RESPONSE == "09") {
//                    //alert("No tiene acceso al módulo");
//                    console.info('Debe autenticarse.');
//                    document.location.href = (responseText.PATH);
//                }
//            }
//        }
    });
}

// funcion para cargarlo como promesa
function callAjaxPostAsPromise(url, dataParam) {
    return new Promise((resolve, reject) => {
        callAjaxPost(url, dataParam,
            function (data) { // Función de éxito
                if (data.CODE_RESPONSE === "05") {
                    resolve(data); // Resuelve la promesa con los datos
                } else {
                    reject("Error al cargar."); // Rechaza la promesa
                }
            },
            null, // funcionBefore (puedes pasar la función o null si no la necesitas)
            null, // dataBefore (datos para funcionBefore, si es necesario)
            function (error) { // Función de error
                reject(error); // Rechaza la promesa con el error
            }
        );
    });
}

function loadingCelda(idFila) {
    var celdaPadre = $("#" + idFila + ":first");
    var numCol = celdaPadre.children().length;
    celdaPadre.html("<td style='background-color:#9BBB59' colspan='" + numCol + "'>Guardando</td>");

}

var enviando = false;

function callAjaxPostGraficoMenu(pUrl, dataParam, funcionRespuesta, isParalelo) {

    $.ajax({
        url: pUrl,
        type: 'post',
        async: true,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify(dataParam),
        contentType: "application/json",
        beforeSend: function () {
            if (!enviando || isParalelo) {
                $('#subDivResumen3').html('<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>' +
                    '<span class="sr-only">Loading...</span>');
                enviando = true;
            } else {
                return false;
            }
            ;

        },
        success: function (data, textStatus, jqXHR) {


            switch (data.CODE_RESPONSE) {
                case "06":
                    sessionStorage.clear();
                    document.location.replace(data.PATH);
                    break;
                case "07":
                    //sessionStorage.clear();
                    alert("Sesion expirada");
                    document.location.replace(data.PATH);
                case "09":
                    alert("Sin acceso al módulo")
                    break;
                default:
                    funcionRespuesta(data);
                    enviando = false;
                    $.unblockUI();
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("Ups, tenemos problemas tecnicos. Intente más tarde. Error: "
                + errorThrown);

        }
    });
}

function callAjaxPostNoLoad(pUrl, dataParam, funcionRespuesta, funcionBefore, dataBefore) {

    $.ajax({
        url: pUrl,
        type: 'post',
        async: true,
        xhrFields: {
            withCredentials: true
        },
        beforeSend:
            function () {
                if (funcionBefore == null) {
                    //$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});

                } else {
                    funcionBefore(dataBefore);
                }
                ;


            },
        data: JSON.stringify(dataParam),
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {


            switch (data.CODE_RESPONSE) {
                case "06":
                    sessionStorage.clear();
                    document.location.replace(data.PATH);
                    break;
                case "07":
                    //sessionStorage.clear();
                    alert("Sesion expirada");
                    document.location.replace(data.PATH);
                case "09":
                    alert("Sin acceso al módulo")
                    break;
                default:
                    funcionRespuesta(data);
                    $.unblockUI();
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {


            var responseText = (jqXHR);
            if (responseText.CODE_RESPONSE == "12") {
                alert("Sesión Expirada, loguearse de nuevo");
                document.location.href = (responseText.PATH);
            }
            if (responseText.CODE_RESPONSE == "07") {
                alert("No tiene permiso!!!");
            }

        }
    });

}

function callAjaxPostTypeSync(pUrl, dataParam, funcionRespuesta) {
    $.ajax({
        url: pUrl,
        type: 'post',
        async: false,
        data: JSON.stringify(dataParam),
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            switch (data.CODE_RESPONSE) {
                case "06":
                    sessionStorage.clear();
                    document.location.replace(data.PATH);
                    break;
                default:
                    funcionRespuesta(data);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Ups, tenemos problemas tecnicos. Intente más tarde. Error: "
                + errorThrown);
            console.log('xhRequest: ' + jqXHR + "\n");
            console.log('ErrorText: ' + textStatus + "\n");
            console.log('thrownError: ' + errorThrown + "\n");
        }
    });
}

function callAjaxGetUrl(pUrl, funcionRespuesta) {
    $.ajax({
        url: pUrl,
        type: 'get',
        async: false,
        xhrFields: {
            withCredentials: true
        },
        contentType: "application/json",
        success: function (data) {
            switch (data.CODE_RESPONSE) {
                case "06":
                    sessionStorage.clear();
                    document.location.replace(data.PATH);
                    break;
                default:
                    // Llamar a la función de respuesta con el JSON recibido
                    funcionRespuesta(data);
                    break;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert("Ups, tenemos problemas técnicos. Intente más tarde. Error: " + errorThrown);
            // console.log('xhRequest: ' + jqXHR + "\n");
            // Acceder al código de estado HTTP
            console.log("Código de estado HTTP: " + jqXHR.status);
            // Acceder a la respuesta del servidor
            console.log("Respuesta del servidor: ", jqXHR.responseText);
            // Acceder a los encabezados de la respuesta
            // console.log("Encabezados de la respuesta: ", jqXHR.getAllResponseHeaders());
            // Manejar el estado de la solicitud
            // console.log('ErrorText: ' + textStatus + "\n");
            // Manejar el error de la solicitud
            // console.log('thrownError: ' + errorThrown + "\n");
            $.unblockUI();
        }
    });
}

function habilitarBotonesEdicion() {
    $("#btnGuardar").show();
    $("#btnCancelar").show();
    $("#btnEliminar").show();
    $("#btnNuevo").hide();
}

function deshabilitarBotonesEdicion() {
    $("#btnGuardar").hide();
    $("#btnCancelar").hide();
    $("#btnEliminar").hide();
    $("#btnNuevo").show();
}

function habilitarBotonesNuevo() {
    $("#btnGuardar").show();
    $("#btnCancelar").show();
    $("#btnNuevo").hide();
}

function habilitarBotonesSubConsulta() {
    $("#btnGuardar").hide();
    $("#btnCancelar").hide();
    $("#btnEliminar").hide();
    $("#btnCancelar").show();
    $("#btnNuevo").show();
}

function IsNumeric(e) {
    var keyCode = e.which ? e.which : e.keyCode;

    var ret = ((keyCode == 37) || (keyCode == 39) ||
        (keyCode >= 96 && keyCode <= 105) || (keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
    // document.getElementById("error").style.display = ret ? "none" : "inline";
    return ret;
}

function IsNumericRestriccion(e) {
    var keyCode = e.which ? e.which : e.keyCode;
    var maxNum = 13;
    if (e.srcElement.value.length > maxNum) {
        e.srcElement.value = e.srcElement.value.substr(0, maxNum);
        alert("Ingresar RUC de " + maxNum + " dígitos");
        return false;
    }
}

function seleccionaEmpresa(idCompany) {
    createSession("gestopcompanyid", idCompany);

    var empresaObj = {};

    listEmpresasSelect.forEach(function (val) {
        if (val.idCompany == idCompany) {
            empresaObj = val;
        }
    });

    var nombreArea = empresaObj.nombreArea;
    var nombreDivision = empresaObj.nombreDivision;
    var nombreUnidad = empresaObj.nombreUnidad;

    createSession("gestoparea", nombreArea);
    createSession("gestopdivision", nombreDivision);
    createSession("gestopunidad", nombreUnidad);
    createSession("habilitarValidacion", empresaObj.habilitarValidacion);

    if (sessionStorage.getItem("submodulo") == null) {
        location.reload();
    } else {
        document.location.replace("main.html");
        sessionStorage.removeItem("submodulo");
        sessionStorage.removeItem("modulo");
    }
}

function createSession(key, token) {
    sessionStorage.setItem(key, token);
}

function getSession(key) {
    var asd = sessionStorage.getItem(key);


    return asd;

}

function removeAllSession() {
    sessionStorage.clear();
}

function cargarDatosVarios() {
    var dataParam = {
        userId: sessionStorage.getItem("gestopUi"),
        sessionId: sessionStorage.getItem("gestopsessionId")
    };

    callAjaxPost(URL + '/iperc/listvarios', dataParam, procesarDatosVarios);
}

function procesarDatosVarios(data) {

    switch (data.CODE_RESPONSE) {
        case "05":
            var clasifs = data.listaClasificaciones;
            var pels = data.mapPeligros;
            var riesgos = data.mapRiesgos;

            createSession("clasifs", JSON.stringify(clasifs));
            createSession("peligros", JSON.stringify(pels));
            createSession("riesgos", JSON.stringify(riesgos));

            break;
        default:
            alert("Ocurrió un error al traer las empresas!");
    }

}

function crearSelectOneMenuImagen(idSel, methodJs, listOption, idSelected, value,
                                  nameValue, selectedValue, nameOption) {
    var nameDefault = nameOption == null ? "Escoja una opci&oacute;n" : nameOption;
    var selectOneBox = "<select id='" + idSel + "'  "
        + "><option value='-1'>" + nameDefault
        + "</option>";
    if (listOption) {
        for (index = 0; index < listOption.length; index++) {
            var dataclass = "";
            if (listOption[index][selectedValue] > 0) {
                dataclass = "data-class='marcaCheck'";
            }

            selectOneBox = selectOneBox + "<option  " + dataclass + " value='"
                + listOption[index][value] + "' ";
            if (idSelected == listOption[index][value]) {
                selectOneBox = selectOneBox + "selected>"
                    + listOption[index][nameValue] + "</option>";
            } else {
                selectOneBox = selectOneBox + ">"
                    + listOption[index][nameValue] + "</option>";
            }
        }
    }

    selectOneBox = selectOneBox + "</select>";
    return selectOneBox;
}

function crearSelectOneMenuMovil(idSel, methodJs, listOption, idSelected,
                                 nameOption, value, nameValue, value2, opcionId) {
    var nameDefault = nameOption == null ? "Escoja una opci&oacute;n" : nameOption;

    var divOneBox = "<div class='listOpcionFiltroGosst' id='" + idSel + "' onclick='" + methodJs + "'>" +
        "<div class='tituloFiltro'>" + nameDefault + " (Todos) </div>";
    if (listOption) {
        for (index = 0; index < listOption.length; index++) {
            var add = "";
            if (value2) {
                add = "-" + listOption[index][value2]
            }
            divOneBox = divOneBox + "<div class='opcionFiltroGosst' id='divOpcion"
                + listOption[index][value] + "" + add + "' >"
                + "<div class='checkbox checkbox-filtro checkbox-inline'>"
                + "<input id='" + opcionId
                + listOption[index][value] + "" + add + "' type='checkbox' checked>"
                + "<label for='" + opcionId
                + listOption[index][value] + "" + add + "'> "
                + listOption[index][nameValue]
                + "   </label>"
                + " </div>"
                + "</div>";

        }
    }
    divOneBox = divOneBox + "</div>";
    return divOneBox;
}

function crearSelectOneMenu(idSel, methodJs, listOption, idSelected, value, nameValue, nameOption) {

    var nameDefault = nameOption == null ? "Escoja una opci&oacute;n" : nameOption;

    var selectOneBox =
        "<select id='" + idSel + "' class='form-control' onchange='" + methodJs + "'>" +
        "<option value='-1'>" + nameDefault + "</option>";

    if (listOption) {
        for (index = 0; index < listOption.length; index++) {
            selectOneBox = selectOneBox +
                "<option value='" + listOption[index][value] + "' ";

            if (idSelected == listOption[index][value]) {
                selectOneBox = selectOneBox + "selected>" + listOption[index][nameValue] + "</option>";
            } else {
                selectOneBox = selectOneBox + ">" + listOption[index][nameValue] + "</option>";
            }
        }
    }

    selectOneBox = selectOneBox + "</select>";

    return selectOneBox;
}

//DEPRECAR ESTE MÉTODO
function crearSelectOneMenuY(idSel, methodJs, listOption, idSelected, value, value2,
                             nameValue, nameOption) {
    var nameDefault = nameOption == null ? "Escoja una opci&oacute;n" : nameOption;
    var selectOneBox = "<select id='" + idSel + "' class='form-control' "
        + "onchange='" + methodJs + "'><option value='-1'>" + nameDefault
        + "</option>";
    if (listOption) {
        for (index = 0; index < listOption.length; index++) {
            selectOneBox = selectOneBox + "<option value='"
                + listOption[index][value] + "-" + listOption[index][value2] + "' ";
            var nuevo = idSelected;
            if (nuevo == listOption[index][value]) {
                selectOneBox = selectOneBox + "selected>"
                    + listOption[index][nameValue] + "</option>";
            } else {
                selectOneBox = selectOneBox + ">"
                    + listOption[index][nameValue] + "</option>";
            }
        }
    }

    selectOneBox = selectOneBox + "</select>";
    return selectOneBox;
}

function crearSelectOneMenuOblig(idSel, methodJs, listOption, idSelected, value,
                                 nameValue) {

    var selectOneBox = "<select id='" + idSel + "' class='form-control' "
        + "onchange='" + methodJs + "'>";
    if (listOption) {
        for (index = 0; index < listOption.length; index++) {
            selectOneBox = selectOneBox + "<option value='"
                + listOption[index][value] + "' ";
            if (idSelected == listOption[index][value]) {
                selectOneBox = selectOneBox + "selected>"
                    + listOption[index][nameValue] + "</option>";
            } else {
                selectOneBox = selectOneBox + ">"
                    + listOption[index][nameValue] + "</option>";
            }
        }
    }
    selectOneBox = selectOneBox + "</select>";
    return selectOneBox;
}

function crearSelectOneMenuObligMultiple(idSel, methodJs, listOption, value,
                                         nameValue) {
    var selectOneBox = "<select data-placeholder='Seleccione módulos' multiple id='" + idSel + "' class='form-control' "
        + "onchange='" + methodJs + "'>";
    if (listOption) {
        for (var index = 0; index < listOption.length; index++) {
            selectOneBox = selectOneBox + "<option value='"
                + listOption[index][value] + "' ";

            if (listOption[index]["selected"] == 1) {
                selectOneBox = selectOneBox + "selected>"
                    + listOption[index][nameValue] + "</option>";
            } else {
                selectOneBox = selectOneBox + ">"
                    + listOption[index][nameValue] + "</option>";
            }


        }
    }
    selectOneBox = selectOneBox + "</select>";
    return selectOneBox;
}

function crearSelectOneMenuObligMultipleCompleto(idSel, methodJs, listOption, value,
                                                 nameValue, htmlContain, holderText, maxSelects) {
    var selectOneBox = "<select data-placeholder='" + holderText + "' multiple id='" + idSel + "' class='form-control' "
        + "onchange='" + methodJs + "'>";
    if (listOption) {
        for (var index = 0; index < listOption.length; index++) {
            selectOneBox = selectOneBox + "<option value='"
                + listOption[index][value] + "' ";

            if (listOption[index]["selected"] == 1) {
                selectOneBox = selectOneBox + "selected>"
                    + listOption[index][nameValue] + "</option>";
            } else {
                selectOneBox = selectOneBox + ">"
                    + listOption[index][nameValue] + "</option>";
            }


        }
    }
    selectOneBox = selectOneBox + "</select>";
    $("" + htmlContain).html("" + selectOneBox);
    maxSelects = defaultFor(maxSelects, 100000);
    $("#" + idSel).chosen({
        max_selected_options: maxSelects,
        no_results_text: "No  se encontró"
    });
    $("#" + idSel).bind("chosen:maxselected", function () {
        alert("Límite alcanzado")
    });

}

function crearSelectOneMenuObligUnitarioCompleto(idSel, methodJs, listOption, value,
                                                 nameValue, htmlContain, holderText, maxSelects) {
    var selectOneBox = "<select data-placeholder='" + holderText + "' id='" + idSel + "' class='form-control' "
        + "onchange='" + methodJs + "'>";
    if (listOption) {
        for (var index = 0; index < listOption.length; index++) {
            selectOneBox = selectOneBox + "<option value='"
                + listOption[index][value] + "' ";

            if (listOption[index]["selected"] == 1) {
                selectOneBox = selectOneBox + "selected>"
                    + listOption[index][nameValue] + "</option>";
            } else {
                selectOneBox = selectOneBox + ">"
                    + listOption[index][nameValue] + "</option>";
            }


        }
    }
    selectOneBox = selectOneBox + "</select>";
    $("" + htmlContain).html("" + selectOneBox);
    maxSelects = defaultFor(maxSelects, 100000);
    $("#" + idSel).chosen({
        max_selected_options: maxSelects,
        no_results_text: "No  se encontró"
    });
    $("#" + idSel).bind("chosen:maxselected", function () {
        alert("Límite alcanzado")
    });

}

function crearSelectOneMenuNoObligUnitarioCompleto(idSel, methodJs, listOption, value,
                                                   nameValue, htmlContain, holderText, maxSelects) {
    var selectOneBox = "<select data-placeholder='" + holderText + "' id='" + idSel + "' class='form-control' "
        + "onchange='" + methodJs + "'>" +
        "<option value='-1' selected> Sin escoger </option>  " +
        "";
    if (listOption) {

        listOption.forEach(function (val) {
            selectOneBox = selectOneBox + "<option value='"
                + val[value] + "' ";

            if (val["selected"] == 1) {
                selectOneBox = selectOneBox + "selected>"
                    + val[nameValue] + "</option>";
            } else {
                selectOneBox = selectOneBox + ">"
                    + val[nameValue] + "</option>";
            }
        });
    }
    selectOneBox = selectOneBox + "</select>";
    $("" + htmlContain).html("" + selectOneBox);
    maxSelects = defaultFor(maxSelects, 100000);
    $("#" + idSel).chosen({
        max_selected_options: maxSelects,
        no_results_text: "No  se encontró"
    });
    $("#" + idSel).bind("chosen:maxselected", function () {
        alert("Límite alcanzado")
    });

}

function crearSelectOneMenuObligGrupoCompleto(idSel, methodJs, listOption, htmlContain, holderText) {
    var selectOneBox = "<select data-placeholder='" + holderText + "' id='" + idSel + "' class='form-control' "
        + "onchange='" + methodJs + "'>";
    if (listOption) {
        listOption.forEach(function (val, index) {
            selectOneBox += "<optgroup  label='"
                + val.nombre + "' >";
            val.subtipos.forEach(function (val1, index1) {
                var textSelect = "selected";
                if (val1.selected == 1) {

                } else {
                    textSelect = "";
                }
                selectOneBox += "<option value='" + val1.id + "'  " + textSelect + ">" + val1.nombre + "</option>";
            });
            selectOneBox += "</ optgroup>";
        });

    }
    selectOneBox = selectOneBox + "</select>";
    $("" + htmlContain).html("" + selectOneBox)
    $("#" + idSel).chosen({
        max_selected_options: 100000,
        no_results_text: "No  se encontró"
    });

}

function crearSelectMultipleGrupoCompleto(idSel, methodJs, listOption, htmlContain, holderText) {
    var selectOneBox =
        "<select multiple data-placeholder='" + holderText + "' id='" + idSel + "' class='form-control' onchange='" + methodJs + "'>";

    if (listOption) {
        listOption.forEach(function (val, index) {
            selectOneBox += "<optgroup label='" + val.nombre + "'>";
            val.subtipos.forEach(function (val1, index1) {
                var textSelect = (val1.selected == 1 ? "selected" : "");

                selectOneBox += "<option value='" + val1.id + "' " + textSelect + ">" + val1.nombre + "</option>";
            });

            selectOneBox += "</ optgroup>";
        });
    }

    selectOneBox = selectOneBox + "</select>";

    $("" + htmlContain).html("" + selectOneBox);

    $("#" + idSel).chosen({
        max_selected_options: 100000,
        no_results_text: "No se encontró"
    });
}

function asignarValorLista(listOption, idSelected, value, nameValue) {

    var optionSelected = "";
    if (listOption) {
        for (index = 0; index < listOption.length; index++) {

            if (idSelected == listOption[index][value]) {
                optionSelected = listOption[index][nameValue];
            }
        }
    }


    return optionSelected;
}

function listarStringsDesdeArray(lista, atributo) {
    var arrayString = [];
    if (lista) {
        for (index = 0; index < lista.length; index++) {
            arrayString.push(lista[index][atributo]);
            lista[index].filtroActivado = true;
        }
    }
    return arrayString;
}

function listarStringsDesdeArrayY(lista, atributo, restriccion, restriccionId) {
    var arrayString = [];
    if (lista) {
        for (index = 0; index < lista.length; index++) {
            if (lista[index][restriccion] == restriccionId) {
                arrayString.push(lista[index][atributo]);
            }
        }

    }
    return arrayString;
}

function irHacia(indicadorPagina, opcional1, opcional2) {
    createSession("moduloGosstId", indicadorPagina);

    switch (indicadorPagina) {
        case 1:
            createSession("ayudaId", 1);
            createSession("modulo", "Empresa");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'empresa.html';

            break;

        case 2:
            createSession("ayudaId", 2);
            createSession("modulo", "Despliegue Organizacional");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'mdf.html';

            break;

        case 3:
            createSession("ayudaId", 3);
            createSession("modulo", "IPERC");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'iperc.html';

            break;

        case 4:

            break;

        case 5:
            createSession("ayudaId", 4);
            createSession("modulo", "Recursos");
            createSession("submodulo", "Formaciones");
            $("#moduloSelected").html("Recursos - " + getSession("submodulo"));
            document.location.href = 'capacitacion.html';

            break;

        case 6:
            createSession("modulo", "Recursos");
            createSession("submodulo", "Ex&aacute;menes M&eacute;dicos");
            document.location.href = 'examenmedico.html';
            $("#moduloSelected").html("Recursos - " + getSession("submodulo"));
            createSession("ayudaId", 5);

            break;

        case 7:
            createSession("ayudaId", 6);
            createSession("modulo", "Recursos");
            createSession("submodulo", "Equipos de Seguridad");
            $("#moduloSelected").html("Recursos - " + getSession("submodulo"));
            document.location.href = 'equiposeguridad.html';

            break;

        case 8:
            createSession("modulo", "Recursos");
            createSession("submodulo", "Documentos de Seguridad");
            $("#moduloSelected").html("Recursos - " + getSession("submodulo"));
            document.location.href = 'procedimientoseguridad.html';
            createSession("ayudaId", 7);

            break;

        case 9:
            createSession("modulo", "Asignación");
            createSession("submodulo", opcional2);
            document.location.href = 'puestotrabajo.html?mdfId=' + opcional1;

            break;

        case 10:

            break;

        case 11:
            createSession("modulo", "Trabajadores / Grupos de Trabajo");
            createSession("submodulo", opcional2);
            document.location.href = 'trabajador.html?mdfId=' + opcional1;

            break;

        case 12:
            createSession("modulo", "Calendario");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'main.html';

            break;

        case 13:
            createSession("modulo", "Diagn&oacute;stico");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'auditoria.html';
            createSession("ayudaId", 10);

            break;

        case 14:
            createSession("modulo", "Inspecci&oacute;n");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'inspeccion.html';
            createSession("ayudaId", 10);

            break;

        case 15:
            createSession("modulo", "A/C Subest&aacute;ndar");
            createSession("submodulo", opcional2);
            document.location.href = 'acinseguros.html?mdfId=' + opcional1;
            createSession("ayudaId", 11);

            break;

        case 16:

            break;

        case 17:
            createSession("modulo", "Accidentes/Incidentes");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'accidentes.html';
            createSession("ayudaId", 12);

            break;

        case 18:
            createSession("modulo", "Solicitudes de Mejora");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'accionmejora.html';
            createSession("ayudaId", 13);

            break;

        case 19:
            createSession("modulo", "Herramientas de Análisis");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'estadistica.html';
            createSession("ayudaId", 15);

            break;

        case 20:
            createSession("modulo", "Empresa");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'perfiles.html';
            //createSession("ayudaId",16);

            break;

        case 21:
            createSession("ayudaId", 4);
            createSession("modulo", "Recursos");
            createSession("submodulo", "Capacitación Online");
            $("#moduloSelected").html("Recursos - " + getSession("submodulo"));
            document.location.href = 'capacitacion_online.html';

            break;

        case 22:
            createSession("modulo", "Contratista");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'contratista.html';

            break;

        case 23:
            createSession("modulo", "Evaluación Psicolaboral");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'psicologia.html';

            break;

        case 24:
            createSession("modulo", "Gestión Residuos");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'residuos.html';

            break;

        case 25:
            createSession("modulo", "Solicitudes");
            sessionStorage.removeItem("submodulo");
            window.open("solicitudes.html", '_blank');

            break;

        case 26:
            createSession("modulo", "Reguisitos Legales");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'requisitos.html';

            break;

        case 27:
            createSession("modulo", "Observaciones Planeadas de Trabajo");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'opt.html';

            break;

        case 28:
        case 29:
            createSession("ayudaId", 0);
            createSession("modulo", "Recursos");
            createSession("submodulo", "Ficha Química");
            $("#moduloSelected").html("Recursos - " + getSession("submodulo"));
            document.location.href = 'fichaquimica.html';

            break;

        case 30:

            break;

        case 32:
            createSession("modulo", "Indicadores generales");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'indicador_general.html';

            break;

        case 33:
            createSession("modulo", "Objetivos");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'objetivos.html';

            break;

        case 35:
            if(window.location.href.includes("/realplaza")){
                createSession("modulo","Participación y Consulta");
                sessionStorage.removeItem("submodulo");
                document.location.href = 'eleccion_virtual.html';
            }else{
                createSession("modulo","Covid");
                sessionStorage.removeItem("submodulo");
                document.location.href = 'covid.html';
            }

            break;

        case 36:
            if(window.location.href.includes("/realplaza")){
                createSession("modulo","Covid");
                sessionStorage.removeItem("submodulo");
                document.location.href = 'covid.html';
            }else{
                createSession("modulo","Participación y Consulta");
                sessionStorage.removeItem("submodulo");
                document.location.href = 'eleccion_virtual.html';
            }

            break;

        case 37:
            createSession("modulo", "Huella de carbono");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'huella_carbono.html';

            break;

        case 38:
            createSession("modulo","Inspección v2");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'inspeccionV2.html';

            break;

        case 40:
            createSession("modulo", "Inteligencia Artificial");
            sessionStorage.removeItem("submodulo");
            document.location.href = 'ia.html';

            break;

        default:

            break;
    }
}

/**
 *
 */

var listMdf;

// P-A00029: las llamadas a crearSubMenu hechas en el mismo instante (las tres de procesarLlamadaModulos, o las tres de mdf.js) comparten UNA
// sola peticion a /mdf/listbox (antes eran tres, de 1,1 MB cada una, con la misma respuesta). El lote se cierra al ENVIAR la peticion: una
// llamada posterior pide datos nuevos (por ejemplo, el refresco del menu al guardar una unidad en mdf.html), asi que nunca se usa una respuesta
// anterior a un cambio. Cada funcion pendiente se ejecuta en el orden en que se pidio y con los mismos datos que antes.
var loteListboxMenu = null;

function pedirListboxMenu(dataParam, funcionRespuesta) {
    if (loteListboxMenu !== null) {
        loteListboxMenu.push(funcionRespuesta);
        return;
    }

    loteListboxMenu = [funcionRespuesta];

    setTimeout(function () {
        var lote = loteListboxMenu;
        loteListboxMenu = null;

        callAjaxPostNoLoad(URL+'/mdf/listbox',dataParam,function(data){
            lote.forEach(function (funcion) {
                funcion(data);
            });
        });
    }, 0);
}

function crearSubMenu(idModulo) {
    var mdfId = null;

    if(parseInt(getSession("trabajadorGosstId") > 0)){
        mdfId = getSession("unidadGosstId");
    }

    var dataParam={
        userId:sessionStorage.getItem("gestopUi"),sessionId:sessionStorage.getItem("gestopsessionId"),companyId:sessionStorage.getItem("gestopcompanyid"),
        mdfId:mdfId,estadoActivo:1
    };

    pedirListboxMenu(dataParam,function(data){
        listMdf = data.list;

        if (listMdf.length == 1) {
            createSession("unidadGosstId", listMdf[0].matrixId);
            createSession("unidadGosstNombre", listMdf[0].matrixNameSimple);
        }

        $("#listaModulo" + idModulo + " ul").remove();
        $("#menuFigureti .subItem" + idModulo).remove();

        $("#listaModulo" + idModulo).append(
            "<ul class='nav-pills nav-stacked' id='subUnidades" + idModulo + "' " +
            "style='list-style-type:none;margin-left:20px;display:none'>");

        for (index = 0; index < listMdf.length; index++) {
            $("#listaModulo" + idModulo + " ul").append(
                "<li>" +
                "<a href='#' onclick='javascript:irHacia(" + idModulo + "," + listMdf[index].matrixId + ", &quot;" + listMdf[index].matrixNameSimple + "&quot;)'>" +
                "<span class='fa-stack fa-lg pull-left'>" +
                "<i class='fa fa-industry fa-stack-1x' aria-hidden='true'></i>" +
                "</span>" + listMdf[index].matrixNameSimple +
                "</a>" +
                "</li>");

            var nombreUnidad = (listMdf[index].matrixNameSimple.length >= 35 ?
                listMdf[index].matrixNameSimple.substring(0, 35) + "..." : listMdf[index].matrixNameSimple);

            $("#menuFigureti").append(
                "<div class='subContainerFig moduloAccesible col-xs-12 col-ss-12  col-sm-3 col-md-3 col-lg-3 subItem" + idModulo + "' " +
                "title='" + listMdf[index].matrixNameSimple + "' id='unidadId" + index + "' style='display:none'>" +
                "<div class='subItemFig'>" +
                "<img src='../imagenes/movil/unidad.png'>" +
                "<span class='fa-stack fa-lg'>" +
                "<i class='fa fa-industry'></i> " + nombreUnidad +
                "</span>" +
                "</div>");
        }

        $("#listaModulo" + idModulo).append("</ul>");

        /***Inicio de funcion de items****/
        $(".subContainerFig.moduloAccesible").on("click", function (ev) {
            var idAux = $(this).prop("id").split("unidadId");

            indexUnidadSeleccionada = parseInt(idAux[1]);

            $("#textoDescrip").remove();
            $("#btnIrModulo").remove();
            $(".subContainerFig").children().removeClass("itemNoFig").addClass("subItemFig");

            $(this).children().removeClass("subItemFig").addClass("itemNoFig");

            var btnIrModulo =
                "<div id='btnIrModulo' class='containerFig col-xs-12 col-ss-12 col-sm-3 col-md-3 col-lg-3'>" +
                "<div class='subItemFig'>" +
                "<i class='fa fa-arrow-circle-right'></i>" +
                "</div>" +
                "</div>";

            var idLinkAux = moduloSeleccionadoMenu;

            if (typeof (listMdf[indexUnidadSeleccionada]) == 'undefined') {
                irHacia(idLinkAux);
            } else {
                irHacia(idLinkAux, listMdf[indexUnidadSeleccionada].matrixId, listMdf[indexUnidadSeleccionada].matrixNameSimple);
            }

            $("#btnIrModulo").on("click", function () {
            });
        });
        /****Fin de funcion item*****/
    });
}

function indicadorUnidades(data) {
    if (data.CODE_RESPONSE == "05") {
        var indicadorFormacion = 0;
        var indicadorAcumulado = 0;
        var indicadorEntregaEpp = 0;
        var indicadorDisponibilidad = 0;
        var indicadorParticipacion = 0;
        var indicadorExamenMedico = 0;
        for (index = 0; index < data.indFormacion.length; index++) {
            indicadorAcumulado = data.indFormacion[index].cumplimientoFormacion + indicadorAcumulado;
            var size = data.indFormacion.length;
            (index + 1 == size ? indicadorFormacion = indicadorAcumulado / size : 0)
        }
        indicadorAcumulado = 1;
        for (index = 0; index < data.indEpp.length; index++) {
            var entregadosVigentes = data.indEpp[index].entregasLastYear;
            var asignados = data.indEpp[index].eppAsignados;
            if (asignados > 0) {
                indicadorAcumulado = (entregadosVigentes / asignados) + indicadorAcumulado;
            } else {
                indicadorAcumulado = 1 + indicadorAcumulado;
            }

            var size = data.indEpp.length;
            (index + 1 == size ? indicadorEntrega = indicadorAcumulado / size : 0)
        }
        indicadorAcumulado = 0;
        for (index = 0; index < data.indAcc.length; index++) {
            indicadorAcumulado = data.indAcc[index].indicadorDiasDescanso + indicadorAcumulado;
            var size = data.indAcc.length;
            (index + 1 == size ? indicadorDisponibilidad = indicadorAcumulado / size : 0)
        }
        indicadorAcumulado = 0;
        for (index = 0; index < data.indEvento.length; index++) {
            indicadorAcumulado = data.indEvento[index].numEventosReportados + indicadorAcumulado;
            var size = data.indEvento.length;
            (index + 1 == size ? indicadorParticipacion = indicadorAcumulado / size : 0)
        }
        indicadorAcumulado = 0;
        for (index = 0; index < data.indExam.length; index++) {
            indicadorAcumulado = data.indExam[index].vigenciaMedicaPuntaje + indicadorAcumulado;
            var size = data.indExam.length;
            (index + 1 == size ? indicadorExamenMedico = indicadorAcumulado / size : 0)
        }

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
        numTrabajadoresActivos = data.indAptitudGeneral.numTrabajadoresActivos;
        numTrabajadoresAptos = data.indAptitudGeneral.numTrabajadoresAptos;
        numTrabajadoresRestricciones = data.indAptitudGeneral.numTrabajadoresRestricciones;
        numTrabajadoresNoAptos = data.indAptitudGeneral.numTrabajadoresNoAptos;
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
        var indicadorIperc = (evalRealizadas == 0 ? 1 : (evalRealizadas - evalRiesgosas) / evalRealizadas);

        var indicadorMinimoFormacion = data.indicadoresSeguridad.indicadorMinimoFormacion;
        var indicadorMinimoEntregaEpp = data.indicadoresSeguridad.indicadorMinimoEntregaEpp;
        var indicadorMinimoDisponibilidad = data.indicadoresSeguridad.indicadorMinimoDisponibilidad;
        var indicadorMinimoParticipacion = data.indicadoresSeguridad.indicadorMinimoParticipacion;
        var indicadorMinimoExamenMedico = data.indicadoresSeguridad.indicadorMinimoExamenMedico;
        var indicadorMinimoIperc = data.indicadoresSeguridad.indicadorMinimoIperc;

        $('#subDivResumen3').highcharts({

            chart: {
                polar: true,
                type: 'line'
            },

            title: {
                text: 'Indicadores propuestos de la empresa',
                x: -80
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
                    'Porcentaje de riesgo significativo'],
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
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>',
                valueDecimals: 2
            },

            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                y: 70,
                layout: 'vertical'
            },
            colors: ["#9BBB59", "#4F81BD"],
            series: [{
                name: 'Promedio Actual',
                data: [indicadorFormacion,
                    indicadorEntrega,
                    indicadorDisponibilidad,
                    indicadorParticipacion / indicadorMinimoParticipacion,
                    indicadorExamenMedico,
                    indicadorIperc],
                pointPlacement: 'on'
            }, {
                name: 'Meta',
                data: [indicadorMinimoFormacion,
                    indicadorMinimoEntregaEpp,
                    indicadorMinimoDisponibilidad,
                    1,
                    indicadorMinimoExamenMedico,
                    indicadorMinimoIperc],
                pointPlacement: 'on'
            }]


        });


    } else {
        alert("No se pudo traer los indicadores de la empresa")
    }


}

var requisitoOculto = false;

function verGraficoResumen(moduloId, unidadId) {
    if (irDirectamenteModulo) {
        irHacia(parseInt(moduloId), unidadId);
    }
    var buttonIrModulo = "<a class='btn btn-info' id='accessModulo' style='float:right;margin-right:20px ' href='#'>" +
        "<i class='fa fa-paper-plane'></i> </a>";
    buttonIrModulo = "";
    switch (parseInt(moduloId)) {

        case 20:
            buttonIrModulo = ""
            break;

        case 4:
            buttonIrModulo = ""

            break;
        case 9:
            buttonIrModulo = ""
            break;
        case 15:
            buttonIrModulo = ""

            break;
        case 11:
            buttonIrModulo = ""
            break;
        default:

            break;
    }
    var URLGraficaMenu = "";
    var dataParam = {};
    var dataParamAux = {};
    var functionGrafico = "";


    $("#subDivResumen1")
        .html("<strong >Requisitos" +
            "<span style='float:left;margin-right:20px' id='requisitoToggle'>" +
            "<i class='fa fa-arrow-up' aria-hidden='true'></i></span></strong>" +
            "<span id='requisitoDiv'></span>" + buttonIrModulo);
    $("#accessModulo").on("click", function () {
        irHacia(parseInt(moduloId), unidadId);
    });
    $("#requisitoToggle").on("click", function () {
        var estilo = {};
        if (requisitoOculto) {
            $(this).html("<i class='fa fa-arrow-up' aria-hidden='true'></i>");
            estilo = {
                "height": "300px", "z-index": "2000"
            }
        } else {
            estilo = {
                "height": "30px",
                "z-index": "-1"
            }
            $(this).html("<i class='fa fa-arrow-down' aria-hidden='true'></i>");
        }
        $("#subDivResumen1").css(estilo);

        requisitoOculto = !requisitoOculto;
    });
    $("#subDivResumen2").html("");
    for (var index = 0; index < listaModulosPermitidos.length; index++) {
        var subMenuAux = listaModulosPermitidos[index].subMenus;
        var countObligatorios = 0, countObligatoriosCumplidos = 0;
        for (var index2 = 0; index2 < subMenuAux.length; index2++) {

            if (subMenuAux[index2].menuOpcionId == moduloId) {
                var subRequisitoAux = subMenuAux[index2].restricciones;
                for (index3 = 0; index3 < subRequisitoAux.length; index3++) {
                    var iconoRequisito, iconoColor, cumpleRequisito;
                    //realizar una funcion para verificar el requisito
                    var requisitoObject = {
                        id: subRequisitoAux[index3].id,
                        companyId: sessionStorage.getItem("gestopcompanyid"),
                        isObligatorio: subRequisitoAux[index3].isObligatorio,
                        descripcion: subRequisitoAux[index3].descripcion,
                        actividadManualId: subRequisitoAux[index3].actividadManualId
                    };

                    var llamandoServidor = false;
                    callAjaxPost(URL + "/empresa/requisito/modulo", requisitoObject, function (data) {
                        if (data.CODE_RESPONSE == "05") {
                            llamandoServidor = true;
                            cumpleRequisito = data.respuesta;
                            if (data.isObligatorio == 1 && cumpleRequisito != 0 && cumpleRequisito != null) {
                                countObligatoriosCumplidos = countObligatoriosCumplidos + 1;
                            }
                            if (cumpleRequisito) {
                                iconoColor = "#9BBB59"
                                iconoRequisito = "check"
                            } else {
                                iconoColor = "#C0504D"
                                iconoRequisito = "times"
                            }
                            var textoOpcion = "<span style='color:white;font-weight:bold'>(opcional)</span>";
                            if (data.isObligatorio == 1) {
                                textoOpcion = " ";
                                countObligatorios = countObligatorios + 1;
                            }
                            $("#subDivResumen1").append(
                                "<span class='fa-stack fa-sm'>"
                                + "<i class='fa fa-square-o fa-stack-2x' ></i>"
                                + "  <i class='fa fa-" + iconoRequisito + " fa-stack-1x fa-inverse' style='color:" + iconoColor + "'></i>"
                                + "</span>"
                                + data.descripcion + " "
                                + textoOpcion + "<i class='fa fa-question fa-2x' onclick='irActividadManual(" + data.actividadManualId + ")'></i><br>");
                            $("#subDivResumen1 #requisitoDiv")
                                .html("<strong>" + countObligatoriosCumplidos + "/" + countObligatorios + "</strong><br><br>");

                        } else {
                            console.log("nop")
                        }
                        ;
                    }, function () {
                        console.log("no es");
                        if (llamandoServidor) {
                            return false;
                        }
                        if (isMobile.any()) {
                            console.log("no es necesario");
                            return false;
                        }
                    })

                }


                index2 = index2 + 50;
            }
        }
        if (listaModulosPermitidos[index].menuOpcionId == moduloId) {
            var subRequisitoAux = listaModulosPermitidos[index].restricciones;
            for (var index3 = 0; index3 < subRequisitoAux.length; index3++) {
                var iconoRequisito, iconoColor, cumpleRequisito;
                var requisitoObject = {
                    id: subRequisitoAux[index3].id,
                    companyId: sessionStorage.getItem("gestopcompanyid"),
                    isObligatorio: subRequisitoAux[index3].isObligatorio,
                    descripcion: subRequisitoAux[index3].descripcion,
                    actividadManualId: subRequisitoAux[index3].actividadManualId
                }
                //realizar una funcion para verificar el requisito
                callAjaxPostNoLoad(URL + "/empresa/requisito/modulo", requisitoObject, function (data) {
                    if (data.CODE_RESPONSE == "05") {
                        cumpleRequisito = data.respuesta;
                        if (data.isObligatorio == 1 && cumpleRequisito && cumpleRequisito != null) {
                            countObligatoriosCumplidos = countObligatoriosCumplidos + 1;
                        }
                        if (cumpleRequisito) {
                            iconoColor = "#9BBB59"
                            iconoRequisito = "check"
                        } else {
                            iconoColor = "#C0504D"
                            iconoRequisito = "times"
                        }
                        var textoOpcion = "<span style='color:white;font-weight:bold'>(opcional)</span>";
                        if (data.isObligatorio == 1) {
                            textoOpcion = " ";
                            countObligatorios = countObligatorios + 1;
                        }
                        $("#subDivResumen1").append(
                            "<span class='fa-stack fa-sm'>"
                            + "<i class='fa fa-square-o fa-stack-2x' ></i>"
                            + "  <i class='fa fa-" + iconoRequisito + " fa-stack-1x fa-inverse' style='color:" + iconoColor + "'></i>"
                            + "</span>"
                            + data.descripcion + " "
                            + textoOpcion + "<i class='fa fa-question fa-2x' onclick='irActividadManual(" + data.actividadManualId + ")'></i><br>");
                    }
                    $("#subDivResumen1 #requisitoDiv")
                        .html("<strong>" + countObligatoriosCumplidos + "/" + countObligatorios + "</strong><br><br>");

                }, function () {

                    if (llamandoServidor) {
                        return false;
                    }
                    if (isMobile.any()) {

                        return false;
                    }
                });
            }


            index = index + 50;
        }


    }


}

function irActividadManual(actId) {

    var subUrl = (actId == null ? "" : "?actividadManualId=" + actId);
    var url = "manual/manual.html" + subUrl;
    window.open(url, '_blank');
    return false;
}

function procesarDescargables(data) {


    switch (data.idModulo) {
        case 1:
            $("#subDivResumen2").append("<div id='indFormEmp' class='indicadorEmpresa'>" +
                "<div style='width:20%;float:left'></div>" +
                "<div class='barraIndicador'></div>" +
                "<div  class='mensajeIndicador'></div>" +
                "</div>");
            $("#indFormEmp div:eq(0)").append(
                "Extensión de formación"
            );
            $("#indFormEmp div:eq(1)").append(
                "<div class='progress-container progress-success-container'>"
                + "<div id='myBar' class='progress-realizado progress-success-realizado ' style='width:75%'>"
                + "<div class='w3-center w3-text-white'>75%</div>"
                + "	  </div>"
                + "	</div>		"
            );
            $("#indFormEmp .mensajeIndicador").append(
                "<div class='msg-null'>" +
                "No hay trabajadores registrados<br>" +
                "No hay unidades registradas</div>"
            );

            $("#subDivResumen2").append("<div id='indVigEpp' class='indicadorEmpresa'>" +
                "<div style='width:20%;float:left'></div>" +
                "<div class='barraIndicador'></div>" +
                "<div class='mensajeIndicador'></div>" +
                "</div>");
            $("#indVigEpp div:eq(0)").append(
                "Vigencia de EPP's"
            );
            $("#indVigEpp div:eq(1)").append(
                "<div class='progress-container progress-success-container'>"
                + "<div id='myBar' class='progress-realizado progress-success-realizado ' style='width:35%'>"
                + "<div class='w3-center w3-text-white'>35%</div>"
                + "	  </div>"
                + "	</div>		"
            );
            $("#indVigEpp .mensajeIndicador").append(
                "<div class='msg-warning'>Carefull CarefullCarefullCarefull  CarefullCarefull Carefull operation message. Carefull operation message. Carefull operation message</div>"
            );

            $("#subDivResumen2").append("<div id='indVigMedica' class='indicadorEmpresa'>" +
                "<div style='width:20%;float:left'></div>" +
                "<div class='barraIndicador'></div>" +
                "<div  class='mensajeIndicador'></div>" +
                "</div>");
            $("#indVigMedica div:eq(0)").append(
                "Vigencia Médica"
            );
            $("#indVigMedica div:eq(1)").append(
                "<div class='progress-container progress-success-container'>"
                + "<div id='myBar' class='progress-realizado progress-success-realizado ' style='width:95%'>"
                + "<div class='w3-center w3-text-white'>95%</div>"
                + "	  </div>"
                + "	</div>		"
            );
            $("#indVigMedica .mensajeIndicador").append(
                "<div class='msg-success'>SuccessfulSuccessfulSuccessfulSuccessful operation message</div>"
            );

            $("#subDivResumen2").append("<div id='indRiesgo' class='indicadorEmpresa'>" +
                "<div style='width:20%;float:left'></div>" +
                "<div class='barraIndicador'></div>" +
                "<div  class='mensajeIndicador'></div>" +
                "</div>");
            $("#indRiesgo div:eq(0)").append(
                "Riesgos Significativos Actuales"
            );
            $("#indRiesgo div:eq(1)").append(
                "<div class='progress-container progress-success-container'>"
                + "<div id='myBar' class='progress-realizado progress-success-realizado ' style='width:45%'>"
                + "<div class='w3-center w3-text-white'>45%</div>"
                + "	  </div>"
                + "	</div>		"
            );
            $("#indRiesgo .mensajeIndicador").append(
                "<div class='msg-warning'> CarefullCarefullCarefullCarefullCarefull operation message</div>"
            );

            $("#subDivResumen2").append("<div id='indDisponibilidad' class='indicadorEmpresa'>" +
                "<div style='width:20%;float:left'></div>" +
                "<div class='barraIndicador'></div>" +
                "<div  class='mensajeIndicador'></div>" +
                "</div>");
            $("#indDisponibilidad div:eq(0)").append(
                "Disponibilidad Laboral"
            );
            $("#indDisponibilidad div:eq(1)").append(
                "<div class='progress-container progress-success-container'>"
                + "<div id='myBar' class='progress-realizado progress-success-realizado ' style='width:85%'>"
                + "<div class='w3-center w3-text-white'>85%</div>"
                + "	  </div>"
                + "	</div>		"
            );
            $("#indDisponibilidad .mensajeIndicador").append(
                "<div class='msg-success'> Successful SuccessfulSuccessful Successful  Successful SuccessfulSuccessful " +
                "Successful Successful SuccessfulSuccessful operation message <i class='fa fa-question-circle' aria-hidden='true'></i></div>"
            );

            $("#subDivResumen2").append("<div id='indPartSST' class='indicadorEmpresa'>" +
                "<div style='width:20%;float:left'></div>" +
                "<div class='barraIndicador'></div>" +
                "<div class='mensajeIndicador'></div>" +
                "</div>");
            $("#indPartSST div:eq(0)").append(
                "Participación SGSST"
            );
            $("#indPartSST div:eq(1)").append(
                "<div class='progress-container progress-success-container'>"
                + "<div id='myBar' class='progress-realizado progress-success-realizado ' style='width:15%'>"
                + "<div class='w3-center w3-text-white'>15%</div>"
                + "	  </div>"
                + "	</div>		"
            );
            $("#indPartSST .mensajeIndicador").append(
                "<div class='msg-error'> R </div>"
            );
            $(".mensajeIndicador div").append("<i class='fa fa-question-circle' aria-hidden='true'></i>")
            var estiloCentro = {"margin-top": ($("#indFormEmp").height() / 2) - 10 + "px"};
            var estiloCentroMensaje = {"margin-top": ($("#indFormEmp").height() / 2) - 25 + "px"};
            $("#indVigMedica div:eq(0)").css(estiloCentro);
            $("#indVigEpp div:eq(0)").css(estiloCentro);
            $("#indVigMedica div:eq(1)").css(estiloCentro);
            $("#indVigEpp div:eq(1)").css(estiloCentro);
            $("#indVigMedica .mensajeIndicador").css(estiloCentroMensaje);
            $("#indVigEpp .mensajeIndicador").css(estiloCentroMensaje);

            $("#indFormEmp div:eq(0)").css(estiloCentro);
            $("#indRiesgo div:eq(0)").css(estiloCentro);
            $("#indFormEmp div:eq(1)").css(estiloCentro);
            $("#indRiesgo div:eq(1)").css(estiloCentro);
            $("#indFormEmp .mensajeIndicador").css(estiloCentroMensaje);
            $("#indRiesgo .mensajeIndicador").css(estiloCentroMensaje);

            $("#indDisponibilidad div:eq(0)").css(estiloCentro);
            $("#indPartSST div:eq(0)").css(estiloCentro);
            $("#indDisponibilidad div:eq(1)").css(estiloCentro);
            $("#indPartSST div:eq(1)").css(estiloCentro);
            $("#indDisponibilidad .mensajeIndicador").css(estiloCentroMensaje);
            $("#indPartSST .mensajeIndicador").css(estiloCentroMensaje);

            break;
    }

    if (data.CODE_RESPONSE == "05") {
        var descargables = data.descargables;
        $("#subDivResumen1").show();
        $("#subDivResumen2").show();
        $("#subDivResumen3").show();

        switch (data.idModulo) {
            case 2:
                $("#subDivResumen2").append("<table class='table table-striped table-bordered table-hover'>" +
                    "<thead><tr ><td class='tb-acc'>Unidad</td><td class='tb-acc'>Descargable</td></tr></thead>" +
                    "<tbody></tbody></table>");
                for (index = 0; index < descargables.length; index++) {
                    var mdfId = descargables[index].id;
                    $("#subDivResumen2 table tbody").append(
                        "<tr><td >" + descargables[index].nombre + "</td>" +
                        "<td ><a id='m" + mdfId + "'><i class='fa fa-file-word-o' " +
                        "aria-hidden='true'></i>" +
                        "</td></tr>"
                    );
                    $("#m" + mdfId).on("click", function () {
                        var idAux = $(this).prop("id").split("m")
                        window.open(URL
                            + "/mdf/reporteanual?mdfId="
                            + idAux[1]
                            + "&companyId="
                            + sessionStorage.getItem("gestopcompanyid"), '_blank');

                    })
                }

                break;
            case 5:
                $("#subDivResumen2").append("<table class='table table-striped table-bordered table-hover'>" +
                    "<thead><tr ><td class='tb-acc'>Programaci&oacute;n</td><td class='tb-acc'>Descargable</td></tr></thead>" +
                    "<tbody></tbody></table>");
                for (index = 0; index < descargables.length; index++) {
                    var formId = descargables[index].id;
                    $("#subDivResumen2 table tbody").append(
                        "<tr><td rowspan='2'>" + descargables[index].nombre + "</td>" +
                        "<td><a id='f" + formId + "'><i class='fa fa-file-word-o' " +
                        "aria-hidden='true'></i>" +
                        "</td></tr>" +
                        "<tr><td>" +
                        "<a href='" + URL + descargables[index].rutaDescarga + "' target='_blank'>" +
                        descargables[index].evidenciaNombre + "</a>" +
                        "</td></tr>");


                    $("#f" + formId).on("click", function () {
                        var idAux = $(this).prop("id").split("f");
                        window.open(URL
                            + "/capacitacion/informe?progcapacitacionId="
                            + idAux[1], '_blank');

                    })
                }


                break;
        }


    } else {
        alert("error")
    }

}

function removerBotonesGosst() {
    $("#options").remove();
}

function removerBotones() {
    $("#fsBotones").html("");
}

function crearBotonesGosst(listButtons) {
    $("#barraMenu").after("<div id='options'></div>");
    $("#options")
        .append("<ul class='list-group'>" +
            "</ul>");
    listButtons.forEach(function (val, index) {
        $("#options>ul")
            .append("<li " +
                "class='list-group-item " + val.clase + "' " +
                "id='" + val.id + "' " +
                "onclick='" + val.onclick + "' " +
                ">" +
                "<i class='fa " + val.icono + "' aria-hidden='true'></i>" +
                val.nombre +
                "</li>");
    });
    $("#options").hide();
}

function crearBotones() {
    /*
 * $("#fsBotones").append('<button>'). attr("class", "btn btn-success").
* attr("type", "button"). attr("id", "btnCancelar");
 */

    $("#fsBotones")
        .append("<button id='btnCancelar' type='button' class='btn btn-success' title='Cancelar acciones realizadas - Deshace " +
            "todo lo hecho al añadir/editar los datos en la fila seleccionada de la tabla actual.'>"
            + "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"
            + "</button>"
            + "<button id='btnNuevo' type='button' class='btn btn-success' title='Nuevo registro - Añade una nueva fila para " +
            "ingresar los datos del registros (algunos campos se completan automáticamente).'>"
            + "<i class='fa fa-file-o fa-2x'></i>"
            + "</button>"
            + "<button id='btnGuardar' type='button' class='btn btn-success' title='Guardar registro - Grabar la información ingresada " +
            "al añadir/editar los datos en la fila seleccionada de la tabla actual.'>"
            + "<i class='fa fa-floppy-o fa-2x'></i>"
            + "</button>"
            + "<button id='btnEliminar' type='button' class='btn btn-danger' title='Eliminar registro seleccionado - Borra la información " +
            "de la fila seleccionada en la tabla actual.'>"
            + "<i class='fa fa-times fa-2x'></i>"
            /*+ "</button>"
	     + "<button id='btnUpload' type='button' class='btn btn-success' title='Subir datos'>"
	     + "<i class='fa fa-upload fa-2x'></i>" */
            + "</button>");
    $("#btnUpload").css("margin-left", "-10");

}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function validarLista(listObject) {
    if (listObject.length > 300)
        return "Supera el maximo de 300 lineas permitidas.";

    var arrayUnicos = [];
    for (var int = 0; int < listObject.length; int++) {
        var varElement = listObject[int];
        if (varElement.trim().length < 1) {
            return "Existen filas vacias.";
        }
        if (varElement.trim().length > 400) {
            return "Existen filas que superan los 400 caracteres permitidos.";
        }
        if ($.inArray(varElement.trim(), arrayUnicos) === -1)
            arrayUnicos.push(varElement.trim);
    }
    if (arrayUnicos.length < listObject.legth)
        return "Existen filas repetidas";

    return "";
}

function formatearLista(listObject) {
    if (listObject.length > 100)
        return "Supera el maximo de 100 lineas permitidas.";

    var arrayUnicos = [];
    for (var int = 0; int < listObject.length; int++) {
        var varElement = listObject[int];
        arrayUnicos.push(varElement.trim());
    }
    return arrayUnicos;
}

function guardarMasivoPlano(tablaId, padreId, funcionResultado, isDirectedToIperc) {
    var texto = $("#txtListado").val().toUpperCase();

    var listObject = texto.split('\n');
    $.each(listObject, function (i, l) {
        console.log("Index #" + i + ": " + l.trim().length);
    });
    var validado = validarLista(listObject);
    if (validado.length < 1) {
        var r = confirm("¿Está seguro que desea subir estos "
            + listObject.length + " elementos?");
        if (r == true) {
            var dataParam = {
                userId: sessionStorage.getItem("gestopUi"),
                sessionId: sessionStorage.getItem("gestopsessionId"),
                listObject: formatearLista(listObject),
                tablaId: tablaId,
                padreId: padreId,
                isDirectedToIperc: isDirectedToIperc
            };

            callAjaxPost(URL + '/tablagenerica/listado/save', dataParam,
                funcionResultado);
        }
    } else {
        alert(validado);
    }
}

function marcarChechBox(entero,checkboxId) {
    if(entero == 1){
        $("#"+checkboxId).prop("checked",true);
    }else{
        $("#"+checkboxId).prop("checked",false);
    }
}

function pasarBoolInt(bool) {

    if (bool) {
        return 1;
    } else {
        return 0;
    }
}

function pasarBoolPalabra(bool) {

    if (bool) {
        return "Si";
    }
    if (bool == 0) {
        return "No";
    }
    if (bool == null) {
        return "Por Definir";
    }
}

function pasarBoolNumber(bool) {
    if (bool) {
        return 1;
    } else {
        return 0;
    }
}

function pasarNumberBool(number) {
    var bool = false;
    if (number == 0) {
        bool = false;

    } else {

        bool = true;
    }
    return bool;

}

function restringirFecha(idFechaInicio, idFechaFin, idAdvertencia) {


    var fechaInicio = $("#" + idFechaInicio).val();
    var fechaFin = $("#" + idFechaFin).val()
    var correcto;
    fechaInicio = fechaInicio.replace('-', '');
    fechaFin = fechaFin.replace('-', '');

    $("#" + idFechaInicio).css("border-color", "black");

    if (fechaInicio <= fechaFin) {
        if (fechaInicio == "") {

            $("#" + idFechaFin).css("border-color", "black");
            $("#" + idAdvertencia).html("");
            $("#" + idAdvertencia).css("color", "black")
            correcto = true;

            if (fechaFin == "") {
                $("#" + idFechaFin).css("border-color", "black");
                $("#" + idAdvertencia).html("");
                $("#" + idAdvertencia).css("color", "black")
                correcto = true;

            }
        } else {
            $("#" + idFechaFin).css("border-color", "green");
            $("#" + idAdvertencia).html("Fecha Correcta");
            $("#" + idAdvertencia).css("color", "green")
            correcto = true;
        }
    } else {
        $("#" + idFechaFin).css("border-color", "red")
        $("#" + idAdvertencia).html("Ingrese una fecha válida");
        $("#" + idAdvertencia).css("color", "red")
        correcto = false;
    }


    return correcto;

}

function restaFechasNormales(f1, f2) {
    var aFecha1 = f1.split('-');
    var aFecha2 = f2.split('-');
    var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
    var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
}

function restaFechas(f1, f2) {
    var aFecha1 = f1.split('-');
    var aFecha2 = f2.split('-');
    var fFecha1 = Date.UTC(aFecha1[0], aFecha1[1] - 1, aFecha1[2]);
    var fFecha2 = Date.UTC(aFecha2[0], aFecha2[1] - 1, aFecha2[2]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
}

//
function restaDatetimes(f1, h1, f2, h2) {
    var aFecha1 = f1.split('-');
    var aHora1 = h1.split(':');
    var aFecha2 = f2.split('-');
    var aHora2 = h2.split(':');
    var fFecha1 = Date.UTC(aFecha1[0], aFecha1[1] - 1, aFecha1[2], aHora1[0], aHora1[1]);
    var fFecha2 = Date.UTC(aFecha2[0], aFecha2[1] - 1, aFecha2[2], aHora2[0], aHora2[1]);
    var dif = fFecha2 - fFecha1;
    var minutos = Math.floor(dif / (1000 * 60));
    return minutos;
}

//
function restaFechasMinutos(f1, f2) {
    var aFecha1 = f1.split('-');
    var aFecha2 = f2.split('-');
    var fFecha1 = Date.UTC(aFecha1[0], aFecha1[1] - 1, aFecha1[2]);
    var fFecha2 = Date.UTC(aFecha2[0], aFecha2[1] - 1, aFecha2[2]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60));
    return dias;
}

function fechaIncluidaEnRango(fecha, rango1, rango2) {
    var boolEntreFechas = false;

    var diferenciaInicio = restaFechas(fecha, rango1);
    var diferenciaFinal = restaFechas(fecha, rango2);

    if (diferenciaInicio <= 0 && diferenciaFinal >= 0) {
        boolEntreFechas = true;
    }

    return boolEntreFechas;
}

function fechaEnRango(fecha, rango1, rango2) {
    var boolEntreFechas = false;
    var diferenciaInicio = restaFechas(fecha, rango1);
    var diferenciaFinal = restaFechas(fecha, rango2);
    if (diferenciaInicio <= 0 && diferenciaFinal >= 0) {
        boolEntreFechas = true;
    }
    if (rango1 == rango2) {
        boolEntreFechas = false;
    }
    return boolEntreFechas;
}

function sumaFechaDias(dias, fecha) {

    var aFecha = fecha.split('-');

    var fFecha = Date.UTC(aFecha[0], aFecha[1] - 1, aFecha[2]) + (86400000 * dias); // 86400000 son los milisegundos que tiene un día

    var d = new Date(fFecha);
    var month = d.getUTCMonth() + 1;
    var day = d.getUTCDate();
    var anno = d.getUTCFullYear();
    if (parseInt(month) == 0) {
        month = 12;
        anno = anno - 1;
    }

    var output = anno + '-' +
        (('' + month).length < 2 ? '0' : '') + month + '-' +
        (('' + day).length < 2 ? '0' : '') + day;
    return output;

    return (output);

}

function sumaFechaDias2(dias, fecha) {

    var aFecha = fecha.split('-');

    var fFecha = Date.UTC(aFecha[0], aFecha[1] - 1, aFecha[2]) + (86400000 * dias); // 86400000 son los milisegundos que tiene un día

    var d = new Date(fFecha);


    var month = d.getUTCMonth() + 1;

    var day = d.getUTCDate();

    var anno = d.getUTCFullYear();
    if (parseInt(month) == 0) {
        month = 12;
        anno = anno - 1;
    }

    var output = (('' + day).length < 2 ? '0' : '') + day + '-' +
        (('' + month).length < 2 ? '0' : '') + month + '-' +
        anno;
    return output;

    return (output);

}

function obtenerFechaActual() {
    //Today
    var d = new Date();

    var month = d.getUTCMonth() + 1;
    var day = d.getUTCDate();

    var output = d.getUTCFullYear() + '-' +
        (('' + month).length < 2 ? '0' : '') + month + '-' +
        (('' + day).length < 2 ? '0' : '') + day;
    return output;

}

function obtenerFechaActualNormal() {
    //Today
    var d = new Date();

    var month = d.getUTCMonth() + 1;
    var day = d.getUTCDate();

    var output = (('' + day).length < 2 ? '0' : '') + day + '-' +
        (('' + month).length < 2 ? '0' : '') + month + '-' +
        d.getUTCFullYear();
    return output;

}

function obtenerFechaActualNoUTC() {
    //Today
    var d = new Date();

    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output = (('' + day).length < 2 ? '0' : '') + day + '-' +
        (('' + month).length < 2 ? '0' : '') + month + '-' +
        d.getFullYear();
    return output;

}

function formatoCeldaSombreable(booleanPrendido) {
    if (booleanPrendido) {
        $("tbody tr").addClass("info");
    } else {
        $("tbody tr").removeClass("info");
    }


}

function formatoCeldaSombreableTabla(booleanPrendido, tableId) {
    if (booleanPrendido) {
        $("#" + tableId + " tbody tr").addClass("info");
    } else {
        $("#" + tableId + " tbody tr").removeClass("info");
    }


}

//Funcines para cabecera fija

var contadorFijo = 0;

function goheadfixed(classtable, wrapper) {
    if (contadorFijo == 0) {
        contadorFijo = 1;
        wrapper = typeof wrapper !== 'undefined' ? wrapper : '#wrapper'
        if ($(classtable).length) {

            $(classtable).wrap('<div class="fix-inner"></div>');
            $('.fix-inner').wrap('<div class="fix-outer" style="position:relative; margin:auto;"></div>');
            $('.fix-outer').append('<div class="fix-head"></div>');
            $('.fix-head').prepend($('.fix-inner').html());
            $('.fix-head table').find('caption').remove();
            $('.fix-head table').css('width', '100%');

            $('.fix-outer').css('width', $('.fix-inner table').outerWidth(true) + 'px');
            $('.fix-head').css('width', $('.fix-inner table').outerWidth(true) + 'px');
            $('.fix-head').css('height', $('.fix-inner table thead').height() + 'px');

            // If exists caption, calculte his height for then remove of total
            var hcaption = 0;
            if ($('.fix-inner table caption').length != 0)
                hcaption = parseInt($('.fix-inner table').find('caption').height() + 'px');

            // Table's Top
            var hinner = parseInt($('.fix-inner').position().top);

            // Let's remember that <caption> is the beginning of a <table>, it mean that his top of the caption is the top of the table
            $('.fix-head').css({
                'position': 'absolute',
                'overflow': 'hidden',
                'top': hcaption + 'px',
                'left': 0,
                'z-index': 100
            });
            $('.fix-head').css('top', '0px');
            $(wrapper).scroll(function () {

                var vscroll = $(this).scrollTop();
                var aux = 0;

                $('.fix-head').css('top', (vscroll - hinner + aux) + 'px');

            });

            /*	If the windows resize	*/
            $(wrapper).resize(goresize);
            $("#wrapper2").scroll(function () {

                var vscroll = $(this).scrollTop();
                var aux = 0;

                $('.fix-head').css('top', (vscroll - hinner + aux) + 'px');


            });

            /*	If the windows resize	*/
            $("#wrapper2").resize(goresize);
        }
    }
}

var contadorFijoY = 0;

function goheadfixedY(classtable, wrapper) {

    wrapper = typeof wrapper !== 'undefined' ? wrapper : 'document'

    if ($(".fix-inner " + classtable).length == 0) {
        $(classtable).wrap('<div class="fix-inner"></div>');
        $(wrapper + ' .fix-inner').wrap('<div class="fix-outer" style="position:relative; margin:auto;"></div>');
        $(wrapper + ' .fix-outer').append('<div class="fix-head"></div>');

        $(wrapper + ' .fix-head').prepend($(wrapper + ' .fix-inner').html());
        $(wrapper + ' .fix-head table').find('caption').remove();
        $(wrapper + ' .fix-head table').css('width', '100%');

        $(wrapper + ' .fix-outer').css('width', $(wrapper + ' .fix-inner table').outerWidth(true) + 'px');
        $(wrapper + ' .fix-head').css('width', $(wrapper + ' .fix-inner table').outerWidth(true) + 'px');
        $(wrapper + ' .fix-head').css('height', $(wrapper + ' .fix-inner table thead').height() + 'px');

        // If exists caption, calculte his height for then remove of total
        var hcaption = 0;

        if ($(wrapper + ' .fix-inner table caption').length != 0)
            hcaption = parseInt($(wrapper + ' .fix-inner table').find('caption').height() + 'px');
        // Table's Top
        var hinner = parseInt($(wrapper + ' .fix-inner').offset().top);

        // Let's remember that <caption> is the beginning of a <table>, it mean that his top of the caption is the top of the table
        $(wrapper + ' .fix-head').css({
            'position': 'absolute',
            'overflow': 'hidden',
            'top': hcaption + 'px',
            'left': 0,
            'z-index': 800
        });
        $(wrapper + ' .fix-head').css('top', '0px');

        $(wrapper).scroll(function () {
            var vscroll = $(this).scrollTop();
            var aux = 0;
            $(wrapper + ' .fix-head').css('top', (vscroll + aux) + 'px');
        });

        /*	If the windows resize	*/
        $(wrapper).resize(goresizeY(wrapper));
    }
}

var sizeScrollLeft = 0;
var sizeScrollTop = 0;

function goheadfixedZ(classtable, wrapper, widthSeparator) {
    wrapper = typeof wrapper !== 'undefined' ? wrapper : 'document'
    if ($(".fix-inner " + classtable).length == 0) {
        $(classtable).wrap('<div class="fix-inner"></div>');
        $(wrapper + ' .fix-inner').wrap('<div class="fix-outer" style="position:relative; margin:auto;"></div>');
        $(wrapper + ' .fix-outer').append("<div class='fix-head'></div>" +
            "<div class='fix-column'></div>" +
            "<div class='fix-divider'></div>");
        $(wrapper + ' .fix-head').prepend($(wrapper + ' .fix-inner').html());
        $(wrapper + ' .fix-column').prepend($(wrapper + ' .fix-inner').html());
        $(wrapper + ' .fix-divider').prepend($(wrapper + ' .fix-inner').html());

        $(wrapper + ' .fix-head table').find('caption').remove();

        $(wrapper + ' .fix-head table').css('width', '100%');
        $(wrapper + ' .fix-column table').css('width', $(classtable).width() + "px");
        $(wrapper + ' .fix-divider table').css('width', $(classtable).width() + "px");


        $(wrapper + ' .fix-outer').css('width', $(wrapper + ' .fix-inner table').outerWidth(true) + 'px');
        $(wrapper + ' .fix-head').css('width', $(wrapper + ' .fix-inner table').outerWidth(true) + 'px');
        $(wrapper + ' .fix-column').css('width', $(wrapper + ' .fix-inner table').outerWidth(true) + 'px');
        $(wrapper + ' .fix-divider').css('width', $(wrapper + ' .fix-inner table').outerWidth(true) + 'px');
        //Se le da la altura completa
        $(wrapper + ' .fix-head').css('height', "100%");
        $(wrapper + ' .fix-column').css('height', "100%");
        $(wrapper + ' .fix-divider').css('height', "100%");

        // If exists caption, calculte his height for then remove of total
        var hcaption = 0;
        if ($(wrapper + ' .fix-inner table caption').length != 0)
            hcaption = parseInt($(wrapper + ' .fix-inner table').find('caption').height() + 'px');
        // Table's Top
        var hinner = parseInt($(wrapper + ' .fix-inner').offset().top);

        // Let's remember that <caption> is the beginning of a <table>, it mean that his top of the caption is the top of the table
        $(wrapper + ' .fix-head').css({
            'position': 'absolute',
            'overflow': 'hidden',
            'top': hcaption + 'px',
            'left': 0,
            'z-index': 802,
            "border-bottom": "2px solid black"
        });
        $(wrapper + ' .fix-head').css('top', '0px');
        $(wrapper + ' .fix-column').css({
            'position': 'absolute',
            'overflow': 'hidden',
            'top': hcaption + 'px',
            'left': 0,
            'z-index': 801
        });
        $(wrapper + ' .fix-column').css('top', '0px');
        $(wrapper + ' .fix-divider').css({
            'position': 'absolute',
            'overflow': 'hidden',
            'top': hcaption + 'px',
            'left': 0,
            'z-index': 803
        });
        $(wrapper + ' .fix-divider').css('top', '0px');

        //Poniendo bordes
        var casillaReferenciaWidth;
        $(wrapper + ' .fix-column table tbody tr').each(function (index, elem) {
            var primeraCasilla = $(elem).children()[0];
            casillaReferenciaWidth = $(elem).find(primeraCasilla);
            casillaReferenciaWidth.css({"border-right": "2px solid black"});
        })
        $(wrapper).scroll(function () {

            var vscroll = $(this).scrollTop();
            var hscroll = $(this).scrollLeft();


            var aux = 0;
            $(wrapper + ' .fix-column').css('left', (hscroll + aux) + 'px');
            $(wrapper + ' .fix-head').css('top', (vscroll + aux) + 'px');
            $(wrapper + ' .fix-divider').css({'left': (hscroll + aux) + 'px', 'top': (vscroll + aux) + 'px'});


        });
        var casillaReferencia = $(".fix-head " + classtable + " thead");
        var casillaReferenciaSeparador = $(".fix-divider " + classtable + " thead th:nth-child(1)");

        casillaReferenciaSeparador.removeClass("tb-acc");
        casillaReferenciaSeparador.css({
            "background-color": "#046666",
            "text-align": "center",
            "color": "white",
            "vertical-align": "middle"
        });

        /*	If the windows resize	*/
        var anchoRequerido = parseInt(casillaReferenciaWidth.css("width").replace("px", ""));

        $(wrapper + ' .fix-column').css('width', anchoRequerido + 2 + 'px');
        $(wrapper + ' .fix-head').css('height', casillaReferencia.height() + 2 + 'px');
        $(wrapper + ' .fix-divider').css({
            'height': casillaReferencia.height() + 'px',
            'width': anchoRequerido + 2 + 'px'
        });

    }
}

function goresize() {
    $('.fix-head').css('width', $('.fix-inner table').outerWidth(true) + 'px');
    $('.fix-head').css('height', $('.fix-inner table thead').outerHeight(true) + 'px');
}

function goresizeY(wrapper) {

    $(wrapper + ' .fix-head').css('width', $(wrapper + ' .fix-inner table').outerWidth(true) + 'px');
    $(wrapper + ' .fix-head').css('height', $(wrapper + ' .fix-inner table thead').outerHeight(true) + 'px');
}

function goresizeZ(wrapper) {

    $(wrapper + ' .fix-head').css('width', $(wrapper + ' .fix-inner table').outerWidth(true) + 'px');
    //$(wrapper+' .fix-head').css('height', $(wrapper+' .fix-inner table thead').outerHeight(true)+'px');

}

function convertirFechaNormal(reporteFecha) {
    if (reporteFecha) {
        var myDate = new Date(reporteFecha);
        var day = ("0" + myDate.getUTCDate()).slice(-2);
        var month = ("0" + (myDate.getUTCMonth() + 1)).slice(-2);
        var today = (day) + "-" + (month) + "-" + myDate.getUTCFullYear();
        return today
    } else {
        return ""
    }
}

function convertirFechaNormal2(reporteFecha) {
    if (reporteFecha) {
        var myDate = new Date(reporteFecha);
        var day = ("0" + myDate.getUTCDate()).slice(-2);
        var month = ("0" + (myDate.getUTCMonth() + 1)).slice(-2);
        var today = myDate.getUTCFullYear() + "-" + (month) + "-" + (day);
        return today
    } else {
        return ""
    }
}

function convertirFechaNormal3(reporteFecha) {
    if (reporteFecha) {
        var hoy = obtenerFechaActual();
        var myDate = new Date(reporteFecha);
        var day = ("0" + myDate.getUTCDate()).slice(-2);
        var month = ("0" + (myDate.getUTCMonth() + 1)).slice(-2);
        var fecha = (day) + "-" + (month) + "-" + myDate.getUTCFullYear();
        var fechaComparar = myDate.getUTCFullYear() + "-" + (month) + "-" + (day);
        var diferencia = restaFechas(hoy, fechaComparar);
        if (diferencia == 0) {
            fecha = "Hoy";
        }

        return fecha
    } else {
        return ""
    }
}

function convertirFechaInputNoUTC(reporteFecha) {
    if (reporteFecha != null) {
        var myDate = new Date(reporteFecha);
        var day = ("0" + myDate.getDate()).slice(-2);
        var month = ("0" + (myDate.getMonth() + 1)).slice(-2);
        var today = myDate.getFullYear() + "-" + (month) + "-" + (day);
        return today
    } else {
        return ""
    }
}

function convertirFechaInput(reporteFecha) {
    if (reporteFecha != null) {
        var myDate = new Date(reporteFecha);
        var day = ("0" + myDate.getUTCDate()).slice(-2);
        var month = ("0" + (myDate.getUTCMonth() + 1)).slice(-2);
        var today = myDate.getUTCFullYear() + "-" + (month) + "-" + (day);
        return today
    } else {
        return ""
    }
}

var oculto = false;

function toggleColumna(numColumna, idTabla) {
    if (oculto) {
        mostrarColumna(numColumna, idTabla)
    } else {
        ocultarColumna(numColumna, idTabla)
    }
}

function ocultarColumna(numColumna, idTabla) {
    $('#' + idTabla + ' td:nth-child(' + numColumna + '),#' + idTabla + ' th:nth-child(' + numColumna + ')').hide();
    oculto = true;
}

function mostrarColumna(numColumna, idTabla) {
    $('#' + idTabla + ' td:nth-child(' + numColumna + '),#' + idTabla + ' th:nth-child(' + numColumna + ')').show();
    oculto = false;
}


function llamarListaAyuda(list, ayudaId) {


    for (index = 0; index < list.length; index++) {

        if (list[index].ayudaId == ayudaId) {
            $("#divAyuda").html(list[index].textoAyuda);

        }
    }


}


function llenarEspacioAyuda() {
    $("#modalAyuda").modal('show');
    ayudaId = sessionStorage.getItem("ayudaId");
    llamarListaAyuda(listAyuda, ayudaId)

}


function ponerListaSugerida(inputId, lista, esInterno) {
    if (esInterno) {
        $("#" + inputId).autocomplete({
            source: lista,
            minLength: 0
        }).focus(function () {
            $(this).autocomplete('search', '');
        });
    }
    if (!esInterno) {
        $("#" + inputId).val("");
        $("#" + inputId).autocomplete({

            source: ""

        })
    }
}

function pasarDecimalPorcentaje(decimal, numDecimales) {
    var porc;
    var aux = decimal * 100;

    if (aux >= 0) {
        porc = aux.toFixed(numDecimales);

        return porc + "%";
    } else {
        return 0 + "%";
    }
}

function pasarDecimalValor(valor) {
    var porc;

    if (valor != null) {
        porc = valor.toFixed(2);

        return porc;
    } else {
        return "...";
    }
}

function setTextareaHeight(textareas) {
    textareas.each(function () {
        var textarea = $(this);
        textarea.css({"resize": "none"});
        if (!textarea.hasClass('autoHeightDone')) {
            textarea.addClass('autoHeightDone');
            textarea.css({"resize": "none"});
            var extraHeight = parseInt(textarea.css('padding-top')) + parseInt(textarea.css('padding-bottom')), // to set total height - padding size
                h = textarea[0].scrollHeight - extraHeight;

            // init height
            textarea.height('auto').height(h);

            textarea.bind('keyup', function () {

                textarea.removeAttr('style'); // no funciona el height auto
                textarea.css({"resize": "none"});
                h = textarea.get(0).scrollHeight - extraHeight;

                textarea.height(h + 'px'); // set new height
            });
        }
    })
}

function insertarImagenParaTabla(codigoImagen, altura, ancho) {
    var texto = "<img src='data:image/png;base64," + codigoImagen + "' " +
        "style='height:" + altura + ";width:" + ancho + "'>";

    return texto;
}

function insertarImagenParaTablaMovil(codigoImagen, altura, ancho) {
    var texto = "<img src='data:image/png;base64," + codigoImagen + "' " +
        "style='max-height:" + altura + ";max-width:" + ancho + "'>";

    return texto;
}

function resizeDivi() {
    var vpw = $(window).width();
    var vph = $(window).height();
    vph = vph - 240;
    $("#wrapper").css({
        "height": vph + "px"
    });
}

function resizeDivWrapper(wrapperId, marginPx) {
    var vpw = $(window).width();
    var vph = $(window).height();
    vph = vph - marginPx;
    $("#" + wrapperId).css({
        "height": vph + "px"
    });
}

//Funcion para evitar comillas
function nombrarInput(idInput, valor) {
    $("#" + idInput).attr("value", valor);

}

function calcularEdadAuto(fecha) {

    //calculo la fecha de hoy
    var hoy = new Date()
    //alert(hoy)

    //calculo la fecha que recibo
    //La descompongo en un array
    var array_fecha = fecha.split("-")
    //si el array no tiene tres partes, la fecha es incorrecta
    if (array_fecha.length != 3) {
        return false
    }

    //compruebo que los ano, mes, dia son correctos
    var ano;
    ano = parseInt(array_fecha[0]);


    var mes;
    mes = parseInt(array_fecha[1]);


    var dia;
    dia = parseInt(array_fecha[2]);


    //resto los años de las dos fechas
    var edad = hoy.getUTCFullYear() - ano - 1; //-1 porque no se si ha cumplido años ya este año

    //si resto los meses y me da menor que 0 entonces no ha cumplido años. Si da mayor si ha cumplido
    if (hoy.getMonth() + 1 - mes < 0) //+ 1 porque los meses empiezan en 0
    {
        return edad
    }
    if (hoy.getMonth() + 1 - mes > 0) {
        return edad + 1
    }

    //entonces es que eran iguales. miro los dias
    //si resto los dias y me da menor que 0 entonces no ha cumplido años. Si da mayor o igual si ha cumplido
    if (hoy.getUTCDate() - dia >= 0) {
        return edad + 1
    }

    return edad
}


function llevarTablaFondo(tablaId) {

    $("#" + tablaId).animate(
        {
            scrollTop:
            $('#' + tablaId)[0].scrollHeight
        }, 1000);

}


function comprobarNumEmpresasUnidades(numEmpresasUnidadesPermitadas, numEmpresasUnidadesActuales) {

    var acceso = true;

    if (parseInt(numEmpresasUnidadesPermitadas) > parseInt(numEmpresasUnidadesActuales)) {
        acceso = true;

    } else {

        acceso = false;
    }
    return acceso


}

function comprobarLicencia() {

}

function are_cookies_enabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return (cookieEnabled);
}


function toggleBuscadorJstree(idToggle) {
    $("#buscarTrabJstree").hide();

    if (idToggle == 1) {
        $("#buscarTrabJstree").show();
        $("#listTrabBuscar").hide();
        $("#cambiarBuscador").html(
            "	<i class='fa fa-arrow-circle-down ' ></i>	"
        );
        $("#cambiarBuscador").attr("onclick", "toggleBuscadorJstree(2)");
        $("#resultSearchTrab").hide();
    } else {
        $("#buscarTrabJstree").hide();
        $("#listTrabBuscar").show();
        $("#cambiarBuscador").html(
            "	<i class='fa fa-arrow-circle-up ' ></i>	"
        );
        $("#cambiarBuscador").attr("onclick", "toggleBuscadorJstree(1)");
        $("#resultSearchTrab").show();

    }
}

function toggleBuscadorAsistJstree(idToggle) {
    $("#buscarTrabAsisJstree").hide();

    if (idToggle == 1) {
        $("#buscarTrabAsisJstree").show();
        $("#listTrabAsistBuscar").hide();
        $("#cambiarBuscadorAsist").html(
            "	<i class='fa fa-arrow-circle-down ' ></i>	"
        );
        $("#cambiarBuscadorAsist").attr("onclick", "toggleBuscadorAsistJstree(2)");
        $("#resultSearchTrabAsist").hide();
    } else {
        $("#buscarTrabAsisJstree").hide();
        $("#listTrabAsistBuscar").show();
        $("#cambiarBuscadorAsist").html(
            "	<i class='fa fa-arrow-circle-up ' ></i>	"
        );
        $("#cambiarBuscadorAsist").attr("onclick", "toggleBuscadorAsistJstree(1)");
        $("#resultSearchTrabAsist").show();

    }

}

var trabajadoresEncontrados;
var numExcepcion;

function busquedaMasivaJstree(listTrabsFull, jstreeId, resultId, textAreaId, trabNodo) {
    $('#' + jstreeId).jstree("destroy");
    var texto = $("#" + textAreaId).val();
    var listExcel = texto.split('\n');
    var listTrabs = [];
    var validado = "";
    trabajadoresEncontrados = 0;
    for (index = 0; index < listTrabsFull.length; index++) {

        listTrabsFull[index].state.checked = false;

    }
    var trab = {};
    for (var int = 0; int < listExcel.length; int++) {


        var filaTexto = listExcel[int];
        if (filaTexto.trim().length < 1) {
            validado = "Existen filas vacias.";
            break;
        }

        trab.nombre = filaTexto;
        filaTexto = filaTexto.toUpperCase();
        marcarJstree(listTrabsFull, filaTexto, trabNodo);
        listTrabs.push(trab);


    }
    ;
    $('#' + jstreeId).jstree({
        "plugins": ["checkbox", "json_data", "search"],
        'checkbox': {
            "keep_selected_style": false,
            "tie_selection": false
        },
        'core': {
            'data': listTrabsFull
        }
    });
//	$('#'+jstreeId).jstree("open_all");

    $("#" + resultId).html(
        "Se seleccionaron " + trabajadoresEncontrados + " de " + listTrabs.length + " trabajador(es) ingresado(s)");
}

function busquedaMasivaJstreeException(listTrabsFull, jstreeId, resultId, textAreaId, trabNodo, listTrabsIncluido) {
    $('#' + jstreeId).jstree("destroy");
    var texto = $("#" + textAreaId).val();
    var listExcel = texto.split('\n');
    var listTrabs = [];
    var validado = "";
    trabajadoresEncontrados = 0;
    numExcepcion = [];
    for (index = 0; index < listTrabsFull.length; index++) {

        listTrabsFull[index].state.checked = false;

    }
    var trab = {};
    for (var int = 0; int < listExcel.length; int++) {


        var filaTexto = listExcel[int];
        if (filaTexto.trim().length < 1) {
            validado = "Existen filas vacias.";
            break;
        }

        trab.nombre = filaTexto;
        filaTexto = filaTexto.toUpperCase();
        marcarJstreeExcepcion(listTrabsFull, filaTexto, trabNodo, listTrabsIncluido);
        listTrabs.push(trab);


    }
    ;
    $('#' + jstreeId).jstree({
        "plugins": ["checkbox", "json_data", "search"],
        'checkbox': {
            "keep_selected_style": false,
            "tie_selection": false
        },
        'core': {
            'data': listTrabsFull
        }
    });
//	$('#'+jstreeId).jstree("open_all");
    var textoExcepcion = "";
    if (numExcepcion.length > 0) {
        textoExcepcion = "No estaban planificado(s) : "
        numExcepcion.forEach(function (val) {
            textoExcepcion += "<br>" + val.nombre
        });
    }
    $("#" + resultId).html(
        "Se seleccionaron " + trabajadoresEncontrados + " de " + listTrabs.length + " trabajador(es) ingresado(s)" +
        "<br> <label style='color : red'>" + textoExcepcion + " </label>");
}

function marcarJstreeExcepcion(listTrabs, nombreMarcar, trabNodo, listTrabsIncluido) {

    if (trabNodo == null) {
        trabNodo = "tra"
        for (var index = 0; index < listTrabs.length; index++) {
            var texto = listTrabs[index].text;
            var nombreTrab = texto.toUpperCase();
            if (listTrabs[index].id.substr(
                0, 3) == trabNodo && nombreTrab.indexOf(nombreMarcar) != -1) {
                listTrabs[index].state.checked = true;
                trabajadoresEncontrados = trabajadoresEncontrados + 1;
                //
                var isRegistrado = false;
                listTrabsIncluido.forEach(function (val) {
                    if (listTrabs[index].id.substr(
                        3, listTrabs[index].id.length) == val) {
                        isRegistrado = true;
                    }
                });
                if (!isRegistrado) {
                    numExcepcion.push({nombre: listTrabs[index].text})
                }
            }
        }
        ;

    }
    if (trabNodo == 1) {
        trabNodo = "nodo";
        for (var index = 0; index < listTrabs.length; index++) {

            if (listTrabs[index].id.substr(
                0, 4) == trabNodo && listTrabs[index].text.indexOf(nombreMarcar) != -1) {
                listTrabs[index].state.checked = true;

                trabajadoresEncontrados = trabajadoresEncontrados + 1;
            }
        }
        ;

    }


}

function marcarJstree(listTrabs, nombreMarcar, trabNodo) {
    if (trabNodo == null) {
        trabNodo = "tra"
        for (var index = 0; index < listTrabs.length; index++) {
            var texto = listTrabs[index].text;
            var nombreTrab = texto.toUpperCase();
            if (listTrabs[index].id.substr(
                0, 3) == trabNodo && nombreTrab.indexOf(nombreMarcar) != -1) {
                listTrabs[index].state.checked = true;
                trabajadoresEncontrados = trabajadoresEncontrados + 1;
            }
        }
        ;

    }
    if (trabNodo == 1) {
        trabNodo = "nodo";
        for (var index = 0; index < listTrabs.length; index++) {

            if (listTrabs[index].id.substr(
                0, 4) == trabNodo && listTrabs[index].text.indexOf(nombreMarcar) != -1) {
                listTrabs[index].state.checked = true;

                trabajadoresEncontrados = trabajadoresEncontrados + 1;
            }
        }
        ;

    }


}

function obtenerDatoEstadistico(dato) {
    if (dato == Infinity) {
        return 0;
    }
    if (dato > 0) {
        return parseFloat(dato.toFixed(2));
    } else {
        return 0
    }

}

function escribirFraccion(divContenedor, inicio, numerador, denominador) {
    var htmlFraccion = "<div class='eq-c'>"
        + inicio + "= "
        + "<div class='fraction'>"
        + "<span class='fup'>" + numerador + "</span>"
        + "<span class='bar'>/</span>"
        + "<span class='fdn'>" + denominador + "</span>"
        + "</div>"
        + "</div>";

    $("#" + divContenedor).html(htmlFraccion);

}

function escribirFraccionSola(divContenedor, numerador, denominador) {
    var htmlFraccion = "<div class='eq-c'>"
        + "<div class='fraction'>"
        + "<span class='fup'>" + numerador + "</span>"
        + "<span class='bar'>/</span>"
        + "<span class='fdn'>" + denominador + "</span>"
        + "</div>"
        + "</div>";

    $("#" + divContenedor).html(htmlFraccion);

}

function obtenerUTCDate(dateY) {
    var dateUTC = new Date(Date.UTC(
        dateY.getUTCFullYear(),
        dateY.getUTCMonth(),
        dateY.getUTCDate(),
        dateY.getUTCHours(),
        dateY.getUTCMinutes()) - 5 * 60 * 60 * 1000)
    return dateUTC;

}

function obtenerUTCDateFromInput(inputDate) {
    var dateY = inputDate.split("-");
    var dateUTC = new Date(Date.UTC(
        dateY[0],
        dateY[1] - 1,
        dateY[2]));
    return dateUTC;

}

function irFondoDiv(wrapperId) {

    $("#" + wrapperId).animate(
        {
            scrollTop:
            $('#' + wrapperId)[0].scrollHeight
        }, 1000);


}

function obtenerDatosBodyTablaEstandar(tablaId) {

    var fullDatosTabla = "";

    $(".fix-head #" + tablaId + " tbody tr").each(function (index) {
        $(this).children("td").each(function (index2) {
            var texto = $(this).text().replace("\t", "");

            texto = texto.replace("S/", "");
            texto = texto.replace("/", "//");
            if (index2 == 6 || index2 == 9) {
                switch ($(this).html()) {
                    case '<i style="color:green" class="fa fa-check-square"></i>':
                        texto = "Actualizado";
                        break;
                    case '<i style="color:red" class="fa fa-exclamation-circle"></i>':
                        texto = "Sin actualizar";
                        break;


                }


            }

            fullDatosTabla = fullDatosTabla + texto + "\t";
        })
        fullDatosTabla = fullDatosTabla + "\n"
    });
    return fullDatosTabla;


}

function obtenerDatosTablaEstandar(tablaId) {

    var fullDatosTabla = "";
    $(".fix-head #" + tablaId + " thead tr").each(function (index) {
        $(this).children("th").each(function (index2, elem) {

            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + $(elem).text().trim() + "\t";

            }
        })
        $(this).children("td").each(function (index2, elem) {

            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + $(elem).text().trim() + "\t";

            }
            //  console.log($(this).attr("colspan"))
        });
        fullDatosTabla = fullDatosTabla + "\n"
    });
    $(".fix-inner #" + tablaId + " tbody tr").each(function (index, ele) {
        $(this).children("td").each(function (index2, elem) {
            var texto = $(this).text().replace(/\t/g, "");

            texto = texto.replace(/\n/g, " ");
            texto = texto.replace("S/", "");
            texto = texto.replace("/", "//");
            if (index2 == 6 || index2 == 9) {
                if ($(this).html() == '<i style="color:green" class="fa fa-check-square"></i>') {
                    texto = "Actualizado"
                }
                if ($(this).html() == '<i style="color:red" class="fa fa-exclamation-circle"></i>') {
                    texto = "Sin actualizar"
                }
            }
            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + texto + "\t";
            }
        })
        if ($(ele).is(":visible")) {
            fullDatosTabla = fullDatosTabla + "\n"
        }
    });
    return fullDatosTabla;


}

function obtenerDatosTablaEstandarNoFija(tablaId) {

    var fullDatosTabla = "";
    $("#" + tablaId + " thead tr").each(function (index) {
        $(this).children("td").each(function (index2, elem) {
            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + $(this).text() + "\t";
            }


        });
        $(this).children("th").each(function (index2, elem) {
            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + $(this).text() + "\t";
            }

        });
        fullDatosTabla = fullDatosTabla + "\n"
    });
    $("#" + tablaId + " tbody tr").each(function (index) {
        $(this).children("td").each(function (index2, elem) {
            var texto = $(this).text().replace(/\t/g, "");
            texto = texto.replace("/", "//");
            texto = texto.replace(/\n/g, " ");
            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + texto.trim() + "\t";
            }
        })
        fullDatosTabla = fullDatosTabla + "\n"
    });

    return fullDatosTabla;


}

function obtenerDatosTablaEstadística(tablaId) {
    var fullDatosTabla = "";
    $("#" + tablaId + " thead tr").each(function (index) {
        $(this).children("td").each(function (index2, elem) {
            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + $(this).text() + "\t";
            }


        });
        $(this).children("th").each(function (index2, elem) {
            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + $(this).text() + "\t";
            }

        });
        fullDatosTabla = fullDatosTabla + "\n"
    });
    $("#" + tablaId + " tbody tr").each(function (index) {
        $(this).children("td").each(function (index2, elem) {
            var texto = $(this).text().replace("\t", "");
            texto = texto.replace("/", "//");
            if ($(elem).html() == '<i class="fa fa-check fa-2x" style="color:green"></i>') {
                texto = "1";
            }
            if ($(elem).html() == '<i class="fa fa-times fa-2x" style="color:red"></i>') {
                texto = "0";
            }

            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + texto + "\t";
            }
        })
        fullDatosTabla = fullDatosTabla + "\n"
    });
    return fullDatosTabla;
}

function obtenerDatosTablaTrabajadorEstandar(tablaId) {

    var fullDatosTabla = "";
    $(".fix-head #" + tablaId + " thead tr").each(function (index) {
        $(this).children("th").each(function (index2, elem) {

            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + $(elem).text().trim() + "\t";

            }
        })
        $(this).children("td").each(function (index2, elem) {

            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + $(elem).text().trim() + "\t";

            }
            //  console.log($(this).attr("colspan"))
        });
        fullDatosTabla = fullDatosTabla + "\n"
    });
    $(".fix-head #" + tablaId + " tbody tr").each(function (index) {
        $(this).children("td").each(function (index2, elem) {
            var texto = $(this).text().replace("\t", "");
            if (index2 == 1) {
                texto = "'" + texto;
            }
            texto = texto.replace("S/", "");
            texto = texto.replace("/", "//");
            if (index2 == 6 || index2 == 9) {
                if ($(this).html() == '<i style="color:green" class="fa fa-check-square"></i>') {
                    texto = "Actualizado"
                }
                if ($(this).html() == '<i style="color:red" class="fa fa-exclamation-circle"></i>') {
                    texto = "Sin actualizar"
                }
            }
            if ($(elem).is(":visible")) {
                fullDatosTabla = fullDatosTabla + texto + "\t";
            }
        })
        fullDatosTabla = fullDatosTabla + "\n"
    });
    return fullDatosTabla;


}


function traerTrabajdoresEmpresa() {


}

function verOpcionesGosst() {
    $("#options").toggle();
    var calendario = $("#scheduler_gosst");
    var field = $("fieldset");
    var logo = $("#logoMenu");
    calendario.css({"width": " calc(100%)", "left": "0px"});
    field.css({"width": "calc(100%)", "margin-left": "0px"});

    $("#menuExplicativo").hide();
    $("#graficoResumenModulo").hide();


}

var alertasOpen = false;

function verAlertasGosst() {
    var dataParam = {
        idCompany: sessionStorage.getItem("gestopcompanyid")
    };
    alertasOpen = !alertasOpen;
    $("#indAlertaGosst").remove();
    $("#logoMenu").append("<div id='indAlertaGosst' class='numAlertas'>!</div>");


    $("#menuAlertasGosst").remove();

    if (alertasOpen) {
        $("#logoMenu span img").attr("src", "../imagenes/logoVertical.png");
        $("body").append("<div id='menuAlertasGosst'>" +
            "" +
            "" +
            "</div>");
        $("#menuAlertasGosst").css({
            "height": $(window).height() - $("nav").height() - 2 + "px"
        });

    } else {

        $("#logoMenu span img").attr("src", "../imagenes/logoVerticalSel.png");
    }
    alertasFormacion(dataParam);
    alertasEpp(dataParam);
    alertasProcedimiento(dataParam);
}

//Logica  de alertas GOSST
function alertasProcedimiento(dataParam) {

    callAjaxPost(URL + '/procedimientoseguridad', dataParam,
        function (data) {
            var procedimientos = data.list;
            var procedimientosVigente = 0;
            var procedimientosNoVigente = 0;
            var procedimientosTotal = 0;

            $("#alertProc").remove();
            procedimientos.forEach(function (val, index) {

                if (val.estadoId == 2) {
                    procedimientosVigente += 1;
                }
                if (val.estadoId == 3) {
                    procedimientosNoVigente += 1;
                }


            });
            procedimientosTotal = procedimientosVigente + procedimientosNoVigente;
            var porc = procedimientosVigente / procedimientosTotal;
            var porcTexto = procedimientosVigente + "/" + procedimientosTotal;
            if (procedimientosTotal > 0) {
                $("#menuAlertasGosst").append("<div id='alertProc' class='alertGeneral'>" +
                    "<div class='tituloAlert'>Vigencia Documentos</div>" +
                    "</div>");
                $("#menuAlertasGosst #alertProc").append(
                    "<div class='alertSub'>" +
                    "<div class='nombreItem'>" +
                    "Total"
                    + "</div>" +
                    "<div class='indicadorAlerta " + comprobarFondoAceptable(porc) + "' " +
                    "style='width:" + ($("#menuAlertasGosst").width() * porc).toFixed(2) + "px'>" +
                    porcTexto + "</div>" +

                    "</div>"
                );
            } else {
                $("#menuAlertasGosst").append("<div id='alertProc' class='alertGeneral'>" +
                    "<div class='tituloAlert'>Vigencia Documentos (Sin registrar)</div>" +
                    "</div>");
            }
            $("#menuAlertasGosst").unblock();
        }, functionBloquearAlertas, {}, functionErrorAlerta("Procedimiento", "alertProc"));
}

function alertasEpp(dataParam) {

    callAjaxPost(URL + '/equiposeguridad', dataParam,
        function (data) {
            var epps = data.list;
            var equiposEmergenciaVigente = 0;
            var equiposEmergenciaNoVigente = 0;
            var equiposTotal = 0;
            if (epps.length > 0) {
                $("#alertEpp").remove();
                $("#alertEquip").remove();
                $("#menuAlertasGosst").append("<div id='alertEpp' class='alertGeneral'>" +
                    "<div class='tituloAlert'>Vigencia EPP´s &nbsp;<label>A</label><label>B</label><label>C</label>   </div>" +
                    "</div>");
            }
            epps.forEach(function (val, index) {
                if (val.equipoSeguridadTipoId == 1) {

                    var listAprobadosReal = dividirLista(val.listTrabVigentesAprobados);
                    var listAprobadosRetraso = dividirLista(val.listTrabRetrasadosAprobados);
                    listAprobadosRetraso = fusionNoRepeticion(listAprobadosReal, listAprobadosRetraso);
                    var listAprobadosIdeal = dividirLista(val.listTrabIdealesAprobados);
                    listAprobadosIdeal = fusionNoRepeticion(listAprobadosIdeal, listAprobadosRetraso);

                    var porcentajeCumplimiento = listAprobadosReal.length / val.numTrabAsignados;
                    var porcentajeCumplimientoTexto = devolverTextoPorcentajeAlerta(listAprobadosReal.length, val.numTrabAsignados);
                    var widthAlerta = ($("#menuAlertasGosst").width() * porcentajeCumplimiento).toFixed(2);

                    var porcentajeCumplimientoB = listAprobadosIdeal.length / val.numTrabAsignados;
                    var porcentajeCumplimientoBTexto = devolverTextoPorcentajeAlerta(listAprobadosIdeal.length, val.numTrabAsignados);
                    var widthAlertaB = ($("#menuAlertasGosst").width() * porcentajeCumplimientoB).toFixed(2);

                    var porcentajeCumplimientoC = listAprobadosRetraso.length / val.numTrabAsignados;
                    var porcentajeCumplimientoCTexto = devolverTextoPorcentajeAlerta(listAprobadosRetraso.length, val.numTrabAsignados);
                    var widthAlertaC = ($("#menuAlertasGosst").width() * porcentajeCumplimientoC).toFixed(2);
                    $("#menuAlertasGosst #alertEpp").append(
                        "<div class='alertSub'>" +
                        "<div class='nombreItem'>" +
                        val.equipoSeguridadNombre
                        + "</div>" +
                        "<div class='indicadorAlerta escenarioA " + comprobarFondoAceptable(porcentajeCumplimiento) + "' " +
                        "style='width:" + widthAlerta + "px'>A_" +
                        porcentajeCumplimientoTexto + "</div>" +
                        "<div class='indicadorAlerta  escenarioB " + comprobarFondoAceptable(porcentajeCumplimientoC) + "' " +
                        "style='width:" + widthAlertaC + "px'>B_" +
                        porcentajeCumplimientoCTexto + "</div>" +
                        "<div class='indicadorAlerta escenarioC " + comprobarFondoAceptable(porcentajeCumplimientoB) + "' " +
                        "style='width:" + widthAlertaB + "px'>C_" +
                        porcentajeCumplimientoBTexto + "</div> " +


                        "</div>"
                    );
                } else {
                    if (val.estadoId == 2) {
                        equiposEmergenciaVigente += 1;
                    }
                    if (val.estadoId == 3) {
                        equiposEmergenciaNoVigente += 1;
                    }
                }

            });
            equiposTotal = equiposEmergenciaVigente + equiposEmergenciaNoVigente;
            var porc = equiposEmergenciaVigente / equiposTotal;
            var porcTexto = equiposEmergenciaVigente + "/" + equiposTotal;
            if (equiposTotal > 0) {
                $("#menuAlertasGosst").append("<div id='alertEquip' class='alertGeneral'>" +
                    "<div class='tituloAlert'>Vigencia Equipos de Emergencia</div>" +
                    "</div>");
                $("#menuAlertasGosst #alertEquip").append(
                    "<div class='alertSub'>" +
                    "<div class='nombreItem'>" +
                    "Total"
                    + "</div>" +
                    "<div class='indicadorAlerta " + comprobarFondoAceptable(porc) + "' " +
                    "style='width:" + ($("#menuAlertasGosst").width() * porc).toFixed(2) + "px'>" +
                    porcTexto + "</div>" +

                    "</div>"
                );
            } else {
                $("#menuAlertasGosst").append("<div id='alertEquip' class='alertGeneral'>" +
                    "<div class='tituloAlert'>Vigencia Equipos de Emergencia (Sin registrar)</div>" +
                    "</div>");
            }
            $("#menuAlertasGosst").unblock();
        }, functionBloquearAlertas, {}, functionErrorAlerta("EPP", "alertEpp"));
}

function alertasFormacion(dataParam) {
    $(document).on("click", ".tituloAlert label", function () {
        $(this).siblings()
            .removeClass("escenarioSelect");
        $(this).addClass("escenarioSelect");
        var alertasGenerales = $(this).parents(".alertGeneral");
        var escenarioSelected = $(this).text();
        alertasGenerales.find(".alertSub .indicadorAlerta").hide();

        alertasGenerales.find(".alertSub .escenario" + escenarioSelected).show();


    });
    callAjaxPost(URL + '/capacitacion', dataParam,
        function (data) {
            var capacitaciones = data.list;
            if (capacitaciones.length > 0) {
                $("#alertCap").remove();
                $("#menuAlertasGosst").append("<div id='alertCap' class='alertGeneral'>" +
                    "<div class='tituloAlert'>Vigencia Formaciones&nbsp;<label>A</label><label>B</label><label>C</label>   </div>" +
                    "</div>");
            }
            capacitaciones.forEach(function (val, index) {
                var listAprobadosReal = dividirLista(val.listTrabVigentesAprobados);
                var listAprobadosRetraso = dividirLista(val.listTrabRetrasadosAprobados);
                listAprobadosRetraso = fusionNoRepeticion(listAprobadosReal, listAprobadosRetraso);
                var listAprobadosIdeal = dividirLista(val.listTrabIdealesAprobados);
                listAprobadosIdeal = fusionNoRepeticion(listAprobadosIdeal, listAprobadosRetraso);

                var porcentajeCumplimiento = listAprobadosReal.length / val.numTrabAsignados;
                var porcentajeCumplimientoTexto = devolverTextoPorcentajeAlerta(listAprobadosReal.length, val.numTrabAsignados);
                var widthAlerta = ($("#menuAlertasGosst").width() * porcentajeCumplimiento).toFixed(2);

                var porcentajeCumplimientoB = listAprobadosIdeal.length / val.numTrabAsignados;
                var porcentajeCumplimientoBTexto = devolverTextoPorcentajeAlerta(listAprobadosIdeal.length, val.numTrabAsignados);
                var widthAlertaB = ($("#menuAlertasGosst").width() * porcentajeCumplimientoB).toFixed(2);

                var porcentajeCumplimientoC = listAprobadosRetraso.length / val.numTrabAsignados;
                var porcentajeCumplimientoCTexto = devolverTextoPorcentajeAlerta(listAprobadosRetraso.length, val.numTrabAsignados);
                var widthAlertaC = ($("#menuAlertasGosst").width() * porcentajeCumplimientoC).toFixed(2);
                $("#menuAlertasGosst #alertCap").append(
                    "<div class='alertSub'>" +
                    "<div class='nombreItem'>" +
                    val.capacitacionNombre
                    + "</div>" +
                    "<div class='indicadorAlerta escenarioA " + comprobarFondoAceptable(porcentajeCumplimiento) + "' " +
                    "style='width:" + widthAlerta + "px'>A_" +
                    porcentajeCumplimientoTexto + "</div>" +

                    "<div class='indicadorAlerta  escenarioB " + comprobarFondoAceptable(porcentajeCumplimientoC) + "' " +
                    "style='width:" + widthAlertaC + "px'>B_" +
                    porcentajeCumplimientoCTexto + "</div>" +
                    "<div class='indicadorAlerta escenarioC " + comprobarFondoAceptable(porcentajeCumplimientoB) + "' " +
                    "style='width:" + widthAlertaB + "px'>C_" +
                    porcentajeCumplimientoBTexto + "</div> " +

                    "</div>"
                );
            });
            $("#menuAlertasGosst").unblock();

        }, functionBloquearAlertas, {}, functionErrorAlerta("Formacion", "alertCap"));
}

function functionBloquearAlertas() {
    $("#menuAlertasGosst").block({message: '<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});

}

function functionErrorAlerta(nombreModulo, alertDivId) {

    $("#menuAlertasGosst").unblock();
    $("#menuAlertasGosst").append("<div id='" + alertDivId + "' class='alertGeneral'>" +
        "<div class='tituloAlert'>" + nombreModulo + " (Sin acceso al módulo)</div>" +
        "</div>");

}

//fIN Logica  de alertas GOSST

function comprobarFondoAceptable(porcentaje) {
    var claseBarra = "";
    if (porcentaje <= 0.33) {
        claseBarra = "barraPeligrosa"
    }

    if (porcentaje > 0.33 && porcentaje <= 0.66) {
        claseBarra = "barraModerada"
    }
    if (porcentaje > 0.66) {
        claseBarra = "barraAceptable"
    }
    return claseBarra;

}

function fusionNoRepeticion(array1, array2) {
    var arrayFinal = [];
    array1.forEach(function (val, index) {
        arrayFinal.push(val);
    });

    array2.forEach(function (val1, index1) {
        if (arrayFinal.indexOf(val1) == -1) {
            arrayFinal.push(val1);
        }
    });
    return arrayFinal;
}


function devolverTextoPorcentajeAlerta(numerador, denominador) {
    return (denominador > 0 ? numerador + "/" + denominador : "Sin trabajadores asignados")
}


function dividirLista(lista) {
    return (lista != "" ?
        lista.split(",") : []);
}

/*Logica de presentacion Gosst*/
var fechaInicialPresentacion, fechaFinalPresentacion;

var diapositivasTotal = 18;
var listFullEventosPresentacion = [];
var listFullCapacitacionPresentacion = [],
    listFullEntregaEppPresentacion = [], listFullExamenPresentacion = [];
var listFullAuditoriasPresentacion = [], numRptaAudi = [];
var listFullInspeccionesPresentacion = [], numRptaIns = [];
var listFullIndicadoresAcc = [];
var listFullAccionMejora = [];
var listFullAccidentesPresentacion = [], listFullACSubPresentacion = [];

function verPresentacionGosst() {
    $(".fondoPresentacionGosst").remove();
    $(".diapositivaGosst").remove();
    $(".cerrarPresentacion").remove();

    var cierrePrese = "<div class='cerrarPresentacion'>X</div>";
    var diapositiva0 = "<div class='diapositivaGosst' id='diapositiva0'>" + "</div>";
    var rangoFechasHtml = "<form class='form-inline form-presentacion'>"
        + "<label>Desde:</label> <input type='date' "
        + "class='form-control'"
        + "id='fechaInicioPresentacion'"
        + "		value='2016-01-01'>"
        + "<br><br><label>Hasta:</label> "
        + "<input type='date'"
        + "class='form-control' id='fechaFinPresentacion'"
        + " value='2016-12-01'>"
        + "</form>";
    $("body").prepend("<div class='fondoPresentacionGosst'>" +
        "</div>" + cierrePrese + diapositiva0);

    $(".cerrarPresentacion").on("click", function () {
        $(".fondoPresentacionGosst").remove();
        $(".diapositivaGosst").remove();
        $(this).remove();
    });

    $(".fondoPresentacionGosst").after(diapositiva0);
    $("#diapositiva0").fadeIn(1000, function () {

        $(this).html("<div class='tituloPresentacion'>Informe – Comité de SST</div>" +
            rangoFechasHtml +
            "<br><button onclick='generarPresentacionGosst()' class='btn btn-success btn-presentacion'>Generar Presentación</button>");
    });


}

function generarPresentacionGosst() {

    fechaInicialPresentacion = $("#fechaInicioPresentacion").val();
    fechaFinalPresentacion = $("#fechaFinPresentacion").val();
    var flechaPresentacionDerecha = "<div class='flechaPresentacionDerecha'></div>";
    var flechaPresentacionIzquierda = "<div class='flechaPresentacionIzquierda'></div>";
    var imgRuedita = "<img src='../imagenes/gif/ruedita.gif'></img>";
    var mensajeCarga = '<div class="mensajePresentacion">Armando Presentacion GOSST <br>' + imgRuedita + '</div>';


    $("#diapositiva0").html(mensajeCarga);
    var mensajeTraerDiapositivas = "<div class='mensajePresentacion'>" +
        "Preparando Diapositivas<br>" +
        "<div class='barraLoadingDiapositivas'>" +
        "<div class='barrarCompletoDiapositivas'></div>" +
        "</div>" +
        "<div id='numDiapositivasMensaje'>0 de 11 " + imgRuedita + "</div>"
    "</div>";
    setTimeout(function () {
        $("#diapositiva0").html(mensajeTraerDiapositivas);
        llamarDatosNecesariosPresentacionGosst();
    }, 2000);


}

function iniciarPresentacionGosst() {
    if ($("#diapositiva1").length > 0) {
        $("#diapositiva0").hide();
        var rangoFechasHtml = "<form class='form-inline form-presentacion'>"
            + "<label>Desde:</label> <input type='date' "
            + "class='form-control'"
            + "id='fechaInicioPresentacion'"
            + "		value='2016-01-01'>"
            + "<br><br><label>Hasta:</label> "
            + "<input type='date'"
            + "class='form-control' id='fechaFinPresentacion'"
            + " value='2016-12-01'>"
            + "</form>";
        $("#diapositiva0").html("<div class='tituloPresentacion'>Informe – Comité de SST</div>" +
            rangoFechasHtml +
            "<br><button onclick='generarPresentacionGosst()' " +
            "class='btn btn-success btn-presentacion'>Generar Presentación</button>");

        $("#diapositiva1").show();
        diapositivasCargadas = 1;
    }


}

function cambiarDiapositiva(cambioDerecha) {
    var diapoAnterior = (diapositivasCargadas - 1);
    var diapoSiguiente = (diapositivasCargadas + 1);

    if (cambioDerecha) {
        if ($("#diapositiva" + diapositivasCargadas).length &&
            $("#diapositiva" + diapoAnterior).length)
            $("#diapositiva" + diapoAnterior).hide("slide", {direction: "left"}, 500, function () {
                $("#diapositiva" + diapositivasCargadas).show("slide", {direction: "right"}, 500, function () {
                    crearGraficoDiapositiva(diapositivasCargadas);
                });

            });

    } else {
        if ($("#diapositiva" + diapositivasCargadas).length &&
            $("#diapositiva" + diapoSiguiente).length)
            $("#diapositiva" + diapoSiguiente).hide("slide", {direction: "right"}, 800, function () {
                $("#diapositiva" + diapositivasCargadas).show("slide", {direction: "left"}, 800, function () {
                    crearGraficoDiapositiva(diapositivasCargadas);
                });

            });
    }
}

function cambiarBarraCarga(numDiaposAgregar) {
    var imgRuedita = "<img src='../imagenes/gif/ruedita.gif'></img>";
    diapositivasCargadas += numDiaposAgregar;
    $("#numDiapositivasMensaje").html(diapositivasCargadas + " de " + diapositivasTotal + " " + imgRuedita);

    $(".barrarCompletoDiapositivas").css({"width": 100 * (diapositivasCargadas / diapositivasTotal).toFixed(2) + "%"});
    if (diapositivasCargadas == diapositivasTotal) {
        setTimeout(function () {
            diapositivasCargadas = 0;
            iniciarPresentacionGosst();

        }, 1000);
    }

}

function llamarDatosNecesariosPresentacionGosst() {
    diapositivasCargadas = 0;
    cambiarBarraCarga(1);
    llamarDatosAcordeCodigo(1, function () {

        cambiarBarraCarga(1);
        llamarDatosAcordeCodigo(2, function () {
            cambiarBarraCarga(4);
            llamarDatosAcordeCodigo(3, function () {
                cambiarBarraCarga(2);
                llamarDatosAcordeCodigo(4, function () {
                    cambiarBarraCarga(1);
                    llamarDatosAcordeCodigo(5, function () {
                        cambiarBarraCarga(1);
                        llamarDatosAcordeCodigo(6, function () {
                            cambiarBarraCarga(1);
                            llamarDatosAcordeCodigo(7, function () {
                                cambiarBarraCarga(2);
                                llamarDatosAcordeCodigo(8, function () {
                                    cambiarBarraCarga(2);
                                    llamarDatosAcordeCodigo(9, function () {
                                        cambiarBarraCarga(3);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    })
}


function llamarDatosAcordeCodigo(idCodigo, functionSuccess) {

    var generarDiapositivaGosst = function (idDiapo, idgrafInside) {
        var diapo = "<div class='diapositivaGosst' id='diapositiva" + idDiapo + "'>" +

            "<div id='" + idgrafInside + "'  class='containerGraficoPresent'></div></div>";
        return diapo;
    };
    switch (idCodigo) {
        case 1:
            var dataParam = {
                empresaId: sessionStorage.getItem("gestopcompanyid"),
            };

            callAjaxPost(URL + '/scheduler', dataParam, function (data) {
                switch (data.CODE_RESPONSE) {
                    case "05":
                        functionSuccess();
                        listFullEventosPresentacion = data.list;
                        //////
                        var matrizContadoraEventos = [{
                            nombre: "Induccion",
                            numRetrasados: 0,
                            numImplementar: 0,
                            numCompletados: 0,
                            numAlertas: 0
                        },
                            {
                                nombre: "Formación",
                                numRetrasados: 0,
                                numImplementar: 0,
                                numCompletados: 0,
                                numAlertas: 0
                            },
                            {
                                nombre: "Evaluación médica",
                                numRetrasados: 0,
                                numImplementar: 0,
                                numCompletados: 0,
                                numAlertas: 0
                            },
                            {
                                nombre: "Actualización Documentos",
                                numRetrasados: 0,
                                numImplementar: 0,
                                numCompletados: 0,
                                numAlertas: 0
                            },
                            {
                                nombre: "Mantenimiento de equipos de emergencia",
                                numRetrasados: 0,
                                numImplementar: 0,
                                numCompletados: 0,
                                numAlertas: 0
                            },
                            {
                                nombre: "Inspección",
                                numRetrasados: 0,
                                numImplementar: 0,
                                numCompletados: 0,
                                numAlertas: 0
                            },
                            {
                                nombre: "Diagnóstico-Auditoría",
                                numRetrasados: 0,
                                numImplementar: 0,
                                numCompletados: 0,
                                numAlertas: 0
                            },
                            {
                                nombre: "Acciones de mejora",
                                numRetrasados: 0,
                                numImplementar: 0,
                                numCompletados: 0,
                                numAlertas: 0
                            },
                            {
                                nombre: "TOTAL",
                                numRetrasados: 0,
                                numImplementar: 0,
                                numCompletados: 0,
                                numAlertas: 0
                            }];
                        var asignarSegunEstado = function (objetoAsignar, objetoEvaluar) {
                            var fechaEvaluar = objetoEvaluar.start_date.substring(0, 10);

                            var estaEnRango = fechaEnRango(fechaEvaluar, fechaInicialPresentacion, fechaFinalPresentacion);
                            if (estaEnRango) {

                                switch (objetoEvaluar.estadoEvento) {
                                    case 1:
                                        objetoAsignar.numImplementar += 1;
                                        matrizContadoraEventos[8].numImplementar += 1;
                                        break;
                                    case 2:
                                        objetoAsignar.numCompletados += 1;
                                        matrizContadoraEventos[8].numCompletados += 1;
                                        break;
                                    case 3:
                                        objetoAsignar.numRetrasados += 1;
                                        matrizContadoraEventos[8].numRetrasados += 1;
                                        break;
                                    case 4:
                                        objetoAsignar.numAlertas += 1;
                                        matrizContadoraEventos[8].numAlertas += 1;
                                        break;
                                }
                            }

                        }
                        listFullEventosPresentacion.forEach(function (val, index) {
                            switch (val.tipoEvento) {
                                case 3:
                                    if (parseInt(val.linkAuxiliarId2) == 1) {
                                        asignarSegunEstado(matrizContadoraEventos[0], val);
                                    } else {
                                        asignarSegunEstado(matrizContadoraEventos[1], val);
                                    }
                                    break;
                                case 7:
                                    asignarSegunEstado(matrizContadoraEventos[2], val);
                                    break;
                                case 6:
                                    asignarSegunEstado(matrizContadoraEventos[3], val);
                                    break;
                                case 4:

                                    asignarSegunEstado(matrizContadoraEventos[4], val);

                                    break;
                                case 10:
                                    if (parseInt(val.linkAuxiliarId1) == 2) {
                                        asignarSegunEstado(matrizContadoraEventos[5], val);
                                    } else {
                                        asignarSegunEstado(matrizContadoraEventos[6], val);
                                    }
                                    break;
                                case 8:
                                    asignarSegunEstado(matrizContadoraEventos[7], val);
                                    break;
                                    break;

                            }
                        });
                        var cuerpoDetalle = "";
                        matrizContadoraEventos.forEach(function (val, index) {
                            var total = val.numImplementar + val.numCompletados + val.numRetrasados;
                            cuerpoDetalle = cuerpoDetalle + "<tr>" +
                                "<td>" + val.nombre + "</td>" +
                                "<td>" + val.numImplementar + "</td>" +
                                "<td>" + val.numCompletados + "</td>" +
                                "<td>" + val.numRetrasados + "</td>" +
                                "<td>" + val.numAlertas + "</td>" +
                                "<td>" + pasarDecimalPorcentaje(val.numCompletados / total) + "</td>" +
                                "</tr>"
                        });
                        var tablaDetalles = "<table class='table table-striped table-bordered table-hover' style='font-size:21px'>  " +
                            "<thead>" +
                            "<tr>" +
                            "<td class='tb-acc'>Tipo de Evento</td>" +
                            "<td class='tb-acc'>En fecha</td>" +
                            "<td class='tb-acc'>Realizados</td>" + "<td class='tb-acc'>Retrasados</td>" +
                            "<td class='tb-acc'>Alertas</td>" +
                            "<td class='tb-acc'>% de Avance</td>" +
                            "</tr>" +
                            "</thead>" +
                            "<tbody>" +
                            cuerpoDetalle +
                            "</tbody>" +
                            "" +
                            "</table>"
                        ////

                        var diapositiva1 = "<div class='diapositivaGosst' id='diapositiva1'>" +
                            "<div class='tituloDiapositiva'>" +
                            "Resumen de eventos planificados en el periodo</div><br>" +
                            tablaDetalles + "</div>";
                        $("body").prepend(diapositiva1);
                        break;
                    default:
                        console.log("Hubo un error al cargar calendario.");
                }
            }, function () {
            }, null, function () {
                console.log("no tiene permiso de calendario")
            });

            break;
        case 2:

            var dataParam5 = {
                idCompany: sessionStorage.getItem("gestopcompanyid"),
                fechaInicioPresentacion: fechaInicialPresentacion,
                fechaFinPresentacion: fechaFinalPresentacion
            };

            callAjaxPost(URL + '/capacitacion', dataParam5,
                function (data) {
                    switch (data.CODE_RESPONSE) {
                        case "05":
                            functionSuccess();
                            listFullCapacitacionPresentacion = data.list;
                            var diapositiva2 = generarDiapositivaGosst("2", "grafInd1");
                            var diapositiva3 = generarDiapositivaGosst("3", "grafInd2");
                            var diapositiva4 = generarDiapositivaGosst("4", "grafForm1");
                            var diapositiva5 = generarDiapositivaGosst("5", "grafForm2");


                            $("body").prepend(diapositiva2)
                                .prepend(diapositiva3)
                                .prepend(diapositiva4)
                                .prepend(diapositiva5)

                            break;
                        default:
                            console.log("Hubo un error al cargar auditorias.");
                    }
                }, function () {
                }, null,
                function () {
                    functionSuccess();
                    console.log("no tiene permiso de indicadores");
                });
            break;
        case 3:

            var dataParam1 = {
                idCompany: sessionStorage.getItem("gestopcompanyid"),
                fechaInicioPresentacion: fechaInicialPresentacion,
                fechaFinPresentacion: fechaFinalPresentacion
            };

            callAjaxPost(URL + '/examenmedico/programacion', dataParam1, function (data) {
                    switch (data.CODE_RESPONSE) {
                        case "05":
                            functionSuccess();
                            listFullExamenPresentacion = data.list;
                            var diapositiva6 = generarDiapositivaGosst("6", "grafExam1");
                            var diapositiva7 = generarDiapositivaGosst("7", "grafExam2");
                            $("body").prepend(diapositiva6)
                                .prepend(diapositiva7);
                            break;
                        default:
                            console.log("Hubo un error al cargar calendario.");
                    }
                }, function () {
                }, null,
                function () {
                    console.log("no tiene permiso de indicadores");
                    functionSuccess();
                });
            break;
        case 4:

            var dataParam1 = {
                idCompany: sessionStorage.getItem("gestopcompanyid"),
                fechaInicioPresentacion: fechaInicialPresentacion,
                fechaFinPresentacion: fechaFinalPresentacion
            };

            callAjaxPost(URL + '/equiposeguridad/entrega', dataParam1, function (data) {
                    switch (data.CODE_RESPONSE) {
                        case "05":
                            functionSuccess();
                            listFullEntregaEppPresentacion = data.list;

                            var diapositiva8 = generarDiapositivaGosst("8", "grafEpp1");
                            var diapositiva9 = generarDiapositivaGosst("9", "grafEpp2");
                            $("body")
                                .prepend(diapositiva8)
                                .prepend(diapositiva9);
                            break;
                        default:
                            console.log("Hubo un error al cargar calendario.");
                    }
                }, function () {
                }, null,
                function () {
                    console.log("no tiene permiso de indicadores");
                    functionSuccess();
                });
            break;
        case 5:

            var dataParam3 = {
                idCompany: sessionStorage.getItem("gestopcompanyid"),
                auditoriaClasifId: 1
            };

            callAjaxPost(URL + '/auditoria', dataParam3,
                function (data) {
                    switch (data.CODE_RESPONSE) {
                        case "05":
                            functionSuccess();
                            listFullAuditoriasPresentacion = data.list;
                            numRptaAudi = data.listRpta;
                            var diapositiva10 = generarDiapositivaGosst("10", "grafAudi");
                            $("body").prepend(diapositiva10)
                            break;
                        default:
                            console.log("Hubo un error al cargar auditorias.");
                    }
                }, function () {
                }, null,
                function () {
                    console.log("no tiene permiso de indicadores");
                    functionSuccess();
                });
            break;
        case 6:
            var dataParam4 = {
                idCompany: sessionStorage.getItem("gestopcompanyid"),
                auditoriaClasifId: 2
            };

            callAjaxPost(URL + '/auditoria', dataParam4,
                function (data) {
                    switch (data.CODE_RESPONSE) {
                        case "05":
                            functionSuccess();
                            listFullInspeccionesPresentacion = data.list;
                            numRptaIns = data.listRpta;
                            var diapositiva11 = generarDiapositivaGosst("11", "grafIns");
                            $("body").prepend(diapositiva11)
                            break;
                        default:
                            console.log("Hubo un error al cargar inspecciones.");
                    }
                }, function () {
                }, null,
                function () {
                    console.log("no tiene permiso de indicadores");
                    functionSuccess();
                });

            break;
        case 7:
            var dataParam41 = {
                empresaId: sessionStorage.getItem("gestopcompanyid"),
                mdfId: null,
                fechaInicio: fechaInicialPresentacion,
                fechaFin: fechaFinalPresentacion,
                tipoBusqueda: "3"

            };
            callAjaxPost(URL + '/estadistica', dataParam41,
                function (data) {
                    switch (data.CODE_RESPONSE) {
                        case "05":
                            functionSuccess();
                            listFullIndicadoresAcc = data.numacc;
                            var diapositiva12 = generarDiapositivaGosst("12", "grafEst");
                            $("body").prepend(diapositiva12)
                            break;
                        default:
                            console.log("Hubo un error al cargar auditorias.");
                    }
                }, function () {
                }, null,
                function () {
                    console.log("no tiene permiso de indicadores");
                    functionSuccess();
                });

            break;
        case 8:
            var dataParam41 = {
                idCompany: sessionStorage.getItem("gestopcompanyid")

            };

            callAjaxPost(URL + '/gestionaccionmejora', dataParam41,
                function (data) {
                    switch (data.CODE_RESPONSE) {
                        case "05":
                            functionSuccess();
                            listFullAccionMejora = data.list;
                            var diapositiva15 = generarDiapositivaGosst("15", "grafAccMejora1");
                            var diapositiva16 = generarDiapositivaGosst("16", "grafAccMejora2");
                            var diapositiva17 = generarDiapositivaGosst("17", "grafAccMejora3");
                            $("body").prepend(diapositiva15)
                            $("body").prepend(diapositiva16)
                            $("body").prepend(diapositiva17)
                            break;
                        default:
                            console.log("Hubo un error al cargar auditorias.");
                    }
                }, function () {
                }, null,
                function () {
                    console.log("no tiene permiso de indicadores");
                    functionSuccess();
                });

            break;
        case 9:
            var dataParam4 = {
                empresaId: sessionStorage.getItem("gestopcompanyid"),
                fechaInicio: fechaInicialPresentacion,
                fechaFin: fechaFinalPresentacion,
                mdfIdLista: [],
                mdfId: null,
                mdfTipoId: 1

            };

            callAjaxPost(URL + '/estadistica/graficos/piramide', dataParam4,
                function (data) {
                    switch (data.CODE_RESPONSE) {
                        case "05":
                            functionSuccess();
                            var diapositiva13 = generarDiapositivaGosst("13", "grafAcc1");
                            var diapositiva14 = generarDiapositivaGosst("14", "grafAcc2");
                            listFullAccidentesPresentacion = data.accTotal;
                            listFullACSubPresentacion = data.eventosTotal;
                            $("body").prepend(diapositiva13)
                            $("body").prepend(diapositiva14)

                            break;
                        default:
                            console.log("Hubo un error al cargar auditorias.");
                    }
                }, function () {
                }, null,
                function () {
                    console.log("no tiene permiso de indicadores");
                    functionSuccess();
                });


            break;

    }


}


function crearGraficoDiapositiva(idDiapositiva) {
    switch (idDiapositiva) {
        case 2:
            var listNombreInd = [], listNombreForm = [];
            var numTrabIndPlan = [], numTrabIndAsist = [], numTrabIndNoEval = [];
            var numTrabFormPlan = [], numTrabFormAsist = [], numTrabFormNoEval = [];
            var aprobadoInd = 0, noAprobadoInd = 0, noEvaluadoInd = 0;
            var aprobadoForm = 0, noAprobadoForm = 0, noEvaluadoForm = 0
            ;console.log(listFullCapacitacionPresentacion);
            listFullCapacitacionPresentacion.forEach(function (val, index) {
                if (val.capacitacionTipoId == 2) {
                    listNombreInd.push(val.capacitacionNombre);
                    numTrabIndPlan.push(dividirLista(val.listTrabPlaneadosRango).length);
                    numTrabIndAsist.push(dividirLista(val.listTrabAsistrango).length);
                    numTrabIndNoEval.push(dividirLista(val.listTrabNoEvalRango).length);
                    aprobadoInd += dividirLista(val.listTrabAprobRango).length
                    noAprobadoInd += dividirLista(val.listTrabNoAprobRango).length
                    noEvaluadoInd += dividirLista(val.listTrabNoEvalRango).length
                } else {
                    listNombreForm.push(val.capacitacionNombre);
                    numTrabFormPlan.push(dividirLista(val.listTrabPlaneadosRango).length);
                    numTrabFormAsist.push(dividirLista(val.listTrabAsistrango).length);
                    numTrabFormNoEval.push(dividirLista(val.listTrabNoEvalRango).length);
                    aprobadoForm += dividirLista(val.listTrabAprobRango).length
                    noAprobadoForm += dividirLista(val.listTrabNoAprobRango).length
                    noEvaluadoForm += dividirLista(val.listTrabNoEvalRango).length
                }
            });
            $('#grafInd1').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Indicadores de inducción de periodo',
                    style: {fontSize: "24px"}
                },
                xAxis: {
                    categories: listNombreInd,
                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                yAxis: [{
                    min: 0,
                    title: {
                        text: 'Trabajadores',
                        style: {fontSize: "22px"}
                    },
                    labels: {
                        style: {fontSize: "15px"}
                    }

                }],
                legend: {
                    shadow: false,
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                tooltip: {
                    shared: true,
                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                },
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Trabajadores planificados',
                    color: 'rgba(165,170,217,1)',
                    data: numTrabIndPlan,
                    pointPadding: 0.2,
                    pointPlacement: 0
                }, {
                    name: 'Trabajadores asistidos',
                    color: 'rgba(126,86,134,.9)',
                    data: numTrabIndAsist,
                    pointPadding: 0.3,
                    pointPlacement: 0
                }
                ]
            });
            break;
        case 3:
            var listNombreInd = [], listNombreForm = [];
            var numTrabIndPlan = [], numTrabIndAsist = [];
            var numTrabFormPlan = [], numTrabFormAsist = [];
            var aprobadoInd = 0, noAprobadoInd = 0, noEvaluadoInd = 0;
            var aprobadoForm = 0, noAprobadoForm = 0, noEvaluadoForm = 0;
            listFullCapacitacionPresentacion.forEach(function (val, index) {
                if (val.capacitacionTipoId == 2) {
                    listNombreInd.push(val.capacitacionNombre);
                    numTrabIndPlan.push(dividirLista(val.listTrabPlaneadosRango).length);
                    numTrabIndAsist.push(dividirLista(val.listTrabAsistrango).length);
                    aprobadoInd += dividirLista(val.listTrabAprobRango).length
                    noAprobadoInd += dividirLista(val.listTrabNoAprobRango).length
                    noEvaluadoInd += dividirLista(val.listTrabNoEvalRango).length
                } else {
                    listNombreForm.push(val.capacitacionNombre);
                    numTrabFormPlan.push(dividirLista(val.listTrabPlaneadosRango).length);
                    numTrabFormAsist.push(dividirLista(val.listTrabAsistrango).length);
                    aprobadoForm += dividirLista(val.listTrabAprobRango).length
                    noAprobadoForm += dividirLista(val.listTrabNoAprobRango).length
                    noEvaluadoForm += dividirLista(val.listTrabNoEvalRango).length
                }
            });
            $('#grafInd2').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Evaluación de trabajadores (Solo inducciones)',
                    style: {fontSize: "24px"}
                },
                tooltip: {

                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.percentage:.1f}%</b><br/>'

                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: ' {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                fontSize: "19px"
                            }
                        }
                    }
                },
                legend: {
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                series: [{
                    name: 'Trabajadores',
                    colorByPoint: true,
                    showInLegend: true,
                    data: [{
                        name: 'Aprobados',
                        y: aprobadoInd, color: "#088A4B",
                    }, {
                        name: 'Desaprobados',
                        y: noAprobadoInd, color: "#D44141",
                        sliced: true,
                        selected: true
                    }, {
                        name: 'No evaluados', color: "#848484",
                        y: noEvaluadoInd
                    }]
                }]
            });
            break;
        case 4:
            var listNombreInd = [], listNombreForm = [];
            var numTrabIndPlan = [], numTrabIndAsist = [];
            var numTrabFormPlan = [], numTrabFormAsist = [];
            var aprobadoInd = 0, noAprobadoInd = 0, noEvaluadoInd = 0;
            var aprobadoForm = 0, noAprobadoForm = 0, noEvaluadoForm = 0;
            listFullCapacitacionPresentacion.forEach(function (val, index) {
                if (val.capacitacionTipoId == 2) {
                    listNombreInd.push(val.capacitacionNombre);
                    numTrabIndPlan.push(dividirLista(val.listTrabPlaneadosRango).length);
                    numTrabIndAsist.push(dividirLista(val.listTrabAsistrango).length);
                    aprobadoInd += dividirLista(val.listTrabAprobRango).length
                    noAprobadoInd += dividirLista(val.listTrabNoAprobRango).length
                    noEvaluadoInd += dividirLista(val.listTrabNoEvalRango).length
                } else {
                    listNombreForm.push(val.capacitacionNombre);
                    numTrabFormPlan.push(dividirLista(val.listTrabPlaneadosRango).length);
                    numTrabFormAsist.push(dividirLista(val.listTrabAsistrango).length);
                    aprobadoForm += dividirLista(val.listTrabAprobRango).length
                    noAprobadoForm += dividirLista(val.listTrabNoAprobRango).length
                    noEvaluadoForm += dividirLista(val.listTrabNoEvalRango).length
                }
            });
            $('#grafForm1').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Indicadores de Formación de periodo (no incluye inducciones)',
                    style: {fontSize: "24px"}
                },
                xAxis: {
                    categories: listNombreForm,
                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                yAxis: [{
                    min: 0,
                    title: {
                        text: 'Trabajadores',

                        style: {fontSize: "22px"}

                    },
                    labels: {
                        style: {fontSize: "15px"}
                    }
                }],
                legend: {
                    shadow: false,
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                tooltip: {
                    shared: true,
                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'

                },
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Trabajadores planificados',
                    color: 'rgba(165,170,217,1)',
                    data: numTrabFormPlan,
                    pointPadding: 0.3,
                    pointPlacement: 0
                }, {
                    name: 'Trabajadores asistidos',
                    color: 'rgba(126,86,134,.9)',
                    data: numTrabFormAsist,
                    pointPadding: 0.4,
                    pointPlacement: 0
                }]
            });
            break;
        case 5:
            var listNombreInd = [], listNombreForm = [];
            var numTrabIndPlan = [], numTrabIndAsist = [];
            var numTrabFormPlan = [], numTrabFormAsist = [];
            var aprobadoInd = 0, noAprobadoInd = 0, noEvaluadoInd = 0;
            var aprobadoForm = 0, noAprobadoForm = 0, noEvaluadoForm = 0;
            listFullCapacitacionPresentacion.forEach(function (val, index) {
                if (val.capacitacionTipoId == 2) {
                    listNombreInd.push(val.capacitacionNombre);
                    numTrabIndPlan.push(dividirLista(val.listTrabPlaneadosRango).length);
                    numTrabIndAsist.push(dividirLista(val.listTrabAsistrango).length);
                    aprobadoInd += dividirLista(val.listTrabAprobRango).length
                    noAprobadoInd += dividirLista(val.listTrabNoAprobRango).length
                    noEvaluadoInd += dividirLista(val.listTrabNoEvalRango).length
                } else {
                    listNombreForm.push(val.capacitacionNombre);
                    numTrabFormPlan.push(dividirLista(val.listTrabPlaneadosRango).length);
                    numTrabFormAsist.push(dividirLista(val.listTrabAsistrango).length);
                    aprobadoForm += dividirLista(val.listTrabAprobRango).length
                    noAprobadoForm += dividirLista(val.listTrabNoAprobRango).length
                    noEvaluadoForm += dividirLista(val.listTrabNoEvalRango).length
                }
            });
            $('#grafForm2').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Evaluación de trabajadores (Sin incluir inducciones)',
                    style: {fontSize: "24px"}
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.percentage:.1f}%</b><br/>'

                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: ' {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                fontSize: "19px"
                            }
                        }
                    }
                },
                legend: {
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                series: [{
                    name: 'Trabajadores',
                    colorByPoint: true,
                    showInLegend: true,
                    data: [{
                        name: 'Aprobados',
                        y: aprobadoForm, color: "#088A4B"
                    }, {
                        name: 'Desaprobados',
                        y: noAprobadoForm,
                        sliced: true,
                        selected: true, color: "#D44141"
                    }, {
                        name: 'No evaluados',
                        y: noEvaluadoForm, color: "#848484"
                    }]
                }]
            });
            break;
        case 6:
            var aptos = [0, 0, 0], observados = [0, 0, 0], noAptos = [0, 0, 0], noEval = [0, 0, 0];
            listFullExamenPresentacion.forEach(function (val, index) {
                var listTrab = dividirLista(val.listTrabPlanificado);
                var listEval = dividirLista(val.listTrabEval);

                listTrab = listTrab.filter(function (val1, index1) {
                    if (listEval.indexOf(val1) == -1) {
                        return val1;
                    }
                });
                switch (val.tipoExamenMedicoId) {
                    case 1:
                        aptos[0] += val.numeroEvaluadoApto + val.numeroEvaluadoRestriccion;
                        observados[0] += val.numeroEvaluadoObservado;
                        noAptos[0] += val.numeroEvaluadoNoApto;
                        noEval[0] += (listTrab.length);
                        break;
                    case 2:
                        aptos[1] += val.numeroEvaluadoApto + val.numeroEvaluadoRestriccion;
                        observados[1] += val.numeroEvaluadoObservado;
                        noAptos[1] += val.numeroEvaluadoNoApto;
                        noEval[1] += (listTrab.length);
                        break;
                    case 3:
                        aptos[2] += val.numeroEvaluadoApto + val.numeroEvaluadoRestriccion;
                        observados[2] += val.numeroEvaluadoObservado;
                        noAptos[2] += val.numeroEvaluadoNoApto;

                        noEval[2] += (listTrab.length);
                        break;
                }

            });
            $('#grafExam1').highcharts({

                chart: {
                    type: 'column'
                },

                title: {
                    text: 'Indicadores de evaluaciones médicas en el periodo',

                    style: {fontSize: "24px"}

                },

                xAxis: {
                    categories: ['# de T. Nuevos', '# de T. Programados', '# de Ex Trabajadores'],
                    labels: {
                        style: {fontSize: "18px"}
                    }

                },
                legend: {
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: '# de Trabajadores',
                        style: {fontSize: "22px"}
                    },
                    labels: {
                        style: {fontSize: "15px"}
                    }
                },

                tooltip: {

                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'

                },

                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },

                series: [{
                    name: 'Aptos',
                    data: aptos,
                    stack: 'good'
                }, {
                    name: 'Observados',
                    data: observados,
                    stack: 'good'
                }, {
                    name: 'No aptos',
                    data: noAptos,
                    stack: 'bad'
                }, {
                    name: 'No evaluados',
                    data: noEval,
                    stack: 'bad'
                }]
            });
            break;
        case 7:
            var aptos = [0, 0, 0], observados = [0, 0, 0], noAptos = [0, 0, 0], noEval = [0, 0, 0];
            listFullExamenPresentacion.forEach(function (val, index) {
                switch (val.tipoExamenMedicoId) {
                    case 1:
                        aptos[0] += val.numeroEvaluadoApto + val.numeroEvaluadoRestriccion;
                        observados[0] += val.numeroEvaluadoObservado;
                        noAptos[0] += val.numeroEvaluadoNoApto;
                        noEval[0] += (val.numeroAsistentes - val.numeroEvaluado);
                        break;
                    case 2:
                        aptos[1] += val.numeroEvaluadoApto + val.numeroEvaluadoRestriccion;
                        observados[1] += val.numeroEvaluadoObservado;
                        noAptos[1] += val.numeroEvaluadoNoApto;
                        noEval[1] += (val.numeroAsistentes - val.numeroEvaluado);
                        break;
                    case 3:
                        aptos[2] += val.numeroEvaluadoApto + val.numeroEvaluadoRestriccion;
                        observados[2] += val.numeroEvaluadoObservado;
                        noAptos[2] += val.numeroEvaluadoNoApto;
                        noEval[2] += (val.numeroAsistentes - val.numeroEvaluado);
                        break;
                }

            });

            var aptosTotal = aptos[0] + aptos[1] + aptos[2];
            var obsTotal = observados[0] + observados[1] + observados[2];
            var noAptosTotal = noAptos[0] + noAptos[1] + noAptos[2];
            var noEvalTotal = noEval[0] + noEval[1] + noEval[2];
            $('#grafExam2').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Evaluación médica trabajadores',
                    style: {fontSize: "24px"}
                },
                tooltip: {

                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.percentage:.1f}%</b><br/>'

                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: ' {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                fontSize: "19px"
                            }
                        }
                    }
                },
                legend: {
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                series: [{
                    name: 'Trabajadores',
                    colorByPoint: true,
                    showInLegend: true,
                    data: [{
                        name: 'Aptos / Aptos con restricciones',
                        y: aptosTotal, color: "#088A4B"
                    }, {
                        name: 'Observados',
                        y: obsTotal, color: "#AEB404"
                    }, {
                        name: 'No aptos',
                        y: noAptosTotal, color: "#D44141"
                    }, {
                        name: 'No evaluados',
                        y: noEvalTotal, color: "#410C0C"
                    }]
                }]
            });
            break;
        case 8:
            var listEppsGraf = [
                {name: "Por Entregar", data: [], color: "#AEB404"},
                {name: "Entregados", data: [], color: "#4B8A08"}];
            var eppsListAux = [];
            var eppListIdAux = [];
            listFullEntregaEppPresentacion.forEach(function (val, index) {
                if (val.estadoImplementacion == 1) {
                    if (fechaEnRango(convertirFechaNormal2(val.fechaPlanificada),
                        fechaInicialPresentacion,
                        fechaFinalPresentacion)) {
                        var listaEpps = dividirLista(val.listEppId);
                        var listEppNombre = dividirLista(val.listEppNombre);

                        listaEpps.forEach(function (val1, index1) {
                            var sinIncluirEpp = true;
                            eppsListAux.forEach(function (val2, index2) {
                                if (val1 == val2.eppId) {
                                    sinIncluirEpp = false;
                                    val2.numPlan += val.numeroTrabajadores
                                }
                            });

                            if (sinIncluirEpp) {
                                eppsListAux.push({
                                    eppId: val1,
                                    nombre: listEppNombre[index1],
                                    numPlan: val.numeroTrabajadores,
                                    numEntrega: 0
                                })
                            }


                        });
                    }
                }
                if (val.estadoImplementacion == 2) {
                    if (fechaEnRango(convertirFechaNormal2(val.fechaEntrega),
                        fechaInicialPresentacion,
                        fechaFinalPresentacion)) {
                        var listaEpps = dividirLista(val.listEppId);
                        var listEppNombre = dividirLista(val.listEppNombre);

                        listaEpps.forEach(function (val1, index1) {
                            var sinIncluirEpp = true;
                            eppsListAux.forEach(function (val2, index2) {
                                if (val1 == val2.eppId) {
                                    sinIncluirEpp = false;
                                    val2.numEntrega += val.numeroTrabajadores
                                }
                            });

                            if (sinIncluirEpp) {
                                eppsListAux.push({
                                    eppId: val1,
                                    nombre: listEppNombre[index1],
                                    numPlan: 0,
                                    numEntrega: val.numeroTrabajadores
                                })
                            }


                        });

                    }
                }
            });
            var nombreEpps = [];
            eppsListAux.forEach(function (val, index) {
                nombreEpps.push(val.nombre);
                listEppsGraf[0].data.push(val.numPlan);
                listEppsGraf[1].data.push(val.numEntrega);
            });

            $('#grafEpp1').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Indicadores de seguimiento de entrega de EPP´s',
                    style: {fontSize: "24px"}
                },
                xAxis: {
                    categories: nombreEpps,
                    crosshair: true,
                    labels: {
                        style: {fontSize: "15px"}
                    }


                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '# de EPP´s',
                        style: {fontSize: "22px"}
                    },

                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                legend: {
                    shadow: false,
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                tooltip: {
                    shared: true,
                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'

                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: listEppsGraf
            });
            break;
        case 9:
            var nuevoTrab = 0, renovacion = 0, extravio = 0, robo = 0, otro = 0;
            listFullEntregaEppPresentacion.forEach(function (val, index) {
                if (val.estadoImplementacion == 2) {
                    if (fechaEnRango(convertirFechaNormal2(val.fechaEntrega),
                        fechaInicialPresentacion,
                        fechaFinalPresentacion)) {
                        switch (val.motivoId) {
                            case 1:
                                nuevoTrab += val.numeroEquipos
                                break;
                            case 2:
                                renovacion += val.numeroEquipos
                                break;
                            case 3:
                                extravio += val.numeroEquipos
                                break;
                            case 4:
                                robo += val.numeroEquipos
                                break;
                            case 5:
                                otro += val.numeroEquipos
                                break;
                        }
                    }
                }

            });
            $('#grafEpp2').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Equipos entregados por motivo',
                    style: {fontSize: "24px"}
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.percentage:.1f}%</b><br/>'

                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                fontSize: "19px"
                            }
                        }
                    }
                },
                legend: {
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                series: [{
                    name: 'EPP´s',
                    colorByPoint: true,
                    showInLegend: true,
                    data: [{
                        name: 'Nuevo Trabajador',
                        y: nuevoTrab, color: "#3D58A1"
                    }, {
                        name: 'Renovación',
                        y: renovacion, color: "#278A27"
                    }, {
                        name: 'Extravío',
                        y: extravio, color: "#5F247F"
                    }, {
                        name: 'Robos',
                        y: robo, color: "#7F3124"
                    }, {
                        name: "Otros",
                        y: otro, color: "#37211E"
                    }]
                }]
            });
            break;
        case 10:
            var auditoriasNombreEnRango = [], arrayCumple = [], arrayParcial = [], arrayNoCumple = [],
                arrayAcciones = [];
            var totalCumple = 0, totalParcial = 0, totalNoCumple = 0;
            listFullAuditoriasPresentacion.forEach(function (val, index) {
                if (val.estadoImplementacion == 2) {
                    if (fechaEnRango(convertirFechaNormal2(val.auditoriaFecha),
                        fechaInicialPresentacion,
                        fechaFinalPresentacion)) {
                        auditoriasNombreEnRango.push(val.auditoriaNombre);
                        totalCumple += (numRptaAudi[index].rptaSi + numRptaAudi[index].rptaRP);
                        arrayCumple.push(numRptaAudi[index].rptaSi + numRptaAudi[index].rptaRP);
                        totalParcial += (numRptaAudi[index].rptaParcial);
                        arrayParcial.push(numRptaAudi[index].rptaParcial);
                        totalNoCumple += (numRptaAudi[index].rptaNo);
                        arrayNoCumple.push(numRptaAudi[index].rptaNo);
                        arrayAcciones.push(val.accionesTotales);
                    }
                }

            });
            $("#grafAudi").highcharts({
                title: {
                    text: 'Indicadores de Diagnósticos realizados en el periodo',
                    style: {fontSize: "24px"}
                },
                xAxis: {
                    categories: auditoriasNombreEnRango,
                    labels: {
                        style: {fontSize: "18px"}
                    }


                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Requisitos',
                        style: {fontSize: "22px"}
                    },

                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                legend: {
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                labels: {
                    items: [{
                        html: 'Resumen de indicadores de cumplimiento',
                        style: {
                            left: '50px', fontSize: '20px',
                            top: '18px',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                        }
                    }]
                },
                series: [{
                    type: 'column',
                    name: 'Cumple Requisito',
                    data: arrayCumple,
                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }, {
                    type: 'column',
                    name: 'Cumple Parcialmente',
                    data: arrayParcial,
                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }, {
                    type: 'column',
                    name: 'No cumple',
                    data: arrayNoCumple,
                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }, {
                    type: 'spline',
                    name: 'Acciones de mejora generada',
                    data: arrayAcciones,
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'white'
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }, {
                    type: 'pie',
                    name: 'Resumen de indicadores de cumplimiento',
                    data: [{
                        name: 'Cumple Requisito',
                        y: totalCumple,
                        color: Highcharts.getOptions().colors[0] // Jane's color
                    }, {
                        name: 'Cumple Parcialmente',
                        y: totalParcial,
                        color: Highcharts.getOptions().colors[1] // John's color
                    }, {
                        name: 'No cumple',
                        y: totalNoCumple,
                        color: Highcharts.getOptions().colors[2] // Joe's color
                    }],
                    center: [100, 80],
                    size: 100,
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }]
            });
            break;
        case 11:
            var auditoriasNombreEnRango = [], arrayCumple = [], arrayParcial = [], arrayNoCumple = [],
                arrayAcciones = [];
            var totalCumple = 0, totalParcial = 0, totalNoCumple = 0;
            listFullInspeccionesPresentacion.forEach(function (val, index) {
                if (val.estadoImplementacion == 2) {
                    if (fechaEnRango(convertirFechaNormal2(val.auditoriaFecha),
                        fechaInicialPresentacion,
                        fechaFinalPresentacion)) {
                        auditoriasNombreEnRango.push(val.auditoriaNombre);
                        totalCumple += (numRptaIns[index].rptaSi + numRptaIns[index].rptaRP);
                        arrayCumple.push(numRptaIns[index].rptaSi + numRptaIns[index].rptaRP);

                        totalParcial += (numRptaIns[index].rptaParcial);
                        arrayParcial.push(numRptaIns[index].rptaParcial);

                        totalNoCumple += (numRptaIns[index].rptaNo);
                        arrayNoCumple.push(numRptaIns[index].rptaNo);

                        arrayAcciones.push(val.accionesTotales);
                    }
                }

            });
            $("#grafIns").highcharts({
                title: {
                    text: 'Indicadores de Inspecciones realizados en el periodo',
                    style: {fontSize: "24px"}
                },
                xAxis: {
                    categories: auditoriasNombreEnRango,
                    labels: {
                        style: {fontSize: "18px"}
                    }


                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Requisitos',
                        style: {fontSize: "22px"}
                    },

                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                legend: {
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },
                labels: {
                    items: [{
                        html: 'Resumen de indicadores de cumplimiento',
                        style: {
                            left: '50px', fontSize: '20px',
                            top: '18px',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                        }
                    }]
                },
                series: [{
                    type: 'column',
                    name: 'Cumple Requisito',
                    data: arrayCumple,

                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }, {
                    type: 'column',
                    name: 'Cumple Parcialmente',
                    data: arrayParcial,
                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }, {
                    type: 'column',
                    name: 'No cumple',
                    data: arrayNoCumple,
                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }, {
                    type: 'spline',
                    name: 'Acciones de mejora generada',
                    data: arrayAcciones,
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'white'
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }, {
                    type: 'pie',
                    name: 'Resumen de indicadores de cumplimiento',
                    data: [{
                        name: 'Cumple Requisito',
                        y: totalCumple,
                        color: Highcharts.getOptions().colors[0] // Jane's color
                    }, {
                        name: 'Cumple Parcialmente',
                        y: totalParcial,
                        color: Highcharts.getOptions().colors[1] // John's color
                    }, {
                        name: 'No cumple',
                        y: totalNoCumple,
                        color: Highcharts.getOptions().colors[2] // Joe's color
                    }],
                    center: [100, 80],
                    size: 100,
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                    }
                }]
            });
            break;
        case 12:
            var numEnfermedades = 0;
            var numAccidentes = 0;
            var numDias = restaFechas(fechaInicialPresentacion, fechaFinalPresentacion);
            var numHH = 0, numDiasDescanso = 0, numDanioMaterial = 0;
            listFullIndicadoresAcc.forEach(function (val, index) {
                switch (val.consultaId) {
                    case 1:
                        numAccidentes = val.indicador;
                        break;
                    case 2:
                        numEnfermedades = val.indicador;
                        break;
                    case 6:
                        numDiasDescanso = val.indicador;
                        break;
                    case 8:
                        numDanioMaterial = val.indicador;
                        break;
                    case 9:
                        numHH = val.indicador * 7.5 * numDias;
                        break;
                }

            });
            var cuerpoDetalle = ";";
            var indiceFrec = (numAccidentes * 1000000 / numHH).toFixed(2);
            var indiceSev = (numDiasDescanso * 1000000 / numHH).toFixed(2)
            var tablaDetalles = "<table class='table table-striped table-bordered table-hover' style='font-size:21px'>  " +
                "<thead>" +
                "<tr>" +
                "<td class='tb-acc'>Descripción</td>" +
                "<td class='tb-acc'>Indicador</td>" +

                "</tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr>" +
                "<td>HH Trabajadas en el periodo</td>" +
                "<td>" + numHH + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td># de enfermedades ocupacionales</td>" +
                "<td>" + numEnfermedades + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Índice de morbilidad (1’000,000 HH)</td>" +
                "<td>" + (numEnfermedades * 1000000 / numHH).toFixed(2) + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td># de accidentes</td>" +
                "<td>" + numAccidentes + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Días de descanso médico</td>" +
                "<td>" + numDiasDescanso + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Daños Materiales (S/)</td>" +
                "<td>" + numDanioMaterial + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Índice de frecuencia (1’000,000 HH)</td>" +
                "<td>" + indiceFrec + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>índice de severidad (1’000,000 HH)</td>" +
                "<td>" + indiceSev + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Índice de Accidentabilidad (1’000,000 HH)</td>" +
                "<td>" + (indiceSev * indiceFrec / 1000).toFixed(2) + "</td>" +
                "</tr>" +
                "</tbody>" +
                "" +
                "</table>"
            ////

            var diapositiva12 = "<div class='tituloDiapositiva'>" +
                "Resumen de eventos planificados en el periodo</div><br>" +
                tablaDetalles + "";
            $("#diapositiva12").html(diapositiva12);


            break;
        case 13:

            var campoAcc = [];
            var campoAccInc1 = [];
            var campoAccInc2 = [];
            var campoAccInc3 = [];
            var campoAccInc4 = [];
            var campoAccLeve = [];
            var campoInc = [];
            var campoActo = [];
            var campoCondicion = [];


            campoAcc = (["Accidentes Fatales", listFullAccidentesPresentacion[0].numAccFatal]);
            campoAccInc1 = (["Inc. Total Temporal", listFullAccidentesPresentacion[0].numAccIncap1]);
            campoAccInc2 = (["Inc. Parcial Temporal", listFullAccidentesPresentacion[0].numAccIncap2]);
            campoAccInc3 = (["Inc Parcial Permanente", listFullAccidentesPresentacion[0].numAccIncap3]);
            campoAccInc4 = (["Inc. Total Permanente", listFullAccidentesPresentacion[0].numAccIncap4]);
            campoAccLeve = (["Accidentes Leves", listFullAccidentesPresentacion[0].numAccLeve]);
            campoInc = (["Incidentes", listFullAccidentesPresentacion[0].numIncidente]);
            campoActo = (["Actos y Condiciones", listFullACSubPresentacion[0].numActos + listFullACSubPresentacion[0].numCond]);


            var datosTotal = [campoActo, campoAccLeve, campoAccInc4, campoAccInc3, campoAccInc2, campoAccInc1, campoAcc];

            $("#grafAcc1").highcharts({
                chart: {
                    type: 'pyramid',
                    marginRight: 100
                },
                title: {
                    text: 'Pirámide de Accidentabilidad en el periodo',
                    x: -50
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '<b style="font-size:20px">{point.name}</b><b style="font-size:18px"> ({point.y:,.0f})</b>',
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            softConnector: true
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: '#', colors: ["#E3650B", "#CE6418",
                        "#E34C0B", "#9C3509", "#C43737", "#B02828",
                        "#8C1919"],
                    data: datosTotal
                }]

            });

            break;
        case 14:

            var campoAcc = listFullAccidentesPresentacion[0].numAccFatal;
            var campoAccInc = listFullAccidentesPresentacion[0].numAccIncap1 +
                listFullAccidentesPresentacion[0].numAccIncap2 +
                listFullAccidentesPresentacion[0].numAccIncap3 +
                listFullAccidentesPresentacion[0].numAccIncap4;
            var campoAccLeve = listFullAccidentesPresentacion[0].numAccLeve;
            var campoInc = listFullAccidentesPresentacion[0].numIncidente;
            var campoActo = listFullACSubPresentacion[0].numActos;
            var campoCond = listFullACSubPresentacion[0].numCond;


            $("#grafAcc2").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Indicadores de accidentabilidad',
                    style: {fontSize: "22px"}
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cantidad',
                        style: {fontSize: "22px"}
                    },
                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                legend: {
                    enabled: false,
                    itemStyle: {
                        fontSize: "15px"
                    }
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                },

                series: [{
                    name: '------',
                    colorByPoint: true,
                    data: [{
                        name: 'Actos Subestándar',
                        y: campoActo,
                        drilldown: 'numAct'
                    }, {
                        name: 'Condiciones Subestándar',
                        y: campoCond,
                        drilldown: 'numCond'
                    }, {
                        name: 'Incidentes',
                        y: campoInc,
                        drilldown: 'numInc'
                    }, {
                        name: 'Accidentes Leves',
                        y: campoAccLeve,
                        drilldown: 'numLeve'
                    }, {
                        name: 'Accidentes Incapacitantes',
                        y: campoAccInc,
                        drilldown: 'numIncap'
                    }, {
                        name: 'Accidentes Fatales',
                        y: campoAcc,
                        drilldown: 'numFatal'
                    }]
                }],
                drilldown: {}

            });
            break;
        case 15:
            var noConformidad = 0, riesgo = 0, oportunidad = 0, observacion = 0, comite = 0;

            listFullAccionMejora.forEach(function (val, index) {
                console.log(val)
                switch (val.causaId) {
                    case 1:
                        noConformidad += 1;
                        break;
                    case 2:
                        riesgo += 1;
                        break;
                    case 3:
                        observacion += 1;

                        break;
                    case 4:
                        oportunidad += 1;
                        break;
                    case 5:
                        comite += 1;
                        break;
                }
            })
            $('#grafAccMejora1').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Motivo de origen de la solicitud de acción de mejora',
                    style: {fontSize: "24px"}
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.percentage:.1f}%</b><br/>'

                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: ' {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                fontSize: "19px"
                            }
                        }
                    }
                },
                legend: {
                    itemStyle: {
                        color: '#000000',
                        fontSize: '20px'
                    }
                },


                series: [{
                    name: 'Motivos',
                    colorByPoint: true,
                    showInLegend: true,
                    data: [{
                        name: 'No conformidad',
                        y: noConformidad, color: "#3D58A1"
                    }, {
                        name: 'Riesgo potencial',
                        y: riesgo, color: "#278A27"
                    }, {
                        name: 'Observación',
                        y: observacion, color: "#5F247F"
                    }, {
                        name: 'Oportunidad de mejora',
                        y: oportunidad, color: "#7F3124"
                    }, {
                        name: "Decisión del Comité",
                        y: comite, color: "#37211E"
                    }]
                }]
            });

            break;
        case 16:
            var numCorr = 0, numPrev = 0;
            listFullAccionMejora.forEach(function (val, index) {
                console.log(val);
                switch (val.solicitud.id) {
                    case 1:
                        numPrev += 1;
                        break;
                    case 2:
                        numCorr += 1;
                        break;
                }
            })
            $("#grafAccMejora2").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Indicadores de solicitud de acciones de mejora generadas en el periodo',
                    style: {fontSize: "22px"}
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cantidad',
                        style: {fontSize: "22px"}
                    },
                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                legend: {
                    enabled: false,
                    itemStyle: {
                        fontSize: "15px"
                    }
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                },

                series: [{
                    name: '------',
                    colorByPoint: true,
                    data: [{
                        name: 'Preventivas',
                        y: numPrev,
                        drilldown: 'numPrev'
                    }, {
                        name: 'Correctivas',
                        y: numCorr,
                        drilldown: 'numCorr'
                    }]
                }],
                drilldown: {}

            });
            break;
        case 17:
            var numCorr = 0, numPrev = 0;
            listFullAccionMejora.forEach(function (val, index) {

                if (val.declaracionCierre.trim().length > 0 || val.estadoId == 2) {
                    switch (val.solicitud.id) {
                        case 1:
                            numPrev += 1;
                            break;
                        case 2:
                            numCorr += 1;
                            break;
                    }
                }

            })
            $("#grafAccMejora3").highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Indicadores de solicitud de acciones de mejora cerradas en el periodo',
                    style: {fontSize: "22px"}
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cantidad',
                        style: {fontSize: "22px"}
                    },
                    labels: {
                        style: {fontSize: "18px"}
                    }
                },
                legend: {
                    enabled: false,
                    itemStyle: {
                        fontSize: "15px"
                    }
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size: 18px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:  <b style="font-size:20px">{point.y}</b><br/>'
                },

                series: [{
                    name: '------',
                    colorByPoint: true,
                    data: [{
                        name: 'Preventivas',
                        y: numPrev,
                        drilldown: 'numPrev'
                    }, {
                        name: 'Correctivas',
                        y: numCorr,
                        drilldown: 'numCorr'
                    }]
                }],
                drilldown: {}

            });
            break;
    }


}

function copiarAlPortapapeles(texto, divId) {
    var aux = "<textarea id='auxClip'>" + texto + "</textarea>";

    if (divId != null) {
        $("#" + divId).after(aux);
    } else {
        $("body").after(aux);
    }

    $("#auxClip").select();
    document.execCommand("copy");
    $("#auxClip").remove();
}

function resizeDivGosst(divId, contieneBuscador) {
    var factorBuscador = 0, factorEspecial = 0;
    if (contieneBuscador == 1) {
        factorBuscador = 40;
    }

    var vpw = $(window).width();
    var vph = $(window).height();
    vph = vph - 310 + factorMovil - factorBuscador;
    $("#" + divId).css({
        "height": vph + "px"
    });
}

function ifVerificarMovil(tipoMovil, param1, param2) {
    var widthAux = 0;
    switch (tipoMovil) {
        case 1:
            widthAux = 786
            break;
        case 2:
            widthAux = 1000
            break;
    }
    if ($(window).width() < widthAux) {
        return param1;
    } else {
        return param2;
    }
}


function defaultFor(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}

function findValueArray(array, arrayValueId, arrayValueName, valueId) {
    var valueReturn = "";
    array.every(function (val, index) {
        if (val[arrayValueId] == valueId) {
            valueReturn = val[arrayValueName];
            return true;
        } else {
            return true;
        }
    });

    return valueReturn;
}

function comprabarImagen(archivoNombre) {
    var isImage = false;
    var ext = ['gif', 'jpg', 'jpeg', 'png', ""];
    var archivoDividido = archivoNombre.split('.');
    var extension = "gif";
    if (archivoDividido.length > 1) {
        extension = archivoDividido.pop().toLowerCase()
    }
    for (var i = 0, n; n = ext[i]; i++) {
        if (n.toLowerCase() == extension) {
            isImage = true;
        }

    }
    return isImage


}

function convertirFechaTexto(inputFecha) {
    var fechaDate;
    if (!inputFecha) {
        fechaDate = null;
    } else {
        var mes1 = inputFecha.substring(5, 7) - 1;
        var fechatemp1 = new Date(inputFecha.substring(0, 4), mes1, inputFecha.substring(8, 10));

        fechaDate = fechatemp1;
    }


    return fechaDate;
}

function comprobarPorcentaje(e) {
    var keyCode = e.which ? e.which : e.keyCode;
    var valuePorc = parseFloat(e.srcElement.value);
    if (valuePorc > 100 || valuePorc < 0) {
        e.srcElement.value = 0;
        alert("Ingresar porcentaje valido");
        return false;
    }
}


function guardarEvidenciaAutoCalendar(archivoId, inputFileId, bitsMax, urlEvidencia,
                                      functionCallback, fieldEvidencia, tipoId) {
    fieldEvidencia = defaultFor(fieldEvidencia, "id");
    var archivoIdAux = archivoId;
    var inputFileImage = document.getElementById(inputFileId);
    var file = null;
    if (inputFileImage != null) {
        file = inputFileImage.files[0];
    }

    var data = new FormData();

    if (file) {
        if (file.size > bitsMax) {
            alert("Lo sentimos, solo se pueden subir archivos menores a " + bitsMax / 1000000 + " MB");
            functionCallback();
        } else {
            data.append("fileEvi", file);
            data.append("fecha", $("#dateActividad").val());

            data.append("fechaSubida", new Date());
            data.append(fieldEvidencia, archivoId);
            data.append("tipoId", tipoId);
            var url = URL + urlEvidencia;

            $.ajax({
                url: url,
                type: 'POST',
                xhrFields: {
                    withCredentials: true
                },
                contentType: false,
                data: data,
                processData: false,
                cache: false,
                success: function (data, textStatus, jqXHR) {

                    switch (data.CODE_RESPONSE) {
                        case "06":
                            sessionStorage.clear();
                            document.location.replace(data.PATH);
                            break;
                        default:
                            console.log("Prueba 1.2");
                            $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                            functionCallback();
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.unblockUI();
                    alert("Ups, tenemos problemas tecnicos. Intente más tarde. Error: "
                        + errorThrown);
                    console.log('xhRequest: ' + jqXHR + "\n");
                    console.log('ErrorText: ' + textStatus + "\n");
                    console.log('thrownError: ' + errorThrown + "\n");
                },
                // Custom XMLHttpRequest
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        // For handling the progress of the upload
                        myXhr.upload.addEventListener('progress', function (e) {
                            if (e.lengthComputable) {
                                var progreso = e.loaded / e.total;
                                console.log(pasarDecimalPorcentaje(progreso));
                                $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                $("#" + inputFileId).parent("span").append(
                                    "<label id='labelProgress'>"
                                    + pasarDecimalPorcentaje(progreso) + "</label>");

                            }
                        }, false);
                    }
                    return myXhr;
                }

            });
        }

    } else {
        console.log("No se encontro" + inputFileId)
        functionCallback();
    }

}

function comprobarFieInputExiste(inputFileId) {
    var existe = {};

    var inputFileImage = document.getElementById(inputFileId);
    var file = inputFileImage.files[0];
    if (file) {
        existe = {isValido: true, mensaje: ""};
    } else {
        existe = {isValido: false, mensaje: "La evidencia es obligatoria"};
    }

    return existe;
}

function guardarEvidenciaAuto(archivoId, inputFileId, bitsMax, urlEvidencia, functionCallback, fieldEvidencia, arrayDataAppend) {
    fieldEvidencia = defaultFor(fieldEvidencia, "id");
    var archivoIdAux = archivoId;
    var inputFileImage = document.getElementById(inputFileId);
    var file = inputFileImage.files[0];
    var data = new FormData();

    if (file) {
        if (file.name.indexOf(",") != -1) {
            alert("Por favor,ingrese un archivo sin comas (,)");
            $.unblockUI();

            return;
        }

        if (file.size > bitsMax) {
            alert("Lo sentimos, solo se pueden subir archivos menores a " + bitsMax / 1000000 + " MB");
            functionCallback();
        } else {
            var realizarCompresion = true;
            var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

            if (!filterType.test(file.type) || file.size < bitsMega * 1.5) {
                realizarCompresion = false;
            }

            if (realizarCompresion) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                fileReader.onload = function (event) {
                    var image = new Image();

                    image.onload = function () {
                        var canvas = document.createElement("canvas");
                        var context = canvas.getContext("2d");
                        var MAX_WIDTH = 800;
                        var MAX_HEIGHT = 600;
                        var width = image.width;
                        var height = image.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;

                        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

                        canvas.toBlob(function (blob) {
                            var fileFinal = new File([blob], file.name);

                            data.append("fileEvi", fileFinal);
                            data.append("fechaSubida", new Date());
                            data.append("fecha", $("#dateActividad").val());

                            if (arrayDataAppend) {
                                arrayDataAppend.forEach(function (val, index) {
                                    data.append(val.id, val.value);
                                });
                            }

                            data.append(fieldEvidencia, archivoId);

                            var url = URL + urlEvidencia;

                            $.ajax({
                                url: url, type: 'POST', beforeSend: function () {
                                    $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
                                }, xhrFields: {withCredentials: true}, contentType: false,
                                data: data, processData: false, cache: false,
                                success: function (data, textStatus, jqXHR) {
                                    switch (data.CODE_RESPONSE) {
                                        case "06":
                                            sessionStorage.clear();
                                            document.location.replace(data.PATH);

                                            break;

                                        default:
                                            console.log("Prueba 1.2");
                                            $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                            functionCallback(data);
                                    }
                                }, complete: function () {
                                    $.unblockUI();
                                }, error: function (jqXHR, textStatus, errorThrown) {
                                    $.unblockUI();
                                    alert("Estimado usuario, no excederse de 14mb o 30 caracteres del nombre del archivo");
                                    console.log('xhRequest: ' + jqXHR + "\n");
                                    console.log('ErrorText: ' + textStatus + "\n");
                                    console.log('thrownError: ' + errorThrown + "\n");
                                },
                                // Custom XMLHttpRequest
                                xhr: function () {
                                    var myXhr = $.ajaxSettings.xhr();

                                    if (myXhr.upload) {
                                        // For handling the progress of the upload
                                        myXhr.upload.addEventListener('progress', function (e) {
                                            if (e.lengthComputable) {
                                                var progreso = e.loaded / e.total;
                                                console.log(pasarDecimalPorcentaje(progreso));
                                                $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                                $("#" + inputFileId).parent("span").append("<label id='labelProgress'>" + pasarDecimalPorcentaje(progreso) + "</label>");
                                            }
                                        }, false);
                                    }

                                    return myXhr;
                                }
                            });
                        }, 'image/jpeg', 1);
                    }

                    image.src = event.target.result;
                };
            } else {
                data.append("fileEvi", file);
                data.append("fechaSubida", new Date());
                data.append("fecha", $("#dateActividad").val());

                if (arrayDataAppend) {
                    arrayDataAppend.forEach(function (val, index) {
                        data.append(val.id, val.value);
                    });
                }

                data.append(fieldEvidencia, archivoId);

                var url = URL + urlEvidencia;

                $.ajax({
                    url: url, type: 'POST', beforeSend: function () {
                        $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
                    }, xhrFields: {withCredentials: true}, contentType: false,
                    data: data, processData: false, cache: false,
                    success: function (data, textStatus, jqXHR) {
                        switch (data.CODE_RESPONSE) {
                            case "06":
                                sessionStorage.clear();
                                document.location.replace(data.PATH);

                                break;

                            default:
                                console.log("Prueba 1.2");
                                $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                functionCallback(data);
                        }
                    }, complete: function () {
                        $.unblockUI();
                    }, error: function (jqXHR, textStatus, errorThrown) {
                        $.unblockUI();
                        alert("Estimado usuario, no excederse de 14mb o 30 caracteres del nombre del archivo");
                        console.log('xhRequest: ' + jqXHR + "\n");
                        console.log('ErrorText: ' + textStatus + "\n");
                        console.log('thrownError: ' + errorThrown + "\n");
                    },
                    // Custom XMLHttpRequest
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();

                        if (myXhr.upload) {
                            // For handling the progress of the upload
                            myXhr.upload.addEventListener('progress', function (e) {
                                if (e.lengthComputable) {
                                    var progreso = e.loaded / e.total;
                                    console.log(pasarDecimalPorcentaje(progreso));
                                    $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                    $("#" + inputFileId).parent("span").append("<label id='labelProgress'>" + pasarDecimalPorcentaje(progreso) + "</label>");
                                }
                            }, false);
                        }

                        return myXhr;
                    }
                });
            }
        }
    } else {
        console.log("No se encontro " + inputFileId);
        functionCallback();
    }
}

function guardarEvidenciaMultipleAuto(archivoId, inputFileId, bitsMax, urlEvidencia, functionCallback, tipoId) {
    var archivoIdAux = archivoId;
    var inputFileImage = document.getElementById(inputFileId);
    var file = inputFileImage.files[0];
    var data = new FormData();

    if (file) {
        if (file.size > bitsMax) {
            alert("Lo sentimos, solo se pueden subir archivos menores a " + bitsMax / 1000000 + " MB");
            functionCallback();
        } else {
            data.append("fileEvi", file);
            data.append("id", archivoId);
            data.append("tipoId", parseInt(tipoId));
            console.log(data);
            var url = URL + urlEvidencia;

            $.ajax({
                url: url,
                type: 'POST',
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                data: data,
                processData: false,
                cache: false,
                success: function (data, textStatus, jqXHR) {

                    switch (data.CODE_RESPONSE) {
                        case "06":
                            sessionStorage.clear();
                            document.location.replace(data.PATH);
                            break;
                        default:

                            functionCallback();
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.unblockUI();
                    alert("Ups, tenemos problemas tecnicos. Intente más tarde. Error: "
                        + errorThrown);
                    console.log('xhRequest: ' + jqXHR + "\n");
                    console.log('ErrorText: ' + textStatus + "\n");
                    console.log('thrownError: ' + errorThrown + "\n");
                }
            });
        }

    } else {
        functionCallback();
    }

}

function crearFormEvidencia(idAux, esNuevo, containerHtmlId) {
    var buttonDescarga = "<button class='btn btn-success btnDescargar' style='float:left;margin-bottom:5px' id='btnDescargarFile" + idAux + "'>" +
        "<i class='fa fa-download' aria-hidden='true'></i>Descargar</button>";
    if (esNuevo) {
        buttonDescarga = "";
    }
    var inputEviA = buttonDescarga + "<div class='input-group'>" +
        "<label class='input-group-btn'>" +
        "<span class='btn btn-primary'>" +
        "<i class='fa fa-upload fa-lg'></i>   Subir Nuevo&hellip; <input style='display: none;'" +
        "type='file' name='fileEviCese' id='fileEvi" + idAux + "' >" +
        "</span>" +
        "</label>" +
        "<input type='text' id='inputEvi" + idAux + "' class='form-control' readonly>" +
        "</div>";
    if (containerHtmlId) {
        $(containerHtmlId).html(inputEviA);
        $("#fileEvi" + idAux).on("change", function () {
            $("#btnDescargarFile" + idAux).remove();
        });
    }


    return inputEviA;


}

function crearFormEvidenciaCallBack(idAux, esNuevo, options) {
    var buttonDescarga = "<button class='btn btn-success btnDescargar' style='float:left;margin-bottom:10px' id='btnDescargarFile" + idAux + "'>" +
        "<i class='fa fa-download' aria-hidden='true'></i>Descargar</button>";
    if (esNuevo) {
        buttonDescarga = "";
    }
    var inputEviA = buttonDescarga + "<div class='input-group'>" +
        "<label class='input-group-btn'>" +
        "<span class='btn btn-primary'>" +
        "<i class='fa fa-upload fa-lg'></i>   Subir Nuevo&hellip; <input style='display: none;'" +
        "type='file' name='fileEviCese' id='fileEvi" + idAux + "'  >" +
        "</span>" +
        "</label>" +
        "<input type='text' id='inputEvi" + idAux + "' class='form-control' readonly>" +
        "</div>";
    if (options != null) {
        $(options.container).html(inputEviA);
        $("#fileEvi" + idAux).on("change", function () {
            $("#btnDescargarFile" + idAux).remove();
        });
    }
    if (options != null) {
        $("#fileEvi" + idAux).on("change", function () {
            options.functionCall(idAux);
        });
    }


    return inputEviA;


}

function crearFormEvidenciaCompleta(options) {
    var mensajeAux = (options.mensajeAux == undefined ? "" : options.mensajeAux);
    var textImagen = "";

    if (options.isImagen) {
        textImagen = "accept = 'image/*' ";
    }

    var idAux = options.idAux;

    var buttonDescarga =
        "<label class='label-download input-group-btn' id='btnDescargarFile" + idAux + "'>" +
        "<span class='btn btn-primary'><i class='fa fa-download fa-lg'></i></span>" +
        "</label>";

    if (options.esNuevo) {
        buttonDescarga = "";
    }

    var inputEviA =
        "<div class='input-group'>" +
        "<label class='label-upload input-group-btn'>" +
        "<span class='btn btn-primary'>" +
        "<i class='fa fa-upload fa-lg'></i> Subir " +
        "<input " + textImagen + " style='display:none;' type='file' id='fileEvi" + idAux + "'>" +
        "</span>" +
        "</label>" +
        "<input type='text' id='inputEvi" + idAux + "' class='form-control' readonly>" +
        "" + buttonDescarga +
        "</div>" +
        (mensajeAux.length == 0 ? "" : "<label style='font-size:12px;'>" + mensajeAux + "</label>");
    ;

    $(options.container).html(inputEviA);

    $("#btnDescargarFile" + idAux).attr("onclick", "window.open('" + URL + options.descargaUrl + "','_blank')");

    $("#fileEvi" + idAux).on('fileselect', function (event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }
    });

    $("#inputEvi" + idAux).val(options.evidenciaNombre);

    $("#fileEvi" + idAux).on("change", function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');

        if (options.isImagen) {
            if (!comprabarImagen(label)) {
                alert("Sólo imágenes")

                return false;
            }
        }

        $("#btnDescargarFile" + idAux).remove();
        input.trigger('fileselect', [numFiles, label]);
        options.functionCall(idAux);
    });

    return inputEviA;
}

function agregarFiltroGosst(filtroIconoId, filtroMenuId, listFiltrar, idElem, nombreElem,
                            idToggle, idArrayGuardar, functionCallbackFiltro, tablaFija) {
    $(document).on("click", "#" + filtroIconoId, function () {
        $(".filtroMenuGosst").hide();
        var opcionesDiv = $("#" + filtroMenuId);
        opcionesDiv.remove();
        if (true) {

            $("body").append("<div class='filtroMenuGosst' id='" + filtroMenuId + "'></div>");
            opcionesDiv = $("#" + filtroMenuId);
            var topDiv = $(this).position().top;
            var leftDiv = $(this).position().left;
            var cssFiltro = {"top": 99, "left": "50%"};
            if (tablaFija) {
                cssFiltro = {"top": 199, "left": leftDiv + 30, "z-index": 1900};
            }
            opcionesDiv.css(cssFiltro);
            console.log(cssFiltro);
            listFiltrar.forEach(function (val, index) {
                var textoChecked = "checked";
                if (val.filtroActivado) {
                    textoChecked = "checked";
                } else {
                    textoChecked = "";
                }
                opcionesDiv.append("<div class='opcionFiltro'>" +
                    "<input type='checkbox' id='checkFiltro" + val[idElem] + "' " + textoChecked + "> " +
                    val[nombreElem] + "" +
                    "</div>");
            });
            opcionesDiv.append("<br><button class='btn btn-danger' ><i class='fa fa-times' aria-hidden='true'> </i>Cancelar </button>");
            opcionesDiv.find(".btn-danger").on("click", function () {
                $(".filtroMenuGosst").hide();
            });
            opcionesDiv.append(" <button class='btn btn-info'> <i class='fa  fa-pencil-square-o' aria-hidden='true'></i> </button>");
            opcionesDiv.find(".btn-info").on("click", function () {
                idToggle = !idToggle;
                opcionesDiv.find(".opcionFiltro input").each(function (index, elem) {

                    if (idToggle) {
                        $(elem).prop("checked", false);
                    } else {
                        $(elem).prop("checked", true);
                    }
                });
            });
            opcionesDiv.append(" <button class='btn btn-success' ><i class='fa fa-check' aria-hidden='true'></i>Listo </button>");
            opcionesDiv.find(".btn-success").on("click", function () {

                var idArrayGuardarAux = [];
                opcionesDiv.find(".opcionFiltro input").each(function (index, elem) {
                    if ($(elem).prop("checked")) {
                        var idAux = parseInt($(elem).prop("id").substr(11, 4));
                        idArrayGuardarAux.push(idAux);
                    }
                });

                functionCallbackFiltro(idArrayGuardarAux);
                $(".filtroMenuGosst").hide();
            });
        }

    });
}

function shuffleTest(array) {
    var m = array.length, t, i;
    var originalArray = array;
    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function colorPuntajeGosst(puntaje) {
    var color = "#bbb3b4";

    if (puntaje <= 0.66) {
        color = "#f79646";
    }

    if (puntaje <= 0.34) {
        color = "#c0504d";
    }

    if (puntaje > 0.66) {
        color = "#9bbb59";
    }

    return color;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function obtenerHoraActual(isWithZero) {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    if (isWithZero == 1) {
        s = "00";
    }

    return h + ":" + m + ":" + s;
}

function obtenerTiempoTranscurrido(fecha, hora) {
    var horaArray = hora.split(":");
    var fechaCompleta = new Date(fecha);
    fechaCompleta.setHours(horaArray[0]);
    fechaCompleta.setMinutes(horaArray[1]);
    var meses = 0, dias = 0, horas = 0, minutos = 0;
    var hoy = new Date();
    var diferencia = (hoy.getTime() - fechaCompleta.getTime()) / 1000;
    meses = Math.floor(diferencia / (86400 * 30))
    diferencia = diferencia - (86400 * 30 * meses)
    dias = Math.floor(diferencia / 86400)
    diferencia = diferencia - (86400 * dias)
    horas = Math.floor(diferencia / 3600)
    diferencia = diferencia - (3600 * horas)
    minutos = Math.floor(diferencia / 60)
    diferencia = diferencia - (60 * minutos)
    var textHace = "Hace ";
    var numHace = 0;
    var textFinal = "";
    if (meses > 0) {
        numHace = meses;
        textFinal = "mes"
        if (numHace > 1) {
            textFinal = "mese"
        }
    } else if (dias > 0) {
        numHace = dias;
        textFinal = "día"
    } else if (horas > 0) {
        numHace = horas;
        textFinal = "hora"
    } else {
        numHace = minutos;
        textFinal = "minuto"
    }

    return textHace + " " + numHace + " " + textFinal + (numHace == 1 ? "" : "s");
}

function verSolicitudesGosst() {
    irHacia(25)
}


function obtenerListaImportGosst(textareaId, numColumnas) {
    var textoInicial = $(textareaId).val();
    var texto = "";
    var prePreListExcelInicial = textoInicial.split("\t");
    var preListExcelInicial = [];
    prePreListExcelInicial.forEach(function (val, index) {
        var textoEspacio = (index != 0 && (index) % (numColumnas - 1) == 0 ? true : false)
        if (textoEspacio) {
            var celdaEspacio = val.split("\n")
            preListExcelInicial.push(celdaEspacio[0]);
            preListExcelInicial.push(celdaEspacio[1]);
        } else {
            preListExcelInicial.push(val);
        }


    });
    preListExcelInicial.forEach(function (val, index) {
        var textoEspacio = (index != 0 && (index + 1) % numColumnas == 0 ? "\n" : "\t");
        var textoPartido = val.split("\n");
        var textoIngreso = "";
        if (textoPartido.length > 1) {
            textoPartido.forEach(function (val1) {
                textoIngreso += val1 + " / ";
            })
        } else {
            textoIngreso = textoPartido[0];
        }
        if ((index + 1) != preListExcelInicial.length) {
            texto = texto + textoIngreso + "" + textoEspacio;
        } else {
            textoIngreso = textoPartido[0];
            texto = texto + textoIngreso;
        }


    });
    var listExcelInicial = texto.split("\n");
    var listExcel = [];
    listExcelInicial.forEach(function (val) {
        if (val.length > 0) {
            listExcel.push(val);
        }
    });
    return listExcel;
}

function agregarModalPrincipalUsuario(modalOptions, functionCallBack, isStatic) {
    $(".modal-backdrop").remove();
    $("#" + modalOptions.id).remove();
    $("body").append("<div class='modal' id='" + modalOptions.id + "' role='dialog'>" +
        "<div class='modal-dialog modal-dialog-centered' style='width:100%;    max-width: 1000px;'>" +

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

function crearModalPrincipalUsuario(modalOptions, functionCallBack, isStatic, isShow) {
   var classAux = (modalOptions.classAux != undefined?modalOptions.classAux:""),
       contenidoClassAux = (modalOptions.contenidoClassAux != undefined?modalOptions.contenidoClassAux:"modal-content");
   var btnCerrar = (modalOptions.btnCerrarHabilitado == undefined || modalOptions.btnCerrarHabilitado == 1?
      "<button type='button' class='close btn-cerrar-moderno' data-dismiss='modal'>&times;</button>":"");
   
    if (modalOptions.dontRemoveBack == null) {
        $(".modal-backdrop").remove();
    }

    $("#" + modalOptions.id).remove();

    var maxWidth = "650px";

    if (modalOptions.maxWidth != null) {
        maxWidth = modalOptions.maxWidth + "";
    }

    $("body").append(
        "<div class='modal "+classAux+"' id='" + modalOptions.id + "' role='dialog'>" +
        "<div class='modal-dialog modal-dialog-centered' style='width:100%;max-width:" + maxWidth + ";'>" +
        "<div class='"+contenidoClassAux+"'>" +
        "<div class='modal-header'>" +
         btnCerrar +
        "<h4 class='modal-title'>" + modalOptions.nombre + "</h4>" +
        "</div>" +
        "<div class='modal-body'>" +
        modalOptions.contenido +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>");

    $("#" + modalOptions.id).on('shown.bs.modal', functionCallBack);

    $('#' + modalOptions.id).modal({
        keyboard: true,
        show: (isShow ? isShow : false),
        backdrop: (isStatic ? "static" : true)
    });
}

function crearModalPrincipalUsuarioCentrado(modalOptions, functionCallBack, isStatic, isShow) {
    if (modalOptions.dontRemoveBack == null) {
        $(".modal-backdrop").remove();
    }

    $("#" + modalOptions.id).remove();

    var maxWidth = "50%";
    if (modalOptions.maxWidth != null) {
        maxWidth = modalOptions.maxWidth + "";
    }

    $("body").append(
        "<div class='modal fade' id='" + modalOptions.id + "' role='dialog' tabindex='-1' aria-hidden='true'>" +
        "<div class='modal-dialog modal-dialog-centered' style='width:" + maxWidth + "; top: 20%;'>" +
        "<div class='modal-content'>" +
        "<div class='modal-header'>" +
        "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
        "<h4 class='modal-title'>" + modalOptions.nombre + "</h4>" +
        "</div>" +
        "<div class='modal-body'>" +
        modalOptions.contenido +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
    );

    $("#" + modalOptions.id).on('shown.bs.modal', functionCallBack);

    $('#' + modalOptions.id).modal({
        keyboard: true,
        show: (isShow ? isShow : false),
        backdrop: (isStatic ? "static" : true)
    });
}

function obtenerSubPanelModuloGeneral(val) {
    var estiloDefault = "";
    if (val.inputForm == "" && val.sugerencia == "" && val.label == "") {
        estiloDefault = "    border-top: 1px solid #a5aaae;"
    }
    if (val.lineaFull) {
        return "<div class='form-group row " + val.clase + "' style='text-align : center;" + estiloDefault + "'>" +
            "<div class='col-sm-12' id='" + val.divContainer + "'>" +
            " " + val.inputForm +
            "</div>" +
            "</div>"
    }
    return "<div class='form-group row " + val.clase + "' style='" + estiloDefault + "'>" +
        " <label for='colFormLabel' class='col-sm-4 col-form-label'>" + val.label + "</label>" +
        "<div class='col-sm-8' id='" + val.divContainer + "'>" +
        " " + val.inputForm +
        "<small>" + val.sugerencia + " </small>" +
        "</div>" +
        "</div>";
}

function obtenerSubPanelModuloGeneralMensajesUx(val, count) {
    var estiloDefault = "";
    if (val.inputForm == "" && val.sugerencia == "" && val.label == "") {
        estiloDefault = "    border-top: 1px solid #a5aaae;"
    }

    if (count == 1) {
        return "<div class='form-group row " + val.clase + "' style='" + estiloDefault + "'>" +
            "<label for='colFormLabel' class='col-sm-2 col-form-label'>" + val.label + "</label>" +
            "<div class='col-sm-10' id='" + val.divContainer + "'>" +
            " " + val.inputForm +
            "<small>" + val.sugerencia + " </small>" +
            "</div>" +
            "</div>";
    } else {
        return "<div class='form-group row " + val.clase + "' style='" + estiloDefault + "'>" +
            "<label for='colFormLabel' class='col-sm-2 col-form-label'>" + val.label + "</label>" +
            "<div class='col-sm-8' id='" + val.divContainer + "'>" +
            " " + val.inputForm +
            "<small>" + val.sugerencia + " </small>" +
            "</div>" +
            "</div>"
    }
}

function agregarModalPrincipalColaboradorGeneral(modalOptions, functionCallBack, isStatic) {
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

function igualarStringBuscar(string) {
    var nuevoString = "";
    nuevoString = string.trim().toLowerCase();
    nuevoString = nuevoString.replace("ú", "u");
    nuevoString = nuevoString.replace("ó", "o");
    nuevoString = nuevoString.replace("í", "i");
    nuevoString = nuevoString.replace("é", "e");
    nuevoString = nuevoString.replace("á", "a");

    return nuevoString;
}

function crearButtonDownload(purl) {
    return "<a class='efectoLink' target='_blank' href='" + URL + purl + "'>" +
        "<i class='fa fa-download'></i>Descargar</a>";

}

function crearButtonExcel(purl) {
    return "<a class='efectoLink' target='_blank' href='" + URL + purl + "'>" +
        "<i class='fa fa-file-excel-o'></i>Descargar</a>";

}

var listHistorialRegistro = [];

function verHistorialRegistro(tipoId, registroId) {
    var contenido = "" +
        "" +
        "<div class='wrapper' id='wrapperHistorial'>" +
        "<table class='table table-striped table-bordered table-hover table-fixed' id='tblHistorialRegistro'>" +
        "<thead>" +
        "<tr>" +
        "<td class='tb-acc' style='width: 100px'>N°</td>" +
        "<td class='tb-acc' style='width: 120px'>Coordenadas</td>" +
        "<td class='tb-acc' style='width: 170px'>Fecha</td>" +
        "<td class='tb-acc' style='width: 170px'>Usuario</td>" +
        "<td class='tb-acc' style='width: 170px'>Rol en empresa</td>" +
        "<td class='tb-acc' style='width: 170px'>Tipo de registro</td>" +
        "<td class='tb-acc' style='width: 170px'>Acción</td>" +
        "<td class='tb-acc' style='width: 200px'>Detalle</td>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>" +
        "</table>" +
        "</div>";
    var modalOptions = {
        id: "modalHistorialRegistro",
        dontRemoveBack: 1,
        contenido: contenido,
        nombre: "Historial Registro",
        maxWidth: "90%"
    }
    crearModalPrincipalUsuario(modalOptions, function () {
    }, false, true);
    resizeDivWrapper("wrapperHistorial", 180)
    var dataParam = {
        empresaId: getSession("gestopcompanyid"),
        registroId: registroId,
        tipoRegistro: {id: tipoId}
    };
    callAjaxPost(URL + "/historial/registro",
        dataParam, function (data) {
            listHistorialRegistro = data.list;
            listHistorialRegistro.forEach(function (val, index) {
                var nombreDetalle = "";
                if (val.tipoAccesoUsuario.id == 0) {
                    nombreDetalle = "<br>" + val.detalleUsuario;
                }
                var textoCoord = "Sin registrar";
                if (val.posicion.x != 0) {
                    textoCoord = "Lat: " + val.posicion.x.toFixed(7) + "<br>" +
                        "Long: " + val.posicion.y.toFixed(7);
                }

                $("#tblHistorialRegistro").append("<tr id='regHist" + val.id + "'>" +
                    "<td>" + (index + 1) + "</td>" +
                    "<td>" + textoCoord + "</td>" +
                    "<td>" + val.fechaTexto + "</td>" +
                    "<td>" + val.usuario.userName + nombreDetalle + "</td>" +
                    "<td>" + val.tipoAccesoUsuario.nombre + "</td>" +
                    "<td>" + val.tipo.nombre + "</td>" +
                    "<td>" + val.accionRegistro.nombre + "</td>" +
                    "<td>" + val.detalleRegistro + "</td>" +
                    "" +
                    "</tr>");
            });

        });

}

var posicionX = 0.0;
var posicionY = 0.0;

function getLocation(functionCallBack) {
    if (navigator.geolocation
        && (getSession("gestopcompanyid") == "154" ||
            getSession("gestioncompanyid") == "467")) {

        navigator.geolocation.getCurrentPosition(function (posicion) {
            posicionX = posicion.coords.latitude;
            posicionY = posicion.coords.longitude;
            if (functionCallBack != null) {
                functionCallBack();
            }
        }, function () {
            if (functionCallBack != null) {
                functionCallBack();
            }
        });
    } else {
        if (functionCallBack != null) {
            functionCallBack();
        }
        //alert( "Geolocation no soportada ");
    }
}

var parteFinalModal;

var listOpcionesMensajeUx=[
    {id:1,icono:"fa-check-square",color:"color:green;"},{id:2,icono:"fa-times-circle-o",color:"color:red;"},
    {id:3,icono:"fa-exclamation-triangle",color:"color:#FFEF00;"},{id:4,icono:"fa-hand-o-right",color:"color:black;"},
    {id:5,icono:"fa-ambulance",color:"color:red;"},{id: 6,icono:"fa-thumbs-up",color:"color:green;"},
    {id:7,icono:"fa-hand-o-right",color:"color:#FFEF00;"},{id:8,icono:"fa-hand-paper-o",color:"color:red;"},
    {id:9,icono:"fa-commenting",color:"color:#FFEF00;"},{id:10,icono:"fa-info",color:"color:black;"}
];

function mensajesUx(mensajeUx,opcionIcono,nombreFuncion,parteFinalId){
    $("#modalMensajeUx"+parteFinalId).remove();

    nombreFuncion = (nombreFuncion == ""?"ocultarMensajesUx()":nombreFuncion);

    var icono,color;
    parteFinalModal = parteFinalId;

    listOpcionesMensajeUx.forEach(function(val){
        if(parseInt(opcionIcono) == val.id) {
            icono = val.icono;color = val.color;
        }
    });

    var contenido = "";

    var listContenido = [];

    if(![3,9].includes(opcionIcono)){
        if(opcionIcono == 10){
            listContenido.push({anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<h4 style='text-align:left;'>"+mensajeUx+"</h4>"});
        }else{
            listContenido.push({anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:([5,6,7,8].includes(opcionIcono)?"<br><br>":"") +
                 "<i class='fa "+icono+"' style='font-size:"+([5,6,7,8].includes(opcionIcono)?"60px":"40px")+";" +
                  color+"float:right;' aria-hidden='true'>"+"</i>",
                inputForm:"<h4 style='text-align:"+([5,6,7,8].includes(opcionIcono)?"left":"center")+";'>"+mensajeUx+"</h4>"});
        }

        listContenido.push({label:"",
            inputForm:"<button id='btnDevolverValor"+parteFinalId+"' class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
			                  "type='button' onclick='"+nombreFuncion+"'>" +
                          "<i class='fa fa-check-circle'></i> Aceptar" +
                      "</button>"});
    }else{
        listContenido=[
            {anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"<i class='fa "+icono+"' style='font-size:40px;"+color+"float:right;' aria-hidden='true'></i>",
             inputForm:"<h4 style='text-align:center;'>"+mensajeUx+"</h4>",divContainer:""},
            {label:"<button id='btnRegresarPrevio"+parteFinalId+"' class='btn btn-danger' type='button' " +
                           "style='font-size:18px;' onclick='ocultarMensajesUx()'>" +
                       "<i class='fa fa-times'></i> "+(opcionIcono == 3?"Cancelar":"No") +
                   "</button>",
             inputForm:"<button id='btnDevolverValor"+parteFinalId+"' class='btn btn-success' type='button' " +
                               "style='float:right;font-size:18px;' onclick='"+nombreFuncion+"'>" +
                           "<i class='fa fa-check-circle'></i> "+(opcionIcono == 3?"Aceptar":"Sí") +
                       "</button>"}
		];
    }

    listContenido.forEach(function (val) {
        contenido += obtenerSubPanelModuloVersionTres(val);
    });

    var modalOptions={
        id:"modalMensajeUx"+parteFinalId,nombre:"<i class='fa fa-bell'></i> Notificación <br>",
		contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    };

    if(![3,9].includes(opcionIcono)){
        crearModalPrincipalUsuario(modalOptions,function(){},false);
    }else{
        crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    }

    $("#modalMensajeUx"+parteFinalId).modal("show");
}

// //////////autor: (AntoniTito2) Tema: validar Terminos y condiciones.
function mensajesUxNotificacionCompromiso(mensajeUx, opcionIcono, nombreFuncion, parteFinalId) {

    var count = 0;
    var icono, color;
    parteFinalModal = parteFinalId;
    //console.log(parteFinalModal);

    if (opcionIcono == 4) {
        icono = 'fa-hand-o-right';
        color = 'color:black;';
    }

    if (nombreFuncion == "") {
        nombreFuncion = "ocultarMensajesUx()";
    }
    var valor = 0;
    var contenido = "";
    var listContenido = [];

    if (opcionIcono != 3) {
        var listContenido = [
            {
                sugerencia: "",
                label: (opcionIcono >= 5 && opcionIcono <= 8 ? "<br><br>" : "") + "<i class='fa " + icono + "' style='font-size:" +
                    (opcionIcono >= 5 && opcionIcono <= 8 ? "60px" : "40px") + ";" + color + " float:right;' >" + "</i>",
                inputForm: "<h4 style='text-align:" + (opcionIcono >= 5 && opcionIcono <= 8 ? "left" : "center") + ";'>" + mensajeUx + "</h4>",
                divContainer: ""
            },
            {
                sugerencia: "", label: "",
                inputForm: "<button  id='btnDevolverValor1" + parteFinalId + "'  value='" + valor + "'   class='btn btn-success' style='float:right;' type='button'   " +
                    "onclick='" + nombreFuncion + "' >" +
                    "<i class='fa fa-check-circle'> </i> Continuar" +
                    "</button>"
            },
        ];
    }

    listContenido.forEach(
        function (val) {
            count++;
            contenido += obtenerSubPanelModuloGeneralMensajesUx(val, count);
        });

    var modalOptions = {
        id: "modalMensajeUx" + parteFinalId,
        nombre: "<i class='fa fa-bell'></i> Notificación <br>",
        contenido: "<div class='eventoGeneral'>" + contenido + "</div>"
    };

    ////// cookies para el comunicado de compromiso


    crearModalPrincipalUsuarioT1(modalOptions, function () {
    }, false);

    $("#modalMensajeUx" + parteFinalId).modal("show");
}

/// previsulizar imagenes o archivos
function openInGoogleDocsViewer(event, url, nombreArchivo) {
    event.stopPropagation(); // Previene la propagación del evento.

    // Valida si 'nombreArchivo' está definido; de lo contrario, establece un valor predeterminado o maneja el error
    if (typeof nombreArchivo === 'undefined') {
        console.error('nombreArchivo no está definido.');
        return;
    }

    // Determina si el nombre del archivo corresponde a un tipo de archivo de imagen.
    var esImagen = nombreArchivo.match(/\.(jpeg|jpg|gif|png|bmp)$/i) != null;

    var mostrar = function (contenido) {
        var modalOptions = {
            id: "modalVerArchivos",
            nombre: nombreArchivo, // Usar el nombre del archivo como título del modal
            contenido: "<div class='eventoGeneral'>" + contenido + "</div>",
            maxWidth: "60%"
        };
        crearModalPrincipalUsuarioCentrado(modalOptions, function () {
        }, true, true);
    };

    if (esImagen) {
        // P106: la imagen se pide al back con la sesión del usuario y se ve por un enlace firmado.
        mostrar("<div style='max-height: 500px; overflow-y: auto;'><img src='" + urlArchivo(url) + "' class='img-fluid' alt='Imagen'></div>");
        return;
    }

    // Si no es una imagen, usa Google Docs Viewer en un iframe dentro del modal.
    var abrirVisor = function (urlVisible) {
        var viewerUrl = 'https://docs.google.com/viewer?url=' + encodeURIComponent(urlVisible) + '&embedded=true';
        mostrar("<iframe src='" + viewerUrl + "' width='100%' height='500px' frameborder='0'></iframe>");
    };
    // P106: Google baja el archivo sin la sesión del usuario, así que se le pasa un enlace firmado
    // (vence en minutos) que el back entrega a este navegador, que sí tiene sesión.
    obtenerUrlFirmada(url, function (firmada) {
        if (firmada) {
            abrirVisor(firmada);
        } else {
            mostrar("<p>No se pudo abrir la vista previa. <a href='" + urlArchivo(url) + "' target='_blank'>Descargar el archivo</a></p>");
        }
    });
}


function crearModalPrincipalUsuarioT1(modalOptions, functionCallBack, isStatic, isShow) {
    if (modalOptions.dontRemoveBack == null) {
        $(".modal-backdrop").remove();
    }

    $("#" + modalOptions.id).remove();
    var maxWidth = "600px";
    if (modalOptions.maxWidth != null) {
        maxWidth = modalOptions.maxWidth + ""
    }
    $("body").append("<div class='modal' id='" + modalOptions.id + "' role='dialog'>" +
        "<div class='modal-dialog modal-dialog-centered' style='width:100%; margin: 40px auto  auto auto;   max-width: " + maxWidth + ";'>" +

        "<div class='modal-content' >" +
        "<div class='modal-header'>" +
        // "   <button id = 'cerrar' type='button' class='close' data-dismiss='modal'>X</button>"+
        "  <h4 class='modal-title'>" + modalOptions.nombre + "</h4>" +
        "</div>" +

        "<div class='modal-body'>" +
        modalOptions.contenido +
        "</div>" +
        "</div>" +

        "</div>" +
        "</div>");
    //$("#"+modalOptions.id).modal({backdrop: 'static', keyboard: false})
    $("#" + modalOptions.id).on('shown.bs.modal', functionCallBack);
    $('#' + modalOptions.id).modal({
        keyboard: false,
        show: (isShow ? isShow : false),
        backdrop: (isStatic ? "static" : false)
    })
}


function mensajesUxTerminosCondiciones(mensajeUx, opcionIcono, nombreFuncion, parteFinalId) {

    var count = 0;
    var icono, color;
    parteFinalModal = parteFinalId;
    //console.log(parteFinalModal);

    if (opcionIcono == 4) {
        icono = 'fa-hand-o-right';
        color = 'color:black;';
    }

    if (nombreFuncion == "") {
        nombreFuncion = "ocultarMensajesUx()";
    }
    var valor = 0;
    var contenido = "";
    var listContenido = [];

    if (opcionIcono != 3) {
        var listContenido = [
            {
                sugerencia: "",
                label: (opcionIcono >= 5 && opcionIcono <= 8 ? "<br><br>" : "") + "<i class='fa fa1" + icono + "' style='font-size:" +
                    (opcionIcono >= 5 && opcionIcono <= 8 ? "60px" : "40px") + ";" + color + "float:right;' aria-hidden='true'>" + "</i>",
                inputForm: "<h4 style='text-align:" + (opcionIcono >= 5 && opcionIcono <= 8 ? "left" : "center") + ";'>" + mensajeUx + "</h4>",
                divContainer: ""
            },
            {
                sugerencia: "", label: "",
                inputForm: "<button  id='btnDevolverValor" + parteFinalId + "'  value='" + valor + "'   class='btn btn-success' style='float:right;' type='button'   " +
                    "onclick='" + nombreFuncion + "' disabled>" +
                    "<i class='fa fa-check-circle'> </i> Continuar" +
                    "</button>"
            },
        ];
    }

    listContenido.forEach(
        function (val) {
            count++;
            contenido += obtenerSubPanelModuloGeneralMensajesUxTerminosCondiciones(val, count);
        });

    var modalOptions = {
        id: "modalMensajeUx" + parteFinalId,
        nombre: "<i class='fa fa-bell'></i> Notificación <br>",
        contenido: "<div class='eventoGeneral'>" + contenido + "</div>"
    };
    crearModalPrincipalUsuarioT(modalOptions, function () {
    }, false);

    $("#modalMensajeUx" + parteFinalId).modal("show");
}

function crearModalPrincipalUsuarioT(modalOptions, functionCallBack, isStatic, isShow) {
    if (modalOptions.dontRemoveBack == null) {
        $(".modal-backdrop").remove();
    }

    $("#" + modalOptions.id).remove();
    var maxWidth = "850px";
    if (modalOptions.maxWidth != null) {
        maxWidth = modalOptions.maxWidth + ""
    }
    $("body").append("<div class='modal' id='" + modalOptions.id + "' role='dialog'>" +
        "<div class='modal-dialog modal-dialog-centered' style='width:100%; margin: 40px auto  auto auto;   max-width: " + maxWidth + ";'>" +

        "<div class='modal-content' >" +
        "<div class='modal-header'>" +
        "   <button id = 'cerrar' type='button' class='close' data-dismiss='modal'>X</button>" +
        "  <h4 class='modal-title'>" + modalOptions.nombre + "</h4>" +
        "</div>" +

        "<div class='modal-body'>" +
        modalOptions.contenido +
        "</div>" +
        "</div>" +

        "</div>" +
        "</div>");
    //$("#"+modalOptions.id).modal({backdrop: 'static', keyboard: false})
    $("#" + modalOptions.id).on('shown.bs.modal', functionCallBack);
    $('#' + modalOptions.id).modal({
        keyboard: false,
        show: (isShow ? isShow : false),
        backdrop: (isStatic ? "static" : false)
    })
}


var validador;

function cambiarValor() {

    console.log(" valor de boton antes " + $('#btnDevolverValor' + parteFinalModal).val());

    var valorBotonTerminos = $('#btnDevolverValor' + parteFinalModal).val(1).val();
    console.log(" valor de boton despues " + valorBotonTerminos);

    ocultarMensajesUx();

    return valorBotonTerminos;
}


////////////Fin2 de terminos y condiciones

function ocultarMensajesUx() {
    $("#modalMensajeUx"+parteFinalModal).modal("hide");
}

function obtenerTextoEvaluacion(eval4) {
    if (eval4 != null) {
        if (eval4.fecha == null) {
            eval4 = {textoEval: iconoGosst.advertir + "Sin evaluar"};
        } else {
            if (eval4.observacion != null) {
                if (eval4.observacion.length > 0) {
                    eval4.observacion = " (" + eval4.observacion + ")"
                }
            }

            if (eval4.id == 1) {
                eval4.textoEval = iconoGosst.aprobado + "Evaluado el: <br>" +
                    eval4.fechaTexto + " <strong> " + eval4.observacion + "</strong>";
            } else {
                eval4.textoEval = eval4.icono + eval4.nombre + " - Evaluado el: <br>" +
                    eval4.fechaTexto + " <strong> " + eval4.observacion + "</strong>"
            }
        }
    } else {
        eval4 = {textoEval: iconoGosst.advertir + "Sin evaluar"};
    }
    return eval4;
}

function crearRadiosAuto(nameId, listOptions, radioSelected, idValue, nombreValue, onchange) {
    var textoOpcionesRadio = "<div class='containerCenter' >";

    listOptions.forEach(function (val) {
        textoOpcionesRadio += "<div style='width : 50%;display: inline-block; text-align: center;  '>" +
            "<input type='radio' id='" + val[idValue] + nameId + "' name='" + nameId + "' value='" + val[idValue] + "' " +
            (onchange == "" ? "" : "onchange='" + onchange + "(" + val[idValue] + ")'") +
            " " + (parseInt(radioSelected) == parseInt(val[idValue]) ? "checked" : "") + ">" +
            "<label for = '" + val[idValue] + nameId + "'>" + val[nombreValue] + "</label>" +
            "</div>"
    });
    textoOpcionesRadio += "</div>"
    return textoOpcionesRadio;
}

function obtenerFechaActualTotal() {
    var dateY = new Date();
    return (('' + (dateY.getDate())).length < 2 ? '0' : '') + ('' + (dateY.getDate())) + "-"
        + (('' + (dateY.getMonth() + 1)).length < 2 ? '0' : '') + ('' + (dateY.getMonth() + 1))
        + "-" + dateY.getFullYear()
        + " " + dateY.getHours() + ":" + (('' + dateY.getMinutes()).length < 2 ? '0' : '') + dateY.getMinutes();

}

function pasarDecimalSobreVeinte(decimal, numDecimales) {
    var porc;
    var aux = decimal * 20;

    if (aux >= 0) {
        porc = aux.toFixed(numDecimales);
        return porc + " / 20"
    } else {
        return 0 + " / 20"
    }
}

function agregarPanelesDivPrincipalGeneral(listPanelesPrincipal) {
    if (listPanelesPrincipal.length == 0) {
        $(".divListPrincipal")
            .append(
                "<div id='divNoResultados'  >" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
                "</div>"
            );
        $("#divNoResultados").find(".tituloSubList").html(
            //"<i aria-hidden='true' class='fa fa-list'></i>"+
            "Sin resultados");
    }
    listPanelesPrincipal.forEach(function (val, index) {
        $(".divListPrincipal")
            .append(
                "<div id='" + val.id + "' class='" + val.clase + "' >" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
                "</div>"
            );
        var textoBtn = "<button class='btn btn-success'  onclick='cambiarDivSubContenidoGeneral(this)'>" +
            "<i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i></button>";
        $("#" + val.id).find(".tituloSubList").html(textoBtn
            //	+"<i aria-hidden='true' class='fa fa-list'></i>"
            + val.nombre);
        $("#" + val.id).find(".contenidoSubList").html(
            val.contenido
        );
    })

}

function bloquearBotonEnter(val) {
    $("#" + val.id).keypress(function (e) {
        var keyCode = e.which;
        // Si la tecla es enter
        if (keyCode == 13) {
            event.preventDefault();

            return false;
        }
    });
}

function obtenerSubPanelModuloVersionDos(val) {
    var estiloDefault = "";

    val.styleAux = (val.styleAux != undefined ? val.styleAux : "");
    val.anchoLabel = (val.anchoLabel != undefined ? val.anchoLabel : "");
    val.anchoDiv = (val.anchoDiv != undefined ? val.anchoDiv : "");

    if (val.inputForm == "" && val.sugerencia == "" && val.label == "") {
        estiloDefault = "border-top: 1px solid #a5aaae;";
    }

    if (val.inputForm == "" && val.sugerencia == "" && val.label == "" &&
        val.divContainer == "") {
        estiloDefault = "border-top: 1px dashed #a5aaae;";
    }

    if (val.fullRow == 1) {
        return "<div class='form-group row " + val.clase + "' style='" + estiloDefault + "'>" +
            "<div class='col-sm-14' id='" + val.divContainer + "'>" +
            val.inputForm +
            "</div>" +
            "</div>";
    }

    return "<div class='form-group row " + val.clase + "' style='" + estiloDefault + val.styleAux + "'>" +
        "<label for='colFormLabel' class='" + (val.anchoLabel == "" ? "col-sm-4" : val.anchoLabel) + " " +
        "col-form-label'>" + val.label + "</label>" +
        "<div class='" + (val.anchoDiv == "" ? "col-sm-8" : val.anchoDiv) + "' id='" + val.divContainer + "'>" +
        " " + val.inputForm +
        "<small>" + val.sugerencia + "</small>" +
        "</div>" +
        "</div>";
}

var prefijoAuxId;

function mensajesUxVersionDos(opcionMensaje, encabezadoUx, tituloUx, contenidoUx, piePaginaUx,
                              icono, colorIcono, nombreFuncion, prefijoId) {
//1 -> aceptar
    var userAgent = isMobile.any();

    if (nombreFuncion == "") {
        nombreFuncion = "ocultarMensajesUxVersionDos();";
    }

    var contenido = "";

//var listContenido=[
//  {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",
//   styleAux:(userAgent == true?"display:flex;margin-bottom:-20px;":""),
//   label:"<i class='fa "+icono+"' style='font-size:60px;"+colorIcono+";' aria-hidden='true'></i>",
//   inputForm:"<h4>"+encabezadoUx+"</h4>"}
//             ];

    var listContenido = [];

    if (encabezadoUx != "") {
        listContenido.push(
            {
                sugerencia: "",
                anchoLabel: "",
                anchoDiv: "",
                styleAux: (userAgent == true ? "display:flex;justify-content:space-between;" : ""),
                label: "<i class='fa " + icono + "' style='font-size:60px;" + colorIcono + ";' aria-hidden='true'></i>",
                inputForm: "<h4>" + encabezadoUx + "</h4>"
            },
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""
                , styleAux: (userAgent == true ? "margin-bottom:-20px;" : "")
            }
        );
    }

    if (tituloUx != "") {
        listContenido.push(
            {
                sugerencia: "", anchoLabel: "col-sm-0", anchoDiv: "col-sm-12",
                label: "", inputForm: "<h4>" + tituloUx + "</h4>"
            },
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: "",
                styleAux: (userAgent == true ? "margin-bottom:-20px;" : "")
            }
        );
    }

    if (contenidoUx != "") {
        listContenido.push(
            {
                sugerencia: "", anchoLabel: "col-sm-0", anchoDiv: "col-sm-12",
                label: "", inputForm: "<h4>" + contenidoUx + "</h4>"
            },
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: "",
                styleAux: (userAgent == true ? "margin-bottom:-20px;" : "")
            }
        );
    }

    if (piePaginaUx != "") {
        listContenido.push(
            {
                sugerencia: "", anchoLabel: "col-sm-1", anchoDiv: "col-sm-11",
                styleAux: (userAgent == true ? "display:flex;justify-content:space-between;" : ""),
                label: "<i class='fa fa-asterisk' aria-hidden='true' style='color:red;" +
                    (userAgent == true ? "margin-top:10px;" : "") + "'></i>",
                inputForm: "<label style='color:red;font-size:14px;float:left;" +
                    (userAgent == true ? "font-size:10px;margin-top:10px;" : "font-size:14px;") + "'>" +
                    piePaginaUx + "</labe>"
            },
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: "",
                styleAux: (userAgent == true ? "margin-bottom:-20px;" : "")
            }
        );
    }

    if (opcionMensaje == 1) {
        listContenido.push(
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "", label: "",
                inputForm: "<button id='btnDevolverValor" + prefijoId + "' class='btn btn-success' " +
                    "style='float:right;font-size:18px;' type='button' onclick='" + nombreFuncion + "'>" +
                    "<i class='fa fa-check-circle'></i> Aceptar" +
                    "</button>"
            }
        );
    }

    listContenido.forEach(function (val) {
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions = {
        id: "modalMensajeUx" + prefijoId,
        nombre: "<i class='fa fa-bell'></i> Notificación <br>",
        contenido: "<div class='eventoGeneral'>" + contenido + "</div>"
    };

    crearModalPrincipalUsuario(modalOptions, function () {
    }, false);

    prefijoAuxId = prefijoId;
    $("#modalMensajeUx" + prefijoId).modal("show");
}

function ocultarMensajesUxVersionDos() {
    $("#modalMensajeUx" + prefijoAuxId).modal("hide");
}

function agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal) {
    if (listPanelesPrincipal.length == 0) {
        $(".divListPrincipal").append(
            "<div id='divNoResultados'>" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList'></div>" +
            "</div>");

        $("#divNoResultados").find(".tituloSubList").html("Sin resultados");
    }

    listPanelesPrincipal.forEach(function (val, index) {
        val.styleAux = (val.styleAux != undefined ? val.styleAux : "");
        val.buttonAd = (val.buttonAd != undefined ? val.buttonAd : "");

        $(".divListPrincipal").append(
            "<div id='" + val.id + "' class='" + val.clase + "'>" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList' style='" + val.styleAux + "'></div>" +
            "</div>");

        var textoBtn =
            "<button class='btn btn-success' style='padding:2px 4px 2px 4px' " +
            "onclick='cambiarDivSubContenido(this," + val.proyectoId + ")' " +
            "title='Mostrar/Ocultar los registros de esta sección.'>" +
            "<i class='fa fa-caret-down fa-4x' aria-hidden='true'></i>" +
            "</button>";

        $("#" + val.id).find(".tituloSubList").html(textoBtn + val.buttonAd + val.nombre);
        $("#" + val.id).find(".contenidoSubList").html(val.contenido);
    });
}

function agregarPanelesDivPrincipalVersionDosSinContenido(listPanelesPrincipal) {
    listPanelesPrincipal.forEach(function (val, index) {
        $(".divListPrincipal").append(
            "<div id='" + val.id + "' class='" + val.clase + "'>" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList' style='" + val.styleAux + "'></div>" +
            "</div>");

        $("#" + val.id).find(".tituloSubList").html(val.buttonAd + val.nombre);
    });
}

function crearModalPrincipalUsuarioObligatorio(modalOptions, functionCallBack, isStatic, isShow) {
    if (modalOptions.dontRemoveBack == null) {
        $(".modal-backdrop").remove();
    }

    $("#" + modalOptions.id).remove();

    var maxWidth = "650px";

    if (modalOptions.maxWidth != null) {
        maxWidth = modalOptions.maxWidth + "";
    }

    $("body").append(
        "<div class='modal' id='" + modalOptions.id + "' role='dialog'>" +
        "<div class='modal-dialog modal-dialog-centered' style='width:100%;max-width:" + maxWidth + ";'>" +
        "<div class='modal-content'>" +
        "<div class='modal-header'>" +
        "<h4 class='modal-title'>" + modalOptions.nombre + "</h4>" +
        "</div>" +
        "<div class='modal-body'>" +
        modalOptions.contenido +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>");

    $("#" + modalOptions.id).on('shown.bs.modal', functionCallBack);

    $('#' + modalOptions.id).modal({
        keyboard: true,
        show: (isShow ? isShow : false),
        backdrop: (isStatic ? "static" : true)
    });
}

function agregarPanelesDivPrincipalStyle(listPanelesPrincipal, style) {
    if (listPanelesPrincipal.length == 0) {
        $(".divListPrincipal")
            .append("<div id='divNoResultados'>" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList' style='" + style + "'></div>" +
                "</div>");

        $("#divNoResultados").find(".tituloSubList")
            .html( //"<i aria-hidden='true' class='fa fa-list'></i>"+
                "Sin resultados");
    }

    listPanelesPrincipal.forEach(function (val, index) {
        $(".divListPrincipal")
            .append("<div id='" + val.id + "' class='" + val.clase + "'>" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList' style='" + val.styleContenido + "'></div>" +
                "</div>");

        var textoBtn =
            "<button class='btn btn-success' onclick='cambiarDivSubContenido(this," + val.proyectoId + ")'>" +
            "<i class='fa fa-arrows-v fa-3x' aria-hidden='true'></i>" +
            "</button>";

        $("#" + val.id).find(".tituloSubList").html(textoBtn +
            //	+"<i aria-hidden='true' class='fa fa-list'></i>"
            val.nombre);

        $("#" + val.id).find(".contenidoSubList").html(val.contenido);
    });
}

function crearRadiosAutoVersionDos(nameId, listOptions, radioSelected, idValue, nombreValue, onchange, auxId) {
    var auxIdVal = (auxId.length != 0 ? auxId : "-1");

    var textoOpcionesRadio = "<div class='containerCenter'>";

    listOptions.forEach(function (val) {
        val.anchoAux = (val.anchoAux != undefined ? val.anchoAux : "50%");

        textoOpcionesRadio +=
            "<div style='width:" + val.anchoAux + ";display:inline-block;text-align:center;'>" +
            "<input type='radio' id='" + val[idValue] + nameId + "' name='" + nameId + "' value='" + val[idValue] + "' " +
            (onchange == "" ? "" : "onchange='" + onchange + "(" + val[idValue] + "," + auxIdVal + ")'") + " " +
            (parseInt(radioSelected) == parseInt(val[idValue]) ? "checked" : "") + ">" +
            "<label for='" + val[idValue] + nameId + "'>" + val[nombreValue] + "</label>" +
            "</div>";
    });

    textoOpcionesRadio += "</div>";

    return textoOpcionesRadio;
}

function agregarPanelesDivPrincipalModalVersionDos(listPanelesPrincipal, idNombreContenedor) {
    if (listPanelesPrincipal.length == 0) {
        $("#" + idNombreContenedor).append(
            "<div id='divNoResultados'>" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList'></div>" +
            "</div>");

        $("#divNoResultadosModal").find(".tituloSubList").html("Sin resultados");
    }

    listPanelesPrincipal.forEach(function (val, index) {
        val.desplegarContenido = (val.desplegarContenido != undefined ? val.desplegarContenido : 1);

        $("#" + idNombreContenedor).append(
            "<div id='" + val.id + "' class='" + val.clase + "'>" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList' style='" + val.styleAux + "'></div>" +
            "</div>");

        var textoBtn = (val.desplegarContenido == 0 ? "" :
            "<button class='btn btn-success' style='padding:0px 4px 0px 4px' " +
            "onclick='cambiarDivSubContenidoModal(this)' " +
            "title='Mostrar/Ocultar los registros de esta sección.'>" +
            "<i class='fa fa-caret-down fa-4x' aria-hidden='true'></i>" +
            "</button>");

        $("#" + val.id).find(".tituloSubList").html(textoBtn +//+"<i aria-hidden='true' class='fa fa-list'></i>"
            val.buttonAd + val.nombre);

        $("#" + val.id).find(".contenidoSubList").html(val.contenido);
    });
}

function cambiarDivSubContenidoModal(obj) {
    $(obj).parent(".tituloSubList").siblings().find(".contenidoSubList").hide();
    $(obj).parent(".tituloSubList").siblings(".contenidoSubList").toggle();
}

function crearRadiosAutoOpciones(nameId, listOptions, radioSelected, idValue, nombreValue, choice, align) {
    var textoOpcionesRadio = "<div class='containerCenter'>";
    listOptions.forEach(function (val) {
        textoOpcionesRadio +=
            "<div class='" + (choice == "checkbox" ? "containerInputRadioChecbox" : "") + "' style='" +
            (choice == "checkbox" ? "padding-left:20px" : "width:50%") + ";display:inline-block;text-align:" + align + ";'>" +
            "<label for='" + val[idValue] + nameId + "'>" +
            "<input type='" + choice + "' id='" + val[idValue] + nameId + "' name='" + nameId + "' value='" + val[idValue] + "' " +
            (choice == "radio" ? (parseInt(radioSelected) == parseInt(val[idValue]) ? "checked" : "") :
                (radioSelected.includes(val[idValue]) == true ? "checked" : "")) + ">" +
            val[nombreValue] +
            "</label>" +
            "</div>";
    });
    textoOpcionesRadio += "</div>";

    return textoOpcionesRadio;
}

function crearCheckAutoOpcionesMultiple(nameId, listOptions, radioSelected, idValue, nombreValue, separacion, align) {
    var textoOpcionesRadio = "<div class='containerCenter'>";
    listOptions.forEach(function (val) {
        textoOpcionesRadio +=
            "<div class='containerCheckbox' style='padding-left:" + separacion + ";display:inline-block;text-align:" + align + ";'>" +
            "<label for='" + val[idValue] + nameId + "'>" +
            "<input type='checkbox' id='" + val[idValue] + nameId + "' name='" + nameId + "' value='" + val[idValue] + "' " +
            //                 (parseInt(radioSelected) == parseInt(val[idValue])?"checked":"")+">" +

            (radioSelected.includes(val[idValue]) == true ? "checked" : "") + ">" +

            val[nombreValue] +
            "</label>" +
            "</div>";
    });
    textoOpcionesRadio += "</div>";

    return textoOpcionesRadio;
}

function agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal){
   if(listPanelesPrincipal.length == 0){
      $(".divListPrincipal").append(
         "<div id='divNoResultados'>" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList'></div>" +
         "</div>");

      $("#divNoResultados").find(".tituloSubList").html("Sin resultados");
   }

   listPanelesPrincipal.forEach(function(val,index){
      val.styleAux = (val.styleAux != undefined?val.styleAux:"");
      val.buttonAd = (val.buttonAd != undefined?val.buttonAd:"");
      val.btnSubIconoAux = (val.btnSubIconoAux != undefined?val.btnSubIconoAux:"");

      $(".divListPrincipal").append(
         "<div id='"+val.id+"' class='"+val.clase+"'>" +
            "<div class='tituloSubList'></div>" +
            "<div class='contenidoSubList' style='"+val.styleAux+"'></div>" +
         "</div>");

      val.btnOnclickAux = (val.btnOnclickAux == ""?"cambiarDivSubContenido(this,null)":val.btnOnclickAux);
      val.btnIconoAux = (val.btnIconoAux == ""?"fa-caret-down":val.btnIconoAux);
      val.btnTitleAux = (val.btnTitleAux == ""?"Mostrar/Ocultar los registros de esta sección.":val.btnTitleAux);

      var textoBtn =
         "<button class='btn btn-success' style='padding:4px 6px;' onclick='"+val.btnOnclickAux+"' " +
                 "title='"+val.btnTitleAux+"'>" +
            "<i class='fa "+val.btnIconoAux+" fa-4x' aria-hidden='true'></i> "+val.btnSubIconoAux +
         "</button>";

         $("#"+val.id).find(".tituloSubList").html(textoBtn+val.buttonAd+val.nombre);
         $("#"+val.id).find(".contenidoSubList").html(val.contenido);
   });
}

function validacionSubirEvidencia(parteFinalId,bitsAux,modalAux){
   var mensajeUx = "",evidenciaOk = true;
   var inputFileImage = document.getElementById('fileEvi'+parteFinalId);

   var file = inputFileImage.files[0];

   if(file.name.indexOf(",") != -1){
      mensajeUx = "<label>Por favor, ingrese un archivo sin comas (,).</label>";
      evidenciaOk = false;
   }else if (file.size > bitsAux){
      mensajeUx = "<label>Lo sentimos, solo se pueden subir archivos menores a " +
         bitsAux / 1000000+" MB.</label>";
      evidenciaOk = false;
   }else if(/[áéíóúñÁÉÍÓÚÑ–“”º°³Â]/.test(file.name.normalize("NFC"))){
      mensajeUx = "<label>El nombre de la evidencia no puede tener letras con tilde, incluir la ñ, guion largo (–), " +
          "comillas u otro caracter especial (º°³Â).</label>";
      evidenciaOk = false;  
   }else if (/[\u0000-\u001F\u007F-\u009F\u2000-\u206F]/.test(file.name)){
       mensajeUx = "<label>El nombre de la evidencia contiene caracteres no válidos o invisibles.</label>";
       evidenciaOk = false;
   }

   if(!evidenciaOk){
      if(modalAux != ""){
         $("#"+modalAux).modal("hide");
      }

      mensajesUx(mensajeUx,2,"","AvisoEvidenciaSubir");

      $("#modalMensajeUxAvisoEvidenciaSubir").on("hidden.bs.modal",function(){
         if(modalAux != ""){
            $("#"+modalAux).modal("show");
         }

         $("#inputEvi"+parteFinalId).val("VOLVER A SUBIR");
         $("#inputEvi"+parteFinalId).focus();
      });
   }
}

function guardarEvidenciaAutoVersionDosNoUnlock(archivoId, inputFileId, bitsMax,
                                                urlEvidencia, functionCallback, fieldEvidencia, arrayDataAppend) {
    fieldEvidencia = defaultFor(fieldEvidencia, "id");
    var archivoIdAux = archivoId;
    var inputFileImage = document.getElementById(inputFileId);

    var file = inputFileImage.files[0];
    var data = new FormData();

    if (file) {
        if (file.size > bitsMax) {
            functionCallback();
        } else {
            var realizarCompresion = true;
            var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

            if (!filterType.test(file.type) || file.size < bitsMega * 1.5) {
                realizarCompresion = false;
            }

            if (realizarCompresion) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                fileReader.onload = function (event) {
                    var image = new Image();

                    image.onload = function () {
                        var canvas = document.createElement("canvas");
                        var context = canvas.getContext("2d");
                        var MAX_WIDTH = 800;
                        var MAX_HEIGHT = 600;
                        var width = image.width;
                        var height = image.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;

                        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

                        canvas.toBlob(function (blob) {
                            var fileFinal = new File([blob], file.name);
                            data.append("fileEvi", fileFinal);
                            data.append("fechaSubida", new Date());
                            data.append("fecha", $("#dateActividad").val());

                            if (arrayDataAppend) {
                                arrayDataAppend.forEach(function (val, index) {
                                    data.append(val.id, val.value);
                                });
                            }

                            data.append(fieldEvidencia, archivoId);

                            var url = URL + urlEvidencia;

                            $.ajax({
                                url: url, type: 'POST', beforeSend: function () {
//			   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
                                },
                                xhrFields: {withCredentials: true},
                                contentType: false, data: data, processData: false, cache: false,
                                success: function (data, textStatus, jqXHR) {
                                    switch (data.CODE_RESPONSE) {
                                        case "06":
                                            sessionStorage.clear();
                                            document.location.replace(data.PATH);

                                            break;

                                        default:
                                            console.log("Prueba 1.2");
//			         $("#"+inputFileId).parent("span").find("#labelProgress").remove();
                                            functionCallback(data);
                                    }
                                },
                                complete: function () {
//			   $.unblockUI();
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    $.unblockUI();
                                    alert("Estimado usuario, no excederse de 14mb o 30 caracteres del nombre del archivo");
                                    console.log('xhRequest: ' + jqXHR + "\n");
                                    console.log('ErrorText: ' + textStatus + "\n");
                                    console.log('thrownError: ' + errorThrown + "\n");
                                },
                                // Custom XMLHttpRequest
                                xhr: function () {
                                    var myXhr = $.ajaxSettings.xhr();

                                    if (myXhr.upload) {
                                        // For handling the progress of the upload
                                        myXhr.upload.addEventListener('progress', function (e) {
                                            if (e.lengthComputable) {
                                                var progreso = e.loaded / e.total;
                                                console.log(pasarDecimalPorcentaje(progreso));
                                                $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                                $("#" + inputFileId).parent("span").append(
                                                    "<label id='labelProgress'>" + pasarDecimalPorcentaje(progreso) + "</label>");
                                            }
                                        }, false);
                                    }

                                    return myXhr;
                                }
                            });
                        }, 'image/jpeg', 1);
                    }

                    image.src = event.target.result;
                }
            } else {
                data.append("fileEvi", file);
                data.append("fechaSubida", new Date());
                data.append("fecha", $("#dateActividad").val());

                if (arrayDataAppend) {
                    arrayDataAppend.forEach(function (val, index) {
                        data.append(val.id, val.value);
                    });
                }

                data.append(fieldEvidencia, archivoId);

                var url = URL + urlEvidencia;

                $.ajax({
                    url: url, type: 'POST', beforeSend: function () {
//		  $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
                    },
                    xhrFields: {withCredentials: true},
                    contentType: false, data: data, processData: false, cache: false,
                    success: function (data, textStatus, jqXHR) {
                        switch (data.CODE_RESPONSE) {
                            case "06":
                                sessionStorage.clear();
                                document.location.replace(data.PATH);

                                break;

                            default:
                                console.log("Prueba 1.2");
//		     	$("#"+inputFileId).parent("span").find("#labelProgress").remove();
                                functionCallback(data);
                        }
                    },
                    complete: function () {
//	          $.unblockUI();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $.unblockUI();
                        alert("Estimado usuario, no excederse de 14mb o 30 caracteres del nombre del archivo");
                        console.log('xhRequest: ' + jqXHR + "\n");
                        console.log('ErrorText: ' + textStatus + "\n");
                        console.log('thrownError: ' + errorThrown + "\n");
                    },
                    // Custom XMLHttpRequest
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();

                        if (myXhr.upload) {
                            // For handling the progress of the upload
                            myXhr.upload.addEventListener('progress', function (e) {
                                if (e.lengthComputable) {
                                    var progreso = e.loaded / e.total;
                                    console.log(pasarDecimalPorcentaje(progreso));
                                    $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                    $("#" + inputFileId).parent("span").append(
                                        "<label id='labelProgress'>" + pasarDecimalPorcentaje(progreso) + "</label>");
                                }
                            }, false);
                        }

                        return myXhr;
                    }
                });
            }
        }
    } else {
        console.log("No se encontro " + inputFileId)
        functionCallback();
    }
}

function callAjaxPostNoUnlockAux(pUrl, dataParam, funcionRespuesta, funcionBefore, dataBefore, functionError) {
    //PARA EVITAR CORTAR LA RUEDITA DE CARGA
    $.ajax({
        url: pUrl,
        type: 'post',
        async: true,
//    crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify(dataParam),
        contentType: "application/json",
        beforeSend: function () {
            if (funcionBefore == null) {
//	    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
            } else {
                funcionBefore(dataBefore);
            }
        },
        success: function (data, textStatus, jqXHR) {
            switch (data.CODE_RESPONSE) {
                case "06":
                    sessionStorage.clear();
                    document.location.replace(data.PATH);
                    break;

                case "07":
                    //sessionStorage.clear();
                    alert("Sesion expirada");
                    document.location.replace(data.PATH);
                    break;

                default:
                    funcionRespuesta(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            console.log("Ruta de error:" + pUrl);

            if (functionError != null) {
                functionError();
            }

            var responseText = jQuery.parseJSON(jqXHR.responseText);

            if (responseText.CODE_RESPONSE == "07") {
                alert("Sesión Expiradaa");
                document.location.href = (responseText.PATH);
            }

            if (responseText.CODE_RESPONSE == "09") {
                alert("No tiene acceso al módulo");
            }

            //document.location.replace(responseText.PATH);
        }
    });
}

function convertirImagenABase64(inputFileId, ruedaCarga, functionCallback) {
    if (ruedaCarga == 1) {
        $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    }

    var inputFileImage = document.getElementById(inputFileId);
    var file = inputFileImage.files[0];
    var realizarCompresion = true;
    var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

    var resultadoAux = {};

    if (!filterType.test(file.type) || file.size < bitsMega * 1.5) {
        realizarCompresion = false;
    }

    if (realizarCompresion) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = function (event) {
            var image = new Image();

            image.onload = function () {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                var MAX_WIDTH = 800, MAX_HEIGHT = 600;
                var width = image.width, height = image.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(function (blob) {
                    var fileFinal = new File([blob], file.name);
                    var reader = new FileReader();
                    reader.readAsDataURL(fileFinal);
                    var base64dataFinal;

                    reader.onloadend = function () {
                        var base64data = reader.result;
                        var indice = base64data.indexOf(",");
                        var final = base64data.length;
                        base64dataFinal = base64data.substring(indice + 1, final);

                        resultadoAux = {EviBase64Aux: base64dataFinal};

                        functionCallback(resultadoAux);
                    };
                }, 'image/jpeg', 1);
            };

            image.src = event.target.result;
        };
    } else {
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function () {
            var base64data = reader.result;
            var indice = base64data.indexOf(",");
            var final = base64data.length;
            var base64dataFinal = base64data.substring(indice + 1, final);

            resultadoAux = {EviBase64Aux: base64dataFinal};

            functionCallback(resultadoAux);
        };
    }
}

function enviarParametrosExternoPost(pUrl,dataParam,dataParamError,ruedaCarga,ruedaCargaFin,conectarConApi,functionCallback) {
   if(conectarConApi == 1){
      $.ajax({
         url:pUrl,type:'POST',processData:false,contentType:'application/json',dataType:'json',
         beforeSend: function(){
            if(ruedaCarga == 1){
               $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
            }
         },
         data:JSON.stringify(dataParam),
         success:function(data){
            if(ruedaCargaFin == 1){
               $.unblockUI();
            }

            functionCallback(data);
         },
         error:function(error){
            $.unblockUI();
            
            var mensajeUx = "<label>Error al procesar la validación. " +
               "Por favor, revise que la información enviada sea la correcta." +
               "<br><br>(De persistir el error, comuníquese con GOSST).</label>";

            if(dataParamError.esModal == 1){
               $("#"+dataParamError.contenedorModal).modal("hide");

               mensajesUx(mensajeUx,2,"","ActualizarVistaActual");

               $("#modalMensajeUxActualizarVistaActual").on("hidden.bs.modal",function(){
                  $("#"+dataParamError.contenedorModal).modal("show");
               });
            }else{
               mensajesUx(mensajeUx, 2, "", "");
            }
         }
      });
   }else{
      if(ruedaCarga == 1){
         $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
      }

      if(ruedaCargaFin == 1){
         $.unblockUI();
      }

      functionCallback();
   }
}

function callAjaxPostSimple(pUrl,dataParam,ruedaCarga,funcionRespuesta) {
   $.ajax({
      url:pUrl,type:'post',async:true,/*crossDomain: true,*/
      xhrFields: {withCredentials:true},data:JSON.stringify(dataParam),
      contentType:"application/json",
      beforeSend:function(){
         if(ruedaCarga == 1){
            $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
         }
      },
      success:function(data,textStatus,jqXHR){
         switch(data.CODE_RESPONSE){
            case "06":
               sessionStorage.clear();
               document.location.replace(data.PATH);

               break;

            case "07":
               //sessionStorage.clear();
               alert("Sesion expirada");
               document.location.replace(data.PATH);

               break;

            default:
               funcionRespuesta(data);
         }
      },
       error: function(jqXHR,textStatus,errorThrown){
           $.unblockUI();
           console.log("Ruta de error: "+pUrl);
           
           if(gosstError){
               return;
           }

           gosstError = true;
           
           try{
               var responseText = jQuery.parseJSON(jqXHR.responseText);

               if(responseText.CODE_RESPONSE == "12"){
                   alert("Sesión Expirada. Debe loguearse de nuevo.");
                   document.location.href = responseText.PATH;
               }else if (responseText.CODE_RESPONSE == "09"){
//                 alert("No tiene acceso al módulo");
                   console.info('Debe autenticarse.');
                   document.location.href = responseText.PATH;
               }else if (responseText.CODE_RESPONSE == "21"){
                   // P115: la sesion espera el codigo de verificacion; se vuelve al login.
                   alert("Para continuar, ingrese el código de verificación que se envió a su correo.");
                   document.location.href = responseText.PATH;
               }else{
                   // Si se proporciona una función de manejo de error, se ejecuta
        	   alert("Ocurrió un problema al procesar la respuesta del servidor." +
        	       "\n\nSi ello persiste, por favor, repórtelo al soporte de la plataforma GOSST.");
        	   
        	   gosstError = false;
//        	   if(funcionError){
//                       funcionError(jqXHR,textStatus,errorThrown);
//                   }else{
//                       alert("Error inesperado: "+textStatus);
//                   }
               }
           }catch(e){
               // Si ocurre un error inesperado al analizar la respuesta
               alert("Error al procesar la respuesta del servidor.");
               console.error("Error al parsear el JSON de respuesta",e);
               
               gosstError = false;
           }
       }
   });
}

function resaltarObservacionTexto(texto) {
    var asd = (texto == "" ? "" : "<br><strong>(Observación: " + texto + ")</strong>");

    return asd;
}

function verificarIndicadorDocNivelEmpresaContratista(val){
   var hasIndicadorMensualSst = false,hasActaCompromiso = false,hasReglamentoSst = false,hasPoliticaSst = false,
       hasPlanAnualSst = false,hasProgramaSst = false,hasPlanAnualSaludOcupacional = false,hasProgVigilanciaSaludOcupacional = false, 
       hasCertificadoHomologacion = false,hasProcTrabajoSeguroTraAltoRiesgo = false,hasConstanciaLaboral = false,
       hasNoNucleoNegocio = false,hasCartaFianza = false,hasComunicadoSindicales = false,hasComunicadoRepresentantes = false,
       hasComunicadoTrabPrincipal = false,hasComunicadoTrabContratista = false,hasFichaRuc = false,hasConstanciaTercerizadoras = false,
       hasContratoEmpUsuarias = false,hasPartidaRegistral = false,hasAsientoPartidaRegistral = false,hasTrabajosTercerizados = false,
       hasServiciosTercerizados = false,hasServicioTrabajadores = false,hasComiteSupervisorSst = false,hasHojaAtencionSctr = false,
       hasAcuerdoConfidencialidad = false,hasFlujoRespuestaAccidente = false,hasAcuerdoSeguridadTerceros = false,hasAcuerdoSeguridadProveedores = false,
       hasExamNivelCont88 = false,hasExamNivelCont91 = false,hasExamNivelCont92 = false,hasExamNivelCont93 = false,hasExamNivelCont94 = false,
       hasExamNivelCont95 = false,hasExamNivelCont96 = false,hasExamNivelCont97 = false,hasExamNivelCont98 = false,hasExamNivelCont102 = false,
       hasExamNivelCont103 = false,hasExamNivelCont104 = false,hasExamNivelCont105 = false,hasExamNivelCont106 = false,hasExamNivelCont107 = false,
       hasExamNivelCont108 = false,hasExamNivelCont109 = false,hasExamNivelCont110 = false,hasExamNivelCont123 = false,hasExamNivelCont124 = false,
       hasExamNivelCont125 = false,hasExamNivelCont126 = false,hasExamNivelCont127 = false,hasExamNivelCont137 = false,hasExamNivelCont138 = false,
	   hasExamNivelCont139 = false;

   var textoIndicadorMensualSst = iconoGosst.desaprobado+" No vigente / sin documento",
       textoActaCompromiso = iconoGosst.desaprobado+" No vigente / sin documento",
       textoReglamentoSst = iconoGosst.desaprobado+" No vigente / sin documento",
       textoPoliticaSst = iconoGosst.desaprobado+" No vigente / sin documento",
       textoPlanAnualSst = iconoGosst.desaprobado+" No vigente / sin documento",
       textoProgramaSst = iconoGosst.desaprobado+" No vigente / sin documento",
       textoPlanAnualSaludOcupacional = iconoGosst.desaprobado+" No vigente / sin documento",
       textoProgVigilanciaSaludOcupacional = iconoGosst.desaprobado+" No vigente / sin documento",
       textoCertificadoHomologacion = iconoGosst.desaprobado+" No vigente / sin documento",
       textoProcTrabajoSeguroTraAltoRiesgo = iconoGosst.desaprobado+" No vigente / sin documento",
       textoConstanciaLaboral = iconoGosst.desaprobado+" No vigente / sin documento",
       textoNoNucleoNegocio = iconoGosst.desaprobado+" No vigente / sin documento",
       textoCartaFianza = iconoGosst.desaprobado+" No vigente / sin documento",
       textoComunicadoSindicales = iconoGosst.desaprobado+" No vigente / sin documento",
       textoComunicadoRepresentantes = iconoGosst.desaprobado+" No vigente / sin documento",
       textoComunicadoTrabPrincipal = iconoGosst.desaprobado+" No vigente / sin documento",
       textoComunicadoTrabContratista = iconoGosst.desaprobado+" No vigente / sin documento",
       textoFichaRuc = iconoGosst.desaprobado+" No vigente / sin documento",
       textoConstanciaTercerizadoras = iconoGosst.desaprobado+" No vigente / sin documento",
       textoContratoEmpUsuarias = iconoGosst.desaprobado+" No vigente / sin documento",
       textoPartidaRegistral = iconoGosst.desaprobado+" No vigente / sin documento",
       textoAsientoPartidaRegistral = iconoGosst.desaprobado+" No vigente / sin documento",
       textoTrabajosTercerizados = iconoGosst.desaprobado+" No vigente / sin documento",
       textoServiciosTercerizados = iconoGosst.desaprobado+" No vigente / sin documento",
       textoServicioTrabajadores = iconoGosst.desaprobado+" No vigente / sin documento",
       textoComiteSupervisorSst = iconoGosst.desaprobado+" No vigente / sin documento",
       textoHojaAtencionSctr = iconoGosst.desaprobado+" No vigente / sin documento",
       textoAcuerdoConfidencialidad = iconoGosst.desaprobado+" No vigente / sin documento",
       textoFlujoRespuestaAccidente = iconoGosst.desaprobado+" No vigente / sin documento",
       textoAcuerdoSeguridadTerceros = iconoGosst.desaprobado+" No vigente / sin documento",
       textoAcuerdoSeguridadProveedores = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont88 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont91 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont92 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont93 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont94 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont95 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont96 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont97 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont98 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont102 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont103 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont104 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont105 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont106 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont107 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont108 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont109 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont110 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont123 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont124 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont125 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont126 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont127 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont137 = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExamNivelCont138 = iconoGosst.desaprobado+" No vigente / sin documento",textoExamNivelCont139 = iconoGosst.desaprobado+" No vigente / sin documento";

    if (val.habilitadoIndicadorMensualSst == 1) {
        if (val.indicadorMensualSst != null) {
            var iconoHelp, obsIndicadorMensualSst;

            hasIndicadorMensualSst = (val.notaIndicadorMensualSst == 1 ? true : false);
            iconoHelp = (val.notaIndicadorMensualSst == 1 ? iconoGosst.aprobado :
                (val.notaIndicadorMensualSst == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsIndicadorMensualSst = (val.notaIndicadorMensualSst == 1 ? "" : resaltarObservacionTexto(val.observacionIndicadorMensualSst));

            textoIndicadorMensualSst = iconoHelp + " Vigente: " + val.indicadorMensualSst + obsIndicadorMensualSst;
        }
    } else {
        hasIndicadorMensualSst = true
    }

    if (val.habilitadoActaCompromiso == 1) {
        if (val.indicadorActaCompromiso != null) {
            var iconoHelp, obsActaCompromiso;

            hasActaCompromiso = (val.notaActaCompromiso == 1 ? true : false);
            iconoHelp = (val.notaActaCompromiso == 1 ? iconoGosst.aprobado :
                (val.notaActaCompromiso == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsActaCompromiso = (val.notaActaCompromiso == 1 ? "" : resaltarObservacionTexto(val.observacionActaCompromiso));

            textoActaCompromiso = iconoHelp + " Vigente: " + val.indicadorActaCompromiso + obsActaCompromiso;
        }
    } else {
        hasActaCompromiso = true;
    }

    if (val.habilitadoReglamentoSst == 1) {
        if (val.indicadorReglamentoSst != null) {
            var iconoHelp, obsReglamentoSst;

            hasReglamentoSst = (val.notaReglamentoSst == 1 ? true : false);
            iconoHelp = (val.notaReglamentoSst == 1 ? iconoGosst.aprobado :
                (val.notaReglamentoSst == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsReglamentoSst = (val.notaReglamentoSst == 1 ? "" : resaltarObservacionTexto(val.observacionReglamentoSst));

            textoReglamentoSst = iconoHelp + " Vigente: " + val.indicadorReglamentoSst + obsReglamentoSst;
        }
    } else {
        hasReglamentoSst = true;
    }
    //
    if (val.habilitadoPoliticaSst == 1) {
        if (val.indicadorPoliticaSst != null) {
            var iconoHelp, obsPoliticaSst;

            hasPoliticaSst = (val.notaPoliticaSst == 1 ? true : false);
            iconoHelp = (val.notaPoliticaSst == 1 ? iconoGosst.aprobado :
                (val.notaPoliticaSst == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsPoliticaSst = (val.notaPoliticaSst == 1 ? "" : resaltarObservacionTexto(val.observacionPoliticaSst));

            textoPoliticaSst = iconoHelp + " Vigente: " + val.indicadorPoliticaSst + obsPoliticaSst;
        }
    } else {
        hasPoliticaSst = true;
    }

    if (val.habilitadoPlanAnualSst == 1) {
        if (val.indicadorPlanAnualSst != null) {
            var iconoHelp, obsPlanAnualSst;

            hasPlanAnualSst = (val.notaPlanAnualSst == 1 ? true : false);
            iconoHelp = (val.notaPlanAnualSst == 1 ? iconoGosst.aprobado :
                (val.notaPlanAnualSst == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsPlanAnualSst = (val.notaPlanAnualSst == 1 ? "" : resaltarObservacionTexto(val.observacionPlanAnualSst));

            textoPlanAnualSst = iconoHelp + " Vigente: " + val.indicadorPlanAnualSst + obsPlanAnualSst;
        }
    } else {
        hasPlanAnualSst = true;
    }
    //
    if (val.habilitadoProgramaSst == 1) {
        if (val.indicadorProgramaSst != null) {
            var iconoHelp, obsProgramaSst;

            hasProgramaSst = (val.notaProgramaSst == 1 ? true : false);
            iconoHelp = (val.notaProgramaSst == 1 ? iconoGosst.aprobado :
                (val.notaProgramaSst == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsProgramaSst = (val.notaProgramaSst == 1 ? "" : resaltarObservacionTexto(val.observacionProgramaSst));

            textoProgramaSst = iconoHelp + " Vigente: " + val.indicadorProgramaSst + obsProgramaSst;
        }
    } else {
        hasProgramaSst = true;
    }
    //
    if (val.habilitadoPlanAnualSaludOcupacional == 1) {
        if (val.indicadorPlanAnualSaludOcupacional != null) {
            var iconoHelp, obsPlanAnualSaludOcupacional;

            hasPlanAnualSaludOcupacional = (val.notaPlanAnualSaludOcupacional == 1 ? true : false);
            iconoHelp = (val.notaPlanAnualSaludOcupacional == 1 ? iconoGosst.aprobado :
                (val.notaPlanAnualSaludOcupacional == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsPlanAnualSaludOcupacional = (val.notaPlanAnualSaludOcupacional == 1 ? "" :
                resaltarObservacionTexto(val.observacionPlanAnualSaludOcupacional));

            textoPlanAnualSaludOcupacional = iconoHelp + " Vigente: " + val.indicadorPlanAnualSaludOcupacional + obsPlanAnualSaludOcupacional;
        }
    } else {
        hasPlanAnualSaludOcupacional = true;
    }

    if (val.habilitadoProgVigilanciaSaludOcupacional == 1) {
        if (val.indicadorProgVigilanciaSaludOcupacional != null) {
            var iconoHelp, obsProgVigilanciaSaludOcupacional;

            hasProgVigilanciaSaludOcupacional = (val.notaProgVigilanciaSaludOcupacional == 1 ? true : false);
            iconoHelp = (val.notaProgVigilanciaSaludOcupacional == 1 ? iconoGosst.aprobado :
                (val.notaProgVigilanciaSaludOcupacional == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsProgVigilanciaSaludOcupacional = (val.notaProgVigilanciaSaludOcupacional == 1 ? "" :
                resaltarObservacionTexto(val.observacionProgVigilanciaSaludOcupacional));

            textoProgVigilanciaSaludOcupacional = iconoHelp + " Vigente: " + val.indicadorProgVigilanciaSaludOcupacional + obsProgVigilanciaSaludOcupacional;
        }
    } else {
        hasProgVigilanciaSaludOcupacional = true;
    }

    if (val.habilitadoCertificadoHomologacion == 1) {
        if (val.indicadorCertificadoHomologacion != null) {
            var iconoHelp, obsCertificadoHomologacion;

            hasCertificadoHomologacion = (val.notaCertificadoHomologacion == 1 ? true : false);
            iconoHelp = (val.notaCertificadoHomologacion == 1 ? iconoGosst.aprobado :
                (val.notaCertificadoHomologacion == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsCertificadoHomologacion = (val.notaCertificadoHomologacion == 1 ? "" :
                resaltarObservacionTexto(val.observacionCertificadoHomologacion));

            textoCertificadoHomologacion = iconoHelp + " Vigente: " + val.indicadorCertificadoHomologacion + obsCertificadoHomologacion;
        }
    } else {
        hasCertificadoHomologacion = true;
    }

    if (val.habilitadoProcTrabajoSeguroTraAltoRiesgo == 1) {
        if (val.indicadorProcTrabajoSeguroTraAltoRiesgo != null) {
            var iconoHelp, obsProcTrabajoSeguroTraAltoRiesgo;

            hasProcTrabajoSeguroTraAltoRiesgo = (val.notaProcTrabajoSeguroTraAltoRiesgo == 1 ? true : false);
            iconoHelp = (val.notaProcTrabajoSeguroTraAltoRiesgo == 1 ? iconoGosst.aprobado :
                (val.notaProcTrabajoSeguroTraAltoRiesgo == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsProcTrabajoSeguroTraAltoRiesgo = (val.notaProcTrabajoSeguroTraAltoRiesgo == 1 ? "" :
                resaltarObservacionTexto(val.observacionProcTrabajoSeguroTraAltoRiesgo));

            textoProcTrabajoSeguroTraAltoRiesgo = iconoHelp + " Vigente: " + val.indicadorProcTrabajoSeguroTraAltoRiesgo + obsProcTrabajoSeguroTraAltoRiesgo;
        }
    } else {
        hasProcTrabajoSeguroTraAltoRiesgo = true;
    }

    if (val.habilitadoConstanciaLaboral == 1) {
        if (val.indicadorConstanciaLaboral != null) {
            var iconoHelp, obsConstanciaLaboral;

            hasConstanciaLaboral = (val.notaConstanciaLaboral == 1 ? true : false);
            iconoHelp = (val.notaConstanciaLaboral == 1 ? iconoGosst.aprobado :
                (val.notaConstanciaLaboral == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsConstanciaLaboral = (val.notaConstanciaLaboral == 1 ? "" :
                resaltarObservacionTexto(val.observacionConstanciaLaboral));

            textoConstanciaLaboral = iconoHelp + " Vigente: " + val.indicadorConstanciaLaboral + obsConstanciaLaboral;
        }
    } else {
        hasConstanciaLaboral = true;
    }

    if (val.habilitadoNoNucleoNegocio == 1) {
        if (val.indicadorNoNucleoNegocio != null) {
            var iconoHelp, obsNoNucleoNegocio;

            hasNoNucleoNegocio = (val.notaNoNucleoNegocio == 1 ? true : false);
            iconoHelp = (val.notaNoNucleoNegocio == 1 ? iconoGosst.aprobado :
                (val.notaNoNucleoNegocio == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsNoNucleoNegocio = (val.notaNoNucleoNegocio == 1 ? "" :
                resaltarObservacionTexto(val.observacionNoNucleoNegocio));

            textoNoNucleoNegocio = iconoHelp + " Vigente: " + val.indicadorNoNucleoNegocio + obsNoNucleoNegocio;
        }
    } else {
        hasNoNucleoNegocio = true;
    }

    if (val.habilitadoCartaFianza == 1) {
        if (val.indicadorCartaFianza != null) {
            var iconoHelp, obsCartaFianza;

            hasCartaFianza = (val.notaCartaFianza == 1 ? true : false);
            iconoHelp = (val.notaCartaFianza == 1 ? iconoGosst.aprobado :
                (val.notaCartaFianza == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsCartaFianza = (val.notaCartaFianza == 1 ? "" :
                resaltarObservacionTexto(val.observacionCartaFianza));

            textoCartaFianza = iconoHelp + " Vigente: " + val.indicadorCartaFianza + obsCartaFianza;
        }
    } else {
        hasCartaFianza = true;
    }

    if (val.habilitadoComunicadoSindicales == 1) {
        if (val.indicadorComunicadoSindicales != null) {
            var iconoHelp, obsComunicadoSindicales;

            hasComunicadoSindicales = (val.notaComunicadoSindicales == 1 ? true : false);
            iconoHelp = (val.notaComunicadoSindicales == 1 ? iconoGosst.aprobado :
                (val.notaComunicadoSindicales == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsComunicadoSindicales = (val.notaComunicadoSindicales == 1 ? "" :
                resaltarObservacionTexto(val.observacionComunicadoSindicales));

            textoComunicadoSindicales = iconoHelp + " Vigente: " + val.indicadorComunicadoSindicales + obsComunicadoSindicales;
        }
    } else {
        hasComunicadoSindicales = true;
    }

    if (val.habilitadoComunicadoRepresentantes == 1) {
        if (val.indicadorComunicadoRepresentantes != null) {
            var iconoHelp, obsComunicadoRepresentantes;

            hasComunicadoRepresentantes = (val.notaComunicadoRepresentantes == 1 ? true : false);
            iconoHelp = (val.notaComunicadoRepresentantes == 1 ? iconoGosst.aprobado :
                (val.notaComunicadoRepresentantes == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsComunicadoRepresentantes = (val.notaComunicadoRepresentantes == 1 ? "" :
                resaltarObservacionTexto(val.observacionComunicadoRepresentantes));

            textoComunicadoRepresentantes = iconoHelp + " Vigente: " + val.indicadorComunicadoRepresentantes + obsComunicadoRepresentantes;
        }
    } else {
        hasComunicadoRepresentantes = true;
    }

    if (val.habilitadoComunicadoTrabPrincipal == 1) {
        if (val.indicadorComunicadoTrabPrincipal != null) {
            var iconoHelp, obsComunicadoTrabPrincipal;

            hasComunicadoTrabPrincipal = (val.notaComunicadoTrabPrincipal == 1 ? true : false);
            iconoHelp = (val.notaComunicadoTrabPrincipal == 1 ? iconoGosst.aprobado :
                (val.notaComunicadoTrabPrincipal == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsComunicadoTrabPrincipal = (val.notaComunicadoTrabPrincipal == 1 ? "" :
                resaltarObservacionTexto(val.observacionComunicadoTrabPrincipal));

            textoComunicadoTrabPrincipal = iconoHelp + " Vigente: " + val.indicadorComunicadoTrabPrincipal + obsComunicadoTrabPrincipal;
        }
    } else {
        hasComunicadoTrabPrincipal = true;
    }

    if (val.habilitadoComunicadoTrabContratista == 1) {
        if (val.indicadorComunicadoTrabContratista != null) {
            var iconoHelp, obsComunicadoTrabContratista;

            hasComunicadoTrabContratista = (val.notaComunicadoTrabContratista == 1 ? true : false);
            iconoHelp = (val.notaComunicadoTrabContratista == 1 ? iconoGosst.aprobado :
                (val.notaComunicadoTrabContratista == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsComunicadoTrabContratista = (val.notaComunicadoTrabContratista == 1 ? "" :
                resaltarObservacionTexto(val.observacionComunicadoTrabContratista));

            textoComunicadoTrabContratista = iconoHelp + " Vigente: " + val.indicadorComunicadoTrabContratista + obsComunicadoTrabContratista;
        }
    } else {
        hasComunicadoTrabContratista = true;
    }

    if (val.habilitadoFichaRuc == 1) {
        if (val.indicadorFichaRuc != null) {
            var iconoHelp, obsFichaRuc;

            hasFichaRuc = (val.notaFichaRuc == 1 ? true : false);
            iconoHelp = (val.notaFichaRuc == 1 ? iconoGosst.aprobado :
                (val.notaFichaRuc == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsFichaRuc = (val.notaFichaRuc == 1 ? "" :
                resaltarObservacionTexto(val.observacionFichaRuc));

            textoFichaRuc = iconoHelp + " Vigente: " + val.indicadorFichaRuc + obsFichaRuc;
        }
    } else {
        hasFichaRuc = true;
    }

    if (val.habilitadoConstanciaTercerizadoras == 1) {
        if (val.indicadorConstanciaTercerizadoras != null) {
            var iconoHelp, obsConstanciaTercerizadoras;

            hasConstanciaTercerizadoras = (val.notaConstanciaTercerizadoras == 1 ? true : false);
            iconoHelp = (val.notaConstanciaTercerizadoras == 1 ? iconoGosst.aprobado :
                (val.notaConstanciaTercerizadoras == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsConstanciaTercerizadoras = (val.notaConstanciaTercerizadoras == 1 ? "" :
                resaltarObservacionTexto(val.observacionConstanciaTercerizadoras));

            textoConstanciaTercerizadoras = iconoHelp + " Vigente: " + val.indicadorConstanciaTercerizadoras + obsConstanciaTercerizadoras;
        }
    } else {
        hasConstanciaTercerizadoras = true;
    }

    if (val.habilitadoContratoEmpUsuarias == 1) {
        if (val.indicadorContratoEmpUsuarias != null) {
            var iconoHelp, obsContratoEmpUsuarias;

            hasContratoEmpUsuarias = (val.notaContratoEmpUsuarias == 1 ? true : false);
            iconoHelp = (val.notaContratoEmpUsuarias == 1 ? iconoGosst.aprobado :
                (val.notaContratoEmpUsuarias == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsContratoEmpUsuarias = (val.notaContratoEmpUsuarias == 1 ? "" :
                resaltarObservacionTexto(val.observacionContratoEmpUsuarias));

            textoContratoEmpUsuarias = iconoHelp + " Vigente: " + val.indicadorContratoEmpUsuarias + obsContratoEmpUsuarias;
        }
    } else {
        hasContratoEmpUsuarias = true;
    }

    if (val.habilitadoPartidaRegistral == 1) {
        if (val.indicadorPartidaRegistral != null) {
            var iconoHelp, obsPartidaRegistral;

            hasPartidaRegistral = (val.notaPartidaRegistral == 1 ? true : false);
            iconoHelp = (val.notaPartidaRegistral == 1 ? iconoGosst.aprobado :
                (val.notaPartidaRegistral == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsPartidaRegistral = (val.notaPartidaRegistral == 1 ? "" :
                resaltarObservacionTexto(val.observacionPartidaRegistral));

            textoPartidaRegistral = iconoHelp + " Vigente: " + val.indicadorPartidaRegistral + obsPartidaRegistral;
        }
    } else {
        hasPartidaRegistral = true;
    }

    if (val.habilitadoAsientoPartidaRegistral == 1) {
        if (val.indicadorAsientoPartidaRegistral != null) {
            var iconoHelp, obsAsientoPartidaRegistral;

            hasAsientoPartidaRegistral = (val.notaAsientoPartidaRegistral == 1 ? true : false);
            iconoHelp = (val.notaAsientoPartidaRegistral == 1 ? iconoGosst.aprobado :
                (val.notaAsientoPartidaRegistral == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsAsientoPartidaRegistral = (val.notaAsientoPartidaRegistral == 1 ? "" :
                resaltarObservacionTexto(val.observacionAsientoPartidaRegistral));

            textoAsientoPartidaRegistral = iconoHelp + " Vigente: " + val.indicadorAsientoPartidaRegistral + obsAsientoPartidaRegistral;
        }
    } else {
        hasAsientoPartidaRegistral = true;
    }

    if (val.habilitadoTrabajosTercerizados == 1) {
        if (val.indicadorTrabajosTercerizados != null) {
            var iconoHelp, obsTrabajosTercerizados;

            hasTrabajosTercerizados = (val.notaTrabajosTercerizados == 1 ? true : false);
            iconoHelp = (val.notaTrabajosTercerizados == 1 ? iconoGosst.aprobado :
                (val.notaTrabajosTercerizados == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsTrabajosTercerizados = (val.notaTrabajosTercerizados == 1 ? "" :
                resaltarObservacionTexto(val.observacionTrabajosTercerizados));

            textoTrabajosTercerizados = iconoHelp + " Vigente: " + val.indicadorTrabajosTercerizados + obsTrabajosTercerizados;
        }
    } else {
        hasTrabajosTercerizados = true;
    }

    if (val.habilitadoServiciosTercerizados == 1) {
        if (val.indicadorServiciosTercerizados != null) {
            var iconoHelp, obsServiciosTercerizados;

            hasServiciosTercerizados = (val.notaServiciosTercerizados == 1 ? true : false);
            iconoHelp = (val.notaServiciosTercerizados == 1 ? iconoGosst.aprobado :
                (val.notaServiciosTercerizados == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsServiciosTercerizados = (val.notaServiciosTercerizados == 1 ? "" :
                resaltarObservacionTexto(val.observacionServiciosTercerizados));

            textoServiciosTercerizados = iconoHelp + " Vigente: " + val.indicadorServiciosTercerizados + obsServiciosTercerizados;
        }
    } else {
        hasServiciosTercerizados = true;
    }

    if (val.habilitadoServicioTrabajadores == 1) {
        if (val.indicadorServicioTrabajadores != null) {
            var iconoHelp, obsServicioTrabajadores;

            hasServicioTrabajadores = (val.notaServicioTrabajadores == 1 ? true : false);
            iconoHelp = (val.notaServicioTrabajadores == 1 ? iconoGosst.aprobado :
                (val.notaServicioTrabajadores == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsServicioTrabajadores = (val.notaServicioTrabajadores == 1 ? "" :
                resaltarObservacionTexto(val.observacionServicioTrabajadores));

         textoServicioTrabajadores = iconoHelp+" Vigente: "+val.indicadorServicioTrabajadores+obsServicioTrabajadores;
      }
   }else{
      hasServicioTrabajadores = true;
   }
   
   if(val.habilitadoComiteSupervisorSst == 1){
      if(val.indicadorComiteSupervisorSst != null){
         var iconoHelp,obsComiteSupervisorSst;

         hasComiteSupervisorSst = (val.notaComiteSupervisorSst == 1?true:false);
         iconoHelp = (val.notaComiteSupervisorSst == 1?iconoGosst.aprobado:
            (val.notaComiteSupervisorSst == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsComiteSupervisorSst = (val.notaComiteSupervisorSst == 1?"":
            resaltarObservacionTexto(val.observacionComiteSupervisorSst));

         textoComiteSupervisorSst = iconoHelp+" Vigente: "+val.indicadorComiteSupervisorSst+obsComiteSupervisorSst;
      }
   }else{
      hasComiteSupervisorSst = true;
   }

   if(val.habilitadoHojaAtencionSctr == 1){
      if(val.indicadorHojaAtencionSctr != null){
         var iconoHelp,obsHojaAtencionSctr;

         hasHojaAtencionSctr = (val.notaHojaAtencionSctr == 1?true:false);
         iconoHelp = (val.notaHojaAtencionSctr == 1?iconoGosst.aprobado:
            (val.notaHojaAtencionSctr == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsHojaAtencionSctr = (val.notaHojaAtencionSctr == 1?"":
            resaltarObservacionTexto(val.observacionHojaAtencionSctr));

         textoHojaAtencionSctr = iconoHelp+" Vigente: "+val.indicadorHojaAtencionSctr+obsHojaAtencionSctr;
      }
   }else{
      hasHojaAtencionSctr = true;
   }

   if(val.habilitadoAcuerdoConfidencialidad == 1){
      if(val.indicadorAcuerdoConfidencialidad != null){
         var iconoHelp,obsAcuerdoConfidencialidad;

         hasAcuerdoConfidencialidad = (val.notaAcuerdoConfidencialidad == 1?true:false);
         iconoHelp = (val.notaAcuerdoConfidencialidad == 1?iconoGosst.aprobado:
            (val.notaAcuerdoConfidencialidad == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsAcuerdoConfidencialidad = (val.notaAcuerdoConfidencialidad == 1?"":
            resaltarObservacionTexto(val.observacionAcuerdoConfidencialidad));

         textoAcuerdoConfidencialidad = iconoHelp+" Vigente: "+val.indicadorAcuerdoConfidencialidad+obsAcuerdoConfidencialidad;
      }
   }else{
      hasAcuerdoConfidencialidad = true;
   }

   if(val.habilitadoFlujoRespuestaAccidente == 1){
      if(val.indicadorFlujoRespuestaAccidente != null){
         var iconoHelp,obsFlujoRespuestaAccidente;

         hasFlujoRespuestaAccidente = (val.notaFlujoRespuestaAccidente == 1?true:false);
         iconoHelp = (val.notaFlujoRespuestaAccidente == 1?iconoGosst.aprobado:
            (val.notaFlujoRespuestaAccidente == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsFlujoRespuestaAccidente = (val.notaFlujoRespuestaAccidente == 1?"":
            resaltarObservacionTexto(val.observacionFlujoRespuestaAccidente));

         textoFlujoRespuestaAccidente = iconoHelp+" Vigente: "+val.indicadorFlujoRespuestaAccidente+obsFlujoRespuestaAccidente;
      }
   }else{
      hasFlujoRespuestaAccidente = true;
   }

   if(val.habilitadoAcuerdoSeguridadTerceros == 1){
      if(val.indicadorAcuerdoSeguridadTerceros != null){
         var iconoHelp,obsAcuerdoSeguridadTerceros;

         hasAcuerdoSeguridadTerceros = (val.notaAcuerdoSeguridadTerceros == 1?true:false);
         iconoHelp = (val.notaAcuerdoSeguridadTerceros == 1?iconoGosst.aprobado:
            (val.notaAcuerdoSeguridadTerceros == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsAcuerdoSeguridadTerceros = (val.notaAcuerdoSeguridadTerceros == 1?"":
            resaltarObservacionTexto(val.observacionAcuerdoSeguridadTerceros));

         textoAcuerdoSeguridadTerceros = iconoHelp+" Vigente: "+val.indicadorAcuerdoSeguridadTerceros+obsAcuerdoSeguridadTerceros;
      }
   }else{
      hasAcuerdoSeguridadTerceros = true;
   }

   if(val.habilitadoAcuerdoSeguridadProveedores == 1){
      if(val.indicadorAcuerdoSeguridadProveedores != null){
         var iconoHelp,obsAcuerdoSeguridadProveedores;

         hasAcuerdoSeguridadProveedores = (val.notaAcuerdoSeguridadProveedores == 1?true:false);
         iconoHelp = (val.notaAcuerdoSeguridadProveedores == 1?iconoGosst.aprobado:
            (val.notaAcuerdoSeguridadProveedores == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsAcuerdoSeguridadProveedores = (val.notaAcuerdoSeguridadProveedores == 1?"":
            resaltarObservacionTexto(val.observacionAcuerdoSeguridadProveedores));

         textoAcuerdoSeguridadProveedores = iconoHelp+" Vigente: "+val.indicadorAcuerdoSeguridadProveedores+obsAcuerdoSeguridadProveedores;
      }
   }else{
      hasAcuerdoSeguridadProveedores = true;
   }

    if(val.habilitadoExamNivelCont88 == 1){
        if(val.indicadorExamNivelCont88 != null){
            var iconoHelp,obsExamNivelCont88;

            hasExamNivelCont88 = (val.notaExamNivelCont88 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont88 == 1?iconoGosst.aprobado:(val.notaExamNivelCont88 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont88 = (val.notaExamNivelCont88 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont88));

            textoExamNivelCont88 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont88+obsExamNivelCont88;
        }
    }else{
        hasExamNivelCont88 = true;
    }

    if(val.habilitadoExamNivelCont91 == 1){
        if(val.indicadorExamNivelCont91 != null){
            var iconoHelp,obsExamNivelCont91;

            hasExamNivelCont91 = (val.notaExamNivelCont91 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont91 == 1?iconoGosst.aprobado:(val.notaExamNivelCont91 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont91 = (val.notaExamNivelCont91 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont91));

            textoExamNivelCont91 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont91+obsExamNivelCont91;
        }
    }else{
        hasExamNivelCont91 = true;
    }

    if(val.habilitadoExamNivelCont92 == 1){
        if(val.indicadorExamNivelCont92 != null){
            var iconoHelp,obsExamNivelCont92;

            hasExamNivelCont92 = (val.notaExamNivelCont92 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont92 == 1?iconoGosst.aprobado:(val.notaExamNivelCont92 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont92 = (val.notaExamNivelCont92 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont92));

            textoExamNivelCont92 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont92+obsExamNivelCont92;
        }
    }else{
        hasExamNivelCont92 = true;
    }

    if(val.habilitadoExamNivelCont93 == 1){
        if(val.indicadorExamNivelCont93 != null){
            var iconoHelp,obsExamNivelCont93;

            hasExamNivelCont93 = (val.notaExamNivelCont93 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont93 == 1?iconoGosst.aprobado:(val.notaExamNivelCont93 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont93 = (val.notaExamNivelCont93 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont93));

            textoExamNivelCont93 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont93+obsExamNivelCont93;
        }
    }else{
        hasExamNivelCont93 = true;
    }

    if(val.habilitadoExamNivelCont94 == 1){
        if(val.indicadorExamNivelCont94 != null){
            var iconoHelp,obsExamNivelCont94;

            hasExamNivelCont94 = (val.notaExamNivelCont94 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont94 == 1?iconoGosst.aprobado:(val.notaExamNivelCont94 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont94 = (val.notaExamNivelCont94 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont94));

            textoExamNivelCont94 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont94+obsExamNivelCont94;
        }
    }else{
        hasExamNivelCont94 = true;
    }

    if(val.habilitadoExamNivelCont95 == 1){
        if(val.indicadorExamNivelCont95 != null){
            var iconoHelp,obsExamNivelCont95;

            hasExamNivelCont95 = (val.notaExamNivelCont95 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont95 == 1?iconoGosst.aprobado:(val.notaExamNivelCont95 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont95 = (val.notaExamNivelCont95 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont95));

            textoExamNivelCont95 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont95+obsExamNivelCont95;
        }
    }else{
        hasExamNivelCont95 = true;
    }

    if(val.habilitadoExamNivelCont96 == 1){
        if(val.indicadorExamNivelCont96 != null){
            var iconoHelp,obsExamNivelCont96;

            hasExamNivelCont96 = (val.notaExamNivelCont96 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont96 == 1?iconoGosst.aprobado:(val.notaExamNivelCont96 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont96 = (val.notaExamNivelCont96 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont96));

            textoExamNivelCont96 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont96+obsExamNivelCont96;
        }
    }else{
        hasExamNivelCont96 = true;
    }

    if(val.habilitadoExamNivelCont97 == 1){
        if(val.indicadorExamNivelCont97 != null){
            var iconoHelp,obsExamNivelCont97;

            hasExamNivelCont97 = (val.notaExamNivelCont97 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont97 == 1?iconoGosst.aprobado:(val.notaExamNivelCont97 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont97 = (val.notaExamNivelCont97 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont97));

            textoExamNivelCont97 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont97+obsExamNivelCont97;
        }
    }else{
        hasExamNivelCont97 = true;
    }

    if(val.habilitadoExamNivelCont98 == 1){
        if(val.indicadorExamNivelCont98 != null){
            var iconoHelp,obsExamNivelCont98;

            hasExamNivelCont98 = (val.notaExamNivelCont98 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont98 == 1?iconoGosst.aprobado:(val.notaExamNivelCont98 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont98 = (val.notaExamNivelCont98 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont98));

            textoExamNivelCont98 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont98+obsExamNivelCont98;
        }
    }else{
        hasExamNivelCont98 = true;
    }
    
    if(val.habilitadoExamNivelCont102 == 1){
        if(val.indicadorExamNivelCont102 != null){
            var iconoHelp,obsExamNivelCont102;

            hasExamNivelCont102 = (val.notaExamNivelCont102 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont102 == 1?iconoGosst.aprobado:(val.notaExamNivelCont102 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont102 = (val.notaExamNivelCont102 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont102));

            textoExamNivelCont102 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont102+obsExamNivelCont102;
        }
    }else{
        hasExamNivelCont102 = true;
    }
    
    if(val.habilitadoExamNivelCont103 == 1){
        if(val.indicadorExamNivelCont103 != null){
            var iconoHelp,obsExamNivelCont103;

            hasExamNivelCont103 = (val.notaExamNivelCont103 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont103 == 1?iconoGosst.aprobado:(val.notaExamNivelCont103 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont103 = (val.notaExamNivelCont103 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont103));

            textoExamNivelCont103 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont103+obsExamNivelCont103;
        }
    }else{
        hasExamNivelCont103 = true;
    }
    
    if(val.habilitadoExamNivelCont104 == 1){
        if(val.indicadorExamNivelCont104 != null){
            var iconoHelp,obsExamNivelCont104;

            hasExamNivelCont104 = (val.notaExamNivelCont104 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont104 == 1?iconoGosst.aprobado:(val.notaExamNivelCont104 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont104 = (val.notaExamNivelCont104 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont104));

            textoExamNivelCont104 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont104+obsExamNivelCont104;
        }
    }else{
        hasExamNivelCont104 = true;
    }
    
    if(val.habilitadoExamNivelCont105 == 1){
        if(val.indicadorExamNivelCont105 != null){
            var iconoHelp,obsExamNivelCont105;

            hasExamNivelCont105 = (val.notaExamNivelCont105 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont105 == 1?iconoGosst.aprobado:(val.notaExamNivelCont105 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont105 = (val.notaExamNivelCont105 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont105));

            textoExamNivelCont105 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont105+obsExamNivelCont105;
        }
    }else{
        hasExamNivelCont105 = true;
    }
    
    if(val.habilitadoExamNivelCont106 == 1){
        if(val.indicadorExamNivelCont106 != null){
            var iconoHelp,obsExamNivelCont106;

            hasExamNivelCont106 = (val.notaExamNivelCont106 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont106 == 1?iconoGosst.aprobado:(val.notaExamNivelCont106 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont106 = (val.notaExamNivelCont106 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont106));

            textoExamNivelCont106 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont106+obsExamNivelCont106;
        }
    }else{
        hasExamNivelCont106 = true;
    }
    
    if(val.habilitadoExamNivelCont107 == 1){
        if(val.indicadorExamNivelCont107 != null){
            var iconoHelp,obsExamNivelCont107;

            hasExamNivelCont107 = (val.notaExamNivelCont107 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont107 == 1?iconoGosst.aprobado:(val.notaExamNivelCont107 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont107 = (val.notaExamNivelCont107 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont107));

            textoExamNivelCont107 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont107+obsExamNivelCont107;
        }
    }else{
        hasExamNivelCont107 = true;
    }
    
    if(val.habilitadoExamNivelCont108 == 1){
        if(val.indicadorExamNivelCont108 != null){
            var iconoHelp,obsExamNivelCont108;

            hasExamNivelCont108 = (val.notaExamNivelCont108 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont108 == 1?iconoGosst.aprobado:(val.notaExamNivelCont108 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont108 = (val.notaExamNivelCont108 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont108));

            textoExamNivelCont108 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont108+obsExamNivelCont108;
        }
    }else{
        hasExamNivelCont108 = true;
    }
    
    if(val.habilitadoExamNivelCont109 == 1){
        if(val.indicadorExamNivelCont109 != null){
            var iconoHelp,obsExamNivelCont109;

            hasExamNivelCont109 = (val.notaExamNivelCont109 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont109 == 1?iconoGosst.aprobado:(val.notaExamNivelCont109 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont109 = (val.notaExamNivelCont109 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont109));

            textoExamNivelCont109 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont109+obsExamNivelCont109;
        }
    }else{
        hasExamNivelCont109 = true;
    }
    
    if(val.habilitadoExamNivelCont110 == 1){
        if(val.indicadorExamNivelCont110 != null){
            var iconoHelp,obsExamNivelCont110;

            hasExamNivelCont110 = (val.notaExamNivelCont110 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont110 == 1?iconoGosst.aprobado:(val.notaExamNivelCont110 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont110 = (val.notaExamNivelCont110 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont110));

            textoExamNivelCont110 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont110+obsExamNivelCont110;
        }
    }else{
        hasExamNivelCont110 = true;
    }
    
    if(val.habilitadoExamNivelCont123 == 1){
        if(val.indicadorExamNivelCont123 != null){
            var iconoHelp,obsExamNivelCont123;

            hasExamNivelCont123 = (val.notaExamNivelCont123 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont123 == 1?iconoGosst.aprobado:(val.notaExamNivelCont123 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont123 = (val.notaExamNivelCont123 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont123));

            textoExamNivelCont123 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont123+obsExamNivelCont123;
        }
    }else{
        hasExamNivelCont123 = true;
    }
    
    if(val.habilitadoExamNivelCont124 == 1){
        if(val.indicadorExamNivelCont124 != null){
            var iconoHelp,obsExamNivelCont124;

            hasExamNivelCont124 = (val.notaExamNivelCont124 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont124 == 1?iconoGosst.aprobado:(val.notaExamNivelCont124 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont124 = (val.notaExamNivelCont124 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont124));

            textoExamNivelCont124 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont124+obsExamNivelCont124;
        }
    }else{
        hasExamNivelCont124 = true;
    }
    
    if(val.habilitadoExamNivelCont125 == 1){
        if(val.indicadorExamNivelCont125 != null){
            var iconoHelp,obsExamNivelCont125;

            hasExamNivelCont125 = (val.notaExamNivelCont125 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont125 == 1?iconoGosst.aprobado:(val.notaExamNivelCont125 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont125 = (val.notaExamNivelCont125 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont125));

            textoExamNivelCont125 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont125+obsExamNivelCont125;
        }
    }else{
        hasExamNivelCont125 = true;
    }
    
    if(val.habilitadoExamNivelCont126 == 1){
        if(val.indicadorExamNivelCont126 != null){
            var iconoHelp,obsExamNivelCont126;

            hasExamNivelCont126 = (val.notaExamNivelCont126 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont126 == 1?iconoGosst.aprobado:(val.notaExamNivelCont126 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont126 = (val.notaExamNivelCont126 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont126));

            textoExamNivelCont126 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont126+obsExamNivelCont126;
        }
    }else{
        hasExamNivelCont126 = true;
    }
    
    if(val.habilitadoExamNivelCont127 == 1){
        if(val.indicadorExamNivelCont127 != null){
            var iconoHelp,obsExamNivelCont127;

            hasExamNivelCont127 = (val.notaExamNivelCont127 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont127 == 1?iconoGosst.aprobado:(val.notaExamNivelCont127 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont127 = (val.notaExamNivelCont127 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont127));

            textoExamNivelCont127 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont127+obsExamNivelCont127;
        }
    }else{
        hasExamNivelCont127 = true;
    }

    if(val.habilitadoExamNivelCont137 == 1){
        if(val.indicadorExamNivelCont137 != null){
            var iconoHelp,obsExamNivelCont137;

            hasExamNivelCont137 = (val.notaExamNivelCont137 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont137 == 1?iconoGosst.aprobado:(val.notaExamNivelCont137 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont137 = (val.notaExamNivelCont137 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont137));

            textoExamNivelCont137 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont137+obsExamNivelCont137;
        }
    }else{
        hasExamNivelCont137 = true;
    }

    if(val.habilitadoExamNivelCont138 == 1){
        if(val.indicadorExamNivelCont138 != null){
            var iconoHelp,obsExamNivelCont138;

            hasExamNivelCont138 = (val.notaExamNivelCont138 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont138 == 1?iconoGosst.aprobado:(val.notaExamNivelCont138 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont138 = (val.notaExamNivelCont138 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont138));

            textoExamNivelCont138 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont138+obsExamNivelCont138;
        }
    }else{
        hasExamNivelCont138 = true;
    }

    if(val.habilitadoExamNivelCont139 == 1){
        if(val.indicadorExamNivelCont139 != null){
            var iconoHelp,obsExamNivelCont139;

            hasExamNivelCont139 = (val.notaExamNivelCont139 == 1?true:false);
            iconoHelp = (val.notaExamNivelCont139 == 1?iconoGosst.aprobado:(val.notaExamNivelCont139 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelCont139 = (val.notaExamNivelCont139 == 1?"":resaltarObservacionTexto(val.observacionExamNivelCont139));

            textoExamNivelCont139 = iconoHelp+" Vigente: "+val.indicadorExamNivelCont139+obsExamNivelCont139;
        }
    }else{
        hasExamNivelCont139 = true;
    }

   var isHabilitado = false;

   if(hasIndicadorMensualSst && hasActaCompromiso && hasReglamentoSst && hasPoliticaSst && hasPlanAnualSst && hasProgramaSst &&
      hasPlanAnualSaludOcupacional && hasProgVigilanciaSaludOcupacional && hasCertificadoHomologacion && hasProcTrabajoSeguroTraAltoRiesgo &&
      hasConstanciaLaboral && hasNoNucleoNegocio && hasCartaFianza && hasComunicadoSindicales && hasComunicadoRepresentantes && 
      hasComunicadoTrabPrincipal && hasComunicadoTrabContratista && hasFichaRuc && hasConstanciaTercerizadoras && hasContratoEmpUsuarias &&
      hasPartidaRegistral && hasAsientoPartidaRegistral && hasTrabajosTercerizados && hasServiciosTercerizados && hasServicioTrabajadores &&
      hasComiteSupervisorSst && hasHojaAtencionSctr && hasAcuerdoConfidencialidad && hasFlujoRespuestaAccidente && hasAcuerdoSeguridadTerceros &&
      hasAcuerdoSeguridadProveedores && hasExamNivelCont88 && hasExamNivelCont91 && hasExamNivelCont92 && hasExamNivelCont93 && hasExamNivelCont94 &&
       hasExamNivelCont95 && hasExamNivelCont96 && hasExamNivelCont97 && hasExamNivelCont98 && hasExamNivelCont102 && hasExamNivelCont103 && 
       hasExamNivelCont104 && hasExamNivelCont105 && hasExamNivelCont106 && hasExamNivelCont107 && hasExamNivelCont108 && hasExamNivelCont109 &&
       hasExamNivelCont110 && hasExamNivelCont123 && hasExamNivelCont124 && hasExamNivelCont125 && hasExamNivelCont126 && hasExamNivelCont127 && 
	   hasExamNivelCont137 && hasExamNivelCont138 && hasExamNivelCont139){
      isHabilitado = true;
   }

   return {
      isHabilitado:isHabilitado,textoIndicadorMensualSst:textoIndicadorMensualSst,textoActaCompromiso:textoActaCompromiso,
      textoReglamentoSst:textoReglamentoSst,textoPoliticaSst:textoPoliticaSst,textoPlanAnualSst:textoPlanAnualSst,
      textoProgramaSst:textoProgramaSst,textoPlanAnualSaludOcupacional:textoPlanAnualSaludOcupacional,
      textoProgVigilanciaSaludOcupacional:textoProgVigilanciaSaludOcupacional,textoCertificadoHomologacion:textoCertificadoHomologacion,
      textoProcTrabajoSeguroTraAltoRiesgo:textoProcTrabajoSeguroTraAltoRiesgo,textoConstanciaLaboral:textoConstanciaLaboral,
      textoNoNucleoNegocio:textoNoNucleoNegocio,textoCartaFianza:textoCartaFianza,textoComunicadoSindicales:textoComunicadoSindicales,
      textoComunicadoRepresentantes:textoComunicadoRepresentantes,textoComunicadoTrabPrincipal:textoComunicadoTrabPrincipal,
      textoComunicadoTrabContratista:textoComunicadoTrabContratista,textoFichaRuc:textoFichaRuc,
      textoConstanciaTercerizadoras:textoConstanciaTercerizadoras,textoContratoEmpUsuarias:textoContratoEmpUsuarias,
      textoPartidaRegistral:textoPartidaRegistral,textoAsientoPartidaRegistral:textoAsientoPartidaRegistral,
      textoTrabajosTercerizados:textoTrabajosTercerizados,textoServiciosTercerizados:textoServiciosTercerizados,
      textoServicioTrabajadores:textoServicioTrabajadores,textoComiteSupervisorSst:textoComiteSupervisorSst,textoHojaAtencionSctr:textoHojaAtencionSctr,
      textoAcuerdoConfidencialidad:textoAcuerdoConfidencialidad,textoFlujoRespuestaAccidente:textoFlujoRespuestaAccidente,
      textoAcuerdoSeguridadTerceros:textoAcuerdoSeguridadTerceros,textoAcuerdoSeguridadProveedores:textoAcuerdoSeguridadProveedores,
       textoExamNivelCont88:textoExamNivelCont88,textoExamNivelCont91:textoExamNivelCont91,textoExamNivelCont92:textoExamNivelCont92,
       textoExamNivelCont93:textoExamNivelCont93,textoExamNivelCont94:textoExamNivelCont94,textoExamNivelCont95:textoExamNivelCont95,
       textoExamNivelCont96:textoExamNivelCont96,textoExamNivelCont97:textoExamNivelCont97,textoExamNivelCont98:textoExamNivelCont98,
       textoExamNivelCont102:textoExamNivelCont102,textoExamNivelCont103:textoExamNivelCont103,textoExamNivelCont104:textoExamNivelCont104,
       textoExamNivelCont105:textoExamNivelCont105,textoExamNivelCont106:textoExamNivelCont106,textoExamNivelCont107:textoExamNivelCont107,
       textoExamNivelCont108:textoExamNivelCont108,textoExamNivelCont109:textoExamNivelCont109,textoExamNivelCont110:textoExamNivelCont110,
       textoExamNivelCont123:textoExamNivelCont123,textoExamNivelCont124:textoExamNivelCont124,textoExamNivelCont125:textoExamNivelCont125,
       textoExamNivelCont126:textoExamNivelCont126,textoExamNivelCont127:textoExamNivelCont127,textoExamNivelCont137:textoExamNivelCont137,
	   textoExamNivelCont138:textoExamNivelCont138,textoExamNivelCont139:textoExamNivelCont139
   }
}

function verificarIndicadorDocNivelProyectoContratista(val) {
    var hasActividadPrograma = false, hasPlanEmergencia = false, hasPlanManejoResiduo = false, hasPlanCovid = false,
        hasRegCapRealizadas = false, hasOrdenCompra = false, hasCronogramaTrabajo = false, hasProgramaCharlas = false,
        hasMatrizRiesgoDoc = false, hasProcedimientoAts = false, hasHojaMsds = false,hasInstructivoTrabAltoRiesgo = false,
        hasMatrizAspectoAmbiental = false,hasActividad19 = false,hasActividad20 = false,hasActividad21 = false,hasActividad22 = false,
		hasActividad23 = false,hasActividad24 = false,hasActividad25 = false,hasActividad26 = false,hasActividad27 = false,hasActividad28 = false;

    var textoActividadPrograma = iconoGosst.desaprobado + " 0 / 0 documentos",textoPlanEmergencia = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoPlanManejoResiduo = iconoGosst.desaprobado + " 0 / 0 documentos",textoPlanCovid = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoRegCapRealizadas = iconoGosst.desaprobado + " 0 / 0 documentos",textoOrdenCompra = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoCronogramaTrabajo = iconoGosst.desaprobado + " 0 / 0 documentos",textoProgramaCharlas = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoMatrizRiesgoDoc = iconoGosst.desaprobado + " 0 / 0 documentos",textoProcedimientoAts = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoHojaMsds = iconoGosst.desaprobado + " 0 / 0 documentos",textoInstructivoTrabAltoRiesgo = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoMatrizAspectoAmbiental = iconoGosst.desaprobado + " 0 / 0 documentos",textoActividad19 = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoActividad20 = iconoGosst.desaprobado + " 0 / 0 documentos",textoActividad21 = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoActividad22 = iconoGosst.desaprobado + " 0 / 0 documentos",textoActividad23 = iconoGosst.desaprobado + " 0 / 0 documentos",
		textoActividad24 = iconoGosst.desaprobado + " 0 / 0 documentos",textoActividad25 = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoActividad26 = iconoGosst.desaprobado + " 0 / 0 documentos",textoActividad27 = iconoGosst.desaprobado + " 0 / 0 documentos",
        textoActividad28 = iconoGosst.desaprobado + " 0 / 0 documentos";

    if (val.habilitadoActividad1 == 1) {
        if (val.postulante.indicadorActividades1 != "0 / 0") {
            var iconoHelp;

            hasActividadPrograma = (val.postulante.indicadorActividadesDecimal1 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal1 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad1.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoActividadPrograma = iconoHelp + " " + val.postulante.indicadorActividades1 + " documentos" +
                (val.detalleDocActividad1.length > 0?"<br>["+val.detalleDocActividad1+"]":"");
        }
    } else {
        hasActividadPrograma = true;
    }

    if (val.habilitadoActividad2 == 1) {
        if (val.postulante.indicadorActividades2 != "0 / 0") {
            var iconoHelp;

            hasPlanEmergencia = (val.postulante.indicadorActividadesDecimal2 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal2 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad2.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoPlanEmergencia = iconoHelp + " " + val.postulante.indicadorActividades2 + " documentos" +
                (val.detalleDocActividad2.length > 0?"<br>["+val.detalleDocActividad2+"]":"");
        }
    } else {
        hasPlanEmergencia = true;
    }

    if (val.habilitadoActividad4 == 1) {
        if (val.postulante.indicadorActividades4 != "0 / 0") {
            var iconoHelp;

            hasPlanManejoResiduo = (val.postulante.indicadorActividadesDecimal4 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal4 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad4.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoPlanManejoResiduo = iconoHelp + " " + val.postulante.indicadorActividades4 + " documentos" +
                (val.detalleDocActividad4.length > 0?"<br>["+val.detalleDocActividad4+"]":"");
        }
    } else {
        hasPlanManejoResiduo = true;
    }

    if (val.habilitadoActividad6 == 1) {
        if (val.postulante.indicadorActividades6 != "0 / 0") {
            var iconoHelp;

            hasPlanCovid = (val.postulante.indicadorActividadesDecimal6 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal6 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad6.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoPlanCovid = iconoHelp + " " + val.postulante.indicadorActividades6 + " documentos" +
                (val.detalleDocActividad6.length > 0?"<br>["+val.detalleDocActividad6+"]":"");
        }
    } else {
        hasPlanCovid = true;
    }

    if (val.habilitadoActividad7 == 1) {
        if (val.postulante.indicadorActividades7 != "0 / 0") {
            var iconoHelp;

            hasMatrizRiesgoDoc = (val.postulante.indicadorActividadesDecimal7 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal7 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad7.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoMatrizRiesgoDoc = iconoHelp + " " + val.postulante.indicadorActividades7 + " documentos" +
            (val.detalleDocActividad7.length > 0?"<br>["+val.detalleDocActividad7+"]":"");
        }
    } else {
        hasMatrizRiesgoDoc = true;
    }

    if (val.habilitadoActividad10 == 1) {
        if (val.postulante.indicadorActividades10 != "0 / 0") {
            var iconoHelp;

            hasRegCapRealizadas = (val.postulante.indicadorActividadesDecimal10 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal10 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad10.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoRegCapRealizadas = iconoHelp + " " + val.postulante.indicadorActividades10 + " documentos" +
                (val.detalleDocActividad10.length > 0?"<br>["+val.detalleDocActividad10+"]":"");
        }
    } else {
        hasRegCapRealizadas = true;
    }

    if (val.habilitadoActividad11 == 1) {
        if (val.postulante.indicadorActividades11 != "0 / 0") {
            var iconoHelp;

            hasOrdenCompra = (val.postulante.indicadorActividadesDecimal11 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal11 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad11.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoOrdenCompra = iconoHelp + " " + val.postulante.indicadorActividades11 + " documentos" +
                (val.detalleDocActividad11.length > 0?"<br>["+val.detalleDocActividad11+"]":"");
        }
    } else {
        hasOrdenCompra = true;
    }

    if (val.habilitadoActividad12 == 1) {
        if (val.postulante.indicadorActividades12 != "0 / 0") {
            var iconoHelp;

            hasCronogramaTrabajo = (val.postulante.indicadorActividadesDecimal12 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal12 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad12.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoCronogramaTrabajo = iconoHelp + " " + val.postulante.indicadorActividades12 + " documentos" +
                (val.detalleDocActividad12.length > 0?"<br>["+val.detalleDocActividad12+"]":"");
        }
    } else {
        hasCronogramaTrabajo = true;
    }

    if (val.habilitadoActividad13 == 1) {
        if (val.postulante.indicadorActividades13 != "0 / 0") {
            var iconoHelp;

            hasProgramaCharlas = (val.postulante.indicadorActividadesDecimal13 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal13 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad13.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoProgramaCharlas = iconoHelp + " " + val.postulante.indicadorActividades13 + " documentos" +
                (val.detalleDocActividad13.length > 0?"<br>["+val.detalleDocActividad13+"]":"");
        }
    } else {
        hasProgramaCharlas = true;
    }

    if (val.habilitadoActividad14 == 1) {
        if (val.postulante.indicadorActividades14 != "0 / 0") {
            var iconoHelp;

            hasProcedimientoAts = (val.postulante.indicadorActividadesDecimal14 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal14 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad14.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoProcedimientoAts = iconoHelp + " " + val.postulante.indicadorActividades14 + " documentos" +
                (val.detalleDocActividad14.length > 0?"<br>["+val.detalleDocActividad14+"]":"");
        }
    } else {
        hasProcedimientoAts = true;
    }

    if (val.habilitadoActividad15 == 1) {
        if (val.postulante.indicadorActividades15 != "0 / 0") {
            var iconoHelp;

            hasHojaMsds = (val.postulante.indicadorActividadesDecimal15 == 1.00 ? true : false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal15 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad15.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoHojaMsds = iconoHelp + " " + val.postulante.indicadorActividades15 + " documentos" +
                (val.detalleDocActividad15.length > 0?"<br>["+val.detalleDocActividad15+"]":"");
        }
    } else {
        hasHojaMsds = true;
    }

   if(val.habilitadoActividad16 == 1){
      if(val.postulante.indicadorActividades16 != "0 / 0"){
         var iconoHelp;

         hasInstructivoTrabAltoRiesgo = (val.postulante.indicadorActividadesDecimal16 == 1.00?true:false);
         iconoHelp = (val.postulante.indicadorActividadesDecimal16 == 1.00?iconoGosst.aprobado:
             (val.detalleDocActividad16.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

         textoInstructivoTrabAltoRiesgo = iconoHelp+" "+val.postulante.indicadorActividades16+" documentos" +
             (val.detalleDocActividad16.length > 0?"<br>["+val.detalleDocActividad16+"]":"");
      }
   }else{
      hasInstructivoTrabAltoRiesgo = true;
   }

   if(val.habilitadoActividad18 == 1){
      if(val.postulante.indicadorActividades18 != "0 / 0"){
         var iconoHelp;

         hasMatrizAspectoAmbiental = (val.postulante.indicadorActividadesDecimal18 == 1.00?true:false);
         iconoHelp = (val.postulante.indicadorActividadesDecimal18 == 1.00?iconoGosst.aprobado:
             (val.detalleDocActividad18.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

         textoMatrizAspectoAmbiental = iconoHelp+" "+val.postulante.indicadorActividades18+" documentos" +
             (val.detalleDocActividad18.length > 0?"<br>["+val.detalleDocActividad18+"]":"");
      }
   }else{
      hasMatrizAspectoAmbiental = true;
   }

    if(val.habilitadoActividad19 == 1){
        if(val.postulante.indicadorActividades19 != "0 / 0"){
            var iconoHelp;

            hasActividad19 = (val.postulante.indicadorActividadesDecimal19 == 1.00?true:false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal19 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad19.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoActividad19 = iconoHelp+" "+val.postulante.indicadorActividades19+" documentos" +
                (val.detalleDocActividad19.length > 0?"<br>["+val.detalleDocActividad19+"]":"");
        }
    }else{
        hasActividad19 = true;
    }

    if(val.habilitadoActividad20 == 1){
        if(val.postulante.indicadorActividades20 != "0 / 0"){
            var iconoHelp;

            hasActividad20 = (val.postulante.indicadorActividadesDecimal20 == 1.00?true:false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal20 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad20.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoActividad20 = iconoHelp+" "+val.postulante.indicadorActividades20+" documentos" +
                (val.detalleDocActividad20.length > 0?"<br>["+val.detalleDocActividad20+"]":"");
        }
    }else{
        hasActividad20 = true;
    }

    if(val.habilitadoActividad21 == 1){
        if(val.postulante.indicadorActividades21 != "0 / 0"){
            var iconoHelp;

            hasActividad21 = (val.postulante.indicadorActividadesDecimal21 == 1.00?true:false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal21 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad21.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoActividad21 = iconoHelp+" "+val.postulante.indicadorActividades21+" documentos" +
                (val.detalleDocActividad21.length > 0?"<br>["+val.detalleDocActividad21+"]":"");
        }
    }else{
        hasActividad21 = true;
    }

    if(val.habilitadoActividad22 == 1){
        if(val.postulante.indicadorActividades22 != "0 / 0"){
            var iconoHelp;

            hasActividad22 = (val.postulante.indicadorActividadesDecimal22 == 1.00?true:false);
            iconoHelp = (val.postulante.indicadorActividadesDecimal22 == 1.00?iconoGosst.aprobado:
                (val.detalleDocActividad22.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

            textoActividad22 = iconoHelp+" "+val.postulante.indicadorActividades22+" documentos" +
                (val.detalleDocActividad22.length > 0?"<br>["+val.detalleDocActividad22+"]":"");
        }
    }else{
        hasActividad22 = true;
    }
	
	if(val.habilitadoActividad23 == 1){
	    if(val.postulante.indicadorActividades23 != "0 / 0"){
	        var iconoHelp;

	        hasActividad23 = (val.postulante.indicadorActividadesDecimal23 == 1.00?true:false);
	        iconoHelp = (val.postulante.indicadorActividadesDecimal23 == 1.00?iconoGosst.aprobado:
	            (val.detalleDocActividad23.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

	        textoActividad23 = iconoHelp+" "+val.postulante.indicadorActividades23+" documentos" +
	            (val.detalleDocActividad23.length > 0?"<br>["+val.detalleDocActividad23+"]":"");
	    }
	}else{
	    hasActividad23 = true;
	}
		
	if(val.habilitadoActividad24 == 1){
		if(val.postulante.indicadorActividades24 != "0 / 0"){
		    var iconoHelp;

		    hasActividad24 = (val.postulante.indicadorActividadesDecimal24 == 1.00?true:false);
		    iconoHelp = (val.postulante.indicadorActividadesDecimal24 == 1.00?iconoGosst.aprobado:
		        (val.detalleDocActividad24.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

		    textoActividad24 = iconoHelp+" "+val.postulante.indicadorActividades24+" documentos" +
		        (val.detalleDocActividad24.length > 0?"<br>["+val.detalleDocActividad24+"]":"");
		}
	}else{
		hasActividad24 = true;
    }

	if(val.habilitadoActividad25 == 1){
		if(val.postulante.indicadorActividades25 != "0 / 0"){
		    var iconoHelp;

		    hasActividad25 = (val.postulante.indicadorActividadesDecimal25 == 1.00?true:false);
		    iconoHelp = (val.postulante.indicadorActividadesDecimal25 == 1.00?iconoGosst.aprobado:
		        (val.detalleDocActividad25.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

		    textoActividad25 = iconoHelp+" "+val.postulante.indicadorActividades25+" documentos" +
		        (val.detalleDocActividad25.length > 0?"<br>["+val.detalleDocActividad25+"]":"");
		}
	}else{
		hasActividad25 = true;
    }

	if(val.habilitadoActividad26 == 1){
		if(val.postulante.indicadorActividades26 != "0 / 0"){
		    var iconoHelp;

		    hasActividad26 = (val.postulante.indicadorActividadesDecimal26 == 1.00?true:false);
		    iconoHelp = (val.postulante.indicadorActividadesDecimal26 == 1.00?iconoGosst.aprobado:
		        (val.detalleDocActividad26.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

		    textoActividad26 = iconoHelp+" "+val.postulante.indicadorActividades26+" documentos" +
		        (val.detalleDocActividad26.length > 0?"<br>["+val.detalleDocActividad26+"]":"");
		}
	}else{
		hasActividad26 = true;
    }

	if(val.habilitadoActividad27 == 1){
		if(val.postulante.indicadorActividades27 != "0 / 0"){
		    var iconoHelp;

		    hasActividad27 = (val.postulante.indicadorActividadesDecimal27 == 1.00?true:false);
		    iconoHelp = (val.postulante.indicadorActividadesDecimal27 == 1.00?iconoGosst.aprobado:
		        (val.detalleDocActividad27.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

		    textoActividad27 = iconoHelp+" "+val.postulante.indicadorActividades27+" documentos" +
		        (val.detalleDocActividad27.length > 0?"<br>["+val.detalleDocActividad27+"]":"");
		}
	}else{
		hasActividad27 = true;
    }

	if(val.habilitadoActividad28 == 1){
		if(val.postulante.indicadorActividades28 != "0 / 0"){
		    var iconoHelp;

		    hasActividad28 = (val.postulante.indicadorActividadesDecimal28 == 1.00?true:false);
		    iconoHelp = (val.postulante.indicadorActividadesDecimal28 == 1.00?iconoGosst.aprobado:
		        (val.detalleDocActividad28.includes("observado")?iconoGosst.advertir:iconoGosst.por_realizar));

		    textoActividad28 = iconoHelp+" "+val.postulante.indicadorActividades28+" documentos" +
		        (val.detalleDocActividad28.length > 0?"<br>["+val.detalleDocActividad28+"]":"");
		}
	}else{
		hasActividad28 = true;
    }

   var isHabilitado = false;

   if(hasActividadPrograma && hasPlanEmergencia && hasPlanManejoResiduo && hasPlanCovid && hasRegCapRealizadas && hasOrdenCompra &&
      hasCronogramaTrabajo && hasProgramaCharlas && hasMatrizRiesgoDoc && hasProcedimientoAts && hasHojaMsds && hasInstructivoTrabAltoRiesgo &&
      hasMatrizAspectoAmbiental && hasActividad19 && hasActividad20 && hasActividad21 && hasActividad22 && hasActividad23 && hasActividad24 &&
      hasActividad25 && hasActividad26 && hasActividad27 && hasActividad28){
      isHabilitado = true;
   }

   return {
      isHabilitado:isHabilitado,textoActividadPrograma:textoActividadPrograma,textoPlanEmergencia:textoPlanEmergencia,textoPlanManejoResiduo:textoPlanManejoResiduo,
      textoPlanCovid:textoPlanCovid,textoRegCapRealizadas:textoRegCapRealizadas,textoOrdenCompra:textoOrdenCompra,textoCronogramaTrabajo:textoCronogramaTrabajo,
      textoProgramaCharlas:textoProgramaCharlas,textoMatrizRiesgoDoc:textoMatrizRiesgoDoc,textoProcedimientoAts:textoProcedimientoAts,textoHojaMsds:textoHojaMsds,
      textoInstructivoTrabAltoRiesgo:textoInstructivoTrabAltoRiesgo,textoMatrizAspectoAmbiental:textoMatrizAspectoAmbiental,textoActividad19:textoActividad19,
       textoActividad20:textoActividad20,textoActividad21:textoActividad21,textoActividad22:textoActividad22,textoActividad23:textoActividad23,
	   textoActividad24:textoActividad24,textoActividad25:textoActividad25,textoActividad26:textoActividad26,textoActividad27:textoActividad27,
	   textoActividad28:textoActividad28
   }
}

function verificarIndicadorDocNivelTrabajadorContratista(val1,val2){
    var hasExamen = false,hasSctr = false,hasInduccion = false,hasCargo = false,
        hasTreg = false,hasHojaVida = false,hasEpp = false,hasInduccionSst = false,
        hasPruebaCovid = false,hasVacunaCovid = false,hasCertificadoPolicial = false,
        hasAntecedentesPenales = false,hasSeguroAccidentes = false,hasRiesgoExposicionPuestoTrabajo = false,
        hasVacunacionCovid = false,hasCarnetSanidad = false,hasAcuerdoSeguridadEquElec = false,
        hasEvaluacionToxicologica = false,hasCertifUnicoLaboral = false,hasAntecedentesPoliciales = false,
        hasDeclaracionVerifDomicilio = false,hasDotacionIndumentaria = false,hasSancion = false,
        hasPrevencionista = false,hasEntrevistaPrevencionista = false,hasHabilitadoMedicoClinica = false,hasExamNivelTrabCont84 = false,
        hasExamNivelTrabCont89 = false,hasExamNivelTrabCont90 = false,hasExamNivelTrabCont99 = false,hasExamNivelTrabCont100 = false,
        hasExamNivelTrabCont101 = false,hasExamNivelTrabCont111 = false,hasExamNivelTrabCont112 = false,hasExamNivelTrabCont113 = false,
        hasExamNivelTrabCont114 = false,hasExamNivelTrabCont115 = false,hasExamNivelTrabCont116 = false,hasExamNivelTrabCont117 = false,
        hasExamNivelTrabCont118 = false,hasExamNivelTrabCont119 = false,hasExamNivelTrabCont128 = false,hasExamNivelTrabCont129 = false,
        hasExamNivelTrabCont130 = false,hasExamNivelTrabCont131 = false,hasExamNivelTrabCont132 = false,hasExamNivelTrabCont133 = false,
        hasExamNivelTrabCont134 = false,hasExamNivelTrabCont140 = false,hasExamNivelTrabCont141 = false,hasExamNivelTrabCont142 = false,
        hasExamNivelTrabCont143 = false,hasExamNivelTrabCont144 = false,hasExamNivelTrabCont145 = false,hasExamNivelTrabCont146 = false,
        hasExamNivelTrabCont147 = false,hasExamNivelTrabCont148 = false,hasExamNivelTrabCont149 = false,hasExamNivelTrabCont150 = false,
        hasExamNivelTrabCont151 = false,hasExamNivelTrabCont152 = false,hasExamNivelTrabCont153 = false,hasExamNivelTrabCont154 = false,
        hasExamNivelTrabCont155 = false,hasExamNivelTrabCont156 = false,hasExamNivelTrabCont157 = false,hasExamNivelTrabCont158 = false,
        hasExamNivelTrabCont159 = false;

    var textoExamen = iconoGosst.desaprobado+" No vigente",textoSctr = iconoGosst.desaprobado+" No vigente",
        textoInduccion = iconoGosst.desaprobado+" No vigente",textoCargo = iconoGosst.desaprobado+" No vigente",
        textoTreg = iconoGosst.desaprobado+" No vigente",textoHojaVida = iconoGosst.desaprobado+" No vigente",
        textoEpp = iconoGosst.desaprobado+" No vigente",textoInduccionSst = iconoGosst.desaprobado+" No vigente",
        textoPruebaCovid = iconoGosst.desaprobado+" No vigente",textoVacunaCovid = iconoGosst.desaprobado+" No vigente",
        textoCertificadoPolicial = iconoGosst.desaprobado+" No vigente",textoPrevencionista = "No",
        textoAntecedentesPenales = iconoGosst.desaprobado+" No vigente",textoSeguroAccidentes = iconoGosst.desaprobado+" No vigente",
        textoRiesgoExposicionPuestoTrabajo = iconoGosst.desaprobado+" No vigente",textoVacunacionCovid = iconoGosst.desaprobado+" No vigente",
        textoCarnetSanidad = iconoGosst.desaprobado+" No vigente",textoAcuerdoSeguridadEquElec = iconoGosst.desaprobado+" No vigente",
        textoEvaluacionToxicologica = iconoGosst.desaprobado+" No vigente",textoCertifUnicoLaboral = iconoGosst.desaprobado+" No vigente",
        textoAntecedentesPoliciales = iconoGosst.desaprobado+" No vigente",textoDeclaracionVerifDomicilio = iconoGosst.desaprobado+" No vigente",
        textoDotacionIndumentaria = iconoGosst.desaprobado+" No vigente",textoSancion = iconoGosst.aprobado+" NO",
        textoEntrevistaPrevencionista = "------",textoHabilitadoMedicoClinica = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont84 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont89 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont90 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont99 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont100 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont101 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont111 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont112 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont113 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont114 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont115 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont116 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont117 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont118 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont119 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont128 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont129 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont130 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont131 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont132 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont133 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont134 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont140 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont141 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont142 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont143 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont144 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont145 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont146 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont147 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont148 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont149 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont150 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont151 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont152 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont153 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont154 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont155 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont156 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont157 = iconoGosst.desaprobado+" No vigente",
        textoExamNivelTrabCont158 = iconoGosst.desaprobado+" No vigente",textoExamNivelTrabCont159 = iconoGosst.desaprobado+" No vigente";

    if (val2.habilitadoCertAptMedica == 1) {
        if (val1.indicadorExamenMedico != null) {
            var iconoHelp, obsExam;

            hasExamen = (val1.notaExamenMedico == 1 ? true : false);
            iconoHelp = (val1.notaExamenMedico == 1 ? iconoGosst.aprobado :
                (val1.notaExamenMedico == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            // obsExam = (val1.notaExamenMedico == 1 ? "" : resaltarObservacionTexto(val1.observacionExamenMedico));
            obsExam = resaltarObservacionTexto(val1.observacionExamenMedico);

            textoExamen = iconoHelp + " Vigente: " + val1.indicadorExamenMedico + obsExam;
        }
    } else {
        hasExamen = true;
    }

    if (val2.habilitadoSctr == 1) {
        if (val1.indicadorSctr != null) {
            var iconoHelp, obsSctr;

            hasSctr = (val1.notaSctr == 1 ? true : false);
            iconoHelp = (val1.notaSctr == 1 ? iconoGosst.aprobado :
                (val1.notaSctr == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsSctr = (val1.notaSctr == 1 ? "" : resaltarObservacionTexto(val1.observacionSctr));

            textoSctr = iconoHelp + " Vigente: " + val1.indicadorSctr + obsSctr;
        }
    } else {
        hasSctr = true;
    }

    if (val2.habilitacionInduccion3 == 1) {
        if (val1.indicadorInduccion != null) {
            // tipo_virtual_id = 1 -> Normal, tipo_virtual_id = 2 -> Virtual
            var iconoHelp, obsInduc;

            hasInduccion = (val1.notaInduccion == 1 ? true : false);
            iconoHelp = (val1.notaInduccion == 1 ? iconoGosst.aprobado :
                (val1.notaInduccion == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsInduc = (val1.notaInduccion == 1 ? "" : resaltarObservacionTexto(val1.observacionInduccion));

            textoInduccion = iconoHelp + " Vigente: " + val1.indicadorInduccion + obsInduc;
        }
    } else {
        hasInduccion = true;
    }
    //
    if (val2.habilitadoCargReglamento == 1) {
        if (val1.indicadorCargo != null) {
            var iconoHelp, obsCargo;

            hasCargo = (val1.notaCargo == 1 ? true : false);
            iconoHelp = (val1.notaCargo == 1 ? iconoGosst.aprobado :
                (val1.notaCargo == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsCargo = (val1.notaCargo == 1 ? "" : resaltarObservacionTexto(val1.observacionCargo));

            textoCargo = iconoHelp + " Vigente: " + val1.indicadorCargo + obsCargo;
        }
    } else {
        hasCargo = true;
    }

    if (val2.habilitadoTRegistro == 1) {
        if (val1.indicadorRegistro != null) {
            var iconoHelp, obsReg;

            hasTreg = (val1.notaRegistro == 1 ? true : false);
            iconoHelp = (val1.notaRegistro == 1 ? iconoGosst.aprobado :
                (val1.notaRegistro == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsReg = (val1.notaRegistro == 1 ? "" : resaltarObservacionTexto(val1.observacionRegistro));

            textoTreg = iconoHelp + " Vigente: " + val1.indicadorRegistro + obsReg;
        }
    } else {
        hasTreg = true;
    }
    //
    if (val2.habilitadoEpp == 1) {
        if (val1.indicadorEpp != null) {
            var iconoHelp, obsEpp;

            hasEpp = (val1.notaEpp == 1 ? true : false);
            iconoHelp = (val1.notaEpp == 1 ? iconoGosst.aprobado :
                (val1.notaEpp == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsEpp = (val1.notaEpp == 1 ? "" : resaltarObservacionTexto(val1.observacionEpp));

            textoEpp = iconoHelp + " Vigente: " + val1.indicadorEpp + obsEpp;
        }
    } else {
        hasEpp = true;
    }
    //
    if (val2.habilitadoHojaVida == 1) {
        if (val1.notaHojaVida != null) {
            //SOLO tipo_hoja_vida_id = 4
            var iconoHelp, obsHojaVida;

            hasHojaVida = (val1.notaHojaVida == 1 ? true : false);
            iconoHelp = (val1.notaHojaVida == 1 ? iconoGosst.aprobado :
                (val1.notaHojaVida == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsHojaVida = (val1.notaHojaVida == 1 ? "" : resaltarObservacionTexto(val1.observacionHojaVida));

            textoHojaVida = iconoHelp + " Vigente " + obsHojaVida;
        }
    } else {
        hasHojaVida = true;
    }

    if (val2.habilitadoInduccSstCont == 1) {
        if (val1.indicadorInduccionSst != null) {
            var iconoHelp, obsInduccionSst;

            hasInduccionSst = (val1.notaInduccionSst == 1 ? true : false);
            iconoHelp = (val1.notaInduccionSst == 1 ? iconoGosst.aprobado :
                (val1.notaInduccionSst == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsInduccionSst = (val1.notaInduccionSst == 1 ? "" : resaltarObservacionTexto(val1.observacionInduccionSst));

            textoInduccionSst = iconoHelp + " Vigente: " + val1.indicadorInduccionSst + obsInduccionSst;
        }
    } else {
        hasInduccionSst = true;
    }

    if (val2.habilitadoPruebaCovid == 1) {
        if (val1.indicadorPruebaCovid != null) {
            var iconoHelp, obsPruebaCovid;

            hasPruebaCovid = (val1.notaPruebaCovid == 1 ? true : false);
            iconoHelp = (val1.notaPruebaCovid == 1 ? iconoGosst.aprobado :
                (val1.notaPruebaCovid == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsPruebaCovid = (val1.notaPruebaCovid == 1 ? "" : resaltarObservacionTexto(val1.observacionPruebaCovid));

            textoPruebaCovid = iconoHelp + " Vigente: " + val1.indicadorPruebaCovid + obsPruebaCovid;
        }
    } else {
        hasPruebaCovid = true;
    }

    if (val2.habilitadoVacunaCovid == 1) {
        if (val1.indicadorVacunaCovid != null) {
            var iconoHelp, obsVacunaCovid;

            hasVacunaCovid = (val1.notaVacunaCovid == 1 ? true : false);
            iconoHelp = (val1.notaVacunaCovid == 1 ? iconoGosst.aprobado :
                (val1.notaVacunaCovid == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsVacunaCovid = (val1.notaVacunaCovid == 1 ? "" : resaltarObservacionTexto(val1.observacionVacunaCovid));

            textoVacunaCovid = iconoHelp + " Vigente: " + val1.indicadorVacunaCovid + obsVacunaCovid;
        }
    } else {
        hasVacunaCovid = true;
    }

    if (val2.habilitadoCertifPolicial == 1) {
        if (val1.indicadorCertificadoPolicial != null) {
            var iconoHelp, obsCertificadoPolicial;

            hasCertificadoPolicial = (val1.notaCertificadoPolicial == 1 ? true : false);
            iconoHelp = (val1.notaCertificadoPolicial == 1 ? iconoGosst.aprobado :
                (val1.notaCertificadoPolicial == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
            obsCertificadoPolicial = (val1.notaCertificadoPolicial == 1 ? "" : resaltarObservacionTexto(val1.observacionCertificadoPolicial));

            textoCertificadoPolicial = iconoHelp + " Vigente: " + val1.indicadorCertificadoPolicial + obsCertificadoPolicial;
        }
    } else {
        hasCertificadoPolicial = true;
    }

    if(val2.habilitadoEsPrevencionista == 1 && val1.esPrevencionista == 1){
        textoPrevencionista = "Sí";

        if(val2.habilitadoPrevencionista == 1){
            if(val1.notaPrevencionista != null){
                var iconoHelp,obsPrevencionista;

                hasPrevencionista = (val1.notaPrevencionista == 1?true:false);
                iconoHelp = (val1.notaPrevencionista == 1?iconoGosst.aprobado:(val1.notaPrevencionista == 2?iconoGosst.advertir:iconoGosst.por_realizar));
                // obsPrevencionista = (val1.notaPrevencionista == 1?"":resaltarObservacionTexto(val1.observacionPrevencionista));
                obsPrevencionista = resaltarObservacionTexto(val1.observacionPrevencionista);

                textoPrevencionista = "Sí <br>"+iconoHelp+" Vigente "+obsPrevencionista;
            }else{
                textoPrevencionista = "Sí <br>"+iconoGosst.desaprobado+" No vigente";
            }
        }else{
            hasPrevencionista = true;
        }
    }else{
        hasPrevencionista = true;
    }

    if(val2.habilitadoEsPrevencionista == 1 && val1.esPrevencionista == 1 && val2.habilitadoEntrevistaPrevencionista == 1){
        hasEntrevistaPrevencionista = (val1.notaEntrevistaPrevencionista == 1?true:false);
        textoEntrevistaPrevencionista = val1.estadoEntrevistaPrevencionista;
    }else{
        hasEntrevistaPrevencionista = true;
    }

   if(val2.habilitadoAntecedentesPenales == 1){
      if(val1.indicadorAntecedentesPenales != null){
         var iconoHelp, obsAntecedentesPenales;

         hasAntecedentesPenales = (val1.notaAntecedentesPenales == 1?true:false);
         iconoHelp = (val1.notaAntecedentesPenales == 1?iconoGosst.aprobado:
            (val1.notaAntecedentesPenales == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsAntecedentesPenales = (val1.notaAntecedentesPenales == 1?"" :resaltarObservacionTexto(val1.observacionAntecedentesPenales));

         textoAntecedentesPenales = iconoHelp+" Vigente: "+val1.indicadorAntecedentesPenales+obsAntecedentesPenales;
      }
   }else{
      hasAntecedentesPenales = true;
   }

   if(val2.habilitadoSeguroAccidentes == 1){
      if(val1.indicadorSeguroAccidentes != null){
         var iconoHelp,obsSeguroAccidentes;

         hasSeguroAccidentes = (val1.notaSeguroAccidentes == 1?true:false);
         iconoHelp = (val1.notaSeguroAccidentes == 1?iconoGosst.aprobado:
            (val1.notaSeguroAccidentes == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsSeguroAccidentes = (val1.notaSeguroAccidentes == 1?"":resaltarObservacionTexto(val1.observacionSeguroAccidentes));

         textoSeguroAccidentes = iconoHelp+" Vigente: "+val1.indicadorSeguroAccidentes+obsSeguroAccidentes;
      }
   }else{
      hasSeguroAccidentes = true;
   }

   if(val2.habilitadoRiesgoExposicionPuestoTrabajo == 1){
      if(val1.indicadorRiesgoExposicionPuestoTrabajo != null){
         var iconoHelp,obsRiesgoExposicionPuestoTrabajo;

         hasRiesgoExposicionPuestoTrabajo = (val1.notaRiesgoExposicionPuestoTrabajo == 1?true:false);
         iconoHelp = (val1.notaRiesgoExposicionPuestoTrabajo == 1?iconoGosst.aprobado:
            (val1.notaRiesgoExposicionPuestoTrabajo == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsRiesgoExposicionPuestoTrabajo = (val1.notaRiesgoExposicionPuestoTrabajo == 1?"":resaltarObservacionTexto(val1.observacionRiesgoExposicionPuestoTrabajo));

         textoRiesgoExposicionPuestoTrabajo = iconoHelp+" Vigente: "+val1.indicadorRiesgoExposicionPuestoTrabajo+obsRiesgoExposicionPuestoTrabajo;
      }
   }else{
      hasRiesgoExposicionPuestoTrabajo = true;
   }

   if(val2.habilitadoVacunacionCovid == 1){
      if(val1.indicadorVacunacionCovid != null){
         var iconoHelp,obsVacunacionCovid;

         hasVacunacionCovid = (val1.notaVacunacionCovid == 1?true:false);
         iconoHelp = (val1.notaVacunacionCovid == 1?iconoGosst.aprobado:
            (val1.notaVacunacionCovid == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsVacunacionCovid = (val1.notaVacunacionCovid == 1?"":resaltarObservacionTexto(val1.observacionVacunacionCovid));

         textoVacunacionCovid = iconoHelp+" Vigente: "+val1.indicadorVacunacionCovid+obsVacunacionCovid;
      }
   }else{
      hasVacunacionCovid = true;
   }

   if(val2.habilitadoCarnetSanidad == 1){
      if(val1.indicadorCarnetSanidad != null){
         var iconoHelp,obsCarnetSanidad;

         hasCarnetSanidad = (val1.notaCarnetSanidad == 1?true:false);
         iconoHelp = (val1.notaCarnetSanidad == 1?iconoGosst.aprobado:
            (val1.notaCarnetSanidad == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsCarnetSanidad = (val1.notaCarnetSanidad == 1?"":resaltarObservacionTexto(val1.observacionCarnetSanidad));

         textoCarnetSanidad = iconoHelp+" Vigente: "+val1.indicadorCarnetSanidad+obsCarnetSanidad;
      }
   }else{
      hasCarnetSanidad = true;
   }

   if(val2.habilitadoAcuerdoSeguridadEquElec == 1){
      if(val1.indicadorAcuerdoSeguridadEquElec != null){
         var iconoHelp,obsAcuerdoSeguridadEquElec;

         hasAcuerdoSeguridadEquElec = (val1.notaAcuerdoSeguridadEquElec == 1?true:false);
         iconoHelp = (val1.notaAcuerdoSeguridadEquElec == 1?iconoGosst.aprobado:
            (val1.notaAcuerdoSeguridadEquElec == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsAcuerdoSeguridadEquElec = (val1.notaAcuerdoSeguridadEquElec == 1?"":resaltarObservacionTexto(val1.observacionAcuerdoSeguridadEquElec));

         textoAcuerdoSeguridadEquElec = iconoHelp+" Vigente: "+val1.indicadorAcuerdoSeguridadEquElec+obsAcuerdoSeguridadEquElec;
      }
   }else{
      hasAcuerdoSeguridadEquElec = true;
   }

   if(val2.habilitadoEvaluacionToxicologica == 1){
      if(val1.indicadorEvaluacionToxicologica != null){
         var iconoHelp,obsEvaluacionToxicologica;

         hasEvaluacionToxicologica = (val1.notaEvaluacionToxicologica == 1?true:false);
         iconoHelp = (val1.notaEvaluacionToxicologica == 1?iconoGosst.aprobado:
            (val1.notaEvaluacionToxicologica == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsEvaluacionToxicologica = (val1.notaEvaluacionToxicologica == 1?"":resaltarObservacionTexto(val1.observacionEvaluacionToxicologica));

         textoEvaluacionToxicologica = iconoHelp+" Vigente: "+val1.indicadorEvaluacionToxicologica+obsEvaluacionToxicologica;
      }
   }else{
      hasEvaluacionToxicologica = true;
   }

   if(val2.habilitadoCertifUnicoLaboral == 1){
      if(val1.indicadorCertifUnicoLaboral != null){
         var iconoHelp,obsCertifUnicoLaboral;

         hasCertifUnicoLaboral = (val1.notaCertifUnicoLaboral == 1?true:false);
         iconoHelp = (val1.notaCertifUnicoLaboral == 1?iconoGosst.aprobado:
            (val1.notaCertifUnicoLaboral == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsCertifUnicoLaboral = (val1.notaCertifUnicoLaboral == 1?"":resaltarObservacionTexto(val1.observacionCertifUnicoLaboral));

         textoCertifUnicoLaboral = iconoHelp+" Vigente: "+val1.indicadorCertifUnicoLaboral+obsCertifUnicoLaboral;
      }
   }else{
      hasCertifUnicoLaboral = true;
   }

   if(val2.habilitadoAntecedentesPoliciales == 1){
      if(val1.indicadorAntecedentesPoliciales != null){
         var iconoHelp,obsAntecedentesPoliciales;

         hasAntecedentesPoliciales = (val1.notaAntecedentesPoliciales == 1?true:false);
         iconoHelp = (val1.notaAntecedentesPoliciales == 1?iconoGosst.aprobado:
            (val1.notaAntecedentesPoliciales == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsAntecedentesPoliciales = (val1.notaAntecedentesPoliciales == 1?"":resaltarObservacionTexto(val1.observacionAntecedentesPoliciales));

         textoAntecedentesPoliciales = iconoHelp+" Vigente: "+val1.indicadorAntecedentesPoliciales+obsAntecedentesPoliciales;
      }
   }else{
      hasAntecedentesPoliciales = true;
   }

   if(val2.habilitadoDeclaracionVerifDomicilio == 1){
      if(val1.indicadorDeclaracionVerifDomicilio != null){
         var iconoHelp,obsDeclaracionVerifDomicilio;

         hasDeclaracionVerifDomicilio = (val1.notaDeclaracionVerifDomicilio == 1?true:false);
         iconoHelp = (val1.notaDeclaracionVerifDomicilio == 1?iconoGosst.aprobado:
            (val1.notaDeclaracionVerifDomicilio == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsDeclaracionVerifDomicilio = (val1.notaDeclaracionVerifDomicilio == 1?"":resaltarObservacionTexto(val1.observacionDeclaracionVerifDomicilio));

         textoDeclaracionVerifDomicilio = iconoHelp+" Vigente: "+val1.indicadorDeclaracionVerifDomicilio+obsDeclaracionVerifDomicilio;
      }
   }else{
      hasDeclaracionVerifDomicilio = true;
   }

   if(val2.habilitadoDotacionIndumentaria == 1){
      if(val1.indicadorDotacionIndumentaria != null){
         var iconoHelp,obsDotacionIndumentaria;

         hasDotacionIndumentaria = (val1.notaDotacionIndumentaria == 1?true:false);
         iconoHelp = (val1.notaDotacionIndumentaria == 1?iconoGosst.aprobado:
            (val1.notaDotacionIndumentaria == 2?iconoGosst.advertir:iconoGosst.por_realizar));
         obsDotacionIndumentaria = (val1.notaDotacionIndumentaria == 1?"":resaltarObservacionTexto(val1.observacionDotacionIndumentaria));

         textoDotacionIndumentaria = iconoHelp+" Vigente: "+val1.indicadorDotacionIndumentaria+obsDotacionIndumentaria;
      }
   }else{
      hasDotacionIndumentaria = true;
   }

    if(val2.habilitadoMedicoClinica == 1){
        if(val1.indicadorHabilitadoMedicoClinica != null){
            var iconoHelp,obsHabilitadoMedicoClinica;

            hasHabilitadoMedicoClinica = (val1.notaHabilitadoMedicoClinica == 1?true:false);
            iconoHelp = (val1.notaHabilitadoMedicoClinica == 1?iconoGosst.aprobado:
                (val1.notaHabilitadoMedicoClinica == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            // obsHabilitadoMedicoClinica = (val1.notaHabilitadoMedicoClinica == 1?"":resaltarObservacionTexto(val1.observacionHabilitadoMedicoClinica));
            obsHabilitadoMedicoClinica = resaltarObservacionTexto(val1.observacionHabilitadoMedicoClinica);

            textoHabilitadoMedicoClinica = iconoHelp+" Vigente: "+val1.indicadorHabilitadoMedicoClinica+obsHabilitadoMedicoClinica;
        }
    }else{
        hasHabilitadoMedicoClinica = true;
    }

    if(val2.habilitadoExamNivelTrabCont84 == 1){
        if(val1.indicadorExamNivelTrabCont84 != null){
            var iconoHelp,obsExamNivelTrabCont84;

            hasExamNivelTrabCont84 = (val1.notaExamNivelTrabCont84 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont84 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont84 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont84 = (val1.notaExamNivelTrabCont84 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont84));

            textoExamNivelTrabCont84 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont84+obsExamNivelTrabCont84;
        }
    }else{
        hasExamNivelTrabCont84 = true;
    }

    if(val2.habilitadoExamNivelTrabCont89 == 1){
        if(val1.indicadorExamNivelTrabCont89 != null){
            var iconoHelp,obsExamNivelTrabCont89;

            hasExamNivelTrabCont89 = (val1.notaExamNivelTrabCont89 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont89 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont89 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont89 = (val1.notaExamNivelTrabCont89 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont89));

            textoExamNivelTrabCont89 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont89+obsExamNivelTrabCont89;
        }
    }else{
        hasExamNivelTrabCont89 = true;
    }

    if(val2.habilitadoExamNivelTrabCont90 == 1){
        if(val1.indicadorExamNivelTrabCont90 != null){
            var iconoHelp,obsExamNivelTrabCont90;

            hasExamNivelTrabCont90 = (val1.notaExamNivelTrabCont90 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont90 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont90 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont90 = (val1.notaExamNivelTrabCont90 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont90));

            textoExamNivelTrabCont90 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont90+obsExamNivelTrabCont90;
        }
    }else{
        hasExamNivelTrabCont90 = true;
    }

    if(val2.habilitadoExamNivelTrabCont99 == 1){
        if(val1.indicadorExamNivelTrabCont99 != null){
            var iconoHelp,obsExamNivelTrabCont99;

            hasExamNivelTrabCont99 = (val1.notaExamNivelTrabCont99 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont99 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont99 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont99 = (val1.notaExamNivelTrabCont99 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont99));

            textoExamNivelTrabCont99 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont99+obsExamNivelTrabCont99;
        }
    }else{
        hasExamNivelTrabCont99 = true;
    }

    if(val2.habilitadoExamNivelTrabCont100 == 1){
        if(val1.indicadorExamNivelTrabCont100 != null){
            var iconoHelp,obsExamNivelTrabCont100;

            hasExamNivelTrabCont100 = (val1.notaExamNivelTrabCont100 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont100 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont100 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont100 = (val1.notaExamNivelTrabCont100 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont100));

            textoExamNivelTrabCont100 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont100+obsExamNivelTrabCont100;
        }
    }else{
        hasExamNivelTrabCont100 = true;
    }

    if(val2.habilitadoExamNivelTrabCont101 == 1){
        if(val1.indicadorExamNivelTrabCont101 != null){
            var iconoHelp,obsExamNivelTrabCont101;

            hasExamNivelTrabCont101 = (val1.notaExamNivelTrabCont101 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont101 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont101 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont101 = (val1.notaExamNivelTrabCont101 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont101));

            textoExamNivelTrabCont101 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont101+obsExamNivelTrabCont101;
        }
    }else{
        hasExamNivelTrabCont101 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont111 == 1){
        if(val1.indicadorExamNivelTrabCont111 != null){
            var iconoHelp,obsExamNivelTrabCont111;

            hasExamNivelTrabCont111 = (val1.notaExamNivelTrabCont111 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont111 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont111 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont111 = (val1.notaExamNivelTrabCont111 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont111));

            textoExamNivelTrabCont111 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont111+obsExamNivelTrabCont111;
        }
    }else{
        hasExamNivelTrabCont111 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont112 == 1){
        if(val1.indicadorExamNivelTrabCont112 != null){
            var iconoHelp,obsExamNivelTrabCont112;

            hasExamNivelTrabCont112 = (val1.notaExamNivelTrabCont112 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont112 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont112 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont112 = (val1.notaExamNivelTrabCont112 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont112));

            textoExamNivelTrabCont112 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont112+obsExamNivelTrabCont112;
        }
    }else{
        hasExamNivelTrabCont112 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont113 == 1){
        if(val1.indicadorExamNivelTrabCont113 != null){
            var iconoHelp,obsExamNivelTrabCont113;

            hasExamNivelTrabCont113 = (val1.notaExamNivelTrabCont113 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont113 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont113 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont113 = (val1.notaExamNivelTrabCont113 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont113));

            textoExamNivelTrabCont113 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont113+obsExamNivelTrabCont113;
        }
    }else{
        hasExamNivelTrabCont113 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont114 == 1){
        if(val1.indicadorExamNivelTrabCont114 != null){
            var iconoHelp,obsExamNivelTrabCont114;

            hasExamNivelTrabCont114 = (val1.notaExamNivelTrabCont114 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont114 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont114 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont114 = (val1.notaExamNivelTrabCont114 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont114));

            textoExamNivelTrabCont114 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont114+obsExamNivelTrabCont114;
        }
    }else{
        hasExamNivelTrabCont114 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont115 == 1){
        if(val1.indicadorExamNivelTrabCont115 != null){
            var iconoHelp,obsExamNivelTrabCont115;

            hasExamNivelTrabCont115 = (val1.notaExamNivelTrabCont115 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont115 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont115 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont115 = (val1.notaExamNivelTrabCont115 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont115));

            textoExamNivelTrabCont115 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont115+obsExamNivelTrabCont115;
        }
    }else{
        hasExamNivelTrabCont115 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont116 == 1){
        if(val1.indicadorExamNivelTrabCont116 != null){
            var iconoHelp,obsExamNivelTrabCont116;

            hasExamNivelTrabCont116 = (val1.notaExamNivelTrabCont116 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont116 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont116 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont116 = (val1.notaExamNivelTrabCont116 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont116));

            textoExamNivelTrabCont116 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont116+obsExamNivelTrabCont116;
        }
    }else{
        hasExamNivelTrabCont116 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont117 == 1){
        if(val1.indicadorExamNivelTrabCont117 != null){
            var iconoHelp,obsExamNivelTrabCont117;

            hasExamNivelTrabCont117 = (val1.notaExamNivelTrabCont117 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont117 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont117 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont117 = (val1.notaExamNivelTrabCont117 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont117));

            textoExamNivelTrabCont117 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont117+obsExamNivelTrabCont117;
        }
    }else{
        hasExamNivelTrabCont117 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont118 == 1){
        if(val1.indicadorExamNivelTrabCont118 != null){
            var iconoHelp,obsExamNivelTrabCont118;

            hasExamNivelTrabCont118 = (val1.notaExamNivelTrabCont118 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont118 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont118 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont118 = (val1.notaExamNivelTrabCont118 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont118));

            textoExamNivelTrabCont118 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont118+obsExamNivelTrabCont118;
        }
    }else{
        hasExamNivelTrabCont118 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont119 == 1){
        if(val1.indicadorExamNivelTrabCont119 != null){
            var iconoHelp,obsExamNivelTrabCont119;

            hasExamNivelTrabCont119 = (val1.notaExamNivelTrabCont119 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont119 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont119 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont119 = (val1.notaExamNivelTrabCont119 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont119));

            textoExamNivelTrabCont119 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont119+obsExamNivelTrabCont119;
        }
    }else{
        hasExamNivelTrabCont119 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont128 == 1){
        if(val1.indicadorExamNivelTrabCont128 != null){
            var iconoHelp,obsExamNivelTrabCont128;

            hasExamNivelTrabCont128 = (val1.notaExamNivelTrabCont128 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont128 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont128 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont128 = (val1.notaExamNivelTrabCont128 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont128));

            textoExamNivelTrabCont128 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont128+obsExamNivelTrabCont128;
        }
    }else{
        hasExamNivelTrabCont128 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont129 == 1){
        if(val1.indicadorExamNivelTrabCont129 != null){
            var iconoHelp,obsExamNivelTrabCont129;

            hasExamNivelTrabCont129 = (val1.notaExamNivelTrabCont129 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont129 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont129 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont129 = (val1.notaExamNivelTrabCont129 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont129));

            textoExamNivelTrabCont129 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont129+obsExamNivelTrabCont129;
        }
    }else{
        hasExamNivelTrabCont129 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont130 == 1){
        if(val1.indicadorExamNivelTrabCont130 != null){
            var iconoHelp,obsExamNivelTrabCont130;

            hasExamNivelTrabCont130 = (val1.notaExamNivelTrabCont130 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont130 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont130 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont130 = (val1.notaExamNivelTrabCont130 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont130));

            textoExamNivelTrabCont130 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont130+obsExamNivelTrabCont130;
        }
    }else{
        hasExamNivelTrabCont130 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont131 == 1){
        if(val1.indicadorExamNivelTrabCont131 != null){
            var iconoHelp,obsExamNivelTrabCont131;

            hasExamNivelTrabCont131 = (val1.notaExamNivelTrabCont131 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont131 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont131 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont131 = (val1.notaExamNivelTrabCont131 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont131));

            textoExamNivelTrabCont131 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont131+obsExamNivelTrabCont131;
        }
    }else{
        hasExamNivelTrabCont131 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont132 == 1){
        if(val1.indicadorExamNivelTrabCont132 != null){
            var iconoHelp,obsExamNivelTrabCont132;

            hasExamNivelTrabCont132 = (val1.notaExamNivelTrabCont132 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont132 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont132 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont132 = (val1.notaExamNivelTrabCont132 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont132));

            textoExamNivelTrabCont132 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont132+obsExamNivelTrabCont132;
        }
    }else{
        hasExamNivelTrabCont132 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont133 == 1){
        if(val1.indicadorExamNivelTrabCont133 != null){
            var iconoHelp,obsExamNivelTrabCont133;

            hasExamNivelTrabCont133 = (val1.notaExamNivelTrabCont133 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont133 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont133 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont133 = (val1.notaExamNivelTrabCont133 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont133));

            textoExamNivelTrabCont133 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont133+obsExamNivelTrabCont133;
        }
    }else{
        hasExamNivelTrabCont133 = true;
    }
    
    if(val2.habilitadoExamNivelTrabCont134 == 1){
        if(val1.indicadorExamNivelTrabCont134 != null){
            var iconoHelp,obsExamNivelTrabCont134;

            hasExamNivelTrabCont134 = (val1.notaExamNivelTrabCont134 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont134 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont134 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont134 = (val1.notaExamNivelTrabCont134 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont134));

            textoExamNivelTrabCont134 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont134+obsExamNivelTrabCont134;
        }
    }else{
        hasExamNivelTrabCont134 = true;
    }

    if(val2.habilitadoExamNivelTrabCont140 == 1){
        if(val1.indicadorExamNivelTrabCont140 != null){
            var iconoHelp,obsExamNivelTrabCont140;

            hasExamNivelTrabCont140 = (val1.notaExamNivelTrabCont140 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont140 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont140 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont140 = (val1.notaExamNivelTrabCont140 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont140));

            textoExamNivelTrabCont140 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont140+obsExamNivelTrabCont140;
        }
    }else{
        hasExamNivelTrabCont140 = true;
    }

    if(val2.habilitadoExamNivelTrabCont141 == 1){
        if(val1.indicadorExamNivelTrabCont141 != null){
            var iconoHelp,obsExamNivelTrabCont141;

            hasExamNivelTrabCont141 = (val1.notaExamNivelTrabCont141 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont141 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont141 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont141 = (val1.notaExamNivelTrabCont141 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont141));

            textoExamNivelTrabCont141 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont141+obsExamNivelTrabCont141;
        }
    }else{
        hasExamNivelTrabCont141 = true;
    }

    if(val2.habilitadoExamNivelTrabCont142 == 1){
        if(val1.indicadorExamNivelTrabCont142 != null){
            var iconoHelp,obsExamNivelTrabCont142;

            hasExamNivelTrabCont142 = (val1.notaExamNivelTrabCont142 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont142 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont142 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont142 = (val1.notaExamNivelTrabCont142 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont142));

            textoExamNivelTrabCont142 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont142+obsExamNivelTrabCont142;
        }
    }else{
        hasExamNivelTrabCont142 = true;
    }

    if(val2.habilitadoExamNivelTrabCont143 == 1){
        if(val1.indicadorExamNivelTrabCont143 != null){
            var iconoHelp,obsExamNivelTrabCont143;

            hasExamNivelTrabCont143 = (val1.notaExamNivelTrabCont143 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont143 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont143 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont143 = (val1.notaExamNivelTrabCont143 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont143));

            textoExamNivelTrabCont143 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont143+obsExamNivelTrabCont143;
        }
    }else{
        hasExamNivelTrabCont143 = true;
    }

    if(val2.habilitadoExamNivelTrabCont144 == 1){
        if(val1.indicadorExamNivelTrabCont144 != null){
            var iconoHelp,obsExamNivelTrabCont144;

            hasExamNivelTrabCont144 = (val1.notaExamNivelTrabCont144 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont144 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont144 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont144 = (val1.notaExamNivelTrabCont144 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont144));

            textoExamNivelTrabCont144 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont144+obsExamNivelTrabCont144;
        }
    }else{
        hasExamNivelTrabCont144 = true;
    }

    if(val2.habilitadoExamNivelTrabCont145 == 1){
        if(val1.indicadorExamNivelTrabCont145 != null){
            var iconoHelp,obsExamNivelTrabCont145;

            hasExamNivelTrabCont145 = (val1.notaExamNivelTrabCont145 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont145 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont145 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont145 = (val1.notaExamNivelTrabCont145 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont145));

            textoExamNivelTrabCont145 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont145+obsExamNivelTrabCont145;
        }
    }else{
        hasExamNivelTrabCont145 = true;
    }

    if(val2.habilitadoExamNivelTrabCont146 == 1){
        if(val1.indicadorExamNivelTrabCont146 != null){
            var iconoHelp,obsExamNivelTrabCont146;

            hasExamNivelTrabCont146 = (val1.notaExamNivelTrabCont146 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont146 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont146 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont146 = (val1.notaExamNivelTrabCont146 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont146));

            textoExamNivelTrabCont146 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont146+obsExamNivelTrabCont146;
        }
    }else{
        hasExamNivelTrabCont146 = true;
    }

    if(val2.habilitadoExamNivelTrabCont147 == 1){
        if(val1.indicadorExamNivelTrabCont147 != null){
            var iconoHelp,obsExamNivelTrabCont147;

            hasExamNivelTrabCont147 = (val1.notaExamNivelTrabCont147 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont147 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont147 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont147 = (val1.notaExamNivelTrabCont147 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont147));

            textoExamNivelTrabCont147 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont147+obsExamNivelTrabCont147;
        }
    }else{
        hasExamNivelTrabCont147 = true;
    }

    if(val2.habilitadoExamNivelTrabCont148 == 1){
        if(val1.indicadorExamNivelTrabCont148 != null){
            var iconoHelp,obsExamNivelTrabCont148;

            hasExamNivelTrabCont148 = (val1.notaExamNivelTrabCont148 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont148 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont148 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont148 = (val1.notaExamNivelTrabCont148 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont148));

            textoExamNivelTrabCont148 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont148+obsExamNivelTrabCont148;
        }
    }else{
        hasExamNivelTrabCont148 = true;
    }

    if(val2.habilitadoExamNivelTrabCont149 == 1){
        if(val1.indicadorExamNivelTrabCont149 != null){
            var iconoHelp,obsExamNivelTrabCont149;

            hasExamNivelTrabCont149 = (val1.notaExamNivelTrabCont149 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont149 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont149 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont149 = (val1.notaExamNivelTrabCont149 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont149));

            textoExamNivelTrabCont149 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont149+obsExamNivelTrabCont149;
        }
    }else{
        hasExamNivelTrabCont149 = true;
    }

    if(val2.habilitadoExamNivelTrabCont150 == 1){
        if(val1.indicadorExamNivelTrabCont150 != null){
            var iconoHelp,obsExamNivelTrabCont150;

            hasExamNivelTrabCont150 = (val1.notaExamNivelTrabCont150 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont150 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont150 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont150 = (val1.notaExamNivelTrabCont150 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont150));

            textoExamNivelTrabCont150 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont150+obsExamNivelTrabCont150;
        }
    }else{
        hasExamNivelTrabCont150 = true;
    }

    if(val2.habilitadoExamNivelTrabCont151 == 1){
        if(val1.indicadorExamNivelTrabCont151 != null){
            var iconoHelp,obsExamNivelTrabCont151;

            hasExamNivelTrabCont151 = (val1.notaExamNivelTrabCont151 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont151 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont151 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont151 = (val1.notaExamNivelTrabCont151 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont151));

            textoExamNivelTrabCont151 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont151+obsExamNivelTrabCont151;
        }
    }else{
        hasExamNivelTrabCont151 = true;
    }

    if(val2.habilitadoExamNivelTrabCont152 == 1){
        if(val1.indicadorExamNivelTrabCont152 != null){
            var iconoHelp,obsExamNivelTrabCont152;

            hasExamNivelTrabCont152 = (val1.notaExamNivelTrabCont152 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont152 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont152 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont152 = (val1.notaExamNivelTrabCont152 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont152));

            textoExamNivelTrabCont152 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont152+obsExamNivelTrabCont152;
        }
    }else{
        hasExamNivelTrabCont152 = true;
    }

    if(val2.habilitadoExamNivelTrabCont153 == 1){
        if(val1.indicadorExamNivelTrabCont153 != null){
            var iconoHelp,obsExamNivelTrabCont153;

            hasExamNivelTrabCont153 = (val1.notaExamNivelTrabCont153 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont153 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont153 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont153 = (val1.notaExamNivelTrabCont153 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont153));

            textoExamNivelTrabCont153 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont153+obsExamNivelTrabCont153;
        }
    }else{
        hasExamNivelTrabCont153 = true;
    }

    if(val2.habilitadoExamNivelTrabCont154 == 1){
        if(val1.indicadorExamNivelTrabCont154 != null){
            var iconoHelp,obsExamNivelTrabCont154;

            hasExamNivelTrabCont154 = (val1.notaExamNivelTrabCont154 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont154 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont154 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont154 = (val1.notaExamNivelTrabCont154 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont154));

            textoExamNivelTrabCont154 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont154+obsExamNivelTrabCont154;
        }
    }else{
        hasExamNivelTrabCont154 = true;
    }

    if(val2.habilitadoExamNivelTrabCont155 == 1){
        if(val1.indicadorExamNivelTrabCont155 != null){
            var iconoHelp,obsExamNivelTrabCont155;

            hasExamNivelTrabCont155 = (val1.notaExamNivelTrabCont155 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont155 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont155 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont155 = (val1.notaExamNivelTrabCont155 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont155));

            textoExamNivelTrabCont155 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont155+obsExamNivelTrabCont155;
        }
    }else{
        hasExamNivelTrabCont155 = true;
    }

    if(val2.habilitadoExamNivelTrabCont156 == 1){
        if(val1.indicadorExamNivelTrabCont156 != null){
            var iconoHelp,obsExamNivelTrabCont156;

            hasExamNivelTrabCont156 = (val1.notaExamNivelTrabCont156 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont156 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont156 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont156 = (val1.notaExamNivelTrabCont156 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont156));

            textoExamNivelTrabCont156 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont156+obsExamNivelTrabCont156;
        }
    }else{
        hasExamNivelTrabCont156 = true;
    }

    if(val2.habilitadoExamNivelTrabCont157 == 1){
        if(val1.indicadorExamNivelTrabCont157 != null){
            var iconoHelp,obsExamNivelTrabCont157;

            hasExamNivelTrabCont157 = (val1.notaExamNivelTrabCont157 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont157 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont157 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont157 = (val1.notaExamNivelTrabCont157 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont157));

            textoExamNivelTrabCont157 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont157+obsExamNivelTrabCont157;
        }
    }else{
        hasExamNivelTrabCont157 = true;
    }

    if(val2.habilitadoExamNivelTrabCont158 == 1){
        if(val1.indicadorExamNivelTrabCont158 != null){
            var iconoHelp,obsExamNivelTrabCont158;

            hasExamNivelTrabCont158 = (val1.notaExamNivelTrabCont158 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont158 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont158 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont158 = (val1.notaExamNivelTrabCont158 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont158));

            textoExamNivelTrabCont158 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont158+obsExamNivelTrabCont158;
        }
    }else{
        hasExamNivelTrabCont158 = true;
    }

    if(val2.habilitadoExamNivelTrabCont159 == 1){
        if(val1.indicadorExamNivelTrabCont159 != null){
            var iconoHelp,obsExamNivelTrabCont159;

            hasExamNivelTrabCont159 = (val1.notaExamNivelTrabCont159 == 1?true:false);
            iconoHelp = (val1.notaExamNivelTrabCont159 == 1?iconoGosst.aprobado:(val1.notaExamNivelTrabCont159 == 2?iconoGosst.advertir:iconoGosst.por_realizar));
            obsExamNivelTrabCont159 = (val1.notaExamNivelTrabCont159 == 1?"":resaltarObservacionTexto(val1.observacionExamNivelTrabCont159));

            textoExamNivelTrabCont159 = iconoHelp+" Vigente: "+val1.indicadorExamNivelTrabCont159+obsExamNivelTrabCont159;
        }
    }else{
        hasExamNivelTrabCont159 = true;
    }

   if(val1.indicadorBlacklist != null){
      var iconoHelp = iconoGosst.desaprobado;

      hasSancion = true;

      textoSancion = iconoHelp+" SÍ <br><strong>(Hasta "+val1.indicadorBlacklist+")</strong>";

      textoExamen = "------";textoSctr = "------";textoEpp = "------";textoInduccion = "------";textoCargo = "------";
      textoTreg = "------";textoHojaVida = "------";textoInduccionSst = "------";textoPruebaCovid = "------";
      textoVacunaCovid = "------";textoCertificadoPolicial = "------";textoAntecedentesPenales = "------";
      textoSeguroAccidentes = "------";textoRiesgoExposicionPuestoTrabajo = "------";textoVacunacionCovid = "------";
      textoCarnetSanidad = "------";textoAcuerdoSeguridadEquElec = "------";textoEvaluacionToxicologica = "------";
      textoCertifUnicoLaboral = "------";textoAntecedentesPoliciales = "------";textoDeclaracionVerifDomicilio = "------";
      textoDotacionIndumentaria = "------";textoHabilitadoMedicoClinica = "------";textoExamNivelTrabCont84 = "------";
       textoExamNivelTrabCont89 = "------";textoExamNivelTrabCont90 = "------";textoExamNivelTrabCont99 = "------";
       textoExamNivelTrabCont100 = "------";textoExamNivelTrabCont101 = "------";textoExamNivelTrabCont111 = "------";
       textoExamNivelTrabCont112 = "------";textoExamNivelTrabCont113 = "------";textoExamNivelTrabCont114 = "------";
       textoExamNivelTrabCont115 = "------";textoExamNivelTrabCont116 = "------";textoExamNivelTrabCont117 = "------";
       textoExamNivelTrabCont118 = "------";textoExamNivelTrabCont119 = "------";textoExamNivelTrabCont128 = "------";
       textoExamNivelTrabCont129 = "------";textoExamNivelTrabCont130 = "------";textoExamNivelTrabCont131 = "------";
       textoExamNivelTrabCont132 = "------";textoExamNivelTrabCont133 = "------";textoExamNivelTrabCont134 = "------";
       textoExamNivelTrabCont140 = "------";textoExamNivelTrabCont141 = "------";textoExamNivelTrabCont142 = "------";
       textoExamNivelTrabCont143 = "------";textoExamNivelTrabCont144 = "------";textoExamNivelTrabCont145 = "------";
       textoExamNivelTrabCont146 = "------";textoExamNivelTrabCont147 = "------";textoExamNivelTrabCont148 = "------";
       textoExamNivelTrabCont149 = "------";textoExamNivelTrabCont150 = "------";textoExamNivelTrabCont151 = "------";
       textoExamNivelTrabCont152 = "------";textoExamNivelTrabCont153 = "------";textoExamNivelTrabCont154 = "------";
       textoExamNivelTrabCont155 = "------";textoExamNivelTrabCont156 = "------";textoExamNivelTrabCont157 = "------";
       textoExamNivelTrabCont158 = "------";textoExamNivelTrabCont159 = "------";
    }

    var isHabilitado = false;

    if(hasExamen && hasSctr && hasEpp && hasInduccion && hasCargo && hasTreg && hasHojaVida && hasInduccionSst &&
        hasPruebaCovid && hasVacunaCovid && hasCertificadoPolicial && hasAntecedentesPenales && hasSeguroAccidentes &&
        hasRiesgoExposicionPuestoTrabajo && hasVacunacionCovid && hasCarnetSanidad /*&& hasAcuerdoSeguridadEquElec*/ && hasEvaluacionToxicologica &&
        hasCertifUnicoLaboral && hasAntecedentesPoliciales && hasDeclaracionVerifDomicilio && hasDotacionIndumentaria && !hasSancion &&
        hasPrevencionista && hasEntrevistaPrevencionista && val1.habilitadoTrabajosAltoRiesgo == 1 && hasHabilitadoMedicoClinica &&
        hasExamNivelTrabCont84 && hasExamNivelTrabCont89 && hasExamNivelTrabCont90 && hasExamNivelTrabCont99 && hasExamNivelTrabCont100 &&
        hasExamNivelTrabCont101 && hasExamNivelTrabCont111 && hasExamNivelTrabCont112 && hasExamNivelTrabCont113 && hasExamNivelTrabCont114 &&
        hasExamNivelTrabCont115 && hasExamNivelTrabCont116 && hasExamNivelTrabCont117 && hasExamNivelTrabCont118 && hasExamNivelTrabCont119 &&
        hasExamNivelTrabCont128 && hasExamNivelTrabCont129 && hasExamNivelTrabCont130 && hasExamNivelTrabCont131 && hasExamNivelTrabCont132 &&
        hasExamNivelTrabCont133 && hasExamNivelTrabCont134 && hasExamNivelTrabCont140 && hasExamNivelTrabCont141 && hasExamNivelTrabCont142 &&
        hasExamNivelTrabCont143 && hasExamNivelTrabCont144 && hasExamNivelTrabCont145 && hasExamNivelTrabCont146 && hasExamNivelTrabCont147 &&
        hasExamNivelTrabCont148 && hasExamNivelTrabCont149 && hasExamNivelTrabCont150 && hasExamNivelTrabCont151 && hasExamNivelTrabCont152 &&
        hasExamNivelTrabCont153 && hasExamNivelTrabCont154 && hasExamNivelTrabCont155 && hasExamNivelTrabCont156 && hasExamNivelTrabCont157 &&
        hasExamNivelTrabCont158 && hasExamNivelTrabCont159){
        isHabilitado = true;
    }

   return {
      isHabilitado: isHabilitado,textoExamen: textoExamen,textoSctr: textoSctr,textoEpp: textoEpp,
      textoInduccion: textoInduccion,textoCargo: textoCargo,textoTreg: textoTreg,textoHojaVida: textoHojaVida,
      textoInduccionSst: textoInduccionSst,textoPruebaCovid: textoPruebaCovid,
      textoVacunaCovid: textoVacunaCovid,textoCertificadoPolicial: textoCertificadoPolicial,
      textoPrevencionista: textoPrevencionista,textoSancion: textoSancion,textoAntecedentesPenales: textoAntecedentesPenales,
      textoSeguroAccidentes: textoSeguroAccidentes,textoRiesgoExposicionPuestoTrabajo:textoRiesgoExposicionPuestoTrabajo,
      textoVacunacionCovid:textoVacunacionCovid,textoCarnetSanidad:textoCarnetSanidad,textoAcuerdoSeguridadEquElec:textoAcuerdoSeguridadEquElec,
      textoEvaluacionToxicologica:textoEvaluacionToxicologica,textoCertifUnicoLaboral:textoCertifUnicoLaboral,textoAntecedentesPoliciales:textoAntecedentesPoliciales,
      textoDeclaracionVerifDomicilio:textoDeclaracionVerifDomicilio,textoDotacionIndumentaria:textoDotacionIndumentaria,
       textoEntrevistaPrevencionista:textoEntrevistaPrevencionista,textoHabilitadoMedicoClinica:textoHabilitadoMedicoClinica,textoExamNivelTrabCont84:textoExamNivelTrabCont84,
       textoExamNivelTrabCont89:textoExamNivelTrabCont89,textoExamNivelTrabCont90:textoExamNivelTrabCont90,textoExamNivelTrabCont99:textoExamNivelTrabCont99,
       textoExamNivelTrabCont100:textoExamNivelTrabCont100,textoExamNivelTrabCont101:textoExamNivelTrabCont101,textoExamNivelTrabCont111:textoExamNivelTrabCont111,
       textoExamNivelTrabCont112:textoExamNivelTrabCont112,textoExamNivelTrabCont113:textoExamNivelTrabCont113,textoExamNivelTrabCont114:textoExamNivelTrabCont114,
       textoExamNivelTrabCont115:textoExamNivelTrabCont115,textoExamNivelTrabCont116:textoExamNivelTrabCont116,textoExamNivelTrabCont117:textoExamNivelTrabCont117,
       textoExamNivelTrabCont118:textoExamNivelTrabCont118,textoExamNivelTrabCont119:textoExamNivelTrabCont119,textoExamNivelTrabCont128:textoExamNivelTrabCont128,
       textoExamNivelTrabCont129:textoExamNivelTrabCont129,textoExamNivelTrabCont130:textoExamNivelTrabCont130,textoExamNivelTrabCont131:textoExamNivelTrabCont131,
       textoExamNivelTrabCont132:textoExamNivelTrabCont132,textoExamNivelTrabCont133:textoExamNivelTrabCont133,textoExamNivelTrabCont134:textoExamNivelTrabCont134,
       textoExamNivelTrabCont140:textoExamNivelTrabCont140,textoExamNivelTrabCont141:textoExamNivelTrabCont141,textoExamNivelTrabCont142:textoExamNivelTrabCont142,
       textoExamNivelTrabCont143:textoExamNivelTrabCont143,textoExamNivelTrabCont144:textoExamNivelTrabCont144,textoExamNivelTrabCont145:textoExamNivelTrabCont145,
       textoExamNivelTrabCont146:textoExamNivelTrabCont146,textoExamNivelTrabCont147:textoExamNivelTrabCont147,textoExamNivelTrabCont148:textoExamNivelTrabCont148,
       textoExamNivelTrabCont149:textoExamNivelTrabCont149,textoExamNivelTrabCont150:textoExamNivelTrabCont150,textoExamNivelTrabCont151:textoExamNivelTrabCont151,
       textoExamNivelTrabCont152:textoExamNivelTrabCont152,textoExamNivelTrabCont153:textoExamNivelTrabCont153,textoExamNivelTrabCont154:textoExamNivelTrabCont154,
       textoExamNivelTrabCont155:textoExamNivelTrabCont155,textoExamNivelTrabCont156:textoExamNivelTrabCont156,textoExamNivelTrabCont157:textoExamNivelTrabCont157,
       textoExamNivelTrabCont158:textoExamNivelTrabCont158,textoExamNivelTrabCont159:textoExamNivelTrabCont159
   }
}

function detalleConstanciaTrabAltoRiesgoTrabCon(val) {
   var textoTrabajoAltura = iconoGosst.desaprobado+" No vigente / sin documento",
       textoTrabajoCaliente = iconoGosst.desaprobado+" No vigente / sin documento",
       textoEspacioConfiado = iconoGosst.desaprobado+" No vigente / sin documento",
       textoTrabajoElectrico = iconoGosst.desaprobado+" No vigente / sin documento",
       textoIzajeCarga = iconoGosst.desaprobado+" No vigente / sin documento",
       textoAndamio = iconoGosst.desaprobado+" No vigente / sin documento",
       textoHerramientaManual = iconoGosst.desaprobado+" No vigente / sin documento",
       textoHerramientaPoder = iconoGosst.desaprobado+" No vigente / sin documento",
       textoMaquinariaPesada = iconoGosst.desaprobado+" No vigente / sin documento",
       textoExcavacionZanja = iconoGosst.desaprobado+" No vigente / sin documento",
       textoOperadorManlift = iconoGosst.desaprobado+" No vigente / sin documento",
       textoOperadorGrua = iconoGosst.desaprobado+" No vigente / sin documento",
       textoMatpel = iconoGosst.desaprobado+" No vigente / sin documento",
       textoRigger = iconoGosst.desaprobado+" No vigente / sin documento";

    if (val.certificadoTrabajoAltura != null) {
        var iconoHelp, obsTrabajoAltura;

        iconoHelp = (val.notaTrabajoAltura == 1 ? iconoGosst.aprobado :
            (val.notaTrabajoAltura == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsTrabajoAltura = (val.notaTrabajoAltura == 1 ? "" : resaltarObservacionTexto(val.observacionTrabajoAltura));

        textoTrabajoAltura = iconoHelp + " Vigente: " + val.certificadoTrabajoAltura + obsTrabajoAltura;
    }

    if (val.certificadoTrabajoCaliente != null) {
        var iconoHelp, obsTrabajoCaliente;

        iconoHelp = (val.notaTrabajoCaliente == 1 ? iconoGosst.aprobado :
            (val.notaTrabajoCaliente == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsTrabajoCaliente = (val.notaTrabajoCaliente == 1 ? "" : resaltarObservacionTexto(val.observacionTrabajoCaliente));

        textoTrabajoCaliente = iconoHelp + " Vigente: " + val.certificadoTrabajoCaliente + obsTrabajoCaliente;
    }

    if (val.certificadoEspacioConfiado != null) {
        var iconoHelp, obsEspacioConfiado;

        iconoHelp = (val.notaEspacioConfiado == 1 ? iconoGosst.aprobado :
            (val.notaEspacioConfiado == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsEspacioConfiado = (val.notaEspacioConfiado == 1 ? "" : resaltarObservacionTexto(val.observacionEspacioConfiado));

        textoEspacioConfiado = iconoHelp + " Vigente: " + val.certificadoEspacioConfiado + obsEspacioConfiado;
    }

    if (val.certificadoTrabajoElectrico != null) {
        var iconoHelp, obsTrabajoElectrico;

        iconoHelp = (val.notaTrabajoElectrico == 1 ? iconoGosst.aprobado :
            (val.notaTrabajoElectrico == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsTrabajoElectrico = (val.notaTrabajoElectrico == 1 ? "" : resaltarObservacionTexto(val.observacionTrabajoElectrico));

        textoTrabajoElectrico = iconoHelp + " Vigente: " + val.certificadoTrabajoElectrico + obsTrabajoElectrico;
    }

    if (val.certificadoIzajeCarga != null) {
        var iconoHelp, obsIzajeCarga;

        iconoHelp = (val.notaIzajeCarga == 1 ? iconoGosst.aprobado :
            (val.notaIzajeCarga == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsIzajeCarga = (val.notaIzajeCarga == 1 ? "" : resaltarObservacionTexto(val.observacionIzajeCarga));

        textoIzajeCarga = iconoHelp + " Vigente: " + val.certificadoIzajeCarga + obsIzajeCarga;
    }

    if (val.certificadoAndamio != null) {
        var iconoHelp, obsAndamio;

        iconoHelp = (val.notaAndamio == 1 ? iconoGosst.aprobado :
            (val.notaAndamio == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsAndamio = (val.notaAndamio == 1 ? "" : resaltarObservacionTexto(val.observacionAndamio));

        textoAndamio = iconoHelp + " Vigente: " + val.certificadoAndamio + obsAndamio;
    }

    if (val.certificadoHerramientaManual != null) {
        var iconoHelp, obsHerramientaManual;

        iconoHelp = (val.notaHerramientaManual == 1 ? iconoGosst.aprobado :
            (val.notaHerramientaManual == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsHerramientaManual = (val.notaHerramientaManual == 1 ? "" : resaltarObservacionTexto(val.observacionHerramientaManual));

        textoHerramientaManual = iconoHelp + " Vigente: " + val.certificadoHerramientaManual + obsHerramientaManual;
    }

    if (val.certificadoHerramientaPoder != null) {
        var iconoHelp, obsHerramientaPoder;

        iconoHelp = (val.notaHerramientaPoder == 1 ? iconoGosst.aprobado :
            (val.notaHerramientaPoder == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsHerramientaPoder = (val.notaHerramientaPoder == 1 ? "" : resaltarObservacionTexto(val.observacionHerramientaPoder));

        textoHerramientaPoder = iconoHelp + " Vigente: " + val.certificadoHerramientaPoder + obsHerramientaPoder;
    }

    if (val.certificadoMaquinariaPesada != null) {
        var iconoHelp, obsMaquinariaPesada;

        iconoHelp = (val.notaMaquinariaPesada == 1 ? iconoGosst.aprobado :
            (val.notaMaquinariaPesada == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsMaquinariaPesada = (val.notaMaquinariaPesada == 1 ? "" : resaltarObservacionTexto(val.observacionMaquinariaPesada));

        textoMaquinariaPesada = iconoHelp + " Vigente: " + val.certificadoMaquinariaPesada + obsMaquinariaPesada;
    }

    if (val.certificadoExcavacionZanja != null) {
        var iconoHelp, obsExcavacionZanja;

        iconoHelp = (val.notaExcavacionZanja == 1 ? iconoGosst.aprobado :
            (val.notaExcavacionZanja == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsExcavacionZanja = (val.notaExcavacionZanja == 1 ? "" : resaltarObservacionTexto(val.observacionExcavacionZanja));

        textoExcavacionZanja = iconoHelp + " Vigente: " + val.certificadoExcavacionZanja + obsExcavacionZanja;
    }

    if (val.certificadoOperadorManlift != null) {
        var iconoHelp, obsOperadorManlift;

        iconoHelp = (val.notaOperadorManlift == 1 ? iconoGosst.aprobado :
            (val.notaOperadorManlift == 2 ? iconoGosst.advertir : iconoGosst.por_realizar));
        obsOperadorManlift = (val.notaOperadorManlift == 1 ? "" : resaltarObservacionTexto(val.observacionOperadorManlift));

        textoOperadorManlift = iconoHelp + " Vigente: " + val.certificadoOperadorManlift + obsOperadorManlift;
    }

   if(val.certificadoOperadorGrua != null){
      var iconoHelp,obsOperadorGrua;

      iconoHelp = (val.notaOperadorGrua == 1?iconoGosst.aprobado:
         (val.notaOperadorGrua == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsOperadorGrua = (val.notaOperadorGrua == 1?"":resaltarObservacionTexto(val.observacionOperadorGrua));

      textoOperadorGrua = iconoHelp+" Vigente: "+val.certificadoOperadorGrua+obsOperadorGrua;
   }
   
   if(val.certificadoMatpel != null){
      var iconoHelp,obsMatpel;

      iconoHelp = (val.notaMatpel == 1?iconoGosst.aprobado:
         (val.notaMatpel == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsMatpel = (val.notaMatpel == 1?"":resaltarObservacionTexto(val.observacionMatpel));

      textoMatpel = iconoHelp+" Vigente: "+val.certificadoMatpel+obsMatpel;
   }

   if(val.certificadoRigger != null){
      var iconoHelp,obsRigger;

      iconoHelp = (val.notaRigger == 1?iconoGosst.aprobado:
         (val.notaRigger == 2?iconoGosst.advertir:iconoGosst.por_realizar));
      obsRigger = (val.notaRigger == 1?"":resaltarObservacionTexto(val.observacionRigger));

      textoRigger = iconoHelp+" Vigente: "+val.certificadoRigger+obsRigger;
   }

   return {
      textoTrabajoAltura: textoTrabajoAltura,textoTrabajoCaliente: textoTrabajoCaliente,textoEspacioConfiado: textoEspacioConfiado,
      textoTrabajoElectrico: textoTrabajoElectrico,textoIzajeCarga: textoIzajeCarga,textoAndamio: textoAndamio,
      textoHerramientaManual: textoHerramientaManual,textoHerramientaPoder: textoHerramientaPoder,textoMaquinariaPesada: textoMaquinariaPesada,
      textoExcavacionZanja: textoExcavacionZanja,textoOperadorManlift: textoOperadorManlift,textoOperadorGrua: textoOperadorGrua,
      textoMatpel:textoMatpel,textoRigger:textoRigger
   }
}

function getFileExtension(nombre) {
    var extension = nombre.split('.').pop();
    extension = extension.toLowerCase().trim();

    return extension;
}

function obtenerValorId(url) {
    var queryString = url.split('?')[1]; // Obtener la parte de la cadena de consulta de la URL
    var parametros = new URLSearchParams(queryString); // Crear un objeto URLSearchParams con los parámetros

    // Obtener el valor del parámetro 'id'
    var id = parametros.get('id');

    return id;
}

var listConexionesVisorEvidencia = [];

function cargarListConexionesVisorEvidencia(reiniciar, url, eviNombre) {
    if (parseInt(reiniciar) == 1) {
        listConexionesVisorEvidencia = [];
    } else if (eviNombre.length != 0) {
        listConexionesVisorEvidencia.push({url: url, eviNombre: eviNombre});
    }
}

function getButtonVisorEvidencia(eviNombre,pId,saltoLinea,isButton){
   var btnVisorEvidencia = (eviNombre.length == 0?"":(parseInt(saltoLinea) == 1?"<br>":"") +
      "<a class='"+(parseInt(isButton) == 1?"btn btn-success":"efectoLink")+"' target='_blank' " +
         "onclick='mostrarVistaPreviaEvidencia("+(listConexionesVisorEvidencia.length - 1)+","+pId+")'>" +
         "<i class='fa fa-eye'></i> Vista previa" +
      "</a>");

   return btnVisorEvidencia;
}

function mostrarVistaPreviaEvidencia(pindex,pIdAux){
   var conexionVisorEviObj = listConexionesVisorEvidencia[pindex];

   var extension = getFileExtension(conexionVisorEviObj.eviNombre);
   var pId = parseInt(pIdAux);

   var dataParam={
      id:pId
   };

   var fileUrlPreview = "";

   callAjaxPostSimple(URL + conexionVisorEviObj.url, dataParam, 1, function (data) {
        if (data.CODE_RESPONSE == "05" && data.fileUrl.length != 0) {
            fileUrlPreview = data.fileUrl;

            // P106 (SEC-025): el archivo de S3 es privado. Las imagenes se piden al back con la sesion del
            // usuario (urlArchivo); el visor de Google baja el archivo sin sesion y usa un enlace firmado.
            var htmlImagen = "<img src='" + urlArchivo(fileUrlPreview) + "' alt='Vista previa de imagen' " +
                "style='display:block;margin:0 auto;'>";
            var htmlVisorGoogle = function (urlFirmada) {
                return "<iframe src='https://docs.google.com/viewer?url=" + encodeURIComponent(urlFirmada) + "&embedded=true' " +
                    "style='width:100%;height:100%;'></iframe>";
            };

            // Lista de extensiones conocidas y tipos de archivo correspondientes
            var fileTypes = {
                'pdf': {label: 'Documento PDF', google: true},
                'jpg': {label: 'Imagen JPEG', previewHtml: htmlImagen},
                'png': {label: 'Imagen PNG', previewHtml: htmlImagen},
                'gif': {label: 'Imagen GIF', previewHtml: htmlImagen},
                'xls': {label: 'Documento Excel', google: true},
                'xlsx': {label: 'Documento Excel', google: true},
                'doc': {label: 'Documento Word', google: true},
                'docx': {label: 'Documento Word', google: true},
                'csv': {label: 'Documento CSV', google: true},
                'mp4': {label: 'Video MP4', google: true}
                // Agrega más extensiones y tipos de archivo según tus necesidades
            };

            if (extension in fileTypes) {
                var fileType = fileTypes[extension], ventanasEmergentesEv = {};

                if (ventanasEmergentesEv[pId] && !ventanasEmergentesEv[pId].closed) {
                    ventanasEmergentesEv[pId].close();
                }

                ventanasEmergentesEv[pId] = window.open('', '', 'width=' + (window.innerWidth * 0.8) + ',height=' + (window.innerHeight * 0.7) +
                    ',resizable=yes,top=' + ((window.innerHeight - (window.innerHeight * 0.7)) / 2) +
                    ',left=' + ((window.innerWidth - (window.innerWidth * 0.8)) / 2));

                var loadInterval = setInterval(function () {
                    if (ventanasEmergentesEv[pId].document.readyState === 'complete') {
                        clearInterval(loadInterval);
                        if (fileType.google) {
                            obtenerUrlFirmada(fileUrlPreview, function (firmada) {
                                ventanasEmergentesEv[pId].document.write(firmada ? htmlVisorGoogle(firmada)
                                    : "<p style='font-family:sans-serif'>No se pudo abrir la vista previa. " +
                                      "<a href='" + urlArchivo(fileUrlPreview) + "' target='_blank'>Descargar el archivo</a></p>");
                                $.unblockUI();
                            });
                        } else {
                            ventanasEmergentesEv[pId].document.write(fileType.previewHtml);
                            $.unblockUI();
                        }
                    }
                }, 1000);
            } else {
                console.log('Tipo de archivo desconocido');
                $.unblockUI();
            }
        } else {
            console.log('Sin parámetro URL del S3');
            $.unblockUI();
        }
    });
}

function crearSelectMultipleGrupoCompletoVersionDos(idSel, methodJs, listOption, valueSubTipo, nameValueSubTipo,
                                                    htmlContain, holderText, maxSelects) {
    var selectOneBox = "<select multiple data-placeholder='" + holderText + "' id='" + idSel + "' " +
        "class='form-control' onchange='" + methodJs + "'>";

    if (listOption) {
        listOption.forEach(function (val, index) {
            selectOneBox += "<optgroup label='" + val.nombre + "'>";
            val.subtipos.forEach(function (val1, index1) {
                var textSelect = (val1.selected == 1 ? "selected" : "");

                selectOneBox += "<option value='" + val.subtipos[index1][valueSubTipo] + "' " + textSelect + ">" +
                    val.subtipos[index1][nameValueSubTipo] + "</option>";
            });

            selectOneBox += "</ optgroup>";
        });
    }

    selectOneBox = selectOneBox + "</select>";

    $("" + htmlContain).html("" + selectOneBox);

    $("#" + idSel).chosen({
        max_selected_options: (maxSelects != undefined ? maxSelects : 100000),
        no_results_text: "No se encontró"
    });

    $("#" + idSel).bind("chosen:maxselected", function () {
        alert("Límite alcanzado");
    });
}

var listTrabajadorGeneralBuscadorAux = [];

function buscarTrabajadorGeneralInformacion(idVal, inputVal, divSelVal, selVal) {
    var nombre = $("#" + inputVal + idVal).val().trim();

    if (nombre.length >= 3) {
        var dataParam = {
            trabajadorNombre: "%" + nombre + "%", //isBuscador: 1,
            empresaId: parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostNoLoad(URL + "/trabajador/buscar/simple", dataParam, function (data) {
            listTrabajadorGeneralBuscadorAux = data.trabajadores;

            if (listTrabajadorGeneralBuscadorAux.length == 0) {
                listTrabajadorGeneralBuscadorAux = [
                    {trabajadorId: -1, nombre: "Sin asignar"}
                ];
            }

            var selTrabajadorGeneralInformacion = crearSelectOneMenuOblig(selVal + idVal, "",
                listTrabajadorGeneralBuscadorAux, "", "trabajadorId", "nombre");

            $("#" + divSelVal + idVal).html(selTrabajadorGeneralInformacion);
            $("#" + inputVal + idVal).attr("onkeyup", "buscarTrabajadorGeneralInformacion(" + idVal + ",\"" + inputVal + "\",\"" + divSelVal + "\",\"" + selVal + "\")");
        });
    } else {
        listTrabajadorGeneralBuscadorAux = [
            {trabajadorId: -1, nombre: "Sin asignar"}
        ];

        var selTrabajadorGeneralInformacion = crearSelectOneMenuOblig(selVal + idVal, "",
            listTrabajadorGeneralBuscadorAux, "", "trabajadorId", "nombre");

        $("#" + divSelVal + idVal).html(selTrabajadorGeneralInformacion);
        $("#" + inputVal + idVal).attr("onkeyup", "buscarTrabajadorGeneralInformacion(" + idVal + ",\"" + inputVal + "\",\"" + divSelVal + "\",\"" + selVal + "\")");
    }
}

function guardarEvidenciaAutoVersionS3(habilitado, archivoId, inputFileId, bitsMax, ruedaCarga, ruedaCargaFin,
                                       urlEvidencia, urlFolder, functionCallback, fieldEvidencia, arrayDataAppend) {
    if (habilitado == 1) {
        fieldEvidencia = defaultFor(fieldEvidencia, "id");
        var archivoIdAux = archivoId;
        var inputFileImage = document.getElementById(inputFileId);

        var file = inputFileImage.files[0];
        var data = new FormData();

        if (file) {
            if (file.size > bitsMax) {
                functionCallback();
            } else {
                var realizarCompresion = true;
                var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

                if (!filterType.test(file.type) || file.size < bitsMega * 1.5) {
                    realizarCompresion = false;
                }

                if (realizarCompresion) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);

                    fileReader.onload = function (event) {
                        var image = new Image();

                        image.onload = function () {
                            var canvas = document.createElement("canvas");
                            var context = canvas.getContext("2d");
                            var MAX_WIDTH = 800;
                            var MAX_HEIGHT = 600;
                            var width = image.width;
                            var height = image.height;

                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;

                            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

                            canvas.toBlob(function (blob) {
                                var fileFinal = new File([blob], file.name);
                                data.append("fileEvi", fileFinal);
                                data.append("fechaSubida", new Date());
                                data.append("fecha", $("#dateActividad").val());

                                if (arrayDataAppend) {
                                    arrayDataAppend.forEach(function (val, index) {
                                        data.append(val.id, val.value);
                                    });
                                }

                                data.append(fieldEvidencia, archivoId);
                                data.append("bucketAmazonS3", BUCKETAMAZONS3);
                                data.append("keyAmazonS3", urlFolder + "/" + archivoId);

                                var url = URL + urlEvidencia;

                                $.ajax({
                                    url: url, type: 'POST', beforeSend: function () {
                                        if (ruedaCarga == 1) {
                                            $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
                                        }
                                    },
                                    xhrFields: {withCredentials: true},
                                    contentType: false, data: data, processData: false, cache: false,
                                    success: function (data, textStatus, jqXHR) {
                                        switch (data.CODE_RESPONSE) {
                                            case "06":
                                                sessionStorage.clear();
                                                document.location.replace(data.PATH);

                                                break;

                                            default:
                                                console.log("Prueba 1.2");
//			            $("#"+inputFileId).parent("span").find("#labelProgress").remove();
                                                functionCallback(data);
                                        }
                                    },
                                    complete: function () {
                                        if (ruedaCargaFin == 1) {
                                            $.unblockUI();
                                        }
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        $.unblockUI();
                                        alert("Estimado usuario, no excederse de 14mb o 30 caracteres del nombre del archivo");
                                        console.log('xhRequest: ' + jqXHR + "\n");
                                        console.log('ErrorText: ' + textStatus + "\n");
                                        console.log('thrownError: ' + errorThrown + "\n");
                                    },
                                    // Custom XMLHttpRequest
                                    xhr: function () {
                                        var myXhr = $.ajaxSettings.xhr();

                                        if (myXhr.upload) {
                                            // For handling the progress of the upload
                                            myXhr.upload.addEventListener('progress', function (e) {
                                                if (e.lengthComputable) {
                                                    var progreso = e.loaded / e.total;
                                                    console.log(pasarDecimalPorcentaje(progreso));
                                                    $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                                    $("#" + inputFileId).parent("span").append(
                                                        "<label id='labelProgress'>" + pasarDecimalPorcentaje(progreso) + "</label>");
                                                }
                                            }, false);
                                        }

                                        return myXhr;
                                    }
                                });
                            }, 'image/jpeg', 1);
                        }

                        image.src = event.target.result;
                    }
                } else {
                    data.append("fileEvi", file);
                    data.append("fechaSubida", new Date());
                    data.append("fecha", $("#dateActividad").val());

                    if (arrayDataAppend) {
                        arrayDataAppend.forEach(function (val, index) {
                            data.append(val.id, val.value);
                        });
                    }

                    data.append(fieldEvidencia, archivoId);
                    data.append("bucketAmazonS3", BUCKETAMAZONS3);
                    data.append("keyAmazonS3", urlFolder + "/" + archivoId);

                    var url = URL + urlEvidencia;

                    $.ajax({
                        url: url, type: 'POST', beforeSend: function () {
                            if (ruedaCarga == 1) {
                                $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
                            }
                        },
                        xhrFields: {withCredentials: true},
                        contentType: false, data: data, processData: false, cache: false,
                        success: function (data, textStatus, jqXHR) {
                            switch (data.CODE_RESPONSE) {
                                case "06":
                                    sessionStorage.clear();
                                    document.location.replace(data.PATH);

                                    break;

                                default:
                                    console.log("Prueba 1.2");
//		     	   $("#"+inputFileId).parent("span").find("#labelProgress").remove();
                                    functionCallback(data);
                            }
                        },
                        complete: function () {
                            if (ruedaCargaFin == 1) {
                                $.unblockUI();
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            $.unblockUI();
                            alert("Estimado usuario, no excederse de 14mb o 30 caracteres del nombre del archivo");
                            console.log('xhRequest: ' + jqXHR + "\n");
                            console.log('ErrorText: ' + textStatus + "\n");
                            console.log('thrownError: ' + errorThrown + "\n");
                        },
                        // Custom XMLHttpRequest
                        xhr: function () {
                            var myXhr = $.ajaxSettings.xhr();

                            if (myXhr.upload) {
                                // For handling the progress of the upload
                                myXhr.upload.addEventListener('progress', function (e) {
                                    if (e.lengthComputable) {
                                        var progreso = e.loaded / e.total;
                                        console.log(pasarDecimalPorcentaje(progreso));
                                        $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                        $("#" + inputFileId).parent("span").append(
                                            "<label id='labelProgress'>" + pasarDecimalPorcentaje(progreso) + "</label>");
                                    }
                                }, false);
                            }

                            return myXhr;
                        }
                    });
                }
            }
        } else {
            console.log("No se encontro " + inputFileId);

            if (ruedaCargaFin == 1) {
                $.unblockUI();
            }

            functionCallback();
        }
    } else {
        console.log("No está habilitado y/o se omitió " + inputFileId);

        if (ruedaCargaFin == 1) {
            $.unblockUI();
        }

        functionCallback();
    }
}

function crearFormEvidenciaAmazonS3Completa(options) {
    var mensajeAux = (options.mensajeAux == undefined ? "" : options.mensajeAux);
    var textImagen = (options.isImagen ? "accept = 'image/*' " : "");
    var idAux = options.idAux;

    var buttonDescarga = (options.esNuevo ? "" :
        "<a target='_blank' class='label-download input-group-btn' id='btnDescargarFile" + idAux + "' " +
        "href='" + urlArchivo(options.descargaUrl) + "'>" +
        "<span class='btn btn-primary'><i class='fa fa-download fa-lg'></i></span>" +
        "</a>");

    var inputEviA =
        "<div class='input-group'>" +
        "<label class='label-upload input-group-btn'>" +
        "<span class='btn btn-primary'>" +
        "<i class='fa fa-upload fa-lg'></i> Subir " +
        "<input " + textImagen + " style='display:none;' type='file' id='fileEvi" + idAux + "'>" +
        "</span>" +
        "</label>" +
        "<input type='text' id='inputEvi" + idAux + "' class='form-control' readonly>" +
        "" + buttonDescarga +
        "</div>" +
        (mensajeAux.length == 0 ? "" : "<label style='font-size:12px;'>" + mensajeAux + "</label>");

    $(options.container).html(inputEviA);

//   $("#btnDescargarFile"+idAux).attr("onclick","window.open('"+URL+options.descargaUrl+"','_blank')");

    $("#fileEvi" + idAux).on('fileselect', function (event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }
    });

    $("#inputEvi" + idAux).val(options.evidenciaNombre);

    $("#fileEvi" + idAux).on("change", function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');

        if (options.isImagen) {
            if (!comprabarImagen(label)) {
                alert("Sólo imágenes")

                return false;
            }
        }

        $("#btnDescargarFile" + idAux).remove();
        input.trigger('fileselect', [numFiles, label]);
        options.functionCall(idAux);
    });

    return inputEviA;
}

function getButtonDescargaAmazonS3(url,eviNombre,isButton){
   var btnEvidencia = (eviNombre == ""?"------":
      "<a class='"+(parseInt(isButton) == 1?"btn btn-success":"efectoLink")+"' target='_blank' href='"+URL+url+"'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>");

   return btnEvidencia;
}

function getButtonVisorEvidenciaAmazonS3(pId,pEviNombre,pUrl,saltoLinea,isButton) {
   var btnVisorEvidencia = (pEviNombre.length == 0?"":(parseInt(saltoLinea) == 1?"<br>":"") +
      "<a class='"+(parseInt(isButton) == 1?"btn btn-success":"efectoLink")+"' target='_blank' " +
         "onclick='mostrarVistaPreviaEvidenciaAmazonS3("+pId+",\""+pEviNombre+"\",\""+pUrl+"\")'>" +
         "<i class='fa fa-eye'></i> Vista previa" +
      "</a>");

   return btnVisorEvidencia;
}

function mostrarVistaPreviaEvidenciaAmazonS3(pId, pEviNombre, pUrl) {
    $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    // P106 (SEC-025): el archivo de S3 es privado. Imagenes y PDF se piden al back con la sesion del
    // usuario (urlArchivo). El visor de Google baja el archivo sin sesion, asi que usa un enlace firmado
    // que se pide al escribir la ventana (la ventana se abre en el clic, para que no la bloquee el navegador).
    var pIdAux = parseInt(pId), extension = getFileExtension(pEviNombre), fileUrlPreview = urlArchivo(pUrl);
    var htmlImagen = "<img src='" + fileUrlPreview + "' alt='Vista previa de imagen' style='display:block;margin:0 auto;'>";
    var htmlVisorGoogle = function (urlFirmada) {
        return "<iframe src='https://docs.google.com/viewer?url=" + encodeURIComponent(urlFirmada) + "&embedded=true' " +
            "style='width:100%;height:100%;'></iframe>";
    };

    // Lista de extensiones conocidas y tipos de archivo correspondientes
    var fileTypes = {
        'jpg': {label: 'Imagen JPG', previewHtml: htmlImagen},
        'jpeg': {label: 'Imagen JPEG', previewHtml: htmlImagen},
        'png': {label: 'Imagen PNG', previewHtml: htmlImagen},
        'gif': {label: 'Imagen GIF', previewHtml: htmlImagen},
        'xls': {label: 'Documento Excel', google: true},
        'xlsx': {label: 'Documento Excel', google: true},
        'doc': {label: 'Documento Word', google: true},
        'docx': {label: 'Documento Word', google: true},
        'csv': {label: 'Documento CSV', google: true},
        'mp4': {label: 'Video MP4', google: true}
        // Agrega más extensiones y tipos de archivo según tus necesidades
    };

    if (extension == "pdf") {
        var ventanasEmergentesEv = {};

        var popUp = 'width=' + (window.innerWidth * 0.8) + ',height=' + (window.innerHeight * 0.7) +
            ',resizable=yes,top=' + ((window.innerHeight - (window.innerHeight * 0.7)) / 2) +
            ',left=' + ((window.innerWidth - (window.innerWidth * 0.8)) / 2);

        ventanasEmergentesEv[pIdAux] = window.open(fileUrlPreview, '_blank', popUp);
        ventanasEmergentesEv[pIdAux].focus();

        $.unblockUI();
    } else if (extension in fileTypes) {
        var fileType = fileTypes[extension], ventanasEmergentesEv = {};

        if (ventanasEmergentesEv[pIdAux] && !ventanasEmergentesEv[pIdAux].closed) {
            ventanasEmergentesEv[pIdAux].close();
        }

        ventanasEmergentesEv[pIdAux] = window.open('', '', 'width=' + (window.innerWidth * 0.8) + ',height=' + (window.innerHeight * 0.7) +
            ',resizable=yes,top=' + ((window.innerHeight - (window.innerHeight * 0.7)) / 2) +
            ',left=' + ((window.innerWidth - (window.innerWidth * 0.8)) / 2));

        if(!ventanasEmergentesEv[pIdAux]){
            console.error("La ventana emergente fue bloqueada por el navegador.");$.unblockUI();
            return;
        }

        ventanasEmergentesEv[pIdAux].document.open();
        ventanasEmergentesEv[pIdAux].document.write('<html><head></head><body>Cargando...</body></html>');
        ventanasEmergentesEv[pIdAux].document.close();

        var escribirVentana = function (html) {
            ventanasEmergentesEv[pIdAux].document.open();
            ventanasEmergentesEv[pIdAux].document.write(html);
            ventanasEmergentesEv[pIdAux].document.close();
            $.unblockUI();
        };

        var waitForReadyState = setInterval(function(){
            if(ventanasEmergentesEv[pIdAux].document.readyState === 'complete'){
                clearInterval(waitForReadyState);
                if (fileType.google) {
                    obtenerUrlFirmada(pUrl, function (firmada) {
                        escribirVentana(firmada ? htmlVisorGoogle(firmada)
                            : "<p style='font-family:sans-serif'>No se pudo abrir la vista previa. " +
                              "<a href='" + fileUrlPreview + "' target='_blank'>Descargar el archivo</a></p>");
                    });
                } else {
                    escribirVentana(fileType.previewHtml);
                }
            }
        },500);
    } else {
        console.log('Tipo de archivo desconocido');
        $.unblockUI();
    }
}

function enviarParametrosExternoGet(pUrl, dataParamError, ruedaCarga, ruedaCargaFin, conectarConApi, functionCallback) {
    if (conectarConApi == 1) {
        $.ajax({
            url: pUrl, type: 'GET', processData: false, contentType: 'application/json', dataType: 'json',
            beforeSend: function () {
                if (ruedaCarga == 1) {
                    $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
                }
            },
            success: function (data) {
                if (ruedaCargaFin == 1) {
                    $.unblockUI();
                }

                functionCallback(data);
            },
            error: function (error) {
                $.unblockUI();
                console.log(error);
                var mensajeUx = "<label>Error al procesar la validación. " +
                    "Por favor, revise que la información enviada sea la correcta." +
                    "<br><br>(De persistir el error, comuníquese con GOSST).</label>";

                if (dataParamError.esModal == 1) {
                    $("#" + dataParamError.contenedorModal).modal("hide");

                    mensajesUx(mensajeUx, 2, "", "ActualizarVistaActual");

                    $("#modalMensajeUxActualizarVistaActual").on("hidden.bs.modal", function () {
                        $("#" + dataParamError.contenedorModal).modal("show");
                    });
                } else {
                    mensajesUx(mensajeUx, 2, "", "");
                }
            }
        });
    } else {
        if (ruedaCarga == 1) {
            $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
        }

        if (ruedaCargaFin == 1) {
            $.unblockUI();
        }

        functionCallback();
    }
}

function cerrarSesionPersonalizado() {
    var dataParam = {
        paramUrlLogin: "?" + getSession("paramUrlLogin")
    };

    callAjaxPost(URL + '/login/session/delete/personalizado', dataParam, null);
}

function guardarEvidenciaAutoVersionTres(habilitado, archivoId, inputFileId, bitsMax, ruedaCarga, ruedaCargaFin,
                                         urlEvidencia, functionCallback, fieldEvidencia, arrayDataAppend) {
    if (habilitado == 1) {
        fieldEvidencia = defaultFor(fieldEvidencia, "id");
        var archivoIdAux = archivoId;
        var inputFileImage = document.getElementById(inputFileId);
        var file = inputFileImage.files[0];
        var data = new FormData();

        if (file) {
            if (file.size > bitsMax) {
                alert("Lo sentimos, solo se pueden subir archivos menores a " + bitsMax / 1000000 + " MB");
                functionCallback();
            } else {
                var realizarCompresion = true;
                var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

                if (!filterType.test(file.type) || file.size < bitsMega * 1.5) {
                    realizarCompresion = false;
                }

                if (realizarCompresion) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);

                    fileReader.onload = function (event) {
                        var image = new Image();

                        image.onload = function () {
                            var canvas = document.createElement("canvas");
                            var context = canvas.getContext("2d");
                            var MAX_WIDTH = 800;
                            var MAX_HEIGHT = 600;
                            var width = image.width;
                            var height = image.height;

                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;

                            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

                            canvas.toBlob(function (blob) {
                                var fileFinal = new File([blob], file.name);

                                data.append("fileEvi", fileFinal);
                                data.append("fechaSubida", new Date());
                                data.append("fecha", $("#dateActividad").val());

                                if (arrayDataAppend) {
                                    arrayDataAppend.forEach(function (val, index) {
                                        data.append(val.id, val.value);
                                    });
                                }

                                data.append(fieldEvidencia, archivoId);

                                var url = URL + urlEvidencia;

                                $.ajax({
                                    url: url, type: 'POST', beforeSend: function () {
                                        if (ruedaCarga == 1) {
                                            $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
                                        }
                                    }, xhrFields: {withCredentials: true}, contentType: false,
                                    data: data, processData: false, cache: false,
                                    success: function (data, textStatus, jqXHR) {
                                        switch (data.CODE_RESPONSE) {
                                            case "06":
                                                sessionStorage.clear();
                                                document.location.replace(data.PATH);

                                                break;

                                            default:
                                                console.log("Prueba 1.2");
                                                $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                                functionCallback(data);
                                        }
                                    }, complete: function () {
                                        if (ruedaCargaFin == 1) {
                                            $.unblockUI();
                                        }
                                    }, error: function (jqXHR, textStatus, errorThrown) {
                                        $.unblockUI();
                                        alert("Estimado usuario, no excederse de 14mb o 30 caracteres del nombre del archivo");
                                        console.log('xhRequest: ' + jqXHR + "\n");
                                        console.log('ErrorText: ' + textStatus + "\n");
                                        console.log('thrownError: ' + errorThrown + "\n");
                                    },
                                    // Custom XMLHttpRequest
                                    xhr: function () {
                                        var myXhr = $.ajaxSettings.xhr();

                                        if (myXhr.upload) {
                                            // For handling the progress of the upload
                                            myXhr.upload.addEventListener('progress', function (e) {
                                                if (e.lengthComputable) {
                                                    var progreso = e.loaded / e.total;
                                                    console.log(pasarDecimalPorcentaje(progreso));
                                                    $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                                    $("#" + inputFileId).parent("span").append("<label id='labelProgress'>" + pasarDecimalPorcentaje(progreso) + "</label>");
                                                }
                                            }, false);
                                        }

                                        return myXhr;
                                    }
                                });
                            }, 'image/jpeg', 1);
                        }

                        image.src = event.target.result;
                    };
                } else {
                    data.append("fileEvi", file);
                    data.append("fechaSubida", new Date());
                    data.append("fecha", $("#dateActividad").val());

                    if (arrayDataAppend) {
                        arrayDataAppend.forEach(function (val, index) {
                            data.append(val.id, val.value);
                        });
                    }

                    data.append(fieldEvidencia, archivoId);

                    var url = URL + urlEvidencia;

                    $.ajax({
                        url: url, type: 'POST', beforeSend: function () {
                            if (ruedaCarga == 1) {
                                $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
                            }
                        }, xhrFields: {withCredentials: true}, contentType: false,
                        data: data, processData: false, cache: false,
                        success: function (data, textStatus, jqXHR) {
                            switch (data.CODE_RESPONSE) {
                                case "06":
                                    sessionStorage.clear();
                                    document.location.replace(data.PATH);

                                    break;

                                default:
                                    console.log("Prueba 1.2");
                                    $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                    functionCallback(data);
                            }
                        }, complete: function () {
                            if (ruedaCargaFin == 1) {
                                $.unblockUI();
                            }
                        }, error: function (jqXHR, textStatus, errorThrown) {
                            $.unblockUI();
                            alert("Estimado usuario, no excederse de 14mb o 30 caracteres del nombre del archivo");
                            console.log('xhRequest: ' + jqXHR + "\n");
                            console.log('ErrorText: ' + textStatus + "\n");
                            console.log('thrownError: ' + errorThrown + "\n");
                        },
                        // Custom XMLHttpRequest
                        xhr: function () {
                            var myXhr = $.ajaxSettings.xhr();

                            if (myXhr.upload) {
                                // For handling the progress of the upload
                                myXhr.upload.addEventListener('progress', function (e) {
                                    if (e.lengthComputable) {
                                        var progreso = e.loaded / e.total;
                                        console.log(pasarDecimalPorcentaje(progreso));
                                        $("#" + inputFileId).parent("span").find("#labelProgress").remove();
                                        $("#" + inputFileId).parent("span").append("<label id='labelProgress'>" + pasarDecimalPorcentaje(progreso) + "</label>");
                                    }
                                }, false);
                            }

                            return myXhr;
                        }
                    });
                }
            }
        } else {
            console.log("No se encontro " + inputFileId);

            if (ruedaCargaFin == 1) {
                $.unblockUI();
            }

            functionCallback();
        }
    } else {
        console.log("No está habilitado y/o se omitió " + inputFileId);

        if (ruedaCargaFin == 1) {
            $.unblockUI();
        }

        functionCallback();
    }
}

function marcarTodoListaRegistro(tblId){
   $("#"+tblId+" input[type='checkbox']").each(function(index,elem){
      $(elem).prop("checked",true);
   });
}

function desmarcarTodoListaRegistro(tblId){
   $("#"+tblId+" input[type='checkbox']").each(function(index,elem){
      $(elem).prop("checked",false);
   });
}

function limitInputDecimal(id) {
    $('#' + id).on('input', function(e) {
        var value = $(this).val();

        // Elimina cualquier caracter que no sea dígito o punto
        value = value.replace(/[^0-9.]/g, '');

        // Asegura que solo haya un punto en el número
        let pointCount = (value.match(/\./g) || []).length;
        while (pointCount > 1) {
            value = value.substring(0, value.lastIndexOf('.'));
            pointCount = (value.match(/\./g) || []).length;
        }

        // Divide el valor en parte entera y decimal, si existe
        if(value.includes('.')) {
            let parts = value.split('.');
            let integerPart = parts[0].substring(0, 15); // Limita la parte entera a 12 dígitos
            let decimalPart = parts[1].substring(0, 3); // Limita la parte decimal a 3 dígitos
            value = `${integerPart}.${decimalPart}`;
        } else {
            // Si no hay parte decimal, limita solo la parte entera
            value = value.substring(0, 15);
        }

        // Establece el valor corregido
        $(this).val(value);
    });
}

function fijarCabeceraTabla(idTabla) {
    $('#' + idTabla + ' thead th').css({
        'position': 'sticky',
        'top': '0',
        'background-color': 'white',
        'z-index': '1'
    });
}

var canvas,ctx,flag = false,prevX = 0,currX = 0,prevY = 0,currY = 0,dot_flag = false,x = "black",y = 2;
  
function draw(){
   ctx.beginPath();ctx.moveTo(prevX,prevY);ctx.lineTo(currX,currY);
   ctx.strokeStyle = x;ctx.lineWidth = y;ctx.stroke();ctx.closePath();
} 

function initCanvas(idCanvasContenedor,accesoCelular){
   canvas = document.getElementById(idCanvasContenedor);
   ctx = canvas.getContext("2d");

   var eventStart = (accesoCelular == 1?'touchstart':'mousedown'),
       eventMove = (accesoCelular == 1?'touchmove':'mousemove'),
       eventEnd = (accesoCelular == 1?'touchend':'mouseup'),
       eventOut = (accesoCelular == 1?'touchleave':'mouseout');

   canvas.addEventListener(eventStart,function(e){
      findxy('down',e,accesoCelular);
        
      if(accesoCelular == 1){
         e.preventDefault();
      }
   },false);
    
   canvas.addEventListener(eventMove,function(e){
      findxy('move',e,accesoCelular);
        
      if(accesoCelular == 1) {
         e.preventDefault();
      }
   },false);
    
   canvas.addEventListener(eventEnd,function(e){findxy('up',e,accesoCelular);},false);
   canvas.addEventListener(eventOut,function(e){findxy('out',e,accesoCelular);},false);
}

function findxy(res,e,accesoCelular){
   var canvasLeft,canvasTop;
    
   if(accesoCelular == 1){
      canvasLeft = canvas.getBoundingClientRect().left;
      canvasTop = canvas.getBoundingClientRect().top;

      if(e.touches && e.touches.length > 0){
         var touch = e.touches[0];
         currX = (touch.clientX - canvasLeft) * (canvas.width / canvas.getBoundingClientRect().width);
         currY = (touch.clientY - canvasTop) * (canvas.height / canvas.getBoundingClientRect().height);
      }
   }else{ 
      var eventDoc = (e.target && e.target.ownerDocument) || document; 
      var doc = eventDoc.documentElement; 
      var body = eventDoc.body; 
   
      e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0); 
   
      canvasLeft = canvas.offsetLeft,canvasTop = canvas.offsetTop;
  
      canvasLeft = canvas.getBoundingClientRect().left + window.pageXOffset;
      canvasTop = canvas.getBoundingClientRect().top + window.pageYOffset; 
   }
    
   if(res == 'down'){
      prevX = currX;prevY = currY;
        
      if(accesoCelular == 0){
         currX = e.pageX/2 - canvasLeft/2;currY = e.pageY - canvasTop;
      }
        
      flag = true;dot_flag = true;

      if(dot_flag){
         ctx.beginPath();ctx.fillStyle = x;
         ctx.fillRect(currX,currY,2,2);
         ctx.closePath();dot_flag = false;
      }
   }
    
   if(res == 'up' || res == "out"){ 
      flag = false; 
   } 
    
   if(res == 'move'){
      if(flag){     
         if(accesoCelular == 0){
            prevX = currX;prevY = currY;
            currX = e.pageX/2 - canvasLeft/2;
            currY = e.pageY - canvasTop;
            draw(); 
         }else{
            draw();
            prevX = currX;prevY = currY;
         }   
      }
   }
}

function guardarInitCanvasEvidenciaAuto(pUrl,dataParam,habilitado,ruedaCargaInicio,ruedaCargaFin,funcionRespuesta) {
   if(habilitado == 1){ 
      var formdata = new FormData();
      formdata.append("id",dataParam.id);formdata.append("fileEvi",dataParam.file);
   
      $.ajax({
         url:pUrl,type:"POST",data:formdata,processData:false,contentType:false,xhrFields: {withCredentials: true},
         beforeSend: function(){
            if(ruedaCargaInicio == 1){
               $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
            }
         },success: function(data,textStatus,jqXHR){
            switch(data.CODE_RESPONSE){
               case "06":
                  sessionStorage.clear();
                  document.location.replace(data.PATH);

                  break;

               case "07":
                  //sessionStorage.clear();
                  alert("Sesion expirada");
                  document.location.replace(data.PATH);

                  break;

               default:
        	  if(ruedaCargaFin == 1){
        	     $.unblockUI();   
        	  }
               
               	  funcionRespuesta(data);
               	  
               	  break;
            }
         },error: function(jqXHR,textStatus,errorThrown){
            $.unblockUI();
            console.log("Ruta de error: "+pUrl);

            var responseText = jQuery.parseJSON(jqXHR.responseText);

            if(responseText.CODE_RESPONSE == "07"){
               alert("Sesión Expiradaa");
               document.location.href = (responseText.PATH);
            }

            if(responseText.CODE_RESPONSE == "09"){
               alert("No tiene acceso al módulo");
            }

            //document.location.replace(responseText.PATH);
         }
      });
   }else{
      if(ruedaCargaFin == 1){
         $.unblockUI();   
      }
      
      funcionRespuesta();
   }
}

function mostrarMensaje(mensaje, code) {
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "timeOut": "2000",
        "positionClass": "toast-top-right",  // Asegúrate también de definir la posición de los toast si es necesario
        "preventDuplicates": true,  // Esto evita que se dupliquen mensajes idénticos consecutivos
    }
    if (code === 1) {
        toastr.success(mensaje);
    } else if (code === 2) {
        toastr.info(mensaje);
    } else if (code === 3) {
        toastr.warning(mensaje);
    } else if (code === 4) {
        toastr.error(mensaje);
    }
}

function verDetalleInformacionAsociada(idContenedor,idClase){
   $("."+idClase).show();
   $("#"+idContenedor).html("Ocultar detalle <i class='fa fa-angle-double-up'></i>");
   $("#"+idContenedor).attr("onclick","ocultarDetalleInformacionAsociada(\""+idContenedor+"\",\""+idClase+"\")");
}

function ocultarDetalleInformacionAsociada(idContenedor,idClase){
   $("."+idClase).hide();
   $("#"+idContenedor).html("Ver detalle <i class='fa fa-angle-double-down'></i>");
   $("#"+idContenedor).attr("onclick","verDetalleInformacionAsociada(\""+idContenedor+"\",\""+idClase+"\")");
}

function filtrarValoresDivisiones(){
    var listMultiUnidades = $("#selMulUnidadesFiltro").val();
    var listDivisionAux = [];

    if(listMultiUnidades != null){
        listMultiUnidades.forEach(function(val,index){
            listDivisiones.forEach(function(val1,index){
	            if(parseInt(val) == val1.matrixId){
	                listDivisionAux.push(val1);
	            }
	        });
        });
 
        if(listDivisionAux.length > 0){
            crearSelectOneMenuObligMultipleCompleto("selMulDivisionesFiltro","filtrarValoresAreas()",listDivisionAux,
                "divisionId","nombreAuxiliar","#divFiltroDivision","Todos");
    
            filtrarValoresAreas();
        }else{
            $("#divFiltroDivision").html("<label>*Sin divisiones registradas</label>");
            $("#divFiltroArea").html("<label>*Debe seleccionar al menos una división.</label>");
        }
    }else{
        $("#divFiltroDivision").html("<label>*Debe seleccionar al menos una unidad.</label>");
        $("#divFiltroArea").html("<label>*Debe seleccionar al menos una división.</label>");
    }
}

function filtrarValoresAreas(){
   var listMultiDivisiones = $("#selMulDivisionesFiltro").val();
   var listAreaAux = []; 

   if(listMultiDivisiones != null){
      listMultiDivisiones.forEach(function(val,index){
         listAreas.forEach(function(val1,index){
	    if(parseInt(val) == val1.divisionId){
	       listAreaAux.push(val1); 
	    }  
	 });
      });
 
      if(listAreaAux.length > 0){
         crearSelectOneMenuObligMultipleCompleto("selMulAreasFiltro","",listAreaAux,
            "areaId","nombreAuxiliar","#divFiltroArea","Todos");	
      }else{
	 $("#divFiltroArea").html("<label>*Sin áreas registradas</label>");
      }
   }else{
      $("#divFiltroArea").html("<label>*Debe seleccionar al menos una división.</label>");
   }
}

function callAjaxPostSimpleVersionDos(habilitado,pUrl,dataParam,ruedaCargaInicio,ruedaCargaFin,funcionRespuesta) {
   if(habilitado == 1){
      $.ajax({
         url:pUrl,type:'post',async:true,/*crossDomain: true,*/
         xhrFields: {withCredentials:true},data:JSON.stringify(dataParam),
         contentType:"application/json",
         beforeSend:function(){
            if(ruedaCargaInicio == 1){
               $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
            }
         },
         success:function(data,textStatus,jqXHR){
            switch(data.CODE_RESPONSE){
               case "06":
                  sessionStorage.clear();
                  document.location.replace(data.PATH);

                  break;

               case "07":
                  //sessionStorage.clear();
                  alert("Sesion expirada");
                  document.location.replace(data.PATH);

                  break;

               default:
                  funcionRespuesta(data);
            }
         },
         complete:function(){
            if(ruedaCargaFin == 1){
               $.unblockUI();
            }
         },
         error: function(jqXHR,textStatus,errorThrown){
             $.unblockUI();
             console.log("Ruta de error: "+pUrl);
             
             if(gosstError){
                 return;
             }

             gosstError = true;
             
             try{
                 var responseText = jQuery.parseJSON(jqXHR.responseText);

                 if(responseText.CODE_RESPONSE == "12"){
                     alert("Sesión Expirada. Debe loguearse de nuevo.");
                     document.location.href = responseText.PATH;
                 }else if (responseText.CODE_RESPONSE == "09"){
                     console.info('Debe autenticarse.');
                     document.location.href = responseText.PATH;
                 }else if (responseText.CODE_RESPONSE == "21"){
                     // P115: la sesion espera el codigo de verificacion; se vuelve al login.
                     alert("Para continuar, ingrese el código de verificación que se envió a su correo.");
                     document.location.href = responseText.PATH;
                 }else{
          	   alert("Ocurrió un problema al procesar la respuesta del servidor." +
          	       "\n\nSi ello persiste, por favor, repórtelo al soporte de la plataforma GOSST.");
          	   
          	   gosstError = false;
                 }
             }catch(e){
                 // Si ocurre un error inesperado al analizar la respuesta
                 alert("Error al procesar la respuesta del servidor.");
                 console.error("Error al parsear el JSON de respuesta",e);
                 
                 gosstError = false;
             }
         }
//         error:function(jqXHR,textStatus,errorThrown){
//            $.unblockUI();
//            console.log("Ruta de error: "+pUrl);
//
//            var responseText = jQuery.parseJSON(jqXHR.responseText);
//
//            if(responseText.CODE_RESPONSE == "07"){
//               alert("Sesión Expiradaa");
//               document.location.href = (responseText.PATH);
//            }
//
//            if(responseText.CODE_RESPONSE == "09"){
//               alert("No tiene acceso al módulo");
//            }
//            //document.location.replace(responseText.PATH);
//         }
      });
   }else{
      if(ruedaCargaFin == 1){
         $.unblockUI();
      }
      
      var dataAux={CODE_RESPONSE:"05"};
      
      funcionRespuesta(dataAux);
   }
}

function crearCheckListGeneral(modalPrincipal,nombreModalCheckList,sufijoCampos,listContenido,ocultarSufijo,functionCallBack){
    if(modalPrincipal.length > 0){
        $("#"+modalPrincipal).modal("hide");
    }

    $("#modalCheckList"+sufijoCampos).remove();

    var contenido = "";

    var buttonVolverPrincipal =
        "<button type='button' class='btn btn-info' onclick='ocultarCheckList"+ocultarSufijo+"()' " +
                "title='Regresar a la vista anterior.' style='margin-right:5px'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-table fa-2x'></i>" +
        "</button>";

    var buttonCheckTodo =
        "<button class='btn btn-success' onclick='marcarTodoListaRegistro(\"tblCheckList"+sufijoCampos+"\")' " +
                "title='Marcar todas las filas con un check.' style='margin-right:5px'>" +
            "<i class='fa fa-check fa-2x'></i>" +
        "</button>";

    var buttonCheckNada =
        "<button class='btn btn-success' onclick='desmarcarTodoListaRegistro(\"tblCheckList"+sufijoCampos+"\")' " +
                "title='Desmarcar todas las filas con un check.' style='margin-right:5px'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>";

    var modalOptions={
        maxWidth:"50%",id:"modalCheckList"+sufijoCampos,btnCerrarHabilitado:0,nombre:"<i class='fa fa-table'></i> "+nombreModalCheckList,
		contenidoClassAux:"modal-content-moderno",
        contenido:
		    "<div class='eventoGeneral-moderno'>"+
                "<div id='divCheckList"+sufijoCampos+"' class='form-inline' style='margin-top:10px;'>"+
                     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada +
                "</div>"+
                "<div class='wrapper' id='wrapperCheckList"+sufijoCampos+"'>" +
                    "<table id='tblCheckList"+sufijoCampos+"' class='table table-striped table-bordered table-hover table-fixed'>" +
                        "<thead>" +
                            "<tr>" +
                                "<th class='tb-acc' style='width:50px'>¿Asignado?</th>" +
                                "<th class='tb-acc' style='width:200px'>Nombre</th>" +
                            "</tr>" +
                        "</thead>" +
                        "<tbody></tbody>" +
                    "</table>" +
                "</div>" +
			"</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperCheckList"+sufijoCampos,250);

    $("#tblCheckList"+sufijoCampos+" tbody tr").remove();

    listContenido.forEach(function(val,index){
        $("#tblCheckList"+sufijoCampos+" tbody").append(
            "<tr id='trCheckList"+sufijoCampos+val.id+"'>" +
                "<td>"+"<input id='checkAsignado"+sufijoCampos+val.id+"' type='checkbox' class='form-control'>"+"</td>" +
                "<td>"+val.nombre+"</td>" +
            "</tr>");
    });

    goheadfixedY("#tblCheckList"+sufijoCampos,"#wrapperCheckList"+sufijoCampos);
    functionCallBack();
}

function agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,idNombreContenedor){
    if(listPanelesPrincipal.length == 0){
        $("#"+idNombreContenedor).append(
            "<div id='divNoResultados'>" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
            "</div>");

        $("#divNoResultados").find(".tituloSubList").html("Sin resultados");
    }

    listPanelesPrincipal.forEach(function(val,index){
        val.styleAux = (val.styleAux != undefined?val.styleAux:"");
        val.buttonAd = (val.buttonAd != undefined?val.buttonAd:"");
        val.btnSubIconoAux = (val.btnSubIconoAux != undefined?val.btnSubIconoAux:"");
        val.habilitarBtnSimple = (val.habilitarBtnSimple != undefined?val.habilitarBtnSimple:1);

        $("#"+idNombreContenedor).append(
            "<div id='"+val.id+"' class='"+val.clase+"'>" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList' style='"+val.styleAux+"'></div>" +
            "</div>");

        val.btnOnclickAux = (val.btnOnclickAux == ""?"cambiarDivSubContenido(this,null)":val.btnOnclickAux);
        val.btnIconoAux = (val.btnIconoAux == ""?"fa-caret-down":val.btnIconoAux);
        val.btnTitleAux = (val.btnTitleAux == ""?"Mostrar/Ocultar los registros de esta sección.":val.btnTitleAux);

        var textoBtn = (val.habilitarBtnSimple == 0?"":
            "<button class='btn btn-success' style='padding:4px 6px;' onclick='"+val.btnOnclickAux+"' title='"+val.btnTitleAux+"'>" +
                "<i class='fa "+val.btnIconoAux+" fa-4x' aria-hidden='true'></i> "+val.btnSubIconoAux +
            "</button>");

        $("#"+val.id).find(".tituloSubList").html(textoBtn+val.buttonAd+val.nombre);
        $("#"+val.id).find(".contenidoSubList").html(val.contenido);
    });
}

function calculoNumeroDiasTotal(textoFechaInicio,idInputFechaInicio,textoFechaFin,idInputFechaFin,idResultado){
    var fechaInicioDescanso = $("#"+idInputFechaInicio).val();
    var fechaFinDescanso = $("#"+idInputFechaFin).val();

    if(fechaInicioDescanso.length > 0 && fechaFinDescanso.length > 0){
        var numDiasDescanso = restaFechas(fechaInicioDescanso,fechaFinDescanso);

        if(numDiasDescanso >= 0) {
            $("#"+idResultado).html(numDiasDescanso);
        }else{
            $("#"+idResultado).html("<label>*La '"+textoFechaInicio+"' no puede ser menor a la '"+textoFechaFin+"'.</label>");
        }
    }else{
        $("#"+idResultado).html("<label>*Debe ingresar unas 'fecha inicio - descanso' y 'fecha fin - descanso' válidas.</label>");
    }
}

function formatoFecha(fecha) {
    let partes = fecha.split(" ")[0].split("-"); // Extrae la parte de la fecha y la divide
    return `${partes[2]}/${partes[1]}/${partes[0]}`; // Reordena a DD/MM/AAAA
}

function encriptarTexto(texto,claveSecreta) {
    var encriptado = CryptoJS.AES.encrypt(texto,CryptoJS.enc.Utf8.parse(claveSecreta),{
        mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.Pkcs7
    }).toString();

    return encriptado;
}

var listOpcionCambioUsuario = [];

function ocultarCambioUsuarioDirecto(){
    $("#modalCambioUsuarioDirecto").modal("hide");
}

function verCambioUsuarioDirecto(){
    $("#modalCambioUsuarioDirecto").remove();

    var dataParam={
        accesoUsuarios:parseInt(getSession("accesoUsuarios"))
    };

    callAjaxPostSimpleVersionDos(1,URL+'/login/cambio_usuario/valores_previos',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
            listOpcionCambioUsuario = data.listOpcionCambioUsuario;

            var selOpcCambioUsuDirecto = crearSelectOneMenuOblig("selOpcCambioUsuDirecto","",
                listOpcionCambioUsuario,"","id","nombre");

            var contenido = "";

            var listContenido=[
                {sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",label:"Vista",inputForm:selOpcCambioUsuDirecto},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",
                 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarCambioUsuarioDirecto()'>" +
                           "<i class='fa fa-times'></i> Cancelar" +
                       "</button>",
                 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='aplicarCambioUsuarioDirecto()'>" +
                               "<i class='fa fa-check-circle'></i> Aceptar" +
                           "</button>"}
            ];

            listContenido.forEach(function(val){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var modalOptions={
                id:"modalCambioUsuarioDirecto",nombre:"<i class='fa fa-search'></i> Seleccionar vista",
                contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
            };

            crearModalPrincipalUsuario(modalOptions,function(){},true,true);
        }else{
            console.log("NOPNPO");
        }
    });
}

function aplicarCambioUsuarioDirecto(){
    var dataParam={
        opcionCambioUsuario:parseInt($("#selOpcCambioUsuDirecto").val())
    };

    callAjaxPostSimpleVersionDos(1,URL+'/login/cambio_usuario/validated',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "01"){
            var clasifs = data.listaClasificaciones,pels = data.mapPeligros,riesgos = data.mapRiesgos;

            var pathRedireccion = data.PATH;

            // if(data.empresaId == 500){
            //     createSession("isAzure","1");createSession("isAzureClosed","0");
            // }

            createSession("moduloGosstId",data.moduloId);createSession("gestopcompanyid",data.empresaId);
            createSession("actPlanillaTrabAuto",data.actPlanillaTrabAuto);
            createSession("gestopcompanyname",data.empresaNombre);createSession("habilitarValidacion",data.habilitarValidacion);
            createSession("cambioUsuarioDirecto",data.cambioUsuarioDirecto);

            createSession("clasifs",JSON.stringify(clasifs));createSession("peligros",JSON.stringify(pels));
            createSession("riesgos",JSON.stringify(riesgos));/*createSession("gestopusername",data.usuarioNombre);*/

            createSession("numEmpresas",data.numEmpresas);createSession("numUnidades",data.numUnidades);
            createSession("trabajadorGosstId",data.trabajadorId);createSession("contratistaGosstId",data.contratistaId);
            createSession("tipoContratistaGosstId",data.tipoContratistaId);createSession("perfilContratistaGosstId",data.perfilContratistaId);
            createSession("unidadGosstId",data.trabajadorUnidadId);createSession("areaGosstId",data.trabajadorAreaId);
            createSession("puestoGosstId",data.trabajadorPuestoId);createSession("fechaActualizacionPuesto",data.trabajadorFechaPuesto);
            createSession("accesoGerencia", data.accesoGerencia);createSession("contratistaGosstRuc",data.contratistaRuc);

            createSession("fechaHoyTexto",data.fechaHoyTexto);createSession("fechaHoyOrdenInversoTexto",data.fechaHoyOrdenInversoTexto);
            createSession("trabajadorSiteId",data.trabajadorSiteId);createSession("accesoUsuarios",data.accesoUsuarios);
            createSession("hasTutorialCap",data.hasTutorialCap);createSession("gestopInicio",0);
            createSession("modulo","Modulos");

            if(pathRedireccion){
                // P115: si la cuenta destino pide el codigo de verificacion, se valida antes de entrar.
                if(data.mfaPendiente == 1){
                    $("#modalCambioUsuarioDirecto").modal("hide");

                    solicitarCodigoVerificacion(data.mfaCorreo,function(){
                        document.location.href = (pathRedireccion);
                    },false);
                }else{
                    document.location.href = (pathRedireccion);
                }
            }
        }else if(data.mensajeRespuesta){
            mensajesUx(data.mensajeRespuesta,2,"","CambioUsuarioDirecto");
        }else{
            console.log("NOPNPO");
        }
    });
}

// P115: ventana del codigo de verificacion (segundo factor). El servidor genera y exige el codigo: mientras la sesion
// este pendiente, rechaza cualquier otra pantalla. alValidar se ejecuta cuando el codigo es correcto. enLogin = true si
// la ventana se abre desde una pagina de ingreso (al salir se recarga esa pagina); si no (cambio de vista), al salir se
// cierra la sesion.
var mfaAlValidar = null, mfaEnLogin = false;

function solicitarCodigoVerificacion(correoEnmascarado, alValidar, enLogin){
    var correo = $("<div>").text(correoEnmascarado == null ? "" : String(correoEnmascarado)).html();

    var contenido =
        "<div class='eventoGeneral' style='padding:5px 10px'>" +
            "<p>Le enviamos un código de 6 dígitos a <b id='mfaCorreoDestino'>" + correo + "</b>. Vence en 10 minutos.</p>" +
            "<input id='inputCodigoVerificacion' class='form-control' inputmode='numeric' autocomplete='one-time-code' maxlength='6' " +
                "placeholder='Código de 6 dígitos' style='font-size:20px;letter-spacing:6px;text-align:center'>" +
            "<p id='mfaMensaje' style='margin-top:10px;min-height:20px'></p>" +
            "<div style='display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap'>" +
                "<a class='efectoLink' onclick='reenviarCodigoVerificacion()'><i class='fa fa-envelope-o'></i> Enviar otro código</a>" +
                "<span>" +
                    "<button type='button' class='btn btn-default' onclick='salirCodigoVerificacion()' style='margin-right:8px'>Cancelar</button>" +
                    "<button type='button' class='btn btn-success' onclick='validarCodigoVerificacion()'><i class='fa fa-check'></i> Validar</button>" +
                "</span>" +
            "</div>" +
        "</div>";

    mfaAlValidar = alValidar;mfaEnLogin = (enLogin === true);

    crearModalPrincipalUsuario({id:"modalCodigoVerificacion",nombre:"<i class='fa fa-shield'></i> Código de verificación",
        contenido:contenido,maxWidth:"420px",btnCerrarHabilitado:0},function(){
        $("#inputCodigoVerificacion").focus();
    },true,true);

    $("#inputCodigoVerificacion").on("keyup",function(e){
        if(e.key === "Enter"){
            validarCodigoVerificacion();
        }
    });
}

function mensajeCodigoVerificacion(texto, esError){
    $("#mfaMensaje").css("color",(esError ? "#c0392b" : "#1e8449")).text(texto);
}

function salirPorCodigoVerificacion(texto){
    mensajeCodigoVerificacion(texto,true);
    setTimeout(salirCodigoVerificacion,2500);
}

function validarCodigoVerificacion(){
    var codigo = $("#inputCodigoVerificacion").val().trim();

    if(!/^\d{6}$/.test(codigo)){
        mensajeCodigoVerificacion("Escriba el código de 6 dígitos que recibió.",true);
        return;
    }

    callAjaxPost(URL + '/login/mfa/validar',{codigo:codigo},function(data){
        if(data.CODE_RESPONSE != "05"){
            mensajeCodigoVerificacion("No se pudo validar el código. Inténtelo de nuevo.",true);
            return;
        }

        switch(data.resultado){
            case "VALIDADO":
                $("#modalCodigoVerificacion").modal("hide");

                if(typeof mfaAlValidar === "function"){
                    mfaAlValidar();
                }

                break;

            case "INCORRECTO":
                $("#inputCodigoVerificacion").val("");
                mensajeCodigoVerificacion("Código incorrecto. " + (data.intentosRestantes == 1 ? "Le queda 1 intento." :
                    "Le quedan " + data.intentosRestantes + " intentos."),true);

                break;

            case "VENCIDO":
                mensajeCodigoVerificacion("El código venció. Pida uno nuevo con \"Enviar otro código\".",true);

                break;

            case "SIN_CODIGO":
                mensajeCodigoVerificacion("No hay un código vigente. Pida uno nuevo con \"Enviar otro código\".",true);

                break;

            case "AGOTADO":
                salirPorCodigoVerificacion("Superó los intentos permitidos. Debe volver a ingresar.");

                break;

            case "BLOQUEADO":
                salirPorCodigoVerificacion("Por seguridad, el ingreso con código quedó bloqueado por una hora debido a varios códigos incorrectos.");

                break;

            default:
                mensajeCodigoVerificacion("No se pudo validar el código. Inténtelo de nuevo.",true);
        }
    });
}

function reenviarCodigoVerificacion(){
    callAjaxPost(URL + '/login/mfa/reenviar',{},function(data){
        if(data.CODE_RESPONSE != "05"){
            mensajeCodigoVerificacion("No se pudo enviar otro código. Inténtelo de nuevo.",true);
            return;
        }

        switch(data.resultado){
            case "ENVIADO":
                $("#mfaCorreoDestino").text(data.correo);
                $("#inputCodigoVerificacion").val("").focus();
                mensajeCodigoVerificacion("Le enviamos un código nuevo. El anterior ya no sirve.",false);

                break;

            case "ESPERAR":
                mensajeCodigoVerificacion("Espere " + data.segundosEspera + " segundos para pedir otro código.",true);

                break;

            case "VALIDADO":
                $("#modalCodigoVerificacion").modal("hide");

                if(typeof mfaAlValidar === "function"){
                    mfaAlValidar();
                }

                break;

            case "LIMITE":
                salirPorCodigoVerificacion("Ya no puede pedir más códigos. Debe volver a ingresar.");

                break;

            case "AGOTADO":
                salirPorCodigoVerificacion("Superó los intentos permitidos. Debe volver a ingresar.");

                break;

            case "BLOQUEADO":
                salirPorCodigoVerificacion("Por seguridad, el ingreso con código quedó bloqueado por una hora debido a varios códigos incorrectos.");

                break;

            default:
                mensajeCodigoVerificacion("No se pudo enviar otro código. Inténtelo de nuevo.",true);
        }
    });
}

// Sale de la ventana sin validar: se elimina la sesion pendiente. En una pagina de ingreso se recarga esa misma pagina
// (conserva la direccion del login personalizado); en el cambio de vista se cierra la sesion como siempre.
function salirCodigoVerificacion(){
    $("#modalCodigoVerificacion").modal("hide");

    if(mfaEnLogin){
        $.ajax({
            url:URL + '/login/session/delete',type:'post',xhrFields:{withCredentials:true},
            data:JSON.stringify({}),contentType:"application/json",
            complete:function(){
                if(typeof removeAllSession === "function"){
                    removeAllSession();
                }

                document.location.reload();
            }
        });
    }else{
        cerrarSesion();
    }
}

function cerrarSesionPersonalizadoContratista(){
    var dataParam={
        paramUrlLogin:"?"+getSession("paramUrlLogin")
    };

    callAjaxPost(URL+'/login/session/delete/personalizado/contratista',dataParam,null);
}

function obtenerContratistaListaDocumentosNivelEmpresa(pContratistaObj,pEstadoDocNivelEmpConObj,pClase){
    var textoProgramaSST = "Programa SST asociado a la empresa:",
        textoProcTrabajoSeguroTraAltoRiesgo = "Procedimiento de trabajo seguro para trabajos de alto riesgo:";

    if(parseInt(getSession("empresaId")) == 647){
        textoProgramaSST = "Programa SST:";textoProcTrabajoSeguroTraAltoRiesgo = "Procedimiento de trabajo seguro:";
    }
    
    var listContenidoDocNivEmpAux = [];
	
	function agregarListaDocumentosNivelEmpresa(habilitar,label,inputForm){
        if(habilitar == 1){
	        listContenidoDocNivEmpAux.push({clase:pClase,label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
	            {clase:pClase,anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:label,inputForm:inputForm});
	    }
	}
	
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoIndicadorMensualSst,"Indicador mensual SST:",pEstadoDocNivelEmpConObj.textoIndicadorMensualSst);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoActaCompromiso,"Acta de compromiso:",pEstadoDocNivelEmpConObj.textoActaCompromiso);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoReglamentoSst,"Reglamento SST:",pEstadoDocNivelEmpConObj.textoReglamentoSst);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoPoliticaSst,"Política SST:",pEstadoDocNivelEmpConObj.textoPoliticaSst);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoPlanAnualSst,"Plan anual SST:",pEstadoDocNivelEmpConObj.textoPlanAnualSst);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoProgramaSst,textoProgramaSST,pEstadoDocNivelEmpConObj.textoProgramaSst);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoPlanAnualSaludOcupacional,"Plan anual de salud ocupacional:",pEstadoDocNivelEmpConObj.textoPlanAnualSaludOcupacional);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoProgVigilanciaSaludOcupacional,"Programa de vigilancia de salud ocupacional:",pEstadoDocNivelEmpConObj.textoProgVigilanciaSaludOcupacional);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoCertificadoHomologacion,"Certificado de homologación con el cliente:",pEstadoDocNivelEmpConObj.textoCertificadoHomologacion);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoProcTrabajoSeguroTraAltoRiesgo,textoProcTrabajoSeguroTraAltoRiesgo,pEstadoDocNivelEmpConObj.textoProcTrabajoSeguroTraAltoRiesgo);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoConstanciaLaboral,"Constancia de registro laboral:",pEstadoDocNivelEmpConObj.textoConstanciaLaboral);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoNoNucleoNegocio,"Declaración de no núcleo del negocio:",pEstadoDocNivelEmpConObj.textoNoNucleoNegocio);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoCartaFianza,"Carta fianza:",pEstadoDocNivelEmpConObj.textoCartaFianza);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoComunicadoSindicales,"Comunicado a organizaciones sindicales:",pEstadoDocNivelEmpConObj.textoComunicadoSindicales);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoComunicadoRepresentantes,"Comunicado a representantes de trabajadores:",pEstadoDocNivelEmpConObj.textoComunicadoRepresentantes);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoComunicadoTrabPrincipal,"Comunicado a trabajadores (principal):",pEstadoDocNivelEmpConObj.textoComunicadoTrabPrincipal);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoComunicadoTrabContratista,"Comunicado a trabajadores (contratista):",pEstadoDocNivelEmpConObj.textoComunicadoTrabContratista);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoFichaRuc,"Ficha RUC:",pEstadoDocNivelEmpConObj.textoFichaRuc);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoConstanciaTercerizadoras,"Constancia registro de tercerizadoras:",pEstadoDocNivelEmpConObj.textoConstanciaTercerizadoras);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoContratoEmpUsuarias,"Contratos con empresas usuarias:",pEstadoDocNivelEmpConObj.textoContratoEmpUsuarias);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoPartidaRegistral,"Partida registral:",pEstadoDocNivelEmpConObj.textoPartidaRegistral);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoAsientoPartidaRegistral,"Asiento de la partida registral:",pEstadoDocNivelEmpConObj.textoAsientoPartidaRegistral);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoTrabajosTercerizados,"Contratos de trabajos tercerizados:",pEstadoDocNivelEmpConObj.textoTrabajosTercerizados);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoServiciosTercerizados,"Declaración de servicios tercerizados:",pEstadoDocNivelEmpConObj.textoServiciosTercerizados);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoServicioTrabajadores,"Informe de servicio de trabajadores:",pEstadoDocNivelEmpConObj.textoServicioTrabajadores);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoComiteSupervisorSst,"Comité/Supervisor SST:",pEstadoDocNivelEmpConObj.textoComiteSupervisorSst);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoHojaAtencionSctr,"Hoja de atención del SCTR:",pEstadoDocNivelEmpConObj.textoHojaAtencionSctr);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoAcuerdoConfidencialidad,"Acuerdo de confidencialidad:",pEstadoDocNivelEmpConObj.textoAcuerdoConfidencialidad);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoFlujoRespuestaAccidente,"Flujo de respuesta ante accidentes:",pEstadoDocNivelEmpConObj.textoFlujoRespuestaAccidente);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoAcuerdoSeguridadTerceros,"Acuerdo de seguridad para terceros y contratistas:",pEstadoDocNivelEmpConObj.textoAcuerdoSeguridadTerceros);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoAcuerdoSeguridadProveedores,"Acuerdo de seguridad para proveedores:",pEstadoDocNivelEmpConObj.textoAcuerdoSeguridadProveedores);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont88,"Seguro vida ley:",pEstadoDocNivelEmpConObj.textoExamNivelCont88);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont91,"Formatos de campo:",pEstadoDocNivelEmpConObj.textoExamNivelCont91);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont92,"Declaración jurada de SST:",pEstadoDocNivelEmpConObj.textoExamNivelCont92);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont93,"Registro de seguridad del contratista:",pEstadoDocNivelEmpConObj.textoExamNivelCont93);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont94,"Declaración jurada para contratistas:",pEstadoDocNivelEmpConObj.textoExamNivelCont94);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont95,"Licencia o permiso emitido por la AMP:",pEstadoDocNivelEmpConObj.textoExamNivelCont95);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont96,"Carta de aceptación de la norma:",pEstadoDocNivelEmpConObj.textoExamNivelCont96);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont97,"Póliza de responsabilidad civil de la empresa:",pEstadoDocNivelEmpConObj.textoExamNivelCont97);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont98,"Formulario y control a terceras partes:",pEstadoDocNivelEmpConObj.textoExamNivelCont98);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont102,"Autorización Osinergmin para combustible:",pEstadoDocNivelEmpConObj.textoExamNivelCont102);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont103,"Autorización de circulación del MTC:",pEstadoDocNivelEmpConObj.textoExamNivelCont103);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont104,"Ficha técnica guantes aislantes clase 0/00:",pEstadoDocNivelEmpConObj.textoExamNivelCont104);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont105,"Certificado dieléctrico pértiga y manta aislante:",pEstadoDocNivelEmpConObj.textoExamNivelCont105);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont106,"Ficha técnica de componentes del traje contra arco eléctrico:",pEstadoDocNivelEmpConObj.textoExamNivelCont106);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont107,"Ficha técnica de botas dieléctricas:",pEstadoDocNivelEmpConObj.textoExamNivelCont107);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont108,"Certificado de ensayo dieléctrico guantes clase 1–4:",pEstadoDocNivelEmpConObj.textoExamNivelCont108);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont109,"Certificado de ensayo dieléctrico de banqueta aislante:",pEstadoDocNivelEmpConObj.textoExamNivelCont109);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont110,"Certificado de ensayo de puesta a tierra temporal:",pEstadoDocNivelEmpConObj.textoExamNivelCont110);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont123,"Constancia declaración y pago - PLAME:",pEstadoDocNivelEmpConObj.textoExamNivelCont123);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont124,"Planilla electrónica R01:",pEstadoDocNivelEmpConObj.textoExamNivelCont124);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont125,"Constancia de pago AFP:",pEstadoDocNivelEmpConObj.textoExamNivelCont125);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont126,"Constancia depósito CTS - Mayo y Noviembre:",pEstadoDocNivelEmpConObj.textoExamNivelCont126);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont127,"Constancia depósito gratificación - Julio y Diciembre:",pEstadoDocNivelEmpConObj.textoExamNivelCont127);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont137,"Procedimiento de acreditación en SST para subcontratistas:",pEstadoDocNivelEmpConObj.textoExamNivelCont137);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont138,"Declaración jurada - capacitación:",pEstadoDocNivelEmpConObj.textoExamNivelCont138);
	agregarListaDocumentosNivelEmpresa(pContratistaObj.habilitadoExamNivelCont139,"Constancia del centro educativo de formación:",pEstadoDocNivelEmpConObj.textoExamNivelCont139);

    return listContenidoDocNivEmpAux;
}

function obtenerContratistaListaDocumentosNivelProyecto(pProyectoObj,pEstadoDocNivelProyConObj,pClase){
    var listContenidoDocNivProyAux = [];
	
	function agregarListaDocumentosNivelProyecto(habilitar,label,inputForm){
	    if(habilitar == 1){
            listContenidoDocNivProyAux.push({clase:pClase,label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		        {clase:pClase,anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:label,inputForm:inputForm});
		}
    }
    
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad1,"Actividad programa:",pEstadoDocNivelProyConObj.textoActividadPrograma);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad2,"Plan de emergencia:",pEstadoDocNivelProyConObj.textoPlanEmergencia);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad4,"Plan de manejo de residuos:",pEstadoDocNivelProyConObj.textoPlanManejoResiduo);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad7,"Matriz de Riesgo (IPERC):",pEstadoDocNivelProyConObj.textoMatrizRiesgoDoc);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad6,"Plan COVID:",pEstadoDocNivelProyConObj.textoPlanCovid);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad10,"Registro de capacitaciones efectuadas relacionados a los trabajos a realizar:",pEstadoDocNivelProyConObj.textoRegCapRealizadas);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad11,"Orden de compra o contrato firmado:",pEstadoDocNivelProyConObj.textoOrdenCompra);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad12,"Cronograma de trabajo:",pEstadoDocNivelProyConObj.textoCronogramaTrabajo);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad13,"Programa de charlas diarias de seguridad:",pEstadoDocNivelProyConObj.textoProgramaCharlas);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad14,"Procedimiento escrito de trabajo seguro (PETS):",pEstadoDocNivelProyConObj.textoProcedimientoAts);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad15,"Hoja MSDS:",pEstadoDocNivelProyConObj.textoHojaMsds);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad16,"Instructivo de trabajo seguro para el trabajo en alto riesgo:",pEstadoDocNivelProyConObj.textoInstructivoTrabAltoRiesgo);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad18,"Matriz de aspectos ambientales:",pEstadoDocNivelProyConObj.textoMatrizAspectoAmbiental);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad19,"Memoria descriptiva:",pEstadoDocNivelProyConObj.textoActividad19);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad20,"Póliza de responsabilidad civil:",pEstadoDocNivelProyConObj.textoActividad20);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad21,"Póliza CAR:",pEstadoDocNivelProyConObj.textoActividad21);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad22,"Carta fianza:",pEstadoDocNivelProyConObj.textoActividad22);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad23,"Plan de rescate:",pEstadoDocNivelProyConObj.textoActividad23);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad24,"Plan de izaje:",pEstadoDocNivelProyConObj.textoActividad24);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad25,"Matriz de procesos y actividades:",pEstadoDocNivelProyConObj.textoActividad25);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad26,"Estructura de SST para el servicio:",pEstadoDocNivelProyConObj.textoActividad26);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad27,"Plan de contingencia:",pEstadoDocNivelProyConObj.textoActividad27);
	agregarListaDocumentosNivelProyecto(pProyectoObj.habilitadoActividad28,"Señalización de obras e instalaciones:",pEstadoDocNivelProyConObj.textoActividad28);
    
    return listContenidoDocNivProyAux;
}

function obtenerContratistaListaDocumentosNivelTrabajadorContratista(pProyectoObj,pTrabajadorContratistaObj,pEstadoDocNivelTrabContConObj,pClase){
	var tipoExamenContUno = "Certificado Aptitud Médico";
	
    var textoTrabajosAltoRiesgoHabMedCli = (pProyectoObj.habilitadoMedicoClinica == 1 && pTrabajadorContratistaObj.textoTrabajosAltoRiesgoHabMedCli.length > 0?"<br>["+pTrabajadorContratistaObj.textoTrabajosAltoRiesgoHabMedCli+"]":"");
    
	if(parseInt(getSession("empresaId")) == 741){
		tipoExamenContUno = "Habilitación médica ocupacional";
	}
	
	var listContenidoDocNivTrabContAux = [];
	
	function agregarListaDocumentosNivelTrabajadorContratista(habilitar,label,inputForm){
        if(habilitar == 1){
	        listContenidoDocNivTrabContAux.push({clase:pClase,label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
			    {clase:pClase,anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:label,inputForm:inputForm});
		}
    }
	
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoCertAptMedica,tipoExamenContUno+":",pEstadoDocNivelTrabContConObj.textoExamen);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoSctr,"SCTR:",pEstadoDocNivelTrabContConObj.textoSctr);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoEpp,"EPP:",pEstadoDocNivelTrabContConObj.textoEpp);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitacionInduccion3,"Inducción del cliente:",pEstadoDocNivelTrabContConObj.textoInduccion);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoCargReglamento,"Cargo reglamento:",pEstadoDocNivelTrabContConObj.textoCargo);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoTRegistro,"T-registro:",pEstadoDocNivelTrabContConObj.textoTreg);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoInduccSstCont,"Inducciones SST de la contratista:",pEstadoDocNivelTrabContConObj.textoInduccionSst);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoPruebaCovid,"Prueba COVID-19:",pEstadoDocNivelTrabContConObj.textoPruebaCovid);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoVacunaCovid,"Vacuna COVID-19:",pEstadoDocNivelTrabContConObj.textoVacunaCovid);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoCertifPolicial,"Certificados policiales:",pEstadoDocNivelTrabContConObj.textoCertificadoPolicial);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoAntecedentesPenales,"Antecedentes penales:",pEstadoDocNivelTrabContConObj.textoAntecedentesPenales);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoSeguroAccidentes,"Seguro contra accidentes:",pEstadoDocNivelTrabContConObj.textoSeguroAccidentes);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoRiesgoExposicionPuestoTrabajo,"Riesgo de exposición al puesto de trabajo:",pEstadoDocNivelTrabContConObj.textoRiesgoExposicionPuestoTrabajo);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoVacunacionCovid,"Vacunación COVID-19:",pEstadoDocNivelTrabContConObj.textoVacunacionCovid);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoCarnetSanidad,"Carnet de sanidad:",pEstadoDocNivelTrabContConObj.textoCarnetSanidad);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoAcuerdoSeguridadEquElec,"Acuerdo de seguridad y confidencialidad - equipos electrónicos:",pEstadoDocNivelTrabContConObj.textoAcuerdoSeguridadEquElec);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoEvaluacionToxicologica,"Evaluación toxicológica:",pEstadoDocNivelTrabContConObj.textoEvaluacionToxicologica);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoCertifUnicoLaboral,"Certificado único laboral:",pEstadoDocNivelTrabContConObj.textoCertifUnicoLaboral);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoAntecedentesPoliciales,"Antecedentes policiales:",pEstadoDocNivelTrabContConObj.textoAntecedentesPoliciales);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoDeclaracionVerifDomicilio,"Declaración jurada o verificación del domicilio:",pEstadoDocNivelTrabContConObj.textoDeclaracionVerifDomicilio);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoDotacionIndumentaria,"Dotación indumentaria:",pEstadoDocNivelTrabContConObj.textoDotacionIndumentaria);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoMedicoClinica,"Habilitación médica por clínica:",pEstadoDocNivelTrabContConObj.textoHabilitadoMedicoClinica+textoTrabajosAltoRiesgoHabMedCli);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont84,"Cargo RISST de la contratista:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont84);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont89,"Cargo de recepción de IPERC:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont89);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont90,"Seguro vida ley:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont90);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont99,"Documento de identidad:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont99);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont100,"Procedimiento o manual para trab. contratistas:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont100);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont101,"Cargo de procedimiento de HS:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont101);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont111,"Inducción SSOMA del cliente:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont111);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont112,"Registro de capacitación en procedimiento de trabajo:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont112);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont113,"Registro de difusión de política de seguridad del cliente:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont113);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont114,"Registro de difusión de RISST del cliente:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont114);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont115,"Capacitación en reporte de accidentes e incidentes (flujograma):",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont115);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont116,"Difusión de IPERC, PETS y PETAR:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont116);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont117,"Registro de capacitación por puesto de trabajo:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont117);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont118,"Registro de capacitación de IPERC de la contratista:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont118);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont119,"Capacitación de buenas prácticas de manipulación de alimentos:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont119);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont128,"Título del profesional:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont128);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont129,"Evidencia colegiatura habilitada:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont129);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont130,"Registro nacional de especialidad:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont130);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont131,"Constancia/Carnet SUCAMEC:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont131);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont132,"Certificado capacitacion - BLS (Basic Life Support):",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont132);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont133,"Certificado capacitacion - PHLS (Prehospital Trauma Life Support):",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont133);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont134,"Certificado capacitacion - ACLS (Advance Cardiovascular Life Support):",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont134);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont140,"Difusión de plan de respuesta a emergencia del cliente:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont140);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont141,"Charla de inducción SST y MA:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont141);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont142,"Difusión y entrega de política de sostenibilidad del cliente:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont142);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont143,"Difusión y entrega plan COVID-19:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont143);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont144,"Capacitación en matriz IPERC:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont144);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont145,"Capacitación en matriz IAAS:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont145);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont146,"Capacitación en primeros auxilios:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont146);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont147,"Capacitación en uso extintor:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont147);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont148,"Capacitación en plan contingencia:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont148);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont149,"Capacitación en procedimiento de trabajo:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont149);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont150,"Capacitación en ATS:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont150);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont151,"Capacitación en capacitación uso de EPP:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont151);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont152,"Capacitación en manejo de insumos químicos - hojas MSDS:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont152);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont153,"Capacitación en uso de herramientas manuales:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont153);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont154,"Capacitación en procedimiento de señalización:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont154);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont155,"IBT 1:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont155);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont156,"IBT 2:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont156);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont157,"IBT 3:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont157);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont158,"IBT 4:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont158);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoExamNivelTrabCont159,"IBT 5:",pEstadoDocNivelTrabContConObj.textoExamNivelTrabCont159);
	agregarListaDocumentosNivelTrabajadorContratista(pProyectoObj.habilitadoHojaVida,"Hoja de Vida:",pEstadoDocNivelTrabContConObj.textoHojaVida);
    
    return listContenidoDocNivTrabContAux;
}

function crearRadiosAutoOpcionesV2(nameId, listOptions, radioSelected, idValue, nombreValue, choice, align) {

    var selectedArray = radioSelected?radioSelected.split(","):[];

    var textoOpcionesRadio = "<div class='containerCenter'>";

    listOptions.forEach(function(val){
        var checked = "";

        if(choice == "radio"){
            checked = (parseInt(radioSelected) == parseInt(val[idValue]))?"checked":"";
        }else{
            checked = selectedArray.includes(String(val[idValue]))?"checked":"";
        }

        textoOpcionesRadio +=
            "<div class='"+(choice == "checkbox"?"containerInputRadioChecbox":"")+"' style='" +
             (choice == "checkbox"?"padding-left:20px":"width:50%")+";display:inline-block;text-align:"+align+";'>" +
                "<label for='"+val[idValue]+nameId+"'>" +
                    "<input type='"+choice+"' id='"+val[idValue]+nameId+"' name='"+nameId+"' value='"+val[idValue]+"' "+checked+">"+val[nombreValue] +
                "</label>" +
            "</div>";
    });

    textoOpcionesRadio += "</div>";

    return textoOpcionesRadio;
}

function obtenerSubPanelModuloVersionTres(val){
	val.idPrincipalDivContainer = (val.idPrincipalDivContainer != undefined?val.idPrincipalDivContainer:"");
	val.idDivContainer = (val.idDivContainer != undefined?val.idDivContainer:"");
	val.clase = (val.clase != undefined?val.clase:"");
    val.styleTotal = (val.styleTotal != undefined?val.styleTotal:"");
    val.anchoLabel = (val.anchoLabel != undefined?val.anchoLabel:"col-sm-4");
    val.anchoDiv = (val.anchoDiv != undefined?val.anchoDiv:"col-sm-8");
	val.sugerencia = (val.sugerencia != undefined?val.sugerencia:"");

    if(val.fullRow == 1) {
        return "<div "+(val.idPrincipalDivContainer.length != 0?"id='"+val.idPrincipalDivContainer+"' ":"")+"class='form-group row"+(val.clase.length != 0?" "+val.clase:"")+"'" +
		             (val.styleTotal.length != 0?" style='"+val.styleTotal+"'":"")+">" +
                   "<div "+(val.idDivContainer.length != 0?"id='"+val.idDivContainer+"' ":"")+"class='col-sm-12'>"+val.inputForm+"</div>" +
               "</div>";
    }

    return "<div "+(val.idPrincipalDivContainer.length != 0?"id='"+val.idPrincipalDivContainer+"' ":"")+"class='form-group row"+(val.clase.length != 0?" "+val.clase:"")+"'" +
	             (val.styleTotal.length != 0?" style='"+val.styleTotal+"'":"")+">" +
               "<label for='colFormLabel' class='"+val.anchoLabel+" col-form-label'>"+val.label+"</label>" +
               "<div "+(val.idDivContainer.length != 0?"id='"+val.idDivContainer+"' ":"")+"class='"+val.anchoDiv+"'>" +
				    val.inputForm+(val.sugerencia.length != 0?"<small>"+val.sugerencia+"</small>":"") +
               "</div>" +
          "</div>";
}

function obtenerFilaDobleInfoSimple(label,valor){
    return "<div class='fila-doble-info'>" +
        "<div class='fila-doble-info-item' style='flex:0 0 100%;'>" +
            "<div class='fila-doble-info-label'>"+label+"</div>" +
            "<div class='fila-doble-info-valor'>"+valor+"</div>" +
        "</div>" +
    "</div>";
}

function obtenerVehiculoMaquinariaListaDocumentosNivelVehMaq(pVehiculoMaquinariaObj,pEstadoActualVehMaq,pClase){
    var listContenidoDocNivVehMaqAux = [];
	
	function agregarListaDocumentosNivelVehiculoMaquinaria(habilitar,label,inputForm){
	    if(habilitar == 1){
            listContenidoDocNivVehMaqAux.push({clase:pClase,label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		        {clase:pClase,anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:label,inputForm:inputForm});
		}
    }
    
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarCheckListIngreso,"Check list de ingreso:",pEstadoActualVehMaq.estadoActualCheckListIngreso);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarInspeccionTecnica,"Inspección técnica:",pEstadoActualVehMaq.estadoActualInspeccionTecnica);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarPolizaContraTodo,"Póliza contra todo riesgo::",pEstadoActualVehMaq.estadoActualPolizaContraTodo);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarSoat,"SOAT:",pEstadoActualVehMaq.estadoActualSoat);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarTarjetaConstanciaPropiedadEquipo,"Tarjeta/Constancia de propiedad del equipo:",pEstadoActualVehMaq.estadoActualTarjetaConstanciaPropiedadEquipo);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarCertificadoOperatividad,"Certificado de operatividad:",pEstadoActualVehMaq.estadoActualCertificadoOperatividad);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarProgMantenimientoPreventivo,"Programa de mantenimiento preventivo:",pEstadoActualVehMaq.estadoActualProgMantenimientoPreventivo);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarCertifMantenimientoPreventivo,"Certificado de mantenimiento preventivo:",pEstadoActualVehMaq.estadoActualCertifMantenimientoPreventivo);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarPermisoEspecialTransporteMercancia,"Permiso especial para el transporte de mercancía:",pEstadoActualVehMaq.estadoActualPermisoEspecialTransporteMercancia);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarPolizaTrec,"Póliza TREC:",pEstadoActualVehMaq.estadoActualPolizaTrec);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarCertificadoOpacidad,"Certificado de opacidad:",pEstadoActualVehMaq.estadoActualCertificadoOpacidad);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarManualEquipoFichaTecnica,"Manual del equipo/Ficha técnica:",pEstadoActualVehMaq.estadoActualManualEquipoFichaTecnica);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarCertificadoDghOsinergmin,"Certificado DGH - Osinergmin:",pEstadoActualVehMaq.estadoActualCertificadoDghOsinergmin);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarCertifCubicacionHermeticidad,"Certificado de cubicación y hermeticidad:",pEstadoActualVehMaq.estadoActualCertifCubicacionHermeticidad);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarTarjetaCirculacionMtc,"Tarjeta de circulación emitida por el MTC:",pEstadoActualVehMaq.estadoActualTarjetaCirculacionMtc);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarCertifGravamenVehicular,"Certificado de gravamen vehicular:",pEstadoActualVehMaq.estadoActualCertifGravamenVehicular);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarVerifGpsVehicular,"Verificación - GPS vehicular:",pEstadoActualVehMaq.estadoActualVerifGpsVehicular);
	agregarListaDocumentosNivelVehiculoMaquinaria(pVehiculoMaquinariaObj.habilitarExamNivelVehMaq18,"Certificado de hermeticidad de la bombona:",pEstadoActualVehMaq.estadoActualExamNivelVehMaq18);
	
    return listContenidoDocNivVehMaqAux;
}

function descargarArchivoPost(pUrl, dataParam){
    var formulario = document.createElement("form");

    formulario.method = "POST";formulario.action = pUrl;formulario.target = "_blank";formulario.enctype = "application/x-www-form-urlencoded";
	formulario.acceptCharset = "UTF-8";formulario.style.display = "none";

    Object.keys(dataParam).forEach(function(nombre){
        var campo = document.createElement("input");

        campo.type = "hidden";campo.name = nombre;
        campo.value = dataParam[nombre] == null ? "" : dataParam[nombre];

        formulario.appendChild(campo);
    });

    document.body.appendChild(formulario);

    try{
        formulario.submit();
    }finally{
        document.body.removeChild(formulario);
    }
}

function validacionSubirImagenFoto(parteFinalId,bitsAux,modalAux,functionCallback){
    var inputFile = document.getElementById("fileEvi"+parteFinalId);
    var file = inputFile.files[0];

    if(!file){
        return;
    }

    if(!/\.(jpe?g|png|gif|bmp)$/i.test(file.name)){
		inputFile.value = "";
		
        var mensajeUx = "<label>Solo se permiten imágenes en formato JPG, JPEG, PNG, GIF o BMP.</label>";

        if(modalAux != ""){
            $("#"+modalAux).modal("hide");
        }

        mensajesUx(mensajeUx,2,"","AvisoImagenFotocheck");

        $("#modalMensajeUxAvisoImagenFotocheck").one("hidden.bs.modal", function(){
            if(modalAux != ""){
                $("#"+modalAux).modal("show");
            }

            $("#inputEvi"+parteFinalId).val("VOLVER A SUBIR");$("#inputEvi"+parteFinalId).focus();
        });

        return;
    }
	
	if(typeof functionCallback === "function"){
        functionCallback(parteFinalId,bitsAux,modalAux);
	}
}
