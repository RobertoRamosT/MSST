/**
 * 
 */

function habilitarVigilnaciaTrabajador(){
    
	var dataParam2 = {
			trabajador:{trabajadorId :getSession("trabajadorGosstId") }
		};
	
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgos', dataParam2,function(data){
		var list = data.list;
		var contenidoImplementar="", contenidoCompletado="", contenidoRetrasado="";
		 
		var implementarNum=0,completarNum=0,retrasadoNum=0;
		list.sort(function(a,b){
			return new Date(b.fecha) - new Date(a.fecha);
			});
		list.forEach(function(val,index){
			var colorFondo="gray";
			var textEvi="<a class='btn btn-success' href='"+URL +"/examenmedico/vigilancia_medica/hallazgo/evidencia?id="+val.id+"' target='_blank'  >" +
			"<i class='fa fa-download'> </i>Descargar</a>";
			if(val.evidenciaNombre.length>0){
				val.evidenciaNombre="<a class='efectoLink' target='_blank' "
				 +"href='"+URL+"/examenmedico/vigilancia_medica/hallazgo/evidencia?id="+val.id+"'>"+val.evidenciaNombre+"</a>";
			}else{
				textEvi="";
				val.evidenciaNombre="<strong style='color:red'>No hay evidencia</strong>";
			}
			var lineasFecha="" ;
			if(val.estado.id==2){
				lineasFecha="<div > <i class='fa fa-calendar-check-o'></i>  Fecha Realizada: "+val.fechaRealTexto+ "</div>" + 
				"<div ><i class='fa fa-clock-o'></i>  Hora Realizada: "+val.horaRealTexto+"    </div>" 
			}
			var textReco="";
			switch (val.tipo.id){
			case 1:
				if(val.restriccion==null){val.restriccion=""};
				textReco="<div><i class='fa fa-bullhorn'></i> Recomendaciones: <strong>"+val.recomendacion+"</strong></div>"+
				"<div><i class='fa fa-exclamation-triangle'></i> Restricciones: <strong>"+val.restriccion+"</strong></div>";
				break;
			case 2:
				if(val.hallazgoPrimero.restriccion==null){val.hallazgoPrimero.restriccion=""};
				textReco="<div><i class='fa fa-bullhorn'></i> Recomendaciones: <strong>"+val.hallazgoPrimero.recomendacion+"</strong></div>"+
				"<div><i class='fa fa-exclamation-triangle'>Restricciones: <strong>"+val.hallazgoPrimero.restriccion+"</strong> </div>";
				break;
			case 3:
			case 4:
				textReco="<div>Nuevas Recomendaciones: <strong>"+val.recomendacionNueva+"</strong></div>";
				break;
			}
			var textIn ="<div class='detalleFormacionTrabajador' style='border-left: 10px solid "+val.estado.color+";   '>" + 
			"<div style='font-weight:600;font-size:15px'>"+val.tipo.nombre+"</div>" +
			"<div style='font-weight:600;font-size:15px'>"+val.categoria.nombre+"</div>" +
			"<div > <i class='fa fa-calendar'></i>  Fecha Planificada: "+val.fechaPlanificadaTexto+ "</div>" + 
			"<div ><i class='fa fa-clock-o'></i>  Hora Planificada: "+val.horaPlanificadaTexto+"    </div>" + 
			lineasFecha+textReco+
			"<div><i class='fa fa-download'></i>  "+val.evidenciaNombre+" </div>" +  
			"</div>";
			if(val.estado){
				switch(val.estado.id){
				case 1:
					contenidoImplementar+=textIn;
					implementarNum++;
					break;
				case 2:
					contenidoCompletado+=textIn;
					completarNum++;
					break;
				case 3:
					contenidoRetrasado+=textIn;
					retrasadoNum++;
					break;
				default:
					contenidoImplementar+=textIn;
					implementarNum++;
					break;
				}
			}
		});
		
		var listPaneles=[
		                 {id:"divImplementar",nombre:"Controles Por asistir ("+implementarNum+")",contenido:contenidoImplementar},
		                 {id:"divCompletado",nombre:"Controles Completados ("+completarNum+")",contenido:contenidoCompletado},
		                 {id:"divRetrasado",nombre:"Controles Retrasados ("+retrasadoNum+")",contenido:contenidoRetrasado}
		                 ]
		agregarPanelesDivPrincipalColaborador(listPaneles);
	 
		 
		  
	  
	})
	
}