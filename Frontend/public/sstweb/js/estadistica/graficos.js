var width;
	var height;
var graficoId;
$(function(){
	
	cargarGraficos();
	$("#paramMdfGraf").hide();
	$("#graficoOpcionesLista li").each(function(index){
		$(this).attr("onclick","verAcordeTipoGrafico("+(index+1)+")")
	});
	$("#opcionesGrafico").on("change",function(){
		console.log("dsni");
		var esc=$("#opcionesGrafico").css("display");console.log(esc);
	})
})

function verAcordeTipoGrafico(grafId){
	$("#paramMdfGraf").hide();
	
var widthAux=parseInt($('#graficoOpcionesLista li').width()+20, 10);
	
	$("#divFlechaGraf").css({
	});
	$("#divFlechaFondoGraf").css({
	});
	if(graficoId!=grafId){
		$('#graficoOpcionesLista li').each(function(index,ele){
			$(ele).removeClass("active");
			if(index==grafId-1){ 
				$(ele).toggleClass("active");
				
			}
		});
		$("#opcionesGrafico").show("fast",function(){
			$("#graficoEst div").remove();
			$("#graficoEst select").remove();
	 
			
		});
		
	}else{
		$('#graficoOpcionesLista li').each(function(index,ele){
			$(ele).removeClass("active");
			 
		}); 
		
		$("#opcionesGrafico").toggle();
	}
	graficoId=grafId;
	
	
	switch(parseInt(graficoId)){

	case 1:
		
		break;
	case 2:

		break;
	case 3:
		
		break;
	case 4:
	
		break;
	case 5:
		
		break;
case 6:
	llamarUnidadesGrafico();
	$("#paramMdfGraf").show();
		break;
case 7:
	llamarUnidadesGrafico();
	$("#paramMdfGraf").show();
		break;
case 8:
	break;
case 9:
	llamarUnidadesGrafico();
	$("#paramMdfGraf").show();
		break;
	}
			
	
}
function llamarUnidadesGrafico(){

var dataParam = {
			companyId : sessionStorage.getItem("gestopcompanyid"),
			
			
			};

		callAjaxPostNoLoad(URL + '/estadistica/parametro/unidad', dataParam,
				procesarLlamadaUnidadesGraf);
	
}



function procesarLlamadaUnidadesGraf(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		
		 listaUnidades=data.unidades;
		var funcionUnidad=""
	if (filtrarPuestos){
		funcionUnidad="llamarDivisiones()";
	}
		if(filtrarIperc){
			funcionUnidad="llamarIpercs()";
		}
		var selUnidad=crearSelectOneMenuY("selUnidadGraf",funcionUnidad,listaUnidades,""
				,"mdfId","mdfTipoId","mdfNombre");
		$("#paramMdfGraf").show();
			$("#paramSelMdfGraf").html(selUnidad);
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}
	
	
}
function cargarGraficos(){
	
	$("#tabEstadisticoPanel").attr("onclick","cambiarSegunTab(1)")
	$("#tabGraficoPanel").attr("onclick","cambiarSegunTab(2)")
	
}

function cambiarSegunTab(tabId){
	$("table").hide();
	$("#estadisticaPanel").hide();
	$("#graficoPanel").hide();
	$("#btnClipTabla").hide(); 
	$("#btnReporteEpp").hide(); 
	switch(tabId){
	case 1:
		$("#graficoEst div").remove();
		$("#graficoEst select").remove();
		$("#verGrafico").show();
		$("#estadisticaPanel").show();
		$('#mdParametrosEstad').on('hidden.bs.modal', function(e) {
			crearTablaEstadística();
			$("#graficoEst").html("");
			 
		});
		break;
	case 2:

		$("#graficoPanel").show();
		$("#divFlechaGraf").css({
		});
		$("#divFlechaFondoGraf").css({
		});
		$("#opcionesGrafico").hide();
		$("#btnClipTabla").hide();
		$("#btnReporteEpp").hide(); 
		break;
	
	
	}
	
}
function crearGraficoPiramide(tituloy,ejey,graficoId){
	$("#"+graficoId).highcharts({
        chart: {
        type: 'pyramid',
        marginRight: 100
    },
    title: {
        text: tituloy,
        x: -50
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b> ({point.y:,.0f})',
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                softConnector: true
            }
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Cantidad',
        data: ejey
    }]
});
	
	
}
function crearGraficoColumna(tituloy,ejey,leyendaY,graficoId){
	$("#"+graficoId).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: tituloy
        },
        xAxis: {
            categories: leyendaY
        },
        yAxis: {
            min: 0,
            title: {
                text: ""
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: ejey
    });
}


function iniciarGraficoChartJs(tituloDiv,magnitudId,divId,chartId,
		tipoChartId,
		datasets,options){
var estilo="";
	switch(magnitudId){
	case 6:
		height=650;
		width=650;
		break;
	case 5:
		height=600;
		width=1200;
		break;
	case 4:
		height=400;
		width=260;
		estilo="margin-top:10px"
		break;
	case 3:
		height=290;
		width=290;
		break;
	case 2:
		height=180;
		width=180;
		break;
	case 1:
		height=130;
		width=130;
		break;
		
	
	}
	
	
	
	var dataAux = {
		 
		    datasets: datasets
	
	
		};
	var ctx = 2;

	switch(parseInt(tipoChartId)){
	case 1: 
		var sas=new Chart(ctx).PolarArea(datasets, options);
		break;
	case 2: 
		 
		
		 $("#"+divId).highcharts({
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false,
		            type: 'pie'
		        },
		        title: {
		            text: tituloDiv
		        },
		        tooltip: {
		            pointFormat: ' <b>{point.percentage:.1f}%</b>'
		        },
		        plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                dataLabels: {
		                    enabled: true,
		                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
		                    style: {
		                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
		                    },
		                    connectorColor: 'silver'
		                }
		            },
		            series: {
		  	          shadow: true
		  	       },
		        },
		        series: [{
		          name:"a",
		            colorByPoint: true,
		            data: datasets
		        }]
		    });
		
		break;
	case 3: 
		
		$("#"+divId).highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: tituloDiv
	        },
	        
	        xAxis: {
	            type: 'Estado'
	        },
	        yAxis: {
	            title: {
	                text: 'Inversión'
	            }

	        },
	        legend: {
	            enabled: false
	        },
	        plotOptions: {
	            series: {
	                borderWidth: 0,
	                dataLabels: {
	                    enabled: true,
	                    format: '{point.y:.1f}'
	                }
	            }
	        },

	        tooltip: {
	            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	            pointFormat: '<span style="color:{point.color}">{point.name}</span><br/>'
	        },

	        series:datasets
	    });
		break;
	case 5:
		$("#"+divId).highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },
	        title: {
	            text: tituloDiv
	        },
	        tooltip: {
	            pointFormat: '<b>{point.y}</b> ( <b>{point.percentage:.1f}% </b> )'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                showInLegend: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: false,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    },
	                    connectorColor: 'silver',
	                
	                }
	            },
	            series: {
	  	          shadow: true
	  	       },
	        },
	        series: [{
	          name:"a",
	            colorByPoint: true,
	            data: datasets
	        }]
	    });
	
		break;
		default:
			break;
	}
	
}

function llenarEspacioAyudaGrafico(){
	console.log("chevere2222");
	
}
function procesarLlamadaGraficosPiramide(data){


	switch (data.CODE_RESPONSE) {
	case "05":
		
		var evenInseguroRegistrado=data.eventoArea;
		var accidenteRegistrado=data.accidenteArea;
	
		var nombresAreas=[];
		var campoAcc={name:"Accidentes Fatales",data:[]};
		var campoAccInc1={name:"Inc. Total Temporal",data:[]};
		var campoAccInc2={name:"Inc. Parcial Temporal",data:[]};
		var campoAccInc3={name:"Inc Parcial Permanente",data:[]};
		var campoAccInc4={name:"Inc. Total Permanente	",data:[]};
		var campoAccLeve={name:"Accidentes Leves",data:[]};
		var campoInc={name:"Incidentes ",data:[]};
		var campoActo={name:"Actos ",data:[]};
		var campoCondicion={name:"Condiciones ",data:[]};
		var selectSubGraph="<select class='form-control' onchange='cambiarAcordeSubGrafico()' id='selectSubGraf'>" +
		"<option value=1>Por áreas</option>" +
		"<option value=2>Por unidades</option>" +
		"<option value=3>Accidentabilidad por empresa</option></select>";
		
		$("#graficoEst div").remove();
		$("#graficoEst select").remove();
		$("#graficoEst").append(selectSubGraph+"<br>");
		$("#graficoEst").append("<div id='graficoAccArea' class='col-md-10'></div>");
		$("#graficoEst").append("<div id='graficoAccUnidad' class='col-md-10'></div>");
		$("#graficoEst").append("<div id='graficoAccTotal' class='col-md-10'></div>");
		
$("#graficoAccArea").show();
$("#graficoAccUnidad").hide();
$("#graficoAccTotal").hide();
		if(accidenteRegistrado.length>=evenInseguroRegistrado.length){
			for (index = 0; index < accidenteRegistrado.length; index++) {
				
				var nombre=accidenteRegistrado[index].areaNombre;
			var idArea=accidenteRegistrado[index].areaId;
			campoAcc.data.push(accidenteRegistrado[index].numAccFatal);
			campoAccInc1.data.push(accidenteRegistrado[index].numAccIncap1);
			campoAccInc2.data.push(accidenteRegistrado[index].numAccIncap2);
			campoAccInc3.data.push(accidenteRegistrado[index].numAccIncap3);
			campoAccInc4.data.push(accidenteRegistrado[index].numAccIncap4);
			
			
			
			campoAccLeve.data.push(accidenteRegistrado[index].numAccLeve);
			campoInc.data.push(accidenteRegistrado[index].numIncidente);
			for(var index2=0; index2<evenInseguroRegistrado.length;index2++){
				if(evenInseguroRegistrado[index2].areaId==accidenteRegistrado[index].areaId){
				campoActo.data.push(evenInseguroRegistrado[index2].numActos);
				campoCondicion.data.push(evenInseguroRegistrado[index2].numCond);}
			}
			
			nombresAreas.push(nombre);
			}
		}else{
			for (index = 0; index < evenInseguroRegistrado.length; index++) {
				
				var nombre=evenInseguroRegistrado[index].areaNombre;
			var idArea=evenInseguroRegistrado[index].areaId;

			campoActo.data.push(evenInseguroRegistrado[index].numActos);
		campoCondicion.data.push(evenInseguroRegistrado[index].numCond);
			for(var index2=0; index2<accidenteRegistrado.length;index2++){
				if(evenInseguroRegistrado[index].areaId==accidenteRegistrado[index2].areaId){
					campoAcc.data.push(accidenteRegistrado[index2].numAccFatal);
					campoAccInc1.data.push(accidenteRegistrado[index2].numAccIncap1);
					campoAccInc2.data.push(accidenteRegistrado[index2].numAccIncap2);
					campoAccInc3.data.push(accidenteRegistrado[index2].numAccIncap3);
					campoAccInc4.data.push(accidenteRegistrado[index2].numAccIncap4);
					campoAccLeve.data.push(accidenteRegistrado[index2].numAccLeve);
					campoInc.data.push(accidenteRegistrado[index2].numIncidente);
					
					}
			}
			
			nombresAreas.push(nombre);
			}
		}
	
		
		
		var datosTotal=[campoAcc,campoAccInc1,campoAccInc2,campoAccInc3,campoAccInc4,campoAccLeve,campoActo,campoCondicion];
		
		crearGraficoColumna("Indicadores por Area",datosTotal,nombresAreas,"graficoAccArea");
			
		////////////////
		var evenInseguroRegistrado=data.eventosUnidad;
		var accidenteRegistrado=data.accidentesUnidad;
		var nombresAreas=[];
		var campoAcc={name:"Accidentes Fatales",data:[]};
		var campoAccInc1={name:"Inc. Total Temporal",data:[]};
		var campoAccInc2={name:"Inc. Parcial Temporal",data:[]};
		var campoAccInc3={name:"Inc Parcial Permanente",data:[]};
		var campoAccInc4={name:"Inc. Total Permanente",data:[]};
		var campoAccLeve={name:"Accidentes Leves",data:[]};
		var campoInc={name:"Incidentes ",data:[]};
		var campoActo={name:"Actos ",data:[]};
		var campoCondicion={name:"Condiciones ",data:[]};
			if(accidenteRegistrado.length>=evenInseguroRegistrado.length){
			for (index = 0; index < accidenteRegistrado.length; index++) {
				
				var nombre=accidenteRegistrado[index].areaNombre;
			var idArea=accidenteRegistrado[index].areaId;
			campoAcc.data.push(accidenteRegistrado[index].numAccFatal);
			campoAccInc1.data.push(accidenteRegistrado[index].numAccIncap1);
			campoAccInc2.data.push(accidenteRegistrado[index].numAccIncap2);
			campoAccInc3.data.push(accidenteRegistrado[index].numAccIncap3);
			campoAccInc4.data.push(accidenteRegistrado[index].numAccIncap4);
			campoAccLeve.data.push(accidenteRegistrado[index].numAccLeve);
			campoInc.data.push(accidenteRegistrado[index].numIncidente);
			for(var index2=0; index2<evenInseguroRegistrado.length;index2++){
				if(evenInseguroRegistrado[index2].areaId==accidenteRegistrado[index].areaId){
				campoActo.data.push(evenInseguroRegistrado[index2].numActos);
				campoCondicion.data.push(evenInseguroRegistrado[index2].numCond);}
			}
			
			nombresAreas.push(nombre);
			}
		}else{
			for (index = 0; index < evenInseguroRegistrado.length; index++) {
				
				var nombre=evenInseguroRegistrado[index].areaNombre;
			var idArea=evenInseguroRegistrado[index].areaId;

			campoActo.data.push(evenInseguroRegistrado[index].numActos);
		campoCondicion.data.push(evenInseguroRegistrado[index].numCond);
			for(var index2=0; index2<accidenteRegistrado.length;index2++){
				if(evenInseguroRegistrado[index].areaId==accidenteRegistrado[index2].areaId){
					campoAcc.data.push(accidenteRegistrado[index2].numAccFatal);
					campoAccInc1.data.push(accidenteRegistrado[index2].numAccIncap1);
					campoAccInc2.data.push(accidenteRegistrado[index2].numAccIncap2);
					campoAccInc3.data.push(accidenteRegistrado[index2].numAccIncap3);
					campoAccInc4.data.push(accidenteRegistrado[index2].numAccIncap4);
					campoAccLeve.data.push(accidenteRegistrado[index2].numAccLeve);
					campoInc.data.push(accidenteRegistrado[index2].numIncidente);
					
					}
			}
			
			nombresAreas.push(nombre);
			}
		}
	
		
		
		var datosTotal=[campoAcc,campoAccInc1,campoAccInc2,campoAccInc3,campoAccInc4,campoAccLeve,campoActo,campoCondicion];
		
		crearGraficoColumna("Indicadores por Unidad",datosTotal,nombresAreas,"graficoAccUnidad");
		var evenInseguroRegistrado=data.eventosTotal;
		var accidenteRegistrado=data.accTotal;
	
		var campoAcc=[];
		var campoAccInc1=[];
		var campoAccInc2=[];
		var campoAccInc3=[];
		var campoAccInc4=[];
		var campoAccLeve=[];
		var campoInc=[];
		var campoActo=[];
		var campoCondicion=[];
			
		
		
			campoAcc=(["Accidentes Fatales",accidenteRegistrado[0].numAccFatal]);
			campoAccInc1=(["Inc. Total Temporal",accidenteRegistrado[0].numAccIncap1]);
			campoAccInc2=(["Inc. Parcial Temporal",accidenteRegistrado[0].numAccIncap2]);
			campoAccInc3=(["Inc Parcial Permanente",accidenteRegistrado[0].numAccIncap3]);
			campoAccInc4=(["Inc. Total Permanente",accidenteRegistrado[0].numAccIncap4]);
			campoAccLeve=(["Accidentes Leves",accidenteRegistrado[0].numAccLeve]);
			campoInc=(["Incidentes",accidenteRegistrado[0].numIncidente]);
			campoActo=(["Actos y Condiciones",evenInseguroRegistrado[0].numActos+evenInseguroRegistrado[0].numCond]);
			
		
	var datosTotal=[campoActo,campoAccLeve,campoAccInc4,campoAccInc3,campoAccInc2,campoAccInc1,campoAcc];
			
		console.log(datosTotal);
		crearGraficoPiramide("Accidentabilidad por empresa",datosTotal,"graficoAccTotal");
		
	
			break;
		
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

	
}



}

function cambiarAcordeSubGrafico(){
	
	console.log(parseInt($("#selectSubGraf").val()));
	switch(parseInt($("#selectSubGraf").val())){
	
	case 1:
		
		$("#graficoAccArea").show();
		$("#graficoAccUnidad").hide();
		$("#graficoAccTotal").hide();
		break;
	case 2:	
		$("#graficoAccArea").hide();
		$("#graficoAccUnidad").show();
		$("#graficoAccTotal").hide();
		break;
	case 3:
		$("#graficoAccArea").hide();
		$("#graficoAccUnidad").hide();
		$("#graficoAccTotal").show();
		break;
	}
	
}
function cambiarAcordeSubGraficoTipo(){
	
	switch(parseInt($("#selectSubGrafTipo").val())){
	
	case 1:
		
		$("#graficoAccTipoArea").show();
		$("#graficoAccTipoUnidad").hide();
		$("#graficoAccTipoTotal").hide();
		break;
	case 2:	
		$("#graficoAccTipoArea").hide();
		$("#graficoAccTipoUnidad").show();
		$("#graficoAccTipoTotal").hide();
		break;
	case 3:
		$("#graficoAccTipoArea").hide();
		$("#graficoAccTipoUnidad").hide();
		$("#graficoAccTipoTotal").show();
		break;
	}
	
}
function obtenerDataSets(numRetrasados,numProceso,numCompleto){
	var dataSets=[];
	if(numRetrasados==0 &&numProceso==0 &&numCompleto==0){
		dataSets=[
	             {
	                 y:1,
	                 color:"black",
	              	   name:"Sin Info",
	              	
	              }
	          ];
	}

	if(numRetrasados!=0){
		var dataAux={
	              y:numRetrasados,
	              color: {
	            	    radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
	            	    stops: [
	            	       [0, 'white'],
	            	       [1, 'red']
	            	    ]
	            	},
	           	   name:"Retrasado ("+numRetrasados+")",
	         
	           };
		dataSets.push(dataAux) ;
			           
			         
			         
	};
	if(numProceso!=0){
		var dataAux={
		       	  y:numProceso,
		             color: {
		            	    radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
		            	    stops: [
		            	       [0, 'white'],
		            	       [1, 'orange']
		            	    ]
		            	},
		      	   name:"Por Implementar ("+numProceso+")",
		      	
		       };
		dataSets.push(dataAux) ;
			           
			         
			         
	};
	if(numCompleto!=0){
		var dataAux= {
		           y:numCompleto,
		           color:{
	            	    radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
	            	    stops: [
	            	       [0, 'white'],
	            	       [1, 'green']
	            	    ]
	            	},
		    	   name:"Completado ("+numCompleto+")",
		    	
		        };
		dataSets.push(dataAux) ;
			           
			         
			         
	};
     
	  return dataSets;
}
function llamarGraficos(){
	infoTotal=[];
	listNombresMdf=[];$("#opcionesGrafico").hide();
	
	$("#divFlechaGraf").attr("style","");
	$("#divFlechaFondoGraf").attr("style","");
	if(listaUnidades!=null){
		for(var index=0;index<listaUnidades.length;index++){
			
			 listNombresMdf.push(listaUnidades[index].mdfNombre)
			
			 
		}
	}
	
	fechaInicio= $("#fechaIniciaGraf").val();
	 fechaFin= $("#fechaFinGraf").val();
	
	$("#graficoEst").show();$("#graficoPanel").hide();
	$("#graficoEst select").remove();
	$("#rangoFechas").html("");
	if($("#selUnidadGraf").val()!=null){
		 var auxUnidad=$("#selUnidadGraf").val().split('-')
		 unidadId=parseInt(auxUnidad[0]);
		 unidadTipoId=parseInt(auxUnidad[1]);
		 for(var index=0;index<listaUnidades.length;index++){
				
			 infoTotal.push(parseInt(listaUnidades[index].mdfId));
			 listNombresMdf.push(listaUnidades[index].mdfNombre)
			
			 
		}
		
	}

	
	var dataParam = {
			fechaInicio:fechaInicio,
			mdfIdLista : infoTotal,
			mdfId:unidadId,
			fechaFin:fechaFin,
			empresaId : sessionStorage.getItem("gestopcompanyid"),
			mdfTipoId:unidadTipoId
			};console.log(dataParam);
	var tipoGraficos=graficoId;
	console.log(unidadId);
	
switch(parseInt(tipoGraficos)){

case 1:
	cambiarTitulo("Gráfico 'Actividades'");
	callAjaxPost(URL + '/estadistica/graficos', dataParam,
			procesarLlamadaGraficos);
	break;
case 2:
	cambiarTitulo("Gráfico 'Uso de recursos'");
	callAjaxPost(URL + '/estadistica/graficos/recursos', dataParam,
			procesarLlamadaGraficosRecursos);
	break;
case 3:
	cambiarTitulo("Gráfico 'Accidentes'");
	callAjaxPost(URL + '/estadistica/graficos/accidentes', dataParam,
			procesarLlamadaGraficosAccidentes);
	break;
case 4:
	cambiarTitulo("Gráfico 'Inversiones'");
	callAjaxPost(URL + '/estadistica/graficos/inversion', dataParam,
			procesarLlamadaGraficosInversion);
	break;
case 5:
	cambiarTitulo("Gráfico 'Accidentes Indicadores'");
	mostrarGraficos();
	break;
case 6:
	cambiarTitulo("Gráfico ' Accidentes en General'");
	callAjaxPost(URL + '/estadistica/graficos/piramide', dataParam,
			procesarLlamadaGraficosPiramide);
	break;
case 7:
	cambiarTitulo("Gráfico 'Accidentes Incapacitantes vs Acciones de mejora'");
	callAjaxPost(URL + '/estadistica/graficos/accionaccidente', dataParam,
			procesarLlamadaGraficosAccionAccidente);
	break;
case 8:
	cambiarTitulo("Gráfico 'Curva de Inversión'");
	callAjaxPost(URL + '/estadistica/graficos/curvacosto', dataParam,
			procesarLlamadaGraficosInversionMensual);
	break;
case 9:
	cambiarTitulo("Gráfico 'Indicadores de accidentabilidad según forma del accidente'");
	callAjaxPost(URL + '/estadistica/graficos/tipoaccidente', dataParam,
			procesarLlamadaGraficosTipoAccidente);
	break;

}
		

ponerRangoFechasGraf();



}
function procesarLlamadaGraficosTipoAccidente(data){

	switch (data.CODE_RESPONSE) {
	case "05":
		
		var accidenteRegistrado=data.accidenteArea;
	
		var nombresAreas=[];
		var campoTipoAcc64={name:"Caída de personas",data:[]};
		var campoTipoAcc65={name:"Caída de objetos",data:[]};
		var campoTipoAcc66={name:"Pisadas o choques",data:[]};
		var campoTipoAcc67={name:"Atrapado por un objeto",data:[]};
		var campoTipoAcc68={name:"Esfuerzo excesivo o falso movimiento",data:[]};
		var campoTipoAcc69={name:"Exposición a temperaturas extermas",data:[]};
		var campoTipoAcc70={name:"Exposición a corriente eléctrica",data:[]};
		var campoTipoAcc71={name:"Exposición a sustancias nocivas",data:[]};
		var campoTipoAcc72={name:"Otros",data:[]};
		

		var selectSubGraph="<select class='form-control' onchange='cambiarAcordeSubGraficoTipo()' id='selectSubGrafTipo'>" +
		"<option value=1>Por áreas</option>" +
		"<option value=2>Por unidades</option>" +
		"<option value=3>Por empresa</option></select>";
		
		$("#graficoEst div").remove();
		$("#graficoEst select").remove();
		$("#graficoEst").append(selectSubGraph+"<br>");
		$("#graficoEst").append("<div id='graficoAccTipoArea' class='col-md-10'></div>");
		$("#graficoEst").append("<div id='graficoAccTipoUnidad' class='col-md-10'></div>");
		$("#graficoEst").append("<div id='graficoAccTipoTotal' class='col-md-10'></div>");
		
$("#graficoAccTipoArea").show();
$("#graficoAccTipoUnidad").hide();
$("#graficoAccTipoTotal").hide();
		
			for (index = 0; index < accidenteRegistrado.length; index++) {
				
				var nombre=accidenteRegistrado[index].areaNombre;
				campoTipoAcc64.data.push(accidenteRegistrado[index].numTipoAcc64);
				campoTipoAcc65.data.push(accidenteRegistrado[index].numTipoAcc65);
				campoTipoAcc66.data.push(accidenteRegistrado[index].numTipoAcc66);
				campoTipoAcc67.data.push(accidenteRegistrado[index].numTipoAcc67);
				campoTipoAcc68.data.push(accidenteRegistrado[index].numTipoAcc68);
				campoTipoAcc69.data.push(accidenteRegistrado[index].numTipoAcc69);
				campoTipoAcc70.data.push(accidenteRegistrado[index].numTipoAcc70);
				campoTipoAcc71.data.push(accidenteRegistrado[index].numTipoAcc71);
				campoTipoAcc72.data.push(accidenteRegistrado[index].numTipoAcc72);
		
			nombresAreas.push(nombre);
			}
		
	
		
		
		var datosTotal=[campoTipoAcc64,campoTipoAcc65,campoTipoAcc66,campoTipoAcc67,campoTipoAcc68,
		                campoTipoAcc69,campoTipoAcc70,campoTipoAcc71,campoTipoAcc72];
		
		crearGraficoColumna("Indicadores por Area",datosTotal,nombresAreas,"graficoAccTipoArea");
			
		////////////////
		var accidenteRegistrado=data.accidentesUnidad;

		var nombresAreas=[];
		var campoTipoAcc64={name:"Caída de personas",data:[]};
		var campoTipoAcc65={name:"Caída de objetos",data:[]};
		var campoTipoAcc66={name:"Pisadas o choques",data:[]};
		var campoTipoAcc67={name:"Atrapado por un objeto",data:[]};
		var campoTipoAcc68={name:"Esfuerzo excesivo o falso movimiento",data:[]};
		var campoTipoAcc69={name:"Exposición a temperaturas extermas",data:[]};
		var campoTipoAcc70={name:"Exposición a corriente eléctrica",data:[]};
		var campoTipoAcc71={name:"Exposición a sustancias nocivas",data:[]};
		var campoTipoAcc72={name:"Otros",data:[]};
			
		for (index = 0; index < accidenteRegistrado.length; index++) {
			
			var nombre=accidenteRegistrado[index].areaNombre;
			campoTipoAcc64.data.push(accidenteRegistrado[index].numTipoAcc64);
			campoTipoAcc65.data.push(accidenteRegistrado[index].numTipoAcc65);
			campoTipoAcc66.data.push(accidenteRegistrado[index].numTipoAcc66);
			campoTipoAcc67.data.push(accidenteRegistrado[index].numTipoAcc67);
			campoTipoAcc68.data.push(accidenteRegistrado[index].numTipoAcc68);
			campoTipoAcc69.data.push(accidenteRegistrado[index].numTipoAcc69);
			campoTipoAcc70.data.push(accidenteRegistrado[index].numTipoAcc70);
			campoTipoAcc71.data.push(accidenteRegistrado[index].numTipoAcc71);
			campoTipoAcc72.data.push(accidenteRegistrado[index].numTipoAcc72);
	
		nombresAreas.push(nombre);
		}
		
	
		
		
		var datosTotal=[campoTipoAcc64,campoTipoAcc65,campoTipoAcc66,campoTipoAcc67,campoTipoAcc68,
		                campoTipoAcc69,campoTipoAcc70,campoTipoAcc71,campoTipoAcc72];
		
		crearGraficoColumna("Indicadores por Unidad",datosTotal,nombresAreas,"graficoAccTipoUnidad");
	
		var accidenteRegistrado=data.accTotal;

		
		var campoTipoAcc64=[];
		var campoTipoAcc65=[];
		var campoTipoAcc66=[];
		var campoTipoAcc67=[];
		var campoTipoAcc68=[];
		var campoTipoAcc69=[];
		var campoTipoAcc70=[];
		var campoTipoAcc71=[];
		var campoTipoAcc72=[];
			
		
			
		campoTipoAcc64=({name:"Caída de personas",y:accidenteRegistrado[0].numTipoAcc64});
		campoTipoAcc65=({name:"Caída de objetos",y:accidenteRegistrado[0].numTipoAcc65});
		campoTipoAcc66=({name:"Pisadas o choques",y:accidenteRegistrado[0].numTipoAcc66});
		campoTipoAcc67=({name:"Atrapado por un objeto",y:accidenteRegistrado[0].numTipoAcc67});
		campoTipoAcc68=({name:"Esfuerzo excesivo o falso movimiento",y:accidenteRegistrado[0].numTipoAcc68});
		campoTipoAcc69=({name:"Exposición a temperaturas extremas",y:accidenteRegistrado[0].numTipoAcc69});
		campoTipoAcc70=({name:"Exposición a corrietnes eléctricas",y:accidenteRegistrado[0].numTipoAcc70});
		campoTipoAcc71=({name:"Exposición a sustancias nocivas",y:accidenteRegistrado[0].numTipoAcc71});
		campoTipoAcc72=({name:"Otros",y:accidenteRegistrado[0].numTipoAcc72});
			
			
		
	

		var datosTotal=[campoTipoAcc64,campoTipoAcc65,campoTipoAcc66,campoTipoAcc67,campoTipoAcc68,
		                campoTipoAcc69,campoTipoAcc70,campoTipoAcc71,campoTipoAcc72];
				
		 
		 iniciarGraficoChartJs("Total de Tipos de Accidente",3,
				 "graficoAccTipoTotal",null,
					5,
					datosTotal,null);
			break;
		
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

	
}
	
	
}
function agregarIndicadorGrafico(divId,divTitulo,divTotal,divUnidad,divArea){
	var botonAreaDetalle="";
	var botonUnidadDetalle="";
	var newopts = {
		    inGraphDataShow: true,
		 
		    inGraphDataRadiusPosition: 2,
		    animateRotate : false,
		    inGraphDataFontColor: 'black',
		    inGraphDataFontSize : 14,
		    inGraphDataTmpl : "<%=v2 +' ('+v6+' %)' %>"
		};
	$("#graficoEst").append("<div id='"+divId+"'  " +
    		"style='min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto; float:left;' >" +
    		"</div>");
	
	if(divUnidad!=null){
	 botonUnidadDetalle="<a onclick='verDetalleUnidad(&quot;"+divId+"&quot;)' " +
	 		"id='detalleUnidad"+divId+"'>" +
	"<i class='fa fa-plus fa-2' style='color:blue'>Unidades</i><a>";
	
	}
	if(divArea!=null){
	 botonAreaDetalle="<a onclick='verDetalleArea(&quot;"+divId+"&quot;)' id='detalleArea"+divId+"'>" +
	"<i class='fa fa-plus fa-2' style='color:green'>Areas</i><a>";
	
	}
	 if(divTotal!=null){
		 $("#"+divId).append("<div id='emp"+divId+"' " +
			"style='border:solid; border-color: black;float:left;margin:0px'>    </div>" +
			botonUnidadDetalle+botonAreaDetalle);
		 var datasetsEmpresa= obtenerDataSets(divTotal[0].numRetrasado,
				  divTotal[0].numImplementar,
				  divTotal[0].numCompleto);
		 
		 iniciarGraficoChartJs(divTitulo,3,
					"emp"+divId,"chartEmpresa"+divId,
					2,
					datasetsEmpresa,newopts);
		

	}
	
	 if(divUnidad!=null){
		 $("#"+divId).append("<div id='unidad"+divId+"' " +
			"style='border:solid; border-color: black;float:left;margin:0px'>    </div>");
	
		
		
		for(var i=0;i<divUnidad.length;i++){
			 var datasetsUnidad= obtenerDataSets(divUnidad[i].numRetrasado,
					 divUnidad[i].numImplementar,
					 divUnidad[i].numCompleto);
			 
			 iniciarGraficoChartJs( divUnidad[i].unidadNombre,2,
						"unidad"+divId,"chartUnidad"+divId+i,
						2,datasetsUnidad,newopts);
		}
		}
	
	 if(divArea!=null){
		 $("#"+divId).append("<div id='area"+divId+"' " +
			"style='border:solid; border-color: black;float:left;margin:0px'>    </div>");
		 

			
			for(var i=0;i<divArea.length;i++){
				 var datasetsUnidad= obtenerDataSets(divArea[i].numRetrasado,
						 divArea[i].numImplementar,
						 divArea[i].numCompleto);
				 
				 iniciarGraficoChartJs( divArea[i].areaNombre,2,
							"area"+divId,"chartArea"+divId+i,
							2,datasetsUnidad,newopts);
			}
		}
	 $("#unidad"+divId).hide();
	
	$("#area"+divId).hide();
	 calcularAnchoGrafico(divId);	
	
}
var mayorNUm;
function agregarIndicadorGraficoInversion(divId,divTitulo,divTotal,divUnidad,divArea){
	var botonAreaDetalle="";
	var botonUnidadDetalle="";
	
	var myoptions = { 
			  inGraphDataShow : true,
			  roundNumber : -2
			}  
	$("#graficoEst").append("<div id='"+divId+"'  " +
    		"style=' max-height:800px;float:left;' >" +
    		"</div>");
	
	
	if(divUnidad!=null){
	 botonUnidadDetalle="<a onclick='verDetalleUnidad(&quot;"+divId+"&quot;)' " +
	 		"id='detalleUnidad"+divId+"'>" +
	"<i class='fa fa-plus fa-2' style='color:blue'>Unidades</i><a>";
	
	}
	if(divArea!=null){
	 botonAreaDetalle="<a onclick='verDetalleArea(&quot;"+divId+"&quot;)' id='detalleArea"+divId+"'>" +
	"<i class='fa fa-plus fa-2' style='color:green'>Areas</i><a>";
	
	}
	 if(divTotal!=null){
		 $("#"+divId).append("<div id='emp"+divId+"' " +
			"style='float:left;margin:0px;height:440px'>    </div>" );
		 var datasetsEmpresa=obtenerDataSetsInversion(divTotal,null,null);
	if(divId=="activInvTotal"){
	
		 mayorNUm= hallarMayor(divTotal[0].invCompleto,divTotal[0].invRetrasado,divTotal[0].invImplementar);
		
	}
	 myoptions.graphMax=mayorNUm*1.1;
		 iniciarGraficoChartJs(divTitulo,4,
					"emp"+divId,"chartEmpresa"+divId,
					3,
					datasetsEmpresa,myoptions);
		

	}
	
	 if(divUnidad!=2222233){
		 $("#"+divId).append("<div id='unidad"+divId+"' " +
			"style='border:solid; border-color: black;float:left;margin:0px;height:260px'>    </div>");
	
		
		var datasetsUnidad=obtenerDataSetsInversion(null,divUnidad,null);
		
		 iniciarGraficoChartJs( "Unidades",4,
					"unidad"+divId,"chartUnidad"+divId,
					3,datasetsUnidad,myoptions);
		}
	
	 if(divArea!=21212121){
		 $("#"+divId).append("<div id='area"+divId+"' " +
			"style='border:solid; border-color: black;float:left;margin:0px;height:260px'>    </div>");
		 
			var datasetsArea=obtenerDataSetsInversion(null,null,divArea);
				 
				 iniciarGraficoChartJs( "Areas",4,
							"area"+divId,"chartArea"+divId,
							3,datasetsArea,myoptions);
			
		}
	 
	 $("#unidad"+divId).hide();
	
	$("#area"+divId).hide();
	 calcularAnchoGrafico(divId);	
		
}

function hallarMayor(a1,a2,a3){
	
	if(a1>a2 && a1>a3){
		return a1;
	}
	if(a2>a1 && a2>a3){
		return a2;
	}
	if(a3>a2 && a3>a1){
		return a3;
	}
}

function agregarIndicadorGraficoRecursos(divId,divTitulo,divTotal,tipoRecursoId){
	$("#graficoEst").append("<div id='"+divId+"'  " +
    		"style='border:solid; max-height:1200px;float:left;' >" +
    		"</div>");$("#"+divId).css("border","none");
    		var newopts = {
    			    inGraphDataShow: true,
    			 
    			    inGraphDataRadiusPosition: 2,
    			    animateRotate : false,
    			    inGraphDataFontColor: 'black',
    			    inGraphDataFontSize : 14,
    			    inGraphDataTmpl : "<%=v2 +' ('+v6+' %)' %>"
    			};
    		var newopts2 = {
    			    inGraphDataShow: true,
    			 
    			    inGraphDataRadiusPosition: 2,
    			    animateRotate : false,
    			    inGraphDataFontColor: 'black',
    			    inGraphDataFontSize : 14,
    			    inGraphDataTmpl : "<%=v1+': '+v2 +' ('+v6+' %)' %>"
    			};
	 if(divTotal!=null){
		 $("#"+divId).append("<div id='recurso"+divId+"' " +
			"style='float:left;margin:0px'>    </div>" );
		 if(tipoRecursoId<4){
		 var datasetsEmpresa= obtenerDataSetsRecursos(divTotal[0].numPositivo,
				  divTotal[0].numNegativo,tipoRecursoId);
		 iniciarGraficoChartJs(divTitulo,3,
					"recurso"+divId,"chartRecurso"+divId,
					2,
					datasetsEmpresa,newopts);
		
		 }
		 
		 if(tipoRecursoId>=4){
			 var datasetsEmpresa= obtenerDataSetsRecursosComplejo(divTotal,tipoRecursoId);
			 iniciarGraficoChartJs(divTitulo,6,
						"recurso"+divId,"chartRecurso"+divId,
						2,
						datasetsEmpresa,newopts2);
			
			 }
	}
	
}


function agregarIndicadorGraficoAcc(divId,divTitulo,divTotal,divUnidad,divArea,idArray){
	var botonAreaDetalle="";
	var botonUnidadDetalle="";
	var newopts = {
		    inGraphDataShow: true,
		 
		    inGraphDataRadiusPosition: 2,
		    animateRotate : false,
		    inGraphDataFontColor: 'black',
		    inGraphDataFontSize : 14,
		    inGraphDataTmpl : "<%=v1 +' ('+v6+' %)' %>"
		};
	$("#graficoEst").append("<div id='"+divId+"'  " +
    		" max-height:600px;float:left;' onclick=agrandarGraficoAcc('chartEmpresa"+divId+"') >" +
    		"</div>");$("#"+divId).css("border","none");
	if(divUnidad!=null){
	 botonUnidadDetalle="<a onclick='verDetalleUnidad(&quot;"+divId+"&quot;)' " +
	 		"id='detalleUnidad"+divId+"'>" +
	"<i class='fa fa-plus fa-2' style='color:blue'>Unidades</i><a>";
	
	}
	if(divArea!=null){
	 botonAreaDetalle="<a onclick='verDetalleArea(&quot;"+divId+"&quot;)' id='detalleArea"+divId+"'>" +
	"<i class='fa fa-plus fa-2' style='color:green'>Areas</i><a>";
	
	}
	 if(divTotal!=null){
		 $("#"+divId).append("<div id='emp"+divId+"' " +
			"style='float:left;margin:0px;width:1300px;height:600px;'>    </div>" +
			"");
		 var datasetsEmpresa= obtenerDataSetsAcc(divTotal,idArray);
		
		 iniciarGraficoChartJs(divTitulo,5,
					"emp"+divId,"chartEmpresa"+divId,
					2,
					datasetsEmpresa,newopts);
		

	}
	
	 if(divUnidad!=null){
		 $("#"+divId).append("<div id='unidad"+divId+"' " +
			"style='border:solid; border-color: black;float:left;margin:0px'>    </div>");
	
		
		
		for(var i=0;i<divUnidad.length;i++){
			 var datasetsUnidad= obtenerDataSets(divUnidad[i].numRetrasado,
					 divUnidad[i].numImplementar,
					 divUnidad[i].numCompleto);
			 
			 iniciarGraficoChartJs( divUnidad[i].unidadNombre,2,
						"unidad"+divId,"chartUnidad"+divId+i,
						2,datasetsUnidad,{});
		}
		}
	
	 if(divArea!=null){
		 $("#"+divId).append("<div id='area"+divId+"' " +
			"style='border:solid; border-color: black;float:left;margin:0px'>    </div>");
		 

			
			for(var i=0;i<divArea.length;i++){
				 var datasetsUnidad= obtenerDataSets(divArea[i].numRetrasado,
						 divArea[i].numImplementar,
						 divArea[i].numCompleto);
				 
				 iniciarGraficoChartJs( divArea[i].areaNombre,2,
							"area"+divId,"chartArea"+divId+i,
							2,datasetsUnidad,{});
			}
		}
	 $("#unidad"+divId).hide();
	
	$("#area"+divId).hide();
	 calcularAnchoGrafico(divId);	
	
}


function agrandarGraficoAcc(canvasId){
	
}
function obtenerDataSetsRecursosComplejo(arrayEpp,tipoId){
	
	var labels=[];
	var data=[];
	var colores=["#FF0000","#04B404","#FFFF00","#FAFAFA","#BDBDBD","#0000FF","#FF4000","#F5A9A9"]

		if(tipoId==4){
			
			for(var i=0;i<arrayEpp.length;i++){
			
				
				var dataAux= {
		           	  name:arrayEpp[i].motivoNombre+" ("+arrayEpp[i].numEpp+")",
		                 color:{
			            	    radialGradient: {    cx: 0.5,
			                        cy: 0.3,
			                        r: 0.7 },
			            	    stops: [
			            	            [0,colores[i]],
			            	       [1, Highcharts.Color(colores[i]).brighten(-0.3).get('rgb')]
			            	     
			            	    ]
			            	},
		                 y:arrayEpp[i].numEpp
		           };
				data.push(dataAux);
			
				 
				
			}
		
			
			
		}
		if(tipoId==5){
			var sumaPrincipal=0;
			for(var i=0;i<arrayEpp.length;i++){
				var dataAux;
				if(arrayEpp[i].eppId!=0){
					sumaPrincipal=sumaPrincipal+arrayEpp[i].numEpp;
				 dataAux= {
			           	  y:arrayEpp[i].numEpp,
			                 color:{
				            	    radialGradient: {    cx: 0.5,
				                        cy: 0.3,
				                        r: 0.7 },
				            	    stops: [
				            	            [0,colores[i]],
				            	       [1, Highcharts.Color(colores[i]).brighten(-0.3).get('rgb')]
				            	     
				            	    ]
				            	},
			          	   name:arrayEpp[i].eppNombre+" ("+arrayEpp[i].numEpp+")"
			           };
					data.push(dataAux);
				}	else{
					sumaPrincipal=arrayEpp[i].eppNombre-sumaPrincipal;
				}	 
				
			}
			
			if(sumaPrincipal>0){
			var dataAux2= {
		           	  name:"Otros",
		                 color:{
			            	    radialGradient: {    cx: 0.5,
			                        cy: 0.3,
			                        r: 0.7 },
			            	    stops: [
			            	            [0,"black"],
			            	       [1, Highcharts.Color("black").brighten(-0.3).get('rgb')]
			            	     
			            	    ]
			            	},
		                 y:sumaPrincipal
		           };
				data.push(dataAux2);
		}}
	
return data;
	
}


function obtenerDataSetsRecursos(numPositivos,numNegativo,tipoRecursoId){
var labelPositivo="";
var labelNegativo="";
	switch(tipoRecursoId){
	case 1:
		labelPositivo="Entregados";
		labelNegativo="Por Entregar";
		break;
	case 2:
		labelPositivo="Aptos";
		labelNegativo="No Aptos";
		break;
	case 3:
		labelPositivo="Aactualizados";
		labelNegativo="Sin Actualizar";
		break;
	case 4:
		labelPositivo="Aactualizados";
		labelNegativo="Sin Actualizar";
		break;
	case 5:
		labelPositivo="Aactualizados";
		labelNegativo="Sin Actualizar";
		break;
	
	}
	
	var dataSets=[
   	             {
 	                 y:1,
 	                 color:"black",
 	              	   name:"Sin Info"
 	              }
 	          ];
if(numPositivos==0 &&numNegativo==0){

}else{
	
	dataSets= [
		           
		         
		           {
		           	  y:numPositivos,
		                 color:{
			            	    radialGradient: {    cx: 0.5,
			                        cy: 0.3,
			                        r: 0.7 },
			            	    stops: [
			            	            [0,"#04B404"],
			            	       [1, Highcharts.Color("#04B404").brighten(-0.3).get('rgb')]
			            	     
			            	    ]
			            	},
		          	   name:labelPositivo+" ("+numPositivos+")"
		           },
		           {
		               y:numNegativo,
		               color:{
		            	    radialGradient: {    cx: 0.5,
		                        cy: 0.3,
		                        r: 0.7 },
		            	    stops: [
		            	            [0,"#F21414"],
		            	       [1, Highcharts.Color("#F21414").brighten(-0.3).get('rgb')]
		            	     
		            	    ]
		            	},
		        	   name:labelNegativo +" ("+numNegativo+")"
		            }
		       ];
};

return dataSets;
}

function obtenerDataSetsInversion(arrayInversionTotal,arrayInversionUnidad,arrayInversionArea){

	var labels=[];
	var dataCompleta=[];
	var dataImplementar=[];
	var dataRetrasada=[];
		 
		if(arrayInversionTotal){
			for(var i=0;i<arrayInversionTotal.length;i++){
				
				dataCompleta.push(
					arrayInversionTotal[i].invCompleto
				);
				dataImplementar.push(
					arrayInversionTotal[i].invImplementar
				);
				dataRetrasada.push(
					arrayInversionTotal[i].invRetrasado
				);
						 
				
			}
		}
		if(arrayInversionUnidad){
			for(var i=0;i<arrayInversionUnidad.length;i++){
				labels.push(arrayInversionUnidad[i].unidadNombre);
				dataCompleta.push(arrayInversionUnidad[i].invCompleto);
				dataImplementar.push(arrayInversionUnidad[i].invImplementar);
				dataRetrasada.push(arrayInversionUnidad[i].invRetrasado);
						 
				
			}
		}
		if(arrayInversionArea){
			for(var i=0;i<arrayInversionArea.length;i++){
				labels.push(arrayInversionArea[i].areaNombre);
				dataCompleta.push(arrayInversionArea[i].invCompleto);
				dataImplementar.push(arrayInversionArea[i].invImplementar);
				dataRetrasada.push(arrayInversionArea[i].invRetrasado);
						 
				
			}
		}
		
			   
			   var datasets=[
			        {
			            name: "Completa",
			          color:"green",
			            data: dataCompleta
			        },
			        {
			        	name: "Proceso",
			            color:"yellow",
			            data: dataImplementar
			        },
			        {
			        	name: "Retrasada",
			            color:"red",
			            data: dataRetrasada
			        }
			    ]
			;

return datasets;
}


function obtenerDataSetsAcc(arrayActo,idArray){

	var labels=[];
	var data=[];
	if(arrayActo.length==0){
		return data;
	}else{
		var colores=["rgb(52,57,157)", "rgb(52,20,157)", "rgb(32,57,157)", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
		             "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"];

			if(idArray==1){
				var total=arrayActo[0].numActosSub;
				
				for(var i=0;i<arrayActo.length;i++){
					if(arrayActo[i].causaInmId!=0){
						
					var dataAux= {
			           	  name:arrayActo[i].causaNombre+" ("+arrayActo[i].numActosSub+")",
			                 color:{
				            	    radialGradient: {    cx: 0.5,
				                        cy: 0.3,
				                        r: 0.7 },
				            	    stops: [
				            	            [0,colores[i]],
				            	       [1, Highcharts.Color(colores[i]).brighten(-0.3).get('rgb')]
				            	     
				            	    ]
				            	},
			                 y:arrayActo[i].numActosSub
			           };
					data.push(dataAux);
					total=total-arrayActo[i].numActosSub;
					} 
					
				}
				if(total>0){
				var dataAux2= {
						name:"Otros ("+total+")",
			                 color:{
				            	    radialGradient: {    cx: 0.5,
				                        cy: 0.3,
				                        r: 0.3 },
				            	    stops: [
				            	       [0, "black"],
				            	       [1, Highcharts.Color("black").brighten(-0.3).get('rgb')]
				            	    ]
				            	},
			                 y:total
			           };
					data.push(dataAux2);
				}
				
				
			}
			if(idArray==0){
				var sumaPrincipal=arrayActo[0].numAccidentes;
				for(var i=0;i<arrayActo.length;i++){
					var dataAux;
					if(arrayActo[i].subTipoAccId!=0){
					 dataAux= {
				           	  y:arrayActo[i].numAccidentes,
				                 color:{
					            	    radialGradient: {   cx: 0.5,
					                        cy: 0.3,
					                        r: 0.3 },
					            	    stops: [
					            	            [0, colores[i]],
					            	            [1, Highcharts.Color(colores[i]).brighten(-0.3).get('rgb')]
							            	      
					            	    ]
					            	},
				                 name:arrayActo[i].subTipoAccNombre+" ("+arrayActo[i].numAccidentes+")"
				           };
						data.push(dataAux);
						sumaPrincipal=sumaPrincipal-arrayActo[i].numAccidentes;
					}		 
					
				}
				
				if(sumaPrincipal>0){
				var dataAux2= {
						name:"Otros ("+sumaPrincipal+")",
			                 color:{
				            	    radialGradient: {    cx: 0.5,
				                        cy: 0.3,
				                        r: 0.3 },
				            	    stops: [
				            	            [0, "black"],
						            	       [1, Highcharts.Color("black").brighten(-0.3).get('rgb')]
				            	    ]
				            	},
			                 y:sumaPrincipal
			           };
					data.push(dataAux2);
			}}
		
	return data;
	}
	
}
function procesarLlamadaGraficos(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var listaPlanIperc= data.listaPlanIperc;
		var listaPlanIpercUnidad= data.listaPlanIpercUnidad;
		var listaPlanForm= data.listaPlanForm;
		var listaPlanExam= data.listaPlanExam;
		var listaPlanDiag= data.listaPlanDiag;
		var listaPlanDiagUnidad= data.listaPlanDiagUnidad;
		var listaPlanDiagArea= data.listaPlanDiagArea;
		var listaPlanIns= data.listaPlanIns;
		var listaPlanInsUnidad= data.listaPlanInsUnidad;
		var listaPlanInsArea= data.listaPlanInsArea;
		var listaPlanAccMejora= data.listaPlanAccMejora;
		var listaPlanCorrecionInm= data.listaPlanCorrecionInm;
		var listaPlanTotal= data.listaPlanTotal;

	    $("#graficoEst div").remove();
	    agregarIndicadorGrafico("activPlanTotal","Resumen de Actividades",listaPlanTotal,null,null);
	    agregarIndicadorGrafico("activPlanIPERC","Actividades IPERC",listaPlanIperc,listaPlanIpercUnidad,null);
	
	    agregarIndicadorGrafico("activPlanForm","Actividades Formacion",listaPlanForm,null,null);
	    agregarIndicadorGrafico("activPlanExMed","Actividades Examen Medico",listaPlanExam,null,null);
	 
	    agregarIndicadorGrafico("activPlanDiag","Actividades Diagnostico",listaPlanDiag,listaPlanDiagUnidad,listaPlanDiagArea);
	    agregarIndicadorGrafico("activPlanIns","Actividades Inspeccion",listaPlanIns,listaPlanInsUnidad,listaPlanInsArea);
	    agregarIndicadorGrafico("activPlanAccMejora","Actividades Acciones de Mejora",listaPlanAccMejora,null,null);
	    agregarIndicadorGrafico("activPlanCorrInm","Actividades Acciones Inmediatas",listaPlanCorrecionInm,null,null);

			break;
			
	default:
		alert("Ocurrió un error al traer indicadores de graficos!"+data.CODE_RESPONSE);

}

	
	
}
function procesarLlamadaGraficosRecursos(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var listaUsoEquipos= data.listaUsoEquipos;
		var listaUsoEmergencia= data.listaUsoEmergencia;
		var listaUsoProcedimientos= data.listaUsoProcedimientos;
		var listaUsoEntregaEpp=data.listaUsoEntregaEpp;
		var listaUsoMotivoEntrega=data.listaUsoMotivoEntrega;

	    $("#graficoEst div").remove();
	    agregarIndicadorGraficoRecursos("entregaEppGraf","Entrega de EPP´s",listaUsoEquipos,1);
	    agregarIndicadorGraficoRecursos("equipEmergGraf","Equipos de emergencia Aptos",listaUsoEmergencia,2);
	    agregarIndicadorGraficoRecursos("actualProcGraf","Actualización de Procedimientos",listaUsoProcedimientos,3);
	    agregarIndicadorGraficoRecursos("eppEntregadosGraf","Epp´s entregados",listaUsoEntregaEpp,5);
	    agregarIndicadorGraficoRecursos("motivoEntregGraf","Motivo de Entrega",listaUsoMotivoEntrega,4);
	 	
	    break;
			
	default:
		alert("Ocurrió un error al traer indicadores de graficos!"+data.CODE_RESPONSE);

}

	
	
}



function procesarLlamadaGraficosInversion(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var listaInversionIperc= data.listaInversionIperc;
		var listaInversionIpercUnidad= data.listaInversionIpercUnidad;
		var listaInversionEntregEpp= data.listaInversionEntregEpp;
		var listaInversionForm= data.listaInversionForm;
		var listaInversionExam= data.listaInversionExam;
		var listaInversionDiag= data.listaInversionDiag;
		var listaInversionDiagUnidad= data.listaInversionDiagUnidad;
		var listaInversionDiagArea= data.listaInversionDiagArea;
		var listaInversionIns= data.listaInversionIns;
		var listaInversionInsUnidad= data.listaInversionInsUnidad;
		var listaInversionInsArea= data.listaInversionInsArea;
		var listaInversionAccMejora= data.listaInversionAccMejora;
		var listaInversionCorrecionInm= data.listaInversionCorrecionInm;
		var listaInversionAcuerdosSeguridad=data.listaInversionAcuerdosSeguridad;
		var listaInversionTotal= data.listaInversionTotal;

	    $("#graficoEst div").remove();
	    agregarIndicadorGraficoInversion("activInvTotal","Resumen de Inversiones",listaInversionTotal,null,null);
	    agregarIndicadorGraficoInversion("activInvIPERC","Inversiones IPERC",listaInversionIperc,listaInversionIpercUnidad,null);
	    agregarIndicadorGraficoInversion("activInvForm","Inversiones Formacion",listaInversionForm,null,null);
	    agregarIndicadorGraficoInversion("activInvEntEpp","Inversiones Adquisición Equipos",listaInversionEntregEpp,null,null);
	    agregarIndicadorGraficoInversion("activInvExMed","Inversiones Examen Medico",listaInversionExam,null,null);
	    agregarIndicadorGraficoInversion("activInvDiag","Inversiones Diagnostico",listaInversionDiag,listaInversionDiagUnidad,listaInversionDiagArea);
	    agregarIndicadorGraficoInversion("activInvIns","Inversiones Inspeccion",listaInversionIns,listaInversionInsUnidad,listaInversionInsArea);
	    agregarIndicadorGraficoInversion("activInvAccMejora","Inversiones Acciones de Mejora",listaInversionAccMejora,null,null);
	    agregarIndicadorGraficoInversion("activInvCorrInm","Inversiones Acciones Inmediatas",listaInversionCorrecionInm,null,null);
	    agregarIndicadorGraficoInversion("activInvAcuerdo","Inversiones Disposiciones de grupos de trabajo",listaInversionAcuerdosSeguridad,null,null);

			break;
			
	default:
		alert("Ocurrió un error al traer indicadores de graficos!"+data.CODE_RESPONSE);

}

	
	
}



function procesarLlamadaGraficosAccidentes(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var listaActoSub= data.listaActoSub;
		var listaActoSubUnidad= data.listaActoSubUnidad;
		var listaActoSubArea= data.listaActoSubArea;
		var listaCondSub= data.listaCondSub;
		var listaCondSubUnidad= data.listaCondSubUnidad;
		var listaCondSubArea= data.listaCondSubArea;
		
		var listaIncidentes= data.listaIncidentes;
		var listaIncidentesUnidad= data.listaIncidentesUnidad;
	
		var listaAccLeve= data.listaAccLeve;
		var listaAccLeveUnidad= data.listaAccLeveUnidad;

		var listaAccIncap= data.listaAccIncap;
		var listaAccIncapUnidad= data.listaAccIncapUnidad;
		
		var listaAccFatal= data.listaAccFatal;
		var listaAccFatalUnidad= data.listaAccFatalUnidad;
	

	    $("#graficoEst div").remove();
	    agregarIndicadorGraficoAcc("accActoSub","Actos Subestándar",listaActoSub,null,null,1);
	    agregarIndicadorGraficoAcc("accCondSub","Condiciones subestándar",listaCondSub,null,null,1);
	    agregarIndicadorGraficoAcc("accIncidentes","Incidentes",listaIncidentes,null,null,0);
	    agregarIndicadorGraficoAcc("accAccLeve","Accidentes Leves",listaAccLeve,null,null,0);
	    agregarIndicadorGraficoAcc("accAccIncap","Accidentes Incapacitantes",listaAccIncap,null,null,0);
	    agregarIndicadorGraficoAcc("accAccFatal","Accidentes Fatales",listaAccFatal,null,null,0);

			break;
			
	default:
		alert("Ocurrió un error al traer indicadores de graficos!"+data.CODE_RESPONSE);

}

	
	
}

function procesarLlamadaGraficosInversionMensual(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var listaInversionIperc= data.listaInversionIperc;
		var listaInversionEntregEpp= data.listaInversionEntregEpp;
		var listaInversionForm= data.listaInversionForm;
		var listaInversionExam= data.listaInversionExam;
		var listaInversionDiag= data.listaInversionDiag;
		var listaInversionIns= data.listaInversionIns;
		var listaInversionAccMejora= data.listaInversionAccMejora;
		var listaInversionCorrecionInm= data.listaInversionCorrecionInm;
		var listaInversionAcuerdosSeguridad=data.listaInversionAcuerdosSeguridad;
		campo1=[]	;campo2=[]	;
		campo3=[]	;campo4=[]	;campo5=[]	;
		var rangoFechas=hallarFechas();
		var listaFechaMenor=obtenerFechasLista(rangoFechas,0);
		var anioEstMenor=listaFechaMenor[0];
		var mesEstMenor=listaFechaMenor[1];
		
		for (var index1 = 0; index1 < rangoFechas.length; index1++) {
			
			var listaFecha=obtenerFechasLista(rangoFechas,index1);
			var anioEst=listaFecha[0];
			var mesEst=listaFecha[1];
			campo5.push(anioEst+"-"+mesEst);
			campo1.push(0);
			campo2.push(0);
			campo3.push(0);
			campo4.push(0);
			
	}
		obtenerDataMensualInv(listaInversionIperc);
		obtenerDataMensualInv(listaInversionEntregEpp);
		obtenerDataMensualInv(listaInversionForm);
		obtenerDataMensualInv(listaInversionExam);
		obtenerDataMensualInv(listaInversionDiag);
		obtenerDataMensualInv(listaInversionIns);
		obtenerDataMensualInv(listaInversionAccMejora);
		obtenerDataMensualInv(listaInversionCorrecionInm);
		obtenerDataMensualInv(listaInversionAcuerdosSeguridad);console.log(listaInversionAcuerdosSeguridad);
		var subtotalImpl=0;
		var subtotalCompl=0;
		var subtotalRetrasado=0;
		subtotalImpl=campo1[0]+subtotalImpl;
		subtotalCompl=campo2[0]+subtotalCompl;
		subtotalRetrasado=campo3[0]+subtotalRetrasado;
		campo4[0]=campo2[0]+campo1[0]+campo3[0];
	for (var index1 = 1; index1 < rangoFechas.length; index1++) {
			
		
			campo4[index1]=campo2[index1]+campo1[index1]+campo3[index1]+campo4[index1-1]
			subtotalImpl=campo1[index1]+subtotalImpl;
			subtotalCompl=campo2[index1]+subtotalCompl;
			subtotalRetrasado=campo3[index1]+subtotalRetrasado;
			
	}
	    $("#graficoEst div").remove();
	    crearGraficoLinealBarraCircular("graficoEst","Curva s de inversiones",subtotalImpl,subtotalCompl,subtotalRetrasado);
	   
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores de graficos!"+data.CODE_RESPONSE);

}

	
	
}
function crearGraficoLinealBarraCircular(graficoId,titulo,total1,total2,total3){
	  $("#"+graficoId).highcharts({
	        title: {
	            text: titulo
	        },
	        xAxis: {
	            categories: campo5
	        },
	        labels: {
	            items: [{
	                html: 'Total',
	                style: {
	                    left: '50px',
	                    top: '18px',
	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
	                }
	            }]
	        },
	        series: [{
	            type: 'column',
	            name: 'Inversion En proceso',
	            data: campo1
	        }, {
	            type: 'column',
	            name: 'Inversion completa',
	            data: campo2
	        }, {
	            type: 'column',
	            name: 'Inversion Retrasada',
	            data: campo3
	        }, {
	            type: 'spline',
	            name: 'Acumulada',
	            data: campo4,
	            marker: {
	                lineWidth: 2,
	                lineColor: Highcharts.getOptions().colors[3],
	                fillColor: 'white'
	            }
	        }, {
	            type: 'pie',
	            name: '--',
	            data: [{
	                name: 'Por implementar',
	                y: total1,
	                color: Highcharts.getOptions().colors[0] // Jane's color
	            }, {
	                name: 'Completado',
	                y: total2,
	                color: Highcharts.getOptions().colors[1] // John's color
	            }, {
	                name: 'Retrasado',
	                y: total3,
	                color: Highcharts.getOptions().colors[2] // Joe's color
	            }],
	            center: [100, 80],
	            size: 100,
	            showInLegend: false,
	            dataLabels: {
	                enabled: false
	            }
	        }]
	    });
}
function obtenerDataMensualInv(listaInversion){
	var rangoFechas=hallarFechas();
	var listaFechaMenor=obtenerFechasLista(rangoFechas,0);
	var anioEstMenor=listaFechaMenor[0];
	var mesEstMenor=listaFechaMenor[1];
	for(var index1 = 0; index1 < listaInversion.length; index1++){
		var anioEst=listaInversion[index1].yearId;
		var mesEst=listaInversion[index1].monthId;
		var position=(anioEst-anioEstMenor)*12+(mesEst)-(mesEstMenor);
		campo1[position]=campo1[position]+listaInversion[index1].invImplementar
		campo2[position]=campo2[position]+listaInversion[index1].invCompleto
		campo3[position]=campo3[position]+listaInversion[index1].invRetrasado
	}
}
function procesarLlamadaGraficosAccionAccidente(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var accidentesTiempo= data.accidentesTiempo;
		var accionesTiempo= data.accionesTiempo;
		var accionesCompletasTiempo=data.accionesCompletasTiempo;
		
		var rangoFechas=hallarFechas();
		campo1=[]	;campo2=[]	;campo3=[];campo4=[];
		var listaFechaMenor=obtenerFechasLista(rangoFechas,0);
		var anioEstMenor=listaFechaMenor[0];
		var mesEstMenor=listaFechaMenor[1];
		
		for (var index1 = 0; index1 < rangoFechas.length; index1++) {
			
			var listaFecha=obtenerFechasLista(rangoFechas,index1);
			var anioEst=listaFecha[0];
			var mesEst=listaFecha[1];
			campo3.push(anioEst+"-"+mesEst);
			campo1.push(0);
			campo2.push(0);
			campo4.push(0);
			
	}
		
		for (var index2 = 0; index2 < accidentesTiempo.length; index2++) {
			var anioEst=accidentesTiempo[index2].yearId;
			var mesEst=accidentesTiempo[index2].monthId;
			var position=(anioEst-anioEstMenor)*12+(mesEst)-(mesEstMenor);
			campo1[position]=accidentesTiempo[index2].indicador
				
		};
		for (var index2 = 0; index2 < accionesTiempo.length; index2++) {
			var anioEst=accionesTiempo[index2].yearId;
			var mesEst=accionesTiempo[index2].monthId;
			var position=(anioEst-anioEstMenor)*12+(mesEst)-(mesEstMenor);
			campo2[position]=accionesTiempo[index2].indicador
				
		};
		for (var index2 = 0; index2 < accionesCompletasTiempo.length; index2++) {
			var anioEst=accionesCompletasTiempo[index2].yearId;
			var mesEst=accionesCompletasTiempo[index2].monthId;
			var position=(anioEst-anioEstMenor)*12+(mesEst)-(mesEstMenor);
			campo4[position]=accionesCompletasTiempo[index2].indicador
				
		};
	    $("#graficoEst div").remove();
	    crearGraficoLinealBarra('',"graficoEst","Acciones Pendientes vs Acciones Completadas vs Accidentes Incapacitantes",
	    		"Accidentes",campo1,"Acciones Pendientes",campo2,"Acciones Completadas",campo4)
	    
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores de graficos!"+data.CODE_RESPONSE);

}
}



function calcularAnchoGrafico(divId){
	
	var anchoGrafico=$("#emp"+divId).width()+
	$("#unidad"+divId).width()+
	$("#area"+divId).width();
	if(anchoGrafico<1300){
		anchoGrafico=1300
	}
$("#"+divId).css("width",anchoGrafico);
	
	
	
	
}

function verDetalleUnidad(divId){

	$("#unidad"+divId).toggle();
	$("#area"+divId).hide();
}
function verDetalleArea(divId){
	$("#area"+divId).toggle();
	$("#unidad"+divId).hide();
}


function crearGraficoLinealBarra(unidadNombre,graficoId,graficoTitulo,tituloy1,ejey1,tituloy2,ejey2,tituloy3,ejey3){
	
				
	$("#"+graficoId).highcharts({
		title: {
            text: graficoTitulo
        },
        xAxis: {
            categories: campo3
        },
        yAxis:{
        	title:"Cantidad"
        },
        labels: {
            
        },
        series: [{
            type: 'column',
            name: tituloy1,
            data: ejey1,
           
            	color:"blue"
          
        },   {
            type: 'spline',
            name: tituloy2,
            data: ejey2,	color:"#9BBB59",
            marker: {
                lineWidth: 2,
                lineColor: "orange",
                fillColor: 'white'
            }
        },   {
            type: 'spline',
            name: tituloy3,
            data: ejey3,	color:"#F79646",
            marker: {
                lineWidth: 2,
                lineColor:"green",
                fillColor: 'white'
            }
        }]
    });
	
	
}


