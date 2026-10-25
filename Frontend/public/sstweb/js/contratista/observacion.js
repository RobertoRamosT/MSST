var observacionId;var observacionObj={};
var fechaPla;
var fechaReal;
var responsable;
var banderaEdicion2;

var listPerdida;
var listReporte;
var listFactores;
var ObservacionEstado;
var ObservacionEstadoNombre;
var listaFullObservacion;
var listEvaluacion;
var listNotas;
var listProyectos = [];
var numPaginaActual;
var numPaginaTotal;
var trabajadoresSugeridos;
var listaTrabs;

var listProyectosId=[],listTipoReportesId=[],listFactoresSegId= [],
    listPotencialesPerId=[],lisTipoNotaId=[],listGestionesId = [],
    listResponsablesId=[],listRespCorreosAux=[];

var listGestiones=[],listCausaInmediataObs=[],listGrupoRiesgo=[],listResponsables=[];

var mensajeUx;

var selEstadoObs=[
   {id:1,nombre:"En proceso"},
   {id:2,nombre:"Cerrado"}
];

var listTipoNotaObservacion=[];
var listTrabajadores;
var contadorListTrab;

$(function(){
   $('#modalEvaluacion').on('hidden.bs.modal',function(e){
      $('#mdProgFecha').modal('show');
   });
   
   $('#buscadorTrabajadorInput').keyup(function(e){
      if(e.keyCode == 13){
         $(this).trigger("enterKey");
      }
   });
	
   $('#buscadorTrabajadorInput').bind("enterKey",function(e){
      cargarModalObservaciones();
   });
	
   $("#buscadorTrabajadorInput").focus();
	
   $("#btnUploadEvaluacionNormal").on("click",function(){
      $("#divEvalNormal").show();
      $("#divImportarEval").hide();
   });
	
   $("#btnUploadEvaluacion").on("click",function(){
      $("#divImportarEval").show();
      $("#divEvalNormal").hide();
   });
	
   $("#btnGuardarImportEvals").on("click",function(){
      guardarMasivoEvaluacionesExcel();
   });
	
   $("#resetBuscador").attr("onclick","resetBuscador()");
	
   $("#cambiarBuscador").attr("onclick","toggleBuscadorJstree(2)");
   $("#cambiarBuscadorAsist").attr("onclick","toggleBuscadorAsistJstree(2)");
	
   $('.izquierda_flecha').on('click',function(){
      numPaginaActual = numPaginaActual-1
      cambiarPaginaTabla();
   });
	
   $('.derecha_flecha').on('click',function(){
      numPaginaActual = numPaginaActual+1;
      cambiarPaginaTabla();
   }); 
   
   $("#btnClipboardObsTotal").on("click",function(){
      var textoTabla = obtenerDatosBodyTablaEstandar("tblObservacionTotal");
      copiarAlPortapapeles(textoTabla,"btnClipboardObsTotal");
	
      mensajeUx="<label>Se han copiado todas las filas de la tabla " +
      		"Observaciones al contratista por proyecto.</label>";
      mensajesUx(mensajeUx,1,"");
   });
});

var titulo = "";
var accesoConsolidado,tipoObservacionId;
var sufijoObs,sizeTbl,totalUrl;

function verObservaciones(tipoId,acceso){
//  acceso => 1 (pestaña), 0 (proyecto).
    accesoConsolidado = parseInt(acceso);tipoObservacionId = tipoId;sufijoObs = "";totalUrl = '';
   
    $("#tabProyectos .container-fluid").hide();$("#tabObservacionesTotales .container-fluid").hide();
   
    if(acceso == 0){
        if(tipoId == 1){
	        $("#divObsContratistaProyecto").show();titulo = "al cliente";
            cargarModalObservacionesContratistas();
        }else{
	        $("#divObsProyecto").show();titulo = "al contratista";sizeTbl = 190;
            crearFiltroObservaciones(valoresFiltroObs);
        }
      
        $("#tabProyectos h2").html("<a onclick='volverDivProyectos()'>Proyecto ("+proyectoObj.titulo.substring(0,40)+"...) </a> >" +
   	        "<br><label>Observaciones "+titulo+"</label>");
    }else{
        $("#divObsProyectoTotal").show();sufijoObs = "Total";totalUrl = '/total';sizeTbl = 165;
        crearFiltroObservaciones(valoresFiltroObs);
    }
}

function ocultarFiltroObs(){
   $("#modalFiltroObs").modal("hide");
}

function verFiltroObs(){
    $("#modalFiltroObs").modal("show");
}

var listProyectosAux = [];

function crearFiltroObservaciones(functionCallBack){
    $("#modalFiltroObs").remove();
    
    var listGestionesAux=[],listPerdidaAux=[],listReporteAux=[],listTipoNotaAux=[];listProyectosAux=[];
    
    if(accesoConsolidado == 1){
        var dataParam={
            empresaId:parseInt(getSession("gestopcompanyid"))
        };
    }else{
        var dataParam={};
    }
  		
    callAjaxPost(URL+'/contratista/proyecto/observaciones'+totalUrl+'/filtro',dataParam,function(data){
        listGestionesAux = data.listGestiones;listPerdidaAux = data.listPerdida;listReporteAux = data.listReporte;listTipoNotaAux = data.tipoNota;
      
        if(accesoConsolidado == 1){
	        listProyectosAux = data.listProyectos;
        }
      
        listTipoNotaAux.forEach(function(val){
            if([3,4].includes(val.id)){
                val.selected = 1;
            }
        });

        var listEstadoAux=[
            {id:2,nombre:"En curso"},{id:3,nombre:"Completado"}
        ];

        var selFiltroEstadoProyObs = crearSelectOneMenuOblig("selFiltroEstadoProyObs","filtrarValoresFiltroProyectoEstadoObs()",
            listEstadoAux,2,"id","nombre");
      
        var contenido = "";

        var listContenido = [];

        if(accesoConsolidado == 1){
            listContenido.push({sugerencia:"",label:"Fecha Reporte - Inicio",inputForm:"<input type='date' id='fechaInicioRepObs' class='form-control'>"},
                {sugerencia:"",label:"Fecha Reporte - Fin",inputForm:"<input type='date' id='fechaFinRepObs' class='form-control'>"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",label:"Estado del proyecto",inputForm:selFiltroEstadoProyObs},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",label:"Proyecto",inputForm:"",divContainer:"divFiltroProyectoObs"});
        }

        listContenido.push({sugerencia:"",label:"Tipo de reporte",inputForm:"",divContainer:"divFiltroTipoReporteObs"},
            {sugerencia:"",label:"Sistema de gestión asociado",inputForm:"",divContainer:"divFiltroSistemaGesObs"},
            {sugerencia:"",label:"Potencial de pérdida",inputForm:"",divContainer:"divFiltroPotencialPerObs"},
            {sugerencia:"",label:"Calificación por administrador",inputForm:"",divContainer:"divFiltroCalificacionAdmObs"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",
             label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroObs()' style='font-size:18px;'>" +
                       "<i class='fa fa-times'></i> Cancelar" +
                   "</button>",
             inputForm:"<button id='btnAplicarFiltroObs' class='btn btn-success' type='submit' onclick='valoresFiltroObs()' style='float:right;font-size:18px;'>" +
                           "<i class='fa fa-filter'></i> Aplicar filtro" +
                       "</button>"});

        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
        });
  				
        var modalOptions={
 	        id:"modalFiltroObs",nombre:"<i class='fa fa-filter'></i> Filtros",contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
        };
  				
        crearModalPrincipalUsuario(modalOptions,function(){
            if($("#filtroTiposReporteObs").length > 0){
  	            return;
            }
         
            if(accesoConsolidado == 1){
                filtrarValoresFiltroProyectoEstadoObs();
            }
         
            crearSelectOneMenuObligMultipleCompleto("filtroTiposReporteObs","",listReporteAux,
                "id","nombre","#divFiltroTipoReporteObs","Todos");
         
            crearSelectOneMenuObligMultipleCompleto("filtroSistemasGesObs","",listGestionesAux,
                "id","nombre","#divFiltroSistemaGesObs","Todos");
         
            crearSelectOneMenuObligMultipleCompleto("filtroPotencialesPerObs","",listPerdidaAux,
                "id","nombre","#divFiltroPotencialPerObs","Todos");
         
            crearSelectOneMenuObligMultipleCompleto("filtroCalificacionAdmObs","",listTipoNotaAux,
                "id","nombre","#divFiltroCalificacionAdmObs","Todos");
        },true,true);
      
        if(accesoConsolidado == 1){
            var hoy = getSession("fechaHoyOrdenInversoTexto");
      
            $("#fechaInicioRepObs").val(sumaFechaDias(-180,hoy));$("#fechaFinRepObs").val(hoy);
        }

        functionCallBack();completarBarraCarga();
   });
}

function filtrarValoresFiltroProyectoEstadoObs(){
    var listProyectosSimpleAux = [];

    listProyectosAux.forEach(function(val){
        if(val.estado.id == parseInt($("#selFiltroEstadoProyObs").val())){
            listProyectosSimpleAux.push(val);
        }
    });

    crearSelectOneMenuObligMultipleCompleto("filtroProyectosObs","",
        listProyectosSimpleAux,"id","titulo","#divFiltroProyectoObs","TODOS");
}

function valoresFiltroObs(){
    ocultarFiltroObs();

   if(accesoConsolidado == 1){ 
      listProyectosId = [];
      var proyectoId = $("#filtroProyectosObs").val();
   
      if(proyectoId != null){
         proyectoId.forEach(function(val){
            listProyectosId.push(parseInt(val));
         });
      }
   }
    
   listTipoReportesId = [];
   var reporteId = $("#filtroTiposReporteObs").val();
   
   if(reporteId != null){
      reporteId.forEach(function(val){
         listTipoReportesId.push(parseInt(val));
      });
   }
   
   listGestionesId = [];
   var gestionId = $("#filtroSistemasGesObs").val();
   
   if(gestionId != null){
      gestionId.forEach(function(val){
	 listGestionesId.push(parseInt(val));
      });
   }
   
   listPotencialesPerId = [];
   var perdidaId = $("#filtroPotencialesPerObs").val();
   
   if(perdidaId != null){
      perdidaId.forEach(function(val){
         listPotencialesPerId.push(parseInt(val));
      });
   }
   
   lisTipoNotaId = [];
   var tipoNotaId = $("#filtroCalificacionAdmObs").val();
   
   if(tipoNotaId != null){
      tipoNotaId.forEach(function(val){
	 lisTipoNotaId.push(parseInt(val));
      });
   }
   
   cargarModalObservaciones();
}

function cargarModalObservacionesContratistas(){   
   $("#btnCancelarObs").hide();
   $("#btnAgregarObs").hide();
   $("#btnEliminarObs").hide();
   $("#btnGuardarObs").hide();
   
   resizeDivWrapper("wrapObservacionesContratista",150);
	
   var dataParam={
      id: ProyectoId,
      contratistaId: proyectoObj.postulante.contratista.id
   };

   callAjaxPost(URL+'/contratista/proyecto/observaciones',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":		
	    listaFullObservacion = data.list;
	    
	    $("#tblObservacionContratista tbody tr").remove();
				
	    listaFullObservacion.forEach(function(val,index){
	       var iconoDescarga = "<br>" +
	          "<a class='btn btn-success' target='_blank' " +
	             "href='"+URL+"/contratista/observacion/evidencia?observacionId="+val.id+"'>" +
	             "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	          "</a>";
					
	       if(val.evidenciaNombre == "----"){
	          iconoDescarga = "";
	       }
					
	       var tiempoTranscurrido = obtenerTiempoTranscurrido(val.fecha,val.hora);
					 
	       $("#tblObservacionContratista tbody").append(
	          "<tr id='tr"+val.id+"'>" +
		     "<td id='desc"+val.id+"'>"+val.descripcion +"</td>" +
		     "<td id='fec"+val.id+"'>"+val.fechaTexto+"<br>" +
	                "<strong>"+tiempoTranscurrido+"</strong></td>" +
	             "<td id='tipre"+val.id+"'>"+val.reporte.nombre+"</td>" +
	             "<td id='factor"+val.id+"'>"+val.factor.nombre+"</td>" +
	             "<td id='pot"+val.id+"'>"+val.perdida.nombre +"</td>" +
	             "<td id='tdevi"+val.id+"'>"+val.evidenciaNombre+iconoDescarga+"</td>" + 
	             "<td id='tdobsaccm"+val.id+"' class='linkGosst' " +
			 "onclick='verCompletarAccioneObservacionContratista("+index+")'>" +
		        "<i class='fa fa-star fa-2x' aria-hidden='true'></i> "+val.indicadorAcciones+"</td>" +
	             "<td id='estObs"+val.id+"'>"+(val.nivel == 1?"Proceso":"Cerrado")+"</td>" +
		  "</tr>");
	    }); 
	    
	    break;
			
         default:
	    alert("Ocurrió un error al traer las programaciones!");
      }
      
      goheadfixedY("#tblObservacionContratista","#wrapObservacionesContratista");
   });
}

var numObsAccidente,numObsASubestandar,numObsCSubestandar,numObsEnfermedad,
    numObsIncidente,numObsInspeccion,numObsReconocimiento;

var numObsPorReevaluar,numObsPendiente,numObsObservado,numObsVistoBueno;

function cargarModalObservaciones(){ 
    $("#btnAgregarObs"+sufijoObs).attr("onclick","javascript:nuevoObservacion();");
    $("#btnCancelarObs"+sufijoObs).attr("onclick","javascript:cancelarObservacion();");
    $("#btnGuardarObs"+sufijoObs).attr("onclick","javascript:guardarObservacion();");
    $("#btnEliminarObs"+sufijoObs).attr("onclick","javascript:eliminarObservacion();");
    $("#btnGenReporte"+sufijoObs).attr("onclick","javascript:generarHojaRutaForm();");
    $("#btnCancelarObs"+sufijoObs).hide();$("#btnAgregarObs"+sufijoObs).show();$("#btnEliminarObs"+sufijoObs).hide();
    $("#btnGuardarObs"+sufijoObs).hide();$("#btnFiltroObs"+sufijoObs).show();$("#btnHistorialCorreoObs"+sufijoObs).hide();

    observacionId = 0;fechaPla = null;fechaReal = null;banderaEdicion2 = false;
    listaFullObservacion = [];listEvaluacion = [];
   
    resizeDivWrapper("wrapObservaciones"+sufijoObs,sizeTbl);
   
    var dataParam={
        listTipoReportesIdFiltro:(listTipoReportesId.length == 0?null:listTipoReportesId),
        listSisGestionAsocIdFiltro:(listGestionesId.length == 0?null:listGestionesId),
        listPotencialesPerIdFiltro:(listPotencialesPerId.length == 0?null:listPotencialesPerId),
        listTipoNotaIdFiltro:(lisTipoNotaId.length == 0?null:lisTipoNotaId)
    };
   
    if(accesoConsolidado == 0){
        dataParam.id = ProyectoId;
    }else{
        dataParam.empresaId = parseInt(getSession("gestopcompanyid"));dataParam.estadoId = parseInt($("#selFiltroEstadoProyObs").val());
        dataParam.listProyectosIdFiltro = (listProyectosId.length == 0?null:listProyectosId);dataParam.fechaReporteInicio = $("#fechaInicioRepObs").val();
        dataParam.fechaReporteFin = $("#fechaFinRepObs").val();
      
        $("#btnClipboardObsTotal").show();$("#btnExcelObsTotal").show();$("#btnGraficoObsTotal").show();
    }
   
    callAjaxPost(URL+'/contratista/proyecto/observaciones'+totalUrl,dataParam,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                numObsAccidente = 0,numObsASubestandar = 0,numObsCSubestandar = 0,numObsEnfermedad = 0,
	            numObsIncidente = 0,numObsInspeccion = 0,numObsReconocimiento = 0;
	       
	            numObsPorReevaluar = 0,numObsPendiente = 0,numObsObservado = 0,numObsVistoBueno = 0;
			 
	            listaFullObservacion = data.list;listPerdida = data.listPerdida;listFactores = data.listFactores;
	            listReporte = data.listReporte;listTipoNotaObservacion = data.tipoNota;listGestiones = data.listGestiones;
	            listGrupoRiesgo = data.listGrupoRiesgo;listCausaInmediataObs = data.listCausaInmediataObs;
//	            listResponsables = data.listResponsables;
	   
	            if(accesoConsolidado == 1){
                    listProyectos = [];

                    data.listProyectos.forEach(function(val){
                        if(val.estado.id == parseInt($("#selFiltroEstadoProyObs").val())){
                            listProyectos.push(val);
                        }
                    });
	            }
	    
	            $("#tblObservacion tbody tr").remove();$("#tblObservacionTotal tbody tr").remove();
			
	            listaFullObservacion.forEach(function(val,index){
	                var datosCreacion = (val.fechaCreacionTexto.length == 0?val.fechaTexto:
		                val.fechaCreacionTexto+(val.usuarioCreacion.nombre.length == 0?"":"<br>(Por "+val.usuarioCreacion.nombre+")"));
	       
	                var datosActualizacion = (val.fechaActualizacionTexto.length == 0?"------":
		                val.fechaActualizacionTexto+(val.usuario.nombre.length == 0?"":"<br>(Por "+val.usuario.nombre+")"));
		
	                $("#tblObservacion"+sufijoObs+" tbody").append(
	                    "<tr id='tr"+val.id+"' onclick='editarObservacion("+index+")'>" +
		                     (accesoConsolidado == 0?"":"<td id='proyNomObs"+val.id+"'>"+val.proyectoNombre+"</td>" +
                                                        "<td id='proyEstadoObs"+val.id+"'>"+(val.proyectoEstadoId == 2?"En curso":"Completado")+"</td>" +
		                                                "<td id='conNomObs"+val.id+"'>"+val.contratistaNombre+"</td>") +
		                    "<td id='reportadoPor"+val.id+"'>"+val.reportadoPor+"</td>" +
		                    "<td id='tdRepPorEmpresa"+val.id+"'>"+val.empresaReportadoPor+"</td>" +
		                    "<td id='fec"+val.id+"'>"+val.fechaTexto+"</td>" +
		                    "<td id='horReal"+val.id+"'>"+val.horaRealTexto+"</td>" +
		                    "<td id='gestionObs"+val.id+"'>"+val.gestion.nombre+"</td>" +
//		                    "<td id='lugarOcurrencia"+val.id+"'>"+val.lugarOcurrencia+"</td>" +
		                    "<td id='grupoRiesgo"+val.id+"'>"+val.grupoRiesgo.nombre+"</td>" +
		                    "<td id='nomInfractor"+val.id+"'>"+val.nombreInfractor+"</td>" +
		                    "<td id='nomSubContratista"+val.id+"'>"+val.nombreSubContratista+"</td>" +
		                    "<td id='tipre"+val.id+"'>"+val.reporte.nombre+"</td>" +
//		                    "<td id='factor"+val.id+"'>"+val.factor.nombre+"</td>" +
		                    "<td id='desc"+val.id+"'>"+val.descripcion+"</td>" +
		                    "<td id='tdCausaInmObs"+val.id+"'>"+val.causaInmediataObs.nombre+"</td>" +
		                    "<td id='tdCausaInmObsDet"+val.id+"'>"+val.causaInmediataObsDetalle+"</td>" +
		                    "<td id='pot"+val.id+"'>"+val.perdida.nombre+"</td>" +
		                    "<td id='tdAccionInmTomada"+val.id+"'>"+val.accionInmediataTomada+"</td>" +
		                    "<td id='tdevi"+val.id+"' style='word-break: break-all;'>"+val.evidenciaNombre+"</td>" +
		                    "<td id='tdobsaccm"+val.id+"'>"+val.indicadorAcciones+"</td>" +
		                    "<td id='estObs"+ val.id+"'>"+val.nota.nombre+"</td>" +
		                    "<td id='anotObs"+ val.id+"'>"+val.anotacion+"</td>" +
		                    "<td id='creObs"+ val.id+"'>"+datosCreacion+"</td>" +
		                    "<td id='actObs"+ val.id+"'>"+datosActualizacion+"</td>" +
                        "</tr>");
	       
	                conteoIndicadoresGraficoObservacion(val.reporte.id,val.nota.id);
	            });
			
	            formatoCeldaSombreableTabla(true,"tblObservacion"+sufijoObs);

                break;
		
            default:
	            alert("Ocurrió un error al traer las programaciones!");
        }
      
        goheadfixedY("#tblObservacion"+sufijoObs,"#wrapObservaciones"+sufijoObs);
    });
}

function conteoIndicadoresGraficoObservacion(reporteIdAux,notaIdAux){
   var reporteId = parseInt(reporteIdAux),notaId = parseInt(notaIdAux);
    
   if(reporteId == 1){
      numObsASubestandar++;
   }else if(reporteId == 2){
      numObsCSubestandar++;
   }else if(reporteId == 3){
      numObsReconocimiento++;
   }else if(reporteId == 4){
      numObsInspeccion++;
   }else if(reporteId == 5){
      numObsAccidente++;
   }else if(reporteId == 6){
      numObsIncidente++;
   }else if(reporteId == 7){
      numObsEnfermedad++;
   }
     
   if(notaId == 1){
      numObsVistoBueno++;
   }else if(notaId == 2){
      numObsObservado++;
   }else if(notaId == 3){
      numObsPendiente++;
   }else if(notaId == 4){
      numObsPorReevaluar++;
   }  
}

function editarObservacion(pindex){
   if(!banderaEdicion2){
      observacionObj = listaFullObservacion[pindex];
      observacionId = listaFullObservacion[pindex].id;
		
      $("#tr"+observacionId).addClass("fila-edicion");
		
      var slcTipoPerdida = crearSelectOneMenu("slcTipoPerdida","",listPerdida,
	     listaFullObservacion[pindex].perdida.id,"id","nombre");
      
//      var slcFactor = crearSelectOneMenu("slcFactor","",listFactores,
//	     listaFullObservacion[pindex].factor.id,"id","nombre");
      
      var selReporte = crearSelectOneMenu("selReporte","",listReporte,
	 listaFullObservacion[pindex].reporte.id,"id","nombre");
		
      var selNotaObsGen = crearSelectOneMenuOblig("selNotaObsGen","",listTipoNotaObservacion,
	     listaFullObservacion[pindex].nota.id,"id","nombre");
		
      $("#estObs"+observacionId).html(selNotaObsGen);
//
      $("#anotObs"+observacionId)
      .html("<input type='text' id='inputAnotacObs' class='form-control'>");
      $("#inputAnotacObs").val(listaFullObservacion[pindex].anotacion);  
      
//
      fechaReal = listaFullObservacion[pindex].fecha; 
      
      formatoCeldaSombreableTabla(false,"tblObservacion"+sufijoObs);
	
      var nombreEvidencia = listaFullObservacion[pindex].evidenciaNombre; 
		
      var options={
	 container: "#tdevi"+observacionId,
	 functionCall: function(){},
	 descargaUrl: "/contratista/observacion/evidencia?observacionId="+observacionId,
	 esNuevo: false,
	 idAux: "Observacion"+observacionId,
	 evidenciaNombre: nombreEvidencia
      };
      
      crearFormEvidenciaCompleta(options);
      
        if(accesoConsolidado == 1){
	        var selProyectoObs = crearSelectOneMenuOblig("selProyectoObs","",listProyectos,
                observacionObj.proyectoId,"id","titulo");

	        $("#proyNomObs"+observacionId).html("<input class='form-control' id='inputBuscarProyectoObs'>"+selProyectoObs +
                "<label>(Buscar Proyecto asociado por título y/o nombre del contratista) [Obligatorio]</label>");
	 
	        $("#inputBuscarProyectoObs").val(observacionObj.proyectoNombre);
	        $("#inputBuscarProyectoObs").attr("onkeyup","buscarProyectoObservacion()");

            $("#proyEstadoObs"+observacionId).html((observacionObj.proyectoEstadoId == 2?"En curso":"Completado"));
	        $("#conNomObs"+observacionId).html("<label>*Automático (según el proyecto seleccionado).</label>");
	 
	        $("#btnClipboardObsTotal").hide();$("#btnExcelObsTotal").hide();$("#btnGraficoObsTotal").hide();
        }
      
      var descripcion = listaFullObservacion[pindex].descripcion;
	
      $("#desc"+observacionId)
      .html("<input type='text' id='inputDesc' class='form-control'>");
      $("#inputDesc").val(descripcion);
      
      $("#nomSubContratista"+observacionId)
      .html("<input type='text' id='inputNombreSubContratista' class='form-control'>");
      $("#inputNombreSubContratista").val(listaFullObservacion[pindex].nombreSubContratista);
      
//      $("#lugarOcurrencia"+observacionId)
//      .html("<input type='text' id='inputLugarOcurrencia' class='form-control'>");
//      $("#inputLugarOcurrencia").val(listaFullObservacion[pindex].lugarOcurrencia);
      
      var slcGrupoRiesgo = crearSelectOneMenu("slcGrupoRiesgo","",listGrupoRiesgo,
	      observacionObj.grupoRiesgo.id,"id","nombre");
      
      $("#grupoRiesgo"+observacionId).html(slcGrupoRiesgo+"<label>(Obligatorio)</label>");
      
      $("#nomInfractor"+observacionId)
      .html("<input type='text' id='inputNombreInfractor' class='form-control'>");
      $("#inputNombreInfractor").val(listaFullObservacion[pindex].nombreInfractor);
      
      $("#fec"+observacionId).html(
         "<input type='date' id='inputFecReal' class='form-control'>" +
         "<label>(Obligatorio)</label>");
      
      $("#horReal"+observacionId).html(
         "<input type='time' id='inputHorReal' class='form-control'>" +
         "<label>(Obligatorio)</label>");
      $("#inputHorReal").val(observacionObj.horaReal);
	 
      var today2 = convertirFechaInput(fechaReal);
      $("#inputFecReal").val(today2);
		
      $("#tipre"+observacionId).html(selReporte+"<label>(Obligatorio)</label>");
//      $("#factor"+observacionId).html(slcFactor);
      $("#pot"+observacionId).html(slcTipoPerdida+"<label>(Obligatorio)</label>");
//
      var textAcciones = $("#tdobsaccm"+observacionId).text();
      $("#tdobsaccm"+observacionId).addClass("linkGosst")
      .on("click",function(){verCompletarAccioneObservacionGeneral();})
      .html("<i class='fa fa-star fa-2x' aria-hidden='true'></i>"+textAcciones);
//	
      hallarEstadoImplementacion(observacionId);
      
      $("#creObs"+observacionId).html("<label>*No puede modificarse.</label>");
      $("#actObs"+observacionId).html("<label>*Automático.</label>");
      
      var slcTipoGestion = crearSelectOneMenu("slcTipoGestion","crearSelectCausaInmObservacion()",
         listGestiones,observacionObj.gestion.id,"id","nombre");
      
      $("#gestionObs"+observacionId).html(slcTipoGestion);
      
      $("#reportadoPor"+observacionId)
      .html("<input type='text' id='inputReportadoPor' class='form-control'>");
      $("#inputReportadoPor").val(observacionObj.reportadoPor);
      
      $("#tdCausaInmObs"+observacionId).html("<div id='divCrearSelectCausaInmObs'></div>");
      
      crearSelectCausaInmObservacion();
      
      $("#tdCausaInmObsDet"+observacionId)
      .html("<input type='text' id='inputCausaInmObsDetalle' class='form-control'>");
      $("#inputCausaInmObsDetalle").val(observacionObj.causaInmediataObsDetalle);
      
      $("#tdAccionInmTomada"+observacionId)
      .html("<input type='text' id='inputAccionInmObsTomada' class='form-control'>");
      $("#inputAccionInmObsTomada").val(observacionObj.accionInmediataTomada);
      
      $("#tdRepPorEmpresa"+observacionId)
      .html("<input type='text' id='inputEmpresaRepPor' class='form-control'>");
      $("#inputEmpresaRepPor").val(observacionObj.empresaReportadoPor);
	
      banderaEdicion2 = true;
      
      $("#btnCancelarObs"+sufijoObs).show();$("#btnAgregarObs"+sufijoObs).hide();
      $("#btnEliminarObs"+sufijoObs).show();$("#btnGuardarObs"+sufijoObs).show();
      $("#btnGenReporte"+sufijoObs).hide();$("#btnFiltroObs"+sufijoObs).hide();
      
      if(observacionObj.numRegHistorialCorreo > 0){
	 $("#btnHistorialCorreoObs"+sufijoObs).show();
      }
   }
}

function nuevoObservacion(){
   if(!banderaEdicion2){
      observacionId = 0;
      formatoCeldaSombreableTabla(false,"tblObservacion"+sufijoObs);
		
      var slcTipoPerdida = crearSelectOneMenuOblig("slcTipoPerdida","",
	 listPerdida,"-1","id","nombre");
      
      var slcTipoGestion = crearSelectOneMenu("slcTipoGestion",
	 "crearSelectCausaInmObservacion()",listGestiones,"-1","id","nombre");
		
      var slcFactor = crearSelectOneMenuOblig("slcFactor","",
	 listFactores,"-1","id","nombre");
		
      var selReporte = crearSelectOneMenuOblig("selReporte","",
	 listReporte,"-1","id","nombre");
      
      var selNotaObsGen = crearSelectOneMenuOblig("selNotaObsGen","",
	 listTipoNotaObservacion,"3","id","nombre");
      
      if(accesoConsolidado == 1){
         var selProyectoObs = crearSelectOneMenuOblig("selProyectoObs","",
            listProyectos,"-1","id","titulo");
         
         $("#btnClipboardObsTotal").hide();$("#btnExcelObsTotal").hide();$("#btnGraficoObsTotal").hide();
      }
      
      var slcGrupoRiesgo = crearSelectOneMenu("slcGrupoRiesgo","",listGrupoRiesgo,
	      -1,"id","nombre");
      
      $("#tblObservacion"+sufijoObs+" tbody").prepend(
         "<tr id='0'>" +
	    (accesoConsolidado == 0?"":
	     "<td>"+"<input class='form-control' id='inputBuscarProyectoObs'>"+selProyectoObs +
	            "<label>(Buscar Proyecto asociado por título y/o nombre del contratista) " +
	            "[Obligatorio]</label>"+"</td>" +
         "<td>"+(parseInt($("#selFiltroEstadoProyObs").val()) == 2?"En curso":"Completado")+"</td>" +
	     "<td><label>*Automático (según el proyecto seleccionado).</label></td>") +
	    "<td><input type='text' id='inputReportadoPor' class='form-control'></td>" +
	    "<td><input type='text' id='inputEmpresaRepPor' class='form-control'></td>" +
	    "<td><input type='date' id='inputFecReal' class='form-control'>"+
	        "<label>(Obligatorio)</label>"+"</td>" +
	    "<td><input type='time' id='inputHorReal' class='form-control'>" +
	        "<label>(Obligatorio)</label>"+"</td>" +
	    "<td>"+slcTipoGestion+"</td>" +
//	    "<td><input type='text' id='inputLugarOcurrencia' class='form-control'></td>" +
	    "<td>"+slcGrupoRiesgo+"<label>(Obligatorio)</label>"+"</td>" +
	    "<td><input type='text' id='inputNombreInfractor' class='form-control'></td>" +
	    "<td><input type='text' id='inputNombreSubContratista' class='form-control'></td>" +
	    "<td>"+selReporte+"<label>(Obligatorio)</label>"+"</td>" +
//	    "<td>"+slcFactor+"</td>" +
	    "<td><input type='text' id='inputDesc' class='form-control'></td>" +
	    "<td><div id='divCrearSelectCausaInmObs'></div></td>" +
	    "<td><input type='text' id='inputCausaInmObsDetalle' class='form-control'></td>" +
	    "<td>"+slcTipoPerdida+"<label>(Obligatorio)</label>"+"</td>" +
	    "<td><input type='text' id='inputAccionInmObsTomada' class='form-control'></td>" +
	    "<td id='tdevi0'>...</td>" +
	    "<td>...</td>" +
	    "<td>"+selNotaObsGen+"</td>" +
	    "<td><input id='inputAnotacObs' class='form-control'></td>" +
	    "<td><label>*Automático.</label></td>" +
	    "<td><label>...</label></td>" +
	 "</tr>");
		
      var options={
	 container: "#tdevi"+observacionId,
	 functionCall: function(){},
	 descargaUrl: "",
	 esNuevo: true,
	 idAux: "Observacion"+observacionId,
	 evidenciaNombre: ""
      };
      
      crearFormEvidenciaCompleta(options);
      
      crearSelectCausaInmObservacion();
	
      $("#inputFecReal").val(getSession("fechaHoyOrdenInversoTexto"));
      $("#inputHorReal").val(obtenerHoraActual(1).substring(0, obtenerHoraActual(1).length-3));
      
      if(accesoConsolidado == 1){
         $("#inputBuscarProyectoObs").attr("onkeyup","buscarProyectoObservacion()");
      }
      
      $("#btnCancelarObs"+sufijoObs).show();$("#btnAgregarObs"+sufijoObs).hide();
      $("#btnEliminarObs"+sufijoObs).hide();$("#btnGuardarObs"+sufijoObs).show();
      $("#btnGenReporte"+sufijoObs).hide();$("#btnFiltroObs"+sufijoObs).hide();
      $("#btnHistorialCorreoObs"+sufijoObs).hide();
      
      banderaEdicion2 = true;
   }else{
      alert("Guarde primero.");
   }
}

var listCausaInmediataObsAux;

function crearSelectCausaInmObservacion(){
   listCausaInmediataObsAux = [];

   var tipoGestionId = parseInt($("#slcTipoGestion").val());	
   
   if(tipoGestionId != -1){
      listCausaInmediataObs.forEach(function(val){
         if(val.gestionObservacionId == tipoGestionId){
	    listCausaInmediataObsAux.push({
	       id: val.id,
	       nombre: val.nombre
	    });
         }
      });
   }	
	   
   var divCausaInmObs = document.querySelector("#divCrearSelectCausaInmObs");
	   
   var selCausaInmObs = crearSelectOneMenu("selCausaInmObs","",listCausaInmediataObsAux,
      (observacionId > 0?observacionObj.causaInmediataObs.id:-1),"id","nombre");
	   
   divCausaInmObs.innerHTML = selCausaInmObs + 
      "<small style='font-weight:bold;'>(Cambiará según el sistema de gestión asociado seleccionado)</small>";
	   
}

function buscarProyectoObservacion(){
   var proyectoObsAux = $("#inputBuscarProyectoObs").val().toUpperCase().trim();
   var encontrado = 0;
   
   if(proyectoObsAux.length != 0){
      listProyectos.forEach(function(val){
         if(val.titulo.toUpperCase().trim().includes(proyectoObsAux) && encontrado == 0){
  	    $("#selProyectoObs").val(val.id);
  	    encontrado++;
         }     
      }); 
   }
}

function cancelarObservacion(){
   cargarModalObservaciones();
}

function eliminarObservacion(){
   mensajeUx="<label>¿Está seguro de eliminar la observación seleccionada?</label>";
   mensajesUx(mensajeUx,3,"","ObsProy");

   $("#btnDevolverValorObsProy").on("click",function(){
      var dataParam={
	 id: observacionId
      };

      callAjaxPost(URL+'/contratista/observacion/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx = "<label>La observación fue eliminada con éxito.</label>";
	 	     
	       mensajesUx(mensajeUx,1,"","ActualizarObsProy");
		     
	       $("#modalMensajeUxActualizarObsProy").on("hidden.bs.modal",function(){
	          cargarModalObservaciones();    
	       });
	       
	       break;
					
	    default:
	       alert("Ocurrió un error al eliminar la observación!");
         }
      });
   });
}

var dataParamObsAux = {};

function guardarObservacion(){
   var campoVacio = true;
   
   var perdida = $("#slcTipoPerdida").val();
   var descricion = $("#inputDesc").val();
   var nombreSubContratista = $("#inputNombreSubContratista").val();
   var lugarOcurrencia = $("#inputLugarOcurrencia").val();
   var grupoRiesgoId = parseInt($("#slcGrupoRiesgo").val());
   var nombreInfractor = $("#inputNombreInfractor").val();
//   var factor = $("#slcFactor").val();
   var reporte = $("#selReporte").val(); 
   var inputFecReal = convertirFechaTexto($("#inputFecReal").val());
   var inputHorReal = $("#inputHorReal").val();
   
   var gestionId = parseInt($("#slcTipoGestion").val());
   var reportadoPor = $("#inputReportadoPor").val();
   var empresaRepPor = $("#inputEmpresaRepPor").val();
   
   var causaInmObsId = parseInt($("#selCausaInmObs").val());
   var causaInmObsDetalle = $("#inputCausaInmObsDetalle").val();
   var accionInmObs = $("#inputAccionInmObsTomada").val();
   
   if(perdida == -1 || reporte == -1 || inputFecReal == null || inputHorReal == "" || grupoRiesgoId == -1){
      mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>";
      campoVacio = false;
   }
   
   if(accesoConsolidado == 1){
      var proyectoObsId = $("#selProyectoObs").val(); 
       
      if(proyectoObsId == -1){
	 mensajeUx = "<label>Debe seleccionar el proyecto asociado a la observación.</label>";
	 campoVacio = false;
      }
   }
   
   var nota = $("#selNotaObsGen").val();
   var anotacion = $("#inputAnotacObs").val();
		
   if(campoVacio){
      dataParamObsAux={
	 id: observacionId,fecha: inputFecReal,horaReal: inputHorReal,nota: {id: nota},anotacion: anotacion,
	 nivel: 2,descripcion: descricion,nombreSubContratista: nombreSubContratista,lugarOcurrencia: lugarOcurrencia,
	 grupoRiesgo: {id: grupoRiesgoId},nombreInfractor: nombreInfractor,perdida: {id: perdida},/*factor: {id: factor},*/
	 reporte: {id: reporte},contratistaAsociado: {id: null},gestion: {id: gestionId},reportadoPor: reportadoPor,
	 causaInmediataObs: {id: causaInmObsId},causaInmediataObsDetalle: causaInmObsDetalle,accionInmediataTomada: accionInmObs,
	 empresaReportadoPor: empresaRepPor,empresaId: getSession("gestopcompanyid"),
	 proyectoId: (accesoConsolidado == 0?ProyectoId:proyectoObsId)
      };
      
      if(observacionId > 0){
	 dataParamObsAux.notificarObsNota = (observacionObj.nota.id != 2 && nota == 2?1:0);
	 
	 if(accesoConsolidado == 1){
	    if(observacionObj.proyectoId != proyectoObsId){
	       dataParamObsAux.cambiarProyecto = 1;
	    }
	 }
      }else{
	 dataParamObsAux.notificarObsNota = (nota == 2?1:0);
      }
      
      if(observacionId == 0 /*&& listResponsables.length != 0*/){
         mensajeUx="<label>¿Desea notificar el registro de esta observación a otro(s) responsable(s)?</label>";
         mensajesUx(mensajeUx,9,"","EnviarCorreoAdiResp");

         $("#btnDevolverValorEnviarCorreoAdiResp").on("click",function(){
            crearEnviarCorreoAdicionalResponsablesObservacion();
         });
      
         $("#btnRegresarPrevioEnviarCorreoAdiResp").on("click",function(){
	    enviarDataGuardarObservacion();
         });  
      }else{
	 enviarDataGuardarObservacion(); 
      }
   }else{
      mensajesUx(mensajeUx,2,"");
   }	
}

function crearEnviarCorreoAdicionalResponsablesObservacion(){
   $("#modalEnviarCorreoRespObs").remove();
   
   var contenido = "";

   var listContenido=[
//      {sugerencia:"",label:"Responsables",inputForm:"",
//       divContainer:"divResponsablesEnviarCorreoObs"},
      {sugerencia:"",label:"1er responsable " +
       "<br><label style='color:blue;'>(opcional)</label>",
       inputForm:"<input type='text' class='form-control' id='inputCorreoPrimerResp'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"2do responsable " +
       "<br><label style='color:blue;'>(opcional)</label>",
       inputForm:"<input type='text' class='form-control' id='inputCorreoSegundoResp'>"}, 
       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"3er responsable " +
       "<br><label style='color:blue;'>(opcional)</label>", 
       inputForm:"<input type='text' class='form-control' id='inputCorreoTercerResp'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",label:"",
       inputForm:"<button id='btnEnviarCorreoObs' class='btn btn-success' type='submit' " +
	      		 "onclick='valoresEnviarCorreoAdiRespObs()' style='float:right;font-size:18px;'>" +
	            "<i class='fa fa-paper-plane'></i> Enviar" +
	      	 "</button>"}
   ];  
   
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
				
   var modalOptions={
      id: "modalEnviarCorreoRespObs",
      nombre: "<i class='fa fa-users'></i> Responsable(s) adicional(es) - correo",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
	
   crearModalPrincipalUsuario(modalOptions,function(){
//      crearSelectOneMenuObligMultipleCompleto("respEnviarCorreoObs","",listResponsables,
//         "id","nombre","#divResponsablesEnviarCorreoObs","Seleccionar...");   
   },true,true);
}

function valoresEnviarCorreoAdiRespObs(){
//   listResponsablesId = [];
//   var responsableId = $("#respEnviarCorreoObs").val();
//    
//   if(responsableId != null){
//      responsableId.forEach(function(val){
//	 listResponsablesId.push(parseInt(val));
//      });
//   }
   
   listRespCorreosAux = [];
   listRespCorreosAux.push($("#inputCorreoPrimerResp").val()); 
   listRespCorreosAux.push($("#inputCorreoSegundoResp").val()); 
   listRespCorreosAux.push($("#inputCorreoTercerResp").val()); 
    
   dataParamObsAux.listRespCorreosAux =
      (listRespCorreosAux.length == 0?null:listRespCorreosAux);
   
   enviarDataGuardarObservacion();
}

function enviarDataGuardarObservacion(){
   callAjaxPost(URL+'/contratista/observacion/save',dataParamObsAux,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    guardarEvidenciaAuto(data.nuevoId,"fileEviObservacion"+observacionId,bitsEvidenciaObservacion,
            "/contratista/observacion/evidencia/save",function(){  
	       $("#modalEnviarCorreoRespObs").modal("hide");
	       
               mensajeUx = (observacionId > 0?
        	  "<label>La observación fue actualizada con éxito.</label>":
                  "<label>La observación fue registrada con éxito." +
                  "<br><br>*Se notificó al responsable SST del proyecto, los contactos de la contratista y " +
		  "los responsables adicionales (cuyos correos se escribieron).</label>");
               mensajesUx(mensajeUx,1,"","ActualizarObsProy");
		     
               $("#modalMensajeUxActualizarObsProy").on("hidden.bs.modal",function(){
	          cargarModalObservaciones();    
               });
	    },"observacionId"); 
							
	    break;
						
         default:
	    console.log("Ocurrió un error al guardar la programacion!");
      }
   });		
}

function volverDivObservacionesAcceso(){
    $("#tabProyectos .container-fluid").hide();
    $("#tabObservacionesTotales .container-fluid").hide();
 
    if(accesoConsolidado == 0){
        if(tipoObservacionId == 1){
	        $("#divObsContratistaProyecto").show();
        }else{
	        $("#divObsProyecto").show();
        }
       
        $("#tabProyectos h2").html("<a onclick='volverDivProyectos()'>Proyecto ("+proyectoObj.titulo.substring(0,40)+"...) </a> > Observaciones "+titulo);
    }else{
        $("#divObsProyectoTotal").show();
       
        $("#tabObservacionesTotales h2").html("Observaciones al contratista por proyecto");
    }
}

function editarEvidenciaObservacion(){
   $("#tabProyectos .container-fluid").hide();
   $("#divObsProyecto").show();
   $("#mdObservaciones .modal-body").hide();
   $("#mdObservaciones #modalEviObs").show();
}
 
function generarHojaRutaForm(){	
   window.open(URL+"/capacitacion/informe?observacionId="+observacionId,'_blank');	
}

function hallarEstadoImplementacion(progId){
   var fechaPlanificada = $("#inputFecPla").val();
   var fechaReal = $("#inputFecReal").val();
   var fechaHoy = obtenerFechaActual();
	
   if(fechaReal != ''){
      ObservacionEstado = 2;
      ObservacionEstadoNombre = "Completado";
   }else{
      if(fechaPlanificada != ""){
	 var dif = restaFechas(fechaHoy,fechaPlanificada)
			
	 if(dif<0){
	    ObservacionEstado = 3;
	    ObservacionEstadoNombre = "Retrasado";
	 }else{
	    ObservacionEstado = 1;
	    ObservacionEstadoNombre = "Por implementar";
	 }
      }else{	
         ObservacionEstado = 1;
         ObservacionEstadoNombre = "Por implementar";
      }
   }
	
   $("#estadoControl"+progId).html(ObservacionEstadoNombre);	
}
 
function agruparRegistrosTabla(){
	
   var numAgrupacion = 10;
		
   cambiarPaginaTabla();
	
   $('.izquierda_flecha').hover(function(){
      $(this).css('opacity','0.5');
   },function(){
      $(this).css('opacity','1');
   });

   $('.derecha_flecha').hover(function(){
      $(this).css('opacity','0.5');
   },function(){
      $(this).css('opacity','1');
   });	
}

var listFullAccionesAsociadas=[];
var banderaEdicionRespuestaAcc = false;

function verCompletarAccioneObservacionGeneral(){
   $("#tabProyectos .container-fluid").hide();
   $("#tabObservacionesTotales .container-fluid").hide();
   $("#divAccionesObservacion"+sufijoObs).show();
   
   if(accesoConsolidado == 1){
      $("#tabObservacionesTotales h2")
      .html(""+" <a onclick='volverDivObservacionesAcceso()'> Observación ("+observacionObj.descripcion.substring(0,15)+"...) </a> " +
 	    "> Acciones de Mejora");
   }else{
      $("#tabProyectos h2")
      .html(""+"<a onclick='volverDivProyectos()'>Proyecto ("+proyectoObj.titulo+") </a> " +
	    "> <a onclick='volverDivObservacionesAcceso()'> Observación ("+observacionObj.descripcion.substring(0,20)+"...) </a> " +
	    "> Acciones de Mejora");
   }
   
   var valorResize = (accesoConsolidado == 1?120:145);
   resizeDivWrapper("wrapObservacionesAcc"+sufijoObs,valorResize);
   
   var audiObj={
      observacionId: observacionId,
      accionMejoraTipoId: 0,
   };
   
   callAjaxPost(URL+'/gestionaccionmejora/accionmejora',audiObj,function(data){
      if(data.CODE_RESPONSE == "05"){ 
	 $("#tblAccObservacion tbody tr").remove();
	 $("#tblAccObservacionTotal tbody tr").remove();
					
	 $("#btnNuevaAccObs"+sufijoObs).hide();
	 $("#btnEliminarAccObs"+sufijoObs).hide();
	 $("#btnGuardarAccObs"+sufijoObs).hide();
	 $("#btnVolverAccObs"+sufijoObs).hide();
					
	 banderaEdicionRespuestaAcc = false;
	 listFullAccionesAsociadas = data.list;
	 
	 listFullAccionesAsociadas.forEach(function(val,index){
	    val.id = val.accionMejoraId;
						
	    var iconoDescarga=
		   "<a href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.accionMejoraId+"'>" +
	              "<i class='fa fa-download fa-2x' aria-hidden='true'></i>" +
	           "</a>";
						
	    if(val.evidenciaNombre == "----"){
	       iconoDescarga = "";
	    }
	    
	    var tipoAccionMejoraNombre = 
	       (val.accionMejoraTipoId == 1?"Acción correctiva":(val.accionMejoraTipoId == 2?"Preventiva":
	        (val.accionMejoraTipoId == 3?"Correctiva":(val.accionMejoraTipoId == 4?"Mejora":"------"))));
						
	    $("#tblAccObservacion"+sufijoObs+" tbody").append(
	       "<tr id='trtip"+val.id+"'>" +	
	          "<td id='actpTipo"+val.id+"'>"+tipoAccionMejoraNombre+"</td>" +
	          "<td id='actpdesc"+val.id+"'>"+val.descripcion+"</td>" +
	          "<td id='actpfp"+val.id+"'>"+val.fechaRevisionTexto+"</td>" +
	          "<td id='actpfr"+val.id+"'>"+val.fechaRealTexto+"</td>" +
	          "<td id='actpobs"+val.id+"'>"+val.observacion+"</td>" +
	          "<td id='actpresp"+val.id+"'>"+val.respuesta+
		     "<button onclick='modificarRespuestaAccionMejora("+index+")' class='btn btn-success'>" +
		        "Modificar respuesta <i class='fa fa-envelope-o'></i>" +
	             "</button>"+
		  "</td>" +
		  "<td id='actpevi"+val.id+"'>"+val.evidenciaNombre+iconoDescarga+"</td>" +
		  "<td id='actpes"+val.id+"'>"+val.estadoCumplimientoNombre+"</td>" +
	       "</tr>");
	 });
	
         goheadfixedY("#tblAccObservacion"+sufijoObs,"#wrapObservacionesAcc"+sufijoObs);
      }else{
	 console.log("NOPNPO");
      }
   });
}

function modificarRespuestaAccionMejora(pindex){
   if(!banderaEdicionRespuestaAcc){
      banderaEdicionRespuestaAcc = true;
	 
      var accObj = listFullAccionesAsociadas[pindex];
	 
      var btnVolver="<button onclick='volverModificarRespuesta("+pindex+")' class='btn btn-danger'>" +
		       "<i class='fa fa-arrow-left'></i>" +
		    "</button>";
	 
      var btnGuardar="<button onclick='guardarModificarRespuesta("+pindex+")' class='btn btn-success'>" +
		        "<i class='fa fa-floppy-o'></i>" +
		     "</button>";
	 
      $("#actpresp"+accObj.id)
      .html("<input type='text' id='inputRespAccASoc' class='form-control'> "+""+btnVolver+btnGuardar);
	 
      $("#inputRespAccASoc").focus();
      $("#inputRespAccASoc").val(accObj.respuesta);
   }else{
      alert("Hay una respuesta en edición");
   }
}
 
function volverModificarRespuesta(pindex){
   verCompletarAccioneObservacionGeneral();
}

function guardarModificarRespuesta(pindex){
   var accObj = listFullAccionesAsociadas[pindex];
   
   var accSend={
      accionMejoraId: accObj.id,
      respuesta: $("#inputRespAccASoc").val()
   };
	 
   callAjaxPost(URL+'/gestionaccionmejora/accionmejora/respuesta/save',accSend,
      function(data){
         verCompletarAccioneObservacionGeneral();
      });  
}

var listFullAccionesMejoraObs=[];
var accionMejoraObsObj={};
var banderaEdicionAccObs;

function verCompletarAccioneObservacionContratista(indexObs){
   observacionObj = listaFullObservacion[indexObs];
   observacionObj.index = indexObs;
   banderaEdicionAccObs = false;
	
   $("#tabProyectos .container-fluid").hide();
   $("#divAccionesObservacion").show();
   
   $("#tabProyectos h2")
   .html(""+"<a onclick='volverDivProyectos()'>Proyecto ("+proyectoObj.titulo+") </a> " +
	    "> <a onclick='volverDivObservacionesAcceso()'> Observación ("+observacionObj.descripcion+") </a> " +
	    "> Acciones de Mejora");
   
   var valorResize = 190;
   resizeDivWrapper("wrapObservacionesAcc",valorResize);
	
   var audiObj={
      accionMejoraTipoId: 0,
      observacionId: observacionObj.id
   };
   
   $("#btnNuevaAccObs").show().attr("onclick","nuevaAccionMejoraObs()");
   $("#btnEliminarAccObs").hide().attr("onclick","eliminarAccionMejoraObs()");
   $("#btnGuardarAccObs").hide().attr("onclick","guardarAccionMejoraObs()");
   $("#btnVolverAccObs").hide().attr("onclick","verCompletarAccioneObservacionContratista("+indexObs+")");
	
   callAjaxPost(URL+'/gestionaccionmejora/accionmejora',audiObj,function(data){
      if(data.CODE_RESPONSE == "05"){ 
         $("#tblAccObservacion tbody tr").remove();
						
         listFullAccionesMejoraObs = data.list;
						
         data.list.forEach(function(val,index){
	    val.id = val.accionMejoraId;
	    
	    var tipoAccionMejoraNombre = 
	       (val.accionMejoraTipoId == 1?"Acción correctiva":(val.accionMejoraTipoId == 2?"Preventiva":
		(val.accionMejoraTipoId == 3?"Correctiva":(val.accionMejoraTipoId == 4?"Mejora":"------"))));
							
	    $("#tblAccObservacion tbody").append(
               "<tr id='trtip"+val.id+"' onclick='editarAccionMejoraObs("+index+")'>" +
	          "<td id='actpTipo"+val.id+"'>"+tipoAccionMejoraNombre+"</td>" +
	          "<td id='actpdesc"+val.id+"'>"+val.descripcion+"</td>" +
	          "<td id='actpfp"+val.id+"'>"+val.fechaRevisionTexto+"</td>" +
	          "<td id='actpfr"+val.id+"'>"+val.fechaRealTexto+"</td>" +
	          "<td id='ss"+val.id+"'>"+"..."+"</td>" +
	          "<td id='actpobs"+val.id+"'>"+val.observacion+"</td>" +
	          "<td id='tdeviaccobs"+val.id+"'>"+val.evidenciaNombre+"</td>" +
	          "<td id='actpes"+val.id+"'>"+val.estadoCumplimientoNombre+"</td>" +						 
	       "</tr>");
         });
         
         goheadfixedY("#tblAccObservacion","#wrapObservacionesAcc");
      }else{
         console.log("NOPNPO");
      }
   });
}

function nuevaAccionMejoraObs(){
   if(!banderaEdicionAccObs){banderaEdicionAccObs=true;
      accionMejoraObsObj.accionMejoraId = 0;
      
      $("#btnNuevaAccObs").hide();
      $("#btnEliminarAccObs").hide();
      $("#btnGuardarAccObs").show();
      $("#btnVolverAccObs").show();
	
      $("#tblAccObservacion tbody")
      .prepend("<tr>"+
	          "<td><input class='form-control' id='inputDescAcc'></td>" +
		  "<td><input type='date' class='form-control' id='inputFecAcc'></td>" +
		  "<td>...</td>" + 
		  "<td>...</td>" +
		  "<td><input class='form-control' id='inputObsAcc'></td>" +
	          "<td id='tdeviaccobs0'></td>" +
		  "<td>...</td>" +
	       "</tr>");
      
      var options={
	     container: "#tdeviaccobs"+accionMejoraObsObj.accionMejoraId,
	     functionCall: function(){},
	     descargaUrl: "",
	     esNuevo: true,
	     idAux: "AccObservacion"+accionMejoraObsObj.accionMejoraId,
	     evidenciaNombre: ""
		  };
	
      crearFormEvidenciaCompleta(options);
   }
}

function editarAccionMejoraObs(indexAcc){
   if(!banderaEdicionAccObs){
      banderaEdicionAccObs = true;
      
      $("#btnNuevaAccObs").hide();
      $("#btnEliminarAccObs").show();
      $("#btnGuardarAccObs").show();
      $("#btnVolverAccObs").show();
	
      accionMejoraObsObj = listFullAccionesMejoraObs[indexAcc];
	
      $("#actpdesc"+accionMejoraObsObj.id).html("<input class='form-control' id='inputDescAcc'>");
      $("#actpfp"+accionMejoraObsObj.id).html("<input type='date' class='form-control' id='inputFecAcc'>");
      $("#actpobs"+accionMejoraObsObj.id).html("<input class='form-control' id='inputObsAcc'>");
	
      $("#inputDescAcc").val(accionMejoraObsObj.descripcion);
      $("#inputFecAcc").val(convertirFechaInput(accionMejoraObsObj.fechaRevision));
      $("#inputObsAcc").val(accionMejoraObsObj.observacion);
	
      var nombreEvidencia=accionMejoraObsObj.evidenciaNombre; 
	
      var options={
	     container: "#tdeviaccobs"+accionMejoraObsObj.accionMejoraId,
	     functionCall: function(){},
	     descargaUrl: "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+accionMejoraObsObj.id,
	     esNuevo: false,
	     idAux: "AccObservacion"+accionMejoraObsObj.id,
	     evidenciaNombre: nombreEvidencia
	          };
      
      crearFormEvidenciaCompleta(options);
   }
}

function guardarAccionMejoraObs(){
   var editarDiv = $("#tblAccObservacion");
   var campoVacio = false;
	
   var inputDesc = editarDiv.find("#inputDescAcc").val(); 
   var inputFecha = convertirFechaTexto( editarDiv.find("#inputFecAcc").val());
   var obsevacion = editarDiv.find("#inputObsAcc").val()
	  
   if(inputFecha == null){
      campoVacio = true;
   }
	
   hallarEstadoImplementacionAccAuditoria();
	
   if(!campoVacio){
      var dataParam={
	     accionMejoraId: accionMejoraObsObj.accionMejoraId ,
	     observacion: obsevacion,
	     descripcion: inputDesc,
	     fechaRevision: inputFecha,
	     fechaReal: null,
	     responsableNombre: "Contratista",
	     responsableMail: "@asd",
	     accionMejoraTipoId: 1,
	     estadoId: 1,
	     companyId: getSession("gestopcompanyid"),
	     gestionAccionMejoraId: null, 
	     observacionId: observacionObj.id 
		    };
		 
      callAjaxPost(URL+'/gestionaccionmejora/accionmejora/save',dataParam,function(data){ 
         guardarEvidenciaAuto(data.nuevoId,"fileEviAccObservacion"+accionMejoraObsObj.accionMejoraId,
	    bitsEvidenciaAccionMejora,"/gestionaccionmejora/accionmejora/evidencia/save",function(){
	       verCompletarAccioneObservacionContratista(observacionObj.index); 
            },"accionMejoraId"); 
      });
   }else{
      alert("Debe ingresar todos los campos.");
   }
}

function eliminarAccionMejoraObs(){
   var r = confirm("¿Está seguro de eliminar la Accion de mejora?");
	
   if(r == true){
      var dataParam={
	     accionMejoraId: accionMejoraObsObj.accionMejoraId 
		    };

      callAjaxPost(URL+'/gestionaccionmejora/accionmejora/delete',dataParam,function(){  
         verCompletarAccioneObservacionContratista(observacionObj.index); 	 
      });
   }	
}

function guardarMasivoEvaluacionesExcel(){
   var texto = $("#txtListadoEval").val();
   var listExcel = texto.split('\n');
   var listEvaluaciones = [];
   var listTrabRepe = [];
   var listFullNombres = "";
   var validado = "";
	
   if(texto.length < 20000){
      for(var int=0;int<listExcel.length;int++){
         var listCells = listExcel[int].split('\t');
         var filaTexto = listExcel[int];
			
         if(filaTexto.trim().length < 1){
	    validado = "Existen filas vacias.";
	    break;
         }

         if(validado.length < 1 && listCells.length != 3){
	    validado = "No coincide el numero de celdas. ("+listCells.length+"!=3 )";
	    break;
         }else{
	    var evals = {};
	    var tipo={}
				
	    for(var j=0;j<listCells.length;j++){
	       var element = listCells[j];
					
	       if(j === 0){
		  var trabId = 0;
		  var seguirBusqueda = true;
						
		  listEvaluacion.every(function(val,index2){
		     if(val.trabNombre == element.trim()){
		        trabId = val.trabId;
		        evals.trabId = parseInt(trabId);
		        seguirBusqueda = false;
		     };
							
		     if(!seguirBusqueda){
		        return false;
		     }else{
			return true;
		     }
							
		     if(index2 == listEvaluacion.length-1){
		        validado = "No se encontró a : "+element.trim();
		     }
		  });
						
		  if($.inArray(element.trim(), listTrabRepe) === -1){
		     listTrabRepe.push(element.trim());
		  }else{
		     listFullNombres = listFullNombres + element.trim() + ", ";
		  }
	       }
					
	       if(j === 1){
	          for(var k=0;k<listNotas.length;k++){
		     if(listNotas[k].nombre == element.trim()){
		        tipo.id = listNotas[k].id;
		        evals.tipoNota = tipo;
		     }
	          }
						
	          if(!evals.tipoNota){
		     validado = "Tipo de Resultado no reconocido.";
		     break;
	          }
	       }
					
	       if(j === 2){
	          evals.comentario = element.trim();
	       }
					
	       evals.ObservacionId=observacionId
	    }

	    listEvaluaciones.push(evals);
				
	    if(listTrabRepe.length < listEvaluaciones.length){
	       validado = "Existen trabajadores repetidos repetidos." + listFullNombres;
	       break;
	    }
         }
      }
   }else{
      validado = "Ha excedido los 20000 caracteres permitidos.";
   }

   if(validado.length < 1){
      var r = confirm("¿Está seguro que desea subir estos "+listExcel.length+" elemento(s)?");
		
      if(r == true){
         var listIds = listarStringsDesdeArray(listEvaluaciones,"trabId");
         
         var listEvalAux = listEvaluacion.filter(function(val){
	                      if(listIds.indexOf(val.trabId)==-1){
			         val.id = observacionId;
			         return val;
	                      }
			   });
	
         var listEvalAux2 = listEvalAux.concat(listEvaluaciones);
			
         var dataParam={
	        observacionId: id,
	        trabajadoresEvaluacion: listEvalAux2
		       };
         		
         callAjaxPost(URL+'/capacitacion/programacion/evaluacion/save',dataParam,function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":	
		  alert("Evaluaciones guardadas");
		  $("#modalEvaluacion").modal("hide");
		  cargarModalObservaciones();
		  
		  break;
				
	       default:
		  alert("Ocurrió un error al guardar las evaluaiones!");
	    }
         });
      }
   }else{
      alert(validado);
   }
}

function uploadEvidenciaObservacion(obsId){
   guardarEvidenciaAuto(observacionId,"fileEviObs",bitsEvidenciaObservacion,
      '/contratista/observacion/evidencia/save',volverModalDivObservaciones,"observacionId")
}

function volverPrincipalObservacion(){
   $("#modalConsolidadoHistorialCorreoObs").modal("hide");
}

function verHistoriaCorreoObservacion(){
   $("#modalConsolidadoHistorialCorreoObs").remove();
    
   var contenido = "";
    
   var buttonVolver =
      "<button type='button' id='btnVolverObservacion' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverPrincipalObservacion()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
    
   var modalOptions={
      maxWidth:"50%",id:"modalConsolidadoHistorialCorreoObs",
      nombre:"<i class='fa fa-table'></i> Historial de correos",
      contenido: 
 	 buttonVolver +
         "<div class='wrapper' id='wrapperHistorialCorreoObs'>" +
            "<table id='tblHistorialCorreoObs' class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 	          "<tr>" +
 	             "<td class='tb-acc' style='width:100px'>N° Orden</td>" +
 		     "<td class='tb-acc' style='width:300px'>Correo</td>" +
 		     "<td class='tb-acc' style='width:150px'>Registrado el</td>" +
 		  "</tr>" +
 	       "</thead>" +
 	       "<tbody></tbody>" +
 	    "</table>" +
 	 "</div>"};
 		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperHistorialCorreoObs",190);    
    
   var dataParam={
      observacionId: observacionId
   }; 
    
   callAjaxPost(URL+"/contratista/historial_correo",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
 	 var listHistorialCorreo = data.listHistorialCorreo;
 	 
 	 $("#tblHistorialCorreoObs tbody tr").remove();
 	 
 	 listHistorialCorreo.forEach(function(val,index){
 	    $("#tblHistorialCorreoObs tbody").append(
 	       "<tr id='fcorreo"+val.id+"'>" +
 	          "<td>"+(index+1)+"</td>" +
 		  "<td>"+val.correo+"</td>" +
 	 	  "<td>"+val.fechaRegistroTexto+"</td>" +
               "</tr>");
 	 });
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblHistorialCorreoObs","#wrapperHistorialCorreoObs");
   });
}

var listOpcionesGraficoObs=[
   {id:1,nombre:"Por tipo de reporte"},
   {id:2,nombre:"Por calificación del administrador"}
];

function ocultarSeleccionarOpcionGraficoObservaciones(){
   $("#modalSelOpcionGraficoObs").modal("hide");
}

function seleccionarOpcionGraficoObservaciones(){
   $("#modalSelOpcionGraficoObs").remove();
   
   var selOpcionGraficoObs = crearSelectOneMenuOblig("selOpcionGraficoObs","",
      listOpcionesGraficoObs,"","id","nombre");
     
   var contenido = "";
  
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Gráfico",inputForm:selOpcionGraficoObs},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	             "onclick='ocultarSeleccionarOpcionGraficoObservaciones()'>" +
    	        "<i class='fa fa-times'></i> Cancelar" +
    	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		 "onclick='redireccionarGraficoObservaciones()'>" +
    	            "<i class='fa fa-check'></i> Aceptar" +
    	         "</button>"}
   ];
    	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    	
   var modalOptions={
      id: "modalSelOpcionGraficoObs",
      nombre: "<i class='fa fa-list-ul'></i> Debe seleccionar una de las opciones",
      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   };
    	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
        
   $("#modalSelOpcionGraficoObs").modal("show");
}

function redireccionarGraficoObservaciones(){
   $("#modalSelOpcionGraficoObs").modal("hide");
   
   var opcionId = parseInt($("#selOpcionGraficoObs").val());
  
   if(opcionId == 1){
      verGraficoTipoReporteObservaciones();
   }else if(opcionId == 2){
      verGraficoCalificacionAdminObservaciones(); 
   }
}

function verGraficoTipoReporteObservaciones(){
   $("#modalGraficoTipoReporteObs").remove();
     
   var modalOptions={
      id: "modalGraficoTipoReporteObs",
      maxWidth: "90%",
      nombre: "Gráfico Observaciones - Por tipo de reporte ",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoTipoReporteObs'></div>"
   };
 	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoTipoReporteObs",190);
 	 	
   Highcharts.chart('divGraficoTipoReporteObs',{
      chart: {type: 'column'},
      title: {
	 text: "Gráfico Observaciones - Por tipo de reporte",
	 style: {fontWeight: 'bold',fontSize: '20px'}},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de observaciones",
 	    style: {fontWeight: 'bold',fontSize: '18px'}}},
      plotOptions: {
 	 column: {
            dataLabels: {
               enabled: true,color: 'black',style: {fontSize: '25px'}},
 	    enableMouseTracking: false}},
      series: [
         {name: "Accidente",data: [numObsAccidente]},
	 {name: "Acto Subestándar",data: [numObsASubestandar]},
 	 {name: "Condición Subestándar",data: [numObsCSubestandar]},
 	 {name: "Enfermedad",data: [numObsEnfermedad]},
 	 {name: "Incidente",data: [numObsIncidente]},
 	 {name: "Inspección",data: [numObsInspeccion]},
 	 {name: "Reconocimento",data: [numObsReconocimiento]}]
   }); 
}

function verGraficoCalificacionAdminObservaciones(){
   $("#modalGraficoCalifAdminObs").remove();
     
   var modalOptions={
      id: "modalGraficoCalifAdminObs",
      maxWidth: "90%",
      nombre: "Gráfico Observaciones - Por calificación del administrador ",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoCalifAdminObs'></div>"
   };
 	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoCalifAdminObs",190);
 	 	
   Highcharts.chart('divGraficoCalifAdminObs',{
      chart: {type: 'column'},
      title: {
	 text: "Gráfico Observaciones - Por calificación del administrador",
	 style: {fontWeight: 'bold',fontSize: '20px'}},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de observaciones",
 	    style: {fontWeight: 'bold',fontSize: '18px'}}},
      plotOptions: {
 	 column: {
            dataLabels: {
               enabled: true,color: 'black',style: {fontSize: '25px'}},
 	    enableMouseTracking: false}},
      series: [
         {name: "Por re-evaluar",data: [numObsPorReevaluar],color: '#DF9226'},
	 {name: "Pendiente",data: [numObsPendiente],color: '#DF9226'},
 	 {name: "Observado",data: [numObsObservado],color: '#C0504D'},
 	 {name: "Visto bueno",data: [numObsVistoBueno],color: '#9BBB59'}]
   }); 
}

var listOpcConsolidadoObs=[
   {id:1,nombre:"Observaciones al contratista - proyectos en curso"},
   {id:2,nombre:"Resumen general de observaciones al contratista"}
];

var listEstadoContratistaObs=[
   {id: 1,nombre: "Activos"},{id: 2, nombre: "Inactivos"}
];

function ocultarConsolidadosExcelObservacion(){
   $("#modalConsolidadosExcelObs").modal("hide");
}

function verConsolidadosExcelObservacion(){
   $("#modalConsolidadosExcelObs").remove();

   var selOpcConExcelObs = crearSelectOneMenuOblig("selOpcConExcelObs",
      "verAcordeConsolidadosExcelObservacion()",listOpcConsolidadoObs,"1","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",
       inputForm:selOpcConExcelObs,divContainer:"divSelConExcelObs"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarConsolidadosExcelObservacion()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='descargarConsolidadosExcelObservacion()'>" +
                    "<i class='fa fa-download'></i> Descargar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions = {
      id:"modalConsolidadosExcelObs",
      nombre:"<i class='fa fa-filter'></i> Seleccionar - Consolidado excel",
      contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordeConsolidadosExcelObservacion();
}

function verAcordeConsolidadosExcelObservacion(){
   $(".atributo-consolidadoExcelObs").remove(); 
   var listContenidoDivSelConExcelObs = [];
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelObs").val());
   
   if([1,2].includes(opcConsolidadoExcel)){
      listContenidoDivSelConExcelObs=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",
          inputForm:"<input type='date' id='fechaInicioConsolidadoExcel' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",
          inputForm:"<input type='date' id='fechaFinConsolidadoExcel' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
      ];
   }
   
   if(opcConsolidadoExcel == 1){
      listContenidoDivSelConExcelObs.push({sugerencia:"",label:"Estado del proyecto",inputForm:(parseInt($("#selFiltroEstadoProyObs").val()) == 2?"En curso":"Completado")},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",label:"Proyecto en curso",inputForm:"",divContainer:"divFiltroProyectoObsExcel"});
   }else if(opcConsolidadoExcel == 2){
      var slcEstadoContratistaExcel = crearSelectOneMenu("slcEstadoContratistaExcel","",
	 listEstadoContratistaObs,-1,"id","nombre","Todos");

      listContenidoDivSelConExcelObs.push({sugerencia:"",label:"Estado del contratista",inputForm:slcEstadoContratistaExcel});
   }
   
   if([1,2].includes(opcConsolidadoExcel)){
      listContenidoDivSelConExcelObs.push(
         {sugerencia:"",label:"Tipo de reporte",inputForm:"",divContainer:"divFiltroTipoReporteObsExcel"},
         {sugerencia:"",label:"Potencial de pérdida",inputForm:"",divContainer:"divFiltroPotencialPerObsExcel"},
         {sugerencia:"",label:"Calificación por administrador",inputForm:"",divContainer:"divFiltroCalificacionAdmObsExcel"});  
   }
   
   var contenido = "";
   
   listContenidoDivSelConExcelObs.forEach(function(val){
      val.clase = "atributo-consolidadoExcelObs";
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
   $("#divSelConExcelObs").parent().after(contenido);
   
   if([1,2].includes(opcConsolidadoExcel)){
      var hoy = getSession("fechaHoyOrdenInversoTexto");
       
      $("#fechaInicioConsolidadoExcel").val(sumaFechaDias(-180,hoy));
      $("#fechaFinConsolidadoExcel").val(hoy);
   }   
      
   if(opcConsolidadoExcel == 1){
      crearSelectOneMenuObligMultipleCompleto("filtroProyectosObsExcel","",listProyectos,
         "id","titulo","#divFiltroProyectoObsExcel","Todos");
   }
      
   if([1,2].includes(opcConsolidadoExcel)){ 
      crearSelectOneMenuObligMultipleCompleto("filtroTiposReporteObsExcel","",listReporte,
         "id","nombre","#divFiltroTipoReporteObsExcel","Todos");
      
      crearSelectOneMenuObligMultipleCompleto("filtroPotencialesPerObsExcel","",listPerdida,
         "id","nombre","#divFiltroPotencialPerObsExcel","Todos");
      
      crearSelectOneMenuObligMultipleCompleto("filtroCalificacionAdmObsExcel","",listTipoNotaObservacion,
         "id","nombre","#divFiltroCalificacionAdmObsExcel","Todos");
   }
}

function descargarConsolidadosExcelObservacion(){
   var campoVacio = true;
    
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelObs").val());
   var fechaInicioConsolidado = $("#fechaInicioConsolidadoExcel").val();
   var fechaFinConsolidado = $("#fechaFinConsolidadoExcel").val();
   
   if([1,2].includes(opcConsolidadoExcel)){
      if(fechaInicioConsolidado.length == 0 || fechaFinConsolidado.length == 0){
 	 campoVacio = false;  
 	 mensajeUx = "<label>Debe ingresar la fecha inicio y la fecha fin.</label>";
      } 
   }
     
   if(campoVacio){
      var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
      var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);  
      var listProyectosIdExcel=[],listTipoReportesIdExcel=[],listPotencialesPerIdExcel=[],lisTipoNotaIdExcel=[];
      
      if(opcConsolidadoExcel == 1){
	 var proyectoId = $("#filtroProyectosObsExcel").val();
	   
	 if(proyectoId != null){
	    proyectoId.forEach(function(val){
	       listProyectosIdExcel.push(parseInt(val));
	    });
	 }
      }
          
      var reporteId = $("#filtroTiposReporteObsExcel").val();
	   
      if(reporteId != null){
	 reporteId.forEach(function(val){
	    listTipoReportesIdExcel.push(parseInt(val));
	 });
      }
	     
      var perdidaId = $("#filtroPotencialesPerObsExcel").val();
	   	
      if(perdidaId != null){
	 perdidaId.forEach(function(val){
	    listPotencialesPerIdExcel.push(parseInt(val));
	 });
      }
	   
      var tipoNotaId = $("#filtroCalificacionAdmObsExcel").val();
	   	
      if(tipoNotaId != null){
         tipoNotaId.forEach(function(val){
            lisTipoNotaIdExcel.push(parseInt(val));
         });
      }
      
      if(opcConsolidadoExcel == 1){
          var estadoId = $("#selFiltroEstadoProyObs").val();

	 window.open(URL+"/contratista/proyecto/excel/observaciones_totales?opcConsolidadoExcel=1&empresaId="+getSession("gestopcompanyid") +
        "&estadoId="+estadoId+"&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado +
	    "&fechaInicioConsolidadoNormal="+fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText +
	    "&listProyectosIdFiltro="+(listProyectosIdExcel.length == 0?"-1":listProyectosIdExcel) +
	    "&listTipoReportesIdFiltro="+(listTipoReportesIdExcel.length == 0?"-1":listTipoReportesIdExcel) +
	    "&listPotencialesPerIdFiltro="+(listPotencialesPerIdExcel.length == 0?"-1":listPotencialesPerIdExcel) +
	    "&listTipoNotaIdFiltro="+(lisTipoNotaIdExcel.length == 0?"-1":lisTipoNotaIdExcel));
      }else if(opcConsolidadoExcel == 2){
	 var contratistaEstado = parseInt($("#slcEstadoContratistaExcel").val()); 
	  
	 window.open(URL+"/contratista/proyecto/excel/observaciones_totales?opcConsolidadoExcel=2"+
	    "&empresaId="+getSession("gestopcompanyid")+"&contratistaEstado="+contratistaEstado +
	    "&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado +
	    "&fechaInicioConsolidadoNormal="+fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText +
            "&listTipoReportesIdFiltro="+(listTipoReportesIdExcel.length == 0?"-1":listTipoReportesIdExcel) +
            "&listPotencialesPerIdFiltro="+(listPotencialesPerIdExcel.length == 0?"-1":listPotencialesPerIdExcel) +
	    "&listTipoNotaIdFiltro="+(lisTipoNotaIdExcel.length == 0?"-1":lisTipoNotaIdExcel));
      }
   }else{
      $("#modalConsolidadosExcelEvalDocProy").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionFiltroExcel");
       
      $("#modalMensajeUxValidacionFiltroExcel").on("hidden.bs.modal",function(){
         $("#modalConsolidadosExcelEvalDocProy").modal("show");
      });
    }
}
