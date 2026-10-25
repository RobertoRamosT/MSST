var banderaEdicion9;
var hallazgoMonitoreoId;
var listHallazgoMonitoreoFull;
var tablaFijaHallazgoMonitoreo=false;
var hallazgoObj;
var listSeccionesInteresadasMonitoreoHall;
var listAreasInteresadasMonitoreoHall;
function cargarHallazgoMonitoreosNeutral(){
	banderaEdicion9 = false;
	hallazgoMonitoreoId = 0;hallazgoObj={id:0}
	$("#btnNuevoHallMon").show();
	$("#btnEliminarHallMon").hide();
	$("#btnVolverHallMon").hide();
	$("#btnGuardarHallMon").hide();
	
	$("#btnNuevoHallMon").attr("onclick", "javascript:nuevoHallazgoMonitoreo();");
	$("#btnVolverHallMon").attr("onclick", "javascript:cancelarHallazgoMonitoreo();");
	$("#btnGuardarHallMon").attr("onclick", "javascript:guardarHallazgoMonitoreo();");
	$("#btnEliminarHallMon").attr("onclick", "javascript:eliminarHallazgoMonitoreo();");
 
	if(auditoriaObj.evaluacionGerencia.id == 1){
		$("#btnNuevoHallMon").hide();
	}else{
		$("#btnNuevoHallMon").show()
	}
	var dataParam = {
			
			id : monitoreoAuditoriaId
		};
		
		callAjaxPost(URL + '/auditoria/monitore/hallazgos', dataParam,
				procesarDataHallazgoMonitoreos);
}
function cargarHallazgoMonitoreos() {
	 
	$("#modalMonitoreo .modal-body").hide();
	$('#modalHallazgoMonitoreo').show();
	$("#modalMonitoreo .modal-title").html("<a onclick='volverMonitoreos()'>Monitoreo "+objMonitoreo.tipo.nombre+"</a> > Hallazgos");
		
	cargarHallazgoMonitoreosNeutral();
	
}


function procesarDataHallazgoMonitoreos(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		listHallazgoMonitoreoFull = data.list;
		listSeccionesInteresadasMonitoreoHall=data.secciones;
		listAreasInteresadasMonitoreoHall=data.areas;
		$("#tblHallazgoMonitoreo tbody tr").remove();
		$("#tblHallazgo tbody tr").remove();
		var isCompleto = (auditoriaObj.evaluacionGerencia.id == 1);
		listHallazgoMonitoreoFull.forEach(function(val,index){
			$("#tblHallazgoMonitoreo tbody").append(

					"<tr id='tr" + val.id
							+ "' " 
							+(isCompleto?"":	"onclick='javascript:editarHallazgoMonitoreo("
							+index+")' ") +
									">"

							+ "<td id='tddesc" + val.id
							+ "'>" + val.descripcion + "</td>"
							
							+ "<td id='tdcausa" + val.id
							+ "'>" + val.causa
							+ "</td>" 
							+ "<td id='tdlugar" + val.id
							+ "'>" + val.lugar
							+ "</td>"
							+ "<td id='tdhalarmon" + val.id
							+ "'>" + val.areasNombre
							+ "</td>" 
							+ "<td id='tdhalseccmon" + val.id
							+ "'>" + val.seccionesNombre
							+ "</td>" 
							
							+ "<td id='tdaccion"
							+ val.id + "'>" 
								
							+(isCompleto?"<a class='efectoLink' onclick='agregarAccionMejora(8, "+ val.id  	 + ",10)'>"+
									"<i class='fa fa-list'></i>"+val.accion.estadoIcono+val.accion.resumen+"</a>":val.accion.estadoIcono+val.accion.resumen)
							+"</td>"
							+ "<td id='tdeviHall"
							+ val.id + "'>"
							+ (isCompleto?"<a class='efectoLink' target='_blank' href='"+URL+"/auditoria/hallazgo/evidencia?hallazgoId="+val.id+"'  >" +
									"<i class='fa fa-download'></i>"+val.evidenciaNombre+"</a>":val.evidenciaNombre)+"</td>"
							+ "</tr>");
		});
		formatoCeldaSombreableTabla(true,"tblHallazgoMonitoreo");
		if(!tablaFijaHallazgoMonitoreo){
			tablaFijaHallazgoMonitoreo=true;
			$("#wrapper5").css("height",$(window).height()*0.6-50+"px");
				goheadfixedY("#tblHallazgoMonitoreo","#wrapper5");
			}
		
		break;
	default:
		alert("Ocurrió un error al traer las auditorias!");
	}
	
}


function editarEvidenciaHallazgoMonitoreo(){
	
	$("#modalUploadHallazgo").modal("show");
}

function editarHallazgoMonitoreo(pindex) {
	
	if (!banderaEdicion9) {
		hallazgoMonitoreoId = listHallazgoMonitoreoFull[pindex].id;
		hallazgoObj=listHallazgoMonitoreoFull[pindex]
		formatoCeldaSombreableTabla(false,"tblHallazgoMonitoreo");

		var descripcionHallazgoMonitoreo=listHallazgoMonitoreoFull[pindex].descripcion;
		var causaHallazgoMonitoreo=listHallazgoMonitoreoFull[pindex].causa;
		var lugarHallazgoMonitoreo=listHallazgoMonitoreoFull[pindex].lugar;

		var nombreEvidencia=listHallazgoMonitoreoFull[pindex].evidenciaNombre;
		var iconoAccion=listHallazgoMonitoreoFull[pindex].accion.estadoIcono;
		var nombreAccion=listHallazgoMonitoreoFull[pindex].accion.resumen;

//
		//
		var areasId=hallazgoObj.areasId.split(",")
		listAreasInteresadasMonitoreoHall.forEach(function(val){
			val.selected=0;
			areasId.forEach(function(val1){
				if(parseInt(val1)==val.areaId){
					val.selected=1;
				}
			})
		});	
		crearSelectOneMenuObligMultipleCompleto("slcAreaPermitidaHallazgoMon", "",
				listAreasInteresadasMonitoreoHall,  "areaId", "areaName","#tdhalarmon"+hallazgoObj.id,"Áreas interesadas ...");
								
		//
		var seccionesId=hallazgoObj.seccionesId.split(",")
		listSeccionesInteresadasMonitoreoHall.forEach(function(val){
			val.selected=0;
			seccionesId.forEach(function(val1){
				if(parseInt(val1)==val.id){
					val.selected=1;
				}
			})
		});	
		crearSelectOneMenuObligMultipleCompleto("slcSeccionPermitidaHallazgoMon", "",
				listSeccionesInteresadasMonitoreoHall,  "id", "nombre","#tdhalseccmon"+hallazgoObj.id,"Secciones interesadas ...");
								
		//
		
		
		
		var options=
		{container:"#tdeviHall"+hallazgoMonitoreoId,
				functionCall:function(){ },
				descargaUrl: "/auditoria/hallazgo/evidencia?hallazgoId="+hallazgoMonitoreoId,
				esNuevo:false,
				idAux:"HallazgoMon",
				evidenciaNombre:nombreEvidencia};
		crearFormEvidenciaCompleta(options);
		
		$("#tddesc" + hallazgoMonitoreoId)
				.html(
						"<input type='text' id='inputDescMoni' class='form-control' " +
						"placeholder='Descripcion' autofocus='true' value='"
								+ descripcionHallazgoMonitoreo + "'>");
		$("#tdcausa" + hallazgoMonitoreoId)
		.html(
				"<input type='text' id='inputCausaMoni' class='form-control' " +
				"placeholder='Causa' value='"
						+ causaHallazgoMonitoreo + "'>");
		$("#tdlugar" + hallazgoMonitoreoId)
		.html(
				"<input type='text' id='inputLugarMon' class='form-control' " +
				"placeholder='Lugar' value='"
						+ lugarHallazgoMonitoreo + "'>");
		
		$("#tdaccion" + hallazgoMonitoreoId).html(
				"<a href='#' onclick='javascript:agregarAccionMejora(6, "
						+ hallazgoMonitoreoId + ",10);'>"+nombreAccion+"</a>");
	
		
		/** ************************************************************************* */
		
	
		banderaEdicion9 = true;
		$("#btnNuevoHallMon").hide();
		$("#btnEliminarHallMon").show();
		$("#btnVolverHallMon").show();
		$("#btnGuardarHallMon").show();
	}
	
}
function editarEvidenciaAuditoria(){
	
	$("#modalUploadAuditoria").modal("show");
}

function nuevoHallazgoMonitoreo() {
	if (!banderaEdicion9) {
		hallazgoMonitoreoId = 0;
		$("#tblHallazgoMonitoreo tbody")
				.append(
						"<tr id='0'>" 
						
								+ "<td>"
								+"<input type='text' id='inputDescMoni'  class='form-control'>"
								+"</td>"
								+ "<td>"
								+"<input type='text' id='inputCausaMoni'  class='form-control'>"
								+"</td>"
								+ "<td><input type='text' id='inputLugarMon'  class='form-control'></td>"
								+ "<td id='tdhalarmon0'>...</td>"
								+ "<td id='tdhalseccmon0'>...</td>"
								+ "<td>...</td>"
								+ "<td id='tdeviHall0'>...</td>"
								+ "</tr>");

		crearSelectOneMenuObligMultipleCompleto("slcSeccionPermitidaHallazgoMon", "",
				listSeccionesInteresadasMonitoreoHall,  "id", "nombre","#tdhalseccmon"+hallazgoObj.id,"Secciones interesadas ...");
		crearSelectOneMenuObligMultipleCompleto("slcAreaPermitidaHallazgoMon", "",
				listAreasInteresadasMonitoreoHall,  "areaId", "areaName","#tdhalarmon"+hallazgoObj.id,"Áreas interesadas ...");
						
		//
		var options=
		{container:"#tdeviHall"+hallazgoMonitoreoId,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"HallazgoMon",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
	
		banderaEdicion9 = true;
		$("#btnNuevoHallMon").hide();
		$("#btnEliminarHallMon").hide();
		$("#btnVolverHallMon").show();
		$("#btnGuardarHallMon").show();
		formatoCeldaSombreableTabla(false,"tblHallazgoMonitoreo");
		$("#inputDescMoni").focus();
	} else {
		alert("Guarde primero.");
	}
}

function cancelarHallazgoMonitoreo() {
	cargarHallazgoMonitoreosNeutral();
}

function eliminarHallazgoMonitoreo() {
	var r = confirm("¿Está seguro de eliminar el hallazgo?");
	if (r == true) {
		var dataParam = {
				id : hallazgoMonitoreoId,
		};

		callAjaxPost(URL + '/auditoria/monitoreo/hallazgo/delete', dataParam,
				procesarResultadoEliminarHalazgoMonitoreo);
	}
}

function procesarResultadoEliminarHalazgoMonitoreo(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarHallazgoMonitoreosNeutral();
		break;
	default:
		alert("Ocurrió un error al eliminar la auditoria!");
	}
}

function guardarHallazgoMonitoreo() {

	var campoVacio = true;
	var inputDescMoni = $("#inputDescMoni").val();
	var inputCausaMoni = $("#inputCausaMoni").val();
	var inputLugarMon = $("#inputLugarMon").val();
	

	var secciones=$("#slcSeccionPermitidaHallazgoMon").val();
	var listSecciones=[];
	secciones.forEach(function(val,index){
		listSecciones.push({id:val});
	});
	var areas=$("#slcAreaPermitidaHallazgoMon").val();
	var listAreas=[];
	areas.forEach(function(val,index){
		listAreas.push({areaId:val});
	});
	if (campoVacio) {

		var dataParam = {
			id : hallazgoMonitoreoId,secciones:listSecciones,areas:listAreas,
			descripcion : inputDescMoni,
			causa: inputCausaMoni,
			lugar:inputLugarMon,
			monitoreoId: monitoreoAuditoriaId
		};

		callAjaxPost(URL + '/auditoria/monitoreo/hallazgo/save', dataParam,
				procesarResultadoGuardarHallazgoMonitoreo);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarResultadoGuardarHallazgoMonitoreo(data) {
	switch (data.CODE_RESPONSE) {
	case "05": 
			guardarEvidenciaAuto(data.nuevoId,"fileEviHallazgoMon"
					,bitsEvidenciaHallazgo,"/auditoria/hallazgo/evidencia/save",
					cargarHallazgoMonitoreosNeutral,"hallazgoId");
		 
		
		
		break;
	default:
		alert("Ocurrió un error al guardar la auditoria!");
	}
}


