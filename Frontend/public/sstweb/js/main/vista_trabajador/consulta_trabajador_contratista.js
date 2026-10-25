
var listTrabajadoresContratistaBuscadorAux = [],listProyectosAsignadosActivos = [];

function verAutoCompletarTrabajadorContratistaConsulta(){
   var contratistaId = parseInt($("#selContratistaConsulta").val());
   var trabajadorContratista = $("#inputTrabajadorContratistaConsulta").val().trim();
   
   document.getElementById("inputTrabajadorContratistaConsulta").disabled = (contratistaId != -1?false:true); 

   if(contratistaId != -1){
      if(trabajadorContratista.length >= 3){
         var dataParam={
	    nombre:"%"+trabajadorContratista+"%",isBuscador:1,contratistaId:contratistaId
         };

         callAjaxPostNoLoad(URL+"/contratista/trabajadores/buscar/simple",dataParam,function(data){
	    listTrabajadoresContratistaBuscadorAux = (data.trabajadores.length == 0?[{id:-1,nombre:"No encontrado"}]:data.trabajadores);
	   
    	    var selAutoTrabajadorContratistaConsulta = crearSelectOneMenuOblig("selAutoTrabajadorContratistaConsulta",
    	       "buscarProyectoAsignadoTrabContConsulta()",listTrabajadoresContratistaBuscadorAux,"","id","nombre");
	
    	    $("#divAutoCompletarTrabajadorContratistaConsulta").html(selAutoTrabajadorContratistaConsulta);
    	    $("#inputTrabajadorContratistaConsulta").attr("onkeyup","verAutoCompletarTrabajadorContratistaConsulta()");
    	    
    	    buscarProyectoAsignadoTrabContConsulta();
         });
      }else{
         listTrabajadoresContratistaBuscadorAux = [{id:-1,nombre:"No encontrado"}];
	     
         var selAutoTrabajadorContratistaConsulta = crearSelectOneMenuOblig("selAutoTrabajadorContratistaConsulta","",
	    listTrabajadoresContratistaBuscadorAux,"","id","nombre");
	    		       
         $("#divAutoCompletarTrabajadorContratistaConsulta").html(selAutoTrabajadorContratistaConsulta);
         $("#inputTrabajadorContratistaConsulta").attr("onkeyup","verAutoCompletarTrabajadorContratistaConsulta()");
         
         buscarProyectoAsignadoTrabContConsulta();
      }
   }else{
      $("#inputTrabajadorContratistaConsulta").val("");$("#divAutoCompletarTrabajadorContratistaConsulta").html("");
      $("#divSelAutoProyectoAsignadoActivo").html("<label style='color:red;'>* Debe seleccionar un trabajador.</label>");
   }
}

function buscarProyectoAsignadoTrabContConsulta(){
   var idContratista = parseInt($("#selContratistaConsulta").val());
   var idTrabajadorContratista = parseInt($("#selAutoTrabajadorContratistaConsulta").val());
   
   if(idTrabajadorContratista != -1){
      var dataParam={
         id:idTrabajadorContratista,contratistaId:idContratista
      };
	  		
      callAjaxPostNoLoad(URL+"/contratista/trabajadores/proyecto_asignado",dataParam,function(data){
         listProyectosAsignadosActivos = (data.listProyectosAsignados.length > 0?data.listProyectosAsignados:
            [{id:-1,titulo:"Sin proyectos asignados en curso"}]);
         
         var selProyectoTrabContConsulta = crearSelectOneMenuOblig("selProyectoTrabContConsulta",
	    "",listProyectosAsignadosActivos,"","id","titulo");
	  	       
	 $("#divSelAutoProyectoAsignadoActivo").html(selProyectoTrabContConsulta);
      });
   }else{
      $("#divSelAutoProyectoAsignadoActivo").html("<label style='color:red;'>* Debe seleccionar un trabajador.</label>");
   }
}

var contratistaAuxBusOpcDosObj,proyectoAuxObj,trabContratistaAuxObj,conductorAuxObj,listDocumentosConductorAux;
var generalHabilitadoTrabCont;
var listTipoLicencias = [];
var mapTipoLicenciaCondHabilitada;
var numTipoLicCondHabilitados;
var listResultadoBusquedaTrabContOpcional = [];
var trabContOpcNroDocId,contOpcNroDocId;

function ocultarConsultaTrabajadorContratistaPorNroDocumento(){
   $("#modalConsultarTrabContNroDoc").modal("hide");$("#modalPerfilesInformacionVistaConsulta").modal("show");
}

function verConsultaTrabajadorContratistaPorNroDocumento(){
   $("#modalPerfilesInformacionVistaConsulta").modal("hide");$("#modalConsultarTrabContNroDoc").remove();

   var contenido = "";

   var listContenido=[
      {label:"N° de documento",inputForm:"<input id='nroDocumentoConsTrabContOpc' class='form-control' type='text'>"},
      {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
      {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConsultaTrabajadorContratistaPorNroDocumento()'>" +
                 "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='verConsultaTrabajadorContratistaOpcional()'>" +
                    "<i class='fa fa-search'></i> Buscar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionTres(val);
   });

   var modalOptions={
      id:"modalConsultarTrabContNroDoc",nombre:"<i class='fa fa-id-card'></i> Consulta - Trabajador contratista por N° de documento",
      contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function ocultarConsultaTrabajadorContratistaOpcional(){
   $("#modalConsultarOpcionalTrabCont").modal("hide");$("#modalConsultarTrabContNroDoc").modal("show");
}

function verConsultaTrabajadorContratistaOpcional(){
   var nroDocumentoVal = $("#nroDocumentoConsTrabContOpc").val().trim();

   if(nroDocumentoVal.length > 0){
      $("#modalConsultarTrabContNroDoc").modal("hide");$("#modalConsultarOpcionalTrabCont").remove();

      var dataParam={
         empresaId:parseInt(getSession("gestopcompanyid")),nroDocumento:nroDocumentoVal
      };

      callAjaxPostSimpleVersionDos(1,URL+"/contratista/trabajador/busqueda_opcional",dataParam,1,1,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               listResultadoBusquedaTrabContOpcional = data.listContratistaTrabContOpcional;

               if(listResultadoBusquedaTrabContOpcional.length > 0){
                  var contenido = "";

                  var selContratistaConsultaOpc = crearSelectOneMenuOblig("selContratistaConsultaOpc","completarNombreTrabContConsultaOpcional()",
                     listResultadoBusquedaTrabContOpcional,"","contratistaId","contratistaNombre");

                  var listContenido=[
                     {label:"Trabajador:",inputForm:"",idDivContainer:"divTrabContConsultaOpc"},
                     {label:"Contratista:",inputForm:selContratistaConsultaOpc},
                     {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
                     {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarConsultaTrabajadorContratistaOpcional()'>" +
                                "<i class='fa fa-arrow-left'></i> Volver" +
                             "</button>",
                      inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='prepararParamConsultaTrabajadorContratistaOpcional()'>" +
                                   "<i class='fa fa-search'></i> Buscar" +
                                "</button>"}
                  ];

                  listContenido.forEach(function(val){
                     contenido += obtenerSubPanelModuloVersionTres(val);
                  });

                  var modalOptions={
                     id:"modalConsultarOpcionalTrabCont",nombre:"<i class='fa fa-search'></i> Valores consulta - Trabajador contratista",
                     contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
                  };

                  crearModalPrincipalUsuario(modalOptions,function(){},true,true);

                  completarNombreTrabContConsultaOpcional(data.hasSancionEnCurso);

                  if(data.hasSancionEnCurso == 0 && listResultadoBusquedaTrabContOpcional.length == 1){
                     prepararParamConsultaTrabajadorContratistaOpcional();
                  }
               }else{
                  $("#modalConsultarTrabContNroDoc").modal("hide");

                  mensajeUx="<label>No se encontró alguna coincidencia con el N° de documento ingresado.</label>";
                  mensajesUx(mensajeUx,2,"","ValidacionConsTrabCont");

                  $("#modalMensajeUxValidacionConsTrabCont").on("hidden.bs.modal",function(){
                     $("#modalConsultarTrabContNroDoc").modal("show");
                  });
               }

               break;

            default:
               alert("Error. Volver a cargar.");

               break;
         }
      });
   }else{
      $("#modalConsultarTrabContNroDoc").modal("hide");

      mensajeUx="<label>Debe completar el campo Nro documento.</label>";
      mensajesUx(mensajeUx,2,"","ValidacionConsTrabCont");

      $("#modalMensajeUxValidacionConsTrabCont").on("hidden.bs.modal",function(){
         $("#modalConsultarTrabContNroDoc").modal("show");
      });
   }
}

function completarNombreTrabContConsultaOpcional(pHasSancion){
   var trabContratistaNombre;
   var contratistaIdAux = parseInt($("#selContratistaConsultaOpc").val());

   listResultadoBusquedaTrabContOpcional.forEach(function(val){
      if(val.contratistaId == contratistaIdAux){
         trabContratistaNombre = val.nombreCompleto;
      }
   });

   $("#divTrabContConsultaOpc").html(trabContratistaNombre);

   var hasSancion = parseInt(pHasSancion);

   if(hasSancion == 1){
      $("#modalConsultarOpcionalTrabCont").modal("hide");

      mensajeUx = "<label>"+trabContratistaNombre+" está actualmente sancionado." +
         "<br><br>¿Desea continuar con la consulta?</label>";
      mensajesUx(mensajeUx,3,"","ConfRevInfoTrabCont");

      $("#btnRegresarPrevioConfRevInfoTrabCont").on("click",function(){
         $("#modalConsultarTrabContNroDoc").modal("show");
      });

      $("#btnDevolverValorConfRevInfoTrabCont").on("click",function(){
         if(listResultadoBusquedaTrabContOpcional.length == 1){
            prepararParamConsultaTrabajadorContratistaOpcional();
         }else{
            $("#modalConsultarOpcionalTrabCont").modal("show");
         }
      });
   }
}

function prepararParamConsultaTrabajadorContratistaOpcional(){
   var parametrosEncontrados = false;
   var contratistaIdAux = parseInt($("#selContratistaConsultaOpc").val());

   listResultadoBusquedaTrabContOpcional.forEach(function(val){
      if(val.contratistaId == contratistaIdAux){
         trabContOpcNroDocId = val.id;contOpcNroDocId = val.contratistaId;parametrosEncontrados = true;
      }
   });

   if(parametrosEncontrados){
      previoBuscarDatosTrabajadorContratista();
   }
}

function previoBuscarDatosTrabajadorContratista(){
   $("#modalConsultarOpcionalTrabCont").modal("hide");$("#modalEstadoActualTrabajadorContratista").remove();

   if(contOpcNroDocId != -1 && trabContOpcNroDocId != -1){
      var dataParam={
         id:trabContOpcNroDocId,contratistaId:contOpcNroDocId
      };

      callAjaxPostSimpleVersionDos(1,URL+"/contratista/trabajadores/proyecto_asignado",dataParam,1,1,function(data){
         listProyectosAsignadosActivos = (data.listProyectosAsignados.length > 0?data.listProyectosAsignados:[{id:-1,titulo:"Sin proyectos asignados en curso"}]);

         var selProyectoTrabContConsulta = crearSelectOneMenuOblig("selProyectoTrabContConsulta","buscarDatosTrabajadorContratista()",listProyectosAsignadosActivos,"","id","titulo");
         var contratistaNombre = "------",nombreCompleto = "------";

         listResultadoBusquedaTrabContOpcional.forEach(function(val){
            if(val.id == trabContOpcNroDocId && val.contratistaId == contOpcNroDocId){
               contratistaNombre = val.contratistaNombre;nombreCompleto = val.nombreCompleto;
            }
         });

         var contenido = "";

         var listContenido=[
            {clase:"bloque-top-moderno",label:"<i class='fa fa-list-alt'></i> Contratista:",inputForm:contratistaNombre},
            {label:"",inputForm:"",styleTotal:styleLineaDegradada},
            {clase:"bloque-middle-moderno",label:"<i class='fa fa-list-alt'></i> Proyecto:",inputForm:selProyectoTrabContConsulta},
            {label:"",inputForm:"",styleTotal:styleLineaDegradada},
            {clase:"bloque-bottom-moderno",label:"<i class='fa fa-user'></i> Trabajador(a):",inputForm:nombreCompleto,idDivContainer:"divResTotalTrabCont",styleTotal:"margin-bottom:10px;"},
            {label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
            {label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarDatosTrabajadorContratista()'>" +
                       "<i class='fa fa-arrow-left'></i> Volver" +
                    "</button>",
             inputForm:(data.listProyectosAsignados.length > 1?
                       "<button id='btnSelecConsTrabCont' class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='buscarDatosTrabajadorContratista()'>" +
                          "<i class='fa fa-list-ul'></i> Seleccionar" +
                       "</button>":"")}
         ];

         listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionTres(val);
         });

         var modalOptions={
            id:"modalEstadoActualTrabajadorContratista",nombre:"<i class='fa fa-search'></i> Resultado de la búsqueda - trabajador contratista",
            contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
         };

         crearModalPrincipalUsuario(modalOptions,function(){},true,true);

         if(data.listProyectosAsignados.length < 2){
            buscarDatosTrabajadorContratista();
         }
      });
   }else{
      mensajeUx = "<label>Debe seleccionar un trabajador contratista válido.</label>";
      mensajesUx(mensajeUx,2,"","ValidacionConsultaTrabCont");
   }
}

function ocultarDatosTrabajadorContratista(){
    $("#modalEstadoActualTrabajadorContratista").modal("hide");
   
    if(listResultadoBusquedaTrabContOpcional.length == 1){
        $("#modalConsultarTrabContNroDoc").modal("show");
    }else{
        $("#modalConsultarOpcionalTrabCont").modal("show");
    }
}

function buscarDatosTrabajadorContratista(){
   $(".divResultadoBusquedaTrabCont").remove();$("#btnSelecConsTrabCont").hide();
    
   var idContratista = contOpcNroDocId;
   var idTrabajadorContratista = trabContOpcNroDocId;
   var idProyecto = parseInt($("#selProyectoTrabContConsulta").val());

    if(idContratista != -1 && idTrabajadorContratista != -1 && idProyecto != -1){
        var dataParam={
	        id:idProyecto,contratistaId:idContratista,trabajadorContratistaId:idTrabajadorContratista
        };
    
      callAjaxPostSimpleVersionDos(1,URL+"/contratista/consulta/proyecto/trabajador",dataParam,1,0,function(data){
	 contratistaAuxBusOpcDosObj = data.contratista;proyectoAuxObj = data.proyecto,trabContratistaAuxObj = data.trabajadorContratista;
	 conductorAuxObj = data.conductor;listDocumentosConductorAux = data.listDocumentosConductor;listTipoLicencias = data.listTipoLicencias;
	 
         mapTipoLicenciaCondHabilitada = new Map();
         
         numTipoLicCondHabilitados = listTipoLicencias.length;
         
         listTipoLicencias.forEach(function(val){
            mapTipoLicenciaCondHabilitada.set(val.id,1);
         });

         var estadoDocumentosNivelEmpresaConObj = verificarIndicadorDocNivelEmpresaContratista(contratistaAuxBusOpcDosObj);
         var estadoDocumentosNivelProyectoConObj = verificarIndicadorDocNivelProyectoContratista(proyectoAuxObj);
	     var estadoDocumentosTrabConObj = verificarIndicadorDocNivelTrabajadorContratista(trabContratistaAuxObj,proyectoAuxObj);

         generalHabilitadoTrabCont = estadoDocumentosNivelEmpresaConObj.isHabilitado && estadoDocumentosNivelProyectoConObj.isHabilitado && estadoDocumentosTrabConObj.isHabilitado;
         var conductorHabilitado = (conductorAuxObj.id > 0?(conductorAuxObj.isHabilitado == 1):true);
         var booleanHabilitado = generalHabilitadoTrabCont && conductorHabilitado;

         var estadoActualTrabContTotal =
             "<div class='"+(booleanHabilitado?"estado-futurista-ok":"estado-no-habilitado-full")+"'>" +
                 "<i class='"+(booleanHabilitado?"fa fa-thumbs-up":"fa fa-ban")+"'></i>" +
                 "<div><div class='estado-titulo'>"+(booleanHabilitado?"Habilitado":"No habilitado")+"</div></div>" +
             "</div>";
         
         var textoTrabajosAltoRiesgo = (trabContratistaAuxObj.textoTrabajosAltoRiesgo.length == 0?"No tiene ninguno asignado.":
            (trabContratistaAuxObj.habilitadoTrabajosAltoRiesgo == 1?iconoGosst.aprobado:iconoGosst.alerta)+" "+trabContratistaAuxObj.textoTrabajosAltoRiesgo +
            "<br>" +
	    "<a class='efectoLink' onclick='verConstanciaTrabAltoRiesgoTrabCon(5)' " +
	       "title='Ver el estado según los trabajos de alto riesgo asignados.'>" +
	       "<i class='fa fa-eye'></i> Ver estado" +
	    "</a>");
         
         var empresa = trabContratistaAuxObj.cliente.trim(),puestoTrabajo = (trabContratistaAuxObj.cargo.trim().length == 0?"------":trabContratistaAuxObj.cargo.trim());
         
         var contenido = "";

         var contenidoEmpresaPuestoTrabajo =
             "<div class='fila-doble-info'>" +
                 (empresa.length > 0?
                 "<div class='fila-doble-info-item' style='flex:0 0 calc(45% - 9px);'>" +
                     "<div class='fila-doble-info-label'>Empresa:</div>" +
                     "<div class='fila-doble-info-valor'>"+empresa+"</div>" +
                 "</div>":"") +
                 "<div class='fila-doble-info-item' style='flex:0 0 "+(empresa.length > 0?"calc(55% - 9px)":"100%")+";'>" +
                     "<div class='fila-doble-info-label'>Puesto de trabajo:</div>" +
                     "<div class='fila-doble-info-valor'>"+puestoTrabajo+"</div>" +
                 "</div>" +
             "</div>";
         
         var listContenido=[
             {clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
             {clase:"divResultadoBusquedaTrabCont",fullRow:1,label:"",inputForm:contenidoEmpresaPuestoTrabajo},
             {clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante}
         ];

          if(proyectoAuxObj.numTrabajosAltoRiesgoTotal > 0 && (proyectoAuxObj.habilitadoConstanciaAltoRiesgo == 1 || proyectoAuxObj.habilitarCargoInduccionTrabAltRie == 1)){
              listContenido.push({clase:"divResultadoBusquedaTrabCont",fullRow:1,label:"",inputForm:obtenerFilaDobleInfoSimple("Trabajos de alto riesgo asignados:",textoTrabajosAltoRiesgo)});
          }

          if(proyectoAuxObj.habilitadoEsPrevencionista == 1){
              var contenidoPrevencionista =
                  "<div class='fila-doble-info'>" +
                      "<div class='fila-doble-info-item' style='flex:0 0 "+(proyectoAuxObj.habilitadoEntrevistaPrevencionista == 1?"calc(40% - 9px)":"100%")+";'>" +
                          "<div class='fila-doble-info-label'>¿Es prevencionista?</div>" +
                          "<div class='fila-doble-info-valor'>"+estadoDocumentosTrabConObj.textoPrevencionista+"</div>" +
                      "</div>" +
                      (proyectoAuxObj.habilitadoEntrevistaPrevencionista == 1?
                          "<div class='fila-doble-info-item' style='flex:0 0 calc(60% - 9px);'>" +
                              "<div class='fila-doble-info-label'>Entrevista prevencionista</div>" +
                              "<div class='fila-doble-info-valor'>"+estadoDocumentosTrabConObj.textoEntrevistaPrevencionista+"</div>" +
                          "</div>":"") +
                  "</div>";

              listContenido.push({clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
                  {clase:"divResultadoBusquedaTrabCont",fullRow:1,label:"",inputForm:contenidoPrevencionista});
          }

          var listContenidoDntcAux = obtenerContratistaListaDocumentosNivelTrabajadorContratista(proyectoAuxObj,trabContratistaAuxObj,estadoDocumentosTrabConObj,"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal");

          var tieneDetalleEstadoActualTrabContTotal = proyectoAuxObj.numDocumentosNivelEmpresaTotal > 0 || proyectoAuxObj.numDocumentosNivelProyectoTotal > 0 || listContenidoDntcAux.length > 0;
          var tieneEstadoActualTrabContTotal = tieneDetalleEstadoActualTrabContTotal || trabContratistaAuxObj.indicadorBlacklist != null;

          if(tieneEstadoActualTrabContTotal){
              listContenido.push({clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaSuaveMinimalista},
                  {clase:"divResultadoBusquedaTrabCont estado-actual-compacto",anchoLabel:"col-sm-12",anchoDiv:"col-sm-12",label:"",
                   inputForm:estadoActualTrabContTotal+(tieneDetalleEstadoActualTrabContTotal?"<a class='estado-detalle-alternar' id='idDetalleEstadoActualTrabContTotal'></a>":"")});

              if(proyectoAuxObj.numDocumentosNivelEmpresaTotal > 0){
                  listContenido.push({clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                      {clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                       label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL EMPRESA ***</span>",inputForm:""});

                  var listContenidoDneAux = obtenerContratistaListaDocumentosNivelEmpresa(contratistaAuxBusOpcDosObj,estadoDocumentosNivelEmpresaConObj,"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal");

                  for(var i = 0;i < listContenidoDneAux.length;i++){
                      listContenido.push(listContenidoDneAux[i]);
                  }
              }

              if(proyectoAuxObj.numDocumentosNivelProyectoTotal > 0){
                  listContenido.push({clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                      {clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                       label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL PROYECTO ***</span>",inputForm:""});

                  var listContenidoDnpAux = obtenerContratistaListaDocumentosNivelProyecto(proyectoAuxObj,estadoDocumentosNivelProyectoConObj,"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal");

                  for(var j = 0;j < listContenidoDnpAux.length;j++){
                      listContenido.push(listContenidoDnpAux[j]);
                  }
              }

              if(listContenidoDntcAux.length > 0){
                  listContenido.push({clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
                      {clase:"divResultadoBusquedaTrabCont divEstadoActualTrabContTotal",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                       label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DOCUMENTOS A NIVEL TRABAJADOR CONTRATISTA ***</span>",inputForm:""});

                  for(var k = 0;k < listContenidoDntcAux.length;k++){
                      listContenido.push(listContenidoDntcAux[k]);
                  }
              }
          }
         
         if(proyectoAuxObj.habilitadoConductor == 1){
             var tipoLicenciasAprobadas = (conductorAuxObj.tiposLicenciaConductorHabilitadosNombre.length == 0?"Ninguno":conductorAuxObj.tiposLicenciaConductorHabilitadosNombre);
             var iconoConductorNoHabilitado = "<i class='fa fa-exclamation-circle' style='color:#C0504D;margin-right:4px;' title='Es la razón de que salga NO HABILITADO'></i>";

             var contenidoConductorLicencias =
                 "<div class='fila-doble-info'>" +
                     "<div class='fila-doble-info-item' style='flex:0 0 calc(30% - 9px);'>" +
                         "<div class='fila-doble-info-label'>¿Es conductor?</div>" +
                         "<div class='fila-doble-info-valor'>"+(conductorAuxObj.id > 0?"Sí":"No")+"</div>" +
                     "</div>" +
                     "<div class='fila-doble-info-item' style='flex:0 0 calc(70% - 9px);'>" +
                         "<div class='fila-doble-info-label'>"+(!conductorHabilitado?iconoConductorNoHabilitado:"")+"Tipo(s) de licencia(s) habilitadas:</div>" +
                         "<div class='fila-doble-info-valor'"+(!conductorHabilitado?" style='color:#C0504D;'":"")+">"+tipoLicenciasAprobadas+"</div>" +
                     "</div>" +
                 "</div>" +
                 (conductorAuxObj.tiposLicenciaConductorId.length > 0?
                 "<div style='display:flex;justify-content:flex-end;margin-top:6px;'>" +
                     "<a class='estado-detalle-alternar' style='margin:0;"+(!conductorHabilitado?"color:#C0504D;":"")+"' onclick='verEstadoActualConductorConsulta()'>"+(!conductorHabilitado?iconoConductorNoHabilitado:"")+"Ver detalle <i class='fa fa-chevron-down'></i></a>" +
                 "</div>":"");

             listContenido.push({clase:"divResultadoBusquedaTrabCont",label:"",inputForm:"",styleTotal:styleLineaSuaveMinimalista},
                 {clase:"divResultadoBusquedaTrabCont",fullRow:1,label:"",inputForm:contenidoConductorLicencias});
         }
		 
         listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionTres(val);
         });
       	  				
         $("#divResTotalTrabCont").parent().after(contenido);$.unblockUI();
          
         ocultarEstadoActualTrabContTotal();
      });
   }else{
	  $("#modalEstadoActualTrabajadorContratista").modal("hide");
	
      mensajeUx = (idContratista == -1?"<label>Debe ingresar el RUC y/o nombre de la contratista en el buscador y seleccionarla.</label>":
         (idTrabajadorContratista == -1?"<label>Debe ingresar el N° documento y/o nombre/apellido del trabajador contratista en el " +
          "buscador y seleccionarlo.</label>":"<label>No tiene algún proyecto activo asignado.</label>"));
      mensajesUx(mensajeUx,2,"","ValidacionConsulta");
      
	  $("#modalMensajeUxValidacionConsulta").on("hidden.bs.modal",function(){
	      if(listResultadoBusquedaTrabContOpcional.length == 1){
	  		  $("#modalConsultarTrabContNroDoc").modal("show");
	  	  }else{
	  		  $("#modalConsultarOpcionalTrabCont").modal("show");
	  	  }
	  });
   }
}

function verEstadoActualTrabContTotal(){
   $(".divEstadoActualTrabContTotal").show();

   var iconoReq = (!generalHabilitadoTrabCont?"<i class='fa fa-exclamation-circle' style='color:#C0504D;margin-right:4px;' title='Tiene algún requisito general pendiente'></i>":"");
   $("#idDetalleEstadoActualTrabContTotal").html(iconoReq+"Ocultar detalle <i class='fa fa-chevron-up'></i>");
   $("#idDetalleEstadoActualTrabContTotal").css("color",(!generalHabilitadoTrabCont?"#C0504D":""));
   $("#idDetalleEstadoActualTrabContTotal").attr("onclick","ocultarEstadoActualTrabContTotal()");
}

function ocultarEstadoActualTrabContTotal(){
   $(".divEstadoActualTrabContTotal").hide();

   var iconoReq = (!generalHabilitadoTrabCont?"<i class='fa fa-exclamation-circle' style='color:#C0504D;margin-right:4px;' title='Tiene algún requisito general pendiente'></i>":"");
   $("#idDetalleEstadoActualTrabContTotal").html(iconoReq+"Ver detalle <i class='fa fa-chevron-down'></i>");
   $("#idDetalleEstadoActualTrabContTotal").css("color",(!generalHabilitadoTrabCont?"#C0504D":""));
   $("#idDetalleEstadoActualTrabContTotal").attr("onclick","verEstadoActualTrabContTotal()");
}

function volverEstadoActualConductorConsulta(){
   $("#modalEstadoActualConductor").modal("hide");
}

function verEstadoActualConductorConsulta(){
   $("#modalEstadoActualTrabajadorContratista").modal("hide"); $("#modalEstadoActualConductor").remove();

   var contenidoColumnaTipoLicCond = "";
   
   listTipoLicencias.forEach(function(val,index){
      contenidoColumnaTipoLicCond += "<th class='tb-acc' style='width:300px'>"+val.nombre+"</th>";
   });
   
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverEstadoActualConductorConsulta()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
       
   var modalOptions={
      maxWidth:"90%",id:"modalEstadoActualConductor",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-user'></i> Conductor "+conductorAuxObj.trabContratista.nombre+" <span id='spanConductorEstadoActual'></span>",
      contenido: 
	  "<div class='eventoGeneral-moderno'>" +
	  buttonVolver +
         "<div class='wrapper' id='wrapperEstadoActualConductor'>" +
            "<table id='tblEstadoActualConductor' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' rowspan='2' style='width:400px'>Documento a nivel conductor</th>" +
		     "<th class='tb-acc' colspan='"+numTipoLicCondHabilitados+"' style='width:"+(numTipoLicCondHabilitados*300)+"px'>Tipo de licencia conductor</th>" +
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
   resizeDivWrapper("wrapperEstadoActualConductor",240);
   
   var numTipoLicenciaCondHabilitadosTotal = 0,numTipoLicenciaCondAprobadosTotal = 0;
	 
   $("#tblEstadoActualConductor tbody tr").remove();
	 
   listDocumentosConductorAux.forEach(function(val,index){
      $("#tblEstadoActualConductor tbody").append(
         "<tr>" +
	    "<td>"+val.nombre+"</td>" +
	     (mapTipoLicenciaCondHabilitada.get(1) == 1?"<td>"+val.estadoActualVehiculoCiudad+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(2) == 1?"<td>"+val.estadoActualVehiculo4x4+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(3) == 1?"<td>"+val.estadoActualCamionCisterna+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(4) == 1?"<td>"+val.estadoActualMaquinariaGrua+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(5) == 1?"<td>"+val.estadoActualLineaAmarilla+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(6) == 1?"<td>"+val.estadoActualVehiculosLivianos+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(7) == 1?"<td>"+val.estadoActualVehiculosPesados+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(8) == 1?"<td>"+val.estadoActualCamionesGruas+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(9) == 1?"<td>"+val.estadoActualVehiculosIndustriales+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(10) == 1?"<td>"+val.estadoActualMaquinariaPesada+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(11) == 1?"<td>"+val.estadoActualTipoLicCond11+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(12) == 1?"<td>"+val.estadoActualTipoLicCond12+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(13) == 1?"<td>"+val.estadoActualTipoLicCond13+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(14) == 1?"<td>"+val.estadoActualTipoLicCond14+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(15) == 1?"<td>"+val.estadoActualTipoLicCond15+"</td>":"") +
	     (mapTipoLicenciaCondHabilitada.get(16) == 1?"<td>"+val.estadoActualTipoLicCond16+"</td>":"") +
	 "</tr>");
	    
      numTipoLicenciaCondHabilitadosTotal = numTipoLicenciaCondHabilitadosTotal + val.numTipoLicenciaCondHabilitados;
      numTipoLicenciaCondAprobadosTotal = numTipoLicenciaCondAprobadosTotal + val.numTipoLicenciaCondAprobados;
   });
	 
   var habilitado = (numTipoLicenciaCondHabilitadosTotal == numTipoLicenciaCondAprobadosTotal && (numTipoLicenciaCondHabilitadosTotal > 0 || (conductorAuxObj.tiposLicenciaConductorId != null && conductorAuxObj.tiposLicenciaConductorId.length > 0))?"Sí":"No");
	 
   $("#spanConductorEstadoActual").html("- ¿Habilitado? "+habilitado+" ("+numTipoLicenciaCondAprobadosTotal +"/"+numTipoLicenciaCondHabilitadosTotal+")");
	
   goheadfixedY("#tblEstadoActualConductor","#wrapperEstadoActualConductor");
   
   $("#modalEstadoActualConductor").on("hidden.bs.modal",function(){
      $("#modalEstadoActualTrabajadorContratista").modal("show"); 
   }); 
}
