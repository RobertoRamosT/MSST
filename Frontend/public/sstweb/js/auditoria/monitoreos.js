/**
 * 
 */
var monitoreoAuditoriaId;var objMonitoreo;
var banderaEdicionMonitoreo;
var listFullMonitoreos;
var listTipoMonitoreo;
var listTipoVigencia;
var lisPuestosMonitoreo=[];
var listPuestosSeleccionados=[];
function cargarMonitoreos(){
	$("#modalMonitoreo").modal("show");
	llamarMonitoreosCurso();
}
function llamarMonitoreosCurso(){
	monitoreoAuditoriaId=0;
	banderaEdicionMonitoreo=false;
	listFullMonitoreos=[];
	listTipoMonitoreo=[];
	$("#btnAgregarMonitoreo").show();
	$("#btnCancelarMonitoreo").hide();
	$("#btnEliminarMonitoreo").hide();
	$("#btnGuardarMonitoreo").hide();
	
	$("#btnAgregarMonitoreo").attr("onclick", "javascript:nuevoMonitoreo();");
	$("#btnCancelarMonitoreo").attr("onclick", "javascript:llamarMonitoreosCurso();");
	$("#btnGuardarMonitoreo").attr("onclick", "javascript:guardarMonitoreo();");
	$("#btnEliminarMonitoreo").attr("onclick", "javascript:eliminarMonitoreo();");
	$("#btnGenReporteMon").hide();
	$("#btnGenReporteMon").attr("onclick","javascript:generarReporteMonitoreo();");
	var isCompleto =(auditoriaObj.evaluacionGerencia.id == 1);
	if(isCompleto){
		$("#btnAgregarMonitoreo").hide();
	}else{
		$("#btnAgregarMonitoreo").show();
	}
	volverMonitoreos();
	var dataParam={auditoriaId:auditoriaId}
	callAjaxPost(URL + '/auditoria/monitoreos', dataParam, function(data) {
		
		listFullMonitoreos=data.list;
		listTipoMonitoreo=data.listTipoMonitoreo;
		listTipoVigencia=data.listTipoVigencia;
		$("#tblMonitoreo tbody").html("");
		listFullMonitoreos.forEach(function(val,index){
			$("#tblMonitoreo tbody").append("<tr " +
					(isCompleto?"":"onclick='javascript:editarMonitoreo("+
					index+")' ") +
							">"+
					"<td id='monArea"+
					val.id + "'>"+
					val.area + "</td>" +
					"<td id='monTipo"+
					val.id + "'>"+
					val.tipo.nombre + "</td>" +
					"<td id='monAgent"+
					val.id + "'>"+
					val.agenteMonitoreado + "</td>" +
					"<td id='monDentro"+
					val.id + "'>"+
					(val.isDentroPlanes==1?"Sí":"No") + "</td>" +
					"<td id='monVig"+
					val.id + "'>"+
					val.vigencia.nombre + "</td>" +
					"<td id='monFec"+
					val.id + "'>"+
					val.fechaProximaTexto+ "</td>" +
					"<td id='monTrabs"+
					val.id + "'>"+
					val.numTrabajadores + "</td>" +
					"<td id='monOrg"+
					val.id + "'>"+
					val.organizacion+ "</td>" +
					"<td id='monResu"+
					val.id + "'>"+
					val.resultado+ "</td>" +
					"<td id='monObs"+
					val.id + "'>"+
					val.observaciones + "</td>" +
					"<td id='monHall"+
					val.id + "'>"+
					(isCompleto?"<a class='efectoLink' onclick='marcarMonitoreoIndex("+index+");cargarHallazgoMonitoreos("+val.id+")'>"+
							"<i class='fa fa-list'></i>"+val.numHallazgos+"</a>":val.numHallazgos)+
					"</td>" + 
					"</tr>")
		});
	
		formatoCeldaSombreableTabla(true,"tblMonitoreo");
	
});
	
}
function marcarMonitoreoIndex(pindex){
	objMonitoreo=listFullMonitoreos[pindex];
	monitoreoAuditoriaId=listFullMonitoreos[pindex].id;
}
function editarMonitoreo(pindex){
	if(!banderaEdicionMonitoreo){
		banderaEdicionMonitoreo=true;
		$("#btnAgregarMonitoreo").hide();$("#btnGenReporteMon").show();
		$("#btnCancelarMonitoreo").show();
		$("#btnEliminarMonitoreo").show();
		$("#btnGuardarMonitoreo").show();
		formatoCeldaSombreableTabla(false,"tblMonitoreo");
		monitoreoAuditoriaId=listFullMonitoreos[pindex].id;
		listPuestosSeleccionados=[];
		objMonitoreo=listFullMonitoreos[pindex];
		//
		var area=objMonitoreo.area;
		$("#monArea"+monitoreoAuditoriaId).html("<input type='text' id='monitoreoArea' class='form-control' >");
		$("#monitoreoArea").val(area);
		//
		var agente=objMonitoreo.agenteMonitoreado;
		$("#monAgent"+monitoreoAuditoriaId).html("<input type='text' id='monitoreoAgent' class='form-control' >");
		$("#monitoreoAgent").val(agente);
		//
		var tipo=objMonitoreo.tipo.id;
		var selTipoMonitoreo=crearSelectOneMenuOblig("selTipoMonitoreo","",listTipoMonitoreo,tipo,"id","nombre");
		$("#monTipo"+monitoreoAuditoriaId).html(selTipoMonitoreo);
		//
		var dentro=objMonitoreo.isDentroPlanes;
		$("#monDentro"+monitoreoAuditoriaId)
		.html("<input type='checkbox' id='monitoreoDentroCheck' class='form-control' "+
				 (dentro==1?"checked":"" )+ ">");
		//
		var vigencia=objMonitoreo.vigencia.id;
		var selTipoVigencia=crearSelectOneMenuOblig("selTipoVigencia","hallarFechaProximoMonitoreo()",listTipoVigencia,vigencia,"id","nombre");
		$("#monVig"+monitoreoAuditoriaId).html(selTipoVigencia);
		//
		var textTrabs=$("#monTrabs"+monitoreoAuditoriaId).text();
		$("#monTrabs"+monitoreoAuditoriaId).addClass("linkGosst")
		.on("click",function(){verPuestosMonitoreo();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textTrabs);
		//
		var organizacion=objMonitoreo.organizacion;
		$("#monOrg"+monitoreoAuditoriaId)
		.html("<input type='text' id='monitoreoOrgText' class='form-control' >");
		$("#monitoreoOrgText").val(organizacion);
		//
		var resultado=objMonitoreo.resultado;
		$("#monResu"+monitoreoAuditoriaId)
		.html("<input type='text' id='monitoreoResuText' class='form-control' >");
		$("#monitoreoResuText").val(resultado);
		//
		var textHallazgo=$("#monHall"+monitoreoAuditoriaId).text();
		$("#monHall"+monitoreoAuditoriaId).addClass("linkGosst")
		.on("click",function(){cargarHallazgoMonitoreos();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textHallazgo);
		//
		var observaciones=objMonitoreo.observaciones;
		$("#monObs"+monitoreoAuditoriaId).html("<input type='text' id='monitoreoObs' class='form-control' >");
		$("#monitoreoObs").val(observaciones);
		verTrabajadoresMonitoreo();
	}
}
function nuevoMonitoreo(){
	$("#btnAgregarMonitoreo").hide();
	$("#btnCancelarMonitoreo").show();
	$("#btnEliminarMonitoreo").hide();
	$("#btnGuardarMonitoreo").show();
	banderaEdicionMonitoreo=true;
	
	monitoreoAuditoriaId = 0;
	var selTipoMonitoreo=crearSelectOneMenuOblig("selTipoMonitoreo","",listTipoMonitoreo,"","id","nombre");
	var selTipoVigencia=crearSelectOneMenuOblig("selTipoVigencia","hallarFechaProximoMonitoreo()",listTipoVigencia,"","id","nombre");
	$("#tblMonitoreo tbody")
			.append(
					"<tr id='tr0'>"
					+"<td>"+"<input type='text' id='monitoreoArea' class='form-control'>"+"</td>"
					+"<td>"+selTipoMonitoreo+"</td>" 
					+"<td>"+"<input type='text' id='monitoreoAgent' class='form-control'>"+"</td>"
					+"<td><input type='checkbox' id='monitoreoDentroCheck' class='form-control' ></td>"
					+"<td>"+selTipoVigencia+"</td>"
					+"<td id='monFec0'>...</td>"
					+"<td>...</td>"
					+"<td><input class='form-control' id='monitoreoOrgText'></td>"
					+"<td><input class='form-control' id='monitoreoResuText'></td>" 
					+"<td><input class='form-control' id='monitoreoObs'></td>"
					+"<td>...</td>"
							+ "</tr>");
	formatoCeldaSombreableTabla(false,"tblMonitoreo");
}
function generarReporteMonitoreo(){
	

			window.open(URL
					+ "/auditoria/informe/inpeccion?auditoriaId="
					+ auditoriaId +"&tipoAuditoriaId="+auditoriaTipo+"&monitoreoId="+monitoreoAuditoriaId
				
					);	
	
	
}
function eliminarMonitoreo(){
	var monitoreoObj={
			id:monitoreoAuditoriaId
	}
	var r=confirm("¿Está seguro de eliminar este monitoreo?");
	if(r){
		callAjaxPost(URL + '/auditoria/monitoreo/delete', monitoreoObj,
				function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				llamarMonitoreosCurso();
				break;
			default:
				alert("Verificar que el registro de agente de monitoreo no tenga hallazgos asociados");
			}
					
			
					
				});
	}
	
}

function guardarMonitoreo(){
	var tipo=$("#selTipoMonitoreo").val();
	var organizacion=$("#monitoreoOrgText").val();
	var resultado=$("#monitoreoResuText").val();
    var isDentro=$("#monitoreoDentroCheck").prop("checked");
    var vigencia=$("#selTipoVigencia").val();
    var area=$("#monitoreoArea").val();
    var agente=$("#monitoreoAgent").val();
    var obs=$("#monitoreoObs").val();
	var campoVacio=false;
	
	if(monitoreoAuditoriaId>0){
	var seleccionados = $('#jstreePuesto').jstree(true).get_checked();
	listPuestosSeleccionados = [];
	for (index = 0; index < seleccionados.length; index++) {
		var trab = seleccionados[index];
		if (seleccionados[index].substr(0, 4) == "nodo") {
			listPuestosSeleccionados.push(
					{positionId:seleccionados[index]
					.substr(4, seleccionados[index].length)});
		}
	}
	}
	
	if(organizacion.length==0){
		campoVacio=true;
	}
	
	if(campoVacio){
		alert("Complete el campo")
	}else{
		var monitoreoObj={
				id:monitoreoAuditoriaId,
				organizacion:organizacion,
				resultado:resultado,
				isDentroPlanes:(isDentro?1:0),
				vigencia:{id:vigencia},
				area:area,
				tipo:{id:tipo},
				agenteMonitoreado:agente,
				puestos:listPuestosSeleccionados,
				observaciones:obs,
				auditoriaId:auditoriaId
	}
		
		callAjaxPost(URL + '/auditoria/monitoreo/save', monitoreoObj,
				function(data) {
					
					
			llamarMonitoreosCurso();
					
				});
	}
	
	
	
	
	
	
	
	
}
function volverMonitoreos(){
	$("#modalMonitoreo .modal-body").hide();
	$('#modalBodyMonitoreo').show();
	$("#modalMonitoreo .modal-title").html("Monitoreos");
}
function verPuestosMonitoreo() {
	$("#modalMonitoreo .modal-body").hide();
	$('#modalPuestosMonitoreo').show();
	$("#modalMonitoreo .modal-title").html("<a onclick='volverMonitoreos()'>Monitoreo "+objMonitoreo.tipo.nombre+"</a> > Puestos");
	verTrabajadoresMonitoreo();
}

function verTrabajadoresMonitoreo(){
	if (listPuestosSeleccionados.length === 0) {

		var dataParam = {
			id : monitoreoAuditoriaId,
			empresaId : sessionStorage.getItem("gestopcompanyid")
		};

		callAjaxPost(
				URL + '/auditoria/monitore/puestos/jstreePuesto',
				dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						$('#jstreePuesto').jstree("destroy");

						lisPuestosMonitoreo = data.list;

						$('#jstreePuesto').jstree({
							"plugins" : [ "checkbox", "json_data" ],
							'checkbox' : {
								"keep_selected_style" : false,
								"tie_selection" : false
							},
							'core' : {
								'data' : lisPuestosMonitoreo
							}
						});


						for (index = 0; index < lisPuestosMonitoreo.length; index++) {
							if (lisPuestosMonitoreo[index].state.checked
									&& lisPuestosMonitoreo[index].id.substr(
											0, 4) == "nodo") {
								listPuestosSeleccionados
										.push(
												{positionId:	lisPuestosMonitoreo[index].id
												.substr(
														4,
														lisPuestosMonitoreo[index].id.length)
												});
							}
						}

						break;
					default:
						alert("Ocurrió un error al cargar el arbol de puestos!");
					}
				});
	}
}

function hallarFechaProximoMonitoreo(){
	var vigencia=parseInt($("#selTipoVigencia").val());
	var numMeses=0;
	listTipoVigencia.forEach(function(val,index){
		if(val.id==vigencia){
			numMeses=val.numMeses;
		}
	});
	var audiFechaNormal=convertirFechaNormal2(auditoriaFecha);
	var proxFecha=sumaFechaDias2(30.5*numMeses,audiFechaNormal);
	$("#monFec"+monitoreoAuditoriaId).html(proxFecha+" aprox.");
}

