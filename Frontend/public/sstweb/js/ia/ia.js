/**
 * Módulo IA (/ia) — capacidad v1: configuración de evaluación de documentos.
 * Partida 35. Tabla de configuraciones por tipo de documento + modal agregar/editar.
 * El supervisor define, por empresa y tipo: perfil de la IA, prompt y procedimiento.
 */
var listFullConfigIa = [];
var listTabs = [ { id: 0, nombre: "Dashboard de uso" }, { id: 1, nombre: "Evaluación de documentos" } ];

// El modelo de IA lo define el equipo de GOSST (backend, application.properties) y NO se muestra al cliente.

$(function () {
	var selTab = crearSelectOneMenuOblig("selTabIa", "verAcordeTabIa()", listTabs, "0", "id", "nombre");
	$("#divListaTabs").html("Sección: " + selTab);
	$("#btnAgregarConfigIa").attr("onclick", "javascript:abrirModalConfigIa(null);");
	$("#btnGuardarConfigIa").attr("onclick", "javascript:guardarConfigIa();");
	insertMenuPrimeraVez(function () { verAcordeTabIa(); });
});

function verAcordeTabIa() {
	var tabId = $("#selTabIa").val();
	var tabNombre = "";
	$(".tab-content .tab-pane").hide();
	switch (parseInt(tabId)) {
	case 0:
		tabNombre = "tabDashboardIa";
		cargarDashboardIa();
		break;
	case 1:
		tabNombre = "tabEvaluacionIa";
		cargarConfiguracionesIa();
		break;
	}
	completarBarraCarga();
	$("#" + tabNombre).show();
}

/** Carga la tabla con todas las configuraciones de la empresa. */
function cargarConfiguracionesIa() {
	var dataParam = { empresaId: parseInt(getSession("gestopcompanyid")) };
	callAjaxPost(URL + '/ia/evaluacion/config/list', dataParam, function (data) {
		if (data.CODE_RESPONSE == "05") {
			listFullConfigIa = data.list || [];
			$("#tblConfigIa tbody tr").remove();
			listFullConfigIa.forEach(function (val, index) {
				var tipo = val.tipoNombre || ("Tipo " + val.tipoExamenContratistaId);
				var proc = val.procedimientoUrl
					? "<a href='" + urlArchivo(antiCacheUrlIa(val.procedimientoUrl)) + "' target='_blank'>" + (val.procedimientoNombre || "ver") + "</a>"
					: "<span style='color:#999;'>—</span>";
				var activo = (val.activo == 1) ? "Sí" : "No";
				$("#tblConfigIa tbody").append(
					"<tr>" +
						"<td>" + tipo + "</td>" +
						"<td>" + proc + "</td>" +
						"<td>" + activo + "</td>" +
						"<td>" + (val.fechaRegistro || "—") + "</td>" +
						"<td>" +
							"<button class='btn btn-primary btn-xs' title='Editar' onclick='editarConfigIa(" + index + ")'><i class='fa fa-pencil'></i></button> " +
							"<button class='btn btn-danger btn-xs' title='Eliminar' onclick='eliminarConfigIa(" + val.id + ")'><i class='fa fa-times'></i></button>" +
						"</td>" +
					"</tr>");
			});
		} else {
			console.log("Error al listar config IA: " + data.CODE_RESPONSE);
		}
	});
}

/** Plantilla de criterios descargable por tipo de documento (P73). Tipos sin plantilla propia usan la de hoja de vida. */
var mapPlantillaIaPorTipo = {
	0: "../documentos/Plantilla_Criterios_Evaluacion_HojaVida.xlsx",
	8: "../documentos/Plantilla_Criterios_Evaluacion_EPP.xlsx",
	79: "../documentos/Plantilla_Criterios_Evaluacion_HabilitacionMedica.xlsx",
	15: "../documentos/Plantilla_Criterios_Evaluacion_AltoRiesgo.xlsx"
};

/** Apunta el link "Descargar plantilla" a la plantilla del tipo de documento seleccionado. */
function actualizarPlantillaIa() {
	var tipo = parseInt($("#selTipoDocIa").val());
	$("#linkPlantillaIa").attr("href", mapPlantillaIaPorTipo[tipo] || mapPlantillaIaPorTipo[0]);
}

/** Actualiza el contador de caracteres de un textarea ("X / max"), avisando en color al acercarse al límite. */
function contarCarsIa(idTa, idCont, max) {
	var n = ($("#" + idTa).val() || "").length;
	var c = $("#" + idCont);
	c.text(n + " / " + max);
	c.css("color", n >= max ? "#c0392b" : (n >= max * 0.9 ? "#e08000" : "#999"));
}

/** Abre el modal. config=null → nuevo; config=objeto → editar. */
function abrirModalConfigIa(config) {
	if (config) {
		$("#tituloModalConfigIa").text("Editar configuración");
		$("#configIaId").val(config.id);
		$("#selTipoDocIa").val(config.tipoExamenContratistaId);
		$("#textPerfilIa").val(config.perfilIa || "");
		$("#textPromptIa").val(config.promptInstrucciones || "");
		mostrarProcedimientoActual(config.procedimientoUrl, config.procedimientoNombre);
	} else {
		$("#tituloModalConfigIa").text("Agregar configuración");
		$("#configIaId").val(0);
		$("#selTipoDocIa").prop("selectedIndex", 0);
		$("#textPerfilIa").val("");
		$("#textPromptIa").val("");
		mostrarProcedimientoActual(null, null);
	}
	contarCarsIa('textPerfilIa', 'contPerfilIa', 2000);
	contarCarsIa('textPromptIa', 'contPromptIa', 4000);
	actualizarPlantillaIa();
	$("#fileProcedimientoIa").val("");
	$("#modalConfigIa").modal("show");
}

function editarConfigIa(index) {
	abrirModalConfigIa(listFullConfigIa[index]);
}

function mostrarProcedimientoActual(url, nombre) {
	if (url) {
		$("#divProcedimientoActual").html(
			"Actual: <a href='" + urlArchivo(antiCacheUrlIa(url)) + "' target='_blank'>" + (nombre || "ver procedimiento") + "</a>");
	} else {
		$("#divProcedimientoActual").html("<span style='color:#999;'>Sin procedimiento cargado</span>");
	}
}

/**
 * Parámetro anti-caché para el enlace del procedimiento: la clave en S3 es fija (se sobreescribe
 * el mismo objeto), así que sin esto el navegador puede servir su copia vieja al descargar el
 * archivo para verificarlo (caso reportado el 17-08: el Excel actualizado se subía bien pero la
 * descarga mostraba la versión anterior hasta limpiar caché). No afecta a las evaluaciones, que
 * descargan de S3 directo en el backend.
 */
function antiCacheUrlIa(url) {
	return url + (url.indexOf("?") >= 0 ? "&" : "?") + "t=" + new Date().getTime();
}

/** Guarda la config del modal. Si hay archivo nuevo, primero lo sube a S3 y luego guarda. */
function guardarConfigIa() {
	var inputFile = document.getElementById("fileProcedimientoIa");
	var file = inputFile ? inputFile.files[0] : null;
	if (file) {
		subirProcedimientoIa(file, function (urlSubida, nombreSubido) {
			persistirConfigIa(urlSubida, nombreSubido);
		});
	} else {
		persistirConfigIa(null, null);
	}
}

function persistirConfigIa(procedimientoUrl, procedimientoNombre) {
	var dataParam = {
		empresaId: parseInt(getSession("gestopcompanyid")),
		tipoExamenContratistaId: parseInt($("#selTipoDocIa").val()),
		perfilIa: $("#textPerfilIa").val(),
		promptInstrucciones: $("#textPromptIa").val(),
		procedimientoUrl: procedimientoUrl,
		procedimientoNombre: procedimientoNombre,
		usuarioId: parseInt(getSession("gestopuserid"))
	};
	callAjaxPost(URL + '/ia/evaluacion/config/save', dataParam, function (data) {
		if (data.CODE_RESPONSE == "05") {
			$("#modalConfigIa").modal("hide");
			mostrarMensaje("Configuración guardada correctamente.", 1);
			cargarConfiguracionesIa();
		} else {
			mostrarMensaje("Ocurrió un error al guardar la configuración.", 4);
		}
	});
}

/** Muestra el modal de confirmación y ejecuta el callback al aceptar.
 *  .off antes de .on para no apilar handlers si se abre el modal varias veces. */
function confirmarIa(mensaje, onAceptar) {
	$("#confirmModalIaBody").text(mensaje);
	$("#btnConfirmarEliminarIa").off("click").on("click", function () {
		$("#modalConfirmIa").modal("hide");
		onAceptar();
	});
	$("#modalConfirmIa").modal("show");
}

function eliminarConfigIa(id) {
	confirmarIa("¿Estás seguro de eliminar esta configuración?", function () {
		callAjaxPost(URL + '/ia/evaluacion/config/delete', { id: id }, function (data) {
			if (data.CODE_RESPONSE == "05") {
				mostrarMensaje("Configuración eliminada correctamente.", 1);
				cargarConfiguracionesIa();
			} else {
				mostrarMensaje("Ocurrió un error al eliminar la configuración.", 4);
			}
		});
	});
}

/** Sube el procedimiento a S3 vía multipart y devuelve url + nombre por callback. */
function subirProcedimientoIa(file, callback) {
	var bitsMax = 90 * 1000000; // 90 MB (igual que el límite multipart del back)
	if (file.size > bitsMax) {
		mostrarMensaje("El archivo supera el tamaño máximo permitido (90 MB).", 3);
		return;
	}
	var data = new FormData();
	data.append("file", file);
	data.append("empresaId", parseInt(getSession("gestopcompanyid")));
	data.append("tipoExamenContratistaId", parseInt($("#selTipoDocIa").val()));

	$.ajax({
		url: URL + '/ia/evaluacion/config/procedimiento/upload',
		type: 'POST',
		xhrFields: { withCredentials: true },
		contentType: false,
		processData: false,
		cache: false,
		data: data,
		beforeSend: function () { $.blockUI({ message: "Subiendo procedimiento..." }); },
		success: function (resp) {
			$.unblockUI();
			if (resp.CODE_RESPONSE == "05") {
				callback(resp.procedimientoUrl, resp.procedimientoNombre);
			} else if (resp.CODE_RESPONSE == "06") {
				sessionStorage.clear();
				document.location.replace(resp.PATH);
			} else {
				mostrarMensaje("Ocurrió un error al subir el procedimiento.", 4);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$.unblockUI();
			mostrarMensaje("Ups, problemas técnicos al subir el archivo. " + errorThrown, 4);
		}
	});
}
