 var tipoResiduoId,tipoResiduoObj,tipoResiduoNombre;
var banderaEdicion112=false;
var listFullTipoResiduo;
var listTipoResiduoEmpresa;
$(function(){
	$("#btnNuevoTipoResiduo").attr("onclick", "javascript:nuevoTipoResiduo();");
	$("#btnCancelarTipoResiduo").attr("onclick", "javascript:cancelarNuevoTipoResiduo();");
	$("#btnGuardarTipoResiduo").attr("onclick", "javascript:guardarTipoResiduo();");
	$("#btnEliminarTipoResiduo").attr("onclick", "javascript:eliminarTipoResiduo();");
	 
})
/**
 * 
 */

function volverTipoResiduos(){
	$("#tabAlmacen .container-fluid").hide();
	$("#divContainTipoResiduo").show();
	$("#tabAlmacen").find("h2").html("Residuos - Almacenamiento");
}
function cargarTipoResiduos(){
	$("#btnCancelarTipoResiduo").hide();
	$("#btnNuevoTipoResiduo").show();
	$("#btnEliminarTipoResiduo").hide();
	$("#btnGuardarTipoResiduo").hide();
	volverTipoResiduos();
	callAjaxPost(URL + '/residuo/tipos', 
			{empresaId : getSession("gestopcompanyid") }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion112=false;
				 listFullTipoResiduo=data.list;
				 listTipoResiduoEmpresa=data.tipo;
					$("#tblTipoResiduos tbody tr").remove();
					listFullTipoResiduo.forEach(function(val,index){
						
						$("#tblTipoResiduos tbody").append(
								"<tr id='trtip"+val.id+"' onclick='editarTipoResiduo("+index+")'>" 
								+"<td id='tipnom"+val.id+"'>"+val.tipo.nombre+"</td>"
								+"<td id='tippel"+val.id+"'>"+val.indicadorPeligrosidad+"</td>"
								+"<td id='tipman"+val.id+"'>"+val.indicadorManejo+"</td>"
								+"<td id='tipdis"+val.id+"'>"+val.indicadorDisposicion+"</td>"
								+"<td id='tippro"+val.id+"'>"+val.indicadorProteccion+"</td>" 
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblTipoResiduos");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarTipoResiduo(pindex) {


	if (!banderaEdicion112) {
		formatoCeldaSombreableTabla(false,"tblTipoResiduos");
		tipoResiduoId = listFullTipoResiduo[pindex].id;
		tipoResiduoObj=listFullTipoResiduo[pindex]; 
		//
		var tipo=tipoResiduoObj.tipo.id;
		var selTipoTipoResiduo=crearSelectOneMenuOblig("selTipoTipoResiduo", "",
				listTipoResiduoEmpresa, tipo, "id", "nombre");
		$("#tipnom" + tipoResiduoId).html(selTipoTipoResiduo );
		//
		var recipiente=tipoResiduoObj.recipiente;
		$("#tiprec" + tipoResiduoId).html(
				"<input   id='inputRecipTipoResiduo' class='form-control'   >");
		$("#inputRecipTipoResiduo").val(recipiente);
		//
		var material=tipoResiduoObj.material;
		$("#tipmat" + tipoResiduoId).html(
				"<input   id='inputMaterialTipoResiduo' class='form-control'   >");
		$("#inputMaterialTipoResiduo").val(material);
		// 
		var volumen=tipoResiduoObj.volumen;
		$("#tipvol" + tipoResiduoId).html(
				"<input type='number' id='inputVolumenTipoResiduo' class='form-control' > ");
		$("#inputVolumenTipoResiduo").val(volumen);
		//   
		var textInfo=$("#tippel"+tipoResiduoId).text();
		$("#tippel"+tipoResiduoId).addClass("linkGosst")
		.on("click",function(){cargarFormPeligrosidadResiduo();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo);
		//
		var textInfo2=$("#tipman"+tipoResiduoId).text();
		$("#tipman"+tipoResiduoId).addClass("linkGosst")
		.on("click",function(){cargarFormManejoResiduo();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo2);
		//
		var textInfo3=$("#tipdis"+tipoResiduoId).text();
		$("#tipdis"+tipoResiduoId).addClass("linkGosst")
		.on("click",function(){cargarFormDisposicionResiduo();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo3);
		//
		var textInfo4=$("#tippro"+tipoResiduoId).text();
		$("#tippro"+tipoResiduoId).addClass("linkGosst")
		.on("click",function(){cargarProteccions();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo4);
		//
		
		//Manejo General
		$("#divContainManejoResiduo").find("table tbody tr").remove();
		$("#divContainManejoResiduo").find("table tbody").append(
				"<tr>" +
				"<td class='linkGosst' onclick='verFormManejoResiduo(1)'>" +
				"<i aria-hidden='true' class='fa fa-link fa-2x'></i>"+tipoResiduoObj.almacenamiento+" </td>" +
				"<td class='linkGosst' onclick='verFormManejoResiduo(2)'>" +
				"<i aria-hidden='true' class='fa fa-link fa-2x'></i>"+tipoResiduoObj.tratamiento+" </td>" +
				"<td class='linkGosst' onclick='verFormManejoResiduo(3)'>" +
				"<i aria-hidden='true' class='fa fa-link fa-2x'></i>"+tipoResiduoObj.reciclaje+" </td>" +
				"<td class='linkGosst' onclick='verFormManejoResiduo(4)'>" +
				"<i aria-hidden='true' class='fa fa-link fa-2x'></i>"+tipoResiduoObj.minimizacion+" </td>" + 
				  
				"</tr>");
		verFormManejoResiduo(1);
		verFormManejoResiduo(2);
		verFormManejoResiduo(3);
		verFormManejoResiduo(4);
		verFormManejoResiduo(5);
		cargarFormDisposicionResiduo();
		volverTipoResiduos();
		banderaEdicion112 = true;
		$("#btnCancelarTipoResiduo").show();
		$("#btnNuevoTipoResiduo").hide();
		$("#btnEliminarTipoResiduo").show();
		$("#btnGuardarTipoResiduo").show();
	}
	
}


function nuevoTipoResiduo() {
	if (!banderaEdicion112) {
		tipoResiduoId = 0;
		var selTipoTipoResiduo=crearSelectOneMenuOblig("selTipoTipoResiduo", "",
				listTipoResiduoEmpresa, "", "id", "nombre");
		$("table tbody tr input").val("");
		$("#tblTipoResiduos tbody")
				.prepend(
						"<tr >" 
						+"<td>"+selTipoTipoResiduo+"</td>"
						+"<td>"+"..." +"</td>"
						+"<td>"+"..." +"</td>"
						+"<td>"+"..." +"</td>"
						+"<td>"+"..." +"</td>"
						
						 		+ "</tr>");
		// 
		//
		$("#btnCancelarTipoResiduo").show();
		$("#btnNuevoTipoResiduo").hide();
		$("#btnEliminarTipoResiduo").hide();
		$("#btnGuardarTipoResiduo").show(); 
		banderaEdicion112 = true;
		formatoCeldaSombreableTabla(false,"tblTipoResiduos");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarTipoResiduo() {
	cargarTipoResiduos();
}

function eliminarTipoResiduo() {
	var r = confirm("¿Está seguro de eliminar ");
	if (r == true) {
		var dataParam = {
				id : tipoResiduoId,
		};
		callAjaxPost(URL + '/residuo/tipo/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarTipoResiduos();
						break;
					default:
						alert("No se puede eliminar, hay manifiestos asociados.");
					}
				});
	}
}

function guardarTipoResiduo() {

	var campoVacio = true;
	var tipo=$("#selTipoTipoResiduo").val();  
	
	//Almacen
	var almacenamiento=$("#inputAlmacenamientoTipRes").val();
	var recipiente=$("#inputRecipTipoResiduo").val();  
	var material=$("#inputMaterialTipoResiduo").val();  
	var volumen=$("#inputVolumenTipoResiduo").val(); 
	var numRecipientes=$("#inputNumRecipTipRes").val();
	//Trat
	var tratamiento=$("#inputTratamientoTipRes").val();
	var numEps=$("#inputNumEpsTrat").val();
	var fechaVencimientoEps=$("#dateVenceEpsTrat").val();
	var numAutorizacionMunicipal=$("#inputNroAutorizacionMuniTrat").val();
	var metodo=$("#inputMetodoTipRes").val();
	var cantidadTratamiento=$("#inputCantidadTratTipRes").val();
	//Reap
	var reciclaje=$("#inputReciclajeTipRes").val();
	var recuperacion=$("#inputRecupTipRes").val();
	var reutilizacion=$("#inputReutilTipRes").val();
	var cantidadReaprovechamiento=$("#inputCantidadReapTipRes").val();
	//Minimia
	var minimizacion=$("#inputMinimizacionTipRes").val();
	var cantidadMinimizacion=$("#inputCantMiniTipRes").val();
	
	//Transporte
	var numEpsTransporte=$("#inputNumEpsTransporte").val();
	var fechaVencimientoEpsTransporte=$("#dateVenceEpsTransporte").val();
	var numAutorizacionMunicipalTransporte=$("#inputNroAutorizacionMuniTrans").val();
	var numAprobRutaTransporte=$("#inputNroAprobRutaTrans").val();
	
	
	//Disposicion
	var nombreEpsDisposicion=$("#inputNombreEpsDispos").val();
	var numEpsDisposicion=$("#inputNumEpsDisposicion").val();
	var fechaVencimientoEpsDisposicion=$("#dateVenceEpsDisposicion").val();
	var numAutorizacionMunicipalDisposicion=$("#inputNroAutorizacionMuniDispos").val();
	var numAutorizacionRellenoDisposicion=$("#inputNroAutorizacionRellDispos").val();
	var metodoDisposicion=$("#inputMetodoDispos").val();
	var ubicacion=$("#inputUbicacionDisp").val();
	 
	
 if (campoVacio) {

			var dataParam = {
				id : tipoResiduoId,
				tipo:{id:tipo},
				recipiente:recipiente, 
				material:material, 
				volumen:volumen, 
				almacenamiento:almacenamiento,
				numRecipientes:numRecipientes,
				
				tratamiento:tratamiento,
				numEpsTratamiento:numEps,
				fechaVencimientoEpsTratamiento:convertirFechaTexto(fechaVencimientoEps),
				numAutorizacionMunicipalTratamiento:numAutorizacionMunicipal,
				metodo:metodo,
				cantidadTratamiento:cantidadTratamiento,
				
				reciclaje:reciclaje,
				recuperacion:recuperacion,
				reutilizacion:reutilizacion,
				cantidadReaprovechamiento:cantidadReaprovechamiento,
				
				minimizacion:minimizacion,
				cantidadMinimizacion:cantidadMinimizacion,
				
				numEpsTransporte:numEpsTransporte,
				fechaVencimientoEpsTransporte:convertirFechaTexto(fechaVencimientoEpsTransporte),
				numAutorizacionMunicipalTransporte:numAutorizacionMunicipalTransporte,
				numAprobRutaTransporte:numAprobRutaTransporte,
				
				nombreEpsDisposicion:nombreEpsDisposicion,
				numEpsDisposicion:numEpsDisposicion,
				fechaVencimientoEpsDisposicion:convertirFechaTexto(fechaVencimientoEpsDisposicion),
				numAutorizacionMunicipalDisposicion:numAutorizacionMunicipalDisposicion,
				numAutorizacionRellenoDisposicion:numAutorizacionRellenoDisposicion,
				metodoDisposicion:metodoDisposicion,
				ubicacion:ubicacion,
				empresa :{empresaId :getSession("gestopcompanyid")}
			};

			callAjaxPost(URL + '/residuo/tipo/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							cargarTipoResiduos();
							break;
						default:
							console.log("Ocurrió un error al guardar el residuo!");
						}
					},null,null,null,null,false);
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}
var listPeligros;
function cargarFormPeligrosidadResiduo(){
	$("#tabAlmacen .container-fluid").hide();
	$("#divContainPeligResiduo").show();
	$("#tabAlmacen").find("h2").html("<a onclick='volverTipoResiduos()'> Residuo ("
			+tipoResiduoObj.tipo.nombre+") </a> > Peligrosidad");
	
	callAjaxPost(URL + '/residuo/tipo/peligros', 
			{id:tipoResiduoObj.id }, function(data){
				if(data.CODE_RESPONSE=="05"){ 
				 listPeligros=data.list; 
					$("#tblPeligrosResiduos tbody tr").remove();
					listPeligros.forEach(function(val,index){
						var inputText="",checkedInput="checked";
						if(val.id==94){
							inputText=":  <input class='form-control' value='"+val.detalle+"' >"
						}
						if(val.isAsignado==0){
							checkedInput="";
						}
						$("#tblPeligrosResiduos tbody").append(
								"<tr id='trpelr"+val.id+"'   >" 
								+"<td id='pelch"+val.id+"'>"+"<input type='checkbox' class='form-control' "+checkedInput+">"+"</td>"
								+"<td id='peln"+val.id+"'>"+val.nombre+inputText+"</td>"
								 +"</tr>");
					});
					$("#btnGuardarPeligroResiduo").attr("onclick","guardarPeligrosResiduo()");
				}else{
					console.log("NOPNPO")
				}
			});
	
}
function guardarPeligrosResiduo(){
	var listOpciones=[];
	listPeligros.forEach(function(val,index){
		var isCheck=$("#pelch"+val.id).find("input").prop("checked");
		var detalle=$("#peln"+val.id).find("input").val();
		if(isCheck){
			listOpciones.push(
					{
						id:val.id, 
						tipo:{id:tipoResiduoObj.id},
						detalle:detalle
					});
		}
		
	});
	callAjaxPost(URL + '/residuo/tipo/peligros/save', 
			{peligros:listOpciones,id:tipoResiduoObj.id}, function(data){
				if(data.CODE_RESPONSE=="05"){ 
				  alert("Se guardaron los peligros del residuo");
				  volverTipoResiduos();
				}else{
					console.log("NOPNPO")
				}
			}); 
}
function cargarFormManejoResiduo(){
	$("#tabAlmacen .container-fluid").hide();
	$("#divContainManejoResiduo").show();
	$("#tabAlmacen").find("h2").html("<a onclick='volverTipoResiduos()'> Residuo ("
			+tipoResiduoObj.tipo.nombre+") </a> > Manejo");
}
function verFormManejoResiduo(manejoFormId){
	var divContainer="",tituloHeader="";
	switch(parseInt(manejoFormId)){
	case 1:
		divContainer="divContainSubManejoAlmacen";
		tituloHeader="Almacenamiento";
		$("#"+divContainer).find("table tbody tr").remove();
		$("#"+divContainer).find("table tbody").append("" +
				"<tr>" +
				"<td>"+"<input class='form-control' id='inputRecipTipoResiduo'>" +"</td>"+
				"<td>"+"<input class='form-control' id='inputMaterialTipoResiduo'>" +"</td>"+
				"<td>"+"<input class='form-control' type='number' id='inputVolumenTipoResiduo'>" +"</td>"+
				"<td>"+"<input class='form-control' type='number' id='inputNumRecipTipRes'>" +"</td>"+
				"</tr>" +
				"");
		$("#inputNumRecipTipRes").val(tipoResiduoObj.numRecipientes);
		
		$("#inputRecipTipoResiduo").val(tipoResiduoObj.recipiente);
		$("#inputMaterialTipoResiduo").val(tipoResiduoObj.material);
		$("#inputVolumenTipoResiduo").val(tipoResiduoObj.volumen);
		$("#btnGuardarSubManejoAlmacen").attr("onclick","guardarTipoResiduo()");
		 
		break;
	case 2:
		divContainer="divContainSubManejoTratamiento";
		tituloHeader="Tratamiento";
		$("#"+divContainer).find("table tbody tr").remove();
		$("#"+divContainer).find("table tbody").append("" +
				"<tr>" +
				"<td>"+"<input class='form-control' id='inputTratamientoTipRes'>" +"</td>"+
				"<td>"+"<input class='form-control' type='number' id='inputNumEpsTrat'>" +"</td>"+
				"<td>"+"<input class='form-control' type='date' id='dateVenceEpsTrat'>" +"</td>"+
				"<td>"+"<input class='form-control'   id='inputNroAutorizacionMuniTrat'>" +"</td>"+
				"<td>"+"<input class='form-control' id='inputMetodoTipRes'>" +"</td>"+
				"<td>"+"<input class='form-control' type='number' id='inputCantidadTratTipRes'>" +"</td>"+
				"</tr>" +
				"");
		$("#inputTratamientoTipRes").val(tipoResiduoObj.tratamiento);
		$("#inputNumEpsTrat").val(tipoResiduoObj.numEpsTratamiento);
		$("#dateVenceEpsTrat").val(convertirFechaInput(tipoResiduoObj.fechaVencimientoEpsTratamiento));
		$("#inputNroAutorizacionMuniTrat").val(tipoResiduoObj.numAutorizacionMunicipalTratamiento);
		$("#inputMetodoTipRes").val(tipoResiduoObj.metodo);
		$("#inputCantidadTratTipRes").val(tipoResiduoObj.cantidadTratamiento);
		$("#btnGuardarSubManejoTratamiento").attr("onclick","guardarTipoResiduo()")
		break;
	case 3:
		divContainer="divContainSubManejoReaprovechamiento";
		tituloHeader="Reaprovechamiento";
		$("#"+divContainer).find("table tbody tr").remove();
		$("#"+divContainer).find("table tbody").append("" +
				"<tr>" +
				"<td>"+"<input class='form-control' id='inputReciclajeTipRes'>" +"</td>"+  
				"<td>"+"<input class='form-control' id='inputRecupTipRes'>" +"</td>"+  
				"<td>"+"<input class='form-control' id='inputReutilTipRes'>" +"</td>"+  
				"<td>"+"<input class='form-control' type='number' id='inputCantidadReapTipRes'>" +"</td>"+
				"</tr>" +
				"");
		$("#inputReciclajeTipRes").val(tipoResiduoObj.reciclaje);
		$("#inputRecupTipRes").val(tipoResiduoObj.recuperacion); 
		$("#inputReutilTipRes").val(tipoResiduoObj.reutilizacion); 
		$("#inputCantidadReapTipRes").val(tipoResiduoObj.cantidadReaprovechamiento);
		$("#btnGuardarSubManejoReapro").attr("onclick","guardarTipoResiduo()")
		break;
	case 4:
		divContainer="divContainSubManejoMini";
		tituloHeader="Minimizacion y Segregación";
		$("#"+divContainer).find("table tbody tr").remove();
		$("#"+divContainer).find("table tbody").append("" +
				"<tr>" +
				"<td>"+"<input class='form-control' id='inputMinimizacionTipRes'>" +"</td>"+   
				"<td>"+"<input class='form-control' type='number' id='inputCantMiniTipRes'>" +"</td>"+
				"</tr>" +
				"");
		$("#inputMinimizacionTipRes").val(tipoResiduoObj.minimizacion); 
		$("#inputCantMiniTipRes").val(tipoResiduoObj.cantidadMinimizacion);
		$("#btnGuardarSubManejoMini").attr("onclick","guardarTipoResiduo()")
		break;
	case 5:
		divContainer="divContainSubManejoTransporte";
		tituloHeader="Transporte Habitual";
		$("#"+divContainer).find("table tbody tr").remove();
		$("#"+divContainer).find("table tbody").append("" +
				"<tr>" + 
				"<td>"+"<input class='form-control' type='number' id='inputNumEpsTransporte'>" +"</td>"+
				"<td>"+"<input class='form-control' type='date' id='dateVenceEpsTransporte'>" +"</td>"+
				"<td>"+"<input class='form-control'   id='inputNroAutorizacionMuniTrans'>" +"</td>"+
				"<td>"+"<input class='form-control' id='inputNroAprobRutaTrans'>" +"</td>"+ 
				"</tr>" +
				""); 
		$("#inputNumEpsTransporte").val(tipoResiduoObj.numEpsTransporte);
		$("#dateVenceEpsTransporte").val(convertirFechaInput(tipoResiduoObj.fechaVencimientoEpsTransporte));
		$("#inputNroAutorizacionMuniTrans").val(tipoResiduoObj.numAutorizacionMunicipalTransporte);
		$("#inputNroAprobRutaTrans").val(tipoResiduoObj.numAprobRutaTransporte); 
		$("#btnGuardarSubManejoTransporte").attr("onclick","guardarTipoResiduo()")
		break; 
	} 
	
	
	$("#tabAlmacen .container-fluid").hide();
	$("#tabAlmacen").find("h2").html("<a onclick='volverTipoResiduos()'> Residuo ("
			+tipoResiduoObj.tipo.nombre+") </a> ><a onclick='cargarFormManejoResiduo()'> Manejo General </a>" +
					" > "+tituloHeader);
	$("#"+divContainer).show();
	
}
function verFormDisposicionResiduo(manejoFormId){

	
}
function cargarFormDisposicionResiduo(){
	var divContainer="",tituloHeader="";
	 
	divContainer="divContainDisposicion";
	tituloHeader="Disposición Final";
	$("#"+divContainer).find("table tbody tr").remove();
	$("#"+divContainer).find("table tbody").append("" +
			"<tr>" +
			"<td>"+"<input class='form-control' id='inputNombreEpsDispos'>" +"</td>"+
			"<td>"+"<input class='form-control'  id='inputNumEpsDisposicion'>" +"</td>"+
			"<td>"+"<input class='form-control' type='date' id='dateVenceEpsDisposicion'>" +"</td>"+
			"<td>"+"<input class='form-control'   id='inputNroAutorizacionMuniDispos'>" +"</td>"+
			"<td>"+"<input class='form-control' id='inputNroAutorizacionRellDispos'>" +"</td>"+
			"<td>"+"<input class='form-control'   id='inputMetodoDispos'>" +"</td>"+
			"<td>"+"<input class='form-control' id='inputUbicacionDisp'>" +"</td>"+ 
			"</tr>" +
			"");
	$("#inputNombreEpsDispos").val(tipoResiduoObj.nombreEpsDisposicion);
	$("#inputNumEpsDisposicion").val(tipoResiduoObj.numEpsDisposicion);
	$("#dateVenceEpsDisposicion").val(convertirFechaInput(tipoResiduoObj.fechaVencimientoEpsDisposicion));
	$("#inputNroAutorizacionMuniDispos").val(tipoResiduoObj.numAutorizacionMunicipalDisposicion);
	$("#inputNroAutorizacionRellDispos").val(tipoResiduoObj.numAutorizacionRellenoDisposicion);
	$("#inputMetodoDispos").val(tipoResiduoObj.metodoDisposicion);
	$("#inputUbicacionDisp").val(tipoResiduoObj.ubicacion);
	$("#btnGuardarDisposResiduo").attr("onclick","guardarTipoResiduo()")
	 


$("#tabAlmacen .container-fluid").hide();
$("#tabAlmacen").find("h2").html("<a onclick='volverTipoResiduos()'> Residuo ("
		+tipoResiduoObj.tipo.nombre+") </a> > " +
				"  "+tituloHeader);
$("#"+divContainer).show();
}   
function cancelarNuevoTipoResiduo(){
	cargarTipoResiduos();
}


