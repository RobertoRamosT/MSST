
var listTiposExamenContratistaBuscador = [],listTipoNotaBuscador = [],listTiposExamenContratistaBuscadorAuxTotal = [],listTipoNotaBuscadorAuxTotal = [];

var listOpcionBuscadorDocumentos=[
	{id:1,nombre:"Documentos a nivel trabajador contratista"}
];

function ocultarBuscadorEvaDocProyecto(){
	$("#modalBuscadorEvaDocumentoProy").modal("hide");
}

function verBuscadorEvaDocProyecto(){
	$("#modalBuscadorEvaDocumentoProy").remove();

	var dataParam={
		empresaId:parseInt(getSession("gestopcompanyid")),listTipoExamenContNoPermitidosIdAux:listTipoExamenNoPermitidoUsuario
	};

	callAjaxPostSimpleVersionDos(1,URL+'/contratista/vista_documentos/buscador_compuesto/valores_previos',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			listTiposExamenContratistaBuscador = data.listTiposExamenContratista;listTipoNotaBuscador = data.listTipoNota;
			listTiposExamenContratistaBuscadorAuxTotal = [];listTipoNotaBuscadorAuxTotal = [];

			listTiposExamenContratistaBuscador.forEach(function(val){
				listTiposExamenContratistaBuscadorAuxTotal.push(val.id);
			});

			listTipoNotaBuscador.forEach(function(val){
				listTipoNotaBuscadorAuxTotal.push(val.id);
			});

			var selOpcBuscadorEvaDocProy = crearSelectOneMenuOblig("selOpcBuscadorEvaDocProy",
				"verAcordeOpcionBuscadorEvaDocProyecto()",listOpcionBuscadorDocumentos,"1","id","nombre");

			var contenido = "";

			var listContenido=[
				{sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",label:"Opción",inputForm:selOpcBuscadorEvaDocProy,divContainer:"divSelOpcionBuscadorEvaDocProy"},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
				{sugerencia:"",anchoLabel:"",anchoDiv:"",
			 	 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarBuscadorEvaDocProyecto()'>" +
					   	   "<i class='fa fa-times'></i> Cancelar" +
					   "</button>",
			 	 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='buscarDatosSegunOpcionEvaDocProyecto()'>" +
					           "<i class='fa fa-search'></i> Buscar" +
					       "</button>"}
			];

			listContenido.forEach(function(val){
				contenido += obtenerSubPanelModuloVersionDos(val);
			});

			var modalOptions={
				id:"modalBuscadorEvaDocumentoProy",nombre:"<i class='fa fa-search'></i> Seleccionar opción",
				contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
			};

			crearModalPrincipalUsuario(modalOptions,function(){},true,true);

			verAcordeOpcionBuscadorEvaDocProyecto();
		}else{
			console.log("NOPNPO");
		}
	});
}

var opcionBuscadorEvaDocProy;

function verAcordeOpcionBuscadorEvaDocProyecto(){
	$(".atributo-opcionBuscadorEvaDocProyecto").remove();

	var listContenidoDivSelOpcBuscadorEvaDocProy = [];
	opcionBuscadorEvaDocProy = parseInt($("#selOpcBuscadorEvaDocProy").val());

	if([1].includes(opcionBuscadorEvaDocProy)){
		listContenidoDivSelOpcBuscadorEvaDocProy.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Contratista:",
				inputForm:"<input class='form-control' type='text' id='inputIngresarRucNombreContratistaEvaDocProy'>" +
					"<div id='divSelAutoContratistaPorNombreEvaDocProy'></div>" +
					"<label>*Buscar contratista por RUC y/o nombre (debe ingresar 3 caracteres como mínimo).</label>"});
	}

	if([1].includes(opcionBuscadorEvaDocProy)){
		listContenidoDivSelOpcBuscadorEvaDocProy.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",label:"Trabajador:",
			inputForm:"<input class='form-control' type='text' id='inputTrabajadorContratistaConsultaEvaDocProy'>" +
				"<div id='divAutoCompletarTrabajadorContratistaConsultaEvaDocProy'></div>" +
				"<label>*Buscar trabajador por N° documento y/o nombre/apellido (debe ingresar 3 caracteres como mínimo).</label>"});
	}

	if([1].includes(opcionBuscadorEvaDocProy)){
		listContenidoDivSelOpcBuscadorEvaDocProy.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});

		if(listTiposExamenContratistaBuscador.length > 0){
		    listContenidoDivSelOpcBuscadorEvaDocProy.push({sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Tipo",
			     inputForm:"<a class='efectoLink' onclick='verCheckListTiposExamenTrabContEvaDocProy()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
			    {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTiposExamenTrabContEvaDocProy"});
		}else{
			listContenidoDivSelOpcBuscadorEvaDocProy.push({sugerencia:"",label:"Tipo",inputForm:"<label>*No tiene valores asociados a su usuario.</label>"});
		}
	}

	if([1].includes(opcionBuscadorEvaDocProy)){
		listContenidoDivSelOpcBuscadorEvaDocProy.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Estado de la evaluación",
			 inputForm:"<a class='efectoLink' onclick='verCheckListEstadosEvaluacionEvaDocProy()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
			{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelEstadosEvaluacionEvaDocProy"});
	}

	var contenido = "";

	listContenidoDivSelOpcBuscadorEvaDocProy.forEach(function(val){
		val.clase = "atributo-opcionBuscadorEvaDocProyecto";
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	$("#divSelOpcionBuscadorEvaDocProy").parent().after(contenido);

	if([1].includes(opcionBuscadorEvaDocProy)){
		if(listTiposExamenContratistaBuscador.length > 0){
			crearCheckListGeneral("modalBuscadorEvaDocumentoProy","Tipos","TipoExamTrabContEvaDocProySelec",
				listTiposExamenContratistaBuscador,"TiposExamenTrabContEvaDocProy",ocultarCheckListTiposExamenTrabContEvaDocProy);
		}

		crearCheckListGeneral("modalBuscadorEvaDocumentoProy","Estados de la evaluación","EstEvaluacionEvaDocProySelec",
			listTipoNotaBuscador,"EstadosEvaluacionEvaDocProy",ocultarCheckListEstadosEvaluacionEvaDocProy);

		buscarContratistaEmpresaBuscadorEvaDocProy();
	}
}

function ocultarCheckListTiposExamenTrabContEvaDocProy(){
	var textTipoExamTrabContEvaDocProySelec = "";

	listTiposExamenContratistaBuscador.forEach(function(val,index){
		var isSeleccionado = ($("#checkAsignadoTipoExamTrabContEvaDocProySelec"+val.id).prop("checked")?1:0);

		if(isSeleccionado == 1){
			textTipoExamTrabContEvaDocProySelec += (textTipoExamTrabContEvaDocProySelec.length == 0?val.nombre:", "+val.nombre);
		}
	});

	textTipoExamTrabContEvaDocProySelec = (textTipoExamTrabContEvaDocProySelec.length == 0?"Todos":textTipoExamTrabContEvaDocProySelec);

	$("#divSelTiposExamenTrabContEvaDocProy").html(textTipoExamTrabContEvaDocProySelec);

	$("#modalCheckListTipoExamTrabContEvaDocProySelec").modal("hide");$("#modalBuscadorEvaDocumentoProy").modal("show");
}

function verCheckListTiposExamenTrabContEvaDocProy(){
	$("#modalCheckListTipoExamTrabContEvaDocProySelec").modal("show");$("#modalBuscadorEvaDocumentoProy").modal("hide");
}

function ocultarCheckListEstadosEvaluacionEvaDocProy(){
	var textEstEvaluacionEvaDocProySelec = "";

	listTipoNotaBuscador.forEach(function(val,index){
		var isSeleccionado = ($("#checkAsignadoEstEvaluacionEvaDocProySelec"+val.id).prop("checked")?1:0);

		if(isSeleccionado == 1){
			textEstEvaluacionEvaDocProySelec += (textEstEvaluacionEvaDocProySelec.length == 0?val.nombre:", "+val.nombre);
		}
	});

	textEstEvaluacionEvaDocProySelec = (textEstEvaluacionEvaDocProySelec.length == 0?"Todos":textEstEvaluacionEvaDocProySelec);

	$("#divSelEstadosEvaluacionEvaDocProy").html(textEstEvaluacionEvaDocProySelec);

	$("#modalCheckListEstEvaluacionEvaDocProySelec").modal("hide");$("#modalBuscadorEvaDocumentoProy").modal("show");
}

function verCheckListEstadosEvaluacionEvaDocProy(){
	$("#modalCheckListEstEvaluacionEvaDocProySelec").modal("show");$("#modalBuscadorEvaDocumentoProy").modal("hide");
}

var listBuscadorContratistasEvaDocProy=[];

function buscarContratistaEmpresaBuscadorEvaDocProy(){
	var nombre = $("#inputIngresarRucNombreContratistaEvaDocProy").val().trim();

	if(nombre.length >= 3){
		var dataParam={
			nombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid")),isBuscador:1
		};

		callAjaxPostNoLoad(URL+"/contratista/buscar",dataParam,function(data){
			listBuscadorContratistasEvaDocProy = (data.contratistas.length == 0?[{id:-1,nombre:"No encontrado"}]:data.contratistas);

			var selContratistaBuscadorEvaDocProy = crearSelectOneMenuOblig("selContratistaBuscadorEvaDocProy","verAutoCompletarTrabContratistaBuscadorEvaDocProy();",
				listBuscadorContratistasEvaDocProy,"","id","nombre");

			$("#divSelAutoContratistaPorNombreEvaDocProy").html(selContratistaBuscadorEvaDocProy);

			$("#inputIngresarRucNombreContratistaEvaDocProy").attr("onkeyup","buscarContratistaEmpresaBuscadorEvaDocProy()");

			if(opcionBuscadorEvaDocProy == 1){
				verAutoCompletarTrabContratistaBuscadorEvaDocProy();
			}
		});
	}else{
		listBuscadorContratistasEvaDocProy = [{id:-1,nombre:"No encontrado"}];

		var selContratistaBuscadorEvaDocProy = crearSelectOneMenuOblig("selContratistaBuscadorEvaDocProy","",
			listBuscadorContratistasEvaDocProy,"","id","nombre");

		$("#divSelAutoContratistaPorNombreEvaDocProy").html(selContratistaBuscadorEvaDocProy);

		$("#inputIngresarRucNombreContratistaEvaDocProy").attr("onkeyup","buscarContratistaEmpresaBuscadorEvaDocProy()");

		if(opcionBuscadorEvaDocProy == 1){
			verAutoCompletarTrabContratistaBuscadorEvaDocProy();
		}
	}
}

var listBuscadorTrabContratistaEvaDocProy = [];

function verAutoCompletarTrabContratistaBuscadorEvaDocProy(){
	var contratistaId = parseInt($("#selContratistaBuscadorEvaDocProy").val());
	var trabajadorContratista = $("#inputTrabajadorContratistaConsultaEvaDocProy").val().trim();

	document.getElementById("inputTrabajadorContratistaConsultaEvaDocProy").disabled = (contratistaId != -1?false:true);

	if(contratistaId != -1){
		if(trabajadorContratista.length >= 3){
			var dataParam={
				nombre:"%"+trabajadorContratista+"%",isBuscador:1,contratistaId:contratistaId
			};

			callAjaxPostNoLoad(URL+"/contratista/trabajadores/buscar/simple",dataParam,function(data){
				listBuscadorTrabContratistaEvaDocProy = (data.trabajadores.length == 0?[{id:-1,nombre:"No encontrado"}]:data.trabajadores);

				var selAutoTrabContratistaBuscadorEvaDocProy = crearSelectOneMenuOblig("selAutoTrabContratistaBuscadorEvaDocProy","",
					listBuscadorTrabContratistaEvaDocProy,"","id","nombre");

				$("#divAutoCompletarTrabajadorContratistaConsultaEvaDocProy").html(selAutoTrabContratistaBuscadorEvaDocProy);
				$("#inputTrabajadorContratistaConsultaEvaDocProy").attr("onkeyup","verAutoCompletarTrabContratistaBuscadorEvaDocProy()");
			});
		}else{
			listBuscadorTrabContratistaEvaDocProy = [{id:-1,nombre:"No encontrado"}];

			var selAutoTrabContratistaBuscadorEvaDocProy = crearSelectOneMenuOblig("selAutoTrabContratistaBuscadorEvaDocProy","",
				listBuscadorTrabContratistaEvaDocProy,"","id","nombre");

			$("#divAutoCompletarTrabajadorContratistaConsultaEvaDocProy").html(selAutoTrabContratistaBuscadorEvaDocProy);
			$("#inputTrabajadorContratistaConsultaEvaDocProy").attr("onkeyup","verAutoCompletarTrabContratistaBuscadorEvaDocProy()");
		}
	}else{
		$("#inputTrabajadorContratistaConsultaEvaDocProy").val("");$("#divAutoCompletarTrabajadorContratistaConsultaEvaDocProy").html("");
	}
}

function buscarDatosSegunOpcionEvaDocProyecto(){
	if(opcionBuscadorEvaDocProy == 1){
		if(listTiposExamenContratistaBuscador.length > 0){
			habilitarResultadoBuscadorOpcionUno();
		}else{
			$("#modalBuscadorEvaDocumentoProy").modal("hide");

			mensajeUx = "<label>*No tiene valores asociados a su usuario.</label>";
			mensajesUx(mensajeUx,2,"","ValidacionBuscador");

			$("#modalMensajeUxValidacionBuscador").on("hidden.bs.modal",function(){
				$("#modalBuscadorEvaDocumentoProy").modal("show");
			});
		}
	}
}

var listResultadoOpcUnoDocumentos = [],listTiposExamContBuscadorSeleccionados = [],listTipoNotaBuscadorSeleccionados = [];
var contratistaNombreAux = "",trabContratistaNombreAux = "";

function habilitarResultadoBuscadorOpcionUno(){
	$("#modalBuscadorEvaDocumentoProy").modal("hide");$("#modalEstadoActualTrabajadorContratista").remove();

	var campoVacio = true;

	var idContratista = parseInt($("#selContratistaBuscadorEvaDocProy").val());

	if(idContratista == -1){
		campoVacio = false;mensajeUx = "<label>Debe ingresar el RUC y/o nombre de la contratista en el buscador y seleccionarla.</label>";
	}

	if(campoVacio){
		var idTrabajadorContratista = parseInt($("#selAutoTrabContratistaBuscadorEvaDocProy").val());

		if(idTrabajadorContratista == -1){
			campoVacio = false;mensajeUx = "<label>Debe ingresar el N° documento y/o nombre/apellido del trabajador contratista en el buscador y seleccionarlo.</label>";
		}
	}

	listTiposExamContBuscadorSeleccionados = [];

	listTiposExamenContratistaBuscador.forEach(function(val){
		var isSeleccionado = ($("#checkAsignadoTipoExamTrabContEvaDocProySelec"+val.id).prop("checked")?1:0);

		if(isSeleccionado == 1){
			listTiposExamContBuscadorSeleccionados.push(val.id);
		}
	});

	listTipoNotaBuscadorSeleccionados = [];

	listTipoNotaBuscador.forEach(function(val){
		var isSeleccionado = ($("#checkAsignadoEstEvaluacionEvaDocProySelec"+val.id).prop("checked")?1:0);

		if(isSeleccionado == 1){
			listTipoNotaBuscadorSeleccionados.push(val.id);
		}
	});

	if(campoVacio){
		listBuscadorContratistasEvaDocProy.forEach(function(val){
			if(val.id == idContratista){
				contratistaNombreAux = val.nombre;
			}
		});

		listBuscadorTrabContratistaEvaDocProy.forEach(function(val){
			if(val.id == idTrabajadorContratista){
				trabContratistaNombreAux = val.nombre;
			}
		});

		verConsolidadoResultadoOpcionUnoEvaDocProyecto();
	}else{
		mensajesUx(mensajeUx,2,"","ValidacionBuscador");

		$("#modalMensajeUxValidacionBuscador").on("hidden.bs.modal",function(){
			$("#modalBuscadorEvaDocumentoProy").modal("show");
		});
	}
}

function ocultarConsolidadoResultadoOpcionUnoEvaDocProyecto(){
	$("#modalConsolidadoResOpcionUnoBusqueda").modal("hide");$("#modalBuscadorEvaDocumentoProy").modal("show");
}

var numPaginaActualResOpcUnoEvaDocProy;

function verConsolidadoResultadoOpcionUnoEvaDocProyecto(){
	$("#modalConsolidadoResOpcionUnoBusqueda").remove();

	var contenido = "";

	var buttonOcultar =
		"<button id='btnOcultarResOpcUnoEvaDocProy' type='button' class='btn btn-info' style='margin-right:5px' " +
		        "onclick='ocultarConsolidadoResultadoOpcionUnoEvaDocProyecto()' title='Regresar a la vista anterior.'>" +
		    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> "+"<i class='fa fa-search fa-2x'></i>" +
		"</button>";

	var buttonFlechas =
		"<span id='indicadorPaginaParcialAuxResOpcUnoEvaDocProy' style='margin:5px;margin-top:10px;'>" +
			"<a id='flechaIzquierdaResOpcUnoEvaDocProy'><img src='../imagenes/flecha_01.png' /></a>" +
			" <em id='labelFlechasResOpcUnoEvaDocProy'></em> " +
			"<a id='flechaDerechaResOpcUnoEvaDocProy'><img src='../imagenes/flecha_02.png' /></a>" +
		"</span>";

	var modalOptions={
		maxWidth:"70%",id:"modalConsolidadoResOpcionUnoBusqueda",btnCerrarHabilitado:0,
		nombre:"<i class='fa fa-table'></i> Resultado búsqueda - contratista '"+contratistaNombreAux+"' > trabajador '"+trabContratistaNombreAux+"'",
		contenido:
			"<form class='form-inline'>" +
			     buttonOcultar+buttonFlechas +
			"</form>" +
			"<div class='wrapper' id='wrapperConsolidadoResOpcionUnoBusqueda'>" +
				"<table id='tblConsolidadoResOpcionUnoBusqueda' class='table table-striped table-bordered table-hover table-fixed'>" +
					"<thead>" +
						"<tr>" +
							"<th class='tb-acc' style='width:150px'>Tipo</td>" +
							"<th class='tb-acc' style='width:250px'>Detalle</td>" +
							"<th class='tb-acc' style='width:250px'>Evaluación</td>" +
						"</tr>" +
					"</thead>" +
					"<tbody></tbody>" +
				"</table>" +
			"</div>"};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	resizeDivWrapper("wrapperConsolidadoResOpcionUnoBusqueda",190);
	cargarConsolidadoResultadoOpcionUnoEvaDocProyecto();

	$("#flechaIzquierdaResOpcUnoEvaDocProy").on('click',function(){
		numPaginaActualResOpcUnoEvaDocProy = numPaginaActualResOpcUnoEvaDocProy-1;
		cambiarPaginaConsolidadoResultadoOpcionUnoEvaDocProyecto();
	});

	$('#flechaDerechaResOpcUnoEvaDocProy').on('click',function(){
		numPaginaActualResOpcUnoEvaDocProy = numPaginaActualResOpcUnoEvaDocProy+1;
		cambiarPaginaConsolidadoResultadoOpcionUnoEvaDocProyecto();
	});
}

function cargarConsolidadoResultadoOpcionUnoEvaDocProyecto(){
	$("#modalConsolidadoResOpcionUnoBusqueda").modal("show");
	numPaginaActualResOpcUnoEvaDocProy = 1;

	var dataParam={
		empresaId:parseInt(getSession("gestopcompanyid")),trabajadorId:parseInt($("#selAutoTrabContratistaBuscadorEvaDocProy").val()),
		listTiposExamContBuscadorId:(listTiposExamContBuscadorSeleccionados.length == 0?listTiposExamenContratistaBuscadorAuxTotal:listTiposExamContBuscadorSeleccionados),
		listTipoNotaBuscadorId:(listTipoNotaBuscadorSeleccionados.length == 0?listTipoNotaBuscadorAuxTotal:listTipoNotaBuscadorSeleccionados)
	};

	callAjaxPost(URL+'/contratista/vista_documentos/buscador_compuesto/resultado_opcion_uno',dataParam,function(data){
		if(data.CODE_RESPONSE == "05"){
			listResultadoOpcUnoDocumentos = data.listResultadoOpcUnoDocumentos;

			if(listResultadoOpcUnoDocumentos.length > 0){
				$("#tblConsolidadoResOpcionUnoBusqueda tbody tr").remove();

				cambiarPaginaConsolidadoResultadoOpcionUnoEvaDocProyecto();

				goheadfixedY("#tblConsolidadoResOpcionUnoBusqueda", "#wrapperConsolidadoResOpcionUnoBusqueda");
			}else{
				$("#modalConsolidadoResOpcionUnoBusqueda").modal("hide");

				mensajeUx = "<label>No se encontraron resultados asociados al trabajador '"+trabContratistaNombreAux+"' " +
					"de la contratista '"+contratistaNombreAux+"'.</label>";
				mensajesUx(mensajeUx,2,"","ValidacionResultado");

				$("#modalMensajeUxValidacionResultado").on("hidden.bs.modal",function(){
					$("#modalBuscadorEvaDocumentoProy").modal("show");
				});
			}
		}else{
			console.log("Error al cargar el consolidado con el resultado de la opción uno.");
		}
	});
}

function cambiarPaginaConsolidadoResultadoOpcionUnoEvaDocProyecto(){
	$("#flechaIzquierdaResOpcUnoEvaDocProy").show();$("#flechaDerechaResOpcUnoEvaDocProy").show();

	var list = listResultadoOpcUnoDocumentos;
	var totalSize = list.length;
	var partialSize = 100;

	var numPaginaTotal = Math.ceil(totalSize/partialSize);

	var inicioRegistro = (numPaginaActualResOpcUnoEvaDocProy*partialSize)-partialSize;
	var finRegistro = (numPaginaActualResOpcUnoEvaDocProy*partialSize)-1;

	if(numPaginaTotal == 0){
		numPaginaTotal = 1;
	}

	$("#labelFlechasResOpcUnoEvaDocProy").html("<label>"+numPaginaActualResOpcUnoEvaDocProy+" de "+numPaginaTotal+"</label>");

	if(numPaginaActualResOpcUnoEvaDocProy == 1){
		$("#flechaIzquierdaResOpcUnoEvaDocProy").hide();
	}

	if(numPaginaActualResOpcUnoEvaDocProy == numPaginaTotal){
		$("#flechaDerechaResOpcUnoEvaDocProy").hide();
	}

	if(finRegistro >= totalSize){
		finRegistro = totalSize-1;
	}

	$("#tblConsolidadoResOpcionUnoBusqueda tbody tr").remove();

	list.forEach(function(val,index){
		if(inicioRegistro <= index && index <= finRegistro){
			var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
				"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia?id="+val.id+"'>"+
				    "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
				"</a>");

			var enlaceAuxiliar = (val.evidenciaAuxiliarNombre.trim().length == 0?"------":
				"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar?id="+val.id+"'>"+
					"<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
				"</a>");

			var enlaceAuxiliarDos = (val.evidenciaAuxiliarDosNombre.trim().length == 0?"------":
				"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar_dos?id="+val.id+"'>"+
					"<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
				"</a>");

			var enlaceAuxiliarTres = (val.evidenciaAuxiliarTresNombre.trim().length == 0?"------":
				"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar_tres?id="+val.id+"'>"+
					"<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
				"</a>");

			var enlaceVacunacion = (val.evidenciaVacunacionNombre.trim().length == 0?"------":
				"<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaVacunacionUrl)+"'>"+
					"<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
				"</a>");

			var enlaceDni = (val.evidenciaDniNombre.trim().length == 0?"------":
				"<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaDniUrl)+"'>"+
					"<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
				"</a>");

			var textEvidencia = (val.tipo.id == 78?"Certificado DIGESA":(val.tipo.id == 79?"Certificado de aptitud médica ocupacional":"Evidencia")),
			    textEvidenciaAux = (val.tipo.id == 79?"Certificados médicos adicionales":(val.tipo.id == 90?"Comprobante de pago":"Evidencia auxiliar"));

			var detalle = (val.tipo.id != 34?"<strong>*"+textEvidencia+":</strong> "+enlaceEvidencia:"") +
				([2,79,90].includes(val.tipo.id)?"<br><strong>*"+textEvidenciaAux+":</strong> "+enlaceAuxiliar:"") +
				(val.tipo.id == 2?"<br><strong>*Comprobante de pago:</strong> "+enlaceAuxiliarDos:"") +
				(parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1?"<br><strong>*Certificado de clínica:</strong> "+enlaceAuxiliar:"") +
				(parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1?"<br><strong>*Riesgo de exposición al puesto de trabajo:</strong> "+enlaceAuxiliarDos:"") +
				(parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1?"<br><strong>*Vacunación o declaración jurada de no patologías COVID-19:</strong> "+enlaceAuxiliarTres:"") +
				(parseInt(getSession("gestopcompanyid")) == 272 && val.tipo.id == 1?"<br><strong>*Test de altura:</strong> "+enlaceAuxiliar:"") +
				(val.tipo.id == 34?"<strong>*Carné de vacunación:</strong> "+enlaceVacunacion:"") +
				(val.tipo.id == 34?"<br><strong>*DNI (Parte frontal):</strong> "+enlaceDni:"") +
				(val.tipo.id == 8?"<br><strong>*Descripción:</strong> "+(val.tema.trim().length == 0?"------":val.tema):"") +
				(val.tipo.id == 15?"<br><strong>*Tipo de certificado:</strong> "+val.tipoCertificado.nombre:"") +
				([15,79].includes(val.tipo.id)?"<br><strong>*Puesto de trabajo:</strong> "+(val.puestoTrabajo.trim().length == 0?"------":val.puestoTrabajo):"") +
				(val.tipo.id == 34?"<br><strong>*Fecha última dosis:</strong> "+val.fechaUltimaDosisTexto:"") +
				(val.tipo.id == 34?"<br><strong>*Tipo de vacuna:</strong> "+val.tipoVacunaCovid.nombre:"") +
				(val.tipo.id == 34 && val.numCantidadDosis > 0?"<br><strong>*N° de dosis recibidas:</strong> "+val.numCantidadDosis:"") +
				(val.tipo.id == 34 && val.numCantidadDosis > 0?"<br><strong>*Observacion adicional:</strong> "+(val.observacion.trim().length == 0?"------":val.observacion):"") +
				(val.tipo.id == 79?"<br><strong>*Clinica (certificación DIGESA):</strong> "+val.clinicaCertifDigesaNombre:"") +
				(val.tipo.id == 79?"<br><strong>*¿Va a realizar alguna de las actividades listadas?</strong> "+(val.hasTrabAltoRiesgo == 1?"Sí":"No"):"") +
				(val.tipo.id == 79 && val.hasTrabAltoRiesgo == 1?"<br><strong>*Actividad(es) seleccionada(s):</strong> "+(val.trabajosAltoRiesgoHabilitadosNombre.length == 0?"------":val.trabajosAltoRiesgoHabilitadosNombre):"") +
				(![14,34,101,128,129,130,132,133,134].includes(val.tipo.id)?"<br><strong>*Fecha inicio de vigencia:</strong> "+val.fechaTexto:"") +
				(![14,34,101,128,129,130,132,133,134].includes(val.tipo.id)?"<br><strong>*Fecha fin de vigencia:</strong> "+val.fechaFinVigenciaTexto:"") +
				(val.evidenciaFechaTexto.trim().length == 0 && val.fechaRegistroVacunacionTexto.trim().length == 0?"":"<br><strong>*Registrado el "+(val.tipo.id == 34?val.fechaRegistroVacunacionTexto:val.evidenciaFechaTexto)+"</strong>");

			var evaluacion = "<strong>*Estado:</strong> "+val.evaluacion.nota.icono+" "+val.evaluacion.nota.nombre +
				(val.evaluacion.nota.id != 1 && val.evaluacion.observacion.trim().length > 0?"<br><strong>*Observación:</strong> "+val.evaluacion.observacion:"") +
				(val.evaluacion.fechaTexto.trim().length > 0?"<br><strong>*Evaluado el "+val.evaluacion.fechaTexto+" ":"") +
				(val.evaluacion.fechaTexto.trim().length > 0 && val.evaluacion.usuario.nombre.trim().length > 0?"<br>(evaluado por "+val.evaluacion.usuario.nombre+")"+"</strong>":"");

			$("#tblConsolidadoResOpcionUnoBusqueda tbody").append(
				"<tr id='trResOpcUnoEvaDocProy"+val.id+"'>" +
				    "<td style='word-break:break-all;'>"+val.tipo.nombre+"</td>" +
					"<td style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
					"<td style='text-align:left;word-break:break-all;'>"+evaluacion+"</td>" +
				"</tr>");
		}
	});
}
