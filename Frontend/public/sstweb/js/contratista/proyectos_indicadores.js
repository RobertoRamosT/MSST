
var listProyectosIndicadoresActuales=[];
var listFullRegIndTotalProyBuscador = [];
var busquedaActivaIndTotalProy,numPaginaActualIndTotalProy;
var mensajeUx;


function volverPrincipalProyecto(){
   $("#modalIndicadoresProyecto").modal("hide");
}

function verIndicadoresTotalProyecto(){
    $("#modalIndicadoresProyecto").remove();
   
    var buttonVolver =
        "<button id='btnOcultarIndTotalProy' type='button' class='btn btn-info' style='margin-right:5px' onclick='volverPrincipalProyecto()' " +
                "title='Regresar a la vista principal.'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";
   
    var buttonConsolidado = (![1,14].includes(parseInt(getSession("accesoUsuarios")))?"":
        "<button id='btnExcelIndTotalProy' type='button' class='btn btn-excel' style='margin-right:5px' onclick='verConsolidadosExcelNivProyInd()' " +
                "title='Excel consolidado.'>" +
            "<i class='fa fa-file-excel-o fa-2x'></i> <i class='fa fa-list'></i>" +
        "</button>");
    
    var buttonFlechas =
        "<span id='indicadorPaginaParcialAuxIndTotalProy' style='margin:5px;margin-top:10px;'>" +
            "<a id='flechaIzquierdaIndTotalProy'><img src='../imagenes/flecha_01.png' /></a>" +
            " <em id='labelFlechasIndTotalProy'></em> " +
            "<a id='flechaDerechaIndTotalProy'><img src='../imagenes/flecha_02.png' /></a>" +
        "</span>";

    var buscadorOpciones =
        "<button id='btnResetBuscadorIndTotalProy' type='button' class='btn btn-success' " +
                "title='Refresh' onclick='reiniciarBuscadorIndicadoresTotalProyecto()' style='float:right;'>" +
            "<i class='fa fa-refresh fa-2x'></i>" +
        "</button>" +
        "<button id='btnAplicarBuscadorIndTotalProy' type='button' class='btn btn-success' onclick='aplicarBuscadorIndicadoresTotalProyecto()' " +
                "style='float:right;margin-right:5px;' title='Buscar los registros cuyo código, título de proyecto o " +
                "contratista asignado coincida con las palabras ingresadas.'>" +
            "<i class='fa fa-search fa-2x'></i>" +
        "</button>" +
        "<input id='valBuscarValorIndTotalProy' placeholder='Código, título del proyecto o contratista asignado' class='form-control' " +
               "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";
    
    var modalOptions={
        maxWidth:"90%",id:"modalIndicadoresProyecto",nombre:"<i class='fa fa-table'></i> Indicadores de la contratista",btnCerrarHabilitado:0,
        contenido: 
	    "<form class='form-inline'>" +
	         buttonVolver+buttonConsolidado+buttonFlechas+buscadorOpciones +
	    "</form>" +
            "<div class='wrapper' id='wrapperIndicadoresProyecto'>" +
            "<table id='tblIndicadoresProyecto' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:120px'>Código</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:400px'>Título del proyecto</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:400px'>Contratista asignado</th>" +
		     "<th class='tb-acc' colspan='4' style='width:560px'>Indicadores</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:140px'>Documentos a nivel empresa</th>" +
		     "<th class='tb-acc' style='width:140px'>Documentos a nivel proyecto</th>" +
		     "<th class='tb-acc' style='width:140px'>Documentos a nivel trabajador - contratista</th>" +
		     "<th class='tb-acc' style='width:140px'>Cumplimiento</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperIndicadoresProyecto",190);
   cargarIndicadoresTotalProyecto();
   
   $("#flechaIzquierdaIndTotalProy").on('click',function(){
       numPaginaActualIndTotalProy = numPaginaActualIndTotalProy-1;
       cambiarPaginaIndicadoresTotalProyecto();
   });

   $('#flechaDerechaIndTotalProy').on('click',function(){
       numPaginaActualIndTotalProy = numPaginaActualIndTotalProy+1;
       cambiarPaginaIndicadoresTotalProyecto();
   });
}

var proyectoIndicadorObj={},contratistaIndicadorAuxObj={},proyectoIndicadorAuxObj={};

// P-A00032: el WAF del balanceador bloquea (403) las peticiones con HTML en el cuerpo. Cada proyecto de la lista trae el HTML de un icono
// (evaluacionIperc.nota.icono, que viene de la base de datos) y el servidor no lo lee al calcular los indicadores. Se envia una COPIA sin las
// cadenas con etiquetas HTML; los objetos de la pantalla quedan intactos. "contratistaNombre" se conserva siempre: el servidor lo lee para saber
// si el proyecto tiene contratista y, si faltara, el proyecto se saltaria en silencio.
function copiaSinHtmlParaEnviar(valor){
    if(valor === undefined || valor === null){
        return valor;
    }

    return JSON.parse(JSON.stringify(valor,function(clave,dato){
        return (clave !== "contratistaNombre" && typeof dato === "string" && /<\/?[a-zA-Z][^>]*>/.test(dato)) ? undefined : dato;
    }));
}

function cargarIndicadoresTotalProyecto(){
    busquedaActivaIndTotalProy = 0,numPaginaActualIndTotalProy = 1;
    
    $("#valBuscarValorIndTotalProy").val("");
    
    $("#btnOcultarIndTotalProy").show();$("#btnExcelIndTotalProy").show();$("#indicadorPaginaParcialAuxIndTotalProy").show();
    $("#btnResetBuscadorIndTotalProy").show();$("#btnAplicarBuscadorIndTotalProy").show();$("#valBuscarValorIndTotalProy").show();
    
    var dataParam={
        proyectosInfoAux:copiaSinHtmlParaEnviar(listFullProyectoSeguridad)
    };
     
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/proyectos/indicadores/total',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
            listProyectosIndicadoresActuales = data.listProyectosIndAux;
            
            listProyectosIndicadoresActuales.sort(function(a,b){
        	return a.notaFinal - b.notaFinal;
            });

            cambiarPaginaIndicadoresTotalProyecto();

            goheadfixedY("#tblIndicadoresProyecto","#wrapperIndicadoresProyecto");
            formatoCeldaSombreableTabla(true,"tblIndicadoresProyecto");
        }else{
            alert("Error al cargar el consolidado 'Indicadores de la contratista'");
        }
    });
}

function cambiarPaginaIndicadoresTotalProyecto(){
    $("#flechaIzquierdaIndTotalProy").show();$("#flechaDerechaIndTotalProy").show();

    var list = (busquedaActivaIndTotalProy == 0?listProyectosIndicadoresActuales:listFullRegIndTotalProyBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualIndTotalProy*partialSize)-partialSize;
    var finRegistro = (numPaginaActualIndTotalProy*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasIndTotalProy").html("<label>"+numPaginaActualIndTotalProy+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualIndTotalProy == 1){
        $("#flechaIzquierdaIndTotalProy").hide();
    }

    if(numPaginaActualIndTotalProy == numPaginaTotal){
        $("#flechaDerechaIndTotalProy").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblIndicadoresProyecto tbody tr").remove();

    list.forEach(function(val,index){
	if(inicioRegistro <= index && index <= finRegistro){
	    var paramIndNivelEmp = (val.numDocumentosNivelEmpresaTotal == 0?"":"onclick='verDetalleIndicadorDocNivelEmpresa("+index+")' class='linkGosst'");
	    var indDocNivelEmp = pasarDecimalPorcentaje(val.numDocumentosNivelEmpresaAprobados/val.numDocumentosNivelEmpresaTotal) +
	    	" ("+val.numDocumentosNivelEmpresaAprobados+" / "+val.numDocumentosNivelEmpresaTotal+")";
	    var paramIndNivelProy = (val.numDocumentosNivelProyectoTotal == 0?"":"onclick='verDetalleIndicadorDocNivelProyecto("+index+")' class='linkGosst'");
	    var indDocNivelProy = pasarDecimalPorcentaje(val.numDocumentosNivelProyectoAprobados/val.numDocumentosNivelProyectoTotal) +
	    	" ("+val.numDocumentosNivelProyectoAprobados+" / "+val.numDocumentosNivelProyectoTotal+")";
	    var paramIndNivTrabCont = (val.trabajadoresTotal == 0?"":"onclick='verDetalleIndicadorDocNivelTrabContratista("+val.id+","+index+")' class='linkGosst'");
	    var indDocNivelTrabCont = pasarDecimalPorcentaje(val.numTrabajadoresContAprobados/val.trabajadoresTotal) +
	    	" ("+val.numTrabajadoresContAprobados+" / "+val.trabajadoresTotal+")";
	    var indCumplimiento = pasarDecimalPorcentaje(val.notaFinal);
    
	    var colorFondoCumplimiento = (val.notaFinal == 1.00?"#5DCD5D":(val.notaFinal == 0.00?"#FF7474":"#D8D808"));
	    
	    $("#tblIndicadoresProyecto tbody").append(
	        "<tr id='filaProyInd"+val.id+"'>" +
	            "<td>"+val.codigo+"</td>" +
	            "<td>"+val.titulo+"</td>" +
		    "<td>"+val.contratistaNombre+"</td>" +
		    "<td "+paramIndNivelEmp+" style='border-left:3px solid #afb5bb'>"+indDocNivelEmp+"</td>" +
		    "<td "+paramIndNivelProy+">"+indDocNivelProy+"</td>" +
		    "<td "+paramIndNivTrabCont+">"+indDocNivelTrabCont+"</td>" +
		    "<td style='background-color:"+colorFondoCumplimiento+"'>"+indCumplimiento+"</td>" +
	        "</tr>");
	}
    });

    $.unblockUI();
}

function aplicarBuscadorIndicadoresTotalProyecto(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valBuscarValorIndTotalProy = igualarStringBuscar($("#valBuscarValorIndTotalProy").val());
    listFullRegIndTotalProyBuscador = [];busquedaActivaIndTotalProy = 1;numPaginaActualIndTotalProy = 1;

    listProyectosIndicadoresActuales.forEach(function(val,index){
        if(igualarStringBuscar(val.codigo).indexOf(valBuscarValorIndTotalProy) != -1 ||
            igualarStringBuscar(val.titulo).indexOf(valBuscarValorIndTotalProy) != -1 ||
            igualarStringBuscar(val.contratistaNombre).indexOf(valBuscarValorIndTotalProy) != -1){
            listFullRegIndTotalProyBuscador.push(val);
        }
    });

    cambiarPaginaIndicadoresTotalProyecto();
}

function reiniciarBuscadorIndicadoresTotalProyecto(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    $("#valBuscarValorIndTotalProy").val("").focus();
    busquedaActivaIndTotalProy = 0;numPaginaActualIndTotalProy = 1;

    cambiarPaginaIndicadoresTotalProyecto();
}

function ocultarDetalleIndicadorDocNivelEmpresa(){
   $("#modalIndDocNivEmpresa").modal("hide");
}

function verDetalleIndicadorDocNivelEmpresa(pindex){
   $("#modalIndicadoresProyecto").modal("hide");
   $("#modalIndDocNivEmpresa").remove();
    
   proyectoIndicadorObj = (busquedaActivaIndTotalProy == 0?listProyectosIndicadoresActuales[pindex]:listFullRegIndTotalProyBuscador[pindex]);
    
   var dataParam={
      id: proyectoIndicadorObj.contratistaId,
      cargarIndicadores: 1,proyectoActual: copiaSinHtmlParaEnviar(proyectoIndicadorObj)
   };
	    
   callAjaxPost(URL+"/contratista/indicador/nivel_empresa/detalle",dataParam,function(data){  
      contratistaIndicadorAuxObj = data.contratista;
      
      var estadoDocumentosNivelEmpresaConObj = verificarIndicadorDocNivelEmpresaContratista(contratistaIndicadorAuxObj);
      
      var indDocNivelEmp = 
	 pasarDecimalPorcentaje(proyectoIndicadorObj.numDocumentosNivelEmpresaAprobados/proyectoIndicadorObj.numDocumentosNivelEmpresaTotal) +
         " ("+proyectoIndicadorObj.numDocumentosNivelEmpresaAprobados+" / "+proyectoIndicadorObj.numDocumentosNivelEmpresaTotal+")";
        
      var estadoDocActual = (estadoDocumentosNivelEmpresaConObj.isHabilitado?iconoGosst.aprobado+" Completo":
                             iconoGosst.advertir+" Incompleto <br>(documentos no vigentes y/o sin aprobar)");
      var styleEstadoDocActual = (estadoDocumentosNivelEmpresaConObj.isHabilitado?"#A9DE9B":"#DD6055");
      
      var contenido = "";
      
      var textoProgramaSST = "Programa SST asociado a la empresa:",
          textoProcTrabajoSeguroTraAltoRiesgo = "Procedimiento de trabajo seguro para trabajos de alto riesgo:";
    
      if(parseInt(getSession("gestopcompanyid")) == 647){
         textoProgramaSST = "Programa SST:";textoProcTrabajoSeguroTraAltoRiesgo = "Procedimiento de trabajo seguro:";
      }
      
      var listContenido=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<i class='fa fa-list-alt' aria-hidden='true'></i> Título del proyecto",
	  inputForm:proyectoIndicadorObj.titulo},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<i class='fa fa-building-o' aria-hidden='true'></i> Contratista:",
	  inputForm:proyectoIndicadorObj.contratistaNombre},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
   	 {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
   	  label:"<i class='fa fa-inbox' aria-hidden='true'></i> Estado documentos - Nivel empresa:",
   	  inputForm:"<label>"+estadoDocActual+"</label>"},
   	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
      ];
      
      if(proyectoIndicadorObj.habilitadoIndicadorMensualSst == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Indicador mensual SST:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoIndicadorMensualSst});
      }
      
      if(proyectoIndicadorObj.habilitadoActaCompromiso == 1){
	 listContenido.push(
	    {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Acta de compromiso:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoActaCompromiso}); 
      }
      
      if(proyectoIndicadorObj.habilitadoReglamentoSst == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Reglamento SST:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoReglamentoSst}); 
      }
	 
      if(proyectoIndicadorObj.habilitadoPoliticaSst == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Política SST:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoPoliticaSst}); 
      }
	
      if(proyectoIndicadorObj.habilitadoPlanAnualSst == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Plan anual SST:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoPlanAnualSst}); 
      }
	
      if(proyectoIndicadorObj.habilitadoProgramaSst == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:textoProgramaSST,
             inputForm:estadoDocumentosNivelEmpresaConObj.textoProgramaSst}); 
      }
	
      if(proyectoIndicadorObj.habilitadoPlanAnualSaludOcupacional == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Plan anual de salud ocupacional:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoPlanAnualSaludOcupacional}); 
      }
      
      if(proyectoIndicadorObj.habilitadoProgVigilanciaSaludOcupacional == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Programa de vigilancia de salud ocupacional:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoProgVigilanciaSaludOcupacional}); 
      }

      if(proyectoIndicadorObj.habilitadoCertificadoHomologacion == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de homologación con el cliente:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoCertificadoHomologacion}); 
      }

      if(proyectoIndicadorObj.habilitadoProcTrabajoSeguroTraAltoRiesgo == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:textoProcTrabajoSeguroTraAltoRiesgo,
             inputForm:estadoDocumentosNivelEmpresaConObj.textoProcTrabajoSeguroTraAltoRiesgo}); 
      }
      
      if(proyectoIndicadorObj.habilitadoConstanciaLaboral == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Constancia de registro laboral:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoConstanciaLaboral}); 
      }
	
      if(proyectoIndicadorObj.habilitadoNoNucleoNegocio == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Declaración de no núcleo del negocio:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoNoNucleoNegocio}); 
      }
	
      if(proyectoIndicadorObj.habilitadoCartaFianza == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Carta fianza:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoCartaFianza}); 
      }
	
      if(proyectoIndicadorObj.habilitadoComunicadoSindicales == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Comunicado a organizaciones sindicales:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoComunicadoSindicales}); 
      }
	
      if(proyectoIndicadorObj.habilitadoComunicadoRepresentantes == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Comunicado a representantes de trabajadores:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoComunicadoRepresentantes}); 
      }
	
      if(proyectoIndicadorObj.habilitadoComunicadoTrabPrincipal == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Comunicado a trabajadores (principal):",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoComunicadoTrabPrincipal}); 
      }
	
      if(proyectoIndicadorObj.habilitadoComunicadoTrabContratista == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Comunicado a trabajadores (contratista):",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoComunicadoTrabContratista}); 
      }
	
      if(proyectoIndicadorObj.habilitadoFichaRuc == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Ficha RUC:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoFichaRuc}); 
      }
	
      if(proyectoIndicadorObj.habilitadoConstanciaTercerizadoras == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Constancia registro de tercerizadoras:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoConstanciaTercerizadoras}); 
      }
	
      if(proyectoIndicadorObj.habilitadoContratoEmpUsuarias == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Contratos con empresas usuarias:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoContratoEmpUsuarias}); 
      }
	
      if(proyectoIndicadorObj.habilitadoPartidaRegistral == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Partida registral:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoPartidaRegistral}); 
      }
	
      if(proyectoIndicadorObj.habilitadoAsientoPartidaRegistral == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Asiento de la partida registral:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoAsientoPartidaRegistral}); 
      }
	
      if(proyectoIndicadorObj.habilitadoTrabajosTercerizados == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Contratos de trabajos tercerizados:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoTrabajosTercerizados}); 
      }
	
      if(proyectoIndicadorObj.habilitadoServiciosTercerizados == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Declaración de servicios tercerizados:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoServiciosTercerizados}); 
      }
	
      if(proyectoIndicadorObj.habilitadoServicioTrabajadores == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Informe de servicio de trabajadores:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoServicioTrabajadores}); 
      }
      
      if(proyectoIndicadorObj.habilitadoComiteSupervisorSst == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Comité/Supervisor SST:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoComiteSupervisorSst}); 
      }

      if(proyectoIndicadorObj.habilitadoHojaAtencionSctr == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Hoja de atención del SCTR:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoHojaAtencionSctr}); 
      }

      if(proyectoIndicadorObj.habilitadoAcuerdoConfidencialidad == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Acuerdo de confidencialidad:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoAcuerdoConfidencialidad}); 
      }

      if(proyectoIndicadorObj.habilitadoFlujoRespuestaAccidente == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Flujo de respuesta ante accidentes:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoFlujoRespuestaAccidente}); 
      }

      if(proyectoIndicadorObj.habilitadoAcuerdoSeguridadTerceros == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Acuerdo de seguridad para terceros y contratistas:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoAcuerdoSeguridadTerceros}); 
      }
      
      if(proyectoIndicadorObj.habilitadoAcuerdoSeguridadProveedores == 1){
	 listContenido.push(
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Acuerdo de seguridad para proveedores:",
             inputForm:estadoDocumentosNivelEmpresaConObj.textoAcuerdoSeguridadProveedores}); 
      }

       if(proyectoIndicadorObj.habilitadoExamNivelCont88 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Seguro vida ley:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont88});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont91 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Formatos de campo:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont91});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont92 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Declaración jurada de SST:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont92});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont93 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Registro de seguridad del contratista:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont93});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont94 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Declaración jurada para contratistas:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont94});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont95 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Licencia o permiso emitido por la AMP:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont95});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont96 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Carta de aceptación de la norma:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont96});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont97 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Póliza de responsabilidad civil de la empresa:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont97});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont98 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Formulario y control a terceras partes:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont98});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont102 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Autorización Osinergmin para combustible:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont102});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont103 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Autorización de circulación del MTC:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont103});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont104 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Ficha técnica guantes aislantes clase 0/00:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont104});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont105 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado dieléctrico pértiga y manta aislante:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont105});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont106 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Ficha técnica de componentes del traje contra arco eléctrico:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont106});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont107 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Ficha técnica de botas dieléctricas:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont107});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont108 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de ensayo dieléctrico guantes clase 1–4:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont108});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont109 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de ensayo dieléctrico de banqueta aislante:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont109});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont110 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de ensayo de puesta a tierra temporal:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont110});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont123 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Constancia declaración y pago - PLAME:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont123});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont124 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Planilla electrónica R01:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont124});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont125 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Constancia de pago AFP:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont125});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont126 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Constancia depósito CTS - Mayo y Noviembre:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont126});
       }
       
       if(proyectoIndicadorObj.habilitadoExamNivelCont127 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Constancia depósito gratificación - Julio y Diciembre:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont127});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont137 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Procedimiento de acreditación en SST para subcontratistas:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont137});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont138 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Declaración jurada - capacitación:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont138});
       }

       if(proyectoIndicadorObj.habilitadoExamNivelCont139 == 1){
           listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Constancia del centro educativo de formación:",
               inputForm:estadoDocumentosNivelEmpresaConObj.textoExamNivelCont139});
       }
      
      listContenido.push(
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<button class='btn btn-success' type='button' style='font-size:18px;' " +
	   		"onclick='ocultarDetalleIndicadorDocNivelEmpresa()'>" +
	           "<i class='fa fa-arrow-left'></i> Volver" +
	        "</button>",inputForm:""});
      
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
    	  				
      var modalOptionsIndDocNivEmpresa={
    	 id: "modalIndDocNivEmpresa",
    	 nombre: "<i class='fa fa-list-ul'></i> Detalle Indicador - Documentos a nivel empresa ["+indDocNivelEmp+"]",
    	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
    	  				
      crearModalPrincipalUsuario(modalOptionsIndDocNivEmpresa,function(){},true,true);
      
      $("#modalIndDocNivEmpresa").on("hidden.bs.modal",function(){
         $("#modalIndicadoresProyecto").modal("show");
      });
   });
}

function ocultarDetalleIndicadorDocNivelProyecto(){
   $("#modalIndDocNivProyecto").modal("hide");
}

function verDetalleIndicadorDocNivelProyecto(pindex){
   $("#modalIndicadoresProyecto").modal("hide");
   $("#modalIndDocNivProyecto").remove();
    
   proyectoIndicadorObj = (busquedaActivaIndTotalProy == 0?listProyectosIndicadoresActuales[pindex]:listFullRegIndTotalProyBuscador[pindex]);
    
   var dataParam={
      proyectoId: proyectoIndicadorObj.id,proyectoActual: copiaSinHtmlParaEnviar(proyectoIndicadorObj)
   };
	    
   callAjaxPost(URL+"/contratista/indicador/nivel_proyecto/detalle",dataParam,function(data){  
      proyectoIndicadorAuxObj = data.proyecto[0];
      
      var estadoDocumentosNivelProyectoConObj = verificarIndicadorDocNivelProyectoContratista(proyectoIndicadorAuxObj);
      
      var indDocNivelProy = 
	 pasarDecimalPorcentaje(proyectoIndicadorObj.numDocumentosNivelProyectoAprobados/proyectoIndicadorObj.numDocumentosNivelProyectoTotal) +
         " ("+proyectoIndicadorObj.numDocumentosNivelProyectoAprobados+" / "+proyectoIndicadorObj.numDocumentosNivelProyectoTotal+")";
      
      var estadoDocProyActual = (estadoDocumentosNivelProyectoConObj.isHabilitado?iconoGosst.aprobado+" Completo":
                                 iconoGosst.advertir+" Incompleto <br>(documentos no vigentes y/o sin aprobar)");
      var styleEstadoDocProyActual = (estadoDocumentosNivelProyectoConObj.isHabilitado?"#A9DE9B":"#DD6055");
      
      var contenido = "";
      
      var listContenido=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list-alt'></i> Título del proyecto",inputForm:proyectoIndicadorObj.titulo},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building-o'></i> Contratista:",inputForm:proyectoIndicadorObj.contratistaNombre},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
   	 {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
	  label:"<i class='fa fa-inbox' aria-hidden='true'></i> Estado documentos - Nivel proyecto:",inputForm:"<label>"+estadoDocProyActual+"</label>"}
      ];
      
      if(proyectoIndicadorObj.habilitadoActividad1 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Actividad programa:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoActividadPrograma}); 
      }
      
      if(proyectoIndicadorObj.habilitadoActividad2 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Plan de emergencia:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoPlanEmergencia}); 
      }
      
      if(proyectoIndicadorObj.habilitadoActividad4 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Plan de manejo de residuos:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoPlanManejoResiduo}); 
      }
      
      if(proyectoIndicadorObj.habilitadoActividad7 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Matriz de Riesgo (IPERC):",
	     inputForm:estadoDocumentosNivelProyectoConObj.textoMatrizRiesgoDoc}); 
      }

      if(proyectoIndicadorObj.habilitadoActividad6 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Plan COVID:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoPlanCovid}); 
      }
      
      if(proyectoIndicadorObj.habilitadoActividad10 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
             label:"Registro de capacitaciones efectuadas relacionados a los trabajos a realizar:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoRegCapRealizadas}); 
      }

      if(proyectoIndicadorObj.habilitadoActividad11 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Orden de compra o contrato firmado:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoOrdenCompra}); 
      }

      if(proyectoIndicadorObj.habilitadoActividad12 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Cronograma de trabajo:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoCronogramaTrabajo}); 
      }

      if(proyectoIndicadorObj.habilitadoActividad13 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Programa de charlas diarias de seguridad:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoProgramaCharlas}); 
      }
      
      if(proyectoIndicadorObj.habilitadoActividad14 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Procedimiento escrito de trabajo seguro (PETS):",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoProcedimientoAts}); 
      }

      if(proyectoIndicadorObj.habilitadoActividad15 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Hoja MSDS:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoHojaMsds}); 
      }

      if(proyectoIndicadorObj.habilitadoActividad16 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
             label:"Instructivo de trabajo seguro para el trabajo en alto riesgo:",
    	     inputForm:estadoDocumentosNivelProyectoConObj.textoInstructivoTrabAltoRiesgo}); 
      }

      if(proyectoIndicadorObj.habilitadoActividad18 == 1){
	 listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
	     {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Matriz de aspectos ambientales:",
	      inputForm:estadoDocumentosNivelProyectoConObj.textoMatrizAspectoAmbiental});
      }

       if(proyectoIndicadorObj.habilitadoActividad19 == 1){
           listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
               {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Memoria descriptiva:",
                inputForm:estadoDocumentosNivelProyectoConObj.textoActividad19});
       }

       if(proyectoIndicadorObj.habilitadoActividad20 == 1){
           listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
               {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Póliza de responsabilidad civil:",
                inputForm:estadoDocumentosNivelProyectoConObj.textoActividad20});
       }

       if(proyectoIndicadorObj.habilitadoActividad21 == 1){
           listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
               {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Póliza CAR:",
                inputForm:estadoDocumentosNivelProyectoConObj.textoActividad21});
       }

       if(proyectoIndicadorObj.habilitadoActividad22 == 1){
           listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
               {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Carta fianza:",
                inputForm:estadoDocumentosNivelProyectoConObj.textoActividad22});
       }
	   
	   if(proyectoIndicadorObj.habilitadoActividad23 == 1){
	       listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
	           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
	           {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Plan de rescate:",
	            inputForm:estadoDocumentosNivelProyectoConObj.textoActividad23});
	   }

	   if(proyectoIndicadorObj.habilitadoActividad24 == 1){
		   listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
			   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
			   {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Plan de izaje:",
			    inputForm:estadoDocumentosNivelProyectoConObj.textoActividad24});
	   }

	   if(proyectoIndicadorObj.habilitadoActividad25 == 1){
		   listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
			   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
			   {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Matriz de procesos y actividades:",
			    inputForm:estadoDocumentosNivelProyectoConObj.textoActividad25});
	   }

	   if(proyectoIndicadorObj.habilitadoActividad26 == 1){
		   listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
			   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
			   {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Estructura de SST para el servicio:",
			    inputForm:estadoDocumentosNivelProyectoConObj.textoActividad26});
	   }

	   if(proyectoIndicadorObj.habilitadoActividad27 == 1){
		   listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
			   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
			   {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Plan de contingencia:",
			    inputForm:estadoDocumentosNivelProyectoConObj.textoActividad27});
	   }

	   if(proyectoIndicadorObj.habilitadoActividad28 == 1){
		   listContenido.push((listContenido.length == 4?{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}:
			   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}),
			   {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Señalización de obras e instalaciones:",
			    inputForm:estadoDocumentosNivelProyectoConObj.textoActividad28});
	   }
      
      listContenido.push(
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<button class='btn btn-success' type='button' style='font-size:18px;' " +
	   		"onclick='ocultarDetalleIndicadorDocNivelProyecto()'>" +
	           "<i class='fa fa-arrow-left'></i> Volver" +
	        "</button>",inputForm:""});
      
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
    	  				
      var modalOptionsIndDocNivEmpresa={
    	 id: "modalIndDocNivProyecto",
    	 nombre: "<i class='fa fa-list-ul'></i> Detalle Indicador - Documentos a nivel proyecto ["+indDocNivelProy+"]",
    	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
    	  				
      crearModalPrincipalUsuario(modalOptionsIndDocNivEmpresa,function(){},true,true);
      
      $("#modalIndDocNivProyecto").on("hidden.bs.modal",function(){
         $("#modalIndicadoresProyecto").modal("show");
      });
   });
}

var proyectoObjAux,listTrabContratistaAsignados=[],listTrabContratistaAsignadosBuscador=[];
var busquedaActivaTrabContAsig,numPaginaActualTrabContAsig;

// P-A00013: igual que P-A00012/14, "Habilitado" tiene que considerar las licencias del conductor.
var mapConductorEstadoIndTrab = new Map();
var conductorEstadoIndTrabCargado = false;
var conductorEstadoIndTrabError = false;
var conductorSeEvaluaIndTrab = false;
// Hasta que llega la lista de trabajadores del detalle, las llamadas del conductor no repintan la tabla: cambiarPaginaIndicadorTrabajadorContratista
// termina con $.unblockUI(), asi que repintar antes de tiempo apagaba la ruedita y dejaba la tabla vacia hasta que llegara el detalle.
var detalleIndTrabListo = false;

function ocultarDetalleIndicadorDocNivelTrabContratista(){
   $("#modalConsolidadoTrabContAsig").modal("hide");$("#modalIndicadoresProyecto").modal("show");
}

function verDetalleIndicadorDocNivelTrabContratista(idAux,pindex){
    $("#modalIndicadoresProyecto").modal("hide");$("#modalConsolidadoTrabContAsig").remove();
   
    listFullProyectoSeguridad.forEach(function(val,index){
        if(parseInt(idAux) == val.id){
	        proyectoObjAux = listFullProyectoSeguridad[index];
        }
    });
   
   proyectoIndicadorObj = (busquedaActivaIndTotalProy == 0?listProyectosIndicadoresActuales[pindex]:listFullRegIndTotalProyBuscador[pindex]);
   
   var indDocNivelTrabCont = pasarDecimalPorcentaje(proyectoIndicadorObj.numTrabajadoresContAprobados/proyectoIndicadorObj.trabajadoresTotal) +
      " ("+proyectoIndicadorObj.numTrabajadoresContAprobados+" / "+proyectoIndicadorObj.trabajadoresTotal+")";
    
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' id='btnOcultarConTrabContAsig' class='btn btn-info' style='margin-right:5px' " +
              "onclick='ocultarDetalleIndicadorDocNivelTrabContratista()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonClipboard = 
      "<button id='btnClipboardConTrabContAsig' type='button' class='clipGosst btn btn-success' title='Copiar todos los registros " +
              "actuales pertenecientes al consolidado' style='margin-right:5px' onclick='obtenerTablaClipboardIndicadorTrabajadorContratista()'>" + 
         "<i class='fa fa-clipboard fa-2x'></i>" + 
      "</button>";
   
   var buttonExcel = 
      "<button type='button' class='btn btn-excel' title='Descargar toda la data del consolidado en un excel.' " +
              "onclick='descargarExcelConsolidadoTrabajadorContratista()'>" + 
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
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";
   
   var titulo = (proyectoIndicadorObj.titulo.length >= 45?proyectoIndicadorObj.titulo.substr(0,44)+"...":proyectoIndicadorObj.titulo);
   var contratistaNombre = (proyectoIndicadorObj.contratistaNombre.length >= 45?
      proyectoIndicadorObj.contratistaNombre.substr(0,44)+"...":proyectoIndicadorObj.contratistaNombre);
   var tipoExamenContUno = (parseInt(getSession("gestopcompanyid")) == 741?"Habilitación médica ocupacional":"Certificado Aptitud Médico");

   var modalOptions={
       maxWidth:"90%",id:"modalConsolidadoTrabContAsig",nombre:"<i class='fa fa-table'></i> Proyecto '"+titulo+"' - Contratista '"+contratistaNombre+"'"+
           "<br> Detalle Indicador - Documentos a nivel trabajador ["+indDocNivelTrabCont+"]",btnCerrarHabilitado:0,
      contenido: 
	 "<form class='form-inline'>" +
             buttonVolver+buttonClipboard+buttonExcel+buttonFlechas+buscadorOpciones +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoTrabContAsig'>" +
            "<table id='tblConsolidadoTrabContAsig' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<td class='tb-acc' style='width:150px'>Cumple (nivel trabajador)</td>" +
		      (proyectoObjAux.numTrabajosAltoRiesgoTotal == 0 || (proyectoObjAux.habilitadoConstanciaAltoRiesgo == 0 && proyectoObjAux.habilitarCargoInduccionTrabAltRie == 0 &&
		       proyectoObjAux.habilitadoMedicoClinica == 0)?"":"<td class='tb-acc' style='width:300px'>Trabajos de alto riesgo asignados</td>") +
		     "<td class='tb-acc' style='width:300px'>Trabajador(a)</td>" + 
		     "<td class='tb-acc' style='width:250px'>Empresa</td>" +
//		     "<td class='tb-acc' style='width:200px'>Área</td>" +
		     "<td class='tb-acc' style='width:200px'>Puesto de trabajo</td>" +
		     "<td class='tb-acc' style='width:120px'>Tipo Documento</td>" +
		     "<td class='tb-acc' style='width:150px'>N° Documento</td>" +
              (proyectoObjAux.habilitarEsConductor == 0?"":"<td class='tb-acc' style='width:170px'>¿Es conductor?</td>" +
               "<td class='tb-acc' style='width:220px'>Licencias del conductor</td>") +
		      (proyectoObjAux.habilitadoEsPrevencionista == 0?"":"<td class='tb-acc' style='width:170px'>¿Es prevencionista?</td>") +
              (proyectoObjAux.habilitadoEsPrevencionista == 0 || proyectoObjAux.habilitadoEntrevistaPrevencionista == 0?"":
               "<td class='tb-acc' style='width:170px'>Entrevista prevencionista</td>") +
		      (proyectoObjAux.habilitadoCertAptMedica == 0?"":"<td class='tb-acc' style='width:170px'>"+tipoExamenContUno+"</td>") +
		      (proyectoObjAux.habilitadoSctr == 0?"":
		       "<td class='tb-acc' style='width:170px'>SCTR</td>") +
		      (proyectoObjAux.habilitadoEpp == 0?"":
		       "<td class='tb-acc' style='width:170px'>EPP</td>") +
		      (proyectoObjAux.habilitacionInduccion3 == 0?"":
		       "<td class='tb-acc' style='width:170px'>Inducción del cliente</td>") +
		      (proyectoObjAux.habilitadoCargReglamento == 0?"":
	               "<td class='tb-acc' style='width:170px'>Cargo reglamento</td>") +
		      (proyectoObjAux.habilitadoTRegistro == 0?"":
		       "<td class='tb-acc' style='width:170px'>T-registro</td>") +
		      (proyectoObjAux.habilitadoInduccSstCont == 0?"":
		       "<td class='tb-acc' style='width:170px'>Inducciones SST de la contratista</td>") + 
		      (proyectoObjAux.habilitadoPruebaCovid == 0?"":
		       "<td class='tb-acc' style='width:170px'>Prueba COVID-19</td>") + 
		      (proyectoObjAux.habilitadoVacunaCovid == 0?"":
		       "<td class='tb-acc' style='width:170px'>Vacuna COVID-19</td>") + 
		      (proyectoObjAux.habilitadoCertifPolicial == 0?"":
		       "<td class='tb-acc' style='width:170px'>Certificados policiales</td>") + 
		      (proyectoObjAux.habilitadoAntecedentesPenales == 0?"":
		       "<td class='tb-acc' style='width:170px'>Antecedentes penales</td>") + 
		      (proyectoObjAux.habilitadoSeguroAccidentes == 0?"":
		       "<td class='tb-acc' style='width:170px'>Seguro contra accidentes</td>") + 
		      (proyectoObjAux.habilitadoRiesgoExposicionPuestoTrabajo == 0?"":
		       "<td class='tb-acc' style='width:170px'>Riesgo de exposición al puesto de trabajo</td>") + 
		      (proyectoObjAux.habilitadoVacunacionCovid == 0?"":
		       "<td class='tb-acc' style='width:170px'>Vacunación COVID-19</td>") + 
		      (proyectoObjAux.habilitadoCarnetSanidad == 0?"":
		       "<td class='tb-acc' style='width:170px'>Carnet de sanidad</td>") + 
		      (proyectoObjAux.habilitadoAcuerdoSeguridadEquElec == 0?"":
		       "<td class='tb-acc' style='width:170px'>Acuerdo de seguridad y confidencialidad - equipos electrónicos</td>") + 
		      (proyectoObjAux.habilitadoEvaluacionToxicologica == 0?"":
		       "<td class='tb-acc' style='width:170px'>Evaluación toxicológica</td>") + 
		      (proyectoObjAux.habilitadoCertifUnicoLaboral == 0?"":
		       "<td class='tb-acc' style='width:170px'>Certificado único laboral</td>") + 
		      (proyectoObjAux.habilitadoAntecedentesPoliciales == 0?"":
		       "<td class='tb-acc' style='width:170px'>Antecedentes policiales</td>") + 
		      (proyectoObjAux.habilitadoDeclaracionVerifDomicilio == 0?"":
		       "<td class='tb-acc' style='width:170px'>Declaración jurada o verificación del domicilio</td>") + 
		      (proyectoObjAux.habilitadoDotacionIndumentaria == 0?"":"<td class='tb-acc' style='width:170px'>Dotación indumentaria</td>") +
              (proyectoObjAux.habilitadoMedicoClinica == 0?"":"<td class='tb-acc' style='width:270px'>Habilitación médica por clínica</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont84 == 0?"":"<td class='tb-acc' style='width:170px'>Cargo RISST de la contratista</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont89 == 0?"":"<td class='tb-acc' style='width:170px'>Cargo de recepción de IPERC</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont90 == 0?"":"<td class='tb-acc' style='width:170px'>Seguro vida ley</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont99 == 0?"":"<td class='tb-acc' style='width:170px'>Documento de identidad</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont100 == 0?"":"<td class='tb-acc' style='width:170px'>Procedimiento o manual para trab. contratistas</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont101 == 0?"":"<td class='tb-acc' style='width:170px'>Cargo de procedimiento de HS</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont111 == 0?"":"<td class='tb-acc' style='width:170px'>Inducción SSOMA del cliente</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont112 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de capacitación en procedimiento de trabajo</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont113 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de difusión de política de seguridad del cliente</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont114 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de difusión de RISST del cliente</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont115 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en reporte de accidentes e incidentes (flujograma)</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont116 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión de IPERC, PETS y PETAR</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont117 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de capacitación por puesto de trabajo</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont118 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de capacitación de IPERC de la contratista</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont119 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación de buenas prácticas de manipulación de alimentos</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont128 == 0?"":"<td class='tb-acc' style='width:170px'>Título del profesional</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont129 == 0?"":"<td class='tb-acc' style='width:170px'>Evidencia colegiatura habilitada</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont130 == 0?"":"<td class='tb-acc' style='width:170px'>Registro nacional de especialidad</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont131 == 0?"":"<td class='tb-acc' style='width:170px'>Constancia/Carnet SUCAMEC</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont132 == 0?"":"<td class='tb-acc' style='width:170px'>Certificado capacitacion - BLS (Basic Life Support)</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont133 == 0?"":"<td class='tb-acc' style='width:170px'>Certificado capacitacion - PHLS (Prehospital Trauma Life Support)</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont134 == 0?"":"<td class='tb-acc' style='width:170px'>Certificado capacitacion - ACLS (Advance Cardiovascular Life Support)</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont140 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión de plan de respuesta a emergencia del cliente</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont141 == 0?"":"<td class='tb-acc' style='width:170px'>Charla de inducción SST y MA</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont142 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión y entrega de política de sostenibilidad del cliente</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont143 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión y entrega plan COVID-19</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont144 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en matriz IPERC</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont145 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en matriz IAAS</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont146 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en primeros auxilios</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont147 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en uso extintor</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont148 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en plan contingencia</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont149 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en procedimiento de trabajo</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont150 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en ATS</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont151 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en capacitación uso de EPP</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont152 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en manejo de insumos químicos - hojas MSDS</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont153 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en uso de herramientas manuales</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont154 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en procedimiento de señalización</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont155 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 1</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont156 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 2</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont157 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 3</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont158 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 4</td>") +
              (proyectoObjAux.habilitadoExamNivelTrabCont159 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 5</td>") +
              (proyectoObjAux.habilitadoHojaVida == 0?"":"<td class='tb-acc' style='width:170px'>Hoja de Vida</td>") +
		     "<td class='tb-acc' style='width:150px'>¿Sin sanciones en curso?</td>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoTrabContAsig",215);
   cargarDetalleIndicadorDocNivelTrabContratista();

   $("#flechaIzquierdaTrabContAsig").on('click',function(){
      numPaginaActualTrabContAsig = numPaginaActualTrabContAsig-1;
      cambiarPaginaIndicadorTrabajadorContratista();
   });
	 
   $('#flechaDerechaTrabContAsig').on('click',function(){
      numPaginaActualTrabContAsig = numPaginaActualTrabContAsig+1;
      cambiarPaginaIndicadorTrabajadorContratista();
   });
}

function cargarDetalleIndicadorDocNivelTrabContratista(){
    busquedaActivaTrabContAsig = 0,numPaginaActualTrabContAsig = 1;

    mapConductorEstadoIndTrab = new Map();
    conductorEstadoIndTrabCargado = false;
    conductorEstadoIndTrabError = false;
    // Sin la seccion de conductores en el proyecto no se consultan sus licencias: el conductor no se evalua
    // ("esConductor" viene de la ficha del trabajador, no del proyecto) -- mismo criterio que P-A00012/14.
    conductorSeEvaluaIndTrab = (proyectoObjAux.habilitarEsConductor == 1);
    detalleIndTrabListo = false;

    callAjaxPost(URL+'/contratista/indicador/nivel_trabajador/detalle/version_dos',copiaSinHtmlParaEnviar(proyectoObjAux),function(data){
        if(data.CODE_RESPONSE == "05"){
	        listTrabContratistaAsignados = data.listTrabContratistaAsignados;

	        detalleIndTrabListo = true;
	        cambiarPaginaIndicadorTrabajadorContratista();

	        goheadfixedY("#tblConsolidadoTrabContAsig","#wrapperConsolidadoTrabContAsig");
        }else{
            console.log("Error al cargar el consolidado - Trabajadores asignados");
        }
    });

    // Las dos llamadas del conductor terminan mucho antes que la del detalle (que puede pesar decenas de MB): se les pasa autoUnblock=false
    // (ultimo parametro de callAjaxPost) para que no apaguen la ruedita de carga y dejen la tabla en blanco hasta que llegue el detalle.
    if(conductorSeEvaluaIndTrab){
        callAjaxPost(URL+'/contratista/conductor',
           {contratistaId:proyectoObjAux.contratistaId,listTrabAsignadosActivosIdAux:proyectoObjAux.listTrabAsignadosActivosIdAux},
           function(dataCond){
              if(dataCond.CODE_RESPONSE == "05" && dataCond.listConductores.length > 0){
                 callAjaxPost(URL+'/contratista/conductor/consolidado_estado_actual',
                    {conductoresInfoAux:dataCond.listConductores,fechaReferencia:proyectoObjAux.fechaReferencia},function(dataEstado){
                    if(dataEstado.CODE_RESPONSE == "05"){
                       dataEstado.listConsolidadoConductoresEstado.forEach(function(val){
                          mapConductorEstadoIndTrab.set(val.trabContratista.id,val);
                       });
                       conductorEstadoIndTrabCargado = true;
                    }else{
                       conductorEstadoIndTrabError = true;
                    }

                    if(detalleIndTrabListo){cambiarPaginaIndicadorTrabajadorContratista();}
                 },null,{},function(){
                    // Error de red o del servidor (callAjaxPost no llama a la funcion de exito): no dejar "Verificando..."
                    if(!conductorEstadoIndTrabCargado && !conductorEstadoIndTrabError){
                       conductorEstadoIndTrabError = true;
                       if(detalleIndTrabListo){cambiarPaginaIndicadorTrabajadorContratista();}
                    }
                 },null,false);
              }else{
                 // Sin conductores en la lista no hay nada que consultar: equivale a una respuesta vacia.
                 conductorEstadoIndTrabCargado = true;
                 if(detalleIndTrabListo){cambiarPaginaIndicadorTrabajadorContratista();}
              }
           },null,{},function(){
              if(!conductorEstadoIndTrabCargado && !conductorEstadoIndTrabError){
                 conductorEstadoIndTrabError = true;
                 if(detalleIndTrabListo){cambiarPaginaIndicadorTrabajadorContratista();}
              }
           },null,false);
    }
}

// Reutiliza el modal de la pestana "Conductores" (conductores.js), con el mismo patron ya revisado por Ronal
// en P-A00012: se le pasa como prefiltro el N° de documento del trabajador, y filtra la fila de inmediato.
// listConductores/listTipoLicencias/mapTipoLicenciaCondHabilitada/numTipoLicCondHabilitados son globales de
// conductores.js (misma pagina contratista.html); se recargan aqui para no depender de que el usuario haya
// entrado antes a la pestana "Conductores".
function verEstadoConductorDesdeIndTrab(pindex){
    $("#modalConsolidadoTrabContAsig").modal("hide");

    var val = listTrabContIndicadorAux[pindex];

    // Solo el conductor de este trabajador: pedir todos los de la contratista traia ~4 MB y tardaba ~12 s, para mostrar una sola fila.
    callAjaxPost(URL+'/contratista/conductor',{contratistaId:proyectoObjAux.contratistaId,listTrabAsignadosActivosIdAux:[val.id]},function(data){
        if(data.CODE_RESPONSE == "05"){
            listConductores = data.listConductores;listTipoLicencias = data.listTipoLicencias;

            mapTipoLicenciaCondHabilitada = new Map();
            numTipoLicCondHabilitados = listTipoLicencias.length;

            listTipoLicencias.forEach(function(valLic){
                mapTipoLicenciaCondHabilitada.set(valLic.id,1);
            });

            verConsolidadoConductoresEstadoActual(val.nroDocumento,"indicadorTrabContratista");
        }
    });
}

var listTrabContIndicadorAux;

function cambiarPaginaIndicadorTrabajadorContratista(){
   $("#flechaIzquierdaTrabContAsig").show();$("#flechaDerechaTrabContAsig").show(); 
   
   var list = (busquedaActivaTrabContAsig == 0?listTrabContratistaAsignados:listTrabContratistaAsignadosBuscador);
    listTrabContIndicadorAux = list;
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
            var estadoDocumentosTrabConObj = verificarIndicadorDocNivelTrabajadorContratista(val,proyectoObjAux);

            // P-A00013: "Habilitado" considera las licencias del conductor, con el mismo criterio tri-estado que
            // P-A00012/14 -- "pendiente" (todavia no responde) y "error" (la consulta fallo) NUNCA cuentan como
            // aprobado, porque un falso positivo es peor que mostrar un aviso momentaneo.
            var estadoConductorRowIndTrab = (val.esConductor == 1 && conductorEstadoIndTrabCargado?mapConductorEstadoIndTrab.get(val.id):null);
            var estadoConductorIndTrab = (val.esConductor != 1 || !conductorSeEvaluaIndTrab?"ok":
                conductorEstadoIndTrabError?"error":
                !conductorEstadoIndTrabCargado?"pendiente":
                (estadoConductorRowIndTrab != null && estadoConductorRowIndTrab.habilitado == "Sí"?"ok":"no"));
            var textHabili = (!estadoDocumentosTrabConObj.isHabilitado?iconoGosst.desaprobado+" No":
                estadoConductorIndTrab == "error"?iconoGosst.alerta+" No se pudo verificar":
                estadoConductorIndTrab == "pendiente"?iconoGosst.alerta+" Verificando...":
                estadoConductorIndTrab == "ok"?iconoGosst.aprobado+" Sí":iconoGosst.desaprobado+" No");

            // Mismo patron que el consolidado de P-A00012: "Habilitado: Si/No" + enlace "Ver estado" que abre
            // el modal ordenado por tipo de licencia (en vez de listar todo el detalle en la celda).
            var linkVerEstadoConductorIndTrab = "<br><a class='efectoLink' onclick='verEstadoConductorDesdeIndTrab("+index+")' " +
                "title='Ver el estado de las licencias del conductor.'><i class='fa fa-eye'></i> Ver estado</a>";
            var textoConductorLicIndTrab = (val.esConductor != 1?"------":
                estadoConductorIndTrab == "error"?iconoGosst.alerta+" No se pudo verificar"+linkVerEstadoConductorIndTrab:
                estadoConductorIndTrab == "pendiente"?iconoGosst.alerta+" Verificando..."+linkVerEstadoConductorIndTrab:
                (estadoConductorIndTrab == "ok"?iconoGosst.aprobado:iconoGosst.alerta)+" "+
                (estadoConductorRowIndTrab != null?"Habilitado: "+estadoConductorRowIndTrab.habilitado:"Sin licencias asignadas")+
                linkVerEstadoConductorIndTrab);

            var textoTrabajosAltoRiesgo = (val.textoTrabajosAltoRiesgo.length == 0?"No tiene ninguno asignado.":
                (val.habilitadoTrabajosAltoRiesgo == 1?iconoGosst.aprobado:iconoGosst.alerta)+" "+val.textoTrabajosAltoRiesgo +
                "<br>"+"<a class='efectoLink' onclick='verConstanciaTrabAltoRiesgoTrabCon(3,"+index+")' title='Ver el estado según los trabajos de alto riesgo asignados.'>" +
	                       "<i class='fa fa-eye'></i> Ver estado" +
                       "</a>")+
                (proyectoObjAux.trabajosAltoRiesgoChtHabilitadosId.length == 0?"":"<br><br>" +
                 "<a class='efectoLink' onclick='verHistorialTrabajosAltoRiesgoTrabajadorContratista("+index+",1)' title='Ver historial.'>" +
                     "<i class='fa fa-table'></i> Ver historial" +
                 "</a>");
		   
         var nombreCompleto = (val.apellido.length == 0 && val.nombre.length == 0?"------":
            ((val.apellido.length == 0?"":val.apellido+", ")+(val.nombre.length == 0?"":val.nombre)));
         
         var textoTrabajosAltoRiesgoHabMedCli = (proyectoObjAux.habilitadoMedicoClinica == 1 && val.textoTrabajosAltoRiesgoHabMedCli.length > 0?"<br>["+val.textoTrabajosAltoRiesgoHabMedCli+"]":"");
				
         $("#tblConsolidadoTrabContAsig tbody").append(
            "<tr id='trTrabContratista"+val.id+"'>" +
	       "<td class='tdIconoEval'>"+textHabili+"</td>" +
	        (proyectoObjAux.numTrabajosAltoRiesgoTotal == 0 || (proyectoObjAux.habilitadoConstanciaAltoRiesgo == 0 && proyectoObjAux.habilitarCargoInduccionTrabAltRie == 0 &&
	         proyectoObjAux.habilitadoMedicoClinica == 0)?"":"<td>"+textoTrabajosAltoRiesgo+"</td>") +
	       "<td>"+nombreCompleto+"</td>" +
	       "<td style='word-break:break-all;'>"+(val.cliente.length == 0?"------":val.cliente)+"</td>" +
//	       "<td>"+(val.area.length == 0?"------":val.area)+"</td>" +
	       "<td>"+(val.cargo.length == 0?"------":val.cargo)+"</td>" +
	       "<td>"+val.tipoDocumento.nombre+"</td>" +
	       "<td>"+val.nroDocumento+"</td>" +
             (proyectoObjAux.habilitarEsConductor == 0?"":"<td>"+(val.esConductor == 1?"Sí":"No")+"</td>" +
              "<td>"+textoConductorLicIndTrab+"</td>") +
	        (proyectoObjAux.habilitadoEsPrevencionista == 0?"":"<td>"+estadoDocumentosTrabConObj.textoPrevencionista+"</td>") +
            (proyectoObjAux.habilitadoEsPrevencionista == 0 || proyectoObjAux.habilitadoEntrevistaPrevencionista == 0?"":
             "<td>"+estadoDocumentosTrabConObj.textoEntrevistaPrevencionista+"</td>") +
	        (proyectoObjAux.habilitadoCertAptMedica == 0?"":
	         "<td>"+estadoDocumentosTrabConObj.textoExamen+"</td>") +
		(proyectoObjAux.habilitadoSctr == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoSctr+"</td>") +
		(proyectoObjAux.habilitadoEpp == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoEpp+"</td>") +
		(proyectoObjAux.habilitacionInduccion3 == 0?"":
	         "<td>"+estadoDocumentosTrabConObj.textoInduccion+"</td>") +
		(proyectoObjAux.habilitadoCargReglamento == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoCargo+"</td>") +
		(proyectoObjAux.habilitadoTRegistro == 0?"":
	         "<td>"+estadoDocumentosTrabConObj.textoTreg+"</td>") +
		(proyectoObjAux.habilitadoInduccSstCont == 0?"":
	         "<td>"+estadoDocumentosTrabConObj.textoInduccionSst+"</td>") +
		(proyectoObjAux.habilitadoPruebaCovid == 0?"":
	         "<td>"+estadoDocumentosTrabConObj.textoPruebaCovid+"</td>") +
		(proyectoObjAux.habilitadoVacunaCovid == 0?"":
	         "<td>"+estadoDocumentosTrabConObj.textoVacunaCovid+"</td>") +
		(proyectoObjAux.habilitadoCertifPolicial == 0?"":
	         "<td>"+estadoDocumentosTrabConObj.textoCertificadoPolicial+"</td>") +
	        (proyectoObjAux.habilitadoAntecedentesPenales == 0?"":
		 "<td>"+estadoDocumentosTrabConObj.textoAntecedentesPenales+"</td>") +
		(proyectoObjAux.habilitadoSeguroAccidentes == 0?"": 
		 "<td>"+estadoDocumentosTrabConObj.textoSeguroAccidentes+"</td>") +
		(proyectoObjAux.habilitadoRiesgoExposicionPuestoTrabajo == 0?"": 
	         "<td>"+estadoDocumentosTrabConObj.textoRiesgoExposicionPuestoTrabajo+"</td>") +
	        (proyectoObjAux.habilitadoVacunacionCovid == 0?"": 
		 "<td>"+estadoDocumentosTrabConObj.textoVacunacionCovid+"</td>") +
		(proyectoObjAux.habilitadoCarnetSanidad == 0?"": 
		 "<td>"+estadoDocumentosTrabConObj.textoCarnetSanidad+"</td>") +
		(proyectoObjAux.habilitadoAcuerdoSeguridadEquElec == 0?"":"<td>"+estadoDocumentosTrabConObj.textoAcuerdoSeguridadEquElec+"</td>") +
	    (proyectoObjAux.habilitadoEvaluacionToxicologica == 0?"":"<td>"+estadoDocumentosTrabConObj.textoEvaluacionToxicologica+"</td>") +
		(proyectoObjAux.habilitadoCertifUnicoLaboral == 0?"":"<td>"+estadoDocumentosTrabConObj.textoCertifUnicoLaboral+"</td>") +
		(proyectoObjAux.habilitadoAntecedentesPoliciales == 0?"":"<td>"+estadoDocumentosTrabConObj.textoAntecedentesPoliciales+"</td>") +
		(proyectoObjAux.habilitadoDeclaracionVerifDomicilio == 0?"":"<td>"+estadoDocumentosTrabConObj.textoDeclaracionVerifDomicilio+"</td>") +
		(proyectoObjAux.habilitadoDotacionIndumentaria == 0?"":"<td>"+estadoDocumentosTrabConObj.textoDotacionIndumentaria+"</td>") +
        (proyectoObjAux.habilitadoMedicoClinica == 0?"":"<td>"+estadoDocumentosTrabConObj.textoHabilitadoMedicoClinica+textoTrabajosAltoRiesgoHabMedCli+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont84 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont84+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont89 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont89+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont90 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont90+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont99 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont99+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont100 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont100+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont101 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont101+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont111 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont111+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont112 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont112+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont113 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont113+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont114 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont114+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont115 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont115+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont116 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont116+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont117 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont117+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont118 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont118+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont119 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont119+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont128 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont128+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont129 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont129+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont130 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont130+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont131 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont131+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont132 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont132+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont133 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont133+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont134 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont134+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont140 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont140+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont141 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont141+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont142 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont142+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont143 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont143+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont144 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont144+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont145 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont145+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont146 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont146+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont147 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont147+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont148 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont148+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont149 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont149+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont150 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont150+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont151 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont151+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont152 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont152+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont153 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont153+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont154 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont154+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont155 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont155+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont156 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont156+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont157 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont157+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont158 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont158+"</td>") +
        (proyectoObjAux.habilitadoExamNivelTrabCont159 == 0?"":"<td>"+estadoDocumentosTrabConObj.textoExamNivelTrabCont159+"</td>") +
		(proyectoObjAux.habilitadoHojaVida == 0?"":"<td>"+estadoDocumentosTrabConObj.textoHojaVida+"</td>") +
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

function descargarExcelConsolidadoTrabajadorContratista(){
   window.open(URL+"/contratista/excel/consolidado_trabajador_contratista?"+"id="+proyectoObjAux.id+"&contratistaId="+proyectoObjAux.contratistaId);   
}
