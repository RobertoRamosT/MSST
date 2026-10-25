/**
 * 
 */
var listFullExamenesContratista=[];
var listTipoVigencia=[];
var listTrabajadoresExamen = [],listTipoExamenesAux = [],listTipoVacunaCovidAux = [],listClinicaCertifDigesa = [];
var listMesExam = [],listDocumentosCovidContratista=[];
var listEnlacesExamContratista = [];
var objExamenContratista={id:0};
var examenTipoId=1;
var examenTipoNombre="";
var listTrabajadoresExamenTodos=[];
var listEvaluacionExamCon=[];
var listEstadosEvaluacionId = [];
var objEmpresaInfoAux = {};
var claveEncriptarTexto,mensajePersonalizado,primeraVezMensajePersonalizado;
var mensajeUx;

var listTipoExamenContratistaAux=[
   {id:1,nombre:(parseInt(getSession("gestopcompanyid")) == 647?"EMO y protocolo médico":
    (parseInt(getSession("gestopcompanyid")) == 741?"Habilitación médica ocupacional":"Certificado Aptitud Médica"))},
   {id:2,nombre:"SCTR"},
   {id:4,nombre:(parseInt(getSession("gestopcompanyid")) == 647?"Cargo SSOMA":"Cargo RISST")},
   {id:5,nombre:"Documento Adicional"},{id:6,nombre:"T-Registro"},
   {id:8,nombre:"Equipos de Protección Personal (EPP)"},{id:14,nombre:"Prevencionista"},
   {id:15,nombre:"Certificado de capacitación para trabajo de alto riesgo"},{id:16,nombre:"Indicador mensual SST"},
   {id:23,nombre:"Inducciones"},{id:24,nombre:"Acta de compromiso"},{id:25,nombre:"Prueba COVID-19"},
   {id:34,nombre:"Vacuna COVID-19"},{id:35,nombre:"Reglamento SST"},{id:36,nombre:"Política SST"},
   {id:37,nombre:"Plan anual SST"},{id:38,nombre:"Programa SST asociado a la empresa"},
   {id:39,nombre:"Plan anual de salud ocupacional"},{id:40,nombre:"Programa de vigilancia de salud ocupacional"},
   {id:41,nombre:"Certificado de homologación con el cliente"},
   {id:42,nombre:(parseInt(getSession("gestopcompanyid")) == 647?
	          "Procedimiento de trabajo seguro":"Procedimiento de trabajo seguro para trabajos de alto riesgo")},
   {id:43,nombre:"Certificados policiales"},{id:44,nombre:"Constancia de registro laboral"},
   {id:45,nombre:"Declaración de no núcleo del negocio"},{id:46,nombre:"Carta fianza"},
   {id:47,nombre:"Comunicado a organizaciones sindicales"},{id:48,nombre:"Comunicado a representantes de trabajadores"},
   {id:49,nombre:"Comunicado a trabajadores (principal)"},{id:50,nombre:"Comunicado a trabajadores (contratista)"},
   {id:51,nombre:"Ficha RUC"},{id:52,nombre:"Constancia registro de tercerizadoras"},
   {id:53,nombre:"Contratos con empresas usuarias"},{id:54,nombre:"Partida registral"},
   {id:55,nombre:"Asiento de la partida registral"},{id:56,nombre:"Contratos de trabajos tercerizados"},
   {id:57,nombre:"Declaración de servicios tercerizados"},{id:58,nombre:"Informe de servicio de trabajadores"},
   {id:59,nombre:"Comité/Supervisor SST"},{id:60,nombre:"Antecedentes penales"},{id:61,nombre:"Seguro contra accidentes"},
   {id:63,nombre:"Riesgo de exposición al puesto de trabajo"},{id:64,nombre:"Vacunación COVID-19"},{id:65,nombre:"Carnet de sanidad"},
   {id:67,nombre:"Hoja de atención del SCTR"},{id:68,nombre:"Acuerdo de confidencialidad"},{id:69,nombre:"Flujo de respuesta ante accidentes"},
   {id:70,nombre:"Acuerdo de seguridad para terceros y contratistas"},{id:71,nombre:"Acuerdo de seguridad para proveedores"},
   {id:72,nombre:"Acuerdo de seguridad y confidencialidad - equipos electrónicos"},{id:73,nombre:"Evaluación toxicológica"},
   {id:74,nombre:"Certificado único laboral"},{id:75,nombre:"Antecedentes policiales"},
    {id:76,nombre:"Declaración jurada o verificación del domicilio"},{id:77,nombre:"Dotación indumentaria"},{id:78,nombre:"Clínica (Certificación DIGESA)"},
	{id:79,nombre:"Habilitación médica por clínica"},{id:84,nombre:"Cargo RISST de la contratista"},{id:88,nombre:"Seguro vida ley"},
	{id:89,nombre:"Cargo de recepción de IPERC"},{id:90,nombre:"Seguro vida ley"},{id:91,nombre:"Formatos de campo"},{id:92,nombre:"Declaración jurada de SST"},
	{id:93,nombre:"Registro de seguridad del contratista"},{id:94,nombre:"Declaración jurada para contratistas"},{id:95,nombre:"Licencia o permiso emitido por la AMP"},
	{id:96,nombre:"Carta de aceptación de la norma"},{id:97,nombre:"Póliza de responsabilidad civil de la empresa"},{id:98,nombre:"Formulario y control a terceras partes"},
	{id:99,nombre:"Documento de identidad"},{id:100,nombre:"Procedimiento o manual para trab. contratistas"},{id:101,nombre:"Cargo de procedimiento de HS"},
    {id:102,nombre:"Autorización Osinergmin para combustible"},{id:103,nombre:"Autorización de circulación del MTC"},{id:104,nombre:"Ficha técnica guantes aislantes clase 0/00"},
    {id:105,nombre:"Certificado dieléctrico pértiga y manta aislante"},{id:106,nombre:"Ficha técnica de componentes del traje contra arco eléctrico"},{id:107,nombre:"Ficha técnica de botas dieléctricas"},
    {id:108,nombre:"Certificado de ensayo dieléctrico guantes clase 1–4"},{id:109,nombre:"Certificado de ensayo dieléctrico de banqueta aislante"},{id:110,nombre:"Certificado de ensayo de puesta a tierra temporal"},
    {id:111,nombre:"Inducción SSOMA del cliente"},{id:112,nombre:"Registro de capacitación en procedimiento de trabajo"},{id:113,nombre:"Registro de difusión de política de seguridad del cliente"},
    {id:114,nombre:"Registro de difusión de RISST del cliente"},{id:115,nombre:"Capacitación en reporte de accidentes e incidentes (flujograma)"},{id:116,nombre:"Difusión de IPERC, PETS y PETAR"},
    {id:117,nombre:"Registro de capacitación por puesto de trabajo"},{id:118,nombre:"Registro de capacitación de IPERC de la contratista"},{id:119,nombre:"Capacitación de buenas prácticas de manipulación de alimentos"},
    {id:123,nombre:"Constancia declaración y pago - PLAME"},{id:124,nombre:"Planilla electrónica R01"},{id:125,nombre:"Constancia de pago AFP"},{id:126,nombre:"Constancia depósito CTS - Mayo y Noviembre"},
    {id:127,nombre:"Constancia depósito gratificación - Julio y Diciembre"},{id:128,nombre:"Título del profesional"},{id:129,nombre:"Evidencia colegiatura habilitada"},{id:130,nombre:"Registro nacional de especialidad"},
    {id:131,nombre:"Constancia/Carnet SUCAMEC"},{id:132,nombre:"Certificado capacitacion - BLS (Basic Life Support)"},{id:133,nombre:"Certificado capacitacion - PHLS (Prehospital Trauma Life Support)"},
    {id:134,nombre:"Certificado capacitacion - ACLS (Advance Cardiovascular Life Support)"},{id:137,nombre:"Procedimiento de acreditación en SST para subcontratistas"},
    {id:138,nombre:"Declaración jurada - capacitación"},{id:139,nombre:"Constancia del centro educativo de formación"},{id:140,nombre:"Difusión de plan de respuesta a emergencia del cliente"},
    {id:141,nombre:"Charla de inducción SST y MA"},{id:142,nombre:"Difusión y entrega de política de sostenibilidad del cliente"},{id:143,nombre:"Difusión y entrega plan COVID-19"},
    {id:144,nombre:"Capacitación en matriz IPERC"},{id:145,nombre:"Capacitación en matriz IAAS"},{id:146,nombre:"Capacitación en primeros auxilios"},{id:147,nombre:"Capacitación en uso extintor"},
    {id:148,nombre:"Capacitación en plan contingencia"},{id:149,nombre:"Capacitación en procedimiento de trabajo"},{id:150,nombre:"Capacitación en ATS"},{id:151,nombre:"Capacitación en capacitación uso de EPP"},
    {id:152,nombre:"Capacitación en manejo de insumos químicos - hojas MSDS"},{id:153,nombre:"Capacitación en uso de herramientas manuales"},{id:154,nombre:"Capacitación en procedimiento de señalización"},
    {id:155,nombre:"IBT 1"},
    {id:156,nombre:"IBT 2"},
    {id:157,nombre:"IBT 3"},
    {id:158,nombre:"IBT 4"},
    {id:159,nombre:"IBT 5"}
];

var textoBotonVolverContenidoExamCon =
   "<button class='btn btn-success' style='float:left' onclick='volverDivSubContenidoExamCon(this)'>" +
      "<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i>" +
   "</button>";

function toggleMenuOpcionExam(obj,pindex){
   objExamenContratista = listFullExamenesContratista[pindex];

	if(!$(obj).parent().parent().parent(".eventoGeneral").find("ul").is(":visible")){
		$(".listaFinalGestionGosst").hide();
	}

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
}

var funcionalidadesExamen=[ 
    /* {id:"opcDescarga",nombre:"<i class='fa fa-download'></i>&nbspDescargar",functionClick:function(data){
        window.open(URL+"/contratista/examen/evidencia?id="+objExamenContratista.id,'_blank')
       }},*/
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i>&nbspEditar",
    functionClick:function(data){validacionPreviaTrabajadoresEditarExamenContratista();}},
   {id:"opcElimnar",nombre:"<i class='fa fa-trash-o'></i>&nbspEliminar",
    functionClick:function(data){eliminarExamenContratista()}}
];

function marcarSubOpcionExamen(pindex){
   funcionalidadesExamen[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
} 

function ocultarFiltroExamenContratista(){
   $("#modalFiltroExamContratista").modal("hide");
}

function verFiltroExamenContratista(){
   actualizarOpcionesVigenciaExamenes();
   $("#modalFiltroExamContratista").modal("show");
}

function crearFiltroExamenContratista(functionCallBack,pexamenTipoId){
    var dataParam={
        empresaId: getSession("gestopcompanyid"),tipoExamenContratistaId:parseInt(pexamenTipoId)
    };
	  		
    callAjaxPost(URL+'/contratista/examenes/filtro',dataParam,function(data){
        listEvaluacionExamCon = data.listEvaluacion;objEmpresaInfoAux = data.objEmpresaInfoAux;claveEncriptarTexto = data.claveEncriptarTexto;
        mensajePersonalizado = data.mensajePersonalizado;

      	var contenido = "";

      	// P-A00036 (issue 803): cada vez que se abre una seccion, la vigencia vuelve a «Todos» y se borra la busqueda
      	filtroVigenciaExamenes = "todos";busquedaExamenes = "";vigenciaAplicaExamenes = false;vigenciaConteosExamenes = null;

      	var listContenido=[
         	{label:"Estado de la evaluación",inputForm:"",idDivContainer:"divFiltroEstadosEvaluacionExamCon"},
            {clase:"camposVigenciaFiltroExamenes",label:"Vigencia",
             inputForm:"<select id='selVigenciaExamCon' class='form-control' onchange='bloquearFechasVigenciaExamenes()'>" +
                           "<option value='todos'>Todos</option><option value='vigentes'>Vigentes</option>" +
                           "<option value='futuras'>Vigencia futura</option><option value='no_vigentes'>No vigentes</option>" +
                       "</select>"},
            {clase:"camposFechaFiltroExamenes",label:"",inputForm:"",styleTotal:styleLineaPunteadaClasica},
	        {clase:"camposFechaFiltroExamenes",label:"Fecha de registro - Inicio",inputForm:"<input id='fechaInicioRegExamCon' type='date' class='form-control'>"},
	    	{clase:"camposFechaFiltroExamenes",label:"Fecha de registro - Fin",inputForm:"<input id='fechaFinRegExamCon' type='date' class='form-control'>"},
	    	{clase:"camposFechaFiltroExamenes",label:"",inputForm:"<small id='notaFechasExamCon' style='display:none;'>Con esta opción no se usan las fechas.</small>"},
  	        {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	        {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroExamenContratista()'>" +
               	       "<i class='fa fa-times'></i> Cancelar" +
               	   "</button>",
  	         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='valoresFiltroExamenesContratista()'>" +
  	                       "<i class='fa fa-filter'></i> Aplicar" +
  	                   "</button>"},
        ]; 
  				
      	listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionTres(val);
      	});
   
      	examenTipoId = parseInt(pexamenTipoId);primeraVezMensajePersonalizado = 1;
      
      	listTipoExamenContratistaAux.forEach(function(val){
         	if(examenTipoId == val.id){
	    		examenTipoNombre = val.nombre;  
	 		}
      	});
  		
      	var modalOptions={
 	 		id:"modalFiltroExamContratista",nombre:"<i class='fa fa-filter'></i> Filtros - "+examenTipoNombre+" Registrados",
  	 		contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
      	};
  				
      	crearModalPrincipalUsuario(modalOptions,function(){
	 		if($("#filtroEstadosEvaluacionExamCon").length > 0){
	    		return;
	 		}
	                   
	 		crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvaluacionExamCon","",listEvaluacionExamCon,
	    		"id","nombre","#divFiltroEstadosEvaluacionExamCon","Todos");
      	},true,true);
   
      	var hoy = getSession("fechaHoyOrdenInversoTexto");
   
      	$("#fechaInicioRegExamCon").val(sumaFechaDias(-360,hoy));$("#fechaFinRegExamCon").val(sumaFechaDias(90,hoy));

        var mostrarFechasFiltro = ![14,16,34,101,128,129,130,132,133,134].includes(examenTipoId);
        $("#modalFiltroExamContratista .camposFechaFiltroExamenes").toggle(mostrarFechasFiltro);
        $("#modalFiltroExamContratista .camposVigenciaFiltroExamenes").hide();

        if([741,747,775].includes(parseInt(getSession("gestopcompanyid"))) && [79].includes(examenTipoId) && hasBloqueoSeccion == 1){
	    	ocultarFiltroExamenContratista();crearLoginBloqueoSeccionExamenContratista();
		}else{
	    	functionCallBack();
        }
    });
}

function valoresFiltroExamenesContratista(){
    ocultarFiltroExamenContratista(); 
    
    if($("#fechaInicioRegExamCon").val().length > 0 && $("#fechaFinRegExamCon").val().length > 0){
        listEstadosEvaluacionId = [];

        if(vigenciaAplicaExamenes){
            filtroVigenciaExamenes = $("#selVigenciaExamCon").val();
        }

        var estadoEvaluacionId = $("#filtroEstadosEvaluacionExamCon").val(); 
   
        if(estadoEvaluacionId != null){
            estadoEvaluacionId.forEach(function(val){
                listEstadosEvaluacionId.push(parseInt(val));
            });
        }
   
        habilitarExamenesContratista(1);
    }else{
		mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
		$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    	$("#modalFiltroExamContratista").modal("show");
		});
    }
}

var paginaActualExamenes = 1,totalPaginasExamenes = 0,numTotalExamenContratista = 0;
var cargandoExamenes = false;

function cambiarPaginaExamenes(pagina){
    if(cargandoExamenes || pagina < 1 || pagina > totalPaginasExamenes){
        return;
    }
	
    habilitarExamenesContratista(pagina);
}

function actualizarBotonesPaginacionExamenes(){
    $("#btnAnteriorExamenes").toggle(totalPaginasExamenes > 0 && paginaActualExamenes > 1).prop("disabled",cargandoExamenes);
    $("#btnSiguienteExamenes").toggle(paginaActualExamenes < totalPaginasExamenes).prop("disabled",cargandoExamenes);
}

function obtenerBotonesPaginacionExamenes(){
    var textoPagina = totalPaginasExamenes == 0 ? "Sin registros" :
        "Página " + paginaActualExamenes + " de " + totalPaginasExamenes;

    return "<span class='controlesPaginacionExamenes' style='display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;'>" +
               "<button type='button' id='btnAnteriorExamenes' class='btn btn-success' disabled style='padding:2px 8px' " +
                       "onclick='cambiarPaginaExamenes("+(paginaActualExamenes-1)+")' title='Página anterior' aria-label='Página anterior'>" +
                   "<i class='fa fa-chevron-left fa-4x' aria-hidden='true'></i>" +
               "</button>" +
               "<span style='font-size:14px;font-weight:bold;white-space:nowrap;margin:0 4px;' aria-live='polite'>"+textoPagina+"</span>" +
               "<button type='button' id='btnSiguienteExamenes' class='btn btn-success' disabled style='padding:2px 8px' " +
                       "onclick='cambiarPaginaExamenes("+(paginaActualExamenes+1)+")' title='Página siguiente' aria-label='Página siguiente'>" +
                   "<i class='fa fa-chevron-right fa-4x' aria-hidden='true'></i>" +
               "</button>" +
           "</span>";
}

// P-A00036 (issue 803): vigencia y buscador de las secciones de documentos. El servidor calcula el estado de cada documento (vigente, vigencia futura o no vigente, con
// la misma regla de los Indicadores y la fecha de hoy en hora de Lima) y los contadores; aqui se elige en «Opciones» (campo «Vigencia») y se muestra el buscador.
// La pantalla abre en «Todos»: todos los estados dentro de las fechas del filtro, como siempre. «Vigentes» y «Vigencia futura» no usan las fechas (se bloquean en el
// filtro); «No vigentes» si las usa. Los tipos sin fechas no llevan vigencia, y solo los documentos por trabajador llevan buscador: el servidor dice cuales con
// vigenciaAplica y busquedaAplica.
var filtroVigenciaExamenes = "todos",busquedaExamenes = "",vigenciaAplicaExamenes = false,busquedaAplicaExamenes = false,vigenciaConteosExamenes = null;
var LARGO_MINIMO_LISTA_CORTADA_EXAMENES = 900;
var MIN_CARACTERES_BUSQUEDA_EXAMENES = 3,ESPERA_BUSQUEDA_EXAMENES = 300,temporizadorBusquedaExamenes = null,enfocarBusquedaExamenes = false;

// Las opciones del campo «Vigencia» llevan los contadores del ultimo resultado; «Todos» no lleva (usa las fechas, no es la suma de las demas).
function actualizarOpcionesVigenciaExamenes(){
   var campo = $("#selVigenciaExamCon");

   if(campo.length == 0){
      return;
   }

   var c = vigenciaConteosExamenes || {vigentes:0,futuras:0,noVigentes:0};

   $("#modalFiltroExamContratista .camposVigenciaFiltroExamenes").toggle(vigenciaAplicaExamenes);
   campo.find("option[value='vigentes']").text("Vigentes ("+c.vigentes+")");
   campo.find("option[value='futuras']").text("Vigencia futura ("+c.futuras+")");
   campo.find("option[value='no_vigentes']").text("No vigentes ("+c.noVigentes+")");
   campo.val(filtroVigenciaExamenes);
   bloquearFechasVigenciaExamenes();
}

// «Vigentes» y «Vigencia futura» no usan las fechas: se bloquean para que se vea que no cuentan.
function bloquearFechasVigenciaExamenes(){
   var bloqueadas = vigenciaAplicaExamenes && ["vigentes","futuras"].includes($("#selVigenciaExamCon").val());

   $("#fechaInicioRegExamCon,#fechaFinRegExamCon").prop("disabled",bloqueadas);
   $("#notaFechasExamCon").toggle(bloqueadas);
}

// Las fechas pueden esconder documentos: se avisa en «Todos» (vigentes o de vigencia futura) y en «No vigentes» (no vigentes). Sin nada escondido no se escribe nada.
function textoAvisoFechasExamenes(){
   var c = vigenciaConteosExamenes;

   if(!vigenciaAplicaExamenes || c == null){
      return "";
   }

   if(filtroVigenciaExamenes == "todos" && c.vigentesFuera > 0){
      return "Hay "+(c.vigentesFuera == 1?"1 documento vigente o con vigencia futura":c.vigentesFuera+" documentos vigentes o con vigencia futura")+
         " fuera de las fechas elegidas. Elige «Vigentes» o «Vigencia futura» en Opciones para verlos.";
   }

   if(filtroVigenciaExamenes == "no_vigentes" && c.noVigentesFuera > 0){
      return "Hay "+(c.noVigentesFuera == 1?"1 documento no vigente":c.noVigentesFuera+" documentos no vigentes")+
         " fuera de las fechas elegidas. Amplía las fechas en Opciones para verlos.";
   }

   return "";
}

// El aviso de las fechas va arriba de la lista de documentos, solo cuando hace falta (sin texto no se pinta nada).
function textoAvisoPanelFechasExamenes(){
   var aviso = textoAvisoFechasExamenes();

   return (aviso.length == 0?"":"<div id='avisoFechasExamenes' class='eventoGeneral' style='font-size:13px;color:#8a6d3b;'>"+aviso+"</div>");
}

// El buscador es un panel propio, «Buscar trabajador», con el mismo estilo del buscador de la seccion Trabajadores: un campo de ancho completo debajo del titulo.
function textoBuscadorExamenes(){
   return "<div class='eventoGeneral'>" +
             "<input type='text' id='inputBusquedaExamenes' class='form-control' maxlength='100' autocomplete='off' " +
                    "placeholder='Buscar por nombre o apellido (mínimo "+MIN_CARACTERES_BUSQUEDA_EXAMENES+" caracteres)' " +
                    "aria-label='Buscar documentos por el nombre o apellido del trabajador' oninput='buscarExamenes()'>" +
             "<div id='avisoBusquedaExamenes' style='margin-top:8px;font-size:13px;' aria-live='polite'></div>" +
          "</div>";
}

// Con busqueda, el servidor dice que trabajadores del documento coinciden (hasta 20): la lista «TRABAJADOR(ES)» se corta a unos 37 nombres y el buscado podria no verse.
// Los nombres vienen de la base: se escapan antes de pintarse.
function textoCoincidenciasExamen(val){
   if(!val.coincidencias || val.coincidencias.length == 0){
      return "";
   }

   var nombres = val.coincidencias.map(function(nombre){
      return $("<div>").text(nombre).html();
   }).join("<br>");
   var total = parseInt(val.coincidenciasTotal) || val.coincidencias.length;
   var restantes = total - val.coincidencias.length;

   return "<div class='coincidenciasExamen' style='margin:0 0 8px;padding:6px 8px;background:#E3F1EE;border-radius:4px;'>" +
             "<i class='fa fa-search' aria-hidden='true'></i> <b>Coincide con "+total+" "+(total == 1?"trabajador":"trabajadores")+":</b><br>" +
             "<span style='font-weight:bold;'>"+nombres+"</span>" +
             (restantes > 0?"<br><span style='font-size:13px;'>y "+restantes+" más. Escribe más letras para acotar la búsqueda.</span>":"") +
          "</div>";
}

// La lista «TRABAJADOR(ES)» de cada documento llega del servidor con un tope de 1 024 caracteres (GROUP_CONCAT): con muchos trabajadores el ultimo nombre llega cortado a la
// mitad. Si hay menos nombres que trabajadores registrados, se quita ese ultimo nombre (incompleto) y se avisa cuantos se muestran de cuantos hay. Los nombres se pintan
// como siempre (la lista ya trae su propio formato).
function textoListaTrabajadoresExamen(val){
   var nombres = val.trabajadoresNombre.split(" - ");
   var total = parseInt(val.numTrabajadores) || nombres.length;
   // el tope es de 1 024 bytes: una lista mas corta no esta cortada aunque falte algun nombre (un trabajador sin nombre no entra en la lista)
   var cortada = (total > nombres.length && val.trabajadoresNombre.length >= LARGO_MINIMO_LISTA_CORTADA_EXAMENES);

   if(cortada){
      nombres.pop();
   }

   var aviso = "";

   if(cortada){
      aviso = "<div class='avisoListaTrabajadoresExamen' style='margin-top:6px;font-size:13px;color:#8a6d3b;'>" +
                 "Se muestran "+nombres.length+" de "+total+" trabajadores: la lista completa no cabe aquí." +
                 (busquedaAplicaExamenes?" Para ver si un trabajador está en este documento, usa «Buscar trabajador».":"") +
              "</div>";
   }

   return {html:nombres.join(" - ").replace(/-/gi,"<br>"),aviso:aviso};
}

// Lo que escribio el usuario se pone como valor del campo (nunca como HTML) y, si estaba escribiendo, el cursor vuelve al final.
function restaurarBusquedaExamenes(){
   var campo = $("#inputBusquedaExamenes");

   if(campo.length == 0){
      return;
   }

   campo.val(busquedaExamenes);

   if(enfocarBusquedaExamenes){
      campo.focus();
      var largo = campo.val().length;
      campo[0].setSelectionRange(largo,largo);
      enfocarBusquedaExamenes = false;
   }
}

// Palabras de la busqueda: cada una debe tener al menos 3 caracteres; las mas cortas se ignoran. Sin ninguna palabra valida no se busca.
function palabrasValidasBusquedaExamenes(texto){
   return $.trim(texto).split(/\s+/).filter(function(palabra){
      return palabra.length >= MIN_CARACTERES_BUSQUEDA_EXAMENES;
   });
}

function aplicarBusquedaExamenes(){
   var texto = $.trim($("#inputBusquedaExamenes").val());
   var aviso = $("#avisoBusquedaExamenes");

   if(texto.length > 0 && palabrasValidasBusquedaExamenes(texto).length == 0){
      aviso.text("Escribe al menos "+MIN_CARACTERES_BUSQUEDA_EXAMENES+" caracteres.");
      return;
   }

   aviso.text("");

   if(texto == busquedaExamenes || cargandoExamenes){
      return;
   }

   busquedaExamenes = texto;
   enfocarBusquedaExamenes = true;
   habilitarExamenesContratista(1);
}

// Espera un momento despues de la ultima tecla para no pedir al servidor con cada letra.
function buscarExamenes(){
   clearTimeout(temporizadorBusquedaExamenes);
   temporizadorBusquedaExamenes = setTimeout(aplicarBusquedaExamenes,ESPERA_BUSQUEDA_EXAMENES);
}

function habilitarExamenesContratista(pagina){
    if(cargandoExamenes){
        return;
    }
	
    var paginaSolicitada = (pagina == null?1:pagina);cargandoExamenes = true;actualizarBotonesPaginacionExamenes();
	
    objExamenContratista = {id:0};
   
    var listPanelesPrincipal = [];
	
    var contratistaId = parseInt(getSession("contratistaGosstId"));
   
    var dataParam={
        id:(contratistaId),examen:{tipo:{id:examenTipoId},pagina:paginaSolicitada,filtroVigencia:filtroVigenciaExamenes,busqueda:busquedaExamenes},empresaId:parseInt(getSession("gestopcompanyid")),
        perfil:{id: parseInt(getSession("perfilContratistaGosstId"))},
        fechaRegistroInicio:$("#fechaInicioRegExamCon").val(),fechaRegistroFin:$("#fechaFinRegExamCon").val(),
       listEstadoId:(listEstadosEvaluacionId.length == 0?null:listEstadosEvaluacionId)
    };
   
    callAjaxPost(URL+'/contratista/examenes/vista_contratista',dataParam,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
	            var textIn = "",textDocNivelesExam = "",textTrabAltoRiesgoAux = "",
			        textEvidencia = (examenTipoId == 78?"Certificado DIGESA":(examenTipoId == 79?"Certificado de aptitud médica ocupacional":(examenTipoId == 98?"Formulario de autorización":"Evidencia"))),
				    textEvidenciaAux = (examenTipoId == 98?"Control de acceso":(examenTipoId == 90?"Comprobante de pago":(examenTipoId == 79?"Certificados médicos adicionales":"Evidencia auxiliar")));

                paginaActualExamenes = data.pagina;totalPaginasExamenes = data.totalPaginas;numTotalExamenContratista = data.numTotalExamenContratista;
                vigenciaAplicaExamenes = (data.vigenciaAplica === true);busquedaAplicaExamenes = (data.busquedaAplica === true);vigenciaConteosExamenes = (data.vigenciaConteos || null);

                var aplicaFiltroFecha = ![14,16,34,101,128,129,130,132,133,134].includes(examenTipoId);
				
                var textoIntervaloExamenes = (aplicaFiltroFecha?"Desde "+convertirFechaNormal(dataParam.fechaRegistroInicio) +
                    " al "+convertirFechaNormal(dataParam.fechaRegistroFin):"");

                // el encabezado de «Opciones» dice lo que esta activo sin abrir el filtro: «Vigentes» y «Vigencia futura» no usan las fechas
                if(vigenciaAplicaExamenes && filtroVigenciaExamenes == "vigentes"){
                    textoIntervaloExamenes = "Vigentes";
                }else if(vigenciaAplicaExamenes && filtroVigenciaExamenes == "futuras"){
                    textoIntervaloExamenes = "Vigencia futura";
                }else if(vigenciaAplicaExamenes && filtroVigenciaExamenes == "no_vigentes"){
                    textoIntervaloExamenes = "No vigentes · "+textoIntervaloExamenes;
                }

                listFullExamenesContratista = data.examenes;listTipoVigencia = data.tipoVigencia;listTrabajadoresExamen = data.trabsExamen;
	     		listTrabajadoresExamenTodos = data.trabsTodos;listTipoExamenesAux = data.tipos;listTipoVacunaCovidAux = data.listTipoVacunaCovid;
	     		listMesExam = data.meses;listDocumentosCovidContratista = data.tiposDocCovid;listEnlacesExamContratista = data.listEnlacesExamContratista;
		 		listClinicaCertifDigesa = data.listClinicaCertifDigesa;

	     		$(".divListPrincipal").html("");
			
	     		listFullExamenesContratista.forEach(function(val,index){
					var btnOpcion = "",menuOpcion = "";
		 
					if(val.evaluacion.nota.id != 1){
						menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
			    		funcionalidadesExamen.forEach(function(val1,index1){
							menuOpcion += (val1.id == "opcElimnar" && val.evaluacion.nota.id != 3?"":"<li class='list-group-item' onclick='marcarSubOpcionExamen("+index1+")'>"+val1.nombre+"</li>");
						});
						menuOpcion += "</ul>";

						btnOpcion = "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionExam(this,"+index+")'>" +
							    "<i class='fa fa-angle-double-down' aria-hidden='true'></i> Ver Opciones" +
							"</a>";
					}
	        
	        		if(examenTipoId == 25){
	           			val.vigencia.nombre = "15 días";
	        		}

					var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
						"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia?id="+val.id+"'>" +
							"<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
						"</a>");

					var enlaceAuxiliar = (val.evidenciaAuxiliarNombre.trim().length == 0?"------":
						"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar?id="+val.id+"'>" +
							"<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarNombre +
						"</a>");

					var enlaceAuxiliarDos = (val.evidenciaAuxiliarDosNombre.trim().length == 0?"------":
						"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar_dos?id="+val.id+"'>" +
							"<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarDosNombre +
						"</a>");

					var enlaceAuxiliarTres = (val.evidenciaAuxiliarTresNombre.trim().length == 0?"------":
						"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar_tres?id="+val.id+"'>" +
							"<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarTresNombre +
						"</a>");

					var enlaceVacunacion = (val.evidenciaVacunacionNombre.trim().length == 0?"------":
						"<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaVacunacionUrl)+"'>" +
							"<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaVacunacionNombre +
						"</a>");

					var enlaceDni = (val.evidenciaDniNombre.trim().length == 0?"------":
						"<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaDniUrl)+"'>" +
							"<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaDniNombre +
						"</a>");

					var listTotal=[
						{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
						 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CÓDIGO "+val.codigo+" ***</span>"+(val.estadoVigencia == "futura"?" <span style='display:inline-block;margin-left:8px;padding:2px 8px;border-radius:8px;font-size:13px;font-weight:normal;background:#fcf8e3;color:#8a6d3b;'>Inicia el "+val.fechaTexto+"</span>":"")},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
					];

					if(![14,16,34,101,128,129,130,132,133,134].includes(val.tipo.id)){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha inicio de vigencia:",inputForm:val.fechaTexto},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha fin de vigencia:",inputForm:val.fechaFinVigenciaTexto});
					}

					if(val.tipo.id == 8){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil'></i> Descripción:",inputForm:(val.tema.trim().length == 0?"------":val.tema)});
					}

					if(val.tipo.id == 15){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info-circle'></i> Tipo de certificado:",inputForm:val.tipoCertificado.nombre});
					}

					if(val.tipo.id == 16){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Año:",inputForm:val.anio},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Mes:",inputForm:val.mes.nombre},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> N° de trabajadores:",inputForm:val.numTrabajadoresIndicador},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> Total de HH (Horas Hombres) trabajadas:",inputForm:val.numHorasHombres},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> N° de accidentes leves:",inputForm:val.numAccidentesLeves},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> N° de accidentes incapacitantes:",inputForm:val.numAccidentesIncapacitantes},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> N° de accidentes mortales:",inputForm:val.numAccidentesMortales},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> N° de días perdidos:",inputForm:val.numDiasPerdidos},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> Presupuesto mensual SST:",inputForm:(val.presupuestoMensual.trim().length == 0?"------":val.presupuestoMensual)});
					}

					if(val.tipo.id == 34){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha última dosis:",inputForm:val.fechaUltimaDosisTexto},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list'></i> Tipo de vacuna:",inputForm:val.tipoVacunaCovid.nombre},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> N° de dosis recibidas:",inputForm:val.numCantidadDosis},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil-square-o'></i> Observación adicional:",inputForm:(val.observacion.trim().length == 0?"------":val.observacion)});
					}

					if([78,95].includes(val.tipo.id)){
						var textCampoRegAux1 = (val.tipo.id == 95?"Área operativa":"Razón social de la clínica");

						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building-o'></i> "+textCampoRegAux1+":",inputForm:(val.razonSocial.trim().length == 0?"------":val.razonSocial)});
					}

					if(val.tipo.id == 79){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building-o'></i> Clínica (certificación DIGESA):",inputForm:val.clinicaCertifDigesaNombre},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-question-circle'></i> ¿Va a realizar alguna de las actividades listadas?",inputForm:(val.hasTrabAltoRiesgo == 1?"Sí":"No")});

						if(val.hasTrabAltoRiesgo == 1){
							listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list'></i> Actividad(es) seleccionada(s):",
								inputForm:(val.trabajosAltoRiesgoHabilitadosNombre.length == 0?"------":val.trabajosAltoRiesgoHabilitadosNombre)});
						}
					}

					if([44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,95].includes(val.tipo.id)){
						var textCampoRegAux2 = (val.tipo.id == 95?"Equipos autorizados":"Comentario");

						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil-square-o'></i> "+textCampoRegAux2+":",inputForm:(val.observacion.trim().length == 0?"------":val.observacion)});
					}

					if(val.tipo.id != 34){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> "+textEvidencia+":",inputForm:enlaceEvidencia});
					}

					if([2,38,79,90,98].includes(val.tipo.id)){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> "+textEvidenciaAux+":",inputForm:enlaceAuxiliar});
					}
					
					if([2].includes(val.tipo.id)){
					    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Comprobante de pago:",inputForm:enlaceAuxiliarDos}); 
					}

					if(parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Certificado de clínica:",inputForm:enlaceAuxiliar},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Riesgo de exposición al puesto de trabajo:",inputForm:enlaceAuxiliarDos},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Vacunación o declaración jurada de no patologías COVID-19:",inputForm:enlaceAuxiliarTres});
					}
					
					if(parseInt(getSession("gestopcompanyid")) == 272 && val.tipo.id == 1){
					    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Test de altura:",inputForm:enlaceAuxiliar});
					}

					if(val.tipo.id == 34){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Carné de vacunación:",inputForm:enlaceVacunacion},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> DNI (Parte frontal):",inputForm:enlaceDni});
					}

					if(val.evidenciaFechaTexto != "------" || val.fechaRegistroVacunacionTexto != "------"){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"*Registrado el",inputForm:(val.tipo.id == 34?val.fechaRegistroVacunacionTexto:val.evidenciaFechaTexto)});
					}

					if(val.trabajadoresNombre.trim().length > 0){
						var listaTrabExam = textoListaTrabajadoresExamen(val);

						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
							{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** TRABAJADOR(ES) ***</span>"},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
							{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-users' aria-hidden='true'></i> N° de trabajadores registrados:",inputForm:val.numTrabajadores},
							{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",
							 inputForm:textoCoincidenciasExamen(val)+"<a class='efectoLink' id='idLinkListTrabCon"+index+"' onclick='cambiarContLinkListTrabCon("+index+",1);'>" +
							     	 "Ocultar lista trabajadores <i class='fa fa-angle-double-up' aria-hidden='true'></i>" +
							 	 "</a>"+"<br>" +
								 "<div id='idDivListTrabCon"+index+"' style='font-weight:bold;background:#E4DCDC;'>" +
								      listaTrabExam.html+
								 "</div>"+listaTrabExam.aviso});
					}

					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
						{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
						 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EVALUACIÓN ***</span>"},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:val.evaluacion.nota.icono+" Estado:",inputForm:val.evaluacion.nota.nombre});

					if(![3,4].includes(val.evaluacion.nota.id)){
						if(val.evaluacion.nota.id != 1){
							listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Observación:",inputForm:val.evaluacion.observacion});
						}

						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Evaluado el",inputForm:val.evaluacion.fechaTexto});
					}

					var estiloGosst = (val.evaluacion.nota.id == 1?"gosst-aprobado":(val.evaluacion.nota.id == 2?"gosst-desaprobado":"gosst-advertencia"));

					textDocNivelesExam += "<div class='eventoGeneral "+estiloGosst+"'>" +
										      "<form class='eventoGeneral'>";
					listTotal.forEach(function(val,index){
						textDocNivelesExam += obtenerSubPanelModuloVersionDos(val);
					});
					textDocNivelesExam +=     "</form>" +
										  "</div>";
	     		});

	     		var listItemsGenerarExcel = [],listItemsExam = [];
	     
	     		if(listEnlacesExamContratista.length != 0){
					listEnlacesExamContratista.forEach(function(val,index){
		   			    var enlaceApoyo = "<a href='"+val.enlace+"' class='efectoLink' target='_blank'>" +
		         				"<i class='fa fa-external-link' aria-hidden='true'></i> Enlace" +
	              			"</a>";
		    
		   				listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:val.nombre,inputForm:enlaceApoyo});
					});
		
					listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
	     		}
	     
	     		var selVigenciaExam = crearSelectOneMenuOblig("selVigenciaExam","enviarValorVigenciaExam()",
	        		listTipoVigencia,(examenTipoId == 1?"4":""),"id","nombre");
	     
			if(examenTipoId == 5){
		listItemsExam.push(
	           {sugerencia:"",label:"Tema",
	            inputForm:"<input class='form-control' id='inputTemaExamenContr' placeholder=''>"}, 
	           {sugerencia:"Ej. PDF, word, escaneos",label:"Evidencia",inputForm:"",divContainer:"eviExamContratista"},
	       	   {sugerencia:"",label:"",
	            inputForm:"<button type='submit' class='btn btn-success'>" +
	            	         "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
	            	      "</button>"});
	     }else if(examenTipoId == 14){ 
		listItemsExam.push(
		   {sugerencia:"",label:"Trabajador",inputForm:"",divContainer:"divSelTrabExam"}, 
		   {sugerencia:" ",label:"Evidencia*",inputForm:"",divContainer:"eviExamContratista"},
		   {sugerencia:"",label:"",
		    inputForm:"<button type='submit' class='btn btn-success'>" +
		    	         "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
		    	      "</button>"});
	     }else if([4,6,8,15,43,60,61,63,64,65,72,73,74,75,76,77,79,84,89,90,99,100,101,111,112,113,114,115,116,117,118,119,128,129,130,131,132,133,134,140,141,142,
			 143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159].includes(examenTipoId)){
		     var valorDisable = ((examenTipoId == 43 && parseInt(getSession("gestopcompanyid")) == 647) || [4,6,8,60,79,84,89,111,112,113,114,115,116,117,118,119].includes(examenTipoId) || 
			     (parseInt(getSession("gestopcompanyid")) == 775 && [74,99].includes(examenTipoId))?"disabled":"");
		 
		     if(examenTipoId == 15){
		         var selTipoCertificadoExam = crearSelectOneMenu("selTipoCertificadoExam","",listTipoExamenesAux,"","id","nombre");
		
		         listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo Certificado",inputForm:selTipoCertificadoExam,divContainer:""});
		     }else if(examenTipoId == 79){
				 var selClinicaCertifDigesaExam = crearSelectOneMenu("selClinicaCertifDigesaExam","",listClinicaCertifDigesa,"","id","nombre");

				 listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Clínica (certificación DIGESA)",inputForm:selClinicaCertifDigesaExam,divContainer:""});
			 }
			 
			 if([4,6,90].includes(examenTipoId)){
				 listItemsExam.push({sugerencia:"",label:"",inputForm:"<button type='button' onclick='marcarTodosTrabajadores()' class='btn btn-success'>" +
				                         "<i class='fa fa-check-square-o'></i> Seleccionar todos " +
				                     "</button>",divContainer:""});
			 }
		
			 listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:([4,6,8,90,111,112,113,114,115,116,117,118,140,141,142,143,144,145,146,147,148,149,150,
			     151,152,153,154,155,156,157,158,159].includes(examenTipoId)?"Trabajador(es)":"Trabajador"),inputForm:"",divContainer:"divSelTrabExam"});

			 if(examenTipoId == 8){
				listItemsExam.push({sugerencia:"",label:"Descripción",inputForm:"<input class='form-control'  id='inputTemaExamenContr'>"});
			 }
			 
			 if(![101,128,129,130,132,133,134].includes(examenTipoId)){
				 listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de inicio de vigencia",
					  inputForm:"<input id='inputFechaExamenContr' onchange='hallarFechaFinVigenciaExamContratista()' class='form-control' type='date'>"},
					 {sugerencia:"Aproximado",anchoLabel:"",anchoDiv:"",label:"Vigencia",inputForm:selVigenciaExam},
					 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Último día de vigencia",
					  inputForm:"<input id='inputFechaFinExamenContr' class='form-control' type='date' "+valorDisable+">"});
			 }

			 listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:textEvidencia,inputForm:"",divContainer:"eviExamContratista"});
			 
			 if([79,90].includes(examenTipoId)){
			     listItemsExam.push({sugerencia:"",label:textEvidenciaAux,inputForm:"",divContainer:"eviAuxiliarExamContratista"});
			 }

			 if(examenTipoId == 79){
				 listTipoExamenesAux.forEach(function(val){
					 textTrabAltoRiesgoAux += (textTrabAltoRiesgoAux.length == 0?"":", ")+val.nombre;
				 });

				 var listBooleanSiNo = listBoolean.sort(function(val,val2){
					 return val2.id - val.id;
				 });

				 var radiosRespHasTrabAltoRiesgo = crearRadiosAutoVersionDos("radiosRespHasTrabAltoRiesgo",
					 listBooleanSiNo,"1","id","nombre","habilitarCamposAsociadosExamCont79","");

				 listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					 {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"¿Va a realizar alguna de las actividades listadas?*",inputForm:radiosRespHasTrabAltoRiesgo},
					 {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:textTrabAltoRiesgoAux,inputForm:""},
					 {sugerencia:"",clase:"campos-trab-alt-riesgo",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					 {sugerencia:"",clase:"campos-trab-alt-riesgo",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Actividades",
					  inputForm:"<a class='efectoLink' onclick='verCheckListTrabajosAltoRiesgoExamenContratista()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
					 {sugerencia:"",clase:"campos-trab-alt-riesgo",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divTrabAltoRiesgoExamCont"},
					 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
			 }

			 listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
	            	                                                                            "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
	            	                                                                        "</button>"});
	     }else if(examenTipoId == 16){ 
		var hoy = new Date();
		var listAnio = [];
			
		for(var i = -2;i < 2;i++){
	           listAnio.push({id:parseInt(hoy.getFullYear())+i,nombre:parseInt(hoy.getFullYear())+i})
		}
			
		var selAnioExam = crearSelectOneMenu("selAnioExam","",listAnio,"", 
		   "id","nombre","Por escoger");
			
		var selMesExam = crearSelectOneMenu("selMesExam","",listMesExam,"-1", 
		   "id","nombre","Por escoger");
		
		listItemsExam.push(
	           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Año",inputForm:selAnioExam},
	           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Mes",inputForm:selMesExam}, 
	           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"N° de trabajadores",
		    inputForm:"<input class='form-control' type='number' min='0' id='numberTrabajoTrab' value='0'>"}, 
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Total de HH (Horas Hombres) trabajadas",
	            inputForm:"<input class='form-control' type='number' min='0' id='numberTrabajoHoras' value='0'>"}, 
	           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"N° de accidentes leves",
		    inputForm:"<input class='form-control' type='number' min='0' id='cantidadAccLevesExamCon' value='0'>"}, 
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"N° de accidentes incapacitantes",
	            inputForm:"<input class='form-control' type='number' min='0' id='cantidadAccIncapExamCon' value='0'>"}, 
	           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"N° de accidentes mortales",
		    inputForm:"<input class='form-control' type='number' min='0' id='cantidadAccMortalExamCon' value='0'>"}, 
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"N° de días perdidos",
		    inputForm:"<input class='form-control' type='number' min='0' id='cantidadDiasPerdiExamCon' value='0'>"}, 
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Presupuesto mensual SST",
		    inputForm:"<input class='form-control' id='presupuestoMensualExamCon'>"}, 
	           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia *",
	            inputForm:"",divContainer:"eviExamContratista"},
     	           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
	            inputForm:"<button type='submit' class='btn btn-success'>" +
	            	         "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
	            	      "</button>"});
		
		var selAnioGenerarExcel = crearSelectOneMenu("selAnioGenerarExcel","",listAnio,"", 
			   "id","nombre","Por escoger");
		
		listItemsGenerarExcel.push(
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Año",inputForm:selAnioGenerarExcel},
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Realizar cálculos según...",
		       inputForm:
			   "<div style='display:flex; justify-content:space-evenly'>" +
		       		"<div>" +
		       			"<input type='radio' name='hhsel' id='1mill' checked>" +
		       			"<label for='1mill'>1 000 000 HH</label>" +
		       		"</div>" +
		       		"<div>" +
		       			"<input type='radio' name='hhsel' id='200mil'>" +
		       			"<label for='200mil'>200 000 HH</label>" +
		       		"</div>" +
		       	   "</div>"},
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
		            inputForm:"<button id='btnGenerarReporte' type='button' style='padding:5px 10px' class='btn btn-success'>" +
		            	         "<i class='fa fa-file-excel-o' style='font-size:1.3em'></i> Generar reporte" +
		            	      "</button>"}
		);
	     }else if(examenTipoId == 23){ 
		var tipoDocId = (parseInt(getSession("tipoContratistaGosstId")) == 1?10:11);
		
		if(objEmpresaInfoAux.evidenciaMaterialInduccionConRegNombre != 0){
		   var linkMaterialInduccion = 
		      "<a class='efectoLink' target='_blank' " +
	                 "href='"+URL+"/empresa/documento/evidencia?tipoId="+tipoDocId+"&id="+getSession("gestopcompanyid")+"'>" +
	                 "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	              "</a>";
		
		   listItemsExam.push({sugerencia:"",label:"Material inducción",inputForm:linkMaterialInduccion});
		}
		
		if(objEmpresaInfoAux.evidenciaCargoInduccionConNombre != 0){
		   var linkCargoInduccion =
		      "<a class='efectoLink'  target='_blank' " +
		         "href='"+URL+"/empresa/documento/evidencia?tipoId=12&id="+getSession("gestopcompanyid")+"'>" +
		         "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
		      "</a>";
		   
		   listItemsExam.push({sugerencia:"",label:"Cargo inducción",inputForm:linkCargoInduccion});
		}
		
		if(objEmpresaInfoAux.evidenciaMaterialInduccionConRegNombre != 0 || objEmpresaInfoAux.evidenciaCargoInduccionConNombre != 0){
		   listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}); 
		}
		
		listItemsExam.push(
		   {sugerencia:"",label:"Trabajadores",inputForm:"",divContainer:"divSelTrabExam"}, 
		   {sugerencia:"",label:"Fecha de inicio de vigencia",
		    inputForm:"<input onchange='hallarFechaFinVigenciaExamContratista("+examenTipoId+")' " +
		    	             "class='form-control' type='date' id='inputFechaExamenContr' placeholder=''>"},
		   {sugerencia:"Aproximado",label:"Vigencia",inputForm:selVigenciaExam},
		   {sugerencia:"",label:"Último día de vigencia",
		    inputForm:"<input class='form-control' type='date' id='inputFechaFinExamenContr' placeholder=''>"},
		   {sugerencia:"Ej. documentos, escaneos",label:"Evidencia",inputForm:"",divContainer:"eviExamContratista"},
		   {sugerencia:"",label:"",
		    inputForm:"<button type='submit' class='btn btn-success'>" +
		                 "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
		    	      "</button>"});
	     }else if([24,35,36,37,38,39,40,41,42].includes(examenTipoId)){ 
		     if(examenTipoId == 24){
	             var linkActaCompromiso = "<a class='efectoLink' target='_blank' href='"+URL+"/empresa/documento/evidencia?tipoId=13&id="+getSession("gestopcompanyid")+"'>" +
		                 "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
		             "</a>";
	        
	             listItemsExam.push({sugerencia:"",label:"Acta de compromiso",inputForm:linkActaCompromiso},
		             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
			 }
		
	         listItemsExam.push({sugerencia:"",label:"Fecha de inicio de vigencia",
		    	  inputForm:"<input onchange='hallarFechaFinVigenciaExamContratista("+examenTipoId+")' class='form-control' type='date' id='inputFechaExamenContr' placeholder=''>"},
	             {sugerencia:" (aproximado)",label:"Vigencia",inputForm:"<strong>1 año</strong>"},
	             {sugerencia:"",label:"Último día de vigencia",inputForm:"<label id='labelFechaFinExamenContr'></label>"},
	             {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"eviExamContratista"});

			 if(examenTipoId == 38){
				 listItemsExam.push({sugerencia:"",label:textEvidenciaAux+"*",inputForm:"",divContainer:"eviAuxiliarExamContratista"});
			 }

			 listItemsExam.push({sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success'>" +
			                                                          "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
			                                                      "</button>"});
	     }else if([44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,67,68,69,70,71,78,88,91,92,93,94,95,96,97,98,102,103,104,105,106,107,108,109,110,
	               123,124,125,126,127,137,138,139].includes(examenTipoId)){
			 var valorDisable = (![95,96,97,98,123,124,125,126,127,137,138,139].includes(examenTipoId)?"disabled":"");

			 listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de inicio de vigencia",
		    	  inputForm:"<input id='inputFechaExamenContr' onchange='hallarFechaFinVigenciaExamContratista()' class='form-control' type='date'>"},
		   		 {sugerencia:"Aproximado",anchoLabel:"",anchoDiv:"",label:"Vigencia",inputForm:selVigenciaExam},
		   		 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Último día de vigencia",
		          inputForm:"<input id='inputFechaFinExamenContr' class='form-control' type='date' "+valorDisable+">"});

			 if([78,95].includes(examenTipoId)){
				 var textCampoFormAux1 = (examenTipoId == 95?"Área operativa":"Razón social de la clínica");

				 listItemsExam.push({sugerencia:"",label:textCampoFormAux1,inputForm:"<input id='inputRazonSocialClinicaExaCon' class='form-control'></input>"});
			 }
		
			 if(![67,68,69,70,71,78,88,91,92,93,94,96,97,98,102,103,104,105,106,107,108,109,110,123,124,125,126,127,137,138,139].includes(examenTipoId)){
				 var textCampoFormAux2 = (examenTipoId == 95?"Equipos autorizados":"Comentario");

		   		 listItemsExam.push({sugerencia:"",label:textCampoFormAux2,inputForm:"<textarea class='form-control' id='textDetalleAdiExaCon' rows='3'></textarea>"});
			 }
		
			 listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:textEvidencia,inputForm:"",divContainer:"eviExamContratista"});

			 if(examenTipoId == 98){
				 listItemsExam.push({sugerencia:"",label:textEvidenciaAux,inputForm:"",divContainer:"eviAuxiliarExamContratista"});
			 }

			 listItemsExam.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
				 inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
					           "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
					       "</button>"});
	     }else if(examenTipoId == 25){ 
		listItemsExam.push(
		   {sugerencia:"(Solo 1)",anchoLabel:"",anchoDiv:"",
		    label:"Trabajador",inputForm:"",divContainer:"divSelTrabExam"}, 
	           {sugerencia:"",anchoLabel:"",anchoDiv:"",
		    label:"Fecha de inicio de vigencia",
		    inputForm:"<input onchange='hallarFechaFinVigenciaExamContratista("+examenTipoId+")' " +
		    		     "class='form-control' type='date' id='inputFechaExamenContr' placeholder=''>"}, 
		   {sugerencia:" (aproximado)",label:"Vigencia",inputForm:"<strong>15 días</strong>"},
		   {sugerencia:"",label:"Último día de vigencia",inputForm:"<label id='labelFechaFinExamenContr'></label>"},
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",
		    label:"Evidencia",inputForm:"",divContainer:"eviExamContratista"},
	           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
		    inputForm:"<button type='submit' class='btn btn-success'>" +
		                 "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
		              "</button>"});
	     }else if(examenTipoId == 34){
		var selTipoVacunaCovidExam = crearSelectOneMenuOblig("selTipoVacunaCovidExam","",
		   listTipoVacunaCovidAux,"","id","nombre");
			
		listItemsExam.push(
		   {sugerencia:"",label:"Trabajadores",inputForm:"",divContainer:"divSelTrabExam"},
	           {sugerencia:"",label:"Fecha última dosis",
		    inputForm:"<input class='form-control' type='date' id='inputFechaUltimaDosisExaCon'>"},
		   {sugerencia:"",label:"Tipo vacuna COVID-19",inputForm:selTipoVacunaCovidExam,divContainer:""}, 
		   {sugerencia:"",label:"N° de dosis recibidas",
	            inputForm:"<input class='form-control' type='number' min='1' id='inputCantidadDosisExaCon' value='1'>"},
	           {sugerencia:"",label:"Observación adicional",
		    inputForm:"<textarea class='form-control' id='textDetalleAdiExaCon' rows='3'></textarea>"},
		   {sugerencia:"",label:"Evidencia - Carné de vacunación",inputForm:"",divContainer:"eviCarneVacunacionExaCon"},
		   {sugerencia:"",label:"Evidencia - DNI (Parte frontal)",inputForm:"",divContainer:"eviDniExaCon"},
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		   {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
		    label:"<span style='color:red;font-size:10px;font-weight:bolder;'>NOTA:</span> " +
		           "<span style='font-size:10px;font-weight:bolder;'> Todos los datos expresados en esta ficha constituye una " +
		           "declaración jurada de mi parte. <br>" +
			   "He sido informado que, de omitir o falsear información, puedo perjudicar la salud de mis compañeros, y la " +
			   "mía propia, lo cual, de constituir una falta grave a la salud pública, asumo sus consecuencias.</span>",
		    inputForm:""},
		   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		   {sugerencia:"",label:"",
		    inputForm:"<button type='submit' class='btn btn-success'>" +
			         "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
			      "</button>"});
	     }else if(examenTipoId == 2){
		listItemsExam.push(
	           {sugerencia:"",label:"",
		    inputForm:"<button type='button' onclick='marcarTodosTrabajadores()' class='btn btn-success'>" +
			         "<i class='fa fa-check-square-o'></i> Seleccionar todos " +
			      "</button>",divContainer:""},
		   {sugerencia:"",label:"Trabajadores",inputForm:"",divContainer:"divSelTrabExam"}, 
		   {sugerencia:"",label:"Fecha de inicio de vigencia",
	            inputForm:"<input onchange='hallarFechaFinVigenciaExamContratista("+examenTipoId+")' " +
				     "class='form-control' type='date' id='inputFechaExamenContr' placeholder=''>"},
	           {sugerencia:"Aproximado",label:"Vigencia",inputForm:selVigenciaExam},
		   {sugerencia:"<label>*Modificación manual habilitada.</label>",label:"Último día de vigencia*",
		    inputForm:"<input class='form-control' type='date' id='inputFechaFinExamenContr' placeholder=''>"},
		   {sugerencia:"Ej. documentos, escaneos",label:"Evidencia",inputForm:"",divContainer:"eviExamContratista"},
		   {sugerencia:"",label:"Evidencia auxiliar",inputForm:"",divContainer:"eviAuxiliarExamContratista"},
		   {sugerencia:"",label:"Comprobante de pago",inputForm:"",divContainer:"eviAuxiliarDosExamContratista"},
		   {sugerencia:"",label:"",
		    inputForm:"<button type='submit' class='btn btn-success'>" +
			         "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
		              "</button>"});
	     }else{
		var nombreEvidencia = "Evidencia",valorDisable = (examenTipoId == 1?"disabled":""); 
		
		if(parseInt(getSession("gestopcompanyid")) == 647 && examenTipoId == 1){
		    nombreEvidencia = "EMO y protocolo médico";
		}else if(parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1){
			nombreEvidencia = "Habilitación médica ocupacional";
		}
		
		listItemsExam.push(
		   {sugerencia:"",label:"",
		    inputForm:"<button type='button' onclick='marcarTodosTrabajadores()' class='btn btn-success'>" +
			         "<i class='fa fa-check-square-o'></i> Seleccionar todos " +
			      "</button>",divContainer:""},
	           {sugerencia:"",label:"Trabajadores",inputForm:"",divContainer:"divSelTrabExam"}, 
	           {sugerencia:"",label:"Fecha de inicio de vigencia",
		    inputForm:"<input onchange='hallarFechaFinVigenciaExamContratista("+examenTipoId+")' " +
			             "class='form-control' type='date' id='inputFechaExamenContr' placeholder=''>"},
		   {sugerencia:"Aproximado",label:"Vigencia",inputForm:selVigenciaExam},
		   {sugerencia:"",label:"Último día de vigencia",
	            inputForm:"<input class='form-control' type='date' id='inputFechaFinExamenContr' placeholder='' "+valorDisable+">"},
	           {sugerencia:"Ej. documentos, escaneos",label:nombreEvidencia,inputForm:"",divContainer:"eviExamContratista"});
		
		if(parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1){
		    listItemsExam.push({sugerencia:"",label:"Certificado de clínica",inputForm:"",divContainer:"eviAuxiliarExamContratista"},
				{sugerencia:"",label:"Riesgo de exposición al puesto de trabajo",inputForm:"",divContainer:"eviAuxiliarDosExamContratista"},
				{sugerencia:"",label:"Vacunación o declaración jurada de no patologías COVID-19",inputForm:"",divContainer:"eviAuxiliarTresExamContratista"});
		}
		
		if(parseInt(getSession("gestopcompanyid")) == 272 && examenTipoId == 1){
		    listItemsExam.push({sugerencia:"",label:"Test de altura",inputForm:"",divContainer:"eviAuxiliarExamContratista"});
		}
		
		listItemsExam.push(
	           {sugerencia:"",label:"",
	            inputForm:"<button type='submit' class='btn btn-success'>" +
			         "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
			      "</button>"}); 
	     }
			
	     var textFormExamen = "";
			
	     listItemsExam.forEach(function(val,index){
	        textFormExamen += obtenerSubPanelModuloVersionDos(val);
	     });
	     
	     var btnInformacion = "",btnExamContValidacionAuto = "";
	     
//	     if(examenTipoId == 2){
//		btnExamContValidacionAuto = 
//                   "<button type='button' class='btn btn-success' " +
//		           "style='padding:2px 8px 2px 8px;margin-right:10px' onclick='evaluarExamenContratistaPorMedioDeIa()' " +
//			   "title='Evaluar documento por medio de IA según el formato establecido.'>" +
//		      "<i class='fa fa-file-pdf-o fa-4x'></i> <i class='fa fa-eye fa-2x'></i>" +
//	           "</button>"; 
//	     }
	     
	     if(mensajePersonalizado.length > 0){
		 btnInformacion = 
		     "<button type='button' class='btn btn-info' style='padding:2px 8px 4px 8px;margin-right:10px' onclick='verMensajePersonalizadoTipoExamCont()' " +
			     "title='Ver el mensaje personalizado asociado a la sección actual.'>" +
	                 "<i class='fa fa-2x fa-info-circle fa-4x'></i> <i class='fa fa-sticky-note-o fa-2x'></i>" +
		     "</button>";
	     }
	     
	     if(examenTipoId == 16){
		 var textFormGenerarReporte = "";
		 
		 listItemsGenerarExcel.forEach(function(val,index){
		     textFormGenerarReporte += obtenerSubPanelModuloVersionDos(val);
		 })
	     }
	     
	     if(examenTipoId == 16){
		listPanelesPrincipal.push(
	           {id:"generarConsolidadoExamen",clase:"",
	            nombre:"Generar Reporte de Estadísticas Mensual",
		    contenido:"<form id='formGenerarExcel' class='eventoGeneral'>"+textFormGenerarReporte+"</form>"});
	     }
	     
	     if(examenTipoId == 4 && objEmpresaInfoAux.evidenciaCargoNombre.length != 0){
	        listPanelesPrincipal.push({id:"descargarCargo",clase:"",nombre:"",contenido:""});
	     }
	        
	     if(examenTipoId == 4 && objEmpresaInfoAux.evidenciaReglamentoNombre.length != 0){
	        listPanelesPrincipal.push({id:"descargarReg",clase:"",nombre:"",contenido:""});
	     }
			
	     listPanelesPrincipal.push(
	        {id:"nuevoMovilExamen",clase:"",buttonAd:btnInformacion+btnExamContValidacionAuto,
	         nombre:""+"Nuevo registro de "+examenTipoNombre,
		 contenido:"<form id='formNuevoExamen' class='eventoGeneral'>"+textFormExamen+"</form>"},
		{id:"editarMovilExamen",clase:"",
		 nombre:""+"Editar "+examenTipoNombre,
		 contenido:"<form id='formEditarExamen' class='eventoGeneral'>"+textFormExamen+"</form>"},
             {id:"opcionesExamenContratista",clase:"",
             nombre:"Opciones"+(textoIntervaloExamenes.length > 0?"<span style='display:inline-block;margin-left:15px;font-size:14px;font-weight:bold;'>("+textoIntervaloExamenes+")</span>":""),
             buttonAd:"<button type='button' class='btn btn-success' style='padding:2px 8px;margin-right:10px' onclick='verFiltroExamenContratista()' " +
                              "title='Ver filtros' aria-label='Ver filtros'>" +
                          "<i class='fa fa-filter fa-4x' aria-hidden='true'></i>" +
                      "</button>",contenido:""});

	     // el buscador es un panel propio, como el de la seccion Trabajadores; solo lo llevan los tipos por trabajador
	     if(busquedaAplicaExamenes){
	        listPanelesPrincipal.push({id:"buscadorExamenes",clase:"",nombre:"Buscar trabajador",contenido:textoBuscadorExamenes()});
	     }

	     listPanelesPrincipal.push(
	        {id:"examContratista",clase:"divExamenContratistaGeneral",
             buttonAd:obtenerBotonesPaginacionExamenes(),
             nombre:"<span class='tituloExamenesPaginados'>"+examenTipoNombre+" registrados ("+numTotalExamenContratista+")</span>",
             contenido:textoAvisoPanelFechasExamenes()+(listFullExamenesContratista.length == 0?"<div class='eventoGeneral'>Sin registros.</div>":textDocNivelesExam)});
	     
	     agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);

	     restaurarBusquedaExamenes();
	     actualizarOpcionesVigenciaExamenes();

             $("#opcionesExamenContratista").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
             $("#opcionesExamenContratista").children(".contenidoSubList").hide();

             $("#buscadorExamenes").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
             $("#buscadorExamenes").children(".contenidoSubList").show();

             $("#examContratista").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
             $("#examContratista").children(".contenidoSubList").show();

             var cabeceraExamenes = $("#examContratista").children(".tituloSubList");
			 
             cabeceraExamenes.css({display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"});
			 
             cabeceraExamenes.children(".tituloExamenesPaginados").css("order",0);
			 
             cabeceraExamenes.children(".controlesPaginacionExamenes").css({order:1,marginLeft:"auto"});

	     if(examenTipoId == 16){
		$("#btnGenerarReporte").on("click",function(){
	           var anioSel = $("#selAnioGenerarExcel").val();
	           
	           var hhSel = 1000000;
	           var radioButtonsGroup = $('input[name="hhsel"]');
	           for(var i=0; i<radioButtonsGroup.length; i++){
	               if(radioButtonsGroup[i].checked){
	        	   switch (i){
	        	   	case 0:
	        	   	    hhSel = 1000000;
	        	   	    break;
	        	   	case 1:
	        	   	    hhSel = 200000;
	        	   	    break;
	        	   }
	               }
	           }
			 
	           if(anioSel == "-1"){
		      mensajeUx="<label>Debe seleccionar un año para generar el reporte.</label>";
		      mensajesUx(mensajeUx,2,"","ExamenContratista");
	           }else{
		      $("#btnGenerarReporte").attr("onclick",
		         "window.open('"+URL+"/contratista/examenes/reporte_estadisticas/excel?id="+contratistaId +
		            "&examenTipoId="+examenTipoId+"&anioSel="+anioSel+"&idCompany="+getSession("gestopcompanyid")+"&hhSel="+hhSel+"')");
	           }
		});	      
	     }
	     
	     if(examenTipoId == 4 && objEmpresaInfoAux.evidenciaCargoNombre.length != 0){
	        var textoBtn =
	           "<a class='btn btn-success' target='_blank' " +
	              "href='"+URL+"/empresa/documento/evidencia?tipoId=1&id="+getSession("gestopcompanyid")+"'>" +
	              "<i class='fa fa-download fa-2x' aria-hidden='true'></i>" +
	           "</a>";
	        
	        if(parseInt(getSession("gestopcompanyid")) == 647){
	           $("#descargarCargo").find(".tituloSubList").html(textoBtn+"Descargar formato de cargo SSOMA del Cliente");
	        }else{
		   $("#descargarCargo").find(".tituloSubList").html(textoBtn+"Descargar formato de cargo del Cliente");
	        }
	     }
	     
	     if(examenTipoId == 4 &&  objEmpresaInfoAux.evidenciaReglamentoNombre.length != 0){	
		var textoBtn2 = 
		   "<a class='btn btn-success' target='_blank' " +
		      "href='"+URL+"/empresa/documento/evidencia?tipoId=2&id="+getSession("gestopcompanyid")+"'>" +
	              "<i class='fa fa-download fa-2x' aria-hidden='true'></i>" +
		   "</a>";
		        
		if(parseInt(getSession("gestopcompanyid")) == 647){
		   $("#descargarReg").find(".tituloSubList").html(textoBtn2+"Descargar Reglamento Interno SSOMA del cliente");
		}else{
	           $("#descargarReg").find(".tituloSubList").html(textoBtn2+"Descargar Reglamento Interno SST del cliente"); 
		}
	     }
	     
	     if(examenTipoId != 34){
			 var mensajeAuxEvi = (examenTipoId == 1?([647,741].includes(parseInt(getSession("gestopcompanyid")))?"":"*Certificado de aptitud médica"):
				 (examenTipoId == 14?"*Adjuntar CV del prevencionista.":(examenTipoId == 79 && parseInt(getSession("gestopcompanyid")) == 741?"*Mínimo debe cumplir con el protocolo médico LAP.":"")));

			 var options={
		         container:"#formNuevoExamen #eviExamContratista",functionCall:function(){
		             if(examenTipoId == 2 && $("#inputEviExamenContratista0").val().indexOf(".pdf") > -1){
		                 $("#formNuevoExamen #eviExamContratista").append("<br><a class='efectoLink' onclick='verificarDocumentoExamenContratista()'>" +
				             "<i class='fa fa-eye'></i> Verificar DNI documento" +
				         "</a>");
		             }

					 validacionSubirEvidencia("ExamenContratista"+objExamenContratista.id,bitsEvidenciaExamen,"");
		         },descargaUrl:"",esNuevo:true,idAux:"ExamenContratista"+objExamenContratista.id,evidenciaNombre:"",mensajeAux:mensajeAuxEvi
	        };
			
	        crearFormEvidenciaAmazonS3Completa(options);
	        
	        if([2,38,79,90,98].includes(examenTipoId) || ([272,741].includes(parseInt(getSession("gestopcompanyid"))) && examenTipoId == 1)){
				var textoEviAux = (examenTipoId == 2?"[Opcional (subir en caso el SCTR se encuentre separado)].":
				    (examenTipoId == 38 || (parseInt(getSession("gestopcompanyid")) != 773 && examenTipoId == 90)?"[Opcional].":
				    (examenTipoId == 79?"[Para trabajos en altura y espacios confinados].":
					(parseInt(getSession("gestopcompanyid")) == 272 && examenTipoId == 1?"[En caso aplique el documento]":""))));

	            var optionsAux={
	 	            container:"#formNuevoExamen #eviAuxiliarExamContratista",functionCall:function(){
	 		            validacionSubirEvidencia("AuxExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
	 	            },descargaUrl:"",esNuevo:true,idAux:"AuxExaCon"+objExamenContratista.id,
	 	            evidenciaNombre:"",mensajeAux:textoEviAux
	           	};
	 				
	           	crearFormEvidenciaAmazonS3Completa(optionsAux);
	        }

			 if((parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1) || examenTipoId == 2){
			     var textoEviAuxDos = (parseInt(getSession("gestopcompanyid")) != 773 && examenTipoId == 2?"[Opcional]":"");
			     
				 var optionsAuxDos={
					 container:"#formNuevoExamen #eviAuxiliarDosExamContratista",functionCall:function(){
						 validacionSubirEvidencia("AuxDosExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
					 },descargaUrl:"",esNuevo:true,idAux:"AuxDosExaCon"+objExamenContratista.id,evidenciaNombre:"",
					 mensajeAux:textoEviAuxDos
				 };

				 crearFormEvidenciaAmazonS3Completa(optionsAuxDos);
				 
			 }

			 if(parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1){
				 var optionsAuxTres={
					 container:"#formNuevoExamen #eviAuxiliarTresExamContratista",functionCall:function(){
						 validacionSubirEvidencia("AuxTresExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
					 },descargaUrl:"",esNuevo:true,idAux:"AuxTresExaCon"+objExamenContratista.id,evidenciaNombre:""
				 };

				 crearFormEvidenciaAmazonS3Completa(optionsAuxTres);
			 }
	     }else{
		var optionsCarne={
	           container: "#formNuevoExamen #eviCarneVacunacionExaCon",functionCall: function(){
	              validacionSubirEvidencia("CarneVacExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
	           },descargaUrl: "",esNuevo: true,idAux: "CarneVacExaCon"+objExamenContratista.id,evidenciaNombre: "",
	           mensajeAux: "*Subir cartilla de vacunación física/electrónica con 2 dosis de vacuna " +
                               "o más (excepto Johnson & Johnson, que puede ser una)."
		};
				
		crearFormEvidenciaAmazonS3Completa(optionsCarne);
		   
		var optionsDni={
	           container: "#formNuevoExamen #eviDniExaCon",functionCall: function(){
	              validacionSubirEvidencia("DniExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
	           },descargaUrl: "",esNuevo: true,idAux: "DniExaCon"+objExamenContratista.id,evidenciaNombre: "",
	           mensajeAux: "*El DNI se solicita para poder verificar en el MINSA la validez del " +
	      		       "certificado de vacunación."
		};
						
		crearFormEvidenciaAmazonS3Completa(optionsDni);
	     }	
	     
//	     if(examenTipoId == 2){
//	        $("#formNuevoExamen #eviExamContratista").append("<small>Lectura de DNI habilitada, luego de subir evidencia</small>");
//	     }
		
	     if([25,34].includes(examenTipoId)){
		var slcTrabajadoresExamen = crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresExamen"+objExamenContratista.id,"",
		   listTrabajadoresExamen,"id","nombreCompleto","#nuevoMovilExamen #divSelTrabExam","Trabajadores ...",1);
	     }else{
		var slcTrabajadoresExamen = crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresExamen"+objExamenContratista.id,"",
	           listTrabajadoresExamen,"id","nombreCompleto","#nuevoMovilExamen #divSelTrabExam","Trabajadores ...");
	     }
	     
	     var listGrupoTrabajadores=[
	         {nombre:"Sin asignar",subtipos:[]},{nombre:"Asignados / Sin Aprobar",subtipos:[]},{nombre:"Aprobados",subtipos:[]}
	     ];
			
	     listTrabajadoresExamen.forEach(function(val){
			 val.ordenExamenMedico = (val.indicadorExamenMedico == null?0:(val.notaExamenMedico != 1?1:2));
	        
			 val.ordenSctr = (val.indicadorSctr == null?0:(val.notaSctr != 1?1:2));
	        
			 val.ordenEpp = (val.indicadorEpp == null?0:(val.notaEpp != 1?1:2));
	        
			 val.ordenCargo = (val.indicadorCargo == null?0:(val.notaCargo != 1?1:2));
	        
			 val.ordenRegistro = (val.indicadorRegistro == null?0:(val.notaRegistro != 1?1:2));

			 val.ordenHabilitadoMedicoClinica = (val.indicadorHabilitadoMedicoClinica == null?0:(val.notaHabilitadoMedicoClinica != 1?1:2));
		 });
			
	     listTrabajadoresExamen.forEach(function(val){
			 var trabAux={
				 id:val.id,nombre:val.nombreCompleto
			 };
				 
			 switch(examenTipoId){
				 case 1:
		      		 listGrupoTrabajadores[val.ordenExamenMedico].subtipos.push(trabAux);
					 break;
					
		   		 case 2:
		      		 listGrupoTrabajadores[val.ordenSctr].subtipos.push(trabAux);
		     	 	 break;

		   		 case 4:
		      		 listGrupoTrabajadores[val.ordenCargo].subtipos.push(trabAux);
		      		 break;

				 case 6:
		      		 listGrupoTrabajadores[val.ordenRegistro].subtipos.push(trabAux);
		      		 break;

				 case 8:
					 listGrupoTrabajadores[val.ordenEpp].subtipos.push(trabAux);
					 break;

				 case 79:
					 listGrupoTrabajadores[val.ordenHabilitadoMedicoClinica].subtipos.push(trabAux);
					 break;
	         }
	     });
			
	     if([1,2,4,6,8].includes(examenTipoId)){
	         crearSelectMultipleGrupoCompleto("slcTrabajadoresExamen"+objExamenContratista.id,"",listGrupoTrabajadores,
		         "#nuevoMovilExamen #divSelTrabExam","Trabajadores...");
	     }else if(examenTipoId == 79){
			 crearSelectMultipleGrupoCompletoVersionDos("slcTrabajadoresExamen"+objExamenContratista.id,"pruebaSeleccionAuxiliar()",listGrupoTrabajadores,
				 "id","nombre","#nuevoMovilExamen #divSelTrabExam","Trabajador...",1);
		 }else if([90,111,112,113,114,115,116,117,118,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159].includes(examenTipoId)){
		     crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresExamen"+objExamenContratista.id,"",
		         listTrabajadoresExamen,"id","nombreCompleto","#nuevoMovilExamen #divSelTrabExam","Trabajador ...");
		 }
	     
	     if([15,43,60,61,63,64,65,72,73,74,75,76,77,84,89,99,101,119,128,129,130,131,132,133,134].includes(examenTipoId)){
	         crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresExamen"+objExamenContratista.id,"",
		         listTrabajadoresExamen,"id","nombreCompleto","#nuevoMovilExamen #divSelTrabExam","Trabajador ...",1);
	        
	         $("#nuevoMovilExamen #divSelTrabExam").append("<small></small>");
	     }else if(examenTipoId == 14){
			 crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresExamen"+objExamenContratista.id,"",
		         listTrabajadoresExamen.filter(function(val){
		      		 return (val.numExamPrevencionista == 0);
		   		 }),"id","nombreCompleto","#nuevoMovilExamen #divSelTrabExam","Trabajador ...",1);

			 $("#nuevoMovilExamen #divSelTrabExam").append("<small></small>");
	     }

		 if(examenTipoId == 79){
			 crearCheckListGeneral("","Actividades","TrabAltoRiesgoExamContSelecNuevo",listTipoExamenesAux,
				 "TrabajosAltoRiesgoExamenContratista",ocultarCheckListTrabajosAltoRiesgoExamenContratista);

			 habilitarCamposAsociadosExamCont79(1);
		 }

		 if(examenTipoId == 99){
			 var hoy = getSession("fechaHoyOrdenInversoTexto");

			 $("#formNuevoExamen #inputFechaExamenContr").val(hoy);hallarFechaFinVigenciaExamContratista(examenTipoId);
		 }
			
	     $(".listaFinalGestionGosst").hide();$("#editarMovilExamen").hide();

	     $('#formNuevoExamen').on('submit',function(e){  
	        e.preventDefault();
	        objExamenContratista = {id:0};
	        guardarExamenContratista();
	     });
			 
	     $('#formEditarExamen').on('submit',function(e){  
	        e.preventDefault(); 
	        guardarExamenContratista();
	     });
	     
	     if(mensajePersonalizado.length > 0 && primeraVezMensajePersonalizado == 1){
		 verMensajePersonalizadoTipoExamCont();primeraVezMensajePersonalizado = 0;
	     }
	     
	     break;
			
         default:
	    alert("nop");
         
            break;
      }
   },null,null,null,function(){
       cargandoExamenes = false;
       actualizarBotonesPaginacionExamenes();
   });	
}

function habilitarCamposAsociadosExamCont79(opcion){
	var formDiv = (objExamenContratista.id == 0?$("#nuevoMovilExamen"):$("#editarMovilExamen"));

	(parseInt(opcion) == 0?formDiv.find(".campos-trab-alt-riesgo").hide():formDiv.find(".campos-trab-alt-riesgo").show());
}

function cambiarContLinkListTrabCon(pindex,val){
   if(val == 0){
      document.getElementById("idDivListTrabCon"+pindex).style.display = "";
       
      document.getElementById("idLinkListTrabCon"+pindex)
         .innerHTML = "Ocultar lista trabajadores <i class='fa fa-angle-double-up' aria-hidden='true'></i>";
   
      document.getElementById("idLinkListTrabCon"+pindex).onclick = function(){cambiarContLinkListTrabCon(pindex,1);}
   }else{
      document.getElementById("idDivListTrabCon"+pindex).style.display = "none";
       
      document.getElementById("idLinkListTrabCon"+pindex)
         .innerHTML = "Ver lista trabajadores <i class='fa fa-angle-double-down' aria-hidden='true'></i>";
   
      document.getElementById("idLinkListTrabCon"+pindex).onclick = function(){cambiarContLinkListTrabCon(pindex,0);}
   }
}

function ocultarCheckListTrabajosAltoRiesgoExamenContratista(){
	var formDiv = (objExamenContratista.id == 0?$("#nuevoMovilExamen"):$("#editarMovilExamen")),
		textCamposAux = (objExamenContratista.id == 0?"Nuevo":"Editar");
	var textTrabAltoRiesgoExamContSelec = "";

	listTipoExamenesAux.forEach(function(val,index){
		var isSeleccionado = ($("#checkAsignadoTrabAltoRiesgoExamContSelec"+textCamposAux+val.id).prop("checked")?1:0);

		if(isSeleccionado == 1){
			textTrabAltoRiesgoExamContSelec += (textTrabAltoRiesgoExamContSelec.length == 0?val.nombre:", "+val.nombre);
		}
	});

	textTrabAltoRiesgoExamContSelec = (textTrabAltoRiesgoExamContSelec.length == 0?"":textTrabAltoRiesgoExamContSelec);

	formDiv.find("#divTrabAltoRiesgoExamCont").html(textTrabAltoRiesgoExamContSelec);

	$("#modalCheckListTrabAltoRiesgoExamContSelec"+textCamposAux).modal("hide");
}

function verCheckListTrabajosAltoRiesgoExamenContratista(){
	var textCamposAux = (objExamenContratista.id == 0?"Nuevo":"Editar");

	$("#modalCheckListTrabAltoRiesgoExamContSelec"+textCamposAux).modal("show");
}

function cargarCheckListTrabajosAltoRiesgoExamenContratista(){
	if(objExamenContratista.trabajosAltoRiesgoHabilitadosId.length != 0){
		var trabAltoRiesgoSeleccionadosId = objExamenContratista.trabajosAltoRiesgoHabilitadosId.split(",");

		trabAltoRiesgoSeleccionadosId.forEach(function(val1){
			var checkboxTrabAltoRiesgo = document.getElementById('checkAsignadoTrabAltoRiesgoExamContSelecEditar'+val1);
			checkboxTrabAltoRiesgo.checked = true;
		});
	}

	ocultarCheckListTrabajosAltoRiesgoExamenContratista();
}

var fechaFinExamenValidacion;

function enviarValorVigenciaExam(){
   hallarFechaFinVigenciaExamContratista(examenTipoId);
}

function hallarFechaFinVigenciaExamContratista(exaTip){
   var editarDiv = $("#editarMovilExamen");
   var exaTipId = parseInt(exaTip);
	
   if(objExamenContratista.id == 0){
      editarDiv = $("#nuevoMovilExamen")
   }
	
   var fechaInicio = editarDiv.find("#inputFechaExamenContr").val();
   
   if(fechaInicio == null || fechaInicio == ''){
      if([24,25,35,36,37,38,39,40,41,42].includes(exaTipId)){
	 editarDiv.find("#labelFechaFinExamenContr").text(""); 
      }
      
      return;	
   }
   
   var vigenciaId;
   
   if([24,35,36,37,38,39,40,41,42].includes(exaTipId)){
      vigenciaId = parseInt("4");
   }else if([25].includes(exaTipId)){
      vigenciaId = parseInt("1");
   }else{
      vigenciaId = parseInt(editarDiv.find("#selVigenciaExam").val());  
   }
   
   var vigenciaObj = {};
   
   listTipoVigencia.forEach(function(val){
      if(val.id == vigenciaId){
         vigenciaObj = val;
      }
   });
   
   var date = convertirFechaTexto(fechaInicio);
   var newDate = new Date(date.setMonth(date.getMonth()+vigenciaObj.numMeses));
   
   if([24,35,36,37,38,39,40,41,42].includes(exaTipId)){
      fechaFinExamenValidacion = convertirFechaInput(newDate);
      editarDiv.find("#labelFechaFinExamenContr").text(convertirFechaNormal(newDate));
   }else if(exaTipId == 25){
      fechaFinExamenValidacion = convertirFechaInput(sumaFechaDias(15,fechaInicio));
      editarDiv.find("#labelFechaFinExamenContr").text(convertirFechaNormal(sumaFechaDias(15,fechaInicio)));	
   }else{
      editarDiv.find("#inputFechaFinExamenContr").val(convertirFechaInput(newDate));
   }
}

function verificarDocumentoExamenContratista(){
   guardarEvidenciaAuto(0,"fileEviExamenContratista"+objExamenContratista.id,bitsEvidenciaExamen,
      "/contratista/examen/analizar",function(data){
         if(data.CODE_RESPONSE == "05"){
	    if(data.exam == null){
	       alert("Archivo no compatible");return;
	    }
		
	    var numSelected = 0;
		
	    listTrabajadoresExamen.forEach(function(val){
	       val.selected = 0;
			
	       data.exam.trabajadores.forEach(function(val1){
	          if(val.id == val1.id){
		     numSelected++;
		     val.selected = 1;
	          } 
	       });
	    });
		
	    var slcTrabajadoresExamen=crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresExamen"+objExamenContratista.id,"",
	           listTrabajadoresExamen,"id","nombreCompleto","#nuevoMovilExamen #divSelTrabExam","Trabajadores ...");
		
	    alert(numSelected+" trabajador(es) asociado(s)")
         }else{
	    alert("Archivo no compatible");
         }
   },"",[{id:"contratistaId",value:getSession("contratistaGosstId")} ]);
}

function marcarTodosTrabajadores(){
   listTrabajadoresExamen.forEach(function(val){
      val.selected = 1;
   });
	
   var slcTrabajadoresExamen = crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresExamen"+objExamenContratista.id,"",
      listTrabajadoresExamen,"id","nombreCompleto","#nuevoMovilExamen #divSelTrabExam","Trabajadores ...");
}

function validacionPreviaTrabajadoresEditarExamenContratista(){
	if([1,2,4,6,90].includes(examenTipoId) && objExamenContratista.numTrabajadores > 50){
		cargarValoresTrabajadoresIdAsociadosDocumento();		
    }else{
	    editarExamenContratista();
    }
}

function cargarValoresTrabajadoresIdAsociadosDocumento(){
	var dataParam={
	    id:objExamenContratista.id
    };
		
	callAjaxPostSimpleVersionDos(1,URL+'/contratista/carga_valores_trabajador_contratista_id',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
			objExamenContratista.trabajadoresId = data.trabajadoresContratistaId;

			editarExamenContratista();
	    }else{
		    alert("Ocurrió un error al cargar el id de los trabajadores asociados al documento.");
	    }
    });
}

function editarExamenContratista(){
   $(".divListPrincipal>div").hide();window.scrollTo({top: 0,behavior: 'smooth'});
   var editarDiv = $("#editarMovilExamen");
	
   editarDiv.show();

	if([16,101,128,129,130,132,133,134].includes(examenTipoId)){
		editarDiv.find(".tituloSubList").html(textoBotonVolverContenidoExamCon+"Editar "+examenTipoNombre);
	}else{
		editarDiv.find(".tituloSubList").html(textoBotonVolverContenidoExamCon+"Editar "+examenTipoNombre+" del "+objExamenContratista.fechaTexto);
	}

   //
    var trabs = objExamenContratista.trabajadoresId;
    var idstrabs = trabs.split(",");
	
    listTrabajadoresExamenTodos.forEach(function(val1,index1){
        val1.selected = 0;
      
        idstrabs.forEach(function(val,index){
            if(val == val1.id){
	            val1.selected = 1;
         	}
      	});
   	});
	
   	editarDiv.find("#divSelTrabExam").html("");
   
    if([25,34,72,73,74,75,76,77,79,84,89,99,101,119,128,129,130,131,132,133,134].includes(examenTipoId)){
        var slcTrabajadoresExamen = crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresExamen"+objExamenContratista.id,"",
	        listTrabajadoresExamenTodos,"id","nombreCompleto","#editarMovilExamen #divSelTrabExam","Trabajadores ...",1);
   	}else{
      	var slcTrabajadoresExamen = crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresExamen"+objExamenContratista.id, "",
         	listTrabajadoresExamenTodos,"id","nombreCompleto","#editarMovilExamen #divSelTrabExam","Trabajadores ...");
   	}
   //	
   if(examenTipoId == 16){
      editarDiv.find("#selAnioExam").val(objExamenContratista.anio);
      editarDiv.find("#selMesExam").val(objExamenContratista.mes.id);
      editarDiv.find("#numberTrabajoTrab").val(objExamenContratista.numTrabajadoresIndicador);
      editarDiv.find("#numberTrabajoHoras").val(objExamenContratista.numHorasHombres);
      editarDiv.find("#cantidadAccLevesExamCon").val(objExamenContratista.numAccidentesLeves);
      editarDiv.find("#cantidadAccIncapExamCon").val(objExamenContratista.numAccidentesIncapacitantes);
      editarDiv.find("#cantidadAccMortalExamCon").val(objExamenContratista.numAccidentesMortales);
      editarDiv.find("#cantidadDiasPerdiExamCon").val(objExamenContratista.numDiasPerdidos);
      editarDiv.find("#presupuestoMensualExamCon").val(objExamenContratista.presupuestoMensual);
   }else if(examenTipoId == 34){
      editarDiv.find("#inputFechaUltimaDosisExaCon").val(convertirFechaInput(objExamenContratista.fechaUltimaDosis));
      editarDiv.find("#selTipoVacunaCovidExam").val(objExamenContratista.tipoVacunaCovid.id);
      editarDiv.find("#inputCantidadDosisExaCon").val(objExamenContratista.numCantidadDosis);
      editarDiv.find("#textDetalleAdiExaCon").val(objExamenContratista.observacion);
	   
      var optionsCarne={
         container: "#editarMovilExamen #eviCarneVacunacionExaCon",
         functionCall: function(){
            validacionSubirEvidencia("CarneVacExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
         },
         descargaUrl:objExamenContratista.evidenciaVacunacionUrl,
         esNuevo:(objExamenContratista.evidenciaVacunacionNombre.length == 0?true:false),
         idAux: "CarneVacExaCon"+objExamenContratista.id,
         evidenciaNombre: objExamenContratista.evidenciaVacunacionNombre,
         mensajeAux:"*Subir cartilla de vacunación física/electrónica con 2 dosis de vacuna " +
                    "o más (excepto Johnson & Johnson, que puede ser una)."
      };
					
      crearFormEvidenciaAmazonS3Completa(optionsCarne);	
      
      var optionsDni={
         container: "#editarMovilExamen #eviDniExaCon",
         functionCall: function(){
            validacionSubirEvidencia("DniExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
         },
         descargaUrl:objExamenContratista.evidenciaDniUrl,
         esNuevo:(objExamenContratista.evidenciaDniNombre.length == 0?true:false),
         idAux: "DniExaCon"+objExamenContratista.id,
         evidenciaNombre: objExamenContratista.evidenciaDniNombre,
         mensajeAux:"*El DNI se solicita para poder verificar en el MINSA la validez del " +
		    "certificado de vacunación."
      };
						
      crearFormEvidenciaAmazonS3Completa(optionsDni);
    }else{
        editarDiv.find("#selVigenciaExam").val(objExamenContratista.vigencia.id);
      	editarDiv.find("#inputFechaExamenContr").val(convertirFechaInput(objExamenContratista.fecha));
      	editarDiv.find("#inputTemaExamenContr").val(objExamenContratista.tema);
      	editarDiv.find("#selTipoCertificadoExam").val(objExamenContratista.tipoCertificado.id);
      	editarDiv.find("#textDetalleAdiExaCon").val(objExamenContratista.observacion);
	   	editarDiv.find("#inputRazonSocialClinicaExaCon").val(objExamenContratista.razonSocial);
	    editarDiv.find("#selClinicaCertifDigesaExam").val(objExamenContratista.clinicaCertifDigesaId);
   	}
   
   if([4,6,8,24,25,35,36,37,38,39,40,41,42,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,67,68,69,70,71,78,88,91,92,93,94,95,96,97,98,
       102,103,104,105,106,107,108,109,110,123,124,125,126,127,137,138,139].includes(examenTipoId)){
      hallarFechaFinVigenciaExamContratista(examenTipoId);
   }else{
      if(examenTipoId != 34){
         editarDiv.find("#inputFechaFinExamenContr").val(convertirFechaInput(objExamenContratista.fechaFinVigencia));
      }
   }
	
    if(examenTipoId != 34){
		var mensajeAuxEvi = (examenTipoId == 1?([647,741].includes(parseInt(getSession("gestopcompanyid")))?"":"*Certificado de aptitud médica"):
			(examenTipoId == 14?"*Adjuntar CV del prevencionista.":(examenTipoId == 79 && parseInt(getSession("gestopcompanyid")) == 741?"*Mínimo debe cumplir con el protocolo médico LAP.":"")));

		var options={
	        container:"#editarMovilExamen #eviExamContratista",functionCall:function(){
	            validacionSubirEvidencia("ExamenContratista"+objExamenContratista.id,bitsEvidenciaExamen,"");
	 	    },descargaUrl:"/contratista/amazon_s3/examen/evidencia?id="+objExamenContratista.id,
			esNuevo:(objExamenContratista.evidenciaNombre.length == 0?true:false),
	        idAux:"ExamenContratista"+objExamenContratista.id,evidenciaNombre:objExamenContratista.evidenciaNombre,
			mensajeAux:mensajeAuxEvi
        };

		crearFormEvidenciaCompleta(options);
      
      	if([2,38,79,90,98].includes(examenTipoId) || ([272,741].includes(parseInt(getSession("gestopcompanyid"))) && examenTipoId == 1)){
		    var textoEviAux = (examenTipoId == 2?"[Opcional (subir en caso el SCTR se encuentre separado)].":
		        (examenTipoId == 38 || (parseInt(getSession("gestopcompanyid")) != 773 && examenTipoId == 90)?"[Opcional].":
				(examenTipoId == 79?"[Para trabajos en altura y espacios confinados].":
				(parseInt(getSession("gestopcompanyid")) == 272 && examenTipoId == 1?"[En caso aplique el documento]":""))));

            var optionsAux={
	            container:"#editarMovilExamen #eviAuxiliarExamContratista",functionCall:function(){
	                validacionSubirEvidencia("AuxExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
	    	    },descargaUrl:"/contratista/amazon_s3/examen/evidencia_auxiliar?id="+objExamenContratista.id,
	    	    esNuevo:(objExamenContratista.evidenciaAuxiliarNombre.length == 0?true:false),
	    	    idAux:"AuxExaCon"+objExamenContratista.id,evidenciaNombre:objExamenContratista.evidenciaAuxiliarNombre,
	    	    mensajeAux:textoEviAux
		  	};

		  	crearFormEvidenciaCompleta(optionsAux);
        }

		    if((parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1) || examenTipoId == 2){
			var textoEviAuxDos = (parseInt(getSession("gestopcompanyid")) != 773 && examenTipoId == 2?"[Opcional]":"");
			
			var optionsAuxDos={
				container:"#editarMovilExamen #eviAuxiliarDosExamContratista",functionCall:function(){
					validacionSubirEvidencia("AuxDosExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
				},descargaUrl:"/contratista/amazon_s3/examen/evidencia_auxiliar_dos?id="+objExamenContratista.id,
				esNuevo:(objExamenContratista.evidenciaAuxiliarDosNombre.length == 0?true:false),
				idAux:"AuxDosExaCon"+objExamenContratista.id,evidenciaNombre:objExamenContratista.evidenciaAuxiliarDosNombre,
				mensajeAux:textoEviAuxDos
			};

			crearFormEvidenciaCompleta(optionsAuxDos);
		    }
		    
		    if(parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1){
			var optionsAuxTres={
				container:"#editarMovilExamen #eviAuxiliarTresExamContratista",functionCall:function(){
					validacionSubirEvidencia("AuxTresExaCon"+objExamenContratista.id,bitsEvidenciaExamen,"");
				},descargaUrl:"/contratista/amazon_s3/examen/evidencia_auxiliar_tres?id="+objExamenContratista.id,
				esNuevo:(objExamenContratista.evidenciaAuxiliarTresNombre.length == 0?true:false),
				idAux:"AuxTresExaCon"+objExamenContratista.id,evidenciaNombre:objExamenContratista.evidenciaAuxiliarTresNombre
			};

			crearFormEvidenciaCompleta(optionsAuxTres);
		    }
    }

	if(examenTipoId == 79){
		crearCheckListGeneral("","Actividades","TrabAltoRiesgoExamContSelecEditar",listTipoExamenesAux,
			"TrabajosAltoRiesgoExamenContratista",cargarCheckListTrabajosAltoRiesgoExamenContratista);

		if(objExamenContratista.hasTrabAltoRiesgo == 1){
			editarDiv.find("#1radiosRespHasTrabAltoRiesgo").prop("checked",true);editarDiv.find("#0radiosRespHasTrabAltoRiesgo").prop("checked",false);
		}else{
			editarDiv.find("#1radiosRespHasTrabAltoRiesgo").prop("checked",false);editarDiv.find("#0radiosRespHasTrabAltoRiesgo").prop("checked",true);
		}

		habilitarCamposAsociadosExamCont79(objExamenContratista.hasTrabAltoRiesgo);
	}
}

function guardarExamenContratista(){
   var formDiv = $("#editarMovilExamen");
	
   if(objExamenContratista.id == 0){
      formDiv = $("#nuevoMovilExamen");
   }
   
   var campoVacio = true;
   
    var tipoCertificado = formDiv.find("#selTipoCertificadoExam").val();
	var clinicaCertifDigesaId = formDiv.find("#selClinicaCertifDigesaExam").val();
   var anio = formDiv.find("#selAnioExam").val();
   var mes = formDiv.find("#selMesExam").val();
   var numTrabajadoresIndicador = formDiv.find("#numberTrabajoTrab").val();
   var numHorasHombres = formDiv.find("#numberTrabajoHoras").val();
   var numAccidentesLeves = formDiv.find("#cantidadAccLevesExamCon").val();
   var numAccidentesIncapacitantes = formDiv.find("#cantidadAccIncapExamCon").val();
   var numAccidentesMortales = formDiv.find("#cantidadAccMortalExamCon").val();
   var presupuestoMensual = formDiv.find("#presupuestoMensualExamCon").val();
   var numDiasPerdidos = formDiv.find("#cantidadDiasPerdiExamCon").val();
   var vigencia = formDiv.find("#selVigenciaExam").val();  
   var fecha = formDiv.find("#inputFechaExamenContr").val();
   var tema = formDiv.find("#inputTemaExamenContr").val();
   
   var fechaUltimaDosis = convertirFechaTexto(formDiv.find("#inputFechaUltimaDosisExaCon").val());
   var tipoVacunaCovidId = formDiv.find("#selTipoVacunaCovidExam").val();
   var numCantidadDosis = formDiv.find("#inputCantidadDosisExaCon").val();
   var observacion = formDiv.find("#textDetalleAdiExaCon").val();
	var razonSocial = formDiv.find("#inputRazonSocialClinicaExaCon").val();
   
    var habilitarExamContEvi = (examenTipoId != 34?1:0),
		habilitarAuxExamContEvi = ([2,38,79,90,98].includes(examenTipoId) || ([272,741].includes(parseInt(getSession("gestopcompanyid"))) && examenTipoId == 1)?1:0),
        habilitarCarneEvi = (examenTipoId == 34?1:0),habilitarDniEvi = (examenTipoId == 34?1:0),
	    habilitarAuxDosExamContEvi = ((parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1) || examenTipoId == 2?1:0),
	    habilitarAuxTresExamContEvi = (parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1?1:0);
   
    var inputEvi = $("#inputEviExamenContratista"+objExamenContratista.id).val();
    var inputEviAuxiliar = $("#inputEviAuxExaCon"+objExamenContratista.id).val();
    var inputEviCarVacExaCon = $("#inputEviCarneVacExaCon"+objExamenContratista.id).val();
    var inputEviDniExaCon = $("#inputEviDniExaCon"+objExamenContratista.id).val();
	var inputEviAuxiliarDos = $("#inputEviAuxDosExaCon"+objExamenContratista.id).val();
	var inputEviAuxiliarTres = $("#inputEviAuxTresExaCon"+objExamenContratista.id).val();
	var listTrabajosAltoRiesgoExamContSeleccionados = [],textoTrabajosAltoRiesgoExamContSeleccionados = "";
   
    // VALIDACIÓN - N° DE TRABAJADORES
    if([1,2,4,6,8,14,15,23,25,34,43,60,61,63,64,65,72,73,74,75,76,77,79,84,89,90,99,100,101,111,112,113,114,115,116,117,118,119,
        128,129,130,131,132,133,134,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159].includes(examenTipoId)){
        var trabsId = formDiv.find("#slcTrabajadoresExamen"+objExamenContratista.id).val();
        var trabajadoresFinal = [];
	 
      	if(trabsId.length == 0){
			campoVacio = false;mensajeUx = "<label>El campo trabajadores es obligatorio.</label>";
      	}else{
		 	trabsId.forEach(function(val,index){
	    		trabajadoresFinal.push({id:val});
	 		});
      	}
   	}

    if(campoVacio && examenTipoId == 15 && (tipoCertificado == -1 || tipoCertificado == null)){
	    campoVacio = false;mensajeUx = "<label>Debe seleccionar el tipo de certificado de trabajo de alto riesgo.</label>";
    }else if(campoVacio && examenTipoId == 78 && razonSocial.length == 0){
		campoVacio = false;mensajeUx = "<label>Debe ingresar la razón social de la clínica.</label>";
	}else if(campoVacio && examenTipoId == 79){
		var textCamposAux = (objExamenContratista.id == 0?"Nuevo":"Editar");
		var hasTrabAltoRiesgo = parseInt(formDiv.find("input[name='radiosRespHasTrabAltoRiesgo']:checked").val());

		listTipoExamenesAux.forEach(function(val){
			var isSeleccionado = ($("#checkAsignadoTrabAltoRiesgoExamContSelec"+textCamposAux+val.id).prop("checked")?1:0);

			if(isSeleccionado == 1){
				listTrabajosAltoRiesgoExamContSeleccionados.push({id:val.id});

				textoTrabajosAltoRiesgoExamContSeleccionados += (textoTrabajosAltoRiesgoExamContSeleccionados.length == 0?val.id:","+val.id);
			}
		});

		if((clinicaCertifDigesaId == -1 || clinicaCertifDigesaId == null)){
			campoVacio = false;mensajeUx = "<label>Debe seleccionar la clínica (certificación DIGESA).</label>";
		}else if(hasTrabAltoRiesgo == 1 && textoTrabajosAltoRiesgoExamContSeleccionados.length == 0){
			campoVacio = false;mensajeUx = "<label>Debe seleccionar al menos una actividad.</label>";
		}
	}else if(campoVacio && examenTipoId == 95 && (observacion.trim().length == 0 || razonSocial.trim().length == 0)){
		campoVacio = false;mensajeUx = "<label>Debe completar todos los campos.</label>";
	}
	  
    if([14,101,128,129,130,132,133,134].includes(examenTipoId) && campoVacio){
        vigencia = 6;
    }else if(examenTipoId == 16 && campoVacio){
      if(anio == -1 || mes == -1){
         mensajeUx = "<label>Debe seleccionar el mes y/o año respectivo.</label>";
         campoVacio = false;
      }else if(numTrabajadoresIndicador.length == 0 || numHorasHombres.length == 0 || numAccidentesLeves.length == 0 ||
         numAccidentesIncapacitantes.length == 0 || numAccidentesMortales.length == 0 || numDiasPerdidos.length == 0 ||
         presupuestoMensual.length == 0){
	 mensajeUx = "<label>Debe completar todos los campos respectivos.</label>";
	 campoVacio = false;	
      }
   }else if(examenTipoId == 34 && campoVacio){
      vigencia = 6;
	 	  
      if(fechaUltimaDosis == null){
	 mensajeUx = "<label>Debe ingresar la Fecha última dosis.</label>";
	 campoVacio = false;
      }else if(inputEviCarVacExaCon.length == 0 || inputEviDniExaCon.length == 0){
	 mensajeUx = "<label>Debe subir las evidencias Carné de vacunación y/o DNI (Parte frontal).</label>";
	 campoVacio = false; 
      }else if(inputEviCarVacExaCon == "VOLVER A SUBIR" || inputEviDniExaCon == "VOLVER A SUBIR"){
	 mensajeUx = "<label>Debe volver a subir las evidencias Carné de vacunación y/o DNI (Parte frontal)</label>";
         campoVacio = false;
      }  
   }else if(campoVacio){
      if([125,126,127].includes(examenTipoId)){
          vigencia = 3;    
      }else if([24,35,36,37,38,39,40,41,42,44,45,46,47,48,49,50,52,53,54,55,56,57,58,59,67,68,69,70,71,78].includes(examenTipoId)){
	      vigencia = 4; 
      }else if([25,123,124].includes(examenTipoId)){
          vigencia = 1;	
      }
				
      if(convertirFechaTexto(fecha) == null){
	      campoVacio = false;mensajeUx = "<label>El campo Fecha de registro es obligatorio.</label>"; 
      }else{
	      var fechaFinVigencia,numDiasVigencia = 0;
	    
	 	  if([24,25,35,36,37,38,39,40,41,42].includes(examenTipoId)){
	     	  fechaFinVigencia = convertirFechaTexto(fechaFinExamenValidacion);
	          numDiasVigencia = restaFechas(getSession("fechaHoyOrdenInversoTexto"),fechaFinExamenValidacion);
	 	  }else{
		 	  if(convertirFechaTexto(formDiv.find("#inputFechaFinExamenContr").val()) == null){
			 	  campoVacio = false;mensajeUx = "<label>El campo 'Último día de vigencia' es obligatorio.</label>";
		 	  }else{
			 	  fechaFinVigencia = convertirFechaTexto(formDiv.find("#inputFechaFinExamenContr").val()); 
			 	  numDiasVigencia = restaFechas(getSession("fechaHoyOrdenInversoTexto"),formDiv.find("#inputFechaFinExamenContr").val());
		 	  }
	 	  }
	         
	 	  if(numDiasVigencia < 0 && campoVacio){
	     	  campoVacio = false;mensajeUx = "<label>La fecha fin de vigencia no puede ser menor a la fecha de hoy.</label>";
	 	  }
      }
   }   
      
    if(habilitarExamContEvi == 1 && campoVacio){
		var textEvidencia = (examenTipoId == 78?"el certificado DIGESA":(examenTipoId == 79?"el certificado de aptitud médica ocupacional":
			(examenTipoId == 98?"el formulario de autorización":"la evidencia")));

      	if(inputEvi.length == 0){
			campoVacio = false;mensajeUx = "<label>Debe subir "+textEvidencia+".</label>";
      	}else if(inputEvi == "VOLVER A SUBIR"){
			campoVacio = false;mensajeUx = "<label>Debe volver a subir "+textEvidencia+".</label>";
      	}
   	}
   
    if(habilitarAuxExamContEvi == 1 && campoVacio){
		var textEvidenciaAuxiliar = (parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1?"el certificado de clínica":
		    (parseInt(getSession("gestopcompanyid")) == 272 && examenTipoId == 1?"el test de altura":(examenTipoId == 98?"el control de acceso":
			(examenTipoId == 90?"el comprobante de pago":(examenTipoId == 79?"los certificados médicos adicionales":"la evidencia auxiliar")))));

       	if(inputEviAuxiliar.length == 0 && ((parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1) || examenTipoId == 98)){
			campoVacio = false;mensajeUx = "<label>Debe subir "+textEvidenciaAuxiliar+".</label>";
       	}else if(inputEviAuxiliar == "VOLVER A SUBIR"){
			campoVacio = false;mensajeUx = "<label>Debe volver a subir "+textEvidenciaAuxiliar+".</label>";
      	}
	}

	if(habilitarAuxDosExamContEvi == 1 && campoVacio){
	    var textEvidenciaAuxiliarDos = (parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1?"riesgo de exposición al puesto de trabajo":"comprobante de pago");
	    
		if(inputEviAuxiliarDos.length == 0 && (parseInt(getSession("gestopcompanyid")) == 741 && examenTipoId == 1)){
			campoVacio = false;mensajeUx = "<label>Debe subir el "+textEvidenciaAuxiliarDos+".</label>";
		}else if(inputEviAuxiliarDos == "VOLVER A SUBIR"){
			campoVacio = false;mensajeUx = "<label>Debe volver a subir el "+textEvidenciaAuxiliarDos+".</label>";
		}
	}

	if(habilitarAuxTresExamContEvi == 1 && campoVacio){
		if(inputEviAuxiliarTres.length == 0){
			campoVacio = false;mensajeUx = "<label>Debe subir la vacunación o declaración jurada de no patologías COVID-19.</label>";
		}else if(inputEviAuxiliarTres == "VOLVER A SUBIR"){
			campoVacio = false;mensajeUx = "<label>Debe volver a subir la vacunación o declaración jurada de no patologías COVID-19.</label>";
		}
   	}
      
    if(campoVacio){
        var dataParam={
	        id:objExamenContratista.id,vigencia:{id:vigencia},fecha:convertirFechaTexto(fecha),fechaFinVigencia:fechaFinVigencia,trabajadores:trabajadoresFinal,
			tema:tema,tipo:{id:examenTipoId},tipoCertificado:{id:tipoCertificado},mes:{id:mes},anio:anio,contratista:{id:getSession("contratistaGosstId")}
        };
      
        if(examenTipoId == 16){
	        dataParam.numTrabajadoresIndicador = numTrabajadoresIndicador;dataParam.numHorasHombres = numHorasHombres;
	 		dataParam.numAccidentesLeves = numAccidentesLeves;dataParam.numAccidentesIncapacitantes = numAccidentesIncapacitantes;
	 		dataParam.numAccidentesMortales = numAccidentesMortales;dataParam.numDiasPerdidos = numDiasPerdidos;
	 		dataParam.presupuestoMensual = presupuestoMensual;
      	}else if(examenTipoId == 34){
         	dataParam.fechaUltimaDosis = fechaUltimaDosis;dataParam.tipoVacunaCovid = {id:tipoVacunaCovidId};
         	dataParam.numCantidadDosis = numCantidadDosis;dataParam.observacion = observacion;
		}else if([44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,95].includes(examenTipoId)){
			dataParam.observacion = observacion;

			if(examenTipoId == 95){
				dataParam.razonSocial = razonSocial;
			}
      	}else if(examenTipoId == 78){
			dataParam.razonSocial = razonSocial;
		}else if(examenTipoId == 79){
			dataParam.clinicaCertifDigesaId = clinicaCertifDigesaId;dataParam.trabajosAltoRiesgo = listTrabajosAltoRiesgoExamContSeleccionados;
			dataParam.textoTrabajosAltoRiesgoSeleccionados = textoTrabajosAltoRiesgoExamContSeleccionados;dataParam.hasTrabAltoRiesgo = hasTrabAltoRiesgo;
		}

	    callAjaxPostSimple(URL+'/contratista/examen/save',dataParam,1,function(data){
            switch(data.CODE_RESPONSE){
	            case "05":
	                guardarEvidenciaAutoVersionS3(habilitarExamContEvi,data.nuevoId,"fileEviExamenContratista"+objExamenContratista.id,bitsEvidenciaExamen,
	                0,0,"/contratista/amazon_s3/examen/evidencia/save","contratista-has-examen/evidencia",function(){
	                 guardarEvidenciaAutoVersionS3(habilitarAuxExamContEvi,data.nuevoId,"fileEviAuxExaCon"+objExamenContratista.id,bitsEvidenciaExamen,
		             0,0,"/contratista/amazon_s3/examen/evidencia_auxiliar/save","contratista-has-examen/evidencia-auxiliar",function(){
				      guardarEvidenciaAutoVersionS3(habilitarAuxDosExamContEvi,data.nuevoId,"fileEviAuxDosExaCon"+objExamenContratista.id,bitsEvidenciaExamen,
				      0,0,"/contratista/amazon_s3/examen/evidencia_auxiliar_dos/save","contratista-has-examen/evidencia-auxiliar-dos",function(){
				       guardarEvidenciaAutoVersionS3(habilitarAuxTresExamContEvi,data.nuevoId,"fileEviAuxTresExaCon"+objExamenContratista.id,bitsEvidenciaExamen,
				       0,0,"/contratista/amazon_s3/examen/evidencia_auxiliar_tres/save","contratista-has-examen/evidencia-auxiliar-tres",function(){
	                    guardarEvidenciaAutoVersionS3(habilitarCarneEvi,data.nuevoId,"fileEviCarneVacExaCon"+objExamenContratista.id,bitsEvidenciaExamen,
	                    0,0,"/contratista/amazon_s3/examen/vacunacion/evidencia/save","contratista-has-examen/evidencia-vacunacion",function(){
	  	                 guardarEvidenciaAutoVersionS3(habilitarDniEvi,data.nuevoId,"fileEviDniExaCon"+objExamenContratista.id,bitsEvidenciaExamen,
	  	                 0,1,"/contratista/amazon_s3/examen/trabajador_dni/evidencia/save","contratista-has-examen/evidencia-dni",function(){
	                         mensajeUx="<label>El registro "+examenTipoNombre+" fue guardado correctamente.</label>";
						     mensajesUx(mensajeUx,1,"","ActualizarVistaConExamen");
								   
		     			     $("#modalMensajeUxActualizarVistaConExamen").on("hidden.bs.modal",function(){
        habilitarExamenesContratista(1);
		     			  	 });
	  	  			     });
					    });
					   });
	                  });
	                 });
				    });
		
	       			break;
						
	    		default:
	       			alert("Ocurrió un error al guardar! ("+examenTipoNombre+")");
	 		}
      	});
   	}else{
        mensajesUx(mensajeUx,2,"","");
   	}
}

function eliminarExamenContratista(pindex){
    if(examenTipoId != 14 || (examenTipoId == 14 && objExamenContratista.hasPrevencionistaCronograma == 0)){
   mensajeUx="<label>¿Está seguro de eliminar el "+examenTipoNombre+" seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","EliminarExaCon");
   
   $("#btnDevolverValorEliminarExaCon").on("click",function(){
      var dataParam={
	 id: objExamenContratista.id,bucketNombre:BUCKETAMAZONS3
      };

      callAjaxPost(URL+'/contratista/examen/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx="<label>El "+examenTipoNombre+" seleccionado se ha eliminado correctamente.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarVistaConExamen");
        	
	       $("#modalMensajeUxActualizarVistaConExamen").on("hidden.bs.modal",function(){
        habilitarExamenesContratista(1);
	       });
	       break;
						
            default:
	       alert("Ocurrió un error al eliminar la examen!");
         }
      });
   });
    }
    
    if(examenTipoId == 14 && objExamenContratista.hasPrevencionistaCronograma > 0){
	mensajeUx="<label>No puede borrar el registro prevencionista seleccionado porque está asociado a un cronograma de trabajo.</label>";
	mensajesUx(mensajeUx,2,"","");
    }
}

function verTablaResumenIndicador(){
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
//      tipo: null,
      estado: {id: 2},
      ordenFiltroId: 1,
      contratistaId: getSession("contratistaGosstId")
		 };
   
   callAjaxPost(URL+'/contratista/proyectos/solo/indicador_mensual_sst',dataParam,function(data){
      var listProy = data.proyectos;
		
      if(listProy.length == 0){
	 alert("Sin proyectos en curso");
	 return;
      }
		
      var ultProy = listProy[listProy.length - 1];
      var hoy = new Date();
      var mesHoy = parseInt(hoy.getMonth())+1;
      var anioHoy = parseInt(hoy.getFullYear());
      var listFechas = hallarFechasPeriodoExamen(ultProy.fechaInicio,ultProy.fechaFin);
      
      var contenido = 
	 "<div class='wrapper' id='wrapperResIndicadorSst'>" +
	    "<table id='tblResIndicadorSst' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<td class='tb-acc'>Año</td>" +
		     "<td class='tb-acc'>Mes</td>" +
		     "<td class='tb-acc'>Estado</td>" +
	          "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>";
		
      var modalOptions={
	 id:"modalIndicador",
	 nombre:"<i class='fa fa-table'></i> Tabla Resumen",
	 contenido:contenido
	               };
		
      crearModalPrincipalUsuario(modalOptions,function(){},false,true);
      
      resizeDivWrapper("wrapperResIndicadorSst",180);
		
      listFechas.forEach(function(val){
         var textCumple = "No es necesario";
			
         if((val.anio == anioHoy && val.mes < mesHoy) || (val.anio <anioHoy)){
	    var cumple = false;
				
	    listFullExamenesContratista.forEach(function(val1){
	       if((val1.mes.id+1) == val.mes && val1.anio == val.anio){
	          cumple = true;
	       }
	    });
				
	    if(cumple){
	       textCumple = ""+iconoGosst.aprobado+" Registró";
	    }else{
	       textCumple = ""+iconoGosst.desaprobado+" No registró";
	    }
         }
			
         $("#tblResIndicadorSst").append(
            "<tr>" +
	       "<td>"+val.anio+"</td>" +
	       "<td>"+val.mes+"</td>" +
	       "<td>"+textCumple+"</td>" +
	    "</tr>");
      });	
      
      goheadfixedY("#tblResIndicadorSst","#wrapperResIndicadorSst");
   });	
}

function hallarFechasPeriodoExamen(fechaIni,fechafin){
   var fechaInicio = convertirFechaInput(fechaIni);
   var fechaFin = convertirFechaInput(fechafin);
   var fecha1 = fechaInicio.split('-');
   var fecha2 = fechaFin.split('-');
   var difanio = fecha2[0]-fecha1[0]+1;
   var difDias = restaFechas(fechaInicio,fechaFin);
   var listfecha = [];
			
   for(index = 0;index < difanio;index++){
      var anioaux = parseInt(index)+parseInt(fecha1[0]);
				
      if(difanio > 1){
         if(index == 0){
	    for(index1 = 0;index1 < 12 - fecha1[1] + 1;index1++){
	       var mesaux = parseInt(index1) + parseInt(fecha1[1]);
	       listfecha.push({mes:mesaux,anio:anioaux,nombre:anioaux+"-"+((''+mesaux).length<2 ? '0' : '') + mesaux });
	    }
         }
					
         if(index == difanio - 1){
	    for(index4 = 0;index4 < parseInt(fecha2[1]);index4++){
	       var mesaux3 = parseInt(index4) + parseInt("1");
	       listfecha.push({mes:mesaux3,anio:anioaux,nombre:anioaux+"-"+((''+mesaux3).length<2 ? '0' : '') + mesaux3 });
	    }
         }	
					
         if(index > 0 && index < difanio - 1){
	    for(index3 = 0;index3 < 12;index3++){
	       var mesaux2 = parseInt(index3) + 1;	
	       listfecha.push({mes:mesaux2,anio:anioaux,nombre:anioaux+"-"+((''+mesaux2).length<2 ? '0' : '') + mesaux2 });
	    }
         }
      }else{
         for(index5 = 0;index5 < fecha2[1] - fecha1[1] + 1;index5++){				
	    var mesaux4 = parseInt(index5) + parseInt(fecha1[1]);
	    listfecha.push({mes:mesaux4,anio:anioaux,nombre:anioaux+"-"+((''+mesaux4).length<2 ? '0' : '') + mesaux4 });
         }
      }			
   }
		
   return listfecha;		
}

function volverDivSubContenidoExamCon(obj){
   objExamenContratista={id:0};
    
   $(".divListPrincipal>div").show();
   $("#editarMovilExamen").hide();
   $(".divCursoExamenMovil").hide();
 	
   if(lastHeight > 0){
      $(window).scrollTop(lastHeight-$("#barraMenu").height()-60);
      lastHeight = 0;
   }
}

function ocultarEvaluarExamenContratistaPorMedioDeIa(){
   $("#modalEvaluarExamContIa").modal("hide");
}

function evaluarExamenContratistaPorMedioDeIa(){
   $("#modalEvaluarExamContIa").remove();  
    
   var contenido = "";
				
   var listContenido=[
      {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"divEvidenciaExamContIa"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarEvaluarExamenContratistaPorMedioDeIa()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
	      		 "onclick='evaluacionExamenContratistaPorMedioDeIa()'>" +
	            "<i class='fa fa-paper-plane'></i> Enviar" +
	         "</button>"},
   ]; 
				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 		
   var modalOptions={
      id: "modalEvaluarExamContIa",
      nombre: "<i class='fa fa-pencil-square-o'></i> Evaluación SCTR - IA (MAPFRE)",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    
   var options={
      container: "#divEvidenciaExamContIa",
      functionCall: function(){
         validacionSubirEvidencia("EvalExamContIa",bitsEvidenciaExamen,"modalEvaluarExamContIa");
      },
      descargaUrl: "",esNuevo: true,idAux: "EvalExamContIa",evidenciaNombre: "",
      mensajeAux: "*Debe subir el modelo brindado por la aseguradora."
   };
					
   crearFormEvidenciaAmazonS3Completa(options);	
}

function evaluacionExamenContratistaPorMedioDeIa(){
   var campoVacio = true;
   
   var evidenciaNombre = $("#inputEviEvalExamContIa").val();
   var extension = getFileExtension(evidenciaNombre);
   
   if(evidenciaNombre.length == 0){
      campoVacio = false;
      mensajeUx = "<label>Debe subir la evidencia.</label>";
   }else if(evidenciaNombre == "VOLVER A SUBIR"){
      campoVacio = false;
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
   }else if(extension != "pdf"){
      campoVacio = false;
      mensajeUx = "<label>El formato del archivo debe ser '.pdf'.</label>";
   }
   
   if(campoVacio){
      guardarEvidenciaAutoVersionS3(1,parseInt(getSession("contratistaGosstId")),"fileEviEvalExamContIa",bitsEvidenciaExamen,
      1,0,"/contratista/amazon_s3/examen/evidencia_preparacion_ia/save","examContTipo"+examenTipoId,function(data){
       switch(data.CODE_RESPONSE){
        case "05": 
	 var dataParamError={
	    esModal: 1,contenedorModal: "modalEvaluarExamContIa"
	 };
	       
	 var document = BUCKETAMAZONS3+"-examContTipo"+examenTipoId+"-"+getSession("contratistaGosstId");
	 
	 enviarParametrosExternoGet("https://dnwtd70hr7.execute-api.us-west-2.amazonaws.com/dev/api/get-decompose-file?" +
	 "document="+document,dataParamError,0,0,1,function(data1){
	  switch(data1.codigo){
	   case 0:
	    var trabajadoresFinal = [];   
	       
//	    if(data1.data.contratanteDTO.numeroDocumento == 111){
	       var diasRestantes = restaFechas(getSession("fechaHoyOrdenInversoTexto"),data1.data.fechaFinVigencia);
		
	       if(diasRestantes >= 0){	
	          var listAsegurados = data1.data.asegurados;
	          
	          listAsegurados.forEach(function(val){
	             listTrabajadoresExamenTodos.forEach(function(val1){
	                if(val.numeroDocumento == val1.nroDocumento){
	                   trabajadoresFinal.push({id: val1.id});
	                   return;
	                }   
	             });
	          });
	          
	          if(listAsegurados.length == 0){
	             mensajeUx = "<label>No se encontró a ningún trabajador registrado en la evidencia.</label>";
	             campoVacio = false; 
	          }else if(trabajadoresFinal.length == 0){
                     mensajeUx = "<label>No hay trabajadores, registrados en GOSST, que figuren en la evidencia.</label>";
                     campoVacio = false;
                  }
	       }else{
		  mensajeUx = "<label>La fecha fin de vigencia, registrada en la evidencia, es menor a la fecha de hoy.</label>";
		  campoVacio = false;   
	       }
//	    }else{
//	       mensajeUx = "<label>El RUC de la contratista en GOSST y el registrado en la evidencia no coinciden.</label>";
//	       campoVacio = false;
//	    }
	    
	    if(campoVacio){
	       var dataParam={
	          id: 0,tipo: {id: examenTipoId},validacionIa: 1,evaluacion: {nota: {id: 1}},
	          trabajadores: trabajadoresFinal,fecha: convertirFechaTexto(data1.data.fechaInicioVigencia),
	          fechaFinVigencia: convertirFechaTexto(data1.data.fechaFinVigencia),
	          contratista: {id: getSession("contratistaGosstId")}
	       };
	       
	       callAjaxPostSimple(URL+'/contratista/examen/save',dataParam,0,function(data){
	        switch(data.CODE_RESPONSE){
	 	 case "05":  
	 	  guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviEvalExamContIa",bitsEvidenciaExamen,
	 	  0,1,"/contratista/amazon_s3/examen/evidencia/save","contratista-has-examen/evidencia",function(){
	 	   $("#modalEvaluarExamContIa").modal("hide");    
	 	   
	 	   mensajeUx="<label>La evaluación del "+examenTipoNombre+", por medio de IA, fue realizada con éxito.</label>";
		   mensajesUx(mensajeUx,1,"","ActualizarVistaConExamen"); 
								   
		   $("#modalMensajeUxActualizarVistaConExamen").on("hidden.bs.modal",function(){
        habilitarExamenesContratista(1);
		   });  
	 	  });
	 		
	 	  break;
	 						
	 	 default:
	 	  $.unblockUI();$("#modalEvaluarExamContIa").modal("hide"); 
	 	  alert("Ocurrió un error al guardar el registro");
	 	}
	       });   
	    }else{
	       $.unblockUI();$("#modalEvaluarExamContIa").modal("hide"); 
               mensajesUx(mensajeUx,2,"","");
	    }
	    
	    break;
	        
	   default:
	    $.unblockUI();$("#modalEvaluarExamContIa").modal("hide"); 
	    alert("Ocurrió un error al obtener la información del pdf.");
	  }
	 });
	       
	 break;
	    
        default:
         $.unblockUI();$("#modalEvaluarExamContIa").modal("hide"); 
	 alert("Ocurrió un error al procesar la evidencia.");
       }  
      });
   }else{
      $("#modalEvaluarExamContIa").modal("hide"); 
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
      
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
	 $("#modalEvaluarExamContIa").modal("show");
      });
   }
}

function ocultarLoginBloqueoSeccionExamenContratista(){
	$("#modalLoginBloqueoSeccionContratista").modal("hide");
}

function verLoginBloqueoSeccionExamenContratista(){
	$("#modalLoginBloqueoSeccionContratista").modal("show");
}

function crearLoginBloqueoSeccionExamenContratista(){
	$("#modalLoginBloqueoSeccionContratista").remove();

	var contenido = "";

	var listContenido=[
		{sugerencia:"",label:"Correo",inputForm:"<input id='inputCorreoLogBloqSeccExamCont' class='form-control'>"},
		{sugerencia:"",label:"Contraseña",inputForm:"<input id='inputClaveLogBloqSeccExamCont' class='form-control' type='password' autocomplete='new-password'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarLoginBloqueoSeccionExamenContratista()'>" +
			       "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='accesoLoginBloqueoSeccionExamenContratista()'>" +
					   "<i class='fa fa-key'></i> Acceder" +
				   "</button>"},
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalLoginBloqueoSeccionContratista",nombre:"<i class='fa fa-id-card'></i> Login - Bloqueo sección",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	var listPanelesPrincipal=[
		{id:"opcionLoginBloqueoSeccCont",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verLoginBloqueoSeccionExamenContratista()",
		 btnIconoAux:"fa-key",btnTitleAux:"Bloqueo de la sección actual",nombre:"Login - Sección '"+examenTipoNombre+"'",contenido:""}
	];

	agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
}

function accesoLoginBloqueoSeccionExamenContratista(){
	var campoVacio = true;

	var correo = $("#inputCorreoLogBloqSeccExamCont").val();
	var contrasenia = $("#inputClaveLogBloqSeccExamCont").val();
	contrasenia = encriptarTexto(contrasenia,claveEncriptarTexto);

	if(correo.length == 0 || contrasenia == 0){
		campoVacio = false;mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	if(campoVacio){
		var dataParam={
			correo:correo,contrasenia:contrasenia,contratistaId:parseInt(getSession("contratistaGosstId"))
		};

		callAjaxPostSimpleVersionDos(1,URL+'/contratista/bloqueo_seccion_contratista/acceso',dataParam,1,0,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					$("#modalLoginBloqueoSeccionContratista").modal("hide");
					var accesoSeccionCont = data.accesoSeccionCont;

					if(accesoSeccionCont == 1){
						hasBloqueoSeccion = 0;valoresFiltroExamenesContratista();
					}else{
						$.unblockUI();mensajeUx = "<label>Correo y/o contraseña incorrectos.</label>";
						mensajesUx(mensajeUx,1,"","ActualizarVistaConExamen");

						$("#modalMensajeUxActualizarVistaConExamen").on("hidden.bs.modal",function(){
							$("#modalLoginBloqueoSeccionContratista").modal("show");
						});
					}

					break;

				default:
					alert("Ocurrió un error al intentar acceder a la sección contratista.");
			}
		});
	}else{
		$("#modalLoginBloqueoSeccionContratista").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionVistaConExamen");

		$("#modalMensajeUxValidacionVistaConExamen").on("hidden.bs.modal",function(){
			$("#modalLoginBloqueoSeccionContratista").modal("show");
		});
	}
}

function verMensajePersonalizadoTipoExamCont(){
    mensajeUx = "<label>"+mensajePersonalizado+"</label>";
    mensajesUx(mensajeUx,10,"","");
}

function pruebaSeleccionAuxiliar(){
	var trabsId = $("#nuevoMovilExamen").find("#slcTrabajadoresExamen"+objExamenContratista.id).val(),trabajadorIdAux = 0,
	    hasTrabAltoRiesgo = parseInt($("#nuevoMovilExamen").find("input[name='radiosRespHasTrabAltoRiesgo']:checked").val());
		
    if(hasTrabAltoRiesgo == 1 && listTipoExamenesAux.length > 0){
		if(trabsId.length != 0){
			$.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
		    console.log("Con trabajador seleccionado");
			trabsId.forEach(function(val){
			    trabajadorIdAux = parseInt(val);
			});
			
			var dataParam={
				id:trabajadorIdAux
			};
			
			callAjaxPostSimpleVersionDos(1,URL+'/contratista/data_auxiliar/trabajador_contratista',dataParam,0,0,function(data){
			    switch(data.CODE_RESPONSE){
			        case "05":
						console.log("data.trabajadorContratista.trabajosAltoRiesgoChtAsociadosId -> "+data.trabajadorContratista.trabajosAltoRiesgoChtAsociadosId);

						if(data.trabajadorContratista.trabajosAltoRiesgoChtAsociadosId.length != 0){
						    var trabAltoRiesgoChtAsociadosId = data.trabajadorContratista.trabajosAltoRiesgoChtAsociadosId.split(",");

							trabAltoRiesgoChtAsociadosId.forEach(function(val1){
							    var checkboxTrabAltoRiesgoChtAsoc = document.getElementById('checkAsignadoTrabAltoRiesgoExamContSelecNuevo'+val1);
								
								if(checkboxTrabAltoRiesgoChtAsoc != null){
								    checkboxTrabAltoRiesgoChtAsoc.checked = true;
								}
							});
						}
										
						var textTrabAltoRiesgoExamContSelec = "";

						listTipoExamenesAux.forEach(function(val){
						    var isSeleccionado = ($("#checkAsignadoTrabAltoRiesgoExamContSelecNuevo"+val.id).prop("checked")?1:0);

							if(isSeleccionado == 1){
							    textTrabAltoRiesgoExamContSelec += (textTrabAltoRiesgoExamContSelec.length == 0?val.nombre:", "+val.nombre);
							}
						});

						textTrabAltoRiesgoExamContSelec = (textTrabAltoRiesgoExamContSelec.length == 0?"":textTrabAltoRiesgoExamContSelec);

						$("#nuevoMovilExamen").find("#divTrabAltoRiesgoExamCont").html(textTrabAltoRiesgoExamContSelec);$.unblockUI();

			            break;

			        default:
			            alert("Ocurrió un error al cargar la data auxiliar del trabajador contratista.");$.unblockUI();
		        }
			});
		}else{
			listTipoExamenesAux.forEach(function(val){
				var checkboxTrabAltoRiesgoChtAsoc = document.getElementById('checkAsignadoTrabAltoRiesgoExamContSelecNuevo'+val.id);
												
				checkboxTrabAltoRiesgoChtAsoc.checked = false;
			});
			
			$("#nuevoMovilExamen").find("#divTrabAltoRiesgoExamCont").html("");
		}
	}
}
