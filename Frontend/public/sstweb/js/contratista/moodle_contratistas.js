function cargarMoodleContratista(targetCourseId) {

    function getSessionSafe(key) {
        var value = getSession(key);

        if (value === undefined || value === null || value === '' ||
            value === 'undefined' || value === 'null') {
            return null;
        }

        return value;
    }

    var empresaId = getSessionSafe("gestopcompanyid");
    var trabajadorId = getSessionSafe("trabajadorGosstId");
    var contratistaId = getSessionSafe("contratistaGosstId");

    var dataParam = {
        empresaId: empresaId,
        targetCourseId: targetCourseId || 0
    };

    // Si existe trabajador, lo enviamos
    if (trabajadorId !== null) {
        dataParam.trabajadorId = trabajadorId;
    }

    // Si existe contratista, lo enviamos
    if (contratistaId !== null) {
        dataParam.contratistaId = contratistaId;
    }


    $('#divContainMoodleContratista')
        .html('<div class="loading">Cargando capacitaciones...</div>');

    callAjaxPost(URL + '/moodle/contratista/embed', dataParam,
        function (data) {

            switch (data.CODE_RESPONSE) {
                case "05":
                    var urlDelIframe = data.embedUrl;

                    var $iframe = $('<iframe>', {
                        src: urlDelIframe,
                        width: '100%',
                        height: '800px',
                        frameborder: '0',
                        allowfullscreen: true,
                        css: {
                            border: 'none'
                        }
                    }).on('load', function () {
                        $('.loading').remove();
                    });

                    $('#divContainMoodleContratista')
                        .empty()
                        .append($iframe);
                    break;

                default:
                    $('.loading').remove();
                    alert("Ocurrió un error al cargar las capacitaciones. Inténtalo nuevamente.");
            }
        }
    );
}

function cargarMoodleContratistaBack() {
    // Mostrar mensaje de carga
    $('#divContainMoodleContratista').html('<div class="loading">Cargando capacitaciones...</div>');

    var dataParam = {
        idEmpresa: getSession("gestopcompanyid"),
        // opcional: si tienes id del trabajador/usuario logueado en GoSST
        // idTrabajador: getSession("trabajadorId"),
        // opcional: courseId interno GoSST
        // courseKey: "SST-POC"
    };

    callAjaxPost(URL + '/moodle/contratista/embed', dataParam, function (data) {
        if (data.CODE_RESPONSE === "05") {
            var urlDelIframe = data.embedUrl; // e.g. https://academia.gosst.io/my/ o course/view.php?id=XX

            var $iframe = $('<iframe>', {
                src: urlDelIframe,
                width: '100%',
                height: '800px',
                frameborder: '0',
                allowfullscreen: true,
                // opcional: para permitir popups / descargas si el SCORM abre cosas
                // sandbox: 'allow-same-origin allow-scripts allow-forms allow-popups allow-downloads',
                css: { border: 'none' }
            }).on('load', function () {
                $('.loading').remove();
            });

            $('#divContainMoodleContratista').empty().append($iframe);
        } else {
            console.log("No se pudo cargar Moodle.");
            $('#divContainMoodleContratista').html('<div class="error">Error al cargar capacitaciones.</div>');
        }
    });
}
