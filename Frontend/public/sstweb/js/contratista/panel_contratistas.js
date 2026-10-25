/*
 * P-A00017: panel general de contratistas (reemplazo de los paneles de QuickSight).
 * Lo ve el administrador de la empresa cliente: todas sus contratistas a la vez, en cinco hojas, con un filtro por
 * perfil de seleccion multiple. La empresa la toma el servidor de la sesion; aqui solo viajan los filtros.
 * Los datos son los de la foto de cada madrugada (los mismos que usa QuickSight).
 */
var pcn = {
    perfiles: [], perfilIds: [], // perfil de la contratista (selección múltiple)
    lugares: [], lugarIds: [], // lugar de trabajo de sus proyectos vigentes (selección múltiple)
    actividad: "", // "" todas, "con" las que cargaron al menos 5 documentos, "sin" las que no cargaron ninguno
    palabraClave: "", // palabras (de 3 letras o más) que deben aparecer en la razón social, el RUC o el proyecto o servicio
    hoja: "resumen", secuencia: 0, cargado: false,
    estado: {} // por hoja: pagina, busqueda y filtros propios
};

var PCN_ACTIVIDADES = [
    {id: "", nombre: "Todas las contratistas"},
    {id: "con", nombre: "Solo las que cargaron al menos 5 documentos"},
    {id: "sin", nombre: "Solo las que no cargaron ningún documento"}
];

var PCN_HOJAS = [
    {id: "acreditadas", nombre: "Empresas acreditadas"},
    {id: "resumen", nombre: "Resumen"},
    {id: "consolidado", nombre: "Consolidado detallado"},
    {id: "trabajadores", nombre: "Trabajadores acreditados"},
    {id: "vehiculos", nombre: "Vehículos acreditados"}
];

var PCN_COLOR = {vb: "#2e9e5b", pen: "#3b82f6", obs: "#f59e0b", noreg: "#d64545"};
var PCN_NIVELES = [{id: 1, nombre: "Empresa"}, {id: 2, nombre: "Proyecto"}, {id: 3, nombre: "Trabajador contratista"},
    {id: 4, nombre: "Conductor"}, {id: 5, nombre: "Vehículo/Maquinaria"}];
var PCN_ESTADOS = [{id: "VB", nombre: "Visto bueno"}, {id: "PEN", nombre: "Pendiente de evaluación"},
    {id: "OBS", nombre: "Observado"}, {id: "NOREG", nombre: "No registrado"}];

function pcnEsc(valor) {
    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function pcnNum(valor) {
    var n = Number(valor);

    return isNaN(n) ? "0" : n.toLocaleString("es-PE");
}

function pcnPct(parte, total) {
    var p = Number(parte), t = Number(total);

    if (!t || isNaN(t) || isNaN(p)) {
        return "0 %";
    }

    return (Math.round(p / t * 1000) / 10).toLocaleString("es-PE") + " %";
}

function pcnDias(valor) {
    return (valor === null || valor === undefined) ? "-" : Number(valor).toLocaleString("es-PE", {maximumFractionDigits: 1});
}

function pcnCategoria(vb, total) {
    var t = Number(total), p = t ? Number(vb) / t : 0;

    if (p >= 0.8) {
        return {nombre: "Verde+", clase: "pcn-verde"};
    }

    return p >= 0.5 ? {nombre: "Amarillo", clase: "pcn-amarillo"} : {nombre: "Rojo", clase: "pcn-rojo"};
}

function pcnEstadoHoja() {
    if (!pcn.estado[pcn.hoja]) {
        pcn.estado[pcn.hoja] = {pagina: 1, busqueda: ""};
    }

    return pcn.estado[pcn.hoja];
}

function pcnEstilos() {
    if ($("#pcnEstilos").length) {
        return;
    }

    var css = ".pcn{max-width:1400px}.pcn-nota{color:#555;margin:0 0 12px}"
        + ".pcn-barra{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:0 0 12px}"
        + ".pcn-hoja{border:1px solid #1f4e79;background:#fff;color:#1f4e79;border-radius:16px;padding:4px 12px;cursor:pointer;font-size:13px}"
        + ".pcn-btn-filtros{border:1px solid #1f4e79;background:#fff;color:#1f4e79;border-radius:4px;padding:5px 14px;cursor:pointer;font-size:14px}"
        + ".pcn-btn-filtros.activo{background:#1f4e79;color:#fff}"
        + ".pcn-btn-informe,.pcn-btn-excel{margin-left:auto}.pcn-btn-informe[disabled],.pcn-btn-excel[disabled]{opacity:.5;cursor:wait}"
        + ".pcn-btn-excel{padding:4px 12px;font-size:13px}"
        + ".pcn-btn-filtros .badge{margin-left:6px;background:#fff;color:#1f4e79}"
        + ".pcn-resumen-filtros{color:#333;font-size:13px}.pcn-resumen-filtros b{color:#1f4e79}"
        + ".pcn-limpiar{border:0;background:none;color:#1f4e79;text-decoration:underline;cursor:pointer;font-size:13px;padding:0 4px}"
        + ".pcn-grupo{margin:0 0 16px}.pcn-grupo h5{margin:0 0 6px;font-size:14px;font-weight:bold;color:#1f4e79}"
        + ".pcn-grupo label{display:block;font-weight:normal;margin:0 0 4px;cursor:pointer}"
        + ".pcn-grupo label input{margin-right:6px}.pcn-grupo .pcn-lista{max-height:180px;overflow-y:auto;padding-right:6px}"
        + ".pcn-grupo small{color:#666}"
        + ".pcn-hojas{display:flex;flex-wrap:wrap;gap:4px;border-bottom:2px solid #1f4e79;margin:0 0 14px}"
        + ".pcn-hoja{border-radius:4px 4px 0 0;border-bottom:0;font-size:14px;padding:7px 14px}"
        + ".pcn-hoja.activo{background:#1f4e79;color:#fff}"
        + ".pcn-kpis{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin:0 0 14px}"
        + ".pcn-kpi{border:1px solid #d9e1ea;border-radius:6px;padding:10px 12px;background:#fff}"
        + ".pcn-kpi b{display:block;font-size:24px;line-height:1.2;color:#1f4e79}.pcn-kpi span{font-size:12px;color:#555}"
        + ".pcn-graficos{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;margin:0 0 14px}"
        + ".pcn-grafico{border:1px solid #d9e1ea;border-radius:6px;padding:8px;background:#fff;min-height:260px}"
        + ".pcn-grafico h4{margin:2px 0 6px;font-size:14px;color:#1f4e79}"
        + ".pcn-grafico>div{height:230px}"
        + ".pcn-herr{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 8px}"
        + ".pcn-herr input,.pcn-herr select{padding:4px 8px;border:1px solid #bbb;border-radius:4px;min-width:200px}"
        + ".pcn-tabla-wrap{overflow-x:auto;border:1px solid #d9e1ea;border-radius:6px;background:#fff}"
        + ".pcn-tabla{width:100%;border-collapse:collapse;font-size:13px}"
        + ".pcn-tabla th{background:#1f4e79;color:#fff;padding:7px 8px;text-align:left;vertical-align:bottom;position:sticky;top:0}"
        + ".pcn-tabla td{padding:6px 8px;border-top:1px solid #e6ebf0;vertical-align:top}"
        + ".pcn-tabla td.num,.pcn-tabla th.num{text-align:right}"
        + ".pcn-tabla tr:nth-child(even) td{background:#f6f9fc}"
        + ".pcn-obs{max-width:340px;white-space:normal}"
        + ".pcn-etq{display:inline-block;border-radius:10px;padding:1px 9px;font-size:12px;color:#fff;white-space:nowrap}"
        + ".pcn-verde{background:#2e9e5b}.pcn-amarillo{background:#d99a0b}.pcn-rojo{background:#d64545}.pcn-gris{background:#7a8794}"
        + ".pcn-pie{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;margin:8px 0;font-size:13px;color:#555}"
        + ".pcn-pie button{margin-left:4px}"
        + ".pcn-vacio{padding:34px 16px;text-align:center;color:#555;border:1px dashed #b7c3d0;border-radius:6px;background:#fff}"
        + ".pcn-zona{position:relative;min-height:140px}"
        + ".pcn-rueda{display:none;position:absolute;left:50%;top:90px;transform:translateX(-50%);z-index:5;background:#fff;border:1px solid #d9e1ea;border-radius:8px;padding:12px 20px;box-shadow:0 2px 10px rgba(0,0,0,.15);align-items:center;gap:10px;font-size:14px;color:#1f4e79}"
        + ".pcn-zona.cargando .pcn-rueda{display:flex}"
        + ".pcn-giro{display:inline-block;width:22px;height:22px;border:3px solid #d6dde3;border-top-color:#1f4e79;border-radius:50%;animation:pcnGiro 1s linear infinite}"
        + "@keyframes pcnGiro{to{transform:rotate(360deg)}}"
        + ".pcn-cargando{opacity:.45;pointer-events:none}"
        + ".pcn-aviso{border-left:4px solid #1f4e79;background:#eef4fa;padding:8px 12px;margin:0 0 12px;font-size:13px;color:#333}";

    $("head").append("<style id='pcnEstilos'>" + css + "</style>");
}

function cargarPanelContratistas() {
    pcnEstilos();

    if (pcn.cargado) {
        pcnPintarBarra();
        pcnCargarHoja();

        return;
    }

    $("#divContainPanelContratistas").html("<div class='pcn-vacio'>Cargando...</div>");

    callAjaxPost(URL + "/contratista/panel/perfiles", {}, function (data) {
        if (data.CODE_RESPONSE !== "05") {
            $("#divContainPanelContratistas").html("<div class='pcn-vacio'>No se pudo cargar el panel. Intente de nuevo.</div>");

            return;
        }

        pcn.perfiles = data.perfiles || [];
        pcn.lugares = data.lugares || [];
        pcn.perfilIds = [];
        pcn.lugarIds = [];
        pcn.actividad = "";
        pcn.palabraClave = "";
        pcn.cargado = true;

        $("#divContainPanelContratistas").html(
            "<div class='pcn'>"
            + "<p class='pcn-nota'>Cumplimiento documental de todas sus contratistas. La información se actualiza cada madrugada.</p>"
            + "<div class='pcn-barra' id='pcnBarraFiltros'></div>"
            + "<div class='pcn-hojas' id='pcnHojas' role='tablist'></div>"
            + "<div id='pcnZona' class='pcn-zona'><div class='pcn-rueda' role='status' aria-live='polite'><span class='pcn-giro'></span><span>Cargando...</span></div>"
            + "<div id='pcnCuerpo'></div></div></div>");

        pcnPintarBarra();
        pcnCargarHoja();
    });
}

// Nombres de los elementos elegidos de una lista de {id, nombre}
function pcnNombresElegidos(lista, ids) {
    return lista.filter(function (o) {
        return ids.indexOf(Number(o.id)) >= 0;
    }).map(function (o) {
        return pcnEsc(o.nombre);
    }).join(", ");
}

function pcnCantidadFiltros() {
    return (pcn.perfilIds.length ? 1 : 0) + (pcn.lugarIds.length ? 1 : 0) + (pcn.actividad ? 1 : 0) + (pcn.palabraClave ? 1 : 0);
}

function pcnHayFiltros() {
    return pcnCantidadFiltros() > 0;
}

function pcnPintarBarra() {
    var n = pcnCantidadFiltros(), partes = [];

    if (pcn.perfilIds.length) {
        partes.push("Perfil: <b>" + pcnNombresElegidos(pcn.perfiles, pcn.perfilIds) + "</b>");
    }

    if (pcn.lugarIds.length) {
        partes.push("Lugar de trabajo: <b>" + pcnNombresElegidos(pcn.lugares, pcn.lugarIds) + "</b>");
    }

    if (pcn.actividad) {
        partes.push("<b>" + (pcn.actividad === "con" ? "Solo las que cargaron 5 o más documentos" : "Solo las que no cargaron ninguno") + "</b>");
    }

    if (pcn.palabraClave) {
        partes.push("Palabra clave: <b>" + pcnEsc(pcn.palabraClave) + "</b>");
    }

    var barra = "<button type='button' class='pcn-btn-filtros" + (n ? " activo" : "") + "' onclick='pcnAbrirFiltros()'>"
        + "<span class='fa fa-filter' aria-hidden='true'></span> Filtros"
        + (n ? "<span class='badge'>" + n + "</span>" : "") + "</button>"
        + "<span class='pcn-resumen-filtros'>" + (partes.length ? partes.join(" &middot; ") : "Sin filtros: se muestran todas las contratistas") + "</span>"
        + (n ? "<button type='button' class='pcn-limpiar' onclick='pcnLimpiarFiltros(true)'>Quitar filtros</button>" : "")
        + "<button type='button' class='pcn-btn-filtros pcn-btn-informe' onclick='pcnGenerarInforme()' "
        + "title='Genera un informe en PDF con los filtros elegidos'>"
        + "<span class='fa fa-file-pdf-o' aria-hidden='true'></span> Generar informe</button>";

    $("#pcnBarraFiltros").html(barra);

    var hojas = "";
    PCN_HOJAS.forEach(function (h) {
        hojas += "<button type='button' role='tab' class='pcn-hoja" + (pcn.hoja === h.id ? " activo" : "")
            + "' aria-selected='" + (pcn.hoja === h.id) + "' onclick='pcnElegirHoja(\"" + h.id + "\")'>" + pcnEsc(h.nombre) + "</button>";
    });
    $("#pcnHojas").html(hojas);
}

// ---------- Descargas: informe en PDF y tablas en Excel ----------

// Pide un archivo al servidor con los filtros elegidos y lo descarga. Abre una pestaña con el aviso "Generando..."
// mientras el servidor trabaja; si el navegador la bloquea, descarga igual y los avisos salen en esta pantalla.
// opciones: ruta, datos, boton (se desactiva mientras tanto), titulo, detalle, nombreBase, extension,
// sinDatos (texto si el servidor no devuelve filas) y listo (texto al terminar).
function pcnDescargarArchivo(opciones) {
    var boton = opciones.boton;

    if (boton.prop("disabled")) {
        return;
    }

    var ventana = window.open("", "_blank");

    if (ventana) {
        ventana.document.write("<!DOCTYPE html><html lang='es'><head><meta charset='utf-8'><title>" + opciones.titulo + "</title>"
            + "<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;color:#333;margin:0;display:flex;align-items:center;"
            + "justify-content:center;min-height:100vh;text-align:center}.caja{background:#fff;padding:40px 48px;border-radius:8px;"
            + "box-shadow:0 2px 10px rgba(0,0,0,.12);max-width:480px}.rueda{width:48px;height:48px;margin:0 auto 20px;border:5px solid #d6dde3;"
            + "border-top-color:#1f4e79;border-radius:50%;animation:giro 1s linear infinite}@keyframes giro{to{transform:rotate(360deg)}}"
            + ".listo{font-size:48px;color:#2e9e4f;margin-bottom:12px}.error{font-size:48px;color:#c0392b;margin-bottom:12px}"
            + "h2{margin:0 0 12px}p{margin:6px 0;line-height:1.4}</style></head><body><div class='caja'><div id='icono' class='rueda'></div>"
            + "<h2 id='titulo'>" + opciones.titulo + "</h2>"
            + "<p id='detalle'>" + opciones.detalle + "</p></div></body></html>");
        ventana.document.close();
    }

    function aviso(claseIcono, simbolo, titulo, detalle) {
        if (!ventana || ventana.closed) {
            if (claseIcono !== "listo") {
                alert(titulo + ". " + detalle);
            }

            return;
        }

        var icono = ventana.document.getElementById("icono");
        icono.className = claseIcono;
        icono.textContent = simbolo;
        ventana.document.getElementById("titulo").textContent = titulo;
        ventana.document.getElementById("detalle").textContent = detalle;
        ventana.document.title = titulo;
    }

    // "URL" está redefinida por constantes.js (dirección del servidor): la API nativa (createObjectURL) se toma de un marco oculto
    var marcoNativo = document.createElement("iframe");
    marcoNativo.style.display = "none";
    document.body.appendChild(marcoNativo);
    var urlNativa = marcoNativo.contentWindow.URL;

    function quitarMarco() {
        if (marcoNativo.parentNode) {
            marcoNativo.parentNode.removeChild(marcoNativo);
        }
    }

    boton.prop("disabled", true);

    fetch(URL + opciones.ruta, {
        method: "POST", credentials: "include", headers: {"Content-Type": "application/json"},
        body: JSON.stringify(opciones.datos)
    }).then(function (respuesta) {
        if (respuesta.status === 204) {
            aviso("error", "!", "No hay datos para descargar", opciones.sinDatos + " Puede cerrar esta pestaña.");

            return;
        }

        if (respuesta.status === 429) {
            aviso("error", "!", "Hay otras descargas en curso", "Espere un minuto y vuelva a intentarlo. Puede cerrar esta pestaña.");

            return;
        }

        if (!respuesta.ok) {
            throw new Error("código " + respuesta.status);
        }

        return respuesta.blob().then(function (archivo) {
            var hoy = new Date(), dos = function (n) {
                return n < 10 ? "0" + n : "" + n;
            };
            var nombreArchivo = opciones.nombreBase + " " + hoy.getFullYear() + "-" + dos(hoy.getMonth() + 1) + "-" + dos(hoy.getDate()) + "." + opciones.extension;

            var enlaceTemporal = urlNativa.createObjectURL(archivo);
            var enlace = document.createElement("a");
            enlace.href = enlaceTemporal;
            enlace.download = nombreArchivo;
            enlace.style.display = "none";
            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);

            setTimeout(function () {
                urlNativa.revokeObjectURL(enlaceTemporal);
            }, 60000);

            aviso("listo", "✔", "Listo", opciones.listo + " Esta pestaña se cerrará sola.");

            if (ventana && !ventana.closed) {
                setTimeout(function () {
                    if (!ventana.closed) {
                        ventana.close();
                    }
                }, 2500);
            }
        });
    }).catch(function (error) {
        aviso("error", "!", "No se pudo completar la descarga", "Inténtelo de nuevo. Si vuelve a pasar, avise al soporte de la plataforma (" + error.message + "). Puede cerrar esta pestaña.");
    }).then(function () {
        boton.prop("disabled", false);
        setTimeout(quitarMarco, 61000);
    });
}

// Filtros del panel: los mismos en el informe y en cada descarga
function pcnFiltrosDelPanel() {
    return {perfilIds: pcn.perfilIds, lugarIds: pcn.lugarIds, actividad: pcn.actividad, palabraClave: pcn.palabraClave};
}

function pcnGenerarInforme() {
    pcnDescargarArchivo({
        ruta: "/contratista/panel/informe", datos: pcnFiltrosDelPanel(), boton: $(".pcn-btn-informe"),
        titulo: "Generando el informe...", detalle: "Puede tardar unos segundos. La descarga empezar&aacute; sola.",
        nombreBase: "Informe de gestion de contratistas", extension: "pdf",
        sinDatos: "Los filtros elegidos no dejan ningún documento. Cambie o quite algún filtro y vuelva a intentarlo.",
        listo: "El informe se descargó."
    });
}

// Descarga en Excel la tabla de la hoja que se está viendo, completa (no solo la página) y con todos los filtros de la pantalla
function pcnDescargarExcel() {
    var est = pcnEstadoHoja(), datos = pcnFiltrosDelPanel();

    datos.hoja = pcn.hoja;
    datos.busqueda = est.busqueda || "";

    if (pcn.hoja === "resumen") {
        datos.orden = est.orden || "nombre";
    } else if (pcn.hoja === "acreditadas") {
        datos.estadoAcreditacion = est.estadoAcreditacion || "";
        datos.detalle = est.detalle || "empresa";
    } else if (pcn.hoja === "consolidado") {
        datos.nivelId = est.nivelId || "";
        datos.estado = est.estado || "";
    } else {
        datos.acreditado = est.acreditado || "";
    }

    var hoja = PCN_HOJAS.filter(function (h) {
        return h.id === pcn.hoja;
    })[0];

    pcnDescargarArchivo({
        ruta: "/contratista/panel/excel", datos: datos, boton: $(".pcn-btn-excel"),
        titulo: "Preparando el Excel...", detalle: "Incluye todas las filas de la tabla con los filtros elegidos. Puede tardar unos segundos.",
        nombreBase: "Panel de contratistas - " + (hoja ? hoja.nombre : "tabla"), extension: "xlsx",
        sinDatos: "La tabla no tiene filas con los filtros elegidos.",
        listo: "El archivo Excel se descargó."
    });
}

// ---------- Ventana de filtros ----------

function pcnGrupoChecks(titulo, lista, ids, nombreCampo, vacio) {
    var h = "<div class='pcn-grupo'><h5>" + pcnEsc(titulo) + " <small>(puede elegir varios; sin elegir, se muestran todos)</small></h5>";

    if (!lista.length) {
        return h + "<small>" + pcnEsc(vacio) + "</small></div>";
    }

    h += "<div class='pcn-lista'>";
    lista.forEach(function (o) {
        h += "<label><input type='checkbox' name='" + nombreCampo + "' value='" + Number(o.id) + "'"
            + (ids.indexOf(Number(o.id)) >= 0 ? " checked" : "") + "> " + pcnEsc(o.nombre) + " <small>(" + pcnNum(o.contratistas) + ")</small></label>";
    });

    return h + "</div></div>";
}

function pcnAbrirFiltros() {
    if (!$("#pcnModalFiltros").length) {
        $("body").append(
            "<div class='modal fade' id='pcnModalFiltros' tabindex='-1' role='dialog' aria-labelledby='pcnModalTitulo'>"
            + "<div class='modal-dialog'><div class='modal-content'>"
            + "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Cerrar'><span aria-hidden='true'>&times;</span></button>"
            + "<h4 class='modal-title' id='pcnModalTitulo'>Filtros del panel</h4></div>"
            + "<div class='modal-body' id='pcnModalCuerpo'></div>"
            + "<div class='modal-footer'><button type='button' class='btn btn-default' onclick='pcnLimpiarFiltros(false)'>Limpiar</button>"
            + "<button type='button' class='btn btn-primary' onclick='pcnAplicarFiltros()'>Aplicar</button></div>"
            + "</div></div></div>");
    }

    var h = pcnGrupoChecks("Perfil de la contratista", pcn.perfiles, pcn.perfilIds, "pcnPerfil", "La empresa no tiene perfiles creados.")
        + pcnGrupoChecks("Lugar de trabajo", pcn.lugares, pcn.lugarIds, "pcnLugar", "La empresa no tiene lugares de trabajo creados.")
        + "<div class='pcn-grupo'><h5>Documentos cargados</h5>";

    PCN_ACTIVIDADES.forEach(function (a) {
        h += "<label><input type='radio' name='pcnActividad' value='" + a.id + "'" + (pcn.actividad === a.id ? " checked" : "") + "> " + pcnEsc(a.nombre) + "</label>";
    });

    h += "<small>Una contratista cuenta como \"cargó\" si tiene al menos 5 documentos con visto bueno, observado o pendiente de evaluación (\"ninguno\" significa cero documentos cargados). "
        + "El lugar de trabajo muestra las contratistas con un proyecto vigente en ese lugar, con todos sus documentos.</small></div>";

    h += "<div class='pcn-grupo'><h5>Palabra clave</h5>"
        + "<input type='text' id='pcnPalabraClave' class='form-control' maxlength='100' autocomplete='off' value='" + pcnEsc(pcn.palabraClave) + "' "
        + "placeholder='Ej.: minera norte' aria-label='Palabra clave' onkeydown='if (event.keyCode === 13) { pcnAplicarFiltros(); return false; }'>"
        + "<small>Busca en la razón social, el RUC y el nombre o código del proyecto o servicio. Cada palabra debe tener al menos 3 letras y todas deben aparecer "
        + "(no importan las mayúsculas). En la vista por proyecto o servicio se muestran solo los que contienen la palabra.</small>"
        + "<div id='pcnPalabraAviso' class='text-danger' role='alert' style='display:none'></div></div>";

    $("#pcnModalCuerpo").html(h);
    $("#pcnModalFiltros").modal("show");
}

function pcnMarcados(nombre) {
    return $("input[name='" + nombre + "']:checked").map(function () {
        return Number($(this).val());
    }).get();
}

// Palabras de la palabra clave (separadas por espacios); devuelve null si alguna tiene menos de 3 letras
function pcnLeerPalabraClave() {
    var texto = $.trim($("#pcnPalabraClave").val() || "").replace(/\s+/g, " ");
    var palabras = texto ? texto.split(" ") : [], i;

    for (i = 0; i < palabras.length; i++) {
        if (palabras[i].length < 3) {
            return null;
        }
    }

    return texto;
}

function pcnAplicarFiltros() {
    var palabra = pcnLeerPalabraClave();

    if (palabra === null) {
        $("#pcnPalabraAviso").text("Cada palabra debe tener al menos 3 letras.").show();
        $("#pcnPalabraClave").focus();

        return;
    }

    pcn.palabraClave = palabra;
    pcn.perfilIds = pcnMarcados("pcnPerfil");
    pcn.lugarIds = pcnMarcados("pcnLugar");
    pcn.actividad = $("input[name='pcnActividad']:checked").val() || "";

    $("#pcnModalFiltros").modal("hide");
    pcnFiltroCambio();
}

// cerrar = true quita los filtros directamente (enlace de la barra); false solo vacía las casillas de la ventana
function pcnLimpiarFiltros(cerrar) {
    if (cerrar) {
        pcn.perfilIds = [];
        pcn.lugarIds = [];
        pcn.actividad = "";
        pcn.palabraClave = "";
        pcnFiltroCambio();

        return;
    }

    $("#pcnPalabraClave").val("");
    $("#pcnPalabraAviso").hide();
    $("#pcnModalCuerpo input[type='checkbox']").prop("checked", false);
    $("#pcnModalCuerpo input[name='pcnActividad'][value='']").prop("checked", true);
}

function pcnFiltroCambio() {
    Object.keys(pcn.estado).forEach(function (h) {
        pcn.estado[h].pagina = 1;
    });

    pcnPintarBarra();
    pcnCargarHoja();
}

function pcnElegirHoja(id) {
    pcn.hoja = id;
    pcnPintarBarra();
    pcnCargarHoja();
}

function pcnPagina(delta) {
    var est = pcnEstadoHoja();

    est.pagina = Math.max(1, est.pagina + delta);
    pcnCargarHoja();
}

function pcnBuscar(valor) {
    var est = pcnEstadoHoja();

    est.busqueda = valor;
    est.pagina = 1;

    // Espera a que termine de escribir
    clearTimeout(pcn.esperaBusqueda);
    pcn.esperaBusqueda = setTimeout(pcnCargarHoja, 450);
}

function pcnFiltro(clave, valor) {
    var est = pcnEstadoHoja();

    est[clave] = valor;
    est.pagina = 1;

    // los estados de la vista por empresa (total, parcial) no existen en la vista por proyecto y al revés
    if (clave === "detalle") {
        est.estadoAcreditacion = "";
    }

    pcnCargarHoja();
}

function pcnCargarHoja() {
    var hoja = pcn.hoja, est = pcnEstadoHoja(), secuencia = ++pcn.secuencia;

    var datos = {
        perfilIds: pcn.perfilIds, lugarIds: pcn.lugarIds, actividad: pcn.actividad, palabraClave: pcn.palabraClave,
        pagina: est.pagina, busqueda: est.busqueda || ""
    };

    if (hoja === "resumen") {
        datos.orden = est.orden || "nombre";
    } else if (hoja === "acreditadas") {
        datos.estadoAcreditacion = est.estadoAcreditacion || "";
        datos.detalle = est.detalle || "empresa";
    } else if (hoja === "consolidado") {
        datos.nivelId = est.nivelId || "";
        datos.estado = est.estado || "";
    } else {
        datos.acreditado = est.acreditado || "";
    }

    var $cuerpo = $("#pcnCuerpo");

    callAjaxPost(URL + "/contratista/panel/" + hoja, datos, function (data) {
        // Respuesta de una carga anterior: se descarta
        if (secuencia !== pcn.secuencia) {
            return;
        }

        $cuerpo.removeClass("pcn-cargando");
        $("#pcnZona").removeClass("cargando");

        if (data.CODE_RESPONSE !== "05") {
            $cuerpo.html("<div class='pcn-vacio'>No se pudo cargar esta hoja. Intente de nuevo.</div>");

            return;
        }

        var html = "";

        if (hoja === "resumen") {
            html = pcnHtmlResumen(data, est);
        } else if (hoja === "acreditadas") {
            html = pcnHtmlAcreditadas(data, est);
        } else if (hoja === "consolidado") {
            html = pcnHtmlConsolidado(data, est);
        } else {
            html = pcnHtmlEntidades(data, est, hoja);
        }

        $cuerpo.html(html);

        // El buscador conserva el foco y el cursor al volver a pintarse
        var $buscador = $("#pcnBuscador");
        if ($buscador.length && pcn.enfocarBuscador) {
            $buscador.focus();
            var largo = $buscador.val().length;
            $buscador[0].setSelectionRange(largo, largo);
        }

        pcnGraficos(hoja, data);
    }, function () {
        $cuerpo.addClass("pcn-cargando");
        $("#pcnZona").addClass("cargando");
        pcn.enfocarBuscador = $(document.activeElement).attr("id") === "pcnBuscador";
    }, null, null, function () {
        if (secuencia === pcn.secuencia) {
            $cuerpo.removeClass("pcn-cargando");
            $("#pcnZona").removeClass("cargando");
        }
    }, false);
}

// ---------- Piezas comunes ----------

function pcnKpi(valor, etiqueta, ayuda) {
    return "<div class='pcn-kpi'" + (ayuda ? " title='" + pcnEsc(ayuda) + "'" : "") + "><b>" + valor + "</b><span>" + pcnEsc(etiqueta) + "</span></div>";
}

function pcnHerramientas(est, opciones) {
    var h = "<div class='pcn-herr'><input id='pcnBuscador' type='search' placeholder='Buscar por razón social o RUC' value='"
        + pcnEsc(est.busqueda) + "' oninput='pcnBuscar(this.value)' aria-label='Buscar'>";

    (opciones || []).forEach(function (op) {
        h += "<select aria-label='" + pcnEsc(op.etiqueta) + "' onchange='pcnFiltro(\"" + op.clave + "\",this.value)'>"
            + (op.sinTodos ? "" : "<option value=''>" + pcnEsc(op.etiqueta) + ": todos</option>");

        op.valores.forEach(function (v) {
            h += "<option value='" + pcnEsc(v.id) + "'" + (String(est[op.clave] || op.defecto || "") === String(v.id) ? " selected" : "")
                + ">" + pcnEsc(v.nombre) + "</option>";
        });

        h += "</select>";
    });

    h += "<button type='button' class='pcn-btn-filtros pcn-btn-excel' onclick='pcnDescargarExcel()' "
        + "title='Descarga la tabla completa en Excel, con los filtros elegidos'>"
        + "<span class='fa fa-file-excel-o' aria-hidden='true'></span> Descargar Excel</button>";

    return h + "</div>";
}

function pcnPie(data) {
    var total = Number(data.totalFilas) || 0, pag = Number(data.pagina) || 1, tam = Number(data.filasPorPagina) || 25;
    var desde = total ? (pag - 1) * tam + 1 : 0, hasta = Math.min(total, pag * tam);

    return "<div class='pcn-pie'><span>Mostrando " + pcnNum(desde) + " a " + pcnNum(hasta) + " de " + pcnNum(total)
        + "</span><span>Página " + pcnNum(pag) + " de " + pcnNum(data.totalPaginas)
        + " <button type='button' class='btn btn-default btn-sm' " + (pag <= 1 ? "disabled" : "") + " onclick='pcnPagina(-1)'>Anterior</button>"
        + "<button type='button' class='btn btn-default btn-sm' " + (pag >= Number(data.totalPaginas) ? "disabled" : "") + " onclick='pcnPagina(1)'>Siguiente</button></span></div>";
}

function pcnTabla(cabeceras, filas) {
    var h = "<div class='pcn-tabla-wrap'><table class='pcn-tabla'><thead><tr>";

    cabeceras.forEach(function (c) {
        // c.a: explicación breve que aparece al pasar el mouse por el encabezado
        h += "<th" + (c.num ? " class='num'" : "") + (c.a ? " title='" + pcnEsc(c.a) + "'" : "") + ">" + pcnEsc(c.t) + "</th>";
    });

    h += "</tr></thead><tbody>";

    if (!filas.length) {
        h += "<tr><td colspan='" + cabeceras.length + "' style='text-align:center;color:#555'>No hay resultados con estos filtros.</td></tr>";
    }

    return h + filas.join("") + "</tbody></table></div>";
}

function pcnVacio() {
    if (pcnHayFiltros()) {
        return "<div class='pcn-vacio'><b>No hay información para los filtros elegidos.</b><br>"
            + "Cambie o quite algún filtro para ver más contratistas.</div>";
    }

    return "<div class='pcn-vacio'><b>Esta empresa no tiene información para esta hoja.</b><br>"
        + "Aparecerá cuando sus contratistas tengan documentos solicitados.</div>";
}

function pcnEtiquetaEstado(estado, nombre) {
    var mapa = {
        VB: {t: "Visto bueno", c: "pcn-verde"}, PEN: {t: "Pendiente", c: "pcn-gris"},
        OBS: {t: "Observado", c: "pcn-amarillo"}, NOREG: {t: "No registrado", c: "pcn-rojo"}
    };
    var e = mapa[estado] || {t: nombre || "-", c: "pcn-gris"};

    return "<span class='pcn-etq " + e.c + "'>" + pcnEsc(e.t) + "</span>";
}

// ---------- Hoja: Resumen ----------

function pcnHtmlResumen(data, est) {
    var k = data.kpis || {};

    if (!Number(k.contratistas) && !est.busqueda) {
        return pcnVacio();
    }

    var h = "<div class='pcn-kpis'>"
        + pcnKpi(pcnNum(k.contratistas), "Contratistas con proyectos vigentes")
        + pcnKpi(pcnNum(k.total), "Documentos solicitados")
        + pcnKpi(pcnPct(k.vb, k.total), "% de documentos con visto bueno")
        + pcnKpi(pcnNum(k.vb), "Documentos con visto bueno")
        + pcnKpi(pcnNum(k.pen), "Documentos pendientes de evaluación")
        + pcnKpi(pcnNum(k.obs), "Documentos observados")
        + pcnKpi(pcnNum(k.noreg), "Documentos por registrar")
        + pcnKpi(pcnDias(k.diasPromedio), "Días promedio de evaluación")
        + pcnKpi(pcnDias(data.diasMediana), "Días mediana de evaluación") + "</div>"
        + "<div class='pcn-aviso'>Visto bueno: aprobados por el evaluador. Pendientes: cargados y en espera de revisión (incluye por re-evaluar). "
        + "Observados: rechazados que requieren subsanación. Por registrar: solicitados que aún no se han cargado.</div>"
        + "<div class='pcn-graficos'><div class='pcn-grafico'><h4>Documentos por estado</h4><div id='pcnGrafEstados'></div></div>"
        + "<div class='pcn-grafico'><h4>Contratistas por categoría de avance</h4><div id='pcnGrafCategorias'></div></div></div>"
        + pcnHerramientas(est, [{
            clave: "orden", etiqueta: "Orden",
            valores: [{id: "nombre", nombre: "Razón social"}, {id: "avanceAsc", nombre: "Menor avance primero"}, {id: "avanceDesc", nombre: "Mayor avance primero"}]
        }]);

    var filas = (data.filas || []).map(function (f) {
        var cat = pcnCategoria(f.vb, f.total);

        return "<tr><td>" + pcnEsc(f.nombre) + "</td><td>" + pcnEsc(f.ruc) + "</td><td>" + pcnEsc(f.perfil) + "</td>"
            + "<td class='num'>" + pcnNum(f.trabajadores) + "</td><td class='num'>" + pcnNum(f.vehiculos) + "</td>"
            + "<td class='num'>" + pcnNum(f.vb) + "</td><td class='num'>" + pcnNum(f.pen) + "</td>"
            + "<td class='num'>" + pcnNum(f.obs) + "</td><td class='num'>" + pcnNum(f.noreg) + "</td>"
            + "<td class='num'>" + pcnNum(f.total) + "</td>"
            + "<td class='num'>" + pcnPct(f.vb, f.total) + "</td>"
            + "<td><span class='pcn-etq " + cat.clase + "'>" + cat.nombre + "</span></td>"
            + "<td class='num'>" + pcnDias(f.diasPromedio) + "</td></tr>";
    });

    return h + pcnTabla([{t: "Contratista"}, {t: "RUC"}, {t: "Perfil", a: "Perfil asignado a la contratista"},
        {t: "N.° de trabajadores", num: 1, a: "Trabajadores de la contratista que tienen documentos solicitados"},
        {t: "N.° de vehículos y maquinarias", num: 1, a: "Vehículos y maquinarias de la contratista que tienen documentos solicitados"},
        {t: "Documentos con visto bueno", num: 1, a: "Documentos aprobados por el evaluador"},
        {t: "Documentos pendientes de evaluación", num: 1, a: "Documentos cargados por la contratista que esperan revisión (incluye los por re-evaluar)"},
        {t: "Documentos observados", num: 1, a: "Documentos rechazados que la contratista debe subsanar"},
        {t: "Documentos por registrar", num: 1, a: "Documentos solicitados que la contratista aún no ha cargado"},
        {t: "Total de documentos solicitados", num: 1, a: "Suma de documentos con visto bueno, pendientes, observados y por registrar"},
        {t: "% de documentos con visto bueno", num: 1, a: "Documentos con visto bueno entre el total de documentos solicitados"},
        {t: "Nivel de avance", a: "Verde+: 80 % o más de documentos con visto bueno. Amarillo: 50 % o más. Rojo: menos de 50 %"},
        {t: "Días promedio de evaluación", num: 1, a: "Días promedio entre el registro de un documento y su evaluación"}], filas) + pcnPie(data);
}

// ---------- Hoja: Empresas acreditadas ----------

function pcnHtmlAcreditadas(data, est) {
    var k = data.kpis || {};

    if (!Number(k.contratistas) && !est.busqueda) {
        return pcnVacio();
    }

    var total = Number(k.contratistas) || 0, sinDocs = Number(k.sinDocumentos) || 0, acred = Number(k.acreditadas) || 0;
    var acTotal = Number(k.acreditadasTotal) || 0, acParcial = Number(k.acreditadasParcial) || 0;
    var e = data.entidades || {}, pr = data.proyectos || {}, porProyecto = data.detalle === "proyecto";

    var h = "<div class='pcn-aviso'><b>Nota:</b> para que una empresa se considere acreditada debe tener <b>al menos un proyecto o servicio activo acreditado</b>. "
        + "La acreditación es <b>total</b> cuando todos sus proyectos o servicios están acreditados y <b>parcial</b> cuando solo lo están algunos. Un proyecto o servicio está "
        + "acreditado cuando tiene con visto bueno todo lo solicitado para esa actividad; los documentos a nivel empresa se consideran en cada proyecto. Las empresas a las que "
        + "no se les solicita ningún documento de empresa ni de proyecto también se consideran acreditadas: si no se les pide nada, no hay nada que diferenciar.</div>"
        + "<div class='pcn-kpis'>"
        + pcnKpi(pcnNum(k.contratistas), "Contratistas con proyectos vigentes")
        + pcnKpi(pcnNum(acred), "Empresas acreditadas (" + pcnPct(acred, total) + "): " + pcnNum(acTotal) + " total y " + pcnNum(acParcial) + " parcial"
            + (sinDocs > 0 ? ", más " + pcnNum(sinDocs) + " sin documentos solicitados" : ""),
            "Acreditación total: todos sus proyectos o servicios están acreditados. Acreditación parcial: al menos un proyecto o servicio acreditado, pero no todos")
        + pcnKpi(pcnNum(Math.max(0, total - acred)), "Empresas no acreditadas (" + pcnPct(Math.max(0, total - acred), total) + ")",
            "Empresas sin ningún proyecto o servicio acreditado")
        + pcnKpi(pcnNum(pr.acreditados), "Proyectos / servicios acreditados (" + pcnPct(pr.acreditados, pr.total) + " de " + pcnNum(pr.total) + " registrados)",
            "Proyectos o servicios con documentos solicitados. Está acreditado el que tiene con visto bueno todo lo solicitado para esa actividad, incluidos los documentos de la empresa")
        + pcnKpi(pcnNum(e.trabajadoresAcreditados), "Trabajadores acreditados (" + pcnPct(e.trabajadoresAcreditados, e.trabajadores) + " de " + pcnNum(e.trabajadores) + ")")
        + pcnKpi(pcnNum(e.vehiculosAcreditados), "Vehículos y maquinarias acreditados (" + pcnPct(e.vehiculosAcreditados, e.vehiculos) + " de " + pcnNum(e.vehiculos) + ")")
        + pcnKpi(pcnDias(data.diasMediana), "Días mediana de evaluación") + "</div>"
        + "<div class='pcn-graficos'><div class='pcn-grafico'><h4>Estado de acreditación</h4><div id='pcnGrafAcred'></div></div></div>"
        + pcnHerramientas(est, [{
            clave: "detalle", etiqueta: "Ver por", sinTodos: true, defecto: "empresa",
            valores: [{id: "empresa", nombre: "Empresa"}, {id: "proyecto", nombre: "Proyecto / servicio"}]
        }, {
            clave: "estadoAcreditacion", etiqueta: "Estado",
            valores: porProyecto
                ? [{id: "Acreditada", nombre: "Acreditado"}, {id: "No acreditada", nombre: "No acreditado"}]
                : [{id: "Acreditada total", nombre: "Acreditada total"}, {id: "Acreditada parcial", nombre: "Acreditada parcial"}, {id: "No acreditada", nombre: "No acreditada"}]
        }]);

    var filas = (data.filas || []).map(function (f) {
        var clase = (f.estado === "Acreditada" || f.estado === "Acreditada total") ? "pcn-verde"
            : (f.estado === "Acreditada parcial" ? "pcn-amarillo" : (f.estado === "No acreditada" ? "pcn-rojo" : "pcn-gris"));

        return "<tr><td>" + pcnEsc(f.nombre) + "</td><td>" + pcnEsc(f.ruc) + "</td><td>" + pcnEsc(f.perfil) + "</td>"
            + (porProyecto ? "<td>" + pcnEsc(f.proyecto) + "</td>" : "")
            + "<td class='num'>" + pcnNum(f.requeridos) + "</td><td class='num'>" + pcnNum(f.cargados) + "</td>"
            + "<td class='num'>" + pcnNum(f.vb) + "</td>"
            + (porProyecto ? "" : "<td class='num'>" + (Number(f.nProyectos) > 0 ? pcnNum(f.nProyAcreditados) + " de " + pcnNum(f.nProyectos) : "-") + "</td>")
            + "<td><span class='pcn-etq " + clase + "'" + (Number(f.sinDocumentos) === 1 ? " title='No se le solicita ningún documento de empresa ni de proyecto: se considera acreditada'" : "") + ">" + (Number(f.sinDocumentos) === 1 ? "Acreditada (sin documentos solicitados)" : pcnEsc(f.estado)) + "</span></td></tr>";
    });

    var cabeceras = [{t: "Contratista"}, {t: "RUC"}, {t: "Perfil", a: "Perfil asignado a la contratista"}];

    if (porProyecto) {
        cabeceras.push({t: "Proyecto o servicio", a: "Proyecto o servicio de la contratista. \"Documentos de la empresa (sin proyecto)\" aparece solo cuando la empresa no tiene documentos de proyecto"});
    }

    cabeceras.push(
        {t: porProyecto ? "Documentos solicitados" : "Documentos de empresa y proyecto solicitados", num: 1,
            a: porProyecto ? "Documentos del proyecto o servicio más los documentos a nivel empresa, que se consideran en cada proyecto" : "Documentos que la contratista debe presentar a nivel de empresa y de proyecto"},
        {t: "Documentos ya cargados", num: 1, a: "Documentos que la contratista ya subió (con visto bueno, observados o pendientes)"},
        {t: "Documentos con visto bueno", num: 1, a: "Documentos aprobados por el evaluador"});

    if (!porProyecto) {
        cabeceras.push({t: "Proyectos o servicios acreditados", num: 1,
            a: "Proyectos o servicios de la empresa que están acreditados, sobre el total con documentos solicitados. Cada uno cuenta los documentos de la empresa más los del proyecto"});
    }

    cabeceras.push({t: "Estado de acreditación", a: porProyecto
        ? "Acreditado: tiene con visto bueno todo lo solicitado para ese proyecto o servicio, incluidos los documentos de la empresa"
        : "Acreditada total: todos sus proyectos o servicios acreditados. Acreditada parcial: al menos uno acreditado, pero no todos. No acreditada: ninguno. "
            + "Las empresas sin documentos de empresa ni de proyecto solicitados también se consideran acreditadas"});

    var nota = porProyecto
        ? "<div class='pcn-aviso'><b>Nota:</b> los documentos a nivel empresa se consideran en cada proyecto o servicio. Cada fila suma los documentos de la empresa más los de ese "
            + "proyecto, así se ve si la empresa cuenta con todo lo solicitado para esa actividad. Una empresa sin documentos de proyecto aparece en una sola fila, "
            + "\"Documentos de la empresa (sin proyecto)\". Los indicadores de arriba y el gráfico siguen siendo por empresa.</div>"
        : "";

    return h + nota + pcnTabla(cabeceras, filas) + pcnPie(data);
}

// ---------- Hoja: Consolidado detallado ----------

function pcnHtmlConsolidado(data, est) {
    if (!Number(data.totalFilas) && !est.busqueda && !est.nivelId && !est.estado && !pcnHayFiltros()) {
        return pcnVacio();
    }

    var h = pcnHerramientas(est, [
        {clave: "nivelId", etiqueta: "Nivel", valores: PCN_NIVELES},
        {clave: "estado", etiqueta: "Estado", valores: PCN_ESTADOS}
    ]);

    var filas = (data.filas || []).map(function (f) {
        return "<tr><td>" + pcnEsc(f.contratista) + "</td><td>" + pcnEsc(f.ruc) + "</td><td>" + pcnEsc(f.perfil) + "</td>"
            + "<td>" + pcnEsc(f.nivel) + "</td><td>" + pcnEsc(f.entidad) + "</td><td>" + pcnEsc(f.clave) + "</td>"
            + "<td>" + pcnEsc(f.documento) + (f.licencia ? " (" + pcnEsc(f.licencia) + ")" : "") + "</td>"
            + "<td>" + pcnEtiquetaEstado(f.estado, f.nota) + "</td>"
            + "<td>" + pcnEsc(f.fechaFin) + "</td><td>" + pcnEsc(f.fechaRegistro) + "</td><td>" + pcnEsc(f.fechaEvaluacion) + "</td>"
            + "<td class='num'>" + pcnDias(f.dias) + "</td><td class='pcn-obs'>" + pcnEsc(f.observacion) + "</td></tr>";
    });

    return h + pcnTabla([{t: "Contratista"}, {t: "RUC"}, {t: "Perfil", a: "Perfil asignado a la contratista"},
        {t: "Nivel del documento", a: "Empresa, Proyecto, Trabajador contratista, Conductor o Vehículo/Maquinaria"},
        {t: "Trabajador, vehículo o proyecto", a: "A quién corresponde el documento. Si es de nivel Empresa, se muestra la razón social"},
        {t: "N.° de documento, placa o código de proyecto", a: "Identificador de a quién corresponde el documento. Si es de nivel Empresa, se muestra el RUC"},
        {t: "Documento solicitado", a: "Tipo de documento; en conductores y vehículos incluye el tipo de licencia"},
        {t: "Estado del documento"}, {t: "Vigencia hasta", a: "Fecha en que vence el documento"},
        {t: "Fecha de registro", a: "Fecha en que se cargó el documento"}, {t: "Fecha de evaluación", a: "Fecha en que el evaluador revisó el documento"},
        {t: "Días de evaluación", num: 1, a: "Días entre el registro del documento y su evaluación"},
        {t: "Observación del evaluador"}], filas)
        + pcnPie(data);
}

// ---------- Hojas: Trabajadores y Vehículos acreditados ----------

function pcnHtmlEntidades(data, est, hoja) {
    var k = data.kpis || {}, esVeh = hoja === "vehiculos";

    if (!Number(k.total) && !est.busqueda) {
        return pcnVacio();
    }

    var plural = esVeh ? "Vehículos" : "Trabajadores";

    var h = "<div class='pcn-aviso'>" + (esVeh ? "Un vehículo o maquinaria" : "Un trabajador (incluye conductores)")
        + " está acreditado cuando todos sus documentos solicitados tienen visto bueno.</div>"
        + "<div class='pcn-kpis'>"
        + pcnKpi(pcnNum(k.total), plural)
        + pcnKpi(pcnNum(k.acreditados), plural + " acreditados")
        + pcnKpi(pcnNum(Math.max(0, Number(k.total) - Number(k.acreditados))), plural + " no acreditados")
        + pcnKpi(pcnPct(k.acreditados, k.total), "% de " + plural.toLowerCase() + " acreditados") + "</div>"
        + pcnHerramientas(est, [{
            clave: "acreditado", etiqueta: "Acreditado",
            valores: [{id: "Si", nombre: "Sí"}, {id: "No", nombre: "No"}]
        }]);

    var filas = (data.filas || []).map(function (f) {
        var si = f.acreditado === "Si";

        return "<tr><td>" + pcnEsc(f.contratista) + "</td><td>" + pcnEsc(f.ruc) + "</td><td>" + pcnEsc(f.perfil) + "</td>"
            + "<td>" + pcnEsc(f.entidad) + "</td><td>" + pcnEsc(f.clave) + "</td>"
            + "<td class='num'>" + pcnNum(f.solicitados) + "</td><td class='num'>" + pcnNum(f.conVistoBueno) + "</td>"
            + "<td><span class='pcn-etq " + (si ? "pcn-verde" : "pcn-rojo") + "'>" + (si ? "Sí" : "No") + "</span></td></tr>";
    });

    return h + pcnTabla([{t: "Contratista"}, {t: "RUC"}, {t: "Perfil", a: "Perfil asignado a la contratista"},
        {t: esVeh ? "Marca del vehículo o maquinaria" : "Nombre del trabajador"},
        {t: esVeh ? "Placa" : "N.° de documento de identidad"},
        {t: "Documentos solicitados", num: 1, a: esVeh ? "Documentos que se piden para este vehículo o maquinaria" : "Documentos que se piden a este trabajador (incluye los de conductor)"},
        {t: "Documentos con visto bueno", num: 1, a: "Documentos aprobados por el evaluador"},
        {t: esVeh ? "Vehículo acreditado" : "Trabajador acreditado", a: "Sí cuando todos sus documentos solicitados tienen visto bueno"}], filas) + pcnPie(data);
}

// ---------- Gráficos (Apache ECharts, lib/echarts) ----------

var pcnGraficosActivos = [];

// Libera los gráficos de la hoja anterior antes de pintar los nuevos
function pcnLiberarGraficos() {
    pcnGraficosActivos.forEach(function (g) {
        if (g && !g.isDisposed()) {
            g.dispose();
        }
    });

    pcnGraficosActivos = [];
}

function pcnNuevoGrafico(idContenedor, opciones) {
    var contenedor = document.getElementById(idContenedor);

    if (!contenedor) {
        return;
    }

    var grafico = echarts.init(contenedor);

    grafico.setOption(opciones);
    pcnGraficosActivos.push(grafico);
}

$(window).on("resize", function () {
    pcnGraficosActivos.forEach(function (g) {
        if (g && !g.isDisposed()) {
            g.resize();
        }
    });
});

function pcnGraficos(hoja, data) {
    pcnLiberarGraficos();

    if (typeof echarts === "undefined") {
        return;
    }

    if (hoja === "resumen") {
        var k = data.kpis || {};

        pcnNuevoGrafico("pcnGrafEstados", {
            tooltip: {trigger: "item", formatter: "{b}: <b>{c}</b> documentos ({d} %)"},
            legend: {bottom: 0},
            series: [{
                name: "Documentos", type: "pie", radius: ["45%", "68%"], center: ["50%", "44%"],
                label: {formatter: "{d} %"},
                data: [
                    {name: "Visto bueno", value: Number(k.vb) || 0, itemStyle: {color: PCN_COLOR.vb}},
                    {name: "Pendientes", value: Number(k.pen) || 0, itemStyle: {color: PCN_COLOR.pen}},
                    {name: "Observados", value: Number(k.obs) || 0, itemStyle: {color: PCN_COLOR.obs}},
                    {name: "Por registrar", value: Number(k.noreg) || 0, itemStyle: {color: PCN_COLOR.noreg}}]
            }]
        });

        var cuantas = {"Verde+": 0, "Amarillo": 0, "Rojo": 0};
        (data.categorias || []).forEach(function (c) {
            cuantas[c.categoria] = Number(c.contratistas) || 0;
        });

        pcnNuevoGrafico("pcnGrafCategorias", {
            tooltip: {trigger: "item", formatter: "{b}: <b>{c}</b> contratistas"},
            grid: {left: 40, right: 12, top: 20, bottom: 30},
            xAxis: {type: "category", data: ["Verde+ (80 % o más)", "Amarillo (50 % o más)", "Rojo (menos de 50 %)"]},
            yAxis: {type: "value", minInterval: 1, name: "Contratistas"},
            series: [{
                type: "bar", label: {show: true, position: "top"},
                data: [
                    {value: cuantas["Verde+"], itemStyle: {color: "#2e9e5b"}},
                    {value: cuantas["Amarillo"], itemStyle: {color: "#d99a0b"}},
                    {value: cuantas["Rojo"], itemStyle: {color: "#d64545"}}]
            }]
        });
    }

    if (hoja === "acreditadas") {
        var a = data.kpis || {}, totalEmp = Number(a.contratistas) || 0, ac = Number(a.acreditadas) || 0;
        var sinDocs = Number(a.sinDocumentos) || 0, acTotal = Number(a.acreditadasTotal) || 0, acParcial = Number(a.acreditadasParcial) || 0;
        var noAcred = Math.max(0, totalEmp - ac);

        var serie = function (nombre, valor, color) {
            return {
                name: nombre, type: "bar", stack: "total", data: [valor], itemStyle: {color: color},
                label: {show: valor > 0, position: "inside", color: "#fff"}
            };
        };

        pcnNuevoGrafico("pcnGrafAcred", {
            tooltip: {trigger: "item", formatter: "{a}: <b>{c}</b> empresas"},
            legend: {bottom: 0},
            grid: {left: 16, right: 16, top: 16, bottom: 48, containLabel: true},
            xAxis: {type: "value", minInterval: 1, name: "Empresas"},
            yAxis: {type: "category", data: ["Contratistas"]},
            series: [
                serie("Acreditación total", acTotal, "#2e9e5b"),
                serie("Acreditación parcial", acParcial, "#d99a0b"),
                serie("Acreditadas sin documentos solicitados", sinDocs, "#8fc9a0"),
                serie("No acreditadas", noAcred, "#d64545")]
        });
    }
}
