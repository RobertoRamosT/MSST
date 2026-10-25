/**
 * 
 */
var listFullRestriccionesHallazgo;
var restriccionHallazgoObj;
var banderaEdicionRestricc;
function verRestriccionesHallazgo(){
	volverDivRestriccionesHallazgo();
	cargarRestriccionesHallazgo();
}
function volverDivRestriccionesHallazgo(){
	$("#mdProgFecha .modal-body").hide();
	$("#mdProgFecha #modalRestriccionHall").show();
	$("#mdProgFecha .modal-title").html(
			"<a onclick='volverProgramacionesMedicas()'>Registro del día "+programaTipExObj.fechaFinTexto+"</a> " +
			"> <a onclick='volverDivEvaluacionesMedicasPlus()'>Evaluación Médica Trabajador "+evaluacionPlusObj.trabajador.nombre+"</a>" +
					"> <a onclick='volverDivHallazgosExamenMedico()'> Hallazgo: "+hallazgoMedicoObj.descripcion+"</a>" +
							"> Restricciones");
}
function cancelarRestriccionesHallazgo(){
	cargarRestriccionesHallazgo();
}
function cargarRestriccionesHallazgo(){
	$("#btnCancelarResHall").hide().attr("onclick","cancelarRestriccionesHallazgo()");
	$("#btnAgregarResHall").show().attr("onclick","agregarRestriccionHallazgo()");
	$("#btnEliminarResHall").hide().attr("onclick","eliminarRestriccionHallazgo()");
	$("#btnGuardarResHall").hide().attr("onclick","guardarRestriccionHallazgo()");
	banderaEdicionRestricc=false;
	var dataParam = {
			id : hallazgoMedicoObj.id
		};
	restriccionHallazgoObj={id:0}
		callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgo/restricciones', dataParam, function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				listFullRestriccionesHallazgo= data.list;
				$("#wrapRestHall table tbody tr").remove();
				listFullRestriccionesHallazgo.forEach(function(val,index) {
					$("#wrapRestHall table tbody").append(
							"<tr  onclick='editarRestriccionHallazgo("+index+")'>"
									+"<td id='resdesc"+val.id+"'>"+val.descripcion +"</td>"
										+"</tr>");
					
				});
				formatoCeldaSombreableTabla(true,"wrapRestHall table");
				break;
			default:
				alert("Ocurrió un error al traer las resttricciones!");
			}
		})
}

function agregarRestriccionHallazgo(){
	if(!banderaEdicionRestricc){
		banderaEdicionRestricc=true;
		$("#btnCancelarResHall").show() 
		$("#btnAgregarResHall").hide() 
		$("#btnEliminarResHall").hide() 
		$("#btnGuardarResHall").show() 
		
		$("#wrapRestHall table tbody").prepend(
				"<tr  >" 
						+ "<td  >"
						+"<input id='inputDescResHall' class='form-control'>" +"</td>" 
							+"</tr>");
		formatoCeldaSombreableTabla(false,"wrapRestHall table");
		
	}
}

function guardarRestriccionHallazgo(){ 
	var descripcion=$("#inputDescResHall").val();
	
	var objHallazgo={
			id:restriccionHallazgoObj.id,
			descripcion:descripcion, 
			hallazgo:{id:hallazgoMedicoObj.id}
	}
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgo/restriccion/save', objHallazgo, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			cargarRestriccionesHallazgo();
			
			break;
		}
	})
	
	
}
function eliminarRestriccionHallazgo(){
	var r=confirm("¿Esta seguro de eliminar la restricción?");
	if(r){
	var objHallazgo={
			id:restriccionHallazgoObj.id 
	}
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgo/restriccion/delete', objHallazgo, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			cargarRestriccionesHallazgo();
			
			break;
			default: alert("Ocurrió un error")
				break;
		}
	})
	}
}
function editarRestriccionHallazgo(pindex){
	if(!banderaEdicionRestricc){
		banderaEdicionRestricc=true;
		formatoCeldaSombreableTabla(false,"wrapRestHall table");
		$("#btnCancelarResHall").show() 
		$("#btnAgregarResHall").hide() 
		$("#btnEliminarResHall").show() 
		$("#btnGuardarResHall").show()
		restriccionHallazgoObj=listFullRestriccionesHallazgo[pindex];
		
		
		
		$("#resdesc"+restriccionHallazgoObj.id)
		.html("<input class='form-control' id='inputDescResHall'>")
		$("#inputDescResHall").val(restriccionHallazgoObj.descripcion); 
	}
} 
