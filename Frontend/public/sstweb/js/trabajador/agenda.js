/**
 * 
 */
var agendaReunionId;
var banderaEdicionAgenda;
var listFullAgenda;
function llamarAgendasReunion(){
	agendaReunionId=0;
	banderaEdicionAgenda=false;
	listFullAgenda=[];
	$("#btnAgregarAgenda").show();
	$("#btnCancelarAgenda").hide();
	$("#btnEliminarAgenda").hide();
	$("#btnGuardarAgenda").hide();
	
	$("#btnAgregarAgenda").attr("onclick", "javascript:nuevoAgenda();");
	$("#btnCancelarAgenda").attr("onclick", "javascript:llamarAgendasReunion();");
	$("#btnGuardarAgenda").attr("onclick", "javascript:guardarAgenda();");
	$("#btnEliminarAgenda").attr("onclick", "javascript:eliminarAgenda();");
	
	var dataParam={id:reunionId}
	callAjaxPost(URL + '/trabajador/reunion/agendas', dataParam, function(data) {
		
		var list = data.list;
		listFullAgenda=data.list;
		$("#tblAgeReunion tbody").html("");
		listFullAgenda.forEach(function(val,index){
			$("#tblAgeReunion tbody").append("<tr onclick='javascript:editarAgenda("+
					index+")' >"+
					"<td id='ageOrd"+
					list[index].id + "'>"+
					(index+1) + "</td>" + 
					"<td id='ageNom"+
					list[index].id + "'>"+
					list[index].nombre + "</td>" +
					"<td id='ageResp"+
					list[index].id + "'>"+
					list[index].responsable + "</td>" +
					"<td id='ageTiempo"+
					list[index].id + "'>"+
					list[index].tiempo + "</td>" +
					"</tr>")
		});
	
		formatoCeldaSombreableTabla(true,"tblAgeReunion");
	
});
	
}
function editarAgenda(pindex){
	if(!banderaEdicionAgenda){
		banderaEdicionAgenda=true;
		$("#btnAgregarAgenda").hide();
		$("#btnCancelarAgenda").show();
		$("#btnEliminarAgenda").show();
		$("#btnGuardarAgenda").show();
		formatoCeldaSombreableTabla(false,"tblAgeReunion");
		agendaReunionId=listFullAgenda[pindex].id;
		var nombre=listFullAgenda[pindex].nombre;
		var responsable=listFullAgenda[pindex].responsable;
		var tiempo=listFullAgenda[pindex].tiempo;
		$("#ageNom"+agendaReunionId).html("<input class='form-control' id='inputAgeNom'>");
		$("#inputAgeNom").val(nombre);
		$("#ageResp"+agendaReunionId).html("<input class='form-control' id='inputAgeResp'>");
		$("#inputAgeResp").val(responsable);
		
		$("#ageTiempo"+agendaReunionId).html("<input type='number' class='form-control' id='inputAgeTiempo'>");
		$("#inputAgeTiempo").val(tiempo);
	}
}
function nuevoAgenda(){
	$("#btnAgregarAgenda").hide();
	$("#btnCancelarAgenda").show();
	$("#btnEliminarAgenda").hide();
	$("#btnGuardarAgenda").show();
	banderaEdicionAgenda=true;
	
	agendaReunionId = 0;
	$("#tblAgeReunion tbody")
			.append(
					"<tr id='tr0'>"
					+"<td>...</td>"
					+"<td><input class='form-control' id='inputAgeNom'></td>" +
							"<td><input class='form-control' id='inputAgeResp'></td>"+
					"<td><input type='number' class='form-control' id='inputAgeTiempo'></td>"+ "</tr>");
	formatoCeldaSombreableTabla(false,"tblAgeReunion");
}

function eliminarAgenda(){
	var agendaObj={
			id:agendaReunionId
	}
	var r=confirm("¿Está seguro de eliminar este punto de agenda?");
	if(r){
		callAjaxPost(URL + '/trabajador/reunion/agenda/delete', agendaObj,
				function(data) {
					
					
			llamarAgendasReunion();
					
				});
	}
	
}

function guardarAgenda(){
	var nombre=$("#inputAgeNom").val();
	var responsable=$("#inputAgeResp").val();
	var tiempo=$("#inputAgeTiempo").val();
var campoVacio=false;
	if(nombre.length==0 || responsable.length==0){
		campoVacio=true;
	}
	
	if(campoVacio){
		alert("Complete el campo")
	}else{
		var agendaObj={
				id:agendaReunionId,
				nombre:nombre,
				responsable:responsable,
				tiempo:tiempo,
				reunionId:reunionId
		}
		
		callAjaxPost(URL + '/trabajador/reunion/agenda/save', agendaObj,
				function(data) {
					
					
			llamarAgendasReunion();
					
				});
	}
	
	
	
	
	
	
	
	
}




