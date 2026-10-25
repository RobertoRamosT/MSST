
var accidentesSsomaId,indexAccidentesSsoma,accidentesSsomaObj = {},actualizarPrincipalAccSsoma;
var listAccidentesSsoma = [];
var listUnidadesAccSsoma = [],listDivisionesAccSsoma = [],listAreasAccSsoma = [],listTipoEventoAn = [],listCategoriaLesionAn = [],
	listTipoTrabAccidentadoAn = [],listSexoAn = [],listTipoDeContratAn = [],listTipoAccidenteAn = [],listPartesLesionAn = [],
	listTurnoAn = [],listDanioPropiedadAn = [],listDanioAmbientalAn = [],listRiesgoPotencialAn = [],listFactorRiesgoAn = [],
	listPeligroAcAn = [],listMacroprocesosAccSsoma = [];
var hasTrabajadorPerfilSsomaAcc,habilitarRegistroNuevo;
var hashEstAccSsomaHabTrabajador = new Map(),hashRiePotAsigTrabajador = new Map();
var mensajeUx;

function ocultarFiltroAccidentesSsoma(){
	$("#modalFiltroAccidentesSsoma").modal("hide");
}

function verFiltroAccidentesSsoma(){
	$("#modalFiltroAccidentesSsoma").modal("show");
}

function crearFiltroAccidentesSsoma(functionCallBack){
	$("#modalFiltroAccidentesSsoma").remove();

	var dataParam={
		empresaId:parseInt(getSession("gestopcompanyid")),trabajadorId:parseInt(getSession("trabajadorGosstId"))
	};

	callAjaxPost(URL+'/accidente/accidente_ssoma/vista_colaborador/filtro',dataParam,function(data){
		listUnidadesAccSsoma = data.listUnidadesAccSsoma;listDivisionesAccSsoma = data.listDivisionesAccSsoma;listAreasAccSsoma = data.listAreasAccSsoma;
		listTipoEventoAn = data.listTipoEventoAn;listCategoriaLesionAn = data.listCategoriaLesionAn;listTipoTrabAccidentadoAn = data.listTipoTrabAccidentadoAn;
		listSexoAn = data.listSexoAn;listTipoDeContratAn = data.listTipoDeContratAn;listTipoAccidenteAn = data.listTipoAccidenteAn;
		listPartesLesionAn = data.listPartesLesionAn;listTurnoAn = data.listTurnoAn;listDanioPropiedadAn = data.listDanioPropiedadAn;
		listDanioAmbientalAn = data.listDanioAmbientalAn;listRiesgoPotencialAn = data.listRiesgoPotencialAn;listFactorRiesgoAn = data.listFactorRiesgoAn;
		listPeligroAcAn = data.listPeligroAcAn;listMacroprocesosAccSsoma = data.listMacroprocesosAccSsoma;

		hasTrabajadorPerfilSsomaAcc = data.trabajador.hasPerfilSsomaAcc;
		hashEstAccSsomaHabTrabajador = new Map();hashRiePotAsigTrabajador = new Map();

		if(hasTrabajadorPerfilSsomaAcc > 0){
			habilitarRegistroNuevo = data.trabajador.perfilAccidenteSsoma.habilitarNuevo;

			if(data.trabajador.perfilAccidenteSsoma.estadoAccSsomaHabilitadosId.length != 0){
				var estadosAccidenteSsomaHabilitadosId = data.trabajador.perfilAccidenteSsoma.estadoAccSsomaHabilitadosId.split(",");

				estadosAccidenteSsomaHabilitadosId.forEach(function(val){
					hashEstAccSsomaHabTrabajador.set(parseInt(val),1);
				});
			}

			if(data.trabajador.perfilAccidenteSsoma.riesgoPotencialAsignadosId.length != 0){
				var riesgosPotencialesAsignadosId = data.trabajador.perfilAccidenteSsoma.riesgoPotencialAsignadosId.split(",");

				riesgosPotencialesAsignadosId.forEach(function(val){
					hashRiePotAsigTrabajador.set(parseInt(val),1);
				});
			}
		}

		var unidadTexto = (parseInt(getSession("gestopcompanyid")) == 714?"País - Empresa":"Unidad");

		var selUnidadFiltroAccSsoma = crearSelectOneMenu("selUnidadFiltroAccSsoma",
			"",listUnidadesAccSsoma,"","id","nombre");

		var contenido = "";

		var listContenido=[
			{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
			 label:"<span style='font-size:20px;font-weight:bolder;'>Fecha reporte</span>"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",
			 inputForm:"<input type='date' id='fechaInicioFiltroAccSsoma' class='form-control'>"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",
			 inputForm: "<input type='date' id='fechaFinFiltroAccSsoma' class='form-control'>"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:unidadTexto,inputForm:selUnidadFiltroAccSsoma},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",
			 label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroAccidentesSsoma()' style='font-size:18px;'>" +
				       "<i class='fa fa-times'></i> Cancelar" +
				   "</button>",
			 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='valoresFiltroAccidentesSsoma()'>" +
					       "<i class='fa fa-filter'></i> Aplicar" +
				 	   "</button>"}
		];

		listContenido.forEach(function (val){
			contenido += obtenerSubPanelModuloVersionDos(val);
		});

		var modalOptions={
			id:"modalFiltroAccidentesSsoma",nombre:"<i class='fa fa-filter'></i> Filtros",
			contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
		};

		crearModalPrincipalUsuario(modalOptions,function(){},true,true);

		var hoy = getSession("fechaHoyOrdenInversoTexto");

		$("#fechaInicioFiltroAccSsoma").val('2025-01-01');$("#fechaFinFiltroAccSsoma").val(hoy);

		functionCallBack();
	});
}

function valoresFiltroAccidentesSsoma(){
	ocultarFiltroAccidentesSsoma();

	habilitarAccidentesSsoma();
}

function toggleMenuOpcionAccidentesSsoma(obj,pindex){
	accidentesSsomaObj = listAccidentesSsoma[pindex];
	indexAccidentesSsoma = pindex;

	if(!$(obj).parent().parent().parent(".eventoGeneral").find("ul").is(":visible")){
		$(".listaFinalGestionGosst").hide();
	}

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
}

var funcionalidadesEstadoAccidentesSsoma=[
	{id:"opcInfoEventoEst2&3",nombre:"<i class='fa fa-file-text-o'></i> Ver investigación del evento",estadosHabilitados:[2,3],
	 functionClick:function(data){verInvestigacionEventoAccSsoma();}},
	{id:"opcDescMedicoEst2&3",nombre:"<i class='fa fa-medkit'></i> Ver descanso médico",estadosHabilitados:[2,3],
	 functionClick:function(data){verDescansoMedicoAdicionalAccSsoma();}},
	{id:"opcAccCorrec2&3",nombre:"<i class='fa fa-book'></i> Ver acciones correctivas",estadosHabilitados:[2,3],
	 functionClick:function(data){verAccionMejoraAccSsoma();}},
	{id:"opcReporteEst3&4",nombre:"<i class='fa fa-file-excel-o'></i> Generar reporte final",estadosHabilitados:[3,4],
	 functionClick:function(data){descargarExcelConsolidadoReporteFinal();}},
	{id:"opcFinValMedicaEst1",nombre:"<i class='fa fa-pencil-square-o'></i> Finalizar validación médica",estadosHabilitados:[1],
	 functionClick:function(data){verFinalizarValidacionMedicaRegistroAccidentesSsoma();}},
	{id:"opcFinComplInfEst2",nombre:"<i class='fa fa-pencil-square-o'></i> Finalizar completar información",estadosHabilitados:[2],
	 functionClick:function(data){validacionCambioEstadoRegistrosValidadosCompletarInformacion();}},
	{id:"opcFinComplInfEst3",nombre:"<i class='fa fa-pencil-square-o'></i> Finalizar cierre preliminar",estadosHabilitados:[3],
	 functionClick:function(data){cambiarEstadoActualRegistroAccidentesSsoma(4);}}
];

function marcarSubOpcionAccidentesSsoma(pindex){
	funcionalidadesEstadoAccidentesSsoma[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function habilitarAccidentesSsoma(){
	window.scrollTo({top:0,behavior:'smooth'});

	var dataParam={
		empresaId:parseInt(getSession("gestopcompanyid")),fechaEventoInicio:$("#fechaInicioFiltroAccSsoma").val(),
		fechaEventoFin:$("#fechaFinFiltroAccSsoma").val(),unidadId:(parseInt($("#selUnidadFiltroAccSsoma").val()) == -1?null:parseInt($("#selUnidadFiltroAccSsoma").val()))

	};

	callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/vista_colaborador',dataParam,1,1,function(data){
		switch(data.CODE_RESPONSE){
			case "05":
				var listPanelesPrincipal = [];
				var textEstadoUno = "",textEstadoDos = "",textEstadoTres = "",textEstadoCuatro = "";
				var numEstadoUno = 0,numEstadoDos = 0,numEstadoTres = 0,numEstadoCuatro = 0;

				listAccidentesSsoma = data.listAccidentesSsoma;

				$(".divListPrincipal").html("");

				listAccidentesSsoma.forEach(function(val,index){
					var btnOpcion = "",menuOpcion = "";

					if(hasTrabajadorPerfilSsomaAcc == 0 || hashEstAccSsomaHabTrabajador.get(val.estadoAccidenteSsomaId) == 1){
						menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
						    funcionalidadesEstadoAccidentesSsoma.forEach(function(val1,index1){
								if(val1.estadosHabilitados.includes(val.estadoAccidenteSsomaId)){
									menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionAccidentesSsoma("+index1+")'>"+val1.nombre+"</li>";
								}
						    });
						menuOpcion += "</ul>";

						btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionAccidentesSsoma(this,"+index+")'>" +
							    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
							"</a>";
					}

					var verDetalleEvento = "<a class='efectoLink' onclick='verDetalleEventoAccidentesSsoma("+val.id+")'>"+"<i class='fa fa-eye'></i> Ver detalle"+"</a>";

					var listTotal=[
						{sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
						 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CÓDIGO #"+val.id+" ***</span>"},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
						{sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"<i class='fa fa-calendar'></i> Fecha y hora del evento:",inputForm:val.fechaEventoTexto+" "+val.horaEventoTexto},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> País - Empresa:",inputForm:val.unidad.nombre},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> Sede:",inputForm:val.division.divisionName},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> Área:",inputForm:val.area.areaName},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Tipo de evento:",inputForm:val.tipoEventoAn.nombre},
						{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-pencil'></i> Descripción:",inputForm:""},
						{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.descripcion,styleAux:"word-break:break-all;"},
						{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-exclamation-triangle'></i> Nivel de Potencialidad del Evento:",inputForm:val.riesgoPotencial.nombre}
					];

					if(val.danioLesionAn.nombreAccidentado.length > 0){
						listTotal.push({sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"<i class='fa fa-user'></i> Nombre del accidentado:",inputForm:val.danioLesionAn.nombreAccidentado});
					}

					if([2,3,4].includes(val.estadoAccidenteSsomaId)){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
							{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-book'></i> ¿Hubo lesión?",inputForm:(val.danioLesionAnId > 0?"Sí":"No")},
							{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-book'></i> ¿Registró la investigación del evento?",inputForm:(val.informacionEventoAnId > 0?"Sí":"No")},
							{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-book'></i> ¿Tiene descanso médico inicial y/o adicional?",inputForm:((val.danioLesionAnId > 0 && val.tipoEventoAn.id == 1) || val.diasDescansoId > 0?"Sí":"No")},
							{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-book'></i> N° de acciones correctivas registradas:",inputForm:val.numAccionesMejora});
					}

					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list-alt'></i> Detalle del evento:",inputForm:verDetalleEvento});

					if([1,2].includes(val.estadoAccidenteSsomaId)){
						var excelPreliminar = "<a class='efectoLink' target='_blank' href='"+URL+"/accidente/accidente_ssoma/excel/reporte_preliminar?" +
							"id="+val.id+"&empresaId="+getSession("gestopcompanyid")+"'>" +
							    "<i class='fa fa-download'></i> Descargar" +
							"</a>";

						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file-excel-o'></i> Reporte preliminar:",inputForm:excelPreliminar});
					}else if([3,4].includes(val.estadoAccidenteSsomaId)){
						var excelFinal = "<a class='efectoLink' target='_blank' href='"+URL+"/accidente/accidente_ssoma/excel/reporte_final?" +
							"id="+val.id+"&empresaId="+getSession("gestopcompanyid")+"'>" +
							    "<i class='fa fa-download'></i> Descargar" +
							"</a>";

						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file-excel-o'></i> Reporte final:",inputForm:excelFinal});
					}

					if(val.fechaRegistroTexto.length > 0 || val.fechaValidacionMedicaTexto.length > 0 || val.fechaRegistroValidadoTexto.length > 0 ||
						val.fechaCierrePreliminarTexto.length > 0){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
					}

					if(val.fechaRegistroTexto.length > 0){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha y hora - registro del evento:",
							inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
					}

					if(val.fechaValidacionMedicaTexto.length > 0){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha y hora - validación médica:",
							inputForm:val.fechaValidacionMedicaTexto+(val.usuarioValidacionMedica.nombre.length == 0?"":"<br>(Por "+val.usuarioValidacionMedica.nombre+")")});
					}

					if(val.fechaRegistroValidadoTexto.length > 0){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha y hora - registro validado:",
							inputForm:val.fechaRegistroValidadoTexto+(val.usuarioRegistroValidado.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistroValidado.nombre+")")});
					}

					if(val.fechaCierrePreliminarTexto.length > 0){
						listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha y hora - cierre preliminar:",
							inputForm:val.fechaCierrePreliminarTexto+(val.usuarioCierrePreliminar.nombre.length == 0?"":"<br>(Por "+val.usuarioCierrePreliminar.nombre+")")});
					}

					var textAccidenteSsomaAux = "";

					textAccidenteSsomaAux += "<div class='eventoGeneral'>" +
						                         "<form class='eventoGeneral'>";
					    listTotal.forEach(function(val,index){
							textAccidenteSsomaAux += obtenerSubPanelModuloVersionDos(val);
					    });
					textAccidenteSsomaAux +=     "</form>" +
						                     "</div>";

					if(val.estadoAccidenteSsomaId == 1){
						textEstadoUno += textAccidenteSsomaAux;numEstadoUno++;
					}else if(val.estadoAccidenteSsomaId == 2){
						textEstadoDos += textAccidenteSsomaAux;numEstadoDos++;
					}else if(val.estadoAccidenteSsomaId == 3){
						textEstadoTres += textAccidenteSsomaAux;numEstadoTres++;
					}else if(val.estadoAccidenteSsomaId == 4){
						textEstadoCuatro += textAccidenteSsomaAux;numEstadoCuatro++;
					}
				});

				if(hasTrabajadorPerfilSsomaAcc == 0 || habilitarRegistroNuevo == 1){
					listPanelesPrincipal.push({id:"nuevoRegistroAccidenteSssoma",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroAccidentesSsoma()",
						btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar evento",contenido:""});
				}

				listPanelesPrincipal.push({id:"opcionesAccidenteSssoma",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verFiltroAccidentesSsoma()",
				     btnIconoAux:"fa-filter",btnTitleAux:"Opciones de los registros",nombre:"Opciones",contenido:""},
					{id:"estadoUnoAccidenteSssoma",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
					 btnIconoAux:"",btnTitleAux:"",nombre:"Registros pendientes de validación médica ("+numEstadoUno+")",contenido:textEstadoUno},
					{id:"estadoDosAccidenteSssoma",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
					 btnIconoAux:"",btnTitleAux:"",nombre:"Registros validados - completar informacion ("+numEstadoDos+")",contenido:textEstadoDos},
					{id:"estadoTresAccidenteSssoma",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
					 btnIconoAux:"",btnTitleAux:"",nombre:"Registros con cierre preliminar - para validación final ("+numEstadoTres+")",contenido:textEstadoTres},
					{id:"estadoCuatroAccidenteSssoma",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
					 btnIconoAux:"",btnTitleAux:"",nombre:"Registros cerrados ("+numEstadoCuatro+")",contenido:textEstadoCuatro});

				if(parseInt(getSession("gestopcompanyid")) == 714){
					listPanelesPrincipal.push({id:"quicksightAccidenteSssoma",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verQuicksightAccidentesV3()",
						btnIconoAux:"fa-pie-chart",btnTitleAux:"Ver gráficos en quicksight",nombre:"Ver análisis de datos",contenido:""});
				}

				agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);

				$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();

				break;

			default:
				alert("nop");

				break;
		}
	});
}

var enfoqueCheckListParteLesion;

function ocultarRegistroAccidentesSsoma(){
	$("#modalRegistroAccidentesSsoma").modal("hide");
}

function registroAccidentesSsoma(opcionId){
	$("#modalRegistroAccidentesSsoma").remove();

	accidentesSsomaId = 0;enfoqueCheckListParteLesion = 0;

	var listBooleanSiNo = listBoolean.sort(function(val,val2){
		return val2.id - val.id;
	});

	var unidadTexto = (parseInt(getSession("gestopcompanyid")) == 714?"País - Empresa*":"Unidad*"),
		divisionTexto = ([714,716].includes(parseInt(getSession("gestopcompanyid")))?"Sede*":"División*"),
		areaTexto = (parseInt(getSession("gestopcompanyid")) == 714?"Área - Proceso*":"Área*");

	var selUnidadAccSsoma = crearSelectOneMenu("selUnidadAccSsoma","filtrarDivisionesSegunUnidadAccidenteSsoma()",
		listUnidadesAccSsoma,(parseInt(getSession("gestopcompanyid")) == 500?"927":"-1"),"id","nombre",(listUnidadesAccSsoma.length == 0?"Sin unidades registradas":null));

	var selTipoEventoAccSsoma = crearSelectOneMenu("selTipoEventoAccSsoma","habilitarDescansoMedicoInicialAccidenteSsoma()",
		listTipoEventoAn,"-1","id","nombre");

	var selRiesgoPotencialAccSsoma = crearSelectOneMenu("selRiesgoPotencialAccSsoma","",listRiesgoPotencialAn,
		"-1","id","nombre");

	var selFactorRiesgoAccSsoma = crearSelectOneMenu("selFactorRiesgoAccSsoma","filtrarPeligrosSegunFactorRiesgoAccidenteSsoma()",
		listFactorRiesgoAn,"-1","id","nombre");

	var radiosRespLocalEmpresaAccSsoma = crearRadiosAutoVersionDos("radiosRespLocalEmpresaAccSsoma",
		listBooleanSiNo,"0","id","nombre","","");

	var radiosRespHuboLesionAccSsoma = crearRadiosAutoVersionDos("radiosRespHuboLesionAccSsoma",
		listBooleanSiNo,"0","id","nombre","habilitarCamposAsociadosHuboLesion","");

	var radiosRespHuboDanhioPropAccSsoma = crearRadiosAutoVersionDos("radiosRespHuboDanhioPropAccSsoma",
		listBooleanSiNo,"0","id","nombre","habilitarCamposAsociadosHuboDanhioPropiedad","");

	var radiosRespHuboImpactoAmbAccSsoma = crearRadiosAutoVersionDos("radiosRespHuboImpactoAmbAccSsoma",
		listBooleanSiNo,"0","id","nombre","habilitarCamposAsociadosHuboImpactoAmbiental","");

	var selCategoriaLesionAccSsoma = crearSelectOneMenu("selCategoriaLesionAccSsoma","",listCategoriaLesionAn,
		"-1","id","nombre");

	var selTipoTrabAccidentadoAccSsoma = crearSelectOneMenu("selTipoTrabAccidentadoAccSsoma","",listTipoTrabAccidentadoAn,
		"-1","id","nombre");

	var selSexoAccSsoma = crearSelectOneMenu("selSexoAccSsoma","",listSexoAn,
		"-1","id","nombre");

	var selTipoContratoAccSsoma = crearSelectOneMenu("selTipoContratoAccSsoma","",listTipoDeContratAn,
		"-1","id","nombre");

	var selTipoAccidenteAccSsoma = crearSelectOneMenu("selTipoAccidenteAccSsoma","",listTipoAccidenteAn,
		"-1","id","nombre");

	var selTurnoAccSsoma = crearSelectOneMenu("selTurnoAccSsoma","",listTurnoAn,
		"-1","id","nombre");

	var selDanioPropiedadAccSsoma = crearSelectOneMenu("selDanioPropiedadAccSsoma","",listDanioPropiedadAn,
		"-1","id","nombre");

	var selDanioAmbientalAccSsoma = crearSelectOneMenu("selDanioAmbientalAccSsoma","",listDanioAmbientalAn,
		"-1","id","nombre");

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha del evento",inputForm:"<input id='inputFechaEventoAccSsoma' type='date' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hora del evento",inputForm:"<input id='inputHoraEventoAccSsoma' type='time' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:unidadTexto,inputForm:selUnidadAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:divisionTexto,inputForm:"",divContainer:"divSelDivisionAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:areaTexto,inputForm:"",divContainer:"divSelAreaAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Macroproceso",inputForm:"",divContainer:"divSelMacroprocesoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Lugar exacto",inputForm:"<input id='inputLugarExactoAccSsoma' class='form-control' type='text'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"¿Ocurrió dentro de las instalaciones?",inputForm:radiosRespLocalEmpresaAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de evento",inputForm:selTipoEventoAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"¿Hubo lesión?",inputForm:radiosRespHuboLesionAccSsoma},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Categoria lesión",inputForm:selCategoriaLesionAccSsoma},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Tipo trabajador accidentado",inputForm:selTipoTrabAccidentadoAccSsoma},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Nombre del accidentado",
		 inputForm:"<input id='inputNomTrabAccidAccSsoma' class='form-control' type='text'>"},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"DNI/Cédula",
		 inputForm:"<input id='inputNumDocTrabAccidAccSsoma' class='form-control' type='text'>"},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Edad",
		 inputForm:"<input id='inputEdadTrabAccidAccSsoma' type='number' min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>"},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Sexo",inputForm:selSexoAccSsoma},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Puesto de trabajo",
		 inputForm:"<input id='inputPuestoTraTrabAccidAccSsoma' class='form-control' type='text'>"},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Tipo de contrato",inputForm:selTipoContratoAccSsoma},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Experiencia en el puesto de trabajo (meses)",
		 inputForm:"<input id='inputExpPuestoTraTrabAccidAccSsoma' type='number' min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>"},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Jefe inmediato del trabajador accidentado",
		 inputForm:"<input id='inputJefeTrabAccidAccSsoma' class='form-control' type='text'>"},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Tipo de accidente",inputForm:selTipoAccidenteAccSsoma},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Partes lesionadas",
		 inputForm:"<a class='efectoLink' onclick='verCheckListPartesLesionadasAccidenteSsoma()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelPartesLesionadasAccSsoma"},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"Turno",inputForm:selTurnoAccSsoma},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"",anchoDiv:"",label:"N° de horas trabajadas antes del suceso",
		 inputForm:"<input id='inputNumHorasTraAccidAccSsoma' type='number' min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>"},
		{sugerencia:"",clase:"campos-hubo-lesion campos-descanso-inicial",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",clase:"campos-hubo-lesion campos-descanso-inicial",anchoLabel:"",anchoDiv:"",label:"Fecha inicio - descanso",
		 inputForm:"<input id='inputFechaInicioDescAccSsoma' onchange='calculoNumDiasDescansoAccidenteSsoma()' type='date' class='form-control'>"},
		{sugerencia:"",clase:"campos-hubo-lesion campos-descanso-inicial",anchoLabel:"",anchoDiv:"",label:"Fecha fin - descanso",
		 inputForm:"<input id='inputFechaFinDescAccSsoma' onchange='calculoNumDiasDescansoAccidenteSsoma()' type='date' class='form-control'>"},
		{sugerencia:"",clase:"campos-hubo-lesion campos-descanso-inicial",anchoLabel:"",anchoDiv:"",label:"N° días de descanso",inputForm:"",divContainer:"divNumDiasDescansoAccSsoma"},
		{sugerencia:"",clase:"campos-hubo-lesion campos-descanso-inicial",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción de la atención en primeros auxilios",inputForm:""},
		{sugerencia:"",clase:"campos-hubo-lesion",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
		 inputForm:"<textarea class='form-control' rows='4' id='textDescAtenPrimAuxAccSsoma'></textarea>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"¿Hubo daño a la propiedad?",inputForm:radiosRespHuboDanhioPropAccSsoma},
		{sugerencia:"",clase:"campos-danhio-propiedad",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",clase:"campos-danhio-propiedad",anchoLabel:"",anchoDiv:"",label:"Daño a la propiedad",inputForm:selDanioPropiedadAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"¿Hubo impacto ambiental?",inputForm:radiosRespHuboImpactoAmbAccSsoma},
		{sugerencia:"",clase:"campos-impacto-ambiental",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",clase:"campos-impacto-ambiental",anchoLabel:"",anchoDiv:"",label:"Impacto Ambiental",inputForm:selDanioAmbientalAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Cantidad de personas afectadas",
		 inputForm:"<input id='inputNumPerAfecAccSsoma' type='number' min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nivel de potencialidad del evento",inputForm:selRiesgoPotencialAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Riesgo asociado",inputForm:selFactorRiesgoAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Peligro asociado",inputForm:"",divContainer:"divSelPeligroAsocAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nombre del testigo 1"+"<br><label style='color:blue;'>(opcional)</label>",
		 inputForm:"<input id='inputNombreTestigo1AccSsoma' class='form-control' type='text'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nombre del testigo 2"+"<br><label style='color:blue;'>(opcional)</label>",
		 inputForm:"<input id='inputNombreTestigo2AccSsoma' class='form-control' type='text'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción del evento",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='4' id='textDescEventoAccSsoma'></textarea>"},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción de la lesión o daño material",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='4' id='textDescLesionDanhioAccSsoma'></textarea>"},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Acciones inmediatas tomadas después del evento",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='4' id='textAccInmTomDesEventoAccSsoma'></textarea>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia #01",inputForm:"",divContainer:"divEvidenciaUnoRegAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia #02",inputForm:"",divContainer:"divEvidenciaDosRegAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia #03",inputForm:"",divContainer:"divEvidenciaTresRegAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroAccidentesSsoma()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
		       "</button>",
		 inputForm:"<button id='btnRegInicialAccIncSsoma' class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
		 		   "onclick='guardarRegistroAccidentesSsoma()'>" +
		               "<i class='fa fa-floppy-o'></i> Guardar" +
			   "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroAccidentesSsoma",nombre:"<i class='fa fa-pencil'></i> Registro del evento",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	var optionsUno={
		container:"#divEvidenciaUnoRegAccSsoma",functionCall:function(){
			validacionSubirEvidencia("UnoRegAccSsoma",bitsEvidenciaExamen,"modalRegistroAccidentesSsoma");
		},descargaUrl:"",esNuevo:true,idAux:"UnoRegAccSsoma",evidenciaNombre:""
	};

	crearFormEvidenciaCompleta(optionsUno);

	var optionsDos={
		container:"#divEvidenciaDosRegAccSsoma",functionCall:function(){
			validacionSubirEvidencia("DosRegAccSsoma",bitsEvidenciaExamen,"modalRegistroAccidentesSsoma");
		},descargaUrl:"",esNuevo:true,idAux:"DosRegAccSsoma",evidenciaNombre:""
	};

	crearFormEvidenciaCompleta(optionsDos);

	var optionsTres={
		container:"#divEvidenciaTresRegAccSsoma",functionCall:function(){
			validacionSubirEvidencia("TresRegAccSsoma",bitsEvidenciaExamen,"modalRegistroAccidentesSsoma");
		},descargaUrl:"",esNuevo:true,idAux:"TresRegAccSsoma",evidenciaNombre:""
	};

	crearFormEvidenciaCompleta(optionsTres);

	filtrarDivisionesSegunUnidadAccidenteSsoma();filtrarPeligrosSegunFactorRiesgoAccidenteSsoma();calculoNumDiasDescansoAccidenteSsoma();
	crearCheckListGeneral("modalRegistroAccidentesSsoma","Partes lesionadas",
		"PartLesAccSsomaSelec",listPartesLesionAn,"PartesLesionadasAccidenteSsoma",ocultarCheckListPartesLesionadasAccidenteSsoma);
	habilitarCamposAsociadosHuboLesion(0);habilitarCamposAsociadosHuboDanhioPropiedad(0);habilitarCamposAsociadosHuboImpactoAmbiental(0);
}

var selDivisionAccSsoma,selAreaAccSsoma,selMacroprocesoAccSsoma,textoAdicionalAccSsoma,textoAdicional1AccSsoma,textoAdicional2AccSsoma,
	textoSelectVacioAux1AccSsoma,textoSelectVacioAux2AccSsoma;

function filtrarDivisionesSegunUnidadAccidenteSsoma(){
	var listDivisionAccSsomaAux = [];
	selDivisionAccSsoma = "";

	textoSelectVacioAux1AccSsoma = ([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sedes":"divisiones");
	textoSelectVacioAux2AccSsoma = (parseInt(getSession("gestopcompanyid")) == 714?"el país - empresa seleccionado":"la unidad seleccionada");

	var unidadIdAux = parseInt($("#selUnidadAccSsoma").val());

	if(listDivisionesAccSsoma.length != 0 && unidadIdAux != -1){
		listDivisionesAccSsoma.forEach(function(val){
			if(val.matrixId == unidadIdAux){
				listDivisionAccSsomaAux.push(val);
			}
		});

		selDivisionAccSsoma = crearSelectOneMenu("selDivisionAccSsoma","filtrarAreasSegunDivisionAccidenteSsoma()",listDivisionAccSsomaAux,
			(parseInt(getSession("gestopcompanyid")) == 500?"2430":""),"divisionId","divisionName",(listDivisionAccSsomaAux.length == 0?"Sin "+textoSelectVacioAux1AccSsoma+" asociadas":null));

		textoAdicionalAccSsoma = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1AccSsoma+" se muestran según "+textoSelectVacioAux2AccSsoma+".</small>";
	}else{
		textoAdicionalAccSsoma = "<small style='font-weight:bold;'>"+(unidadIdAux == -1?"*Las "+textoSelectVacioAux1AccSsoma+" se muestran según "+textoSelectVacioAux2AccSsoma:
			"*No hay "+textoSelectVacioAux1AccSsoma+" para seleccionar")+".</small>";
	}

	$("#divSelDivisionAccSsoma").html(selDivisionAccSsoma+textoAdicionalAccSsoma);

	filtrarAreasSegunDivisionAccidenteSsoma();
}

function filtrarAreasSegunDivisionAccidenteSsoma(){
	var listAreaAccSsomaAux = [],listMacroprocesoAccSsomaAux = [];
	selAreaAccSsoma = "",selMacroprocesoAccSsoma = "";

	textoSelectVacioAux1AccSsoma = (parseInt(getSession("gestopcompanyid")) == 714?"áreas - procesos":"áreas");
	textoSelectVacioAux2AccSsoma = "la "+([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sede":"división")+" seleccionada";

	var divisionIdAux = (selDivisionAccSsoma.length == 0?-1:parseInt($("#selDivisionAccSsoma").val()));

	if(listAreasAccSsoma.length != 0 && divisionIdAux != -1){
		listAreasAccSsoma.forEach(function(val){
			if(val.divisionId == divisionIdAux){
				listAreaAccSsomaAux.push(val);
			}
		});

		selAreaAccSsoma = crearSelectOneMenu("selAreaAccSsoma","",listAreaAccSsomaAux,"","areaId","areaNameShort",
			(listAreaAccSsomaAux.length == 0?"Sin "+textoSelectVacioAux1AccSsoma+" con responsables":null));

		textoAdicionalAccSsoma = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1AccSsoma+" se muestran según "+textoSelectVacioAux2AccSsoma+".</small>";
	}else{
		textoAdicionalAccSsoma = "<small style='font-weight:bold;'>"+(divisionIdAux == -1?"*Las "+textoSelectVacioAux1AccSsoma+" se muestran según "+textoSelectVacioAux2AccSsoma:
			"*No hay "+textoSelectVacioAux1AccSsoma+" con responsables para seleccionar")+".</small>";
	}

	if(listMacroprocesosAccSsoma.length != 0 && divisionIdAux != -1){
		listMacroprocesosAccSsoma.forEach(function(val){
			if(val.divisionId == divisionIdAux){
				listMacroprocesoAccSsomaAux.push(val);
			}
		});

		selMacroprocesoAccSsoma = crearSelectOneMenu("selMacroprocesoAccSsoma","",listMacroprocesoAccSsomaAux,
			"","id","nombre",(listMacroprocesoAccSsomaAux.length == 0?"Sin macroprocesos asociados":null));

		textoAdicional1AccSsoma = "<small style='font-weight:bold;'>*Los macroprocesos se muestran según "+textoSelectVacioAux2AccSsoma+".</small>";
	}else{
		textoAdicional1AccSsoma = "<small style='font-weight:bold;'>"+(divisionIdAux == -1?"*Los macroprocesos se muestran según "+textoSelectVacioAux2AccSsoma:
			"*No hay macroprocesos para seleccionar")+".</small>";
	}

	$("#divSelAreaAccSsoma").html(selAreaAccSsoma+textoAdicionalAccSsoma);
	$("#divSelMacroprocesoAccSsoma").html(selMacroprocesoAccSsoma+textoAdicional1AccSsoma);
}

function filtrarPeligrosSegunFactorRiesgoAccidenteSsoma(){
	var listPeligroAcAccSsomaAux = [],selPeligroAcAccSsoma = "";

	var factorRiesgoIdAux = parseInt($("#selFactorRiesgoAccSsoma").val());

	if(listPeligroAcAn.length != 0 && factorRiesgoIdAux != -1){
	    listPeligroAcAn.forEach(function (val){
		    if(val.factorRiesgoId == factorRiesgoIdAux){
			    listPeligroAcAccSsomaAux.push(val);
			}
		});

		selPeligroAcAccSsoma = crearSelectOneMenuOblig("selPeligroAcAccSsoma","",listPeligroAcAccSsomaAux,
			"","id","nombre");

		textoAdicional2AccSsoma = "<small style='font-weight:bold;'>*Los peligros se muestran según el riesgo asociado seleccionado.</small>";
	}else{
		textoAdicional2AccSsoma = "<small style='font-weight:bold;'>"+(factorRiesgoIdAux == -1?"*Los peligros se muestran según el riesgo asociado seleccionado":
			"*No hay peligros asociados para seleccionar")+".</small>";
	}

	$("#divSelPeligroAsocAccSsoma").html(selPeligroAcAccSsoma+textoAdicional2AccSsoma);
}

function ocultarCheckListPartesLesionadasAccidenteSsoma(){
	var textPartLesAccSsomaSelec = "";

	listPartesLesionAn.forEach(function(val,index){
		var isSeleccionado = ($("#checkAsignadoPartLesAccSsomaSelec"+val.id).prop("checked")?1:0);

		if(isSeleccionado == 1){
			textPartLesAccSsomaSelec += (textPartLesAccSsomaSelec.length == 0?val.nombre:", "+val.nombre);
		}
	});

	textPartLesAccSsomaSelec = (textPartLesAccSsomaSelec.length == 0?"":textPartLesAccSsomaSelec);

	$("#divSelPartesLesionadasAccSsoma").html(textPartLesAccSsomaSelec);

	$("#modalCheckListPartLesAccSsomaSelec").modal("hide");$("#modalRegistroAccidentesSsoma").modal("show");

	if(enfoqueCheckListParteLesion == 1){
		document.getElementById("selTipoAccidenteAccSsoma").focus();
	}else{
		enfoqueCheckListParteLesion = 1;
	}
}

function verCheckListPartesLesionadasAccidenteSsoma(){
	$("#modalCheckListPartLesAccSsomaSelec").modal("show");$("#modalRegistroAccidentesSsoma").modal("hide");
}

function cargarCheckListPartesLesionadasAccidenteSsoma(){
	if(accidentesSsomaObj.danioLesionAn.partesLesionSeleccionadosId.length != 0){
		var parteLesionSeleccionadosId = accidentesSsomaObj.danioLesionAn.partesLesionSeleccionadosId.split(",");

		parteLesionSeleccionadosId.forEach(function(val1){
			var checkboxParteLesion = document.getElementById('checkAsignadoPartLesAccSsomaSelec'+val1);
			checkboxParteLesion.checked = true;
		});
	}

	ocultarCheckListPartesLesionadasAccidenteSsoma();
}

function habilitarCamposAsociadosHuboLesion(value){
	(value == 0?$(".campos-hubo-lesion").hide():$(".campos-hubo-lesion").show());

	habilitarDescansoMedicoInicialAccidenteSsoma();
}

function habilitarCamposAsociadosHuboDanhioPropiedad(value){
	(value == 0?$(".campos-danhio-propiedad").hide():$(".campos-danhio-propiedad").show());
}

function habilitarCamposAsociadosHuboImpactoAmbiental(value){
	(value == 0?$(".campos-impacto-ambiental").hide():$(".campos-impacto-ambiental").show());
}

function habilitarDescansoMedicoInicialAccidenteSsoma(){
	var tipoEventoId = parseInt($("#selTipoEventoAccSsoma").val());
	var hasLesion = (accidentesSsomaId > 0?1:parseInt($("input[name='radiosRespHuboLesionAccSsoma']:checked").val()));

	(hasLesion == 1 && tipoEventoId == 1?$(".campos-descanso-inicial").show():$(".campos-descanso-inicial").hide());
}

function guardarRegistroAccidentesSsoma(){
	var campoVacio = true,enfoqueAuxId = "";

	var fechaEvento = convertirFechaTexto($("#inputFechaEventoAccSsoma").val());
    var inputFechaEvento = (!fechaEvento?null:fechaEvento);
	var horaEvento = $("#inputHoraEventoAccSsoma").val();
	var unidadId = parseInt($("#selUnidadAccSsoma").val());
	var divisionId = parseInt($("#selDivisionAccSsoma").val());
	var areaId = parseInt($("#selAreaAccSsoma").val());
	var macroprocesoId = parseInt($("#selMacroprocesoAccSsoma").val());
	var lugarExacto = $("#inputLugarExactoAccSsoma").val();
	var snLocalEmpresa = parseInt($("input[name='radiosRespLocalEmpresaAccSsoma']:checked").val());
	var tipoEventoId = parseInt($("#selTipoEventoAccSsoma").val());

	if(inputFechaEvento == null || horaEvento.length == 0 || unidadId == -1 || divisionId == -1 || areaId == -1 || macroprocesoId == -1 ||
		lugarExacto.length == 0 || tipoEventoId == -1){
	    campoVacio = false;enfoqueAuxId = "inputFechaEventoAccSsoma";mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	var hasLesion = parseInt($("input[name='radiosRespHuboLesionAccSsoma']:checked").val());
    var categoriaLesionId,tipoTrabAccidentadoId,nombreAccidentado,numDocAccidentado,edadAccidentado,sexoId,puestoTraAccidentado,
		tipoContratoId,expPuestoTraAccidentado,jefeTrabAccidentado,tipoAccidenteId,turnoId,numHorasTraAccidentado,inputFechaInicioDescanso,
		inputFechaFinDescanso,descripAtencionPrimAuxilios,listPartesLesionSeleccionados = [],textoPartesLesionSeleccionados = "",
		numDiasDescanso;

	if(campoVacio && hasLesion == 1){
		categoriaLesionId = parseInt($("#selCategoriaLesionAccSsoma").val());
		tipoTrabAccidentadoId = parseInt($("#selTipoTrabAccidentadoAccSsoma").val());
		nombreAccidentado = $("#inputNomTrabAccidAccSsoma").val();
		numDocAccidentado = $("#inputNumDocTrabAccidAccSsoma").val();
		edadAccidentado = $("#inputEdadTrabAccidAccSsoma").val();
		sexoId = parseInt($("#selSexoAccSsoma").val());
		puestoTraAccidentado = $("#inputPuestoTraTrabAccidAccSsoma").val();
		tipoContratoId = parseInt($("#selTipoContratoAccSsoma").val());
		expPuestoTraAccidentado = $("#inputExpPuestoTraTrabAccidAccSsoma").val();
		jefeTrabAccidentado = $("#inputJefeTrabAccidAccSsoma").val();
		tipoAccidenteId = parseInt($("#selTipoAccidenteAccSsoma").val());
		turnoId = parseInt($("#selTurnoAccSsoma").val());
		numHorasTraAccidentado = $("#inputNumHorasTraAccidAccSsoma").val();
		var fechaInicioDescanso = convertirFechaTexto($("#inputFechaInicioDescAccSsoma").val());
		inputFechaInicioDescanso = (!fechaInicioDescanso?null:fechaInicioDescanso);
		var fechaFinDescanso = convertirFechaTexto($("#inputFechaFinDescAccSsoma").val());
		inputFechaFinDescanso = (!fechaFinDescanso?null:fechaFinDescanso);
		descripAtencionPrimAuxilios = $("#textDescAtenPrimAuxAccSsoma").val();

		listPartesLesionAn.forEach(function(val){
			var isSeleccionado = ($("#checkAsignadoPartLesAccSsomaSelec"+val.id).prop("checked")?1:0);

			if(isSeleccionado == 1){
				listPartesLesionSeleccionados.push({id:val.id});

				textoPartesLesionSeleccionados += (textoPartesLesionSeleccionados.length == 0?val.id:","+val.id);
			}
		});

		if(categoriaLesionId == -1 || tipoTrabAccidentadoId == -1 || nombreAccidentado.length == 0 || numDocAccidentado.length == 0 ||
			edadAccidentado.length == 0 || sexoId == -1 || puestoTraAccidentado.length == 0 || tipoContratoId == -1 || expPuestoTraAccidentado.length == 0 ||
			jefeTrabAccidentado.length == 0 || tipoAccidenteId == -1 || turnoId == -1 || numHorasTraAccidentado.length == 0 || (tipoEventoId == 1 &&
			(inputFechaInicioDescanso == null || inputFechaFinDescanso == null)) || descripAtencionPrimAuxilios.length == 0 || textoPartesLesionSeleccionados.length == 0){
			campoVacio = false;enfoqueAuxId = "selTipoContratoAccSsoma";mensajeUx = "<label>Debe completar los campos activos asociados a la lesión.</label>";
		}

		if(campoVacio && tipoEventoId == 1 && inputFechaInicioDescanso != null && inputFechaFinDescanso != null){
			numDiasDescanso = restaFechas($("#inputFechaInicioDescAccSsoma").val(),$("#inputFechaFinDescAccSsoma").val());

			if(numDiasDescanso < 0){
				campoVacio = false;enfoqueAuxId = "inputFechaInicioDescAccSsoma";
				mensajeUx = "<label>La 'fecha fin - descanso' no puede ser menor a la 'fecha inicio - descanso'.</label>";
			}
		}
	}

	var hasDanhioPropiedad = parseInt($("input[name='radiosRespHuboDanhioPropAccSsoma']:checked").val());
	var danioPropiedadId;

	if(campoVacio && hasDanhioPropiedad == 1){
		danioPropiedadId = parseInt($("#selDanioPropiedadAccSsoma").val());

		if(danioPropiedadId == -1){
			campoVacio = false;enfoqueAuxId = "selDanioPropiedadAccSsoma";mensajeUx = "<label>Debe completar el campo activo asociado al daño a la propiedad.</label>";
		}
	}

	var hasImpactoAmbiental = parseInt($("input[name='radiosRespHuboImpactoAmbAccSsoma']:checked").val());
	var danioAmbientalId;

	if(campoVacio && hasImpactoAmbiental == 1){
		danioAmbientalId = parseInt($("#selDanioAmbientalAccSsoma").val());

		if(danioAmbientalId == -1){
			campoVacio = false;enfoqueAuxId = "selDanioAmbientalAccSsoma";mensajeUx = "<label>Debe completar el campo activo asociado al impacto ambiental.</label>";
		}
	}

	var numPersonasAfectadas = $("#inputNumPerAfecAccSsoma").val();
	var riesgoPotencialId = parseInt($("#selRiesgoPotencialAccSsoma").val());
	var factorRiesgoId = parseInt($("#selFactorRiesgoAccSsoma").val());
	var peligroAcId = parseInt($("#selPeligroAcAccSsoma").val());
	var nombreTestigoUno = $("#inputNombreTestigo1AccSsoma").val();
	var nombreTestigoDos = $("#inputNombreTestigo2AccSsoma").val();
	var descripEvento = $("#textDescEventoAccSsoma").val();
	var descripLesionDanhio = $("#textDescLesionDanhioAccSsoma").val();
	var accInmDespuesEvento = $("#textAccInmTomDesEventoAccSsoma").val();

	if(campoVacio && (numPersonasAfectadas.length == 0 || riesgoPotencialId == -1 || factorRiesgoId == -1 || peligroAcId == -1 || descripEvento.length == 0 ||
		descripLesionDanhio.length == 0 || accInmDespuesEvento.length == 0)){
		campoVacio = false;enfoqueAuxId = "textDescEventoAccSsoma";mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	var evidenciaUnoNombre = $("#inputEviUnoRegAccSsoma").val();
	var evidenciaDosNombre = $("#inputEviDosRegAccSsoma").val();
	var evidenciaTresNombre = $("#inputEviTresRegAccSsoma").val();

    if(campoVacio && (evidenciaUnoNombre == "VOLVER A SUBIR" || evidenciaDosNombre == "VOLVER A SUBIR" || evidenciaTresNombre == "VOLVER A SUBIR")){
		campoVacio = false;enfoqueAuxId = "inputEviUnoRegAccSsoma";mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
    }

	var numDiasDiffCorreo = restaFechas('2025-01-01',$("#inputFechaEventoAccSsoma").val());

	var habilitadoCorreoRegistroCorreo = (accidentesSsomaId == 0 && numDiasDiffCorreo >= 0?1:0);

    if(campoVacio){
	$("#btnRegInicialAccIncSsoma").prop("disabled",true);
	
		var dataParam={
			id:accidentesSsomaId,fechaEvento:inputFechaEvento,horaEvento:horaEvento,unidadId:unidadId,divisionId:divisionId,areaId:areaId,
			macroprocesoId:macroprocesoId,lugarExacto:lugarExacto,tipoEventoId:tipoEventoId,numPersonasAfectadas:numPersonasAfectadas,
			riesgoPotencialId:riesgoPotencialId,factorRiesgoId:factorRiesgoId,peligroAcId:peligroAcId,nombreTestigoUno:nombreTestigoUno,
			nombreTestigoDos:nombreTestigoDos,descripEvento:descripEvento,descripLesionDanhio:descripLesionDanhio,accInmDespuesEvento:accInmDespuesEvento,
			empresaId:parseInt(getSession("gestopcompanyid")),trabajadorId:parseInt(getSession("trabajadorGosstId")),snLocalEmpresa:snLocalEmpresa
		};

		if(hasLesion == 1){
			dataParam.danioLesionAn = {categoriaLesionId:categoriaLesionId,tipoTrabAccidentadoId:tipoTrabAccidentadoId,nombreAccidentado:nombreAccidentado,
				numDocAccidentado:numDocAccidentado,edadAccidentado:edadAccidentado,sexoId:sexoId,puestoTraAccidentado:puestoTraAccidentado,tipoContratoId:tipoContratoId,
				expPuestoTraAccidentado:expPuestoTraAccidentado,jefeTrabAccidentado:jefeTrabAccidentado,tipoAccidenteId:tipoAccidenteId,turnoId:turnoId,
				numHorasTraAccidentado:numHorasTraAccidentado,fechaInicioDescanso:(tipoEventoId == 1?inputFechaInicioDescanso:null),fechaFinDescanso:(tipoEventoId == 1?inputFechaFinDescanso:null),
				descripAtencionPrimAuxilios:descripAtencionPrimAuxilios,partesLesionadas:listPartesLesionSeleccionados,textoPartesLesionSeleccionados:textoPartesLesionSeleccionados,
				numDiasDescanso:(tipoEventoId == 1?numDiasDescanso:null)
			};
		}

		dataParam.estadoAccidenteSsomaId = (hasLesion == 1?1:2);dataParam.danioPropiedadId = (hasDanhioPropiedad == 1?danioPropiedadId:null);
		dataParam.danioAmbientalId = (hasImpactoAmbiental == 1?danioAmbientalId:null);

        callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/save',dataParam,1,0,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":
		    guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviUnoRegAccSsoma",bitsEvidenciaExamen,0,0,
		    "/accidente/amazon_s3/accidente_ssoma/evidencia_primera/save","evidencia-an/evidencia-primera",function(){
		      guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviDosRegAccSsoma",bitsEvidenciaExamen,0,0,
		      "/accidente/amazon_s3/accidente_ssoma/evidencia_segunda/save","evidencia-an/evidencia-segunda",function(){
		        guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviTresRegAccSsoma",bitsEvidenciaExamen,0,1,
			"/accidente/amazon_s3/accidente_ssoma/evidencia_tercera/save","evidencia-an/evidencia-tercera",function(){
		          $("#modalRegistroAccidentesSsoma").modal("hide");
		          
		          var nuevoIdAux = data.nuevoId;

			  mensajeUx = "<label>El registro del evento fue guardado con éxito.</label>";
			  mensajesUx(mensajeUx,1,"","ActualizarAccSsoma");

			  $("#modalMensajeUxActualizarAccSsoma").one("hidden.bs.modal",function(){
			      habilitarAccidentesSsoma();
			  });  
		            
			  setTimeout(function(){
		            var dataParamAux={
			      id:nuevoIdAux,unidadId:unidadId,riesgoPotencialId:riesgoPotencialId,empresaId:parseInt(getSession("gestopcompanyid"))
		            };

		            callAjaxPostSimpleVersionDos(habilitadoCorreoRegistroCorreo,URL+'/accidente/accidente_ssoma/correo_registro_evento',dataParamAux,0,0,function(data){
			      switch(data.CODE_RESPONSE){
			        case "05":
			          console.log("Correo del registro accidente/incidente SSOMA enviado con éxito.");

				  break;

			        default:
			          console.log("Evento registrado, pero ocurrió un error al enviar el correo.");
			      }
		            });
			  },0);
		        });
		      });
		    });

		    break;
		
	        default:
		    alert("Ocurrió un error al guardar el registro del evento.");
	    }
        });
    }else{
	$("#modalRegistroAccidentesSsoma").modal("hide");
	mensajesUx(mensajeUx,2,"","ValidacionAccSsoma");

	$("#modalMensajeUxValidacionAccSsoma").on("hidden.bs.modal",function(){
	    $("#modalRegistroAccidentesSsoma").modal("show");

	    document.getElementById(enfoqueAuxId).focus();
	});
    }
}

function descargarExcelConsolidadoReportePreliminar(){
	window.open(URL+"/accidente/accidente-nuevo/excel?idEvidenciaAN="+accidentesSsomaObj.id+"&mdfId="+getSession("unidadGosstId") +
		"&empresaId="+getSession("gestopcompanyid")+"&trabajadorId="+getSession("trabajadorGosstId")+"&idUsuario="+getSession("gestopusuarioid") +
		(accidentesSsomaObj.danioLesionAnId > 0?"&idDanioLesion="+accidentesSsomaObj.danioLesionAnId:""),'_blank');
}

function ocultarFinalizarValidacionMedicaRegistroAccidentesSsoma(){
	$("#modalRegistroAccidentesSsoma").modal("hide");
}

function verFinalizarValidacionMedicaRegistroAccidentesSsoma(){
	$("#modalRegistroAccidentesSsoma").remove();

	accidentesSsomaId = accidentesSsomaObj.id;enfoqueCheckListParteLesion = 0;

	var selTipoEventoAccSsoma = crearSelectOneMenu("selTipoEventoAccSsoma","habilitarDescansoMedicoInicialAccidenteSsoma()",
		listTipoEventoAn,accidentesSsomaObj.tipoEventoAn.id,"id","nombre");

	var selCategoriaLesionAccSsoma = crearSelectOneMenu("selCategoriaLesionAccSsoma","",listCategoriaLesionAn,
		accidentesSsomaObj.danioLesionAn.categoriaLesionAn.id,"id","nombre");

	var selTipoAccidenteAccSsoma = crearSelectOneMenu("selTipoAccidenteAccSsoma","",listTipoAccidenteAn,
		accidentesSsomaObj.danioLesionAn.tipoAccidenteAn.id,"id","nombre");

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nombre del accidentado",inputForm:accidentesSsomaObj.danioLesionAn.nombreAccidentado},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de evento",inputForm:selTipoEventoAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Categoria lesión",inputForm:selCategoriaLesionAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de accidente",inputForm:selTipoAccidenteAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Partes lesionadas",
		 inputForm:"<a class='efectoLink' onclick='verCheckListPartesLesionadasAccidenteSsoma()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelPartesLesionadasAccSsoma"},
		{sugerencia:"",clase:"campos-descanso-inicial",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",clase:"campos-descanso-inicial",anchoLabel:"",anchoDiv:"",label:"Fecha inicio - descanso",
		 inputForm:"<input id='inputFechaInicioDescAccSsoma' onchange='calculoNumDiasDescansoAccidenteSsoma()' type='date' class='form-control'>"},
		{sugerencia:"",clase:"campos-descanso-inicial",anchoLabel:"",anchoDiv:"",label:"Fecha fin - descanso",
		 inputForm:"<input id='inputFechaFinDescAccSsoma' onchange='calculoNumDiasDescansoAccidenteSsoma()' type='date' class='form-control'>"},
		{sugerencia:"",clase:"campos-descanso-inicial",anchoLabel:"",anchoDiv:"",label:"N° días de descanso",inputForm:"",divContainer:"divNumDiasDescansoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFinalizarValidacionMedicaRegistroAccidentesSsoma()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarFinalizarValidacionMedicaRegistroAccidentesSsoma()'>" +
				       "<i class='fa fa-floppy-o'></i> Guardar" +
				   "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroAccidentesSsoma",nombre:"<i class='fa fa-pencil-square-o'></i> Finalizar validación médica",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	crearCheckListGeneral("modalRegistroAccidentesSsoma","Partes lesionadas",
		"PartLesAccSsomaSelec",listPartesLesionAn,"PartesLesionadasAccidenteSsoma",cargarCheckListPartesLesionadasAccidenteSsoma);

	if(accidentesSsomaObj.tipoEventoAn.id == 1){
		$("#inputFechaInicioDescAccSsoma").val(convertirFechaInput(accidentesSsomaObj.danioLesionAn.fechaInicioDescanso));
		$("#inputFechaFinDescAccSsoma").val(convertirFechaInput(accidentesSsomaObj.danioLesionAn.fechaFinDescanso));
	}

	calculoNumDiasDescansoAccidenteSsoma();habilitarDescansoMedicoInicialAccidenteSsoma();
}

function calculoNumDiasDescansoAccidenteSsoma(){
	var fechaInicioDescanso = $("#inputFechaInicioDescAccSsoma").val();
	var fechaFinDescanso = $("#inputFechaFinDescAccSsoma").val();

	if(fechaInicioDescanso.length > 0 && fechaFinDescanso.length > 0){
		var numDiasDescanso = restaFechas(fechaInicioDescanso,fechaFinDescanso);

		if(numDiasDescanso >= 0) {
			$("#divNumDiasDescansoAccSsoma").html(numDiasDescanso);
		}else{
			$("#divNumDiasDescansoAccSsoma").html("<label>*La 'fecha fin - descanso' no puede ser menor a la 'fecha inicio - descanso'.</label>");
		}
	}else{
		$("#divNumDiasDescansoAccSsoma").html("<label>*Debe ingresar unas 'fecha inicio - descanso' y 'fecha fin - descanso' válidas.</label>");
	}
}

function guardarFinalizarValidacionMedicaRegistroAccidentesSsoma(){
	var campoVacio = true;

	var tipoEventoId = parseInt($("#selTipoEventoAccSsoma").val());
	var categoriaLesionId = parseInt($("#selCategoriaLesionAccSsoma").val());
	var tipoAccidenteId = parseInt($("#selTipoAccidenteAccSsoma").val());
	var fechaInicioDescanso = convertirFechaTexto($("#inputFechaInicioDescAccSsoma").val());
	var inputFechaInicioDescanso = (!fechaInicioDescanso?null:fechaInicioDescanso);
	var fechaFinDescanso = convertirFechaTexto($("#inputFechaFinDescAccSsoma").val());
	var inputFechaFinDescanso = (!fechaFinDescanso?null:fechaFinDescanso);
	var listPartesLesionSeleccionados = [],textoPartesLesionSeleccionados = "";

	listPartesLesionAn.forEach(function(val){
		var isSeleccionado = ($("#checkAsignadoPartLesAccSsomaSelec"+val.id).prop("checked")?1:0);

		if(isSeleccionado == 1){
			listPartesLesionSeleccionados.push({id:val.id});

			textoPartesLesionSeleccionados += (textoPartesLesionSeleccionados.length == 0?val.id:","+val.id);
		}
	});

	if(categoriaLesionId == -1 || tipoAccidenteId == -1 || (tipoEventoId == 1 && (inputFechaInicioDescanso == null || inputFechaFinDescanso == null)) ||
		textoPartesLesionSeleccionados.length == 0){
		campoVacio = false;mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	if(campoVacio && tipoEventoId == 1 && inputFechaInicioDescanso != null && inputFechaFinDescanso != null) {
		var numDiasDescanso = restaFechas($("#inputFechaInicioDescAccSsoma").val(),$("#inputFechaFinDescAccSsoma").val());

		if(numDiasDescanso < 0){
			campoVacio = false;mensajeUx = "<label>La 'fecha fin - descanso' no puede ser menor a la 'fecha inicio - descanso'.</label>";
		}
	}

	if(campoVacio){
		var dataParam={
			id:accidentesSsomaObj.danioLesionAnId,categoriaLesionId:categoriaLesionId,tipoAccidenteId:tipoAccidenteId,fechaInicioDescanso:(tipoEventoId == 1?inputFechaInicioDescanso:null),
			fechaFinDescanso:(tipoEventoId == 1?inputFechaFinDescanso:null),partesLesionadas:listPartesLesionSeleccionados,textoPartesLesionSeleccionados:textoPartesLesionSeleccionados,
			numDiasDescanso:(tipoEventoId == 1?numDiasDescanso:null),trabajadorId:parseInt(getSession("trabajadorGosstId")),evidenciaAnId:accidentesSsomaId,
			tipoEventoId:tipoEventoId
		};

		callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/validacion_medica/save',dataParam,1,1,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
				    $("#modalRegistroAccidentesSsoma").modal("hide");

					mensajeUx = "<label>El registro del evento fue validado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarAccSsoma");

					$("#modalMensajeUxActualizarAccSsoma").on("hidden.bs.modal",function(){
						habilitarAccidentesSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al validar el registro del evento.");
			}
		});
	}else{
		$("#modalRegistroAccidentesSsoma").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionAccSsoma");

		$("#modalMensajeUxValidacionAccSsoma").on("hidden.bs.modal",function(){
			$("#modalRegistroAccidentesSsoma").modal("show");
		});
	}
}

var descMedAdiAccSsomaId,indexDescMedAdiAccSsoma,objDescansoMedicoAdiAccSsoma = {};
var listDescansosMedicoAdiAccSsoma = [];

function toggleMenuOpcionDescansoMedicoAdicionalAccSsoma(obj,pindex){
	objDescansoMedicoAdiAccSsoma = listDescansosMedicoAdiAccSsoma[pindex];
	indexDescMedAdiAccSsoma = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesDescansoMedicoAdicionalAccSsoma=[
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
	 functionClick:function(data){registroDescansoMedicoAdicionalAccSsoma(1)}},
	{id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
	 functionClick:function(data){eliminarDescansoMedicoAdicionalAccSsoma()}}
];

function marcarSubOpcionDescansoMedicoAdicionalAccSsoma(pindex){
	funcionalidadesDescansoMedicoAdicionalAccSsoma[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalDescMedAdiAccSsoma(){
	$("#modalPrincipalDescansoMedicoAdicionalAccSsoma").modal("hide");

	if(actualizarPrincipalAccSsoma == 1){
		habilitarAccidentesSsoma();
	}
}

function verDescansoMedicoAdicionalAccSsoma(){
	$("#modalPrincipalDescansoMedicoAdicionalAccSsoma").remove();

	actualizarPrincipalAccSsoma = 0;

	var listModal={
		id:"modalPrincipalDescansoMedicoAdicionalAccSsoma",nombre:"Descanso médico",
		contenido:"<div id='estadoMovilPrincipalDescMedAdiAccSsoma'></div>",btnCerrarHabilitado:0
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	cargarDescansoMedicoAdicionalAccSsoma();
}

function cargarDescansoMedicoAdicionalAccSsoma(){
	$("#estadoMovilPrincipalDescMedAdiAccSsoma").html("");

	var dataParam={
		evidenciaAnId:accidentesSsomaObj.id
	};

	callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/descanso_medico_adicional',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];
			var textTotalRegistros= "";

			listDescansosMedicoAdiAccSsoma = data.listDescansosMedicoAdiAccSsoma;

			listDescansosMedicoAdiAccSsoma.forEach(function(val,index){
				var btnOpcion="",menuOpcion="";

				menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
				    funcionalidadesDescansoMedicoAdicionalAccSsoma.forEach(function(val1,index1){
					    menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionDescansoMedicoAdicionalAccSsoma("+index1+")'>"+val1.nombre+"</li>";
					});
				menuOpcion += "</ul>";

				btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionDescansoMedicoAdicionalAccSsoma(this,"+index+")'>" +
					    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
					"</a>";

				var evidenciaNombre = (val.evidenciaDiasDescansoNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
					"href='"+URL+"/accidente/amazon_s3/accidente_ssoma/descanso_medico_adicional/evidencia_dias_descanso?"+"id="+val.id+"'>"+val.evidenciaDiasDescansoNombre+"</a>");

				var listTotal=[];

				if(val.numDiasDescansoPrevio > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha inicio - descanso (previo):",inputForm:val.fechaInicioDescansoPrevioTexto+btnOpcion+menuOpcion},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha fin - descanso (previo):",inputForm:val.fechaFinDescansoPrevioTexto},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-home'></i> N° de días de descanso (previo):",inputForm:val.numDiasDescansoPrevio},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});

					btnOpcion = "";menuOpcion = "";
				}

				listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha inicio - descanso:",inputForm:val.fechaInicioDescansoTexto+btnOpcion+menuOpcion},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha fin - descanso:",inputForm:val.fechaFinDescansoTexto},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-home'></i> N° de días de descanso:",inputForm:val.numDiasDescanso},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});

				if(val.numDiasDescansoPrevio > 0){
					var numDiasDescansoTotal = val.numDiasDescansoPrevio+val.numDiasDescanso;

					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-home'></i> N° total de días de descanso:",inputForm:numDiasDescansoTotal},
						{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
				}

				listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Evidencia de cumplimiento:",inputForm:evidenciaNombre});

				if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
				}

				if(val.fechaRegistroTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
						inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
				}

				if(val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
						inputForm:val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")")});
				}

				textTotalRegistros += "<div class='eventoGeneral'>" +
					                      "<form class='eventoGeneral'>";
				    listTotal.forEach(function(val,index){
					    textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
				    });
				textTotalRegistros +=     "</form>" +
					                  "</div>";
			});

			listPanelesPrincipal.push({id:"volverAccidenteSssomaDescMedAdi",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalDescMedAdiAccSsoma()",
				btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""});

			if(listDescansosMedicoAdiAccSsoma.length == 0){
				listPanelesPrincipal.push({id:"nuevoRegDescansoMedicoAdicional",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroDescansoMedicoAdicionalAccSsoma(0)",
					btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar descanso médico",contenido:""});
			}else{
				listPanelesPrincipal.push({id:"registroDescandoMedicoAdicional",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
					btnIconoAux:"",btnTitleAux:"",nombre:"Descanso médico registrado",contenido:textTotalRegistros});
			}

			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalDescMedAdiAccSsoma");

			$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
		}else{
			console.log("NOPNPO")
		}
	});
}

function ocultarRegistroDescansoMedicoAdicionalAccSsoma(){
	$("#modalRegistroDescansoMedicoAdicional").modal("hide");$("#modalPrincipalDescansoMedicoAdicionalAccSsoma").modal("show");
}

function registroDescansoMedicoAdicionalAccSsoma(opcRegistro){
	var opcionRegistro = parseInt(opcRegistro);

	$("#modalPrincipalDescansoMedicoAdicionalAccSsoma").modal("hide");$("#modalRegistroDescansoMedicoAdicional").remove();

	descMedAdiAccSsomaId = (opcionRegistro == 0?0:objDescansoMedicoAdiAccSsoma.id);

	var contenido = "";

	var textoFechaInicioDescanso = "Fecha inicio - descanso",idFechaInicioDescanso = "inputFechaInicioDescMedAdiAccSsoma",
		textoFechaFinDescanso = "Fecha fin - descanso",idFechaFinDescanso = "inputFechaFinDescMedAdiAccSsoma",
		idResultadoDif = "divNumDiasDescansoDescMedAdiAccSsoma";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:textoFechaInicioDescanso,inputForm:"<input id='"+idFechaInicioDescanso+"' onchange='calculoNumeroDiasTotal(\"" +
		 textoFechaInicioDescanso+"\",\""+idFechaInicioDescanso+"\",\""+textoFechaFinDescanso+"\",\""+idFechaFinDescanso+"\",\""+idResultadoDif+"\")' type='date' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:textoFechaFinDescanso,inputForm:"<input id='"+idFechaFinDescanso+"' onchange='calculoNumeroDiasTotal(\"" +
		 textoFechaInicioDescanso+"\",\""+idFechaInicioDescanso+"\",\""+textoFechaFinDescanso+"\",\""+idFechaFinDescanso+"\",\""+idResultadoDif+"\")' type='date' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"N° días de descanso",inputForm:"",divContainer:idResultadoDif},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia de cumplimiento",inputForm:"",divContainer:"divEviCumplimientoDescMedAdiAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroDescansoMedicoAdicionalAccSsoma()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
		       "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroDescansoMedicoAdicionalAccSsoma()'>" +
				       "<i class='fa fa-floppy-o'></i> Guardar" +
				   "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroDescansoMedicoAdicional",nombre:"<i class='fa fa-pencil-square-o'></i> Registro descanso médico",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	if(opcionRegistro == 1){
		$("#inputFechaInicioDescMedAdiAccSsoma").val(convertirFechaInput(objDescansoMedicoAdiAccSsoma.fechaInicioDescanso));
		$("#inputFechaFinDescMedAdiAccSsoma").val(convertirFechaInput(objDescansoMedicoAdiAccSsoma.fechaFinDescanso));
	}

	var options={
		container:"#divEviCumplimientoDescMedAdiAccSsoma",functionCall:function(){
			validacionSubirEvidencia("CumpliDescMedAdiAccSsoma",bitsEvidenciaExamen,"modalRegistroDescansoMedicoAdicional");
		},descargaUrl:"/accidente/amazon_s3/accidente_ssoma/descanso_medico_adicional/evidencia_dias_descanso?"+"id="+descMedAdiAccSsomaId,
		esNuevo:(opcionRegistro == 0 || objDescansoMedicoAdiAccSsoma.evidenciaDiasDescansoNombre.length == 0?true:false),
		idAux:"CumpliDescMedAdiAccSsoma",evidenciaNombre:(opcionRegistro == 0?"":objDescansoMedicoAdiAccSsoma.evidenciaDiasDescansoNombre)
	};

	crearFormEvidenciaCompleta(options);

	calculoNumeroDiasTotal(textoFechaInicioDescanso,idFechaInicioDescanso,textoFechaFinDescanso,idFechaFinDescanso,idResultadoDif);
}

function guardarRegistroDescansoMedicoAdicionalAccSsoma(){
	var campoVacio = true;

	var fechaInicioDescanso = convertirFechaTexto($("#inputFechaInicioDescMedAdiAccSsoma").val());
	var inputFechaInicioDescanso = (!fechaInicioDescanso?null:fechaInicioDescanso);
	var fechaFinDescanso = convertirFechaTexto($("#inputFechaFinDescMedAdiAccSsoma").val());
	var inputFechaFinDescanso = (!fechaFinDescanso?null:fechaFinDescanso);

	if(inputFechaInicioDescanso == null || inputFechaFinDescanso == null){
		campoVacio = false;mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	if(campoVacio && inputFechaInicioDescanso != null && inputFechaFinDescanso != null) {
		var numDiasDescanso = restaFechas($("#inputFechaInicioDescMedAdiAccSsoma").val(),$("#inputFechaFinDescMedAdiAccSsoma").val());

		if(numDiasDescanso < 0){
			campoVacio = false;mensajeUx = "<label>La 'fecha fin - descanso' no puede ser menor a la 'fecha inicio - descanso'.</label>";
		}
	}

	var evidenciaNombre = $("#inputEviCumpliDescMedAdiAccSsoma").val();

	if(campoVacio && evidenciaNombre == "VOLVER A SUBIR"){
		campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
	}

	if(campoVacio){
		var dataParam={
			id:descMedAdiAccSsomaId,fechaInicioDescanso:inputFechaInicioDescanso,fechaFinDescanso:inputFechaFinDescanso,numDiasDescanso:numDiasDescanso,
			trabajadorId:parseInt(getSession("trabajadorGosstId")),evidenciaAnId:accidentesSsomaObj.id
		};

		callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/descanso_medico_adicional/save',dataParam,1,0,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviCumpliDescMedAdiAccSsoma",bitsEvidenciaExamen,0,1,
					"/accidente/amazon_s3/accidente_ssoma/descanso_medico_adicional/evidencia_dias_descanso/save","dias-descanso/evidencia-dias-descanso",function(){
					    $("#modalRegistroDescansoMedicoAdicional").modal("hide");

						mensajeUx="<label>El registro descanso médico fue guardado con éxito.</label>";
						mensajesUx(mensajeUx,1,"","ActualizarDescMedAdiAccSsoma");

						$("#modalMensajeUxActualizarDescMedAdiAccSsoma").on("hidden.bs.modal",function(){
							$("#modalPrincipalDescansoMedicoAdicionalAccSsoma").modal("show");actualizarPrincipalAccSsoma = 1;
							cargarDescansoMedicoAdicionalAccSsoma();
						});
					});

					break;

				default:
					alert("Ocurrió un error al guardar el registro descanso médico.");
			}
		});
	}else{
		$("#modalRegistroDescansoMedicoAdicional").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionDescMedAdiAccSsoma");

		$("#modalMensajeUxValidacionDescMedAdiAccSsoma").on("hidden.bs.modal",function(){
			$("#modalRegistroDescansoMedicoAdicional").modal("show");
		});
	}
}

function eliminarDescansoMedicoAdicionalAccSsoma(){
	$("#modalPrincipalDescansoMedicoAdicionalAccSsoma").modal("hide");

	mensajeUx="<label>¿Está seguro de eliminar este registro descanso médico?</label>";
	mensajesUx(mensajeUx,3,"","EliminarDescMedAdiAccSsoma");

	$("#btnDevolverValorEliminarDescMedAdiAccSsoma").on("click",function(){
		var dataParam={
			id:objDescansoMedicoAdiAccSsoma.id,evidenciaAnId:accidentesSsomaObj.id,bucketNombre:BUCKETAMAZONS3
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/descanso_medico_adicional/delete',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx="<label>El registro descanso médico fue eliminado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarDescMedAdiAccSsoma");

					$("#modalMensajeUxActualizarDescMedAdiAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalDescansoMedicoAdicionalAccSsoma").modal("show");actualizarPrincipalAccSsoma = 1;
						cargarDescansoMedicoAdicionalAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al eliminar este registro descanso médico!");
			}
		});
	});

	$("#btnRegresarPrevioEliminarDescMedAdiAccSsoma").on("click",function(){
		$("#modalPrincipalDescansoMedicoAdicionalAccSsoma").modal("show");
	});
}

var investEventoAccSsomaId,indexInvestEventoAccSsoma,objInvestEventoAccSsoma = {},actualizarIndInvestEventoAccSsoma;
var listInvestigacionesEventoAccSsoma = [];

function toggleMenuOpcionInvestigacionEventoAccSsoma(obj,pindex){
	objInvestEventoAccSsoma = listInvestigacionesEventoAccSsoma[pindex];
	indexInvestEventoAccSsoma = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesInvestigacionEventoAccSsoma=[
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar registro",
	 functionClick:function(data){registroInvestigacionEventoAccSsoma(1)}},
	{id:"opcVerCauInmed",nombre:"<i class='fa fa-eye'></i> Ver causas inmediatas",
	 functionClick:function(data){verCausasInmediatasInvestEventoAccSsoma()}},
	{id:"opcVerCauBasica",nombre:"<i class='fa fa-eye'></i> Ver causas básicas",
	 functionClick:function(data){verCausasBasicasInvestEventoAccSsoma()}},
	// {id:"opcVerFalloSistGes",nombre:"<i class='fa fa-eye'></i> Ver fallos de sistema de gestión",
	//  functionClick:function(data){verFallosSistemaGestionInvestEventoAccSsoma()}},
	{id:"opcVerFacOrgEstandar",nombre:"<i class='fa fa-eye'></i> Ver factores de la organización estándar",
	 functionClick:function(data){verFactoresOrganizacionEstandarInvestEventoAccSsoma()}},
	{id:"opcVerEviExtras",nombre:"<i class='fa fa-eye'></i> Ver evidencias extras",
	 functionClick:function(data){verEvidenciasExtrasInvestEventoAccSsoma()}},
	{id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar registro",
	 functionClick:function(data){eliminarInvestigacionEventoAccSsoma()}}
];

function marcarSubOpcionInvestigacionEventoAccSsoma(pindex){
	funcionalidadesInvestigacionEventoAccSsoma[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalInvestEventoAccSsoma(){
	$("#modalPrincipalInvestigacionEventoAccSsoma").modal("hide");

	if(actualizarPrincipalAccSsoma == 1){
		habilitarAccidentesSsoma();
	}
}

function verInvestigacionEventoAccSsoma(){
	$("#modalPrincipalInvestigacionEventoAccSsoma").remove();

	actualizarPrincipalAccSsoma = 0;

	var listModal={
		id:"modalPrincipalInvestigacionEventoAccSsoma",nombre:"Investigación del evento",
		contenido:"<div id='estadoMovilPrincipalInvestEventoAccSsoma'></div>",btnCerrarHabilitado:0
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	cargarInvestigacionEventoAccSsoma();
}

function cargarInvestigacionEventoAccSsoma(){
	$("#estadoMovilPrincipalInvestEventoAccSsoma").html("");

	var dataParam={
		evidenciaAnId:accidentesSsomaObj.id
	};

	callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];
			var textTotalRegistros= "";

			listInvestigacionesEventoAccSsoma = data.listInvestigacionesEventoAccSsoma;

			listInvestigacionesEventoAccSsoma.forEach(function(val,index){
				var btnOpcion="",menuOpcion="";

				menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
				funcionalidadesInvestigacionEventoAccSsoma.forEach(function(val1,index1){
					menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionInvestigacionEventoAccSsoma("+index1+")'>"+val1.nombre+"</li>";
				});
				menuOpcion += "</ul>";

				btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionInvestigacionEventoAccSsoma(this,"+index+")'>" +
					    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
					"</a>";

				var evidenciaUnoNombre = (val.evidenciaUnoNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
					"href='"+URL+"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencia_uno?"+"id="+val.id+"'>"+val.evidenciaUnoNombre+"</a>");

				var evidenciaDosNombre = (val.evidenciaDosNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
					"href='"+URL+"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencia_dos?"+"id="+val.id+"'>"+val.evidenciaDosNombre+"</a>");

				var evidenciaTresNombre = (val.evidenciaTresNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
					"href='"+URL+"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencia_tres?"+"id="+val.id+"'>"+val.evidenciaTresNombre+"</a>");

				var listTotal=[
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha inicio de la investigación:",inputForm:val.fechaInicioTexto+btnOpcion+menuOpcion},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha fin de la investigación:",inputForm:val.fechaFinTexto},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-book'></i> N° de causas inmediatas registradas:",inputForm:val.numCausasInmediatasRegistradas},
					{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-book'></i> N° de causas básicas registradas:",inputForm:val.numCausasBasicasRegistradas},
					// {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-book'></i> N° de fallos de sistema de gestión registrados:",inputForm:val.numFallosSistemaGestionRegistrados},
					{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-book'></i> N° de factores de la organización estándar registrados:",inputForm:val.numFactoresOrgEstandarRegistrados},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Evidencia #01:",inputForm:evidenciaUnoNombre},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Evidencia #02:",inputForm:evidenciaDosNombre},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Evidencia #03:",inputForm:evidenciaTresNombre},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-book'></i> N° de evidencias extras registradas:",inputForm:val.numEvidenciasExtrasRegistradas},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-user'></i> Responsable:",inputForm:val.responsable.nombre},
				];

				if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
				}

				if(val.fechaRegistroTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
						inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
				}

				if(val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
						inputForm:val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")")});
				}

				textTotalRegistros += "<div class='eventoGeneral'>" +
					                      "<form class='eventoGeneral'>";
				    listTotal.forEach(function(val,index){
					    textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
				    });
				textTotalRegistros +=     "</form>" +
					                  "</div>";
			});

			listPanelesPrincipal.push({id:"volverAccidenteSssomaInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalInvestEventoAccSsoma()",
				btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""});

			if(listInvestigacionesEventoAccSsoma.length == 0){
				listPanelesPrincipal.push({id:"nuevoRegInvestigacionEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroInvestigacionEventoAccSsoma(0)",
					btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar investigación del evento",contenido:""});
			}else{
				listPanelesPrincipal.push({id:"registroInvestigacionEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
					btnIconoAux:"",btnTitleAux:"",nombre:"Investigación del evento registrado",contenido:textTotalRegistros});
			}

			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalInvestEventoAccSsoma");

			$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
		}else{
			console.log("NOPNPO")
		}
	});
}

function ocultarRegistroInvestigacionEventoAccSsoma(){
	$("#modalRegistroInvestigacionEvento").modal("hide");$("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");
}

function registroInvestigacionEventoAccSsoma(opcRegistro){
	var opcionRegistro = parseInt(opcRegistro);

	$("#modalPrincipalInvestigacionEventoAccSsoma").modal("hide");$("#modalRegistroInvestigacionEvento").remove();

	investEventoAccSsomaId = (opcionRegistro == 0?0:objInvestEventoAccSsoma.id);

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha inicio:",inputForm:"<input id='inputFechaInicioInvestEventoAccSsoma' type='date' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha fin:",inputForm:"<input id='inputFechaFinInvestEventoAccSsoma' type='date' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia #01:",inputForm:"",divContainer:"divEviUnoInvestEventoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia #02:",inputForm:"",divContainer:"divEviDosInvestEventoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia #03:",inputForm:"",divContainer:"divEviTresInvestEventoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Responsable:",
		 inputForm:"<input class='form-control' type='text' id='inputIngresarDniNombreTrabInvestEventoAccSsoma'>" +
				   "<div id='divSelAutoTrabPorNombreInvestEventoAccSsoma'></div>" +
				   "<label>*Buscar trabajador por N° de documento y/o nombre (debe ingresar 3 caracteres como mínimo).</label>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
			label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroInvestigacionEventoAccSsoma()'>" +
				"<i class='fa fa-times'></i> Cancelar" +
				"</button>",
			inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroInvestigacionEventoAccSsoma()'>" +
				"<i class='fa fa-floppy-o'></i> Guardar" +
				"</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroInvestigacionEvento",nombre:"<i class='fa fa-pencil-square-o'></i> Registro investigación del evento",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	if(opcionRegistro == 1){
		$("#inputFechaInicioInvestEventoAccSsoma").val(convertirFechaInput(objInvestEventoAccSsoma.fechaInicio));
		$("#inputFechaFinInvestEventoAccSsoma").val(convertirFechaInput(objInvestEventoAccSsoma.fechaFin));
		$("#inputIngresarDniNombreTrabInvestEventoAccSsoma").val(objInvestEventoAccSsoma.responsable.nombre);
	}

	var optionsUno={
		container:"#divEviUnoInvestEventoAccSsoma",functionCall:function(){
			validacionSubirEvidencia("UnoInvestEventoAccSsoma",bitsEvidenciaExamen,"modalRegistroInvestigacionEvento");
		},descargaUrl:"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencia_uno?"+"id="+investEventoAccSsomaId,
		esNuevo:(opcionRegistro == 0 || objInvestEventoAccSsoma.evidenciaUnoNombre.length == 0?true:false),
		idAux:"UnoInvestEventoAccSsoma",evidenciaNombre:(opcionRegistro == 0?"":objInvestEventoAccSsoma.evidenciaUnoNombre)
	};

	crearFormEvidenciaCompleta(optionsUno);

	var optionsDos={
		container:"#divEviDosInvestEventoAccSsoma",functionCall:function(){
			validacionSubirEvidencia("DosInvestEventoAccSsoma",bitsEvidenciaExamen,"modalRegistroInvestigacionEvento");
		},descargaUrl:"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencia_dos?"+"id="+investEventoAccSsomaId,
		esNuevo:(opcionRegistro == 0 || objInvestEventoAccSsoma.evidenciaDosNombre.length == 0?true:false),
		idAux:"DosInvestEventoAccSsoma",evidenciaNombre:(opcionRegistro == 0?"":objInvestEventoAccSsoma.evidenciaDosNombre)
	};

	crearFormEvidenciaCompleta(optionsDos);

	var optionsTres={
		container:"#divEviTresInvestEventoAccSsoma",functionCall:function(){
			validacionSubirEvidencia("TresInvestEventoAccSsoma",bitsEvidenciaExamen,"modalRegistroInvestigacionEvento");
		},descargaUrl:"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencia_tres?"+"id="+investEventoAccSsomaId,
		esNuevo:(opcionRegistro == 0 || objInvestEventoAccSsoma.evidenciaTresNombre.length == 0?true:false),
		idAux:"TresInvestEventoAccSsoma",evidenciaNombre:(opcionRegistro == 0?"":objInvestEventoAccSsoma.evidenciaTresNombre)
	};

	crearFormEvidenciaCompleta(optionsTres);

	buscarResponsableInvestEventoAccSsoma();
}

var listResponsablesInvestEventoAccSsoma=[];

function buscarResponsableInvestEventoAccSsoma(){
	var nombre = $("#inputIngresarDniNombreTrabInvestEventoAccSsoma").val().trim();

	if(nombre.length >= 3){
		var dataParam={
			trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid")),isBuscador:1
		};

		callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
			listResponsablesInvestEventoAccSsoma = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"No encontrado"}]:data.trabajadores);

			var selResponsableInvestEventoAccSsoma = crearSelectOneMenuOblig("selResponsableInvestEventoAccSsoma","",
				listResponsablesInvestEventoAccSsoma,"","trabajadorId","nombre");

			$("#divSelAutoTrabPorNombreInvestEventoAccSsoma").html(selResponsableInvestEventoAccSsoma);
			$("#inputIngresarDniNombreTrabInvestEventoAccSsoma").attr("onkeyup","buscarResponsableInvestEventoAccSsoma()");
		});
	}else{
		listResponsablesInvestEventoAccSsoma = [{trabajadorId:-1,nombre:"No encontrado"}];

		var selResponsableInvestEventoAccSsoma = crearSelectOneMenuOblig("selResponsableInvestEventoAccSsoma","",
			listResponsablesInvestEventoAccSsoma,"","trabajadorId","nombre");

		$("#divSelAutoTrabPorNombreInvestEventoAccSsoma").html(selResponsableInvestEventoAccSsoma);
		$("#inputIngresarDniNombreTrabInvestEventoAccSsoma").attr("onkeyup","buscarResponsableInvestEventoAccSsoma()");
	}
}

function guardarRegistroInvestigacionEventoAccSsoma(){
	var campoVacio = true;

	var fechaInicio = convertirFechaTexto($("#inputFechaInicioInvestEventoAccSsoma").val());
	var inputFechaInicio = (!fechaInicio?null:fechaInicio);
	var fechaFin = convertirFechaTexto($("#inputFechaFinInvestEventoAccSsoma").val());
	var inputFechaFin = (!fechaFin?null:fechaFin);
	var responsableId = parseInt($("#selResponsableInvestEventoAccSsoma").val());

	if(inputFechaInicio == null || inputFechaFin == null || responsableId == -1){
		campoVacio = false;mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	if(campoVacio && inputFechaInicio != null && inputFechaFin != null) {
		var numDiasDiferencia = restaFechas($("#inputFechaInicioInvestEventoAccSsoma").val(),$("#inputFechaFinInvestEventoAccSsoma").val());

		if(numDiasDiferencia < 0){
			campoVacio = false;mensajeUx = "<label>La 'fecha fin' no puede ser menor a la 'fecha inicio'.</label>";
		}
	}

	var evidenciaUnoNombre = $("#inputEviUnoInvestEventoAccSsoma").val();
	var evidenciaDosNombre = $("#inputEviDosInvestEventoAccSsoma").val();
	var evidenciaTresNombre = $("#inputEviTresInvestEventoAccSsoma").val();

	if(campoVacio && evidenciaUnoNombre == "VOLVER A SUBIR"){
		campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia #01.</label>";
	}else if(campoVacio && evidenciaDosNombre == "VOLVER A SUBIR"){
		campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia #02.</label>";
	}else if(campoVacio && evidenciaTresNombre == "VOLVER A SUBIR"){
		campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia #03.</label>";
	}

	if(campoVacio){
		var dataParam={
			id:investEventoAccSsomaId,fechaInicio:inputFechaInicio,fechaFin:inputFechaFin,responsableId:responsableId,
			trabajadorId:parseInt(getSession("trabajadorGosstId")),evidenciaAnId:accidentesSsomaObj.id
		};

		callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/save',dataParam,1,0,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviUnoInvestEventoAccSsoma",bitsEvidenciaExamen,0,0,
					"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencia_uno/save","informacion-evento-an/evidencia-uno",function(){
					 guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviDosInvestEventoAccSsoma",bitsEvidenciaExamen,0,0,
					 "/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencia_dos/save","informacion-evento-an/evidencia-dos",function(){
					  guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviTresInvestEventoAccSsoma",bitsEvidenciaExamen,0,1,
					  "/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencia_tres/save","informacion-evento-an/evidencia-tres",function(){
					      $("#modalRegistroInvestigacionEvento").modal("hide");

						  mensajeUx="<label>El registro investigación del evento fue guardado con éxito.</label>";
						  mensajesUx(mensajeUx,1,"","ActualizarInvestEventoAccSsoma");

						  $("#modalMensajeUxActualizarInvestEventoAccSsoma").on("hidden.bs.modal",function(){
							  $("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");actualizarPrincipalAccSsoma = 1;
							  cargarInvestigacionEventoAccSsoma();
						  });
					  });
					 });
					});

					break;

				default:
					alert("Ocurrió un error al guardar el registro descanso médico.");
			}
		});
	}else{
		$("#modalRegistroInvestigacionEvento").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionInvestEventoAccSsoma");

		$("#modalMensajeUxValidacionInvestEventoAccSsoma").on("hidden.bs.modal",function(){
			$("#modalRegistroInvestigacionEvento").modal("show");
		});
	}
}

function eliminarInvestigacionEventoAccSsoma(){
	$("#modalPrincipalInvestigacionEventoAccSsoma").modal("hide");

	if(objInvestEventoAccSsoma.numCausasInmediatasRegistradas == 0 && objInvestEventoAccSsoma.numCausasBasicasRegistradas == 0 &&
		objInvestEventoAccSsoma.numFallosSistemaGestionRegistrados == 0 && objInvestEventoAccSsoma.numEvidenciasExtrasRegistradas == 0){
		mensajeUx = "<label>¿Está seguro de eliminar este registro investigación del evento?</label>";
		mensajesUx(mensajeUx,3,"","ConfInvestEventoAccSsoma");

		$("#btnDevolverValorConfInvestEventoAccSsoma").on("click",function(){
			var dataParam={
				id:objInvestEventoAccSsoma.id,evidenciaAnId:accidentesSsomaObj.id,bucketNombre:BUCKETAMAZONS3
			};

			callAjaxPost(URL+'/accidente/accidente_ssoma/investigacion_evento/delete',dataParam,function(data){
				switch(data.CODE_RESPONSE){
					case "05":
						mensajeUx="<label>El registro investigación del evento fue eliminado con éxito.</label>";
						mensajesUx(mensajeUx,1,"","ActualizarInvestEventoAccSsoma");

						$("#modalMensajeUxActualizarInvestEventoAccSsoma").on("hidden.bs.modal",function(){
							$("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");actualizarPrincipalAccSsoma = 1;
							cargarInvestigacionEventoAccSsoma();
						});

						break;

					default:
						alert("Ocurrió un error al eliminar este registro investigación del evento!");
				}
			});
		});

		$("#btnRegresarPrevioConfInvestEventoAccSsoma").on("click",function(){
			$("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");
		});
	}else{
		mensajeUx="<label>No se puede eliminar este registro investigación del evento porque está asociado a uno o más " +
			"causas inmediatas, causas básicas, fallos de sistema gestion y/o evidencias extras.<label>";
		mensajesUx(mensajeUx,2,"","EliminarInvestEventoAccSsoma");

		$("#modalMensajeUxEliminarInvestEventoAccSsoma").on("hidden.bs.modal",function(){
			$("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");
		});
	}
}

var causaInmedInvestEventoAccSsomaId,indexCausaInmedInvestEventoAccSsoma,objCausaInmedInvestEventoAccSsoma = {};
var listCausasInmediatasInvestEventoAccSsoma = [],listTiposEventInvEveAccSsoma = [],
	listCausasInmediatasAuxInvEveAccSsoma = [];

function toggleMenuOpcionCausasInmediatasInvestEventoAccSsoma(obj,pindex){
	objCausaInmedInvestEventoAccSsoma = listCausasInmediatasInvestEventoAccSsoma[pindex];
	indexCausaInmedInvestEventoAccSsoma = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesCausasInmediatasInvestEventoAccSsoma=[
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
	 functionClick:function(data){registroCausasInmediatasInvestEventoAccSsoma(1)}},
	{id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
	 functionClick:function(data){eliminarCausasInmediatasInvestEventoAccSsoma()}}
];

function marcarSubOpcionCausasInmediatasInvestEventoAccSsoma(pindex){
	funcionalidadesCausasInmediatasInvestEventoAccSsoma[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalCausasInmediatasInvestEventoAccSsoma(){
	$("#modalPrincipalCausasInmediatasInvestEventoAccSsoma").modal("hide");$("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");

	if(actualizarIndInvestEventoAccSsoma == 1){
		cargarInvestigacionEventoAccSsoma();
	}
}

function verCausasInmediatasInvestEventoAccSsoma(){
	$("#modalPrincipalInvestigacionEventoAccSsoma").modal("hide");$("#modalPrincipalCausasInmediatasInvestEventoAccSsoma").remove();

	actualizarIndInvestEventoAccSsoma = 0;

	var listModal={
		id:"modalPrincipalCausasInmediatasInvestEventoAccSsoma",nombre:"Causas inmediatas",
		contenido:"<div id='estadoMovilPrincipalCausasInmediatasInvestEventoAccSsoma'></div>",btnCerrarHabilitado:0
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	cargarCausasInmediatasInvestEventoAccSsoma();
}

function cargarCausasInmediatasInvestEventoAccSsoma(){
	$("#estadoMovilPrincipalCausasInmediatasInvestEventoAccSsoma").html("");

	var dataParam={
		informacionEventoAnId:objInvestEventoAccSsoma.id
	};

	callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/causas_inmediatas',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];
			var textTotalRegistros= "";

			listCausasInmediatasInvestEventoAccSsoma = data.listCausasInmediatasInvestEventoAccSsoma;listTiposEventInvEveAccSsoma = data.listTiposEventos;
			listCausasInmediatasAuxInvEveAccSsoma = data.listCausasInmediatas;

			listCausasInmediatasInvestEventoAccSsoma.forEach(function(val,index){
				var btnOpcion="",menuOpcion="";

				menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
				funcionalidadesCausasInmediatasInvestEventoAccSsoma.forEach(function(val1,index1){
					menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionCausasInmediatasInvestEventoAccSsoma("+index1+")'>"+val1.nombre+"</li>";
				});
				menuOpcion += "</ul>";

				btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionCausasInmediatasInvestEventoAccSsoma(this,"+index+")'>" +
					    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
					"</a>";

				var listTotal=[
					{sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
					 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** REGISTRO #"+(index+1)+" ***</span>"},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Tipo:",inputForm:val.tipoEvento.nombre},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Causa inmediata:",inputForm:val.causaInmediata.nombre}
				];

				if(val.descripcion.length > 0){
				    listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-exclamation-circle'></i> Observaciones:",inputForm:""},
					    {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.descripcion,styleAux:"word-break:break-all;"});
				}else{
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Observaciones:",inputForm:"------"});
				}

				if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
				}

				if(val.fechaRegistroTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
						inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
				}

				if(val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
						inputForm:val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")")});
				}

				textTotalRegistros += "<div class='eventoGeneral'>" +
					                      "<form class='eventoGeneral'>";
				listTotal.forEach(function(val,index){
					textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
				});
				textTotalRegistros +=     "</form>" +
					                  "</div>";
			});

			listPanelesPrincipal.push({id:"volverInvestigacionEventoCauInmed",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalCausasInmediatasInvestEventoAccSsoma()",
				 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista anterior",nombre:"Regresar a la investigación del evento",contenido:""},
				{id:"nuevoRegCausaInmediataInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroCausasInmediatasInvestEventoAccSsoma(0)",
				 btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar causa inmediata",contenido:""},
				{id:"registroCausaInmediataInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
				 btnIconoAux:"",btnTitleAux:"",nombre:"Causas inmediatas registradas ("+listCausasInmediatasInvestEventoAccSsoma.length+")",contenido:textTotalRegistros});

			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalCausasInmediatasInvestEventoAccSsoma");

			$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
		}else{
			console.log("NOPNPO")
		}
	});
}

function ocultarRegistroCausasInmediatasInvestEventoAccSsoma(){
	$("#modalRegistroCausasInmediatasInvestEventoAccSsoma").modal("hide");$("#modalPrincipalCausasInmediatasInvestEventoAccSsoma").modal("show");
}

function registroCausasInmediatasInvestEventoAccSsoma(opcRegistro){
	var opcionRegistro = parseInt(opcRegistro);

	$("#modalPrincipalCausasInmediatasInvestEventoAccSsoma").modal("hide");$("#modalRegistroCausasInmediatasInvestEventoAccSsoma").remove();

	causaInmedInvestEventoAccSsomaId = (opcionRegistro == 0?0:objCausaInmedInvestEventoAccSsoma.id);

	var selTipoEventoCausaInmedInvesEventoAccSsoma = crearSelectOneMenu("selTipoEventoCausaInmedInvesEventoAccSsoma","verCausaInmediataSegunTipoEventoCausaInmedInvestEventoAccSsoma()",
		listTiposEventInvEveAccSsoma,(causaInmedInvestEventoAccSsomaId == 0?"-1":objCausaInmedInvestEventoAccSsoma.tipoEvento.id),"id","nombre");

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo:",inputForm:selTipoEventoCausaInmedInvesEventoAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Causa inmediata:",inputForm:"",divContainer:"divSelValorCausaInmedInvesEventoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observaciones:",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
		 inputForm:"<textarea class='form-control' rows='4' id='textObsCauInmedInvestEventoAccSsoma'></textarea>"+"<label style='color:blue;float:right;'>(opcional)</label>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
			label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroCausasInmediatasInvestEventoAccSsoma()'>" +
				"<i class='fa fa-times'></i> Cancelar" +
				"</button>",
			inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroCausasInmediatasInvestEventoAccSsoma()'>" +
				"<i class='fa fa-floppy-o'></i> Guardar" +
				"</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroCausasInmediatasInvestEventoAccSsoma",nombre:"<i class='fa fa-pencil-square-o'></i> Registro causa inmediata",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	if(opcionRegistro == 1){
		$("#textObsCauInmedInvestEventoAccSsoma").val(objCausaInmedInvestEventoAccSsoma.descripcion);
	}

	verCausaInmediataSegunTipoEventoCausaInmedInvestEventoAccSsoma();
}

function verCausaInmediataSegunTipoEventoCausaInmedInvestEventoAccSsoma(){
	var tipoEventoId = parseInt($("#selTipoEventoCausaInmedInvesEventoAccSsoma").val());

	if(tipoEventoId != -1){
		var listCausasInmediatasResultado = [];

		listCausasInmediatasAuxInvEveAccSsoma.forEach(function(val){
			if(val.causaInmTipoEvent == tipoEventoId){
				listCausasInmediatasResultado.push(val);
			}
		});

		var selValorCausaInmedInvesEventoAccSsoma = crearSelectOneMenu("selValorCausaInmedInvesEventoAccSsoma","",
			listCausasInmediatasResultado,(causaInmedInvestEventoAccSsomaId == 0?"-1":objCausaInmedInvestEventoAccSsoma.causaInmediata.id),"id","nombre");

		$("#divSelValorCausaInmedInvesEventoAccSsoma").html(selValorCausaInmedInvesEventoAccSsoma);
	}else{
		$("#divSelValorCausaInmedInvesEventoAccSsoma").html("<label>*Las causas inmediatas se muestran según el 'tipo' seleccionado.</label>");
	}
}

function guardarRegistroCausasInmediatasInvestEventoAccSsoma(){
	var campoVacio = true;

	var tipoEventoId = parseInt($("#selTipoEventoCausaInmedInvesEventoAccSsoma").val());
	var causaInmediataId = parseInt($("#selValorCausaInmedInvesEventoAccSsoma").val());
	var descripcion = $("#textObsCauInmedInvestEventoAccSsoma").val();

	if(tipoEventoId == -1 || causaInmediataId == -1){
		campoVacio = false;mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	if(campoVacio){
		var dataParam={
			id:causaInmedInvestEventoAccSsomaId,tipoEventoId:tipoEventoId,causaInmediataId:causaInmediataId,descripcion:descripcion,
			trabajadorId:parseInt(getSession("trabajadorGosstId")),informacionEventoAnId:objInvestEventoAccSsoma.id
		};

		callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/causas_inmediatas/save',dataParam,1,1,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					$("#modalRegistroCausasInmediatasInvestEventoAccSsoma").modal("hide");

					mensajeUx="<label>El registro acción inmediata fue guardado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarCauInmedInvestEventoAccSsoma");

					$("#modalMensajeUxActualizarCauInmedInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalCausasInmediatasInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
						cargarCausasInmediatasInvestEventoAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al guardar el registro acción inmediata.");
			}
		});
	}else{
		$("#modalRegistroCausasInmediatasInvestEventoAccSsoma").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionCauInmedInvestEventoAccSsoma");

		$("#modalMensajeUxValidacionCauInmedInvestEventoAccSsoma").on("hidden.bs.modal",function(){
			$("#modalRegistroCausasInmediatasInvestEventoAccSsoma").modal("show");
		});
	}
}

function eliminarCausasInmediatasInvestEventoAccSsoma(){
	$("#modalPrincipalCausasInmediatasInvestEventoAccSsoma").modal("hide");

	mensajeUx="<label>¿Está seguro de eliminar este registro acción inmediata?</label>";
	mensajesUx(mensajeUx,3,"","EliminarCauInmedInvestEventoAccSsoma");

	$("#btnDevolverValorEliminarCauInmedInvestEventoAccSsoma").on("click",function(){
		var dataParam={
			id:objCausaInmedInvestEventoAccSsoma.id
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/investigacion_evento/causas_inmediatas/delete',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx="<label>El registro acción inmediata fue eliminado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarCauInmedInvestEventoAccSsoma");

					$("#modalMensajeUxActualizarCauInmedInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalCausasInmediatasInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
						cargarCausasInmediatasInvestEventoAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al eliminar este registro acción inmediata!");
			}
		});
	});

	$("#btnRegresarPrevioEliminarCauInmedInvestEventoAccSsoma").on("click",function(){
		$("#modalPrincipalCausasInmediatasInvestEventoAccSsoma").modal("show");
	});
}

var causaBasicaInvestEventoAccSsomaId,indexCausaBasicaInvestEventoAccSsoma,objCausaBasicaInvestEventoAccSsoma = {};
var listCausasBasicasInvestEventoAccSsoma = [],listTiposEventInvEveAccSsoma = [],
	listSubTiposEventInvEveAccSsoma = [],listSubSubTiposEventInvEveAccSsoma = [];

function toggleMenuOpcionCausasBasicasInvestEventoAccSsoma(obj,pindex){
	objCausaBasicaInvestEventoAccSsoma = listCausasBasicasInvestEventoAccSsoma[pindex];
	indexCausaBasicaInvestEventoAccSsoma = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesCausasBasicasInvestEventoAccSsoma=[
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
		functionClick:function(data){registroCausasBasicasInvestEventoAccSsoma(1)}},
	{id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
		functionClick:function(data){eliminarCausasBasicasInvestEventoAccSsoma()}}
];

function marcarSubOpcionCausasBasicasInvestEventoAccSsoma(pindex){
	funcionalidadesCausasBasicasInvestEventoAccSsoma[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalCausasBasicasInvestEventoAccSsoma(){
	$("#modalPrincipalCausasBasicasInvestEventoAccSsoma").modal("hide");$("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");

	if(actualizarIndInvestEventoAccSsoma == 1){
		cargarInvestigacionEventoAccSsoma();
	}
}

function verCausasBasicasInvestEventoAccSsoma(){
	$("#modalPrincipalInvestigacionEventoAccSsoma").modal("hide");$("#modalPrincipalCausasBasicasInvestEventoAccSsoma").remove();

	actualizarIndInvestEventoAccSsoma = 0;

	var listModal={
		id:"modalPrincipalCausasBasicasInvestEventoAccSsoma",nombre:"Causas básicas",
		contenido:"<div id='estadoMovilPrincipalCausasBasicasInvestEventoAccSsoma'></div>",btnCerrarHabilitado:0
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	cargarCausasBasicasInvestEventoAccSsoma();
}

function cargarCausasBasicasInvestEventoAccSsoma(){
	$("#estadoMovilPrincipalCausasBasicasInvestEventoAccSsoma").html("");

	var dataParam={
		informacionEventoAnId:objInvestEventoAccSsoma.id
	};

	callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/causas_basicas',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];
			var textTotalRegistros= "";

			listCausasBasicasInvestEventoAccSsoma = data.listCausasBasicasInvestEventoAccSsoma;listTiposEventInvEveAccSsoma = data.listTiposEventos;
			listSubTiposEventInvEveAccSsoma = data.listSubTiposEventos;listSubSubTiposEventInvEveAccSsoma = data.listSubSubTiposEventos;

			listCausasBasicasInvestEventoAccSsoma.forEach(function(val,index){
				var btnOpcion="",menuOpcion="";

				menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
				funcionalidadesCausasBasicasInvestEventoAccSsoma.forEach(function(val1,index1){
					menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionCausasBasicasInvestEventoAccSsoma("+index1+")'>"+val1.nombre+"</li>";
				});
				menuOpcion += "</ul>";

				btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionCausasBasicasInvestEventoAccSsoma(this,"+index+")'>" +
					    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
					"</a>";

				var listTotal=[
					{sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
					 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** REGISTRO #"+(index+1)+" ***</span>"},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Tipo:",inputForm:val.tipoEvento.nombre},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Categoría:",inputForm:val.subTipoEvento.nombre},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Subcategoría:",inputForm:val.subSubTipoEvento.nombre}
				];

				if(val.detalle.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-exclamation-circle'></i> Detalle:",inputForm:""},
						{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.detalle,styleAux:"word-break:break-all;"});
				}else{
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Detalle:",inputForm:"------"});
				}

				if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
				}

				if(val.fechaRegistroTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
						inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
				}

				if(val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
						inputForm:val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")")});
				}

				textTotalRegistros += "<div class='eventoGeneral'>" +
					                      "<form class='eventoGeneral'>";
				listTotal.forEach(function(val,index){
					textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
				});
				textTotalRegistros +=     "</form>" +
					                  "</div>";
			});

			listPanelesPrincipal.push({id:"volverInvestigacionEventoCauBasica",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalCausasBasicasInvestEventoAccSsoma()",
				 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista anterior",nombre:"Regresar a la investigación del evento",contenido:""},
				{id:"nuevoRegCausaBasicaInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroCausasBasicasInvestEventoAccSsoma(0)",
				 btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar causa básica",contenido:""},
				{id:"registroCausaBasicaInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
				 btnIconoAux:"",btnTitleAux:"",nombre:"Causas básicas registradas ("+listCausasBasicasInvestEventoAccSsoma.length+")",contenido:textTotalRegistros});

			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalCausasBasicasInvestEventoAccSsoma");

			$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
		}else{
			console.log("NOPNPO")
		}
	});
}

function ocultarRegistroCausasBasicasInvestEventoAccSsoma(){
	$("#modalRegistroCausasBasicasInvestEventoAccSsoma").modal("hide");$("#modalPrincipalCausasBasicasInvestEventoAccSsoma").modal("show");
}

function registroCausasBasicasInvestEventoAccSsoma(opcRegistro){
	var opcionRegistro = parseInt(opcRegistro);

	$("#modalPrincipalCausasBasicasInvestEventoAccSsoma").modal("hide");$("#modalRegistroCausasBasicasInvestEventoAccSsoma").remove();

	causaBasicaInvestEventoAccSsomaId = (opcionRegistro == 0?0:objCausaBasicaInvestEventoAccSsoma.id);

	var selTipoEventoCausaBasicaInvesEventoAccSsoma = crearSelectOneMenu("selTipoEventoCausaBasicaInvesEventoAccSsoma","verSubTipoEventoSegunTipoEventoCausaBasicaInvestEventoAccSsoma()",
		listTiposEventInvEveAccSsoma,(causaBasicaInvestEventoAccSsomaId == 0?"-1":objCausaBasicaInvestEventoAccSsoma.tipoEvento.id),"id","nombre");

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo:",inputForm:selTipoEventoCausaBasicaInvesEventoAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Categoría:",inputForm:"",divContainer:"divSubTipoEventoCausaBasicaInvesEventoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Subcategoria:",inputForm:"",divContainer:"divSubSubTipoEventoCausaBasicaInvesEventoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Detalle:",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
		 inputForm:"<textarea class='form-control' rows='4' id='textDetalleCauBasicaInvestEventoAccSsoma'></textarea>"+"<label style='color:blue;float:right;'>(opcional)</label>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroCausasBasicasInvestEventoAccSsoma()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroCausasBasicasInvestEventoAccSsoma()'>" +
				       "<i class='fa fa-floppy-o'></i> Guardar" +
				   "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroCausasBasicasInvestEventoAccSsoma",nombre:"<i class='fa fa-pencil-square-o'></i> Registro causa básica",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	if(opcionRegistro == 1){
		$("#textDetalleCauBasicaInvestEventoAccSsoma").val(objCausaBasicaInvestEventoAccSsoma.detalle);
	}

	verSubTipoEventoSegunTipoEventoCausaBasicaInvestEventoAccSsoma();
}

function verSubTipoEventoSegunTipoEventoCausaBasicaInvestEventoAccSsoma(){
	var tipoEventoId = parseInt($("#selTipoEventoCausaBasicaInvesEventoAccSsoma").val());

	if(tipoEventoId != -1){
		var listSubTiposCauBasicaResultado = [];

		listSubTiposEventInvEveAccSsoma.forEach(function(val){
			if(val.eventoTipoId == tipoEventoId){
				listSubTiposCauBasicaResultado.push(val);
			}
		});

		var selSubTipoEventoCauBasicaInvesEventoAccSsoma = crearSelectOneMenu("selSubTipoEventoCauBasicaInvesEventoAccSsoma","verSubSubTipoEventoSegunSubTipoEventoCausaBasicaInvestEventoAccSsoma()",
			listSubTiposCauBasicaResultado,(causaBasicaInvestEventoAccSsomaId == 0?"-1":objCausaBasicaInvestEventoAccSsoma.subTipoEvento.id),"id","nombre");

		$("#divSubTipoEventoCausaBasicaInvesEventoAccSsoma").html(selSubTipoEventoCauBasicaInvesEventoAccSsoma);

		verSubSubTipoEventoSegunSubTipoEventoCausaBasicaInvestEventoAccSsoma();
	}else{
		$("#divSubTipoEventoCausaBasicaInvesEventoAccSsoma").html("<label>*Las categorías se muestran según el 'tipo' seleccionado.</label>");
		verSubSubTipoEventoSegunSubTipoEventoCausaBasicaInvestEventoAccSsoma();
	}
}

function verSubSubTipoEventoSegunSubTipoEventoCausaBasicaInvestEventoAccSsoma(){
	var tipoEventoId = parseInt($("#selTipoEventoCausaBasicaInvesEventoAccSsoma").val());
	var subTipoEventoId = parseInt($("#selSubTipoEventoCauBasicaInvesEventoAccSsoma").val());

	if(tipoEventoId != -1 && subTipoEventoId != -1){
		var listSubSubTiposCauBasicaResultado = [];

		listSubSubTiposEventInvEveAccSsoma.forEach(function(val){
			if(val.subTipoEventoId == subTipoEventoId){
				listSubSubTiposCauBasicaResultado.push(val);
			}
		});

		var selSubSubTipoEventoCauBasicaInvesEventoAccSsoma = crearSelectOneMenu("selSubSubTipoEventoCauBasicaInvesEventoAccSsoma","",
			listSubSubTiposCauBasicaResultado,(causaBasicaInvestEventoAccSsomaId == 0?"-1":objCausaBasicaInvestEventoAccSsoma.subSubTipoEvento.id),"id","nombre");

		$("#divSubSubTipoEventoCausaBasicaInvesEventoAccSsoma").html(selSubSubTipoEventoCauBasicaInvesEventoAccSsoma);
	}else{
		$("#divSubSubTipoEventoCausaBasicaInvesEventoAccSsoma").html("<label>*Las subcategorías se muestran según la 'categoría' seleccionada.</label>");
	}
}

function guardarRegistroCausasBasicasInvestEventoAccSsoma(){
	var campoVacio = true;

	var tipoEventoId = parseInt($("#selTipoEventoCausaBasicaInvesEventoAccSsoma").val());
	var subTipoEventoId = parseInt($("#selSubTipoEventoCauBasicaInvesEventoAccSsoma").val());
	var subSubTipoEventoId = parseInt($("#selSubSubTipoEventoCauBasicaInvesEventoAccSsoma").val());
	var detalle = $("#textDetalleCauBasicaInvestEventoAccSsoma").val();

	if(tipoEventoId == -1 || subTipoEventoId == -1 || subSubTipoEventoId == -1){
		campoVacio = false;mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	if(campoVacio){
		var dataParam={
			id:causaBasicaInvestEventoAccSsomaId,tipoEventoId:tipoEventoId,subTipoEventoId:subTipoEventoId,subSubTipoEventoId:subSubTipoEventoId,detalle:detalle,
			trabajadorId:parseInt(getSession("trabajadorGosstId")),informacionEventoAnId:objInvestEventoAccSsoma.id
		};

		callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/causas_basicas/save',dataParam,1,1,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					$("#modalRegistroCausasBasicasInvestEventoAccSsoma").modal("hide");

					mensajeUx="<label>El registro acción básica fue guardado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarCauBasicaInvestEventoAccSsoma");

					$("#modalMensajeUxActualizarCauBasicaInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalCausasBasicasInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
						cargarCausasBasicasInvestEventoAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al guardar el registro acción básica.");
			}
		});
	}else{
		$("#modalRegistroCausasBasicasInvestEventoAccSsoma").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionCauBasicaInvestEventoAccSsoma");

		$("#modalMensajeUxValidacionCauBasicaInvestEventoAccSsoma").on("hidden.bs.modal",function(){
			$("#modalRegistroCausasBasicasInvestEventoAccSsoma").modal("show");
		});
	}
}

function eliminarCausasBasicasInvestEventoAccSsoma(){
	$("#modalPrincipalCausasBasicasInvestEventoAccSsoma").modal("hide");

	mensajeUx="<label>¿Está seguro de eliminar este registro acción básica?</label>";
	mensajesUx(mensajeUx,3,"","EliminarCauBasicaInvestEventoAccSsoma");

	$("#btnDevolverValorEliminarCauBasicaInvestEventoAccSsoma").on("click",function(){
		var dataParam={
			id:objCausaBasicaInvestEventoAccSsoma.id
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/investigacion_evento/causas_basicas/delete',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx="<label>El registro acción básica fue eliminado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarCauBasicaInvestEventoAccSsoma");

					$("#modalMensajeUxActualizarCauBasicaInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalCausasBasicasInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
						cargarCausasBasicasInvestEventoAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al eliminar este registro acción básica!");
			}
		});
	});

	$("#btnRegresarPrevioEliminarCauBasicaInvestEventoAccSsoma").on("click",function(){
		$("#modalPrincipalCausasBasicasInvestEventoAccSsoma").modal("show");
	});
}

var falloSistGestionInvestEventoAccSsomaId,indexFalloSistGestionInvestEventoAccSsoma,objFalloSistGestionInvestEventoAccSsoma = {};
var listFallosSistemaGestionInvestEventoAccSsoma = [],listTiposEventInvEveAccSsoma = [],
	listFallosSistemaGestionAuxInvEveAccSsoma = [];

function toggleMenuOpcionFallosSistemaGestionInvestEventoAccSsoma(obj,pindex){
	objFalloSistGestionInvestEventoAccSsoma = listFallosSistemaGestionInvestEventoAccSsoma[pindex];
	indexFalloSistGestionInvestEventoAccSsoma = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesFallosSistemaGestionInvestEventoAccSsoma=[
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
	 functionClick:function(data){registroFallosSistemaGestionInvestEventoAccSsoma(1)}},
	{id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
	 functionClick:function(data){eliminarFallosSistemaGestionInvestEventoAccSsoma()}}
];

function marcarSubOpcionFallosSistemaGestionInvestEventoAccSsoma(pindex){
	funcionalidadesFallosSistemaGestionInvestEventoAccSsoma[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalFallosSistemaGestionInvestEventoAccSsoma(){
	$("#modalPrincipalFallosSistemaGestionInvestEventoAccSsoma").modal("hide");$("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");

	if(actualizarIndInvestEventoAccSsoma == 1){
		cargarInvestigacionEventoAccSsoma();
	}
}

function verFallosSistemaGestionInvestEventoAccSsoma(){
	$("#modalPrincipalInvestigacionEventoAccSsoma").modal("hide");$("#modalPrincipalFallosSistemaGestionInvestEventoAccSsoma").remove();

	actualizarIndInvestEventoAccSsoma = 0;

	var listModal={
		id:"modalPrincipalFallosSistemaGestionInvestEventoAccSsoma",nombre:"Fallos sistema de gestión",
		contenido:"<div id='estadoMovilPrincipalFallosSistemaGestionInvestEventoAccSsoma'></div>",btnCerrarHabilitado:0
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	cargarFallosSistemaGestionInvestEventoAccSsoma();
}

function cargarFallosSistemaGestionInvestEventoAccSsoma(){
	$("#estadoMovilPrincipalFallosSistemaGestionInvestEventoAccSsoma").html("");

	var dataParam={
		informacionEventoAnId:objInvestEventoAccSsoma.id
	};

	callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/fallos_sistema_gestion',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];
			var textTotalRegistros= "";

			listFallosSistemaGestionInvestEventoAccSsoma = data.listFallosSistemaGestionInvestEventoAccSsoma;listTiposEventInvEveAccSsoma = data.listTiposEventos;
			listFallosSistemaGestionAuxInvEveAccSsoma = data.listCausasInmediatas;

			listFallosSistemaGestionInvestEventoAccSsoma.forEach(function(val,index){
				var btnOpcion="",menuOpcion="";

				menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
				funcionalidadesFallosSistemaGestionInvestEventoAccSsoma.forEach(function(val1,index1){
					menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionFallosSistemaGestionInvestEventoAccSsoma("+index1+")'>"+val1.nombre+"</li>";
				});
				menuOpcion += "</ul>";

				btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionFallosSistemaGestionInvestEventoAccSsoma(this,"+index+")'>" +
					    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
					"</a>";

				var listTotal=[
					{sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
						label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** REGISTRO #"+(index+1)+" ***</span>"},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Tipo:",inputForm:val.tipoEvento.nombre},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Fallo de gestión:",inputForm:val.causaInmediata.nombre}
				];

				if(val.descripcion.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-exclamation-circle'></i> Observaciones:",inputForm:""},
						{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.descripcion,styleAux:"word-break:break-all;"});
				}else{
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Observaciones:",inputForm:"------"});
				}

				if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
				}

				if(val.fechaRegistroTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
						inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
				}

				if(val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
						inputForm:val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")")});
				}

				textTotalRegistros += "<div class='eventoGeneral'>" +
					                      "<form class='eventoGeneral'>";
				listTotal.forEach(function(val,index){
					textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
				});
				textTotalRegistros +=     "</form>" +
					                  "</div>";
			});

			listPanelesPrincipal.push({id:"volverInvestigacionEventoFalloSistGestion",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalFallosSistemaGestionInvestEventoAccSsoma()",
				 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista anterior",nombre:"Regresar a la investigación del evento",contenido:""},
				{id:"nuevoRegFalloSistemaGestionInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroFallosSistemaGestionInvestEventoAccSsoma(0)",
				 btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar fallo sistema gestión",contenido:""},
				{id:"registroFalloSistemaGestionInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
				 btnIconoAux:"",btnTitleAux:"",nombre:"Fallos sistema gestión registrados ("+listFallosSistemaGestionInvestEventoAccSsoma.length+")",contenido:textTotalRegistros});

			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalFallosSistemaGestionInvestEventoAccSsoma");

			$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
		}else{
			console.log("NOPNPO")
		}
	});
}

function ocultarRegistroFallosSistemaGestionInvestEventoAccSsoma(){
	$("#modalRegistroFallosSistemaGestionInvestEventoAccSsoma").modal("hide");$("#modalPrincipalFallosSistemaGestionInvestEventoAccSsoma").modal("show");
}

function registroFallosSistemaGestionInvestEventoAccSsoma(opcRegistro){
	var opcionRegistro = parseInt(opcRegistro);

	$("#modalPrincipalFallosSistemaGestionInvestEventoAccSsoma").modal("hide");$("#modalRegistroFallosSistemaGestionInvestEventoAccSsoma").remove();

	falloSistGestionInvestEventoAccSsomaId = (opcionRegistro == 0?0:objFalloSistGestionInvestEventoAccSsoma.id);

	var selTipoEventoFalloSistGestionInvesEventoAccSsoma = crearSelectOneMenu("selTipoEventoFalloSistGestionInvesEventoAccSsoma","verFalloSistemaGestionSegunTipoEventoFalloSistGestionInvestEventoAccSsoma()",
		listTiposEventInvEveAccSsoma,(falloSistGestionInvestEventoAccSsomaId == 0?"-1":objFalloSistGestionInvestEventoAccSsoma.tipoEvento.id),"id","nombre");

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo:",inputForm:selTipoEventoFalloSistGestionInvesEventoAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fallo de gestión:",inputForm:"",divContainer:"divSelValorFalloSistGestionInvesEventoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observaciones:",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
		 inputForm:"<textarea class='form-control' rows='4' id='textObsFalloSistGestionInvestEventoAccSsoma'></textarea>"+"<label style='color:blue;float:right;'>(opcional)</label>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroFallosSistemaGestionInvestEventoAccSsoma()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroFallosSistemaGestionInvestEventoAccSsoma()'>" +
				       "<i class='fa fa-floppy-o'></i> Guardar" +
				   "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroFallosSistemaGestionInvestEventoAccSsoma",nombre:"<i class='fa fa-pencil-square-o'></i> Registro fallo sistema gestión",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	if(opcionRegistro == 1){
		$("#textObsFalloSistGestionInvestEventoAccSsoma").val(objFalloSistGestionInvestEventoAccSsoma.descripcion);
	}

	verFalloSistemaGestionSegunTipoEventoFalloSistGestionInvestEventoAccSsoma();
}

function verFalloSistemaGestionSegunTipoEventoFalloSistGestionInvestEventoAccSsoma(){
	var tipoEventoId = parseInt($("#selTipoEventoFalloSistGestionInvesEventoAccSsoma").val());

	if(tipoEventoId != -1){
		var listCausasInmediatasResultado = [];

		listFallosSistemaGestionAuxInvEveAccSsoma.forEach(function(val){
			if(val.causaInmTipoEvent == tipoEventoId){
				listCausasInmediatasResultado.push(val);
			}
		});

		var selValorFalloSistGestionInvesEventoAccSsoma = crearSelectOneMenu("selValorFalloSistGestionInvesEventoAccSsoma","",
			listCausasInmediatasResultado,(falloSistGestionInvestEventoAccSsomaId == 0?"-1":objFalloSistGestionInvestEventoAccSsoma.causaInmediata.id),"id","nombre");

		$("#divSelValorFalloSistGestionInvesEventoAccSsoma").html(selValorFalloSistGestionInvesEventoAccSsoma);
	}else{
		$("#divSelValorFalloSistGestionInvesEventoAccSsoma").html("<label>*Los fallos de gestión se muestran según el 'tipo' seleccionado.</label>");
	}
}

function guardarRegistroFallosSistemaGestionInvestEventoAccSsoma(){
	var campoVacio = true;

	var tipoEventoId = parseInt($("#selTipoEventoFalloSistGestionInvesEventoAccSsoma").val());
	var causaInmediataId = parseInt($("#selValorFalloSistGestionInvesEventoAccSsoma").val());
	var descripcion = $("#textObsFalloSistGestionInvestEventoAccSsoma").val();

	if(tipoEventoId == -1 || causaInmediataId == -1){
		campoVacio = false;mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	if(campoVacio){
		var dataParam={
			id:falloSistGestionInvestEventoAccSsomaId,tipoEventoId:tipoEventoId,causaInmediataId:causaInmediataId,descripcion:descripcion,
			trabajadorId:parseInt(getSession("trabajadorGosstId")),informacionEventoAnId:objInvestEventoAccSsoma.id
		};

		callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/fallos_sistema_gestion/save',dataParam,1,1,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					$("#modalRegistroFallosSistemaGestionInvestEventoAccSsoma").modal("hide");

					mensajeUx="<label>El registro fallo sistema gestión fue guardado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarFalloSistGestionInvestEventoAccSsoma");

					$("#modalMensajeUxActualizarFalloSistGestionInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalFallosSistemaGestionInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
						cargarFallosSistemaGestionInvestEventoAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al guardar el registro fallo sistema gestión.");
			}
		});
	}else{
		$("#modalRegistroFallosSistemaGestionInvestEventoAccSsoma").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionFalloSistGestionInvestEventoAccSsoma");

		$("#modalMensajeUxValidacionFalloSistGestionInvestEventoAccSsoma").on("hidden.bs.modal",function(){
			$("#modalRegistroFallosSistemaGestionInvestEventoAccSsoma").modal("show");
		});
	}
}

function eliminarFallosSistemaGestionInvestEventoAccSsoma(){
	$("#modalPrincipalFallosSistemaGestionInvestEventoAccSsoma").modal("hide");

	mensajeUx="<label>¿Está seguro de eliminar este registro fallo sistema gestión?</label>";
	mensajesUx(mensajeUx,3,"","EliminarFalloSistGestionInvestEventoAccSsoma");

	$("#btnDevolverValorEliminarFalloSistGestionInvestEventoAccSsoma").on("click",function(){
		var dataParam={
			id:objFalloSistGestionInvestEventoAccSsoma.id
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/investigacion_evento/fallos_sistema_gestion/delete',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx="<label>El registro fallo sistema gestión fue eliminado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarFalloSistGestionInvestEventoAccSsoma");

					$("#modalMensajeUxActualizarFalloSistGestionInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalFallosSistemaGestionInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
						cargarFallosSistemaGestionInvestEventoAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al eliminar este registro fallo sistema gestión!");
			}
		});
	});

	$("#btnRegresarPrevioEliminarFalloSistGestionInvestEventoAccSsoma").on("click",function(){
		$("#modalPrincipalFallosSistemaGestionInvestEventoAccSsoma").modal("show");
	});
}

var eviExtrasInvestEventoAccSsomaId,indexEviExtrasInvestEventoAccSsoma,objEviExtrasInvestEventoAccSsoma = {};
var listEvidenciasExtrasInvestEventoAccSsoma = [];

function toggleMenuOpcionEvidenciasExtrasInvestEventoAccSsoma(obj,pindex){
	objEviExtrasInvestEventoAccSsoma = listEvidenciasExtrasInvestEventoAccSsoma[pindex];
	indexEviExtrasInvestEventoAccSsoma = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesEvidenciasExtrasInvestEventoAccSsoma=[
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
	 functionClick:function(data){registroEvidenciasExtrasInvestEventoAccSsoma(1)}},
	{id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
	 functionClick:function(data){eliminarEvidenciasExtrasInvestEventoAccSsoma()}}
];

function marcarSubOpcionEvidenciasExtrasInvestEventoAccSsoma(pindex){
	funcionalidadesEvidenciasExtrasInvestEventoAccSsoma[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalEvidenciasExtrasInvestEventoAccSsoma(){
	$("#modalPrincipalEvidenciasExtrasInvestEventoAccSsoma").modal("hide");$("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");

	if(actualizarIndInvestEventoAccSsoma == 1){
		cargarInvestigacionEventoAccSsoma();
	}
}

function verEvidenciasExtrasInvestEventoAccSsoma(){
	$("#modalPrincipalInvestigacionEventoAccSsoma").modal("hide");$("#modalPrincipalEvidenciasExtrasInvestEventoAccSsoma").remove();

	actualizarIndInvestEventoAccSsoma = 0;

	var listModal={
		id:"modalPrincipalEvidenciasExtrasInvestEventoAccSsoma",nombre:"Evidencias extras",
		contenido:"<div id='estadoMovilPrincipalEvidenciasExtrasInvestEventoAccSsoma'></div>",btnCerrarHabilitado:0
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	cargarEvidenciasExtrasInvestEventoAccSsoma();
}

function cargarEvidenciasExtrasInvestEventoAccSsoma(){
	$("#estadoMovilPrincipalEvidenciasExtrasInvestEventoAccSsoma").html("");

	var dataParam={
		informacionEventoAnId:objInvestEventoAccSsoma.id
	};

	callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/evidencias_extras',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];
			var textTotalRegistros= "";

			listEvidenciasExtrasInvestEventoAccSsoma = data.listEvidenciasExtrasInvestEventoAccSsoma;

			listEvidenciasExtrasInvestEventoAccSsoma.forEach(function(val,index){
				var btnOpcion="",menuOpcion="";

				menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
				funcionalidadesEvidenciasExtrasInvestEventoAccSsoma.forEach(function(val1,index1){
					menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionEvidenciasExtrasInvestEventoAccSsoma("+index1+")'>"+val1.nombre+"</li>";
				});
				menuOpcion += "</ul>";

				btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionEvidenciasExtrasInvestEventoAccSsoma(this,"+index+")'>" +
					    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
					"</a>";

				var evidenciaExtraNombre = (val.evidenciaExtraNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
					"href='"+URL+"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencias_extras/evidencia_extra?"+"id="+val.id+"'>"+val.evidenciaExtraNombre+"</a>");

				var listTotal=[
					{sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
					 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** REGISTRO #"+(index+1)+" ***</span>"},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Evidencia extra:",inputForm:evidenciaExtraNombre}
				];

				if(val.detalle.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-exclamation-circle'></i> Detalle:",inputForm:""},
						{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.detalle,styleAux:"word-break:break-all;"});
				}else{
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Detalle:",inputForm:"------"});
				}

				if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
				}

				if(val.fechaRegistroTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
						inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
				}

				if(val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
						inputForm:val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")")});
				}

				textTotalRegistros += "<div class='eventoGeneral'>" +
					                      "<form class='eventoGeneral'>";
				listTotal.forEach(function(val,index){
					textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
				});
				textTotalRegistros +=     "</form>" +
					                  "</div>";
			});

			listPanelesPrincipal.push({id:"volverInvestigacionEventoEviExtras",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalEvidenciasExtrasInvestEventoAccSsoma()",
				 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista anterior",nombre:"Regresar a la investigación del evento",contenido:""},
				{id:"nuevoRegEvidenciaExtraInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroEvidenciasExtrasInvestEventoAccSsoma(0)",
				 btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar evidencia extra",contenido:""},
				{id:"registroEvidenciaExtraInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
				 btnIconoAux:"",btnTitleAux:"",nombre:"Evidencias extras registradas ("+listEvidenciasExtrasInvestEventoAccSsoma.length+")",contenido:textTotalRegistros});

			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalEvidenciasExtrasInvestEventoAccSsoma");

			$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
		}else{
			console.log("NOPNPO")
		}
	});
}

function ocultarRegistroEvidenciasExtrasInvestEventoAccSsoma(){
	$("#modalRegistroEvidenciasExtrasInvestEventoAccSsoma").modal("hide");$("#modalPrincipalEvidenciasExtrasInvestEventoAccSsoma").modal("show");
}

function registroEvidenciasExtrasInvestEventoAccSsoma(opcRegistro){
	var opcionRegistro = parseInt(opcRegistro);

	$("#modalPrincipalEvidenciasExtrasInvestEventoAccSsoma").modal("hide");$("#modalRegistroEvidenciasExtrasInvestEventoAccSsoma").remove();

	eviExtrasInvestEventoAccSsomaId = (opcionRegistro == 0?0:objEviExtrasInvestEventoAccSsoma.id);

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia extra:",inputForm:"",divContainer:"divEviExtraInvestEventoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Detalle:",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
		 inputForm:"<textarea class='form-control' rows='4' id='textDetEviExtrasInvestEventoAccSsoma'></textarea>"+"<label style='color:blue;float:right;'>(opcional)</label>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroEvidenciasExtrasInvestEventoAccSsoma()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroEvidenciasExtrasInvestEventoAccSsoma()'>" +
			           "<i class='fa fa-floppy-o'></i> Guardar" +
			       "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroEvidenciasExtrasInvestEventoAccSsoma",nombre:"<i class='fa fa-pencil-square-o'></i> Registro evidencia extra",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	if(opcionRegistro == 1){
		$("#textDetEviExtrasInvestEventoAccSsoma").val(objEviExtrasInvestEventoAccSsoma.detalle);
	}

	var options={
		container:"#divEviExtraInvestEventoAccSsoma",functionCall:function(){
			validacionSubirEvidencia("ExtraInvestEventoAccSsoma",bitsEvidenciaExamen,"modalRegistroEvidenciasExtrasInvestEventoAccSsoma");
		},descargaUrl:"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencias_extras/evidencia_extra?"+"id="+eviExtrasInvestEventoAccSsomaId,
		esNuevo:(opcionRegistro == 0 || objEviExtrasInvestEventoAccSsoma.evidenciaExtraNombre.length == 0?true:false),
		idAux:"ExtraInvestEventoAccSsoma",evidenciaNombre:(opcionRegistro == 0?"":objEviExtrasInvestEventoAccSsoma.evidenciaExtraNombre)
	};

	crearFormEvidenciaCompleta(options);
}

function guardarRegistroEvidenciasExtrasInvestEventoAccSsoma(){
	var campoVacio = true;

	var evidenciaExtraNombre = $("#inputEviExtraInvestEventoAccSsoma").val();
	var detalle = $("#textDetEviExtrasInvestEventoAccSsoma").val();

	if(campoVacio && evidenciaExtraNombre.length == 0){
		campoVacio = false;mensajeUx = "<label>Debe subir la evidencia extra.</label>";
	}else if(campoVacio && evidenciaExtraNombre == "VOLVER A SUBIR"){
		campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia extra.</label>";
	}

	if(campoVacio){
		var dataParam={
			id:eviExtrasInvestEventoAccSsomaId,detalle:detalle,trabajadorId:parseInt(getSession("trabajadorGosstId")),
			informacionEventoAnId:objInvestEventoAccSsoma.id
		};

		callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/evidencias_extras/save',dataParam,1,0,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviExtraInvestEventoAccSsoma",bitsEvidenciaExamen,0,1,
					"/accidente/amazon_s3/accidente_ssoma/investigacion_evento/evidencias_extras/evidencia_extra/save","evidencias-extras-an/evidencia-extra",function(){
					    $("#modalRegistroEvidenciasExtrasInvestEventoAccSsoma").modal("hide");

						mensajeUx="<label>El registro evidencia extra fue guardado con éxito.</label>";
						mensajesUx(mensajeUx,1,"","ActualizarEviExtrasInvestEventoAccSsoma");

						$("#modalMensajeUxActualizarEviExtrasInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						    $("#modalPrincipalEvidenciasExtrasInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
							cargarEvidenciasExtrasInvestEventoAccSsoma();
						});
					});

					break;

				default:
					alert("Ocurrió un error al guardar el registro evidencia extra.");
			}
		});
	}else{
		$("#modalRegistroEvidenciasExtrasInvestEventoAccSsoma").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionEviExtrasInvestEventoAccSsoma");

		$("#modalMensajeUxValidacionEviExtrasInvestEventoAccSsoma").on("hidden.bs.modal",function(){
			$("#modalRegistroEvidenciasExtrasInvestEventoAccSsoma").modal("show");
		});
	}
}

function eliminarEvidenciasExtrasInvestEventoAccSsoma(){
	$("#modalPrincipalEvidenciasExtrasInvestEventoAccSsoma").modal("hide");

	mensajeUx="<label>¿Está seguro de eliminar este registro evidencia extra?</label>";
	mensajesUx(mensajeUx,3,"","EliminarEviExtrasInvestEventoAccSsoma");

	$("#btnDevolverValorEliminarEviExtrasInvestEventoAccSsoma").on("click",function(){
		var dataParam={
			id:objEviExtrasInvestEventoAccSsoma.id,bucketNombre:BUCKETAMAZONS3
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/investigacion_evento/evidencias_extras/delete',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx="<label>El registro evidencia extra fue eliminado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarEviExtrasInvestEventoAccSsoma");

					$("#modalMensajeUxActualizarEviExtrasInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalEvidenciasExtrasInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
						cargarEvidenciasExtrasInvestEventoAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al eliminar este registro evidencia extra!");
			}
		});
	});

	$("#btnRegresarPrevioEliminarEviExtrasInvestEventoAccSsoma").on("click",function(){
		$("#modalPrincipalEvidenciasExtrasInvestEventoAccSsoma").modal("show");
	});
}

var accionMejoraAccSsomaId,indexAccionMejoraAccSsoma,objAccionMejoraAccSsoma = {};
var listAccionesMejoraAccSsoma = [],listClasificacionesAccMejAccSsoma = [];

function toggleMenuOpcionAccionMejoraAccSsoma(obj,pindex){
	objAccionMejoraAccSsoma = listAccionesMejoraAccSsoma[pindex];
	indexAccionMejoraAccSsoma = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesAccionMejoraAccSsoma=[
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
	 functionClick:function(data){registroAccionMejoraAccSsoma(1)}},
	{id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
	 functionClick:function(data){eliminarAccionMejoraAccSsoma()}}
];

function marcarSubOpcionAccionMejoraAccSsoma(pindex){
	funcionalidadesAccionMejoraAccSsoma[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalAccionMejoraAccSsoma(){
	$("#modalPrincipalAccionMejoraAccSsoma").modal("hide");

	if(actualizarPrincipalAccSsoma == 1){
		habilitarAccidentesSsoma();
	}
}

function verAccionMejoraAccSsoma(){
	$("#modalPrincipalAccionMejoraAccSsoma").remove();

	actualizarPrincipalAccSsoma = 0;

	var listModal={
		id:"modalPrincipalAccionMejoraAccSsoma",nombre:"Acciones correctivas",
		contenido:"<div id='estadoMovilPrincipalAccionMejoraAccSsoma'></div>",btnCerrarHabilitado:0
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	cargarAccionMejoraAccSsoma();
}

function cargarAccionMejoraAccSsoma(){
	$("#estadoMovilPrincipalAccionMejoraAccSsoma").html("");

	var dataParam={
		evidenciaAnId:accidentesSsomaObj.id,empresaId:parseInt(getSession("gestopcompanyid"))
	};

	callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/accion_mejora',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];
			var textTotalRegistros= "";

			listAccionesMejoraAccSsoma = data.listAccionesMejoraAccSsoma;listClasificacionesAccMejAccSsoma = data.listClasificacionesAccMejAccSsoma;

			listAccionesMejoraAccSsoma.forEach(function(val,index){
				var btnOpcion="",menuOpcion="";

				menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
				funcionalidadesAccionMejoraAccSsoma.forEach(function(val1,index1){
					menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionAccionMejoraAccSsoma("+index1+")'>"+val1.nombre+"</li>";
				});
				menuOpcion += "</ul>";

				btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionAccionMejoraAccSsoma(this,"+index+")'>" +
					    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
					"</a>";

				var evidenciaNombre = (val.evidenciaNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
					"href='"+URL+"/accidente/accidente_ssoma/accion_mejora/evidencia?"+"id="+val.id+"'>"+val.evidenciaNombre+"</a>");

				var listTotal=[
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Clasificación:",inputForm:val.clasificacion.nombre+btnOpcion+menuOpcion},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
				];

				if(val.descripcion.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-eye'></i> Descripción:",inputForm:""},
						{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.descripcion,styleAux:"word-break:break-all;"});
				}else{
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-eye'></i> Descripción:",inputForm:"------"});
				}

				if(val.observacion.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-exclamation-circle'></i> Observación:",inputForm:""},
						{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.observacion,styleAux:"word-break:break-all;"});
				}else{
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Observación:",inputForm:"------"});
				}

				listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-user'></i> Responsable:",inputForm:val.responsable.nombre},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha planificada:",inputForm:val.fechaRevisionTexto});

				if(val.fechaRealTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha realizada:",inputForm:val.fechaRealTexto});
				}

				listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Evidencia de cumplimiento:",inputForm:evidenciaNombre});

				if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
				}

				if(val.fechaRegistroTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
						inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
				}

				if(val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
						inputForm:val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")")});
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

			listPanelesPrincipal.push({id:"volverAccidenteSssomaAccionMejora",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalAccionMejoraAccSsoma()",
				 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""},
				{id:"nuevoRegAccionMejora",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroAccionMejoraAccSsoma(0)",
				 btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar acción correctiva",contenido:""},
				{id:"registroAccionMejora",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
				 btnIconoAux:"",btnTitleAux:"",nombre:"Acciones correctivas registradas ("+listAccionesMejoraAccSsoma.length+")",contenido:textTotalRegistros});

			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalAccionMejoraAccSsoma");

			$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
		}else{
			console.log("NOPNPO")
		}
	});
}

function ocultarRegistroAccionMejoraAccSsoma(){
	$("#modalRegistroAccionMejora").modal("hide");$("#modalPrincipalAccionMejoraAccSsoma").modal("show");
}

function registroAccionMejoraAccSsoma(opcRegistro){
	var opcionRegistro = parseInt(opcRegistro);

	$("#modalPrincipalAccionMejoraAccSsoma").modal("hide");$("#modalRegistroAccionMejora").remove();

	accionMejoraAccSsomaId = (opcionRegistro == 0?0:objAccionMejoraAccSsoma.id);

	var selClasificacionAccMejAccSsoma = crearSelectOneMenu("selClasificacionAccMejAccSsoma","",
		listClasificacionesAccMejAccSsoma,(accionMejoraAccSsomaId == 0?"-1":objAccionMejoraAccSsoma.clasificacion.id),"id","nombre");

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Clasificación:",inputForm:selClasificacionAccMejAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción:",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='4' id='textDescAccMejAccSsoma'></textarea>"},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observación:",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
		 inputForm:"<textarea class='form-control' rows='4' id='textObsAccMejAccSsoma'></textarea>"+"<label style='color:blue;float:right;'>(opcional)</label>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Responsable:",
		 inputForm:"<input class='form-control' type='text' id='inputIngresarDniNombreTrabAccMejAccSsoma'>" +
				   "<div id='divSelAutoTrabPorNombreAccMejAccSsoma'></div>" +
				   "<label>*Buscar trabajador por N° de documento y/o nombre (debe ingresar 3 caracteres como mínimo).</label>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha planificada:",inputForm:"<input id='inputFechaRevAccMejAccSsoma' type='date' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia de cumplimiento:",inputForm:"",divContainer:"divEviCumplimientoAccMejAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Estado actual:",inputForm:"",divContainer:"divEstadoActualAccMejAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroAccionMejoraAccSsoma()'>" +
			       "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroAccionMejoraAccSsoma()'>" +
				       "<i class='fa fa-floppy-o'></i> Guardar" +
				   "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroAccionMejora",nombre:"<i class='fa fa-pencil-square-o'></i> Registro acción correctiva",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	if(opcionRegistro == 1){
		$("#textDescAccMejAccSsoma").val(objAccionMejoraAccSsoma.descripcion);
		$("#textObsAccMejAccSsoma").val(objAccionMejoraAccSsoma.observacion);
		$("#inputFechaRevAccMejAccSsoma").val(convertirFechaInput(objAccionMejoraAccSsoma.fechaRevision));
		$("#inputIngresarDniNombreTrabAccMejAccSsoma").val(objAccionMejoraAccSsoma.responsable.nombre);
	}

	var options={
		container:"#divEviCumplimientoAccMejAccSsoma",functionCall:function(){
			validacionSubirEvidencia("CumpliAccMejAccSsoma",bitsEvidenciaExamen,"modalRegistroAccionMejora");
			calcularEstadoActualAccMejAccSsoma();
		},descargaUrl:"/accidente/accidente_ssoma/accion_mejora/evidencia?"+"id="+accionMejoraAccSsomaId,
		esNuevo:(opcionRegistro == 0 || objAccionMejoraAccSsoma.evidenciaNombre.length == 0?true:false),
		idAux:"CumpliAccMejAccSsoma",evidenciaNombre:(opcionRegistro == 0?"":objAccionMejoraAccSsoma.evidenciaNombre),
		mensajeAux: "*Al subir la evidencia, el estado de la acción de mejora cambiará de 'Pendiente' a 'Completado'."
	};

	crearFormEvidenciaCompleta(options);

	buscarResponsableAccMejAccSsoma();calcularEstadoActualAccMejAccSsoma();
}

var listResponsablesAccMejAccSsoma=[];

function buscarResponsableAccMejAccSsoma(){
	var nombre = $("#inputIngresarDniNombreTrabAccMejAccSsoma").val().trim();

	if(nombre.length >= 3){
		var dataParam={
			trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid")),isBuscador:1
		};

		callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
			listResponsablesAccMejAccSsoma = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"No encontrado"}]:data.trabajadores);

			var selResponsableAccMejAccSsoma = crearSelectOneMenuOblig("selResponsableAccMejAccSsoma","",
				listResponsablesAccMejAccSsoma,"","trabajadorId","nombre");

			$("#divSelAutoTrabPorNombreAccMejAccSsoma").html(selResponsableAccMejAccSsoma);
			$("#inputIngresarDniNombreTrabAccMejAccSsoma").attr("onkeyup","buscarResponsableAccMejAccSsoma()");
		});
	}else{
		listResponsablesAccMejAccSsoma = [{trabajadorId:-1,nombre:"No encontrado"}];

		var selResponsableAccMejAccSsoma = crearSelectOneMenuOblig("selResponsableAccMejAccSsoma","",
			listResponsablesAccMejAccSsoma,"","trabajadorId","nombre");

		$("#divSelAutoTrabPorNombreAccMejAccSsoma").html(selResponsableAccMejAccSsoma);
		$("#inputIngresarDniNombreTrabAccMejAccSsoma").attr("onkeyup","buscarResponsableAccMejAccSsoma()");
	}
}

function calcularEstadoActualAccMejAccSsoma(){
	var nombreEvidencia = $("#inputEviCumpliAccMejAccSsoma").val();

	if(nombreEvidencia.length == 0){
		$("#divEstadoActualAccMejAccSsoma").html("<strong style='color:#D1D619;'>Pendiente</strong>");
	}else{
		$("#divEstadoActualAccMejAccSsoma").html("<strong style='color:blue;'>Completado</strong>");
	}
}

function guardarRegistroAccionMejoraAccSsoma(){
	var campoVacio = true;

	var clasificacionId = parseInt($("#selClasificacionAccMejAccSsoma").val());
	var descripcion = $("#textDescAccMejAccSsoma").val();
	var observacion = $("#textObsAccMejAccSsoma").val();
	var fechaRevision = convertirFechaTexto($("#inputFechaRevAccMejAccSsoma").val());
	var inputFechaRevision = (!fechaRevision?null:fechaRevision);
	var responsableId = parseInt($("#selResponsableAccMejAccSsoma").val());

	if(clasificacionId == -1 || inputFechaRevision == null || responsableId == -1 || descripcion.length == 0){
		campoVacio = false;mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	var evidenciaNombre = $("#inputEviCumpliAccMejAccSsoma").val();
	var estadoId = (evidenciaNombre.length > 0?2:1);

	if(campoVacio && evidenciaNombre == "VOLVER A SUBIR"){
		campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
	}

	if(campoVacio){
		var dataParam = {
			id:accionMejoraAccSsomaId,evidenciaAnId:accidentesSsomaObj.id,clasificacionId:clasificacionId,descripcion:descripcion,observacion:observacion,
			fechaRevision:inputFechaRevision,trabajadorResponsableId:responsableId,responsableNombre:"",responsableMail:"",estadoId:estadoId,inversionAccion:0,
			accionMejoraTipoId:2,horaPlanificada:"13:00:00",trabajadorId:parseInt(getSession("trabajadorGosstId")),empresaId:parseInt(getSession("gestopcompanyid"))
		}

		callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/accion_mejora/save',dataParam,1,0,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					guardarEvidenciaAutoVersionTres(1,data.nuevoId,"fileEviCumpliAccMejAccSsoma",bitsEvidenciaExamen,0,1,
					"/accidente/accidente_ssoma/accion_mejora/evidencia/save",function(){
					    $("#modalRegistroAccionMejora").modal("hide");

						mensajeUx = "<label>El registro acción correctiva fue guardado con éxito.</label>";
						mensajesUx(mensajeUx,1,"","ActualizarAccMejAccSsoma");

						$("#modalMensajeUxActualizarAccMejAccSsoma").on("hidden.bs.modal",function(){
							$("#modalPrincipalAccionMejoraAccSsoma").modal("show");actualizarPrincipalAccSsoma = 1;
							cargarAccionMejoraAccSsoma();
						});
					});

					break;

				default:
					alert("Ocurrió un error al guardar el registro acción correctiva.");
			}
		});
	}else{
		$("#modalRegistroAccionMejora").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionAccMejAccSsoma");

		$("#modalMensajeUxValidacionAccMejAccSsoma").on("hidden.bs.modal",function(){
			$("#modalRegistroAccionMejora").modal("show");
		});
	}
}

function eliminarAccionMejoraAccSsoma(){
	$("#modalPrincipalAccionMejoraAccSsoma").modal("hide");

	mensajeUx="<label>¿Está seguro de eliminar este registro acción correctiva?</label>";
	mensajesUx(mensajeUx,3,"","EliminarAccMejAccSsoma");

	$("#btnDevolverValorEliminarAccMejAccSsoma").on("click",function(){
		var dataParam={
			id:objAccionMejoraAccSsoma.id
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/accion_mejora/delete',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx="<label>El registro acción correctiva fue eliminado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarAccMejAccSsoma");

					$("#modalMensajeUxActualizarAccMejAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalAccionMejoraAccSsoma").modal("show");actualizarPrincipalAccSsoma = 1;
						cargarAccionMejoraAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al eliminar este registro acción correctiva!");
			}
		});
	});

	$("#btnRegresarPrevioEliminarAccMejAccSsoma").on("click",function(){
		$("#modalPrincipalAccionMejoraAccSsoma").modal("show");
	});
}

function validacionCambioEstadoRegistrosValidadosCompletarInformacion(){
	var campoVacio = true;

	if(hasTrabajadorPerfilSsomaAcc > 0){
		if(campoVacio && accidentesSsomaObj.informacionEventoAnId == 0){
			campoVacio = false;mensajeUx = "<label>Debe registrar la investigación del evento.</label>";
		}else if(campoVacio && accidentesSsomaObj.numAccionesMejora < 3){
			campoVacio = false;mensajeUx = "<label>Debe registrar tres acciones correctivas como mínimo.</label>";
		}else if(campoVacio && hashRiePotAsigTrabajador.get(accidentesSsomaObj.riesgoPotencial.id) != 1){
			campoVacio = false;mensajeUx = "<label>Usted no está autorizado para validar un evento con este nivel de potencialidad.</label>";
		}
	}

	if(campoVacio){
		cambiarEstadoActualRegistroAccidentesSsoma(3);
	}else{
		mensajesUx(mensajeUx,2,"","");
	}
}

function cambiarEstadoActualRegistroAccidentesSsoma(nuevoEstadoAccidenteSsoma){
	var nuevoEstadoAccidenteSsomaId = parseInt(nuevoEstadoAccidenteSsoma);
	var textoEstadoActualAux = (nuevoEstadoAccidenteSsomaId == 3?"completar información":"cierre preliminar");

	mensajeUx="<label>¿Está seguro de finalizar '"+textoEstadoActualAux+"' del registro seleccionado?</label>";
	mensajesUx(mensajeUx,3,"","CambiarEstActualAccSsoma");

	$("#btnDevolverValorCambiarEstActualAccSsoma").on("click",function(){
		var dataParam={
			id:accidentesSsomaObj.id,estadoAccidenteSsomaId:nuevoEstadoAccidenteSsomaId,trabajadorId:parseInt(getSession("trabajadorGosstId"))
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/cambiar_estado_actual',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx = "<label>Finalizada '"+textoEstadoActualAux+"' con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarAccSsoma");

					$("#modalMensajeUxActualizarAccSsoma").on("hidden.bs.modal",function(){
						habilitarAccidentesSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al finalizar "+textoEstadoActualAux+"!");
			}
		});
	});
}

function descargarExcelConsolidadoReporteFinal(){
	window.open(URL+"/accidente/accidente-nuevo/excelfinal?idEvidenciaAN="+accidentesSsomaObj.id+"&mdfId="+getSession("unidadGosstId") +
		"&empresaId="+getSession("gestopcompanyid")+"&trabajadorId="+getSession("trabajadorGosstId")+"&idUsuario="+getSession("gestopusuarioid") +
		(accidentesSsomaObj.danioLesionAnId > 0?"&idDanioLesion="+accidentesSsomaObj.danioLesionAnId:""),'_blank');
}

function ocultarDetalleEventoAccidentesSsoma(){
	$("#modalDetalleEventoAccSsoma").modal("hide");
}

function verDetalleEventoAccidentesSsoma(pEvidenciaAnId){
	var evidenciaAnId = parseInt(pEvidenciaAnId);

	$("#modalDetalleEventoAccSsoma").remove();

    var dataParam={
		id:evidenciaAnId
	};

	callAjaxPost(URL+"/accidente/accidente_ssoma/detalle_evento",dataParam,function(data){
		var detalleAccidentesSsomaObj = data.detalleAccidentesSsoma;

		var unidadTexto = (parseInt(getSession("gestopcompanyid")) == 714?"País - Empresa*":"Unidad*"),
			divisionTexto = ([714,716].includes(parseInt(getSession("gestopcompanyid")))?"Sede*":"División*"),
			areaTexto = (parseInt(getSession("gestopcompanyid")) == 714?"Área - Proceso*":"Área*");

		var nombreTestigoUno = (detalleAccidentesSsomaObj.nombreTestigoUno.length == 0?"------":detalleAccidentesSsomaObj.nombreTestigoUno),
			nombreTestigoDos = (detalleAccidentesSsomaObj.nombreTestigoDos.length == 0?"------":detalleAccidentesSsomaObj.nombreTestigoDos);

		var evidenciaPrimeraNombre = (detalleAccidentesSsomaObj.evidenciaPrimeraNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
			"href='"+URL+"/accidente/amazon_s3/accidente_ssoma/evidencia_primera?"+"id="+detalleAccidentesSsomaObj.id+"'>"+detalleAccidentesSsomaObj.evidenciaPrimeraNombre+"</a>");

		var evidenciaSegundaNombre = (detalleAccidentesSsomaObj.evidenciaSegundaNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
			"href='"+URL+"/accidente/amazon_s3/accidente_ssoma/evidencia_segunda?"+"id="+detalleAccidentesSsomaObj.id+"'>"+detalleAccidentesSsomaObj.evidenciaSegundaNombre+"</a>");

		var evidenciaTerceraNombre = (detalleAccidentesSsomaObj.evidenciaTerceraNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
			"href='"+URL+"/accidente/amazon_s3/accidente_ssoma/evidencia_tercera?"+"id="+detalleAccidentesSsomaObj.id+"'>"+detalleAccidentesSsomaObj.evidenciaTerceraNombre+"</a>");

		var contenido = "";

		var listContenido=[
			{sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:"",
			 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CÓDIGO #"+detalleAccidentesSsomaObj.id+" ***</span>"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha del evento:",inputForm:detalleAccidentesSsomaObj.fechaEventoTexto},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hora del evento:",inputForm:detalleAccidentesSsomaObj.horaEventoTexto},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:unidadTexto+":",inputForm:detalleAccidentesSsomaObj.unidad.nombre},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:divisionTexto+":",inputForm:detalleAccidentesSsomaObj.division.divisionName},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:areaTexto+":",inputForm:detalleAccidentesSsomaObj.area.areaName},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Macroproceso:",inputForm:detalleAccidentesSsomaObj.macroproceso.nombre},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Lugar exacto:",inputForm:detalleAccidentesSsomaObj.lugarExacto},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"¿Ocurrió dentro de las instalaciones?",inputForm:detalleAccidentesSsomaObj.snLocalEmpresaTexto},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de evento:",inputForm:detalleAccidentesSsomaObj.tipoEventoAn.nombre}
		];

		if(detalleAccidentesSsomaObj.danioLesionAnId > 0){
			listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Categoria lesión:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.categoriaLesionAn.nombre},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo trabajador accidentado:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.tipoTrabajadorAccidentadoAn.nombre},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nombre del accidentado:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.nombreAccidentado},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"DNI/Cédula:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.numDocAccidentado},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Edad:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.edadAccidentado},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Sexo:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.sexoAn.nombre},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Puesto de trabajo:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.puestoTraAccidentado},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de contrato:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.tipoDeContratAn.nombre},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Experiencia en el puesto de trabajo (meses):",inputForm:detalleAccidentesSsomaObj.danioLesionAn.expPuestoTraAccidentado},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Jefe inmediato del trabajador accidentado:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.jefeTrabAccidentado},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de accidente:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.tipoAccidenteAn.nombre},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
				{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Partes lesionadas:",inputForm:""},
				{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:detalleAccidentesSsomaObj.danioLesionAn.partesLesionSeleccionadosNombre,styleAux:"word-break:break-all;"},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Turno:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.turnoAn.nombre},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"N° de horas trabajadas antes del suceso:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.numHorasTraAccidentado});

			if(detalleAccidentesSsomaObj.tipoEventoAn.id == 1){
				listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha inicio - descanso:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.fechaInicioDescansoTexto},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha fin - descanso:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.fechaFinDescansoTexto},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"N° días de descanso:",inputForm:detalleAccidentesSsomaObj.danioLesionAn.numDiasDescanso});
			}

			listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
				{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción de la atención en primeros auxilios:",inputForm:""},
				{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:detalleAccidentesSsomaObj.danioLesionAn.descripAtencionPrimAuxilios,styleAux:"word-break:break-all;"});
		}

		if(detalleAccidentesSsomaObj.danioPropiedadAn.id != -1){
			listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Daño a la propiedad:",inputForm:detalleAccidentesSsomaObj.danioPropiedadAn.nombre});
		}

		if(detalleAccidentesSsomaObj.danioAmbientalAn.id != -1){
			listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Impacto Ambiental:",inputForm:detalleAccidentesSsomaObj.danioAmbientalAn.nombre});
		}

		listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Cantidad de personas afectadas:",inputForm:detalleAccidentesSsomaObj.numPersonasAfectadas},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nivel de potencialidad del evento:",inputForm:detalleAccidentesSsomaObj.riesgoPotencial.nombre},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Riesgo asociado:",inputForm:detalleAccidentesSsomaObj.factorRiesgo.nombre},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Peligro asociado:",inputForm:detalleAccidentesSsomaObj.peligroAc.nombre},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nombre del testigo 1:",inputForm:nombreTestigoUno},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nombre del testigo 2:",inputForm:nombreTestigoDos},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción del evento:",inputForm:""},
			{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:detalleAccidentesSsomaObj.descripEvento,styleAux:"word-break:break-all;"},
			{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción de la lesión o daño material:",inputForm:""},
			{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:detalleAccidentesSsomaObj.descripLesionDanhio,styleAux:"word-break:break-all;"},
			{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Acciones inmediatas tomadas después del evento:",inputForm:""},
			{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:detalleAccidentesSsomaObj.accInmDespuesEvento,styleAux:"word-break:break-all;"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia #01:",inputForm:evidenciaPrimeraNombre},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia #02:",inputForm:evidenciaSegundaNombre},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia #03:",inputForm:evidenciaTerceraNombre},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",
			 label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarDetalleEventoAccidentesSsoma()'>" +
				       "<i class='fa fa-arrow-left'></i> Volver" +
				   "</button>",inputForm:""});

		listContenido.forEach(function(val){
			contenido += obtenerSubPanelModuloVersionDos(val);
		});

		var modalOptions={
			id:"modalDetalleEventoAccSsoma",nombre:"<i class='fa fa-eye'></i> Detalle del evento",
			contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
		};

		crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	});
}

//Ver análisis de datos
function verQuicksightAccidentesV3(){
	$("#wrapperConsolidadoAccidentesV3").remove();
	$(".divContainerGeneral").hide();

	var buttonVolver = "<button type='button' id='btnVolverDetalle' class='btn btn-success' style='margin-right:10px' " +
		"onclick='volverVistaActos()'>" +
		"<i class='fa fa-sign-out fa-rotate-180'></i>Volver" +
		"</button>";

	$("body").append(
		"<div id='divActoResponsableTabla' style='padding-left:40px;'>" +
		"<form class='form-inline' id='formBtnGeneral'>"+buttonVolver+"</form>" +
		"<div class='container-fluid' id='divContainQuicksightActos' style='padding-right:40px;padding-left:0px;'></div>" +
		"</div>");

	tituloAnteriorColaborador = $(".divTituloGeneral h4").text();
	$(".divTituloGeneral h4").html("Análizar datos de Accidentes / Incidentes SSOMA");

	cargarQuicksightAccidentesV3();
}

function cargarQuicksightAccidentesV3() {
	// Mostrar mensaje de carga
	$('#divContainQuicksightActos').html('<div class="loading">Cargando...</div>');

	var dataParam={
		idEmpresa:getSession("gestopcompanyid"),
		idTrabajador:getSession("trabajadorGosstId")
	};

	callAjaxPost(URL+'/quicksight/accidente-v3',dataParam,function(data){
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
// fin ver análisis de datos

var factorOrgEstandarInvestEventoAccSsomaId,indexFactorOrgEstandarInvestEventoAccSsoma,objFactorOrgEstandarInvestEventoAccSsoma = {};
var listFactoresOrganizacionEstandarInvestEventoAccSsoma = [],listTiposEventInvEveAccSsoma = [],
	listFactoresOrganizacionEstandarAuxInvEveAccSsoma = [];

function toggleMenuOpcionFactoresOrganizacionEstandarInvestEventoAccSsoma(obj,pindex){
	objFactorOrgEstandarInvestEventoAccSsoma = listFactoresOrganizacionEstandarInvestEventoAccSsoma[pindex];
	indexFactorOrgEstandarInvestEventoAccSsoma = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesFactoresOrganizacionEstandarInvestEventoAccSsoma=[
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
	 functionClick:function(data){registroFactoresOrganizacionEstandarInvestEventoAccSsoma(1)}},
	{id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
	 functionClick:function(data){eliminarFactoresOrganizacionEstandarInvestEventoAccSsoma()}}
];

function marcarSubOpcionFactoresOrganizacionEstandarInvestEventoAccSsoma(pindex){
	funcionalidadesFactoresOrganizacionEstandarInvestEventoAccSsoma[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma(){
	$("#modalPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("hide");$("#modalPrincipalInvestigacionEventoAccSsoma").modal("show");

	if(actualizarIndInvestEventoAccSsoma == 1){
		cargarInvestigacionEventoAccSsoma();
	}
}

function verFactoresOrganizacionEstandarInvestEventoAccSsoma(){
	$("#modalPrincipalInvestigacionEventoAccSsoma").modal("hide");$("#modalPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma").remove();

	actualizarIndInvestEventoAccSsoma = 0;

	var listModal={
		id:"modalPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma",nombre:"Factores de la organización estándar",
		contenido:"<div id='estadoMovilPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma'></div>",btnCerrarHabilitado:0
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	cargarFactoresOrganizacionEstandarInvestEventoAccSsoma();
}

function cargarFactoresOrganizacionEstandarInvestEventoAccSsoma(){
	$("#estadoMovilPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma").html("");

	var dataParam={
		informacionEventoAnId:objInvestEventoAccSsoma.id
	};

	callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/factores_organizacion_estandar',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];
			var textTotalRegistros= "";

			listFactoresOrganizacionEstandarInvestEventoAccSsoma = data.listFactoresOrganizacionEstandarInvestEventoAccSsoma;listTiposEventInvEveAccSsoma = data.listTiposEventos;
			listFactoresOrganizacionEstandarAuxInvEveAccSsoma = data.listCausasInmediatas;

			listFactoresOrganizacionEstandarInvestEventoAccSsoma.forEach(function(val,index){
				var btnOpcion="",menuOpcion="";

				menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
				funcionalidadesFactoresOrganizacionEstandarInvestEventoAccSsoma.forEach(function(val1,index1){
					menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionFactoresOrganizacionEstandarInvestEventoAccSsoma("+index1+")'>"+val1.nombre+"</li>";
				});
				menuOpcion += "</ul>";

				btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionFactoresOrganizacionEstandarInvestEventoAccSsoma(this,"+index+")'>" +
					    "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
					"</a>";

				var listTotal=[
					{sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
					 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** REGISTRO #"+(index+1)+" ***</span>"},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Tipo:",inputForm:val.tipoEvento.nombre},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Causa:",inputForm:val.causaInmediata.nombre}
				];

				if(val.descripcion.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-exclamation-circle'></i> Observaciones:",inputForm:""},
						{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.descripcion,styleAux:"word-break:break-all;"});
				}else{
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Observaciones:",inputForm:"------"});
				}

				if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
				}

				if(val.fechaRegistroTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
						inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
				}

				if(val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
						inputForm:val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")")});
				}

				textTotalRegistros += "<div class='eventoGeneral'>" +
					                      "<form class='eventoGeneral'>";
				listTotal.forEach(function(val,index){
					textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
				});
				textTotalRegistros +=     "</form>" +
					                  "</div>";
			});

			listPanelesPrincipal.push({id:"volverInvestigacionEventoFactorOrgEstandar",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma()",
				 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista anterior",nombre:"Regresar a la investigación del evento",contenido:""},
				{id:"nuevoRegFactorOrganizacionEstandarInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroFactoresOrganizacionEstandarInvestEventoAccSsoma(0)",
				 btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar factor de la organización estándar",contenido:""},
				{id:"registroFactorOrganizacionEstandarInvestEvento",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
				 btnIconoAux:"",btnTitleAux:"",nombre:"Factores de la organización estándar registrados ("+listFactoresOrganizacionEstandarInvestEventoAccSsoma.length+")",contenido:textTotalRegistros});

			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma");

			$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
		}else{
			console.log("NOPNPO")
		}
	});
}

function ocultarRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma(){
	$("#modalRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("hide");$("#modalPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("show");
}

function registroFactoresOrganizacionEstandarInvestEventoAccSsoma(opcRegistro){
	var opcionRegistro = parseInt(opcRegistro);

	$("#modalPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("hide");$("#modalRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma").remove();

	factorOrgEstandarInvestEventoAccSsomaId = (opcionRegistro == 0?0:objFactorOrgEstandarInvestEventoAccSsoma.id);

	var selTipoEventoFactorOrgEstandarInvesEventoAccSsoma = crearSelectOneMenu("selTipoEventoFactorOrgEstandarInvesEventoAccSsoma","verFactorOrganizacionEstandarSegunTipoEventoFactorOrgEstandarInvestEventoAccSsoma()",
		listTiposEventInvEveAccSsoma,(factorOrgEstandarInvestEventoAccSsomaId == 0?"-1":objFactorOrgEstandarInvestEventoAccSsoma.tipoEvento.id),"id","nombre");

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo:",inputForm:selTipoEventoFactorOrgEstandarInvesEventoAccSsoma},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Causa:",inputForm:"",divContainer:"divSelValorFactorOrgEstandarInvesEventoAccSsoma"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observaciones:",inputForm:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
		 inputForm:"<textarea class='form-control' rows='4' id='textObsFactorOrgEstandarInvestEventoAccSsoma'></textarea>"+"<label style='color:blue;float:right;'>(opcional)</label>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma()'>" +
				       "<i class='fa fa-floppy-o'></i> Guardar" +
				   "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma",nombre:"<i class='fa fa-pencil-square-o'></i> Registro factor de la organización estándar",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	if(opcionRegistro == 1){
		$("#textObsFactorOrgEstandarInvestEventoAccSsoma").val(objFactorOrgEstandarInvestEventoAccSsoma.descripcion);
	}

	verFactorOrganizacionEstandarSegunTipoEventoFactorOrgEstandarInvestEventoAccSsoma();
}

function verFactorOrganizacionEstandarSegunTipoEventoFactorOrgEstandarInvestEventoAccSsoma(){
	var tipoEventoId = parseInt($("#selTipoEventoFactorOrgEstandarInvesEventoAccSsoma").val());

	if(tipoEventoId != -1){
		var listCausasInmediatasResultado = [];

		listFactoresOrganizacionEstandarAuxInvEveAccSsoma.forEach(function(val){
			if(val.causaInmTipoEvent == tipoEventoId){
				listCausasInmediatasResultado.push(val);
			}
		});

		var selValorFactorOrgEstandarInvesEventoAccSsoma = crearSelectOneMenu("selValorFactorOrgEstandarInvesEventoAccSsoma","",
			listCausasInmediatasResultado,(factorOrgEstandarInvestEventoAccSsomaId == 0?"-1":objFactorOrgEstandarInvestEventoAccSsoma.causaInmediata.id),"id","nombre");

		$("#divSelValorFactorOrgEstandarInvesEventoAccSsoma").html(selValorFactorOrgEstandarInvesEventoAccSsoma);
	}else{
		$("#divSelValorFactorOrgEstandarInvesEventoAccSsoma").html("<label>*Las causas se muestran según el 'tipo' seleccionado.</label>");
	}
}

function guardarRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma(){
	var campoVacio = true;

	var tipoEventoId = parseInt($("#selTipoEventoFactorOrgEstandarInvesEventoAccSsoma").val());
	var causaInmediataId = parseInt($("#selValorFactorOrgEstandarInvesEventoAccSsoma").val());
	var descripcion = $("#textObsFactorOrgEstandarInvestEventoAccSsoma").val();

	if(tipoEventoId == -1 || causaInmediataId == -1){
		campoVacio = false;mensajeUx = "<label>Debe completar los campos activos.</label>";
	}

	if(campoVacio){
		var dataParam={
			id:factorOrgEstandarInvestEventoAccSsomaId,tipoEventoId:tipoEventoId,causaInmediataId:causaInmediataId,descripcion:descripcion,
			trabajadorId:parseInt(getSession("trabajadorGosstId")),informacionEventoAnId:objInvestEventoAccSsoma.id
		};

		callAjaxPostSimpleVersionDos(1,URL+'/accidente/accidente_ssoma/investigacion_evento/factores_organizacion_estandar/save',dataParam,1,1,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					$("#modalRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("hide");

					mensajeUx="<label>El registro factor de la organización estándar fue guardado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarFactorOrgEstandarInvestEventoAccSsoma");

					$("#modalMensajeUxActualizarFactorOrgEstandarInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
						cargarFactoresOrganizacionEstandarInvestEventoAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al guardar el registro factor de la organización estándar.");
			}
		});
	}else{
		$("#modalRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionFactorOrgEstandarInvestEventoAccSsoma");

		$("#modalMensajeUxValidacionFactorOrgEstandarInvestEventoAccSsoma").on("hidden.bs.modal",function(){
			$("#modalRegistroFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("show");
		});
	}
}

function eliminarFactoresOrganizacionEstandarInvestEventoAccSsoma(){
	$("#modalPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("hide");

	mensajeUx="<label>¿Está seguro de eliminar este registro factor de la organización estándar?</label>";
	mensajesUx(mensajeUx,3,"","EliminarFactorOrgEstandarInvestEventoAccSsoma");

	$("#btnDevolverValorEliminarFactorOrgEstandarInvestEventoAccSsoma").on("click",function(){
		var dataParam={
			id:objFactorOrgEstandarInvestEventoAccSsoma.id
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/investigacion_evento/factores_organizacion_estandar/delete',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx="<label>El registro factor de la organización estándar fue eliminado con éxito.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarFactorOrgEstandarInvestEventoAccSsoma");

					$("#modalMensajeUxActualizarFactorOrgEstandarInvestEventoAccSsoma").on("hidden.bs.modal",function(){
						$("#modalPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("show");actualizarIndInvestEventoAccSsoma = 1;
						cargarFactoresOrganizacionEstandarInvestEventoAccSsoma();
					});

					break;

				default:
					alert("Ocurrió un error al eliminar este registro factor de la organización estándar!");
			}
		});
	});

	$("#btnRegresarPrevioEliminarFactorOrgEstandarInvestEventoAccSsoma").on("click",function(){
		$("#modalPrincipalFactoresOrganizacionEstandarInvestEventoAccSsoma").modal("show");
	});
}
