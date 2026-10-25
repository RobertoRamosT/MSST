var banderaEdicion2=false;
var revisionId,revisionObj;
var listFullNormaRevision,listFullVigencia;
var companyId;
$(function(){
	$("#btnNuevoNormaLegalRevision").attr("onclick", "javascript:nuevaRevision();");
	$("#btnCancelarNormaLegalRevision").attr("onclick", "javascript:cancelarNuevaRevision();");
	$("#btnGuardarNormaLegalRevision").attr("onclick", "javascript:guardarRevision();");
	$("#btnEliminarNormaLegalRevision").attr("onclick", "javascript:eliminarRevision();"); 
}) 
function verProgramacion(){
	$("#filtroPalabraClaveArticulos").hide();
	$("#tabNormaLegalEmpresa .container-fluid").hide();
	$("#tabNormaLegalEmpresa #divContainNormaLegalEmpresa").hide(); 
	$("#tabNormaLegalEmpresa #divContainNormaLegalRevision").show();
	$("#tabNormaLegalEmpresa").find("h2")
	.html("<a onclick=' volverNormaEmpresa()'>Norma Legal de Empresas></a>Programacion de Revisión:");
	cargarProgramacion();
}
function volverNormaRevision() {
	$("#filtroPalabraClaveArticulos").show();
	$("#tabNormaLegalEmpresa .container-fluid").hide();
	$("#divContainNormaLegalRevision").show();
	$("#divContainNormaLegalRevisionEvaluacion").hide();
	$("#tabNormaLegalEmpresa").find("h2")	
	.html("<a onclick=' volverNormaEmpresa()'>Norma Legal de Empresas></a>Programacion de Revisión:"); 
}
function cargarProgramacion() {
	$("#btnCancelarNormaLegalRevision").hide();
	$("#btnNuevoNormaLegalRevision").show();
	$("#btnEliminarNormaLegalRevision").hide();
	$("#btnGuardarNormaLegalRevision").hide();
	companyId=getSession("gestopcompanyid"); 
	callAjaxPost(URL + '/requisitos/norma/empresa/revision', 
			{
				norma:{id:normaLegalEmpresaId},
				empresa:{idCompany:companyId}
			}, 
		function(data){
			if(data.CODE_RESPONSE=="05"){ 
				banderaEdicion2=false;
				listFullNormaRevision=data.list;   
				listFullVigencia=data.vigencia
				$("#tblNormaLegalRevision tbody tr").remove();
				listFullNormaRevision.forEach(function(val,index){
				$("#tblNormaLegalRevision tbody").append(
						"<tr id='trrev"+val.id+"' onclick='editarRevision("+index+")'>"
							+"<td id='revfechaplan"+val.id+"'>"+val.fechaPlanificadaTexto+"</td>"
							+"<td id='revhoraplan"+val.id+"'>"+val.horaPlanificadaTexto+"</td>"
							+"<td id='rev"+val.id+"'>...</td>"
							+"<td id='revfechareal"+val.id+"'>"+val.fechaRealTexto+"</td>"
							+"<td id='revdetplan"+val.id+"'>"+val.numArticulosCumple+" / "+val.numArticulosTotal+"</td>" 
							+"<td id='rev"+val.id+"'>...</td>" 
							+"<td id='rev"+val.id+"'>...</td>" 
							+"<td id='revvigencia"+val.id+"'>"+val.vigencia.nombre+"</td>"
							+"<td id='revevi"+val.id+"'>"+val.evidenciaNombre+"</td>" 
							+"<td id='reveest"+val.id+"'>"+val.estado.nombre+"</td>" 
						+"</tr>"); 
				});
				completarBarraCarga();
				formatoCeldaSombreableTabla(true,"tblNormaLegalRevision");
			}else{
				console.log("NOPNPO")
			}
		});
}

function editarRevision(pindex) {

	if (!banderaEdicion2) {
		formatoCeldaSombreableTabla(false,"tblNormaLegalRevision");
		revisionId = listFullNormaRevision[pindex].id;
		revisionObj=listFullNormaRevision[pindex];
		
		var tipo=revisionObj.vigencia.id; 
		var selTipoVigencia=crearSelectOneMenuOblig("inputTipoVig","",listFullVigencia,tipo,"id","nombre")
		$("#revvigencia" + revisionId).html(selTipoVigencia);  
		
		
		var fechaPlan=convertirFechaInput(revisionObj.fechaPlanificada); 
		$("#revfechaplan"+revisionId).html("<input onchange='cambiarAcuerdoFechaRevision()' type='date' id='inputReviFechaP' class='form-control'>");
		$("#inputReviFechaP").val(fechaPlan);
		var hora=revisionObj.horaPlanificada;
		$("#revhoraplan"+revisionId).html("<input type='time' id='inputReviHoraP' class='form-control'>");
		$("#inputReviHoraP").val(hora);
		var fechaReal=convertirFechaInput(revisionObj.fechaReal); 
		$("#revfechareal"+revisionId).html("<input onchange='cambiarAcuerdoFechaRevision()' type='date' id='inputReviFechaReal' class='form-control'>");
		$("#inputReviFechaReal").val(fechaReal);
		cambiarAcuerdoFechaRevision();
		options={
				container:"#revevi"+revisionId,
				functionCall: function(){},
				descargaUrl:"/requisitos/norma/empresa/revision/evidencia?id="+revisionId,
				esNuevo:false,
				idAux:"Revision",
				evidenciaNombre:revisionObj.evidenciaNombre
		};
		crearFormEvidenciaCompleta(options);
		
		$("#revdetplan"+revisionId).addClass("linkGosst")
		.on("click",function(){ verPlanificacion(); })
		.html("<i class='fa fa-list fa-2x' aria-hidden='true' ></i> "
				+revisionObj.numArticulosCumple+" / "+revisionObj.numArticulosTotal);
		
		banderaEdicion2 = true;
		$("#btnCancelarNormaLegalRevision").show();
		$("#btnNuevoNormaLegalRevision").hide();
		$("#btnEliminarNormaLegalRevision").show();
		$("#btnGuardarNormaLegalRevision").show(); 
	}
	
}


function nuevaRevision() {
	if (!banderaEdicion2) {
		revisionId = 0;
		revisionObj = {id : 0};
		var selTipoVigencia=crearSelectOneMenuOblig("inputTipoVig","",listFullVigencia,"","id","nombre"); 
		$("#tblNormaLegalRevision tbody")
				.prepend(
					"<tr>"
						+"<td>"+"<input type='date' onchange='cambiarAcuerdoFechaRevision()' id='inputReviFechaP' class='form-control'>" +"</td>"
						+"<td>"+"<input type='time'  id='inputReviHoraP' class='form-control'>" +"</td>" 
						+"<td>..</td>"
						+"<td>"+"<input type='date' onchange='cambiarAcuerdoFechaRevision()' id='inputReviFechaReal' class='form-control'>" +"</td>"
						+"<td>..</td>"
						+"<td>..</td>"
						+"<td>..</td>"
						+"<td>"+ selTipoVigencia+"</td>"
						+"<td id='inputRevEvi0'>..</td>"  
						+"<td id='reveest0'>"+""+"</td>" 
					+ "</tr>");
		 var options={
				container:"#inputRevEvi"+revisionId,
				functionCall: function(){},
				descargaUrl:"",
				esNuevo:true,
				idAux:"Revision",
				evidenciaNombre:""
		};
		crearFormEvidenciaCompleta(options);
		$("#btnCancelarNormaLegalRevision").show();
		$("#btnNuevoNormaLegalRevision").hide();
		$("#btnEliminarNormaLegalRevision").hide();
		$("#btnGuardarNormaLegalRevision").show(); 
		banderaEdicion2 = true;
		formatoCeldaSombreableTabla(false,"tblNormaLegalRevision");
	} else {
		alert("Guarde primero.");
	}
} 
function guardarRevision() {

	var campoVacio = true;
	var fechaPlan=convertirFechaTexto($("#inputReviFechaP").val());
	var hora=$("#inputReviHoraP").val();  
	var fechaReal=convertirFechaTexto($("#inputReviFechaReal").val());  
	var tipoVigencia=$("#inputTipoVig").val(); 
	
	
	if (campoVacio) {
		var dataParam = {
			id : revisionId,
			estado : revisionObj.estado,
			fechaPlanificada:fechaPlan,
			horaPlanificada:hora,
			fechaReal:fechaReal,
			vigencia:{id:tipoVigencia},
			norma:{id:normaLegalEmpresaId},
			empresa:{idCompany:companyId}
		};

		callAjaxPost(URL + '/requisitos/norma/empresa/revision/save', dataParam,
				procesarResultadoGuardarRevision);	 
	} else {
		alert("Debe ingresar todos los campos.");
	} 	
}


function procesarResultadoGuardarRevision(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviRevision",
				bitsEvidenciaNormaLegal,"/requisitos/norma/empresa/revision/evidencia/save",
				cargarProgramacion,"id")
		break; 
	default:
		alert("Ocurrio un error al guardar el archivo!");
	}
}
function eliminarRevision() {
	var r = confirm("¿Está seguro de eliminar lel detalle?");
	if (r == true) {
		var dataParam = {
				id : revisionId,
		};
		callAjaxPost(URL + '/requisitos/norma/empresa/revision/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarProgramacion();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}
function cancelarNuevaRevision(){
	cargarProgramacion();
}


function cambiarAcuerdoFechaRevision(){
	var fechaPlanificada=$("#inputReviFechaP").val();
	var fechaReal=$("#inputReviFechaReal").val();
	 
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		revisionObj.estado={
				id:2,nombre:"Completado"
		}
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				revisionObj.estado={
						id:3,nombre:"Retrasado"
				}
			}else{
				revisionObj.estado={
						id:1,nombre:"Por Implementar"
				}
			}
			
		}else{
			revisionObj.estado={
					id:1,nombre:"Por Implementar"
			}
		}
	}
	
	$("#reveest"+revisionObj.id).html(revisionObj.estado.nombre);
}




