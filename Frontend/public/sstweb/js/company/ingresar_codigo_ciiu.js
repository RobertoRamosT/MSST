var sub3TipoEmpresaId;
function ingresarCodigoCIIU() {
	$("#modalAgregarCiiu").modal("hide");
	$("#modalAgregarCiiu").modal("show");   
	$("#modalAgregarCiiu .modal-body").html(
			"<div class='row'>" +
				"<section class='col col-xs-4'>" +
					"Ingresar CIIU" +
				"</section>" +
				"<section class='col col-xs-4'>" +
					"<input type='text'  onkeyup='generarSub3TipoEmpresa()' id='inputCodigoCiiu' class='form-control'>" +
				"</section>" +
			"</div>" +
			"<div class='row'>" +
				"<section class='col col-xs-4'>" +
					"Actividad Económica" +
				"</section>" +
				"<section class='col col-xs-6'>" +
					companyObj.category +
				"</section>" +
			"</div>"
	);   
	$("#modalAgregarCiiu .modal-footer").html(
		"<button type='button' class='btn btn-success' onclick='guardaringresoCiiu()' data-dismiss='modal'><i class='fa fa-save'></i> Asignar</button>"+
		"<button type='button' class='btn btn-default'	data-dismiss='modal'>Cerrar</button>"
	); 
	
}
function generarSub3TipoEmpresa()
{ 
	sub3TipoEmpresaId=0;
	var codigoCiiu=$("#inputCodigoCiiu").val();   
	listClase.forEach(function(val, index){  
		if(val.codigo==codigoCiiu)
		{
			sub3TipoEmpresaId=val.id; 
		} 
	});
}
function guardaringresoCiiu()
{
	var empresaId=companyObj.idCompany;
	if(sub3TipoEmpresaId!=0)
	{
		var dataParam=
		{
			id:0,
			empresa:{idCompany:empresaId},
			subSubSubtipoempresa:{id:sub3TipoEmpresaId}
		}
		callAjaxPost(URL+'/empresa/ciiu/save',dataParam,
				verEmpSub3Tipo);
	}
	else 
	{ 
		alert("Lo sentimos, el codigo CIIU no es correcto. \n Por favor vuelva a ingresar el codigo");
	
	}
	
}



 
