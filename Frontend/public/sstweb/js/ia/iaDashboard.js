/**
 * Módulo IA (Partida 37) — Dashboard de uso por empresa (sección por defecto de ia.html).
 * Muestra KPIs (evaluaciones, tokens, estados), un gráfico mensual y el detalle/trazabilidad
 * de las evaluaciones de la empresa de la sesión. El empresaId lo fuerza el backend desde la sesión.
 *
 * Degrada con gracia: empresa sin evaluaciones => KPIs en 0, tabla vacía, gráfico vacío;
 * si HighCharts no está cargado, se omite el gráfico sin romper el resto.
 */

var listDetalleIa = []; // detalle actual (para el modal de observaciones)

/** Formatea un entero con separador de miles. */
function fmtNumIa(n) { return (n == null ? 0 : n).toLocaleString("es-PE"); }

/** YYYY-MM-DD de una fecha. */
function fechaYmdIa(d) {
   var m = ("0" + (d.getMonth() + 1)).slice(-2);
   var dd = ("0" + d.getDate()).slice(-2);
   return d.getFullYear() + "-" + m + "-" + dd;
}

/** Badge de estado (mismos colores que el resto del módulo IA). */
function badgeEstadoDashIa(estado) {
   switch (estado) {
      case "CUMPLE":        return "<span class='label label-success'>CUMPLE</span>";
      case "NO_CUMPLE":     return "<span class='label label-danger'>NO CUMPLE</span>";
      case "SIN_CRITERIOS": return "<span class='label label-default'>Sin criterios</span>";
      case "ERROR":         return "<span class='label label-warning'>Error</span>";
      default:              return "<span class='label label-default'>" + (estado || "—") + "</span>";
   }
}

/** Punto de entrada: fija fechas por defecto (si vacías) y carga las 3 secciones. */
function cargarDashboardIa() {
   if (!$("#fechaFinDashIa").val()) {
      var hoy = new Date();
      var desde = new Date(); desde.setDate(desde.getDate() - 90);
      $("#fechaIniDashIa").val(fechaYmdIa(desde));
      $("#fechaFinDashIa").val(fechaYmdIa(hoy));
   }
   cargarResumenIa();
   cargarResumenTiposIa();
   cargarSerieIa();
   cambiarDetalleIa();
}

/** Desglose por tipo de documento (P73): cuánto uso/tokens consumió cada documento evaluado. */
function cargarResumenTiposIa() {
   callAjaxPost(URL + '/ia/evaluacion/dashboard/resumen-tipos', filtroDashIa(), function (data) {
      var list = (data && data.CODE_RESPONSE == "05" && data.list) ? data.list : [];
      var cont = $("#tiposIa");
      if (!list.length) { cont.empty(); return; }
      var h = "<h4 style='margin:6px 0;'>Uso por tipo de documento</h4>" +
         "<table class='table table-bordered table-condensed' style='margin-bottom:0;'>" +
         "<thead><tr>" +
            "<th>Documento</th>" +
            "<th style='text-align:right;'>Usos de IA</th>" +
            "<th style='text-align:right;'>Tokens total</th>" +
            "<th style='text-align:right;'>Cumple</th>" +
            "<th style='text-align:right;'>No cumple</th>" +
            "<th style='text-align:right;'>Sin criterios</th>" +
            "<th style='text-align:right;'>Errores</th>" +
         "</tr></thead><tbody>";
      list.forEach(function (t) {
         h += "<tr>" +
            "<td>" + (t.tipoDocumentoNombre || "—") + "</td>" +
            "<td style='text-align:right;'>" + fmtNumIa(t.totalEvaluaciones) + "</td>" +
            "<td style='text-align:right;'>" + fmtNumIa(t.tokensTotal) + "</td>" +
            "<td style='text-align:right;'>" + fmtNumIa(t.countCumple) + "</td>" +
            "<td style='text-align:right;'>" + fmtNumIa(t.countNoCumple) + "</td>" +
            "<td style='text-align:right;'>" + fmtNumIa(t.countSinCriterios) + "</td>" +
            "<td style='text-align:right;'>" + fmtNumIa(t.countError) + "</td>" +
         "</tr>";
      });
      h += "</tbody></table>";
      cont.html(h);
   }, function () {}, null, null, null, false);
}

function filtroDashIa() {
   return { fechaInicio: $("#fechaIniDashIa").val(), fechaFin: $("#fechaFinDashIa").val() };
}

/**
 * Carga el detalle según la capacidad elegida en el selector "Ver detalle de:".
 * Hoy solo "evaluaciones"; a futuro se agregan opciones (inspecciones, capacitaciones…), cada una
 * con su propia consulta/tabla. La tabla solo se muestra cuando hay una opción seleccionada.
 */
function cambiarDetalleIa() {
   var tipo = $("#selDetalleIa").val();
   if (tipo === "evaluaciones") {
      $("#wrapperDetalleIa").show();
      cargarDetalleIa();
   } else {
      $("#wrapperDetalleIa").hide();
   }
}

/** Tarjeta KPI. */
function kpiCardIa(titulo, valor, color) {
   return "<div class='col-sm-3' style='margin-bottom:8px;'>" +
             "<div style='border:1px solid #e0e0e0;border-radius:6px;padding:10px 12px;background:#fafafa;'>" +
                "<div style='font-size:12px;color:#888;'>" + titulo + "</div>" +
                "<div style='font-size:22px;font-weight:bold;color:" + (color || "#2E5496") + ";'>" + valor + "</div>" +
             "</div>" +
          "</div>";
}

/** KPIs: arriba métricas de nivel-módulo; abajo, un bloque por capacidad (hoy: Evaluación de documentos). */
function cargarResumenIa() {
   callAjaxPost(URL + '/ia/evaluacion/dashboard/resumen', filtroDashIa(), function (data) {
      var r = (data && data.CODE_RESPONSE == "05" && data.resumen) ? data.resumen : {};
      // Nivel módulo (capability-agnostic): uso total + consumo de tokens.
      var general = "<div class='row'>" +
         kpiCardIa("Usos de IA", fmtNumIa(r.totalEvaluaciones), "#2E5496") +
         kpiCardIa("Tokens totales", fmtNumIa(r.tokensTotal), "#0E9290") +
         kpiCardIa("Tokens entrada", fmtNumIa(r.tokensEntrada), "#888") +
         kpiCardIa("Tokens salida", fmtNumIa(r.tokensSalida), "#888") +
      "</div>";
      // Por capacidad (hoy solo "Evaluación de documentos"); a futuro se agregan más bloques.
      var evalHead = "<div style='margin:8px 0 4px;font-weight:bold;color:#555;border-top:1px solid #eee;padding-top:8px;'>Evaluación de documentos</div>";
      var evalRow = "<div class='row'>" +
         kpiCardIa("Cumple", fmtNumIa(r.countCumple), "#3c763d") +
         kpiCardIa("No cumple", fmtNumIa(r.countNoCumple), "#a94442") +
         kpiCardIa("Sin criterios", fmtNumIa(r.countSinCriterios), "#777") +
         kpiCardIa("Errores", fmtNumIa(r.countError), "#8a6d3b") +
      "</div>";
      $("#kpisIa").html(general + evalHead + evalRow);
   }, function () {}, null, null, null, false);
}

/** Serie mensual → gráfico HighCharts (si está disponible). */
function cargarSerieIa() {
   callAjaxPost(URL + '/ia/evaluacion/dashboard/serie', filtroDashIa(), function (data) {
      var list = (data && data.CODE_RESPONSE == "05" && data.list) ? data.list : [];
      if (typeof Highcharts === "undefined") {
         $("#chartIaUso").hide(); // sin librería de gráficos: se omite (KPIs y tabla siguen funcionando)
         return;
      }
      $("#chartIaUso").show();
      var cats = list.map(function (s) { return s.periodo; });
      var evals = list.map(function (s) { return s.totalEvaluaciones || 0; });
      var tokens = list.map(function (s) { return s.tokensTotal || 0; });
      Highcharts.chart("chartIaUso", {
         title: { text: "Uso de IA por mes" },
         xAxis: { categories: cats },
         yAxis: [ { title: { text: "Evaluaciones" }, allowDecimals: false },
                  { title: { text: "Tokens" }, opposite: true } ],
         tooltip: { shared: true },
         credits: { enabled: false },
         series: [
            { name: "Evaluaciones", type: "column", yAxis: 0, data: evals, color: "#2E5496" },
            { name: "Tokens", type: "line", yAxis: 1, data: tokens, color: "#0E9290" }
         ]
      });
   }, function () {}, null, null, null, false);
}

/** Detalle/trazabilidad de la empresa actual. */
function cargarDetalleIa() {
   callAjaxPost(URL + '/ia/evaluacion/dashboard/detalle-empresa', filtroDashIa(), function (data) {
      listDetalleIa = (data && data.CODE_RESPONSE == "05" && data.list) ? data.list : [];
      poblarFiltrosDetalleIa();
      renderDetalleIa();
   }, function () {}, null, null, null, false);
}

/** Arma las opciones de los filtros del detalle a partir de los datos cargados (P75). */
function poblarFiltrosDetalleIa() {
   function opciones(sel, etiquetaTodos, valores) {
      var s = $(sel);
      s.empty().append("<option value=''>" + etiquetaTodos + "</option>");
      valores.sort().forEach(function (v) { s.append($("<option>").val(v).text(v)); });
   }
   function unicos(campo) {
      var m = {};
      listDetalleIa.forEach(function (d) { if (d[campo]) { m[d[campo]] = 1; } });
      return Object.keys(m);
   }
   opciones("#fDashDocIa", "Documento: todos", unicos("tipoDocumentoNombre"));
   opciones("#fDashEstadoIa", "Estado: todos", unicos("estado"));
   opciones("#fDashContraIa", "Contratista: todos", unicos("contratistaNombre"));
   $("#fDashTrabIa").val("");
}

/** Filas del detalle que pasan los filtros, con su índice original (para el modal de observaciones). */
function filtrarDetalleIa() {
   var doc = $("#fDashDocIa").val() || "", est = $("#fDashEstadoIa").val() || "",
       con = $("#fDashContraIa").val() || "", trab = ($("#fDashTrabIa").val() || "").toLowerCase();
   var out = [];
   listDetalleIa.forEach(function (d, i) {
      if (doc && d.tipoDocumentoNombre !== doc) { return; }
      if (est && d.estado !== est) { return; }
      if (con && d.contratistaNombre !== con) { return; }
      if (trab && String(d.trabajadorNombre || "").toLowerCase().indexOf(trab) < 0) { return; }
      out.push({ d: d, i: i });
   });
   return out;
}

function renderDetalleIa() {
   var tbody = $("#tblDetalleIa tbody");
   tbody.empty();
   var filas = filtrarDetalleIa();
   $("#fDashContadorIa").text("Mostrando " + filas.length + " de " + listDetalleIa.length);
   if (!filas.length) {
      tbody.append("<tr><td colspan='9' style='text-align:center;color:#999;'>Sin evaluaciones" +
                   (listDetalleIa.length ? " con los filtros aplicados." : " en el rango seleccionado.") + "</td></tr>");
      return;
   }
   filas.forEach(function (f) {
      var d = f.d;
      tbody.append(
         "<tr>" +
            "<td>" + (d.fecha || "—") + "</td>" +
            "<td>" + (d.tipoDocumentoNombre || "—") + "</td>" +
            "<td>" + (d.trabajadorNombre || "—") + "</td>" +
            "<td>" + (d.contratistaNombre || "—") + "</td>" +
            "<td>" + (d.proyectoNombre || "—") + "</td>" +
            "<td>" + (d.usuarioNombre || "—") + "</td>" +
            "<td>" + badgeEstadoDashIa(d.estado) + "</td>" +
            "<td style='text-align:right;'>" + fmtNumIa(d.tokensTotal) + "</td>" +
            "<td><button class='btn btn-default btn-xs' title='Ver observaciones' onclick='verDetalleObsIa(" + f.i + ")'><i class='fa fa-eye'></i></button></td>" +
         "</tr>");
   });
}

/** Exporta el detalle FILTRADO a un archivo que Excel abre directamente. */
function exportarDetalleIa() {
   var filas = filtrarDetalleIa();
   var html = "<table><tr><th>Fecha</th><th>Documento</th><th>Trabajador</th><th>Contratista</th>" +
              "<th>Proyecto</th><th>Usuario</th><th>Estado</th><th>Tokens</th></tr>";
   filas.forEach(function (f) {
      var d = f.d;
      html += "<tr><td>" + (d.fecha || "") + "</td><td>" + (d.tipoDocumentoNombre || "") + "</td><td>" +
              (d.trabajadorNombre || "") + "</td><td>" + (d.contratistaNombre || "") + "</td><td>" +
              (d.proyectoNombre || "") + "</td><td>" + (d.usuarioNombre || "") + "</td><td>" +
              (d.estado || "") + "</td><td>" + (d.tokensTotal || 0) + "</td></tr>";
   });
   html += "</table>";
   var blob = new Blob(["﻿" + html], { type: "application/vnd.ms-excel" });
   var a = document.createElement("a");
   a.download = "detalle_evaluaciones_IA.xls";
   // constantes.js declara la variable global URL (dirección del backend), que tapa window.URL del navegador:
   // se usa el objeto que de verdad tenga createObjectURL y, si no hay ninguno, un data URL.
   var api = [window.URL, window.webkitURL].filter(function (u) { return u && typeof u.createObjectURL === "function"; })[0];
   if (api) {
      a.href = api.createObjectURL(blob);
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { api.revokeObjectURL(a.href); }, 1000);
      return;
   }
   var lector = new FileReader();
   lector.onload = function () {
      a.href = lector.result;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
   };
   lector.readAsDataURL(blob);
}

/** Modal con las observaciones de una fila del detalle. */
function verDetalleObsIa(index) {
   var d = listDetalleIa[index];
   if (!d) { return; }
   $("#modalDetalleIaMeta").html(
      badgeEstadoDashIa(d.estado) +
      " <small class='text-muted'>" + (d.tipoDocumentoNombre ? d.tipoDocumentoNombre + " · " : "") + (d.trabajadorNombre || "") +
      (d.fecha ? " · " + d.fecha : "") +
      (d.tokensTotal != null ? " · " + fmtNumIa(d.tokensTotal) + " tokens" : "") + "</small>");
   $("#modalDetalleIaTexto").html(renderMdDashIa(d.resultadoResumen));
   $("#modalDetalleIa").modal("show");
}

/**
 * Render Markdown liviano (sin dependencias) para las observaciones de la IA.
 * Soporta encabezados, negrita, listas, separador y tablas. Escapa HTML primero.
 */
function renderMdDashIa(md) {
   if (!md || !md.trim()) { return "<em>Sin observaciones.</em>"; }
   function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
   function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
   function splitRow(l) { return l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (c) { return c.trim(); }); }
   var lines = md.replace(/\r\n/g, "\n").split("\n");
   var out = [];
   var i = 0;
   while (i < lines.length) {
      var line = lines[i];
      if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
         var header = splitRow(line); i += 2;
         var t = "<table><thead><tr>";
         header.forEach(function (h) { t += "<th>" + inline(h) + "</th>"; });
         t += "</tr></thead><tbody>";
         while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
            var cells = splitRow(lines[i]); t += "<tr>";
            cells.forEach(function (c) { t += "<td>" + inline(c) + "</td>"; });
            t += "</tr>"; i++;
         }
         t += "</tbody></table>"; out.push(t); continue;
      }
      var hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm) { out.push("<div class='hIa hIa" + hm[1].length + "'>" + inline(hm[2]) + "</div>"); i++; continue; }
      if (/^\s*---+\s*$/.test(line)) { out.push("<hr>"); i++; continue; }
      if (/^\s*[-*]\s+/.test(line)) {
         var items = [];
         while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
            items.push("<li>" + inline(lines[i].replace(/^\s*[-*]\s+/, "")) + "</li>"); i++;
         }
         out.push("<ul>" + items.join("") + "</ul>"); continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }
      out.push("<p>" + inline(line) + "</p>"); i++;
   }
   return out.join("");
}

/** Ayuda del DASHBOARD (cómo leer el tablero de uso). Partida 37, opción A: guía asistida. */
function verAyudaDashboardIa() {
   $("#modalAyudaIaTitulo").text("Cómo leer el Dashboard de uso");
   $("#modalAyudaIaBody").html(
      "<p>El <strong>Dashboard de uso</strong> muestra cómo tu empresa está usando las capacidades de Inteligencia Artificial de GOSST, " +
      "con trazabilidad y consumo de tokens.</p>" +
      "<ul>" +
         "<li><strong>Filtro de fechas:</strong> ajusta el rango (Desde / Hasta) y pulsa <strong>Aplicar</strong> para recalcular todo.</li>" +
         "<li><strong>KPIs:</strong> total de evaluaciones, consumo de tokens (entrada / salida / total) y conteo por estado (Cumple / No cumple / Sin criterios / Error).</li>" +
         "<li><strong>Gráfico:</strong> evolución mensual de evaluaciones y tokens.</li>" +
         "<li><strong>Ver detalle de:</strong> elige qué detalle revisar (hoy «Evaluaciones»). La tabla lista cada evaluación con su trabajador, el usuario que la ejecutó, el estado y los tokens; el ícono del ojo abre las observaciones.</li>" +
      "</ul>" +
      "<p>Qué hace la evaluación con IA, cómo leer cada resultado, quién decide y qué datos se envían: " +
         "<a href='" + PAGINA_AYUDA_EVALUACION_IA + "' target='_blank' rel='noopener'>ayuda de la evaluación con IA</a>.</p>" +
      "<hr>" +
      "<p class='text-muted' style='font-size:12px;'>Este tablero crecerá a medida que se integren más capacidades de IA al sistema (p. ej. IPERC, inspecciones), que aparecerán como nuevas opciones de detalle.</p>");
   $("#modalAyudaIa").modal("show");
}

/** P122: ayuda de la evaluación con IA, versionada en ayuda/ia-evaluacion.html (estática, sin sesión). */
var PAGINA_AYUDA_EVALUACION_IA = "../ayuda/ia-evaluacion.html";

/** Ayuda de la EVALUACIÓN: muestra la página versionada (qué hace, cómo leer el resultado, quién decide, qué datos se
 *  envían y cómo configurar los criterios). Antes era un texto fijo aquí; P122 lo pasó a la página para tener una sola fuente. */
function verAyudaEvaluacionIa() {
   $("#modalAyudaIaTitulo").text("Evaluación de documentos con IA");
   $("#modalAyudaIaBody").html(
      "<iframe title='Ayuda de la evaluación con IA' src='" + PAGINA_AYUDA_EVALUACION_IA + "' " +
         "style='width:100%;height:58vh;border:0;'></iframe>" +
      "<p style='margin:6px 0 0;'><a href='" + PAGINA_AYUDA_EVALUACION_IA + "' target='_blank' rel='noopener'>Abrir en otra pestaña</a></p>");
   $("#modalAyudaIa").modal("show");
}
