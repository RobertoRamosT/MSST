
function ocultarFiltroAccidentes(){
	$("#modalFiltroAccidentes").modal("hide");
}

function verFiltroAccidentes(){
	$("#modalFiltroAccidentes").modal("show");
}

function crearFiltroAccidentes(functionCallBack){
	$("#modalFiltroAccidentes").remove();

	var contenido = "";

	var listContenido=[
		{sugerencia:"",label:"Desde",inputForm:"<input type='date' id='fechaInicioOcurrenciaAcc' class='form-control'>"},
		{sugerencia:"",label:"Hasta",inputForm:"<input type='date' id='fechaFinOcurrenciaAcc' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroAccidentes()'>" +
			       "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='valoresFiltroAccidentes()'>" +
					   "<i class='fa fa-filter'></i> Aplicar filtro" +
			       "</button>"},
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalFiltroAccidentes",nombre:"<i class='fa fa-filter'></i> Filtro - Accidentes/Incidentes",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	var hoy = getSession("fechaHoyOrdenInversoTexto");

	$("#fechaInicioOcurrenciaAcc").val(sumaFechaDias(-365,hoy));$("#fechaFinOcurrenciaAcc").val(hoy);

	functionCallBack();
}

function valoresFiltroAccidentes(){
	ocultarFiltroAccidentes();

	cargarAccidentesPorEvaluar();
}
