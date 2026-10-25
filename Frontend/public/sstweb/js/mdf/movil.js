/**
 * 
 */
var banderaEdicionMovil=false;
var mdfIdMovil; 
var mdfNombreMovil;
window.onresize = function(event) {
	ajustarBarraSizeTop("unidadesGosstMovil");
}
function ajustarBarraSizeTop(divId){
	$("#"+divId).css({"top":$("#barraMenu").css("height")});
}
 

function verUnidadesMovil(){
	var container=$("#unidadesGosstMovil");
	container.html("");
	mdfNombreMovil="";
	mdfIdMovil=0;

	banderaEdicionMovil=false;
	$(".nuevoGosst").hide();
	ajustarBarraSizeTop("unidadesGosstMovil");
	container.append("<div class='volverGosst' id='volverDivUnidad' onclick='verUnidadesMovil()'> "+
			"<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i> Volver"+" </div>");
	container.append("<div class='cantidadGosst'  > "+listMdfFull.length+" unidad(es)</div>");
	container.append("<div class=' agregarGosst' id='agregarDivUnidad' onclick='agregarUnidadMovil()'> "+
			"<i class='fa fa-plus fa-2x' aria-hidden='true'></i> Nuevo"+" </div>");
	container.append("<div class='despliegueGosst' id='divisionDivGosst' onclick='verDetalleDivisiones()'> "+
			"<i class='fa fa-university fa-2x' aria-hidden='true'></i>Agregar Divisiones"+" </div>");
	container.append("<div class=' guardarGosst' id='guardarDivUnidad' onclick='guardarUnidadMovil()'> "+
			"<i class='fa fa-save fa-2x' aria-hidden='true'></i> Guardar"+" </div>");
	container.append("<div class=' cantidadGosst' id='editarDivUnidad' onclick='editarUnidadMovil()'> "+
			"<i class='fa fa-wrench fa-2x' aria-hidden='true'></i> Editar"+" </div>");
	container.append("<div class='eliminarGosst' id='eliminarDivUnidad' onclick='eliminarUnidadMovil()'> "+
			"<i class='fa fa-times fa-2x' aria-hidden='true'></i> Eliminar"+" </div>");
	if(!accesoUnidades){
		$("#agregarDivUnidad").off("click");
		$("#agregarDivUnidad").attr("onclick","");
		$("#agregarDivUnidad").on("click", function(){
			mensajeLimiteUnidad();
		});
	} 
	$("#volverDivUnidad").hide();
	$("#guardarDivUnidad").hide();
	$("#editarDivUnidad").hide();
	$("#divisionDivGosst").hide();
	$("#eliminarDivUnidad").hide();
	
	
listMdfFull.forEach(function(val,index){
		container.append("<div class='col-ss-12 col-xs-6 col-md-6 unidadGosst' id='unidadDiv"+val.matrixId+"'  " +
				"onclick='javascript:selecionarUnidadMovil("+index+")'>" +
				"<i class='fa fa-2x fa-university' aria-hidden=true'></i>"+val.matrixName+" : "+val.mdfTypeName+
				"" +
				"</div>");
	});
}

function editarUnidadMovil(){
	$("#guardarDivUnidad").show();
	$("#editarDivUnidad").hide();
	$("#divisionDivGosst").hide();
	$("#eliminarDivUnidad").show();
	var container=$("#unidadesGosstMovil");
	$(".unidadGosst").hide();
	container.append("<div class='col-ss-12 col-xs-6 col-md-6 unidadGosst' >" +
			"<input class='form-control' id='unidadNombreInput' placeholder='Nuevo Nombre' autofocus='true'>" + 
			"" +
			"	</div>"+
			"<div class='col-ss-12 col-xs-6 col-md-6 unidadGosst' >" + 
			"Antes: "+mdfNombreMovil+
			"" +
			"	</div>");
}
function selecionarUnidadMovil(pindex){
	if(!banderaEdicionMovil){
		banderaEdicionMovil=true;
	mdfIdMovil=listMdfFull[pindex].matrixId;
	mdfNombreMovil=listMdfFull[pindex].matrixName; 
	tipoMdfId= listMdfFull[pindex].mdfTypeId;
	$("#unidadDiv"+mdfIdMovil).addClass("seleccionGosst");
	$("#agregarDivUnidad").hide();
	$(".cantidadGosst").hide();
	
	$("#volverDivUnidad").show();
	$("#divisionDivGosst").show();
	$("#editarDivUnidad").show();
	}
}

function agregarUnidadMovil(){
	if(!banderaEdicionMovil){
		mdfIdMovil=0;
		banderaEdicionMovil=true;
		var container=$("#unidadesGosstMovil");
		$("#agregarDivUnidad").hide();
		$("#volverDivUnidad").show();
		$("#guardarDivUnidad").show();
		var selTipoUnidad=crearSelectOneMenu("selTipoUnidad", "", listMdfType, "-1", "mdfTypeId",
				"mdfTypeName", "Tipo");
		$(".unidadGosst").hide();
		container.append("<div class='col-ss-12 col-xs-6 col-md-6 unidadGosst' >" +
				"<input class='form-control' id='unidadNombreInput' placeholder='Nombre'>" + 
				"" +
				"	</div>"+
				"<div class='col-ss-12 col-xs-6 col-md-6 unidadGosst' >" + 
				selTipoUnidad+
				"" +
				"	</div>")
	}

}

function guardarUnidadMovil(){
	var campoVacio = true;

	if (mdfIdMovil==0) {
		tipoMdfId = $("#selTipoUnidad").val();
	}

	if ($("#unidadNombreInput").val().length == 0 || tipoMdfId == '-1') {
		campoVacio = false;
	}

	 

	if (campoVacio) {

		var dataParam = {
		
			matrixName : $("#unidadNombreInput").val().toUpperCase(),
			matrixId : mdfIdMovil,
			mdfTypeId : tipoMdfId,
			companyId : sessionStorage.getItem("gestopcompanyid")
		};

		callAjaxPost(URL + '/mdf/save', dataParam, procesarGuardarMatriz);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
function procesarGuardarMatrizMovil(data) {
	switch (data.CODE_RESPONSE) {
	case "05": 
		listarMatrices(); 
		break;
	case "08": 
		alert("No se puede eliminar, tiene "+data.divSons.length+ " division(es) asociada(s)."); 
		break;
	default:
		alert("Ocurrió un error al guardar la matriz!");
	}
}
function eliminarUnidadMovil(){
	var r=confirm("¿Está seguro de eliminar esta unidad?");
	if(r){
		var dataParam = { 
				matrixId : mdfIdMovil 
			};

			callAjaxPost(URL + '/mdf/delete', dataParam, procesarGuardarMatrizMovil);
	}
}


