var banderaedicion7;
var tipoControlId;
var controlId;
var controlNombre;
var controlFecha;
var controlFechaD;
var controlFechaReal;
var controlResponsableTipo;
var controlResponsable;
var controlResponsableCorreo;
var controlEstado;
var controlEstadoNombre;
var controlCosto;
var isAsociado;
var listFullControl;
var listAyudaControlTipo;
var listDniNombre;
var listanombretab;
var ctrlAsociado;

var i;

$('#ctrAccion').on('show.bs.modal', function(e) {
	$("#mdCorr").modal("hide");
	$("#mdCorrInmediata").modal("hide");
});

$('#ctrAccion').on('hide.bs.modal', function(e) {
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

$('#mdUpload').on('show.bs.modal', function(e) {
	$("#ctrAccion").modal("hide");
	$("#mdCorr").modal("hide");
	$("#mdCorrInmediata").modal("hide");
});

$('#mdUpload').on('hide.bs.modal', function(e) {
	$("#ctrAccion").modal("show");
});

function verControlesAsociados(){
	
	$("#ctrAccion").modal({
		  keyboard: true,
		  show:true,"backdrop":"static"
		});
	
	cargarImpactos();
		$("#btnAgregarControl").attr("onclick", "javascript:nuevoControl();");
		$("#btnCancelarControl").attr("onclick", "javascript:cancelarControl();");
		$("#btnGuardarControl").attr("onclick", "javascript:guardarControl();");
		$("#btnEliminarControl").attr("onclick", "javascript:eliminarControl();");
		$("#btnUploadArchivo").on("click",uploadEvidencia)
		
	
}

function cargarImpactos(){

	banderaedicion7=false;
	
	 controlId=0;
	 controlNombre="";
	 controlFecha=0;
	 controlResponsableTipo=0;
	 controlResponsable="";
	 controlResponsableCorreo="";
	 controlEstado=0;
	 controlCosto=0;
	 isAsociado=0;
	 $("#btnCancelarControl").hide();
		$("#btnAgregarControl").show();
		$("#btnEliminarControl").hide();
		$("#btnGuardarControl").hide();
	var paramId = 0;


	var dataParam = {
		accionId : accionMejoraId,
		gestionAccionId:gestionAccionMejoraId
	};

	callAjaxPost(URL + '/iperc/control', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var list = data.control;
			listFullControl=list;
			listAyudaControlTipo=data.listControl;
			$("#tblControl tbody tr").remove();
			for (index = 0; index < list.length; index++) {
var aux =(list[index].fecha==null?null:list[index].fecha.split("-") );
var aux2=(aux==null?'':aux[2]+"-"+aux[1]+"-"+aux[0])
var aux3 =(list[index].fechaReal==null?null:list[index].fechaReal.split("-") );
var aux4=(aux3==null?'':aux3[2]+"-"+aux3[1]+"-"+aux3[0])
				$("#tblControl tbody").append(
						"<tr id='tr" + list[index].controlId
								+ "' onclick='javascript:editarControl("
								+index+")' >"
								+ "<td id='tddescr"
								+ list[index].controlId + "'>"
								+ list[index].controlNombre + "</td>"
								+ "<td id='tdasoc"
								+ list[index].controlId + "'>"
								+ list[index].numAsociados + "</td>"
								+ "<td id='tdtipor"
								+ list[index].controlId + "'>"
								+ list[index].responsableTipoNombre + "</td>"
								+ "<td id='tdnombr"
								+ list[index].controlId + "'>"
								+ list[index].responsable + "</td>"
								+ "<td id='tdcorreo"
								+ list[index].controlId + "'>"
								+ list[index].responsableCorreo + "</td>"
								+ "<td id='tdfecha"
								+ list[index].controlId + "'>"
								+ list[index].fecha+ "</td>"
								+ "<td id='tdhorapla"
								+ list[index].controlId + "'>"
								+ list[index].horaPlanificadaTexto + "</td>"
								+ "<td id='tdfechareal"
								+ list[index].controlId + "'>"
								+ aux4 + "</td>"
								+ "<td id='tdcosto"
								+ list[index].controlId + "'>"
								+ list[index].costo+ "</td>"
								+ "<td id='tdevi"
								+ list[index].controlId + "'>"
								+ list[index].evidenciaNombre+ "</td>"
								+ "<td id='estadoControl"
								+ list[index].controlId + "'>"
								+ list[index].estadoNombre + "</td>"
								+ "</tr>");
			}
			$("#tblControl tbody tr").css("font-size","11px");
			$("#tblControl thead tr").css("font-size","11px");
			if(getSession("linkCalendarioControlId")!=null){
				
				listFullControl.every(function(val,index3){
					
					if(val.controlId==parseInt(getSession("linkCalendarioControlId"))){
						editarControl(index3);
						sessionStorage.removeItem("linkCalendarioControlId");
						return false;
					}else{
						return true;
					}
				});
				
			}
			break;
		default:
			alert("Ocurrió un error al traer las programaciones!");
		}
	});
	
	var dataParam2 = {
			idCompany: sessionStorage.getItem("gestopcompanyid")
		};
	
	callAjaxPost(URL + '/accidente/trab', dataParam2,
			function(data){
		switch (data.CODE_RESPONSE) {
		
		case "05":
		
			 listDniNombre=data.listDniNombre;
			
			break;
		default:
			alert("Ocurrió un error al traer los Accidentes!");
		}

	listanombretab=listarStringsDesdeArray(listDniNombre, "nombre");
	});
	
	
}


function llenarCorreoAutoTrabControl(){
	var nombreTrab=$("#inputNombreR").val();
	var correo;
	
		for (var index = 0; index < listDniNombre.length; index++) {
			
			if(listDniNombre[index]["nombre"]==nombreTrab){
				correo=listDniNombre[index]["correo"]
			$("#inputCorreoControl").val(correo);
				console.log(listDniNombre[index]["correo"]+"sip");
			break;
			}else{
				$("#inputCorreoControl").val("");
			
			
			}
		}
		
	
}


function correrScrollIzq(){
	
	$("#wrapper").animate({ scrollTop: $('#wrapper')[0].scrollHeight}, 1000);
	
	
}

function nuevoControl() {
	

		if (!banderaedicion7) {
			
			$("#tblControl tbody")
					.append(
							"<tr id='0'>"
								+"<th id='tddescr0'>" +
										"<input class='form-control' type='text' id='inputDescControl'  ></th>" 
								+"<th id='tdasoc0'>"
								+"</th>"
								+"<th id='tdtipor0'>"+"<select class='form-control' id='selTipoCtrl' onchange='listaTrabAcordeTipo()'>" 
								+"<option value='1' selected>Interno</option>"
								+"<option value='2'>Externo</option>"
									+	"</select>"+"</th>"
								+"<th id='tdnombr0'><input type='text' id='inputNombreR'  ></th>"
								+"<th id='tdcorreo0'><input type='text' id='inputCorreoControl'  ></th>" 
								+"<th id='tdfecha0'><input type='date'  id='inputFechaCtrl'  onchange='hallarEstadoControl(0)'></th>" 
								+"<th id='tdhorapla0'><input type='time' value='12:00:00'  id='inputHora'  ></th>" 
								
								+"<th id='tdfechareal0'><input type='date'  id='inputFechaCtrlReal'   onchange='hallarEstadoControl(0)'></th>" 
								+"<th id='tdcosto0'><input type='number'  id='inputCosto'  ></th>" 
								+"<th id='tdevi0'>"
								+"</th>"
								+"<th id='estadoControl0'>"
								+"</th>"								
								+ "</tr>");
			controlId = 0;
			 listaControlesAcordeTipo();$("#tblControl input").addClass("form-control");
			listaTrabAcordeTipo();
			$("#btnCancelarControl").show();
			$("#btnAgregarControl").hide();
			$("#btnEliminarControl").hide();
			$("#btnGuardarControl").show();
			
			banderaedicion7 = true;
		} else {
			alert("Guarde primero.");
		}
	
	
	
	
	}
function llenarControlAuto(){
	var seguirBusqueda=true;
	listAyudaControlTipo.every(function(val,index){
		
if(val.controlNombre!=$("#inputDescControl").val() ){
	isAsociado=0;var nombreEvidencia=val.evidenciaNombre;
	$("#tdevi" + controlId)
	.html("");
	$("#estadoControl0").html("");
	

	$("#tdtipor" + controlId)
	.html(
			"<select id='selTipoCtrl'    onchange='listaTrabAcordeTipo()' class='form-control'>" 
			+"<option value='1'>Interno</option>"
			+"<option value='2'>Externo</option>"
				+	"</select>"
			);
	
	 $('#selTipoCtrl > option[value="'+controlResponsableTipo+'"]').attr('selected', 'selected');
		$("#tdnombr" + controlId)
		.html(
				"<input type='text' id='inputNombreR'  onchange='llenarCorreoAutoTrabControl()'>"
				);
	

	 $("#tdcosto"+controlId).html(
			 "<input type='number' id='inputCosto' >"
	 );
	$("#tdcorreo" + controlId)
	.html(
			"<input type='text'  id='inputCorreoControl' >");
	
		
	$("#tdfecha" + controlId)
	.html(
			"<input type='date'  id='inputFechaCtrl' onchange='hallarEstadoControl("+controlId+")'>"
			);
	$("#tdfechareal" + controlId)
	.html(
			"<input type='date'  id='inputFechaCtrlReal' onchange='hallarEstadoControl("+controlId+")'>"
			);
	
	$("#tdhorapla" + controlId)
	.html(
			"<input type='time'  id='inputHora' >"
			);	$("#ctrlImplModal input").addClass("form-control");
			listaTrabAcordeTipo();
}else{
	isAsociado=1;
	ctrlAsociado=val;
	var nombreEvidencia=val.evidenciaNombre;
	$("#tdevi" + controlId)
	.html(nombreEvidencia);
	$("#estadoControl0").html(val.estadoNombre);
	
	$("#tdevi" + controlId)
	.html(val.evidenciaNombre);
	
	$("#tdtipor" + controlId)
	.html(val.responsableTipoNombre	);
	
		$("#tdnombr" + controlId)
		.html(val.responsable);
	

	 $("#tdcosto"+controlId).html(val.costo);
	$("#tdcorreo" + controlId)
	.html(val.responsableCorreo);
	
		
	$("#tdfecha" + controlId)
	.html(val.fecha);
	$("#tdfechareal" + controlId)
	.html(val.fechaTextoReal);
	
	$("#tdhorapla" + controlId)
	.html(val.horaPlanificadaTexto);
	seguirBusqueda=false;
}
if (!seguirBusqueda)
    return false;
else return true;
	});
}
function listaControlesAcordeTipo(){
	var list=listarStringsDesdeArray(listFullControl,"controlId");
	var listAux=listAyudaControlTipo.filter(function(val){
		if(list.indexOf(val.controlId)==-1){
			return val;
		}
			
		
	});
	var list2=listarStringsDesdeArray(listAux,"controlNombre");
	ponerListaSugerida("inputDescControl",list2,true);
		$(document).on("autocompleteclose","#inputDescControl",function(){console.log("ndsnds")
			llenarControlAuto();		});
		
	
	}
function listaTrabAcordeTipo(){
	var tipoTrab=$("#selTipoCtrl").val();
	if(parseInt(tipoTrab)==1){
		ponerListaSugerida("inputNombreR",listanombretab,true);
		$(document).on("autocompleteclose","#inputNombreR",function(){console.log("ndsnds2")
			llenarCorreoAutoTrabControl();		});
		
		
	
	}
		
	if(parseInt(tipoTrab)==2)	{ 
		ponerListaSugerida("inputNombreR",listanombretab,false);	
	$("#inputCorreoControl").val("");
	
}
	
}
function cancelarControl(){
	cargarImpactos();
}
function eliminarControl(){
	var r = confirm("¿Desea eliminar todos los asociados?");
	var dataParam = {
			controlId : controlId,
			accionId : accionMejoraId
	};
	if (!r ) {
		var r1 = confirm("¿Desea eliminar solo este control?");
		if(r1){
			callAjaxPost(URL + '/iperc/control/delete/parcial', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							cargarImpactos();
							break;
						default:
							alert("Ocurrió un error al eliminar la programacion!");
						}
					});
		}
		

		
	}else{
		callAjaxPost(URL + '/iperc/control/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarImpactos();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}



function editarControl(pindex) {
	
	if (!banderaedicion7) {
		
			isAsociado=0;
			$("#inputDescControl").off("keypress");

			$(document).off("click");
		 controlId=listFullControl[pindex].controlId;
		 controlNombre=$("#tddescr" + controlId).text();
		 controlFecha=convertirFechaNormal2(listFullControl[pindex].fechaTexto);
		 controlResponsableCorreo=$("#tdcorreo" + controlId).text();
		 controlResponsableTipo=listFullControl[pindex].responsableTipoId;
		 controlResponsable=$("#tdnombr" + controlId).text();
		 controlCosto=listFullControl[pindex].costo;
		 controlFechaReal=listFullControl[pindex].fechaReal;
		var horaPlanificada=listFullControl[pindex].horaPlanificada;
		var nombreEvidencia=listFullControl[pindex].evidenciaNombre;
		$("#tdevi" + controlId)
		.html(
				"<a id='linkEvidencia' " +
				"href='"+URL 
				+ "/iperc/control/evidencia?controlId="+controlId+"' target='_blank' >" +
				nombreEvidencia+	"</a><br/>" +
				"<a id='linkEvidencia' href='#' onclick='javascript:editarEvidencia();'>Subir</a>");
		
		$("#tddescr" + controlId)
				.html(
						"<input type='text' id='inputDescControl' >");

		$("#tdtipor" + controlId)
		.html(
				"<select id='selTipoCtrl'    onchange='listaTrabAcordeTipo()' class='form-control'>" 
				+"<option value='1'>Interno</option>"
				+"<option value='2'>Externo</option>"
					+	"</select>"
				);
		
		 $('#selTipoCtrl > option[value="'+controlResponsableTipo+'"]').attr('selected', 'selected');
			$("#tdnombr" + controlId)
			.html(
					"<input type='text' id='inputNombreR'  onchange='llenarCorreoAutoTrabControl()'>"
					);
		
	
		 $("#tdcosto"+controlId).html(
				 "<input type='number' id='inputCosto'  >"
		 );
		$("#tdcorreo" + controlId)
		.html(
				"<input type='text'  class='form-control' id='inputCorreoControl' >");
		
			
		$("#tdfecha" + controlId)
		.html(
				"<input type='date' id='inputFechaCtrl'  onchange='hallarEstadoControl("+controlId+")'>"
				);
		$("#tdfechareal" + controlId)
		.html(
				"<input type='date'  id='inputFechaCtrlReal'   onchange='hallarEstadoControl("+controlId+")'>"
				);
		
		$("#tdhorapla" + controlId)
		.html(
				"<input type='time'  id='inputHora'  >"
				);	$("#tblControl input").addClass("form-control");
		 listaTrabAcordeTipo();
		$("#inputHora").val(horaPlanificada);
		$("#inputDescControl").val(controlNombre);
	
		$("#inputCorreoControl").val(controlResponsableCorreo);
		$("#inputFechaCtrl").val(controlFecha);
		$("#inputFechaCtrlReal").val(controlFechaReal);
		$("#inputNombreR").val(controlResponsable);
	$("#inputCosto").val(controlCosto);
	hallarEstadoControl(controlId);

		banderaedicion7 = true;
		$("#btnCancelarControl").show();
		$("#btnAgregarControl").hide();
		$("#btnEliminarControl").show();
		
		$("#btnGuardarControl").show();
		
		
	}
}
function editarEvidencia(){
	$("#mdUpload").modal("show");
	
}

function guardarControl() {
	var campoVacio = true;
	
if(isAsociado==0){
	
	var controlNombre=$("#inputDescControl").val();
	var controlClasificacion=2;
	var responsableTipoId=$("#selTipoCtrl").val();
	var responsableCorreo=$("#inputCorreoControl").val();
	var responsable=$("#inputNombreR").val();
	var fecha=$("#inputFechaCtrl").val();
	var costo=$("#inputCosto").val();
	var horaPlanificada=$("#inputHora").val();
	if(!$("#inputHora").val()){
		horaPlanificada=null;
	}
	if (!fecha) {
		fecha = null
	}
	var mes2 = $("#inputFechaCtrl").val().substring(5, 7) - 1;
	var fechatemp2 = new Date($("#inputFechaCtrl").val().substring(0, 4), mes2,
			$("#inputFechaCtrl").val().substring(8, 10));

	var inputFechaCtrl = fechatemp2;
	
	var fechaFinReal=$("#inputFechaCtrlReal").val();
	
	if (!fechaFinReal) {
		fechaFinReal = null
	}
	hallarEstadoControl(controlId);
}
	banderaedicion7=false;
	
	if (campoVacio) {

		var dataParam = {
			controlId: (isAsociado==0?controlId:ctrlAsociado.controlId),
			accionId : accionMejoraId,
			controlClasificacionId:3,
			controlNombre:controlNombre,
			responsableTipoId:responsableTipoId,
			responsableCorreo:responsableCorreo,
			responsable:responsable,
			fecha:fecha,
			fechaReal:fechaFinReal,
			estadoId:controlEstado,
			costo:costo,
			horaPlanificada:horaPlanificada,
			companyId:sessionStorage.getItem("gestopcompanyid"),
			isAsociado:isAsociado
			
		};

		callAjaxPost(URL + '/iperc/control/save', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarImpactos();
						break;
					default:
						alert("Ocurrió un error al guardar la programacion!");
					}
				});
	} else {
		alert("Debe ingresar todos los campos.");
	}
}


function hallarEstadoControl(ctrlId){
	var fechaPlanificada=$("#inputFechaCtrl").val();
	var fechaReal=$("#inputFechaCtrlReal").val();
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		controlEstado=2;
		controlEstadoNombre="Completado";
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				controlEstado=3;
				controlEstadoNombre="Retrasado";
			}else{
				controlEstado=1;
				controlEstadoNombre="Por implementar";
			}
			
		}else{
			
			controlEstado=1;
			controlEstadoNombre="Por implementar";
			
		}
	}
	
	$("#estadoControl"+ctrlId).html(controlEstadoNombre);
	
}


function uploadEvidencia(){
	$.blockUI({message:'cargando...'}); 
	guardarEvidenciaAuto(controlId,"fileEviControl",bitsEvidenciaControl,
			"/iperc/control/evidencia/save",function(){
		$.unblockUI();
		var inputFileImage = document.getElementById("fileEviControl");
		var file = inputFileImage.files[0];
		$("#tdevi"+controlId+" ").html(file.name);
		$("#mdUpload").modal("hide");
	},"controlId");
	
 
		
}
