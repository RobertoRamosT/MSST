/**
 * 
 */
var subSugeridoId;
var banderaEdicionSub;
var listFullSubSugerido;
function llamarSubSugeridoIperc(){
	subSugeridoId=0;
	banderaEdicionSub=false;
	listFullSubSugerido=[];
	$("#btnAgregarSugeridoSub").show().attr("onclick","nuevoSugeridoSub()");
	$("#btnCancelarSugeridoSub").hide().attr("onclick","llamarSubSugeridoIperc()");
	$("#btnEliminarSugeridoSub").hide().attr("onclick","eliminarSugeridoSub()");
	$("#btnGuardarSugeridoSub").hide().attr("onclick","guardarSugeridoSub()");
	var dataParam={id:comboSugeridoId}
	callAjaxPost(URL + '/iperc/detalle/sugerido/subs', dataParam, function(data) {
		
		var list = data.list;
		listFullSubSugerido=data.list;
		$("#tblSubDetalleSugerido tbody").html("");
		listFullSubSugerido.forEach(function(val,index){
			$("#tblSubDetalleSugerido tbody").append("<tr onclick='javascript:editarSugeridoSub("+
					index+")' >"+
					"<td id='lugSub"+val.ipercDetailEvalID + "'>"+
					val.descripcionLugar + "</td>" +
					"<td id='selClaSub"+val.ipercDetailEvalID + "'>"+
					val.clasificacionName + "</td>" +
					"<td id='pelSub"+val.ipercDetailEvalID + "'>"+
					val.peligroName + "</td>" +
					"<td id='descSub"+val.ipercDetailEvalID + "'>"+
					val.descripcionPeligro + "</td>" +
					"<td id='riesgoSub"+val.ipercDetailEvalID + "'>"+
					val.riesgoName + "</td>" +
					"<td id='consSub"+val.ipercDetailEvalID + "'>"+
					val.consecuencia1 + "</td>" +
					"<td id='contaSub"+val.ipercDetailEvalID + "'>"+
					val.controlInicial1 + "</td>" +
					"<td id='contbSub"+val.ipercDetailEvalID + "'>"+
					val.controlInicial2 + "</td>" +
					"<td id='contcSub"+val.ipercDetailEvalID + "'>"+
					val.controlInicial3 + "</td>" +
					"</tr>")
		});
	
		formatoCeldaSombreableTabla(true,"tblSubDetalleSugerido");
	
});
	
}
function editarSugeridoSub(pindex){
	if(!banderaEdicionSub){
		banderaEdicionSub=true;
		$("#btnAgregarSugeridoSub").hide();
		$("#btnCancelarSugeridoSub").show();
		$("#btnEliminarSugeridoSub").show();
		$("#btnGuardarSugeridoSub").show();
		formatoCeldaSombreableTabla(false,"tblSubDetalleSugerido");
		subSugeridoId=listFullSubSugerido[pindex].ipercDetailEvalID;
	 
		var lugar=listFullSubSugerido[pindex].descripcionLugar;
		var selClasificacionSub=listFullSubSugerido[pindex].idClasificacion;
		var listaClasi = JSON.parse(sessionStorage.getItem("clasifs"));
		var slcClasificacionSub=crearSelectOneMenu("selClasificacionSub",
				"", listaClasi, selClasificacionSub,
		"clasificacionId", "clasificacionNombre");
		var peligro=listFullSubSugerido[pindex].peligroName;
		var descripcion=listFullSubSugerido[pindex].descripcionPeligro;
		var riesgo=listFullSubSugerido[pindex].riesgoName;
		var consecuencia=listFullSubSugerido[pindex].consecuencia1;
		var control1=listFullSubSugerido[pindex].controlInicial1;
		var control2=listFullSubSugerido[pindex].controlInicial2;
		var control3=listFullSubSugerido[pindex].controlInicial3;
		
		$("#lugSub"+subSugeridoId).html("<input class='form-control' id='inputLugarSub'>");
		$("#inputLugarSub").val(lugar);
		$("#selClaSub"+subSugeridoId).html(slcClasificacionSub);
		$("#pelSub"+subSugeridoId).html("<input class='form-control' id='inputPeligroSub'>");
		$("#inputPeligroSub").val(peligro);
		$("#descSub"+subSugeridoId).html("<input class='form-control' id='inputDescSub'>");
		$("#inputDescSub").val(descripcion);
		$("#riesgoSub"+subSugeridoId).html("<input class='form-control' id='inputRiesgoSub'>");
		$("#inputRiesgoSub").val(riesgo);
		$("#consSub"+subSugeridoId).html("<input class='form-control' id='inputConseSub'>");
		$("#inputConseSub").val(consecuencia);
		$("#contaSub"+subSugeridoId).html("<input class='form-control' id='inputControlASub'>");
		$("#inputControlASub").val(control1);
		$("#contbSub"+subSugeridoId).html("<input class='form-control' id='inputControlBSub'>");
		$("#inputControlBSub").val(control2);
		$("#contcSub"+subSugeridoId).html("<input class='form-control' id='inputControlCSub'>");
		$("#inputControlCSub").val(control3);
	}
}
function nuevoSugeridoSub(){
	$("#btnAgregarSugeridoSub").hide();
	$("#btnCancelarSugeridoSub").show();
	$("#btnEliminarSugeridoSub").hide();
	$("#btnGuardarSugeridoSub").show();
	banderaEdicionSub=true;
	var listaClasi = JSON.parse(sessionStorage.getItem("clasifs"));
	var slcClasificacionSub=crearSelectOneMenu("selClasificacionSub",
			"", listaClasi, "-1",
	"clasificacionId", "clasificacionNombre");
	subSugeridoId = 0;
	$("#tblSubDetalleSugerido tbody")
			.append(
					"<tr id='tr0'>"
					+"<td><input class='form-control' id='inputLugarSub'></td>"
					+"<td>"+slcClasificacionSub+"</td>"
					+"<td><input class='form-control' id='inputPeligroSub'></td>"
					+"<td><input class='form-control' id='inputDescSub'></td>"
					+"<td><input class='form-control' id='inputRiesgoSub'></td>"
					+"<td><input class='form-control' id='inputConseSub'></td>"
					+"<td><input class='form-control' id='inputControlASub'></td>"
					+"<td><input class='form-control' id='inputControlBSub'></td>"
					+"<td><input class='form-control' id='inputControlCSub'></td>"
					
							+ "</tr>");
	formatoCeldaSombreableTabla(false,"tblSubDetalleSugerido");
}

function eliminarSugeridoSub(){
	var objetivoObj={
			ipercDetailEvalID:subSugeridoId
	}
	var r=confirm("¿Está seguro de eliminar este detalle?");
	if(r){
		callAjaxPost(URL + '/iperc/detalle/sugerido/sub/delete', objetivoObj,
				function(data) {
					
					
			llamarSubSugeridoIperc();
					
				});
	}
	
}

function guardarSugeridoSub(){
	var lugar=$("#inputLugarSub").val();
	var selClasificacionSub=$("#selClasificacionSub").val();
	var peligro=$("#inputPeligroSub").val();
	var descripcion=$("#inputDescSub").val();
	var riesgo=$("#inputRiesgoSub").val();
	var consecuencia=$("#inputConseSub").val();
	var control1=$("#inputControlASub").val();
	var control2=$("#inputControlBSub").val();
	var control3=$("#inputControlCSub").val();
	var campoVacio=false;
	if(lugar.length==0){
		campoVacio=true;
	}
	
	if(campoVacio){
		alert("Complete el campo")
	}else{
		var objetivoObj={
				ipercDetailEvalID:subSugeridoId,
				descripcionLugar:lugar,
				idClasificacion:selClasificacionSub,
				peligroName:peligro,
				descripcionPeligro:descripcion,
				riesgoName:riesgo,
				consecuencia1:consecuencia,
				controlInicial1:control1,
				controlInicial2:control2,
				controlInicial3:control3,
				
				combo:{id:comboSugeridoId}
		}
		
		callAjaxPost(URL + '/iperc/detalle/sugerido/sub/save', objetivoObj,
				function(data) {
					
					
			llamarSubSugeridoIperc();
					
				});
	}
	
	
	
	
	
	
	
	
}




