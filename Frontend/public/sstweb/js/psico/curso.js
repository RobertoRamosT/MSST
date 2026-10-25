/**
 * 
 */
var listaFullCursosPsico;
var cursoPsicologiaId;
var banderaEdicionCurso;
var estadoCurso;
var cursoPsicologiaEdicion;
function volverCursosPsicologia(){
	$("#divGeneralPsicologia .container-fluid").hide();
	$("#divGeneralPsicologia #divContainCursos").show();
	$( "h2").html("<a onclick='volverListas()'>"+listaObj.nombre+"</a> >Programaciones");

	
}

function cargarProgrmacionesListaPsicologia(){	 
   $("#btnGenReporteOnline").hide();
	
   $("#btnNuevoCurso").attr("onclick","nuevoCurso()");
   $("#btnCancelarCurso").attr("onclick","cancelarCursoPsicologia()");
   $("#btnEliminarCurso").attr("onclick","eliminarCurso()");
   $("#btnGuardarCurso").attr("onclick","guardarCurso()"); 
   $("#btnGenReporteOnline").attr("onclick","javascript:generarReporteCurso();");
	
   volverCursosPsicologia();
   llamarCursosPsicologia();
}

function generarReporteCurso(){
	
	window.open(URL
			+ "/capacitacion/online/informe?id="
			+ cursoPsicologiaId , '_blank');	
}
function cancelarCursoPsicologia() { 
	llamarCursosPsicologia();
}

function llamarCursosPsicologia(){
   var valorResize = 160;
   resizeDivWrapper("wrapperCurso",valorResize);    
    
   $("#btnCancelarCurso").hide();$("#btnGuardarCurso").hide();
   $("#btnEvaluarCurso").hide();$("#btnEliminarCurso").hide();
   $("#btnNuevoCurso").show();
	
   cursoPsicologiaId = 0;
   banderaEdicionCurso = false;
   
   estadoCurso={
      id: 1,nombre: "Por implementar"
   };

   var dataParam={
      id: listaObj.id
   };
	
   callAjaxPost(URL+'/psicologia/cursos',dataParam,function(data){
      var list = data.list;
      listaFullCursosPsico = data.list;
			
      $("#tblCurso tbody").html("");
			
      listaFullCursosPsico.forEach(function(val,index){
         $("#tblCurso tbody").append(
            "<tr onclick='javascript:editarCurso("+index+")'>" +
	       "<td id='curNom"+val.id+"'>"+val.titulo+"</td>" +
	       "<td id='curDesc"+val.id+"'>"+val.descripcion+"</td>" + 
	       "<td id='curResp"+val.id+"'>"+val.responsable+"</td>" + 
	       "<td id='curFechaInicio"+val.id+"'>"+val.fechaInicioTexto+"</td>" +
	       "<td id='curFechaFin"+val.id+"'>"+val.fechaFinTexto+"</td>" +
	       "<td id='curAprob"+val.id+"'>"+val.numAprobados+" / "+val.numEvaluados+"</td>" +
	       "<td id='curEvi"+val.id+"'>"+val.evidenciaNombre+"</td>" +   
	       "<td id='curEst"+val.id+"'>"+val.estado.nombre+"</td>" + 
            "</tr>");
      });
			
      if(getSession("linkCalendarioProgCursoId") != null){
         var indexIpercAux = 0;
				
         listaFullCursosPsico.every(function(val,index3){				
	    if(val.id == parseInt(getSession("linkCalendarioProgCursoId"))){
	       editarCurso(index3);
	       sessionStorage.removeItem("linkCalendarioProgCursoId");
	       return false;
	    }else{
	       return true;
	    }
         });
      }
			
      formatoCeldaSombreableTabla(true,"tblCurso");
      goheadfixedY("#tblCurso","#wrapperCurso"); 
   });
}


function editarCurso(pindex){
	if(!banderaEdicionCurso){
		banderaEdicionCurso=true;
		$("#btnCancelarCurso").show();
		$("#btnGuardarCurso").show();
		$("#btnEvaluarCurso").hide();
		$("#btnEliminarCurso").show();
		$("#btnNuevoCurso").hide();
		$("#btnGenReporteOnline").show();
		
		formatoCeldaSombreableTabla(false,"tblCurso");
	cursoPsicologiaId=listaFullCursosPsico[pindex].id;
	cursoPsicologiaEdicion=listaFullCursosPsico[pindex];
	var nombre=cursoPsicologiaEdicion.titulo;
	$("#curNom"+cursoPsicologiaId).html("<input class='form-control' id='inputCurNom'>");
	$("#inputCurNom").val(nombre);
	//
	var desc= cursoPsicologiaEdicion.descripcion;
	$("#curDesc"+cursoPsicologiaId).html("<input class='form-control' id='inputCurDesc'>");
	$("#inputCurDesc").val(desc);
	var responsable=cursoPsicologiaEdicion.responsable;
	$("#curResp"+cursoPsicologiaId).html("<input class='form-control' id='inputCurResp'>");
	$("#inputCurResp").val(responsable);
	//
	var fechaI=convertirFechaInput(cursoPsicologiaEdicion.fechaInicio);
	$("#curFechaInicio"+cursoPsicologiaId).html("<input class='form-control' onchange='hallarEstadoCurso("+cursoPsicologiaId+")'  id='inputCurFechaInicio' type='date'>")
	$("#inputCurFechaInicio").val(fechaI);
	//
	var fechaF=convertirFechaInput(cursoPsicologiaEdicion.fechaFin);
	$("#curFechaFin"+cursoPsicologiaId).html("<input class='form-control' onchange='hallarEstadoCurso("+cursoPsicologiaId+")'  id='inputCurFechaFin' type='date'>")
	$("#inputCurFechaFin").val(fechaF);
	//
	var textObj=$("#curAprob"+cursoPsicologiaId).text();
	$("#curAprob"+cursoPsicologiaId).addClass("linkGosst")
	.on("click",function(){verEvaluadosCurso();})
	.html("<i class='fa fa-star fa-2x' aria-hidden='true' ></i>"+textObj);
	 
	var options=
	{container:"#curEvi"+cursoPsicologiaId,
			functionCall:function(){ },
			descargaUrl: "/psicologia/curso/evidencia?id="+ cursoPsicologiaId,
			esNuevo:false,
			idAux:"Curso"+cursoPsicologiaId,
			evidenciaNombre:cursoPsicologiaEdicion.evidenciaNombre};
	crearFormEvidenciaCompleta(options); 
	hallarEstadoCurso();
	}
}


function nuevoCurso() {
	if (!banderaEdicionCurso) {
		$("#btnCancelarCurso").show();
		$("#btnGuardarCurso").show();
		$("#btnEvaluarCurso").hide();
		$("#btnEliminarCurso").hide();
		$("#btnNuevoCurso").hide(); 
		cursoPsicologiaId = 0;
		$("#tblCurso tbody")
				.prepend(
						"<tr id='tr0'>"
						+"<td><input class='form-control' id='inputCurNom'></td>"
						+"<td><input class='form-control' id='inputCurDesc'></td>"
						+"<td><input class='form-control' id='inputCurResp'></td>"
						
						+"<td><input class='form-control' id='inputCurFechaInicio'  onchange='hallarEstadoCurso("+cursoPsicologiaId+")'  type='date'></td>"
						+"<td><input class='form-control' id='inputCurFechaFin'  onchange='hallarEstadoCurso("+cursoPsicologiaId+")'  type='date'></td>"
						+"<td>...</td>"
					  +"<td id='curEvi0'>...</td>" 
						+"<td id='curEst0'></td>"
						 
								+ "</tr>");
		var options=
		{container:"#curEvi"+cursoPsicologiaId,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"Curso"+cursoPsicologiaId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
		formatoCeldaSombreableTabla(false,"tblCurso");
		banderaEdicionCurso = true;
	} else {
		alert("Guarde primero.");
	}
}

function guardarCurso(){
	var nombre=$("#inputCurNom").val();
	var descripcion=$("#inputCurDesc").val();
	var responsable=$("#inputCurResp").val();
	var fechaInicio=convertirFechaTexto($("#inputCurFechaInicio").val());
	var fechaFin=convertirFechaTexto($("#inputCurFechaFin").val());
	 
	 
	
	if(fechaFin==null || fechaInicio==null){
		alert("Ingresar fechas válidas")
	}else{
		

	
	var cursoObj={
			id:cursoPsicologiaId, 
			titulo:nombre, 
			descripcion:descripcion,
			responsable:responsable,
			fechaInicio:fechaInicio,
			fechaFin:fechaFin, 
			estado:estadoCurso, 
	examenPsicologia:{id:listaObj.id}
	}
	
	callAjaxPost(URL + '/psicologia/curso/save', cursoObj,
			function(data) {
				
		guardarEvidenciaAuto(data.nuevoId,"fileEviCurso"+cursoPsicologiaId
				,bitsEvidenciaCurso,"/psicologia/curso/evidencia/save",
				llamarCursosPsicologia); 
			 
				
			});
	
	
	}
	
	
	
	
	
}

function eliminarCurso(){
	var cursoObj={
			id:cursoPsicologiaId
	}
	var r=confirm("¿Está seguro de eliminar este curso?");
	if(r){
		callAjaxPost(URL + '/psicologia/curso/delete', cursoObj,
				function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				llamarCursosPsicologia();
				break;
			default:
				alert("Hay registro de trabajadores y/o recursos asociados");
			}
					
			
					
				});
	}
	
}
 

function volverCursoCapacitacion(){
	$(".modal-body").hide();
	$("#modalCurso").show();
	$("#mdCursoFecha .modal-title").html(capacitacionNombre+" > Cursos");
}


function verEvaluacionCurso(){
	
	$(".modal-body").hide();
	$("#modalEvaluadosCurso").show();
	
	$("#mdCursoFecha .modal-title").html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoPsicologiaEdicion.nombre+"'</a> > Evaluaciones");
	var dataParam={id:cursoPsicologiaId}
	callAjaxPost(URL + '/capacitacion/curso/trabajadores/evaluacion', dataParam, function(data) {
		
		var list = data.list; 
		$("#tblEvalsCurso tbody").html("");
		list.forEach(function(val,index){
			var textEliminarEval="<button onclick='deleteEvalTrabajador("+val.id+")'" +
			" class='btn btn-danger' style='padding: 3px 4px;'>" +
			"<i class='fa fa-times' style='color:white'>  </i></button>";
			var certificadoNombre="";
			if(val.evaluacionId==1){
				certificadoNombre=
					"<i onclick='javascript:descargarCertificadoCurso("+cursoPsicologiaId+","+val.trabajador.trabajadorId+")' " +
					"class='fa fa-certificate fa-2x aprobado-gosst' " +
					"title='Descargar Certificado'></i>" ;
			}
			$("#tblEvalsCurso tbody").append("<tr  >"+
					"<td>"+textEliminarEval + "</td>" +
					"<td>"+val.trabajador.puesto.matrixName + "</td>" +
					"<td>"+val.trabajador.puesto.divisionName  + "</td>" +
					"<td>"+val.trabajador.puesto.areaName  + "</td>" +
					"<td>"+val.trabajador.puesto.nombre + "</td>" +
					"<td>"+val.trabajador.trabajadorNombre + "</td>" +
					"<td>"+val.fechaRealizadaTexto + "</td>" +
					"<td>"+val.evaluacionNombre + "</td>" +
					"<td>"+ val.puntajeAlcanzadoTexto + "</td>" +
					"<td>"+val.nivelSencillo + "</td>" +
					"<td>"+val.nivelClaro+ "</td>" +
					"<td>"+val.nivelImpacto+ "</td>" +
					"<td>"+val.rating+ "</td>" +
					"<td>"+val.sugerencia+ "</td>" +
					"<td>"+certificadoNombre + "</td>" +
				"</tr>")
		});
	
		formatoCeldaSombreableTabla(true,"tblObjCurso");
	
});
}
function deleteEvalTrabajador(evaltrabajadorId){
	var t=confirm("¿Está seguro de eliminar esta evaluación?");
	if(t){
		var trabObj={id:evaltrabajadorId};
		callAjaxPostNoLoad(URL + '/capacitacion/curso/trabajadores/evaluacion/delete', trabObj, function(data) {
			verEvaluacionCurso();
		});	
	}
	
}

function hallarEstadoCurso(){
	
	
	var fechaInicio=$("#inputCurFechaInicio").val();
	var fechaFin=$("#inputCurFechaFin").val();
var hoyDia=obtenerFechaActual();
	
	var difInicio= restaFechas(hoyDia,fechaInicio);
	var difFinal= restaFechas(hoyDia,fechaFin);
	if(difInicio>0){
		estadoCurso={id:"1",nombre:"Pendiente"};
	}else{
		if(difFinal>0){
			estadoCurso={id:"2",nombre:"En Curso"};
		}else{
			estadoCurso={id:"3",nombre:"Completado"};
		}
	}
	$("#curEst"+cursoPsicologiaId).html(estadoCurso.nombre);
	
	
}	

var evaluacionDetalle;
var evaluacionResumen;
var evalaucionEscalas;
var evaluacionCategorias;
var evaluacionPreguntas;
var opcionesIndicadoresEvaluacion=[
                                //   {id:"1",nombre:"Análisis por respuestas"},
                                 //  {id:"2",nombre:"Análisis por categoría de respuestas"},
                                   {id:"3",nombre:"Análisis por categoría y escalas"},
                                   {id:"4",nombre:"Gráfico porcentual categoría y escalas"},
                                   {id:"5",nombre:"Gráfico comparativo categoría y escalas"}]

function verEvaluadosCurso(){
   $("#divGeneralPsicologia .container-fluid").hide();
   $("#divGeneralPsicologia #divContainEvaluacionCursos").show();
   $( "h2").html("<a onclick='volverListas()'>"+listaObj.nombre+"</a> > " +
		 "<a onclick='volverCursosPsicologia()'> Programación "+cursoPsicologiaEdicion.titulo+"</a> >" +
		 "Evaluaciones");

   $("#tblResumenCurso thead tr").html("cargando");
   $("#tblResumenCurso tbody tr").remove();
	
   cursoPsicologiaEdicion.examenPsicologia = {id: listaObj.id};
	
   callAjaxPost(URL+'/psicologia/curso/indicadores',cursoPsicologiaEdicion,function(data){
      evaluacionDetalle = data.evalTrabajadores;
      evaluacionResumen = data.resumTrabajadores;
      evalaucionEscalas = data.escalas;
      evaluacionCategorias = data.categorias;
      evaluacionPreguntas = data.preguntas;
		
      var selTipoIndicadorEval = crearSelectOneMenuOblig("selTipoIndicadorEval","verAcordeIndicadorEvaluacion()",
	 opcionesIndicadoresEvaluacion,"","id","nombre");
      
      var buttonClip =
	 "<button id='buttonClipIndicador' style='float:left' class='btn btn-success'>" +
	    "<i aria-hidden='true' class='fa fa-clipboard'></i> Clipboard" +
	 "</button>";
		 
      $("#containSelIndicador").html(buttonClip+selTipoIndicadorEval);
      $("#selTipoIndicadorEval").css({"width":"auto"});
		 
      $("#buttonClipIndicador").on("click",function(){
         var texto = obtenerDatosTablaEstandarNoFija("tblResumenCurso");
				 
         copiarAlPortapapeles(texto,"buttonClipIndicador");
         alert("Se han guardado al clipboard la tabla " ); 
      });
		 
      verAcordeIndicadorEvaluacion();
   });
}

function verAcordeIndicadorEvaluacion(){
	var indicadorId=$("#selTipoIndicadorEval").val();console.log(indicadorId);
	$("#tblResumenCurso thead tr").html("cargando");
	$("#tblResumenCurso tbody tr").remove();
	$("#divContainEvaluacionCursos #graficoResumenPsicologia").html("");
	$("#divContainEvaluacionCursos .table-responsive").hide();
	switch(parseInt(indicadorId)){
	case 1:
		$("#divContainEvaluacionCursos .table-responsive").show();
		evaluacionDetalle.forEach(function(val,index){
			$("#tblResumenCurso tbody").append("<tr id='trrestrab"+val.trabajadorId+"' >" +
					"<td>"+val.trabajadorNombre+"</td>" +
					"<td>"+val.puesto.positionName+"</td>"+
					"</tr>")
		});
		
		$("#tblResumenCurso thead tr").html("<td style='width:210px'>Trabajador</td><td>Puesto de trabajo</td>");
		evaluacionPreguntas.forEach(function(val,index){
			$("#tblResumenCurso thead tr").append("" +
					"<td>"+(index+1)+"</td>")
			$("#tblResumenCurso tbody tr").append("" +
					"<td id='trrespre"+val.id+"'>"+0+"</td>")
		});
		evaluacionDetalle.forEach(function(val,index){
			val.respuestasCursoPsicologia.forEach(function(val1,index1){
				$("#tblResumenCurso tbody").find("#trrestrab"+val.trabajadorId+" #trrespre" +val1.pregunta.id)
				.html(val1.valorizacion.valor)
			}); 
		});
		break;
	case 2:
		$("#divContainEvaluacionCursos .table-responsive").show();
		evaluacionDetalle.forEach(function(val,index){
			$("#tblResumenCurso tbody").append("<tr id='trrestrab"+val.trabajadorId+"' >" +
					"<td>"+val.trabajadorNombre+"</td>" +
					"<td>"+val.puesto.positionName+"</td>"+
					"</tr>")
		});
		
		$("#tblResumenCurso thead tr").html("<td style='width:210px'>Trabajador</td><td>Puesto de trabajo</td>");
		evaluacionCategorias.forEach(function(val,index){
			$("#tblResumenCurso thead tr").append("" +
					"<td>"+val.nombre+"</td>" +
							"<td>"+"Nivel"+"</td>")
			$("#tblResumenCurso tbody tr").append("" +
					"<td id='trrescat"+val.id+"'>"+0+"</td>" +
							"<td id='trresniv"+val.id+"'>"+"---"+"</td>")
		});
		evaluacionResumen.forEach(function(val,index){
			val.categoriasResumen.forEach(function(val1,index1){
				$("#tblResumenCurso tbody").find("#trrestrab"+val.trabajadorId+" #trrescat" +val1.id)
				.html(val1.valorizacion.sumaValor)
				$("#tblResumenCurso tbody").find("#trrestrab"+val.trabajadorId+" #trresniv" +val1.id)
				.html(val1.valorizacion.escala.nombre)
			}); 
		});
		break;
	case 3:
		$("#divContainEvaluacionCursos .table-responsive").show();
		$("#tblResumenCurso thead tr").html("<td style='width:210px'>Categoría </td> ");
		
		evaluacionCategorias.forEach(function(val,index){
			$("#tblResumenCurso tbody").append("<tr id='trrescat"+val.id+"' >" +
					"<td>"+val.nombre+"</td>" + 
					"</tr>")
		});
		
			
			evalaucionEscalas.forEach(function(val,index){
				$("#tblResumenCurso thead tr").append("" +
						"<td>"+val.nombre+"</td>" )
				$("#tblResumenCurso tbody tr").append("" +
								"<td id='trresniv"+val.id+"'>"+"0"+"</td>");
				val.categoriasAsociadas=evaluacionCategorias;
				val.categoriasAsociadas.forEach(function(val1,index1){
					val1.numTrabajadores=0;
					evaluacionResumen.forEach(function(val2,index2){
						val2.categoriasResumen.forEach(function(val3,index3){
							if(val3.id==val1.id && val3.valorizacion.escala.id==val.id){
								val1.numTrabajadores++;
							}
						})
					});
					$("#trrescat"+val1.id+" #trresniv"+val.id).html(val1.numTrabajadores);
					
				});
		});
		break;
	case 4:
		var arrayCategorias=listarStringsDesdeArray(evaluacionCategorias,"nombre");
		var seriesCategoria=[];
		evalaucionEscalas.forEach(function(val,index){
			var arrayData=[];
			val.categoriasAsociadas=evaluacionCategorias;
			val.categoriasAsociadas.forEach(function(val1,index1){
				val1.numTrabajadores=0;
				evaluacionResumen.forEach(function(val2,index2){
					val2.categoriasResumen.forEach(function(val3,index3){
						if(val3.id==val1.id && val3.valorizacion.escala.id==val.id){
							val1.numTrabajadores++;
						}
					})
					
				}); 
				arrayData.push(val1.numTrabajadores);
			});
			seriesCategoria.push({name:val.nombre,data:arrayData});
			
		});
		
		Highcharts.chart('graficoResumenPsicologia', {
    chart: {
        type: 'column'
    },
    colors: ["#253d37","#3b7d6c","#7bd9c1","#b8f3e4","#848988","#b8baba","#d3d7d7"],
    title: {
        text: 'Resumen de resultados de evaluación "'+cursoPsicologiaEdicion.titulo+'" '
    },
    xAxis: {
        categories: arrayCategorias
    },
    yAxis: {
        min: 0,
        title: {
            text: '# trabajadores'
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
    },
    plotOptions: {
        column: {
            stacking: 'percent'
        }
    },
    series: seriesCategoria
});
		
		break;
	case 5:
		var arrayCategorias=listarStringsDesdeArray(evaluacionCategorias,"nombre");
		var seriesCategoria=[];
		evalaucionEscalas.forEach(function(val,index){
			var arrayData=[];
			val.categoriasAsociadas=evaluacionCategorias;
			val.categoriasAsociadas.forEach(function(val1,index1){
				val1.numTrabajadores=0;
				evaluacionResumen.forEach(function(val2,index2){
					val2.categoriasResumen.forEach(function(val3,index3){
						if(val3.id==val1.id && val3.valorizacion.escala.id==val.id){
							val1.numTrabajadores++;
						}
					})
					
				}); 
				arrayData.push(val1.numTrabajadores);
			});
			seriesCategoria.push({name:val.nombre,data:arrayData});
			
		});
		
		Highcharts.chart('graficoResumenPsicologia', {
    chart: {
        type: 'column'
    },
    colors: ["#253d37","#3b7d6c","#7bd9c1","#b8f3e4","#848988","#b8baba","#d3d7d7"],
    title: {
        text: 'Resumen de resultados de evaluación "'+cursoPsicologiaEdicion.titulo+'" '
    },
    xAxis: {
        categories: arrayCategorias
    },
    yAxis: {
        min: 0,
        title: {
            text: '# trabajadores'
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        shared: true
    },
    plotOptions: {
      
    },
    series: seriesCategoria
});
		
		break;
	}
}

