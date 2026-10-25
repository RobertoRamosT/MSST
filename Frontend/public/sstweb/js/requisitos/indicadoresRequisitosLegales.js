var listFullEmpresaNormaIndicador,listFullEmpresaNormaOtrasIndicador;

var normTotal=0,normRev=0,normRevParcial=0,normSinRev=0;
var normCumple1=0,normCumple2=0,normCumple3=0;
$(function() {
	$("#btnIndicadorRequisitos").attr("onclick","javascript: mostrarIndicadoresEmpre();");
});

function verIndicadoresRequisitos(){
	$("#tabNormaLegalEmpresa .container-fluid").hide();
	$("#divContainNormaLegalEmpresa").hide();
	$("#divContainIndicadoresRequisitos").show();
	$("#tabNormaLegalEmpresa").find("h2")
	.html("<a onclick=' volverNormaEmpresa()'>Norma Legales Aplicables</a>"
			+"> Indicadores de Requisitos Legales");
	cargarIndicadoresRequisitos();
}

function cargarIndicadoresRequisitos(){
	$("#tblIndicadoresRequisitos thead tr").remove();
	$("#tblIndicadoresRequisitos tbody tr").remove();
	$("#tblIndicadoresRequisitos thead").html( 
			"<tr>"+
				"<th style='width:250px;' class='tb-acc' >Indicadores</th>"+
			"</tr>"
		);
	$("#tblIndicadoresRequisitos tbody").html(
			"<tr id='indicador1'>"+
				"<td  >Fecha de la Última Revisión </td>" +
			"</tr>"+
			"<tr id='indicador2'>"+
				"<td  ># de Articulos Totales </td>"+
			"</tr>"+
			"<tr id='indicador3'>"+
				"<td style='background-color:#df9226; color:white;'> # de Articulos Aplicables </td>"+
			"</tr>"+
			"<tr id='indicador4'>"+
				"<td style='background-color:#df9226; color:white;'># de Articulos Informativos</td>"+
			"</tr>"+
			"<tr id='indicador5'>"+
				"<td style='background-color:#df9226; color:white;'># de Articulos No Aplicables</td>"+
			"</tr>"+
			"<tr id='indicador6'>"+
				"<td style='background-color:#2e9e8f; color:white;'># de Articulos que Cumplen</td>"+
			"</tr>"+
			"<tr id='indicador7'>"+
				"<td style='background-color:#2e9e8f; color:white;'># de Articulos que Cumplen Parcialmente</td>"+
			"</tr>"+
			"<tr id='indicador8'>"+
				"<td style='background-color:#2e9e8f; color:white;'># de Articulos que No Cumplen</td>"+
			"</tr>"+
			"<tr id='indicador9'>"+
				"<td style='background-color:#2e9e8f; color:white;'># de Articulos No Evaluados</td>"+
			"</tr>"+
			"<tr id='indicador10'>"+
				"<td  ># de Acciones de Mejora Programadas</td>"+
			"</tr>"+
			"<tr id='indicador11'>"+
				"<td  ># de Acciones de Mejora Completadas</td>"+
			"</tr>"+
			"<tr id='indicador12'>"+
				"<td  ># de Acciones de Mejora en Proceso</td>"+
			"</tr>"+
			"<tr id='indicador13'>"+
				"<td  ># de Acciones de Mejora Retrasadas</td>"+
			"</tr>"+
			"<tr id='indicador14'>"+
				"<td>Resultado de la ultima revisión</td>"+
			"</tr>"
			);
	
	var empresa=getSession("gestopcompanyid"); ;
	callAjaxPost(URL + '/requisitos/norma/empresa/indicadores', {
		idCompany :empresa
	},
	function(data){
		listFullEmpresaNormaIndicador=data.normaIndicador;
		normTotal=0,normRev=0,normRevParcial=0,normSinRev=0;
		normCumple1=0,normCumple2=0,normCumple3=0;
		
		if(listFullEmpresaNormaIndicador.length>0){
			normTotal=listFullEmpresaNormaIndicador.length;
			var ind2=0,ind3=0,ind4=0,ind5=0,ind6=0,ind7=0,ind8=0,ind9=0,ind10=0,ind11=0,ind12=0;ind13=0,
			listFullEmpresaNormaIndicador.forEach(function(val, index) {
				var numArtEval=val.numArticulos-val.numArtNoEval;
				
				if(val.numArticulos>0){
					if(val.numArticulos==numArtEval){
						normRev++;
					}else if(val.numArticulos>numArtEval && numArtEval>0){
						normRevParcial++;
					}
					
					var cumplimiento=(val.numArtEvalCumple/val.numArticulos);
					console.log(cumplimiento);
					
					if(cumplimiento<=1 && cumplimiento>=0.8){
						normCumple2++;
					}else if(cumplimiento<0.8 && cumplimiento>=0.6){
						normCumple1++;
					}else if(cumplimiento<0.6 && cumplimiento>=0){
						normCumple3++;
					}
				}else{
					normCumple3++;
				}
				
				if(val.numArticulos==val.numArtNoEval){
					normSinRev++;
				}
				
				var resultado;
				
				if(val.numArtEvalAplica>0){
					resultado=(val.numArtEvalCumple/val.numArtEvalAplica)+"%";
				}else{
					resultado="0%"
				}
				
				$("#tblIndicadoresRequisitos thead tr").append( 
						"<th class='tb-acc'  style='width:180px;' id='normempcod"+val.id+"'>"+val.codigo+"</th>"
						);
				$("#tblIndicadoresRequisitos tbody #indicador1").append("<td id='normemp"+val.id+"'>"+val.ultimaFechaRevision+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador2").append("<td id='normemp"+val.id+"'>"+val.numArticulos+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador3").append("<td id='normemp"+val.id+"'>"+val.numArtEvalAplica+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador4").append("<td id='normemp"+val.id+"'>"+val.numArtEvalInformativo+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador5").append("<td id='normemp"+val.id+"'>"+val.numArtEvalNoAplica+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador6").append("<td id='normemp"+val.id+"'>"+val.numArtEvalCumple+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador7").append("<td id='normemp"+val.id+"'>"+val.numArtEvalCumpleParcial+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador8").append("<td id='normemp"+val.id+"'>"+val.numArtEvalNoCumple+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador9").append("<td id='normemp"+val.id+"'>"+val.numArtNoEval+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador10").append("<td id='normemp"+val.id+"'>"+val.numAccionesTotal+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador11").append("<td id='normemp"+val.id+"'>"+val.numAccionesCompletadas+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador12").append("<td id='normemp"+val.id+"'>"+val.numAccionesEnProceso+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador13").append("<td id='normemp"+val.id+"'>"+val.numAccionesRetrasado+"</td>");
				$("#tblIndicadoresRequisitos tbody #indicador14").append("<td id='normemp"+val.id+"'>"+resultado+"</td>");
				
				ind2+=val.numArticulos;
				ind3+=val.numArtEvalAplica;
				ind4+=val.numArtEvalInformativo;
				ind5+=val.numArtEvalNoAplica;
				ind6+=val.numArtEvalCumple;
				ind7+=val.numArtEvalCumpleParcial;
				ind8+=val.numArtEvalNoCumple;
				ind9+=val.numArtNoEval;
				ind10+=0;
				ind11+=0;
				ind12+=0;
				ind13+=0;
			});
		}
		$("#tblIndicadoresRequisitos thead tr").append( 
				"<th class='tb-acc'  style='width:200px;' id='indicadorTotal'>Total</th>"
				);
		$("#tblIndicadoresRequisitos tbody #indicador1").append("<td >"+"------"+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador2").append("<td id='indicadorTotal'>"+ind2+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador3").append("<td id='indicadorTotal'>"+ind3+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador4").append("<td id='indicadorTotal'>"+ind4+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador5").append("<td id='indicadorTotal'>"+ind5+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador6").append("<td id='indicadorTotal'>"+ind6+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador7").append("<td id='indicadorTotal'>"+ind7+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador8").append("<td id='indicadorTotal'>"+ind8+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador9").append("<td id='indicadorTotal'>"+ind9+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador10").append("<td id='indicadorTotal'>"+0+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador11").append("<td id='indicadorTotal'>"+0+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador12").append("<td id='indicadorTotal'>"+0+"</td>");
		$("#tblIndicadoresRequisitos tbody #indicador13").append("<td id='indicadorTotal'>"+0+"</td>");
		formatoCeldaSombreableTabla(true, "tblIndicadoresRequisitos");
		resizeDivWrapper("wrapIndicadoresRequisitos",220);
		goheadfixedZ("#tblIndicadoresRequisitos","#wrapIndicadoresRequisitos",100);
	});
}


function mostrarIndicadoresEmpre(){
    
	$("#modalIndicadoresEmpresa").modal("show");
	$("#tblIndicadoresEmpresa thead tr").remove();
	$("#tblIndicadoresEmpresa tbody tr").remove();
	$("#tblIndicadoresEmpresa thead").html( 
			"<tr>"+
			"<th class='tb-acc' >Indicadores</th>"+
			"<th class='tb-acc' >Total</th>"+
			"</tr>"
		);
	$("#tblIndicadoresEmpresa tbody").html(
			"<tr id='indicador1'>"+
				"<td># De Normas Totales</td>" +
			"</tr>"+
			"<tr id='indicador2'>"+
				"<td style='background-color:#df9226; color:white;'># de Normas Revisadas</td>"+
			"</tr>"+
			"<tr id='indicador3'>"+
				"<td style='background-color:#df9226; color:white;'> # de Normas Revisadas Parcialmente</td>"+
			"</tr>"+
			"<tr id='indicador4'>"+
				"<td style='background-color:#df9226; color:white;'># de Normas  Sin Revisar </td>"+
			"</tr>"+
			"<tr id='indicador5'>"+
				"<td style='background-color:#2e9e8f; color:white;'># de Normas que Cumplen entre 80% y 100% del total de Requisitos</td>"+
			"</tr>"+
			"<tr id='indicador6'>"+
				"<td style='background-color:#2e9e8f; color:white;'># de Normas que Cumplen entre 60% y 80% del total de Requisitos</td>"+
			"</tr>"+
			"<tr id='indicador7'>"+
				"<td style='background-color:#2e9e8f; color:white;'># de Normas que Cumplen menos del 60% del total de Requisitos</td>"+
			"</tr>" 
			);   
	
	$("#tblIndicadoresEmpresa tbody #indicador1").append("<td id='normemp1'>"+normTotal+"</td>");
	$("#tblIndicadoresEmpresa tbody #indicador2").append("<td id='normemp2'>"+normRev+"</td>");
	$("#tblIndicadoresEmpresa tbody #indicador3").append("<td id='normemp3'>"+normRevParcial+"</td>");
	$("#tblIndicadoresEmpresa tbody #indicador4").append("<td id='normemp4'>"+normSinRev+"</td>");
	$("#tblIndicadoresEmpresa tbody #indicador5").append("<td id='normemp5'>"+normCumple1+"</td>");
	$("#tblIndicadoresEmpresa tbody #indicador6").append("<td id='normemp6'>"+normCumple2+"</td>");
	$("#tblIndicadoresEmpresa tbody #indicador7").append("<td id='normemp7'>"+normCumple3+"</td>");
	formatoCeldaSombreableTabla(true, "tblIndicadoresEmpresa");
}

