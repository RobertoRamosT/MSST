 var transportistaId,transportistaObj,transportistaNombre;
var banderaEdicion3=false;
var listFullTransportistas;
var listTipoTransportista;
$(function(){
	$("#btnNuevoTransportista").attr("onclick", "javascript:nuevoTransportista();");
	$("#btnCancelarTransportista").attr("onclick", "javascript:cancelarNuevoTransportista();");
	$("#btnGuardarTransportista").attr("onclick", "javascript:guardarTransportista();");
	$("#btnEliminarTransportista").attr("onclick", "javascript:eliminarTransportista();");
	 
})
/**
 * 
 */

function volverTransportistas(){
	$("#tabSalidas .container-fluid").hide();
	$("#divContainTransportista").show();
	$("#tabSalidas").find("h2").html("Transportistas");
}
function cargarTransportistas(){
	$("#btnCancelarTransportista").hide();
	$("#btnNuevoTransportista").show();
	$("#btnEliminarTransportista").hide();
	$("#btnGuardarTransportista").hide();
	volverTransportistas();
	callAjaxPost(URL + '/residuo/transportistas', 
			{empresaId : getSession("gestopcompanyid") }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion3=false;
				 listFullTransportistas=data.list;
				 listTipoTransportista=data.tipo;
					$("#tblTransportistas tbody tr").remove();
					listFullTransportistas.forEach(function(val,index){
						
						$("#tblTransportistas tbody").append(
								"<tr id='trtra"+val.id+"' onclick='editarTransportista("+index+")'>" 
								+"<td id='tratipo"+val.id+"'>"+val.tipo.nombre+"</td>" 
								+"<td id='traruc"+val.id+"'>"+val.ruc+"</td>"
								+"<td id='tranombre"+val.id+"'>"+val.nombre+"</td>"
								+"<td id='tratipres"+val.id+"'>"+val.tipoResiduoNombre+"</td>"
								+"<td id='traind"+val.id+"'>"+val.indicadorManifiestos+"</td>"
								
								+"<td id='traperca"+val.id+"'>"+val.permisoA.codigo+"</td>" 
								+"<td id='traperfa"+val.id+"'>"+val.permisoA.fechaTexto+"</td>" 
								+"<td id='trapera"+val.id+"'>"+val.permisoA.nombre+"</td>"
								
								+"<td id='trapercb"+val.id+"'>"+val.permisoB.codigo+"</td>" 
								+"<td id='traperfb"+val.id+"'>"+val.permisoB.fechaTexto+"</td>" 
								+"<td id='traperb"+val.id+"'>"+val.permisoB.nombre+"</td>" 
								
								+"<td id='trapercc"+val.id+"'>"+val.permisoC.codigo+"</td>" 
								+"<td id='traperfc"+val.id+"'>"+val.permisoC.fechaTexto+"</td>" 
								+"<td id='traperc"+val.id+"'>"+val.permisoC.nombre+"</td>" 
								+"<td id='trakg"+val.id+"'>"+val.cantidadPeligrosa+"</td>"
								+"<td id='trakgno"+val.id+"'>"+val.cantidadNoPeligrosa+"</td>"
								+"<td id='trabcostv"+val.id+"'>"+val.costoViaje+"</td>"
								+"<td id='travehi"+val.id+"'>"+val.indicadorVehiculos+"</td>"
								+"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblTransportistas");
				}else{
					console.log("NOPNPO")
				}
			});

	
}

function editarTransportista(pindex) {


	if (!banderaEdicion3) {
		formatoCeldaSombreableTabla(false,"tblTransportistas");
		transportistaId = listFullTransportistas[pindex].id;
		transportistaObj=listFullTransportistas[pindex]; 
		//
		var tipo=transportistaObj.tipo.id;
		var selTipoTransportista=crearSelectOneMenuOblig("selTipoTransportista", "",
				listTipoTransportista, tipo, "id", "nombre");
		$("#tratipo" + transportistaId).html(selTipoTransportista );
		//
		var ruc=transportistaObj.ruc;
		$("#traruc" + transportistaId).html(
				"<input type='text' id='inputRucTransportista' class='form-control'  " +
				"onkeydown='return IsNumeric(event);'  onkeyup='return IsNumericRestriccion(event);' >");
		$("#inputRucTransportista").val(ruc);
		//
		var nombre=transportistaObj.nombre;
		$("#tranombre" + transportistaId).html(
				"<input   id='inputNombreTransportista' class='form-control'   >");
		$("#inputNombreTransportista").val(nombre);
		//

		var tipoResiduoNombre=transportistaObj.tipoResiduoNombre;
		$("#tratipres" + transportistaId).html(
				"<input   id='inputTipoResiduoNombre' class='form-control'   >");
		$("#inputTipoResiduoNombre").val(tipoResiduoNombre);
		//
		
		var codigoA=transportistaObj.permisoA.codigo;
		$("#traperca" + transportistaId).html(
				"<input   id='inputCodigoTransportistaA' class='form-control'   >");
		$("#inputCodigoTransportistaA").val(codigoA);
		//
		var optionsA=
		{container:"#trapera"+transportistaId,
				functionCall:function(){ },
				descargaUrl: "/residuo/transportista/evidencia?id="+ transportistaId+"&tipoId=1",
				esNuevo:false,
				idAux:"TransportistaA"+transportistaId,
				evidenciaNombre:transportistaObj.permisoA.nombre};
		crearFormEvidenciaCompleta(optionsA);
		//
		var fechaA=convertirFechaInput(transportistaObj.permisoA.fecha);
		$("#traperfa" + transportistaId).html(
				"<input type='date' id='inputDateTransportistaA' class='form-control'>  ");
		$("#inputDateTransportistaA").val(fechaA);
		
		//
		var codigoB=transportistaObj.permisoB.codigo;
		$("#trapercb" + transportistaId).html(
				"<input   id='inputCodigoTransportistaB' class='form-control'   >");
		$("#inputCodigoTransportistaB").val(codigoB);
		//
		var optionsB=
		{container:"#traperb"+transportistaId,
				functionCall:function(){ },
				descargaUrl: "/residuo/transportista/evidencia?id="+ transportistaId+"&tipoId=2",
				esNuevo:false,
				idAux:"TransportistaB"+transportistaId,
				evidenciaNombre:transportistaObj.permisoB.nombre};
		crearFormEvidenciaCompleta(optionsB);
		//
		var fechaB=convertirFechaInput(transportistaObj.permisoB.fecha);
		$("#traperfb" + transportistaId).html(
				"<input type='date' id='inputDateTransportistaB' class='form-control' > ");
		$("#inputDateTransportistaB").val(fechaB);
		
		//
		var codigoC=transportistaObj.permisoC.codigo;
		$("#trapercc" + transportistaId).html(
				"<input   id='inputCodigoTransportistaC' class='form-control'   >");
		$("#inputCodigoTransportistaC").val(codigoC);
		//
		var optionsC=
		{container:"#traperc"+transportistaId,
				functionCall:function(){ },
				descargaUrl: "/residuo/transportista/evidencia?id="+ transportistaId+"&tipoId=3",
				esNuevo:false,
				idAux:"TransportistaC"+transportistaId,
				evidenciaNombre:transportistaObj.permisoC.nombre};
		crearFormEvidenciaCompleta(optionsC);
		//
		var fechaC=convertirFechaInput(transportistaObj.permisoC.fecha);
		$("#traperfc" + transportistaId).html(
				"<input type='date' id='inputDateTransportistaC' class='form-control' > ");
		$("#inputDateTransportistaC").val(fechaC);
		
		//
		var cantidadPeligrosa=transportistaObj.cantidadPeligrosa;
		$("#trakg" + transportistaId).html(
				"<input type='number' id='inputCantPeligroTransportista' class='form-control' > ");
		$("#inputCantPeligroTransportista").val(cantidadPeligrosa);
		//
		var cantidadNoPeligrosa=transportistaObj.cantidadNoPeligrosa;
		$("#trakgno" + transportistaId).html(
				"<input type='number' id='inputCantNoPeligroTransportista' class='form-control'  >");
		$("#inputCantNoPeligroTransportista").val(cantidadNoPeligrosa);
		//
		var costoViaje=transportistaObj.costoViaje;
		$("#trabcostv" + transportistaId).html(
				"<input type='number' id='inputCostoViajeTransportista' class='form-control'  >");
		$("#inputCostoViajeTransportista").val(costoViaje);
		//
		
		var textInfo=$("#traind"+transportistaId).text();
		$("#traind"+transportistaId).addClass("linkGosst")
		.on("click",function(){cargarManifiestos();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo);
		//
		var textInfo2=$("#travehi"+transportistaId).text();
		$("#travehi"+transportistaId).addClass("linkGosst")
		.on("click",function(){cargarVehiculos();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo2);
		//
		
		banderaEdicion3 = true;
		$("#btnCancelarTransportista").show();
		$("#btnNuevoTransportista").hide();
		$("#btnEliminarTransportista").show();
		$("#btnGuardarTransportista").show();
		$("#btnGenReporte").hide();
		
	}
	
}


function nuevoTransportista() {
	if (!banderaEdicion3) {
		transportistaId = 0;
		var selTipoTransportista=crearSelectOneMenuOblig("selTipoTransportista", "",
				listTipoTransportista, "", "id", "nombre");
		$("#tblTransportistas tbody")
				.prepend(
						"<tr >" 
						+"<td>"+selTipoTransportista+"</td>"
						+"<td>"+"<input type='text' id='inputRucTransportista' class='form-control'  " +
						"onkeydown='return IsNumeric(event);'  onkeyup='return IsNumericRestriccion(event);' >"+"</td>"
						+"<td>"+"<input   id='inputNombreTransportista' class='form-control'   >"+"</td>"
						+"<td>"+"<input   id='inputTipoResiduoNombre' class='form-control'   >"+"</td>"
						
						
						+"<td>"+"..." +"</td>"
						
						+"<td><input class='form-control' id='inputCodigoTransportistaA'></td>"
						+"<td>"+"<input type='date' id='inputDateTransportistaA' class='form-control'  >"+"</td>"
						+"<td id='trapera0'></td>" 
						
						+"<td><input class='form-control' id='inputCodigoTransportistaB'></td>"
						+"<td>"+"<input type='date' id='inputDateTransportistaB' class='form-control'  >"+"</td>"
						+"<td id='traperb0'></td>" 
						
						+"<td><input class='form-control' id='inputCodigoTransportistaC'></td>"
						+"<td>"+"<input type='date' id='inputDateTransportistaC' class='form-control'  >"+"</td>"
						+"<td id='traperc0'></td>" 
						+"<td>"+ "<input type='number' id='inputCantPeligroTransportista' class='form-control' > "+"</td>"
						+"<td>"+ "<input type='number' id='inputCantNoPeligroTransportista' class='form-control'  >"+"</td>"
						+"<td>"+ "<input type='number' id='inputCostoViajeTransportista' class='form-control' > "+"</td>"
						+"<td>"+"..." +"</td>"
						 		+ "</tr>");
		//
		$("#inputFechaTransportista").val(obtenerFechaActual());
		var optionsA=
		{container:"#trapera"+transportistaId,
				functionCall:function(){},
				descargaUrl: "",
				esNuevo:true,
				idAux:"TransportistaA"+transportistaId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(optionsA);
		var optionsB=
		{container:"#traperb"+transportistaId,
				functionCall:function(){},
				descargaUrl: "",
				esNuevo:true,
				idAux:"TransportistaB"+transportistaId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(optionsB);
		var optionsC=
		{container:"#traperc"+transportistaId,
				functionCall:function(){},
				descargaUrl: "",
				esNuevo:true,
				idAux:"TransportistaC"+transportistaId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(optionsC);
		//
		$("#btnCancelarTransportista").show();
		$("#btnNuevoTransportista").hide();
		$("#btnEliminarTransportista").hide();
		$("#btnGuardarTransportista").show();
		$("#btnGenReporte").hide();
		banderaEdicion3 = true;
		formatoCeldaSombreableTabla(false,"tblTransportistas");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarTransportista() {
	cargarTransportistas();
}

function eliminarTransportista() {
	var r = confirm("¿Está seguro de eliminar el transportista");
	if (r == true) {
		var dataParam = {
				id : transportistaId,
		};
		callAjaxPost(URL + '/residuo/transportista/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarTransportistas();
						break;
					default:
						alert("No se puede eliminar, hay manifiestos asociados.");
					}
				});
	}
}

function guardarTransportista() {

	var campoVacio = true;
	var tipo=$("#selTipoTransportista").val();  var tipoResiduoNombre=$("#inputTipoResiduoNombre").val();
	var ruc=$("#inputRucTransportista").val();
 var nombre=$("#inputNombreTransportista").val();
var fechaA=convertirFechaTexto($("#inputDateTransportistaA").val());
var fechaB=convertirFechaTexto($("#inputDateTransportistaB").val());
var fechaC=convertirFechaTexto($("#inputDateTransportistaC").val());
var codigoA=$("#inputCodigoTransportistaA").val();
var codigoB=$("#inputCodigoTransportistaB").val();
var codigoC=$("#inputCodigoTransportistaC").val();
var cantidadPeligrosa=$("#inputCantPeligroTransportista").val();
var cantidadNoPeligrosa=$("#inputCantNoPeligroTransportista").val();
var costoViaje=$("#inputCostoViajeTransportista").val();
		if (campoVacio) {

			var dataParam = {
				id : transportistaId,
				tipo:{id:tipo},
				ruc:ruc,
				nombre:nombre,tipoResiduoNombre:tipoResiduoNombre,
				permisoA:{fecha:fechaA,codigo:codigoA},
				permisoB:{fecha:fechaB,codigo:codigoB},
				permisoC:{fecha:fechaC,codigo:codigoC},costoViaje:costoViaje,
				cantidadPeligrosa:cantidadPeligrosa,
				cantidadNoPeligrosa:cantidadNoPeligrosa,
				empresa :{empresaId :getSession("gestopcompanyid")}
			};

			callAjaxPost(URL + '/residuo/transportista/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviTransportistaA"+transportistaId
									,bitsTransportsita,"/residuo/transportista/evidencia/save",preCargarTransportistas,1);
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviTransportistaB"+transportistaId
									,bitsTransportsita,"/residuo/transportista/evidencia/save",preCargarTransportistas,2);
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviTransportistaC"+transportistaId
									,bitsTransportsita,"/residuo/transportista/evidencia/save",preCargarTransportistas,3);	 
						break;
						default:
							console.log("Ocurrió un error al guardar el transportista!");
						}
					},null,null,null,null,false);
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


var numEvidenciasGuardadasTransportistas=0;
var numEvidenciasTotalTransportistas=3;
function preCargarTransportistas(){
	numEvidenciasGuardadasTransportistas++; 
	if(numEvidenciasGuardadasTransportistas==numEvidenciasTotalTransportistas){
		cargarTransportistas();
		numEvidenciasGuardadasTransportistas=0;
	};
}
 

function cancelarNuevoTransportista(){
	cargarTransportistas();
}


