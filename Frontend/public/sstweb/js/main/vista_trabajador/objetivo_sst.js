

//function habilitarObjetivosUsuario(){ 
//   var restriccionMedica = "",divBuscador = "";
//	
//   if(numAreasResponsable > 0){
//      divBuscador = 
//         "<div id='subListBuscador'>" +
//	    "<div class='tituloSubList'></div>" +
//	    "<div class='contenidoSubList'></div>" +
//         "</div>";
//   }
//	
//   var dataParam2={
//      trabajadorId: sessionStorage.getItem("trabajadorGosstId"),
//      palabraEspacio:"<br>" 
//   };
//	
//   callAjaxPostNoLoad(URL+'/trabajador/puntajes',dataParam2,function(data){
//      $(".divListPrincipal").append(
//          divBuscador +
//	 "<div id='subListCapacitacion'>" +
//	    "<div class='tituloSubList'></div>" +
//	    "<div class='contenidoSubList'></div>" +
//         "</div>" + 
//         "<div id='subListEquipos'>" +
//	    "<div class='tituloSubList'></div>" +
//	    "<div class='contenidoSubList'></div>" +
//         "</div>" + 
//	 "<div id='subListMedico'>" +
//	    "<div class='tituloSubList'></div>" +
//	    "<div class='contenidoSubList'></div>" +
//	 "</div>" + 
//	 "<div id='subListDisponible'>" +
//	    "<div class='tituloSubList'></div>" +
//	    "<div class='contenidoSubList'></div>" +
//	 "</div>" + 
//         "<div id='subListParticipacion'>" +
//	    "<div class='tituloSubList'></div>" +
//	    "<div class='contenidoSubList'></div>" +
//	 "</div>");
//		
//      var indicadoresSeguridad = data.indicadoresSeguridad;
//      var indEvento = data.indEvento;
//      var indAcc = data.indAcc;
//      var indEpp = data.indEpp;
//      var indExam = data.indExam;
//      var indFormacion = data.indFormacion;
//      var listActosReportados = data.listActosReportados;
//		
//      var primerDia = new Date();
//      primerDia = convertirFechaNormal2(primerDia);
//		
//      var capacitacionesTrab = [];
//		
//      if(indFormacion.length > 0){
//         capacitacionesTrab = indFormacion[0].caps;
//      }
//		
//      var indicadorRangoActual = 1;
//      var capacitacionesTabla = "";
//      var participacionTabla = "";
//      var eppsTabla = "";
//      var colorFondo = "#bbb3b4";
//      var horaProgramada = "";
//		
//      for(var index22 = 0;index22 < capacitacionesTrab.length;index22++){
//         if(index22 == 0){
//	    indicadorRangoActual = 0;
//         }
//			
//         var programs = capacitacionesTrab[index22].programsCap;
//         colorFondo = "#bbb3b4"
//         var textoFechaVigencia = "----";
//         horaProgramada = "";
//			
//         for(var index31 = 0;index31 < programs.length;index31++){
//	    var primerDia = new Date();
//	    primerDia = convertirFechaNormal2(primerDia);
//				
//	    if(programs[index31].fechaPlaTexto == null){
//	       programs[index31].fechaPlaTexto = primerDia;
//	    }
//				
//	    if(programs[index31].fechaRealTexto == null){
//	       programs[index31].fechaRealTexto = programs[index31].fechaPlaTexto;
//	    }
//				
//	    var enRangoInicial = fechaEnRango(primerDia,programs[index31].fechaPlaTexto,programs[index31].fechaRealTexto)
//				
//	    if(!enRangoInicial && programs[index31].progCapEstado == 2){
//	       textoFechaVigencia = "Venció el: "+convertirFechaNormal(programs[index31].fechaRealTexto);
//	    }
//				
//	    if(restaFechas(programs[index31].fechaPlaTexto,primerDia) < 0){ 
//	       textoFechaVigencia = "Próxima: "+convertirFechaNormal(programs[index31].fechaRealTexto);
//	       horaProgramada = programs[index31].horaPlanificada;
//	    }
//				
//	    if(programs[index31].tipoNotaTrabId == 1 && enRangoInicial){
//	       colorFondo = "#9BBB59"; 
//	       textoFechaVigencia = "Vigente hasta: "+convertirFechaNormal(programs[index31].fechaRealTexto);
//	       indicadorRangoActual = indicadorRangoActual+(1/capacitacionesTrab.length);
//	       index31 = programs.length;
//	       horaProgramada = "";
//	    }
//         }
//		
//         capacitacionesTabla += 
//            "<div class='detalleFormacionTrabajador' style='border-left:10px solid "+colorFondo+";'>" +
//	       "<div style='font-weight:600;font-size:15px'>"+capacitacionesTrab[index22].capacitacionNombre+"</div>" +
//	       "<div>"+textoFechaVigencia+" "+horaProgramada+"</div>" + 
//	    "</div>";
//      }
//      ////
//      var examsTrab = [];
//			
//      if(indExam.length > 0){
//         examsTrab = indExam[0].exams;
//      }
//				
//      var fechaExamen = "Sin exámenes";
//      var colorFondoMedico = " "; 
//      var restriccionPuntaje = 0;
//      colorFondoMedico = "#bb596b"; 
//      restriccionPuntaje = 0;
//				
//      for(var index22 = 0;index22 < examsTrab.length;index22++){
//         var programs = examsTrab[index22].programsExams;
//					
//         for(var index33 = 0;index33 < programs.length;index33++){
//	    var primerDia = new Date();
//	    primerDia = convertirFechaNormal2(primerDia);
//						
//	    if(programs[index33].fechaInicialTexto == null){
//	       programs[index33].fechaInicialTexto = primerDia;
//	    }
//						
//	    if(programs[index33].fechaFinTexto == null){
//	       programs[index33].fechaFinTexto = programs[index33].fechaInicialTexto;
//	    }
//						
//	    var enRangoInicial = fechaEnRango(primerDia,programs[index33].fechaInicialTexto,programs[index33].fechaFinTexto);
//	    var boolEntreFechas = false;
//						
//	    if(enRangoInicial){
//               boolEntreFechas = true;
//	    }
//						
//	    if(programs[index33].tipoNotaTrabId == 1 && boolEntreFechas){
//	       fechaExamen = "Vigente hasta: "+convertirFechaNormal(programs[index33].fechaFinTexto);
//	       index33 = programs.length;
//	       index22 = examsTrab.length;
//	       restriccionPuntaje = 1;
//	       colorFondoMedico = "#9BBB59"; 
//	    }
//         }
//      }
//				
//      var dataParamAux={
//         mdfId: getSession("unidadGosstId"),
//         empresaId: getSession("gestopcompanyid"),
//         trabajadorId: parseInt(sessionStorage.getItem("trabajadorGosstId"))
//      };
//				
//      callAjaxPostNoLoad(URL+'/trabajador',dataParamAux,function(data){
//         restriccionMedica = data.list[0].restriccion;
//					
//         if(restriccionMedica.length == 0){
//            restriccionMedica = "No tiene restricciones";
//         }else{
//	    restriccionMedica = "Restricción: "+restriccionMedica;
//         }
//					
//         var observacions = "Sin observaciones";
//					
//         if(data.list[0].observacion.length > 3){
//	    observacions = "Observación: "+data.list[0].observacion;
//         }
//					
//         $("#subListMedico").find(".tituloSubList").html(
//            "<i aria-hidden='true' class='fa fa-medkit'></i> Examen Médico ("+pasarDecimalPorcentaje(restriccionPuntaje,2)+")");
//					
//         $("#subListMedico").find(".contenidoSubList").html(
//	    "<div class='detalleMedicoTrabajador' style='border-color:"+colorFondoMedico+"'>" +
//	       " "+fechaExamen+", <br>"+restriccionMedica+"<br>"+observacions +
//	    "</div>");
//      });
//      ///
//      var eppsTrabajador = [];
//				
//      if(indEpp.length > 0){
//         eppsTrabajador = indEpp[0].epps;
//      }
//				
//      var indicadorEpp = 1;
//      horaProgramada = "";
//				
//      for(var index22 = 0;index22 < eppsTrabajador.length;index22++){
//         if(index22 == 0){
//	    indicadorEpp = 0;
//         }
//					
//         var colorFondo = "#bbb3b4";
//         var textoFechaVigenciaEpp = "---";
//         var programs = eppsTrabajador[index22].programsEpp;
//					
//         for(var index31 = 0;index31 < programs.length;index31++){
//	    var primerDia = new Date();
//	    primerDia = convertirFechaNormal2(primerDia);
//						
//	    if(programs[index31].fechaPlanificadaTexto == null){
//	       programs[index31].fechaPlanificadaTexto = primerDia;
//	    }
//						
//	    if(programs[index31].fechaEntregaTexto == null){
//	       programs[index31].fechaEntregaTexto = programs[index31].fechaPlanificadaTexto;
//	    }
//						
//	    var enRangoInicial = fechaEnRango(primerDia,programs[index31].fechaPlanificadaTexto,programs[index31].fechaEntregaTexto);
//	    var boolEntreFechas = false;
//						
//	    if(enRangoInicial){
//	       boolEntreFechas = true;
//	    }
//						
//	    if(restaFechas(programs[index31].fechaPlanificadaTexto,primerDia) < 0){
//	       textoFechaVigenciaEpp = "Próxima Entrega: "+convertirFechaNormal(programs[index31].fechaEntregaTexto);
//	       horaProgramada = programs[index31].horaPlanificada;
//	    }
//						
//	    if(programs[index31].tipoNotaTrabId != null && boolEntreFechas){
//	       colorFondo = "#9BBB59"; 
//	       textoFechaVigenciaEpp = "Próxima Entrega: "+convertirFechaNormal(programs[index31].fechaEntregaTexto);
//	       indicadorEpp = indicadorEpp+(1/eppsTrabajador.length);
//	       index31 = programs.length;
//	    }
//         } 
//					
//         eppsTabla += 
//            "<div class='detalleEppsTrabajador' style='border-left:10px solid "+colorFondo+";'>" +
//	       "<div style='font-weight:600;font-size:15px'>"+eppsTrabajador[index22].equipoSeguridadNombre+"</div>" +
//	       "<div>"+textoFechaVigenciaEpp+" "+horaProgramada+"</div>" + 
//	    "</div>";
//      }
//      //
//      var indicadorPart = 0;
//				
//      listActosReportados.forEach(function(val,index){
//         participacionTabla += 
//            "<div class='detalleEppsTrabajador' style='border-color:"+val.color+"'>" +
//	       "<div>"+val.acInseguroTipoNombre+" - "+val.acInseguroNombre+"</div>" + 
//	       "<div><strong>Mejora:</strong> "+val.iconoEstadoAccion+""+val.nombreAccionMejora+"</div>" +
//	    "</div>";
//      });
//				
//      var dias = indAcc[0].indicadorDiasDescanso*5*52	;
//      var reportes = indEvento[0].numEventosReportados;
//
//      // Buscar Formación Trabajador	
//      $("#subListBuscador").find(".tituloSubList")
//      .html("<i aria-hidden='true' class='fa fa-search-plus'></i> Buscar formaciones trabajador "+textoBotonToggleContenidoColaborador);
//				
//      var textoFormBuscarFormacionesTrabajador = "";
//      
//      var listItemsFormBuscarFormacionesTrabajador=[
//	 {sugerencia:"",label:"<i class='fa fa-question-circle-o'></i> Buscar trabajador",
//	  inputForm:"<input placeholder='Nombre trabajador' class='form-control' id='inputAutoTrabajadorArea'>",divContainer:""},
//	 {sugerencia:"",label:"<i class='fa fa-book'></i> Resultado de búsqueda",inputForm:"",divContainer:"divAutoCompletarTrabArea"},
//	 {sugerencia:"",label:"",
//	  inputForm:"<button type='button' onclick='verResultadoFormacionesTrabajador()' class='btn btn-success'>" +
//	  	       "<i aria-hidden='true' class='fa fa-search'></i> Buscar" +
//	  	    "</button>"}
//      ];
//				
//      listItemsFormBuscarFormacionesTrabajador.forEach(function(val,index){
//         textoFormBuscarFormacionesTrabajador += obtenerSubPanelModulo(val);
//      });
//				
//      $("#subListBuscador").find(".contenidoSubList").html(
//         "<form class='eventoGeneral' id='nuevoActoCompletoBuscarFormacionesTrabajador'>"+
//	     textoFormBuscarFormacionesTrabajador +
//	 "</form>");
//				
//      $("#inputAutoTrabajadorArea").attr("onkeyup","verAutoCompletarTrabArea()");			
//    //$("#subListBuscador").find(".tituloSubList").html("<i aria-hidden='true' class='fa fa-search'></i>Buscar formaciones trabajador: <input placeholder='' class='form-control' id ='inputAutoTrabajador'>");				
//				
//      var divTrabajadores = $("#divTrabajadorGosst");
//		
//      $("#subListCapacitacion").find(".tituloSubList")
//      .html("<i aria-hidden='true' class='fa fa-graduation-cap'></i> Formaciones (" +
//	     pasarDecimalPorcentaje(indicadorRangoActual,2)+") "+textoBotonToggleContenidoColaborador);
//		
//      $("#subListCapacitacion").find(".contenidoSubList").html(capacitacionesTabla);
//		
//      $("#subListEquipos").find(".tituloSubList")
//      .html("<i aria-hidden='true' class='fa fa-fire-extinguisher'></i> EPP´s (" +
//	     pasarDecimalPorcentaje(indicadorEpp,2)+")" +textoBotonToggleContenidoColaborador);
//		
//      $("#subListEquipos").find(".contenidoSubList").html(eppsTabla);
//		
//      var indicadorAcc = indAcc[0].indicadorDiasDescanso;
//      var sumaDiasDescanso = indAcc[0].sumaDiasDescanso;
//      var diasTrabajados = indAcc[0].diasTrabajados
//		
//      $("#subListDisponible").find(".tituloSubList")
//      .html("<i aria-hidden='true' class='fa fa-fire-extinguisher'></i> Disponibilidad (" +
//	     pasarDecimalPorcentaje(indicadorAcc)+")" +textoBotonToggleContenidoColaborador);
//		
//      $("#subListDisponible").find(".contenidoSubList").html(
//         "<div class='detalleMedicoTrabajador'>" +
//	     (diasTrabajados-sumaDiasDescanso)+" / "+diasTrabajados+
//	 "</div>");
//      
//      var asd = (reportes / indicadoresSeguridad.indicadorMinimoParticipacion) > 1?
//	 1:(reportes / indicadoresSeguridad.indicadorMinimoParticipacion);
//		
//      $("#subListParticipacion").find(".tituloSubList")
//      .html("<i aria-hidden='true' class='fa fa-fire-extinguisher'></i> Participación (" +
//	     pasarDecimalPorcentaje(asd)+")" +textoBotonToggleContenidoColaborador);
//		
//      $("#subListParticipacion").find(".contenidoSubList").html(participacionTabla);
//		 
//      $(".listOpcionFiltroGosst .opcionFiltroGosst").show()
//   });
//}
//
//function verAutoCompletarTrabArea(){
//    
//   var nombre = $("#inputAutoTrabajadorArea").val().trim();
//    
//   if(nombre == ""){
//      nombre = null;
//   }
//	
//   var dataParam = {
//	   trabajadorNombre : "%"+nombre+"%",
//	   empresaId : getSession("gestopcompanyid"),
//	   areaId:getSession("areaGosstId")
//   }
//	
//   callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,
//	   function(data){
//	      if(data.trabajadores.length == 0){
//		 data.trabajadores.push({
//		 trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
//		 })
//	      }
//		
//	      listTrabajadoresAreaFormacion= data.trabajadores;
//		
//	      crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajador","",listTrabajadoresAreaFormacion,
//		              "trabajadorId","nombre","#divAutoCompletarTrabArea","");
//	
//	      $("#inputAutoTrabajadorArea").attr("onkeyup","verAutoCompletarTrabArea()");
//	      
//	});
//}

var listCapacitacionesOnlineAsignadas=[],listCapacitacionesAsignadas=[];

function habilitarObjetivosUsuario(){ 
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),trabajadorId: parseInt(getSession("trabajadorGosstId")),
      puestoId: parseInt(getSession("puestoGosstId")),seccionCapacitacionOnline: seccionCapacitacionOnline
   };
 	
   callAjaxPost(URL+'/trabajador/objetivo',dataParam,function(data){
      var listPanelesPrincipal = []; 
       
      if(seccionCapacitacionOnline == 1){
         listCapacitacionesOnlineAsignadas = data.listCapacitacionesOnlineAsignadas;
      
         var textTotal = "",numCapOnlineAprobadas = 0;
	
         listCapacitacionesOnlineAsignadas.forEach(function(val,index){
            var listTotal=[
               {sugerencia:"",label:"<i class='fa fa-graduation-cap'></i> Capacitación online",inputForm:val.capacitacionNombre},
               {sugerencia:"",label:"<i class='fa fa-list-alt'></i> Tema específico",inputForm:val.tema},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            ];
         
            var estiloGosst = "gosst-desaprobado";
         
            if(val.estadoTrabajador != null){
               var nombreEstado = (val.estadoTrabajador.tipoNotaId == 1?"Aprobado":
                  (val.estadoTrabajador.tipoNotaId == 2?"Desaprobado":"Pendiente")); 
            
               var iconoEstado = (val.estadoTrabajador.tipoNotaId == 1?iconoGosst.aprobado:
                  (val.estadoTrabajador.tipoNotaId == 2?iconoGosst.por_realizar:iconoGosst.desaprobado)); 
            
               estiloGosst = (val.estadoTrabajador.tipoNotaId == 1?"gosst-aprobado":
                  (val.estadoTrabajador.tipoNotaId == 2?"gosst-advertencia":"gosst-desaprobado"));
             
               listTotal.push(
                  {sugerencia:"",label:"<i class='fa fa-pencil'></i> N° de intentos",inputForm:val.estadoTrabajador.intentos},
                  {sugerencia:"",label:"<i class='fa fa-book'></i> Nota",inputForm:val.estadoTrabajador.resultadoUltimo},
                  {sugerencia:"",label:iconoEstado+" Estado",inputForm:nombreEstado},
                  {sugerencia:"",label:"<i class='fa fa-calendar'></i> Registrado el",inputForm:val.estadoTrabajador.fechaRegistroTexto});  
            
               if(val.estadoTrabajador.tipoNotaId == 1){
                  numCapOnlineAprobadas++;
               }
            }else{
               listTotal.push(
                  {sugerencia:"",label:iconoGosst.desaprobado+" Estado",inputForm:"Pendiente"});   
            }
	       
            textTotal += "<div class='eventoGeneral "+estiloGosst+"'>" +
	                    "<form class='eventoGeneral'>";
	       listTotal.forEach(function(val,index){
                  textTotal += ""+obtenerSubPanelModuloVersionDos(val);
	       });
	    textTotal +=    "</form>" +
		         "</div>";
         });
      
         listPanelesPrincipal.push({
	    id:"infoMovilCapacitacionOnlineAsignadas",clase:"",styleAux:"",buttonAd:"",
	    nombre:"Capacitaciones online asignadas ("+numCapOnlineAprobadas+"/"+listCapacitacionesOnlineAsignadas.length+")",
	    contenido: ""+textTotal
         });
      }
      
      listCapacitacionesAsignadas = data.listCapacitacionesAsignadas;
      
      var textTotal = "",numCapacitacionAprobadas = 0;
	
      listCapacitacionesAsignadas.forEach(function(val,index){
	 var enlaceVideoGuia = (val.urlVideo.length == 0?"------":
	    "<a target='_blank' class='efectoLink' href='"+val.urlVideo+"'>"+
               "<i class='fa fa-external-link'></i> Enlace " +
            "</a>"); 
	  
         var listTotal=[
            {sugerencia:"",label:"<i class='fa fa-graduation-cap'></i> Formación",inputForm:val.capacitacionNombre},
            {sugerencia:"",label:"<i class='fa fa-list-alt'></i> Tema específico",inputForm:val.tema},
            {sugerencia:"",label:"<i class='fa fa-file-video-o'></i> Video guía",inputForm:enlaceVideoGuia},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         ];
         
         var estiloGosst = "gosst-desaprobado";
         
         if(val.estadoTrabajador != null){
            var nombreEstado = (val.estadoTrabajador.tipoNotaId == 1?"Aprobado":
               (val.estadoTrabajador.tipoNotaId == 2?"Desaprobado":"Pendiente")); 
            
            var iconoEstado = (val.estadoTrabajador.tipoNotaId == 1?iconoGosst.aprobado:
               (val.estadoTrabajador.tipoNotaId == 2?iconoGosst.por_realizar:iconoGosst.desaprobado)); 
            
            estiloGosst = (val.estadoTrabajador.tipoNotaId == 1?"gosst-aprobado":
               (val.estadoTrabajador.tipoNotaId == 2?"gosst-advertencia":"gosst-desaprobado"));
             
            listTotal.push(
               {sugerencia:"",label:"<i class='fa fa-book'></i> Comentario",
        	inputForm:(val.estadoTrabajador.resultadoUltimo.length == 0?"------":val.estadoTrabajador.resultadoUltimo)},
               {sugerencia:"",label:iconoEstado+" Estado",inputForm:nombreEstado},
               {sugerencia:"",label:"<i class='fa fa-calendar'></i> Registrado el",inputForm:val.estadoTrabajador.fechaRegistroTexto});  
            
            if(val.estadoTrabajador.tipoNotaId == 1){
               numCapacitacionAprobadas++;
            }
         }else{
            listTotal.push(
               {sugerencia:"",label:iconoGosst.desaprobado+" Estado",inputForm:"Pendiente"});   
         }
	       
         textTotal += "<div class='eventoGeneral "+estiloGosst+"'>" +
	                 "<form class='eventoGeneral'>";
	    listTotal.forEach(function(val,index){
               textTotal += ""+obtenerSubPanelModuloVersionDos(val);
	    });
	 textTotal +=    "</form>" +
		      "</div>";
      });
      
      listPanelesPrincipal.push({
	 id:"infoMovilFormacionAsignadas",clase:"",styleAux:"",buttonAd:"",
	 nombre:"Formaciones asignadas ("+numCapacitacionAprobadas+"/"+listCapacitacionesAsignadas.length+")",
	 contenido: ""+textTotal
      });

      agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);
   });
}
    