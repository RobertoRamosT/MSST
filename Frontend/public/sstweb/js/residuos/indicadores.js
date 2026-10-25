 
$(function(){
	$("#tabIndicadores .container-fluid").hide();
})
 var clientesIndicor;
 var generacionObj,transportistasObj;
 var etapasIndicador;
 var tipoResiduoIndicador=[];
 var empresasIndicador=[],clientesIndicador=[];
var listIndicadores=[{id:0,nombre:"Stock de residuos sólidos (Kg)"},
                     {id:1,nombre:"Costo de la disposición (S/ ) "},
                     {id:2,nombre:"Generación percápita de residuos sólidos (Kg/Persona-día)"},
                     {id:3,nombre:"Generación de residuos sólidos (ton)"},
                     {id:4,nombre:"Residuos sólidos recolectados y dispuestos por los diferentes canales (Kg) "},
                     {id:5,nombre:"Composición de Residuos sólidos (ton)"},
                     {id:6,nombre:"Residuos sólidos por edificio (Kg)"},
                     {id:7,nombre:"Generación de Residuos por tipo segregado por edificio (Kg)"},
                     {id:10,nombre:"Transporte de Residuos por tipo segregado por edificio (Kg)"},
                     {id:8,nombre:"Residuos por cliente (Kg)"},
                     {id:9,nombre:"Generación Residuos por cliente y tipo (Kg)"},
                     {id:11,nombre:"Residuos no peligroso por día (Kg)"},
                     {id:12,nombre:"Residuos no peligroso por mes (Kg)"}];
function copiarTablaIndicador(tablaId){
	var textIn=obtenerDatosTablaEstandarNoFija(""+tablaId);
	copiarAlPortapapeles(textIn);
	alert("Se guardó la tabla al clipboard")
}
function cargarIndicadoresResiduos() {
	$("#btnCancelarLista").hide();
	$("#btnNuevoLista").show();
	$("#btnEliminarLista").hide();
	$("#btnGuardarLista").hide();
	$("#tabIndicadores form").html("");
	
	callAjaxPostNoUnlock(URL + '/residuo/clientes', 
			{empresaId : getSession("gestopcompanyid") }, function(data){
				if(data.CODE_RESPONSE=="05"){ 
					clientesIndicor=data.list; 
					var selCliInd=crearSelectOneMenu("selCliInd", "ocultarSeccionIndicador();agregarNoLocatarios()", clientesIndicor, "", "id",
					"nombre","Todos");
					$("#tabIndicadores form").prepend("Área "+selCliInd);
					$("#tabIndicadores form").append("" 
					+"Desde <input class='form-control' id='fechaInicioStock' type='date'>"
					+" Hasta<input class='form-control' id='fechaFinStock' type='date'>"
					 +"")
					$("#tabIndicadores form").append("<button type='button' class='btn btn-success' id='btnGenerarIndicador'>" +
							"<i aria-hidden='true' class='fa fa-link'></i> Generar</button>");
					$("#btnGenerarIndicador").attr("onclick","iniciarSeccionInidicador()");
					$("#fechaInicioStock").val(sumaFechaDias(-2,convertirFechaInput(obtenerFechaActual())))
					.attr("onchange","ocultarSeccionIndicador()");
					$("#fechaFinStock").attr("onchange","ocultarSeccionIndicador()")
					.val(sumaFechaDias(2,convertirFechaInput(obtenerFechaActual())));
					
					
					var selInd=crearSelectOneMenuOblig("selInd", "ocultarSeccionIndicador();agregarNoLocatarios()", listIndicadores, "", "id",
					"nombre");
					$("#tabIndicadores form").prepend("Indicador "+selInd);
					$("#selInd").val("9")
					agregarNoLocatarios();
					iniciarSeccionInidicador();
					
					
				}else{
					console.log("NOPNPO")
				}
			});
	
}
function ocultarSeccionIndicador(){
	$("#btnGenerarIndicador").show();
	$("#tabIndicadores .container-fluid").hide();
}
function agregarNoLocatarios(){
	$("#tabIndicadores form").find("#labeloLoca").remove();
	$("#tabIndicadores form").find("#divSelNoLocatarios").remove();
	
	if($("#selCliInd").val()=="-1" && ($("#selInd").val()==11 || $("#selInd").val()==12)   ){

		$("#fechaFinStock").after("<label id='labeloLoca'>Áreas No Incluidos</label> <div style='width: 600px' id='divSelNoLocatarios' > </div>");
		crearSelectOneMenuObligMultipleCompleto("selNoLocatario", "", clientesIndicor, "id",
				"nombre","#divSelNoLocatarios","Ninguno");
		$("#selNoLocatario").chosen().change(function(val){
			$("#btnGenerarIndicador").show();
			$("#tabIndicadores .container-fluid").hide();
		 });
		
		$("#selNoLocatario_chosen").css({"width":"500px"})
	}
}
function iniciarSeccionInidicador(){
	$("#btnGenerarIndicador").hide();
	$("#tabIndicadores .container-fluid").hide();
	
	$("#divContainEstadistica").show();
	$("#divContainEstadistica .table-responsive").hide();
	var indicadorId=parseInt($("#selInd").val());
	var divContainerId="";
	var clienteId=$("#selCliInd").val();
	var clienteObj={};
	if(clienteId=="-1"){
		clienteObj=null;
	}else{
		clienteObj={id:clienteId}
	}
	var clientesNoPermitidos=$("#selNoLocatario").val();
	var listFinalClientesNoPermitidos=[];
	if(clientesNoPermitidos!=null){
		clientesNoPermitidos.forEach(function(val){
			listFinalClientesNoPermitidos.push({id:val})
		});
		if(clientesNoPermitidos.length==0){
			listFinalClientesNoPermitidos=null;
		}
	}else{
		listFinalClientesNoPermitidos=null;
	}
	
	callAjaxPost(URL + '/residuo/indicadores', 
			{empresaId : getSession("gestopcompanyid") ,
		fechaInicioPresentacion:$("#fechaInicioStock").val(),
		fechaFinPresentacion:$("#fechaFinStock").val(),
		cliente:clienteObj,clientes:listFinalClientesNoPermitidos
		}, function(data){
				if(data.CODE_RESPONSE=="05"){
					  generacionObj=data.generacionObj;
				  transportistasObj=data.transportistasObj;
				  etapasIndicador=data.etapasList;
				  tipoResiduoIndicador=data.tipoResiduoIndicador;
				  empresasIndicador=data.empresas;
				  clientesIndicador=data.clientes;
	switch(indicadorId){
	case 0:
		actualizarTablaStock();
		$("#divContainEstadistica").find("#divStock").show();
		divContainerId="#divStock";
		break;
	case 1:
		actualizarTablaCostoTrans();
		$("#divContainEstadistica").find("#divCostoTrans").show();
		divContainerId="divCostoTrans";
		break;
	case 2:
		actualizarTablaGeneracionPer();
		$("#divContainEstadistica").find("#divGenePer").show();
		divContainerId="divGenePer";
		break;
	case 3:
		actualizarTablaGeneracionTotal();
		$("#divContainEstadistica").find("#divGeneTotal").show();
		divContainerId="divGeneTotal";
		break;
	case 4:
		actualizarTablaEtapaSalida();
		$("#divContainEstadistica").find("#divEtapaSalida").show();
		divContainerId="divEtapaSalida";
		break;
	case 5:
		actualizarTablaClasificacionTotal();
		$("#divContainEstadistica").find("#divClasif").show();
		divContainerId="divClasif";
		break;
	case 6:
		actualizarTablaEdificiosTotal();
		$("#divContainEstadistica").find("#divEdificio").show();
		divContainerId="divEdificio";
		break;
	case 7:
		actualizarTablaEdificiosPorTipo(1);
		$("#divContainEstadistica").find("#divEdificioTipo").show();
		divContainerId="divEdificioTipo";
		break;
	case 8:
		actualizarTablaClientesTotal();
		$("#divContainEstadistica").find("#divClientesIndicador").show();
		divContainerId="divClientesIndicador";
		break;
	case 9:
		actualizarTablaClientesPorTipo();
		$("#divContainEstadistica").find("#divClientesTipoIndicador").show();
		divContainerId="divClientesTipoIndicador";
		break;
	case 10:
		actualizarTablaEdificiosPorTipo(2);
		$("#divContainEstadistica").find("#divEdificioTipo").show();
		divContainerId="divEdificioTipo";
		break;
	case 11:
		actualizarTablaDiaPorTipo();
		$("#divContainEstadistica").find("#divDiaTipo").show();
		divContainerId="divDiaTipo";
		break;	
	case 12:
		actualizarTablaMesPorTipo();
		$("#divContainEstadistica").find("#divMesTipo").show();
		divContainerId="divMesTipo";
		break;
	}
	
	$("#btnClipboardIndicador").attr("onclick","copiarTablaIndicador('"+divContainerId+" table')");
		
			}else{
			console.log("NOPNPO")
		}
	});
	
}
function actualizarTablaClientesTotal(){
	$("#divClientesIndicador").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	
	$("#divClientesIndicador").find("table tbody tr").remove(); 
	tipoResiduoIndicador.forEach(function(val,index){
		val.cantidadEntrada=0;
		val.cantidadSalida=0; 
	});
	clientesIndicador.forEach(function(val,index){
		val.indicadorTipo=[];
		
		tipoResiduoIndicador.forEach(function(val1,index1){
			val.indicadorTipo.push({
				id:val1.id,
				nombre:val1.nombre,
				cantidadEntrada:0,
				cantidadSalida:0 
			});
		}); 
		
		generacionObj.forEach(function(val1,index1){
			var entradas=val1.residuos;
			var enRango=fechaIncluidaEnRango(convertirFechaInput(val1.fecha),fechaInicio,fechaFin);
			if(enRango){
				entradas.forEach(function(val2,index2){
					if(val2.cliente.id==val.id){
						val.indicadorTipo.forEach(function(val3,index3){
							if(val3.id==val2.tipo.id ){
								val3.cantidadEntrada+=val2.cantidad;
							};
							
						});
					}  
				});
			} 
		});  
		
	});
	clientesIndicador.forEach(function(val,index){
		 
		var cantidadEntradaTotal=0;
		val.indicadorTipo.forEach(function(val1,index1){ 
			cantidadEntradaTotal+=val1.cantidadEntrada;
			});
		$("#divClientesIndicador").find("table tbody")
		.append( "<tr>" +
				"<td>" +
				"" +val.nombre+
				"</td>"+
				"<td>"    +formatNumberComaMilesKg(cantidadEntradaTotal)+ "</td>" +  
					"</tr>"); 
	});
	
	
}
function actualizarTablaClientesPorTipo(){
	$("#divClientesTipoIndicador").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	
	$("#divClientesTipoIndicador").find("table tbody tr").remove();
	$("#divClientesTipoIndicador").find("table thead tr td").remove();
	$("#divClientesTipoIndicador").find("table thead tr")
	.append(
			"<td style='width:150px'><button onclick='actualizarTablaClientesPorTipo()' "+
	"class='btn btn-success'><i class='fa fa-refresh'></i>Refresh </button></td>"+  		
	"<td style='width:280px'></td>");
	tipoResiduoIndicador.forEach(function(val,index){
		val.cantidadEntrada=0;
		val.cantidadSalida=0;
		val.isReporte=1;
		$("#divClientesTipoIndicador").find("table thead tr")
		.append("<td style='width:130px'> <i onclick='eliminarColumnaTipoCliente("+index+")' class='fa fa-2x fa-times-circle'></i>" +
				"<br>"   +val.nombre+"" +
				"<br><strong> (Generación)</strong>"+ " (Kg)</td>"  
				);
	});
	$("#divClientesTipoIndicador").find("table thead tr")
	.append("<td>"+" Generación Total"+ " (Kg)</td>"
			+"<td style='width:140px'>"+" % de Participación"+ "</td>"
			);
	clientesIndicador.forEach(function(val,index){
		val.indicadorTipo=[];
		val.isReporte=1;
		
		tipoResiduoIndicador.forEach(function(val1,index1){
			val.indicadorTipo.push({
				id:val1.id,
				nombre:val1.nombre,
				cantidadEntrada:0,
				cantidadSalida:0 
			});
		}); 
		
		generacionObj.forEach(function(val1,index1){
			var entradas=val1.residuos;
			var enRango=fechaIncluidaEnRango(convertirFechaInput(val1.fecha),fechaInicio,fechaFin);
			if(enRango){
				entradas.forEach(function(val2,index2){
					if(val2.cliente.id==val.id){
						val.indicadorTipo.forEach(function(val3,index3){
							if(val3.id==val2.tipo.id ){
								val3.cantidadEntrada+=val2.cantidad;
							}; 
						});
					}  
				});
			} 
		});  
		
	});
	clientesIndicador.forEach(function(val,index){
		 
		var cantidadEntradaTotal=0;
		var textIn="";
		val.indicadorTipo.forEach(function(val1,index1){ 
			cantidadEntradaTotal+=val1.cantidadEntrada;
			textIn+="<td>"+formatNumberComaMilesKg(val1.cantidadEntrada)+"</td>"  
			});
		$("#divClientesTipoIndicador").find("table tbody")
		.append( "<tr id='rowcli"+val.id+"'>" +
				"<td>"+"<button onclick='removerClienteTotalRow("+index+")' class='btn btn-danger'><i class='fa fa-times'></i></button>"+"</td>"+
				"<td>" +
				"" +val.nombre+
				"</td>"+textIn+
				"<td id='tdtotalcli"+val.id+"'>"+formatNumberComaMilesKg(cantidadEntradaTotal)+ "</td>" +  
					"</tr>"); 
	});
	
	var listTotales=[];
	tipoResiduoIndicador.forEach(function(val1,index1){
		listTotales.push({cantidadEntrada:0,cantidadSalida:0})
	});
	var textResumenIn="",textParticipacion=""; 
	clientesIndicador.forEach(function(val,index){ 
		val.indicadorTipo.forEach(function(val1,index1){
			listTotales[index1].cantidadEntrada=listTotales[index1].cantidadEntrada+val1.cantidadEntrada
			listTotales[index1].cantidadSalida=listTotales[index1].cantidadSalida+val1.cantidadSalida
			});
	});
	var cantidadFinal=0;
	listTotales.forEach(function(val,index){
			textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadEntrada)+"</td>";
			cantidadFinal=cantidadFinal+val.cantidadEntrada;
	});
	clientesIndicador.forEach(function(val,index){
		 
		var cantidadEntradaTotal=0;
		val.indicadorTipo.forEach(function(val1,index1){
			cantidadEntradaTotal+=val1.cantidadEntrada;		
		});
		
		$("#divClientesTipoIndicador").find("table tbody #rowcli"+val.id)
		.append("<td  id='tdpartparc"+val.id+"'>"+
				pasarDecimalPorcentaje(cantidadEntradaTotal/cantidadFinal,2)+ "</td>" ); 
	});
	listTotales.forEach(function(val,index){
			textParticipacion+="<td>"+pasarDecimalPorcentaje(val.cantidadEntrada/cantidadFinal,2)+"</td>";
		
	});
	$("#divClientesTipoIndicador").find("table tbody")
	.append( "<tr style='border-top: 3px solid black' id='trfinaledi'>" +
			"<td></td>"+
			"<td> " +
			"TOTAL"  +
			"</td>"+textResumenIn+
			"<td>"    +formatNumberComaMilesKg(cantidadFinal)+ "</td>" + 
			"<td>100.00 %</td>"+
				"</tr>"+
				"<tr   id='trparticipacion'>" +
				"<td></td>"+
				"<td> " +
				"% de Participación"  +
				"</td>"+textParticipacion+
				"<td>"    +"100.00 %"+ "</td>" + 
					"</tr>"); 
	
	$("#divClientesTipoIndicador").find("table thead tr td").addClass("tb-acc");
	
}
function actualizarTablaEdificiosTotal(){
	$("#divEdificio").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	
	$("#divEdificio").find("table tbody tr").remove(); 
	tipoResiduoIndicador.forEach(function(val,index){
		val.cantidadEntrada=0;
		val.cantidadSalida=0;
		
	});
	empresasIndicador.forEach(function(val,index){
		val.indicadorTipo=[];
		
		tipoResiduoIndicador.forEach(function(val1,index1){
			val.indicadorTipo.push({
				id:val1.id,
				nombre:val1.nombre,
				cantidadEntrada:0,
				cantidadSalida:0 
			});
		}); 
		
		val.generacionResiduos.forEach(function(val1,index1){
			var entradas=val1.residuos;
			var enRango=fechaIncluidaEnRango(convertirFechaInput(val1.fecha),fechaInicio,fechaFin);
			if(enRango){
				entradas.forEach(function(val2,index2){
					val.indicadorTipo.forEach(function(val3,index3){
						if(val3.id==val2.tipo.id ){
							val3.cantidadEntrada+=val2.cantidad;
						};
						
					}); 
				});
			} 
		});
		val.transportistas.forEach(function(val1,index1){
			var manifiestos=val1.manifiestos;
			manifiestos.forEach(function(val2,index2){
				var salidas=val2.residuos;
				var enRango=fechaIncluidaEnRango(convertirFechaInput(val2.fechaSalida),fechaInicio,fechaFin);
				if(enRango){
					salidas.forEach(function(val3,index3){ 
						val.indicadorTipo.forEach(function(val4,index4){
							if(val4.id==val3.tipo.id ){
								val4.cantidadSalida+=val3.cantidad;
							};
							
						});
					});
				}
			});
		}); 
		
	});
	empresasIndicador.forEach(function(val,index){
		 
		var cantidadEntradaTotal=0,cantidadSalidaTotal=0;
		val.indicadorTipo.forEach(function(val1,index1){ 
			cantidadEntradaTotal+=val1.cantidadEntrada;
			cantidadSalidaTotal+=val1.cantidadSalida;
			});
		$("#divEdificio").find("table tbody")
		.append( "<tr id='rowedi"+val.empresaId+"'>" +
				"<td>"+"<button onclick='removerEdificioRow("+index+")' class='btn btn-danger'><i class='fa fa-times'></i></button>"+"</td>"+
				"<td>" +
				"" +val.name+
				"</td>"+
				"<td>"    +formatNumberComaMilesKg(cantidadEntradaTotal)+ "</td>" +
				 "<td>"    +formatNumberComaMilesKg(cantidadSalidaTotal)+ "</td>" +
				 "<td>"    +formatNumberComaMilesKg(cantidadEntradaTotal-cantidadSalidaTotal)+ "</td>" +
					"</tr>"); 
	});
}
function removerEdificioRow(pindex){
	var objEdificio=empresasIndicador[pindex];
	$("#rowedi"+objEdificio.empresaId).remove();
}
function removerClienteTotalRow(pindex){
	var objEdificio=clientesIndicador[pindex];
	$("#divClientesTipoIndicador #rowcli"+objEdificio.id).remove();
	
	clientesIndicador[pindex].isReporte=0;
	
	var listTotales=[];
	tipoResiduoIndicador.forEach(function(val1,index1){
		listTotales.push({cantidadEntrada:0,cantidadSalida:0,isReporte:val1.isReporte})
	});
	var textResumenIn="",textParticipacion=""; 
	clientesIndicador.forEach(function(val,index){
		if(val.isReporte==1){
		val.indicadorTipo.forEach(function(val1,index1){
			listTotales[index1].cantidadEntrada=listTotales[index1].cantidadEntrada+val1.cantidadEntrada
			});
		}
	});
	var cantidadFinal=0;
	listTotales.forEach(function(val,index){
		if(val.isReporte==1){
			textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadEntrada)+"</td>";
			cantidadFinal=cantidadFinal+val.cantidadEntrada;
		}
	});
	clientesIndicador.forEach(function(val,index){
		if(val.isReporte==1){
			var textFinal="",cantidadEntradaTotal=0;
			val.indicadorTipo.forEach(function(val1,index1){
				tipoResiduoIndicador.forEach(function(val2){
					if(val2.id==val1.id && val2.isReporte==1){
						cantidadEntradaTotal+=val1.cantidadEntrada;
					}
				});
			});
			textFinal=pasarDecimalPorcentaje(cantidadEntradaTotal/cantidadFinal,2);
			$("#rowcli"+val.id).find("#tdpartparc"+val.id).html(textFinal);
			
		}
		
	})
	listTotales.forEach(function(val,index){
		if(val.isReporte==1){
			textParticipacion+="<td>"+pasarDecimalPorcentaje(val.cantidadEntrada/cantidadFinal,2)+"</td>";
		}
	});
	$("#trfinaledi").remove();
	$("#trparticipacion").remove();
	$("#divClientesTipoIndicador").find("table tbody")
	.append( "<tr style='border-top: 3px solid black' id='trfinaledi'>" +
			"<td></td>"+
			"<td> " +
			"TOTAL"  +
			"</td>"+textResumenIn+
			"<td>"+formatNumberComaMilesKg(cantidadFinal)+ "</td>" + 
			"<td>100.00 %</td>"+
				"</tr>"+
				"<tr   id='trparticipacion'>" +
				"<td></td>"+
				"<td> " +
				"% de Participación"  +
				"</td>"+textParticipacion+
				"<td>"    +"100.00 %"+ "</td>" + 
					"</tr>"); 
}
function removerEdificioTotalRow(pindex,tipoId){
	var objEdificio=empresasIndicador[pindex];
	$("#divEdificioTipo #rowedi"+objEdificio.empresaId).remove();
	
	empresasIndicador[pindex].isReporte=0;
	
	var listTotales=[];
	tipoResiduoIndicador.forEach(function(val1,index1){
		listTotales.push({cantidadEntrada:0,cantidadSalida:0,isReporte:val1.isReporte})
	});
	var textResumenIn="",textParticipacion=""; 
	empresasIndicador.forEach(function(val,index){
		if(val.isReporte==1){
		val.indicadorTipo.forEach(function(val1,index1){
			listTotales[index1].cantidadEntrada=listTotales[index1].cantidadEntrada+val1.cantidadEntrada
			listTotales[index1].cantidadSalida=listTotales[index1].cantidadSalida+val1.cantidadSalida
			});
		}
	});
	var cantidadFinal=0;
	listTotales.forEach(function(val,index){
		if(val.isReporte==1){
			if(parseInt(tipoId)==1){
				textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadEntrada)+"</td>";
				cantidadFinal=cantidadFinal+val.cantidadEntrada
			}
			if(parseInt(tipoId)==2){
				textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadSalida)+"</td>";
				cantidadFinal=cantidadFinal+val.cantidadSalida
			}
		}
	});
	empresasIndicador.forEach(function(val,index){
		if(val.isReporte==1){
			var textFinal="",cantidadEntradaTotal=0,cantidadSalidaTotal=0;
			val.indicadorTipo.forEach(function(val1,index1){
				tipoResiduoIndicador.forEach(function(val2){
					if(val2.id==val1.id && val2.isReporte==1){
						cantidadEntradaTotal+=val1.cantidadEntrada;
						cantidadSalidaTotal+=val1.cantidadSalida;
					}
				});
			});
			if(parseInt(tipoId)==1){
				 textFinal=pasarDecimalPorcentaje(cantidadEntradaTotal/cantidadFinal,2);
			}
			if(parseInt(tipoId)==2){
				 textFinal=pasarDecimalPorcentaje(cantidadSalidaTotal/cantidadFinal,2);
			}
			$("#rowedi"+val.empresaId).find("#tdpartparc"+val.empresaId).html(textFinal);
			
		}
		
	})
	listTotales.forEach(function(val,index){
		if(val.isReporte==1){
			if(parseInt(tipoId)==1){
				textParticipacion+="<td>"+pasarDecimalPorcentaje(val.cantidadEntrada/cantidadFinal,2)+"</td>";
			}
			if(parseInt(tipoId)==2){
				textParticipacion+="<td>"+pasarDecimalPorcentaje(val.cantidadSalida/cantidadFinal,2)+"</td>";
			}
		}
	});
	$("#trfinaledi").remove();
	$("#trparticipacion").remove();
	$("#divEdificioTipo").find("table tbody")
	.append( "<tr style='border-top: 3px solid black' id='trfinaledi'>" +
			"<td></td>"+
			"<td> " +
			"TOTAL"  +
			"</td>"+textResumenIn+
			"<td>"+formatNumberComaMilesKg(cantidadFinal)+ "</td>" + 
			"<td>100.00 %</td>"+
				"</tr>"+
				"<tr   id='trparticipacion'>" +
				"<td></td>"+
				"<td> " +
				"% de Participación"  +
				"</td>"+textParticipacion+
				"<td>"    +"100.00 %"+ "</td>" + 
					"</tr>"); 
	
}
function eliminarColumnaTipoCliente(pindex){
$('#divClientesTipoIndicador td:nth-child('+(pindex+3)+')').hide();
	
	tipoResiduoIndicador[pindex].isReporte=0;
	
	var listTotales=[];
	tipoResiduoIndicador.forEach(function(val1,index1){
		listTotales.push({cantidadEntrada:0,cantidadSalida:0,isReporte:val1.isReporte})
	});
	var textResumenIn="",textParticipacion=""; 
	clientesIndicador.forEach(function(val,index){
		if(val.isReporte==1){
			var textFinal="",cantidadEntradaTotal=0;
			val.indicadorTipo.forEach(function(val1,index1){
				tipoResiduoIndicador.forEach(function(val2){
					if(val2.id==val1.id && val2.isReporte==1){
						cantidadEntradaTotal+=val1.cantidadEntrada;
						listTotales[index1].cantidadEntrada=listTotales[index1].cantidadEntrada+val1.cantidadEntrada
					}
				});
			});
			
				textFinal=formatNumberComaMilesKg(cantidadEntradaTotal);
			
			
			$("#rowcli"+val.id).find("#tdtotalcli"+val.id).remove();
			$("#rowcli"+val.id).find("#tdpartparc"+val.id).remove();
			$("#rowcli"+val.id).append("<td id='tdtotalcli"+val.id+"'>"+textFinal+ "</td>" )
		}
		
	});
	var cantidadFinal=0;
	listTotales.forEach(function(val,index){
		if(val.isReporte==1){
				textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadEntrada)+"</td>";
				cantidadFinal=cantidadFinal+val.cantidadEntrada;
		}
	});
	clientesIndicador.forEach(function(val,index){
		if(val.isReporte==1){
			var textFinal="",cantidadEntradaTotal=0;
			val.indicadorTipo.forEach(function(val1,index1){
				tipoResiduoIndicador.forEach(function(val2){
					if(val2.id==val1.id && val2.isReporte==1){
						cantidadEntradaTotal+=val1.cantidadEntrada;
					}
				});
			});
			textFinal=pasarDecimalPorcentaje(cantidadEntradaTotal/cantidadFinal,2);
			
			$("#rowcli"+val.id).append("<td id='tdpartparc"+val.id+"'>"+textFinal+ "</td>" )
		}
		
	})
	listTotales.forEach(function(val,index){
		if(val.isReporte==1){
			textParticipacion+="<td>"+pasarDecimalPorcentaje(val.cantidadEntrada/cantidadFinal,2)+"</td>";
		}
	});
	$("#trfinaledi").remove();
	$("#trparticipacion").remove();
	$("#divClientesTipoIndicador").find("table tbody")
	.append( "<tr style='border-top: 3px solid black' id='trfinaledi'>" +
			"<td></td>"+
			"<td> " +
			"TOTAL"  +
			"</td>"+textResumenIn+
			"<td>"+formatNumberComaMilesKg(cantidadFinal)+ "</td>" + 
			"<td>100.00 %</td>"+
				"</tr>"+
				"<tr   id='trparticipacion'>" +
				"<td></td>"+
				"<td> " +
				"% de Participación"  +
				"</td>"+textParticipacion+
				"<td>"    +"100.00 %"+ "</td>" + 
					"</tr>"); 
}
function eliminarColumnaTipo(pindex,tipoId){
	$('#divEdificioTipo td:nth-child('+(pindex+3)+')').hide();
	
	tipoResiduoIndicador[pindex].isReporte=0;
	
	var listTotales=[];
	tipoResiduoIndicador.forEach(function(val1,index1){
		
		listTotales.push({cantidadEntrada:0,cantidadSalida:0,isReporte:val1.isReporte})
	});
	var textResumenIn="",textParticipacion=""; 
	empresasIndicador.forEach(function(val,index){
		if(val.isReporte==1){
			var textFinal="",cantidadEntradaTotal=0,cantidadSalidaTotal=0;
			val.indicadorTipo.forEach(function(val1,index1){
				tipoResiduoIndicador.forEach(function(val2){
					if(val2.id==val1.id && val2.isReporte==1){
						cantidadEntradaTotal+=val1.cantidadEntrada;
						cantidadSalidaTotal+=val1.cantidadSalida;
						listTotales[index1].cantidadEntrada=listTotales[index1].cantidadEntrada+val1.cantidadEntrada
						listTotales[index1].cantidadSalida=listTotales[index1].cantidadSalida+val1.cantidadSalida
					
					}
				});
			});
			
			if(parseInt(tipoId)==1){
				textFinal=formatNumberComaMilesKg(cantidadEntradaTotal);
			}
			if(parseInt(tipoId)==2){
				textFinal=formatNumberComaMilesKg(cantidadSalidaTotal);
			}
			
			$("#rowedi"+val.empresaId).find("#tdtotalemp"+val.empresaId).remove();
			$("#rowedi"+val.empresaId).find("#tdpartparc"+val.empresaId).remove();
			$("#rowedi"+val.empresaId).append("<td id='tdtotalemp"+val.empresaId+"'>"+textFinal+ "</td>" )
		}
		
	});
	var cantidadFinal=0;
	listTotales.forEach(function(val,index){
		if(val.isReporte==1){
			if(parseInt(tipoId)==1){
				textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadEntrada)+"</td>";
				cantidadFinal=cantidadFinal+val.cantidadEntrada
			}
			if(parseInt(tipoId)==2){
				textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadSalida)+"</td>";
				cantidadFinal=cantidadFinal+val.cantidadSalida
			}
		}
	});
	empresasIndicador.forEach(function(val,index){
		if(val.isReporte==1){
			var textFinal="",cantidadEntradaTotal=0,cantidadSalidaTotal=0;
			val.indicadorTipo.forEach(function(val1,index1){
				tipoResiduoIndicador.forEach(function(val2){
					if(val2.id==val1.id && val2.isReporte==1){
						cantidadEntradaTotal+=val1.cantidadEntrada;
						cantidadSalidaTotal+=val1.cantidadSalida;
					}
				});
			});
			if(parseInt(tipoId)==1){
				 textFinal=pasarDecimalPorcentaje(cantidadEntradaTotal/cantidadFinal,2);
			}
			if(parseInt(tipoId)==2){
				 textFinal=pasarDecimalPorcentaje(cantidadSalidaTotal/cantidadFinal,2);
			}
			$("#rowedi"+val.empresaId).append("<td id='tdpartparc"+val.empresaId+"'>"+textFinal+ "</td>" )
		}
		
	})
	listTotales.forEach(function(val,index){
		if(val.isReporte==1){
			if(parseInt(tipoId)==1){
				textParticipacion+="<td>"+pasarDecimalPorcentaje(val.cantidadEntrada/cantidadFinal,2)+"</td>";
			}
			if(parseInt(tipoId)==2){
				textParticipacion+="<td>"+pasarDecimalPorcentaje(val.cantidadSalida/cantidadFinal,2)+"</td>";
			}
		}
	});
	$("#trfinaledi").remove();
	$("#trparticipacion").remove();
	$("#divEdificioTipo").find("table tbody")
	.append( "<tr style='border-top: 3px solid black' id='trfinaledi'>" +
			"<td></td>"+
			"<td> " +
			"TOTAL"  +
			"</td>"+textResumenIn+
			"<td>"+formatNumberComaMilesKg(cantidadFinal)+ "</td>" + 
			"<td>100.00 %</td>"+
				"</tr>"+
				"<tr   id='trparticipacion'>" +
				"<td></td>"+
				"<td> " +
				"% de Participación"  +
				"</td>"+textParticipacion+
				"<td>"    +"100.00 %"+ "</td>" + 
					"</tr>"); 
	
}
function actualizarTablaEdificiosPorTipo(tipoId){
	$("#divEdificioTipo").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	
	$("#divEdificioTipo").find("table tbody tr").remove();
	$("#divEdificioTipo").find("table thead tr td").remove();
	$("#divEdificioTipo").find("table thead tr")
	.append(
	"<td style='width:150px'><button onclick='actualizarTablaEdificiosPorTipo("+tipoId+")' "+
	"class='btn btn-success'><i class='fa fa-refresh'></i>Refresh </button></td>"+  		
	"<td style='width:280px'></td>");
	var nombreTipo="";
	switch(parseInt(tipoId)){
		case 1:
			nombreTipo="Generación";
			break;
		case 2:
			nombreTipo="Transporte";
			break;	
	}
	tipoResiduoIndicador.forEach(function(val,index){
		val.cantidadEntrada=0;
		val.cantidadSalida=0;
		val.isReporte=1;
		$("#divEdificioTipo").find("table thead tr")
		.append("<td style='width:130px'> <i onclick='eliminarColumnaTipo("+index+","+tipoId+")' class='fa fa-2x fa-times-circle'></i>   " +
				"<br>"   +val.nombre+"" +
						"<br><strong> "+nombreTipo+"</strong>"+ " (Kg)</td>"
				//+"<td>"   +val.nombre+"<br><strong>(Transporte)</strong>"+ "</td>"
				
				);
	});
	$("#divEdificioTipo").find("table thead tr")
	.append("<td  style='width:140px'>"+" "+nombreTipo+" Total"+ " (Kg)</td>"
			+"<td  style='width:140px'>"+"  % de Participación"+ "</td>"
			);
	empresasIndicador.forEach(function(val,index){
		val.indicadorTipo=[];
		val.isReporte=1;
		tipoResiduoIndicador.forEach(function(val1,index1){
			val.indicadorTipo.push({
				id:val1.id,
				nombre:val1.nombre,
				cantidadEntrada:0,
				cantidadSalida:0 
			});
		}); 
		
		val.generacionResiduos.forEach(function(val1,index1){
			var entradas=val1.residuos;
			var enRango=fechaIncluidaEnRango(convertirFechaInput(val1.fecha),fechaInicio,fechaFin);
			if(enRango){
				entradas.forEach(function(val2,index2){
					val.indicadorTipo.forEach(function(val3,index3){
						if(val3.id==val2.tipo.id ){
							val3.cantidadEntrada+=val2.cantidad;
						};
					});
				});
			} 
		});
		val.transportistas.forEach(function(val1,index1){
			var manifiestos=val1.manifiestos;
			manifiestos.forEach(function(val2,index2){
				var salidas=val2.residuos;
				var enRango=fechaIncluidaEnRango(convertirFechaInput(val2.fechaSalida),fechaInicio,fechaFin);
				if(enRango){
					salidas.forEach(function(val3,index3){ 
						val.indicadorTipo.forEach(function(val4,index4){
							if(val4.id==val3.tipo.id ){
								val4.cantidadSalida+=val3.cantidad;
							};
							
						});
					});
				}
			});
		}); 
		
	}); 
	empresasIndicador.forEach(function(val,index){
		 
		var cantidadEntradaTotal=0,cantidadSalidaTotal=0;
		var textIn="";
		val.indicadorTipo.forEach(function(val1,index1){
			cantidadEntradaTotal+=val1.cantidadEntrada;
			cantidadSalidaTotal+=val1.cantidadSalida;
			if(parseInt(tipoId)==1){
				textIn+="<td>"+formatNumberComaMilesKg(val1.cantidadEntrada)+"</td>" 
			}
			if(parseInt(tipoId)==2){
				textIn+="<td>"+formatNumberComaMilesKg(val1.cantidadSalida)+"</td>"
			}
			
			
			
			});
		var textFinal=""
		if(parseInt(tipoId)==1){
			 textFinal=formatNumberComaMilesKg(cantidadEntradaTotal);
		}
		if(parseInt(tipoId)==2){
			 textFinal=formatNumberComaMilesKg(cantidadSalidaTotal);
		}
		$("#divEdificioTipo").find("table tbody")
		.append( "<tr id='rowedi"+val.empresaId+"'>" +
				"<td>"+"<button onclick='removerEdificioTotalRow("+index+","+tipoId+")' class='btn btn-danger'><i class='fa fa-times'></i></button>"+"</td>"+
				"<td>" +val.name+"</td>"+
				textIn+
				"<td id='tdtotalemp"+val.empresaId+"'>"+textFinal+ "</td>" + 
					"</tr>"); 
	});
	var listTotales=[];
	tipoResiduoIndicador.forEach(function(val1,index1){
		listTotales.push({cantidadEntrada:0,cantidadSalida:0})
	});
	var textResumenIn="",textParticipacion=""; 
	empresasIndicador.forEach(function(val,index){ 
		val.indicadorTipo.forEach(function(val1,index1){
			listTotales[index1].cantidadEntrada=listTotales[index1].cantidadEntrada+val1.cantidadEntrada
			listTotales[index1].cantidadSalida=listTotales[index1].cantidadSalida+val1.cantidadSalida
			});
	});
	var cantidadFinal=0;
	listTotales.forEach(function(val,index){
		if(parseInt(tipoId)==1){
			textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadEntrada)+"</td>";
			cantidadFinal=cantidadFinal+val.cantidadEntrada
		}
		if(parseInt(tipoId)==2){
			textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadSalida)+"</td>";
			cantidadFinal=cantidadFinal+val.cantidadSalida
		}
	});
	empresasIndicador.forEach(function(val,index){
		 
		var cantidadEntradaTotal=0,cantidadSalidaTotal=0;
		val.indicadorTipo.forEach(function(val1,index1){
			cantidadEntradaTotal+=val1.cantidadEntrada;
			cantidadSalidaTotal+=val1.cantidadSalida;			
		});
		var textFinal=""
		if(parseInt(tipoId)==1){
			 textFinal=pasarDecimalPorcentaje(cantidadEntradaTotal/cantidadFinal,2);
		}
		if(parseInt(tipoId)==2){
			 textFinal=pasarDecimalPorcentaje(cantidadSalidaTotal/cantidadFinal,2);
		}
		$("#divEdificioTipo").find("table tbody #rowedi"+val.empresaId)
		.append("<td  id='tdpartparc"+val.empresaId+"'>"+textFinal+ "</td>" ); 
	});
	listTotales.forEach(function(val,index){
		if(parseInt(tipoId)==1){
			textParticipacion+="<td>"+pasarDecimalPorcentaje(val.cantidadEntrada/cantidadFinal,2)+"</td>";
		}
		if(parseInt(tipoId)==2){
			textParticipacion+="<td>"+pasarDecimalPorcentaje(val.cantidadSalida/cantidadFinal,2)+"</td>";
		}
	});
	$("#divEdificioTipo").find("table tbody")
	.append( "<tr style='border-top: 3px solid black' id='trfinaledi'>" +
			"<td></td>"+
			"<td> " +
			"TOTAL"  +
			"</td>"+textResumenIn+
			"<td>"    +formatNumberComaMilesKg(cantidadFinal)+ "</td>" + 
			"<td>100.00 %</td>"+
				"</tr>"+
				"<tr   id='trparticipacion'>" +
				"<td></td>"+
				"<td> " +
				"% de Participación"  +
				"</td>"+textParticipacion+
				"<td>"    +"100.00 %"+ "</td>" + 
					"</tr>"); 
	$("#divEdificioTipo").find("table thead tr td").addClass("tb-acc");
	
}
function actualizarTablaDiaPorTipo(){
	$("#divDiaTipo").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	
	$("#divDiaTipo").find("table tbody tr").remove();
	$("#divDiaTipo").find("table thead tr td").remove();
	$("#divDiaTipo").find("table thead tr").append("<td></td>");
	tipoResiduoIndicador.forEach(function(val,index){
		val.cantidadEntrada=0;
		val.cantidadSalida=0;
		if(val.clasificacion.id==1){
		$("#divDiaTipo").find("table thead tr")
		.append("<td>"   +val.nombre+"<br><strong> (Generación)</strong>"+ " (Kg)</td>"  
				);
			if(val.id==4){
				$("#divDiaTipo").find("table thead tr")
				.append("<td>"   +"Aprovechables"+"<br><strong> (Generación)</strong>"+ " (Kg)</td>"  
						);
			}
		}
	});
	$("#divDiaTipo").find("table thead tr")
	.append("<td>"+" Generación Total"+ " (Kg)</td>");
	var listFechas=hallarFechasPeriodoIndicador("1");
	listFechas.forEach(function(val){
		val.indicadorTipo=[];
		
		tipoResiduoIndicador.forEach(function(val1,index1){
			if(val1.clasificacion.id==1){
				val.indicadorTipo.push({
					id:val1.id,
					nombre:val1.nombre,
					cantidadEntrada:0,
					cantidadSalida:0 
				});
			}
		});
		generacionObj.forEach(function(val1,index1){
			var entradas=val1.residuos;
			if(val1.fechaTexto==val.nombre){
				entradas.forEach(function(val2,index2){
						val.indicadorTipo.forEach(function(val3,index3){
							if(val3.id==val2.tipo.id ){
								val3.cantidadEntrada+=val2.cantidad;
							}; 
						});
					  
				});
			}
		}); 
	});
	listFechas.forEach(function(val,index){
		 
		var cantidadEntradaTotal=0;
		var textIn="";
		val.indicadorTipo.forEach(function(val1,index1){ 
			cantidadEntradaTotal+=val1.cantidadEntrada;
			textIn+="<td>"+formatNumberComaMilesKg(val1.cantidadEntrada)+"</td>" 
			if(val1.id==4){
				textIn+="<td style='border-left: 4px solid #2e9e8f;'>"+formatNumberComaMilesKg(val.indicadorTipo[0].cantidadEntrada+
						val.indicadorTipo[1].cantidadEntrada+
						val.indicadorTipo[2].cantidadEntrada+val.indicadorTipo[3].cantidadEntrada)+"</td>" 
			}
		});
		$("#divDiaTipo").find("table tbody")
		.append( "<tr>" +
				"<td>" +
				"" +val.nombre+
				"</td>"+textIn+
				"<td>"    +formatNumberComaMilesKg(cantidadEntradaTotal)+ "</td>" +  
					"</tr>"); 
	});
	var listTotales=[];
	tipoResiduoIndicador.forEach(function(val1,index1){
		if(val1.clasificacion.id==1){
		listTotales.push({id:val1.id,cantidadEntrada:0,cantidadSalida:0})
		}
	});
	var textResumenIn="";
	var textResumenPorc="";
	listFechas.forEach(function(val,index){ 
		val.indicadorTipo.forEach(function(val1,index1){
			listTotales[index1].cantidadEntrada=listTotales[index1].cantidadEntrada+val1.cantidadEntrada
			listTotales[index1].cantidadSalida=listTotales[index1].cantidadSalida+val1.cantidadSalida
			});
	});
	var cantidadFinal=0;
	listTotales.forEach(function(val,index){
			textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadEntrada)+"</td>";
			cantidadFinal=cantidadFinal+val.cantidadEntrada;
			if(val.id==4){
				textResumenIn+="<td style='border-left: 4px solid #2e9e8f;'>"+formatNumberComaMilesKg(listTotales[0].cantidadEntrada+
						listTotales[1].cantidadEntrada+
						listTotales[2].cantidadEntrada+listTotales[3].cantidadEntrada)+"</td>";
				
			}
		
	});
	listTotales.forEach(function(val,index){
		textResumenPorc+="<td>"+pasarDecimalPorcentaje(val.cantidadEntrada/cantidadFinal,2)+"</td>";
		if(val.id==4){
			textResumenPorc+="<td style='border-left: 4px solid #2e9e8f;'>"+pasarDecimalPorcentaje(
			(listTotales[0].cantidadEntrada+
					listTotales[1].cantidadEntrada+
					listTotales[2].cantidadEntrada+listTotales[3].cantidadEntrada)/cantidadFinal ,2) +"</td>";
			
		}
	
});
	$("#divDiaTipo").find("table tbody")
	.append( "<tr style='border-top: 3px solid black' >" +
			"<td> " +
			"TOTAL"  +
			"</td>"+textResumenIn+
			"<td>"    +formatNumberComaMilesKg(cantidadFinal)+ "</td>" + 
				"</tr>"+
				"<tr   >" +
				"<td> " +
				"TOTAL %"  +
				"</td>"+textResumenPorc+
				"<td>"    +"100%"+ "</td>" + 
					"</tr>"); 
	
	$("#divDiaTipo").find("table thead tr td").addClass("tb-acc");
}
function actualizarTablaMesPorTipo(){
	$("#divMesTipo").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	
	$("#divMesTipo").find("table tbody tr").remove();
	$("#divMesTipo").find("table thead tr td").remove();
	$("#divMesTipo").find("table thead tr").append("<td></td>");
	tipoResiduoIndicador.forEach(function(val,index){
		val.cantidadEntrada=0;
		val.cantidadSalida=0;
		if(val.clasificacion.id==1){
		$("#divMesTipo").find("table thead tr")
		.append("<td>"   +val.nombre+"<br><strong> (Generación)</strong>"+ " (Kg)</td>"  
				);
			if(val.id==20){
				$("#divMesTipo").find("table thead tr")
				.append("<td>"   +"Aprovechables"+"<br><strong> (Generación)</strong>"+ " (Kg)</td>"  
						);
			}
		}
	});
	$("#divMesTipo").find("table thead tr")
	.append("<td>"+" Generación Total"+ " (Kg)</td>" 
			);
	var listFechas=hallarFechasPeriodoIndicador("3");
	listFechas.forEach(function(val){
		val.indicadorTipo=[];
		
		tipoResiduoIndicador.forEach(function(val1,index1){
			if(val1.clasificacion.id==1){
				val.indicadorTipo.push({
					id:val1.id,
					nombre:val1.nombre,
					cantidadEntrada:0,
					cantidadSalida:0 
				});
			}
		});
		generacionObj.forEach(function(val1,index1){
			var entradas=val1.residuos;
			var arrFecha=val1.fechaTexto.split("-");
			var arrComparar=val.nombre.split("-");
			
			
			
			if(arrFecha[2]==arrComparar[0] && arrComparar[1] == arrFecha[1]){
				entradas.forEach(function(val2,index2){
						val.indicadorTipo.forEach(function(val3,index3){
							if(val3.id==val2.tipo.id ){
								val3.cantidadEntrada+=val2.cantidad;
							}; 
						});
					  
				});
			}
		}); 
	});
	listFechas.forEach(function(val,index){
		 
		var cantidadEntradaTotal=0;
		var textIn="";
		val.indicadorTipo.forEach(function(val1,index1){ 
			cantidadEntradaTotal+=val1.cantidadEntrada;
			textIn+="<td>"+formatNumberComaMilesKg(val1.cantidadEntrada)+"</td>" 
			if(val1.id==20){
				textIn+="<td style='border-left: 4px solid #2e9e8f;'>"+formatNumberComaMilesKg(val.indicadorTipo[0].cantidadEntrada+
						val.indicadorTipo[1].cantidadEntrada+
						val.indicadorTipo[2].cantidadEntrada+val.indicadorTipo[3].cantidadEntrada+
						val.indicadorTipo[4].cantidadEntrada)+"</td>" 
			}
		});
		$("#divMesTipo").find("table tbody")
		.append( "<tr>" +
				"<td>" +
				"" +val.nombre+
				"</td>"+textIn+
				"<td>"    +formatNumberComaMilesKg(cantidadEntradaTotal)+ "</td>" +  
					"</tr>"); 
	});
	var listTotales=[];
	tipoResiduoIndicador.forEach(function(val1,index1){
		if(val1.clasificacion.id==1){
		listTotales.push({id:val1.id,nombre:val1.nombre,cantidadEntrada:0,cantidadSalida:0})
		}
	});
	var textResumenIn="";
	var textResumenPorc="";
	listFechas.forEach(function(val,index){ 
		val.indicadorTipo.forEach(function(val1,index1){
			listTotales[index1].cantidadEntrada=listTotales[index1].cantidadEntrada+val1.cantidadEntrada
			listTotales[index1].cantidadSalida=listTotales[index1].cantidadSalida+val1.cantidadSalida
			});
	});
	var cantidadFinal=0;
	listTotales.forEach(function(val,index){
			textResumenIn+="<td>"+formatNumberComaMilesKg(val.cantidadEntrada)+"</td>";
			cantidadFinal=cantidadFinal+val.cantidadEntrada;
			if(val.id==20){
				textResumenIn+="<td style='border-left: 4px solid #2e9e8f;'>"+formatNumberComaMilesKg(listTotales[0].cantidadEntrada+
						listTotales[1].cantidadEntrada+
						listTotales[2].cantidadEntrada+listTotales[3].cantidadEntrada
						+listTotales[4].cantidadEntrada)+"</td>";
				
			}
		
	});
	listTotales.forEach(function(val,index){
		textResumenPorc+="<td>"+pasarDecimalPorcentaje(val.cantidadEntrada/cantidadFinal,2)+"</td>";
		if(val.id==20){
			textResumenPorc+="<td style='border-left: 4px solid #2e9e8f;'>"+pasarDecimalPorcentaje(
			(listTotales[0].cantidadEntrada+
					listTotales[1].cantidadEntrada+
					listTotales[2].cantidadEntrada+listTotales[3].cantidadEntrada
					+listTotales[4].cantidadEntrada)/cantidadFinal ,2) +"</td>";
			
		}
	
});
	$("#divMesTipo").find("table tbody")
	.append( "<tr style='border-top: 3px solid black' >" +
			"<td> " +
			"TOTAL"  +
			"</td>"+textResumenIn+
			"<td>"    +formatNumberComaMilesKg(cantidadFinal)+ "</td>" + 
				"</tr>"+
				"<tr   >" +
				"<td> " +
				"TOTAL %"  +
				"</td>"+textResumenPorc+
				"<td>"    +"100%"+ "</td>" + 
					"</tr>"); 
	
	$("#divMesTipo").find("table thead tr td").addClass("tb-acc");
	verGraficoMesCambio(listTotales,listFechas);
	$("#btnGraphIndicadores").remove();
}
function verGraficoMesCambio(listTotales,listFechas){
	// Make monochrome colors
	var pieColors = (function () {
	    var colors = [],
	        base = Highcharts.getOptions().colors[0],
	        i;

	    for (i = 0; i < 10; i += 1) {
	        // Start out with a darkened base color (negative brighten), and end
	        // up with a much brighter color
	        colors.push(Highcharts.Color(base).brighten((i*2 - 3) / 7).get());
	    }
	    return colors;
	}());
	var nombreNoLocatario="";
	var items = $("#selNoLocatario option:selected").map(function() {
	    return $(this).text();
	}).get();
	if(items.length>0){
		nombreNoLocatario=" (Excepto: "+items.join(", ")+" )";
	}
	var dataGraph=[{name:"Aprovechables",data:[], color:"#a9d18e"},
	               {name:tipoResiduoIndicador[4].nombre,data:[]  , color:"#7f7f7f"},
	               {name:tipoResiduoIndicador[5].nombre,data:[]  , color:"#7f6000"}];
	// Build the chart
	Highcharts.chart('containerGraphMes', {
	    chart: {
	        plotBackgroundColor: null,
	        plotBorderWidth: null,
	        plotShadow: false,
	        type: 'pie'
	    },
	    title: {
	        text: 'Distribución RR. SS. '+ $( "#selCliInd option:selected" ).text()
	    },
	    tooltip: {
	        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	    },
	    plotOptions: {
	        pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            colors: [dataGraph[0].color,dataGraph[1].color,dataGraph[2].color],
	            dataLabels: {
	                enabled: true,
	                format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
	                distance: -50,
	                filter: {
	                    property: 'percentage',
	                    operator: '>',
	                    value: 4
	                }
	            }
	        }
	    },
	    series: [{
	        name: 'Tipos de residuo',
	        data: [
	{ name: "Aprovechables", y: listTotales[0].cantidadEntrada+listTotales[1].cantidadEntrada+listTotales[2].cantidadEntrada+listTotales[3].cantidadEntrada },
	               { name: listTotales[4].nombre, y: listTotales[4].cantidadEntrada },
		            { name: listTotales[5].nombre, y: listTotales[5].cantidadEntrada }
	        ]
	    }]
	});

	//dataGraph=[{name:"Aprovechables",data:[], color:pieColors[0]},
    //          {name:tipoResiduoIndicador[4].nombre,data:[]  , color:pieColors[1]},
    //          {name:tipoResiduoIndicador[5].nombre,data:[]  , color:pieColors[2]}];
	listFechas.forEach(function(val){
		dataGraph[0].data.push((val.indicadorTipo[0].cantidadEntrada
				+val.indicadorTipo[1].cantidadEntrada
				+val.indicadorTipo[2].cantidadEntrada
			     +val.indicadorTipo[3].cantidadEntrada));
		dataGraph[1].data.push(val.indicadorTipo[4].cantidadEntrada)
		dataGraph[2].data.push(val.indicadorTipo[5].cantidadEntrada)
		  
		
	});
	var categorias=[];
	listFechas.forEach(function(val){
		categorias.push(val.nombre+" ");
	});
	Highcharts.chart('containerBarMes', {
		chart: {
	        type: 'line'
	    },
	    title: {
	        text: 'Comportamiento RR. SS. '+ $( "#selCliInd option:selected" ).text()
	    },

	    subtitle: {
	        text: ''
	    },
	    xAxis: {
	        categories: categorias
	    },
	    yAxis: {
	        title: {
	            text: 'Cantidad (Kg)'
	        }
	    },
	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'middle'
	    },

	    tooltip: {
	        pointFormat: '{series.name}: {point.y:.2f} Kg<br>',
	        shared: true
	    },
	    plotOptions: {
	    	
	        series: {
	        	dataLabels: {
	        		format: '{point.y:.2f} Kg<br>',
	                enabled: true
	            }
	        }
	    },

	    series:  dataGraph

	})
}
function hallarFechasPeriodoIndicador(tipoPeriodo){
var fechaInicio=$("#fechaInicioStock").val();
var fechaFin=$("#fechaFinStock").val();
	var fecha1=fechaInicio.split('-');
	var fecha2=fechaFin.split('-');
	var difanio= fecha2[0]-fecha1[0]+1;
	var difDias=restaFechas(fechaInicio,fechaFin);
	var listfecha=[];
	
	switch(tipoPeriodo){
	case "3":
		
		for (index =0; index <difanio; index++) {
			var anioaux=parseInt(index)+parseInt(fecha1[0]);
			var textFecha="";
			if(difanio>1){
				if(index==0){
					for(index1 =0; index1 < 12-fecha1[1]+1; index1++) {
						
						var mesaux=parseInt(index1)+parseInt(fecha1[1]);
						textFecha=(anioaux+"-"+((''+mesaux).length<2 ? '0' : '') + mesaux );
						listfecha.push({nombre:textFecha})
						}
				}
				if(index==difanio-1){
					for(index4=0;index4<parseInt(fecha2[1]);index4++){
						var mesaux3=parseInt(index4)+parseInt("1");
						textFecha=(anioaux+"-"+((''+mesaux3).length<2 ? '0' : '') + mesaux3 );
						listfecha.push({nombre:textFecha})
					}
							}	
				
				if(index>0 && index <difanio-1 ){
						
						for(index3 =0;index3 <12;index3++){
							var mesaux2=parseInt(index3)+1;	
							textFecha=(anioaux+"-"+((''+mesaux2).length<2 ? '0' : '') + mesaux2 );
							listfecha.push({nombre:textFecha})
						}
						
						
					}
					
			}else{
				for(index5 =0; index5 < fecha2[1]-fecha1[1]+1; index5++) {
					
					var mesaux4=parseInt(index5)+parseInt(fecha1[1]);
					textFecha=(anioaux+"-"+((''+mesaux4).length<2 ? '0' : '') + mesaux4 );
					listfecha.push({nombre:textFecha})
					}
				
			}
			
			

			
		};
		break;
		
	case "1":
		for(index=0;index<=difDias;index++){
			var fecha=sumaFechaDias(index,fechaInicio).split("-");
			listfecha.push({nombre:fecha[2]+"-"+fecha[1]+"-"+fecha[0] })
		}
		break;
	case "2":
		
		var fechaInicioUTC=obtenerUTCDateFromInput(fechaInicio);
		var fechaFinUTC=obtenerUTCDateFromInput(fechaFin);
		var diasInicio=fechaInicioUTC.getUTCDay();
		if(diasInicio==0){
			diasInicio=7;
		}
		var diasFin=fechaFinUTC.getUTCDay();
		if(diasFin==0){
			diasFin=7;
		}
		var fechaInicioSemana=sumaFechaDias(1+(diasInicio*-1),fechaInicio);
		var fechaFinSemana=sumaFechaDias(6-diasFin,fechaFin);
		
		var difDiasSemana=restaFechas(fechaInicioSemana,fechaFinSemana)+1;
		var numSemanas=Math.ceil(difDiasSemana/7);
		for(index=0;index<numSemanas;index++){
			
			listfecha.push(
					sumaFechaDias2((index*7),fechaInicioSemana)+
					"-<br>"+ sumaFechaDias2(((index+1)*7)-1,fechaInicioSemana))
		}
		break;
	
	}
	
	
	return listfecha;
	
}
function formatNumberComaMiles(numero) {
	return (numero.toLocaleString("en-US",{minimumFractionDigits: 2, maximumFractionDigits: 2})+"");
}
function formatNumberComaMilesKg(numero) {
	if(numero==0){
		return "-";
	}
	return (numero.toLocaleString("en-US",{minimumFractionDigits: 2, maximumFractionDigits: 2})+"");
}
function actualizarTablaStock(){
	 var residuosTotal=[];
	$("#divStock").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	generacionObj.forEach(function(val,index){
		var entradas=val.residuos;
		var enRango=fechaIncluidaEnRango(convertirFechaInput(val.fecha),fechaInicio,fechaFin);
		entradas.forEach(function(val1,index1){
			residuosTotal.forEach(function(v,i){
				if(v.tipo.id==val1.tipo.id  && enRango){
					v.cantidadEntrada+=val1.cantidad;
				}
			}); 
			var incluido=false;
			residuosTotal.forEach(function(v,i){
				if(v.tipo.id==val1.tipo.id  ){
					incluido=true;
				}
			});
			if(!incluido){
				val1.clasificacion=val.clasificacion;
				
				val1.cantidadEntrada=val1.cantidad;
				if(!enRango){
					val1.cantidadEntrada=0;	
				}
				val1.cantidadSalida=0;
				residuosTotal.push(val1);
			}
			
			 
		});
	});
	transportistasObj.forEach(function(val,index){
		var manifiestos=val.manifiestos;
		manifiestos.forEach(function(val1,index1){
			var salidas=val1.residuos;
			var enRango=fechaIncluidaEnRango(convertirFechaInput(val1.fechaSalida),fechaInicio,fechaFin);
			 
			salidas.forEach(function(val2,index2){
				residuosTotal.forEach(function(v,i){
					if(v.tipo.id==val2.tipo.id  && enRango){
						
						v.cantidadSalida+=val2.cantidad;
					}
				}); 
				var incluido=false;
				residuosTotal.forEach(function(v,i){
					if(v.tipo.id==val2.tipo.id ){
						incluido=true;
					}
				});
				if(!incluido){
					val2.clasificacion=val1.clasificacion;
					val2.cantidadSalida=val2.cantidad;
					if(!enRango){
						val2.cantidadSalida=0;	
					}
					val2.cantidadEntrada=0;
					residuosTotal.push(val2);
				}
				
			});
		});
	}); 
	residuosTotal.forEach(function(val,index){ 
		$("#divStock").find("table tbody").append(
				"<tr  >" +
				"<td  >"+val.clasificacion.nombre+"</td>" 
				+"<td  >"+val.tipo.nombre+"</td>"
				+"<td>"+formatNumberComaMilesKg(val.cantidadEntrada)+"</td>"
				+"<td>"+formatNumberComaMilesKg(val.cantidadSalida)+"</td>"
				+"<td>"+formatNumberComaMilesKg((val.cantidadEntrada-val.cantidadSalida))+"</td>"
				+"</tr>");
	});
}
function actualizarTablaCostoTrans(){
	 var residuosTotal=[];
	$("#divCostoTrans").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	transportistasObj.forEach(function(val,index){
		var manifiestos=val.manifiestos;
		val.costoAcumulado=0;
		manifiestos.forEach(function(val1,index1){
			var salidas=val1.residuos;
			var enRango=fechaIncluidaEnRango(convertirFechaInput(val1.fechaSalida),fechaInicio,fechaFin);
			if(  enRango){
				
				val.costoAcumulado+=val1.costo;
			}
			 
		});
	});
	 
	transportistasObj.forEach(function(val,index){
		
		$("#divCostoTrans").find("table tbody").append(
				"<tr  >" +
				"<td  >"+val.nombre+"</td>"  
				+"<td>"+formatNumberComaMiles(val.costoAcumulado)+"</td>" 
				+"</tr>");
	});
}
function actualizarTablaGeneracionPer(){
	var residuosTotal=[];
	$("#divGenePer").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	generacionObj.forEach(function(val,index){
		var entradas=val.residuos;
		var enRango=fechaIncluidaEnRango(convertirFechaInput(val.fecha),fechaInicio,fechaFin);
		entradas.forEach(function(val1,index1){
			residuosTotal.forEach(function(v,i){
				if(v.tipo.id==val1.tipo.id && enRango){
					v.cantidadEntrada+=(val1.cantidad/val1.clasificacion.aforo);
				}
			}); 
			var incluido=false;
			residuosTotal.forEach(function(v,i){
				if(v.tipo.id==val1.tipo.id  ){
					incluido=true;
				}
			});
			if(!incluido){
				val1.clasificacion.id=val.clasificacion.id;
				val1.cantidadEntrada=val1.cantidad/val1.clasificacion.aforo;
				if(!enRango){
					val1.cantidadEntrada=0;	
				}
				val1.cantidadSalida=0;
				residuosTotal.push(val1);
			}
			
			 
		});
	});
 var difFechas=restaFechas(fechaInicio,fechaFin);
	residuosTotal.forEach(function(val,index){
		$("#divGenePer").find("table tbody").append(
				"<tr  >" 
				+"<td  >"+val.tipo.nombre+"</td>"
				+"<td>"+pasarDecimalValor(val.cantidadEntrada/difFechas )+"</td>" 
				+"</tr>");
	});
	
	
	
}
function actualizarTablaGeneracionTotal(){
	var residuosTotal=[];
	$("#divGeneTotal").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	generacionObj.forEach(function(val,index){
		var entradas=val.residuos;
		var enRango=fechaIncluidaEnRango(convertirFechaInput(val.fecha),fechaInicio,fechaFin);
		entradas.forEach(function(val1,index1){
			residuosTotal.forEach(function(v,i){
				if(v.tipo.id==val1.tipo.id && enRango){
					v.cantidadEntrada+=(val1.cantidad);
				}
			}); 
			var incluido=false;
			residuosTotal.forEach(function(v,i){
				if(v.tipo.id==val1.tipo.id  ){
					incluido=true;
				}
			});
			if(!incluido){
				val1.clasificacion=val.clasificacion;
				val1.cantidadEntrada=val1.cantidad;
				if(!enRango){
					val1.cantidadEntrada=0;	
				}
				val1.cantidadSalida=0;
				residuosTotal.push(val1);
			}
			
			 
		});
	});
 
	residuosTotal.forEach(function(val,index){
		
		$("#divGeneTotal").find("table tbody").append(
				"<tr  >" 
				+"<td  >"+val.tipo.nombre+"</td>"
				+"<td>"+pasarDecimalValor(val.cantidadEntrada/1000 )+"</td>" 
				+"</tr>");
	});
	
	
	
}
function actualizarTablaEtapaSalida(){
	 var residuosTotal=[];
	 var tablaBody=$("#divEtapaSalida").find("table tbody");
	 var tablaHead=$("#divEtapaSalida").find("table thead tr");
		$("#divEtapaSalida").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	 //
	tablaHead.html("<td class='tb-acc'></td>")
	tipoResiduoIndicador.forEach(function(val){
		tablaHead.append("<td  class='tb-acc'>  "+val.nombre+"</td>")
	})
	etapasIndicador.forEach(function(val,index){
		val.indicadorTipo=[];
		val.isReporte=1;
		tablaBody.append("<tr  id='trEtapa"+val.id+"'>" +
				"<td  >"+val.nombre+"</td>"
				+"</tr>");
		tipoResiduoIndicador.forEach(function(val1,index1){
			val.indicadorTipo.push({
				id:val1.id,
				nombre:val1.nombre,
				cantidadEntrada:0,
				cantidadSalida:0 
			});
		});
	});
	etapasIndicador.forEach(function(val,index){
		  
		val.indicadorTipo.forEach(function(val1){
			transportistasObj.forEach(function(val2,index2){
				var manifiestos=val2.manifiestos;
				manifiestos.forEach(function(val3,index4){
					if(val3.etapa.id == val.id){
						var salidas=val3.residuos;
						salidas.forEach(function(val4,index4){
							if(val4.tipo.id==val1.id){
								val1.cantidadSalida=val1.cantidadSalida+val4.cantidad
							}
							
						});
					}
				})
			})
			
		$("#trEtapa"+val.id).append("<td>"+formatNumberComaMilesKg(val1.cantidadSalida)+"</td>")
		});
	})
	 
	// 
	
}
function actualizarTablaClasificacionTotal(){
	var residuosTotal=[];
	$("#divClasif").find("table tbody tr").remove();
	var fechaInicio=$("#fechaInicioStock").val();
	var fechaFin=$("#fechaFinStock").val();
	generacionObj.forEach(function(val,index){ 
		var incluido=false;
		residuosTotal.forEach(function(v,i){
			if(v.clasificacion.id==val.clasificacion.id  ){
				incluido=true;
			}
		});
		if(!incluido){
			val.cantidadEntrada=0;
			
			val.cantidadSalida=0;
			residuosTotal.push(val);
		}
	});
	generacionObj.forEach(function(val,index){
		var entradas=val.residuos;
		var enRango=fechaIncluidaEnRango(convertirFechaInput(val.fecha),fechaInicio,fechaFin);
		residuosTotal.forEach(function(v,i){
			if(v.clasificacion.id==val.clasificacion.id  ){ 
			
				entradas.forEach(function(val1,index1){
				if(enRango){
					v.cantidadEntrada+=(val1.cantidad);
				}
			
			
				});
			}
		});  
	});
	residuosTotal.forEach(function(val,index){
		
		$("#divClasif").find("table tbody").append(
				"<tr  >" 
				+"<td  >"+val.clasificacion.nombre+"</td>"
				+"<td>"+pasarDecimalValor(val.cantidadEntrada/1000 )+"</td>" 
				+"</tr>");
	});
	
	
	
}