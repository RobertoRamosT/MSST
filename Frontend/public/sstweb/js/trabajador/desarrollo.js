/**
 * 
 */
var desarrolloReunionId;
var banderaEdicionDesarrollo;
var listFullDesarrollo;
function llamarDesarrollosReunion(){
	desarrolloReunionId=0;
	banderaEdicionDesarrollo=false;
	listFullDesarrollo=[];
	$("#btnAgregarDesarrollo").show();
	$("#btnCancelarDesarrollo").hide();
	$("#btnEliminarDesarrollo").hide();
	$("#btnGuardarDesarrollo").hide();
	
	$("#btnAgregarDesarrollo").attr("onclick", "javascript:nuevoDesarrollo();");
	$("#btnCancelarDesarrollo").attr("onclick", "javascript:llamarDesarrollosReunion();");
	$("#btnGuardarDesarrollo").attr("onclick", "javascript:guardarDesarrollo();");
	$("#btnEliminarDesarrollo").attr("onclick", "javascript:eliminarDesarrollo();");
	
	var dataParam={id:reunionId}
	callAjaxPost(URL + '/trabajador/reunion/desarrollos', dataParam, function(data) {
		
		var list = data.list;
		listFullDesarrollo=data.list;
		$("#tblDesaReunion tbody").html("");
		listFullDesarrollo.forEach(function(val,index){
			$("#tblDesaReunion tbody").append("<tr onclick='javascript:editarDesarrollo("+
					index+")' >"+
					"<td id='desOrd"+
					list[index].id + "'>"+
					(index+1) + "</td>" + 
					"<td id='desaNom"+
					list[index].id + "'>"+
					list[index].nombre + "</td>" + 
					"</tr>")
		});
	
		formatoCeldaSombreableTabla(true,"tblDesaReunion");
	
});
	
}
function editarDesarrollo(pindex){
	if(!banderaEdicionDesarrollo){
		banderaEdicionDesarrollo=true;
		$("#btnAgregarDesarrollo").hide();
		$("#btnCancelarDesarrollo").show();
		$("#btnEliminarDesarrollo").show();
		$("#btnGuardarDesarrollo").show();
		formatoCeldaSombreableTabla(false,"tblDesaReunion");
		desarrolloReunionId=listFullDesarrollo[pindex].id;
		var nombre=listFullDesarrollo[pindex].nombre;
		var responsable=listFullDesarrollo[pindex].responsable;
		var tiempo=listFullDesarrollo[pindex].tiempo;
		$("#desaNom"+desarrolloReunionId).html("<input class='form-control' id='inputDesaNom'>");
		$("#inputDesaNom").val(nombre);
		 
		 
	}
}
function nuevoDesarrollo(){
	$("#btnAgregarDesarrollo").hide();
	$("#btnCancelarDesarrollo").show();
	$("#btnEliminarDesarrollo").hide();
	$("#btnGuardarDesarrollo").show();
	banderaEdicionDesarrollo=true;
	
	desarrolloReunionId = 0;
	$("#tblDesaReunion tbody")
			.append(
					"<tr id='tr0'>"+
					"<td>...</td>"
					+"<td><input class='form-control' id='inputDesaNom'></td>" +
					"</tr>");
	formatoCeldaSombreableTabla(false,"tblDesaReunion");
}

function eliminarDesarrollo(){
	var agendaObj={
			id:desarrolloReunionId
	}
	var r=confirm("¿Está seguro de eliminar este punto de desarrollo?");
	if(r){
		callAjaxPost(URL + '/trabajador/reunion/desarrollo/delete', agendaObj,
				function(data) {
					
					
			llamarDesarrollosReunion();
					
				});
	}
	
}

function guardarDesarrollo(){
	var nombre=$("#inputDesaNom").val();
var campoVacio=false;
	if(nombre.length==0 ){
		campoVacio=true;
	}
	
	if(campoVacio){
		alert("Complete el campo")
	}else{
		var agendaObj={
				id:desarrolloReunionId,
				nombre:nombre,
				reunionId:reunionId
		}
		
		callAjaxPost(URL + '/trabajador/reunion/desarrollo/save', agendaObj,
				function(data) {
					
					
			llamarDesarrollosReunion();
					
				});
	}
	
	
	
	
	
	
	
	
}




