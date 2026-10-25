/**
 * 
 */
var listMeses=[
   "","Enero","Febrero","Marzo","Abril","Mayo","Junio",
   "Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"];
var listDias=["Lunes","Martes","Miércoles","Jueves",
              "Viernes","Sábado","Domingo"];
var listDiasSmall=["L","M","Mi","J","V","S","D"];
var ordenDiasInicio=[6,0,1,2,3,4,5];
var ordenDiasFinal=[0,6,5,4,3,2,1];
var mesesCalendario=[];

function addDays(date,days){
   var result = new Date(date);
   result.setDate(result.getDate()+days);
   return result;
}

function insertarCalendarioContratistas(functionCallBack){
   var hoyDia = new Date();
   var variacionDias = 31;
   var hace2meses = addDays(hoyDia,variacionDias*-1);
   var dentro2meses = addDays(hoyDia,variacionDias);
   var fechaInicio = convertirFechaInputNoUTC(hace2meses);
   var fechaFin = convertirFechaInputNoUTC(dentro2meses); 
   var fecha1 = fechaInicio.split('-');
   var fecha2 = fechaFin.split('-');
   var difanio = fecha2[0]-fecha1[0]+1; 

   mesesCalendario = [];  
		
   for(var index = 0;index < difanio;index++){
      var anioaux = parseInt(index)+parseInt(fecha1[0]); 
			
      if(difanio > 1){
         if(index == 0){
	    for(var index1 = 0;index1 < 12 - fecha1[1] + 1;index1++){ 
	       var mesaux = parseInt(index1)+parseInt(fecha1[1]);
	       mesesCalendario.push({year:anioaux,month:mesaux});
	    }
         }
				
         if(index == difanio - 1){
	    for(index4 = 0;index4 < parseInt(fecha2[1]);index4++){
	       var mesaux3 = parseInt(index4) + parseInt("1");
	       mesesCalendario.push({year:anioaux,month:mesaux3});
	    }
         }	 
				
         if(index > 0 && index < difanio - 1){
	    for(index3 = 0;index3 < 12;index3++){
	       var mesaux2 = parseInt(index3)+1;	
	       mesesCalendario.push({year:anioaux,month:mesaux2});
	    } 
         } 
      }else{
         for(index5 = 0;index5 < fecha2[1] - fecha1[1] + 1;index5++){ 
	    var mesaux4 = parseInt(index5) + parseInt(fecha1[1]);
	    mesesCalendario.push({year:anioaux,month:mesaux4}  );
         } 
      }  
   }
		
   mesesCalendario.forEach(function(val,index){
      val.dias = [];
   });
		
   for(var dayInicio = variacionDias*-1;dayInicio < variacionDias + 1;dayInicio++){ 
      var fechaRef = addDays(hoyDia,dayInicio);  
		
      mesesCalendario.forEach(function(val,index){
         if(val.year == fechaRef.getFullYear() && val.month == fechaRef.getMonth() + 1){
	    var isToday = 0;
					
	    if(dayInicio == 0){
	       isToday = 1;
	    }
					
	    val.dias.push({
	       diaDate: fechaRef,
	       diaSemana: fechaRef.getDay(),
	       diaNumero: fechaRef.getDate(),
	       isToday: isToday
	    });
         }
      });
   }
	
   $(".divListSecundaria .subDivContenido").html(
      "<div class='calendario-gosst'>" +
         "<div class='calendario-gosst-header'>"+"</div>"+
	 "<div class='calendario-gosst-body'></div>"+
      "</div>");
	
   $(".divListSecundaria .subDivTitulo").html("<i class='fa fa-calendar'></i>Calendario");
	
   var cabeceraDias = "";
	
   listDiasSmall.forEach(function(val,index){
      cabeceraDias+="<div class='cg-seccion-dia-semana'>"+""+val+"</div>"
   });
	
   mesesCalendario.forEach(function(val,index){
      var textIn = ""+cabeceraDias;
		
      val.dias.forEach(function(val1,index1){
         var seccionesInicio = "",seccionFinal = "";
			
         if(index1 == 0){
	    for(var aux = 0;aux < ordenDiasInicio[val1.diaSemana];aux++){
	       seccionesInicio += "<div class='cg-seccion-dia-aux'></div>"
	    }
         }
			
         if(index1 == val.dias.length - 1){
            for(var aux = 0;aux < ordenDiasFinal[val1.diaSemana];aux++){
	       seccionFinal+="<div class='cg-seccion-dia-aux'></div>"
            }
         }
			
         var classDia = "cg-dia";
			
         if(val1.isToday == 1){
	    classDia = "cg-dia-hoy";
         }
			
         textIn+=seccionesInicio+
                 "<div class='"+classDia+"' id='cg-dia-id"+val1.diaNumero+"' " +
		      "onclick='marcarIconoModuloContratista(1,"+val1.diaDate.getTime()+")'>" +
		     val1.diaNumero+
		 "</div>"+seccionFinal
      });
		
      $(".calendario-gosst-body").append(
         "<div class='cg-seccion-mes' id='cg-mes-id"+val.year+val.month+"'>" +
	    "<h4>"+val.year+" - "+listMeses[val.month]+"</h4>" +
	     textIn+""+
	 "</div>");
   });
	
   if(parseInt(getSession("tipoContratistaGosstId")) != 4){
      habilitarVistaActividadesContratista(function(data){
         organizarActividadesContratistas(data);
		
         if(functionCallBack != null){
            functionCallBack();
         }
      },null,false,1);	
   }
}

function organizarActividadesContratistas(listEventos){ 
   mesesCalendario.forEach(function(val,index){
      val.dias.forEach(function(val1,index1){
         var numAlertas=0,numRetrasados=0,
             numImplementar=0,numCompletados=0;
         var iconoCalendario="";
			
         listEventos.forEach(function(val2,index2){
	    var dateEvento = new Date(val2.fecha); 
					
	    if(dateEvento.getUTCFullYear() == val1.diaDate.getFullYear() && 
	       dateEvento.getUTCMonth() == val1.diaDate.getMonth() && 
	       dateEvento.getUTCDate() == val1.diaDate.getDate()){
	       switch(parseInt(val2.estadoEvento)){
		  case 1:
		     numImplementar++;
		     break;
						
		  case 2:
		     numCompletados++;
		     break;
						
		  case 3:
		     numRetrasados++;
		     break;
						
		  case 4:
		     numAlertas++;
		     break;
	       }
	    }
         });
			
         if(numCompletados > 0){
	    iconoCalendario = iconoGosst.aprobado;
         }
			
         if(numImplementar > 0){
	    iconoCalendario = iconoGosst.por_realizar;
         }
			
         if(numRetrasados > 0){
	    iconoCalendario = iconoGosst.desaprobado;
         }
			
         if(numAlertas>0){
	    iconoCalendario = iconoGosst.alerta;
         }
			
	 $("#cg-mes-id"+val.year+val.month)
	 .find("#cg-dia-id"+val1.diaNumero).html(val1.diaNumero+""+iconoCalendario);
      });
   });
}
