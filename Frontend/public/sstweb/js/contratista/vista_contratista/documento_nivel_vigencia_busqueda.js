// P-A00039: control comun de la «Vigencia» (campo dentro de «Opciones»), el buscador, el aviso de fechas y el encabezado de «Opciones» de las pantallas de documentos de
// conductores, vehiculos y maquinaria, y equipos y herramientas. Es el mismo diseno de los documentos por trabajador (examen_contratista.js, P-A00036): la pantalla abre en
// «Todos» (todos los estados dentro de las fechas del filtro); «Vigentes» y «Vigencia futura» no usan las fechas y las bloquean; «No vigentes» si las usa; el buscador es un
// panel «Buscar ...» con un campo de ancho completo, como el de la seccion Trabajadores. El servidor calcula el estado de cada documento y los contadores.
// Cada pantalla crea el suyo con crearControlDocNivel({...}) y lo guarda en controlesDocNivel[clave] (los eventos del HTML llaman a ese objeto).
var controlesDocNivel = {};
var MIN_CARACTERES_BUSQUEDA_DOC_NIVEL = 3,ESPERA_BUSQUEDA_DOC_NIVEL = 300;

function crearControlDocNivel(cfg){
   var c = {cfg:cfg,filtro:"todos",busqueda:"",conteos:null,vigenciaAplica:false,enfocar:false,temporizador:null,pagina:1,totalPaginas:0,total:0,cargando:false};
   var ref = "controlesDocNivel[\""+cfg.clave+"\"]";

   controlesDocNivel[cfg.clave] = c;

   // cada vez que se abre la seccion: «Todos», sin busqueda, sin contadores y en la primera pagina
   c.reiniciar = function(){
      c.filtro = "todos";c.busqueda = "";c.conteos = null;c.vigenciaAplica = false;c.enfocar = false;
      c.pagina = 1;c.totalPaginas = 0;c.total = 0;c.cargando = false;
   };

   // lo que se manda al servidor: el servidor valida el filtro y arma las palabras de la busqueda; la pagina solo viaja en las pantallas que paginan (cfg.paginar)
   c.parametros = function(){
      var p = {filtroVigencia:c.filtro,busqueda:c.busqueda};

      if(cfg.paginar){
         p.pagina = c.pagina;
      }

      return p;
   };

   // P-A00040: paginacion de 100 en 100, con el mismo diseno de los documentos por trabajador (botones anterior y siguiente con «Pagina N de M»). Las pantallas que no
   // paginan no usan nada de esto. Cambiar el filtro, la vigencia o la busqueda vuelve a la primera pagina; guardar o eliminar recarga la pagina actual.
   c.irAPagina = function(pagina){
      if(c.cargando || pagina < 1 || pagina > c.totalPaginas){
         return;
      }

      c.pagina = pagina;c.cargando = true;c.actualizarBotonesPagina();
      cfg.recargar();
   };

   // lo llama la pantalla al terminar cada peticion, con o sin error
   c.terminarCarga = function(){
      c.cargando = false;c.actualizarBotonesPagina();
   };

   c.actualizarBotonesPagina = function(){
      // los botones que no corresponden se ocultan sin quitarles el lugar: «Página N de M» no se mueve al cambiar de pagina
      $("#"+cfg.idBtnAnterior).css("visibility",(c.totalPaginas > 0 && c.pagina > 1?"visible":"hidden")).prop("disabled",c.cargando);
      $("#"+cfg.idBtnSiguiente).css("visibility",(c.pagina < c.totalPaginas?"visible":"hidden")).prop("disabled",c.cargando);
   };

   c.htmlPaginacion = function(){
      var textoPagina = (c.totalPaginas == 0?"Sin registros":"Página "+c.pagina+" de "+c.totalPaginas);

      // una barra propia, centrada, al comienzo de la lista (debajo del buscador): en el encabezado de la lista no entraba con los otros botones
      return "<div class='eventoGeneral' style='display:flex;align-items:center;justify-content:center;gap:16px;padding:10px;text-align:center;'>" +
                "<button type='button' id='"+cfg.idBtnAnterior+"' class='btn btn-success' disabled style='padding:6px 16px;font-size:16px;' " +
                        "onclick='"+ref+".irAPagina("+(c.pagina-1)+")' title='Página anterior' aria-label='Página anterior'>" +
                   "<i class='fa fa-chevron-left' aria-hidden='true'></i>" +
                "</button>" +
                "<span style='min-width:140px;font-size:15px;font-weight:bold;color:#2e9e8f;' aria-live='polite'>"+textoPagina+"</span>" +
                "<button type='button' id='"+cfg.idBtnSiguiente+"' class='btn btn-success' disabled style='padding:6px 16px;font-size:16px;' " +
                        "onclick='"+ref+".irAPagina("+(c.pagina+1)+")' title='Página siguiente' aria-label='Página siguiente'>" +
                   "<i class='fa fa-chevron-right' aria-hidden='true'></i>" +
                "</button>" +
             "</div>";
   };

   c.htmlCampoVigencia = function(){
      return "<select id='"+cfg.idSelVigencia+"' class='form-control' onchange='"+ref+".bloquearFechas()'>" +
                "<option value='todos'>Todos</option><option value='vigentes'>Vigentes</option>" +
                "<option value='futuras'>Vigencia futura</option><option value='no_vigentes'>No vigentes</option>" +
             "</select>";
   };

   c.htmlNotaFechas = function(){
      return "<small id='"+cfg.idNotaFechas+"' style='display:none;'>Con esta opción no se usan las fechas.</small>";
   };

   // Las opciones llevan los contadores del ultimo resultado; «Todos» no lleva (usa las fechas, no es la suma de las demas).
   c.actualizarOpciones = function(){
      var campo = $("#"+cfg.idSelVigencia);

      if(campo.length == 0){
         return;
      }

      var n = c.conteos || {vigentes:0,futuras:0,noVigentes:0};

      campo.find("option[value='vigentes']").text("Vigentes ("+n.vigentes+")");
      campo.find("option[value='futuras']").text("Vigencia futura ("+n.futuras+")");
      campo.find("option[value='no_vigentes']").text("No vigentes ("+n.noVigentes+")");
      campo.val(c.filtro);
      c.bloquearFechas();
   };

   // «Vigentes» y «Vigencia futura» no usan las fechas: se bloquean para que se vea que no cuentan.
   c.bloquearFechas = function(){
      var bloqueadas = c.vigenciaAplica && ["vigentes","futuras"].includes($("#"+cfg.idSelVigencia).val());

      $(cfg.idFechaInicio+","+cfg.idFechaFin).prop("disabled",bloqueadas);
      $("#"+cfg.idNotaFechas).toggle(bloqueadas);
   };

   // al aplicar el filtro se guarda la opcion elegida
   c.leerFiltroDelModal = function(){
      c.pagina = 1;

      if(c.vigenciaAplica && $("#"+cfg.idSelVigencia).length > 0){
         c.filtro = $("#"+cfg.idSelVigencia).val();
      }
   };

   c.guardarRespuesta = function(data){
      c.vigenciaAplica = (data.vigenciaAplica === true);
      c.conteos = (data.vigenciaConteos || null);

      if(cfg.paginar){
         c.pagina = data.pagina;c.totalPaginas = data.totalPaginas;c.total = data.numTotalDocumentos;
      }
   };

   // cuantos documentos hay en total con el filtro: con paginacion es el total del servidor y sin ella el largo de la lista
   c.totalRegistros = function(lista){
      return (cfg.paginar?c.total:lista.length);
   };

   // el encabezado de «Opciones» dice lo que esta activo sin abrir el filtro
   c.textoEncabezado = function(textoFechas){
      if(c.vigenciaAplica && c.filtro == "vigentes"){
         return "Vigentes";
      }

      if(c.vigenciaAplica && c.filtro == "futuras"){
         return "Vigencia futura";
      }

      if(c.vigenciaAplica && c.filtro == "no_vigentes"){
         return "No vigentes · "+textoFechas;
      }

      return textoFechas;
   };

   // Las fechas pueden esconder documentos: se avisa en «Todos» (vigentes o de vigencia futura) y en «No vigentes» (no vigentes).
   c.textoAviso = function(){
      var n = c.conteos;

      if(!c.vigenciaAplica || n == null){
         return "";
      }

      if(c.filtro == "todos" && n.vigentesFuera > 0){
         return "Hay "+(n.vigentesFuera == 1?"1 documento vigente o con vigencia futura":n.vigentesFuera+" documentos vigentes o con vigencia futura")+
            " fuera de las fechas elegidas. Elige «Vigentes» o «Vigencia futura» en Opciones para verlos.";
      }

      if(c.filtro == "no_vigentes" && n.noVigentesFuera > 0){
         return "Hay "+(n.noVigentesFuera == 1?"1 documento no vigente":n.noVigentesFuera+" documentos no vigentes")+
            " fuera de las fechas elegidas. Amplía las fechas en Opciones para verlos.";
      }

      return "";
   };

   c.htmlAvisoPanel = function(){
      var aviso = c.textoAviso();

      return (aviso.length == 0?"":"<div id='"+cfg.idAvisoFechas+"' class='eventoGeneral' style='font-size:13px;color:#8a6d3b;'>"+aviso+"</div>");
   };

   // el buscador es un panel propio con un campo de ancho completo, como el de la seccion Trabajadores
   c.htmlBuscador = function(){
      return "<div class='eventoGeneral'>" +
                "<input type='text' id='"+cfg.idInputBusqueda+"' class='form-control' maxlength='100' autocomplete='off' " +
                       "placeholder='"+cfg.placeholder+" (mínimo "+MIN_CARACTERES_BUSQUEDA_DOC_NIVEL+" caracteres)' " +
                       "aria-label='"+cfg.ariaBuscador+"' oninput='"+ref+".buscar()'>" +
                "<div id='"+cfg.idAvisoBusqueda+"' style='margin-top:8px;font-size:13px;' aria-live='polite'></div>" +
             "</div>";
   };

   // Lo que escribio el usuario se pone como valor del campo (nunca como HTML) y, si estaba escribiendo, el cursor vuelve al final.
   c.restaurarBusqueda = function(){
      var campo = $("#"+cfg.idInputBusqueda);

      if(campo.length == 0){
         return;
      }

      campo.val(c.busqueda);

      if(c.enfocar){
         campo.focus();
         var largo = campo.val().length;
         campo[0].setSelectionRange(largo,largo);
         c.enfocar = false;
      }
   };

   c.palabrasValidas = function(texto){
      return $.trim(texto).split(/\s+/).filter(function(palabra){
         return palabra.length >= MIN_CARACTERES_BUSQUEDA_DOC_NIVEL;
      });
   };

   c.aplicarBusqueda = function(){
      var texto = $.trim($("#"+cfg.idInputBusqueda).val());
      var aviso = $("#"+cfg.idAvisoBusqueda);

      if(texto.length > 0 && c.palabrasValidas(texto).length == 0){
         aviso.text("Escribe al menos "+MIN_CARACTERES_BUSQUEDA_DOC_NIVEL+" caracteres.");
         return;
      }

      aviso.text("");

      if(texto == c.busqueda){
         return;
      }

      c.busqueda = texto;
      c.pagina = 1;
      c.enfocar = true;
      cfg.recargar();
   };

   // Espera un momento despues de la ultima tecla para no pedir al servidor con cada letra.
   c.buscar = function(){
      clearTimeout(c.temporizador);
      c.temporizador = setTimeout(c.aplicarBusqueda,ESPERA_BUSQUEDA_DOC_NIVEL);
   };

   // los documentos de vigencia futura llevan su fecha de inicio a la vista
   c.etiquetaFutura = function(val){
      return (val.estadoVigencia == "futura"?" <span style='display:inline-block;margin-left:8px;padding:2px 8px;border-radius:8px;font-size:13px;font-weight:normal;" +
         "background:#fcf8e3;color:#8a6d3b;'>Inicia el "+val.fechaInicioVigenciaTexto+"</span>":"");
   };

   c.htmlBotonFiltro = function(funcionVer){
      return "<button type='button' class='btn btn-success' style='padding:2px 8px;margin-right:10px' onclick='"+funcionVer+"()' " +
                "title='Ver filtros' aria-label='Ver filtros'>" +
                "<i class='fa fa-filter fa-4x' aria-hidden='true'></i>" +
             "</button>";
   };

   return c;
}
