 var manifiestoId,manifiestoObj;
var banderaEdicion4=false;
var listFullManifiestos;
var listClasificacionManifiesto,listTipoPagoManifiesto,listEtapaPagoManifiesto;
var listTipoResiduoSalida=[];
$(function(){
	$("#btnNuevoManifiesto").attr("onclick", "javascript:nuevoManifiesto();");
	$("#btnCancelarManifiesto").attr("onclick", "javascript:cancelarNuevoManifiesto();");
	$("#btnGuardarManifiesto").attr("onclick", "javascript:guardarManifiesto();");
	$("#btnEliminarManifiesto").attr("onclick", "javascript:eliminarManifiesto();");
	 $("#btnImportarSalidasResiduo").attr("onclick", "javascript:verImportSalidas();");
})
/**
 * 
 */
function verImportSalidas(){
	$("#tabSalidas .container-fluid").hide();
	$("#tabSalidas #divRegularizarSalidas").show();
	$("#tabSalidas").find("h2")
	.html("<a onclick=' volverTransportistas()'>Transportista "+transportistaObj.nombre
			+"</a>  > " 
			+"<a onclick=' volverManifiestos()'>Salidas registradas  </a> " +
					">  Importación");
	var selClasManifiestoImport=crearSelectOneMenuOblig("selClasManifiestoImport", "verAcordeClasifacionSalidaImport()",
			listClasificacionManifiesto, "", "id", "nombre");
	$("#divSelectClasifSalida").html(selClasManifiestoImport);
	
	verAcordeClasifacionSalidaImport();
	$("#btnGuardarRegularizarSalidas").attr("onclick","guardarImportSalidas()")
}
function verAcordeClasifacionSalidaImport(){
	crearSelectOneMenuObligMultipleCompleto("slcTiposSalida", "verLabelColumnaInportSalida()",
			listTipoResiduoSalida.filter(function(val){
				if(val.clasificacion.id==$("#selClasManifiestoImport").val()){
					return true;
				}else{
					return false;
				}
			}),  "id", "nombre","#divSelectTipoSalida","Tipos...");
	$("#slcTiposSalida").chosen().change( function(ev,val){
		listTipoResiduoSalida.forEach(function(val1){
			if(val1.id==parseInt(val.selected)){
				listFinalTipoResiduo.push(val1.id)
			}
			if(val1.id==parseInt(val.deselected)){
				listFinalTipoResiduo=listFinalTipoResiduo.filter(function(val2){
					return val2!=val1.id
				})
			};
		});
	
	});
}
var listFinalTipoResiduo=[];
function verLabelColumnaInportSalida(){
	var textCol="";
	var tiposId=$("#slcTiposSalida").val();
	listFinalTipoResiduo.forEach(function(val){
		listTipoResiduoSalida.forEach(function(val1){
			if(val1.id==parseInt(val)){
				textCol+=val1.nombre+" (Kg)     -"
			}
		});
	})
	$("#labelOrdenColumnas").html("Orden de columnas: Fecha      -        "+textCol)
}
function guardarImportSalidas(){
	var texto = $("#textSalida").val();
	var listExcelInicial = texto.split('\n');
	var validado = "";var listSalidas=[];
var listExcel=[];
listExcelInicial.forEach(function(val){
	if(val.length>0){
		listExcel.push(val);
	}
});
if (texto.length < 100000) {
	for (var int = 0; int < listExcel.length; int++) {

		var listCells = listExcel[int].split('\t');
		var filaTexto = listExcel[int];

		if (validado.length < 1 && listCells.length != (1+listFinalTipoResiduo.length)) {
			validado = "No coincide el numero de celdas."
					+ listCells.length+" != " +(1+listFinalTipoResiduo.length);
			break;
		} else {
			var cambio = {residuos:[], id:0};
			var cliente={};
			for (var j = 0; j < listCells.length; j++) {
				var element = listCells[j];
				switch(j){
				case 0:
					try {
						var fechaTexto = element.trim();
						var parts = fechaTexto.split('/');
						var dateNac = new Date(parts[2], parts[1] - 1,
								parts[0]);
						cambio.fechaSalida= dateNac;
					} catch (err) {
						validado = "Error en el formato de fecha .";
						break;
					}
					break;
				default:
					var objResiduo={
						tipo:{id:listFinalTipoResiduo[j-1]},
						cantidad:element.trim().replace(",","")
						};
					cambio.residuos.push(objResiduo);
					
					break;
				}
				cambio.tipo= {id: "1"}
				cambio.costo=0;
				cambio.destino="";
				cambio.etapa= {id: "3"}
				cambio.responsable= {nombre: "Administrador"};
				cambio.clasificacion={id:$("#selClasManifiestoImport").val()};
				
				cambio.transportista = {id :transportistaObj.id};
			}

			listSalidas.push(cambio);
		}
	}
}

if (validado.length < 1) {
	var r = confirm("¿Está seguro que desea subir estos "
			+ listExcel.length + " elemento(s)?");
	if (r == true) {
		var dataParam = {
				listSalidas : listSalidas
		};
		console.log(listSalidas);
		callAjaxPost(URL + '/residuo/salidas/masivo/save', listSalidas,
				funcionResultadoSalidaMasivo);
	}
} else {
	alert(validado);
}

}



function funcionResultadoSalidaMasivo(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		if (data.MENSAJE.length > 0) {
			alert(data.MENSAJE);
		} else {$("#textSalida").val("");
			alert("Se guardaron exitosamente.");
			cargarManifiestos();
		}
		break;
	default:
		alert("Ocurrió un error al guardar el trabajador!");
	}
}
function volverManifiestos(){
	$("#tabSalidas .container-fluid").hide();
	$("#divContainManifiestosAsociados").show();
	$("#tabSalidas").find("h2")
	.html("<a onclick=' volverTransportistas()'>Transportista "+transportistaObj.nombre
			+"</a>"
			+"> Salidas registradas");
}
function cargarManifiestos(){
	$("#btnCancelarManifiesto").hide();
	$("#btnNuevoManifiesto").show();
	$("#btnEliminarManifiesto").hide();
	$("#btnGuardarManifiesto").hide();
	volverManifiestos();
	callAjaxPost(URL + '/residuo/transportista/manifiesto', 
			{id : transportistaObj.id }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion4=false;
					listTipoResiduoSalida=data.tipos;
				 listFullManifiestos=data.list;
				 listClasificacionManifiesto=data.clasificacion;
				 listTipoPagoManifiesto=data.pago;
				 listEtapaPagoManifiesto=data.etapa;
						$("#tblManifiestos tbody tr").remove();
					listFullManifiestos.forEach(function(val,index){
						
						$("#tblManifiestos tbody").append(
								"<tr id='trman"+val.id+"' onclick='editarManifiesto("+index+")'>" 
								+"<td id='manfesa"+val.id+"'>"+val.fechaSalidaTexto+"</td>" 
								+"<td id='manres"+val.id+"'>"+val.responsable.nombre+"</td>"
								+"<td id='manclas"+val.id+"'>"+val.clasificacion.nombre+"</td>"
								+"<td id='manind"+val.id+"'>"+val.indicadorResiduos+"</td>"
								+"<td id='manobse"+val.id+"'>"+val.observacion+"</td>"
								+"<td id='manpago"+val.id+"'>"+val.tipo.nombre+"</td>" 
								+"<td id='mancosto"+val.id+"'>"+val.costo+"</td>"
								+"<td id='manetapa"+val.id+"'>"+val.etapa.nombre+"</td>" 
								+"<td id='mandest"+val.id+"'>"+val.destino+"</td>" 
								
								+"<td id='manpera"+val.id+"'>"+val.permisoA.nombre+"</td>" 
								+"<td id='manperb"+val.id+"'>"+val.permisoB.nombre+"</td>" 
								+"<td id='manfede"+val.id+"'>"+val.fechaDevolucionTexto+"</td>" 
								+"<td id='manperc"+val.id+"'>"+val.permisoC.nombre+"</td>" 
								+"<td id='manperd"+val.id+"'>"+val.permisoD.nombre+"</td>" 
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblManifiestos");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarManifiesto(pindex) {


	if (!banderaEdicion4) {
		formatoCeldaSombreableTabla(false,"tblManifiestos");
		manifiestoId = listFullManifiestos[pindex].id;
		manifiestoObj=listFullManifiestos[pindex]; 
		
		//
		var fechaSalida=convertirFechaInput(manifiestoObj.fechaSalida);
		$("#manfesa" + manifiestoId).html(
				"<input type='date' id='inputDateSalidaManifiesto' class='form-control'>  ");
		$("#inputDateSalidaManifiesto").val(fechaSalida);
		
		//
		var resp= manifiestoObj.responsable.nombre ;
		$("#manres" + manifiestoId).html(
				"<input  id='inputRespManifiesto' class='form-control'>  ");
		$("#inputRespManifiesto").val(resp);
		
		//
		var clasif=manifiestoObj.clasificacion.id;
		var selClasManifiesto=crearSelectOneMenuOblig("selClasManifiesto", "",
				listClasificacionManifiesto, clasif, "id", "nombre");
		$("#manclas" + manifiestoId).html(selClasManifiesto );
		//
		var observacion= manifiestoObj.observacion;
		$("#manobse" + manifiestoId).html(
				"<input  id='inputObserManifiesto' class='form-control'>  ");
		$("#inputObserManifiesto").val(observacion);
		
		//
		var pago=manifiestoObj.tipo.id;
		var selPagoManifiesto=crearSelectOneMenuOblig("selPagoManifiesto", "",
				listTipoPagoManifiesto, pago, "id", "nombre");
		$("#manpago" + manifiestoId).html(selPagoManifiesto );
		//
		var etapa=manifiestoObj.etapa.id;
		var selEtapaManifiesto=crearSelectOneMenuOblig("selEtapaManifiesto", "",
				listEtapaPagoManifiesto, etapa, "id", "nombre");
		$("#manetapa" + manifiestoId).html(selEtapaManifiesto );
		//
		var destino= manifiestoObj.destino ;
		$("#mandest" + manifiestoId).html(
				"<input  id='inputDestinoManifiesto' class='form-control'>  ");
		$("#inputDestinoManifiesto").val(destino);
		
		//
		var textInfo=$("#manind"+manifiestoId).text();
		$("#manind"+manifiestoId).addClass("linkGosst")
		.on("click",function(){verDetallesManifiesto();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo);
		//
		 
		var costo=manifiestoObj.costo;
		$("#mancosto" + manifiestoId).html(
				"<input type='number'  id='inputCostoManifiesto' class='form-control'   >");
		$("#inputCostoManifiesto").val(costo);
		//
		var optionsA=
		{container:"#manpera"+manifiestoId,
				functionCall:function(){ },
				descargaUrl: "/residuo/transportista/manifiesto/evidencia?id="+ manifiestoId+"&tipoId=1",
				esNuevo:false,
				idAux:"ManifiestoA"+manifiestoId,
				evidenciaNombre:manifiestoObj.permisoA.nombre};
		crearFormEvidenciaCompleta(optionsA);
		//
		var optionsB=
		{container:"#manperb"+manifiestoId,
				functionCall:function(){ },
				descargaUrl: "/residuo/transportista/manifiesto/evidencia?id="+ manifiestoId+"&tipoId=2",
				esNuevo:false,
				idAux:"ManifiestoB"+manifiestoId,
				evidenciaNombre:manifiestoObj.permisoB.nombre};
		crearFormEvidenciaCompleta(optionsB);
		
		//
		var optionsC=
		{container:"#manperc"+manifiestoId,
				functionCall:function(){ },
				descargaUrl: "/residuo/transportista/manifiesto/evidencia?id="+ manifiestoId+"&tipoId=3",
				esNuevo:false,
				idAux:"ManifiestoC"+manifiestoId,
				evidenciaNombre:manifiestoObj.permisoC.nombre};
		crearFormEvidenciaCompleta(optionsC);
		//
		var optionsD=
		{container:"#manperd"+manifiestoId,
				functionCall:function(){ },
				descargaUrl: "/residuo/transportista/manifiesto/evidencia?id="+ manifiestoId+"&tipoId=4",
				esNuevo:false,
				idAux:"ManifiestoD"+manifiestoId,
				evidenciaNombre:manifiestoObj.permisoD.nombre};
		crearFormEvidenciaCompleta(optionsD);
		//
		var fechaDevolucion=convertirFechaInput(manifiestoObj.fechaDevolucion);
		$("#manfede" + manifiestoId).html(
				"<input type='date' id='inputDateDevolManifiesto' class='form-control'>  ");
		$("#inputDateDevolManifiesto").val(fechaDevolucion);
		
		
		  
		
	
		banderaEdicion4 = true;
		$("#btnCancelarManifiesto").show();
		$("#btnNuevoManifiesto").hide();
		$("#btnEliminarManifiesto").show();
		$("#btnGuardarManifiesto").show();
		$("#btnGenReporte").hide();
		
	}
	
}


function nuevoManifiesto() {
	if (!banderaEdicion4) {
		manifiestoId = 0;
		var selClasManifiesto=crearSelectOneMenuOblig("selClasManifiesto", "",
				listClasificacionManifiesto, "", "id", "nombre");
		var selPagoManifiesto=crearSelectOneMenuOblig("selPagoManifiesto", "",
				listTipoPagoManifiesto, "", "id", "nombre");
		var selEtapaManifiesto=crearSelectOneMenuOblig("selEtapaManifiesto", "",
				listEtapaPagoManifiesto, "", "id", "nombre");
		$("#tblManifiestos tbody")
				.prepend(
						"<tr >" 
						 +"<td>"+"<input type='date' id='inputDateSalidaManifiesto' class='form-control'  >"+"</td>"
						 +"<td>"+"<input   id='inputRespManifiesto' class='form-control'  >"+"</td>"
						  +"<td>"+selClasManifiesto+"</td>"
						  	   +"<td>"+"..." +"</td>"
						  	 +"<td>"+"<input   id='inputObserManifiesto' class='form-control'  >"+"</td>"
								 +"<td>"+selPagoManifiesto+"</td>"
							+"<td>"+"<input type='number' id='inputCostoManifiesto' class='form-control'  >"+"</td>"
							+"<td>"+selEtapaManifiesto+"</td>"
							+"<td>"+"<input  id='inputDestinoManifiesto' class='form-control'>  "+"</td>"
							
							
						 +"<td id='manpera0'></td>" 
						+"<td id='manperb0'></td>" 
						+"<td>"+"<input type='date' id='inputDateDevolManifiesto' class='form-control'  >"+"</td>"
						+"<td id='manperc0'></td>" 
						+"<td id='manperd0'></td>"  
						 		+ "</tr>");
		//
		$("#inputFechaManifiesto").val(obtenerFechaActual());
		var optionsA=
		{container:"#manpera"+manifiestoId,
				functionCall:function(){},
				descargaUrl: "",
				esNuevo:true,
				idAux:"ManifiestoA"+manifiestoId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(optionsA);
		var optionsB=
		{container:"#manperb"+manifiestoId,
				functionCall:function(){},
				descargaUrl: "",
				esNuevo:true,
				idAux:"ManifiestoB"+manifiestoId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(optionsB);
		var optionsC=
		{container:"#manperc"+manifiestoId,
				functionCall:function(){},
				descargaUrl: "",
				esNuevo:true,
				idAux:"ManifiestoC"+manifiestoId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(optionsC);
		//
		var optionsD=
		{container:"#manperd"+manifiestoId,
				functionCall:function(){},
				descargaUrl: "",
				esNuevo:true,
				idAux:"ManifiestoD"+manifiestoId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(optionsD);
		//
		$("#btnCancelarManifiesto").show();
		$("#btnNuevoManifiesto").hide();
		$("#btnEliminarManifiesto").hide();
		$("#btnGuardarManifiesto").show();
		$("#btnGenReporte").hide();
		banderaEdicion4 = true;
		formatoCeldaSombreableTabla(false,"tblManifiestos");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarManifiesto() {
	cargarManifiestos();
}

function eliminarManifiesto() {
	var r = confirm("¿Está seguro de eliminar el manifiesto");
	if (r == true) {
		var dataParam = {
				id : manifiestoId,
		};
		callAjaxPost(URL + '/residuo/transportista/manifiesto/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarManifiestos();
						break;
					default:
						alert("No se puede eliminar, hay residuos asociados.");
					}
				});
	}
}

function guardarManifiesto() {

	var campoVacio = true;
	var clas=$("#selClasManifiesto").val();
	var pago=$("#selPagoManifiesto").val();
	var etapa=$("#selEtapaManifiesto").val();
	var destino=$("#inputDestinoManifiesto").val();
var fechaSalida=convertirFechaTexto($("#inputDateSalidaManifiesto").val()); 
var fechaDevolucion=convertirFechaTexto($("#inputDateDevolManifiesto").val()); 
var responsable=$("#inputRespManifiesto").val();
var costo=$("#inputCostoManifiesto").val();

var observacion=$("#inputObserManifiesto").val();
		if (campoVacio) {

			var dataParam = {
				id : manifiestoId,
				observacion:observacion,
				fechaSalida:fechaSalida,
				fechaDevolucion:fechaDevolucion,
				clasificacion:{id:clas},  
				etapa:{id:etapa},destino:destino,
				costo:costo,
				tipo:{id:pago},
				responsable:{nombre:responsable}, 
				transportista :{id :transportistaObj.id}
			};

			callAjaxPost(URL + '/residuo/transportista/manifiesto/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviManifiestoA"+manifiestoId
									,bitsTransportsita,"/residuo/transportista/manifiesto/evidencia/save",preCargarManifiestos,1);
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviManifiestoB"+manifiestoId
									,bitsTransportsita,"/residuo/transportista/manifiesto/evidencia/save",preCargarManifiestos,2);
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviManifiestoC"+manifiestoId
									,bitsTransportsita,"/residuo/transportista/manifiesto/evidencia/save",preCargarManifiestos,3);	 
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviManifiestoD"+manifiestoId
									,bitsTransportsita,"/residuo/transportista/manifiesto/evidencia/save",preCargarManifiestos,4);	 
						break;
						default:
							console.log("Ocurrió un error al guardar el manifiesto!");
						}
					},null,null,null,null,false);
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


var numEvidenciasGuardadasManifiestos=0;
var numEvidenciasTotalManifiestos=4;
function preCargarManifiestos(){
	numEvidenciasGuardadasManifiestos++; 
	if(numEvidenciasGuardadasManifiestos==numEvidenciasTotalManifiestos){
		cargarManifiestos();
		numEvidenciasGuardadasManifiestos=0;
	};
}
 

function cancelarNuevoManifiesto(){
	cargarManifiestos();
}

