var analisisCausaId;
var banderaEdicionAnal;
var listanombretab;
var listDniNombre;
function cargarModalAnalisisCausa() {
	banderaEdicionAnal = false;
	$("#btnCancelarAnalCau").hide();
	$("#btnNuevaAnalCau").show();
	$("#btnGuardarAnalCau").hide();
	$("#btnEliminarAnalCau").hide();

	$("#btnNuevaAnalCau").attr("onclick", "javascript:nuevaAnalisisCausa();");
	$("#btnCancelarAnalCau").attr("onclick", "javascript:cancelarAnalisisCausa();");
	$("#btnGuardarAnalCau").attr("onclick", "javascript:guardarAnalisisCausa();");
	$("#btnEliminarAnalCau").attr("onclick", "javascript:eliminarAnalisisCausa();");

	var dataParam = {
		gestionAccionMejoraId : gestionAccionMejoraId
	};

	callAjaxPost(URL + '/gestionaccionmejora/analisiscausa', dataParam,
			procesarDataListadoAnalisisCausa);
}

function procesarDataListadoAnalisisCausa(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;

		$("#tblAnalCau tbody tr").remove();

		var nro = 0;
		for (index = 0; index < list.length; index++) {
			nro++;
			$("#tblAnalCau tbody").append(
					"<tr id='tr" + list[index].analisisCausaId
							+ "' onclick='javascript:editarAnalisisCausa("
							+ list[index].analisisCausaId + ")' >"

							+ "<td id='tdcaudes" + list[index].analisisCausaId
							+ "'>" + list[index].descripcion + "</td>"
							+ "<td id='tdcausa" + list[index].analisisCausaId
							+ "'>" + list[index].metodo + "</td>"

							+ "<td id='tdcauevi" + list[index].analisisCausaId
							+ "'>" 
							+ list[index].evidenciaNombre+"</td>"

							+ "<td id='tdcauresnom" + list[index].analisisCausaId
							+ "'>" + list[index].responsableNombre + "</td>"

							+ "<td id='tdcauresmail" + list[index].analisisCausaId
							+ "'>" + list[index].responsableMail
							+ "</td>"

							+ "</tr>");
		}

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
		break;
	default:
		alert("Ocurrió un error al traer los analisis!");
	}
}
var name2;
function editarAnalisisCausa(panalisisCausaId) {
	if (!banderaEdicionAnal) {
		analisisCausaId = panalisisCausaId;

		var name = $("#tdcaudes" + analisisCausaId).text();
	
		$("#tdcaudes" + analisisCausaId)
		.html(
				"<input type='text' id='inputCausaDes' class='form-control' placeholder='Causa' value='"
						+ name + "'>");

		var metodoCausa = $("#tdcausa" + analisisCausaId).text();
		
		$("#tdcausa" + analisisCausaId)
		.html(
				"<input type='text' id='inputCausaMetodo' class='form-control' placeholder='Método' value='"
						+ metodoCausa + "'>");
		
		
		
		var name1 = $("#tdcauresnom" + analisisCausaId).text();
		$("#tdcauresnom" + analisisCausaId)
				.html(
						"<input type='text' id='inputCausaResNom' class='form-control' placeholder='Nombre' value='"
								+ name1 + "'>");
		ponerListaSugerida("inputCausaResNom",listanombretab,true);
$("#inputCausaResNom").on("autocompleteclose",function(){
	
	llenarCorreoAutoTrabAnalisi();
	
});
		name2 = $("#tdcauresmail" + analisisCausaId).text();
		$("#tdcauresmail" + analisisCausaId)
				.html(
						"<input type='text' id='inputCausaResMail' class='form-control' placeholder='Correo' value='"
								+ name2 + "'>");
		var nombreEvidencia=$("#tdcauevi" + analisisCausaId)
		.text();
		$("#tdcauevi" + analisisCausaId)
				.html(
						"<a href='"
									+ URL
									+ "/gestionaccionmejora/analisiscausa/evidencia?analisisCausaId="
									+ analisisCausaId
									+ "' "
									+ "target='_blank' id='descargarimagen"
									+ analisisCausaId
									+ "'>" +
									nombreEvidencia+"</a>"
									+ "<br/><a href='#' onclick='javascript:cargarAnEvidencia();'>Subir</a>");
		
		banderaEdicionAnal = true;
		$("#btnCancelarAnalCau").show();
		$("#btnNuevaAnalCau").hide();
		$("#btnGuardarAnalCau").show();
		$("#btnEliminarAnalCau").show();
	}
}
function llenarCorreoAutoTrabAnalisi(){
	var nombreTrab=$("#inputCausaResNom").val();
	var correo;
	
		for (index = 0; index < listDniNombre.length; index++) {
			
			if(listDniNombre[index]["nombre"]==nombreTrab){
				correo=listDniNombre[index]["correo"]
			$("#inputCausaResMail").val(correo);
			
			break;
			}else{
				$("#inputCausaResMail").val(name2);
			
			
			}
		}

	
	
	
}
function nuevaAnalisisCausa() {
	if (!banderaEdicionAnal) {
		banderaEdicionAnal = true;
		$("#tblAnalCau tbody")
				.append(
						"<tr id='0'>"
								+ "<td><input type='text' id='inputCausaDes' class='form-control' placeholder='Descripción'></td>"
								+ "<td><input type='text' id='inputCausaMetodo' class='form-control' placeholder='Método'></td>"

								+ "<td>...</td>"
								+ "<td><input type='text' id='inputCausaResNom' class='form-control' placeholder='Nombre'></td>"
								+ "<td><input type='text' id='inputCausaResMail' class='form-control' placeholder='Correo'></td>"
								+ "</tr>");
		analisisCausaId = 0;
		$("#btnCancelarAnalCau").show();
		$("#btnNuevaAnalCau").hide();
		$("#btnGuardarAnalCau").show();
		$("#btnEliminarAnalCau").hide();
		ponerListaSugerida("inputCausaResNom",listanombretab,true);
		$("#inputCausaResNom").on("autocompleteclose",function(){
			
			llenarCorreoAutoTrabAnalisi();
			
		});
		banderaEdicionAnalCau = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarAnalisisCausa() {
	cargarModalAnalisisCausa();
}

function eliminarAnalisisCausa() {
	var r = confirm("¿Está seguro de eliminar el Analisis?");
	if (r == true) {
		var dataParam = {
				analisisCausaId : analisisCausaId
		};

		callAjaxPost(URL + '/gestionaccionmejora/analisiscausa/delete',
				dataParam, procesarResultadoEliminarAnalisisCausa);
	}
}

function procesarResultadoEliminarAnalisisCausa(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarModalAnalisisCausa();
		break;
	default:
		alert("Ocurrió un error al eliminar el Analisis!");
	}
}

function guardarAnalisisCausa() {

	var campoVacio = true;
	var inputDesc = $("#inputCausaDes").val();
	var inputRespNom = $("#inputCausaResNom").val();
	var inputRespMail = $("#inputCausaResMail").val();


	if (inputDesc.length == 0 || inputRespNom.length == 0
			|| inputRespMail == 0) {
		campoVacio = false;
	}

	if (campoVacio) {

		var dataParam = {
			analisisCausaId : analisisCausaId,
			descripcion : inputDesc,
			metodo:$("#inputCausaMetodo").val(),
			responsableNombre: inputRespNom,
			responsableMail : inputRespMail,
			gestionAccionMejoraId : gestionAccionMejoraId
		};

		callAjaxPost(URL + '/gestionaccionmejora/analisiscausa/save', dataParam,
				procesarResultadoGuardarAnalisisCausa);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarResultadoGuardarAnalisisCausa(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarModalAnalisisCausa();
		break;
	default:
		alert("Ocurrió un error al guardar el analisis!");
	}
}

function cargarAnEvidencia() {
	$("#modalAn").hide();
	$("#modalAnUpload").show();
}

function cancelarAnUploadEvidencia() {
	$("#modalAn").show();
	$("#modalAnUpload").hide();
}

function uploadAnEvidencia() {
	$.blockUI({
		message : 'cargando...'
	});
	guardarEvidenciaAuto(analisisCausaId,"fileAnEvi",bitsEvidenciaAnalisisCausa,
			"/gestionaccionmejora/analisiscausa/evidencia/save",function(){
		$.unblockUI();
		$("#modalAn").show();
		$("#modalAnUpload").hide();
	},"analisisCausaId")
 
 
}