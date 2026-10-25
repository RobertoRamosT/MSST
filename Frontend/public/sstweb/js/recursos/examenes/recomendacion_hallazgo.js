/**
 * 
 */
var listFullRecomendacionesHallazgo;
var recomendacionHallazgoObj;
var banderaEdicionRecom;
function verRecomendacionesHallazgo(){
	volverDivRecomendacionesHallazgo();
	cargarRecomendacionesHallazgo();
}
function volverDivRecomendacionesHallazgo(){
	$("#mdProgFecha .modal-body").hide();
	$("#mdProgFecha #modalRecomHall").show();
	$("#mdProgFecha .modal-title").html(
			"<a onclick='volverProgramacionesMedicas()'>Registro del día "+programaTipExObj.fechaFinTexto+"</a> " +
			"> <a onclick='volverDivEvaluacionesMedicasPlus()'>Evaluación Médica Trabajador "+evaluacionPlusObj.trabajador.nombre+"</a>" +
					"> <a onclick='volverDivHallazgosExamenMedico()'> Hallazgo: "+hallazgoMedicoObj.descripcion+"</a>" +
							"> Recomendaciones");
}
function cancelarRecomendacionesHallazgo(){
	cargarRecomendacionesHallazgo();
}
function cargarRecomendacionesHallazgo(){
	resizeDivWrapper("wrapRecoHall",350)
	$("#btnCancelarRecoHall").hide().attr("onclick","cancelarRecomendacionesHallazgo()");
	$("#btnAgregarRecoHall").show().attr("onclick","agregarRecomendacionHallazgo()");
	$("#btnEliminarRecoHall").hide().attr("onclick","eliminarRecomendacionHallazgo()");
	$("#btnGuardarRecoHall").hide().attr("onclick","guardarRecomendacionHallazgo()");
	banderaEdicionRecom=false;
	var dataParam = {
			id : hallazgoMedicoObj.id
		};
	recomendacionHallazgoObj={id:0}
		callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgo/recomendaciones', dataParam, function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				listFullRecomendacionesHallazgo= data.list;
				$("#wrapRecoHall table tbody tr").remove();
				listFullRecomendacionesHallazgo.forEach(function(val,index) {
					$("#wrapRecoHall table tbody").append(
							"<tr  onclick='editarRecomendacionHallazgo("+index+")'>"
									+"<td id='recodesc"+val.id+"'>"+val.descripcion +"</td>"
									+"<td id='recofp"+val.id+"'>"+val.fechaPlanificadaTexto +"</td>"
									+"<td id='recofr"+val.id+"'>"+val.fechaRealTexto +"</td>"
									+"<td id='recoevi"+val.id+"'>"+val.evidenciaNombre +"</td>"
									+"<td id='recoest"+val.id+"'>"+val.estado.nombre+"</td>" 
										+"</tr>");
					
				});
				formatoCeldaSombreableTabla(true,"wrapRecoHall table");
				break;
			default:
				alert("Ocurrió un error al traer las recomendaicones!");
			}
		})
}

function agregarRecomendacionHallazgo(){
	if(!banderaEdicionRecom){
		banderaEdicionRecom=true;
		$("#btnCancelarRecoHall").show() 
		$("#btnAgregarRecoHall").hide() 
		$("#btnEliminarRecoHall").hide() 
		$("#btnGuardarRecoHall").show() 
		
		$("#wrapRecoHall table tbody").prepend(
				"<tr  >" 
						+ "<td  >"
						+"<input id='inputDescRecoHall' class='form-control' autofocus='true'>" +"</td>" 
						+"<td  ><input id='datePlanRecoHall' class='form-control' type='date' onchange='cambiarAcuerdoFechaRecomnedacion()'>" +"</td>" 
						+"<td  ><input id='dateRealRecoHall' class='form-control' type='date' onchange='cambiarAcuerdoFechaRecomnedacion()'>" +"</td>" 
							+"<td id='recoevi0' ></td>" 
							+"<td id='recoest0' ></td>" +
									"</tr>");
		var options=
		{container:"#recoevi"+recomendacionHallazgoObj.id,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"RecomendacionHallazgo",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
		
		formatoCeldaSombreableTabla(false,"wrapRecoHall table");
		
	}
}
function cambiarAcuerdoFechaRecomnedacion(){
	var fechaPlanificada=$("#datePlanRecoHall").val();
	var fechaReal=$("#dateRealRecoHall").val();
	 
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		recomendacionHallazgoObj.estado={
				id:2,nombre:"Completado"
		}
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				recomendacionHallazgoObj.estado={
						id:3,nombre:"Retrasado"
				}
			}else{
				recomendacionHallazgoObj.estado={
						id:1,nombre:"Por Implementar"
				}
			}
			
		}else{
			recomendacionHallazgoObj.estado={
					id:1,nombre:"Por Implementar"
			}
		}
	}
	
	$("#recoest"+recomendacionHallazgoObj.id).html(recomendacionHallazgoObj.estado.nombre);
}
function guardarRecomendacionHallazgo(){ 
	var descripcion=$("#inputDescRecoHall").val();
	var fechaPlan=convertirFechaTexto($("#datePlanRecoHall").val());
	var fechaReal=convertirFechaTexto($("#dateRealRecoHall").val());
	
	var objHallazgo={
			id:recomendacionHallazgoObj.id,
			descripcion:descripcion,
			fechaPlanificada:fechaPlan,
			fechaReal:fechaReal,
			estado:recomendacionHallazgoObj.estado,
			hallazgo:{id:hallazgoMedicoObj.id}
	}
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgo/recomendacion/save', objHallazgo, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			
			guardarEvidenciaAuto(data.nuevoId,"fileEviRecomendacionHallazgo"
					,bitsEvidenciaObservacion,"/examenmedico/programacion/evaluacion/hallazgo/recomendacion/evidencia/save"
					,cargarRecomendacionesHallazgo); 
			break;
		}
	})
	
	
}
function eliminarRecomendacionHallazgo(){
	var r=confirm("¿Esta seguro de eliminar la restricción?");
	if(r){
	var objHallazgo={
			id:recomendacionHallazgoObj.id 
	}
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgo/recomendacion/delete', objHallazgo, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			cargarRecomendacionesHallazgo();
			
			break;
			default: alert("Ocurrió un error")
				break;
		}
	})
	}
}
function editarRecomendacionHallazgo(pindex){
	if(!banderaEdicionRecom){
		banderaEdicionRecom=true;
		formatoCeldaSombreableTabla(false,"wrapRecoHall table");
		$("#btnCancelarRecoHall").show() 
		$("#btnAgregarRecoHall").hide() 
		$("#btnEliminarRecoHall").show() 
		$("#btnGuardarRecoHall").show()
		recomendacionHallazgoObj=listFullRecomendacionesHallazgo[pindex];
		
		
		
		$("#resdesc"+recomendacionHallazgoObj.id)
		.html("<input class='form-control' id='inputDescRecoHall'>")
		$("#inputDescRecoHall").val(recomendacionHallazgoObj.descripcion);
		
		$("#recofp"+recomendacionHallazgoObj.id)
		.html("<input id='datePlanRecoHall' class='form-control' type='date' onchange='cambiarAcuerdoFechaRecomnedacion()'>")
		$("#datePlanRecoHall").val(convertirFechaInput(recomendacionHallazgoObj.fechaPlanificada));
		
		$("#recofr"+recomendacionHallazgoObj.id)
		.html("<input id='dateRealRecoHall' class='form-control' type='date' onchange='cambiarAcuerdoFechaRecomnedacion()'>")
		$("#dateRealRecoHall").val(convertirFechaInput(recomendacionHallazgoObj.fechaReal));
		
		cambiarAcuerdoFechaRecomnedacion();
		
		var options=
		{container:"#recoevi"+recomendacionHallazgoObj.id,
				functionCall:function(){ },
				descargaUrl: "/examenmedico/programacion/evaluacion/hallazgo/recomendacion/evidencia?id="+recomendacionHallazgoObj.id,
				esNuevo:false,
				idAux:"RecomendacionHallazgo",
				evidenciaNombre:recomendacionHallazgoObj.evidenciaNombre};
		crearFormEvidenciaCompleta(options);
	}
} 