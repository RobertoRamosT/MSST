var tallaId;
var banderaEdicion8;
var listTrabajadoresTalla;
var listTrabajadoresSeleccionadosTalla;
var listFullTalla;

function verTallasEpp(){
	cargarTallasEPP();
	$("#mdTalla").modal({
		  keyboard: true,
		  show:true,"backdrop":"static"
		});
}
function cargarTallasEPP() {
	
	$("#btnAgregarTalla").attr("onclick", "javascript:nuevaTalla();");
	$("#btnCancelarTalla").attr("onclick", "javascript:cancelarTalla();");
	$("#btnGuardarTalla").attr("onclick", "javascript:guardarTalla();");
	$("#btnEliminarTalla").attr("onclick", "javascript:eliminarTalla();");
	
	$("#btnCancelarTalla").hide();
	$("#btnAgregarTalla").show();
	$("#btnEliminarTalla").hide();
	$("#btnGuardarTalla").hide();

	$("#modalBodyTalla").show();
	$("#modalTreeTalla").hide();

	tallaId = 0;
	listTrabajadoresSeleccionadosTalla = null;
	
	banderaEdicion8 = false;
	listFullTalla=[];
	var dataParam = {
			eppId : equipoSeguridadId
	};

	callAjaxPost(URL + '/equiposeguridad/talla', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			listFullTalla= data.list;
			formatoCeldaSombreableTabla(true,"tblTalla");
			$("#tblTalla tbody tr").remove();	console.log(listFullTalla);
			listFullTalla.forEach(function(val,index){
				
				
				$("#tblTalla tbody").append("<tr id='idTalla"+val.id+"' " +
						"onclick='editarTalla("+index+")'> " +
						"<td id='tdcodtal"+val.id+"'>"+val.codigo+"</td>" +
						"<td id='tdtalla"+val.id+"'>"+val.nombre+"</td>" +
						"<td id='tdttalla"+val.id+"'>"+val.numTrabsTalla+"</td>" +

						"</tr>");
			});
			break;
		default:
			alert("Ocurrió un error al traer las tallas!");
		}
	});
}

function editarTalla(pindex) {

	if (!banderaEdicion8) {
		listTrabajadoresTalla = [];
		listTrabajadoresSeleccionadosTalla = [];
		tallaId = listFullTalla[pindex].id;
		var nombre = listFullTalla[pindex].nombre;
		var numTrabs=listFullTalla[pindex].numTrabsTalla;
		var codigo=listFullTalla[pindex].codigo;
		var dataParam = {
					id : tallaId,
			};
	
		formatoCeldaSombreableTabla(false,"tblTalla");
		$("#tdcodtal"+tallaId).html(
				"<input type='text' id='inputCodigoTalla' class='form-control'  >");
		$("#inputCodigoTalla").val(codigo);
		
		$("#tdtalla"+tallaId).html(
				"<input type='text' id='inputNombreTalla' class='form-control' value='"+nombre+"'>");
		$("#tdttalla" + tallaId)
				.html(
						"<a id='linkTrabEntr' href='#' onclick='javascript:cargarTrabajadoresTalla();'>"+numTrabs+"Trabajadores </a>");
		
	
	
		banderaEdicion8 = true;
		
		
		cargarTrabajadoresTalla();
		$("#modalBodyTalla").show();
		$("#modalTreeTalla").hide();
		$("#modalListEpp").hide();
	}
}

function cargarTrabajadoresTalla() {
	$("#modalBodyTalla").hide();
	$("#modalTreeTalla").show();
	$("#listTrabTallaBuscar").hide();
	if (listTrabajadoresSeleccionadosTalla.length === 0) {
		var fechaPlanAux=$("#inputFecPlan").val();
		var fechaEntregaAux=$("#inputFecEntrega").val();

		var dataParam = {
			id : tallaId,
			eppId:equipoSeguridadId,
			idCompany : sessionStorage.getItem("gestopcompanyid")
		};

		callAjaxPost(
				URL + '/equiposeguridad/talla/trabajadores',
				dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						$('#jstreeTalla').jstree("destroy");

						listTrabajadoresTalla = data.list;
						$('#jstreeTalla').jstree({
							"plugins" : [ "checkbox", "json_data","search" ],
							'checkbox' : {
								"keep_selected_style" : false,
								"tie_selection" : false
							},
							'core' : {
								'data' : listTrabajadoresTalla
							}
						});
						//Inicio Para Buscador en jstree
						  var to = false;
						  $('#buscarTrabTallaJstree').keyup(function () {
						    if(to) { clearTimeout(to); }
						    to = setTimeout(function () {
						      var v = $('#buscarTrabTallaJstree').val();
						  $("#jstreeTalla").jstree(true).search(v);
						    
						    }, 250);
						  });
						  $.jstree.defaults.search.show_only_matches=true;
						 
						  $('#listTrabTallaBuscar').keyup(function () {
							    if(to) { clearTimeout(to); }
							    to = setTimeout(function () {
							
							    	busquedaMasivaJstree(listTrabajadoresTalla,"jstreeTalla","resultSearchTrabTalla","listTrabBuscarTalla")
							    }, 250);
							  });
						//Fin Para Buscador en jstree

						for (index = 0; index < listTrabajadoresTalla.length; index++) {
							if (listTrabajadoresTalla[index].state.checked
									&& listTrabajadoresTalla[index].id.substr(
											0, 3) == "tra") {
								listTrabajadoresSeleccionadosTalla
										.push({
											trabajadorId:listTrabajadoresTalla[index].id
											.substr(
													3,
													listTrabajadoresTalla[index].id.length),
													tallaId:tallaId
										});
							}
						}
						
						$("#btnCancelarTalla").show();
						$("#btnAgregarTalla").hide();
						$("#btnEliminarTalla").show();
						$("#btnGuardarTalla").show();
						console.log(listTrabajadoresSeleccionadosTalla);
						break;
					default:
						alert("Ocurrió un error al cargar el arbol de trabajadores de talla!");
					}
				});
	}

}

function nuevaTalla() {
	if (!banderaEdicion8) {
		$("#tblTalla")
				.append(
						"<tr id='0'>"
						+ "<td><input  id='inputCodigoTalla' class='form-control' placeholder='Código'> <small>No es obligatorio</small> </td> " 
						
						
						+ "<td><input  id='inputNombreTalla' class='form-control' placeholder='Nombre'></td>"
						
						+ "<td>....</td>"
						
								+ "</tr>");
		tallaId = 0;
		$("#btnCancelarTalla").show();
		$("#btnAgregarTalla").hide();
		$("#btnEliminarTalla").hide();
		$("#btnGuardarTalla").show();
		$("#btnGenReporte").hide();
		
		
		banderaEdicion8 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarTalla() {
	cargarTallasEPP();
}

function eliminarTalla() {
	var r = confirm("¿Está seguro de eliminar la talla?");
	if (r == true) {
		var dataParam = {
			id : tallaId,
		};

		callAjaxPost(URL + '/equiposeguridad/talla/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarTallasEPP();
						break;
					default:
						alert("Ocurrió un error al eliminar la talla!");
					}
				});
	}
}

function guardarTalla() {

	var campoVacio = true;
var nombreTalla=$("#inputNombreTalla").val();
var codigo=$("#inputCodigoTalla").val();

	if (campoVacio) {

		var dataParam = {
		id:tallaId,
		nombre:nombreTalla,
		codigo:codigo,
		trabajadores:listTrabajadoresSeleccionadosTalla,
		eppId:equipoSeguridadId
		};
console.log(dataParam);
		callAjaxPost(URL + '/equiposeguridad/talla/save', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarTallasEPP();
						break;
					default:
						alert("Ocurrió un error al guardar la talla!");
					}
				});
	} else {
		alert("Debe ingresar todos los campos.");
	}
}


function cancelarSeleccionarTrabsTalla(){
	$("#modalBodyTalla").show();
	$("#modalTreeTalla").hide();
	
	var seleccionados = $('#jstreeTalla').jstree(true).get_checked();
	listTrabajadoresSeleccionadosTalla = [];
	for (index = 0; index < seleccionados.length; index++) {
		var trab = seleccionados[index];
		if (seleccionados[index].substr(0, 3) == "tra") {
			var trabajadorId=seleccionados[index]
			.substr(3, seleccionados[index].length)
			listTrabajadoresSeleccionadosTalla.push({
				trabajadorId:trabajadorId,
				tallaId:tallaId
			});
		}
	}
}
