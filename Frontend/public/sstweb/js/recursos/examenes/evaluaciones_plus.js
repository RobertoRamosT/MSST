/**
 * 
 */
var listFullEvaluacionesPlus;
var evaluacionPlusObj={};
var banderaEdicionPlus;
function volverDivEvaluacionesMedicasPlus(){
	$("#mdProgFecha .modal-body").hide();
	$("#mdProgFecha #modalEvalPlus").show();
	$("#mdProgFecha .modal-title").html(
			"<a onclick='volverProgramacionesMedicas()'>Registro del día "+programaTipExObj.fechaFinTexto+"</a> " +
			"> Evaluaciones médicas");
}
function verEvaluacionMedicaPlus(){
	volverDivEvaluacionesMedicasPlus()
	cargarEvaluacionesMedicasPlus();
}

function volverProgramacionesMedicas(){
	$("#mdProgFecha .modal-body").hide();
	$("#mdProgFecha #modalProg").show();
	$("#mdProgFecha .modal-title").html("Programación Exámenes Médicos");
}
function cancelarEvaluacionesMedicasPlus(){
	cargarEvaluacionesMedicasPlus();
}
function cargarEvaluacionesMedicasPlus(){
	$("#btnVolverEvalucionPlus").hide().attr("onclick","cancelarEvaluacionesMedicasPlus()");
	$("#btnGuardarEvaluacionPlus").hide().attr("onclick","guardarEvaluacionMedicasPlus()");
	var dataParam = {
			programaTipExId : programaTipExObj.programaTipExId,
			idCompany : getSession("gestopcompanyid")
		};
	banderaEdicionPlus=false;
	evaluacionPlusObj={};
		callAjaxPost(
				URL + '/examenmedico/programacion/trabajadores/asistidos',
				dataParam,function(data) {
					listFullEvaluacionesPlus=data.evalPlus;
					$("#wrapEvalPlus table tbody tr").remove();
					listFullEvaluacionesPlus.forEach(function(val,index){ 
						$("#wrapEvalPlus table tbody").append(
						"<tr onclick='editarEvaluacionPlusMedica("+index+")'>" +
						"<td id=''>"+val.trabajador.dni+"</td>"+
						"<td>"+val.trabajador.nombre+"</td>" +
						"<td id='tdeviplus"+val.id+"'>"+val.evidenciaNombre+"</td>" +
						"<td id='tdeviexplus"+val.id+"'>"+val.evidenciaExamenNombre+"</td>" +
						"<td id='tdtipplus"+val.id+"'>"+val.tipoDiscapacidadNombre+"</td>" +
						"<td  id='tdhallplus"+val.id+"'>"+val.numHallazgos+"</td>" +
						"</tr>"		
						); 
					});
					formatoCeldaSombreableTabla(true,"wrapEvalPlus table");
				});
		
}

function editarEvaluacionPlusMedica(pindex){
	if(!banderaEdicionPlus){
		$("#btnVolverEvalucionPlus").show();
		$("#btnGuardarEvaluacionPlus").show();
		banderaEdicionPlus=true;
		evaluacionPlusObj=listFullEvaluacionesPlus[pindex];
		formatoCeldaSombreableTabla(false,"wrapEvalPlus table");
		var options=
		{container:"#tdeviplus"+evaluacionPlusObj.id,
				functionCall:function(){ },
				descargaUrl: "/examenmedico/programacion/evaluacion/evidencia?id="+evaluacionPlusObj.id,
				esNuevo:false,
				idAux:"EvaluacionPlus",
				evidenciaNombre:evaluacionPlusObj.evidenciaNombre};
		crearFormEvidenciaCompleta(options);
		
		var options=
		{container:"#tdeviexplus"+evaluacionPlusObj.id,
				functionCall:function(){ },
				descargaUrl: "/examenmedico/programacion/evaluacion/evidencia_examen?id="+evaluacionPlusObj.id,
				esNuevo:false,
				idAux:"EvaluacionExamenPlus",
				evidenciaNombre:evaluacionPlusObj.evidenciaExamenNombre};
		crearFormEvidenciaCompleta(options);
		
		
		var selTipoEvaluacionPlus= crearSelectOneMenuOblig("selTipoEvaluacionPlus", "", listDisca, evaluacionPlusObj.tipoDiscapacidadId, 
				"tipoDiscapacidad","tipoDiscapacidadNombre");
		$("#tdtipplus"+evaluacionPlusObj.id).html(selTipoEvaluacionPlus);
		
		$("#tdhallplus"+evaluacionPlusObj.id).addClass("linkGosst")
		.on("click",function(){verHallazgosExamenMedico();})
		.html("<i class='fa fa-list fa-2x' aria-hidden='true' ></i>"+evaluacionPlusObj.numHallazgos);
		
		
	}
	
}
function guardarEvaluacionMedicasPlus(){
	var evalObj={
			id:evaluacionPlusObj.id,
			restriccion:$("#asd").val(),
			tipoDiscapacidadId:$("#selTipoEvaluacionPlus").val(),
			progMedicaId:programaTipExObj.programaTipExId
		}	
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/unitario/save', evalObj, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			guardarEvidenciaAuto(evaluacionPlusObj.id,"fileEviEvaluacionPlus"
					,bitsEvidenciaObservacion,"/examenmedico/programacion/evaluacion/evidencia/save"
					,function(){
				guardarEvidenciaAuto(evaluacionPlusObj.id,"fileEviEvaluacionExamenPlus"
						,bitsEvidenciaObservacion,"/examenmedico/programacion/evaluacion/evidencia_examen/save"
						,cargarEvaluacionesMedicasPlus); 
			}); 
			
			break;
		}
	})
	
}

function verHallazgosExamenMedico(){
	volverDivHallazgosExamenMedico();
	cargarHallazgosEvaluacionMedica();
}



