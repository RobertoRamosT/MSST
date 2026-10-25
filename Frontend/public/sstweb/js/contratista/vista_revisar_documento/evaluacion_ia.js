/*
 * Módulo IA (Partida 36 + P73) — Evaluación con IA en la pantalla "Evaluación general".
 * Dos anclas por fila:
 *   - Hoja de vida (Partida 36): renderer agregarFilaHojaVidaVersionDos → POST /ia/evaluacion/evaluar
 *   - Documentos de examen (P73: EPPs, habilitación médica, alto riesgo): renderer
 *     agregarFilaExamenesVersionDos → POST /ia/evaluacion/evaluar-examen { contratistaHasExamenId, proyectoId }
 *
 * - Badge de estado: Sin evaluar → Evaluando… → CUMPLE / NO CUMPLE / Error. Click en el badge → modal de observaciones.
 * - Al cargar la pantalla: POST /ia/evaluacion/resultados y /resultados-examen (batch) para pintar los badges.
 * La IA SUGIERE; el revisor confirma con el dropdown "Visto bueno" existente (no se sobrescribe).
 */

// resultados de IA por hojaVidaId (para el modal): { estado, resultadoResumen, fecha, modelo }
var mapResultadosIa = {};

// resultados de IA por documento de examen (contratistaHasExamenId)
var mapResultadosIaExamen = {};

// Tipos de documento de examen (tipo_examen_contratista) con evaluación IA habilitada en el front.
// Se amplía al implementar cada documento del paquete P73-P75 (además la empresa debe tener config del tipo).
var TIPOS_EVAL_IA_EXAMEN = [8, 79, 15]; // 8 = EPP · 79 = Habilitación médica por clínica · 15 = Certificado de alto riesgo

// Las opciones de IA en Hoja de vida solo se muestran si la empresa tiene el módulo IA (menu_id 40) habilitado
// (es decir, NO está en su lista de "Módulos Invisibles"). Se verifica una vez y se cachea.
var MODULO_IA_ID = "40";
var moduloIaActivo = false;
var moduloIaVerificado = false;

/** Verifica (vía /empresa/id) si la empresa actual tiene habilitado el módulo IA. Cachea el resultado.
 *  FAIL-SAFE: si la consulta falla o la respuesta no trae la empresa, se asume módulo INACTIVO
 *  (los bloques IA nacen ocultos y solo se muestran con confirmación positiva — antes era al revés
 *  y una empresa con el módulo invisible podía ver los botones si su perfil no alcanzaba /empresa/id). */
function verificarModuloIaActivo(callback) {
   if (moduloIaVerificado) { callback(); return; }
   var dataParam = { idCompany: parseInt(getSession("gestopcompanyid")) };
   callAjaxPost(URL + '/empresa/id', dataParam, function (data) {
      if (data && data.empresa) {
         var invis = data.empresa.modulosInvisibleId
            ? String(data.empresa.modulosInvisibleId).split(",") : [];
         moduloIaActivo = invis.indexOf(MODULO_IA_ID) === -1; // activo si NO está en la lista de invisibles
      } else {
         moduloIaActivo = false; // respuesta sin empresa: no confirmado => inactivo
      }
      moduloIaVerificado = true;
      callback();
   }, function () {
      moduloIaActivo = false; // error en la consulta: no confirmado => inactivo
      moduloIaVerificado = true;
      callback();
   }, null, null, null, false);
}

/** HTML del bloque IA (badge + botón) que se inyecta en la celda Detalle de cada fila de hoja de vida. */
function getBloqueEvaluacionIa(hojaVidaId) {
   return "<div class='bloqueEvalIa' style='margin-top:6px;display:none;'>" +
             "<span id='iaBadge_" + hojaVidaId + "'>" + badgeEvalIaHtml(null) + "</span> " +
             "<span id='iaChip_" + hojaVidaId + "'></span> " +
             "<button type='button' id='iaBtn_" + hojaVidaId + "' class='btn btn-info btn-xs' " +
                "title='Evaluar la hoja de vida con inteligencia artificial' onclick='evaluarConIa(" + hojaVidaId + ")'>" +
                "✨ Evaluar" +
             "</button>" +
             botonAyudaIaHtml() +
             "<div id='iaAviso_" + hojaVidaId + "' style='margin-top:3px;font-size:11px;'></div>" +
          "</div>";
}

/** Chip con la cantidad de evaluaciones de la fila. Solo se muestra si hubo re-evaluaciones (n > 1).
 *  Click → historial. Con 1 sola evaluación no se muestra (el badge ya permite ver esa única observación).
 *  fnHist (opcional): función onclick; por defecto la de hoja de vida. */
function chipHistorialIaHtml(hojaVidaId, n, fnHist) {
   if (!n || n < 2) { return ""; }
   fnHist = fnHist || "verHistorialIa";
   return "<span class='label label-primary' style='cursor:pointer;' title='Ver historial de evaluaciones' " +
          "onclick='" + fnHist + "(" + hojaVidaId + ")'>🕘 " + n + "</span>";
}

/** Devuelve el HTML del badge segun el estado. El icono ✨ indica que es resultado de IA.
 *  fnVer (opcional): función onclick del badge; por defecto la de hoja de vida. */
function badgeEvalIaHtml(estado, hojaVidaId, fnVer) {
   fnVer = fnVer || "verObservacionesIa";
   var mapRef = (fnVer == "verObservacionesIaExamen") ? mapResultadosIaExamen : mapResultadosIa;
   var clickable = (hojaVidaId != null &&
      (estado == "CUMPLE" || estado == "NO_CUMPLE" || estado == "SIN_CRITERIOS" || estado == "ERROR" || (estado == null && mapRef[hojaVidaId])));
   var onclick = clickable ? " style='cursor:pointer;' onclick='" + fnVer + "(" + hojaVidaId + ")' title='Ver observaciones'" : "";
   var ia = "✨ ";

   switch (estado) {
      case "CUMPLE":
         return "<span class='label label-success'" + onclick + ">" + ia + "CUMPLE</span>";
      case "NO_CUMPLE":
         return "<span class='label label-danger'" + onclick + ">" + ia + "NO CUMPLE</span>";
      case "SIN_CRITERIOS":
         return "<span class='label label-default'" + onclick + ">" + ia + "Sin criterios</span>";
      case "ERROR":
         return "<span class='label label-warning'" + onclick + ">" + ia + "Error</span>";
      case "EVALUANDO":
         return "<span class='label label-info'>" + ia + "Evaluando…</span>";
      default:
         return "<span class='label label-default'>" + ia + "Sin evaluar</span>";
   }
}

/** Dispara la evaluacion con IA de una fila de hoja de vida. */
function evaluarConIa(hojaVidaId) {
   if (typeof proyectoObj === "undefined" || !proyectoObj || !proyectoObj.id) {
      alert("No se pudo determinar el proyecto en contexto.");
      return;
   }

   var badge = $("#iaBadge_" + hojaVidaId);
   var boton = $("#iaBtn_" + hojaVidaId);
   badge.html(badgeEvalIaHtml("EVALUANDO"));
   boton.prop("disabled", true);

   var dataParam = {
      hojaVidaTrabajadorContratistaId: hojaVidaId,
      proyectoId: parseInt(proyectoObj.id),
      usuarioId: parseInt(getSession("gestopuserid"))
   };

   // beforeSend no-op + autoUnblock=false: el feedback es el badge "Evaluando…", sin tapar la pantalla
   // durante la llamada larga a Bedrock (puede tardar varios segundos).
   callAjaxPost(URL + '/ia/evaluacion/evaluar', dataParam, function (data) {
      boton.prop("disabled", false);
      // P118: sin la entrega del aviso al trabajador no se evalúa ni se guarda nada (no cuenta como evaluación).
      if (data.avisoPendiente) {
         badge.html(badgeAvisoPendienteIaHtml());
         mostrarAvisoPendienteIa(data.trabajadoresSinAviso);
         return;
      }
      // cada evaluacion es un registro nuevo (insert-only): se incrementa el contador del chip en vivo.
      var prev = mapResultadosIa[hojaVidaId];
      var nuevoN = ((prev && prev.numEvaluaciones) ? prev.numEvaluaciones : 0) + 1;
      if (data.CODE_RESPONSE == "05" && data.resultado) {
         mapResultadosIa[hojaVidaId] = data.resultado;
         mapResultadosIa[hojaVidaId].numEvaluaciones = nuevoN;
         badge.html(badgeEvalIaHtml(data.resultado.estado, hojaVidaId));
         $("#iaChip_" + hojaVidaId).html(chipHistorialIaHtml(hojaVidaId, nuevoN));
      } else {
         mapResultadosIa[hojaVidaId] = { estado: "ERROR", resultadoResumen: (data.mensaje || "No se pudo evaluar."), numEvaluaciones: nuevoN };
         badge.html(badgeEvalIaHtml("ERROR", hojaVidaId));
         $("#iaChip_" + hojaVidaId).html(chipHistorialIaHtml(hojaVidaId, nuevoN));
      }
   }, function () {}, null, null, null, false);
}

/** Carga (batch) los ultimos resultados de IA de las filas mostradas y pinta los badges.
 *  Si la empresa NO tiene habilitado el módulo IA, quita los botones/badges y no hace nada más. */
function cargarBadgesEvaluacionIa(listHojasVida) {
   verificarModuloIaActivo(function () {
      if (!moduloIaActivo) {
         $(".bloqueEvalIa").remove(); // empresa sin módulo IA habilitado: ocultar opciones de IA
         return;
      }
      $(".bloqueEvalIa").show(); // confirmado activo: mostrar los bloques (nacen ocultos, fail-safe)
      if (!listHojasVida || listHojasVida.length == 0) {
         return;
      }
      var ids = listHojasVida.map(function (v) { return v.id; });

      // beforeSend no-op + autoUnblock=false: no interfiere con el blockUI de la cadena de carga de la pantalla.
      callAjaxPost(URL + '/ia/evaluacion/resultados', ids, function (data) {
         if (data.CODE_RESPONSE != "05" || !data.list) {
            return;
         }
         data.list.forEach(function (r) {
            mapResultadosIa[r.hojaVidaTrabajadorContratistaId] = r;
            $("#iaBadge_" + r.hojaVidaTrabajadorContratistaId).html(badgeEvalIaHtml(r.estado, r.hojaVidaTrabajadorContratistaId));
            $("#iaChip_" + r.hojaVidaTrabajadorContratistaId).html(chipHistorialIaHtml(r.hojaVidaTrabajadorContratistaId, r.numEvaluaciones));
         });
      }, function () {}, null, null, null, false);
      pintarAvisoIaHojasVida(listHojasVida);
   });
}

// ===== P73: evaluación de documentos de examen del contratista (EPPs, habilitación, alto riesgo) =====

/** HTML del bloque IA (badge + botón) que se inyecta en la celda Detalle de cada fila de documento de examen. */
function getBloqueEvaluacionIaExamen(examenId) {
   return "<div class='bloqueEvalIa' style='margin-top:6px;display:none;'>" +
             "<span id='iaBadgeEx_" + examenId + "'>" + badgeEvalIaHtml(null, null, "verObservacionesIaExamen") + "</span> " +
             "<span id='iaChipEx_" + examenId + "'></span> " +
             "<button type='button' id='iaBtnEx_" + examenId + "' class='btn btn-info btn-xs' " +
                "title='Evaluar el documento con inteligencia artificial' onclick='evaluarConIaExamen(" + examenId + ")'>" +
                "✨ Evaluar" +
             "</button>" +
             botonAyudaIaHtml() +
             "<div id='iaAvisoEx_" + examenId + "' style='margin-top:3px;font-size:11px;'></div>" +
          "</div>";
}

/** Dispara la evaluacion con IA de una fila de documento de examen. */
function evaluarConIaExamen(examenId) {
   if (typeof proyectoObj === "undefined" || !proyectoObj || !proyectoObj.id) {
      alert("No se pudo determinar el proyecto en contexto.");
      return;
   }

   var badge = $("#iaBadgeEx_" + examenId);
   var boton = $("#iaBtnEx_" + examenId);
   badge.html(badgeEvalIaHtml("EVALUANDO"));
   boton.prop("disabled", true);

   var dataParam = {
      contratistaHasExamenId: examenId,
      proyectoId: parseInt(proyectoObj.id),
      usuarioId: parseInt(getSession("gestopuserid"))
   };

   // beforeSend no-op + autoUnblock=false: el feedback es el badge "Evaluando…", sin tapar la pantalla
   // durante la llamada larga a Bedrock (puede tardar varios segundos).
   callAjaxPost(URL + '/ia/evaluacion/evaluar-examen', dataParam, function (data) {
      boton.prop("disabled", false);
      // P118: con un trabajador del documento sin el aviso entregado no se evalúa ni se guarda nada.
      if (data.avisoPendiente) {
         badge.html(badgeAvisoPendienteIaHtml());
         mostrarAvisoPendienteIa(data.trabajadoresSinAviso);
         return;
      }
      // cada evaluacion es un registro nuevo (insert-only): se incrementa el contador del chip en vivo.
      var prev = mapResultadosIaExamen[examenId];
      var nuevoN = ((prev && prev.numEvaluaciones) ? prev.numEvaluaciones : 0) + 1;
      if (data.CODE_RESPONSE == "05" && data.resultado) {
         mapResultadosIaExamen[examenId] = data.resultado;
         mapResultadosIaExamen[examenId].numEvaluaciones = nuevoN;
         badge.html(badgeEvalIaHtml(data.resultado.estado, examenId, "verObservacionesIaExamen"));
         $("#iaChipEx_" + examenId).html(chipHistorialIaHtml(examenId, nuevoN, "verHistorialIaExamen"));
      } else {
         mapResultadosIaExamen[examenId] = { estado: "ERROR", resultadoResumen: (data.mensaje || "No se pudo evaluar."), numEvaluaciones: nuevoN };
         badge.html(badgeEvalIaHtml("ERROR", examenId, "verObservacionesIaExamen"));
         $("#iaChipEx_" + examenId).html(chipHistorialIaHtml(examenId, nuevoN, "verHistorialIaExamen"));
      }
   }, function () {}, null, null, null, false);
}

/** Carga (batch) los ultimos resultados de IA de los documentos de examen mostrados y pinta los badges.
 *  Solo considera los tipos habilitados (TIPOS_EVAL_IA_EXAMEN). Si la empresa no tiene el módulo IA,
 *  verificarModuloIaActivo ya retira los bloques. */
function cargarBadgesEvaluacionIaExamen(listExamenes) {
   verificarModuloIaActivo(function () {
      if (!moduloIaActivo) {
         $(".bloqueEvalIa").remove(); // empresa sin módulo IA habilitado: ocultar opciones de IA
         return;
      }
      $(".bloqueEvalIa").show(); // confirmado activo: mostrar los bloques (nacen ocultos, fail-safe)
      if (!listExamenes || listExamenes.length == 0) {
         return;
      }
      var conIa = listExamenes.filter(function (v) {
         return v.tipo && TIPOS_EVAL_IA_EXAMEN.includes(v.tipo.id);
      });
      var ids = conIa.map(function (v) { return v.id; });
      if (ids.length == 0) {
         return;
      }
      pintarAvisoIaExamenes(conIa);

      // beforeSend no-op + autoUnblock=false: no interfiere con el blockUI de la cadena de carga de la pantalla.
      callAjaxPost(URL + '/ia/evaluacion/resultados-examen', ids, function (data) {
         if (data.CODE_RESPONSE != "05" || !data.list) {
            return;
         }
         data.list.forEach(function (r) {
            mapResultadosIaExamen[r.contratistaHasExamenId] = r;
            $("#iaBadgeEx_" + r.contratistaHasExamenId).html(badgeEvalIaHtml(r.estado, r.contratistaHasExamenId, "verObservacionesIaExamen"));
            $("#iaChipEx_" + r.contratistaHasExamenId).html(chipHistorialIaHtml(r.contratistaHasExamenId, r.numEvaluaciones, "verHistorialIaExamen"));
         });
      }, function () {}, null, null, null, false);
   });
}

/** Muestra un modal con las observaciones de la IA para una fila de hoja de vida. */
function verObservacionesIa(hojaVidaId) {
   mostrarObservacionesIa(mapResultadosIa[hojaVidaId], "✨ Evaluación de hoja de vida — Observaciones");
}

/** Muestra un modal con las observaciones de la IA para un documento de examen (P73). */
function verObservacionesIaExamen(examenId) {
   mostrarObservacionesIa(mapResultadosIaExamen[examenId], "✨ Evaluación de documento — Observaciones");
}

// ===== P118: aviso al trabajador antes de la evaluación con IA =====

/** Página del aviso vigente (estática, sin sesión). */
var PAGINA_AVISO_IA = "../ayuda/ia-aviso-trabajador-v1.1.html";

// ===== P118 (plan, sección 4.4): el revisor ve junto a «Evaluar» el estado del aviso y abre la constancia firmada =====

/** Estado del aviso por id de trabajador de contratista, tal como lo devuelve /contratista/aviso_ia/estado. */
var mapAvisoIaRevisor = {};

/**
 * Pide el estado del aviso en bloques de 500 (el máximo que acepta el servidor) y llama a pintar con cada respuesta.
 * El servidor solo devuelve a los trabajadores de contratistas de la empresa de la sesión; los demás no se pintan.
 */
function cargarEstadosAvisoIaRevisor(ids, pintar) {
   var unicos = [];
   ids.forEach(function (id) {
      id = parseInt(id);
      if (id > 0 && unicos.indexOf(id) < 0) {
         unicos.push(id);
      }
   });
   for (var i = 0; i < unicos.length; i += 500) {
      callAjaxPost(URL + '/contratista/aviso_ia/estado', unicos.slice(i, i + 500), function (data) {
         if (data.CODE_RESPONSE != "05" || !data.list) {
            return;
         }
         data.list.forEach(function (e) {
            mapAvisoIaRevisor[e.trabajadorContratistaId] = e;
         });
         pintar();
      }, function () {}, null, null, null, false);
   }
}

/** Texto del estado de un trabajador: el mismo de la pantalla de la contratista (escapa, fecha de Lima y descarga). */
function textoAvisoIaRevisor(e) {
   if (typeof textoEstadoAvisoIa === "function") {
      return textoEstadoAvisoIa(e);
   }
   return (e && e.entregado) ? "<span class='label label-success'>Entregado</span>" :
      "<span class='label label-warning'>Pendiente</span>";
}

/** Ids de los trabajadores que cubre un documento de examen («trabajadoresId» viene separado por comas). */
function idsTrabajadoresExamenAvisoIa(x) {
   return String(x.trabajadoresId || "").split(",").map(function (v) { return parseInt(v); })
      .filter(function (n) { return n > 0; });
}

function pintarAvisoIaHojasVida(listHojasVida) {
   var lista = (listHojasVida || []).filter(function (h) { return h.trabajador && h.trabajador.id; });
   cargarEstadosAvisoIaRevisor(lista.map(function (h) { return h.trabajador.id; }), function () {
      lista.forEach(function (h) {
         var e = mapAvisoIaRevisor[h.trabajador.id];
         if (e) {
            $("#iaAviso_" + parseInt(h.id)).html("Aviso: " + textoAvisoIaRevisor(e));
         }
      });
   });
}

/** Un documento con un trabajador muestra su estado completo; con varios, cuántos tienen el aviso. */
function pintarAvisoIaExamenes(listExamenes) {
   var ids = [];
   listExamenes.forEach(function (x) {
      ids = ids.concat(idsTrabajadoresExamenAvisoIa(x));
   });
   cargarEstadosAvisoIaRevisor(ids, function () {
      listExamenes.forEach(function (x) {
         var trabajadores = idsTrabajadoresExamenAvisoIa(x);
         var conEstado = trabajadores.filter(function (id) { return mapAvisoIaRevisor[id]; });
         if (trabajadores.length == 0 || conEstado.length < trabajadores.length) {
            return; // aún falta la respuesta de algún bloque
         }
         var texto;
         if (trabajadores.length == 1) {
            texto = textoAvisoIaRevisor(mapAvisoIaRevisor[trabajadores[0]]);
         } else {
            var entregados = conEstado.filter(function (id) { return mapAvisoIaRevisor[id].entregado; }).length;
            texto = (entregados == trabajadores.length) ?
               "<span class='label label-success'>Entregado</span> a los " + trabajadores.length + " trabajadores" :
               "<span class='label label-warning'>Pendiente</span> " + (trabajadores.length - entregados) + " de " +
                  trabajadores.length + " trabajadores";
         }
         $("#iaAvisoEx_" + parseInt(x.id)).html("Aviso: " + texto);
      });
   });
}

// ===== P122: ayuda de la evaluación con IA, junto al botón «Evaluar» =====

/** Página de ayuda (estática, sin sesión, con su versión visible). */
var PAGINA_AYUDA_IA = "../ayuda/ia-evaluacion.html";

/** Icono de ayuda que acompaña al botón «Evaluar» de cada fila. */
function botonAyudaIaHtml() {
   return " <button type='button' class='btn btn-link btn-xs' style='padding:0 2px;' " +
             "title='Ayuda: qué hace la evaluación con IA y cómo leer el resultado' onclick='verAyudaEvaluacionIaDoc()'>" +
             "<i class='fa fa-question-circle'></i>" +
          "</button>";
}

/** Abre la ayuda en la misma pantalla; el enlace del pie la abre en otra pestaña. */
function verAyudaEvaluacionIaDoc() {
   if ($("#modalAyudaEvaluacionIaDoc").length == 0) {
      $("body").append(
         "<div class='modal fade' id='modalAyudaEvaluacionIaDoc' tabindex='-1' role='dialog'>" +
            "<div class='modal-dialog modal-lg' role='document'>" +
               "<div class='modal-content'>" +
                  "<div class='modal-header'>" +
                     "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
                     "<h4 class='modal-title'><i class='fa fa-question-circle'></i> Evaluación de documentos con IA</h4>" +
                  "</div>" +
                  "<div class='modal-body' style='padding:0;'>" +
                     "<iframe id='iframeAyudaEvaluacionIaDoc' title='Ayuda de la evaluación con IA' " +
                        "style='width:100%;height:65vh;border:0;'></iframe>" +
                  "</div>" +
                  "<div class='modal-footer'>" +
                     "<a href='" + PAGINA_AYUDA_IA + "' target='_blank' rel='noopener' class='btn btn-link'>Abrir en otra pestaña</a>" +
                     "<button type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>" +
                  "</div>" +
               "</div>" +
            "</div>" +
         "</div>");
   }
   $("#iframeAyudaEvaluacionIaDoc").attr("src", PAGINA_AYUDA_IA);
   $("#modalAyudaEvaluacionIaDoc").modal("show");
}

/** Badge de la fila cuando la evaluación no se inició por falta del aviso. */
function badgeAvisoPendienteIaHtml() {
   return "<span class='label label-warning' style='cursor:pointer;' title='Falta la entrega del aviso al trabajador' " +
          "onclick='mostrarAvisoPendienteIa()'>✨ Aviso pendiente</span>";
}

/** Explica por qué no se evaluó y cómo se entrega el aviso. Los nombres se escapan antes de mostrarse. */
function mostrarAvisoPendienteIa(nombres) {
   if ($("#modalAvisoPendienteIa").length == 0) {
      $("body").append(
         "<div class='modal fade' id='modalAvisoPendienteIa' tabindex='-1' role='dialog'>" +
            "<div class='modal-dialog' role='document'>" +
               "<div class='modal-content'>" +
                  "<div class='modal-header'>" +
                     "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
                     "<h4 class='modal-title'>✨ Falta el aviso al trabajador</h4>" +
                  "</div>" +
                  "<div class='modal-body' style='font-size:13px;line-height:1.5;'>" +
                     "<p>No se puede evaluar con IA hasta que conste la entrega del aviso sobre la revisión de su documentación.</p>" +
                     "<div id='modalAvisoPendienteIaNombres' style='margin:8px 0;'></div>" +
                     "<p>El aviso se entrega de una de estas dos formas:</p>" +
                     "<ul>" +
                        "<li>el trabajador lo lee al ingresar a la plataforma, o</li>" +
                        "<li>su contratista carga la constancia firmada desde la lista de sus trabajadores.</li>" +
                     "</ul>" +
                     "<p><a href='" + PAGINA_AVISO_IA + "' target='_blank' rel='noopener'>Ver el aviso</a></p>" +
                  "</div>" +
                  "<div class='modal-footer'>" +
                     "<button type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>" +
                  "</div>" +
               "</div>" +
            "</div>" +
         "</div>");
   }
   var lista = $("#modalAvisoPendienteIaNombres").empty();
   if (nombres && nombres.length > 0) {
      lista.append($("<strong>").text("Sin aviso: "));
      lista.append(document.createTextNode(nombres.join(", ")));
   }
   $("#modalAvisoPendienteIa").modal("show");
}

/** Modal de observaciones (compartido por hoja de vida y documentos de examen). */
function mostrarObservacionesIa(r, titulo) {
   if (!r) {
      return;
   }

   if ($("#modalObsEvalIa").length == 0) {
      $("body").append(
         "<div class='modal fade' id='modalObsEvalIa' tabindex='-1' role='dialog'>" +
            "<div class='modal-dialog modal-lg' role='document'>" +
               "<div class='modal-content'>" +
                  "<div class='modal-header'>" +
                     "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
                     "<h4 class='modal-title' id='modalObsEvalIaTitulo'>✨ Evaluación — Observaciones</h4>" +
                  "</div>" +
                  "<div class='modal-body'>" +
                     "<style>" +
                        ".cuerpoIa{max-height:55vh;overflow:auto;font-size:13px;line-height:1.5;}" +
                        ".cuerpoIa table{border-collapse:collapse;width:100%;margin:8px 0;font-size:12.5px;}" +
                        ".cuerpoIa th,.cuerpoIa td{border:1px solid #ccc;padding:5px 8px;text-align:left;vertical-align:top;}" +
                        ".cuerpoIa th{background:#f0f4f8;}" +
                        ".cuerpoIa .hIa{font-weight:bold;margin:10px 0 4px;color:#2E5496;}" +
                        ".cuerpoIa .hIa1,.cuerpoIa .hIa2{font-size:15px;}.cuerpoIa .hIa3{font-size:14px;}.cuerpoIa .hIa4{font-size:13px;color:#444;}" +
                        ".cuerpoIa p{margin:3px 0;}.cuerpoIa ul{margin:4px 0 8px 18px;}.cuerpoIa hr{margin:8px 0;border:0;border-top:1px solid #ddd;}" +
                     "</style>" +
                     "<div id='modalObsEvalIaEstado' style='margin-bottom:10px;'></div>" +
                     "<div id='modalObsEvalIaTexto' class='cuerpoIa'></div>" +
                     "<small id='modalObsEvalIaMeta' class='text-muted'></small>" +
                  "</div>" +
                  "<div class='modal-footer'>" +
                     "<button type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>" +
                  "</div>" +
               "</div>" +
            "</div>" +
         "</div>");
   }

   $("#modalObsEvalIaTitulo").text(titulo);
   $("#modalObsEvalIaEstado").html(badgeEvalIaHtml(r.estado));
   $("#modalObsEvalIaTexto").html(renderMarkdownIa(r.resultadoResumen));
   $("#modalObsEvalIaMeta").html(r.fecha ? "Evaluado el " + r.fecha : "");
   $("#modalObsEvalIa").modal("show");
}

// ===== Historial de evaluaciones por hoja de vida (Partida 37) =====

var listHistorialIa = []; // evaluaciones de la hoja de vida abierta en el modal de historial

/** Abre el modal con TODAS las evaluaciones de una hoja de vida (cada re-evaluacion = una fila). */
function verHistorialIa(hojaVidaId) {
   abrirHistorialIa('/ia/evaluacion/historial', { hojaVidaTrabajadorContratistaId: hojaVidaId });
}

/** Abre el modal con TODAS las evaluaciones de un documento de examen (P73). */
function verHistorialIaExamen(examenId) {
   abrirHistorialIa('/ia/evaluacion/historial-examen', { contratistaHasExamenId: examenId });
}

/** Carga el historial desde el endpoint indicado y abre el modal (compartido por ambas anclas). */
function abrirHistorialIa(endpoint, dataParam) {
   callAjaxPost(URL + endpoint, dataParam, function (data) {
      if (data.CODE_RESPONSE != "05") { return; }
      listHistorialIa = data.list || [];
      construirModalHistorialIa();
      renderTablaHistorialIa();
      volverHistorialIa();
      $("#modalHistorialIa").modal("show");
   }, function () {}, null, null, null, false);
}

function construirModalHistorialIa() {
   if ($("#modalHistorialIa").length) { return; }
   $("body").append(
      "<div class='modal fade' id='modalHistorialIa' tabindex='-1' role='dialog'>" +
         "<div class='modal-dialog modal-lg' role='document'><div class='modal-content'>" +
            "<div class='modal-header'>" +
               "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
               "<h4 class='modal-title'>🕘 Historial de evaluaciones con IA</h4>" +
            "</div>" +
            "<div class='modal-body'>" +
               "<style>" +
                  ".cuerpoIaHist{max-height:50vh;overflow:auto;font-size:13px;line-height:1.5;}" +
                  ".cuerpoIaHist table{border-collapse:collapse;width:100%;margin:8px 0;font-size:12.5px;}" +
                  ".cuerpoIaHist th,.cuerpoIaHist td{border:1px solid #ccc;padding:5px 8px;text-align:left;vertical-align:top;}" +
                  ".cuerpoIaHist th{background:#f0f4f8;}.cuerpoIaHist .hIa{font-weight:bold;margin:10px 0 4px;color:#2E5496;}" +
                  ".cuerpoIaHist p{margin:3px 0;}.cuerpoIaHist ul{margin:4px 0 8px 18px;}.cuerpoIaHist hr{margin:8px 0;border:0;border-top:1px solid #ddd;}" +
               "</style>" +
               "<div id='histTablaIaWrap'>" +
                  "<table class='table table-bordered table-hover' style='font-size:12.5px;'>" +
                     "<thead><tr><th>Fecha</th><th>Usuario</th><th>Estado</th><th style='text-align:right;'>Tokens</th><th>Obs.</th></tr></thead>" +
                     "<tbody id='histTbodyIa'></tbody>" +
                  "</table>" +
               "</div>" +
               "<div id='histDetalleIa' style='display:none;'>" +
                  "<button class='btn btn-default btn-xs' onclick='volverHistorialIa()' style='margin-bottom:8px;'><i class='fa fa-arrow-left'></i> Volver al historial</button>" +
                  "<div id='histDetalleMetaIa' style='margin-bottom:8px;'></div>" +
                  "<div id='histDetalleTextoIa' class='cuerpoIaHist'></div>" +
               "</div>" +
            "</div>" +
            "<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button></div>" +
         "</div></div>" +
      "</div>");
}

function renderTablaHistorialIa() {
   var tb = $("#histTbodyIa");
   tb.empty();
   if (!listHistorialIa.length) {
      tb.append("<tr><td colspan='5' style='text-align:center;color:#999;'>Sin evaluaciones.</td></tr>");
      return;
   }
   listHistorialIa.forEach(function (h, i) {
      tb.append(
         "<tr>" +
            "<td>" + (h.fecha || "—") + "</td>" +
            "<td>" + (h.usuarioNombre || "—") + "</td>" +
            "<td>" + badgeEvalIaHtml(h.estado) + "</td>" +
            "<td style='text-align:right;'>" + (h.tokensTotal != null ? h.tokensTotal.toLocaleString("es-PE") : "—") + "</td>" +
            "<td><button class='btn btn-default btn-xs' title='Ver observaciones' onclick='verObsHistorialIa(" + i + ")'><i class='fa fa-eye'></i></button></td>" +
         "</tr>");
   });
}

/** Muestra las observaciones de una evaluacion puntual del historial (vista de detalle dentro del mismo modal). */
function verObsHistorialIa(i) {
   var h = listHistorialIa[i];
   if (!h) { return; }
   $("#histDetalleMetaIa").html(badgeEvalIaHtml(h.estado) +
      " <small class='text-muted'>" + (h.usuarioNombre || "") + (h.fecha ? " · " + h.fecha : "") + "</small>");
   $("#histDetalleTextoIa").html(renderMarkdownIa(h.resultadoResumen));
   $("#histTablaIaWrap").hide();
   $("#histDetalleIa").show();
   // devolver el foco al modal: al ocultar el botón enfocado, el foco se iría al body y ESC dejaría de cerrar.
   $("#modalHistorialIa").focus();
}

function volverHistorialIa() {
   $("#histDetalleIa").hide();
   $("#histTablaIaWrap").show();
   $("#modalHistorialIa").focus();
}

/**
 * Render Markdown liviano (sin dependencias) para mostrar la respuesta de la IA en el modal.
 * Soporta: encabezados (#..####), negrita (**), listas (- / *), separador (---) y tablas Markdown.
 * Escapa HTML primero (la respuesta viene del modelo) para evitar inyección.
 */
function renderMarkdownIa(md) {
   if (!md || !md.trim()) {
      return "<em>Sin observaciones.</em>";
   }
   function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
   function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
   function splitRow(l) { return l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (c) { return c.trim(); }); }

   var lines = md.replace(/\r\n/g, "\n").split("\n");
   var out = [];
   var i = 0;
   while (i < lines.length) {
      var line = lines[i];

      // Tabla Markdown: fila con | seguida de una fila separadora |---|
      if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
         var header = splitRow(line);
         i += 2;
         var t = "<table><thead><tr>";
         header.forEach(function (h) { t += "<th>" + inline(h) + "</th>"; });
         t += "</tr></thead><tbody>";
         while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
            var cells = splitRow(lines[i]);
            t += "<tr>";
            cells.forEach(function (c) { t += "<td>" + inline(c) + "</td>"; });
            t += "</tr>";
            i++;
         }
         t += "</tbody></table>";
         out.push(t);
         continue;
      }

      // Encabezados
      var hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm) {
         out.push("<div class='hIa hIa" + hm[1].length + "'>" + inline(hm[2]) + "</div>");
         i++;
         continue;
      }

      // Separador horizontal
      if (/^\s*---+\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

      // Listas
      if (/^\s*[-*]\s+/.test(line)) {
         var items = [];
         while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
            items.push("<li>" + inline(lines[i].replace(/^\s*[-*]\s+/, "")) + "</li>");
            i++;
         }
         out.push("<ul>" + items.join("") + "</ul>");
         continue;
      }

      // Línea en blanco
      if (/^\s*$/.test(line)) { i++; continue; }

      // Párrafo normal
      out.push("<p>" + inline(line) + "</p>");
      i++;
   }
   return out.join("");
}
