var compraId;
var compraEppObj;
var banderaEdicion12;
var listaFullCompraEpp;
var compraEstado;
var compraEstadoNombre;
var listEquiposTalla;
var listMotivosCompra;
var listMotivosRenovacion;
var listTiposUso;
var listEquiposTalla;
var tallasEquipoAux;
var listTrabajadoresCompra;
var mensajeUx;

var listUnidadesAdqManEpp = [],listDivisionesAdqManEpp = [],listAreasAdqManEpp = [];

$(function(){
    resizeDivWrapper("wrapperCompra",200);
	$("#btnClipTablaCompra").on("click",function(){
		var listFullTablaProgramacion="";
		listFullTablaProgramacion="Motivo" +"\t"
		+"Fecha Compra Planificada" +"\t"
		+"Fecha Compra Real" +"\t"
		+"Inversión" +"\t"
		+"Evidencia" +"\t"
		+"Estado" +" \n";
		for (var index = 0; index < listaFullCompraEpp.length; index++){
			
		
			listFullTablaProgramacion=listFullTablaProgramacion
			+listaFullCompraEpp[index].motivoNombre+"\t"
			+listaFullCompraEpp[index].fechaPlanificadaTexto+"\t"
			+listaFullCompraEpp[index].fechaEntregaTexto+"\t"
			+listaFullCompraEpp[index].inversionEntregaEpp+"\t"
			+listaFullCompraEpp[index].numeroEquipos +"\t"
			+listaFullCompraEpp[index].numeroTrabajadores+"\t"
			+(listaFullCompraEpp[index].evidenciaNombre=="----"?"NO":"SI") +"\t"
			+listaFullCompraEpp[index].estadoImplementacionNombre
			+"\n";
		

		}
	 
		 
		copiarAlPortapapeles( obtenerDatosTablaEstandarNoFija("tblCompra"),"btnClipTablaCompra");
		
		alert("Se han guardado al clipboard la tabla de este módulo" );

	});
	

	
	
 	
})



function cambiarPaginaTablaCompra(){
	

	
	//Definiendo variables
	
	var list = listaFullCompraEpp;
	var totalSize=list.length;
	
	var partialSize=10;
	numPaginaTotal=Math.ceil(totalSize/partialSize);
	var inicioRegistro=(numPaginaActual*partialSize)-partialSize;
	var finRegistro=(numPaginaActual*partialSize)-1;
	
	//aplicando logica de compaginacion
	
	$('.izquierda_flecha').show();
	 $('.derecha_flecha').show();
	 if(numPaginaTotal==0){
			numPaginaTotal=1;
		}
		$("#labelFlechas").html(numPaginaActual+" de "+numPaginaTotal);
	 if(numPaginaActual==1){
			$('.izquierda_flecha').hide();
	 }
	
	 if(numPaginaActual==numPaginaTotal){
		 $('.derecha_flecha').hide();
	 }
	 
	if(finRegistro>totalSize){
		finRegistro=totalSize-1;
	}
	
$("#tblProg tbody tr").remove();
	for (var index = inicioRegistro; index <= finRegistro; index++) {

		 cantidadEPPP(list[index].compraId);
			$("#tblProg tbody").append(
					"<tr id='tr" + list[index].compraId
							+ "' onclick='javascript:editarEntregaEpp("
							+index+")' >"
							+ "<td id='tdmotivo"
							+ list[index].compraId + "'>"
							+ list[index].motivoNombre + "</td>"
						
							+ "<td id='tdfechaPlan"
							+ list[index].compraId + "'>"
							+ list[index].fechaPlanificadaTexto + "</td>"
							+ "<td id='tdhorapla"
							+ list[index].compraId + "'>"
							+ list[index].horaPlanificadaTexto + "</td>"
							+ "<td id='tdfechEntrega"
							+ list[index].compraId + "'>"
							+ list[index].fechaEntregaTexto + "</td>"
							+ "<td id='tdinversion"
							+ list[index].compraId + "'>S/  "
							+ list[index].inversionEntregaEpp + "</td>"
							+ "<td id='tdlistEpp"
							+ list[index].compraId + "'>"
							+ list[index].numeroEquipos+"</td>"
							+ "<td id='tdtrabEntrega"
							+ list[index].compraId + "'>"
							+ list[index].numeroTrabajadores+"</td>" 
							+ "<td id='tdevi" + list[index].compraId
							+ "'>"+list[index].evidenciaNombre+"</td>"
							+ "<td id='tdestadocompra" + list[index].compraId
							+ "'>"+list[index].estadoImplementacionNombre+"</td>"
							+"</tr>");
		
	}
}
function cargarComprasEpp() {
	
	var palabraClave=$("#buscadorTrabajadorInput").val();
	if(palabraClave.length==0){
		palabraClave=null;
	}else{
		palabraClave=("%"+palabraClave+"%").toUpperCase();
	}
	$("#btnAgregarCompra").attr("onclick", "javascript:nuevaCompraEPP();");
	$("#btnCancelarCompra").attr("onclick", "javascript:cancelarCompraEpp();");
	$("#btnGuardarCompra").attr("onclick", "javascript:guardarCompraEpp();");
	$("#btnEliminarCompra").attr("onclick", "javascript:eliminarCompraEpp();");
	
	$("#btnCancelarCompra").hide();
	$("#btnAgregarCompra").show();
	$("#btnEliminarCompra").hide();
	$("#btnGuardarCompra").hide();

	$("#modalCompraBody").show();
	$("#modalTallaCompra").hide();
	$("#btnVerCorreos").attr("onclick", "javascript:verCorreos();");
	$("#btnVerCorreos").hide();
	compraId = 0;
	listEquiposTalla=null;
	banderaEdicion12 = false;
	listaFullCompraEpp=[];
	listMotivosCompra=[];
	tallasEquipoAux=[];
	var dataParam = {
			eppId : equipoSeguridadId,empresaId:parseInt(getSession("gestopcompanyid"))
	};

	callAjaxPost(URL + '/equiposeguridad/compras', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			$("#tblCompra tbody tr").remove();
			var list = data.list;
			listaFullCompraEpp=data.list;
			listMotivosCompra=data.listMotivosCompra;
			listTiposUso=data.listTiposUso;
			listMotivosRenovacion=data.listMotivosRenovacion;
			listTrabajadoresCompra=data.trabajadores;
			
			listUnidadesAdqManEpp = data.listUnidadesAdqManEpp;listDivisionesAdqManEpp = data.listDivisionesAdqManEpp;
			listAreasAdqManEpp = data.listAreasAdqManEpp;
			console.log(listUnidadesAdqManEpp);
			console.log(listDivisionesAdqManEpp);
			console.log(listAreasAdqManEpp);
			listaFullCompraEpp.forEach(function(val,index){
				var totalTallas=0;
				val.tallasCompra.forEach(function(val1,index1){
					totalTallas+=val1.numTrabsTalla;
				});
				$("#tblCompra tbody").append(
				"<tr id='tr"+val.id+"' onclick='editarCompra("+index+")'>" +
				"<td id='trabcompr"+val.id+"'>"+val.trabajadorResponsable.nombre+"</td>" +
				
				
				"<td id='tdmotcompra"+val.id+"'>"+val.motivoNombre+"</td>" +
				"<td id='tdmotadq"+val.id+"'>"+val.motivoRenovacionNombre+"</td>" +				
				"<td id='tddesccompra"+val.id+"'>"+val.descripcion+"</td>" +
				"<td id='tdfeccompra"+val.id+"'>"+val.fechaPlanificadaTexto+"</td>" +
				"<td id='tdhoracompra"+val.id+"'>"+val.horaPlanificadaTexto+"</td>" +
				"<td id='tdfecrealcompra"+val.id+"'>"+val.fechaRealTexto+"</td>" +
				"<td id='tdfecrealcompra"+val.id+"'>"+val.fechaProximaTexto+"</td>" +
				"<td id='tdcantidad"+val.id+"'>"+val.cantidad+"</td>" +
				"<td id='tdcantTalla"+val.id+"'> "	+totalTallas+" total</td>" +
				
				"<td id='tdinvcompra"+val.id+"'>"+val.inversion+"</td>" +
				"<td id='tdasocunidad"+val.id+"'>"+val.unidadNombre+"</td>" +
				"<td id='tdDivision"+val.id+"'>"+val.divisionNombre+"</td>" +
				"<td id='tdArea"+val.id+"'>"+val.areaNombre+"</td>" +
				"<td id='tdevicompra"+val.id+"'>"+val.evidenciaNombre+"</td>" +
				"<td id='tdusocompra"+val.id+"'>"+val.tipoUsoNombre+"</td>" +
				"<td id='tdestadocompra"+val.id+"'>"+val.estadoNombre+"</td>" +
				"</tr>"		
				);
			});
			
			$('#tblCompra td:nth-child(n)').show();
			switch(equipoSeguridadTipo){
			case 1:
				$('#tblCompra td:nth-child(2)').hide();
				$('#tblCompra td:nth-child(3)').hide();
				$('#tblCompra td:nth-child(4)').hide();
				$('#tblCompra td:nth-child(8)').hide();
				$('#tblCompra td:nth-child(9)').hide();
				$('#tblCompra td:nth-child(16)').hide();
				break;
			case 2:
				$('#tblCompra td:nth-child(2)').hide();
				$('#tblCompra td:nth-child(9)').hide();
				$('#tblCompra td:nth-child(10)').hide();
				$('#tblCompra td:nth-child(16)').hide();
				break;
			case 3:
				$('#tblCompra td:nth-child(2)').hide();
				$('#tblCompra td:nth-child(3)').hide();
				$('#tblCompra td:nth-child(8)').hide();
				$('#tblCompra td:nth-child(10)').hide();
				break;
			case 4:
				
				$('#tblCompra td:nth-child(3)').hide();
				$('#tblCompra td:nth-child(4)').hide();
				$('#tblCompra td:nth-child(8)').hide();
				$('#tblCompra td:nth-child(10)').hide();
				break;
			}
			
			formatoCeldaSombreableTabla(true,"tblCompra");
			if(getSession("linkCalendarioCompraId")!=null){
		 		
				listaFullCompraEpp.every(function(val,index3){
					if(val.id==parseInt(getSession("linkCalendarioCompraId"))){
						
						editarCompra(index3);
						sessionStorage.removeItem("linkCalendarioCompraId");
						return false;
					}else{
						return true;
					}
				});
				
			}
		
			break;
		default:
			alert("Ocurrió un error al traer las programaciones!");
		}
	});
}

var valorPrevioUnidadCompraEpp;

function editarCompra(pindex) {

	if (!banderaEdicion12) {
		compraId = listaFullCompraEpp[pindex].id;
		compraEppObj = listaFullCompraEpp[pindex];
		var descripcion= listaFullCompraEpp[pindex].descripcion;
		var fechaReal= listaFullCompraEpp[pindex].fechaReal;
		listEquiposTalla=[];
		var cantidad=listaFullCompraEpp[pindex].cantidad;
		var estadoImpl=listaFullCompraEpp[pindex].estadoId;
		var fechaPlan=listaFullCompraEpp[pindex].fechaPlanificada;
		var inversion=listaFullCompraEpp[pindex].inversion;
		var motivoId=listaFullCompraEpp[pindex].motivoId;
		var motivoRenovacionId=listaFullCompraEpp[pindex].motivoRenovacionId;
		var tipoUsoId=listaFullCompraEpp[pindex].tipoUsoId;
		var horaPlanificada=listaFullCompraEpp[pindex].horaPlanificada;
		tallasEquipoAux=listaFullCompraEpp[pindex].tallasCompra;
		cargarCompraTallas();
		
		$("#tr"+compraId).addClass("fila-edicion");
		
		$("#modalTallaCompra").hide();
		$("#modalCompraBody").show();
$("#tddesccompra"+compraId).html(
		"<input type='text' id='inputDescCompra' class='form-control'>");
			nombrarInput("inputDescCompra",descripcion);
		
			var selMotivoCompra = crearSelectOneMenu("selMotivoCompra", "",
					listMotivosCompra, motivoId, "motivoId","motivoNombre");
		
		$("#tdmotcompra"+compraId).html(selMotivoCompra);
		var selMotivoRenovacion = crearSelectOneMenu("selMotivoRenovacion", "",
				listMotivosRenovacion, motivoRenovacionId, "motivoRenovacionId","motivoRenovacionNombre");
	
	$("#tdmotadq"+compraId).html(selMotivoRenovacion);
	var selTipoUso = crearSelectOneMenu("selTipoUso", "",
			listTiposUso, tipoUsoId, "tipoUsoId","tipoUsoNombre");

		$("#tdusocompra"+compraId).html(selTipoUso);
		
		valorPrevioUnidadCompraEpp = 1;
		
		var selUnidadCompraEpp = crearSelectOneMenu("selUnidadCompraEpp","filtrarDivisionesSegunUnidadCompraEquipo()",
		    listUnidadesAdqManEpp,compraEppObj.unidadId,"id","nombre",(listUnidadesAdqManEpp.length == 0?"Sin unidades registradas":null));
		
		$("#tdasocunidad"+compraId).html(selUnidadCompraEpp);
		$("#tdDivision"+compraId).html("<div id='divSelDivisionCompraEpp'></div>");
		$("#tdArea"+compraId).html("<div id='divSelAreaCompraEpp'></div>");
		
		formatoCeldaSombreableTabla(false,"tblProg");
		$("#tdcantidad"+compraId).html(
				"<input type='number' id='inputCantidadEpp'  " +
				"class='form-control' >"		
		);
		
		nombrarInput("inputCantidadEpp",cantidad);
		
		$("#tdinvcompra"+compraId).html(
				"<label for='inputPrecioCompra' style='float:left'>S/</label><input type='number' " 
				+"id='inputPrecioCompra' name='inputPrecioCompra' style='width:100px' " 
				+"class='form-control' value="+inversion+">");
	
		$("#tdcantTalla" + compraId)
		.html("<a id='linkTallaCompra' href='#' onclick='javascript:cargarCompraTallas();'>Link de Tallas</a>");

		$("#tdfecrealcompra" + compraId).html(
				"<input type='date' id='inputFecRealCompra' class='form-control' onchange='hallarEstadoImplementacionCompra("+compraId+")'>");
		$("#tdfeccompra" + compraId).html(
				"<input type='date' id='inputFecPlanCompra' class='form-control' onchange='hallarEstadoImplementacionCompra("+compraId+")'>");
		$("#tdhoracompra" + compraId).html(
				"<input type='time' id='inputHoraCompra' class='form-control'>");
		var fechaReal = convertirFechaInput(fechaReal);
		var fechaPlan = convertirFechaInput(fechaPlan);
		
	
		$("#inputHoraCompra").val(horaPlanificada);
		$("#inputFecRealCompra").val(fechaReal);
		$("#inputFecPlanCompra").val(fechaPlan);
		hallarEstadoImplementacionCompra(compraId);
		
		var options=
		{container:"#tdevicompra"+ compraId,
				functionCall:function(){ },
				descargaUrl:"/equiposeguridad/compra/evidencia?compraId="+compraId,
				esNuevo:false,
				idAux:"CompraEquipo",
				evidenciaNombre:listaFullCompraEpp[pindex].evidenciaNombre};
		crearFormEvidenciaCompleta(options);
		banderaEdicion12 = true;
		$("#btnCancelarCompra").show();
		$("#btnAgregarCompra").hide();
		$("#btnEliminarCompra").show();
		$("#btnGuardarCompra").show();
		//
		listTrabajadoresCompra.forEach(function(val){
			if(val.trabajadorId==listaFullCompraEpp[pindex].trabajadorResponsable.trabajadorId){
				val.selected=1;
			}else{
				val.selected=0;
			}
		});
		crearSelectOneMenuObligUnitarioCompleto("selRespTrabCompra", "", listTrabajadoresCompra, "trabajadorId",
				"nombre","#trabcompr"+compraId,"Seleccionar Responsable");
		//
		
		filtrarDivisionesSegunUnidadCompraEquipo();
		
		formatoCeldaSombreableTabla(false,"tblCompra");
	}
}


function nuevaCompraEPP() {
	if (!banderaEdicion12) {

		var selMotivoCompra = crearSelectOneMenu("selMotivoCompra", "",
				listMotivosCompra, "-1", "motivoId",
				"motivoNombre");
		var selMotivoRenovacion = crearSelectOneMenu("selMotivoRenovacion", "",
				listMotivosRenovacion, "-1", "motivoRenovacionId","motivoRenovacionNombre");
	
	var selTipoUso = crearSelectOneMenu("selTipoUso", "",
			listTiposUso, "-1", "tipoUsoId","tipoUsoNombre");
		
		var selUnidadCompraEpp = crearSelectOneMenu("selUnidadCompraEpp","filtrarDivisionesSegunUnidadCompraEquipo()",listUnidadesAdqManEpp,
		    (parseInt(getSession("gestopcompanyid")) == 500?"927":"-1"),"id","nombre",(listUnidadesAdqManEpp.length == 0?"Sin unidades registradas":null));
		
		$("#tblCompra tbody")
				.prepend(
						"<tr id='tr0'>"
						+"<td id='trabcompr0'> </td>"
						+ "<td>"+selMotivoCompra+"</td>"
						+ "<td>"+selMotivoRenovacion+"</td>"
						+ "<td><input type='text' id='inputDescCompra' class='form-control'></td>"
						
						+ "<td><input type='date' id='inputFecPlanCompra' class='form-control' onchange='hallarEstadoImplementacionCompra(0)'></td>"
						+ "<td><input type='time' value='12:00:00' id='inputHoraCompra' class='form-control' ></td>"									
						+ "<td><input type='date' id='inputFecRealCompra' class='form-control' onchange='hallarEstadoImplementacionCompra(0)'></td>"
						+ "<td>...</td>"
						+ "<td><input type='number' id='inputCantidadEpp' class='form-control'></td>"
						+ "<td>...</td>"
						
						+ "<td>" +
						"<label for='inputPrecioCompra' style='float:left'>S/</label><input type='number' " 
						+"id='inputPrecioCompra' name='inputPrecioCompra' style='width:100px' " 
						+"class='form-control' value="+0+">"+
								"</td>"
						+ "<td>"+selUnidadCompraEpp+"</td>"
						+ "<td><div id='divSelDivisionCompraEpp'></div></td>"
						+ "<td><div id='divSelAreaCompraEpp'></div></td>"
						+ "<td id='tdevicompra0'>...</td>"
						
						+ "<td>"+selTipoUso+"</td>"
								+ "<td id='tdestadocompra0'>...</td>"
								+ "</tr>");
		
		compraId = 0;valorPrevioUnidadCompraEpp = 1;
		var options=
		{container:"#tdevicompra"+ compraId,
				functionCall:function(){ },
				descargaUrl:"",
				esNuevo:true,
				idAux:"CompraEquipo",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
		
		$('#tblCompra td:nth-child(n)').show();
		switch(equipoSeguridadTipo){
		case 1:
			$('#tblCompra td:nth-child(2)').hide();//motivo compra
			$('#tblCompra td:nth-child(3)').hide();//motivo renovación
			$('#tblCompra td:nth-child(4)').hide();//descripcion compra
			$('#tblCompra td:nth-child(8)').hide();//fecha próximo mantenimiento
			$('#tblCompra td:nth-child(9)').hide();//cantidad (número)
			$('#tblCompra td:nth-child(16)').hide();//estado del equipo
			break;
		case 2:
			$('#tblCompra td:nth-child(2)').hide();//motivo compra
			$('#tblCompra td:nth-child(9)').hide();//cantidad (número)
			$('#tblCompra td:nth-child(10)').hide();//cantidad (tallas)
			$('#tblCompra td:nth-child(16)').hide();//estado del equipo
			break;
		case 3:
			$('#tblCompra td:nth-child(2)').hide();//motivo compra
			$('#tblCompra td:nth-child(3)').hide();//motivo renovación
			$('#tblCompra td:nth-child(8)').hide();//fecha próximo mantenimiento
			$('#tblCompra td:nth-child(10)').hide();//cantidad (tallas)
			break;
		case 4:
			
			$('#tblCompra td:nth-child(3)').hide();//motivo renovación
			$('#tblCompra td:nth-child(4)').hide();//descripcion compra
			$('#tblCompra td:nth-child(8)').hide();//fecha próximo mantenimiento
			$('#tblCompra td:nth-child(10)').hide();//cantidad (tallas)
			break;
		}
		$("#btnCancelarCompra").show();
		$("#btnAgregarCompra").hide();
		$("#btnEliminarCompra").hide();
		$("#btnGuardarCompra").show();
		

		crearSelectOneMenuObligUnitarioCompleto("selRespTrabCompra", "", listTrabajadoresCompra, "trabajadorId",
				"nombre","#trabcompr"+compraId,"Seleccionar Responsable");
		
		filtrarDivisionesSegunUnidadCompraEquipo();
		
		banderaEdicion12 = true;
	} else {
		alert("Guarde primero.");
	}
}

var selDivisionCompraEpp,selAreaCompraEpp,textoAdicionalCompraEpp,textoAdicional1CompraEpp,textoSelectVacioAux1CompraEpp,textoSelectVacioAux2CompraEpp;

function filtrarDivisionesSegunUnidadCompraEquipo(){
    var listDivisionCompraEppAux = [];
    selDivisionCompraEpp = "";

    textoSelectVacioAux1CompraEpp = ([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sedes":"divisiones");
    textoSelectVacioAux2CompraEpp = (parseInt(getSession("gestopcompanyid")) == 714?"el país - empresa seleccionado":"la unidad seleccionada");

    var unidadIdAux = parseInt($("#selUnidadCompraEpp").val());

    if(listDivisionesAdqManEpp.length != 0 && unidadIdAux != -1){
	listDivisionesAdqManEpp.forEach(function(val){
	    if(val.matrixId == unidadIdAux){
		listDivisionCompraEppAux.push(val);
	    }
	});

	selDivisionCompraEpp = crearSelectOneMenu("selDivisionCompraEpp","filtrarAreasSegunDivisionCompraEquipo()",listDivisionCompraEppAux,(compraId == 0 || valorPrevioUnidadCompraEpp == 0?(parseInt(getSession("gestopcompanyid")) == 500 && 
	    valorPrevioUnidadCompraEpp == 1?"2430":""):compraEppObj.divisionId),"divisionId","divisionName",(listDivisionCompraEppAux.length == 0?"Sin "+textoSelectVacioAux1CompraEpp+" asociadas":null));

	textoAdicionalCompraEpp = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1CompraEpp+" se muestran según "+textoSelectVacioAux2CompraEpp+".</small>";
    }else{
	textoAdicionalCompraEpp = "<small style='font-weight:bold;'>"+(unidadIdAux == -1?"*Las "+textoSelectVacioAux1CompraEpp+" se muestran según "+textoSelectVacioAux2CompraEpp:
	    "*No hay "+textoSelectVacioAux1CompraEpp+" para seleccionar")+".</small>";
    }

    $("#divSelDivisionCompraEpp").html(selDivisionCompraEpp+textoAdicionalCompraEpp);

    filtrarAreasSegunDivisionCompraEquipo();
}

function filtrarAreasSegunDivisionCompraEquipo(){
    var listAreaCompraEppAux = [];
    selAreaCompraEpp = "";

    textoSelectVacioAux1CompraEpp = (parseInt(getSession("gestopcompanyid")) == 714?"áreas - procesos":"áreas");
    textoSelectVacioAux2CompraEpp = "la "+([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sede":"división")+" seleccionada";

    var divisionIdAux = (selDivisionCompraEpp.length == 0?-1:parseInt($("#selDivisionCompraEpp").val()));

    if(listAreasAdqManEpp.length != 0 && divisionIdAux != -1){
	listAreasAdqManEpp.forEach(function(val){
	    if(val.divisionId == divisionIdAux){
		listAreaCompraEppAux.push(val);
	    }
	});

	selAreaCompraEpp = crearSelectOneMenu("selAreaCompraEpp","",listAreaCompraEppAux,(compraId == 0 || valorPrevioUnidadCompraEpp == 0?"":compraEppObj.areaId),"areaId","areaNameShort",
	    (listAreaCompraEppAux.length == 0?"Sin "+textoSelectVacioAux1CompraEpp+" asociadas":null));

	textoAdicionalCompraEpp = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1CompraEpp+" se muestran según "+textoSelectVacioAux2CompraEpp+".</small>";
    }else{
	textoAdicionalCompraEpp = "<small style='font-weight:bold;'>"+(divisionIdAux == -1?"*Las "+textoSelectVacioAux1CompraEpp+" se muestran según "+textoSelectVacioAux2CompraEpp:
	    "*No hay "+textoSelectVacioAux1CompraEpp+" para seleccionar")+".</small>";
    }

    $("#divSelAreaCompraEpp").html(selAreaCompraEpp+textoAdicionalCompraEpp);
    
    valorPrevioUnidadCompraEpp = 1;
}

function cargarCompraTallas(){
	$("#modalTallaCompra").show();
	$("#modalCompraBody").hide();
	$("#tblTallaCompra tbody tr").remove();
	tallasEquipoAux.forEach(function(val,index){
		$("#tblTallaCompra tbody").append(
				"<tr>" +
				"<td>" +val.nombre+"</td>"+
				"<td>" +"<input type='number' class='form-control' id='inputCantidadTalla"+val.id+"'>"+"</td>"+
				"</tr>");
		nombrarInput("inputCantidadTalla"+val.id+"",val.numTrabsTalla);
	});
	console.log(tallasEquipoAux);
}
function cancelarCargaTallasCompra(){
	$("#modalTallaCompra").hide();
	$("#modalCompraBody").show();
}
function cancelarCompraEpp() {
	cargarComprasEpp();
}

function eliminarCompraEpp() {
	var r = confirm("¿Está seguro de eliminar la adquisición?");
	if (r == true) {
		var dataParam = {
			id : compraId,
		};

		callAjaxPost(URL + '/equiposeguridad/compra/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarComprasEpp();
						break;
					default:
						alert("Ocurrió un error al eliminar la compra!");
					}
				});
	}
}

function guardarCompraEpp() {

	var campoVacio = true;
var motivoCompraId=parseInt($("#selMotivoCompra").val());
	var inversion =$("#inputPrecioCompra").val();
	var horaPlanificada=$("#inputHoraCompra").val();
	var mes1 = $("#inputFecRealCompra").val().substring(5, 7) - 1;
	var fechatemp1 = new Date($("#inputFecRealCompra").val().substring(0, 4), mes1, $(
			"#inputFecRealCompra").val().substring(8, 10));

	var inputFecReal = fechatemp1;
	
	var mes2 = $("#inputFecPlanCompra").val().substring(5, 7) - 1;
	var fechatemp2 = new Date($("#inputFecPlanCompra").val().substring(0, 4), mes2, $(
			"#inputFecPlanCompra").val().substring(8, 10));
	
	var inputFecPla = fechatemp2;
	
if(!$("#inputFecRealCompra").val()){
		
	inputFecReal=null;
	}
if(!$("#inputFecPlanCompra").val()){
	
	inputFecPla=null;
}
tallasEquipoAux.forEach(function(val,index){
val.numTrabsTalla=$("#inputCantidadTalla"+val.id).val();
val.compraId=compraId
});
var trabajadorrespId=$("#selRespTrabCompra").val();

    var unidadId = parseInt($("#selUnidadCompraEpp").val());
    var divisionId = parseInt($("#selDivisionCompraEpp").val());
    var areaId = parseInt($("#selAreaCompraEpp").val());
   
    if(unidadId == -1 || divisionId == -1 || areaId == -1){
	campoVacio = false;mensajeUx = "<label>Debe completar los campos 'Unidad', 'División' y 'Área'.</label>";
    }

    if(campoVacio){
		var dataParam = {
			tallasCompra:tallasEquipoAux,trabajadorResponsable:{trabajadorId:trabajadorrespId},
			id : compraId,
			fechaPlanificada : inputFecPla,
			horaPlanificada:horaPlanificada,
			fechaReal:inputFecReal,
			eppId:equipoSeguridadId,
			inversion:inversion,
			descripcion:$("#inputDescCompra").val(),
			cantidad:$("#inputCantidadEpp").val(),
			estadoId:compraEstado,
			motivoId:motivoCompraId=="-1"?null:motivoCompraId,
			motivoRenovacionId:$("#selMotivoRenovacion").val()=="-1"?null:$("#selMotivoRenovacion").val(),
			tipoUsoId:$("#selTipoUso").val()=="-1"?null:$("#selTipoUso").val(),
			unidadId:unidadId,divisionId:divisionId,areaId:areaId
		};
		callAjaxPost(URL + '/equiposeguridad/compra/save', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						guardarEvidenciaAuto(data.nuevoId,"fileEviCompraEquipo",bitsEvidenciaEPP,
								"/equiposeguridad/compra/evidencia/save",function(){
						    $("#mdProgCompra").modal("hide");
						    
							  mensajeUx = "<label>El registro adquisición/mantenimiento fue guardado con éxito.</label>";
							  mensajesUx(mensajeUx,1,"","ActualizarCompraEpp");

							  $("#modalMensajeUxActualizarCompraEpp").on("hidden.bs.modal",function(){
							      $("#mdProgCompra").modal("show");cargarComprasEpp();
							  });
						  },"compraId")
						
						break;
					default:
						alert("Ocurrió un error al guardar la programacion!");
					}
				});
    }else{
        $("#mdProgCompra").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionCompraEpp");
      
        $("#modalMensajeUxValidacionCompraEpp").on("hidden.bs.modal",function(){
	    $("#mdProgCompra").modal("show");
        });
    }
}

function mostrarCargarCompra(compraId) {
	$('#mdUpload').modal('show');
	$('#btnUploadArchivo').attr("onclick",
			"javascript:uploadArchivoCompra(" + compraId + ");");
}

function uploadArchivoCompra(progEquipoId) {
	
	
	$.blockUI({message:'cargando...'}); 
	guardarEvidenciaAuto(progEquipoId,"fileEvi",bitsEvidenciaEPP,
			"/equiposeguridad/compra/evidencia/save",function(){
		$.unblockUI();
		var inputFileImage = document.getElementById("fileEvi");
		var file = inputFileImage.files[0];
		$("#tdevicompra"+progEquipoId+" ").html(file.name);
		$("#mdUpload").modal("hide");
	},"compraId")
}

function hallarEstadoImplementacionCompra(progId){
	var fechaPlanificada=$("#inputFecPlanCompra").val();
	var fechaReal=$("#inputFecRealCompra").val();
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		compraEstado=2;
		compraEstadoNombre="Completado";
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				compraEstado=3;
				compraEstadoNombre="Retrasado";
			}else{
				compraEstado=1;
				compraEstadoNombre="Por implementar";
			}
			
		}else{
			
			compraEstado=1;
			compraEstadoNombre="Por implementar";
			
		}
	}
	
	$("#tdestadocompra"+progId).html(compraEstadoNombre);
	
}

