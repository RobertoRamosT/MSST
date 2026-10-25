$(function(){
	
	$('#buscadorTrabajadorInput').keyup(function(e){
	    if(e.keyCode == 13)
	    {
	        $(this).trigger("enterKey");
	    }
	});
	$('#buscadorTrabajadorInput').bind("enterKey",function(e){
		llamarIndicadorExMedico();
		});
	$("#buscadorTrabajadorInput").focus();
	
	$("#resetBuscador").attr("onclick","resetBuscador()");
	
})
var listTrabajadores;
var contadorListTrab;
var detalleVigenciaExam;
function llamarIndicadorExMedico(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 listTrabajadores="";
	 contadorListTrab=0;
		var auxUnidadId=$("#selUnidad").val().split("-");
		var unidadId=auxUnidadId[0];
		
	 var dataParam = {
			 empresaId : sessionStorage.getItem("gestopcompanyid"),
				mdfId :(unidadId=="-1"?null:unidadId) ,
				fechaInicio: fechaInicio,
				fechaFin: fechaFin ,
				
				};
	 
			callAjaxPost(URL + '/estadistica/examen', dataParam,
					procesarLlamarIndicadorExMedico);
}
function hallarPermanencia(dateValue){
	var fechaInicio=convertirFechaNormal2(dateValue);
	var hoyDía=obtenerFechaActual();
	var diasDiff=restaFechas(fechaInicio,hoyDía);
	var textYear="",textMonth="",textDay="";
	
	var numYear=Math.floor(diasDiff/365);
	var restoDias=diasDiff%365;
	if( numYear==0){
		textYear="";
	}else{
		textYear=numYear+(numYear>1?" años ":" año ");
	}
	
	var numMeses=Math.floor(restoDias/30);
	restoDias=restoDias%30;
	
	if( numMeses==0){
		textMonth="";
	}else{
		textMonth=numMeses+(numYear>1?" meses ":" mes ");
	}
	
	textDay=restoDias+(restoDias==1?" día":" días");
	
	return textYear+textMonth+textDay;
	
}
function hallarPermanenciaObject(dateValue){
	var fechaInicio=convertirFechaNormal2(dateValue);
	var hoyDía=obtenerFechaActual();
	var diasDiff=restaFechas(fechaInicio,hoyDía);
	var textYear="",textMonth="",textDay="";
	
	var numYear=Math.floor(diasDiff/365);
	var restoDias=diasDiff%365;
	if( numYear==0){
		textYear="";
	}else{
		textYear=numYear+(numYear>1?" años ":" año ");
	}
	
	var numMeses=Math.floor(restoDias/30);
	restoDias=restoDias%30;
	
	if( numMeses==0){
		textMonth="";
	}else{
		textMonth=numMeses+(numYear>1?" meses ":" mes ");
	}
	
	textDay=restoDias+(restoDias==1?" día":" días");
	
	return {years:parseInt(numYear),months:parseInt(numMeses),days:parseInt(restoDias)};
	
}
function procesarLlamarIndicadorExMedico(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
		var trabEmpresa=data.trabs;
		var exams=data.exams;
		console.log(trabEmpresa);
		$("#tblExamMedico tbody tr").remove();
		for (index = 0; index < trabEmpresa.length; index++) {
			listTrabajadores=listTrabajadores+trabEmpresa[index].trabajadorNombre +"\n" ;
			contadorListTrab=contadorListTrab+1;
	
		$("#tblExamMedico tbody").append("<tr id='trab"+trabEmpresa[index].trabajadorId+"'>"
				+"<td id='div"+trabEmpresa[index].trabajadorId+"'>"+trabEmpresa[index].divisionNombre+"</td>" 
				+"<td id='area"+trabEmpresa[index].trabajadorId+"'>"+trabEmpresa[index].areaNombre+"</td>" 
				+"<td id='puesto"+trabEmpresa[index].trabajadorId+"'>"+trabEmpresa[index].puestoNombre+"</td>" 
				+"<td id='tiempopuesto"+trabEmpresa[index].trabajadorId+"'>"+hallarPermanencia(trabEmpresa[index].fechaIngreso)+"</td>" 
				+"<td id='trab"+trabEmpresa[index].trabajadorId+"'>"+trabEmpresa[index].trabajadorNombre+"</td>" 
				+"<td id='ultimo"+trabEmpresa[index].trabajadorId+"'>No tiene examenes</td>"
				+"<td id='fecha"+trabEmpresa[index].trabajadorId+"'>------</td>"
				+"<td id='resultado"+trabEmpresa[index].trabajadorId+"'>-----------</td>"	
				+"<td id='vigencia"+trabEmpresa[index].trabajadorId+"'>-----------</td>"				
				+"<td id='tiempo"+trabEmpresa[index].trabajadorId+"'>-----------</td>"	
				
						+	"</tr>" )	;
		
		
		}

		$("#tblExamMedico tbody td").css({"vertical-align":"middle"});
		exams.forEach(function(valexam){
		    marcarVigenciaExam(valexam.trabajadorId, valexam.fechaFinExam,
			    valexam.vigenciaNombre,valexam.vigenciaDias,valexam.nombreUltimoTipoExamenes,
			    valexam.resultadoAptitudMedica.nombre
		);
		});
		 
	

		var palabraClave=$("#buscadorTrabajadorInput").val().toUpperCase();
		if(palabraClave.length==0){
			palabraClave=null;
		}else{
			listTrabajadores="";
			 contadorListTrab=0;
			for (index = 0; index < trabEmpresa.length; index++) {
				var fecha=$("#tblExamMedico tbody tr td#fecha"+trabEmpresa[index].trabajadorId).text();
				var tiempo=$("#tblExamMedico tbody tr td#tiempo"+trabEmpresa[index].trabajadorId).text();
				var vigencia=$("#tblExamMedico tbody tr td#vigencia"+trabEmpresa[index].trabajadorId).text();
				var division=trabEmpresa[index].divisionNombre;
				var area=trabEmpresa[index].areaNombre;
				var puesto=trabEmpresa[index].puestoNombre;
				var trab=trabEmpresa[index].trabajadorNombre;
				var ultim=$("#tblExamMedico tbody tr td#ultimo"+trabEmpresa[index].trabajadorId).text();
				var infoTotal=" "+fecha+" "+tiempo+" "+vigencia+" "+division+" "+area+" "+puesto+" "+trab;
				if(	infoTotal.toUpperCase().indexOf(palabraClave) ==-1 ){
					
					$("#tblExamMedico tbody tr#trab"+trabEmpresa[index].trabajadorId).remove()
				}else{
					listTrabajadores=listTrabajadores+trabEmpresa[index].trabajadorNombre +"\n" ;
					contadorListTrab=contadorListTrab+1;
				}
							}
		}
	
		
		
	$("thead tr th").addClass("tb-acc");
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}
	
}

function llamarIndicadorDetalleExMedico(){
	var auxUnidadId=$("#selUnidad").val().split("-");
	if($("#selUnidad").val()=="-1"){
		 var dataParam = {
					empresaId : getSession("gestopcompanyid")
					
					};
	}else{
		 var dataParam = {
					mdfId : auxUnidadId[0]
					
					};
	}
		
		


			callAjaxPost(URL + '/estadistica/examen', dataParam,
					procesarLlamarIndicadorVigenciaExMedico);
}

function procesarLlamarIndicadorVigenciaExMedico(data){
	
	switch (data.CODE_RESPONSE) {
	case "05":
var cantidadMes1=0,cantidadMes2=0,cantidadMes3=0,cantidadMes4=0,cantidadMes5=0;
var cantidadMes6=0,cantidadMes7=0,cantidadMes8=0,cantidadMes9=0,cantidadMes10=0;
var cantidadMes11=0,cantidadMes12=0;
 detalleVigenciaExam=data.detalleVigenciaExam;
	var rangoFechas=hallarFechasExamen();
	var listaFechaMenor=obtenerFechasLista(rangoFechas,0);
	var anioEstMenor=listaFechaMenor[0];
	var mesEstMenor=listaFechaMenor[1];
	$("#tblFechaExamenes tbody tr").remove();
	$("#tblFechaExamenes thead tr th").addClass("tb-acc");
	$("#tblDetalleExamenesFecha thead tr th").addClass("tb-acc");
	
	$("#tblDetalleExamenesFecha tbody tr").remove();
	
	for (index = 0; index < rangoFechas.length; index++) {
	
		var listaFecha=obtenerFechasLista(rangoFechas,index);
		
		var anioEst=listaFecha[0];
		var mesEst=listaFecha[1];	
		$("#tblFechaExamenes tbody").append("<tr id='fecha"+anioEst+mesEst+"'>"
				+"<td id='anio"+anioEst+"'>"+anioEst+"</td>" 
				+"<td id='mes"+mesEst+"'>"+mesEst+"</td>" 
				+"<td id='num"+index+"'><a onclick='verDetalleVigencia("+anioEst+","+mesEst+")'>"+"0"+"</a></td>" 
						+	"</tr>" )	;
		
	}
	
		
		
		for (index = 0; index < detalleVigenciaExam.length; index++) {
			var anioEst=detalleVigenciaExam[index].yearExam;
			var mesEst=detalleVigenciaExam[index].monthExam;
			var position=(anioEst-anioEstMenor)*12+(mesEst)-(mesEstMenor)+1;
		
			switch(position){
			case 1:
				cantidadMes1=cantidadMes1+1;
				break;
			case 2:
				cantidadMes2=cantidadMes2+1;
				break;
			case 3:
				cantidadMes3=cantidadMes3+1;
				break;
			case 4:
				cantidadMes4=cantidadMes4+1;
				break;
			case 5:
				cantidadMes5=cantidadMes5+1;
				break;
			case 6:
				cantidadMes6=cantidadMes6+1;
				break;
			case 7:
				cantidadMes7=cantidadMes7+1;
				break;
			case 8:
				cantidadMes8=cantidadMes8+1;
				break;
			case 9:
				cantidadMes9=cantidadMes9+1;	
				break;
			case 10:
				cantidadMes10=cantidadMes10+1;
				break;
			case 11:
				cantidadMes11=cantidadMes11+1;
				break;
			case 12:
				cantidadMes12=cantidadMes12+1;
				break;
				default:break;
				
			}
		
		
		
		}
		$("#num"+0+" a").html(cantidadMes1);
		$("#num"+1+" a").html(cantidadMes2);
		$("#num"+2+" a").html(cantidadMes3);
		$("#num"+3+" a").html(cantidadMes4);
		$("#num"+4+" a").html(cantidadMes5);
		$("#num"+5+" a").html(cantidadMes6);
		$("#num"+6+" a").html(cantidadMes7);
		$("#num"+7+" a").html(cantidadMes8);
		$("#num"+8+" a").html(cantidadMes9);
		$("#num"+9+" a").html(cantidadMes10);
		$("#num"+10+" a").html(cantidadMes11);
		$("#num"+11+" a").html(cantidadMes12);
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

}
	
}

function verDetalleVigencia(anioEst,mesEst){
	
	$("#mdDetalleExamenesFecha").modal("show")
	$("#tblDetalleExamenesFecha tbody tr").remove();
	for(index=0;index<detalleVigenciaExam.length;index++){
		var anioEst1=detalleVigenciaExam[index].yearExam;
		var mesEst1=detalleVigenciaExam[index].monthExam;
		if(anioEst1==anioEst && mesEst1==mesEst ){
			$("#tblDetalleExamenesFecha tbody").append("<tr>"
					+"<td>"+detalleVigenciaExam[index].vigenciaFecha+"</td>" 
					+"<td >"+detalleVigenciaExam[index].trabajadorNombre+"</td>" 
				
							+	"</tr>" )	;
		}
	
		
		
	}
}

function marcarVigenciaExam(trabId,fechaFin,vigenciaNombre,vigenciaDias,ultimo,resultado){
	if(fechaFin!=null)
	{$("#fecha"+trabId).html(fechaFin);
	$("#vigencia"+trabId).html(vigenciaNombre);
	$("#ultimo"+trabId).html(ultimo);
	$("#resultado"+trabId).html(resultado);
	
	$("#tiempo"+trabId).html(
			hallarTiempoVigencia(fechaFin,vigenciaDias)
	
	);}
	
	
	
}


function hallarTiempoVigencia(fechaFin,dias){
	var diasVigencia=dias-restaFechas(fechaFin,obtenerFechaActual());
	var mensaje="<h4 style='color:green'><strong>"+diasVigencia+" dias</strong><h4>"
	if(diasVigencia<=0){
		
		var mensaje="<h4 style='color:red'><strong>"+diasVigencia+" dias</strong><h4>"
	}
	return mensaje;
	
}


function obtenerListaNombresTrabajador(){
	
	new Clipboard('#btnSelect', {
	    text: function(trigger) {
	        return listTrabajadores
	    }
	});
	alert("Se han guardado al clipboard "+contadorListTrab+" trabajador(es)");
	
}

function hallarFechasExamen(){
var fechaInicio=obtenerFechaActual();
var fechaFin=sumaFechaDias(365, fechaInicio);

	var fecha1=fechaInicio.split('-');
	var fecha2=fechaFin.split('-');
	var difanio= fecha2[0]-fecha1[0]+1;
	var listfecha=[];
	
		
		for (index =0; index <difanio; index++) {
			var anioaux=parseInt(index)+parseInt(fecha1[0]);
			
			if(difanio>1){
				if(index==0){
					for(index1 =0; index1 < 12-fecha1[1]+1; index1++) {
						
						var mesaux=parseInt(index1)+parseInt(fecha1[1]);
						listfecha.push(anioaux+"-"+mesaux);
						}
				}
				if(index==difanio-1){
					for(index4=0;index4<parseInt(fecha2[1]);index4++){
						var mesaux3=parseInt(index4)+parseInt("1");
						listfecha.push(anioaux+"-"+mesaux3);
					}
							}	
				
				if(index>0 && index <difanio-1 ){
						
						for(index3 =0;index3 <12;index3++){
							var mesaux2=parseInt(index3)+1;	
							listfecha.push(anioaux+"-"+mesaux2);
						}
						
						
					}
					
			}else{
				for(index5 =0; index5 < fecha2[1]-fecha1[1]+1; index5++) {
					
					var mesaux4=parseInt(index5)+parseInt(fecha1[1]);
					listfecha.push(anioaux+"-"+mesaux4);
					}
				
			}
			
			

			
		};	
	
	
	
	return listfecha;
	
}