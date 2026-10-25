/*
 * P118 · Aviso al trabajador antes de la evaluación con IA (vista del trabajador de contratista).
 * Plan: docs/planes/2026-10-18-p118-p122-aviso-ficha-ayuda-ia.md, sección 4.3.
 *
 * Al entrar, el servidor dice si hay que mostrarle el aviso (nunca se le entregó, o tuvo un resultado desfavorable
 * después). Se muestra en una ventana y, al pulsar «He leído el aviso», el servidor registra la entrega con la fecha,
 * la hora, la versión y la IP; quién es el trabajador sale de su sesión. También queda en el menú para leerlo cuando quiera.
 */

var paginaAvisoIaTrabajador = "../ayuda/ia-aviso-trabajador-v1.1.html";

/** Se llama al terminar de armar el menú del trabajador (main.js). */
function revisarAvisoIaTrabajador() {
   agregarOpcionMenuAvisoIa();
   callAjaxPost(URL + '/contratista/aviso_ia/trabajador', {}, function (data) {
      if (data.CODE_RESPONSE == "05") {
         if (data.pagina) {
            paginaAvisoIaTrabajador = data.pagina;
         }
         if (data.mostrar) {
            verAvisoIaTrabajador(true);
         }
      }
   });
}

/** Opción fija del menú para volver a leer el aviso. */
function agregarOpcionMenuAvisoIa() {
   if ($("#liMenuTrabajadorAvisoIa").length > 0) {
      return;
   }
   var opcion = "<li class='list-group-item' id='liMenuTrabajadorAvisoIa' onclick='verAvisoIaTrabajador(false)'>" +
                   "<i class='fa fa-info-circle' style='width:16px;' aria-hidden='true'><span></span></i>" +
                   "Aviso sobre la revisión de su documentación" +
                "</li>";
   $(".divListModulos").find("ul").append(opcion);
   $("#menuFigureti").find("ul").append(opcion);
}

/** Muestra el aviso. Con conConstancia, el botón registra que lo leyó. */
function verAvisoIaTrabajador(conConstancia) {
   if ($("#modalAvisoIaTrabajador").length == 0) {
      $("body").append(
         "<div class='modal fade' id='modalAvisoIaTrabajador' tabindex='-1' role='dialog' data-backdrop='static'>" +
            "<div class='modal-dialog modal-lg' role='document'>" +
               "<div class='modal-content'>" +
                  "<div class='modal-header'>" +
                     "<h4 class='modal-title'>Aviso sobre la revisión de su documentación</h4>" +
                  "</div>" +
                  "<div class='modal-body' style='padding:0;'>" +
                     "<iframe id='iframeAvisoIaTrabajador' title='Aviso sobre la revisión de su documentación' " +
                        "style='width:100%;height:60vh;border:0;'></iframe>" +
                  "</div>" +
                  "<div class='modal-footer'>" +
                     "<button type='button' class='btn btn-default' id='btnCerrarAvisoIa' data-dismiss='modal'>Cerrar</button>" +
                     "<button type='button' class='btn btn-success' id='btnLeidoAvisoIa'>" +
                        "<i class='fa fa-check'></i> He leído el aviso" +
                     "</button>" +
                  "</div>" +
               "</div>" +
            "</div>" +
         "</div>");
      $("#btnLeidoAvisoIa").on("click", registrarAvisoIaLeido);
   }
   $("#iframeAvisoIaTrabajador").attr("src", paginaAvisoIaTrabajador);
   // Si hay que registrar la entrega, no se cierra sin pulsar «He leído el aviso».
   $("#btnCerrarAvisoIa").toggle(!conConstancia);
   $("#btnLeidoAvisoIa").toggle(conConstancia);
   $("#modalAvisoIaTrabajador").modal({ backdrop: (conConstancia ? "static" : true), keyboard: !conConstancia, show: true });
}

function registrarAvisoIaLeido() {
   $("#btnLeidoAvisoIa").prop("disabled", true);
   callAjaxPost(URL + '/contratista/aviso_ia/visto', {}, function (data) {
      $("#btnLeidoAvisoIa").prop("disabled", false);
      if (data.CODE_RESPONSE == "05") {
         $("#modalAvisoIaTrabajador").modal("hide");
      } else {
         alert("No se pudo registrar. Intente de nuevo.");
      }
   });
}
