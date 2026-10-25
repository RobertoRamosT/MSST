/**
 * 
 */ 

		
window.onresize = function(event) {
	ajustarBarraSizeTop("eventosGosstMovil");
}
function ajustarBarraSizeTop(divId){
	var alturaBarra=0;
	$("#barraMenu").css("height")
	if($("#barraMenu").is(":visible")){
		alturaBarra=$("#barraMenu").css("height");
	}else{
		alturaBarra="0px";
	}
	$("#"+divId).css({"top":alturaBarra});
}
function modificarNuevoEventoMovil( ){
	
}

$("#graficoResumenEventos").on("click",function(){
	$("#graficoResumenEventos").hide();
	$("#nuevoEventoGosst").hide();
	$("#buscarEventoGosst").hide();
	$("#eventosGosstMovil").append("<div id='grafEventosGosst'></div>");
	cambiarGraficoEvento(); 
	$("#eventosGosstMovil").prepend("<div class='cancelarFormMovil' >" +
	"<i class='fa fa-chevron-circle-left fa-2x' aria-hidden='true'></i>Volver</div>  ");
	
	$(".cancelarFormMovil").on("click",function(){
		$("#eventosGosstMovil #grafEventosGosst").remove(); 
		$("#eventosGosstMovil .seguirFormMovil").remove();
		$("#eventosGosstMovil .cancelarFormMovil").remove();
		
		$("#graficoResumenEventos").show();
		$("#nuevoEventoGosst").show();
		$("#buscarEventoGosst").show();
	});
});
$("#buscarEventoGosst").on("click",function(){
	var dataParam = {
			matrixId : getUrlParameter("mdfId"),
			isRevisado:0
			};
	callAjaxPost(URL + '/acinseguro/movil/historial', dataParam,
			function(data){
		switch (data.CODE_RESPONSE) {
		case "05":
			listTabla=data.actos;
			listTablaAux=listTabla;
			$("#graficoResumenEventos").hide();
			$("#nuevoEventoGosst").hide();
			$("#buscarEventoGosst").hide();
			
				 

			$("#eventosGosstMovil").append("<div id='vistaEventosGosst'></div>");
			listTabla.forEach(function(val,index){
				$("#vistaEventosGosst").append("<div class='imagenEventoGosst'>"+insertarImagenParaTablaMovil(val.evidencia, "100%",
				"50%")+"<div style='float:right;width:50%;word-wrap: break-word; text-align: left;'>"+
				 "<label> Fecha del reporte: </label> "+convertirFechaNormal(listTabla[index].reporteFecha)+"<br>"+
				"<label> Tipo del reporte: </label> "+val.acInseguroTipoNombre +" - <br>"+
				"<label> Descripción: </label> "+val.acInseguroNombre+"<br>" +
				"<label> Nivel de riesgo: </label> "+val.nivelRiesgoNombre+	"<br>" +
				"<label> Area: </label> "+val.areaNombre+		"<br>" +
				"<label> Lugar:</label>  "+val.reporteLugar+"<br>"+
				"<div class='checkbox checkbox-filtro checkbox-inline'>" +
				"<input id='revisarEvento"+val.acInseguroId+"' type='checkbox' ><label for='revisarEvento"+val.acInseguroId+"'> Revisado </label> </div>"+
				"</div>" +
				
						"</div>");
				$("#revisarEvento"+val.acInseguroId).on("click",function(){
					var actoId=$(this).prop("id").substr(13,9);
					
					
					var dataParam=val;
					dataParam.isRevisado=($(this).prop("checked")?1:0);
					dataParam.evidencia=null;
					callAjaxPost(URL + '/acinseguro/save/revision', dataParam,
							procesarResultadoGuardarACInseguro,function(){
					 
					});
					
					
					
				});
			});
			
			$("#eventosGosstMovil").prepend("<div class='cancelarFormMovil' id='cancelarHistorialEventos'>" +
			"<i class='fa fa-chevron-circle-left fa-2x' aria-hidden='true'></i>Volver</div>  ");
			$("#eventosGosstMovil").prepend("<div class='cancelarFormMovil' id='cancelarFiltroEvento'>" +
			"<i class='fa fa-chevron-circle-left fa-2x' aria-hidden='true'></i>Volver</div>  ");
			$("#eventosGosstMovil").prepend("<div class='cancelarFormMovil' id='cancelarOpcionesEvento'>" +
			"<i class='fa fa-chevron-circle-left fa-2x' aria-hidden='true'></i>Volver</div>  ");
			$("#eventosGosstMovil").prepend("<div class='filtroDivMovil' >" +
			"<i class='fa fa-file-excel-o fa-2x' aria-hidden='true'></i>Filtro</div>  ");
			$("#eventosGosstMovil").prepend("<div class='descargarDivMovil' >" +
			"<i class='fa fa-file-excel-o fa-2x' aria-hidden='true'></i>Descargar</div>  ");
			$("#cancelarHistorialEventos").on("click",function(){
				$("#eventosGosstMovil #vistaEventosGosst").remove(); 
				$("#eventosGosstMovil .seguirFormMovil").remove();
				$("#eventosGosstMovil .cancelarFormMovil").remove();
				$("#eventosGosstMovil .filtroDivMovil").remove();
				$("#eventosGosstMovil .descargarDivMovil").remove();
				
				$("#graficoResumenEventos").show();
				$("#nuevoEventoGosst").show();
				$("#buscarEventoGosst").show();
			});
			$("#cancelarFiltroEvento").on("click",function(){
				$("#vistaEventosGosst").find("div").hide();
				$(".descargarDivMovil").hide();
				$(".filtroDivMovil").show();
				$("#cancelarHistorialEventos").show();
				$(this).hide();
				var isRevisado=($("#revisarEvento0").prop("checked")?1:0);
				console.log(isRevisado);
				var dataParam = {
						matrixId : getUrlParameter("mdfId"),
						isRevisado:isRevisado
						};
				callAjaxPost(URL + '/acinseguro/movil/historial', dataParam,
						function(data){
					switch (data.CODE_RESPONSE) {
					case "05":
						listTablaAux=data.actos;
						
						listTabla=filtrarListActosSubestandar();
						listTabla.forEach(function(val,index){
							var checkRevisado=($("#revisarEvento0").prop("checked")?"checked":"");
							
							$("#vistaEventosGosst").append("<div class='imagenEventoGosst'>"+insertarImagenParaTabla(val.evidencia, "100%",
							"50%")+"<div style='float:right;width:50%;word-wrap: break-word; text-align: left;'>"+
							 "<label> Fecha del reporte: </label> "+convertirFechaNormal(listTabla[index].reporteFecha)+"<br>"+
							"<label> Tipo del reporte: </label> "+val.acInseguroTipoNombre +" - <br>"+
							"<label> Descripción: </label> "+val.acInseguroNombre+"<br>" +
							"<label> Nivel de riesgo: </label> "+val.nivelRiesgoNombre+	"<br>" +
							"<label> Area: </label> "+val.areaNombre+		"<br>" +
							"<label> Lugar:</label>  "+val.reporteLugar+"<br>"+
							"<div class='checkbox checkbox-filtro checkbox-inline'>" +
							"<input id='revisarEvento"+val.acInseguroId+"' type='checkbox' "+checkRevisado+"><label for='revisarEvento"+val.acInseguroId+"'> Revisado </label> </div>"+
							"</div>" +
							"</div></div>");
							$("#revisarEvento"+val.acInseguroId).on("click",function(){
								var actoId=$(this).prop("id").substr(13,9);
								
								
								var dataParam=val;
								dataParam.isRevisado=($(this).prop("checked")?1:0);
								dataParam.evidencia=null;
								callAjaxPost(URL + '/acinseguro/save/revision', dataParam,
										procesarResultadoGuardarACInseguro,function(){
								 
								});
								
								
								
							});
						});
						break;
					}
				});
				
				
			});
			$("#cancelarOpcionesEvento").on("click",function(){
				$(this).hide();
				$("#cancelarFiltroEvento").show(); 
				$(".listOpcionFiltroGosst").show();
				$(".opcionFiltroGosst").hide();
				
				
				arrayFiltroTipo=[]; 
				arrayFiltroCausa=[];
				arrayFiltroNivel=[];
				arrayFiltroArea=[];
				
				$("#selActTipo .opcionFiltroGosst input").each(function(index,elem){
					if($(elem).prop("checked")){
						var idAux=parseInt($(elem).prop("id").substr(7,4));
						arrayFiltroTipo.push(idAux);
					} 
				}); 
				
				$("#selCausa .opcionFiltroGosst input").each(function(index,elem){
					if($(elem).prop("checked")){
						var idAux=parseInt($(elem).prop("id").substr(7,4));
						arrayFiltroCausa.push(idAux);
					}
					
				 
				});
				$("#selNivel .opcionFiltroGosst input").each(function(index,elem){
					if($(elem).prop("checked")){
					var idAux=parseInt($(elem).prop("id").substr(7,4));
					arrayFiltroNivel.push(idAux);
					}
				}); 
				$("#selArea .opcionFiltroGosst input").each(function(index,elem){
					if($(elem).prop("checked")){
						var idAux=parseInt($(elem).prop("id").substr(7,4));
					arrayFiltroArea.push(idAux);
					}
				 
				}); 
				 fechaInicioFiltro=$("#fechaInicioFiltro").val();
				  fechaFinFiltro=$("#fechaFinFiltro").val();
				
				if(arrayFiltroTipo.length!=listActInsegTipo.length){
					$("#selActTipo .tituloFiltro").html("Tipo de Evento ("+arrayFiltroTipo.length+" de "+listActInsegTipo.length+")");
				}else{
					$("#selActTipo .tituloFiltro").html("Tipo de Evento (Todos)")
				}
				if(arrayFiltroCausa.length!=listCausaBasica.length){
					$("#selCausa .tituloFiltro").html("Causa Inmediata ("+arrayFiltroCausa.length+" de "+listCausaBasica.length+")");
				}else{
					$("#selCausa .tituloFiltro").html("Causa Inmediata (Todos)")
				}
				if(arrayFiltroNivel.length!=listNivel.length){
					$("#selNivel .tituloFiltro").html("Nivel de Riesgo ("+arrayFiltroNivel.length+" de "+listNivel.length+")");
				}else{
					$("#selNivel .tituloFiltro").html("Nivel de Riesgo (Todos)")
				}
				if(arrayFiltroArea.length!=listArea.length){
					$("#selArea .tituloFiltro").html("Área Involucrada ("+arrayFiltroArea.length+" de "+listArea.length+")");
				}else{
					$("#selArea .tituloFiltro").html("Área Involucrada (Todos)")
				}
				
				 
				
			});
			$("#cancelarFiltroEvento").hide();
			$("#cancelarOpcionesEvento").hide();
			$("#eventosGosstMovil .descargarDivMovil").hide();
			$(".filtroDivMovil").on("click",function(){
				$(this).hide();
				$("#eventosGosstMovil .descargarDivMovil").show();
				$("#cancelarHistorialEventos").hide();
				$("#cancelarFiltroEvento").show();
				var vista=$("#vistaEventosGosst");
				vista.html("");
				
				var selActTipo = crearSelectOneMenuMovil("selActTipo", "verFiltroEvento(1)", listActInsegTipo,
						"-1","Tipo de Evento", "actTipoId", "actTipoName",null,"opcionA");
				
				var selCausa = crearSelectOneMenuMovil("selCausa", "verFiltroEvento(2)", listCausaInmediataSimple, "-1",
						"Causa Inmediata","causaInmId","causaInmNombre", "causaInmTipoEvent","opcionB");
				
				var selArea = crearSelectOneMenuMovil("selArea", "verFiltroEvento(3)", listArea, "-1",
						"Área Involucrada","areaId", "areaName",null,"opcionC");
				var selNivel = crearSelectOneMenuMovil("selNivel", "verFiltroEvento(4)", listNivel, -1,
						"Nivel de Riesgo","nivelRiesgoId", "nivelRiesgoNombre",null,"opcionD"); 
				
				var filtroFecha="<div class='listOpcionFiltroGosst' onclick='verFiltroEvento(5)' id='selFechasEventos'>" +
							"<div class='tituloFiltro'>Rango de Fechas</div>"+
							"<div class='opcionFiltroGosst'>Desde: <input class='form-control' type='date' id='fechaInicioFiltro' value='2017-01-01'>  </div>" +
							"<div class='opcionFiltroGosst'>Hasta: <input class='form-control' type='date' id='fechaFinFiltro'  value='2017-12-31'>  </div>" +
						"</div>";
				var filtroRevision="<div class='listOpcionFiltroGosst' onclick='verFiltroEvento(6)' id='selRevisionEventos'>" +
				"<div class='tituloFiltro'>Estado Revisión</div>"+
				"<div class='opcionFiltroGosst'> " +
				"<div class='checkbox checkbox-filtro checkbox-inline'>" +
				"<input id='revisarEvento0' type='checkbox' ><label for='revisarEvento0'> Revisado </label> </div>"+
				"</div>" + 
			 "</div>";
				vista.append(selActTipo)
				.append(selArea)
				.append(selCausa)
				.append(selNivel).append(filtroFecha).append(filtroRevision)  
				;
				 
				
				$(".descargarDivMovil").on("click",function(){
					var listaActosId="";
					listTabla.forEach(function(val,index){
						listaActosId=listaActosId+val.acInseguroId+","
					});
					window.open(URL
							+ "/acinseguro/reporte/excel?listActos="
							+ listaActosId + '&nada=_blank');	 
				});
				
			});
			
			
			break;
		default:
			alert("Ocurrió un error al traer las actos inseguros!");
		}
	});
});
function verFiltroEvento(filtroId){
	$(".listOpcionFiltroGosst").hide();
	$(".cancelarFormMovil").hide();
	$("#cancelarOpcionesEvento").show();
	$("#eventosGosstMovil .descargarDivMovil").show();
	$(".filtroDivMovil").hide();
	var divFiltro
	switch(parseInt(filtroId)){
	case 1:
		 divFiltro=$("#selActTipo");
		 break;
	case 2:
		 divFiltro=$("#selCausa"); 
		 break;
	case 3:
		 divFiltro=$("#selArea"); 
		 break;
	case 4:
		 divFiltro=$("#selNivel"); 
		 break;
	case 5:
		 divFiltro=$("#selFechasEventos"); 
		break;
	case 6:
		divFiltro=$("#selRevisionEventos");
		break;
	}
	divFiltro.show();
	divFiltro.find(".opcionFiltroGosst").show();
}
$("#nuevoEventoGosst").on("click",function(){
	$("#graficoResumenEventos").hide();
	$("#nuevoEventoGosst").hide();
	$("#buscarEventoGosst").hide();
	
	var selActTipo = crearSelectOneMenu("selActTipo", "verCategAcordeTipoActoInseguro()", listActInsegTipo,
			"-1", "actTipoId", "actTipoName","Tipo de Evento");

	var selCausa = crearSelectOneMenuY("selCausa", "", listCausaInmediataSimple, "-1",
			"causaInmId","causaInmTipoEvent", "causaInmNombre","Causa Inmediata");
	
	var selArea = crearSelectOneMenu("selArea", "", listArea, "-1",
			"areaId", "areaName","Área Involucrada");
	var selNivel = crearSelectOneMenu("selNivel", "", listNivel, -1,
			"nivelRiesgoId", "nivelRiesgoNombre","Nivel de Riesgo");
	var selOrigen=crearSelectOneMenu("selOrigen", "", listOrigenReporte, "-1",
			"id", "nombre","Origen");
	var inputEvi="<div class='input-group'>"+
   " <label class='input-group-btn'>"+
    "<span class='btn btn-primary'>"+
    "<i class='fa fa-camera' aria-hidden='true'></i>"+
      "  Buscar Evidencia&hellip; <input style='display: none;' "+
       " type='file' name='fileEviMovil' id='fileEviMovil' "+
"accept='image/jpg,image/png,image/jpeg,image/gif'>"+
   " </span>"+
"</label>"+
"<input type='text' id='textInputEvi' class='form-control' readonly>"+
	" </div>";
	$("#barraMenu").hide();
$("#eventosGosstMovil").css({"top":"0px"});
	var formatoNuevo="";
	var estilloNUevo=" style='width:50%;display:inline-block'";
	if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 1){
		formatoNuevo="<div class='principalMovil'><label>Datos Principales</label><div class='formNuevoEvento1'>" +
		 
		 "<form class='form-inline'>" +
		 "<div class='form-group' style='width: 50%;display: inline-block;'>" +
		 selActTipo+
		"</div>"+
		"<div class='form-group' style='width: 50%;display: inline-block;'>" +
		selOrigen+
		" </div></form>" +
		
		"</div>"+
		"<div class='formNuevoEvento1'> " +
		inputEvi+
		"</div>"+
		
		"<div class='formNuevoEvento1'>" + 
		 "<input type='text' id='inputNom' class='form-control form-movil' placeholder='Descripción'>" +
		 "</div>"+
			"<div class='formNuevoEvento1'>" + 
			"<input type='text' id='inputAccRep'class='form-control form-movil' placeholder='Corrección inmediata del trabajador'>" +
				"</div>"+
		 "<div class='formNuevoEvento1' >" +
		 
		 "<form class='form-inline'>" +
		 "<div class='form-group' id='divSelTipoRep'>" +
		 "<select class='form-control' id='selTipoRep' onchange='listaTrabAcordeTipoMovil()'>"+
			"<option value='-1'>Reporte</option>"+
			"<option value='1'>Interno</option>"+
			"<option value='2'>Externo</option>"+
		"</select></div>"+
		"<div class='form-group' id='divInputNomRep'>" +
		" </div></form>" +
		"</div>"+
		 "</div>"+
		 "<div class='secundarioMovil'>"+
		 "<label>Datos Secundarios</label><div class='formNuevoEvento2'>" +
		 "<input   id='inputLug' class='form-control' placeholder='Lugar'></div>"+
		 
		"<div class='formNuevoEvento2'>" +
		 selArea+
		"</div>"+
		"<div class='formNuevoEvento2'>" +
		 selCausa+
		"</div>"+
		"<div class='formNuevoEvento2'>" +
		 selNivel+
		"</div>" +
		"</div>";
	}else{
		var selOrigenAux=crearSelectOneMenu("selOrigen", "", listOrigenReporte, "3",
				"id", "nombre","Origen");
		 formatoNuevo="<div class='principalMovil'>" +
		 		"<label>Datos Principales</label>" +
				"<div class='formNuevoEvento1' style='height:33%'> " +
				 "<form class='form-inline'>" +
				 "<div class='form-group' style='width: 50%;display: inline-block;'>" +
				 selActTipo+
				"</div>"+
				"<div class='form-group' style='width: 50%;display: inline-block;'>" +
				selOrigenAux+
				" </div></form>" +
				"</div>"+
				
			
				"<div class='formNuevoEvento2' style='height:33%'> " +
				inputEvi+
				"</div>"+
				"<div class='formNuevoEvento1'>" + 
				"<input type='text' id='inputNom'class='form-control form-movil' placeholder='Descripción'>" +
					"</div>"+
				"</div>"+
				 "<div class='secundarioMovil'>"+
				 "<label>Datos Secundarios</label>" +
				"<div class='formNuevoEvento2' style='height:44%'>" + 
				 "<input type='text' id='inputAccRep' class='form-control form-movil' placeholder='Corrección inmediata del trabajador'>" +
				 "</div>"+
				 "<div class='formNuevoEvento2' style='height:44%'>" +
				 "<input   id='inputLug' class='form-control' placeholder='Lugar'>"+
				 "</div>" +
				 "</div>" ;
	}
	
	
	$("#eventosGosstMovil").append(formatoNuevo+
			"<div class='cancelarFormMovil' >" +
			"<div><i class='fa fa-ban fa-2x' aria-hidden='true'></i>Cancelar</div>" +
			"</div>  "+
			
			"<div class='seguirFormMovil'  >" +
			"<div>Guardar <i class='fa fa-chevron-circle-right fa-2x' aria-hidden='true'></i></div>" +
			"</div>");
	$("#eventosGosstMovil .cancelarFormInputMovil").hide();
	 
	$("#eventosGosstMovil .form-control:not(select)")
		.on("focus",function(){
			var inputId=$(this).prop("id");
			var textoSuperior="";
			switch(inputId){
			case "inputNom":textoSuperior=" - Descripción";
				break;
			case "inputLug":textoSuperior=" - Lugar"
				break;
			}
			$("#eventosGosstMovil .principalMovil").hide();
			$("#eventosGosstMovil .secundarioMovil").hide();
			$("#eventosGosstMovil .seguirFormMovil").hide();
			$("#eventosGosstMovil .cancelarFormMovil").hide();
			$(this).parent().prepend("<div class='cancelarFormInputMovil' >" +
			"<div><i class='fa fa-angle-left fa-2x' aria-hidden='true'></i>&nbsp;&nbsp;Continuar</div>" +
			"</div>");
	$(this).parent().parent().show().addClass("solitarioMovil");
			$(this).parent().parent().find("label:first").append(textoSuperior);
			$(".formNuevoEvento2").hide();
			$(".formNuevoEvento1").hide();
			$(this).parent().show();
		})
		.on("focusout",function(e){ 
			$("#eventosGosstMovil .principalMovil").show().removeClass("solitarioMovil")
			.find("label:first").html("Datos Principales");
			$("#eventosGosstMovil .secundarioMovil").show().removeClass("solitarioMovil")
			.find("label:first").html("Datos Secundarios");
			$("#eventosGosstMovil .seguirFormMovil").show();
			$("#eventosGosstMovil .cancelarFormMovil").show();
			$("#eventosGosstMovil .cancelarFormInputMovil").remove();
			
			$(".formNuevoEvento2").show();
			$(".formNuevoEvento1").show();
		});
	$("#textInputEvi").off("focus").off("focusout");
	$(".cancelarFormMovil").on("click",function(){
		$("#eventosGosstMovil .principalMovil").remove();
		$("#eventosGosstMovil .secundarioMovil").remove();
		$("#eventosGosstMovil .seguirFormMovil").remove();
		$("#eventosGosstMovil .cancelarFormMovil").remove();
		$("#eventosGosstMovil label").remove();
 
		
		$("#graficoResumenEventos").show();
		$("#nuevoEventoGosst").show();
		$("#buscarEventoGosst").show();
		$("#barraMenu").show();ajustarBarraSizeTop("eventosGosstMovil");
	});
	 
	
	$(".seguirFormMovil").on("click", function(){
		var valEvi=$("#fileEviMovil").val();
		var descripcion=$("#inputNom").val();
		var reporteAccion=$("#inputAccRep").val();
		var lugar=$("#inputLug").val();
		var tipo=$("#selTipoRep").val();
		var report=$("#inputNomRep").val();
		var reportInterno=$("#selTrabsMovil").val();
		var tipo1=$("#selActTipo").val();
		var tipo2=$("#selArea").val();
		var tipo3=$("#selCausa").val();
		var tipo4=$("#selNivel").val();
		var origenId=$("#selOrigen").val();
		if (parseInt(sessionStorage.getItem("accesoUsuarios")) == 1) {
			if(tipo1 !="-1"
				&& tipo2 !="-1"
					&& tipo3 !="-1"
						&& tipo4 !="-1"
							&&valEvi!='' 
								&& origenId!="-1"
								&&   descripcion!=''
									&&lugar!=''
										&&tipo!='-1'
											&&(report!='' ||reportInterno!='-1')){
				guardarAcInseguroMovil();
			}else{
			alert("Faltan Completar Campos");
			}
		}else{
			if(tipo1 !="-1"   
				&& origenId!="-1"
							&&valEvi!='' 
								&&descripcion!=''
									&&lugar!=''  ){
				guardarAcInseguroMovil();
			}else{
			alert("Faltan Completar Campos");
			}
		}
		
		 
		});
	
	
	
	$(".formNuevoEvento1").show();
	$(".formNuevoEvento2").show();
	
});


function nextEventoMovil(){
	$(".formNuevoEvento1").hide();
	$(".formNuevoEvento2").show();
	
}

function guardarAcInseguroMovil(){
	var valEvi=$("#fileEviMovil").val();
	var descripcion=$("#inputNom").val();
	var lugar=$("#inputLug").val();
	var tipo=$("#selTipoRep").val();
	var nombreTrab=$("#inputNomRep").val();	
	var origenId=$("#selOrigen").val();
	var selActTipo=$("#selActTipo").val();
	var selArea=$("#selArea").val();
	var acInseguroCausa = $("#selCausa option:selected").val();
	var nivelId=$("#selNivel option:selected").val();
	var reporteAccion=$("#inputAccRep").val();
	
	var trabajadorId;
	if($("#selTipoRep").val()==1){
		trabajadorId=$("#selTrabsMovil").val();
	}else{
		trabajadorId=null;
	}

	var acAux=[];
	if (parseInt(sessionStorage.getItem("accesoUsuarios")) == 1) {		 
		 acAux=acInseguroCausa.split('-');
	} else {  
		selArea=listArea[0].areaId;
		nivelId=2;
		acAux[0]=17;
		origenId=2;
		tipo=1;
		trabajadorId=parseInt(sessionStorage.getItem("trabajadorGosstId"));
		 
	}
	
	var inputFileImage = document.getElementById("fileEviMovil");
	var file = inputFileImage.files[0];
	if (file.size > bitsEvidenciaActoInseguro) {
		alert("Lo sentimos, solo se pueden subir archivos menores a "+bitsEvidenciaActoInseguro/1000000+" MB");
	}else{
		var dataParam = {
				acInseguroId : 0,origen:{id:origenId},
				areaId : selArea,
				nivelRiesgoId:nivelId,
				acInseguroTipoId : selActTipo,
				acInseguroCausaId: acAux[0],
				acInseguroNombre : descripcion,
				reporteAccion:reporteAccion,
				reporteLugar : lugar,
				reporteTipo : tipo,
				reporteNombre : nombreTrab,
				reporteFecha : new Date(),
				trabajadorId:trabajadorId,
				trabajadores : [],
				matrixId : getUrlParameter("mdfId")
			};

		callAjaxPostNoUnlock(URL + '/acinseguro/save', dataParam,
					procesarResultadoGuardarMovilACInseguro,function(){
				$.blockUI({
					message:'<img src="../imagenes/gif/ruedita.gif"></img>Guardando Información'});
			});
	}
	
	
	
	
	
}
function procesarResultadoGuardarMovilACInseguro(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var acInseguroNuevo=data.idNuevo;
		guardarEvidenciaAuto(acInseguroNuevo,"fileEviMovil",
				bitsEvidenciaActoInseguro,
				"/acinseguro/evidencia/save",function(){
			$.blockUI({
				message : '<i class="fa fa-check-square" style="color:green" aria-hidden="true"></i> Guardado '
			});
			setTimeout(cargarPrimerEstado,1300);
			$("#eventosGosstMovil .principalMovil").remove();
			$("#eventosGosstMovil .secundarioMovil").remove();
			$("#eventosGosstMovil .seguirFormMovil").remove();
			$("#eventosGosstMovil .cancelarFormMovil").remove();
			$("#eventosGosstMovil label").remove();

			
			$("#graficoResumenEventos").show();
			$("#buscarEventoGosst").show();
			$("#nuevoEventoGosst").show();
			
			$("#barraMenu").show();
			ajustarBarraSizeTop("eventosGosstMovil");
		},"acInseguroId")
	 
	 
		  
		
		
		break;
	default:
		alert("Ocurrió un error al guardar el acto inseguro!");
	}
}
function listaTrabAcordeTipoMovil(){
	ponerListaSugerida("inputNomRep",listanombretab,false);
	if($("#selTipoRep").val()=="1")	{	
		var selTrabs=crearSelectOneMenu("selTrabsMovil", "", listDniNombre,
				"-1", "trabajadoresId", "nombre","Trabajador"); 
$("#divInputNomRep").html(selTrabs);
		}
		
	if($("#selTipoRep").val()=="2")	{
		$("#divInputNomRep").html(
				"<input class='form-control' id='inputNomRep' placeholder='Informante'>");
		
		$("#inputNomRep")
		.on("focus",function(){
			var inputId=$(this).prop("id");
			var textoSuperior=" - Informante";
			  
			$("#eventosGosstMovil .secundarioMovil").hide();
			$("#eventosGosstMovil .seguirFormMovil").hide();
			$("#eventosGosstMovil .cancelarFormMovil").hide();
			$(".principalMovil").addClass("solitarioMovil");
			$(".principalMovil").find("label:first").append(textoSuperior);
			 
			$(".formNuevoEvento1").hide();
			$(this).parent().parent().parent().show();
		})
		.on("focusout",function(e){
		   //do stuff here
			$("#eventosGosstMovil .principalMovil").show().removeClass("solitarioMovil")
			.find("label:first").html("Datos Principales");
			$("#eventosGosstMovil .secundarioMovil").show().removeClass("solitarioMovil")
			.find("label:first").html("Datos Secundarios");
			$("#eventosGosstMovil .seguirFormMovil").show();
			$("#eventosGosstMovil .cancelarFormMovil").show();
			$(".formNuevoEvento2").show();
			$(".formNuevoEvento1").show();
		});
		}
	
}