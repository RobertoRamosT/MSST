/**
 * 
 */

var objTransportistaResiduo={};
var listFullTransportistasResiduo;
var listTipoTransportistaResiduo;

function toggleMenuOpcionTransportista(obj,pindex){
	objTransportistaResiduo=listFullTransportistasResiduo[pindex];
	objTransportistaResiduo.index=pindex;
	$(obj).parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent(".eventoGeneral").siblings().find("ul").hide(); 	
}
var funcionalidadesTransportista=[ 
{id:"opcDescarga1",nombre:"Descargar Autorización Digesa",functionClick:function(data){
	window.open(URL+"/residuo/transportista/evidencia?id="+ objTransportistaResiduo.id+"&tipoId=1",'_blank')
	}  },
{id:"opcDescarga2",nombre:"Descargar Licencia Municipal",functionClick:function(data){
	window.open(URL+"/residuo/transportista/evidencia?id="+ objTransportistaResiduo.id+"&tipoId=2",'_blank')
	}  },
{id:"opcDescarga3",nombre:"Descargar Autorización MTC",functionClick:function(data){
	window.open(URL+"/residuo/transportista/evidencia?id="+ objTransportistaResiduo.id+"&tipoId=3",'_blank')
	}  },
	{id:"opcVehi",nombre:"Nuevo Vehículo",functionClick:function(data){nuevoVehiculoTransportista()}  },
    {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarTransportistaResiduo()}  },
   {id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarTransportistaResiduo()}  
   
    
    }
                           ]
function marcarSubOpcionTransportista(pindex){
	funcionalidadesTransportista[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".listaGestionGosst").hide();
}
function habilitarTransportistasResiduo(){
	var dataParam={
			empresaId:getSession("gestopcompanyid")
			};
	objTransportistaResiduo={id:0};
	var listPanelesPrincipal=[];
	
	callAjaxPost(URL + '/residuo/transportistas', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			
			var textIn= "";
			listFullTransportistasResiduo=data.list;
			$(".divListPrincipal").html("");
			listFullTransportistasResiduo.forEach(function(val,index){
				var menuOpcion="<ul class='list-group listaGestionGosst' >";
				funcionalidadesTransportista.forEach(function(val1,index1){
					menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionTransportista("+index1+")'>"+val1.nombre+" </li>"
				});
				menuOpcion+="</ul>";
				var estiloGosst="gosst-neutral";
				 
				textIn+=("<div class='eventoGeneral "+estiloGosst+"'>" +
						"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionTransportista(this,"+index+")'>" +
						"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
						menuOpcion+
						"<i class='fa fa-info' aria-hidden='true'></i>Tipo: "+val.tipo.nombre+"<br>"+ 
						"<i class='fa fa-info' aria-hidden='true'></i>RUC: " +val.ruc+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Razón Social: " +val.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Autorización Digesa: " +val.permisoA.codigo+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Fecha de vencimiento: " +val.permisoA.fechaTexto+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Licencia municipal: " +val.permisoB.codigo+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Fecha de vencimiento: " +val.permisoB.fechaTexto+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Autorización MTC: " +val.permisoC.codigo+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Fecha de vencimiento: " +val.permisoC.fechaTexto+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Costo Por Kg Peligroso: " +val.cantidadPeligrosa+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Costo Por Kg No Peligroso: " +val.cantidadNoPeligrosa+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Costo Por Viaje: " +val.costoViaje+"<br>"+
						"<a onclick='verVehiculosTransportista("+index+")'><i class='fa fa-info' aria-hidden='true'></i>Vehículos Asociados: " +val.indicadorVehiculos+"</a><br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Salidas Asociadas: " +val.indicadorManifiestos+"<br>"+
						
						"</div>"+
						"<div class='divVehiculoTransportista divRelacionado' id='divVehi"+val.id+"'>" +
						"" +
						"</div>"
						
				
				);
				 
				
			});
			listTipoTransportistaResiduo=data.tipo;
			var selTipoTransportista=crearSelectOneMenuOblig("selTipoTransportista", "",
					listTipoTransportistaResiduo, "", "id", "nombre");
			var listItemsExam=[
				{sugerencia:"",label:"Tipo",inputForm:selTipoTransportista},
				{sugerencia:"",label:"RUC",inputForm:"<input class='form-control' id='inputRucTransportista'>"},
				{sugerencia:"",label:"Razón Social",inputForm:"<input class='form-control' id='inputNombreTransportista'>"}, 
				{sugerencia:"",label:"",inputForm:"",divContainer:""}, 
				
				{sugerencia:"",label:"Autorización Digesa",inputForm:"",divContainer:"eviTransportistaResiduoA"},
				{sugerencia:"",label:"Código",inputForm:"<input class='form-control' id='inputCodigoTransportistaA'>"}, 
				{sugerencia:"",label:"Fecha de vencimiento",inputForm:"<input type='date' class='form-control' id='inputDateTransportistaA'>"}, 
				{sugerencia:"",label:"",inputForm:"",divContainer:""}, 
				
				{sugerencia:"",label:"Licencia municipal",inputForm:"",divContainer:"eviTransportistaResiduoB"},
				{sugerencia:"",label:"Código",inputForm:"<input class='form-control' id='inputCodigoTransportistaB'>"}, 
				{sugerencia:"",label:"Fecha de vencimiento",inputForm:"<input type='date' class='form-control' id='inputDateTransportistaB'>"}, 
				{sugerencia:"",label:"",inputForm:"",divContainer:""}, 
				
				{sugerencia:"",label:"Autorización MTC",inputForm:"",divContainer:"eviTransportistaResiduoC"},
				{sugerencia:"",label:"Código",inputForm:"<input class='form-control' id='inputCodigoTransportistaC'>"}, 
				{sugerencia:"",label:"Fecha de vencimiento",inputForm:"<input type='date' class='form-control' id='inputDateTransportistaC'>"}, 
				{sugerencia:"",label:"",inputForm:"",divContainer:""}, 
				
				{sugerencia:"",label:"Costo Por Kg Peligroso",inputForm:"<input class='form-control' id='inputCantPeligroTransportista'>"}, 
				{sugerencia:"",label:"Costo Por Kg No Peligroso",inputForm:"<input class='form-control' id='inputCantNoPeligroTransportista'>"}, 
				{sugerencia:"",label:"Costo Por Viaje",inputForm:"<input class='form-control' id='inputCostoViajeTransportista'>"}, 
				
				
       			 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
             		];
			var textFormExamen="";
			listItemsExam.forEach(function(val,index){
				textFormExamen+=obtenerSubPanelModulo(val);
			});  
			
			var listItemsVehi=[
			{sugerencia:"",label:"Tipo de almacenamiento",inputForm:"<input class='form-control' id='inputTipAlmVehiculo'>"},
			{sugerencia:"",label:"Capacidad de almacimiento",inputForm:"<input type='number' class='form-control' id='inputCapacidadVehiculo'>"},
			{sugerencia:"",label:"Volumen promedio transportado por mes",inputForm:"<input type='number' class='form-control' id='inputVolTransVehiculo'>"},
			{sugerencia:"",label:"Frecuencia viajes por día",inputForm:"<input type='number' class='form-control' id='inputFrecuenciaVehiculo'>"},
			{sugerencia:"",label:"Volumen carga por viaje (TM)",inputForm:"<input type='number' class='form-control' id='inputVolCargaVehiculo'>"},
			{sugerencia:"",label:"Propiedad",inputForm:"<input class='form-control' id='inputPropVehiculo'>"},
			{sugerencia:"",label:"Tipo de vehículo",inputForm:"<input class='form-control' id='inputTipoVehiculo'>"},
			{sugerencia:"",label:"N° placa",inputForm:"<input class='form-control' id='inputPlacaVehiculo'>"},
			{sugerencia:"",label:"Capacidad promedio (TM)",inputForm:"<input type='number' class='form-control' id='inputCapPromVehiculo'>"},
			{sugerencia:"",label:"Año de fabricación",inputForm:"<input class='form-control' id='inputAnioVehiculo'>"},
			{sugerencia:"",label:"Color",inputForm:"<input class='form-control' id='inputColorVehiculo'>"},
			{sugerencia:"",label:"N° de ejes",inputForm:"<input type='number' class='form-control' id='inputNumEjesVehiculo'>"},
			{sugerencia:"",label:"¿Es habitual?",inputForm:"<input type='checkbox' class='form-control' id='checkHabitualVehiculo'>"},
			{sugerencia:"",label:"¿Es eventual?",inputForm:"<input type='checkbox' class='form-control' id='checkEventualVehiculo'>"},
			 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
			                		];
			var textFormVehi="";
			listItemsVehi.forEach(function(val,index){
				textFormVehi+=obtenerSubPanelModulo(val);
			}); 
			listPanelesPrincipal.push(
					{id:"nuevoMovilTransportista" ,clase:"",
							nombre:""+"Nueva Transportista",
							contenido:"<form id='formNuevoTransportista' class='eventoGeneral'>"+textFormExamen+"</form>"},
					{id:"editarMovilTransportista" ,clase:"contenidoFormVisible",
						nombre:""+"Editar Transportista",
						contenido:"<form id='formEditarTransportista' class='eventoGeneral'>"+textFormExamen+"</form>"},
						{id:"editarMovilVehiculoTransportista" ,clase:"contenidoFormVisible",
							nombre:""+"Editar Vehiculo",
							contenido:"<form id='formEditarVehiculoTransportista' class='eventoGeneral'>"+textFormVehi+"</form>"},
						 
						
					{id:"locatarioResiduo",clase:"divTransportistaResiduoGeneral",
							nombre:"Generación y Segregación de Residuos"+" (" +listFullTransportistasResiduo.length+")",
							contenido:textIn}    
						
			
			);
			
			agregarPanelesDivPrincipal(listPanelesPrincipal);
			 $("#nuevoMovilTransportista").find(".contenidoSubList").hide();
			var optionsA=
			{container:"#eviTransportistaResiduoA",
					functionCall:function(){},
					descargaUrl: "",
					esNuevo:true,
					idAux:"TransportistaA"+objTransportistaResiduo.id,
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(optionsA);
			var optionsB=
			{container:"#eviTransportistaResiduoB",
					functionCall:function(){},
					descargaUrl: "",
					esNuevo:true,
					idAux:"TransportistaB"+objTransportistaResiduo.id,
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(optionsB);
			var optionsC=
			{container:"#eviTransportistaResiduoC",
					functionCall:function(){},
					descargaUrl: "",
					esNuevo:true,
					idAux:"TransportistaC"+objTransportistaResiduo.id,
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(optionsC);
			$(".listaGestionGosst").hide();
			$(".contenidoFormVisible").hide();
			
			 $('#formNuevoTransportista').on('submit', function(e) {  
			        e.preventDefault();
			        objTransportistaResiduo={id:0}
			        guardarTransportistaResiduo();
			 });
			 $('#formEditarTransportista').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarTransportistaResiduo();
			 });
			 $('#formEditarVehiculoTransportista').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarVehiculoTransportista();
			 });
			 
			break;
			default:
				alert("nop");
				break;
		}
	})
} 
function editarTransportistaResiduo(){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilTransportista");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar Transportista");
	
	editarDiv.find("#selTipoTransportista").val(objTransportistaResiduo.tipo.id);
	editarDiv.find("#inputRucTransportista").val(objTransportistaResiduo.ruc);
	editarDiv.find("#inputNombreTransportista").val(objTransportistaResiduo.nombre);
	
	
	editarDiv.find("#inputCodigoTransportistaA").val(objTransportistaResiduo.permisoA.codigo);
	editarDiv.find("#inputDateTransportistaA").val(convertirFechaInput(objTransportistaResiduo.permisoA.fecha));
	
	editarDiv.find("#inputCodigoTransportistaB").val(objTransportistaResiduo.permisoB.codigo);
	editarDiv.find("#inputDateTransportistaB").val(convertirFechaInput(objTransportistaResiduo.permisoB.fecha));
	
	editarDiv.find("#inputCodigoTransportistaC").val(objTransportistaResiduo.permisoC.codigo);
	editarDiv.find("#inputDateTransportistaC").val(convertirFechaInput(objTransportistaResiduo.permisoC.fecha));
	
	editarDiv.find("#inputCantPeligroTransportista").val(objTransportistaResiduo.cantidadPeligrosa);
	editarDiv.find("#inputCantNoPeligroTransportista").val(objTransportistaResiduo.cantidadNoPeligrosa);
	editarDiv.find("#inputCostoViajeTransportista").val(objTransportistaResiduo.costoViaje);
	
	var optionsA=
	{container:"#editarMovilTransportista #eviTransportistaResiduoA",
			functionCall:function(){},
			descargaUrl: "/residuo/transportista/evidencia?id="+ objTransportistaResiduo.id+"&tipoId=1",
			esNuevo:false,
			idAux:"TransportistaA"+objTransportistaResiduo.id,
			evidenciaNombre:objTransportistaResiduo.permisoA.nombre};
	crearFormEvidenciaCompleta(optionsA);
	var optionsB=
	{container:"#editarMovilTransportista #eviTransportistaResiduoB",
			functionCall:function(){},
			descargaUrl: "/residuo/transportista/evidencia?id="+ objTransportistaResiduo.id+"&tipoId=2",
			esNuevo:false,
			idAux:"TransportistaB"+objTransportistaResiduo.id,
			evidenciaNombre:objTransportistaResiduo.permisoB.nombre};
	crearFormEvidenciaCompleta(optionsB);
	var optionsC=
	{container:"#editarMovilTransportista #eviTransportistaResiduoC",
			functionCall:function(){},
			descargaUrl: "/residuo/transportista/evidencia?id="+ objTransportistaResiduo.id+"&tipoId=3",
			esNuevo:false,
			idAux:"TransportistaC"+objTransportistaResiduo.id,
			evidenciaNombre:objTransportistaResiduo.permisoC.nombre};
	crearFormEvidenciaCompleta(optionsC);
	
}
function eliminarTransportistaResiduo(){
	var r = confirm("¿Está seguro de eliminar el registro ?");
	if (r == true) {
		var dataParam = {
				id : objTransportistaResiduo.id,
		};
		callAjaxPost(URL + '/residuo/transportista/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						habilitarTransportistasResiduo();
						break;
					default:
						alert("No se puede eliminar, hay vehiculos/salidas asociados.");
					}
				});
	}
}
function guardarTransportistaResiduo(){
	var formDiv=$("#editarMovilTransportista");
	if(objTransportistaResiduo.id==0){
		formDiv=$("#nuevoMovilTransportista");
	}
	var campoVacio = true;
	var tipo=formDiv.find("#selTipoTransportista").val();  
	var ruc=formDiv.find("#inputRucTransportista").val();
 var nombre=formDiv.find("#inputNombreTransportista").val();
var fechaA=convertirFechaTexto(formDiv.find("#inputDateTransportistaA").val());
var fechaB=convertirFechaTexto(formDiv.find("#inputDateTransportistaB").val());
var fechaC=convertirFechaTexto(formDiv.find("#inputDateTransportistaC").val());
var codigoA=formDiv.find("#inputCodigoTransportistaA").val();
var codigoB=formDiv.find("#inputCodigoTransportistaB").val();
var codigoC=formDiv.find("#inputCodigoTransportistaC").val();
var cantidadPeligrosa=formDiv.find("#inputCantPeligroTransportista").val();
var cantidadNoPeligrosa=formDiv.find("#inputCantNoPeligroTransportista").val();
var costoViaje=formDiv.find("#inputCostoViajeTransportista").val();
	
	
		if (campoVacio) {

			var dataParam = {
					id : objTransportistaResiduo.id,  
					tipo:{id:tipo},
					ruc:ruc,
					nombre:nombre,
					permisoA:{fecha:fechaA,codigo:codigoA},
					permisoB:{fecha:fechaB,codigo:codigoB},
					permisoC:{fecha:fechaC,codigo:codigoC},costoViaje:costoViaje,
					cantidadPeligrosa:cantidadPeligrosa,
					cantidadNoPeligrosa:cantidadNoPeligrosa,
					empresa :{empresaId :getSession("gestopcompanyid")}
			}

			callAjaxPost(URL + '/residuo/transportista/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":  
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviTransportistaA"+objTransportistaResiduo.id
									,bitsTransportsita,"/residuo/transportista/evidencia/save",preCargarTransportistas,1);
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviTransportistaB"+objTransportistaResiduo.id
									,bitsTransportsita,"/residuo/transportista/evidencia/save",preCargarTransportistas,2);
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviTransportistaC"+objTransportistaResiduo.id
									,bitsTransportsita,"/residuo/transportista/evidencia/save",preCargarTransportistas,3);
						
							break;
						default:
							console.log("Ocurrió un error al guardar   !");
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
		habilitarTransportistasResiduo();
		numEvidenciasGuardadasTransportistas=0;
	};
}