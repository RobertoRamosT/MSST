/**
 * 
 */
var objAntecedenteCovid={};
var listFullFormularios=[];
var listRespuestaSimple=[];
var listTrimestreEmbarazo=[];
var listNumeroConviviente=[];
var listEnfermedad=[];
var listSintoma=[];
var listModalidadTrabajo=[];
var listIdentificarSintoma = [];
var listTiempoEstimado = [];
var fechaNacimiento;
var edad;
var numModificaciones=0;
var mensajeUx;
var listFullProyectosMedicoCovid=[];
var listDetalleAltaCovid = [{id:1,nombre:"Habilitado"},{id:2,nombre:"Con alta epidemiológica"}];
var menuDerechaMedicoCovid=[
        {id:1,icono:" fa-user-circle",ident:"icoPerfil",onclick:"",
         titulo:"Perfil",adicional:"Médico COVID <label id='empresaActual'> </label>"}
                           ];
var menuFuncionesIzquierdaMedicoCovid=[];

var listContratistaMedicoCovid=[],listTrabajadoresMedicoCovid=[];
var listTipoPruebaCovidAux=[],listResultadoPruebaCovidAux=[];

var estadoEspecificoCovidGlobalId = 0;

function marcarIconoModuloSeleccionadoMedicoCovid(menuIndex){
	 
   //$("#menuExplicativo").hide();
   $(".divContainerGeneral").show();
   $(".divListModulos").find("li").removeClass("activeMenu");
   //$(".divListPrincipal").html("");
   $(".gosst-aviso").remove();
		
   var menuObject=menuFuncionesIzquierdaMedicoCovid[menuIndex];
   
   switch(menuObject.id){
   case 4:
       break;
       
   case 15:
       break;
       
   default:
	  $("#menuExplicativo").hide();
	  $(".divListPrincipal").html("");
	  $(".divTituloFull").find("h4").html(menuObject.nombre)
       break;
   }
   
   $(".divListModulos #seccionMedicoCovid"+menuObject.id).addClass("activeMenu");
		
   var isPermitido=false;
   
   listaModulosPermitidos.forEach(function(val,index){
      var moduloPermitido=val.isPermitido;
			
      if(val.menuOpcionId==menuObject.moduloId && moduloPermitido==1){
         isPermitido=true;
      }
			
      var numerSubModulos=val.subMenus;
			
      numerSubModulos.forEach(function(val1,index1){
         var subModuloPermitido=val1.isPermitido;
				
         if(val1.menuOpcionId==menuObject.moduloId && subModuloPermitido==1){
	    isPermitido=true;
         }
      });
   });
		
   if(isPermitido){
      switch(menuObject.id){
         case 17:
  	    habilitarSeccionHistorialVacunaMedicoCovid();
  	    break;
      
         case 1:
	     habilitarPerfilGeneralMovil();
	     break;
	     
	 case 10:
	     habilitarSeccionGeneralMedicoCovid();
	     break;
	     
	 case 9:
	     cerrarSesion();
	     break;
	     
	 case 4:
	     menuFuncionesIzquierdaMedicoCovid.forEach(function(val){
		        if(val.seccionPadreId == menuObject.id){
			   $(".divListModulos #seccionMedicoCovid"+val.id).toggle();
			   $("#menuFigureti #seccionMedicoCovid"+val.id).toggle();
			}					
		     });
		     
	     break;  
	     
	 case 15:
	     menuFuncionesIzquierdaMedicoCovid.forEach(function(val){
		        if(val.seccionPadreId == menuObject.id){
			   $(".divListModulos #seccionMedicoCovid"+val.id).toggle();
			   $("#menuFigureti #seccionMedicoCovid"+val.id).toggle();
			}					
		     });
		     
	     break;  
	     
	 default:
	     estadoEspecificoCovidGlobalId = menuObject.estadoEspecificoCovid.id;
	     habilitarTrabajadoresMedicoCovid(menuObject.estadoEspecificoCovid.id);
	     break;
       }
   }else{
      verSeccionRestringida();
   }
		
   if(menuObject.id != 4){
      if(menuObject.id != 15){
       $(".divTituloFull").find("h4").html(menuObject.nombre)	
      }
   }
}
 
function verLateralesFijosMedicoCovid(functionCallBackAux){
   $("#wrapper").block({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});	
   primeraCargaVerLateralesFijosMedicoCovid(segundaCargaVerLateralesFijosMedicoCovid,functionCallBackAux);
}

function primeraCargaVerLateralesFijosMedicoCovid(functionCallBack,functionCallBackAux){
   var dataParamAux={
      mdfId: getSession("unidadGosstId"),
      empresaId: getSession("gestopcompanyid"),
      trabajadorId: parseInt(getSession("trabajadorGosstId"))
   };
 			 
   $("#menuPrincipal")
   .html("Tu Gestor Online de Seguridad y Salud en el Trabajo te da la Bienvenida")
   .css({color:"white","margin-top": "12px"});
 			
   $(".navbar").css({"min-height": "48px","margin-bottom": "0px","top":"0px"});
 			
   var logo = $("#logoMenu");
 		   
   logo.css({"background-color":"#2e9e8f","margin-top":"-18px"})
   .attr("onclick","volverMenuInicio()");

   $("#barraMenu").css({"position": "fixed","width": "100%"});
   $("#barraMenu").find(".navbar-right").html("<ul></ul> ");
 			
   menuDerechaMedicoCovid.forEach(function(val,index){
      var claseSub = "class='iconoLink dropdown-toggle' data-toggle='dropdown'";
 		     
      if(val.ident != "icoPerfil"){
         claseSub = "class='iconoLink'";	
      }else{
         val.onclick = "";
      }
 				
      $("#barraMenu").find(".navbar-right").append(
         "<li class='dropdown' style='top:-7px;'>" +
            "<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' " +
                        "aria-expanded='false' id='companySelected'></a>" +
            "<ul class='dropdown-menu' role='menu' id='menuEmpresa'></ul>" +
         "</li>" +
         "<li id='"+val.ident+"' title='"+val.titulo+"'>" +
            "<a onclick='"+val.onclick+"'"+claseSub+">" +
 	       "<i class='fa "+val.icono+" fa-2x' aria-hidden='true'>"+"</i>" +
 	        val.adicional + 
 	    "</a>" +
 	 "</li>");
   });
 		   
   callAjaxPost(URL+'/empresa/usuario',{},function(data){
      switch(data.CODE_RESPONSE){
         case "05":	
 	    var list = data.list; 
 					
 	    for(index = 0;index < list.length;index++){
 	       $("#menuEmpresa").append(
 	          "<li>" +
 	             "<a href='#' onclick='javascript:seleccionaEmpresa("+list[index].idCompany+");'>" +
 		        "<i class='fa fa-building-o' aria-hidden='true'></i>" + list[index].name.substring(0,12) +
 		     "</a>" +
 		  "</li>");
 	    }
 					
 	    if(sessionStorage.getItem("gestopcompanyid") == null || sessionStorage.getItem("gestopcompanyid") == -1){
 	       if(list.length > 0){
 	          createSession("gestopcompanyid",list[0].idCompany);
 	          createSession("gestopcompanyname",list[0].name);
 	          createSession("gestopcompanyruc",list[0].ruc);
 	          
 	          $("#companySelected").html(
 	             "<i class='fa fa-building-o' style='margin-right:10px'></i>" +
 	             "<strong>Empresa:</strong> "+list[0].name.substring(0,12));
 	       }else{
 	          createSession("gestopcompanyid",-1);
 	          $("#companySelected").html("¡No existen empresas!");
 	       }
 	    }else{
 	       $("#companySelected").html(
 	          "<i class='fa fa-building' style='margin-right:10px'></i> <strong>Empresa:</strong> "+
 	           sessionStorage.getItem("gestopcompanyname").substring(0,12) +
 		  "<span class='caret'></span>");
 	    }
 		
 	    break;
 				
         default:
 	    alert("Ocurrió un error al traer las empresas!");
      }
 		      
      functionCallBack(functionCallBackAux);
   });
}

function segundaCargaVerLateralesFijosMedicoCovid(functionCallBackAux){
   $("#icoPerfil").append(
      "<ul class='dropdown-menu' style='color :white'>" +
      //"<li onclick='marcarIconoModuloSeleccionado(0)'> <a><i class='fa fa-user-o ' aria-hidden='true'></i>Perfil</a></li>" +
      //"<li onclick='marcarIconoModuloSeleccionado(0)'> <a> <i class='fa fa-exchange ' aria-hidden='true'></i>Cambiar Contraseña</a></li>" +
         "<li class='dropdown-divider' role='presentation'></li>" +
 	 "<li onclick='cerrarSesion()'><a><i class='fa fa-power-off' aria-hidden='true'></i>Salir</a></li>" +
      "</ul>" +
      "</div>");
 	
   $("#icoPerfil a #empresaActual").html(getSession("gestopcompanyname").substr(0,12));
   $(".buscadorGosst").css(
      {"margin-top": "8px",
       "border-radius": "21px","color":"black",
       "background-color": "#ffffff"});
 	
   $("body").find("table").remove();
   $("body").find("#divCompletarActividad").remove();
   $("body").find("h4").remove();
   $("body").find(".divTituloFull").remove();
   $("body").find(".divContainerGeneral").remove();
   
   $("body").append(
      "<div class='divTituloFull'><div class='divTituloGeneral'><h4>CARGANDO...</h4></div></div>" +
      "<div class='divContainerGeneral'>" +
         "<div class='divListModulos'><ul class='list-group'></ul></div>" +
 	 "<div class='divListPrincipal'></div>" +
      "</div>");
   
   $("#menuFigureti").html("<ul class='list-group'></ul>");
   
   $("#menuMovilGosst").on("click",function(){
      $(".divContainerGeneral").toggle();
   });
        
   $(".divListSecundaria").html("");
        
   callAjaxPost(URL+"/covid/empresa/indicador",{empresaId: getSession("gestopcompanyid")},function(data){
 	   
      menuFuncionesIzquierdaMedicoCovid = data.secciones;
       
      var userAgent = isMobile.any();
 	 
      menuFuncionesIzquierdaMedicoCovid.forEach(function(val,index){
 	 if(val.id != 5){ 
 	    var textOpcionMenu = 
 	       "<li class='list-group-item' id='seccionMedicoCovid"+val.id+"' " +
 	       	   "onclick='marcarIconoModuloSeleccionadoMedicoCovid("+index+")'>" +
                  "<i class='fa "+val.icono+"' aria-hidden='true'>"+"<span></span></i>"+val.nombre+
 		   (val.estadoEspecificoCovid!= null?
 		    "<label style='margin-left:5px;' id='labelEstadoEspecifCovid"+val.estadoEspecificoCovid.id+"'></label>":"") +
               "</li>";
 	     
 	    var textOpcionMenuMovil = 
 	       "<li class='list-group-item' style='color:#2e9e8f' id='seccionMedicoCovid"+val.id+"' " +
 	           "onclick='marcarIconoModuloSeleccionadoMedicoCovid("+index+")'>" +
                  "<i class='fa "+val.icono+" ' style='width:16px;' aria-hidden='true'>"+"<span></span></i>"+val.nombre+
 		   (userAgent == true?
 	            (val.estadoEspecificoCovid!= null?
 		     "<label style='margin-left:5px;' id='labelEstadoEspecifCovid"+val.estadoEspecificoCovid.id+"'></label>":""):"") +
               "</li>";
 	     
 	    $(".divListModulos").find("ul").append(textOpcionMenu);
 			
 	    $("#menuFigureti").find("ul").append(textOpcionMenuMovil);
 	 }
 	 
 	 if(val.id == 4){
 	    $(".divListModulos #seccionMedicoCovid"+val.id).append("<i class='fa fa-plus-circle'></i>");
 	    $("#menuFigureti #seccionMedicoCovid"+val.id).append("<i class='fa fa-plus-circle'></i>");
 		    
 	    $(".divListModulos #seccionMedicoCovid"+val.id).addClass("subMenuImportant").show();
 	    $("#menuFigureti #seccionMedicoCovid"+val.id).addClass("subMenuImportant").show();
 	 }
 	 
 	 if(val.id == 15){
            $(".divListModulos #seccionMedicoCovid"+val.id).append("<i class='fa fa-plus-circle'></i>");
            $("#menuFigureti #seccionMedicoCovid"+val.id).append("<i class='fa fa-plus-circle'></i>");
 		    
            $(".divListModulos #seccionMedicoCovid"+val.id).addClass("subMenuImportantOk").show();
            $("#menuFigureti #seccionMedicoCovid"+val.id).addClass("subMenuImportantOk").show();
 	 }
 							
 	 if(val.seccionPadreId > 0){
            $(".divListModulos #seccionMedicoCovid"+val.id).remove();
            $("#menuFigureti #seccionMedicoCovid"+val.id).remove();

            $(".divListModulos #seccionMedicoCovid"+val.seccionPadreId).after(textOpcionMenu);
            $("#menuFigureti #seccionMedicoCovid"+val.seccionPadreId).after(textOpcionMenuMovil);

            $(".divListModulos #seccionMedicoCovid"+val.id).addClass("subMenu").hide();
            $("#menuFigureti #seccionMedicoCovid"+val.id).addClass("subMenu").hide();
 	 }
      });
       
      actualizarIndicadoresSecciones(data.indicadores);
    
      if(numModificaciones == 0){
 	 marcarIconoModuloSeleccionadoMedicoCovid(1);
      }else{
     	 functionCallBackAux(estadoEspecificoCovidGlobalId);
      }
   });
   
   completarBarraCarga();
}

function actualizarIndicadoresSecciones(indicadores){
   var indicador3=0;
   var indicador12=0;
    
   indicadores.forEach(function(val){
       if(val.id == 9 || val.id == 10 || val.id == 11){
	  indicador3=indicador3+parseInt(val.indicador);
       }else if(val.id == 2 || val.id == 8){
	  indicador12=indicador12+parseInt(val.indicador);
       }
       
      $("#labelEstadoEspecifCovid"+val.id).html("("+val.indicador+")")
   });
   
   $("#labelEstadoEspecifCovid3").html("("+indicador3+")")
   $("#labelEstadoEspecifCovid12").html("("+indicador12+")")
}

function habilitarTrabajadoresMedicoCovid(estadoEspecifCovidId){
   $(".divListPrincipal").html("");
    
   var listPanelesPrincipalResumen = obtenerPanelesAcordeEstadoEspecificoCovid(estadoEspecifCovidId);
   agregarPanelesDivPrincipalColaborador(listPanelesPrincipalResumen);
   
   var dataParam={
      empresaId: getSession("gestopcompanyid"),	
      estadoEspecificoCovid: {id: estadoEspecifCovidId}
   };
   
   callAjaxPost(URL+"/covid/vista_medico_covid/carga_seccion",dataParam,function(data){
      procesarTrabajadoresMedicoCovid(data,estadoEspecifCovidId)});
}

var listTrabajadoresCovidRevisar = [];
var objTrabajadorCovidRevisar = [];

var funcionalidadesTrabajadorCovidRevisar=[ 
   {id:"opcAddObsMedica", nombre:"<i class='fa fa-plus'></i> Agregar observación médica",
    functionClick:function(data){agregarObservacionMedica(1)}},
   {id:"opcVerFormularios", nombre:"<i class='fa fa-eye'></i> Ver / Detallar formularios anteriores",
    functionClick:function(data){verHistorialFormularioCovid(1)}},
   {id:"opcVerObsMedica", nombre:"<i class='fa fa-eye'></i> Ver observaciones médicas",
    functionClick:function(data){verHistorialObservacionMedica(objTrabajadorCovidRevisar.trabajadorId)}},
   {id:"opcEditAntMedico", nombre:"<i class='fa fa-pencil'></i> Editar Antecedente Médico",
    functionClick:function(data){editarAntecedenteMedicoVistaMedCov()}},
   {id:"opcRellForMedico", nombre:"<i class='fa fa-list-alt'></i> Registrar nuevo formulario de síntomas",
    functionClick:function(data){rellenarFormularioCovidVistaMedCov()}},
   {id:"opcAsignarMedico", nombre:"<i class='fa fa-user-md'></i> Asignar médico responsable",
    functionClick:function(data){asignarResponsableVistaMedCov(1)}},
   {id:"opcVerBitacora", nombre:"<i class='fa fa-address-book-o'></i> Ver Bitácora de contacto",
    functionClick:function(data){verBitacoraContactoVistaMedCov()}},
   {id:"opcEditDeclaJuradaTrab", nombre:"<i class='fa fa-file-o'></i> Editar Declaración jurada - COVID-19",
    functionClick:function(data){editarDeclaracionJuradaTrabVistaMedCov()}}
];

function marcarSubOpcionTrabajadorCovidRevisar(pindex){
   funcionalidadesTrabajadorCovidRevisar[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function toggleMenuOpcionTrabajadorCovidRevisar(obj,pindex){
   objTrabajadorCovidRevisar = listTrabajadoresCovidRevisar[pindex];
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

function procesarTrabajadoresMedicoCovid(data,estadoEspecifCovidId){
   var menuOpcion="<ul class='list-group listaFinalGestionGosst' >";
	
   funcionalidadesTrabajadorCovidRevisar.forEach(function(val1,index1){
      menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionTrabajadorCovidRevisar("+index1+")'>"+val1.nombre+" </li>";
   });
			
   menuOpcion+="</ul>";
    
   switch(parseInt(estadoEspecifCovidId)){
      case 1:
      case 2:
      case 8:
      case 7:
          //todos los trabajadores
          $("#subTodosTrabajadores .contenidoSubList").html("");
	
	  listTrabajadoresCovidRevisar=data.trabajadores;
			
	  var textTotal="";
	  
	  listTrabajadoresCovidRevisar.forEach(function(val,index){
	     var btnOpcion = 
		"<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionTrabajadorCovidRevisar(this,"+index+")'>" +
		   "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
		"</a>";
	     
	     var btnOpcionAux1 = 
		"<a id='btnVerRegTrabMedCov"+val.trabajadorId+"' class='btn-gestion efectoLink' " +
	           "onclick='verDetallesRegistroTrabMedicoCovid("+index+")'>" +
		   "<i class='fa fa-eye' aria-hidden='true'></i> Ver Detalles" +
	        "</a>";

	     var btnOpcionAux2 = 
		"<a id='btnOcultarRegTrabMedCov"+val.trabajadorId+"' style='display:none' class='btn-gestion efectoLink' " +
	           "onclick='ocultarDetallesRegistroTrabMedicoCovid("+index+")'>" +
		   "<i class='fa fa-eye-slash' aria-hidden='true'></i> Ocultar Detalles" +
		"</a>";
	     
	     var listTotal=obtenerListaDatosTrabajadorCovid(val,btnOpcion,menuOpcion,btnOpcionAux1,btnOpcionAux2);
	         
	     textTotal+="<div class='eventoGeneral'>" +
	                   "<form class='eventoGeneral'>"; 
	        listTotal.forEach(function(val,index){
		   textTotal+=""+obtenerSubPanelModuloVersionDos(val);
	        });
	     textTotal+=   "</form>" +
		        "</div>";
	  });
			
	  $("#subTodosTrabajadores .tituloSubList label").html("("+listTrabajadoresCovidRevisar.length+")");
			
	  $("#subTodosTrabajadores .contenidoSubList").html(textTotal);
			 
	  $("#subTodosTrabajadores .contenidoSubList").show();

	  $(".detalle-principalMedCov").hide();
	  $(".listaFinalGestionGosst").hide();
	  $(".contenidoFormVisible").hide();
	  break;
	  
      case 9:
      case 10:
      case 11:
	  var textIn= "";
	  var textAtenderSinRespuesta="",textAtenderConRespuesta="";
	  var numConSinRespuesta=0,numConConRespuesta=0;
	  
	  listTrabajadoresCovidRevisar=data.trabajadores;
	  
	  listTrabajadoresCovidRevisar.forEach(function(val,index){
	     var btnOpcion = 
		"<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionTrabajadorCovidRevisar(this,"+index+")'>" +
		   "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
		"</a>";
	     
	     var btnOpcionAux1 = 
		"<a id='btnVerRegTrabMedCov"+val.trabajadorId+"' class='btn-gestion efectoLink' " +
	           "onclick='verDetallesRegistroTrabMedicoCovid("+index+")'>" +
		   "<i class='fa fa-eye' aria-hidden='true'></i> Ver Detalles" +
	        "</a>";

	     var btnOpcionAux2 = 
		"<a id='btnOcultarRegTrabMedCov"+val.trabajadorId+"' style='display:none' class='btn-gestion efectoLink' " +
	           "onclick='ocultarDetallesRegistroTrabMedicoCovid("+index+")'>" +
		   "<i class='fa fa-eye-slash' aria-hidden='true'></i> Ocultar Detalles" +
		"</a>";
				
	     var listTotal=obtenerListaDatosTrabajadorCovid(val,btnOpcion,menuOpcion,btnOpcionAux1,btnOpcionAux2);
	     var textTotal="";
	     
	     textTotal+="<div class='eventoGeneral'>" +
                           "<form class='eventoGeneral'>"; 
                listTotal.forEach(function(val,index){
	           textTotal+=""+obtenerSubPanelModuloVersionDos(val);
                });
             textTotal+=   "</form>" +
	                "</div>";
				
	     if(val.hasSeguimientoMedicoHoy==1){
		textAtenderConRespuesta+=textTotal;
		numConConRespuesta++;
	     }else{
	        textAtenderSinRespuesta+=textTotal;
	        numConSinRespuesta++;
	     }
	  });
			
	  $("#subSinRevisar .tituloSubList label").html("("+numConSinRespuesta+")");
	  $("#subRevisados .tituloSubList label").html("("+numConConRespuesta+")");
			
	  $("#subSinRevisar .contenidoSubList").html(textAtenderSinRespuesta);
	  $("#subRevisados .contenidoSubList").html(textAtenderConRespuesta);
			 
	  $("#subSinRevisar .contenidoSubList").show();
	  $("#subRevisados .contenidoSubList").show();

	  $(".detalle-principalMedCov").hide();
	  $(".listaFinalGestionGosst").hide();
	  $(".contenidoFormVisible").hide();
	break;
	
    case 5:
    case 6:
	var textIn= "";
	var textSinSeguimiento="",textConSeguimiento="";
        var numConSinSeguimiento=0,numConConSeguimiento=0;
        
	listTrabajadoresCovidRevisar=data.trabajadores;
	
	listTrabajadoresCovidRevisar.forEach(function(val,index){
	   var btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionTrabajadorCovidRevisar(this,"+index+")'>" +
		              "<i class='fa  fa-caret-down' aria-hidden='true'></i> Ver Opciones</a>" ;
	   
	   var btnOpcionAux1 = 
	      "<a id='btnVerRegTrabMedCov"+val.trabajadorId+"' class='btn-gestion efectoLink' " +
		 "onclick='verDetallesRegistroTrabMedicoCovid("+index+")'>" +
	         "<i class='fa fa-eye' aria-hidden='true'></i> Ver Detalles" +
              "</a>";

	   var btnOpcionAux2 = 
	      "<a id='btnOcultarRegTrabMedCov"+val.trabajadorId+"' style='display:none' class='btn-gestion efectoLink' " +
		 "onclick='ocultarDetallesRegistroTrabMedicoCovid("+index+")'>" +
	         "<i class='fa fa-eye-slash' aria-hidden='true'></i> Ocultar Detalles" +
	      "</a>";
				
	   var listTotal=obtenerListaDatosTrabajadorCovid(val,btnOpcion,menuOpcion,btnOpcionAux1,btnOpcionAux2);
	   var textTotal="";
	   
	   textTotal+="<div class='eventoGeneral'>" +
                         "<form class='eventoGeneral'>"; 
	      listTotal.forEach(function(val,index){
		 textTotal+=""+obtenerSubPanelModuloVersionDos(val);
	      });
	   textTotal+=   "</form>" +
                      "</div>";

	   if(val.hasSeguimientoMedicoHoy==1){
	      textConSeguimiento+=textTotal; // con seguimiento
	      numConConSeguimiento++;
	   }else{
	      textSinSeguimiento+=textTotal; // sin seguimiento
	      numConSinSeguimiento++;
	   }
	});

	$("#subSinSeguimiento .tituloSubList label").html("("+numConSinSeguimiento+")");
	$("#subConSeguimiento .tituloSubList label").html("("+numConConSeguimiento+")");
			
	$("#subSinSeguimiento .contenidoSubList").html(textSinSeguimiento);
	$("#subConSeguimiento .contenidoSubList").html(textConSeguimiento);
			 
	$("#subSinSeguimiento .contenidoSubList").show();
	$("#subConSeguimiento .contenidoSubList").show();

	$(".detalle-principalMedCov").hide();
	$(".listaFinalGestionGosst").hide();
	$(".contenidoFormVisible").hide();
	break;
   }
}

function verDetallesRegistroTrabMedicoCovid(pindex){
   var trabajadorId = listTrabajadoresCovidRevisar[pindex].trabajadorId;
    
   $("#btnVerRegTrabMedCov"+trabajadorId).hide();
   $("#btnOcultarRegTrabMedCov"+trabajadorId).show();
   	
   $(".detalle-regTrabMedCov"+trabajadorId).show();
}

function ocultarDetallesRegistroTrabMedicoCovid(pindex){
   var trabajadorId = listTrabajadoresCovidRevisar[pindex].trabajadorId;

   $("#btnVerRegTrabMedCov"+trabajadorId).show();
   $("#btnOcultarRegTrabMedCov"+trabajadorId).hide();
      
   $(".detalle-regTrabMedCov"+trabajadorId).hide();
}

function obtenerPanelesAcordeEstadoEspecificoCovid(estadoEspecifCovidId){

   estadoEspecifCovidId=parseInt(estadoEspecifCovidId);
   
   switch(estadoEspecifCovidId){
      case 1:
      case 2:
      case 8:
      case 7:
         return [
            {id:"subTodosTrabajadores",clase:"divProyectoGeneral",nombre:"Trabajadores <label></label>",contenido:""},
	        ];
	break;
	
    case 9:
    case 10: 
    case 11:
	return [
	   {id:"subSinRevisar",clase:"divProyectoGeneral",nombre:"<span style='color:red;'>Formularios COVID-19 sin revisar</span> <label style='color:red;'></label>",contenido:""},
	   {id:"subRevisados",clase:"divProyectoGeneral",nombre:"<span style='color:blue;'>Formularios COVID-19 revisados</span> <label style='color:blue;'></label>",contenido:""},
	       ];
	break;
	
    case 5:
    case 6:
	var textoAlternativoSin="Formularios COVID-19 sin seguimiento diario";
	var textoAlternativoCon="Formularios COVID-19 con seguimiento diario";
	
	if(estadoEspecifCovidId == 4){
	   textoAlternativoSin="Trabajadores en OBSERVACIÓN por sospecha de COVID 19 sin seguimiento diario";
	   textoAlternativoCon="Trabajadores en OBSERVACIÓN por sospecha de COVID 19 con seguimiento diario"
	}
	
	return [
	   {id:"subSinSeguimiento",clase:"divProyectoGeneral",nombre:"<span style='color:red;'>"+textoAlternativoSin+" <label ></label> </span>",contenido:""},
	   {id:"subConSeguimiento",clase:"divProyectoGeneral",nombre:"<span style='color:blue;'>"+textoAlternativoCon+" <label ></label></span>",contenido:""},
	       ];
	break;
   }
}

function obtenerListaDatosTrabajadorCovid(val,btnOpcion,menuOpcion,btnOpcionAux1,btnOpcionAux2){
   var datosUltimoFormulario = 
      (val.ultimoFormulario.respuestaUno.id == 1?"*Contacto con caso confirmado COVID-19<br>":"") +
      (val.ultimoFormulario.respuestaDos.id == 1?"*Visita a centro médico<br>":"") +
      (val.ultimoFormulario.respuestaTres.id == 1?"*Ha realizado un viaje":"") +
      (val.ultimoFormulario.respuestaUno.id != 1 && val.ultimoFormulario.respuestaDos.id != 1 && 
       val.ultimoFormulario.respuestaTres.id != 1?"----":"");
    
   return [
      {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
       label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
	        "*** DATOS GENERALES DEL <br>TRABAJADOR(A) ***" +
	     "</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Nombre",inputForm:val.nombre+btnOpcionAux1+btnOpcionAux2},
      {sugerencia:"",label:"DNI",inputForm:val.dni},
      {sugerencia:"",label:"Área",inputForm:val.area.areaName},
      {sugerencia:"",label:"Puesto de trabajo",inputForm:val.puesto.positionName},
      {sugerencia:"",label:"Teléfono",inputForm:val.ultimoAntecedente.telefonoContacto},
      {sugerencia:"",label:"Correo",inputForm:val.correo},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
       label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
	        "*** ANTECEDENTE MÉDICO ***" +
             "</span>",clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:"",
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Grupo de riesgo",inputForm:val.condicionAntecedentePersonal,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Enfermedad(es) según su antecedente:",inputForm:val.ultimoAntecedente.listEnfermedadesNombre,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
       label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
	        "*** ÚLTIMA OBSERVACIÓN MÉDICA ***" +
             "</span>",clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:"",
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Fecha de registro",inputForm:val.ultimaObservacionMedica.fechaTexto,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Comentario médico",inputForm:val.ultimaObservacionMedica.comentario,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Resultado de la prueba COVID-19",inputForm:val.ultimaObservacionMedica.resultadoPruebaCovid.nombre,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Resultado de la última observación",inputForm:val.ultimaObservacionMedica.tipoConfirmacionCovid.nombre,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
       label:"<span style='color:blue;font-size:16px;font-weight:bolder;'>" +
                "*** ÚLTIMO FORMULARIO COVID-19 ***" +
	     "</span>",clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:"",
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Fecha de registro",inputForm:val.ultimoFormulario.fechaActualizacionTexto,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Datos adicionales",inputForm:datosUltimoFormulario,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Fecha de contacto, trabajo/asistencia o viaje",inputForm:val.ultimoFormulario.fechaInicioContactoTexto,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Síntomas identificados",inputForm:val.ultimoFormulario.listSintomasNombre,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Otros síntomas",inputForm:val.ultimoFormulario.otroSintoma,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Fecha de inicio de síntoma(s)",inputForm:val.ultimoFormulario.fechaInicioSintomaTexto,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Medicamento(s) tomado(s)",inputForm:val.ultimoFormulario.medicamento,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Días con síntoma(s) / posible contacto ",inputForm:val.numDiasAislamiento,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:"",
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId},
      {sugerencia:"",label:"Fecha estimada de retorno",inputForm:val.fechaEstimadaRetornoTexto,
       clase:"detalle-principalMedCov detalle-regTrabMedCov"+val.trabajadorId}
   ]
}

var listConfirmacionesFinal = [];
var listEstadosTrabajador = [];
var listEstadoPruebaCovid = [];
var listTipoPruebaCovid = [];
var listResultadoPruebaCovid = [];

function agregarObservacionMedica(lugarDeAcceso,pindex){
    
   if(lugarDeAcceso == 2){
      objTrabajadorCovidRevisar=listFullConsolidadoResumenCovid[pindex]; //en consolidado_resumen_covid.js
   } 
   //objTrabajadorCovidRevisar.ultimoAntecedente.id != 0
   if((objTrabajadorCovidRevisar.ultimoFormulario.id != 0) 
	   && objTrabajadorCovidRevisar.hasAccesoCovid == 0){
    
      callAjaxPost(URL+"/covid/observacion_medica/filtro",{},function(data){
	 
         var listFullAnexo = data.list;
         listEstadosTrabajador = data.estados;
         listEstadoPruebaCovid = data.listEstadoPruebaCovid;
         listTipoPruebaCovid = data.listTipoPruebaCovid;
         listResultadoPruebaCovid = data.listResultadoPruebaCovid;
         
         switch((lugarDeAcceso == 1?estadoEspecificoCovidGlobalId
	      			   :objTrabajadorCovidRevisar.estadoEspecificoCovid.id)){
	    case 1:
	       listConfirmacionesFinal = data.confirmacionesCaso1;
	       break;
	  
	    case 2:
	    case 8:
	       listConfirmacionesFinal = data.confirmacionesCaso2
	       break;
	  
	    case 9:
	       listConfirmacionesFinal = data.confirmacionesCaso9;
	       break;
	       
	    case 10:
	       listConfirmacionesFinal = data.confirmacionesCaso10;
	       break;
      
	    case 11:
               listConfirmacionesFinal = data.confirmacionesCaso11;
               break;
	  
	    case 6:
	       listConfirmacionesFinal = data.confirmacionesCaso6;
	       break;
	  
	    case 4:
	       listConfirmacionesFinal = data.confirmacionesCaso4;
	       break;
	  
	    case 5:
	       listConfirmacionesFinal = data.confirmacionesCaso5;
	       break;
	  
	    case 7:
	       listConfirmacionesFinal = data.confirmacionesCaso7;
	       break;
         }
      
         verObservacionMedicaAcordeEstadoPruebaCovid(lugarDeAcceso);
      });
   }else{
      
      if(objTrabajadorCovidRevisar.hasAccesoCovid == 1){
	 mensajeUx="<p>No puede agregar una observación médica en esta sección debido a que el trabajador no " +
	      "tiene un caso abierto. Para abrir un caso, registre un formulario de sintomatología.</p>";
      }else{
         mensajeUx="<p>Verificar que se ha completado el formulario renovable de sintomatología.</p>";
      }
      mensajesUx(mensajeUx,2,"");  
   }
}

var listResultadoPruebaCovidAux =[];

function verObservacionMedicaAcordeEstadoPruebaCovid(lugarDeAcceso){
   var selTipoPruebaCovid = crearSelectOneMenuOblig("selTipoPruebaCovid","verObservacionMedicaAcordeEstadoPruebaCovid("+lugarDeAcceso+")",
	  listTipoPruebaCovid,parseInt($("#selTipoPruebaCovid").val()),"id","nombre");
   
   if(parseInt($("#selTipoPruebaCovid").val()) == 1 || isNaN(parseInt($("#selTipoPruebaCovid").val()))){
      listResultadoPruebaCovidAux = listResultadoPruebaCovid.filter(function(val,index){
         if(val.id != 2){
            return true; 
         }else{
            return false;
         }
      });
   }else{
      listResultadoPruebaCovidAux = listResultadoPruebaCovid.filter(function(val,index){
         if(val.id == 1 || val.id == 2){
	    return true; 
	 }else{
	    return false;
	 }
      });
   }
   
   var selResultadoPruebaCovid = crearSelectOneMenu("selResultadoPruebaCovid","",listResultadoPruebaCovidAux,
	           parseInt($("#selResultadoPruebaCovid").val()),"id","nombre");
   
   var selEstadoTrabCovid = crearSelectOneMenu("selEstadoTrabCovid","",listEstadosTrabajador,
	        parseInt($("#selEstadoTrabCovid").val()),"id","nombre");
   
   var selConfirmacionCovid = crearSelectOneMenu("selConfirmacionCovid","",listConfirmacionesFinal,
          parseInt($("#selConfirmacionCovid").val()),"id","nombre");
   
   //Orden del sí y no en el formulario.
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
      return val2.id - val.id;
   });
   
   if(objTrabajadorCovidRevisar.fechaEstimadaRetornoTexto != ""){
      var radioConfirmacionFechaRetorno = crearRadiosAuto("radioConfirmacionFechaRetorno",listBooleanSiNo,"",
	       "id","nombre","habilitarCampoFechaRetorno");
   }
   
   var selEstadoPruebaCovid = crearSelectOneMenu("selEstadoPruebaCovid","verObservacionMedicaAcordeEstadoPruebaCovid("+lugarDeAcceso+")",
	    listEstadoPruebaCovid,parseInt($("#selEstadoPruebaCovid").val()),"id","nombre","No");
   
   var valueAuxComentario= ($("#textAreaComentario").val() == undefined?"":$("#textAreaComentario").val());
   var valueAuxComentarioEntFam= ($("#textAreaComentarioEntFam").val() == undefined?"":$("#textAreaComentarioEntFam").val());
   var valueAuxReporteContactoDirectoEstrecho = ($("#textObsMedRepConDirEst").val() == undefined?"":$("#textObsMedRepConDirEst").val());
   var valueAuxIndicaciones = ($("#textAreaIndicaciones").val() == undefined?"":$("#textAreaIndicaciones").val());
   var valueAuxFechaAislamiento= ($("#inputFechaInicioAislamientoCovid").val() == undefined?
	                          "":$("#inputFechaInicioAislamientoCovid").val());
   
   var estadoPruebaCovidId = parseInt($("#selEstadoPruebaCovid").val());
   
   if(estadoPruebaCovidId == 1){
       var valueAuxFechaPruebaCovid= ($("#inputFechaPruebaCovid").val() == undefined?
                "":$("#inputFechaPruebaCovid").val());
       var valueAuxFechaResultadoCovid= ($("#inputFechaResultadoCovid").val() == undefined?
                "":$("#inputFechaResultadoCovid").val());
       var valueAuxComentarioPru= ($("#textAreaComentarioPru").val() == undefined?
	        "":$("#textAreaComentarioPru").val());
       var valueAuxLugarPrueba= ($("#inputLugarPruebaCovid").val() == undefined?
	        "":$("#inputLugarPruebaCovid").val());
   }
   
   var contenido ="";
   var listContenido = [];
   
   switch(estadoPruebaCovidId){
      case 1:
	  listContenido=[
              {sugerencia:"",label:"Fecha y hora del reporte de la observación:",inputForm:obtenerFechaActualTotal()},
              (objTrabajadorCovidRevisar.ultimoFormulario.fechaInicioAislamientoTexto != ""?{sugerencia:"",label:"",inputForm:""}:
	      {sugerencia:"",label:"Fecha inicio de aislamiento <strong style='color:blue;font-weight:bold;'>(Opcional)</strong>",
	       inputForm:"<input type='date' id='inputFechaInicioAislamientoCovid' " +
	       		        "value='"+valueAuxFechaAislamiento+"' class='form-control'>"}),
              {sugerencia:"",label:"Describa síntomas y tratamiento del trabajador",
               inputForm:"<textarea class='form-control' id='textAreaComentario'>" +
                             valueAuxComentario +
                   	 "</textarea>"},
              {sugerencia:"",label:"Comentario del entorno familiar",
               inputForm:"<textarea class='form-control' id='textAreaComentarioEntFam'>" +
                             valueAuxComentarioEntFam +
                         "</textarea>"},
              {sugerencia:"",
               label:"Contactos directos o estrechos con compañeros de trabajo ",
               inputForm:"<textarea class='form-control' id='textObsMedRepConDirEst'>" +
                             valueAuxReporteContactoDirectoEstrecho +
                         "</textarea>"},
              {sugerencia:"",label:"Indicaciones al trabajador",
               inputForm:"<textarea class='form-control' id='textAreaIndicaciones'>" +
                             valueAuxIndicaciones + 		
                         "</textarea>"},
              {sugerencia:"",label:"",inputForm:""},
              {sugerencia:"",label:"¿Se programó o realizó una prueba COVID-19?",inputForm:selEstadoPruebaCovid},
              {sugerencia:"",label:"Fecha de la prueba realizada",
               inputForm:"<input type='date' id='inputFechaPruebaCovid' " +
               		        "value='"+valueAuxFechaPruebaCovid+"' class='form-control'>"},
              {sugerencia:"",label:"Fecha del resultado",
               inputForm:"<input type='date' id='inputFechaResultadoCovid' " +
               		        "value='"+valueAuxFechaResultadoCovid+"' class='form-control'>"},
              {sugerencia:"",label:"Tipo de prueba",inputForm:selTipoPruebaCovid+""},
              {sugerencia:"",label:"Resultado de la prueba",inputForm:selResultadoPruebaCovid+""},
              {sugerencia:"",label:"Comentario de la prueba",
               inputForm:"<textarea class='form-control' id='textAreaComentarioPru'>" +
                             valueAuxComentarioPru+
                         "</textarea>"},
              {sugerencia:"",label:"Lugar de la prueba",
               inputForm:"<input class='form-control' id='inputLugarPruebaCovid' " +
               		        "value='"+valueAuxLugarPrueba+"'>"},
              {sugerencia:"",label:"",inputForm:""},
              {sugerencia:"",label:"Evidencia <strong style='color:blue;font-weight:bold;'>(Opcional)</strong>",
   	       inputForm:"<div id='inputEvidenciaOpc'></div>",divContainer:""},
              {sugerencia:"",label:"Estado del trabajador",inputForm:selEstadoTrabCovid+""},
              {sugerencia:"",label:"Resultado de la observación",inputForm:selConfirmacionCovid+""},
              (objTrabajadorCovidRevisar.fechaEstimadaRetornoTexto == ""?{sugerencia:"",label:"",inputForm:""}:
              {sugerencia:"",label:"¿Va a modificar la fecha estimada de retorno del trabajador?",
               inputForm:radioConfirmacionFechaRetorno}),
              {sugerencia:"",label:"Fecha estimada de retorno",
               inputForm:"<input type='date' id='inputFechaEstimadaRetornoObsMed' class='form-control'>"},
              {sugerencia:"",label:"",inputForm:""},
              {sugerencia:"",label:"",
               inputForm:"<button style='float:right;font-size:18px;' type='submit' " +
              		         "class='btn btn-success'>" +
                    	    "<i class='fa fa-floppy-o'></i> Guardar" +
                    	 "</button>"}
                            ];
          break;
          
      case 2:
	  listContenido=[
	      {sugerencia:"",label:"Fecha y hora del reporte de la observación:",inputForm:obtenerFechaActualTotal()},
	      (objTrabajadorCovidRevisar.ultimoFormulario.fechaInicioAislamientoTexto != ""?{sugerencia:"",label:"",inputForm:""}:
	      {sugerencia:"",label:"Fecha inicio de aislamiento <strong style='color:blue;font-weight:bold;'>(Opcional)</strong>",
	       inputForm:"<input type='date' id='inputFechaInicioAislamientoCovid' " +
	       		        "value='"+valueAuxFechaAislamiento+"' class='form-control'>"}),
	      {sugerencia:"",label:"Describa síntomas y tratamiento del trabajador",
	       inputForm:"<textarea class='form-control' id='textAreaComentario'>" +
	                     valueAuxComentario+
	                 "</textarea>"},
	      {sugerencia:"",label:"Comentario del entorno familiar",
	       inputForm:"<textarea class='form-control' id='textAreaComentarioEntFam'>" +
	                     valueAuxComentarioEntFam+
	                 "</textarea>"},
	      {sugerencia:"",
	       label:"Contactos directos o estrechos con compañeros de trabajo ",
	       inputForm:"<textarea class='form-control' id='textObsMedRepConDirEst'>" +
	                     valueAuxReporteContactoDirectoEstrecho +
	                 "</textarea>"},
	      {sugerencia:"",label:"Indicaciones al trabajador",
	       inputForm:"<textarea class='form-control' id='textAreaIndicaciones'>" +
	                     valueAuxIndicaciones+ 		
	                 "</textarea>"},
	      {sugerencia:"",label:"",inputForm:""},
	      {sugerencia:"",label:"¿Se programó o realizó una prueba COVID-19?",inputForm:selEstadoPruebaCovid},
	      {sugerencia:"",label:"Fecha de la prueba programada",
	       inputForm:"<input type='date' id='inputFechaPruebaProgramadaCovid' class='form-control'>"},
	      {sugerencia:"",label:"Comentario de la prueba",
	       inputForm:"<textarea class='form-control' id='textAreaComentarioPru'></textarea>"},
	      {sugerencia:"",label:"Lugar de la prueba",
	       inputForm:"<input class='form-control' id='inputLugarPruebaCovid'>"},
	      {sugerencia:"",label:"",inputForm:""},
	      {sugerencia:"",label:"Evidencia <strong style='color:blue;font-weight:bold;'>(Opcional)</strong>",
	       inputForm:"<div id='inputEvidenciaOpc'></div>",divContainer:""},
	      {sugerencia:"",label:"Estado del trabajador",inputForm:selEstadoTrabCovid+""},
	      {sugerencia:"",label:"Resultado de la observación",inputForm:selConfirmacionCovid+""},
	      (objTrabajadorCovidRevisar.fechaEstimadaRetornoTexto == ""?{sugerencia:"",label:"",inputForm:""}:
	      {sugerencia:"",label:"¿Va a modificar la fecha estimada de retorno del trabajador?",
	       inputForm:radioConfirmacionFechaRetorno}),
	      {sugerencia:"",label:"Fecha estimada de retorno",
	       inputForm:"<input type='date' id='inputFechaEstimadaRetornoObsMed' class='form-control'>"},
	      {sugerencia:"",label:"",inputForm:""},
	      {sugerencia:"",label:"",
	       inputForm:"<button style='float:right;font-size:18px;' type='submit' " +
	       		         "class='btn btn-success'>" +
	                    "<i class='fa fa-floppy-o'></i> Guardar" +
	                 "</button>"}
	                    ];
	  break;
	
      default:
          listContenido=[
	      {sugerencia:"",label:"Fecha y hora del reporte de la observación:",inputForm:obtenerFechaActualTotal()},
	      (objTrabajadorCovidRevisar.ultimoFormulario.fechaInicioAislamientoTexto != ""?{sugerencia:"",label:"",inputForm:""}:
	      {sugerencia:"",label:"Fecha inicio de aislamiento <strong style='color:blue;font-weight:bold;'>(Opcional)</strong>",
	       inputForm:"<input type='date' id='inputFechaInicioAislamientoCovid' " +
	       		        "value='"+valueAuxFechaAislamiento+"' class='form-control'>"}),
	      {sugerencia:"",label:"Describa síntomas y tratamiento del trabajador",
               inputForm:"<textarea class='form-control' id='textAreaComentario'>" +
                             valueAuxComentario+
                  	 "</textarea>"},
              {sugerencia:"",label:"Comentario del entorno familiar",
               inputForm:"<textarea class='form-control' id='textAreaComentarioEntFam'>" +
                             valueAuxComentarioEntFam+
                         "</textarea>"},
              {sugerencia:"",
               label:"Contactos directos o estrechos con compañeros de trabajo ",
               inputForm:"<textarea class='form-control' id='textObsMedRepConDirEst'>" +
                             valueAuxReporteContactoDirectoEstrecho +
                         "</textarea>"},
              {sugerencia:"",label:"Indicaciones al trabajador",
               inputForm:"<textarea class='form-control' id='textAreaIndicaciones'>" +
                             valueAuxIndicaciones+ 		
                         "</textarea>"},
              {sugerencia:"",label:"",inputForm:""},
	      {sugerencia:"",label:"¿Se programó o realizó una prueba COVID-19?",inputForm:selEstadoPruebaCovid},
	      {sugerencia:"",label:"",inputForm:""},
	      {sugerencia:"",label:"Evidencia <strong style='color:blue;font-weight:bold;'>(Opcional)</strong>",
	       inputForm:"<div id='inputEvidenciaOpc'></div>",divContainer:""},
	      {sugerencia:"",label:"Estado del trabajador",inputForm:selEstadoTrabCovid+""},
	      {sugerencia:"",label:"Resultado de la observación",inputForm:selConfirmacionCovid+""},
	      (objTrabajadorCovidRevisar.fechaEstimadaRetornoTexto == ""?{sugerencia:"",label:"",inputForm:""}:
	      {sugerencia:"",label:"¿Va a modificar la fecha estimada de retorno del trabajador?",
	       inputForm:radioConfirmacionFechaRetorno}),
	      {sugerencia:"",label:"Fecha estimada de retorno",
	       inputForm:"<input type='date' id='inputFechaEstimadaRetornoObsMed' class='form-control'>"},
	      {sugerencia:"",label:"",inputForm:""},
	      {sugerencia:"",label:"",
	       inputForm:"<button style='float:right;font-size:18px;' type='submit' " +
	       		         "class='btn btn-success'>" +
	    		    "<i class='fa fa-floppy-o'></i> Guardar" +
	    		 "</button>"}
	                ];
	  break;
   }
     
     listContenido.forEach(function(val){
        contenido +=obtenerSubPanelModuloGeneral(val);
     });
		
     var modalOptions= {
	      id:"modalObservacionMedica",
    	      nombre:"<i class='fa fa-medkit'></i> Agregar observación médica - trabajador(a) "+objTrabajadorCovidRevisar.nombre,
              contenido: "<form id='formObservacionMedica' class='eventoGeneral'>"+contenido+"</form>"
                       };
     
     crearModalPrincipalUsuario(modalOptions,function(){ 
	// **************** Evidencia *********************
	        
	var optionsEvidenciaOpcional={
		   isImage:false,
		   container:"#inputEvidenciaOpc",
		   idAux:"Opc",
		   esNuevo:true,
		   functionCall:function(){},
		   evidenciaNombre:"",
		   descargaUrl: ""
			             };
	     
	crearFormEvidenciaCompleta(optionsEvidenciaOpcional);	
	// *********************************************** 
     },false,true);
        
     $("#formObservacionMedica").on("submit",function(e){
        e.preventDefault();
        guardarObservacionMedica(lugarDeAcceso);
     });
        
     // *** Fecha estimada de retorno del trabajador *** 
        
     if(objTrabajadorCovidRevisar.fechaEstimadaRetornoTexto == ""){
        var hoy=obtenerFechaActual();
           
        $("#inputFechaEstimadaRetornoObsMed").val(sumaFechaDias(14,hoy)); 
     
     //*************************************************
     }else{
        //console.log(objTrabajadorCovidRevisar.fechaEstimadaRetorno);
        $("#inputFechaEstimadaRetornoObsMed").val(convertirFechaInput(objTrabajadorCovidRevisar.fechaEstimadaRetorno)); 
        habilitarCampoFechaRetorno(0);
     }
}

function habilitarCampoFechaRetorno(value){
    if(value==true){
       // habilitamos
 	  document.getElementById("inputFechaEstimadaRetornoObsMed").disabled=false;
    }else{
       // deshabilitamos
 	  document.getElementById("inputFechaEstimadaRetornoObsMed").disabled=true;
 		       
       document.getElementById("inputFechaEstimadaRetornoObsMed")
          .value=convertirFechaInput(objTrabajadorCovidRevisar.fechaEstimadaRetorno);
    }
 }

var lugarDeAccesoMedCovAux;
var confirmacionAux;

function guardarObservacionMedica(lugarDeAcceso){
    
   lugarDeAccesoMedCovAux = lugarDeAcceso;
    
   var textDiv = "#formObservacionMedica"; 
   
   var formDiv=$(textDiv);
    
   var campoVacio = true; 
    
   var indicaciones = $("#textAreaIndicaciones").val();
   var comentario = $("#textAreaComentario").val();
   var reporteContacto = $("#textObsMedRepConDirEst").val();
   var estado = $("#selEstadoTrabCovid").val();
   confirmacionAux = $("#selConfirmacionCovid").val();
   
   var estadoPrueba = $("#selEstadoPruebaCovid").val();
   
   var fechaPruebaCovid = convertirFechaTexto($("#inputFechaPruebaCovid").val());
   var inputFechaPruebaCovid;
   
   if(!fechaPruebaCovid){  
      inputFechaPruebaCovid = null;
   }else{
      inputFechaPruebaCovid = fechaPruebaCovid;
   }
   
   var fechaResultadoCovid = convertirFechaTexto($("#inputFechaResultadoCovid").val());
   var inputFechaResultadoCovid;
   
   if(!fechaResultadoCovid){  
      inputFechaResultadoCovid = null;
   }else{
      inputFechaResultadoCovid = fechaResultadoCovid;
   }
   
   var fechaPruebaProgramadaCovid = convertirFechaTexto($("#inputFechaPruebaProgramadaCovid").val());
   var inputFechaPruebaProgramadaCovid;
   
   if(!fechaPruebaProgramadaCovid){  
      inputFechaPruebaProgramadaCovid = null;
   }else{
      inputFechaPruebaProgramadaCovid = fechaPruebaProgramadaCovid;
   }
   
   var valListTipoPruebaCovid = parseInt(formDiv.find("#selTipoPruebaCovid").val());
   var valListResultadoPruebaCovid = parseInt(formDiv.find("#selResultadoPruebaCovid").val());
   var comentarioPrueba = formDiv.find("#textAreaComentarioPru").val();
   var inputLugarPrueba = formDiv.find("#inputLugarPruebaCovid").val();
   var comentarioEntornoFamiliar = formDiv.find("#textAreaComentarioEntFam").val();
   
   // *** Fecha estimada de retorno del trabajador *** 
   
   var radioValueModificarFecha;
   var fechaEstimadaRetorno = convertirFechaTexto($("#inputFechaEstimadaRetornoObsMed").val());
   var inputFechaEstimadaRetorno;
   
   if(objTrabajadorCovidRevisar.fechaEstimadaRetornoTexto == ""){
      radioValueModificarFecha = 1; 
   }else{
      radioValueModificarFecha = formDiv.find("input[name='radioConfirmacionFechaRetorno']:checked").val();
   }
   
   if(radioValueModificarFecha == null){
      campoVacio = false;
   }
   
   if(!fechaEstimadaRetorno){  
      inputFechaEstimadaRetorno = null;
   }else{
      inputFechaEstimadaRetorno = fechaEstimadaRetorno;
   }
   
   var fechaInicioAislamiento = convertirFechaTexto($("#inputFechaInicioAislamientoCovid").val());
   var inputFechaInicioAislamiento;
   
   if(!fechaInicioAislamiento){  
      inputFechaInicioAislamiento = null;
   }else{
      inputFechaInicioAislamiento = fechaInicioAislamiento;
   }
   
   // *************************************************
   
   // ***************** Validación ********************
   
   var estadoPruebaCovidId = parseInt($("#selEstadoPruebaCovid").val());
   
   switch(estadoPruebaCovidId){
      case 1:
	  if(indicaciones.length == 0 || comentario.length == 0 || comentarioEntornoFamiliar.length == 0 || 
	     estado == -1 || confirmacionAux == -1 || inputFechaPruebaCovid == null || inputFechaResultadoCovid == null || 
	     valListTipoPruebaCovid == -1 || valListResultadoPruebaCovid == -1 || comentarioPrueba.length == 0 || 
	     inputLugarPrueba.length == 0 || reporteContacto.length == 0){
	     campoVacio = false;  
	  }
	  
	  break;
      case 2:
	  if(indicaciones.length == 0 || comentario.length == 0 || comentarioEntornoFamiliar.length == 0 || 
	     estado == -1 || confirmacionAux == -1 || inputFechaPruebaProgramadaCovid == null ||
	     comentarioPrueba.length == 0 || inputLugarPrueba.length == 0 || reporteContacto.length == 0){
	     campoVacio = false;  
	  }
	  
	  break;
      default:
	  if(indicaciones.length == 0 || comentario.length == 0 || comentarioEntornoFamiliar.length == 0 || 
	     estado == -1 || confirmacionAux == -1 || reporteContacto.length == 0){
	     campoVacio = false;  
	  }
	  
	  break;
   }

   //**************************************************
   if(campoVacio){
      
      $("#modalObservacionMedica").modal("hide");

      var contenidoAux ="";
      var valEstadoTra,valConfCovid;
      
      // *** Valores para el mensaje de confirmación previo ***
	  
      listEstadosTrabajador.forEach(function(val){
         if(val.id == $("#selEstadoTrabCovid").val()){
            valEstadoTra = val.nombre; 	   
         }
      });
     
      listConfirmacionesFinal.forEach(function(val){
         if(val.id == $("#selConfirmacionCovid").val()){
            valConfCovid = val.nombre; 	   
         }
      });
       
      if(confirmacionAux == 1){
	 var selDetalleAltaCovid = crearSelectOneMenuOblig("selDetalleAltaCovid","",
		  listDetalleAltaCovid,"","id","nombre"); 
	 
         var listContenidoAux=[
                {sugerencia:"",label:"Estado del trabajador",
                 inputForm:"<span style='color:red;font-weight:bolder;'>"+valEstadoTra+"</span>"},
                {sugerencia:"",label:"Resultado de la observación",
                 inputForm:"<span style='color:red;font-weight:bolder;'>"+valConfCovid+"</span>"},
                {sugerencia:"",label:"",inputForm:""},
                {sugerencia:"",label:"Detalle del alta COVID",inputForm:""+selDetalleAltaCovid},
                {sugerencia:"",label:"",inputForm:""},
                {sugerencia:"",
                 label:"<button class='btn btn-danger' type='button' onclick='cancelarMensajeConfirmacionObsMedMain()'>" +
                          "<i class='fa fa-times'></i> Cancelar" +
                       "</button>",
                 inputForm:"<button type='submit' class='btn btn-success' style='float:right;'>" +
          		      "<i class='fa fa-check'></i> Aceptar" +
          		   "</button>"}
                              ];
      }else{
	 var listContenidoAux=[
	        {sugerencia:"",label:"Estado del trabajador",
	         inputForm:"<span style='color:red;font-weight:bolder;'>"+valEstadoTra+"</span>"},
	        {sugerencia:"",label:"Resultado de la observación",
	         inputForm:"<span style='color:red;font-weight:bolder;'>"+valConfCovid+"</span>"},
	        {sugerencia:"",label:"",inputForm:""},
	        {sugerencia:"",
	         label:"<button class='btn btn-danger' type='button' onclick='cancelarMensajeConfirmacionObsMedMain()'>" +
	                  "<i class='fa fa-times'></i> Cancelar" +
	               "</button>",
	         inputForm:"<button type='submit' class='btn btn-success' style='float:right;'>" +
	                      "<i class='fa fa-check'></i> Aceptar" +
	                   "</button>"}
	                      ];
      }
   
      listContenidoAux.forEach(function(val){
          contenidoAux +=obtenerSubPanelModuloGeneral(val);
      });
          		
      var modalOptionsAux={
	 id: "modalConfirmacionPreviaObsMed",
    	 nombre: "<i class='fa fa-bell'></i> Estimado usuario, por favor, confirmar la siguiente información:",
         contenido: "<form id='formConfirmacionPreviaObsMed' class='eventoGeneral'>"+contenidoAux+"</form>"
      };
          		
      crearModalPrincipalUsuario(modalOptionsAux,function(){},false,true);
       
      $("#formConfirmacionPreviaObsMed").on("submit",function(e){
           e.preventDefault();
           var dataParam = {
     	      id:0,
     	      trabajadorId:objTrabajadorCovidRevisar.trabajadorId,
     	      comentario:comentario,
     	      indicaciones:indicaciones,
     	      estadoMedicoCovid:{id:estado},
     	      tipoConfirmacionCovid:{id:confirmacionAux},
     	      fechaPrueba:inputFechaPruebaCovid,
     	      fechaResultado:inputFechaResultadoCovid,
     	      tipoPruebaCovid:{id:valListTipoPruebaCovid},
     	      resultadoPruebaCovid:{id:valListResultadoPruebaCovid},
     	      detalleAltaCovidId: (confirmacionAux == 1?$("#selDetalleAltaCovid").val():null),
     	      comentarioPrueba:comentarioPrueba,
     	      lugarPrueba:inputLugarPrueba,
     	      comentarioEntornoFamiliar: comentarioEntornoFamiliar,
     	      reportaContactoDirectoEstrecho: reporteContacto,
     	      actualizarFechaRetorno: radioValueModificarFecha,
 	      fechaEstimadaRetorno: inputFechaEstimadaRetorno,
 	      formularioCovidId: objTrabajadorCovidRevisar.ultimoFormulario.id,
 	      fechaPruebaProgramada:inputFechaPruebaProgramadaCovid,
 	      fechaInicioAislamiento:inputFechaInicioAislamiento
           };
         
         callAjaxPost(URL+"/covid/observacion_medica/save",dataParam,procesarResultadoGuardarObservacionMedica);
      }); 
   }else{
      $("#modalObservacionMedica").modal("hide");
      
      mensajeUx="<label>Debe ingresar la información respectiva en los campos activos.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposObsMed");
       
      $("#modalMensajeUxAvisoCompletarCamposObsMed").on("hidden.bs.modal",function(){
	 $("#modalObservacionMedica").modal("show");    
      });
   } 
}

function procesarResultadoGuardarObservacionMedica(data){
   switch(data.CODE_RESPONSE){
      case "05":
	  guardarEvidenciaAuto(data.nuevoId,"fileEviOpc",bitsMega*10,
		 "/covid/observacion_medica/evidencia/save",
          function(){
	      $("#modalConfirmacionPreviaObsMed").modal("hide");
              $("#modalObservacionMedica").remove();
           
              if(lugarDeAccesoMedCovAux == 1){ // 1 -> desde el registro del trabajador || 
        	                               // 2 -> desde el consolidado resumen - casos activos COVID-19
                 mensajeUbicacionRegistroTrabajador(confirmacionAux); 
              
                 $("#modalMensajeUxMensajeUbiRegTra").on("hidden.bs.modal",function(){
                     numModificaciones++;
		     verLateralesFijosMedicoCovid(habilitarTrabajadoresMedicoCovid);
	           });
              }else{
                 mensajeUx="<p align='left'>La observación médica se guardó con éxito.</p>";

                 mensajesUx(mensajeUx,1,"","MensajeUbiRegTra");  
     	  
                 $("#modalMensajeUxMensajeUbiRegTra").on("hidden.bs.modal",function(){
                    $("#divConsolidadoResumenCovidTabla").remove();
                    verTablaConsolidadoResumenCovid()
                 }); 
              }
	  });  
	  break;

      default:
	  alert("Ocurrió un error al guardar la evidencia!");
   }
}

function cancelarMensajeConfirmacionObsMedMain(){
    $("#modalConfirmacionPreviaObsMed").modal("hide");
    $("#modalObservacionMedica").modal("show");
}

function resaltarCampoObligatorioObservacionCovid(id,valorCampo,tipo){
    
   var idParrafo = id;
   //console.log(idParrafo);
     
   if(tipo == 1){
      if(valorCampo == null || valorCampo.length == 0){
 	 document.getElementById(idParrafo).style.background = "#FFFF00";
      }else{
 	 document.getElementById(idParrafo).style.background = "#FFFFFF";
      }
   }else if(tipo == 2){
      if(valorCampo == -1){
 	 document.getElementById(idParrafo).style.background = "#FFFF00";
      }else{
 	 document.getElementById(idParrafo).style.background = "#FFFFFF";
      }
   }
}

function mensajeUbicacionRegistroTrabajador(confirmacionId){
    
   var nombreSeccion;
   
   if(confirmacionId == 8){
      nombreSeccion="Trabajadores fallecidos por COVID-19.";
   }else if(confirmacionId == 4){
      nombreSeccion="Trabajadores recuperados – En observación.";  
   }else if(confirmacionId == 3 || confirmacionId == 7){
      nombreSeccion="Trabajadores con COVID-19";  
   }else if(confirmacionId == 9 || confirmacionId == 12){
      nombreSeccion="Trabajadores con infección respiratoria.";   
   }else if(confirmacionId == 10 || confirmacionId == 11){
      nombreSeccion="Trabajadores con sospecha de COVID-19 por síntomas.";   
   }else if(confirmacionId == 13){
      nombreSeccion="Trabajadores con sospecha de COVID-19 por contacto.";   
   }else if(confirmacionId == 1 || confirmacionId == 5){
      nombreSeccion="Trabajadores sin sospecha de COVID-19 (según su factor de riesgo)";  
   }
   
   mensajeUx="<p align='left'>La observación médica se guardó con éxito.<br>" +
   	        "El registro del trabajador fue enviado a la sección " +
   	        "<span style='color:blue;font-weight:bold;'>"+nombreSeccion+"</span></p>";
   
   mensajesUx(mensajeUx,1,"","MensajeUbiRegTra"); 
}

function verHistorialFormularioCovid(lugarDeAcceso,pindex){
   if(lugarDeAcceso == 2){
      objTrabajadorCovidRevisar = listFullConsolidadoResumenCovid[pindex]; //en consolidado_resumen_covid.js
   }  
    
   var dataParam={
      trabajadorId: objTrabajadorCovidRevisar.trabajadorId,
      empresaId: getSession("gestopcompanyid")
   };
    
   callAjaxPost(URL+"/covid/formulario_covid/historial",dataParam,function(data){
      listFullFormularios = data.listFormularioCovid;
      listIdentificarSintoma = data.listIdentificarSintoma;
      listTiempoEstimado = data.listTiempoEstimado;
	
      var preguntasAux=[
         "1. CONTACTO CON CASO CONFIRMADO COVID-19 ",
         "2. VISITA A CENTRO MÉDICO",
         "3. HA REALIZADO UN VIAJE",
      ];
		
      var contenido ="";
		
      var modalOptions= {
	 maxWidth: "90%",
	 id: "modalHistorialFormulario",
	 nombre: "<i class='fa fa-eye'></i> Historial Formularios médica - trabajador(a) "+objTrabajadorCovidRevisar.nombre,
	 contenido: 
	    "<div class='wrapper' id='wrapperHistorialFormularios'>" +
	       "<table id='tableHistorialFormulario' class='table table-striped table-bordered table-hover table-fixed'>" +
	          "<thead>" +
		     "<tr>" +
		        "<th class='tb-acc' rowspan='2' style='width:80px'>N°</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:200px'>Fecha y hora de registro</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:200px'>"+preguntasAux[0]+"</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:200px'>"+preguntasAux[1]+"</td>" +
			"<th class='tb-acc' rowspan='2' style='width:200px'>"+preguntasAux[2]+"</td>" +
			"<th class='tb-acc' rowspan='2' style='width:300px'>Síntomas</td>" +
			(parseInt(getSession("gestopcompanyid")) != 648 && parseInt(getSession("gestopcompanyid")) != 649?"":
			 "<th class='tb-acc' colspan='5' style='width:1250px'>Prueba COVID-19</td>") +
			"<th class='tb-acc' rowspan='2' style='width:200px'>Adjuntar / Editar anexo</td>" +
			"<th class='tb-acc' colspan='5' style='width:1100px'>Anexo Formulario Renovable COVID-19</td>" +
		     "</tr>" +
		     "<tr>" +
		        (parseInt(getSession("gestopcompanyid")) != 648 && parseInt(getSession("gestopcompanyid")) != 649?"":
		         "<th class='tb-acc' style='width:250px'>Tipo</td>" +
			 "<th class='tb-acc' style='width:250px'>Fecha</td>" +
			 "<th class='tb-acc' style='width:250px'>Resultado</td>" +
			 "<th class='tb-acc' style='width:250px'>Fecha del resultado</td>" +
			 "<th class='tb-acc' style='width:250px'>Evidencia</td>")+
		        "<th class='tb-acc' style='width:200px'>Forma de identificación de síntomas</td>" +
		        "<th class='tb-acc' style='width:200px'>Tipo estimado para no asistir al trabajo</td>" +
		        "<th class='tb-acc' style='width:200px'>Fecha de inicio del aislamiento</td>" +
		        "<th class='tb-acc' style='width:200px'>Fecha del último día laborado</td>" +
		        "<th class='tb-acc' style='width:300px'>Datos de los últimos 5 días laborados</td>" +
	             "</tr>"+
		  "</thead>" +
		  "<tbody></tbody>" +
	       "</table>" +
	    "</div>"};
		
      crearModalPrincipalUsuario(modalOptions,function(){},false,true);
		
      listFullFormularios.forEach(function(val,index){
	 var btnAgregarAnexo = 
	    "<button type='button' id='btnAgregarAnexoFormularioCovid' class='btn btn-success' style='margin-right:10px' " +
                    "onclick='editarAnexoFormularioCovid("+index+","+trabajadorId+")' " +
                    "title='Adjuntar o editar el anexo del respectivo formulario.'>" +
               "<i class='fa fa-thumb-tack fa-2x'></i>" +
            "</button>";
	 
	 var enlacePruebaCovid = (parseInt(getSession("gestopcompanyid")) != 648 && parseInt(getSession("gestopcompanyid")) != 649?"":
	    (val.evidenciaPruebaCovidNombre.length == 0?"------":
             "<a class='efectoLink' target='blank' " +
	        "href='"+URL+"/covid/formulario_covid/prueba_covid/evidencia?id="+val.id+"'>"+
 	         val.evidenciaPruebaCovidNombre+
 	     "</a>"));
	     
	 $("#tableHistorialFormulario tbody").append(
            "<tr>" +
	       "<td>"+(index+1)+"</td>" +
	       "<td>"+val.fechaActualizacionTexto+"</td>" +
	       "<td>"+val.respuestaUno.nombre+"</td>" +
	       "<td>"+val.respuestaDos.nombre+"</td>" +
	       "<td>"+val.respuestaTres.nombre+"</td>" +
	       "<td>"+val.listSintomasNombre+"</td>" +
		(parseInt(getSession("gestopcompanyid")) != 648 && parseInt(getSession("gestopcompanyid")) != 649?"":
		 "<td>"+val.tipoPruebaCovid.nombre+"</td>" +
		 "<td>"+val.fechaPruebaCovidTexto+"</td>" +
		 "<td>"+val.resultadoPruebaCovid.nombre+"</td>" +
		 "<td>"+val.fechaResultadoPruebaCovidTexto+"</td>" +
		 "<td>"+enlacePruebaCovid+"</td>") +
	       "<td>"+btnAgregarAnexo+"</td>" +
	       "<td>"+val.identificarSintoma.nombre+"</td>" +
	       "<td>"+val.tiempoEstimado.nombre+"</td>" +
	       "<td>"+val.fechaInicioAislamientoTexto+"</td>" +
	       "<td>"+val.fechaUltimoDiaLaboralTexto+"</td>" +
	       "<td style='word-break: break-all;'>"+val.detalleUltimoPeriodo+"</td>" +
            "</tr>");
      });
		
      resizeDivWrapper("wrapperHistorialFormularios",200)
      goheadfixedY("#tableHistorialFormulario","#wrapperHistorialFormularios");	
   });
}

function editarAnexoFormularioCovid(pindex,trabajadorId){
   $("#modalHistorialFormulario").modal("hide");
   
   var anexoFormularioCovidObj={}; 
   anexoFormularioCovidObj = listFullFormularios[pindex];

   var selIdentificarSintoma = crearSelectOneMenu("selIdentificarSintoma","",listIdentificarSintoma, 
	                       (anexoFormularioCovidObj.identificarSintoma.id>0?anexoFormularioCovidObj.identificarSintoma.id:"-1"),
	                       "id","nombre");
   var selTiempoEstimado = crearSelectOneMenu("selTiempoEstimado","",listTiempoEstimado,
	   		   (anexoFormularioCovidObj.tiempoEstimado.id>0?anexoFormularioCovidObj.tiempoEstimado.id:"-1"),
	   		   "id","nombre");
   
   var contenido = "";
       
   var listContenido=[
           {sugerencia:"",label:"Forma de identificación de los síntomas",inputForm:selIdentificarSintoma},
           {sugerencia:"",label:"Tiempo estimado para no asistir al trabajo",inputForm:selTiempoEstimado},
           {sugerencia:"",label:"Fecha de inicio del aislamiento",
            inputForm:"<input type='date' id='inputFechaInicioAislamientoCovid' class='form-control'>"},
           {sugerencia:"",label:"Fecha del último día laborado",
            inputForm:"<input type='date' id='inputFechaUltimoDiaLaboradoCovid' class='form-control'>"},
           {sugerencia:"",label:"Datos de los últimos 5 días laborados",
            inputForm:"<textarea class='form-control' id='textAreaDetalleUltimoPeriodo'></textarea>"},
           {sugerencia:"",
            label:"<button id='btnCancelarAnexoFormularioCovid' class='btn btn-danger' type='button'><i class='fa fa-times'></i>Cancelar</button>",
            inputForm:"<button type='submit' class='btn btn-success'><i class='fa fa-floppy'></i>Guardar</button>"}];
       
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloGeneral(val);
   });
		
   var modalOptions= {id:"modalAnexoFormularioCovid",nombre:"<i class='fa fa-medkit'></i> Adjuntar anexo del formulario COVID-19 renovable",
	              contenido: "<form id='formAnexoFormularioCovid'>"+contenido+"</form>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   
   $("#formAnexoFormularioCovid").on("submit",function(e){
      e.preventDefault();
      guardarAnexoFormularioCovid(anexoFormularioCovidObj.id,trabajadorId);
   });
   

   $("#btnCancelarAnexoFormularioCovid").on("click",function(){
       $("#modalAnexoFormularioCovid").modal("hide");
       $("#modalHistorialFormulario").modal("show");
    }); 
   
   var editarDiv=$("#formAnexoFormularioCovid");
   
   editarDiv.find("#inputFechaInicioAislamientoCovid").val(convertirFechaInput(anexoFormularioCovidObj.fechaInicioAislamiento));
   editarDiv.find("#inputFechaUltimoDiaLaboradoCovid").val(convertirFechaInput(anexoFormularioCovidObj.fechaUltimoDiaLaboral));
   editarDiv.find("#textAreaDetalleUltimoPeriodo").val(anexoFormularioCovidObj.detalleUltimoPeriodo);    
 
 
}

function guardarAnexoFormularioCovid(idFormulario,trabajadorId){
    
   $("#modalAnexoFormularioCovid").modal("hide");

   var textDiv = "#formAnexoFormularioCovid";
    
   var formDiv=$(textDiv);
   
   var campoVacio = true; 
   
   var valListIdentificarSintoma = parseInt(formDiv.find("#selIdentificarSintoma").val());
   var valListTiempoEstimado = parseInt(formDiv.find("#selTiempoEstimado").val());
   
   var fechaInicioAislamiento = convertirFechaTexto($("#inputFechaInicioAislamientoCovid").val());
   var inputFechaInicioAislamiento;
   
   if(!fechaInicioAislamiento){  
      inputFechaInicioAislamiento = null;
   }else{
      inputFechaInicioAislamiento = fechaInicioAislamiento;
   }
   
   var fechaUltimoDiaLaboral = convertirFechaTexto($("#inputFechaUltimoDiaLaboradoCovid").val());
   var inputFechaUltimoDiaLaboral;
   
   if(!fechaUltimoDiaLaboral){  
      inputFechaUltimoDiaLaboral = null;
   }else{
      inputFechaUltimoDiaLaboral = fechaUltimoDiaLaboral;
   }
    
   var detalleUltimoPeriodo = formDiv.find("#textAreaDetalleUltimoPeriodo").val();
   
   if(valListIdentificarSintoma == -1 || valListTiempoEstimado == -1 || inputFechaInicioAislamiento == null ||
      inputFechaUltimoDiaLaboral == null || detalleUltimoPeriodo.length == 0){
      campoVacio = false;
   }
   
   if(campoVacio){
       var dataParam = {
 	       id:idFormulario,
 	       identificarSintoma:{id:valListIdentificarSintoma},
 	       tiempoEstimado:{id:valListTiempoEstimado},
 	       fechaInicioAislamiento:inputFechaInicioAislamiento,
 	       fechaUltimoDiaLaboral:inputFechaUltimoDiaLaboral,
 	       detalleUltimoPeriodo: detalleUltimoPeriodo
       		      }
     
       callAjaxPost(URL+"/covid/formulario_covid/save",dataParam,function(data){
       
          mensajeUx="<p align='center'>El anexo del formulario renovable del trabajador se guardó con éxito.</p>";

          mensajesUx(mensajeUx,1,"","MensajeConfirmacionAnexoForCov");  
 	  
          $("#modalMensajeUxMensajeConfirmacionAnexoForCov").on("hidden.bs.modal",function(){
             $("#modalHistorialFormulario").remove();
             $("#modalAnexoFormularioCovid").remove();
             verHistorialFormularioCovid(trabajadorId);
          }); 
       });
   }else{
      mensajeUx="Debe ingresar la información respectiva en todos los campos.";
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposAnexoForCov");
        
      $("#modalMensajeUxAvisoCompletarCamposAnexoForCov").on("hidden.bs.modal",function(){
         $("#modalAnexoFormularioCovid").modal("show");
      });
   } 
}

function verHistorialObservacionMedica(trabajadorId){ 
   var dataParam={
      trabajadorId: trabajadorId,
      empresaId: getSession("gestopcompanyid")
   };
   
   callAjaxPost(URL+"/covid/observacion_medica/historial",dataParam,function(data){
      var listFullObservaciones = data.list;
		
      var contenido ="";
		
      var modalOptions={
         maxWidth:"90%",id:"modalHistorialObservacionMedica",
         nombre:"<i class='fa fa-eye'></i> Historial observación médica",
         contenido: 
            "<div class='wrapper' id='wrapperHistorialObsMedica'>" +
               "<table id='tableHistorialObsMedica' class='table table-striped table-bordered table-hover table-fixed'>" +
	          "<thead>" +
		     "<tr>" +
		        "<th class='tb-acc' rowspan='2' style='width:80px'>N°</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:200px'>Fecha y hora</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:300px'>Indicaciones al trabajador</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:300px'>Comentario médico del trabajador</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:300px'>Comentario del entorno familiar</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:300px'>Contactos directos o estrechos con compañeros de trabajo</td>" +
		        "<th class='tb-acc' colspan='7' style='width:1500px'>Prueba COVID-19</th>" +
		        "<th class='tb-acc' rowspan='2' style='width:190px'>Estado del trabajador</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:190px'>Resultado de observación</td>" +
		        "<th class='tb-acc' rowspan='2' style='width:150px'>Registrado por</td>" +
		     "</tr>" +
		     "<tr>" +
	                "<th class='tb-acc' style='width:200px'>¿Se realizó la prueba?</th>" +
	                "<th class='tb-acc' style='width:200px'>Fecha de la prueba</th>" +
	                "<th class='tb-acc' style='width:200px'>Fecha del resultado</th>" +
	                "<th class='tb-acc' style='width:200px'>Tipo de prueba</th>" +
		        "<th class='tb-acc' style='width:200px'>Resultado de la prueba</th>" +
		        "<th class='tb-acc' style='width:300px'>Comentario de la prueba</th>" +
		        "<th class='tb-acc' style='width:200px'>Lugar de prueba</th>" +
                     "</tr>" +
	          "</thead>" +
	          "<tbody></tbody>" +
	       "</table>" +
	    "</div>"};
		
      crearModalPrincipalUsuario(modalOptions,function(){},false,true);

      listFullObservaciones.forEach(function(val,index){
         $("#tableHistorialObsMedica tbody").append(
            "<tr>" +
               "<td>"+(index+1)+"</td>" +
               "<td>"+val.fechaTexto+"</td>" +
               "<td>"+val.indicaciones+"</td>" +
               "<td>"+val.comentario+"</td>" +
               "<td>"+val.comentarioEntornoFamiliar+"</td>" +
               "<td>"+(val.reportaContactoDirectoEstrecho.length == 0?"------":
        	       val.reportaContactoDirectoEstrecho)+"</td>" +
               "<td>"+(val.resultadoPruebaCovid.id == -1?"No":"Sí")+"</td>" +
               "<td>"+val.fechaPruebaTexto+"</td>" +
               "<td>"+val.fechaResultadoTexto+"</td>" +
               "<td>"+val.tipoPruebaCovid.nombre+"</td>" +
               "<td>"+val.resultadoPruebaCovid.nombre+"</td>" +
               "<td>"+val.comentarioPrueba+"</td>" +
               "<td>"+val.lugarPrueba+"</td>" +
               "<td>"+val.estadoMedicoCovid.nombre+"</td>" +
               "<td>"+val.tipoConfirmacionCovid.nombre+"</td>" +
               "<td>"+val.usuario.nombre+"</td>" +
            "</tr>");
      });
		
      resizeDivWrapper("wrapperHistorialObsMedica",200);
      goheadfixedY("#tableHistorialObsMedica","#wrapperHistorialObsMedica");	
   });
}

var registroTrabajadorIdVistaMedCov;
var declaracionJurada;

function editarAntecedenteMedicoVistaMedCov(){ 
   registroTrabajadorIdVistaMedCov = objTrabajadorCovidRevisar.trabajadorId; 
   
   var dataParam={
      trabajadorId: objTrabajadorCovidRevisar.trabajadorId,
      empresaId: getSession("gestopcompanyid")
   };

   callAjaxPost(URL+'/covid/antecedente_covid',dataParam,function(data){
      switch(data.CODE_RESPONSE){
	 case "05":
	    var listAntecedenteCovid=data.listAntecedenteCovid;
	    listEnfermedad=data.listEnfermedad;
	    listRespuestaSimple=data.listRespuestaSimple;
	    listTrimestreEmbarazo=data.listTrimestreEmbarazo;
	    listNumeroConviviente=data.listNumeroConviviente;
	    fechaNacimiento = data.trabajadorCovid.fechaNacimientoTexto;
	    edad = data.trabajadorCovid.edad;
	       
	    if(parseInt(getSession("gestopcompanyid")) == 616){
	       declaracionJurada = 
		  "Todos los datos expresados en este formulario constituye una DECLARACIÓN JURADA de mi parte. <br>" +
		  "He sido informado que, de omitir o falsificar información, puedo perjudicar mi salud y la de mis " +
		  "compañeros, lo cual puede constituir una falta grave a la salud pública, por lo cual asumo las consecuencias.";
	    }else{
	       declaracionJurada = 
		  "Todos los datos expresados en esta ficha constituye una declaración jurada de mi parte. <br>" +
		  "He sido informado que, de omitir o falsear información, puedo perjudicar la salud de mis compañeros, " +
		  "y la mía propia, lo cual, de constituir una falta grave a la salud pública, asumo sus consecuencias."; 
	    }
	           
	    if(listAntecedenteCovid == ''){
	       objAntecedenteCovid={
	          id:0,respuestaUno:{id:""},respuestaDos:{id:""},respuestaCuatro:{id:""},
		  listEnfermedadesId:""};
		
	       rellenarAntecedenteCovid(2);
	    }else{
	       listAntecedenteCovid.forEach(function(val,index){
	          objAntecedenteCovid=listAntecedenteCovid[index];
	          rellenarAntecedenteCovid(2);
	       });
	    }
	    
	    break;
	  	     		
	 default:
	    alert("nop");
	    break;
      }
   });
}

var preguntaDos,preguntaTres,preguntaCuatro,preguntaCinco;

function rellenarFormularioCovidVistaMedCov(){
   //objTrabajadorCovidRevisar.ultimoAntecedente.id != 0 -> (removido temporalmente)
   if(objTrabajadorCovidRevisar.hasAccesoCovid== 1){
    
      registroTrabajadorIdVistaMedCov = objTrabajadorCovidRevisar.trabajadorId;
    
      var dataParam={
 	 trabajadorId: objTrabajadorCovidRevisar.trabajadorId,
 	 empresaId: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/covid/formulario_covid',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":
 	       listSintoma = data.listSintoma;
 	       listModalidadTrabajo = data.listModalidadTrabajo;
 	       
 	       if(parseInt(getSession("gestopcompanyid")) == 648 || parseInt(getSession("gestopcompanyid")) != 649){
 		  listTipoPruebaCovidAux = data.listTipoPruebaCovid;
 		  listResultadoPruebaCovidAux = data.listResultadoPruebaCovid;
 	       }
 	       
 	       if(parseInt(getSession("gestopcompanyid")) == 616){
 		  preguntaDos = 
 	             "2.- En los últimos 14 días, ¿ha tenido contacto con un caso confirmado de COVID-19?";
 		      
 		  preguntaTres = 
 	             "3.- En los últimos 14 días, ¿usted ha participado en algún evento masivo?";
 		      
 		  preguntaCuatro = 
 	             "4.- En los últimos 14 días, ¿usted ha viajado a nivel nacional o internacional donde " +
 	             "<span style='color:blue;font-weight:bold;'>NO se hayan cumplido con las medidas de " +
 	             "bioseguridad?</span>";
 		      
 		  preguntaCinco = 
 	             "¿Cuál es su modalidad de estudios?";
 		      
 		  declaracionJurada =
 		     "Todos los datos expresados en este formulario constituye una DECLARACIÓN JURADA de mi parte. <br>" +
 		     "He sido informado que, de omitir o falsificar información, puedo perjudicar mi salud y la de mis " +
 		     "compañeros, lo cual puede constituir una falta grave a la salud pública, por lo cual asumo las consecuencias.";
 	       }else{
 		  preguntaDos = 
 		     "2.- En los últimos 14 días, ¿ha tenido contacto con un caso confirmado " +
 		     "de COVID-19 <span style='color:blue;font-weight:bold;'>que NO haya comunicado a su jefe inmediato?</span>";
 		      
 		  preguntaTres = 
 		     "3.- En los últimos 14 días, ¿usted trabajó o asistió a un centro médico donde se atendieron a pacientes " +
 		     "confirmados o sospechosos de infección por COVID-19 <span style='color:blue;font-weight:bold;'>que NO haya " +
 		     "comunicado a su jefe inmediato?</span>";
 		      
 		  preguntaCuatro = 
 	             "4.- Durante los últimos 14 días, ¿usted ha viajado a nivel nacional o internacional donde NO se " +
 	             "hayan cumplido con las medidas de bioseguridad?";
 		      
 		  preguntaCinco = 
 		     "Modalidad de trabajo actual";
 		      
 		  declaracionJurada =
 	             "Todos los datos expresados en esta ficha constituye una declaración jurada de mi parte. <br>" +
 	             "He sido informado que, de omitir o falsear información, puedo perjudicar la salud de mis compañeros, " +
 	             "y la mía propia, lo cual, de constituir una falta grave a la salud pública, asumo sus consecuencias.";
 	       }
 	 	
 	       rellenarFormularioCovid(2);
 	       break;
 	  	     
 	    default:
 	       alert("nop");
 	       break;
         }
      });
   }else{
//    if(objTrabajadorCovidRevisar.hasAccesoCovid == 0){    
	 mensajeUx="<p>No puede agregar un formulario renovable en esta sección debido a que el trabajador " +
	 	      "tiene un caso abierto.</p>";
//    }else{
//       mensajeUx="<p>Opción no disponible. Debe completar primero el antecedente del trabajador.</p>"; 
//    }
      
      mensajesUx(mensajeUx,2,"");    
   }      
}

function asignarResponsableVistaMedCov(lugarDeAcceso,pindex){
   
   if(lugarDeAcceso == 2){
      objTrabajadorCovidRevisar=listFullConsolidadoResumenCovid[pindex]; //en consolidado_resumen_covid.js
   }
    
   $("#modalMedicoResponsableVistaMedicoCovid").remove(); 
    
   var dataParam={
 	   empresaId:getSession("gestopcompanyid"),
 	   idCompany:getSession("gestopcompanyid")
 		 }; 
 		
   callAjaxPost(URL + '/covid/asignar/responsable_medico_covid',dataParam,function(data){
      var listAccesoMedicoCovid= data.listAccesoMedicoCovid;
      
      var contenido = "";
 				
      var listContenido=[
 	      {sugerencia:"",label:"Médico Responsable - COVID-19",inputForm:"",divContainer:"divMedicoResponsableVistaMedCov"},
 	      {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarAsignarMedicoResponsableVistaMedCov()'><i class='fa fa-times'></i>Cancelar</button>",
 	            	 inputForm:"<button id='btnAsignarMedicoResponsableVistaMedCov' style='float:right;' class='btn btn-success' type='submit'><i class='fa fa-floppy-o'></i>Guardar</button>"},
 	                ];
 				
       listContenido.forEach(function(val){
          contenido +=obtenerSubPanelModuloGeneral(val);
       });
 				
       var modalOptionsCov={id:"modalMedicoResponsableVistaMedicoCovid",nombre:"<i class='fa fa-user-md'></i>Asignar Médico responsable - COVID-19",
 		           contenido: contenido};
 				
       crearModalPrincipalUsuario(modalOptionsCov,function(){
	   
          var listAccesoMedicoCovidAd= objTrabajadorCovidRevisar.listMedicosCovidId.split(",");
	     listAccesoMedicoCovid.forEach(function(val){
	        val.selected= 0;
		listAccesoMedicoCovidAd.forEach(function(val1){
		   if(parseInt(val1) == val.userId){
	              val.selected= 1;
		   }
		});
	     });
	         
          crearSelectOneMenuObligMultipleCompleto("selMulMedicoResponsableVistaMedicoCovid","",listAccesoMedicoCovid,"userId",
         	    "nombrePersonal","#divMedicoResponsableVistaMedCov","Todos");
       },false); 
 				
       $("#btnAsignarMedicoResponsableVistaMedCov").on("click",function(){
          guardarResponsableVistaMedCov(lugarDeAcceso);
       });
 				
       $("#modalMedicoResponsableVistaMedicoCovid").modal("show");
    });    
}

function ocultarAsignarMedicoResponsableVistaMedCov(){
   $("#modalMedicoResponsableVistaMedicoCovid").modal("hide");   
}

function guardarResponsableVistaMedCov(lugarDeAcceso){
    var campoVacio = true;

    var listMed= $("#selMulMedicoResponsableVistaMedicoCovid").val();
    var listMedicosCovidAd= [];
    if(listMed != null){
       listMed.forEach(function(val,index){
	   listMedicosCovidAd.push(
	       {userId: parseInt(val)})
       });
    }
    
    if(campoVacio){
        var dataParam = {
        	trabajadorId: objTrabajadorCovidRevisar.trabajadorId,
    		listMedicosCovid: listMedicosCovidAd,
    		empresaId: getSession("gestopcompanyid")
    };
        
    callAjaxPost(URL + '/covid/asignar/responsable_medico_covid/save', dataParam,
       function(data){
    	  switch(data.CODE_RESPONSE){
    	     case "05":	    
    		$("#modalMedicoResponsableVistaMedicoCovid").modal("hide");
    		mensajeUx="Los usuarios fueron asignados con éxitos";
    		mensajesUx(mensajeUx,1,"","MensajeVistaMedCov");
    		
    		if(lugarDeAcceso == 1){ // 1 -> desde el registro del trabajador || 2 -> desde el consolidado resumen trabajador COVID-19
  		   $("#modalMensajeUxMensajeVistaMedCov").on("hidden.bs.modal",function(){
  		       numModificaciones++;
		        verLateralesFijosMedicoCovid(habilitarTrabajadoresMedicoCovid);
		      });
    		}else{  
  		   $("#modalMensajeUxMensajeVistaMedCov").on("hidden.bs.modal",function(){
  		      $("#divConsolidadoResumenCovidTabla").remove();
  		      verTablaConsolidadoResumenCovid()
  		   }); 
    		}
    	        break;
    	        
    	     default:
    	        console.log("Ocurrió un error al guardar la ficha química!");
    	  }
    	});	
    }	
}

function verBitacoraContactoVistaMedCov(){
   var dataParam={
 	    empresaId:getSession("gestopcompanyid"),
 	    trabajadorId:objTrabajadorCovidRevisar.trabajadorId,
 	    esHistorial:1
                 };
    
   callAjaxPost(URL+"/covid/bitacora_contacto_covid",dataParam,function(data){
      var listBitacoraContactoCovid = data.listBitacoraContactoCovid;
 		
      var contenido ="";
 		
      var modalOptions= {
	       maxWidth:"90%",id:"modalBitacoraContactoMedCov",
	       nombre:"<i class='fa fa-address-book-o'></i> Bitácora contacto - trabajador "+objTrabajadorCovidRevisar.nombre,
 	       contenido:"<div class='wrapper' id='wrapperBitacoraContactoMedCov'>" +
 		 	    "<table id='tableBitacoraContactoMedCov' class='table table-striped table-bordered table-hover table-fixed'>" +
 			       "<thead>" +
 				  "<tr>" +
 				     "<td class='tb-acc' style='width:80px'>N°</td>" +
 				     "<td class='tb-acc' style='width:200px'>Fecha y hora de registro</td>" +
 				     "<td class='tb-acc' style='width:200px'>Fecha de la bitácora</td>" +
 				     "<td class='tb-acc' style='width:250px'>Tipo de contacto</td>" +
 				     "<td class='tb-acc' style='width:300px'>Nombre</td>" +
 				     "<td class='tb-acc' style='width:450px'>Detalle</th>" +
 				  "</tr>" +
 			       "</thead>" +
 			       "<tbody></tbody>" +
 			    "</table>" +
 		         "</div>"
 			};
 		
       crearModalPrincipalUsuario(modalOptions,function(){},false,true);

       listBitacoraContactoCovid.forEach(function(val,index){
          $("#tableBitacoraContactoMedCov tbody")
          .append("<tr>" +
 		     "<td>"+(index+1)+"</td>" +
 		     "<td>"+val.fechaRegistroActualizacionTexto+"</td>" +
 		     "<td>"+val.fechaBitacoraTexto+"</td>" +
 		     "<td>"+val.bitConDetalle.tipoPersonaContacto.nombre+"</td>" +
 		     "<td style='word-break: break-all;'>"+val.bitConDetalle.nombre+"</td>" +
 		     "<td style='word-break: break-all;'>"+val.bitConDetalle.detalle+"</td>" +
 		  "</tr>")
       });
 		
       resizeDivWrapper("wrapperBitacoraContactoMedCov",200)
       goheadfixedY("#tableBitacoraContactoMedCov","#wrapperBitacoraContactoMedCov");	
    });
}

function ocultarEditarDeclaracionJuradaTrabVistaMedCov(){
   $("#modalEditarDeclaracionJuradaTrabMedCov").modal("hide");
}

function editarDeclaracionJuradaTrabVistaMedCov(){
   $("#modalEditarDeclaracionJuradaTrabMedCov").remove();
	    
   var listItems=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Evidencia:",
       inputForm:"",divContainer:"divEvidenciaDecJurTrabMedCov"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
                     "onclick='ocultarEditarDeclaracionJuradaTrabVistaMedCov()'>" +
	        "<i class='fa fa-times'></i> Cancelar" +
	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
                    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
                 "</button>"}
   ]; 
	    
   var textForm = "";
	 	
   listItems.forEach(function(val,index){
      textForm += obtenerSubPanelModuloVersionDos(val);
   });
	 
   var opciones={
      id: "modalEditarDeclaracionJuradaTrabMedCov",
      nombre: "<i class='fa fa-list'></i> Declaración jurada - trabajador(a) "+objTrabajadorCovidRevisar.nombre,
      contenido: "<form id='formEditarDeclaracionJuradaTrabMedCov' class='eventoGeneral'>"+textForm+"</form>"
   };
	    
   crearModalPrincipalUsuario(opciones,function(){},true,true);
   
   var optionEvidencia={
      isImage: false,
      container: "#divEvidenciaDecJurTrabMedCov",
      idAux: "DecJurTrabMedCov",
      esNuevo: (objTrabajadorCovidRevisar.evidenciaConstanciaTrabajoNombre.length == 0?true:false),
      functionCall: function(){},
      evidenciaNombre: objTrabajadorCovidRevisar.evidenciaConstanciaTrabajoNombre,	
      descargaUrl: "/covid/trabajador/evidencia_constancia_trabajo?id="+objTrabajadorCovidRevisar.trabajadorId+"",
   };
		
   crearFormEvidenciaCompleta(optionEvidencia);
    
   var editarDiv = $("#formEditarDeclaracionJuradaTrabMedCov");
	 
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarDeclaracionJuradaTrabVistaMedCov();
   });    
}

function guardarDeclaracionJuradaTrabVistaMedCov(){
   var formDiv = $("#formEditarDeclaracionJuradaTrabMedCov");
   var campoVacio = true; 
    
   var evidenciaNombre = $("#inputEviDecJurTrabMedCov").val();
    
   if(evidenciaNombre.length == 0){
      campoVacio = false;  
   }
    
   if(campoVacio){
      guardarEvidenciaAuto(objTrabajadorCovidRevisar.trabajadorId,"fileEviDecJurTrabMedCov",
      bitsMega*15,"/covid/trabajador/evidencia_constancia_trabajo/save",function(){
         $("#modalEditarDeclaracionJuradaTrabMedCov").modal("hide");
  		    
         mensajeUx="<label>La declaración jurada asociada a trabajador(a) "+
   	            objTrabajadorCovidRevisar.nombre+" fue actualizada con éxito.</label>";
         mensajesUx(mensajeUx,1,"","MensajeVistaMedCov");
  		    
         $("#modalMensajeUxMensajeVistaMedCov").on("hidden.bs.modal",function(){
            numModificaciones++;
            verLateralesFijosMedicoCovid(habilitarTrabajadoresMedicoCovid);    
         });
      }); 	    
   }else{
      $("#modalEditarDeclaracionJuradaTrabMedCov").modal("hide");
   	
      mensajeUx="<label>Debe subir la declaración jurada asociado a trabajador(a) " +
                 objTrabajadorCovidRevisar.nombre+".</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposFormDecJurTrabMedCov");

      $("#modalMensajeUxAvisoCompletarCamposFormDecJurTrabMedCov").on("hidden.bs.modal",function(){
         $("#modalEditarDeclaracionJuradaTrabMedCov").modal("show");
      });
   }
}
