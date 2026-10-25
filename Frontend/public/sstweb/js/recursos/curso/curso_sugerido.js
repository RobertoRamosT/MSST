/**
 * 
 */
var listaFullCursosSugeridos;
var cursoSugeridoId;
var banderaEdicionCursoSugerido;
var estadoCursoSugerido;
var cursoSugeridoEdicion;

function verCursosSugeridos(){
	$("#mdCursoFecha").modal("show");
	$("#mdCursoFecha .modal-title").html(
			"<a onclick='volverCursoCapacitacion()'>  '"+capacitacionNombre+"'</a> > Cursos Sugeridos");
	$(".modal-body").hide();
	$("#modalCursoSugerido").show(); 
	
	$("#btnAgregarCursoSugerido").attr("onclick","agergarCursoSugerido()").hide();
	
	llamarCursosSugeridos();
}

function cancelarCurso() {
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
	llamarCursosSugeridos();
}
 
function llamarCursosSugeridos(){
	cursoSugeridoId=0;
	banderaEdicionCursoSugerido=false;
	estadoCursoSugerido={id:1,nombre:"Por implementar"};
var dataParam={capacitacionId:capacitacionId};
	callAjaxPost(URL + '/capacitacion/cursos/sugeridos', dataParam, function(data) {
		
			var list = data.list;
			listaFullCursosSugeridos=data.list;
			
			$("#tblCursoSugerido tbody").html("");
			
			listaFullCursosSugeridos.forEach(function(val,index){
				var botonAgregar="<button class='btn btn-success' id='btnAddSugerido"+val.id+"'>" +
						"<i class='fa fa-plus'></i>Agregar</button>";
				$("#tblCursoSugerido tbody").append("<tr  >" +
						"<td>"+botonAgregar+"</td>"+
						"<td id='curSugNom"+
						list[index].id + "'>"+
						list[index].nombre + "</td>" +
						"<td id='curSugEvi"+
						list[index].id + "'>"+
						insertarImagenParaTablaMovil(val.evidencia,"100%","150px") + "</td>" +
						"<td id='curSugDesc"+
						list[index].id + "'>"+
						list[index].descripcion + "</td>" +
						"<td id='curSugObj"+
						list[index].id + "'>"+
						list[index].numObjetivos + "</td>" +
						
						"<td id='curSugArch"+
						list[index].id + "'>"+
						list[index].numArchivos + "</td>" +
						"<td id='curSugEnl"+
						list[index].id + "'>"+
						list[index].numEnlaces + "</td>" +
						"<td id='curSugPre"+
						list[index].id + "'>"+
						list[index].preguntas.length + "</td>" +
						"<td id='curSugPregOblig"+
						list[index].id + "'>"+
						list[index].numPreguntas + "</td>" +
						"<td id='curSugTiem"+
						list[index].id + "'>"+
						list[index].tiempoSolucion + "</td>" +
						"<td id='curSugPunt"+
						list[index].id + "'>"+
						list[index].puntajeMinimo + "</td>" +
						"<td id='curSugWant"+
						list[index].id + "'>"+
						(list[index].wantsCertificado==1?"Si":"No") + "</td>" +
						"</tr>");
				$("#btnAddSugerido"+val.id+"").on("click",function(){
					var cursoObj=val;
					cursoObj.capacitacionId=capacitacionId;
					var hoy=obtenerFechaActual();
					cursoObj.id=0;
					cursoObj.fechaInicio=convertirFechaTexto(hoy);
					cursoObj.fechaFin=convertirFechaTexto(sumaFechaDias(31,hoy));
					cursoObj.estado={id:1};
					callAjaxPost(URL + '/capacitacion/curso/sugerido/save', cursoObj,
							function(data) {
								alert("Se agregó el curso "+val.nombre);
								
								programarCurso();
								
							},null,null,null,null,false);
				});
			});
			

			resizeDivGosst("progCursosSugeridoDiv",200);
			goheadfixedY("#tblCursoSugerido","#progCursosSugeridoDiv");
			  
			$.unblockUI();
	} );
}


function editarCursoSugerido(pindex){
	if(!banderaEdicionCursoSugerido){
		banderaEdicionCursoSugerido=true;
		$("#btnCancelarCurso").show();
		$("#btnguardarCursoSugerido").show();
		$("#btnEvaluarCurso").show();
		$("#btneliminarCursoSugerido").show();
		$("#btnAgregarCurso").hide();
		$("#btnGenReporteOnline").show();
		
		formatoCeldaSombreableTabla(false,"tblCursoSugerido");
	cursoSugeridoId=listaFullCursosSugeridos[pindex].id;
	cursoSugeridoEdicion=listaFullCursosSugeridos[pindex];
	var nombre=listaFullCursosSugeridos[pindex].nombre;
	var desc= listaFullCursosSugeridos[pindex].descripcion;
	var textObj=$("#curObj"+cursoSugeridoId).text();
	var textArch=$("#curArch"+cursoSugeridoId).text();
	var textEnl=$("#curEnl"+cursoSugeridoId).text();
	var textPre=$("#curPre"+cursoSugeridoId).text();
	var textAprob=$("#curAprob"+cursoSugeridoId).text();
	var textAsociado=$("#curAsoc"+cursoSugeridoId).text();
	
	var nombreEvidencia=$("#curEvi"+cursoSugeridoId).text();
	var fechaI=convertirFechaInput(listaFullCursosSugeridos[pindex].fechaInicio);
	var fechaF=convertirFechaInput(listaFullCursosSugeridos[pindex].fechaFin);
	var tiempo= listaFullCursosSugeridos[pindex].tiempoSolucion;
	var puntaje= listaFullCursosSugeridos[pindex].puntajeMinimo;
	var textOblig=listaFullCursosSugeridos[pindex].numPreguntas;
	
	$("#curNom"+cursoSugeridoId).html("<input class='form-control' id='inputCurNom'>");
	$("#curDesc"+cursoSugeridoId).html("<input class='form-control' id='inputCurDesc'>");
	$("#curObj"+cursoSugeridoId).addClass("linkGosst")
	.on("click",function(){verObjetivosCurso();})
	.html("<i class='fa fa-star fa-2x' aria-hidden='true' ></i>"+textObj);
	
	$("#curFechaInicio"+cursoSugeridoId).html("<input class='form-control' onchange='hallarestadoCursoSugerido("+cursoSugeridoId+")'  id='inputCurFechaInicio' type='date'>")
	$("#curFechaFin"+cursoSugeridoId).html("<input class='form-control' onchange='hallarestadoCursoSugerido("+cursoSugeridoId+")'  id='inputCurFechaFin' type='date'>")

	$("#curEvi" + cursoSugeridoId)
	.html(
			"<a id='linkEvidencia' " +
			"href='"+URL 
			+ "/capacitacion/programacion/evidencia?programacionCapId="+cursoSugeridoId+"' target='_blank' >" +
			nombreEvidencia+	"</a><br/>" +
			"<a id='linkEvidencia' href='#' onclick='javascript:editarEvidenciaCurso();'>Subir</a>");
	
	$("#curArch"+cursoSugeridoId).addClass("linkGosst")
	.on("click",function(){verArchivosCurso();})
	.html("<i class='fa fa-file-text fa-2x' aria-hidden='true' ></i>"+textArch);
	$("#curEnl"+cursoSugeridoId).addClass("linkGosst")
	.on("click",function(){verEnlacesCurso();})
	.html("<i class='fa fa-external-link fa-2x' aria-hidden='true' ></i>"+textEnl);
	$("#curPre"+cursoSugeridoId).addClass("linkGosst")
	.on("click",function(){verPreguntasCurso();})
	.html("<i class='fa fa-question-circle fa-2x' aria-hidden='true' ></i>"+textPre);
	$("#curAprob"+cursoSugeridoId).addClass("linkGosst")
	.on("click",function(){verEvaluacionCurso();})
	.html("<i class='fa fa-check-square fa-2x' aria-hidden='true' ></i>"+textAprob);
	$("#curAsoc"+cursoSugeridoId).addClass("linkGosst")
	.on("click",function(){verRelacionadosTrabajador();})
	.html("<i class='fa fa-check-square fa-2x' aria-hidden='true' ></i>"+textAsociado); 
	
	
	$("#curTiem"+cursoSugeridoId).html("<input class='form-control' id='inputCurTiem' type='number'>");
	$("#curPunt"+cursoSugeridoId).html("<input class='form-control' id='inputCurPunt' type='number' onkeyup='return comprobarPorcentaje(event)'>");
	$("#curPregOblig"+cursoSugeridoId).html("<input class='form-control' id='inputCurPuntOblig' type='number'  >");
	//
	var profeId=listaFullCursosSugeridos[pindex].profesor.id;
	var selProfesorCurso=crearSelectOneMenuOblig("selProfesorCurso", "",
			listProfesor, profeId, "id", "nombre");
	
	$("#curProfe"+cursoSugeridoId).html(selProfesorCurso);
	//
	var repAid=listaFullCursosSugeridos[pindex].representanteA.id;
	var selProfesorCursoA=crearSelectOneMenu("selProfesorCursoA", "",
			listProfesor, repAid, "id", "nombre","Sin Representante 1");
	$("#curRepreA"+cursoSugeridoId).html(selProfesorCursoA);
	
	//
	var repBid=listaFullCursosSugeridos[pindex].representanteB.id;
	var selProfesorCursoB=crearSelectOneMenu("selProfesorCursoB", "",
			listProfesor, repBid, "id", "nombre","Sin Representante 2");
	$("#curRepreB"+cursoSugeridoId).html(selProfesorCursoB);
	
	//
	var wantsCertificado=(listaFullCursosSugeridos[pindex].wantsCertificado==1);
	$("#curWant"+cursoSugeridoId).html("<input class='form-control' id='checkCertificado' type='checkbox' >");
	
	
	
	$("#inputCurNom").val(nombre);
	$("#inputCurDesc").val(desc);
	$("#inputCurFechaInicio").val(fechaI);
	$("#inputCurFechaFin").val(fechaF);
	$("#inputCurTiem").val(tiempo);
	$("#inputCurPunt").val(puntaje);
	$("#inputCurPuntOblig").val(textOblig);
	$("#checkCertificado").prop("checked",wantsCertificado) 
	}
}


function nuevoCursoSugerido() {
	if (!banderaEdicionCursoSugerido) {
		$("#btnCancelarCurso").show();
		$("#btnguardarCursoSugerido").show();
		$("#btnEvaluarCurso").hide();
		$("#btneliminarCursoSugerido").hide();
		$("#btnAgregarCurso").hide();
		var selProfesorCurso=crearSelectOneMenuOblig("selProfesorCurso", "",
				listProfesor, "", "id", "nombre");
		var selProfesorCursoA=crearSelectOneMenu("selProfesorCursoA", "",
				listProfesor, "", "id", "nombre","Sin Representante 1");
		var selProfesorCursoB=crearSelectOneMenu("selProfesorCursoB", "",
				listProfesor, "", "id", "nombre","Sin Representante 2");
		cursoSugeridoId = 0;
		$("#tblCursoSugerido tbody")
				.append(
						"<tr id='tr0'>"
						+"<td><input class='form-control' id='inputCurNom'></td>"
						+"<td><input class='form-control' id='inputCurDesc'></td>"
						+"<td>...</td>"
						+"<td><input class='form-control' id='inputCurFechaInicio'  onchange='hallarestadoCursoSugerido("+cursoSugeridoId+")'  type='date'></td>"
						+"<td><input class='form-control' id='inputCurFechaFin'  onchange='hallarestadoCursoSugerido("+cursoSugeridoId+")'  type='date'></td>"
						+"<td>"+selProfesorCurso+"</td>"
						+"<td>"+selProfesorCursoA+"</td>"
						+"<td>"+selProfesorCursoB+"</td>"
						+"<td>...</td>"
						+"<td>...</td>"
						+"<td>...</td>"
						+"<td>...</td>"
						+"<td><input class='form-control' id='inputCurPuntOblig' type='number'  ></td>"
						+"<td>...</td>"
					
						+"<td><input class='form-control' id='inputCurTiem' type='number'></td>"
						+"<td><input class='form-control' id='inputCurPunt' type='number' onkeyup='return comprobarPorcentaje(event)'></td>"
						+"<td><input class='form-control' id='checkCertificado' type='checkbox' ></td>"
						
								+ "</tr>");
		formatoCeldaSombreableTabla(false,"tblCursoSugerido");
		banderaEdicionCursoSugerido = true;
	} else {
		alert("Guarde primero.");
	}
}

function guardarCursoSugerido(){
	var nombre=$("#inputCurNom").val();
	var descripcion=$("#inputCurDesc").val();
	var fechaInicio=convertirFechaTexto($("#inputCurFechaInicio").val());
	var fechaFin=convertirFechaTexto($("#inputCurFechaFin").val());
	var tiempo=parseFloat($("#inputCurTiem").val());
	var puntaje=parseFloat($("#inputCurPunt").val());
	var profeId=$("#selProfesorCurso").val();
	var profeAId=$("#selProfesorCursoA").val();
	var profeBId=$("#selProfesorCursoB").val();
	var wantsCertificado=$("#checkCertificado").prop("checked");
	var numPreguntas=$("#inputCurPuntOblig").val();
	
	if(fechaFin==null || fechaInicio==null){
		alert("Ingresar fechas válidas")
	}else{
		

	
	var cursoObj={
			id:cursoSugeridoId,
			wantsCertificado:(wantsCertificado?1:0),
			nombre:nombre,numPreguntas:numPreguntas,
			descripcion:descripcion,
			fechaInicio:fechaInicio,
			fechaFin:fechaFin,
			tiempoSolucion:tiempo,
			puntajeMinimo:puntaje,
			estado:estadoCursoSugerido,
			profesor:{id:profeId},
			representanteA:{id:(profeAId=="-1"?null:profeAId)},
			representanteB:{id:(profeBId=="-1"?null:profeBId)},
	capacitacionId:capacitacionId
	}
	callAjaxPost(URL + '/capacitacion/curso/save', cursoObj,
			function(data) {
				
				
			llamarCursosSugeridos();
				
			},null,null,null,null,false);
	
	
	}
	
	
	
	
	
}

function eliminarCursoSugerido(){
	var cursoObj={
			id:cursoSugeridoId
	}
	var r=confirm("¿Está seguro de eliminar este curso?");
	if(r){
		callAjaxPost(URL + '/capacitacion/curso/delete', cursoObj,
				function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				llamarCursosSugeridos();
				break;
			default:
				alert("Hay registro de trabajadores asociados");
			}
					
			
					
				});
	}
	
}
 
 
       





