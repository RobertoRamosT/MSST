var banderaEdicion;

$(document).ready(function() {
	insertMenu();
	cargarPrimerEstado();
});

$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})

function cargarPrimerEstado() {


	callAjaxPost(URL + '/login/licencia', {},
			procesarDataDescargadaPrimerEstado);

}

function procesarDataDescargadaPrimerEstado(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var licencia = data.licencia;
		$("#dueLic").val(licencia.planOwner);
		$("#tipLic").val(licencia.planType);
		$("#fVenc").val(licencia.fechaVencimiento);
		$("#usuPerm").val(licencia.numeroUsuarios);
		$("#empPerm").val(licencia.numeroEmpresas);
		$("#espAlm").val(licencia.espacioAlmacenamiento);
		
		break;
	default:
		alert("Ocurrió un error al traer los datos de la licencia!");
	}
}
