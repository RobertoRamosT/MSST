var banderaEdicion;
var puestoTrabajoId;
var puestoActualId;
var listFullPuestos;
var  listExMEd ;
var listCaps ;
var listEPPs ;
var listProcs ;
var listPositions;
var listRecurso;
var moduloEdicionId;
var cond;
$(document).ready(function() {
	 $("#modalRelacional").on('shown.bs.modal', function () {
	    	
			
			goheadfixedZ("#tblRelacion","#wrapper2",170);
	    });
	insertMenu();
	cargarPrimerEstado();
$(document).on("click","#btnClipFormacion",function(){
	llamarRelacional(5);
});
$(document).on("click","#btnClipExam",function(){
	llamarRelacional(6);
});
$(document).on("click","#btnClipEpp",function(){
	llamarRelacional(7);
});
$(document).on("click","#btnClipProce",function(){
	llamarRelacional(8);
});
$(document).on("click","#btnClipPuesto",function(){
	llamarRelacional(9);
});
$("#btnClipTabla").on("click",function(){
	var fullDatosTabla="";
	var tablaId="tblRelacion"
	 $(".fix-head #"+tablaId+" thead tr").each(function (index){
        $(this).children("th").each(function (index2){
             fullDatosTabla =fullDatosTabla+ $(this).text()+"\t";

        })
         $(this).children("td").each(function (index2){
             fullDatosTabla =fullDatosTabla+ $(this).text()+"\t";

        })
        fullDatosTabla=fullDatosTabla+"\n"
    });
	 $(".fix-head #"+tablaId+" tbody tr").each(function (index){   
		            $(this).children("td").each(function (index2){
		                var  texto=$(this).text();
		               if(index2>0){
		            	   
		                	if($(this).html().indexOf('<i class="fa fa-check fa-2x"')!=-1){
		                		texto="X";
		                	}else if($(this).html()=='<img src="../imagenes/corona.jpg" width="30px" height="30px">'){
		                		texto="PP";
		                	}else{
		                		texto="--"
		                	}
		               }
		                
		                fullDatosTabla =fullDatosTabla+ texto+"\t";
		   	            })
		            fullDatosTabla=fullDatosTabla+"\n"
		        });
	
	 copiarAlPortapapeles(fullDatosTabla,"btnClipTabla");
	alert("Se guardó al clipboard los datos de la tabla")
});

$("#btnEdicionAsig").on("click",function(){
	$("#tblRelacion tbody").find("input").show();
	$("#tblRelacion thead").find("input").show();
	$("#tblRelacion tbody").find("i").hide();
	$("#tblRelacion tbody").find("label").hide();
	$("#labelEditarPuesto").show();
	$("#btnCancelarAsig").show();
	$(this).hide();

});
$("#btnCancelarAsig").on("click",function(){
    cond = true;
    llamarRelacional(moduloEdicionId);

});
$("#labelEditarPuesto").on("click",function(){
    return;
	 
	 
});

});
var listDivision=[];
function importGeneralRecurso(){
	var selPtoTrab = $("#selPtoTrab option:selected").val();
	if(selPtoTrab=="-1"){
		alert("Seleccione un puesto primero")
	}else{
		$("#modalImportRelacional").modal("show");
		$("#btnGuardarImport").attr("onclick","guardarMasivoSmartCopiaExcel()")
	}
	
}
function guardarMasivoSmartCopiaExcel() {
	var texto = $("#textPuestoRelacion").val();
	var listExcelInicial = texto.split('\n');
	var listPuestos = [];
	var listDnisRepetidos = [];
	var listFullNombres = "";
	var validado = "";
	var listExcel=[];
	listExcelInicial.forEach(function(val,index){ 
		if(val.length>0){
			listExcel.push(val);
		} 
	});
	var selPtoTrab = $("#selPtoTrab option:selected").val();
	if (texto.length < 100000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];
			if (validado.length < 1 && listCells.length != 3) {
				validado = "No coincide el numero de celdas."
						+ listCells.length+" != 3";
				break;
			} else {
				var trab = {};
				var genero = {};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
										
					if (j === 2) {
						var puestoIdFinal=null; 
						listDivision.forEach(function(val,index){
							if(val.divisionName.toUpperCase()==listCells[0].trim().toUpperCase()){
								val.areas.forEach(function(val1,index1){
									if(val1.areaName.toUpperCase()==listCells[1].trim().toUpperCase()){
										val1.puestos.forEach(function(val2,index2){
											if(val2.positionName.toUpperCase()==listCells[2].trim().toUpperCase()){
												puestoIdFinal=val2.positionId;
											}
										});
									}
								});
							}
						});
						listPuestos.forEach(function(val){
							if(val.positionId==puestoIdFinal && puestoIdFinal==null){
								validado += "Existen puestos repetidos." + listCells[2].trim()+"  "+puestoIdFinal;
								
							}
							if(puestoIdFinal==null){
								validado += "Puesto no existe: " + listCells[2].trim()
							}
						});
						trab = {
								isPerfil:0,
								puestoPadreId:parseInt(selPtoTrab),
							positionId : puestoIdFinal
						}
						
					}					
				}

				listPuestos.push(trab);
				
			}
		}
	} else {
		validado = "Ha excedido los 100000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			var dataParam = {
					positionId : selPtoTrab,
					fechaActualizacion:obtenerUTCDate(new Date()),
					listPositionAsociado : listPuestos
			};
		callAjaxPost(URL + '/puesto/relacionado/masivo/save', dataParam,
			funcionResultadoMasivoPuestoRel);
		}
	} else {
		alert(validado);
	}
}
function funcionResultadoMasivoPuestoRel(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if (data.MENSAJE.length > 0) {
			alert(data.MENSAJE);
		} else {
			alert("Se guardaron exitosamente.");
			//listFullPuestos.forEach(function(val){
			//	listPuestos.forEach(function(val1){
					
			//	});
			//});
			cargarPrimerEstado();
			$("#textPuestoRelacion").val("");
			$('#modalImportRelacional').modal('hide');
		}
		break;
	default:
		alert("Ocurrió un error al guardar el trabajador!");
	}
}

var isCambiado0=false, isCambiado1=true,isCambiado2=true,isCambiado3=true,isCambiado4=true;
function cambiarCheckRecurso(recursoId){
	 
	switch(parseInt(recursoId)){
	case 0:
		//isCambiado0=!isCambiado0;
		$("#tdpto").find("input").prop("checked",isCambiado0);
		 break;
	case 1:
		isCambiado1=!isCambiado1;
		$("#tdemingreso").find("input").prop("checked",isCambiado1);
		$("#tdemrutina").find("input").prop("checked",isCambiado1);
		$("#tdemsalida").find("input").prop("checked",isCambiado1); 
		break;
	case 2:
		isCambiado2=!isCambiado2;
		$("#tdcapinicial").find("input").prop("checked",isCambiado2);
		$("#tdcaprutina").find("input").prop("checked",isCambiado2);
		$("#tdcapespecifica").find("input").prop("checked",isCambiado2);
		break;
	case 3:
		isCambiado3=!isCambiado3;
		$("#tdepp").find("input").prop("checked",isCambiado3);
		
		break;
	case 4:
		isCambiado4=!isCambiado4;
		$("#tdproc").find("input").prop("checked",isCambiado4);
		 break;
	}
}
function cargarPrimerEstado() {
	banderaEdicion = false;
	puestoTrabajoId = 0;
	puestoActualId=0;
	cond=false;
	PuestoTrabajoFecha = null;

	removerBotones();
	crearBotones();
	$("#fsBotones")
	.append(
			"<button id='btnGenReporte' type='button' class='btn btn-success btn-word' title='Recomendaciones de Seguridad y Salud en el Trabajo'>"
					+ "<i class='fa fa-file-word-o fa-2x'></i>"
					+ "</button>");
	

	deshabilitarBotonesEdicion();
	$("#btnNuevo").hide();
	$("#btnGenReporte").hide();

	$("#btnNuevo").attr("onclick", "javascript:nuevoPuestoTrabajo();");
	$("#btnGuardar").attr("onclick","javascript:guardarPuestoTrabajoDetalle();");
	$("#btnGenReporte").attr("onclick","javascript:generarHojaRuta();");

	var dataParam = {
			companyId : sessionStorage.getItem("gestopcompanyid"),
		matrixId : getUrlParameter("mdfId")
	};

	callAjaxPost(URL + '/puesto/mantenimiento', dataParam,
			procesarDataDescargadaPrimerEstado);
	$("#btnUpload").hide();
}

function insertarListaPuestos(puestoId){
	var selPtoTrab = crearSelectOneMenuImagen("selPtoTrab",
			"javascript:cargarDetallePuestoTrabajo()", listFullPuestos.filter(function(data){
				if(data.isPerfil==null || data.isPerfil==1)
				
				return data
			}), puestoId,
			"positionId", "positionName","verificacionLlenado", "Escoja un Puesto de Trabajo");
	$("#divPuestos").html(selPtoTrab);

$("#selPtoTrab").css({
	"width":"800px"
})
	 $.widget( "custom.iconselectmenu", $.ui.selectmenu, {
	      _renderItem: function( ul, item ) {
	        var li = $( "<li>", 
	        		{ text: item.label,
	        	id:item.value} );
	 
	        if ( item.disabled ) {
	          li.addClass( "ui-state-disabled" );
	        }
	 
	        $( "<span>", {
	          style: item.element.attr( "data-style" ),
	          "class": "ui-icon " + item.element.attr( "data-class" )
	        })
	          .appendTo( li );
	 
	        return li.appendTo( ul );
	      }
	 

});
	
	 $( "#selPtoTrab" )
      .iconselectmenu()
      .iconselectmenu({ change: function( event, ui ) { 
    	  puestoActualId=(ui.item.value) 
    	cargarDetallePuestoTrabajo();  
      }})
      .iconselectmenu( "menuWidget" )
        .addClass( "ui-menu-icons customicons" );
		$("#selPtoTrab").attr("style", "width:600px;");
	 $( "select#selPtoTrab" ).hide();
}
function procesarDataDescargadaPrimerEstado(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;
		 listDivision=data.listDivision;
			listFullPuestos=list;
		 listExMEd = data.listExMEd;
		 listCaps = data.listCaps;
		 listEPPs = data.listEPPs;
		 listProcs = data.listProcs;
		insertarListaPuestos('-1');
		/** ***********Relacion de puestos**************** */
		
		$("#list-tdrelacion").html("");
		for (index = 0; index < listFullPuestos.length; index++) {

			if(1==1){
				$("#list-tdrelacion").append(
						"<li class='list-group-item'>"
								+ "<input type='checkbox' class='check' "
								+ "id='list-tdrelacion"
								+ listFullPuestos[index].positionId + "'>"
								+ listFullPuestos[index].positionNameShort + "</li>");				
			}

		}
		/** ***********Examenes Medicos**************** */
		$("#list-tdemingreso").html("");
		for (index = 0; index < listExMEd.length; index++) {

			if(listExMEd[index].examenMedicoTipoId==1){
				$("#list-tdemingreso").append(
						"<li class='list-group-item'>"
								+ "<input type='checkbox' class='check' "
								+ "id='list-tdemingreso"
								+ listExMEd[index].examenMedicoId + "'>"
								+ listExMEd[index].examenMedicoNombre + "</li>");				
			}

		}

		$("#list-tdemrutina").html("");
		for (index = 0; index < listExMEd.length; index++) {
			if(listExMEd[index].examenMedicoTipoId==2){
			$("#list-tdemrutina").append(
					"<li class='list-group-item'>"
							+ "<input type='checkbox' class='check' "
							+ "id='list-tdemrutina"
							+ listExMEd[index].examenMedicoId + "'>"
							+ listExMEd[index].examenMedicoNombre + "</li>");
			}
		}

		$("#list-tdemsalida").html("");
		for (index = 0; index < listExMEd.length; index++) {

			if(listExMEd[index].examenMedicoTipoId==3){
			$("#list-tdemsalida").append(
					"<li class='list-group-item'>"
							+ "<input type='checkbox' class='check' "
							+ "id='list-tdemsalida"
							+ listExMEd[index].examenMedicoId + "'>"
							+ listExMEd[index].examenMedicoNombre + "</li>");
			}
		}

		/** ***********Capacityaciones**************** */
		$("#list-tdcapinicial").html("");
		for (index = 0; index < listCaps.length; index++) {
			if(listCaps[index].clasificacionId==1){
			$("#list-tdcapinicial").append(
					"<li class='list-group-item'>"
							+ "<input type='checkbox' class='check' "
							+ "id='list-tdcapinicial"
							+ listCaps[index].capacitacionId + "'>"
							+ listCaps[index].capacitacionTipoNombreSmall+ " - "
							+ listCaps[index].capacitacionNombre +" - "
							+ listCaps[index].tema + "</li>");
			}
		}

		$("#list-tdcaprutina").html("");
		for (index = 0; index < listCaps.length; index++) {
			if(listCaps[index].clasificacionId==2){
			$("#list-tdcaprutina").append(
					"<li class='list-group-item'>"
							+ "<input type='checkbox' class='check' "
							+ "id='list-tdcaprutina"
							+ listCaps[index].capacitacionId + "'>"
							+ listCaps[index].capacitacionTipoNombreSmall+ " - "
							+ listCaps[index].capacitacionNombre +" - "
							+ listCaps[index].tema+ "</li>");
			}
		}

		$("#list-tdcapespecifica").html("");
		for (index = 0; index < listCaps.length; index++) {
			if(listCaps[index].clasificacionId==3){
			$("#list-tdcapespecifica").append(
					"<li class='list-group-item'>"
							+ "<input type='checkbox' class='check' "
							+ "id='list-tdcapespecifica"
							+ listCaps[index].capacitacionId + "'>"
							+ listCaps[index].capacitacionTipoNombreSmall+ " - "
							+ listCaps[index].capacitacionNombre+ " - "
							+ listCaps[index].tema+ "</li>");
			}
		}

		/** ***********EPPs**************** */
		$("#list-tdepp").html("");
		for (index = 0; index < listEPPs.length; index++) {
if( listEPPs[index].equipoSeguridadTipoId==1 ){
			$("#list-tdepp").append(
					"<li class='list-group-item'>"
							+ "<input type='checkbox' class='check' "
							+ "id='list-tdepp"
							+ listEPPs[index].equipoSeguridadId + "'>"
							+ listEPPs[index].equipoSeguridadNombre + "</li>");
		}
		}	
		/** ***********Procedimientos**************** */
		$("#list-tdproc").html("");
		for (index = 0; index < listProcs.length; index++) {

			$("#list-tdproc").append(
					"<li class='list-group-item'>"
							+ "<input type='checkbox' class='check' "
							+ "id='list-tdproc"
							+ listProcs[index].procedimientoSeguridadId + "'>"
							+ listProcs[index].procedimientoSeguridadNombre
							+ "</li>");
		}
		$("#tbodyC td").css({"text-align":"left"});
		$("#wrapper4").css("height",$(window).height()-200)+"px"; /* antes -> -243*/
		 
		goheadfixedY("#tblPuesto","#wrapper4")
		completarBarraCarga();
		break;
	default:
		alert("Ocurrió un error al traer los procedimientos de Seguridad!");
	}
}
function guardarPuestoTrabajoDetalle() {

	var campoVacio = true;
	var selPtoTrab = $("#selPtoTrab option:selected").val();
	var listPositionAsociado=[];
	var listExMedIng = [];
	var listExMedRut = [];
	var listExMedSal = [];
	var listCapIni = [];
	var listCapRuti = [];
	var listCapEsp = [];
	var listEPPs = [];
	var listProcs = [];
	$("#list-tdrelacion .check").each(function() {
		if ($(this).is(':checked')) {
			var id = $(this).attr('id');
			var ptoAsoc = {
					isPerfil:0,
					puestoPadreId:selPtoTrab,
				positionId : id.substring(15, id.length)
			}
			listPositionAsociado.push(ptoAsoc);
		}
		
	});
	console.log(listPositionAsociado);
	$("#list-tdemingreso .check").each(function() {
		if ($(this).is(':checked')) {
			var id = $(this).attr('id');
			var exmed = {
				examenMedicoId : id.substring(16, id.length),
				positionId : selPtoTrab
			}
			listExMedIng.push(exmed);
		}
		console.log($(this).attr('id'));
	});

	$("#list-tdemrutina .check").each(function() {
		if ($(this).is(':checked')) {
			var id = $(this).attr('id');
			var exmed = {
				examenMedicoId : id.substring(15, id.length),
				positionId : selPtoTrab
			}
			listExMedRut.push(exmed);
		}
		console.log($(this).attr('id'));
	});

	$("#list-tdemsalida .check").each(function() {
		if ($(this).is(':checked')) {
			var id = $(this).attr('id');
			var exmed = {
				examenMedicoId : id.substring(15, id.length),
				positionId : selPtoTrab
			}
			listExMedSal.push(exmed);
		}
		console.log($(this).attr('id'));
	});

	$("#list-tdcapinicial .check").each(function() {
		if ($(this).is(':checked')) {
			var id = $(this).attr('id');
			var exmed = {
				capacitacionId : id.substring(17, id.length),
				positionId : selPtoTrab
			}
			listCapIni.push(exmed);
		}
		console.log($(this).attr('id'));
	});

	$("#list-tdcaprutina .check").each(function() {
		if ($(this).is(':checked')) {
			var id = $(this).attr('id');
			var exmed = {
				capacitacionId : id.substring(16, id.length),
				positionId : selPtoTrab
			}
			listCapRuti.push(exmed);
		}
		console.log($(this).attr('id'));
	});

	$("#list-tdcapespecifica .check").each(function() {
		if ($(this).is(':checked')) {
			var id = $(this).attr('id');
			var exmed = {
				capacitacionId : id.substring(20, id.length),
				positionId : selPtoTrab
			}
			listCapEsp.push(exmed);
		}
		console.log($(this).attr('id'));
	});

	$("#list-tdepp .check").each(function() {
		if ($(this).is(':checked')) {
			var id = $(this).attr('id');
			var exmed = {
				equipoSeguridadId : id.substring(10, id.length),
				positionId : selPtoTrab
			}
			listEPPs.push(exmed);
		}
		
	});

	$("#list-tdproc .check").each(function() {
		if ($(this).is(':checked')) {
			var id = $(this).attr('id');
			var exmed = {
				procedimientoSeguridadId : id.substring(11, id.length),
				positionId : selPtoTrab
			}
			listProcs.push(exmed);
		}
		
	});
	/*
	 * if (selPtoTrab == "-1" || inputRes.length == 0 || inputVersion.length ==
	 * 0) { campoVacio = false; }
	 */

	if (campoVacio) {

		var dataParam = {
				positionId : selPtoTrab,
			fechaActualizacion:obtenerUTCDate(new Date()),
			listaEMIngreso : listExMedIng,
			listaEMRutina : listExMedRut,
			listaEMSalida : listExMedSal,
			listaCapInicial : listCapIni,
			listaCapRutina : listCapRuti,
			listaCapEspecifica : listCapEsp,
			listaEquipoSeg : listEPPs,
			listaProcs : listProcs,
			listPositionAsociado:listPositionAsociado
		};

		callAjaxPost(URL + '/puesto/detalle/save', dataParam,
				procesarResultadoGuardarProSeg);

	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarResultadoGuardarProSeg(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarPrimerEstado();
		
		break;
	default:
		alert("Ocurrió un error al guardar la PuestoTrabajo!");
	}
}

function cargarDetallePuestoTrabajo() {
	var selPtoTrab = puestoActualId;
	
	var dataParam = {
		positionId : selPtoTrab,
		companyId : sessionStorage.getItem("gestopcompanyid")
	};

	callAjaxPost(URL + '/puesto/detalle', dataParam,
			procesarResultadoDetallePuestoTrabajo);
	
}

function procesarResultadoDetallePuestoTrabajo(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if ($("#selPtoTrab option:selected").val() != "-1") {
			$("#btnGuardar").show();
			$("#btnGenReporte").show();
		} else {
			$("#btnGuardar").hide();
			$("#btnGenReporte").hide();
		}

		var listExMedIng = data.listExMedIng;
		var listExMedRut = data.listExMedRut;
		var listExMedSal = data.listExMedSal;
		var listCapIni = data.listCapIni;
		var listCapRuti = data.listCapRuti;
		var listCapEsp = data.listCapEsp;
		var listEPPs = data.listEPPs;
		var listPositions=data.listPositions;
		var listProcs = data.listProcs;
		var contadorAux=listExMedIng.length+
		listExMedRut.length+listExMedSal.length
		+listCapIni.length+listCapRuti.length+listCapEsp.length+
		listEPPs.length+listProcs.length;
	
		if(contadorAux!=0){
		$('.fix-inner input:checkbox').each(function() {
			$(this).prop('checked', false);
		})}else{
			$('.fix-inner input:checkbox').each(function() {
				$(this).prop('checked', true);
			})
		}
		
			
		for (index = 0; index < listFullPuestos.length; index++) {
			$('#list-tdrelacion' + listFullPuestos[index].positionId)
			.attr("disabled", false)
			.attr("title", "");
			$('#list-tdrelacion' +  listFullPuestos[index].positionId)
			.prop('checked', false);
		
			if(listFullPuestos[index].puestoPadreId>0 &&
					listFullPuestos[index].puestoPadreId!=puestoActualId	){
				$('#list-tdrelacion' + listFullPuestos[index].positionId)
				.attr("disabled", true)
					.attr("title", "Tiene perfil: "+listFullPuestos[index].puestoPadreNombre);
				$('#list-tdrelacion' + listFullPuestos[index].positionId)
				.prop('checked', false);
			}
			
			 if(listFullPuestos[index].isPerfil==1){
					$('#list-tdrelacion' + listFullPuestos[index].positionId)
					.attr("disabled", true)
						.attr("title", "Es perfil maestro");
					$('#list-tdrelacion' + listFullPuestos[index].positionId)
					.prop('checked', false);
				}
			 if(listFullPuestos[index].numActividadesRelacionadas>0){
					$('#list-tdrelacion' + listFullPuestos[index].positionId)
					.attr("disabled", true)
						.attr("title", "Tiene "+listFullPuestos[index].numActividadesRelacionadas+" actividad(es) relacionada(s)");
					$('#list-tdrelacion' + listFullPuestos[index].positionId)
					.prop('checked', false);
				}
			if ($('#list-tdrelacion' + listFullPuestos[index].positionId) &&
					listFullPuestos[index].puestoPadreId==puestoActualId &&
					listFullPuestos[index].isPerfil!=1) {
				$('#list-tdrelacion' + listFullPuestos[index].positionId)
						.prop('checked', true);
			 
			}
			
		}
		$('#list-tdrelacion' +puestoActualId)
		.attr("disabled", true)
		.attr("title", "No se puede autoseleccionar el puesto");
		$('#list-tdrelacion' + puestoActualId)
		.prop('checked', false);
	
		for (index = 0; index < listExMedIng.length; index++) {
			if ($('#list-tdemingreso' + listExMedIng[index].examenMedicoId)) {
				$('#list-tdemingreso' + listExMedIng[index].examenMedicoId)
						.prop('checked', true);
			}
		}
		for (index = 0; index < listExMedRut.length; index++) {
			if ($('#list-tdemrutina' + listExMedRut[index].examenMedicoId)) {
				$('#list-tdemrutina' + listExMedRut[index].examenMedicoId)
						.prop('checked', true);
			}
		}
		for (index = 0; index < listExMedSal.length; index++) {
			if ($('#list-tdemsalida' + listExMedSal[index].examenMedicoId)) {
				$('#list-tdemsalida' + listExMedSal[index].examenMedicoId)
						.prop('checked', true);
			}
		}
		for (index = 0; index < listCapIni.length; index++) {
			if ($('#list-tdcapinicial' + listCapIni[index].capacitacionId)) {
				$('#list-tdcapinicial' + listCapIni[index].capacitacionId)
						.prop('checked', 1);
			}
		}
		for (index = 0; index < listCapRuti.length; index++) {
			if ($('#list-tdcaprutina' + listCapRuti[index].capacitacionId)) {
				$('#list-tdcaprutina' + listCapRuti[index].capacitacionId)
						.prop('checked', true);
			}
		}
		for (index = 0; index < listCapEsp.length; index++) {
			if ($('#list-tdcapespecifica' + listCapEsp[index].capacitacionId)) {
				$('#list-tdcapespecifica' + listCapEsp[index].capacitacionId)
						.prop('checked', true);
			}
		}
		for (index = 0; index < listEPPs.length; index++) {
			if ($('#list-tdepp' + listEPPs[index].equipoSeguridadId)) {
				$('#list-tdepp' + listEPPs[index].equipoSeguridadId).prop(
						'checked', true);
			}
		}
		for (index = 0; index < listProcs.length; index++) {
			if ($('#list-tdproc' + listProcs[index].procedimientoSeguridadId)) {
				$('#list-tdproc' + listProcs[index].procedimientoSeguridadId)
						.prop('checked', true);
			}
		}
		break;
	default:
		alert("Ocurrió un error al cargar el detalle del puesto de trabajo!");
	}
}

function generarHojaRuta(){
	window.open(URL
			+ "/puesto/detalle/hojaruta?puestoTrabajoId="
			+ $("#selPtoTrab option:selected").val() , '_blank');	
}


function llamarRelacional(tipoRecusoId){
	$("#wrapper2").html("<table class='table table-striped table-bordered table-hover' "
			+"id='tblRelacion'>"
			+"<thead>"
			
			+"</thead>"
			+"<tbody >"
		+"</tbody>"
		+"</table>");

	$("#wrapper2").css("height",$(window).height()*0.6-50+"px");
	if(parseInt(tipoRecusoId)!=9){
		moduloEdicionId=tipoRecusoId;
		$("#btnEdicionAsig").show();

		$("#labelEditarPuesto").hide();
		$("#btnCancelarAsig").hide();
		var dataParam = {
				empresaId : sessionStorage.getItem("gestopcompanyid"),
				moduloId:tipoRecusoId
			};
	
	 
		callAjaxPost(URL+"/puesto/indicadores/modulo",dataParam,
			procesarLlamadaRelacional);
		
	}else{
		$("#modalRelacional").modal("show");
		$("#btnEdicionAsig").hide();

		$("#labelEditarPuesto").hide();
		$("#btnCancelarAsig").hide();
		$("#tblRelacion thead tr").remove();
		$("#tblRelacion tbody tr").remove();
		
		$("#tblRelacion thead").append(
		"<tr><th class='tb-acc'>Puestos Dependientes</th></tr>");
				
		$("#modalRelacional .modal-title").html("Relación de puestos de trabajo");
		listFullPuestos.forEach(function(item,index){
			if(item.isPerfil==0){
				$("#tblRelacion tbody").append(
						"<tr id='subp"+item.positionId+"'>" +
								"<td>"+item.positionNameShort+"</td></tr>")	
			}
		
		});
		var lengthSuperior=0;
		listFullPuestos.forEach(function(item,index){
			if(item.isPerfil==null || item.isPerfil==1){
				$("#tblRelacion thead tr").append(
						"<th class='tb-acc'>"+item.positionNameShort+"</th>");
				$("#tblRelacion tbody tr").append(
						"<td id='subf"+item.positionId+"'>---</td>");
				lengthSuperior+=1;
			}
			
		});
		$("#tblRelacion thead").prepend(
		"<tr><th ></th><th class='tb-acc' colspan='"+lengthSuperior+"'>Puestos Superiores / Independientes</th></tr>");
		
		
		listFullPuestos.forEach(function(item,index){
			if(item.isPerfil==0){
				var imagenCorona="<img src='../imagenes/corona.jpg' width='30px' height='30px'></img>";
			var imagenInferior="<img src='../imagenes/vinculo.png' width='20px' height='20px'></img>"
				$("#tblRelacion tbody tr#subp"+item.positionId+" td#subf"+item.puestoPadreId).html(
						imagenCorona);
			$("#tblRelacion tbody tr#subp"+item.puestoPadreId+" td#subf"+item.positionId).html(
					imagenInferior);
			}
			
		});
	}
	
		
		
		
		
		
}
function procesarLlamadaRelacional(data){
	if(data.CODE_RESPONSE="05"){
		
		
		$("#tblRelacion").show();
		$("#tblRelacion thead tr").remove();
		$("#tblRelacion tbody tr").remove();
		 listRecurso=[];
		switch(data.idModulo){
		case 5:
			$("#modalRelacional .modal-title").html("Asignación de formación a puestos de trabajo");
			listCaps.forEach(function(item,index){
				listRecurso.push({
					recursoId:listCaps[index].capacitacionId,
					recursoNombre:listCaps[index].capacitacionTipoNombreSmall+" - "+
					listCaps[index].capacitacionNombre+" - "+listCaps[index].tema
				})
			});
			break;
		case 6:
			$("#modalRelacional .modal-title").html("Perfil de exámenes (Profesiograma)");
			listExMEd.forEach(function(item,index){
				listRecurso.push({
					recursoId:listExMEd[index].examenMedicoId,
					recursoNombre:item.inicial+ " - "+listExMEd[index].examenMedicoNombre
				})
			});
			break;
		case 7:
			$("#modalRelacional .modal-title").html("Asignación de EPP´s a puestos de trabajos");
			
			listEPPs.forEach(function(item,index){
				if(item.equipoSeguridadTipoId==1){
					listRecurso.push({
						recursoId:listEPPs[index].equipoSeguridadId,
						recursoNombre:listEPPs[index].equipoSeguridadNombre
					});
				}
				
			});
			break;
		case 8:
			$("#modalRelacional .modal-title").html("Asignación de Procedimientos a puestos de trabajo");
			listProcs.forEach(function(item,index){
				listRecurso.push({
					recursoId:listProcs[index].procedimientoSeguridadId,
					recursoNombre:listProcs[index].procedimientoSeguridadNombre
				})
			});
			break;
		
		}
		for(index=0;index<data.puestos.length;index++){
			var unidadId= getUrlParameter("mdfId");
			var puestoAux=data.puestos[index].puestoId;
			
			if(data.puestos[index].unidadId==unidadId
					&& data.puestos[index].puestoPadreId==0){
				$("#tblRelacion tbody").append(
						"<tr id='subp"+puestoAux+"'>" +
								"<td > "+data.puestos[index].puestoNombre+
								
								
								"</td>" +
										
						"</tr>");
				
				listRecurso.forEach(function(val,index2){
					var recursoAux=val.recursoId;
					$("#subp"+puestoAux).append(
							"<td id='subf"+val.recursoId+"'><label>---</label>"+
							"<input type='checkbox' class='form-control' id='checkUnitario"+puestoAux+"-"+recursoAux+"'  " +
							"onclick='guardarRelacionPuesto("+puestoAux+","+recursoAux+")' ></td>");
				
				})
					
			}
				
		}
		$("#tblRelacion thead").append(
		"<tr><th class='tb-acc' >Puestos / Recurso</th></tr>");
		for(index=0;index<listRecurso.length;index++){
			var recursoAux=listRecurso[index].recursoId;
			$("#tblRelacion thead tr").append(
					"<td class='tb-acc' style='min-width:150px'>"+listRecurso[index].recursoNombre+
					"<input type='checkbox' class='' onchange='marcarPuestos("+recursoAux+")' id='checkAll"+recursoAux+"'>" +	
			"</td>");
			 
		}
		
					
					
		for(index=0;index<data.relaciones.length;index++){
			var puestoAux=data.relaciones[index].puestoId;
			var recursoAux=data.relaciones[index].recursoId;
					$("#tblRelacion tbody tr#subp"+puestoAux+" td#subf"+recursoAux).html(
			"<i class='fa fa-check fa-2x' style='color:#288281'></i>" +
			"<input type='checkbox' class='form-control' id='checkUnitario"+puestoAux+"-"+recursoAux+"'  onclick='guardarRelacionPuesto("+puestoAux+","+recursoAux+")' checked>" );
					}
		$("#tblRelacion tbody").find("input").hide();
		$("#tblRelacion thead").find("input").hide();
		$("#modalRelacional").modal("show");
	
		if(cond){
			goheadfixedZ("#tblRelacion","#wrapper2",170);
			cond=false;
		}
	}else{
		console.log("nop")
	}
}
function guardarRelacionPuesto(puestoAux,reursoAux){
    var dataParam = {};
    switch(moduloEdicionId){
	case 5:
	case 6:
	case 7:
	case 8:
	    dataParam = {
		recursoId: reursoAux,
		positionId : puestoAux
		}
	case 9:
	    break;
	}

	var urlAcceso=""
	switch(moduloEdicionId){
	case 5:
		urlAcceso=URL + '/puesto/unitario/formacion/save';
		break;
	case 6:
		urlAcceso=URL + '/puesto/unitario/examen/save';
		break;
	case 7:
		urlAcceso=URL + '/puesto/unitario/equipo/save';
		break;
	case 8:
		urlAcceso=URL + '/puesto/unitario/procedimiento/save';
		break;
	}
	var isChecked = $("#checkUnitario"+puestoAux+"-"+reursoAux).prop("checked");
	dataParam.isRelacionado = (isChecked ? 1 : 0);
	callAjaxPost(urlAcceso, dataParam,
		function(data){
		 
	});
    
}

function marcarPuestos(recursoId){
	var marcarAll=$(".fix-head #checkAll"+recursoId).prop("checked");
	var dataParam = {
		unidadId : getUrlParameter("mdfId"),
		recursoId : recursoId,
		isRelacionado : (marcarAll ? 1 : 0)
	};
	var urlAcceso=""
		switch(moduloEdicionId){
		case 5:
			urlAcceso=URL + '/puesto/unitario/formacion/all/save';
			break;
		case 6:
			urlAcceso=URL + '/puesto/unitario/examen/all/save';
			break;
		case 7:
			urlAcceso=URL + '/puesto/unitario/equipo/all/save';
			break;
		case 8:
			urlAcceso=URL + '/puesto/unitario/procedimiento/all/save';
			break;
		}
	callAjaxPost(urlAcceso ,dataParam,function(){
	    
	    $("#tblRelacion tbody tr").each(function(index,elem){
		var puestoIdAux=$(elem).prop("id");
		var puestoId=puestoIdAux.substr(4,puestoIdAux.length);
		if(marcarAll){
			$("#checkUnitario"+puestoId+"-"+recursoId).prop("checked",true)
		}else{
			$("#checkUnitario"+puestoId+"-"+recursoId).prop("checked",false)
		}			
	    });
	});
	
	
}


















