/**
 * 
 */
var listFullVersiones;
var banderaEdicionVersion;
var versionIpercId;
var estadoVersion;
function llamarVersionesIperc(){
	banderaEdicionVersion=false;
	estadoVersion={};
	$("#btnAgregarVersion").show().attr("onclick","nuevaVersionIperc()");
	$("#btnCancelarVersion").hide().attr("onclick","cancelarVersionIperc()");
	$("#btnGuardarVersion").hide().attr("onclick","guardarVersionIperc()");
	$("#btnEliminarVersion").hide().attr("onclick","eliminarVersionIperc()");
	
	$("#modalUpload").hide();
	$("#tblVersionesIperc tbody").html("");
	var dataParam = {
			ipercId : idIPERCEdicion
	};

	callAjaxPost(URL + '/iperc/versiones', dataParam, function(data){
		if(data.CODE_RESPONSE=="05"){
			listFullVersiones=data.versiones;
			data.versiones.forEach(function(val,index){
				
				$("#tblVersionesIperc tbody").append("" +
						"<tr onclick='editarVersionIperc("+index+")' id='trver"+val.id+"'>" +
						"<td id='desc"+val.id+"'>"+val.descripcion+"</td>" +
						"<td id='fecpla"+val.id+"'>"+val.fechaPlanificadaTexto+"</td>" +
						"<td id='horpla"+val.id+"'>"+val.horaPlanificadaTexto+"</td>" +
						"<td id='fecact"+val.id+"'>"+val.fechaActualizacionTexto+"</td>" +"<td id='tdresp"+val.id+"'>"+val.responsable+"</td>" + 
						"<td id='tdinvver"+val.id+"'>"+val.inversion+"</td>" +
						"<td id='tdmodi"+val.id+"'>"+val.modificacion+"</td>" +
						"<td id='tdevi"+val.id+"'>"+val.evidenciaNombre+"</td>" + 
						"<td id='tdestver"+val.id+"'>"+val.estado.nombre+"</td>" + 
				"</tr>")
			});
			
			if(getSession("linkCalendarioVersionId")!=null){
				
				listFullVersiones.every(function(val,index3){
					
					if(val.id==parseInt(getSession("linkCalendarioVersionId"))){
						editarVersionIperc(index3);
						
						
						sessionStorage.removeItem("linkCalendarioVersionId");
						return false;
					}else{
						return true;
					}
				});
				
			}
			
			formatoCeldaSombreableTabla(true,"tblVersionesIperc");
			
		}
	},function(){});
	

	
}

function editarVersionIperc(pindex){
	if(!banderaEdicionVersion){
		banderaEdicionVersion=true;
		$("#btnAgregarVersion").hide();
		$("#btnCancelarVersion").show();
		$("#btnGuardarVersion").show();
		$("#btnEliminarVersion").show();
		formatoCeldaSombreableTabla(false,"tblVersionesIperc");
		versionIpercId=listFullVersiones[pindex].id;
		var descripcion=listFullVersiones[pindex].descripcion;
		var fechaPlanificada=convertirFechaInput(listFullVersiones[pindex].fechaPlanificada);
		var horaPlanificada=listFullVersiones[pindex].horaPlanificada;
		var fechaActualizacion=convertirFechaInput(listFullVersiones[pindex].fechaActualizacion);
		var responsable=listFullVersiones[pindex].responsable;
		var modificacion=listFullVersiones[pindex].modificacion;
		var inversion=listFullVersiones[pindex].inversion;
$("#desc"+versionIpercId).html("<input class='form-control' id='descVersion'>");
		$("#fecpla"+versionIpercId).html("<input class='form-control' id='fechaPlaVersion' onchange='hallarEstadoImplementacionVersion()' type='date'>");
		$("#horpla"+versionIpercId).html("<input class='form-control' id='horaPlaVersion' type='time'>");
		$("#fecact"+versionIpercId).html("<input class='form-control' id='fechaActVersion' type='date' onchange='hallarEstadoImplementacionVersion()'>");
$("#tdresp"+versionIpercId).html("<input class='form-control' id='respVersion'>");
		$("#tdevi"+versionIpercId).html(
				"<a id='linkEvidencia' " +
				"href='"+URL 
				+ "/iperc/version/evidencia?versionId="+versionIpercId+"' target='_blank' >" +
				listFullVersiones[pindex].evidenciaNombre+	"</a><br/>" +
				"<a id='linkEvidencia' href='#' onclick='javascript:editarEvidencia();'>Subir</a>");
		$("#tdmodi"+versionIpercId).html("<input class='form-control' id='modVersion'>");
		$("#tdinvver"+versionIpercId).html("<input type='number' class='form-control' id='inversionVersion'>");
		
		$("#descVersion").val(descripcion);
		$("#fechaPlaVersion").val(fechaPlanificada);
		$("#horaPlaVersion").val(horaPlanificada);
		$("#fechaActVersion").val(fechaActualizacion);
		$("#respVersion").val(responsable);
		$("#modVersion").val(modificacion);
		$("#inversionVersion").val(inversion);
		
		ponerListaSugerida("respVersion",listanombretab,true);
		hallarEstadoImplementacionVersion();
}
}
function editarEvidencia(){
	$("#modalVersion").hide();
	$("#modalUpload").show();
}
function cancelarUploadEvidenciaVersion(){
	$("#modalVersion").show();
	$("#modalUpload").hide();
}
function uploadEvidenciaVersion(){
	$.blockUI({
		message : 'cargando...'
	});
	guardarEvidenciaAuto(versionIpercId,"fileEviVersion",bitsEvidenciaVersion,
			"/iperc/version/evidencia/save",function(){
		var inputFileImage = document.getElementById("fileEviVersion");
		var file = inputFileImage.files[0];
		$("#tdevi"+versionIpercId).html(file.name);
		$.unblockUI();
		$("#modalVersion").show();
		$("#modalUpload").hide();
	},"versionId");
  
	 
}
function guardarVersionIperc(){
	var campoVacio = true; 
	var descripcion=$("#descVersion").val();
	var fechaPlanificada=convertirFechaTexto($("#fechaPlaVersion").val());
	var fechaActualizacion=convertirFechaTexto($("#fechaActVersion").val());
	var horaPlanificada=$("#horaPlaVersion").val();
	var inversion=$("#inversionVersion").val();
var responsable=$("#respVersion").val();
	var modificacion=$("#modVersion").val();
	if ($("#descVersion").val().length == 0) {
		campoVacio = false;
	} 
	if (campoVacio) {

		var dataParam = { 
				id:versionIpercId,
				descripcion:descripcion,
				fechaPlanificada:fechaPlanificada,
				horaPlanificada:horaPlanificada,
				fechaActualizacion:fechaActualizacion,
				modificacion:modificacion,
				responsable:responsable,
				inversion:inversion,
				estado:estadoVersion,
				ipercId:idIPERCEdicion
		};
console.log(dataParam);
		callAjaxPost(URL + '/iperc/version/save', dataParam, procesarEliminarVersionIperc);
	} else {
		alert("Debe ingresar la versión");
	}
}
function eliminarVersionIperc() {
	var r = confirm("¿Está seguro de eliminar la versión de IPERC?");
	if (r == true) {
		var dataParam = {
				id : versionIpercId,
		};

		callAjaxPost(URL + '/iperc/version/delete', dataParam, procesarEliminarVersionIperc);
	}

}

function procesarEliminarVersionIperc(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		 
		llamarVersionesIperc(); 
		break;
	default:
		alert("Ocurrió un error al eliminar la versión!");
	}
}

function nuevaVersionIperc(){
	if(!banderaEdicionVersion){
		$("#btnAgregarVersion").hide();
		$("#btnCancelarVersion").show();
		$("#btnGuardarVersion").show();
		$("#btnEliminarVersion").show();
		banderaEdicionVersion=true;
		versionIpercId=0;
		$("#tblVersionesIperc tbody").append("<tr id='trver0'>" +
				"<td><input class='form-control' id='descVersion'></td>" +
				"<td><input class='form-control' id='fechaPlaVersion' type='date' onchange='hallarEstadoImplementacionVersion()'></td>" +
				"<td><input class='form-control' id='horaPlaVersion' type='time' value='12:00:00'></td>" +
				"<td><input class='form-control' id='fechaActVersion' type='date' onchange='hallarEstadoImplementacionVersion()'></td>" +

"<td><input class='form-control' id='respVersion'></td>" +
"<td><input class='form-control' id='inversionVersion' type='number'></td>" +
				"<td><input class='form-control' id='modVersion'></td>" +
				"<td>...</td>" +"<td id='tdestver0'> ...</td>" +
				"<tr>");
		ponerListaSugerida("respVersion",listanombretab,true);
		formatoCeldaSombreableTabla(false,"tblVersionesIperc");
	}
	
}

function cancelarVersionIperc(){
	llamarVersionesIperc();
}


function hallarEstadoImplementacionVersion(){
	
	var fechaPlanificada=$("#fechaPlaVersion").val();
	var fechaReal=$("#fechaActVersion").val();
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		estadoVersion={id:2,
		nombre:"Completado"};
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				estadoVersion={
						id:3,
						nombre:"Retrasado"};
			}else{
				estadoVersion={
						id:1,
						nombre:"Por implementar"};
			}
			
		}else{
			estadoVersion={
					id:1,
					nombre:"Por implementar"};
			
		}
	}
	
	$("#tdestver"+versionIpercId).html(estadoVersion.nombre);
	
}
