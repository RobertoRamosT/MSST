var banderaEdicion;
var equipoSeguridadId;
var equipoSeguridadTipo;
var frecuenciaRenovacionId;
var fechaActual;
var fechaProx;
var listEquSegTipo;
var contador2 = 0;
var listMotivos;
var listFullEquipos;
var equipEstado;
var equipEstadoNombre;
var unidadesBuscar;
var listFrecRenovacion = [ {
	"freRenId" : 1,
	"nombre" : "1 vez al mes"
}, {
	"freRenId" : 2,
	"nombre" : "1 vez cada 3 meses"
}
, {
	"freRenId" : 3,
	"nombre" : "1 cada 6 meses"
},
{
	"freRenId" : 4,
	"nombre" : "1 vez cada año"
}, {
	"freRenId" : 5,
	"nombre" : "1 vez cada 2 años"
}
, {
	"freRenId" : 6,
	"nombre" : "Indeterminado"
}
];

$(document).ready(function() {
	$("#btnSmartEntrega").hide();
	$("#btnSmartProg").on("click",function(){
		listTrabajadoresPlanisSelecccionados=asigAux.filter(function(age){
			  return (vigAux.indexOf(age)==-1?true:false);
			});
	
	
		var r=true;
		r = confirm("Desea programar para mañana un evento de formación para "+
				listTrabajadoresPlanisSelecccionados.length+" trabajador(es)?");
		if (r) {
			var fechaManana=sumaFechaDias(1,obtenerFechaActual());
			var mes1 = fechaManana.substring(5, 7) - 1;
			var fechatemp1 = new Date(fechaManana.substring(0, 4), mes1, 
					fechaManana.substring(8, 10));

			var inputFecPla = fechatemp1;
			var dataParam = {
				programacionCapId : 0,
				fechaPlanificada : inputFecPla,
				fechaRealizada : null,
				inversionProgramacionCap:0,
				capacitacionId : capacitacionId,
				horaPlanificada:null,
				trabajadoresPlanificados: listTrabajadoresPlanisSelecccionados,
				progCapEstado:1,
				idCompany : sessionStorage.getItem("gestopcompanyid")
			};

			callAjaxPost(URL + '/capacitacion/programacion/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							alert("Evento Creado!")
							$("#modalFormacionTrabajadores").modal("hide");
							break;
						default:
							console.log("Ocurrió un error al guardar la programacion!");
						}
					},function(){ 
						$("#mensajeGuardando").remove();
						$("#tblTrabFormacion").before("<p id='mensajeGuardando'>Guardando...</p>")},null);
			
		
		
		} 
	})
	$("#btnClipTablaVigencia").on("click",function(){
		var texto=obtenerDatosTablaEstandarNoFija("tblVigenciaEpp");
	 copiarAlPortapapeles(texto,"btnClipTablaVigencia");
		alert("Se han guardado al clipboard la tabla " );

	
	});
	insertMenu();
	cargarPrimerEstado();

});

function cambiarFechaProx(){
	
}

function estadoFechaProx(equipoSeguridadId){
	var signo='---';

	if(parseInt($("#selEquSegTipo").val())==2){
		
			var fechaPlanificada=$("#inputFechaActual").val();
			var fechaReal=$("#inputFechaProx").val();
			var fechaHoy=obtenerFechaActual();
		
				
				if(fechaPlanificada!=""){
					var dif=restaFechas(fechaHoy,fechaReal)
					if(dif<0){
						equipEstado=3;
						equipEstadoNombre="<i style='color:red' class='fa fa-exclamation-circle'></i>";
					}else{
						equipEstado=2;
						equipEstadoNombre="<i style='color:green' class='fa fa-check-square'></i>";
					}
					
				}
			
			
			
			
		
	}else{
		
		equipEstado=null;
		equipEstadoNombre="---";
		
	}
	$("#tdestado"+equipoSeguridadId).html(equipEstadoNombre);
	
	
}

function cargarPrimerEstado() {
       var valorResize= 170;
       resizeDivWrapper("wrapper",valorResize);
  //   console.log("Con "+valorResize);
        
	banderaEdicion = false;
	equipoSeguridadId = 0;
	equipoSeguridadTipo = 0;
	frecuenciaRenovacionId = 0;
	fechaActual=null;
	fechaProx=null;
	listMotivos=[];unidadesBuscar=[];
	removerBotones();
	crearBotones();
	$("#fsBotones")
	.append(
			"<button id='btnProgFecha' type='button' class='btn btn-success' title='Programar Fecha'>"
					+ "<i class='fa fa-calendar fa-2x'></i>"
					+ "</button>");
	$("#fsBotones")
	.append(
			"<button id='btnClipTabla' type='button' class='btn btn-success' title='Tabla Clipboard' >"
					+ "<i class='fa fa-clipboard fa-2x'></i>" + "</button>");
	$("#fsBotones")
	.append(
			"<button id='btnCompra' type='button' class='btn btn-success' title='Adquisiciones/Mantenimiento' >"
					+ "<i class='fa fa-shopping-cart fa-2x'></i>" + "</button>");

    $("#fsBotones").append("<button id='btnStock' type='button' class='btn btn-success' title='Proyección de Stock'>" +
		                       "<i class='fa fa-line-chart fa-2x' aria-hidden='true'></i>" +
		                   "</button>");

	$("#fsBotones").append("<button id='btnListaConsolidadoExcelEquipoSeguridad' type='button' class='btn btn-excel' " +
		                           "title='Valores previos para seleccionar el excel a descargar.' onclick='verConsolidadosExcelEquipoSeguridad()'>" +
							   "<i class='fa fa-file-excel-o fa-2x'></i> <i class='fa fa-list'></i>" +
		                   "</button>");

	if(configGlobal.rutaFront == "/realplaza"){
	    $("#fsBotones").append("<button id='btnVerQuicksight' type='button' class='btn btn-info' style='margin-right:5px' onclick='verQuicksightOpcionesEquipoSeguridad()' title='Ver Quicksight.'>" +
						       	   "<i class='fa fa-table fa-2x'></i> "+"<i class='fa fa-pie-chart'></i>" +
		                   	   "</button>");
	}

	/* $("#fsBotones")
	      .append("<button id='btnConsolidadoInspeccHLCL' type='button' class='btn btn-success' title='Descargar consolidado de inspecciones (Unidades) - "
	      	                  +"Por medio de un formulario (el cual aparece al dar click a este botón), permite obtener un archivo excel del tipo de inspección "
	      	                  +"seleccionado (hallazgos libres o checklist) y el intervalo de tiempo requerido.'>"
	               + "<i class='fa fa-file-excel-o fa-2x'></i>  "
		    + "</button>");
	 
	 $("#btnConsolidadoInspeccHLCL").on("click",
		    function(){
		       
		       var hoy=obtenerFechaActual();
		            
		       var contenido ="";
			    
		       var listContenido = [];
			
		       var listContenido=[
			      
			      {sugerencia:"",label:"Desde",
			       inputForm:"<input type='date' id='fechaInicioConsolidado' class='form-control'>"},
			      {sugerencia:"",label:"Hasta",
			       inputForm:"<input type='date' id='fechaFinConsolidado' class='form-control'>"},
			      {sugerencia:"",label:"",inputForm:""}, 
			      {sugerencia:"",
			       label:"<button class='btn btn-danger' type='button' onclick='ocultarConsolidadoInspeccionesUnidades()'>" +
			       	        "<i class='fa fa-times'></i> Cancelar" +
			       	     "</button>",
			       inputForm:"<button class='btn btn-success' style='float:right;' type='button' onclick='descargarConsolidadoInspeccion()'>" +
			       		    "<i class='fa fa-download'></i> Descargar" +
			       		 "</button>"},
			            	 ];
			    
		       listContenido.forEach(function(val){
		          contenido +=obtenerSubPanelModuloGeneral(val);
		       });
			
		       var modalOptions={
			      id: "modalEleccionInspeccionDescargar",
			      nombre: "<i class='fa fa-graduation-cap'></i> Reporte de Equipos de Seguridad <br>",
			      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
			                };
			
		       crearModalPrincipalUsuario(modalOptions,function(){},false);
			 
		       $("#fechaInicioConsolidado").val(sumaFechaDias(-30,hoy));
		       $("#fechaFinConsolidado").val(sumaFechaDias(365,hoy));
			
		       insertMenu();
		       $("#modalEleccionInspeccionDescargar").modal("show"); 
			   
		     });
	 
	 */
	$("#btnClipTabla").on("click",function(){
		 var headTabla="Equipo de Seguridad \t" +
		 		"Tipo de Equipo de Seguridad \t" +
		 		"Proveedor \t" +
		 		"Especificaciones Técnicas \t" +
		 		"Costo Unitario \t" +
		 		"Frecuencia Renovación / Mantenimiento \t" +
		 		"Tallas	Trabajadores con EPP vigente \t" +
		 		"Entregas realizadas \t" +
		 		"Ubicacion \t " +
		 		"Estado\n";
			 var bodyTabla=obtenerDatosBodyTablaEstandar("tblEquSeg");
		copiarAlPortapapeles(headTabla+bodyTabla);
		
		
		alert("Se han guardado al clipboard la tabla de este módulo" );

	});
	$("#btnClipTablaProyeccion").on("click",function(){
		var datosTabla=obtenerDatosTablaEstandarNoFija("tblStock");
		copiarAlPortapapeles(datosTabla,"btnClipTablaProyeccion");
		alert("Se han guardado al clipboard la tabla" );

	});
	
$("#btnCompra")
.hide()
.on("click",function(){
	$("#mdProgCompra").modal({
		  keyboard: true,
		  show:true,"backdrop":"static"
		});
	cargarComprasEpp();
	
});

$("#btnStock")
.on("click",function(){
	$("#mdProgStock").modal("show");
	cargarStockEpp();
	generarTablaStock();
});
$("#mdProgStock input").on("change",function(){
	actualizarStockEpp();
});

	deshabilitarBotonesEdicion();
	$("#btnUpload").attr("onclick", "javascript:importarDatos();");

	$("#btnNuevo").attr("onclick", "javascript:nuevoEquipoSeguridad();");
	$("#btnCancelar").attr("onclick", "javascript:cancelarEquipoSeguridad();");
	$("#btnGuardar").attr("onclick", "javascript:guardarEquipoSeguridad();");
	$("#btnEliminar").attr("onclick", "javascript:eliminarEquipoSeguridad();");

	// $("#btnProgFecha").attr("onclick", "javascript:programarFecha();");
	$("#btnProgFecha").attr("onclick","crearFiltroProgEntregaEpp();");

	$("#btnImportar").attr("onclick", "javascript:importarDatos();");


	
	var dataParam = {
			idCompany : sessionStorage.getItem("gestopcompanyid")
	};

	 callAjaxPost(URL + '/equiposeguridad', dataParam,
	 procesarDataDescargadaPrimerEstado);
}

function cargarStockEpp(){

	var dataParam = {
			idCompany : sessionStorage.getItem("gestopcompanyid")
	};

	 callAjaxPost(URL + '/equiposeguridad/stock', dataParam,
	 procesarDataStock);
	 $("#graficoProyeccionStock").hide();
}
var eppCompras = [];
var eppEntregas=[];

function procesarDataStock(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		 eppCompras = data.eppCompras;
		 eppEntregas=data.eppEntregas;
		
		 actualizarStockEpp();
		break;
	default:
		alert("Ocurrió un error al traer los datos de stock!");
	}
}
var mes0Inversion=0;
var mes1Inversion=0;
var mes2Inversion=0;
var mes3Inversion=0;
var mes4Inversion=0;
var mes5Inversion=0;
var mes6Inversion=0;
var mes7Inversion=0;
var mes8Inversion=0;
var mes9Inversion=0;
var mes10Inversion=0;
var mes11Inversion=0;
var mes12Inversion=0;
function actualizarStockEpp(){
	$("#tblStock tbody tr").remove();
	var fechaAux=$("#fechaStock").val();
	var horaAux=$("#horaStock").val();
	var aFecha2 = fechaAux.split('-'); 
	var aHora2 = horaAux.split(':'); 
	var fechaFinalLimite = Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2],aHora2[0],aHora2[1]);
	 
	var rangoFechas=hallarFechasStock();
	
	var head="";
	$("#tblStock thead #headStock").remove();
	rangoFechas.forEach(function(val,ind){
		var fechaAux=val.split("-");
		var ultimoDia = new Date(fechaAux[0], fechaAux[1], 0);
		ultimoDia=convertirFechaNormal2(ultimoDia);
		fechaAux=ultimoDia.split("-");
		
if(ind==0){
	head+="<tr id='headStock'><td>"+fechaAux[1]+"-"+fechaAux[0]+"</td>"
}
if(ind!=rangoFechas.length && ind!=0){
	head+="<td>"+fechaAux[1]+"-"+fechaAux[0]+"</td>"
}
if(ind==rangoFechas.length){
	head+="<td>"+fechaAux[1]+"-"+fechaAux[0]+"</td></tr>"
}


	});
	
	$("#tblStock thead").append(head);
	 $("#tblStock thead tr td").addClass("tb-acc");
	 
	  mes0Inversion=0;
	 mes1Inversion=0;
	 mes2Inversion=0;
	 mes3Inversion=0;
	 mes4Inversion=0;
	 mes5Inversion=0;
	 mes6Inversion=0;
	 mes7Inversion=0;
	 mes8Inversion=0;
	 mes9Inversion=0;
	 mes10Inversion=0;
	 mes11Inversion=0;
	 mes12Inversion=0;
	 console.log(eppCompras);
	 var listIdCompras=[];
	eppCompras.forEach(function(val,index){
		
		var textoSubTallas="";
		val.tallas.forEach(function(val1,index1){
			val1.mes0Compra=0;
			val1.mes0Entrega=0;
			val1.mes0Stock=0;
			
			val1.mes1Compra=0;
			val1.mes1Entrega=0;
			val1.mes1Stock=0;
			
			val1.mes2Compra=0;
			val1.mes2Entrega=0;
			val1.mes2Stock=0;
			
			val1.mes3Compra=0;
			val1.mes3Entrega=0;
			val1.mes3Stock=0;
			
			val1.mes4Compra=0;
			val1.mes4Entrega=0;
			val1.mes4Stock=0;
			
			val1.mes5Compra=0;
			val1.mes5Entrega=0;
			val1.mes5Stock=0;
			
			val1.mes6Compra=0;
			val1.mes6Entrega=0;
			val1.mes6Stock=0;
			
			val1.mes7Compra=0;
			val1.mes7Entrega=0;
			val1.mes7Stock=0;
			
			val1.mes8Compra=0;
			val1.mes8Entrega=0;
			val1.mes8Stock=0;
			
			val1.mes9Compra=0;
			val1.mes9Entrega=0;
			val1.mes9Stock=0;
			
			val1.mes10Compra=0;
			val1.mes10Entrega=0;
			val1.mes10Stock=0;
			
			val1.mes11Compra=0;
			val1.mes11Entrega=0;
			val1.mes11Stock=0;
			
			val1.mes12Compra=0;
			val1.mes12Entrega=0;
			val1.mes12Stock=0;
			
			
			
			eppEntregas.forEach(function(val2,index2){
				if(val2.equipoSeguridadId==val.equipoSeguridadId){
					val2.tallas.forEach(function(val3,index3){
						if(val3.id==val1.id){
							val1.entregas=val3.entregas;
						}
					});
				}
			});
				var totalComprado=0,totalEntregado=0,totalInvertido=0;
				
				if(val1.compras){
					val1.compras.forEach(function(val2,index2){
						if(index1>0){
							val2.inversion=0;
						}
						var condicionCompleto=false,condicionRetrasado=false,condicionImplementar=false;
						
						var aFecha2 = val2.fechaPlanificadaTexto.split('-'); 
						var hora2 = val2.horaPlanificada.split(':'); 
						var fechaPlanifcadaEvento=Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2],hora2[0],hora2[1]);
						var aFecha2 = val2.fechaRealTexto.split('-'); 
						var fechaRealEvento=Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2],hora2[0],hora2[1]);
						
						if($("#tipoEvento1").prop("checked")){
							condicionImplementar=(val2.estadoId==1 && fechaFinalLimite>=fechaPlanifcadaEvento);
						}
						if($("#tipoEvento2").prop("checked")){
							 condicionCompleto=(val2.estadoId==2 && fechaFinalLimite>=fechaRealEvento);
						}
						
						if($("#tipoEvento3").prop("checked")){
							condicionRetrasado=(val2.estadoId==3 && fechaFinalLimite>=fechaPlanifcadaEvento );
						}
						rangoFechas.forEach(function(val4,ind4){
							var fechaAux=val4.split("-");
							var ultimoDia = new Date(fechaAux[0], fechaAux[1], 0);
							var condicionImplementar=false;
							var condicionCompleto=false;
							var condicionRetrasado=false;
							var condicionRepetido=false;

							if($("#tipoEvento1").prop("checked")){
								 condicionImplementar=(val2.estadoId==1 && ultimoDia>=fechaPlanifcadaEvento);
							}
							if($("#tipoEvento2").prop("checked")){
								 condicionCompleto=(val2.estadoId==2 && ultimoDia>=fechaRealEvento);
							}
							
							if($("#tipoEvento3").prop("checked")){
								 condicionRetrasado=(val2.estadoId==3 && ultimoDia>=fechaPlanifcadaEvento );
							}
							if(listIdCompras.indexOf(val2.id)==-1){
								listIdCompras.push(val2.id);
							}
							if(condicionCompleto || condicionRetrasado || condicionImplementar){
								
								switch(ind4){
								case 0:
									val1.mes0Compra+=val2.cantidad;
									
										mes0Inversion+=val2.inversion;
									
									break;
								case 1:
									val1.mes1Compra+=val2.cantidad;
									mes1Inversion+=val2.inversion;
									break;
								case 2:
									val1.mes2Compra+=val2.cantidad;
									mes2Inversion+=val2.inversion;
									break;
								case 3:
									val1.mes3Compra+=val2.cantidad;
									mes3Inversion+=val2.inversion;
									break;
								case 4:
									val1.mes4Compra+=val2.cantidad;
									mes4Inversion+=val2.inversion;
									break;
								case 5:
									val1.mes5Compra+=val2.cantidad;
									mes5Inversion+=val2.inversion;
									break;
								case 6:
									val1.mes6Compra+=val2.cantidad;
									mes6Inversion+=val2.inversion;
									break;
								case 7:
									val1.mes7Compra+=val2.cantidad;
									mes7Inversion+=val2.inversion;
									break;
								case 8:
									val1.mes8Compra+=val2.cantidad;
									mes8Inversion+=val2.inversion;
									break;
								case 9:
									val1.mes9Compra+=val2.cantidad;
									mes9Inversion+=val2.inversion;
									break;
								case 10:
									val1.mes10Compra+=val2.cantidad;
									mes10Inversion+=val2.inversion;
									break;
								case 11:
									val1.mes11Compra+=val2.cantidad;
									mes11Inversion+=val2.inversion;
									break;
								case 12:
									val1.mes12Compra+=val2.cantidad;
									mes12Inversion+=val2.inversion;
									break;
								}
							}

						});
						
						
						if(condicionCompleto || condicionRetrasado || condicionImplementar){
							totalComprado+=val2.cantidad;
							totalInvertido+=val2.inversion;
						}
											
					});
				}
				
				if(val1.entregas){
					val1.entregas.forEach(function(val2,index2){
						var condicionCompleto=false,condicionRetrasado=false,condicionImplementar=false;
						
						var aFecha2 = val2.fechaPlanificadaTexto.split('-'); 
						var hora2 = val2.horaPlanificada.split(':'); 
						var fechaPlanifcadaEvento=Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2],hora2[0],hora2[1]);
						var aFecha2 = val2.fechaEntregaTexto.split('-'); 
						var fechaRealEvento=Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2],hora2[0],hora2[1]);
						
						if($("#tipoEvento1").prop("checked")){
							condicionImplementar=(val2.estadoImplementacion==1 && fechaFinalLimite>=fechaPlanifcadaEvento);
							
						}
						if($("#tipoEvento2").prop("checked")){
							 condicionCompleto=(val2.estadoImplementacion==2 && fechaFinalLimite>=fechaRealEvento);
						}
						
						if($("#tipoEvento3").prop("checked")){
							condicionRetrasado=(val2.estadoImplementacion==3 && fechaFinalLimite>=fechaPlanifcadaEvento );
						}
						
						rangoFechas.forEach(function(val4,ind4){
							var fechaAux=val4.split("-");
							var ultimoDia = new Date(fechaAux[0], fechaAux[1], 0);
							var condicionImplementar=false;
							var condicionCompleto=false;
							var condicionRetrasado=false;
							
							
							if($("#tipoEvento1").prop("checked")){
								condicionImplementar=(val2.estadoImplementacion==1 && ultimoDia>=fechaPlanifcadaEvento);
							}
							if($("#tipoEvento2").prop("checked")){
								condicionCompleto=(val2.estadoImplementacion==2 && ultimoDia>=fechaRealEvento);
							}
							
							if($("#tipoEvento3").prop("checked")){
								condicionRetrasado=(val2.estadoImplementacion==3 && ultimoDia>=fechaPlanifcadaEvento );
							}
							
							if(condicionCompleto || condicionRetrasado || condicionImplementar){
								
								switch(ind4){
								case 0:
									val1.mes0Entrega+=val2.numeroTrabajadores;
									break;
								case 1:
									val1.mes1Entrega+=val2.numeroTrabajadores;
									break;
								case 2:
									val1.mes2Entrega+=val2.numeroTrabajadores;
									break;
								case 3:
									val1.mes3Entrega+=val2.numeroTrabajadores;
									break;
								case 4:
									val1.mes4Entrega+=val2.numeroTrabajadores;
									break;
								case 5:
									val1.mes5Entrega+=val2.numeroTrabajadores;
									break;
								case 6:
									val1.mes6Entrega+=val2.numeroTrabajadores;
									break;
								case 7:
									val1.mes7Entrega+=val2.numeroTrabajadores;
									break;
								case 8:
									val1.mes8Entrega+=val2.numeroTrabajadores;
									break;
								case 9:
									val1.mes9Entrega+=val2.numeroTrabajadores;
									break;
								case 10:
									val1.mes10Entrega+=val2.numeroTrabajadores;
									break;
								case 11:
									val1.mes11Entrega+=val2.numeroTrabajadores;
									break;
								case 12:
									val1.mes12Entrega+=val2.numeroTrabajadores;
									break;
								}
							}

						});
						
						
						if(condicionCompleto || condicionRetrasado || condicionImplementar){
							totalEntregado+=val2.numeroTrabajadores
						}
					});	
				}
				
				val1.mes0Stock=val1.mes0Compra-val1.mes0Entrega;
				val1.mes1Stock=val1.mes1Compra-val1.mes1Entrega;
				val1.mes2Stock=val1.mes2Compra-val1.mes2Entrega;
				val1.mes3Stock=val1.mes3Compra-val1.mes3Entrega;
				val1.mes4Stock=val1.mes4Compra-val1.mes4Entrega;
				val1.mes5Stock=val1.mes5Compra-val1.mes5Entrega;
				val1.mes6Stock=val1.mes6Compra-val1.mes6Entrega;
				val1.mes7Stock=val1.mes7Compra-val1.mes7Entrega;
				val1.mes8Stock=val1.mes8Compra-val1.mes8Entrega;
				val1.mes9Stock=val1.mes9Compra-val1.mes9Entrega;
				val1.mes10Stock=val1.mes10Compra-val1.mes10Entrega;
				val1.mes11Stock=val1.mes11Compra-val1.mes11Entrega;
				val1.mes12Stock=val1.mes12Compra-val1.mes12Entrega;
				textoSubTallas="<tr id='hu"+index1+"'>" +
						"<td>"+val.equipoSeguridadNombre+"</td>" +
						"<td>"+val1.nombre+"</td>" +
						"<td>"+totalComprado+"</td>"+
						"<td>"+totalEntregado+"</td>"+
						"<td>"+(totalComprado-totalEntregado)+"</td>"+
						"<td>"+val1.mes0Stock+"</td>" +
						"<td>"+val1.mes1Stock+"</td>" +
						"<td>"+val1.mes2Stock+"</td>" +
						"<td>"+val1.mes3Stock+"</td>" +
						"<td>"+val1.mes4Stock+"</td>" +
						"<td>"+val1.mes5Stock+"</td>" +
						"<td>"+val1.mes6Stock+"</td>" +
						"<td>"+val1.mes7Stock+"</td>" +
						"<td>"+val1.mes8Stock+"</td>" +
						"<td>"+val1.mes9Stock+"</td>" +
						"<td>"+val1.mes10Stock+"</td>" +
						"<td>"+val1.mes11Stock+"</td>" +
						"<td>"+val1.mes12Stock+"</td>" +
						
								"</tr>";

				$("#tblStock tbody").append(textoSubTallas);
				if(index1==val.tallas.length-1
						&&(eppCompras.length-1==index)){
					
					var textoSubTallas="<tr >" +
					"<td>"+""+"</td>" +
					"<td>"+""+"</td>" +
					"<td>"+""+"</td>"+
					"<td>"+"Inversión"+"</td>"+
					"<td>"+totalInvertido+"</td>"+
					"<td>+"+(mes0Inversion-totalInvertido)+"</td>" +
					"<td>+"+(mes1Inversion-mes0Inversion)+"</td>" +
					"<td>+"+(mes2Inversion-mes1Inversion)+"</td>" +
					"<td>+"+(mes3Inversion-mes2Inversion)+"</td>" +
					"<td>+"+(mes4Inversion-mes3Inversion)+"</td>" +
					"<td>+"+(mes5Inversion-mes4Inversion)+"</td>" +
					"<td>+"+(mes6Inversion-mes5Inversion)+"</td>" +
					"<td>+"+(mes7Inversion-mes6Inversion)+"</td>" +
					"<td>+"+(mes8Inversion-mes7Inversion)+"</td>" +
					"<td>+"+(mes9Inversion-mes8Inversion)+"</td>" +
					"<td>+"+(mes10Inversion-mes9Inversion)+"</td>" +
					"<td>+"+(mes11Inversion-mes10Inversion)+"</td>" +
					"<td>+"+(mes12Inversion-mes11Inversion)+"</td>" +
					
							"</tr>";

					$("#tblStock tbody").append(textoSubTallas);
						
						
				}
		});
	
	});
	
	


	$("#tblStock tbody tr td").each(function(){
		if(parseInt($(this).text())<0){
			$(this).css({"color":"#B40404"})
		};
	
	});
	
	
	
	
}
function hallarFechasStock(){
	var fechaInicio=$("#fechaStock").val();
	var fechaFin=sumaFechaDias(365,fechaInicio);
	if(fechaFin=="NaN-NaN-NaN"){
$("#msgFecha").html("Fecha No válida")
	}else{
		$("#msgFecha").html("");
	}
	;
		var fecha1=fechaInicio.split('-');
		var fecha2=fechaFin.split('-');
		var difanio= fecha2[0]-fecha1[0]+1;
		var difDias=restaFechas(fechaInicio,fechaFin);
		var listfecha=[];
		
		
			
			for (var index =0; index <difanio; index++) {
				var anioaux=parseInt(index)+parseInt(fecha1[0]);
				
				if(difanio>1){
					if(index==0){
						for(var index1 =0; index1 < 12-fecha1[1]+1; index1++) {
							
							var mesaux=parseInt(index1)+parseInt(fecha1[1]);
							listfecha.push(anioaux+"-"+((''+mesaux).length<2 ? '0' : '') + mesaux );
							}
					}
					if(index==difanio-1){
						for(var index4=0;index4<parseInt(fecha2[1]);index4++){
							var mesaux3=parseInt(index4)+parseInt("1");
							listfecha.push(anioaux+"-"+((''+mesaux3).length<2 ? '0' : '') + mesaux3 );
						}
								}	
					
					if(index>0 && index <difanio-1 ){
							
							for(index3 =0;index3 <12;index3++){
								var mesaux2=parseInt(index3)+1;	
								listfecha.push(anioaux+"-"+((''+mesaux2).length<2 ? '0' : '') + mesaux2 );
							}
							
							
						}
						
				}else{
					for(var index5 =0; index5 < fecha2[1]-fecha1[1]+1; index5++) {
						
						var mesaux4=parseInt(index5)+parseInt(fecha1[1]);
						listfecha.push(anioaux+"-"+((''+mesaux4).length<2 ? '0' : '') + mesaux4 );
						}
					
				}
				
				

				
			};
		
		
		
		return listfecha;
		
	}
function generarTablaStock(){
	actualizarStockEpp();
	$("#graficoProyeccionInversionStock").hide();
	$("#divProyeccionStock").show();
	$("#graficoProyeccionStock").hide();
}
function generarGraficoInversionStock(){
	$("#graficoProyeccionInversionStock").show();
	$("#divProyeccionStock").hide();
	$("#graficoProyeccionStock").hide();
	
	var seriesEpp=[];
	var colors=["#4951BF","#B749BF","#CB2461","#2AA07D","#32A02A","#D3A237","#CD6C23","#7F006C","#3E1CD5","#7A0927",
	            "#5C0F23","#5C0F4A","#3D0F5C","#130F5C","#0F435C","#0F5C4A"];
	

	var rangoFechas=hallarFechasStock();
	var inversiones=[ mes0Inversion ,
	                  mes1Inversion -mes0Inversion,
	                  mes2Inversion -mes1Inversion,
	                  mes3Inversion -mes2Inversion,
	                  mes4Inversion -mes3Inversion,
	                  mes5Inversion -mes4Inversion,
	                  mes6Inversion -mes5Inversion,
	                  mes7Inversion -mes6Inversion,
	                  mes8Inversion -mes7Inversion,
	                  mes9Inversion -mes8Inversion,
	                  mes10Inversion -mes9Inversion,
	                  mes11Inversion -mes10Inversion,
	                  mes12Inversion -mes11Inversion]
	console.log(inversiones);
var fechasGraf=[];
	rangoFechas.forEach(function(val,ind){
		var fechaAux=val.split("-");
		var ultimoDia = new Date(fechaAux[0], fechaAux[1], 0);
		ultimoDia=convertirFechaNormal2(ultimoDia);
		fechaAux=ultimoDia.split("-");
		fechasGraf.push(fechaAux[1]+"-"+fechaAux[0]);
	});
	  $('#graficoProyeccionInversionStock').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: 'Inversiones por mes'
	        },
	        xAxis: {
	            categories:fechasGraf,
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Soles'
	            }
	        },
	        tooltip: {
	           headerFormat: '',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>S/ {point.y:.1f} </b></td></tr>',
	            footerFormat: '</table>',
	            shared: false,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: [{
	            name: 'Inversión',
	            data: inversiones

	        }]
	    });
}
function generarGraficoProyeccion(){
	var seriesEpp=[];
	var colors=["#4951BF","#B749BF","#CB2461","#2AA07D","#32A02A","#D3A237","#CD6C23","#7F006C","#3E1CD5","#7A0927",
	            "#5C0F23","#5C0F4A","#3D0F5C","#130F5C","#0F435C","#0F5C4A"];
	eppCompras.forEach(function(val1,index1){
		val1.tallas.forEach(function(val,index){
			seriesEpp.push({
				name:val1.equipoSeguridadNombre+"-"+val.nombre,
				data:[val.mes0Stock,val.mes1Stock,val.mes2Stock,val.mes3Stock,val.mes4Stock,val.mes5Stock,val.mes6Stock,val.mes7Stock
				      ,val.mes8Stock,val.mes9Stock,val.mes10Stock,val.mes11Stock,val.mes12Stock],
				color:colors[index1]
			});
		});
		
	});
	var rangoFechas=hallarFechasStock();
var fechasGraf=[];
	rangoFechas.forEach(function(val,ind){
		var fechaAux=val.split("-");
		var ultimoDia = new Date(fechaAux[0], fechaAux[1], 0);
		ultimoDia=convertirFechaNormal2(ultimoDia);
		fechaAux=ultimoDia.split("-");
		fechasGraf.push(fechaAux[1]+"-"+fechaAux[0]);
	});
	$("#graficoProyeccionStock").show();
	$("#divProyeccionStock").hide();
	  $('#graficoProyeccionStock').highcharts({
		    chart:{
		        type: 'spline',  marginTop: 20,
		    	backgroundColor:"#F2F2F2"},
		        title: {
		            text: '',
		            x: -20 ,//center,
		            style:{fontSize:"24px"}
		        },
		        
		        xAxis: {
		            categories: fechasGraf,
		             labels:{
		              style:{fontSize:"16px"}
		             }  
		        },
		        yAxis: {
		            title: {
		                text: 'Cantidad',
		                 style:{fontSize:"18px"}
		            },   labels:{
		              style:{fontSize:"16px"}
		             }  ,
		             plotBands: [{ // Light air
		                 from: 0,
		                 to: -100000,
		                 color: '#F78181',
		                 label: {
		                     text: '',
		                     style: {
		                         color: '#FA5858'
		                     }
		                 }
		             }],
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		        headerFormat:'<span style="font-size: 16px">{point.key}</span><br/>',
		            pointFormat:' <span style="color:{point.color}">\u25CF</span><b style="font-size:17px;margin-bottom:5px"> {series.name}: {point.y}</b><br>'
		        },
		        plotOptions:{
		        	  spline: {
		                  marker: {
		                      enabled: false
		                  }
		              }
		        },
		        legend: {
		          
		            borderWidth: 0,
		            itemStyle:{ "color": "#333333", "cursor": "pointer", "fontSize": "16px", "fontWeight": "bold" }
		        },
		        series: seriesEpp
		    });
}
function procesarDataDescargadaPrimerEstado(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		listFullEquipos = data.list; 
		listEquSegTipo=data.listEquSegTipo;
		listMotivos=data.listMotivos;
		unidadesBuscar=data.unidadesBuscar;
		$("#h2Titulo")
				.html(
						"<a onclick='javascript:cargarPrimerEstado();' href='#'>Equipo Seguridades</a>");
		$("#tblEquSeg tbody tr").remove();

		listFullEquipos.forEach(function(val,index){
			equipoSeguridadId=val.equipoSeguridadId;
			var listAprobadosReal=dividirLista(val.listTrabVigentesAprobados);
			
			var comprasCompletadas= val.comprasCompletadas;
			var comprasRetrasadas= val.comprasRetrasadas;
			var comprasTotal=val.comprasTotal ;
			if(val.tallasRegistradas.length>20){
				val.tallasRegistradas=val.tallasRegistradas.substring(0,19)+" ..."
			}
			$("#tblEquSeg tbody").append(

					"<tr id='tr" + val.equipoSeguridadId
							+ "' onclick='javascript:editarEquipoSeguridad("
							+index+")' >"

							+ "<td id='tdnom" + val.equipoSeguridadId
							+ "'>" + val.equipoSeguridadNombre 
							+"</td>"
							+ "<td id='tdtipo" + val.equipoSeguridadId
							+ "'>" + val.equipoSeguridadTipoNombre 
							+"</td>"
							+ "<td id='tdpro" + val.equipoSeguridadId
							+ "'>" + val.proveedor 
							+"</td>"
							+ "<td id='eppevi" + val.equipoSeguridadId
							+ "'>" + val.evidenciaNombre 
							+"</td>"
							+ "<td id='tdesp" + val.equipoSeguridadId
							+ "'>" + val.especificacion 
							+"</td>"
							+ "<td id='tdprecio" + val.equipoSeguridadId
							+ "'>" +(val.equipoSeguridadTipoId !=2? 
									"S/ " + val.precio :'')
									
							+"</td>"
							+ "<td id='tdfreren" + val.equipoSeguridadId
							+ "'>" + val.freRenNombre + "</td>"
							
							+ "<td id='tdtallar" + val.equipoSeguridadId
							+ "'>" +val.tallasRegistradas
							+"</td>"
							+ "<td id='tdtrabs" + val.equipoSeguridadId
							+ "'>" +(val.equipoSeguridadTipoId ==1? 
									listAprobadosReal.length+' / '  + val.numTrabAsignados:'') +"</td>"
							+ "<td id='tdprog" + val.equipoSeguridadId
							+ "'>" + (val.equipoSeguridadTipoId ==1? 
									val.programacionesCompletadas+' / ' + val.programacionesPlanificadas:'')+"</td>"
							
							
							+ "<td id='tdubi" + val.equipoSeguridadId
							+ "'>" +val.ubicacion  +"</td>"
							+ "<td id='tdestado" + val.equipoSeguridadId
							+ "'>" + (comprasTotal==0?
									"----":
										(comprasCompletadas==comprasTotal?
												'<i style="color:green" class="fa fa-check-square"></i>':
													(comprasRetrasadas>0?'<i style="color:red" class="fa fa-exclamation-circle"></i>':
														'<i style="color:orange" class="fa fa-eye"></i>')))+"</td>"
							+ "<td id='tdasig" + val.equipoSeguridadId
							+ "'>" + val.numPuestosAsociados + "</td>"
							+ "</tr>");
		
		})
		
		formatoCeldaSombreableTabla(true,"tblEquSeg");completarBarraCarga();
		if(getSession("linkCalendarioEppId")!=null){
			
			listFullEquipos.every(function(val,index3){
				
				if(val.equipoSeguridadId==parseInt(getSession("linkCalendarioEppId"))){
					editarEquipoSeguridad(index3);	
					if(getSession("linkCalendarioCompraId")!=null){
						$("#mdProgCompra").modal({
							  keyboard: true,
							  show:true,"backdrop":"static"
							});
						cargarComprasEpp();
					}
					sessionStorage.removeItem("linkCalendarioEppId");
					return false;
				}else{
					return true;
				}
			});
			
		}
		if(getSession("linkCalendarioEntregaEppId")!=null){
	 		
	 		programarFecha();
			
		}
		$("#tblMatrices").addClass("fixed");
		break;
	default:
		alert("Ocurrió un error al traer las Equipos de Seguridad!");
	}
	if (contador2 == 0) {
		goheadfixed('table.fixed');
	}
	contador2 = contador2 + 1;
}
function cambiarAcordeTipoES(){
	equipoSeguridadTipo=$("#selEquSegTipo").val();
	$("#tdprecio"+equipoSeguridadId).html(	"<label for='inputPrecio' style='float:left'>S/</label><input type='number' " +
			"id='inputPrecio' name='inputPrecio' style='width:90px'" 
			+"class='form-control' value="+0+">");
	if(equipoSeguridadTipo==1){  
		$("#inputUbi").hide();
	}else{
		$("#inputUbi").show();
	} 
	if(equipoSeguridadTipo==2){
		$("#tdprecio"+equipoSeguridadId).html("");
	}
}
function editarEquipoSeguridad(pindex) {
	if (!banderaEdicion) {
		
		equipoSeguridadId = listFullEquipos[pindex].equipoSeguridadId;
		equipoSeguridadTipo = listFullEquipos[pindex].equipoSeguridadTipoId;
		frecuenciaRenovacionId = listFullEquipos[pindex].frecuenciaRenovacionId;
		fechaActual=listFullEquipos[pindex].fechaActual;
		fechaProx=listFullEquipos[pindex].fechaProx;
		var pprecio=listFullEquipos[pindex].precio;
		var horaPlanificada=listFullEquipos[pindex].horaPlanificada;
		var ubicacion=listFullEquipos[pindex].ubicacion;
		var especificacion=listFullEquipos[pindex].especificacion;
		var tallas=listFullEquipos[pindex].tallasRegistradas;
		
		$("#tr"+equipoSeguridadId).addClass("fila-edicion");
		
		$("#tdasig"+equipoSeguridadId).html("<a onclick='verPuestosRecurso("+3+","+pindex+")' class='efectoLink'>" +
				"<i class='fa fa-list'></i>"+listFullEquipos[pindex].numPuestosAsociados +
				"</a>");
		formatoCeldaSombreableTabla(false,"tblEquSeg");
		$("#tdesp" + equipoSeguridadId)
		.html(
				"<input type='text' id='inputEsp' class='form-control' placeholder='Especificación' autofocus='true'  value='"
						+ especificacion + "'>");
		
		$("#tdubi" + equipoSeguridadId)
		.html(
				"<input type='text' id='inputUbi' class='form-control' placeholder='Ubicación' autofocus='true'  value='"
						+ ubicacion + "'>");
		
		
		
		$("#tdprecio"+equipoSeguridadId).html(
				"<label for='inputPrecio' style='float:left'>S/</label><input type='number' " +
				"id='inputPrecio' name='inputPrecio' style='width:90px'" 
				+"class='form-control' value="+pprecio+">"
		);
		
		var name = $("#tdnom" + equipoSeguridadId).text();
		$("#mdProgCompra .modal-title").html(
				"Adquisición / Mantenimiento de '"+name+"'");
		$("#tdnom" + equipoSeguridadId)
				.html(
						"<input type='text' id='inputNom' class='form-control' placeholder='Equipo Seguridad' autofocus='true'  value='"
								+ name + "'>");
		$("#tdhorapla" + equipoSeguridadId)
		.html(
				"<input type='time' id='inputHora' class='form-control' value='"
						+ horaPlanificada + "'>");
		var name1 = $("#tdpro" + equipoSeguridadId).text();
		$("#tdpro" + equipoSeguridadId)
				.html(
						"<input type='text' id='inputPro' class='form-control' placeholder='Proveedor' autofocus='true'   value='"
								+ name1 + "'>");
		//
		var options=
		{container:"#eppevi"+equipoSeguridadId,
				functionCall:function(){guardarEquipoSeguridad()},
				descargaUrl: "/equiposeguridad/evidencia/hoja?id="+ equipoSeguridadId,
				esNuevo:false,
				idAux:"EquipoSeg"+equipoSeguridadId,
				evidenciaNombre:listFullEquipos[pindex].evidenciaNombre};
		crearFormEvidenciaCompleta(options);
		
		
		//
		
		/** ************************************************************************* */
		var selEquSegTipo = crearSelectOneMenu("selEquSegTipo", "cambiarAcordeTipoES()",
				listEquSegTipo, equipoSeguridadTipo, "equSegTipoId",
				"nombre");
		$("#tdtipo" + equipoSeguridadId).html(selEquSegTipo);

		var selFreRenTipo = crearSelectOneMenu("selFreRenTipo", "cambiarFechaProx()", listFrecRenovacion,
				frecuenciaRenovacionId, "freRenId", "nombre");
		$("#tdfreren" + equipoSeguridadId).html(selFreRenTipo);

		$("#tdtrabs"+equipoSeguridadId).html("<a onclick='verVigenciaEpps()'>"+$("#tdtrabs"+equipoSeguridadId).text()+"</a>")
		if(equipoSeguridadTipo==1){
			$("#tdtallar"+equipoSeguridadId).html("<a onclick='verTallasEpp()'>"+tallas+"</a>");
			$("#btnProgFecha").show();
			$("#inputUbi").hide();
		}else{
			$("#btnProgFecha").hide();
		}
		if(equipoSeguridadTipo==2){
			$("#tdprecio"+equipoSeguridadId).html("");
		}
		
		
		$("#btnCompra").show();$("#btnProgFecha").hide();$("#btnClipTabla").hide();
		$("#btnStock").hide();$("#btnListaConsolidadoExcelEquipoSeguridad").hide();$("#btnVerQuicksight").hide();

		banderaEdicion = true;
	    habilitarBotonesEdicion();
	}
}

function verVigenciaEpps(){
	$("#mdVigenciaEpp").modal("show");
	var dataParam = {
			equipoSeguridadId : equipoSeguridadId 
		};
$("#tblVigenciaEpp tbody tr").remove();
		callAjaxPost(
				URL + '/equiposeguridad/vigencia/trabajadores',
				dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						 
						
					var	listTrabajadoresVigencia = data.list;
					listTrabajadoresVigencia.forEach(function(val,index){
						var estilo="";
						if(val.isVigenteId==0){
							estilo="background-color: #C0504D;"
						}else{
							estilo="background-color: #9BBB59;"
						}
						$("#tblVigenciaEpp").append("<tr > " +
								"<td style='"+estilo+"'>"+val.trabajador.puesto.areaName+"</td>" +
								"<td style='"+estilo+"'>"+val.trabajador.trabajadorNombre+"</td>" +
								"<td style='"+estilo+"'>"+val.isVigente+"</td>" +
								"<td style='"+estilo+"'>"+val.diasRestantes+"</td>" +
							"</tr>");
					});
						break;
					default:
						alert("Ocurrió un error al cargar el arbol de trabajadores!");
					}
				});
}
function nuevoEquipoSeguridad() {
	if (!banderaEdicion) {
		var selEquSegTipo = crearSelectOneMenu("selEquSegTipo", "cambiarAcordeTipoES()",
				listEquSegTipo, "-1", "equSegTipoId", "nombre");
		var selFreRenTipo = crearSelectOneMenu("selFreRenTipo", "cambiarFechaProx()",
				listFrecRenovacion, "-1", "freRenId", "nombre");
		equipoSeguridadId = 0;
		$("#tblEquSeg tbody:first")
				.prepend(
						"<tr id='tr0'>" 
						+ "<td><input type='text' id='inputNom' class='form-control' placeholder='EquipoSeguridad' required='true' autofocus='true'></td>"
								+ "<td>"
								+ selEquSegTipo
								+ "</td>"
								+ "<td><input type='text' id='inputPro' class='form-control' placeholder='Proveedor' required='true' ></td>"
								+"<td id='eppevi0'>...</td>"
								+ "<td><input type='text' id='inputEsp' class='form-control' placeholder='Especifiación' required='true' ></td>"
								+"<td id='tdprecio0'>"
								+"<label for='inputPrecio' style='float:left'>S/</label><input type='number' " 
								+"id='inputPrecio' name='inputPrecio' style='width:100px' " 
								+"class='form-control' value="+0+">"
								+"</td>"
								+ "<td>"
								+ selFreRenTipo
								+ "</td>"
								+"<td></td>"
								+"<td></td>"
								+"<td></td>"
								
								+ "<td><input type='text' id='inputUbi' class='form-control' placeholder='Ubicación' required='true' ></td>"

								+"<td id='tdestado0'>"
								
								+"</td>"
							+"<td></td>"
								+ "</tr>");
		var options=
		{container:"#eppevi"+equipoSeguridadId,
				functionCall:function(){},
				descargaUrl: "/equiposeguridad/evidencia/hoja?id="+ equipoSeguridadId,
				esNuevo:true,
				idAux:"EquipoSeg"+equipoSeguridadId,
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
		
		formatoCeldaSombreableTabla(false,"tblEquSeg");
		habilitarBotonesNuevo();

		$("#btnProgFecha").hide();$("#btnClipTabla").hide();$("#btnStock").hide();
		$("#btnListaConsolidadoExcelEquipoSeguridad").hide();$("#btnVerQuicksight").hide();

		banderaEdicion = true;
	}else{
		alert("Guarde primero.");
	}

	$("#inputFechaProx").prop('disabled', true);
}

function cancelarEquipoSeguridad() {
	cargarPrimerEstado();
}

function eliminarEquipoSeguridad() {
	var r = confirm("¿Está seguro de eliminar la EquipoSeguridad?");
	if (r == true) {
		var dataParam = {
			equipoSeguridadId : equipoSeguridadId,
			equipoSeguridadTipoId:$("#selEquSegTipo option:selected").val(),
		};

		callAjaxPost(URL + '/equiposeguridad/delete', dataParam,
				procesarResultadoEliminarEquipoSeguridad);
	}
}

function procesarResultadoEliminarEquipoSeguridad(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarPrimerEstado();
		break;
	default:
		if($("#selEquSegTipo option:selected").val()==1){
			alert("Verificar que el EPP no haya sido programado en una entrega, no tenga tallas registradas, y no esté asignado a puestos de trabajo");		
		}else{
			alert("Verificar que el Equipo de Seguridad no tenga programaciones registradas");
		}
	}
}

function guardarEquipoSeguridad() {

	var campoVacio = true;
	var precioGuardar=$("#inputPrecio").val();
	var selEquSegTipo = $("#selEquSegTipo option:selected").val();
	var selFreRenTipo = $("#selFreRenTipo option:selected").val();
	var inputNom = $("#inputNom").val();
	var inputPro = $("#inputPro").val();
	var inputUbi=$("#inputUbi").val();
	var inputEsp=$("#inputEsp").val();

	var inputFecActual=null;
	var inputFecProx=null;
	var horaPlanificada=$("#inputHora").val();
	if(!$("#inputHora").val()){
		horaPlanificada=null;
	}
	equipEstado=null;
	
	


	if (selEquSegTipo == '-1' || selFreRenTipo == '-1' || inputNom.length == 0
			|| inputPro.length == 0) {
		campoVacio = false;
	}

	if (campoVacio) {

		var dataParam = {
				equipoSeguridadId : equipoSeguridadId,
			equipoSeguridadTipoId : selEquSegTipo,
			frecuenciaRenovacionId : selFreRenTipo,
			equipoSeguridadNombre : inputNom,
			especificacion:inputEsp,
			ubicacion:inputUbi,
			precio:precioGuardar,
			estadoId:equipEstado,
			proveedor : inputPro,
			idCompany : sessionStorage.getItem("gestopcompanyid")
		};

		 callAjaxPost(URL + '/equiposeguridad/save', dataParam,
		 procesarResultadoGuardarCap,null,"tblEquSeg #tr"+equipoSeguridadId);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
function procesarResultadoGuardarCap(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		 
		guardarEvidenciaAuto(data.nuevoId,"fileEviEquipoSeg"+equipoSeguridadId
				,bitsEvidenciaAccionMejora,"/equiposeguridad/evidencia/hoja/save",
				cargarPrimerEstado); 
		break;
	default:
		alert("Ocurrió un error al guardar la EquipoSeguridad!");
	}
}
function hallarEstadoImplementacion(procId){
	var fechaPlanificada=$("#inputFec").val();
	var fechaReal=$("#inputFecProx").val();
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		procEstado=2;
		procEstadoNombre="Completado";
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				procEstado=3;
				procEstadoNombre="Retrasado";
			}else{
				procEstado=1;
				procEstadoNombre="Por implementar";
			}
			
		}else{
			
			procEstado=1;
			procEstadoNombre="Por implementar";
			
		}
	}
	
	$("#estadoProc"+procId).html(procEstadoNombre);
	
}
function importarDatos() {
	$("#btnGuardarNuevos").attr("onclick",
			"javascript:guardarMasivoCopiaExcel();");

	$('#mdImpDatos').modal('show');
	
}
function guardarMasivoCopiaExcel() {
	var texto = $("#txtListado").val();
	var listExcelFinal = texto.split('\n');
	var listRecurso = [];
	var listEppRepe = [];
	var listFullNombres = "";
	var listExcel=[];
	listExcelFinal.forEach(function(val){
		if(val.length>0){
			listExcel.push(val)
		}
	})
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
				var recurs = {};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						recurs.equipoSeguridadNombre = element.trim();
						if ($.inArray(recurs.equipoSeguridadNombre, listEppRepe) === -1) {
							listEppRepe.push(recurs.equipoSeguridadNombre);
						} else {
							listFullNombres = listFullNombres + recurs.equipoSeguridadNombre + ", ";
						}

					}
					
					if (j === 1) {
						for (var k = 0; k < listEquSegTipo.length; k++) {
							if (listEquSegTipo[k].nombre == element.trim()) {
								recurs.equipoSeguridadTipoId = listEquSegTipo[k].equSegTipoId;
							}
						}

						if (!recurs.equipoSeguridadTipoId) {
							validado = "Tipo de Equipo no reconocido.";
							break;
						}
					}
					
					if (j === 2) {
						recurs.proveedor = element.trim();
					
					}
					if (j === 3) {
						recurs.precio = element.trim();
						if(isNaN(parseFloat(recurs.precio ))){
							validado="Precio ingresado no reconocidos"
						}
					}
					if (j === 4) {
						recurs.especificacion = element.trim();
					
					}
					recurs.idCompany = getSession("gestopcompanyid");
				
				}
				recurs.frecuenciaRenovacionId=4;
				
				listRecurso.push(recurs);
				if (listEppRepe.length < listRecurso.length) {
					validado = "Existen equipos repetidos." + listFullNombres;
					break;
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
				listRecurso : listRecurso
			};
			
			callAjaxPost(URL + '/equiposeguridad/masivo/save', dataParam,
					function (data) {
				switch (data.CODE_RESPONSE) {
				case "05":
					
						alert("Se guardaron exitosamente.");
						cargarPrimerEstado();
						$('#mdImpDatos').modal('hide');
					
					break;
				default:
					alert("Ocurri&oacute; un error al guardar los epps!");
				}
			});
		}
	} else {
		alert(validado);
	}
}

var listOpcConsolidadoEquipoSeguridad=[
	{id:1,nombre:"Entrega de Equipos de Protección Personal (EPP)"}
];

function ocultarConsolidadosExcelEquipoSeguridad(){
	$("#modalConsolidadosExcelEquipoSeg").modal("hide");
}

function verConsolidadosExcelEquipoSeguridad(){
	$("#modalConsolidadosExcelEquipoSeg").remove();

	var selOpcConExcelEquipoSeg = crearSelectOneMenuOblig("selOpcConExcelEquipoSeg",
		"verAcordeConsolidadosExcelEquipoSeguridad()",listOpcConsolidadoEquipoSeguridad,"1","id","nombre");

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",
		 inputForm:selOpcConExcelEquipoSeg,divContainer:"divSelConExcelEquipoSeg"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConsolidadosExcelEquipoSeguridad()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='descargarConsolidadosExcelEquipoSeguridad()'>" +
					   "<i class='fa fa-download'></i> Descargar" +
			       "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalConsolidadosExcelEquipoSeg",nombre:"<i class='fa fa-list'></i> Seleccionar - Consolidado excel",
		contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	verAcordeConsolidadosExcelEquipoSeguridad();
}

function verAcordeConsolidadosExcelEquipoSeguridad(){
	$(".atributo-consolidadoExcelEquipoSeg").remove();
	var listContenidoDivSelConExcelEquipoSeg = [];
	var opcConsolidadoExcel = parseInt($("#selOpcConExcelEquipoSeg").val());

	if([1].includes(opcConsolidadoExcel)){
		listContenidoDivSelConExcelEquipoSeg=[
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",
			 inputForm:"<input type='date' id='fechaInicioConsolidadoEquipoSeg' class='form-control'>"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",
			 inputForm:"<input type='date' id='fechaFinConsolidadoEquipoSeg' class='form-control'>"}
		];
	}

	var contenido = "";

	listContenidoDivSelConExcelEquipoSeg.forEach(function(val){
		val.clase = "atributo-consolidadoExcelEquipoSeg";
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	$("#divSelConExcelEquipoSeg").parent().after(contenido);

	if([1].includes(opcConsolidadoExcel)){
		var hoy = getSession("fechaHoyOrdenInversoTexto"),inicioDias = -365;

		$("#fechaInicioConsolidadoEquipoSeg").val(sumaFechaDias(inicioDias,hoy));$("#fechaFinConsolidadoEquipoSeg").val(hoy);
	}
}

function descargarConsolidadosExcelEquipoSeguridad(){
	var campoVacio = true;

	var opcConsolidadoExcel = parseInt($("#selOpcConExcelEquipoSeg").val());
	var fechaInicioConsolidado = $("#fechaInicioConsolidadoEquipoSeg").val();
	var fechaFinConsolidado = $("#fechaFinConsolidadoEquipoSeg").val();

	if([1].includes(opcConsolidadoExcel)){
		if(fechaInicioConsolidado.length == 0 || fechaFinConsolidado.length == 0){
			campoVacio = false;mensajeUx = "<label>Debe ingresar la fecha inicio y la fecha fin.</label>";
		}
	}

	if(campoVacio){
		var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
		var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);

		if([1].includes(opcConsolidadoExcel)){
			window.open(URL+"/equiposeguridad/excel/lista/consolidado?" +
				"empresaId="+getSession("gestopcompanyid")+"&opcionSelectLista="+opcConsolidadoExcel +
				"&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado +
				"&fechaInicioConsolidadoNormal="+fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText);
		}
	}else{
		$("#modalConsolidadosExcelEquipoSeg").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionConsolidadoExcel");

		$("#modalMensajeUxValidacionConsolidadoExcel").on("hidden.bs.modal",function(){
			$("#modalConsolidadosExcelEquipoSeg").modal("show");
		});
	}
}

function ocultarQuicksightOpcionesEquipoSeguridad(){
	$("#modalQuicksightOpcEquipoSeg").modal("hide");
}

function verQuicksightOpcionesEquipoSeguridad(){
	$("#modalQuicksightOpcEquipoSeg").remove();

	var contenido = "";

	var buttonOcultar =
		"<button type='button' class='btn btn-info' style='margin-right:5px' " +
				"onclick='ocultarQuicksightOpcionesEquipoSeguridad()' title='Regresar a la vista anterior.'>" +
			"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> "+"<i class='fa fa-pie-chart fa-2x'></i>" +
		"</button>";

	var modalOptions={
		maxWidth:"90%",id:"modalQuicksightOpcEquipoSeg",btnCerrarHabilitado:0,
		nombre:"<i class='fa fa-table'></i> Quicksight",
		contenido:
			"<form class='form-inline'>"+buttonOcultar+"</form>" +
			"<div id='divQuicksightOpcEquipoSeg'>"+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	var dataParam={
		empresaId:parseInt(getSession("gestopcompanyid"))
	};

	callAjaxPostSimpleVersionDos(1,URL+'/quicksight/equiposeguridad/opciones',dataParam,1,0,function(data){
		if(data.CODE_RESPONSE === "05"){
			var urlDelIframe = data.embedUrl;

			var $iframe = $('<iframe>',{
				src:urlDelIframe,width:'100%',height:'750px',frameborder:'0',css:{border:'none'}
			}).on('load',function(){
				$.unblockUI();console.log('El contenido de QuickSight ha terminado de cargar.');
			});

			$('#divQuicksightOpcEquipoSeg').empty().append($iframe);
		}else{
			$("#modalQuicksightOpcEquipoSeg").modal("hide");

			mensajeUx = "<label>Error al cargar los datos.</label>";
			mensajesUx(mensajeUx,2,"","ValidacionQuicksight");

			$("#modalMensajeUxValidacionQuicksight").on("hidden.bs.modal",function(){
				$("#modalQuicksightOpcEquipoSeg").modal("show");
			});
		}
	});
}
