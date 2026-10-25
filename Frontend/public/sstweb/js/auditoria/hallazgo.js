var banderaEdicion3;
var hallazgoId,hallazgoObj;


var listHallazgoFull;
var listAreasHallazgo,listNivelRiesgoHallazgo,listFactorHallazgo,listTipoReporteHallazgo;
var listSeccionesInteresadasHallazgo,listAreasInteresadasHallazgo=[];
var tablaFijaHallazgo=false;
var isCompleto=false;
var htmlEvidenciaHallz="";
$(document).ready(
		function() {
		$("#modalHallazgos").on("shown.bs.modal",function(){
			banderaEdicion3 = false;
			hallazgoId = 0;
			
			$("#btnNuevoHall").show();$("#btnEliminarHall").hide();$("#btnVolverHall").hide();
			$("#btnGuardarHall").hide();$("#btnGraficoHall").show();
			
			isCompleto=(auditoriaObj.evaluacionGerencia.id == 1);
			if(isCompleto){
				$("#btnNuevoHall").hide();
				$("#btnImportarHall").hide();
				$("#btnImportarHallNuevo").hide();
				
			}else{
				$("#btnNuevoHall").show();
				$("#btnImportarHallNuevo").show();
			}
			var dataParam = {
					
					auditoriaId : auditoriaId
				};
				
				callAjaxPost(URL + '/auditoria/hallazgos', dataParam,
						procesarDataHallazgos);
		});
		$("#mdVerif").on("show.bs.modal",function(){
			$("#modalHallazgos").modal("hide");
			$("#modalMonitoreo").modal("hide");
});
		$("#mdVerif").on("hide.bs.modal",function(){
			if(auditoriaTipo==94 || auditoriaTipo==194){
				$("#modalHallazgos").modal("show");
			}
			if(auditoriaTipo==100){
				$("#modalMonitoreo").modal("show");
				cargarHallazgoMonitoreosNeutral();
			}
			
		});
		
		});
function volverDivHallazgosProy(){
	$("#tabProyectos .container-fluid").hide();
	$("#tabProyectos #divHallAuditoria").show();  
	$("#tabProyectos h2").html(
			"<a onclick='volverDivProyectos()'>Proyecto ("+
			proyectoObj.titulo+") </a> " +
			"><a onclick='volverDivAuditoriaProyecto()'> '"+ nombreTipoAudi+"' "+convertirFechaNormal(auditoriaFecha)+"</a>" +
					" > Hallazgos");
}

function cargarHallazgosNeutral(isProy){
	banderaEdicion3 = false;
	hallazgoId = 0;
	
	$("#btnNuevoHall").show();$("#btnEliminarHall").hide();$("#btnVolverHall").hide();
	$("#btnGuardarHall").hide();$("#btnGraficoHall").show();
	
	$("#btnNuevoHall").attr("onclick", "javascript:nuevoHallazgo("+isProy+");");
	$("#btnVolverHall").attr("onclick", "javascript:cancelarHallazgo("+isProy+");");
	$("#btnGuardarHall").attr("onclick", "javascript:guardarHallazgo("+isProy+");");
	$("#btnEliminarHall").attr("onclick", "javascript:eliminarHallazgo("+isProy+");");
	
	
	var dataParam = {
			
			auditoriaId : auditoriaId
		};
	isCompleto=(auditoriaObj.evaluacionGerencia.id == 1);
	if(isCompleto){
		$("#btnNuevoHall").hide();
		$("#btnImportarHall").hide();
		$("#btnImportarHallNuevo").hide();
	}else{
		$("#btnNuevoHall").show();
		$("#btnImportarHall").show();
		$("#btnImportarHallNuevo").show();
	}
	if(isProy){
		volverDivHallazgosProy();
		callAjaxPost(URL + '/auditoria/hallazgos', dataParam,
				procesarDataHallazgosProyecto);
		}else{
			callAjaxPost(URL + '/auditoria/hallazgos', dataParam,
					procesarDataHallazgos);
		}
		
}
function procesarDataHallazgosProyecto(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;
		listHallazgoFull=list;
		listAreasHallazgo=data.areas;
		listNivelRiesgoHallazgo=data.niveles;
		listSeccionesInteresadasHallazgo=data.secciones;
		listAreasInteresadasHallazgo=data.areasInteresadas;
		
		listFactorHallazgo=data.factor;
		listTipoReporteHallazgo=data.tiposReporte;
		$("#tblHallazgo tbody tr").remove();
		
		listHallazgoFull.forEach(function(val,index){
			var textoEvi ="Sin asignar";
			if(val.evidenciaNombre != "" && val.evidenciaNombre != "----"){
				textoEvi=""+val.evidenciaNombre+"<br>"+
							"<a target='_blank' href='"+URL
							+ "/auditoria/hallazgo/evidencia?hallazgoId="+val.id+"' class='efectoLink'>" +
									"<i class='fa fa-download'></i>Descargar</a><br>"+
							"<a id='linkeviHall"+val.id+"' class='efectoLink'><i class='fa fa-eye'></i>Vista Previa</a>";
			}
			$("#tblHallazgo tbody").append(

					"<tr id='tr" + val.id
							+ "' " +(isCompleto?"":""+
									"onclick='javascript:editarHallazgo("
							+index+")' ") +
									" >"

							+ "<td id='tddesc" + val.id
							+ "'>" + val.descripcion + "</td>"

							+ "<td id='tdtiprhall" + val.id
							+ "'>" + val.tipoReporte.nombre + "</td>"

							+ "<td id='tdnivhall" + val.id
							+ "'>" + val.nivel.nombre + "</td>"

							+ "<td id='tdfachall" + val.id
							+ "'>" + val.factor.nombre + "</td>"
							
							
							+ "<td id='tdlugar" + val.id
							+ "'>" + val.lugar
							+ "</td>" 
							+ "<td id='tdhasecc" + val.id
							+ "'>" + val.seccionesNombre
							+ "</td>"
							+ "<td id='tdaccionag"
							+ val.id + "'>" 
							+(isCompleto?"<a class='efectoLink' onclick='marcarHallazgoIndex("+index+");cargarAccionesHallazgosProyecto("+val.id+")'>"+
									"<i class='fa fa-list'></i>"+val.numAcciones+"</a>":val.numAcciones)
							+"</td>"
							+ "<td id='tdeviHall"+ val.id + "'>"
							+ ( textoEvi)
							+"</td>"
							+ "<td class='gosst-desaprobado-color' id='asdasdasd"+ val.id + "'>"
							+ ( val.observacionGerencia)
							+"</td>"
							+ "</tr>");
			$("#linkeviHall" + val.id).on("click",function(e){
				var hallzgoId=parseInt($(this).prop("id").substr(11,19));
				 
				if(!banderaEdicion3 || hallzgoId==hallazgoId){
				callAjaxPost(URL + '/auditoria/hallazgos/id', {id:hallzgoId},
					function(data){
						var alturaAux=140;
						var imagenPrevia=insertarImagenParaTablaMovil(data.hallazgo.evidencia,alturaAux+"px","100%");
						$("#linkeviHall" + hallzgoId).remove();
						$("#tdeviHall"+hallzgoId).append(imagenPrevia);
					},function(){
						$("#linkeviHall" + hallzgoId).html("Cargando <i class='fa fa-cog'></i>");
					});
				}

			});
		});
		formatoCeldaSombreableTabla(true,"tblHallazgo");
		if(!tablaFijaHallazgo){
			tablaFijaHallazgo=true;
			   resizeDivWrapper(  "wrapper3" ,220 ); 
				goheadfixedY("#tblHallazgo","#wrapper3");
			}
		
		break;
	default:
		alert("Ocurrió un error al traer las hallzgos!");
	}
	
}
function marcarHallazgoIndex(pindex){
	hallazgoObj = listHallazgoFull[pindex];
	hallazgoId = listHallazgoFull[pindex].id;
}

function iniciarImportarHallazgo(){
   if(auditoriaObj.usuariosGerenciaCalificacion != null && 
      auditoriaObj.userHistorial.userSesionId == null){
      alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");   
      $("#modalImportHall").modal("hide");
      return;
   }
	
   $("#modalImportHall").modal("show");
   $("#btnSaveImportarHall").attr("onclick", "javascript:guardarImportarHallazgo();");
   $("#modalImportHall").find("textarea").val("");
}

function guardarImportarHallazgo(){
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
		return;
	}
	var texto = $("#txtListadoHall").val();
	var listExcel = texto.split('\n');
	var listHallazgos = [];
	var listHallRepe = [];
	var listFullNombres = "";
	var validado = "";
	if (texto.length < 10000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];
			if (filaTexto.trim().length < 1) {
				validado = "Existen filas vacias.";
				break;
			}   
			if (validado.length < 1 && listCells.length != 5) {
				validado = "No coincide el numero de celdas. ("
						+ listCells.length+"!=5 )";
				break;
			} else {
				var hallazgo = {}; 
				 
				hallazgo.area={};
				hallazgo.nivel={};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						hallazgo.descripcion = element.trim();
						if ($.inArray(hallazgo.nombre, listHallRepe) === -1) {
							listHallRepe.push(hallazgo.descripcion);
						} else {
							listFullNombres = listFullNombres + hallazgo.descripcion + ", ";
						}

					}  
					 
					if (j === 1) {
						listAreasHallazgo.forEach(function(val,index){
							if (val.areaName == element.trim()) {
								hallazgo.area.id = val.id;
							}
						});
						if (!hallazgo.area.id) {
							validado = "Area   no reconocida.";
							break;
						}
					}  
					if (j === 2) {
						listNivelRiesgoHallazgo.forEach(function(val,index){
							if (val.nombre == element.trim()) {
								hallazgo.nivel.id = val.id;
							}
						});
						if (!hallazgo.nivel.id) {
							validado = "Nivel   no reconocido.";
							break;
						}
					}

					if (j === 3) {
						hallazgo.causa = element.trim();
					} 
					if (j === 4) {
						hallazgo.lugar = element.trim();
					}
					hallazgo.auditoriaId=auditoriaId;
				
				}

				listHallazgos.push(hallazgo);
				if (listHallRepe.length < listHallazgos.length) {
					validado = "Existen hallazgos repetidos." + listFullNombres;
					//break;}
					validado=""
				}
			}
		}
	} else {
		validado = "Ha excedido los 10000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			var dataParam = {
					list : listHallazgos
			};
			
			callAjaxPost(URL + '/auditoria/hallazgo/masivo/save', dataParam,
					function (data) {
				switch (data.CODE_RESPONSE) {
				case "05":
					
						alert("Se guardaron exitosamente.");
						cargarHallazgosNeutral();
						$('#modalImportHall').modal('hide');
					
					break;
				default:
					alert("Ocurri&oacute; un error al guardar!");
				}
			});
		}
	} else {
		alert(validado);
	}
}

function cargarHallazgos(){
   banderaEdicion3 = false;
   hallazgoId = 0;
	
   $("#btnNuevoHall").show();$("#btnEliminarHall").hide();$("#btnVolverHall").hide();
   $("#btnGuardarHall").hide();$("#btnGraficoHall").show();
	
   $("#btnNuevoHall").attr("onclick","javascript:nuevoHallazgo();");
   $("#btnVolverHall").attr("onclick","javascript:cancelarHallazgo();");
   $("#btnGuardarHall").attr("onclick","javascript:guardarHallazgo();");
   $("#btnEliminarHall").attr("onclick","javascript:eliminarHallazgo();");
   $("#btnImportarHall").attr("onclick","javascript:iniciarImportarHallazgo();");
   $("#btnImportarHallNuevo").attr("onclick","javascript:verSmartImportHallazgos();");
	 
   $("#modalHallazgos").modal("show");	
}

function procesarDataHallazgos(data) {
   switch (data.CODE_RESPONSE) {
      case "05":
	 var list = data.list;
	 listHallazgoFull=list;
	 listAreasHallazgo=data.areas;
	 listNivelRiesgoHallazgo=data.niveles;
	 listSeccionesInteresadasHallazgo=data.secciones;
	 listAreasInteresadasHallazgo=data.areasInteresadas;
		
	 listFactorHallazgo=data.factor;
	 listTipoReporteHallazgo=data.tiposReporte;
		
	 $("#tblHallazgo tbody tr").remove();

	 listHallazgoFull.forEach(function(val,index){
	    if(val.evidenciaNombre.length>12){
				val.evidenciaNombre=val.evidenciaNombre.substr(0,12)+"...";
	    }
	    
	    var colorTextoEstadoHallazgo = (val.numAcciones == 0?"":
	       (val.numAccionesCompletada == val.numAcciones?"color:blue;":"color:red;"));
	    
	    var contenidoTextoEstadoHallazgo = (val.numAcciones == 0?"Sin acciones de mejora":
	       (val.numAccionesCompletada == val.numAcciones?"Acciones de mejora completadas":"Acciones de mejora pendientes"));
			
	    $("#tblHallazgo tbody").append(
               "<tr id='tr" + val.id+ "'>"
							+ "<td id='tddesc" + val.id	+ "'"+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">" 
								+ val.descripcion 
							+ "</td>"
							+ "<td id='tdtiprhall" + val.id+ "'"+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">" 
								+ val.tipoReporte.nombre 
							+ "</td>"
							//+ "<td id='tdareahall" + val.id	+ "'"+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">"
								//+ val.area.areaName 
							//+ "</td>"
							+ "<td id='tdnivhall" + val.id+ "'"+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">" 
								+ val.nivel.nombre 
							+ "</td>"
							+ "<td id='tdfachall" + val.id+ "'"+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">" 
								+ val.factor.nombre 
							+ "</td>"
							+ "<td id='tdcausa" + val.id+ "'"+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">" 
								+ val.causa
							+ "</td>" 
							+ "<td id='tdlugar" + val.id+ "'"+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">" 
								+ val.lugar	
							+ "</td>" 
							+ "<td id='tdhaarea" + val.id+ "'"+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">" 
								+ val.areasNombre
							+ "</td>" 
							+ "<td id='tdhasecc" + val.id+ "'"+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">" 
								+ val.seccionesNombre
							+ "</td>" 
							+ "<td id='tdaccion"+ val.id + "' "+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ") +">" 
								+(isCompleto?"<a class='efectoLink' onclick='agregarAccionMejora(6, "+ val.id  	 + ",4)'>"+
										"<i class='fa fa-list'></i>"+val.accion.estadoIcono+val.accion.resumen+"</a>":val.accion.estadoIcono+val.accion.resumen)
							+"</td>"
							+ "<td id='tdeviHall"+ val.id + "' style=''>"
							+ (isCompleto?"<a class='efectoLink' target='_blank' href='"+URL+"/auditoria/hallazgo/evidencia?hallazgoId="+val.id+"'  >" +
									"<i class='fa fa-download'></i>"+val.evidenciaNombre+"</a>":
										(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null?
											"<a class='efectoLink' target='_blank' href='"+URL+"/auditoria/hallazgo/evidencia?hallazgoId="+val.id+"'>" +
											(val.evidenciaNombre=="----"?"":"<i class='fa fa-download'></i>"+val.evidenciaNombre)+"</a>":"<i class='fa fa-picture-o'></i>"+val.evidenciaNombre))
							+"</td>"
							+ "<td class='gosst-desaprobado-color' id='asdasdasd"+ val.id + "'>"
							+ ( val.observacionGerencia)
							+"</td>"
							+ "<td id='hishall"+ val.id + "'>"
							+ ( "<a onclick='verHistorialRegistro(3,"+val.id+")' " +
									"class='efectoLink' ><i class='fa fa-search'></i></a>")
							+"</td>" +
		  "<td id='tdIndEstadoHall"+val.id+"' "+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ")+">" +
                      val.numAccionesCompletada+"/"+val.numAcciones + 
		  "</td>" +
                  "<td id='tdEstadoHall"+val.id+"' "+(isCompleto?"":"onclick='javascript:editarHallazgo("+index+")' ")+">" +
                     "<span style='"+colorTextoEstadoHallazgo+"font-weight:bold;'>"+contenidoTextoEstadoHallazgo+"</span>" + 
		  "</td>" +
	       "</tr>");
	    
			$("#tdeviHall" + val.id).on("click",function(e){
				var hallzgoId=parseInt($(this).prop("id").substr(9,15));
				if(!banderaEdicion3 || hallzgoId==hallazgoId){
				callAjaxPost(URL + '/auditoria/hallazgos/id', {id:hallzgoId},
					function(data){
						var alturaAux=$(window).height()*0.7;
						var anchoAux=$(window).height()*0.8;
						var nombreEvidencia=htmlEvidenciaHallz;
						var imagenPrevia=insertarImagenParaTablaMovil(data.hallazgo.evidencia,alturaAux+"px","100%");
						$("#mdVistaPreviaHallz").modal("show");
						$("#mdVistaPreviaHallz .modal-body #btnGuardarVista").attr("onclick","uploadEvidenciaHallazgoId("+hallzgoId+")");
						$("#mdVistaPreviaHallz .modal-body #btnDescargarVista").attr("onclick","location.href='"+URL
								+ "/auditoria/hallazgo/evidencia?hallazgoId="+ hallzgoId+"'");
						$("#mdVistaPreviaHallz .modal-body #divVistaImagenHallazgo").html(imagenPrevia).css({"background-color":"","color":""});
				},function(){
					$("#tdeviHall" + hallzgoId).html("<img src='../imagenes/gif/ruedita.gif'></img>Descargando");
				});
				}

			});
			$("#tdeviHall" + val.id).hover(function(){
				var hallzgoId=parseInt($(this).prop("id").substr(9,15));
				if(!banderaEdicion3 || hallzgoId==hallazgoId){
					$(this).css({"background-color":"#1c9da9","color":"white"});
					htmlEvidenciaHallz=$(this).html(); 
					$(this).html("<i class='fa fa-picture-o' aria-hidden='true'></i> Vista Previa");
				}
			},function(){
				var hallzgoId=parseInt($(this).prop("id").substr(9,15));
				if(!banderaEdicion3 || hallzgoId==hallazgoId){
				$(this).html(htmlEvidenciaHallz);
				$(this).css({"background-color":"","color":""});
				}
			});
		});
		formatoCeldaSombreableTabla(true,"tblHallazgo");
		if(!tablaFijaHallazgo){
			tablaFijaHallazgo=true;
			$("#wrapper3").css("height",$(window).height()*0.6-50+"px");
				goheadfixedY("#tblHallazgo","#wrapper3");
			}
		
		break;
	default:
		alert("Ocurrió un error al traer las auditorias!");
	}
	
}


function editarEvidenciaHallazgo(){
	$("#modalUploadHallazgo").modal("show");
}
function editarHallazgo(pindex) {
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
		return;
	}
	if (!banderaEdicion3) {
		hallazgoId = listHallazgoFull[pindex].id;
		hallazgoObj = listHallazgoFull[pindex]
		formatoCeldaSombreableTabla(false,"tblHallazgo");
		var textoEviExtra = "";
		if(hallazgoObj.evidenciaNombre != "" && hallazgoObj.evidenciaNombre != "----"){
		    textoEviExtra= "<br>"+
						"<a target='_blank' href='"+URL
						+ "/auditoria/hallazgo/evidencia?hallazgoId="+hallazgoObj.id+"' class='efectoLink'>" +
								"<i class='fa fa-download'></i>Descargar</a><br>"+
						"<a id='linkeviHall"+hallazgoObj.id+"' class='efectoLink'><i class='fa fa-eye'></i>Vista Previa</a>";
		}
		var options=
		{container:"#tdeviHall"+hallazgoId,
				functionCall:function(){ },
				descargaUrl: "/auditoria/hallazgo/evidencia?hallazgoId="+hallazgoId,
				esNuevo:false,
				idAux:"AudiHallazgo",
				evidenciaNombre:hallazgoObj.evidenciaNombre};
		crearFormEvidenciaCompleta(options);
		$("#tdeviHall"+hallazgoId).append(textoEviExtra);
		var descripcionHallazgo=hallazgoObj.descripcion;
		var area=hallazgoObj.area.id;
		var nivel=hallazgoObj.nivel.id;
		var factor=hallazgoObj.factor.id;
		var causaHallazgo=hallazgoObj.causa;
		var lugarHallazgo=hallazgoObj.lugar;

		var nombreEvidencia=hallazgoObj.evidenciaNombre;
		var iconoAccion=hallazgoObj.accion.estadoIcono;
		var nombreAccion=hallazgoObj.accion.resumen;
		//
		var seccionesId=hallazgoObj.seccionesId.split(",")
		listSeccionesInteresadasHallazgo.forEach(function(val){
			val.selected=0;
			seccionesId.forEach(function(val1){
				if(parseInt(val1)==val.id){
					val.selected=1;
				}
			})
		});	
		crearSelectOneMenuObligMultipleCompleto("slcSeccionesPermitidaHallazgo", "",
				listSeccionesInteresadasHallazgo,  "id", "nombre","#tdhasecc"+hallazgoObj.id,"Secciones interesadas ...");
								
		
		
		//
		var areasId=hallazgoObj.areasId.split(",")
		listAreasInteresadasHallazgo.forEach(function(val){
			val.selected=0;
			areasId.forEach(function(val1){
				if(parseInt(val1)==val.areaId){
					val.selected=1;
				}
			})
		});	
		crearSelectOneMenuObligMultipleCompleto("slcAreasPermitidaHallazgo", "",
				listAreasInteresadasHallazgo,  "areaId", "areaName","#tdhaarea"+hallazgoObj.id,"Áreas interesadas ...");
								
		
		 
		var selTipoReporteHallazgo= crearSelectOneMenuOblig("selTipoReporteHallazgo", "", listTipoReporteHallazgo, hallazgoObj.tipoReporte.id, 
				"id","nombre");
		
		$("#tdtiprhall"+hallazgoId).html(selTipoReporteHallazgo)
		//
		var selNivelHallazgo= crearSelectOneMenuOblig("selNivelHallazgo", "", listNivelRiesgoHallazgo, nivel, 
				"id","nombre");
		$("#tdnivhall"+hallazgoId).html(selNivelHallazgo)
		//
		
		
		
		var selFactorHallazgo= crearSelectOneMenuOblig("selFactorHallazgo", "", listFactorHallazgo, factor, 
				"id","nombre");
		$("#tdfachall"+hallazgoId).html(selFactorHallazgo)
		//
		
		/*
		*/
		$("#tddesc" + hallazgoId)
				.html(
						"<input type='text' id='inputDesc' class='form-control' " +
						"placeholder='Descripcion'  value='"
								+ descripcionHallazgo + "'>");
		$("#tdcausa" + hallazgoId)
		.html(
				"<input type='text' id='inputCausa' class='form-control' " +
				"placeholder='Causa' value='"
						+ causaHallazgo + "'>");
		$("#tdlugar" + hallazgoId)
		.html(
				"<input type='text' id='inputLugarHallazgo' class='form-control' " +
				"placeholder='Lugar'  >");
		$("#inputLugarHallazgo").val(lugarHallazgo)
		$("#tdaccion" + hallazgoId).html(
				"<a href='#' onclick='javascript:agregarAccionMejora(6, "
						+ hallazgoId + ",4);'>"+nombreAccion+"</a>");
	
		
		/** ************************************************************************* */
		var textIn2="<i class='fa fa-2x fa-list'></i>"+$("#tdaccionag"+hallazgoId).text();
		$("#tdaccionag"+hallazgoId+"").html(""+textIn2)
		.addClass("linkGosst")
		.on("click",function(){
			cargarAccionesHallazgosProyecto();
		})
	
		banderaEdicion3 = true;
		
		$("#btnNuevoHall").hide();$("#btnEliminarHall").show();$("#btnVolverHall").show();
		$("#btnGuardarHall").show();$("#btnGraficoHall").hide();
	}
	
}
function editarEvidenciaAuditoria(){
	
	$("#modalUploadAuditoria").modal("show");
}

function nuevoHallazgo(isProy) {
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");  
		return;
	}
	if (!banderaEdicion3) {
		hallazgoId = 0;
		var selAreaHallazgo= crearSelectOneMenuOblig("selAreaHallazgo", "", listAreasHallazgo, "", 
				"areaId","areaName");
		$("#tdareahall"+hallazgoId).html(selAreaHallazgo)
		
		//
		var selTipoReporteHallazgo= crearSelectOneMenuOblig("selTipoReporteHallazgo", "", listTipoReporteHallazgo, "", 
				"id","nombre");
		
		//
		var selNivelHallazgo= crearSelectOneMenuOblig("selNivelHallazgo", "", listNivelRiesgoHallazgo, "", 
				"id","nombre");
		var selFactorHallazgo= crearSelectOneMenuOblig("selFactorHallazgo", "", listFactorHallazgo, "", 
				"id","nombre");
		
		

		$("#tblHallazgo tbody:first")
				.prepend(
						"<tr id='0'>" 
						
								+ "<td>"
								+"<input type='text' id='inputDesc' autofocus='true'  class='form-control'>"
								+"</td>"
								+"<td>"+selTipoReporteHallazgo+"</td>"
								//+(isProy?"":"<td>"+selAreaHallazgo+"</td>")
								+"<td>"+selNivelHallazgo+"</td>"
								+"<td>"+selFactorHallazgo+"</td>"
								+ ""
								+(isProy?"":"<td><input type='text' id='inputCausa'  class='form-control'></td>")
								+""
								+ "<td>"
								+"<input type='text' id='inputLugarHallazgo'  class='form-control'>"
								+"</td>"
								+ (isProy?"":"<td id='tdhaarea0'>...</td>")
								+ (false?"":"<td id='tdhasecc0'>...</td>")
								+ "<td>...</td>"
								+ "<td id='tdeviHall"+hallazgoId+"'>...</td>"
								+"<td></td>"
								+ "</tr>");	
		crearSelectOneMenuObligMultipleCompleto("slcSeccionesPermitidaHallazgo", "",
				listSeccionesInteresadasHallazgo,  "id", "nombre","#tdhasecc"+hallazgoId,"Secciones interesadas ...");
		crearSelectOneMenuObligMultipleCompleto("slcAreasPermitidaHallazgo", "",
				listAreasInteresadasHallazgo,  "areaId", "areaName","#tdhaarea"+hallazgoId,"Áreas interesadas ...");
			
		
		//
		var options=
		{container:"#tdeviHall"+hallazgoId,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"AudiHallazgo",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
		
		
		formatoCeldaSombreableTabla(false,"tblHallazgo");

		banderaEdicion3 = true;
		
		$("#btnNuevoHall").hide();$("#btnEliminarHall").hide();$("#btnVolverHall").show();
		$("#btnGuardarHall").show();$("#btnGraficoHall").hide();
		
		$("#inputDesc").focus();
	} else {
		alert("Guarde primero.");
	}
}

function cancelarHallazgo(isProy) {
	cargarHallazgosNeutral(isProy);
}

function eliminarHallazgo(isProy) {
	var r = confirm("¿Está seguro de eliminar el hallazgo?");
	if (r == true) {
		var dataParam = {
				id : hallazgoId,
		};

		callAjaxPost(URL + '/auditoria/hallazgo/delete', dataParam,
				function(data){
			switch (data.CODE_RESPONSE) {
			case "05":
				cargarHallazgosNeutral(isProy);
				break;
			default:
				alert("Ocurrió un error al eliminar la auditoria!");
			}
		});
	}
}
 

function guardarHallazgo(isProy) {
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
		cancelarHallazgo();
		return;
	}
	var campoVacio = true;
	var inputDesc = $("#inputDesc").val();
	var inputCausa = $("#inputCausa").val();
	var inputLugarHallazgo = $("#inputLugarHallazgo").val();
	//var area = $("#selAreaHallazgo").val();
	var nivel= $("#selNivelHallazgo").val();
	var factor= $("#selFactorHallazgo").val();
	var tipoReporte = $("#selTipoReporteHallazgo").val();
	var secciones=$("#slcSeccionesPermitidaHallazgo").val();
	var listSecciones=[];
	if($("#slcSeccionesPermitidaHallazgo").length>0){
		secciones.forEach(function(val,index){
			listSecciones.push({id:val});
		});
	}
	var areas=$("#slcAreasPermitidaHallazgo").val();
	var listAreas=[];
	if($("#slcAreasPermitidaHallazgo").length>0){
		areas.forEach(function(val,index){
			listAreas.push({areaId:val});
		});
	}
	
	if (campoVacio) {

		var dataParam = {
			id : hallazgoId,secciones:listSecciones,areas:listAreas,
			tipoReporte: {id:tipoReporte},
			descripcion : inputDesc,
			//area:{areaId:area},
			nivel:{id:nivel},factor:{id:factor},
			causa: inputCausa,
			lugar:inputLugarHallazgo,
			empresaId : getSession("gestopcompanyid"),
			auditoriaId: auditoriaId
		};
		 
		    getLocation(function(){
			dataParam.posicion = {
			    x : posicionX,
			    y : posicionY
			}
			callAjaxPost(URL + '/auditoria/hallazgo/save', dataParam,
				function(data){
				procesarGuardarHallazgo(data,isProy);
			    });
		    });
		
		
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
function procesarGuardarHallazgo(data,isProy){
	switch (data.CODE_RESPONSE) {
	case "05":
	    if($("#fileEviAudiHallazgo").length == 0){
		cargarHallazgosNeutral(isProy);
	    }else{
		guardarEvidenciaAuto(data.nuevoId,"fileEviAudiHallazgo"
			,bitsEvidenciaHallazgo,
			"/auditoria/hallazgo/evidencia/save",function(){
		cargarHallazgosNeutral(isProy);
	},"hallazgoId");
	    }
	    break;
	default:
		alert("Ocurrió un error al guardar la auditoria!");
	}
	
}
function uploadEvidenciaHallazgo(){
	$.blockUI({message:'cargando...'}); 
	guardarEvidenciaAuto(hallazgoId,"fileEviHallazgo",bitsEvidenciaHallazgo,
			"/auditoria/hallazgo/evidencia/save",function(){
		$.unblockUI();
		var inputFileImage = document.getElementById("fileEviHallazgo");
		var file = inputFileImage.files[0];
		$("#tdeviHall"+hallazgoId+" ").html(file.name);
		$("#modalUploadHallazgo").modal("hide");
	},"hallazgoId");
		
}
function uploadEvidenciaHallazgoId(hallazgoId){
	if(auditoriaObj.usuariosGerenciaCalificacion!=null && auditoriaObj.userHistorial.userSesionId==null)
	{
		alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");
		return;
	}
	$.blockUI({message:'cargando...'}); 
	guardarEvidenciaAuto(hallazgoId,"fileEviHallz",bitsEvidenciaHallazgo,
			"/auditoria/hallazgo/evidencia/save",function(){
		$.unblockUI();
		$('#mdVistaPreviaHallz').modal('hide');
		var inputFileImage = document.getElementById("fileEviHallz");
		var file = inputFileImage.files[0];
		$("#tdeviHall"+hallazgoId).html(file.name);
	},"hallazgoId");
		
}
var banderaEdicionRespuestaHall=false;
var listFullAccionesAsociadasHallazgo=[];
function cargarAccionesHallazgosProyecto(){
	var dataParam2={
			id:hallazgoId
	}
	callAjaxPostNoLoad(URL + '/auditoria/hallazgo/acciones', dataParam2,
			function(data){
	if(data.CODE_RESPONSE="05"){
		$("#tabProyectos .container-fluid").hide();
		$("#tabProyectos #divHallAcciones").show();  
		$("#tabProyectos h2").html(
				"<a onclick='volverDivProyectos()'>Proyecto ("+
				proyectoObj.titulo+") </a> " +
				"><a onclick='volverDivAuditoriaProyecto()'> '"+ nombreTipoAudi+"' "+convertirFechaNormal(auditoriaFecha)+"</a>" +
						" > <a onclick='volverDivHallazgosProy()'>Hallazgo "+hallazgoObj.descripcion+"</a>" +
						"> Acciones Asociados");

		
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
		
		
		$("#tblAccionesHall tbody tr").remove();
		listFullAccionesAsociadasHallazgo=data.list;
		listFullAccionesAsociadasHallazgo.forEach(function(val2,index){
			val2.id=val2.accionMejoraId;
			var btnDescarga="<br><a class='btn btn-success' target='_blank' " +
			"href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val2.accionMejoraId+"'>" +
					"<i class='fa fa-download'></i>Descargar</a>";
	if(val2.evidenciaNombre==""
		|| val2.evidenciaNombre=="----"){
		btnDescarga="";
	}
			$("#tblAccionesHall tbody").append(
					"<tr>" +
					 "<td >"+val2.descripcion+"</td>" +
						"<td >"+val2.fechaRevisionTexto+"</td>" +
						"<td >"+val2.fechaRealTexto+"</td>" +
						"<td >"+val2.observacion+"</td>" +
						"<td id='actpresp"+val2.id+"'>"+val2.respuesta+
						"<button onclick='modificarRespuestaAccionMejoraHallazgo("+index+")' class='btn btn-success'>" +
						"Modificar respuesta <i class='fa fa-envelope-o'></i>" +
						"</button>"+"</td>" +
						"<td >"+val2.evidenciaNombre+btnDescarga+"</td>" +
						"<td >"+val2.estadoCumplimientoNombre+"</td>" +
					"</tr>"
			)
		});
		banderaEdicionRespuestaHall=false;
		
		}else{
			console.log("NOP")
		}
	});
}
function modificarRespuestaAccionMejoraHallazgo(pindex){
	 if(!banderaEdicionRespuestaHall){ 
		 banderaEdicionRespuestaHall=true;
	 var accObj=listFullAccionesAsociadasHallazgo[pindex]; 
	 var btnVolver="<button onclick='volverModificarRespuestaHallazgo("+pindex+")' class='btn btn-danger'>" +
		" <i class='fa fa-arrow-left'></i>" +
		"</button>";
	 var btnGuardar="<button onclick='guardarModificarRespuestaHallazgo("+pindex+")' class='btn btn-success'>" +
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
function volverModificarRespuestaHallazgo(pindex){
	cargarAccionesHallazgosProyecto();
}
function guardarModificarRespuestaHallazgo(pindex){
	 var accObj=listFullAccionesAsociadasHallazgo[pindex];
	 var accSend={accionMejoraId:accObj.id,
			 respuesta:$("#inputRespAccASoc").val()}
	 callAjaxPost(URL + '/gestionaccionmejora/accionmejora/respuesta/save', 
			 accSend, function(data){
		 
		 cargarAccionesHallazgosProyecto();
	 });  
}

function verSmartImportHallazgos(){
   if(auditoriaObj.usuariosGerenciaCalificacion != null && 
      auditoriaObj.userHistorial.userSesionId == null){
      alert("No se puede realizar la accion porque el evento esta en evaluación o esta cerrado");   
      $("#modalImportHall").modal("hide");
      return;
   }
   
   $("#modalHallazgos").modal("hide");
   
   var textBackUp = "<a class='efectoLink' href='"+URL+"/auditoria/hallazgo/masivo/plantilla'  " +
                       "target='_blank'>" +
                       "<i class='fa fa-download'></i> Descargar"+
                    "</a>";
   
   var listItemsForm=[
          {sugerencia:"",
           label:"<i class='fa fa-download'></i> Plantilla ",
           inputForm:textBackUp,divContainer:""},
          {sugerencia:"",
           label:"<i class='fa fa-info'></i> Archivo Excel: ",
           inputForm:"",divContainer:"divExcelImportHallazgo"},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:" ",label:"",
           inputForm:"<button class='btn btn-success' style='float:right;'>" +
           	        "<i class='fa fa-floppy-o'></i> Guardar" +
           	     "</button>",divContainer:""}
          	     ];

   var text="";
    	
   listItemsForm.forEach(function(val,index){
      text+=obtenerSubPanelModuloGeneral(val);
   });
    	
   var contenido="<form id='formImportEventoHallazgo' class='eventoGeneral'>" +
                    "<div id='tituloEvento'>" + 
                        text+
                    "</div>"+
                 "</div>" +
                 "</form>";  

   var listPaneles={
	  id:"divImportHallazgo",
	  nombre:"Importar hallazgo (import)",
	  clase:"listaAuxiliar",
	  contenido:contenido
	           };
   
   crearModalPrincipalUsuario(listPaneles,function(){
      var options={
	     container: "#divExcelImportHallazgo",
	     functionCall: function(){},
	     descargaUrl: "",
	     esNuevo: true,
	     idAux: "ImportExcelHallazgo",
	     evidenciaNombre: ""
		  };
  
      crearFormEvidenciaCompleta(options);
   },false,true);

   $("#formImportEventoHallazgo").on("submit",function(e){
      e.preventDefault();
      enviarExcelImportHallazgo();
   });		
}

function enviarExcelImportHallazgo(){
   guardarEvidenciaAuto(0,"fileEviImportExcelHallazgo",bitsEvidenciaActoInseguro,
      "/auditoria/hallazgo/masivo/nuevo/save",function(data){
         //alert(data.mensaje);
         if(data.mensaje.length > 0){alert(data.mensaje);}
 	    verSmartFinalizarImportHallazgo();
      },"id",[{id:"auditoriaId",value:auditoriaId}]);
}

function verSmartFinalizarImportHallazgo(){
     
   $("#divImportHallazgo").remove();
    
   var listItemsForm=[
          {sugerencia:"",
           label:"<i class='fa fa-check'></i> Mensaje ",
           inputForm:"Carga de registros completa",divContainer:""},
          {sugerencia:" ",label:"",
           inputForm:"<button class='btn btn-success'>" +
           	        "<i class='fa fa-check'></i> Finalizar" +
           	     "</button>",divContainer:""}
 		     ];
   var text="";
    
   listItemsForm.forEach(function(val,index){
      text+=obtenerSubPanelModuloGeneral(val);
   });
 		       
   var contenido="<form id='formImportFinalEvento' class='eventoGeneral'>" +
 		    "<div id='tituloEvento'>" + 
 		        text +
 		    "</div>" +
 		 "</div>" +
 		 "</form>";  
 		       	
   var listPaneles={
	  id:"divImportFinalHallazgo",
	  nombre:"Finalizar Import Registros",
	  clase:"listaAuxiliar",
	  contenido:contenido
	           };
 		       	
   agregarModalPrincipalColaboradorGeneral(listPaneles,function(){});
 		
   $("#formImportFinalEvento").on("submit",function(e){
      e.preventDefault();
      $(".modal").modal("hide");
      $("#divImportHallazgo").remove();
      $("#divImportFinalHallazgo").remove();
      cargarHallazgos();
   });
}

function verGraficoPorEstadoHallazgoLibre(){
   $("#modalHallazgos").modal("hide");
   $("#modalGraficoHallazgoLibreAudi").remove();
    
   var modalOptions={
      id: "modalGraficoHallazgoLibreAudi",maxWidth: "90%",
      nombre: "Gráfico Hallazgos Libres - Estado",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoHallazgoLibreAudi'></div>"
   };
    
   var numHallazgosLibresAccMejCompletados = 0,numHallazgosLibresAccMejPendientes = 0,
       numHallazgosLibresAccMejSinNinguna = 0;
       
   listHallazgoFull.forEach(function(val){
      if(val.numAcciones == 0){
 	 numHallazgosLibresAccMejSinNinguna++;
      }else if(val.numAccionesCompletada == val.numAcciones){
 	 numHallazgosLibresAccMejCompletados++;
      }else{
 	 numHallazgosLibresAccMejPendientes++;
      }
   });
    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoHallazgoLibreAudi",190);
  	 	
   Highcharts.chart('divGraficoHallazgoLibreAudi',{
      chart: {type: 'column'},
      title: {
 	 text: "Gráfico Hallazgos Libres - Estado",
 	 style: {fontWeight: 'bold',fontSize: '20px'}},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
  	    text: "Número de hallazgos libres",
  	    style: {fontWeight: 'bold',fontSize: '18px'}}},
         plotOptions: {
  	    column: {
               dataLabels: {
                  enabled: true,color: 'black',style: {fontSize: '25px'}},
  	    enableMouseTracking: false}},
      series: [
 	 {name: 'Acciones de mejora completadas',data: [numHallazgosLibresAccMejCompletados],color: 'blue'},
 	 {name: 'Acciones de mejora pendientes',data: [numHallazgosLibresAccMejPendientes],color: 'red'},
 	 {name: 'Sin acciones de mejora',data: [numHallazgosLibresAccMejSinNinguna],color: 'black'}]
   });     
   
   $("#modalGraficoHallazgoLibreAudi").on("hidden.bs.modal",function(){
      $("#modalHallazgos").modal("show");
   });
}
