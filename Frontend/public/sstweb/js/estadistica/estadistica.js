var fechaInicio;
var fechaFin;
var tipoBusqueda;
var listaUnidades;
var puestoId;
var unidadId;
var unidadTipoId;
var filtrarPuestos;
var filtrarIperc;
var listAyudaEstadistica;
var contadorTrabForm0=0;
var contadorTrabForm1=0;
var contadorTrabForm2=0;
var contadorTrabForm3=0;
var contadorTrabForm4=0;
var estadisticaId;
var tcampo1, tcampo2, tcampo3;
var tcampo6, tcampo5, tcampo4;
var tcampo7, tcampo8, tcampo9;
var tcampo10, tcampo11, tcampo12;
var tcampo13, tcampo14, tcampo15,tcampo16;

var campo1=[], campo2=[], campo3=[];
var campo6=[], campo5=[], campo4=[];
var campo7=[], campo8=[], campo9=[];
var campo10=[], campo11=[], campo12=[];
var campo13=[], campo14=[], campo15=[],campo16=[]; 



$(document).ready(function() {
	$.blockUI(
			{message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
	cambiarAcordeTipoEstad();
	llamarPuestos();
	insertMenu();
	verParametros();  
 $("#fechaIniciaEst").val(sumaFechaDias(-32,obtenerFechaActual()));
 $("#fechaFinEst").val(obtenerFechaActual());
	var vpw = $(window).width();
	var vph = $(window).height();
	vph = vph - 130+factorMovil 
	$("#"+"estadisticaOpcionesLista").css({
		"height" : vph + "px",
		"overflow-y":"auto",
		"overflow-x": "hidden"
	});
	$("#graficoOpcionesLista").css({
		"height" : vph + "px",
		"overflow-y":"auto",
		"overflow-x": "hidden"
	});
	llamarUnidades();
	$("#parametrosEstadistica").hide();
	$("#agrupEstad").attr("onchange","modificarAcordeAgrupar()");

	
	$("th").css(["text-align","center"],["color","blue"]);
	$("#estadisticaOpcionesLista li").each(function(index){
		$(this).attr("onclick","cambiarAcordeTipoEstad("+(index+1)+")")
	});
	$.unblockUI();
	
	$("#btnClipDetalleAccidente").on("click",function(){
		var text=obtenerDatosTablaEstandarNoFija("tblDetalleAccidentesArea");
		copiarAlPortapapeles(text,"btnClipDetalleAccidente");
		alert("Tabla Copiada");
	});
	$("#btnClipDetalleControl").on("click",function(){
		var text=obtenerDatosTablaEstandarNoFija("tblDetallePlan");
		copiarAlPortapapeles(text,"btnClipDetalleControl");
		alert("Tabla Copiada");
	});
	$("#btnClipDetalleInversion").on("click",function(){
		var text=obtenerDatosTablaEstandarNoFija("tblDetalleInversiones");
		copiarAlPortapapeles(text,"btnClipDetalleInversion");
		alert("Tabla Copiada");
	});
	$("#btnClipDetalleSancion").on("click",function(){
		var text=obtenerDatosTablaEstandarNoFija("tblDetalleSanciones");
		copiarAlPortapapeles(text,"btnClipDetalleSancion");
		alert("Tabla Copiada");
	});
	$("#btnClipDetalleExamen").on("click",function(){
		var text=obtenerDatosTablaEstandarNoFija("tblDetalleExamenesFecha");
		copiarAlPortapapeles(text,"btnClipDetalleExamen");
		alert("Tabla Copiada");
	});
	
   $("#btnReporteEpp").on("click",function(){
      var fechaInicioConsolidado = $("#fechaIniciaEst").val();
      var fechaFinConsolidado = $("#fechaFinEst").val();
	 
      var auxUnidad = null;
      auxUnidad = $("#selUnidad").val().split('-');
      unidadId = parseInt(auxUnidad[0]);
      puestoId = $("#selPuesto").val();
      var divisionId = $("#selDivision").val();
      var areaId = $("#selArea").val();

      consolExcelHallazgosLibresCheckList(sessionStorage.getItem("gestopcompanyid"),fechaInicioConsolidado,
         fechaFinConsolidado,(unidadId > 0?unidadId:0),(puestoId > 0?puestoId:0),(divisionId > 0?divisionId:0),(areaId > 0?areaId:0));
   });
});



function consolExcelHallazgosLibresCheckList(empresaId,fechaInicioConsolidado,fechaFinConsolidado, mdfId, puestoId,divisionId, areaId){

    window.open(URL+"/estadistica/reporte/excel?idCompany="+empresaId
 	  + "&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado+
 	 "&mdfId="+mdfId+"&puestoId="+puestoId+
 	"&divisionId="+divisionId+"&areaId="+areaId
 	        );
 }
////////////Fin6 Reporte de Excel Epp
function llenarEspacioAyudaEstadistica(){
	$("#modalAyudaEstadistica").modal("show");	
	var ayudaEstsadId=parseInt(estadisticaId);
	for(var index=0;index<listAyudaEstadistica.length;index++){
		
		if(listAyudaEstadistica[index].ayudaId==parseInt(estadisticaId)){
			$("#modalAyudaEstadistica .modal-body").html(listAyudaEstadistica[index].textoAyuda);
			
		}
	}
	
}

function verParametros(){
	$("#mdParametrosEstad").modal('show');
	 contadorTrabForm0=0;
	 contadorTrabForm1=0;
	 contadorTrabForm2=0;
	 contadorTrabForm3=0;
	 contadorTrabForm4=0;
}

function cambiarTitulo(nuevo){
	$("#tituloEstad").html(nuevo);
}

function ponerRangoFechas(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	$("#rangoFechas").html("entre "+fechaInicio+" y "+fechaFin);
}
function ponerRangoFechasGraf(){
	fechaInicio= $("#fechaIniciaGraf").val();
	 fechaFin= $("#fechaFinGraf").val();
	$("#rangoFechas").html("entre "+fechaInicio+" y "+fechaFin);
}



function crearTablaEstadística(){
	$("#divFlecha").attr("style","");
	$("#divFlechaFondo").attr("style","");
	
	var tipoEstad=estadisticaId;
	$("#btnClipTabla").off("click");
////////////autor: (AntoniTito6)  Tema:  Reporte de Excel Epp
	//$("#btnReporteEpp").off("click");
////////////Fin6 Reporte de Excel Epp
	$("#rangoFechas").html("");
	$("#estadisticaPanel").hide();
	switch(tipoEstad){
	case 1:
		
		cambiarTitulo("Estadisticas Accidentes")
		llamarColumnas();
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			copiarClipboardTablaAccidente();
		});
		$("#tblEst").show();
		ponerRangoFechas();
		break;
	case 2:
		llamarFormaciones();
		cambiarTitulo("Asistencia a Formaciones");$("#tblCantidadFormacion").show();
		$("#tblFormacion").show();
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var fullDatosTabla="";
			fullDatosTabla=obtenerDatosTablaEstadística("tblFormacion");
			copiarAlPortapapeles(fullDatosTabla);
			alert("Tabla Copiada");
		});
		ponerRangoFechas();
		
		break;
	case 3:
		llamarHorasFormacion();
		cambiarTitulo("Horas de Formaciones")
		ponerRangoFechas();
		$("#tblFormacionNumero").show();
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblFormacionNumero");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		break;
	case 4:
		llamarIndicadorExMedico();
		cambiarTitulo("Trabajadores con Examen M&eacute;dico");
		$("#tblExamMedico").show();
		$("#buscadorExamEstad").show();
		
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblExamMedico");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		break;
	case 5:
		llamarIndicadorEntregaEpp();
		cambiarTitulo("Entrega de EPP´s a trabajadores");

		$("#tblAareaEpp").show();
		$("#tblEntregaEpp").show();
		////
	////////////autor: (AntoniTito6)  Tema:  Reporte de Excel Epp
		$("#btnReporteEpp").show();
		////////////Fin6 Reporte de Excel Epp
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var fullDatosTabla=obtenerDatosTablaEstadística("tblEntregaEpp");
			copiarAlPortapapeles(fullDatosTabla);
			alert("Tabla Copiada");
		});

		

		ponerRangoFechas();
		break;
	case 6:
		llamarPeligrosIperc();
		cambiarTitulo("Peligros Significativos IPERC");
		///////
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblIpercPeligro");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		
		ponerRangoFechas();
		$("#tblIpercPeligro").show();
		break;
	case 7:
		llamarAccArea();
		cambiarTitulo("Accidentes por Area");
		/////
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblAccidentesGeneral");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		ponerRangoFechas();
		$("#tblAccidentesGeneral").show();
		break;
	case 8:
		llamarPresupuestoControles();
		cambiarTitulo("Inversión Controles a Implementa");
		////
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblIpercPeligro");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		$("#tblControlesArea").show();
		ponerRangoFechas();
		break;
	case 9:
		llamarIndicadoresPlanificacion();
		/////
		cambiarTitulo("Controles a Implementar de IPERC")
		ponerRangoFechas();
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblPlanificacionArea");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		$("#tblPlanificacionArea").show();
		break;
	case 10:
		llamarInverionesEmpresa();
		cambiarTitulo("Inversiones de Seguridad")
		ponerRangoFechas();
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblInversionesSeguridad");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		$("#tblInversionesSeguridad").show();
		break;
	case 11:
		llamarReporteSanciones();
		cambiarTitulo("Reporte de Eventos Negativos de Seguridad")
		ponerRangoFechas();
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblReporteSanciones");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		$("#tblReporteSanciones").show();
		break;
	case 12:
		llamarIndicadorDetalleExMedico();
		cambiarTitulo("Vigencia de exámenes");
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblFechaExamenes");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		$("#tblFechaExamenes").show();
		$("#tblDetalleExamenesFecha").show();
		break;
	case 13:
		llamarAccUnidad();
		cambiarTitulo("Accidentes por Unidad");
		/////
		$("#btnClipTabla").show();
		$("#btnClipTabla").on("click", function(e){
			e.preventDefault();
			var text=obtenerDatosTablaEstandarNoFija("tblAccidentesGeneral");
			copiarAlPortapapeles(text);
			alert("Tabla Copiada");
		});
		ponerRangoFechas();
		$("#tblAccidentesGeneral").show();
		break;
		
	}

	

}





function cambiarAcordeTipoEstad(indicadorEstId){
////////////autor: (AntoniTito6)  Tema:  Reporte de Excel Epp
    $("#btnReporteEpp").hide();
////////////Fin6 Reporte de Excel Epp
	$("#btnClipTabla").hide(); 
	var estadisticaIdAux=estadisticaId;
	var widthAux=parseInt($('#estadisticaOpcionesLista li').width()+20, 10);
	 
	if(estadisticaId!=indicadorEstId){
		$('#estadisticaOpcionesLista li').each(function(index,ele){
			$(ele).removeClass("active");
			if(index==indicadorEstId-1){ 
				$(ele).toggleClass("active");
				
			}
		});
		$("#opcionesEstadistica").show("fast",function(){
		
			
		});
		
	}else{
		$('#estadisticaOpcionesLista li').each(function(index,ele){
			$(ele).removeClass("active");
			 
		});
		$("#opcionesEstadistica").toggle();
	}
	estadisticaId=indicadorEstId;
	
	
	
	
	$("table").hide();
	$("#paramPuesto").hide();
	$("#paramMdf").hide();
	
	$("#paramArea").hide();
	$("#paramDiv").hide();
	$("#paramIperc").hide();
	$("#buscadorExamEstad").hide();
	
	$("#paramFecha").show();
	$("#agrupEstad").hide();
	$("#verGrafico").hide();
	$("#opcionTodoEmpresa").hide();
	$("#opcionTodoUnidad").hide();
	$("#opcionTodoIperc").hide();
	filtrarPuestos=true;
	filtrarIperc=false;console.log(estadisticaId);
	switch(estadisticaId){
	case 13:
		filtrarPuestos=false;
		filtrarIperc=false;
		$("#paramMdf").hide();
		break;
	case 12:
		filtrarPuestos=false;
		filtrarIperc=false;
		llamarUnidades();
		$("#paramMdf").show();
		$("#paramFecha").hide();
		break;
	case 11:
	filtrarPuestos=false;
	filtrarIperc=false;
	llamarUnidades();
		break;
	case 10:
		filtrarPuestos=false;
		$("#paramMdf").hide();
		break;
	case 9:
		filtrarPuestos=false;
		filtrarIperc=true;$("#opcionTodoIperc").show();
		llamarUnidades();
		break;
	case 8:
		filtrarPuestos=false;
		filtrarIperc=true;$("#opcionTodoIperc").show();
		llamarUnidades();
		
		break;
	case 7:
		llamarUnidades();
		filtrarPuestos=false;
		filtrarIperc=false;
		break;
	case 6:
		filtrarPuestos=false;
		filtrarIperc=true;
		$("#opcionTodoIperc").show();
		llamarUnidades();
		
		break;
		
	case 5:
		filtrarPuestos=true;
		filtrarIperc=false;
		llamarUnidades();
		
		break;
	case 4:
		filtrarPuestos=false;
		filtrarIperc=false;
		llamarUnidades();
		$("#paramFecha").hide();
	
		break;
	case 3:
		filtrarPuestos=false;
		filtrarIperc=false;
		llamarUnidades();
		
		break;
	case 2:
		filtrarPuestos=true;
		filtrarIperc=false;
		
		llamarUnidades();
		$("#opcionTodoUnidad").show();
		verUnidadesFormacion();
		break;
		
	case 1:
		
		filtrarIperc=false;
		filtrarPuestos=false;
		llamarUnidades();
		$("#agrupEstad").show();
		$("#verGrafico").show();$("#opcionTodoEmpresa").show();
		break;
	
	}

	
}

function modificarAcordeAgrupar(){

	$('#tblEst td:nth-child(1),#tblEst th:nth-child(1)').show();
	switch($("#agrupEstad select").val()){
	case '1':
		$("#fechaEstad").html("Total");
		
		$("#paramFecha").show();
		break;
	case '2':
		$("#fechaEstad").html("Mes");
		
		$("#paramFecha").show();
		break;
	case '3':
		$("#fechaEstad").html("Año");
		
		$("#paramFecha").show();
		break;
	
	}
	
}


function llamarUnidades(){
	$("#paramMdf").show();
	$("#paramDiv").hide();
	$("#paramArea").hide();
	$("#paramPuesto").hide();
	$("#paramIperc").hide();
	
var dataParam = {
			companyId : sessionStorage.getItem("gestopcompanyid"),
			
			
			};

		callAjaxPostNoLoad(URL + '/estadistica/parametro/unidad', dataParam,
				procesarLlamadaUnidades);
	
}



function procesarLlamadaUnidades(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		
		 listaUnidades=data.unidades;
		var funcionUnidad=""
	if (filtrarPuestos){
		funcionUnidad="llamarDivisiones()";
	}
		if(filtrarIperc){
			funcionUnidad="llamarIpercs()";
		}
		var selUnidad=crearSelectOneMenuY("selUnidad",funcionUnidad,listaUnidades,""
				,"mdfId","mdfTipoId","mdfNombre","Todas");
		
			$("#paramSelMdf").html(selUnidad);
			completarBarraCarga();
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}
	
	
}

function llamarIpercs(){
	$("#paramIperc").show();
	var auxUnidadId=$("#selUnidad").val().split("-");
	var dataParam = {
				
					mdfId :auxUnidadId[0],
				
				
				};

			callAjaxPost(URL + '/estadistica/parametro/unidad/ipercs', dataParam,
					procesarllamarIpercs);
	}

function procesarllamarIpercs(data){
		switch (data.CODE_RESPONSE) {
		case "05":
			var listaIperc= data.ipercs;

			
			var selIpercs=crearSelectOneMenu("selIperc","",listaIperc,""
					,"ipercId","ipercNombre");
			
			
				$("#paramSelIperc").html(selIpercs);
				
				break;
				
		default:
			alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

	}

		
	}

function llamarPuestos(){
var dataParam = {
			companyId : sessionStorage.getItem("gestopcompanyid"),
			
			
			};

		callAjaxPost(URL + '/estadistica/parametro', dataParam,
				procesarLlamadaPuestos);
}

function procesarLlamadaPuestos(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var listaPuestos= data.puestos;
		listAyudaEstadistica=data.textoAyuda;
		
		var selPuestos=crearSelectOneMenu("selPuesto","",listaPuestos,""
				,"puestoId","puestoNombre");
		
		
			$("#paramSelPuesto").html(selPuestos);
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}

	
}
function llamarDivisiones(){
	$("#paramDiv").show();
	$("#paramArea").hide();
	$("#paramPuesto").hide();
	
	var auxUnidadId=$("#selUnidad").val().split("-");

	var dataParam = {
				
				mdfId :		auxUnidadId[0]	
				
				};

			callAjaxPost(URL + '/estadistica/parametro/divisiones', dataParam,
					procesarLlamadaDivisiones,function(){});
			
	}

function procesarLlamadaDivisiones(data){
		switch (data.CODE_RESPONSE) {
		case "05":
			var listaDivisiones= data.divisiones;
			
			var selDivisiones=crearSelectOneMenu("selDivision","llamarAreas()",listaDivisiones,""
					,"divisionId","divisionNombre","Todas");
			
			
				$("#paramSelDiv").html(selDivisiones);
				
				break;
				
		default:
			alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

	}

		
}
function llamarAreas(){
		$("#paramArea").show();
		$("#paramPuesto").hide();
		
		var dataParam = {
					
					divisionId :$("#selDivision").val(),
					
					
					};

				callAjaxPost(URL + '/estadistica/parametro/areas', dataParam,
						procesarLlamadaAreas,function(){});
}

function procesarLlamadaAreas(data){
			switch (data.CODE_RESPONSE) {
			case "05":
				var listaAreas= data.areas;
				
				var selArea=crearSelectOneMenu("selArea","llamarPuestosAux()",listaAreas,""
						,"areaId","areaNombre","Todas");
				
				
					$("#paramSelArea").html(selArea);
					
					break;
					
			default:
				alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

		}

			
		}
		
function llamarPuestosAux(){
			$("#paramPuesto").show();
			var dataParam = {
						areaId :$("#selArea").val(),
						
						
						};

					callAjaxPost(URL + '/estadistica/parametro/puestos', dataParam,
							procesarLlamadaPuestosAux,function(){});
			}

function procesarLlamadaPuestosAux(data){
				switch (data.CODE_RESPONSE) {
				case "05":
					var listaPuestos= data.puestos;
					
					var selPuestos=crearSelectOneMenu("selPuesto","",listaPuestos,""
							,"puestoId","puestoNombre","Todos");
					
					
						$("#paramSelPuesto").html(selPuestos);
						
						break;
						
				default:
					alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

			}

				
			}
function llamarHorasFormacion(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 var auxUnidad=$("#selUnidad").val().split('-')
	 unidadId=parseInt(auxUnidad[0]);
	 var dataParam = {
				empresaId : sessionStorage.getItem("gestopcompanyid"),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin ,
				mdfId: (unidadId=="-1"?null:unidadId) 
				
				
				};
		
			callAjaxPost(URL + '/estadistica/formacion/horas', dataParam,
					procesarLlamadaHorasFormaciones);
	
}

function procesarLlamadaHorasFormaciones(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		
		var numEntrenamiento = data.horasEntrenamiento;
		var numCapacitacion=data.horasCapacitacion;
		
		var trabUnidad=data.trabUnidad;
		var horasFormacion=data.horasFormacion;
		
	
		$("#tblFormacionNumero tbody tr").remove();

		for (index = 0; index < trabUnidad.length; index++) {
		
	
		$("#tblFormacionNumero tbody").append("<tr id='trab"+trabUnidad[index].trabajadorId+"'>"
				+"<td>"+trabUnidad[index].divisionNombre+"</td>" 
				+"<td>"+trabUnidad[index].areaNombre+"</td>" 
				+"<td>"+trabUnidad[index].puestoNombre+"</td>" 
				+"<td>"+trabUnidad[index].trabajadorNombre+"</td>" 
			
			
			+"<td id='formTipo3'>0</td>"
			+"<td id='horasFormTipo3'>0</td>"
			+"<td id='formTipo4'>0</td>"
			+"<td id='horasFormTipo4'>0</td>"
			+"<td id='formTipoTotal'>0</td>"	
			+"<td id='horasFormTipoTotal'>0</td>"
			
					+	"</tr>" )	;
		
		
		}
		
		
	
	
		
		console.log(numEntrenamiento);

		console.log(numCapacitacion);
		for (index = 0; index < numEntrenamiento.length; index++) {
			marcarNumeroFormacion(numEntrenamiento[index].trabajadorId,
					numEntrenamiento[index].numEntrenamientos,"3");
		}
		
		for (index = 0; index < numCapacitacion.length; index++) {
			marcarNumeroFormacion(numCapacitacion[index].trabajadorId,
					numCapacitacion[index].numCapacitaciones,"4");
		}
		
		for (index = 0; index < horasFormacion.length; index++) {
			
			marcarHorasFormacion(horasFormacion[index].trabajadorId,
					horasFormacion[index].horasTipo1,
					horasFormacion[index].horasTipo3,
					horasFormacion[index].horasTipo4);
			
		}
	
		for (index = 0; index < trabUnidad.length; index++) {
			
			 hallarTotalesHorasFormacion(trabUnidad[index].trabajadorId);
			
			
			}
		
		
		
		
		
	$("thead tr th").addClass("tb-acc");
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}

	
}
function marcarNumeroFormacion(trabId,numForm,formTipoId){
	$("#tblFormacionNumero tbody tr").each(function(){
			
			if($(this).prop("id")=="trab"+trabId){
				
				$("td").each(function(){
					if($(this).prop("id")=="formTipo"+formTipoId){
						$("#trab"+trabId+" #formTipo"+formTipoId).html(numForm);
						
					}
					
				})
			}
			
			
		});

	}
function llamarColumnas(pauxUnidadId){

	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 tipoBusqueda=$("#agrupEstad select").val();
	 var companyId=null;
	 if($("#checkEstadEmpresa").prop("checked") || $("#selUnidad").val()=="-1"){
	
		 companyId= sessionStorage.getItem("gestopcompanyid");
	 }
	 var auxUnidadId=pauxUnidadId;
	 if(pauxUnidadId==null){
		 auxUnidadId=$("#selUnidad").val().split("-")
		 auxUnidadId=auxUnidadId[0];
	 }
	

	var dataParam = {
			empresaId:companyId,
			mdfId : auxUnidadId,
			fechaInicio: fechaInicio,
			fechaFin: fechaFin ,
			tipoBusqueda:tipoBusqueda
			
			};
//console.log(dataParam);
		callAjaxPost(URL + '/estadistica', dataParam,
				procesarLlamadaColumnas);
	
}

function llamarPeligrosIperc(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 var auxUnidad=$("#selUnidad").val().split('-');
	 if(filtrarIperc){
		 ipercId=$("#selIperc").val();
	 }
	 
	 
	 unidadId=parseInt(auxUnidad[0]);
	 unidadTipoId=parseInt(auxUnidad[1]);
	 var dataParam = {
				empresaId : sessionStorage.getItem("gestopcompanyid"),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin ,
				mdfId: unidadId,
				mdfTipoId:unidadTipoId,
				ipercId:ipercId
				
				};

			callAjaxPost(URL + '/estadistica/peligros', dataParam,
					procesarLlamadaPeligros);
}

function procesarLlamadaPeligros(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var peligrosClasificados = data.peligro;
	
		var trabs=data.trabs;
		
	
	
		$("#tblIpercPeligro tbody tr").remove();

		for (index = 0; index < peligrosClasificados.length; index++) {
		
	var subtotal=peligrosClasificados[index].peligrosSignGenerales+peligrosClasificados[index].peligrosSignQuim+
	peligrosClasificados[index].peligrosSignFisico+peligrosClasificados[index].peligrosSignBio
	peligrosClasificados[index].peligrosSignErgo+peligrosClasificados[index].peligrosSignAntro+peligrosClasificados[index].peligrosSignSico;
		var total=peligrosClasificados[index].peligrosGenerales+peligrosClasificados[index].peligrosQuimico+
		peligrosClasificados[index].peligrosFisico+peligrosClasificados[index].peligrosBiologico
		peligrosClasificados[index].peligrosErgonomico+peligrosClasificados[index].peligrosAntropicos+peligrosClasificados[index].peligrosSicologico;
		
		$("#tblIpercPeligro tbody").append("<tr id='puesto"+peligrosClasificados[index].puestoId+"'>" 
				+"<td>"+peligrosClasificados[index].puestoNombre+"</td>" 
				+"<td>"+trabs[index].puestoNumTrab+"</td>" 
				+"<td>"+peligrosClasificados[index].peligrosSignGenerales+" / "+peligrosClasificados[index].peligrosGenerales+"</td>" 
				+"<td>"+peligrosClasificados[index].peligrosSignQuim+" / "+peligrosClasificados[index].peligrosQuimico+"</td>"			 
				+"<td>"+peligrosClasificados[index].peligrosSignFisico+" / "+peligrosClasificados[index].peligrosFisico+"</td>"
				+"<td>"+peligrosClasificados[index].peligrosSignBio+" / "+peligrosClasificados[index].peligrosBiologico+"</td>"
				+"<td>"+peligrosClasificados[index].peligrosSignErgo+" / "+peligrosClasificados[index].peligrosErgonomico+"</td>"
				+"<td>"+peligrosClasificados[index].peligrosSignAntro+" / "+peligrosClasificados[index].peligrosAntropicos+"</td>"
				+"<td>"+peligrosClasificados[index].peligrosSignSico+" / "+peligrosClasificados[index].peligrosSicologico+"</td>"
				+"<td>"+peligrosClasificados[index].peligrosSign+" / "+peligrosClasificados[index].peligrosTotal+"</td>"
				+		"</tr>" )	;
		
		
		}

		
	
		
			
			
			
		
		
	
	$("thead tr th").addClass("tb-acc");
		
		
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}

	
	
}
function llamarFormaciones(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 var auxUnidad=null;
	 auxUnidad=$("#selUnidad").val().split('-')
	 unidadId=parseInt(auxUnidad[0]);
	
	 puestoId=$("#selPuesto").val();
	 var divisionId=$("#selDivision").val();
	 var areaId=$("#selArea").val();
	 
	 contadorTrabForm0=0;
	 contadorTrabForm1=0;
	 contadorTrabForm2=0;
	 contadorTrabForm3=0;
	 contadorTrabForm4=0;
	 var dataParam = {
				
			empresaId : sessionStorage.getItem("gestopcompanyid"),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin ,
				
				mdfId:(unidadId=="-1"?null:unidadId),
				divisionId:(divisionId=="-1"?null:divisionId),
				areaId:(areaId=="-1"?null:areaId),
				puestoId: (puestoId=="-1"?null:puestoId)
				
				
				};
			callAjaxPost(URL + '/estadistica/formacion', dataParam,
					procesarLlamadaFormaciones);
}

var formPlanificadas=[];

function procesarLlamadaFormaciones(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var formacionesNecesarias = data.formNecesaria;
		var formacionesRealizadas=data.formRealizada;
		var trabs=data.trabs;
		$("#tblFormacion thead tr").remove();
		$("#tblFormacion tbody tr").remove();

		for (index = 0; index < trabs.length; index++) {
		
	
		$("#tblFormacion tbody").append("<tr id='trab"+trabs[index].trabajadorId+"'>" +"<td>"+trabs[index].trabajadorNombre+"</td></tr>" )	;
		
		
		}

		
		$("#tblFormacion thead").append(
				"<tr><th>Trabajador</th></tr>" )
		for (index = 0; index < formacionesNecesarias.length; index++) {
			
			var nombre=formacionesNecesarias[index].formacionNombre;
			var nombreTipo=formacionesNecesarias[index].formacionTipoNombre;
			$("#tblFormacion thead tr").append(
					"<th>"+nombre+"</th>"
			);
			
			$("#tblFormacion tbody tr").append(
				
				"<td id='form-"+formacionesNecesarias[index].formacionTipoId+"-"
				+formacionesNecesarias[index].formacionId+"'>N.A.</td>"
	
		)
			
		}
		
		formacionesRealizadas.forEach(function(val,index){
			var formacionesTrab=val.caps;
			var trabId=val.trabajadorId;
			var textoEstadistica="<i class='fa fa-times fa-2x' style='color:red'></i>";
			
			val.numFormacionesCumplidas=0;
			
			formacionesTrab.forEach(function(val1,index1){
				var eventos=val1.programsCap;
				var fechaMinima =convertirFechaNormal2(new Date());
				var hoy=new Date();
				$("#trab"+trabId+" #form-"+val1.capacitacionTipoId+"-"+val1.capacitacionId)
				.html(textoEstadistica);
				eventos.every(function(val2,index2){
					
					if(val2.fechaPlaTexto==null){
						val2.fechaPlaTexto=convertirFechaNormal2(hoy);
					}
					if(val2.fechaRealTexto==null){
						val2.fechaRealTexto=val2.fechaPlaTexto;
					}
					
					
					var enrango1=fechaEnRango(fechaInicio,val2.fechaPlaTexto,val2.fechaRealTexto)
					var enrango2=fechaEnRango(fechaFin,val2.fechaPlaTexto,val2.fechaRealTexto);
					if(index2==0){
						fechaMinima=val2.fechaPlaTexto;
					}
					
					if( val2.programacionCapId!=null&& val2.progCapEstado==1 && restaFechas(fechaMinima,val2.fechaPlaTexto)<=0){
						fechaMinima=val2.fechaPlaTexto;
						textoEstadistica="<i class='fa fa-share fa-2x' style='color:#FFBF00'></i>"+fechaMinima;
						
					}else{
						textoEstadistica="0";
					}
					
					if((enrango1 || enrango2) && val2.tipoNotaTrabId==1){
						if(val.trabajadorId==2597){
							console.log(val2);
						}
						textoEstadistica="<i class='fa fa-check fa-2x' style='color:green'></i>";
						val.numFormacionesCumplidas++;
						$("#trab"+trabId+" #form-"+val1.capacitacionTipoId+"-"+val1.capacitacionId)
						.html(textoEstadistica);
						return false;
					}
					$("#trab"+trabId+" #form-"+val1.capacitacionTipoId+"-"+val1.capacitacionId)
					.html(textoEstadistica);
					return true;
				});
			
			});
			
			
			
		});
	
		formacionesRealizadas.forEach(function(val,index){
		switch(val.numFormacionesCumplidas){
		case 0:
			contadorTrabForm0++;
			break;
		case 1:
			contadorTrabForm1++;
			break;
		case 2:
			contadorTrabForm2++;
			break;
		case 3:
			contadorTrabForm3++
			break;
		default:
			contadorTrabForm4++;
			break;
		}
		});
		 
		$("#formNum0").html(contadorTrabForm0);
		$("#formNum1").html(contadorTrabForm1);
		$("#formNum2").html(contadorTrabForm2);
		$("#formNum3").html(contadorTrabForm3);
		$("#formNum4").html(contadorTrabForm4);
		
	$("thead tr th").addClass("tb-acc");
	$("#tblFormacion tbody tr td").css("vertical-align","middle");
		
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}

	
}

function hallarFechas(){
	var fecha1=fechaInicio.split('-');
	var fecha2=fechaFin.split('-');
	var difanio= fecha2[0]-fecha1[0]+1;
	var listfecha=[];
	
	switch($("#agrupEstad select").val()){
	case "2":
		
		for (index =0; index <difanio; index++) {
			var anioaux=parseInt(index)+parseInt(fecha1[0]);
			
			if(difanio>1){
				if(index==0){
					for(index1 =0; index1 < 12-fecha1[1]+1; index1++) {
						
						var mesaux=parseInt(index1)+parseInt(fecha1[1]);
						listfecha.push(anioaux+"-"+mesaux);
						}
				}
				if(index==difanio-1){
					for(index4=0;index4<parseInt(fecha2[1]);index4++){
						var mesaux3=parseInt(index4)+parseInt("1");
						listfecha.push(anioaux+"-"+mesaux3);
					}
							}	
				
				if(index>0 && index <difanio-1 ){
						
						for(index3 =0;index3 <12;index3++){
							var mesaux2=parseInt(index3)+1;	
							listfecha.push(anioaux+"-"+mesaux2);
						}
						
						
					}
					
			}else{
				for(index5 =0; index5 < fecha2[1]-fecha1[1]+1; index5++) {
					
					var mesaux4=parseInt(index5)+parseInt(fecha1[1]);
					listfecha.push(anioaux+"-"+mesaux4);
					}
				
			}
			
			

			
		};
		break;
		
	case "3":
		for (index =0; index <difanio; index++) {
			var anioaux=parseInt(index)+parseInt(fecha1[0]);
			
			listfecha.push(anioaux);
		
		};
		break;
	
	
	}
	
	
	return listfecha;
	
}

function obtenerFechasLista(lista,index){
	var auxRango=lista[index];
	var fecha=auxRango.split('-');
	var anio=fecha[0];
	var mes=fecha[1];
	var listafecha=[];
	listafecha.push(anio);
	listafecha.push(mes);
	
	return listafecha;
}

function marcarHorasFormacion(trabId,horasTipo1,horasTipo3,horasTipo4){
	
$("tbody tr").each(function(){
		
		if($(this).prop("id")=="trab"+trabId){
			
			$("td").each(function(){
				if($(this).prop("id")=="horasFormTipo1"){
					$("#trab"+trabId+" #horasFormTipo1").html(horasTipo1);
					
				}
				if($(this).prop("id")=="horasFormTipo3"){
					$("#trab"+trabId+" #horasFormTipo3").html(horasTipo3);
					
				}
				if($(this).prop("id")=="horasFormTipo4"){
					$("#trab"+trabId+" #horasFormTipo4").html(horasTipo4);
					
				}
				
			})
		}
		
		
	});

}

function hallarTotalesHorasFormacion(trabId){
	
$("#tblFormacionNumero tbody tr").each(function(){
		
		if($(this).prop("id")=="trab"+trabId){
			$("#trab"+trabId+" #horasFormTipoTotal").html(
				parseInt($("#trab"+trabId+" #horasFormTipo3").html())
				+parseInt($("#trab"+trabId+" #horasFormTipo4").html())
			
			);
			
			$("#trab"+trabId+" #formTipoTotal").html(
				parseInt($("#trab"+trabId+" #formTipo3").html())
					+parseInt($("#trab"+trabId+" #formTipo4").html())
				
				);
		}
		
		
	});
}


function aumentarFormTrab(numFormaciones){
	
	;
}
 
//
function procesarLlamadaColumnas(data){
	
	var rangoFechas=hallarFechas();
	
	switch (data.CODE_RESPONSE) {
	case "05":
////////////autor: (AntoniTito5)  Tema:  Registro de horas
	    var numhrhom = data.numhh;
	    ////////////Fin5 Registro de horas
		var acctotal = data.numacc;
		var unidadAccidente = data.unidad;
		var empresaAccidente = data.empresa;
		$("#tblEst tbody tr").remove();
		switch(parseInt($("#agrupEstad select").val())){
		case 2:
			for (index = 0; index < rangoFechas.length; index++) {
				
					var listaFecha=obtenerFechasLista(rangoFechas,index);
					var anioEst=listaFecha[0];
					var mesEst=listaFecha[1];
				////////////autor: (AntoniTito5)  Tema:  Registro de horas
					
					////////////Fin5 Registro de horas
				$("#tblEst tbody").append(
						"<tr>" 
						+"<th>"+anioEst+"-"+mesEst+"</th>"
						+"<th ><input class='colAccidente' id='9"+anioEst+""+mesEst+"' type='number' onchange='javasript:calcularIndices()'></th>"
					////////////autor: (AntoniTito5)  Tema:  Registro de horas
						+"<th class='col'><input class='col a"+anioEst+""+mesEst+"' id='9x"+anioEst+""+mesEst+"' type='number' value=''  onchange='javasript:calcularIndicesAlternativo()' />   </th>"
						////////////Fin5 Registro de horas
						+"<th id='2"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='indenf"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='5"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='4"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='3"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='1"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='7"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='8"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='6"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='frele"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='freinc"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='fretot"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='indsev"+anioEst+""+mesEst+"'>0</th>"
						+"<th id='indacc"+anioEst+""+mesEst+"'>0</th>"
						+"</tr>"
						
				)
				$(".col").hide();
	$(document).ready(function(){
	        $("#ocultar").click(function(){
	            $(".col").hide();
	        });
	        $("#mostrar").click(function(){
	            $('.col').show();
	        });
	    });
				var num1 = anioEst;
				var num2 = mesEst;
				////////////autor: (AntoniTito5)  Tema:  Registro de horas
				var numeroHorasHombre	=  numhrhom.find( numhoras => numhoras.yearId === parseInt(anioEst,10) && numhoras.monthId === parseInt(mesEst,10));
				if(!(numhrhom.find( numhoras => numhoras.yearId === parseInt(anioEst,10) && numhoras.monthId === parseInt(mesEst,10)) == null)){
				    //console.log(' año y mes xxxx '+ Object.values(numeroHorasHombre));
				    $("#tblEst .a"+numeroHorasHombre.yearId +""+numeroHorasHombre.monthId +"").val(numeroHorasHombre.numHorasHombre);
				}else{
				   // console.log(' año y mes xxxx '+ num1 +" +  "+num2);
				    $("#tblEst .a"+num1 +""+num2+"").val(0);
				}
				////////////Fin5 Registro de horas
				
			}
	        			for (index = 0; index < acctotal.length; index++) {
	                			if(acctotal[index].consultaId!=9){
	                			$("#"+acctotal[index].consultaId+
	                					acctotal[index].yearId+
	                					acctotal[index].monthId).html(
	                						(acctotal[index].indicador==null?0:acctotal[index].indicador)		
	                					)
	                			}else{
	                				$("#tblEst .colAccidente").val(parseInt(acctotal[index].indicador)*7.5*22)
	                      			}
	                			
	        			}
	        		
		    break;
		case 3:
			for (index = 0; index < rangoFechas.length; index++) {
				anioEst=rangoFechas[index];
			$("#tblEst tbody").append(
					"<tr>" 
					+"<th>"+anioEst+"</th>"
					+"<th ><input class='colAccidente' id='9"+anioEst+"' type='number' onchange='javasript:calcularIndices()'></th>"
				////////////autor: (AntoniTito5)  Tema:  Registro de horas
					+"<th class='col'><input class='col a"+anioEst+"'  id='9x"+anioEst+"' type='number' onchange='javasript:calcularIndicesAlternativo()'></th>"
					////////////Fin5 Registro de horas
					+"<th id='2"+anioEst+"'>0</th>"
					+"<th id='indenf"+anioEst+"'>0</th>"
					+"<th id='5"+anioEst+"'>0</th>"
					+"<th id='4"+anioEst+"'>0</th>"
					+"<th id='3"+anioEst+"'>0</th>"
					+"<th id='1"+anioEst+"'>0</th>"
					+"<th id='7"+anioEst+"'>0</th>"
					+"<th id='8"+anioEst+"'>0</th>"
					+"<th id='6"+anioEst+"'>0</th>"
					+"<th id='frele"+anioEst+"'>0</th>"
					+"<th id='freinc"+anioEst+"'>0</th>"
					+"<th id='fretot"+anioEst+"'>0</th>"
					+"<th id='indsev"+anioEst+"'>0</th>"
					+"<th id='indacc"+anioEst+"'>0</th>"
					+"</tr>"
					
			);
			
		////////////autor: (AntoniTito5)  Tema:  Registro de horas
			$(".col").hide();
			$(document).ready(function(){
			        $("#ocultar").click(function(){
			            $(".col").hide();
			        });
			        $("#mostrar").click(function(){
			            $('.col').show();
			        });
			    });
			
			
			var numeroHorasHombre	=  numhrhom.find( numhoras => numhoras.yearId === parseInt(anioEst,10));
			if(!(numhrhom.find( numhoras => numhoras.yearId === parseInt(anioEst,10) ) == null)){
			  //  console.log(' año y mes xxxx '+ Object.values(numeroHorasHombre));
			    $("#tblEst .a"+numeroHorasHombre.yearId +"").val(numeroHorasHombre.numHorasHombre);
			}else{
			    $("#tblEst .a"+anioEst +"").val(0);
			}
			////////////Fin5 Registro de horas 
			
			}
			for (index = 0; index < acctotal.length; index++) {
				if(acctotal[index].consultaId!=9){
				$("#"+acctotal[index].consultaId+
						acctotal[index].yearId
						).html(
							(acctotal[index].indicador==null?0:acctotal[index].indicador)		
						)
				}else{
					$("#tblEst .colAccidente"
							).val(
									parseInt(acctotal[index].indicador)*7.5*22*12		
							)
					
							//console.log('valor jeje 2 ' + parseInt(acctotal[index].indicador)*7.5*22*12);
				}
		}
		    break;
		case 1:
		    $("#tblEst tbody").append(
					"<tr>" 
					+"<th>Total</th>"
					+"<th ><input class='colAccidente' id='9' type='number' onchange='javasript:calcularIndices()'></th>"
				////////////autor: (AntoniTito5)  Tema:  Registro de horas
					+"<th class='col'><input class='a col' id='9x' type='number' onchange='javasript:calcularIndicesAlternativo()'></th>"
					////////////Fin5 Registro de horas  
					+"<th id='2'>0</th>"
					+"<th id='indenf'>0</th>"
					+"<th id='5'>0</th>"
					+"<th id='4'>0</th>"
					+"<th id='3'>0</th>"
					+"<th id='1'>0</th>"
					+"<th id='7'>0</th>"
					+"<th id='8'>0</th>"
					+"<th id='6'>0</th>"
					+"<th id='frele'>0</th>"
					+"<th id='freinc'>0</th>"
					+"<th id='fretot'>0</th>"
					+"<th id='indsev'>0</th>"
					+"<th id='indacc'>0</th>"
					+"</tr>"
					
			);
		    
	////////////autor: (AntoniTito5)  Tema:  Registro de horas
			$(".col").hide();
			$(document).ready(function(){
			        $("#ocultar").click(function(){
			            $(".col").hide();
			        });
			        $("#mostrar").click(function(){
			            $('.col').show();
			        });
			    });
		    
		    if(numhrhom[0] != null){
			  console.log('FFFFFFFFFFF '+numhrhom[0].numHorasHombre);
			$("#tblEst .a").val(numhrhom[0].numHorasHombre);
		    }else{
			
			    $("#tblEst .a").val(0);
		    }
		    ////////////Fin5 Registro de horas 
		    
			var numDias=restaFechas(fechaInicio,fechaFin);
			for (index = 0; index < acctotal.length; index++) {
				if(acctotal[index].consultaId!=9){
				$("#"+acctotal[index].consultaId).html( (acctotal[index].indicador==null?0:acctotal[index].indicador))
				}else{
					$("#tblEst .colAccidente").val(parseInt(acctotal[index].indicador)*7.5*numDias)
					//console.log('valor jeje 3 ' + parseInt(acctotal[index].indicador)*7.5*numDias);
					
					//$("#tblEst input #91").val(parseInt(acctotal[index].indicador)*7.5*numDias)
				}
			}
			break;
		}
		if(unidadAccidente != null){
		    switch(parseInt($("#agrupEstad select").val())){
			case 2:
			    if(unidadAccidente.horasMes > 0)
			    $("#tblEst .colAccidente").val(unidadAccidente.horasMes);
			    break;
			case 3:
			    if(unidadAccidente.horasAnio > 0)
			    $("#tblEst .colAccidente").val(unidadAccidente.horasAnio);
			    break;
			case 1:
			    if(unidadAccidente.horasTotal > 0)
			    $("#tblEst .colAccidente").val(unidadAccidente.horasTotal);
			    break;
			}
		}else{
		    switch(parseInt($("#agrupEstad select").val())){
			case 2:
			    if(empresaAccidente.horasMes > 0)
			    $("#tblEst .colAccidente").val(empresaAccidente.horasMes);
			    break;
			case 3:
			    if(empresaAccidente.horasAnio > 0)
			    $("#tblEst .colAccidente").val(empresaAccidente.horasAnio);
			    break;
			case 1:
			    if(empresaAccidente.horasTotal > 0)
			    $("#tblEst .colAccidente").val(empresaAccidente.horasTotal);
			    break;
			}		    
		}
		
		break;
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);



	}
	
	

	calcularIndices();
	
	
}

////////////autor: (AntoniTito5)  Tema:  Registro de horas
function calcularIndicesAlternativo(){

var rangoFechas=hallarFechas();
	
		switch($("#agrupEstad select").val()){
		case "1":
			
				
							
				var numenf=parseInt($("#2").html());
				var horashombre=$("#9x").val();
				var indicadorEnfermedad=numenf*1000000/horashombre;
				
				var numaccleve=parseInt($("#5").html());
				var indicadorFrecuenciaLeve=numaccleve*1000000/horashombre;
				
				var numacctotal=parseInt($("#1").html());
				var indicadorFrecuenciaTotal=numacctotal*1000000/horashombre;
				var indicadorFrecuenciaIncapacitante=indicadorFrecuenciaTotal-indicadorFrecuenciaLeve;
				
				var diasInhabilitados=parseInt($("#6").html());
				var indiceSeveridad=diasInhabilitados*1000000/horashombre;
				var indiceAccidentabilidad=indiceSeveridad*indicadorFrecuenciaTotal/1000;
				$("#indenf")
					.html(indicadorEnfermedad.toFixed(2));
				
				$("#frele")
					.html(indicadorFrecuenciaLeve.toFixed(2));
				
				$("#freinc")
					.html(indicadorFrecuenciaIncapacitante.toFixed(2));
				
				$("#fretot")
					.html(indicadorFrecuenciaTotal.toFixed(2));
				
				$("#indsev")
					.html(indiceSeveridad.toFixed(2));
				
				$("#indacc")
					.html(indiceAccidentabilidad.toFixed(2));
				
				
			
			break;
		case "2":
			for (index = 0; index < rangoFechas.length; index++) {
				
				var listaFecha=obtenerFechasLista(rangoFechas,index);
				var anioEst=listaFecha[0];
				var mesEst=listaFecha[1];
				
				var numenf=parseInt($("#2"+anioEst+mesEst).html());
				var horashombre=$("#9x"+anioEst+mesEst).val();
				var indicadorEnfermedad=numenf*1000000/horashombre;
				
				var numaccleve=parseInt($("#5"+anioEst+mesEst).html());
				var numaccgrave=parseInt($("#4"+anioEst+mesEst).html());
				var numaccfatal=parseInt($("#3"+anioEst+mesEst).html());
				var indicadorFrecuenciaLeve=numaccleve*1000000/horashombre;
				
				var numacctotal=parseInt($("#1"+anioEst+mesEst).html());
				var indicadorFrecuenciaTotal=numacctotal*1000000/horashombre;
				var indicadorFrecuenciaIncapacitante=indicadorFrecuenciaTotal-indicadorFrecuenciaLeve;
				
				var diasInhabilitados=parseInt($("#6"+anioEst+mesEst).html());
				var indiceSeveridad=diasInhabilitados*1000000/horashombre;
				var indiceAccidentabilidad=indiceSeveridad*indicadorFrecuenciaTotal/1000;
				$("#indenf"+anioEst+""+mesEst)
					.html(indicadorEnfermedad.toFixed(2));
				
				$("#frele"+anioEst+""+mesEst)
					.html(indicadorFrecuenciaLeve.toFixed(2));
				
				$("#freinc"+anioEst+""+mesEst)
					.html(indicadorFrecuenciaIncapacitante.toFixed(2));
				
				$("#fretot"+anioEst+""+mesEst)
					.html(indicadorFrecuenciaTotal.toFixed(2));
				
				$("#indsev"+anioEst+""+mesEst)
					.html(indiceSeveridad.toFixed(2));
				
				$("#indacc"+anioEst+""+mesEst)
					.html(indiceAccidentabilidad.toFixed(2));
				
				
			}
			break;
			
		case "3":
	for (index = 0; index < rangoFechas.length; index++) {
				
				
				var anioEst=rangoFechas[index];
				
				
				var numenf=parseInt($("#2"+anioEst).html());
				var horashombre=$("#9x"+anioEst).val();
				var indicadorEnfermedad=numenf*1000000/horashombre;
				
				var numaccleve=parseInt($("#5"+anioEst).html());
				var indicadorFrecuenciaLeve=numaccleve*1000000/horashombre;
				
				var numacctotal=parseInt($("#1"+anioEst).html());
				var indicadorFrecuenciaTotal=numacctotal*1000000/horashombre;
				var indicadorFrecuenciaIncapacitante=indicadorFrecuenciaTotal-indicadorFrecuenciaLeve;
				
				var diasInhabilitados=parseInt($("#6"+anioEst).html());
				var indiceSeveridad=diasInhabilitados*1000000/horashombre;
				var indiceAccidentabilidad=indiceSeveridad*indicadorFrecuenciaTotal/1000;
				$("#indenf"+anioEst)
					.html(indicadorEnfermedad.toFixed(2));
				
				$("#frele"+anioEst)
					.html(indicadorFrecuenciaLeve.toFixed(2));
				
				$("#freinc"+anioEst)
					.html(indicadorFrecuenciaIncapacitante.toFixed(2));
				
				$("#fretot"+anioEst)
					.html(indicadorFrecuenciaTotal.toFixed(2));
				
				$("#indsev"+anioEst)
					.html(indiceSeveridad.toFixed(2));
				
				$("#indacc"+anioEst)
					.html(indiceAccidentabilidad.toFixed(2));
				
				
			}
			break;
		}
		

	
	
		}
////////////Fin5 Registro de horas


function calcularIndices(){
var rangoFechas=hallarFechas();
	
		switch($("#agrupEstad select").val()){
		case "1":
			
				
							
				var numenf=parseInt($("#2").html());
				var horashombre=$("#9").val();
				var indicadorEnfermedad=numenf*1000000/horashombre;
				
				var numaccleve=parseInt($("#5").html());
				var indicadorFrecuenciaLeve=numaccleve*1000000/horashombre;
				
				var numacctotal=parseInt($("#1").html());
				var indicadorFrecuenciaTotal=numacctotal*1000000/horashombre;
				var indicadorFrecuenciaIncapacitante=indicadorFrecuenciaTotal-indicadorFrecuenciaLeve;
				
				var diasInhabilitados=parseInt($("#6").html());
				var indiceSeveridad=diasInhabilitados*1000000/horashombre;
				var indiceAccidentabilidad=indiceSeveridad*indicadorFrecuenciaTotal/1000;
				$("#indenf")
					.html(indicadorEnfermedad.toFixed(2));
				
				$("#frele")
					.html(indicadorFrecuenciaLeve.toFixed(2));
				
				$("#freinc")
					.html(indicadorFrecuenciaIncapacitante.toFixed(2));
				
				$("#fretot")
					.html(indicadorFrecuenciaTotal.toFixed(2));
				
				$("#indsev")
					.html(indiceSeveridad.toFixed(2));
				
				$("#indacc")
					.html(indiceAccidentabilidad.toFixed(2));
				
				
			
			break;
		case "2":
			for (index = 0; index < rangoFechas.length; index++) {
				
				var listaFecha=obtenerFechasLista(rangoFechas,index);
				var anioEst=listaFecha[0];
				var mesEst=listaFecha[1];
				
				var numenf=parseInt($("#2"+anioEst+mesEst).html());
				var horashombre=$("#9"+anioEst+mesEst).val();
				var indicadorEnfermedad=numenf*1000000/horashombre;
				
				var numaccleve=parseInt($("#5"+anioEst+mesEst).html());
				var numaccgrave=parseInt($("#4"+anioEst+mesEst).html());
				var numaccfatal=parseInt($("#3"+anioEst+mesEst).html());
				var indicadorFrecuenciaLeve=numaccleve*1000000/horashombre;
				
				var numacctotal=parseInt($("#1"+anioEst+mesEst).html());
				var indicadorFrecuenciaTotal=numacctotal*1000000/horashombre;
				var indicadorFrecuenciaIncapacitante=indicadorFrecuenciaTotal-indicadorFrecuenciaLeve;
				
				var diasInhabilitados=parseInt($("#6"+anioEst+mesEst).html());
				var indiceSeveridad=diasInhabilitados*1000000/horashombre;
				var indiceAccidentabilidad=indiceSeveridad*indicadorFrecuenciaTotal/1000;
				$("#indenf"+anioEst+""+mesEst)
					.html(indicadorEnfermedad.toFixed(2));
				
				$("#frele"+anioEst+""+mesEst)
					.html(indicadorFrecuenciaLeve.toFixed(2));
				
				$("#freinc"+anioEst+""+mesEst)
					.html(indicadorFrecuenciaIncapacitante.toFixed(2));
				
				$("#fretot"+anioEst+""+mesEst)
					.html(indicadorFrecuenciaTotal.toFixed(2));
				
				$("#indsev"+anioEst+""+mesEst)
					.html(indiceSeveridad.toFixed(2));
				
				$("#indacc"+anioEst+""+mesEst)
					.html(indiceAccidentabilidad.toFixed(2));
				
				
			}
			break;
			
		case "3":
	for (index = 0; index < rangoFechas.length; index++) {
				
				
				var anioEst=rangoFechas[index];
				
				
				var numenf=parseInt($("#2"+anioEst).html());
				var horashombre=$("#9"+anioEst).val();
				var indicadorEnfermedad=numenf*1000000/horashombre;
				
				var numaccleve=parseInt($("#5"+anioEst).html());
				var indicadorFrecuenciaLeve=numaccleve*1000000/horashombre;
				
				var numacctotal=parseInt($("#1"+anioEst).html());
				var indicadorFrecuenciaTotal=numacctotal*1000000/horashombre;
				var indicadorFrecuenciaIncapacitante=indicadorFrecuenciaTotal-indicadorFrecuenciaLeve;
				
				var diasInhabilitados=parseInt($("#6"+anioEst).html());
				var indiceSeveridad=diasInhabilitados*1000000/horashombre;
				var indiceAccidentabilidad=indiceSeveridad*indicadorFrecuenciaTotal/1000;
				$("#indenf"+anioEst)
					.html(indicadorEnfermedad.toFixed(2));
				
				$("#frele"+anioEst)
					.html(indicadorFrecuenciaLeve.toFixed(2));
				
				$("#freinc"+anioEst)
					.html(indicadorFrecuenciaIncapacitante.toFixed(2));
				
				$("#fretot"+anioEst)
					.html(indicadorFrecuenciaTotal.toFixed(2));
				
				$("#indsev"+anioEst)
					.html(indiceSeveridad.toFixed(2));
				
				$("#indacc"+anioEst)
					.html(indiceAccidentabilidad.toFixed(2));
				
				
			}
			break;
		}
		

	
	
}
var fullCampo3=[];var fullCampo1=[];var fullCampo2=[];
var fullCampo6=[], fullCampo5=[], fullCampo4=[];
var fullCampo7=[], fullCampo8=[], fullCampo9=[];
var fullCampo10=[], fullCampo11=[], fullCampo12=[];
var fullCampo13=[], fullCampo14=[], fullCampo15=[],fullCampo16=[];
var infoTotal=[];
var listNombresMdf=[];
function mostrarGraficos(){
	infoTotal=[];listNombresMdf=[];
	fullCampo3=[],fullCampo4=[],fullCampo5=[],fullCampo6=[];
	fullCampo2=[],fullCampo1=[],fullCampo7=[],fullCampo8=[];fullCampo9=[];
	fullCampo10=[],fullCampo11=[],fullCampo12=[],fullCampo13=[];fullCampo14=[];fullCampo15=[];
	fechaInicio= $("#fechaIniciaGraf").val();
	 fechaFin= $("#fechaFinGraf").val();
	 var companyId=null;
	 if($("#checkEstadEmpresa").prop("checked")){
	
		 companyId= sessionStorage.getItem("gestopcompanyid");
	 };
	 
	for(var index=0;index<listaUnidades.length;index++){
		
		 infoTotal.push(parseInt(listaUnidades[index].mdfId));
		 listNombresMdf.push(listaUnidades[index].mdfNombre)
		
		 
	}

		var dataParam = {
				empresaId:companyId,
				mdfIdLista : infoTotal,
				fechaInicio: fechaInicio,
				fechaFin: fechaFin ,
				tipoBusqueda:2
				
				};
		
		var rangoFechas=hallarFechas();
			callAjaxPost(URL + '/estadistica/grupal', dataParam,
					function(data){
				
					switch (data.CODE_RESPONSE) {
				case "05":
					for(var i=0;i<data.numacc.length;i++){
						var acctotal = data.numacc[i];
						
						campo1=[]	;campo2=[]	;campo3=[],campo4=[],campo5=[],campo6=[]	;
						campo7=[]	;campo8=[]	;campo9=[];campo10=[];campo11=[],campo12=[],campo13=[],campo14=[]	;
						campo15=[];
						var listaFechaMenor=obtenerFechasLista(rangoFechas,0);
						var anioEstMenor=listaFechaMenor[0];
						var mesEstMenor=listaFechaMenor[1];
					for (var index1 = 0; index1 < rangoFechas.length; index1++) {
						
							var listaFecha=obtenerFechasLista(rangoFechas,index1);
							var anioEst=listaFecha[0];
							var mesEst=listaFecha[1];
							campo14.push(anioEst+"-"+mesEst);
							campo1.push(0);
							campo2.push(0);
							campo3.push(0);
							campo4.push(0);
							campo5.push(0);
							campo6.push(0);
							campo7.push(0);
							campo8.push(0);
							
							campo9.push(0);
							campo10.push(0);
							campo11.push(0);
							campo12.push(0);
							campo13.push(0);campo15.push(0);
					}
					var horasHombre=100;
					for (var index2 = 0; index2 < acctotal.length; index2++) {
					
						switch(acctotal[index2].consultaId){
					
						case 9:
							horasHombre=(acctotal[index2].indicador)*7.5*22;
							break;
						default:
							break;
						}
					
						
					
					
				
					};
					for (var index2 = 0; index2 < acctotal.length; index2++) {
						var anioEst=acctotal[index2].yearId;
						var mesEst=acctotal[index2].monthId;
						var position=(anioEst-anioEstMenor)*12+(mesEst)-(mesEstMenor);
						switch(acctotal[index2].consultaId){
						case 2:
							campo2[position]=(acctotal[index2].indicador);
							break;
						case 1:
							campo1[position]=(acctotal[index2].indicador);
							break;
						case 3:
							campo3[position]=(acctotal[index2].indicador);
							break;
						case 4:
							campo4[position]=(acctotal[index2].indicador);
							break;
						case 5:
							campo5[position]=(acctotal[index2].indicador);
							break;
						case 6:
							campo6[position]=(acctotal[index2].indicador);
							break;
						case 7:
							campo7[position]=(acctotal[index2].indicador);
							break;
						case 8:
							campo8[position]=(acctotal[index2].indicador);
							break;
						
						default:
							break;
						}
							
					};
					
					for (var index2 = 0; index2 < acctotal.length; index2++) {
						var anioEst=acctotal[index2].yearId;
						var mesEst=acctotal[index2].monthId;
						var position=(anioEst-anioEstMenor)*12+(mesEst)-(mesEstMenor);
							campo9[position]=obtenerDatoEstadistico(campo2[position]*1000000/horasHombre);
					
							campo12[position]=obtenerDatoEstadistico(campo1[position]*1000000/horasHombre);
					
							
							campo10[position]=obtenerDatoEstadistico(campo5[position]*1000000/horasHombre);
						
							campo13[position]=obtenerDatoEstadistico(campo6[position]*1000000/horasHombre);
					
						campo11[position]=obtenerDatoEstadistico(campo12[position]-campo10[position]);
						campo15[position]=obtenerDatoEstadistico(campo13[position]*campo11[position]/1000);
					
					
				
					}
					fullCampo1.push({
						name:listNombresMdf[i],data:campo1
					});
					fullCampo2.push({
						name:listNombresMdf[i],data:campo2
					});
				
					fullCampo3.push({
						name:listNombresMdf[i],data:campo3
					});
					fullCampo4.push({
						name:listNombresMdf[i],data:campo4
					});
					fullCampo5.push({
						name:listNombresMdf[i],data:campo5
					});
					fullCampo6.push({
						name:listNombresMdf[i],data:campo6
					});
					fullCampo7.push({
						name:listNombresMdf[i],data:campo7
					});
					fullCampo8.push({
						name:listNombresMdf[i],data:campo8
					});
					fullCampo9.push({
						name:listNombresMdf[i],data:campo9
					});
					fullCampo10.push({
						name:listNombresMdf[i],data:campo10
					});
					fullCampo11.push({
						name:listNombresMdf[i],data:campo11
					});
					fullCampo12.push({
						name:listNombresMdf[i],data:campo12
					});
					fullCampo13.push({
						name:listNombresMdf[i],data:campo13
					});
					fullCampo15.push({
						name:listNombresMdf[i],data:campo15
					});
						
						
					}
						
							break;
				default:
					alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

			}

	var selectAccInd="<select class='form-control' " +
			"id='selectAccInd' onchange='verSubIndAccidente()'>" +
			"<option value=1>Enfermedades</option>" +
			"<option value=2>Accidente Fatal</option>" +
			"<option value=3>Accidentes Incapacitantes</option>" +
			"<option value=4>Accidentes Leves</option>" +
			"<option value=5>Total Accidentes</option>" +
			"<option value=6>Días Perdidos</option>" +
			"<option value=7>Accidentes Vehiculares</option>" +
			"<option value=8>Daño Material</option>" +
			"<option value=9>Indicador de enfermedad</option>" +
			"<option value=10>Indicador Frecuencia Leve</option>" +
			"<option value=11>Indicador Frecuencia Incapacitante</option>" +
			"<option value=12>Indicador Frecuencia Total</option>" +
			"<option value=13>Indicador Severidad</option>" +
			"<option value=15>Indicador Accidentabilidad</option></select>"
	$("#graficoEst").html(
			selectAccInd+"<br>"
			+"<div  id='listaGraf'></div>" 
		
	);
	
	
	crearGrafico("Horas Hombre","Enfermedad",fullCampo2,"1","active");
	crearGrafico("Unidades","Accidente Fatal",fullCampo3,"2");
	crearGrafico("","Accidente Incapacitante",fullCampo4,"3");
	
	crearGrafico("","Accidente Leve",fullCampo5,"4");
	crearGrafico("Unidades","Total Accidentes",fullCampo1,"5");
	crearGrafico("Unidades","Días Perdidos",fullCampo6,"6");
	crearGrafico("Unidades","Accidente Vehiculares",fullCampo7,"7");
	crearGrafico("Unidades","Daño Material",fullCampo8,"8");
	
	crearGrafico("--","Indicador Enfermedad",fullCampo9,"9");
	crearGrafico("--","Indicador Frecuencia Leve",fullCampo10,"10");
	crearGrafico("--","Indicador Frecuencia Incapacitante",fullCampo11,"11");
	crearGrafico("--","Indicador Frecuencia Total",fullCampo12,"12");
	crearGrafico("--","Indicador Severidad",fullCampo13,"13");
	crearGrafico("--","Indicador Accidentabilidad",fullCampo15,"15");

	$("#subGraficoIndAcc1").show();
	$("#subGraficoIndAcc2").hide();
	$("#subGraficoIndAcc3").hide();
	$("#subGraficoIndAcc4").hide();
	$("#subGraficoIndAcc5").hide();
	$("#subGraficoIndAcc6").hide();
	$("#subGraficoIndAcc7").hide();
	$("#subGraficoIndAcc8").hide();
	$("#subGraficoIndAcc9").hide();
	$("#subGraficoIndAcc10").hide();
	$("#subGraficoIndAcc11").hide();
	$("#subGraficoIndAcc12").hide();
	$("#subGraficoIndAcc13").hide();
	$("#subGraficoIndAcc15").hide();
	
}			
				
			);




}
function verSubIndAccidente(){
	$("#subGraficoIndAcc1").hide();
	$("#subGraficoIndAcc2").hide();
	$("#subGraficoIndAcc3").hide();
	$("#subGraficoIndAcc4").hide();
	$("#subGraficoIndAcc5").hide();
	$("#subGraficoIndAcc6").hide();
	$("#subGraficoIndAcc7").hide();
	$("#subGraficoIndAcc8").hide();
	$("#subGraficoIndAcc9").hide();
	$("#subGraficoIndAcc10").hide();
	$("#subGraficoIndAcc11").hide();
	$("#subGraficoIndAcc12").hide();
	$("#subGraficoIndAcc13").hide();
	$("#subGraficoIndAcc15").hide();
	switch(parseInt($("#selectAccInd").val())){
	case 1:
		$("#subGraficoIndAcc1").show();
		break;
	case 2:
		$("#subGraficoIndAcc2").show();
		break;
	case 3:
		$("#subGraficoIndAcc3").show();
		break;
	case 4:
		$("#subGraficoIndAcc4").show();
		break;
	case 5:
		$("#subGraficoIndAcc5").show();
		break;
	case 6:
		$("#subGraficoIndAcc6").show();
		break;
	case 7:
		$("#subGraficoIndAcc7").show();
		break;
	case 8:
		$("#subGraficoIndAcc8").show();
		break;
	case 9:
		$("#subGraficoIndAcc9").show();
		break;
	case 10:
		$("#subGraficoIndAcc10").show();
		break;
	case 11:
		$("#subGraficoIndAcc11").show();
		break;
	case 12:
		$("#subGraficoIndAcc12").show();
		break;
	case 13:
		$("#subGraficoIndAcc13").show();
		break;
	case 15:
		$("#subGraficoIndAcc15").show();
		break;
	}
	
}
function crearGrafico(unidadNombre,tituloy,ejey,graficoId,active){
	  var alto=550;
	    var ancho=900;
		
	$("#listaGraf").append(
			"<div  id='subGraficoIndAcc"+graficoId+"' ></div>" 
			);
	
	$('#subGraficoIndAcc'+graficoId).highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: tituloy
        },
        subtitle: {
            text: "Indicadores"
        },
        xAxis: {
            categories:campo14
        },
        yAxis: {
            title: {
                text: unidadNombre
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: ejey
    });
    
 
    
	
}




function obtenerDatosTabla(tablaId) {
	
	var fullDatosTabla="";
	 $("#"+tablaId+" thead tr").each(function (index){   
         $(this).children("th").each(function (index2){
              fullDatosTabla =fullDatosTabla+ $(this).text()+"\t";

         })
         fullDatosTabla=fullDatosTabla+"\n"
     });
	 $("#"+tablaId+" tbody tr").each(function (index){   
		            $(this).children("th").each(function (index2){
		                switch (index2){
		                case 1: fullDatosTabla =fullDatosTabla+ $(this).find("input").val()+"\t";
		                		break;
		                default: fullDatosTabla =fullDatosTabla+ $(this).text()+"\t";
		                            break;
		                }
		              
		            })
		            fullDatosTabla=fullDatosTabla+"\n"
		        });
	 return fullDatosTabla;
	
	 
	    }
function copiarClipboardTablaAccidente(){
	
	
	new Clipboard('#btnClipTabla', {
		text : function(trigger) {
			return obtenerDatosTabla("tblEst")
		}
	});
	
	alert("Se han guardado al clipboard la tabla de este módulo" );
}
function verUnidadesEsp(){
	
	if($("#checkEstadEmpresa").prop("checked")  ){
		$("#paramMdf").hide();
		
	}else{
		
		$("#paramMdf").show();
	}
}

function verUnidadesFormacion(){
	
	if($("#checkResumenFormaciones").prop("checked") ){
		filtrarPuestos=false;llamarUnidades();
		
	}else{
		
		filtrarPuestos=true;llamarUnidades();
	}
	
}
var ipercId;
function verIpercUnidad(){
	
	if(!$("#checkTodoIperc").prop("checked") ){
		ipercId=null;
		filtrarIperc=false;llamarUnidades();
		
	}else{
		
		filtrarIperc=true;llamarUnidades();
	}
	
}





