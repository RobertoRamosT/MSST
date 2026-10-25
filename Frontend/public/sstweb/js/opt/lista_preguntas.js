var listFullListPreguntasOpt,listFullAreas;
var listaOptObj,listaOptId;
var banderaEdicion1;

var listFullPreguntasOpt;
var pregOptObj,pregOptId;
var banderaEdicion2;
var estadoeliminar=false;
function verListaPreguntasOpt(){ 
	

	$("#btnNuevoListaPregunt").attr("onclick", "javascript: nuevoListaPregOpt();");
	$("#btnCancelarListaPregunt").attr("onclick", "javascript: cancelarListaPregOpt();");
	$("#btnGuardarListaPregunt").attr("onclick", "javascript: guardarListaPregOpt();");
	$("#btnEliminarListaPregunt").attr("onclick", "javascript: eliminarListaPregOpt();");
	
	$("#tabObservaciones .container-fluid").hide();
	$("#tabObservaciones #divContainObservaciones").hide(); 
	$("#tabObservaciones #divContainListaPregunt").show();
	$("#tabObservaciones").find("h2")
	.html("<a onclick='volverObsOpt(); cargarObsOpt();'>Observaciones OPT </a>"
			+"> Listas de OPT");
	cargarListaPreguntasOpt();
	
	$("#btnCancelarPregOpt").attr("onclick", "javascript: cancelarPreguntaOpt();");
	$("#btnNuevoPregOpt").attr("onclick", "javascript: nuevaPreguntaOpt();");
	$("#btnGuardarPregOpt").attr("onclick", "javascript: guardarPreguntaOpt();"); 
	$("#btnEliminarPregOpt").attr("onclick", "javascript: eliminarPreguntaOpt();"); 
}
function cargarListaPreguntasOpt()
{
	$("#btnCancelarListaPregunt").hide();
	$("#btnNuevoListaPregunt").show();
	$("#btnGuardarListaPregunt").hide();
	$("#btnEliminarListaPregunt").hide();
	var empresa=getSession("gestopcompanyid");
	callAjaxPost(URL + '/opt/listas', {
		empresaId :empresa},
		function(data) {
			if (data.CODE_RESPONSE = "05") 
			{
				banderaEdicion1 = false;
				listFullListPreguntasOpt=data.lista_preguntas;
				listFullAreas=data.lista_areas;
				$("#tblListaPregunt tbody tr").remove(); 
				listFullListPreguntasOpt.forEach(function(val, index) {
					$("#tblListaPregunt tbody").append(
							"<tr id='trlist"+val.id+"' onclick='editarListPreguntaOpt("+index+")'>" +
								"<td id='listanombre"+val.id+"'>"+val.nombre+"</td>"+
								"<td id='listaobjet"+val.id+"'>"+val.objetivo+"</td>"+
								"<td id='listaarea"+val.id+"'>"+val.area.areaName+"</td>"+
								"<td id='listaproce"+val.id+"'>"+val.procedimiento+"</td>"+
								"<td id='listanumpreg"+val.id+"'>"+val.numPreguntas+"</td>"+
							+"</tr>");
				});
				completarBarraCarga();
				formatoCeldaSombreableTabla(true, "tblListaPregunt");
			}
		});
}

function nuevoListaPregOpt()
{
	if(!banderaEdicion1){
		listaOptId=0;
		var selAreas=crearSelectOneMenuOblig("inputAreasTrab","",listFullAreas,"","areaId","areaNameShort");
		$("#tblListaPregunt tbody").prepend(
			"<tr>" 
				+"<td><input type='text' id='inputNombreLista' class='form-control'></td>"
				+"<td><input type='text' id='inputObjetivoLista' class='form-control'></td>"
				+"<td>"+selAreas+"</td>"
				+"<td><input type='text' id='inputProcedimientoLista' class='form-control'></td>"
				+"<td>...</td>"
			+"</tr>");
		
		banderaEdicion1=true;
		$("#btnCancelarListaPregunt").show();
		$("#btnNuevoListaPregunt").hide();
		$("#btnGuardarListaPregunt").show();
		$("#btnEliminarListaPregunt").show();
		formatoCeldaSombreableTabla(false,"tblListaPregunt");
	}
	else{
		alert("Guarde Primero.");
	}

}
function editarListPreguntaOpt(pindex)
{
	if(!banderaEdicion1)
	{
		formatoCeldaSombreableTabla(false,"tblListaPregunt");
		listaOptId=listFullListPreguntasOpt[pindex].id;
		listaOptObj=listFullListPreguntasOpt[pindex];
		
		var nombre=listaOptObj.nombre;
		$("#listanombre"+listaOptId).html("<input type='text' id='inputNombreLista' class='form-control'>");
		$("#inputNombreLista").val(nombre);
		
		var objetivo=listaOptObj.objetivo;
		$("#listaobjet"+listaOptId).html("<input type='text' id='inputObjetivoLista' class='form-control'>");
		$("#inputObjetivoLista").val(objetivo);
		
		var area=listaOptObj.area.areaId
		var selAreas=crearSelectOneMenuOblig("inputAreasTrab","",listFullAreas,area,"areaId","areaNameShort");
		$("#listaarea"+listaOptId).html(selAreas);
		$("#inputAreasTrab").val(area);
		
		var procedimiento=listaOptObj.procedimiento;
		$("#listaproce"+listaOptId).html("<input type='text' id='inputProcedimientoLista' class='form-control'>");
		$("#inputProcedimientoLista").val(procedimiento);
		
		var numPreguntas=$("#listanumpreg"+listaOptId).text();
		$("#listanumpreg"+listaOptId).addClass("linkGosst")
		.on("click",function(){verPreguntasOpt();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i> "+numPreguntas);

		
		
		banderaEdicion1=true;
		$("#btnCancelarListaPregunt").show();
		$("#btnNuevoListaPregunt").hide();
		$("#btnGuardarListaPregunt").show();
		$("#btnEliminarListaPregunt").show();
	}
}

function guardarListaPregOpt()
{
	var nombre=$("#inputNombreLista").val();
	var objetivo=$("#inputObjetivoLista").val();
	var area=$("#inputAreasTrab").val();
	var procedimiento=$("#inputProcedimientoLista").val();
	var empresa=getSession("gestopcompanyid");
	
	var dataParam=
	{
		id:listaOptId,
		nombre:nombre,
		objetivo: objetivo,
		area:{areaId:area},
		procedimiento:procedimiento,
		empresa:{empresaId:empresa},
	};
	callAjaxPost(URL+'/opt/listas/save',dataParam,
			cargarListaPreguntasOpt);
}

function eliminarListaPregOpt()
{
	var r= confirm("¿Está  de eliminar esta lista?");
	if(r==true)
	{
		var dataParam={id:listaOptId};
		callAjaxPost(URL+'/opt/listas/delete',dataParam,
		function(data){
			switch (data.CODE_RESPONSE) {
			case "05":
				cargarListaPreguntasOpt();
				break; 
			default:
				alert("No se puede eliminar.");
			}
		});
	}
}
function cancelarListaPregOpt()
{
	cargarListaPreguntasOpt();
}
//aqui empieza las preguntas para cada lista de opt

function verPreguntasOpt()
{
	$("#mdPreguntasOpt").modal("show");
	$("#mdImpDatosLabel").html("Lista Opt: "+listaOptObj.nombre+" > Preguntas");
	cargarPreguntasOpt();
}
function cargarPreguntasOpt()
{
	$("#btnCancelarPregOpt").hide();
	$("#btnNuevoPregOpt").show();
	$("#btnGuardarPregOpt").hide();
	$("#btnEliminarPregOpt").hide();
	
	banderaEdicion2=false;
	listFullPreguntasOpt=listaOptObj.preguntas;
	
	$("#tblPreguntasOpt tbody tr").remove(); 
	if(listaOptObj.numPreguntas!=0)
	{
		listFullPreguntasOpt.forEach(function(val, index) {
			$("#tblPreguntasOpt tbody").append(
					"<tr id='trpreg"+val.id+"' onclick='editarPreguntaOpt("+index+")'>" +
						"<td id='pregindex"+val.id+"'>"+(index+1)+"</td>"+
						"<td id='pregnomb"+val.id+"'>"+val.nombre+"</td>"+
						"<td id='pregcoment"+val.id+"'>"+val.comentario+"</td>"+
					+"</tr>");
		});
	}
	completarBarraCarga();
	formatoCeldaSombreableTabla(true, "tblPreguntasOpt");
}
function nuevaPreguntaOpt()
{
	if(!banderaEdicion2){
		pregOptId=0;
		$("#tblPreguntasOpt tbody").prepend(
			"<tr>" 
				+"<td>...</td>"
				+"<td><input type='text' id='inputNombrePregunta' class='form-control'></td>"
				+"<td><input type='text' id='inputComentarioPregunta' class='form-control'></td>"
			+"</tr>");
		banderaEdicion2=true;
		$("#btnCancelarPregOpt").show();
		$("#btnNuevoPregOpt").hide();
		$("#btnGuardarPregOpt").show();
		$("#btnEliminarPregOpt").show();
		formatoCeldaSombreableTabla(false,"tblPreguntasOpt");
	}
	else{
		alert("Guarde Primero.");
	}
}
function editarPreguntaOpt(pindex)
{
	if(!banderaEdicion2)
	{
		formatoCeldaSombreableTabla(false,"tblPreguntasOpt");
		pregOptObj=listFullPreguntasOpt[pindex];
		pregOptId=pregOptObj.id;
		var nombre=pregOptObj.nombre;
		$("#pregnomb"+pregOptId).html("<input type='text' id='inputNombrePregunta' class='form-control'>");
		$("#inputNombrePregunta").val(nombre);
		var comentario=pregOptObj.comentario;
		$("#pregcoment"+pregOptId).html("<input type='text' id='inputComentarioPregunta' class='form-control'>");
		$("#inputComentarioPregunta").val(comentario);
		
		banderaEdicion2=true;
		$("#btnCancelarPregOpt").show();
		$("#btnNuevoPregOpt").hide();
		$("#btnGuardarPregOpt").show();
		$("#btnEliminarPregOpt").show();
	}
}
function guardarPreguntaOpt()
{
	var nombre=$("#inputNombrePregunta").val(); 
	var comentario=$("#inputComentarioPregunta").val(); 
	var lista=listaOptObj.id;
	var dataParam=
	{
		id:pregOptId,
		nombre:nombre,
		comentario:comentario,
		lista:{id:lista}
	};
	callAjaxPost(URL+'/opt/listas/pregunta/save',dataParam,
			procesarGuardarPregunta);
}

function eliminarPreguntaOpt()
{
	var r= confirm("¿Está  de eliminar esta Pregunta?");
	if(r==true)
	{
		var dataParam={id:pregOptId};
		callAjaxPost(URL+'/opt/listas/pregunta/delete',dataParam,
		function(data){
			switch (data.CODE_RESPONSE) {
			case "05":
				estadoeliminar=true;
				procesarGuardarPregunta(data);
				break; 
			default:
				alert("No se puede eliminar.");
			}
		});
	}
}
function procesarGuardarPregunta(data)
{
	if(pregOptId==0)
	{
		var idNuevo=data.nuevoId;
		if(listaOptObj.numPreguntas==0)
		{
			listaOptObj.preguntas.splice(0,1);
		}
		listaOptObj.preguntas.push({id:idNuevo,nombre:$("#inputNombrePregunta").val(),comentario:$("#inputComentarioPregunta").val()});
		listaOptObj.numPreguntas+=listaOptObj.numPreguntas+1;
	}
	else if(pregOptId!=0)
	{
		var iD=pregOptId;
		var indexId;
		var listAux=listaOptObj.preguntas;
		listAux.forEach(function(val,index)
		{
			if(val.id==iD)
			{
				indexId=index;
			}
		});
		if(estadoeliminar)
		{
			listaOptObj.preguntas.splice(indexId,1);
		}
		else 
		{
			listaOptObj.preguntas[indexId].id=iD;
			listaOptObj.preguntas[indexId].nombre=$("#inputNombrePregunta").val();
			listaOptObj.preguntas[indexId].comentario=$("#inputComentarioPregunta").val();
		}
	}
	cargarPreguntasOpt();
}
function cancelarPreguntaOpt()
{
	cargarPreguntasOpt();
}
