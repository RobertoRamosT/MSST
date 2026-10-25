 
$(function(){
  
})
 var empresasIndicador=[],clientesIndicador=[];
var listIndicadores=[
                     {id:1,nombre:"Accidentabilidad - Indicadores ",divContainer:"divIndicadorAcc"},
                     {id:2,nombre:"Accidentabilidad - Detalle",divContainer:"divDetalleAcc"},
                     {id:3,nombre:"Formación - Indicadores",divContainer:"divIndicadorForm"},
                     {id:4,nombre:"Act. Sensibilización - Detalle",divContainer:"divDetalleActiv8"},
                     {id:5,nombre:"Capacitación - Detalle",divContainer:"divDetalleActiv3"},
                     {id:6,nombre:"Inspecciones internas planificadas - Indicadores",divContainer:"divIndicadorActiv2"},
                     {id:7,nombre:"Inspecciones internas planificadas - Detalle",divContainer:"divDetalleActiv2"},
                     {id:8,nombre:"Auditoría - Indicadores",divContainer:"divIndicadorActiv9"},
                     {id:9,nombre:"Auditoría - Detalle",divContainer:"divDetalleActiv2"},
                     {id:10,nombre:"Programa de actividades - Indicadores",divContainer:"divIndicadorActiv0"},
                     {id:11,nombre:"Programa de actividades - Detalle",divContainer:"divDetalleActiv0"}
                    
                     ];
function copiarTablaIndicador(tablaId){
	var textIn=obtenerDatosTablaEstandarNoFija(""+tablaId);
	copiarAlPortapapeles(textIn);
	alert("Se guardó la tabla al clipboard")
}
function cargarIndicadoresContratista() {
	$("#tabIndicadores form").html("");
	
	
					
					$("#tabIndicadores form").append("" 
					+"Desde <input class='form-control' id='fechaInicioIndicador' type='date'>"
					+" Hasta<input class='form-control' id='fechaFinIndicador' type='date'>"
					 +"");
					$("#tabIndicadores form").append("<button type='button' class='btn btn-success' id='btnGenerarIndicador'>" +
							"<i aria-hidden='true' class='fa fa-link'></i> Generar</button>");
					$("#btnGenerarIndicador").attr("onclick","iniciarSeccionInidicador()");
					
					$("#fechaInicioIndicador").val(sumaFechaDias(-2,convertirFechaInput(obtenerFechaActual())))
					.attr("onchange","ocultarSeccionIndicador()");
					
					$("#fechaFinIndicador").attr("onchange","ocultarSeccionIndicador()")
					.val(sumaFechaDias(2,convertirFechaInput(obtenerFechaActual())));
					
					
					var selInd=crearSelectOneMenuOblig("selInd", "ocultarSeccionIndicador()", listIndicadores, "", "id",
					"nombre");
					$("#tabIndicadores form").prepend("Indicador "+selInd);
					$("#selInd").val("11");
					

					iniciarSeccionInidicador();
	
}
function ocultarSeccionIndicador(){
	$("#btnGenerarIndicador").show();
	$("#tabIndicadores .container-fluid").hide();
}

function iniciarSeccionInidicador(){
	$("#btnGenerarIndicador").hide();
	$("#tabIndicadores .container-fluid").hide();
	
	$("#divContainEstadistica").show();
	$("#divContainEstadistica .table-responsive").hide();
	var indicadorId=parseInt($("#selInd").val());
	var indicadorObj={};
	listIndicadores.forEach(function(val){
		if(val.id==indicadorId){
			indicadorObj=val;
		}
	})
	var dataParam={empresaId : getSession("gestopcompanyid") ,
			fechaInicioPresentacion:$("#fechaInicioIndicador").val(),
			fechaFinPresentacion:$("#fechaFinIndicador").val()
			};
	switch(indicadorId){ 
	case 1:
		callAjaxPost(URL + '/contratista/indicadores/accidente', 
				dataParam, function(data){
					var  listIndicadorAccidente=data.list;
				  $("#"+indicadorObj.divContainer).find("table tbody tr").remove();
				  listIndicadorAccidente.forEach(function(val){
					  
					  
				  var indicadorFrecuenciaATP=val.numAccIncap4*200000/val.numHorasHombre;
				  var indiceSeveridad=val.numDiasPerdidos*200000/val.numHorasHombre;
				  if(val.numHorasHombre==0){
					  indicadorFrecuenciaATP=0.00;indiceSeveridad=0.00
				  }
				  $("#"+indicadorObj.divContainer+" table tbody")
					  .append("<tr>" +
					  		"<td>"+val.nombre+"</td>" +
					  		"<td>"+val.numTrabajadores+"</td>" +
					  		"<td>"+val.numHorasHombre+"</td>" +
					  		"<td>"+val.numAccLeves+"</td>" +
					  		"<td>"+val.numAccIncap1+"</td>" +
					  		"<td>"+val.numAccIncap3+"</td>" +
					  		"<td>"+val.numAccIncap4+"</td>" +
					  		"<td>"+val.numAccMortal+"</td>" +
					  		"<td>"+val.numIncidentes+"</td>" +
					  		"<td>"+val.numDiasPerdidos+"</td>" +
					  		"<td>"+indicadorFrecuenciaATP.toFixed(2)+"</td>" +
					  		"<td>"+indiceSeveridad.toFixed(2)+"</td>" +
					  		"" +
					  		"</tr>")  
				  });
				  
		  $("#divContainEstadistica").find("#"+indicadorObj.divContainer).show();
			resizeDivWrapper(indicadorObj.divContainer,300);
		});
		break;
	case 2:
		callAjaxPost(URL + '/contratista/indicadores/accidente/detalle', 
				dataParam, function(data){
					var  listDetalleAccidente=data.list;
				  $("#"+indicadorObj.divContainer).find("table tbody tr").remove();
				  listDetalleAccidente.forEach(function(val){
					  if(val.trabajadorContratista.nombre==""){
						  val.trabajadorContratista.nombre="No hubo afectados";
					  }
					  var textEvi="Sin registrar";
					  if(val.evidenciaNombre!=""){
						  textEvi="<a target='_blank' class='efectoLink' " +
						  		"href='"+URL+"/contratista/proyecto/incidente/evidencia?id="+val.accidenteId+"'>"
							  +"<i class='fa fa-download'></i>"+"Descargar"+"</a>"
					  }
				  $("#"+indicadorObj.divContainer+" table tbody")
					  .append("<tr>" +
					  		"<td>"+val.contratista.nombre+"</td>" +
					  		"<td>"+val.fechaTexto+"</td>" +
					  		"<td>"+val.accidenteTipoNombre+" "+val.accidenteClasificacionNombre+"</td>" +
					  		"<td>"+val.accidenteSubTipoNombre+"</td>" +
					  		"<td>"+val.accidenteDescripcion+"</td>" +
					  		"<td>"+val.trabajadorContratista.nombre+"</td>" +
					  		"<td>"+textEvi+"</td>" +
					  		"<td>"+val.indicadorAcciones+"</td>" +
					  		"" +
					  		"</tr>")  
				  });
		$("#divContainEstadistica").find("#"+indicadorObj.divContainer).show();
		resizeDivWrapper(indicadorObj.divContainer,300);
		});
		break;
	case 3:
		callAjaxPost(URL + '/contratista/indicadores/formacion', 
				dataParam, function(data){
					var  list=data.list;
				  $("#"+indicadorObj.divContainer).find("table tbody tr").remove();
				  list.forEach(function(val){
					  
					  
				  var indicadorFormacion=val.numHorasFormacionProyecto/val.numHorasHombre;
				  if(val.numHorasHombre==0){
					  indicadorFormacion=0.00;
				  }
				  $("#"+indicadorObj.divContainer+" table tbody")
					  .append("<tr>" +
					  		"<td>"+val.nombre+"</td>" +
					  		"<td>"+val.numTrabajadores+"</td>" +
					  		"<td>"+val.numHorasHombre+"</td>" +
					  		"<td>"+val.numHorasFormacionProyecto+"</td>" +
					  		"<td>"+indicadorFormacion.toFixed(2)+"</td>" +
					  		"" +
					  		"</tr>")  
				  });
				  $("#divContainEstadistica").find("#"+indicadorObj.divContainer).show();
					resizeDivWrapper(indicadorObj.divContainer,300);
		});
		break;
	case 4:
		dataParam.unidadId=8;
		callAjaxPost(URL + '/contratista/indicadores/actividades/detalle', 
				dataParam, function(data){
					var  list=data.list;
				  $("#"+indicadorObj.divContainer).find("table tbody tr").remove();
				  list.forEach(function(val){
					  
					
				  $("#"+indicadorObj.divContainer+" table tbody")
					  .append("<tr>" +
					  		"<td>"+val.contratista.nombre+"</td>" +
					  		"<td>"+(val.estado.id!=2? val.fechaPlanificadaTexto:val.fechaRealTexto)+"</td>" +
					  		"<td>"+val.descripcion+"</td>" +
					  		"<td>"+val.expositor+"</td>" +
					  		"<td>"+val.numTrabajadores+"</td>" +
					  		"<td>"+val.duracion+"</td>" +
					  		"<td>"+(val.duracion/60).toFixed(2)+"</td>" +
					  		"" +
					  		"</tr>")  
				  });
		$("#divContainEstadistica").find("#"+indicadorObj.divContainer).show();
		resizeDivWrapper(indicadorObj.divContainer,300);
		});
		break;
	case 5:
		dataParam.unidadId=3;
		callAjaxPost(URL + '/contratista/indicadores/actividades/detalle', 
				dataParam, function(data){
					var  list=data.list;
				  $("#"+indicadorObj.divContainer).find("table tbody tr").remove();
				  list.forEach(function(val){
					  var textEvi="Sin registrar";
					  if(val.evidenciaNombre!=""){
						  textEvi="<a target='_blank' class='efectoLink' " +
						  		"href='"+URL+"/contratista/proyecto/actividad/evidencia?id="+val.id+"'>"
							  +"<i class='fa fa-download'></i>"+"Descargar"+"</a>"
					  }  
					
				  $("#"+indicadorObj.divContainer+" table tbody")
					  .append("<tr>" +
					  		"<td>"+val.contratista.nombre+"</td>" +
					  		"<td>"+(val.estado.id!=2? val.fechaPlanificadaTexto:val.fechaRealTexto)+"</td>" +
					  		"<td>"+val.descripcion+"</td>" +
					  		"<td>"+val.expositor+"</td>" +
					  		"<td>"+val.numTrabajadores+"</td>" +
					  		"<td>"+val.duracion+"</td>" +
					  		"<td>"+(val.duracion/60).toFixed(2)+"</td>" +
					  		"<td>"+textEvi+"</td>" +
					  		"" +
					  		"</tr>")  
				  });
		$("#divContainEstadistica").find("#"+indicadorObj.divContainer).show();
		resizeDivWrapper(indicadorObj.divContainer,300);
		});
		break;
	case 6:
	case 8:
		if(indicadorId==6){
			dataParam.unidadId=2;	
		}
		if(indicadorId==8){
			dataParam.unidadId=9;
		}
		
		
		callAjaxPost(URL + '/contratista/indicadores/auditoria', 
				dataParam, function(data){
					var  list=data.list;
				  $("#"+indicadorObj.divContainer).find("table tbody tr").remove();
				  list.forEach(function(val){
					  
					
				  $("#"+indicadorObj.divContainer+" table tbody")
					  .append("<tr>" +
					  		"<td>"+val.nombre+"</td>" +
					  		"<td>"+val.puntajeAuditoriaPromedio+"</td>" +
					  		"<td>"+val.numActividades+"</td>" +
					  		"" +
					  		"</tr>")  
				  });
		$("#divContainEstadistica").find("#"+indicadorObj.divContainer).show();
		resizeDivWrapper(indicadorObj.divContainer,300);
		});
		break;
		
	case 7:
	case 9:
		if(indicadorId==7){
			dataParam.unidadId=2;	
		}
		if(indicadorId==9){
			dataParam.unidadId=9;
		}
		callAjaxPost(URL + '/contratista/indicadores/actividades/detalle', 
				dataParam, function(data){
					var  list=data.list;
				  $("#"+indicadorObj.divContainer).find("table tbody tr").remove();
				  list.forEach(function(val){
					  
					
				  $("#"+indicadorObj.divContainer+" table tbody")
					  .append("<tr>" +
					  		"<td>"+val.contratista.nombre+"</td>" +
					  		"<td>"+(val.estado.id!=2? val.fechaPlanificadaTexto:val.fechaRealTexto)+"</td>" +
					  		
					  		"<td>"+val.responsable.nombre+"</td>" +
					  		"<td>"+val.puntaje+"</td>" +
					  		"<td>"+val.observacion+"</td>" +
					  		"" +
					  		"</tr>")  
				  });
		$("#divContainEstadistica").find("#"+indicadorObj.divContainer).show();
		resizeDivWrapper(indicadorObj.divContainer,300);
		});
		break;
		case 10:		
			
			callAjaxPost(URL + '/contratista/indicadores/actividad/general', 
					dataParam, function(data){
						var  list=data.list;
					  $("#"+indicadorObj.divContainer).find("table tbody tr").remove();
					  list.forEach(function(val){
					var porcentajeCompletado=val.numActividadesCompletadas/(val.numActividadesPlanificadas+val.numActividadesCompletadas)
						if((val.numActividadesPlanificadas+val.numActividadesCompletadas)==0){
							porcentajeCompletado=0.0;
						}
					  $("#"+indicadorObj.divContainer+" table tbody")
						  .append("<tr>" +
						  		"<td>"+val.nombre+"</td>" +
						  		"<td>"+val.numActividadesCompletadas+"</td>" +
						  		"<td>"+val.numActividadesPlanificadas+"</td>" +
						  		"<td>"+pasarDecimalPorcentaje(porcentajeCompletado)+"</td>" +
						  		"" +
						  		"</tr>")  
					  });
			$("#divContainEstadistica").find("#"+indicadorObj.divContainer).show();
			resizeDivWrapper(indicadorObj.divContainer,300);
			});
			break;
		case 11:
			callAjaxPost(URL + '/contratista/indicadores/actividades/detalle', 
					dataParam, function(data){
						var  list=data.list;
					  $("#"+indicadorObj.divContainer).find("table tbody tr").remove();
					  list.forEach(function(val){
						  
						
					  $("#"+indicadorObj.divContainer+" table tbody")
						  .append("<tr>" +
						  		"<td>"+val.contratista.nombre+"</td>" +
						  		"<td>"+(val.estado.id!=2? val.fechaPlanificadaTexto:val.fechaRealTexto)+"</td>" +
						  		"<td>"+(val.estado.id!=2? "(Sin realizar) ":"("+val.fechaRealTexto+") ")+val.categoria.nombre+ " - "+val.descripcion+"</td>" +
						  		"<td>"+val.estado.nombre+"</td>" +
						  		"</tr>")  
					  });
			$("#divContainEstadistica").find("#"+indicadorObj.divContainer).show();
			resizeDivWrapper(indicadorObj.divContainer,300);
			});
			break;
	} 
	$("#btnClipboardIndicador").attr("onclick","copiarTablaIndicador('"+indicadorObj.divContainer+" table')");
		
		
	
} 
