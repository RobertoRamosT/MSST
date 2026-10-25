 var declaracionId,declaracionObj;
var banderaEdicion7=false;
var listFullDeclaracions;
var listClasifcacionDeclaracion;
var listTipoDeclaracion;
$(function(){
	$("#btnNuevoDeclaracion").attr("onclick", "javascript:nuevoDeclaracion();");
	$("#btnCancelarDeclaracion").attr("onclick", "javascript:cancelarNuevoDeclaracion();");
	$("#btnGuardarDeclaracion").attr("onclick", "javascript:guardarDeclaracion();");
	$("#btnEliminarDeclaracion").attr("onclick", "javascript:eliminarDeclaracion();");
	$("#btnReporteDeclaracion").attr("onclick", "javascript:generarReporteDeclaracion();");
	 
})
/**
 * 
 */
function generarReporteDeclaracion(){
	window.open(URL
			+ "/residuo/declaracion/informe?id="
			+ declaracionId , '_blank');
}
function volverDeclaracions(){
	$("#tabDeclaraciones .container-fluid").hide();
	$("#divContainDeclaracion").show();
	$("#tabDeclaraciones").find("h2").html(" Declaraciones Anuales");
}
function cargarDeclaracions() {
	$("#btnCancelarDeclaracion").hide();
	$("#btnNuevoDeclaracion").show();
	$("#btnEliminarDeclaracion").hide();
	$("#btnGuardarDeclaracion").hide();
	$("#btnReporteDeclaracion").hide();
	volverDeclaracions();
	callAjaxPost(URL + '/residuo/declaraciones', 
			{empresaId : getSession("gestopcompanyid") }, function(data){
				if(data.CODE_RESPONSE=="05"){
					declaracionObj={tipo:{id:0}};
					banderaEdicion7=false;
				 listFullDeclaracions=data.list;
				 listClasifcacionDeclaracion=data.clasificacion;
				 listTipoDeclaracion=data.tipo;
						$("#tblDeclaraciones tbody tr").remove();
					listFullDeclaracions.forEach(function(val,index){
						
						$("#tblDeclaraciones tbody").append(
								"<tr id='trdecla"+val.id+"' onclick='editarDeclaracion("+index+")'>" 
								+"<td id='declafecha"+val.id+"'>"+val.fechaTexto+"</td>" 
								+"<td id='declaresp"+val.id+"'>"+val.responsable.nombre+"</td>"
								+"<td id='declaclas"+val.id+"'>"+val.clasificacion.nombre+"</td>"
								+"<td id='declatip"+val.id+"'>"+val.tipo.nombre+"</td>" 
								+"<td id='declafi"+val.id+"'>"+val.fechaInicioTexto+"</td>"
								+"<td id='declaff"+val.id+"'>"+val.fechaFinTexto+"</td>"
								+"<td id='declaevi"+val.id+"'>"+val.evidenciaNombre+"</td>"
								+"</tr>");
					});
					completarBarraCarga();
					formatoCeldaSombreableTabla(true,"tblDeclaraciones");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarDeclaracion(pindex) {


	if (!banderaEdicion7) {
		formatoCeldaSombreableTabla(false,"tblDeclaraciones");
		declaracionId = listFullDeclaracions[pindex].id;
		declaracionObj=listFullDeclaracions[pindex];
		
		var fecha=convertirFechaInput(declaracionObj.fecha);
		$("#declafecha" + declaracionId).html(
		 "<input type='date' id='inputFechaDeclaracion' class='form-control'>");
		$("#inputFechaDeclaracion").val(fecha);
		// 
		var responsable=declaracionObj.responsable.nombre;
		$("#declaresp" + declaracionId).html(
		 "<input   id='inputRespDeclaracion' class='form-control'>");
		$("#inputRespDeclaracion").val(responsable);
		//
		var clas=declaracionObj.clasificacion.id;
		var slcClasificacionDeclaracion=crearSelectOneMenuOblig("slcClasificacionDeclaracion", "verAcordeClasificacionDeclaracion()",
				listClasifcacionDeclaracion, clas, "id", "nombre");
		$("#declaclas" + declaracionId).html(slcClasificacionDeclaracion );
		//
		verAcordeClasificacionDeclaracion();
		//
		
		var fechaInicio=convertirFechaInput(declaracionObj.fechaInicio);
		$("#declafi" + declaracionId).html(
		 "<input type='date' id='inputFechaInicioDeclaracion' class='form-control'>");
		$("#inputFechaInicioDeclaracion").val(fechaInicio);
		// 
		var fechaFin=convertirFechaInput(declaracionObj.fechaFin);
		$("#declaff" + declaracionId).html(
		 "<input type='date' id='inputFechaFinDeclaracion' class='form-control'>");
		$("#inputFechaFinDeclaracion").val(fechaFin);
		// 
		var options=
		{container:"#declaevi"+declaracionId,
				functionCall:function(){ },
				descargaUrl: "/residuo/declaracion/evidencia?id="+ declaracionId,
				esNuevo:false,
				idAux:"Declaracion"+declaracionId,
				evidenciaNombre:declaracionObj.evidenciaNombre};
		crearFormEvidenciaCompleta(options);
		//
		banderaEdicion7 = true;
		$("#btnCancelarDeclaracion").show();
		$("#btnNuevoDeclaracion").hide();
		$("#btnEliminarDeclaracion").show();
		$("#btnGuardarDeclaracion").show();
		$("#btnReporteDeclaracion").show();
		
		
		
		
	}
	
}

function verAcordeClasificacionDeclaracion(){
	var clasifActual=$("#slcClasificacionDeclaracion").val();
	var slcTipoDeclaracionFilter=crearSelectOneMenuOblig("slcTipoDeclaracion","",
			listTipoDeclaracion.filter(function(val){
				return val.clasificacion.id==clasifActual
			}), declaracionObj.tipo.id, "id", "nombre");
	$("#declatip"+declaracionId).html(slcTipoDeclaracionFilter)
}
function nuevoDeclaracion() {
	if (!banderaEdicion7) {
		declaracionId = 0;
		var slcClasificacionDeclaracion=crearSelectOneMenuOblig("slcClasificacionDeclaracion", "verAcordeClasificacionDeclaracion()",
				listClasifcacionDeclaracion, "", "id", "nombre");
		var slcTipoDeclaracion=crearSelectOneMenuOblig("slcTipoDeclaracion", "",
				listTipoDeclaracion, "", "id", "nombre");
		$("#tblDeclaraciones tbody")
				.prepend(
						"<tr  >"
						
						+"<td>"+"<input type='date' id='inputFechaDeclaracion' class='form-control'>"+"</td>"
						 +"<td>"+ "<input   id='inputRespDeclaracion' class='form-control'>"+"</td>" 
							 +"<td>"+slcClasificacionDeclaracion+"</td>"
						+"<td id='declatip0'>"+slcTipoDeclaracion+"</td>" 
						+"<td>"+"<input type='date' id='inputFechaInicioDeclaracion' class='form-control'>"+"</td>"
						+"<td>"+"<input type='date' id='inputFechaFinDeclaracion' class='form-control'>"+"</td>"
						+"<td id='declaevi0'>0</td>"
								+ "</tr>");
		//
		verAcordeClasificacionDeclaracion();
		$("#inputFechaDeclaracion").val(obtenerFechaActual());
		$("#inputHoraDeclaracion").val("12:00:00")
		//
		var options=
		{container:"#declaevi"+declaracionId,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"Declaracion"+declaracionId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
		$("#btnCancelarDeclaracion").show();
		$("#btnNuevoDeclaracion").hide();
		$("#btnEliminarDeclaracion").hide();
		$("#btnGuardarDeclaracion").show();
		$("#btnGenReporte").hide();
		banderaEdicion7 = true;
		formatoCeldaSombreableTabla(false,"tblDeclaraciones");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarDeclaracion() {
	cargarDeclaracions();
}

function eliminarDeclaracion() {
	var r = confirm("¿Está seguro de eliminar la Declaracion?");
	if (r == true) {
		var dataParam = {
				id : declaracionId,
		};
		callAjaxPost(URL + '/residuo/declaracion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarDeclaracions();
						break;
					default:
						alert("No se puede eliminar ");
					}
				});
	}
}

function guardarDeclaracion() {

	var campoVacio = true;
	var fecha=$("#inputFechaDeclaracion").val();  
	var responsable=$("#inputRespDeclaracion").val();
	var clas=$("#slcClasificacionDeclaracion").val();
	var tipo=$("#slcTipoDeclaracion").val();
	var fechaInicio=$("#inputFechaInicioDeclaracion").val();  
	var fechaFin=$("#inputFechaFinDeclaracion").val();  

		if (campoVacio) {

			var dataParam = {
				id : declaracionId,
				fecha:convertirFechaTexto(fecha),
				fechaInicio:convertirFechaTexto(fechaInicio),
				fechaFin:convertirFechaTexto(fechaFin), 
				clasificacion:{id:clas},
				tipo:{id:tipo},
				responsable:{nombre:responsable},
				empresa :{empresaId :getSession("gestopcompanyid")}
			};

			callAjaxPost(URL + '/residuo/declaracion/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							guardarEvidenciaAuto(data.nuevoId,"fileEviDeclaracion"+declaracionId
									,bitsEvidenciaAccionMejora,"/residuo/declaracion/evidencia/save",
									cargarDeclaracions); 
							 
							break;
						default:
							console.log("Ocurrió un error al guardar la Declaracion!");
						}
					},null,null,null,null,false);
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoDeclaracion(){
	cargarDeclaracions();
}



