var preguntas;
var buenasTotal;
var parcialTotal;
var malasTotal;
var noAplicanTotal;
var contador2=0;
var indexPregunta=0;
 var tipoVerificacionId;
 var tablaFijada=false;
 var mensajeUx;

function listarVerificaciones(){
    
   $("#tituloAuditoria").html("Lista de verificaci&oacute;n "+"'"+ nombreTipoAudi+"' "+"' "+ nombreAudi+"' "+convertirFechaNormal(auditoriaFecha));
   buenasTotal = 0;
   parcialTotal = 0;
   malasTotal = 0;
   noAplicanTotal = 0;
   preguntas = [];
	 
   $("#divVerif").show();
   $("#divAudi").hide();

   removerBotones();
   $("#fsBotones").append("<button id='btnRegresar' type='button' class='btn btn-success' title='Regresar - Nos permite volver "
   		                    +"al listado de inspecciones/auditorías, es decir, a la tabla que se estaba trabajando con anterioridad.'>"
		           + "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"
			+ "</button>");
   $("#fsBotones").append("<button id='btnWordAudi' type='button' class='btn btn-success btn-word' title='Modelo de lista de verificación en Word - " 
   		                  +"En caso quiera llenar la lista de verificación en el lugar de inspección, permite descargar un modelo con las "
   		                  +"siguientes columnas de la tabla actual: Requisito, ¿Aplica?, Cumplimiento(Sí, Parcial, No), ¿Riesgo Potencial? y"
   		                  +" comentarios.'>"
		           + "<i class='fa fa-file-word-o fa-2x'></i>"
		        + "</button>");
   $("#btnRegresar").attr("onclick", "javascript:regresarAuditoria();");
   $("#btnWordAudi").on("click",
        function(){
	window.open(URL+ "/auditoria/exportable/auditoria?auditoriaId="+ auditoriaId );
	});
   
   $("#fsBotones").append("<button id='btnExcelAudi' type='button' class='btn btn-success btn-excel' title='Lista de verificación en Excel - "
   		                   +"Permite descargar un archivo excel con todos las columnas de la tabla actual (con sus valores respectivos) "
   		                   +"junto a las acciones asociadas correspondientes.' >"
		           + "<i class='fa fa-file-excel-o fa-2x'></i>"
			+ "</button>");
   
   $("#fsBotones").append(
      "<button id='btnGraficoOpcionesAudi' type='button' class='btn btn-success btn-excel' title='Seleccionar una de las " +
              "opciones para generar el gráfico respectivo.' onclick='seleccionarOpcionGraficoIndividualAuditoria()'>" +
         "<i class='fa fa-bar-chart fa-2x'></i>" +
         "<i class='fa fa-list-alt'></i>" +
      "</button>");
   
   $("#fsBotones").append("<button id='btnVistaCompacta' onclick='ocultarCamposTituloAuditoria()' type='button' " +
			          "class='btn btn-success' title='Ver lista sin tabla resumen ni título - Para obtener una mejor visualización de la tabla, se oculta el título " +
			          "y la pequeña tabla de resumen. Al dar click, este botón es reemplazado por el botón Ver lista con tabla resumen y título.'>"
		           + "<i class='fa fa-eye fa-2x'></i>"
			+ "</button>");
   $("#fsBotones").append("<button id='btnVistaNormal' onclick='verCamposTituloAuditoria()' type='button' " +
			          "class='btn btn-success' title='Ver lista con tabla resumen y título - Vuelven a aparecer tanto el título " +
			          "y la pequeña tabla de resumen. Al dar click, este botón es reemplazado por el botón Ver lista sin tabla resumen ni título.'>"
			   + "<i class='fa fa-eye fa-2x'></i>"
		        + "</button>");
   
   verCamposTituloAuditoria();
   
   $("#btnExcelAudi").on("click",
        function(){
	   window.open(URL+ "/auditoria/detalle/excel?id="+ auditoriaId +"&tipoId="+auditoriaTipo+"&audiNombre="+nombreAudi);
	});
	
   var dataParam = {
	   auditoriaId : auditoriaId,
	   auditoriaTipo : auditoriaTipo
       };

   callAjaxPost(URL + '/auditoria/verificaciones', dataParam,
			       procesarDataDescargadaVerificaciones);
}

function ocultarCamposTituloAuditoria(){
   $("#btnVistaCompacta").hide();
   $("#btnVistaNormal").show();
   $("#btnRegresar").hide();
   $("#TituloArriba").hide();
   $("#indicadorAuditoriaTbl").hide();
   resizeDivWrapper("wrapper",120);
}
 
function verCamposTituloAuditoria(){
   $("#btnVistaCompacta").show();
   $("#btnVistaNormal").hide();
   $("#btnRegresar").show();
   $("#TituloArriba").show();
   $("#indicadorAuditoriaTbl").show();
   resizeDivWrapper("wrapper",200);
}

function verListaVerif(tipoId){
   if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null){
      //alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado"); 
      mensajeUx="No se puede realizar la acción porque el evento o está en evaluación o está cerrado";
      mensajesUx(mensajeUx,2,"");
      listarVerificaciones();
      return;
   }
	
   var filaId;
	 
   $("#tblVerif tbody tr").each(
        function(index){
	   filaId=$(this).prop("id"); 
	   var tipoAux=filaId.split('a');
	   var tipoAux2=tipoAux[1];
		        
	   if(tipoId==tipoAux2){
	      $(this).toggle();
           }
	 });
		      
}
function marcarTodoCategoriaInspeccionRespuesta(catId,tipo){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
	
	var r=confirm("¿Está seguro de marcar toda esta categoría?")
	if(!r){$("#filaCategoria"+catId).find("#respuestaCat"+tipo).prop("checked",false);$.unblockUI();return;}
	
	 setTimeout(function(){
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
	},1000);
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
var verificacionObj;
var listAreasInteresadasDetalleAuditoria;
function agregarAreasDetalleAudi(pindex){
	verificacionObj=preguntas[pindex]
	//
	var areasId=verificacionObj.areasId.split(",")
	listAreasInteresadasDetalleAuditoria.forEach(function(val){
		val.selected=0;
		areasId.forEach(function(val1){
			if(parseInt(val1)==val.areaId){
				val.selected=1;
			}
		})
	});	
	crearSelectOneMenuObligMultipleCompleto("slcAreaPermitidaDetalleAuditoria", "",
			listAreasInteresadasDetalleAuditoria,  "areaId", "areaName","#tdperint"+verificacionObj.verificacionId,"Secciones interesadas ...");
							
	//
	$("#tdperint"+verificacionObj.verificacionId)
	.append("<button class='btn btn-success' onclick='guardarAreasDetalleAuditoria("+pindex+")'>" +
			"<i class='fa fa-floppy-o'></i> Guardar</button>");
	
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
	crearSelectOneMenuObligMultipleCompleto("slcSeccionPermitidaDetalleAuditoria", "",
			listSeccionesInteresadasDetalleAuditoria,  "id", "nombre","#tdperintsec"+verificacionObj.verificacionId,"Secciones interesadas ...");
							
	//
	$("#tdperintsec"+verificacionObj.verificacionId)
	.append("<button class='btn btn-success' onclick='guardarAreasDetalleAuditoria("+pindex+")'>" +
			"<i class='fa fa-floppy-o'></i> Guardar</button>");
	
}


var listSeccionesInteresadasDetalleAuditoria;
function agregarSeccionesDetalleAudi(pindex){
	agregarAreasDetalleAudi(pindex);
	
	
}
function guardarAreasDetalleAuditoria(pindex){
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");  
		listarVerificaciones();
		return;
	}
	var verificacionObj=preguntas[pindex]
	var secciones=$("#slcSeccionPermitidaDetalleAuditoria").val();
	var listSecciones=[];
	secciones.forEach(function(val,index){
		listSecciones.push({id:val});
	});
	var areas=$("#slcAreaPermitidaDetalleAuditoria").val();
	var listAreas=[];
	areas.forEach(function(val,index){
		listAreas.push({areaId:val});
	});
	
	
	callAjaxPost(URL + '/auditoria/verificacion/id/save', 
			{
		auditoriaId : auditoriaId,
		auditoriaTipo : auditoriaTipo,areasDetalle:listAreas,
		detalleAuditoriaId : verificacionObj.detalleAuditoriaId,
		secciones:listSecciones},
			function(data){
			var detalle=data.detalle;
			preguntas[pindex]=detalle;
			$("#tdperint"+verificacionObj.verificacionId)
			.html(detalle.areasNombre+
					"<br> <button class='btn btn-success' onclick='agregarAreasDetalleAudi("+pindex+")'>" +
						"<i class='fa fa-plus'></i> Asociar</button>");
			$("#tdperintsec"+verificacionObj.verificacionId)
			.html(detalle.seccionesNombre+
					"<br> <button class='btn btn-success' onclick='agregarSeccionesDetalleAudi("+pindex+")'>" +
						"<i class='fa fa-plus'></i> Asociar</button>");
			
			
		});
}
var listTipoNivelRiesgoVerificacion = [];
function procesarDataDescargadaVerificaciones(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		preguntas = data.list;
		listSeccionesInteresadasDetalleAuditoria=data.secciones;
		listAreasInteresadasDetalleAuditoria=data.areas;
		    listTipoNivelRiesgoVerificacion = data.niveles;
		$("#tblVerif tbody tr").remove();
		var tipoVerificacion = "";
		var isCompleto=(auditoriaObj.evaluacionGerencia.id == 1);
		preguntas.forEach(function(val,index){
			if (tipoVerificacion != val.tipoVerificacion) {
				tipoVerificacion = val.tipoVerificacion;
				  
				$("#tblVerif tbody").append(
						"<tr id='filaCategoria"+val.tipoVerificacionId+"'>" + 
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
									"</td>"+

						"<td colspan='10'  class='info'  onclick='verListaVerif("+val.tipoVerificacionId+")'>"
								+ val.tipoVerificacion + "</td>"
								+ "</tr>");
			}
			 obtenerInFilaVerificacion(val,index);
			 
		});

		$("#indicador1").html("<strong>"+buenasTotal+"</strong>");
		$("#indicador2").html("<strong>"+parcialTotal+"</strong>");
		$("#indicador3").html("<strong>"+malasTotal+"</strong>");
		$("#indicador4").html(
				preguntas.length - noAplicanTotal - buenasTotal - parcialTotal
						- malasTotal);
		$("#indicador5").html(indicador2);
		$("#indicador6").html(nivelAvance2);
		
		break;
	default:
		alert("Ocurrió un error al traer las verificaciones!");
	}
	
	if(!tablaFijada){
		tablaFijada=true;
		goheadfixedY('#tblVerif',"#wrapper");
	}

		
	$(".info").css({"text-align":"center"});
	  setTextareaHeight($('textarea'));
}
function eliminarSolicitudAccionVerificacion(pindex,pdetalleGestAccionMejoraId){
	var r = confirm("¿Está seguro de eliminar esta solicitud asociada?");
	if(!r){return;};
	var dataParam = {detalleGestAccionMejoraId : pdetalleGestAccionMejoraId};
	callAjaxPost(URL+"/gestionaccionmejora/detalle/delete",dataParam,function(){
		preguntas[pindex].detalleGestAccionMejoraId = 0;
		obtenerInFilaVerificacion(preguntas[pindex],pindex);
	});
}

function eliminarEvidenciaVerificacion(pindex,pdetalleAuditoriaId){
    var r = confirm("¿Está seguro de eliminar la evidencia?");
	
    if(!r){return;};
	
    var dataParam={
	detalleAuditoriaId:pdetalleAuditoriaId,bucketNombre:BUCKETAMAZONS3
    };
	
    callAjaxPost(URL+"/auditoria/verificacion/evidencia/delete",dataParam,function(){
        preguntas[pindex].evidenciaNombre = "";
	obtenerInFilaVerificacion(preguntas[pindex],pindex);
    });
}
function obtenerInFilaVerificacion(val,index){
    
    var valorResize= 200;
    resizeDivWrapper("wrapper",valorResize);
    
	var isCompleto=(auditoriaObj.evaluacionGerencia.id == 1);
	var textParteInteresada="--",textParteInteresadaArea="--";
	if(val.respuesta!=null){
		textParteInteresada=val.seccionesNombre+"<br> <button class='btn btn-success' onclick='agregarSeccionesDetalleAudi("+index+")'>" +
				"<i class='fa fa-plus'></i> Asociar</button>";
		textParteInteresadaArea=val.areasNombre+"<br> <button class='btn btn-success' onclick='agregarAreasDetalleAudi("+index+")'>" +
		"<i class='fa fa-plus'></i> Asociar</button>";
	}
	var btnEliminar = "";
	if(val.detalleGestAccionMejoraId > 0){
		btnEliminar = "<br>"+iconoGosst.desaprobado+"<a class='efectoLink' onclick='eliminarSolicitudAccionVerificacion("+index+","+val.detalleGestAccionMejoraId+")'>Eliminar</a>"
		
	}else{
		val.nombreAccionMejora = "Sin Asignar";
		val.iconoEstadoAccion = "";
	}
	var btnEliminarEvidencia = "";
	if(val.evidenciaNombre!="----" && val.evidenciaNombre != ""){
		btnEliminarEvidencia = "<br>"+iconoGosst.desaprobado+"<a class='efectoLink' onclick='eliminarEvidenciaVerificacion("+index+","+val.detalleAuditoriaId+")'>Eliminar</a>"
	}
	var restriccionId;
	if(auditoriaClasif==1){
		restriccionId=2;
	}else{
		restriccionId=3;
	}
	var selTipoNivelRiesgoVerificacion = crearSelectOneMenu("selTipoNivelRiesgoVerificacion"+val.verificacionId,"guardarRespuestaRadioButton("+val.verificacionId+")",
		    listTipoNivelRiesgoVerificacion,val.tipoPerdida.id,"id","nombre","Ninguno");
	
	var colorTextoEstadoAuditoria = (val.numAcciones == 0?"":
	   (val.numAccionesCompletadas == val.numAcciones?"color:blue;":"color:red;"));
	    
	var contenidoTextoEstadoAuditoria = (val.numAcciones == 0?"Sin acciones de mejora":
	   (val.numAccionesCompletadas == val.numAcciones?"Acciones de mejora completadas":"Acciones de mejora pendientes"));
		
	var textIn= "<td id='tdid"+ val.verificacionId+ "'>"
	+ (index+1)
	+ "</td>"

	+ "<td id='tdnom"+ val.verificacionId+ "'>"
	+ val.verificacion+ "</td>"

	+ "<td id='tdaplica"+ val.verificacionId+ "'>"
	+(isCompleto?"":""
	+ "<input type='checkbox' class='check' id='chckaplica"+ val.verificacionId+"' "
	+ val.chckAplica
	+ " onclick='javascript:guardarCeldaDeshabilitarPregunta("
	+ val.verificacionId+","+val.tipoVerificacionId
	+ ")'>")
	+ "</td>"

	+ "<td id='tdsi"+ val.verificacionId+ "'>"
	+ "<input type='radio' name='rpta"+ val.verificacionId+ "' "
	+ "id='rptasi"
	+ val.verificacionId
	+ "' value='1' onclick='javascript:guardarRespuestaRadioButton("
	+ val.verificacionId+","+val.tipoVerificacionId
	+ ")'"+ val.chckSi+">"
	+ "</td>"

	+ "<td id='tdparc"+ val.verificacionId+ "'>"
	+ "<input type='radio' "
	+ "name='rpta"+ val.verificacionId+ "' "
	+ "id='rptaparc"+ val.verificacionId +"' "
	+ "value='0.5' onclick='javascript:guardarRespuestaRadioButton("
	+ val.verificacionId+","+val.tipoVerificacionId
	+ ")'"+ val.chckParc+">"
	+ "</td>"

	+ "<td id='tdno"+ val.verificacionId+ "'>"
	+ "<input type='radio' "
	+ "name='rpta"+ val.verificacionId+ "' "
	+ "id='rptano"+ val.verificacionId+ "' "
	+ " value='0'  onclick='javascript:guardarRespuestaRadioButton("
	+ val.verificacionId+","+val.tipoVerificacionId+ ")'" + val.chckNo+
			">"
	+ "</td>"

	+ "<td id='tdriesgo"+ val.verificacionId+ "'>"
	+ "<input type='checkbox' class='check' "
	+ "id='chckriesgo"+ val.verificacionId+ "' onclick='javascript:guardarRespuesta("
	+ val.verificacionId+ ")' "
	+ val.chckRiesgo+ ">"
	+ "</td>"

	

	+ "<td id='tdvernivri"+ val.verificacionId+ "'>"
	+ selTipoNivelRiesgoVerificacion+"</td>"
	
	+ "<td id='tdcom"+ val.verificacionId+ "'>"
	+ "<textarea class='form-control' rows='1'  onfocus='javascript:aparecerBtnGuardCom("
	+ val.verificacionId
	+ ")' "
	+ "id='inputcom"+ val.verificacionId+ "'>"
	+ val.comentario
	+ "</textarea></td>"
	//	
	+ "<td id='tdperint"
	+ val.verificacionId
	+ "' style='overflow-wrap: break-word;'>"
	+ textParteInteresadaArea+" </td>"
	//
//	
	+ "<td id='tdperintsec"
	+ val.verificacionId
	+ "' style='overflow-wrap: break-word;'>"
	+ textParteInteresada+" </td>"
	//
	
	+ "<td id='tdacc"
	+ val.verificacionId
	+ "'>"+val.iconoEstadoAccion+"<a href='#' onclick='indexPregunta = "+index+";javascript:agregarAccionMejora(2, "
        + val.detalleAuditoriaId + ","+restriccionId+");'>"+val.nombreAccionMejora+btnEliminar+"</a></td>" +
	"<td id='tdevi"+val.verificacionId+"'><a class='efectoLink' href='"+URL+"/auditoria/amazon_s3/verificaciones/evidencia?verificacionId="+val.verificacionId +
            "&auditoriaId="+auditoriaId+"' target='_blank' id='descargarimagen"+val.verificacionId+"'>"+(val.evidenciaNombre == "----"?"":val.evidenciaNombre)+"</a>" +
	     (auditoriaObj.usuariosGerenciaCalificacion != null && auditoriaObj.userHistorial.userSesionId == null?"":"<br/>" +
	      "<a href='#' onclick='javascript:mostrarCargarImagen("+val.verificacionId+")'  id='subirimagen"+val.verificacionId+"'>"+"Subir"+"</a>"+btnEliminarEvidencia) +
	"</td>" +
	"<td>"+"<a onclick='verHistorialRegistro(2,"+val.detalleAuditoriaId+")' class='efectoLink'>" +
	    "<i class='fa fa-search'></i><a>"+"</td>" +
	"<td>"+val.numAccionesCompletadas+"/"+val.numAcciones+"</td>" +
	"<td>"+"<span style='"+colorTextoEstadoAuditoria+"font-weight:bold;'>"+contenidoTextoEstadoAuditoria+"</span>"+"</td>";
	
	if($("#trv"+ val.verificacionId+ "a"+val.tipoVerificacionId).length == 0){
		$("#tblVerif tbody").append("<tr id='trv"+ val.verificacionId+"a"+val.tipoVerificacionId+"'>"
						+textIn
						+ "</tr>");
	}else{
		$("#trv"+ val.verificacionId+"a"+val.tipoVerificacionId).html(textIn);
	}
	 
	if (val.bitAplica == 1) {
		if (val.bitSi == 1) {
			buenasTotal++;
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
	
	resaltarInput(val.chckNo,"tdno"+val.verificacionId,"white");
	resaltarInput(val.chckParc,"tdparc"+val.verificacionId,"white");
	resaltarInput(val.chckSi,"tdsi"+val.verificacionId,"white");
	
	resaltarInput(val.chckNo,"tdno"+val.verificacionId,"red");
	resaltarInput(val.chckParc,"tdparc"+val.verificacionId,"yellow");
	resaltarInput(val.chckSi,"tdsi"+val.verificacionId,"green");
}

function resaltarInput(isChecked,inputId,color){
	if(isChecked=="checked"){
	$("#"+inputId).css("background-color",color);
	}
}

function regresarAuditoria() {
	$("#tituloAuditoria").show();
	volverDivAuditoria();
	removerBotones();
	crearBotones();
	$("#fsBotones")
			.append(
					"<button id='btnListarVerificaciones' type='button' class='btn btn-success' title='Listado de Verificaciones del tipo de auditoria'>"
							+ "<i class='fa fa-tasks fa-2x'></i></button>");
	habilitarBotonesEdicion();
	$("#fsBotones")
	.append(
			"<button id='btnGenReporte' type='button' class='btn btn-success btn-word' title='Generar Informe'>"
					+ "<i class='fa fa-file-word-o fa-2x'></i>"
					+ "</button>");
	$("#fsBotones")
	.append(
			"<button id='btnGenReporteExcel' type='button' class='btn btn-success btn-excel' title='Generar Informe'>"
					+ "<i class='fa fa-file-excel-o fa-2x'></i>"
					+ "</button>");

	$("#btnGenReporteExcel").attr("onclick", "javascript:generarExcelInspeccion();");
	$("#btnGenReporte").show();
	$("#btnGenReporte").attr("onclick","javascript:generarReporteAuditoria();");
	$("#btnNuevo").attr("onclick", "javascript:nuevoAuditoria();");
	$("#btnCancelar").attr("onclick", "javascript:cancelarAuditoria();");
	$("#btnGuardar").attr("onclick", "javascript:guardarAuditoria();");
	$("#btnEliminar").attr("onclick", "javascript:eliminarAuditoria();");
	$("#btnListarVerificaciones").attr("onclick","javascript:listarVerificaciones();");	
}

function generarExcelInspeccion(){
   window.open(URL+"/auditoria/detalle/excel?id="+auditoriaId+"&tipoId="+auditoriaTipo +
      "&audiNombre="+nombreAudi);
}

function uploadEvidencia(verificacionId){ 
    if(auditoriaObj.usuariosGerenciaCalificacion != null && auditoriaObj.userHistorial.userSesionId == null){
        alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado"); 
	$('#mdUpload').modal('hide');
		
	return;
    }
	
//    $.blockUI({message:'cargando...'}); 
//	
//    guardarEvidenciaAuto(verificacionId,"fileEvi",bitsEvidenciaVerificacion,"/auditoria/verificaciones/evidencia/save",function(){
//        $.unblockUI();
//		
//        preguntas.forEach(function(val,index){
//	    if(val.detalleAuditoriaId == parseInt(verificacionId)){
//	        var inputFileImage = document.getElementById("fileEvi");
//		var file = inputFileImage.files[0];
//		val.evidenciaNombre = file.name;
//	        obtenerInFilaVerificacion(val,index);
//	    }
//        })
//		
//        $('#mdUpload').modal('hide');$("#modalProg").show();$("#modalTree").hide();
//        $("#modalUpload").hide();
//    },"verificacionId");
    
    guardarEvidenciaAutoVersionS3(1,verificacionId,"fileEvi",bitsEvidenciaVerificacion,
    1,1,"/auditoria/amazon_s3/verificaciones/evidencia/save","detalle-auditoria/evidencia",function(){
        mensajeUx = "<label>El registro evidencia fue guardado correctamente.</label>";
        mensajesUx(mensajeUx,1,"","");
						   
	preguntas.forEach(function(val,index){
	    if(val.detalleAuditoriaId == parseInt(verificacionId)){
	        var inputFileImage = document.getElementById("fileEvi");
		var file = inputFileImage.files[0];
		val.evidenciaNombre = file.name;
		obtenerInFilaVerificacion(val,index);
	    }
        });
						
	$('#mdUpload').modal('hide');$("#modalProg").show();$("#modalTree").hide();
	$("#modalUpload").hide();
    });
}

function mostrarCargarImagen(verificacionId) {
    $('#mdUpload').modal('show');
	
    $('#btnUploadEvidencia').attr("onclick","javascript:uploadEvidencia("+verificacionId+");");
}

$('#mdUpload').on('show.bs.modal', function(e) {
	cargarModalArea();
});

function aparecerBtnGuardRegLegal(verificacionId) {
	if (!($("#btnGuardarCelda").length > 0)) {
		$("#tdreflegal" + verificacionId)
				.append(
						"<button id='btnGuardarCelda' type='button' class='btn  btn-warning' "
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
function guardarCeldaDeshabilitarPregunta(verificacionId,tipoId) { 
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado"); 
		listarVerificaciones();
		return;
	}
	tipoVerificacionId=tipoId;
	deshabilitarPregunta(verificacionId,tipoId);
	guardarRespuesta(verificacionId);
	
}
function guardarCeldaDeshabilitarPreguntaCategoria(verificacionId,tipoId) {
	
	tipoVerificacionId=tipoId;
	deshabilitarPregunta(verificacionId,tipoId);
	guardarRespuestaUnica(verificacionId);
	
}
function deshabilitarPregunta(preguntaId,tipoId,evalId) {
	
	var bitAplica =$("#chckaplica" + preguntaId).is(':checked');
	
	if (bitAplica) {
		
		$("#trv" + preguntaId + "a"+tipoId+" :input").attr("disabled", false);
		$("#descargarimagen" + preguntaId).attr("onclick", "");
		$("#subirimagen" + preguntaId).attr("onclick", "javascript:mostrarCargarImagen("+evalId+")");
		deshabilitarRiesgoPotencial(preguntaId);
	} else {
		
		$("#trv" + preguntaId + "a"+tipoId+" :input").attr("disabled", true);
		$("#descargarimagen" + preguntaId).attr("onclick", "return false;");
		$("#subirimagen" + preguntaId).attr("onclick", "return false;");
		$("#chckaplica" + preguntaId).attr("disabled", false);
	}
}
function deshabilitarPreguntaUnica(preguntaId,tipoId,evalId) {
	
	var bitAplica =$("#chckaplica" + preguntaId).is(':checked');
	
	if (bitAplica) {
		
		$("#trv" + preguntaId + "a"+tipoId+" :input").attr("disabled", false);
		$("#descargarimagen" + preguntaId).attr("onclick", "");
		$("#subirimagen" + preguntaId).attr("onclick", "javascript:mostrarCargarImagen("+evalId+")");
		deshabilitarRiesgoPotencial(preguntaId);
	} else {
		
		$("#trv" + preguntaId + "a"+tipoId+" :input").attr("disabled", true);
		$("#descargarimagen" + preguntaId).attr("onclick", "return false;");
		$("#subirimagen" + preguntaId).attr("onclick", "return false;");
		$("#chckaplica" + preguntaId).attr("disabled", false);
	}
}

function guardarRespuestaRadioButton(verificacionId,tipoId) {
	var val=$("input[name='rpta" + verificacionId + "']:checked").val(); 
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");  
		listarVerificaciones();
		return;
	}
	tipoVerificacionId=tipoId;
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

/**
 * 
 */
function calcularSubTotales() {
	buenasTotal = 0;
	parcialTotal = 0;
	malasTotal = 0;
	noAplicanTotal = 0;
	for (var index = 0; index < preguntas.length; index++) {
		var bitAplica = +$("#chckaplica" + preguntas[index].verificacionId).is(
				':checked');
		var bitRespuesta = parseFloat($(
				"input[name='rpta" + preguntas[index].verificacionId
						+ "']:checked").val())
		if (bitAplica == 1) {
			if (bitRespuesta == 1) {
				buenasTotal++;
			}

			if (bitRespuesta == 0.5) {
				parcialTotal++;
			}

			if (bitRespuesta == 0) {
				malasTotal++;
			}
		} else {
			noAplicanTotal++;
		}
	}

	$("#indicador1").html("<strong>"+buenasTotal+"</strong>");
	$("#indicador2").html("<strong>"+parcialTotal+"</strong>");
	$("#indicador3").html("<strong>"+malasTotal+"</strong>");
	$("#indicador4").html(
			preguntas.length - noAplicanTotal - buenasTotal - parcialTotal
					- malasTotal);
	$("#indicador5").html(
			((buenasTotal * 1 + parcialTotal * 0.5) / (buenasTotal
					+ parcialTotal + malasTotal)).toFixed(2));
	$("#indicador6")
			.html(
					(((buenasTotal + parcialTotal + malasTotal) / (preguntas.length - noAplicanTotal)) * 100)
							.toFixed(2));
}

function guardarRespuesta(verificacionId) {
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");  
		listarVerificaciones();
		return;
	}
	preguntas.forEach(function(val){
		if(val.verificacionId == parseInt(verificacionId)){
			verificacionObj = val;
		}
	})
	var bitAplica = $("#chckaplica" + verificacionId).is(':checked');
	
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

	var nivelRiesgo = $("#selTipoNivelRiesgoVerificacion"+verificacionId).val();
	var dataParam = {
		verificacionId : verificacionId,
		bitAplica : pasarBoolInt(bitAplica),
		bitRiesgo : pasarBoolInt(bitRiesgo),
		tipoPerdida : {id : nivelRiesgo},
		bitRespuesta : bitRespuesta,
		detalleAuditoriaId : verificacionObj.detalleAuditoriaId,
		personaInteresada:personaInteresada,
		referenciaLegal : referenciaLegal,
		comentario : comentario,
		auditoriaId : auditoriaId
	};
var dataParamBefore="trv"+verificacionId+"a"+tipoVerificacionId;
getLocation(function(){
	dataParam.posicion = {
	    x : posicionX,
	    y : posicionY,
	}
	callAjaxPost(URL + '/auditoria/verificaciones/respuesta/save', dataParam,
		procesarResultadoGuardarVerif);
});
	
}
function guardarRespuestaUnica(verificacionId) {
	var bitAplica = $("#chckaplica" + verificacionId).is(':checked');
	
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
	var dataParam = {
		verificacionId : verificacionId,
		bitAplica : pasarBoolInt(bitAplica),
		bitRiesgo : pasarBoolInt(bitRiesgo),
		bitRespuesta : bitRespuesta,
		
		personaInteresada:personaInteresada,
		referenciaLegal : referenciaLegal,
		comentario : comentario,
		auditoriaId : auditoriaId
	};
	callAjaxPost(URL + '/auditoria/verificaciones/respuesta/save', dataParam,
			function(data){
		switch (data.CODE_RESPONSE) {
		case "05":
			$("#btnGuardarCelda").remove();
			
			break;
		default:
			alert("Ocurrió un error al guardar la auditoria!");
		}
	});
}
function procesarResultadoGuardarVerif(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#btnGuardarCelda").remove();
		var dataAux={ "CODE_RESPONSE" : "05"};
		var listActualPregunta = [];
		preguntas.forEach(function(val,index){
			if(val.verificacionId == data.detalle.verificacionId){
				listActualPregunta.push(data.detalle);
				obtenerInFilaVerificacion(data.detalle,index);
			}else{
				listActualPregunta.push(val);
			}
		});
		preguntas = listActualPregunta;
		dataAux.secciones = listSeccionesInteresadasDetalleAuditoria;
		dataAux.areas = listAreasInteresadasDetalleAuditoria;
		//procesarDataDescargadaVerificaciones(dataAux);
		calcularSubTotales();
		break;
	default:
		alert("Ocurrió un error al guardar la auditoria!");
	}
}


var listOpcionesGraficoIndivInspeccion=[
   {id:1,nombre:"Según cumplimiento"},
   {id:2,nombre:"Por estado"}
];

function ocultarSeleccionarOpcionGraficoIndividualAuditoria(){
   $("#modalSelOpcionGraficoIndividualAudi").modal("hide");
}

function seleccionarOpcionGraficoIndividualAuditoria(){
   $("#modalSelOpcionGraficoIndividualAudi").remove();
   
   var selOpcionGraficoIndivAudi = crearSelectOneMenuOblig("selOpcionGraficoIndivAudi","",
      listOpcionesGraficoIndivInspeccion,"","id","nombre");
     
   var contenido = "";
  
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Gráfico",inputForm:selOpcionGraficoIndivAudi},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	             "onclick='ocultarSeleccionarOpcionGraficoIndividualAuditoria()'>" +
    	        "<i class='fa fa-times'></i> Cancelar" +
    	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		 "onclick='redireccionarGraficoIndividualAuditoria()'>" +
    	            "<i class='fa fa-check'></i> Aceptar" +
    	         "</button>"}
   ];
    	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    	
   var modalOptions={
      id: "modalSelOpcionGraficoIndividualAudi",
      nombre: "<i class='fa fa-list-ul'></i> Debe seleccionar una de las opciones",
      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   };
    	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function redireccionarGraficoIndividualAuditoria(){
   $("#modalSelOpcionGraficoIndividualAudi").modal("hide");
   
   var opcionId = parseInt($("#selOpcionGraficoIndivAudi").val());
  
   if(opcionId == 1){
      verGraficoIndividualCumplimientoAuditoria();
   }else if(opcionId == 2){
      verGraficoIndividualEstadoAuditoria();
   }
}

function verGraficoIndividualCumplimientoAuditoria(){
   $("#modalGraficoIndividualCumplimientoAudi").remove();
     
   var modalOptions={
      id: "modalGraficoIndividualCumplimientoAudi",maxWidth: "90%",
      nombre: "Gráfico inspección - Según cumplimiento",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoIndividualCumplimientoAudi'></div>"
   };
   
   var numPregAplican = 0,numBuenas = 0,numParcialmente = 0,numMalas = 0;
   
   preguntas.forEach(function(val){
      if(val.bitAplica == 1){
	 numPregAplican++;
	 
	 if(val.respuesta == 0){
	    numMalas++;
	 }else if(val.respuesta == 0.5){
	    numParcialmente++;
	 }else if(val.respuesta == 1){
	    numBuenas++;  
	 }
      }
   });
     	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoIndividualCumplimientoAudi",190);
 	 	
   Highcharts.chart('divGraficoIndividualCumplimientoAudi',{
      chart: {type: 'column'},
      title:{text: "Avance del cumplimiento: "+(numBuenas+numParcialmente+numMalas)+"/"+numPregAplican,
	     align: 'left',
	     style: {fontWeight: 'bold',fontSize: '20px'}},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de requisitos",
 	    style: {fontWeight: 'bold',fontSize: '18px'}}},
      plotOptions: {
 	 column: {
            dataLabels: {
               enabled: true,color: 'black',style: {fontSize: '25px'}},
 	    enableMouseTracking: false}},
      series: [
	 {name: 'Buenas',data: [numBuenas],color: 'green'},
	 {name: 'Parcialmente',data: [numParcialmente],color: 'yellow'},
	 {name: 'Malas',data: [numMalas],color: 'red'}]
   }); 
}

function verGraficoIndividualEstadoAuditoria(){
   $("#modalGraficoIndividualEstadoAudi").remove();
     
   var modalOptions={
      id: "modalGraficoIndividualEstadoAudi",maxWidth: "90%",
      nombre: "Gráfico inspección - Por estado",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoIndividualEstadoAudi'></div>"
   };
   
   var numAudiAccMejCompletados = 0,numAudiAccMejPendientes = 0,numAudiAccMejSinNinguna = 0;
      
   preguntas.forEach(function(val){
      if(val.bitAplica == 1){
	 if(val.numAcciones == 0){
	    numAudiAccMejSinNinguna++;
	 }else if(val.numAccionesCompletadas == val.numAcciones){
	    numAudiAccMejCompletados++;
	 }else{
	    numAudiAccMejPendientes++;
	 }
      }   
   });
     	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoIndividualEstadoAudi",190);
 	 	
   Highcharts.chart('divGraficoIndividualEstadoAudi',{
      chart: {type: 'column'},
      title: {
	 text: "Gráfico inspección - Por estado",
	 style: {fontWeight: 'bold',fontSize: '20px'}},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de requisitos",
 	    style: {fontWeight: 'bold',fontSize: '18px'}}},
      plotOptions: {
 	 column: {
            dataLabels: {
               enabled: true,color: 'black',style: {fontSize: '25px'}},
 	    enableMouseTracking: false}},
      series: [
	 {name: 'Acciones de mejora completadas',data: [numAudiAccMejCompletados],color: 'blue'},
	 {name: 'Acciones de mejora pendientes',data: [numAudiAccMejPendientes],color: 'red'},
	 {name: 'Sin acciones de mejora',data: [numAudiAccMejSinNinguna],color: 'black'}]
   }); 
}
