var indicadorGeneralId,indicadorGeneralObj;
var banderaEdicion1=false;
var listTipoIndicadorGeneral;
var listFullIndicadorGeneral;
var listModulosIndicadorGeneral;
var listTabs=[
              {id:1,nombre:"Indicador General" },
             // {id:2,nombre:"Extras"    }, 
              ];
$(function(){
    var selTabIndicadorGeneral=crearSelectOneMenuOblig("selTabInspeccionCalidad", "verAcordeTabInspeccionCalidad()", listTabs, "1", "id","nombre"); 
    $("#divListaTabs").html("Pestaña: "+selTabIndicadorGeneral);
    insertMenuPrimeraVez(function(){verAcordeTabIndicadorGeneral()}); 
})




/**
 * 
 */
function verAcordeTabIndicadorGeneral(){
    	var tabId=$("#selTabInspeccionCalidad").val();
	var tabNombre="";
	$(".tab-content .tab-pane").hide();
	switch(parseInt(tabId)){
	case 1:
		tabNombre="tabIndicadorGeneral";
		cargarIndicadorGeneral();
		break;
		/*
	case 2:
		tabNombre="tabExtra"
		cargarExtra();
		break;
		*/ 
	}
	completarBarraCarga();
	    cargarGraficoIndicador(1);
	$("#"+tabNombre).show();
}
function cargarGraficoIndicador(){
    if(!$("#wrapperGraficoModuloIndicadorGeneral").is(":visible")){
	 
	setTimeout(cargarGraficoIndicador, 1000);
	return;
    }
	resizeDivWrapper("wrapperGraficoModuloIndicadorGeneral",400);
	$("#wrapperGraficoModuloIndicadorGeneral").width("100%");
	var listModulosNombre=[];
	var listUsuario=[];
	listModulosIndicadorGeneral.forEach(function(val){
	    listModulosNombre.push([""+val.nombres])
	});
	
	
	Highcharts.chart('wrapperGraficoModuloIndicadorGeneral', {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Visitas por módulo'
	    },
	 
	    xAxis: {
	        categories: 'category',
	        crosshair: true
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: 'Population (millions)'
	        }
	    },
	    tooltip: {
	        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
	        footerFormat: '</table>',
	        shared: true,
	        useHTML: true
	    },
	    plotOptions: {
	        column: {
	            pointPadding: 0.2,
	            borderWidth: 0
	        }
	    },
	    series: [{
	        name: 'Population',
	        data: listUsuario,
	        dataLabels: {
	            enabled: true,
	            rotation: -90,
	            color: '#FFFFFF',
	            align: 'right',
	            format: '{point.y:.1f}', // one decimal
	            y: 10, // 10 pixels down from the top
	            style: {
	                fontSize: '13px',
	                fontFamily: 'Verdana, sans-serif'
	            }
	        }
	    }]
	});
    /*
	Highcharts.chart('wrapperGraficoModuloIndicadorGeneral', {
	
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Visitas por módulo'
	    }, 
	    xAxis: {
	        type: 'category',
	        labels: {
	            rotation: -45,
	            style: {
	                fontSize: '13px',
	                fontFamily: 'Verdana, sans-serif'
	            }
	        }
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: 'Population (millions)'
	        }
	    },
	    legend: {
	        enabled: false
	    },
	    tooltip: {
	        pointFormat: 'Population in 2017: <b>{point.y:.1f} millions</b>'
	    },
	    series: [{
	        name: 'Population',
	        data: listModulosNombre,
	        dataLabels: {
	            enabled: true,
	            rotation: -90,
	            color: '#FFFFFF',
	            align: 'right',
	            format: '{point.y:.1f}', // one decimal
	            y: 10, // 10 pixels down from the top
	            style: {
	                fontSize: '13px',
	                fontFamily: 'Verdana, sans-serif'
	            }
	        }
	    }]
	});
    */
}
function cargarIndicadorGeneral() {
    //cargarGraficoIndicador(2);
    //cargarGraficoIndicador(3);
    //cargarGraficoIndicador(4);
    //cargarGraficoIndicador(5);
	resizeDivWrapper("wrapperIndicadorGeneral",200)
	banderaEdicion1 = false;
	callAjaxPost(URL + '/indicadorgeneral', 
			{empresaId : getSession("gestopcompanyid") }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion1=false;
					listModulosIndicadorGeneral=data.modulos;
					listTipoIndicadorGeneral=data.listTipos;
					listFullIndicadorGeneral = data.list;
					$("#tblIndicadorGeneral tbody tr").remove();
					listFullIndicadorGeneral.forEach(function(val,index){
						 
					$("#tblIndicadorGeneral tbody").append( 
						"<tr id='trindge"+val.id+"'>" +
							"<td id='tdac"+val.id+"' >"+val.idaccion+"</td>" + 
							"<td id='tddes"+val.id+"'>"+val.descripcion+"</td>"+
							"<td id='tdfech"+val.id+"'>"+val.fecha+"</td>" +
							"<td id='tdusu"+val.id+"'>"+val.usuario+"</td>" +
							"<td id='tdds"+val.id+"'>"+val.dataSize+"</td>" +
							"<td id='tdmod"+val.id+"'>"+val.moduloId+"</td>" +
							
							//Agregar filas
						"</tr>");
					});
					goheadfixedY("#tblIndicadorGeneral","#wrapperIndicadorGeneral");
				}else{
					console.log("NOPNPO")
				}
			});

	
}
