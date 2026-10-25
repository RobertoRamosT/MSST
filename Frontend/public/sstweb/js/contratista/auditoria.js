var banderaEdicion9;
var auditoriaId,auditoriaObj=[];
var auditoriaTipo;
var auditoriaFecha;
var listAudiTipo;var lsitContratista;
var listAreasSelecccionados;
var listAreas;
var auditoriaClasif;
var nombreAudi;
var nombreTipoAudi;
var listanombretab;
var listAudiFull;
var indicador2;
var nivelAvance2;

var auditoriaEstado;
var auditoriaEstadoNombre;
var listTrabajadoresResponsableAuditoria=[];
var trabajadorResponsableAuditoriaId=null;
var listTipoEvaluacionGeneral=[];
var listTipoEvaluacionGerencia=[];
var listUsuariosGerencia=[];

var listSino=[
	{id:0,nombre:"No"},
	{id:1,nombre:"Si"}
];
var listFullEvalGerenciaAudi=[];
var audiGerenEvalId;
var audiGerenEvalObj;
var listFullUsuGerenPorNotificar=[];
$(document).ready(
		function() {
			
			
			$("#btnClipTablaInspecc").on("click",function(){
				var texto=obtenerDatosTablaEstandarNoFija("tblInspecc");
				copiarAlPortapapeles(texto);
				alert("Se han guardado al clipboard " + ""
						+ " las inspecciones asociadas");
			});
			$("#wrapper").css({
				"height" : "350" + "px"
			});
			$("#btnClipTablaAudi").on("click",function(){
			
						var listFullTabla="";
						listFullTabla="Nombre" +"\t"
						+"CheckList utilizado" +"\t"
						+"Fecha planificada" +"\t"
						+"Fecha Real" +"\t"
						+"Inversión" +"\t"
						+"Responsable" +"\t"
						+"Conformidad" +"\t"
						+"Nivel de Avance" +"\t"
						+"Acciones de mejora Asociadas" +"\t"
						+"Estado de implementacion" +" \n";
						for (var index = 0; index < listAudiFull.length; index++){
							var rptaSi=listAudiFull[index].rptaSi;
							var rptaParc=listAudiFull[index].rptaParcial;
							var rptaNo=listAudiFull[index].rptaNo;
							var rptaRP=listAudiFull[index].rptaRP;
							var rptaFaltante=listAudiFull[index].rptaRespondida;
							var pregLlenada=listAudiFull[index].pregAvance;
							var pregTotal=listAudiFull[index].numPreguntas;


							 nivelAvance2=rptaFaltante+"/"+pregTotal;

							var puntaje=rptaSi*1+rptaParc*0.5+rptaRP*0.75+rptaNo*0;
							var puntajeMax=rptaSi+rptaParc+rptaRP+rptaNo;
							indicador2= pasarDecimalPorcentaje(puntaje/puntajeMax,2);
							
							listFullTabla=listFullTabla
							+listAudiFull[index].auditoriaNombre.replace("\t","")+"\t"
							+listAudiFull[index].auditoriaTipoNombre+"\t"
							+listAudiFull[index].fechaPlanificadaNombre+"\t"
							+listAudiFull[index].auditoriaFechaTexto+"\t"
							+listAudiFull[index].inversionAuditoria +"\t"
							+listAudiFull[index].auditoriaResponsable.replace("\t","")+"\t"
							+pasarDecimalPorcentaje(puntaje/puntajeMax,2)+"\t"
							+nivelAvance2.replace("/","//")+"\t"
							+ listAudiFull[index].accionesCompletas+" / "+listAudiFull[index].accionesTotales +"\t"
							+listAudiFull[index].estadoImplementacionNombre
							+"\n";
						 }
						copiarAlPortapapeles(listFullTabla);
					 
						
					
				alert("Se han guardado al clipboard la tabla de este módulo");
						}
		
		


				);
		});
function volverAuditoriasProyecto(){
	cargarAuditoriasProyecto(auditoriaClasif);
}
function volverDivAuditoriaProyecto(){
	$("#tabProyectos .container-fluid").hide();
	switch(auditoriaClasif){
	case 3:

		$("#tabProyectos #divAudi").show();
		$("#tabProyectos h2")
		.html("<a onclick='volverDivProyectos()'>Proyecto ("+
				proyectoObj.titulo+") </a> " +
				"> Auditorías");
		break;
	case 2:

		$("#tabProyectos #divInspecc").show();
		$("#tabProyectos h2")
		.html("<a onclick='volverDivProyectos()'>Proyecto ("+
				proyectoObj.titulo+") </a> " +
				"> Inspecciones"); 
		break;
	}
	
}
function getInformeExcelInspeccionLibre(){
	window.open(URL
			+ "/contratista/auditoria/informe?auditoriaId="
			+ auditoriaId+"&auditoriaNombre="+nombreAudi
		);	
}
function notificarAuditoriaContratista(){
	callAjaxPost(URL + '/auditoria/notificar', {auditoriaId:auditoriaId},
			function(data){
		if(data.CODE_RESPONSE=="05"){
			alert("Se notifico al contratista "+data.contratista.nombre+" al correo " +
					data.contratista.contactoCorreo+". Revise el signo de admiración en la vista " +
							"de proyectos para ver si el contratista toma acciones.")
		}else{
			alert("No se pudo notificar al contratista, correo no válido")
		}
		volverAuditoriasProyecto();
		
	});
}
function consolidadoAuditoriaContratista(){
	$("#tabProyectos .container-fluid").hide();
	var dataParamAudi = {
			idCompany : getSession("gestopcompanyid"),
			auditoriaClasifId : 2,
			proyectoId:ProyectoId
			};
	callAjaxPost(URL + '/auditoria/consolidado/hallazgos', dataParamAudi,
			function(data){
		if(data.CODE_RESPONSE == "05"){
			$("#tabProyectos #divConsoInspecc").show();
			$("#tabProyectos h2")
			.html("<a onclick='volverDivProyectos()'>Proyecto  </a> " +
					"    " +
					"> Consolidado de inspecciones");
			$("#tblConsoInspecc tbody tr").remove();
			data.list.forEach(function(val){
				var textRow="rowspan='"+(val.hallazgos.length+1)+"' ";
				$("#tblConsoInspecc tbody").append("<tr >" +
						"<td "+textRow+">"+val.fechaMesTexto+"</td>" +
						"<td "+textRow+">"+val.nroCaso+"</td>" +
						"<td "+textRow+">"+val.auditoriaFechaTexto+"</td>" +
						"<td "+textRow+">"+val.evaluacionGerencia.fechaTexto+"</td>" +
						"<td "+textRow+">"+val.usuarioGerencia.userName+"</td>" +
						"<td "+textRow+">"+val.fechaNotificarTexto+"</td>" +
						"<td "+textRow+">"+val.auditoriaNombre+"</td>" +
						"<td "+textRow+" >"+val.contratistaNombre+"</td>" +
						"<td"+textRow+">"+val.contratistaContacto+"</td>" +
						"<td "+textRow+">"+val.trabajador.nombre+"</td>" +
						"<td "+textRow+">"+val.proyecto.area.nombre+"</td>" +
						"<td "+textRow+">"+val.proyecto.area.clasificacion.nombre+"</td>" +
						 
						"" +
						"</tr>");
				val.hallazgos.forEach(function(val1){
					$("#tblConsoInspecc").append("<tr>" +
							"<td>"+val1.tipoReporte.nombre+"</td>" +
							"<td>"+val1.factor.nombre+"</td>" +
							"<td>"+val1.descripcion+"</td>" +
							"<td>"+val1.nivel.nombre+"</td>" +
							"<td>"+val.evaluacion.fechaTexto+"</td>" +
							"<td>"+val1.fechaRespuestaMaximaTexto+"</td>" +
							"<td>"+val1.diasRespuesta+"</td>" +
							"<td>"+val.evaluacion.nombre+"</td>" +
							"" +
							"" +
							"</tr>")
					
				})
			});
		}else{
			alert("Error al realizar consolidado")
		}
	});
	
}
function resumenUnidadDetalleAuditoriaContratista(){
	$("#tdResDetaAudi").html("Unidad")
	$("#tabProyectos .container-fluid").hide();
	var tipoId = parseInt($("#selTipoAudiDetalleResumen").val());
	var dataParamAudi = {
			idCompany : getSession("gestopcompanyid"),
			auditoriaClasifId : 3,
			auditoriaTipo : (tipoId==-1?null:tipoId) ,
			fechaInicioPresentacion:$("#fechaInicioResuDetaInsp").val(),
			fechaFinPresentacion:$("#fechaFinResuDetaInsp").val()
	};
	callAjaxPost(URL + '/auditoria/resumen/detalle', dataParamAudi,
			function(data){
		if(data.CODE_RESPONSE == "05"){
			$("#tabProyectos #divResumDetaInspecc").show();
			$("#tabProyectos h2")
			.html("<a onclick='volverDivProyectos()'>Proyecto   </a> " +
					"    " +
					"> Resumen de detalle auditorías por Unidades");
			$("#tblResumDetaInspecc tbody tr").remove();
			var unidadesAux=data.unidades;
			var totalInspecciones=0;
			var totalRequisitoCumple=0;
			var totalRequisitoParcial=0;
			var totalRequisitoNoCumple=0;
			var totalCompletadas=0;
			var totalEnProceso=0;
			var totalReqSubsanados = 0;
			var totalReqPendientes = 0;
			
			unidadesAux.forEach(function(val){
			    var nombreContratistasArr = [];
				val.numRequisitoCumple=0;
				val.numRequisitoParcial=0;
				val.numRequisitoNoCumple=0;
				val.numEnProceso=0;
				val.numCompletada=0;
				val.numDetallesConAccion = 0;
				val.numDetallesSinAccion = 0;
				val.auditorias.forEach(function(val1){
				    if(nombreContratistasArr.indexOf(val1.contratistaNombre) == -1){
					nombreContratistasArr.push(val1.contratistaNombre);
				    }
					val1.respuestas.forEach(function(val2){
					    var totalAcciones = val2.numAccionesCompletada;
					    if(totalAcciones > 0 && (val2.respuesta == 0 || val2.respuesta == 0.5 )){
						val.numDetallesConAccion++;
					    }
					    if(totalAcciones == 0 && (val2.respuesta == 0 || val2.respuesta == 0.5 ) ){
						val.numDetallesSinAccion++;
					    }
						val.numCompletada+= val2.numAccionesCompletada;
						val.numEnProceso+= val2.numAccionesEnProceso;
					
						
						switch(val2.respuesta){
						case 1:
							val.numRequisitoCumple++;
							break;
						case 0.5:
							val.numRequisitoParcial++;
							break;
						case 0:
							val.numRequisitoNoCumple++;
							break;
						}
					});
				});
				var nombreContratistasString ="";
				nombreContratistasArr.forEach(function(val){
				    nombreContratistasString+=" -"+val+" <br>"
				});
				totalInspecciones+=val.auditorias.length;
				totalRequisitoCumple+=val.numRequisitoCumple;
				totalRequisitoParcial+=val.numRequisitoParcial;
				totalRequisitoNoCumple+=val.numRequisitoNoCumple;
				totalCompletadas+=val.numCompletada;
				totalEnProceso+=val.numEnProceso;
				
				totalReqSubsanados+=val.numDetallesConAccion;
				totalReqPendientes+=val.numDetallesSinAccion;
				var promedio=(val.numRequisitoCumple*1+val.numRequisitoParcial*0.5+val.numRequisitoNoCumple*0)
						/ (val.numRequisitoCumple+val.numRequisitoParcial+val.numRequisitoNoCumple);
				 $("#tblResumDetaInspecc tbody").append("<tr >" +
						"<td>"+val.nombre+"</td>" +
						"<td>"+val.auditorias.length+"</td>" +
						"<td>"+nombreContratistasString+"</td>" +
						"<td>"+(val.numRequisitoCumple+val.numRequisitoParcial+val.numRequisitoNoCumple)+"</td>" + 
						"<td >"+"<a class='efectoLink' onclick='verCuadroDetallesAuditoriaUnidad("+val.id+",1)'><i class='fa fa-external-link'></i>"+val.numDetallesConAccion+"</a></td>" + 
						"<td >"+"<a class='efectoLink' onclick='verCuadroDetallesAuditoriaUnidad("+val.id+",0)'><i class='fa fa-external-link'></i>"+val.numDetallesSinAccion+"</a></td>" + 
						 
						"<td>"+pasarDecimalPorcentaje(promedio)+"</td>" + 
						"<td>"+val.numRequisitoCumple+"</td>" + 
						"<td>"+val.numRequisitoParcial+"</td>" + 
						"<td>"+val.numRequisitoNoCumple+"</td>" +
						"<td >"+"<a class='efectoLink' onclick='verCuadroAccionesUnidad("+val.id+",2)'><i class='fa fa-external-link'></i>"+val.numCompletada+"</a></td>" + 
						"<td >"+"<a class='efectoLink' onclick='verCuadroAccionesUnidad("+val.id+",1)'><i class='fa fa-external-link'></i>"+val.numEnProceso+"</a></td>" + 
						 
						"</tr>");
			});
			var promedio=(totalRequisitoCumple*1+totalRequisitoParcial*0.5+totalRequisitoNoCumple*0)
			/ (totalRequisitoCumple+totalRequisitoParcial+totalRequisitoNoCumple);
			var estiloCelda="style='    background-color: #f4d8a3;' ";
			$("#tblResumDetaInspecc tbody").append("<tr >" +
					"<td "+estiloCelda+">"+"TOTAL"+"</td>" +
					"<td "+estiloCelda+">"+totalInspecciones+"</td>" +
					"<td "+estiloCelda+">"+""+"</td>" +
					"<td "+estiloCelda+">"+(totalRequisitoCumple+totalRequisitoParcial+totalRequisitoNoCumple)+"</td>" + 

					"<td "+estiloCelda+">"+totalReqSubsanados+"</td>" +
					"<td "+estiloCelda+">"+totalReqPendientes+"</td>" +
					"<td "+estiloCelda+">"+pasarDecimalPorcentaje(promedio)+"</td>" + 
					
					"<td "+estiloCelda+">"+totalRequisitoCumple+"</td>" + 
					"<td "+estiloCelda+">"+totalRequisitoParcial+"</td>" + 
					"<td "+estiloCelda+">"+totalRequisitoNoCumple+"</td>" + 
					
					"<td "+estiloCelda+">"+totalCompletadas+"</td>" + 
					"<td "+estiloCelda+">"+totalEnProceso+"</td>" + 
					"</tr>");
		}else{
			alert("Error al realizar resumen")
		}
	});
	
}
function resumenUnidadAuditoriaContratista(){
        $("#tdResAudi").html("Unidad")
	$("#tabProyectos .container-fluid").hide();
	var dataParamAudi = {
			idCompany : getSession("gestopcompanyid"),
			auditoriaClasifId : 2,
			fechaInicioPresentacion:$("#fechaInicioResuInsp").val(),
			fechaFinPresentacion:$("#fechaFinResuInsp").val()
	};
	callAjaxPost(URL + '/auditoria/resumen/hallazgos', dataParamAudi,
			function(data){
		if(data.CODE_RESPONSE == "05"){
			$("#tabProyectos #divResumInspecc").show();
			$("#tabProyectos h2")
			.html("<a onclick='volverDivProyectos()'>Proyecto  </a> " +
					"    " +
					"> Resumen de inspecciones por Unidades");
			$("#tblResumInspecc tbody tr").remove();
			var unidadesAux=data.unidades;
			var totalInspecciones=0;
			var totalObservaciones=0;
			var totalObservaciones1=0;
			var totalObservaciones2=0;
			var totalObservaciones3=0;
			var totalObservaciones4=0;
			var totalCerrado=0;
			var totalAbierto=0;
			
			unidadesAux.forEach(function(val){
				val.numObservaciones=0;
				val.numObservaciones1=0;
				val.numObservaciones2=0;
				val.numObservaciones3=0;
				val.numObservaciones4=0;
				val.numAbierto=0;
				val.numCerrado=0;
				val.auditorias.forEach(function(val1){
					val1.hallazgos.forEach(function(val2){
						val.numObservaciones++;
						switch(val2.isReporte){
						case 1:
							val.numCerrado++;
							break;
						default:
							val.numAbierto++;
							break;
						}
						
						if(val2.nivel == null){val2.nivel = {id:0} };
						switch(val2.nivel.id){
						case 1:
							val.numObservaciones1++;
							break;
						case 2:
							val.numObservaciones2++;
							break;
						case 3:
							val.numObservaciones3++;
							break;
						case 4:
							val.numObservaciones4++;
							break;
						}
					});
				});
				totalInspecciones+=val.auditorias.length;
				totalObservaciones+=val.numObservaciones;
				totalObservaciones1+=val.numObservaciones1;
				totalObservaciones2+=val.numObservaciones2;
				totalObservaciones3+=val.numObservaciones3;
				totalObservaciones4+=val.numObservaciones4;
				totalCerrado+=val.numCerrado;
				totalAbierto+=val.numAbierto;
				
				 $("#tblResumInspecc tbody").append("<tr >" +
						"<td>"+val.nombre+"</td>" +
						"<td>"+val.auditorias.length+"</td>" +
						"<td>"+val.numObservaciones+"</td>" + 
						"<td>"+val.numObservaciones1+"</td>" + 
						"<td>"+val.numObservaciones2+"</td>" + 
						"<td>"+val.numObservaciones3+"</td>" + 
						"<td>"+val.numObservaciones4+"</td>" + 
						"<td >"+   val.numCerrado +"</td>" + 
						"<td>"+val.numAbierto+"</td>" + 
						"</tr>");
			});
			var estiloCelda="style='    background-color: #f4d8a3;' ";
			$("#tblResumInspecc tbody").append("<tr >" +
					"<td "+estiloCelda+">"+"TOTAL"+"</td>" +
					"<td "+estiloCelda+">"+totalInspecciones+"</td>" +
					"<td "+estiloCelda+">"+totalObservaciones+"</td>" + 
					"<td "+estiloCelda+">"+totalObservaciones1+"</td>" + 
					"<td "+estiloCelda+">"+totalObservaciones2+"</td>" + 
					"<td "+estiloCelda+">"+totalObservaciones3+"</td>" + 
					"<td "+estiloCelda+">"+totalObservaciones4+"</td>" + 
					"<td "+estiloCelda+">"+totalCerrado+"</td>" + 
					"<td "+estiloCelda+">"+totalAbierto+"</td>" + 
					"</tr>");
		}else{
			alert("Error al realizar resumen")
		}
	});
	
}
function verCuadroDetallesAuditoriaUnidad(unidadId,estadoId){
    var dataParam = {
		unidadContratistaId : unidadId,
		numAccionesCompletada : estadoId,
		fechaInicioTexto: $("#fechaInicioResuDetaInsp").val(),
		fechaFinTexto: $("#fechaFinResuDetaInsp").val()
	    };
	    callAjaxPost(URL + '/auditoria/resumen/detalles/unidad', dataParam,
			function(data){

		    var contenido = "<table id='tblDetallesUnidadResumen' class='table table-striped table-bordered table-hover table-fixed '> " +
		    		"<thead>" +
		    		"<td class='tb-acc'>Contratista</td> " +
		    		"<td class='tb-acc'>Proyecto</td> " +
		    		"<td class='tb-acc'>Requisito / Observación</td> " +
		    		"<td class='tb-acc'>Fecha notificación</td> " +
		    		"</thead>" +
		    		"<tbody></tbody>" +
		    		"</table>";
		    var modalOptions= {id:"asd",nombre:" Requisitos",maxWidth :"90%",
				contenido: contenido};
		crearModalPrincipalUsuario(modalOptions,function(){},false,true);
		data.detalles.forEach(function(val,index){
			   $("#tblDetallesUnidadResumen tbody")
			   .append("<tr>" +
			   		"<td>"+val.contratistaNombre+"</td>" +
			   		"<td>"+val.proyecto.titulo+"</td>" +
			   		"<td>"+val.verificacion+"</td>" +
			   		"<td>"+val.fechaNotificarTexto+"</td>" +
			   		"</tr>"); 
			});
	    });
}
function verCuadroAccionesUnidad(unidadId,estadoId){
    var dataParam = {
	unidadContratistaId : unidadId,
	estado : {id : estadoId},
	fechaInicioTexto: $("#fechaInicioResuDetaInsp").val(),
	fechaFinTexto: $("#fechaFinResuDetaInsp").val()
    };
    callAjaxPost(URL + '/auditoria/resumen/acciones/unidad', dataParam,
		function(data){

	    var contenido = "<table id='tblAccionesUnidadResumen' class='table table-striped table-bordered table-hover table-fixed '> " +
	    		"<thead>" +
	    		"<td class='tb-acc'>Contratista</td> " +
	    		"<td class='tb-acc'>Proyecto</td> " +
	    		"<td class='tb-acc'>Requisito / Observación</td> " +
	    		"<td class='tb-acc'>Fecha notificación</td> " +
	    		"<td class='tb-acc'>Acción de mejora/td> " +
	    		"<td class='tb-acc'>Esrado</td> " +
	    		"</thead>" +
	    		"<tbody></tbody>" +
	    		"</table>";
	    var modalOptions= {id:"asd",nombre:" Acciones",maxWidth :"90%",
			contenido: contenido};
	crearModalPrincipalUsuario(modalOptions,function(){},false,true);

	data.acciones.forEach(function(val,index){
	   $("#tblAccionesUnidadResumen tbody")
	   .append("<tr>" +
	   		"<td>"+val.auditoria.contratistaNombre+"</td>" +
	   		"<td>"+val.auditoria.proyecto.titulo+"</td>" +
	   		"<td>"+val.observacion+"</td>" +
	   		"<td>"+val.auditoria.fechaNotificarTexto+"</td>" +
	   		"<td>"+val.descripcion+"</td>" +
	   		"<td>"+val.estado.nombreAux+"</td>" +
	   		"</tr>"); 
	});
    });
}
function verCuadroAccionesContratista(contratistaId,estadoId){
    var dataParam = {
		auditoria : {contratistaId : contratistaId},
		estado : {id : estadoId},
		fechaInicioTexto: $("#fechaInicioResuInsp").val(),
		fechaFinTexto: $("#fechaFinResuInsp").val()
	    };
	    callAjaxPost(URL + '/auditoria/resumen/acciones/contratista', dataParam,
			function(data){

		    var contenido = "<table id='tblAccionesUnidadResumen' class='table table-striped table-bordered table-hover table-fixed '> " +
		    		"<thead>" +
		    		"<td class='tb-acc'>Proyecto</td> " +
		    		"<td class='tb-acc'>Hallazgo</td> " +
		    		"<td class='tb-acc'>Fecha notificación</td> " +
		    		"<td class='tb-acc'>Acción correctiva/td> " +
		    		"<td class='tb-acc'>Esrado</td> " +
		    		"</thead>" +
		    		"<tbody></tbody>" +
		    		"</table>";
		    var modalOptions= {id:"asd",nombre:" Acciones",maxWidth :"90%",
				contenido: contenido};
		crearModalPrincipalUsuario(modalOptions,function(){},false,true);

		data.acciones.forEach(function(val,index){
		   $("#tblAccionesUnidadResumen tbody")
		   .append("<tr>" +
		   		"<td>"+val.auditoria.proyecto.titulo+"</td>" +
		   		"<td>"+val.origen+"</td>" +
		   		"<td>"+val.auditoria.fechaNotificarTexto+"</td>" +
		   		"<td>"+val.descripcion+"</td>" +
		   		"<td>"+val.estado.nombreAux+"</td>" +
		   		"</tr>"); 
		});
	    });
}
function resumenAuditoriaContratista(){
	$("#tdResAudi").html("Empresa Contratista")
	$("#tabProyectos .container-fluid").hide();
	var dataParamAudi = {
			idCompany : getSession("gestopcompanyid"),
			auditoriaClasifId : 2,
			fechaInicioPresentacion:$("#fechaInicioResuInsp").val(),
			fechaFinPresentacion:$("#fechaFinResuInsp").val()
	};
	callAjaxPost(URL + '/auditoria/resumen/hallazgos', dataParamAudi,
			function(data){
		if(data.CODE_RESPONSE == "05"){
			$("#tabProyectos #divResumInspecc").show();
			$("#tabProyectos h2")
			.html("<a onclick='volverDivProyectos()'>Proyecto  </a> " +
					"    " +
					"> Resumen de inspecciones");
			$("#tblResumInspecc tbody tr").remove();
			var contratistasAux=data.contratistas;
			var totalInspecciones=0;
			var totalObservaciones=0;
			var totalObservaciones1=0;
			var totalObservaciones2=0;
			var totalObservaciones3=0;
			var totalObservaciones4=0;
			var totalCerrado=0;
			var totalAbierto=0;
			var totalHallazgosPendientes = 0;
			var totalHallazgosSubsanados = 0;
			contratistasAux.forEach(function(val){
				val.numObservaciones=0;
				val.numObservaciones1=0;
				val.numObservaciones2=0;
				val.numObservaciones3=0;
				val.numObservaciones4=0;
				val.numCompletada=0;
				val.numEnProceso=0;
				val.numHallazgosSubsanados = 0;
				val.numHallazgosPendientes = 0;
				val.auditorias.forEach(function(val1){
					val1.hallazgos.forEach(function(val2){
					    if(val2.numAccionesCompletada > 0){
						val.numHallazgosSubsanados++;
					    }else{
						val.numHallazgosPendientes++;
					    }
						val.numCompletada+= val2.numAccionesCompletada;
						val.numEnProceso+= val2.numAccionesEnProceso;
					
						
						if(val2.nivel == null){val2.nivel = {id:0} };
						
						switch(val2.nivel.id){
						case 1:
							val.numObservaciones1++;
							break;
						case 2:
							val.numObservaciones2++;
							break;
						case 3:
							val.numObservaciones3++;
							break;
						case 4:
							val.numObservaciones4++;
							break;
						}
					});
				});
				totalInspecciones+=val.auditorias.length;
				totalObservaciones+=(val.numObservaciones1+val.numObservaciones2+val.numObservaciones3+val.numObservaciones4);
				totalObservaciones1+=val.numObservaciones1;
				totalObservaciones2+=val.numObservaciones2;
				totalObservaciones3+=val.numObservaciones3;
				totalObservaciones4+=val.numObservaciones4;
				totalAbierto+=val.numEnProceso;
				totalCerrado+=val.numCompletada;
				
				totalHallazgosSubsanados+=val.numHallazgosSubsanados;
				totalHallazgosPendientes+=val.numHallazgosPendientes;
				
				 $("#tblResumInspecc tbody").append("<tr >" +
						"<td>"+val.nombre+"</td>" +
						"<td>"+val.auditorias.length+"</td>" +
						"<td><a class='efectoLink' onclick='verCuadroHalazgosResumenInspeccion("+val.id+",1)'>"+val.numHallazgosSubsanados+"</a></td>" + 
						"<td><a class='efectoLink' onclick='verCuadroHalazgosResumenInspeccion("+val.id+",0)'>"+val.numHallazgosPendientes+"</a></td>" + 
						"<td>"+(val.numObservaciones1+val.numObservaciones2+val.numObservaciones3+val.numObservaciones4)+"</td>" + 
						"<td>"+val.numObservaciones1+"</td>" + 
						"<td>"+val.numObservaciones2+"</td>" + 
						"<td>"+val.numObservaciones3+"</td>" + 
						"<td>"+val.numObservaciones4+"</td>" + 
						"<td >"+"<a class='efectoLink' onclick='verCuadroAccionesContratista("+val.id+",2)'><i class='fa fa-external-link'></i>"+val.numCompletada+"</a></td>" + 
						"<td >"+"<a class='efectoLink' onclick='verCuadroAccionesContratista("+val.id+",0)'><i class='fa fa-external-link'></i>"+val.numEnProceso+"</a></td>" + 
						 
						"</tr>");
			});
			var estiloCelda="style='    background-color: #f4d8a3;' ";
			$("#tblResumInspecc tbody").append("<tr >" +
					"<td "+estiloCelda+">"+"TOTAL"+"</td>" +
					"<td "+estiloCelda+">"+totalInspecciones+"</td>" +
					"<td "+estiloCelda+">"+totalHallazgosSubsanados+"</td>" +
					"<td "+estiloCelda+">"+totalHallazgosPendientes+"</td>" +
					
					"<td "+estiloCelda+">"+totalObservaciones+"</td>" + 
					"<td "+estiloCelda+">"+totalObservaciones1+"</td>" + 
					"<td "+estiloCelda+">"+totalObservaciones2+"</td>" + 
					"<td "+estiloCelda+">"+totalObservaciones3+"</td>" + 
					"<td "+estiloCelda+">"+totalObservaciones4+"</td>" + 
					"<td "+estiloCelda+">"+totalCerrado+"</td>" + 
					"<td "+estiloCelda+">"+totalAbierto+"</td>" + 
					"</tr>");
		}else{
			alert("Error al realizar resumen")
		}
	});
	
}
function verCuadroHalazgosResumenInspeccion(contratistaId,estadoAcciones){
    var dataParam = {
		auditoria : {contratistaId : contratistaId},
		numAccionesCompletada : estadoAcciones,
		fechaInicioTexto: $("#fechaInicioResuInsp").val(),
		fechaFinTexto: $("#fechaFinResuInsp").val()
	    };
	    callAjaxPost(URL + '/auditoria/resumen/hallazgos/unidad', dataParam,
			function(data){

		    var contenido = "<table id='tblHallazgosUnidadResumen' class='table table-striped table-bordered table-hover table-fixed '> " +
		    		"<thead>" + 
		    		"<td class='tb-acc'>Proyecto</td> " +
		    		"<td class='tb-acc'>Hallazgo</td> " +
		    		"<td class='tb-acc'>Fecha notificación a la contratista</td> " +
		    		"</thead>" +
		    		"<tbody></tbody>" +
		    		"</table>";
		    var modalOptions= {id:"asd",nombre:" Hallazgos",maxWidth :"90%",
				contenido: contenido};
		crearModalPrincipalUsuario(modalOptions,function(){},false,true);
		data.hallazgos.forEach(function(val,index){
			   $("#tblHallazgosUnidadResumen tbody")
			   .append("<tr>" + 
			   		"<td>"+val.auditoria.proyecto.titulo+"</td>" +
			   		"<td>"+val.descripcion+"</td>" +
			   		"<td>"+val.auditoria.fechaNotificarTexto+"</td>" +
			   		"</tr>"); 
			});
	    });
}

function cargarAuditoriasProyecto(clasifId){
   auditoriaClasif = parseInt(clasifId);
   volverDivAuditoriaProyecto();

   var valorResize= 220;
   resizeDivWrapper("wrapperAuditoriaProyGeneral",valorResize);
   resizeDivWrapper("wrapperInspeccionProyGeneral",valorResize);
   banderaEdicion9 = false;
	
   auditoriaId = 0;
   auditoriaTipo = 0;
   listAudiTipo=[],listAreas=[],listAreasSelecccionados=[];
	 
   $("#btnGuardarAudi").hide();
   $("#btnCancelarAudi").hide();
   $("#btnEliminarAudi").hide();
   $("#btnNuevoAudi").show();
	
   $("#btnListarDetalleAudi").hide();
	
   $("#btnHallazgo").hide();
   $("#btnGenReporte").hide(); 
   $("#btnGenReporte").attr("onclick","javascript:generarReporteAuditoria();");
   $("#btnNuevoAudi").attr("onclick", "javascript:nuevoAuditoria();");
   $("#btnCancelarAudi").attr("onclick", "javascript:cancelarAuditoria();");
   $("#btnGuardarAudi").attr("onclick", "javascript:guardarAuditoria();");
   $("#btnEliminarAudi").attr("onclick", "javascript:eliminarAuditoria();");
   $("#btnListarDetalleAudi").attr("onclick", "javascript:listarVerificaciones();");
   $("#btnInformeExcel").attr("onclick", "javascript:getInformeExcelInspeccionLibre();");
   $("#btnEnviarAudiProyecto").attr("onclick", "javascript:notificarAuditoriaContratista();");
   $("#btnEnviarAudiDetalleProyecto").attr("onclick", "javascript:notificarAuditoriaContratista();");
	
   $("#divAudi #btnConfigurarImpact").attr("onclick", "javascript:verConfigImpacto();");
   $("#divAudi #btnConfigurarImpact").show();
	
   $("#divConfigImpacto").hide();
   $("#divListClasif").hide();
//$("#btnEvalGerenciaAudiProyecto").hide();
   $("#btnInformeExcel").hide();
   $("#btnEnviarAudiProyecto").hide();
   $("#btnEnviarAudiDetalleProyecto").hide();
	
   var dataParamAudi={
      idCompany: getSession("gestopcompanyid"),
      auditoriaClasifId: auditoriaClasif,
      proyectoId: ProyectoId,
      fechaInicioPresentacion: $("#fechaInicioEventoAudi").val(),
      fechaFinPresentacion: $("#fechaFinEventoAudi").val(),
      trabajador: ($("#selRespAudiProyecto").val() == -1 || 
	           $("#selRespAudiProyecto option:selected").text()==""?null:
		   {trabajadorId: $("#selRespAudiProyecto").val(),
		    nombre: $("#selRespAudiProyecto option:selected").text()})
   };
	
   var dataParamInsp={
      idCompany: getSession("gestopcompanyid"),
      auditoriaClasifId: auditoriaClasif,
      proyectoId: ProyectoId,
      fechaInicioPresentacion: $("#fechaInicioEventoInsp").val(),
      fechaFinPresentacion: $("#fechaFinEventoInsp").val(),
      trabajador:($("#selRespInspProyecto").val() == -1 || 
	          $("#selRespInspProyecto option:selected").text() == ""?null:
		  {trabajadorId: $("#selRespInspProyecto").val(),
		   nombre: $("#selRespInspProyecto option:selected").text()})
   };
	
   switch(auditoriaClasif){
      case 3:
         callAjaxPost(URL+'/auditoria',dataParamAudi,procesarDataDescargadaPrimerEstado);
         break;
	
      case 2:
	 callAjaxPost(URL+'/auditoria',dataParamInsp,procesarDataDescargadaInspeccionPrimerEstado);
	 break;
   }
	
   var dataParam2={
      idCompany: getSession("gestopcompanyid")
   };
	
   $("#btnUpload").hide();
}

var colorSi="green";
var colorNo="red";
var colorParc="yellow";
var colorRP="orange";

function colorPuntaje(puntaje){
	var color="black";
		if(puntaje<=0.66){
			color="orange"
		}
		if(puntaje<=0.34){
		color="red"
	}
		if(puntaje>0.66){
			color="green"
		}
	return color;
}
function procesarDataDescargadaInspeccionPrimerEstado(data) {
    
    var valorResize= 220;
    resizeDivWrapper("wrapperProyectoGeneral",valorResize);
    
	switch (data.CODE_RESPONSE) {
	case "05":
		
		$("#btnGuardarInspecc").hide().attr("onclick", "javascript:guardarAuditoria();");
		$("#btnCancelarInspecc").hide().attr("onclick", "javascript:volverAuditoriasProyecto();");
		$("#btnGenReporteInspecc").hide().attr("onclick", "javascript:guardarAuditoria();");
		$("#btnHallazgoInspecc").hide().attr("onclick", "javascript:guardarAuditoria();");
		$("#btnEliminarInspecc").hide().attr("onclick", "javascript:eliminarAuditoria();");
		
		$("#btnNuevoInspecc").show().attr("onclick", "javascript:nuevoInspeccionProyecto();");

		$("#divInspecc #btnConfigurarImpact").attr("onclick", "javascript:verConfigImpacto();");
		$("#divInspecc #btnConfigurarImpact").hide();//ocultando porque solo jala hallazgos Libres
		var list = data.list;
		listAudiTipo = data.listAudiTipo;

		listTipoEvaluacionGeneral=data.tipo_evaluacion;
		listUsuariosGerencia=data.usuarios_gerencia;
		listTrabajadoresResponsableAuditoria=data.trabajadores;
		listAudiTipo=listAudiTipo.filter(function(val){
			if(val.audiTipoId==94){
				return true;
			}else{
				return false;
			}
		});
		lsitContratista=data.contratistas;
		listAudiFull=list;
		$("#tblAudi tbody tr").remove();
		$("#tblInspecc tbody tr").remove();
		listAudiFull.forEach(function(val,index){
			var nombreEval="----";
			if(val.evidenciaNombre == "---" || val.auditoriaFecha == null) //Informe se ha planificado pero no se ha realizado
			{
				nombreEval="Pendiente completar el evento" 
			} 
			else if(val.usuariosGerenciaId==null && val.usuarioGerencia.userSesionId==null && val.userHistorial.userSesionId==null)//Informe se ha realizado pero no se ha notificado a nadie
			{
				nombreEval="Pendiente notificar a responsable"
			}
			else if(val.usuarioGerencia.userSesionId!=null && (val.evaluacionGerencia.id==null || val.evaluacionGerencia.id==3))
			//else if(val.usuariosGerenciaCalificacion==0 || val.usuariosGerenciaCalificacion==0.5 || val.usuariosGerenciaCalificacion==0.6667) //Informe se ha realizado y se ha notificado a responsable
			{
				nombreEval="<i style='font-size:19px;color: #df9226' class='fa fa-eye' aria-hidden='true'></i>Abierto - pendiente de revisión del usuario: <br><strong>"+val.usuarioGerencia.userName+"</strong>";
			}
			else if(val.userHistorial.userSesionId!=null)
			{
				nombreEval="<i style='font-size:19px;color: #C0504D' class='fa fa-times' aria-hidden='true'></i> " +
									"Observado por:<br> <strong>"+val.userHistorial.userName+"</strong> - "+
				((val.obsHistorial).length>12?(val.obsHistorial).substring(0, 11)+"...":val.obsHistorial);
			}
			else if(val.usuariosGerenciaCalificacion==1)
			{
				nombreEval=val.evaluacionGerencia.icono+"Aprobado"; 
			}

			var nombreVisto =""
			    if(val.vistoContratista == 1){
				nombreVisto = "<br>"+iconoGosst.aprobado+" Revisado por contratista"
			    }
			if(val.vistoContratista == 0){
				nombreVisto = "<br>"+iconoGosst.desaprobado+" Sin revisar por contratista"
			}
			$("#tblInspecc tbody").append(
					"<tr id='trins"+val.auditoriaId+"' " +
							"onclick='editarAudi("+index+")'>" +
					
					"<td id='tdnom"+val.auditoriaId+"'>"+val.auditoriaNombre+"</td>" +
					"<td id='tdtipo"+val.auditoriaId+"'>"+val.auditoriaTipoNombre+"</td>" +
					"<td id='tdtrresp"+val.auditoriaId+"'>"+val.trabajador.nombre+"</td>" +
					"<td id='tdfechaPlan"+val.auditoriaId+"'>"+val.fechaPlanificadaNombre+"</td>" +
					"<td id='tdhorapla"+val.auditoriaId+"'>"+val.horaPlanificadaTexto+"</td>" +
					"<td id='tdfecha"+val.auditoriaId+"'>"+val.auditoriaFechaTexto+"</td>" +
					"<td id='tdaudiobs"+val.auditoriaId+"'  style=''>"+val.observacion+"</td>" +
					
					
					"<td id='tdinshall"+val.auditoriaId+"'>"+val.numHallazgos+"</td>" +
					
					"<td id='tdeviAudi"+val.auditoriaId+"'>"+val.evidenciaNombre+"</td>" +
					"<td id='estadoAudi"+val.auditoriaId+"'>"+val.estadoImplementacionNombre+"</td>" +
					
					"<td id='evalGeAudi"+val.auditoriaId+"' style='word-break: break-all' >"+nombreEval+"</td>" +
					"<td   >"+val.nroCaso+"</td>"+ 
					"<td   >"+val.fechaNotificarTexto+"<br>"+
					(val.contratistaContacto==null?"":"-"+val.contratistaContacto+"-")+
					nombreVisto+"</td>" +
					"<td id='tdinsacc"+val.auditoriaId+"'>"+val.numAccionesHallazgoProyecto+"</td>" +
					
					
					"<td  id='audieval"+val.auditoriaId+"'>"+
					val.evaluacion.icono+
					val.evaluacion.nombre+"<br>"+
					val.evaluacion.fechaTexto+"<br>"+
					val.usuarioCalificacion.userName+"</td>" +
					 "<td  id='audievalObs"+val.auditoriaId+"'>"+val.evaluacion.observacion+"</td>" + 
					"<td  id='audievalEvi"+val.auditoriaId+"'>"+val.evaluacion.evidenciaNombre+"</td>" + 
					
					"</tr>");
		});
		formatoCeldaSombreableTabla(true,"tblInspecc");
		goheadfixedY("#tblInspecc","#wrapperInspeccionProyGeneral");
		if(getSession("linkCalendarioAuditoriaId")!=null){
			
			list.every(function(val,index3){
				
				if(val.auditoriaId==parseInt(getSession("linkCalendarioAuditoriaId"))){
					editarAudi(index3);
					
					sessionStorage.removeItem("linkCalendarioAuditoriaId");
					return false;
				}else{
					return true;
				}
			});
			
		}
		break;
	}
  // goheadfixedY("#tblInspecc","#wrapperProyectoGeneral");
}

function obtenerSubPanelModuloAuditoria(val){
	var estiloDefault="";
	if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
		estiloDefault="    border-top: 1px solid #a5aaae;"
	}
	return "<div class='form-group row' style='"+estiloDefault+"'>"+
	   " <label for='colFormLabel' class='col-sm-4 col-form-label'>"+val.label+"</label>"+
	    "<div class='col-sm-8' id='"+val.divContainer+"'>"+
	     " "+val.inputForm+
	     "<small>"+val.sugerencia+" </small>"+
	    "</div>"+
	  "</div>";
}
 
function validarAuditoriaResponsable(isResumen){
	if(auditoriaObj.evaluacionGerencia.id == 1){
		$("#modalAprobUsuario").modal("show");
		var textoForm="";
		 var selEvalUsuarioAuditoria=crearSelectOneMenuOblig("selEvalUsuarioAuditoria", "", listTipoEvaluacionGeneral, 
				 auditoriaObj.evaluacion.id, "id","nombre");
		var listItemsForm=[
		{sugerencia:" ",label:"Calificación:",inputForm: selEvalUsuarioAuditoria,divContainer:"divContainAux"}, 
		{sugerencia:"",label:"Observación",inputForm:"<input class='form-control' id='inputObservacionEval'>"},
		{sugerencia:" ",label:"Fecha de evaluación:",inputForm:obtenerFechaActual()+" "+obtenerHoraActual()+ "",divContainer:"divContainAux"},
		{sugerencia:" ",label:" ",
			inputForm:"<button type='submit' class='btn btn-success' >" +
					"<i aria-hidden='true' class='fa fa-envelope-o'></i>Enviar</button>"} 
		];
		listItemsForm.forEach(function(val,index){
			textoForm+=obtenerSubPanelModuloAuditoria(val);
		});
		$("#modalAprobUsuario .modal-body")
		.html("<form class='eventoGeneral' id='formAudiUsuarioEval"+auditoriaObj.auditoriaId+"' >"
				+textoForm+"</form>");
		$("#inputObservacionEval").val(auditoriaObj.evaluacion.observacion);
		
		$("#formAudiUsuarioEval"+auditoriaObj.auditoriaId).on("submit",function(e){
			 
	        e.preventDefault();
	        var data={auditoriaId : auditoriaId , 
	        		evaluacion:{id : $("#selEvalUsuarioAuditoria").val(),
	        			observacion:$("#inputObservacionEval").val()	} }
			callAjaxPost(URL + '/auditoria/save/evaluacion/usuario', data,
					function(data){
				$("#modalAprobUsuario").modal("hide");
				alert("Se guardó la evaluación de responsable del registro")
				if(isResumen == 1){
					cargarResumenAuditoriaFinal(auditoriaClasif);
				}else{
					cargarAuditoriasProyecto(auditoriaClasif);
				}
				
			});
		});
		
	}else{
		alert("Valido sólo para registros aprobados por gerencia !") ;
	}
}
function bloquearOtraValidacion(index)
{
	var opc;
	var estado=false;
	if(index==1)
	{
		opc=$("#selSiNoOtraValidacion").val(); 
		if(opc==0)
		{
			estado=true;
			
		}
		else if(opc==1)
		{
			estado=false;
		}
		$("#selUsuariosPorNotificar").prop("disabled",estado); 
	}
	else if(index==2)
	{
		opc=$("#selEvalGerenciaAuditoria").val(); 
		$("#selSiNoOtraValidacion").val(0);    
		if(opc==1)
		{
			estado=false;  
			if($("#selSiNoOtraValidacion").val()==0)
			{
				$("#selUsuariosPorNotificar").prop("disabled",true); 
			}
			else if($("#selSiNoOtraValidacion").val()==1)
			{
				$("#selUsuariosPorNotificar").prop("disabled",false); 
			}
		}
		else  
		{
			estado=true;
			if($("#selSiNoOtraValidacion").val()==0)
			{
				$("#selUsuariosPorNotificar").prop("disabled",true); 
			}
			else if($("#selSiNoOtraValidacion").val()==1)
			{
				$("#selUsuariosPorNotificar").prop("disabled",false); 
			}
		}
		$("#selSiNoOtraValidacion").prop("disabled",estado);  
	}  
}
function toggleVerEvaluacionesGerencia()
{
	$("#listaEvaluacionesGeren").toggle();
} 
function validarAuditoriaGerencia(isResumen){
	callAjaxPost(URL + '/auditoria/evaluacion/gerencia', {
		auditoriaId :auditoriaId,
		idCompany:getSession("gestopcompanyid")},
		function(data) 
		{
			listFullEvalGerenciaAudi=data.evalgerencia;
			listFullUsuGerenPorNotificar=data.usuarios_geren_notificar;  
			if(auditoriaObj.evidenciaNombre == "---" || auditoriaObj.auditoriaFecha == null){
				alert("Valido sólo para informes con evidencia y fecha completa") ;
				return;
			}
			var permisoEval=false;
			listFullEvalGerenciaAudi.forEach(function(val,index){
				if(val.user.userName==getSession("gestopusername"))
				{
					permisoEval=true;
				}
			}); 
			if(permisoEval)
			{
				mostrarEvaluacionAudContr();
			}
			else 
			{
				notificarEvaluacionAudContr(isResumen);
			}
		});
}
 
function mostrarEvaluacionAudContr()
{
	var listItemsFormGeren=[];
	var indexEvalEditar=null;
	var textInformEval=""; 
	listFullEvalGerenciaAudi.forEach(function(val,index){
		if(val.user.userName!=getSession("gestopusername") && val.calificacion.id!=null)
		{
			listItemsFormGeren.push(
					{sugerencia:" ",label:"Revisado por:",inputForm:val.user.userName,divContainer:"divContainAux"+val.id},
					{sugerencia:" ",label:"Calificación:",inputForm: val.calificacion.icono+" <strong>"+val.calificacion.nombre+"</strong>", divContainer:"divContainAux"+val.id},
					{sugerencia:" ",label:"Observación",inputForm:val.observacion,divContainer:"divContainAux"+val.id},
					{sugerencia:" ",label:"Fecha de evaluación:",inputForm: val.fechaRegistroTexto,divContainer:"divContainAux"+val.id},
					{sugerencia:"5",label:"",inputForm: "",divContainer:""}
			);
		}
		else if(val.user.userName==getSession("gestopusername"))
		{
			indexEvalEditar=index;
		}
	});
	listItemsFormGeren.forEach(function(val,index){ 
		if(val.sugerencia!=5)
		{
			textInformEval+=obtenerSubPanelModuloAuditoria(val); 
		}
		else if(val.sugerencia==5)
		{
			textInformEval+="<div class='row' style='border-top: 1px solid #2e9e8f;margin-top:20px;margin-left: 0px; margin-right: 0px;'></div><br>";
		}
	});  
	$("#modalAprobGerencia").modal("show");
	var textoForm="";
	var selEvalGerenciaAuditoria;
	var listItemsForm=[];
	var obs="";
	if(indexEvalEditar==null)
	{
		selEvalGerenciaAuditoria=crearSelectOneMenuOblig("selEvalGerenciaAuditoria", "bloquearOtraValidacion(2)", listTipoEvaluacionGeneral, 
				 "3", "id","nombre"); 
		audiGerenEvalId=0;
	}
	else
	{
		audiGerenEvalId=listFullEvalGerenciaAudi[indexEvalEditar].id;
		audiGerenEvalObj=listFullEvalGerenciaAudi[indexEvalEditar];
		
		selEvalGerenciaAuditoria=crearSelectOneMenuOblig("selEvalGerenciaAuditoria", "bloquearOtraValidacion(2)", listTipoEvaluacionGeneral, 
				(audiGerenEvalObj.calificacion.id==null?3:audiGerenEvalObj.calificacion.id), "id","nombre");  
		obs=audiGerenEvalObj.observacion 
	}
	
	var selUsuariosNotificar=crearSelectOneMenuOblig("selUsuariosPorNotificar", "", listFullUsuGerenPorNotificar, 
			 "", "userId","userName");
	var selOtraValidacion=crearSelectOneMenuOblig("selSiNoOtraValidacion", "bloquearOtraValidacion(1)", listSino, 
			 "", "id","nombre");
	var listItemsForm=[
		{sugerencia:" ",label:"Revisado por:",inputForm:getSession("gestopusername"),divContainer:"divContainAux"}, 
		{sugerencia:" ",label:"Calificación:",inputForm: selEvalGerenciaAuditoria,divContainer:"divContainAux"},
		{sugerencia:" ",label:"Observación",inputForm:"<input class='form-control' id='inputObservacionEvalAux' value='"+obs+"'>"},
		{sugerencia:" ",label:"Fecha de evaluación:",inputForm:obtenerFechaActual()+" "+obtenerHoraActual()+ "",divContainer:"divContainAux"},
		{sugerencia:" ",label:"¿Requeriere otra validación?:",inputForm:selOtraValidacion,divContainer:"divContainAux"},
		{sugerencia:" ",label:"Responsable de la Revisión",inputForm:(listFullUsuGerenPorNotificar==0?"Sin Usuarios por Notificar":selUsuariosNotificar),divContainer:"divContainAux"},
		{sugerencia:" ",label:" ",
					inputForm:"<button id='btnGuardarEvalAudi' type='submit' class='btn btn-success' >" +
								 "<i aria-hidden='true' class='fa fa-envelope-o'></i> Guardar y Enviar" +
							  "</button>"+
							"<button style='margin-left:50px' type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>"} 
	];
	listItemsForm.forEach(function(val,index){
		textoForm+=obtenerSubPanelModuloAuditoria(val);
	});
	$("#modalAprobGerencia .modal-body").html(
		"<form class='eventoGeneral' id='formAudiEval"+auditoriaObj.auditoriaId+"' >"
				+textoForm+
				"<div id='limiteLista' style='border-bottom:1px solid #2e9e8f;height: 30px;' >" +
					"<a class='efectoLink' onclick='toggleVerEvaluacionesGerencia()'> Ver Validaciones anteriores<i class='fa fa-angle-double-down'></i></a>" +
				"</div>"+
				"<div id='listaEvaluacionesGeren' style='display:none'><br>" +
					(textInformEval==""?"Sin Registros":textInformEval)+ 
				"</div>"+
		"</form>");
	if(audiGerenEvalObj.calificacion.id==1)
	{
		$("#btnGuardarEvalAudi").hide();
		$("#selEvalGerenciaAuditoria").prop("disabled",true); 
		$("#inputObservacionEvalAux").prop("disabled",true);  
	}
	else 
	{
		$("#btnGuardarEvalAudi").show();
		$("#selEvalGerenciaAuditoria").prop("disabled",false); 
		$("#inputObservacionEvalAux").prop("disabled",false);  
	}
	$("#selUsuariosPorNotificar").prop("disabled",true); 
	$("#selSiNoOtraValidacion").prop("disabled",true); 
	$("#formAudiEval"+auditoriaObj.auditoriaId).on("submit",function(e){
        e.preventDefault();
        var opc=$("#selSiNoOtraValidacion").val();  
        if(audiGerenEvalObj.calificacion.id==1)
		{
			alert("Lo sentimos, esta evaluacion ya esta cerrada y aprobada");
			return;
		}
        if(audiGerenEvalId!=0)
	    {
	    	   var dataParam=
		        {
	        		id : audiGerenEvalId, 
	        		auditoria:{auditoriaId : auditoriaId},
	        		user:{userSesionId:null},
	        		calificacion:{id:$("#selEvalGerenciaAuditoria").val()},
	        		observacion:$("#inputObservacionEvalAux").val()
		        }//almacenando la evaluacion
		       callAjaxPost(URL + '/auditoria/save/gerencia/evaluacion', dataParam,
		    		   function(data){
						if(data.CODE_RESPONSE=="05")
						{
							$("#modalAprobGerencia").modal("hide");
							alert("Se guardó la evaluación de gerencia del registro y se informó al responsable de registro!");
							var datapar=
							{
								auditoriaId:auditoriaId,
								nroCasoInt:auditoriaObj.nroCasoInt,
								usuarioGerencia:{userSesionId:null},
								evaluacionGerencia:
								{
									id:$("#selEvalGerenciaAuditoria").val(),
									observacion:$("#inputObservacionEvalAux").val()
								}
							}// se actualiza la auditoria en los campos de evaluacionGerencia 
							callAjaxPost(URL + '/auditoria/gerencia/update/evaluacion', datapar,
			    				function(data){
				    				if(data.CODE_RESPONSE=="05")
				    				{
					    				console.log("Se actualizo la evaluacion en la auditoria contratista 1");
				    				}
				    				else 
				    				{
				    					alert("error");
				    				}
			    			});
							if($("#selEvalGerenciaAuditoria").val()==2 )//&& listFullEvalGerenciaAudi.length>=2) si es observado, notificar a otros
					        {
								if(auditoriaObj.trabajador.trabajadorId==null)
					        	{
					        		alert("Se necesita asignar responsable !");
					        		return;
					        	}
								var listFullUserNotificar=[];
					        	listFullEvalGerenciaAudi.forEach(function(val,index)
					        	{ 
					        		if(val.user.userName!=getSession("gestopusername"))
									{ 
				        	 			listFullUserNotificar.push({userSesionId:parseInt(val.user.userSesionId)});
									}
		        	 			}); 
					        	var data={
						        		auditoriaId : auditoriaId , 
						        		usuariosObsNot:listFullUserNotificar,
						        		trabajador:{trabajadorId:auditoriaObj.trabajador.trabajadorId}
							        }
					    			callAjaxPost(URL + '/auditoria/notificar/gerencia/validacion/obs', data,
					    				function(data){
						    				if(data.CODE_RESPONSE=="05")
						    				{
							    				console.log("Se notificó a los usuarios de gerencia por correo");//2.1
						    				}
					    				});
					        }
							if(opc==1 && $("#selUsuariosPorNotificar").val()!=null && listFullEvalGerenciaAudi.length<3) 
							{
								if($("#selEvalGerenciaAuditoria").val()!=1)//enviar correo para el otro usuario
								{
									alert("Lo sentimos, el evento no esta aprobado por lo que no puede solicitar otra validdacion de usuario");
									return;
								}
								var data={
					        		auditoriaId : auditoriaId , 
					        		usuarioGerencia: {userId:$("#selUsuariosPorNotificar").val()} 
						        }
				    			callAjaxPost(URL + '/auditoria/notificar/gerencia/validacion', data,
				    				function(data){
					    				if(data.CODE_RESPONSE=="05")
					    				{
					    					console.log("Se notificó al usuario de gerencia");//3
						    				//alert("Nota: Le recordamos que tiene un número limitado de validaciones(3)\nValidaciones restantes: "+(3-(listFullEvalGerenciaAudi.length+1)));
					    				}
				    			});
								//------------------------------------------------------------------
							     var estadoNotificar=false;
					    	        listFullEvalGerenciaAudi.forEach(function(val,index){
					    				if(val.user.userSesionId==$("#selUsuariosPorNotificar").val())
					    				{
					    					estadoNotificar=true;
					    				}
					       			});
					    	        if(estadoNotificar!=true)
					    	        { 
					    	        	var dataParam1=
									    	{
									        		id : 0,
									        		auditoria:{auditoriaId : auditoriaId},
									        		user:{userSesionId:$("#selUsuariosPorNotificar").val()},
									        		calificacion:{id:null},
									        		observacion:null
									        };
					    	        		callAjaxPost(URL + '/auditoria/save/gerencia/evaluacion', dataParam1,
												function(data){
													//alert("El usuario se a notificado por primera vez para su revisión");
										       		if(data.CODE_RESPONSE=="05")
										       		{
										       			var datapar=
														{
															auditoriaId:auditoriaId,
															nroCasoInt:auditoriaObj.nroCasoInt,
															usuarioGerencia:{userSesionId:$("#selUsuariosPorNotificar").val()},
															evaluacionGerencia:
															{
																id:null,
																observacion:null
															}
														}
														callAjaxPost(URL + '/auditoria/gerencia/update/evaluacion', datapar,
										    				function(data){
											    				if(data.CODE_RESPONSE=="05")
											    				{
												    				console.log("Se actualizo la evaluacion en la auditoria contratista 2");
											    				}
											    				else 
											    				{
											    					alert("error");
											    				}
										    			}); 
										       		}
											});
					    	        } 
							}
							else if(listFullEvalGerenciaAudi.length==3 && opc!=0)
							{
								alert("Lo sentimos,no puede notificar mas validaciones por haber superado el limite (3) ");
								return;
							}
						}
				});
	    }
        else 
       	{
    	   alert("Lo sentimos, usted no puede enviar su validacion");
    	   return;
      	}
	});  
}
function notificarEvaluacionAudContr(isResumen)
{
	if(listFullUsuGerenPorNotificar.length == 0){
		alert("No hay usuarios de gerencia por Notificar");return;
	}
	$("#modalAprobGerencia").modal("show");
	var textoForm="";
	var selUsuariosNotificar=crearSelectOneMenuOblig("selUsuariosNotificar", "", listFullUsuGerenPorNotificar, 
			 "", "userId","userName");
	var listItemsForm=[
   		{sugerencia:" ",label:"Notificar a:",inputForm: selUsuariosNotificar,divContainer:""}, 
   		{sugerencia:" ",label:"Fecha:",inputForm:obtenerFechaActual()+" "+obtenerHoraActual()+ "",divContainer:"divContainAux"},
   		{sugerencia:" ",label:" ",
   			inputForm:"<button type='submit' class='btn btn-success' >" +
   					"<i aria-hidden='true' class='fa fa-envelope-o'></i>Notificar</button>"} 
   		];
   		listItemsForm.forEach(function(val,index){
   			textoForm+=obtenerSubPanelModuloAuditoria(val);
   		});
   		$("#modalAprobGerencia .modal-body")
   		.html("<form class='eventoGeneral' id='formAudiEval"+auditoriaObj.auditoriaId+"' >"
   				+textoForm+"</form>");
   		$("#formAudiEval"+auditoriaObj.auditoriaId).on("submit",function(e){
			 
	        e.preventDefault();
	        if(listFullEvalGerenciaAudi.length==3)
	        {
	        	alert("Lo sentimos,no puede notificar mas validaciones por haber superado el limite (3) ");
				return;
	        }
	        var data={auditoriaId : auditoriaId , 
	        		usuarioGerencia: {userId:$("#selUsuariosNotificar").val()} }  
	        callAjaxPost(URL + '/auditoria/notificar/gerencia/validacion', data,
					function(data){
				$("#modalAprobGerencia").modal("hide");
				alert("Se notificó al usuario de gerencia")
				if(isResumen == 1){
					cargarResumenAuditoriaFinal(auditoriaClasif);
				}else{
					cargarAuditoriasProyecto(auditoriaClasif);
				}
			});
	        //--------------------------------------------------------------------
	        var estadoNotificar=false;
	        listFullEvalGerenciaAudi.forEach(function(val,index){
				if(val.user.userSesionId==$("#selUsuariosNotificar").val())
				{
					estadoNotificar=true;
				}
   			});
	        if(estadoNotificar!=true)
	        { 
	        	var dataParam1=
			    	{
			        		id : 0,
			        		auditoria:{auditoriaId : auditoriaId},
			        		user:{userSesionId:$("#selUsuariosNotificar").val()},
			        		calificacion:{id:null},
			        		observacion:null
			        };
			       	callAjaxPost(URL + '/auditoria/save/gerencia/evaluacion', dataParam1,
						function(data){ 
							//alert("El usuario se a notificado por primera vez para su revisión");
				       		var datapar=
							{
								auditoriaId:auditoriaId,
								nroCasoInt:null,
								usuarioGerencia:{userSesionId:$("#selUsuariosNotificar").val()},
								evaluacionGerencia:
								{
									id:null,
									observacion:null
								}
							}
							callAjaxPost(URL + '/auditoria/gerencia/update/evaluacion', datapar,
			    				function(data){
				    				if(data.CODE_RESPONSE=="05")
				    				{ 
					    				console.log("Se actualizo la evaluacion en la auditoria contratista");
					    				cancelarAuditoria();
				    				}
				    				else 
				    				{
				    					alert("error");
				    				}
			    			});
					});
	        } 
		}); 
}


function procesarDataDescargadaPrimerEstado(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;
		listAudiTipo = data.listAudiTipo;
		lsitContratista=data.contratistas;
		listTipoEvaluacionGeneral=data.tipo_evaluacion;
		listUsuariosGerencia=data.usuarios_gerencia;
		listTrabajadoresResponsableAuditoria=data.trabajadores;
		listAudiFull=list;
		$("#tblAudi tbody tr").remove();
		$("#tblInspecc tbody tr").remove();
		list.forEach(function(val,index){
			
		
		    var rptaSi=val.rptaSi;
		    var rptaParc=val.rptaParcial;
		    var rptaNo=val.rptaNo;
		    var rptaRP=val.rptaRP;
		    var rptaFaltante=val.rptaRespondida;

var conformidadAux= "<span style='font-weight:bold;color:"+colorSi+"'>"+rptaSi+"</span>-"
						+"<span style='font-weight:bold;color:"+colorRP+"'>"+rptaRP+"</span>-"
						+"<span style='font-weight:bold;color:"+colorParc+"'>"+rptaParc+"</span>-"
							+"<span style='font-weight:bold;color:"+colorNo+"'>"+rptaNo+"</span>-"
							+"<span style='font-weight:bold;color:"+"black"+"'>"+rptaFaltante+"</span>";
var pregLlenada=val.pregAvance;
var pregTotal=val.numPreguntas;

 nivelAvance2=rptaFaltante+"/"+pregTotal;
var puntaje=rptaSi*1+rptaParc*0.5+rptaRP*0.75+rptaNo*0;
var puntajeMax=rptaSi+rptaParc+rptaRP+rptaNo;
indicador2= pasarDecimalPorcentaje(puntaje/puntajeMax,2);
var nombreEval="----";
if(val.evidenciaNombre == "---" || val.auditoriaFecha == null) //Informe se ha planificado pero no se ha realizado
{
	nombreEval="Pendiente completar el evento" 
} 
else if(val.usuariosGerenciaId==null && val.usuarioGerencia.userSesionId==null && val.userHistorial.userSesionId==null)//Informe se ha realizado pero no se ha notificado a nadie
{
	nombreEval="Pendiente notificar a responsable"
}
else if(val.usuarioGerencia.userSesionId!=null && (val.evaluacionGerencia.id==null || val.evaluacionGerencia.id==3))
//else if(val.usuariosGerenciaCalificacion==0 || val.usuariosGerenciaCalificacion==0.5 || val.usuariosGerenciaCalificacion==0.6667) //Informe se ha realizado y se ha notificado a responsable
{
	nombreEval="<i style='font-size:19px;color: #df9226' class='fa fa-eye' aria-hidden='true'></i>Abierto - pendiente de revisión del usuario: <br><strong>"+val.usuarioGerencia.userName+"</strong>";
}
else if(val.userHistorial.userSesionId!=null)
{
	nombreEval="<i style='font-size:19px;color: #C0504D' class='fa fa-times' aria-hidden='true'></i> " +
						"Observado por:<br> <strong>"+val.userHistorial.userName+"</strong> - "+
	((val.obsHistorial).length>40?(val.obsHistorial).substring(0, 39)+"...":val.obsHistorial);
}
else if(val.usuariosGerenciaCalificacion==1)
{
	nombreEval=val.evaluacionGerencia.icono+"Aprobado"; 
}
var nombreVisto =""
    if(val.vistoContratista == 1){
	nombreVisto = "<br>"+iconoGosst.aprobado+" Revisado por contratista"
    }
if(val.vistoContratista == 0){
	nombreVisto = "<br>"+iconoGosst.desaprobado+" Sin revisar por contratista"
}
			$("#tblAudi tbody").append(

					"<tr id='tr" + val.auditoriaId
							+ "' onclick='javascript:editarAudi("
							+index+")' >"

							+ "<td id='tdnom" + val.auditoriaId
							+ "'>" + val.auditoriaNombre + "</td>"
							
							+ "<td id='tdtipo" + val.auditoriaId
							+ "'>" + val.auditoriaTipoNombre
							+ "</td>" 

							
							+ "<td id='tdfechaPlan"
							+ val.auditoriaId + "'>"+val.fechaPlanificadaNombre+"</td>"  
							+ "<td id='tdhorapla"
							+ val.auditoriaId + "'>"+val.horaPlanificadaTexto+"</td>"  
							
							+ "<td id='tdfecha"
							+ val.auditoriaId + "'>"+val.auditoriaFechaTexto+"</td>"
							+ "<td id='tdtrresp"
							+ val.auditoriaId + "'>"
							+ val.trabajador.nombre + "</td>"
							
							+"<td id='tdaudiobs"+val.auditoriaId+"' style=''>"+
							val.observacion+"</td>"

							+ "<td id='tdconf"
							+ val.auditoriaId + "' style='color:"+
							colorPuntaje(val.puntajePonderado)+";font-weight:bold'>"
							+ 
							//pasarDecimalPorcentaje(val.puntajeClasico,2)+"<br>" +
							"("+pasarDecimalPorcentaje(val.puntajePonderado,2)+")"  + "</td>"
							
							+ "<td id='tdcomp"
							+ val.auditoriaId + "'>"
							+ nivelAvance2+"</td>"
							
							+ "<td id='tdeviAudi"
							+ val.auditoriaId + "'>"
							+ val.evidenciaNombre+"</td>"
							+ "<td id='estadoAudi"+ val.auditoriaId + "'>"
							+ val.estadoImplementacionNombre+"</td>"
							+"<td id='evalGeAudi"+val.auditoriaId+"' style='word-break: break-all'>"+nombreEval+"</td>" 
							+"<td   >"+val.nroCaso+"</td>"
							
							+"<td   >"+val.fechaNotificarTexto+"<br>"
							+(val.contratistaContacto==null?"":"-"+val.contratistaContacto+"-")
							+nombreVisto+"</td>"
							
							+ "<td id='tdacc"
							+ val.auditoriaId + "'>"
							+ val.accionesDirectasTotal  +"</td>"+
							
							"<td  id='audieval"+val.auditoriaId+"'>"+val.evaluacion.icono+
							val.evaluacion.nombre+
							val.evaluacion.fechaTexto+"<br>"+
							val.usuarioCalificacion.userName+"</td>" +
							 "<td  id='audievalObs"+val.auditoriaId+"'>"+val.evaluacion.observacion+"</td>" + 
							"<td  id='audievalEvi"+val.auditoriaId+"'>"+val.evaluacion.evidenciaNombre+"</td>" + 
							
							+ "</tr>");
		})
		formatoCeldaSombreableTabla(true,"tblAudi"); 
		goheadfixedY("#tblAudi","#wrapperAuditoriaProyGeneral");
		if(getSession("linkCalendarioAuditoriaId")!=null){
			
			list.every(function(val,index3){
				
				if(val.auditoriaId==parseInt(getSession("linkCalendarioAuditoriaId"))){
					editarAudi(index3);
					
					sessionStorage.removeItem("linkCalendarioAuditoriaId");
					return false;
				}else{
					return true;
				}
			});
			
		}; 
		break;
	default:
		alert("Ocurrió un error al traer las auditorias!");
	}
}

var banderaEdicionRespuestaAudi=false;
var listFullAccionesAsociadasAuditoria=[];

function editarAudi(pindex) {
	if (!banderaEdicion9) {
		auditoriaObj=listAudiFull[pindex];
		auditoriaId = listAudiFull[pindex].auditoriaId;
		auditoriaTipo = listAudiFull[pindex].auditoriaTipo;
		auditoriaFecha = listAudiFull[pindex].auditoriaFecha;
		listAreasSelecccionados=[];
		listAreas=[];
		var fechaPlan=listAudiFull[pindex].fechaPlanificada;
		var inversionAudi=listAudiFull[pindex].inversionAuditoria;
		
		var rptaSi=auditoriaObj.rptaSi;
		var rptaParc=auditoriaObj.rptaParcial;
		var rptaNo=auditoriaObj.rptaNo;
		var rptaRP=auditoriaObj.rptaRP;
		var rptaRespondida=auditoriaObj.rptaRespondida;
		var pregLlenada=auditoriaObj.pregAvance;
		var pregTotal=listAudiFull[pindex].numPreguntas;
		var horaPlanificada=listAudiFull[pindex].horaPlanificada;
		var textoAyudaNotificar="";
		/*if(auditoriaObj.evaluacionGerencia.id == 3){
			textoAyudaNotificar="<br> Click para notificar a Gerencia";
		}*/
		if(auditoriaObj.usuariosGerenciaNombre=="---")
		{
			textoAyudaNotificar="<br> Click para notificar o visualizar";
		} 
		$("#evalGeAudi"+auditoriaId)
		.html("<a class='efectoLink' onclick='validarAuditoriaGerencia(0)'>" +
				""+ $("#evalGeAudi"+auditoriaId).text()+" "+textoAyudaNotificar+" </a>");
		 nivelAvance2=rptaRespondida+"/"+pregTotal;

		var puntaje=rptaSi*1+rptaParc*0.5+rptaRP*0.75+rptaNo*0;
		var puntajeMax=rptaSi+rptaParc+rptaRP+rptaNo;
		indicador2= pasarDecimalPorcentaje(puntaje/puntajeMax,2);
		formatoCeldaSombreableTabla(false,"tblAudi");
		formatoCeldaSombreableTabla(false,"tblInspecc");
		var name = $("#tdnom" + auditoriaId).text();
		var nameTipoAudi = listAudiFull[pindex].auditoriaTipoNombre;
		var nombreEvidencia=listAudiFull[pindex].evidenciaNombre;
		nombreAudi=name;
		nombreTipoAudi=nameTipoAudi; 
		var options=
		{container:"#tdeviAudi"+auditoriaId,
				functionCall:function(){ },
				descargaUrl: "/auditoria/evidencia?auditoriaId="+auditoriaId,
				esNuevo:false,
				idAux:"ProyAuditoria"+auditoriaId,
				evidenciaNombre:nombreEvidencia};
		crearFormEvidenciaCompleta(options);
		//
		$("#tdaudiobs" + auditoriaId)
		.html(
				"<textarea rows='3' id='inputObsAudi' class='form-control '     ></textarea>");
$("#inputObsAudi").val(auditoriaObj.observacion);
setTextareaHeight($('#inputObsAudi'))
		//

		 var selEvalAuditoria=crearSelectOneMenuOblig("selEvalAuditoria", "", listTipoEvaluacionGeneral, 
				 auditoriaObj.evaluacion.id, "id","nombre");
		 
$("#audieval"+auditoriaObj.auditoriaId).html(selEvalAuditoria);

//
 

$("#audievalObs"+auditoriaObj.auditoriaId)
.html("<input type='text' id='inputRespAudiEval' class='form-control'> ");
$("#inputRespAudiEval").val(auditoriaObj.evaluacion.observacion);
var options=
	{container:"#audievalEvi"+auditoriaObj.auditoriaId,
			functionCall:function(){ },
			descargaUrl: "/auditoria/evaluacion/evidencia?id="+auditoriaObj.auditoriaId,
			esNuevo:false,
			idAux:"EvalAuditoria",
			evidenciaNombre:auditoriaObj.evaluacion.evidenciaNombre};
	crearFormEvidenciaCompleta(options);
		//
		
		listTipoEvaluacionGeneral
		$("#tdhorapla" + auditoriaId)
		.html(
				"<input type='time' id='inputHora' class='form-control'  value='"
						+ horaPlanificada + "'>");
		$("#btnGenReporte").show();
		$("#tdinversion"+auditoriaId).html(
				"<input type='number' id='inputInversion' class='form-control' value='"
				+ inversionAudi + "'>"
		
		);
		$("#tdnom" + auditoriaId)
				.html(
						"<input type='text' id='inputNom' class='form-control' placeholder='Nombre'   value='"
								+ name + "'>");
		 
		
		$("#tdtrresp" + auditoriaId)
				.html(
						"<input id='inputRespAudi' class='form-control' >");
		//
		listTrabajadoresResponsableAuditoria.forEach(function(val){
			if(auditoriaObj.trabajador!=null){
				trabajadorResponsableAuditoriaId=auditoriaObj.trabajador.trabajadorId;
				if(val.trabajadorId==auditoriaObj.trabajador.trabajadorId){
				$("#inputRespAudi").val(val.nombre);
				
				}
			}
		});
		var listaTrabs=listarStringsDesdeArray(listTrabajadoresResponsableAuditoria,"nombre");
		ponerListaSugerida("inputRespAudi",listaTrabs,true);
		$("#inputRespAudi").on("autocompleteclose", function(){
			var nombreTrab=$("#inputRespAudi").val();
			listTrabajadoresResponsableAuditoria.every(function(val) {
					if(val.nombre.trim()==nombreTrab.trim()){
						trabajadorResponsableAuditoriaId=val.trabajadorId;
					return false;
					}
					return true;
				})
		});
		// 
		
		$("#tdarea" + auditoriaId).html("<a href='#' onclick='javascript:seleccionarArea();'>Areas</a>");
		/** ************************************************************************* */
		
	
		$("#tdfecha" + auditoriaId).html(
		"<input type='date' id='inputFechaAudi' onchange='hallarEstadoImplementacionAudi("+auditoriaId+")' class='form-control'>");
		
		$("#tdfechaPlan" + auditoriaId).html(
		"<input type='date' id='inputFechaPlanAudi' onchange='hallarEstadoImplementacionAudi("+auditoriaId+")' class='form-control'>");
	
		$("#inputFechaAudi").val(convertirFechaInput(auditoriaFecha));
		$("#inputFechaPlanAudi").val(convertirFechaInput(fechaPlan));
		hallarEstadoImplementacionAudi(auditoriaId);
		 
		banderaEdicion9 = true;
		
		$("#btnListarDetalleAudi").show();
		
		$("#btnGuardarAudi").show();
		$("#btnCancelarAudi").show();
		$("#btnEliminarAudi").show();
		$("#btnNuevoAudi").hide();
		
		//
		$("#btnGuardarInspecc").show();
		$("#btnCancelarInspecc").show();
		$("#btnEliminarInspecc").show();
		$("#btnHallazgoInspecc").hide();
		$("#btnNuevoInspecc").hide();
		
		if(auditoriaTipo==94){

			$("#btnInformeExcel").show();
			$("#btnEnviarAudiProyecto").show();
			//$("#btnEvalGerenciaAudiProyecto").show();
			
			
		}
		$("#btnEnviarAudiDetalleProyecto").show();
		if(auditoriaObj.evaluacionGerencia.id == 1){
			$("#fileEviProyAuditoria"+auditoriaId).parent("span").hide();
			
		}
		if(auditoriaObj.evaluacionGerencia.id != 1){
			$("#selEvalAuditoria").prop("disabled",true);
			$("#inputRespAudiEval").prop("disabled",true);
			$("#fileEviEvalAuditoria").parent("span").hide();
			
			$("#btnEnviarAudiProyecto").hide();
			$("#btnEnviarAudiDetalleProyecto").hide();
		}
		if(auditoriaObj.evaluacionGerencia.id == 1 && auditoriaObj.evaluacion.id == 1){
			$("#btnEliminarInspecc").hide();
			$("#btnGuardarInspecc").hide();
			
			$("#btnGuardarAudi").hide();
			$("#btnEliminarAudi").hide();
			
			$("#btnEnviarAudiDetalleProyecto").hide();
			$("#btnEnviarAudiProyecto").hide();
		}
		//
		
		cambiarAcordeTipoAuditoria(auditoriaTipo);
		var textIn="<i class='fa fa-2x fa-eye'></i>"+$("#tdacc"+auditoriaId+"").text();
		$("#tdacc"+auditoriaId+"").html(""+textIn)
		.addClass("linkGosst")
		.on("click",function(){
			verModalAccionesAsociadasAuditoria();
		});
		
		var textIn="<i class='fa fa-2x fa-eye'></i>"+$("#tdinsacc"+auditoriaId+"").text();
		$("#tdinsacc"+auditoriaId+"").html(""+textIn)
		.addClass("linkGosst")
		.on("click",function(){
			verModalAccionesAsociadasInspecciones();
		});
		
		
		
		
		var textIn2="<i class='fa fa-2x fa-list'></i>"+$("#tdinshall"+auditoriaId).text();
		$("#tdinshall"+auditoriaId+"").html(""+textIn2)
		.addClass("linkGosst")
		.on("click",function(){
			cargarHallazgosNeutral(true);
		})
		
	}
	
}
function verModalAccionesAsociadasInspecciones(){
	var dataParam2={
			accionMejoraTipoId:0,
			auditoriaId:auditoriaId
	}
	callAjaxPostNoLoad(URL + '/gestionaccionmejora/accionmejora', dataParam2,
			function(data){
		if(data.CODE_RESPONSE="05"){
		var accionesComple=	$("#tdacc"+auditoriaId).html(); 
		$("#modalAccionesInspeccion").modal("show");
		$("#btnClipTablaAcciones").remove();
		$("#modalAccionesInspeccion .modal-title").html("Acciones de mejora Asociadas")
		$("#modalAccionesInspeccion .modal-body").prepend(
				"<button id='btnClipTablaAcciones' type='button' class='btn btn-success' title='Tabla Clipboard' >"
				+ "<i class='fa fa-clipboard fa-2x'></i>" + "</button>");
		$("#btnClipTablaAcciones").on("click",function(){
			new Clipboard('#btnClipTablaAcciones', {
				text : function(trigger) {
					return obtenerDatosTablaEstandarNoFija("tblAccionesAudi") 
				}
			});
			alert("Se han guardado al clipboard " + ""
					+ " las acciones asociadas");
		});
		listFullAccionesAsociadasAuditoria=data.list;
		$("#tblAccionesInsp tbody tr").remove();
		
		listFullAccionesAsociadasAuditoria.forEach(function(val2,index){
			val2.id=val2.accionMejoraId;
			
		     /* var btnDescarga="<br><a class='btn btn-success' target='_blank' " +
			"href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val2.accionMejoraId+"'>" +
					"<i class='fa fa-download'></i>Descargar</a>"; */
			
			var textoEvi ="Sin asignar";
			if(val2.evidenciaNombre != "" && val2.evidenciaNombre != "----"){
				textoEvi=""+val2.evidenciaNombre+"<br>"+
							"<a target='_blank' href='"+URL
							+ "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val2.id+"' class='efectoLink'><i class='fa fa-download'></i>Descargar</a><br>"+
							"<a id='linkeviAccMej"+val2.id+"' class='efectoLink'><i class='fa fa-eye'></i>Vista Previa</a>";
			}
			
		    
                    /*    if(val2.evidenciaNombre==""
                		|| val2.evidenciaNombre=="----"){
                		btnDescarga="";
                	} */
                	
			$("#tblAccionesInsp tbody").append(
					"<tr>" +
					"<td >"+val2.origen+"</td>" +
					 "<td >"+val2.descripcion+"</td>" +
						"<td >"+val2.fechaRevisionTexto+"</td>" +
						"<td >"+val2.fechaRealTexto+"</td>" +
						"<td >"+val2.observacion+"</td>" +
						"<td id='actpresp"+val2.id+"'>"+val2.respuesta+
						"<button onclick='modificarRespuestaAccionMejoraAuditoria("+index+")' class='btn btn-success'>" +
						"Modificar respuesta <i class='fa fa-envelope-o'></i>" +
						"</button>"+"</td>" +
					      /*"<td >"+val2.evidenciaNombre+btnDescarga+"</td>" +*/
						"<td id='tdeviAccMej"+ val2.id + "'>"+(textoEvi)+"</td>" +
						"<td >"+val2.estadoCumplimientoNombre+"</td>" +
					"</tr>"
			);
			
			$("#linkeviAccMej" + val2.id).on("click",function(e){
				var accmejId=parseInt($(this).prop("id").substr(13,19));
				
				console.log(accmejId);
				
				callAjaxPost(URL + '/gestionaccionmejora/accionmejora/id', {accionMejoraId:accmejId},
					function(data){
						var alturaAux=140;
						var imagenPrevia=insertarImagenParaTablaMovil(data.list.evidencia,alturaAux+"px","100%");
						$("#linkeviAccMej" + accmejId).remove();
						$("#tdeviAccMej"+accmejId).append(imagenPrevia);
					},function(){
						$("#linkeviAccMej" + accmejId).html("Cargando <i class='fa fa-cog'></i>");
					});

			});
		});
		
		
		banderaEdicionRespuestaAudi=false;
		
		}else{
			console.log("NOP")
		}
	});
}
function verModalAccionesAsociadasAuditoria(){
	var dataParam2={
			auditoriaId:auditoriaId
	}
	callAjaxPostNoLoad(URL + '/auditoria/verificaciones/acciones', dataParam2,
			function(data){
		if(data.CODE_RESPONSE="05"){
		var accionesComple=	$("#tdacc"+auditoriaId).html(); 
		$("#modalAccionesAuditoria").modal("show");
		$("#btnClipTablaAcciones").remove();
		$("#modalAccionesAuditoria .modal-title").html("Acciones de mejora Asociadas")
		$("#modalAccionesAuditoria .modal-body").prepend(
				"<button id='btnClipTablaAcciones' type='button' class='btn btn-success' title='Tabla Clipboard' >"
				+ "<i class='fa fa-clipboard fa-2x'></i>" + "</button>");
		$("#btnClipTablaAcciones").on("click",function(){
			new Clipboard('#btnClipTablaAcciones', {
				text : function(trigger) {
					return obtenerDatosTablaEstandarNoFija("tblAccionesAudi") 
				}
			});
			alert("Se han guardado al clipboard " + ""
					+ " las acciones asociadas");
		});
		listFullAccionesAsociadasAuditoria=data.list;
		$("#tblAccionesAudi tbody tr").remove();
		listFullAccionesAsociadasAuditoria.forEach(function(val2,index){
			val2.id=val2.accionMejoraId;
			
			/*var btnDescarga="<br><a class='btn btn-success' target='_blank' " +
			"href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val2.accionMejoraId+"'>" +
					"<i class='fa fa-download'></i>Descargar</a>";*/
			
			var textoEvi ="Sin asignar";
			if(val2.evidenciaNombre != "" && val2.evidenciaNombre != "----"){
				textoEvi=""+val2.evidenciaNombre+"<br>"+
							"<a target='_blank' href='"+URL
							+ "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val2.id+"' class='efectoLink'><i class='fa fa-download'></i>Descargar</a><br>"+
							"<a id='linkeviAccMej"+val2.id+"' class='efectoLink'><i class='fa fa-eye'></i>Vista Previa</a>";
			}
			
                	/*if(val2.evidenciaNombre==""
                		|| val2.evidenciaNombre=="----"){
                		btnDescarga="";
                	}*/
        	
        	
			$("#tblAccionesAudi tbody").append(
					"<tr>" +
					"<td >"+val2.origen+"</td>" +
					 "<td >"+val2.descripcion+"</td>" +
						"<td >"+val2.fechaRevisionTexto+"</td>" +
						"<td >"+val2.fechaRealTexto+"</td>" +
						"<td >"+val2.observacion+"</td>" +
						"<td id='actpresp"+val2.id+"'>"+val2.respuesta+
						"<button onclick='modificarRespuestaAccionMejoraAuditoria("+index+")' class='btn btn-success'>" +
						"Modificar respuesta <i class='fa fa-envelope-o'></i>" +
						"</button>"+"</td>" +
						/*"<td >"+val2.evidenciaNombre+btnDescarga+"</td>" +*/
						"<td id='tdeviAccMej"+ val2.id + "'>"+(textoEvi)+"</td>" +
						"<td >"+val2.estadoCumplimientoNombre+"</td>" +
					"</tr>"
			);
			
			$("#linkeviAccMej" + val2.id).on("click",function(e){
				var accmejId=parseInt($(this).prop("id").substr(13,19));
				
				console.log(accmejId);
				
				callAjaxPost(URL + '/gestionaccionmejora/accionmejora/id', {accionMejoraId:accmejId},
					function(data){
						var alturaAux=140;
						var imagenPrevia=insertarImagenParaTablaMovil(data.list.evidencia,alturaAux+"px","100%");
						$("#linkeviAccMej" + accmejId).remove();
						$("#tdeviAccMej"+accmejId).append(imagenPrevia);
					},function(){
						$("#linkeviAccMej" + accmejId).html("Cargando <i class='fa fa-cog'></i>");
					});

			});
		});
		banderaEdicionRespuestaAudi=false;
		
		}else{
			console.log("NOP")
		}
	});
} 
function modificarRespuestaAccionMejoraAuditoria(pindex){
	 if(!banderaEdicionRespuestaAudi){ 
		 banderaEdicionRespuestaAudi=true;
	 var accObj=listFullAccionesAsociadasAuditoria[pindex]; 
	 var btnVolver="<button onclick='volverModificarRespuestaAuditoria("+pindex+")' class='btn btn-danger'>" +
		" <i class='fa fa-arrow-left'></i>" +
		"</button>";
	 var btnGuardar="<button onclick='guardarModificarRespuestaAuditoria("+pindex+")' class='btn btn-success'>" +
		" <i class='fa fa-floppy-o'></i>" +
		"</button>";
	 $("#actpresp"+accObj.id)
	 .html("<input type='text' id='inputRespAccASoc' class='form-control'> " +
	 		""+btnVolver+btnGuardar);
	 $("#inputRespAccASoc").focus();
	 $("#inputRespAccASoc").val(accObj.respuesta);
	 }else{
		 alert("Hay una respuesta en edición")
	 }
}
function volverModificarRespuestaAuditoria(pindex){
	switch(auditoriaClasif){
	case 3:
		verModalAccionesAsociadasAuditoria();
		break;
	case 2:
		verModalAccionesAsociadasInspecciones();
		break;
	}
}
function guardarModificarRespuestaAuditoria(pindex){
	 var accObj=listFullAccionesAsociadasAuditoria[pindex];
	 var accSend={accionMejoraId:accObj.id,
			 respuesta:$("#inputRespAccASoc").val()}
	 callAjaxPost(URL + '/gestionaccionmejora/accionmejora/respuesta/save', 
			 accSend, function(data){
		 switch(auditoriaClasif){
			case 3:
				verModalAccionesAsociadasAuditoria();
				break;
			case 2:
				verModalAccionesAsociadasInspecciones();
				break;
			}
		 
		 
		 
	 });  
}
function editarEvidenciaAuditoria(){
	$("#modalUploadAuditoria").modal("show");
}

function nuevoAuditoria() {
	auditoriaObj.usuariosGerenciaCalificacion=null;
	if (!banderaEdicion9) {
		var selectAudiTipo = crearSelectOneMenuOblig("selAudiTipo", "",
				listAudiTipo, "-1", "audiTipoId", "audiTipoNombre");
		auditoriaId = 0;
		$("#tblAudi:first tbody")
				.prepend(
						"<tr id='0'><td><input type='text' id='inputNom' class='form-control' placeholder='Nombre' autofocus='true'></td>"
								+ "<td>"
								+ selectAudiTipo
								+ "</td>"
								
								+ "<td>"
								+"<input type='date' id='inputFechaPlanAudi' onchange='hallarEstadoImplementacionAudi("+auditoriaId+")' class='form-control'>"
								+"</td>"
								+ "<td>"
								+"<input type='time' id='inputHora' onchange='hallarEstadoImplementacionAudi("+auditoriaId+")' class='form-control'>"
								+"</td>"
								
								+ "<td><input type='date' id='inputFechaAudi' onchange='hallarEstadoImplementacionAudi("+auditoriaId+")' class='form-control'></td>"
								 + "<td><input type='text' id='inputRespAudi' class='form-control' placeholder='Responsable'></td>"
								 +"<td>"
								 +"<textarea rows='3' id='inputObsAudi' class='form-control'    ></textarea>"
								 +"</td>"
								 + "<td>...</td>"
								+ "<td>...</td>"
								+"<td id='tdeviAudi0'>...</td>"
								+ "<td id='estadoAudi0'>...</td>"
								+"<td>...</td>" 
								+ "<td>...</td>"+ "<td>...</td>"
								+ "<td>...</td>"
								+"<td>...</td>"
								+ "<td>...</td>"
								+ "<td>...</td>"
								
								+ "</tr>");
		setTextareaHeight($('#inputObsAudi'))
		var listaTrabs=listarStringsDesdeArray(listTrabajadoresResponsableAuditoria,"nombre");
		ponerListaSugerida("inputRespAudi",listaTrabs,true);
		$("#inputRespAudi").on("autocompleteclose", function(){
			var nombreTrab=$("#inputRespAudi").val();
			listTrabajadoresResponsableAuditoria.every(function(val) {
					if(val.nombre.trim()==nombreTrab.trim()){
						trabajadorResponsableAuditoriaId=val.trabajadorId;
					return false;
					}
					return true;
				})
		});
		
		listTrabajadoresResponsableAuditoria.forEach(function(val){
			 
			if(val.trabajadorId==proyectoObj.responsable.trabajadorId){
				$("#inputRespAudi").val(val.nombre);
				trabajadorResponsableAuditoriaId=proyectoObj.responsable.trabajadorId;
			}
			 
		});
		var options=
		{container:"#tdeviAudi"+auditoriaId,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"ProyAuditoria"+auditoriaId,
				evidenciaNombre:""};
		formatoCeldaSombreableTabla(false,"tblAudi");
		formatoCeldaSombreableTabla(false,"tblInspecc");
		crearFormEvidenciaCompleta(options);
		$("#btnGuardarAudi").show();
		$("#btnCancelarAudi").show();
		$("#btnNuevoAudi").hide();
		
		$("#btnListarDetalleAudi").hide();
		banderaEdicion9 = true;
	} else {
		alert("Guarde primero.");
	}
}
function nuevoInspeccionProyecto() {
    
	auditoriaObj.usuariosGerenciaCalificacion=null;
	if (!banderaEdicion9) {
		var selectAudiTipo = crearSelectOneMenuOblig("selAudiTipo", "",
				listAudiTipo, "-1", "audiTipoId", "audiTipoNombre");
		auditoriaId = 0;
		$("#tblInspecc:first tbody")
				.prepend(
						"<tr >" +
						"<td><input type='text' id='inputNom' class='form-control' placeholder='Nombre' autofocus='true'></td>"
								+ "<td>"
								+ selectAudiTipo
								+ "</td>"
								
								+"<td><input type='text' id='inputRespAudi' class='form-control'></td>"
								 
								+ "<td>"
								+"<input type='date' id='inputFechaPlanAudi' onchange='hallarEstadoImplementacionAudi("+auditoriaId+")' class='form-control'>"
								+"</td>"
								+ "<td>"
								+"<input type='time' id='inputHora' onchange='hallarEstadoImplementacionAudi("+auditoriaId+")' class='form-control'>"
								+"</td>"
								
								+ "<td><input type='date' id='inputFechaAudi' onchange='hallarEstadoImplementacionAudi("+auditoriaId+")' class='form-control'></td>"
								+"<td>"
								 +"<textarea rows='3' id='inputObsAudi' class='form-control '     ></textarea>"
								 +"</td>"
								
								+ "<td>...</td>"
								+ "<td id='tdeviAudi0'>...</td>"
								+ "<td id='estadoAudi0'>...</td>"
								+ "<td>...</td>"
								+ "<td>...</td>"+ "<td>...</td>"
								+ "<td>...</td>"+"<td></td>"+
								
								"<td>...</td>"+ "<td>...</td>"+ 
								
								+ "</tr>");
		setTextareaHeight($('#inputObsAudi'))
		var listaTrabs=listarStringsDesdeArray(listTrabajadoresResponsableAuditoria,"nombre");
		ponerListaSugerida("inputRespAudi",listaTrabs,true);
		$("#inputRespAudi").on("autocompleteclose", function(){
			var nombreTrab=$("#inputRespAudi").val();
			listTrabajadoresResponsableAuditoria.every(function(val) {
					if(val.nombre.trim()==nombreTrab.trim()){
						trabajadorResponsableAuditoriaId=val.trabajadorId;
					return false;
					}
					return true;
				})
		});
		
		listTrabajadoresResponsableAuditoria.forEach(function(val){
			 
			if(val.trabajadorId==proyectoObj.responsable.trabajadorId){
				$("#inputRespAudi").val(val.nombre);
				trabajadorResponsableAuditoriaId=proyectoObj.responsable.trabajadorId;
			}
			 
		});
		var options=
		{container:"#tdeviAudi"+auditoriaId,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"ProyAuditoria"+auditoriaId,
				evidenciaNombre:""};
		formatoCeldaSombreableTabla(false,"tblAudi");
		formatoCeldaSombreableTabla(false,"tblInspecc");
		
		
		crearFormEvidenciaCompleta(options);
		$("#btnGuardarInspecc").show();
		$("#btnCancelarInspecc").show();
		$("#btnNuevoInspecc").hide();
		 
		banderaEdicion9 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarAuditoria() {
	cargarAuditoriasProyecto(auditoriaClasif);
}

function eliminarAuditoria() {
	var r = confirm("¿Está seguro de eliminar la "+auditoriaObj.auditoriaNombre+" ?");
	if (r == true) {
	    var dataParam = {
	            auditoriaId : auditoriaId,
		};

		callAjaxPost(URL + '/auditoria/delete', dataParam,
				    procesarResultadoEliminarAudi);
	}
}

function procesarResultadoEliminarAudi(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarAuditoriasProyecto(auditoriaClasif);
		break;
	default:
		alert("Ocurrió un error al eliminar la auditoria!");
	}
}
function guardarAuditoria() {

	if(false && auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
		cancelarAuditoria();
		return;
	}
	var campoVacio = true;
	var inversionAud=$("#inputInversion").val();
	var inputNom = $("#inputNom").val();
	var horaPlanificada=$("#inputHora").val();
	if(!$("#inputHora").val()){
		horaPlanificada=null;
	}
	var inputResp = ($("#inputRespAudi").val()); 

	var inputFecha = convertirFechaTexto($("#inputFechaAudi").val());  
	var inputFechaPlanAudi = convertirFechaTexto($("#inputFechaPlanAudi").val());
	
	var audiTipo;
	if(auditoriaId==0){
		audiTipo = $("#selAudiTipo option:selected").val();
		
	}else{
		audiTipo=auditoriaTipo;
	}   
	if (audiTipo == '-1' || inputNom.length == 0
			 ) {
		campoVacio = false;
	}
	var evaluacion={
			 id:$("#selEvalAuditoria").val(),
			 observacion:$("#inputRespAudiEval").val()
	 };
	 
	var observacion=$("#inputObsAudi").val();
	if (campoVacio) { 
		var dataParam = {
			auditoriaId : auditoriaId,evaluacion:evaluacion,observacion:observacion,
			trabajador:{trabajadorId:trabajadorResponsableAuditoriaId},
			
			auditoriaNombre : inputNom,
			auditoriaResponsable : inputResp, 
			auditoriaTipo: audiTipo,horaPlanificada:horaPlanificada,
			auditoriaFecha: inputFecha,
			areas: [],
			estadoImplementacion: auditoriaEstado, 
			fechaPlanificada:inputFechaPlanAudi,
			proyectoId:ProyectoId,
			vistoContratista:0,
			idCompany : getSession("gestopcompanyid")
		};

		callAjaxPost(URL + '/auditoria/save', dataParam,
				function(data){
			guardarEvidenciaAuto(data.nuevoId,"fileEviProyAuditoria"+auditoriaId
					,bitsEvidenciaAuditoria,
					"/auditoria/evidencia/save",function(){
				if(auditoriaId>0){
					guardarEvidenciaAuto(auditoriaId,"fileEviEvalAuditoria"
							,bitsEvidenciaAuditoria,
							"/auditoria/evaluacion/evidencia/save",function(){
						
						cargarAuditoriasProyecto(auditoriaClasif)
					})
				}else{
					cargarAuditoriasProyecto(auditoriaClasif)
				}
				
				
			},"auditoriaId")
			
			}
				);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
function procesarResultadoGuardarAudi(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarAuditoriasProyecto(auditoriaClasif);
		break;
	default:
		alert("Ocurrió un error al guardar la auditoria!");
	}
}
function seleccionarArea() {
	$('#mdArea').modal('show');
}
$('#mdArea').on('show.bs.modal', function(e) {
	cargarModalArea();
});
function hallarEstadoImplementacionAudi(){
	var fechaPlanificada=$("#inputFechaPlanAudi").val();
	var fechaReal=$("#inputFechaAudi").val();
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		auditoriaEstado=2;
		auditoriaEstadoNombre="Completado";
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				auditoriaEstado=3;
				auditoriaEstadoNombre="Retrasado";
			}else{
				auditoriaEstado=1;
				auditoriaEstadoNombre="Por implementar";
			}
			
		}else{
			
			auditoriaEstado=1;
			auditoriaEstadoNombre="Por implementar";
			
		}
	}
	console.log(auditoriaEstado);
	$("#estadoAudi"+auditoriaId).html(auditoriaEstadoNombre);
	
}
function generarReporteAuditoria(){
	
switch(parseInt(auditoriaClasif)){
	
	case 1:
		window.open(URL
				+ "/auditoria/informe/auditoria?auditoriaId="
				+ auditoriaId 
			);	
		break;
	case 2:
		window.open(URL
				+ "/auditoria/informe/inpeccion?auditoriaId="
				+ auditoriaId 
			
				);	
		break;

		break;
	default:
		break;
	
	}
	
}
function cambiarAcordeTipoAuditoria(tipoAudi){
	var tipoAudiId=tipoAudi;
	switch(parseInt(tipoAudiId)){
	case 94:
		$("#btnListarDetalleAudi").hide();
		$("#btnHallazgo").show();
		$('#mdVerif').off('hidden.bs.modal');
		break;
	case 2000000:
		var selContratista = crearSelectOneMenu("selContratista", "",
				lsitContratista, "-1", "id", "nombre","Obligatorio");
		$("#tdarea" + auditoriaId).html(
				selContratista);
		
		$("#btnListarDetalleAudi").show();
		$("#btnHallazgo").hide();
		$('#mdVerif').on('hidden.bs.modal', function(e) {
			listarVerificaciones();
		});
		
		break;
		default:
			$("#btnListarDetalleAudi").show();
		$("#btnHallazgo").hide();
		$('#mdVerif').on('hidden.bs.modal', function(e) {
			listarVerificaciones();
		});
			break;
	}

}
function consolExcelHallazgosLibres(empresaId,proyectoId,tipoAuditoria)
{
	window.open(URL+"/auditoria/contratista/inspeccion/excel?idCompany="+empresaId+"&proyectoId="+proyectoId+"&auditoriaTipo="+tipoAuditoria); 
}

function consolExcelHallazgosLibresCheckListContratista(empresaId,opcionDescarga,fechaInicioConsolidado,fechaFinConsolidado){

    var cero=0;
    var uno=1;
    var dos=2;
    
    window.open(URL+"/auditoria/contratista/tipo/excel?idCompany="+empresaId+"&proyectoId="+uno+
	            "&tipoReporteConsolidadoId="+opcionDescarga+"&todosLosProyectos="+cero+
	            "&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado+
	            "&estadoProyectos="+dos);

}

function verAuditoriasSinAsignar(){
	var listPaneles= 
		 {id:"divImportAuditoria",nombre:"Auditorías sin asignar",
		maxWidth:"90%",clase : "listaAuxiliar",
		contenido:"<div class='wrapper' id='wrapAudiSinAsignar'>"+
				"<table class='table table-striped table-bordered table-hover  table-fixed' "+
				" id='tblAudiSinAsignar'  >" +
				"<thead>" +
				"<tr>" +
				"<td class='tb-acc' style='width : 50px'>N°</td>" +
				"<td class='tb-acc' style='width : 150px'>...</td>" +
				"<td class='tb-acc' style='width : 250px'>Titulo Auditoría/Inspección</td>" +
				"<td class='tb-acc' style='width : 250px'>Proyecto</td>" +
				"<td class='tb-acc' style='width : 180px'>Evidencia</td>" +
				"</tr>" +
				"</thead>" +
				"<tbody>" +
				"</tbody>" +
				"</table>" +
				"</div>" }
	                  ;
	crearModalPrincipalUsuario(listPaneles,function(){ },false,true);
	cargarAuditoriasSinAsignar();
	resizeDivWrapper("wrapAudiSinAsignar",200);
	
}
function cargarAuditoriasSinAsignar(){
    var dataParam = {
	    idCompany : getSession("gestopcompanyid"),
	    isInforme : 1,
	    isInformeGerencia : 1
    }
    $("#tblAudiSinAsignar tbody").html("");
    callAjaxPost(URL+"/auditoria",dataParam,function(data){
	data.list.forEach(function(val,index){
	    $("#tblAudiSinAsignar tbody").append("<tr>" +
	    		"<td>" +(index+1)+"</td>"+
	    		"<td>" +"<button onclick='asignarAuditoriaResponsable("+val.auditoriaId+")' class='btn btn-success'>" +
				"<i class='fa fa-plus-circle'></i></button>"+"</td>"+
				"<td>" +val.auditoriaNombre+"</td>"+
	    		"<td>" +val.proyecto.titulo+"</td>"+
	    		
	    		"<td>" +crearButtonDownload("/auditoria/evidencia?auditoriaId="+val.auditoriaId)+"</td>"+
	    		
	    		"" +
	    		"" +
	    		"</tr>")
	})
    });
}
function asignarAuditoriaResponsable(pauditoriaId){
    var dataParam = {
	    auditoriaId : pauditoriaId
    }
    callAjaxPost(URL+"/auditoria/update/gerencia/evaluar",dataParam,function(data){
	cargarAuditoriasSinAsignar();
    });
}