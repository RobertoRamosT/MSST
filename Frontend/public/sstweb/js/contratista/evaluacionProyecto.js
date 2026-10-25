var preguntas;
var buenasTotal;
var riesgoPotencialTotal;
var parcialTotal;
var malasTotal;
var noAplicanTotal;
var contador2=0;
 
window.onresize = function(event) {
	resizeDiv();
}
function resizeDiv() {
	vpw = $(window).width();
	vph = $(window).height();
	vph = vph - 320;
	$("#wrapper").css({
		"height" : vph + "px"
	});
}
function listarVerificaciones() {
	volverDivEvaluacion();
	buenasTotal = 0;
	riesgoPotencialTotal = 0;
	parcialTotal = 0;
	malasTotal = 0;
	noAplicanTotal = 0;
	preguntas = [];
	resizeDiv(); 
	removerBotones();
	$("#fsBotones")
			.append(
					"<button id='btnRegresar' type='button' class='btn btn-success' title='Regresar a listado de auditorias'>"
							+ "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"
							+ "</button>");
	$("#fsBotones")
	.append(
			"<button id='btnWordAudi' type='button' class='btn btn-success' title='Lista en Word'>"
					+ "<i class='fa fa-file-word-o fa-2x'></i>"
					+ "</button>");
	$("#btnRegresar").attr("onclick", "javascript:regresarAuditoria();");
	$("#btnWordAudi").on("click",function(){
		window.open(URL
				+ "/auditoria/exportable/auditoria?auditoriaId="
				+ auditoriaId 
			);
	});
	$("#fsBotonesAudi")
	.html(
			"<button id='btnExcelAudi' type='button' class='btn btn-success btn-excel' >"
					+ "<i class='fa fa-file-word-o '></i>Lista en Excel"
					+ "</button>");
	$("#btnExcelAudi").on("click",function(){
		window.open(URL
				+ "/contratista/auditoria/detalle/excel?id="
				+ auditoriaId +"&tipoId="+auditoriaTipo
			);
	});
	var dataParam = {
		auditoriaId : auditoriaId,
		auditoriaTipo : auditoriaTipo
	};

	callAjaxPost(URL + '/auditoria/verificaciones', dataParam,
			procesarDataDescargadaVerificaciones);
	 

}
function getInformeExcelAuditoriaProyecto(){
	window.open(URL
			+ "/contratista/auditoria/detalle/excel?id="
			+ auditoriaId +"&tipoId="+auditoriaObj.auditoriaTipo
		);
}



function verListaVerif(tipoId){
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado"); 
		listarVerificaciones();
		return;
	}
	var filaId;
	$("#tblVerif tbody tr").each(function (index) 
    {
		 filaId=$(this).prop("id"); 
		var tipoAux=filaId.split('a');
		var tipoAux2=tipoAux[1];
    	if(tipoId==tipoAux2){
    		$(this).toggle();
    	}
    });
}
var listTipoReporteVerificacion = [];
var listTipoFactorVerificacion = [];
var listTipoNivelRiesgoVerificacion= [];
function procesarDataDescargadaVerificaciones(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
	    listTipoReporteVerificacion = data.tiposReporte;
	    listTipoFactorVerificacion = data.factor;
	    listTipoNivelRiesgoVerificacion = data.niveles;
		preguntas = data.list;
		listSeccionesInteresadasDetalleAuditoria=data.secciones;
		$("#tblVerif tbody tr").remove();
		var fila = 0;
		var tipoVerificacion = "";
		var isCompleto=(auditoriaObj.evaluacionGerencia.id == 1);
		buenasTotal = 0;
		riesgoPotencialTotal = 0;
		parcialTotal = 0;
		malasTotal = 0;
		noAplicanTotal = 0;
		preguntas.forEach(function(val,index){
			
		
			fila++;
			if (tipoVerificacion != val.tipoVerificacion) {
			    
				tipoVerificacion = val.tipoVerificacion;
				$("#tblVerif tbody").append("<tr id='filaCategoria"+val.tipoVerificacionId+"'>" +
					"<td colspan='2'></td>" +
			"<td  >" +
					(isCompleto?"":"<input checked type='checkbox' onclick='marcarTodoCategoriaInspeccion("+val.tipoVerificacionId+",0)'>") +
							"</td>"+
				"<td  >" +
					(isCompleto?"":"<input name='respuestaCat' id='respuestaCat1' type='radio' onclick='marcarTodoCategoriaInspeccionRespuesta("+val.tipoVerificacionId+",1)'>") +
							"</td>"+

				"<td  >" +
					(isCompleto?"":"<input name='respuestaCat' id='respuestaCat2' type='radio' onclick='marcarTodoCategoriaInspeccionRespuesta("+val.tipoVerificacionId+",2)'>") +
							"</td>"+
				"<td  >" +
					(isCompleto?"":"<input name='respuestaCat' id='respuestaCat3' type='radio' onclick='marcarTodoCategoriaInspeccionRespuesta("+val.tipoVerificacionId+",3)'>") +
							"</td>"
					+ "<td colspan='8'  class='info' onclick='verListaVerif("+val.tipoVerificacionId+")'>"
								+ val.tipoVerificacion + "</td>"
								+ "</tr>");
			}
			var textParteInteresada="--";
			if(val.respuesta!=null){
				textParteInteresada=val.seccionesNombre+"<br> <button class='btn btn-success' onclick='agregarAreasDetalleAudi("+index+")'>" +
						"<i class='fa fa-plus'></i> Asociar</button>"
			}
			    var selTipoReporteVerificacion = crearSelectOneMenu("selTipoReporteVerificacion"+val.verificacionId,"guardarRespuestaRadioButton("+val.verificacionId+")",
				    listTipoReporteVerificacion,val.tipoEventoInseguro.id,"id","nombre","Ninguno");
			    var selTipoFactorVerificacion = crearSelectOneMenu("selTipoFactorVerificacion"+val.verificacionId,"guardarRespuestaRadioButton("+val.verificacionId+")",
				    listTipoFactorVerificacion,val.factorObservacion.id,"id","nombre","Ninguno");
			    var selTipoNivelRiesgoVerificacion = crearSelectOneMenu("selTipoNivelRiesgoVerificacion"+val.verificacionId,"guardarRespuestaRadioButton("+val.verificacionId+")",
				    listTipoNivelRiesgoVerificacion,val.tipoPerdida.id,"id","nombre","Ninguno");
			$("#tblVerif tbody")
					.append("<tr id='trv"
									+ val.verificacionId
									+ "a"+val.tipoVerificacionId+"'>"
									+ "<td id='tdid"
									+ val.verificacionId
									+ "'>"
									+ fila
									+ "</td>"

									+ "<td id='tdnom"
									+ val.verificacionId
									+ "'>"
									+ val.verificacion
									+ "</td>"

									+ "<td id='tdaplica"
									+ val.verificacionId
									+ "'>"
									+(isCompleto?"":""
									+ "<input type='checkbox' class='check' "
									+ "id='chckaplica"
									+ val.verificacionId
									+ "' "
									+ val.chckAplica
									+ " onclick='javascript:guardarCeldaDeshabilitarPregunta("
									+ val.verificacionId+","+val.tipoVerificacionId
									+ ")'>")
									+ "</td>"

									

									+ "<td id='tdsi"
									+ val.verificacionId
									+ "'>"
									+ "<input type='radio' "
									+ "name='rpta"
									+ val.verificacionId
									+ "' "
									+ "id='rptasi"
									+ val.verificacionId
									+ "' "
									
									+ " value='1' onclick='javascript:guardarRespuestaRadioButton("
									+ val.verificacionId
									+ ")'"+ val.chckSi+">"
									+ "</td>"

									+ "<td id='tdparc"+ val.verificacionId+ "'>"
									+ "<input type='radio' "
									+ "name='rpta"
									+ val.verificacionId
									+ "' "
									+ "id='rptaparc"
									+ val.verificacionId
									+ "' "
									
									+ " value='0.5' onclick='javascript:guardarRespuestaRadioButton("
									+ val.verificacionId
									+ ")'"+ val.chckParc+">"
									+ "</td>"

									+ "<td id='tdno"+ val.verificacionId+ "'>"
									+ "<input type='radio' "
									+ "name='rpta"
									+ val.verificacionId
									+ "' "
									+ "id='rptano"
									+ val.verificacionId
									+ "' "
									
									+ " value='0'  onclick='javascript:guardarRespuestaRadioButton("
									+ val.verificacionId
									+ ")'" + val.chckNo+
											">"
									+ "</td>"

									+ "<td id='tdriesgo"+ val.verificacionId+ "'>"
									+ "<input type='checkbox' class='check' "
									+ "id='chckriesgo"
									+ val.verificacionId
									+ "' onclick='javascript:guardarRespuesta("
									+ val.verificacionId
									+ ")' "
									+ val.chckRiesgo
									+ ">"
									+ "</td>"

									+ "<td id='tdvertipoha"+ val.verificacionId+ "'>"
									+ selTipoReporteVerificacion+"</td>"
									+ "<td id='tdvernivri"+ val.verificacionId+ "'>"
									+ selTipoNivelRiesgoVerificacion+"</td>"
									+ "<td id='tdverfactra"+ val.verificacionId+ "'>"
									+ selTipoFactorVerificacion+"</td>"
									
									+ "<td id='tdcom"+ val.verificacionId+ "'>"
									+ "<textarea class='form-control' rows='1'  onfocus='javascript:aparecerBtnGuardCom("
									+ val.verificacionId
									+ ")' "
									+ "id='inputcom"
									+ val.verificacionId
									+ "'>"
									+ val.comentario
									+ "</textarea></td>"
								//	
									+ "<td id='tdperint"
									+ val.verificacionId
									+ "' style='overflow-wrap: break-word;'>"
									+ textParteInteresada+" </td>"
									//
									+ "<td id='tdacc"
									+ val.verificacionId
									+ "'><a href='#' onclick='javascript:verExternoAccAuditoriaProyecto( "
						+ index + ");'>"+val.indicadorAcciones+"</a></td>"

									+ "<td id='tdevieva"
									+ val.detalleAuditoriaId
									+ "'></td>" + "</tr>");
			
			var textoBoton="---";
			var idAuxx=val.detalleAuditoriaId;
			var options={
					container:"#tdevieva"+idAuxx,
					functionCall:function(data1){
						
						guardarEvidenciaAuto(val.detalleAuditoriaId,"fileEviAuditoriaEval"+val.detalleAuditoriaId
								,bitsEvidenciaVerificacion,"/auditoria/verificaciones/evidencia/save"
								,listarVerificaciones,"verificacionId");
					}
			}
			if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
			{
				if(val.evidenciaNombre=="----")
				{
					val.evidenciaNombre="";
				}
				$("#tdevieva"+ val.detalleAuditoriaId).html("<a class='efectoLink' href='"+ URL
						+ "/auditoria/verificaciones/evidencia?verificacionId="+val.verificacionId
						+"&auditoriaId="+auditoriaId+"'>"+val.evidenciaNombre+"</a>");
				
			}
			else if(val.evidenciaNombre!="----")
			{
				$("#btnDescargarFileAuditoriaEval"+val.detalleAuditoriaId).attr("onclick","location.href='"+ URL
						+ "/auditoria/verificaciones/evidencia?verificacionId="
						+ val.verificacionId+"&auditoriaId="+auditoriaId+"'");	
				crearFormEvidenciaCallBack("AuditoriaEval"+val.detalleAuditoriaId,false,options);
				$("#inputEviAuditoriaEval"+val.detalleAuditoriaId).val(val.evidenciaNombre);
			}else{
				crearFormEvidenciaCallBack("AuditoriaEval"+val.detalleAuditoriaId,true,options);
			}

			if (val.bitAplica == 1) {
				if (val.bitSi == 1) {
					if(val.bitRiesgo == 1){
					    riesgoPotencialTotal++
					}else{
					    buenasTotal++; 
					}
				   
					
				}

				if (val.bitParc == 1) {
					parcialTotal++;
				}

				if (val.bitNo == 1) {
					malasTotal++;
				}
				deshabilitarRiesgoPotencial(val.verificacionId);
			} else {
				noAplicanTotal++;
			}
			deshabilitarPregunta(val.verificacionId,val.tipoVerificacionId,val.detalleAuditoriaId);
			
			$("#tdnom"+ val.verificacionId).css({"text-align":"left"});
			
			
			resaltarInput(val.chckNo,"tdno"+val.verificacionId,"red");
			resaltarInput(val.chckParc,"tdparc"+val.verificacionId,"yellow");
			resaltarInput(val.chckSi,"tdsi"+val.verificacionId,"green");
		});

		$("#indicador1").html("<strong>"+buenasTotal+"</strong>");
		$("#indicador2").html("<strong>"+parcialTotal+"</strong>");
		$("#indicador3").html("<strong>"+malasTotal+"</strong>");
		var numAvance = noAplicanTotal + buenasTotal + parcialTotal+ malasTotal+riesgoPotencialTotal;
		$("#indicador4").html(preguntas.length - numAvance);
		var puntaje=buenasTotal*1+parcialTotal*0.5+riesgoPotencialTotal*0.75+malasTotal*0;
		var puntajeMax=buenasTotal+parcialTotal+riesgoPotencialTotal+malasTotal;
		$("#indicador5").html(
			pasarDecimalPorcentaje(puntaje/puntajeMax,2));
		$("#indicador6")
				.html(numAvance+" / "+preguntas.length);
		
		break;
	default:
		alert("Ocurrió un error al traer las verificaciones!");
	}
	
		goheadfixedY('#tblVerif',"#wrapper");
		
	$(".info").css({"text-align":"center"});
	  setTextareaHeight($('textarea'));
}

var listSeccionesInteresadasDetalleAuditoria;
function agregarAreasDetalleAudi(pindex){
	var verificacionObj=preguntas[pindex]
	//
	var seccionesId=verificacionObj.seccionesId.split(",")
	listSeccionesInteresadasDetalleAuditoria.forEach(function(val){
		val.selected=0;
		seccionesId.forEach(function(val1){
			if(parseInt(val1)==val.id){
				val.selected=1;
			}
		})
	});	
	crearSelectOneMenuObligMultipleCompleto("slcAreaPermitidaDetalleAuditoria", "",
			listSeccionesInteresadasDetalleAuditoria,  "id", "nombre","#tdperint"+verificacionObj.verificacionId,"Secciones interesadas ...");
							
	//
	$("#tdperint"+verificacionObj.verificacionId)
	.append("<button class='btn btn-success' onclick='guardarAreasDetalleAuditoria("+pindex+")'>" +
			"<i class='fa fa-floppy-o'></i> Guardar</button>");
	
}
function guardarAreasDetalleAuditoria(pindex){
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
		listarVerificaciones();
		return;
	}
	var verificacionObj=preguntas[pindex]
	var areas=$("#slcAreaPermitidaDetalleAuditoria").val();
	var listSecciones=[];
	areas.forEach(function(val,index){
		listSecciones.push({id:val});
	});
	callAjaxPost(URL + '/auditoria/verificacion/id/save', 
			{
		auditoriaId : auditoriaId,
		auditoriaTipo : auditoriaTipo,
		detalleAuditoriaId : verificacionObj.detalleAuditoriaId,
		secciones:listSecciones},
			function(data){
			var detalle=data.detalle;
			preguntas[pindex]=detalle;
			$("#tdperint"+verificacionObj.verificacionId)
			.html(detalle.seccionesNombre+"<br> <button class='btn btn-success' onclick='agregarAreasDetalleAudi("+pindex+")'>" +
						"<i class='fa fa-plus'></i> Asociar</button>")
		});
}

function volverDivEvaluacion(){
	$("#tabProyectos .container-fluid").hide();
	$("#tabProyectos #divEvalAuditoria").show();  
	$("#tabProyectos h2").html(
			"<a onclick='volverDivProyectos()'>Proyecto ("+
			proyectoObj.titulo+") </a> " +
			"><a onclick='volverDivAuditoriaProyecto()'>Auditoría '"+ nombreTipoAudi+"' "+convertirFechaNormal(auditoriaFecha)+"</a>" +
					" > Listado de verificación");
}
function verExternoAccAuditoriaProyecto(pindex){ 
	 
	$("#tabProyectos .container-fluid").hide(); 
	$("#tabProyectos #divVerAccionAuditoriaProyecto").show();
	$("#tabProyectos h2")
	.html("" +
			"<a onclick='volverDivProyectos()'>Proyecto ("+
			proyectoObj.titulo+") </a> " +
			"><a onclick='volverDivAuditoriaProyecto()'> Auditoría '"+
				nombreTipoAudi+"' "+convertirFechaNormal(auditoriaFecha)+"</a>" +
			"><a onclick='volverDivEvaluacion()'>Requisito ("
			+preguntas[pindex].verificacion+") </a>  >   Acciones de Mejora");
	
var audiObj={accionMejoraTipoId : 1,
		detalleAuditoriaId:parseInt(preguntas[pindex].detalleAuditoriaId)};
callAjaxPost(URL + '/gestionaccionmejora/accionmejora', 
			audiObj, function(data){
				if(data.CODE_RESPONSE=="05"){ 
					$("#tblAccAudi tbody tr").remove();
					var detalleAccAuditoriaFull=data.list;
					detalleAccAuditoriaFull.forEach(function(val,index){
						val.id=val.accionMejoraId;
						var btnDescarga="<br><a class='btn btn-success' target='_blank' " +
								"href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.accionMejoraId+"'>" +
										"<i class='fa fa-download'></i>Descargar</a>";
						if(val.evidenciaNombre==""
							|| val.evidenciaNombre=="----"){
							btnDescarga="";
						}
						$("#tblAccAudi tbody").append(
								"<tr id='trtip"+val.id+"' >" +
//							
								"<td id='actpdesc"+val.id+"'>"+val.descripcion+"</td>" +
								"<td id='actpfp"+val.id+"'>"+val.fechaRevisionTexto+"</td>" +
								"<td id='actpfr"+val.id+"'>"+val.fechaRealTexto+"</td>" +
								"<td id='actpobs"+val.id+"'>"+val.observacion+"</td>" +
								"<td id='actpevi"+val.id+"'>"+val.evidenciaNombre+""+btnDescarga+"</td>" +
								"<td id='actpes"+val.id+"'>"+val.estadoCumplimientoNombre+"</td>" +
								
								 
								"</tr>");
					});
				}else{
					console.log("NOPNPO")
				}
			});
}
function resaltarInput(isChecked,inputId,color){
	if(isChecked=="checked"){
	$("#"+inputId).css("background-color",color);
	}
}

function regresarAuditoria() {
	$("#divVerif").hide();
	$("#divAudi").show();
	removerBotones();
	crearBotones();
	$("#fsBotones")
			.append(
					"<button id='btnListarVerificaciones' type='button' class='btn btn-success' title='Listado de Verificaciones del tipo de auditoria'>"
							+ "<i class='fa fa-tasks fa-2x'></i></button>");
	habilitarBotonesEdicion();
	$("#fsBotones")
	.append(
			"<button id='btnGenReporte' type='button' class='btn btn-success' title='Generar Informe'>"
					+ "<i class='fa fa-file-word-o fa-2x'></i>"
					+ "</button>");

	$("#btnGenReporte").show();
	$("#btnGenReporte").attr("onclick","javascript:generarReporteAuditoria();");
	$("#btnNuevo").attr("onclick", "javascript:nuevoAuditoria();");
	$("#btnCancelar").attr("onclick", "javascript:cancelarAuditoria();");
	$("#btnGuardar").attr("onclick", "javascript:guardarAuditoria();");
	$("#btnEliminar").attr("onclick", "javascript:eliminarAuditoria();");
	$("#btnListarVerificaciones").attr("onclick",
			"javascript:listarVerificaciones();");
}

function uploadEvidencia(verificacionId) {
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
		listarVerificaciones();
		return;
	}
	var inputFileImage = document.getElementById("fileEvi");
	var file = inputFileImage.files[0];
	var data = new FormData();
	if (file.size > bitsEvidenciaVerificacion) {
		alert("Solo se pueden subir archivos menores a "+bitsEvidenciaVerificacion/1000000+" MB");
	} else {
		data.append("fileEvi", file);
		data.append("verificacionId", verificacionId);
		data.append("auditoriaId", auditoriaId);

		var url = URL + '/auditoria/verificaciones/evidencia/save';
		$.blockUI({message:'cargando...'});
		$
				.ajax({
					url : url,
					headers: {
				        "GESTOP_HEADER_DS" : sessionStorage.getItem("GESTOP_HEADER_DS")
				    },
					type : 'POST',
					contentType : false,
					data : data,
					processData : false,
					cache : false,
					success : function(data, textStatus, jqXHR) {
						$.unblockUI();
						switch (data.CODE_RESPONSE) {
						case "06":
							sessionStorage.clear();
							document.location.replace(data.PATH);
							break;
						default:
							console.log('Se subio el archivo correctamente.');
							$('#mdUpload').modal('hide');
							$("#modalProg").show();
							$("#modalTree").hide();
							$("#modalUpload").hide();
							listarVerificaciones();
						}

					},
					error : function(jqXHR, textStatus, errorThrown) {
						$.unblockUI();
						alert("Ups, tenemos problemas tecnicos. Intente más tarde. Error: "
								+ errorThrown);
						console.log('xhRequest: ' + jqXHR + "\n");
						console.log('ErrorText: ' + textStatus + "\n");
						console.log('thrownError: ' + errorThrown + "\n");
					}
				});
		
	}
}

function mostrarCargarImagen(verificacionId) {
	$('#mdUpload').modal('show');
	$('#btnUploadEvidencia').attr("onclick",
			"javascript:uploadEvidencia(" + verificacionId + ");");
}

function aparecerBtnGuardRegLegal(verificacionId) {
	if (!($("#btnGuardarCelda").length > 0)) {
		$("#tdreflegal" + verificacionId)
				.append("<button id='btnGuardarCelda' type='button' class='btn  btn-warning' "
						+ "title='Guardar Referencia Legal' onclick='javascript:guardarRespuesta("
						+ verificacionId
						+ ")'>"
						+ "<i class='fa fa-floppy-o fa-lg'></i></button>");
	}
}

function aparecerBtnGuardCom(verificacionId) {
	if (!($("#btnGuardarCelda").length > 0)) {
		$("#tdcom" + verificacionId)
				.append(
						"<button id='btnGuardarCelda' type='button' class='btn  btn-warning' "
								+ "title='Guardar Comentario' onclick='javascript:guardarRespuesta("
								+ verificacionId
								+ ")'>"
								+ "<i class='fa fa-floppy-o fa-lg'></i></button>");
	}
}
function aparecerBtnGuardPerInt(verificacionId) {
	if (!($("#btnGuardarCeldaPerInt").length > 0)) {
		$("#tdperint" + verificacionId)
				.append(
						"<button id='btnGuardarCeldaPerInt' type='button' class='btn  btn-warning' "
								+ "title='Guardar Persona Interesada' onclick='javascript:guardarRespuesta("
								+ verificacionId
								+ ")'>"
								+ "<i class='fa fa-floppy-o fa-lg'></i></button>");
	}
}
var tipoVerificacionId = 0;
function guardarCeldaDeshabilitarPregunta(verificacionId,tipoId) {
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
		listarVerificaciones();
		return;
	}
	tipoVerificacionId = tipoId;
	deshabilitarPregunta(verificacionId,tipoId);
	guardarRespuesta(verificacionId);
}

function deshabilitarPregunta(verificacionId,tipoId,detalleAuditoriaId) {
	
	var bitAplica =$("#chckaplica" + verificacionId).is(':checked');
	
	if (bitAplica) {
		
		$("#trv" + verificacionId + "a"+tipoId+" :input").attr("disabled", false);
		$("#descargarimagen" + verificacionId).attr("onclick", "");
		$("#subirimagen" + verificacionId).attr("onclick", "javascript:mostrarCargarImagen("+verificacionId+")");
		deshabilitarRiesgoPotencial(verificacionId);
		$("#fileEviAuditoriaEval"+detalleAuditoriaId).parent("span").show();
	} else {
		
		$("#trv" + verificacionId + "a"+tipoId+" :input").attr("disabled", true);
		$("#btnDescargarFileAuditoriaEval"+detalleAuditoriaId).attr("disabled", false);
		$("#fileEviAuditoriaEval"+detalleAuditoriaId).parent("span").hide();
		
		$("#descargarimagen" + verificacionId).attr("onclick", "return false;");
		$("#subirimagen" + verificacionId).attr("onclick", "return false;");
		$("#chckaplica" + verificacionId).attr("disabled", false);
	}
}

function guardarRespuestaRadioButton(verificacionId) {
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
		listarVerificaciones();
		return;
	}
	deshabilitarRiesgoPotencial(verificacionId);
	guardarRespuesta(verificacionId);
}

function deshabilitarRiesgoPotencial(verificacionId) {
	var bitRespuesta = parseFloat($(
			"input[name='rpta" + verificacionId + "']:checked").val());
	if(bitRespuesta<1){
		$("#chckriesgo" + verificacionId).prop("disabled", true);
	}else{
		$("#chckriesgo" + verificacionId).prop("disabled", false);
	}
}


function guardarRespuesta(verificacionId) {
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");  
		listarVerificaciones();
		return;
	}
	var bitAplica = $("#chckaplica" + verificacionId).is(':checked');
	var verificacionObj={};
	preguntas.forEach(function(val){
		if(val.verificacionId == parseInt(verificacionId)){
			verificacionObj = val;
		}
	})
	var bitRespuesta=null ;
	if(bitAplica){
	bitRespuesta= parseFloat($(
			"input[name='rpta" + verificacionId + "']:checked").val());
	}
	var bitRiesgo = $("#chckriesgo" + verificacionId).is(':checked');
	var referenciaLegal = $("#inputreflegal" + verificacionId).val();
	referenciaLegal="";
	var comentario = $("#inputcom" + verificacionId).val();
	var personaInteresada=$("#inputperint"+ verificacionId).val();
	var tipoReporte = $("#selTipoReporteVerificacion"+verificacionId).val();
	var factorObservacion = $("#selTipoFactorVerificacion"+verificacionId).val();
	var nivelRiesgo = $("#selTipoNivelRiesgoVerificacion"+verificacionId).val();
	var dataParam = {
		verificacionId : verificacionId,
		bitAplica : pasarBoolInt(bitAplica),
		bitRiesgo : pasarBoolInt(bitRiesgo),
		bitRespuesta : bitRespuesta,
		personaInteresada:personaInteresada,
		 tipoEventoInseguro : {id : tipoReporte},
		 factorObservacion : {id : factorObservacion},
		 tipoPerdida : {id : nivelRiesgo},
		detalleAuditoriaId : verificacionObj.detalleAuditoriaId,
		referenciaLegal : referenciaLegal,
		comentario : comentario,
		auditoriaId : auditoriaId
	};

	callAjaxPost(URL + '/auditoria/verificaciones/respuesta/save', dataParam,
			procesarResultadoGuardarVerif);
}

function procesarResultadoGuardarVerif(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#btnGuardarCelda").remove();
		var dataAux={ "CODE_RESPONSE" : "05"};
		var listActualPregunta = [];
		preguntas.forEach(function(val){
			if(val.verificacionId == data.detalle.verificacionId){
				listActualPregunta.push(data.detalle);
			}else{
				listActualPregunta.push(val);
			}
		});
		dataAux.list = listActualPregunta;
		dataAux.secciones = listSeccionesInteresadasDetalleAuditoria;
		dataAux.tiposReporte= listTipoReporteVerificacion   ;
		dataAux.factor=    listTipoFactorVerificacion   ;
		dataAux.niveles=    listTipoNivelRiesgoVerificacion   ;
		procesarDataDescargadaVerificaciones(dataAux);
		break;
	default:
		alert("Ocurrió un error al guardar la auditoria!");
	}
}


function marcarTodoCategoriaInspeccionRespuesta(catId,tipo){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
	
	var r=confirm("¿Está seguro de marcar toda esta categoría?")
	if(!r){
	    $("#filaCategoria"+catId).find("#respuestaCat"+tipo).prop("checked",false);$.unblockUI();
	    return;
	}else{
	    preguntas.forEach(function(val){
		if(val.tipoVerificacionId==parseInt(catId)){
			$("#rptasi"+val.verificacionId).prop("checked",false);
			$("#rptaparc"+val.verificacionId).prop("checked",false);
			$("#rptano"+val.verificacionId).prop("checked",false);
			switch(parseInt(tipo)){
			case 1:
			    $("#rptasi"+val.verificacionId).prop("checked",true);    
			    break;
			case 2:
			    $("#rptaparc"+val.verificacionId).prop("checked",true);    
			    break;
			case 3:
			    $("#rptano"+val.verificacionId).prop("checked",true);    
			    break;
			}
			
			guardarRespuestaRadioButton(val.verificacionId);
		}
	});
	}
	
}
function marcarTodoCategoriaInspeccion(catId,tipo){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
	if(parseInt(tipo)==0){
		var r=confirm("¿Está seguro de desaplicar esta categoría?")
		if(!r){$("#filaCategoria"+catId).find("input[type='checkbox']").prop("checked",parseInt(tipo)==0);$.unblockUI();return;}
		$("#filaCategoria"+catId).find("input[type='checkbox']").attr("onclick","marcarTodoCategoriaInspeccion("+catId+",1)")
			
	}else{
		var r=confirm("¿Está seguro de aplicar esta categoría?")
		if(!r){$("#filaCategoria"+catId).find("input[type='checkbox']").prop("checked",parseInt(tipo)==0);$.unblockUI();return;}
		$("#filaCategoria"+catId).find("input[type='checkbox']").attr("onclick","marcarTodoCategoriaInspeccion("+catId+",0)")
	mensajeUx="";
		mensajesUx("Cambios aplicados!");	
	}
	 setTimeout(function(){
		 preguntas.forEach(function(val){
				if(val.tipoVerificacionId==parseInt(catId)){
					$("#chckaplica"+val.verificacionId).prop("checked",(parseInt(tipo)==1));
					guardarCeldaDeshabilitarPreguntaCategoria(val.verificacionId,catId)
				}
			});
	},1000);
}


function guardarCeldaDeshabilitarPreguntaCategoria(verificacionId,tipoId) {
	
	tipoVerificacionId=tipoId;
	deshabilitarPregunta(verificacionId,tipoId);
	guardarRespuestaUnica(verificacionId);
	
}
function guardarRespuestaUnica(verificacionId) {
	var bitAplica = $("#chckaplica" + verificacionId).is(':checked');
	var verificacionObj={};
	preguntas.forEach(function(val){
		if(val.verificacionId == parseInt(verificacionId)){
			verificacionObj = val;
		}
	})
	var bitRespuesta=null ;
	if(bitAplica){
	bitRespuesta= parseFloat($(
			"input[name='rpta" + verificacionId + "']:checked").val());
	}
	var bitRiesgo = $("#chckriesgo" + verificacionId).is(':checked');
	var referenciaLegal = $("#inputreflegal" + verificacionId).val();
	referenciaLegal="";
	var comentario = $("#inputcom" + verificacionId).val();
	var personaInteresada=$("#inputperint"+ verificacionId).val();
	var tipoReporte = $("#selTipoReporteVerificacion"+verificacionId).val();
	var factorObservacion = $("#selTipoFactorVerificacion"+verificacionId).val();
	var nivelRiesgo = $("#selTipoNivelRiesgoVerificacion"+verificacionId).val();
	var dataParam = {
		verificacionId : verificacionId,
		bitAplica : pasarBoolInt(bitAplica),
		bitRiesgo : pasarBoolInt(bitRiesgo),
		bitRespuesta : bitRespuesta,
		personaInteresada:personaInteresada,
		 tipoEventoInseguro : {id : tipoReporte},
		 factorObservacion : {id : factorObservacion},
		 tipoPerdida : {id : nivelRiesgo},
		detalleAuditoriaId : verificacionObj.detalleAuditoriaId,
		referenciaLegal : referenciaLegal,
		comentario : comentario,
		auditoriaId : auditoriaId
	};

	callAjaxPost(URL + '/auditoria/verificaciones/respuesta/save', dataParam,
			function(data){
	    
	});
}