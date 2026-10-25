/*
 * P118 · Aviso al trabajador antes de la evaluación con IA (vista de la contratista).
 * Plan: docs/planes/2026-10-18-p118-p122-aviso-ficha-ayuda-ia.md, sección 4.3.
 *
 * La contratista ve el estado del aviso de cada trabajador, abre el aviso para imprimirlo con su constancia y carga el
 * documento firmado de uno o varios trabajadores a la vez. La contratista sale de la sesión: el servidor rechaza los
 * trabajadores que no son suyos. Los textos que vienen de la base se escapan antes de mostrarse.
 */

var paginaAvisoIaContratista = "../ayuda/ia-aviso-trabajador-v1.1.html";
var estadosAvisoIaContratista = {};

function escaparAvisoIa(texto) {
   return $("<div>").text(texto == null ? "" : String(texto)).html();
}

/** Fecha UTC de la base (aaaa-mm-dd hh:mm:ss) en hora de Lima, dd/mm/aaaa hh:mm. */
function fechaLimaAvisoIa(utc) {
   if (!utc) {
      return "";
   }
   var d = new Date(utc.replace(" ", "T") + "Z");
   if (isNaN(d.getTime())) {
      return utc;
   }
   d = new Date(d.getTime() - 5 * 60 * 60 * 1000);
   function dos(n) { return (n < 10 ? "0" : "") + n; }
   return dos(d.getUTCDate()) + "/" + dos(d.getUTCMonth() + 1) + "/" + d.getUTCFullYear() + " " +
          dos(d.getUTCHours()) + ":" + dos(d.getUTCMinutes());
}

function textoEstadoAvisoIa(e) {
   if (!e || !e.entregado) {
      return "<span class='label label-warning'>Pendiente</span>";
   }
   var medio = (e.medioPrevio == "CONSTANCIA_FIRMADA" ? "constancia firmada" : "en la plataforma");
   var texto = "<span class='label label-success'>Entregado</span> " + escaparAvisoIa(fechaLimaAvisoIa(e.fechaPrevia)) +
               " (" + medio + ", v" + escaparAvisoIa(e.versionPrevia) + ")";
   if (e.archivoPrevioId) {
      texto += " <a class='efectoLink' target='_blank' href='" + URL + "/contratista/aviso_ia/archivo?id=" +
               parseInt(e.archivoPrevioId) + "'><i class='fa fa-download'></i></a>";
   }
   if (e.desfavorablePendiente) {
      texto += "<br><span class='label label-danger'>Volver a entregar: resultado desfavorable</span>";
   }
   return texto;
}

/** Ventana principal: estado de cada trabajador y carga de la constancia firmada. */
function verAvisoIaContratista() {
   if ($("#modalAvisoIaContratista").length == 0) {
      $("body").append(
         "<div class='modal fade' id='modalAvisoIaContratista' tabindex='-1' role='dialog'>" +
            "<div class='modal-dialog modal-lg' role='document'>" +
               "<div class='modal-content'>" +
                  "<div class='modal-header'>" +
                     "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
                     "<h4 class='modal-title'>Aviso a los trabajadores sobre la revisión con IA</h4>" +
                  "</div>" +
                  "<div class='modal-body' style='font-size:13px;'>" +
                     "<p>La empresa no puede revisar con IA la documentación de un trabajador hasta que conste que recibió este aviso. " +
                     "El trabajador puede leerlo al ingresar a la plataforma, o usted puede entregárselo impreso y cargar aquí la " +
                     "constancia firmada (un mismo archivo puede incluir a varios trabajadores).</p>" +
                     "<div id='fechaBloqueoAvisoIa' class='alert alert-warning' style='display:none;padding:8px 12px;'></div>" +
                     "<p><a class='btn btn-default btn-sm' id='btnImprimirAvisoIa' target='_blank' rel='noopener'>" +
                        "<i class='fa fa-print'></i> Abrir el aviso para imprimir</a></p>" +
                     "<div style='max-height:45vh;overflow:auto;'>" +
                        "<table class='table table-condensed table-bordered' id='tblAvisoIaContratista'>" +
                           "<thead><tr><th style='width:30px;'><input type='checkbox' id='chkTodosAvisoIa'></th>" +
                           "<th>Trabajador</th><th>Documento</th><th>Aviso</th></tr></thead><tbody></tbody>" +
                        "</table>" +
                     "</div>" +
                     "<div style='margin-top:10px;'>" +
                        "<label>Constancia firmada de los trabajadores marcados (PDF, JPG o PNG, hasta 15 MB)</label>" +
                        "<input type='file' id='fileConstanciaAvisoIa' accept='.pdf,.jpg,.jpeg,.png'>" +
                        "<div id='msgAvisoIaContratista' style='margin-top:6px;'></div>" +
                     "</div>" +
                  "</div>" +
                  "<div class='modal-footer'>" +
                     "<button type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>" +
                     "<button type='button' class='btn btn-success' id='btnCargarConstanciaAvisoIa'>" +
                        "<i class='fa fa-upload'></i> Cargar constancia</button>" +
                  "</div>" +
               "</div>" +
            "</div>" +
         "</div>");
      $("#chkTodosAvisoIa").on("change", function () {
         $("#tblAvisoIaContratista tbody input[type=checkbox]").prop("checked", $(this).is(":checked"));
      });
      $("#btnCargarConstanciaAvisoIa").on("click", cargarConstanciaAvisoIa);
   }
   $("#btnImprimirAvisoIa").attr("href", paginaAvisoIaContratista);
   $("#msgAvisoIaContratista").text("");
   $("#fileConstanciaAvisoIa").val("");
   $("#chkTodosAvisoIa").prop("checked", false);
   pintarTablaAvisoIaContratista();
   $("#modalAvisoIaContratista").modal("show");
   cargarEstadosAvisoIaContratista();
}

function pintarTablaAvisoIaContratista() {
   var cuerpo = $("#tblAvisoIaContratista tbody").empty();
   var lista = (typeof listFullTrabajadoresContratista !== "undefined" && listFullTrabajadoresContratista) ? listFullTrabajadoresContratista : [];
   lista.forEach(function (t) {
      var nombre = ((t.nombre || "") + " " + (t.apellido || "")).trim();
      cuerpo.append(
         "<tr>" +
            "<td><input type='checkbox' value='" + parseInt(t.id) + "'></td>" +
            "<td>" + escaparAvisoIa(nombre) + "</td>" +
            "<td>" + escaparAvisoIa(t.nroDocumento) + "</td>" +
            "<td id='tdAvisoIa" + parseInt(t.id) + "'>" + textoEstadoAvisoIa(estadosAvisoIaContratista[t.id]) + "</td>" +
         "</tr>");
   });
}

/** Pide el estado en bloques de 500 (el máximo que acepta el servidor por consulta). */
function cargarEstadosAvisoIaContratista() {
   var lista = (typeof listFullTrabajadoresContratista !== "undefined" && listFullTrabajadoresContratista) ? listFullTrabajadoresContratista : [];
   var ids = lista.map(function (t) { return parseInt(t.id); });
   for (var i = 0; i < ids.length; i += 500) {
      callAjaxPost(URL + '/contratista/aviso_ia/estado', ids.slice(i, i + 500), function (data) {
         if (data.CODE_RESPONSE == "05") {
            if (data.pagina) {
               paginaAvisoIaContratista = data.pagina;
               $("#btnImprimirAvisoIa").attr("href", paginaAvisoIaContratista);
            }
            mostrarFechaBloqueoAvisoIa(data.bloqueoDesde);
            (data.list || []).forEach(function (e) {
               estadosAvisoIaContratista[e.trabajadorContratistaId] = e;
               $("#tdAvisoIa" + parseInt(e.trabajadorContratistaId)).html(textoEstadoAvisoIa(e));
            });
         }
      });
   }
}

/** Transición: mientras el bloqueo no rige, se avisa desde qué día se exigirá la constancia. */
function mostrarFechaBloqueoAvisoIa(desde) {
   var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(desde || "");
   if (!p) {
      $("#fechaBloqueoAvisoIa").hide();
      return;
   }
   $("#fechaBloqueoAvisoIa").text("Desde el " + p[3] + "/" + p[2] + "/" + p[1] + ", la documentación de un trabajador sin " +
      "esta constancia no podrá revisarse con IA. Cárguela antes de esa fecha.").show();
}

function cargarConstanciaAvisoIa() {
   var mensaje = $("#msgAvisoIaContratista");
   var ids = $("#tblAvisoIaContratista tbody input[type=checkbox]:checked").map(function () {
      return parseInt($(this).val());
   }).get();
   var archivo = $("#fileConstanciaAvisoIa")[0].files[0];
   if (ids.length == 0) {
      mensaje.css("color", "#c0392b").text("Marque al menos un trabajador.");
      return;
   }
   if (!archivo) {
      mensaje.css("color", "#c0392b").text("Adjunte la constancia firmada.");
      return;
   }
   if (archivo.size > 15 * 1024 * 1024) {
      mensaje.css("color", "#c0392b").text("La constancia no puede superar los 15 MB.");
      return;
   }
   var datos = new FormData();
   datos.append("trabajadores", ids.join(","));
   datos.append("archivo", archivo);
   var boton = $("#btnCargarConstanciaAvisoIa").prop("disabled", true);
   mensaje.css("color", "#44566a").text("Cargando...");
   $.ajax({
      url: URL + "/contratista/aviso_ia/constancia", type: "post", data: datos, processData: false, contentType: false,
      xhrFields: { withCredentials: true },
      success: function (data) {
         boton.prop("disabled", false);
         if (data && data.CODE_RESPONSE === "05") {
            mensaje.css("color", "#1e8449").text("Constancia registrada para " + data.registrados + " trabajador(es).");
            $("#fileConstanciaAvisoIa").val("");
            cargarEstadosAvisoIaContratista();
            return;
         }
         mensaje.css("color", "#c0392b").text((data && data.mensaje) || "No se pudo registrar la constancia.");
      },
      error: function (xhr) {
         boton.prop("disabled", false);
         var m = (xhr && xhr.responseJSON && xhr.responseJSON.mensaje) ? xhr.responseJSON.mensaje : "No se pudo registrar la constancia.";
         mensaje.css("color", "#c0392b").text(m);
      }
   });
}
