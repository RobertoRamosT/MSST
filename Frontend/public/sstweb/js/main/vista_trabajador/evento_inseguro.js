/**
 *
 */
var listTrabajadores;
var seccionInteresadaAC;
var listUnidades = [],listDivisiones = [],listAreas = [],listEstadoEventInseguro = [],listVisualizarOpcionesAc = [];
var listUnidadesFiltro = [],listDivisionesFiltro = [],listAreasFiltro = [],listEstadoEventInseguroIdFiltro = [];
var mensajeUx;

var listEstadoReporteACValores=[
   {id:1,nombre:"Sin revisar"},{id:2,nombre:"Abierto"},{id:3,nombre:"Cerrado"},{id:4,nombre:"No válido"}
];

var textDescripcionAcSub,textTipoAcSub,textCausaAcSub,textRiesgoAcSub,textCorreccionAcSub;

function ocultarFiltroAcSubestandarTrab(){
   $("#modalFiltroAcSubestandarTrab").modal("hide");
}

function verFiltroAcSubestandarTrab(){
   $("#modalFiltroAcSubestandarTrab").modal("show");
}

function crearFiltroAcSubestandarTrab(functionCallBack){
    $(".filtro-despliegue-conectado").remove();

    textDescripcionAcSub = (parseInt(getSession("gestopcompanyid")) == 336?"¿Cuál es?":(parseInt(getSession("gestopcompanyid")) == 500?"Descripción del evento a reportar":"¿Qué va a reportar?"));
    textTipoAcSub = ([336,500].includes(parseInt(getSession("gestopcompanyid")))?"Acto/Condición (para marcar)":"Tipo de reporte");
    textCausaAcSub = (parseInt(getSession("gestopcompanyid")) == 336?"Causa raíz (¿por qué pasó?)":"Posible causa inmediata (¿por qué pasó?)");
    textRiesgoAcSub = (parseInt(getSession("gestopcompanyid")) == 336?"Código de riesgo":"Riesgo Asociado");
    textCorreccionAcSub = (parseInt(getSession("gestopcompanyid")) == 336?"Acción inmediata (Qué hiciste)":"Corrección "+(parseInt(getSession("gestopcompanyid")) == 500?"(propuesta por el trabajador)":"(realizada por quien reporta)"));

    var dataParam={
        trabajadorId:parseInt(getSession("trabajadorGosstId")),empresaId:parseInt(getSession("gestopcompanyid")),
        matrixId:parseInt(getSession("unidadGosstId"))
    };

    callAjaxPost(URL+'/acinseguro/movil/filtro',dataParam,function(data){
        listUnidades = data.listUnidades,listDivisiones = data.listDivisiones,listAreas = data.listAreas;
        seccionInteresadaAC = data.listTrabajadores[0].numSeccionInteresadaAC;listEstadoEventInseguro = data.listEstadoEventInseguro;

        listActoTipo = data.listActInsegTipo;listClasificacionAccionEventoColaborador = data.clasificacionAccion;listOrigenActo = data.listOrigen;
        lisTipoReporteLugar = data.lisTipoReporteLugar;listCausaInmediataColaborador = data.listCausaInmediataSimple;listAreaActoColaborador = data.listArea;
        listNivelActoColaborador = data.listNivel;listSubTipoContactoColaborador = data.listFullTipoContacto;listFullTipoContactoColaborador = data.listFullTipoContacto;
        listDivisionesSimple = data.listDivisiones;listFactoresRiesgo = data.listFactoresRiesgo;listPeligrosAc = data.listPeligrosAc;

        listVisualizarOpcionesAc = [];

        if(seccionInteresadaAC > 0 || numAreasResponsable != 0){
	        listVisualizarOpcionesAc.push({id:0,nombre:"Ver reportes de áreas de las que soy responsable"});
        }

        listVisualizarOpcionesAc.push({id:1,nombre:"Ver reportes que he generado"});

        if(seccionInteresadaAC > 0){
	        listVisualizarOpcionesAc.push({id:2,nombre:"Ver todos los reportes de la empresa"});
        }

        var selVisualizacionOpcAcSubTrab = crearSelectOneMenuOblig("selVisualizacionOpcAcSubTrab",
            "",listVisualizarOpcionesAc,(numAreasResponsable == 0?1:0),"id","nombre");

        var contenido = "";

        var listContenido=[
            {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",label:"<span style='font-size:20px;font-weight:bolder;'>Fecha reporte</span>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Inicio intervalo",inputForm:"<input type='date' id='fechaInicioFiltroAcSubTrab' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fin intervalo",inputForm:"<input type='date' id='fechaFinFiltroAcSubTrab' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Visualizar",inputForm:selVisualizacionOpcAcSubTrab},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
        ];

        if(parseInt(getSession("gestopcompanyid")) != 336){
            listContenido.push({sugerencia:"",label:"Estado del reporte",inputForm:"",divContainer:"divFiltroEstadoActual"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
        }
      
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestopunidad") != null?getSession("gestopunidad"):"Unidad"),inputForm:"",divContainer:"divFiltroUnidad"},
	        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestopdivision") != null?getSession("gestopdivision"):"División"),inputForm:"",divContainer:"divFiltroDivision"},
	        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestoparea") != null?getSession("gestoparea"):"Área"),inputForm:"",divContainer:"divFiltroArea"},
	        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroAcSubestandarTrab()' style='font-size:18px;'>" +
                       "<i class='fa fa-times'></i> Cancelar" +
                   "</button>",
             inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='valoresFiltroAcSubestandarTrab()'>" +
                           "<i class='fa fa-filter'></i> Aplicar" +
                       "</button>"});

        listContenido.forEach(function (val){
            contenido += obtenerSubPanelModuloVersionDos(val);
        });

        var modalOptions={
            id:"modalFiltroAcSubestandarTrab",nombre:"<i class='fa fa-filter'></i> Filtros",
            contenido:"<div class='eventoGeneral'>"+contenido+"</div>",classAux:"filtro-despliegue-conectado"
        };

        crearModalPrincipalUsuario(modalOptions,function(){
	        if($("#selMulUnidadesFiltro").length > 0){
	            return;
	        }
						       
	        crearSelectOneMenuObligMultipleCompleto("selMulUnidadesFiltro","filtrarValoresDivisiones()",
                listUnidades,"id","nombre","#divFiltroUnidad","Todos");
	 
	        crearSelectOneMenuObligMultipleCompleto("selMulEstadoActualFiltro","",
                listEstadoEventInseguro,"id","nombre","#divFiltroEstadoActual","Todos");
	 
	        filtrarValoresDivisiones();
        },true,true);

        var hoy = getSession("fechaHoyOrdenInversoTexto");

        $("#fechaInicioFiltroAcSubTrab").val(sumaFechaDias(-180,hoy));$("#fechaFinFiltroAcSubTrab").val(hoy);

        functionCallBack();
    });
}

function valoresFiltroAcSubestandarTrab(){
    ocultarFiltroAcSubestandarTrab();

    var listMultiUnidades = $("#selMulUnidadesFiltro").val();
    listUnidadesFiltro = [];
    
    if(listMultiUnidades != null){
        listMultiUnidades.forEach(function(val,index){
 	        listUnidadesFiltro.push(parseInt(val));
        });
    }
    
    var listMultiDivisiones = $("#selMulDivisionesFiltro").val();
    listDivisionesFiltro = [];
    
    if(listMultiDivisiones != null){
        listMultiDivisiones.forEach(function(val,index){
 	        listDivisionesFiltro.push(parseInt(val));
        });
    }
    
    var listMultiAreas = $("#selMulAreasFiltro").val();
    listAreasFiltro = [];
    
    if(listMultiAreas != null){
        listMultiAreas.forEach(function(val,index){
 	        listAreasFiltro.push(parseInt(val));
        });
    }
   
    var listMultiEstadosActual = $("#selMulEstadoActualFiltro").val();
    listEstadoEventInseguroIdFiltro = [];
    
    if(listMultiEstadosActual != null){
        listMultiEstadosActual.forEach(function(val,index){
	        listEstadoEventInseguroIdFiltro.push(parseInt(val));
        });
    }
    
    // habilitarReporteEventoUsuario();
    habilitarReporteEventoUsuarioVersionDos();
}

var indexFunction = 0;
var indexFunctionAC = 0;

function toggleMenuOpcionAC(obj,pindex,menu){
    indexFunction = pindex;indexFunctionAC = pindex;

    $(obj).parent("#opciones"+menu).find("ul").toggle();
    $(obj).parent("#opciones"+menu).siblings().find("ul").hide();
}

var funcionalidadesAC=[
   ([154,714].includes(parseInt(getSession("gestopcompanyid")))?
    {menu:"1",opcion:
     [{id:"opcAgregarAccion",nombre:"<i class='fa fa-plus'></i> Agregar acción de mejora",
       functionClick:function(data){agregarAccionMejoraEventoInseguro();}},
      {id:"opcMarcaRevisadoAc",nombre:"<i class='fa fa-check-square-o'></i> Marcar como revisado <br> (no requiere acción de mejora)",
       functionClick:function(data){marcarRevisadoACSubestandarSinAccionMejora();}},
      {id:"opcAnularAc",nombre:"<i class='fa fa-trash'></i> Calificar reporte como no válido",
       functionClick:function(data){anularEventoInseguroColaborador();}},
      {id:"opcSubirConstanciaAc",nombre:"<i class='fa fa-upload'></i> Subir Observaciones preventivas de seguridad (OPS)",
       functionClick:function(data){verSubirConstanciaEventoInseguroColaborador();}}]}:
    (parseInt(getSession("gestopcompanyid")) != 336?
     {menu:"1",opcion:
      [{id:"opcAgregarAccion",nombre:"<i class='fa fa-plus'></i> Agregar acción de mejora",
        functionClick:function(data){agregarAccionMejoraEventoInseguro();}},
       {id:"opcMarcaRevisadoAc",nombre:"<i class='fa fa-check-square-o'></i> Marcar como revisado <br> (no requiere acción de mejora)",
        functionClick:function(data){marcarRevisadoACSubestandarSinAccionMejora();}},
       {id:"opcAnularAc",nombre:"<i class='fa fa-trash'></i> Calificar reporte como no válido",
        functionClick:function(data){anularEventoInseguroColaborador();}}]}:
     {menu:"1",opcion:
      [{id:"opcAgregarAccion",nombre:"<i class='fa fa-plus'></i> Agregar acción de mejora",
        functionClick:function(data){agregarAccionMejoraEventoInseguro();}},
       {id:"opcAnularAc",nombre:"<i class='fa fa-trash'></i> Calificar reporte como no válido",
        functionClick:function(data){anularEventoInseguroColaborador();}}]})),
   {menu:"2",opcion:
    [{id:"opcDescargar",nombre:"<i class='fa fa-download'></i> Descargar",
      functionClick:function(data){window.open(URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+indexFunctionAC);}}]},
   (getSession("gestopcompanyid") != 336?  
    {menu:"3",opcion: 
     [{id:"opcAgregarAccion",nombre:"<i class='fa fa-plus'></i> Agregar acción de mejora",
       functionClick:function(data){agregarAccionMejoraEventoInseguro();}},
      {id:"opcSubirConstanciaAc",nombre:"<i class='fa fa-upload'></i> Subir constancia de registro",
       functionClick:function(data){verSubirConstanciaEventoInseguroColaborador();}}]}:
    {menu:"3",opcion: 
     [{id:"opcAgregarAccion",nombre:"<i class='fa fa-plus'></i> Agregar acción de mejora",
       unctionClick:function(data){agregarAccionMejoraEventoInseguro();}}]}),
   {menu:"AccionMejora",opcion:
    [{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
      functionClick:function(data){editarAccionMejoraEvento();}},
     {id:"opcEditar",nombre:"<i class='fa fa-trash-o'></i> Eliminar",
      functionClick:function(data){eliminarAccionMejoraEvento();}}]},
   {menu:"5",opcion:
    [{id:"asd",nombre:"<i class='fa fa-download'></i> Descargar plantilla",
      functionClick:function(data){verPlantillaImportActosColaborador();}},
     {id:"asd1",nombre:"<i class='fa fa-upload'></i> Subir plantilla",
      functionClick:function(data){verImportActosColaborador();}}]}
];

function editarAccionMejoraEvento() {
    var listItemsForm = [
        {
            sugerencia: "", label: "<i class='fa fa-info'></i> Clasificación:",
            inputForm: "", divContainer: "divClasifAccColaboradorAC"
        },
        {
            sugerencia: "", label: "<i class='fa fa-fire'></i> Descripción:",
            inputForm: "<input class='form-control' id='inputDescAccion'>", divContainer: ""
        },
        {
            sugerencia: "Si ya ha realizado la acción, introduzca la evidencia",
            label: "<i class='fa fa-calendar'></i> Fecha Planificada:",
            inputForm: "<input type='date' class='form-control' id='inputDateAccion'>", divContainer: ""
        },
        {
            sugerencia: "", label: "<i class='fa fa-upload'></i> Evidencia:",
            inputForm: "<div id='inputEvidenciaAccEvento'></div>", divContainer: ""
        },
        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
        {
            sugerencia: "", label: "",
            inputForm: "<button class='btn btn-success'>" +
                "<i class='fa fa-floppy-o'></i> Guardar" +
                "</button>", divContainer: ""
        }
    ];

    var text = "";

    listItemsForm.forEach(function (val, index) {
        text += obtenerSubPanelModuloVersionDos(val);
    });

    var contenido =
        "<form id='formAccEvento' class='eventoGeneral'>" +
        "<div id='tituloEvento'>" +
        text +
        "</div>" +
        "</form>";

    var listPaneles = {
        id: "divNuevoAccMejoraEvento",
        nombre: "<i class='fa fa-pencil-square-o'></i> Editar acción de mejora",
        clase: "listaAuxiliar", contenido: contenido
    };

    accionMejoraEventoObj = listFullAccionesEvento[accionMejoraEventoColaboradorIndex];

    agregarModalPrincipalColaborador(listPaneles, function () {
        listClasificacionAccionEventoColaborador.forEach(function (val) {
            val.selected = 0;

            if (val.id == accionMejoraEventoObj.clasificacion.id) {
                val.selected = 1;
            }
        });

        crearSelectOneMenuObligUnitarioCompleto("selClasificacionAccAC", "",
            listClasificacionAccionEventoColaborador, "id", "nombre", "#divClasifAccColaboradorAC", "Todos");
    });

    $("#inputDescAccion").val(accionMejoraEventoObj.descripcion);
    $("#inputDateAccion").val(convertirFechaInput(accionMejoraEventoObj.fechaRevision));

    $("#formAccEvento").on("submit", function (e) {
        e.preventDefault();
        guardarAccionMejoraEvento();
    });

    var options = {
        container: "#inputEvidenciaAccEvento",
        functionCall: function () {
        },
        descargaUrl: "/gestionaccionmejora/accionmejora/evidencia?" +
            "accionMejoraId=" + accionMejoraEventoObj.accionMejoraId,
        esNuevo: (accionMejoraEventoObj.evidenciaNombre == "----" ?
            true : false),
        idAux: "AccEvento",
        evidenciaNombre: (accionMejoraEventoObj.evidenciaNombre == "----" ?
            "" : accionMejoraEventoObj.evidenciaNombre)
    };

    crearFormEvidenciaCompleta(options);
}

function eliminarAccionMejoraEvento() {
   var r = confirm("¿Está seguro de eliminar esta acción ?");

   if(r){
      accionMejoraEventoObj = listFullAccionesEvento[accionMejoraEventoColaboradorIndex];

      var dataParam={
         accionMejoraId:accionMejoraEventoObj.accionMejoraId,eventoInseguroId:accionMejoraEventoObj.eventoInseguroId 
      };

      callAjaxPost(URL+'/gestionaccionmejora/accionmejora/delete',dataParam,function(data){
         habilitarReporteEventoUsuario();
      });
   }
}

function anularEventoInseguroColaborador(){
   var r = confirm("¿Está seguro que este reporte no es válido?");

   if(r){
      $(".divListPrincipal > div").hide();
      $(".divListPrincipal > #subListNoValidoActo").show();
      eventoColaboradorObj = listFullEventosColaborador[indexEventoColaborador];

      var btnRegresar = 
	 "<button class='btn btn-default' onclick='regresarEventosInseguros()' " +
                 "style='font-size:15px;float:left;color:white;background-color:#008b8b'>" +
            "<i class='fa fa-arrow-left' aria-hidden='true'></i>" +
         "</button>";

      $("#subListNoValidoActo .tituloSubList").html(btnRegresar+" A/C Subestándar No Válido")
      $("#divDescripcionEventoNoValido").html(eventoColaboradorObj.acInseguroNombre);
      $("#inputNoValidoActo").val("")
   }
}

function regresarEventosInseguros() {
    $(".divListPrincipal > div").show();
    $(".divListPrincipal > .listaAuxiliar").hide();

    if (parseInt(getSession("gestopcompanyid")) != 336) {
        $("#subImportActosColaborador").hide();
    }
}

var listFullEventosColaborador = [];
var indexEventoColaborador = 0;
var eventoColaboradorObj = {};
var listCausaInmediataColaborador = [];
var listAreaActoColaborador = [];
var listSubTipoContactoColaborador = [];

function marcarSubOpcionAC(pindex, pindex1) {
    funcionalidadesAC[pindex].opcion[pindex1].functionClick();
    $("#opciones" + pindex + " .listaGestionGosst").hide();
}

var menuOpcionAc = [];

function listarOpcionesAc() {
    menuOpcionAc = [];

    funcionalidadesAC.forEach(function (val1, index1) {
        var textLista = "";
        var opciones = val1.opcion;

        textLista = "<ul class='list-group listaGestionGosst' style='display:none;'>";

        opciones.forEach(function (val2, index2) {
            textLista += "<li class='list-group-item' onclick='marcarSubOpcionAC(" + index1 + "," + index2 + ")'>" + val2.nombre + "</li>"
        });
        textLista += "</ul>";
        menuOpcionAc.push(textLista);
    });
}

var listFullTipoContactoColaborador = [];

function verCategAcordeTipoActoInseguro() {
    var selActoTipo = parseInt($("#selActoTipo").val());
    var listFinal = [];

    listCausaInmediataColaborador.forEach(function(val){
        if(val.causaInmTipoEvent == selActoTipo){
            listFinal.push(val);
        }

        if([670,714,716].includes(parseInt(getSession("gestopcompanyid")))){
            if(([75,1016].includes(val.id) && selActoTipo == 1) || ([74,2021].includes(val.id) && selActoTipo == 2)){
                val.selected = 1;
            }
        }
    });

    crearSelectOneMenuNoObligUnitarioCompleto("selCausaInmediataColaborador","verAcordeCausaInmediata();verNombreCompletoCausaInmediata()",
        listFinal,"id","nombre","#divCausaInmColaborador","Sin especificar");

    $("#divCausaInmColaborador").append("<label id='auxCausaInme'></label>");
    verAcordeCausaInmediata();
}

function verAcordeCausaInmediata() {
    var causaId = parseInt($("#selCausaInmediataColaborador").val());

    if([17,34,46,56,71].includes(causaId)){
        $("#inputEspCausaActo").parent().parent().show();
    }else{
        $("#inputEspCausaActo").parent().parent().hide();
    }
}

function habilitarReporteEventoUsuario(){
    $(".divListPrincipal").html("");

    var idOpcion = parseInt($("#selVisualizacionOpcAcSubTrab").val());
   
    var dataParam2={
        companyId:parseInt(getSession("gestopcompanyid")),isTrabajador:(idOpcion != 0?idOpcion:null),
        fechaInicioFiltro:$("#fechaInicioFiltroAcSubTrab").val(),fechaFinFiltro:$("#fechaFinFiltroAcSubTrab").val(),
        listUnidadesId:(listUnidadesFiltro.length == 0?null:listUnidadesFiltro),
        listDivisionesId:(listUnidadesFiltro.length == 0 || listDivisionesFiltro.length == 0?null:listDivisionesFiltro),
        listAreasId:(listDivisionesFiltro.length == 0 || listAreasFiltro.length == 0?null:listAreasFiltro)
    };

    if(parseInt(getSession("gestopcompanyid")) != 336){
        dataParam2.listEstadoReporteACId = (listEstadoEventInseguroIdFiltro.length == 0?null:listEstadoEventInseguroIdFiltro);
    }
    
    cargarListConexionesVisorEvidencia(1);

    if(idOpcion != 2){
        dataParam2.matrixId = parseInt(getSession("unidadGosstId"));dataParam2.cargarIndicadorTrab = 0;
        dataParam2.trabajadorId = parseInt(getSession("trabajadorGosstId"));

        callAjaxPostSimple(URL+'/acinseguro/movil/vista_colaborador',dataParam2,1,procesarCargaReportesEventoUsuario);
    }else{
        callAjaxPostSimple(URL+'/acinseguro/movil/empresa',dataParam2,1,procesarCargaReportesEventoEmpresa);
    }
}

var listActoTipo = [],listOrigenActo = [],lisTipoReporteLugar = [];
var listClasificacionAccionEventoColaborador = [];
var listNivelActoColaborador = [];
var listUnidades = [],listDivisionesSimple = [],listFactoresRiesgo = [],listPeligrosAc = [];

function procesarCargaReportesEventoUsuario(data) {
   regresarEventosInseguros();
   listarOpcionesAc();

    listActoTipo = data.listActInsegTipo;
    listClasificacionAccionEventoColaborador = data.clasificacionAccion;
    listOrigenActo = data.listOrigen;
    lisTipoReporteLugar = data.lisTipoReporteLugar;
    listCausaInmediataColaborador = data.listCausaInmediataSimple;
    listAreaActoColaborador = data.listArea;
    listNivelActoColaborador = data.listNivel;
    listSubTipoContactoColaborador = data.listFullTipoContacto;
    listFullEventosColaborador = data.actos;
    listFullTipoContactoColaborador = data.listFullTipoContacto;
    listUnidades = data.listUnidades;
    listDivisionesSimple = data.listDivisionesSimple;
    listFactoresRiesgo = data.listFactoresRiesgo;
    listPeligrosAc = data.listPeligrosAc;

    var selActoTipo = crearSelectOneMenuOblig("selActoTipo", "verCategAcordeTipoActoInseguro()", listActoTipo, "", "actTipoId", "actTipoName");

    var selOrigenActo = crearSelectOneMenuOblig("selOrigenActo", "", listOrigenActo, "", "id", "nombre");

    var selTipoReporteLugar = crearSelectOneMenuOblig("selTipoReporteLugar", "", lisTipoReporteLugar, "", "id", "nombre");

   var selNivelRiesgo = crearSelectOneMenuOblig("selNivelRiesgo", "", listNivelActoColaborador,
      ([670,716].includes(parseInt(getSession("gestopcompanyid"))) ? 6 : -1), "nivelRiesgoId", "nivelRiesgoNombre");

    var selUnidadEventInseg = crearSelectOneMenu("selUnidadEventInseg", "filtrarDivisionesSegunUnidadEventoInseguro()",
        listUnidades, "-1", "id", "nombre", (listUnidades.length == 0 ? "Sin unidades registradas" : null));

    var unidadTexto = (parseInt(getSession("gestopcompanyid")) == 714 ? "País - Empresa*" : "Unidad*"),
        divisionTexto = ([714, 716].includes(parseInt(getSession("gestopcompanyid"))) ? "Sede*" : "División*"),
        areaTexto = (parseInt(getSession("gestopcompanyid")) == 714 ? "Área - Proceso*" : "Área del evento*");

    var textoFormNoVlaido = "", textoFormCompleto = "", textoFormCompletoPersonal = "";

   if(parseInt(getSession("gestopcompanyid")) == 336){
      var listItemsFormCompletoPersonal=[
         {sugerencia:"",label:"Fecha de evento*",inputForm:"<input type='date' class='form-control' id='dateEventoColaborador'>"},
         {sugerencia:"",label:"Hora de evento*",inputForm:"<input type='time' class='form-control' id='timeEventoColaborador'>"},
         
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",label:"Trabajador reporta*",
          inputForm:"<input class='form-control' type='text' id='inputAutoTrabajador'>" +
                    "<div id='divAutoCompletarTrab'></div>" +
	            "<label>*Buscar trabajador por N° documento y/o nombre/apellido (debe ingresar 3 caracteres como mínimo).</label>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         
         {sugerencia:"",label:unidadTexto,inputForm:selUnidadEventInseg},
         {sugerencia:"",label:divisionTexto,inputForm:"",divContainer:"divSelDivisionActo"},
         {sugerencia:"",label:"Área ¿Dónde Ocurrió?*",inputForm:"",divContainer:"divSelAreaActo"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {
                sugerencia: "e.g. Almacen N°5 en las escaleras",
                label: "Lugar" +
                    "<br><span style='color:blue;font-weight:bold;'>(Opcional)</span>",
                inputForm: "<input type='text' class='form-control' id='inputDescLugar' placeholder=''>"
            },
            {
                sugerencia: "",
                label: "Acto/Condición (para marcar)*",
                inputForm: "",
                divContainer: "divSelTipoActoColaborador"
            },
            {
                sugerencia: "e.g. Personal sin EPP, falta señalización, ronda", label: "¿Cuál es?",
                inputForm: "<input type='text' class='form-control' id='inputDescActo' placeholder=''>"
            },
            {sugerencia: "", label: "Código de riesgo*", inputForm: "", divContainer: "divSelSubTipoContactoActo"},
            {
                sugerencia: "",
                label: "Causa Raíz (¿Por qué pasó?)*",
                inputForm: "",
                divContainer: "divCausaInmColaborador"
            },
            {
                sugerencia: "", label: "Especificar Causa Raíz" +
                    "<br><span style='color:blue;font-weight:bold;'>(Opcional)</span>",
                inputForm: "<input type='text' class='form-control' id='inputEspCausaActo' placeholder=''>"
            },
            {
                sugerencia: "e.g. Señalización temporal, se notificó al supervisor",
                label: "Acción inmediata (Qué hiciste)" +
                    "<br><span style='color:blue;font-weight:bold;'>(Opcional)</span>",
                inputForm: "<input type='text' class='form-control' id='inputDescCorrInm' placeholder=' '>"
            },
            //{sugerencia:"",label:"Observación",inputForm:selOrigenActo},
            {
                sugerencia: "", label: "Evidencia" +
                    "<br><span style='color:blue;font-weight:bold;'>(Opcional)</span>",
                inputForm: "", divContainer: "eviActo"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
            {
                sugerencia: "", label: "",
                inputForm: "<button type='submit' class='btn btn-success'>" +
                    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
                    "</button>"
            }
        ];

        listItemsFormCompletoPersonal.forEach(function (val, index) {
            textoFormCompletoPersonal += obtenerSubPanelModuloVersionDos(val);
        });
   }else if(parseInt(getSession("gestopcompanyid")) == 670){
        var listItemsFormCompleto = [
            {
                sugerencia: "", label: "Fecha de evento*",
                inputForm: "<input type='date' class='form-control' id='dateEventoColaborador'>"
            },
            {
                sugerencia: "", label: "Hora de evento*",
                inputForm: "<input type='time' class='form-control' id='timeEventoColaborador'>"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
            {sugerencia: "", label: unidadTexto, inputForm: selUnidadEventInseg},
            {sugerencia: "", label: divisionTexto, inputForm: "", divContainer: "divSelDivisionActo"},
            {sugerencia: "", label: areaTexto, inputForm: "", divContainer: "divSelAreaActo"},
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
            {
                sugerencia: "e.g. Almacen N°5 en las escaleras", label: "Lugar exacto del evento",
                inputForm: "<input type='text' class='form-control' id='inputDescLugar' placeholder=''>"
            },
            {
                sugerencia: "e.g. Personal sin EPP, falta señalización, ronda", label: "¿Qué va a reportar?",
                inputForm: "<input type='text' class='form-control' id='inputDescActo' placeholder=''>"
            },
            {sugerencia: "", label: "Tipo de reporte*", inputForm: "", divContainer: "divSelTipoActoColaborador"},
            {
                sugerencia: "",
                clase: "campoPosibleCausaInmediata-AcSubestandar",
                label: "Posible causa inmediata (¿Por qué pasó?)*",
                inputForm: "",
                divContainer: "divCausaInmColaborador"
            },
            {
                sugerencia: "", clase: "campoRiesgoAsociado-AcSubestandar",
                label: "Riesgo Asociado*", inputForm: "", divContainer: "divSelSubTipoContactoActo"
            },
            {
                sugerencia: "", clase: "campoNivelRiesgo-AcSubestandar",
                label: "Nivel de riesgo*", inputForm: selNivelRiesgo
            },
            {
                sugerencia: "",
                label: "Causa inmediata <br><span style='color:blue;font-weight:bold;'>(Opcional)</span>",
                inputForm: "<input type='text' class='form-control' id='inputEspCausaActo' placeholder=''>"
            },
            {
                sugerencia: "e.g. Señalización temporal, se notificó al supervisor ",
                label: "Corrección (Realizada por quien reporta)",
                inputForm: "<input type='text' class='form-control' id='inputDescCorrInm' placeholder=''>"
            },
            //{sugerencia:"",label:"Observación",inputForm:selOrigenActo},
            {
                sugerencia: "", label: "Evidencia del reporte",
                inputForm: "", divContainer: "eviActo"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
            {
                sugerencia: "", label: "",
                inputForm: "<button type='submit' class='btn btn-success'>" +
                    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
                    "</button>"
            }
        ];

        listItemsFormCompleto.forEach(function (val, index) {
            textoFormCompleto += obtenerSubPanelModuloVersionDos(val);
        });
   }else{
        var listItemsFormCompleto = [
            {
                sugerencia: "", label: "Fecha de evento*",
                inputForm: "<input type='date' class='form-control' id='dateEventoColaborador'>"
            },
            {
                sugerencia: "", label: "Hora de evento*",
                inputForm: "<input type='time' class='form-control' id='timeEventoColaborador'>"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
            {sugerencia: "", label: unidadTexto, inputForm: selUnidadEventInseg},
            {sugerencia: "", label: divisionTexto, inputForm: "", divContainer: "divSelDivisionActo"},
            {sugerencia: "", label: areaTexto, inputForm: "", divContainer: "divSelAreaActo"},
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
            {
                sugerencia: "e.g. Personal sin EPP, falta señalización, ronda", label: "¿Qué va a reportar?",
                inputForm: "<input type='text' class='form-control' id='inputDescActo' placeholder=''>"
            },
            {sugerencia: "", label: "Tipo de reporte*", inputForm: "", divContainer: "divSelTipoActoColaborador"},
            {
                sugerencia: "",
                clase: "campoPosibleCausaInmediata-AcSubestandar",
                label: "Posible causa inmediata (¿Por qué pasó?)*",
                inputForm: "",
                divContainer: "divCausaInmColaborador"
            }
        ];

        if (parseInt(getSession("gestopcompanyid")) == 714) {
            var selFactorRiesgoEventInseg = crearSelectOneMenuOblig("selFactorRiesgoEventInseg",
                "filtrarPeligrosSegunFactorRiesgoEventoInseguro()", listFactoresRiesgo, "", "id", "nombre");

            listItemsFormCompleto.push(
                {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
                {sugerencia: "", label: "Factor de riesgo", inputForm: selFactorRiesgoEventInseg},
                {sugerencia: "", label: "Peligro", inputForm: "", divContainer: "divSelPeligroActo"},
                {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""});
        }

        listItemsFormCompleto.push(
            {
                sugerencia: "", clase: "campoRiesgoAsociado-AcSubestandar", label: "Riesgo Asociado*",
                inputForm: "", divContainer: "divSelSubTipoContactoActo"
            },
            {
                sugerencia: "",
                clase: "campoNivelRiesgo-AcSubestandar",
                label: "Nivel de riesgo*",
                inputForm: selNivelRiesgo
            },
            {
                sugerencia: "e.g. Almacen N°5 en las escaleras", label: "Lugar exacto del evento",
                inputForm: "<input type='text' class='form-control' id='inputDescLugar' placeholder=''>"
            },
            {
                sugerencia: "", label: "Causa inmediata" +
                    "<br><span style='color:blue;font-weight:bold;'>(Opcional)</span>",
                inputForm: "<input type='text' class='form-control' id='inputEspCausaActo' placeholder=''>"
            },
            {
                sugerencia: "e.g. Señalización temporal, se notificó al supervisor ",
                label: "Corrección (Realizada por quien reporta)",
                inputForm: "<input type='text' class='form-control' id='inputDescCorrInm' placeholder=''>"
            },
            {
                sugerencia: "",label: "Trabajador observado",
                inputForm: "<input type='text' class='form-control' id='inputTrabObsEventInseg' placeholder=''>"
            },
            {
                sugerencia: "",label: "Trabajador que reporta",
                inputForm: "<input type='text' class='form-control' id='inputTrabQueReportaEventInseg' placeholder=''>"
            },
            //{sugerencia:"",label:"Observación",inputForm:selOrigenActo},
            {
                sugerencia: "", label: "Evidencia del reporte",
                inputForm: "", divContainer: "eviActo"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: ""},
            {
                sugerencia: "", label: "",
                inputForm: "<button type='submit' class='btn btn-success'>" +
                    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
                    "</button>"
            });

        listItemsFormCompleto.forEach(function (val, index) {
            textoFormCompleto += obtenerSubPanelModuloVersionDos(val);
        });
   }

   var textActosRevisados = "", textActosRevisadosPendientes = "", textActosNoRevisados = "", textActosNoValidos = "",textActosRevisadosNoAccCor = "";
   var numActRevisados = 0, numActRevisadosPendientes = 0, numActNoRevisados = 0, numActNoValidos = 0,numActRevisadosNoAccCor = 0;

   listFullEventosColaborador.forEach(function (val, index) {
        var accion = "";
        var noticia = "<div class='cropGosst' id='imgVer" + val.acInseguroId + "' style='display:none;''><img src='../imagenes/preview.png'></div>";
        var textRiesgo = (numAreasResponsable == 0?"":val.subTipoContacto.nombre);
        var textNivelRiesgo = (numAreasResponsable == 0?"":val.nivelRiesgoNombre);
        var textLugar = val.reporteLugar;
        var textMotivo = (val.tipoValido.id != 2?"":(val.motivoValido == ""?"------":val.motivoValido));
        var textoReporte = (numAreasResponsable == 0?val.trabajadorRegistraNombre:val.reporteNombre);
               
        var textoAcciones = (val.estadoActualId == 4?"<i class='fa fa-info'></i> " +
           "<span style='color:red;font-weight:bolder;'>"+"*Este reporte no requiere acciones correctivas adicionales"+"</span>":
            (numAreasResponsable == 0 || [1,5].includes(val.estadoActualId)?"":
             "<a class='efectoLink' onclick='verAccionesMejoraEventoInseguro("+index+")'>" +
                "Ver Acciones de Mejora ("+val.numAccionesColaboradorCompletadas+" / "+val.numAccionesColaboradorTotal+") " +
                "<i class='fa fa-angle-double-down'></i>" +
             "</a>" +
             "<div class='divMovilHistorialTrabajador' id='detalleAccionEvento"+val.acInseguroId+"'></div>"));

      var textVerOpciones = (numAreasResponsable == 0 || [4,5].includes(val.estadoActualId)?"":
         "<section style='text-align:left;' id='opciones0'>" +
            "<a class='efectoLink btn-gestion' onclick='indexEventoColaborador = "+index+";toggleMenuOpcionAC(this,"+val.acInseguroId+",0)'>" +
               "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
            "</a>"+menuOpcionAc[([2,3].includes(val.estadoActualId)?2:0)] +
         "</section>");

      var textActos = "";

      var listTotal=[
            {
                sugerencia: "", anchoLabel: "col-sm-8", anchoDiv: "col-sm-4", inputForm: textVerOpciones,
                label: "<span style='color:blue;font-size:18px;font-weight:bolder;'># CÓDIGO: " + val.codigo + "</span>"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "",
                label: "<i aria-hidden='true' class='fa fa-calendar'></i> Fecha:",
                inputForm: val.reporteFechaTexto
            },
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "",
                label: "<i aria-hidden='true' class='fa fa-clock-o'></i> Hora:",
                inputForm: val.horaTexto
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""}
        ];

   if(![336,670].includes(parseInt(getSession("gestopcompanyid")))){
      listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Unidad dónde ocurrió:",inputForm:val.matrixName},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> División dónde ocurrió:",inputForm:val.divisionNombre});
   }

   listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Área dónde ocurrió:",inputForm:val.areaNombre},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Descripción / Operación realizada:",
       inputForm:"("+val.nivelRiesgoNombre+") "+val.acInseguroNombre});

        if (textRiesgo != "") {
            listTotal.push(
                {
                    sugerencia: "", anchoLabel: "", anchoDiv: "", clase: "campoRiesgoAsociado-AcSubestandar",
                    label: "<i aria-hidden='true' class='fa fa-warning'></i> Riesgo asociado:",
                    inputForm: textRiesgo
                });
        }

        if (textNivelRiesgo != "") {
            listTotal.push(
                {
                    sugerencia: "", anchoLabel: "", anchoDiv: "", clase: "campoNivelRiesgo-AcSubestandar",
                    label: "<i aria-hidden='true' class='fa fa-eye'></i> Nivel de riesgo:",
                    inputForm: textNivelRiesgo
                });
        }

        listTotal.push(
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "",
                label: "<i aria-hidden='true' class='fa fa-info'></i> Tipo:",
                inputForm: val.acInseguroTipoNombre
            });

        if (getSession("gestopcompanyid") == 714) {
            if (val.factorRiesgo.nombre.length != 0) {
                listTotal.push({
                    sugerencia: "", anchoLabel: "", anchoDiv: "",
                    label: "<i class='fa fa-info'></i> Factor de riesgo:", inputForm: val.factorRiesgo.nombre
                });
            }

            if (val.peligroAc.nombre.length != 0) {
                listTotal.push({
                    sugerencia: "", anchoLabel: "", anchoDiv: "",
                    label: "<i class='fa fa-info'></i> Peligro:", inputForm: val.peligroAc.nombre
                });
            }
        }

        if (textLugar != "") {
            listTotal.push(
                {
                    sugerencia: "",
                    anchoLabel: "",
                    anchoDiv: "",
                    label: "<i class='fa fa-info'></i> Lugar:",
                    inputForm: textLugar
                });
        }

        if (parseInt(getSession("gestopcompanyid")) != 336 && val.trabajadorObservado.length != 0) {
            listTotal.push({
                sugerencia: "",
                anchoLabel: "",
                anchoDiv: "",
                label: "<i class='fa fa-info'></i> Trabajador observado: ",
                inputForm: val.trabajadorObservado
            });
        }

        if (parseInt(getSession("gestopcompanyid")) != 336 && val.trabajadorQueReporta.length != 0) {
            listTotal.push({
                sugerencia: "",
                anchoLabel: "",
                anchoDiv: "",
                label: "<i class='fa fa-info'></i> Trabajador que reporta: ",
                inputForm: val.trabajadorQueReporta
            });
        }
        
      cargarListConexionesVisorEvidencia(0,"/acinseguro/evidencia/url",val.evidenciaNombre);

      var linkEvidencia = (val.evidenciaNombre.length == 0?"------":
         "<a href='"+URL+"/acinseguro/evidencia?acInseguroId="+val.acInseguroId+"' class='efectoLink' target='_blank'>"+val.evidenciaNombre+"</a>" +
          getButtonVisorEvidencia(val.evidenciaNombre,val.acInseguroId,1,0));

      listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-picture-o'></i> Evidencia:",inputForm:linkEvidencia});
      
      if([154,714].includes(parseInt(getSession("gestopcompanyid")))){
	 listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Observaciones preventivas de seguridad (OPS):",
	     inputForm: getButtonDescargaAmazonS3("/acinseguro/amazon_s3/evidencia_constancia_registro?acInseguroId="+val.acInseguroId,val.evidenciaConstanciaRegistroNombre,0) +
	        getButtonVisorEvidenciaAmazonS3(val.acInseguroId,val.evidenciaConstanciaRegistroNombre.replace(/['"]/g,''),val.evidenciaConstanciaRegistroUrl,1,0)}); 
      }
      
      listTotal.push({sugerencia:"", anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
          label:"<span style='font-size:18px;'><i class='fa fa-user'></i> Reportado por:</span>",inputForm:textoReporte});

      if(getSession("gestopcompanyid") != 336){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list-alt'></i> Corrección (realizada por quien reporta):",inputForm:val.reporteAccion});
      }

      if([2,3].includes(val.estadoActualId)){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
             label:"<span style='font-size:18px;'><i class='fa fa-book'></i> Estado de las actividades:</span>",
             inputForm:(val.estadoActualId == 3?"<span style='color:blue;font-size:18px;font-weight:bolder;'>Completado(s)</span>":
                "<span style='color:red;font-size:18px;font-weight:bolder;'>Pendiente(s)</span>")});
      }

      if(textoAcciones != ""){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:textoAcciones});
      }

      if(textMotivo != ""){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> <label style='color:red;'>Motivo:</label>",
             inputForm:"<label style='color:red'>"+textMotivo+"</label>"});
      }

      if(linkEvidencia != "------"){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:noticia});
      }

      textActos += "<div id='actoMovil"+val.acInseguroId+"' class='eventoGeneral' style='border-left:8px solid "+val.nivelColor+";'>" +     
                      "<form class='eventoGeneral'>";
         listTotal.forEach(function(val,index){
            textActos += obtenerSubPanelModuloVersionDos(val);
         });
      textActos +=    "</form>" +
                   "</div>";

      if(val.estadoActualId == 5){
	 textActosNoValidos += textActos;numActNoValidos++;
      }else if(val.estadoActualId == 4){
	 textActosRevisadosNoAccCor += textActos;numActRevisadosNoAccCor++;
      }else if(val.estadoActualId == 3){
	 textActosRevisados += textActos;numActRevisados++;
      }else if(val.estadoActualId == 2){
	 textActosRevisadosPendientes += textActos;numActRevisadosPendientes++;
      }else{
         textActosNoRevisados += textActos;numActNoRevisados++;
      }
   });

    var listItemsForm = [
        {sugerencia: "", label: "Descripción", inputForm: "", divContainer: "divDescripcionEventoNoValido"},
        {
            sugerencia: "", label: "Comentario",
            inputForm: "<input type='text' class='form-control' id='inputNoValidoActo' placeholder='' autofocus>"
        },
        {
            sugerencia: "", label: "",
            inputForm: "<button type='submit' class='btn btn-success'>" +
                "<i aria-hidden='true' class='fa fa-floppy'></i> Enviar" +
                "</button>"
        },
    ];

    listItemsForm.forEach(function (val, index) {
        textoFormNoVlaido += obtenerSubPanelModuloVersionDos(val);
    });

    var listPaneles = [
        {
            id: "subListNoValidoActo", clase: "listaAuxiliar", styleAux: "", buttonAd: "",
            btnOnclickAux: "", btnIconoAux: "", btnTitleAux: "", nombre: "A/C Subestándar No Válido",
            contenido: "<form class='eventoGeneral' id='noValidoActoTrabajador'>" +
                textoFormNoVlaido + "" +
                "</form>"
        },
        {
            id: "subImportActosColaborador", clase: "", styleAux: "", buttonAd: "",
            btnOnclickAux: "", btnIconoAux: "", btnTitleAux: "", nombre: "Import", contenido: ""
        }
    ];

    if([154,336].includes(parseInt(getSession("gestopcompanyid")))){
        listPaneles.push({id:"importNuevoEventoInseguro",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verNuevoImportEventoInseguro()",
            btnIconoAux:"fa-inbox",btnTitleAux:"Ver método import para registros A/C Subestándar.",nombre:"Import - A/C Subestándar",contenido:""
        });
    }

    if (parseInt(getSession("gestopcompanyid")) != 336) {
        listPaneles.push(
            {
                id: "subListNuevoActoCompleto", clase: "", styleAux: "", buttonAd: "",
                btnOnclickAux: "", btnIconoAux: "", btnTitleAux: "", nombre: "Nuevo A/C Subestándar",
                contenido: "<div class='eventoGeneral'>" +
                    "<form class='eventoGeneral' id='nuevoActoCompletoTrabajador'>" +
                    textoFormCompleto +
                    "</form>" +
                    "</div>"
            });
    } else {
        listPaneles.push(
            {
                id: "subListNuevoActoCompletoPersonal", clase: "", styleAux: "", buttonAd: "",
                btnOnclickAux: "", btnIconoAux: "", btnTitleAux: "", nombre: "Nuevo A/C Subestándar",
                contenido: "<div class='eventoGeneral'>" +
                    "<form class='eventoGeneral' id='nuevoActoCompletoPersonalTrabajador'>" +
                    textoFormCompletoPersonal +
                    "</form>" +
                    "</div>"
            });
    }

    listPaneles.push(
        {
            id: "subFiltroActo", clase: "", styleAux: "", buttonAd: "", btnOnclickAux: "verFiltroAcSubestandarTrab()",
            btnIconoAux: "fa-filter", btnTitleAux: "Ver valores del filtro para aplicarlo a esta sección.",
            nombre: "Filtro", contenido: ""
        },
        {
            id: "subListFullActosNoRevisados",
            clase: "",
            styleAux: "",
            buttonAd: "",
            btnOnclickAux: "",
            btnIconoAux: "",
            btnTitleAux: "",
            nombre: "<i aria-hidden='true' class='fa fa-warning'></i> " +
                "Reportes sin revisar (" + numActNoRevisados + ")",
            contenido: textActosNoRevisados
        },
        {
            id: "subListFullActosPendientes", clase: "", styleAux: "", buttonAd: "", btnOnclickAux: "", btnIconoAux: "",
            btnTitleAux: "", nombre: "<i aria-hidden='true' class='fa fa-warning'></i> " +
                "Reportes revisados - Actividades pendientes (" + numActRevisadosPendientes + ") ",
            contenido: textActosRevisadosPendientes
        },
        {
            id: "subListFullActos", clase: "", styleAux: "", buttonAd: "", btnOnclickAux: "", btnIconoAux: "",
            btnTitleAux: "", nombre: "<i aria-hidden='true' class='fa fa-warning'></i> " +
                "Reportes revisados - Actividades completadas (" + numActRevisados + ") ",
            contenido: textActosRevisados
        });
    
   if(parseInt(getSession("gestopcompanyid")) != 336){
      listPaneles.push(
         {id:"subListFullActosNoAccCor",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
	  btnTitleAux:"",nombre:"<i aria-hidden='true' class='fa fa-warning'></i> " +
	     "Reportes revisados - Actividades completadas [no requieren acciones correctivas] ("+numActRevisadosNoAccCor+")",
	  contenido:textActosRevisadosNoAccCor});
   }
    
    listPaneles.push(
        {
            id: "subListFullActosNoValidos", clase: "", styleAux: "", buttonAd: "", btnOnclickAux: "", btnIconoAux: "",
            btnTitleAux: "", nombre: "<i aria-hidden='true' class='fa fa-warning'></i> " +
                "Reportes revisados clasificados como no Válidos (" + numActNoValidos + ")",
            contenido: textActosNoValidos
        },
        {
            id: "subConsolidadoActos",
            clase: "",
            styleAux: "",
            buttonAd: "",
            btnOnclickAux: "verTablaConsolidadoActos()",
            btnIconoAux: "fa-arrow-right",
            btnTitleAux: "Ir al consolidado asociado a la información de esta sección.",
            nombre: "<i aria-hidden='true' class='fa fa-table'></i> Ver Consolidado",
            contenido: ""
        },
//        {
//            id: "subIndicadoresActos",
//            clase: "",
//            styleAux: "",
//            buttonAd: "",
//            btnOnclickAux: "verIndicadoresConsolidadoActos()",
//            btnIconoAux: "fa-arrow-right",
//            btnTitleAux: "Ir a los gráficos asociados a la información de esta sección.",
//            nombre: "<i aria-hidden='true' class='fa fa-pie-chart'></i> Ver Indicadores",
//            contenido: ""
//        },
        {
            id: "subQuicksightActos",
            clase: "",
            styleAux: "",
            buttonAd: "",
            btnOnclickAux: "verQuicksightActos()",
            btnIconoAux: "fa-arrow-right",
            btnTitleAux: "Ir al análisis de datos de esta sección.",
            nombre: "<i aria-hidden='true' class='fa fa-pie-chart'></i> Ver análisis de datos",
            contenido: ""
        });

    agregarPanelesDivPrincipalVersionTres(listPaneles);

   if(parseInt(getSession("gestopcompanyid")) == 336){
      verAutoCompletarTrabAcInseguro();
   }

    crearSelectOneMenuObligUnitarioCompleto("selActoTipo", "verCategAcordeTipoActoInseguro()",
        listActoTipo, "actTipoId", "actTipoName", "#divSelTipoActoColaborador", "Sin especificar");

    if ([670, 714, 716].includes(parseInt(getSession("gestopcompanyid")))) {
        listSubTipoContactoColaborador.forEach(function (val) {
            if (val.id == 45) {
                val.selected = 1;
            }
        });
    }

    crearSelectOneMenuNoObligUnitarioCompleto("selSubTipoContactoColaborador", "verNombreCompletoSelSubTipo()",
        listSubTipoContactoColaborador, "id", "nombre", "#divSelSubTipoContactoActo", "Sin especificar");

    $("#divSelSubTipoContactoActo").append("<label id='auxSubTipo'></label>");

    filtrarDivisionesSegunUnidadEventoInseguro();
    verCategAcordeTipoActoInseguro();
    verAcordeCausaInmediata();

    if (parseInt(getSession("gestopcompanyid")) == 714) {
        filtrarPeligrosSegunFactorRiesgoEventoInseguro();
    }

   if([670,716].includes(parseInt(getSession("gestopcompanyid")))) {
      $(".campoPosibleCausaInmediata-AcSubestandar").hide();
      $(".campoRiesgoAsociado-AcSubestandar").hide();
      $(".campoNivelRiesgo-AcSubestandar").hide();
   }else if(parseInt(getSession("gestopcompanyid")) == 714){
      $(".campoPosibleCausaInmediata-AcSubestandar").hide();$(".campoRiesgoAsociado-AcSubestandar").hide();
   }

    var options = {
        container: "#eviActo",
        functionCall: function () {
        },
        descargaUrl: "",
        esNuevo: true,
        idAux: "EventoSub",
        evidenciaNombre: ""
    };

    crearFormEvidenciaCompleta(options);

    $("#dateEventoColaborador").val(convertirFechaInputNoUTC(new Date()));
    $("#timeEventoColaborador").val(obtenerHoraActual(1));

   $('#nuevoActoCompletoTrabajador').on('submit',function(e){ //use on if jQuery 1.7+
      e.preventDefault();  //prevent form from submitting
      guardarActoCompletoTrabajador();
   });

   $('#nuevoActoCompletoPersonalTrabajador').on('submit',function(e){ //use on if jQuery 1.7+
      e.preventDefault();  //prevent form from submitting
      guardarActoCompletoTrabajador();
   });

   $('#noValidoActoTrabajador').on('submit',function(e){
      e.preventDefault();
      var motivoValido = $("#inputNoValidoActo").val();

      var dataParam={
         acInseguroId:eventoColaboradorObj.acInseguroId,motivoValido:motivoValido
      };

      callAjaxPost(URL+'/acinseguro/valido/save',dataParam,function(data){
         mensajeUx = "<label>El reporte A/C Subestándar seleccionado se marcó como no válido.</label>";
         mensajesUx(mensajeUx, 1, "", "ActualizarAcSubestVistaCol");

         $("#modalMensajeUxActualizarAcSubestVistaCol").on("hidden.bs.modal",function(){
	    habilitarReporteEventoUsuario();
         });
      });
   });

    var textVerOpcionesLinkAux =
        "<section style='text-align:left;' id='opciones4'>" +
        "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionAC(this,0,4)'>" +
        "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
        "</a>" + menuOpcionAc[4] +
        "</section>";

    $("#subImportActosColaborador .tituloSubList")
        .html(textVerOpcionesLinkAux + " <i aria-hidden='true' class='fa fa-upload'></i> Importar A/C subestándar");

    // *** Ocultar contenedores ***
    if (numAreasResponsable == 0) {
        $("#subConsolidadoActos").hide();
//        $("#subIndicadoresActos").hide();
    }

    if (parseInt(getSession("gestopcompanyid")) != 336) {
        $("#subImportActosColaborador").hide();
    }

    $("#subListNoValidoActo").hide();
    $("#subListNuevoActoCompletoPersonal .contenidoSubList").hide();
    $("#subListNuevoActoCompleto .contenidoSubList").hide();

    $("#liMenuTrabajador10 .alertaMenu").html(numActNoRevisados + numActRevisadosPendientes);

    $("#subListFullActosNoValidos .tituloSubList").css({"color": colorPuntajeGosst(0.5) + " !important"});
    $("#subListFullActosPendientes .tituloSubList").css({"color": colorPuntajeGosst(0.5) + " !important"});
    $("#subListFullActos .tituloSubList").css({"color": colorPuntajeGosst(1.0) + " !important"});
    
   if(parseInt(getSession("gestopcompanyid")) != 336){
      $("#subListFullActosNoAccCor .tituloSubList").css({"color":colorPuntajeGosst(1.0)+" !important"});
   }
    
    $("#subListFullActosNoRevisados .tituloSubList").css({"color": colorPuntajeGosst(0.0) + " !important"});

    $.unblockUI();
}

function procesarCargaReportesEventoEmpresa(data){
   var textActosRevisados = "",textActosRevisadosPendientes = "",textActosNoRevisados = "",textActosNoValidos = "",textActosRevisadosNoAccCor = "";
   var numActRevisados = 0,numActRevisadosPendientes = 0,numActNoRevisados = 0,numActNoValidos = 0,numActRevisadosNoAccCor = 0;

   listFullEventosColaborador = data.actos;

   listFullEventosColaborador.forEach(function (val, index) {
      var accion = "";
      var noticia = "<div class='cropGosst' id='imgVer"+val.acInseguroId+"' style='display:none;''>"+"<img src='../imagenes/preview.png'>"+"</div>";
      var textRiesgo = (numAreasResponsable == 0?"":val.subTipoContacto.nombre);
      var textNivelRiesgo = (numAreasResponsable == 0?"":val.nivelRiesgoNombre);
      var textLugar = val.reporteLugar;
      var textMotivo = (val.tipoValido.id != 2?"":(val.motivoValido == ""?"------":val.motivoValido));
      var textoReporte = (numAreasResponsable == 0?val.trabajadorRegistraNombre:val.reporteNombre);
      
      var textoAcciones = (val.estadoActualId == 4?"<i class='fa fa-info'></i> " +
         "<span style='color:red;font-weight:bolder;'>"+"*Este reporte no requiere acciones correctivas adicionales"+"</span>":
          (numAreasResponsable == 0 || [1,5].includes(val.estadoActualId)?"":
           "<a class='efectoLink' onclick='verAccionesMejoraEventoInseguro("+index+")'>" +
              "Ver Acciones de Mejora ("+val.numAccionesColaboradorCompletadas+" / "+val.numAccionesColaboradorTotal+") " +
              "<i class='fa fa-angle-double-down'></i>" +
           "</a>" +
           "<div class='divMovilHistorialTrabajador' id='detalleAccionEvento"+val.acInseguroId+"'></div>"));

      var textVerOpciones = (numAreasResponsable == 0 || [4,5].includes(val.estadoActualId)?"":
         "<section style='text-align:left;' id='opciones0'>" +
            "<a class='efectoLink btn-gestion' onclick='indexEventoColaborador = "+index+";toggleMenuOpcionAC(this,"+val.acInseguroId+",0)'>" +
               "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
            "</a>"+menuOpcionAc[([2,3].includes(val.estadoActualId)?2:0)] +
         "</section>");

      var textActos = "";

      var listTotal=[
            {
                sugerencia: "", anchoLabel: "col-sm-8", anchoDiv: "col-sm-4", inputForm: textVerOpciones,
                label: "<span style='color:blue;font-size:18px;font-weight:bolder;'># CÓDIGO: " + val.codigo + "</span>"
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "",
                label: "<i aria-hidden='true' class='fa fa-calendar'></i> Fecha:",
                inputForm: val.reporteFechaTexto
            },
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "",
                label: "<i aria-hidden='true' class='fa fa-clock-o'></i> Hora:",
                inputForm: val.horaTexto
            },
            {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""}
   ];
        
   if(![336,670].includes(parseInt(getSession("gestopcompanyid")))){
      listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Unidad dónde ocurrió:",inputForm:val.matrixName},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> División dónde ocurrió:",inputForm:val.divisionNombre});
   }

   listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Área dónde ocurrió:",inputForm:val.areaNombre},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Descripción / Operación realizada:",
       inputForm:"("+val.nivelRiesgoNombre+") "+val.acInseguroNombre});

        if (textRiesgo != "") {
            listTotal.push(
                {
                    sugerencia: "", anchoLabel: "", anchoDiv: "",
                    label: "<i aria-hidden='true' class='fa fa-warning'></i> Riesgo asociado:",
                    inputForm: textRiesgo
                });
        }

        if (textNivelRiesgo != "") {
            listTotal.push(
                {
                    sugerencia: "", anchoLabel: "", anchoDiv: "",
                    label: "<i aria-hidden='true' class='fa fa-eye'></i> Nivel de riesgo:",
                    inputForm: textNivelRiesgo
                });
        }

        listTotal.push(
            {
                sugerencia: "", anchoLabel: "", anchoDiv: "",
                label: "<i aria-hidden='true' class='fa fa-info'></i> Tipo:",
                inputForm: val.acInseguroTipoNombre
            });

        if (textLugar != "") {
            listTotal.push(
                {
                    sugerencia: "", anchoLabel: "", anchoDiv: "",
                    label: "<i class='fa fa-info'></i> Lugar:",
                    inputForm: textLugar
                });
        }
        
      cargarListConexionesVisorEvidencia(0,"/acinseguro/evidencia/url",val.evidenciaNombre);

      var linkEvidencia = (val.evidenciaNombre.length == 0?"------":
         "<a href='"+URL+"/acinseguro/evidencia?acInseguroId="+val.acInseguroId+"' class='efectoLink' target='_blank'>"+val.evidenciaNombre+"</a>" +
          getButtonVisorEvidencia(val.evidenciaNombre,val.acInseguroId,1,0));

      listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-picture-o'></i> Evidencia:",inputForm:linkEvidencia});
      
      if([154,714].includes(parseInt(getSession("gestopcompanyid")))){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Observaciones preventivas de seguridad (OPS):",
	     inputForm: getButtonDescargaAmazonS3("/acinseguro/amazon_s3/evidencia_constancia_registro?acInseguroId="+val.acInseguroId,val.evidenciaConstanciaRegistroNombre,0) +
		        getButtonVisorEvidenciaAmazonS3(val.acInseguroId,val.evidenciaConstanciaRegistroNombre.replace(/['"]/g,''),val.evidenciaConstanciaRegistroUrl,1,0)}); 
      }
	      
      listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
          label:"<span style='font-size:18px;'><i class='fa fa-user'></i> Reportado por:</span>",inputForm:textoReporte});

      if(getSession("gestopcompanyid") != 336){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list-alt'></i> Corrección (realizada por quien reporta):",inputForm:val.reporteAccion});
      }

      if([2,3].includes(val.estadoActualId)){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
             label:"<span style='font-size:18px;'><i class='fa fa-book'></i> Estado de las actividades:</span>",
             inputForm:(val.estadoActualId == 3?"<span style='color:blue;font-size:18px;font-weight:bolder;'>Completado(s)</span>":
                "<span style='color:red;font-size:18px;font-weight:bolder;'>Pendiente(s)</span>")});
      }

      if(textoAcciones != ""){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"col-sm-0", anchoDiv:"col-sm-12",label:"",inputForm:textoAcciones});
      }

      if(textMotivo != ""){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> <label style='color:red;'>Motivo:</label>",
             inputForm:"<label style='color:red'>" + textMotivo + "</label>"});
      }

      if(linkEvidencia != "------"){
         listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-0", anchoDiv:"col-sm-12",label:"",inputForm:noticia});
      }

      textActos += "<div id='actoMovil"+val.acInseguroId+"' class='eventoGeneral' style='border-left:8px solid "+val.nivelColor+";'>" +
                      "<form class='eventoGeneral'>";
         listTotal.forEach(function(val,index){
            textActos += obtenerSubPanelModuloVersionDos(val);
         });
      textActos +=    "</form>" +
                   "</div>";

      if(val.estadoActualId == 5){
   	 textActosNoValidos += textActos;numActNoValidos++;
      }else if(val.estadoActualId == 4){
   	 textActosRevisadosNoAccCor += textActos;numActRevisadosNoAccCor++;
      }else if(val.estadoActualId == 3){
   	 textActosRevisados += textActos;numActRevisados++;
      }else if(val.estadoActualId == 2){
   	 textActosRevisadosPendientes += textActos;numActRevisadosPendientes++;
      }else{
         textActosNoRevisados += textActos;numActNoRevisados++;
      }
   });

    var listPaneles = [
        {
            id: "subListNoValidoActo", clase: "", styleAux: "", buttonAd: "",
            btnOnclickAux: "", btnIconoAux: "", btnTitleAux: "", nombre: "A/C Subestándar No Válido", contenido: ""
        },
        {
            id: "subImportActosColaborador", clase: "", styleAux: "", buttonAd: "",
            btnOnclickAux: "", btnIconoAux: "", btnTitleAux: "", nombre: "Import", contenido: ""
        }
    ];

    if([154,336].includes(parseInt(getSession("gestopcompanyid")))){
        listPaneles.push({id:"importNuevoEventoInseguro",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verNuevoImportEventoInseguro()",
            btnIconoAux:"fa-inbox",btnTitleAux:"Ver método import para registros A/C Subestándar.",nombre:"Import - A/C Subestándar",contenido:""
        });
    }


    if (parseInt(getSession("gestopcompanyid")) != 336) {
        listPaneles.push(
            {
                id: "subListNuevoActoCompleto", clase: "", styleAux: "", buttonAd: "",
                btnOnclickAux: "", btnIconoAux: "", btnTitleAux: "", nombre: "Nuevo A/C Subestándar", contenido: ""
            });
    } else {
        listPaneles.push(
            {
                id: "subListNuevoActoCompletoPersonal", clase: "", styleAux: "", buttonAd: "",
                btnOnclickAux: "", btnIconoAux: "", btnTitleAux: "", nombre: "Nuevo A/C Subestándar", contenido: ""
            });
    }

    listPaneles.push(
        {
            id: "subFiltroActo", clase: "", styleAux: "", buttonAd: "", btnOnclickAux: "verFiltroAcSubestandarTrab()",
            btnIconoAux: "fa-filter", btnTitleAux: "Ver valores del filtro para aplicarlo a esta sección.",
            nombre: "Filtro", contenido: ""
        },
        {
            id: "subListFullActosNoRevisados",
            clase: "",
            styleAux: "",
            buttonAd: "",
            btnOnclickAux: "",
            btnIconoAux: "",
            btnTitleAux: "",
            nombre: "<i aria-hidden='true' class='fa fa-warning'></i> " +
                "Reportes sin revisar (" + numActNoRevisados + ")",
            contenido: textActosNoRevisados
        },
        {
            id: "subListFullActosPendientes", clase: "", styleAux: "", buttonAd: "", btnOnclickAux: "", btnIconoAux: "",
            btnTitleAux: "", nombre: "<i aria-hidden='true' class='fa fa-warning'></i> " +
                "Reportes revisados - Actividades pendientes (" + numActRevisadosPendientes + ")",
            contenido: textActosRevisadosPendientes
        },
        {
            id: "subListFullActos", clase: "", styleAux: "", buttonAd: "", btnOnclickAux: "", btnIconoAux: "",
            btnTitleAux: "", nombre: "<i aria-hidden='true' class='fa fa-warning'></i> " +
                "Reportes revisados - Actividades completadas (" + numActRevisados + ")",
            contenido: textActosRevisados
        });
    
   if(parseInt(getSession("gestopcompanyid")) != 336){
      listPaneles.push( 
         {id:"subListFullActosNoAccCor",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"", 
          btnTitleAux:"",nombre:"<i aria-hidden='true' class='fa fa-warning'></i> " +
             "Reportes revisados - Actividades completadas [no requieren acciones correctivas] ("+numActRevisadosNoAccCor+")",
          contenido: textActosRevisadosNoAccCor});
   }
    
    listPaneles.push( 
        {
            id: "subListFullActosNoValidos", clase: "", styleAux: "", buttonAd: "", btnOnclickAux: "", btnIconoAux: "",
            btnTitleAux: "", nombre: "<i aria-hidden='true' class='fa fa-warning'></i> " +
                "Reportes revisados clasificados como no Válidos (" + numActNoValidos + ")",
            contenido: textActosNoValidos
        },
        {
            id: "subConsolidadoActos",
            clase: "",
            styleAux: "",
            buttonAd: "",
            btnOnclickAux: "verTablaConsolidadoActos()",
            btnIconoAux: "fa-arrow-right",
            btnTitleAux: "Ir al consolidado asociado a la información de esta sección.",
            nombre: "<i aria-hidden='true' class='fa fa-table'></i> Ver Consolidado",
            contenido: ""
        },
//        {
//            id: "subIndicadoresActos",
//            clase: "",
//            styleAux: "",
//            buttonAd: "",
//            btnOnclickAux: "verIndicadoresConsolidadoActos()",
//            btnIconoAux: "fa-arrow-right",
//            btnTitleAux: "Ir a los gráficos asociados a la información de esta sección.",
//            nombre: "<i aria-hidden='true' class='fa fa-pie-chart'></i> Ver Indicadores",
//            contenido: ""
//        },
        {
            id: "subQuicksightActos",
            clase: "",
            styleAux: "",
            buttonAd: "",
            btnOnclickAux: "verQuicksightActos()",
            btnIconoAux: "fa-arrow-right",
            btnTitleAux: "Ir al análisis de datos de esta sección.",
            nombre: "<i aria-hidden='true' class='fa fa-pie-chart'></i> Ver análisis de datos",
            contenido: ""
        });

    agregarPanelesDivPrincipalVersionTres(listPaneles);

    // *** Ocultar contenedores ***
    if (numAreasResponsable == 0) {
        $("#subConsolidadoActos").hide();
//        $("#subIndicadoresActos").hide();
    }

    $("#subImportActosColaborador").hide();
    $("#subListNoValidoActo").hide();
    $("#subListNuevoActoCompleto").hide();
    $("#subListNuevoActoCompletoPersonal").hide();

    $("#liMenuTrabajador10 .alertaMenu").html(numActNoRevisados + numActRevisadosPendientes);

    $("#subListFullActosNoValidos .tituloSubList").css({"color": colorPuntajeGosst(0.5) + " !important"});
    $("#subListFullActosPendientes .tituloSubList").css({"color": colorPuntajeGosst(0.5) + " !important"});
    $("#subListFullActos .tituloSubList").css({"color": colorPuntajeGosst(1.0) + " !important"});
    
   if(parseInt(getSession("gestopcompanyid")) != 336){
      $("#subListFullActosNoAccCor .tituloSubList").css({"color":colorPuntajeGosst(1.0)+" !important"});
   }
     
    $("#subListFullActosNoRevisados .tituloSubList").css({"color": colorPuntajeGosst(0.0) + " !important"});

    $.unblockUI();
}

var listTrabajadoresAcInseguro = []; 

function verAutoCompletarTrabAcInseguro(){
   var nombre = $("#inputAutoTrabajador").val().trim();
	
   if(nombre.length >= 3){
      var dataParam={
	 trabajadorNombre:"%"+nombre+"%",isBuscador:1,empresaId:parseInt(getSession("gestopcompanyid"))
      }; 
 	   
      callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
	 listTrabajadoresAcInseguro = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"No encontrado"}]:data.trabajadores);
            
         var selAutoTrabajador = crearSelectOneMenuOblig("selAutoTrabajador","",listTrabajadoresAcInseguro,"","trabajadorId","nombre");
         
         $("#divAutoCompletarTrab").html(selAutoTrabajador);
         $("#inputAutoTrabajador").attr("onkeyup","verAutoCompletarTrabAcInseguro()");
      });
   }else{
      listTrabajadoresAcInseguro = [{trabajadorId:-1,nombre:"No encontrado"}];
       
      var selAutoTrabajador = crearSelectOneMenuOblig("selAutoTrabajador","",listTrabajadoresAcInseguro,"","trabajadorId","nombre");
     	    		 		       
      $("#divAutoCompletarTrab").html(selAutoTrabajador);
      $("#inputAutoTrabajador").attr("onkeyup","verAutoCompletarTrabAcInseguro()");
   }
}

function verNombreCompletoSelSubTipo() {
    var id = parseInt($("#selSubTipoContactoColaborador").val());

    listSubTipoContactoColaborador.forEach(function (val) {
        if (val.id == id) {
            $("#auxSubTipo").html("Nombre Completo: " + val.nombreAux);
        }
    });
}

function verNombreCompletoCausaInmediata() {
    var id = parseInt($("#selCausaInmediataColaborador").val());
    var nombre = " No se encontró";

    listCausaInmediataColaborador.forEach(function (val) {
        if (val.id == id) {
            nombre = val.nombre;
        }
    });

    $("#auxCausaInme").html("Nombre Completo: " + nombre);
}

function verPlantillaImportActosColaborador(){
    window.open(URL+"/acinseguro/plantilla/colaborador?empresaId="+getSession("gestopcompanyid")+"&" +
        "unidadId="+getSession("unidadGosstId"),"_blank");
}

function verImportActosColaborador() {
    var listItemsForm = [
        {
            sugerencia: "",
            label: "<i class='fa fa-info'></i> Achivo Excel: ",
            inputForm: "",
            divContainer: "divExcelImport"
        },
        {
            sugerencia: " ",
            label: "",
            inputForm: "<button class='btn btn-success'  ><i class='fa fa-floppy-o'></i> Guardar</button>",
            divContainer: ""
        }
    ];
    var text = "";
    listItemsForm.forEach(function (val, index) {
        text += obtenerSubPanelModulo(val);
    });
    var contenido =
        "<form id='formImportEvento' class='eventoGeneral' >" +
        "<div id='tituloEvento'>" +
        text +
        "</div>" +
        "</div>" +
        "</form>";
    var listPaneles =
        {
            id: "divImportEventoColaborador",
            nombre: "Importar A/C subestándar supervisor",
            clase: "listaAuxiliar",
            contenido: contenido
        }
    ;
    agregarModalPrincipalColaborador(listPaneles, function () {
        var options =
            {
                container: "#divExcelImport",
                functionCall: function () {
                    enviarExcelImportActos()
                },
                descargaUrl: "",
                esNuevo: true,
                idAux: "ImportExcel",
                evidenciaNombre: ""
            };
        crearFormEvidenciaCompleta(options);
    });
    $("#formImportEvento").on("submit", function (e) {
        e.preventDefault();
        enviarExcelImportActos();
    });
}

function enviarExcelImportActos() {
    guardarEvidenciaAuto(0, "fileEviImportExcel", bitsEvidenciaActoInseguro,
        "/acinseguro/excel/masivo/save", function () {
            alert("Import completado!");
            $(".modal").modal("hide");
            habilitarReporteEventoUsuario();
        }, "id", [{id: "trabajadorId", value: getSession("trabajadorGosstId")},
            {id: "unidadId", value: getSession("unidadGosstId")},
            {id: "empresaId", value: getSession("gestopcompanyid")}]);
}

function guardarImportEventoColaborador() {
    var numColumnas = 12;

    var listExcel = obtenerListaImportGosst("#textImportActo", numColumnas);
    var validado = "";

    var listActosImport = [];
    listExcel.forEach(function (val, index) {
        var listCells = val.split("\t");
        if (listCells.length != numColumnas) {
            validado = "No coincide el numero de las celdas ->> " +
                "(" + listCells.length + "!=" + numColumnas + ")";

        } else {
            var acto = {};
            listCells.forEach(function (val1, index1) {
                val1 = val1.trim();
                switch (index1) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        try {
                            var fechaRegistro = new Date("20" + val1, listCells[1] - 1, listCells[0]);
                            acto.reporteFecha = fechaRegistro;
                            if (fechaRegistro == null) {
                                validado = "Error en el formato de fecha de registro.";
                            }
                            break;
                        } catch (err) {
                            validado = "Error en el formato de fecha de registro.";
                            break;
                        }
                    case 3:
                        acto.areaId = 0;
                        listAreaActoColaborador.forEach(function (val2) {
                            if (val2.areaNameShort.toUpperCase() == val1.toUpperCase()) {
                                acto.areaId = val2.areaId;
                            }
                        });
                        if (acto.areaId == 0) {
                            validado = "Area no reconocida: " + val1;
                        }
                        break;
                    case 4:
                        acto.acInseguroNombre = val1;
                        break;
                    case 5:
                        break;
                    case 6:
                        var riesgoId = 0;
                        listFullTipoContactoColaborador.forEach(function (val2) {
                            if (val2.nombre.toUpperCase().trim() == val1.toUpperCase().trim()) {
                                riesgoId = val2.id;
                            }
                        });
                        if (riesgoId == 0) {
                            validado = "Riesgo no reconocido: " + val1;
                        }
                        acto.tiposContacto = [{id: riesgoId}]
                        break;
                    case 7:
                        break;
                    case 8:
                        acto.acInseguroTipoId = 1;
                        if (val1.toUpperCase() == "X") {
                            acto.acInseguroTipoId = 1;
                        }
                        break;
                    case 9:
                        if (val1.toUpperCase() == "X") {
                            acto.acInseguroTipoId = 2;
                        }
                        break;
                    case 10:
                        if (val1.length > 0) {
                            acto.acInseguroNombre += " / Causa: " + val1;
                        }
                        break;
                    case 11:
                        acto.reporteAccion = val1;
                        break;

                }
            });
        }
        acto.acInseguroCausaId = 17;
        if (acto.acInseguroTipoId == 2) {
            acto.acInseguroCausaId = 34;
        }
        acto.nivelRiesgoId = 2;
        acto.reporteNombre = getSession("gestopusername");
        acto.trabajadorId = getSession("trabajadorGosstId");
        acto.matrixId = getSession("unidadGosstId");
        listActosImport.push(acto);
    });
    if (validado.length < 1) {
        //return;
        var r = confirm("¿Está seguro que desea subir estos "
            + listExcel.length + " elemento(s)?");
        if (r == true) {

            callAjaxPost(URL + '/acinseguro/colaborador/masivo/save', listActosImport,
                function (data) {
                    $(".modal").modal("hide");
                    alert("Importación guardada");
                    habilitarReporteEventoUsuario();
                });
        }
    } else {
        alert(validado);
    }
}

function guardarActoCompletoTrabajador() {
    var campoVacio = true;

    var fecha = convertirFechaTexto($("#dateEventoColaborador").val());
    var hora = $("#timeEventoColaborador").val();

    var trabajadorReporta = (parseInt(getSession("gestopcompanyid")) != 336?
        parseInt(getSession("trabajadorGosstId")):parseInt($("#selAutoTrabajador").val()));

    var unidadId = parseInt($("#selUnidadEventInseg").val()), divisionId = parseInt($("#selDivisionEventInseg").val());
    var areaId = parseInt($("#selAreaColaborador").val());
    var descripcion = $("#inputDescActo").val().trim();
    var detalleCausa = $("#inputEspCausaActo").val();
    var subTipoContactoId = parseInt($("#selSubTipoContactoColaborador").val());
    var selActTipo = parseInt($("#selActoTipo").val());
    var causaId = parseInt($("#selCausaInmediataColaborador").val());
    // var origenActo=$("#selOrigenActo").val();
    var corrInmediata = $("#inputDescCorrInm").val();
    var lugar = $("#inputDescLugar").val();
    var evidenciaNombre = $("#inputEviEventoSub").val();
    var nivelId = $("#selNivelRiesgo option:selected").val();
    var existe = (evidenciaNombre.length == 0 ? 0 : 1);
    var trabajadorObservado = $("#inputTrabObsEventInseg").val();
    var trabajadorQueReporta = $("#inputTrabQueReportaEventInseg").val();
    var factorRiesgoId = parseInt($("#selFactorRiesgoEventInseg").val()),
        peligroAcId = parseInt($("#selPeligroAcEventInseg").val());

    if (fecha == null || hora == "" || unidadId == -1 || divisionId == -1 || areaId == -1 || descripcion.length == 0 || causaId == -1 ||
        subTipoContactoId == -1 || (parseInt(getSession("gestopcompanyid")) != 336 ? (corrInmediata.length == 0 && lugar.length == 0) : false) ||
        trabajadorReporta == -1) {
        campoVacio = false;
    }

    if (campoVacio) {
        var dataParam = {
            acInseguroId: 0,
            hora: hora,
            horaPlanificada: hora,
            reporteLugar: lugar,//subTipoContacto: {id: subTipoContactoId},
            tiposContacto: [{id: subTipoContactoId}],
            origen: {id: 3},
            detalleCausa: detalleCausa,
            tipoLugar: {id: (parseInt(getSession("areaGosstId")) == areaId ? 1 : 2)},
            areaId: areaId,
            nivelRiesgoId: (parseInt(getSession("gestopcompanyid")) != 336 ? nivelId : 2),
            acInseguroTipoId: selActTipo,
            acInseguroCausaId: causaId,
            acInseguroNombre: descripcion,
            reporteAccion: corrInmediata,
            reporteTipo: 1,
            reporteNombre: getSession("gestopusername"),
            reporteFecha: fecha,
            trabajadorId: trabajadorReporta,
            trabajadorRegistraId: getSession("trabajadorGosstId"),
            trabajadores: [],
            evidenciaNombre: evidenciaNombre,
            existeEvidencia: existe,
            matrixId: unidadId
        };

        dataParam.trabajadorObservado = (parseInt(getSession("gestopcompanyid")) != 336? trabajadorObservado:null);
        dataParam.trabajadorQueReporta = (parseInt(getSession("gestopcompanyid")) != 336? trabajadorQueReporta:null);

        if (parseInt(getSession("gestopcompanyid")) == 714) {
            dataParam.factorRiesgo = {id: factorRiesgoId};
            dataParam.peligroAc = {id: peligroAcId};
        }

        callAjaxPost(URL + '/acinseguro/save/version_dos', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    guardarEvidenciaAuto(data.idNuevo, "fileEviEventoSub", bitsEvidenciaActoInseguro,
                        "/acinseguro/evidencia/save", function () {
                            mensajeUx = "<label>El reporte A/C Subestándar se registró correctamente*." +
                                "<br><br>*Se envío el correo respectivo a los responsables del área.</label>";
                            mensajesUx(mensajeUx, 1, "", "ActualizarAcSubestVistaCol");

                            $("#modalMensajeUxActualizarAcSubestVistaCol").on("hidden.bs.modal", function () {
                                habilitarReporteEventoUsuario();
                            });
                        }, "acInseguroId");

                    break;

                default:
                    alert("Ocurrió un error al guardar la información.");
                    break;
            }
        });
    } else {
        mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>";
        mensajesUx(mensajeUx, 2, "");
        $("#dateEventoColaborador").focus();
    }
}


function volverVistaActos() {
    $("#modalFiltroConsolidadoActos").remove();
    $("#divActoResponsableTabla").remove();
    $(".divContainerGeneral").show();
    $(".divListPrincipal > div").show();
    $("#subListNoValidoActo").hide();
    $("#subImportActosColaborador").hide();

    if (parseInt($("#selVisualizacionOpcAcSubTrab").val()) == 2) {
        $("#subListNuevoActoCompleto").hide();
        $("#subListNuevoActoCompletoPersonal").hide();
    }

    $(".divTituloGeneral h4").html(tituloAnteriorColaborador);
}

var listFullActosConsolidado = [];

function verTablaConsolidadoActos() {
   $("#wrapperConsolidadoActosResponsable").remove();$(".divContainerGeneral").hide();

   var buttonVolver =
      "<button type='button' class='btn btn-success' style='margin-right:10px' " +
              "onclick='volverVistaActos()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";

   var buttonFiltro =
      "<button type='button' class='btn btn-info' style='margin-right:10px' " +
              "onclick='verFiltroConsolidadoActos()' title='Ver las opciones de filtro.'>" +
         "<i class='fa fa-filter fa-2x'></i>" +
      "</button>";

   var buttonExcel =
      "<button type='button' class='btn btn-excel' style='color:white;margin-right:10px' " +
              "onclick='verOpcionesConsolidadosAc()' title='Valores previos para seleccionar el excel relacionado a A/C Sub estándar a descargar.'>" +
         "<i class='fa fa-file-excel-o fa-2x'></i> <i class='fa fa-list'></i>" +
      "</button>";

    var buttonClipboard =
        "<button id='btnClipTablaConsAcCol' type='button' class='clipGosst btn btn-success' style='color:white;margin-right:10px' " +
                "onclick='obtenerTablaClipboardConsolidadoActosColaborador()' title='Copiar contenido de la tabla actual.'>" +
        "<i class='fa fa-clipboard fa-2x'></i>" +
        "</button>";

   $("body").append(
      "<div id='divActoResponsableTabla' style='padding-left:40px;'>" +
         "<form class='form-inline' id='formBtnGeneral'>" +
             buttonVolver+buttonFiltro+buttonExcel+buttonClipboard +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoActosResponsable'>" +
            "<table style='min-width:100%;' id='tblConsolidadoActo' class='table table-striped table-bordered table-hover table-fixed'>" +
               "<thead>" +
                  "<tr>" +
                     "<td class='tb-acc' style='width:180px'>Fecha reporte</td>" +
                     "<td class='tb-acc' style='width:180px'>Hora reporte</td>" +
                     "<td class='tb-acc' style='width:180px'>"+(getSession("gestopunidad") != null?getSession("gestopunidad"):"Unidad")+"</td>" +
                     "<td class='tb-acc' style='width:180px'>"+(getSession("gestopdivision") != null?getSession("gestopdivision"):"División")+"</td>" +
                     "<td class='tb-acc' style='width:180px'>"+(getSession("gestoparea") != null?getSession("gestoparea"):"Área")+"</td>" +
                     "<td class='tb-acc' style='width:180px'>Lugar</td>" +
                     "<td class='tb-acc' style='width:180px'>Trabajador reporta</td>" +
                     "<td class='tb-acc' style='width:180px'>¿Qué Operación se realizaba?</td>" +
                     "<td class='tb-acc' style='width:180px'>¿Qué Acción inmediata se hizo?</td>" +
                     "<td class='tb-acc' style='width:180px'>Riesgos Asociados</td>" +
                     "<td class='tb-acc' style='width:130px'>Tipo</td>" +
                     "<td class='tb-acc' style='width:180px'>Causa Inmediata</td>" +
                     "<td class='tb-acc' style='width:180px'>Nivel de riesgo</td>" +
                     "<td class='tb-acc' style='width:180px'>Fecha registro</td>" +
                     "<td class='tb-acc' style='width:220px'>Trabajador registra</td>" +
                     "<td class='tb-acc' style='width:190px'>Evidencia</td>" +
                     "<td class='tb-acc' style='width:150px'>Acciones de mejora</td>" +
                     "<td class='tb-acc' style='width:200px'>Estado del reporte</td>" +
                  "</tr>" +
               "</thead>" +
               "<tbody></tbody>" +
            "</table>" +
         "</div>" +
      "</div>");

   tituloAnteriorColaborador = $(".divTituloGeneral h4").text();
   $(".divTituloGeneral h4").html("Consolidado de actos");
   resizeDivWrapper("wrapperConsolidadoActosResponsable",190);

   crearFiltroConsolidadoActos(valoresFiltroAcSubestandarTrabConsolidado);
}

var listUnidadesFiltroConsolidado = [],listDivisionesFiltroConsolidado = [],listAreasFiltroConsolidado = [],listTipoContactoFiltroConsolidado = [],
   listCausaInmediataSimpleFiltroConsolidado = [],listActInsegTipoFiltroConsolidado = [],listEstadoEventInseguroFiltroConsolidado = [];
var listUnidadesIdFiltroConsolidado = [],listDivisionesIdFiltroConsolidado = [],listAreasIdFiltroConsolidado = [],listTipoContactoIdFiltroConsolidado = [],
   listCausaInmediataSimpleIdFiltroConsolidado = [],listActInsegTipoIdFiltroConsolidado = [],listEstadoEventInseguroIdFiltroConsolidado = [];

function verFiltroConsolidadoActos(){
   $("#modalFiltroConsolidadoActos").modal("show");
}

function ocultarFiltroConsolidadoActos(){
   $("#modalFiltroConsolidadoActos").modal("hide");
}

function crearFiltroConsolidadoActos(functionCallBack){

   var dataParam={
      companyId:parseInt(getSession("gestopcompanyid")),trabajadorId:parseInt(getSession("trabajadorGosstId"))
   };

   callAjaxPost(URL+'/acinseguro/movil/consolidado/filtro',dataParam,function(data){
      listUnidadesFiltroConsolidado = data.listUnidadesFiltroConsolidado;listDivisionesFiltroConsolidado = data.listDivisionesFiltroConsolidado;
      listAreasFiltroConsolidado = data.listAreasFiltroConsolidado;listTipoContactoFiltroConsolidado = data.listTipoContactoFiltroConsolidado;
      listCausaInmediataSimpleFiltroConsolidado = data.listCausaInmediataSimpleFiltroConsolidado;
      listActInsegTipoFiltroConsolidado = data.listActInsegTipoFiltroConsolidado;listEstadoEventInseguroFiltroConsolidado = data.listEstadoEventInseguroFiltroConsolidado;
        
      var selVisualizacionOpcAcSubTrabConsolidado = crearSelectOneMenuOblig("selVisualizacionOpcAcSubTrabConsolidado",
         "",listVisualizarOpcionesAc,(numAreasResponsable == 0?1:0),"id","nombre");

      var contenido = "";

      var listContenido=[
         {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
          label:"<span style='font-size:20px;font-weight:bolder;'>Fecha reporte</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Inicio intervalo",
          inputForm:"<input type='date' id='fechaInicioActoFiltroConsolidado' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fin intervalo",
          inputForm:"<input type='date' id='fechaFinActoFiltroConsolidado' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de consolidado",inputForm:selVisualizacionOpcAcSubTrabConsolidado},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
      ];

      if(parseInt(getSession("gestopcompanyid")) != 336){
         listContenido.push({sugerencia:"",label:"Estado del reporte",inputForm:"",divContainer:"divFiltroEstadoReporteAcConsolidado"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
      }
      
      listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestopunidad") != null?getSession("gestopunidad"):"Unidad"),inputForm:"",divContainer:"divFiltroUnidadConsolidado"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestopdivision") != null?getSession("gestopdivision"):"División"),inputForm:"",divContainer:"divFiltroDivisionConsolidado"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestoparea") != null?getSession("gestoparea"):"Área"),inputForm:"",divContainer:"divFiltroAreaConsolidado"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Riesgos asociados",inputForm:"",divContainer:"divFiltroSubTipoContactoConsolidado"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo",inputForm:"",divContainer:"divFiltroTipoAcConsolidado"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Causas inmediatas",inputForm:"",divContainer:"divFiltroCausaAcConsolidado"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroConsolidadoActos()' style='font-size:18px;'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
          inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='valoresFiltroAcSubestandarTrabConsolidado()'>" +
                        "<i class='fa fa-filter'></i> Aplicar filtro" +
                    "</button>"});

      listContenido.forEach(function (val) {
         contenido += obtenerSubPanelModuloVersionDos(val);
      });

      var modalOptionsAcFiltro={
         id:"modalFiltroConsolidadoActos",nombre:"<i class='fa fa-filter'></i> Filtro - Consolidado de actos",
         contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
      };

      crearModalPrincipalUsuario(modalOptionsAcFiltro,function(){
         if($("#selMulUnidadesFiltroConsolidado").length > 0){
 	    return;
 	 }
 						       
 	 crearSelectOneMenuObligMultipleCompleto("selMulUnidadesFiltroConsolidado","filtrarValoresDivisionesAcSubConsolidado()",
            listUnidadesFiltroConsolidado,"id","nombre","#divFiltroUnidadConsolidado","Todos");
 	 
	 crearSelectOneMenuObligMultipleCompleto("selMulEstadoActualFiltroConsolidado","",
	    listEstadoEventInseguroFiltroConsolidado,"id","nombre","#divFiltroEstadoReporteAcConsolidado","Todos");
	 
         crearSelectOneMenuObligMultipleCompleto("selMulSubTipoContactoActoFiltroConsolidado","",
            listTipoContactoFiltroConsolidado,"id","nombre","#divFiltroSubTipoContactoConsolidado","Todos");
         
         crearSelectOneMenuObligMultipleCompleto("selMulTipoActoFiltroConsolidado","",listActInsegTipoFiltroConsolidado,
            "id","nombre","#divFiltroTipoAcConsolidado","Todos");

         crearSelectOneMenuObligMultipleCompleto("selMulCausaActoFiltroConsolidado","",listCausaInmediataSimpleFiltroConsolidado,
            "id","nombre","#divFiltroCausaAcConsolidado","Todos");

         filtrarValoresDivisionesAcSubConsolidado(); 
      },true,true);

      var hoy = getSession("fechaHoyOrdenInversoTexto");
      
      $("#fechaInicioActoFiltroConsolidado").val(sumaFechaDias(-180,hoy));$("#fechaFinActoFiltroConsolidado").val(hoy);
        
      functionCallBack();
   });
}

function filtrarValoresDivisionesAcSubConsolidado(){
   var listMultiUnidades = $("#selMulUnidadesFiltroConsolidado").val();
   var listDivisionAux = []; 

   if(listMultiUnidades != null){
      listMultiUnidades.forEach(function(val,index){
	 listDivisionesFiltroConsolidado.forEach(function(val1,index){
	    if(parseInt(val) == val1.matrixId){
	       listDivisionAux.push(val1); 
	    }  
	 });
      });
 
      if(listDivisionAux.length > 0){
         crearSelectOneMenuObligMultipleCompleto("selMulDivisionesFiltroConsolidado","filtrarValoresAreasAcSubConsolidado()",
            listDivisionAux,"divisionId","nombreAuxiliar","#divFiltroDivisionConsolidado","Todos");
    
         filtrarValoresAreasAcSubConsolidado();
      }else{
         $("#divFiltroDivisionConsolidado").html("<label>*Sin divisiones registradas</label>");	
         $("#divFiltroAreaConsolidado").html("<label>*Debe seleccionar al menos una división.</label>");
      }
   }else{
      $("#divFiltroDivisionConsolidado").html("<label>*Debe seleccionar al menos una unidad.</label>");
      $("#divFiltroAreaConsolidado").html("<label>*Debe seleccionar al menos una división.</label>");
   }
}

function filtrarValoresAreasAcSubConsolidado(){
   var listMultiDivisiones = $("#selMulDivisionesFiltroConsolidado").val();
   var listAreaAux = []; 

   if(listMultiDivisiones != null){
      listMultiDivisiones.forEach(function(val,index){
	 listAreasFiltroConsolidado.forEach(function(val1,index){
	    if(parseInt(val) == val1.divisionId){
	       listAreaAux.push(val1); 
	    }  
	 });
      });
 
      if(listAreaAux.length > 0){
         crearSelectOneMenuObligMultipleCompleto("selMulAreasFiltroConsolidado","",listAreaAux,
            "areaId","nombreAuxiliar","#divFiltroAreaConsolidado","Todos");	
      }else{
	 $("#divFiltroAreaConsolidado").html("<label>*Sin áreas registradas</label>");
      }
   }else{
      $("#divFiltroAreaConsolidado").html("<label>*Debe seleccionar al menos una división.</label>");
   }
}

function valoresFiltroAcSubestandarTrabConsolidado(){
   ocultarFiltroConsolidadoActos();

   var listMultiUnidades = $("#selMulUnidadesFiltroConsolidado").val();
   listUnidadesIdFiltroConsolidado = [];
    
   if(listMultiUnidades != null){
      listMultiUnidades.forEach(function(val,index){
	 listUnidadesIdFiltroConsolidado.push(parseInt(val));
      });
   }
    
   var listMultiDivisiones = $("#selMulDivisionesFiltroConsolidado").val();
   listDivisionesIdFiltroConsolidado = [];
    
   if(listMultiDivisiones != null){
      listMultiDivisiones.forEach(function(val,index){
	 listDivisionesIdFiltroConsolidado.push(parseInt(val));
      });
   }
    
   var listMultiAreas = $("#selMulAreasFiltroConsolidado").val();
   listAreasIdFiltroConsolidado = [];
    
   if(listMultiAreas != null){
      listMultiAreas.forEach(function(val,index){
	 listAreasIdFiltroConsolidado.push(parseInt(val));
      });
   }
   
   var listMulEstadosActual = $("#selMulEstadoActualFiltroConsolidado").val();
   listEstadoEventInseguroIdFiltroConsolidado = [];
   
   if(listMulEstadosActual != null){
      listMulEstadosActual.forEach(function(val,index){
	 listEstadoEventInseguroIdFiltroConsolidado.push(parseInt(val));
      });
   }
   
   var listMulSubTipoContactoActo = $("#selMulSubTipoContactoActoFiltroConsolidado").val();
   listTipoContactoIdFiltroConsolidado = [];
   
   if(listMulSubTipoContactoActo != null){
      listMulSubTipoContactoActo.forEach(function(val){
	 listTipoContactoIdFiltroConsolidado.push(parseInt(val));
      });
   }

   var listMulTipoActo = $("#selMulTipoActoFiltroConsolidado").val();
   listActInsegTipoIdFiltroConsolidado = [];
   
   if(listMulTipoActo != null){
      listMulTipoActo.forEach(function(val){
         listActInsegTipoIdFiltroConsolidado.push(parseInt(val));
      });
   }

   var listMulCausaActo = $("#selMulCausaActoFiltroConsolidado").val();
   listCausaInmediataSimpleIdFiltroConsolidado = [];
   
   if(listMulCausaActo != null){
      listMulCausaActo.forEach(function(val){
         listCausaInmediataSimpleIdFiltroConsolidado.push(parseInt(val));
      });
   }
   
   cargarConsolidadoActosColaborador(); 
}

function cargarConsolidadoActosColaborador(){
   var idOpcion = parseInt($("#selVisualizacionOpcAcSubTrabConsolidado").val());
   
   var dataParam2={
      companyId:parseInt(getSession("gestopcompanyid")),isTrabajador:(idOpcion != 0?idOpcion:null),isConsolidado:1,
      fechaInicioFiltro:$("#fechaInicioActoFiltroConsolidado").val(),fechaFinFiltro:$("#fechaFinActoFiltroConsolidado").val(),
      listUnidadesId:(listUnidadesIdFiltroConsolidado.length == 0?null:listUnidadesIdFiltroConsolidado),
      listDivisionesId:(listUnidadesIdFiltroConsolidado.length == 0 || listDivisionesIdFiltroConsolidado.length == 0?null:listDivisionesIdFiltroConsolidado),
      listAreasId:(listDivisionesIdFiltroConsolidado.length == 0 || listAreasIdFiltroConsolidado.length == 0?null:listAreasIdFiltroConsolidado),
      listTipoContactoId:(listTipoContactoIdFiltroConsolidado.length == 0?null:listTipoContactoIdFiltroConsolidado),
      listTipoActoId:(listActInsegTipoIdFiltroConsolidado.length == 0?null:listActInsegTipoIdFiltroConsolidado),
      listCausaId:(listCausaInmediataSimpleIdFiltroConsolidado.length == 0?null:listCausaInmediataSimpleIdFiltroConsolidado),
   };

   if(parseInt(getSession("gestopcompanyid")) != 336){
      dataParam2.listEstadoReporteACId = (listEstadoEventInseguroIdFiltroConsolidado.length == 0?null:listEstadoEventInseguroIdFiltroConsolidado);
   }
    
   if(idOpcion != 2){
      dataParam2.matrixId = parseInt(getSession("unidadGosstId"));dataParam2.cargarIndicadorTrab = 0;
      dataParam2.trabajadorId = parseInt(getSession("trabajadorGosstId"));
   }
   
   callAjaxPost(URL+(idOpcion != 2?'/acinseguro/movil/vista_colaborador':'/acinseguro/movil/empresa'),dataParam2,function(data){
      listFullActosConsolidado = data.actos;
        
      $("#tblConsolidadoActo tbody tr").remove();

      listFullActosConsolidado.forEach(function(val){
         var textDescarga = (val.evidenciaNombre.length == 0?"------":
            "<a class='efectoLink' target='_blank' href='"+URL+"/acinseguro/evidencia?acInseguroId="+val.acInseguroId+"'>" +
               "<i class='fa fa-download'></i> "+val.evidenciaNombre +
            "</a>");
         
         var textAccionesMejora = (val.numAccionesColaboradorTotal == 0?"------":
            "<a class='efectoLink' onclick='verAccionesConsolidadoActo("+val.acInseguroId+")'>" +
               "<i class='fa fa-list'></i> "+val.numAccionesColaboradorCompletadas+" / "+val.numAccionesColaboradorTotal +
            "</a>");

         var colorEstadoReporteAc = (val.estadoEventInseguro.id == 1?colorPuntajeGosst(0.0):(val.estadoEventInseguro.id == 2?colorPuntajeGosst(0.5): 
            (val.estadoEventInseguro.id == 3?colorPuntajeGosst(1.0):(val.estadoEventInseguro.id == 4?colorPuntajeGosst(1.0):colorPuntajeGosst(0.5)))));

         var nivelRiesgo = (val.nivelRiesgoNombre.length == 0?"------":val.nivelRiesgoNombre);

         $("#tblConsolidadoActo tbody").append(
            "<tr>" +
               "<td>"+val.reporteFechaTexto+"</td>" +
               "<td>"+val.horaTexto+"</td>" +
               "<td>"+val.matrixName+"</td>" +
               "<td>"+val.divisionNombre+"</td>" +
               "<td>"+val.areaNombre+"</td>" +
               "<td>"+val.reporteLugar+"</td>" +
               "<td>"+val.reporteNombre+"</td>" +
               "<td>"+val.acInseguroNombre+"</td>" +
               "<td>"+val.reporteAccion+"</td>" +
               "<td>"+val.subTipoContacto.nombre+"</td>" +
               "<td>"+val.acInseguroTipoNombre+"</td>" +
               "<td>"+val.acInseguroCausaNombre+"</td>" +
               "<td>"+nivelRiesgo+"</td>" +
               "<td>"+val.fechaRegistroTexto+"</td>" +
               "<td>"+val.trabajadorRegistraNombre+"</td>" +
               "<td style='word-break:break-all;'>"+textDescarga+"</td>" +
               "<td>"+textAccionesMejora+"</td>" +
               "<td>"+"<span style='color:"+colorEstadoReporteAc+";font-weight:bold;'>"+val.estadoEventInseguro.nombre+"</span>"+"</td>" +
            "</tr>");
      });

      goheadfixedY("#tblConsolidadoActo","#wrapperConsolidadoActosResponsable");
   });
}

function obtenerTablaClipboardConsolidadoActosColaborador(){
    var texto = obtenerDatosTablaEstandar("tblConsolidadoActo");
    copiarAlPortapapeles(texto,"btnClipTablaConsAcCol");

    mensajeUx="<label>Los registros del consolidado se copiaron en el clipboard.</label>";
    mensajesUx(mensajeUx,1,"","");
}

function verAccionesConsolidadoActo(actoId) {
    var contenido =
        "<div class='wrapper' id='wrapperConsolidadoAccionesResponsable'>" +
        "<table style='min-width:100%' id='tblConsolidadoAcciones' " +
        "class='table table-striped table-bordered table-hover table-fixed'>" +
        "<thead>" +
        "<tr>" +
        "<td class='tb-acc' style='width:180px'>Clasificación</td>" +
        "<td class='tb-acc' style='width:180px'>Descripción</td>" +
        "<td class='tb-acc' style='width:180px'>Fecha de registro</td>" +
        "<td class='tb-acc' style='width:180px'>Responsable</td>" +
        "<td class='tb-acc' style='width:180px'>Evidencia</td>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>" +
        "</table>" +
        "</div>";

    var listPaneles =
        {
            id: "asd", nombre: "Acciones de mejora del acto/condición",
            clase: "", contenido: contenido
        };

    agregarModalPrincipalColaborador(listPaneles, function () {
    });

    $("#asd .modal-dialog").css({"width": "90%", "max-width": "100%"});

    var dataParam3 = {
        accionMejoraTipoId: 2,
        eventoInseguroId: actoId
    }

    callAjaxPost(URL + "/gestionaccionmejora/accionmejora", dataParam3, function (data) {
        var asd = data.list;

        asd.forEach(function (val) {
            $("#tblConsolidadoAcciones tbody").append(
                "<tr>" +
                "<td>" + val.clasificacion.nombre + "</td>" +
                "<td>" + val.descripcion + "</td>" +
                "<td>" + (val.fechaRevision == null ? val.fechaRealTexto : val.fechaRevisionTexto) + "</td>" +
                "<td>" + val.responsableNombre + "</td>" +
                "<td>" + (val.estadoId != 2 ? iconoGosst.desaprobado + "" : iconoGosst.aprobado + "") +
                "<a target='_blank' class='efectoLink' " +
                "href='" + URL + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" +
                val.accionMejoraId + "'>" + val.evidenciaNombre + "</a>" + "</td>"
            );
        });
    });
}

//Ver Estadísticas
function verIndicadoresConsolidadoActos() {
    $("#wrapperConsolidadoActosResponsable").remove();
    $(".divContainerGeneral").hide();

    var buttonVolver = "<button type='button' id='btnVolverDetalle' class='btn btn-success ' style='margin-right:10px'" +
        " onclick='volverVistaActos()'>" +
        "<i class='fa fa-sign-out fa-rotate-180'></i>Volver" +
        "</button>";

    var buttonFiltro = "<button type='button' class='btn btn-info' id='btnIniciarFiltro' style='margin-right:10px'" +
        " onclick='verFiltroConsolidadoActos()'>" +
        "<i class='fa fa-filter'></i>Ver filtros" +
        "</button>";

    var textoDivision = "", textoArea = "";

    if (numAreasSupervisor > 0) {
        textoDivision = "Solo puede ver " + getSession("gestopdivision") + " de " + getSession("gestoparea") + " supervisadas";
        textoArea = "Solo puede ver " + getSession("gestoparea") + " supervisadas";
    }

    if (numAreasJefe > 0 || numAreasGerente > 0) {
        textoDivision = "Puede ver todo " + getSession("gestopdivision") + " de su " + getSession("gestopunidad");
        textoArea = "";
    }

    var listOption = [
        {id: 4, nombre: "Área vs meses"},
        {id: 1, nombre: "Área vs Causa Inmediata"},
        {id: 2, nombre: "Área vs Riesgo asociado", selected: 1},
        {id: 8, nombre: "Área vs Estado del hallazgo"},
        {id: 5, nombre: "Reportes emitidos por cada área"},
        {id: 6, nombre: "Colaboradores que emiten reportes"},
        {id: 7, nombre: "Reportes por áreas en donde se registró el evento"}
        //{id : 3,nombre :"Área vs Tipo"},
    ]

    var selTipoIndicadorActos = crearSelectOneMenuOblig("selTipoIndicadorActos", "verAcordeTipoIndicadorActos();",
        listOption, "6", "id", "nombre", "Seleccionar");

    $("body")
        .append(
            "<div id='divActoResponsableTabla' style='padding-left: 40px;'>" +
            "<form class='form-inline' id='formBtnGeneral'>" +
            buttonVolver +
            "<label id='labelIndicadorActosResponsable'>" +
            "Tipo de indicador" +
            "</label>" +
            selTipoIndicadorActos + buttonFiltro +
            "</form>" +
            "<small>Para visualizar diferentes indicadores, modificar el filtro</small>" +

            "<div class='wrapper' id='wrapperGraficoActosResponsable'></div>" +
            "<div class='wrapper' id='wrapperConsolidadoActosResponsable'>" +
            "<table style='min-width:100%' id='tblConsolidadoActo' " +
            "class='table table-striped table-bordered table-hover table-fixed'>" +
            "<thead>" +
            "<tr>" +
            "</tr>" +
            "</thead>" +
            "<tbody></tbody>" +
            "</table>" +
            "</div>" +
            "</div>");

    tituloAnteriorColaborador = $(".divTituloGeneral h4").text();
    $(".divTituloGeneral h4").html("Indicadores de Actos/Condiciones");

    resizeDivWrapper("wrapperGraficoActosResponsable", 300);

    // verAcordeTipoIndicadorActos();
    // crearFiltroConsolidadoActos(verAcordeTipoIndicadorActos,0);
}

var noDefinidoFiltro = [{id: 0, nombreAux: "No definido"}];

function verAcordeTipoIndicadorActos() {
    var tipoIndicador = parseInt($("#selTipoIndicadorActos").val());
    $("#filtroDetalleIndicadorActosResponsable").show();
    $(".camposFiltroTabla").show();
    switch (tipoIndicador) {
        case 1:
            $("#filtroDetalleIndicadorActosResponsable label").html("Causas Inmediatas")
            crearSelectOneMenuObligMultipleCompleto
            ("selCausaActoFiltro", "", listCausaInmediataColaborador, "id", "nombre",
                "#divSelectDetalleFiltroActosResponsable", "Todos");
            break;
        case 2:
            $("#filtroDetalleIndicadorActosResponsable label").html("Riesgos Asociados");

            crearSelectOneMenuObligMultipleCompleto
            ("selSubTipoContactoActoFiltro", "", noDefinidoFiltro.concat(listSubTipoContactoColaborador), "id", "nombreAux",
                "#divSelectDetalleFiltroActosResponsable", "Todos");
            break;
        case 3:
            $("#filtroDetalleIndicadorActosResponsable label").html("Tipo")
            crearSelectOneMenuObligMultipleCompleto
            ("selTipoActoFiltro", "", listActoTipo, "id", "nombre",
                "#divSelectDetalleFiltroActosResponsable", "Todos");
            break;
        case 4:
        case 5:
        case 6:
        case 7:
            $("#filtroDetalleIndicadorActosResponsable").hide();
            break;
    }
    $(".camposFiltroTabla").hide();
    cargarIndicadoresActosColaborador();
}

function volverVistaIndicadorActos() {
    $(".camposFiltroTabla").hide();
    $("#wrapperConsolidadoActosResponsable").show();
    $("#wrapperGraficoActosResponsable").show();

    $("#labelIndicadorActosResponsable").show();
    $("#selTipoIndicadorActos").show();

    $("#btnIniciarFiltro").show();
    $("#btnAplicarFiltro").hide();
    $("#buttonVolverFiltro").hide();
    $("#btnVolverDetalle").show();
}

function aplicarFiltroActoIndicadorResponsable() {
    volverVistaIndicadorActos();
    cargarIndicadoresActosColaborador();
}

var listCausaIdGlobal = [];
var listAreaIdGlobal = [];
var listSubTiposContactoIdGlobal = [];
var listTipoActoIdGlobal = [];
var listDivisionIdGlobal = [];
var listEstadoReporteACIdGlobal = [];
var listResponsablesActoColaborador = [];

function hallarFechasPeriodoActo() {
    var hoy = obtenerFechaActual();

    var fechaInicio = sumaFechaDias(-180, hoy);
    var fechaFin = hoy;
    var fecha1 = fechaInicio.split('-');
    var fecha2 = fechaFin.split('-');
    var difanio = fecha2[0] - fecha1[0] + 1;
    var difDias = restaFechas(fechaInicio, fechaFin);
    var listfecha = [];

    for (index = 0; index < difanio; index++) {
        var anioaux = parseInt(index) + parseInt(fecha1[0]);

        if (difanio > 1) {
            if (index == 0) {
                for (index1 = 0; index1 < 12 - fecha1[1] + 1; index1++) {
                    var mesaux = parseInt(index1) + parseInt(fecha1[1]);

                    listfecha.push({
                        mes: mesaux,
                        anio: anioaux,
                        nombre: anioaux + "-" + (('' + mesaux).length < 2 ? '0' : '') + mesaux
                    });
                }
            }

            if (index == difanio - 1) {
                for (index4 = 0; index4 < parseInt(fecha2[1]); index4++) {
                    var mesaux3 = parseInt(index4) + parseInt("1");
                    listfecha.push({
                        mes: mesaux3,
                        anio: anioaux,
                        nombre: anioaux + "-" + (('' + mesaux3).length < 2 ? '0' : '') + mesaux3
                    });
                }
            }

            if (index > 0 && index < difanio - 1) {
                for (index3 = 0; index3 < 12; index3++) {
                    var mesaux2 = parseInt(index3) + 1;
                    listfecha.push({
                        mes: mesaux2,
                        anio: anioaux,
                        nombre: anioaux + "-" + (('' + mesaux2).length < 2 ? '0' : '') + mesaux2
                    });
                }
            }
        } else {
            for (index5 = 0; index5 < fecha2[1] - fecha1[1] + 1; index5++) {
                var mesaux4 = parseInt(index5) + parseInt(fecha1[1]);
                listfecha.push({
                    mes: mesaux4,
                    anio: anioaux,
                    nombre: anioaux + "-" + (('' + mesaux4).length < 2 ? '0' : '') + mesaux4
                });
            }
        }
    }
    return listfecha;
}

function cargarIndicadoresActosColaborador() {
    ocultarFiltroConsolidadoActos();

    var listDivision = $("#selMulDivisionesFiltroConsolidado").val();
    var listArea = $("#selMulAreasFiltroConsolidado").val();
    var listCausasInmediatas = $("#selMulCausaActoFiltroConsolidado").val();
    var listSubTiposContacto = $("#selMulSubTipoContactoActoFiltroConsolidado").val();
    var listTipoActo = $("#selMulTipoActoFiltroConsolidado").val();
    var listEstadoReporteAC = $("#selEstadoReporteACFiltro").val();

    listCausaIdGlobal = [];
    listAreaIdGlobal = [];
    listSubTiposContactoIdGlobal = [];
    listTipoActoIdGlobal = [];
    listDivisionIdGlobal = [];
    listEstadoReporteACIdGlobal = [];

    if (listCausasInmediatas != null) {
        listCausasInmediatas.forEach(function (val) {
            listCausaIdGlobal.push(parseInt(val));
        });
    }

    if (listArea != null) {
        listArea.forEach(function (val) {
            listAreaIdGlobal.push(parseInt(val));
        });
    }

    if (listDivision != null) {
        listDivision.forEach(function (val) {
            listDivisionIdGlobal.push(parseInt(val));
        });
    }

    if (listSubTiposContacto != null) {
        listSubTiposContacto.forEach(function (val) {
            listSubTiposContactoIdGlobal.push(parseInt(val));
        });
    }

    if (listTipoActo != null) {
        listTipoActo.forEach(function (val) {
            listTipoActoIdGlobal.push(parseInt(val));
        });
    }

    if (listEstadoReporteAC != null) {
        listEstadoReporteAC.forEach(function (val) {
            listEstadoReporteACIdGlobal.push(parseInt(val));
        });
    }

    var fechaInicioFiltro = convertirFechaTexto($("#fechaInicioActoFiltroConsolidado").val());
    var fechaFinFiltro = convertirFechaTexto($("#fechaFinActoFiltroConsolidado").val());

    (listCausaIdGlobal.length == 0 ? listCausaIdGlobal = null : "");
    (listAreaIdGlobal.length == 0 ? listAreaIdGlobal = null : "");
    (listDivisionIdGlobal.length == 0 ? listDivisionIdGlobal = null : "");
    (listSubTiposContactoIdGlobal.length == 0 ? listSubTiposContactoIdGlobal = null : "");
    (listTipoActoIdGlobal.length == 0 ? listTipoActoIdGlobal = null : "");
    (listEstadoReporteACIdGlobal.length == 0 ? listEstadoReporteACIdGlobal = null : "");

    var isTrabajadorConsolidado = parseInt($("#selVisualizacionOpcAcSubTrabConsolidado").val());

    if (isTrabajadorConsolidado != 2) {
        var dataParam2 = {
            matrixId: getSession("unidadGosstId"),
            companyId: getSession("gestopcompanyid"),
            trabajadorId: getSession("trabajadorGosstId"),
            listCausaId: listCausaIdGlobal,
            listAreasId: listAreaIdGlobal,
            listDivisionesId: listDivisionIdGlobal,
            listTipoContactoId: listSubTiposContactoIdGlobal,
            listTipoActoId: listTipoActoIdGlobal,
            listEstadoReporteACId: listEstadoReporteACIdGlobal,
            fechaInicioFiltro: fechaInicioFiltro,
            fechaFinFiltro: fechaFinFiltro,
            isTrabajador: (isTrabajadorConsolidado == 0 ? null : 1),
            isConsolidado: 1, cargarIndicadorTrab: 1
        }
    } else {
        var dataParam2 = {
            companyId: getSession("gestopcompanyid"),
            listCausaId: listCausaIdGlobal,
            listAreasId: listAreaIdGlobal,
            listDivisionesId: listDivisionIdGlobal,
            listTipoContactoId: listSubTiposContactoIdGlobal,
            listTipoActoId: listTipoActoIdGlobal,
            listEstadoReporteACId: listEstadoReporteACIdGlobal,
            fechaInicioFiltro: fechaInicioFiltro,
            fechaFinFiltro: fechaFinFiltro,
            isTrabajador: 2,
            isConsolidado: 1
        }
    }

    callAjaxPost(URL + (isTrabajadorConsolidado != 2 ? '/acinseguro/movil/vista_colaborador' : '/acinseguro/movil/empresa'), dataParam2, function (data) {
        var tipoIndicador = parseInt($("#selTipoIndicadorActos").val());
        listFullActosConsolidado = data.actos;
        listResponsablesActoColaborador = data.trabajadoresAreas;

        $("#tblConsolidadoActo tbody tr").remove();
        $("#tblConsolidadoActo thead tr td").remove();

        var listTipoActo = listActoTipo.filter(function (val) {
            if (listTipoActoIdGlobal == null) {
                return true;
            }

            return listTipoActoIdGlobal.indexOf(val.id) > -1;
        });

        var listSubTiposContacto = noDefinidoFiltro.concat(listSubTipoContactoColaborador).filter(function (val) {
            if (listSubTiposContactoIdGlobal == null) {
                return true;
            }

            return listSubTiposContactoIdGlobal.indexOf(val.id) > -1;
        });

        var listCausaIndicador = listCausaInmediataColaborador.filter(function (val) {
            if (listCausaIdGlobal == null) {
                return true;
            }

            return listCausaIdGlobal.indexOf(val.id) > -1;
        });

        var listEstadoReporteACIndicador = listEstadoReporteACValores.filter(function (val) {
            if (listEstadoReporteACIdGlobal == null) {
                return true;
            }

            return listEstadoReporteACIdGlobal.indexOf(val.id) > -1;
        });

        var listAreaIndicador = listAreaActoColaborador.filter(function (val) {
            if (listAreaIdGlobal == null) {
                if (listDivisionIdGlobal == null) {
                    return true;
                }

                return listDivisionIdGlobal.indexOf(val.divisionId) > -1
            }

            return listAreaIdGlobal.indexOf(val.areaId) > -1;
        });

        var listFechas = hallarFechasPeriodoActo();

        switch (tipoIndicador) {
            case 5:
                listAreaIndicador.forEach(function (val) {
                    val.numActos = 0;
                    listFullActosConsolidado.forEach(function (val2) {
                        if (val2.trabajadorAreaId == val.areaId) {
                            val.numActos++;
                        }
                    });
                });

                listAreaIndicador.sort(function (a, b) {
                    return -a.numActos + b.numActos;
                });

                $("#tblConsolidadoActo tbody").html("<tr><td><strong>Total</strong></td></tr>");
                $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'><strong>Área</strong></td>");

                listAreaIndicador.forEach(function (val) {
                    $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 180px'>" + val.areaName + "</td>");
                    $("#tblConsolidadoActo tbody tr").append("<td>" + val.numActos + "</td>");
                });
                break;

            case 6:
                listResponsablesActoColaborador.forEach(function (val) {
                    val.numActos = 0;
                    listFullActosConsolidado.forEach(function (val2) {
                        if (val2.trabajadorId == val.trabajadorId) {
                            val.numActos++;
                        }
                    });
                });
                listResponsablesActoColaborador.sort(function (a, b) {
                    return -a.numActos + b.numActos;
                });
                $("#tblConsolidadoActo tbody").html("<tr><td><strong>Total</strong></td></tr>");
                $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'><strong>Trabajador reporta</strong></td>");
                listResponsablesActoColaborador.forEach(function (val) {
                    $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 180px'>" + val.nombre + "</td>");
                    $("#tblConsolidadoActo tbody tr").append("<td>" + val.numActos + "</td>");

                });
                break;
            case 7:

                listAreaIndicador.forEach(function (val) {
                    val.numActos = 0;
                    listFullActosConsolidado.forEach(function (val2) {
                        if (val2.areaId == val.areaId) {
                            val.numActos++;
                        }
                    });
                });
                listAreaIndicador.sort(function (a, b) {
                    return -a.numActos + b.numActos;
                });
                $("#tblConsolidadoActo tbody").html("<tr><td><strong>Total</strong></td></tr>");
                $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'><strong>Área</strong></td>");
                listAreaIndicador.forEach(function (val) {
                    $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 180px'>" + val.areaName + "</td>");
                    $("#tblConsolidadoActo tbody tr").append("<td>" + val.numActos + "</td>");

                });
                break;

            case 4:
                break;
            case 1:
                //Encabezados Área / Causa
                $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>" + "Área / Causa" + "</td>");
                listCausaIndicador.forEach(function (val) {
                    $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>" + val.nombre + "</td>");
                });
                break;

            case 8:
                $("#tblConsolidadoActo thead tr")
                    .append("<td class='tb-acc' style='width: 160px'>" +
                        "Área / Estado del hallazgo" +
                        "</td>");

                listEstadoReporteACIndicador.forEach(function (val) {
                    $("#tblConsolidadoActo thead tr")
                        .append("<td class='tb-acc' style='width: 160px'>" + val.nombre + "</td>");
                });
                break;

            case 2:

                break;
            case 3:
                $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>" + "Área / Tipo" + "</td>");
                listTipoActo.forEach(function (val) {
                    $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>" + val.nombre + "</td>");
                });
                break;
        }

        if (tipoIndicador == 4) {
            $("#tblConsolidadoActo tbody")
                .append("<tr id='trtotal'><td>Total</td></tr>" +
                    "<tr id='trindicador1'><td>Porcentaje</td></tr>" +
                    "<tr id='trindicadorAcum' style='    border-bottom: 2px solid black;'><td>Porcentaje acumulado</td></tr>" +
                    "");
            var indicadorAcum = 0;
            listFechas.forEach(function (val) {
                val.numActosOrden = 0;

                listFullActosConsolidado.forEach(function (val2) {
                    if (val2.fechaAnio == val.anio && val2.fechaMes == val.mes) {
                        val.numActosOrden++;
                    }

                });
            });
            listFechas.forEach(function (val) {
                val.indicadorTest = val.numActosOrden + "/" + listFullActosConsolidado.length;
                val.indicador = val.numActosOrden / listFullActosConsolidado.length;
                indicadorAcum += val.indicador;
                val.indicadorAcumulado = indicadorAcum;
                $("#trindicadorAcum").append("<td>" + pasarDecimalPorcentaje(val.indicadorAcumulado, 2) + "</td>")
                $("#trindicador1").append("<td>" + pasarDecimalPorcentaje(val.indicador, 2) + "</td>")
                $("#trtotal").append("<td>" + val.numActosOrden + "</td>")
            });

            $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>" + "Área / Meses" + "</td>");
            listFechas.forEach(function (val) {
                $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>" + val.nombre + "</td>");
            });

        }
        if (tipoIndicador == 2) {
            $("#tblConsolidadoActo tbody")
                .append("<tr id='trtotal' style='border-top: 2px solid black;'><td>Total</td></tr>" +
                    "<tr id='trindicador1'><td>Porcentaje</td></tr>" +
                    "<tr id='trindicadorAcum' ><td>Porcentaje acumulado</td></tr>" +
                    "");
            var indicadorAcum = 0;
            listSubTiposContacto.forEach(function (val) {
                val.numActosOrden = 0;

                listFullActosConsolidado.forEach(function (val2) {
                    var pertenece = false;
                    var lista1 = val2.idTiposContacto;
                    var listaTipoContacto = lista1.split(",");

                    listaTipoContacto.forEach(function (val3) {
                        if (val.id == val3) {
                            pertenece = true;
                        }
                    });
                    if (pertenece) {
                        val.numActosOrden++;
                    }

                });
            });
            listSubTiposContacto.sort(function (a, b) {
                return -a.numActosOrden + b.numActosOrden;
            });
            $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>" + "Área / Riesgo Asociado" + "</td>");
            listSubTiposContacto.forEach(function (val) {
                $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>" + val.nombreAux + "</td>");
            });
            $("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>" + "Total" + "</td>");
            var numActosOrdenTotal = 0;
            listSubTiposContacto.forEach(function (val) {
                val.indicadorTest = val.numActosOrden + "/" + listFullActosConsolidado.length;
                val.indicador = val.numActosOrden / listFullActosConsolidado.length;
                indicadorAcum += val.indicador;
                val.indicadorAcumulado = indicadorAcum;

                numActosOrdenTotal += val.numActosOrden;
                $("#trindicadorAcum").append("<td>" + pasarDecimalPorcentaje(val.indicadorAcumulado, 2) + "</td>")
                $("#trindicador1").append("<td>" + pasarDecimalPorcentaje(val.indicador, 2) + "</td>")
                $("#trtotal").append("<td>" + val.numActosOrden + "</td>");
            });
            $("#trindicadorAcum").append("<td>" + "100%" + "</td>")
            $("#trindicador1").append("<td>" + "100%" + "</td>")
            $("#trtotal").append("<td>" + numActosOrdenTotal + "</td>");
        }
        listAreaIndicador.forEach(function (val) {
            val.causas = [];
            listCausaIndicador.forEach(function (val1) {
                val.causas.push({id: val1.id, nombre: val1.nombre})
            });

            val.estados = [];
            listEstadoReporteACIndicador.forEach(function (val1) {
                val.estados.push({id: val1.id, nombre: val1.nombre})
            });

            val.subtiposcontacto = [];
            listSubTiposContacto.forEach(function (val1) {
                val.subtiposcontacto.push({id: val1.id, nombre: val1.nombre})
            });
            val.fechas = [];
            listFechas.forEach(function (val1) {
                val.fechas.push({anio: val1.anio, mes: val1.mes, nombre: val1.nombre})
            })
            val.tipos = listTipoActo;
            switch (tipoIndicador) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 8:
                    $("#tblConsolidadoActo tbody").prepend("<tr id='trfilar" + val.areaId + "'><td>" + val.areaName + "</td></tr>");
                    break;
            }


            switch (tipoIndicador) {
                case 1:
                    val.causas.forEach(function (val1) {
                        val1.numActos = 0;
                        listFullActosConsolidado.forEach(function (val2) {
                            if (val2.areaId == val.areaId && val2.acInseguroCausaId == val1.id) {
                                val1.numActos++;
                            }
                        });
                        $("#trfilar" + val.areaId).append("<td>" +
                            //"<a onclick='verDetalleActoAreaCausa("+val.areaId+","+val1.id+")' class='efectoLink'>"+
                            val1.numActos
                            //+"</a>"
                            + "</td>")
                    });
                    break;

                case 8:
                    val.estados.forEach(function (val1) {
                        val1.numActos = 0;

                        listFullActosConsolidado.forEach(function (val2) {
                            if (val2.areaId == val.areaId && val2.idEstadoReporteAC == val1.id) {
                                val1.numActos++;
                            }
                        });

                        $("#trfilar" + val.areaId)
                            .append("<td>" +
                                //"<a onclick='verDetalleActoAreaCausa("+val.areaId+","+val1.id+")' class='efectoLink'>"+
                                val1.numActos
                                //+"</a>"
                                + "</td>");
                    });
                    break;

                case 2:
                    var numActosTotal = 0;
                    val.subtiposcontacto.forEach(function (val1) {
                        val1.numActos = 0;
                        listFullActosConsolidado.forEach(function (val2) {
                            var pertenece = false;
                            var lista1 = val2.idTiposContacto;
                            var listaTipoContacto = lista1.split(",");

                            listaTipoContacto.forEach(function (val3) {
                                if (val1.id == val3) {
                                    pertenece = true;
                                }
                            });
                            if (pertenece && val2.areaId == val.areaId) {
                                val1.numActos++;
                            }

                        });
                        numActosTotal += val1.numActos;
                        $("#trfilar" + val.areaId).append("<td>" +
                            //"<a onclick='verDetalleActoSubTipoContactoArea("+val.id+","+val1.id+")' class='efectoLink'>"+
                            val1.numActos
                            //+"</a>"
                            + "</td>")
                    });
                    $("#trfilar" + val.areaId).append("<td>" +
                        numActosTotal
                        + "</td>")
                    break;
                case 4:
                    val.fechas.forEach(function (val1) {
                        val1.numActos = 0;
                        listFullActosConsolidado.forEach(function (val2) {
                            if (val2.areaId == val.areaId && val2.fechaAnio == val1.anio && val2.fechaMes == val1.mes) {
                                val1.numActos++;
                            }
                        });
                        $("#trfilar" + val.areaId).append("<td>" +
                            //"<a onclick='verDetalleActoTipoArea("+val.id+","+val1.id+")' class='efectoLink'>"+
                            val1.numActos
                            //+"</a>"
                            + "</td>")
                    });
                    break;

            }


        });


        switch (tipoIndicador) {
            case 5:
                var dataPrincipal = [];
                var listCategories = [];
                var listCantidad = [];
                listAreaIndicador.forEach(function (val) {
                    if (val.numActos != 0) {
                        listCategories.push(val.areaName);
                        listCantidad.push(val.numActos);
                        dataPrincipal.push(
                            {
                                "name": val.nombre,
                                "y": val.numActos
                            }
                        );
                    }
                });
                dataPrincipal.sort(function (a, b) {
                    return -a.y + b.y;
                });
                // Create the chart
                Highcharts.chart('wrapperGraficoActosResponsable', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'RANKING DE ÁREA QUE MÁS REPORTA'
                    },
                    xAxis: {
                        categories: listCategories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Reportes'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Total',
                        data: listCantidad

                    }]
                });
                break;
            case 6:
                var listCategories = [];
                var listCantidad = [];
                listResponsablesActoColaborador.forEach(function (val) {
                    if (val.numActos != 0) {
                        listCategories.push(val.nombre);
                        listCantidad.push(val.numActos);
                    }
                });
                // Create the chart
                Highcharts.chart('wrapperGraficoActosResponsable', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'RANKING PERSONA QUE MÁS REPORTA'
                    },
                    xAxis: {
                        categories: listCategories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Reportes'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Total',
                        data: listCantidad

                    }]
                });

                break;
            case 7:
                var dataPrincipal = [];
                var listCategories = [];
                var listCantidad = [];
                listAreaIndicador.forEach(function (val) {
                    if (val.numActos != 0) {
                        listCategories.push(val.areaName);
                        listCantidad.push(val.numActos);
                        dataPrincipal.push(
                            {
                                "name": val.nombre,
                                "y": val.numActos
                            }
                        );
                    }
                });
                dataPrincipal.sort(function (a, b) {
                    return -a.y + b.y;
                });
                // Create the chart
                Highcharts.chart('wrapperGraficoActosResponsable', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'REPORTES POR ÁREA DÓNDE SE REGISTRÓ EL EVENTO'
                    },
                    xAxis: {
                        categories: listCategories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Reportes'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Total',
                        data: listCantidad

                    }]
                });
                break;

            case 1:
                var dataPrincipal = [];
                var dataSeries = [];
                listCausaIndicador.forEach(function (val) {
                    val.numActosTotal = 0;
                    val.areas = [];
                    listAreaIndicador.forEach(function (val1) {
                        val.areas.push({areaId: val1.areaId, areaName: val1.areaName})
                    });

                    var dataArea = [];
                    var countNumActos;

                    val.areas.forEach(function (val1) {
                        val1.numActos = 0;
                        countNumActos = 0;

                        listFullActosConsolidado.forEach(function (val2) {
                            if (val2.areaId == val1.areaId && val2.acInseguroCausaId == val.id) {
                                val1.numActos++;
                                countNumActos++;
                            }

                        });
                        if (countNumActos != 0) {
                            dataArea.push([val1.areaName, val1.numActos])
                        }
                    });
                    dataSeries.push(
                        {
                            "name": val.nombreAux,
                            "id": val.id + "",
                            "data": dataArea
                        }
                    );
                });
                listAreaIndicador.forEach(function (val) {
                    val.causas.forEach(function (val1) {

                        listCausaIndicador.forEach(function (val2) {
                            if (val2.id == val1.id) {
                                val2.numActosTotal += val1.numActos;
                            }
                        });
                    });
                });

                listCausaIndicador.forEach(function (val) {
                    if (val.numActosTotal != 0) {
                        dataPrincipal.push(
                            {
                                "name": val.nombre,
                                "y": val.numActosTotal,
                                "drilldown": val.id + ""
                            }
                        );
                    }
                });
                dataPrincipal.sort(function (a, b) {
                    return -a.y + b.y;
                })
                Highcharts.setOptions({
                    lang: {
                        drillUpText: '<< Volver'
                    }
                });
                // Create the chart
                Highcharts.chart('wrapperGraficoActosResponsable', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ' Causas Inmediatas Total'
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            style: {
                                width: '400px',
                                whiteSpace: 'nowrap'
                            },
                            //rotation : 90
                            //"align": "left",
                            //"y": -40,
                            //"x": 4
                        },
                    },
                    yAxis: {
                        title: {
                            text: 'Cantidad'
                        }

                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    },

                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y }</b> <br/>'
                    },

                    "series": [
                        {
                            "name": "Causas Inmediatas",
                            "colorByPoint": true,
                            "data": dataPrincipal
                        }
                    ],
                    "drilldown": {
                        drillUpButton: {
                            relativeTo: 'spacingBox',
                            position: {
                                align: "left",
                                y: 0,
                                x: 0
                            }
                        },
                        "series": dataSeries
                    }
                });
                break;

            case 8:
                var dataPrincipal = [];
                var dataSeries = [];

                listEstadoReporteACIndicador.forEach(function (val) {
                    val.numActosTotal = 0;
                    val.areas = [];

                    listAreaIndicador.forEach(function (val1) {
                        val.areas.push({areaId: val1.areaId, areaName: val1.areaName})
                    });

                    var dataArea = [];
                    var countNumActos;

                    val.areas.forEach(function (val1) {
                        val1.numActos = 0;
                        countNumActos = 0;

                        listFullActosConsolidado.forEach(function (val2) {
                            if (val2.areaId == val1.areaId && val2.idEstadoReporteAC == val.id) {
                                val1.numActos++;
                                countNumActos++;
                            }
                        });

                        if (countNumActos != 0) {
                            dataArea.push([val1.areaName, val1.numActos]);
                        }
                    });

                    dataSeries.push({
                        "name": val.nombreAux,
                        "id": val.id + "",
                        "data": dataArea
                    });
                });

                listAreaIndicador.forEach(function (val) {
                    val.estados.forEach(function (val1) {
                        listEstadoReporteACIndicador.forEach(function (val2) {
                            if (val2.id == val1.id) {
                                val2.numActosTotal += val1.numActos;
                            }
                        });
                    });
                });

                listEstadoReporteACIndicador.forEach(function (val) {
                    if (val.numActosTotal != 0) {
                        dataPrincipal.push({
                            "name": val.nombre,
                            "y": val.numActosTotal,
                            "drilldown": val.id + ""
                        });
                    }
                });

                dataPrincipal.sort(function (a, b) {
                    return -a.y + b.y;
                })

                Highcharts
                    .setOptions({lang: {drillUpText: '<< Volver'}});
                // Create the chart
                Highcharts
                    .chart('wrapperGraficoActosResponsable',
                        {
                            chart: {type: 'column'},
                            title: {text: 'Estado revisión de Hallazgo'},
                            xAxis: {
                                type: 'category',
                                labels: {
                                    style: {
                                        width: '400px',
                                        whiteSpace: 'nowrap'
                                    },
                                    //rotation : 90
                                    //"align": "left",
                                    //"y": -40,
                                    //"x": 4
                                },
                            },
                            yAxis: {title: {text: 'Cantidad'}},
                            legend: {enabled: false},
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    }
                                }
                            },
                            tooltip: {
                                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y }</b> <br/>'
                            },
                            "series": [{
                                "name": "Estado de revisión",
                                "colorByPoint": true,
                                "data": dataPrincipal
                            }],
                            "drilldown": {
                                drillUpButton: {
                                    relativeTo: 'spacingBox',
                                    position: {
                                        align: "left",
                                        y: 0,
                                        x: 0
                                    }
                                },
                                "series": dataSeries
                            }
                        });
                break;

            case 2:
                var dataPrincipal = [];
                var dataSeries = [];
                listSubTiposContacto.forEach(function (val) {
                    val.numActosTotal = 0;
                    val.areas = [];
                    listAreaIndicador.forEach(function (val1) {
                        val.areas.push({areaId: val1.areaId, areaName: val1.areaName})
                    });

                    var dataArea = [];
                    var countNumActos;

                    val.areas.forEach(function (val1) {
                        val1.numActos = 0;
                        countNumActos = 0;

                        listFullActosConsolidado.forEach(function (val2) {
                            var pertenece = false;
                            var lista1 = val2.idTiposContacto;
                            var listaTipoContacto = lista1.split(",");

                            listaTipoContacto.forEach(function (val3) {
                                if (val.id == val3) {
                                    pertenece = true;
                                }
                            });
                            if (pertenece && val2.areaId == val1.areaId) {
                                val1.numActos++;
                                countNumActos++;
                            }

                        });
                        if (countNumActos != 0) {
                            dataArea.push([val1.areaName, val1.numActos]);
                        }
                    });
                    dataSeries.push(
                        {
                            "name": val.nombreAux,
                            "id": val.id + "",
                            "data": dataArea
                        }
                    );
                });
                listAreaIndicador.forEach(function (val) {
                    val.subtiposcontacto.forEach(function (val1) {

                        listSubTiposContacto.forEach(function (val2) {
                            if (val2.id == val1.id) {
                                val2.numActosTotal += val1.numActos;
                            }
                        });
                    });
                });

                listSubTiposContacto.forEach(function (val) {
                    if (val.numActosTotal != 0) {
                        dataPrincipal.push(
                            {
                                "name": val.nombreAux,
                                "y": val.numActosTotal,
                                "drilldown": val.id + ""
                            }
                        );
                    }
                });
                dataPrincipal.sort(function (a, b) {
                    return -a.y + b.y;
                })
                Highcharts.setOptions({
                    lang: {
                        drillUpText: '<< Volver'
                    }
                });
                // Create the chart
                Highcharts.chart('wrapperGraficoActosResponsable', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '  Riesgos Asociados Total'
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            style: {
                                width: '400px',
                                whiteSpace: 'nowrap'
                            },
                            //rotation : 90
                            //"align": "left",
                            //"y": -40,
                            //"x": 4
                        },
                    },
                    yAxis: {
                        title: {
                            text: 'Cantidad'
                        }

                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    },

                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y }</b> <br/>'
                    },

                    "series": [
                        {
                            "name": "Riesgos Asociados",
                            "colorByPoint": true,
                            "data": dataPrincipal
                        }
                    ],
                    "drilldown": {
                        drillUpButton: {
                            relativeTo: 'spacingBox',
                            position: {
                                align: "left",
                                y: 0,
                                x: 0
                            }
                        },
                        "series": dataSeries
                    }
                });
                $("#wrapperGraficoActosResponsable .highcharts-axis-labels > text > tspan").each(function (index, elem) {
                    if ($(elem).next("title").length > 0) {
                        //	$(elem).html($(elem).next("title").html());
                    }
                });
                break;
            case 4:
                var dataPrincipal = [];
                var dataSeries = [];
                listFechas.forEach(function (val) {
                    val.numActosTotal = 0;
                    val.areas = [];
                    listAreaIndicador.forEach(function (val1) {
                        val.areas.push({areaId: val1.areaId, areaName: val1.areaName})
                    });

                    var dataArea = [];
                    var countNumActos;

                    val.areas.forEach(function (val1) {
                        val1.numActos = 0;
                        countNumActos = 0;

                        listFullActosConsolidado.forEach(function (val2) {

                            if (val2.fechaAnio == val.anio && val2.fechaMes == val.mes
                                && val2.areaId == val1.areaId) {
                                val1.numActos++;
                                countNumActos++;
                            }

                        });
                        if (countNumActos != 0) {
                            dataArea.push([val1.areaName, val1.numActos]);
                        }
                    });
                    dataSeries.push(
                        {
                            "name": val.anio + "" + val.mes,
                            "id": val.anio + "" + val.mes,
                            "data": dataArea
                        }
                    );
                });
                listAreaIndicador.forEach(function (val) {
                    val.fechas.forEach(function (val1) {

                        listFechas.forEach(function (val2) {
                            if (val2.anio == val1.anio && val2.mes == val1.mes) {
                                val2.numActosTotal += val1.numActos;
                            }
                        });
                    });
                });

                listFechas.forEach(function (val) {
                    if (val.numActosTotal != 0) {
                        dataPrincipal.push(
                            {
                                "name": val.nombre,
                                "y": val.numActosTotal,
                                "drilldown": val.anio + "" + val.mes + ""
                            }
                        );
                    }
                });
                console.log(dataSeries);
                console.log(dataPrincipal);
                Highcharts.setOptions({
                    lang: {
                        drillUpText: '<< Volver'
                    }
                });
                // Create the chart
                Highcharts.chart('wrapperGraficoActosResponsable', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '  Cantidad por Mes Total'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: 'Cantidad'
                        }

                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    },

                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y }</b> <br/>'
                    },

                    "series": [
                        {
                            "name": "Meses",
                            "colorByPoint": true,
                            "data": dataPrincipal
                        }
                    ],
                    "drilldown": {
                        drillUpButton: {
                            relativeTo: 'spacingBox',
                            position: {
                                align: "left",
                                y: 0,
                                x: 0
                            }
                        },
                        "series": dataSeries
                    }
                });
                break;
        }
    });
}

function verDetalleActoAreaCausa(areaId, causaId) {
    alert("test 1")
}

function verDetalleActoSubTipoContactoArea(areaId, subTipoContactoId) {
    alert("test 2")
}

function verDetalleActoTipoArea(areaId, tipoId) {
    alert("test 3")
}

//Inicio acciones evento
var accionMejoraEventoObj = {};
var listFullAccionesEvento = [];
var accionMejoraEventoColaboradorIndex = 0;

function verAccionesMejoraEventoInseguro(pindex) {
    indexEventoColaborador = pindex;
    eventoColaboradorObj = listFullEventosColaborador[indexEventoColaborador];

    var dataParam = {
        accionMejoraTipoId: 2,
        eventoInseguroId: eventoColaboradorObj.acInseguroId
    };
//
    $("#detalleAccionEvento" + eventoColaboradorObj.acInseguroId).siblings(".divMovilHistorialTrabajador").hide();
    $("#detalleAccionEvento" + eventoColaboradorObj.acInseguroId).toggle()
//
    callAjaxPost(URL + '/gestionaccionmejora/accionmejora', dataParam, function (data) {
        switch (data.CODE_RESPONSE) {
            case "05":
                var todo = "";
                listFullAccionesEvento = data.list;

                listFullAccionesEvento.forEach(function (val, index) {
                    var colorEstadoAccionMejora = (val.estadoId == 2 ? "gosst-aprobado" : "gosst-advertencia");

                    var listItemsForm = [
                        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
                        {
                            sugerencia: "", label: "<i class='fa fa-info'></i> Descripcion:",
                            inputForm: val.descripcion, divContainer: ""
                        },
                        {
                            sugerencia: "", label: "<i class='fa fa-info'></i> Clasificación:",
                            inputForm: val.clasificacion.nombre, divContainer: ""
                        },
                        {
                            sugerencia: " ", label: "<i class='fa fa-fire'></i> Fecha de Registro: ",
                            inputForm: (val.fechaRevision == null ? val.fechaRealTexto :
                                val.fechaRevisionTexto), divContainer: ""
                        },
                        {
                            sugerencia: " ", label: "<i class='fa fa-user'></i> Responsable:",
                            inputForm: val.responsableNombre, divContainer: ""
                        },
                        {
                            sugerencia: " ", label: "<i class='fa fa-upload'></i> Evidencia:",
                            inputForm: (val.evidenciaNombre == "----" ? val.evidenciaNombre :
                                "<a target='_blank' class='efectoLink' " +
                                "href='" + URL + "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId=" + val.accionMejoraId + "'>" +
                                val.evidenciaNombre +
                                "</a>"), divContainer: ""
                        },
                        {sugerencia: "", anchoLabel: "", anchoDiv: "", label: "", inputForm: "", divContainer: ""},
                        {
                            sugerencia: (val.estadoId == 2 ? "" :
                                "<br><strong>*Para cambiar a 'Completado', debe subir la evidencia respectiva.</strong>"),
                            label: "<i class='fa fa-bookmark'></i> Estado: ",
                            inputForm: (val.estadoId == 2 ? "<span style='color:#9BBB59;font-size:16px;font-weight:bolder;'>Completado</span>" :
                                "<span style='color:#c5c54b;font-size:16px;font-weight:bolder;'>Pendiente*</span>"),
                            divContainer: ""
                        },
                    ];

                    var text = "";

                    listItemsForm.forEach(function (val1, index1) {
                        text += obtenerSubPanelModuloVersionDos(val1);
                    });

                    todo +=
                        "<div class='subSubDetalleAccion " + colorEstadoAccionMejora + "'>" +
                        "<div class='' style=''>" +
                        "<section class='containerEvalAccionMejora' id='opciones3'>" +
                        "<a class='efectoLink btn-gestion' " +
                        "onclick='accionMejoraEventoColaboradorIndex = " + index + ";toggleMenuOpcionAC(this," + val.accionMejoraId + ",3)';'>" +
                        "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
                        "</a>" + menuOpcionAc[3] +
                        "</section>" +
                        "</div>" +
                        "<div class='row'>" +
                        "<section class='col col-xs-9'>" +
                        "<strong>*** ACCIÓN DE MEJORA " + (index + 1) + " ***</strong>" +
                        "</section>" +
                        "</div>" +
                        text +
                        "</div>";
                });

                $("#detalleAccionEvento" + eventoColaboradorObj.acInseguroId).html(todo);

                break;

            default:
                alert("nop");
                break;
        }
    });
}

var areaResponsablesAux;

function ocultarAccionMejoraEventoInseguro(){
   $("#divNuevoAccMejoraEvento").modal("hide");
}

function agregarAccionMejoraEventoInseguro(){
   $("#divNuevoAccMejoraEvento").remove();
    
   var dataParamAux={
      empresaId:parseInt(getSession("gestopcompanyid")),area: {areaId:listFullEventosColaborador[indexEventoColaborador].areaId}
   };

   callAjaxPost(URL+'/acinseguro/colaborador',dataParamAux,function(data){
      listTrabajadores = data.listTrabajadores;areaResponsablesAux = data.areaResponsables;

      accionMejoraEventoObj = {accionMejoraId:0};

      var listItemsForm=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Clasificación*:",
          inputForm:"",divContainer:"divClasifAccColaboradorAC"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-fire'></i> Descripción*:",
          inputForm:"<input class='form-control' id='inputDescAccion'>",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-eye'></i> Observación:",
          inputForm:"<textarea class='form-control' id='textObservacionAccion' rows='4'></textarea>",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha Planificada:",
          inputForm:"<input type='date' class='form-control' id='inputDateAccion'>",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-upload'></i> Evidencia:",
          inputForm:"<div id='inputEvidenciaAccEvento'></div>",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
      ];
      
      var hasResponsableArea = (areaResponsablesAux.supervisores.length != 0 || areaResponsablesAux.jefes.length != 0 && areaResponsablesAux.gerentes.length != 0?1:0);
      
      listItemsForm.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-info-circle'></i> Área:",
          inputForm:"<label>"+areaResponsablesAux.areaName+"</label>"+(hasResponsableArea == 1?"<br><a id='idAreaResponsablesAux' style='color:black;float:right;' class='efectoLink'></a>":"")},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
	     
      if(hasResponsableArea == 1){
         if(areaResponsablesAux.supervisores.length != 0){
            listItemsForm.push({sugerencia:"",clase:"responsable-area-info",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
               label:"Supervisores:"+"<br>"+"<div style='background:#E4DCDC;'>"+areaResponsablesAux.supervisores.replace(/-/gi,"<br>")+"</div>",inputForm:""});
         }

         if(areaResponsablesAux.jefes.length != 0){
            listItemsForm.push({sugerencia:"",clase:"responsable-area-info",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
               label:"Jefes:"+"<br>"+"<div style='background:#E4DCDC;'>"+areaResponsablesAux.jefes.replace(/-/gi,"<br>")+"</div>",inputForm:""});
         }

         if(areaResponsablesAux.gerentes.length != 0){
            listItemsForm.push({sugerencia:"",clase:"responsable-area-info",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
               label:"Gerentes:"+"<br>"+"<div style='background:#E4DCDC;'>"+areaResponsablesAux.gerentes.replace(/-/gi,"<br>")+"</div>",inputForm:""});
         }
         
         listItemsForm.push({sugerencia:"",clase:"responsable-area-info",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
      }
      
      if(numSeccionInteresadaAC > 0){
         listItemsForm.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-user'></i> Responsable:",
            inputForm:"",divContainer:"divResponsableAccionMejora"});
      }

      listItemsForm.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-users'></i> Personal interesado:",
          inputForm:"",divContainer:"divPersonalInteresadoAC"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarAccionMejoraEventoInseguro()'>" +
            	   "<i class='fa fa-times'></i> Cancelar" +
            	"</button>",
          inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;'>" +
                       "<i class='fa fa-floppy-o'></i> Guardar" +
                    "</button>",divContainer: ""});

      var text = "";

      listItemsForm.forEach(function (val, index) {
         text += obtenerSubPanelModuloVersionDos(val);
      });

      var contenido =
         "<form class='eventoGeneral' id='formAccEvento'>" +
            "<div id='tituloEvento'>"+text+"</div>" +
         "</form>";

      var listPaneles={
         id:"divNuevoAccMejoraEvento",nombre:"Agregar acción de mejora",clase:"listaAuxiliar",contenido:contenido
      };

      crearModalPrincipalUsuario(listPaneles,function(){
         crearSelectOneMenuObligUnitarioCompleto("selClasificacionAccAC","",listClasificacionAccionEventoColaborador,
            "id","nombre","#divClasifAccColaboradorAC","Todos");

         crearSelectOneMenuObligMultipleCompleto("selMulPersonalInteresadoAC","",listTrabajadores,"trabajadorId",
            "trabajadorNombre","#divPersonalInteresadoAC","Todos");

         if(numSeccionInteresadaAC > 0){
            crearSelectOneMenuObligUnitarioCompleto("selResponsableAccionMejora","",listTrabajadores,
               "trabajadorId","trabajadorNombre","#divResponsableAccionMejora","Todos");
         }
      },true,true);

      $("#formAccEvento").on("submit",function(e){
         e.preventDefault();
         guardarAccionMejoraEvento();
      });

      var options={
         container:"#inputEvidenciaAccEvento",functionCall:function(){
            validacionSubirEvidencia("AccEvento",bitsEvidenciaEscenarioAccidente,"divNuevoAccMejoraEvento");
         },descargaUrl:"",esNuevo:true,idAux:"AccEvento",
         evidenciaNombre:"",mensajeAux:"En caso ya haya realizado esta acción, suba una evidencia"
      };

      crearFormEvidenciaCompleta(options);
      
      if(hasResponsableArea == 1){
	 ocultarDetalleInformacionAsociada("idAreaResponsablesAux","responsable-area-info");
      }
   });
}

function guardarAccionMejoraEvento() {
    var campoVacio = true;

    var descripcion = $("#inputDescAccion").val();
    var fechaRevision = convertirFechaTexto($("#inputDateAccion").val());
    var clasificacionId = $("#selClasificacionAccAC").val();
    eventoColaboradorObj = listFullEventosColaborador[indexEventoColaborador];

    var textObservacion = $("#textObservacionAccion").val();
    var trabajadorResponsableId = (numSeccionInteresadaAC > 0 ?
        parseInt($("#selResponsableAccionMejora").val()) : parseInt(getSession("trabajadorGosstId")));
    var evidenciaNombre = $("#inputEviAccEvento").val();

    var listPersonalInteresadoId = [];
    var personalInteresadoId = $("#selMulPersonalInteresadoAC").val();

    if (personalInteresadoId != null) {
        personalInteresadoId.forEach(function (val) {
            listPersonalInteresadoId.push(parseInt(val));
        });
    }

    if (fechaRevision == null) {
        mensajeUx = "<label>Debe introducir la fecha planificada.</label>";
        campoVacio = false;
    } else if (evidenciaNombre == "VOLVER A SUBIR") {
        mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
        campoVacio = false;
    }

   if(campoVacio){
        var dataParam = {
            accionMejoraId: accionMejoraEventoObj.accionMejoraId,
            eventoInseguroId: eventoColaboradorObj.acInseguroId,
            descripcion: descripcion,
            observacion: textObservacion,
            fechaRevision: fechaRevision,
            clasificacion: {id: clasificacionId},
            responsableNombre: "",
            responsableMail: "",
            estadoId: 1,
            inversionAccion: 0,
            accionMejoraTipoId: 2,
            horaPlanificada: "13:00:00",
            trabajadorResponsableId: trabajadorResponsableId,
            listPersonalInteresadoId: (listPersonalInteresadoId.length == 0 ? null : listPersonalInteresadoId)
        }

        callAjaxPost(URL + '/gestionaccionmejora/accionmejora/save', dataParam, function (data) {
            switch (data.CODE_RESPONSE) {
                case "05":
                    $(".modal").modal("hide");
                    guardarEvidenciaAuto(data.nuevoId, "fileEviAccEvento", bitsEvidenciaEscenarioAccidente,
                        "/gestionaccionmejora/accionmejora/evidencia/save", function () {
                            $(".modal").modal("hide");
                            mensajeUx = "<label>La acción de mejora se registró correctamente</label>";
                            mensajesUx(mensajeUx, 1, "", "VistaTraEventoInseguro");

                            $("#modalMensajeUxVistaTraEventoInseguro").on("hidden.bs.modal", function () {
                                habilitarReporteEventoUsuario();
                            });
                        }, "accionMejoraId");
                    break;

                default:
                    alert("Ocurrió un error al guardar!");

            }
        });
   }else{
      $("#divNuevoAccMejoraEvento").modal("hide");
      mensajesUx(mensajeUx,2,"","VistaTraEventoInseguroValAux1");

      $("#modalMensajeUxVistaTraEventoInseguroValAux1").on("hidden.bs.modal",function(){
         $("#divNuevoAccMejoraEvento").modal("show");
      });
   }
}

function eliminarACSubestandar() {
    mensajeUx = "<label>¿Está seguro de eliminar este A/C Subestándar?</label>";
    mensajesUx(mensajeUx, 3, "", "VistaColACSub");

    $("#btnDevolverValorVistaColACSub").on("click", function () {
        eventoColaboradorObj = listFullEventosColaborador[indexEventoColaborador];

        var dataParam = {
            acInseguroId: eventoColaboradorObj.acInseguroId
        };

        callAjaxPost(URL + '/acinseguro/delete', dataParam, function (data) {
            habilitarReporteEventoUsuario();
        })
    });
}

function marcarRevisadoACSubestandarSinAccionMejora(){
   mensajeUx = "<label>¿Está seguro de marcar como revisado este A/C Subestándar? " +
      "(no requiere acción de mejora)</label>";
   mensajesUx(mensajeUx,3,"","VistaRevACSubSinAccMej");

   $("#btnDevolverValorVistaRevACSubSinAccMej").on("click",function(){
      eventoColaboradorObj = listFullEventosColaborador[indexEventoColaborador];

      var dataParam={
         acInseguroId:eventoColaboradorObj.acInseguroId,sinAccionMejora:1
      };

      callAjaxPost(URL+'/acinseguro/sinaccionmejora/save',dataParam,function(data){
         mensajeUx = "<label>La A/C Subestándar (que no requiere acción de mejora) ha sido marcada " +
            "como revisado con éxito.</label>";
         mensajesUx(mensajeUx,1,"","ActualizarVistaEveInsSinAccMej");

         $("#modalMensajeUxActualizarVistaEveInsSinAccMej").on("hidden.bs.modal",function(){
            habilitarReporteEventoUsuario();
         });
      });
   });
}

//FIn acciones evento

function agregarPanelesDivPrincipalACSubestandar(listPanelesPrincipal, contenedor) {

    if (listPanelesPrincipal.length == 0) {
        $(".divListPrincipal")
            .append("<div id='divNoResultados'>" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
                "</div>");

        $("#divNoResultados").find(".tituloSubList")
            .html(
                //"<i aria-hidden='true' class='fa fa-list'></i>"+
                "Sin resultados");
    }

    var count = 0;

    listPanelesPrincipal.forEach(function (val, index) {
        count++;
        $(".divListPrincipal")
            .append("<div id='" + val.id + "' class='" + val.clase + "' >" +
                "<div class='tituloSubList'></div>" +
                "<div class='contenidoSubList'></div>" +
                "</div>");

        if (contenedor != count) {
            var textoBtn = "<button class='btn btn-success' style='padding:4px 8px 4px 8px' " +
                "onclick='cambiarDivSubContenido(this," + val.proyectoId + ")'>" +
                "<i class='fa fa-caret-down fa-3x' aria-hidden='true'></i>" +
                "</button>";
        } else {
            var textoBtn = "<button type='button btn-success' id='btnFiltroInicialACSubestandar' class='btn btn-success' " +
                "style='padding:4px 8px 4px 8px' onclick='verFiltroInicialACSubestandar()' " +
                "title='Mostrar filtro de los reportes A/C.'>" +
                "<i class='fa fa-filter fa-3x'></i>" +
                "</button>";
        }

        $("#" + val.id).find(".tituloSubList")
            .html(textoBtn
                //	+"<i aria-hidden='true' class='fa fa-list'></i>"
                + val.nombre);

        $("#" + val.id).find(".contenidoSubList")
            .html(val.contenido);
    });
}

var acSubestandarId,indexAcSubestandar,acSubestandarObj = {},actualizarPrincipalAcSub;

function toggleMenuOpcionReporteEventoUsuarioVersionDos(obj,pindex){
    acSubestandarObj = listFullEventosColaborador[pindex];indexAcSubestandar = pindex;

    if(!$(obj).parent().parent().parent(".eventoGeneral").find("ul").is(":visible")){
        $(".listaFinalGestionGosst").hide();
    }

    $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
}

var funcionalidadesAcSubestandar=[
    {id:"opcRegAcSubEst1&2&3",nombre:"<i class='fa fa-book'></i> Ver acciones de mejora",estadosHabilitados:[1,2,3],
     habilitadoEmpresa:true,functionClick:function(data){verAccionMejoraAcSub();}},
    {id:"opcMarcaRevisadoAcSubEst1",nombre:"<i class='fa fa-check-square-o'></i> Marcar como revisado <br> (no requiere acción de mejora)",estadosHabilitados:[1],
     habilitadoEmpresa:(parseInt(getSession("gestopcompanyid")) == 336?false:true),functionClick:function(data){marcarRevisadoACSubestandarSinAccionMejoraVersionDos();}},
    {id:"opcAnularAcSubEst1",nombre:"<i class='fa fa-trash'></i> Calificar reporte como no válido",estadosHabilitados:[1],
     habilitadoEmpresa:true,functionClick:function(data){verAnularEventoInseguroAcColaborador();}},
    {id:"opcSubirConstanciaAcSubEst1&2&3",nombre:"<i class='fa fa-upload'></i> Subir Observaciones preventivas de seguridad (OPS)",estadosHabilitados:[1,2,3],
     habilitadoEmpresa:([154,714].includes(parseInt(getSession("gestopcompanyid")))?true:false),functionClick:function(data){verSubirConstanciaEventoInseguroColaborador();}}
];

function marcarSubOpcionReporteEventoUsuarioVersionDos(pindex){
    funcionalidadesAcSubestandar[pindex].functionClick();
    $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function habilitarReporteEventoUsuarioVersionDos(){
    window.scrollTo({top:0,behavior:'smooth'});

    cargarListConexionesVisorEvidencia(1);

    var idOpcion = parseInt($("#selVisualizacionOpcAcSubTrab").val());

    var dataParam={
        isTrabajador:(idOpcion != 0?idOpcion:null),fechaInicioFiltro:$("#fechaInicioFiltroAcSubTrab").val(),
        fechaFinFiltro:$("#fechaFinFiltroAcSubTrab").val(),listUnidadesId:(listUnidadesFiltro.length == 0?null:listUnidadesFiltro),
        listDivisionesId:(listUnidadesFiltro.length == 0 || listDivisionesFiltro.length == 0?null:listDivisionesFiltro),
        listAreasId:(listDivisionesFiltro.length == 0 || listAreasFiltro.length == 0?null:listAreasFiltro)
    };

    if(parseInt(getSession("gestopcompanyid")) != 336){
        dataParam.listEstadoReporteACId = (listEstadoEventInseguroIdFiltro.length == 0?null:listEstadoEventInseguroIdFiltro);
    }

    if(idOpcion == 2){
        dataParam.companyId = parseInt(getSession("gestopcompanyid"));
    }else{
        dataParam.trabajadorId = parseInt(getSession("trabajadorGosstId"));
    }

    callAjaxPostSimpleVersionDos(1,URL+'/acinseguro/movil/vista_colaborador/version_dos',dataParam,1,1,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                var listPanelesPrincipal = [];
                var textAcSubEstadoUno = "",textAcSubEstadoDos = "",textAcSubEstadoTres = "",textAcSubEstadoCuatro = "",textAcSubEstadoCinco = "";
                var numAcSubEstadoUno = 0,numAcSubEstadoDos = 0,numAcSubEstadoTres = 0,numAcSubEstadoCuatro = 0,numAcSubEstadoCinco = 0;

                listFullEventosColaborador = data.listAcSubestandar;

                $(".divListPrincipal").html("");

                listFullEventosColaborador.forEach(function(val,index){
                    var btnOpcion = "",menuOpcion = "";

                    if(numAreasResponsable > 0 && [1,2,3].includes(val.estadoActualId)){
                        menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
                            funcionalidadesAcSubestandar.forEach(function(val1,index1){
                                if(val1.estadosHabilitados.includes(val.estadoActualId) && val1.habilitadoEmpresa == true){
                                    menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionReporteEventoUsuarioVersionDos("+index1+")'>"+val1.nombre+"</li>";
                                }
                            });
                        menuOpcion += "</ul>";

                        btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionReporteEventoUsuarioVersionDos(this,"+index+")'>" +
                                        "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
                                    "</a>";
                    }

                    cargarListConexionesVisorEvidencia(0,"/acinseguro/evidencia/url",val.evidenciaNombre);

                    var linkEvidencia = (val.evidenciaNombre.length == 0?"------":
                        "<a href='"+URL+"/acinseguro/evidencia?acInseguroId="+val.acInseguroId+"' class='efectoLink' target='_blank'>"+val.evidenciaNombre+"</a>" +
                         getButtonVisorEvidencia(val.evidenciaNombre,val.acInseguroId,1,0));

                    var listTotal=[
                        {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
                         label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CÓDIGO #"+val.codigo+" ***</span>"},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"<i class='fa fa-calendar'></i> Fecha y hora del evento:",inputForm:val.reporteFechaTexto+" "+val.horaTexto},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
                    ];

                    if(![336,500,670].includes(parseInt(getSession("gestopcompanyid")))){
                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> "+(getSession("gestopunidad") != null?getSession("gestopunidad"):"Unidad")+" dónde ocurrió:",inputForm:val.matrixName},
                            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> "+(getSession("gestopdivision") != null?getSession("gestopdivision"):"División")+" dónde ocurrió:",inputForm:val.divisionNombre});
                    }

                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> "+(getSession("gestoparea") != null?getSession("gestoparea"):"Área")+" dónde ocurrió:",inputForm:val.areaNombre},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-pencil-square'></i> "+textDescripcionAcSub,inputForm:""},
                        {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:(val.acInseguroNombre.trim().length == 0?"------":val.acInseguroNombre),styleAux:"word-break:break-all;"},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil-square'></i> Lugar exacto del evento:",inputForm:(val.reporteLugar.trim().length == 0?"------":val.reporteLugar)},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> "+textTipoAcSub+":",inputForm:val.acInseguroTipoNombre});

                    if(parseInt(getSession("gestopcompanyid")) == 714){
                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Factor de riesgo:",inputForm:val.factorRiesgo.nombre},
                            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Peligro:",inputForm:val.peligroAc.nombre},
                            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
                    }

                    if(![670,714,716].includes(parseInt(getSession("gestopcompanyid")))){
                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> "+textCausaAcSub+":",inputForm:val.acInseguroCausaNombre});
                    }

                    if(numAreasResponsable > 0){
                        if(![670,714,716].includes(parseInt(getSession("gestopcompanyid")))){
                            listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> "+textRiesgoAcSub+":",
                                inputForm:(val.subTipoContacto.nombre.length == 0?"------":val.subTipoContacto.nombre)});
                        }

                        if(![336,670,716].includes(parseInt(getSession("gestopcompanyid")))){
                            listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Nivel de riesgo:",inputForm:val.nivelRiesgoNombre});
                        }
                    }

                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil-square'></i> "+textCorreccionAcSub+":",
                         inputForm:(val.reporteAccion.trim().length == 0?"------":val.reporteAccion)});

                    if(![336,500,670].includes(parseInt(getSession("gestopcompanyid")))){
                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil-square'></i> Trabajador observado:",
                             inputForm:(val.trabajadorObservado.trim().length == 0?"------":val.trabajadorObservado)},
                            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil-square'></i> Trabajador que reporta:",
                             inputForm:(val.trabajadorQueReporta.trim().length == 0?"------":val.trabajadorQueReporta)});
                    }

                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Evidencia del reporte:",inputForm:linkEvidencia});

                    if([154,714].includes(parseInt(getSession("gestopcompanyid")))){
                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Observaciones preventivas de seguridad (OPS):",
                             inputForm:getButtonDescargaAmazonS3("/acinseguro/amazon_s3/evidencia_constancia_registro?acInseguroId="+val.acInseguroId,val.evidenciaConstanciaRegistroNombre,0) +
                             getButtonVisorEvidenciaAmazonS3(val.acInseguroId,val.evidenciaConstanciaRegistroNombre.replace(/['"]/g,''),val.evidenciaConstanciaRegistroUrl,1,0)});
                    }

                    listTotal.push({sugerencia:"", anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"<span style='font-size:18px;'><i class='fa fa-user'></i> Reportado por:</span>",
                         inputForm:(numAreasResponsable == 0?val.trabajadorRegistraNombre:val.reporteNombre)});

                    if([2,3].includes(val.estadoActualId)){
                        var colorEstado = (val.estadoActualId == 3?"color:blue;":"color:red;");

                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                            {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
                             label:"<span style='font-size:18px;'><i class='fa fa-book'></i> Estado de las actividades:</span>",
                             inputForm:"<span style='"+colorEstado+"font-size:18px;font-weight:bolder;'>"+val.numAccionesColaboradorCompletadas+" / "+val.numAccionesColaboradorTotal+"</span>"});
                    }

                    if(val.tipoValido.id == 2){
                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
                            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info-circle'></i> <label style='color:red;'>Motivo:</label>",
                             inputForm:"<label style='color:red'>"+(val.motivoValido.trim().length == 0?"------":val.motivoValido)+"</label>"});
                    }else if(val.tipoValido.id == 4){
                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
                            {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<i class='fa fa-info-circle'></i> " +
                             "<span style='color:red;font-weight:bolder;'>"+"*Este reporte no requiere acciones correctivas adicionales."+"</span>"});
                    }

                    var textAcSubAux = "";

                    textAcSubAux += "<div class='eventoGeneral'>" +
                                        "<form class='eventoGeneral'>";
                    listTotal.forEach(function(val,index){
                        textAcSubAux += obtenerSubPanelModuloVersionDos(val);
                    });
                    textAcSubAux +=     "</form>" +
                                    "</div>";

                    if(val.estadoActualId == 5){
                        textAcSubEstadoCinco += textAcSubAux;numAcSubEstadoCinco++;
                    }else if(val.estadoActualId == 4){
                        textAcSubEstadoCuatro += textAcSubAux;numAcSubEstadoCuatro++;
                    }else if(val.estadoActualId == 3){
                        textAcSubEstadoTres += textAcSubAux;numAcSubEstadoTres++;
                    }else if(val.estadoActualId == 2){
                        textAcSubEstadoDos += textAcSubAux;numAcSubEstadoDos++;
                    }else{
                        textAcSubEstadoUno += textAcSubAux;numAcSubEstadoUno++;
                    }
                });

                if([154,336].includes(parseInt(getSession("gestopcompanyid")))){
                    listPanelesPrincipal.push({id:"importNuevoAcSubestandar",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verNuevoImportEventoInseguro()",
                        btnIconoAux:"fa-inbox",btnTitleAux:"Ver método import para registros A/C Subestándar.",nombre:"Import - A/C Subestándar",contenido:""
                    });
                }

                listPanelesPrincipal.push({id:"nuevoRegistroAcSubestandar",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroAcSubestandar(1)",
                     btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar A/C Subestándar",contenido:""},
                    {id:"opcionesAcSubestandar",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verFiltroAcSubestandarTrab()",
                     btnIconoAux:"fa-filter",btnTitleAux:"Opciones de los registros",nombre:"Opciones",contenido:""},
                    {id:"estadoUnoAcSubestandar",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
                     btnIconoAux:"",btnTitleAux:"",nombre:"Reportes sin revisar ("+numAcSubEstadoUno+")",contenido:textAcSubEstadoUno},
                    {id:"estadoDosAcSubestandar",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
                     btnIconoAux:"",btnTitleAux:"",nombre:"Reportes revisados - Actividades pendientes ("+numAcSubEstadoDos+")",contenido:textAcSubEstadoDos},
                    {id:"estadoTresAcSubestandar",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
                     btnIconoAux:"",btnTitleAux:"",nombre:"Reportes revisados - Actividades completadas ("+numAcSubEstadoTres+")",contenido:textAcSubEstadoTres});

                if(parseInt(getSession("gestopcompanyid")) != 336){
                    listPanelesPrincipal.push({id:"estadoCuatroAcSubestandar",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
                        btnIconoAux:"",btnTitleAux:"",nombre:"Reportes revisados - Actividades completadas [no requieren acciones correctivas] ("+numAcSubEstadoCuatro+")",contenido:textAcSubEstadoCuatro});
                }

                listPanelesPrincipal.push({id:"estadoCincoAcSubestandar",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
                     btnIconoAux:"",btnTitleAux:"",nombre:"Reportes revisados clasificados como no válidos ("+numAcSubEstadoCinco+")",contenido:textAcSubEstadoCinco},
                    {id:"consolidadoAcSubestandar",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verTablaConsolidadoActos()",
                     btnIconoAux:"fa-table",btnTitleAux:"Ver consolidado",nombre:"Ver consolidado",contenido:""},
                    {id:"quicksightAcSubestandar",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verQuicksightActos()",
                     btnIconoAux:"fa-pie-chart",btnTitleAux:"Ver gráficos en quicksight",nombre:"Ver análisis de datos",contenido:""});

                agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);

                $("#liMenuTrabajador10 .alertaMenu").html(numAcSubEstadoUno+numAcSubEstadoDos);

                $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();

                break;

            default:
                alert("nop");

                break;
        }
    });
}

function ocultarRegistroAcSubestandar(){
    $("#modalRegistroAcSubestandar").modal("hide");
}

function registroAcSubestandar(opcionId){
    $("#modalRegistroAcSubestandar").remove();

    acSubestandarId = 0;

    var textOpcional = "<br><span style='color:blue;font-weight:bold;'>(Opcional)</span>";

    var selUnidadEventInseg = crearSelectOneMenu("selUnidadEventInseg","filtrarDivisionesSegunUnidadEventoInseguro()",
        listUnidades,(parseInt(getSession("gestopcompanyid")) == 500?"927":"-1"),"id","nombre",(listUnidades.length == 0?"Sin unidades registradas":null));

    var onchangeSelActoTipoAux = (![670,714,716].includes(parseInt(getSession("gestopcompanyid")))?"verCategAcordeTipoActoInseguroVersionDos()":"");

    var selActoTipo = crearSelectOneMenuOblig("selActoTipo",onchangeSelActoTipoAux,listActoTipo,"","actTipoId","actTipoName");

    var selFactorRiesgoEventInseg = crearSelectOneMenuOblig("selFactorRiesgoEventInseg",
        "filtrarPeligrosSegunFactorRiesgoEventoInseguro()",listFactoresRiesgo,"","id","nombre");

    var selSubTipoContactoColaborador = crearSelectOneMenuOblig("selSubTipoContactoColaborador","",
        listSubTipoContactoColaborador,(parseInt(getSession("gestopcompanyid")) == 500?44:45),"id","nombre");

    var selNivelRiesgo = crearSelectOneMenuOblig("selNivelRiesgo","",listNivelActoColaborador,6,"nivelRiesgoId","nivelRiesgoNombre");

    var btnOpcionAux1 = "<a id='btnVerNuevoAcSubEmpDetalle' class='btn-gestion efectoLink' onclick='verDetallesCamposEmpAcSub(1)' style='float:left;'>"  +
                            "<i class='fa fa-eye' aria-hidden='true'></i> Ver Detalles del evento" +
                        "</a>";

    var btnOpcionAux2 = "<a id='btnOcultarNuevoAcSubEmpDetalle' style='display:none;float:left;' class='btn-gestion efectoLink' onclick='verDetallesCamposEmpAcSub(0)'>" +
                            "<i class='fa fa-eye-slash' aria-hidden='true'></i> Ocultar Detalles del evento" +
                        "</a>";

    var contenido = "";

    var listContenido=[
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha del evento",inputForm:"<input id='inputFechaEventoAcSub' type='date' class='form-control'>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hora del evento",inputForm:"<input id='inputTimeEventoAcSub' type='time' class='form-control'>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
    ];

    if(parseInt(getSession("gestopcompanyid")) == 336){
        listContenido.push({sugerencia:"",label:"Trabajador reporta*",inputForm:"<input id='inputAutoTrabajador' class='form-control' type='text'>" +
                                                                           "<div id='divAutoCompletarTrab'></div>" +
                                                                           "<label>*Buscar trabajador por N° documento y/o nombre/apellido (debe ingresar 3 caracteres como mínimo).</label>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
    }

    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestopunidad") != null?getSession("gestopunidad"):"Unidad"),inputForm:selUnidadEventInseg},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestopdivision") != null?getSession("gestopdivision"):"División"),inputForm:"",divContainer:"divSelDivisionActo"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestoparea") != null?getSession("gestoparea"):"Área"),inputForm:"",divContainer:"divSelAreaActo"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:textDescripcionAcSub,inputForm:""},
        {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='inputDescActo' class='form-control' rows='4'></textarea>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Lugar exacto del evento "+(parseInt(getSession("gestopcompanyid")) == 336?textOpcional:""),
         inputForm:"<input id='inputDescLugar' type='text' class='form-control'>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});

    if(parseInt(getSession("gestopcompanyid")) == 500){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:btnOpcionAux1+btnOpcionAux2},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
    }

    listContenido.push({sugerencia:"",clase:"campo-detalle-acsub-500",anchoLabel:"",anchoDiv:"",label:textTipoAcSub+(parseInt(getSession("gestopcompanyid")) == 500?textOpcional:""),inputForm:selActoTipo});

    if(parseInt(getSession("gestopcompanyid")) == 714){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",label:"Factor de riesgo",inputForm:selFactorRiesgoEventInseg},
            {sugerencia:"",label:"Peligro",inputForm:"",divContainer:"divSelPeligroActo"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
    }

    if(![670,714,716].includes(parseInt(getSession("gestopcompanyid")))){
        listContenido.push({sugerencia:"",clase:"campo-detalle-causa-ac campo-detalle-acsub-500",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",clase:"campo-detalle-acsub-500",label:textCausaAcSub+(parseInt(getSession("gestopcompanyid")) == 500?textOpcional:""),inputForm:"",divContainer:"divCausaInmColaborador"},
            {sugerencia:"",clase:"campo-detalle-causa-ac campo-detalle-acsub-500",anchoLabel:"",anchoDiv:"",label:"Detalle de la causa inmediata"+(parseInt(getSession("gestopcompanyid")) == 500?textOpcional:""),
             inputForm:"<input id='inputEspCausaActo' type='text' class='form-control'>"},
            {sugerencia:"",clase:"campo-detalle-causa-ac campo-detalle-acsub-500",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
    }

    if(![670,714,716].includes(parseInt(getSession("gestopcompanyid")))){
        listContenido.push({sugerencia:"",clase:"campo-detalle-acsub-500",anchoLabel:"",anchoDiv:"",label:textRiesgoAcSub+(parseInt(getSession("gestopcompanyid")) == 500?textOpcional:""),inputForm:selSubTipoContactoColaborador});
    }

    if(![336,670,716].includes(parseInt(getSession("gestopcompanyid")))){
        listContenido.push({sugerencia:"",clase:"campo-detalle-acsub-500",anchoLabel:"",anchoDiv:"",label:"Nivel de riesgo"+(parseInt(getSession("gestopcompanyid")) == 500?textOpcional:""),inputForm:selNivelRiesgo});
    }

    listContenido.push({sugerencia:"",clase:"campo-detalle-acsub-500",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",clase:"campo-detalle-acsub-500",anchoLabel:"",anchoDiv:"",label:textCorreccionAcSub+([336,500].includes(parseInt(getSession("gestopcompanyid")))?textOpcional:""),
         inputForm:"<input id='inputDescCorrInm' type='text' class='form-control'>"});

    if(![336,500,670].includes(parseInt(getSession("gestopcompanyid")))){
        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Trabajador observado",inputForm:"<input id='inputTrabObsEventInseg' type='text' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Trabajador que reporta",inputForm:"<input id='inputTrabQueReportaEventInseg' type='text' class='form-control'>"});
    }

    listContenido.push({sugerencia:"",clase:"campo-detalle-acsub-500",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia del reporte "+([336,500].includes(parseInt(getSession("gestopcompanyid")))?textOpcional:""),inputForm:"",divContainer:"eviActo"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroAcSubestandar()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='guardarRegistroAcSubestandar()'>" +
                       "<i class='fa fa-floppy-o'></i> Guardar" +
                   "</button>"});

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalRegistroAcSubestandar",nombre:"<i class='fa fa-pencil'></i> Registro A/C Subestándar",
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    var options={
        container:"#eviActo",functionCall:function(){
            validacionSubirEvidencia("EventoSub",bitsEvidenciaActoInseguro,"modalRegistroAcSubestandar");
        },descargaUrl:"",esNuevo:true,idAux:"EventoSub",evidenciaNombre:""
    };

    crearFormEvidenciaCompleta(options);

    filtrarDivisionesSegunUnidadEventoInseguro();

    var hoy = getSession("fechaHoyOrdenInversoTexto");
    $("#inputFechaEventoAcSub").val(hoy);$("#inputTimeEventoAcSub").val(obtenerHoraActual(1));

    if(parseInt(getSession("gestopcompanyid")) == 336){
        verAutoCompletarTrabAcInseguro();verCategAcordeTipoActoInseguroVersionDos();
    }else if(parseInt(getSession("gestopcompanyid")) == 500){
        verDetallesCamposEmpAcSub(0);verCategAcordeTipoActoInseguroVersionDos();
    }else if(parseInt(getSession("gestopcompanyid")) == 714){
        filtrarPeligrosSegunFactorRiesgoEventoInseguro();
    }else if(![670,716].includes(parseInt(getSession("gestopcompanyid")))){
        verCategAcordeTipoActoInseguroVersionDos();
    }
}

function verDetallesCamposEmpAcSub(valor){
    var valorId = parseInt(valor);

    (valorId == 1?$("#btnVerNuevoAcSubEmpDetalle").hide():$("#btnVerNuevoAcSubEmpDetalle").show());
    (valorId == 1?$("#btnOcultarNuevoAcSubEmpDetalle").show():$("#btnOcultarNuevoAcSubEmpDetalle").hide());
    (valorId == 1?$(".campo-detalle-acsub-500").show():$(".campo-detalle-acsub-500").hide());

    if(valorId == 1){
        verAcordeCausaInmediataVersionDos();
    }
}

var selDivisionEventInseg,selAreaColaborador,textoAdicional,textoSelectVacioAux1,textoSelectVacioAux2;

function filtrarDivisionesSegunUnidadEventoInseguro(){
    var listDivisionActoAux = [];selDivisionEventInseg = "";

    textoSelectVacioAux1 = ([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sedes":"divisiones");
    textoSelectVacioAux2 = (parseInt(getSession("gestopcompanyid")) == 714?"el país - empresa seleccionado":"la unidad seleccionada");

    var unidadIdAux = parseInt($("#selUnidadEventInseg").val());

    if(listDivisionesSimple.length != 0 && unidadIdAux != -1){
        listDivisionesSimple.forEach(function(val){
            if(val.matrixId == unidadIdAux){
                listDivisionActoAux.push(val);
            }
        });

        selDivisionEventInseg = crearSelectOneMenu("selDivisionEventInseg","filtrarAreasSegunDivisionEventoInseguro()",listDivisionActoAux,
            (parseInt(getSession("gestopcompanyid")) == 500?"2430":""),"divisionId","divisionName",(listDivisionActoAux.length == 0?"Sin "+textoSelectVacioAux1+" asociadas":null));

        textoAdicional = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2+".</small>";
    }else{
        textoAdicional = "<small style='font-weight:bold;'>"+(unidadIdAux == -1?"*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2:
            "<small style='font-weight:bold;'>*No hay "+textoSelectVacioAux1+" para seleccionar")+".</small>";
    }

    $("#divSelDivisionActo").html(selDivisionEventInseg+textoAdicional);

    filtrarAreasSegunDivisionEventoInseguro();
}

function filtrarAreasSegunDivisionEventoInseguro(){
    var listAreaActoAux = [];selAreaColaborador = "";

    textoSelectVacioAux1 = (parseInt(getSession("gestopcompanyid")) == 714?"áreas - procesos":"áreas");
    textoSelectVacioAux2 = "la "+([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sede":"división")+" seleccionada";

    var divisionIdAux = (selDivisionEventInseg.length == 0?-1:parseInt($("#selDivisionEventInseg").val()));

    if(listAreaActoColaborador.length != 0 && divisionIdAux != -1){
        listAreaActoColaborador.forEach(function(val){
            if(val.divisionId == divisionIdAux){
                listAreaActoAux.push(val);
            }
        });

        selAreaColaborador = crearSelectOneMenu("selAreaColaborador","",listAreaActoAux,"","areaId","areaNameShort",
            (listAreaActoAux.length == 0?"Sin "+textoSelectVacioAux1+" con responsables":null));

        textoAdicional = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2+".</small>";
    }else{
        textoAdicional = "<small style='font-weight:bold;'>"+(divisionIdAux == -1?"*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2:
            "<small style='font-weight:bold;'>*No hay "+textoSelectVacioAux1+" con responsables para seleccionar")+".</small>";
    }

    $("#divSelAreaActo").html(selAreaColaborador+textoAdicional);
}

function filtrarPeligrosSegunFactorRiesgoEventoInseguro() {
    var listPeligroAcActoAux = [], selPeligroAcEventInseg = "";

    var factorRiesgoIdAux = parseInt($("#selFactorRiesgoEventInseg").val());

    listPeligrosAc.forEach(function (val) {
        if (val.factorRiesgoId == factorRiesgoIdAux) {
            listPeligroAcActoAux.push(val);
        }
    });

    selPeligroAcEventInseg = crearSelectOneMenuOblig("selPeligroAcEventInseg", "", listPeligroAcActoAux, "", "id", "nombre");

    textoAdicional = "<small style='font-weight:bold;'>*Los peligros se muestran según el factor de riesgo seleccionado.</small>";

    $("#divSelPeligroActo").html(selPeligroAcEventInseg + textoAdicional);
}

function verCategAcordeTipoActoInseguroVersionDos() {
    var selActoTipo = parseInt($("#selActoTipo").val());
    var listFinal = [];

    listCausaInmediataColaborador.forEach(function(val){
        if(val.causaInmTipoEvent == selActoTipo){
            listFinal.push(val);
        }
    });

    var valInicialId = (parseInt(getSession("gestopcompanyid")) == 714?(selActoTipo == 1?1016:2021):(selActoTipo == 1?75:74));

    var selCausaInmediataColaborador = crearSelectOneMenuOblig("selCausaInmediataColaborador",
        "verAcordeCausaInmediataVersionDos()",listFinal,valInicialId,"id","nombre");

    $("#divCausaInmColaborador").html(selCausaInmediataColaborador);

    verAcordeCausaInmediataVersionDos();
}

function verAcordeCausaInmediataVersionDos() {
    var causaId = parseInt($("#selCausaInmediataColaborador").val());

    ([17,34,46,56,71].includes(causaId)?$(".campo-detalle-causa-ac").show():$(".campo-detalle-causa-ac").hide());
}

function guardarRegistroAcSubestandar(){
    var campoVacio = true;

    var fechaEventoAcSub = convertirFechaTexto($("#inputFechaEventoAcSub").val());
    var inputFechaEventoAcSub = (!fechaEventoAcSub?null:fechaEventoAcSub);
    var hora = $("#inputTimeEventoAcSub").val();
    var trabajadorReporta = (parseInt(getSession("gestopcompanyid")) != 336?parseInt(getSession("trabajadorGosstId")):parseInt($("#selAutoTrabajador").val()));
    var unidadId = parseInt($("#selUnidadEventInseg").val());
    var divisionId = parseInt($("#selDivisionEventInseg").val());
    var areaId = parseInt($("#selAreaColaborador").val());
    var descripcion = $("#inputDescActo").val().trim();
    var lugar = $("#inputDescLugar").val();
    var selActTipo = parseInt($("#selActoTipo").val());
    var factorRiesgoId = (parseInt(getSession("gestopcompanyid")) == 714?parseInt($("#selFactorRiesgoEventInseg").val()):null);
    var peligroAcId = (parseInt(getSession("gestopcompanyid")) == 714?parseInt($("#selPeligroAcEventInseg").val()):null);
    var causaId = (![670,714,716].includes(parseInt(getSession("gestopcompanyid")))?parseInt($("#selCausaInmediataColaborador").val()):(selActTipo == 1?75:74));
    var detalleCausa = ([17,34,46,56,71].includes(causaId)?$("#inputEspCausaActo").val().trim():"");
    var subTipoContactoId = (![670,714,716].includes(parseInt(getSession("gestopcompanyid")))?parseInt($("#selSubTipoContactoColaborador").val()):45);
    var nivelId = (![336,670,716].includes(parseInt(getSession("gestopcompanyid")))?parseInt($("#selNivelRiesgo").val()):(parseInt(getSession("gestopcompanyid")) != 336?6:2));
    var corrInmediata = $("#inputDescCorrInm").val().trim();
    var trabajadorObservado = (![336,500,670].includes(parseInt(getSession("gestopcompanyid")))?$("#inputTrabObsEventInseg").val().trim():null);
    var trabajadorQueReporta = (![336,500,670].includes(parseInt(getSession("gestopcompanyid")))?$("#inputTrabQueReportaEventInseg").val().trim():null);
    var evidenciaNombre = $("#inputEviEventoSub").val().trim();
    var existe = (evidenciaNombre.length == 0?0:1);

    if(inputFechaEventoAcSub == null || hora.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe completar la fecha y hora del evento.</label>";
    }else if(parseInt(getSession("gestopcompanyid")) == 336 && trabajadorReporta == -1){
        campoVacio = false;mensajeUx = "<label>Debe completar el campo 'Trabajador reporta'.</label>";
    }else if(unidadId == -1 || divisionId == -1 || areaId == -1){
        campoVacio = false;mensajeUx = "<label>Debe completar los campos '"+(getSession("gestopunidad") != null?getSession("gestopunidad"):"Unidad")+"', " +
            "'"+(getSession("gestopdivision") != null?getSession("gestopdivision"):"División")+"' y '"+(getSession("gestoparea") != null?getSession("gestoparea"):"Área")+"'.</label>";
    }else if(descripcion.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe completar el campo '"+textDescripcionAcSub+"'.</label>";
    }else if(parseInt(getSession("gestopcompanyid")) != 336 && lugar.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe completar el campo 'lugar exacto del evento'.</label>";
    }else if(![336,500].includes(parseInt(getSession("gestopcompanyid"))) && (corrInmediata.length == 0 || lugar.length == 0)){
        campoVacio = false;mensajeUx = "<label>Debe completar el campo '"+textCorreccionAcSub+"'.</label>";
    }else if(evidenciaNombre == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
    }

    if(campoVacio){
        var dataParam={
            acInseguroId:acSubestandarId,reporteFecha:inputFechaEventoAcSub,hora:hora,horaPlanificada:hora,trabajadorId:trabajadorReporta,
            matrixId:unidadId,areaId:areaId,acInseguroNombre:descripcion,reporteLugar:lugar,acInseguroTipoId:selActTipo,factorRiesgo:{id:factorRiesgoId},
            peligroAc:{id:peligroAcId},acInseguroCausaId:causaId,detalleCausa:detalleCausa,tiposContacto:[{id:subTipoContactoId}],nivelRiesgoId:nivelId,
            reporteAccion:corrInmediata,trabajadorObservado:trabajadorObservado,trabajadorQueReporta:trabajadorQueReporta,origen:{id:3},
            tipoLugar:{id:(parseInt(getSession("areaGosstId")) == areaId?1:2)},reporteTipo:1,reporteNombre:getSession("gestopusername"),
            trabajadorRegistraId:getSession("trabajadorGosstId"),trabajadores:[],evidenciaNombre:evidenciaNombre,existeEvidencia:existe,
        };

        callAjaxPostSimpleVersionDos(1,URL+'/acinseguro/save/version_dos',dataParam,1,0,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    guardarEvidenciaAutoVersionTres(1,data.idNuevo,"fileEviEventoSub",bitsEvidenciaActoInseguro,0,1,
                    "/acinseguro/evidencia/save",function(){
                        $("#modalRegistroAcSubestandar").modal("hide");

                        mensajeUx = "<label>El reporte A/C Subestándar se registró correctamente*." +
                            "<br><br>*Se envío el correo respectivo a los responsables del área.</label>";
                        mensajesUx(mensajeUx,1,"","ActualizarAcSubestVistaCol");

                        $("#modalMensajeUxActualizarAcSubestVistaCol").on("hidden.bs.modal", function () {
                            habilitarReporteEventoUsuarioVersionDos();
                        });
                    },"acInseguroId");

                    break;

                default:
                    alert("Ocurrió un error al guardar el reporte A/C Subestándar.");

                    break;
            }
        });
    }else{
        $("#modalRegistroAcSubestandar").modal("hide");

        mensajesUx(mensajeUx,2,"","ValidacionAcSubestVistaCol");

        $("#modalMensajeUxValidacionAcSubestVistaCol").on("hidden.bs.modal",function(){
            $("#modalRegistroAcSubestandar").modal("show");
        });
    }
}

var accionMejoraAcSubId,indexAccionMejoraAcSub,objAccionMejoraAcSub = {};
var listAccionesMejoraAcSub = [],listClasificacionesAccMejAcSub = [];

function toggleMenuOpcionAccionMejoraAcSub(obj,pindex){
    objAccionMejoraAcSub = listAccionesMejoraAcSub[pindex];indexAccionMejoraAcSub = pindex;

    if(!$(obj).parent().parent().parent(".eventoGeneral").find("ul").is(":visible")){
        $(".listaFinalGestionGosst").hide();
    }

    $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
}

var funcionalidadesAccionMejoraAcSub=[
    {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
     functionClick:function(data){registroAccionMejoraAcSub(1)}},
    {id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
     functionClick:function(data){eliminarAccionMejoraAcSub()}}
];

function marcarSubOpcionAccionMejoraAcSub(pindex){
    funcionalidadesAccionMejoraAcSub[pindex].functionClick();
    $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalAccionMejoraAcSub(){
    $("#modalPrincipalAccionMejoraAcSub").modal("hide");

    if(actualizarPrincipalAcSub == 1){
        habilitarReporteEventoUsuarioVersionDos();
    }
}

function verAccionMejoraAcSub(){
    $("#modalPrincipalAccionMejoraAcSub").remove();

    actualizarPrincipalAcSub = 0;

    var listModal={
        id:"modalPrincipalAccionMejoraAcSub",nombre:"Acciones de mejora (AC-CÓDIGO #"+acSubestandarObj.codigo+")",
        contenido:"<div id='estadoMovilPrincipalAccionMejoraAcSub'></div>",btnCerrarHabilitado:0
    };

    crearModalPrincipalUsuario(listModal,function(){},true,true);

    cargarAccionMejoraAcSub();
}

function cargarAccionMejoraAcSub(){
    $("#estadoMovilPrincipalAccionMejoraAcSub").html("");

    var dataParam={
        eventoInseguroId:acSubestandarObj.acInseguroId,accionMejoraTipoId:2,empresaId:parseInt(getSession("gestopcompanyid")),
        areaId:acSubestandarObj.areaId
    };

    callAjaxPostSimpleVersionDos(1,URL+'/gestionaccionmejora/accionmejora/ac_subestandar/vista_colaborador',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
            var listPanelesPrincipal = [];
            var textTotalRegistros= "";

            listAccionesMejoraAcSub = data.list;listClasificacionesAccMejAcSub = data.clasificacion;listTrabajadores = data.listTrabajadores;
            areaResponsablesAux = data.areaResponsables;

            listAccionesMejoraAcSub.forEach(function(val,index){
                var btnOpcion="",menuOpcion="";

                menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
                    funcionalidadesAccionMejoraAcSub.forEach(function(val1,index1){
                        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionAccionMejoraAcSub("+index1+")'>"+val1.nombre+"</li>";
                    });
                menuOpcion += "</ul>";

                btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionAccionMejoraAcSub(this,"+index+")'>" +
                                "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
                            "</a>";

                var evidenciaNombre = (val.evidenciaNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
                    "href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.accionMejoraId+"'>"+val.evidenciaNombre+"</a>");

                var listTotal=[
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Clasificación:",inputForm:val.clasificacion.nombre+btnOpcion+menuOpcion},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
                ];

                if(val.descripcion.trim().length > 0){
                    listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-eye'></i> Descripción:",inputForm:""},
                        {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.descripcion,styleAux:"word-break:break-all;"});
                }else{
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-eye'></i> Descripción:",inputForm:"------"});
                }

                if(val.observacion.trim().length > 0){
                    listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-exclamation-circle'></i> Observación:",inputForm:""},
                        {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.observacion,styleAux:"word-break:break-all;"});
                }else{
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Observación:",inputForm:"------"});
                }

                listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-user'></i> Responsable:",inputForm:(val.responsableNombre.length == 0?"------":val.responsableNombre)},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha planificada:",inputForm:(val.fechaRevisionTexto.length == 0?"------":val.fechaRevisionTexto)});

                if(val.fechaRealTexto.length > 0){
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha realizada:",inputForm:val.fechaRealTexto});
                }

                listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Evidencia de cumplimiento:",inputForm:evidenciaNombre});

                listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                    {sugerencia:(val.estadoId == 2?"":"<br><strong>*Para cambiar a 'Completado', debe subir la evidencia respectiva.</strong>"),
                     label:"<i class='fa fa-bookmark'></i> Estado: ",inputForm:(val.estadoId == 2?"<span style='color:#9BBB59;font-size:16px;font-weight:bolder;'>Completado</span>":
                     "<span style='color:#c5c54b;font-size:16px;font-weight:bolder;'>Pendiente*</span>"),divContainer:""});

                if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
                }

                if(val.fechaRegistroTexto.length > 0){
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
                        inputForm:val.fechaRegistroTexto+(val.registradoPor.length == 0?"":"<br>(Por "+val.registradoPor+")")});
                }

                if(val.fechaActualizacionTexto.length > 0){
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
                        inputForm:val.fechaActualizacionTexto+(val.actualizadoPor.length == 0?"":"<br>(Por "+val.actualizadoPor+")")});
                }

                var estiloGosst = (val.estadoId == 2?"gosst-aprobado":"gosst-advertencia");

                textTotalRegistros += "<div class='eventoGeneral "+estiloGosst+"'>" +
                                          "<form class='eventoGeneral'>";
                listTotal.forEach(function(val,index){
                    textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
                });
                textTotalRegistros +=     "</form>" +
                                      "</div>";
            });

            listPanelesPrincipal.push({id:"volverAcSubestandarAccionMejora",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalAccionMejoraAcSub()",
                 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""},
                {id:"nuevoRegAccionMejoraAcSub",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroAccionMejoraAcSub(0)",
                 btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar acción correctiva",contenido:""},
                {id:"registroAccionMejoraAcSub",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
                 btnIconoAux:"",btnTitleAux:"",nombre:"Acciones correctivas registradas ("+listAccionesMejoraAcSub.length+")",contenido:textTotalRegistros});

            agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalAccionMejoraAcSub");

            $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();

            if(listAccionesMejoraAcSub.length == 0){
                registroAccionMejoraAcSub(0);
            }
        }else{
            console.log("NOPNPO")
        }
    });
}

function ocultarRegistroAccionMejoraAcSub(){
    $("#modalRegistroAccionMejoraAcSub").modal("hide");

    if(listAccionesMejoraAcSub.length > 0){
        $("#modalPrincipalAccionMejoraAcSub").modal("show");
    }
}

function registroAccionMejoraAcSub(opcRegistro){
    var opcionRegistro = parseInt(opcRegistro);

    $("#modalPrincipalAccionMejoraAcSub").modal("hide");$("#modalRegistroAccionMejoraAcSub").remove();

    accionMejoraAcSubId = (opcionRegistro == 0?0:objAccionMejoraAcSub.accionMejoraId);

    var selClasificacionAccMejAcSub = crearSelectOneMenu("selClasificacionAccMejAcSub","",
        listClasificacionesAccMejAcSub,(accionMejoraAcSubId == 0?"-1":objAccionMejoraAcSub.clasificacion.id),"id","nombre");

    var contenido = "";

    var listContenido=[
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Clasificación",inputForm:selClasificacionAccMejAcSub},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción",inputForm:""},
        {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='4' id='textDescAccMejAcSub'></textarea>"},
        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observación",inputForm:""},
        {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='4' id='textObsAccMejAcSub'></textarea>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha planificada",inputForm:"<input id='inputFechaRevAccMejAcSub' type='date' class='form-control'>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia de cumplimiento",inputForm:"",divContainer:"divEviCumplimientoAccMejAcSub"}
    ];

    if(opcionRegistro == 0){
        var hasResponsableArea = (areaResponsablesAux.supervisores.length != 0 || areaResponsablesAux.jefes.length != 0 && areaResponsablesAux.gerentes.length != 0?1:0);

        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-info-circle'></i> Área:",
             inputForm:"<label>"+areaResponsablesAux.areaName+"</label>"+(hasResponsableArea == 1?"<br><a id='idAreaResponsablesAux' style='color:black;float:right;' class='efectoLink'></a>":"")},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});

        if(hasResponsableArea == 1){
            if(areaResponsablesAux.supervisores.length != 0){
                listContenido.push({sugerencia:"",clase:"responsable-area-info",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                    label:"Supervisores:"+"<br>"+"<div style='background:#E4DCDC;'>"+areaResponsablesAux.supervisores.replace(/-/gi,"<br>")+"</div>",inputForm:""});
            }

            if(areaResponsablesAux.jefes.length != 0){
                listContenido.push({sugerencia:"",clase:"responsable-area-info",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                    label:"Jefes:"+"<br>"+"<div style='background:#E4DCDC;'>"+areaResponsablesAux.jefes.replace(/-/gi,"<br>")+"</div>",inputForm:""});
            }

            if(areaResponsablesAux.gerentes.length != 0){
                listContenido.push({sugerencia:"",clase:"responsable-area-info",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                    label:"Gerentes:"+"<br>"+"<div style='background:#E4DCDC;'>"+areaResponsablesAux.gerentes.replace(/-/gi,"<br>")+"</div>",inputForm:""});
            }

            listContenido.push({sugerencia:"",clase:"responsable-area-info",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
        }

        if(numSeccionInteresadaAC > 0){
            listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Responsable",
                 inputForm:"<input class='form-control' type='text' id='inputIngresarDniNombreTrabAccMejAcSub'>" +
                           "<div id='divSelAutoTrabPorNombreAccMejAcSub'></div>" +
                           "<label>*Buscar trabajador por N° de documento y/o nombre (debe ingresar 3 caracteres como mínimo).</label>"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
        }

        listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-users'></i> Personal interesado",inputForm:"",divContainer:"divPersonalInteresadoAC"});
    }

    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Estado actual:",inputForm:"",divContainer:"divEstadoActualAccMejAcSub"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroAccionMejoraAcSub()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroAccionMejoraAcSub()'>" +
                       "<i class='fa fa-floppy-o'></i> Guardar" +
                   "</button>"});

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalRegistroAccionMejoraAcSub",nombre:"<i class='fa fa-pencil-square-o'></i> Registro acción de mejora",
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>",btnCerrarHabilitado:0
    };

    crearModalPrincipalUsuario(modalOptions,function(){
        if($("#selMulPersonalInteresadoAC").length > 0){
            return;
        }

        crearSelectOneMenuObligMultipleCompleto("selMulPersonalInteresadoAC","",listTrabajadores,"trabajadorId",
            "trabajadorNombre","#divPersonalInteresadoAC","Todos");
    },true,true);

    if(opcionRegistro == 1){
        $("#textDescAccMejAcSub").val(objAccionMejoraAcSub.descripcion);$("#textObsAccMejAcSub").val(objAccionMejoraAcSub.observacion);
        $("#inputFechaRevAccMejAcSub").val(convertirFechaInput(objAccionMejoraAcSub.fechaRevision));
    }

    var options={
        container:"#divEviCumplimientoAccMejAcSub",functionCall:function(){
            validacionSubirEvidencia("CumpliAccMejAcSub",bitsEvidenciaEscenarioAccidente,"modalRegistroAccionMejoraAcSub");calcularEstadoActualAccMejAcSub();
        },descargaUrl:"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+accionMejoraAcSubId,
        esNuevo:(opcionRegistro == 0 || objAccionMejoraAcSub.evidenciaNombre.length == 0?true:false),
        idAux:"CumpliAccMejAcSub",evidenciaNombre:(opcionRegistro == 0?"":objAccionMejoraAcSub.evidenciaNombre),
        mensajeAux:"*Al subir la evidencia, el estado de la acción de mejora cambiará de 'Pendiente' a 'Completado'."
    };

    crearFormEvidenciaCompleta(options);

    if(opcionRegistro == 0 && numSeccionInteresadaAC > 0){
        buscarResponsableAccMejAcSub();
    }

    calcularEstadoActualAccMejAcSub();

    if(opcionRegistro == 0 && hasResponsableArea == 1){
        ocultarDetalleInformacionAsociada("idAreaResponsablesAux","responsable-area-info");
    }
}

var listResponsablesAccMejAcSub=[];

function buscarResponsableAccMejAcSub(){
    var nombre = $("#inputIngresarDniNombreTrabAccMejAcSub").val().trim();

    if(nombre.length >= 3){
        var dataParam={
            trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid")),isBuscador:1
        };

        callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
            listResponsablesAccMejAcSub = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"No encontrado"}]:data.trabajadores);

            var selResponsableAccMejAcSub = crearSelectOneMenuOblig("selResponsableAccMejAcSub","",
                listResponsablesAccMejAcSub,"","trabajadorId","nombre");

            $("#divSelAutoTrabPorNombreAccMejAcSub").html(selResponsableAccMejAcSub);
            $("#inputIngresarDniNombreTrabAccMejAcSub").attr("onkeyup","buscarResponsableAccMejAcSub()");
        });
    }else{
        listResponsablesAccMejAcSub = [{trabajadorId:-1,nombre:"No encontrado"}];

        var selResponsableAccMejAcSub = crearSelectOneMenuOblig("selResponsableAccMejAcSub","",
            listResponsablesAccMejAcSub,"","trabajadorId","nombre");

        $("#divSelAutoTrabPorNombreAccMejAcSub").html(selResponsableAccMejAcSub);
        $("#inputIngresarDniNombreTrabAccMejAcSub").attr("onkeyup","buscarResponsableAccMejAcSub()");
    }
}

function calcularEstadoActualAccMejAcSub(){
    var nombreEvidencia = $("#inputEviCumpliAccMejAcSub").val();

    if(nombreEvidencia.length == 0){
        $("#divEstadoActualAccMejAcSub").html("<strong style='color:#D1D619;'>Pendiente</strong>");
    }else{
        $("#divEstadoActualAccMejAcSub").html("<strong style='color:blue;'>Completado</strong>");
    }
}

function guardarRegistroAccionMejoraAcSub() {
    var campoVacio = true;

    var clasificacionId = $("#selClasificacionAccMejAcSub").val();
    var descripcion = $("#textDescAccMejAcSub").val().trim();
    var observacion = $("#textObsAccMejAcSub").val().trim();
    var fechaRevisionAcSub = convertirFechaTexto($("#inputFechaRevAccMejAcSub").val());
    var inputFechaRevisionAcSub = (!fechaRevisionAcSub?null:fechaRevisionAcSub);
    var evidenciaNombre = $("#inputEviCumpliAccMejAcSub").val();

    var trabajadorResponsableId = (accionMejoraAcSubId == 0?(numSeccionInteresadaAC > 0?parseInt($("#selResponsableAccMejAcSub").val()):
        parseInt(getSession("trabajadorGosstId"))):null);

    var listPersonalInteresadoId = [];

    if(accionMejoraAcSubId == 0){
        var personalInteresadoId = $("#selMulPersonalInteresadoAC").val();

        if(personalInteresadoId != null){
            personalInteresadoId.forEach(function(val){
                if(parseInt(val) != trabajadorResponsableId){
                    listPersonalInteresadoId.push(parseInt(val));
                }
            });
        }
    }

    if(clasificacionId == -1){
        campoVacio = false;mensajeUx = "<label>Debe completar el campo 'clasificación'.</label>";
    }else if(descripcion.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe completar el campo 'descripción'.</label>";
    }else if(inputFechaRevisionAcSub == null){
        campoVacio = false;mensajeUx = "<label>Debe introducir la fecha planificada.</label>";
    }else if(evidenciaNombre == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
    }else if(accionMejoraAcSubId == 0 && numSeccionInteresadaAC > 0 && trabajadorResponsableId == -1){
        campoVacio = false;mensajeUx = "<label>Debe seleccionar al responsable.</label>";
    }

    if(campoVacio){
        var dataParam={
            accionMejoraId:accionMejoraAcSubId,eventoInseguroId:acSubestandarObj.acInseguroId,clasificacion:{id:clasificacionId},
            descripcion:descripcion,observacion:observacion,fechaRevision:inputFechaRevisionAcSub,responsableNombre:"",responsableMail:"",
            estadoId:1,inversionAccion:0,accionMejoraTipoId:2,horaPlanificada:"13:00:00",trabajadorResponsableId:trabajadorResponsableId,
            listPersonalInteresadoId:(listPersonalInteresadoId.length == 0?null:listPersonalInteresadoId),trabajadorId:parseInt(getSession("trabajadorGosstId"))
        };

        callAjaxPostSimpleVersionDos(1,URL+'/gestionaccionmejora/accionmejora/save',dataParam,1,0,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    guardarEvidenciaAutoVersionTres(1,data.nuevoId,"fileEviCumpliAccMejAcSub",bitsEvidenciaEscenarioAccidente,0,1,
                    "/gestionaccionmejora/accionmejora/evidencia/save",function(){
                        $("#modalRegistroAccionMejoraAcSub").modal("hide");

                        mensajeUx = "<label>El registro acción de mejora se guardó correctamente</label>";
                        mensajesUx(mensajeUx,1,"","VistaTraEventoInseguro");

                        $("#modalMensajeUxVistaTraEventoInseguro").on("hidden.bs.modal",function(){
                            $("#modalPrincipalAccionMejoraAcSub").modal("show");actualizarPrincipalAcSub = 1;
                            cargarAccionMejoraAcSub();
                        });
                    },"accionMejoraId");

                    break;

                default:
                    alert("Ocurrió un error al guardar!");
            }
        });
    }else{
        $("#modalRegistroAccionMejoraAcSub").modal("hide");
        mensajesUx(mensajeUx,2,"","AcSubValidacionVistaCol");

        $("#modalMensajeUxAcSubValidacionVistaCol").on("hidden.bs.modal",function(){
            $("#modalRegistroAccionMejoraAcSub").modal("show");
        });
    }
}

function eliminarAccionMejoraAcSub(){
    $("#modalPrincipalAccionMejoraAcSub").modal("hide");

    mensajeUx="<label>¿Está seguro de eliminar este registro acción de mejora?</label>";
    mensajesUx(mensajeUx,3,"","EliminarAccMejAcSubVistaCol");

    $("#btnDevolverValorEliminarAccMejAcSubVistaCol").on("click",function(){
        var dataParam={
            accionMejoraId:objAccionMejoraAcSub.accionMejoraId,eventoInseguroId:acSubestandarObj.acInseguroId
        };

        callAjaxPost(URL+'/gestionaccionmejora/accionmejora/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    mensajeUx="<label>El registro acción de mejora fue eliminado con éxito.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarAccMejAcSubVistaCol");

                    $("#modalMensajeUxActualizarAccMejAcSubVistaCol").on("hidden.bs.modal",function(){
                        $("#modalPrincipalAccionMejoraAcSub").modal("show");actualizarPrincipalAcSub = 1;
                        cargarAccionMejoraAcSub();
                    });

                    break;

                default:
                    alert("Ocurrió un error al eliminar este registro acción de mejora!");
            }
        });
    });

    $("#btnRegresarPrevioEliminarAccMejAcSubVistaCol").on("click",function(){
        $("#modalPrincipalAccionMejoraAcSub").modal("show");
    });
}

function marcarRevisadoACSubestandarSinAccionMejoraVersionDos(){
    mensajeUx = "<label>¿Está seguro de marcar como revisado este A/C Subestándar? " +
        "(no requiere acción de mejora)</label>";
    mensajesUx(mensajeUx,3,"","VistaRevACSubSinAccMej");

    $("#btnDevolverValorVistaRevACSubSinAccMej").on("click",function(){
        var dataParam={
            acInseguroId:acSubestandarObj.acInseguroId,sinAccionMejora:1
        };

        callAjaxPost(URL+'/acinseguro/sinaccionmejora/save',dataParam,function(data){
            mensajeUx = "<label>La A/C Subestándar (que no requiere acción de mejora) ha sido marcada " +
                "como revisado con éxito.</label>";
            mensajesUx(mensajeUx,1,"","ActualizarVistaEveInsSinAccMej");

            $("#modalMensajeUxActualizarVistaEveInsSinAccMej").on("hidden.bs.modal",function(){
                habilitarReporteEventoUsuarioVersionDos();
            });
        });
    });
}

function ocultarAnularEventoInseguroAcColaborador(){
    $("#modalAnularEventoAcColab").modal("hide");
}

function verAnularEventoInseguroAcColaborador(){
    $("#modalAnularEventoAcColab").remove();

    var listItems=[
        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Motivo",inputForm:""},
        {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='4' id='textMotivoAnularAcSub'></textarea>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",
         label:"<button class='btn btn-danger' style='font-size:18px;' type='button' onclick='ocultarAnularEventoInseguroAcColaborador()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarAnularEventoInseguroAcColaborador()'>" +
                       "<i class='fa fa-floppy-o'></i> Guardar" +
                   "</button>"}
    ];

    var textForm = "";

    listItems.forEach(function(val,index){
        textForm += obtenerSubPanelModuloVersionDos(val);
    });

    var opciones={
        id:"modalAnularEventoAcColab",nombre:"<i class='fa fa-trash'></i> Calificar reporte como no válido",
        contenido:"<div class='eventoGeneral'>"+textForm+"</div>"
    };

    crearModalPrincipalUsuario(opciones,function(){},true,true);
}

function guardarAnularEventoInseguroAcColaborador(){
    var campoVacio = true;

    var motivo = $("#textMotivoAnularAcSub").val().trim();

    if(motivo.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe registrar el motivo.</label>";
    }

    if(campoVacio){
        var dataParam={
            acInseguroId:acSubestandarObj.acInseguroId,motivoValido:motivo
        };

        callAjaxPost(URL+'/acinseguro/valido/save',dataParam,function(data){
            $("#modalAnularEventoAcColab").modal("hide");

            mensajeUx = "<label>El reporte A/C Subestándar seleccionado se marcó como no válido.</label>";
            mensajesUx(mensajeUx,1,"","ActualizarAcSubestVistaCol");

            $("#modalMensajeUxActualizarAcSubestVistaCol").on("hidden.bs.modal",function(){
                habilitarReporteEventoUsuarioVersionDos();
            });
        });

    }else{
        $("#modalAnularEventoAcColab").modal("hide");
        mensajesUx(mensajeUx,2,"","AcSubValidacionVistaCol");

        $("#modalMensajeUxAcSubValidacionVistaCol").on("hidden.bs.modal",function(){
            $("#modalAnularEventoAcColab").modal("show");
        });
    }
}

function ocultarSubirConstanciaEventoInseguroColaborador(){
   $("#modalSubirConstanciaEventInseg").modal("hide");
}

function verSubirConstanciaEventoInseguroColaborador(){
   $("#modalSubirConstanciaEventInseg").remove();
  
   eventoColaboradorObj = listFullEventosColaborador[indexEventoColaborador];
   
   var textPlantilla = 
      "<a class='efectoLink' href='"+URL+"/acinseguro/plantilla_constancia_registro?" +
         "acInseguroId="+eventoColaboradorObj.acInseguroId+"&codigo="+eventoColaboradorObj.codigo+"' target='_blank'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>";

   var listItems=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Plantilla",inputForm:textPlantilla,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},            
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Observaciones preventivas de seguridad (OPS)",inputForm:"",divContainer:"divEviConstanciaRegistro"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
                     "onclick='ocultarSubirConstanciaEventoInseguroColaborador()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
	  		 "onclick='subirConstanciaEventoInseguroColaborador()'>" +
	            "<i class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"}
   ];

   var textForm = "";

   listItems.forEach(function(val,index){
      textForm += obtenerSubPanelModuloVersionDos(val);
   });

   var opciones={
      id:"modalSubirConstanciaEventInseg",nombre:"<i class='fa fa-upload'></i> Subir Observaciones preventivas de seguridad (OPS)",
      contenido:"<div class='eventoGeneral'>"+textForm+"</div>"
   };

   crearModalPrincipalUsuario(opciones,function(){},true,true);

   var options={
      container:"#divEviConstanciaRegistro",functionCall:function(){
         validacionSubirEvidencia("ConstRegEventInseg",bitsEvidenciaActoInseguro,"modalSubirConstanciaEventInseg");
      },descargaUrl:"/acinseguro/amazon_s3/evidencia_constancia_registro?acInseguroId="+eventoColaboradorObj.acInseguroId,
      esNuevo:(eventoColaboradorObj.evidenciaConstanciaRegistroNombre.length == 0?true:false),idAux:"ConstRegEventInseg",
      evidenciaNombre:eventoColaboradorObj.evidenciaConstanciaRegistroNombre
   };

   crearFormEvidenciaCompleta(options);
}

function subirConstanciaEventoInseguroColaborador(){
   var campoVacio = true;
    
   var inputEviConstancia = $("#inputEviConstRegEventInseg").val();
    
   if(inputEviConstancia.length == 0){
      mensajeUx = "<label>Debe subir la evidencia.</label>";
      campoVacio = false; 
   }else if(inputEviConstancia == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
      campoVacio = false;
   }
   
   if(campoVacio){
      guardarEvidenciaAutoVersionS3(1,eventoColaboradorObj.acInseguroId,"fileEviConstRegEventInseg",bitsEvidenciaActoInseguro,1,1,
      "/acinseguro/amazon_s3/evidencia_constancia_registro/save","event-inseguro/evidencia-constancia-registro",function(){
	 $("#modalSubirConstanciaEventInseg").modal("hide");
	  
         mensajeUx="<label>La Observaciones preventivas de seguridad (OPS) fue guardada correctamente.</label>";
 	 mensajesUx(mensajeUx,1,"","ActualizarAcSubestVistaCol"); 
 								   
 	 $("#modalMensajeUxActualizarAcSubestVistaCol").on("hidden.bs.modal",function(){
 	    habilitarReporteEventoUsuario();  
 	 });
      });
   }else{
      mensajesUx(mensajeUx,2,"","");
   }    
}

function verQuicksightActos(){
    $("#wrapperConsolidadoActosResponsable").remove();
    $(".divContainerGeneral").hide();

    var buttonVolver = "<button type='button' id='btnVolverDetalle' class='btn btn-success' style='margin-right:10px' onclick='volverVistaActos()'>" +
                           "<i class='fa fa-sign-out fa-rotate-180'></i>Volver" +
                       "</button>";

    $("body").append("<div id='divActoResponsableTabla' style='padding-left:40px;'>" +
            "<form class='form-inline' id='formBtnGeneral'>"+buttonVolver+"</form>" +
            "<div class='container-fluid' id='divContainQuicksightActos' style='padding-right:40px;padding-left:0px;'></div>" +
        "</div>");

    tituloAnteriorColaborador = $(".divTituloGeneral h4").text();
    $(".divTituloGeneral h4").html("Análizar datos de Actos/Condiciones");

    cargarQuicksightActos();
}

function cargarQuicksightActos() {
    // Mostrar mensaje de carga
    $('#divContainQuicksightActos').html('<div class="loading">Cargando...</div>');

    var dataParam={
        idEmpresa:getSession("gestopcompanyid"),idTrabajador:getSession("trabajadorGosstId")
    };

    callAjaxPost(URL+'/quicksight/acto-condicion',dataParam,function(data){
        if(data.CODE_RESPONSE === "05"){
            // Definir la URL del contenido que deseas mostrar en el iframe
            var urlDelIframe = data.embedUrl;

            // Crear el elemento iframe y configurar sus propiedades
            var $iframe = $('<iframe>',{
                src:urlDelIframe,
                width:'100%',
                height:'750px', // Ajusta esto según tus necesidades
                frameborder:'0',
                css:{
                    border:'none' // Opcional: Añadir estilos adicionales si es necesario
                }
            }).on('load',function(){
                // Eliminar el mensaje de carga una vez que el iframe se haya cargado
                $('.loading').remove();
                console.log('El contenido de QuickSight ha terminado de cargar.');
            });

            // Limpiar el contenedor y añadir el iframe
            $('#divContainQuicksightActos').empty().append($iframe);
        }else{
            console.log("No se pudieron cargar los datos de la huella de carbono.");
            // Actualizar el contenedor para mostrar un mensaje de error o quitar el mensaje de carga
            $('#divContainQuicksightActos').html('<div class="error">Error al cargar los datos.</div>');
        }
    });
}

var listOpcConsolidadosAc=[
   {id:1,nombre:"Reporte de Actos y Condiciones Subestándar"}
];

function ocultarOpcionesConsolidadosAc(){
   $("#modalOpcConsolidadosAc").modal("hide");
}

function verOpcionesConsolidadosAc(){
   $("#modalOpcConsolidadosAc").remove();
   
   var selOpcConExcelAc = crearSelectOneMenuOblig("selOpcConExcelAc",
      "verAcordeConsolidadosAc()",listOpcConsolidadosAc,"1","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Opción",inputForm:selOpcConExcelAc,divContainer:"divSelOpcConAc"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarOpcionesConsolidadosAc()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='descargarConsolidadosExcelAc()'>" +
                    "<i class='fa fa-download'></i> Descargar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions = {
      id:"modalOpcConsolidadosAc",nombre:"<i class='fa fa-list'></i> Seleccionar - Consolidado excel",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordeConsolidadosAc();
}

function verAcordeConsolidadosAc(){
    $(".atributo-consolidadoExcelAc").remove();
    var listContenidoDivSelConExcelAc = [];
    var opcConsolidadoExcel = parseInt($("#selOpcConExcelAc").val());
   
    if([1].includes(opcConsolidadoExcel)){
        var selVisualizacionOpcAcExcel = crearSelectOneMenuOblig("selVisualizacionOpcAcExcel",
            "",listVisualizarOpcionesAc,(numAreasResponsable == 0?1:0),"id","nombre");

        listContenidoDivSelConExcelAc=[
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",
             inputForm:"<input type='date' id='fechaInicioOpcConAc' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",
             inputForm:"<input type='date' id='fechaFinOpcConAc' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Visualizar",inputForm:selVisualizacionOpcAcExcel}
        ];

        if(parseInt(getSession("gestopcompanyid")) != 336){
            listContenidoDivSelConExcelAc.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",label:"Estado del reporte",inputForm:"",divContainer:"divEstadoReporteAcExcel"});
        }

        listContenidoDivSelConExcelAc.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestopunidad") != null?getSession("gestopunidad"):"Unidad"),inputForm:"",divContainer:"divUnidadExcel"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestopdivision") != null?getSession("gestopdivision"):"División"),inputForm:"",divContainer:"divDivisionExcel"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestoparea") != null?getSession("gestoparea"):"Área"),inputForm:"",divContainer:"divAreaExcel"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Riesgos asociados",inputForm:"",divContainer:"divSubTipoContactoExcel"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo",inputForm:"",divContainer:"divTipoAcExcel"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Causas inmediatas",inputForm:"",divContainer:"divCausaAcExcel"});
      
        if(parseInt(getSession("gestopcompanyid")) != 336){
	        var listBooleanSiNo = listBoolean.sort(function(val,val2){
	            return val2.id - val.id;
	        });

	        var selHasEvidenciaAc = crearSelectOneMenuOblig("selHasEvidenciaAc","",
	            listBooleanSiNo,0,"id","nombre");
	  
	        listContenidoDivSelConExcelAc.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	            {sugerencia:"",label:"¿Incluir las evidencias?",inputForm:selHasEvidenciaAc,divContainer:""});
        }
    }
  
    var contenido = "";
   
    listContenidoDivSelConExcelAc.forEach(function(val){
        val.clase = "atributo-consolidadoExcelAc";
        contenido += obtenerSubPanelModuloVersionDos(val);
    });
   
    $("#divSelOpcConAc").parent().after(contenido);
   
    if([1].includes(opcConsolidadoExcel)){
        var hoy = getSession("fechaHoyOrdenInversoTexto");
       
        $("#fechaInicioOpcConAc").val(sumaFechaDias(-180,hoy));$("#fechaFinOpcConAc").val(hoy);

        crearSelectOneMenuObligMultipleCompleto("selMulUnidadesAcExcel","filtrarValoresDivisionesAcSubExcel()",
            listUnidadesFiltroConsolidado,"id","nombre","#divUnidadExcel","Todos");

        crearSelectOneMenuObligMultipleCompleto("selMulEstadoActualAcExcel","",
            listEstadoEventInseguroFiltroConsolidado,"id","nombre","#divEstadoReporteAcExcel","Todos");

        crearSelectOneMenuObligMultipleCompleto("selMulSubTipoContactoActoAcExcel","",
            listTipoContactoFiltroConsolidado,"id","nombre","#divSubTipoContactoExcel","Todos");

        crearSelectOneMenuObligMultipleCompleto("selMulTipoActoAcExcel","",listActInsegTipoFiltroConsolidado,
            "id","nombre","#divTipoAcExcel","Todos");

        crearSelectOneMenuObligMultipleCompleto("selMulCausaActoAcExcel","",listCausaInmediataSimpleFiltroConsolidado,
            "id","nombre","#divCausaAcExcel","Todos");

        filtrarValoresDivisionesAcSubExcel();
    }
}

function filtrarValoresDivisionesAcSubExcel(){
    var listMultiUnidades = $("#selMulUnidadesAcExcel").val();
    var listDivisionAux = [];

    if(listMultiUnidades != null){
        listMultiUnidades.forEach(function(val,index){
            listDivisionesFiltroConsolidado.forEach(function(val1,index){
                if(parseInt(val) == val1.matrixId){
                    listDivisionAux.push(val1);
                }
            });
        });

        if(listDivisionAux.length > 0){
            crearSelectOneMenuObligMultipleCompleto("selMulDivisionesAcExcel","filtrarValoresAreasAcSubExcel()",
                listDivisionAux,"divisionId","nombreAuxiliar","#divDivisionExcel","Todos");

            filtrarValoresAreasAcSubExcel();
        }else{
            $("#divDivisionExcel").html("<label>*Sin divisiones registradas</label>");
            $("#divAreaExcel").html("<label>*Debe seleccionar al menos una división.</label>");
        }
    }else{
        $("#divDivisionExcel").html("<label>*Debe seleccionar al menos una unidad.</label>");
        $("#divAreaExcel").html("<label>*Debe seleccionar al menos una división.</label>");
    }
}

function filtrarValoresAreasAcSubExcel(){
    var listMultiDivisiones = $("#selMulDivisionesAcExcel").val();
    var listAreaAux = [];

    if(listMultiDivisiones != null){
        listMultiDivisiones.forEach(function(val,index){
            listAreasFiltroConsolidado.forEach(function(val1,index){
                if(parseInt(val) == val1.divisionId){
                    listAreaAux.push(val1);
                }
            });
        });

        if(listAreaAux.length > 0){
            crearSelectOneMenuObligMultipleCompleto("selMulAreasAcExcel","",listAreaAux,
                "areaId","nombreAuxiliar","#divAreaExcel","Todos");
        }else{
            $("#divAreaExcel").html("<label>*Sin áreas registradas</label>");
        }
    }else{
        $("#divAreaExcel").html("<label>*Debe seleccionar al menos una división.</label>");
    }
}

function descargarConsolidadosExcelAc(){
    var campoVacio = true;
    
    var opcConsolidadoExcel = parseInt($("#selOpcConExcelAc").val());
    var fechaInicioConsolidado = $("#fechaInicioOpcConAc").val();
    var fechaFinConsolidado = $("#fechaFinOpcConAc").val();
     
    if([1].includes(opcConsolidadoExcel)){
        if(fechaInicioConsolidado.length == 0 || fechaFinConsolidado.length == 0){
 	        campoVacio = false;mensajeUx = "<label>Debe ingresar la fecha inicio y la fecha fin.</label>";
        }
    }
     
    if(campoVacio){
        var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
        var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);
      
        if([1].includes(opcConsolidadoExcel)){
            var valUnidades = "",valDivisiones = "",valAreas = "",valEstados = "",valRiesgos = "",
                valTiposAc = "",valCausas = "";

            var listMultiUnidades = $("#selMulUnidadesAcExcel").val();

            if(listMultiUnidades != null){
                listMultiUnidades.forEach(function(val,index){
                    valUnidades += (valUnidades.length == 0?val:","+val);
                });
            }

            var listMultiDivisiones = $("#selMulDivisionesAcExcel").val();

            if(listMultiDivisiones != null){
                listMultiDivisiones.forEach(function(val,index){
                    valDivisiones += (valDivisiones.length == 0?val:","+val);
                });
            }

            var listMultiAreas = $("#selMulAreasAcExcel").val();

            if(listMultiAreas != null){
                listMultiAreas.forEach(function(val,index){
                    valAreas += (valAreas.length == 0?val:","+val);
                });
            }

            var listMulEstadosActual = $("#selMulEstadoActualAcExcel").val();

            if(listMulEstadosActual != null){
                listMulEstadosActual.forEach(function(val,index){
                    valEstados += (valEstados.length == 0?val:","+val);
                });
            }

            var listMulSubTipoContactoActo = $("#selMulSubTipoContactoActoAcExcel").val();

            if(listMulSubTipoContactoActo != null){
                listMulSubTipoContactoActo.forEach(function(val){
                    valRiesgos += (valRiesgos.length == 0?val:","+val);
                });
            }

            var listMulTipoActo = $("#selMulTipoActoAcExcel").val();

            if(listMulTipoActo != null){
                listMulTipoActo.forEach(function(val){
                    valTiposAc += (valTiposAc.length == 0?val:","+val);
                });
            }

            var listMulCausaActo = $("#selMulCausaActoAcExcel").val();

            if(listMulCausaActo != null){
                listMulCausaActo.forEach(function(val){
                    valCausas += (valCausas.length == 0?val:","+val);
                });
            }

            var hasEvidencia = (parseInt(getSession("gestopcompanyid")) == 336?0:parseInt($("#selHasEvidenciaAc").val()));
            var idOpcion = parseInt($("#selVisualizacionOpcAcExcel").val());

            window.open(URL+"/acinseguro/version_dos/reporte/excel?"+"empresaId="+getSession("gestopcompanyid") +
                "&opcionSelectLista="+opcConsolidadoExcel+"&accesoVistaColaborador=1"+"&conEvidencia="+hasEvidencia +
                "&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado +
                "&valUnidades="+(valUnidades.length == 0?"-1":valUnidades)+"&valDivisiones="+(valDivisiones.length == 0?"-1":valDivisiones) +
                "&valAreas="+(valAreas.length == 0?"-1":valAreas)+"&valEstados="+(valEstados.length == 0?"-1":valEstados) +
                "&valRiesgos="+(valRiesgos.length == 0?"-1":valRiesgos)+"&valTiposAc="+(valTiposAc.length == 0?"-1":valTiposAc) +
                "&valCausas="+(valCausas.length == 0?"-1":valCausas)+"&isTrabajador="+idOpcion+"&trabajadorId="+getSession("trabajadorGosstId"));
        }
    }else{
        $("#modalOpcConsolidadosAc").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionFiltroExcel");
       
        $("#modalMensajeUxValidacionFiltroExcel").on("hidden.bs.modal",function(){
            $("#modalOpcConsolidadosAc").modal("show");
        });
    }
}

function ocultarNuevoImportEventoInseguro(){
    $("#modalNuevoImportEventoInseguro").modal("hide");
}

function verNuevoImportEventoInseguro(){
    $("#modalNuevoImportEventoInseguro").remove();

    var textPlantilla = "<a class='efectoLink' target='_blank' href='"+URL+"/acinseguro/vista_colaborador/import/plantilla?" +
            "empresaId="+getSession("gestopcompanyid")+"'>" +
            "<i class='fa fa-download'></i> Descargar" +
        "</a>";

    var contenido = "";

    var listContenido=[
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Plantilla",inputForm:textPlantilla},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Archivo excel",inputForm:"",divContainer:"divNuevoImportEventInseg"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarNuevoImportEventoInseguro()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='confirmacionNuevoImportEventoInseguro()'>" +
                       "<i class='fa fa-inbox'></i> Import" +
                   "</button>"}
    ];

    listContenido.forEach(function (val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalNuevoImportEventoInseguro",nombre:"<i class='fa fa-inbox'></i> Import - A/C Subestándar",
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    var options={
        container:"#divNuevoImportEventInseg",functionCall:function(){
            validacionSubirEvidencia("ImportEventInsegExcel",bitsEvidenciaExamen,"modalNuevoImportEventoInseguro");
        },descargaUrl:"",esNuevo:true,idAux:"ImportEventInsegExcel",evidenciaNombre:""
    };

    crearFormEvidenciaCompleta(options);
}

function confirmacionNuevoImportEventoInseguro(){
    var campoVacio = true;

    var nombreExcel = $("#inputEviImportEventInsegExcel").val();

    if(nombreExcel.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe subir el excel para poder continuar.</label>";
    }else if(nombreExcel == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe subir el excel para poder continuar.</label>";
    }

    if(campoVacio){
        enviarNuevoImportEventoInseguro();
    }else{
        $("#modalNuevoImportEventoInseguro").modal("hide");
        mensajesUx(mensajeUx,2,"","AvisoCompletarImportEventInseg");

        $("#modalMensajeUxAvisoCompletarImportEventInseg").on("hidden.bs.modal",function(){
            $("#modalNuevoImportEventoInseguro").modal("show");
        });
    }
}

function enviarNuevoImportEventoInseguro(){
    var listValoresAdicionales=[
        {id:"empresaId",value:getSession("gestopcompanyid")},{id:"origenId",value:3},{id:"areaTrabImportId",value:getSession("areaGosstId")},
        {id:"nivelRiesgoId",value:2},{id:"reporteTipo",value:1}, {id:"reporteNombre",value:getSession("gestopusername")},
        {id:"trabajadorRegistraId",value:getSession("trabajadorGosstId")}
    ];

    guardarEvidenciaAuto(0,"fileEviImportEventInsegExcel",bitsEvidenciaActoInseguro,
    "/acinseguro/excel/masivo/version_dos/save",function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                $("#modalNuevoImportEventoInseguro").modal("hide");

                mensajeUx= "<label style='text-align:left;word-break:break-all;'>"+data.mensaje+"</label>";
                mensajesUx(mensajeUx,4,"","ActualizarVistaAdminEventInseg");

                $("#modalMensajeUxActualizarVistaAdminEventInseg").on("hidden.bs.modal",function(){
                    habilitarReporteEventoUsuario();
                });

                break;

            default:
                alert("Ocurrió un error al intentar realizar el import de los eventos.");
        }
    },"id",listValoresAdicionales);
}
