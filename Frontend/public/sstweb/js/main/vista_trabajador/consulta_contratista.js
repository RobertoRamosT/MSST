
var listContratistasConsulta=[],listProyectosAsignadosActivos=[];

function buscarContratistaEmpresaConsulta(){
   var nombre = $("#inputIngresarRucNombreContratista").val().trim();
 	
   if(nombre.length >= 3){
      var dataParam={
	 nombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid")),isBuscador:1
      };
 		
      callAjaxPostNoLoad(URL+"/contratista/buscar",dataParam,function(data){
	 listContratistasConsulta = (data.contratistas.length == 0?[{id:-1,nombre:"No encontrado"}]:data.contratistas);
	
	 var onchangeSelect = (opcPerfilPersonalExterno == 5?"verAutoCompletarVehiculoMaquinariaConsulta();":(opcPerfilPersonalExterno == 6?
            "verAutoCompletarEquipoHerramientaConsulta();":"buscarContratistaProyectoConsulta();"));
 			
         var selContratistaConsulta = crearSelectOneMenuOblig("selContratistaConsulta",onchangeSelect,
            listContratistasConsulta,"","id","nombre");
 	       
         $("#divSelAutoContratistaPorNombre").html(selContratistaConsulta);
         
         $("#inputIngresarRucNombreContratista").attr("onkeyup","buscarContratistaEmpresaConsulta()");
           
         if(opcPerfilPersonalExterno == 2){
    	    verAutoCompletarTrabajadorContratistaConsulta(); 
         }else if(opcPerfilPersonalExterno == 5){ 
            verAutoCompletarVehiculoMaquinariaConsulta();
         }else if(opcPerfilPersonalExterno == 6){
            verAutoCompletarEquipoHerramientaConsulta();  
         }else{
            buscarContratistaProyectoConsulta();
         }
      });
   }else{
      listContratistasConsulta = [{id:-1,nombre:"No encontrado"}];
        
      var selContratistaConsulta = crearSelectOneMenuOblig("selContratistaConsulta","",listContratistasConsulta,"","id","nombre");
 		       
      $("#divSelAutoContratistaPorNombre").html(selContratistaConsulta);
      	
      $("#inputIngresarRucNombreContratista").attr("onkeyup","buscarContratistaEmpresaConsulta()");
	
      if(opcPerfilPersonalExterno == 2){
  	 verAutoCompletarTrabajadorContratistaConsulta(); 
      }else if(opcPerfilPersonalExterno == 5){
         verAutoCompletarVehiculoMaquinariaConsulta();	
      }else if(opcPerfilPersonalExterno == 6){
	 verAutoCompletarEquipoHerramientaConsulta();
      }else{
	 buscarContratistaProyectoConsulta();
      }
   }
}

function buscarContratistaProyectoConsulta(){
   var idContratista = parseInt($("#selContratistaConsulta").val());
  	
   if(idContratista != -1){
      var dataParam={
	 id:idContratista,estadoProyecto:2
      };
  		
      callAjaxPostNoLoad(URL+"/contratista/proyecto_asignado",dataParam,function(data){
	 listProyectosAsignadosActivos = (data.listProyectosAsignados.length == 0?[{id:-1,titulo:"Ninguno asignado"}]:data.listProyectosAsignados);
	 
         var selContratistaProyectoConsulta = crearSelectOneMenuOblig("selContratistaProyectoConsulta",
            "",listProyectosAsignadosActivos,"","id","titulo");
  	       
         $("#divSelAutoProyectoActivoContratista").html(selContratistaProyectoConsulta);
      });
   }else{
      $("#divSelAutoProyectoActivoContratista").html("<label style='color:red;'>* Debe seleccionar al contratista.</label>");
   }
}

var listConductores = [],listVehiculosMaquinarias = [],listEquiposHerramientas = [],listTipoLicencias = [];
var contratistaObj,proyectoObj;
var mapConductorEstadoTrabContAsig = new Map();
var conductorEstadoTrabContAsigCargado = false;
var conductorEstadoTrabContAsigError = false;
var conductorSeEvaluaTrabContAsig = false;
var mapTipoLicenciaCondHabilitada;
var numTipoLicCondHabilitados;

function verFiltroDatosContratista(){
   $("#modalEstadoActualContratista").modal("hide");$("#modalFiltroEstadoActualContratista").modal("show");
}

function ocultarFiltroDatosContratista(){
   $("#modalFiltroEstadoActualContratista").modal("hide");$("#modalEstadoActualContratista").modal("show");
}

function crearFiltroDatosContratista(){
	$("#modalFiltroEstadoActualContratista").remove();
	
   var contenido = "";

   var listContenido=[
      {label:"Fecha de trabajo",inputForm:"<input id='fechaTrabajoEstActCont' type='date' class='form-control'>"},
      {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
      {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroDatosContratista()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='validacionPreviaBuscarDatosContratista()'>" +
                    "<i class='fa fa-filter'></i> Aplicar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionTres(val);
   });

   var modalOptions={
      id:"modalFiltroEstadoActualContratista",nombre:"<i class='fa fa-filter'></i> Valor previo",btnCerrarHabilitado:0,
      contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   var hoy = getSession("fechaHoyOrdenInversoTexto");

   $("#fechaTrabajoEstActCont").val(convertirFechaInput(hoy));

   validacionPreviaBuscarDatosContratista();
}

var fechaTrabajoTexto;

function validacionPreviaBuscarDatosContratista(){
   var fechaTrabajo = $("#fechaTrabajoEstActCont").val();

   if(fechaTrabajo.length == 0){
      $("#modalFiltroEstadoActualContratista").modal("hide");

      mensajeUx = "<label>Debe ingresar la fecha de trabajo.</label>";
      mensajesUx(mensajeUx,2,"","AvisoFiltroPrevio");

      $("#modalMensajeUxAvisoFiltroPrevio").on("hidden.bs.modal",function(){
         $("#modalFiltroEstadoActualContratista").modal("show");
      });
   }else{
      fechaTrabajoTexto = formatoFecha(fechaTrabajo).replaceAll("/","-");

      buscarDatosContratista();
   }
}

function ocultarDatosContratista(){
   $("#modalEstadoActualContratista").modal("hide");$("#modalPerfilesInformacionVistaConsulta").modal("show");
}

function buscarDatosContratista(){
   $("#modalPerfilesInformacionVistaConsulta").modal("hide");$("#modalFiltroEstadoActualContratista").modal("hide");$("#modalEstadoActualContratista").remove();

   var idContratista = parseInt($("#selContratistaConsulta").val());
   var idProyecto = parseInt($("#selContratistaProyectoConsulta").val());
   var fechaTrabajo = $("#fechaTrabajoEstActCont").val();

   if(idContratista != -1 && idProyecto != -1){
      var dataParam={
         id:idProyecto,contratistaId:idContratista,fechaReferencia:fechaTrabajo
      };

      callAjaxPost(URL+"/contratista/consulta/proyecto",dataParam,function(data){
         if(data.CODE_RESPONSE == "05"){
            $("#seccionDocumentosContratista").show();

            contratistaObj = data.contratista;proyectoObj = data.proyecto;listConductores = data.listConductores;
            listVehiculosMaquinarias = data.listVehiculosMaquinarias;listEquiposHerramientas = data.listEquiposHerramientas;
            listTipoLicencias = data.listTipoLicencias;

            mapTipoLicenciaCondHabilitada = new Map();

            numTipoLicCondHabilitados = listTipoLicencias.length;

            listTipoLicencias.forEach(function(val,index){
               mapTipoLicenciaCondHabilitada.set(val.id,1);
            });

            var estadoDocumentosNivelEmpresaConObj = verificarIndicadorDocNivelEmpresaContratista(contratistaObj);

            var estadoDocumentosNivelProyectoConObj = verificarIndicadorDocNivelProyectoContratista(proyectoObj);

            var booleanHabilitado = estadoDocumentosNivelEmpresaConObj.isHabilitado && estadoDocumentosNivelProyectoConObj.isHabilitado;

            var estadoActualOpcContTotal =
               "<div class='"+(booleanHabilitado?"estado-futurista-ok":"estado-no-habilitado-full")+"'>" +
                  "<i class='"+(booleanHabilitado?"fa fa-thumbs-up":"fa fa-ban")+"'></i>" +
                  "<div>"+"<div class='estado-titulo'>"+(booleanHabilitado?"Completado":"Incompleto")+"</div>"+"</div>" +
               "</div>";

            var btnVerFiltroPrevio =
               "<button class='btn btn-info' type='button' style='float:right;font-size:18px;' onclick='verFiltroDatosContratista()'>" +
                  "<i class='fa fa-refresh'></i> Cambiar" +
               "</button>";

            var contenido = "";

            var listContenido=[
               {clase:"bloque-top-moderno",label:"Contratista:",inputForm:contratistaObj.nombre},
               {label:"",inputForm:"",styleTotal:styleLineaDegradada},
               {clase:"bloque-middle-moderno",label:"Título del proyecto:",inputForm:proyectoObj.titulo},
               {label:"",inputForm:"",styleTotal:styleLineaDegradada},
               {clase:"bloque-bottom-moderno",label:"Código:",inputForm:proyectoObj.codigo},
               {label:"",inputForm:"",styleTotal:styleLineaDegradada},
               {clase:"bloque-bottom-moderno",label:"Fecha de trabajo:",inputForm:fechaTrabajoTexto+btnVerFiltroPrevio,styleTotal:"margin-bottom:10px;"},
               {clase:"bloque-top-moderno",label:"Trabajadores asignados:",inputForm:(proyectoObj.trabajadoresTotal == 0?"Registrados (0)":
                  "<a class='efectoLink' onclick='verOpcConsolidadoTrabContratistaAsignados()'>"+"Registrados ("+proyectoObj.trabajadoresTotal+")"+"</a>")}
            ];

            if(contratistaObj.numConductores != -1){
               listContenido.push({label:"",inputForm:"",styleTotal:styleLineaDegradada},
                  {clase:"bloque-middle-moderno",label:"Conductores:",inputForm:(contratistaObj.numConductores == 0?"Registrados (0)":
                     "<a class='efectoLink' onclick='verConsolidadoConductoresEstadoActual()'>"+"Registrados ("+contratistaObj.numConductores+")"+"</a>")});
            }

            if(contratistaObj.numVehiculosMaquinarias != -1){
               listContenido.push({label:"",inputForm:"",styleTotal:styleLineaDegradada},
                  {clase:"bloque-middle-moderno",label:"Vehículos/Maquinarias:",inputForm:(contratistaObj.numVehiculosMaquinarias == 0?"Registrados (0)":
                     "<a class='efectoLink' onclick='verConsolidadoVehiculosMaquinariasEstadoActual()'>"+"Registrados ("+contratistaObj.numVehiculosMaquinarias+")"+"</a>")});
            }

            if(contratistaObj.numEquiposHerramientas != -1){
               listContenido.push({label:"",inputForm:"",styleTotal:styleLineaDegradada},
                  {clase:"bloque-middle-moderno",label:"Equipos/Herramientas:",inputForm:(contratistaObj.numEquiposHerramientas == 0?"Registrados (0)":
                     "<a class='efectoLink' onclick='verConsolidadoEquiposHerramientasEstadoActual()'>"+"Registrados ("+contratistaObj.numEquiposHerramientas+")"+"</a>")});
//                     "<br><a class='efectoLink' onclick='verValoresPdfConsolidadoEquiposHerramientasEstadoActual()'>"+"<i class='fa fa-file-text-o'></i> Consolidado"+"</a>")});
            }

            if(contratistaObj.numHojasMsds != -1){
               listContenido.push({label:"",inputForm:"",styleTotal:styleLineaDegradada},
                  {clase:"bloque-middle-moderno",label:"Hojas MSDS:",inputForm:(contratistaObj.numHojasMsds == 0?"Registrados (0)":
                     "<a class='efectoLink' onclick='verConsolidadoHojaMsdsConsulta()'>"+"Registrados ("+contratistaObj.numHojasMsds+")"+"</a>")});
            }

            if(contratistaObj.numEquiposMoviles != -1){
               listContenido.push({label:"",inputForm:"",styleTotal:styleLineaDegradada},
                  {clase:"bloque-middle-moderno",label:"Equipos móviles:",inputForm:(contratistaObj.numEquiposMoviles == 0?"Registrados (0)":
                     "<a class='efectoLink' onclick='verConsolidadoEquiposMovilesConsulta()'>"+"Registrados ("+contratistaObj.numEquiposMoviles+")"+"</a>")});
            }

            if(proyectoObj.numDocumentosNivelEmpresaTotal > 0 || proyectoObj.numDocumentosNivelProyectoTotal > 0){
               listContenido.push({label:"",inputForm:"",styleTotal:styleLineaSuaveMinimalista},
                  {anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Documentos a nivel empresa y/o proyecto:",inputForm:"",styleTotal:"margin-bottom:0px;"},
                  {clase:"estado-actual-compacto",anchoLabel:"col-sm-12",anchoDiv:"col-sm-12",label:"",
                   inputForm:estadoActualOpcContTotal+"<a class='estado-detalle-alternar' id='idDetalleEstadoActualOpcContTotal'></a>"});

               if(proyectoObj.numDocumentosNivelEmpresaTotal > 0){
                  listContenido.push({clase:"divDescripcionDocumentoContratistaVersionDos",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                     {clase:"divDescripcionDocumentoContratistaVersionDos",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                      label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL EMPRESA ***</span>",inputForm:""});

                  var listContenidoDneAux = [];

                  listContenidoDneAux = obtenerContratistaListaDocumentosNivelEmpresa(contratistaObj,estadoDocumentosNivelEmpresaConObj,"divDescripcionDocumentoContratistaVersionDos");

                  for(var i = 0;i < listContenidoDneAux.length;i++){
                     listContenido.push(listContenidoDneAux[i]);
                  }
               }

               if(proyectoObj.numDocumentosNivelProyectoTotal > 0){
                  listContenido.push({clase:"divDescripcionDocumentoContratistaVersionDos",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                     {clase:"divDescripcionDocumentoContratistaVersionDos",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                      label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL PROYECTO ***</span>",inputForm:""});

                  var listContenidoDnpAux = [];

                  listContenidoDnpAux = obtenerContratistaListaDocumentosNivelProyecto(proyectoObj,estadoDocumentosNivelProyectoConObj,"divDescripcionDocumentoContratistaVersionDos");

                  for(var i = 0;i < listContenidoDnpAux.length;i++){
                     listContenido.push(listContenidoDnpAux[i]);
                  }
               }
            }

            listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica+"margin-top:10px;"},
               {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarDatosContratista()'>" +
                         "<i class='fa fa-arrow-left'></i> Volver" +
                      "</button>",inputForm:""});

            listContenido.forEach(function(val){
               contenido += obtenerSubPanelModuloVersionTres(val);
            });

            var modalOptions={
               id:"modalEstadoActualContratista",nombre:"<i class='fa fa-search'></i> Resultado de la búsqueda - contratista",
               contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
            };

            crearModalPrincipalUsuario(modalOptions,function(){},true,true);

            ocultarDetalleDocumentosContratista();
         }else{
            mensajeUx = "<label>Ocurrió un error al cargar la información.</label>";
            mensajesUx(mensajeUx,2,"","ValidacionConsulta");

            $("#modalMensajeUxValidacionConsulta").on("hidden.bs.modal",function(){
               $("#modalPerfilesInformacionVistaConsulta").modal("show");
            });
         }
      });
   }else{
      mensajeUx = (idContratista == -1?"<label>Debe ingresar el RUC y/o nombre de la contratista " +
         "en el buscador y seleccionarla.</label>":"<label>El contratista no tiene proyectos activos asignados.</label>");
      mensajesUx(mensajeUx,2,"","ValidacionConsulta");

      $("#modalMensajeUxValidacionConsulta").on("hidden.bs.modal",function(){
         $("#modalPerfilesInformacionVistaConsulta").modal("show");
      });
   }
}

function verDetalleDocumentosContratista(){
   $(".divDescripcionDocumentoContratistaVersionDos").show();

   $("#idDetalleEstadoActualOpcContTotal").html("Ocultar detalle <i class='fa fa-chevron-up'></i>");
   $("#idDetalleEstadoActualOpcContTotal").attr("onclick","ocultarDetalleDocumentosContratista()");
}

function ocultarDetalleDocumentosContratista(){
   $(".divDescripcionDocumentoContratistaVersionDos").hide();

   $("#idDetalleEstadoActualOpcContTotal").html("Ver detalle <i class='fa fa-chevron-down'></i>");
   $("#idDetalleEstadoActualOpcContTotal").attr("onclick","verDetalleDocumentosContratista()");
}

var listHojasQuimicaConsulta=[];

function volverPrincipalConsulta(){
   $("#modalHojaMsdsConsulta").modal("hide");$("#modalEstadoActualContratista").modal("show");
}

function verConsolidadoHojaMsdsConsulta(){
   $("#modalEstadoActualContratista").modal("hide");$("#modalHojaMsdsConsulta").remove();
    
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' id='btnVolverConsulta' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverPrincipalConsulta()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";

   var buscadorOpciones = 
      "<button type='button' class='btn btn-success' title='Refresh' style='float:right;' " +
              "onclick='reiniciarBuscadorHojaMsdsConsulta()'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button type='button' class='btn btn-success' onclick='aplicarBuscadorHojaMsdsConsulta()' " + 
              "style='float:right;margin-right:5px;' title='Buscar los registros cuyo nombre del producto químico de " +
              "la hoja MSDS coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input placeholder='Nombre del producto químico' class='form-control' id='valBuscarValorHojaMsdsConsulta' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";      
       
   var modalOptions={
      maxWidth:"90%",id:"modalHojaMsdsConsulta",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-table'></i> Consolidado Hojas MSDS > contratista "+contratistaObj.nombre,
      contenido: 
	     "<div class='eventoGeneral-moderno'>" +
         "<form class='form-inline'>" +
             buttonVolver+buscadorOpciones +
         "</form>" +
         "<div class='wrapper' id='wrapperHojaMsdsConsulta'>" +
            "<table id='tblHojaMsdsConsulta' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<td class='tb-acc' style='width:150px'>Fecha de registro</th>" +
	             "<td class='tb-acc' style='width:300px'>Nombre del Producto Químico (PQ)</th>" +
		     "<td class='tb-acc' style='width:300px'>Usado para</th>" +
		     "<td class='tb-acc' style='width:300px'>Peligros Asociados al uso del PQ</th>" +
		     "<td class='tb-acc' style='width:300px'>Puestos que manipularán el PQ</th>" +
		     "<td class='tb-acc' style='width:300px'>Equipo de Proteccion necesario</th>" +
		     "<td class='tb-acc' style='width:300px'>Evidencia</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>" +
     "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperHojaMsdsConsulta",240);
   cargarConsolidadoHojaMsdsConsulta();
}

function cargarConsolidadoHojaMsdsConsulta(){
   var dataParam={
      id: contratistaObj.id
   };

   callAjaxPost(URL+'/public/contratista/hojaquimica/consulta',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listHojasQuimicaConsulta = data.listHojasQuimica;
						
	 $("#tblHojaMsdsConsulta tbody tr").remove();
		
	 listHojasQuimicaConsulta.forEach(function(val){	
	    var enlaceEvidencia = (val.evidenciaNombre.length == 0?"------":
	       "<a class='efectoLink' target='_blank' " +
	          "href='"+URL+"/public/contratista/hojaquimica/evidencia?id="+val.id+"'>" +
	          "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
	       "</a>");
	     
	    $("#tblHojaMsdsConsulta tbody").append(
	       "<tr id='trHojaMsds"+val.id+"'>" +
	          "<td>"+val.fechaEvidenciaTexto+"</td>" +
		  "<td>"+val.nombre+"</td>" +
		  "<td>"+val.uso+"</td>" + 
		  "<td>"+val.peligro+"</td>" + 
		  "<td>"+val.puesto+"</td>" + 
		  "<td>"+val.equipoNecesario+"</td>" + 
		  "<td>"+enlaceEvidencia+"</td>" + 
	       "</tr>");
	 });
	      
	 goheadfixedY("#tblHojaMsdsConsulta","#wrapperHojaMsdsConsulta");
      }else{
         console.log("Error al cargar el consolidado - Hojas MSDS");
      }
   });    
}

function aplicarBuscadorHojaMsdsConsulta(){
   var valorBuscador = igualarStringBuscar($("#valBuscarValorHojaMsdsConsulta").val());

   listHojasQuimicaConsulta.forEach(function(val,index){
      if(igualarStringBuscar(val.nombre).indexOf(valorBuscador) != -1){
         $("#trHojaMsds"+val.id).show();
      }else{
         $("#trHojaMsds"+val.id).hide();
      }
   });
}

function reiniciarBuscadorHojaMsdsConsulta(){
   $("#valBuscarValorHojaMsdsConsulta").val("").focus();

   listHojasQuimicaConsulta.forEach(function(val,index){
      $("#trHojaMsds"+val.id).show();
   });
}

var listOpcConsolidadoTrabContratistaAsignados=[
   {id:1,nombre:"Todos"},{id:2,nombre:"Solo prevencionistas"}
];

function ocultarOpcConsolidadoTrabContratistaAsignados(){
   $("#modalOpcConsolidadoTrabContAsig").modal("hide");$("#modalEstadoActualContratista").modal("show");
}

function verOpcConsolidadoTrabContratistaAsignados(){
   if(proyectoObj.habilitadoPrevencionista == 1){ 
      $("#modalEstadoActualContratista").modal("hide");$("#modalOpcConsolidadoTrabContAsig").remove();

      var selOpcConTrabContAsig = crearSelectOneMenuOblig("selOpcConTrabContAsig","",
         listOpcConsolidadoTrabContratistaAsignados,"1","id","nombre");
 
      var contenido = "";

      var listContenido=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Trabajadores",inputForm:selOpcConTrabContAsig},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                        "onclick='ocultarOpcConsolidadoTrabContratistaAsignados()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
          inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                            "onclick='verConsolidadoTrabContratistaAsignados()'>" +
                       "<i class='fa fa-check'></i> Aceptar" +
                    "</button>"}
      ];

      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });

      var modalOptions={
         id:"modalOpcConsolidadoTrabContAsig",nombre:"<i class='fa fa-filter'></i> Seleccionar - Opción trabajadores",btnCerrarHabilitado:0,
         contenido:"<form class='eventoGeneral-moderno'>"+contenido+"</form>",contenidoClassAux:"modal-content-moderno"
      };

      crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   }else{
      verConsolidadoTrabContratistaAsignados();
   }
}

var listTrabContratistaAsignados=[],listTrabContratistaAsignadosBuscador=[];
var busquedaActivaTrabContAsig,numPaginaActualTrabContAsig;

function ocultarConsolidadoTrabContratistaAsignados(){
   $("#modalConsolidadoTrabContAsig").modal("hide");$("#modalEstadoActualContratista").modal("show");
}

function verConsolidadoTrabContratistaAsignados(){
   $("#modalEstadoActualContratista").modal("hide");$("#modalOpcConsolidadoTrabContAsig").modal("hide");
   $("#modalConsolidadoTrabContAsig").remove();
    
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' id='btnOcultarConTrabContAsig' class='btn btn-info' style='margin-right:5px' " +
              "onclick='ocultarConsolidadoTrabContratistaAsignados()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
      
   var buttonClipboard = 
      "<button id='btnClipboardConTrabContAsig' type='button' class='clipGosst btn btn-success' title='Copiar todos los registros " +
              "actuales pertenecientes al consolidado' style='margin-right:5px' onclick='obtenerTablaClipboardIndicadorTrabajadorContratista()'>" +
         "<i class='fa fa-clipboard fa-2x'></i>" + 
      "</button>";

    var buttonExcel =
        "<button type='button' class='btn btn-excel' title='Descargar toda la data del consolidado en un excel.' " +
                "onclick='descargarExcelConsolidadoTrabajadorContratistaColaborador()'>" +
            "<i class='fa fa-file-excel-o fa-2x'></i>" +
        "</button>";

    var buttonFlechas =
      "<span id='indicadorPaginaParcialAux' style='margin:5px;margin-top:10px;'>" +
         "<a id='flechaIzquierdaTrabContAsig'><img src='../imagenes/flecha_01.png' /></a>" +
	    " <em id='labelFlechas'></em> " +
	 "<a id='flechaDerechaTrabContAsig'><img src='../imagenes/flecha_02.png' /></a>" +
      "</span>";
   
   var buscadorOpciones = 
      "<button type='button' class='btn btn-success' id='btnResetBuscadorConTrabContAsig' " +
              "title='Refresh' onclick='reiniciarBuscadorIndicadorTrabajadorContratista()' style='float:right;'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button type='button' class='btn btn-success' onclick='aplicarBuscadorIndicadorTrabajadorContratista()' " + 
              "style='float:right;margin-right:5px;' title='Buscar los registros cuyo N° documento, nombre o apellido " + 
	      "del trabajador contratista coincidan con las palabras ingresadas.' id='btnAplicarBuscadorConTrabContAsig'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input placeholder='N° documento, nombre o apellido' class='form-control' id='valBuscarValorConTrabContAsig' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>" +
      "<label style='float:right;margin-right:5px;margin-top:10px;'>[Fecha de trabajo: "+fechaTrabajoTexto+"]</label>";

    var tipoExamenContUno = (parseInt(getSession("gestopcompanyid")) == 741?"Habilitación médica ocupacional":"Certificado Aptitud Médico");

    var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoTrabContAsig",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-table'></i> Consolidado Trabajadores asignados > contratista "+contratistaObj.nombre +
             " > proyecto "+proyectoObj.titulo,
      contenido: 
	  "<div class='eventoGeneral-moderno'>" +
	 "<form class='form-inline'>" +
             buttonVolver+buttonClipboard+buttonExcel+buttonFlechas+buscadorOpciones +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoTrabContAsig'>" +
            "<table id='tblConsolidadoTrabContAsig' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<td class='tb-acc' style='width:150px'>Cumple (nivel trabajador)</td>" +
              (proyectoObj.numTrabajosAltoRiesgoTotal == 0 || (proyectoObj.habilitadoConstanciaAltoRiesgo == 0 && proyectoObj.habilitarCargoInduccionTrabAltRie == 0 &&
               proyectoObj.habilitadoMedicoClinica == 0)?"":
               "<td class='tb-acc' style='width:300px'>Trabajos de alto riesgo asignados</td>") +
		     "<td class='tb-acc' style='width:300px'>Trabajador(a)</td>" +
		     "<td class='tb-acc' style='width:250px'>Empresa</td>" +
//		     "<td class='tb-acc' style='width:200px'>Área</td>" +
		     "<td class='tb-acc' style='width:200px'>Puesto de trabajo</td>" +
		     "<td class='tb-acc' style='width:120px'>Tipo Documento</td>" +
		     "<td class='tb-acc' style='width:150px'>N° Documento</td>" +
              (proyectoObj.habilitarEsConductor == 0?"":"<td class='tb-acc' style='width:170px'>¿Es conductor?</td>") +
              (proyectoObj.habilitarEsConductor == 0?"":"<td class='tb-acc' style='width:220px'>Licencias del conductor</td>") +
		      (proyectoObj.habilitadoEsPrevencionista == 0?"":"<td class='tb-acc' style='width:170px'>¿Es prevencionista?</td>") +
              (proyectoObj.habilitadoEsPrevencionista == 0 || proyectoObj.habilitadoEntrevistaPrevencionista == 0?"":"<td class='tb-acc' style='width:170px'>Entrevista prevencionista</td>") +
		      (proyectoObj.habilitadoCertAptMedica == 0?"":"<td class='tb-acc' style='width:170px'>"+tipoExamenContUno+"</td>") +
		      (proyectoObj.habilitadoSctr == 0?"":
		       "<td class='tb-acc' style='width:170px'>SCTR</td>") +
		      (proyectoObj.habilitadoEpp == 0?"":
		       "<td class='tb-acc' style='width:170px'>EPP</td>") +
		      (proyectoObj.habilitacionInduccion3 == 0?"":
		       "<td class='tb-acc' style='width:170px'>Inducción del cliente</td>") +
		      (proyectoObj.habilitadoCargReglamento == 0?"":
	               "<td class='tb-acc' style='width:170px'>Cargo reglamento</td>") +
		      (proyectoObj.habilitadoTRegistro == 0?"":
		       "<td class='tb-acc' style='width:170px'>T-registro</td>") +
		      (proyectoObj.habilitadoInduccSstCont == 0?"":
		       "<td class='tb-acc' style='width:170px'>Inducciones SST de la contratista</td>") + 
		      (proyectoObj.habilitadoPruebaCovid == 0?"":
		       "<td class='tb-acc' style='width:170px'>Prueba COVID-19</td>") + 
		      (proyectoObj.habilitadoVacunaCovid == 0?"":
		       "<td class='tb-acc' style='width:170px'>Vacuna COVID-19</td>") + 
		      (proyectoObj.habilitadoCertifPolicial == 0?"":
		       "<td class='tb-acc' style='width:170px'>Certificados policiales</td>") + 
		      (proyectoObj.habilitadoAntecedentesPenales == 0?"":
		       "<td class='tb-acc' style='width:170px'>Antecedentes penales</td>") + 
		      (proyectoObj.habilitadoSeguroAccidentes == 0?"":
		       "<td class='tb-acc' style='width:170px'>Seguro contra accidentes</td>") + 
		      (proyectoObj.habilitadoRiesgoExposicionPuestoTrabajo == 0?"":
		       "<td class='tb-acc' style='width:170px'>Riesgo de exposición al puesto de trabajo</td>") + 
		      (proyectoObj.habilitadoVacunacionCovid == 0?"":
		       "<td class='tb-acc' style='width:170px'>Vacunación COVID-19</td>") + 
		      (proyectoObj.habilitadoCarnetSanidad == 0?"":
		       "<td class='tb-acc' style='width:170px'>Carnet de sanidad</td>") + 
		      (proyectoObj.habilitadoAcuerdoSeguridadEquElec == 0?"":
		       "<td class='tb-acc' style='width:170px'>Acuerdo de seguridad y confidencialidad - equipos electrónicos</td>") + 
		      (proyectoObj.habilitadoEvaluacionToxicologica == 0?"":
		       "<td class='tb-acc' style='width:170px'>Evaluación toxicológica</td>") + 
		      (proyectoObj.habilitadoCertifUnicoLaboral == 0?"":
		       "<td class='tb-acc' style='width:170px'>Certificado único laboral</td>") + 
		      (proyectoObj.habilitadoAntecedentesPoliciales == 0?"":
		       "<td class='tb-acc' style='width:170px'>Antecedentes policiales</td>") + 
		      (proyectoObj.habilitadoDeclaracionVerifDomicilio == 0?"":
		       "<td class='tb-acc' style='width:170px'>Declaración jurada o verificación del domicilio</td>") + 
		      (proyectoObj.habilitadoDotacionIndumentaria == 0?"":"<td class='tb-acc' style='width:170px'>Dotación indumentaria</td>") +
              (proyectoObj.habilitadoMedicoClinica == 0?"":"<td class='tb-acc' style='width:270px'>Habilitación médica por clínica</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont84 == 0?"":"<td class='tb-acc' style='width:170px'>Cargo RISST de la contratista</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont89 == 0?"":"<td class='tb-acc' style='width:170px'>Cargo de recepción de IPERC</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont90 == 0?"":"<td class='tb-acc' style='width:170px'>Seguro vida ley</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont99 == 0?"":"<td class='tb-acc' style='width:170px'>Documento de identidad</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont100 == 0?"":"<td class='tb-acc' style='width:170px'>Procedimiento o manual para trab. contratistas</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont101 == 0?"":"<td class='tb-acc' style='width:170px'>Cargo de procedimiento de HS</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont111 == 0?"":"<td class='tb-acc' style='width:170px'>Inducción SSOMA del cliente</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont112 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de capacitación en procedimiento de trabajo</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont113 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de difusión de política de seguridad del cliente</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont114 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de difusión de RISST del cliente</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont115 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en reporte de accidentes e incidentes (flujograma)</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont116 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión de IPERC, PETS y PETAR</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont117 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de capacitación por puesto de trabajo</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont118 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de capacitación de IPERC de la contratista</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont119 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación de buenas prácticas de manipulación de alimentos</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont128 == 0?"":"<td class='tb-acc' style='width:170px'>Título del profesional</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont129 == 0?"":"<td class='tb-acc' style='width:170px'>Evidencia colegiatura habilitada</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont130 == 0?"":"<td class='tb-acc' style='width:170px'>Registro nacional de especialidad</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont131 == 0?"":"<td class='tb-acc' style='width:170px'>Constancia/Carnet SUCAMEC</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont132 == 0?"":"<td class='tb-acc' style='width:170px'>Certificado capacitacion - BLS (Basic Life Support)</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont133 == 0?"":"<td class='tb-acc' style='width:170px'>Certificado capacitacion - PHLS (Prehospital Trauma Life Support)</td>") +
              (proyectoObj.habilitadoExamNivelTrabCont134 == 0?"":"<td class='tb-acc' style='width:170px'>Certificado capacitacion - ACLS (Advance Cardiovascular Life Support)</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont140 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión de plan de respuesta a emergencia del cliente</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont141 == 0?"":"<td class='tb-acc' style='width:170px'>Charla de inducción SST y MA</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont142 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión y entrega de política de sostenibilidad del cliente</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont143 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión y entrega plan COVID-19</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont144 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en matriz IPERC</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont145 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en matriz IAAS</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont146 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en primeros auxilios</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont147 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en uso extintor</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont148 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en plan contingencia</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont149 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en procedimiento de trabajo</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont150 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en ATS</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont151 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en capacitación uso de EPP</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont152 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en manejo de insumos químicos - hojas MSDS</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont153 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en uso de herramientas manuales</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont154 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en procedimiento de señalización</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont155 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 1</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont156 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 2</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont157 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 3</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont158 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 4</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont159 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 5</td>") +
			  (proyectoObj.habilitadoHojaVida == 0?"":"<td class='tb-acc' style='width:170px'>Hoja de Vida</td>") +
		     "<td class='tb-acc' style='width:150px'>¿Sin sanciones en curso?</td>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>" +
     "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoTrabContAsig",240);
   cargarConsolidadoTrabContratistaAsignados();
   
   $("#flechaIzquierdaTrabContAsig").on('click',function(){
      numPaginaActualTrabContAsig = numPaginaActualTrabContAsig-1;
      cambiarPaginaIndicadorTrabajadorContratista();
   });
	 
   $('#flechaDerechaTrabContAsig').on('click',function(){
      numPaginaActualTrabContAsig = numPaginaActualTrabContAsig+1;
      cambiarPaginaIndicadorTrabajadorContratista();
   });
}

function cargarConsolidadoTrabContratistaAsignados(){
    busquedaActivaTrabContAsig = 0,numPaginaActualTrabContAsig = 1;

    callAjaxPost(URL+'/contratista/indicador/nivel_trabajador/detalle/version_dos',proyectoObj,function(data){
        if(data.CODE_RESPONSE == "05"){
	 listTrabContratistaAsignados = data.listTrabContratistaAsignados;

	 if(proyectoObj.habilitadoEsPrevencionista == 1 && parseInt($("#selOpcConTrabContAsig").val()) == 2){
	    listTrabContratistaAsignados = listTrabContratistaAsignados.filter(val => val.esPrevencionista == 1);
	 }

	 $("#tblConsolidadoTrabContAsig tbody tr").remove();

	 mapConductorEstadoTrabContAsig = new Map();
	 conductorEstadoTrabContAsigCargado = false;
	 conductorEstadoTrabContAsigError = false;
	 // Sin la seccion de conductores en el proyecto no se consultan sus licencias: el conductor no se evalua
	 // ("esConductor" viene de la ficha del trabajador, no del proyecto). Con la seccion pero sin conductores
	 // en la lista no hay nada que consultar: equivale a una respuesta vacia.
	 conductorSeEvaluaTrabContAsig = (proyectoObj.habilitarEsConductor == 1);
	 conductorEstadoTrabContAsigCargado = (conductorSeEvaluaTrabContAsig && listConductores.length == 0);

	 cambiarPaginaIndicadorTrabajadorContratista();
	 goheadfixedY("#tblConsolidadoTrabContAsig","#wrapperConsolidadoTrabContAsig");

	 if(proyectoObj.habilitarEsConductor == 1 && listConductores.length > 0){
	    callAjaxPost(URL+'/contratista/conductor/consolidado_estado_actual',
	       {conductoresInfoAux:listConductores,fechaReferencia:proyectoObj.fechaReferencia},function(dataCond){
	       if(dataCond.CODE_RESPONSE == "05"){
	          dataCond.listConsolidadoConductoresEstado.forEach(function(val){
	             mapConductorEstadoTrabContAsig.set(val.trabContratista.id,val);
	          });
	          conductorEstadoTrabContAsigCargado = true;
	       }else{
	          conductorEstadoTrabContAsigError = true;
	       }

	       cambiarPaginaIndicadorTrabajadorContratista();
	    },null,{},null,function(){
	       // Error de red o del servidor (callAjaxPost no llama a la funcion de exito): no dejar "Verificando..."
	       if(!conductorEstadoTrabContAsigCargado && !conductorEstadoTrabContAsigError){
	          conductorEstadoTrabContAsigError = true;
	          cambiarPaginaIndicadorTrabajadorContratista();
	       }
	    });
	 }
      }else{
         console.log("Error al cargar el consolidado - Trabajadores asignados");
      }
   });
}

function cambiarPaginaIndicadorTrabajadorContratista(){
   $("#flechaIzquierdaTrabContAsig").show();$("#flechaDerechaTrabContAsig").show(); 
   
   var list = (busquedaActivaTrabContAsig == 0?listTrabContratistaAsignados:listTrabContratistaAsignadosBuscador);
   var totalSize = list.length;
   var partialSize = 100;
	
   var numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActualTrabContAsig*partialSize)-partialSize;
   var finRegistro = (numPaginaActualTrabContAsig*partialSize)-1;
	
   if(numPaginaTotal == 0){
      numPaginaTotal = 1;
   }
		
   $("#labelFlechas").html("<label>"+numPaginaActualTrabContAsig+" de "+numPaginaTotal+"</label>");
	 
   if(numPaginaActualTrabContAsig == 1){
      $("#flechaIzquierdaTrabContAsig").hide();
   }
	
   if(numPaginaActualTrabContAsig == numPaginaTotal){
      $("#flechaDerechaTrabContAsig").hide();
   }
	 
   if(finRegistro >= totalSize){
      finRegistro = totalSize-1;
   }
   
   $("#tblConsolidadoTrabContAsig tbody tr").remove();

   list.forEach(function(val,index){	
      if(inicioRegistro <= index && index <= finRegistro){
         var estadoDocumentosTrabConObj = verificarIndicadorDocNivelTrabajadorContratista(val,proyectoObj);
         var estadoConductorRow = (val.esConductor == 1 && conductorEstadoTrabContAsigCargado?mapConductorEstadoTrabContAsig.get(val.id):null);
         var linkVerEstadoConductor = "<br><a class='efectoLink' onclick='verEstadoConductorDesdeTrabContAsig("+index+")' " +
             "title='Ver el estado de las licencias del conductor.'><i class='fa fa-eye'></i> Ver estado</a>";

         // Estado del conductor para esta fila: "ok" (tiene todas sus licencias vigentes), "no" (le falta alguna o
         // ninguna asignada), "error" (la segunda llamada respondio con error) o "pendiente" (todavia no responde).
         // Mientras sea "error" o "pendiente" NO cuenta como aprobado -- un falso positivo (dejar pasar a alguien
         // sin verificar) es peor que mostrar "Verificando..." o "No se pudo verificar" un momento.
         var estadoConductor = (val.esConductor != 1 || !conductorSeEvaluaTrabContAsig?"ok":
             conductorEstadoTrabContAsigError?"error":
             !conductorEstadoTrabContAsigCargado?"pendiente":
             (estadoConductorRow != null && estadoConductorRow.habilitado == "Sí"?"ok":"no"));

         var textHabili = (!estadoDocumentosTrabConObj.isHabilitado?iconoGosst.desaprobado+" No":
             estadoConductor == "error"?iconoGosst.alerta+" No se pudo verificar":
             estadoConductor == "pendiente"?iconoGosst.alerta+" Verificando...":
             estadoConductor == "ok"?iconoGosst.aprobado+" Sí":iconoGosst.desaprobado+" No");

         var textoConductorLic = (val.esConductor != 1?"------":
             estadoConductor == "error"?iconoGosst.alerta+" No se pudo verificar"+linkVerEstadoConductor:
             estadoConductor == "pendiente"?iconoGosst.alerta+" Verificando..."+linkVerEstadoConductor:
             (estadoConductor == "ok"?iconoGosst.aprobado:iconoGosst.alerta)+" "+
             (estadoConductorRow != null?"Habilitado: "+estadoConductorRow.habilitado:"Sin licencias asignadas")+linkVerEstadoConductor);

         var textoTrabajosAltoRiesgo = (val.textoTrabajosAltoRiesgo.length == 0?"No tiene ninguno asignado.":
             (val.habilitadoTrabajosAltoRiesgo == 1?iconoGosst.aprobado:iconoGosst.alerta)+" "+val.textoTrabajosAltoRiesgo +
            "<br>" +
	    "<a class='efectoLink' onclick='accesoAuxConstanciaTrabAltoRiesgoTrabCon("+index+")' " +
	       "title='Ver el estado según los trabajos de alto riesgo asignados.'>" +
	       "<i class='fa fa-eye'></i> Ver estado" +
	    "</a>");

         var evidenciaSctr = "",evidenciaAuxiliarSctr = "";

         if(proyectoObj.habilitadoSctr == 1 && val.indicadorSctr != null){
            evidenciaSctr = (val.sctrNombreEvidencia.length == 0?"":"<br>" +
	       "<a class='efectoLink' target='_blank' href='"+urlArchivo(val.sctrEvidenciaUrl)+"'>"+
	          "<i class='fa fa-download'></i> Evidencia" +
	       "</a>");

            evidenciaAuxiliarSctr = (val.sctrNombreEvidenciaAuxiliar.length == 0?"":"<br>" +
 	       "<a class='efectoLink' target='_blank' href='"+urlArchivo(val.sctrEvidenciaAuxiliarUrl)+"'>"+
 	          "<i class='fa fa-download'></i> Evidencia auxiliar" +
 	       "</a>");
         }

         var nombreCompleto = (val.apellido.length == 0 && val.nombre.length == 0?"------":
            ((val.apellido.length == 0?"":val.apellido+", ")+(val.nombre.length == 0?"":val.nombre)));
         
         var textoTrabajosAltoRiesgoHabMedCli = (proyectoObj.habilitadoMedicoClinica == 1 && val.textoTrabajosAltoRiesgoHabMedCli.length > 0?"<br>["+val.textoTrabajosAltoRiesgoHabMedCli+"]":"");
		
         $("#tblConsolidadoTrabContAsig tbody").append(
            "<tr id='trTrabContratista"+val.id+"'>" +
	       "<td class='tdIconoEval'>"+textHabili+"</td>" +
             (proyectoObj.numTrabajosAltoRiesgoTotal == 0 || (proyectoObj.habilitadoConstanciaAltoRiesgo == 0 && proyectoObj.habilitarCargoInduccionTrabAltRie == 0 &&
              proyectoObj.habilitadoMedicoClinica == 0)?"":
              "<td>"+textoTrabajosAltoRiesgo+"</td>") +
	       "<td>"+nombreCompleto+"</td>" +
	       "<td style='word-break:break-all;'>"+(val.cliente.length == 0?"------":val.cliente)+"</td>" +
//	       "<td>"+(val.area.length == 0?"------":val.area)+"</td>" +
	       "<td>"+(val.cargo.length == 0?"------":val.cargo)+"</td>" +
	       "<td>"+val.tipoDocumento.nombre+"</td>" +
	       "<td>"+val.nroDocumento+"</td>" +
            (proyectoObj.habilitarEsConductor == 0?"":"<td>"+(val.esConductor == 1?"Sí":"No")+"</td>") +
            (proyectoObj.habilitarEsConductor == 0?"":"<td>"+textoConductorLic+"</td>") +
	        (proyectoObj.habilitadoEsPrevencionista == 0?"":"<td>"+estadoDocumentosTrabConObj.textoPrevencionista+"</td>") +
            (proyectoObj.habilitadoEsPrevencionista == 0 || proyectoObj.habilitadoEntrevistaPrevencionista == 0?"":
             "<td>"+estadoDocumentosTrabConObj.textoEntrevistaPrevencionista+"</td>") +
	        (proyectoObj.habilitadoCertAptMedica == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoExamen+"</td>") +
	        (proyectoObj.habilitadoSctr == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoSctr+evidenciaSctr+evidenciaAuxiliarSctr+"</td>") +
	        (proyectoObj.habilitadoEpp == 0?"":
	 	 "<td>"+estadoDocumentosTrabConObj.textoEpp+"</td>") +
	        (proyectoObj.habilitacionInduccion3 == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoInduccion+"</td>") +
	        (proyectoObj.habilitadoCargReglamento == 0?"":
	 	 "<td>"+estadoDocumentosTrabConObj.textoCargo+"</td>") +
	        (proyectoObj.habilitadoTRegistro == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoTreg+"</td>") +
	        (proyectoObj.habilitadoInduccSstCont == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoInduccionSst+"</td>") +
	        (proyectoObj.habilitadoPruebaCovid == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoPruebaCovid+"</td>") +
	        (proyectoObj.habilitadoVacunaCovid == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoVacunaCovid+"</td>") +
	        (proyectoObj.habilitadoCertifPolicial == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoCertificadoPolicial+"</td>") +
		(proyectoObj.habilitadoAntecedentesPenales == 0?"":
	         "<td>"+estadoDocumentosTrabConObj.textoAntecedentesPenales+"</td>") +
		(proyectoObj.habilitadoSeguroAccidentes == 0?"": 
		 "<td>"+estadoDocumentosTrabConObj.textoSeguroAccidentes+"</td>") +
		(proyectoObj.habilitadoRiesgoExposicionPuestoTrabajo == 0?"": 
	         "<td>"+estadoDocumentosTrabConObj.textoRiesgoExposicionPuestoTrabajo+"</td>") +
	        (proyectoObj.habilitadoVacunacionCovid == 0?"": 
		 "<td>"+estadoDocumentosTrabConObj.textoVacunacionCovid+"</td>") +
		(proyectoObj.habilitadoCarnetSanidad == 0?"": 
		 "<td>"+estadoDocumentosTrabConObj.textoCarnetSanidad+"</td>") +
	        (proyectoObj.habilitadoAcuerdoSeguridadEquElec == 0?"": 
		 "<td>"+estadoDocumentosTrabConObj.textoAcuerdoSeguridadEquElec+"</td>") +
		(proyectoObj.habilitadoEvaluacionToxicologica == 0?"": 
	         "<td>"+estadoDocumentosTrabConObj.textoEvaluacionToxicologica+"</td>") +
	        (proyectoObj.habilitadoCertifUnicoLaboral == 0?"": 
	         "<td>"+estadoDocumentosTrabConObj.textoCertifUnicoLaboral+"</td>") +
	        (proyectoObj.habilitadoAntecedentesPoliciales == 0?"": 
	         "<td>"+estadoDocumentosTrabConObj.textoAntecedentesPoliciales+"</td>") +
		(proyectoObj.habilitadoDeclaracionVerifDomicilio == 0?"": 
		 "<td>"+estadoDocumentosTrabConObj.textoDeclaracionVerifDomicilio+"</td>") +
		    (proyectoObj.habilitadoDotacionIndumentaria == 0?"":"<td>"+estadoDocumentosTrabConObj.textoDotacionIndumentaria+"</td>") +
            (proyectoObj.habilitadoMedicoClinica == 0?"":"<td>"+estadoDocumentosTrabConObj.textoHabilitadoMedicoClinica+textoTrabajosAltoRiesgoHabMedCli+"</td>") +
            (proyectoObj.habilitadoExamNivelTrabCont84 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont84+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont89 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont89+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont90 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont90+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont99 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont99+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont100 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont100+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont101 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont101+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont111 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont111+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont112 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont112+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont113 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont113+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont114 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont114+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont115 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont115+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont116 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont116+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont117 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont117+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont118 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont118+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont119 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont119+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont128 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont128+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont129 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont129+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont130 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont130+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont131 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont131+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont132 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont132+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont133 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont133+"</td>") +
             (proyectoObj.habilitadoExamNivelTrabCont134 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont134+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont140 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont140+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont141 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont141+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont142 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont142+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont143 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont143+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont144 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont144+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont145 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont145+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont146 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont146+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont147 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont147+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont148 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont148+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont149 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont149+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont150 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont150+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont151 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont151+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont152 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont152+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont153 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont153+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont154 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont154+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont155 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont155+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont156 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont156+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont157 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont157+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont158 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont158+"</td>") +
			 (proyectoObj.habilitadoExamNivelTrabCont159 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont159+"</td>") +
	        (proyectoObj.habilitadoHojaVida == 0?"":"<td>"+estadoDocumentosTrabConObj.textoHojaVida+"</td>") +
	       "<td>"+estadoDocumentosTrabConObj.textoSancion+"</td>" +
	    "</tr>");
      }
   });

   $.unblockUI();
}

function aplicarBuscadorIndicadorTrabajadorContratista(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    
   var valBuscarValorTrabajador = igualarStringBuscar($("#valBuscarValorConTrabContAsig").val());
   listTrabContratistaAsignadosBuscador = [];
   busquedaActivaTrabContAsig = 1;numPaginaActualTrabContAsig = 1;
  	
   listTrabContratistaAsignados.forEach(function(val,index){
      if(igualarStringBuscar(val.apellido).indexOf(valBuscarValorTrabajador) != -1 ||
	 igualarStringBuscar(val.nombre).indexOf(valBuscarValorTrabajador) != -1 || 
	 igualarStringBuscar(val.nroDocumento).indexOf(valBuscarValorTrabajador) != -1){
	 listTrabContratistaAsignadosBuscador.push(val);
      }
   }); 
   
   cambiarPaginaIndicadorTrabajadorContratista();
}

function reiniciarBuscadorIndicadorTrabajadorContratista(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   $("#valBuscarValorConTrabContAsig").val("").focus();
   busquedaActivaTrabContAsig = 0;numPaginaActualTrabContAsig = 1;
    
   cambiarPaginaIndicadorTrabajadorContratista();
}

function obtenerTablaClipboardIndicadorTrabajadorContratista(){
   var texto = obtenerDatosTablaEstandar("tblConsolidadoTrabContAsig"); 
   copiarAlPortapapeles(texto,"btnClipboardConTrabContAsig");
   
   $("#modalConsolidadoTrabContAsig").modal("hide");
   
   mensajeUx="<label>Los registros del consolidado se copiaron en el clipboard.</label>";
   mensajesUx(mensajeUx,1,"","CopiarTabla");

   $("#modalMensajeUxCopiarTabla").on("hidden.bs.modal",function(){
      $("#modalConsolidadoTrabContAsig").modal("show");
   });
}

function accesoAuxConstanciaTrabAltoRiesgoTrabCon(pindex){
   $("#modalConsolidadoTrabContAsig").modal("hide");

   trabContratistaAuxObj = (busquedaActivaTrabContAsig == 0?
      listTrabContratistaAsignados[pindex]:listTrabContratistaAsignadosBuscador[pindex]);

   verConstanciaTrabAltoRiesgoTrabCon(3,pindex);
}

function verEstadoConductorDesdeTrabContAsig(pindex){
   $("#modalConsolidadoTrabContAsig").modal("hide");

   var val = (busquedaActivaTrabContAsig == 0?
      listTrabContratistaAsignados[pindex]:listTrabContratistaAsignadosBuscador[pindex]);

   verConsolidadoConductoresEstadoActual(val.nroDocumento);
}

var listEquiposMovilesConsulta=[];

function ocultarConsolidadoEquiposMovilesConsulta(){
   $("#modalEquiposMovilesConsulta").modal("hide");$("#modalEstadoActualContratista").modal("show");
}

function verConsolidadoEquiposMovilesConsulta(){
   $("#modalEstadoActualContratista").modal("hide");$("#modalEquiposMovilesConsulta").remove();
    
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='ocultarConsolidadoEquiposMovilesConsulta()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";

   var buscadorOpciones = 
      "<button type='button' class='btn btn-success' title='Refresh' style='float:right;' " +
              "onclick='reiniciarBuscadorEquiposMovilesConsulta()'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button type='button' class='btn btn-success' onclick='aplicarBuscadorEquiposMovilesConsulta()' " + 
              "style='float:right;margin-right:5px;' title='Buscar los registros cuyo N° de identificación coincidan " +
              "con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input placeholder='N° de identificación' class='form-control' id='valBuscarValorEquiposMovilesConsulta' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";      
       
   var modalOptions={
      maxWidth:"90%",id:"modalEquiposMovilesConsulta",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-table'></i> Consolidado Equipos Móviles > contratista "+contratistaObj.nombre,
      contenido: 
	  "<div class='eventoGeneral-moderno'>" +
	 "<form class='form-inline'>" +
	     buttonVolver+buscadorOpciones +
	 "</form>" +
         "<div class='wrapper' id='wrapperEquiposMovilesConsulta'>" +
            "<table id='tblEquiposMovilesConsulta' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<td class='tb-acc' rowspan='2' style='width:200px'>¿Habilitado?</th>" +
	             "<td class='tb-acc' rowspan='2' style='width:250px'>Descripción</th>" +
	             "<td class='tb-acc' rowspan='2' style='width:250px'>N° de identificación</th>" +
		     "<td class='tb-acc' colspan='3' style='width:750px'>Certificado de operatividad</th>" +
		     "<td class='tb-acc' colspan='3' style='width:750px'>Certificado del último mantenimiento</th>" +
		  "</tr>" +
		  "<tr>" +
	             "<td class='tb-acc' style='width:250px'>Estado</th>" +
	             "<td class='tb-acc' style='width:250px'>Evidencia</th>" +
//	             "<td class='tb-acc' style='width:250px'>Observación</th>" +
	             "<td class='tb-acc' style='width:250px'>Evaluado el</th>" +
	             "<td class='tb-acc' style='width:250px'>Estado</th>" +
	             "<td class='tb-acc' style='width:250px'>Evidencia</th>" +
//	             "<td class='tb-acc' style='width:250px'>Observación</th>" +
	             "<td class='tb-acc' style='width:250px'>Evaluado el</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>" +
     "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperEquiposMovilesConsulta",240);
   cargarConsolidadoEquiposMovilesConsulta();
}

function cargarConsolidadoEquiposMovilesConsulta(){
   var dataParam={
      id: contratistaObj.id
   };

   callAjaxPost(URL+'/public/contratista/equipos_moviles/consulta',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listEquiposMovilesConsulta = data.listEquiposMoviles;
						
	 $("#tblEquiposMovilesConsulta tbody tr").remove();
		
	 listEquiposMovilesConsulta.forEach(function(val){	
	    var estadoCertifOperatividad = val.evaluacionEvidenciaOperatividad.icono+" "+val.evaluacionEvidenciaOperatividad.nombre;
	    var enlaceEviCertifOperatividad = (val.evidenciaOperatividadNombre.length == 0?"------":
	       "<a class='efectoLink' target='_blank' " +
		  "href='"+URL+"/public/contratista/equipo_movil/certf_operatividad/evidencia?id="+val.id+"'>" +
	          "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaOperatividadNombre +
	       "</a>");
	    var observacionCertifOperatividad = (val.evaluacionEvidenciaOperatividad.id != 2?"------":
	       (val.evaluacionEvidenciaOperatividad.observacion.length == 0?"------":val.evaluacionEvidenciaOperatividad.observacion));
	    var evaluacionCertifOperatividad = val.evaluacionEvidenciaOperatividad.fechaTexto+
	       (val.evaluacionEvidenciaOperatividad.usuario.nombre.length == 0?"":
		"<br>(Por "+val.evaluacionEvidenciaOperatividad.usuario.nombre+")");
	    
	    var estadoCertifMantenimiento = val.evaluacionEvidenciaMantenimiento.icono+" "+val.evaluacionEvidenciaMantenimiento.nombre;
	    var enlaceEviCertifMantenimiento = (val.evidenciaMantenimientoNombre.length == 0?"------":
	       "<a class='efectoLink' target='_blank' " +
		  "href='"+URL+"/public/contratista/equipo_movil/certf_mantenimiento/evidencia?id="+val.id+"'>" +
	          "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaMantenimientoNombre +
	       "</a>");
	    var observacionCertifMantenimiento = (val.evaluacionEvidenciaMantenimiento.id != 2?"------":
	       (val.evaluacionEvidenciaMantenimiento.observacion.length == 0?"------":val.evaluacionEvidenciaMantenimiento.observacion));
	    var evaluacionCertifMantenimiento = val.evaluacionEvidenciaMantenimiento.fechaTexto+
	       (val.evaluacionEvidenciaMantenimiento.usuario.nombre.length == 0?"":
		"<br>(Por "+val.evaluacionEvidenciaMantenimiento.usuario.nombre+")");
	    
	    var textHabilitado = (val.evaluacionEvidenciaOperatividad.id == 1 && 
	       val.evaluacionEvidenciaMantenimiento.id == 1?iconoGosst.aprobado:iconoGosst.desaprobado);
	    
	    $("#tblEquiposMovilesConsulta tbody").append(
	       "<tr id='trEquipoMovil"+val.id+"'>" +
	          "<td>"+textHabilitado+"</td>" +
	          "<td>"+val.descripcion+"</td>" +
		  "<td>"+val.identificador+"</td>" +
		  "<td>"+estadoCertifOperatividad+"</td>" + 
		  "<td style='word-break:break-all;'>"+enlaceEviCertifOperatividad+"</td>" + 
//		  "<td>"+observacionCertifOperatividad+"</td>" + 
		  "<td style='word-break:break-all;'>"+evaluacionCertifOperatividad+"</td>" + 
		  "<td>"+estadoCertifMantenimiento+"</td>" + 
		  "<td style='word-break:break-all;'>"+enlaceEviCertifMantenimiento+"</td>" + 
//		  "<td>"+observacionCertifMantenimiento+"</td>" + 
		  "<td style='word-break: break-all;'>"+evaluacionCertifMantenimiento+"</td>" + 
	       "</tr>");
	 });
	      
	 goheadfixedY("#tblEquiposMovilesConsulta","#wrapperEquiposMovilesConsulta");
      }else{
         console.log("Error al cargar el consolidado - Equipos móviles");
      }
   });    
}

function aplicarBuscadorEquiposMovilesConsulta(){
   var valorBuscador = igualarStringBuscar($("#valBuscarValorEquiposMovilesConsulta").val());

   listEquiposMovilesConsulta.forEach(function(val,index){
      if(igualarStringBuscar(val.identificador).indexOf(valorBuscador) != -1){
         $("#trEquipoMovil"+val.id).show();
      }else{
         $("#trEquipoMovil"+val.id).hide();
      }
   });
}

function reiniciarBuscadorEquiposMovilesConsulta(){
   $("#valBuscarValorEquiposMovilesConsulta").val("").focus();

   listEquiposMovilesConsulta.forEach(function(val,index){
      $("#trEquipoMovil"+val.id).show();
   });
}

var listConsolidadoConductoresEstado = [];

function volverConsolidadoConductoresEstadoActual(){
   $("#modalConsolidadoConductorEstadoActual").modal("hide");$("#modalEstadoActualContratista").modal("show");
}

function verConsolidadoConductoresEstadoActual(prefiltroConductor){
   $("#modalEstadoActualContratista").modal("hide");$("#modalConsolidadoConductorEstadoActual").remove();

   var contenidoColumnaTipoLicCond = "";
   
   listTipoLicencias.forEach(function(val,index){
      contenidoColumnaTipoLicCond += "<th class='tb-acc' style='width:430px'>"+val.nombre+"</th>";
   });
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverConsolidadoConductoresEstadoActual()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
	  
    var buttonPdf =
	  	"<button type='button' class='btn btn-success' title='Descargar toda la data del consolidado en un pdf.' " +
	  	  	    "onclick='verValoresPdfConsolidadoConductoresEstadoActual()'>" +
	  	    "<i class='fa fa-file-text-o fa-2x'></i>" +
	  	"</button>";
   
   var buscadorOpciones = 
      "<button type='button' class='btn btn-success' title='Refresh' style='float:right;' " +
              "onclick='reiniciarBuscadorConductoresEstadoActual()'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button type='button' class='btn btn-success' onclick='aplicarBuscadorConductoresEstadoActual()' " + 
              "style='float:right;margin-right:5px;' title='Buscar los registros cuyo N° documento, nombre o apellido " + 
	      "del conductor coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input placeholder='N° documento, nombre o apellido' class='form-control' id='valBuscarValorConductoresEstadoActual' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>" +
      "<label style='float:right;margin-right:5px;margin-top:10px;'>[Fecha de trabajo: "+fechaTrabajoTexto+"]</label>";
   
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoConductorEstadoActual",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-table'></i> Consolidado conductores - Estado actual",
      contenido: 
	     "<div class='eventoGeneral-moderno'>" +
         "<form class='form-inline'>" +
             buttonVolver+buttonPdf+buscadorOpciones +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoConductorEstadoActual'>" +
            "<table id='tblConsolidadoConductorEstadoActual' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:150px'>Cumple (nivel conductor)</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:300px'>Conductor</th>" +
		     "<th class='tb-acc' colspan='"+numTipoLicCondHabilitados+"' style='width:"+(numTipoLicCondHabilitados*430)+"px'>Tipo de licencia conductor</th>" +
	          "</tr>" +
	          "<tr>" +
		      contenidoColumnaTipoLicCond +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>" +
     "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   resizeDivWrapper("wrapperConsolidadoConductorEstadoActual",240);
   cargarConsolidadoConductoresEstadoActual(prefiltroConductor);
}

function cargarConsolidadoConductoresEstadoActual(prefiltroConductor){
   var dataParam={
      conductoresInfoAux:listConductores,fechaReferencia:proyectoObj.fechaReferencia
   };

   callAjaxPost(URL+'/contratista/conductor/consolidado_estado_actual',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listConsolidadoConductoresEstado = data.listConsolidadoConductoresEstado;
 	 
 	 $("#tblConsolidadoConductorEstadoActual tbody tr").remove();
 	 
 	 listConsolidadoConductoresEstado.forEach(function(val){
 	    var styleVehiculoCiudad = (val.estadoActualVehiculoCiudadTotal == "No aplica"?"":"style='text-align:left;'"),
	        styleVehiculo4x4 = (val.estadoActualVehiculo4x4Total == "No aplica"?"":"style='text-align:left;'"),
	        styleCamionCisterna = (val.estadoActualCamionCisternaTotal == "No aplica"?"":"style='text-align:left;'"),
	        styleMaquinariaGrua = (val.estadoActualMaquinariaGruaTotal == "No aplica"?"":"style='text-align:left;'"),
	        styleLineaAmarilla = (val.estadoActualLineaAmarillaTotal == "No aplica"?"":"style='text-align:left;'"),
	        styleVehiculosLivianos = (val.estadoActualVehiculosLivianosTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleVehiculosPesados = (val.estadoActualVehiculosPesadosTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleCamionesGruas = (val.estadoActualCamionesGruasTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleVehiculosIndustriales = (val.estadoActualVehiculosIndustrialesTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleMaquinariaPesada = (val.estadoActualMaquinariaPesadaTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleTipoLicCond11 = (val.estadoActualTipoLicCond11Total == "No aplica"?"":"style='text-align:left;'"),
	        styleTipoLicCond12 = (val.estadoActualTipoLicCond12Total == "No aplica"?"":"style='text-align:left;'"),
	        styleTipoLicCond13 = (val.estadoActualTipoLicCond13Total == "No aplica"?"":"style='text-align:left;'"),
	        styleTipoLicCond14 = (val.estadoActualTipoLicCond14Total == "No aplica"?"":"style='text-align:left;'"),
	        styleTipoLicCond15 = (val.estadoActualTipoLicCond15Total == "No aplica"?"":"style='text-align:left;'"),
	        styleTipoLicCond16 = (val.estadoActualTipoLicCond16Total == "No aplica"?"":"style='text-align:left;'");
 	     
 	    $("#tblConsolidadoConductorEstadoActual tbody").append(
 	       "<tr id='trConductor"+val.id+"'>" +
 	          "<td>"+val.habilitado+"</td>" +
 	          "<td>"+val.trabContratista.nombre+"</td>" +
	           (mapTipoLicenciaCondHabilitada.get(1) == 1?"<td "+styleVehiculoCiudad+">"+val.estadoActualVehiculoCiudadTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(2) == 1?"<td "+styleVehiculo4x4+">"+val.estadoActualVehiculo4x4Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(3) == 1?"<td "+styleCamionCisterna+">"+val.estadoActualCamionCisternaTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(4) == 1?"<td "+styleMaquinariaGrua+">"+val.estadoActualMaquinariaGruaTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(5) == 1?"<td "+styleLineaAmarilla+">"+val.estadoActualLineaAmarillaTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(6) == 1?"<td "+styleVehiculosLivianos+">"+val.estadoActualVehiculosLivianosTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(7) == 1?"<td "+styleVehiculosPesados+">"+val.estadoActualVehiculosPesadosTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(8) == 1?"<td "+styleCamionesGruas+">"+val.estadoActualCamionesGruasTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(9) == 1?"<td "+styleVehiculosIndustriales+">"+val.estadoActualVehiculosIndustrialesTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(10) == 1?"<td "+styleMaquinariaPesada+">"+val.estadoActualMaquinariaPesadaTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(11) == 1?"<td "+styleTipoLicCond11+">"+val.estadoActualTipoLicCond11Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(12) == 1?"<td "+styleTipoLicCond12+">"+val.estadoActualTipoLicCond12Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(13) == 1?"<td "+styleTipoLicCond13+">"+val.estadoActualTipoLicCond13Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(14) == 1?"<td "+styleTipoLicCond14+">"+val.estadoActualTipoLicCond14Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(15) == 1?"<td "+styleTipoLicCond15+">"+val.estadoActualTipoLicCond15Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(16) == 1?"<td "+styleTipoLicCond16+">"+val.estadoActualTipoLicCond16Total+"</td>":"") +
 	       "</tr>");
 	 });

 	 if(prefiltroConductor != null && prefiltroConductor.length > 0){
 	    $("#valBuscarValorConductoresEstadoActual").val(prefiltroConductor);
 	    aplicarBuscadorConductoresEstadoActual();
 	 }
      }else{
         console.log("NOPNPO");
      }

      goheadfixedY("#tblConsolidadoConductorEstadoActual","#wrapperConsolidadoConductorEstadoActual");
   });
}

function aplicarBuscadorConductoresEstadoActual(){
   var valorBuscador = igualarStringBuscar($("#valBuscarValorConductoresEstadoActual").val());

   listConsolidadoConductoresEstado.forEach(function(val){
      if(igualarStringBuscar(val.trabContratista.nombre).indexOf(valorBuscador) != -1){
         $("#trConductor"+val.id).show();
      }else{
         $("#trConductor"+val.id).hide();
      }
   });
}

function reiniciarBuscadorConductoresEstadoActual(){
   $("#valBuscarValorConductoresEstadoActual").val("").focus();

   listConsolidadoConductoresEstado.forEach(function(val){
      $("#trConductor"+val.id).show();
   });
}

var listConductoresFiltroPdf = [];

function ocultarValoresPdfConsolidadoConductoresEstadoActual(){
    $("#modalConsolidadoPdfCondEstadoActual").modal("hide");$("#modalConsolidadoConductorEstadoActual").modal("show");
}

function verValoresPdfConsolidadoConductoresEstadoActual(){
    $("#modalConsolidadoConductorEstadoActual").modal("hide");$("#modalConsolidadoPdfCondEstadoActual").remove();  
    
	listConductoresFiltroPdf = listConductores;
   
   	var contenido = "";
    
    var listContenido=[
	 	{label:"Conductores",inputForm:"",idDivContainer:"divPdfCond"},
	 	{label:"Detalle de la actividad",inputForm:"<textarea class='form-control' id='textAreaDetallePdfCond' rows='5'></textarea>"},
	 	{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
	 	{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarValoresPdfConsolidadoConductoresEstadoActual()'>" +
	               "<i class='fa fa-times'></i> Cancelar" +
	           "</button>",
         inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='descargarPdfConsolidadoConductoresEstadoActual()'>" +
           	           "<i class='fa fa-download'></i> Descargar" +
           	       "</button>"}
    ];
	    
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
    });
	
    var modalOptions={
	 	id:"modalConsolidadoPdfCondEstadoActual",nombre:"<i class='fa fa-file-text-o'></i> Valores PDF Consolidado conductores - Estado actual",
	 	contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    };
      
    crearModalPrincipalUsuario(modalOptions,function(){
	 	crearSelectOneMenuObligMultipleCompleto("selMulConductoresPdf","",listConductoresFiltroPdf,"id","trabContratistaNombreAux","#divPdfCond","Todos");
    },true,true);
}

function descargarPdfConsolidadoConductoresEstadoActual(){
    var detalleActividad = $("#textAreaDetallePdfCond").val();
   
    var listConductoresId = [];
    var condAsigId = $("#selMulConductoresPdf").val();
   
    if(condAsigId != null && condAsigId.length > 0){
        condAsigId.forEach(function(val){
	 		listConductoresId.push(parseInt(val));
      	});
   	}else{
        listConductoresFiltroPdf.forEach(function(val){
	 		listConductoresId.push(parseInt(val.id));
      	});
   	}
   
    var dataParam={
        contratistaId:contratistaObj.id,detalleActividad:encodeURIComponent(detalleActividad || ""),listConductoresId:listConductoresId.join(",")
    };

    descargarArchivoPost(URL+"/contratista/conductor/descarga_pdf/consolidado_estado_actual",dataParam);
   
    ocultarValoresPdfConsolidadoConductoresEstadoActual();
}

function volverConsolidadoVehiculosMaquinariasEstadoActual(){
   $("#modalConsolidadoVehiculoMaquinariaEstadoActual").modal("hide");$("#modalEstadoActualContratista").modal("show");
}

function verConsolidadoVehiculosMaquinariasEstadoActual(){
   $("#modalEstadoActualContratista").modal("hide");$("#modalConsolidadoVehiculoMaquinariaEstadoActual").remove();
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverConsolidadoVehiculosMaquinariasEstadoActual()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
	  
    var buttonPdf =
	  	"<button type='button' class='btn btn-success' title='Descargar toda la data del consolidado en un pdf.' " +
	  	  	  	"onclick='verValoresPdfConsolidadoVehiculosMaquinariasEstadoActual()'>" +
	  	    "<i class='fa fa-file-text-o fa-2x'></i>" +
	  	"</button>";

   var buscadorOpciones = 
      "<button type='button' class='btn btn-success' title='Refresh' style='float:right;' " +
              "onclick='reiniciarBuscadorVehiculosMaquinariasEstadoActual()'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button type='button' class='btn btn-success' onclick='aplicarBuscadorVehiculosMaquinariasEstadoActual()' " + 
              "style='float:right;margin-right:5px;' title='Buscar los registros cuya placa del vehículo/maquinaria " +
              "coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input placeholder='Placa' class='form-control' id='valBuscarValorVehiculosMaquinariasEstadoActual' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>" +
      "<label style='float:right;margin-right:5px;margin-top:10px;'>[Fecha de trabajo: "+fechaTrabajoTexto+"]</label>";      
   
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoVehiculoMaquinariaEstadoActual",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-table'></i> Consolidado vehículos/maquinarias - Estado actual",
      contenido: 
	  "<div class='eventoGeneral-moderno'>" +
	 "<form class='form-inline'>" +
             buttonVolver+buttonPdf+buscadorOpciones +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoVehiculoMaquinariaEstadoActual'>" +
            "<table id='tblConsolidadoVehiculoMaquinariaEstadoActual' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:150px'>¿Habilitado?</th>" +
	             "<th class='tb-acc' colspan='6' style='width:1500px'>Vehículo/Maquinaria</th>" +
		         "<th class='tb-acc' colspan='18' style='width:4800px'>Documentos a nivel vehículo/maquinaria</th>" +
			     "<th class='tb-acc' rowspan='2' style='width:150px'>¿Sin sanciones en curso?</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:250px'>Placa</th>" +
		     "<th class='tb-acc' style='width:250px'>Tipo</th>" +
		     "<th class='tb-acc' style='width:250px'>Marca</th>" +
		     "<th class='tb-acc' style='width:250px'>Año de fabricación</th>" +
		     "<th class='tb-acc' style='width:250px'>Detalle</th>" +
		     "<th class='tb-acc' style='width:250px'>Proyecto asignado</th>" +
		     "<th class='tb-acc' style='width:300px'>Check list de ingreso</th>" +
		     "<th class='tb-acc' style='width:300px'>Inspección técnica</th>" +
		     "<th class='tb-acc' style='width:300px'>Póliza contra todo riesgo</th>" +
		     "<th class='tb-acc' style='width:300px'>SOAT</th>" +
		     "<th class='tb-acc' style='width:300px'>Tarjeta/Constancia de propiedad del equipo</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de operatividad</th>" +
		     "<th class='tb-acc' style='width:300px'>Programa de mantenimiento preventivo</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de mantenimiento preventivo</th>" +
		     "<th class='tb-acc' style='width:300px'>Permiso especial para el transporte de mercancía</th>" +
		     "<th class='tb-acc' style='width:300px'>Póliza TREC</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de opacidad</th>" +
		     "<th class='tb-acc' style='width:300px'>Manual del equipo/Ficha técnica</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado DGH - Osinergmin</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de cubicación y hermeticidad</th>" +
		     "<th class='tb-acc' style='width:300px'>Tarjeta de circulación emitida por el MTC</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de gravamen vehicular</th>" +
		     "<th class='tb-acc' style='width:300px'>Verificación - GPS vehicular</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de hermeticidad de la bombona</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>" +
     "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoVehiculoMaquinariaEstadoActual",240);
   cargarConsolidadoVehiculosMaquinariasEstadoActual();
}

function cargarConsolidadoVehiculosMaquinariasEstadoActual(){
   var dataParam={
      vehiculosMaquinariasInfoAux:listVehiculosMaquinarias,fechaReferencia:proyectoObj.fechaReferencia
   };
    
   callAjaxPost(URL+'/contratista/vehiculo_maquinaria/consolidado_estado_actual',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 var listConsolidadoVehiculosMaquinariasEstado = data.listConsolidadoVehiculosMaquinariasEstado;
 	 
 	 $("#tblConsolidadoVehiculoMaquinariaEstadoActual tbody tr").remove();
 	 
 	 listConsolidadoVehiculosMaquinariasEstado.forEach(function(val){
 	    var proyectoAsignadoTexto = (val.proyectoAsignadoTexto.length == 0?"------":val.proyectoAsignadoTexto),
 	        detalle = (val.detalle.length == 0?"------":val.detalle),hasSancion = (val.indicadorBlacklist != null?
			iconoGosst.desaprobado+" Sí <br><strong>(Hasta "+val.indicadorBlacklist+")</strong>":iconoGosst.aprobado+" No");
 	     
 	    $("#tblConsolidadoVehiculoMaquinariaEstadoActual tbody").append(
 	       "<tr id='trVehMaq"+val.id+"'>" +
 	          "<td>"+val.habilitado+"</td>" +
 	          "<td>"+val.placa+"</td>" +
 	          "<td>"+val.tipoLicenciaConductor.nombre+"</td>" +
 	          "<td>"+val.marca+"</td>" +
 	          "<td>"+val.anioFabricacion+"</td>" +
 	          "<td style='word-break:break-all;'>"+detalle+"</td>" +
 	          "<td style='word-break:break-all;'>"+proyectoAsignadoTexto+"</td>" +
 	          "<td>"+val.estadoActualCheckListIngreso+"</td>" +
 	          "<td>"+val.estadoActualInspeccionTecnica+"</td>" +
 	          "<td>"+val.estadoActualPolizaContraTodo+"</td>" +
 	          "<td>"+val.estadoActualSoat+"</td>" +
 	          "<td>"+val.estadoActualTarjetaConstanciaPropiedadEquipo+"</td>" +
 	          "<td>"+val.estadoActualCertificadoOperatividad+"</td>" +
 	          "<td>"+val.estadoActualProgMantenimientoPreventivo+"</td>" +
 	          "<td>"+val.estadoActualCertifMantenimientoPreventivo+"</td>" +
 	          "<td>"+val.estadoActualPermisoEspecialTransporteMercancia+"</td>" +
 	          "<td>"+val.estadoActualPolizaTrec+"</td>" +
 	          "<td>"+val.estadoActualCertificadoOpacidad+"</td>" +
 	          "<td>"+val.estadoActualManualEquipoFichaTecnica+"</td>" +
 	          "<td>"+val.estadoActualCertificadoDghOsinergmin+"</td>" +
 	          "<td>"+val.estadoActualCertifCubicacionHermeticidad+"</td>" +
 	          "<td>"+val.estadoActualTarjetaCirculacionMtc+"</td>" +
 	          "<td>"+val.estadoActualCertifGravamenVehicular+"</td>" +
	          "<td>"+val.estadoActualVerifGpsVehicular+"</td>" +
	          "<td>"+val.estadoActualExamNivelVehMaq18+"</td>" +
			  "<td>"+hasSancion+"</td>" +
 	       "</tr>");
 	 });
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblConsolidadoVehiculoMaquinariaEstadoActual","#wrapperConsolidadoVehiculoMaquinariaEstadoActual");
   });
}

function aplicarBuscadorVehiculosMaquinariasEstadoActual(){
   var valorBuscador = igualarStringBuscar($("#valBuscarValorVehiculosMaquinariasEstadoActual").val());

   listVehiculosMaquinarias.forEach(function(val,index){
      if(igualarStringBuscar(val.placa).indexOf(valorBuscador) != -1){
         $("#trVehMaq"+val.id).show();
      }else{
         $("#trVehMaq"+val.id).hide();
      }
   });
}

function reiniciarBuscadorVehiculosMaquinariasEstadoActual(){
   $("#valBuscarValorVehiculosMaquinariasEstadoActual").val("").focus();

   listVehiculosMaquinarias.forEach(function(val,index){
      $("#trVehMaq"+val.id).show();
   });
}

var listVehiculosMaquinariasFiltroPdf = [];

function ocultarValoresPdfConsolidadoVehiculosMaquinariasEstadoActual(){
    $("#modalConsolidadoPdfVehMaqEstadoActual").modal("hide");$("#modalConsolidadoVehiculoMaquinariaEstadoActual").modal("show");
}

function verValoresPdfConsolidadoVehiculosMaquinariasEstadoActual(){
    $("#modalConsolidadoVehiculoMaquinariaEstadoActual").modal("hide");$("#modalConsolidadoPdfVehMaqEstadoActual").remove();  
    
    listVehiculosMaquinariasFiltroPdf = listVehiculosMaquinarias;
   
    var contenido = "";
	  		
	var listContenido=[
	  	{label:"Vehículos/Maquinarias",inputForm:"",idDivContainer:"divPdfVehMaq"},
	    {label:"Detalle de la actividad",inputForm:"<textarea id='textAreaDetallePdfVehMaq' class='form-control' rows='5'></textarea>"},
	  	{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
	  	{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarValoresPdfConsolidadoVehiculosMaquinariasEstadoActual()'>" +
	  		       "<i class='fa fa-times'></i> Cancelar" +
	  		   "</button>",
	     inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='descargarPdfConsolidadoVehiculosMaquinariasEstadoActual()'>" +
	  		           "<i class='fa fa-download'></i> Descargar" +
	  		       "</button>"}
    ];
	  			    
	listContenido.forEach(function(val){
	    contenido += obtenerSubPanelModuloVersionTres(val);
	});
	  		
	var modalOptions={
	    id:"modalConsolidadoPdfVehMaqEstadoActual",nombre:"<i class='fa fa-file-text-o'></i> Valores PDF Consolidado vehículos/maquinarias - Estado actual",
	  	contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
	};
	  			
	crearModalPrincipalUsuario(modalOptions,function(){
	    crearSelectOneMenuObligMultipleCompleto("selMulVehiculosMaquinariasPdf","",listVehiculosMaquinariasFiltroPdf,"id","placa","#divPdfVehMaq","Todos");
	},true,true);
}

function descargarPdfConsolidadoVehiculosMaquinariasEstadoActual(){
    var detalleActividad = $("#textAreaDetallePdfVehMaq").val();
   
    var listVehiculosMaquinariasId = [];
    var vehMaqAsigId = $("#selMulVehiculosMaquinariasPdf").val();
   
    if(vehMaqAsigId != null && vehMaqAsigId.length > 0){
        vehMaqAsigId.forEach(function(val){
	        listVehiculosMaquinariasId.push(parseInt(val));
        });
    }else{
        listVehiculosMaquinariasFiltroPdf.forEach(function(val){
	        listVehiculosMaquinariasId.push(parseInt(val.id));
        });
    }
	
	var dataParam={
		contratistaId:contratistaObj.id,detalleActividad:encodeURIComponent(detalleActividad || ""),listVehiculosMaquinariasId:listVehiculosMaquinariasId.join(",")
	};

	descargarArchivoPost(URL+"/contratista/vehiculo_maquinaria/descarga_pdf/consolidado_estado_actual",dataParam);
   
    ocultarValoresPdfConsolidadoVehiculosMaquinariasEstadoActual();
}

function volverConsolidadoEquiposHerramientasEstadoActual(){
   $("#modalConsolidadoEquipoHerramientaEstadoActual").modal("hide");$("#modalEstadoActualContratista").modal("show");
}

function verConsolidadoEquiposHerramientasEstadoActual(){
   $("#modalEstadoActualContratista").modal("hide");$("#modalConsolidadoEquipoHerramientaEstadoActual").remove();
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverConsolidadoEquiposHerramientasEstadoActual()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
	  
   var buscadorOpciones = 
      "<button type='button' class='btn btn-success' title='Refresh' style='float:right;' " +
              "onclick='reiniciarBuscadorEquiposHerramientasEstadoActual()'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +		          
      "<button type='button' class='btn btn-success' onclick='aplicarBuscadorEquiposHerramientasEstadoActual()' " + 
              "style='float:right;margin-right:5px;' title='Buscar los registros cuyo código del equipo/herramienta " +
              "coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input placeholder='Código' class='form-control' id='valBuscarValorEquiposHerramientasEstadoActual' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>" +
      "<label style='float:right;margin-right:5px;margin-top:10px;'>[Fecha de trabajo: "+fechaTrabajoTexto+"]</label>";      
   
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoEquipoHerramientaEstadoActual",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-table'></i> Consolidado equipos/herramientas - Estado actual",
      contenido: 
	  "<div class='eventoGeneral-moderno'>" +
	 "<form class='form-inline'>" +
	     buttonVolver+buscadorOpciones +
	 "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoEquipoHerramientaEstadoActual'>" +
            "<table id='tblConsolidadoEquipoHerramientaEstadoActual' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:150px'>¿Habilitado?</th>" +
		     "<th class='tb-acc' colspan='5' style='width:1250px'>Equipo/Herramienta</th>" +
		     "<th class='tb-acc' colspan='2' style='width:600px'>Documentos a nivel equipo/herramienta</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:250px'>Código</th>" +
		     "<th class='tb-acc' style='width:250px'>Tipo</th>" +
		     "<th class='tb-acc' style='width:250px'>Descripción</th>" +
		     "<th class='tb-acc' style='width:250px'>Año de fabricación</th>" +
		     "<th class='tb-acc' style='width:250px'>Proyecto asignado</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de operatividad</th>" +
		     "<th class='tb-acc' style='width:300px'>Inspección</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>" +
     "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoEquipoHerramientaEstadoActual",240);
   cargarConsolidadoEquiposHerramientasEstadoActual();
}

function cargarConsolidadoEquiposHerramientasEstadoActual(){
   var dataParam={
      equiposHerramientasInfoAux:listEquiposHerramientas,fechaReferencia:proyectoObj.fechaReferencia
   };
    
   callAjaxPost(URL+'/contratista/equipo_herramienta/consolidado_estado_actual',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 var listConsolidadoEquiposHerramientasEstado = data.listConsolidadoEquiposHerramientasEstado;
 	 
 	 $("#tblConsolidadoEquipoHerramientaEstadoActual tbody tr").remove();
 	 
 	 listConsolidadoEquiposHerramientasEstado.forEach(function(val,index){ 	    
 	    var proyectoAsignadoTexto = (val.proyectoAsignadoTexto.length == 0?"------":val.proyectoAsignadoTexto);
 		             
 	    $("#tblConsolidadoEquipoHerramientaEstadoActual tbody").append(
 	       "<tr id='trEquHerr"+val.id+"'>" +
 	          "<td>"+val.habilitado+"</td>" +
 	          "<td>"+val.codigo+"</td>" +
 	          "<td>"+val.tipoEquipoHerramienta.nombre+"</td>" +
 	          "<td style='word-break:break-all;'>"+val.descripcion+"</td>" +
 	          "<td>"+val.anioFabricacion+"</td>" +
 	          "<td style='word-break:break-all;'>"+proyectoAsignadoTexto+"</td>" +
 	          "<td>"+val.estadoActualCertificadoOperatividad+"</td>" +
 	          "<td>"+val.estadoActualInspeccion+"</td>" +
 	       "</tr>");
 	 });
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblConsolidadoEquipoHerramientaEstadoActual","#wrapperConsolidadoEquipoHerramientaEstadoActual");
   });
}

function aplicarBuscadorEquiposHerramientasEstadoActual(){
   var valorBuscador = igualarStringBuscar($("#valBuscarValorEquiposHerramientasEstadoActual").val());

   listEquiposHerramientas.forEach(function (val,index){
      if(igualarStringBuscar(val.codigo).indexOf(valorBuscador) != -1){
         $("#trEquHerr"+val.id).show();
      }else{
         $("#trEquHerr"+val.id).hide();
      }
   });
}

function reiniciarBuscadorEquiposHerramientasEstadoActual(){
   $("#valBuscarValorEquiposHerramientasEstadoActual").val("").focus();

   listEquiposHerramientas.forEach(function(val,index){
      $("#trEquHerr"+val.id).show();
   });
}

var listEquiposHerramientasFiltroPdf = [];

function ocultarValoresPdfConsolidadoEquiposHerramientasEstadoActual(){
   $("#modalConsolidadoPdfEquHerrEstadoActual").modal("hide");$("#modalEstadoActualContratista").modal("show");
}

function verValoresPdfConsolidadoEquiposHerramientasEstadoActual(){
   $("#modalEstadoActualContratista").modal("hide");$("#modalConsolidadoPdfEquHerrEstadoActual").remove();  
    
   var dataParam={ 
      contratistaId:contratistaObj.id
   };
   
   callAjaxPost(URL+'/contratista/equipo_herramienta/descarga_pdf/filtro',dataParam,function(data){
      listEquiposHerramientasFiltroPdf = data.listEquiposHerramientasSimple;
   
      var contenido = "";
    
      var listContenido=[
	 {sugerencia:"",label:"Equipos/Herramientas",inputForm:"",divContainer:"divPdfEquHerr"},
	 {sugerencia:"",label:"Detalle de la actividad",
	  inputForm:"<textarea class='form-control' id='textAreaDetallePdfEquHerr' rows='5'></textarea>",
	  divContainer:""},
	 {sugerencia:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",
	  label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	  		"onclick='ocultarValoresPdfConsolidadoEquiposHerramientasEstadoActual()'>" +
	           "<i class='fa fa-times'></i> Cancelar" +
	        "</button>",
          inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
           		    "onclick='descargarPdfConsolidadoEquiposHerramientasEstadoActual()'>" +
           	       "<i class='fa fa-download'></i> Descargar" +
           	    "</button>"}
      ];
	    
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloGeneral(val);
      });
	
      var modalOptions={
	 id:"modalConsolidadoPdfEquHerrEstadoActual",
	 nombre:"<i class='fa fa-file-text-o'></i> Valores PDF Consolidado equipos/herramientas - Estado actual",
	 contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
      };
      console.log(listEquiposHerramientasFiltroPdf);
      crearModalPrincipalUsuario(modalOptions,function(){
	 crearSelectOneMenuObligMultipleCompleto("selMulEquiposHerramientasPdf","",listEquiposHerramientasFiltroPdf,
            "id","codigo","#divPdfEquHerr","Todos");
      },true,true);
   });
}

function descargarPdfConsolidadoEquiposHerramientasEstadoActual(){
   var detalleActividad = $("#textAreaDetallePdfEquHerr").val();
   
   var listEquiposHerramientasId = [];
   var equHerrAsigId = $("#selMulEquiposHerramientasPdf").val();
   
   if(equHerrAsigId != null){
      equHerrAsigId.forEach(function(val){
	 listEquiposHerramientasId.push(parseInt(val));
      });
   }else{
      listEquiposHerramientasFiltroPdf.forEach(function(val){
	 listEquiposHerramientasId.push(parseInt(val.id));
      });
   }
   
   window.open(URL+"/contratista/equipo_herramienta/descarga_pdf/consolidado_estado_actual?contratistaId="+contratistaObj.id +
      "&detalleActividad="+detalleActividad+"&listEquiposHerramientasId="+listEquiposHerramientasId,'_blank'); 
   
   $("#modalConsolidadoPdfEquHerrEstadoActual").modal("hide");
}

function descargarExcelConsolidadoTrabajadorContratistaColaborador(){
    window.open(URL+"/contratista/excel/consolidado_trabajador_contratista?"+"id="+proyectoObj.id+"&contratistaId="+proyectoObj.contratistaId+"&fechaReferencia="+proyectoObj.fechaReferencia);
}
