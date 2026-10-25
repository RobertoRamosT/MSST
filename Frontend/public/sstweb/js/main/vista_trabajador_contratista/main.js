
var conteoInicialAntMed = 0;
var mensajeUx;

var menuDerechaTrabajadorContratista=[
        {id:1,icono:" fa-user-circle",ident:"icoPerfil",onclick:"marcarIconoModuloSeleccionadoTrabajadorContratista(10)",titulo:"Perfil",adicional:""}
                                     ];

var menuFuncionesIzquierdaTrabajadorContratista =[];
var objPrincipalTrabContInfo = {};
var hashTrabAltoRieTrabContDirecto = new Map();

function verLateralesFijosTrabajadorContratista(){
   $("#menuPrincipal")
      .html("Bienvenido a la plataforma de <u>"+getSession("empresaNombre")+"</u> para Personal Externo")
      .css({"color":"white","margin-top": "15px"});
	
   $(".navbar").css({"min-height": "58px","margin-bottom": "0px","top":"0px"});
	
   var logo=$("#logoMenu");
   logo
      .css({ "margin-top":"-18px"})
      .attr("onclick","volverMenuInicio()");
	
   $("#barraMenu")
      .css({"position": "fixed",
            "width": "100%"});
	
   $("#barraMenu").find(".navbar-right").html("<ul></ul> ");
	
   menuDerechaTrabajadorContratista.forEach(function(val,index){
      var claseSub="class='iconoLink dropdown-toggle' data-toggle='dropdown'";
	     
      if(val.ident!="icoPerfil"){
         claseSub="class='iconoLink'";	
      }else{
         val.adicional = getSession("gestopusername").substr(0,12)+".";
         val.onclick="";
      }
		
      $("#barraMenu").find(".navbar-right")
      .append("<li id='"+val.ident+"' title='"+val.titulo+"'>" +
	         "<a onclick='"+val.onclick+"' "+claseSub+">"+
		    "<i class='fa "+val.icono+" fa-2x' aria-hidden='true'>"+"</i>"+
		     val.adicional+
	         "</a>" +
	      "</li>");
   });
	
   $("#icoPerfil")
   .append("<ul class='dropdown-menu' style='color :white'>" +
              "<li onclick='marcarIconoModuloSeleccionadoTrabajadorContratista(0)'>" +
                 "<a><i class='fa fa-user-o' aria-hidden='true'></i> Perfil</a>" +
	      "</li>" +
	      "<li class='dropdown-divider' role='presentation'></li>" +
	      "<li onclick='cerrarSesion()'>" +
	         "<a><i class='fa fa-power-off' aria-hidden='true'></i> Salir</a>" +
	      "</li>" +
           "</ul>" +
	   "</div>");
	
   $("body").find("table").remove();
   $("body").find("#divCompletarActividad").remove();
   $("body").find("h4").remove();
   $("body").find(".divTituloFull").remove();
   $("body").find(".divContainerGeneral").remove();
   
   $("body")
   .append("<div class='divTituloFull'>" +
   	      "<div class='divTituloGeneral'><h4>Mis Actividades SST</h4></div>" +
           "</div>" +
           "<div class='divContainerGeneral'>" +
              "<div class='divListModulos'>" +
                 "<ul class='list-group'></ul>" +
              "</div>" +
              "<div class='divListPrincipal'></div>" +
	      "<div class='divListSecundaria' style='display:none'>" +
	         "<div id='divObjetivos' style='height:120px'>" +
	            "<div class='subDivTitulo'>Objetivos </div>" +
	               "<div class='subDivContenido'></div>" +
		    "</div>" +
	         "<div id='divNoticiaDiaria' style='height:250px'>" +
		 "<div class='subDivTitulo'>Noticia del día</div>" +
	         "<div class='subDivContenido'></div>" +
	      "</div>" +
	      "<div id='divPiramide'>" +
	         "<div class='subDivTitulo'>Accidentabilidad</div>" +
		    "<div class='subDivContenido'></div>" +
		 "</div>" +
	      "</div>"+
	   "</div>");
	
    var dataParamAux = {snConsultaTrabAltRie:1};
   
    callAjaxPost(URL+'/contratista/trabajador_contratista/info',dataParamAux,function(data){
        menuFuncionesIzquierdaTrabajadorContratista = data.secciones;objPrincipalTrabContInfo = data.trabajador;

        if(objPrincipalTrabContInfo.hasTrabAltRiePerfilContActivado == 1 && objPrincipalTrabContInfo.trabajosAltoRiesgoChtAsociadosId.length != 0){
            var trabajosAltoRiesgoChtAsociadosIdAux = objPrincipalTrabContInfo.trabajosAltoRiesgoChtAsociadosId.split(",");

            trabajosAltoRiesgoChtAsociadosIdAux.forEach(function(val){
                hashTrabAltoRieTrabContDirecto.set(parseInt(val),1);
            });
        }

        $("#menuFigureti").html("<ul class='list-group'></ul>");
      
      menuFuncionesIzquierdaTrabajadorContratista.forEach(function(val,index){
         var textOpcionMenu = 
            "<li class='list-group-item' id='liMenuTrabajador"+val.id+"' " +
                "onclick='marcarIconoModuloSeleccionadoTrabajadorContratista("+val.id+")'>" +
	       "<i class='fa "+val.icono+"' style='width:16px;' aria-hidden='true'>" +
	          "<span></span>" +
	       "</i>"+val.nombre +
	        (val.numAlerta > 0?"<div class='alertaMenu'>"+val.numAlerta+"</div>":"") +
	    "</li>";
         
         $(".divListModulos").find("ul").append(textOpcionMenu);
         $("#menuFigureti").find("ul").append(textOpcionMenu);
         
         if(val.id == 5){
            $(".divListModulos #liMenuTrabajador"+val.id).append("<i class='fa fa-plus-circle'></i>");
            $("#menuFigureti #liMenuTrabajador"+val.id).append("<i class='fa fa-plus-circle'></i>");

            if(getSession("gestopcompanyid") != 647){
               $(".divListModulos #liMenuTrabajador"+val.id).addClass("subMenuImportant").show();
               $("#menuFigureti #liMenuTrabajador"+val.id).addClass("subMenuImportant").show();
            }
         }
 				
         if(val.seccionPadreId > 0){
            $(".divListModulos #liMenuTrabajador"+val.id).remove();
            $("#menuFigureti #liMenuTrabajador"+val.id).remove();

            $(".divListModulos #liMenuTrabajador"+val.seccionPadreId).after(textOpcionMenu);
            $("#menuFigureti #liMenuTrabajador"+val.seccionPadreId).after(textOpcionMenu);

            $(".divListModulos #liMenuTrabajador"+val.id).addClass("subMenu").hide();
            $("#menuFigureti #liMenuTrabajador"+val.id).addClass("subMenu").hide();
         }
      }); 
      	
      $("#menuMovilGosst").on("click",function(){
         $(".divContainerGeneral").toggle();
      });
      
      marcarIconoModuloSeleccionadoTrabajadorContratista(1);

      // P118: aviso sobre la revisión de su documentación con IA (aviso_ia.js).
      if (typeof revisarAvisoIaTrabajador === "function") {
         revisarAvisoIaTrabajador();
      }
   });
}

function marcarIconoModuloSeleccionadoTrabajadorContratista(menuId){
   //$("#menuExplicativo").hide();
   $(".divContainerGeneral").show();
   $(".divListModulos").find("li").removeClass("activeMenu");
//   $(".divListPrincipal").html("");
   $(".gosst-aviso").remove();
	
   //var menuObject=menuFuncionesIzquierdaTrabajador[menuIndex];
   
//   $(document).scrollTop(0);
   var menuObject=[];
	
   menuFuncionesIzquierdaTrabajadorContratista.forEach(function(val){
      if(val.id == parseInt(menuId)){
	 menuObject=val;
      }
   });
   
   switch(menuObject.id){
      case 5:
          break;
          
      default:
    	  $(document).scrollTop(0);
	  $("#menuExplicativo").hide();
	  $(".divListPrincipal").html("");
	  $(".divTituloFull").find("h4").html(menuObject.nombre)
          break;
   }
   
   //$(".divListModulos #"+menuObject.ident).addClass("activeMenu");
   $(".divListModulos #liMenuTrabajador"+menuObject.id).addClass("activeMenu");
   $(".divTituloFull").find("h4").html(menuObject.nombre);
	   
   switch(menuObject.id){
      case 1:
	  habilitarPerfilTrabajadorContratista();
	  break;
	  
      case 9:
	  consultaEstadoAccesoTrabajadorContratista();
	  break;
	  
      case 2:
	  habilitarInduccionesTrabajadorContratista();
	  break;
	  
      case 5:		     
	  menuFuncionesIzquierdaTrabajadorContratista.forEach(function(val){
	     if(val.seccionPadreId == menuObject.id){
		$(".divListModulos #liMenuTrabajador"+val.id).toggle();
		$("#menuFigureti #liMenuTrabajador"+val.id).toggle();
	     }					
	  });
	  break;
	  
      case 6:
	  habilitarDocumentoGrupoRiesgoCovidTrabContratista();
	  break;
	  
      case 7:
	  habilitarDocumentoPruebaCovidTrabContratista();
	  break;
	  
      case 8:
	  habilitarDocumentoFichaSintomalogicaCovidTrabContratista();
	  break;
   }
   completarBarraCarga();
}

