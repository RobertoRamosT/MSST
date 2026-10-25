/**
 * 
 */
var listFullHallazgoMedico;
var listCategoriasHallazgoMedico;
var hallazgoMedicoObj;
var banderaEdicionHallMedico;
function volverDivHallazgosExamenMedico(){
	$("#mdProgFecha .modal-body").hide();
	$("#mdProgFecha #modalHallazgoEvalPlus").show();
	$("#mdProgFecha .modal-title").html(
			"<a onclick='volverProgramacionesMedicas()'>Registro del día "+programaTipExObj.fechaFinTexto+"</a> " +
			"> <a onclick='volverDivEvaluacionesMedicasPlus()'>Evaluación Médica Trabajador "+evaluacionPlusObj.trabajador.nombre+"</a>" +
					"> Hallazgos");
}
function cancelarHallazgoEvaluacionMedica(){
	cargarHallazgosEvaluacionMedica();
}
function cargarHallazgosEvaluacionMedica(){
	$("#btnCancelarHall").hide().attr("onclick","cancelarHallazgoEvaluacionMedica()");
	$("#btnAgregarHall").show().attr("onclick","agregarHallazgoEvaluacionMedica()");
	$("#btnEliminarHall").hide().attr("onclick","eliminarHallazgoEvaluacionMedica()");
	$("#btnGuardarHall").hide().attr("onclick","guardarHallazgoEvaluacionMedica()");
	banderaEdicionHallMedico=false;
	var dataParam = {
			id : evaluacionPlusObj.id
		};
	hallazgoMedicoObj={id:0}
		callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgos', dataParam, function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				listFullHallazgoMedico= data.list; 
				listCategoriasHallazgoMedico= data.categorias; 
				$("#wrapHallEval table tbody tr").remove();
				listFullHallazgoMedico.forEach(function(val,index) {
					 
					$("#wrapHallEval table tbody").append(
							"<tr  onclick='editarHallazgoEvalacionMedica("+index+")'>"
									+ "<td id='hallcat"
									+ val.id + "'>"
									+val.categoria.nombre +"</td>"
									+ "<td id='halldesc"
									+ val.id + "'>"
									+val.descripcion +"</td>"
									+ "<td id='hallreco"
									+ val.id + "'>"
									+val.recomendacion +"</td>" 
									+ "<td id='hallres"
									+ val.id + "'>"
									+val.restriccion+"</td>" 
									+ "<td id='hallfp"
									+ val.id + "'>"
									+val.fechaPlanificadaTexto+"</td>" 
									+ "<td id='hallhp"
									+ val.id + "'>"
									+val.horaPlanificadaTexto+"</td>" 
									+ "<td id='hallfr"
									+ val.id + "'>"
									+val.fechaRealTexto+"</td>" 
									+ "<td id='hallest"
									+ val.id + "'>"
									+val.estado.nombre+"</td>" 
										+"</tr>");
					
				});
				formatoCeldaSombreableTabla(true,"wrapHallEval table");
				break;
			default:
				alert("Ocurrió un error al traer las programaciones!");
			}
		})
}

function agregarHallazgoEvaluacionMedica(){
	if(!banderaEdicionHallMedico){
		banderaEdicionHallMedico=true;
		$("#btnCancelarHall").show() 
		$("#btnAgregarHall").hide() 
		$("#btnEliminarHall").hide() 
		$("#btnGuardarHall").show()
		var selCategoriaHallMedico= crearSelectOneMenuOblig("selCategoriaHallMedico", "", 
				listCategoriasHallazgoMedico, "", 
				"id","nombre");
		
		$("#wrapHallEval table tbody").prepend(
				"<tr  >"
						+ "<td>"
						+selCategoriaHallMedico +"</td>"
						+ "<td><input id='inputDescHallMedico' class='form-control'>" +"</td>"
						+ "<td><input id='inputRecoHallMedico' class='form-control'></td>" 
						+ "<td><input id='inputRestHallMedico' class='form-control'></td>" 
						+ "<td><input type='date' id='datePlanHallMedico' class='form-control' onchange='cambiarAcuerdoFechaHallazgo()'></td>" 
						+ "<td><input type='time' id='timePlanHallMedico' class='form-control' ></td>" 
						+ "<td>...</td>" 
						+ "<td id='hallest0'>...</td>" 
							+"</tr>");
		$("#wrapHallEval").find("#datePlanHallMedico").val(obtenerFechaActual())
		$("#wrapHallEval").find("#timePlanHallMedico").val("12:00:00")
		formatoCeldaSombreableTabla(false,"wrapHallEval table");
		cambiarAcuerdoFechaHallazgo();
	}
}

function guardarHallazgoEvaluacionMedica(){
	var categoria=$("#selCategoriaHallMedico").val();
	var descripcion=$("#inputDescHallMedico").val();
	var recomendacion=$("#inputRecoHallMedico").val();
	var restriccion=$("#inputRestHallMedico").val();
	var fechaPlanificada=convertirFechaTexto($("#datePlanHallMedico").val());
	var horaPlanificada=$("#timePlanHallMedico").val();
	var objHallazgo={
			id:hallazgoMedicoObj.id,
			descripcion:descripcion,
			categoria:{id:categoria},
			recomendacion:recomendacion,
			restriccion:restriccion,
			fechaPlanificada:fechaPlanificada,
			horaPlanificada:horaPlanificada,
			estado:{id:hallazgoMedicoObj.estado.id},
			evaluacion:{id:evaluacionPlusObj.id}
	}
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgo/save', objHallazgo, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			cargarHallazgosEvaluacionMedica();
			
			break;
		}
	})
	
	
}
function eliminarHallazgoEvaluacionMedica(){
	var r=confirm("¿Esta seguro de eliminar el hallazgo?");
	if(r){
	var objHallazgo={
			id:hallazgoMedicoObj.id 
	}
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgo/delete', objHallazgo, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			cargarHallazgosEvaluacionMedica();
			
			break;
			default:alert("Elimine las restricciones y/o recomendaciones asociadas.")
				break;
		}
	})
	}
}
function editarHallazgoEvalacionMedica(pindex){
	if(!banderaEdicionHallMedico){
		banderaEdicionHallMedico=true;
		formatoCeldaSombreableTabla(false,"wrapHallEval table");
		$("#btnCancelarHall").show() 
		$("#btnAgregarHall").hide() 
		$("#btnEliminarHall").show() 
		$("#btnGuardarHall").show()
		hallazgoMedicoObj=listFullHallazgoMedico[pindex];
		
		$("#halldesc"+hallazgoMedicoObj.id)
		.html("<input class='form-control' id='inputDescHallMedico'>")
		$("#inputDescHallMedico").val(hallazgoMedicoObj.descripcion);
		
		var selCategoriaHallMedico= crearSelectOneMenuOblig("selCategoriaHallMedico", "", 
				listCategoriasHallazgoMedico, hallazgoMedicoObj.categoria.id, 
				"id","nombre");
		$("#hallcat"+hallazgoMedicoObj.id)
		.html(selCategoriaHallMedico);
		
		$("#hallreco"+hallazgoMedicoObj.id)
		.html("<input class='form-control' id='inputRecoHallMedico'>")
		$("#inputRecoHallMedico").val(hallazgoMedicoObj.recomendacion);
		
		$("#hallres"+hallazgoMedicoObj.id)
		.html("<input class='form-control' id='inputRestHallMedico'>")
		$("#inputRestHallMedico").val(hallazgoMedicoObj.restriccion);
		
		$("#hallfp"+hallazgoMedicoObj.id)
		.html("<input type='date' class='form-control' id='datePlanHallMedico' onchange='cambiarAcuerdoFechaHallazgo()'>")
		$("#datePlanHallMedico").val(convertirFechaInput(hallazgoMedicoObj.fechaPlanificada));
		
		$("#hallhp"+hallazgoMedicoObj.id)
		.html("<input type='time' class='form-control' id='timePlanHallMedico'>")
		$("#timePlanHallMedico").val(hallazgoMedicoObj.horaPlanificada);
		
		cambiarAcuerdoFechaHallazgo();
	}
}

function cambiarAcuerdoFechaHallazgo(){
	var fechaPlanificada=$("#datePlanHallMedico").val();
	var fechaReal=convertirFechaInput(hallazgoMedicoObj.fechaReal);
	 
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		hallazgoMedicoObj.estado={
				id:2,nombre:"Completado"
		}
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				hallazgoMedicoObj.estado={
						id:3,nombre:"Retrasado"
				}
			}else{
				hallazgoMedicoObj.estado={
						id:1,nombre:"Por Implementar"
				}
			}
			
		}else{
			hallazgoMedicoObj.estado={
					id:1,nombre:"Por Implementar"
			}
		}
	}
	
	$("#hallest"+hallazgoMedicoObj.id).html(hallazgoMedicoObj.estado.nombre);
}
