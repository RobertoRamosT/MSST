var cambioResiduoId,cambioResiduoObj,cambioResiduoNombre;
var banderaEdicion1=false;
var listFullCambioResiduos;
var listClasifcacionCambio;
var listClientesImport;
$(function(){
	$("#btnNuevoCambioResiduo").attr("onclick", "javascript:nuevoCambioResiduo();");
	$("#btnCancelarCambioResiduo").attr("onclick", "javascript:cancelarNuevoCambioResiduo();");
	$("#btnGuardarCambioResiduo").attr("onclick", "javascript:guardarCambioResiduo();");
	$("#btnEliminarCambioResiduo").attr("onclick", "javascript:eliminarCambioResiduo();");
	$("#btnImportCambioModal").attr("onclick", "javascript:verImportCambios();");
	$("#btnExcelCambio").attr("onclick", "javascript:verExportCambios();");
	$("#btnGenerarExcelCambio").attr("onclick", "javascript:generarExportCambios();");
	$("#btnExcelCambio").hide();
	var hoy=obtenerFechaActual();
	$("#fechaInicioEvento").val(sumaFechaDias(-8,hoy));
	$("#fechaFinEvento").val(hoy);
	$("#fechaInicioReporte").val(sumaFechaDias(-8,hoy));
	$("#fechaFinReporte").val(hoy);
})
/**
 * 
 */
function volverCambioResiduos(){
	$("#tabCambios .container-fluid").hide();
	$("#divContainCambioResiduo").show();
	$("#tabCambios").find("h2").html("Generación y Segregación de residuos");
}
function cargarCambioResiduos() {
	$("#btnCancelarCambioResiduo").hide();
	$("#btnNuevoCambioResiduo").show();
	$("#btnEliminarCambioResiduo").hide();
	$("#btnGuardarCambioResiduo").hide();
	volverCambioResiduos();
	callAjaxPost(URL + '/residuo/cambios', 
			{empresaId : getSession("gestopcompanyid"),
		fechaInicioPresentacion:$("#fechaInicioEvento").val(),
		fechaFinPresentacion:$("#fechaFinEvento").val() }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion1=false;
				 listFullCambioResiduos=data.list;
				 listClasifcacionCambio=data.clasificacion;
				 listClientesImport=data.clasificacion_detalle;
					$("#tblCambios tbody tr").remove();
					listFullCambioResiduos.forEach(function(val,index){
						
						$("#tblCambios tbody").append(
								"<tr id='trcam"+val.id+"' onclick='editarCambioResiduo("+index+")'>" 
								+"<td id='camfecha"+val.id+"'>"+val.fechaTexto+"</td>" 
								+"<td id='camhora"+val.id+"'>"+val.horaTexto+"</td>"
								+"<td id='camclas"+val.id+"'>"+val.clasificacion.nombre+"</td>"
								+"<td id='camind"+val.id+"'>"+val.indicadorResiduos+"</td>" 
								+"<td id='camresp"+val.id+"'>"+val.responsable.nombre+"</td>"
								+"<td id='camevi"+val.id+"'>"+val.evidenciaNombre+"</td>"
								+"</tr>");
					});
					completarBarraCarga();
					formatoCeldaSombreableTabla(true,"tblCambios");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarCambioResiduo(pindex) {


	if (!banderaEdicion1) {
		formatoCeldaSombreableTabla(false,"tblCambios");
		cambioResiduoId = listFullCambioResiduos[pindex].id;
		cambioResiduoObj=listFullCambioResiduos[pindex];
		cambioResiduoObj.empresa={empresaId : getSession("gestopcompanyid") };
		var fecha=convertirFechaInput(cambioResiduoObj.fecha);
		$("#camfecha" + cambioResiduoId).html(
		 "<input type='date' id='inputFechaCambioResiduo' class='form-control'>");
		$("#inputFechaCambioResiduo").val(fecha);
		//
		var hora=cambioResiduoObj.hora;
		$("#camhora" + cambioResiduoId).html(
		 "<input type='time' id='inputHoraCambioResiduo' class='form-control'>");
		$("#inputHoraCambioResiduo").val(hora);
		//
		var clas=cambioResiduoObj.clasificacion.id;
		var slcClasificacionCambioResiduo=crearSelectOneMenuOblig("slcClasificacionCambioResiduo", "",
				listClasifcacionCambio, clas, "id", "nombre");
		$("#camclas" + cambioResiduoId).html(slcClasificacionCambioResiduo );
		//
		var textInfo=$("#camind"+cambioResiduoId).text();
		$("#camind"+cambioResiduoId).addClass("linkGosst")
		.on("click",function(){verDetallesCambioResiduo();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo);
		//
		var responsable=cambioResiduoObj.responsable.nombre;
		$("#camresp" + cambioResiduoId).html(
		 "<input   id='inputRespCambioResiduo' class='form-control'>");
		$("#inputRespCambioResiduo").val(responsable);
		//
		var options=
		{container:"#camevi"+cambioResiduoId,
				functionCall:function(){guardarCambioResiduo()},
				descargaUrl: "/residuo/cambio/evidencia?id="+ cambioResiduoId,
				esNuevo:false,
				idAux:"CambioResiduo"+cambioResiduoId,
				evidenciaNombre:cambioResiduoObj.evidenciaNombre};
		crearFormEvidenciaCompleta(options);
		//
		banderaEdicion1 = true;
		$("#btnCancelarCambioResiduo").show();
		$("#btnNuevoCambioResiduo").hide();
		$("#btnEliminarCambioResiduo").show();
		$("#btnGuardarCambioResiduo").show();
		$("#btnGenReporte").hide();
		
		
		
		
	}
	
}
function nuevoCambioResiduo() {
	if (!banderaEdicion1) {
		cambioResiduoId = 0;
		var slcClasificacionCambioResiduo=crearSelectOneMenuOblig("slcClasificacionCambioResiduo", "",
				listClasifcacionCambio, "", "id", "nombre");
		$("#tblCambios tbody")
				.prepend(
						"<tr  >"
						
						+"<td>"+"<input type='date' id='inputFechaCambioResiduo' class='form-control'>"+"</td>"
						+"<td>"+"<input type='time' id='inputHoraCambioResiduo' class='form-control'>"+"</td>"
						+"<td>"+slcClasificacionCambioResiduo+"</td>"
						+"<td>"+"..."+"</td>"
						+"<td>"+ "<input   id='inputRespCambioResiduo' class='form-control'>"+"</td>" 
						+"<td id='camevi0'>0</td>"
						 
								+ "</tr>");
		//
		$("#inputFechaCambioResiduo").val(obtenerFechaActual());
		$("#inputHoraCambioResiduo").val("12:00:00")
		//
		var options=
		{container:"#camevi"+cambioResiduoId,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"CambioResiduo"+cambioResiduoId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
		$("#btnCancelarCambioResiduo").show();
		$("#btnNuevoCambioResiduo").hide();
		$("#btnEliminarCambioResiduo").hide();
		$("#btnGuardarCambioResiduo").show();
		$("#btnGenReporte").hide();
		banderaEdicion1 = true;
		formatoCeldaSombreableTabla(false,"tblCambios");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarCambioResiduo() {
	cargarCambioResiduos();
}

function eliminarCambioResiduo() {
	var r = confirm("¿Está seguro de eliminar la Generación de residuo?");
	if (r == true) {
		var dataParam = {
				id : cambioResiduoId,
		};
		callAjaxPost(URL + '/residuo/cambio/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarCambioResiduos();
						break;
					default:
						alert("No se puede eliminar, hay residuos asociados.");
					}
				});
	}
}

function guardarCambioResiduo() {

	var campoVacio = true;
	var fecha=$("#inputFechaCambioResiduo").val();  
	var hora=$("#inputHoraCambioResiduo").val();
 var clas=$("#slcClasificacionCambioResiduo").val();
var responsable=$("#inputRespCambioResiduo").val();

		if (campoVacio) {

			var dataParam = {
				id : cambioResiduoId,
				fecha:convertirFechaTexto(fecha),
				hora:hora,
				clasificacion:{id:clas},
				responsable:{nombre:responsable},
				empresa :{empresaId :getSession("gestopcompanyid")}
			};

			callAjaxPost(URL + '/residuo/cambio/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							guardarEvidenciaAuto(data.nuevoId,"fileEviCambioResiduo"+cambioResiduoId
									,bitsEvidenciaAccionMejora,"/residuo/cambio/evidencia/save",
									cargarCambioResiduos); 
							 
							break;
						default:
							console.log("Ocurrió un error al guardar el cambioResiduo!");
						}
					},null,null,null,null,false);
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}
function cancelarNuevoCambioResiduo(){
	cargarCambioResiduos();
}
function verImportCambios(){
	$("#tabCambios .container-fluid").hide();
	$("#tabCambios #divImportCambios").show();
	$("#tabCambios").find("h2")
	.html("<a onclick=' volverCambioResiduos()'>Generación y Segregación </a>"
			+"> Importación");
	$("#btnGuardarImportCambio").attr("onclick","guardarImportCambios()")
}
function guardarImportCambios(){
	var texto = $("#divImportCambios textarea").val();
	var listExcelInicial = texto.split('\n');
	var listCambios = [];
	var listCambiosRep = [];
	var listFullNombres = "";
	var validado = "";
var listExcel=[];
listExcelInicial.forEach(function(val){
	if(val.length>0){
		listExcel.push(val);
	}
});
	if (texto.length < 100000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];

			if (validado.length < 1 && listCells.length != 11) {
				validado = "No coincide el numero de celdas."
						+ listCells.length+" != 11" ;
				break;
			} else {
				var cambio = {residuos:[], id:0};
				var genero = {};var cliente={};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					switch(j){
					case 0:
						try {
							var fechaTexto = element.trim();
							var parts = fechaTexto.split('/');
							var dateNac = new Date(parts[2], parts[1] - 1,
									parts[0]);
							cambio.fecha= dateNac;
						} catch (err) {
							validado = "Error en el formato de fecha .";
							break;
						}
						break;
					case 1:
						cambio.hora = element.trim();
						break;
					case 2:
						var reconocido=false;
						listClasifcacionCambio.forEach(function(val){
							if (val.nombre == element.trim()) {
								cambio.clasificacion = {
									id : val.id
								};
								reconocido=true;
							}
						});
						if(!reconocido){
							validado="Clasificacion no reconocido";
							break
						}
						break;
					case 3:
						cambio.responsable ={nombre: element.trim() };
						break;
					case 4:
						var reconocido=false;
						listClientesImport.forEach(function(val){
							if (val.nombre == element.trim()) {
								cliente = {
									id : val.id
								};
								reconocido=true;
							}
						});
						if(!reconocido){
							validado="Área no reconocido";
							break;
						}
						break;
					default:
						var objResiduo={
							clasificacion:cliente,
							tipo:{id:j-4},
							cantidad:element.trim()
							};
						cambio.residuos.push(objResiduo);
						
						break;
					}
					
					 

					
					cambio.empresa = {empresaId :getSession("gestopcompanyid")};
				}

				listCambios.push(cambio);
				listCambiosRep.push(cambio);
				
				if (listCambiosRep.length < listCambios.length) {
					validado = "Existen dnis repetidos." + listFullNombres;
					break;
				}
			}
		}
	} else {
		validado = "Ha excedido los 100000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			var dataParam = {
				listCambios : listCambios
			};
			console.log(listCambios);
			callAjaxPost(URL + '/residuo/cambio/masivo/save', listCambios,
					funcionResultadoCambioMasivo);
		}
	} else {
		alert(validado);
	}
}

function funcionResultadoCambioMasivo(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		if (data.MENSAJE.length > 0) {
			alert(data.MENSAJE);
		} else {$("#divImportCambios textarea").val("");
			alert("Se guardaron exitosamente.");
			cargarCambioResiduos();
		}
		break;
	default:
		alert("Ocurrió un error al guardar el trabajador!");
	}
}
function verExportCambios(){
	$("#tabCambios .container-fluid").hide();
	$("#tabCambios #divExportCambios").show();
	$("#tabCambios").find("h2")
	.html("<a onclick=' volverCambioResiduos()'>Generación y Segregación </a>"
			+"> Exportación");
	
	var selClas=crearSelectOneMenuOblig("selClasExcel", "", listClasifcacionCambio, "", "id",
			"nombre");
	$("#divClasificacionExcel").html(selClas)
	crearSelectOneMenuObligMultipleCompleto("selClientesExcel", "", listClientesImport, "id",
			"nombre","#divClientesExcel","Seleccionar..")
	
}


