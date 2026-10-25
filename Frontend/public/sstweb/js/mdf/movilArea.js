/**
 * 
 */


var areaObjMovil;
var banderaEdicionAreaMovil;
var listFullArea;
function verDetalleAreas(){
	banderaEdicionAreaMovil=false;
	var container=$("#unidadesGosstMovil");
	container.html("<div class='loadingGosst'><img src='../imagenes/gif/ruedita.gif'></img>   Cargando</div>");
	 
	setTimeout(function(){
		var dataParam = {
				divisionId : divisionObjMovil.divisionId
		};
		
		callAjaxPost(URL + '/area', dataParam, procesarListarAreasMovil,function(){},function(){});
	},1400);

	
}
function procesarListarAreasMovil(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;
		listFullArea=list;
		var container=$("#unidadesGosstMovil");
		container.html("");
		container.append("<div class='ubicacionGosst'  onclick=''> "+
				"<i class='fa fa-university fa-2x' aria-hidden='true'></i>"+mdfNombreMovil+" > " +
				"<i class='fa fa-users fa-2x' aria-hidden='true'></i>"+divisionObjMovil.divisionName+"  " +
						"</div>");
		container.append("<div class='volverGosst' id='volverDivDivision' onclick='verDetalleDivisiones()'> "+
				"<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i> Volver"+" </div>");
		container.append("<div class='volverGosst' id='volverDivArea' onclick='verDetalleAreas()'> "+
				"<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i> Volver"+" </div>");
		container.append("<div class='cantidadGosst'  > "+list.length+" área(s)</div>");
		container.append("<div class=' agregarGosst' id='agregarDivArea' onclick='agregarAreaMovil()'> "+
				"<i class='fa fa-plus fa-2x' aria-hidden='true'></i> Agregar"+" </div>");
		container.append("<div class='despliegueGosst' id='puestosDivGosst' onclick='verDetallePuestos()'> "+
				"<i class='fa fa-user fa-2x' aria-hidden='true'></i> Puestos"+" </div>");
		container.append("<div class=' guardarGosst' id='guardarDivArea' onclick='guardarAreaMovil()'> "+
				"<i class='fa fa-save fa-2x' aria-hidden='true'></i> Guardar"+" </div>");
		container.append("<div class=' cantidadGosst' id='editarDivArea' onclick='editarAreaMovil()'> "+
				"<i class='fa fa-wrench fa-2x' aria-hidden='true'></i> Editar"+" </div>");
		container.append("<div class='eliminarGosst' id='eliminarDivArea' onclick='eliminarAreaMovil()'> "+
				"<i class='fa fa-times fa-2x' aria-hidden='true'></i> Eliminar"+" </div>");
		$("#volverDivDivision").show(); 
		$("#volverDivArea").hide();
		$("#guardarDivArea").hide();
		$("#editarDivArea").hide();
		$("#eliminarDivArea").hide();

		$("#puestosDivGosst").remove();
		listFullArea.forEach(function(val,index){
			container.append("<div class='col-ss-12 col-xs-6 col-md-6 areaGosst' id='areaDiv"+val.areaId+"'  " +
					"onclick='javascript:selecionarAreaMovil("+index+")'>" +
					"<i class='fa fa-2x fa-user' aria-hidden=true'></i>"+	val.areaName+ 
					"" +
					"</div>");
		});
		break;
	default:
		alert("Ocurrió un error al traer las areas!");
	}


}


function editarAreaMovil(){
	$("#guardarDivArea").show();
	$("#areaDivGosst").hide();
	$("#editarDivArea").hide();
	$("#eliminarDivArea").show();
	var container=$("#unidadesGosstMovil");
	$(".areaGosst").hide();
	container.append("<div class='col-ss-12 col-xs-6 col-md-6 areaGosst' >" +
			"<input class='form-control' id='areaNombreInput' placeholder='Nuevo Nombre' autofocus='true'>" + 
			"" +
			"	</div>"+
			"<div class='col-ss-12 col-xs-6 col-md-6 divisionGosst' >" + 
			"Antes: "+areaObjMovil.areaName+
			"" +
			"	</div>");
}

function selecionarAreaMovil(pindex){
	if(!banderaEdicionAreaMovil){
		banderaEdicionAreaMovil=true;
		areaObjMovil=listFullArea[pindex];
	var divisionIdMovil=listFullArea[pindex].areaId;
	var diviNombremdfNombreMovil=listFullArea[pindex].areaName;  
	$("#areaDiv"+divisionIdMovil).addClass("seleccionGosst");
	$("#agregarDivArea").hide();
	$(".cantidadGosst").hide();
	$("#volverDivDivision").hide();
	$("#volverDivArea").show();
	$("#puestosDivGosst").show();
	$("#editarDivArea").show();
	}
}


function agregarAreaMovil(){
	if(!banderaEdicionAreaMovil){ 
		areaObjMovil={areaId:0};
		banderaEdicionAreaMovil=true;
		var container=$("#unidadesGosstMovil");
		$("#volverDivDivision").hide();
		$("#agregarDivArea").hide();
		$("#volverDivArea").show();
		$("#guardarDivArea").show(); 
		$(".areaGosst").hide();
		container.append("<div class='col-ss-12 col-xs-6 col-md-6 areaGosst' >" +
				"<input class='form-control' id='areaNombreInput' placeholder='Nombre'>" + 
				"" +
				"	</div>" )
	}

}

function guardarAreaMovil(){
	var campoVacio = true;

	 

	if ($("#areaNombreInput").val().length == 0  ) {
		campoVacio = false;
	}

	 

	if (campoVacio) {

		var dataParam = {
		
			areaName : $("#areaNombreInput").val().toUpperCase(),
			areaId :areaObjMovil.areaId ,
			divisionId :  divisionObjMovil.divisionId 
		};

		callAjaxPost(URL + '/area/save', dataParam, procesarGuardarAreaMovil);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarAreaMovil(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		verDetalleAreas();
		break;
	case "08": 
		alert("No se puede eliminar, tiene "+data.puestoSons.length+ " puesto(s) asociado(s)."); 
		break;
	default:
		alert("Ocurrió un error al guardar la matriz!");
	}
}

function eliminarAreaMovil(){
	var r=confirm("¿Está seguro de eliminar esta área?");
	if(r){
		var dataParam = { 
				areaId :areaObjMovil.areaId 
			};

			callAjaxPost(URL + '/area/delete', dataParam, procesarGuardarAreaMovil);
	}
	
}