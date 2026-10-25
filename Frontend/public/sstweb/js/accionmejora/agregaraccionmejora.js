var asociadoTipo;
var asociadoId;
var gestionMejoraId;
var restriccionId;
var listFullTrabajadoresAux=[];
var listFullSolicitudesAcciones=[];
var accionMejoraId;
var guardoAccion = false;

var listTipoHallazgo;
var tipoHallazgoAccionId;
var mensajeUx;


$(document).ready(function(){
		 
})

function verAutoCompletarTrabAccionAux(){
	var nombre = $("#inputNombreRespAccAux").val().trim();
	if(nombre == ""){nombre = null};
	var dataParam = {
			trabajadorNombre : "%"+nombre+"%",
			empresaId : getSession("gestopcompanyid")}
	callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
		if(data.trabajadores.length == 0){
			data.trabajadores.push({
				trabajadorId : -1,nombre:"Sin resultados",puesto:{positionName:""}
			})
		}
		listFullTrabajadoresAux= data.trabajadores;
		crearSelectOneMenuObligUnitarioCompleto("selTrabajadorAux", 
				"", data.trabajadores, "trabajadorId","nombre",
				"#divAutoCompletarTrabAccAux","");
		 
		$("#inputNombreRespAccAux")
		.attr("onkeyup","verAutoCompletarTrabAccionAux()");
	});
}

function verAutoCompletarTrabAccionMejoraAux(){
	var nombre = $("#inputNombreRespAccMejAux").val().trim();
	if(nombre == ""){nombre = null};
	var dataParam = {
			trabajadorNombre : "%"+nombre+"%",
			empresaId : getSession("gestopcompanyid")}
	callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
		if(data.trabajadores.length == 0){
			data.trabajadores.push({
				trabajadorId : -1,nombre:"Sin resultados",puesto:{positionName:""}
			})
		}
		listFullTrabajadoresAux= data.trabajadores;
		listFullTrabajadoresAux.forEach(function(val){
		    val.selected = 0;
		    if(val.trabajadorId == accionMejoraAuxObj.trabajadorResponsableId){
			val.selected = 1;
		    }
		});
		crearSelectOneMenuObligUnitarioCompleto("selTrabajadorAccAux", 
				"", listFullTrabajadoresAux, "trabajadorId","nombre",
				"#divAutoCompletarTrabAccMejAux","");
		$("#inputNombreRespAccMejAux")
		.attr("onkeyup","verAutoCompletarTrabAccionMejoraAux()");
	});
}
function irAAccionMejora() {
	document.location.href = 'accionmejora.html';
}

function agregarGestionAccionMejora(asociadoTipo, asociadoId,functionCallback) {
	$("#modalSolicitudAccionAux .modal-body").hide();
	$("#divAsocGAM").show();
	var dataParam = {
		idCompany : getSession("gestopcompanyid"),
		asociadoTipo : parseInt(asociadoTipo),
		asociadoId : asociadoId
	};
	 
	callAjaxPost(URL + '/gestionaccionmejora/items', dataParam,
			function(data){
		procesarDataDescargadaAgregarGAM(data);
		if(functionCallback != null){
			functionCallback();
		}
	}
			);
}
var listTipoAccionMejoraGlobal = [];
function verTituloAcordeCausa(){
    var causaId = parseInt($("#selCausaAcc").val());
    listTipoAccionMejoraGlobal.forEach(function(val){
	if(val.id == causaId){
	    $("#resumenAcc").val(val.codigo);
	}
    });
}

function procesarDataDescargadaAgregarGAM(data){
	switch(data.CODE_RESPONSE){
	     case "05":
		 
		var valorResize= 200;
		resizeDivWrapper("wrapperAsignarAccionMejora",valorResize); 
		 
		listFullSolicitudesAcciones = data.list;
		var listTipoAccionMejora=data.listTipoAccionMejora;
		listTipoAccionMejoraGlobal = data.listTipoAccionMejora;
		listTipoHallazgo=data.listHallazgo;

		goheadfixedY("#tblV","#wrapperAsignarAccionMejora");
		$("#tblV tbody tr").remove(); 
		var selCausaAcc = crearSelectOneMenuOblig("selCausaAcc", "verTituloAcordeCausa()", 
				listTipoAccionMejora, "-1", "causaId", "causaNombre","Seleccionar nueva acción de mejora");
		var selTipoSolicitudAux = crearSelectOneMenuOblig("selTipoSolicitudAux", "", 
				data.solicitud, "1", "id", "nombre","");
		
		var selTipoHallazgo = crearSelectOneMenuOblig("selTipoHallazgo", "", listTipoHallazgo, "1",
				"id", "nombre","");
		
		
		var fila = "<tr id='tr0"+ "'>"

		+ "<td id='tdsel" +"0"
		+ "'><input type='radio' name='gestion' id='rad"
		+ "0"+ "'></td>"
		
		+ "<td   > ...</td>"
		
		+ "<td id='tdcausa" + "0"
		+ "'>" + selCausaAcc + "</td>"
		
		+ "<td id='tdHallazgo" + "0' >"+ selTipoHallazgo + "</td>"

        //	+ "<td  >" + selTipoSolicitudAux + "</td>"
		+ "<td id='tdres" + "0"
		+ "'>" + "<input type='text' class='form-control' id='resumenAcc'>"+ "</td>"
		+"<td ><input class='form-control' type='text' placeholder='* Debe ingresar un nombre o un apellido y seleccionarlo.' "
			    + "id='inputNombreRespAccAux'>"
					+ "<div id='divAutoCompletarTrabAccAux'></div></td>"	
		+ "<td id='tdest" + "0"
		+ "'>" + "Por implementar" + "</td>"
		+"<td>...</td>"
		+ "</tr>";
		
		$("#tblV tbody:first").append(fila);
		
		verTituloAcordeCausa(); 
		verAutoCompletarTrabAccionAux();
		 
		
		$("#rad" + "0").attr("onclick","javascript:seleccionarGAM("+ "0"+ ");");
		
		if(listFullSolicitudesAcciones.length > 0){
			$("#btnGuardarAsocPlus").hide();
		}

		listFullSolicitudesAcciones.forEach(function(val){

			var fila = "<tr id='tr" + val.gestionAccionMejoraId
					+ "'>"

					+ "<td id='tdsel" + val.gestionAccionMejoraId
					+ "'><input type='radio' name='gestion' id='rad"
					+ val.gestionAccionMejoraId + "'></td>"
					+ "<td   > <a onclick='irModuloSolicitudAccion("+val.gestionAccionMejoraId+")' class='efectoLink'>" +
							"<i class='fa fa-external-link'></i> Ir al módulo</a></td>"
					+ "<td id='tdcausa" + val.gestionAccionMejoraId
					+ "'>" + val.causaNombre + "</td>"
					
					+ "<td id='tdHallazgo" + val.gestionAccionMejoraId + "'>"
				        + val.tipoHallazgo.nombre + "</td>"

					+ "<td id='tdres" + val.gestionAccionMejoraId
					+ "'>" + val.resumen + "</td>"
					+ "<td id='tdrespons" + val.gestionAccionMejoraId
					+ "'>" + val.responsable + "</td>"

					+ "<td id='tdest" + val.gestionAccionMejoraId
					+ "'>" + val.estadoCumplimientoNombre + "</td>"
					+ "<td id='tdaccaux" + val.gestionAccionMejoraId
					+ "'>" + "<a class='efectoLink' onclick='verAccionesSolicitudAux("+val.gestionAccionMejoraId+")'>" +
							"<i class='fa fa-list'></i> Ver acciones " +
							"("+val.numCorInmediataCompleto+" / " +
									(val.numCorInmediataRetrasado+val.numCorInmediataCompleto+val.numCorInmediataProceso)+")</a>" + "</td>"

					+ "</tr>"
			$("#tblV tbody:first").append(fila);

			$("#rad" + val.gestionAccionMejoraId)
					.attr("onclick","javascript:seleccionarGAM("+ val.gestionAccionMejoraId + ");");
			if (val.seleccionado > 0) {
				$("#rad" + val.gestionAccionMejoraId).prop('checked',true);
				gestionAccionMejoraId = val.gestionAccionMejoraId;
			}

		});
		
		
		$("#selCausaAcc").prop('disabled', true);
		$("#resumenAcc").prop('disabled', true);
		$("#selTrabajadorAux").prop('disabled', true);
		$("#selTipoSolicitudAux").prop('disabled', true);
		$("#selTipoHallazgo").prop('disabled', true);
		
		switch(restriccionId){ 
		case 7:
			$("#tblV tbody tr").each(function(index,elem){
				if(index>0){
					var selected=$(elem).find("td input");
					if(selected.prop("checked")){
						
					}else{
						$(elem).remove();
					}
				}
			});
			break;
		case 8:
			$("#tblV tbody tr").each(function(index,elem){
				if(index>0){
					var selected=$(elem).find("td input");
					if(selected.prop("checked")){
						
					}else{
						$(elem).remove();
					}
				}
				
			});
			break;
		case 9:
			$("#tblV tbody tr").each(function(index,elem){
				if(index>0){
					var selected=$(elem).find("td input");
					if(selected.prop("checked")){
						
					}else{
						$(elem).remove();
					}
				}
				
			});
			break;
		}
		
		
		break;
	default:
		alert("Ocurrió un error al traer las gestiones acciones de mejoras!");
	}
}
function irModuloSolicitudAccion(solicitudId){
    sessionStorage.removeItem("solicitudAuxId");
    createSession("solicitudAuxId",parseInt(solicitudId));
    window.open("accionmejora.html");
    
}
// onload del modal
function agregarAccionMejora(pasociadoTipo, pasociadoId,prestriccionId,functionCallback) {
	if(pasociadoId){
		guardoAccion = false;
		asociadoTipo = pasociadoTipo;
		asociadoId = pasociadoId;
		restriccionId=prestriccionId;
		$("#mdradagregacc").attr(
				"onclick",
				"javascript:agregarGestionAccionMejora(" + asociadoTipo + ", "
						+ asociadoId + ");");
		$('#mdVerif').modal('show');
		$('#mdProgFecha').modal('hide');
		var alturaAux=$(window).height()-115;
		$('#mdVerif #divAsocGAM').css({"height":alturaAux+"px","overflow-y":"auto"})
		$("#modalSolicitudAccionAux .modal-body").hide();
		$("#divAsocGAM").show();
		agregarGestionAccionMejora(asociadoTipo,asociadoId,functionCallback);
	} else {
		alert("Esta pregunta no esta respondida.");
	}

}

$('#mdVerif').on('hidden.bs.modal', function(e) {
    $('#mdProgFecha').modal('show'); 
});

function volverSolicitudesAccion(){
	$("#modalSolicitudAccionAux .modal-body").hide();
	$("#divAsocGAM").show();
	$("#modalSolicitudAccionAux .modal-title").html(" Asignar Acción de Mejora  ")
	agregarAccionMejora(asociadoTipo,asociadoId,restriccionId);
}


function seleccionarGAM(pgestionAccionMejoraId) {
	$("#btnGuardarAsoc").hide();
	if(parseInt(pgestionAccionMejoraId)==0){
		$("#btnGuardarAsocPlus").show();
		$("#selCausaAcc").prop('disabled', false);
		$("#resumenAcc").prop('disabled', false);
		$("#selTrabajadorAux").prop('disabled', false);
		$("#selTipoSolicitudAux").prop('disabled', false);
		$("#selTipoHallazgo").prop('disabled', false);
	}else{
		$("#btnGuardarAsocPlus").show();
		$("#selCausaAcc").prop('disabled', true);
		$("#resumenAcc").prop('disabled', true);
		$("#selTrabajadorAux").prop('disabled', true);
		$("#selTipoSolicitudAux").prop('disabled', true);
		$("#selTipoHallazgo").prop('disabled', true);
	}
	gestionAccionMejoraId = pgestionAccionMejoraId;
}

function guardarSeleccion() {
	var tipoHallazgoId=parseInt($("#selTipoHallazgo").val());
	
	var dataParam = {
	    idCompany : getSession("gestopcompanyid"),
		asociadoTipo : asociadoTipo,
		asociadoId : asociadoId,responsableId:$("#selTrabajadorAux").val(),
		
		tipoHallazgo:{id:tipoHallazgoId},
		
		solicitud:{id:$("#selTipoSolicitudAux").val()},
		causaId:$("#selCausaAcc").val(),
		resumen:$("#resumenAcc").val(),estadoId:1,
		gestionAccionMejoraId : gestionAccionMejoraId
	}; 
	callAjaxPost(URL + '/gestionaccionmejora/items/save', dataParam,
			procesarGuardarAsociacionGAM);
}
function guardarSeleccionPlus() {
	var tipoHallazgoId=parseInt($("#selTipoHallazgo").val());
	
	var dataParam = {
                idCompany : getSession("gestopcompanyid"),
		asociadoTipo : asociadoTipo,
		asociadoId : asociadoId,responsableId:$("#selTrabajadorAux").val(),
		
		tipoHallazgo:{id:tipoHallazgoId},
		
		solicitud:{id:$("#selTipoSolicitudAux").val()},
		causaId:$("#selCausaAcc").val(),
		resumen:$("#resumenAcc").val(),
		estadoId:1,
		gestionAccionMejoraId : gestionAccionMejoraId
	}; 
	callAjaxPost(URL + '/gestionaccionmejora/items/save', dataParam,
			procesarGuardarAsociacionPlusGAM);
}
function procesarGuardarAsociacionPlusGAM(data){
   
   switch(data.CODE_RESPONSE){
      case "05":
         guardoAccion = true;
		
	 agregarAccionMejora(asociadoTipo, asociadoId,restriccionId,
	    function(){
	       $('#mdVerif').modal('hide');
	       mensajeUx="<label>Solicitud de mejora guardada. Ahora registre las acciones " +
	       		 "correctivas.</label>";
	       mensajesUx(mensajeUx,1,"verAccionesSolicitudAux("+data.nuevoId+")","AgregarAccMej");
	       
	       $('#modalMensajeUxAgregarAccMej').on('hidden.bs.modal',function(e){
		     verAccionesSolicitudAux(data.nuevoId);
		 });
	       
	      //verAccionesSolicitudAux(data.nuevoId);
	    })
	 break;
      default:
	 //alert("Ocurrió un error al guardar la Asociacion!");
	  mensajeUx="¡ Ocurrió un error al guardar la Asociacion !";
      	  mensajesUx(mensajeUx,2,"");
   }		
}

function procesarGuardarAsociacionGAM(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		guardoAccion = true;
		$('#mdVerif').modal('hide');
		break;
	default:
		alert("Ocurrió un error al guardar la Asociacion!");
	}
		
}

//  **************************** CORRECCIONES AUX **********************************

var banderaEdicionCorrAux=false;
var gestionAccionEdicionId=0;
var gestionAccionEdicionObj={}

function verAccionesSolicitudAux(solId){
    
   $('#modalMensajeUxAgregarAccMej').modal("hide"); //User Experience - Ocultar modal
   $('#mdVerif').modal('show');
    
	gestionAccionEdicionId=parseInt(solId);
	listFullSolicitudesAcciones.forEach(function(val){
		if(val.gestionAccionMejoraId==gestionAccionEdicionId){
			gestionAccionEdicionObj=val;
		}
	});
	$("#modalSolicitudAccionAux .modal-title").html("<a onclick='volverSolicitudesAccion()'>Solicitudes </a> > Plan de Trabajo asociado")
	
	$("#modalSolicitudAccionAux .modal-body").hide();
	$("#divAccAux").show();
	
	banderaEdicionCorrAux = false;
	$("#btnCancelarCorrAux").hide();
	$("#btnNuevaCorrAux").show();
	$("#btnGuardarCorrAux").hide();
	$("#btnEliminarCorrAux").hide();

	$("#btnNuevaCorrAux").attr("onclick", "javascript:nuevaAccionMejoraAux();");
	$("#btnCancelarCorrAux").attr("onclick", "javascript:cancelarAccionMejoraAux();");
	$("#btnGuardarCorrAux").attr("onclick", "javascript:guardarAccionMejoraAux();");
	$("#btnEliminarCorrAux").attr("onclick", "javascript:eliminarAccionMejoraAux();");

	var dataParam = {
		accionMejoraTipoId : 0,
		gestionAccionMejoraId : gestionAccionEdicionId
	};

	callAjaxPost(URL + '/gestionaccionmejora/accionmejora', dataParam,
			procesarDataListadoAccionMejoraAux);
}

var accionMejoraAuxObj={},listFullAccionesAux=[];
var listClasificacionGeneralAccion = [];
var listTipoAccionMejoraH= [];

function procesarDataListadoAccionMejoraAux(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		listFullAccionesAux = data.list;
		listClasificacionGeneralAccion = data.clasificacion;
		listTipoAccionMejoraH= data.listTipoAccionMejoraH;
		
		accionMejoraAuxObj={accionMejoraId:0};
		$("#tblAccAux tbody tr").remove();

		var nro = 0;
		listFullAccionesAux.forEach(function(val,index){
			$("#tblAccAux tbody").append(
					"<tr id='trauxx" + val.accionMejoraId
							+ "' onclick='javascript:editarAccionMejoraAux("
							+index+")' >"

							+ "<td id='auxtddesc" + val.accionMejoraId
							+ "'>" + val.descripcion + "</td>"

							+ "<td id='auxtdcla" + val.accionMejoraId
							+ "'>" + val.clasificacion.nombre + "</td>"
							
							+ "<td id='tdtipoa" + val.accionMejoraId
							+ "'>" + val.tipoAccionNombre + "</td>"
							
							+ "<td id='auxtdrespnom" + val.accionMejoraId
							+ "'>" + val.responsableNombre + "</td>"


							+ "<td id='auxtdfec" + val.accionMejoraId
							+ "'>" + val.fechaRevisionTexto + "</td>"
							+ "<td id='auxtdfecr" + val.accionMejoraId
							+ "'>" + val.fechaRealTexto + "</td>"
							+ "<td id='auxtdevi" + val.accionMejoraId
							+ "'>" + val.evidenciaNombre + "</td>"
							 

							+ "</tr>");
			formatoCeldaSombreableTabla(true,"tblAccAux");
		});
		
		break;
	default:
		alert("Ocurrió un error al traer las correcciones inmediatas!");
	}
}
function editarAccionMejoraAux(pindex) {
	accionMejoraAuxObj=listFullAccionesAux[pindex];
	
	if (!banderaEdicionCorrAux) {
	    accionMejoraId = accionMejoraAuxObj.accionMejoraId ;	
	        formatoCeldaSombreableTabla(false,"tblAccAux");
		var name = accionMejoraAuxObj.descripcion;
		$("#auxtddesc" + accionMejoraId)
				.html("<textarea type='text' id='inputDescAux' " +
					"class='form-control' placeholder='Resumen' rows='2'></textarea>");
		$("#inputDescAux").val(name);
		//  
		$("#auxtdfec" + accionMejoraId).html(
				"<input type='date' id='inputFecAux' class='form-control'  >");
		var myDate = convertirFechaInput(accionMejoraAuxObj.fechaRevision );
		$("#inputFecAux").val(myDate);
		//  
		$("#auxtdfecr" + accionMejoraId).html(
				"<input type='date' id='inputFecRAux' class='form-control'  >");
		var myDateR = convertirFechaInput(accionMejoraAuxObj.fechaReal );
		$("#inputFecRAux").val(myDateR);
		var optionEvidencia={
			     isImagen: false,
			     container: "#auxtdevi"+accionMejoraId,
				 idAux: "AccMej",
				 esNuevo: false,
				 functionCall: function(){},
				 evidenciaNombre: accionMejoraAuxObj.evidenciaNombre,
				 descargaUrl: "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+accionMejoraId+"",
			}
			
		crearFormEvidenciaCompleta(optionEvidencia);
		
		var selClasifiacionAccAux = crearSelectOneMenuOblig("selClasifiacionAccAux", "", 
				listClasificacionGeneralAccion, accionMejoraAuxObj.clasificacion.id, "id", "nombre");
		$("#auxtdcla"+accionMejoraId).html(selClasifiacionAccAux);
		
		var selTipoAcc = crearSelectOneMenuOblig("selTipoAcc", "", listTipoAccionMejoraH, accionMejoraAuxObj.tipoAccionId,
			"tipoAccionId", "tipoAccionNombre");
	        $("#tdtipoa" + accionMejoraId).html(selTipoAcc);
	        
		banderaEdicionCorrAux = true;
		 
		$("#auxtdrespnom"+accionMejoraId).html("<input  class='form-control' type='text' placeholder='Ingresar nombre y seleccionar' id='inputNombreRespAccMejAux'>" +
								"<div id='divAutoCompletarTrabAccMejAux'></div>");

		$("#inputNombreRespAccMejAux").val(accionMejoraAuxObj.responsableNombre);
		verAutoCompletarTrabAccionMejoraAux();
		
		$("#btnCancelarCorrAux").show();
		$("#btnNuevaCorrAux").hide();
		$("#btnGuardarCorrAux").show();
		$("#btnEliminarCorrAux").show();
	}
}
function nuevaAccionMejoraAux() {
	if (!banderaEdicionCorrAux) {
		var selClasifiacionAccAux = crearSelectOneMenuOblig("selClasifiacionAccAux", "", 
				listClasificacionGeneralAccion, "", "id", "nombre");
		
		var selTipoAcc = crearSelectOneMenuOblig("selTipoAcc", "", 
			listTipoAccionMejoraH, "",
			"tipoAccionId", "tipoAccionNombre");
		
		accionMejoraAuxObj ={accionMejoraId: 0};
		
		$("#tblAccAux tbody").append(
				"<tr id='asdff0'>"
				+ "<td><textarea  id='inputDescAux' class='form-control' placeholder='Resumen' rows='2'></textarea>"
				+ "</td>" 
				+ "<td>"+selClasifiacionAccAux+"</td>"
				+ "<td>"+selTipoAcc+"</td>"
				
			        +"<td ><input class='form-control' type='text' placeholder='Ingresar nombre y seleccionar' id='inputNombreRespAccMejAux'>" +
								"<div id='divAutoCompletarTrabAccMejAux'></div></td>"
				+ "<td><input type='date' id='inputFecAux' class='form-control' ></td>"
				+ "<td><input type='date' id='inputFecRAux' class='form-control' ></td>"
				+ "<td id='auxtdevi0'></td>"
				+ "</tr>");
		$("#inputDescAux").val("")
		$("#inputFecAux").val(obtenerFechaActual());
		verAutoCompletarTrabAccionMejoraAux();

		var optionEvidencia={
			     isImagen: false,
			     container: "#auxtdevi"+accionMejoraAuxObj.accionMejoraId,
				 idAux: "AccMej",
				 esNuevo: true,
				 functionCall: function(){},
				 evidenciaNombre: "",
				 descargaUrl: "",
			}
			
		crearFormEvidenciaCompleta(optionEvidencia);
		$("#btnCancelarCorrAux").show();
		$("#btnNuevaCorrAux").hide();
		$("#btnGuardarCorrAux").show();
		$("#btnEliminarCorrAux").hide();
		formatoCeldaSombreableTabla(false,"tblAccAux");
		banderaEdicionCorrAux = true;
	} else {
		alert("Guarde primero.");
	}
}
function cancelarAccionMejoraAux() {
	verAccionesSolicitudAux(gestionAccionEdicionId);
}

function eliminarAccionMejoraAux() {
	var r = confirm("¿Está seguro de eliminar la Correccion inmediata?");
	if (r == true) {
		var dataParam = {
				accionMejoraId : accionMejoraId
		};

		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/delete',
				dataParam, procesarResultadoEliminarAccionMejoraAux);
	}
}

function procesarResultadoEliminarAccionMejoraAux(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		verAccionesSolicitudAux(gestionAccionEdicionId);
		break;
	default:
		alert("Ocurrió un error al eliminar la Correccion inmediata!");
	}
}
function guardarAccionMejoraAux () {
	var campoVacio = true;  
	var inputDesc = $("#inputDescAux").val();   
	var inputFecha = convertirFechaTexto($("#inputFecAux").val());
	var inputFechaReal = convertirFechaTexto($("#inputFecRAux").val());
	
	var clasificacionId = $("#selClasifiacionAccAux").val();
	
	var selTipoAcc = parseInt($("#selTipoAcc option:selected").val()); //Ahora lo trabajamos como integer
	 
	if (   inputDesc.length == 0 || inputFecha == null ) {
		campoVacio = false;
	}
	 if($("#selTrabajadorAccAux").val() == null){
	     alert("Seleccione trabajador"); return;
	 }
	
	var tipoGrupoSeguridadId= $("#selTipo").val(); 
	 
	if (campoVacio) {

		var dataParam = {
			accionMejoraId : accionMejoraAuxObj.accionMejoraId,
		        trabajadorResponsableId:$("#selTrabajadorAccAux").val(),
			descripcion : inputDesc, responsableNombre:"",responsableMail:"",
			fechaRevision : inputFecha,
			fechaReal : inputFechaReal,
			horaPlanificada:"9:00:00",
			clasificacion : {id : clasificacionId},
			clasificacion : {id : clasificacionId},
			accionMejoraTipoId : selTipoAcc,
			estadoId : 1,
			inversionAccion:0,
			companyId : getSession("gestopcompanyid"),
			tipoGrupoSeguridadId: tipoGrupoSeguridadId,
			gestionAccionMejoraId : gestionAccionEdicionId
		};
		 
		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/save', dataParam,
				procesarResultadoGuardarAccionMejoraAux);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarResultadoGuardarAccionMejoraAux(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
	    guardarEvidenciaAuto(data.nuevoId,"fileEviAccMej",
			bitsMega*10,"/gestionaccionmejora/accionmejora/evidencia/save",function(){
		verAccionesSolicitudAux(gestionAccionEdicionId);
	},"accionMejoraId");
		
		break;
	default:
		alert("Ocurrió un error al guardar la accion Mejora!");
	}
}