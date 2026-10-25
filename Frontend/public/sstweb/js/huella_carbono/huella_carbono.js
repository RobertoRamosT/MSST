var listaPaisesHc,
    listaMesesHc,
    listaAniosHc,
    listaAlcancesHc,
    listaTipoMedicionHc,
    listaFuentesHc,
    listaUnidadesHc,
    listaPaisEmpresaHc,
    listaSedeHc,
    listaFactoresHc,
    listaResponsablesHc;
var listaFullHuellaCarbono;
var idHuellaCarbonoEdit = 0;
var banderaEdicion1 = false;
var banderaEdicion2 = false;
var banderaEdicion3 = false;
var banderaEdicion4 = false;

var listTabs = [
    {id: 1, nombre: "Plantilla"},
    // {id:2,nombre:"Extras"    },
];

$(function () {
    $("#btnNuevaHuellaCarbono").attr("onclick", "javascript:nuevaHuellaCarbono();");
    $("#btnAsociarPaisEmpresa").attr("onclick", "javascript:verAsociarPaisEmpresa();");
    $("#btnFactorHuellaCarbono").attr("onclick", "javascript:verFactoresHuellaCarbono();");
    $("#btnAccesoResponsable").attr("onclick", "javascript:verResponsablesHuellaCarbono();");
    $("#btnCancelarHuellaCarbono").attr("onclick", "javascript:cancelarHuellaCarbono();");
    $("#btnGuardarHuellaCarbono").attr("onclick", "javascript:guardarHuellaCarbono();");
    $("#btnEliminarHuellaCarbono").attr("onclick", "javascript:eliminarHuellaCarbono();");
    $("#divRequisitoAsociado").hide();
    $("#divObjetivoEspecifico").hide();
    $("#divMeta").hide();
    $("#divMetaAvance").hide();
    $("#divActividad").hide();

    insertMenuPrimeraVez(async function () {
        await cargarListasHc();
        cargarHuellasCarbono();
        completarBarraCarga();
        $("#tabHuellasCarbono").show();
    });
})


async function cargarListasHc() {

    try {
        var dataParam = {
            idEmpresa: getSession("gestopcompanyid"),
        };

        const data = await callAjaxPostAsPromise(URL + '/huella-carbono/listar-auxiliares', dataParam);

        if (data.CODE_RESPONSE == "05") {
            listaPaisesHc = data.paises;
            listaMesesHc = data.meses;
            listaAniosHc = data.anios;
            listaAlcancesHc = data.alcancesHuellaCarbono;
            listaTipoMedicionHc = data.tiposMedicionHuellaCarbono;
            listaFuentesHc = data.fuentesHuellaCarbono;
            listaUnidadesHc = data.unidadesHuellaCarbono;
            listaPaisEmpresaHc = data.mdfList;
            listaSedeHc = data.sedes;
            listaFactoresHc = data.factoresHuellaCarbono;
            listaResponsablesHc = data.responsablesHuellaCarbono;
        } else {
            listaPaisesHc = [];
            listaMesesHc = [];
            listaAniosHc = [];
            listaAlcancesHc = [];
            listaTipoMedicionHc = [];
            listaFuentesHc = [];
            listaUnidadesHc = [];
            listaPaisEmpresaHc = [];
            listaSedeHc = [];
            listaFactoresHc = [];
            listaResponsablesHc = [];
            console.log("Error al cargar listas auxiliares de huella de carbono.");
        }


    } catch (error) {
        // Maneja el error si la promesa es rechazada
        console.error(error);
    }

}

function cargarHuellasCarbono() {
    var valorResize = 200;
    resizeDivWrapper("wrapperHuellasCarbono", valorResize);

    $("#btnCancelarHuellaCarbono").hide();
    $("#btnNuevaHuellaCarbono").show();
    $("#btnEliminarHuellaCarbono").hide();
    $("#btnGuardarHuellaCarbono").hide();

    var dataParam = {
        idEmpresa: getSession("gestopcompanyid"),
    };

    //aplicamos estilo para fijar la cabera de la tabla
    // por la funcion goheadfixedY no esta funcionado correctamente
    fijarCabeceraTabla("tblHuellasCarbono");

    callAjaxPost(URL + '/huella-carbono/listar', dataParam,
        function (data) {
            if (data.CODE_RESPONSE === "05") {
                banderaEdicion1 = false;
                listaFullHuellaCarbono = data.huellasCarbono;
                // Limpiamos la tabla antes de rellenarla
                $("#tblHuellasCarbono tbody").empty();

                // Verificamos si la lista está vacía para manejar ese caso
                if (listaFullHuellaCarbono.length === 0) {
                    $("#tblHuellasCarbono tbody").append("<tr><td colspan='15'>No hay datos disponibles.</td></tr>");
                } else {
                    // Procesamos cada huella de carbono en la lista
                    listaFullHuellaCarbono.forEach(function (val) {
                        // const unidadHuellaCarbono = listaUnidadesHc.find(unidad => unidad.idUnidadHuellaCarbono === val.idUnidadHuellaCarbono).unidadHuellaCarbono;
                        const modificadoPor = val.modificadoPor ? val.modificadoPor : "";
                        const idEvidenciaHuellaCarbono = val.idEvidenciaHuellaCarbono;
                        let textoEvidencia = ""
                        if (idEvidenciaHuellaCarbono !== 0) {
                            textoEvidencia = `<a href="#" onclick="openInGoogleDocsViewer(event, '${val.urlArchivoEvidencia}','${val.nombreArchivoEvidencia}')">${val.nombreArchivoEvidencia}</a>`;
                        }

                        // Usamos template strings para mayor claridad y facilidad de lectura
                        $("#tblHuellasCarbono tbody").append(`
                    <tr id='trHuellaCarbono${val.idHuellaCarbono}' onclick='editarHuellaCarbono(${val.idHuellaCarbono})'>
                        <td id='tdcodigoHC${val.idHuellaCarbono}'>${val.codigoHuellaCarbono}</td>
                        <td id='tdanoHC${val.idHuellaCarbono}'>${val.anio}</td>
                        <td id='tdmesHC${val.idHuellaCarbono}'>${val.mes}</td>
                        <td id='tdpaisHC${val.idHuellaCarbono}'>${val.pais}</td>
                        <td id='tdpaisEmpresaHC${val.idHuellaCarbono}'>${val.matrizDespliegueDeFunciones}</td>
                         <td id='tdtipoMedicionHC${val.idHuellaCarbono}'>${val.tipoMedicionHuellaCarbono}</td>
                        <td id='tdalcanceHC${val.idHuellaCarbono}'>${val.alcanceHuellaCarbono}</td>
                        <td id='tdfuenteHC${val.idHuellaCarbono}'>${val.fuenteHuellaCarbono}</td>
                        <td id='tdunidadesHC${val.idHuellaCarbono}'>${val.unidadHuellaCarbono}</td>
                        <td id='tdconsumoHC${val.idHuellaCarbono}'>${val.consumoHuellaCarbono}</td>
                        <td id='tdevidenciaHC${val.idHuellaCarbono}'>${textoEvidencia}</td>
                        <td id='tdfechaRegistroHC${val.idHuellaCarbono}'>${val.fechaRegistro}</td>
                        <td id='tdregistradoPorHC${val.idHuellaCarbono}'>${val.registradoPor}</td>
                        <td id='tdmodificadoPorHC${val.idHuellaCarbono}'>${modificadoPor}</td>
                    </tr>
                `);
                    });
                }
                // Aplicamos formato a la tabla una vez que se ha rellenado
                formatoCeldaSombreableTabla(true, "tblHuellasCarbono");
            } else {
                console.log("No se pudieron cargar los datos de la huella de carbono.");
            }
            // Ajustamos el encabezado fijo de la tabla
            // goheadfixedY("#tblHuellasCarbono","#wrapperHuellasCarbono");
        });

}

function editarHuellaCarbono(idHuellaCarbono) {
    if (!banderaEdicion1) {
        formatoCeldaSombreableTabla(false, "tblHuellasCarbono");

        // Encuentra el elemento en listFullObjetivo usando idHuellaCarbono
        const huellaCarbonoE = listaFullHuellaCarbono.find(obj => obj.idHuellaCarbono === idHuellaCarbono);
        if (!huellaCarbonoE) {
            console.log("huellaCarbonoE no encontrado");
            return;
        }

        idHuellaCarbonoEdit = idHuellaCarbono;

        $("#trHuellaCarbono" + idHuellaCarbono).addClass("fila-edicion");

        $("#tdanoHC" + idHuellaCarbono).html("<select id='inputAnoHC' class='form-control'></select>");
        // Llenando el select de años
        var selectAno = $('#inputAnoHC');
        selectAno.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaAniosHc.forEach(function (anioObj) {
            selectAno.append($('<option>', {
                value: anioObj.idAnio,
                text: anioObj.anio
            }));
        });
        $("#inputAnoHC").val(huellaCarbonoE.idAnio);

        $("#tdmesHC" + idHuellaCarbono).html("<select id='inputMesHC' class='form-control'></select>");
        // Llenando el select de meses
        var selectMes = $('#inputMesHC');
        selectMes.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaMesesHc.forEach(function (mesObj) {
            selectMes.append($('<option>', {
                value: mesObj.idMes,
                text: mesObj.mes
            }));
        });
        $("#inputMesHC").val(huellaCarbonoE.idMes);

        $("#tdpaisHC" + idHuellaCarbono).html("<select id='inputPaisHC' class='form-control' disabled></select>");
        // Llenando el select de paises
        var selectPais = $('#inputPaisHC');
        selectPais.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaPaisesHc.forEach(function (paisObj) {
            selectPais.append($('<option>', {
                value: paisObj.idPais,
                text: paisObj.pais
            }));
        });
        $("#inputPaisHC").val(huellaCarbonoE.idPais);

        $("#tdpaisEmpresaHC" + idHuellaCarbono).html("<select id='inputPaisEmpresaHC' class='form-control'></select>");
        // Llenando el select de países empresa y añadiendo el manejador de evento change
        $('#inputPaisEmpresaHC').empty().change(function () {
            var idMatrizDespliegueDeFunciones = $(this).val();
            var paisEmpresaSeleccionado = listaPaisEmpresaHc.find(paisEmpresa => paisEmpresa.id == idMatrizDespliegueDeFunciones);

            if (paisEmpresaSeleccionado) {
                var idPaisCorrespondiente = paisEmpresaSeleccionado.idPais;
                // Actualizar y deshabilitar el select de países
                $('#inputPaisHC').val(idPaisCorrespondiente).prop('disabled', true);
            }
        });
        listaPaisEmpresaHc.forEach(function (paisEmpresaObj) {
            $('#inputPaisEmpresaHC').append($('<option>', {
                value: paisEmpresaObj.id,
                text: paisEmpresaObj.nombre
            }));
        });
        $("#inputPaisEmpresaHC").val(huellaCarbonoE.idMatrizDespliegueDeFunciones);


        $("#tdtipoMedicionHC" + idHuellaCarbono).html("<select id='inputTipoMedicionHC' class='form-control'></select>");
        // Llenando el select de tipos de medición
        var selectTipoMedicion = $('#inputTipoMedicionHC');
        selectTipoMedicion.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaTipoMedicionHc.forEach(function (tipoMedicionObj) {
            selectTipoMedicion.append($('<option>', {
                value: tipoMedicionObj.idTipoMedicionHuellaCarbono,
                text: tipoMedicionObj.tipoMedicionHuellaCarbono
            }));
        });
        $("#inputTipoMedicionHC").val(huellaCarbonoE.idTipoMedicionHuellaCarbono);

        $("#tdalcanceHC" + idHuellaCarbono).html("<select id='inputAlcanceHC' class='form-control'></select>");
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
        $("#inputAlcanceHC").val(huellaCarbonoE.idAlcanceHuellaCarbono);

        $("#tdfuenteHC" + idHuellaCarbono).html("<select id='inputFuenteHC' class='form-control'></select>");
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
        // Agregar opciones al select de fuentes
        listaFuentesHc.forEach(function (fuenteObj) {
            selectFuente.append($('<option>', {
                value: fuenteObj.idFuenteHuellaCarbono,
                text: fuenteObj.fuenteHuellaCarbono
            }));
        });
        $("#inputFuenteHC").val(huellaCarbonoE.idFuenteHuellaCarbono);

        $("#tdunidadesHC" + idHuellaCarbono).html("<select id='inputUnidadesHC' class='form-control' disabled></select>");
        // Llenando el select de unidades
        var selectUnidades = $('#inputUnidadesHC');
        selectUnidades.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaUnidadesHc.forEach(function (unidadObj) {
            selectUnidades.append($('<option>', {
                value: unidadObj.idUnidadHuellaCarbono,
                text: unidadObj.unidadHuellaCarbono
            }));
        });
        $("#inputUnidadesHC").val(huellaCarbonoE.idUnidadHuellaCarbono);

        $("#tdconsumoHC" + idHuellaCarbono).html("<input type='text' id='inputConsumoHC' class='form-control'>");
        $("#inputConsumoHC").val(huellaCarbonoE.consumoHuellaCarbono);

        // Llamar a la función con el ID del input
        limitInputDecimal('inputConsumoHC');

        let textoEvidencia = "<input type='file' id='inputEvidenciaHC' class='form-control'>"
        if (huellaCarbonoE.idEvidenciaHuellaCarbono !== 0) {
            textoEvidencia = `<a href="#" onclick="openInGoogleDocsViewer(event, '${huellaCarbonoE.urlArchivoEvidencia}','${huellaCarbonoE.nombreArchivoEvidencia}')">${huellaCarbonoE.nombreArchivoEvidencia}</a>`;
        }

        $("#tdevidenciaHC" + idHuellaCarbono).html(textoEvidencia);
        // $("#inputEvidenciaHC").val(huellaCarbonoE.idEvidenciaHuellaCarbono);

        $("#btnGuardarHuellaCarbono").data("idHuellaCarbono", idHuellaCarbono);

        banderaEdicion1 = true;
        $("#btnCancelarHuellaCarbono").show();
        $("#btnNuevaHuellaCarbono").hide();
        $("#btnEliminarHuellaCarbono").show();
        $("#btnGuardarHuellaCarbono").show();
    }
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

function nuevaHuellaCarbono() {
    if (!banderaEdicion1) {
        formatoCeldaSombreableTabla(false, "tblPlantilla");

        $("#tblHuellasCarbono tbody").prepend(
            "<tr>"
            + "<td></td>"
            + "<td><select id='inputAnoHC' class='form-control'>"
            + "</select></td>"
            + "<td><select id='inputMesHC' class='form-control'>"
            + "</select></td>"
            + "<td><select id='inputPaisHC' class='form-control' disabled>"
            + "</select></td>"
            + "<td><select id='inputPaisEmpresaHC' class='form-control'>"
            + "</select></td>"
            + "<td><select id='inputTipoMedicionHC' class='form-control'>"
            + "</select></td>"
            + "<td><select id='inputAlcanceHC' class='form-control'>"
            + "</select></td>"
            + "<td><select id='inputFuenteHC' class='form-control'>"
            + "</select></td>"
            + "<td><select id='inputUnidadesHC' class='form-control' disabled>"
            + "</select></td>"
            + "<td><input type='text' id='inputConsumoHC' class='form-control'></td>"
            + "<td><input type='file' id='inputEvidenciaHC' class='form-control'></td>"
            + "<td></td>"
            + "<td></td>"
            + "<td></td>"
            //Agregar necesarios
            + "</tr>");

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

        // Llenando el select de paises
        var selectPais = $('#inputPaisHC');
        selectPais.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaPaisesHc.forEach(function (paisObj) {
            selectPais.append($('<option>', {
                value: paisObj.idPais,
                text: paisObj.pais
            }));
        });

        // Llenando el select de países empresa y añadiendo el manejador de evento change
        $('#inputPaisEmpresaHC').empty().change(function () {
            var idPaisEmpresaSeleccionado = $(this).val();
            var paisEmpresaSeleccionado = listaPaisEmpresaHc.find(paisEmpresa => paisEmpresa.id == idPaisEmpresaSeleccionado);

            if (paisEmpresaSeleccionado) {
                var idPaisCorrespondiente = paisEmpresaSeleccionado.idPais;
                // Actualizar y deshabilitar el select de países
                $('#inputPaisHC').val(idPaisCorrespondiente).prop('disabled', true);
            }
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

        // Agregar opciones al select de fuentes
        listaFuentesHc.forEach(function (fuenteObj) {
            selectFuente.append($('<option>', {
                value: fuenteObj.idFuenteHuellaCarbono,
                text: fuenteObj.fuenteHuellaCarbono
            }));
        });

        selectAlcance.change(); // Forzar la actualización de fuentes basado en el alcance seleccionado

        $("#btnCancelarHuellaCarbono").show();
        $("#btnNuevaHuellaCarbono").hide();
        $("#btnEliminarHuellaCarbono").hide();
        $("#btnGuardarHuellaCarbono").show();
        banderaEdicion1 = true;
    } else {
        alert("Guarde primero.");
    }
}

function cancelarHuellaCarbono() {
    $("#btnGuardarHuellaCarbono").removeData("idHuellaCarbono");
    cargarHuellasCarbono();
}

function eliminarHuellaCarbono() {
    // Cambiar el título
    $('#modalLabelHC').text("Confirmación de eliminación");

    // Cambiar el mensaje del cuerpo
    $('#confirmModalHC .modal-body').text("¿Está seguro de eliminar la Huella de carbono?");

    // Mostrar el modal
    $('#confirmModalHC').modal('show');

    // Handle confirmation
    $('#confirmHCBtn').click(function () {
        var dataParam = {
            idHuellaCarbono: idHuellaCarbonoEdit,
        };

        callAjaxPost(URL + '/huella-carbono/delete', dataParam,
            function (data) {
                switch (data.CODE_RESPONSE) {
                    case "05":
                        cargarHuellasCarbono();
                        mostrarMensaje("Se eliminó correctamente.", 1);
                        break;

                    default:
                        alert("Ocurrió un error al eliminar el objetivo.");
                }
            });
        $('#confirmModalHC').modal('hide');
    });

}

function procesarGuardarHuellaCarbono(data) {
    switch (data.CODE_RESPONSE) {
        case "05":
            const mensaje = "<label>Se registro de forma correcta.</label>";
            cargarHuellasCarbono();
            mensajesUx(mensaje, 1, "", "gHC");
            break;
        default:
            alert("Ocurrió un error al guardar la huella de carbono.");
    }
}

function guardarHuellaCarbono() {
    const idHuellaCarbono = $("#btnGuardarHuellaCarbono").data("idHuellaCarbono");
    const archivoInput = document.getElementById('inputEvidenciaHC');

    if (archivoInput && archivoInput.files.length > 0) {
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
            procederGrabarHuellaCarbono(idHuellaCarbono, nombreArchivo, tipoArchivo, contenidoEnBase64); // Llama aquí después de la conversión
        };

        lector.readAsBinaryString(archivo); // Lee el archivo como una cadena binaria
    } else {
        procederGrabarHuellaCarbono(idHuellaCarbono, '', '', ''); // Llama aquí si no hay archivo
    }

}

function procederGrabarHuellaCarbono(idHuellaCarbono, nombreArchivo, tipoArchivo, contenidoEnBase64) {
    const consumoHC = $('#inputConsumoHC').val();
    const consumoHCNum = Number(consumoHC);

    if (consumoHCNum === 0 || consumoHC.trim() === "") {
        const mensaje = "<label>Valor de consumo no valido.</label>";
        mensajesUx(mensaje, 2, "", "gHC");
        return; // Detiene la ejecución de la función
    }

    if (idHuellaCarbono) {
        var oldHuellaCarbono = {
            idHuellaCarbono: idHuellaCarbono,
            idAnio: $('#inputAnoHC').val(),
            idMes: $('#inputMesHC').val(),
            idPais: $('#inputPaisHC').val(),
            idMatrizDespliegueDeFunciones: $('#inputPaisEmpresaHC').val(),
            idTipoMedicionHuellaCarbono: $('#inputTipoMedicionHC').val(),
            idAlcanceHuellaCarbono: $('#inputAlcanceHC').val(),
            idFuenteHuellaCarbono: $('#inputFuenteHC').val(),
            idUnidadHuellaCarbono: $('#inputUnidadesHC').val(), // Asegúrate de corregir el id a 'inputUnidadesHC' si fue un error tipográfico
            consumoHuellaCarbono: $('#inputConsumoHC').val(),
            nombreArchivoEvidencia: nombreArchivo,
            tipoArchivoEvidencia: tipoArchivo,
            dataArchivoEvidencia: contenidoEnBase64,
            idUsuarioModificador: getSession("gestopusuarioid"),
        };
        callAjaxPost(URL + '/huella-carbono/update', oldHuellaCarbono, procesarGuardarHuellaCarbono);
    } else {
        var nuevaHuellaCarbono = {
            idAnio: $('#inputAnoHC').val(),
            idMes: $('#inputMesHC').val(),
            idPais: $('#inputPaisHC').val(),
            idMatrizDespliegueDeFunciones: $('#inputPaisEmpresaHC').val(),
            idTipoMedicionHuellaCarbono: $('#inputTipoMedicionHC').val(),
            idAlcanceHuellaCarbono: $('#inputAlcanceHC').val(),
            idFuenteHuellaCarbono: $('#inputFuenteHC').val(),
            idUnidadHuellaCarbono: $('#inputUnidadesHC').val(),
            consumoHuellaCarbono: $('#inputConsumoHC').val(),
            nombreArchivoEvidencia: nombreArchivo,
            tipoArchivoEvidencia: tipoArchivo,
            dataArchivoEvidencia: contenidoEnBase64,
            idUsuarioRegistrador: getSession("gestopusuarioid"),
        };
        callAjaxPost(URL + '/huella-carbono/save', nuevaHuellaCarbono, procesarGuardarHuellaCarbono);
    }

    // Limpiar el formulario y restablecer el modo de edición/creación
    $("#btnGuardarHuellaCarbono").removeData("idHuellaCarbono");
}

// inicio pais empresa
function verAsociarPaisEmpresa() {
    $("#mdPaisEmpresaHC").modal("show");
    $("#mdLabelPaisEmpresaHC").html("Asociar Países con Unidades");

    $("#btnCancelarAsociarPaisEmpresa").attr("onclick", "javascript:cancelarAsociarPaisEmpresa();");
    $("#btnGuardarAsociarPaisEmpresa").attr("onclick", "javascript:guardarAsociarPaisEmpresa();");
    cargarAsociarPaisEmpresa();

}

function cargarAsociarPaisEmpresa() {
    var valorResize = 500;
    resizeDivWrapper("wrapPaisEmpresaHC", valorResize);
    $("#btnCancelarAsociarPaisEmpresa").hide();
    $("#btnGuardarAsociarPaisEmpresa").hide();

    banderaEdicion2 = false;

    $("#tblPaisEmpresaHC tbody").empty();

    fijarCabeceraTabla("tblPaisEmpresaHC");

    // Verificamos si la lista está vacía para manejar ese caso
    if (listaPaisEmpresaHc.length === 0) {
        $("#tblPaisEmpresaHC tbody").append("<tr><td colspan='15'>No hay datos disponibles.</td></tr>");
    } else {
        listaPaisEmpresaHc.forEach(function (val) {

            $("#tblPaisEmpresaHC tbody").append(`
                    <tr id='trPaisEmpresaHC${val.id}' onclick='editarAsociarPaisEmpresa(${val.id})'>
                        <td id='tdpaisPE${val.id}'>${val.pais || ''}</td>
                        <td id='tdnombrePE${val.id}'>${val.nombre}</td>
                    </tr>
            `);

        });
    }
    formatoCeldaSombreableTabla(true, "tblPaisEmpresaHC");
}

function editarAsociarPaisEmpresa(idPaisEmpresa) {
    if (!banderaEdicion2) {
        formatoCeldaSombreableTabla(false, "tblPaisEmpresaHC");

        // Encuentra el elemento en lista pais empresa
        const paisEmpresaEd = listaPaisEmpresaHc.find(obj => obj.id === idPaisEmpresa);
        if (!paisEmpresaEd) {
            console.log("pais empresa no encontrado");
            return;
        }

        $("#trPaisEmpresaHC" + idPaisEmpresa).addClass("fila-edicion");

        $("#tdpaisPE" + idPaisEmpresa).html("<select id='inputPaisPE' class='form-control'></select>");
        // Llenando el select de paises
        var selectPais = $('#inputPaisPE');
        selectPais.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaPaisesHc.forEach(function (paisObj) {
            selectPais.append($('<option>', {
                value: paisObj.idPais,
                text: paisObj.pais
            }));
        });
        $("#inputPaisPE").val(paisEmpresaEd.idPais);

        $("#btnGuardarAsociarPaisEmpresa").data("idPaisEmpresa", idPaisEmpresa);

        banderaEdicion2 = true;
        $("#btnCancelarAsociarPaisEmpresa").show();
        $("#btnGuardarAsociarPaisEmpresa").show();
    }

}

function cancelarAsociarPaisEmpresa() {
    $("#btnGuardarAsociarPaisEmpresa").removeData("idPaisEmpresa");
    cargarAsociarPaisEmpresa();
}

function guardarAsociarPaisEmpresa() {
    const idPaisEmpresa = $("#btnGuardarAsociarPaisEmpresa").data("idPaisEmpresa");

    if (idPaisEmpresa) {
        var oldMDF = {
            id: idPaisEmpresa,
            idPais: $('#inputPaisPE').val(),
        };
        console.log("oldMDF", oldMDF)
        callAjaxPost(URL + '/mdf/pais/update', oldMDF, procesarGuardarAsociarPaisEmpresa);
    }

    // Limpiar el formulario y restablecer el modo de edición/creación
    $("#btnGuardarAsociarPaisEmpresa").removeData("idPaisEmpresa");
}

async function procesarGuardarAsociarPaisEmpresa(data) {
    switch (data.CODE_RESPONSE) {
        case "05":
            mostrarMensaje("Se actualizo el pais asociado.", 1);
            await cargarListasHc();
            cargarAsociarPaisEmpresa();
            cargarHuellasCarbono();
            break;
        default:
            alert("Ocurrió un error al actualizar cambio.");
    }
}

// fin pais empresa

// inicio factores huella carbono
function verFactoresHuellaCarbono() {
    $("#mdFactorHC").modal("show");
    $("#mdLabelFactorHC").html("Factores de Huella de Carbono");

    $("#btnCancelarFactorHC").attr("onclick", "javascript:cancelarFactorHuellaCarbono();");
    $("#btnNuevoFactorHC").attr("onclick", "javascript:nuevoFactorHuellaCarbono();");
    $("#btnGuardarFactorHC").attr("onclick", "javascript:guardarFactorHuellaCarbono();");
    $("#btnEliminarFactorHC").attr("onclick", "javascript:guardarAsociarPaisEmpresa();");
    cargarFactoresHuellaCarbono();

}

function cargarFactoresHuellaCarbono() {
    var valorResize = 500;
    resizeDivWrapper("wrapFactorHC", valorResize);
    $("#btnNuevoFactorHC").show();
    $("#btnCancelarFactorHC").hide();
    $("#btnGuardarFactorHC").hide();
    $("#btnEliminarFactorHC").hide();

    banderaEdicion3 = false;

    $("#tblFactorHC tbody").empty();

    fijarCabeceraTabla("tblFactorHC");

    // Verificamos si la lista está vacía para manejar ese caso
    if (listaFactoresHc.length === 0) {
        $("#tblFactorHC tbody").append("<tr><td colspan='15'>No hay datos disponibles.</td></tr>");
    } else {
        listaFactoresHc.forEach(function (val) {

            $("#tblFactorHC tbody").append(`
                    <tr id='trFactorHC${val.idFactorHuellaCarbono}' onclick='editarFactorHuellaCarbono(${val.idFactorHuellaCarbono})'>
                        <td id='tdanioF${val.idFactorHuellaCarbono}'>${val.anio}</td>
                        <td id='tdpaisF${val.idFactorHuellaCarbono}'>${val.pais}</td>
                        <td id='tdfuenteF${val.idFactorHuellaCarbono}'>${val.fuenteHuellaCarbono}</td>
                        <td id='tdunidadF${val.idFactorHuellaCarbono}'>${val.unidadFactor}</td>
                        <td id='tdvalorF${val.idFactorHuellaCarbono}'>${val.valorFactor}</td>
                    </tr>
            `);

        });
    }
    formatoCeldaSombreableTabla(true, "tblFactorHC");
}

function nuevoFactorHuellaCarbono() {
    if (!banderaEdicion3) {
        formatoCeldaSombreableTabla(false, "tblFactorHC");

        $("#tblFactorHC tbody").prepend(
            "<tr>"
            + "<td><select id='inputAnoF' class='form-control'>"
            + "</select></td>"
            + "<td><select id='inputPaisF' class='form-control'>"
            + "</select></td>"
            + "<td><select id='inputFuenteF' class='form-control'>"
            + "</select></td>"
            + "<td><input type='text' id='inputUnidadF' class='form-control'></td>"
            + "<td><input type='text' id='inputValorF' class='form-control'></td>"
            + "</tr>");

        // Llamar a la función con el ID del input
        limitInputDecimal('inputValorF');

        // Llenando el select de años
        var selectAno = $('#inputAnoF');
        selectAno.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaAniosHc.forEach(function (anioObj) {
            selectAno.append($('<option>', {
                value: anioObj.idAnio,
                text: anioObj.anio
            }));
        });

        // Llenando el select de paises
        var selectPais = $('#inputPaisF');
        selectPais.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaPaisesHc.forEach(function (paisObj) {
            selectPais.append($('<option>', {
                value: paisObj.idPais,
                text: paisObj.pais
            }));
        });

        // Llenando el select de unidades
        var selectFuentes = $('#inputFuenteF');
        selectFuentes.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaFuentesHc.forEach(function (fuenteObj) {
            selectFuentes.append($('<option>', {
                value: fuenteObj.idFuenteHuellaCarbono,
                text: fuenteObj.fuenteHuellaCarbono
            }));
        });

        $("#btnCancelarFactorHC").show();
        $("#btnNuevoFactorHC").hide();
        $("#btnEliminarFactorHC").hide();
        $("#btnGuardarFactorHC").show();
        banderaEdicion3 = true;
    } else {
        alert("Guarde primero.");
    }
}

function cancelarFactorHuellaCarbono() {
    $("#btnGuardarFactorHC").removeData("idFactorHuellaCarbono");
    cargarFactoresHuellaCarbono();
}

function guardarFactorHuellaCarbono() {
    const idFactorHuellaCarbono = $("#btnGuardarFactorHC").data("idFactorHuellaCarbono");

    const unidadFactor = $('#inputUnidadF').val();
    if (unidadFactor.trim() === "") {
        const mensaje = "<label>Unidad de factor no valido.</label>";
        mensajesUx(mensaje, 2, "", "gHC");
        return; // Detiene la ejecución de la función
    }

    const valorFactor = $('#inputValorF').val();
    const valorFactorNum = Number(valorFactor);
    if (valorFactorNum === 0 || valorFactor.trim() === "") {
        const mensaje = "<label>Valor de factor no valido.</label>";
        mensajesUx(mensaje, 2, "", "gHC");
        return; // Detiene la ejecución de la función
    }

    if (idFactorHuellaCarbono) {
        var oldFactorHuellaCarbono = {
            idFactorHuellaCarbono: idFactorHuellaCarbono,
            idEmpresa: getSession("gestopcompanyid"),
            idAnio: $('#inputAnoF').val(),
            idPais: $('#inputPaisF').val(),
            idFuenteHuellaCarbono: $('#inputFuenteF').val(),
            unidadFactor: $('#inputUnidadF').val(),
            valorFactor: $('#inputValorF').val(),
        };
        callAjaxPost(URL + '/huella-carbono/factor/update', oldFactorHuellaCarbono, procesarGuardarFactorHuellaCarbono);
    } else {
        var nuevoFactorHuellaCarbono = {
            idEmpresa: getSession("gestopcompanyid"),
            idAnio: $('#inputAnoF').val(),
            idPais: $('#inputPaisF').val(),
            idFuenteHuellaCarbono: $('#inputFuenteF').val(),
            unidadFactor: $('#inputUnidadF').val(),
            valorFactor: $('#inputValorF').val(),
        };
        callAjaxPost(URL + '/huella-carbono/factor/save', nuevoFactorHuellaCarbono, procesarGuardarFactorHuellaCarbono);
    }

    // Limpiar el formulario y restablecer el modo de edición/creación

}

async function procesarGuardarFactorHuellaCarbono(data) {
    switch (data.CODE_RESPONSE) {
        case "05":
            $("#btnGuardarFactorHC").removeData("idFactorHuellaCarbono");
            mostrarMensaje("Se registro el factor de huella de carbono.", 1);
            await cargarListasHc();
            cargarFactoresHuellaCarbono();
            break;
        case "18":
            mostrarMensaje("El registro ya existe, no se hizo cambios.", 3);
            // await cargarListasHc();
            // cargarFactoresHuellaCarbono();
            break;
        default:
            alert("Ocurrió un error al registrar.");
    }
}

function editarFactorHuellaCarbono(idFactorHuellaCarbono) {
    if (!banderaEdicion3) {
        formatoCeldaSombreableTabla(false, "tblFactorHC");

        // Encuentra el elemento en listFullObjetivo usando idHuellaCarbono
        const factorHuellaCarbono = listaFactoresHc.find(obj => obj.idFactorHuellaCarbono === idFactorHuellaCarbono);
        if (!factorHuellaCarbono) {
            console.log("factorHuellaCarbono no encontrado");
            return;
        }

        $("#trFactorHC" + idFactorHuellaCarbono).addClass("fila-edicion");

        $("#tdanioF" + idFactorHuellaCarbono).html("<select id='inputAnoF' class='form-control'></select>");
        // Llenando el select de años
        var selectAno = $('#inputAnoF');
        selectAno.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaAniosHc.forEach(function (anioObj) {
            selectAno.append($('<option>', {
                value: anioObj.idAnio,
                text: anioObj.anio
            }));
        });
        $("#inputAnoF").val(factorHuellaCarbono.idAnio);

        $("#tdpaisF" + idFactorHuellaCarbono).html("<select id='inputPaisF' class='form-control'></select>");
        // Llenando el select de paises
        var selectPais = $('#inputPaisF');
        selectPais.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaPaisesHc.forEach(function (paisObj) {
            selectPais.append($('<option>', {
                value: paisObj.idPais,
                text: paisObj.pais
            }));
        });
        $("#inputPaisF").val(factorHuellaCarbono.idPais);


        $("#tdfuenteF" + idFactorHuellaCarbono).html("<select id='inputFuenteF' class='form-control'></select>");
        // Llenando el select de fuente
        var selectFuente = $('#inputFuenteF');
        selectFuente.empty(); // Limpiar el select antes de agregar nuevas opciones
        listaFuentesHc.forEach(function (fuenteObj) {
            selectFuente.append($('<option>', {
                value: fuenteObj.idFuenteHuellaCarbono,
                text: fuenteObj.fuenteHuellaCarbono
            }));
        });
        $("#inputFuenteF").val(factorHuellaCarbono.idFuenteHuellaCarbono);

        $("#tdunidadF" + idFactorHuellaCarbono).html("<input type='text' id='inputUnidadF' class='form-control'>");
        $("#inputUnidadF").val(factorHuellaCarbono.unidadFactor);

        $("#tdvalorF" + idFactorHuellaCarbono).html("<input type='text' id='inputValorF' class='form-control'>");
        $("#inputValorF").val(factorHuellaCarbono.valorFactor);

        // Llamar a la función con el ID del input
        limitInputDecimal('inputValorF');

        $("#btnGuardarFactorHC").data("idFactorHuellaCarbono", idFactorHuellaCarbono);

        banderaEdicion3 = true;
        $("#btnCancelarFactorHC").show();
        $("#btnNuevoFactorHC").hide();
        $("#btnEliminarFactorHC").show();
        $("#btnGuardarFactorHC").show();
    }
}

// fin factores huella carbono

// inicio responsables huella carbono
function verResponsablesHuellaCarbono() {
    $("#mdResponsableHC").modal("show");
    $("#mdLabelResponsableHC").html("Responsables de Huella de Carbono");

    $("#btnCancelarResponsableHC").attr("onclick", "javascript:cancelarResponsableHuellaCarbono();");
    $("#btnGuardarResponsableHC").attr("onclick", "javascript:guardarResponsableHuellaCarbono();");
    cargarResponsablesHuellaCarbono();
}

function cargarResponsablesHuellaCarbono() {
    var valorResize = 500;
    resizeDivWrapper("wrapResponsableHC", valorResize);
    $("#btnCancelarResponsableHC").hide();
    $("#btnGuardarResponsableHC").hide();

    banderaEdicion4 = false;

    $("#tblResponsableHC tbody").empty();

    fijarCabeceraTabla("tblResponsableHC");

    // Verificamos si la lista está vacía para manejar ese caso
    if (listaResponsablesHc.length === 0) {
        $("#tblResponsableHC tbody").append("<tr><td colspan='15'>No hay datos disponibles.</td></tr>");
    } else {
        listaResponsablesHc.forEach(function (val) {

            $("#tblResponsableHC tbody").append(`
                    <tr id='trResponsableHC${val.idTrabajador}' onclick='editarResponsableHuellaCarbono(${val.idTrabajador})'>
                        <td id='tdnombreR${val.idTrabajador}'>${val.nombreTrabajador}</td>
                        <td id='tdpaisR${val.idTrabajador}'>${val.pais}</td>
                        <td id='tdunidadR${val.idTrabajador}'>${val.nombreMdf}</td>
                        <td id='tdaccesoR${val.idTrabajador}'>${val.accesoHuellaCarbono === 0 ? 'No' : 'Si'}</td>
                    </tr>
            `);

        });
    }
    formatoCeldaSombreableTabla(true, "tblResponsableHC");
}

function editarResponsableHuellaCarbono(idTrabajador) {
    if (!banderaEdicion4) {
        formatoCeldaSombreableTabla(false, "tblResponsableHC");

        // Encuentra el elemento en lista pais empresa
        const responsableEd = listaResponsablesHc.find(obj => obj.idTrabajador === idTrabajador);
        if (!responsableEd) {
            console.log("pais empresa no encontrado");
            return;
        }

        $("#trResponsableHC" + idTrabajador).addClass("fila-edicion");

        $("#tdaccesoR" + idTrabajador).html("<select id='inputAccesoR' class='form-control'></select>");
        // Llenando el select de paises
        var selectAccesoResponsable = $('#inputAccesoR');
        selectAccesoResponsable.empty(); // Limpiar el select antes de agregar nuevas opciones
        selectAccesoResponsable.append($('<option>', {value: 0, text: 'No'}));
        selectAccesoResponsable.append($('<option>', {value: 1, text: 'Sí'}));
        $("#inputAccesoR").val(responsableEd.accesoHuellaCarbono);

        $("#btnGuardarResponsableHC").data("idTrabajador", idTrabajador);

        banderaEdicion4 = true;
        $("#btnCancelarResponsableHC").show();
        $("#btnGuardarResponsableHC").show();
    }

}

function cancelarResponsableHuellaCarbono() {
    $("#btnGuardarResponsableHC").removeData("idTrabajador");
    cargarResponsablesHuellaCarbono();
}

function guardarResponsableHuellaCarbono() {
    const idTrabajador = $("#btnGuardarResponsableHC").data("idTrabajador");

    if (idTrabajador) {
        var oldResponsable = {
            idTrabajador: idTrabajador,
            accesoHuellaCarbono: $('#inputAccesoR').val(),
        };
        console.log("oldResponsable", oldResponsable)
        callAjaxPost(URL + '/huella-carbono/responsable/acceso-update', oldResponsable, procesarGuardarResponsableHuellaCarbono);
    }

    // Limpiar el formulario y restablecer el modo de edición/creación
    $("#btnGuardarResponsableHC").removeData("idTrabajador");
}

async function procesarGuardarResponsableHuellaCarbono(data) {
    switch (data.CODE_RESPONSE) {
        case "05":
            mostrarMensaje("Se actualizo el responsable.", 1);
            await cargarListasHc();
            cargarResponsablesHuellaCarbono();
            break;
        default:
            alert("Ocurrió un error al actualizar cambio.");
    }
}

// fin responsables huella carbono

// inicio analisis
function cargarQuicksightHuellaCarbono() {
    // Mostrar mensaje de carga
    $('#divContainQuicksightHC').html('<div class="loading">Cargando...</div>');

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
            $('#divContainQuicksightHC').empty().append($iframe);
        } else {
            console.log("No se pudieron cargar los datos de la huella de carbono.");
            // Actualizar el contenedor para mostrar un mensaje de error o quitar el mensaje de carga
            $('#divContainQuicksightHC').html('<div class="error">Error al cargar los datos.</div>');
        }
    });
}

// fin analisis
