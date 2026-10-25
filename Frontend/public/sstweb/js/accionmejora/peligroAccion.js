/**
 * 
 */
var peligrosAsociadosTotal;
var peligroId;
var banderaEdicion12;

var i;

$('#mdPeligroAsociado').on('show.bs.modal', function(e) {
	$("#mdCorr").modal("hide");
	$("#mdCorrInmediata").modal("hide");
});

$('#mdPeligroAsociado').on('hide.bs.modal', function(e) {
	if(i == 1){
      $("#mdCorrInmediata").modal("show");
	}else{
	  $("#mdCorr").modal("show");
	}
});

$('#mdCorrInmediata').on('show.bs.modal', function(e) {
	i=1;
});
$('#mdCorr').on('show.bs.modal', function(e) {
	i=0;
});


function verPeligrosAsoiados(){
	$("#mdPeligroAsociado").modal("show");
	
	$("#btnCancelarPel").hide();
	$("#btnNuevaPel").show();
	$("#btnGuardarPel").hide();
	$("#btnEliminarPel").hide();

	$("#btnNuevaPel").attr("onclick", "javascript:nuevoPeligroAccion();");
	$("#btnCancelarPel").attr("onclick", "javascript:cancelarPeligroAccion();");
	$("#btnGuardarPel").attr("onclick", "javascript:guardarPeligroAccion();");
	$("#btnEliminarPel").attr("onclick", "javascript:eliminarPeligroAsociado();");

	banderaEdicion12=false;
	var object={
			accionId:accionMejoraId
	}
	callAjaxPost(URL + '/gestionaccionmejora/accionmejora/peligros', object,
			procesarPeligrosAccion);
}

function procesarPeligrosAccion(data){
	switch(data.CODE_RESPONSE){
	case "05":
		peligrosAsociadosTotal=data.list;
		$("#tblPeligroAccion tbody tr").remove();
		peligrosAsociadosTotal.forEach(function(val,index){
			$("#tblPeligroAccion tbody").append(
			"<tr id='trpel"+val.peligroId+"' onclick='editarPeligroAccion("+index+")'>" +
			"<td id='tddesc"+val.peligroId+"'>"+val.peligroName+"</td>" +
			"<td id='tdcons"+val.peligroId+"'>"+val.consecuencia+"</td>" +

		
			"</tr>"		
			);
			
		});
		break;
		default:
			console.log("ERror al trar peligros");
			break;
	}
}


function editarPeligroAccion(pindex){
	if(!banderaEdicion12){
		banderaEdicion12=true;
		 peligroId=peligrosAsociadosTotal[pindex].peligroId;
		var descripcionPeligro=peligrosAsociadosTotal[pindex].peligroName;
		var consecuenciaPeligro=peligrosAsociadosTotal[pindex].consecuencia;

		$("#tddesc" + peligroId)
		.html(
				"<input type='text' id='inputDescPel' class='form-control' value='"
						+ descripcionPeligro + "'>");
		$("#tdcons" + peligroId)
		.html(
				"<input type='text' id='inputConsPel' class='form-control' value='"
						+ consecuenciaPeligro + "'>");
		
		$("#btnCancelarPel").show();
		$("#btnNuevaPel").hide();
		$("#btnGuardarPel").show();
		$("#btnEliminarPel").show();
	}
}


function guardarPeligroAccion(){
	var peligroDescripcion=$("#inputDescPel").val();
	var consecuencia=$("#inputConsPel").val();
	var campoVacio=false;
	
	if(peligroDescripcion.trim()==""){
		campoVacio=true;
	}
	
	if(!campoVacio){
		var object={
				peligroId:peligroId,
				peligroName:peligroDescripcion,
				consecuencia:consecuencia,
				accionId:accionMejoraId
		}
		
		
		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/peligro/save', object,
				function(data){
			if(data.CODE_RESPONSE=="05"){
				verPeligrosAsoiados();
			}else{
				alert("error al guardar")
			}
		});
		
		
	}
	
	
}


function nuevoPeligroAccion(){
	
	if(!banderaEdicion12){
		banderaEdicion12=true;
		peligroId=0;
		$("#tblPeligroAccion tbody").append(
		"<tr>" +
		"<td><input id='inputDescPel' class='form-control'></td>" +
		"<td><input id='inputConsPel' class='form-control'></td>" +

		"</tr>"
				
		);
		$("#btnCancelarPel").show();
		$("#btnNuevaPel").hide();
		$("#btnGuardarPel").show();
		$("#btnEliminarPel").hide();
	}else{
		alert("guarde primero antes de crear uno nuevo")
	}
	
	
	
}


function cancelarPeligroAccion(){
	verPeligrosAsoiados();
}

function eliminarPeligroAsociado(){
var r=confirm("esta seguro de eliminar este peligro asociado?");


if(r){
	var object={
			peligroId:peligroId
	}
	callAjaxPost(URL + '/gestionaccionmejora/accionmejora/peligro/delete', object,
			function(data){
		if(data.CODE_RESPONSE=="05"){
			verPeligrosAsoiados();
		}else{
			alert("error al eliminar")
		}
	});
	
	
}


	
}