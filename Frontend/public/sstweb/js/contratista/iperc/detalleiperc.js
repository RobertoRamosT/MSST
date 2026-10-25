var detalleIpercDetailId,detalleIpercDetailObj;
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
var indDeficienciaId;
var indCapaId;
var indHistoriaId;

var personExpIdAct;
var indDeficienciaIdAct;
var indCapaIdAct;
var indHistoriaIdAct;

var personExpIdFut;
var indDeficienciaIdFut;
var indCapaIdFut;
var indHistoriaIdFut;

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
var listCategoriaProbabilidadEspecifica=[];
var listCategoriaConsecuenciaEspecifica=[];
var listTipoControlIperc=[];
var banderaEdicionIperc=false;

$(function(){
	 

	 
 $("#btnClipboardIpercProy").on("click",obtenerTablaIpercContratista);
 $("#filtroIniciarBuscador").on("click",iniciarFiltroIperc);
 $("#filtroAplicarBuscador").on("click",aplicarFiltroIperc);
 $("#filtroRefreshIperc").on("click",reiniciarFiltroIpercProyecto);

 
});

function creaarFiltroIperc(){
	$("#filtroIniciarBuscador").show();
	$("#filtroAplicarBuscador").hide();
	$(".camposFiltroTabla").show();
	$(".camposFiltroTabla").html(
			"<div class='contain-filtro' id='filtroPuesto'>" +
			"<input type='checkbox' id='checkFiltroProyIpercPuesto' >" +
			"<label for='checkFiltroProyIpercPuesto'  >Puesto "+
			"</label>" +
			"<div id='divSelectFiltroProyIpercPuesto'> " +
			"</div>" + 
			"</div>"+
			
			"<div class='contain-filtro' id='filtroActiv'>" +
			"<input type='checkbox' id='checkFiltroProyIpercActiv' >" +
			"<label for='checkFiltroProyIpercActiv'  >Actividad"+
			"</label>" +
			"<div id='divSelectFiltroProyIpercActiv'> " +
			"</div>" + 
			"</div>" + 
			
			"<div class='contain-filtro' id='filtroTarea'>" +
			"<input type='checkbox' id='checkFiltroTarea' >" +
			"<label for='checkFiltroTarea'  >Tarea"+
			"</label>" +
			"<div id='divSelectFiltroTarea'> " +
			"</div>" +
			"</div>" +

			"<div class='contain-filtro' id='filtroPeligro'>" +
			"<input type='checkbox' id='checkFiltroPeligro' >" +
			"<label for='checkFiltroPeligro'  >Peligro / Aspecto / Falla"+
			"</label>" +
			"<div id='divSelectFiltroPeligro'> " +
			"</div>" +
			"</div>" 
	);
	var listPuestoObj=[],listPuestoString=[];
	var listActividadObj=[],listActividadString=[];
	var listTareaObj=[],listTareaString=[];
	var listPeligroObj=[],listPeligroString=[];
	detallesFullIperc.forEach(function(val,index){
		if(listPuestoString.indexOf(val.puesto)==-1){
			listPuestoString.push(val.puesto);
			listPuestoObj.push(
					{id:val.puesto,nombre:val.puesto})
		}
		if(listActividadString.indexOf(val.actividad)==-1){
			listActividadString.push(val.actividad);
			listActividadObj.push(
					{id:val.actividad,nombre:val.actividad})
		}
		if(listTareaString.indexOf(val.tarea)==-1){
			listTareaString.push(val.tarea);
			listTareaObj.push(
					{id:val.tarea,nombre:val.tarea})
		}
		if(listPeligroString.indexOf(val.peligro)==-1){
			listPeligroString.push(val.peligro);
			listPeligroObj.push(
					{id:val.peligro,nombre:val.peligro})
		}
		
		
	});
	 crearSelectOneMenuObligMultipleCompleto("selMultiplePuesto", "", listPuestoObj, 
				"id","nombre","#divSelectFiltroProyIpercPuesto","Seleccione puestos"); 
	
	 crearSelectOneMenuObligMultipleCompleto("selMultipleActividad", "", listActividadObj, 
				"id","nombre","#divSelectFiltroProyIpercActiv","Seleccione actividades");
	 
	 crearSelectOneMenuObligMultipleCompleto("selMultipleTarea", "", listTareaObj, 
				"id","nombre","#divSelectFiltroTarea","Seleccione tareas"); 
	 
	 crearSelectOneMenuObligMultipleCompleto("selMultiplePeligro", "", listPeligroObj, 
				"id","nombre","#divSelectFiltroPeligro","Seleccione peligros/aspectos/falla"); 
	 
	 
	$(".camposFiltroTabla").hide();
	
	
}
function iniciarFiltroIperc(){
	$(".camposFiltroTabla").show();
	$("#wrapperIperc").hide(); 
	$(this).hide();
	$("#filtroIniciarBuscador").hide();
	$("#filtroAplicarBuscador").show();
	
}
function aplicarFiltroIperc(){
	$(".camposFiltroTabla").hide();
	$("#wrapperIperc").show(); 
	$(this).hide();
	$("#filtroIniciarBuscador").show();
	$("#filtroAplicarBuscador").hide();
	
	var listArrayPuesto=$("#selMultiplePuesto").val(); 
	var listArrayActividades=$("#selMultipleActividad").val(); 
	var listArrayTarea=$("#selMultipleTarea").val();
	var listArrayPeligro=$("#selMultiplePeligro").val();
	var listFinalPuesto=[];
	var listFinalActividades=[];
	var listFinalTarea=[];
	var listFinalPeligro=[];
	listArrayPuesto.forEach(function(val){
		listFinalPuesto.push(val);
	});   
	listArrayActividades.forEach(function(val){
		listFinalActividades.push(val);
	});
	listArrayTarea.forEach(function(val){
		listFinalTarea.push(val);
	});
	listArrayPeligro.forEach(function(val){
		listFinalPeligro.push(val);
	});
	var incluirPuesto=$("#checkFiltroProyIpercPuesto").prop("checked");
	var incluirActividad=$("#checkFiltroProyIpercActiv").prop("checked");
	var incluirTarea=$("#checkFiltroTarea").prop("checked");
	var incluirPeligro=$("#checkFiltroPeligro").prop("checked");
	$("#tblMatrices tbody tr").remove(); 

	var listAux=detallesFullIperc.filter(function(val,index){
		 var condicionPuesto=(incluirPuesto?
				 listFinalPuesto.indexOf(val.puesto)!=-1:true ); 
		 var condicionActividad=(incluirActividad?
					listFinalActividades.indexOf(val.actividad)!=-1:true ); 
		 var condicionTarea=(incluirTarea?
				 listFinalTarea.indexOf(val.tarea)!=-1:true ); 
		 var condicionPeligro=(incluirPeligro?
				 listFinalPeligro.indexOf(val.peligro)!=-1:true ); 
			if(condicionPuesto && condicionActividad && condicionTarea && condicionPeligro){
			return true;
		}else{
			return false;
		}
	})
	listAux.forEach(crearFilasDetalleIpercContratista); 
}
function reiniciarFiltroIpercProyecto(){
	$("#tblMatrices tbody tr").remove(); 
	detallesFullIperc.forEach(crearFilasDetalleIpercContratista); 
	
	$(".camposFiltroTabla").hide();
	$("#wrapperIperc").show();
}
 function obtenerTablaIpercContratista(){
	   																						
	  var arrHeader=["Nro","División","Area","Puesto","Actividad","Tarea","Lugar",
	                 "Tipo","Sub Tipo","Frecuencia de tarea","Peligro / Aspecto / Falla",
	                 "Descripción","Riesgo","Consecuencia / Impacto","Requisito Legal",
	                 "Control Ingeniería","Control Administrativo","Control EPP / Colectivo",
	                 "E. A. Datos históricos","Nivel de Deficiencia","Nivel de Exposición",
	                 "Factor de Exposición","Capacitación y entrenamiento","Probabilidad",
	                 "Consecuencia","Nivel de Riesgo","¿Es significativo?","C. Eliminación",
	                 "C. Sustitución","C. de Ingeniería","C.  Administrativo","C. Equipos de Protección",
	                 
	                 "E. R. Datos históricos","Nivel de Deficiencia","Nivel de Exposición",
	                 "Factor de Exposición","Capacitación y entrenamiento","Probabilidad",
	                 "Consecuencia","Riesgo Residual"	];
	  var arrHeader3x3=["Nro","División","Area","Puesto","Actividad","Tarea","Lugar",
		                 "Tipo","Sub Tipo","Frecuencia de tarea","Peligro / Aspecto / Falla",
		                 "Descripción","Riesgo","Consecuencia / Impacto","Requisito Legal",
		                 "Control Ingeniería","Control Administrativo","Control EPP / Colectivo",
		                 "E. A. Personas Expuestas","Procedimientos Existentes","Capacitación",
		                 "Exposición al riesgo","Probabilidad","Consecuencia","Nivel de riesgo",
		                 "¿Es significativo?","C. Eliminación",
		                 "C. Sustitución","C. de Ingeniería","C.  Administrativo",
		                 "C. Equipos de Protección",
		                 
		                 "E. R. Personas Expuestas","Procedimientos Existentes","Capacitación",
		                 "Exposición al riesgo","Probabilidad","Consecuencia","Riesgo Residual",];
	  var texto="";
	  if(proyectoObj.tipoIperc.id==1){
		  arrHeader3x3.forEach(function(val){
			  texto+=val+"\t"
		  });  
	  }
	  if(proyectoObj.tipoIperc.id==3){
		  arrHeader.forEach(function(val){
			  texto+=val+"\t"
		  });  
	  }
	  texto+="\n";
	  texto+=obtenerDatosBodyTablaEstandar("tblMatrices");
		 copiarAlPortapapeles(texto,"btnClipboardIpercProy");
			alert("Se han guardado al clipboard la tabla " );
  }
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
function volverDivIpercProy(){
	$("#tabProyectos .container-fluid").hide();
	$("#divEvalIpercProy").show();
	$("#tabProyectos h2")
	.html("<a onclick='volverDivProyectos()'>Proyecto ("+
			proyectoObj.titulo+") </a> " +
			"> Matriz de Riesgo Integrado");
}

function verEvaluacionIpercProyecto(){
   banderaEdicionIperc = false;
	
   $("#btnClipTabla").show();
   $("#tabProyectos .container-fluid").hide();
   $("#divEvalIpercProy").show();
   $("#tabProyectos h2").html(
      "<a onclick='volverDivProyectos()'>Proyecto ("+proyectoObj.titulo+")</a> > IPERC");
	
   indexAux = 0; 
	
   detalleIpercDetailId = 0;peligroId = 0;clasiId = 0;
   riesgoId = 0;probabilidadId = 0;severidadId = 0;
   probabilidadActId = 0;severidadActId = 0;
   probabilidadProyId = 0;severidadProyId = 0;
   personExpId = 0;indDeficienciaId = 0;indCapaId = 0;
   indHistoriaId = 0;

   personExpIdAct = 0;indDeficienciaIdAct = 0;indCapaIdAct = 0;
   indHistoriaIdAct = 0;

   personExpIdFut = 0;indDeficienciaIdFut = 0;indCapaIdFut = 0;
   indHistoriaIdFut = 0;tipoCtrlId = 0;
	
   frecPelPuroId = 0;frecPelActId = 0;frecPelFutId = 0;
   frecPelPuroId = 0;frecPelActId = 0;frecPelFutId = 0;
   ipercDetalleEvalIdCopy = 0;detallesFullIperc=[];
	
   listSeveridad = null;listProbabilidad = null;listNivelRiesgo = null;

   idRiesgoEspecial = null;idRiesgoActEspecial = null;idRiesgoFutEspecial = null;
	
   deshabilitarBotonesEdicion();
	
   $("#btnConfigurar").show();
   $("#btnDescargar").show();
	
   $("#btnOkConf").attr("onclick","configurarIperc()");
	
   var dataParamAux={
      id: proyectoObj.id 
   };
	
   callAjaxPost(URL+"/contratista/proyecto/iperc/evaluaciones",dataParamAux,
      procesarListarTablaDetalleIperc)
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

function procesarListarTablaDetalleIperc(data) {

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
		var anchoEvaluacionActual,anchoEvaluacion2;
		var list = data.list;
		 detallesFullIperc=data.list;
		
		var mapRiesgo = data.mapRiesgo;
		//listSeveridad = mapRiesgo.severidades;
		//listProbabilidad = mapRiesgo.probabilidades;
		//listNivelRiesgo = mapRiesgo.nivelRiesgos;
		
		// 
		 listCategoriaProbabilidadEspecifica=data.categoria_probabilidad;
		 listCategoriaConsecuenciaEspecifica=data.categoria_consecuencia;
		 listTipoControlIperc=data.tipo_control;
		$("#tblMatrices tbody tr").remove();
		$("#tblMatrices thead tr").remove();
		 
		anchoEvaluacionActual=10;
		 anchoEvaluacion2=8;
		 anchoEvaluacionPx="1000px";
		 anchoEvaluacionActPx="1200px";
		 anchoEvaluacionFutPx="1200px";
		 columnaProbabilidad = "<th style='width:130px'>"+listCategoriaProbabilidadEspecifica[0].nombre+"</th>"
			+"<th style='width:190px'>"+listCategoriaProbabilidadEspecifica[1].nombre+"</th>"
			+"<th style='width:150px'>"+listCategoriaProbabilidadEspecifica[2].nombre+"</th>"
			+"<th style='width:130px'>"+listCategoriaProbabilidadEspecifica[3].nombre+"</th>"
			+"<th style='width:150px'>"+listCategoriaProbabilidadEspecifica[4].nombre+"</th>"
		 +"<th style='width:100px'>Probabilidad</th>";
		 if(proyectoObj.tipoIperc.id==1){
			 anchoEvaluacionActual=8;
			 anchoEvaluacion2=7;
			 columnaProbabilidad = "<th style='width:130px'>"+listCategoriaProbabilidadEspecifica[5].nombre+"</th>"
				+"<th style='width:190px'>"+listCategoriaProbabilidadEspecifica[6].nombre+"</th>"
				+"<th style='width:150px'>"+listCategoriaProbabilidadEspecifica[7].nombre+"</th>"
				+"<th style='width:130px'>"+listCategoriaProbabilidadEspecifica[8].nombre+"</th>" 
			 +"<th style='width:100px'>Probabilidad</th>";
		 }
		var cabeceraAux=""  
			+"<th class='tb-acc' rowspan='2' style='width:120px;'>Lugar</th>"
			
			+ "<th class='tb-acc' rowspan='2' style='width:150px;'>Tipo</th>"
			
			+ (proyectoObj.tipoIperc.id==1?"<th class='tb-acc' rowspan='2' style='width:150px;'>Sub Tipo</th>":"")
			
			+ "<th class='tb-acc' rowspan='2' style='width:150px;'>Frecuencia de tarea</th>"
			+ "<th class='tb-acc' rowspan='2' style='width:300px;'>Peligro / Aspecto / Falla</th>"
		+ "<th class='tb-acc' rowspan='2' style='width:300px;'>Descripción</th>"
		+ "<th class='tb-acc' rowspan='2' style='width:300px;'>Riesgo</th>"
		+ "<th class='tb-acc' rowspan='2' style='width:300px;'>Consecuencia / Impacto</th>"
		+ "<th class='tb-acc' rowspan='2' style='width:300px;'>Requisito Legal</th>"
		 
		
		+ "<th colspan='3' style='width:1020px;'>Controles Existentes</th>"
		+ "<th colspan='"+anchoEvaluacionActual+"' style='width:"+anchoEvaluacionActPx+"'' id='tituloEvalAct'>Nivel de Riesgo Actual</th>"

		+ "<th colspan='5' style='width:620px;'>Controles a Implementar</th>"
		+ "<th colspan='"+anchoEvaluacion2+"' style='width:"+anchoEvaluacionFutPx+"'' id='tituloEvalFuturo'>Nivel de Riesgo Residual Proyectado</th>"

		+ "</tr>" 
		
		+"<tr>"
		+ "<th class='tb-acc' style='width:270px;'>Ingeniería</th>"
		+ "<th class='tb-acc' style='width:270px;'>Administrativo</th>"
		
		+ "<th class='tb-acc' style='width:270px;'>Equipos de protección personal / colectivos</th>"

		+columnaProbabilidad
		+ "<th class='tb-acc' style='width:70px;'>Consecuencia</th>"
		+ (proyectoObj.tipoIperc.id==3?"<th class='tb-acc' rowspan='2' style='width:150px;'>Consecuencia (Reputación)</th>":"")
		+ "<th class='tb-acc' style='width:70px;'>Nivel de Riesgo</th>" 
		+ "<th style='width:120px'>¿Es significativo?</th>" 
		
		+ "<th class='tb-acc' style=''>1. Eliminación</th>"
		+ "<th class='tb-acc' style=''>2. Sustitución</th>"
		+ "<th class='tb-acc' style=''>3. Control de Ingeniería</th>"
		+ "<th class='tb-acc' style=''>4. Control Administrativo</th>"
		+ "<th class='tb-acc' style=''>5. Equipos de Protección</th>"

		+columnaProbabilidad
		+ "<th style='width:70px'>Consecuencia</th>"
		+ "<th style='width:70px'>Riesgo Residual</th>" 
		+"<tr>" ;
		
		 

				

		var cabecera6 = "<tr  style='background-color: #16365C; color: white;'>"
				+ "<th class='tb-acc' rowspan='2' style='width:50px;'>Nro</th>"
				+ "<th class='tb-acc' rowspan='2' style='width:150px'>División</th>"
				+ "<th class='tb-acc' rowspan='2' style='width:150px'>Área</th>"
				+ "<th class='tb-acc' rowspan='2' style='width:150px'>Puesto</th>"
				// Aca debo modificar

				+ "<th class='tb-acc' rowspan='2' style='width:150px;'>Actividad</th>"
				+ "<th class='tb-acc' id='tareaAux' rowspan='2' style='width:150px;'>Tarea</th>"

				+cabeceraAux;

		$("#tblMatrices thead").append(cabecera6);
		
		 
		$("#tblMatrices thead tr th").addClass("tb-acc");
		$("#tblMatrices tbody tr").remove();

		list.forEach(crearFilasDetalleIpercContratista);
		creaarFiltroIperc()
		$("#tblMatrices tbody tr").css("font-size","12px");
		$("#tblMatrices thead tr").css("font-size","12px");
		if(getSession("linkCalendarioDetalleIpercId")!=null){
			
			detallesFullIperc.every(function(val,index3){
				
				if(val.id==parseInt(getSession("linkCalendarioDetalleIpercId"))){
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
	
	goheadfixedY('#tblMatrices',"#wrapperIperc");
	resizeDivWrapper("wrapperIperc",160)
}
function crearFilasDetalleIpercContratista(val,index){
	var contador = index + 1;
	var evaluacionTresFilas = "";
	var consecuenciasFilas = "";
	var probabilidadFilasPuro="";
	var probabilidadFilasActual="";
	var probabilidadFilasFuturo="";
	
	var frecuenciaPura="";
	var frecuemciaActual="";
	var frecuenciaFutura="";
	var indicadorCons=1;
	if (indicadorCons == 1) {
		consecuenciasFilas = "<td id='trcons"
				+ val.id + "'>"
				+ val.consecuencia + "</td>";
	} else if (indicadorCons == 2) {
		consecuenciasFilas = "<td id='cons1"
				+ val.id + "'>"
				+ val.consecuencia1 + "</td>" + "<td id='cons2"
				+ val.id + "'>"
				+ val.consecuencia2 + "</td>" + "<td id='cons3"
				+ val.id + "'>"
				+ val.consecuencia3 + "</td>";
	}

	
	var idProbEspe=1;
	if(idProbEspe==0){
		probabilidadFilasPuro = "<td id='evainiprob"
			+ val.id + "'>"
			+ val.probabilidadNombre + "</td>";
		probabilidadFilasActual =  "<td id='evaactprob"
			+ val.id
			+ "'>"
			+ val.probabilidadActNombre
			+ "</td>";
		probabilidadFilasFuturo = "<td id='evaproyprob"
			+ val.id
			+ "'>"
			+ val.probabilidadProyNombre
			+ "</td>";
		
		
	
		
	}else{
		if(proyectoObj.tipoIperc.id==3){
		probabilidadFilasActual = ""  
			+ "<td id='probIndHist"
			+ val.id + "'>"
			+ val.evaluacion.probEspecif1.nombre + "</td>"
			
			+ "<td id='probIndDef"
			+ val.id + "'>"
			+ val.evaluacion.probEspecif2.nombre + "</td>" 
			
			+"<td id='probIndExp"
			+ val.id + "'>"
			+ val.evaluacion.probEspecif3.nombre+ "</td>"
			
			+ "<td id='persExp"
			+ val.id + "'>"
			+ val.evaluacion.probEspecif4.nombre + "</td>"
			
			+ "<td id='probCapa"
			+ val.id + "'>"
			+ val.evaluacion.probEspecif5.nombre + "</td>"
			+ "<td id='persExpAct"
			+ val.id + "'>"
			+ val.evaluacion.probEspecifFinal.nombre + "</td>"
			;
		
		probabilidadFilasFuturo = 
			 "<td id='probIndHistAct"
			+ val.id + "'>"
			+ val.evaluacionResidual.probEspecif1.nombre + "</td>"
			
			+ "<td id='probIndDefAct"
			+ val.id + "'>"
			+ val.evaluacionResidual.probEspecif2.nombre + "</td>" 
			
			+"<td id='probIndExpAct"
			+ val.id + "'>"
			+ val.evaluacionResidual.probEspecif3.nombre+ "</td>"
			
			+ "<td id='persExpAct"
			+ val.id + "'>"
			+ val.evaluacionResidual.probEspecif4.nombre + "</td>"
			
			+ "<td id='probCapaAct"
			+ val.id + "'>"
			+ val.evaluacionResidual.probEspecif5.nombre + "</td>"
			+ "<td id='persExpAct"
			+ val.id + "'>"
			+ val.evaluacionResidual.probEspecifFinal.nombre + "</td>"
			; 
		}
		var celdaSubTipo= "";
		if(proyectoObj.tipoIperc.id==1){
			celdaSubTipo="<td id='trstipce"
		+ val.id
		+ "'>"
		+ val.subTipo.nombre
		+ "</td>"
			probabilidadFilasActual = ""  
				+ "<td id='probIndHist"
				+ val.id + "'>"
				+ val.evaluacion.probEspecif1.nombre + "</td>"
				
				+ "<td id='probIndDef"
				+ val.id + "'>"
				+ val.evaluacion.probEspecif2.nombre + "</td>" 
				
				+"<td id='probIndExp"
				+ val.id + "'>"
				+ val.evaluacion.probEspecif3.nombre+ "</td>"
				
				+ "<td id='persExp"
				+ val.id + "'>"
				+ val.evaluacion.probEspecif4.nombre + "</td>"
				 
				+ "<td id='persExpAct"
				+ val.id + "'>"
				+ val.evaluacion.probEspecifFinal.nombre + "</td>"
				;
			
			probabilidadFilasFuturo = 
				 "<td id='probIndHistAct"
				+ val.id + "'>"
				+ val.evaluacionResidual.probEspecif1.nombre + "</td>"
				
				+ "<td id='probIndDefAct"
				+ val.id + "'>"
				+ val.evaluacionResidual.probEspecif2.nombre + "</td>" 
				
				+"<td id='probIndExpAct"
				+ val.id + "'>"
				+ val.evaluacionResidual.probEspecif3.nombre+ "</td>"
				
				+ "<td id='persExpAct"
				+ val.id + "'>"
				+ val.evaluacionResidual.probEspecif4.nombre + "</td>" 
				+ "<td id='persExpAct"
				+ val.id + "'>"
				+ val.evaluacionResidual.probEspecifFinal.nombre + "</td>"
				;  
		}
		
	}
	var idEvalFrec=false;
	if(idEvalFrec){
		frecuenciaPura="<td id='frecPelPuro"+val.id+"'>" 
		+ val.frecuenciaPeligroPuraNombre + "</td>";
		frecuemciaActual="<td id='frecPelAct"+val.id+"'>" 
		+ val.frecuenciaPeligroActNombre + "</td>";
		frecuenciaFutura="<td id='frecPelFut"+val.id+"'>" 
		+ val.frecuenciaPeligroFutNombre + "</td>";
		
	}
	var idFlagEvalIni=false;
	if (idFlagEvalIni) {
		evaluacionTresFilas =frecuenciaPura+ probabilidadFilasPuro
				+ "<td id='evainisev" + val.id
				+ "'>" + val.severidadNombre + "</td>"
				+ "<td id='evaininiv" + val.id
				+ "' style='background-color:"
				+ val.nivelRiesgoColor + ";font-weight:bold' >"
				+ "" + val.nivelRiesgoNombre + "</td>";
	} 

		var propiedades1 = estadoControl(val.indicadorControl1.retrasados,
				val.indicadorControl1.implementar,
				val.indicadorControl1.completados);
		var propiedades2 = estadoControl(val.indicadorControl2.retrasados,
				val.indicadorControl2.implementar,
				val.indicadorControl2.completados);
		var propiedades3 = estadoControl(val.indicadorControl3.retrasados,
				val.indicadorControl3.implementar,
				val.indicadorControl3.completados);
		var propiedades4 = estadoControl(val.indicadorControl4.retrasados,
				val.indicadorControl4.implementar,
				val.indicadorControl4.completados);
		var propiedades5 = estadoControl(val.indicadorControl5.retrasados,
				val.indicadorControl5.implementar,
				val.indicadorControl5.completados); 
		var colorControles="#81F7F3";
		var consecuenciaReputacion="";
		if(proyectoObj.tipoIperc.id==3){
			consecuenciaReputacion="<td id='trreputa"
			+ val.id
			+ "'>"
			+ val.evaluacion.consecuenciaReputacion.nombre
			+ "</td>"
		}
		var cuerpoAux=""   
				+"<td id='lugar"
		+ val.id
		+ "'>"
		+ val.lugar
		+ "</td>"
		
		+ "<td id='trtipce"
		+ val.id
		+ "'>"
		+ val.tipo.nombre
		+ "</td>"
		+celdaSubTipo
		+ "<td id='tripfrec"
		+ val.id
		+ "'>"
		+ val.frecuencia.nombre
		+ "</td>"
		+ "<td id='trippel"
		+ val.id
		+ "'>"
		+ val.peligro
		+ "</td>"
		+ "<td id='tripdpel"
		+ val.id
		+ "'>"
		+ val.descripcionPeligro
		+ "</td>"
		+ "<td id='tripries"
		+ val.id
		+ "'>"
		+ val.riesgo
		+ "</td>"
		+ consecuenciasFilas

		+ evaluacionTresFilas
		+ "<td id='trreqleg"
		+ val.id
		+ "'>"
		+ val.requisitoLegal
		+ "</td>"
		+ "<td   id='1ctrlini"
		+ val.id
		+ "'>"
		+ val.control1
		+ "</td>"
		+ "<td   id='2ctrlini"
		+ val.id
		+ "'>"
		+ val.control2
		+ "</td>"
		+ "<td   id='3ctrlini"
		+ val.id
		+ "'>"
		+ val.control3
		+ "</td>"
		
		 
		+frecuemciaActual
		+probabilidadFilasActual
		+ "<td id='evaactsev"
		+ val.id
		+ "'>"
		+ val.evaluacion.consecuenciaEspecifica.nombre
		+ "</td>"
		+consecuenciaReputacion
		+ "<td id='evaactniv"
		+ val.id
		+ "' style='background-color:"
		+ val.evaluacion.nivelRiesgo.color
		+ ";font-weight:bold' >"
		+ val.evaluacion.nivelRiesgo.nombre
		+ "</td>" 
		
		+"<td>"
		+(listBoolean[val.evaluacion.isSignificativo].nombre)
		+"</td>"
		
		+ "<td id='1ctrlImpl"
		+ val.id
		+ "' style='color:"
		+ propiedades1.color
		+ ";font-weight:bold'>"
		+ devolverTagCtrl(val.indicadorControl1.total)
		+ ""
		+ propiedades1.icono
		+ "</td>"
		+ "<td id='2ctrlImpl"
		+ val.id
		+ "' style='color:"
		+ propiedades2.color
		+ ";font-weight:bold'>"
		+ devolverTagCtrl(val.indicadorControl2.total)
		+ ""
		+ propiedades2.icono
		+ "</td>"
		+ "<td id='3ctrlImpl"
		+ val.id
		+ "' style='color:"
		+ propiedades3.color
		+ ";font-weight:bold'>"
		+ devolverTagCtrl(val.indicadorControl3.total)
		+ ""
		+ propiedades3.icono
		+ "</td>"
		+ "<td id='4ctrlImpl"
		+ val.id
		+ "' style='color:"
		+ propiedades4.color
		+ ";font-weight:bold'>"
		+ devolverTagCtrl(val.indicadorControl4.total)
		+ ""
		+ propiedades4.icono
		+ "</td>"
		+ "<td id='5ctrlImpl"
		+ val.id
		+ "' style='color:"
		+ propiedades5.color
		+ ";font-weight:bold'>"
		+ devolverTagCtrl(val.indicadorControl5.total)
		+ ""
		+ propiedades5.icono
		+ "</td>"
		+frecuenciaFutura
		+ probabilidadFilasFuturo
		+ "<td id='evaproysev"
		+ val.id
		+ "' >"
		+ val.evaluacionResidual.consecuenciaEspecifica.nombre
		+ "</td>"
		+ "<td id='evaproyniv"
		+ val.id
		+ "' style='background-color:"
		+ val.evaluacionResidual.nivelRiesgo.color
		+ ";font-weight:bold'>"
		+ val.evaluacionResidual.nivelRiesgo.nombre
		+ "</td>" ;
		
		$("#tblMatrices tbody")
		.append(
				"<tr id='trm" + val.id + "' " +
						" >"+

						 "<td>"+
						 contador+
						 "</td>"+
						 "<td id='trdivi" + val.id + "' >"+
						 val.division+
						 "</td>"+
						 "<td id='trarea" + val.id + "' >"+
						 val.area+
						 "</td>"+
						"<td id='trpuesto" + val.id + "' >"+ 
						 val.puesto+
						 "</td>"+
						 "<td id='tractiv" + val.id + "' >"+
						 val.actividad+
						"</td>"+
						 "<td id='trtarea" + val.id + "' >"+
						 val.tarea+
						"</td>"+ 
						cuerpoAux+
						 "</tr>");
		listTipoControlIperc.forEach(function(val1,index1){
			$("#"+(index1+1)+"ctrlImpl"+val.id).addClass("linkGosst")
			.on("click",function(){verControlesEvaluacionIperc(index,val1.id);}) 
		});
	
} 
function verControlesEvaluacionIperc(evalIndex,tipoId){
	var tipoControlNombre="";
	listTipoControlIperc.forEach(function(val,index){
		if(val.id==tipoId){
			tipoControlNombre=val.nombre
		}
	});
	$("#tabProyectos .container-fluid").hide();
	$("#divControlEvalIpercProy").show();
	$("#tabProyectos h2")
	.html("<a onclick='volverDivProyectos()'>Proyecto ("+
			proyectoObj.titulo+") </a> " +
			"> <a onclick='volverDivIpercProy()'>Evaluación IPERC Peligro:" +
			""+detallesFullIperc[evalIndex].peligro+" </a>" +
					"> Controles "+tipoControlNombre);
	
	callAjaxPost(URL + '/contratista/proyecto/iperc/evaluacion/controles', 
			{id:detallesFullIperc[evalIndex].id}, function(data){
				$("#tblControlIperc tbody tr").remove();
				data.list.forEach(function(val,index){
					if(val.tipo.id==tipoId){ 
					var eviLink="<br><a class='btn btn-success' target='_blank'" +
							" href='"+URL+"/contratista/proyecto/iperc/evaluacion/control/evidencia?id="+val.id+"' >" +
									"<i aria-hidden='true' class='fa fa-download'></i>Descargar </a>";
					if(val.evidenciaNombre==""){
						eviLink="";	
					}
					$("#tblControlIperc tbody").append("<tr>" +
							"<td>"+val.descripcion+"</td>" +
							"<td>"+val.fechaPlanificadaTexto+"</td>" +
							"<td>"+val.evidenciaNombre+eviLink+"</td>" +
							"<td>"+val.fechaRealTexto+"</td>" +
							"" +
							"</tr>");
					}
				})
		
	})
	
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
  
 
          

function configurarIperc() {
	var flgEvalIni = 0;
	var flgProbEsp=0;
	var indCons = 0;
	var flagFrecPel=0;
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
		
		var dataParam = {
			ipercId : idIPERCEdicion,
			matrizRiesgoId : $("#selectNR option:selected").val(),
			flagEvaluacionInicial : flgEvalIni,
			flagProbabilidadEspecifica : flgProbEsp,
			flagEvaluacionFrecuencia:flagFrecPel,
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
		idMatrizRiesgo = $("#selectNR option:selected").val();
		indicadorCons = $("#selectCons option:selected").val();
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
		banderaEdicionIperc = false;
		break;
	default:
		alert("Ocurrió un error al resetear Evaluaciones!");
	
	}
	
}
     
   