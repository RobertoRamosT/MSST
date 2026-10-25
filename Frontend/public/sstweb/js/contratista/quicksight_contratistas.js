
function cargarQuicksightContratista() {
    // Mostrar mensaje de carga
    $('#divContainQuicksightContratista').html('<div class="loading">Cargando...</div>');

    var dataParam = {
        idEmpresa: getSession("gestopcompanyid"),
    };

    callAjaxPost(URL + '/quicksight/contratista', dataParam, function (data) {
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
            $('#divContainQuicksightContratista').empty().append($iframe);
        } else {
            console.log("No se pudieron cargar los datos de la huella de carbono.");
            // Actualizar el contenedor para mostrar un mensaje de error o quitar el mensaje de carga
            $('#divContainQuicksightContratista').html('<div class="error">Error al cargar los datos.</div>');
        }
    });
}
