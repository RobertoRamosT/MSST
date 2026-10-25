/**
 * 
 */
var listFullTrabajadores=[];
var trabajadorMovilId;
var indexMovil;
function procesarDataMovilDescargadaPrimerEstado(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#trabajadoresGosstMovil").show();
		$("#trabajadoresGosstDesktop").hide();
		var list = data.list;
		listFullTrabajadores=list;
		var divTrabajadores=$("#divTrabajadorGosst");
		
		divTrabajadores.html("");
		list.forEach(function(val,index){
			divTrabajadores.append("<div class='divTrabajadorGosst' id='trabajadorMovil"+val.trabajadorId+"'>" +
					"" +val.trabajadorNombre+
					"<div class='objetivosTrabajadorGosst' onclick='verObjetivosTrabajdorMovil("+index+")'>" +
							"<i class='fa fa-search' aria-hidden='true'></i> </div>" +
					"</div>");
		});
		
		if(sessionStorage.getItem("trabajadorGosstId")>0){
			list.every(function(val,index){
				if(val.trabajadorId==sessionStorage.getItem("trabajadorGosstId")){
					verObjetivosTrabajdorMovil(index);
					return true;
				}else{
					return false;
				}
			});
		}
		completarBarraCarga();
		break;
	default:
		console.log("error")
		break;
	}
}

function verObjetivosTrabajdorMovil(pindex){
	trabajadorMovilId=listFullTrabajadores[pindex].trabajadorId;
	var restriccionMedica=listFullTrabajadores[pindex].restriccion;
	if(restriccionMedica.length==0){
		restriccionMedica="No tiene restricciones";
	}else{
		restriccionMedica="Restricción: "+restriccionMedica;
	}
	indexMovil=pindex;
	var objTrab = {
			trabajadorId :trabajadorMovilId,
			palabraEspacio:"<br>" 
		};
	$("#trabajadorMovil"+trabajadorMovilId).find (".objetivosTrabajadorGosst").attr("onclick","volverTrabajadoresMovil()")
	.html("<i class='fa fa-undo' aria-hidden='true'></i> ");
	callAjaxPostNoLoad(URL + '/trabajador/puntajes', objTrab,
			function(data){
		var indicadoresSeguridad = data.indicadoresSeguridad;

		var indEvento = data.indEvento;
		var indAcc = data.indAcc;
		var  indEpp = data.indEpp;
		var indExam = data.indExam;
		var indFormacion = data.indFormacion;
		var listActosReportados=data.listActosReportados;
		var primerDia = new Date();
		primerDia=convertirFechaNormal2(primerDia);
		var capacitacionesTrab=[];
		if(indFormacion.length>0){
			capacitacionesTrab=indFormacion[0].caps;
		}
		
		var indicadorRangoActual=1;
		var capacitacionesTabla="<div class='detalleFormacionTrabajador' style='background-color:"+"#0a7572"+";color:white;   border: 1px solid black;'>" +
		"<div style='width:33%; display:inline-block'>"+"Tema"+"</div>" +
		"<div style='width:33%; display:inline-block'>"+"Fecha Próxima / Vigente"+"</div>" +
		"<div style='width:33%; display:inline-block'>"+"Hora"+"</div>" +
		"</div>";
		var participacionTabla="<div class='detalleParticipacionTrabajador' style='background-color:"+"#0a7572"+";color:white;   border: 1px solid black;'>" +
		"<div style='width:33%; display:inline-block'>"+"Tipo"+"</div>" +
		"<div style='width:33%; display:inline-block'>"+"Descripción"+"</div>" +
		"<div style='width:33%; display:inline-block'>"+"Acción Mejora"+"</div>" +
		"</div>";
		var eppsTabla="<div class='detalleEppsTrabajador' style='background-color:"+"#0a7572"+";color:white;   border: 1px solid black;'>" +
		"<div style='width:50%; display:inline-block'>"+"EPP"+"</div>" +
		"<div style='width:50%; display:inline-block'>"+"Próxima Renovación"+"</div></div>" ;
		
		var colorFondo="white";
		var horaProgramada="-----";
		for(var index22=0;index22<capacitacionesTrab.length;index22++){
			if(index22==0){
				indicadorRangoActual=0
			}
			var programs=capacitacionesTrab[index22].programsCap;
			colorFondo="white"
			var textoFechaVigencia="----";
			 horaProgramada="-----";
			for(var index31=0;index31<programs.length;index31++){
				var primerDia = new Date();
				primerDia=convertirFechaNormal2(primerDia);
				if(programs[index31].fechaPlaTexto==null){
					programs[index31].fechaPlaTexto=primerDia;
				}
				
				if(programs[index31].fechaRealTexto==null){
					programs[index31].fechaRealTexto=programs[index31].fechaPlaTexto;
				}
				var enRangoInicial=fechaEnRango(primerDia,programs[index31].fechaPlaTexto,programs[index31].fechaRealTexto)
				
				if(restaFechas(programs[index31].fechaPlaTexto,primerDia)<0  ){ 
					textoFechaVigencia=convertirFechaNormal(programs[index31].fechaRealTexto);
					horaProgramada=programs[index31].horaPlanificada;
				}
				
				if(programs[index31].tipoNotaTrabId==1 && enRangoInicial ){
					colorFondo="#9BBB59"; 
					textoFechaVigencia=convertirFechaNormal(programs[index31].fechaRealTexto);
					indicadorRangoActual=
						indicadorRangoActual+(1/capacitacionesTrab.length);
					index31=programs.length;
					 horaProgramada="-----";
				}
				
				
			}
		
			capacitacionesTabla+="<div class='detalleFormacionTrabajador' style='background-color:"+colorFondo+";    border: 1px solid black;'>" +
					"<div style='width:33%; display:inline-block'>"+capacitacionesTrab[index22].capacitacionNombre+"</div>" +
					"<div style='width:33%; display:inline-block'>"+textoFechaVigencia+"</div>" +
					"<div style='width:33%; display:inline-block'>"+horaProgramada+"</div>" +
					"</div>";
		}
		////
		
				var examsTrab=[];
				if(indExam.length>0){
					examsTrab=indExam[0].exams;
				}
				var fechaExamen="Sin exámenes";
				for(var index22=0;index22<examsTrab.length;index22++){
					
					var programs=examsTrab[index22].programsExams;
					
					for(var index33=0;index33<programs.length;index33++){
						var primerDia = new Date();
						primerDia=convertirFechaNormal2(primerDia);
						if(programs[index33].fechaInicialTexto==null){
							programs[index33].fechaInicialTexto=primerDia;
						}
						if(programs[index33].fechaFinTexto==null){
							programs[index33].fechaFinTexto=programs[index33].fechaInicialTexto;
						}
						var enRangoInicial=fechaEnRango(primerDia,programs[index33].fechaInicialTexto,programs[index33].fechaFinTexto)
						var  boolEntreFechas=false;
						if(enRangoInicial ){
							 boolEntreFechas=true;
						}
						if(programs[index33].tipoNotaTrabId==1 &&boolEntreFechas ){
							fechaExamen=convertirFechaNormal(programs[index33].fechaFinTexto);
							index33=programs.length;

							index22=examsTrab.length;
						}
					}
				
					
				}
				
		///
		
				var eppsTrabajador=[];
				if(indEpp.length>0){
					eppsTrabajador=indEpp[0].epps;
				}
				var indicadorEpp=1;
				for(var index22=0;index22<eppsTrabajador.length;index22++){
					if(index22==0){
						indicadorEpp=0
					}
					var colorFondo="white";
					var textoFechaVigenciaEpp="---";
					var programs=eppsTrabajador[index22].programsEpp;
					
					for(var index31=0;index31<programs.length;index31++){
						var primerDia = new Date();
						primerDia=convertirFechaNormal2(primerDia);
						if(programs[index31].fechaPlanificadaTexto==null){
							programs[index31].fechaPlanificadaTexto=primerDia;
						}
						if(programs[index31].fechaEntregaTexto==null){
							programs[index31].fechaEntregaTexto=programs[index31].fechaPlanificadaTexto;
						}
						var enRangoInicial=fechaEnRango(primerDia,programs[index31].fechaPlanificadaTexto,programs[index31].fechaEntregaTexto)
						var  boolEntreFechas=false;
						if(enRangoInicial ){
							 boolEntreFechas=true;
						}
						if(restaFechas(programs[index31].fechaPlanificadaTexto,primerDia)<0  ){
							textoFechaVigenciaEpp=convertirFechaNormal(programs[index31].fechaEntregaTexto);
							horaProgramada=programs[index31].horaPlanificada;
						}
						if(programs[index31].tipoNotaTrabId!=null && boolEntreFechas ){
							colorFondo="#9BBB59"; 
							textoFechaVigenciaEpp=convertirFechaNormal(programs[index31].fechaEntregaTexto);
							indicadorEpp=
								indicadorEpp+(1/eppsTrabajador.length);
							index31=programs.length;
						}
					}
					eppsTabla+="<div class='detalleEppsTrabajador' style='background-color:"+colorFondo+";    border: 1px solid black;'>" +
					"<div style='width:50%; display:inline-block'>"+eppsTrabajador[index22].equipoSeguridadNombre+"</div>" +
					"<div style='width:50%; display:inline-block'>"+textoFechaVigenciaEpp+"</div>" + 
					"</div>";
					
				}
				
			//
				listActosReportados.forEach(function(val,index){
					participacionTabla+="<div class='detalleParticipacionTrabajador' style='background-color:"+"white"+";    border: 1px solid black;'>" +
					"<div style='width:33%; display:inline-block'>"+val.acInseguroTipoNombre+"</div>" +
					"<div style='width:33%; display:inline-block'>"+val.acInseguroNombre+"</div>" +
					"<div style='width:33%; display:inline-block'>"+val.iconoEstadoAccion+""+val.nombreAccionMejora+"</div>" +
					"</div>";
				});
				var dias=	indAcc[0].indicadorDiasDescanso*5*52	;
				var reportes = indEvento[0].numEventosReportados;

		
		$(".divTrabajadorGosst").hide();
		$("#trabajadorMovil"+trabajadorMovilId).show();
		var divTrabajadores=$("#divTrabajadorGosst");
		
		divTrabajadores.append("<div class='listOpcionFiltroGosst' onclick='verFormacionesTrabajadorMovil()'>" +
				"<div class='tituloFiltro'>" +
				"<i aria-hidden='true' class='fa fa-graduation-cap'></i>" +
				"Formación" +
				"</div>" +
					"<div class='opcionFiltroGosst'>" +
					pasarDecimalPorcentaje(indicadorRangoActual,2)+
					"</div>"+
					capacitacionesTabla+
				"</div>")
				.append("<div class='listOpcionFiltroGosst' onclick='verEppsTrabajadorMovil()'>" +
				"<div class='tituloFiltro'>" +
				"<i aria-hidden='true' class='fa fa-fire-extinguisher'></i>" +
				"Entrega de Equipos" +
				"</div>" +
				"<div class='opcionFiltroGosst'>" +
				pasarDecimalPorcentaje(indicadorEpp,2)+
				"</div>"+
				eppsTabla+
				"</div>")
				.append("<div class='listOpcionFiltroGosst'>" +
				"<div class='tituloFiltro'>" +
				"<i aria-hidden='true' class='fa fa-medkit'></i>" +
				"Exámenes Médicos" +
				"</div>" +
				"<div class='opcionFiltroGosst'>" +
				"Vigente hasta: "+fechaExamen+", <br>"+restriccionMedica+
				"</div>"+
				"</div>")
				.append("<div class='listOpcionFiltroGosst' onclick='verParticipacionTrabajadorMovil()'>" +
				"<div class='tituloFiltro'>" +
				"<i aria-hidden='true' class='fa fa-exclamation-triangle'></i>" +
				"Participación" +
				"</div>" +
				"<div class='opcionFiltroGosst'>" +
				"Reportes: "+reportes+
				"</div>"+
				participacionTabla+
				"</div>")
				.append("<div class='listOpcionFiltroGosst'>" +
				"<div class='tituloFiltro'>" +
				"<i aria-hidden='true' class='fa fa-font'></i>" +
				"Disponibilidad" +
				"</div>" +
				"<div class='opcionFiltroGosst'>" +
				" "+dias+"/260"+
				"</div>"+
				"</div>");
		
		
		$(".listOpcionFiltroGosst .opcionFiltroGosst").show()
		
	});
	 
	// /////////
	 
}

function volverTrabajadoresMovil(){
	$("#trabajadorMovil"+trabajadorMovilId).find (".objetivosTrabajadorGosst").attr("onclick","verObjetivosTrabajdorMovil("+indexMovil+")")
	.html("<i class='fa fa-search' aria-hidden='true'></i> ");
	$(".divTrabajadorGosst").show();
	$(".listOpcionFiltroGosst").remove();
}


function verFormacionesTrabajadorMovil(){
	$(".detalleFormacionTrabajador").toggle();
}
function verParticipacionTrabajadorMovil(){
	$(".detalleParticipacionTrabajador").toggle();

}

function verEppsTrabajadorMovil(){
	$(".detalleEppsTrabajador").toggle();

}


