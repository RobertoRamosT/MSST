/**
 * 
 */

var objSalidaResiduo={};
var listFullSalidasResiduo;
var listClasificacionSalidaResiduo;
var listTipoResiduoDetalleSalida;
var listTipoPagoSalidaResiduo;
var listEtapaPagoSalidaResiduo;
var listTransportistasSalidaResiduo;
function toggleMenuOpcionSalida(obj,pindex){
	objSalidaResiduo=listFullSalidasResiduo[pindex];
	objSalidaResiduo.index=pindex;
	$(obj).parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent(".eventoGeneral").siblings().find("ul").hide(); 	
}
var funcionalidadesSalida=[ 
{id:"opcDescarga",nombre:"Descargar Generación manifiesto ",functionClick:function(data){
	window.open(URL+"/residuo/transportista/manifiesto/evidencia?id="+objSalidaResiduo.id+"&tipoId=1",'_blank')
	}  },
{id:"opcDescarga2",nombre:"Descargar Guía de Remisión ",functionClick:function(data){
window.open(URL+"/residuo/transportista/manifiesto/evidencia?id="+objSalidaResiduo.id+"&tipoId=2",'_blank')
}  },
{id:"opcDescarga3",nombre:"Descargar Evidencia Manifiesto ",functionClick:function(data){
window.open(URL+"/residuo/transportista/manifiesto/evidencia?id="+objSalidaResiduo.id+"&tipoId=3",'_blank')
}  },
{id:"opcDescarga4",nombre:"Descargar Constancia Salida ",functionClick:function(data){
window.open(URL+"/residuo/transportista/manifiesto/evidencia?id="+objSalidaResiduo.id+"&tipoId=4",'_blank')
}  },
	{id:"opcNuevoDetalle",nombre:"Nuevo Detalle",functionClick:function(data){nuevoDetalleSalida()} } , 
    {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarSalidaResiduo()}  },
   {id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarSalidaResiduo()}  
   
    
    }
                           ]
function marcarSubOpcionSalida(pindex){
	funcionalidadesSalida[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".listaGestionGosst").hide();
}
function habilitarSalidasResiduo(){
	var dataParam={
			empresaId:getSession("gestopcompanyid")
			};
	objSalidaResiduo={id:0};
	var listPanelesPrincipal=[];
	
	callAjaxPost(URL + '/residuo/manifiestos', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			
			var textIn= "";
			listFullSalidasResiduo=data.list;
			$(".divListPrincipal").html("");
			listFullSalidasResiduo.forEach(function(val,index){
				var menuOpcion="<ul class='list-group listaGestionGosst' >";
				funcionalidadesSalida.forEach(function(val1,index1){
					menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionSalida("+index1+")'>"+val1.nombre+" </li>"
				});
				menuOpcion+="</ul>";
				var estiloGosst="gosst-neutral";
				 
				textIn+=("<div class='eventoGeneral "+estiloGosst+"'>" +
						"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionSalida(this,"+index+")'>" +
						"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
						menuOpcion+ 
						"<strong>"+val.fechaSalidaTexto +"</strong><br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Transportista: " +val.transportista.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Responsable Interno: " +val.responsable.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Clasificación: " +val.clasificacion.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Observaciones: " +val.observacion+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Tipo de Pago: " +val.tipo.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Costo: " +val.costo+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Tipo de salida: " +val.etapa.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Destino: " +val.destino+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Evidencia Generación manifiesto: " +val.permisoA.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Evidencia Guía de remisión: " +val.permisoB.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Fecha Devolución de manifiesto: " +val.fechaDevolucionTexto+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Evidencia Devolución de manifiesto: " +val.permisoC.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Evidencia Constancia Salida: " +val.permisoD.nombre+"<br>"+
						

						 

						"<a onclick='verDetallesSalidaResiduo("+index+")'><i class='fa fa-info' aria-hidden='true'></i>Cantidad de residuos: " +val.indicadorResiduos+"</a><br>"+
						 "</div>"+
						 "<div class='divDetalleSalida divRelacionado' id='divResSal"+val.id+"'>" +
						"" +
						"</div>"
						
				
				);
				 
				
			});
			listClasificacionSalidaResiduo=data.clasificacion;
			 listTipoPagoSalidaResiduo=data.pago;
			 listEtapaPagoSalidaResiduo=data.etapa;
			 listTransportistasSalidaResiduo=data.transportistas;
			 var selClasManifiesto=crearSelectOneMenuOblig("selClasManifiesto", "",
					 listClasificacionSalidaResiduo, "", "id", "nombre");
				var selPagoManifiesto=crearSelectOneMenuOblig("selPagoManifiesto", "",
						listTipoPagoSalidaResiduo, "", "id", "nombre");
				var selEtapaManifiesto=crearSelectOneMenuOblig("selEtapaManifiesto", "",
						listEtapaPagoSalidaResiduo, "", "id", "nombre");
				var selTransportistaManifiesto=crearSelectOneMenuOblig("selTransportistaManifiesto", "",
						listTransportistasSalidaResiduo, "", "id", "nombre");
			var listItemsExam=[
				{sugerencia:"",label:"Transportista",inputForm:selTransportistaManifiesto,divContainer:""},
				{sugerencia:"",label:"Fecha",inputForm:"<input type='date' class='form-control' id='inputDateSalidaManifiesto'>"},
				{sugerencia:"",label:"Responsable Interno",inputForm:"<input class='form-control' id='inputRespManifiesto'>"}, 
				{sugerencia:"",label:"Clasificación",inputForm:selClasManifiesto,divContainer:""},
				{sugerencia:"",label:"Observaciones",inputForm:"<input class='form-control' id='inputObserManifiesto'>"}, 
				{sugerencia:"",label:"Tipo de Pago",inputForm:selPagoManifiesto,divContainer:""},
				{sugerencia:"",label:"Costo S/",inputForm:"<input type='number' class='form-control' id='inputCostoManifiesto'>"}, 
				{sugerencia:"",label:"Tipo de salida",inputForm:selEtapaManifiesto,divContainer:""},
				{sugerencia:"",label:"Destino",inputForm:"<input class='form-control' id='inputDestinoManifiesto'>"}, 
				
       			 {sugerencia:"",label:"Evidencia generación manifiesto (sólo para residuos peligrosos)",inputForm:"",divContainer:"eviSalidaResiduoA"},
       			{sugerencia:"",label:"Evidencia Guía de remisión (sólo para residuos peligrosos)",inputForm:"",divContainer:"eviSalidaResiduoB"},
       			{sugerencia:"",label:"Fecha devolución de manifiesto",inputForm:"<input type='date' class='form-control' id='inputDateDevolManifiesto'>"},
				{sugerencia:"",label:"Evidencia devolución de manifiesto por el transportista (sólo para residuos peligrosos)",inputForm:"",divContainer:"eviSalidaResiduoC"},
       			{sugerencia:"",label:"Evidencia Constancia Salida (sólo para residuos NO peligrosos)",inputForm:"",divContainer:"eviSalidaResiduoD"},
      			  {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
             		];
			var textFormExamen="";
			listItemsExam.forEach(function(val,index){
				textFormExamen+=obtenerSubPanelModulo(val);
			});
			listTipoResiduoDetalleSalida=data.tipo_detalle;
			var slcTipoDetalleCambio=crearSelectOneMenuOblig("slcTipoDetalleCambio", "", data.tipo_detalle, 
					 "", "id","nombre");
					   			
			 var listItemsDeta=[
			             		{sugerencia:"",label:"Residuo",inputForm:  slcTipoDetalleCambio,divContainer:"divTipoDetalleSalida"},
			             		{sugerencia:"",label:"Cantidad (kg)",inputForm:"<input type='number'  class='form-control' id='inputCantidadDetalleSalida'>"},
			             		{sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"},
			                    {sugerencia:"",label:"",inputForm:"<button type='button' id='btnGuardarAgregarDetSalida' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar y agregar otro</button>"} 
                         		 
			                         		];
 			   			var textFormDeta="";
 			   		listItemsDeta.forEach(function(val,index){
 			   		textFormDeta+=obtenerSubPanelModulo(val);
 			   			});
			
			
			
			
			listPanelesPrincipal.push(
					{id:"nuevoMovilSalida" ,clase:"",
							nombre:""+"Nueva Salida",
							contenido:"<form id='formNuevoSalida' class='eventoGeneral'>"+textFormExamen+"</form>"},
					{id:"editarMovilSalida" ,clase:"contenidoFormVisible",
						nombre:""+"Editar Salida",
						contenido:"<form id='formEditarSalida' class='eventoGeneral'>"+textFormExamen+"</form>"},
						{id:"editarMovilDetalleSalida" ,clase:"contenidoFormVisible",
							nombre:""+"Editar Detalle",
							contenido:"<form id='formEditarDetalleSalida' class='eventoGeneral'>"+textFormDeta+"</form>"},
							
						
					{id:"locatarioResiduo",clase:"divSalidaResiduoGeneral",
							nombre:"Registro de Salidas de Residuos"+" (" +listFullSalidasResiduo.length+")",
							contenido:textIn}    
						
			
			);
			
			agregarPanelesDivPrincipal(listPanelesPrincipal);
			$("#nuevoMovilSalida").find(".contenidoSubList").hide();
			var optionsA=
			{container:"#eviSalidaResiduoA",
					functionCall:function(){},
					descargaUrl: "",
					esNuevo:true,
					idAux:"ManifiestoA"+0,
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(optionsA);
			var optionsB=
			{container:"#eviSalidaResiduoB",
					functionCall:function(){},
					descargaUrl: "",
					esNuevo:true,
					idAux:"ManifiestoB"+0,
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(optionsB);
			var optionsC=
			{container:"#eviSalidaResiduoC",
					functionCall:function(){},
					descargaUrl: "",
					esNuevo:true,
					idAux:"ManifiestoC"+0,
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(optionsC);
			var optionsD=
			{container:"#eviSalidaResiduoD",
					functionCall:function(){},
					descargaUrl: "",
					esNuevo:true,
					idAux:"ManifiestoD"+0,
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(optionsD);
			
			$(".listaGestionGosst").hide();
			$(".contenidoFormVisible").hide();
			 $('#formNuevoSalida').on('submit', function(e) {  
			        e.preventDefault();
			        objSalidaResiduo={id:0}
			        guardarSalidaResiduo();
			 });
			 $('#formEditarSalida').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarSalidaResiduo();
			 });
			 $('#formEditarDetalleSalida').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarDetalleSalida();
			 });
			 $('#btnGuardarAgregarDetSalida').on('click', function(e) {
			        guardarDetalleSalida(nuevoDetalleSalida);
			 });
			break;
			default:
				alert("nop");
				break;
		}
	})
} 
function editarSalidaResiduo(){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilSalida");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar Salida");
	
	editarDiv.find("#selTransportistaManifiesto").val(objSalidaResiduo.transportista.id);
	editarDiv.find("#inputDateSalidaManifiesto").val(convertirFechaInput(objSalidaResiduo.fechaSalida));
	editarDiv.find("#inputRespManifiesto").val(objSalidaResiduo.responsable.nombre);
	editarDiv.find("#selClasManifiesto").val(objSalidaResiduo.clasificacion.id);
	editarDiv.find("#inputObserManifiesto").val(objSalidaResiduo.observacion);
	editarDiv.find("#selPagoManifiesto").val(objSalidaResiduo.tipo.id);
	editarDiv.find("#selEtapaManifiesto").val(objSalidaResiduo.etapa.id);
	editarDiv.find("#inputDestinoManifiesto").val(objSalidaResiduo.destino);
	editarDiv.find("#inputDateDevolManifiesto").val(convertirFechaInput(objSalidaResiduo.fechaDevolucion));

	//
	var optionsA=
	{container:"#editarMovilSalida #eviSalidaResiduoA",
			functionCall:function(){ },
			descargaUrl: "/residuo/transportista/manifiesto/evidencia?id="+ objSalidaResiduo.id+"&tipoId=1",
			esNuevo:false,
			idAux:"ManifiestoA"+objSalidaResiduo.id,
			evidenciaNombre:objSalidaResiduo.permisoA.nombre};
	crearFormEvidenciaCompleta(optionsA);
	//
	var optionsB=
	{container:"#editarMovilSalida #eviSalidaResiduoB",
			functionCall:function(){ },
			descargaUrl: "/residuo/transportista/manifiesto/evidencia?id="+ objSalidaResiduo.id+"&tipoId=2",
			esNuevo:false,
			idAux:"ManifiestoB"+objSalidaResiduo.id,
			evidenciaNombre:objSalidaResiduo.permisoB.nombre};
	crearFormEvidenciaCompleta(optionsB);//
	var optionsC=
	{container:"#editarMovilSalida #eviSalidaResiduoC",
			functionCall:function(){ },
			descargaUrl: "/residuo/transportista/manifiesto/evidencia?id="+ objSalidaResiduo.id+"&tipoId=3",
			esNuevo:false,
			idAux:"ManifiestoC"+objSalidaResiduo.id,
			evidenciaNombre:objSalidaResiduo.permisoC.nombre};
	crearFormEvidenciaCompleta(optionsC);//
	var optionsD=
	{container:"#editarMovilSalida #eviSalidaResiduoD",
			functionCall:function(){ },
			descargaUrl: "/residuo/transportista/manifiesto/evidencia?id="+ objSalidaResiduo.id+"&tipoId=4",
			esNuevo:false,
			idAux:"ManifiestoD"+objSalidaResiduo.id,
			evidenciaNombre:objSalidaResiduo.permisoD.nombre};
	crearFormEvidenciaCompleta(optionsD);

	
}
function eliminarSalidaResiduo(){
	var r = confirm("¿Está seguro de eliminar el registro ?");
	if (r == true) {
		var dataParam = {
				id : objSalidaResiduo.id,
		};
		callAjaxPost(URL + '/residuo/transportista/manifiesto/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						habilitarSalidasResiduo();
						break;
					default:
						alert("No se puede eliminar, hay alquileres/actividades asociados.");
					}
				});
	}
}
function guardarSalidaResiduo(){
	var formDiv=$("#editarMovilSalida");
	if(objSalidaResiduo.id==0){
		formDiv=$("#nuevoMovilSalida");
	}
	var campoVacio = true;
	var clas=formDiv.find("#selClasManifiesto").val();
	var pago=formDiv.find("#selPagoManifiesto").val();
	var etapa=formDiv.find("#selEtapaManifiesto").val();
	var destino=formDiv.find("#inputDestinoManifiesto").val();
var fechaSalida=convertirFechaTexto(formDiv.find("#inputDateSalidaManifiesto").val()); 
var fechaDevolucion=convertirFechaTexto(formDiv.find("#inputDateDevolManifiesto").val()); 
var responsable=formDiv.find("#inputRespManifiesto").val();
var costo=formDiv.find("#inputCostoManifiesto").val();

var observacion=formDiv.find("#inputObserManifiesto").val();
var transportistaId=formDiv.find("#selTransportistaManifiesto").val();
	
	
		if (campoVacio) {

			var dataParam = {
					id : objSalidaResiduo.id,  
					observacion:observacion,
					fechaSalida:fechaSalida,
					fechaDevolucion:fechaDevolucion,
					clasificacion:{id:clas},  
					etapa:{id:etapa},destino:destino,
					costo:costo,
					tipo:{id:pago},
					responsable:{nombre:responsable}, 
					transportista :{id :transportistaId}
			}

			callAjaxPost(URL + '/residuo/transportista/manifiesto/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":  
							
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviManifiestoA"+objSalidaResiduo.id
									,bitsTransportsita,"/residuo/transportista/manifiesto/evidencia/save",preCargarManifiestos,1);
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviManifiestoB"+objSalidaResiduo.id
									,bitsTransportsita,"/residuo/transportista/manifiesto/evidencia/save",preCargarManifiestos,2);
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviManifiestoC"+objSalidaResiduo.id
									,bitsTransportsita,"/residuo/transportista/manifiesto/evidencia/save",preCargarManifiestos,3);	 
							guardarEvidenciaMultipleAuto(data.nuevoId,"fileEviManifiestoD"+objSalidaResiduo.id
									,bitsTransportsita,"/residuo/transportista/manifiesto/evidencia/save",preCargarManifiestos,4);	 
						
							break;
						default:
							console.log("Ocurrió un error al guardar   !");
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
		habilitarSalidasResiduo();
		numEvidenciasGuardadasManifiestos=0;
	};
}