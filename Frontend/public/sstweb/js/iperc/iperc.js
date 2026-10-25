/** *************variables de empresa*********** */
var banderaEdicion;
var idIPERCEdicion,ipercEdicionObj;
var idMdfEdicion;
var idMatrizRiesgo;
var selectOneBoxMR;
var nivelesRiesgos;
var nombreIperc;
var idFlagEvalIni;
var indicadorCons;
var idProbEspe;
var idEvalFrec;

var listProbEspe;
var listaSevEspe;

var mdfNombreAux;
var listaIpercMdfIds=[];
var listaAux=[];
var listaPersonaExpuesta;
var listTrabajadores;
var listanombretab;

var listaIndCapa;
var listaIndRisk;
var listaIndProc;
var listaFrecPel;
var listFullIperc;

$(document).ready(function() {
	$("#buscadorIperc").hide();
	$("#opcionesColumna").hide();
	insertMenu(listarIPERCs); 
	$("#btnClipTabla").hide();
	
	// resizeDivWrapper("wrapperIpercResponsable",220);
});

function listarIPERCs() {
    
    var valorResize= 160;
    resizeDivWrapper("wrapperIpercResponsable",valorResize);
	
	$("#btnVolverIPERC").hide();
	banderaEdicion = false;
	idIPERCEdicion = 0;
	ipercEdicionObj = {ipercId : 0, flagOcultarSignificativo : 0, flagLugarCostado : 0}
	
	
	idMdfEdicion = 0;
	idMatrizRiesgo = 0;
	nivelesRiesgos = null;
	nombreIperc = "";
	idFlagEvalIni = 0;
	indicadorCons = 0;
	idProbEspe=0;
	idEvalFrec=0;
	listFullIperc=[];
	deshabilitarBotonesEdicion();
	$("#btnDetalle").hide();
	$("#btnConfigurar").hide();
	$("#btnImportar").hide();
	$("#btnImportarDivision").hide();
	$("#btnDescargar").hide();
	$("#btnDescargarLibre").hide();
	$("#btnCopiar").hide();
	$("#btnAutoAsign").hide();
	
	$("#btnCopiar").attr("onclick", "duplicarIperc()");
	$("#btnNuevo").attr("onclick", "nuevoIperc()");
	$("#btnCancelar").attr("onclick", "cancelarIperc()");
	$("#btnGuardar").attr("onclick", "guardarIperc()");
	$("#btnEliminar").attr("onclick", "eliminarIperc()");
	$("#btnDescargar").attr("onclick", "descargarMatriz()");
	$("#btnDescargarLibre").attr("onclick", "descargarMatrizLibre()");

	
	var dataParam = {
			companyId : getSession("gestopcompanyid")
	};
	callAjaxPost(URL + '/iperc', dataParam, procesarListarIperc,
	               function(){
	                      $("#wrapperIpercResponsable").block({message:'<img '+
	                	  'src="../imagenes/gif/ruedita.gif"></img>cargando...'});});
	
	goheadfixedY("#tblMatrices","#wrapperIpercResponsable");
}
 
function procesarListarIperc(data) {
    
    var valorResize= 160;
    resizeDivWrapper("wrapperIpercResponsable",valorResize);
    
	$("#tblMatrices").removeClass("fixed");
	switch (data.CODE_RESPONSE) {
	case "05":
		listTrabajadores=data.trabajadores;
		
		var list = data.list;
		listFullIperc=data.list;
		var lisInd=data.lisInd;
		listaPersonaExpuesta=data.listaPersonaExpuesta;
		listaIndCapa=data.listaIndCapa;
		listaIndRisk=data.listaIndRisk;
		listaIndProc=data.listaIndProc;
		listaFrecPel=data.listaFrecPel;
		listaSevEspe=data.listaSevEspe;
		listProbEspe=data.listProbEspe;
		$("#tblMatrices tbody tr").remove();
		$("#tblMatrices thead tr").remove();

		$("#h2Titulo").html(
				"<a onclick='javascript:listarIPERCs();' href='#'>IPERCs</a>");

		$("#tblMatrices thead").append("<tr id='thMatriz'> </tr>");
		
		var textoCabecera="<td class='tb-acc' rowspan='2'>Nombre</td>" +
				"<td class='tb-acc' rowspan='2'>"+getSession("gestopunidad")+" - Nivel</td>" +
				"<td class='tb-acc' rowspan='2'>Matriz de Evaluación de Riesgo (PxC)</td>" +
				"<td class='tb-acc' rowspan='2'># de áreas aprobadas / # de áreas total</td>" +
				

				"<td class='tb-acc' rowspan='2'># evaluaciones con riesgo significativo</td>" +
				"<td class='tb-acc' rowspan='2'># de controles por implementar</td>" +
				"<td class='tb-acc' rowspan='2'># de controles con retraso</td>"+
		"<td class='tb-acc' rowspan='2'>Versiones</td>" +
"<td class='tb-acc' colspan='6'>Última Actualización</td>"
		;
		 
		var	textoCabeceraMovil="<div class='row' style='text-align: center;'>" 
			+ "<div class='col-xs-2 col-sm-2'>Nombre</div>"
			+ "<div class='col-xs-2 col-sm-2'>"+getSession("gestopunidad")+" - Nivel</div>"
			+ "<div class='col-xs-2 col-sm-2'> (PxC) </div>"
			
			+ "<div class='col-xs-2 col-sm-2'>Riesgo</div>"
			+ "<div class='col-xs-2 col-sm-2'>Ctrl. Implementar</div>"
			+ "<div class='col-xs-2 col-sm-2'>Ctrl. Retraso </div>"
			+ "</div>";
		 
		textoCabecera=	ifVerificarMovil(2,textoCabeceraMovil,textoCabecera);
		$("#thMatriz").html(
				textoCabecera);
		$("#thMatriz").after("<tr>" +
				"<td class='tb-acc'>Responsable de actualizar IPERC</td>" +
				"<td class='tb-acc' style='width:190px'>Fecha Actualización Planificada</td>" +
				"<td class='tb-acc' style='width:170px'>Hora Planificada</td>" +
				"<td class='tb-acc' style='width:170px'>Fecha Actualización Real</td>" +
				"<td class='tb-acc' style='width:170px'>Fecha Próxima Actualización </td>" +
				"<td class='tb-acc'  style='width:230px'>Evidencia</td>"+		
		"</tr>")
		$("#tblEmpresas tbody tr").remove();
		list.forEach(function(val,index){

			var versionActiva={
					responsable:"",
					fechaActualizacionTexto:"",
					horaPlanificadaTexto:"",
					fechaPlanificadaTexto:"",
					evidenciaNombre:""
						
			};
			if(val.numVersiones > 0){
				versionActiva=val.versionActiva;
			}
			var estiloAdvertencia = "gosst-advertencia";
			if(val.numEvaluacionesVencidas == 0 || true){
				estiloAdvertencia = "";
			}
			$("#tblMatrices tbody").append(

					"<tr class='"+estiloAdvertencia+"' id='trm" + val.ipercId
							+ "' onclick='javascript:editarIperc("
							+ index+")' >"
							+ "<td  id='divNom"
							+ val.ipercId + "'>"
							+ val.ipercName + "</td>"

							+ "<td  id='divMdf"
							+ val.ipercId + "'>" + val.mdfName
							+ "</td>"

							+ "<td  id='divMR"
							+ val.ipercId + "'>"
							+ val.matrizRiesgoNombre + "</td>"
							+ "<td  id='divAprob"
							+ val.ipercId + "'>"
							+ val.numEvaluacionesAprobadas 
							+ " / "+val.numEvaluacionesTotal + "</td>"
							+ "<td  id='evRie"
							+ val.ipercId + "'>"
							+ val.evalRiesgosas 
							+ " / "+val.evalRealizadas+"</td>"
							
							+ "<td  id='ctrImp"
							+ val.ipercId + "'>" + lisInd[index].controlesImplementar
							+ "</td>"

							+ "<td  id='ctrRea"
							+ val.ipercId + "'>"
							+ lisInd[index].controlesRetrasados 

							+ "</td>" 
							+ "<td  id='tdver"
							+ val.ipercId + "'>"
							+ val.numVersiones
							+ "</td>"
							+ "<td  id='tdrespon"
							+ val.ipercId + "'>"
							+ versionActiva.responsable
							+ "</td>" 
							+ "<td  id='tdfap"
							+ val.ipercId + "'>"
							+ versionActiva.fechaPlanificadaTexto
							+ "</td>" 
							+ "<td  id='tdhap"
							+ val.ipercId + "'>"
							+ versionActiva.horaPlanificadaTexto
							+ "</td>" 
							+ "<td  id='tdfaar"
							+ val.ipercId + "'>"
							+ versionActiva.fechaActualizacionTexto
							+ "</td>" 
							+ "<td  id='tdfar"
							+ val.ipercId + "'>"
							+ val.fechaRealTexto
							+ "</td>" 
							+ "<td  id='tdeviper"
							+ val.ipercId + "'>"
							+ versionActiva.evidenciaNombre 

							+ "</td>" 
							+ "</tr>");
		}) ;
		completarBarraCarga();
		formatoCeldaSombreableTabla(true,"tblMatrices");
		
		$("#wrapperIpercResponsable").unblock();
		if(getSession("linkCalendarioIpercId")!=null){
			var indexIpercAux=0;
			listFullIperc.every(function(val,index3){
				
				if(val.ipercId==parseInt(getSession("linkCalendarioIpercId"))){
					editarIperc(index3);
					if(getSession("linkCalendarioVersionId")!=null){
						verVersionesIperc();
					}else{
						listarDetalleIperc();
					}
					
					
					sessionStorage.removeItem("linkCalendarioIpercId");
					return false;
				}else{
					return true;
				}
			});
			
		}
		break;
	default:
		alert("Ocurrió un error al traer los ipercs!");
	}
	goheadfixedY("#tblMatrices","#wrapperIpercResponsable");
}

var mdfAux;
var yaExisteIperc=false;
var listaMdfNoHay=[];



function editarIperc(pindex) {
	if (!banderaEdicion) {
		
		idIPERCEdicion = listFullIperc[pindex].ipercId;
		ipercEdicionObj= listFullIperc[pindex];
		idMdfEdicion = ipercEdicionObj.mdfId;
		mdfNombreAux=ipercEdicionObj.mdfName;
		idMatrizRiesgo = ipercEdicionObj.matrizRiesgoId ;
		idFlagEvalIni = ipercEdicionObj.flagEvaluacionInicial ;
		indicadorCons = ipercEdicionObj.indicadorConsecuencia ;
		idProbEspe=ipercEdicionObj.flagProbabilidadEspecifica ;
		idEvalFrec=ipercEdicionObj.flagEvaluacionFrecuencia ;
		var versionActiva={
				responsable:"",
				fechaActualizacionTexto:"",
				horaPlanificadaTexto:"",
				fechaPlanificadaTexto:"",
				evidenciaNombre:""
					
		};
		if(ipercEdicionObj.numVersiones > 0){
			versionActiva=ipercEdicionObj.versionActiva;
		}
		var responsable=ipercEdicionObj.responsable;
		var evidenciaNombre=$("#tdeviper" + idIPERCEdicion).text();
		var fechaPlanificada=convertirFechaInput(ipercEdicionObj.fechaPlanificada);
		var horaPlanificada=ipercEdicionObj.horaPlanificada;
		var fechaRealTexto=convertirFechaInput(ipercEdicionObj.fechaReal);
		
	
		$("#tdfar" + idIPERCEdicion)
		.html("<input id='inputFar' type='date' class='form-control' >");

		
		$("#inputFar").val(fechaRealTexto);
		
		$("#tdver" + idIPERCEdicion)
		.html("<a class='efectoLink' onclick='verVersionesIperc()'><i class='fa fa-eye'></i>"+ipercEdicionObj.numVersiones+"</a>")
		
		$("#divAprob"+idIPERCEdicion)
		.html("<a class='efectoLink' onclick='verAprobacionAreasIperc()'> <i class='fa fa-external-link'></i>"+  ipercEdicionObj.numEvaluacionesAprobadas 
							+ " / "+ipercEdicionObj.numEvaluacionesTotal+"</a>")
		
		var options=
		{
			container : "#tdeviper" + idIPERCEdicion,
			funtionCall: function(){},
			descargaUrl:  "/iperc/version/evidencia?versionId="+versionActiva.id,
			esNuevo: false,
			idAux:"IPERC",
			evidenciaNombre: evidenciaNombre
		}
		crearFormEvidenciaCompleta(options);
				$("#fileEviIPERC").parent("span").remove();
				
				
		formatoCeldaSombreableTabla(false,"tblMatrices");
		var dataParam = { 
				companyId : getSession("gestopcompanyid")
		};

		callAjaxPost(URL + '/mdf/listbox', dataParam, disenoEditarIperc);
		habilitarBotonesEdicion();
		$("#btnDetalle").show();
		$("#btnImportar").hide();
		$("#btnDetalle").attr("onclick", "preListarTablaDetalleIperc()");

		banderaEdicion = true;
	}
}
var listAreasAsociadasIperc = [];
function notificarResponsableAreaIperc(pindex){
    callAjaxPost(URL+"/iperc/notificar/area",{areaName : listAreasAsociadasIperc[pindex].areaName,areaId : listAreasAsociadasIperc[pindex].areaId},function(data){
	alert("Gerentes del área notificados");
    });
}

function verAprobacionAreasIperc(){
	$("#modalAreasIperc").modal("show");
	resizeDivWrapper("wrapAreasIperc",200);
	var dataParam = { 
			ipercId : ipercEdicionObj.ipercId
	};
	callAjaxPost(URL + '/iperc/areas', dataParam, function(data){
		listAreasAsociadasIperc = data.list;
		$("#tblAreasIperc tbody tr").remove();
		listAreasAsociadasIperc.forEach(function(val,index){
			$("#tblAreasIperc tbody")
			.append("<tr>" +
					"<td>"+val.areaName+"</td>" +
					"<td><a class='efectoLink' onclick = 'notificarResponsableAreaIperc("+index+")'>"+
					"<i class='fa fa-envelope-o'></i>Notificar gerentes </a></td>"+
					"<td>" +
					
						val.numEvaluacionesIpercAprobadas+" / "+
						val.numEvaluacionesIpercTotal+"" +
					"</td>" +
						
						"<td>"+(val.numEvaluacionesIpercAprobadas / 
						val.numEvaluacionesIpercTotal == 1?iconoGosst.aprobado:iconoGosst.por_realizar)+"</td>" + 
						"<td>"+val.fechaUltimaAprobacionTexto+"</td>" +
						"<td>"+val.areaTrabajadoresNombre+"</td>" +
					"" +
					"" +
					"</tr>")
		});
	});
	
}
function disenoEditarIperc(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		mdfs = data.list;
		nivelesRiesgos = data.listMR;

		var name = $("#divNom" + idIPERCEdicion).text();
		nombreIperc = name;
		$("#divNom" + idIPERCEdicion)
				.html(
						"<input type='text' " +
						"id='inputIperc' class='form-control' placeholder='Nombre IPERC' >");
		
		nombrarInput("inputIperc",name);
		var objectSocket={
				accion:"edit",
				id:idIPERCEdicion
		}
		sendText(objectSocket);
		
		break;
	default:
		alert("Ocurrió un error al traer las matrices de funciones!");
	}
}

function nuevoIperc() {
	if (!banderaEdicion) {
		idIPERCEdicion = 0;
		var dataParam = {
				companyId : sessionStorage.getItem("gestopcompanyid")
		};

		callAjaxPost(URL + '/mdf/listbox', dataParam, disenoNuevoIperc);

		pasoIdEdicion = 0;
		habilitarBotonesNuevo();
		formatoCeldaSombreableTabla(false,"tblMatrices");
		banderaEdicion = true;
	} else {
		alert("Guarde primero el IPERC.");
	}
}

function disenoNuevoIperc(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		mdfs = data.list;
		var listaTipoMatrizRiesgo = data.listMR;
		var selectOneBox = crearSelectOneMenuOblig("idSelMdf", "", mdfs, "", "matrixId",
				"matrixName")
		var selectOneBoxMR= crearSelectOneMenuOblig("idSelMR", "", listaTipoMatrizRiesgo, "", "mrId",
				"mrNombre")
		   

		$("#tblMatrices tbody")
				.prepend(
						"<tr id='0'>"
								+ "<td >"
								+ "<input type='text' id='inputIperc' "
								+ "class='form-control' placeholder='IPERC' autofocus = 'true'>"
								+ "</td>"
								
								+ "<td >"
								+ selectOneBox + "</td>"

								+ "<td>"
								+ selectOneBoxMR + "</td>"
								+"<td>...</td>"+"<td>...</td>"
								+"<td>...</td>"
								+"<td>...</td>"
								+"<td>...</td>"
								+"<td>...</td>"
								+"<td>...</td>"
								+"<td>...</td>"
								+"<td>...</td>"
								+"<td><input id='inputFar' type='date' class='form-control' ></td>"
								+"<td id='inputeviIperc' >...</td>"	
								+"</tr>");
		
		var objectSocket={
				accion:"insert",
				id:0
		}
		sendText(objectSocket);
		// inicializarAutocompletar();
		break;
	default:
		alert("Ocurrió un error al traer las pasos!");
	}
}

function guardarIperc() {
	
	var campoVacio = true;
	var idMdfEdicion = $("#idSelMdf option:selected").val();
	var idMREdicion = idMatrizRiesgo;
	var responsable=$("#inputResponsable").val();
	var fechaPlan=convertirFechaTexto($("#inputFap").val());
	var hora=$("#inputHap").val();
	var fechaReal=convertirFechaTexto($("#inputFar").val());
	if(idIPERCEdicion==0){
		idMREdicion = $("#idSelMR option:selected").val();
	}
	
	if ($("#inputIperc").val().length == 0) {
		campoVacio = false;
	}

	if (idMdfEdicion == '-1') {
		campoVacio = false;
	}
	if (idMREdicion == '-1') {
		campoVacio = false;
	}

	if (campoVacio) {

		var dataParam = {
			ipercName : $("#inputIperc").val(),
			ipercId : idIPERCEdicion,
			mdfId : idMdfEdicion,
			matrizRiesgoId : idMREdicion,
			flagEvaluacionInicial : idFlagEvalIni,
			indicadorConsecuencia : indicadorCons,
			flagProbabilidadEspecifica:idProbEspe,
			flagEvaluacionFrecuencia:idEvalFrec,
			flagOcultarSignificativo : ipercEdicionObj.flagOcultarSignificativo,
			flagLugarCostado : ipercEdicionObj.flagLugarCostado,
			fechaReal:fechaReal
		};

		callAjaxPost(URL + '/iperc/save', dataParam,
				procesarGuardarIperc );
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarIperc(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
				
		$("#tblMatrices tbody tr").remove();
		$("#btnDetalle").hide();
		var objectSocket={
				accion:"success",
				id:idIPERCEdicion
		} 
		sendText(objectSocket);
		listarIPERCs();
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Ocurrió un error al guardar la matriz!");
	}
}

function cancelarIperc() {
	$("#btnDetalle").hide();
	var objectSocket={
			accion:"success",
			id:idIPERCEdicion
	}
	sendText(objectSocket);
	listarIPERCs();
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
}

function eliminarIperc() {
	var r = confirm("¿Está seguro de eliminar el IPERC?");
	if (r == true) {
		var dataParam = {
				ipercId : idIPERCEdicion,
		};

		callAjaxPost(URL + '/iperc/delete', dataParam, procesarEliminarIperc);
	}

}

function procesarEliminarIperc(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if(data.mensaje.length>0){
			alert(data.mensaje);
		}
		
		$("#btnDetalle").hide();
		listarIPERCs();
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Ocurrió un error al eliminar el IPERC!");
	}
}

function descargarMatriz(){
	window.open(URL
			+ "/iperc/detail/excel?ipercId="
			+ ipercEdicionObj.ipercId + "&ipercName="
			+ ipercEdicionObj.ipercName, '_blank');	
}
function descargarMatrizLibre(){
	window.open(URL
			+ "/iperc/detail/libre/excel?ipercId="
			+ ipercEdicionObj.ipercId + "&ipercName="
			+ ipercEdicionObj.ipercName, '_blank');	
}

function verVersionesIperc(){
	$("#mdVersionIperc").modal("show");
	llamarVersionesIperc();
}