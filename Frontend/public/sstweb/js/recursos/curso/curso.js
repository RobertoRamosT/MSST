/**
 * 
 */
var listaFullCursosCap,listPregCategorias = [];
var cursoCapacitacionId;
var banderaEdicionCurso;
var estadoCurso;
var cursoCapacitacionEdicion;
var mensajeUx;
//var countTblCursos = 0;

function programarCurso(){
   $("#mdCursoFecha").modal("show");
   $("#mdCursoFecha .modal-title").html(capacitacionNombre+" > Cursos");
   $(".modal-body").hide();
   $("#modalCurso").show();
   $("#btnGenReporteOnline").hide();
   $("#btnGenReporteNormal").hide();
   $("#btnGenCertificadosOnline").hide();
		
   $("#btnAgregarCurso").attr("onclick","nuevoCurso()");
   $("#btnCancelarCurso").attr("onclick","cancelarCursoCapacitacion()");
   $("#btnEliminarCurso").attr("onclick","eliminarCurso()");
   $("#btnGuardarCurso").attr("onclick","guardarCurso()");
   $("#btnSmartCurso").attr("onclick","verCursosSugeridos()");
   $("#btnGenReporteOnline").attr("onclick","javascript:generarReporteCurso();");
   $("#btnGenReporteNormal").attr("onclick","javascript:generarReporteCursoNormal();");
   $("#btnGenCertificadosOnline").attr("onclick","javascript:generarCertificadosCurso();");
	
   llamarCursosFormacion();
}

function generarCertificadosCurso(){
   window.open(URL+"/capacitacion/curso/certificados?cursoId="+cursoCapacitacionId,'_blank');	
}

function generarReporteCursoNormal(){
   window.open(URL+"/capacitacion/informe?progcapacitacionId="+cursoCapacitacionId,'_blank');	
}

function generarReporteCurso(){
   window.open(URL+"/capacitacion/online/informe?id="+cursoCapacitacionId,'_blank');	
}

function cancelarCursoCapacitacion(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
   llamarCursosFormacion();
}

function llamarCursosFormacion(){
   $("#btnCancelarCurso").hide();$("#btnGuardarCurso").hide();$("#btnEvaluarCurso").hide();
   $("#btnEliminarCurso").hide();$("#btnClonarCurso").hide();$("#btnAgregarCurso").show();
   $("#btnClipTablaCurso").show();$("#btnSmartCurso").show();$("#btnGenReporteOnline").hide();
   $("#btnGenReporteNormal").hide();$("#btnGenCertificadosOnline").hide();$("#btnImportTrabajadoresCurso").hide();
    $("#btnGenReporteExcelCurso").hide();

   
   resizeDivWrapper("wrapperCursoReg",200);
	
   cursoCapacitacionId = 0;banderaEdicionCurso = false;
   estadoCurso = {id:1,nombre:"Por implementar"};
   
   listPuestosAsignadosIdAux=[],listTrabAgregadosIdAux=[],listTrabExoneradosIdAux=[],
   listTrabGrupoSeguridadIdAux=[],listCursosVigentesIdAux=[]; 

   if(capacitacionObj.listPuestosAsignadosId.length != 0){
      var puestosAsignadosId = capacitacionObj.listPuestosAsignadosId.split(","); 
   
      puestosAsignadosId.forEach(function(val){
 	 listPuestosAsignadosIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listTrabAgregadosId.length != 0){
      var trabAgregadosId = capacitacionObj.listTrabAgregadosId.split(","); 
   
      trabAgregadosId.forEach(function(val){
	 listTrabAgregadosIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listTrabExoneradosId.length != 0){
      var trabExoneradosId = capacitacionObj.listTrabExoneradosId.split(","); 
   
      trabExoneradosId.forEach(function(val){
	 listTrabExoneradosIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listTrabGrupoSeguridadId.length != 0){
      var trabGrupoSeguridadId = capacitacionObj.listTrabGrupoSeguridadId.split(","); 
   
      trabGrupoSeguridadId.forEach(function(val){
	 listTrabGrupoSeguridadIdAux.push(parseInt(val));
      });
   }

   var dataParam={
      capacitacionId:capacitacionId,
      listPuestosAsignadosIdAux:(listPuestosAsignadosIdAux.length == 0?null:listPuestosAsignadosIdAux),
      listTrabAgregadosIdAux:(listTrabAgregadosIdAux.length == 0?null:listTrabAgregadosIdAux),
      listTrabExoneradosIdAux:(listTrabExoneradosIdAux.length == 0?null:listTrabExoneradosIdAux),
      listTrabGrupoSeguridadIdAux:(listTrabGrupoSeguridadIdAux.length == 0?null:listTrabGrupoSeguridadIdAux)
   };
        
   callAjaxPost(URL+'/capacitacion/cursos',dataParam,function(data){
      listaFullCursosCap = data.list;listPregCategorias = data.listPregCategoria;
			
      $("#tblCurso tbody").html("");
      
      listaFullCursosCap.forEach(function(val,index){
	 var enlaceInfoGeneral = (val.enlaceInfoGeneral == ""?"------":val.enlaceInfoGeneral);
	  
         $("#tblCurso tbody").append(
            "<tr id='trCursoReg"+val.id+"' onclick='javascript:editarCurso("+index+")'>" +
               "<td id='curNom"+val.id+"'>"+val.nombre+"</td>" +
               "<td id='curDesc"+val.id+"'>"+val.descripcion+"</td>" +
               "<td id='curEnlInfGen"+val.id+"'>"+enlaceInfoGeneral+"</td>" +
	       "<td id='curObj"+val.id+"'>"+val.numObjetivos+"</td>" +
	       "<td id='curFechaInicio"+val.id+"'>"+val.fechaInicioTexto+"</td>" +
	       "<td id='curFechaFin"+val.id+"'>"+val.fechaFinTexto+"</td>" +
	       "<td id='curProfe"+val.id+"'>"+val.profesor.nombre+"</td>" +
	       "<td id='curRepreA"+val.id+"'>"+val.representanteA.nombre+"</td>" +
	       "<td id='curRepreB"+val.id+"'>"+val.representanteB.nombre+"</td>" +
	       "<td id='curEvi"+val.id+"'>"+val.evidenciaNombre+"</td>" +
	       "<td id='curArch"+val.id+"'>"+val.numArchivos+"</td>" +
	       "<td id='curEnl"+val.id+"'>"+val.numEnlaces+"</td>" +
	       "<td id='curPre"+val.id+"'>"+val.preguntas.length+"</td>" +
	       "<td id='curPregOblig"+val.id+"'>"+val.numPreguntas+"</td>" +
	       "<td id='curAsoc"+val.id+"'>"+val.numRelacionados+"</td>" +
	       "<td id='curTiem"+val.id+"'>"+val.tiempoSolucion+"</td>" +
	       "<td id='curPunt"+val.id+"'>"+val.puntajeMinimo+"</td>" +
	       "<td id='curWant"+val.id+"'>"+(val.wantsCertificado == 1?"Si":"No")+"</td>" +
	       "<td id='curOculto"+val.id+"'>"+(val.isOculto == 1?"Si":"No")+"</td>" +
	       "<td id='curAprob"+val.id+"'>"+val.numAprobados+" / "+val.numEvaluado+"</td>" +
	       "<td id='curEst"+val.id+"'>"+val.estado.nombre+"</td>" +
	       "<td id='curNotAvg"+val.id+"'>"+pasarDecimalValor(val.notaPromedio)+"</td>" +
	       "<td id='curRatA"+val.id+"'>"+pasarDecimalValor(val.nivelSencilloPromedio)+"</td>" +
	       "<td id='curRatB"+val.id+"'>"+pasarDecimalValor(val.nivelClaridadPromedio)+"</td>" +
	       "<td id='curRatC"+val.id+"'>"+pasarDecimalValor(val.nivelImpactoPromedio)+"</td>" +
	       "<td id='curRatD"+val.id+"'>"+pasarDecimalValor(val.ratingPromedio)+"</td>" +
	    "</tr>");
      });
   	
      if(getSession("linkCalendarioProgCursoId") != null){
         var indexIpercAux = 0;
				
         listaFullCursosCap.every(function(val,index3){
	    if(val.id == parseInt(getSession("linkCalendarioProgCursoId"))){
	       editarCurso(index3);
	       sessionStorage.removeItem("linkCalendarioProgCursoId");
	       return false;
	    }else{
	       return true;
	    }
         });
      }
//    resizeDivGosst("progCursosDiv",220);
//      goheadfixedY("#tblCurso","#wrapperCursoReg");
      
//      if(countTblCursos == 0){
//         countTblCursos++;
//         $("#wrapperCursoReg").css({"height":$(window).height()-220+"px"})
//         goheadfixedY("#tblCurso","#wrapperCursoReg");
//      }
      
      formatoCeldaSombreableTabla(true,"tblCurso");
      $.unblockUI();
   });
}

function editarCurso(pindex){
   if(!banderaEdicionCurso){
      banderaEdicionCurso = true;
		
      $("#btnCancelarCurso").show();$("#btnGuardarCurso").show();$("#btnEvaluarCurso").hide();
      $("#btnEliminarCurso").show();$("#btnAgregarCurso").hide();$("#btnGenReporteOnline").show();
      $("#btnGenReporteNormal").show();$("#btnGenCertificadosOnline").show();$("#btnClonarCurso").show();
      $("#btnClipTablaCurso").hide();$("#btnSmartCurso").hide();$("#btnImportTrabajadoresCurso").show();
       $("#btnGenReporteExcelCurso").show();
		
      formatoCeldaSombreableTabla(false,"tblCurso");
	
      cursoCapacitacionId = listaFullCursosCap[pindex].id;
      cursoCapacitacionEdicion = listaFullCursosCap[pindex];
	
      $("#trCursoReg"+cursoCapacitacionId).addClass("fila-edicion");
	
      var nombre = listaFullCursosCap[pindex].nombre;
      var desc = listaFullCursosCap[pindex].descripcion;
      var textObj = $("#curObj"+cursoCapacitacionId).text();
      var textArch = $("#curArch"+cursoCapacitacionId).text();
      var textEnl = $("#curEnl"+cursoCapacitacionId).text();
      var textAprob = $("#curAprob"+cursoCapacitacionId).text();
      var textAsociado = $("#curAsoc"+cursoCapacitacionId).text();
      var nombreEvidencia = $("#curEvi"+cursoCapacitacionId).text();
      var fechaI = convertirFechaInput(listaFullCursosCap[pindex].fechaInicio);
      var fechaF = convertirFechaInput(listaFullCursosCap[pindex].fechaFin);
      var tiempo = listaFullCursosCap[pindex].tiempoSolucion;
      var puntaje = listaFullCursosCap[pindex].puntajeMinimo;
      var textOblig = listaFullCursosCap[pindex].numPreguntas;
	
      $("#curNom"+cursoCapacitacionId).html("<input class='form-control' id='inputCurNom'>");
      $("#curDesc"+cursoCapacitacionId).html("<input class='form-control' id='inputCurDesc'>");
      $("#curEnlInfGen"+cursoCapacitacionId).html("<input class='form-control' id='inputCurEnlaceInfoGeneral'>");
	
      $("#curObj"+cursoCapacitacionId).addClass("linkGosst")
      .on("click",function(){verObjetivosCurso();})
      .html("<i class='fa fa-star fa-2x' aria-hidden='true'></i>"+textObj);
	
      $("#curFechaInicio"+cursoCapacitacionId)
      .html("<input class='form-control' onchange='hallarEstadoCurso("+cursoCapacitacionId+")' id='inputCurFechaInicio' type='date'>");
      $("#curFechaFin"+cursoCapacitacionId)
      .html("<input class='form-control' onchange='hallarEstadoCurso("+cursoCapacitacionId+")' id='inputCurFechaFin' type='date'>");

      $("#curEvi" + cursoCapacitacionId)
      .html("<a id='linkEvidencia' href='"+URL+"/capacitacion/programacion/evidencia?programacionCapId="+cursoCapacitacionId+"' target='_blank' >" +
	        nombreEvidencia +
	    "</a><br/>" +
      	    "<a id='linkEvidencia' href='#' onclick='javascript:editarEvidenciaCurso();'>Subir</a>");
	
      $("#curArch"+cursoCapacitacionId).addClass("linkGosst")
      .on("click",function(){verArchivosCurso();})
      .html("<i class='fa fa-file-text fa-2x' aria-hidden='true'></i>"+textArch);
	
      $("#curEnl"+cursoCapacitacionId).addClass("linkGosst")
      .on("click",function(){verEnlacesCurso();})
      .html("<i class='fa fa-external-link fa-2x' aria-hidden='true'></i>"+textEnl);
	
      $("#curPre"+cursoCapacitacionId).addClass("linkGosst").on("click",function(){verPreguntasCurso();})
      .html(cursoCapacitacionEdicion.preguntas.length+"<br><i class='fa fa-list-alt fa-2x' aria-hidden='true'></i>");
      
      $("#curPregOblig"+cursoCapacitacionId).addClass("linkGosst").on("click",function(){registroNumeroPreguntasExamenCurso();})
      .html(cursoCapacitacionEdicion.numPreguntas+"<br><i class='fa fa-info-circle fa-2x' aria-hidden='true'></i>");
	
      $("#curAprob"+cursoCapacitacionId).addClass("linkGosst")
      .on("click",function(){verEvaluacionCurso();})
      .html("<i class='fa fa-check-square fa-2x' aria-hidden='true'></i>"+textAprob);
	
      $("#curAsoc"+cursoCapacitacionId).addClass("linkGosst")
      .on("click",function(){verRelacionadosTrabajador();})
      .html("<i class='fa fa-check-square fa-2x' aria-hidden='true'></i>"+textAsociado); 
	
      $("#curTiem"+cursoCapacitacionId).html("<input class='form-control' id='inputCurTiem' type='number'>");
      $("#curPunt"+cursoCapacitacionId)
      .html("<input class='form-control' id='inputCurPunt' type='number' onkeyup='return comprobarPorcentaje(event)'>");
      
//      $("#curPregOblig"+cursoCapacitacionId).html("<input class='form-control' id='inputCurPuntOblig' type='number'>");
//
      var profeId = listaFullCursosCap[pindex].profesor.id;
      var selProfesorCurso = crearSelectOneMenuOblig("selProfesorCurso","",
	     listProfesor,profeId,"id","nombre");
	
      $("#curProfe"+cursoCapacitacionId).html(selProfesorCurso);
//
      var repAid = listaFullCursosCap[pindex].representanteA.id;
      var selProfesorCursoA = crearSelectOneMenu("selProfesorCursoA","",
	     listProfesor,repAid,"id","nombre","Sin Representante 1");
	
      $("#curRepreA"+cursoCapacitacionId).html(selProfesorCursoA);
//
      var repBid = listaFullCursosCap[pindex].representanteB.id;
      var selProfesorCursoB = crearSelectOneMenu("selProfesorCursoB","",
	     listProfesor,repBid,"id","nombre","Sin Representante 2");
	
      $("#curRepreB"+cursoCapacitacionId).html(selProfesorCursoB);
//
      var wantsCertificado = (listaFullCursosCap[pindex].wantsCertificado == 1);
      $("#curWant"+cursoCapacitacionId).html("<input class='form-control' id='checkCertificado' type='checkbox'>");
//
      var isOculto = (listaFullCursosCap[pindex].isOculto == 1);
      $("#curOculto"+cursoCapacitacionId).html("<input class='form-control' id='checkOculto' type='checkbox'>");
	
      $("#inputCurNom").val(nombre);
      $("#inputCurDesc").val(desc);
      $("#inputCurEnlaceInfoGeneral").val(listaFullCursosCap[pindex].enlaceInfoGeneral);
      $("#inputCurFechaInicio").val(fechaI);
      $("#inputCurFechaFin").val(fechaF);
      $("#inputCurTiem").val(tiempo);
      $("#inputCurPunt").val(puntaje);
//      $("#inputCurPuntOblig").val(textOblig);
      $("#checkCertificado").prop("checked",wantsCertificado)
      $("#checkOculto").prop("checked",isOculto)
	
      hallarEstadoCurso();
   }
}

function nuevoCurso(){
   if(!banderaEdicionCurso){
      $("#btnCancelarCurso").show();$("#btnGuardarCurso").show();$("#btnEvaluarCurso").hide();
      $("#btnEliminarCurso").hide();$("#btnAgregarCurso").hide();$("#btnClipTablaCurso").hide();
      $("#btnSmartCurso").hide();$("#btnImportTrabajadoresCurso").hide();
      $("#btnGenReporteExcelCurso").hide();
		
      var selProfesorCurso = crearSelectOneMenuOblig("selProfesorCurso","",
	     listProfesor,"","id","nombre");
		
      var selProfesorCursoA = crearSelectOneMenu("selProfesorCursoA","",
	     listProfesor,"","id","nombre","Sin Representante 1");
      
      var selProfesorCursoB = crearSelectOneMenu("selProfesorCursoB","",
	     listProfesor,"","id","nombre","Sin Representante 2");
		
      cursoCapacitacionId = 0;
		
      $("#tblCurso tbody")
      .append("<tr id='tr0'>" +
	         "<td><input class='form-control' id='inputCurNom'></td>" +
	         "<td><input class='form-control' id='inputCurDesc'></td>" +
	         "<td><input class='form-control' id='inputCurEnlaceInfoGeneral'></td>" +
	         "<td>...</td>" +
	         "<td><input class='form-control' id='inputCurFechaInicio' " +
	        	    "onchange='hallarEstadoCurso("+cursoCapacitacionId+")' type='date'></td>" +
	         "<td><input class='form-control' id='inputCurFechaFin' " +
	        	    "onchange='hallarEstadoCurso("+cursoCapacitacionId+")' type='date'></td>" +
	         "<td>"+selProfesorCurso+"</td>" +
	         "<td>"+selProfesorCursoA+"</td>" +
		 "<td>"+selProfesorCursoB+"</td>" +
		 "<td>...</td>" +
		 "<td>...</td>" +
		 "<td>...</td>" + 
		 "<td>...</td>" +
		 "<td>...</td>" +
		 "<td>...</td>" +
		 "<td><input class='form-control' id='inputCurTiem' type='number'></td>" +
		 "<td><input class='form-control' id='inputCurPunt' type='number' " +
			    "onkeyup='return comprobarPorcentaje(event)'></td>" +
		 "<td><input class='form-control' id='checkCertificado' type='checkbox'></td>" +
		 "<td><input class='form-control' id='checkOculto' type='checkbox'></td>" +
		 "<td>...</td>" +
		 "<td id='curEst0'></td>" +
		 "<td>...</td>" +
		 "<td>...</td>" +
		 "<td>...</td>" +
		 "<td>...</td>" +
		 "<td>...</td>" +
	      "</tr>");
		
      formatoCeldaSombreableTabla(false,"tblCurso");
      banderaEdicionCurso = true;
   }else{
      alert("Guarde primero.");
   }
}

function guardarCurso(){
   var nombre = $("#inputCurNom").val();
   var descripcion = $("#inputCurDesc").val();
   var enlaceInfoGeneral = $("#inputCurEnlaceInfoGeneral").val();
   var fechaInicio = convertirFechaTexto($("#inputCurFechaInicio").val());
   var fechaFin = convertirFechaTexto($("#inputCurFechaFin").val());
   var tiempo = parseFloat($("#inputCurTiem").val());
   var puntaje = parseFloat($("#inputCurPunt").val());
   var profeId = $("#selProfesorCurso").val();
   var profeAId = $("#selProfesorCursoA").val();
   var profeBId = $("#selProfesorCursoB").val();
   var wantsCertificado = $("#checkCertificado").prop("checked");
   var isOculto = $("#checkOculto").prop("checked");
//   var numPreguntas = $("#inputCurPuntOblig").val();
	
   if(fechaFin == null || fechaInicio == null){
      alert("Ingresar fechas válidas");
   }else{
      var cursoObj={
	 id: cursoCapacitacionId,
	 wantsCertificado: (wantsCertificado?1:0),
	 isOculto: (isOculto?1:0),
	 nombre: nombre,
//	 numPreguntas: numPreguntas,
	 descripcion: descripcion,
	 enlaceInfoGeneral: enlaceInfoGeneral,
	 fechaInicio: fechaInicio,
	 fechaFin: fechaFin,
	 tiempoSolucion: tiempo,
	 puntajeMinimo: puntaje,
	 estado: estadoCurso,
	 profesor: {id: profeId},
	 representanteA: {id: (profeAId == "-1"?null:profeAId)},
	 representanteB: {id: (profeBId == "-1"?null:profeBId)},
	 capacitacionId: capacitacionId
      };
      
      callAjaxPost(URL+'/capacitacion/curso/save',cursoObj,function(data){
         llamarCursosFormacion();
      });
   }
}

function eliminarCurso(){
   var cursoObj={
	  id:cursoCapacitacionId
	        }
   
   var r = confirm("¿Está seguro de eliminar este curso?");
	
   if(r){
      callAjaxPost(URL+'/capacitacion/curso/delete',cursoObj,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
	       llamarCursosFormacion();
	       break;
			
            default:
	       alert("Hay registro de trabajadores y/o recursos asociados");
         }
      });
   }	
}

function editarEvidenciaCurso(){
   $(".modal-body").hide();
   $("#modalUploadCurso").show();
}

function cancelarUploadEvidenciaCurso(){
   $(".modal-body").hide();
   $("#modalCurso").show();
}

function uploadEvidenciaCurso(){
   guardarEvidenciaAuto(cursoCapacitacionId,"fileEviCurso",bitsEvidenciaCurso,
      "/capacitacion/programacion/evidencia/save",function(){
         $.unblockUI();
         var inputFileImage = document.getElementById("fileEviCurso");
         var file = inputFileImage.files[0];
		
         $("#curEvi"+cursoCapacitacionId).html(file.name);
         $(".modal-body").hide();
         $("#modalCurso").show();
      },"programacionCapId");
}

function verArchivosCurso(){
   $(".modal-body").hide();
   $("#modalArchivosCurso").show();
   $("#mdCursoFecha .modal-title")
   .html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> " +
   		                               "> Archivos");
	
   $("#btnAgregarArchivo").attr("onclick","nuevoArchivo()");
   $("#btnCancelarArchivo").attr("onclick","llamarArchivosCurso()");
   $("#btnEliminarArchivo").attr("onclick","eliminarArchivo()");
   $("#btnGuardarArchivo").attr("onclick","guardarArchivo()");
   llamarArchivosCurso();
}
 
function verEnlacesCurso(){
   $(".modal-body").hide();
   $("#modalEnlacesCurso").show();
   $("#mdCursoFecha .modal-title")
   .html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> " +
   		                               "> Enlaces");
	
   $("#btnAgregarEnlace").attr("onclick","nuevoEnlace()");
   $("#btnCancelarEnlace").attr("onclick","llamarEnlacesCurso()");
   $("#btnEliminarEnlace").attr("onclick","eliminarEnlace()");
   $("#btnGuardarEnlace").attr("onclick","guardarEnlace()");
   llamarEnlacesCurso();
}

function verPreguntasCurso(){
   $(".modal-body").hide();
   $("#modalPreguntasCurso").show();
   $("#mdCursoFecha .modal-title")
   .html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> " +
   		                               "> Preguntas");
	
   $("#btnAgregarPregunta").attr("onclick","nuevoPregunta()");
   $("#btnCancelarPregunta").attr("onclick","llamarPreguntasCurso()");
   $("#btnEliminarPregunta").attr("onclick","eliminarPregunta()");
   $("#btnGuardarPregunta").attr("onclick","guardarPregunta()");
   llamarPreguntasCurso();
}

function verObjetivosCurso(){
   $(".modal-body").hide();
   $("#modalObjetivosCurso").show();
   $("#mdCursoFecha .modal-title")
   .html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> " +
   		                               "> Objetivos");
	
   $("#btnAgregarObjetivo").attr("onclick","nuevoObjetivo()");
   $("#btnCancelarObjetivo").attr("onclick","llamarObjetivosCurso()");
   $("#btnEliminarObjetivo").attr("onclick","eliminarObjetivo()");
   $("#btnGuardarObjetivo").attr("onclick","guardarObjetivo()");
   llamarObjetivosCurso();
}

function volverCursoCapacitacion(){
   $("#modalOpcionesPregunta").modal("hide");$('#mdCursoFecha').modal('show');$(".modal-body").hide();$("#modalCurso").show();
   $("#mdCursoFecha .modal-title").html(capacitacionNombre+" > Cursos");
}

var listEvaluacionCurso = [];

function verEvaluacionCurso(){
   $(".modal-body").hide();
   $("#modalEvaluadosCurso").show();	
   $("#mdCursoFecha .modal-title")
   .html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> " +
   		                               "> Evaluaciones");
   var dataParam={
	  id: cursoCapacitacionId
	         }
	
   callAjaxPost(URL+'/capacitacion/curso/trabajadores/evaluacion',dataParam,function(data){		
      listEvaluacionCurso = data.list;
	
      $("#tblEvalsCurso tbody").html("");
		
      listEvaluacionCurso.forEach(function(val,index){
         var textEliminarEval=
                "<button onclick='deleteEvalTrabajador("+val.id+")' class='btn btn-danger' style='padding: 3px 4px;'>" +
		   "<i class='fa fa-times' style='color:white'></i>" +
		"</button>";
			
         var certificadoNombre="";
			
         if(val.evaluacionId == 1){
	    certificadoNombre=
	       "<i onclick='javascript:descargarCertificadoCurso("+cursoCapacitacionId+","+val.trabajador.trabajadorId+")' " +
		  "class='fa fa-certificate fa-2x aprobado-gosst' title='Descargar Certificado'></i>" ;
         }
			
         $("#tblEvalsCurso tbody")
         .append("<tr>"+
		    "<td>"+textEliminarEval+"</td>" +
		    "<td>"+val.trabajador.puesto.matrixName+"</td>" +
		    "<td>"+val.trabajador.puesto.divisionName+"</td>" +
		    "<td>"+val.trabajador.puesto.areaName+"</td>" +
		    "<td>"+val.trabajador.puesto.nombre+"</td>" +
		    "<td>"+val.trabajador.trabajadorNombre+"</td>" +
		    "<td>"+val.fechaRealizadaTexto+"</td>" +
		    "<td>"+(val.numRespTrabCurso == 0?"------":
			    "<button type='button' class='btn btn-success' style='margin-right:10px' " +
			            "onclick='verRespuestaTrabajadorCurso("+index+")' " +
                                    "title='Ver las respuestas marcadas por el trabajador en este curso.'>" +
                               "<i class='fa fa-eye fa-2x'></i>" +
                            "</button>")+"</td>" +
		    "<td>"+val.evaluacionNombre+"</td>" +
		    "<td>"+val.puntajeAlcanzadoTexto+"</td>" +
		    "<td>"+val.nivelSencillo+"</td>" +
		    "<td>"+val.nivelClaro+"</td>" +
		    "<td>"+val.nivelImpacto+"</td>" +
		    "<td>"+val.rating+"</td>" +
		    "<td>"+val.sugerencia+"</td>" +
		    "<td>"+certificadoNombre+"</td>" +
		 "</tr>");
      });
		
      goheadfixedY('#tblEvalsCurso',"#wrapTrabEvalCurso");
   });
}

function volverRespTrabCursoCapacitacion(){
   $(".modal-body").hide();
   $("#modalEvaluadosCurso").show();	
   $("#mdCursoFecha .modal-title")
   .html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> " +
  		                               "> Evaluaciones");
}

function verRespuestaTrabajadorCurso(pindex){
   $(".modal-body").hide();
   $("#modalRespTrabCurso").show();	
   $("#mdCursoFecha .modal-title")
   .html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> > " +
    	 "<a onclick='volverRespTrabCursoCapacitacion()'>Evaluaciones </a> > "+
    	 "Respuestas última evaluación - Trabajador(a) "+listEvaluacionCurso[pindex].trabajador.trabajadorNombre);
   
   var dataParam={
	  progCapAsistId: parseInt(listEvaluacionCurso[pindex].id)
 	         }
 	
   callAjaxPost(URL+'/capacitacion/curso/trabajadores/respuesta',dataParam,function(data){		
      var listRespuestasTrab = data.listRespuestaTrab;
 	
      $("#tblRespTrabCurso tbody").html("");
 		
      listRespuestasTrab.forEach(function(val,index){
         $("#tblRespTrabCurso tbody")
         .append("<tr>"+
 		    "<td>"+val.pregunta.nombre+"</td>" +
 		    "<td>"+val.opcion.nombre+"</td>" +
 		    "<td><label style='color:"+(val.isCorrecto == 1?"blue":"red")+";'>"+
 		     (val.isCorrecto == 1?"Correcto":"Incorrecto")+"</label></td>" +
 		 "</tr>");
      });
 		
      goheadfixedY('#tblRespTrabCurso',"#wrapRespTrabCurso");
   });
}

function copiarTablaRespTrabCurso(){
   $("#mdCursoFecha").modal("hide");
    
   var list = obtenerDatosTablaEstandar("tblRespTrabCurso");
   copiarAlPortapapeles(list,"btnClipboardRespTrabCurso");
    
   mensajeUx="<label>Se han copiado todas las filas de la tabla " +
   	     "Respuestas última evaluación.</label>";
   
   mensajesUx(mensajeUx,1,"","ActVistaAdmRespTrabCurso");
   
   $("#modalMensajeUxActVistaAdmRespTrabCurso").on("hidden.bs.modal",function(){
      $("#mdCursoFecha").modal("show");    
   });
}

function deleteEvalTrabajador(evaltrabajadorId){
   var t = confirm("¿Está seguro de eliminar esta evaluación?");
	
   if(t){
      var trabObj={
	     id: evaltrabajadorId
	          };
		
      callAjaxPostNoLoad(URL+'/capacitacion/curso/trabajadores/evaluacion/delete',trabObj,function(data){
         verEvaluacionCurso();
      });	
   }	
}

function hallarEstadoCurso(){
   var fechaInicio = $("#inputCurFechaInicio").val();
   var fechaFin = $("#inputCurFechaFin").val();
   var hoyDia = getSession("fechaHoyOrdenInversoTexto"); /*obtenerFechaActual();*/
   var difInicio = restaFechas(hoyDia,fechaInicio);
   var difFinal = restaFechas(hoyDia,fechaFin);
   
   if(difInicio > 0){
      estadoCurso = {id:"1",nombre:"Pendiente"};
   }else{
      if(difFinal >= 0){
         estadoCurso = {id:"2",nombre:"En Curso"};
      }else{
	 estadoCurso = {id:"3",nombre:"Completado"};
      }
   }
	
   $("#curEst"+cursoCapacitacionId).html(estadoCurso.nombre);	
}

function ocultarValoresPreviosClonarCurso(){
   $("#modalClonarCursoCapOnline").modal("hide");
   $("#mdCursoFecha").modal("show");
}

function valoresPreviosClonarCurso(){
   $("#mdCursoFecha").modal("hide");
   $("#modalClonarCursoCapOnline").remove();
   var hoy = getSession("fechaHoyOrdenInversoTexto");
 
   var contenido ="";
   	    
   var listContenido = [];
   	
   var listContenido=[
   	  {sugerencia:"",label:"Fecha inicio",
   	   inputForm:"<input type='date' id='fechaInicioClonarCursoCapOnline' class='form-control'>"},
   	  {sugerencia:"",label:"Fecha fin",
   	   inputForm:"<input type='date' id='fechaFinClonarCursoCapOnline' class='form-control'>"},
   	  {sugerencia:"",label:"",inputForm:""}, 
   	  {sugerencia:"",
   	   label:"<button class='btn btn-danger' type='button' " +
   	   		 "onclick='ocultarValoresPreviosClonarCurso()'>" +
   	       	    "<i class='fa fa-times'></i> Cancelar" +
   	       	 "</button>",
   	   inputForm:"<button class='btn btn-success' style='float:right;' type='button' " +
   	   		     "onclick='clonarCursoSeleccionado()'>" +
   	                "<i class='fa fa-paper-plane'></i> Enviar" +
   	             "</button>"},
   	             ];
   	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloGeneral(val);
   });
   	
   var modalOptions={
   	  id: "modalClonarCursoCapOnline",
   	  nombre: "<i class='fa fa-filter'></i> Filtro - Copiar curso seleccionado <br>",
   	  contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   	            };
   	
   crearModalPrincipalUsuario(modalOptions,function(){},false);
       
   $("#fechaInicioClonarCursoCapOnline").val(hoy);
   $("#fechaFinClonarCursoCapOnline").val(sumaFechaDias(30,hoy));
      	
   $("#modalClonarCursoCapOnline").modal("show");
 }

function clonarCursoSeleccionado(){
   var campoVacio = true;
   
   var fechaInicioCurso = $("#fechaInicioClonarCursoCapOnline").val();
   var fechaFinCurso = $("#fechaFinClonarCursoCapOnline").val();
   
   var fechaInicioCursoClonar = convertirFechaTexto(fechaInicioCurso);
   var inputFechaInicioCursoClonar;
   
   if(!fechaInicioCursoClonar){  
      inputFechaInicioCursoClonar = null;
   }else{
      inputFechaInicioCursoClonar = fechaInicioCursoClonar;
   }
   
   var fechaFinCursoClonar = convertirFechaTexto(fechaFinCurso);
   var inputFechaFinCursoClonar;
   
   if(!fechaFinCursoClonar){  
      inputFechaFinCursoClonar = null;
   }else{
      inputFechaFinCursoClonar = fechaFinCursoClonar;
   }
   
   if(inputFechaInicioCursoClonar == null || 
      inputFechaFinCursoClonar == null){
      campoVacio = false;
   }
   
   if(campoVacio){
      var difInicio = restaFechas(getSession("fechaHoyOrdenInversoTexto"),fechaInicioCurso);
      var difFinal = restaFechas(getSession("fechaHoyOrdenInversoTexto"),fechaFinCurso);
      var estadoCursoAux;
	
      if(difInicio > 0){
         estadoCursoAux={
	    id:"1",
	    nombre:"Pendiente"
	                };
      }else{
         if(difFinal >= 0){
            estadoCursoAux={
               id:"2",
               nombre:"En Curso"
        	           };
         }else{
	    estadoCursoAux={
	       id:"3",
	       nombre:"Completado"
		           };
         }
      }
      
      var dataParamAux={
	     cursoId: cursoCapacitacionId,
	     fechaInicio: inputFechaInicioCursoClonar,
	     fechaFin: inputFechaFinCursoClonar,
	     estado: estadoCursoAux,
	     capacitacionId: capacitacionId
                       };
   
      callAjaxPost(URL+'/capacitacion/clonar_curso',dataParamAux,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               $("#modalClonarCursoCapOnline").modal("hide");
             
               mensajeUx = "<label>El curso ha sido copiado con éxito.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarVistaAdmCapOnline");
	    
               $("#modalMensajeUxActualizarVistaAdmCapOnline").on("hidden.bs.modal",function(){
	          $("#mdCursoFecha").modal("show");
	          llamarCursosFormacion();  
               });
	   
               break;
			
            default:
	       alert("Ocurrió un error al clonar el curso");
         }
      });
   }else{
      $("#modalClonarCursoCapOnline").modal("hide");
      
      mensajeUx="<label>Debe ingresar la información respectiva en los campos obligatorios.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposCloCurCapOnl");
       
      $("#modalMensajeUxAvisoCompletarCamposCloCurCapOnl").on("hidden.bs.modal",function(){
	 //$("#modalMensajeUxCompletarObligatorio").modal("hide");
	 $("#modalClonarCursoCapOnline").modal("show");    
      }); 
   }
}

function ocultarSmartImportTrabajadoresCurso(){
   $("#modalImportTrabCapOnline").modal("hide");$('#mdCursoFecha').modal("show");
}

function verSmartImportTrabajadoresCurso(){
   $('#mdCursoFecha').modal("hide");$("#modalImportTrabCapOnline").remove();
    
   var modeloDescarga = 
      "<a class='efectoLink' href='"+URL+"/capacitacion/online/import_trab_curso/plantilla' target='_blank'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>";
	
   var listItemsForm=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-download'></i> Plantilla Excel:",inputForm:modeloDescarga},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"<i class='fa fa-info'></i> Archivo Excel:",
       inputForm:"",divContainer:"divExcelImportCapOnline"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
		     "onclick='ocultarSmartImportTrabajadoresCurso()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;'>" +
                    "<i class='fa fa-floppy-o'></i> Guardar" +
                 "</button>"}
   ];
	
   var text = "";
		       	
   listItemsForm.forEach(function(val,index){
      text += obtenerSubPanelModuloVersionDos(val);
   });
		         	
   var listPaneles={
      id: "modalImportTrabCapOnline",clase: "listaAuxiliar",
      nombre: "Trabajadores - Curso (capacitación online) [Import]",
      contenido: "<form id='formImportTrabCursoCapOnline' class='eventoGeneral'>"+text+"</form>"
   };
		       	
   crearModalPrincipalUsuario(listPaneles,function(){},true,true);
   
   var options={
      container:"#divExcelImportCapOnline",functionCall:function(){},
      descargaUrl:"",esNuevo:true,
      idAux:"ImportExcelCapOnline",evidenciaNombre:""
   };
		     
   crearFormEvidenciaCompleta(options);
          	
   $("#formImportTrabCursoCapOnline").on("submit",function(e){
      e.preventDefault();
      validacionExcelImportTrabajadoresCurso();
   });
}

function validacionExcelImportTrabajadoresCurso(){
   $("#modalImportTrabCapOnline").modal("hide");
    
   var nombreEvidencia = $("#inputEviImportExcelCapOnline").val();
   
   if(nombreEvidencia.length > 0){
      mensajeUx="<label>El % para aprobar el curso es "+cursoCapacitacionEdicion.puntajeMinimo+". En caso " +
         "el trabajador tenga una nota menor, estará calificado como 'Desaprobado' (si llevó el curso, al menos " +
         "una vez, no será registrado).</label>";
      mensajesUx(mensajeUx,3,"","ImportTrabCurso");
       
      $("#btnDevolverValorImportTrabCurso").on("click",function(){
         enviarExcelImportTrabajadoresCurso();
      });
       
      $("#btnRegresarPrevioImportTrabCurso").on("click",function(){
         $("#modalImportTrabCapOnline").modal("show");
      });
   }else{
      mensajeUx="<label>Debe subir el archivo excel respectivo.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCapOnlineTrabImport");
      
      $("#modalMensajeUxAvisoCapOnlineTrabImport").on("hidden.bs.modal",function(){
	 $("#modalImportTrabCapOnline").modal("show");        
      });     
   }
}

function enviarExcelImportTrabajadoresCurso(){
   guardarEvidenciaAuto(0,"fileEviImportExcelCapOnline",bitsEvidenciaActoInseguro,
   "/capacitacion/online/import_trab_curso/excel/masivo/save",function(data){
      $("#modalImportTrabCapOnline").remove();
		         
      mensajeUx = "<label style='text-align:left;word-break:break-all;'>"+data.mensaje+"</label>";
      mensajesUx(mensajeUx,4,"","ActualizarCapOnlineTrabImport");
	    
      $("#modalMensajeUxActualizarCapOnlineTrabImport").on("hidden.bs.modal",function(){
         verSmartFinalizarImportTrabajadoresCurso();    
      });
   },"id",[ 
      {id: "empresaId",value: getSession("gestopcompanyid")},{id: "cursoId",value: cursoCapacitacionId},
      {id: "puntajeMinimo", value: cursoCapacitacionEdicion.puntajeMinimo}
   ]);
}

function verSmartFinalizarImportTrabajadoresCurso(){
   mensajeUx = "<label>El proceso del import ha finalizado.</label>";
   mensajesUx(mensajeUx,1,"","FinalizarCapOnlineTrabImport");
   
   $("#modalMensajeUxFinalizarCapOnlineTrabImport").on("hidden.bs.modal",function(){
      $('#mdCursoFecha').modal("show");
      llamarCursosFormacion();
   });
}

function ocultarRegistroNumeroPreguntasExamenCurso(){
   $("#modalRegistroNumPregExamCurso").modal("hide");$('#mdCursoFecha').modal('show');
}

function registroNumeroPreguntasExamenCurso(){
   $('#mdCursoFecha').modal('hide');$("#modalRegistroNumPregExamCurso").remove();  
    
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
      return val2.id - val.id;
   });
   
   var radiosPregAplicarCategoriaCurso = crearRadiosAuto("radioPregAplicarCategoriaCurso",listBooleanSiNo,
      cursoCapacitacionEdicion.aplicarCategoria,"id","nombre","habilitarNumeroPreguntasCategoriaCurso");
   
   var contenido = "";
 				
   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"¿Aplicar la divisíon del número de preguntas por categoría?",
       inputForm:radiosPregAplicarCategoriaCurso},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
   ];
   
   listPregCategorias.forEach(function(val){
      listContenido.push({sugerencia:"",clase:"atributo-pregunta-categoria",label:"N° de preguntas - "+val.nombre+":",inputForm:"<input id='inputNumPregCategoria"+val.id+"' " +
         "type='number' min='0' step='1' oninput='this.validity.valid || (this.value=\"\");calcularNumPreguntasTotalExamenCurso();' class='form-control'>"}); 
   });
   
   listContenido.push({sugerencia:"",clase:"atributo-pregunta-categoria",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"N° total de preguntas del examen:",inputForm:"<input id='inputNumPregTotalExamCurso' " +
       "type='number' min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarRegistroNumeroPreguntasExamenCurso()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
 	      		 "onclick='guardarRegistroNumeroPreguntasExamenCurso()'>" +
 	            "<i class='fa fa-floppy-o'></i> Guardar" +
 	         "</button>"});
 				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
  		
   var modalOptions={
      id:"modalRegistroNumPregExamCurso",nombre:"<i class='fa fa-question-circle'></i> N° total de preguntas del examen",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };
 				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   habilitarNumeroPreguntasCategoriaCurso(cursoCapacitacionEdicion.aplicarCategoria);
   
   $("#inputNumPregCategoria1").val((cursoCapacitacionEdicion.aplicarCategoria > 0?cursoCapacitacionEdicion.numPreguntasCategoria1:0));
   $("#inputNumPregCategoria2").val((cursoCapacitacionEdicion.aplicarCategoria > 0?cursoCapacitacionEdicion.numPreguntasCategoria2:0));
   $("#inputNumPregCategoria3").val((cursoCapacitacionEdicion.aplicarCategoria > 0?cursoCapacitacionEdicion.numPreguntasCategoria3:0));
   $("#inputNumPregTotalExamCurso").val(cursoCapacitacionEdicion.numPreguntas);
}

function habilitarNumeroPreguntasCategoriaCurso(value){
   var valAplicarCategoria = parseInt(value);
   
   $("#inputNumPregCategoria1").val(0);$("#inputNumPregCategoria2").val(0);$("#inputNumPregCategoria3").val(0);
   $("#inputNumPregTotalExamCurso").val(0);
   
   if(valAplicarCategoria == 1){
      $(".atributo-pregunta-categoria").show();document.getElementById("inputNumPregTotalExamCurso").disabled = true; 
   }else{
      $(".atributo-pregunta-categoria").hide();document.getElementById("inputNumPregTotalExamCurso").disabled = false;  
   }
}

function calcularNumPreguntasTotalExamenCurso(){
   var valNumPregCategoria1 = ($("#inputNumPregCategoria1").val().length > 0?parseInt($("#inputNumPregCategoria1").val()):0);
   var valNumPregCategoria2 = ($("#inputNumPregCategoria2").val().length > 0?parseInt($("#inputNumPregCategoria2").val()):0);
   var valNumPregCategoria3 = ($("#inputNumPregCategoria3").val().length > 0?parseInt($("#inputNumPregCategoria3").val()):0);
   
   var valNumTotalPreg = valNumPregCategoria1+valNumPregCategoria2+valNumPregCategoria3;
   
   $("#inputNumPregTotalExamCurso").val(valNumTotalPreg);
}

function guardarRegistroNumeroPreguntasExamenCurso(){
   var campoVacio = true; 
    
   var aplicarCategoria = $("input[name='radioPregAplicarCategoriaCurso']:checked").val();
   var numPregCategoria1 = $("#inputNumPregCategoria1").val();
   var numPregCategoria2 = $("#inputNumPregCategoria2").val();
   var numPregCategoria3 = $("#inputNumPregCategoria3").val();
   var numPreguntas = $("#inputNumPregTotalExamCurso").val();
   
   if(aplicarCategoria == 1 && (numPregCategoria1.length == 0 || numPregCategoria2.length == 0 || numPregCategoria3.length == 0)){
      campoVacio = false;mensajeUx = "<label>Los campos activos son obligatorios.</label>";
   }else if(aplicarCategoria == 0 && numPreguntas.length == 0){
      campoVacio = false;mensajeUx = "<label>El campo activo es obligatorio.</label>";
   }
 	
   if(campoVacio){
      var dataParam={
	 id:cursoCapacitacionId,aplicarCategoria:aplicarCategoria,numPreguntas:numPreguntas
      };
      
      if(aplicarCategoria == 1){
	 dataParam.numPreguntasCategoria1 = numPregCategoria1;dataParam.numPreguntasCategoria2 = numPregCategoria2;
	 dataParam.numPreguntasCategoria3 = numPregCategoria3;
      }
 		
      callAjaxPostSimpleVersionDos(1,URL+'/capacitacion/curso/cantidad_pregunta/save',dataParam,1,1,function(data){
 	 $('#modalRegistroNumPregExamCurso').modal('hide');
              
         mensajeUx="<label>El N° total de preguntas del examen fue guardado correctamente.</label>";
 	 mensajesUx(mensajeUx,1,"","ActualizarNumPregExamCurso");
 	 
 	 $("#modalMensajeUxActualizarNumPregExamCurso").on("hidden.bs.modal",function(){
 	    $('#mdCursoFecha').modal('show');llamarCursosFormacion();
 	 });
      });
   }else{
      $('#modalRegistroNumPregExamCurso').modal('hide');
      mensajesUx(mensajeUx,2,"","ValidacionNumPregExamCurso");
       
      $("#modalMensajeUxValidacionNumPregExamCurso").on("hidden.bs.modal",function(){
 	 $('#modalRegistroNumPregExamCurso').modal('show');
      });
   } 
}

function generarExcelFormatoRegistroCurso(){
    window.open(URL+"/capacitacion/online/excel/formato/registro_capacitacion?empresaId="+parseInt(getSession("gestopcompanyid")) +
        "&cursoCapacitacionId="+cursoCapacitacionId,'_blank');
}
