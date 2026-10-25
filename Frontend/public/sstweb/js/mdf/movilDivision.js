/**
 * 
 */


var divisionObjMovil;
var banderaEdicionDivisionMovil;
var listFullDivision;
function verDetalleDivisiones(){
	banderaEdicionDivisionMovil=false;
	var container=$("#unidadesGosstMovil");
	container.html("<div class='loadingGosst'><img src='../imagenes/gif/ruedita.gif'></img>   Cargando</div>");
	 
	setTimeout(function(){
		var dataParam = {
				matrixId : mdfIdMovil
		};
		
		callAjaxPostNoLoad(URL + '/division', dataParam, procesarListarDivisionesMovil ,null,null)  ;
	},1400);

	
	
}
function procesarListarDivisionesMovil(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;
		listFullDivision=list;
		var container=$("#unidadesGosstMovil");
		container.html("");
		container.append("<div class='ubicacionGosst'  onclick=''> "+
				"<i class='fa fa-university fa-2x' aria-hidden='true'></i>"+mdfNombreMovil+" </div>");
		container.append("<div class='volverGosst' id='volverDivUnidad' onclick='verUnidadesMovil()'> "+
				"<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i> Volver"+" </div>");
		container.append("<div class='volverGosst' id='volverDivDivision' onclick='verDetalleDivisiones()'> "+
				"<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i> Volver"+" </div>");
		container.append("<div class='cantidadGosst'  > "+list.length+" división(es)</div>");
		container.append("<div class=' agregarGosst' id='agregarDivDivision' onclick='agregarDivisionMovil()'> "+
				"<i class='fa fa-plus fa-2x' aria-hidden='true'></i> Nuevo"+" </div>");
		container.append("<div class='despliegueGosst' id='areaDivGosst' onclick='verDetalleAreas()'> "+
				"<i class='fa fa-university fa-2x' aria-hidden='true'></i> Agregar Areas"+" </div>");
		container.append("<div class=' guardarGosst' id='guardarDivDivision' onclick='guardarDivisionMovil()'> "+
				"<i class='fa fa-save fa-2x' aria-hidden='true'></i> Guardar"+" </div>");
		container.append("<div class=' cantidadGosst' id='editarDivDivision' onclick='editarDivisionMovil()'> "+
				"<i class='fa fa-wrench fa-2x' aria-hidden='true'></i> Editar"+" </div>");
		container.append("<div class='eliminarGosst' id='eliminarDivDivision' onclick='eliminarDivisionMovil()'> "+
				"<i class='fa fa-times fa-2x' aria-hidden='true'></i> Eliminar"+" </div>");
		$("#volverDivUnidad").show(); 
		$("#volverDivDivision").hide();
		$("#guardarDivDivision").hide();
		$("#editarDivDivision").hide();
		$("#eliminarDivDivision").hide();
		$("#areaDivGosst").hide();
		listFullDivision.forEach(function(val,index){
			container.append("<div class='col-ss-12 col-xs-6 col-md-6 divisionGosst' id='divisionDiv"+val.divisionId+"'  " +
					"onclick='javascript:selecionarDivisionMovil("+index+")'>" +
					"<i class='fa fa-2x fa-users' aria-hidden=true'></i>"+	val.divisionName+ 
					"" +
					"</div>");
		});
		break;
	default:
		alert("Ocurrió un error al traer las divisiones!");
	}


}


function editarDivisionMovil(){
	$("#guardarDivDivision").show();
	$("#areaDivGosst").hide();
	$("#editarDivDivision").hide();
	$("#eliminarDivDivision").show();
	var container=$("#unidadesGosstMovil");
	$(".divisionGosst").hide();
	container.append("<div class='col-ss-12 col-xs-6 col-md-6 divisionGosst' >" +
			"<input class='form-control' id='divisionNombreInput' placeholder='Nuevo Nombre' autofocus='true'>" + 
			"" +
			"	</div>"+
			"<div class='col-ss-12 col-xs-6 col-md-6 divisionGosst' >" + 
			"Antes: "+divisionObjMovil.divisionName+
			"" +
			"	</div>");
}

function selecionarDivisionMovil(pindex){
	if(!banderaEdicionDivisionMovil){
		banderaEdicionDivisionMovil=true;
		divisionObjMovil=listFullDivision[pindex];
	var divisionIdMovil=listFullDivision[pindex].divisionId;
	var diviNombremdfNombreMovil=listFullDivision[pindex].divisionName;  
	$("#divisionDiv"+divisionIdMovil).addClass("seleccionGosst");
	$("#agregarDivDivision").hide();
	$(".cantidadGosst").hide();
	$("#volverDivUnidad").hide();
	$("#volverDivDivision").show();
	$("#areaDivGosst").show();
	$("#editarDivDivision").show();
	}
}


function agregarDivisionMovil(){
	if(!banderaEdicionDivisionMovil){ 
		divisionObjMovil={divisionId:0};
		banderaEdicionDivisionMovil=true;
		var container=$("#unidadesGosstMovil");
		$("#volverDivUnidad").hide();
		$("#agregarDivDivision").hide();
		$("#volverDivDivision").show();
		$("#guardarDivDivision").show(); 
		$(".divisionGosst").hide();
		container.append("<div class='col-ss-12 col-xs-6 col-md-6 divisionGosst' >" +
				"<input class='form-control' id='divisionNombreInput' placeholder='Nombre'>" + 
				"" +
				"	</div>" )
	}

}

function guardarDivisionMovil(){
	var campoVacio = true;

	 

	if ($("#divisionNombreInput").val().length == 0  ) {
		campoVacio = false;
	}

	 

	if (campoVacio) {

		var dataParam = {
		
			divisionName : $("#divisionNombreInput").val().toUpperCase(),
			divisionId : divisionObjMovil.divisionId ,
			matrixId : mdfIdMovil
		};

		callAjaxPost(URL + '/division/save', dataParam, procesarGuardarDivisionMovil);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarDivisionMovil(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		verDetalleDivisiones();
		break;
	case "08": 
		alert("No se puede eliminar, tiene "+data.areaSons.length+ " área(s) asociada(s)."); 
		break;
	default:
		alert("Ocurrió un error al guardar la matriz!");
	}
}

function eliminarDivisionMovil(){
	var r=confirm("¿Está seguro de eliminar esta división?");
	if(r){
		var dataParam = { 
				divisionId : divisionObjMovil.divisionId 
			};

			callAjaxPost(URL + '/division/delete', dataParam, procesarGuardarDivisionMovil);
	}
	
}