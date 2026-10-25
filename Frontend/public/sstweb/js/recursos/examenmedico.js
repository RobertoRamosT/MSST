var banderaEdicion;
var examenMedicoId;
var examenMedicoTipo;
var listExMedTipo;
var listFullExamMedico = [];
var contador2 = 0;

$(document).ready(function() {

	insertMenu();
	cargarPrimerEstado();
	resizeDivGosst("wrapperEval");
	$(document).on("click","#btnClipTabla",function(){
		 

		copiarAlPortapapeles( obtenerDatosTablaEstandar("tblExMed"));
		
		alert("Se han guardado al clipboard  la tabla de este módulo" );

	});
});

function cargarPrimerEstado() {
	banderaEdicion = false;
	examenMedicoId = 0;
	examenMedicoTipo = 0;
	volverExamenesGeneral();
	
	removerBotones();
	crearBotones();
	
	$("#fsBotones")
	.append(
			"<button id='btnProgFecha' type='button' class='btn btn-success' title='Programar Fecha'>"
					+ "<i class='fa fa-calendar fa-2x'></i>"
					+ "</button>");
	$("#fsBotones")
	.append(
			"<button id='btnClipTabla' type='button' class='btn btn-success' title='Tabla Clipboard' >"
					+ "<i class='fa fa-clipboard fa-2x'></i>" + "</button>");
	if(getSession("accesoUsuarios")==3){
		$("#fsBotones")
		.append(
				"<button id='btnVigMedica' type='button' class='btn btn-success' title='Vigilancia Médica'>"
						+ "<i class='fa fa-user-md fa-2x'></i>"
						+ "</button>");
		$("#btnVigMedica").attr("onclick", "javascript:iniciarVigilanciaMedica();");
		$("#fsBotones")
		.append(
				"<button id='btnResultVigMedica' type='button' class='btn btn-success' title='Resultados Vigilancia Médica'>"
						+ "<i class='fa fa-indent fa-2x'></i>"
						+ "</button>");
		$("#btnResultVigMedica").attr("onclick", "javascript:verResultadosVigilanciaMedica();");
	}else{
		
	}
	deshabilitarBotonesEdicion();
	$("#btnProgFecha").show();
	$("#btnUpload").attr("onclick", "javascript:importarDatos();");

	$("#btnNuevo").attr("onclick", "javascript:nuevoExamenMedico();");
	$("#btnCancelar").attr("onclick", "javascript:cancelarExamenMedico();");
	$("#btnGuardar").attr("onclick", "javascript:guardarExamenMedico();");
	$("#btnEliminar").attr("onclick", "javascript:eliminarExamenMedico();");
	$("#btnProgFecha").attr("onclick", "javascript:programarFecha();");
	$("#btnImportar").attr("onclick", "javascript:importarDatos();");
	
	var dataParam = {
			idCompany : getSession("gestopcompanyid")
	};

	callAjaxPost(URL + '/examenmedico', dataParam,
			procesarDataDescargadaPrimerEstado);
}
function verAcordeTipoExam(idTipoExamen,nombreRutinaExamen,editable){
	var respuesta="------";
	
	if(!editable){
		
		
		if(idTipoExamen==2){
			respuesta=nombreRutinaExamen;
			return respuesta;
		}else{
			return respuesta;
		}
		
	}

	
	
}
function verAcordeTipoExam2(){
	var tipoExam=$("#selExMedTipo").val();
	if(tipoExam==2){
		$("#selFrecTipo").prop('disabled', false);
	}else{

		$('#selFrecTipo > option[value="6"]').attr('selected', 'selected');
		$("#selFrecTipo").prop('disabled', true);
	}
}
function procesarDataDescargadaPrimerEstado(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		listFullExamMedico = data.list;

		listExMedTipo = data.listExMedTipo;

		$("#h2Titulo")
				.html(
						"<a onclick='javascript:cargarPrimerEstado();' href='#'>Examenes Medicos</a>");
		$("#tblExMed tbody tr").remove();
		listFullExamMedico.forEach(function(val,index){
			$("#tblExMed tbody").append(

					"<tr id='tr" + val.examenMedicoId
							+ "' onclick='javascript:editarExMed("
							+ index
							+")' >"

							+ "<td id='tdnom" + val.examenMedicoId
							+ "'>" + val.examenMedicoNombre + "</td>"
							+ "<td id='tdtipo" + val.examenMedicoId
							+ "'>" + val.examenMedicoTipoNombre
							+ "</td>" 
							+ "<td id='tdprecio"
							+ val.examenMedicoId + "'>"
							+ val.examenCostoPersona + "</td>"
							
							+ "<td id='tdcon"
							+ val.examenMedicoId + "'>"
							+ val.examenMedicoConsideracion + "</td>"
							+ "<td id='tdasig" + val.examenMedicoId
							+ "'>" + val.numPuestosAsociados + "</td>"
							+ "</tr>");
		});
		 
		formatoCeldaSombreable(true);completarBarraCarga();
		$("#tblExMed").addClass("fixed");
		break;
	default:
		alert("Ocurrió un error al traer los Examenes Medicos!");
	}
	if (contador2 == 0) {
		goheadfixed('table.fixed');
	}
	contador2 = contador2 + 1;
}

function editarExMed(pindex) {
	if (!banderaEdicion) {
		var examMedicoObj =listFullExamMedico[pindex];
		examenMedicoId = listFullExamMedico[pindex].examenMedicoId;
		examenMedicoTipo = listFullExamMedico[pindex].examenMedicoTipoId;
		
		$("#tr"+examenMedicoId).addClass("fila-edicion");
		
		$("#tdasig"+examenMedicoId).html("<a onclick='verPuestosRecurso("+2+","+pindex+")' class='efectoLink'>" +
				"<i class='fa fa-list'></i>"+examMedicoObj.numPuestosAsociados +
				"</a>");
		formatoCeldaSombreable(false);
		var name = $("#tdnom" + examenMedicoId).text();
		$("#tdnom" + examenMedicoId)
				.html(
						"<input type='text' id='inputExMed' class='form-control' placeholder='Examen Medico' autofocus='true' value='"
								+ name + "'>");
		var name1 = $("#tdcon" + examenMedicoId).text();
		$("#tdcon" + examenMedicoId)
				.html(
						"<input type='text' id='inputCon' class='form-control' placeholder='Consideracion' autofocus='true' value='"
								+ name1 + "'>");
		/** ************************************************************************* */
		var selExMedTipo = crearSelectOneMenu("selExMedTipo", "verAcordeTipoExam2()",
				listExMedTipo, examenMedicoTipo, "exMedTipoId",
				"exMedTipoNombre");
		$("#tdtipo" + examenMedicoId).html(selExMedTipo);
	
		var name2 = $("#tdprecio" + examenMedicoId).text();
		$("#tdprecio" + examenMedicoId)
				.html(
						"<input type='number' id='inputPrecio' class='form-control'  value='"
								+ name2 + "'>");
		verAcordeTipoExam2();
		banderaEdicion = true;
		habilitarBotonesEdicion();
	}
}

function nuevoExamenMedico() {
	if (!banderaEdicion) {
		examenMedicoId = 0;
		var selectExMedTipo = crearSelectOneMenu("selExMedTipo", "verAcordeTipoExam2()",
				listExMedTipo, "-1", "exMedTipoId", "exMedTipoNombre");
		

		$("#tblExMed tbody:first")
				.append(
						"<tr id='tr0'><td><input type='text' id='inputExMed' class='form-control' placeholder='Examen Medico' autofocus='true'></td>"
								+ "<td>"
								+ selectExMedTipo
								+ "</td>"
								+"<td><input type='number' id='inputPrecio' class='form-control'  ></td>"
								+ "<td><input type='text' id='inputCon' class='form-control' placeholder='Consideraciones'></td>"
								+"<td>...</td>"
								+ "</tr>");
		
		llevarTablaFondo("wrapper");
		
		habilitarBotonesNuevo();
		banderaEdicion = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarExamenMedico() {
	cargarPrimerEstado();
}

function eliminarExamenMedico() {
	var r = confirm("¿Está seguro de eliminar el Examen Medico?");
	if (r == true) {
		var dataParam = {
				examenMedicoId : examenMedicoId,
		};

		callAjaxPost(URL + '/examenmedico/delete', dataParam,
				procesarResultadoEliminarExMed);
	}
}

function procesarResultadoEliminarExMed(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarPrimerEstado();
		break;
	default:
		alert("Verificar que la evaluación médica no esté asignado a puestos de trabajo");
	}
}

function guardarExamenMedico() {

	var campoVacio = true;
	var exmedTipo = $("#selExMedTipo option:selected").val();
	var precioUnitario=$("#inputPrecio").val();
	var exmedNom = $("#inputExMed").val();
	var exmedCon = $("#inputCon").val();

	if (exmedTipo == '-1' ||  exmedNom.length == 0
			) {
		campoVacio = false;
	}

	if (campoVacio) {

		var dataParam = {
				examenMedicoId : examenMedicoId,
			
			examenMedicoNombre : exmedNom,
			examenMedicoConsideracion : exmedCon,
			examenMedicoTipoId: exmedTipo,
			examenCostoPersona:precioUnitario,
			idCompany : sessionStorage.getItem("gestopcompanyid")
		};
		var dataParamBefore="tr"+examenMedicoId;
		callAjaxPost(URL + '/examenmedico/save', dataParam,
				procesarResultadoGuardarExMed,loadingCelda,dataParamBefore);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarResultadoGuardarExMed(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarPrimerEstado();
		break;
	default:
		alert("Ocurrió un error al guardar el examen medico!");
	}
}
function importarDatos() {
	$("#btnGuardarNuevos").attr("onclick",
			"javascript:guardarMasivoCopiaExcel();");

	$('#mdImpDatos').modal('show');

}
function guardarMasivoCopiaExcel() {
	var texto = $("#txtListado").val();
	var listExcel = texto.split('\n');
	var listRecurso = [];
	var listExamRepe = [];
	var listFullNombres = "";
	var validado = "";
	if (texto.length < 10000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];
			if (filaTexto.trim().length < 1) {
				validado = "Existen filas vacias.";
				break;
			}

			if (validado.length < 1 && listCells.length != 3) {
				validado = "No coincide el numero de celdas. ("
						+ listCells.length+"!=3 )";
				break;
			} else {
				var recurs = {};
				var tipo = {};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						recurs.examenMedicoNombre = element.trim();
						if ($.inArray(recurs.examenMedicoNombre, listExamRepe) === -1) {
							listExamRepe.push(recurs.examenMedicoNombre);
						} else {
							listFullNombres = listFullNombres + recurs.examenMedicoNombre + ", ";
						}

					}
					
					
					if (j === 1) {
						for (var k = 0; k < listExMedTipo.length; k++) {
							if (listExMedTipo[k].exMedTipoNombre == element.trim()) {
								recurs.examenMedicoTipoId = listExMedTipo[k].exMedTipoId;
							}
						}

						if (!recurs.examenMedicoTipoId) {
							validado = "Tipo de Examen no reconocido.";
							break;
						}
					}
					
					if (j === 2) {
						recurs.examenCostoPersona = element.trim();
						if(isNaN(parseFloat(recurs.examenCostoPersona ))){
							validado="Costos ingresados no reconocidos"
						}
					}
					recurs.idCompany = sessionStorage.getItem("gestopcompanyid");
				
				}

				listRecurso.push(recurs);
				if (listExamRepe.length < listRecurso.length) {
					validado = "Existen examenes repetidos." + listFullNombres;
					break;
				}
			}
		}
	} else {
		validado = "Ha excedido los 10000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			var dataParam = {
				listRecurso : listRecurso
			};
			console.log(listRecurso);
			callAjaxPost(URL + '/examenmedico/masivo/save', dataParam,
					function (data) {
				switch (data.CODE_RESPONSE) {
				case "05":
					
						alert("Se guardaron exitosamente.");
						cargarPrimerEstado();
						$('#mdImpDatos').modal('hide');
					
					break;
				default:
					alert("Ocurri&oacute; un error al guardar los exams!");
				}
			});
		}
	} else {
		alert(validado);
	}
}
