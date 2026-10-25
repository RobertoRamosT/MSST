
var listFullAccCalificacion=[];
var accCalifId;
var accCalifObj;

function verCalificacionAccidente(){ 
	$("#generalModuloAccidente .container-fluid").hide();
	$("#divContainAccidenteCalificacion").show();
	$("#generalModuloAccidente").find("h2")
	.html("<a onclick=' volverDivAccidente()'>Accidente: "+accidenteObj.accidenteDescripcion+"</a>"
			+" > Calificación del accidente por responsables de áre");
	resizeDivWrapper("wrapAccidenteCalificacion",160);
	cargarCalificacionAccidente();
}
function cargarCalificacionAccidente()
{
	$("#btnCancelarCalifAcc").hide();
	$("#btnNuevoCalifAcc").hide();
	$("#btnGuardarCalifAcc").hide();
	$("#btnEliminarCalifAcc").hide();
	
	callAjaxPost(URL + '/accidente/colaborador/evaluado', {
		accidenteId:accidenteObj.accidenteId}, 
		function(data){
			if(data.CODE_RESPONSE=="05"){
				banderaEdicion2=false;
				listFullAccCalificacion=data.list;  
				$("#tblAccidenteCalificacion tbody tr").remove();
				listFullAccCalificacion.forEach(function(val,index){ 
				var replicar="";
				if(val.replicar==null)
				{					
					replicar="Pendiente";
				}
				else if(val.replicar==1)
				{
					replicar="Si";
				}
				else if(val.replicar==0)
				{
					replicar="No";
				}
				$("#tblAccidenteCalificacion tbody").append(
						"<tr id='tracccal"+val.id+"' >"
						+"<td id='acccalunidad"+val.id+"'>"+val.areaEvaluada.matrixName+"</td>" 
						+"<td id='acccaldiv"+val.id+"'>"+val.areaEvaluada.divisionName+"</td>" 
							+"<td id='acccalarea"+val.id+"'>"+val.areaEvaluada.areaName+"</td>" 
							+"<td id='acccalrespon"+val.id+"'>"+val.trabajador.nombre+"</td>" 
							+"<td id='acccalfechaRspta"+val.id+"'>"+val.fechaRsptaTexto+"</td>" 
							+"<td id='acccaldias"+val.id+"'>"+val.diasRspta+"</td>" 
							+"<td id='acccalreplicar"+val.id+"'>"+replicar+"</td>" 
							+"<td id='acccalaccmejora"+val.id+"'><a class='efectoLink' onclick='marcarFiltroAreaId("+val.areaEvaluada.areaId+");verAccionesAreaAccidente("+index+")'>"
							+val.numAccionesCompletas+" / "+val.numAccionesTotal+"</a></td>" 
							
						+"</tr>");
				});
				completarBarraCarga();
				goheadfixedY("#tblAccidenteCalificacion","#wrapAccidenteCalificacion")
				
				//formatoCeldaSombreableTabla(true,"tblAccidenteCalificacion");
			}else{
				console.log("NOPNPO")
			}
		});
}
function marcarFiltroAreaId(areaId){
	$("#selAreasCalif").val(parseInt(areaId));
}
var listFullAccionesAreaAccidente = [];
function verAccionesAreaAccidente(isFull){
	var areaId = parseInt($("#selAreasCalif").val());
	console.log(areaId);
	$("#generalModuloAccidente .container-fluid").hide();
	$("#divContainAccidenteCalificacionArea").show();
	$("#generalModuloAccidente").find("h2")
	.html("<a onclick=' volverDivAccidente()'>Accidente: "+accidenteObj.accidenteDescripcion+"</a>"
			+" > <a onclick='verCalificacionAccidente()'>Calificación de áreas </a>" +
					" > Acciones de Mejora asociadas");
	resizeDivWrapper("wrapAccidenteCalificacionArea",250);
	var dataParam = {accidenteId : accidenteObj.accidenteId,
			areaId : (areaId ==0? null: areaId)};
	callAjaxPost(URL+"/accidente/areas/acciones",dataParam,function(data){
		$("#tblAccidenteCalificacionArea tbody tr").remove();
		
		listFullAccionesAreaAccidente = data.acciones;
		listFullAccionesAreaAccidente.forEach(function(val){
			var btnEvi ="";
			if(val.evidenciaNombre == null){
				btnEvi = "Sin registrar"
			}else{
				btnEvi = "<a href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.accionMejoraId+" '  " +
						"class='efectoLink' target='_blank'>"+val.evidenciaNombre+"</a>"
			}
			$("#tblAccidenteCalificacionArea tbody").append(
			"<tr>" +
			"<td>"+val.escenario.area.areaName+"</td>" +
			"<td>"+val.escenario.actividad+"</td>" +
			"<td>"+val.descripcion+"</td>" +
			"<td>"+val.trabajadorResponsableNombre+"</td>" +
			
			"<td>"+val.fechaRevisionTexto+"</td>" +
			"<td>"+val.estado.icono+val.estadoCumplimientoNombre+"</td>" +
			"<td>"+btnEvi+"</td>" +
			"</tr>"		
			
			);
		});
		
	});
	
	
	
}