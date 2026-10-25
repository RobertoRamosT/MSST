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

function verControlSegunTipo(ptipoControlId){
	 tipoControlId=ptipoControlId
	$("#ctrlImplModal").modal({
		  keyboard: true,
		  show:true,"backdrop":"static"
		});
	
		$("#btnAgregarControl").attr("onclick", "javascript:nuevoControl();");
		$("#btnCancelarControl").attr("onclick", "javascript:cancelarControl();");
		$("#btnGuardarControl").attr("onclick", "javascript:guardarControl();");
		$("#btnEliminarControl").attr("onclick", "javascript:eliminarControl();");
		$("#btnUploadArchivo").on("click",uploadEvidencia)
		cargarImpactos();
	
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

	switch (tipoControlId) {
	case 1:
		$("#ctrlImplModalLabel").html("CONTROL ELIMINACION");
		
		break;
	case 2:
		$("#ctrlImplModalLabel").html("CONTROL SUSTITUCION");
		
		break;
	case 3:
		$("#ctrlImplModalLabel").html("CONTROL INGENIERIA");
		
		break;
	case 4:
		$("#ctrlImplModalLabel").html("CONTROL ADMINISTRATIVO");
		
		break;
	case 5:
		$("#ctrlImplModalLabel").html("CONTROL EQUIPOS DE PROTECCION");
		
		break;
	default:
		break;
	}

	var dataParam = {
			tipoCtrlId : tipoControlId,
		ipercDetailEvalId : detalleIpercDetailObj.ipercDetailEvalID,
		ipercId:ipercEdicionObj.ipercId
	};

	callAjaxPost(URL + '/iperc/control', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var list = data.control;
			listFullControl=list;
			listAyudaControlTipo=data.listControl;
			$("#tblControl tbody tr").remove();
			switch(tipoControlId){
			case 1:
				detalleIpercDetailObj.numTipo1 = list.length;
				detalleIpercDetailObj.numCompletado1 = 0;
				detalleIpercDetailObj.numImplementar1 = 0;
				detalleIpercDetailObj.numRetrasado1 = 0;
				break;
			case 2:
				detalleIpercDetailObj.numTipo2 = list.length;
				detalleIpercDetailObj.numCompletado2 = 0;
				detalleIpercDetailObj.numImplementar2 = 0;
				detalleIpercDetailObj.numRetrasado2 = 0;
				break;
			case 3:
				detalleIpercDetailObj.numTipo3 = list.length;
				detalleIpercDetailObj.numCompletado3 = 0;
				detalleIpercDetailObj.numImplementar3 = 0;
				detalleIpercDetailObj.numRetrasado3 = 0;
				break;
			case 4:
				detalleIpercDetailObj.numTipo4 = list.length;
				detalleIpercDetailObj.numCompletado4 = 0;
				detalleIpercDetailObj.numImplementar4 = 0;
				detalleIpercDetailObj.numRetrasado4 = 0;
				break;
			case 5:
				detalleIpercDetailObj.numTipo5 = list.length;
				detalleIpercDetailObj.numCompletado5 = 0;
				detalleIpercDetailObj.numImplementar5 = 0;
				detalleIpercDetailObj.numRetrasado5 = 0;
				break;
			}
			list.forEach(function(val,index){
				switch(tipoControlId){
				case 1:
					switch(val.estadoId){
					case 1:
						detalleIpercDetailObj.numImplementar1++;
						break;
					case 2:
						detalleIpercDetailObj.numCompletado1++;
						break;
					case 3:
						detalleIpercDetailObj.numRetrasado1++;
						break;
					}
					break;
				case 2:
					switch(val.estadoId){
					case 1:
						detalleIpercDetailObj.numImplementar2++;
						break;
					case 2:
						detalleIpercDetailObj.numCompletado2++;
						break;
					case 3:
						detalleIpercDetailObj.numRetrasado2++;
						break;
					}
					break;
				case 3:
					switch(val.estadoId){
					case 1:
						detalleIpercDetailObj.numImplementar3++;
						break;
					case 2:
						detalleIpercDetailObj.numCompletado3++;
						break;
					case 3:
						detalleIpercDetailObj.numRetrasado3++;
						break;
					}
					break;
				case 4:
					switch(val.estadoId){
					case 1:
						detalleIpercDetailObj.numImplementar4++;
						break;
					case 2:
						detalleIpercDetailObj.numCompletado4++;
						break;
					case 3:
						detalleIpercDetailObj.numRetrasado4++;
						break;
					}
					break;
				case 5:
					switch(val.estadoId){
					case 1:
						detalleIpercDetailObj.numImplementar5++;
						break;
					case 2:
						detalleIpercDetailObj.numCompletado5++;
						break;
					case 3:
						detalleIpercDetailObj.numRetrasado5++;
						break;
					}
					break;
				}
				var aux =(val.fecha==null?null:val.fecha.split("-") );
				var aux2=(aux==null?'':aux[2]+"-"+aux[1]+"-"+aux[0])
				var aux3 =(val.fechaReal==null?null:val.fechaReal.split("-") );
				var aux4=(aux3==null?'':aux3[2]+"-"+aux3[1]+"-"+aux3[0])
				$("#tblControl tbody").append(
						"<tr id='tr" + val.controlId
								+ "' onclick='javascript:editarControl("
								+index+")' >"
								+ "<td id='tddescr"
								+ val.controlId + "'>"
								+ val.controlNombre + "</td>"
								+ "<td id='tdasoc"
								+ val.controlId + "'>"
								+ val.numAsociados + "</td>"
								+ "<td id='tdtipor"
								+ val.controlId + "'>"
								+ val.responsableTipoNombre + "</td>"
								+ "<td id='tdnombr"
								+ val.controlId + "'>"
								+ val.responsable + "</td>"
								+ "<td id='tdcorreo"
								+ val.controlId + "' style='word-wrap: break-word'>"
								+ val.responsableCorreo + "</td>"
								+ "<td id='tdfecha"
								+ val.controlId + "'>"
								+ val.fecha+ "</td>"
								+ "<td id='tdhorapla"
								+ val.controlId + "'>"
								+ val.horaPlanificadaTexto + "</td>"
								+ "<td id='tdfechareal"
								+ val.controlId + "'>"
								+ aux4 + "</td>"
								+ "<td id='tdcosto"
								+ val.controlId + "'>"
								+ val.costo+ "</td>"
								+ "<td id='tdevi"
								+ val.controlId + "'>"
								+ (val.evidenciaNombre.length>16?
										val.evidenciaNombre.substr(0,16)+"...":val.evidenciaNombre)+ "</td>"
								+ "<td id='estadoControl"
								+ val.controlId + "'>"
								+ val.estadoNombre + "</td>"
								+ "</tr>");
							
			});
			 
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




function llenarCorreoAutoTrab(){
	var nombreTrab=$("#inputNombreR").val();
	var correo;
	
		for (index = 0; index < listDniNombre.length; index++) {
			
			if(listDniNombre[index]["nombre"]==nombreTrab){
				correo=listDniNombre[index]["correo"]
			$("#inputCorreoR").val(correo);
			
			break;
			}else{
				$("#inputCorreoR").val("");
			
			
			}
		}
		
	
}


function correrScrollIzq(){
	
	$("#wrapper").animate({ scrollTop: $('#wrapper')[0].scrollHeight}, 1000);
	
	
}

function nuevoControl() {
	

		if (!banderaedicion7) {
			
			$("#tblControl tbody")
			.prepend(
					"<tr id='0'>"
						+"<th id='tddescr0'><input type='text' id='inputDesc' class='form-control'></th>" 
						+"<th id='tdasoc0'>"
						+"</th>"
						+"<th id='tdtipor0'>"+"<select id='selTipoCtrl' onchange='listaTrabAcordeTipo()' class='form-control'>" 
						+"<option value='1' selected>Interno</option>"
						+"<option value='2'>Externo</option>"
							+	"</select>"+"</th>"
						+"<th id='tdnombr0'><input type='text' id='inputNombreR' class='form-control'></th>"
						+"<th id='tdcorreo0'><input type='text' id='inputCorreoR' class='form-control'></th>" 
						+"<th id='tdfecha0'><input type='date'  id='inputFecha' class='form-control' onchange='hallarEstadoImplementacion(0)'></th>" 
						+"<th id='tdhorapla0'><input type='time' value='12:00:00'  id='inputHora' class='form-control'></th>" 
						
						+"<th id='tdfechareal0'><input type='date'  id='inputFechaReal' class='form-control' onchange='hallarEstadoImplementacion(0)'></th>" 
						+"<th id='tdcosto0'><input type='number'  id='inputCosto' class='form-control'></th>" 
						+"<th id='tdevi0'>"
						+"</th>"
						+"<th id='estadoControl0'>"
						+"</th>"								
						+ "</tr>");
			controlId = 0;
			 listaControlesAcordeTipo();
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
		
if(val.controlNombre!=$("#inputDesc").val() ){
	isAsociado=0;var nombreEvidencia=val.evidenciaNombre;
	$("#tdevi" + controlId)
	.html("");
	$("#estadoControl0").html("");
	

	$("#tdtipor" + controlId)
	.html(
			"<select id='selTipoCtrl'  style='width:100%' onchange='listaTrabAcordeTipo()' class='form-control'>" 
			+"<option value='1'>Interno</option>"
			+"<option value='2'>Externo</option>"
				+	"</select>"
			);
	
	 $('#selTipoCtrl > option[value="'+controlResponsableTipo+'"]').attr('selected', 'selected');
		$("#tdnombr" + controlId)
		.html(
				"<input type='text' id='inputNombreR'  onchange='llenarCorreoAutoTrab()'>"
				);
	

	 $("#tdcosto"+controlId).html(
			 "<input type='number' id='inputCosto' style='width:90px'>"
	 );
	$("#tdcorreo" + controlId)
	.html(
			"<input type='text'  id='inputCorreoR' >");
	
		
	$("#tdfecha" + controlId)
	.html(
			"<input type='date'    id='inputFecha' onchange='hallarEstadoImplementacion("+controlId+")'>"
			);
	$("#tdfechareal" + controlId)
	.html(
			"<input type='date'   id='inputFechaReal' onchange='hallarEstadoImplementacion("+controlId+")'>"
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
	ponerListaSugerida("inputDesc",list2,true);
		$(document).on("autocompleteclose","#inputDesc",function(){console.log("ndsnds")
			llenarControlAuto();		});
		
	
	}
function listaTrabAcordeTipo(){
	if($("#selTipoCtrl").val()==1){
		ponerListaSugerida("inputNombreR",listanombretab,true);
		$(document).on("autocompleteclose","#inputNombreR",function(){console.log("ndsnds2")
			llenarCorreoAutoTrab();		});
		
		
	
	}
		
	if($("#selTipoCtrl").val()==2)	{ 
		ponerListaSugerida("inputNombreR",listanombretab,false);	
	$("#inputCorreoR").val("");
	
}
	
}
function cancelarControl(){
	cargarImpactos();
}
function eliminarControl(){
	var r = confirm("¿Desea eliminar todos los asociados?");
	var dataParam = {
			controlId : controlId,
			ipercDetailEvalId : detalleIpercDetailId
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
			$("#inputDesc").off("keypress");

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
				"<a id='linkEvidencia' href='#' onclick='javascript:editarEvidenciaControl()'>Subir</a>");
		
		$("#tddescr" + controlId)
				.html(
						"<input type='text' id='inputDesc' >");

		$("#tdtipor" + controlId)
		.html(
				"<select id='selTipoCtrl'  style='width:100%' onchange='listaTrabAcordeTipo()' class='form-control'>" 
				+"<option value='1'>Interno</option>"
				+"<option value='2'>Externo</option>"
					+	"</select>"
				);
		
		 $('#selTipoCtrl > option[value="'+controlResponsableTipo+'"]').attr('selected', 'selected');
			$("#tdnombr" + controlId)
			.html(
					"<input type='text' id='inputNombreR'  onchange='llenarCorreoAutoTrab()'>"
					);
		
	
		 $("#tdcosto"+controlId).html(
				 "<input type='number' id='inputCosto' style='width:90px'>"
		 );
		$("#tdcorreo" + controlId)
		.html(
				"<input type='text'  id='inputCorreoR' >");
		
			
		$("#tdfecha" + controlId)
		.html(
				"<input type='date'  id='inputFecha'   onchange='hallarEstadoImplementacion("+controlId+")'>"
				);
		$("#tdfechareal" + controlId)
		.html(
				"<input type='date'  id='inputFechaReal'   onchange='hallarEstadoImplementacion("+controlId+")'>"
				);
		
		$("#tdhorapla" + controlId)
		.html(
				"<input type='time'  id='inputHora' style='width:135px'>"
				);	$("#ctrlImplModal input").addClass("form-control");
		 listaTrabAcordeTipo();
		$("#inputHora").val(horaPlanificada);
		$("#inputDesc").val(controlNombre);
	
		$("#inputCorreoR").val(controlResponsableCorreo);
		$("#inputFecha").val(controlFecha);
		$("#inputFechaReal").val(controlFechaReal);
		$("#inputNombreR").val(controlResponsable);
	$("#inputCosto").val(controlCosto);
	hallarEstadoImplementacion(controlId);

		banderaedicion7 = true;
		$("#btnCancelarControl").show();
		$("#btnAgregarControl").hide();
		$("#btnEliminarControl").show();
		
		$("#btnGuardarControl").show();
		
		
	}
}
function editarEvidenciaControl(){
	$("#mdUpload").modal("show")
}
function guardarControl() {
	var campoVacio = true;
	
if(isAsociado==0){
	
	var controlNombre=$("#inputDesc").val();
	var controlClasificacion=2;
	var responsableTipoId=$("#selTipoCtrl").val();
	var responsableCorreo=$("#inputCorreoR").val();
	var responsable=$("#inputNombreR").val();
	var fecha=$("#inputFecha").val();
	var costo=$("#inputCosto").val();
	var horaPlanificada=$("#inputHora").val();
	if(!$("#inputHora").val()){
		horaPlanificada=null;
	}
	if (!fecha) {
		fecha = null
	}
	var mes2 = $("#inputFecha").val().substring(5, 7) - 1;
	var fechatemp2 = new Date($("#inputFecha").val().substring(0, 4), mes2,
			$("#inputFecha").val().substring(8, 10));

	var inputFecha = fechatemp2;
	
	var fechaFinReal=$("#inputFechaReal").val();
	
	if (!fechaFinReal) {
		fechaFinReal = null
	}
	hallarEstadoImplementacion(controlId);
}
	banderaedicion7=false;
	
	if (campoVacio) {

		var dataParam = {
			controlId: (isAsociado==0?controlId:ctrlAsociado.controlId),
			tipoCtrlId : tipoControlId,
			ipercDetailEvalId : detalleIpercDetailId,
			controlClasificacionId:2,
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
function hallarEstadoImplementacion(ctrlId){
	var fechaPlanificada=$("#inputFecha").val();
	var fechaReal=$("#inputFechaReal").val();
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
	guardarEvidenciaAuto(controlId,"fileEvi",bitsEvidenciaControl,
			"/iperc/control/evidencia/save",function(){
		$.unblockUI();
		var inputFileImage = document.getElementById("fileEvi");
		var file = inputFileImage.files[0];
		$("#tdevi"+controlId).html(file.name);
		 
		$("#mdUpload").modal("hide");
	},"controlId")
	 	
}
