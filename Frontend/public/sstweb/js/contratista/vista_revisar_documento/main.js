var listFullEvaluacionDocProyecto = [];
var listTipoActividades = [];
var listEvaluacionTotal = [];
var listEstadosEvaluacionId = [],listAreasContEvalId = [],listTiposEstadoProyEvalId = [],listTiposlugaresTrabProyEvalId = [];
var listEvaluacionEvaDocPro = [],listContratistaEvaDocPro = [],listAreasContEvaDocPro = [],listTiposEstadoProyEvaDocPro = [],
    listTiposLugarTrabEvaDocPro = [];
var listSeccionesDocumentos = [],listSeccionesDocumentosFinal = [],listContratistasAsignadosUsuario = [],listTipoExamenNoPermitidoUsuario = [];
var proyectoObj = [];
var usuarioConfig = {};
var hashExamenesInhabUsuario = new Map(),hashRequisitosProyInhabUsuario = new Map(),hashSeccContratistaInhabUsuario = new Map(),
   hashTipoInduccVirtualHabUsuario = new Map();
var mensajeUx;

function cargaInicialVistaDocumentos(){
   var dataParam = {};

   callAjaxPostSimple(URL+"/contratista/vista_documentos/inicial",dataParam,1,function(data){
      listSeccionesDocumentos = data.listSeccionesDocumentos;
      usuarioConfig = data.usuario;

      var seccionesHabilitadasId = usuarioConfig.seccionesHabilitadasId.split(",");
      listSeccionesDocumentosFinal = [];

      listSeccionesDocumentos.forEach(function(val){
         seccionesHabilitadasId.forEach(function(val1){
            if(parseInt(val1) == val.id){
               listSeccionesDocumentosFinal.push(val);
            }
         });
      });
      
        if(usuarioConfig.examenesInhabilitadosId.length != 0){
	        var examenesInhabilitadosId = usuarioConfig.examenesInhabilitadosId.split(",");
	         
	        examenesInhabilitadosId.forEach(function(val){
	            hashExamenesInhabUsuario.set(parseInt(val),1);listTipoExamenNoPermitidoUsuario.push(parseInt(val));
	        });
        }
      
      if(usuarioConfig.requisitosProyectoInhabilitadosId.length != 0){
         var requisitosProyInhabilitadasId = usuarioConfig.requisitosProyectoInhabilitadosId.split(",");
         
         requisitosProyInhabilitadasId.forEach(function(val){
            hashRequisitosProyInhabUsuario.set(parseInt(val),1);
         });
      }
      
      if(usuarioConfig.seccionesContratistaInhabilitadasId.length != 0){
	 var seccionesContInhabilitadasId = usuarioConfig.seccionesContratistaInhabilitadasId.split(",");
	         
	 seccionesContInhabilitadasId.forEach(function(val){
	    hashSeccContratistaInhabUsuario.set(parseInt(val),1);
	 });      
      }

      listSeccionesDocumentosFinal = (listSeccionesDocumentosFinal.length != 0?listSeccionesDocumentosFinal:
         listSeccionesDocumentos);

      if(usuarioConfig.contratistasAsignadosId.length != 0){
	 var contratistasAsignadosId = usuarioConfig.contratistasAsignadosId.split(",");
	         
	 contratistasAsignadosId.forEach(function(val){
	    listContratistasAsignadosUsuario.push(parseInt(val));
	 });
      }
      
      if(usuarioConfig.tiposInduccionVirtualHabilitadosId.length != 0){
         var tiposInduccionVirtualHabilitadosId = usuarioConfig.tiposInduccionVirtualHabilitadosId.split(",");
		         
         tiposInduccionVirtualHabilitadosId.forEach(function(val){
            hashTipoInduccVirtualHabUsuario.set(parseInt(val),1);
         });
      }

      var selTabRevDocumentos = crearSelectOneMenuOblig("selTabRevDocumentos",
         "verAcordeTabRevDocumentos()",listSeccionesDocumentosFinal,1,"id","nombre");

      $("#divListaTabs").html("Pestaña: "+selTabRevDocumentos);

      $.unblockUI();verAcordeTabRevDocumentos();
   });
}

var personalizarUsuarioDocumento;

function verAcordeTabRevDocumentos() {
    var tabId = $("#selTabRevDocumentos").val();
    var tabNombre = "";

    $(".tab-content .tab-pane").hide();

    switch (parseInt(tabId)) {
        case 1:
            tabNombre = "tabResumenEvaDocProyecto";
            $("#divEvaluacionTotalDocProyecto").hide();
            crearFiltroEvaDocProyecto(valoresFiltroEvaDocProyecto);

            break;

        case 2:
            tabNombre = "tabInduccion";
            cargarInduccionsSeguridad();

            break;

        case 3:
            tabNombre = "tabInduccionVirtual";personalizarUsuarioDocumento = 1;
            crearFiltroInduccionesVirtualesGeneral(valoresFiltroInduccionesVirtualesGeneral);
            completarBarraCarga();

            break;

        case 4:
            tabNombre = "tabDocPersonalExt";
            crearFiltroDocPersonalExterno(valoresFiltroDocPersonalExt);

            break;

        case 5:
            tabNombre = "tabObservacionesTotales";
            verObservaciones(0,1);

            break;

        case 6:
            tabNombre = "tabExaTrabContratista";personalizarUsuarioDocumento = 1;
            crearFiltroExaTrabContratista(valoresFiltroExaTrabContratista);

            break;
			
		case 7:
			tabNombre = "tabRegistroAccesoVd";
			previoSeleccionarOpcionRegistroAccesoVd();completarBarraCarga();

			break;
    }

    $("#" + tabNombre).show();
}

function ocultarFiltroEvaDocProyecto(){
   $("#modalFiltroEvaDocProyecto").modal("hide");
}

function verFiltroEvaDocProyecto(){
   $("#modalFiltroEvaDocProyecto").modal("show");
}

function crearFiltroEvaDocProyecto(functionCallBack){
   $("#modalFiltroEvaDocProyecto").remove();

   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))
   };

   callAjaxPost(URL+'/contratista/resumen_evaluar_documento_proyecto/filtro',dataParam,function(data){
      listContratistaEvaDocPro = data.listContratista;listEvaluacionEvaDocPro = data.listEvaluacion;listAreasContEvaDocPro = data.listAreas;
       listTiposEstadoProyEvaDocPro = data.listTiposEstadoProy;listTiposLugarTrabEvaDocPro = data.listTiposLugarTrab;

      var listOpcionesOrdenarProy = [
         {id:1,nombre:"título del proyecto (A-Z)"},{id:2,nombre:"título del proyecto (Z-A)"},
         {id:3,nombre:"nombre del contratista (A-Z)"},{id:4,nombre:"nombre del contratista (Z-A)"},
         {id:0,nombre:"registro del proyecto"}
      ];

      var selOpcOrdenarProy = crearSelectOneMenu("selOpcOrdenarProy","",
         listOpcionesOrdenarProy,-1,"id","nombre","antigüedad de los documentos (la más antigua primero)");

      var contenido = "";

      var listContenido=[
         {sugerencia:"",label:"Ordenar por",inputForm:selOpcOrdenarProy},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Estados de la evaluación",
	  inputForm:"<a class='efectoLink' onclick='verCheckListTiposNotaResumenEvaDocProy()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
	 {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTiposNotaResEvaDocProy"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Áreas",
	  inputForm:"<a class='efectoLink' onclick='verCheckListAreasContResumenEvaDocProy()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
	 {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelAreasContResEvaDocProy"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Estados del proyecto",
	  inputForm:"<a class='efectoLink' onclick='verCheckListTiposEstadoResumenEvaDocProy()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
	 {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTiposEstadoResEvaDocProy"},
	      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Lugar(es) de trabajo",
	       inputForm:"<a class='efectoLink' onclick='verCheckListTiposLugaresTrabResumenEvaDocProy()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
	      {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTiposlugaresTrabResEvaDocProy"},
//       {sugerencia:"",label:"",inputForm:"",divContainer:""},
//       {sugerencia:"",label:"",inputForm:"<label>Intervalo - Carga del documento</label>",divContainer:""},
//       {sugerencia:"",label:"Fecha Inicio",inputForm:"<input type='date' id='fechaInicioCargaEvaDocPro' class='form-control'>"},
//       {sugerencia:"",label:"Fecha Fin",inputForm:"<input type='date' id='fechaFinCargaEvaDocPro' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroEvaDocProyecto()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
          inputForm: "<button id='btnAplicarFiltroEvaDocPro' class='btn btn-success' type='submit' " +
                             "onclick='valoresFiltroEvaDocProyecto()' style='float:right;font-size:18px;'>" +
                        "<i class='fa fa-filter'></i> Aplicar filtro" +
                     "</button>"}
      ];

      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });

      var modalOptionsEvaDocPro={
         id:"modalFiltroEvaDocProyecto",nombre:"<i class='fa fa-filter'></i> Filtros",
         contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
      };

      crearModalPrincipalUsuario(modalOptionsEvaDocPro,function(){},true,true);

        crearCheckListGeneral("modalFiltroEvaDocProyecto","Estados de la evaluación","TipoNotaResEvaDocProySelec",
            listEvaluacionEvaDocPro,"TiposNotaResumenEvaDocProy",cargarCheckListTiposNotaResumenEvaDocProy);

        crearCheckListGeneral("modalFiltroEvaDocProyecto","Áreas","AreasContResEvaDocProySelec",
            listAreasContEvaDocPro,"AreasContResumenEvaDocProy",ocultarCheckListAreasContResumenEvaDocProy);
        
        crearCheckListGeneral("modalFiltroEvaDocProyecto","Estados del proyecto","TiposEstadoResEvaDocProySelec",
            listTiposEstadoProyEvaDocPro,"TiposEstadoResumenEvaDocProy",cargarCheckListTiposEstadoResumenEvaDocProy);
			
		crearCheckListGeneral("modalFiltroEvaDocProyecto","Lugar(es) de trabajo","TiposLugaresTrabResEvaDocProySelec",
		    listTiposLugarTrabEvaDocPro,"TiposLugaresTrabResumenEvaDocProy",cargarCheckListTiposLugaresTrabResumenEvaDocProy);
	      
        functionCallBack();completarBarraCarga();
    });
}

function ocultarCheckListTiposNotaResumenEvaDocProy(){
    var textTipoNotaResEvaDocProySelec = "";

    listEvaluacionEvaDocPro.forEach(function(val){
        var isSeleccionado = ($("#checkAsignadoTipoNotaResEvaDocProySelec"+val.id).prop("checked")?1:0);

	if(isSeleccionado == 1){
	    textTipoNotaResEvaDocProySelec += (textTipoNotaResEvaDocProySelec.length == 0?val.nombre:", "+val.nombre);
	}
    });

    textTipoNotaResEvaDocProySelec = (textTipoNotaResEvaDocProySelec.length == 0?"Todos":textTipoNotaResEvaDocProySelec);

    $("#divSelTiposNotaResEvaDocProy").html(textTipoNotaResEvaDocProySelec);

    $("#modalCheckListTipoNotaResEvaDocProySelec").modal("hide");$("#modalFiltroEvaDocProyecto").modal("show");
}

function verCheckListTiposNotaResumenEvaDocProy(){
    $("#modalCheckListTipoNotaResEvaDocProySelec").modal("show");$("#modalFiltroEvaDocProyecto").modal("hide");
}

function cargarCheckListTiposNotaResumenEvaDocProy(){
    var tipoNotaSeleccionadosId = [3,4,5,6,8];

    tipoNotaSeleccionadosId.forEach(function(val1){
        var checkboxTipoNota = document.getElementById('checkAsignadoTipoNotaResEvaDocProySelec'+val1);
        
        if(checkboxTipoNota != null){
            checkboxTipoNota.checked = true;
        }
    });

    ocultarCheckListTiposNotaResumenEvaDocProy();
}

function ocultarCheckListAreasContResumenEvaDocProy(){
    var textAreasContResEvaDocProySelec = "";

    listAreasContEvaDocPro.forEach(function(val){
        var isSeleccionado = ($("#checkAsignadoAreasContResEvaDocProySelec"+val.id).prop("checked")?1:0);

	if(isSeleccionado == 1){
	    textAreasContResEvaDocProySelec += (textAreasContResEvaDocProySelec.length == 0?val.nombre:", "+val.nombre);
	}
    });

    textAreasContResEvaDocProySelec = (textAreasContResEvaDocProySelec.length == 0?"Todos":textAreasContResEvaDocProySelec);

    $("#divSelAreasContResEvaDocProy").html(textAreasContResEvaDocProySelec);

    $("#modalCheckListAreasContResEvaDocProySelec").modal("hide");$("#modalFiltroEvaDocProyecto").modal("show");
}

function verCheckListAreasContResumenEvaDocProy(){
    $("#modalCheckListAreasContResEvaDocProySelec").modal("show");$("#modalFiltroEvaDocProyecto").modal("hide");
}

function ocultarCheckListTiposEstadoResumenEvaDocProy(){
    var textTiposEstadoResEvaDocProySelec = "";

    listTiposEstadoProyEvaDocPro.forEach(function(val){
        var isSeleccionado = ($("#checkAsignadoTiposEstadoResEvaDocProySelec"+val.id).prop("checked")?1:0);

	if(isSeleccionado == 1){
	    textTiposEstadoResEvaDocProySelec += (textTiposEstadoResEvaDocProySelec.length == 0?val.nombre:", "+val.nombre);
	}
    });

    textTiposEstadoResEvaDocProySelec = (textTiposEstadoResEvaDocProySelec.length == 0?"Todos":textTiposEstadoResEvaDocProySelec);

    $("#divSelTiposEstadoResEvaDocProy").html(textTiposEstadoResEvaDocProySelec);

    $("#modalCheckListTiposEstadoResEvaDocProySelec").modal("hide");$("#modalFiltroEvaDocProyecto").modal("show");
}

function verCheckListTiposEstadoResumenEvaDocProy(){
    $("#modalCheckListTiposEstadoResEvaDocProySelec").modal("show");$("#modalFiltroEvaDocProyecto").modal("hide");
}

function cargarCheckListTiposEstadoResumenEvaDocProy(){
    var tipoEstadoProySeleccionadosId = [1,2];

    tipoEstadoProySeleccionadosId.forEach(function(val1){
        var checkboxTipoNota = document.getElementById('checkAsignadoTiposEstadoResEvaDocProySelec'+val1);
        
        if(checkboxTipoNota != null){
            checkboxTipoNota.checked = true;
        }
    });

    ocultarCheckListTiposEstadoResumenEvaDocProy();
}

var listTiposLugarTrabEvaDocProAux;

function ocultarCheckListTiposLugaresTrabResumenEvaDocProy(){
    var textTiposLugaresTrabResEvaDocProySelec = "";

    listTiposLugarTrabEvaDocPro.forEach(function(val){
        var isSeleccionado = ($("#checkAsignadoTiposLugaresTrabResEvaDocProySelec"+val.id).prop("checked")?1:0);

	    if(isSeleccionado == 1){
	    	textTiposLugaresTrabResEvaDocProySelec += (textTiposLugaresTrabResEvaDocProySelec.length == 0?val.nombre:", "+val.nombre);
		}
    });

    textTiposLugaresTrabResEvaDocProySelec = (textTiposLugaresTrabResEvaDocProySelec.length == 0?"Todos":textTiposLugaresTrabResEvaDocProySelec);

    $("#divSelTiposlugaresTrabResEvaDocProy").html(textTiposLugaresTrabResEvaDocProySelec);

    $("#modalCheckListTiposLugaresTrabResEvaDocProySelec").modal("hide");$("#modalFiltroEvaDocProyecto").modal("show");
}

function verCheckListTiposLugaresTrabResumenEvaDocProy(){
    $("#modalCheckListTiposLugaresTrabResEvaDocProySelec").modal("show");$("#modalFiltroEvaDocProyecto").modal("hide");
}

function cargarCheckListTiposLugaresTrabResumenEvaDocProy(){
	listTiposLugarTrabEvaDocProAux = [];
	
	if(usuarioConfig.tiposLugaresTrabajosAsignadosId.length != 0){
		$("#tblCheckListTiposLugaresTrabResEvaDocProySelec tbody tr").hide();
		
	    var tiposLugaresTrabajosAsignadosId = usuarioConfig.tiposLugaresTrabajosAsignadosId.split(",");

	    tiposLugaresTrabajosAsignadosId.forEach(function(val){
            listTiposLugarTrabEvaDocProAux.push(val);
			
			$("#trCheckListTiposLugaresTrabResEvaDocProySelec"+val).show();
	    });
	}
	
    ocultarCheckListTiposLugaresTrabResumenEvaDocProy();
}

function valoresFiltroEvaDocProyecto() {
    ocultarFiltroEvaDocProyecto();
    
    listEstadosEvaluacionId = [];
    
    listEvaluacionEvaDocPro.forEach(function(val){
        var isSeleccionado = ($("#checkAsignadoTipoNotaResEvaDocProySelec"+val.id).prop("checked")?1:0);

	if(isSeleccionado == 1){
	    listEstadosEvaluacionId.push(val.id);
	}
    });
   
    listAreasContEvalId = [];
    
    listAreasContEvaDocPro.forEach(function(val){
        var isSeleccionado = ($("#checkAsignadoAreasContResEvaDocProySelec"+val.id).prop("checked")?1:0);

	if(isSeleccionado == 1){
	    listAreasContEvalId.push(val.id);
	}
    });
    
    listTiposEstadoProyEvalId = [];
    
    listTiposEstadoProyEvaDocPro.forEach(function(val){
        var isSeleccionado = ($("#checkAsignadoTiposEstadoResEvaDocProySelec"+val.id).prop("checked")?1:0);

	if(isSeleccionado == 1){
	    listTiposEstadoProyEvalId.push(val.id);
	}
    });
	
	listTiposlugaresTrabProyEvalId = [];

	listTiposLugarTrabEvaDocPro.forEach(function(val){
	    var isSeleccionado = ($("#checkAsignadoTiposLugaresTrabResEvaDocProySelec"+val.id).prop("checked")?1:0);

		if(isSeleccionado == 1){
		    listTiposlugaresTrabProyEvalId.push(val.id);
		}
	});
	
	if(usuarioConfig.tiposLugaresTrabajosAsignadosId.length != 0 && listTiposlugaresTrabProyEvalId.length == 0){
		listTiposlugaresTrabProyEvalId = listTiposLugarTrabEvaDocProAux;
	}
	
    cargarEvaluacionDocProyecto();
}

function cargarEvaluacionDocProyecto(){
   resizeDivWrapper("wrapperResumenEvaDocProyecto", 180);

   var opcionOrdenId = parseInt($("#selOpcOrdenarProy").val());

   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),
      ordenFiltroId: (opcionOrdenId == -1?null:opcionOrdenId),
      examenesInhabilitadosUsuarioId: usuarioConfig.examenesInhabilitadosId,
      requisitosProyectoInhabilitadosUsuarioId: usuarioConfig.requisitosProyectoInhabilitadosId,
      seccionesContratistaInhabilitadasUsuarioId: usuarioConfig.seccionesContratistaInhabilitadasId,
//      fechaCargaDocInicio:($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
//      fechaCargaDocFin:($("#fechaFinCargaEvaDocPro").val() == "" ?null:$("#fechaFinCargaEvaDocPro").val()),
      listEstadosEvaluacionIdFiltro:(listEstadosEvaluacionId.length == 0?null:listEstadosEvaluacionId),
      listAreasContEvalIdFiltro:(listAreasContEvalId.length == 0?null:listAreasContEvalId),
      listTiposEstadoProyEvalIdFiltro:(listTiposEstadoProyEvalId.length == 0?null:listTiposEstadoProyEvalId),
      listContratistasAsignadosIdUsuario: (listContratistasAsignadosUsuario.length == 0?null:listContratistasAsignadosUsuario),
	  listTiposLugaresTrabProyEvalIdFiltro:(listTiposlugaresTrabProyEvalId.length == 0?null:listTiposlugaresTrabProyEvalId)
   };
   
   callAjaxPostSimple(URL+'/contratista/resumen_evaluar_documento_proyecto',dataParam,1,function(data){
      if(data.CODE_RESPONSE == "05"){
         listFullEvaluacionDocProyecto = data.listProyectosDoc;listFullProyectoSeguridad = data.listProyectosDoc;
         listTipoActividades = data.listTipoActividades;listEvaluacionTotal = data.listTipoEvaluacion;

         $("#tblResumenEvaDocProyecto tbody tr").remove();
         
         var numRegistros = 0;

         listFullEvaluacionDocProyecto.forEach(function(val,index){
            if(val.numTotalDocumentosProyecto > 0){
				var detalle = "<label>*Código:</label> "+val.codigo +
				    "<br><label>*Título:</label> "+val.titulo +
				    "<br><label>*Contratista:</label> "+val.contratistaNombre,
					area = (val.area.nombre.length == 0?"------":val.area.nombre),
					lugarTrabajo = (val.tipoLugaresTrabajoAsignadosNombre.length == 0?"------":val.tipoLugaresTrabajoAsignadosNombre);
				
               $("#tblResumenEvaDocProyecto tbody").append(
                  "<tr id='trEvaDocPro"+val.id+"'>" +
                     "<td id='tdDetalleProy"+val.id+"' style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
					 "<td id='tdEstadoProy"+val.id+"'>"+val.estado.nombre+"</td>" +
                     "<td id='tdPerfilProyecto"+val.id+"'>"+val.perfilEspecial.nombre+"</td>" +
					 "<td id='tdAreaProy"+val.id+"'>"+area+"</td>" +
					 "<td id='tdLugarTrabProy"+val.id+"'>"+lugarTrabajo+"</td>" +
                     "<td id='tdnumdocestado"+val.id+"'>"+val.numTotalDocumentosProyecto+"</td>" +
                     "<td id='tdevaluardoc"+val.id+"'>" +
                        "<button type='button' id='btnEvaluarDocResDocPro' class='btn btn-success' style='margin-right:10px' " +
                                "onclick='enviarDatosProyectoFila("+index+")' " +
                                "title='Evaluar los documentos asociados al proyecto de esta fila.'>" +
                           "<i class='fa fa-pencil-square-o fa-2x'></i>" +
                        "</button>" +
                     "</td>" +
                  "</tr>");
            }
            
            numRegistros++;
         });
         
         if(listFullEvaluacionDocProyecto.length == numRegistros){
            $.unblockUI();
         }

         goheadfixedY("#tblResumenEvaDocProyecto","#wrapperResumenEvaDocProyecto");
      }else{
         console.log("NOPNPO");
      }
   });
}

function enviarDatosProyectoFila(pindex){
   proyectoObj = listFullEvaluacionDocProyecto[pindex];
    
   evaluacionTotalDocumentosProyecto();
}

var listEstadoEvaDocPro=[
   {id:1,nombre:"Visto bueno"},{id:2,nombre:"Desaprobado"},
   {id:3,nombre:"Pendiente",selected:1},{id:4,nombre:"Por re-evaluar",selected:1}
];

var countPushListEstRevDoc = 0;

var listFullActividades = [];
var listFullExamenes = [];
var listFullSubContratistas = [];
//var evalDocActividades=[];
//var evalDocExamenes=[],evalDocSubContratistas=[];
var listFullHojasVida = [], listFullAnalisisTrabajoSeguro = [],listFullDocNivelCond = [],listFullDocNivelVehMaq = [],
    listFullDocNivelEquHerr = [];
var listFullPermisoTraAltRie = [];
var listFullOperadorEquipo = [];
var listFullEquiposMovilCertificado = [];
var listFullEquiposMovilMantenimiento = [];
var listFullDocumentosEquipIzaje = [];

var hasEvalActualizadaProy, hasDocEliminadoProy;

function evaluacionTotalDocumentosProyecto() {
    resizeDivWrapper("wrapEvalTotalDocProy", 170);
    hasEvalActualizadaProy = 0, hasDocEliminadoProy = 0;

    if (proyectoObj.postulante.contratista == null) {
        alert("Debe asignar un contratista al proyecto antes de evaluar los documentos");
        return;
    }

    regresarPrincipalProyVista = 0;

    $("#tabResumenEvaDocProyecto .container-fluid").hide();
    $("#divEvaluacionTotalDocProyecto").show();

    if (parseInt(getSession("gestopcompanyid")) == 154 && countPushListEstRevDoc == 0) {
        listEstadoEvaDocPro.push({id: 5, nombre: "Por validar", selected: 1});
        countPushListEstRevDoc++;
    }

    if (parseInt(getSession("gestopcompanyid")) == 285 && countPushListEstRevDoc == 0) {
        listEstadoEvaDocPro.push({id: 6, nombre: "Por validar", selected: 1});
        countPushListEstRevDoc++;
    }

    if (parseInt(getSession("gestopcompanyid")) == 272 && countPushListEstRevDoc == 0) {
        listEstadoEvaDocPro.push({id: 7, nombre: "Recibido"});
        countPushListEstRevDoc++;
    }
    
    if(parseInt(getSession("gestopcompanyid")) == 747 && countPushListEstRevDoc == 0) {
        listEstadoEvaDocPro.push({id:8,nombre:"Por validar",selected:1});countPushListEstRevDoc++;
    }

    crearSelectOneMenuObligMultipleCompleto("selEstadoDocEvalTotal", "registrosEvaluacionTotalProyectoRevDoc()",
        listEstadoEvaDocPro, "id", "nombre", "#divEstadoDocsProyEvaluar", "", null);

    $("#tabResumenEvaDocProyecto h2").html(
        "<a onclick='volverDivProyectosResumen()'>Proyecto (" + proyectoObj.titulo.substring(0, 25) + "...) </a> " +
        "> <label>Evaluación general</label>");

    registrosEvaluacionTotalProyectoRevDoc();
}

var mapTrabContratistaVerfIa;

function registrosEvaluacionTotalProyectoRevDoc() {
   $("#divListaTabs").hide();

   var listEvaluar=[
      {nombre:listTipoActividades[0].nombre,divTr:"trActTipo1",
       isHabilitado:(proyectoObj.habilitadoActividad1 == 1 && hashRequisitosProyInhabUsuario.get(2) == undefined?1:0)},
      {nombre:"Plan de emergencia",divTr:"trActTipo2",
       isHabilitado:(proyectoObj.habilitadoActividad2 == 1 && hashRequisitosProyInhabUsuario.get(3) == undefined?1:0)},
      {nombre:"Plan COVID 19",divTr:"trActTipo6",
       isHabilitado:(proyectoObj.habilitadoActividad6 == 1 && hashRequisitosProyInhabUsuario.get(14) == undefined?1:0)},
      {nombre:"Matriz de Riesgo (IPERC)",divTr:"trActTipo7",
       isHabilitado:(proyectoObj.habilitadoActividad7 == 1 && hashRequisitosProyInhabUsuario.get(13) == undefined?1:0)},
      {nombre:"Plan de manejo de residuos",divTr:"trActTipo4",
       isHabilitado:(proyectoObj.habilitadoActividad4 == 1 && hashRequisitosProyInhabUsuario.get(5) == undefined?1:0)},
      {nombre:listTipoActividades[3].nombre+" Asociados al proyecto",divTr:"trActTipo5",
       isHabilitado:(proyectoObj.habilitadoActividad5 == 1 && hashRequisitosProyInhabUsuario.get(6) == undefined?1:0)},
      {nombre:"Registro de capacitaciones efectuadas relacionados a los trabajos a realizar",divTr:"trActTipo10",
       isHabilitado:(proyectoObj.habilitadoActividad10 == 1 && hashRequisitosProyInhabUsuario.get(15) == undefined?1:0)},
      {nombre:"Orden de compra o contrato firmado",divTr:"trActTipo11",
       isHabilitado:(proyectoObj.habilitadoActividad11 == 1 && hashRequisitosProyInhabUsuario.get(16) == undefined?1:0)},
      {nombre:"Cronograma de trabajo",divTr:"trActTipo12",
       isHabilitado:(proyectoObj.habilitadoActividad12 == 1 && hashRequisitosProyInhabUsuario.get(17) == undefined?1:0)},
      {nombre:"Programa de charlas diarias de seguridad",divTr:"trActTipo13",
       isHabilitado:(proyectoObj.habilitadoActividad13 == 1 && hashRequisitosProyInhabUsuario.get(18) == undefined?1:0)},
      {nombre:"Procedimiento escrito de trabajo seguro (PETS)",divTr:"trActTipo14",
       isHabilitado:(proyectoObj.habilitadoActividad14 == 1 && hashRequisitosProyInhabUsuario.get(19) == undefined?1:0)},
      {nombre:"Hoja MSDS",divTr:"trActTipo15",
       isHabilitado:(proyectoObj.habilitadoActividad15 == 1 && hashRequisitosProyInhabUsuario.get(20) == undefined?1:0)},
      {nombre:"Instructivo de trabajo seguro para el trabajo en alto riesgo",divTr:"trActTipo16",
       isHabilitado:(proyectoObj.habilitadoActividad16 == 1 && hashRequisitosProyInhabUsuario.get(21) == undefined?1:0)},
      {nombre:"Matriz de aspectos ambientales",divTr:"trActTipo18",
       isHabilitado:(proyectoObj.habilitadoActividad18 == 1 && hashRequisitosProyInhabUsuario.get(22) == undefined?1:0)},
       {nombre:"Memoria descriptiva",divTr:"trActTipo19",
        isHabilitado:(proyectoObj.habilitadoActividad19 == 1 && hashRequisitosProyInhabUsuario.get(23) == undefined?1:0)},
       {nombre:"Póliza de responsabilidad civil",divTr:"trActTipo20",
        isHabilitado:(proyectoObj.habilitadoActividad20 == 1 && hashRequisitosProyInhabUsuario.get(24) == undefined?1:0)},
       {nombre:"Póliza CAR",divTr:"trActTipo21",
        isHabilitado:(proyectoObj.habilitadoActividad21 == 1 && hashRequisitosProyInhabUsuario.get(25) == undefined?1:0)},
       {nombre:"Carta fianza",divTr:"trActTipo22",
        isHabilitado:(proyectoObj.habilitadoActividad22 == 1 && hashRequisitosProyInhabUsuario.get(26) == undefined?1:0)},
	   {nombre:"Plan de rescate",divTr:"trActTipo23",
		isHabilitado:(proyectoObj.habilitadoActividad23 == 1 && hashRequisitosProyInhabUsuario.get(27) == undefined?1:0)},
       {nombre:"Plan de izaje",divTr:"trActTipo24",
		isHabilitado:(proyectoObj.habilitadoActividad24 == 1 && hashRequisitosProyInhabUsuario.get(28) == undefined?1:0)},
       {nombre:"Matriz de procesos y actividades",divTr:"trActTipo25",
		isHabilitado:(proyectoObj.habilitadoActividad25 == 1 && hashRequisitosProyInhabUsuario.get(29) == undefined?1:0)},
       {nombre:"Estructura de SST para el servicio",divTr:"trActTipo26",
		isHabilitado:(proyectoObj.habilitadoActividad26 == 1 && hashRequisitosProyInhabUsuario.get(30) == undefined?1:0)},
       {nombre:"Plan de contingencia",divTr:"trActTipo27",
		isHabilitado:(proyectoObj.habilitadoActividad27 == 1 && hashRequisitosProyInhabUsuario.get(31) == undefined?1:0)},
       {nombre:"Señalización de obras e instalaciones",divTr:"trActTipo28",
		isHabilitado:(proyectoObj.habilitadoActividad28 == 1 && hashRequisitosProyInhabUsuario.get(32) == undefined?1:0)},
      {nombre:"Hoja de vida",divTr:"trHojaVida",
       isHabilitado:(proyectoObj.habilitadoHojaVida == 1 && hashSeccContratistaInhabUsuario.get(44) == undefined?1:0)},
       
      {nombre:(parseInt(getSession("gestopcompanyid")) == 741?"Habilitación médica ocupacional":"Certificados de aptitud médica"),divTr:"trExamTipo1",
       isHabilitado:(proyectoObj.habilitadoCertAptMedica == 1 && hashExamenesInhabUsuario.get(1) == undefined?1:0)},
      {nombre:"SCTR",divTr:"trExamTipo2",
       isHabilitado:(proyectoObj.habilitadoSctr == 1 && hashExamenesInhabUsuario.get(2) == undefined?1:0)},
      {nombre:"Cargo RISST",divTr:"trExamTipo4",
       isHabilitado:(proyectoObj.habilitadoCargReglamento == 1 && hashExamenesInhabUsuario.get(4) == undefined?1:0)},
      {nombre:"T-Registro",divTr:"trExamTipo6",
       isHabilitado:(proyectoObj.habilitadoTRegistro == 1 && hashExamenesInhabUsuario.get(6) == undefined?1:0)},
      {nombre:"EPP",divTr:"trExamTipo8",
       isHabilitado:(proyectoObj.habilitadoEpp == 1 && hashExamenesInhabUsuario.get(8) == undefined?1:0)},
      {nombre:"Inducciones SST de la contratista",divTr:"trExamTipo23",
       isHabilitado:(proyectoObj.habilitadoInduccSstCont == 1 && hashExamenesInhabUsuario.get(23) == undefined?1:0)},
      {nombre:"Certificado de capacitación para trabajo de alto riesgo",divTr:"trExamTipo15",
       isHabilitado:(proyectoObj.habilitadoConstanciaAltoRiesgo == 1 && hashExamenesInhabUsuario.get(15) == undefined?1:0)},
      {nombre:"Prevencionista", divTr:"trExamTipo14",
       isHabilitado:(proyectoObj.habilitadoPrevencionista == 1 && hashExamenesInhabUsuario.get(14) == undefined?1:0)},
      {nombre:"Certificados policiales",divTr:"trExamTipo43",
       isHabilitado:(proyectoObj.habilitadoCertifPolicial == 1 && hashExamenesInhabUsuario.get(43) == undefined?1:0)},
      {nombre:"Prueba COVID-19",divTr:"trExamTipo25",
       isHabilitado:(proyectoObj.habilitadoPruebaCovid == 1 && hashExamenesInhabUsuario.get(25) == undefined?1:0)}, 
      {nombre:"Vacuna COVID-19",divTr:"trExamTipo34",
       isHabilitado:(proyectoObj.habilitadoVacunaCovid == 1 && hashExamenesInhabUsuario.get(34) == undefined?1:0)},
      {nombre:"Antecedentes penales",divTr:"trExamTipo60",
       isHabilitado:(proyectoObj.habilitadoAntecedentesPenales == 1 && hashExamenesInhabUsuario.get(60) == undefined?1:0)},
      {nombre:"Seguro contra accidentes",divTr:"trExamTipo61",
       isHabilitado:(proyectoObj.habilitadoSeguroAccidentes == 1 && hashExamenesInhabUsuario.get(61) == undefined?1:0)},
      {nombre:"Riesgo de exposición al puesto de trabajo",divTr:"trExamTipo63", 
       isHabilitado:(proyectoObj.habilitadoRiesgoExposicionPuestoTrabajo == 1 && hashExamenesInhabUsuario.get(63) == undefined?1:0)},
      {nombre:"Vacunación COVID-19",divTr:"trExamTipo64",
       isHabilitado:(proyectoObj.habilitadoVacunacionCovid == 1 && hashExamenesInhabUsuario.get(64) == undefined?1:0)},
      {nombre:"Carnet de sanidad",divTr:"trExamTipo65",
       isHabilitado:(proyectoObj.habilitadoCarnetSanidad == 1 && hashExamenesInhabUsuario.get(65) == undefined?1:0)},
      {nombre:"Acuerdo de seguridad y confidencialidad - equipos electrónicos",divTr:"trExamTipo72",
       isHabilitado:(proyectoObj.habilitadoAcuerdoSeguridadEquElec == 1 && hashExamenesInhabUsuario.get(72) == undefined?1:0)},
      {nombre:"Evaluación toxicológica",divTr:"trExamTipo73",
       isHabilitado:(proyectoObj.habilitadoEvaluacionToxicologica == 1 && hashExamenesInhabUsuario.get(73) == undefined?1:0)},
      {nombre:"Certificado único laboral",divTr:"trExamTipo74",
       isHabilitado:(proyectoObj.habilitadoCertifUnicoLaboral == 1 && hashExamenesInhabUsuario.get(74) == undefined?1:0)},
      {nombre:"Antecedentes policiales",divTr:"trExamTipo75",
       isHabilitado:(proyectoObj.habilitadoAntecedentesPoliciales == 1 && hashExamenesInhabUsuario.get(75) == undefined?1:0)},
      {nombre:"Declaración jurada o verificación del domicilio",divTr:"trExamTipo76",
       isHabilitado:(proyectoObj.habilitadoDeclaracionVerifDomicilio == 1 && hashExamenesInhabUsuario.get(76) == undefined?1:0)},
      {nombre:"Dotación indumentaria",divTr:"trExamTipo77",
       isHabilitado:(proyectoObj.habilitadoDotacionIndumentaria == 1 && hashExamenesInhabUsuario.get(77) == undefined?1:0)},
      {nombre:"Habilitación médica por clínica",divTr:"trExamTipo79",
       isHabilitado:(proyectoObj.habilitadoMedicoClinica == 1 && hashExamenesInhabUsuario.get(79) == undefined?1:0)},
      {nombre:"Cargo RISST de la contratista",divTr:"trExamTipo84",
       isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont84 == 1 && hashExamenesInhabUsuario.get(84) == undefined?1:0)},
      {nombre:"Cargo de recepción de IPERC",divTr:"trExamTipo89",
       isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont89 == 1 && hashExamenesInhabUsuario.get(89) == undefined?1:0)},
       {nombre:"Seguro vida ley",divTr:"trExamTipo90",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont90 == 1 && hashExamenesInhabUsuario.get(90) == undefined?1:0)},
       {nombre:"Documento de identidad",divTr:"trExamTipo99",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont99 == 1 && hashExamenesInhabUsuario.get(99) == undefined?1:0)},
       {nombre:"Procedimiento o manual para trab. contratistas",divTr:"trExamTipo100",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont100 == 1 && hashExamenesInhabUsuario.get(100) == undefined?1:0)},
       {nombre:"Cargo de procedimiento de HS",divTr:"trExamTipo101",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont101 == 1 && hashExamenesInhabUsuario.get(101) == undefined?1:0)},
       {nombre:"Inducción SSOMA del cliente",divTr:"trExamTipo111",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont111 == 1 && hashExamenesInhabUsuario.get(111) == undefined?1:0)},
       {nombre:"Registro de capacitación en procedimiento de trabajo",divTr:"trExamTipo112",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont112 == 1 && hashExamenesInhabUsuario.get(112) == undefined?1:0)},
       {nombre:"Registro de difusión de política de seguridad del cliente",divTr:"trExamTipo113",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont113 == 1 && hashExamenesInhabUsuario.get(113) == undefined?1:0)},
       {nombre:"Registro de difusión de RISST del cliente",divTr:"trExamTipo114",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont114 == 1 && hashExamenesInhabUsuario.get(114) == undefined?1:0)},
       {nombre:"Capacitación en reporte de accidentes e incidentes (flujograma)",divTr:"trExamTipo115",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont115 == 1 && hashExamenesInhabUsuario.get(115) == undefined?1:0)},
       {nombre:"Difusión de IPERC, PETS y PETAR",divTr:"trExamTipo116",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont116 == 1 && hashExamenesInhabUsuario.get(116) == undefined?1:0)},
       {nombre:"Registro de capacitación por puesto de trabajo",divTr:"trExamTipo117",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont117 == 1 && hashExamenesInhabUsuario.get(117) == undefined?1:0)},
       {nombre:"Registro de capacitación de IPERC de la contratista",divTr:"trExamTipo118",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont118 == 1 && hashExamenesInhabUsuario.get(118) == undefined?1:0)},
       {nombre:"Capacitación de buenas prácticas de manipulación de alimentos",divTr:"trExamTipo119",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont119 == 1 && hashExamenesInhabUsuario.get(119) == undefined?1:0)},
       {nombre:"Título del profesional",divTr:"trExamTipo128",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont128 == 1 && hashExamenesInhabUsuario.get(128) == undefined?1:0)},
       {nombre:"Evidencia colegiatura habilitada",divTr:"trExamTipo129",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont129 == 1 && hashExamenesInhabUsuario.get(129) == undefined?1:0)},
       {nombre:"Registro nacional de especialidad",divTr:"trExamTipo130",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont130 == 1 && hashExamenesInhabUsuario.get(130) == undefined?1:0)},
       {nombre:"Constancia/Carnet SUCAMEC",divTr:"trExamTipo131",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont131 == 1 && hashExamenesInhabUsuario.get(131) == undefined?1:0)},
       {nombre:"Certificado capacitacion - BLS (Basic Life Support)",divTr:"trExamTipo132",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont132 == 1 && hashExamenesInhabUsuario.get(132) == undefined?1:0)},
       {nombre:"Certificado capacitacion - PHLS (Prehospital Trauma Life Support)",divTr:"trExamTipo133",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont133 == 1 && hashExamenesInhabUsuario.get(133) == undefined?1:0)},
       {nombre:"Certificado capacitacion - ACLS (Advance Cardiovascular Life Support)",divTr:"trExamTipo134",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont134 == 1 && hashExamenesInhabUsuario.get(134) == undefined?1:0)},
       {nombre:"Difusión de plan de respuesta a emergencia del cliente",divTr:"trExamTipo140",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont140 == 1 && hashExamenesInhabUsuario.get(140) == undefined?1:0)},
       {nombre:"Charla de inducción SST y MA",divTr:"trExamTipo141",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont141 == 1 && hashExamenesInhabUsuario.get(141) == undefined?1:0)},
       {nombre:"Difusión y entrega de política de sostenibilidad del cliente",divTr:"trExamTipo142",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont142 == 1 && hashExamenesInhabUsuario.get(142) == undefined?1:0)},
       {nombre:"Difusión y entrega plan COVID-19",divTr:"trExamTipo143",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont143 == 1 && hashExamenesInhabUsuario.get(143) == undefined?1:0)},
       {nombre:"Capacitación en matriz IPERC",divTr:"trExamTipo144",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont144 == 1 && hashExamenesInhabUsuario.get(144) == undefined?1:0)},
       {nombre:"Capacitación en matriz IAAS",divTr:"trExamTipo145",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont145 == 1 && hashExamenesInhabUsuario.get(145) == undefined?1:0)},
       {nombre:"Capacitación en primeros auxilios",divTr:"trExamTipo146",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont146 == 1 && hashExamenesInhabUsuario.get(146) == undefined?1:0)},
       {nombre:"Capacitación en uso extintor",divTr:"trExamTipo147",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont147 == 1 && hashExamenesInhabUsuario.get(147) == undefined?1:0)},
       {nombre:"Capacitación en plan contingencia",divTr:"trExamTipo148",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont148 == 1 && hashExamenesInhabUsuario.get(148) == undefined?1:0)},
       {nombre:"Capacitación en procedimiento de trabajo",divTr:"trExamTipo149",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont149 == 1 && hashExamenesInhabUsuario.get(149) == undefined?1:0)},
       {nombre:"Capacitación en ATS",divTr:"trExamTipo150",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont150 == 1 && hashExamenesInhabUsuario.get(150) == undefined?1:0)},
       {nombre:"Capacitación en capacitación uso de EPP",divTr:"trExamTipo151",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont151 == 1 && hashExamenesInhabUsuario.get(151) == undefined?1:0)},
       {nombre:"Capacitación en manejo de insumos químicos - hojas MSDS",divTr:"trExamTipo152",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont152 == 1 && hashExamenesInhabUsuario.get(152) == undefined?1:0)},
       {nombre:"Capacitación en uso de herramientas manuales",divTr:"trExamTipo153",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont153 == 1 && hashExamenesInhabUsuario.get(153) == undefined?1:0)},
       {nombre:"Capacitación en procedimiento de señalización",divTr:"trExamTipo154",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont154 == 1 && hashExamenesInhabUsuario.get(154) == undefined?1:0)},
       {nombre:"IBT 1",divTr:"trExamTipo155",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont155 == 1 && hashExamenesInhabUsuario.get(155) == undefined?1:0)},
       {nombre:"IBT 2",divTr:"trExamTipo156",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont156 == 1 && hashExamenesInhabUsuario.get(156) == undefined?1:0)},
       {nombre:"IBT 3",divTr:"trExamTipo157",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont157 == 1 && hashExamenesInhabUsuario.get(157) == undefined?1:0)},
       {nombre:"IBT 4",divTr:"trExamTipo158",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont158 == 1 && hashExamenesInhabUsuario.get(158) == undefined?1:0)},
       {nombre:"IBT 5",divTr:"trExamTipo159",
        isHabilitado:(proyectoObj.habilitadoExamNivelTrabCont159 == 1 && hashExamenesInhabUsuario.get(159) == undefined?1:0)},
      
      {nombre:"Acta de compromiso",divTr:"trExamTipo24",
       isHabilitado:(proyectoObj.habilitadoActaCompromiso == 1 && hashSeccContratistaInhabUsuario.get(46) == undefined?1:0)},
      {nombre:"Reglamento SST",divTr:"trExamTipo35",
       isHabilitado:(proyectoObj.habilitadoReglamentoSst == 1 && hashSeccContratistaInhabUsuario.get(52) == undefined?1:0)},
      {nombre:"Política SST",divTr:"trExamTipo36",
       isHabilitado:(proyectoObj.habilitadoPoliticaSst == 1 && hashSeccContratistaInhabUsuario.get(53) == undefined?1:0)},
      {nombre:"Plan anual SST",divTr:"trExamTipo37",
       isHabilitado:(proyectoObj.habilitadoPlanAnualSst == 1 && hashSeccContratistaInhabUsuario.get(54) == undefined?1:0)},
      {nombre:"Programa SST asociado a la empresa",divTr:"trExamTipo38",
       isHabilitado:(proyectoObj.habilitadoProgramaSst == 1 && hashSeccContratistaInhabUsuario.get(55) == undefined?1:0)},
      {nombre:"Plan anual de salud ocupacional",divTr:"trExamTipo39",
       isHabilitado:(proyectoObj.habilitadoPlanAnualSaludOcupacional == 1 && hashSeccContratistaInhabUsuario.get(56) == undefined?1:0)},
      {nombre:"Programa de vigilancia de salud ocupacional",divTr:"trExamTipo40",
       isHabilitado:(proyectoObj.habilitadoProgVigilanciaSaludOcupacional == 1 && hashSeccContratistaInhabUsuario.get(57) == undefined?1:0)},
      {nombre:"Certificado de homologación con el cliente",divTr:"trExamTipo41",
       isHabilitado:(proyectoObj.habilitadoCertificadoHomologacion == 1 && hashSeccContratistaInhabUsuario.get(58) == undefined?1:0)},
      {nombre:"Procedimiento de trabajo seguro para trabajos de alto riesgo",divTr:"trExamTipo42",
       isHabilitado:(proyectoObj.habilitadoProcTrabajoSeguroTraAltoRiesgo == 1 && hashSeccContratistaInhabUsuario.get(59) == undefined?1:0)},
      {nombre:"Indicador mensual SST",divTr:"trExamTipo16",
       isHabilitado:(proyectoObj.habilitadoIndicadorMensualSst == 1 && hashSeccContratistaInhabUsuario.get(23) == undefined?1:0)},  
      {nombre:"Constancia de registro laboral",divTr:"trExamTipo44",
       isHabilitado:(proyectoObj.habilitadoConstanciaLaboral == 1 && hashSeccContratistaInhabUsuario.get(63) == undefined?1:0)},
      {nombre:"Declaración de no núcleo del negocio",divTr:"trExamTipo45",
       isHabilitado:(proyectoObj.habilitadoNoNucleoNegocio == 1 && hashSeccContratistaInhabUsuario.get(64) == undefined?1:0)},
      {nombre:"Carta fianza",divTr:"trExamTipo46",
       isHabilitado:(proyectoObj.habilitadoCartaFianza == 1 && hashSeccContratistaInhabUsuario.get(65) == undefined?1:0)},
      {nombre:"Comunicado a organizaciones sindicales",divTr:"trExamTipo47",
       isHabilitado:(proyectoObj.habilitadoComunicadoSindicales == 1 && hashSeccContratistaInhabUsuario.get(66) == undefined?1:0)},
      {nombre:"Comunicado a representantes de trabajadores",divTr:"trExamTipo48",
       isHabilitado:(proyectoObj.habilitadoComunicadoRepresentantes == 1 && hashSeccContratistaInhabUsuario.get(67) == undefined?1:0)},
      {nombre:"Comunicado a trabajadores (principal)",divTr:"trExamTipo49",
       isHabilitado:(proyectoObj.habilitadoComunicadoTrabPrincipal == 1 && hashSeccContratistaInhabUsuario.get(68) == undefined?1:0)},
      {nombre:"Comunicado a trabajadores (contratista)",divTr:"trExamTipo50",
       isHabilitado:(proyectoObj.habilitadoComunicadoTrabContratista == 1 && hashSeccContratistaInhabUsuario.get(69) == undefined?1:0)},
      {nombre:"Ficha RUC",divTr:"trExamTipo51",
       isHabilitado:(proyectoObj.habilitadoFichaRuc == 1 && hashSeccContratistaInhabUsuario.get(70) == undefined?1:0)},
      {nombre:"Constancia registro de tercerizadoras",divTr:"trExamTipo52",
       isHabilitado:(proyectoObj.habilitadoConstanciaTercerizadoras == 1 && hashSeccContratistaInhabUsuario.get(71) == undefined?1:0)},
      {nombre:"Contratos con empresas usuarias",divTr:"trExamTipo53",
       isHabilitado:(proyectoObj.habilitadoContratoEmpUsuarias == 1 && hashSeccContratistaInhabUsuario.get(72) == undefined?1:0)},
      {nombre:"Partida registral",divTr:"trExamTipo54",
       isHabilitado:(proyectoObj.habilitadoPartidaRegistral == 1 && hashSeccContratistaInhabUsuario.get(73) == undefined?1:0)},
      {nombre:"Asiento de la partida registral",divTr:"trExamTipo55",
       isHabilitado:(proyectoObj.habilitadoAsientoPartidaRegistral == 1 && hashSeccContratistaInhabUsuario.get(74) == undefined?1:0)},
      {nombre:"Contratos de trabajos tercerizados",divTr:"trExamTipo56",
       isHabilitado:(proyectoObj.habilitadoTrabajosTercerizados == 1 && hashSeccContratistaInhabUsuario.get(75) == undefined?1:0)},
      {nombre:"Declaración de servicios tercerizados",divTr:"trExamTipo57",
       isHabilitado:(proyectoObj.habilitadoServiciosTercerizados == 1 && hashSeccContratistaInhabUsuario.get(76) == undefined?1:0)},
      {nombre:"Informe de servicio de trabajadores",divTr:"trExamTipo58",
       isHabilitado:(proyectoObj.habilitadoServicioTrabajadores == 1 && hashSeccContratistaInhabUsuario.get(77) == undefined?1:0)},
      {nombre:"Comité/Supervisor SST",divTr:"trExamTipo59",
       isHabilitado:(proyectoObj.habilitadoComiteSupervisorSst == 1 && hashSeccContratistaInhabUsuario.get(101) == undefined?1:0)},
      {nombre:"Hoja de atención del SCTR",divTr:"trExamTipo67",
       isHabilitado:(proyectoObj.habilitadoHojaAtencionSctr == 1 && hashSeccContratistaInhabUsuario.get(115) == undefined?1:0)},
      {nombre:"Acuerdo de confidencialidad",divTr:"trExamTipo68",
       isHabilitado:(proyectoObj.habilitadoAcuerdoConfidencialidad == 1 && hashSeccContratistaInhabUsuario.get(116) == undefined?1:0)},
      {nombre:"Flujo de respuesta ante accidentes",divTr:"trExamTipo69",
       isHabilitado:(proyectoObj.habilitadoFlujoRespuestaAccidente == 1 && hashSeccContratistaInhabUsuario.get(117) == undefined?1:0)},
      {nombre:"Acuerdo de seguridad para terceros y contratistas",divTr:"trExamTipo70",
       isHabilitado:(proyectoObj.habilitadoAcuerdoSeguridadTerceros == 1 && hashSeccContratistaInhabUsuario.get(118) == undefined?1:0)},
      {nombre:"Acuerdo de seguridad para proveedores",divTr:"trExamTipo71",
       isHabilitado:(proyectoObj.habilitadoAcuerdoSeguridadProveedores == 1 && hashSeccContratistaInhabUsuario.get(119) == undefined?1:0)},
      {nombre:"Clínica (Certificación DIGESA)",divTr:"trExamTipo78",
       isHabilitado:(proyectoObj.habilitadoClinicaCertDigesa == 1 && hashSeccContratistaInhabUsuario.get(128) == undefined?1:0)},
      {nombre:"Seguro vida ley",divTr:"trExamTipo88",
       isHabilitado:(proyectoObj.habilitadoExamNivelCont88 == 1 && hashSeccContratistaInhabUsuario.get(131) == undefined?1:0)},
       {nombre:"Formatos de campo",divTr:"trExamTipo91",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont91 == 1 && hashSeccContratistaInhabUsuario.get(134) == undefined?1:0)},
       {nombre:"Declaración jurada de SST",divTr:"trExamTipo92",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont92 == 1 && hashSeccContratistaInhabUsuario.get(135) == undefined?1:0)},
       {nombre:"Registro de seguridad del contratista",divTr:"trExamTipo93",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont93 == 1 && hashSeccContratistaInhabUsuario.get(136) == undefined?1:0)},
       {nombre:"Declaración jurada para contratistas",divTr:"trExamTipo94",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont94 == 1 && hashSeccContratistaInhabUsuario.get(137) == undefined?1:0)},
       {nombre:"Licencia o permiso emitido por la AMP",divTr:"trExamTipo95",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont95 == 1 && hashSeccContratistaInhabUsuario.get(138) == undefined?1:0)},
       {nombre:"Carta de aceptación de la norma",divTr:"trExamTipo96",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont96 == 1 && hashSeccContratistaInhabUsuario.get(139) == undefined?1:0)},
       {nombre:"Póliza de responsabilidad civil de la empresa",divTr:"trExamTipo97",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont97 == 1 && hashSeccContratistaInhabUsuario.get(140) == undefined?1:0)},
       {nombre:"Formulario y control a terceras partes",divTr:"trExamTipo98",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont98 == 1 && hashSeccContratistaInhabUsuario.get(141) == undefined?1:0)},
       {nombre:"Autorización Osinergmin para combustible",divTr:"trExamTipo102",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont102 == 1 && hashSeccContratistaInhabUsuario.get(146) == undefined?1:0)},
       {nombre:"Autorización de circulación del MTC",divTr:"trExamTipo103",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont103 == 1 && hashSeccContratistaInhabUsuario.get(147) == undefined?1:0)},
       {nombre:"Ficha técnica guantes aislantes clase 0/00",divTr:"trExamTipo104",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont104 == 1 && hashSeccContratistaInhabUsuario.get(148) == undefined?1:0)},
       {nombre:"Certificado dieléctrico pértiga y manta aislante",divTr:"trExamTipo105",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont105 == 1 && hashSeccContratistaInhabUsuario.get(149) == undefined?1:0)},
       {nombre:"Ficha técnica de componentes del traje contra arco eléctrico",divTr:"trExamTipo106",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont106 == 1 && hashSeccContratistaInhabUsuario.get(150) == undefined?1:0)},
       {nombre:"Ficha técnica de botas dieléctricas",divTr:"trExamTipo107",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont107 == 1 && hashSeccContratistaInhabUsuario.get(151) == undefined?1:0)},
       {nombre:"Certificado de ensayo dieléctrico guantes clase 1–4",divTr:"trExamTipo108",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont108 == 1 && hashSeccContratistaInhabUsuario.get(152) == undefined?1:0)},
       {nombre:"Certificado de ensayo dieléctrico de banqueta aislante",divTr:"trExamTipo109",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont109 == 1 && hashSeccContratistaInhabUsuario.get(153) == undefined?1:0)},
       {nombre:"Certificado de ensayo de puesta a tierra temporal",divTr:"trExamTipo110",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont110 == 1 && hashSeccContratistaInhabUsuario.get(154) == undefined?1:0)},
       {nombre:"Constancia declaración y pago - PLAME",divTr:"trExamTipo123",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont123 == 1 && hashSeccContratistaInhabUsuario.get(167) == undefined?1:0)},
       {nombre:"Planilla electrónica R01",divTr:"trExamTipo124",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont124 == 1 && hashSeccContratistaInhabUsuario.get(168) == undefined?1:0)},
       {nombre:"Constancia de pago AFP",divTr:"trExamTipo125",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont125 == 1 && hashSeccContratistaInhabUsuario.get(169) == undefined?1:0)},
       {nombre:"Constancia depósito CTS - Mayo y Noviembre",divTr:"trExamTipo126",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont126 == 1 && hashSeccContratistaInhabUsuario.get(170) == undefined?1:0)},
       {nombre:"Constancia depósito gratificación - Julio y Diciembre",divTr:"trExamTipo127",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont127 == 1 && hashSeccContratistaInhabUsuario.get(171) == undefined?1:0)},
       {nombre:"Procedimiento de acreditación en SST para subcontratistas",divTr:"trExamTipo137",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont137 == 1 && hashSeccContratistaInhabUsuario.get(179) == undefined?1:0)},
       {nombre:"Declaración jurada - capacitación",divTr:"trExamTipo138",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont138 == 1 && hashSeccContratistaInhabUsuario.get(180) == undefined?1:0)},
       {nombre:"Constancia del centro educativo de formación",divTr:"trExamTipo139",
        isHabilitado:(proyectoObj.habilitadoExamNivelCont139 == 1 && hashSeccContratistaInhabUsuario.get(181) == undefined?1:0)},
       
      {nombre:"Sub Contratista - Documentos",divTr:"trSubContratistaDoc",
       isHabilitado:(proyectoObj.habilitadoSubContratista == 1 && hashSeccContratistaInhabUsuario.get(27) == undefined?1:0)},
      {nombre:"Equipos Moviles - Operadores",divTr:"trEquipMovilOper",
       isHabilitado:(proyectoObj.habilitadoEquipoMovilOperadores == 1 && hashSeccContratistaInhabUsuario.get(24) == undefined?1:0)},
      {nombre:"Equipos Moviles",divTr:"trEquipMovil",
       isHabilitado:(proyectoObj.habilitadoEquipoMovil == 1 && hashSeccContratistaInhabUsuario.get(24) == undefined?1:0)},
      {nombre:"Equipos Moviles - Documentacion",divTr:"trEquipMovilDoc",
       isHabilitado:(proyectoObj.habilitadoEquipoMovilDocumentos == 1 && hashSeccContratistaInhabUsuario.get(24) == undefined?1:0)},
      {nombre:"Análisis de Trabajo Seguro (ATS)",divTr:"trAnaTraSeg",
       isHabilitado:(proyectoObj.habilitadoAnalisisTrabajoSeguro == 1 && hashSeccContratistaInhabUsuario.get(48) == undefined?1:0)},
      {nombre:"Permiso de Trabajo de Alto Riesgo (PETAR)",divTr:"trPerTraAltRie",
       isHabilitado:(proyectoObj.habilitadoPermisoTrabAltoRiesgo == 1 && hashSeccContratistaInhabUsuario.get(49) == undefined?1:0)},
       
      {nombre:"Documento a nivel conductor - Licencia de conducir",divTr:"trTipoDocCond1",
       isHabilitado:(proyectoObj.habilitadoLicenciaConductor == 1 && hashSeccContratistaInhabUsuario.get(80) == undefined?1:0)},
      {nombre:"Documento a nivel conductor - Certificado de capacitación en normas de tránsito y manejo defensivo",divTr:"trTipoDocCond2",
       isHabilitado:(proyectoObj.habilitadoCertifCapTransito == 1 && hashSeccContratistaInhabUsuario.get(81) == undefined?1:0)},
      {nombre:"Documento a nivel conductor - Examen psicosensométrico",divTr:"trTipoDocCond3",
       isHabilitado:(proyectoObj.habilitadoExamenPsicosensometrico == 1 && hashSeccContratistaInhabUsuario.get(82) == undefined?1:0)},
      {nombre:"Documento a nivel conductor - Historial de manejo o récord del conductor",divTr:"trTipoDocCond4",
       isHabilitado:(proyectoObj.habilitadoHistorialManejoCond == 1 && hashSeccContratistaInhabUsuario.get(83) == undefined?1:0)},
      {nombre:"Documento a nivel conductor - Certificado de capacitación en manejo de camioneta 4x4",divTr:"trTipoDocCond5",
       isHabilitado:(proyectoObj.habilitadoCertifCapManejo4x4 == 1 && hashSeccContratistaInhabUsuario.get(84) == undefined?1:0)},
      {nombre:"Documento a nivel conductor - Certificado de operador de maquinaria",divTr:"trTipoDocCond6",
       isHabilitado:(proyectoObj.habilitadoCertifOperadorMaq == 1 && hashSeccContratistaInhabUsuario.get(104) == undefined?1:0)},
      {nombre:"Documento a nivel conductor - Certificado del curso MAPTEL Nivel I",divTr:"trTipoDocCond7",
       isHabilitado:(proyectoObj.habilitadoCertifCursoMaptelN1 == 1 && hashSeccContratistaInhabUsuario.get(112) == undefined?1:0)},
      {nombre:"Documento a nivel conductor - Curriculum Vitae",divTr:"trTipoDocCond8",
       isHabilitado:(proyectoObj.habilitadoCurriculumVitae == 1 && hashSeccContratistaInhabUsuario.get(113) == undefined?1:0)},
      {nombre:"Documento a nivel conductor - Capacitación como operador de descarga de cemento",divTr:"trTipoDocCond9",
       isHabilitado:(proyectoObj.habilitadoExamNivelCond9 == 1 && hashSeccContratistaInhabUsuario.get(165) == undefined?1:0)},
       
      {nombre:"Documento a nivel vehículo/maquinaria - Check list de ingreso",divTr:"trTipoDocVehMaq1",
       isHabilitado:(proyectoObj.habilitadoCheckListIngreso == 1 && hashSeccContratistaInhabUsuario.get(87) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Inspección técnica",divTr:"trTipoDocVehMaq2",
       isHabilitado:(proyectoObj.habilitadoInspeccionTecnica == 1 && hashSeccContratistaInhabUsuario.get(88) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Póliza contra todo riesgo",divTr:"trTipoDocVehMaq3",
       isHabilitado:(proyectoObj.habilitadoPolizaContraTodo == 1 && hashSeccContratistaInhabUsuario.get(89) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - SOAT",divTr:"trTipoDocVehMaq4",
       isHabilitado:(proyectoObj.habilitadoSoat == 1 && hashSeccContratistaInhabUsuario.get(90) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Tarjeta/Constancia de propiedad del equipo",divTr:"trTipoDocVehMaq5",
       isHabilitado:(proyectoObj.habilitadoTarjetaConstanciaPropiedadEquipo == 1 && hashSeccContratistaInhabUsuario.get(91) == undefined?1:0)},	
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de operatividad",divTr:"trTipoDocVehMaq6",
       isHabilitado:(proyectoObj.habilitadoCertificadoOperatividad == 1 && hashSeccContratistaInhabUsuario.get(92) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Programa de mantenimiento preventivo",divTr:"trTipoDocVehMaq7",
       isHabilitado:(proyectoObj.habilitadoProgMantenimientoPreventivo == 1 && hashSeccContratistaInhabUsuario.get(93) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de mantenimiento preventivo",divTr:"trTipoDocVehMaq8",
       isHabilitado:(proyectoObj.habilitadoCertifMantenimientoPreventivo == 1 && hashSeccContratistaInhabUsuario.get(94) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Permiso especial para el transporte de mercancía",divTr:"trTipoDocVehMaq9",
       isHabilitado:(proyectoObj.habilitadoPermisoEspecialTransporteMercancia == 1 && hashSeccContratistaInhabUsuario.get(95) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Póliza TREC",divTr:"trTipoDocVehMaq10",
       isHabilitado:(proyectoObj.habilitadoPolizaTrec == 1 && hashSeccContratistaInhabUsuario.get(96) == undefined?1:0)},	
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de opacidad",divTr:"trTipoDocVehMaq11",
       isHabilitado:(proyectoObj.habilitadoCertificadoOpacidad == 1 && hashSeccContratistaInhabUsuario.get(97) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Manual del equipo/Ficha técnica",divTr:"trTipoDocVehMaq12",
       isHabilitado:(proyectoObj.habilitadoManualEquipoFichaTecnica == 1 && hashSeccContratistaInhabUsuario.get(98) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado DGH - Osinergmin",divTr:"trTipoDocVehMaq13",
       isHabilitado:(proyectoObj.habilitadoCertificadoDghOsinergmin == 1 && hashSeccContratistaInhabUsuario.get(99) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de cubicación y hermeticidad",divTr:"trTipoDocVehMaq14",
       isHabilitado:(proyectoObj.habilitadoCertifCubicacionHermeticidad == 1 && hashSeccContratistaInhabUsuario.get(100) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Tarjeta de circulación emitida por el MTC",divTr:"trTipoDocVehMaq15",
       isHabilitado:(proyectoObj.habilitadoTarjetaCirculacionMtc == 1 && hashSeccContratistaInhabUsuario.get(114) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de gravamen vehicular",divTr:"trTipoDocVehMaq16",
       isHabilitado:(proyectoObj.habilitadoCertifGravamenVehicular == 1 && hashSeccContratistaInhabUsuario.get(126) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Verificación - GPS vehicular",divTr:"trTipoDocVehMaq17",
       isHabilitado:(proyectoObj.habilitadoVerifGpsVehicular == 1 && hashSeccContratistaInhabUsuario.get(127) == undefined?1:0)},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de hermeticidad de la bombona",divTr:"trTipoDocVehMaq18",
       isHabilitado:(proyectoObj.habilitadoExamNivelVehMaq18 == 1 && hashSeccContratistaInhabUsuario.get(166) == undefined?1:0)},
       
      {nombre:"Documento a nivel equipo/herramienta - Certificado de operatividad",divTr:"trTipoDocEquHerr1",
       isHabilitado:(proyectoObj.habilitadoCertificadoOperatividadEquHerr == 1 && hashSeccContratistaInhabUsuario.get(107) == undefined?1:0)},
      {nombre:"Documento a nivel equipo/herramienta - Inspección",divTr:"trTipoDocEquHerr2",
       isHabilitado:(proyectoObj.habilitadoInspeccionEquHerr == 1 && hashSeccContratistaInhabUsuario.get(108) == undefined?1:0)}
   ];

   $("#tblEvalTotalDocProy tbody").html("");

   var selTipoEvaluacionTotal = crearSelectOneMenuOblig("selTipoEvaluacionTotal",
      "verIconoAcuerdoEval(this)",listEvaluacionTotal,"","id","nombre");

   listEvaluar.forEach(function(val,index){
      if(val.isHabilitado == 1){
         $("#tblEvalTotalDocProy tbody").append(
            "<tr id='"+val.divTr+"'>" +
               "<td class='info' colspan='5' style='background:#D6E6E5F7;'>"+val.nombre+"</td>" +
            "</tr>");
      }
   });

   $("#btnGuardarEvalsTotalProyecto").hide();

   var listEstadoFinal = [];
   var estadosId = $("#selEstadoDocEvalTotal").val();

   estadosId.forEach(function(val){
      listEstadoFinal.push(parseInt(val));
   });

   var dataParamActividades={
      id: proyectoObj.id,listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio: ($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin: ($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())
   };

   var dataParamExamenes={
      id: (proyectoObj.postulante.contratista.id),proyectoActual: {id: proyectoObj.id},examen: {tipo: {id: null}},
      perfil: {id: null},listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio: ($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin: ($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())
   };

   var dataParamSubContratista={
      contratistaId: (proyectoObj.postulante.contratista.id),listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio: ($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin: ($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())
   };

   var dataParamHojasVida={
      tipo: {id: 4},listTrabAsignadosActivosId: proyectoObj.listTrabAsignadosActivosIdAux,
      listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio: ($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin: ($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())
   };

   var dataParamEquiposMoviles={
      id: null,proyectoId: proyectoObj.id,listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio: ($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin: ($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())
   };

   var dataParamAts={
      contratistaId: (proyectoObj.postulante.contratista.id),proyectoId: proyectoObj.id,
      listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio: ($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin: ($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())
   };

   var dataParamPetar={
      contratistaId: (proyectoObj.postulante.contratista.id),proyectoId: proyectoObj.id,
      listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio: ($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin: ($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())
   };
   
   var dataParamTipoDocCond={
      contratistaId: (proyectoObj.postulante.contratista.id),listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio: ($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin: ($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())   
   };
   
   var dataParamTipoDocVehMaq={
      contratistaId: (proyectoObj.postulante.contratista.id),listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio: ($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin: ($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())   
   };
   
   var dataParamTipoDocEquHerr={
      contratistaId:(proyectoObj.postulante.contratista.id),listEstadoId:(listEstadoFinal.length == 0?null:listEstadoFinal),
      fechaCargaDocInicio:($("#fechaInicioCargaEvaDocPro").val() == ""?null:$("#fechaInicioCargaEvaDocPro").val()),
      fechaCargaDocFin:($("#fechaFinCargaEvaDocPro").val() == ""?null:$("#fechaFinCargaEvaDocPro").val())   
   };
    
   cargarListConexionesVisorEvidencia(1);

   callAjaxPostSimple(URL+'/contratista/proyecto/actividades/revision',dataParamActividades,1,function(data){
    listFullActividades = data.list;
    listFullActividades.forEach(agregarFilaActividadesVersionDos);

    callAjaxPostSimple(URL+'/contratista/examenes/revision',dataParamExamenes,0,function(data){
     if(data.trabajadores.length != 0){
	     mapTrabContratistaVerfIa = new Map();
	 
         data.trabajadores.forEach(function(val){
             mapTrabContratistaVerfIa.set(val.id,val);
         });
     } 

     listFullExamenes = data.examenes;
     // P-A00033: la pantalla del revisor avisa quien llama, para que el enlace "Verificacion DNI" de los tipos nuevos solo salga aqui.
     listFullExamenes.forEach(function(val){ agregarFilaExamenesVersionDos(val,"revisor"); });
     // P73: pintar los badges de evaluacion con IA de los documentos de examen (batch). Definido en evaluacion_ia.js.
     if(typeof cargarBadgesEvaluacionIaExamen === "function"){ cargarBadgesEvaluacionIaExamen(listFullExamenes); }

     callAjaxPostSimple(URL+"/contratista/subcontratista/documento/revision",dataParamSubContratista,0,function(data){
      listFullSubContratistas = data.listDocumentosSubcontratista;
      // listFullSubContratistas.forEach(agregarFilaSubContratista);
      listFullSubContratistas.forEach(agregarFilaSubContratistaVersionDos);

      callAjaxPostSimple(URL+"/contratista/trabajador/hojavidas/proyecto",dataParamHojasVida,0,function(data){
       listFullHojasVida = data.list;
       listFullHojasVida.forEach(agregarFilaHojaVidaVersionDos);
       // Partida 36: pintar los badges de evaluacion con IA (batch). Definido en evaluacion_ia.js.
       if(typeof cargarBadgesEvaluacionIa === "function"){ cargarBadgesEvaluacionIa(listFullHojasVida); }

       callAjaxPostSimple(URL+"/contratista/analisis_trabajo_seguro/evaluacion",dataParamAts,0,function(data){
        listFullAnalisisTrabajoSeguro = data.listAnalisisTraSeg;
        // listFullAnalisisTrabajoSeguro.forEach(agregarFilaAnalisisTrabajoSeguro);
        listFullAnalisisTrabajoSeguro.forEach(agregarFilaAnalisisTrabajoSeguroVersionDos);

        callAjaxPostSimple(URL+"/contratista/permiso_trabajo_alto_riesgo/evaluacion",dataParamPetar,0,function(data){
         listFullPermisoTraAltRie = data.listPermisoTraAltRie;
         // listFullPermisoTraAltRie.forEach(agregarFilaPermisoTrabajoAltoRiesgo);
         listFullPermisoTraAltRie.forEach(agregarFilaPermisoTrabajoAltoRiesgoVersionDos);
         
         callAjaxPostSimple(URL+"/contratista/documento_nivel_conductor/evaluacion",dataParamTipoDocCond,0,function(data){
          listFullDocNivelCond = data.listDocumentosNivelConductor;
          // listFullDocNivelCond.forEach(agregarFilaDocumentoNivelConductor);
          listFullDocNivelCond.forEach(agregarFilaDocumentoNivelConductorVersionDos);
          
          callAjaxPostSimple(URL+"/contratista/documento_nivel_vehiculo_maquinaria/evaluacion",dataParamTipoDocVehMaq,0,function(data){
           listFullDocNivelVehMaq = data.listDocumentosNivelVehiculoMaquinaria;
           // listFullDocNivelVehMaq.forEach(agregarFilaDocumentoNivelVehiculoMaquinaria);
           listFullDocNivelVehMaq.forEach(agregarFilaDocumentoNivelVehiculoMaquinariaVersionDos);
           
           callAjaxPostSimple(URL+"/contratista/documento_nivel_equipo_herramienta/evaluacion",dataParamTipoDocEquHerr,0,function(data){
            listFullDocNivelEquHerr = data.listDocumentosNivelEquipoHerramienta;
            // listFullDocNivelEquHerr.forEach(agregarFilaDocumentoNivelEquipoHerramienta);
            listFullDocNivelEquHerr.forEach(agregarFilaDocumentoNivelEquipoHerramientaVersionDos);

            callAjaxPostSimple(URL+"/contratista/equipomovil/revision",dataParamEquiposMoviles,0,function(data){
             listFullOperadorEquipo = data.operadoresEquipo;
             listFullOperadorEquipo.forEach(function(val,index){
                // agregarFilaEquipoMovil(1,val);
                 agregarFilaEquipoMovilVersionDos(1,val);
             });

            listFullEquiposMovilMantenimiento = data.listEquiposMantenimiento;
            listFullEquiposMovilMantenimiento.forEach(function(val,index){
               // agregarFilaEquipoMovil(2,val,2);
                agregarFilaEquipoMovilVersionDos(2,val,2);
            });

            listFullEquiposMovilCertificado = data.listEquiposCertificado;
            listFullEquiposMovilCertificado.forEach(function(val,index){
               // agregarFilaEquipoMovil(2,val,1);
                agregarFilaEquipoMovilVersionDos(2,val,1);
            });

            listFullDocumentosEquipIzaje = data.documentos;
            listFullDocumentosEquipIzaje.forEach(function(val,index){
               // agregarFilaEquipoMovil(3,val);
                agregarFilaEquipoMovilVersionDos(3,val);
            });

            goheadfixedY("#tblEvalTotalDocProy","#wrapEvalTotalDocProy");
            
            if([1,2].includes(proyectoObj.estado.id)){
        	$("#btnGuardarEvalsTotalProyecto").show();
            }
            
            $.unblockUI();
            });
           });
          });
         });
        });
       });
      });
     });
    });
   });
}

function volverDivProyectosResumen() {
    $("#divListaTabs").show();
    $("#tabResumenEvaDocProyecto .container-fluid").hide();
    $("#divEvaDocProyectoFull").show();
    $("#tabResumenEvaDocProyecto h2").html("<label>Resumen - Evaluacion Documentos Proyecto</label>");
    $("#divConfigImpacto").hide();
    $("#divListClasif").hide();

    if (hasEvalActualizadaProy == 1 || hasDocEliminadoProy == 1) {
//        crearFiltroEvaDocProyecto(valoresFiltroEvaDocProyecto);
        cargarEvaluacionDocProyecto();
    }
}

var listOpcConsolidadoEvalDocProy = [
    {id:1,nombre:"Personal habilitado por empresa"},{id:2,nombre:"Habilitación del personal por vencerse - anticipación 15 días"},
    {id:3,nombre:"N° de documentos aprobados por usuarios"},{id:4,nombre:"N° de documentos revisados en total por empresa"},
    {id:5,nombre:"N° documentos registrados/evaluados - Personal externo"},{id:6,nombre:"Cantidad documentos registrados - proyecto"},
    {id:7,nombre:"Observaciones - proyectos en curso"},{id:8,nombre:"Estadísticas contratistas SST"},
    {id:9,nombre:"Documentos a nivel trabajador contratista registrados"}
];

var listTiposExamenContratistaEvalDocProy = [],listTipoNotaEvalDocProy = [],listTiposExamenContratistaAuxTotalEvalDocProy = [],listTipoNotaAuxTotalEvalDocProy = [];

function ocultarConsolidadosExcelEvalDocProy(){
   $("#modalConsolidadosExcelEvalDocProy").modal("hide");
}

function verConsolidadosExcelEvalDocProy(){
    $("#modalConsolidadosExcelEvalDocProy").remove();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),listTipoExamenContNoPermitidosIdAux:listTipoExamenNoPermitidoUsuario
    };

    callAjaxPostSimpleVersionDos(1,URL+'/contratista/vista_documentos/consolidado_excel/valores_previos',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
            listTiposExamenContratistaEvalDocProy = data.listTiposExamenContratista;listTipoNotaEvalDocProy = data.listTipoNota;
            listTiposExamenContratistaAuxTotalEvalDocProy = [];listTipoNotaAuxTotalEvalDocProy = [];

            listTiposExamenContratistaEvalDocProy.forEach(function(val){
                listTiposExamenContratistaAuxTotalEvalDocProy.push(val.id);
            });

            listTipoNotaEvalDocProy.forEach(function(val){
                listTipoNotaAuxTotalEvalDocProy.push(val.id);
            });

            var selOpcConExcelEvalDocProy = crearSelectOneMenuOblig("selOpcConExcelEvalDocProy",
       "verAcordeConsolidadosExcelEvalDocProy()",listOpcConsolidadoEvalDocProy,"1","id","nombre");

            var contenido = "";

            var listContenido=[
                {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",inputForm:selOpcConExcelEvalDocProy,divContainer:"divSelConExcelEvalDocProy"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",
                 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConsolidadosExcelEvalDocProy()'>" +
                           "<i class='fa fa-times'></i> Cancelar" +
                       "</button>",
                 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='descargarConsolidadosExcelEvalDocProy()'>" +
                               "<i class='fa fa-download'></i> Descargar" +
                           "</button>"}
            ];

            listContenido.forEach(function(val){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var modalOptions = {
                id:"modalConsolidadosExcelEvalDocProy",nombre:"<i class='fa fa-filter'></i> Seleccionar - Consolidado excel",
                contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
            };

            crearModalPrincipalUsuario(modalOptions,function(){},true,true);

            verAcordeConsolidadosExcelEvalDocProy();
        }else{
            console.log("NOPNPO");
        }
    });
}

function verAcordeConsolidadosExcelEvalDocProy(){
   $(".atributo-consolidadoExcelEvalDocProy").remove(); 
   var listContenidoDivSelConExcelEvalDocProy = [];
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelEvalDocProy").val());
   
    if([3,4,5,6,7,9].includes(opcConsolidadoExcel)){
        listContenidoDivSelConExcelEvalDocProy=[
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",inputForm:"<input id='fechaInicioConsolidadoInd' type='date' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta", inputForm:"<input id='fechaFinConsolidadoInd' type='date' class='form-control'>"}
        ];
    }
   
    if(opcConsolidadoExcel == 8){
      var hoy = new Date();
      var listAnio = [];
       
      for(var i = -2;i < 2;i++){
         listAnio.push({id:parseInt(hoy.getFullYear())+i,nombre:parseInt(hoy.getFullYear())+i})
      }
       
      var selAnioConsEstadisticas = crearSelectOneMenuOblig("selAnioConsEstadisticas","",
	 listAnio,"","id","nombre");
       
      var inputCalculo = 
	 "<div style='display:flex;justify-content:space-evenly'>" +
            "<div>" +
               "<input type='radio' name='hhsel' id='1mill' checked><label for='1mill'>1 000 000 HH</label>" +
            "</div>" +
            "<div>" +
               "<input type='radio' name='hhsel' id='200mil'><label for='200mil'>200 000 HH</label>" +
            "</div>" +
         "</div>"
      
      listContenidoDivSelConExcelEvalDocProy.push(
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Año:",inputForm:selAnioConsEstadisticas},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Realizar cálculos según",inputForm:inputCalculo});
    }else if(opcConsolidadoExcel == 9){
        listContenidoDivSelConExcelEvalDocProy.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});

        if(listTiposExamenContratistaEvalDocProy.length > 0){
            listContenidoDivSelConExcelEvalDocProy.push({sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Tipo",
                 inputForm:"<a class='efectoLink' onclick='verCheckListTiposExamenTrabContExcelEvaDocProy()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
                {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTiposExamenTrabContExcelEvaDocProy"});
        }else{
            listContenidoDivSelConExcelEvalDocProy.push({sugerencia:"",label:"Tipo",inputForm:"<label>*No tiene valores asociados a su usuario.</label>"});
        }

        listContenidoDivSelConExcelEvalDocProy.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Estado de la evaluación",
                    inputForm:"<a class='efectoLink' onclick='verCheckListEstadosEvaluacionExcelEvaDocProy()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
                {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelEstadosEvaluacionExcelEvaDocProy"});
    }
   
   if([7,8].includes(opcConsolidadoExcel)){
      listContenidoDivSelConExcelEvalDocProy.push(
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",label:"Contratistas",inputForm:"",divContainer:"divContratistasEvalDocProy"});
   }
   
   var contenido = "";
   
   listContenidoDivSelConExcelEvalDocProy.forEach(function(val){
      val.clase = "atributo-consolidadoExcelEvalDocProy";
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
    $("#divSelConExcelEvalDocProy").parent().after(contenido);
   
    if([3,4,5,6,7,9].includes(opcConsolidadoExcel)){
        var hoy = getSession("fechaHoyOrdenInversoTexto");
        var inicioDias = ([5,6,7].includes(opcConsolidadoExcel)?-30:-365);
       
        $("#fechaInicioConsolidadoInd").val(sumaFechaDias(inicioDias,hoy));$("#fechaFinConsolidadoInd").val(hoy);
    }
   
   if(opcConsolidadoExcel == 7){
      crearSelectOneMenuObligMultipleCompleto("selMulContratistasEvalDocProy","",listContratistaEvaDocPro,
         "id","nombre","#divContratistasEvalDocProy","Todos");   
   }else if(opcConsolidadoExcel == 8){
      crearSelectOneMenuObligMultipleCompleto("selMulContratistasEvalDocProy","",
         listContratistaEvaDocPro,"id","nombre","#divContratistasEvalDocProy","Seleccionar...",1);
    }else if(opcConsolidadoExcel == 9){
        if(listTiposExamenContratistaEvalDocProy.length > 0){
            crearCheckListGeneral("modalConsolidadosExcelEvalDocProy","Tipos","TipoExamTrabContExcelEvaDocProySelec",
                listTiposExamenContratistaEvalDocProy,"TiposExamenTrabContExcelEvaDocProy",ocultarCheckListTiposExamenTrabContExcelEvaDocProy);
        }

        crearCheckListGeneral("modalConsolidadosExcelEvalDocProy","Estados de la evaluación","EstEvaluacionExcelEvaDocProySelec",
            listTipoNotaEvalDocProy,"EstadosEvaluacionExcelEvaDocProy",ocultarCheckListEstadosEvaluacionExcelEvaDocProy);
    }
}

function ocultarCheckListTiposExamenTrabContExcelEvaDocProy(){
    var textTipoExamTrabContExcelEvaDocProySelec = "";

    listTiposExamenContratistaEvalDocProy.forEach(function(val,index){
        var isSeleccionado = ($("#checkAsignadoTipoExamTrabContExcelEvaDocProySelec"+val.id).prop("checked")?1:0);

        if(isSeleccionado == 1){
            textTipoExamTrabContExcelEvaDocProySelec += (textTipoExamTrabContExcelEvaDocProySelec.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textTipoExamTrabContExcelEvaDocProySelec = (textTipoExamTrabContExcelEvaDocProySelec.length == 0?"Todos":textTipoExamTrabContExcelEvaDocProySelec);

    $("#divSelTiposExamenTrabContExcelEvaDocProy").html(textTipoExamTrabContExcelEvaDocProySelec);

    $("#modalCheckListTipoExamTrabContExcelEvaDocProySelec").modal("hide");$("#modalConsolidadosExcelEvalDocProy").modal("show");
}

function verCheckListTiposExamenTrabContExcelEvaDocProy(){
    $("#modalCheckListTipoExamTrabContExcelEvaDocProySelec").modal("show");$("#modalConsolidadosExcelEvalDocProy").modal("hide");
}

function ocultarCheckListEstadosEvaluacionExcelEvaDocProy(){
    var textEstEvaluacionExcelEvaDocProySelec = "";

    listTipoNotaEvalDocProy.forEach(function(val,index){
        var isSeleccionado = ($("#checkAsignadoEstEvaluacionExcelEvaDocProySelec"+val.id).prop("checked")?1:0);

        if(isSeleccionado == 1){
            textEstEvaluacionExcelEvaDocProySelec += (textEstEvaluacionExcelEvaDocProySelec.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textEstEvaluacionExcelEvaDocProySelec = (textEstEvaluacionExcelEvaDocProySelec.length == 0?"Todos":textEstEvaluacionExcelEvaDocProySelec);

    $("#divSelEstadosEvaluacionExcelEvaDocProy").html(textEstEvaluacionExcelEvaDocProySelec);

    $("#modalCheckListEstEvaluacionExcelEvaDocProySelec").modal("hide");$("#modalConsolidadosExcelEvalDocProy").modal("show");
}

function verCheckListEstadosEvaluacionExcelEvaDocProy(){
    $("#modalCheckListEstEvaluacionExcelEvaDocProySelec").modal("show");$("#modalConsolidadosExcelEvalDocProy").modal("hide");
}

function descargarConsolidadosExcelEvalDocProy(){
    var campoVacio = true;
   
    var opcConsolidadoExcel = parseInt($("#selOpcConExcelEvalDocProy").val());
    var fechaInicioConsolidado = $("#fechaInicioConsolidadoInd").val();
    var fechaFinConsolidado = $("#fechaFinConsolidadoInd").val();
    
    if([3,4,5,6,7,9].includes(opcConsolidadoExcel)){
        if(fechaInicioConsolidado.length == 0 || fechaFinConsolidado.length == 0){
	        campoVacio = false;mensajeUx = "<label>Debe ingresar la fecha inicio y la fecha fin.</label>";
        }else if(opcConsolidadoExcel == 9 && listTiposExamenContratistaEvalDocProy.length == 0){
            campoVacio = false;mensajeUx = "<label>No tiene valores asociados a su usuario.</label>";
        }
    }

    var listTiposExamContExcelSeleccionados = [],listTipoNotaExcelSeleccionados = [];

    if(opcConsolidadoExcel == 9 && listTiposExamenContratistaEvalDocProy.length > 0){
        listTiposExamenContratistaEvalDocProy.forEach(function(val){
            var isSeleccionado = ($("#checkAsignadoTipoExamTrabContExcelEvaDocProySelec"+val.id).prop("checked")?1:0);

            if(isSeleccionado == 1){
                listTiposExamContExcelSeleccionados.push(val.id);
            }
        });

        listTipoNotaEvalDocProy.forEach(function(val){
            var isSeleccionado = ($("#checkAsignadoEstEvaluacionExcelEvaDocProySelec"+val.id).prop("checked")?1:0);

            if(isSeleccionado == 1){
                listTipoNotaExcelSeleccionados.push(val.id);
            }
        });
    }
    
    if(campoVacio){
      var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
      var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);
   
      if([1,2,3,4,5].includes(opcConsolidadoExcel)){
         window.open(URL+"/contratista/proyecto/excel/lista/consolidado?" +
            "empresaId="+getSession("gestopcompanyid")+"&opcionSelectLista="+opcConsolidadoExcel +
            "&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado +
            "&fechaInicioConsolidadoNormal="+fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText);
      }else if(opcConsolidadoExcel == 6){
         window.open(URL+"/contratista/proyecto/excel/consolidado_cantidad_documentos_evaluacion?" +
	    "empresaId="+getSession("gestopcompanyid")+"&fechaInicioConsolidado="+fechaInicioConsolidado +
	    "&fechaFinConsolidado="+fechaFinConsolidado+"&fechaInicioConsolidadoNormal="+fechaInicioConText +
	    "&fechaFinConsolidadoNormal="+fechaFinConText+"&tipoConsolidadoId="+2);
      }else if(opcConsolidadoExcel == 7){
	 var listContratistasId = [];
	 var contratistasId = $("#selMulContratistasEvalDocProy").val();

	 if(contratistasId != null){
	    contratistasId.forEach(function(val){
	       listContratistasId.push(parseInt(val));
	    });
	 }

	 window.open(URL+"/contratista/proyecto/excel/consolidado_observaciones?" +
	    "empresaId="+getSession("gestopcompanyid")+"&fechaInicioConsolidado="+fechaInicioConsolidado +
	    "&fechaFinConsolidado="+fechaFinConsolidado+"&fechaInicioConsolidadoNormal="+fechaInicioConText +
	    "&fechaFinConsolidadoNormal="+fechaFinConText +
	    "&listContratistasId="+(listContratistasId.length == 0?"-1":listContratistasId)); 
      }else if(opcConsolidadoExcel == 8){
	 var anioSel = $("#selAnioConsEstadisticas").val();
	 var contratistaSel = $("#selMulContratistasEvalDocProy").val()[0];
	 var hhSel,urlRestante = "",radioButtonsGroup = $('input[name="hhsel"]');
	 
	 for(var i = 0;i < radioButtonsGroup.length;i++){
	    if(radioButtonsGroup[i].checked){
	       hhSel = (i == 0?1000000:200000);
	       break;
	    }
         }
	 
	 if(contratistaSel == undefined){
	    window.open(URL+"/contratista/examenes/consolidado_estadisticas/excel?anioSel="+anioSel + 
               "&idCompany="+getSession("gestopcompanyid")+"&hhSel="+hhSel);
	 }else{
	    window.open(URL+"/contratista/examenes/reporte_estadisticas/excel?id="+contratistaSel + 
               "&examenTipoId=16&anioSel="+anioSel+"&idCompany="+getSession("gestopcompanyid")+"&hhSel="+hhSel);
	 }
        }else if(opcConsolidadoExcel == 9){
            window.open(URL+"/contratista/proyecto/excel/lista/consolidado?"+"empresaId="+getSession("gestopcompanyid")+"&opcionSelectLista="+opcConsolidadoExcel +
                "&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado+"&fechaInicioConsolidadoNormal="+fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText +
                "&listTiposExamContBuscadorId="+(listTiposExamContExcelSeleccionados.length == 0?listTiposExamenContratistaAuxTotalEvalDocProy:listTiposExamContExcelSeleccionados) +
                "&listTipoNotaBuscadorId="+(listTipoNotaExcelSeleccionados.length == 0?listTipoNotaAuxTotalEvalDocProy:listTipoNotaExcelSeleccionados));
        }
    }else{
      $("#modalConsolidadosExcelEvalDocProy").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionFiltroExcel");
      
      $("#modalMensajeUxValidacionFiltroExcel").on("hidden.bs.modal",function(){
         $("#modalConsolidadosExcelEvalDocProy").modal("show");
      });
   }
}

var respEvalDocId,respEvalDocObj;
var banderaEdicionRespEvalDoc = false;
var listFullResponsablesEvalDoc = [],listUserRevisarDocumentos = [];

function regresarResponsableEvaluacionDocumento(){
   $("#modalResponsablesEvaluacionDoc").modal("hide");
}

function verResponsableEvaluacionDocumento(){
   $("#modalResponsablesEvaluacionDoc").remove();
   
   var btnVolverPrincipal = "<button id='btnVolverPrincipalRespEvalDoc' class='btn btn-info' title='Regresar a la tabla anterior.' " +
                                    "onclick='regresarResponsableEvaluacionDocumento()'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-user fa-2x'></i> <i class='fa fa-list-alt'></i>" +
      "</button>";
         
   var btnVolver = "<button id='btnVolverRespEvalDoc' class='btn btn-success' style='margin-left:5px' " +
                           "title='Deshacer las acciones hechas en el registro.' onclick='cancelarResponsableEvaluacionDocumento()'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var btnNuevo = "<button id='btnNuevoRespEvalDoc' type='button' class='btn btn-success' style='margin-left:5px' " +
                          "title='Registrar una nuevo enlace asociado a un examen contratista.' onclick='nuevoResponsableEvaluacionDocumento()'>" +
         "<i class='fa fa-file-o fa-2x'></i>" +
      "</button>";
   
   var btnGuardar = "<button id='btnGuardarRespEvalDoc' class='btn btn-success' style='margin-left:5px' " +
                            "title='Guardar el enlace asociado a un examen contratista ingresado/modificado.' onclick='guardarResponsableEvaluacionDocumento()'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var btnEliminar = "<button id='btnEliminarRespEvalDoc' type='button' class='btn btn-danger' style='margin-left:5px' " +
                             "title='Eliminar el enlace asociado a un examen contratista seleccionado.' onclick='eliminarResponsableEvaluacionDocumento()'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>"

   var listModal={
      id:"modalResponsablesEvaluacionDoc",maxWidth:"70%",
      nombre:"<i class='fa fa-user'></i> Responsable(s) evaluación documento",
      contenido:
	  btnVolverPrincipal+btnVolver+btnNuevo+btnGuardar+btnEliminar +
         "<div class='wrapper' id='wrapRespEvalDoc'>" +
            "<table id='tblRespEvalDoc' class='table table-striped table-bordered table-hover table-fixed'>" +
               "<thead>" +
                  "<tr>" +
                     "<td class='tb-acc' style='width:50px'>N°</td>" +
                     "<td class='tb-acc' style='width:300px'>Correo</td>" +
                     "<td class='tb-acc' style='width:200px'>Asociado al usuario</td>" +
                     "<td class='tb-acc' style='width:150px'>Registrado el</td>" +
                     "<td class='tb-acc' style='width:150px'>Modificación el</td>" +
                  "</tr>" +
               "</thead>" +
               "<tbody></tbody>" +
            "</table>" +
         "</div>"
   };

   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapRespEvalDoc",210);    
   cargarResponsableEvaluacionDocumento();
}

function cargarResponsableEvaluacionDocumento(){
   $("#btnVolverPrincipalRespEvalDoc").show();$("#btnVolverRespEvalDoc").hide();$("#btnNuevoRespEvalDoc").show();
   $("#btnGuardarRespEvalDoc").hide();$("#btnEliminarRespEvalDoc").hide();

   var dataParam={
      empresaId:parseInt(getSession("gestopcompanyid"))
   };

   callAjaxPost(URL+'/contratista/vista_documentos/responsables',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         banderaEdicionRespEvalDoc = false;
         listFullResponsablesEvalDoc = data.listFullResponsablesEvalDoc;listUserRevisarDocumentos = data.listUserRevisarDocumentos;

         $("#tblRespEvalDoc tbody tr").remove();

         listFullResponsablesEvalDoc.forEach(function (val, index) {
            var creacionTexto = val.fechaCreacionTexto +
               (val.usuarioCreacion.nombre.length == 0?"":"<br>(por "+val.usuarioCreacion.nombre+")");

            var modificacionTexto = val.fechaModificacionTexto +
               (val.usuarioModificacion.nombre.length == 0?"":"<br>(por "+val.usuarioModificacion.nombre+")");

            $("#tblRespEvalDoc tbody").append(
               "<tr id='trRespEvalDoc"+val.id+"' onclick='editarResponsableEvaluacionDocumento("+index+")'>" +
                  "<td id='tdOrdenEnlExaCon"+val.id+"'>"+(index+1)+"</td>" +
                  "<td id='tdCorreoRespEvalDoc"+val.id+"'>"+val.correo+"</td>" +
                  "<td id='tdUsuarioAsocRespEvalDoc"+val.id+"'>"+val.usuarioRevDoc.nombre+"</td>" +
                  "<td id='tdFechaActRespEvalDoc"+val.id+"'>"+creacionTexto+"</td>" +
                  "<td id='tdFechaModRespEvalDoc"+val.id+"'>"+modificacionTexto+"</td>" +
               "</tr>");
         });

         goheadfixedY("#tblRespEvalDoc","#wrapRespEvalDoc");
         formatoCeldaSombreableTabla(true,"tblRespEvalDoc");
      }else{
         console.log("NOPNPO");
      }
   });
}

function cancelarResponsableEvaluacionDocumento(){
   cargarResponsableEvaluacionDocumento();
}

function editarResponsableEvaluacionDocumento(pindex){
   if(!banderaEdicionRespEvalDoc){
      formatoCeldaSombreableTabla(false,"tblRespEvalDoc");

      respEvalDocId = listFullResponsablesEvalDoc[pindex].id;
      respEvalDocObj = listFullResponsablesEvalDoc[pindex];

      $("#trRespEvalDoc"+respEvalDocId).addClass("fila-edicion");

      $("#tdCorreoRespEvalDoc"+respEvalDocId).html("<input type='text' id='inputCorreoRespEvalDoc' class='form-control'>");
      $("#inputCorreoRespEvalDoc").val(respEvalDocObj.correo);
      
      var selUsuarioRevDoc = crearSelectOneMenu("selUsuarioRevDoc","",
         listUserRevisarDocumentos,respEvalDocObj.usuarioRevDoc.usuarioId,"usuarioId","userName");
      
      $("#tdUsuarioAsocRespEvalDoc"+respEvalDocId).html(selUsuarioRevDoc);

      $("#tdFechaActRespEvalDoc"+respEvalDocId).html("<label>*Automático</label>");

      $("#tdFechaModRespEvalDoc"+respEvalDocId).html("<label>*Automático</label>");

      banderaEdicionRespEvalDoc = true;

      $("#btnVolverPrincipalRespEvalDoc").hide();$("#btnVolverRespEvalDoc").show();$("#btnNuevoRespEvalDoc").hide();
      $("#btnGuardarRespEvalDoc").show();$("#btnEliminarRespEvalDoc").show();
   }
}

function nuevoResponsableEvaluacionDocumento(){
   if(!banderaEdicionRespEvalDoc){
      formatoCeldaSombreableTabla(false,"tblRespEvalDoc");
      respEvalDocObj = {id: 0};respEvalDocId = 0;
      
      var selUsuarioRevDoc = crearSelectOneMenu("selUsuarioRevDoc","",
	 listUserRevisarDocumentos,"","usuarioId","userName");

      $("#tblRespEvalDoc tbody").prepend(
         "<tr>" +
            "<td>...</td>" +
            "<td>"+"<input type='text' id='inputCorreoRespEvalDoc' class='form-control'>"+"</td>" +
            "<td>"+selUsuarioRevDoc+"</td>" +
            "<td><label>*Automático</label></td>" +
            "<td><label>*Automático</label></td>" +
         "</tr>");

      $("#btnVolverPrincipalRespEvalDoc").hide();$("#btnVolverRespEvalDoc").show();$("#btnNuevoRespEvalDoc").hide();
      $("#btnGuardarRespEvalDoc").show();$("#btnEliminarRespEvalDoc").hide();

      banderaEdicionRespEvalDoc = true;
   }else{
      alert("Guarde primero.");
   }
}

function guardarResponsableEvaluacionDocumento(){
   var campoVacio = true;

   var correo = $("#inputCorreoRespEvalDoc").val();
   var usuarioId = $("#selUsuarioRevDoc").val();

   if(correo.length == 0){
      campoVacio = false;
   }

   if(campoVacio){
      var dataParam={
         id:respEvalDocId,correo:correo,empresaId:parseInt(getSession("gestopcompanyid")),
         usuarioRevDoc:{usuarioId:usuarioId}
      };

      callAjaxPost(URL+'/contratista/vista_documentos/responsables/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               $("#modalResponsablesEvaluacionDoc").modal("hide");

               mensajeUx = "<label>El responsable fue registrado con éxito.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarVistaDocRespEvalDoc");

               $("#modalMensajeUxActualizarVistaDocRespEvalDoc").on("hidden.bs.modal",function(){
                  $("#modalResponsablesEvaluacionDoc").modal("show");
                  cargarResponsableEvaluacionDocumento();
               });

               break;

            default:
               console.log("Ocurrió un error al guardar el responsable!");
         }
      });
   }else{
      $("#modalResponsablesEvaluacionDoc").modal("hide");
      mensajeUx = "<label>Debe completar todos los campos activos.</label>";
      mensajesUx(mensajeUx,2,"","ValidacionVistaDocRespEvalDoc");

      $("#modalMensajeUxValidacionVistaDocRespEvalDoc").on("hidden.bs.modal",function(){
         $("#modalResponsablesEvaluacionDoc").modal("show");
      });
   }
}

function eliminarResponsableEvaluacionDocumento(){
   $("#modalResponsablesEvaluacionDoc").modal("hide");

   mensajeUx = "<label>¿Está seguro de eliminar al responsable seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","ConfRespEvalDoc");

   $("#btnDevolverValorConfRespEvalDoc").on("click",function(){
      var dataParam={
         id:respEvalDocId
      };

      callAjaxPost(URL+'/contratista/vista_documentos/responsables/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx = "<label>El responsable seleccionado se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarVistaDocRespEvalDoc");

               $("#modalMensajeUxActualizarVistaDocRespEvalDoc").on("hidden.bs.modal",function(){
                  $("#modalResponsablesEvaluacionDoc").modal("show");
                  cargarResponsableEvaluacionDocumento();
               });
                    
               break;

            default:
               alert("Ocurrió un error al eliminar al responsable!");
         }
      });
   });

   $("#btnRegresarPrevioConfRespEvalDoc").on("click",function(){
      $("#modalResponsablesEvaluacionDoc").modal("show");
   });
}

function buscarRucNombreContratistaEvalDocProy(){
   var rucNomContratistaReg = igualarStringBuscar($("#valBuscarRucNomContratista").val());

   listFullEvaluacionDocProyecto.forEach(function(val,index){
      if(igualarStringBuscar(val.codigo).indexOf(rucNomContratistaReg) != -1 || 
	 igualarStringBuscar(val.contratistaNombre).indexOf(rucNomContratistaReg) != -1 || 
	 igualarStringBuscar(val.titulo).indexOf(rucNomContratistaReg) != -1){
         $("#trEvaDocPro"+val.id).show();
      }else{
         $("#trEvaDocPro"+val.id).hide();
      }
   });
}

function reiniciarFiltroEvaDocProyecto(){
   $("#valBuscarRucNomContratista").val("").focus();

   listFullEvaluacionDocProyecto.forEach(function(val,index){
      $("#trEvaDocPro" + val.id).show();
   });
}

var listOpcQuicksightInforContTotal=[
    {id:1,nombre:"Contratista - informe por periodo"},{id:2,nombre:"Data - Documentos en base a cinco niveles"}
];

function ocultarFiltroQuicksightInforContTotal(){
    $("#modalFiltroQuicksightInforContTotal").modal("hide");
}

function verFiltroQuicksightInforContTotal(){
    $("#modalFiltroQuicksightInforContTotal").remove();

    var selOpcConExcelInforContTotal = crearSelectOneMenuOblig("selOpcConExcelInforContTotal",
        "verAcordeQuicksightInforContTotal()",listOpcQuicksightInforContTotal,"1","id","nombre");

    var contenido = "";

    var listContenido=[
	{sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Gráficos",inputForm:selOpcConExcelInforContTotal,divContainer:"divSelConExcelInforContTotal"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",
	 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroQuicksightInforContTotal()'>" +
	           "<i class='fa fa-times'></i> Cancelar" +
	       "</button>",
	 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='previoOpcionQuicksightInforContTotal()'>" +
	               "<i class='fa fa-bar-chart'></i> Seleccionar" +
	           "</button>"}
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
	id:"modalFiltroQuicksightInforContTotal",nombre:"<i class='fa fa-list'></i> Seleccionar - gráfico",
	contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    verAcordeQuicksightInforContTotal();
}

function verAcordeQuicksightInforContTotal(){
    $(".atributo-quicksightInforContTotal").remove(); 
    var listContenidoDivSelQuickInforContTotal = [];
    var opcGrafico = parseInt($("#selOpcConExcelInforContTotal").val());
    
    if([1].includes(opcGrafico)){
	listContenidoDivSelQuickInforContTotal=[
             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha inicio",inputForm:"<input id='fechaInicioQsEvaDocProy' type='date' class='form-control'>"},
             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha fin", inputForm:"<input id='fechaFinQsEvaDocProy' type='date' class='form-control'>"}
        ];
    }
    
    var contenido = "";
    
    listContenidoDivSelQuickInforContTotal.forEach(function(val){
        val.clase = "atributo-quicksightInforContTotal";
        contenido += obtenerSubPanelModuloVersionDos(val);
    });
    
    $("#divSelConExcelInforContTotal").parent().after(contenido);
    
    if([1].includes(opcGrafico)){
        var hoy = getSession("fechaHoyOrdenInversoTexto");
  
        $("#fechaInicioQsEvaDocProy").val(sumaFechaDias(-30,hoy));$("#fechaFinQsEvaDocProy").val(hoy);
    }
}

function previoOpcionQuicksightInforContTotal(){
    var opcGrafico = parseInt($("#selOpcConExcelInforContTotal").val());
    
    if(opcGrafico == 1){
	verQuicksightOpcionesEvaDocProyecto();
    }else if(opcGrafico == 2){
	verQuicksightOpcionesDocCincoNiveles();
    }
}

function ocultarQuicksightOpcionesEvaDocProyecto(){
    $("#modalQuicksightOpcEvaDocProy").modal("hide");
}

function verQuicksightOpcionesEvaDocProyecto(){
    $("#modalFiltroQuicksightInforContTotal").modal("hide");$("#modalQuicksightOpcEvaDocProy").remove();
	
    var campoVacio = true;
	   
    var fechaInicioQs = $("#fechaInicioQsEvaDocProy").val();
    var fechaFinQs = $("#fechaFinQsEvaDocProy").val();

    if(fechaInicioQs.length == 0 || fechaFinQs.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe ingresar la fecha inicio y la fecha fin.</label>";
    }
	
    if(campoVacio){
	var contenido = "";

	var buttonOcultar =
	    "<button type='button' class='btn btn-info' style='margin-right:5px' " +
		    "onclick='ocultarQuicksightOpcionesEvaDocProyecto()' title='Regresar a la vista anterior.'>" +
                "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> "+"<i class='fa fa-pie-chart fa-2x'></i>" +
	    "</button>";
	
	var fechaInicioQsText = convertirFechaNormal(fechaInicioQs);
	var fechaFinQsText = convertirFechaNormal(fechaFinQs);

	var modalOptions={
	    maxWidth:"90%",id:"modalQuicksightOpcEvaDocProy",btnCerrarHabilitado:0,
	    nombre:"<i class='fa fa-bar-chart'></i> Quicksight - Contratista - informe por periodo (del "+fechaInicioQsText+" al "+fechaFinQsText+")",
	    contenido:"<form class='form-inline'>"+buttonOcultar+"</form>" +
	              "<div id='divQuicksightOpcEvaDocProy'>"+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	var dataParam={
	    empresaId:parseInt(getSession("gestopcompanyid")),fechaRegistroInicio:fechaInicioQs,fechaRegistroFin:fechaFinQs
	};

	callAjaxPostSimpleVersionDos(1,URL+'/quicksight/contratista/opciones',dataParam,1,0,function(data){
	    if(data.CODE_RESPONSE === "05"){
		var urlDelIframe = data.embedUrl;

		var $iframe = $('<iframe>',{
		    src:urlDelIframe,width:'100%',height:'750px',frameborder:'0',css:{border:'none'}
		}).on('load',function(){
		    $.unblockUI();console.log('El contenido de QuickSight ha terminado de cargar.');
		});

		$('#divQuicksightOpcEvaDocProy').empty().append($iframe);
	    }else{
		$("#modalQuicksightOpcEvaDocProy").modal("hide");

		mensajeUx = "<label>Error al cargar los datos.</label>";
		mensajesUx(mensajeUx,2,"","ValidacionQuicksight");

		$("#modalMensajeUxValidacionQuicksight").on("hidden.bs.modal",function(){
		    $("#modalQuicksightOpcEvaDocProy").modal("show");	
		});
	    }
	});
    }else{
	$("#modalFiltroQuicksightInforContTotal").modal("hide");
	mensajesUx(mensajeUx,2,"","ValidacionFiltroQs");
    
	$("#modalMensajeUxValidacionFiltroQs").on("hidden.bs.modal",function(){
	    $("#modalFiltroQuicksightInforContTotal").modal("show");
	});
    }
}

function ocultarQuicksightOpcionesDocCincoNiveles(){
    $("#modalQuicksightDocCincoNiv").modal("hide");
}

function verQuicksightOpcionesDocCincoNiveles(){
    $("#modalFiltroQuicksightInforContTotal").modal("hide");$("#modalQuicksightDocCincoNiv").remove();
	
    var contenido = "";

    var buttonOcultar =
	"<button type='button' class='btn btn-info' style='margin-right:5px' " +
		"onclick='ocultarQuicksightOpcionesDocCincoNiveles()' title='Regresar a la vista anterior.'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> "+"<i class='fa fa-pie-chart fa-2x'></i>" +
	"</button>";
	
    var modalOptions={
	maxWidth:"90%",id:"modalQuicksightDocCincoNiv",btnCerrarHabilitado:0,
	nombre:"<i class='fa fa-bar-chart'></i> Quicksight - Data - Documentos en base a cinco niveles",
	contenido:"<form class='form-inline'>"+buttonOcultar+"</form>" +
	          "<div id='divQuicksightDocCincoNiv'>"+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    var dataParam={
	empresaId:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPostSimpleVersionDos(1,URL+'/quicksight/contratista/cinco_niveles',dataParam,1,0,function(data){
	if(data.CODE_RESPONSE === "05"){
	    var urlDelIframe = data.embedUrl;

	    var $iframe = $('<iframe>',{
		src:urlDelIframe,width:'100%',height:'750px',frameborder:'0',css:{border:'none'}
	    }).on('load',function(){
		$.unblockUI();console.log('El contenido de QuickSight ha terminado de cargar.');
	    });

	    $('#divQuicksightDocCincoNiv').empty().append($iframe);
	}else{
	    $("#modalQuicksightDocCincoNiv").modal("hide");

	    mensajeUx = "<label>Error al cargar los datos.</label>";
	    mensajesUx(mensajeUx,2,"","ValidacionQuicksight");

	    $("#modalMensajeUxValidacionQuicksight").on("hidden.bs.modal",function(){
	        $("#modalQuicksightDocCincoNiv").modal("show");	
	    });
	}
    });
}

var listOpcionDataRegAccVd=[
	{id:1,nombre:"Trabajador contratista"},{id:2,nombre:"Vehículo/Maquinaria"}
];

var listOpcionFuncionRegAccVd=[
	{id:1,nombre:"Nuevo registro"},{id:2,nombre:"Ver historial de registros"}
];

function ocultarPrevioSeleccionarOpcionRegistroAccesoVd(){
	$("#modalPrevioRegistroAccesoVd").modal("hide");
}

function previoSeleccionarOpcionRegistroAccesoVd(){
	$("#modalPrevioRegistroAccesoVd").remove();
	
	var contenido = "";
	
	var selOpcDataRegAccVd = crearSelectOneMenuOblig("selOpcDataRegAccVd","",listOpcionDataRegAccVd,"","id","nombre","");
	var selOpcFuncionRegAccVd = crearSelectOneMenuOblig("selOpcFuncionRegAccVd","",listOpcionFuncionRegAccVd,"","id","nombre","");
	  				
    var listContenido=[
	  	{label:"Data:",inputForm:selOpcDataRegAccVd},
	  	{label:"Acción:",inputForm:selOpcFuncionRegAccVd},
	  	{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
	  	{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarPrevioSeleccionarOpcionRegistroAccesoVd()'>" +
	               "<i class='fa fa-times'></i> Cancelar" +
	           "</button>",
	  	 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='enviarPrevioSeleccionarOpcionRegistroAccesoVd()'>" +
	  	               "<i class='fa fa-list-ul'></i> Seleccionar" +
	  	           "</button>"}
    ];
	  				
    listContenido.forEach(function(val){
	    contenido += obtenerSubPanelModuloVersionTres(val);
	});
	  
	var modalOptions={
	 	id:"modalPrevioRegistroAccesoVd",nombre:"<i class='fa fa-list-ul'></i> Seleccionar opciones",
	  	contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
	};
	  				
    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function enviarPrevioSeleccionarOpcionRegistroAccesoVd(){
    var opcDataRegAccVdId = parseInt($("#selOpcDataRegAccVd").val()),
	    opcFuncionRegAccVdId = parseInt($("#selOpcFuncionRegAccVd").val());
	
	if(opcDataRegAccVdId == 1){
		if(opcFuncionRegAccVdId == 1){
			verConsultaTrabajadorContratistaPorNroDocumentoOpcGenCont();
		}else if(opcFuncionRegAccVdId == 2){
			verRegistroAccesoTrabajadorContratistaVd();
		}
	}else if(opcDataRegAccVdId == 2){
		if(opcFuncionRegAccVdId == 1){
		    verConsultaVehiculoMaquinariaPorPlacaOpcGenCont();
		}else if(opcFuncionRegAccVdId == 2){
			verRegistroAccesoVehiculoMaquinariaVd();
	    }
	}
}

