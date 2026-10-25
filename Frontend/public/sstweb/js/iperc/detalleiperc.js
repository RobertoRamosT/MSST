var detalleIpercId;
var detalleIpercDetailId;var detalleIpercDetailObj;
var peligroId;
var clasiId;
var riesgoId;
var probabilidadId;
var severidadId;
var probabilidadActId;
var severidadActId;
var probabilidadProyId;
var severidadProyId;
var eficacia;
var isRiskyProy;
var isRiskyAct;
var detallesFullIperc;
var listSeveridad;
var listProbabilidad;
var listNivelRiesgo;
var indexAux;
var tipoCtrlId;

var listFullConsecuencias=[];

var personExpId;
var indProcId;
var indCapaId;
var indRiskId;

var personExpIdAct;
var indProcIdAct;
var indCapaIdAct;
var indRiskIdAct;

var personExpIdFut;
var indProcIdFut;
var indCapaIdFut;
var indRiskIdFut;

var frecPelPuroId;
var frecPelActId;
var frecPelFutId;
var idRiesgoEspecial;
var idRiesgoActEspecial;
var idRiesgoFutEspecial;
var contador2 = 0;

/** ************INGRESO DE PELIGROS DE FORMA AUTOMATICA******************** */
var autoFocusPeligro = false;
var autoFocusRiesgo = false;
var autoFocusConsecuencia = false;
var nuevoDupIpercAutomatico = false;
var ipercDetalleEvalIdCopy = 0;
/** *********************************************************************** */
var combosSugeridos=[];
var listFullControles;
/** ****************SUELTOS******************** */
var kappa="";
/**Proyectos***/
var listSugeridoEvaluacionIperc=[];
var listCategoriaProbabilidadEspecifica=[];
var listCategoriaConsecuenciaEspecifica=[];

var listAlcanceDetalle=[];
var listClasificacionDetalle=[];
var listTipoRutina=[];
var listFullPuestosByUnidad=[];
var listFullIdsIpercDetalle=[];
var listFullTipoContactoDetalle = [];

$(function(){
	
	$("#btnClipTabla").tooltip({
		title:"Copiar controles al clipboard", 
		placement: "right"
	});
	$("#btnClipTabla").on("click",function(){
		new Clipboard('#btnClipTabla', {
			text : function(trigger) {
				
				return listFullControles;
			}
		});

		
		alert("Se han guardado al clipboard la tabla de este módulo" );

	});
	
	$('#buscadorTrabajadorInput').keyup(function(e){
	    if(e.keyCode == 13)
	    {
	        $(this).trigger("enterKey");
	    }
	});
	$('#buscadorTrabajadorInput').bind("enterKey",function(e){
		listarTablaDetalleIperc();
		});
	$("#buscadorTrabajadorInput").focus();
	
	$("#resetBuscador").attr("onclick","resetBuscador()");
        $("#btnAutoAsign").on("click",function(){
	    llamarSugeridosAsignar();
         });

$("#btnAsignarCombo").on("click",function(){
	
var indexCombo=$("input[name=tipoCombo]:checked").val();
var listaDetallesCombo=combosSugeridos[indexCombo].detalles;
for(var index2=0;index2<listaDetallesCombo.length;index2++){
	var dataParam = {
			ipercDetailId : detalleIpercId,
			ipercDetailEvalID :(index2==0?detalleIpercDetailId:0) ,
			descripcionLugar : listaDetallesCombo[index2].descripcionLugar,
			descripcionPeligro : listaDetallesCombo[index2].descripcionPeligro,
			peligroName : listaDetallesCombo[index2].peligroName,
			idClasificacion : listaDetallesCombo[index2].idClasificacion,
			riesgoName : listaDetallesCombo[index2].riesgoName,
			consecuencia1 : listaDetallesCombo[index2].consecuencia1,
			controlInicial1:listaDetallesCombo[index2].controlInicial1,
			controlInicial2:listaDetallesCombo[index2].controlInicial2,
			controlInicial3:listaDetallesCombo[index2].controlInicial3,
			lastInsert:(index2==listaDetallesCombo.length-1?1:0)
		};

		callAjaxPost(URL + '/iperc/detail/save', dataParam,
				function (data) {
			switch (data.CODE_RESPONSE) {
			case "05":
	if(data.lastInsert==1){
		listarDetalleIperc();
	}
	
				break;
			default:
				console.log("N");
			}
		});
		if(index2==listaDetallesCombo.length-1){
			$("#modalDetalleSugerido").modal("hide");
			
		}
}
	
});


$("#btnGestionCombo").on("click",function(){
	$(".modal-body").hide();
	$("#bodyGestion").show();
	$(".modal-title").html("<a onclick='volverAsignaciones()'>Combos Sugeridos</a> > Gestión de Combos ");
	llamarSugeridosEmpresa();
	
});

});

function llamarSugeridosAsignar(){
	$(".modal-body").hide();
	$("#bodyAsignar").show();
	$(".modal-title").html("Combos Sugeridos ");
	callAjaxPost(URL+"/iperc/detalle/sugeridos",
			{companyId : sessionStorage.getItem("gestopcompanyid")}
	,function(data){
		 combosSugeridos=data.combosSugeridos;
		 $('#modalDetalleSugerido').modal({
			  keyboard: true,
			  show:true,
			  "backdrop":"static"
			});
		$("#listaCombos").html("");
		for(var index=0;index<combosSugeridos.length;index++){
			$("#listaCombos").append(
					"<div class='radio radio-primary radio-inline' id='divCombo"+combosSugeridos[index].id+"'>"
					+"<input type='radio' " 
						+	"name='tipoCombo' id='combo"+combosSugeridos[index].id+"' " 
						+	"value='"+index+"' >"
		            +"<label for='combo"+combosSugeridos[index].id+"'>"
		            +combosSugeridos[index].nombre+"&nbsp; " 
		            		
		                +"     </label>"+"<span><i class='fa fa-question-circle' aria-hidden='true'></i></span>"
		       +" </div><br>"
			);
		$("#divCombo"+combosSugeridos[index].id+" span").on("click",combosSugeridos[index].detalles,function(event){
			$("#modalListComboDetalle .modal-body").show();
			
			var contenidoTabla="";
			
			var detail=event.data;
			detail.forEach(function(val,index1){
				 
				contenidoTabla=contenidoTabla+"<tr><td> "+val.descripcionLugar+"</td>"+
				
				"<td>"+val.clasificacionName+"</td>"+
				"<td> "+val.peligroName+"</td>"+
				"<td> "+val.descripcionPeligro+"</td>"+
				"<td> "+val.riesgoName+"</td>"+
				"<td>"+val.consecuencia1+"</td>" +
				"<td>"+val.controlInicial1+"</td>"+
				"<td>"+val.controlInicial2+"</td>"+
				"<td>"+val.controlInicial3+"</td>"+
						"</tr>"
			});
			var tablaAyuda="<table class='table table-striped table-bordered table-hover'>" +
			"<thead>" +
			"<tr>" +
			"<td class='tb-acc'>Lugar</td>" +
			"<td class='tb-acc'>Clasificacion</td>" +
			"<td class='tb-acc'>Peligro</td>" +
			"<td class='tb-acc'>Descripciónn</td>" +
                        "<td class='tb-acc'>Riesgo</td>" +
			"<td class='tb-acc'>Consecuencia</td>" +
			"<td class='tb-acc'>Control Administrativo</td>" +
			"<td class='tb-acc'>Control Ingeniería</td>" +
			"<td class='tb-acc'>Control Equipo Seguridad</td>" +
			"</tr>" +
			"</thead>" +
			"<tbody>"+contenidoTabla+"</tbody>" +
			"</table>";		
		
		$("#modalListComboDetalle").modal("show");
		$("#modalListComboDetalle").css({"z-index":"1051"});
		$("#modalListComboDetalle .modal-body").html(tablaAyuda);
		});
		}
		
	});
}
function volverAsignaciones(){
	$(".modal-body").hide();
	$("#bodyAsignar").show();
	$(".modal-title").html("Combos Sugeridos ");
	llamarSugeridosAsignar()
}
function resetBuscador(){
	$("#buscadorTrabajadorInput").val("");
	listarTablaDetalleIperc();
}

$('#exampleModal').on(
		'show.bs.modal',
		function(e) {
			$('#chckProbEsp').prop('checked', idProbEspe);
			$('#chkbCtrl').prop('checked', idFlagEvalIni);
			$('#chckFrecPel').prop('checked', idEvalFrec);
		
			$('#checkOcultarSignificativo').prop('checked', ipercEdicionObj.flagOcultarSignificativo);
			$('#checkCostadoLugar').prop('checked', ipercEdicionObj.flagLugarCostado);
			
			$("#selectCons").val(ipercEdicionObj.indicadorConsecuencia);

			$("#selectNR").remove();
			$("#scmbRiesgo").append(
					crearSelectOneMenu("selectNR", "comprobarNivelRiesgo()", nivelesRiesgos,
							ipercEdicionObj.matrizRiesgoId, "mrId", "mrNombre"));
			comprobarNivelRiesgo();
		});

$('#modalAyudaIperc').on(
		'hide.bs.modal',
		function(e) {
			$('#exampleModal').modal("show");
		});
/** *************************************************** */
function comprobarNivelRiesgo(){
	
	var mdfId=$("#selectNR").val();
	
	if(mdfId!=1){
		$('#chckProbEsp').prop('checked', false);
		$("#chckProbEsp").prop('disabled', true);
	}else{
		$('#chckProbEsp').prop('checked', idProbEspe);
		$("#chckProbEsp").prop('disabled', false);
	}
	
	if(mdfId!=5){
		$('#chckFrecPel').prop('checked', false);
		$("#chckFrecPel").prop('disabled', true);
	}else{
		$('#chckFrecPel').prop('checked', idEvalFrec);
		$("#chckFrecPel").prop('disabled', false);
	}
}

function verFiltroDetalleIperc(){
	$("#btnOculFiltro").show();
	$("#btnVerFiltro").hide();
	$("#btnApliFiltro").show();
	
	$(".contain-filtro").show();
}
function ocultarFiltroDetalleIperc(){
	$("#btnOculFiltro").hide();
	$("#btnVerFiltro").show();
	$("#btnApliFiltro").hide();
	
	$(".contain-filtro").hide();
}
function aplicarFiltroDetalleIperc(){
	ocultarFiltroDetalleIperc();
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
	listarTablaDetalleIperc();
}
var filtrarMayorDivsion = true;
function listarDetalleIperc() {
    
    var valorResize= 200;
    resizeDivWrapper("wrapperIpercResponsable",valorResize);
    
	var dataParamAux = {
			ipercId : idIPERCEdicion,
			mdfId : ipercEdicionObj.mdfId,
		matrizRiesgoId : ipercEdicionObj.matrizRiesgoId
	};
	callAjaxPost(URL+"/iperc/filtro",dataParamAux,function(data){
		$("#buscadorIperc").show();
		verFiltroDetalleIperc();
		if(filtrarMayorDivsion){
			data.divisiones[0].selected = 1;
		}
		crearSelectOneMenuObligMultipleCompleto("selMulFiltroDivision", "", 
				data.divisiones, "divisionId","divisionName","#divSelectFiltroDivision","Todos");
		var listAreas = [];
		data.divisiones.forEach(function(val){
			val.areas.forEach(function(val1){
				listAreas.push(val1)
			})
		});
		if(filtrarMayorDivsion){
			filtrarMayorDivsion = false;
			listAreas[0].selected = 1;
		}
		crearSelectOneMenuObligMultipleCompleto("selMulFiltroArea", "", 
				listAreas, "areaId","areaName","#divSelectFiltroArea","Todos")
		ocultarFiltroDetalleIperc();	
	
		callAjaxPost(URL+"/iperc/detalle/controles",dataParamAux,
				function(data,functionCallback){
			switch (data.CODE_RESPONSE) {
			case "05":
			 listFullControles="";
			var list=data.list;
			
			listFullControles="Detalle" +"\t"
			+"Lugar" +"\t"
			+"Clasificación de peligro" +"\t"
			+"Peligro" +"\t"
			+"Descripción Peligro" +"\t"
			+"Tipo de Control" +"\t"
			+"Descripción de Control" +"\t"
			+"Responsable" +"\t"
			+"Fecha planificada" +"\t"
			+"Fecha realizada" +"\t"
			+"Costo" +"\t"
			+"Estado" 
			+" \n";
			for (var index = 0; index < list.length; index++){
				var listControles=list[index].controlesAsociados;
				for (var index2 = 0; index2 < listControles.length; index2++){
					
					if(listControles[index2].estadoNombre!=null){
						listFullControles=listFullControles
						+list[index].ipercDetailName+" \t "
						+list[index].descripcionLugar+" \t "
						+list[index].clasificacionName+" \t "
						+list[index].peligroName+" \t "
						+list[index].descripcionPeligro+" \t "
						
						+listControles[index2].responsableTipoNombre+" \t "
						+listControles[index2].controlNombre+" \t "
						+listControles[index2].responsable+ " \t "
						+listControles[index2].fecha+" \t "
						+listControles[index2].fechaReal+" \t " 
						+listControles[index2].costo+" \t "
						+listControles[index2].estadoNombre+"  "
						+"\n"
					}
				}
			}
			break;
			default:
			console.log("NOPPPPP");
			break;
			}
			listarTablaDetalleIperc();
		});
	});
	goheadfixedY("#tblMatrices","#wrapperIpercResponsable");
}

function mostrarOpcSegunTipoDO(tipoDO) {
	switch (tipoDO) {
	case 5:
		$("#btnActividad").hide();
		$("#btnTarea").hide();
		$("#btnPaso").hide();
		ocultarColumna(5, "tblMatrices");
		ocultarColumna(6, "tblMatrices");
		break;
	case 6:
		$("#btnActividad").show();
		$("#btnTarea").show();
		$("#btnPaso").hide();
		ocultarColumna(6, "tblMatrices");
		break;
	case 7:
		$("#btnActividad").show();
		$("#btnTarea").show();
		$("#btnPaso").show();
		break;
	}
}

function preListarTablaDetalleIperc(){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
	listarDetalleIperc();
}

function listarTablaDetalleIperc() {
    
	var divisionesId = $("#selMulFiltroDivision").val();
	var areasId = $("#selMulFiltroArea").val();
	var listDivisionesId =[], listAreasId = [];
	
	if(divisionesId  == null){
		listDivisionesId = null;
	}else{
		divisionesId.forEach(function(val){
			listDivisionesId.push(parseInt(val));
		})
	}
	if(areasId  == null){
		listAreasId = null;
	}else{
		areasId.forEach(function(val){
			listAreasId.push(parseInt(val));
		})
	}
	
	var palabraClave=$("#buscadorTrabajadorInput").val();
	if(palabraClave.length==0){
		palabraClave=null;
	}else{
		palabraClave=("%"+palabraClave+"%").toUpperCase();
	}
	$("#buscadorIperc").show();
	$("#tblMatrices").width('3600px');
	
	var dataParam = {
		ipercId : idIPERCEdicion,
		companyId : getSession("gestopcompanyid"),
		matrizRiesgoId : idMatrizRiesgo,
		palabraClave : palabraClave,
		listDivisionesId : listDivisionesId,
		listAreasId : listAreasId
	};

	ipercDetalleEvalIdCopy = 0;
	detalleIpercDetailId = 0;
	indexAux=0;
	callAjaxPost(URL + '/iperc/detalle', dataParam,
			procesarListarTablaDetalleIperc);
}

function estadoControl(numRetrasados, numImplementar, numCompletados) {
	var color = "";
	var icono = "";
	var propiedades;
	var mensaje = "";
	mensaje = "<br>";
	if (numImplementar > 0 && numRetrasados == 0) {
		mensaje = mensaje + numImplementar + "I";
		color = "#FF8000";

		icono = ' <i class="fa fa-eye"></i>';
	}

	if (numRetrasados > 0) {
		mensaje = mensaje + numRetrasados + "R ";
		icono = ' <i class="fa fa-exclamation-circle"></i>';
		color = "red";

	}

	if (numRetrasados == 0 && numImplementar == 0 && numCompletados > 0) {
		color = "green";

		icono = ' <i class="fa fa-check-square"></i>';

	}
	propiedades = {
		color : color,
		icono : icono,
		mensaje : mensaje
	}
	return propiedades

}

var mapRiesgo = [];
function procesarListarTablaDetalleIperc(data) {
	banderaEdicion = false;
	$("#btnClipTabla").show();
	$("#h2Titulo").html("Detalle Iperc de" + ipercEdicionObj.mdfName);
	$("#formBtnGeneral").show();
	detalleIpercId = 0;
	peligroId = 0;
	clasiId = 0;
	riesgoId = 0;
	probabilidadId = 0;
	severidadId = 0;
	probabilidadActId = 0;
	severidadActId = 0;
	probabilidadProyId = 0;
	severidadProyId = 0;
	 personExpId=0;
	 indProcId=0;
	 indCapaId=0;
	 indRiskId=0;

	 personExpIdAct=0;
	 indProcIdAct=0;
	 indCapaIdAct=0;
	 indRiskIdAct=0;

	 personExpIdFut=0;
	 indProcIdFut=0;
	 indCapaIdFut=0;
	 indRiskIdFut=0;
	tipoCtrlId = 0;
	
	frecPelPuroId=0;
	frecPelActId=0;
	frecPelFutId=0;
	 frecPelPuroId=0;
	  frecPelActId=0;
	  frecPelFutId=0;
	detallesFullIperc=[];
	listSeveridad = null;
	listProbabilidad = null;
	listNivelRiesgo = null;

	 idRiesgoEspecial=null;
	 idRiesgoActEspecial=null;
	 idRiesgoFutEspecial=null;
	deshabilitarBotonesEdicion();
	$("#btnDetalle").hide();
	$("#btnNuevo").hide();
	$("#btnCopiar").hide();
	$("#btnAutoAsign").hide();
	$("#btnImportar").show();
	$("#btnImportar").attr("onclick", "ImportarPuestoMdfIperc()");
	

	$("#btnImportarDivision")
	.attr("title","Importar por "+getSession("gestopdivision"))
	.show().html("<i class='fa fa-upload fa-2x'></i> <i class='fa fa-info'></i> ");
	$("#btnImportarDivision").attr("onclick", "ImportarDivisionMdfIperc()");
	
	$("#btnNuevo").attr("onclick", "nuevoDetalleIperc()");

	$("#btnCancelar").attr("onclick", "cancelarDetalleIperc()");
	$("#btnGuardar").attr("onclick", "guardarDetalleIperc()");
	$("#btnEliminar").attr("onclick", "eliminarDetalleIperc()");

	$("#btnConfigurar").show();
	$("#btnDescargar").show();
	$("#btnDescargarLibre").show();
	
	$("#btnOkConf").attr("onclick", "configurarIperc()");
	switch (data.CODE_RESPONSE) {
	case "05":
		var columnaEvalIni = "";
		var columnaEvalIni2 = "";
		var columnaTh1Consecuencia = "";
		var columnaTh2Consecuencia = "";
		var columnaEvalucionEspecifica="";
		var columnaProbabilidad="";
		var columnaFrecuencia="";
		
		var anchoEvaluacion;
		var anchoEvaluacionPx;
		var anchoEvaluacionActPx;
		var anchoEvaluacionFutPx;
		var anchoEvaluacion2;
		var list = data.list;
		 detallesFullIperc=data.list;
		 console.log(detallesFullIperc);
		 //
		 listaPersonaExpuesta=data.listaPersonaExpuesta;
			listaIndCapa=data.listaIndCapa;
			listaIndRisk=data.listaIndRisk;
			listaIndProc=data.listaIndProc;
		 //
		
		mapRiesgo = data.mapRiesgo;
		listAlcanceDetalle=data.listAlcance;
		listSeveridad = mapRiesgo.severidades;
		listProbabilidad = mapRiesgo.probabilidades;
		listNivelRiesgo = mapRiesgo.nivelRiesgos;
		listClasificacionDetalle=data.listClasificacion;
		listFullTipoContactoDetalle = data.tiposContacto;
		listTipoRutina=data.listRutina;
		//
		 listSugeridoEvaluacionIperc=data.sugeridoEvaluacion;
		 listCategoriaProbabilidadEspecifica=data.categoriaProbabilidad;
		 listCategoriaConsecuenciaEspecifica=data.categoriaConsecuencia;
		
		//
		var detalleAux ;
		var longitudAux ;
		if(detallesFullIperc.length>0){
			if(list[0].ipercDetailName){
				 detalleAux = list[0].ipercDetailName.split(' - ');
				 longitudAux = list[0].longitudTotalDetalle;
			}
		}
		$("#tblMatrices tbody tr").remove();
		$("#tblMatrices thead tr").remove();
		if(parseInt(getSession("gestopcompanyid")) == 336  || ipercEdicionObj.ipercId == 275){
		    $("#btnImportar").remove();
			var cabecaraSimple ="" +
					"" +
					"<tr>" +
					"<td rowspan='2' style='width : 100px'>Nro</td>" +
					"<td rowspan='2' style='width : 190px'>"+getSession("gestoparea")+"</td>" +
					"<td rowspan='2' style='width : 190px'>Lugar / Sub proceso</td>" +
					"<td rowspan='2' style='width : 190px'>Actividad</td>" +
					"<td rowspan='2' style='width : 250px'>Peligro</td>" +
					"<td rowspan='2' style='width : 100px'>Código de riesgo</td>" +
					"<td rowspan='2' style='width : 220px'>Riesgo</td>" +
					"<td rowspan='2' style='width : 220px'>Causas</td>" +
					"<td rowspan='2' style='width : 260px'>Cumplimiento Legal</td>" +
					"<td rowspan='2' style='width : 150px'>Afecta a</td>" +
					"<td colspan='3'  style='width : 650px'>Controles existente</td>" +
					"<td colspan='7' style='width : 850px'>Evaluación de Riesgo Actual</td>" +
					"<td colspan='5' style='width : 550px'>Medidas de control adicional</td>" +
					"<td rowspan='2' style='width : 190px' class='tb-acc' >Estado</td>"+
					"<td rowspan='2' style='width : 220px' class='tb-acc' >Elaborado por</td>"+
					"<td rowspan='2' style='width : 220px' class='tb-acc' >Revisado por</td>"+
					"<td rowspan='2' style='width : 220px' class='tb-acc' >Aprobado por</td>"+
					"<td rowspan='2' style='width : 220px' class='tb-acc' >Próxima evaluación</td>"+
					"</tr>"+
					"<tr>" +
					"<td  style='width : 190px'>1. Control Administrativo</td>" +
					"<td  style='width : 190px'>2. Control de Ingenieria</td>" +
					"<td style='width : 190px'>3. Equipos de Seguridad</td>" +
								
					"<td style='width : 190px'>Personas Expuestas</td>" +
					"<td style='width : 190px'>Indice Capacitacion</td>" +
					"<td style='width : 190px'>Exposicion al riesgo</td>" +
					"<td style='width : 190px'>Indice Procedimientos</td>" +
					"<td style='width : 190px'>Indice de probabilidad (Sumatoria)</td>" +
					"<td  style='width : 190px'>Severidad</td>" +
					"<td style='width : 190px'>Nivel de riesgo</td>" +
					"<td style='width : 190px' class='tb-acc' >1. Eliminación</td>"+
					"<td style='width : 190px' class='tb-acc'>2. Sustitución</td>"+
					"<td style='width : 190px' class='tb-acc' >3. Control de Ingeniería</td>"+
					"<td style='width : 190px' class='tb-acc'>4. Control Administrativo</td>"+
					"<td style='width : 190px' class='tb-acc' >5. Equipos de Proteccion</td>"+
					
					"" +
					"</tr>" +
					""; 
			$("#tblMatrices thead").append(cabecaraSimple);
			detallesFullIperc.forEach(function(val,index){
				if(val.ipercDetailName){
					
					var detalleAux = val.ipercDetailName.split(' - ');
					var actividadAux = detalleAux[4];

					var puestoAux = detalleAux[3];
					var areaAux = detalleAux[2];
					var divisionAux = detalleAux[1];
					var probabilidadFilasActual = "<td id='persExpAct"
						+ val.ipercDetailEvalID + "'>"
						+ val.nombreProbPersonasAct + "</td>" 
						+ "<td id='probCapaAct"
						+ val.ipercDetailEvalID + "'>"
						+ val.nombreProbCapacitacionAct + "</td>"
						
						+ "<td id='probRiskExpAct"
						+ val.ipercDetailEvalID + "'>"
						+ val.nombreProbExpoRiesgoAct + "</td>"
						
						+ "<td id='probProcAct"
						+ val.ipercDetailEvalID + "'>"
						+ val.nombreProbProcedimientoAct + "</td>" 
						
						
						+"<td id='evaactprobsuma"
						+ val.ipercDetailEvalID
						+ "'>"
						+ val.probabilidadActSuma
						+ "</td>";
					 
					var propiedades1 = estadoControl(val.numRetrasado1,
							val.numImplementar1,
							val.numCompletado1);
					var propiedades2 = estadoControl(val.numRetrasado2,
							val.numImplementar2,
							val.numCompletado2);
					var propiedades3 = estadoControl(val.numRetrasado3,
							val.numImplementar3,
							val.numCompletado3);
					var propiedades4 = estadoControl(val.numRetrasado4,
							val.numImplementar4,
							val.numCompletado4);
					var propiedades5 = estadoControl(val.numRetrasado5,
							val.numImplementar5,
							val.numCompletado5);
					

					var estiloAdvertencia = "";
					if(parseInt(getSession("trabajadorGosstId"))>0){
						switch(val.estadoValidar.id){
						case 1:
						case 2:
						case 3:
							estiloAdvertencia = "gosst-aprobado-azul";
							break;
						case 5:
							estiloAdvertencia = "gosst-desaprobado";
							break;
						case 4:
							estiloAdvertencia = "";
							break;
						}
					}
					
					 
					$("#tblMatrices tbody").append("" +
							"<tr class='"+estiloAdvertencia+"' id='trm"+
							 val.ipercDetailEvalID+
							 "' onclick='javascript:editarIpercDetalle("+
							 index+
							 ")'>"+
							"<td>"+(index+1)+"</td>" +
							"<td>"+areaAux+"</td>"+
							"<td  id='lugar"+ val.ipercDetailEvalID+ "'>"+
							val.descripcionLugar+"</td>"+
							"<td>"+actividadAux+"</td>"+
							//"<td id='clasi"+ val.ipercDetailEvalID+ "'>"+val.clasificacionName+"</td>"+
							"<td id='pel"+ val.ipercDetailEvalID+ "'>"+val.peligroName+"</td>"+
							"<td id='dettipcoid"+ val.ipercDetailEvalID+ "'>"+val.tipoContacto.idAux+"</td>"+
							"<td id='dettipco"+ val.ipercDetailEvalID+ "'>"+val.tipoContacto.nombre+"</td>"+
							"<td id='detipcau"+ val.ipercDetailEvalID+ "'>"+val.causa+"</td>"+
							"<td id='detipreq"+ val.ipercDetailEvalID+ "'>"+val.requisitoLegal+"</td>"+
							"<td id='detipafe"+ val.ipercDetailEvalID+ "'>"+val.alcance.nombre+"</td>"+
							"<td id='ctrlini1"+ val.ipercDetailEvalID+ "'>"+val.controlInicial1+"</td>"+
							"<td id='ctrlini2"+ val.ipercDetailEvalID+ "'>"+val.controlInicial2+"</td>"+
							"<td id='ctrlini3"+ val.ipercDetailEvalID+ "'>"+val.controlInicial3+"</td>"+
							probabilidadFilasActual+
							 "<td id='evaactsev"
							+ val.ipercDetailEvalID
							+ "'>"
							+ val.severidadActNombre
							+ "</td>"
							+ "<td id='evaactniv"
							+ val.ipercDetailEvalID
							+ "' style='background-color:"
							+ val.nivelRiesgoActColor
							+ ";font-weight:bold' >"
							+ (parseInt(getSession("gestopcompanyid"))==336?val.nivelRiesgoActAjnNombre:val.nivelRiesgoActNombre)
							+ "</td>"
							
							+ "<td id='ctrlImpl1"
							+ val.ipercDetailEvalID
							+ "' style='color:"
							+ propiedades1.color
							+ ";font-weight:bold'>"
							+ devolverTagCtrl(val.numTipo1)
							+ ""
							+ propiedades1.icono
							+ "</td>"
							+ "<td id='ctrlImpl2"
							+ val.ipercDetailEvalID
							+ "' style='color:"
							+ propiedades2.color
							+ ";font-weight:bold'>"
							+ devolverTagCtrl(val.numTipo2)
							+ ""
							+ propiedades2.icono
							+ "</td>"
							+ "<td id='ctrlImpl3"
							+ val.ipercDetailEvalID
							+ "' style='color:"
							+ propiedades3.color
							+ ";font-weight:bold'>"
							+ devolverTagCtrl(val.numTipo3)
							+ ""
							+ propiedades3.icono
							+ "</td>"
							+ "<td id='ctrlImpl4"
							+ val.ipercDetailEvalID
							+ "' style='color:"
							+ propiedades4.color
							+ ";font-weight:bold'>"
							+ devolverTagCtrl(val.numTipo4)
							+ ""
							+ propiedades4.icono
							+ "</td>"
							+ "<td id='ctrlImpl5"
							+ val.ipercDetailEvalID
							+ "' style='color:"
							+ propiedades5.color
							+ ";font-weight:bold'>"
							+ devolverTagCtrl(val.numTipo5)
							+ ""
							+ propiedades5.icono
							+ "</td>"+
							"<td>"+val.estadoValidar.nombre+"</td>" +
			 				"<td>"+val.fechaElaboradoTexto+" ("+val.trabajadorElaborado.nombre+")</td>" +
			 				"<td>"+val.fechaRevisadoTexto+" ("+val.trabajadorRevisado.nombre+")</td>" +
			 				"<td>"+val.fechaAprobadoTexto+" ("+val.trabajadorAprobado.nombre+")</td>"+
			 				"<td>"+val.fechaProximaEvalacionTexto+" </td>"+
							"" +
							"" +
							"</tr>");
				}
			
			});
			formatoCeldaSombreableTabla(true,"tblMatrices");
			$("#tblMatrices").addClass("fixed");
			$("#tblMatrices thead td").addClass("tb-acc");
			$("#tblMatrices tbody tr").css("font-size","12px");
			$("#tblMatrices thead tr td").css("font-size","13px");
			goheadfixedY("#tblMatrices","#wrapperIpercResponsable");
			$.unblockUI();
			
			break;
		}
		
		var nombreMDF = ipercEdicionObj.mdfName.split('-');
		$("#h2Titulo").html("Detalle IPERC de " + nombreMDF[0]);
		columnaProbabilidad = "<th style='text-align:center;vertical-align:middle;width:100px'>Probabilidad</th>";
		anchoEvaluacion=3;
		anchoEvaluacion2=4;
		 anchoEvaluacionPx="500px";
		 anchoEvaluacionActPx=600;
		 anchoEvaluacionFutPx=600;
		 ipercEdicionObj.flagOcultarSignificativo
		 
	 if(ipercEdicionObj.proyecto!=null){
		 anchoEvaluacion=7;
		 anchoEvaluacion2=8;
		 anchoEvaluacionPx="1000px";
		 anchoEvaluacionActPx=1200;
		 anchoEvaluacionFutPx=1200;
		 columnaProbabilidad = "<th style='text-align:center;vertical-align:middle;width:70px'>"+listCategoriaProbabilidadEspecifica[0].nombre+"</th>"
			+"<th style='text-align:center;vertical-align:middle;width:90px'>"+listCategoriaProbabilidadEspecifica[1].nombre+"</th>"
			+"<th style='text-align:center;vertical-align:middle;width:80px'>"+listCategoriaProbabilidadEspecifica[2].nombre+"</th>"
			+"<th style='text-align:center;vertical-align:middle;width:130px'>"+listCategoriaProbabilidadEspecifica[3].nombre+"</th>"
			+"<th style='text-align:center;vertical-align:middle;width:100px'>"+listCategoriaProbabilidadEspecifica[4].nombre+"</th>";
	 }
		if(ipercEdicionObj.matrizRiesgoId==1){
		if(ipercEdicionObj.flagProbabilidadEspecifica==0){
			columnaProbabilidad = "<th style='text-align:center;vertical-align:middle;width:100px'>Probabilidad</th>";
			anchoEvaluacion=3;
			anchoEvaluacion2=4;
			 anchoEvaluacionPx="500px";
			 anchoEvaluacionActPx=600;
			 anchoEvaluacionFutPx=600;
		}else{
			anchoEvaluacion=7;
			anchoEvaluacion2=8;
			 anchoEvaluacionPx="900px";
			 anchoEvaluacionActPx=1100;
			 anchoEvaluacionFutPx=1100;
			columnaProbabilidad = "<th style='text-align:center;vertical-align:middle;width:70px'>Personas Expuestas</th>"
				+"<th style='text-align:center;vertical-align:middle;width:90px'>Procedimiento</th>"
				+"<th style='text-align:center;vertical-align:middle;width:80px'>Capacitación</th>"
				+"<th style='text-align:center;vertical-align:middle;width:130px'>Exposición al Riesgo</th>"
				+"<th style='text-align:center;vertical-align:middle;width:100px'>Probabilidad</th>";
			
		}
		}
		
		
		if(ipercEdicionObj.matrizRiesgoId==5){
		if(ipercEdicionObj.flagEvaluacionFrecuencia==0){
		
			columnaProbabilidad = "<th style='text-align:center;vertical-align:middle;width:100px'>Probabilidad</th>";
			anchoEvaluacion=3;
			anchoEvaluacion2=4;
			 anchoEvaluacionPx="500px";
			 anchoEvaluacionActPx=600;
			 anchoEvaluacionFutPx=600;	 
		}else{
			
			columnaProbabilidad = "<th style='text-align:center;vertical-align:middle;width:100px'>Probabilidad</th>";
			columnaFrecuencia="<th style='text-align:center;vertical-align:middle;width:100px'>Frecuencia</th>";
			anchoEvaluacion=4;
			anchoEvaluacion2=5;
			 anchoEvaluacionPx="650px";
			 anchoEvaluacionActPx=750;
			 anchoEvaluacionFutPx=750;
		}
		
		}
		
		if (ipercEdicionObj.flagEvaluacionInicial) {
			columnaEvalIni = "<th class='tb-acc' colspan='"+anchoEvaluacion+"' style='text-align:center;vertical-align:middle;" +
					"width:"+anchoEvaluacionPx+"' id='tituloEvalPuro'>Evaluacion del Riesgo Puro</th>";
			columnaEvalIni2 = columnaFrecuencia+columnaProbabilidad
					+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:70px;'>Severidad</th>"
					+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:70px;'>Nivel de Riesgo</th>";
		}

		if (ipercEdicionObj.indicadorConsecuencia == 1) {
			columnaTh1Consecuencia = "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:300px;'>Consecuencias</th>";
		} else if (ipercEdicionObj.indicadorConsecuencia == 2) {
			columnaTh1Consecuencia = "<th colspan='3' style='text-align:center;vertical-align:middle;width:1000px;'>Consecuencias</th>";
			columnaTh2Consecuencia = "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:320px;'>Consecuencia 1</th>"
					+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:320px;'>Consecuencia 2</th>"
					+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:320px;'>Consecuencia 3</th>"
		}
		var columnaPucp="<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:300px;'>Causa que originaría el riesgo</th>" +
				"<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:300px;'>Requisito legal asociado</th>" +
				"<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:180px;'>Afecta a </th>"
		var validarEvaluaciones="<th rowspan='2' class='tb-acc' style='width:190px'>Estado Actual</th>" +
		 "<th class='tb-acc' rowspan='2' style='width:190px'>Elaborado por</th>" +
		 "<th class='tb-acc' rowspan='2' style='width:190px'>Revisado por</th>" +
		 "<th class='tb-acc' rowspan='2' style='width:190px'>Aprobado por</th>" +
		 "<th class='tb-acc' rowspan='2' style='width:190px'>Última vez modificado</th>" ;
		var textRiesgoSignificativo ="<th class='tb-acc' style='text-align:center;vertical-align:middle;width:120px;'>Riesgo Significativo</th>";
		if(ipercEdicionObj.flagOcultarSignificativo == 1){
			textRiesgoSignificativo = "";
			anchoEvaluacion2 = anchoEvaluacion2 -1;
			anchoEvaluacionActPx = anchoEvaluacionActPx - 120;
			anchoEvaluacionFutPx = anchoEvaluacionFutPx - 120;
		}
		var tdLugarAntes ="<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px;'>Lugar / Sub Proceso</th>";
		var tdLugarNormal ="<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px;'>Lugar / Sub Proceso</th>";
		if(ipercEdicionObj.flagLugarCostado == 1){
			tdLugarNormal = ""
		}else{
			tdLugarAntes = ""
		}
		
		var cabeceraAux="" 
			+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:150px;'>¿Es rutinaria?</th>"
			+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px;'>Sensibilidad especial</th>"
			+tdLugarNormal
			
			+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:150px;'>Clase de Peligro</th>"
		+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:300px;'>Peligro</th>"
		+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:300px;'>Descripción del Peligro</th>"
		+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:300px;'>Riesgo</th>"
		+ columnaTh1Consecuencia
		+columnaPucp
		+ columnaEvalIni

		+ "<th colspan='4' style='text-align:center;vertical-align:middle;width:1020px;'>Controles Existentes</th>"
		+ "<th colspan='"+anchoEvaluacion2+"' style='text-align:center;vertical-align:middle;width:"+anchoEvaluacionActPx+"px ' id='tituloEvalAct'>Evaluacion del Riesgo Actual</th>"

		+ "<th colspan='5' style='text-align:center;vertical-align:middle;width:620px;'>Controles a Implementar</th>"
		+ "<th colspan='"+anchoEvaluacion2+"' style='text-align:center;vertical-align:middle;width:"+anchoEvaluacionFutPx+"px ' id='tituloEvalFuturo'>Evaluacion del Riesgo Residual Proyectado</th>"
		+validarEvaluaciones
		+ "</tr>"

		+ columnaTh2Consecuencia

		+ columnaEvalIni2

		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:270px;'>1. Control Administrativo</th>"
		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:270px;'>2. Control Ingenieria</th>"

		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:270px;'>3. Equipos de Seguridad</th>"
		+ "<th class='tb-acc' >Eficacia</th>"

		+columnaFrecuencia+columnaProbabilidad
		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:70px;'>Severidad</th>"
		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;width:70px;'>Nivel de Riesgo</th>"
		+ textRiesgoSignificativo

		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;'>1. Eliminación</th>"
		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;'>2. Sustitución</th>"
		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;'>3. Control de Ingeniería</th>"
		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;'>4. Control Administrativo</th>"
		+ "<th class='tb-acc' style='text-align:center;vertical-align:middle;'>5. Equipos de Proteccion</th>"

		+columnaFrecuencia+columnaProbabilidad
		+ "<th style='text-align:center;vertical-align:middle;width:70px'>Severidad</th>"
		+ "<th style='text-align:center;vertical-align:middle;width:70px'>Nivel de Riesgo</th>"
		+ textRiesgoSignificativo 
		+""
		;
		
		var cabecera7 = "<tr  style='background-color: #16365C; color: white;'>"
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:50px;'>Nro</th>"
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px'>"+getSession("gestopdivision")+"</th>"
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px'>"+getSession("gestoparea")+"</th>"
				+tdLugarAntes
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px'>Puesto</th>"
				// Aca debo modificar

				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px;'>Actividad</th>"
				+ "<th class='tb-acc' id='tareaAux' rowspan='2' style='text-align:center;vertical-align:middle;width:220px;'>Tarea</th>"
				+ "<th class='tb-acc' id='pasoAux' rowspan='2' style='text-align:center;vertical-align:middle;width:220px;'>Paso</th>"+cabeceraAux;

				

		var cabecera6 = "<tr  style='background-color: #16365C; color: white;'>"
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:50px;'>Nro</th>"
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px'>"+getSession("gestopdivision")+"</th>"
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px'>"+getSession("gestoparea")+"</th>"
				+tdLugarAntes
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px'>Puesto</th>"
				// Aca debo modificar

				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px;'>Actividad</th>"
				+ "<th class='tb-acc' id='tareaAux' rowspan='2' style='text-align:center;vertical-align:middle;width:220px;'>Tarea</th>"

				+cabeceraAux;

		var cabecera5 = "<tr  style='background-color: #16365C; color: white;'>"
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:50px;'>Nro</th>"
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px'>"+getSession("gestopdivision")+"</th>"
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px'>"+getSession("gestoparea")+"</th>"
				+tdLugarAntes
				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px'>Puesto</th>"
				// Aca debo modificar

				+ "<th class='tb-acc' rowspan='2' style='text-align:center;vertical-align:middle;width:220px;'>Actividad</th>"

				+cabeceraAux;
		
		switch (longitudAux) {
		case 7:

			$("#tblMatrices thead").append(cabecera7);

			break;
		case 6:

			$("#tblMatrices thead").append(cabecera6);

			break;
		case 5:

			$("#tblMatrices thead").append(cabecera5);

			break;

		}
		$("#tblMatrices thead tr th").addClass("tb-acc");
		$("#tblEmpresas tbody tr").remove();

		list.forEach(function(val,index){
			var contador = index + 1;
			var evaluacionTresFilas = "";
			var consecuenciasFilas = "";
			var probabilidadFilasPuro="";
			var probabilidadFilasActual="";
			var probabilidadFilasFuturo="";
			
			var frecuenciaPura="";
			var frecuemciaActual="";
			var frecuenciaFutura="";
			if (ipercEdicionObj.indicadorConsecuencia == 1) {
				consecuenciasFilas = "<td id='cons1"
						+ val.ipercDetailEvalID + "'>"
						+ val.consecuencia1 + "</td>";
			} else if (ipercEdicionObj.indicadorConsecuencia == 2) {
				consecuenciasFilas = "<td id='cons1"
						+ val.ipercDetailEvalID + "'>"
						+ val.consecuencia1 + "</td>" + "<td id='cons2"
						+ val.ipercDetailEvalID + "'>"
						+ val.consecuencia2 + "</td>" + "<td id='cons3"
						+ val.ipercDetailEvalID + "'>"
						+ val.consecuencia3 + "</td>";
			}

			

			if(ipercEdicionObj.flagProbabilidadEspecifica==0){
				probabilidadFilasPuro = "<td id='evainiprob"
					+ val.ipercDetailEvalID + "'>"
					+ val.probabilidadNombre + "</td>";
				probabilidadFilasActual =  "<td id='evaactprob"
					+ val.ipercDetailEvalID
					+ "'>"
					+ val.probabilidadActNombre
					+ "</td>";
				probabilidadFilasFuturo = "<td id='evaproyprob"
					+ val.ipercDetailEvalID
					+ "'>"
					+ val.probabilidadProyNombre
					+ "</td>";
				
				
			
				
			}else{
				
				probabilidadFilasPuro = "<td id='persExp"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbPersonas + "</td>" + "<td id='probProc"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbProcedimiento + "</td>" + "<td id='probCapa"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbCapacitacion + "</td>"
					+ "<td id='probRiskExp"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbExpoRiesgo + "</td>"
					+ "<td id='evainiprob"
					+ val.ipercDetailEvalID + "'>"
					+ val.probabilidadNombre + "</td>";
				
				probabilidadFilasActual = "<td id='persExpAct"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbPersonasAct + "</td>" + "<td id='probProcAct"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbProcedimientoAct + "</td>" + "<td id='probCapaAct"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbCapacitacionAct + "</td>"
					+ "<td id='probRiskExpAct"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbExpoRiesgoAct + "</td>"
					+"<td id='evaactprob"
					+ val.ipercDetailEvalID
					+ "'>"
					+ val.probabilidadActNombre
					+ "</td>";
				
				probabilidadFilasFuturo = "<td id='persExpFut"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbPersonasFut + "</td>" + "<td id='probProcFut"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbProcedimientoFut + "</td>" + "<td id='probCapaFut"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbCapacitacionFut + "</td>"
					+ "<td id='probRiskExpFut"
					+ val.ipercDetailEvalID + "'>"
					+ val.nombreProbExpoRiesgoFut + "</td>"
					+"<td id='evaproyprob"
					+ val.ipercDetailEvalID
					+ "'>"
					+ val.probabilidadProyNombre
					+ "</td>";
				
				
				
			}
			if(ipercEdicionObj.flagEvaluacionFrecuencia){
				frecuenciaPura="<td id='frecPelPuro"+val.ipercDetailEvalID+"'>" 
				+ val.frecuenciaPeligroPuraNombre + "</td>";
				frecuemciaActual="<td id='frecPelAct"+val.ipercDetailEvalID+"'>" 
				+ val.frecuenciaPeligroActNombre + "</td>";
				frecuenciaFutura="<td id='frecPelFut"+val.ipercDetailEvalID+"'>" 
				+ val.frecuenciaPeligroFutNombre + "</td>";
				
			}
			if (ipercEdicionObj.flagEvaluacionInicial) {
				evaluacionTresFilas =frecuenciaPura+ probabilidadFilasPuro
						+ "<td id='evainisev" + val.ipercDetailEvalID
						+ "'>" + val.severidadNombre + "</td>"
						+ "<td id='evaininiv" + val.ipercDetailEvalID
						+ "' style='background-color:"
						+ val.nivelRiesgoColor + ";font-weight:bold' >"
						+ "" + val.nivelRiesgoNombre + "</td>";
			}
			var bodyPucp="<td id='detipcau" + val.ipercDetailEvalID
			+ "'>" + val.causa + "</td>" +
					"<td id='detipreq" + val.ipercDetailEvalID
			+ "'>" + val.requisitoLegal + "</td>" +
					"<td id='detipafe" + val.ipercDetailEvalID
			+ "'>" + val.alcance.nombre + "</td>";
			var textRiesgoAct ="<td id='aceptableact"
								+ val.ipercDetailEvalID
								+ "'>"
								+ pasarBoolPalabra(val.ipercDetailEvalRiskAct)
								+ "</td>";
			var textRiesgoFut ="<td id='aceptablefut"
								+ val.ipercDetailEvalID
								+ "'>"
								+ pasarBoolPalabra(val.ipercDetailEvalRiskProy)
								+ "</td>";
			if(ipercEdicionObj.flagOcultarSignificativo == 1){
				textRiesgoAct ="";
				textRiesgoFut ="";
			}
			var bodyLugarAntes ="<td id='lugar"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.descripcionLugar
				+ "</td>";
			var bodyLugarNormal ="<td id='lugar"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.descripcionLugar
				+ "</td>";
			if(ipercEdicionObj.flagLugarCostado == 1){
				bodyLugarNormal = ""
			}else{
				bodyLugarAntes = ""
			}
			
			
			if(val.ipercDetailName){
				
				var detalleAux = val.ipercDetailName.split(' - ');
				var actividadAux = detalleAux[4];
				var tareaAux = detalleAux[5];
				var pasoAux = detalleAux[6];

				var puestoAux = detalleAux[3];
				var areaAux = detalleAux[2];
				var divisionAux = detalleAux[1];
				

				var propiedades1 = estadoControl(val.numRetrasado1,
						val.numImplementar1,
						val.numCompletado1);
				var propiedades2 = estadoControl(val.numRetrasado2,
						val.numImplementar2,
						val.numCompletado2);
				var propiedades3 = estadoControl(val.numRetrasado3,
						val.numImplementar3,
						val.numCompletado3);
				var propiedades4 = estadoControl(val.numRetrasado4,
						val.numImplementar4,
						val.numCompletado4);
				var propiedades5 = estadoControl(val.numRetrasado5,
						val.numImplementar5,
						val.numCompletado5);
				var colorControles="#81F7F3";
				if(parseInt(ipercEdicionObj.matrizRiesgoId)==6){
					val.clasificacionName=val.clasificacionP.nombre;
				}	
				var cuerpoAux="" +
						"" +
						"" 
						+"<td id='tdruti"
						+ val.ipercDetailEvalID
						+ "'>"
						+ val.rutina.nombre
						+ "</td>"
						
						+"<td id='tdsens"
						+ val.ipercDetailEvalID
						+ "'>"
						+ val.sensibilidad
						+ "</td>"
						
				+bodyLugarNormal
				+ "<td id='clasi"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.clasificacionName
				+ "</td>"
				+ "<td id='pel"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.peligroName
				+ "</td>"
				+ "<td id='despel"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.descripcionPeligro
				+ "</td>"
				+ "<td id='riesgo"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.riesgoName
				+ "</td>"

				+ consecuenciasFilas
				+bodyPucp
				+ evaluacionTresFilas

				+ "<td   id='ctrlini1"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.controlInicial1
				+ "</td>"
				+ "<td   id='ctrlini2"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.controlInicial2
				+ "</td>"
				+ "<td   id='ctrlini3"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.controlInicial3
				+ "</td>"
				+ "<td id='tdeficaz"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.eficaz
				+ " %</td>"
				+frecuemciaActual
				+probabilidadFilasActual
				+ "<td id='evaactsev"
				+ val.ipercDetailEvalID
				+ "'>"
				+ val.severidadActNombre
				+ "</td>"
				+ "<td id='evaactniv"
				+ val.ipercDetailEvalID
				+ "' style='background-color:"
				+ val.nivelRiesgoActColor
				+ ";font-weight:bold' >"
				+ val.nivelRiesgoActNombre
				+ "</td>"
				+textRiesgoAct

				+ "<td id='ctrlImpl1"
				+ val.ipercDetailEvalID
				+ "' style='color:"
				+ propiedades1.color
				+ ";font-weight:bold'>"
				+ devolverTagCtrl(val.numTipo1)
				+ ""
				+ propiedades1.icono
				+ "</td>"
				+ "<td id='ctrlImpl2"
				+ val.ipercDetailEvalID
				+ "' style='color:"
				+ propiedades2.color
				+ ";font-weight:bold'>"
				+ devolverTagCtrl(val.numTipo2)
				+ ""
				+ propiedades2.icono
				+ "</td>"
				+ "<td id='ctrlImpl3"
				+ val.ipercDetailEvalID
				+ "' style='color:"
				+ propiedades3.color
				+ ";font-weight:bold'>"
				+ devolverTagCtrl(val.numTipo3)
				+ ""
				+ propiedades3.icono
				+ "</td>"
				+ "<td id='ctrlImpl4"
				+ val.ipercDetailEvalID
				+ "' style='color:"
				+ propiedades4.color
				+ ";font-weight:bold'>"
				+ devolverTagCtrl(val.numTipo4)
				+ ""
				+ propiedades4.icono
				+ "</td>"
				+ "<td id='ctrlImpl5"
				+ val.ipercDetailEvalID
				+ "' style='color:"
				+ propiedades5.color
				+ ";font-weight:bold'>"
				+ devolverTagCtrl(val.numTipo5)
				+ ""
				+ propiedades5.icono
				+ "</td>"
				+frecuenciaFutura
				+ probabilidadFilasFuturo
				+ "<td id='evaproysev"
				+ val.ipercDetailEvalID
				+ "' >"
				+ val.severidadProyNombre
				+ "</td>"
				+ "<td id='evaproyniv"
				+ val.ipercDetailEvalID
				+ "' style='background-color:"
				+ val.nivelRiesgoProyColor
				+ ";font-weight:bold'>"
				+ val.nivelRiesgoProyNombre
				+ "</td>"
				
				+textRiesgoFut
				+"<td>"+val.estadoValidar.nombre+"</td>" +
 				"<td>"+val.fechaElaboradoTexto+" ("+val.trabajadorElaborado.nombre+")</td>" +
 				"<td>"+val.fechaRevisadoTexto+" ("+val.trabajadorRevisado.nombre+")</td>" +
 				"<td>"+val.fechaAprobadoTexto+" ("+val.trabajadorAprobado.nombre+")</td>"+
 				"<td>"+val.fechaModificacionTexto+" </td>"
 				
				
				
				;
				
				switch (longitudAux) {
				case 7:

					$("#tblMatrices tbody")
							.append(
									"<tr id='trm"
											+ val.ipercDetailEvalID
											+ "' onclick='javascript:editarIpercDetalle("
											
											+ index
											+ ")'>"

											+ "<td>"
											+ contador
											+ "</td>"
											
											+ "<td >"
											+ divisionAux
											+ "</td>"
											+ "<td >"
											+ areaAux
											+ "</td>"
											+bodyLugarAntes
											+ "<td >"
											+ puestoAux
											+ "</td>"
											+ "<td >"
											+ actividadAux
											+ "</td>"
											+ "<td >"
											+ tareaAux
											+ "</td>"
											+ "<td >"
											+ pasoAux
											+ "</td>"
												+cuerpoAux
											 + "</tr>");
					break;
				case 6:

					$("#tblMatrices tbody")
							.append(
									"<tr id='trm"
											+ val.ipercDetailEvalID
											+ "' onclick='javascript:editarIpercDetalle("
											
											+ index
											+ ")'>"

											+ "<td>"
											+ contador
											+ "</td>"
											+ "<td >"
											+ divisionAux
											+ "</td>"
											+ "<td >"
											+ areaAux
											+ "</td>"
											+bodyLugarAntes
											+ "<td >"
											+ puestoAux
											+ "</td>"
											+ "<td >"
											+ actividadAux
											+ "</td>"
											+ "<td >"
											+ tareaAux
											+ "</td>"
											+cuerpoAux
											+ "</tr>");
					break;
				case 5:

					$("#tblMatrices tbody")
							.append(
									"<tr id='trm"
											+ val.ipercDetailEvalID
											+ "' onclick='javascript:editarIpercDetalle("
											
											+ index
											+ ")'>"

											+ "<td>"
											+ contador
											+ "</td>"
											+ "<td >"
											+ divisionAux
											+ "</td>"
											+ "<td >"
											+ areaAux
											+ "</td>"
											+bodyLugarAntes
											+ "<td >"
											+ puestoAux
											+ "</td>"
											+ "<td >"
											+ actividadAux
											+ "</td>"
												+cuerpoAux
											 + "</tr>");
					break;

				}
			}
			

		});

		formatoCeldaSombreableTabla(true,"tblMatrices");
		$("#tblMatrices").addClass("fixed");
		$("#tblMatrices tbody tr").css("font-size","12px");
		$("#tblMatrices thead tr th").css("font-size","13px");
		
		if(getSession("linkCalendarioDetalleIpercId")!=null){
			
			detallesFullIperc.every(function(val,index3){
				
				if(val.ipercDetailEvalID==parseInt(getSession("linkCalendarioDetalleIpercId"))){
					editarIpercDetalle(index3);
					verControlSegunTipo(parseInt(getSession("linkCalendarioControlTipoId")));
					
					sessionStorage.removeItem("linkCalendarioDetalleIpercId");
					sessionStorage.removeItem("linkCalendarioControlTipoId");
					return false;
				}else{
					return true;
				}
			});
			
		}
		$.unblockUI();
		break;
	default:
		alert("Ocurrió un error al traer las evaluaciones!");
	}	
}

function devolverTagCtrl(nroControles) {
	var auxNum = parseInt(nroControles);
	var tagCtrl;

	if (auxNum > 1) {
		tagCtrl = auxNum + " Controles";
	} else {
		tagCtrl = auxNum + " Control";

	}
	if (auxNum == 0) {
		tagCtrl = "";
	}
	return tagCtrl;

}
function verAcordeClasificacionDetalle(){
	var clasId=$("#selClasificacionDetalle").val();
	listClasificacionDetalle.forEach(function(val){
		if(val.id==parseInt(clasId)){console.log(val.sugeridos);
			var list=listarStringsDesdeArray(val.sugeridos, "peligro");
			ponerListaSugerida("inputPeligro",list,true);
			$("#inputPeligro").on("autocompleteclose",completarPeligro);
		}
	});
}
function completarPeligro(e){
	var clasId=$("#selClasificacionDetalle").val();
	var peligro=$("#inputPeligro").val();
	listClasificacionDetalle.forEach(function(val){
		if(val.id==parseInt(clasId)){
		val.sugeridos.forEach(function(val1){
			if(peligro.trim()==val1.peligro){console.log(val1);
				$("#inputRiesgo").val(val1.riesgo);
				$("#inputCons1").val(val1.consecuencia);
				$("#inputReqLegalDetalle").val(val1.requisitoLegal);
			}
		});
		}
	})
}
function editarIpercDetalle(pindex,isDuplicado) {
	if (!banderaEdicion) {

		detalleIpercDetailObj=detallesFullIperc[pindex];
		if(parseInt(getSession("trabajadorGosstId")) > 0){
			var puedeElaborar = false;
			var puedeRevisar = false;
			var puedeAprobar = false;
			var isEvaluado = false;
			if(numAreasSupervisor > 0){
				puedeElaborar = true;
				puedeRevisar = false;
				puedeAprobar = false;
				isEvaluado = (detalleIpercDetailObj.trabajadorElaborado.trabajadorId != null);
			}
			if(numAreasJefe > 0){
				puedeElaborar = false;
				puedeRevisar = true;
				puedeAprobar = false;
				isEvaluado = (detalleIpercDetailObj.trabajadorRevisado.trabajadorId != null);
			}
			if(numAreasGerente > 0){
				puedeElaborar = false;
				puedeRevisar = false;
				puedeAprobar = true;
				isEvaluado = (detalleIpercDetailObj.trabajadorAprobado.trabajadorId != null);
			}
			if(isEvaluado){
				var r = confirm("Estimado Usuario, considerar que las " +
						"validaciones anteriores serán reseteadas para este registro. Además," +
						" deberá informar a los responsables para que lo revisen nuevamente. ¿Desea continuar?");
				if(r){
					
				}else{
					return;
				}
				
			}
			$("#formBtnGeneral").hide();
		}
		
		
		$("#btnVolverIPERC").hide();
		$("#btnImportar").hide();
		$("#btnImportarDivision").hide();
		var nombreMDF = ipercEdicionObj.mdfName.split('-');
		var detalleAux = detallesFullIperc[pindex].ipercDetailName.split(' - ');
		var actividadAux = detalleAux[4];
		var tareaAux = (detalleAux[5]==null?"":"-"+detalleAux[5]);
		var pasoAux = (detalleAux[6]==null?"":"-"+detalleAux[6]);

		var puestoAux = detalleAux[3];
		var areaAux = detalleAux[2];
		$("#h2Titulo").html("Detalle IPERC de " + nombreMDF[0] +" " +
				"en <strong>"+areaAux+"-"+puestoAux+"-"+actividadAux+tareaAux+pasoAux+"</strong>");
		isDuplicado = isDuplicado || false;
		formatoCeldaSombreableTabla(false,"tblMatrices");
		detalleIpercDetailId = detallesFullIperc[pindex].ipercDetailEvalID;
		detalleIpercId = detallesFullIperc[pindex].ipercDetailId;
		peligroId = detallesFullIperc[pindex].idPeligro;
		clasiId =(isDuplicado?"-1": detallesFullIperc[pindex].idClasificacion);
		riesgoId = detallesFullIperc[pindex].idRiesgo;
		probabilidadId = (isDuplicado?"-1":detallesFullIperc[pindex].probabilidadId);
		severidadId =(isDuplicado?"-1": detallesFullIperc[pindex].severidadId);
		eficacia =(isDuplicado?0: detallesFullIperc[pindex].eficaz);
		
		probabilidadActId =(false?"-1": detallesFullIperc[pindex].probabilidadActId);
		severidadActId =(false?"-1": detallesFullIperc[pindex].severidadActId);
		probabilidadProyId = (false?"-1":detallesFullIperc[pindex].probabilidadProyId);
		severidadProyId = (false?"-1":detallesFullIperc[pindex].severidadProyId);

		isRiskyProy =(isDuplicado?"-1": detallesFullIperc[pindex].ipercDetailEvalRiskProy);
		isRiskyAct =(isDuplicado?"-1": detallesFullIperc[pindex].ipercDetailEvalRiskAct);
		indexAux=pindex;
		
		if (!nuevoDupIpercAutomatico) {
			ipercDetalleEvalIdCopy = detallesFullIperc[pindex].ipercDetailEvalID;	
		}

if(isDuplicado==true){
	detalleIpercDetailId = detallesFullIperc[pindex].ipercDetailEvalID+"copy";
}else{
	detalleIpercDetailId = detallesFullIperc[pindex].ipercDetailEvalID;
}
		var nivelRiesgoNombre=detallesFullIperc[pindex].nivelRiesgoNombre;
		var nivelRiesgoActNombre=detallesFullIperc[pindex].nivelRiesgoActNombre;
		var nivelRiesgoFutNombre=detallesFullIperc[pindex].nivelRiesgoProyNombre;
		
		var nivelRiesgoColor=detallesFullIperc[pindex].nivelRiesgoColor;
		var nivelRiesgoActColor=detallesFullIperc[pindex].nivelRiesgoActColor;
		var nivelRiesgoFutColor=detallesFullIperc[pindex].nivelRiesgoProyColor;
		
		
		 personExpId=detallesFullIperc[pindex].probPersonas;
		 indProcId=detallesFullIperc[pindex].probProcedimiento;
		 indCapaId=detallesFullIperc[pindex].probCapacitacion;
		 indRiskId=detallesFullIperc[pindex].probExpoRiesgo;
		
		 personExpIdAct=detallesFullIperc[pindex].probPersonasAct;
		 indProcIdAct=detallesFullIperc[pindex].probProcedimientoAct;
		 indCapaIdAct=detallesFullIperc[pindex].probCapacitacionAct;
		 indRiskIdAct=detallesFullIperc[pindex].probExpoRiesgoAct;
		 
		 personExpIdFut=detallesFullIperc[pindex].probPersonasFut;
		 indProcIdFut=detallesFullIperc[pindex].probProcedimientoFut;
		 indCapaIdFut=detallesFullIperc[pindex].probCapacitacionFut;
		 indRiskIdFut=detallesFullIperc[pindex].probExpoRiesgoFut;
		 
		  frecPelPuroId=detallesFullIperc[pindex].frecuenciaPeligroPuraId;
		  frecPelActId=detallesFullIperc[pindex].frecuenciaPeligroActId;
		  frecPelFutId=detallesFullIperc[pindex].frecuenciaPeligroFutId;
		 
		 
		 
		 
		$("#tdeficaz" + detalleIpercDetailId)
				.html(
						"<span><input type='number' id='inputEficaz' max='100' min='0' step='10' class='form-control'   value='"
								+ eficacia + "'><label>%</label></span> ");

		var ided = "_" + detalleIpercDetailId;

		var name = $("#lugar" + detalleIpercDetailId).text();
		$("#lugar" + detalleIpercDetailId)
				.html(
						"<input type='text' id='inputLugar' class='form-control' placeholder='Lugar'  value='"
								+ name + "'>");
//
		var selTipoRutinaIper= crearSelectOneMenuOblig("selTipoRutinaIper", "", listTipoRutina, 
				detalleIpercDetailObj.rutina.id, "id","nombre");
		$("#tdruti" + detalleIpercDetailId).html(selTipoRutinaIper)
		//
		var sensibilidad = detallesFullIperc[pindex].sensibilidad;
		$("#tdsens" + detalleIpercDetailId).html("<input type='text' id='inputSensibilidad' class='form-control' >")
		 $("#inputSensibilidad").val(sensibilidad);
		/** ****************Edicion de controles***************** */
		var name1 = $("#ctrlImpl1" + detalleIpercDetailId).html();
		if (name1 == "") {
			name1 = "Editar";
		}

		$("#ctrlImpl1" + detalleIpercDetailId).html(
				"<a href='#' onclick='javascript:verControlSegunTipo(1)' id='ctrlImplLink1'"
						+ detalleIpercDetailId + ">" + (name1) + "</a>");
		/** *********************************************** */
		var name2 = $("#ctrlImpl2" + detalleIpercDetailId).html();
		if (name2 == "") {
			name2 = "Editar";
		}
		$("#ctrlImpl2" + detalleIpercDetailId).html(
				"<a href='#' onclick='javascript:verControlSegunTipo(2)' id='ctrlImplLink2'"
						+ detalleIpercDetailId + ">" + (name2) + "</a>");
		/** *********************************************** */
		var name3 = $("#ctrlImpl3" + detalleIpercDetailId).html();
		if (name3 == "") {
			name3 = "Editar";
		}

		$("#ctrlImpl3" + detalleIpercDetailId).html(
				"<a href='#' onclick='javascript:verControlSegunTipo(3)' id='ctrlImplLink3'"
						+ detalleIpercDetailId + ">" + (name3) + "</a>");
		/** *********************************************** */
		var name4 = $("#ctrlImpl4" + detalleIpercDetailId).html();
		if (name4 == "") {
			name4 = "Editar";
		}

		$("#ctrlImpl4" + detalleIpercDetailId).html(
				"<a href='#' onclick='javascript:verControlSegunTipo(4)' id='ctrlImplLink4'"
						+ detalleIpercDetailId + ">" + (name4) + "</a>");
		/** *********************************************** */
		var name5 = $("#ctrlImpl5" + detalleIpercDetailId).html();

		if (name5 == "") {
			name5 = "Editar";
		}
		$("#ctrlImpl5" + detalleIpercDetailId).html(
				"<a href='#' onclick='javascript:verControlSegunTipo(5)' id='ctrlImplLink5'"
						+ detalleIpercDetailId + ">" + (name5) + "</a>");
		/** *********************************************** */
		var listaClasi = JSON.parse(sessionStorage.getItem("clasifs"));
		var selectClasif = crearSelectOneMenu("selClasi",
				"javascript:cargarComboPeligroRiesgo();", listaClasi, ided
						.lastIndexOf("copy") == -1 ? clasiId : "-1",
				"clasificacionId", "clasificacionNombre");
		$("#clasi" + detalleIpercDetailId).html(selectClasif);
		
		if (autoFocusPeligro) {
			$("#selClasi").focus();
		}

		//En caso de 4x4P
		if(parseInt(ipercEdicionObj.matrizRiesgoId)==6){
			var selClasificacionDetalle= crearSelectOneMenuOblig("selClasificacionDetalle", "verAcordeClasificacionDetalle()", listClasificacionDetalle, 
					detalleIpercDetailObj.clasificacionP.id, "id",
			"nombre") 
			$("#clasi" + detalleIpercDetailId).html(selClasificacionDetalle);
			
		}
		
		var name6 = $("#despel" + detalleIpercDetailId).text();
		name6 = ided.lastIndexOf("copy") == -1 ? name6 : "";
		$("#despel" + detalleIpercDetailId)
				.html(
						"<input type='text' id='inputDesPel' class='form-control' placeholder='Descripción Peligro' autofocus = 'true'   value='"
								+ name6 + "'>");

		$("#inputDesPel").keypress(function(e) {
			if (e.which == 13) {
				nuevoDupIpercAutomatico = true;
				autoFocusPeligro = true;
				guardarDetalleIperc();
			}
		});
		
		var selAlcanceDetalle= crearSelectOneMenuOblig("selAlcanceDetalle", "", listAlcanceDetalle, detalleIpercDetailObj.alcance.id, "id",
				"nombre") 
		
		$("#detipafe" + detalleIpercDetailId).html(selAlcanceDetalle);
		//
		listFullTipoContactoDetalle.forEach(function(val){
			val.selected = 0;
			if(val.id == detalleIpercDetailObj.tipoContacto.id){
				val.selected = 1;
			}
		});
		crearSelectOneMenuObligUnitarioCompleto("selTipoContactoDetalle", "verAcordeTipoContactoDetalle()", listFullTipoContactoDetalle, "id",
				"nombreAux","#dettipco"+ detalleIpercDetailId,"--");
	 
		//
		$("#detipcau" + detalleIpercDetailId)
		.html(
				" <input id='inputCausaDetalle' class='form-control' '> ");
		$("#inputCausaDetalle").val(detalleIpercDetailObj.causa);
		//
		$("#detipreq" + detalleIpercDetailId)
		.html(
				" <input id='inputReqLegalDetalle' class='form-control' '> ");
		$("#inputReqLegalDetalle").val(detalleIpercDetailObj.requisitoLegal);
		
		/**
		 * ***********************eval inicial
		 * probabilidad************************
		 */
		
		if (ipercEdicionObj.flagEvaluacionInicial) {
			var selectProb = crearSelectOneMenu("selProb",
					"javascript:actualizarNivelRiesgo();", listProbabilidad,
					ided.lastIndexOf("copy") == -1 ? probabilidadId : "-1",
					"probabilidadId", "probabilidadNombre");
			$("#evainiprob" + detalleIpercDetailId).html(selectProb);
			/**
			 * ***********************eval inicial
			 * severidad************************
			 */
			var selectSev = crearSelectOneMenu("selSev",
					"javascript:actualizarNivelRiesgo();", listSeveridad, ided
							.lastIndexOf("copy") == -1 ? severidadId : "-1",
					"severidadId", "severidadNombre");
			$("#evainisev" + detalleIpercDetailId).html(selectSev);
			/** *******************nivel de riesgo**************************** */
			$("#evaininiv" + detalleIpercDetailId)
					.html(
							"<h5><strong>"
									+ nivelRiesgoNombre+ "</strong></h5>");
			$("#evaininiv" + detalleIpercDetailId).css(
					{
						"background-color" :nivelRiesgoColor,
						"color" : "black"
					});
		}

		/**
		 * ***********************eval actual
		 * probabilidad************************
		 */
		var selectProbAct = crearSelectOneMenu("selProbAct",
				"javascript:actualizarNivelRiesgoAct();", listProbabilidad,
				probabilidadActId ,
				"probabilidadId", "probabilidadNombre");
		$("#evaactprob" + detalleIpercDetailId).html(selectProbAct);
		/** ***********************eval actual severidad************************ */
		var selectSevAct = crearSelectOneMenu("selSevAct",
				"javascript:actualizarNivelRiesgoAct();", listSeveridad, 
				  severidadActId ,
				"severidadId", "severidadNombre");
		$("#evaactsev" + detalleIpercDetailId).html(selectSevAct);
		/** *******************nivel de riesgo actual**************************** */
		$("#evaactniv" + detalleIpercDetailId).html(
				"<h5><strong>"
						+ nivelRiesgoActNombre + "</strong></h5>");
		$("#evaactniv" + detalleIpercDetailId).css(
				{
					"background-color" : nivelRiesgoActColor,
					"color" : "black"
				});
		$("#aceptableact" + detalleIpercDetailId).html(
				"<input type='checkbox' id='riskAct'>");
		/**
		 * ***********************eval proyectado
		 * probabilidad************************
		 */
		var selectProbProy = crearSelectOneMenu("selProbProy",
				"javascript:actualizarNivelRiesgoProy();", listProbabilidad,
				 probabilidadProyId ,
				"probabilidadId", "probabilidadNombre");
		$("#evaproyprob" + detalleIpercDetailId).html(selectProbProy);
		/**
		 * ***********************eval proyectado
		 * severidad************************
		 */
		var selectSevProy = crearSelectOneMenu("selSevProy",
				"javascript:actualizarNivelRiesgoProy();", listSeveridad, 
				 severidadProyId ,
				"severidadId", "severidadNombre");
		$("#evaproysev" + detalleIpercDetailId).html(selectSevProy);
		/**
		 * *******************nivel de riesgo
		 * proyectado****************************
		 */
		$("#evaproyniv" + detalleIpercDetailId)
				.html(
						"<h5><strong>"
								+ nivelRiesgoFutNombre + "</strong></h5>");
		$("#evaproyniv" + detalleIpercDetailId).css(
				{
					"background-color" :nivelRiesgoFutColor,
					"color" : "black"
				});

		$("#aceptablefut" + detalleIpercDetailId).html(
				"<input type='checkbox' id='riskProy'>");
		/** *********************consecuencias************************** */
		/** *********************marcar los checks :)************************** */
		marcarChechBox(isRiskyAct, "riskAct");
		marcarChechBox(isRiskyProy, "riskProy");

		
		
		/**
		 * **********************Listas de 
		 * frecuencia de peligro*********************
		 */
		if(ipercEdicionObj.flagEvaluacionFrecuencia==1){
			if (ipercEdicionObj.flagEvaluacionInicial) {
				var selFrecPelPuro=crearSelectOneMenuY("selFrecPelPuro", "actualizarNivelRiesgoFrec()", listaFrecPel, frecPelPuroId, 
						"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
				$("#frecPelPuro"+ detalleIpercDetailId).html(selFrecPelPuro);
				var selProbEspePuro=crearSelectOneMenuY("selProbEspePuro", "actualizarNivelRiesgoFrec()", listProbEspe, probabilidadId, 
						"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
				$("#evainiprob"+ detalleIpercDetailId).html(selProbEspePuro);
				var selSevEspePuro=crearSelectOneMenuY("selSevEspePuro", "actualizarNivelRiesgoFrec()", listaSevEspe, severidadId, 
						"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
				$("#evainisev"+ detalleIpercDetailId).html(selSevEspePuro);
				
				actualizarNivelRiesgoFrec();
			}
			
	
		var selFrecPelAct=crearSelectOneMenuY("selFrecPelAct", "actualizarNivelRiesgoFrecAct()", listaFrecPel, frecPelActId, 
				"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
		var selFrecPelFut=crearSelectOneMenuY("selFrecPelFut", "actualizarNivelRiesgoFrecFut()", listaFrecPel, frecPelFutId, 
				"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
		
		$("#frecPelAct"+ detalleIpercDetailId).html(selFrecPelAct);
		$("#frecPelFut"+ detalleIpercDetailId).html(selFrecPelFut);
		
		
		var selProbEspeAct=crearSelectOneMenuY("selProbEspeAct", "actualizarNivelRiesgoFrecAct()", listProbEspe, probabilidadActId, 
				"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
		var selProbEspeFut=crearSelectOneMenuY("selProbEspeFut", "actualizarNivelRiesgoFrecFut()", listProbEspe, probabilidadProyId, 
				"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
		
		$("#evaactprob"+ detalleIpercDetailId).html(selProbEspeAct);
		$("#evaproyprob"+ detalleIpercDetailId).html(selProbEspeFut);
		
		var selSevEspeAct=crearSelectOneMenuY("selSevEspeAct", "actualizarNivelRiesgoFrecAct()", listaSevEspe, severidadActId, 
				"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
		var selSevEspeFut=crearSelectOneMenuY("selSevEspeFut", "actualizarNivelRiesgoFrecFut()", listaSevEspe, severidadProyId, 
				"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
		
		$("#evaactsev"+ detalleIpercDetailId).html(selSevEspeAct);
		$("#evaproysev"+ detalleIpercDetailId).html(selSevEspeFut);
		
		
		actualizarNivelRiesgoFrecFut();
		actualizarNivelRiesgoFrecAct();
		
		}
		
		
		
		
		/**
		 * **********************Listas de 
		 * probabilidad específica*********************
		 */
		
		
		
		if(ipercEdicionObj.flagProbabilidadEspecifica==1){
			
			var selPerExp=	crearSelectOneMenuY("selPerExp", "actualizarProbabilidaEspecifica()", listaPersonaExpuesta, personExpId, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
			var selPerExpAct=	crearSelectOneMenuY("selPerExpAct", "actualizarProbabilidaEspecificaAct()", listaPersonaExpuesta, personExpIdAct, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
			var selPerExpFut=	crearSelectOneMenuY("selPerExpFut", "actualizarProbabilidaEspecificaFut()", listaPersonaExpuesta, personExpIdFut, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
			
			var selIndCapa=	crearSelectOneMenuY("selIndCapa", "actualizarProbabilidaEspecifica()", listaIndCapa, indCapaId, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
			var selIndCapaAct=	crearSelectOneMenuY("selIndCapaAct", "actualizarProbabilidaEspecificaAct()", listaIndCapa, indCapaIdAct, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
			var selIndCapaFut=	crearSelectOneMenuY("selIndCapaFut", "actualizarProbabilidaEspecificaFut()", listaIndCapa, indCapaIdFut, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
					
			
			var selIndRisk=	crearSelectOneMenuY("selIndRisk", "actualizarProbabilidaEspecifica()", listaIndRisk, indRiskId, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
			var selIndRiskAct=	crearSelectOneMenuY("selIndRiskAct", "actualizarProbabilidaEspecificaAct()", listaIndRisk, indRiskIdAct, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
			var selIndRiskFut=	crearSelectOneMenuY("selIndRiskFut", "actualizarProbabilidaEspecificaFut()", listaIndRisk, indRiskIdFut, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
					
			var selIndProc=	crearSelectOneMenuY("selIndProc", "actualizarProbabilidaEspecifica()", listaIndProc, indProcId, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
			var selIndProcAct=	crearSelectOneMenuY("selIndProcAct", "actualizarProbabilidaEspecificaAct()", listaIndProc, indProcIdAct, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
			var selIndProcFut=	crearSelectOneMenuY("selIndProcFut", "actualizarProbabilidaEspecificaFut()", listaIndProc, indProcIdFut, 
					"subProbabilidadId","puntajeSubProbabilidad","nombreSubProbilidad");
					

			
			$("#persExp"+ detalleIpercDetailId).html(selPerExp);
			$("#persExpAct"+ detalleIpercDetailId).html(selPerExpAct);
			$("#persExpFut"+ detalleIpercDetailId).html(selPerExpFut);
			
			$("#probCapa"+ detalleIpercDetailId).html(selIndCapa);
			$("#probCapaAct"+ detalleIpercDetailId).html(selIndCapaAct);
			$("#probCapaFut"+ detalleIpercDetailId).html(selIndCapaFut);
			
			$("#probRiskExp"+ detalleIpercDetailId).html(selIndRisk);
			$("#probRiskExpAct"+ detalleIpercDetailId).html(selIndRiskAct);
			$("#probRiskExpFut"+ detalleIpercDetailId).html(selIndRiskFut);
			
			$("#probProc"+ detalleIpercDetailId).html(selIndProc);
			$("#probProcAct"+ detalleIpercDetailId).html(selIndProcAct);
			$("#probProcFut"+ detalleIpercDetailId).html(selIndProcFut);
			
			$("#selProbAct").prop("disabled",true);
			$("#selProb").prop("disabled",true);
					$("#selProbProy").prop("disabled",true);

			}
		var dataParam = {
			};

		callAjaxPost(URL + '/iperc/listvarios/autocompletar', dataParam,
				implementarAutocompletar);

		habilitarBotonesEdicion();
		$("#btnEliminar").show();
		$("#btnCopiar").show();
		$("#btnAutoAsign").show();
		banderaEdicion = true;
	}
}
function verAcordeTipoContactoDetalle(){
	var tipoId = parseInt($("#selTipoContactoDetalle").val());
	listFullTipoContactoDetalle.forEach(function(val){
		if(val.id == tipoId){
			$("#dettipcoid"+detalleIpercDetailId).html(val.idAux)
		}
	});
}

function actualizarNivelRiesgoGeneral(idSelProb, idSelSev, idCelda, nombreCelda) {

	$("#" + idCelda).html("<h5><strong>" + nombreCelda + "</strong></h5>");

	$("#" + idCelda).css({
		"background-color" : obtenerColorRiesgo(idSelProb, idSelSev),
		"color" : "black"
	});

}

function actualizarNivelRiesgo() {
	var idSelProb = $("#selProb option:selected").val();
	var idSelSev = $("#selSev option:selected").val();
	var idSelFrec=$("#selFrecPelPuro option:selected").val();

	$("#evaininiv" + detalleIpercDetailId).html(
			"<h5><strong>" + obtenerNivelRiesgo(idSelProb, idSelSev)
					+ "</strong></h5>");

	$("#evaininiv" + detalleIpercDetailId).css({
		"background-color" : obtenerColorRiesgo(idSelProb, idSelSev),
		"color" : "black"
	});
}

function actualizarNivelRiesgoAct() {
	var idSelProb = $("#selProbAct option:selected").val();
	var idSelSev = $("#selSevAct option:selected").val();

	$("#evaactniv" + detalleIpercDetailId).html(
			"<h5><strong>" + obtenerNivelRiesgo(idSelProb, idSelSev)
					+ "</strong></h5>");

	$("#evaactniv" + detalleIpercDetailId).css({
		"background-color" : obtenerColorRiesgo(idSelProb, idSelSev),
		"color" : "black"
	});

	
	
	
}

function actualizarNivelRiesgoProy() {
	var idSelProb = $("#selProbProy option:selected").val();
	var idSelSev = $("#selSevProy option:selected").val();
	$("#evaproyniv" + detalleIpercDetailId).html(
			"<h5><strong>" + obtenerNivelRiesgo(idSelProb, idSelSev)
					+ "</strong></h5>");

	$("#evaproyniv" + detalleIpercDetailId).css({
		"background-color" : obtenerColorRiesgo(idSelProb, idSelSev),
		"color" : "black"
	});

}

function obtenerNivelRiesgo(pprobabilidadId, pseveridadId) {

	for (i = 0; i < listNivelRiesgo.length; i++) {

		if (listNivelRiesgo[i].probabilidadId == pprobabilidadId
				&& listNivelRiesgo[i].severidadId == pseveridadId) {

			return listNivelRiesgo[i].nivelRiesgoNombre;
		}
	}

}

function obtenerColorRiesgo(pprobabilidadId, pseveridadId) {

	for (i = 0; i < listNivelRiesgo.length; i++) {

		if (listNivelRiesgo[i].probabilidadId == pprobabilidadId
				&& listNivelRiesgo[i].severidadId == pseveridadId) {

			return listNivelRiesgo[i].nivelRiesgoInfo;
		}
	}

}

function implementarAutocompletar(data) {
	switch (data.CODE_RESPONSE) {
	case "05": 
		
		listFullConsecuencias=data.list;
		var consecuencias = listarStringsDesdeArrayY(listFullConsecuencias,"consecuenciaNombre","clasificacionId",clasiId);
		var controlIniciales = data.listControl; 
		controlIniciales=[];
		var ided = "_" + detalleIpercDetailId;
		/** *********************consecuencias1************************** */
		if (ipercEdicionObj.indicadorConsecuencia == 1) {
			var cons1 = $("#cons1" + detalleIpercDetailId).text();
			cons1 = ided.lastIndexOf("copy") == -1 ? cons1 : "";
			$("#cons1" + detalleIpercDetailId)
					.html(
							"<input type='text' id='inputCons1' class='form-control' placeholder='Consecuencia'   value='"
									+ cons1 + "'>");
			$("#inputCons1").autocomplete({
				source : consecuencias,
				minLength : 0
			}).focus(function() {
		$(this).autocomplete('search', '');
	});

		} else if (ipercEdicionObj.indicadorConsecuencia == 2) {
			var cons1 = $("#cons1" + detalleIpercDetailId).text();
			cons1 = ided.lastIndexOf("copy") == -1 ? cons1 : "";
			$("#cons1" + detalleIpercDetailId)
					.html(
							"<input type='text' id='inputCons1' class='form-control' placeholder='Consecuencia'   value='"
									+ cons1 + "'>");
			$("#inputCons1").autocomplete({
				source : consecuencias,
				minLength : 0
			}).focus(function() {
		$(this).autocomplete('search', '');
	});
			/** *********************consecuencias2************************** */
			var cons2 = $("#cons2" + detalleIpercDetailId).text();
			cons2 = ided.lastIndexOf("copy") == -1 ? cons2 : "";
			$("#cons2" + detalleIpercDetailId)
					.html(
							"<input type='text' id='inputCons2' class='form-control' placeholder='Consecuencia'   value='"
									+ cons2 + "'>");
			$("#inputCons2").autocomplete({
				source : consecuencias,
				minLength : 0
			}).focus(function() {
		$(this).autocomplete('search', '');
	});
			/** *********************consecuencias3************************** */
			var cons3 = $("#cons3" + detalleIpercDetailId).text();
			cons3 = ided.lastIndexOf("copy") == -1 ? cons3 : "";
			$("#cons3" + detalleIpercDetailId)
					.html(
							"<input type='text' id='inputCons3' class='form-control' placeholder='Consecuencia'   value='"
									+ cons3 + "'>");
			$("#inputCons3").autocomplete({
				source : consecuencias,
				minLength : 0
			}).focus(function() {
		$(this).autocomplete('search', '');
	});

		}

		/** *********************************************** */
		var listaPels = JSON.parse(sessionStorage.getItem("peligros"));

		var pel = $("#pel" + detalleIpercDetailId).text();
		pel = ided.lastIndexOf("copy") == -1 ? pel : "";
		$("#pel" + detalleIpercDetailId)
				.html(
						"<input type='text' id='inputPeligro' class='form-control' placeholder='Peligro'   value='"
								+ pel + "' >");
		$("#inputPeligro").autocomplete(
				{
					source : listarStringsDesdeArray(listaPels[clasiId],
							"peligroName"),
					minLength : 0
				}).focus(function() {
			$(this).autocomplete('search', '');
		});
		/** *********************************************** */
		var listaRiesgos = JSON.parse(sessionStorage.getItem("riesgos"));

		var riesgo = $("#riesgo" + detalleIpercDetailId).text();
		riesgo = ided.lastIndexOf("copy") == -1 ? riesgo : "";
		$("#riesgo" + detalleIpercDetailId)
				.html(
						"<input type='text' id='inputRiesgo' class='form-control' placeholder='Riesgo'   value='"
								+ riesgo + "'>");
		$("#inputRiesgo").autocomplete(
				{
					source : listarStringsDesdeArray(listaRiesgos[clasiId],
							"riesgoName"),
					minLength : 0
				}).focus(function() {
			$(this).autocomplete('search', '');
		});
		/** *********************controlinicial1************************** */
		var cons1 = $("#ctrlini1" + detalleIpercDetailId).text();
		cons1 = ided.lastIndexOf("copy") == -1 ? cons1 : "";
		$("#ctrlini1" + detalleIpercDetailId)
				.html(
						"<textarea  id='inputCtrlIni1' class='form-control' placeholder='Control' style='resize:none' ></textarea>");
		$("#inputCtrlIni1").autocomplete({
			source : controlIniciales
		});
		/** *********************controlinicial2************************** */
		var cons2 = $("#ctrlini2" + detalleIpercDetailId).text();
		cons2 = ided.lastIndexOf("copy") == -1 ? cons2 : "";
		$("#ctrlini2" + detalleIpercDetailId)
				.html(
						"<textarea  id='inputCtrlIni2' class='form-control' placeholder='Control' style='resize:none'></textarea>");
		$("#inputCtrlIni2").autocomplete({
			source : controlIniciales
		});
		/** *********************controlinicial3************************** */
		var cons3 = $("#ctrlini3" + detalleIpercDetailId).text();
		cons3 = ided.lastIndexOf("copy") == -1 ? cons3 : "";
		$("#ctrlini3" + detalleIpercDetailId)
				.html(
						"<textarea  id='inputCtrlIni3' class='form-control' placeholder='Control' style='resize:none' ></textarea>");
		$("#inputCtrlIni1").val(cons1);
		$("#inputCtrlIni2").val(cons2);
		$("#inputCtrlIni3").val(cons3);
		$("#inputCtrlIni3").autocomplete({
			source : controlIniciales
		});
		//En caso de 4x4P
		if(parseInt(ipercEdicionObj.matrizRiesgoId)==6){
			verAcordeClasificacionDetalle();
		}
		// inicializarAutocompletar();
		break;
	default:
		alert("Ocurrió un error al traer las consecuencias!");
	}
}

function guardarDetalleIperc() {

	var campoVacio = true;
	var eficaz = $("#inputEficaz").val();
	var isRiskyActAux = pasarBoolNumber($("#riskAct").prop("checked"));
	var isRiskyFutAux = pasarBoolNumber($("#riskProy").prop("checked"));

	var txtPel = $("#inputPeligro").val();
	var despel = $("#inputDesPel").val();
	var idclas = $("#selClasi option:selected").val();
	var txtRiesgo = $("#inputRiesgo").val();
	var txtlug = $("#inputLugar").val();
	var rutina=$("#selTipoRutinaIper").val();
var sensibilidad=$("#inputSensibilidad").val();
	var idprob = ipercEdicionObj.flagEvaluacionInicial ? $("#selProb option:selected").val() : null;
	var idsev = ipercEdicionObj.flagEvaluacionInicial ? $("#selSev option:selected").val() : null;
	var txtniv = ipercEdicionObj.flagEvaluacionInicial ? $("#evaininiv" + detalleIpercDetailId).text()
			: null;

	var idprobact = $("#selProbAct option:selected").val();
	var idsevact = $("#selSevAct option:selected").val();
	var txtnivact = $("#evaactniv" + detalleIpercDetailId).text();

	var idprobproy = $("#selProbProy option:selected").val();
	var idsevproy = $("#selSevProy option:selected").val();
	var txtnivproy = $("#evaproyniv" + detalleIpercDetailId).text();

	var txtcons1 = ipercEdicionObj.indicadorConsecuencia == 1 || ipercEdicionObj.indicadorConsecuencia == 2 ? $("#inputCons1")
			.val() : null;
	var txtcons2 = ipercEdicionObj.indicadorConsecuencia == 2 ? $("#inputCons2").val() : null;
	var txtcons3 = ipercEdicionObj.indicadorConsecuencia == 2 ? $("#inputCons3").val() : null;
	
	var txtctrli1 = $("#inputCtrlIni1").val();
	var txtctrli2 = $("#inputCtrlIni2").val();
	var txtctrli3 = $("#inputCtrlIni3").val();
	
	var selAlcanceDetalle=$("#selAlcanceDetalle").val();
	var causa=$("#inputCausaDetalle").val();
	var tipoContactoId = $("#selTipoContactoDetalle").val();
	var requisitoLegal=$("#inputReqLegalDetalle").val();
if(ipercEdicionObj.flagProbabilidadEspecifica==1){
	
	if (ipercEdicionObj.flagEvaluacionInicial==1 && parseInt(getSession("gestopcompanyid")) != 366) {
		var auxIdPersExp=$("#selPerExp").val().split('-');
		var auxIdCapa=$("#selIndCapa").val().split('-');
		var auxIdIndRisk=$("#selIndRisk").val().split('-');
		var auxIdIndProc=$("#selIndProc").val().split('-');
		
		
		
		var idPersExp=auxIdPersExp[0];
		var idCapa=auxIdCapa[0];
		var idIndRisk=auxIdIndRisk[0];
		var idIndProc=auxIdIndProc[0];
	}
	
	
	
	
	
	var auxIdPerExpAct=$("#selPerExpAct").val().split('-');
	var auxIdIndCapaAct=$("#selIndCapaAct").val().split('-');
	var auxIdIndRiskAct=$("#selIndRiskAct").val().split('-');
	var auxIdIndProcAct=$("#selIndProcAct").val().split('-');
	var idPersExpFut=1;
	var idCapaFut=1;
	var idIndRiskFut=1;
	var idIndProcFut=1;
 
	if($("#selPerExpFut").length > 0){
		var auxIdPersExpFut=$("#selPerExpFut").val().split('-');
		var auxIdCapaFut=$("#selIndCapaFut").val().split('-');
		var auxIdIndRiskFut=$("#selIndRiskFut").val().split('-');
		var auxIdIndProcFut=$("#selIndProcFut").val().split('-');
		
		idPersExpFut=auxIdPersExpFut[0];
		 idCapaFut=auxIdCapaFut[0];
		 idIndRiskFut=auxIdIndRiskFut[0];
		 idIndProcFut=auxIdIndProcFut[0];
		

	}
	
	
	var idPerExpAct=auxIdPerExpAct[0];
	var idIndCapaAct=auxIdIndCapaAct[0];
	var idIndRiskAct=auxIdIndRiskAct[0];
	var idIndProcAct=auxIdIndProcAct[0];

	
	
}
var frecPelId;
	if(ipercEdicionObj.flagEvaluacionFrecuencia==1){
		if (ipercEdicionObj.flagEvaluacionInicial==1) {
			var auxFrecPelId=$("#selFrecPelPuro").val().split('-');
			
			var auxProbEspeId=$("#selProbEspePuro").val().split('-');
			var auxSevEspeId=$("#selSevEspePuro").val().split('-');
			
		 frecPelId=parseInt(auxFrecPelId[0]);
		 idprob =parseInt(auxProbEspeId[0]);
		 idsev=parseInt(auxSevEspeId[0]);
		}
		
		var auxFecPelActId=$("#selFrecPelAct").val().split('-');
		var auxFrecPelFutId=$("#selFrecPelFut").val().split('-');
		
		
		var frecPelActId=parseInt(auxFecPelActId[0]);
		var frecPelFutId=parseInt(auxFrecPelFutId[0]);
		
		
		var auxProbEspeActId=$("#selProbEspeAct").val().split('-');
		var auxProbEspeFutId=$("#selProbEspeFut").val().split('-');
		
		
		var auxSevEspeActId=$("#selSevEspeAct").val().split('-');
		var auxSevEspeFutId=$("#selSevEspeFut").val().split('-');
		
		
		idprobact=auxProbEspeActId[0],
		 idsevact=auxSevEspeActId[0],
		 idprobproy=auxProbEspeFutId[0],
		 idsevproy=auxSevEspeFutId[0]


	
		
	}

	if (txtPel.length == 0  || idclas == '-1'
			|| txtlug.length == 0) {
		campoVacio = false;
	}

	var idDuplicado = "_" + detalleIpercDetailId;
	var n = idDuplicado.lastIndexOf("copy");console.log(idDuplicado);
	if (n!=-1) {
		detalleIpercDetailId = 0;
		console.log(detalleIpercDetailId);
		nuevoDupIpercAutomatico=false;
	}
	var clasificacionDetalle=null;
	if(parseInt(ipercEdicionObj.matrizRiesgoId)==6){
		clasificacionDetalle=$("#selClasificacionDetalle").val();
	}
	if (campoVacio) {
	
		var dataParam = {
			ipercDetailId : detalleIpercId,clasificacionP:{id:clasificacionDetalle},
			tipoContacto: {id : tipoContactoId},
			alcance:{id:selAlcanceDetalle},
			causa:causa,rutina:{id:rutina},
			requisitoLegal:requisitoLegal,
			
			ipercDetailEvalID : detalleIpercDetailId,
			descripcionLugar : txtlug,
			descripcionPeligro : despel,
			sensibilidad:sensibilidad,
			peligroName : txtPel,
			idClasificacion : idclas,
			riesgoName : txtRiesgo,
			consecuencia1 : txtcons1,
			consecuencia2 : txtcons2,
			consecuencia3 : txtcons3,
			probabilidadId : idprob,
			severidadId : idsev,
			controlInicial1 : txtctrli1,
			controlInicial2 : txtctrli2,
			controlInicial3 : txtctrli3,
			probabilidadActId : idprobact,
			severidadActId : idsevact,
			probabilidadProyId : idprobproy,
			severidadProyId : idsevproy,
			eficaz : eficaz,
			ipercDetailEvalRiskAct : isRiskyActAux,
			ipercDetailEvalRiskProy : isRiskyFutAux,
			probPersonas	:idPersExp,
			probCapacitacion: idCapa,
			probExpoRiesgo: idIndRisk,
		probProcedimiento: idIndProc,
		
		probPersonasAct: idPerExpAct,
		probCapacitacionAct: idIndCapaAct,
		probExpoRiesgoAct: idIndRiskAct,
		probProcedimientoAct: idIndProcAct,
		
		probPersonasFut: idPersExpFut,
		probCapacitacionFut: idCapaFut,
		probExpoRiesgoFut: idIndRiskFut,
		probProcedimientoFut: idIndProcFut,
		
		frecuenciaPeligroPuraId:frecPelId,
		frecuenciaPeligroActId:frecPelActId,
		frecuenciaPeligroFutId:frecPelFutId,
		
		nivelRiesgoProyId:idRiesgoFutEspecial,
		nivelRiesgoActId:idRiesgoActEspecial,
		nivelRiesgoId:idRiesgoEspecial
		};

		callAjaxPost(URL + '/iperc/detail/save', dataParam,
				procesarGuardarIpercDetalle,null,null,null,null,false);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarIpercDetalle(data) {
	switch (data.CODE_RESPONSE) {
	case "05":

		var dataAux= {CODE_RESPONSE : "05"};
		var detallesFullIpercAux = [];
		dataAux.mapRiesgo = mapRiesgo;
		dataAux.listAlcance = listAlcanceDetalle;
		dataAux.listClasificacion = listClasificacionDetalle;
		dataAux.tiposContacto = listFullTipoContactoDetalle;
		dataAux.listRutina = listTipoRutina;
		dataAux.sugeridoEvaluacion = listSugeridoEvaluacionIperc;
		dataAux.categoriaProbabilidad = listCategoriaProbabilidadEspecifica;
		dataAux.categoriaConsecuencia = listCategoriaConsecuenciaEspecifica;
		
		dataAux.listaPersonaExpuesta = listaPersonaExpuesta;
		dataAux.listaIndCapa = listaIndCapa;
		dataAux.listaIndRisk = listaIndRisk;
		dataAux.listaIndProc = listaIndProc;
		if (nuevoDupIpercAutomatico) {
			duplicarIperc();
		} else {
			var seEncontro = false;
			detallesFullIperc.forEach(function(val){
				if(val.ipercDetailEvalID == data.nuevoObj.ipercDetailEvalID){
					detallesFullIpercAux.push(data.nuevoObj);
					seEncontro = true;
				}else{
					detallesFullIpercAux.push(val);
				}
			});
			if(!seEncontro){
				detallesFullIpercAux = [];
				var maxIndex = 0;
				detallesFullIperc.forEach(function(val,index){
					if(val.ipercDetailId == data.nuevoObj.ipercDetailId){
						maxIndex = index 
					}
				});
				detallesFullIperc.forEach(function(val,index){
					detallesFullIpercAux.push(val);
					if(index == maxIndex){
						detallesFullIpercAux.push(data.nuevoObj);
					}
				});
			}
			dataAux.list = detallesFullIpercAux;
			
			
			procesarListarTablaDetalleIperc(dataAux);
			 
		}

		break;
	default:
		alert("Ocurrió un error al guardar la evaluacion!");
	}
}

function cancelarDetalleIperc() {
	autoFocusPeligro = false;
	autoFocusRiesgo = false;
	autoFocusConsecuencia = false;
	nuevoDupIpercAutomatico = false;
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
	var dataAux= {CODE_RESPONSE : "05"};
	dataAux.list = detallesFullIperc;
	dataAux.mapRiesgo = mapRiesgo;
	dataAux.listAlcance = listAlcanceDetalle;
	dataAux.listClasificacion = listClasificacionDetalle;
	dataAux.tiposContacto = listFullTipoContactoDetalle;
	dataAux.listRutina = listTipoRutina;
	dataAux.sugeridoEvaluacion = listSugeridoEvaluacionIperc;
	dataAux.categoriaProbabilidad = listCategoriaProbabilidadEspecifica;
	dataAux.categoriaConsecuencia = listCategoriaConsecuenciaEspecifica;
	
	dataAux.listaPersonaExpuesta = listaPersonaExpuesta;
	dataAux.listaIndCapa = listaIndCapa;
	dataAux.listaIndRisk = listaIndRisk;
	dataAux.listaIndProc = listaIndProc;
	
	
	procesarListarTablaDetalleIperc(dataAux);
	
	banderaEdicion = false;
}

function cargarComboPeligroRiesgo() {
	var listaPels = JSON.parse(sessionStorage.getItem("peligros"));
	var idSelClasif = $("#selClasi option:selected").val();
	var ided = "_" + detalleIpercDetailId;
	
	$("#inputPeligro").autocomplete(
			{
				source : listarStringsDesdeArray(listaPels[idSelClasif],
						"peligroName"),
				minLength : 0
			});
	/** ******************************************************** */
	var listaRiesgos = JSON.parse(sessionStorage.getItem("riesgos"));
	$("#inputRiesgo").autocomplete(
			{
				source : listarStringsDesdeArray(listaRiesgos[idSelClasif],
						"riesgoName"),
				minLength : 0
			});
	/***consecuencais**************/
	var consecuencias=listarStringsDesdeArrayY(listFullConsecuencias,"consecuenciaNombre","clasificacionId",idSelClasif);
	
	if (ipercEdicionObj.indicadorConsecuencia == 1) {
	
		$("#inputCons1").autocomplete({
			source : consecuencias,
			minLength : 0
		})

	} else if (ipercEdicionObj.indicadorConsecuencia == 2) {
		var cons1 = $("#cons1" + detalleIpercDetailId).text();
		cons1 = ided.lastIndexOf("copy") == -1 ? cons1 : "";
		$("#cons1" + detalleIpercDetailId)
				.html(
						"<input type='text' id='inputCons1' class='form-control' placeholder='Consecuencia' style='width:280px;' value='"
								+ cons1 + "'>");
		$("#inputCons1").autocomplete({
			source : consecuencias,
			minLength : 0
		}).focus(function() {
	$(this).autocomplete('search', '');
});
		/** *********************consecuencias2************************** */
		var cons2 = $("#cons2" + detalleIpercDetailId).text();
		cons2 = ided.lastIndexOf("copy") == -1 ? cons2 : "";
		$("#cons2" + detalleIpercDetailId)
				.html(
						"<input type='text' id='inputCons2' class='form-control' placeholder='Consecuencia' style='width:280px;' value='"
								+ cons2 + "'>");
		$("#inputCons2").autocomplete({
			source : consecuencias,
			minLength : 0
		}).focus(function() {
	$(this).autocomplete('search', '');
});
		/** *********************consecuencias3************************** */
		var cons3 = $("#cons3" + detalleIpercDetailId).text();
		cons3 = ided.lastIndexOf("copy") == -1 ? cons3 : "";
		$("#cons3" + detalleIpercDetailId)
				.html(
						"<input type='text' id='inputCons3' class='form-control' placeholder='Consecuencia' style='width:280px;' value='"
								+ cons3 + "'>");
		$("#inputCons3").autocomplete({
			source : consecuencias,
			minLength : 0
		}).focus(function() {
	$(this).autocomplete('search', '');
});

	}
	
	
}

function duplicarIperc() {
	$("#tblMatrices").width('3600px');

	var dataAux= {CODE_RESPONSE : "05"};
	dataAux.list = detallesFullIperc;
	dataAux.mapRiesgo = mapRiesgo;
	dataAux.listAlcance = listAlcanceDetalle;
	dataAux.listClasificacion = listClasificacionDetalle;
	dataAux.tiposContacto = listFullTipoContactoDetalle;
	dataAux.listRutina = listTipoRutina;
	dataAux.sugeridoEvaluacion = listSugeridoEvaluacionIperc;
	dataAux.categoriaProbabilidad = listCategoriaProbabilidadEspecifica;
	dataAux.categoriaConsecuencia = listCategoriaConsecuenciaEspecifica;
	
	dataAux.listaPersonaExpuesta = listaPersonaExpuesta;
	dataAux.listaIndCapa = listaIndCapa;
	dataAux.listaIndRisk = listaIndRisk;
	dataAux.listaIndProc = listaIndProc;
	listarLuegoDuplicar(dataAux);
}

function listarLuegoDuplicar(data) {
	procesarListarTablaDetalleIperc(data);
	
	if (nuevoDupIpercAutomatico) {
		detalleIpercDetailId = ipercDetalleEvalIdCopy;
	}
	var $tableBody = $('#tblMatrices').find("tbody"), 
	$trLast = $tableBody.find("#trm" + detalleIpercDetailId), $trNew = $trLast.clone();

	$trNew.find('*').andSelf().filter('[id]').each(function() {
		this.id += 'copy';
	});
	$trNew.removeAttr("onclick");

	$trLast.after($trNew);

	banderaEdicion = false;
	$("#btnEliminar").hide();
	
	editarIpercDetalle(indexAux,true);
	
}

function configurarIperc() {
	var flgEvalIni = 0;
	var flgProbEsp=0;
	var indCons = 0;
	var flagFrecPel=0;
	
	var flagOcultarSignificativo = 0;
	var flagLugarCostado = 0;
	
	var msje = idMatrizRiesgo != $("#selectNR option:selected").val() ? "Al cambiar de tipo de matriz de riesgo, se borrarán los valores de las evaluaciones.¿Esta seguro del cambio?"
			: "¿Está seguro de cambiar la estructura del IPERC?";

	var r = confirm(msje);
	if (r == true) {
		if ($("#chkbCtrl").prop('checked')) {
			flgEvalIni = 1;
		}
		
		if ($("#chckProbEsp").prop('checked')) {
			flgProbEsp = 1;
		}
		if ($("#chckProbEsp").prop('checked')) {
			flgProbEsp = 1;
		}
		if($('#chckFrecPel').prop('checked')){
			flagFrecPel=1;
		}
		if ($("#checkOcultarSignificativo").prop('checked')) {
			flagOcultarSignificativo = 1;
		}
		if($('#checkCostadoLugar').prop('checked')){
			flagLugarCostado=1;
		}
		var dataParam = {
			ipercId : idIPERCEdicion,
			matrizRiesgoId : $("#selectNR option:selected").val(),
			flagEvaluacionInicial : flgEvalIni,
			flagProbabilidadEspecifica : flgProbEsp,
			flagEvaluacionFrecuencia:flagFrecPel,
			
			flagOcultarSignificativo: flagOcultarSignificativo,
			flagLugarCostado: flagLugarCostado,
			
			
			indicadorConsecuencia : $("#selectCons option:selected").val(),
			ipercName : nombreIperc,
			mdfId : idMdfEdicion
		};

		callAjaxPost(URL + '/iperc/conf', dataParam, configurarIpercRespuesta);
	}
}

function configurarIpercRespuesta(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		ipercEdicionObj.matrizRiesgoId = $("#selectNR option:selected").val();
		ipercEdicionObj.indicadorConsecuencia = $("#selectCons option:selected").val();
		
		if ($("#checkOcultarSignificativo").prop('checked')) {
			ipercEdicionObj.flagOcultarSignificativo = 1;
		} else {
			ipercEdicionObj.flagOcultarSignificativo = 0;
		}
		if ($("#checkCostadoLugar").prop('checked')) {
			ipercEdicionObj.flagLugarCostado = 1;
		} else {
			ipercEdicionObj.flagLugarCostado = 0;
		}
		if ($("#chkbCtrl").prop('checked')) {
			idFlagEvalIni = 1;
		} else {
			idFlagEvalIni = 0;
		}
		
		if ($("#chckProbEsp").prop('checked')) {
			idProbEspe = 1;
		} else {
			idProbEspe = 0;
		}

		if ($("#chckFrecPel").prop('checked')) {
			idEvalFrec = 1;
		} else {
			idEvalFrec = 0;
		}
		listarDetalleIperc();
		banderaEdicion = false;
		break;
	default:
		alert("Ocurrió un error al resetear Evaluaciones!");
	
	}
	
}

function eliminarDetalleIperc() {
	var r = confirm("¿Está seguro de eliminar el detalle de IPERC?");
	if (r == true) {
		var dataParam = {
			ipercDetailId : detalleIpercId,
			ipercDetailEvalID : detalleIpercDetailId
		};

		callAjaxPost(URL + '/iperc/detail/delete', dataParam,
				procesarEliminarEvaluacionIperc);
	}
}

function procesarEliminarEvaluacionIperc(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		 
		if(data.mensaje.length>0){
			alert(data.mensaje);
		}
		autoFocusPeligro = false;
		autoFocusRiesgo = false;
		autoFocusConsecuencia = false;
		nuevoDupIpercAutomatico = false;
		$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
		var dataAux= {CODE_RESPONSE : "05"};
		var detallesFullIpercAux =[];
		detallesFullIperc.forEach(function(val){
			if(val.ipercDetailEvalID == detalleIpercDetailId){
				 
			}else{
				detallesFullIpercAux.push(val);
			}
		});
		dataAux.list = detallesFullIpercAux;
		dataAux.mapRiesgo = mapRiesgo;
		dataAux.listAlcance = listAlcanceDetalle;
		dataAux.listClasificacion = listClasificacionDetalle;
		dataAux.tiposContacto = listFullTipoContactoDetalle;
		dataAux.listRutina = listTipoRutina;
		dataAux.sugeridoEvaluacion = listSugeridoEvaluacionIperc;
		dataAux.categoriaProbabilidad = listCategoriaProbabilidadEspecifica;
		dataAux.categoriaConsecuencia = listCategoriaConsecuenciaEspecifica;
		
		dataAux.listaPersonaExpuesta = listaPersonaExpuesta;
		dataAux.listaIndCapa = listaIndCapa;
		dataAux.listaIndRisk = listaIndRisk;
		dataAux.listaIndProc = listaIndProc;
		procesarListarTablaDetalleIperc(dataAux);
		banderaEdicion = false;

		break;
	default:
		alert("Ocurrió un error al guardar la evaluacion!");
	}
}


function actualizarProbabilidaEspecifica(){

	if(idProbEspe==1){
	var auxPuntajePersExp=$("#selPerExp").val().split('-');
	var auxPuntajeCapa=$("#selIndCapa").val().split('-');
	var auxPuntajeIndRisk=$("#selIndRisk").val().split('-');
	var auxPuntajeIndProc=$("#selIndProc").val().split('-');
	
	
	var puntajePersExp=auxPuntajePersExp[1];
	var puntajeCapa=auxPuntajeCapa[1];
	var puntajeIndRisk=auxPuntajeIndRisk[1];
	var puntajeIndProc=auxPuntajeIndProc[1];
	
	var puntajeProbPuro=parseInt(puntajePersExp)+
	parseInt(puntajeCapa)+
	parseInt(puntajeIndRisk)+
	parseInt(puntajeIndProc);
	
	if(puntajeProbPuro<13){
		
		$("#selProb").val("3");
		
		if(puntajeProbPuro<9){
			$("#selProb").val("2");
			
			if(puntajeProbPuro<5){
				$("#selProb").val("1");
			}	
		}
		
	}
	
	actualizarNivelRiesgo();
	
	}
	

}

function actualizarProbabilidaEspecificaAct(){
	var auxPuntajePerExpAct=$("#selPerExpAct").val().split('-');
	var auxPuntajeIndCapaAct=$("#selIndCapaAct").val().split('-');
	var auxPuntajeIndRiskAct=$("#selIndRiskAct").val().split('-');
	var auxPuntajeIndProcAct=$("#selIndProcAct").val().split('-');
	
	
	var puntajePerExpAct=auxPuntajePerExpAct[1];
	var puntajeIndCapaAct=auxPuntajeIndCapaAct[1];
	var puntajeIndRiskAct=auxPuntajeIndRiskAct[1];
	var puntajeIndProcAct=auxPuntajeIndProcAct[1];

	
	var puntajeProbAct=parseInt(puntajePerExpAct)+
	parseInt(puntajeIndCapaAct)+
	parseInt(puntajeIndRiskAct)+
	parseInt(puntajeIndProcAct);
	var selectProbAct = crearSelectOneMenu("selProbAct","", 
			listProbabilidad,"" ,"probabilidadId", "probabilidadNombre");
	$("#evaactprobsuma"+detalleIpercDetailId).html(""+puntajeProbAct+selectProbAct);
	$("#evaactprobsuma"+detalleIpercDetailId+" select").hide();
	
	if(puntajeProbAct<13){
			$("#selProbAct").val("3");
			if(puntajeProbAct<9){
				$("#selProbAct").val("2");
				if(puntajeProbAct<5){
					$("#selProbAct").val("1");
				}	
			}
	}
 actualizarNivelRiesgoAct() ;
}

function actualizarProbabilidaEspecificaFut(){

	
	
	var auxPuntajePersExpFut=$("#selPerExpFut").val().split('-');
	var auxPuntajeCapaFut=$("#selIndCapaFut").val().split('-');
	var auxPuntajeIndRiskFut=$("#selIndRiskFut").val().split('-');
	var auxPuntajeIndProcFut=$("#selIndProcFut").val().split('-');
	
	

	
	var puntajePersExpFut=auxPuntajePersExpFut[1];
	var puntajeCapaFut=auxPuntajeCapaFut[1];
	var puntajeIndRiskFut=auxPuntajeIndRiskFut[1];
	var puntajeIndProcFut=auxPuntajeIndProcFut[1];
	
	
	
	
	var puntajeProbFut=parseInt(puntajePersExpFut)+
	parseInt(puntajeCapaFut)+
	parseInt(puntajeIndRiskFut)+
	parseInt(puntajeIndProcFut);


if(puntajeProbFut<13){
	
	$("#selProbProy").val("3");
	
	if(puntajeProbFut<9){
		$("#selProbProy").val("2");
		
		if(puntajeProbFut<5){
			$("#selProbProy").val("1");
		}	
	}
	
}

 actualizarNivelRiesgoProy();

}

function actualizarNivelRiesgoFrec(){
	var auxFrecPelId=null;
	auxFrecPelId=$("#selFrecPelPuro").val().split('-');
	var frecPelPuntaje=auxFrecPelId[1];
	
	var auxSevEspeId=$("#selSevEspePuro").val().split('-');
	var auxProbEspeId=$("#selProbEspePuro").val().split('-');

	var sevPuntaje=auxSevEspeId[1];
	var probPuntaje=auxProbEspeId[1];
	
	var puntajeTotal=parseFloat(frecPelPuntaje)*
	parseFloat(sevPuntaje)*
	parseFloat(probPuntaje);
	var nombreRiesgo="";
	var colorRiesgo="";
	 idRiesgoEspecial="";
	if(puntajeTotal>400){
		idRiesgoEspecial=31;
		nombreRiesgo="Muy Alto";
		colorRiesgo="#FF0000";
		
	}else{
		
		if(puntajeTotal>200){
			idRiesgoEspecial=30;
			nombreRiesgo="Alto";
			colorRiesgo="#FF4000";
		}else{
			if(puntajeTotal>70){
				idRiesgoEspecial=29;
				nombreRiesgo="Importante";
				colorRiesgo="#80FF00";
			}else{
				idRiesgoEspecial=28;
				nombreRiesgo="Posible";
				colorRiesgo="#088A08";
			}
		}
	}
	if($("#selFrecPelPuro").val()==-1 ||
			$("#selSevEspePuro").val()==-1||
			$("#selProbEspePuro").val()==-1){
		
		idRiesgoEspecial=null;
		$("#evaininiv" + detalleIpercDetailId).html(
				"<h5><strong>" + ""
						+ "</strong></h5>");

		$("#evaininiv" + detalleIpercDetailId).css({
			"background-color" : "white",
			"color" : "black"
		});
		
	}else{
		
		$("#evaininiv" + detalleIpercDetailId).html(
				"<h5><strong>" + nombreRiesgo
						+ "</strong></h5>");

		$("#evaininiv" + detalleIpercDetailId).css({
			"background-color" : colorRiesgo,
			"color" : "black"
		});
	}
		
}
function actualizarNivelRiesgoFrecAct(){
	var auxFecPelActId=$("#selFrecPelAct").val().split('-');
	var auxProbEspeActId=$("#selProbEspeAct").val().split('-');
	var auxSevEspeActId=$("#selSevEspeAct").val().split('-');
	
	var frecPelActPuntaje=auxFecPelActId[1];
	var sevPuntajeAct=auxSevEspeActId[1];
	var probPuntajeAct=auxProbEspeActId[1];
	
	var puntajeTotal=parseFloat(frecPelActPuntaje)*parseFloat(sevPuntajeAct)*parseFloat(probPuntajeAct);
	var nombreRiesgo="";
	var colorRiesgo="";
	 idRiesgoActEspecial="";
	if(puntajeTotal>400){
		idRiesgoActEspecial=31;
		nombreRiesgo="Muy Alto";
		colorRiesgo="#FF0000";
		
	}else{
		
		if(puntajeTotal>200){
			idRiesgoActEspecial=30;
			nombreRiesgo="Alto";
			colorRiesgo="#FF4000";
		}else{
			if(puntajeTotal>70){
				idRiesgoActEspecial=29;
				nombreRiesgo="Importante";
				colorRiesgo="#80FF00";
			}else{
				idRiesgoActEspecial=28;
				nombreRiesgo="Posible";
				colorRiesgo="#088A08";
			}
		}
	}
	if($("#selProbEspeAct").val()==-1 ||
			$("#selSevEspeAct").val()==-1||
			$("#selFrecPelAct").val()==-1){
		idRiesgoActEspecial=null;
		$("#evaactniv" + detalleIpercDetailId).html(
				"<h5><strong>" + ""
						+ "</strong></h5>");

		$("#evaactniv" + detalleIpercDetailId).css({
			"background-color" : "white",
			"color" : "black"
		});
		
	}else{
		$("#evaactniv" + detalleIpercDetailId).html(
				"<h5><strong>" + nombreRiesgo
						+ "</strong></h5>");

		$("#evaactniv" + detalleIpercDetailId).css({
			"background-color" : colorRiesgo,
			"color" : "black"
		});
	}
	
}
function actualizarNivelRiesgoFrecFut(){


	var auxFrecPelFutId=$("#selFrecPelFut").val().split('-');
	var auxSevEspeFutId=$("#selSevEspeFut").val().split('-');
	var auxProbEspeFutId=$("#selProbEspeFut").val().split('-');

	var frecPelFutPuntaje=auxFrecPelFutId[1];
	var sevPuntajeFut=auxSevEspeFutId[1];
	var probPuntajeFut=auxProbEspeFutId[1];
	
	var puntajeTotal=parseFloat(frecPelFutPuntaje)*parseFloat(sevPuntajeFut)*parseFloat(probPuntajeFut);
	var nombreRiesgo="";
	var colorRiesgo="";
	 idRiesgoFutEspecial=null;
	if(puntajeTotal>400){
		idRiesgoFutEspecial=31;
		nombreRiesgo="Muy Alto";
		colorRiesgo="#FF0000";
		
	}else{
		
		if(puntajeTotal>200){
			idRiesgoFutEspecial=30;
			nombreRiesgo="Alto";
			colorRiesgo="#FF4000";
		}else{
			if(puntajeTotal>70){
				idRiesgoFutEspecial=29;
				nombreRiesgo="Importante";
				colorRiesgo="#80FF00";
			}else{
				idRiesgoFutEspecial=28;
				nombreRiesgo="Posible";
				colorRiesgo="#088A08";
			}
		}
	}
	
	if($("#selFrecPelFut").val()==-1 ||
			$("#selProbEspeFut").val()==-1||
			$("#selSevEspeFut").val()==-1){
		idRiesgoFutEspecial=null;
		$("#evaproyniv" + detalleIpercDetailId).html(
				"<h5><strong>" +""
						+ "</strong></h5>");

		$("#evaproyniv" + detalleIpercDetailId).css({
			"background-color" : "white",
			"color" : "black"
		});
		
	}else{
		
		$("#evaproyniv" + detalleIpercDetailId).html(
				"<h5><strong>" + nombreRiesgo
						+ "</strong></h5>");

		$("#evaproyniv" + detalleIpercDetailId).css({
			"background-color" : colorRiesgo,
			"color" : "black"
		});
	}
	
	
}
function iniciarCarrusel(numImagenes,numSimultaneas){
	var numeroImatges = numImagenes;
	var posicion=0;
	var numImagensSimultaneo=numSimultaneas;
	   if(numeroImatges<=numImagensSimultaneo){
	       $('.derecha_flecha').css('display','none');
	    $('.izquierda_flecha').css('display','none');
	   }

	     $('.izquierda_flecha').on('click',function(){
	         if(posicion>0){
	            posicion = posicion-1;
	        }else{
	            posicion = numeroImatges-numImagensSimultaneo;
	        }
	        $(".carrusel").animate({"left": -($('#product_'+posicion).position().left)}, 600);
	        return false;
	     });

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

	     $('.derecha_flecha').on('click',function(){
	        if(numeroImatges>posicion+numImagensSimultaneo){
	            posicion = posicion+1;
	        }else{
	            posicion = 0;
	        }
	        $(".carrusel").animate({"left": -($('#product_'+posicion).position().left)}, 600);
	        return false;
	     });

	 
}
function verAyudaIPERC(parametroId){
	
	var textoPrueba='<div id="carrusel">'
	 +'   <a href="#" class="izquierda_flecha"><img src="../imagenes/flecha_01.png" /></a>'
	 +'   <a href="#" class="derecha_flecha"><img src="../imagenes/flecha_02.png" /></a>'
	 +' <div class="carrusel">'
	
		+'</div>'
+'	</div>';
	$("#exampleModal").modal("hide");
	$("#modalAyudaIperc").modal('show');
	var tipoMatriz=$("#selectNR").val();
	$("#modalAyudaIperc .modal-content").css({height:"190px",width:"500px"});
	var carruselImg=[];
	var carruselAux1=[];
	var carruselAux2=[];
	var carruselAux3=[];
	var carruselAux4=[];
	var carruselAux5=[];
	carruselAux1={
			imagenUrl:"../imagenes/logo3.png",
			textoDescriptivo:"-----",
			tituloImagen:"Grafico Sin Agregar"
	};
		carruselAux2={
				imagenUrl:"../imagenes/logo3.png",
				textoDescriptivo:"----",
				tituloImagen:"Grafico Sin Agregar 2"
		};
		carruselAux3={
				imagenUrl:"../imagenes/logo4.png",
				textoDescriptivo:"----",
				tituloImagen:"Grafico Sin Agregar 24"
		};
		carruselAux4={
				imagenUrl:"../imagenes/logo3.png",
				textoDescriptivo:"----",
				tituloImagen:"Grafico Sin Agregar P"
		};
	switch(parseInt(tipoMatriz)){
	case 1:
		carruselAux1={
			imagenUrl:"../imagenes/matriz3x3.png",
			tituloImagen:"Matriz 3x3",
			textoDescriptivo:"Relación entre Provabilidad y Severidad"
	};
		carruselAux2={
				imagenUrl:"../imagenes/descirp3x3.png",
				tituloImagen:"Detalle de Nivel de Riesgo",
				textoDescriptivo:"Significada de cada Nivel de riesgo"
		};
		carruselAux3={
				imagenUrl:"../imagenes/ConsecuenciaMet2.png",
				textoDescriptivo:"----",
				tituloImagen:"Descripcion de Consecuencias"
		};
		carruselAux4={
				imagenUrl:"../imagenes/expMet2.png",
				textoDescriptivo:"----",
				tituloImagen:"Exposición al riesgo"
		};
		carruselAux5={
				imagenUrl:"../imagenes/met2Prob.png",
				textoDescriptivo:"----",
				tituloImagen:"Descripción de Probabilidad"
		};
	
		carruselImg.push(carruselAux1,carruselAux2,carruselAux5,carruselAux4,carruselAux3);
		break;
	case 2:
		carruselImg.push(carruselAux1,carruselAux2,carruselAux3,carruselAux4);
		break;
	case 3:
		carruselImg.push(carruselAux1,carruselAux2,carruselAux3,carruselAux4);
		break;
	case 4:
		carruselAux1={
			imagenUrl:"../imagenes/matriz6x5.png",
			tituloImagen:"Matriz 6x5",
			textoDescriptivo:"Relación entre Provabilidad y Severidad"
	};
		carruselImg.push(carruselAux1);
		break;
	case 5:
		carruselImg.push(carruselAux1,carruselAux2,carruselAux3,carruselAux4);
		break;
	}
	
	
	
	var textoAyudaIperc="";
	switch(parametroId){
	case 1: 
		textoAyudaIperc="Utilizado por empresas que desean " +
				"evaluar riesgos o consecuencias sin ningún tipo de control";
		break;
	case 2: 
		textoAyudaIperc="Divide la evaluación de la probabilidad en 4 factores:" +
				"'Personas Expuestas', 'Índice de Riesgo', 'Índice de Capacitacion' y 'Índice de Severidad' " +
				"según la matriz modelo 2 de la RM 050, Ley 29783 (válido sólo para la matriz 3x3";
		break;
	case 3: 
		textoAyudaIperc="Añade el factor frecuencia en cada evaluación, " +
				"seguiendo la lógica de la matriz modelo 3 de la RM 050, Ley 29783 (válido sólo para la matriz 6x6)";
		break;
	case 4: 
		textoAyudaIperc=textoPrueba;
		$("#modalAyudaIperc .modal-content").css({"height":"620px",width:"720px"});
			break;	
			
	}
	$("#modalAyudaIpercBody").html(textoAyudaIperc);
	$("div .carrusel .product").remove();
	for(var i=0;i<carruselImg.length;i++){
		var imagen=carruselImg[i].imagenUrl;
		var descripcion=carruselImg[i].textoDescriptivo;
		var tituloImagen=carruselImg[i].tituloImagen;;
		$("div .carrusel").append(
				'   <div class="product" id="product_'+i+'">'
				+'         <img class="img_carrusel" src="'+imagen+'"  /><h2>'
					+tituloImagen+'</h2><br>        '+descripcion+''
				
					+'  </div>');
		
	}
	
	iniciarCarrusel(carruselImg.length,1);
	
}
function ImportarPuestoMdfIperc()
{
	$("#modalImportPuestoIperc").modal("show");
	//ipercId : idIPERCEdicion,
	//mdfId : ipercEdicionObj.mdfId,
	//matrizRiesgoId : idMatrizRiesgo
	
	var dataParam=
	{
		mdfId : ipercEdicionObj.mdfId,
		ipercId:idIPERCEdicion
	}
	callAjaxPost(URL + '/iperc/puestos', dataParam,
		function (data) 
		{
			switch (data.CODE_RESPONSE) {
			case "05":
				listFullPuestosByUnidad=data.puestos;
				listFullIdsIpercDetalle=data.idsipercDetalle;
				var selPuestosSelec=crearSelectOneMenuOblig("inputPuestosSelec","",listFullPuestosByUnidad,"","puestoId","puestoNombre");
				$("#modalImportPuestoIperc .modal-body").html(
					 
						"<div class='form-group'>"+
							"<button id='btnGuardarNuevasActividades' type='button' onclick='guardarImportPuestActMatrizIperc()'"+
								"class='btn btn-success' title='Guardar' >"+
								"<i class='fa fa-floppy-o fa-2x'></i>"+
							"</button><br><br>"+
							selPuestosSelec+
							"<label for='message-text' class'control-label'>"+
								"Copie aqu&iacute; desde un excel segun el formato: "+
							"</label>"+ 
							"<textarea class='form-control' rows='10'"+
								"id='txtListadoActividades' style='font-size: 11px;'"+
								"maxlength='1000000'"+  
								"placeholder='Actividad - ¿Act. Rutinaria? - Sensibilidad Especial - Lugar - Peligro - Desc. del peligro " +
								"- Riesgo - Causas que ocasionan el riesgo - Consecuencia - Requisito Legal - Contr. de Ingenieria" +
								" - Contr. Administrado - Equipos de Seguridad - Riesgo Significativo - Ind. de Pers Expuestas - " +
								"Ind. de Procedimientos - Ind. de Capacitacion - Ind. Exposicion al Riesgo - Ind. de Severidad'>" +
							"</textarea>"+
						"</div>" 
				);
				 
				break;
			default:
				break;
			}
	
		});
}
function guardarImportPuestActMatrizIperc(){
	estadoImportar=true;
	var textoInicial=$("#txtListadoActividades").val();
	var texto = "";
	var prePreListExcelInicial=textoInicial.split("\t");
	var preListExcelInicial = [];
	prePreListExcelInicial.forEach(function(val,index){
		var textoEspacio = (index != 0 && (index)%18 == 0 ? true:false)
		if(textoEspacio){
			var celdaEspacio = val.split("\n")
			preListExcelInicial.push(celdaEspacio[0]);
			preListExcelInicial.push(celdaEspacio[1]);
		}else{
			preListExcelInicial.push(val);
		}
		
		
	});
	preListExcelInicial.forEach(function(val,index){
		var textoEspacio = (index != 0 && (index+1)%19 == 0 ? "\n":"\t");
		var textoPartido = val.split("\n");
		var textoIngreso = "";
		if(textoPartido.length > 1){
			textoPartido.forEach(function(val1){
				textoIngreso+=val1+" / ";
			})
		}else{
			textoIngreso = textoPartido[0];
		}
		if((index+1) != preListExcelInicial.length){
			texto = texto+ textoIngreso+""+textoEspacio;
		}else{
			textoIngreso = textoPartido[0];
			texto = texto+ textoIngreso;
		}
		 
		
	});
	var listExcelInicial=texto.split("\n");
	var listExcel=[];
	var listAct=[];
	var listActRepe=[];
	var listFullDescripcion="";
	var validado=""; 
	var ipercDetailIdAux=0;
	listExcelInicial.forEach(function(val){
		if(val.length > 0){
			listExcel.push(val);
		}
	});
	if(texto.length<10000000)
	{
		for(var int=0;int<listExcel.length;int++)
		{   
			var listCells=listExcel[int].split("\t");
			var filaTexto=listExcel[int];
			if(filaTexto.trim().length<1)
			{
				validado="Existen filas vacias !.";
				break;
			}
			if(validado.length<1 && listCells.length!=19)
			{
				validado="No coincide el numero de las celdas ->> ("+listCells.length+"!=19)";		
				break;
			}
			else
			{
				var actividad={};
				for(var j=0;j<listCells.length;j++)
				{
					var element=listCells[j];
					switch (j) {
					case 0:
						actividad.descripcion=element.trim();
						var puestoNombre=$("#inputPuestosSelec option:selected").text();
						var idAux=buscarIpercDetailId(puestoNombre,actividad.descripcion);
						if(idAux == 0){
							validado = "No se encontró la actividad :"+actividad.descripcion;
							console.log(puestoNombre)
							console.log(actividad.descripcion)
						}
						actividad.iperDetailId=idAux;
						break; 
					case 1: 
						listTipoRutina.forEach(function(val,index)
						{
							if(val.nombre==element.trim())
							{
								actividad.rutinaria=val.id;
							}
						});
					break;
					case 2: 
						actividad.sensibilidadEspe=element.trim(); 
					break;
					case 3: 
						actividad.lugar=element.trim(); 
					break;
					case 4: 
						actividad.peligro=element.trim(); 
					break;
					case 5: 
						actividad.descrPeligro=element.trim(); 
					break;
					case 6: 
						actividad.riesgo=element.trim(); 
					break;
					case 7: 
						actividad.causaRiesgo=element.trim(); 
					break;
					case 8: 
						actividad.consecuencia=element.trim(); 
					break;
					case 9: 
						actividad.requisitoLegal=element.trim(); 
					break;
					case 10: 
						actividad.controlIng=element.trim(); 
					break;
					case 11: 
						actividad.controlAdmin=element.trim(); 
					break;
					case 12: 
						actividad.equipoSeguridad=element.trim(); 
					break;
					case 13:
						var val;
						if(element.trim()=="Si")
						{
							val=1;
						}
						else if(element.trim()=="No")
						{
							val=0;
						}
						actividad.riesgoSignificativo=val;
					break;
					case 14: 
							listaPersonaExpuesta.forEach(function(val,index)
							{
								if(val.nombreSubProbilidad==element.trim())
								{
									actividad.indPersonasExpues=val.subProbabilidadId;
								}
							});
					break;
					case 15: 
							listaIndProc.forEach(function(val,index)
							{
								if(val.nombreSubProbilidad==element.trim())
								{
									actividad.indProcedimientos=val.subProbabilidadId;
								}
							});
					break;
					case 16: 
							listaIndCapa.forEach(function(val,index)
							{
								if(val.nombreSubProbilidad==element.trim())
								{
									actividad.indCapacitacion=val.subProbabilidadId;
								}
							});
					break;
					case 17: 
							listaIndRisk.forEach(function(val,index)
							{
								if(val.nombreSubProbilidadPuntaje==element.trim())
								{
									actividad.indExposRiesgo=val.subProbabilidadId;
								}
							});
					break;
					case 18:
						actividad.indSeveridad = 0;
						listSeveridad.forEach(function(val,index)
								{
									if(val.severidadNombre.trim()==element.trim())
									{
										actividad.indSeveridad=val.severidadId;
									}
								});
						if(actividad.indSeveridad == 0){
							validado = "Severidad no reconocida :"+element.trim()+" "
						} 
					break;
					default:
						break;
					}
				}
				
				var puntajeProbAct=actividad.indPersonasExpues+actividad.indProcedimientos+actividad.indExposRiesgo+actividad.indExposRiesgo;
				var probabilidadId=0;
				//Error de lógica
				//if(puntajeProbAct<13)
					//{
					//					
					//probabilidadId=3;
					//}
				//else if(puntajeProbAct<9)
					//{
					//probabilidadId=2;
					//}
				//else if(puntajeProbAct<5)
					//	{
					//	probabilidadId=1;
				//}
				if(puntajeProbAct<13)
				 {			
					 probabilidadId=3;
					 if(puntajeProbAct<9)
				 	 {
						 probabilidadId=2;
						 if(puntajeProbAct<5)
						 	{
						 	probabilidadId=1;
					 
						 	}
					 }
				 }
				actividad.probabilidad=probabilidadId;
				actividad.nivelRiesgo=obtenerNivelRiesgoAux(actividad.probabilidad,actividad.indSeveridad);
				if(actividad.nivelRiesgo == 0){
					validado +=("Nivel Riesgo no identificado, revise parámetros fila "+(int+1))
					break;
				}
				listAct.push(actividad);
			}
			
		}  
		
		/*if(listActRepe.length<listExcel.length-1)
		{
			validado="Existen Actividades repetidas. \n"+listFullDescripcion; 
		}*/
	}
	else 
	{
		validado="Ha excedido el 1 000 000 de caracteres para el registro";
	}
	var listFinal=[]; 
	listAct.forEach(function(val,index){
		var dataParam = {
				ipercDetailId : val.iperDetailId,
				clasificacionP:{id:1},
				alcance:{id:3},
				causa:val.causaRiesgo,
				rutina:{id:val.rutinaria},
				requisitoLegal:val.requisitoLegal,
				ipercDetailEvalID : 0,
				descripcionLugar : val.lugar,
				descripcionPeligro : val.descrPeligro,
				sensibilidad:val.sensibilidadEspe,
				peligroName : val.peligro,
				idClasificacion : 1,
				riesgoName : val.riesgo,
				consecuencia1 : val.consecuencia,
				consecuencia2 : "",
				consecuencia3 : "",
				probabilidadId : null,
				severidadId : null,
				controlInicial1 : val.controlAdmin,
				controlInicial2 : val.controlIng,
				controlInicial3 : val.equipoSeguridad,
				probabilidadActId : val.probabilidad,//
				severidadActId : val.indSeveridad,
				probabilidadProyId : null,
				severidadProyId : null,
				eficaz : 0,
				ipercDetailEvalRiskAct : val.riesgoSignificativo,
				ipercDetailEvalRiskProy : null,
				probPersonas	:null,
				probCapacitacion: null,
				probExpoRiesgo: null,
			probProcedimiento: null,
			
			probPersonasAct: val.indPersonasExpues,
			probCapacitacionAct: val.indCapacitacion,
			probExpoRiesgoAct: val.indExposRiesgo,
			probProcedimientoAct: val.indProcedimientos,
			
			probPersonasFut: null,
			probCapacitacionFut: null,
			probExpoRiesgoFut: null,
			probProcedimientoFut: null,
			
			frecuenciaPeligroPuraId:null,
			frecuenciaPeligroActId:null,
			frecuenciaPeligroFutId:null,
			
			nivelRiesgoProyId:null,
			nivelRiesgoActId:val.nivelRiesgo,
			nivelRiesgoId:null
			};
		listFinal.push(dataParam);
	});
	if(validado.length<1)
	{
		var r=confirm("¿Está seguro que desea subir estos "+(listExcel.length)+" elemento(s)");
		if(r)
		{
			var text="";
			

			callAjaxPost(URL + '/iperc/detail/masivo/save', listFinal,
			procesarGuardarIpercDetalleMulti);
		}
	}
	else 
	{
		alert(validado);
	}
}
function procesarGuardarIpercDetalleMulti(data){
	alert("Datos guardados");
	$("#modalImportPuestoIperc").modal("hide")
	listarTablaDetalleIperc();
}
function buscarIpercDetailId(puestoNombre,actividadNombre)
{
	var idIpercDetailAux=0;
	detallesFullIperc.forEach(function(val,index)
	{
		var detalleAux=val.ipercDetailName.split(' - ');
		var actividadAux=detalleAux[4].toUpperCase();
		var puestoAux=detalleAux[3].toUpperCase();
		if(
				(puestoAux.trim()==puestoNombre.trim().toUpperCase() 
						|| puestoAux.replace(/\//g,"-").trim()==puestoNombre.trim().toUpperCase() )
				&& (actividadAux.trim()==actividadNombre.trim().toUpperCase()
						|| actividadAux.replace(/\//g,"-").trim()==actividadNombre.trim().toUpperCase()  ))
		{
			idIpercDetailAux= val.ipercDetailId;			
		}
	});
	return idIpercDetailAux;
}
function obtenerNivelRiesgoAux(pprobabilidadId, pseveridadId) {
	var	nivel=0;
	for (i = 0; i < listNivelRiesgo.length; i++) {

		if (listNivelRiesgo[i].probabilidadId == pprobabilidadId
				&& listNivelRiesgo[i].severidadId == pseveridadId) {

			 nivel=listNivelRiesgo[i].nivelRiesgoId;
		}
	}
	return nivel;
}
function ImportarDivisionMdfIperc(){
	var dataParam=
	{
		mdfId : ipercEdicionObj.mdfId,
		ipercId:ipercEdicionObj.ipercId
	}
	callAjaxPost(URL + '/iperc/divisiones', dataParam,
		function (data){
		var selDivisionImport = crearSelectOneMenuOblig("selDivisionImport", "", data.divisiones,
				"", "divisionId", "divisionName");
		var listItemsForm=[{sugerencia:"",label:"<i class='fa fa-list'></i>"+getSession("gestopdivision"),
				inputForm: selDivisionImport,divContainer:""},
			       			{sugerencia:"",label:"<i class='fa fa-info'></i> Plantilla Excel: ",
			       				inputForm: "<button type='button' onclick='verPlantillaImportDetalles()' class='btn btn-success'><i class='fa fa-download'></i>Descargar</button>",divContainer:""},
			       			{sugerencia:"",label:"<i class='fa fa-info'></i> Achivo Excel: ",inputForm: "",divContainer:"divExcelImport"},
			       			 {sugerencia:" ",label:"",inputForm: "<button class='btn btn-success'  ><i class='fa fa-floppy-o'></i> Guardar</button>",divContainer:""}
			       		];
			       	var text="";
			       	listItemsForm.forEach(function(val,index)
			       	{
			       		text+=obtenerSubPanelModulo(val);
			       	});
			       	var contenido=
			       		"<form id='formImportEvento' class='eventoGeneral' >" +
			       			"<div id='tituloEvento'>" + 
			       				text+
			       			"</div>"+
			       			"</div>" +
			       		"</form>";  
			       	var listPaneles= 
			       		 {id:"divImportEventoColaborador",nombre:"Importar Evaluaciones IPERC",clase : "listaAuxiliar",contenido:contenido}
			       	                  ;
			agregarModalPrincipalColaborador(listPaneles,function(){
				var options=
				{container:"#divExcelImport",
						functionCall:function(){enviarExcelImportDetalles() },
						descargaUrl: "",
						esNuevo:true,
						idAux:"ImportExcel",
						evidenciaNombre:""};
				crearFormEvidenciaCompleta(options);
			});
			$("#formImportEvento").on("submit",function(e){
				e.preventDefault();
				enviarExcelImportDetalles();
			});
		});
	
}
function verPlantillaImportDetalles(){
	window.open(URL+"/iperc/plantilla/division?ipercId=" +ipercEdicionObj.ipercId+"&"+
			"divisionId="+$("#selDivisionImport").val(),"_blank");
}
function enviarExcelImportDetalles(){
	guardarEvidenciaAuto(0,"fileEviImportExcel",
			bitsEvidenciaActoInseguro,
			"/iperc/division/excel/masivo/save",function(data){
	    if(data.mensaje.length > 0){
		alert(data.mensaje);
		return;
	    }else{
		alert("Import completado!");
		 $("#divImportEventoColaborador").modal("hide");
		 listarTablaDetalleIperc();
	    }
		
	},"id",[{id:"trabajadorId",value:getSession("trabajadorGosstId")},
	        {id:"ipercId",value:ipercEdicionObj.ipercId},
	        {id : "divisionId",value:$("#selDivisionImport").val()}]);
}

function obtenerSubPanelModulo(val){
	var estiloDefault="";
	if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
		estiloDefault="    border-top: 1px solid #a5aaae;"
	}
	return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
	   " <label for='colFormLabel' class='col-sm-4 col-form-label'>"+val.label+"</label>"+
	    "<div class='col-sm-8' id='"+val.divContainer+"'>"+
	     " "+val.inputForm+
	     "<small>"+val.sugerencia+" </small>"+
	    "</div>"+
	  "</div>";
}
function agregarModalPrincipalColaborador(modalOptions,functionCallBack,isStatic){
	$(".modal-backdrop").remove();
	$("#"+modalOptions.id).remove();
	$("body").append("<div class='modal' id='"+modalOptions.id+"' role='dialog'>"+
    "<div class='modal-dialog modal-dialog-centered' style='width:100%;    max-width: 650px;'>"+
     
    "<div class='modal-content' >"+
     "<div class='modal-header'>"+
     "   <button type='button' class='close' data-dismiss='modal'>&times;</button>"+
      "  <h4 class='modal-title'>"+modalOptions.nombre+"</h4>"+
      "</div>"+
       
      "<div class='modal-body'>"+
      modalOptions.contenido+
      "</div>"+
    "</div>"+
    
  "</div>"+
  "</div>");
	$("#"+modalOptions.id).on('shown.bs.modal', functionCallBack);
	if(isStatic){
		$('#'+modalOptions.id).modal({
			  keyboard: true,
			  show : true,
			  backdrop : false
			})
	}else{
		$("#"+modalOptions.id).modal("show");
	}
	
	
	 
}