/**
 * 
 */


var comboSugeridoId;
var banderaEdicionCombo;
var listFullSugeridos;
var nombreCombo;
function llamarSugeridosEmpresa(){
	comboSugeridoId=0;
	banderaEdicionCombo=false;
	listFullSugeridos=[];
	$("#btnAgregarSugerido").show().attr("onclick","nuevoSugerido()");
	$("#btnCancelarSugerido").hide().attr("onclick","llamarSugeridosEmpresa()");
	$("#btnEliminarSugerido").hide().attr("onclick","eliminarSugerido()");
	$("#btnGuardarSugerido").hide().attr("onclick","guardarSugerido()");
	$("#btnImportDetalle").hide().attr("onclick","iniciarImportDetalle()");
	$("#btnSubDetalle").hide().attr("onclick","verSubDetallesSugerido()");
	var dataParam={companyId : sessionStorage.getItem("gestopcompanyid")}
	callAjaxPost(URL + '/iperc/detalle/sugeridos', dataParam, function(data) {
		
		listFullSugeridos=data.combosSugeridos;
		combosSugeridos=listFullSugeridos;
		$("#tblSugeridoDetalle tbody" ).html("");
		listFullSugeridos.forEach(function(val,index){
			if(val.empresaId!=null){
				$("#tblSugeridoDetalle tbody").append("" +
						"<tr onclick='editarSugerido("+index+")'>" +
						"<td id='nomSug"+val.id+"'>"+val.nombre+"</td>" +
						"<td id='detaSug"+val.id+"'>"+val.detalles.length+"</td>" +
						"</tr>")
			}
		});
	
		formatoCeldaSombreableTabla(true,"tblSugeridoDetalle");
	
});
	
}
function verSubDetallesSugerido(){
	$(".modal-body").hide();
	$("#bodySubSugerido").show();
	$(".modal-title")
	.html("<a onclick='volverAsignaciones()'>Combos Sugeridos</a> > " +
			"<a onclick='volverComboSugerido()'>Combo "+nombreCombo+"</a> >" +
			"Detalles ");
	llamarSubSugeridoIperc();
}
function volverComboSugerido(){
	$(".modal-body").hide();
	$("#bodyGestion").show();
	$(".modal-title").html("<a onclick='volverAsignaciones()'>Combos Sugeridos</a> > Gestión de Combos ");
	 
}
function editarSugerido(pindex){
	if(!banderaEdicionCombo){
		banderaEdicionCombo=true;
		$("#btnAgregarSugerido").hide();
		$("#btnCancelarSugerido").show();
		$("#btnEliminarSugerido").show();
		$("#btnSubDetalle").show();
		$("#btnGuardarSugerido").show();$("#btnImportDetalle").show()
		formatoCeldaSombreableTabla(false,"tblSugeridoDetalle");
		comboSugeridoId=listFullSugeridos[pindex].id;
		var nombre=listFullSugeridos[pindex].nombre;
		nombreCombo=nombre;
		$("#nomSug"+comboSugeridoId).html("<input class='form-control' id='inputSugNom'>");
		$("#inputSugNom").val(nombre);
	}
}
function nuevoSugerido(){
	$("#btnAgregarSugerido").hide();
	$("#btnCancelarSugerido").show();
	$("#btnEliminarSugerido").hide();
	$("#btnGuardarSugerido").show();
	banderaEdicionCombo=true;
	
	comboSugeridoId = 0;
	$("#tblSugeridoDetalle tbody")
			.append(
					"<tr id='tr0'>"
					+"<td><input class='form-control' id='inputSugNom'></td>"
					+"<td>...</td>"
							+ "</tr>");
	formatoCeldaSombreableTabla(false,"tblSugeridoDetalle");
}

function eliminarSugerido(){
	var comboObj={
			id:comboSugeridoId
	}
	var r=confirm("¿Está seguro de eliminar este combo?");
	if(r){
		callAjaxPost(URL + '/iperc/detalle/sugerido/delete', comboObj,
				function(data) {
					
					
			llamarSugeridosEmpresa();
					
				});
	}
	
}

function guardarSugerido(){
	var nombre=$("#inputSugNom").val();
	var campoVacio=false;
	if(nombre.length==0){
		campoVacio=true;
	}
	
	if(campoVacio){
		alert("Complete el campo")
	}else{
		var comboObj={
				id:comboSugeridoId,
				nombre:nombre,
				empresaId: sessionStorage.getItem("gestopcompanyid")
		}
		
		callAjaxPost(URL + '/iperc/detalle/sugerido/save', comboObj,
				function(data) {
					
					
			llamarSugeridosEmpresa();
					
				});
	}
	
}

function iniciarImportDetalle(){
	$(".modal-body").hide();
	$("#bodyImport").show();
	$("#btnGuardarImport").attr("onclick","guardarImportDetalleSugerido()")
}

function guardarImportDetalleSugerido(){
	var texto = $("#txtListado").val();
	var listExcelInicial = texto.split('\n');
	var detallesImport = [];
	var validado = "";
	var listaClasi = JSON.parse(sessionStorage.getItem("clasifs"));
	var listExcel=[];
	listExcelInicial.forEach(function(val){
		if(val.length>0){
			listExcel.push(val);
		}
	});
	if (texto.length < 50000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];
			if (filaTexto.trim().length < 1) {
				validado = "Existen filas vacias.";
				break;
			}
			 console.log(listCells);
			if (validado.length < 1 && listCells.length != 9) {
				validado = "No coincide el numero de celdas."
						+ listCells.length+" "+listCells;
				break;
			} else {
				var detail = {};
				var clasif = {};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						detail.descripcionLugar = element.trim();

					}
					if (j === 1) {
						for (var k = 0; k < listaClasi.length; k++) {
							if (listaClasi[k].clasificacionNombre == element.trim()) {
								detail.idClasificacion = listaClasi[k].clasificacionId ;
							}
						}

						if (!detail.idClasificacion) {
							validado = "Clasificación no reconocido.";
							break;
						}
					}
					if (j ===2){
						detail.peligroName = element.trim();
					}
						
					

					if (j === 3) {
						detail.descripcionPeligro = element.trim();
					}
					if (j === 4) {
						detail.riesgoName = element.trim();
					}
					if (j === 5) {
						detail.consecuencia1 = element.trim();
					}
					if (j === 6) {
						detail.controlInicial1 = element.trim();
					}
					if (j === 7) {
						detail.controlInicial2 = element.trim();
					}
					
					if (j === 8) {
						detail.controlInicial3 = element.trim();
					}
					detail.combo={id:comboSugeridoId}
					
				}

				detallesImport.push(detail);
			
			}
		}
	} else {
		validado = "Ha excedido los 50000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			var dataParam = {
				detalles : detallesImport,
				id:comboSugeridoId
			};
			console.log(detallesImport);
			callAjaxPost(URL + '/iperc/detalle/sugerido/import', dataParam,function(){
				$(".modal-body").hide();
				$("#bodyAsignar").show();
				llamarSugeridosEmpresa();
			});
		}
	} else {
		alert(validado);
	}
}















